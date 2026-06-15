/**
 * Server-side account deletion Callable Function.
 *
 * - Authenticates the caller.
 * - Deletes or anonymizes Firestore documents owned by the user.
 * - Handles shared data by removing user references.
 * - Writes an immutable audit log.
 */

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

interface DeletionResult {
  success: boolean;
  userId: string;
  deletedDocuments: number;
  anonymizedDocuments: number;
  errors: string[];
  auditLogId?: string;
}

/**
 * Delete all documents in a collection group where the document path starts
 * with the user's UID (e.g., users/{uid}/sub/{id}).
 */
async function deleteSubcollection(
  db: admin.firestore.Firestore,
  parentPath: string,
  subcollection: string,
  batchSize = 500
): Promise<number> {
  const snapshot = await db
    .collection(`${parentPath}/${subcollection}`)
    .limit(batchSize)
    .get();

  if (snapshot.empty) return 0;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  return snapshot.size + (snapshot.size === batchSize ? await deleteSubcollection(db, parentPath, subcollection, batchSize) : 0);
}

/**
 * Remove user references from shared / anonymized documents without deleting
 * content that belongs to the community.
 */
async function anonymizeSharedData(
  db: admin.firestore.Firestore,
  uid: string
): Promise<{ count: number; errors: string[] }> {
  const errors: string[] = [];
  let count = 0;

  try {
    // Example: holiday suggestions where the user is the author.
    const suggestions = await db
      .collection('holiday_suggestions')
      .where('authorId', '==', uid)
      .limit(500)
      .get();

    const batch = db.batch();
    suggestions.docs.forEach((doc) => {
      batch.update(doc.ref, {
        authorId: 'deleted-user',
        authorName: 'Deleted User',
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
    count += suggestions.size;
  } catch (err) {
    errors.push(`holiday_suggestions: ${(err as Error).message}`);
  }

  try {
    // Example: feature votes.
    const votes = await db
      .collection('feature_votes')
      .where('userId', '==', uid)
      .limit(500)
      .get();

    const batch = db.batch();
    votes.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    count += votes.size;
  } catch (err) {
    errors.push(`feature_votes: ${(err as Error).message}`);
  }

  return { count, errors };
}

/**
 * Write an immutable audit log entry.
 */
async function writeAuditLog(
  db: admin.firestore.Firestore,
  uid: string,
  result: Omit<DeletionResult, 'auditLogId'>
): Promise<string> {
  const logRef = await db.collection('deletion_audit_logs').add({
    ...result,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    immutable: true,
  });
  return logRef.id;
}

export const deleteUserData = functions
  .region('australia-southeast1')
  .https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const uid = context.auth.uid;
  const db = admin.firestore();
  const errors: string[] = [];
  let deletedDocuments = 0;

  const ownedCollections = [
    'profiles',
    'charts',
    'notes',
    'journal',
    'tasks',
    'friendships',
    'messages',
    'energy_votes',
    'push_tokens',
  ];

  try {
    // Delete user document and subcollections.
    const userRef = db.collection('users').doc(uid);
    for (const sub of ownedCollections) {
      try {
        deletedDocuments += await deleteSubcollection(db, userRef.path, sub);
      } catch (err) {
        errors.push(`${sub}: ${(err as Error).message}`);
      }
    }

    try {
      await userRef.delete();
      deletedDocuments += 1;
    } catch (err) {
      errors.push(`users: ${(err as Error).message}`);
    }

    // Anonymize shared data.
    const { count, errors: anonErrors } = await anonymizeSharedData(db, uid);

    // Delete auth account (optional; the client can also do this).
    try {
      await admin.auth().deleteUser(uid);
    } catch (err) {
      errors.push(`auth: ${(err as Error).message}`);
    }

    const result: Omit<DeletionResult, 'auditLogId'> = {
      success: errors.length === 0,
      userId: uid,
      deletedDocuments,
      anonymizedDocuments: count,
      errors: [...errors, ...anonErrors],
    };

    const auditLogId = await writeAuditLog(db, uid, result);

    return { ...result, auditLogId };
  } catch (err) {
    const message = (err as Error).message;
    await writeAuditLog(db, uid, {
      success: false,
      userId: uid,
      deletedDocuments,
      anonymizedDocuments: 0,
      errors: [message],
    });
    throw new functions.https.HttpsError('internal', message);
  }
});
