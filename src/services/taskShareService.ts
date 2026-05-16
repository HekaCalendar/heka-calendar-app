/**
 * Task Share Service - Enterprise Grade Task Sharing
 * Enables sharing tasks with new and existing users
 * 
 * Features:
 * - Public share links for tasks
 * - Deep linking to task acceptance
 * - Auto-friendship on task acceptance
 * - Task preview for non-users
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  collection,
} from 'firebase/firestore';
import { db, getCurrentUser } from './firebase';
import { NotificationEngine } from './notificationEngine';
import { ensureUserProfile, getFriendshipId, getConversationId, createInviteCode } from './friendsService';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SharedTask {
  id: string;
  taskId: string;
  creatorId: string;
  creatorName: string;
  creatorPhotoURL?: string;
  title: string;
  description: string;
  hekaDate?: { year: number; month: number; day: number };
  shareCode: string;
  status: 'pending' | 'accepted' | 'declined' | 'revoked';
  expiresAt: Timestamp;
  acceptedBy?: string;
  acceptedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface TaskPreview {
  id: string;
  title: string;
  description: string;
  hekaDate?: { year: number; month: number; day: number };
  creatorName: string;
  creatorPhotoURL?: string;
  isExpired: boolean;
  isAccepted: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARE CODE GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3) code += '-'; // Format: XXXX-XXXX
  }
  return code;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE SHAREABLE TASK
// ═══════════════════════════════════════════════════════════════════════════════

export async function createShareableTask(
  title: string,
  description: string,
  hekaDate?: { year: number; month: number; day: number }
): Promise<{ success: boolean; shareCode?: string; shareLink?: string; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) {
    return { success: false, error: 'Not authenticated' };
  }

  // ENSURE user has a proper display name set - require profile setup
  if (!currentUser.displayName || currentUser.displayName.trim() === '') {
    return { 
      success: false, 
      error: 'Please set up your profile name before sharing tasks. Go to Circle settings.' 
    };
  }

  // Ensure user has a profile in Firestore
  await ensureUserProfile();

  const shareCode = generateShareCode();
  // Use shareCode as the document ID for easy lookup
  const shareRef = doc(db, 'sharedTasks', shareCode);

  // Build task object with VERIFIED display name from Firebase Auth
  // This ensures the name shown on the landing page is the user's real account name
  const sharedTask: Record<string, unknown> = {
    taskId: '', // Will be filled when accepted
    creatorId: currentUser.uid,
    creatorName: currentUser.displayName, // Verified Firebase Auth display name
    title,
    description,
    shareCode,
    status: 'pending',
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
    createdAt: Timestamp.now(),
  };

  // Only add optional fields if they have values (Firestore rejects undefined)
  if (currentUser.photoURL) {
    sharedTask.creatorPhotoURL = currentUser.photoURL;
  }
  if (hekaDate) {
    sharedTask.hekaDate = hekaDate;
  }

  await setDoc(shareRef, sharedTask);

  // Create a unified invite for the landing page
  const inviteCode = await createInviteCode('task', shareCode);

  // Generate share link using the unified invite landing page
  const shareLink = inviteCode
    ? generateInviteTaskShareLink(inviteCode, title, currentUser.displayName || undefined, shareCode)
    : generateTaskShareLink(shareCode, title, currentUser.displayName || undefined);

  return {
    success: true,
    shareCode,
    shareLink,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK SHARE LINKS - Smart Universal Links
// ═══════════════════════════════════════════════════════════════════════════════

// Play Store URL for the app
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.heka.calendar';

// Web landing page base URL (fallback if no custom domain yet)
// For now, we'll use a data URL approach or a simple redirect page
const WEB_LANDING_BASE = 'https://heka-calendar-pro.vercel.app/task';

/**
 * Generate a smart share link that works for both app and web
 * This creates a link that:
 * 1. Opens the app directly if installed (heka-calendar://)
 * 2. Falls back to web landing page if not installed
 * 3. Web page shows preview + Play Store link with code preserved
 * 
 * EMBEDS task data in URL so landing page works without Firestore auth
 */
export function generateTaskShareLink(shareCode: string, title?: string, creatorName?: string): string {
  // Build URL with embedded data for landing page (avoids 403 Firestore issues)
  const params = new URLSearchParams();
  params.set('code', shareCode);
  if (title) params.set('title', encodeURIComponent(title));
  if (creatorName) params.set('from', encodeURIComponent(creatorName));
  
  return `${WEB_LANDING_BASE}?${params.toString()}`;
}

/**
 * Generate a share link using the unified invite landing page
 * This redirects to /invite with task preview embedded
 */
export function generateInviteTaskShareLink(inviteCode: string, title?: string, creatorName?: string, taskCode?: string): string {
  const INVITE_LANDING_BASE = 'https://heka-calendar-pro.vercel.app/invite';
  const params = new URLSearchParams();
  params.set('code', inviteCode);
  params.set('type', 'task');
  if (title) params.set('taskTitle', encodeURIComponent(title));
  if (creatorName) {
    params.set('from', encodeURIComponent(creatorName));
  }
  if (taskCode) {
    params.set('taskCode', taskCode);
  }
  return `${INVITE_LANDING_BASE}?${params.toString()}`;
}

