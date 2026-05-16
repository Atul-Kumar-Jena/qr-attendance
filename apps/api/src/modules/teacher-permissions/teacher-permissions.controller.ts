import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAuth, requireMinRole } from '../../middleware/auth.js';
import { recordAudit } from '../audit/audit.service.js';

export const teacherPermsRouter = Router();

const permSchema = z.object({
  canCreateSessions:    z.boolean().optional(),
  canEndSessions:       z.boolean().optional(),
  canViewAllAttendance: z.boolean().optional(),
  canManageStudents:    z.boolean().optional(),
  canExportReports:     z.boolean().optional(),
  canViewAuditLog:      z.boolean().optional(),
  canManageClasses:     z.boolean().optional(),
});

// ADMIN+ — list all teacher permissions in the institution
teacherPermsRouter.get('/', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const instId = req.user!.role === 'DEVELOPER' ? undefined : req.user!.inst;
    const perms = await prisma.teacherPermission.findMany({
      where: instId ? { institutionId: instId } : undefined,
      include: { teacher: { select: { id: true, fullName: true, email: true } } },
    });
    res.json(perms);
  } catch (e) { next(e); }
});

// ADMIN+ | TEACHER (self) — get single teacher's permissions
teacherPermsRouter.get('/:teacherId', requireAuth, requireMinRole('TEACHER'), async (req, res, next) => {
  try {
    // Teachers can only view their own permissions
    if (req.user!.role === 'TEACHER' && req.user!.sub !== req.params.teacherId) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    const perm = await prisma.teacherPermission.findUnique({
      where: { teacherId: req.params.teacherId },
      include: { teacher: { select: { id: true, fullName: true, email: true } } },
    });
    if (!perm) return res.status(404).json({ error: 'NOT_FOUND' });
    // Scope check
    if (req.user!.role !== 'DEVELOPER' && perm.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    res.json(perm);
  } catch (e) { next(e); }
});

// ADMIN+ — create or update teacher permissions
teacherPermsRouter.put('/:teacherId', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const data = permSchema.parse(req.body);
    // Verify the target is a TEACHER in the same institution
    const teacher = await prisma.user.findUnique({ where: { id: req.params.teacherId } });
    if (!teacher || teacher.role !== 'TEACHER') {
      return res.status(400).json({ error: 'TARGET_NOT_TEACHER' });
    }
    if (req.user!.role !== 'DEVELOPER' && teacher.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    const perm = await prisma.teacherPermission.upsert({
      where: { teacherId: req.params.teacherId },
      create: { teacherId: req.params.teacherId, institutionId: teacher.institutionId, ...data },
      update: data,
    });
    await recordAudit({
      institutionId: teacher.institutionId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'TEACHER_PERMISSIONS_UPDATED', targetType: 'User', targetId: req.params.teacherId,
      metadata: data, ip: req.ip,
    });
    res.json(perm);
  } catch (e) { next(e); }
});
