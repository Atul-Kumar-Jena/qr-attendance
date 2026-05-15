import { prisma } from '../../config/db.js';
import type { UserRole } from '@prisma/client';

export interface AuditInput {
  institutionId: string;
  actorUserId?: string;
  actorRole?: UserRole;
  action: string;
  targetType?: string;
  targetId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export async function recordAudit(a: AuditInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      institutionId: a.institutionId,
      actorUserId: a.actorUserId,
      actorRole: a.actorRole,
      action: a.action,
      targetType: a.targetType,
      targetId: a.targetId,
      ip: a.ip,
      userAgent: a.userAgent,
      metadata: a.metadata ? (a.metadata as object) : undefined,
    },
  });
}
