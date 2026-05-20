/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PLANNER NOTIFICATION SERVICE
 * Routes all planner notifications through the unified NotificationEngine.
 * Templates now live in notificationTemplates.ts for consistency.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { LocalNotifications, type LocalNotificationSchema, type ActionPerformed } from '@capacitor/local-notifications';
import { NotificationEngine } from './notificationEngine';
import { NotificationAnalytics } from './notificationAnalytics';
import { checkStreakMilestone } from './notificationCelebrations';
import { getNextScheduleTime } from './notificationScheduling';
import { seededRandom } from './notificationTemplates';
import type { PlannerTask } from '../types';
import { calculateCurrentSky, calculatePreciseMoonPhase } from '../astrology/services/calculations/swissCalculations';
import { store } from '../store';
import { selectDate, setView } from '../store';
import { eventBus } from './eventBus';

const IS_NATIVE_APP = typeof (window as unknown as { Capacitor?: unknown }).Capacitor !== 'undefined';

function isNativePluginAvailable(): boolean {
  if (!IS_NATIVE_APP) return false;
  try {
    return typeof LocalNotifications.requestPermissions === 'function';
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COPY GENERATORS (kept for dynamic data injection)
// ═══════════════════════════════════════════════════════════════════════════════

function getMoonPhaseCategory(phase: string): string {
  if (phase.includes('new')) return 'new';
  if (phase.includes('full')) return 'full';
  if (phase.includes('waning')) return 'waning';
  if (phase.includes('waxing') || phase.includes('quarter')) return 'waxing';
  return 'general';
}

async function generateDailyBriefingVars(): Promise<Record<string, string>> {
  const today = new Date().toISOString().split('T')[0];
  const seed = today;

  // Get astrology data if available
  const state = store.getState();
  let moonPhase = 'waxing gibbous';
  let moonSign = 'Gemini';

  try {
    const { positions } = await calculateCurrentSky();
    if (positions.moon) {
      moonSign = String(positions.moon.sign).charAt(0).toUpperCase() + String(positions.moon.sign).slice(1);
      if (positions.sun) {
        const precise = calculatePreciseMoonPhase(positions.sun, positions.moon);
        moonPhase = precise.name.toLowerCase();
      }
    }
  } catch (e) {
    // Fallback to defaults if Swiss Ephemeris isn't ready
    console.warn('[PlannerNotificationService] Astro calc failed, using fallback moon data:', e);
  }

  // Get pending tasks
  const plannerTasks = state.planner.tasks;
  let pendingCount = 0;
  Object.values(plannerTasks).forEach((dayTasks) => {
    dayTasks.forEach((t) => {
      if (!t.isCompleted && t.dueTime) pendingCount++;
    });
  });

  const openers = [
    "The cosmos whispers your name this morning.",
    "A new thread weaves itself into the tapestry of your journey.",
    "The stars have been waiting for you to wake.",
    "Today carries a signature written in starlight.",
    "The celestial orchestra tunes itself to your frequency.",
  ];
  const tasks: Record<string, string[]> = {
    new: ["Plant an intention that will bloom with the moon.", "Write a wish and speak it to the wind.", "Begin something you've been afraid to start."],
    waxing: ["Build momentum. The universe is gathering force for you.", "Feed your ambitions — they are hungry.", "Take one bold step while the light grows."],
    full: ["Illuminate what has been hiding in shadow.", "Release what no longer honors your becoming.", "Stand in your truth under the silver light."],
    waning: ["Harvest the wisdom of this cycle.", "Clear space for what is coming next.", "Reflect, integrate, and let the rest fall away."],
    general: ["Align one action with your highest self.", "Listen for the subtle guidance beneath the noise.", "Move with intention, not urgency."],
  };

  const moonCat = getMoonPhaseCategory(moonPhase);
  const taskList = tasks[moonCat] || tasks.general;

  return {
    opener: openers[Math.floor(seededRandom(seed) * openers.length)],
    task: taskList[Math.floor(seededRandom(seed + 'task') * taskList.length)],
    moonPhase: moonPhase.replace('-', ' '),
    moonSign,
    pendingCount: String(pendingCount),
    plural: pendingCount === 1 ? '' : 's',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEDULING
// ═══════════════════════════════════════════════════════════════════════════════

const DAILY_BRIEFING_ID = 777777;
const STREAK_SAVER_ID = 888888;

/**
 * Schedule the daily celestial briefing notification.
 * Respects engine dedup and user custom time preferences.
 */
export async function scheduleDailyBriefing(): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.planner;
  if (!prefs.dailyBriefing) return;

  // Engine dedup: already scheduled today?
  if (NotificationEngine.hasSentToday('daily-briefing')) {
    console.log('[PlannerNotificationService] Daily briefing already scheduled today. Skipping.');
    return;
  }

  const briefingTime = getNextScheduleTime('dailyBriefing');

  const vars = await generateDailyBriefingVars();
  const seed = new Date().toISOString().split('T')[0];

  const result = await NotificationEngine.scheduleTemplated(
    'daily-briefing',
    'standard',
    'planner',
    briefingTime,
    seed,
    vars,
    { type: 'daily-briefing' },
    DAILY_BRIEFING_ID
  );

  if (result) {
    NotificationEngine.markSentToday('daily-briefing');
  } else {
    console.warn('[PlannerNotificationService] Daily briefing schedule failed — will retry on next interval');
  }
}

/**
 * Schedule the streak saver notification if needed.
 * Respects user custom time preferences.
 */
export async function scheduleStreakSaverIfNeeded(): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.planner;
  if (!prefs.streakSaver) return;

  const now = new Date();
  const todayIso = now.toISOString().split('T')[0];
  const plannerTasks = store.getState().planner.tasks;

  let completedToday = false;
  let hasTasksToday = false;

  Object.values(plannerTasks).forEach((dayTasks) => {
    dayTasks.forEach((t) => {
      if (t.completedAt && t.completedAt.startsWith(todayIso)) {
        completedToday = true;
      }
      if (t.createdAt && t.createdAt.startsWith(todayIso)) {
        hasTasksToday = true;
      }
    });
  });

  if (completedToday || !hasTasksToday) {
    await NotificationEngine.cancel(String(STREAK_SAVER_ID));
    return;
  }

  const saverTime = getNextScheduleTime('streakSaver');
  if (saverTime.getTime() <= now.getTime()) {
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const seed = today;

  const openers = [
    "The flame still burns, even if you cannot see it.",
    "The stars do not abandon those who pause to breathe.",
    "One small ember is all it takes to rekindle the fire.",
    "The cosmos honors consistency, but it forgives rest.",
    "Your path is not erased by a single still moment.",
  ];
  const microTasks = [
    "Drink a glass of water and feel it renew you.",
    "Step outside and let the sky remind you that you belong.",
    "Write one sentence about what moved you today.",
    "Stretch your body like a cat greeting the sun.",
    "Take three slow breaths as if each one is a gift.",
  ];

  const opener = openers[Math.floor(seededRandom(seed) * openers.length)];
  const microTask = microTasks[Math.floor(seededRandom(seed + 'micro') * microTasks.length)];

  // Engine dedup: already scheduled today?
  if (NotificationEngine.hasSentToday('streak-saver')) {
    console.log('[PlannerNotificationService] Streak saver already scheduled today. Skipping.');
    return;
  }

  const result = await NotificationEngine.schedule({
    type: 'streak-saver',
    tier: 'standard',
    title: 'The Cosmos Still Believes in You',
    body: `${opener} ${microTask}`,
    scheduleAt: saverTime,
    section: 'planner',
    id: STREAK_SAVER_ID,
    replaceExisting: true,
    extra: { type: 'streak-saver' },
  });

  if (result) {
    NotificationEngine.markSentToday('streak-saver');
  } else {
    console.warn('[PlannerNotificationService] Streak saver schedule failed — will retry on next interval');
  }
}

/**
 * Send an immediate completion celebration notification.
 */
export async function sendCompletionCelebration(task: PlannerTask, streak: number): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.planner;
  if (!prefs.completionCelebrations) return;

  const celebrations = [
    "The celestial sphere notes your dedication.",
    "You have bent time to your will. Well done.",
    "Another star ignites in the constellation of your habits.",
    "The universe leans closer when you keep your promises.",
    "You moved with purpose. The cosmos felt it.",
  ];

  const streakPhrases: Record<number, string> = {
    2: "Two days in a row. Momentum is awakening.",
    3: "Three days. The thread is becoming a rope.",
    5: "Five days. You are building something real.",
    7: "A full week. The stars mark your name.",
    14: "Two weeks. You are becoming unstoppable.",
    21: "Three weeks. This is no longer chance — it is craft.",
    30: "A lunar month of devotion. Rare and beautiful.",
  };

  const seed = task.id + Date.now();
  const celebration = celebrations[Math.floor(seededRandom(seed + 'celebration') * celebrations.length)];

  let streakText = '';
  const streakPhrase = streakPhrases[streak];
  if (streakPhrase) {
    streakText = streakPhrase;
  } else if (streak > 1) {
    streakText = `${streak} days in a row. Keep the flame alive.`;
  }

  const id = 999000 + Math.abs(parseInt(task.id.replace(/\D/g, '').slice(0, 6), 10) % 1000);

  await NotificationEngine.schedule({
    type: 'completion-celebration',
    tier: 'standard',
    title: 'Intention Fulfilled ✦',
    body: `${celebration} ${streakText}`,
    scheduleAt: new Date(Date.now() + 800),
    section: 'planner',
    id,
    extra: { type: 'completion-celebration', taskId: task.id, dayKey: task.dayKey },
  });

  // Check for milestone celebration
  void checkStreakMilestone(streak);
}

/**
 * Send a complementary task suggestion after completion.
 */
export async function sendComplementaryTaskSuggestion(task: PlannerTask): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.planner;
  if (!prefs.complementaryTasks) return;

  const suggestions: Record<string, string[]> = {
    health: ["Fuel your body with something nourishing.", "Rest as deeply as you moved.", "Drink water like it is liquid starlight."],
    work: ["Celebrate this win before chasing the next.", "Write down one thing you learned.", "Close your eyes and envision the next milestone."],
    spiritual: ["Sit in silence for five minutes.", "Light a candle and offer gratitude.", "Journal what the silence reveals."],
    creative: ["Capture one image or phrase that sparks you.", "Play without purpose for ten minutes.", "Share something you made with another soul."],
    personal: ["Send a message to someone you cherish.", "Tidy one corner of your space.", "Read one page of something that expands you."],
    family: ["Give someone your full attention.", "Share a meal without screens.", "Ask someone how they really are."],
    general: ["Pause and name three things you are grateful for.", "Set one intention for tomorrow.", "Breathe deeply and let the day settle."],
  };

  const category = task.category || 'general';
  const categorySuggestions = suggestions[category] || suggestions.general;
  const suggestion = categorySuggestions[Math.floor(seededRandom(task.id + 'complement') * categorySuggestions.length)];

  const id = 999500 + Math.abs(parseInt(task.id.replace(/\D/g, '').slice(0, 6), 10) % 1000);

  await NotificationEngine.schedule({
    type: 'complementary-task',
    tier: 'ambient',
    title: 'Deepen the Practice',
    body: `You completed "${task.content.substring(0, 30)}..." ${suggestion}`,
    scheduleAt: new Date(Date.now() + 1000 * 60 * 2),
    section: 'planner',
    id,
    extra: { type: 'complementary-task', taskId: task.id, dayKey: task.dayKey },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION TAP HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

function handleNotificationAction(
  type: string,
  actionId: string,
  notification: LocalNotificationSchema,
  dayKey?: string
): void {
  console.log(`[NotificationAction] ${type} → ${actionId}`);

  // Track analytics
  const tier = notification.extra?._engineTier || 'standard';
  const section = notification.extra?._engineSection || 'planner';
  NotificationAnalytics.recordTapped(type, tier, section, undefined, actionId);

  switch (actionId) {
    case 'complete':
      // Mark task as complete
      if (dayKey) {
        eventBus.emit('heka-notification-action', { action: 'complete-task', dayKey, taskId: notification.extra?.taskId });
      }
      break;

    case 'snooze-15':
    case 'snooze-30':
    case 'snooze-1h': {
      const minutes = actionId === 'snooze-15' ? 15 : actionId === 'snooze-30' ? 30 : 60;
      eventBus.emit('heka-notification-action', { action: 'snooze', notificationId: String(notification.id), type, minutes });
      break;
    }

    case 'open-journal':
      eventBus.emit('heka:notification:navigate', { target: 'journal' });
      break;

    case 'open-planner':
      eventBus.emit('heka:notification:navigate', { target: 'planner' });
      break;

    case 'open-stars':
      eventBus.emit('heka:notification:navigate', { target: 'stars' });
      break;

    case 'open-circle':
      eventBus.emit('heka:notification:navigate', { target: 'circle' });
      break;

    case 'accept':
      eventBus.emit('heka-notification-action', { action: 'accept', type, notificationId: String(notification.id) });
      break;

    case 'decline':
      eventBus.emit('heka-notification-action', { action: 'decline', type, notificationId: String(notification.id) });
      break;

    case 'share':
      eventBus.emit('heka-notification-action', { action: 'share', type, notificationId: String(notification.id) });
      break;

    case 'dismiss':
      // Just track dismissal analytics
      NotificationAnalytics.recordDismissed(type, tier, section);
      break;

    default:
      // Unknown action — just open the app
      eventBus.emit('heka:notification:navigate', { target: 'main' });
  }
}

function recordNotificationDelivery(notification: LocalNotificationSchema): void {
  const extra = notification.extra || {};
  const engineType = extra._engineType || extra.type;
  const engineTier = extra._engineTier || 'standard';
  const engineSection = extra._engineSection || 'planner';
  if (!engineType) return;

  NotificationEngine.recordDelivery(
    {
      type: engineType,
      tier: engineTier,
      title: notification.title || '',
      body: notification.body || '',
      scheduleAt: new Date(),
      section: engineSection,
      id: typeof notification.id === 'number' ? notification.id : undefined,
      extra,
    },
    String(notification.id)
  );
}

export function initializePlannerNotificationTapHandler(): () => void {
  if (!isNativePluginAvailable()) {
    return () => {};
  }

  const cleanups: (() => void)[] = [];

  // Handle notification taps and action buttons (app was backgrounded / killed)
  LocalNotifications.addListener('localNotificationActionPerformed', (event: ActionPerformed) => {
    const extra = event.notification.extra || {};
    const { type, dayKey, templateIndex, _engineTier, _engineSection } = extra;
    const actionId = event.actionId || null;

    // Record delivery in history
    recordNotificationDelivery(event.notification);

    // Track template engagement
    if (type != null && templateIndex != null) {
      NotificationEngine.recordEngagement(type, templateIndex);
    }

    // Handle action buttons
    if (actionId) {
      handleNotificationAction(type, actionId, event.notification, dayKey);
      return;
    }

    void _engineTier;
    void _engineSection;

    // Helper to dispatch navigation event for App.tsx to handle modals
    const dispatchNav = (target: string, payload?: Record<string, unknown>) => {
      eventBus.emit('heka:notification:navigate', { target, ...payload });
    };

    if (type === 'task-reminder' && dayKey) {
      const parts = dayKey.split(':');
      if (parts.length === 4) {
        const hekaDate = {
          year: parseInt(parts[1]),
          month: parseInt(parts[2]) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
          day: parseInt(parts[3]),
        };
        store.dispatch(selectDate(hekaDate));
      }
      return;
    }

    if (type === 'daily-briefing') {
      const now = new Date();
      import('./calendarService').then(({ civilToHeka }) => {
        const hekaDate = civilToHeka(now);
        if (hekaDate) {
          store.dispatch(selectDate(hekaDate));
        }
      });
      return;
    }

    if ((type === 'streak-saver' || type === 'completion-celebration' || type === 'complementary-task') && dayKey) {
      const parts = dayKey.split(':');
      if (parts.length === 4) {
        const hekaDate = {
          year: parseInt(parts[1]),
          month: parseInt(parts[2]) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
          day: parseInt(parts[3]),
        };
        store.dispatch(selectDate(hekaDate));
      }
      return;
    }

    // Stars notifications
    if (type === 'void-moon-entered' || type === 'void-moon-ended' || type === 'moon-degree-update' || type === 'retrograde-alert' || type === 'daily-celestial-tips') {
      store.dispatch(setView('stars'));
      return;
    }

    // Calendar notifications
    if (type === 'holiday-reminder' || type === 'civil-heka-transition' || type === 'note-reminder') {
      store.dispatch(setView('month'));
      return;
    }

    // Circle notifications
    if (type === 'friend-request' || type === 'task-assigned' || type === 'message-received' || type === 'task-due-soon' || type === 'task-completed' || type === 'task-declined') {
      dispatchNav('circle');
      return;
    }

    // Journal / Oracle notifications
    if (type === 'tracker-reminder' || type === 'daily-reflection-prompt' || type === 'celestial-insight-alert') {
      dispatchNav('journal');
      return;
    }
  }).then((handle) => {
    cleanups.push(() => handle.remove());
  }).catch(() => {});

  return () => cleanups.forEach((fn) => fn());
}

/**
 * Request planner notification permission
 */
export async function requestPlannerNotificationPermission(): Promise<boolean> {
  if (!isNativePluginAvailable()) {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  try {
    const { display } = await LocalNotifications.checkPermissions();
    if (display === 'granted') return true;
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch {
    return false;
  }
}
