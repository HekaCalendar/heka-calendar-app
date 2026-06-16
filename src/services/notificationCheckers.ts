/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION CHECKERS — Time-gated and event-driven notification checkers
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type {
  NotificationTier,
  NotificationSection,
  NotificationEngineState,
} from '../types/notifications';
import { store } from '../store';
import { getTodayKey } from './notificationState';
import { civilToHeka, getDaysInMonth, HEKA_MONTHS } from './calendarService';
import { calculateVoidMoonStatus, getNextSignBoundary, calculateCurrentSky } from '../astrology/services/calculations/swissCalculations';
import { getSignFromLongitude, type Degree } from '../astrology/types/core';
import type { TrackerType } from '../oracle/trackerTypes';
import { getHolidaysForDateWithSubRegion } from '../types/holidays';
import { getNextScheduleTime } from './notificationScheduling';
import type { AstronomicalContext } from './notificationGenius';

// ── Types ────────────────────────────────────────────────────────────────────

export type ScheduleTemplatedFn = (
  type: string, tier: NotificationTier, section: NotificationSection,
  scheduleAt: Date, seed: string, vars: Record<string, string>,
  extra?: Record<string, unknown>, id?: number, dedupKey?: string
) => Promise<string | null>;

export interface CheckersFlags {
  hasSentToday: (key: string) => boolean;
  markSentToday: (key: string) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Detect solstice or equinox for a date (within +/-1 day tolerance). */
export function getSolsticeEquinoxName(date: Date): { name: string; description: string } | null {
  const m = date.getMonth();
  const d = date.getDate();
  if (m === 2 && (d === 19 || d === 20 || d === 21)) return { name: 'Spring Equinox', description: 'vernal equinox -- day and night in balance' };
  if (m === 5 && (d === 20 || d === 21 || d === 22)) return { name: 'Summer Solstice', description: 'longest day of the year in the Northern Hemisphere' };
  if (m === 8 && (d === 21 || d === 22 || d === 23)) return { name: 'Autumn Equinox', description: 'autumnal equinox -- equal light and dark once more' };
  if (m === 11 && (d === 20 || d === 21 || d === 22)) return { name: 'Winter Solstice', description: 'shortest day of the year in the Northern Hemisphere' };
  return null;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Checkers ─────────────────────────────────────────────────────────────────

export async function checkHekaTransitions(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.calendar;
  if (!prefs.civilHekaTransition) return;

  const now = new Date();
  const hekaDate = civilToHeka(now);
  if (!hekaDate) return;

  const daysInMonth = getDaysInMonth(hekaDate.year, hekaDate.month);
  const daysRemaining = daysInMonth - hekaDate.day;
  const currentMonthName = HEKA_MONTHS[hekaDate.month]?.name || 'Unknown';
  const nextMonthName = HEKA_MONTHS[(hekaDate.month + 1) % 13]?.name || 'Unknown';
  const civilMonthName = now.toLocaleString('default', { month: 'long' });

  let context: string;
  let vars: Record<string, string>;

  if (daysRemaining === 0) {
    context = 'last-day';
    vars = { hekaMonth: currentMonthName, nextMonth: nextMonthName, civilMonth: civilMonthName, arcName: hekaDate.month < 4 ? 'Opening' : hekaDate.month < 9 ? 'Core' : 'Closing' };
  } else if (daysRemaining === 1) {
    context = 'one-day-left';
    vars = { hekaMonth: currentMonthName, nextMonth: nextMonthName, civilMonth: civilMonthName, arcName: hekaDate.month < 4 ? 'Opening' : hekaDate.month < 9 ? 'Core' : 'Closing' };
  } else if (daysRemaining === 3) {
    context = 'three-days-left';
    vars = { hekaMonth: currentMonthName, nextMonth: nextMonthName, civilMonth: civilMonthName, arcName: hekaDate.month < 4 ? 'Opening' : hekaDate.month < 9 ? 'Core' : 'Closing' };
  } else if (daysRemaining === 7) {
    context = 'seven-days-left';
    vars = { hekaMonth: currentMonthName, nextMonth: nextMonthName, civilMonth: civilMonthName, arcName: hekaDate.month < 4 ? 'Opening' : hekaDate.month < 9 ? 'Core' : 'Closing' };
  } else if (hekaDate.day === 1) {
    context = 'first-day';
    vars = { hekaMonth: currentMonthName, nextMonth: nextMonthName, civilMonth: civilMonthName, arcName: hekaDate.month < 4 ? 'Opening' : hekaDate.month < 9 ? 'Core' : 'Closing' };
  } else {
    return; // No notification needed today
  }

  const seed = context + now.toISOString().split('T')[0];
  const flagKey = `heka-${context}`;
  if (flags.hasSentToday(flagKey)) {
    return; // Already sent today
  }

  const result = await send(
    'civil-heka-transition',
    'ambient',
    'calendar',
    new Date(Date.now() + 5000),
    seed,
    vars,
    { context }
  );
  if (result) {
    flags.markSentToday(flagKey);
    saveState();
  }
}

export async function checkVoidMoon(
  send: ScheduleTemplatedFn,
  _flags: CheckersFlags,
  getState: () => NotificationEngineState,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.stars;
  if (!prefs.voidMoonReminders) return;

  try {
    const voidData = await calculateVoidMoonStatus();
    const isVoid = voidData.isVoid;
    const prevState = getState().lastVoidMoonState;

    // Transition: not void → void
    if (isVoid && prevState === false) {
      const seed = 'enter-' + Date.now();
      await send(
        'void-moon-entered',
        'core',
        'stars',
        new Date(Date.now() + 1000),
        seed,
        {
          sign: voidData.moonSign || 'unknown',
          quality: String(voidData.quality),
          duration: String(Math.round(voidData.durationMinutes)),
        },
        { type: 'void-moon-entered' }
      );
    }

    // Transition: void → not void
    if (!isVoid && prevState === true) {
      const seed = 'exit-' + Date.now();
      // Compute the sign the Moon is entering (not the one it's leaving)
      const use13Signs = store.getState().calendar.astroPreferences?.signCount === 13;
      const moonLon = (voidData as unknown as { moonLongitude?: number }).moonLongitude || 0;
      const nextBoundary = getNextSignBoundary(moonLon, use13Signs);
      const nextSign = getSignFromLongitude((nextBoundary + 0.1) as Degree, use13Signs);
      await send(
        'void-moon-ended',
        'standard',
        'stars',
        new Date(Date.now() + 1000),
        seed,
        {
          nextSign: String(nextSign),
        },
        { type: 'void-moon-ended' }
      );
    }

    getState().lastVoidMoonState = isVoid;
    saveState();
  } catch (e) {
    console.error('[NotificationEngine] Void moon check failed:', e);
  }
}

export function startVoidMoonWatcher(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  getState: () => NotificationEngineState,
  saveState: () => void,
): ReturnType<typeof setInterval> {
  return setInterval(() => {
    void checkVoidMoon(send, flags, getState, saveState);
    void checkMoonDegree(send, flags, getState, saveState);
  }, 30 * 60 * 1000); // Every 30 minutes
}

export function stopVoidMoonWatcher(timer: ReturnType<typeof setInterval> | null): void {
  if (timer) {
    clearInterval(timer);
  }
}

export async function checkMoonDegree(
  send: ScheduleTemplatedFn,
  _flags: CheckersFlags,
  getState: () => NotificationEngineState,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.stars;
  if (!prefs.moonDegreeNotifications) return;

  try {
    const { positions } = await calculateCurrentSky();
    const moon = positions.moon;
    if (!moon) return;

    const currentDegree = Math.floor(moon.longitude);
    const prevDegree = getState().lastMoonDegree;

    // Only notify on whole-degree change to avoid spam
    if (prevDegree !== null && currentDegree !== prevDegree) {
      const use13Signs = store.getState().calendar.astroPreferences?.signCount === 13;
      const sign = getSignFromLongitude(moon.longitude, use13Signs);
      const degreeInSign = Math.floor(moon.longitude % 30);

      // Simple degree meaning based on sign degree
      const meanings = [
        'A fresh impulse stirs. Watch for new beginnings in emotional terrain.',
        'Subtle undercurrents build. Patience reveals what haste conceals.',
        'Connections deepen. The weave between mind and feeling tightens.',
        'Foundations settle. What feels secure now will carry you forward.',
        'A spark of curiosity. The heart asks questions the mind cannot answer.',
        'Harmony beckons. Balance the inner scales before acting outwardly.',
        'Intensity rises. Depth calls to depth—dive carefully.',
        'Transformation hums beneath the surface. Old skins loosen.',
        'Expansion tugs at the edges of comfort. Trust the stretch.',
        'Discipline meets desire. Structure your longings into form.',
        'Breakthrough energy. The unexpected becomes the necessary.',
        'Dreams seep into waking. Boundaries between worlds grow thin.',
        'Renewal cycles. What ends now feeds what comes next.',
        'Integration. The fragments of self seek wholeness.',
        'A cresting wave. Momentum carries—steer, do not resist.',
        'Refinement. Polish the rough edges of intent with care.',
        'Rebellion or revolution? The heart knows which it needs.',
        'Dissolution. Let go of the shoreline and float.',
        'A threshold. One foot in the known, one in the mystery.',
        'Manifestation nears. The seed cracks open toward light.',
        'Liberation. Unbind yourself from old emotional contracts.',
        'Vision clarifies. See the pattern beneath the noise.',
        'Healing threads. Mend what was torn, gently.',
        'Service and surrender. Give what you can, then rest.',
        'Creative fire. Express what has been silently gathering.',
        'Authority within. Claim your inner territory.',
        'Release. What no longer serves drifts away on lunar tides.',
        'Rebirth. The old moon breathes its last; the new stirs.',
        'Completion. A cycle closes with quiet dignity.',
        'Anticipation. The void before the next becoming.',
      ];
      const meaning = meanings[degreeInSign] || 'The Moon continues her journey through the zodiac.';

      const seed = `degree-${currentDegree}-${Date.now()}`;
      await send(
        'moon-degree-update',
        'ambient',
        'stars',
        new Date(Date.now() + 1000),
        seed,
        {
          degree: String(degreeInSign),
          sign: String(sign),
          meaning,
        },
        { degree: currentDegree }
      );
    }

    getState().lastMoonDegree = currentDegree;
    saveState();
  } catch (e) {
    console.error('[NotificationEngine] Moon degree check failed:', e);
  }
}

export async function checkTrackerReminders(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.journal;
  if (!prefs.reflectionReminders) return;

  try {
    const { TrackerManager } = await import('./trackerManager');
    const enabledTrackers = JSON.parse(localStorage.getItem('heka_enabled_trackers') || '[]') as string[];
    if (!enabledTrackers.length) return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const TRACKER_LABELS: Record<string, string> = {
      mood: 'Daily Reflection',
      sleep: 'Rest Log',
      energy: 'Vitality Check',
      custom: 'Personal Tracker',
    };

    for (const trackerType of enabledTrackers) {
      const flagKey = `tracker-${trackerType}`;
      if (flags.hasSentToday(flagKey)) {
        continue; // Already sent today
      }

      const trackerLabel = TRACKER_LABELS[trackerType] || trackerType;
      const recent = TrackerManager.getMostRecentEntry(trackerType as TrackerType);
      if (!recent) {
        // Never logged — suggest starting
        const result = await send(
          'reflection-reminder',
          'standard',
          'journal',
          new Date(Date.now() + 5000),
          trackerType + todayStr,
          { trackerType: trackerLabel, when: 'soon', days: '0' },
          { trackerType },
          undefined,
          flagKey
        );
        if (result) {
          flags.markSentToday(flagKey);
        }
        continue;
      }

      const daysSince = Math.floor((now.getTime() - new Date(recent.date).getTime()) / 86400000);
      const threshold = trackerType === 'sleep' ? 3 : trackerType === 'mood' ? 2 : trackerType === 'energy' ? 2 : 1;

      if (daysSince >= threshold) {
        const result = await send(
          'reflection-reminder',
          'standard',
          'journal',
          new Date(Date.now() + 5000),
          trackerType + todayStr,
          { trackerType: trackerLabel, when: 'today', days: String(daysSince) },
          { trackerType, daysSince },
          undefined,
          flagKey
        );
        if (result) {
          flags.markSentToday(flagKey);
        }
      }
    }
  } catch (e) {
    console.error('[NotificationEngine] Tracker reminder check failed:', e);
  }
}

export async function checkHolidayReminders(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.calendar;
  if (!prefs.holidayReminders) return;

  const now = new Date();
  const today = getTodayKey();

  const flagKey = 'holiday-reminder';
  if (flags.hasSentToday(flagKey)) return;

  const state = store.getState().calendar;
  const country = (state.location || 'AU') as import('../types/holidays').CountryCode;
  const subRegion = state.subRegion as import('../types/holidays').SubRegionCode | undefined;

  // Check tomorrow's holidays
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const holidays = getHolidaysForDateWithSubRegion(tomorrow, country, subRegion);

  if (!holidays.length) return;

  // Pre-schedule at user's preferred holiday reminder time
  const scheduleTime = getNextScheduleTime('holidayReminders');

  // Send one notification per holiday (capped by ambient tier)
  let anyScheduled = false;
  for (let i = 0; i < holidays.length; i++) {
    const holiday = holidays[i];
    const seed = `holiday-${holiday.name}-${today}`;
    const holidayDedupKey = `holiday-reminder-${holiday.name}`;
    const result = await send(
      'holiday-reminder',
      'ambient',
      'calendar',
      new Date(scheduleTime.getTime() + i * 5000),
      seed,
      { holidayName: holiday.name },
      { holidayName: holiday.name },
      undefined,
      holidayDedupKey
    );
    if (result) anyScheduled = true;
  }

  if (anyScheduled) {
    flags.markSentToday(flagKey);
    saveState();
  }
}

export async function checkTaskDueReminders(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences;
  // Check both circle (shared tasks) and planner (personal tasks) preferences
  const circleEnabled = prefs.circle?.taskDueReminders;
  const plannerEnabled = prefs.planner?.taskReminders;
  if (!circleEnabled && !plannerEnabled) return;

  const now = new Date();
  const today = getTodayKey();

  // ── Personal planner tasks ───────────────────────────────────────────────
  if (plannerEnabled) {
    try {
      const plannerTasks = store.getState().planner.tasks;
      for (const dayTasks of Object.values(plannerTasks)) {
        for (const task of dayTasks) {
          if (task.isCompleted || !task.dueDateTime) continue;
          const dueTime = new Date(task.dueDateTime).getTime();
          const hoursUntil = (dueTime - now.getTime()) / 3600000;

          if (hoursUntil > 0 && hoursUntil <= 24) {
            const flagKey = `task-due-${task.id}`;
            if (flags.hasSentToday(flagKey)) continue;

            const timeStr = hoursUntil <= 1 ? 'in less than an hour'
              : hoursUntil <= 4 ? 'in a few hours'
              : `in ${Math.ceil(hoursUntil)} hours`;

            const result = await send(
              'task-due-soon',
              'standard',
              'planner',
              new Date(now.getTime() + 30000),
              `task-due-${task.id}-${today}`,
              { task: task.content.substring(0, 40), time: timeStr },
              { taskId: task.id, dayKey: task.dayKey },
              undefined,
              flagKey
            );
            if (result) {
              flags.markSentToday(flagKey);
            }
          }
        }
      }
      saveState();
    } catch (e) {
      console.error('[NotificationEngine] Personal task due check failed:', e);
    }
  }

  // ── Circle / shared tasks (Firestore) ────────────────────────────────────
  if (circleEnabled) {
    try {
      const { db, getCurrentUser } = await import('./firebase');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const currentUser = getCurrentUser();
      if (!currentUser || !db) return;

      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('assigneeId', '==', currentUser.uid),
        where('status', 'in', ['accepted', 'assigned'])
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return;

      for (const docSnap of snapshot.docs) {
        const task = docSnap.data() as {
          title: string;
          civilDate?: { toMillis(): number };
          hekaDate?: { year: number; month: number; day: number };
          status: string;
        };

        let dueTime: number | null = null;
        if (task.civilDate?.toMillis) {
          dueTime = task.civilDate.toMillis();
        } else if (task.hekaDate) {
          const d = new Date();
          d.setDate(task.hekaDate.day);
          dueTime = d.getTime();
        }

        if (!dueTime) continue;
        const hoursUntil = (dueTime - now.getTime()) / 3600000;

        if (hoursUntil > 0 && hoursUntil <= 24) {
          const flagKey = `task-due-${docSnap.id}`;
          if (flags.hasSentToday(flagKey)) continue;

          const timeStr = hoursUntil <= 1 ? 'in less than an hour'
            : hoursUntil <= 4 ? 'in a few hours'
            : `in ${Math.ceil(hoursUntil)} hours`;

          const result = await send(
            'task-due-soon',
            'standard',
            'circle',
            new Date(now.getTime() + 30000),
            `task-due-${docSnap.id}-${today}`,
            { task: task.title, time: timeStr },
            { taskId: docSnap.id },
            undefined,
            flagKey
          );
          if (result) {
            flags.markSentToday(flagKey);
          }
        }
      }

      saveState();
    } catch (e) {
      console.error('[NotificationEngine] Circle task due check failed:', e);
    }
  }
}

export async function checkCelestialInsights(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.journal;
  if (!prefs.celestialInsightAlert) return;

  try {
    const { profileManager } = await import('../astrology/services/natal/profileManager');
    const activeProfile = profileManager.getActiveProfileWithChart();
    if (!activeProfile) return;

    const { positions } = await calculateCurrentSky();
    const natalPlanets = activeProfile.chart.planets;
    const today = getTodayKey();

    // Major aspect angles and names
    const ASPECTS = [
      { name: 'conjunction', angle: 0, orb: 2 },
      { name: 'opposition', angle: 180, orb: 1.5 },
      { name: 'square', angle: 90, orb: 1.5 },
      { name: 'trine', angle: 120, orb: 1.5 },
    ];

    const TRANSITING_PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    const NATAL_PLANETS = Object.keys(natalPlanets).filter(k => !['ascendant', 'midheaven', 'descendant', 'ic'].includes(k));

    for (const transName of TRANSITING_PLANETS) {
      const transBody = positions[transName];
      if (!transBody) continue;

      for (const natalName of NATAL_PLANETS) {
        const natalBody = natalPlanets[natalName];
        if (!natalBody) continue;

        const diff = Math.abs(transBody.longitude - natalBody.longitude);
        const separation = Math.min(diff, 360 - diff);

        for (const aspect of ASPECTS) {
          const orb = Math.abs(separation - aspect.angle);
          if (orb <= aspect.orb) {
            const flagKey = `transit-${transName}-${aspect.name}-${natalName}`;
            if (flags.hasSentToday(flagKey)) continue;

            const transitDesc = `${capitalize(transName)} ${aspect.name} your natal ${capitalize(natalName)} (${orb.toFixed(1)}° orb)`;

            const result = await send(
              'celestial-insight-alert',
              'ambient',
              'journal',
              new Date(Date.now() + 30000),
              `${flagKey}-${today}`,
              { transit: transitDesc },
              { transitingPlanet: transName, natalPlanet: natalName, aspect: aspect.name, orb },
              undefined,
              flagKey
            );
            if (result) {
              flags.markSentToday(flagKey);
              saveState();
            }

            // Only notify for the tightest aspect per planet pair today
            break;
          }
        }
      }
    }
  } catch (e) {
    console.error('[NotificationEngine] Celestial insight check failed:', e);
  }
}

export async function checkEveningReflection(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.journal;
  if (!prefs.dailyReflectionPrompt) return;

  const today = getTodayKey();
  const flagKey = 'evening-reflection';
  if (flags.hasSentToday(flagKey)) return;

  // Pre-schedule at user's preferred evening reflection time
  const scheduleTime = getNextScheduleTime('eveningReflection');

  const seed = `reflection-${today}`;
  const result = await send(
    'daily-reflection-prompt',
    'standard',
    'journal',
    scheduleTime,
    seed,
    {},
    { context: 'evening' }
  );
  if (result) {
    flags.markSentToday(flagKey);
    saveState();
  }
}

export async function checkNewYearReminders(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.calendar;
  if (!prefs.newYearReminders) return;

  const now = new Date();
  const hour = now.getHours();

  if (hour !== 7) return;

  const flagKey = 'new-year-reminder';
  if (flags.hasSentToday(flagKey)) return;

  const month = now.getMonth();
  const date = now.getDate();
  const isNewYear = month === 0 && date === 1;
  if (!isNewYear) return;

  const year = now.getFullYear();
  const seed = `new-year-${year}`;
  const result = await send(
    'new-year-reminder',
    'standard',
    'calendar',
    new Date(now.getTime() + 30000),
    seed,
    { year: String(year) },
    { year }
  );
  if (result) {
    flags.markSentToday(flagKey);
    saveState();
  }
}

export async function checkSolsticeEquinoxReminders(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.calendar;
  if (!prefs.solsticeEquinoxReminders) return;

  const now = new Date();
  const hour = now.getHours();

  if (hour !== 7) return;

  const flagKey = 'solstice-equinox-reminder';
  if (flags.hasSentToday(flagKey)) return;

  const event = getSolsticeEquinoxName(now);
  if (!event) return;

  const seed = `solstice-${event.name}-${now.getFullYear()}`;
  const result = await send(
    'solstice-equinox-reminder',
    'standard',
    'calendar',
    new Date(now.getTime() + 30000),
    seed,
    { event: event.name, eventDescription: event.description },
    { eventName: event.name }
  );
  if (result) {
    flags.markSentToday(flagKey);
    saveState();
  }
}

export async function checkMonthStartReminders(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.calendar;
  if (!prefs.monthStartReminders) return;

  const now = new Date();
  const hour = now.getHours();

  if (hour !== 7) return;

  const flagKey = 'month-start-reminder';
  if (flags.hasSentToday(flagKey)) return;

  const hekaDate = civilToHeka(now);
  if (!hekaDate || hekaDate.day !== 1) return;

  const monthName = HEKA_MONTHS[hekaDate.month - 1]?.name || `Month ${hekaDate.month}`;
  const arcNames = ['Creation', 'Formation', 'Expression', 'Stabilization', 'Integration', 'Transcendence'];
  const arcIndex = Math.floor((hekaDate.month - 1) / 2) % arcNames.length;
  const arcName = arcNames[arcIndex];

  const seed = `month-start-${hekaDate.year}-${hekaDate.month}`;
  const result = await send(
    'month-start-reminder',
    'ambient',
    'calendar',
    new Date(now.getTime() + 30000),
    seed,
    { month: monthName, arc: arcName },
    { hekaMonth: hekaDate.month, hekaYear: hekaDate.year }
  );
  if (result) {
    flags.markSentToday(flagKey);
    saveState();
  }
}

export async function checkNewMoonReminders(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
  getAstronomicalContext: () => Promise<AstronomicalContext>,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.stars;
  if (!prefs.newMoonReminders) return;

  const now = new Date();
  const hour = now.getHours();
  const today = getTodayKey();

  if (hour !== 7) return;

  const flagKey = 'new-moon-reminder';
  if (flags.hasSentToday(flagKey)) return;

  // Use precise Swiss Ephemeris phase from the astronomical context cache
  // instead of the approximate 0.5-day-tolerance calculator.
  const ctx = await getAstronomicalContext();
  const phaseNum = ctx.moonPhaseNum;
  const isNew = phaseNum !== null && (phaseNum < 0.03 || phaseNum > 0.97);
  if (!isNew) return;

  const seed = `new-moon-${today}`;
  const result = await send(
    'new-moon-reminder',
    'standard',
    'stars',
    new Date(now.getTime() + 30000),
    seed,
    {},
    { phase: ctx.moonPhase || 'New Moon' }
  );
  if (result) {
    flags.markSentToday(flagKey);
    saveState();
  }
}

export async function checkFullMoonReminders(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
  getAstronomicalContext: () => Promise<AstronomicalContext>,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.stars;
  if (!prefs.fullMoonReminders) return;

  const today = getTodayKey();
  const flagKey = 'full-moon-reminder';
  if (flags.hasSentToday(flagKey)) return;

  // Use precise Swiss Ephemeris phase from the astronomical context cache
  const ctx = await getAstronomicalContext();
  const phaseNum = ctx.moonPhaseNum;
  const isFull = phaseNum !== null && (phaseNum > 0.47 && phaseNum < 0.53);
  if (!isFull) return;

  // Pre-schedule at user's preferred full moon reminder time
  const scheduleTime = getNextScheduleTime('fullMoonReminders');

  const seed = `full-moon-${today}`;
  const result = await send(
    'full-moon-reminder',
    'standard',
    'stars',
    scheduleTime,
    seed,
    {},
    { phase: ctx.moonPhase || 'Full Moon' }
  );
  if (result) {
    flags.markSentToday(flagKey);
    saveState();
  }
}

export async function scheduleSunriseWakeUp(
  send: ScheduleTemplatedFn,
  flags: CheckersFlags,
  saveState: () => void,
  getAstronomicalContext: () => Promise<AstronomicalContext>,
): Promise<void> {
  const prefs = store.getState().calendar.notificationPreferences.stars;
  if (!prefs.sunriseWakeUp) return;

  const today = getTodayKey();
  const flagKey = 'sunrise-wake-up';
  if (flags.hasSentToday(flagKey)) return;

  const ctx = await getAstronomicalContext();
  if (!ctx.sunrise) return;

  const now = new Date();
  const sunriseTime = ctx.sunrise;

  // If sunrise has already passed today, schedule for tomorrow
  if (sunriseTime <= now) {
    sunriseTime.setDate(sunriseTime.getDate() + 1);
  }

  const sunriseTimeStr = sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const seed = `sunrise-${today}`;

  const result = await send(
    'sunrise-wake-up',
    'standard',
    'stars',
    sunriseTime,
    seed,
    {
      sunriseTime: sunriseTimeStr,
      planetaryHour: ctx.planetaryHour || 'Sun',
      moonSign: ctx.moonSign || 'Aries',
    },
    { sunriseTime: sunriseTime.toISOString() }
  );
  if (result) {
    flags.markSentToday(flagKey);
    saveState();
  }
}
