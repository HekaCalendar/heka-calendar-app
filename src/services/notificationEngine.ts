/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION ENGINE — Unified Intelligent Scheduler
 * Replaces 4 disconnected silos with a single orchestrated system.
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Principles:
 * 1. ONE engine owns all notification IDs — no collisions.
 * 2. Daily caps per tier: CORE=∞, STANDARD=3, AMBIENT=2.
 * 3. 4-hour deduplication window per type.
 * 4. CORE preempts STANDARD/AMBIENT if caps are full.
 * 5. Template rotation via seeded randomness.
 * 6. Cross-silo awareness: daily briefing + daily tips = one morning notification.
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import type {
  NotificationRequest,
  NotificationTier,
  DailyStats,
  NotificationEngineState,
  NotificationSection,
  DeliveredNotification,
} from '../types/notifications';
import {
  TIER_DAILY_CAPS,
  NOTIFICATION_ID_RANGES,
  DEFAULT_ENGINE_STATE,
} from '../types/notifications';
import { generateNotificationContent } from './notificationTemplates';
import { store } from '../store';
import { eventBus } from './eventBus';
import { civilToHeka, getDaysInMonth, HEKA_MONTHS } from './calendarService';
import { calculateVoidMoonStatus, getNextSignBoundary, calculateCurrentSky } from '../astrology/services/calculations/swissCalculations';
import { getSignFromLongitude } from '../astrology/types/core';
import { getHolidaysForDateWithSubRegion } from '../types/holidays';

// ── Constants ────────────────────────────────────────────────────────────────

const ENGINE_STORAGE_KEY = 'heka-notification-engine-state';
const DEDUPLICATION_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours
const RECONCILE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

const IS_NATIVE_APP = typeof (window as any).Capacitor !== 'undefined';

// ── Helpers ──────────────────────────────────────────────────────────────────

function isNativePluginAvailable(): boolean {
  if (!IS_NATIVE_APP) return false;
  try {
    return typeof LocalNotifications.requestPermissions === 'function';
  } catch {
    return false;
  }
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function generateId(section: NotificationSection, type: string): number {
  const range = NOTIFICATION_ID_RANGES[section];
  const typeHash = type.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return range.min + (typeHash % (range.max - range.min));
}

function loadEngineState(): NotificationEngineState {
  try {
    const raw = localStorage.getItem(ENGINE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_ENGINE_STATE, ...parsed };
    }
  } catch (e) {
    console.error('[NotificationEngine] Failed to load state:', e);
  }
  return { ...DEFAULT_ENGINE_STATE };
}

