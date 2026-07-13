import * as admin from 'firebase-admin';

export type AuditEntry = {
  action: string;
  actorId: string;
  actorName?: string | null;
  institutionId?: string | null;
  targetId?: string | null;
  details?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Append-only audit log. Uses the admin SDK so rules don't matter.
 * Best-effort — failures are logged but never thrown to the caller.
 */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await admin
      .firestore()
      .collection('auditLogs')
      .add({
        ...entry,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('audit.logAudit failed:', e);
  }
}
