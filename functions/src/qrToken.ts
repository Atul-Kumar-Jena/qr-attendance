import type { Response } from 'express';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v2';
import { type AuthedRequest, loadUserRole } from './auth';
import { logAudit } from './audit';
import { mintToken } from './qr';

type SessionDoc = {
  institutionId: string;
  classId: string;
  teacherId: string;
  ownerUid?: string;
  qrTtlSeconds: number;
  status: string;
  startsAt: number;
  expiresAt: number;
};

/**
 * GET /sessions/:sessionId/qr — mints a fresh short-TTL QR token for the
 * live display. The admin dashboard polls this every `qrTtlSeconds` seconds.
 *
 * Access: the session's owner, the session's teacher, or any admin/institution
 * /developer role within the same institution.
 *
 * Audit logging is only emitted on FAILURE — successful refreshes happen
 * every ~10s, which would spam the audit log (~360 entries/hour/teacher).
 */
export async function qrToken(req: AuthedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ ok: false, code: 'NO_AUTH' });
    return;
  }

  const sessionId = req.params.sessionId;
  if (!sessionId || typeof sessionId !== 'string') {
    res.status(400).json({ ok: false, code: 'BAD_REQUEST', reason: 'Missing sessionId' });
    return;
  }

  try {
    const ref = admin.firestore().collection('attendanceSessions').doc(sessionId);
    const snap = await ref.get();
    if (!snap.exists) {
      await logAudit({
        action: 'QR_MINT_DENIED',
        actorId: user.uid,
        actorName: user.email,
        targetId: sessionId,
        details: 'session not found',
      });
      res.status(404).json({ ok: false, code: 'NOT_FOUND', reason: 'Session not found' });
      return;
    }
    const session = snap.data() as SessionDoc | undefined;
    if (!session) {
      res.status(404).json({ ok: false, code: 'NOT_FOUND' });
      return;
    }

    // Authorize.
    const role = await loadUserRole(user.uid);
    const isOwner = session.ownerUid === user.uid || session.teacherId === user.uid;
    const isPrivileged = ['developer', 'admin', 'institution'].includes(role);
    if (!isOwner && !isPrivileged) {
      await logAudit({
        action: 'QR_MINT_DENIED',
        actorId: user.uid,
        actorName: user.email,
        institutionId: session.institutionId,
        targetId: sessionId,
        details: `role=${role} not owner`,
      });
      res.status(403).json({ ok: false, code: 'FORBIDDEN' });
      return;
    }

    // Session must be live.
    if (session.status !== 'OPEN') {
      await logAudit({
        action: 'QR_MINT_DENIED',
        actorId: user.uid,
        actorName: user.email,
        institutionId: session.institutionId,
        targetId: sessionId,
        details: `status=${session.status}`,
      });
      res.status(410).json({ ok: false, code: 'GONE', reason: 'Session not open' });
      return;
    }
    const nowMs = Date.now();
    if (nowMs > session.expiresAt) {
      await logAudit({
        action: 'QR_MINT_DENIED',
        actorId: user.uid,
        actorName: user.email,
        institutionId: session.institutionId,
        targetId: sessionId,
        details: 'expired',
      });
      res.status(410).json({ ok: false, code: 'GONE', reason: 'Session expired' });
      return;
    }

    const ttlSec = Math.max(5, Math.min(30, session.qrTtlSeconds || 15));
    const minted = mintToken({
      institutionId: session.institutionId,
      classId: session.classId,
      sessionId,
      ttlSec,
    });

    res.status(200).json({
      ok: true,
      qrToken: minted.token,
      qrId: minted.qrId,
      exp: minted.exp,
      ttlSec,
    });
  } catch (e) {
    logger.error('qrToken failed', e);
    res.status(500).json({ ok: false, code: 'INTERNAL' });
  }
}
