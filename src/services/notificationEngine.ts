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
import { getHolidaysForDateWithSubRegion, LOCATIONS, SUB_REGIONS } from '../types/holidays';
import { calculateSunTimes, getCurrentPlanetaryHour } from '../astrology/services/calculations/swissCalculations';

// ── Constants ────────────────────────────────────────────────────────────────

const ENGINE_STORAGE_KEY = 'heka-notification-engine-state';
const GENIUS_QUEUE_KEY = 'heka-genius-queue';
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

// ── Astronomical Helpers (lightweight approximations for notifications) ──────

/** Detect solstice or equinox for a date (within +/-1 day tolerance). */
function getSolsticeEquinoxName(date: Date): { name: string; description: string } | null {
  const m = date.getMonth();
  const d = date.getDate();
  if (m === 2 && (d === 19 || d === 20 || d === 21)) return { name: 'Spring Equinox', description: 'vernal equinox -- day and night in balance' };
  if (m === 5 && (d === 20 || d === 21 || d === 22)) return { name: 'Summer Solstice', description: 'longest day of the year in the Northern Hemisphere' };
  if (m === 8 && (d === 21 || d === 22 || d === 23)) return { name: 'Autumn Equinox', description: 'autumnal equinox -- equal light and dark once more' };
  if (m === 11 && (d === 20 || d === 21 || d === 22)) return { name: 'Winter Solstice', description: 'shortest day of the year in the Northern Hemisphere' };
  return null;
}

// ── Engine Class ─────────────────────────────────────────────────────────────

// ── Genius Scheduler Types ───────────────────────────────────────────────────

interface GeniusProposal {
  type: string;
  tier: NotificationTier;
  section: NotificationSection;
  scheduleAt: Date;
  seed: string;
  vars: Record<string, string>;
  extra?: Record<string, any>;
  id?: number;
  dedupKey?: string;
  score: number;
  context: AstronomicalContext;
}

interface AstronomicalContext {
  sunrise: Date | null;
  sunset: Date | null;
  dayLengthMinutes: number;
  planetaryHour: string | null;
  planetaryHourSymbol: string | null;
  moonPhase: string | null;
  moonSign: string | null;
  moonIllumination: string | null;
  /** Precise moon phase number (0-1) from Swiss Ephemeris. 0=new, 0.5=full. */
  moonPhaseNum: number | null;
  daySegment: 'dawn' | 'morning' | 'midday' | 'evening' | 'night';
  minutesUntilSunrise: number | null;
  minutesUntilSunset: number | null;
  minutesSinceSunrise: number | null;
  minutesSinceSunset: number | null;
}

const GENIUS_FLUSH_DELAY_MS = 500; // 500ms after last proposal — short enough to survive app kill, long enough to batch
const MIN_SPACING_STANDARD_MS = 45 * 60 * 1000; // 45 min between STANDARD
const MIN_SPACING_AMBIENT_MS = 30 * 60 * 1000;  // 30 min between AMBIENT
const ENGAGEMENT_DECAY = 0.9; // Decay old engagement scores by 10% per update

class NotificationEngineClass {
  private state: NotificationEngineState;
  private reconcileTimer: ReturnType<typeof setInterval> | null = null;
  private voidMoonTimer: ReturnType<typeof setInterval> | null = null;
  private hekaCheckTimer: ReturnType<typeof setInterval> | null = null;
  private geniusQueue: GeniusProposal[] = [];
  private geniusTimer: ReturnType<typeof setTimeout> | null = null;
  private astroCache: { context: AstronomicalContext | null; expiresAt: number } = { context: null, expiresAt: 0 };
  /** Counter for active checker invocations. >0 means we're in a checker context. */
  private checkerDepth = 0;
  private webTimeouts: Map<string, number> = new Map();
  private webMeta: Map<string, { type: string; taskId?: string; extra?: Record<string, any> }> = new Map();
  /** Track scheduled IDs by type so cancelByType() actually works. */
  private typeToIds: Map<string, Set<string>> = new Map();

  constructor() {
    this.state = loadEngineState();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  async initialize(): Promise<void> {
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

    // Migrate old ledger format: ensure tapped array exists
    for (const ledger of Object.values(this.state.dailyLedgers)) {
      if (!ledger.tapped) {
        ledger.tapped = [];
      }
    }

    // Restore any persisted genius queue from previous session
    this.restoreGeniusQueue();

    // Detect timezone changes
    const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.state.timezone && this.state.timezone !== currentTz) {
    }
    this.state.timezone = currentTz;

    saveEngineState(this.state);
  }

  startRecurringChecks(): void {
    if (this.reconcileTimer) clearInterval(this.reconcileTimer);
    this.reconcileTimer = setInterval(() => {
      void this.reconcile();
    }, RECONCILE_INTERVAL_MS);

    // Start void moon watcher
    this.startVoidMoonWatcher();

    // Run current hour's checkers immediately so we don't miss the window
    // if the app opened late (e.g. 7:05 AM still runs 7 AM checkers once).
    // Each checker gates with sentTodayFlags, so this is safe from double-fire.
    this.runChecker(() => this.checkNewYearReminders());
    this.runChecker(() => this.checkSolsticeEquinoxReminders());
    this.runChecker(() => this.checkMonthStartReminders());
    this.runChecker(() => this.checkNewMoonReminders());
    this.runChecker(() => this.checkHekaTransitions());
    this.runChecker(() => this.checkTrackerReminders());
    this.runChecker(() => this.checkTaskDueReminders());
    this.runChecker(() => this.checkCelestialInsights());
    this.runChecker(() => this.checkHolidayReminders());
    this.runChecker(() => this.checkFullMoonReminders());
    this.runChecker(() => this.checkEveningReflection());

    // Start hourly time-gated checkers
    // Each checker only fires during its designated hour window
    if (this.hekaCheckTimer) clearInterval(this.hekaCheckTimer);
    this.hekaCheckTimer = setInterval(() => {
      this.runChecker(() => this.checkNewYearReminders());
      this.runChecker(() => this.checkSolsticeEquinoxReminders());
      this.runChecker(() => this.checkMonthStartReminders());
      this.runChecker(() => this.checkNewMoonReminders());
      this.runChecker(() => this.checkHekaTransitions());
      this.runChecker(() => this.checkTrackerReminders());
      this.runChecker(() => this.checkTaskDueReminders());
      this.runChecker(() => this.checkCelestialInsights());
      this.runChecker(() => this.checkHolidayReminders());
      this.runChecker(() => this.checkFullMoonReminders());
      this.runChecker(() => this.checkEveningReflection());
    }, 60 * 60 * 1000); // Check every hour
  }

