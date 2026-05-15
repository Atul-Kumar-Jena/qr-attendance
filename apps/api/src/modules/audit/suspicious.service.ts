import { prisma } from '../../config/db.js';
import type { ReasonCode } from '@prisma/client';

export interface SuspiciousInput {
  institutionId: string;
  studentId?: string;
  sessionId?: string;
  deviceId?: string;
  reason: ReasonCode;
  score: number;
  ip?: string;
  metadata?: Record<string, unknown>;
}

export async function flagSuspicious(s: SuspiciousInput): Promise<void> {
  await prisma.suspiciousActivityLog.create({
    data: {
      institutionId: s.institutionId,
      studentId: s.studentId,
      sessionId: s.sessionId,
      deviceId: s.deviceId,
      reason: s.reason,
      score: s.score,
      ip: s.ip,
      metadata: s.metadata ? (s.metadata as object) : undefined,
    },
  });
}
