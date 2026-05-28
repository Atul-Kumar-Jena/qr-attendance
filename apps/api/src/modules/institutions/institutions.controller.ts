import { Router } from 'express';
import { z } from 'zod';
import argon2 from 'argon2';
import { prisma } from '../../config/db.js';
import { requireAuth, requireDeveloper, requireMinRole } from '../../middleware/auth.js';
import { recordAudit } from '../audit/audit.service.js';

export const institutionsRouter = Router();

const createSchema = z.object({
  code:     z.string().min(2).max(16).regex(/^[A-Z0-9_]+$/),
  name:     z.string().min(2).max(120),
  slug:     z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  logoUrl:  z.string().url().optional(),
  // Primary institution-role user created alongside
  ownerEmail:    z.string().email(),
  ownerName:     z.string().min(2),
  ownerPassword: z.string().min(8),
});

const updateSchema = z.object({
  name:            z.string().min(2).max(120).optional(),
  logoUrl:         z.string().url().nullable().optional(),
  geofenceLat:     z.number().optional(),
  geofenceLng:     z.number().optional(),
  geofenceM:       z.number().int().min(10).optional(),
  qrRotationSec:   z.number().int().min(3).max(60).optional(),
  qrWindowMin:     z.number().int().min(1).optional(),
  lateAfterMin:    z.number().int().min(0).optional(),
  minAttendancePct:z.number().int().min(0).max(100).optional(),
});

// DEVELOPER — list all institutions
institutionsRouter.get('/', requireAuth, requireDeveloper, async (_req, res, next) => {
  try {
    const list = await prisma.institution.findMany({
      select: { id: true, code: true, name: true, slug: true, status: true, createdAt: true,
                _count: { select: { users: true, students: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(list);
  } catch (e) { next(e); }
});

// DEVELOPER — create institution + its owner account
institutionsRouter.post('/', requireAuth, requireDeveloper, async (req, res, next) => {
  try {
    const b = createSchema.parse(req.body);
    const hash = await argon2.hash(b.ownerPassword);
    const inst = await prisma.$transaction(async (tx) => {
      const institution = await tx.institution.create({
        data: { code: b.code, name: b.name, slug: b.slug, logoUrl: b.logoUrl, status: 'ACTIVE' },
      });
      await tx.user.create({
        data: {
          institutionId: institution.id,
          email: b.ownerEmail,
          fullName: b.ownerName,
          passwordHash: hash,
          role: 'INSTITUTION',
        },
      });
      return institution;
    });
    await recordAudit({
      institutionId: inst.id, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'INSTITUTION_CREATED', targetType: 'Institution', targetId: inst.id,
      ip: req.ip, userAgent: req.header('user-agent') ?? undefined,
    });
    res.status(201).json(inst);
  } catch (e) { next(e); }
});

// DEVELOPER | INSTITUTION — view single institution
institutionsRouter.get('/:id', requireAuth, requireMinRole('INSTITUTION'), async (req, res, next) => {
  try {
    const inst = await prisma.institution.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { users: true, students: true, sessions: true } } },
    });
    if (!inst) return res.status(404).json({ error: 'NOT_FOUND' });
    // INSTITUTION role can only view their own
    if (req.user!.role !== 'DEVELOPER' && inst.id !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    res.json(inst);
  } catch (e) { next(e); }
});

// DEVELOPER | INSTITUTION — update settings
institutionsRouter.put('/:id', requireAuth, requireMinRole('INSTITUTION'), async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const inst = await prisma.institution.findUnique({ where: { id: req.params.id } });
    if (!inst) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && inst.id !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    const updated = await prisma.institution.update({ where: { id: req.params.id }, data });
    await recordAudit({
      institutionId: inst.id, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'INSTITUTION_UPDATED', targetType: 'Institution', targetId: inst.id,
      metadata: data, ip: req.ip,
    });
    res.json(updated);
  } catch (e) { next(e); }
});

// DEVELOPER — change institution status
institutionsRouter.patch('/:id/status', requireAuth, requireDeveloper, async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED']) }).parse(req.body);
    const updated = await prisma.institution.update({
      where: { id: req.params.id }, data: { status },
    });
    await recordAudit({
      institutionId: updated.id, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'INSTITUTION_STATUS_CHANGED', targetType: 'Institution', targetId: updated.id,
      metadata: { status }, ip: req.ip,
    });
    res.json(updated);
  } catch (e) { next(e); }
});
