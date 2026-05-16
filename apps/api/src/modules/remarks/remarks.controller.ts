import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAuth, requireMinRole } from '../../middleware/auth.js';
import { recordAudit } from '../audit/audit.service.js';

export const remarksRouter = Router();

const createSchema = z.object({
  studentId: z.string().cuid(),
  sessionId: z.string().cuid().optional(),
  content:   z.string().min(1).max(2000),
  isPrivate: z.boolean().default(false),
});

const updateSchema = z.object({
  content:   z.string().min(1).max(2000).optional(),
  isPrivate: z.boolean().optional(),
});

// TEACHER+ — list remarks for a student
remarksRouter.get('/', requireAuth, requireMinRole('TEACHER'), async (req, res, next) => {
  try {
    const { studentId, sessionId } = req.query as Record<string, string | undefined>;
    const instId = req.user!.role === 'DEVELOPER' ? undefined : req.user!.inst;

    // Build base where clause
    const where: Record<string, unknown> = {};
    if (instId) where.institutionId = instId;
    if (studentId) where.studentId = studentId;
    if (sessionId) where.sessionId = sessionId;

    // Teachers only see their own remarks unless admin+
    if (req.user!.role === 'TEACHER') {
      where.teacherId = req.user!.sub;
    }

    // Check teacher has permission to add remarks
    if (req.user!.role === 'TEACHER') {
      const perm = await prisma.teacherPermission.findUnique({ where: { teacherId: req.user!.sub } });
      if (!perm?.canAddRemarks) {
        return res.status(403).json({ error: 'PERMISSION_DENIED_REMARKS' });
      }
    }

    const remarks = await prisma.studentRemark.findMany({
      where,
      include: {
        teacher: { select: { id: true, fullName: true } },
        student: { select: { id: true, fullName: true, rollNo: true } },
        session: { select: { id: true, title: true, startedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(remarks);
  } catch (e) { next(e); }
});

// TEACHER+ — create remark
remarksRouter.post('/', requireAuth, requireMinRole('TEACHER'), async (req, res, next) => {
  try {
    const b = createSchema.parse(req.body);

    // Verify teacher has permission
    if (req.user!.role === 'TEACHER') {
      const perm = await prisma.teacherPermission.findUnique({ where: { teacherId: req.user!.sub } });
      if (!perm?.canAddRemarks) {
        return res.status(403).json({ error: 'PERMISSION_DENIED_REMARKS' });
      }
    }

    // Verify student belongs to same institution
    const student = await prisma.student.findUnique({ where: { id: b.studentId } });
    if (!student) return res.status(404).json({ error: 'STUDENT_NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && student.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }

    const remark = await prisma.studentRemark.create({
      data: {
        institutionId: student.institutionId,
        teacherId: req.user!.sub,
        studentId: b.studentId,
        sessionId: b.sessionId,
        content: b.content,
        isPrivate: b.isPrivate,
      },
      include: {
        teacher: { select: { id: true, fullName: true } },
        student: { select: { id: true, fullName: true, rollNo: true } },
      },
    });

    await recordAudit({
      institutionId: student.institutionId,
      actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'REMARK_ADDED', targetType: 'Student', targetId: b.studentId,
      ip: req.ip,
    });

    res.status(201).json(remark);
  } catch (e) { next(e); }
});

// TEACHER (own) | ADMIN+ — update remark
remarksRouter.put('/:id', requireAuth, requireMinRole('TEACHER'), async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const remark = await prisma.studentRemark.findUnique({ where: { id: req.params.id } });
    if (!remark) return res.status(404).json({ error: 'NOT_FOUND' });

    // Teachers can only edit their own remarks
    if (req.user!.role === 'TEACHER' && remark.teacherId !== req.user!.sub) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    // Scope check
    if (req.user!.role !== 'DEVELOPER' && remark.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }

    const updated = await prisma.studentRemark.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (e) { next(e); }
});

// ADMIN+ — delete remark
remarksRouter.delete('/:id', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const remark = await prisma.studentRemark.findUnique({ where: { id: req.params.id } });
    if (!remark) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && remark.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    await prisma.studentRemark.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
