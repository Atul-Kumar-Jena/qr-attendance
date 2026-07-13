import type { Response } from 'express';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v2';
import { type AuthedRequest, loadUserRole } from './auth';
import { logAudit } from './audit';
import { validateCoords } from './haversine';

/**
 * Body for POST /sessions.
 */
type CreateSessionBody = {
  institutionId?: unknown;
  classId?: unknown;
  subjectId?: unknown;
  teacherId?: unknown;
  centerLat?: unknown;
  centerLng?: unknown;
  radiusMeters?: unknown;
  qrTtlSeconds?: unknown;
  startsAt?: unknown; // epoch millis
  expiresAt?: unknown; // epoch millis
};

type ParsedBody = {
  institutionId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  qrTtlSeconds: number;
  startsAt: number;
  expiresAt: number;
};

function asString(v: unknown, field: string): string {
  if (typeof v !== 'string' || !v.trim()) throw new Error(`${field}: required string`);
  return v.trim();
}
function asNumber(v: unknown, field: string): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  if (!Number.isFinite(n)) throw new Error(`${field}: required number`);
  return n;
}

function parseBody(body: CreateSessionBody): ParsedBody {
  const institutionId = asString(body.institutionId, 'institutionId');
  const classId = asString(body.classId, 'classId');
  const subjectId = asString(body.subjectId, 'subjectId');
  const teacherId = asString(body.teacherId, 'teacherId');
  const centerLat = asNumber(body.centerLat, 'centerLat');
  const centerLng = asNumber(body.centerLng, 'centerLng');
  const radiusMeters = asNumber(body.radiusMeters, 'radiusMeters');
  const qrTtlSeconds = asNumber(body.qrTtlSeconds, 'qrTtlSeconds');
  const startsAt = asNumber(body.startsAt, 'startsAt');
  const expiresAt = asNumber(body.expiresAt, 'expiresAt');

  validateCoords(centerLat, centerLng, 'center');
  if (radiusMeters < 20 || radiusMeters > 300) {
    throw new Error('radiusMeters must be in [20, 300]');
  }
  if (qrTtlSeconds < 5 || qrTtlSeconds > 30) {
    throw new Error('qrTtlSeconds must be in [5, 30]');
  }
  if (!(startsAt < expiresAt)) {
    throw new Error('startsAt must be strictly before expiresAt');
  }

  return {
    institutionId,
    classId,
    subjectId,
    teacherId,
    centerLat,
    centerLng,
    radiusMeters,
    qrTtlSeconds,
    startsAt,
    expiresAt,
  };
}

/**
 * POST /sessions — creates a new attendance session.
 * Authorized roles: developer, admin, institution, teacher.
 */
export async function createSession(req: AuthedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ ok: false, code: 'NO_AUTH' });
    return;
  }

  let parsed: ParsedBody;
  try {
    parsed = parseBody((req.body ?? {}) as CreateSessionBody);
  } catch (e) {
    const reason = e instanceof Error ? e.message : 'invalid body';
    res.status(400).json({ ok: false, code: 'BAD_REQUEST', reason });
    return;
  }

  const role = await loadUserRole(user.uid);
  if (!['developer', 'admin', 'institution', 'teacher'].includes(role)) {
    await logAudit({
      action: 'SESSION_CREATE_DENIED',
      actorId: user.uid,
      actorName: user.email,
      institutionId: parsed.institutionId,
      details: `role=${role}`,
    });
    res.status(403).json({ ok: false, code: 'FORBIDDEN', reason: `role ${role} cannot create sessions` });
    return;
  }

  try {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = await admin
      .firestore()
      .collection('attendanceSessions')
      .add({
        institutionId: parsed.institutionId,
        classId: parsed.classId,
        subjectId: parsed.subjectId,
        teacherId: parsed.teacherId,
        ownerUid: user.uid,
        centerLat: parsed.centerLat,
        centerLng: parsed.centerLng,
        radiusMeters: parsed.radiusMeters,
        qrTtlSeconds: parsed.qrTtlSeconds,
        startsAt: parsed.startsAt,
        expiresAt: parsed.expiresAt,
        status: 'OPEN',
        createdAt: now,
        updatedAt: now,
      });

    await logAudit({
      action: 'SESSION_CREATED',
      actorId: user.uid,
      actorName: user.email,
      institutionId: parsed.institutionId,
      targetId: ref.id,
      details: `class=${parsed.classId} subject=${parsed.subjectId} radius=${parsed.radiusMeters}m ttl=${parsed.qrTtlSeconds}s`,
    });

    res.status(200).json({ ok: true, sessionId: ref.id });
  } catch (e) {
    logger.error('createSession failed', e);
    res.status(500).json({ ok: false, code: 'INTERNAL', reason: 'Failed to create session' });
  }
}