/**
 * Generate a smart universal link that handles both app and web
 * Uses a web URL with deep link fallback
 */
export function generateSmartTaskLink(shareCode: string): string {
  // For now, use the web landing page URL
  // This page will:
  // 1. Try to open the app via heka-calendar://task/XXXX
  // 2. If app not installed, show task preview + Play Store button
  // 3. Pass the code through app install via referrrer or session
  return `${WEB_LANDING_BASE}?code=${shareCode}`;
}

/**
 * Generate web-only link for SMS/email that doesn't require app
 */
export function generateWebTaskShareLink(shareCode: string): string {
  return `${WEB_LANDING_BASE}?code=${shareCode}`;
}

/**
 * Generate a native app deep link (for when app is known to be installed)
 */
export function generateNativeTaskLink(shareCode: string): string {
  return `heka-calendar://task/${shareCode}`;
}

/**
 * Generate share text with instructions
 */
export function generateTaskShareText(title: string, shareCode: string, creatorName: string): string {
  const link = generateSmartTaskLink(shareCode);
  
  // SECURITY: Validate creator name in share text too
  const safeCreatorName = (creatorName && creatorName !== 'Anonymous') 
    ? creatorName 
    : 'A friend';
  
  return `📜 Task from ${safeCreatorName} on HEKA Calendar

"${title}"

Accept this task: ${link}

Don't have the app? Download it here: ${PLAY_STORE_URL} 🔮`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET TASK PREVIEW (For non-users)
// ═══════════════════════════════════════════════════════════════════════════════

export async function getTaskPreview(shareCode: string): Promise<TaskPreview | null> {
  if (!db) return null;

  const shareRef = doc(db, 'sharedTasks', shareCode);
  const shareSnap = await getDoc(shareRef);

  if (!shareSnap.exists()) {
    return null;
  }

  const sharedTask = shareSnap.data() as SharedTask;

  return {
    id: shareCode,
    title: sharedTask.title,
    description: sharedTask.description,
    hekaDate: sharedTask.hekaDate,
    creatorName: sharedTask.creatorName,
    creatorPhotoURL: sharedTask.creatorPhotoURL,
    isExpired: sharedTask.expiresAt.toMillis() < Date.now(),
    isAccepted: sharedTask.status === 'accepted',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCEPT SHARED TASK
// ═══════════════════════════════════════════════════════════════════════════════

export async function acceptSharedTask(
  shareCode: string
): Promise<{ success: boolean; taskId?: string; friendshipCreated?: boolean; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) {
    return { success: false, error: 'Not authenticated' };
  }

  // Ensure current user has a profile
  await ensureUserProfile();

  const shareRef = doc(db, 'sharedTasks', shareCode);
  const shareSnap = await getDoc(shareRef);

  if (!shareSnap.exists()) {
    return { success: false, error: 'Task not found' };
  }

  const sharedTask = shareSnap.data() as SharedTask;

  // Validations
  if (sharedTask.expiresAt.toMillis() < Date.now()) {
    return { success: false, error: 'Task has expired' };
  }

  if (sharedTask.status === 'accepted') {
    return { success: false, error: 'Task already accepted' };
  }

  if (sharedTask.creatorId === currentUser.uid) {
    return { success: false, error: 'Cannot accept your own task' };
  }

  const batch = writeBatch(db);

  // Create the actual task
  const taskRef = doc(collection(db, 'tasks'));
  const taskData = {
    creatorId: sharedTask.creatorId,
    assigneeId: currentUser.uid,
    title: sharedTask.title,
    description: sharedTask.description,
    hekaDate: sharedTask.hekaDate,
    status: 'pending',
    createdAt: Timestamp.now(),
    conversationId: getConversationId(sharedTask.creatorId, currentUser.uid),
  };

  batch.set(taskRef, taskData);

  // Update shared task
  batch.update(shareRef, {
    status: 'accepted',
    acceptedBy: currentUser.uid,
    acceptedAt: Timestamp.now(),
    taskId: taskRef.id,
  });

  // Check if friendship exists
  const friendshipId = getFriendshipId(currentUser.uid, sharedTask.creatorId);
  const friendshipRef = doc(db, 'friendships', friendshipId);
  const friendshipSnap = await getDoc(friendshipRef);

  let friendshipCreated = false;

  if (!friendshipSnap.exists()) {
    // Create friendship as PENDING (must be accepted before chat is enabled)
    batch.set(friendshipRef, {
      id: friendshipId,
      users: [currentUser.uid, sharedTask.creatorId],
      status: 'pending',
      initiatedBy: sharedTask.creatorId,
      source: 'task_share',
      linkedTaskId: taskRef.id,
      createdAt: serverTimestamp(),
    });

    friendshipCreated = true;
  }

  await batch.commit();

  // Notify creator
  try {
    await NotificationEngine.notifyCore(
      'task-completed',
      'circle',
      'Task Accepted',
      `${currentUser.displayName || 'Someone'} accepted your task: ${sharedTask.title}`,
      { taskId: taskRef.id },
      parseInt(taskRef.id.slice(-8), 16) || undefined
    );
  } catch (err) {
    console.error('[TaskShareService] Failed to send task completion notification:', err);
  }

  return {
    success: true,
    taskId: taskRef.id,
    friendshipCreated,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECLINE SHARED TASK
// ═══════════════════════════════════════════════════════════════════════════════

export async function declineSharedTask(
  shareCode: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) {
    return { success: false, error: 'Not authenticated' };
  }

  const shareRef = doc(db, 'sharedTasks', shareCode);
  const shareSnap = await getDoc(shareRef);

  if (!shareSnap.exists()) {
    return { success: false, error: 'Task not found' };
  }

  const sharedTask = shareSnap.data() as SharedTask;

  if (sharedTask.status !== 'pending') {
    return { success: false, error: 'Task already processed' };
  }

  await updateDoc(shareRef, {
    status: 'declined',
    declinedReason: reason,
    declinedBy: currentUser.uid,
    declinedAt: Timestamp.now(),
  });

  // Notify creator
  try {
    await NotificationEngine.notifyCore(
      'task-declined',
      'circle',
      'Task Declined',
      `${currentUser.displayName || 'Someone'} declined your task: ${sharedTask.title}${reason ? ` - ${reason}` : ''}`,
      { shareCode },
      parseInt(shareCode.slice(-8), 36) || undefined
    );
  } catch (err) {
    console.error('[TaskShareService] Failed to send task declined notification:', err);
  }

  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET SHARED TASKS FOR CREATOR (all statuses)
// ═══════════════════════════════════════════════════════════════════════════════

export async function getCreatorSharedTasks(): Promise<SharedTask[]> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return [];

  const sharedQuery = query(
    collection(db, 'sharedTasks'),
    where('creatorId', '==', currentUser.uid)
  );

  const snapshot = await getDocs(sharedQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SharedTask));
}

export async function getPendingSharedTasks(): Promise<SharedTask[]> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return [];

  // Get tasks created by user that are pending
  const sharedQuery = query(
    collection(db, 'sharedTasks'),
    where('creatorId', '==', currentUser.uid),
    where('status', '==', 'pending')
  );

  const snapshot = await getDocs(sharedQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SharedTask));
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVOKE SHARED TASK (creator cancels before acceptance)
// ═══════════════════════════════════════════════════════════════════════════════

export async function revokeSharedTask(
  shareCode: string
): Promise<{ success: boolean; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) {
    return { success: false, error: 'Not authenticated' };
  }

  const shareRef = doc(db, 'sharedTasks', shareCode);
  const shareSnap = await getDoc(shareRef);

  if (!shareSnap.exists()) {
    return { success: false, error: 'Task not found' };
  }

  const sharedTask = shareSnap.data() as SharedTask;

  if (sharedTask.creatorId !== currentUser.uid) {
    return { success: false, error: 'Only the creator can revoke this task' };
  }

  if (sharedTask.status !== 'pending') {
    return { success: false, error: 'Task already processed' };
  }

  await updateDoc(shareRef, {
    status: 'revoked',
    revokedAt: Timestamp.now(),
  });

  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIBE TO SHARED TASK UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

export function subscribeToSharedTask(
  shareCode: string,
  callback: (task: SharedTask | null) => void
): () => void {
  if (!db) return () => {};

  const shareRef = doc(db, 'sharedTasks', shareCode);
  return onSnapshot(shareRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() } as SharedTask);
    } else {
      callback(null);
    }
  });
}

