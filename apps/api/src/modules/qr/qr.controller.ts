import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { writeLimiter } from '../../middleware/rateLimit.js';
import { mintToken } from './qr.service.js';
import { recordAudit } from '../audit/audit.service.js';

export const qrRouter = Router();

const refreshSchema = z.object({ sessionId: z.string().cuid() });

/** Admin / teacher pulls a fresh QR for a live session. Usually the
 *  dashboard subscribes via WebSocket; this is the manual-refresh path. */
qrRouter.post(
  '/refresh',
  requireAuth,
  requireRole('SUDO_ADMIN', 'ADMIN', 'TEACHER'),
  writeLimiter,
  async (req, res, next) => {
    try {
      const { sessionId } = refreshSchema.parse(req.body);
      const session = await prisma.classSession.findUnique({
        where: { id: sessionId },
        select: { id: true, klassId: true, institutionId: true,
                  status: true, qrRotationSec: true },
      });
      if (!session || session.institutionId !== req.user!.inst) {
        return res.status(404).json({ error: 'NOT_FOUND' });
      }
      if (session.status !== 'OPEN') {
        return res.status(400).json({ error: 'SESSION_NOT_OPEN' });
      }
      const { token, payload } = await mintToken({
        institutionId: session.institutionId,
        classId: session.klassId,
        sessionId: session.id,
        ttlSec: session.qrRotationSec,
      });
      await recordAudit({
        institutionId: session.institutionId,
        actorUserId: req.user!.sub,
        actorRole: req.user!.role,
        action: 'QR_GENERATED',
        targetType: 'session',
        targetId: session.id,
        metadata: { exp: payload.exp },
      });
      res.json({ token, expiresAt: new Date(payload.exp * 1000) });
    } catch (e) {
      next(e);
    }
  },
);