  /**
   * Run a checker with proper checkerDepth tracking so async checkers
   * that await before calling scheduleTemplated still route through
   * the Genius Scheduler.
   */
  private runChecker(checker: () => Promise<void>): void {
    this.checkerDepth++;
    checker().catch((e) => {
      console.error('[NotificationEngine] Checker failed:', e);
    }).finally(() => {
      this.checkerDepth--;
    });
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
      return null;
    }

    // Check section-specific preference
    if (!this.isSectionEnabled(req.section, req.type)) {
      return null;
    }

    // Resolve ID
    const notificationId = req.id || generateId(req.section, req.type);
    const idString = String(notificationId);

    // Should we deliver?
    if (!this.shouldDeliver(req)) {
      return null;
    }

    // Track ID by type for cancelByType
    const typeKey = req.type;
    if (!this.typeToIds.has(typeKey)) this.typeToIds.set(typeKey, new Set());
    this.typeToIds.get(typeKey)!.add(idString);

    // Native path
    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      try {
        const { display } = await LocalNotifications.checkPermissions();
        if (display !== 'granted') {
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

        // Record in ledger for caps/dedup tracking. This does NOT mean the OS delivered it —
        // only that we successfully registered the alarm. Actual delivery is confirmed
        // via localNotificationReceived listener calling confirmDelivery().
        this.recordSent(req, idString);

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

    // Record immediately for dedup/caps (same as native). If the tab closes
    // before the timeout fires, the notification is lost but caps were correctly
    // counted — this is acceptable PWA behavior.
    this.recordSent(req, idString);

    // Cancel existing web timeout if replacing
    if (req.replaceExisting) {
      const existing = this.webTimeouts.get(idString);
      if (existing !== undefined) {
        clearTimeout(existing);
        this.webTimeouts.delete(idString);
      }
    }

    const timeoutId = window.setTimeout(() => {
      this.showWebNotification(req.title, { body: req.body });
      this.confirmDelivery(idString);
      this.webTimeouts.delete(idString);
      this.webMeta.delete(idString);
    }, delay);

    this.webTimeouts.set(idString, timeoutId);
    this.webMeta.set(idString, { type: req.type, taskId: req.extra?.taskId, extra: req.extra });
    return idString;
  }

  async cancel(id: string): Promise<boolean> {
    // Remove from type tracking
    for (const [type, ids] of this.typeToIds) {
      if (ids.has(id)) {
        ids.delete(id);
        if (ids.size === 0) this.typeToIds.delete(type);
        break;
      }
    }

    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      try {
        await LocalNotifications.cancel({ notifications: [{ id: parseInt(id) }] });
        return true;
      } catch (error) {
        console.error('[NotificationEngine] Cancel error:', error);
        return false;
      }
    }
    // Web: clear tracked timeout
    const timeoutId = this.webTimeouts.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      this.webTimeouts.delete(id);
      this.webMeta.delete(id);
    }
    return true;
  }

  /**
   * Get IDs of notifications currently scheduled (native pending + web timeouts).
   */
  async getScheduledIds(): Promise<string[]> {
    const ids: string[] = [];
    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      try {
        const { notifications } = await LocalNotifications.getPending();
        if (notifications) {
          ids.push(...notifications.map(n => String(n.id)));
        }
      } catch (e) {
        console.error('[NotificationEngine] getPending error:', e);
      }
    }
    ids.push(...this.webTimeouts.keys());
    return ids;
  }

  /**
   * Get metadata for all web notifications currently scheduled.
   */
  getWebScheduledMeta(): Array<{ id: string; type: string; taskId?: string; extra?: Record<string, any> }> {
    return Array.from(this.webMeta.entries()).map(([id, meta]) => ({ id, ...meta }));
  }

  async cancelByType(type: string): Promise<void> {
    const ids = this.typeToIds.get(type);
    if (!ids || ids.size === 0) return;

    const idsToCancel = Array.from(ids);
    this.typeToIds.delete(type);

    for (const id of idsToCancel) {
      await this.cancel(id);
    }
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
    const ledger = this.state.dailyLedgers[today] || { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [], tapped: [] };

    // Quiet hours check: CORE bypasses, STANDARD/AMBIENT respects
    if (req.tier !== 'core') {
      const prefs = store.getState().calendar.notificationPreferences;
      const qh = prefs.quietHours;
      if (qh?.enabled) {
        const hour = req.scheduleAt.getHours();
        const inQuietHours = qh.start > qh.end
          ? (hour >= qh.start || hour < qh.end)
          : (hour >= qh.start && hour < qh.end);
        if (inQuietHours) {
          return false;
        }
      }
    }

    // Deduplication: same dedupKey (or type) within 4h?
    const dedupKey = req.dedupKey || req.type;
    const recentSameType = ledger.delivered.filter(d =>
      (d.extra?._dedupKey || d.type) === dedupKey && (Date.now() - d.deliveredAt) < DEDUPLICATION_WINDOW_MS
    );
    if (recentSameType.length > 0) {
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
          return false;
        }
      }
    }

    // Tier cap check
    const cap = TIER_DAILY_CAPS[req.tier];
    if (cap !== Infinity && ledger.counts[req.tier] >= cap) {
      // CORE can preempt — but req is not CORE if we're here
      return false;
    }

    return true;
  }

  /**
   * Record that a notification was sent/scheduled.
   * Adds to history and increments tier caps so both direct-schedule
   * and genius-schedule paths count against daily limits.
   * Emits event for real-time UI updates.
   */
  private recordSent(req: NotificationRequest, id: string): void {
    // Use the notification's scheduled day for caps, not the current day.
    // A notification scheduled for tomorrow should count against tomorrow's cap.
    const dayKey = req.scheduleAt.toISOString().split('T')[0];
    if (!this.state.dailyLedgers[dayKey]) {
      this.state.dailyLedgers[dayKey] = { date: dayKey, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [], tapped: [] };
    }
    const ledger = this.state.dailyLedgers[dayKey];

    // Dedup: don't record the same ID twice
    if (ledger.delivered.some(d => d.id === id)) {
      return;
    }

    // Increment tier cap counts at schedule time so caps are enforced uniformly
    ledger.counts[req.tier]++;

    ledger.delivered.push({
      id,
      type: req.type,
      tier: req.tier,
      section: req.section,
      title: req.title,
      body: req.body,
      deliveredAt: Date.now(),
      extra: { ...req.extra, _dedupKey: req.dedupKey || req.type },
    });
    saveEngineState(this.state);

    // Notify UI in real time
    eventBus.emit('heka-notification-sent', { type: req.type, title: req.title });
  }

  /**
   * Confirm that a scheduled notification was actually delivered by the OS.
   * Called from the localNotificationReceived listener when the alarm fires.
   * This is the ONLY reliable way to know a notification was shown.
   */
  confirmDelivery(id: string): void {
    const today = getTodayKey();
    const ledger = this.state.dailyLedgers[today];
    if (!ledger) return;

    const record = ledger.delivered.find(d => d.id === id);
    if (record) {
      record.confirmedDeliveredAt = Date.now();
      saveEngineState(this.state);
      eventBus.emit('heka-notification-delivered', { id, type: record.type });
      console.log(`[NotificationEngine] Confirmed delivery: ${record.type} (${id})`);
    }
  }

  /**
   * Record that a notification was actually interacted with (tapped).
   * Call this from the tap handler, NOT at schedule time.
   * Updates engagement scores. Tier caps are already incremented by recordSent().
   */
  recordDelivery(req: NotificationRequest, id: string): void {
    const today = getTodayKey();
    if (!this.state.dailyLedgers[today]) {
      this.state.dailyLedgers[today] = { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [], tapped: [] };
    }
    const ledger = this.state.dailyLedgers[today];

    // Ensure backward compatibility: old ledgers may not have tapped array
    if (!ledger.tapped) {
      ledger.tapped = [];
    }

    // Dedup: don't record the same tap twice
    if (ledger.tapped.some(d => d.id === id)) {
      return;
    }

    ledger.tapped.push({
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

    // Update engagement: this type was tapped = positive signal
    this.updateEngagement(req.type, 1);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GENIUS SCHEDULER — Intelligent Orchestration Layer
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Fetch astronomical context for the user's current location and time.
   * Results are cached for 5 minutes to avoid repeated heavy calculations.
   */
  private async getAstronomicalContext(): Promise<AstronomicalContext> {
    const now = Date.now();
    if (this.astroCache.context && this.astroCache.expiresAt > now) {
      return this.astroCache.context;
    }

    const state = store.getState().calendar;
    const country = state.location || 'AU';
    const subRegion = state.subRegion;
    let lat = 0;
    let lon = 0;
    if (subRegion && SUB_REGIONS[country]) {
      const sr = SUB_REGIONS[country].find(r => r.code === subRegion);
      if (sr) { lat = sr.latitude; lon = sr.longitude; }
    }
    if (lat === 0 && lon === 0 && LOCATIONS[country]) {
      lat = LOCATIONS[country].latitude;
      lon = LOCATIONS[country].longitude;
    }
    const date = new Date();

    let sunrise: Date | null = null;
    let sunset: Date | null = null;
    let dayLengthMinutes = 0;
    let planetaryHour: string | null = null;
    let planetaryHourSymbol: string | null = null;
    let moonPhase: string | null = null;
    let moonSign: string | null = null;
    let moonIllumination: string | null = null;
    let moonPhaseNum: number | null = null;

    try {
      const sunTimes = await calculateSunTimes(date, lat, lon);
      sunrise = sunTimes.sunrise;
      sunset = sunTimes.sunset;
      dayLengthMinutes = sunTimes.dayLength;
    } catch {
      // Fallback: assume 6 AM sunrise, 6 PM sunset
      sunrise = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0);
      sunset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0);
      dayLengthMinutes = 720;
    }

    try {
      const ph = await getCurrentPlanetaryHour(date, lat, lon);
      if (ph) {
        planetaryHour = ph.planet;
        planetaryHourSymbol = ph.symbol;
      }
    } catch {
      // Fallback
    }

    try {
      const sky = await calculateCurrentSky(date);
      const moon = sky.positions?.moon;
      const sun = sky.positions?.sun;
      if (moon) {
        const use13Signs = state.astroPreferences?.signCount === 13;
        moonSign = String(getSignFromLongitude(moon.longitude, use13Signs));
        if (sun) {
          const angle = ((moon.longitude - sun.longitude) % 360 + 360) % 360;
          const illumination = (1 - Math.cos(angle * Math.PI / 180)) / 2;
          moonIllumination = Math.round(illumination * 100) + '%';
          const phaseNum = angle / 360;
          moonPhaseNum = phaseNum;
          if (phaseNum < 0.03 || phaseNum > 0.97) moonPhase = 'New Moon';
          else if (phaseNum < 0.22) moonPhase = 'Waxing Crescent';
          else if (phaseNum < 0.28) moonPhase = 'First Quarter';
          else if (phaseNum < 0.47) moonPhase = 'Waxing Gibbous';
          else if (phaseNum < 0.53) moonPhase = 'Full Moon';
          else if (phaseNum < 0.72) moonPhase = 'Waning Gibbous';
          else if (phaseNum < 0.78) moonPhase = 'Last Quarter';
          else moonPhase = 'Waning Crescent';
        }
      }
    } catch {
      // Fallback
    }

    // Determine day segment
    const hour = date.getHours();
    let daySegment: AstronomicalContext['daySegment'] = 'midday';
    if (sunrise && sunset) {
      const sr = sunrise.getHours() + sunrise.getMinutes() / 60;
      const ss = sunset.getHours() + sunset.getMinutes() / 60;
      if (hour < sr - 1) daySegment = 'night';
      else if (hour < sr + 2) daySegment = 'dawn';
      else if (hour < 11) daySegment = 'morning';
      else if (hour < ss - 2) daySegment = 'midday';
      else if (hour < ss + 2) daySegment = 'evening';
      else daySegment = 'night';
    } else {
      if (hour < 5) daySegment = 'night';
      else if (hour < 8) daySegment = 'dawn';
      else if (hour < 11) daySegment = 'morning';
      else if (hour < 17) daySegment = 'midday';
      else if (hour < 21) daySegment = 'evening';
      else daySegment = 'night';
    }

    const ms = date.getTime();
    const minutesUntilSunrise = sunrise ? Math.round((sunrise.getTime() - ms) / 60000) : null;
    const minutesUntilSunset = sunset ? Math.round((sunset.getTime() - ms) / 60000) : null;
    const minutesSinceSunrise = sunrise && ms >= sunrise.getTime() ? Math.round((ms - sunrise.getTime()) / 60000) : null;
    const minutesSinceSunset = sunset && ms >= sunset.getTime() ? Math.round((ms - sunset.getTime()) / 60000) : null;

    const context: AstronomicalContext = {
      sunrise, sunset, dayLengthMinutes,
      planetaryHour, planetaryHourSymbol,
      moonPhase, moonSign, moonIllumination, moonPhaseNum,
      daySegment,
      minutesUntilSunrise: minutesUntilSunrise !== null && minutesUntilSunrise > 0 ? minutesUntilSunrise : null,
      minutesUntilSunset: minutesUntilSunset !== null && minutesUntilSunset > 0 ? minutesUntilSunset : null,
      minutesSinceSunrise: minutesSinceSunrise !== null && minutesSinceSunrise >= 0 ? minutesSinceSunrise : null,
      minutesSinceSunset: minutesSinceSunset !== null && minutesSinceSunset >= 0 ? minutesSinceSunset : null,
    };

    this.astroCache = { context, expiresAt: now + 5 * 60 * 1000 };
    return context;
  }

  /**
   * Inject astronomical context into template variables so every notification
   * can reference sunrise, sunset, planetary hour, and moon data.
   */
  private injectAstronomicalContext(vars: Record<string, string>, ctx: AstronomicalContext): Record<string, string> {
    const injected: Record<string, string> = { ...vars };

    if (ctx.minutesUntilSunrise !== null) {
      injected.sunriseIn = ctx.minutesUntilSunrise < 60
        ? `${ctx.minutesUntilSunrise} minute${ctx.minutesUntilSunrise !== 1 ? 's' : ''}`
        : `${Math.floor(ctx.minutesUntilSunrise / 60)}h ${ctx.minutesUntilSunrise % 60}m`;
    }
    if (ctx.minutesUntilSunset !== null) {
      injected.sunsetIn = ctx.minutesUntilSunset < 60
        ? `${ctx.minutesUntilSunset} minute${ctx.minutesUntilSunset !== 1 ? 's' : ''}`
        : `${Math.floor(ctx.minutesUntilSunset / 60)}h ${ctx.minutesUntilSunset % 60}m`;
    }
    if (ctx.minutesSinceSunrise !== null) {
      injected.sinceSunrise = ctx.minutesSinceSunrise < 60
        ? `${ctx.minutesSinceSunrise} minute${ctx.minutesSinceSunrise !== 1 ? 's' : ''}`
        : `${Math.floor(ctx.minutesSinceSunrise / 60)}h ${ctx.minutesSinceSunrise % 60}m`;
    }
    if (ctx.minutesSinceSunset !== null) {
      injected.sinceSunset = ctx.minutesSinceSunset < 60
        ? `${ctx.minutesSinceSunset} minute${ctx.minutesSinceSunset !== 1 ? 's' : ''}`
        : `${Math.floor(ctx.minutesSinceSunset / 60)}h ${ctx.minutesSinceSunset % 60}m`;
    }
    if (ctx.planetaryHour) {
      injected.planetaryHour = ctx.planetaryHour.charAt(0).toUpperCase() + ctx.planetaryHour.slice(1);
      injected.planetaryHourSymbol = ctx.planetaryHourSymbol || '';
    }
    if (ctx.moonPhase) injected.moonPhase = ctx.moonPhase;
    if (ctx.moonSign) injected.moonSign = ctx.moonSign.charAt(0).toUpperCase() + ctx.moonSign.slice(1);
    if (ctx.moonIllumination) injected.moonIllumination = ctx.moonIllumination;
    injected.daySegment = ctx.daySegment;

    return injected;
  }

  /**
   * Score a notification proposal on a 0-1000 scale based on:
   * - Astronomical significance (new moon, full moon, solstice, etc.)
   * - User engagement history (types they tap get boosted)
   * - Timeliness (how well does this fit the current time of day)
   * - Urgency (streak protection, task due soon)
   * - Contextual fit (day segment alignment)
   */
  private scoreNotification(type: string, tier: NotificationTier, ctx: AstronomicalContext): number {
    let score = 500; // Baseline

    // 1. Astronomical significance (+0 to +300)
    const astroSignificant = [
      'new-moon-reminder', 'full-moon-reminder',
      'solstice-equinox-reminder', 'new-year-reminder',
      'void-moon-entered', 'retrograde-alert',
    ];
    if (astroSignificant.includes(type)) score += 200;
    if (type === 'month-start-reminder' && ctx.moonPhase === 'New Moon') score += 150; // Double event

    // 2. User engagement history (-200 to +200)
    const engagement = this.state.typeEngagement[type] || 50;
    score += (engagement - 50) * 4;

    // 3. Timeliness / contextual fit (+0 to +150)
    const morningTypes = ['daily-briefing', 'daily-celestial-tips', 'new-moon-reminder', 'month-start-reminder'];
    const eveningTypes = ['evening-reflection', 'full-moon-reminder'];
    const middayTypes = ['celestial-insight-alert', 'task-due-soon'];

    if (morningTypes.includes(type) && (ctx.daySegment === 'dawn' || ctx.daySegment === 'morning')) score += 100;
    else if (morningTypes.includes(type) && ctx.daySegment === 'midday') score += 40;
    else if (morningTypes.includes(type) && (ctx.daySegment === 'evening' || ctx.daySegment === 'night')) score -= 80;

    if (eveningTypes.includes(type) && (ctx.daySegment === 'evening' || ctx.daySegment === 'night')) score += 100;
    else if (eveningTypes.includes(type) && ctx.daySegment === 'midday') score += 40;
    else if (eveningTypes.includes(type) && (ctx.daySegment === 'dawn' || ctx.daySegment === 'morning')) score -= 80;

    if (middayTypes.includes(type) && ctx.daySegment === 'midday') score += 80;

    // 4. Urgency boost (+0 to +200)
    if (type === 'streak-protection' || type === 'streak-saver') score += 180;
    if (type === 'task-due-soon') score += 120;
    if (type === 'void-moon-entered') score += 100;

    // 5. Tier boost (CORE gets priority)
    if (tier === 'core') score += 150;
    else if (tier === 'standard') score += 50;

    return Math.max(0, Math.min(1000, score));
  }

  /**
   * Update engagement score for a notification type.
   * Positive delta = user tapped (boost). Negative = user dismissed without action (penalty).
   */
  updateEngagement(type: string, delta: number): void {
    const current = this.state.typeEngagement[type] || 50;
    const adjusted = current * ENGAGEMENT_DECAY + delta * 10 + 50 * (1 - ENGAGEMENT_DECAY);
    this.state.typeEngagement[type] = Math.max(0, Math.min(100, adjusted));
    saveEngineState(this.state);
  }

  /**
   * Schedule a notification through the Genius Scheduler.
   * Instead of immediate delivery, proposals are buffered, scored, and processed
   * intelligently to avoid notification fatigue and maximize relevance.
   */
  async scheduleGenius(
    type: string,
    tier: NotificationTier,
    section: NotificationSection,
    scheduleAt: Date,
    seed: string,
    vars: Record<string, string>,
    extra?: Record<string, any>,
    id?: number,
    dedupKey?: string
  ): Promise<void> {
    // Section prefs already checked by caller, but double-check
    if (!this.isSectionEnabled(section, type)) return;

    const ctx = await this.getAstronomicalContext();
    const score = this.scoreNotification(type, tier, ctx);
    const enrichedVars = this.injectAstronomicalContext(vars, ctx);

    this.geniusQueue.push({
      type, tier, section, scheduleAt, seed,
      vars: enrichedVars, extra, id, dedupKey, score, context: ctx,
    });
    this.persistGeniusQueue();

    // Debounce flush
    if (this.geniusTimer) clearTimeout(this.geniusTimer);
    this.geniusTimer = setTimeout(() => {
      void this.flushGeniusQueue();
    }, GENIUS_FLUSH_DELAY_MS);
  }

  /**
   * Process all buffered proposals intelligently:
   * 1. Sort by score descending
   * 2. Detect combinable pairs (same day, complementary types)
   * 3. Respect spacing rules (min time between same-tier deliveries)
   * 4. Respect tier caps
   * 5. Deliver the winners, drop the rest
   */
  private async flushGeniusQueue(): Promise<void> {
    if (this.geniusQueue.length === 0) return;

    const proposals = [...this.geniusQueue];
    this.geniusQueue = [];
    this.clearPersistedGeniusQueue();

    // Sort by score descending
    proposals.sort((a, b) => b.score - a.score);

    const today = getTodayKey();
    const ledger = this.state.dailyLedgers[today] || { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [] };
    const deliveredTypes: string[] = [];
    const deliveredTimes: number[] = [];

    for (const p of proposals) {
      const pDedupKey = p.dedupKey || p.type;

      // Skip if same dedupKey already delivered today via sentTodayFlags
      const flagKey = pDedupKey;
      if (this.state.sentTodayFlags[flagKey] === today) continue;

      // Skip if dedupKey already won in this flush
      if (deliveredTypes.includes(pDedupKey)) continue;

      // Tier cap check
      const cap = TIER_DAILY_CAPS[p.tier];
      if (cap !== Infinity && ledger.counts[p.tier] >= cap) continue;

      // Cross-silo dedup: daily briefing and daily tips are mutually exclusive
      if (p.tier === 'standard') {
        const morningTypes = ['daily-briefing', 'daily-celestial-tips'];
        if (morningTypes.includes(p.type)) {
          const hadMorning = deliveredTypes.some(dt => morningTypes.includes(dt));
          if (hadMorning) continue;
        }
      }

      // Spacing check
      const minSpacing = p.tier === 'standard' ? MIN_SPACING_STANDARD_MS : p.tier === 'ambient' ? MIN_SPACING_AMBIENT_MS : 0;
      if (minSpacing > 0) {
        const tooClose = deliveredTimes.some(t => Math.abs(p.scheduleAt.getTime() - t) < minSpacing);
        if (tooClose) {
          // Try to nudge schedule time forward by spacing amount
          const lastTime = Math.max(...deliveredTimes.filter(t => t <= p.scheduleAt.getTime()), 0);
          if (lastTime > 0) {
            p.scheduleAt = new Date(lastTime + minSpacing);
          } else {
            continue;
          }
        }
      }

      // Check for combinable pair — merge instead of dropping
      const combinable = this.findCombinable(p, proposals.filter(op => deliveredTypes.includes(op.dedupKey || op.type)));
      if (combinable) {
        // Merge the lower-scored proposal's vars into the higher-scored one
        // by updating the already-scheduled notification's extra data.
        // This preserves both pieces of information instead of silently dropping one.
        const mergedVars = { ...combinable.vars, ...p.vars, _combinedWith: p.type };
        const mergedExtra = { ...combinable.extra, ...p.extra, _combinedWith: p.type };
        // Re-schedule the merged version (replaceExisting will update the native alarm)
        const { title, body, templateIndex } = generateNotificationContent(combinable.type, combinable.seed, mergedVars);
        const mergedReq: NotificationRequest = {
          type: combinable.type,
          tier: combinable.tier,
          section: combinable.section,
          title,
          body,
          scheduleAt: combinable.scheduleAt,
          id: combinable.id || generateId(combinable.section, combinable.type),
          extra: { ...mergedExtra, templateIndex, _geniusScore: combinable.score, _merged: true },
          replaceExisting: true,
        };
        const mergedResult = await this.schedule(mergedReq);
        if (mergedResult) {
          // Mark the merged type as handled so we don't also schedule it standalone
          this.state.sentTodayFlags[pDedupKey] = today;
          this.state.lastDeliveryTime[pDedupKey] = Date.now();
        }
        continue;
      }

      // Build and deliver
      const { title, body, templateIndex } = generateNotificationContent(p.type, p.seed, p.vars);
      const req: NotificationRequest = {
        type: p.type,
        tier: p.tier,
        section: p.section,
        title,
        body,
        scheduleAt: p.scheduleAt,
        id: p.id || generateId(p.section, p.type),
        extra: { ...p.extra, templateIndex, _geniusScore: p.score },
        replaceExisting: true,
        dedupKey: p.dedupKey,
      };

      const result = await this.schedule(req);
      if (result) {
        deliveredTypes.push(pDedupKey);
        deliveredTimes.push(p.scheduleAt.getTime());
        // counts are already incremented inside schedule -> recordSent
        this.state.sentTodayFlags[pDedupKey] = today;
        this.state.lastDeliveryTime[pDedupKey] = Date.now();
      }
    }

    saveEngineState(this.state);
  }

  /**
   * Find if a proposal is combinable with an already-delivered notification.
   * Examples: New Moon + Month Start, Holiday + Solstice, Full Moon + Evening Reflection
   */
  private findCombinable(proposal: GeniusProposal, alreadyDelivered: GeniusProposal[]): GeniusProposal | null {
    const combineMap: Record<string, string[]> = {
      'new-moon-reminder': ['month-start-reminder'],
      'month-start-reminder': ['new-moon-reminder'],
      'full-moon-reminder': ['evening-reflection'],
      'evening-reflection': ['full-moon-reminder'],
      'solstice-equinox-reminder': ['holiday-reminder'],
      'holiday-reminder': ['solstice-equinox-reminder'],
    };

    const partners = combineMap[proposal.type];
    if (!partners) return null;

    for (const delivered of alreadyDelivered) {
      if (partners.includes(delivered.type)) {
        // Only combine if they would fire within 2 hours of each other
        const diffMs = Math.abs(proposal.scheduleAt.getTime() - delivered.scheduleAt.getTime());
        if (diffMs < 2 * 60 * 60 * 1000) {
          return delivered;
        }
      }
    }
    return null;
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
        if (type === 'note-reminder') return prefs.calendar.noteReminders;
        if (type === 'new-year-reminder') return prefs.calendar.newYearReminders;
        if (type === 'solstice-equinox-reminder') return prefs.calendar.solsticeEquinoxReminders;
        if (type === 'month-start-reminder') return prefs.calendar.monthStartReminders;
        return true;
      case 'stars':
        if (type === 'daily-celestial-tips') return prefs.stars.dailyCelestialTips;
        if (type === 'retrograde-alert') return prefs.stars.retrogradeAlerts;
        if (type.startsWith('void-moon')) return prefs.stars.voidMoonReminders;
        if (type === 'moon-degree-update') return prefs.stars.moonDegreeNotifications;
        if (type === 'new-moon-reminder') return prefs.stars.newMoonReminders;
        if (type === 'full-moon-reminder') return prefs.stars.fullMoonReminders;
        if (type === 'sunrise-wake-up') return prefs.stars.sunriseWakeUp;
        return true;
      case 'circle':
        if (type === 'friend-request') return prefs.circle.friendRequests;
        if (type === 'task-assigned') return prefs.circle.taskRequests;
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
    this.state.lastReconcileAt = Date.now();
    saveEngineState(this.state);

    // Run time-agnostic background checks
    await this.checkVoidMoon();
    await this.checkMoonDegree();

    // Confirm background deliveries: notifications that fired while the app
    // was backgrounded or killed are in the OS notification shade but never
    // triggered the localNotificationReceived JS event. Cross-reference.
    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      try {
        const { notifications } = await LocalNotifications.getDeliveredNotifications();
        if (notifications && notifications.length > 0) {
          const deliveredIds = new Set(notifications.map(n => String(n.id)));
          const today = getTodayKey();
          const ledger = this.state.dailyLedgers[today];
          if (ledger) {
            for (const record of ledger.delivered) {
              if (!record.confirmedDeliveredAt && deliveredIds.has(record.id)) {
                record.confirmedDeliveredAt = Date.now();
                eventBus.emit('heka-notification-delivered', { id: record.id, type: record.type });
              }
            }
            saveEngineState(this.state);
          }
        }
      } catch (e) {
        console.warn('[NotificationEngine] getDeliveredNotifications failed:', e);
      }
    }

    // Catch-up: if we missed hourly checkers while backgrounded, run them now.
    // Each checker gates on its designated hour + sentTodayFlags, so running
    // them outside their hour is safe — they'll just no-op.
    const now = new Date();
    const lastReconcile = this.state.lastReconcileAt || 0;
    const hoursSinceLastReconcile = (now.getTime() - lastReconcile) / (60 * 60 * 1000);

    // Only run catch-up if we've been away for at least 1 hour (avoid duplicating
    // checkers that just ran before backgrounding)
    if (hoursSinceLastReconcile >= 1) {
      this.runChecker(() => this.checkNewYearReminders());
      this.runChecker(() => this.checkSolsticeEquinoxReminders());
      this.runChecker(() => this.checkMonthStartReminders());
      this.runChecker(() => this.checkNewMoonReminders());
      this.runChecker(() => this.checkHekaTransitions());
      this.runChecker(() => this.checkTrackerReminders());
      this.runChecker(() => this.checkTaskDueReminders());
      this.runChecker(() => this.checkCelestialInsights());
      this.runChecker(() => this.checkHolidayReminders());
      this.runChecker(() => this.checkFullMoonReminders());
      this.runChecker(() => this.checkEveningReflection());
    }
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

    const result = await this.scheduleTemplated(
      'civil-heka-transition',
      'ambient',
      'calendar',
      new Date(Date.now() + 5000),
      seed,
      vars,
      { context }
    );
    if (result) {
      this.state.sentTodayFlags[flagKey] = today;
      saveEngineState(this.state);
    }
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
        mood: 'Daily Reflection',
        sleep: 'Rest Log',
        energy: 'Vitality Check',
        custom: 'Personal Tracker',
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
          const result = await this.scheduleTemplated(
            'tracker-reminder',
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
            this.state.sentTodayFlags[flagKey] = todayStr;
          }
          continue;
        }

        const daysSince = Math.floor((now.getTime() - new Date(recent.date).getTime()) / 86400000);
        const threshold = trackerType === 'sleep' ? 3 : trackerType === 'mood' ? 2 : trackerType === 'energy' ? 2 : 1;

        if (daysSince >= threshold) {
          const result = await this.scheduleTemplated(
            'tracker-reminder',
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
            this.state.sentTodayFlags[flagKey] = todayStr;
          }
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
    let anyScheduled = false;
    for (let i = 0; i < holidays.length; i++) {
      const holiday = holidays[i];
      const seed = `holiday-${holiday.name}-${today}`;
      const holidayDedupKey = `holiday-reminder-${holiday.name}`;
      const result = await this.scheduleTemplated(
        'holiday-reminder',
        'ambient',
        'calendar',
        new Date(now.getTime() + 30000 + i * 5000),
        seed,
        { holidayName: holiday.name },
        { holidayName: holiday.name },
        undefined,
        holidayDedupKey
      );
      if (result) anyScheduled = true;
    }

    if (anyScheduled) {
      this.state.sentTodayFlags[flagKey] = today;
      saveEngineState(this.state);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK DUE REMINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  async checkTaskDueReminders(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences;
    // Check both circle (shared tasks) and planner (personal tasks) preferences
    const circleEnabled = prefs.circle?.taskDueReminders;
    const plannerEnabled = prefs.planner?.taskReminders;
    if (!circleEnabled && !plannerEnabled) return;

    const now = new Date();
    const hour = now.getHours();
    const today = getTodayKey();

    // Only run at 11 AM (called from startRecurringChecks at hour === 11)
    if (hour !== 11) return;

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
              if (this.state.sentTodayFlags[flagKey] === today) continue;

              const timeStr = hoursUntil <= 1 ? 'in less than an hour'
                : hoursUntil <= 4 ? 'in a few hours'
                : `in ${Math.ceil(hoursUntil)} hours`;

              const result = await this.scheduleTemplated(
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
                this.state.sentTodayFlags[flagKey] = today;
              }
            }
          }
        }
        saveEngineState(this.state);
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
            if (this.state.sentTodayFlags[flagKey] === today) continue;

            const timeStr = hoursUntil <= 1 ? 'in less than an hour'
              : hoursUntil <= 4 ? 'in a few hours'
              : `in ${Math.ceil(hoursUntil)} hours`;

            const result = await this.scheduleTemplated(
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
              this.state.sentTodayFlags[flagKey] = today;
            }
          }
        }

        saveEngineState(this.state);
      } catch (e) {
        console.error('[NotificationEngine] Circle task due check failed:', e);
      }
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

              const result = await this.scheduleTemplated(
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
                this.state.sentTodayFlags[flagKey] = today;
                saveEngineState(this.state);
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

    // Fire during the 8 PM hour (called from startRecurringChecks at hour === 20)
    if (hour !== 20) return;

    const flagKey = 'evening-reflection';
    if (this.state.sentTodayFlags[flagKey] === today) return;

    const seed = `reflection-${today}`;
    const result = await this.scheduleTemplated(
      'daily-reflection-prompt',
      'standard',
      'journal',
      new Date(now.getTime() + 60000), // 1 min from now
      seed,
      {},
      { context: 'evening' }
    );
    if (result) {
      this.state.sentTodayFlags[flagKey] = today;
      saveEngineState(this.state);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW YEAR REMINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  async checkNewYearReminders(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.calendar;
    if (!prefs.newYearReminders) return;

    const now = new Date();
    const hour = now.getHours();
    const today = getTodayKey();

    if (hour !== 7) return;

    const flagKey = 'new-year-reminder';
    if (this.state.sentTodayFlags[flagKey] === today) return;

    const month = now.getMonth();
    const date = now.getDate();
    const isNewYear = month === 0 && date === 1;
    if (!isNewYear) return;

    const year = now.getFullYear();
    const seed = `new-year-${year}`;
    const result = await this.scheduleTemplated(
      'new-year-reminder',
      'standard',
      'calendar',
      new Date(now.getTime() + 30000),
      seed,
      { year: String(year) },
      { year }
    );
    if (result) {
      this.state.sentTodayFlags[flagKey] = today;
      saveEngineState(this.state);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SOLSTICE / EQUINOX REMINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  async checkSolsticeEquinoxReminders(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.calendar;
    if (!prefs.solsticeEquinoxReminders) return;

    const now = new Date();
    const hour = now.getHours();
    const today = getTodayKey();

    if (hour !== 7) return;

    const flagKey = 'solstice-equinox-reminder';
    if (this.state.sentTodayFlags[flagKey] === today) return;

    const event = getSolsticeEquinoxName(now);
    if (!event) return;

    const seed = `solstice-${event.name}-${now.getFullYear()}`;
    const result = await this.scheduleTemplated(
      'solstice-equinox-reminder',
      'standard',
      'calendar',
      new Date(now.getTime() + 30000),
      seed,
      { event: event.name, eventDescription: event.description },
      { eventName: event.name }
    );
    if (result) {
      this.state.sentTodayFlags[flagKey] = today;
      saveEngineState(this.state);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MONTH START REMINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  async checkMonthStartReminders(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.calendar;
    if (!prefs.monthStartReminders) return;

    const now = new Date();
    const hour = now.getHours();
    const today = getTodayKey();

    if (hour !== 7) return;

    const flagKey = 'month-start-reminder';
    if (this.state.sentTodayFlags[flagKey] === today) return;

    const hekaDate = civilToHeka(now);
    if (!hekaDate || hekaDate.day !== 1) return;

    const monthName = HEKA_MONTHS[hekaDate.month - 1]?.name || `Month ${hekaDate.month}`;
    const arcNames = ['Creation', 'Formation', 'Expression', 'Stabilization', 'Integration', 'Transcendence'];
    const arcIndex = Math.floor((hekaDate.month - 1) / 2) % arcNames.length;
    const arcName = arcNames[arcIndex];

    const seed = `month-start-${hekaDate.year}-${hekaDate.month}`;
    const result = await this.scheduleTemplated(
      'month-start-reminder',
      'ambient',
      'calendar',
      new Date(now.getTime() + 30000),
      seed,
      { month: monthName, arc: arcName },
      { hekaMonth: hekaDate.month, hekaYear: hekaDate.year }
    );
    if (result) {
      this.state.sentTodayFlags[flagKey] = today;
      saveEngineState(this.state);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW MOON REMINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  async checkNewMoonReminders(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.stars;
    if (!prefs.newMoonReminders) return;

    const now = new Date();
    const hour = now.getHours();
    const today = getTodayKey();

    if (hour !== 7) return;

    const flagKey = 'new-moon-reminder';
    if (this.state.sentTodayFlags[flagKey] === today) return;

    // Use precise Swiss Ephemeris phase from the astronomical context cache
    // instead of the approximate 0.5-day-tolerance calculator.
    const ctx = await this.getAstronomicalContext();
    const phaseNum = ctx.moonPhaseNum;
    const isNew = phaseNum !== null && (phaseNum < 0.03 || phaseNum > 0.97);
    if (!isNew) return;

    const seed = `new-moon-${today}`;
    const result = await this.scheduleTemplated(
      'new-moon-reminder',
      'standard',
      'stars',
      new Date(now.getTime() + 30000),
      seed,
      {},
      { phase: ctx.moonPhase || 'New Moon' }
    );
    if (result) {
      this.state.sentTodayFlags[flagKey] = today;
      saveEngineState(this.state);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FULL MOON REMINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  async checkFullMoonReminders(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.stars;
    if (!prefs.fullMoonReminders) return;

    const now = new Date();
    const hour = now.getHours();
    const today = getTodayKey();

    if (hour !== 20) return;

    const flagKey = 'full-moon-reminder';
    if (this.state.sentTodayFlags[flagKey] === today) return;

    // Use precise Swiss Ephemeris phase from the astronomical context cache
    const ctx = await this.getAstronomicalContext();
    const phaseNum = ctx.moonPhaseNum;
    const isFull = phaseNum !== null && (phaseNum > 0.47 && phaseNum < 0.53);
    if (!isFull) return;

    const seed = `full-moon-${today}`;
    const result = await this.scheduleTemplated(
      'full-moon-reminder',
      'standard',
      'stars',
      new Date(now.getTime() + 30000),
      seed,
      {},
      { phase: ctx.moonPhase || 'Full Moon' }
    );
    if (result) {
      this.state.sentTodayFlags[flagKey] = today;
      saveEngineState(this.state);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SUNRISE WAKE-UP
  // ═══════════════════════════════════════════════════════════════════════════

  async scheduleSunriseWakeUp(): Promise<void> {
    const prefs = store.getState().calendar.notificationPreferences.stars;
    if (!prefs.sunriseWakeUp) return;

    const today = getTodayKey();
    const flagKey = 'sunrise-wake-up';
    if (this.state.sentTodayFlags[flagKey] === today) return;

    const ctx = await this.getAstronomicalContext();
    if (!ctx.sunrise) return;

    const now = new Date();
    const sunriseTime = ctx.sunrise;

    // If sunrise has already passed today, schedule for tomorrow
    if (sunriseTime <= now) {
      sunriseTime.setDate(sunriseTime.getDate() + 1);
    }

    const sunriseTimeStr = sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const seed = `sunrise-${today}`;

    const result = await this.scheduleTemplated(
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
      this.state.sentTodayFlags[flagKey] = today;
      saveEngineState(this.state);
    }
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

  /**
   * Flush any pending genius queue proposals immediately.
   * Call this on app resume to ensure notifications weren't lost while backgrounded.
   */
  flushGeniusQueueOnResume(): void {
    if (this.geniusQueue.length > 0) {
      console.log(`[NotificationEngine] Flushing ${this.geniusQueue.length} pending genius proposals on resume`);
      if (this.geniusTimer) {
        clearTimeout(this.geniusTimer);
        this.geniusTimer = null;
      }
      void this.flushGeniusQueue();
    }
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
    id?: number,
    dedupKey?: string
  ): Promise<string | null> {
    // When called from within a time-gated checker, route through the Genius Scheduler
    // for intelligent scoring, spacing, and astronomical context injection.
    if (this.checkerDepth > 0) {
      await this.scheduleGenius(type, tier, section, scheduleAt, seed, vars, extra, id, dedupKey);
      return null; // Actual ID assigned by flushGeniusQueue
    }

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
      dedupKey,
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

  // ═══════════════════════════════════════════════════════════════════════════
  // GENIUS QUEUE PERSISTENCE
  // ═══════════════════════════════════════════════════════════════════════════

  private persistGeniusQueue(): void {
    try {
      const serializable = this.geniusQueue.map(p => ({
        ...p,
        scheduleAt: p.scheduleAt.toISOString(),
        context: {
          ...p.context,
          sunrise: p.context.sunrise ? p.context.sunrise.toISOString() : null,
          sunset: p.context.sunset ? p.context.sunset.toISOString() : null,
        },
      }));
      localStorage.setItem(GENIUS_QUEUE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.error('[NotificationEngine] Failed to persist genius queue:', e);
    }
  }

  private restoreGeniusQueue(): void {
    try {
      const raw = localStorage.getItem(GENIUS_QUEUE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Array<{
        type: string; tier: NotificationTier; section: NotificationSection;
        scheduleAt: string; seed: string; vars: Record<string, string>;
        extra?: Record<string, any>; id?: number; score: number;
        context: { sunrise: string | null; sunset: string | null; moonPhase: string; moonSign: string; daySegment: string; voidOfCourse: boolean; mercuryRetrograde: boolean };
      }>;
      if (parsed.length > 0) {
        this.geniusQueue = parsed.map(p => ({
          ...p,
          scheduleAt: new Date(p.scheduleAt),
          context: {
            ...p.context,
            sunrise: p.context.sunrise ? new Date(p.context.sunrise) : null,
            sunset: p.context.sunset ? new Date(p.context.sunset) : null,
          } as unknown as AstronomicalContext,
        }));
        // Flush immediately so restored proposals don't sit idle
        void this.flushGeniusQueue();
      }
    } catch (e) {
      console.error('[NotificationEngine] Failed to restore genius queue:', e);
      localStorage.removeItem(GENIUS_QUEUE_KEY);
    }
  }

  private clearPersistedGeniusQueue(): void {
    try {
      localStorage.removeItem(GENIUS_QUEUE_KEY);
    } catch (e) {
      console.error('[NotificationEngine] Failed to clear genius queue:', e);
    }
  }
}

// ── Singleton Export ─────────────────────────────────────────────────────────

export const NotificationEngine = new NotificationEngineClass();
