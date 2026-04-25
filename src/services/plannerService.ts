/**
 * Planner Service
 * Firestore CRUD, real-time sync, and Circle sharing for Planner Tasks
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, auth, getCurrentUser, refreshAuthToken, withTemporaryFirestore } from './firebase';
import { cancelTaskReminder, scheduleTaskReminder, reconcileTaskNotifications } from './notificationService';
import { store } from '../store';
import { eventBus } from './eventBus';
import {
  syncPlannerTasks,
  addPlannerTask,
  updatePlannerTask,
  removePlannerTask,
} from '../store/plannerSlice';
import type { PlannerTask, HekaDate, NoteCategory, RecurringConfig } from '../types';
import { createShareableTask } from './taskShareService';
import { sendCompletionCelebration, scheduleStreakSaverIfNeeded } from './plannerNotificationService';
import { aiConfigService } from './aiConfigService';
import { hekaToCivil } from './calendarService';
import { detectArchetype } from '../oracle/archetypeEngine';
import { evaluateAndProtectStreak } from './streakProtectionService';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function getUserId(): string | null {
  const firebaseUid = getCurrentUser()?.uid || null;
  const reduxUid = store.getState().calendar.auth.userId || null;
  console.log('[plannerService/getUserId] firebaseUid:', firebaseUid, 'reduxUid:', reduxUid, 'reduxAuthenticated:', store.getState().calendar.auth.isAuthenticated);
  return firebaseUid;
}

function getUserTasksCollection() {
  const uid = getUserId();
  if (!uid || !db) throw new Error('Not authenticated or Firebase not configured');
  return collection(db, 'users', uid, 'plannerTasks');
}

function getTaskDocRef(taskId: string) {
  const uid = getUserId();
  if (!uid || !db) throw new Error('Not authenticated or Firebase not configured');
  return doc(db, 'users', uid, 'plannerTasks', taskId);
}

function buildDayKey(hekaDate: HekaDate): string {
  return `heka:${hekaDate.year}:${hekaDate.month}:${hekaDate.day}`;
}

function stripUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

function getAllTasks(): PlannerTask[] {
  const tasksByDay = store.getState().planner.tasks;
  return Object.values(tasksByDay).flat();
}

function getPendingTasksCount(): number {
  return getAllTasks().filter((t) => !t.isCompleted).length;
}

function getTodayCompletedTasksCount(): number {
  const today = new Date().toISOString().split('T')[0];
  return getAllTasks().filter((t) => t.isCompleted && t.completedAt?.startsWith(today)).length;
}

function inferPreferredTaskTime(dueTime?: string): 'morning' | 'afternoon' | 'evening' | 'night' | 'unknown' {
  if (!dueTime) return 'unknown';
  const hour = parseInt(dueTime.split(':')[0], 10);
  if (hour < 5) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

// ═══════════════════════════════════════════════════════════════════════════════
// LISTENER
// ═══════════════════════════════════════════════════════════════════════════════

let unsubscribeSnapshot: Unsubscribe | null = null;

/**
 * Attach real-time Firestore listener for the current user's planner tasks.
 * Call when auth is confirmed.
 */
