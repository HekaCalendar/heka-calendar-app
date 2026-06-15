"use strict";
/**
 * Server-side account deletion Callable Function.
 *
 * - Authenticates the caller.
 * - Deletes or anonymizes Firestore documents owned by the user.
 * - Handles shared data by removing user references.
 * - Writes an immutable audit log.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserData = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
/**
 * Delete all documents in a collection group where the document path starts
 * with the user's UID (e.g., users/{uid}/sub/{id}).
 */
async function deleteSubcollection(db, parentPath, subcollection, batchSize = 500) {
    const snapshot = await db
        .collection(`${parentPath}/${subcollection}`)
        .limit(batchSize)
        .get();
    if (snapshot.empty)
        return 0;
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    return snapshot.size + (snapshot.size === batchSize ? await deleteSubcollection(db, parentPath, subcollection, batchSize) : 0);
}
/**
 * Remove user references from shared / anonymized documents without deleting
 * content that belongs to the community.
 */
async function anonymizeSharedData(db, uid) {
    const errors = [];
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
    }
    catch (err) {
        errors.push(`holiday_suggestions: ${err.message}`);
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
    }
    catch (err) {
        errors.push(`feature_votes: ${err.message}`);
    }
    return { count, errors };
}
/**
 * Write an immutable audit log entry.
 */
async function writeAuditLog(db, uid, result) {
    const logRef = await db.collection('deletion_audit_logs').add({
        ...result,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        immutable: true,
    });
    return logRef.id;
}
exports.deleteUserData = functions
    .region('australia-southeast1')
    .https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    const uid = context.auth.uid;
    const db = admin.firestore();
    const errors = [];
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
            }
            catch (err) {
                errors.push(`${sub}: ${err.message}`);
            }
        }
        try {
            await userRef.delete();
            deletedDocuments += 1;
        }
        catch (err) {
            errors.push(`users: ${err.message}`);
        }
        // Anonymize shared data.
        const { count, errors: anonErrors } = await anonymizeSharedData(db, uid);
        // Delete auth account (optional; the client can also do this).
        try {
            await admin.auth().deleteUser(uid);
        }
        catch (err) {
            errors.push(`auth: ${err.message}`);
        }
        const result = {
            success: errors.length === 0,
            userId: uid,
            deletedDocuments,
            anonymizedDocuments: count,
            errors: [...errors, ...anonErrors],
        };
        const auditLogId = await writeAuditLog(db, uid, result);
        return { ...result, auditLogId };
    }
    catch (err) {
        const message = err.message;
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
