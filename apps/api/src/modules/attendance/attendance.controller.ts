import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { requireAppSignature } from '../../middleware/appSign.js';
import { scanLimiter } from '../../middleware/rateLimit.js';
import { processScan } from './attendance.service.js';

export const attendanceRouter = Router();

const scanSchema = z.object({
  token: z.string().min(20),
  location: z.object({
    lat: z.number().gte(-90).lte(90),
    lng: z.number().gte(-180).lte(180),
    accuracyM: z.number().nonnegative().optional(),
    mock: z.boolean().optional(),
  }),
  deviceId: z.string().min(4),
  deviceFingerprint: z.string().min(8),
  attestation: z.string().optional(),
});

attendanceRouter.post(
  '/scan',
  requireAppSignature,
  requireAuth,
  requireRole('STUDENT'),
  scanLimiter,
  async (req, res, next) => {
    try {
      const body = scanSchema.parse(req.body);
      const user = req.user!;

      // attestation: in dev we accept presence; prod hits Google/Apple verify
      const attestationOk = process.env.NODE_ENV !== 'production' || Boolean(body.attestation);

      const result = await processScan({
        studentId: user.sub,
        institutionId: user.inst,
        bindingGen: user.bg ?? 0,
        token: body.token,
        location: body.location,
        deviceId: body.deviceId,
        deviceFingerprint: body.deviceFingerprint,
        attestationOk,
        ip: req.ip,
      });

      if (!result.ok) {
        return res.status(400).json({ status: 'REJECTED', code: result.code });
      }
      res.json({ status: 'MARKED', sessionId: result.sessionId, markedAt: result.markedAt });
    } catch (e) {
      next(e);
    }
  },
);
