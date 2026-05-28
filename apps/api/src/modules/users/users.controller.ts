import { Router } from 'express';
import { z } from 'zod';
import argon2 from 'argon2';
import { prisma } from '../../config/db.js';
import { requireAuth, requireDeveloper, requireMinRole, roleLevel } from '../../middleware/auth.js';
import { recordAudit } from '../audit/audit.service.js';
import type { UserRole } from '../../utils/jwt.js';

export const usersRouter = Router();

// Roles that each role level can ASSIGN to a target (must be strictly below caller's level)
function assignableRoles(callerRole: UserRole): UserRole[] {
  const all: UserRole[] = ['DEVELOPER', 'INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT'];
  return all.filter((r) => roleLevel(r) < roleLevel(callerRole));
}

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
                  createdAt: true, createdById: true,
                  institution: { select: { name: true, code: true } } },
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

// ADMIN+ — list users in own institution
usersRouter.get('/institution', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const instId = req.user!.role === 'DEVELOPER'
      ? (req.query.institutionId as string | undefined)
      : req.user!.inst;
    if (!instId) return res.status(400).json({ error: 'institutionId required for DEVELOPER' });
    const users = await prisma.user.findMany({
      where: { institutionId: instId },
      select: {
        id: true, fullName: true, email: true, role: true,
        suspended: true, createdAt: true, createdById: true,
        teacherPerm: true,
      },
      orderBy: [{ role: 'asc' }, { fullName: 'asc' }],
    });
    res.json(users);
  } catch (e) { next(e); }
});

// ADMIN+ — create a user (DEVELOPER: any institution; ADMIN: own institution, sub-admin & below only)
const createUserSchema = z.object({
  institutionId: z.string().cuid().optional(),
  email:         z.string().email(),
  fullName:      z.string().min(2),
  password:      z.string().min(8),
  role:          z.enum(['INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT']),
});

usersRouter.post('/', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const b = createUserSchema.parse(req.body);
    const instId = req.user!.role === 'DEVELOPER' ? b.institutionId : req.user!.inst;
    if (!instId) return res.status(400).json({ error: 'institutionId required' });

    // Caller can only assign roles strictly below their own level
    if (!assignableRoles(req.user!.role).includes(b.role as UserRole)) {
      return res.status(403).json({ error: 'CANNOT_ASSIGN_ROLE', allowed: assignableRoles(req.user!.role) });
    }

    const hash = await argon2.hash(b.password);
    const user = await prisma.user.create({
      data: {
        institutionId: instId,
        email: b.email,
        fullName: b.fullName,
        passwordHash: hash,
        role: b.role as UserRole,
        createdById: req.user!.sub,  // track creator for sub-admin protection
      },
    });

    // Auto-create TeacherPermission for new teachers
    if (b.role === 'TEACHER') {
      await prisma.teacherPermission.create({
        data: { teacherId: user.id, institutionId: instId },
      });
    }

    await recordAudit({
      institutionId: instId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'USER_CREATED', targetType: 'User', targetId: user.id,
      metadata: { email: b.email, role: b.role }, ip: req.ip,
    });
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (e) { next(e); }
});

// ADMIN+ — get single user
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
    const { passwordHash: _, ...safe } = user;
    res.json(safe);
  } catch (e) { next(e); }
});

// ADMIN+ — update role, suspend, or rename. Enforces full hierarchy.
const updateUserSchema = z.object({
  fullName:  z.string().min(2).optional(),
  email:     z.string().email().optional(),
  role:      z.enum(['INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT']).optional(),
  suspended: z.boolean().optional(),
});

usersRouter.patch('/:id', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'NOT_FOUND' });

    // Cross-institution scope check
    if (req.user!.role !== 'DEVELOPER' && target.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }

    // Cannot modify a user at same or higher level than yourself
    if (roleLevel(target.role) >= roleLevel(req.user!.role)) {
      return res.status(403).json({ error: 'CANNOT_MODIFY_EQUAL_OR_HIGHER_ROLE' });
    }

    // Creator protection: you cannot demote/suspend the user who created you
    if (target.id === req.user!.sub) {
      return res.status(400).json({ error: 'CANNOT_MODIFY_SELF' });
    }
    const caller = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (caller?.createdById === target.id) {
      return res.status(403).json({ error: 'CANNOT_MODIFY_YOUR_CREATOR' });
    }

    // Role assignment: can only assign roles below your own
    if (data.role && !assignableRoles(req.user!.role).includes(data.role as UserRole)) {
      return res.status(403).json({ error: 'CANNOT_ASSIGN_ROLE', allowed: assignableRoles(req.user!.role) });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id }, data,
      select: { id: true, fullName: true, email: true, role: true, suspended: true },
    });

    // Auto-create TeacherPermission if promoted to TEACHER
    if (data.role === 'TEACHER') {
      await prisma.teacherPermission.upsert({
        where: { teacherId: req.params.id },
        create: { teacherId: req.params.id, institutionId: target.institutionId },
        update: {},
      });
    }

    await recordAudit({
      institutionId: target.institutionId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'USER_UPDATED', targetType: 'User', targetId: req.params.id,
      metadata: data, ip: req.ip,
    });
    res.json(updated);
  } catch (e) { next(e); }
});

// ADMIN+ — reset user password
usersRouter.post('/:id/reset-password', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const { password } = z.object({ password: z.string().min(8) }).parse(req.body);
    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && target.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    if (roleLevel(target.role) >= roleLevel(req.user!.role)) {
      return res.status(403).json({ error: 'CANNOT_MODIFY_EQUAL_OR_HIGHER_ROLE' });
    }
    const caller = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (caller?.createdById === target.id) {
      return res.status(403).json({ error: 'CANNOT_MODIFY_YOUR_CREATOR' });
    }
    const hash = await argon2.hash(password);
    await prisma.user.update({ where: { id: req.params.id }, data: { passwordHash: hash } });
    await prisma.refreshToken.updateMany({ where: { userId: req.params.id }, data: { revoked: true } });
    await recordAudit({
      institutionId: target.institutionId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'USER_PASSWORD_RESET', targetType: 'User', targetId: req.params.id, ip: req.ip,
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// DEVELOPER | INSTITUTION — delete user (with full hierarchy + creator checks)
usersRouter.delete('/:id', requireAuth, requireMinRole('INSTITUTION'), async (req, res, next) => {
  try {
    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && target.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    // Protect DEVELOPER accounts from deletion by anyone except other DEVELOPERs
    if (target.role === 'DEVELOPER' && req.user!.role !== 'DEVELOPER') {
      return res.status(403).json({ error: 'CANNOT_DELETE_DEVELOPER' });
    }
    if (roleLevel(target.role) >= roleLevel(req.user!.role)) {
      return res.status(403).json({ error: 'CANNOT_DELETE_EQUAL_OR_HIGHER_ROLE' });
    }
    // Creator protection: you cannot delete the user who created you
    const caller = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (caller?.createdById === target.id) {
      return res.status(403).json({ error: 'CANNOT_DELETE_YOUR_CREATOR' });
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    await recordAudit({
      institutionId: target.institutionId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'USER_DELETED', targetType: 'User', targetId: req.params.id, ip: req.ip,
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