export function subscribeToCreatorSharedTasks(
  callback: (tasks: SharedTask[]) => void
): () => void {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return () => {};

  const sharedQuery = query(
    collection(db, 'sharedTasks'),
    where('creatorId', '==', currentUser.uid)
  );

  return onSnapshot(sharedQuery, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SharedTask));
    callback(tasks);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARSE DEEP LINK
// ═══════════════════════════════════════════════════════════════════════════════

export function parseTaskShareLink(url: string): { shareCode: string } | null {
  try {
    // Handle heka-calendar://task/XXXX-XXXX format
    if (url.startsWith('heka-calendar://task/')) {
      const code = url.replace('heka-calendar://task/', '');
      if (code && code.length === 9 && code[4] === '-') {
        return { shareCode: code };
      }
    }

    // Handle https://heka.calendar/task/XXXX-XXXX format
    if (url.includes('heka.calendar/task/')) {
      const match = url.match(/\/task\/([A-Z0-9]{4}-[A-Z0-9]{4})/);
      if (match) {
        return { shareCode: match[1] };
      }
    }

    return null;
  } catch (error) {
    console.error('[TaskShare] Error parsing link:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const TaskShareService = {
  createShareableTask,
  getTaskPreview,
  acceptSharedTask,
  declineSharedTask,
  revokeSharedTask,
  getCreatorSharedTasks,
  getPendingSharedTasks,
  subscribeToSharedTask,
  subscribeToCreatorSharedTasks,
  generateTaskShareLink,
  generateWebTaskShareLink,
  parseTaskShareLink,
  generateSmartTaskLink,
  generateNativeTaskLink,
  generateTaskShareText,
};