export function attachPlannerListener(): void {
  detachPlannerListener();

  const uid = getUserId();
  if (!uid || !db) {
    console.warn('[PlannerService] Cannot attach listener: no auth or db');
    return;
  }

  const q = query(
    collection(db, 'users', uid, 'plannerTasks'),
    orderBy('createdAt', 'desc')
  );

  unsubscribeSnapshot = onSnapshot(
    q,
    (snapshot) => {
      const tasksByDay: Record<string, PlannerTask[]> = {};
      snapshot.forEach((docSnap) => {
        const task = { id: docSnap.id, ...docSnap.data() } as PlannerTask;
        if (!tasksByDay[task.dayKey]) {
          tasksByDay[task.dayKey] = [];
        }
        tasksByDay[task.dayKey].push(task);
      });

      // Sort each day's tasks by createdAt ascending for consistent display
      Object.keys(tasksByDay).forEach((dayKey) => {
        tasksByDay[dayKey].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });

      store.dispatch(syncPlannerTasks(tasksByDay));

      // Sync AI context with current planner state
      const allTasks = Object.values(tasksByDay).flat();
      const pendingTasks = allTasks.filter((t) => !t.isCompleted).length;
      const today = new Date().toISOString().split('T')[0];
      const todayCompleted = allTasks.filter((t) => t.isCompleted && t.completedAt?.startsWith(today)).length;
      const hasCreatedFirstTask = allTasks.length > 0 || aiConfigService.getUserContext().hasCreatedFirstTask;
      const mostRecentTask = allTasks.length > 0
        ? allTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        : null;
      aiConfigService.setUserContext({
        hasCreatedFirstTask,
        pendingTasks,
        todayTasksCompleted: todayCompleted,
        lastTaskCreationDate: mostRecentTask?.createdAt.split('T')[0] || aiConfigService.getUserContext().lastTaskCreationDate,
        lastTaskContent: mostRecentTask?.content?.substring(0, 120) || aiConfigService.getUserContext().lastTaskContent,
      });

      // ═══════════════════════════════════════════════════════════════════════════
      // PHASE 1: Archetype detection & streak protection
      // ═══════════════════════════════════════════════════════════════════════════
      try {
        const diaryEntries = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]');
        const archetypeResult = detectArchetype(allTasks, diaryEntries);
        aiConfigService.setUserContext({
          userArchetype: archetypeResult.archetype,
          archetypeConfidence: archetypeResult.confidence,
        });
        void evaluateAndProtectStreak(allTasks);
      } catch (e) {
        console.error('[PlannerService] Phase 1 AI update failed:', e);
      }

      // Ensure notifications are scheduled for incomplete future tasks
      void reconcileTaskNotifications(tasksByDay);
    },
    (error) => {
      console.error('[PlannerService] Snapshot error:', error);
    }
  );
}

/**
 * Detach the real-time listener.
 */
