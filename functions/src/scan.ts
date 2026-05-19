import type { Response } from 'express';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v2';
import { type AuthedRequest } from './auth';
import { logAudit } from './audit';
import { verifyToken, type QrPayload } from './qr';
import { calculateDistanceMeters, validateCoords } from './haversine';

type ScanBody = {
  qrToken?: unknown;
  studentId?: unknown;
  deviceFingerprint?: unknown;
  studentLat?: unknown;
  studentLng?: unknown;
  accuracyMeters?: unknown;
  clientTimestamp?: unknown;
};

type ParsedScan = {
  qrToken: string;
  studentId: string;
  deviceFingerprint: string;
  studentLat: number;
  studentLng: number;
  accuracyMeters: number;
  clientTimestamp: number;
};

type SessionDoc = {
  institutionId: string;
  classId: string;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  status: string;
  startsAt: number;
  expiresAt: number;
};

type DeviceDoc = {
  deviceFingerprint: string;
  isActive: boolean;
  boundAt?: admin.firestore.Timestamp;
};

const GEOFENCE_TOLERANCE_M = 10;
const MAX_ACCURACY_M = 50;

function asString(v: unknown, field: string): string {
  if (typeof v !== 'string' || !v.trim()) throw new Error(`${field}: required string`);
  return v.trim();
}
function asNumber(v: unknown, field: string): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  if (!Number.isFinite(n)) throw new Error(`${field}: required number`);
  return n;
}

function parseBody(body: ScanBody): ParsedScan {
  return {
    qrToken: asString(body.qrToken, 'qrToken'),
    studentId: asString(body.studentId, 'studentId'),
    deviceFingerprint: asString(body.deviceFingerprint, 'deviceFingerprint'),
    studentLat: asNumber(body.studentLat, 'studentLat'),
    studentLng: asNumber(body.studentLng, 'studentLng'),
    accuracyMeters: asNumber(body.accuracyMeters, 'accuracyMeters'),
    clientTimestamp: asNumber(body.clientTimestamp, 'clientTimestamp'),
  };
}

type RejectCode =
  | 'BAD_REQUEST'
  | 'BAD_TOKEN'
  | 'SESSION_NOT_FOUND'
  | 'SESSION_CLOSED'
  | 'SESSION_NOT_LIVE'
  | 'CLASS_MISMATCH'
  | 'NOT_ENROLLED'
  | 'DEVICE_MISMATCH'
  | 'POOR_ACCURACY'
  | 'OUT_OF_GEOFENCE'
  | 'DUPLICATE'
  | 'INTERNAL';

