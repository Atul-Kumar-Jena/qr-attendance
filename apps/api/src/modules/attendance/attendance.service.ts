import { prisma } from '../../config/db.js';
import { verifyAndConsume } from '../qr/qr.service.js';
import { checkGeofence } from '../../utils/geofence.js';
import { recordAudit } from '../audit/audit.service.js';
import { flagSuspicious, type SuspiciousInput } from '../audit/suspicious.service.js';
import type { ReasonCode } from '@prisma/client';

function suspicious(
  input: ScanInput,
  reason: SuspiciousInput['reason'],
  score: number,
  metadata?: Record<string, unknown>,
) {
  return flagSuspicious({
    institutionId: input.institutionId,
    studentId: input.studentId,
    deviceId: input.deviceId,
    ip: input.ip,
    reason,
    score,
    metadata,
  });
}

export interface ScanInput {
  studentId: string;
  institutionId: string;
  bindingGen: number;
  token: string;
  location: { lat: number; lng: number; accuracyM?: number; mock?: boolean };
  deviceId: string;
  deviceFingerprint: string;
  attestationOk: boolean;
  ip?: string;
}

export type ScanResult =
  | { ok: true; sessionId: string; markedAt: Date }
  | { ok: false; code: ReasonCode };

/**
 * Multi-layer validation pipeline. Order matters — cheap checks first,
 * DB lookups only after cryptographic validation passes.
 */
export async function processScan(input: ScanInput): Promise<ScanResult> {
  // 1) Signature + expiry + nonce (atomic consume)
  const v = await verifyAndConsume(input.token);
  if (!v.ok) {
    await auditFail(input, v.code);
    if (v.code === 'TOKEN_REUSED') await suspicious(input, 'TOKEN_REUSED', 50);
    return { ok: false, code: v.code };
  }
  const { payload } = v;

  // 2) Institution scoping — refuse cross-tenant tokens immediately
  if (payload.iid !== input.institutionId) {
    await auditFail(input, 'TOKEN_INVALID');
    return { ok: false, code: 'TOKEN_INVALID' };
  }

  // 3) Mock location flag from client
  if (input.location.mock) {
    await suspicious(input, 'MOCK_LOCATION', 60);
    await auditFail(input, 'MOCK_LOCATION');
    return { ok: false, code: 'MOCK_LOCATION' };
  }

  // 4) App attestation
  if (!input.attestationOk) {
    await suspicious(input, 'ATTESTATION_FAILED', 40);
    await auditFail(input, 'ATTESTATION_FAILED');
    return { ok: false, code: 'ATTESTATION_FAILED' };
  }

  // 5) Session must be OPEN
  const session = await prisma.classSession.findUnique({
    where: { id: payload.sid },
    select: { id: true, status: true, klassId: true, institutionId: true,
              geofenceLat: true, geofenceLng: true, geofenceM: true },
  });
  if (!session || session.institutionId !== input.institutionId) {
    await auditFail(input, 'TOKEN_INVALID');
    return { ok: false, code: 'TOKEN_INVALID' };
  }
  if (session.status !== 'OPEN') {
    await auditFail(input, 'SESSION_CLOSED');
    return { ok: false, code: 'SESSION_CLOSED' };
  }

  // 6) Device binding
  const binding = await prisma.deviceBinding.findUnique({ where: { studentId: input.studentId } });
  if (!binding || binding.status !== 'ACTIVE') {
    await auditFail(input, 'DEVICE_MISMATCH');
    return { ok: false, code: 'DEVICE_MISMATCH' };
  }
  if (binding.deviceFingerprint !== input.deviceFingerprint ||
      binding.bindingGen !== input.bindingGen) {
    await suspicious(input, 'DEVICE_MISMATCH', 45);
    await auditFail(input, 'DEVICE_MISMATCH');
    return { ok: false, code: 'DEVICE_MISMATCH' };
  }

  // 7) Geofence
  let distanceM: number | undefined;
  if (session.geofenceLat != null && session.geofenceLng != null && session.geofenceM != null) {
    const r = checkGeofence(input.location, {
      lat: session.geofenceLat, lng: session.geofenceLng, radiusM: session.geofenceM,
    });
    distanceM = r.distanceM;
    if (!r.inside) {
      await suspicious(input, 'GEOFENCE_FAILED', 35, {
        distanceM: r.distanceM, radiusM: session.geofenceM,
      });
      await auditFail(input, 'GEOFENCE_FAILED');
      return { ok: false, code: 'GEOFENCE_FAILED' };
    }
  }

  // 8) Duplicate prevention + insert (DB-level uniqueness is the source of truth)
  try {
    const record = await prisma.attendanceRecord.create({
      data: {
        institutionId: input.institutionId,
        sessionId: session.id,
        studentId: input.studentId,
        status: 'PRESENT',
        scanLat: input.location.lat,
        scanLng: input.location.lng,
        scanAccuracyM: input.location.accuracyM ?? null,
        distanceM: distanceM ?? null,
        deviceId: input.deviceId,
      },
    });

    await recordAudit({
      institutionId: input.institutionId,
      actorUserId: input.studentId,
      actorRole: 'STUDENT',
      action: 'ATTENDANCE_MARKED',
      targetType: 'session',
      targetId: session.id,
      ip: input.ip,
      metadata: { distanceM },
    });

    return { ok: true, sessionId: session.id, markedAt: record.markedAt };
  } catch (e: unknown) {
    // P2002 unique violation = already marked
    if ((e as { code?: string }).code === 'P2002') {
      await auditFail(input, 'ALREADY_MARKED');
      return { ok: false, code: 'ALREADY_MARKED' };
    }
    throw e;
  }
}

async function auditFail(input: ScanInput, code: ReasonCode) {
  await recordAudit({
    institutionId: input.institutionId,
    actorUserId: input.studentId,
    actorRole: 'STUDENT',
    action: 'ATTENDANCE_REJECTED',
    ip: input.ip,
    metadata: { reason: code },
  });
}