export function detachPlannerListener(): void {
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRUD OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateTaskInput {
  content: string;
  category?: NoteCategory;
  mood?: 1 | 2 | 3 | 4 | 5;
  hekaDate: HekaDate;
  dueTime?: string; // "HH:MM"
  reminderMinutesBefore?: number;
  aiSuggested?: boolean;
  suggestedBy?: string;
  complementaryTo?: string[];
  celestialContext?: PlannerTask['celestialContext'];
  streakGroupId?: string;
  recurring?: RecurringConfig;
}

/**
 * Create a new planner task in Firestore.
 */
export async function createPlannerTask(input: CreateTaskInput): Promise<PlannerTask> {
  const uid = getUserId();
  if (!uid) throw new Error('Not authenticated');

  const dayKey = buildDayKey(input.hekaDate);
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Compute exact UTC dueDateTime if dueTime is provided
  let dueDateTime: string | undefined;
  if (input.dueTime) {
    const [hours, minutes] = input.dueTime.split(':').map(Number);
    const civilDate = hekaToCivil(input.hekaDate);
    civilDate.setHours(hours, minutes, 0, 0);
    dueDateTime = civilDate.toISOString();
  }

  const taskRef = doc(getUserTasksCollection());
  const task: PlannerTask = {
    id: taskRef.id,
    userId: uid,
    content: input.content,
    category: input.category || 'general',
    mood: input.mood,
    hekaDate: input.hekaDate,
    dayKey,
    timezone,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    isTask: true,
    isCompleted: false,
    dueTime: input.dueTime,
    dueDateTime,
    reminderMinutesBefore: input.reminderMinutesBefore ?? 10,
    aiSuggested: input.aiSuggested ?? false,
    suggestedBy: input.suggestedBy,
    complementaryTo: input.complementaryTo,
    celestialContext: input.celestialContext,
    streakGroupId: input.streakGroupId,
    recurring: input.recurring,
  };

  // Optimistic Redux update FIRST so the UI always shows the task immediately
  console.log('[createPlannerTask] Dispatching addPlannerTask — task.id:', task.id, 'dayKey:', task.dayKey);
  store.dispatch(addPlannerTask(task));
  console.log('[createPlannerTask] addPlannerTask dispatched');

  // Then attempt Firestore write
  console.log('[createPlannerTask] Writing to Firestore — task.dayKey:', task.dayKey);
  let firestoreSuccess = false;
  try {
    await setDoc(taskRef, stripUndefined(task));
    console.log('[createPlannerTask] Firestore write complete');
    firestoreSuccess = true;
  } catch (writeErr: any) {
    const isPermissionError = writeErr?.code === 'permission-denied' || writeErr?.message?.includes('Missing or insufficient permissions');
    console.error('[createPlannerTask] Firestore write failed:', writeErr?.code, writeErr?.message, 'isPermissionError:', isPermissionError);
    if (isPermissionError) {
      console.log('[createPlannerTask] Attempting auth token refresh...');
      const newToken = await refreshAuthToken(true);
      console.log('[createPlannerTask] Token refresh result:', newToken ? 'success' : 'failed');
      if (newToken && auth?.currentUser) {
        try {
          await auth.currentUser.reload();
          console.log('[createPlannerTask] User reloaded, waiting for token propagation...');
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Create a completely fresh Firestore instance via temporary app to avoid stale auth connection
          console.log('[createPlannerTask] Creating fresh Firestore instance for retry...');
          await withTemporaryFirestore(async (tempDb) => {
            const retryRef = doc(tempDb, 'users', uid, 'plannerTasks', taskRef.id);
            console.log('[createPlannerTask] Retrying Firestore write with fresh instance...');
            await setDoc(retryRef, stripUndefined(task));
            console.log('[createPlannerTask] Firestore retry write complete');
          });
          firestoreSuccess = true;
        } catch (retryErr: any) {
          console.error('[createPlannerTask] Retry failed:', retryErr?.code, retryErr?.message);
        }
      }
    }
  }

  // Schedule notification if task has a due time and is not already past
  if (firestoreSuccess && task.dueDateTime && !task.isCompleted) {
    try {
      const notificationId = await scheduleTaskReminder(task);
      if (notificationId) {
        await updateDoc(taskRef, { notificationId });
        task.notificationId = notificationId;
      }
    } catch (notificationErr) {
      console.warn('[PlannerService] Failed to schedule task reminder:', notificationErr);
      // Do not fail task creation if notification scheduling fails
    }
  }

  if (!firestoreSuccess) {
    // Task is already in Redux (user sees it), but warn that cloud sync failed
    throw new Error('Task saved locally, but cloud sync failed. Please sign in again to sync tasks to the cloud.');
  }

  // Update AI context with task creation info
  const isFirstTask = !aiConfigService.getUserContext().hasCreatedFirstTask;
  const pendingTasks = getPendingTasksCount();
  const preferredTime = inferPreferredTaskTime(input.dueTime);
  const today = new Date().toISOString().split('T')[0];
  aiConfigService.setUserContext({
    hasCreatedFirstTask: true,
    pendingTasks,
    preferredTaskTime: preferredTime,
    lastTaskCreationDate: today,
    lastTaskContent: input.content.substring(0, 120),
  });

  eventBus.emit('heka-task-created', { task, isFirstTask });

  return task;
}

/**
 * Update an existing planner task.
 */
export async function updatePlannerTaskDoc(
  taskId: string,
  dayKey: string,
  updates: Partial<CreateTaskInput> & Partial<Pick<PlannerTask, 'isCompleted' | 'energyScore'>>
): Promise<void> {
  const taskRef = getTaskDocRef(taskId);
  const patch: Partial<PlannerTask> = {
    updatedAt: new Date().toISOString(),
  };

  if (updates.content !== undefined) patch.content = updates.content;
  if (updates.category !== undefined) patch.category = updates.category;
  if (updates.mood !== undefined) patch.mood = updates.mood;
  if (updates.dueTime !== undefined) patch.dueTime = updates.dueTime;
  if (updates.reminderMinutesBefore !== undefined) patch.reminderMinutesBefore = updates.reminderMinutesBefore;
  if (updates.isCompleted !== undefined) {
    patch.isCompleted = updates.isCompleted;
    if (updates.isCompleted) {
      patch.completedAt = new Date().toISOString();
    } else {
      (patch as any).completedAt = deleteField();
    }
  }
  if (updates.energyScore !== undefined) patch.energyScore = updates.energyScore;
  if (updates.complementaryTo !== undefined) patch.complementaryTo = updates.complementaryTo;
  if (updates.recurring !== undefined) patch.recurring = updates.recurring;

  // Recompute dueDateTime if dueTime changed
  if (updates.dueTime !== undefined) {
    if (updates.dueTime) {
      const [hours, minutes] = updates.dueTime.split(':').map(Number);
      const currentTask = store.getState().planner.tasks[dayKey]?.find((t) => t.id === taskId);
      const civilDate = currentTask?.hekaDate ? hekaToCivil(currentTask.hekaDate as HekaDate) : new Date();
      civilDate.setHours(hours, minutes, 0, 0);
      patch.dueDateTime = civilDate.toISOString();
    } else {
      (patch as any).dueDateTime = deleteField();
    }
  }

  await updateDoc(taskRef, stripUndefined(patch));

  // Handle notification lifecycle
  const current = store.getState().planner.tasks[dayKey]?.find((t) => t.id === taskId);
  if (current) {
    const merged = { ...current, ...patch } as PlannerTask;

    if (merged.isCompleted) {
      // Cancel any pending notification when completed early
      if (merged.notificationId) {
        await cancelTaskReminder(merged.notificationId);
        await updateDoc(taskRef, { notificationId: deleteField() });
      }
    } else if (merged.dueDateTime) {
      // Reschedule if due time changed or re-opened
      if (merged.notificationId) {
        await cancelTaskReminder(merged.notificationId);
      }
      const notificationId = await scheduleTaskReminder(merged);
      if (notificationId) {
        await updateDoc(taskRef, { notificationId });
      }
    }
  }

  store.dispatch(updatePlannerTask({ taskId, dayKey, updates: patch }));
}

/**
 * Mark a task complete (convenience wrapper).
 */
export async function completePlannerTask(taskId: string, dayKey: string, energyScore?: PlannerTask['energyScore']): Promise<void> {
  await updatePlannerTaskDoc(taskId, dayKey, { isCompleted: true, energyScore });

  // Find the completed task to send celebration
  const task = store.getState().planner.tasks[dayKey]?.find((t) => t.id === taskId);
  if (task) {
    // Calculate streak from planner stats
    const stats = store.getState().planner.stats;
    const today = new Date().toISOString().split('T')[0];
    const lastCompletion = stats.lastCompletionDate;
    let currentStreak = 1;
    if (lastCompletion) {
      const lastDate = new Date(lastCompletion);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        currentStreak = stats.currentStreak + 1;
      }
    }

    // Update stats
    const { setPlannerStats } = await import('../store/plannerSlice');
    store.dispatch(setPlannerStats({
      currentStreak,
      longestStreak: Math.max(stats.longestStreak, currentStreak),
      lastCompletionDate: today,
      completionsByCategory: {
        ...stats.completionsByCategory,
        [task.category]: (stats.completionsByCategory[task.category] || 0) + 1,
      },
    }));

    // Send celebration notification
    void sendCompletionCelebration(task, currentStreak);

    // Re-evaluate streak saver (no longer needed if they completed something)
    void scheduleStreakSaverIfNeeded();

    // Update AI context with completion info
    const pendingTasks = getPendingTasksCount();
    const todayTasksCompleted = getTodayCompletedTasksCount();
    const preferredTime = inferPreferredTaskTime(task.dueTime);
    aiConfigService.setUserContext({
      currentTaskStreak: currentStreak,
      longestTaskStreak: Math.max(stats.longestStreak, currentStreak),
      lastTaskCompletionDate: today,
      lastCompletedTaskId: task.id,
      lastCompletedTaskCategory: task.category,
      pendingTasks,
      todayTasksCompleted,
      preferredTaskTime: preferredTime,
    });

    eventBus.emit('heka-task-completed', { task, streak: currentStreak });

    // Phase 1: Streak completed — cancel protection notification
    try {
      const allTasks = getAllTasks();
      void evaluateAndProtectStreak(allTasks);
    } catch (e) {
      console.error('[PlannerService] Streak protection update failed:', e);
    }
  }
}