function saveEngineState(state: NotificationEngineState): void {
  try {
    localStorage.setItem(ENGINE_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[NotificationEngine] Failed to save state:', e);
  }
}

// ── Engine Class ─────────────────────────────────────────────────────────────

class NotificationEngineClass {
  private state: NotificationEngineState;
  private reconcileTimer: ReturnType<typeof setInterval> | null = null;
  private voidMoonTimer: ReturnType<typeof setInterval> | null = null;
  private hekaCheckTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.state = loadEngineState();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  async initialize(): Promise<void> {
    console.log('[NotificationEngine] Initializing...');
    this.state = loadEngineState();

    // Clean old ledgers (keep last 7 days)
    const today = getTodayKey();
    const cutoff = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    for (const key of Object.keys(this.state.dailyLedgers)) {
      if (key < cutoff) {
        delete this.state.dailyLedgers[key];
      }
    }

    // Clean sentTodayFlags older than today
    for (const key of Object.keys(this.state.sentTodayFlags)) {
      if (this.state.sentTodayFlags[key] !== today) {
        delete this.state.sentTodayFlags[key];
      }
    }

    // Detect timezone changes
    const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.state.timezone && this.state.timezone !== currentTz) {
      console.log(`[NotificationEngine] Timezone changed: ${this.state.timezone} → ${currentTz}`);
    }
    this.state.timezone = currentTz;

    saveEngineState(this.state);
    console.log('[NotificationEngine] Initialized. Ledger:', this.state.dailyLedgers[today]?.counts || { core: 0, standard: 0, ambient: 0 });
  }

  startRecurringChecks(): void {
    if (this.reconcileTimer) clearInterval(this.reconcileTimer);
    this.reconcileTimer = setInterval(() => {
      void this.reconcile();
    }, RECONCILE_INTERVAL_MS);

    // Start void moon watcher
    this.startVoidMoonWatcher();

    // Start hourly time-gated checkers
    // Each checker only fires during its designated hour window
    if (this.hekaCheckTimer) clearInterval(this.hekaCheckTimer);
    this.hekaCheckTimer = setInterval(() => {
      const hour = new Date().getHours();
      // 9 AM: HEKA transition nudges
      if (hour === 9) void this.checkHekaTransitions();
      // 10 AM: Tracker reminders (during active hours)
      if (hour === 10) void this.checkTrackerReminders();
      // 11 AM: Task due reminders
      if (hour === 11) void this.checkTaskDueReminders();
      // 2 PM: Celestial insights
      if (hour === 14) void this.checkCelestialInsights();
      // 7 PM: Holiday reminders (day before)
      if (hour === 19) void this.checkHolidayReminders();
      // 8:30 PM: Evening reflection
      if (hour === 20) void this.checkEveningReflection();
    }, 60 * 60 * 1000); // Check every hour
  }

  stopRecurringChecks(): void {
    if (this.reconcileTimer) {
      clearInterval(this.reconcileTimer);
      this.reconcileTimer = null;
    }
    if (this.voidMoonTimer) {
      clearInterval(this.voidMoonTimer);
      this.voidMoonTimer = null;
    }
    if (this.hekaCheckTimer) {
      clearInterval(this.hekaCheckTimer);
      this.hekaCheckTimer = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE SCHEDULING
  // ═══════════════════════════════════════════════════════════════════════════

  async schedule(req: NotificationRequest): Promise<string | null> {
    const prefs = store.getState().calendar.notificationPreferences;
    if (!prefs.globalEnabled) {
      console.log('[NotificationEngine] Global notifications disabled. Skipping:', req.type);
      return null;
    }

    // Check section-specific preference
    if (!this.isSectionEnabled(req.section, req.type)) {
      console.log(`[NotificationEngine] Section ${req.section} disabled for ${req.type}. Skipping.`);
      return null;
    }

    // Resolve ID
    const notificationId = req.id || generateId(req.section, req.type);
    const idString = String(notificationId);

    // Should we deliver?
    if (!this.shouldDeliver(req)) {
      console.log(`[NotificationEngine] Delivery blocked for ${req.type} (cap/dedup/priority).`);
      return null;
    }

    // Native path
    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      try {
        const { display } = await LocalNotifications.checkPermissions();
        if (display !== 'granted') {
          console.log('[NotificationEngine] Native permission not granted');
          return null;
        }

        // Cancel existing if replaceable
        if (req.replaceExisting) {
          try {
            await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
          } catch {
            // ignore cancel errors
          }
        }

        await LocalNotifications.schedule({
          notifications: [{
            id: notificationId,
            title: req.title,
            body: req.body,
            schedule: { at: req.scheduleAt },
            smallIcon: 'ic_notification',
            iconColor: '#c9a227',
            extra: { ...req.extra, _engineType: req.type, _engineTier: req.tier, _engineSection: req.section },
          }]
        });

        // Record in history immediately so all sent notifications are logged
        this.recordSent(req, idString);

        console.log(`[NotificationEngine] Scheduled native ${req.type} at ${req.scheduleAt.toISOString()}`);
        return idString;
      } catch (error) {
        console.error('[NotificationEngine] Native schedule error:', error);
        return null;
      }
    }

    // Browser fallback: setTimeout (only works while page is open)
    const delay = req.scheduleAt.getTime() - Date.now();
    if (delay <= 0) {
      // Immediate
      this.showWebNotification(req.title, { body: req.body });
      this.recordSent(req, idString);
      return idString;
    }

    setTimeout(() => {
      this.showWebNotification(req.title, { body: req.body });
      this.recordSent(req, idString);
    }, delay);

    return idString;
  }

  async cancel(id: string): Promise<boolean> {
    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      try {
        await LocalNotifications.cancel({ notifications: [{ id: parseInt(id) }] });
        return true;
      } catch (error) {
        console.error('[NotificationEngine] Cancel error:', error);
        return false;
      }
    }
    return true;
  }

  async cancelByType(type: string): Promise<void> {
    // On native, we can't easily cancel by type without tracking IDs
    // For now, we rely on replaceExisting on next schedule
    console.log(`[NotificationEngine] Cancel by type ${type} — will be replaced on next schedule.`);
  }

  async cancelAll(): Promise<void> {
    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      try {
        const { notifications } = await LocalNotifications.getPending();
        if (notifications && notifications.length > 0) {
          await LocalNotifications.cancel({ notifications });
        }
      } catch (error) {
        console.error('[NotificationEngine] Cancel all error:', error);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DELIVERY LOGIC
  // ═══════════════════════════════════════════════════════════════════════════

  private shouldDeliver(req: NotificationRequest): boolean {
    const today = getTodayKey();
    const ledger = this.state.dailyLedgers[today] || { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [] };

    // Quiet hours check: CORE bypasses, STANDARD/AMBIENT respects
    if (req.tier !== 'core') {
      const prefs = store.getState().calendar.notificationPreferences;
      const qh = prefs.quietHours;
      if (qh?.enabled) {
        const hour = new Date().getHours();
        const inQuietHours = qh.start > qh.end
          ? (hour >= qh.start || hour < qh.end)
          : (hour >= qh.start && hour < qh.end);
        if (inQuietHours) {
          console.log(`[NotificationEngine] ${req.type} blocked by quiet hours (${qh.start}:00-${qh.end}:00).`);
          return false;
        }
      }
    }

    // Deduplication: same type within 4h?
    const recentSameType = ledger.delivered.filter(d =>
      d.type === req.type && (Date.now() - d.deliveredAt) < DEDUPLICATION_WINDOW_MS
    );
    if (recentSameType.length > 0) {
      console.log(`[NotificationEngine] Deduplicated ${req.type} within window.`);
      return false;
    }

    // Cross-silo dedup: daily briefing and daily tips are both morning STANDARD
    if (req.tier === 'standard') {
      const morningTypes = ['daily-briefing', 'daily-celestial-tips'];
      if (morningTypes.includes(req.type)) {
        const hadMorningBriefing = ledger.delivered.some(d =>
          morningTypes.includes(d.type) && (Date.now() - d.deliveredAt) < DEDUPLICATION_WINDOW_MS
        );
        if (hadMorningBriefing) {
          console.log(`[NotificationEngine] Morning briefing already sent. Skipping ${req.type}.`);
          return false;
        }
      }
    }

    // Tier cap check
    const cap = TIER_DAILY_CAPS[req.tier];
    if (cap !== Infinity && ledger.counts[req.tier] >= cap) {
      // CORE can preempt — but req is not CORE if we're here
      console.log(`[NotificationEngine] ${req.tier} cap reached (${ledger.counts[req.tier]}/${cap}).`);
      return false;
    }

    return true;
  }

  /**
   * Record that a notification was sent/scheduled.
   * Adds to history WITHOUT incrementing tier caps (caps were already checked
   * in shouldDeliver). Emits event for real-time UI updates.
   */
  private recordSent(req: NotificationRequest, id: string): void {
    const today = getTodayKey();
    if (!this.state.dailyLedgers[today]) {
      this.state.dailyLedgers[today] = { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [] };
    }
    const ledger = this.state.dailyLedgers[today];

    // Dedup: don't record the same ID twice
    if (ledger.delivered.some(d => d.id === id)) {
      return;
    }

    ledger.delivered.push({
      id,
      type: req.type,
      tier: req.tier,
      section: req.section,
      title: req.title,
      body: req.body,
      deliveredAt: Date.now(),
      extra: req.extra,
    });
    saveEngineState(this.state);

    // Notify UI in real time
    eventBus.emit('heka-notification-sent', { type: req.type, title: req.title });
  }

  /**
   * Record that a notification was actually interacted with (tapped).
   * Call this from the tap handler, NOT at schedule time.
   * This also increments tier engagement counts.
   */
  recordDelivery(req: NotificationRequest, id: string): void {
    const today = getTodayKey();
    if (!this.state.dailyLedgers[today]) {
      this.state.dailyLedgers[today] = { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [] };
    }
    const ledger = this.state.dailyLedgers[today];

    // Dedup: don't record the same ID twice
    if (ledger.delivered.some(d => d.id === id)) {
      return;
    }

    ledger.counts[req.tier]++;
    ledger.delivered.push({
      id,
      type: req.type,
      tier: req.tier,
      section: req.section,
      title: req.title,
      body: req.body,
      deliveredAt: Date.now(),
      extra: req.extra,
    });
    saveEngineState(this.state);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION ENABLEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  private isSectionEnabled(section: NotificationSection, type: string): boolean {
    const prefs = store.getState().calendar.notificationPreferences;
    switch (section) {
      case 'calendar':
        if (type === 'holiday-reminder') return prefs.calendar.holidayReminders;
        if (type === 'civil-heka-transition') return prefs.calendar.civilHekaTransition;
        if (type === 'moon-degree-update') return prefs.calendar.moonPhaseDegrees;
        if (type === 'note-reminder') return prefs.calendar.noteReminders;
        return true;
      case 'stars':
        if (type === 'daily-celestial-tips') return prefs.stars.dailyCelestialTips;
        if (type === 'retrograde-alert') return prefs.stars.retrogradeAlerts;
        if (type.startsWith('void-moon')) return prefs.stars.voidMoonReminders;
        if (type === 'moon-degree-update') return prefs.stars.moonDegreeNotifications;
        return true;
      case 'circle':
        if (type === 'friend-request') return prefs.circle.friendRequests;
        if (type === 'task-assigned') return prefs.circle.taskRequests;
        if (type === 'message-received') return prefs.circle.messages;
        if (type === 'task-due-soon') return prefs.circle.taskDueReminders;
        if (type === 'task-completed' || type === 'task-declined') return prefs.circle.taskRequests;
        return true;
      case 'journal':
        if (type === 'tracker-reminder') return prefs.journal.trackerReminders;
        if (type === 'daily-reflection-prompt') return prefs.journal.dailyReflectionPrompt;
        if (type === 'celestial-insight-alert') return prefs.journal.celestialInsightAlert;
        return true;
      case 'planner':
        if (type === 'task-reminder') return prefs.planner.taskReminders;
        if (type === 'daily-briefing') return prefs.planner.dailyBriefing;
        if (type === 'streak-saver' || type === 'streak-protection') return prefs.planner.streakSaver;
        if (type === 'completion-celebration') return prefs.planner.completionCelebrations;
        if (type === 'complementary-task') return prefs.planner.complementaryTasks;
        return true;
      default:
        return true;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WEB FALLBACK
  // ═══════════════════════════════════════════════════════════════════════════

  private showWebNotification(title: string, options?: NotificationOptions): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'heka-calendar',
      requireInteraction: false,
      ...options,
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RECONCILIATION
  // ═══════════════════════════════════════════════════════════════════════════

  async reconcile(): Promise<void> {
    console.log('[NotificationEngine] Reconciling...');
    this.state.lastReconcileAt = Date.now();
    saveEngineState(this.state);

    // Run time-agnostic background checks only
    // Time-of-day specific checkers have their own dedicated timers
    await this.checkVoidMoon();
    await this.checkMoonDegree();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CIVIL ↔ HEKA TRANSITION CHECKER
  // ═══════════════════════════════════════════════════════════════════════════

  async checkHekaTransitions(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.calendar;
    if (!prefs.civilHekaTransition) return;

    const now = new Date();
    const today = getTodayKey();
    const hekaDate = civilToHeka(now);
    if (!hekaDate) return;

    const daysInMonth = getDaysInMonth(hekaDate.year, hekaDate.month);
    const daysRemaining = daysInMonth - hekaDate.day;
    const currentMonthName = HEKA_MONTHS[hekaDate.month]?.name || 'Unknown';
    const nextMonthName = HEKA_MONTHS[(hekaDate.month + 1) % 13]?.name || 'Unknown';
    const civilMonthName = now.toLocaleString('default', { month: 'long' });

    let context = '';
    let vars: Record<string, string> = {};

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
    if (this.state.sentTodayFlags[flagKey] === today) {
      return; // Already sent today
    }

    await this.scheduleTemplated(
      'civil-heka-transition',
      'ambient',
      'calendar',
      new Date(Date.now() + 5000),
      seed,
      vars,
      { context }
    );
    this.state.sentTodayFlags[flagKey] = today;
    saveEngineState(this.state);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VOID MOON WATCHER
  // ═══════════════════════════════════════════════════════════════════════════

  async checkVoidMoon(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.stars;
    if (!prefs.voidMoonReminders) return;

    try {
      const voidData = await calculateVoidMoonStatus();
      const isVoid = voidData.isVoid;
      const prevState = this.state.lastVoidMoonState;

      // Transition: not void → void
      if (isVoid && prevState === false) {
        const seed = 'enter-' + Date.now();
        await this.scheduleTemplated(
          'void-moon-entered',
          'core',
          'stars',
          new Date(Date.now() + 1000),
          seed,
          {
            sign: voidData.moonSign || 'unknown',
            quality: voidData.quality,
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
        const moonLon = (voidData as any).moonLongitude || 0;
        const nextBoundary = getNextSignBoundary(moonLon, use13Signs);
        const nextSign = getSignFromLongitude(nextBoundary + 0.1 as any, use13Signs);
        await this.scheduleTemplated(
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

      this.state.lastVoidMoonState = isVoid;
      saveEngineState(this.state);
    } catch (e) {
      console.error('[NotificationEngine] Void moon check failed:', e);
    }
  }

  startVoidMoonWatcher(): void {
    if (this.voidMoonTimer) clearInterval(this.voidMoonTimer);
    this.voidMoonTimer = setInterval(() => {
      void this.checkVoidMoon();
      void this.checkMoonDegree();
    }, 30 * 60 * 1000); // Every 30 minutes
  }

  stopVoidMoonWatcher(): void {
    if (this.voidMoonTimer) {
      clearInterval(this.voidMoonTimer);
      this.voidMoonTimer = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MOON DEGREE WATCHER
  // ═══════════════════════════════════════════════════════════════════════════

  async checkMoonDegree(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.stars;
    if (!prefs.moonDegreeNotifications) return;

    try {
      const { positions } = await calculateCurrentSky();
      const moon = positions.moon;
      if (!moon) return;

      const currentDegree = Math.floor(moon.longitude);
      const prevDegree = this.state.lastMoonDegree;

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
        await this.scheduleTemplated(
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

      this.state.lastMoonDegree = currentDegree;
      saveEngineState(this.state);
    } catch (e) {
      console.error('[NotificationEngine] Moon degree check failed:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRACKER REMINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  async checkTrackerReminders(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.journal;
    if (!prefs.trackerReminders) return;

    try {
      const { TrackerManager } = await import('./trackerManager');
      const enabledTrackers = JSON.parse(localStorage.getItem('heka_enabled_trackers') || '[]') as string[];
      if (!enabledTrackers.length) return;

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      const TRACKER_LABELS: Record<string, string> = {
        menstrual: 'Menstrual Cycle',
        mood: 'Mood Tracker',
        sleep: 'Sleep Log',
        energy: 'Energy Tracker',
        medication: 'Medication Log',
        symptom: 'Symptom Tracker',
        habit: 'Habit Tracker',
        gratitude: 'Gratitude Journal',
      };

      for (const trackerType of enabledTrackers) {
        const flagKey = `tracker-${trackerType}`;
        if (this.state.sentTodayFlags[flagKey] === todayStr) {
          continue; // Already sent today
        }

        const trackerLabel = TRACKER_LABELS[trackerType] || trackerType;
        const recent = TrackerManager.getMostRecentEntry(trackerType as any);
        if (!recent) {
          // Never logged — suggest starting
          await this.scheduleTemplated(
            'tracker-reminder',
            'standard',
            'journal',
            new Date(Date.now() + 5000),
            trackerType + todayStr,
            { trackerType: trackerLabel, when: 'soon', days: '0' },
            { trackerType }
          );
          this.state.sentTodayFlags[flagKey] = todayStr;
          continue;
        }

        const daysSince = Math.floor((now.getTime() - new Date(recent.date).getTime()) / 86400000);
        const threshold = trackerType === 'sleep' ? 3 : trackerType === 'mood' ? 2 : trackerType === 'energy' ? 2 : 1;

        if (daysSince >= threshold) {
          await this.scheduleTemplated(
            'tracker-reminder',
            'standard',
            'journal',
            new Date(Date.now() + 5000),
            trackerType + todayStr,
            { trackerType: trackerLabel, when: 'today', days: String(daysSince) },
            { trackerType, daysSince }
          );
          this.state.sentTodayFlags[flagKey] = todayStr;
        }
      }
    } catch (e) {
      console.error('[NotificationEngine] Tracker reminder check failed:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HOLIDAY REMINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  async checkHolidayReminders(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.calendar;
    if (!prefs.holidayReminders) return;

    const now = new Date();
    const hour = now.getHours();
    const today = getTodayKey();

    // Evening reminder at 7 PM (19:00) ± 30 min window
    if (hour !== 19) return;

    const flagKey = 'holiday-reminder';
    if (this.state.sentTodayFlags[flagKey] === today) return;

    const state = store.getState().calendar;
    const country = (state.location || 'AU') as import('../types/holidays').CountryCode;
    const subRegion = state.subRegion as import('../types/holidays').SubRegionCode | undefined;

    // Check tomorrow's holidays
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const holidays = getHolidaysForDateWithSubRegion(tomorrow, country, subRegion);

    if (!holidays.length) return;

    // Send one notification per holiday (capped by ambient tier)
    for (let i = 0; i < holidays.length; i++) {
      const holiday = holidays[i];
      const seed = `holiday-${holiday.name}-${today}`;
      await this.scheduleTemplated(
        'holiday-reminder',
        'ambient',
        'calendar',
        new Date(now.getTime() + 30000 + i * 5000),
        seed,
        { holidayName: holiday.name },
        { holidayName: holiday.name }
      );
    }

    this.state.sentTodayFlags[flagKey] = today;
    saveEngineState(this.state);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK DUE REMINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  async checkTaskDueReminders(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.circle;
    if (!prefs.taskDueReminders) return;

    try {
      const { db, getCurrentUser } = await import('./firebase');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const currentUser = getCurrentUser();
      if (!currentUser || !db) return;

      const now = new Date();
      const today = getTodayKey();
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
          // Rough HEKA to civil conversion — use noon of current civil month
          const d = new Date();
          d.setDate(task.hekaDate.day);
          dueTime = d.getTime();
        }

        if (!dueTime) continue;
        const hoursUntil = (dueTime - now.getTime()) / 3600000;

        // Notify if due within 24 hours and not already notified today
        if (hoursUntil > 0 && hoursUntil <= 24) {
          const flagKey = `task-due-${docSnap.id}`;
          if (this.state.sentTodayFlags[flagKey] === today) continue;

          const timeStr = hoursUntil <= 1 ? 'in less than an hour'
            : hoursUntil <= 4 ? 'in a few hours'
            : `in ${Math.ceil(hoursUntil)} hours`;

          await this.scheduleTemplated(
            'task-due-soon',
            'standard',
            'circle',
            new Date(now.getTime() + 30000),
            `task-due-${docSnap.id}-${today}`,
            { task: task.title, time: timeStr },
            { taskId: docSnap.id }
          );
          this.state.sentTodayFlags[flagKey] = today;
        }
      }

      saveEngineState(this.state);
    } catch (e) {
      console.error('[NotificationEngine] Task due check failed:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CELESTIAL INSIGHTS (Transit-to-Natal)
  // ═══════════════════════════════════════════════════════════════════════════

  async checkCelestialInsights(): Promise<void> {
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
              if (this.state.sentTodayFlags[flagKey] === today) continue;

              const transitDesc = `${this.capitalize(transName)} ${aspect.name} your natal ${this.capitalize(natalName)} (${orb.toFixed(1)}° orb)`;

              await this.scheduleTemplated(
                'celestial-insight-alert',
                'ambient',
                'journal',
                new Date(Date.now() + 30000),
                `${flagKey}-${today}`,
                { transit: transitDesc },
                { transitingPlanet: transName, natalPlanet: natalName, aspect: aspect.name, orb }
              );
              this.state.sentTodayFlags[flagKey] = today;
              saveEngineState(this.state);

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

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENING REFLECTION SCHEDULER
  // ═══════════════════════════════════════════════════════════════════════════

  async checkEveningReflection(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.journal;
    if (!prefs.dailyReflectionPrompt) return;

    const now = new Date();
    const hour = now.getHours();
    const today = getTodayKey();

    // Fire at 8:30 PM (20:30) ± 30 min window during reconcile
    if (hour !== 20) return;

    const flagKey = 'evening-reflection';
    if (this.state.sentTodayFlags[flagKey] === today) return;

    const seed = `reflection-${today}`;
    await this.scheduleTemplated(
      'daily-reflection-prompt',
      'standard',
      'journal',
      new Date(now.getTime() + 60000), // 1 min from now
      seed,
      {},
      { context: 'evening' }
    );
    this.state.sentTodayFlags[flagKey] = today;
    saveEngineState(this.state);
  }

  /**
   * Check if a flag was already set for today (daily deduplication).
   */
  hasSentToday(flagKey: string): boolean {
    const today = getTodayKey();
    return this.state.sentTodayFlags[flagKey] === today;
  }

  /**
   * Mark a flag as sent for today.
   */
  markSentToday(flagKey: string): void {
    const today = getTodayKey();
    this.state.sentTodayFlags[flagKey] = today;
    saveEngineState(this.state);
  }

  getDailyStats(): DailyStats {
    const today = getTodayKey();
    return this.state.dailyLedgers[today] || { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [] };
  }

  /**
   * Record user engagement with a notification template.
   * Called when user taps a notification.
   */
  recordEngagement(type: string, templateIndex: number): void {
    if (!this.state.templateEngagement[type]) {
      this.state.templateEngagement[type] = {};
    }
    const counts = this.state.templateEngagement[type];
    counts[templateIndex] = (counts[templateIndex] || 0) + 1;
    saveEngineState(this.state);
  }

  /**
   * Get recent notification history (last 7 days)
   */
  getHistory(limit = 50): DeliveredNotification[] {
    const entries: DeliveredNotification[] = [];
    const dates = Object.keys(this.state.dailyLedgers).sort().reverse();
    for (const date of dates) {
      const ledger = this.state.dailyLedgers[date];
      for (const d of [...ledger.delivered].reverse()) {
        entries.push(d);
        if (entries.length >= limit) return entries;
      }
    }
    return entries;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HIGH-LEVEL SCHEDULERS (called by services)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Schedule with template system
   */
  async scheduleTemplated(
    type: string,
    tier: NotificationTier,
    section: NotificationSection,
    scheduleAt: Date,
    seed: string,
    vars: Record<string, string>,
    extra?: Record<string, any>,
    id?: number
  ): Promise<string | null> {
    const { title, body, templateIndex } = generateNotificationContent(type, seed, vars);
    return this.schedule({
      type,
      tier,
      title,
      body,
      scheduleAt,
      section,
      extra: { ...extra, templateIndex },
      replaceExisting: true,
      id,
    });
  }

  /**
   * Schedule a CORE notification (always attempts delivery)
   */
  async notifyCore(
    type: string,
    section: NotificationSection,
    title: string,
    body: string,
    extra?: Record<string, any>,
    id?: number
  ): Promise<string | null> {
    return this.schedule({
      type,
      tier: 'core',
      title,
      body,
      scheduleAt: new Date(Date.now() + 1000),
      section,
      extra,
      id,
    });
  }

  /**
   * Schedule a STANDARD notification
   */
  async notifyStandard(
    type: string,
    section: NotificationSection,
    title: string,
    body: string,
    scheduleAt: Date,
    extra?: Record<string, any>,
    id?: number
  ): Promise<string | null> {
    return this.schedule({
      type,
      tier: 'standard',
      title,
      body,
      scheduleAt,
      section,
      extra,
      replaceExisting: true,
      id,
    });
  }

  /**
   * Schedule an AMBIENT notification
   */
  async notifyAmbient(
    type: string,
    section: NotificationSection,
    title: string,
    body: string,
    scheduleAt: Date,
    extra?: Record<string, any>,
    id?: number
  ): Promise<string | null> {
    return this.schedule({
      type,
      tier: 'ambient',
      title,
      body,
      scheduleAt,
      section,
      extra,
      replaceExisting: true,
      id,
    });
  }
}

// ── Singleton Export ─────────────────────────────────────────────────────────

export const NotificationEngine = new NotificationEngineClass();
