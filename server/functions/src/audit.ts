/**
 * Immutable audit logging helper for enterprise compliance.
 */

import * as admin from 'firebase-admin';

export interface AuditRecord {
  actorId: string;
  actorEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

export async function writeAudit(record: AuditRecord): Promise<string> {
  const db = admin.firestore();
  const logRef = await db.collection('enterprise_audit_logs').add({
    ...record,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    immutable: true,
  });
  return logRef.id;
}
