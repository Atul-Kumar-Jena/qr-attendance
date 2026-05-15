import { Router } from 'express';
import argon2 from 'argon2';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { signAccess, mintRefresh, hashToken } from '../../utils/jwt.js';
import { recordAudit } from '../audit/audit.service.js';
import { loginLimiter } from '../../middleware/rateLimit.js';
import { env } from '../../config/env.js';

export const authRouter = Router();

const adminLoginSchema = z.object({
  institutionCode: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const studentLoginSchema = z.object({
  institutionCode: z.string().min(2),
  rollNo: z.string().min(1),
  password: z.string().min(6),
  device: z.object({
    id: z.string().min(4),
    fingerprint: z.string().min(8),
    platform: z.enum(['android', 'ios']),
    model: z.string().optional(),
    osVersion: z.string().optional(),
    appInstanceId: z.string().optional(),
    pushToken: z.string().optional(),
  }),
  attestation: z.string().optional(),
});

authRouter.post('/admin/login', loginLimiter, async (req, res, next) => {
  try {
    const b = adminLoginSchema.parse(req.body);
    const inst = await prisma.institution.findUnique({ where: { code: b.institutionCode } });
    if (!inst || inst.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }
    const user = await prisma.user.findUnique({
      where: { institutionId_email: { institutionId: inst.id, email: b.email } },
    });
    if (!user || user.suspended) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    const ok = await argon2.verify(user.passwordHash, b.password);
    if (!ok) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

    const access = signAccess({ sub: user.id, role: user.role, inst: inst.id });
    const r = mintRefresh();
    await prisma.refreshToken.create({
      data: {
        tokenHash: r.hash, familyId: r.familyId, userId: user.id,
        expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL * 1000),
      },
    });
    await recordAudit({ institutionId: inst.id, actorUserId: user.id, actorRole: user.role,
      action: 'LOGIN', ip: req.ip, userAgent: req.header('user-agent') ?? undefined });
    res.json({
      accessToken: access, refreshToken: r.plain,
      user: { id: user.id, fullName: user.fullName, role: user.role, institutionId: inst.id },
    });
  } catch (e) { next(e); }
});

authRouter.post('/student/login', loginLimiter, async (req, res, next) => {
  try {
    const b = studentLoginSchema.parse(req.body);
    const inst = await prisma.institution.findUnique({ where: { code: b.institutionCode } });
    if (!inst || inst.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }
    const student = await prisma.student.findUnique({
      where: { institutionId_rollNo: { institutionId: inst.id, rollNo: b.rollNo } },
      include: { device: true },
    });
    if (!student || student.suspended) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    const ok = await argon2.verify(student.passwordHash, b.password);
    if (!ok) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

    // Device binding logic
    if (student.device) {
      if (student.device.status !== 'ACTIVE' ||
          student.device.deviceFingerprint !== b.device.fingerprint) {
        return res.status(403).json({ error: 'DEVICE_MISMATCH' });
      }
    } else {
      await prisma.deviceBinding.create({
        data: {
          studentId: student.id,
          deviceId: b.device.id,
          deviceFingerprint: b.device.fingerprint,
          platform: b.device.platform,
          model: b.device.model,
          osVersion: b.device.osVersion,
          appInstanceId: b.device.appInstanceId,
          pushToken: b.device.pushToken,
          bindingGen: student.bindingGen,
        },
      });
      await recordAudit({
        institutionId: inst.id, actorUserId: student.id, actorRole: 'STUDENT',
        action: 'DEVICE_BOUND', ip: req.ip,
      });
    }

    const access = signAccess({ sub: student.id, role: 'STUDENT', inst: inst.id, bg: student.bindingGen });
    const r = mintRefresh();
    await prisma.refreshToken.create({
      data: {
        tokenHash: r.hash, familyId: r.familyId, studentId: student.id,
        expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL * 1000),
      },
    });
    res.json({
      accessToken: access, refreshToken: r.plain, deviceBound: true,
      user: { id: student.id, fullName: student.fullName, role: 'STUDENT', institutionId: inst.id },
    });
  } catch (e) { next(e); }
});

const refreshSchema = z.object({ refreshToken: z.string().min(20) });

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const hash = hashToken(refreshToken);
    const row = await prisma.refreshToken.findUnique({ where: { tokenHash: hash } });
    if (!row || row.revoked || row.expiresAt < new Date()) {
      return res.status(401).json({ error: 'INVALID_REFRESH' });
    }
    if (row.used) {
      // Reuse detected — revoke whole family
      await prisma.refreshToken.updateMany({
        where: { familyId: row.familyId }, data: { revoked: true },
      });
      return res.status(401).json({ error: 'REFRESH_REUSE_DETECTED' });
    }
    // mark old as used, mint new
    await prisma.refreshToken.update({ where: { id: row.id }, data: { used: true } });
    const r = mintRefresh();
    const isStudent = !!row.studentId;
    let access: string;
    if (isStudent) {
      const s = await prisma.student.findUnique({ where: { id: row.studentId! } });
      if (!s) return res.status(401).json({ error: 'INVALID_REFRESH' });
      access = signAccess({ sub: s.id, role: 'STUDENT', inst: s.institutionId, bg: s.bindingGen });
      await prisma.refreshToken.create({
        data: { tokenHash: r.hash, familyId: row.familyId, studentId: s.id,
          expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL * 1000) },
      });
    } else {
      const u = await prisma.user.findUnique({ where: { id: row.userId! } });
      if (!u) return res.status(401).json({ error: 'INVALID_REFRESH' });
      access = signAccess({ sub: u.id, role: u.role, inst: u.institutionId });
      await prisma.refreshToken.create({
        data: { tokenHash: r.hash, familyId: row.familyId, userId: u.id,
          expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL * 1000) },
      });
    }
    res.json({ accessToken: access, refreshToken: r.plain });
  } catch (e) { next(e); }
});
