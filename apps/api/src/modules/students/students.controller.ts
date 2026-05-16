import { Router } from 'express';
import { z } from 'zod';
import argon2 from 'argon2';
import { prisma } from '../../config/db.js';
import { requireAuth, requireMinRole } from '../../middleware/auth.js';
import { recordAudit } from '../audit/audit.service.js';

export const studentsRouter = Router();

// TEACHER+ — list students in institution (teachers: scoped to their class sessions)
studentsRouter.get('/', requireAuth, requireMinRole('TEACHER'), async (req, res, next) => {
  try {
    const { klassId, search, page = '1', limit = '50' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const instId = req.user!.role === 'DEVELOPER' ? (req.query.institutionId as string | undefined) : req.user!.inst;
    if (!instId) return res.status(400).json({ error: 'institutionId required for DEVELOPER' });

    // Teachers only see students from their sessions unless they have manageStudents perm
    let klassFilter: string | undefined = klassId;
    if (req.user!.role === 'TEACHER') {
      const perm = await prisma.teacherPermission.findUnique({ where: { teacherId: req.user!.sub } });
      if (!perm?.canManageStudents && !perm?.canViewAllAttendance) {
        // Restrict to students in teacher's classes only
        const teacherKlassIds = await prisma.classSession.findMany({
          where: { teacherId: req.user!.sub, institutionId: instId },
          select: { klassId: true },
          distinct: ['klassId'],
        });
        const kIds = teacherKlassIds.map((s) => s.klassId);
        if (kIds.length === 0) return res.json({ students: [], total: 0 });

        const [students, total] = await Promise.all([
          prisma.student.findMany({
            where: {
              institutionId: instId,
              klassId: { in: kIds },
              ...(search ? { fullName: { contains: search, mode: 'insensitive' } } : {}),
            },
            select: { id: true, rollNo: true, fullName: true, email: true, suspended: true,
                      klassId: true, klass: { select: { name: true } } },
            skip, take: parseInt(limit),
            orderBy: { fullName: 'asc' },
          }),
          prisma.student.count({ where: { institutionId: instId, klassId: { in: kIds } } }),
        ]);
        return res.json({ students, total, page: parseInt(page) });
      }
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: {
          institutionId: instId,
          ...(klassFilter ? { klassId: klassFilter } : {}),
          ...(search ? { fullName: { contains: search, mode: 'insensitive' } } : {}),
        },
        select: { id: true, rollNo: true, fullName: true, email: true, suspended: true,
                  klassId: true, klass: { select: { name: true } } },
        skip, take: parseInt(limit),
        orderBy: { fullName: 'asc' },
      }),
      prisma.student.count({ where: { institutionId: instId } }),
    ]);
    res.json({ students, total, page: parseInt(page) });
  } catch (e) { next(e); }
});

// TEACHER+ — get student detail with attendance history + remarks
studentsRouter.get('/:id', requireAuth, requireMinRole('TEACHER'), async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: {
        klass: { select: { name: true } },
        batch: { select: { name: true } },
        section: { select: { name: true } },
        device: { select: { platform: true, model: true, status: true, boundAt: true } },
        attendance: {
          include: { session: { select: { id: true, title: true, startedAt: true, status: true } } },
          orderBy: { markedAt: 'desc' },
          take: 50,
        },
        remarks: {
          where: req.user!.role === 'TEACHER' ? {
            OR: [{ teacherId: req.user!.sub }, { isPrivate: false }],
          } : {},
          include: { teacher: { select: { fullName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!student) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && student.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    // Strip password hash
    const { passwordHash: _, ...safe } = student;
    res.json(safe);
  } catch (e) { next(e); }
});

// ADMIN+ — create student
const createStudentSchema = z.object({
  rollNo:    z.string().min(1).max(30),
  fullName:  z.string().min(2),
  email:     z.string().email().optional(),
  password:  z.string().min(6),
  klassId:   z.string().cuid().optional(),
  batchId:   z.string().cuid().optional(),
  sectionId: z.string().cuid().optional(),
});

studentsRouter.post('/', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const b = createStudentSchema.parse(req.body);
    const instId = req.user!.inst;
    const hash = await argon2.hash(b.password);
    const student = await prisma.student.create({
      data: {
        institutionId: instId,
        rollNo: b.rollNo,
        fullName: b.fullName,
        email: b.email,
        passwordHash: hash,
        klassId: b.klassId,
        batchId: b.batchId,
        sectionId: b.sectionId,
      },
    });
    await recordAudit({
      institutionId: instId, actorUserId: req.user!.sub, actorRole: req.user!.role,
      action: 'STUDENT_CREATED', targetType: 'Student', targetId: student.id, ip: req.ip,
    });
    res.status(201).json({ id: student.id, rollNo: student.rollNo, fullName: student.fullName });
  } catch (e) { next(e); }
});

// ADMIN+ — suspend / unsuspend student
studentsRouter.patch('/:id/suspend', requireAuth, requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const { suspended } = z.object({ suspended: z.boolean() }).parse(req.body);
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user!.role !== 'DEVELOPER' && student.institutionId !== req.user!.inst) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    await prisma.student.update({ where: { id: req.params.id }, data: { suspended } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
