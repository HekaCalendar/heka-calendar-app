/**
 * User data deletion helper
 * Implements a best-effort GDPR/CCPA-aligned deletion of personal data
 * before Firebase Auth account deletion.
 *
 * NOTE: For a fully robust enterprise implementation, the bulk of this
 * should eventually move to a Firebase Callable Function running with
 * the Admin SDK (it can delete/anonymize shared sub-collections and
 * back-ups more reliably). The client-side helper below deletes what
 * it has permission to delete and surfaces any failures.
 */

import { db, auth, functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';

export interface DeletionResult {
  success: boolean;
  localCleared: boolean;
  cloudItemsDeleted: number;
  serverDeletedDocuments?: number;
  serverAnonymizedDocuments?: number;
  auditLogId?: string;
  errors: string[];
}

async function deleteCollectionDocs(pathSegments: string[]): Promise<number> {
  if (!db) return 0;
  const colRef = (collection as any)(db, ...pathSegments);
  const snap = await getDocs(colRef);
  let count = 0;
  for (const d of snap.docs) {
    await deleteDoc(d.ref);
    count++;
  }
  return count;
}

async function deleteQueryDocs(pathSegments: string[], field: string, value: string): Promise<number> {
  if (!db) return 0;
  const colRef = (collection as any)(db, ...pathSegments);
  const q = query(colRef, where(field, '==', value));
  const snap = await getDocs(q);
  let count = 0;
  // Firestore batches are limited to 500 operations.
  let batch = writeBatch(db);
  let batchOps = 0;
  for (const d of snap.docs) {
    batch.delete(d.ref);
    batchOps++;
    count++;
    if (batchOps >= 450) {
      await batch.commit();
      batch = writeBatch(db);
      batchOps = 0;
    }
  }
  if (batchOps > 0) {
    await batch.commit();
  }
  return count;
}

function clearLocalData(): void {
  if (typeof window === 'undefined') return;
  try {
    // Remove all HEKA localStorage keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('heka') || key.startsWith('firebase:') || key.startsWith('hec-'))) {
        localStorage.removeItem(key);
      }
    }
    // Clear sessionStorage too
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('heka')) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error('[Deletion] Failed to clear local storage:', e);
  }
}

async function clearIndexedDB(): Promise<void> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return;
  try {
    const databases = await (window as any).indexedDB.databases?.() || [];
    for (const dbInfo of databases) {
      const name = dbInfo.name;
      if (name && name.startsWith('heka')) {
        (window as any).indexedDB.deleteDatabase(name);
      }
    }
  } catch (e) {
    console.error('[Deletion] Failed to clear IndexedDB:', e);
  }
}

/**
 * Delete all personal data we can reach from the client.
 * Does NOT delete the Firebase Auth account itself — callers should do that next.
 */
export async function deleteUserPersonalData(): Promise<DeletionResult> {
  const result: DeletionResult = {
    success: true,
    localCleared: false,
    cloudItemsDeleted: 0,
    errors: [],
  };

  const user = auth?.currentUser;
  const uid = user?.uid;

  try {
    clearLocalData();
    await clearIndexedDB();
    result.localCleared = true;
  } catch (e) {
    result.errors.push(`Local data cleanup failed: ${(e as Error).message}`);
    result.success = false;
  }

  if (!db || !uid) {
    return result;
  }

  try {
    // Personal sub-collections under users/{uid}
    result.cloudItemsDeleted += await deleteCollectionDocs(['users', uid, 'astroProfiles']);
    result.cloudItemsDeleted += await deleteCollectionDocs(['users', uid, 'astroCharts']);
    result.cloudItemsDeleted += await deleteCollectionDocs(['users', uid, 'plannerTasks']);

    // Top-level user document
    await deleteDoc(doc(db, 'users', uid));
    result.cloudItemsDeleted += 1;

    // Social / shared data where the user is a direct participant.
    result.cloudItemsDeleted += await deleteQueryDocs(['friendships'], 'users', uid);
    result.cloudItemsDeleted += await deleteQueryDocs(['energyVotes'], 'userId', uid);
    result.cloudItemsDeleted += await deleteQueryDocs(['pushTokens'], 'userId', uid);
  } catch (e) {
    result.errors.push(`Cloud data cleanup failed: ${(e as Error).message}`);
    result.success = false;
  }

  // Server-side deletion for shared/anonymized data and immutable audit log.
  try {
    if (functions) {
      const deleteCallable = httpsCallable(functions, 'deleteUserData');
      const response = await deleteCallable({ uid });
      const serverResult = (response.data || {}) as {
        deletedDocuments?: number;
        anonymizedDocuments?: number;
        auditLogId?: string;
      };
      result.serverDeletedDocuments = serverResult.deletedDocuments;
      result.serverAnonymizedDocuments = serverResult.anonymizedDocuments;
      result.auditLogId = serverResult.auditLogId;
    }
  } catch (e) {
    result.errors.push(`Server-side deletion failed: ${(e as Error).message}`);
    result.success = false;
  }

  return result;
}
