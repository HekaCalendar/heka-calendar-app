/**
 * Cosmic Circle - Friends Service
 * Firestore integration for friendships, messaging, and task rituals
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  arrayUnion,
  writeBatch,
} from 'firebase/firestore';
import { db, getCurrentUser } from './firebase';
import { NotificationEngine } from './notificationEngine';

// ============================================================================
// Types
// ============================================================================

export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';
export type TaskStatus = 'pending' | 'accepted' | 'completed' | 'declined' | 'revoked';

export interface FriendProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  lastActive: Timestamp;
  isOnline: boolean;
  currentView?: string; // e.g., "Arc 3 - Day 12"
}

export interface Friendship {
  id: string;
  users: [string, string]; // [userId1, userId2]
  status: FriendshipStatus;
  initiatedBy: string;
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  declinedAt?: Timestamp;
  source?: 'invite' | 'task_share' | 'direct';
  linkedTaskId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
  type: 'text' | 'task' | 'system';
  metadata?: {
    taskId?: string;
    celestialEvent?: string;
    reaction?: string;
  };
  reactions?: Record<string, string>; // userId -> emoji
}

export interface TaskRitual {
  id: string;
  creatorId: string;
  assigneeId: string;
  title: string;
  description: string;
  hekaDate?: {
    year: number;
    month: number;
    day: number;
  };
  civilDate?: Timestamp;
  status: TaskStatus;
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  completedAt?: Timestamp;
  revokedAt?: Timestamp;
  declinedReason?: string;
  conversationId: string; // Link to the conversation where it was created
}

export interface Conversation {
  id: string;
  participants: [string, string];
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
    type: 'text' | 'task';
  };
  unreadCount: Record<string, number>; // userId -> count
  updatedAt: Timestamp;
}

export interface InviteCode {
  code: string;
  createdBy: string;
  creatorName: string;
  creatorPhotoURL?: string;
  expiresAt: Timestamp;
  maxUses: number;
  usedCount: number;
  usedBy: string[];
  type?: 'friend' | 'task';
  linkedTaskCode?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getFriendshipId(uid1: string, uid2: string): string {
  // Consistent ordering for friendship ID
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

export function getConversationId(uid1: string, uid2: string): string {
  return uid1 < uid2 ? `conv_${uid1}_${uid2}` : `conv_${uid2}_${uid1}`;
}

function generateInviteCode(): string {
  const adjectives = ['AURORA', 'NEBULA', 'SOLAR', 'LUNAR', 'COSMIC', 'STELLAR', 'ASTRAL'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const code = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${adj}-${code}`;
}

// ============================================================================
// Friendship Operations
// ============================================================================

export async function createInviteCode(type: 'friend' | 'task' = 'friend', linkedTaskCode?: string): Promise<string | null> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return null;

  const code = generateInviteCode();
  const inviteRef = doc(db, 'invites', code);
  
  const inviteData: Record<string, unknown> = {
    code,
    createdBy: currentUser.uid,
    creatorName: currentUser.displayName || 'Cosmic Traveler',
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
    maxUses: 5,
    usedCount: 0,
    usedBy: [],
    type,
  };

  if (currentUser.photoURL) {
    inviteData.creatorPhotoURL = currentUser.photoURL;
  }
  if (linkedTaskCode) {
    inviteData.linkedTaskCode = linkedTaskCode;
  }

  await setDoc(inviteRef, inviteData);

  return code;
}

export async function ensureUserProfile(): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return;

  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create new user profile
    await setDoc(userRef, {
      uid: currentUser.uid,
      displayName: currentUser.displayName || 'Anonymous',
      photoURL: currentUser.photoURL || null,
      email: currentUser.email,
      lastActive: serverTimestamp(),
      isOnline: true,
      createdAt: serverTimestamp(),
    });
  } else {
    // Update online status and last active
    await updateDoc(userRef, {
      lastActive: serverTimestamp(),
      isOnline: true,
      // Update display name and photo if they've changed
      ...(currentUser.displayName && { displayName: currentUser.displayName }),
      ...(currentUser.photoURL && { photoURL: currentUser.photoURL }),
    });
  }
}

export async function acceptInvite(code: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return { success: false, error: 'Not authenticated' };

  // Ensure current user has a profile
  await ensureUserProfile();

  const inviteRef = doc(db, 'invites', code.toUpperCase());
  const inviteSnap = await getDoc(inviteRef);

  if (!inviteSnap.exists()) {
    return { success: false, error: 'Invalid invite code' };
  }

  const invite = inviteSnap.data() as InviteCode;
  
  if (invite.expiresAt.toMillis() < Date.now()) {
    return { success: false, error: 'Invite code expired' };
  }
  
  if (invite.usedCount >= invite.maxUses) {
    return { success: false, error: 'Invite code fully used' };
  }
  
  if (invite.usedBy.includes(currentUser.uid)) {
    return { success: false, error: 'You already used this code' };
  }
  
  if (invite.createdBy === currentUser.uid) {
    return { success: false, error: 'Cannot use your own code' };
  }

  // Check if friendship already exists
  const friendshipId = getFriendshipId(currentUser.uid, invite.createdBy);
  const friendshipRef = doc(db, 'friendships', friendshipId);
  const friendshipSnap = await getDoc(friendshipRef);
  
  if (friendshipSnap.exists()) {
    return { success: false, error: 'Already friends with this user' };
  }

  // Ensure the inviter has a profile too
  const inviterRef = doc(db, 'users', invite.createdBy);
  const inviterSnap = await getDoc(inviterRef);
  if (!inviterSnap.exists()) {
    // Create a basic profile for the inviter if they don't have one
    await setDoc(inviterRef, {
      uid: invite.createdBy,
      displayName: 'Cosmic Traveler',
      photoURL: null,
      lastActive: serverTimestamp(),
      isOnline: false,
      createdAt: serverTimestamp(),
    });
  }

  const batch = writeBatch(db);

  // Create friendship as PENDING (must be accepted by invitee)
  batch.set(friendshipRef, {
    id: friendshipId,
    users: [currentUser.uid, invite.createdBy],
    status: 'pending',
    initiatedBy: invite.createdBy,
    source: invite.type === 'task' ? 'task_share' : 'invite',
    createdAt: serverTimestamp(),
  });

  // Update invite
  batch.update(inviteRef, {
    usedCount: invite.usedCount + 1,
    usedBy: arrayUnion(currentUser.uid),
  });

  await batch.commit();
  return { success: true };
}

export async function getFriends(): Promise<FriendProfile[]> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return [];

  const friendshipsQuery = query(
    collection(db, 'friendships'),
    where('users', 'array-contains', currentUser.uid),
    where('status', '==', 'accepted')
  );

  const snapshot = await getDocs(friendshipsQuery);
  const friendIds: string[] = [];
  
  snapshot.docs.forEach(doc => {
    const data = doc.data() as Friendship;
    const friendId = data.users.find(uid => uid !== currentUser.uid);
    if (friendId) friendIds.push(friendId);
  });

  // Fetch friend profiles
  const friendProfiles: FriendProfile[] = [];
  for (const friendId of friendIds) {
    const profileRef = doc(db, 'users', friendId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      friendProfiles.push(profileSnap.data() as FriendProfile);
    }
  }

  return friendProfiles;
}

export function subscribeToFriends(callback: (friends: FriendProfile[]) => void): () => void {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return () => {};

  const friendshipsQuery = query(
    collection(db, 'friendships'),
    where('users', 'array-contains', currentUser.uid),
    where('status', '==', 'accepted')
  );

  return onSnapshot(friendshipsQuery, async (snapshot) => {
    const friendIds: string[] = [];
    snapshot.docs.forEach(doc => {
      const data = doc.data() as Friendship;
      const friendId = data.users.find(uid => uid !== currentUser.uid);
      if (friendId) friendIds.push(friendId);
    });

    // Fetch friend profiles
    const friendProfiles: FriendProfile[] = [];
    for (const friendId of friendIds) {
      const profileRef = doc(db, 'users', friendId);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        friendProfiles.push(profileSnap.data() as FriendProfile);
      }
    }

    callback(friendProfiles);
  });
}

// ============================================================================
// Friend Request Operations
// ============================================================================

export async function getPendingFriendRequests(): Promise<FriendProfile[]> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return [];

  const friendshipsQuery = query(
    collection(db, 'friendships'),
    where('users', 'array-contains', currentUser.uid),
    where('status', '==', 'pending')
  );

  const snapshot = await getDocs(friendshipsQuery);
  const friendIds: string[] = [];

  snapshot.docs.forEach(doc => {
    const data = doc.data() as Friendship;
    const friendId = data.users.find(uid => uid !== currentUser.uid);
    if (friendId) friendIds.push(friendId);
  });

  const friendProfiles: FriendProfile[] = [];
  for (const friendId of friendIds) {
    const profileRef = doc(db, 'users', friendId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      friendProfiles.push(profileSnap.data() as FriendProfile);
    }
  }

  return friendProfiles;
}

export function subscribeToFriendRequests(callback: (requests: FriendProfile[]) => void): () => void {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return () => {};

  const friendshipsQuery = query(
    collection(db, 'friendships'),
    where('users', 'array-contains', currentUser.uid),
    where('status', '==', 'pending')
  );

  return onSnapshot(friendshipsQuery, async (snapshot) => {
    const friendIds: string[] = [];
    const notifiedIds = new Set(JSON.parse(localStorage.getItem('heka_notified_friend_requests') || '[]') as string[]);
    const newNotifiedIds = new Set(notifiedIds);

    snapshot.docs.forEach(doc => {
      const data = doc.data() as Friendship;
      const friendId = data.users.find(uid => uid !== currentUser.uid);
      if (friendId) friendIds.push(friendId);

      // Notify for new friend requests
      if (friendId && !notifiedIds.has(doc.id)) {
        newNotifiedIds.add(doc.id);
        void NotificationEngine.notifyStandard(
          'friend-request',
          'circle',
          'New Cosmic Connection',
          `Someone has sent you a friend request. Open your Circle to connect.`,
          new Date(Date.now() + 5000),
          { friendRequestId: doc.id },
          parseInt(doc.id.slice(-8), 16) || undefined
        );
      }
    });

    // Save notified IDs
    if (newNotifiedIds.size !== notifiedIds.size) {
      localStorage.setItem('heka_notified_friend_requests', JSON.stringify([...newNotifiedIds]));
    }

    const friendProfiles: FriendProfile[] = [];
    for (const friendId of friendIds) {
      const profileRef = doc(db, 'users', friendId);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        friendProfiles.push(profileSnap.data() as FriendProfile);
      }
    }

    callback(friendProfiles);
  });
}

export async function acceptFriendRequest(friendshipId: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return { success: false, error: 'Not authenticated' };

  const friendshipRef = doc(db, 'friendships', friendshipId);
  const friendshipSnap = await getDoc(friendshipRef);

  if (!friendshipSnap.exists()) {
    return { success: false, error: 'Friend request not found' };
  }

  const friendship = friendshipSnap.data() as Friendship;
  if (!friendship.users.includes(currentUser.uid)) {
    return { success: false, error: 'Not authorized' };
  }

  if (friendship.status !== 'pending') {
    return { success: false, error: 'Request already processed' };
  }

  const batch = writeBatch(db);

  // Update friendship to accepted
  batch.update(friendshipRef, {
    status: 'accepted',
    acceptedAt: serverTimestamp(),
  });

  // Create conversation
  const otherUserId = friendship.users.find(uid => uid !== currentUser.uid)!;
  const conversationId = getConversationId(currentUser.uid, otherUserId);
  batch.set(doc(db, 'conversations', conversationId), {
    id: conversationId,
    participants: [currentUser.uid, otherUserId],
    lastMessage: {
      text: 'Friendship created! Start your cosmic conversation.',
      senderId: 'system',
      timestamp: serverTimestamp(),
      type: 'system',
    },
    unreadCount: { [currentUser.uid]: 0, [otherUserId]: 0 },
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
  return { success: true };
}

export async function declineFriendRequest(friendshipId: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return { success: false, error: 'Not authenticated' };

  const friendshipRef = doc(db, 'friendships', friendshipId);
  const friendshipSnap = await getDoc(friendshipRef);

  if (!friendshipSnap.exists()) {
    return { success: false, error: 'Friend request not found' };
  }

  const friendship = friendshipSnap.data() as Friendship;
  if (!friendship.users.includes(currentUser.uid)) {
    return { success: false, error: 'Not authorized' };
  }

  if (friendship.status !== 'pending') {
    return { success: false, error: 'Request already processed' };
  }

  await updateDoc(friendshipRef, {
    status: 'declined',
    declinedAt: serverTimestamp(),
  });

  return { success: true };
}

// ============================================================================
// Messaging Operations
// ============================================================================

export async function sendMessage(
  conversationId: string,
  text: string,
  type: 'text' | 'task' = 'text',
  metadata?: Message['metadata']
): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return;

  const messagesRef = collection(db, 'messages', conversationId, 'messages');
  const messageDoc = doc(messagesRef);
  const conversationRef = doc(db, 'conversations', conversationId);

  const batch = writeBatch(db);

  // Add message
  batch.set(messageDoc, {
    id: messageDoc.id,
    conversationId,
    senderId: currentUser.uid,
    text,
    timestamp: serverTimestamp(),
    type,
    metadata: metadata || null,
    reactions: {},
  });

  // Update conversation
  const conversationSnap = await getDoc(conversationRef);
  if (conversationSnap.exists()) {
    const conversation = conversationSnap.data() as Conversation;
    const otherUserId = conversation.participants.find(uid => uid !== currentUser.uid);
    
    batch.update(conversationRef, {
      lastMessage: {
        text,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        type,
      },
      [`unreadCount.${otherUserId}`]: (conversation.unreadCount[otherUserId!] || 0) + 1,
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
}

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: Message[]) => void
): () => void {
  if (!db) return () => {};

  const messagesQuery = query(
    collection(db, 'messages', conversationId, 'messages'),
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs
      .map(doc => doc.data() as Message)
      .reverse();
    callback(messages);
  });
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return;

  const conversationRef = doc(db, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    [`unreadCount.${currentUser.uid}`]: 0,
  });
}

// ============================================================================
// Task Ritual Operations
// ============================================================================

export async function createTaskRitual(
  assigneeId: string,
  title: string,
  description: string,
  hekaDate?: { year: number; month: number; day: number }
): Promise<TaskRitual | null> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return null;

  const conversationId = getConversationId(currentUser.uid, assigneeId);
  const taskRef = doc(collection(db, 'tasks'));

  const task: Omit<TaskRitual, 'id'> = {
    creatorId: currentUser.uid,
    assigneeId,
    title,
    description,
    hekaDate,
    status: 'pending',
    createdAt: Timestamp.now(),
    conversationId,
  };

  await setDoc(taskRef, task);

  // Send message about the task
  await sendMessage(
    conversationId,
    `📜 Task Ritual: ${title}`,
    'task',
    { taskId: taskRef.id }
  );

  // Send notification to assignee
  const creatorName = currentUser.displayName || 'Someone';
  const hekaDateStr = hekaDate ? ` (Due: ${hekaDate.day}.${hekaDate.month + 1}.${hekaDate.year})` : '';
  
  // Schedule immediate notification via unified engine
  void NotificationEngine.notifyCore(
    'task-assigned',
    'circle',
    'New Task from Cosmic Circle',
    `${creatorName} assigned you: ${title}${hekaDateStr}`,
    { taskId: taskRef.id, assigneeId },
    parseInt(taskRef.id.slice(-8), 16) || undefined
  );

  return { id: taskRef.id, ...task };
}

export async function respondToTask(
  taskId: string,
  status: 'accepted' | 'declined' | 'completed',
  declinedReason?: string
): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return;

  const taskRef = doc(db, 'tasks', taskId);
  const update: Partial<TaskRitual> = { status };

  if (status === 'accepted') {
    update.acceptedAt = Timestamp.now();
  } else if (status === 'completed') {
    update.completedAt = Timestamp.now();
  } else if (status === 'declined') {
    update.declinedReason = declinedReason;
  }

  await updateDoc(taskRef, update);
}

export async function revokeTask(taskId: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) {
    return { success: false, error: 'Not authenticated' };
  }

  const taskRef = doc(db, 'tasks', taskId);
  const taskSnap = await getDoc(taskRef);

  if (!taskSnap.exists()) {
    return { success: false, error: 'Task not found' };
  }

  const task = taskSnap.data() as TaskRitual;

  if (task.creatorId !== currentUser.uid) {
    return { success: false, error: 'Only the creator can revoke this task' };
  }

  if (task.status !== 'pending') {
    return { success: false, error: 'Task already processed' };
  }

  await updateDoc(taskRef, {
    status: 'revoked',
    revokedAt: Timestamp.now(),
  });

  return { success: true };
}

export function subscribeToTasks(callback: (tasks: TaskRitual[]) => void): () => void {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return () => {};

  // Get tasks where user is creator or assignee
  const tasksQuery = query(
    collection(db, 'tasks'),
    where('creatorId', '==', currentUser.uid)
  );

  const assignedQuery = query(
    collection(db, 'tasks'),
    where('assigneeId', '==', currentUser.uid)
  );

  let allTasks: TaskRitual[] = [];

  const unsubscribe1 = onSnapshot(tasksQuery, (snapshot) => {
    const createdTasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TaskRitual[];
    
    allTasks = [...createdTasks, ...allTasks.filter(t => t.creatorId !== currentUser.uid)];
    callback(allTasks);
  });

  const unsubscribe2 = onSnapshot(assignedQuery, (snapshot) => {
    const assignedTasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TaskRitual[];
    
    allTasks = [...allTasks.filter(t => t.assigneeId !== currentUser.uid), ...assignedTasks];
    callback(allTasks);
  });

  return () => {
    unsubscribe1();
    unsubscribe2();
  };
}

// ============================================================================
// Presence Operations
// ============================================================================

export async function updatePresence(currentView?: string): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || !db) return;

  const userRef = doc(db, 'users', currentUser.uid);
  await setDoc(userRef, {
    uid: currentUser.uid,
    displayName: currentUser.displayName || 'Anonymous',
    photoURL: currentUser.photoURL,
    lastActive: serverTimestamp(),
    isOnline: true,
    currentView,
  }, { merge: true });
}

export function subscribeToFriendPresence(
  friendId: string,
  callback: (profile: FriendProfile | null) => void
): () => void {
  if (!db) return () => {};

  const userRef = doc(db, 'users', friendId);
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as FriendProfile);
    } else {
      callback(null);
    }
  });
}

// ============================================================================
// Export
// ============================================================================

export const FriendsService = {
  createInviteCode,
  acceptInvite,
  getFriends,
  subscribeToFriends,
  getPendingFriendRequests,
  subscribeToFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  sendMessage,
  subscribeToMessages,
  markConversationRead,
  createTaskRitual,
  respondToTask,
  revokeTask,
  subscribeToTasks,
  updatePresence,
  subscribeToFriendPresence,
  ensureUserProfile,
  getFriendshipId,
  getConversationId,
};
