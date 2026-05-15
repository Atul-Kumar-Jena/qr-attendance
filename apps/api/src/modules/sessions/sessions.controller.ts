import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { writeLimiter } from '../../middleware/rateLimit.js';
import { recordAudit } from '../audit/audit.service.js';

export const sessionsRouter = Router();

const createSchema = z.object({
  classId: z.string().cuid(),
  subjectId: z.string().cuid().optional(),
  title: z.string().max(120).optional(),
  qrRotationSec: z.number().int().min(3).max(60).default(7),
  windowMin: z.number().int().min(1).max(120).default(15),
  geofence: z.object({
    lat: z.number(), lng: z.number(), radiusM: z.number().int().min(10).max(2000),
  }).optional(),
  scheduledAt: z.string().datetime().optional(),
});

sessionsRouter.post('/',
  requireAuth, requireRole('SUDO_ADMIN', 'ADMIN', 'TEACHER'), writeLimiter,
  async (req, res, next) => {
    try {
      const b = createSchema.parse(req.body);
      const session = await prisma.classSession.create({
        data: {
          institutionId: req.user!.inst,
          klassId: b.classId,
          subjectId: b.subjectId,
          teacherId: req.user!.sub,
          title: b.title,
          qrRotationSec: b.qrRotationSec,
          windowMin: b.windowMin,
          geofenceLat: b.geofence?.lat,
          geofenceLng: b.geofence?.lng,
          geofenceM: b.geofence?.radiusM,
          scheduledAt: b.scheduledAt ? new Date(b.scheduledAt) : null,
        },
      });
      await recordAudit({
        institutionId: req.user!.inst,
        actorUserId: req.user!.sub,
        actorRole: req.user!.role,
        action: 'SESSION_CREATED',
        targetType: 'session', targetId: session.id,
      });
      res.status(201).json(session);
    } catch (e) { next(e); }
  });

sessionsRouter.post('/:id/start',
  requireAuth, requireRole('SUDO_ADMIN', 'ADMIN', 'TEACHER'),
  async (req, res, next) => {
    try {
      const id = req.params.id!;
      const s = await prisma.classSession.findUnique({ where: { id } });
      if (!s || s.institutionId !== req.user!.inst) return res.status(404).json({ error: 'NOT_FOUND' });
      const updated = await prisma.classSession.update({
        where: { id }, data: { status: 'OPEN', startedAt: new Date() },
      });
      await recordAudit({
        institutionId: req.user!.inst, actorUserId: req.user!.sub, actorRole: req.user!.role,
        action: 'SESSION_STARTED', targetType: 'session', targetId: id,
      });
      res.json(updated);
    } catch (e) { next(e); }
  });

sessionsRouter.post('/:id/end',
  requireAuth, requireRole('SUDO_ADMIN', 'ADMIN', 'TEACHER'),
  async (req, res, next) => {
    try {
      const id = req.params.id!;
      const s = await prisma.classSession.findUnique({ where: { id } });
      if (!s || s.institutionId !== req.user!.inst) return res.status(404).json({ error: 'NOT_FOUND' });
      const updated = await prisma.classSession.update({
        where: { id }, data: { status: 'CLOSED', endedAt: new Date() },
      });
      await recordAudit({
        institutionId: req.user!.inst, actorUserId: req.user!.sub, actorRole: req.user!.role,
        action: 'SESSION_ENDED', targetType: 'session', targetId: id,
      });
      res.json(updated);
    } catch (e) { next(e); }
  });

sessionsRouter.get('/:id/attendance',
  requireAuth, requireRole('SUDO_ADMIN', 'ADMIN', 'TEACHER'),
  async (req, res, next) => {
    try {
      const records = await prisma.attendanceRecord.findMany({
        where: { sessionId: req.params.id, institutionId: req.user!.inst },
        include: { student: { select: { id: true, rollNo: true, fullName: true } } },
        orderBy: { markedAt: 'asc' },
      });
      res.json(records);
    } catch (e) { next(e); }
  });