/**
 * Reopen a completed task.
 */
export async function reopenPlannerTask(taskId: string, dayKey: string): Promise<void> {
  await updatePlannerTaskDoc(taskId, dayKey, { isCompleted: false });

  // Re-evaluate streak saver since they un-completed a task
  void scheduleStreakSaverIfNeeded();

  // Update AI context counts
  aiConfigService.setUserContext({
    pendingTasks: getPendingTasksCount(),
    todayTasksCompleted: getTodayCompletedTasksCount(),
  });
}

/**
 * Delete a planner task entirely.
 */
export async function deletePlannerTask(taskId: string, dayKey: string): Promise<void> {
  const current = store.getState().planner.tasks[dayKey]?.find((t) => t.id === taskId);
  if (current?.notificationId) {
    await cancelTaskReminder(current.notificationId);
  }
  await deleteDoc(getTaskDocRef(taskId));
  store.dispatch(removePlannerTask({ taskId, dayKey }));

  // Update AI context counts
  aiConfigService.setUserContext({
    pendingTasks: getPendingTasksCount(),
    todayTasksCompleted: getTodayCompletedTasksCount(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARING TO CIRCLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Share a personal planner task to the Circle as a shareable task.
 */
export async function sharePlannerTaskToCircle(
  taskId: string,
  friendId?: string
): Promise<{ success: boolean; shareCode?: string; shareLink?: string; error?: string }> {
  const uid = getUserId();
  if (!uid) return { success: false, error: 'Not authenticated' };

  // Find the task across all day keys
  const tasksByDay = store.getState().planner.tasks;
  let task: PlannerTask | undefined;
  for (const dayKey of Object.keys(tasksByDay)) {
    task = tasksByDay[dayKey].find((t) => t.id === taskId);
    if (task) break;
  }
  if (!task) return { success: false, error: 'Task not found' };

  // Create the Circle shared task
  const shareResult = await createShareableTask(
    task.content,
    `Shared from Planner: ${task.content}`,
    task.hekaDate
  );

  if (!shareResult.success) {
    return { success: false, error: shareResult.error };
  }

  // Record the share on the planner task
  const taskRef = getTaskDocRef(taskId);
  await updateDoc(taskRef, {
    sharedToCircle: {
      shareCode: shareResult.shareCode,
      sharedAt: new Date().toISOString(),
      friendId,
    },
  });

  return {
    success: true,
    shareCode: shareResult.shareCode,
    shareLink: shareResult.shareLink,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATS & QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Load planner preferences from Firestore.
 */
export async function loadPlannerPreferences(): Promise<PlannerTask['userId'] | null> {
  const uid = getUserId();
  if (!uid || !db) return null;
  // Placeholder for future preferences doc if needed
  return uid;
}

/**
 * Reconcile all task notifications on app launch.
 * Call after attachPlannerListener resolves its first snapshot.
 */
export async function reconcileAllTaskNotifications(): Promise<void> {
  const tasksByDay = store.getState().planner.tasks;
  await reconcileTaskNotifications(tasksByDay);
}
