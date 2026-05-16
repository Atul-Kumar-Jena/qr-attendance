import { Router } from 'express';
import { z } from 'zod';
import argon2 from 'argon2';
import { prisma } from '../../config/db.js';
import { requireAuth, requireDeveloper, requireMinRole } from '../../middleware/auth.js';
import { recordAudit } from '../audit/audit.service.js';
import type { UserRole } from '../../utils/jwt.js';

export const usersRouter = Router();

const createUserSchema = z.object({
  institutionId: z.string().cuid(),
  email:         z.string().email(),
  fullName:      z.string().min(2),
  password:      z.string().min(8),
  role:          z.enum(['INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT']),
});

const updateUserSchema = z.object({
  fullName:  z.string().min(2).optional(),
  email:     z.string().email().optional(),
  role:      z.enum(['INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT']).optional(),
  suspended: z.boolean().optional(),
});

// DEVELOPER — list all users across all institutions
usersRouter.get('/', requireAuth, requireDeveloper, async (req, res, next) => {
  try {
    const { institutionId, role, page = '1', limit = '50' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          ...(institutionId ? { institutionId } : {}),
          ...(role ? { role: role as UserRole } : {}),
        },
        select: { id: true, fullName: true, email: true, role: true, suspended: true,
                  createdAt: true, institution: { select: { name: true, code: true } } },
        orderBy: { createdAt: 'desc' },
        skip, take: parseInt(limit),
      }),
      prisma.user.count({ where: {
        ...(institutionId ? { institutionId } : {}),
        ...(role ? { role: role as UserRole } : {}),
      }}),
    ]);
    res.json({ users, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (e) { next(e); }
});

// ADMIN+ — list users in own institution (or DEVELOPER = any)
usersRouter.get('/institution', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const instId = req.user!.role === 'DEVELOPER' ? (req.query.institutionId as string | undefined) : req.user!.inst;
    if (!instId) return res.status(400).json({ error: 'institutionId required for DEVELOPER' });
    const users = await prisma.user.findMany({
      where: { institutionId: instId },
      select: { id: true, fullName: true, email: true, role: true, suspended: true, createdAt: true,
                teacherPerm: true },
      orderBy: [{ role: 'asc' }, { fullName: 'asc' }],
    });
    res.json(users);
  } catch (e) { next(e); }
});

// DEVELOPER — create a user in any institution
usersRouter.post('/', requireAuth, requireDeveloper, async (req, res, next) => {
  try {
    const b = createUserSchema.parse(req.body);
    const hash = await argon2.hash(b.password);
    const user = await prisma.user.create({
      data: { institutionId: b.institutionId, email: b.email, fullName: b.fullName,
              passwordHash: hash, role: b.role },
    });
    await recordAudit({
      institutionId: b.institutionId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'USER_CREATED', targetType: 'User', targetId: user.id,
      metadata: { email: b.email, role: b.role }, ip: req.ip,
    });
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (e) { next(e); }
});

// DEVELOPER — get any user; ADMIN+ — get user in own institution
usersRouter.get('/:id', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { institution: { select: { name: true, code: true } }, teacherPerm: true },
    });
    if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && user.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    // Strip password hash
    const { passwordHash: _, ...safe } = user;
    res.json(safe);
  } catch (e) { next(e); }
});

// DEVELOPER — update role/status/details of any user
// ADMIN — update users in own institution (cannot elevate to DEVELOPER/INSTITUTION)
usersRouter.patch('/:id', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && target.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    // ADMIN cannot promote to DEVELOPER or INSTITUTION
    if (req.user!.role === 'ADMIN' && data.role && ['DEVELOPER', 'INSTITUTION'].includes(data.role)) {
      return res.status(403).json({ error: 'CANNOT_ELEVATE' });
    }
    const updated = await prisma.user.update({
      where: { id: req.params.id }, data,
      select: { id: true, fullName: true, email: true, role: true, suspended: true },
    });
    await recordAudit({
      institutionId: target.institutionId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'USER_UPDATED', targetType: 'User', targetId: req.params.id,
      metadata: data, ip: req.ip,
    });
    res.json(updated);
  } catch (e) { next(e); }
});

// DEVELOPER — reset user password
usersRouter.post('/:id/reset-password', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const { password } = z.object({ password: z.string().min(8) }).parse(req.body);
    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && target.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    const hash = await argon2.hash(password);
    await prisma.user.update({ where: { id: req.params.id }, data: { passwordHash: hash } });
    // Revoke all refresh tokens for the user
    await prisma.refreshToken.updateMany({ where: { userId: req.params.id }, data: { revoked: true } });
    await recordAudit({
      institutionId: target.institutionId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'USER_PASSWORD_RESET', targetType: 'User', targetId: req.params.id, ip: req.ip,
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// DEVELOPER — delete a user
usersRouter.delete('/:id', requireAuth, requireDeveloper, async (req, res, next) => {
  try {
    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'NOT_FOUND' });
    if (target.role === 'DEVELOPER') return res.status(403).json({ error: 'CANNOT_DELETE_DEVELOPER' });
    await prisma.user.delete({ where: { id: req.params.id } });
    await recordAudit({
      institutionId: target.institutionId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'USER_DELETED', targetType: 'User', targetId: req.params.id, ip: req.ip,
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