async function writeScanAttempt(
  sessionId: string | null,
  studentId: string,
  payload: Partial<ParsedScan>,
  outcome: 'accepted' | 'rejected',
  code: RejectCode | 'OK',
  reason: string,
  qrPayload: Partial<QrPayload> | null,
): Promise<void> {
  try {
    await admin
      .firestore()
      .collection('scanAttempts')
      .add({
        sessionId,
        studentId,
        deviceFingerprint: payload.deviceFingerprint ?? null,
        studentLat: payload.studentLat ?? null,
        studentLng: payload.studentLng ?? null,
        accuracyMeters: payload.accuracyMeters ?? null,
        clientTimestamp: payload.clientTimestamp ?? null,
        qrId: qrPayload?.qrId ?? null,
        qrNonce: qrPayload?.nonce ?? null,
        institutionId: qrPayload?.institutionId ?? null,
        classId: qrPayload?.classId ?? null,
        outcome,
        code,
        reason,
        serverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (e) {
    logger.error('writeScanAttempt failed', e);
  }
}

/**
 * Trivial per-IP in-memory rate limiter. Resets at cold start — fine for
 * abuse-protection-of-last-resort given Cloud Functions instance lifecycle.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateMap: Map<string, { count: number; windowStart: number }> = new Map();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const cur = rateMap.get(ip);
  if (!cur || now - cur.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  cur.count += 1;
  if (cur.count > RATE_LIMIT_MAX) return false;
  return true;
}

/**
 * POST /scan — verify a QR scan from a student device.
 *
 * Verification pipeline (fails fast). Every attempt — accept or reject —
 * appends a `scanAttempts` doc via admin SDK so attempts can be audited even
 * when client rules forbid the write.
 */
export async function verifyScan(req: AuthedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ ok: false, code: 'NO_AUTH' });
    return;
  }

  // Cheap abuse protection.
  const ip = req.clientIp || 'unknown';
  if (!rateLimit(ip)) {
    res.status(429).json({ ok: false, code: 'RATE_LIMITED' });
    return;
  }

  let parsed: ParsedScan;
  try {
    parsed = parseBody((req.body ?? {}) as ScanBody);
  } catch (e) {
    const reason = e instanceof Error ? e.message : 'invalid body';
    res.status(400).json({ ok: false, code: 'BAD_REQUEST', reason });
    return;
  }

  // The authenticated user must match the studentId (no impersonation).
  if (parsed.studentId !== user.uid) {
    await writeScanAttempt(null, parsed.studentId, parsed, 'rejected', 'BAD_REQUEST',
      'studentId does not match auth uid', null);
    res.status(403).json({ ok: false, code: 'FORBIDDEN', reason: 'studentId mismatch' });
    return;
  }

  // 1. Verify token.
  const verified = verifyToken(parsed.qrToken);
  if (!verified.ok) {
    await writeScanAttempt(null, parsed.studentId, parsed, 'rejected', 'BAD_TOKEN', verified.code, null);
    res.status(403).json({ ok: false, code: 'BAD_TOKEN', reason: verified.code });
    return;
  }
  const qrPayload = verified.payload;

  try {
    // 2. Load session.
    const sRef = admin.firestore().collection('attendanceSessions').doc(qrPayload.sessionId);
    const sSnap = await sRef.get();
    if (!sSnap.exists) {
      await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
        'SESSION_NOT_FOUND', 'session missing', qrPayload);
      res.status(404).json({ ok: false, code: 'SESSION_NOT_FOUND' });
      return;
    }
    const session = sSnap.data() as SessionDoc;
    if (session.status !== 'OPEN') {
      await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
        'SESSION_CLOSED', `status=${session.status}`, qrPayload);
      res.status(403).json({ ok: false, code: 'SESSION_CLOSED' });
      return;
    }
    const nowMs = Date.now();
    if (nowMs < session.startsAt || nowMs > session.expiresAt) {
      await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
        'SESSION_NOT_LIVE', `now=${nowMs} window=[${session.startsAt},${session.expiresAt}]`, qrPayload);
      res.status(403).json({ ok: false, code: 'SESSION_NOT_LIVE' });
      return;
    }

    // 3. Token claims must match session.
    if (
      qrPayload.institutionId !== session.institutionId ||
      qrPayload.classId !== session.classId
    ) {
      await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
        'CLASS_MISMATCH', 'token claims do not match session', qrPayload);
      res.status(403).json({ ok: false, code: 'CLASS_MISMATCH' });
      return;
    }

    // 4. Enrollment check.
    const enrollSnap = await admin
      .firestore()
      .collection('classMembers')
      .where('classId', '==', session.classId)
      .where('userId', '==', parsed.studentId)
      .limit(1)
      .get();
    if (enrollSnap.empty) {
      await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
        'NOT_ENROLLED', 'student not in class', qrPayload);
      res.status(403).json({ ok: false, code: 'NOT_ENROLLED' });
      return;
    }

    // 5. Device binding (TOFU on first scan).
    const devRef = admin.firestore().collection('studentDevices').doc(parsed.studentId);
    const devSnap = await devRef.get();
    if (devSnap.exists) {
      const dev = devSnap.data() as DeviceDoc;
      if (!dev.isActive || dev.deviceFingerprint !== parsed.deviceFingerprint) {
        await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
          'DEVICE_MISMATCH', 'fingerprint differs from bound device', qrPayload);
        res.status(403).json({ ok: false, code: 'DEVICE_MISMATCH' });
        return;
      }
    } else {
      // First time we've seen this student — TOFU bind.
      await devRef.set({
        deviceFingerprint: parsed.deviceFingerprint,
        isActive: true,
        boundAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 6. Accuracy gate.
    if (!Number.isFinite(parsed.accuracyMeters) || parsed.accuracyMeters > MAX_ACCURACY_M) {
      await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
        'POOR_ACCURACY', `accuracy=${parsed.accuracyMeters}m`, qrPayload);
      res.status(403).json({ ok: false, code: 'POOR_ACCURACY' });
      return;
    }

    // 7. Geofence.
    try {
      validateCoords(parsed.studentLat, parsed.studentLng, 'student');
    } catch (e) {
      const reason = e instanceof Error ? e.message : 'invalid coords';
      await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
        'BAD_REQUEST', reason, qrPayload);
      res.status(400).json({ ok: false, code: 'BAD_REQUEST', reason });
      return;
    }
    const dist = calculateDistanceMeters(
      session.centerLat,
      session.centerLng,
      parsed.studentLat,
      parsed.studentLng,
    );
    if (dist.meters > session.radiusMeters + GEOFENCE_TOLERANCE_M) {
      await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
        'OUT_OF_GEOFENCE',
        `distance=${dist.meters.toFixed(1)}m radius=${session.radiusMeters}m`, qrPayload);
      res.status(403).json({ ok: false, code: 'OUT_OF_GEOFENCE', reason: `${dist.meters.toFixed(1)}m` });
      return;
    }

    // 8. Transactional duplicate check + record write.
    const recRef = sRef.collection('records').doc(parsed.studentId);
    let duplicate = false;
    await admin.firestore().runTransaction(async (tx) => {
      const cur = await tx.get(recRef);
      if (cur.exists) {
        duplicate = true;
        return;
      }
      tx.set(recRef, {
        studentId: parsed.studentId,
        deviceFingerprint: parsed.deviceFingerprint,
        studentLat: parsed.studentLat,
        studentLng: parsed.studentLng,
        accuracyMeters: parsed.accuracyMeters,
        distanceMeters: dist.meters,
        status: 'present',
        qrId: qrPayload.qrId,
        qrNonce: qrPayload.nonce,
        scannedAt: parsed.clientTimestamp,
        serverVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    if (duplicate) {
      await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected',
        'DUPLICATE', 'already marked present', qrPayload);
      res.status(409).json({ ok: false, code: 'DUPLICATE' });
      return;
    }

    // 9. Success.
    await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'accepted', 'OK',
      `distance=${dist.meters.toFixed(1)}m`, qrPayload);
    await logAudit({
      action: 'SCAN_ACCEPTED',
      actorId: parsed.studentId,
      actorName: user.email,
      institutionId: session.institutionId,
      targetId: qrPayload.sessionId,
      details: `class=${session.classId} distance=${dist.meters.toFixed(1)}m`,
    });
    res.status(200).json({ ok: true, distanceMeters: dist.meters });
  } catch (e) {
    logger.error('verifyScan failed', e);
    await writeScanAttempt(qrPayload.sessionId, parsed.studentId, parsed, 'rejected', 'INTERNAL',
      e instanceof Error ? e.message : 'unknown', qrPayload);
    res.status(500).json({ ok: false, code: 'INTERNAL' });
  }
}
