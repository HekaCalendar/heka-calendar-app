/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION GENIUS — Intelligent orchestration and astronomical context
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type {
  NotificationRequest,
  NotificationTier,
  NotificationSection,
  NotificationEngineState,
} from '../types/notifications';
import {
  TIER_DAILY_CAPS,
} from '../types/notifications';
import { store } from '../store';
import { generateNotificationContent } from './notificationTemplates';
import { bundleNotifications, separateBundleable } from './notificationBundling';
import { NotificationAnalytics } from './notificationAnalytics';
import { saveEngineState, getTodayKey, loadGeniusQueue, persistGeniusQueue, clearPersistedGeniusQueue } from './notificationState';
import { calculateSunTimes, getCurrentPlanetaryHour, calculateCurrentSky } from '../astrology/services/calculations/swissCalculations';
import { getSignFromLongitude } from '../astrology/types/core';
import { LOCATIONS, SUB_REGIONS } from '../types/holidays';
import { generateId } from './notificationDelivery';

// ── Constants ────────────────────────────────────────────────────────────────

const GENIUS_FLUSH_DELAY_MS = 500; // 500ms after last proposal — short enough to survive app kill, long enough to batch
const MIN_SPACING_STANDARD_MS = 45 * 60 * 1000; // 45 min between STANDARD
const MIN_SPACING_AMBIENT_MS = 30 * 60 * 1000;  // 30 min between AMBIENT
const ENGAGEMENT_DECAY = 0.9; // Decay old engagement scores by 10% per update

// ── Types ────────────────────────────────────────────────────────────────────

export interface GeniusProposal {
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

export interface AstronomicalContext {
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

// ── Genius Class ─────────────────────────────────────────────────────────────

export class NotificationGenius {
  private geniusQueue: GeniusProposal[] = [];
  private geniusTimer: ReturnType<typeof setTimeout> | null = null;
  private astroCache: { context: AstronomicalContext | null; expiresAt: number } = { context: null, expiresAt: 0 };

  constructor(
    private getState: () => NotificationEngineState,
    private schedule: (req: NotificationRequest) => Promise<string | null>,
    private isSectionEnabled: (section: NotificationSection, type: string) => boolean,
  ) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // ASTRONOMICAL CONTEXT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Fetch astronomical context for the user's current location and time.
   * Results are cached for 5 minutes to avoid repeated heavy calculations.
   */
  async getAstronomicalContext(): Promise<AstronomicalContext> {
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
  injectAstronomicalContext(vars: Record<string, string>, ctx: AstronomicalContext): Record<string, string> {
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

  // ═══════════════════════════════════════════════════════════════════════════
  // SCORING & ENGAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Score a notification proposal on a 0-1000 scale based on:
   * - Astronomical significance (new moon, full moon, solstice, etc.)
   * - User engagement history (types they tap get boosted)
   * - Timeliness (how well does this fit the current time of day)
   * - Urgency (streak protection, task due soon)
   * - Contextual fit (day segment alignment)
   */
  scoreNotification(type: string, tier: NotificationTier, ctx: AstronomicalContext): number {
    const state = this.getState();
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
    const engagement = state.typeEngagement[type] || 50;
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
    const state = this.getState();
    const current = state.typeEngagement[type] || 50;
    const adjusted = current * ENGAGEMENT_DECAY + delta * 10 + 50 * (1 - ENGAGEMENT_DECAY);
    state.typeEngagement[type] = Math.max(0, Math.min(100, adjusted));
    saveEngineState(state);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GENIUS SCHEDULER
  // ═══════════════════════════════════════════════════════════════════════════

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
   * 5. Bundle simultaneous notifications (>3 in 5min window)
   * 6. Deliver the winners, drop the rest
   */
  async flushGeniusQueue(): Promise<void> {
    if (this.geniusQueue.length === 0) return;

    const proposals = [...this.geniusQueue];
    this.geniusQueue = [];
    this.clearPersistedGeniusQueue();

    // Sort by score descending
    proposals.sort((a, b) => b.score - a.score);

    const today = getTodayKey();
    const state = this.getState();
    const ledger = state.dailyLedgers[today] || { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [] };
    const deliveredTypes: string[] = [];
    const deliveredTimes: number[] = [];
    const winningRequests: NotificationRequest[] = [];

    for (const p of proposals) {
      const pDedupKey = p.dedupKey || p.type;

      // Skip if same dedupKey already delivered today via sentTodayFlags
      const flagKey = pDedupKey;
      if (state.sentTodayFlags[flagKey] === today) continue;

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
        const mergedVars = { ...combinable.vars, ...p.vars, _combinedWith: p.type };
        const mergedExtra = { ...combinable.extra, ...p.extra, _combinedWith: p.type };
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
          state.sentTodayFlags[pDedupKey] = today;
          state.lastDeliveryTime[pDedupKey] = Date.now();
        }
        continue;
      }

      // Build request (defer delivery for bundling)
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

      winningRequests.push(req);
      deliveredTypes.push(pDedupKey);
      deliveredTimes.push(p.scheduleAt.getTime());
      state.sentTodayFlags[pDedupKey] = today;
      state.lastDeliveryTime[pDedupKey] = Date.now();
    }

    // ── Smart Bundling ───────────────────────────────────────────────────────
    // Separate non-bundleable (core alerts, streak savers, etc.)
    const [bundleable, nonBundleable] = separateBundleable(winningRequests);

    // Apply bundling to bundleable requests
    const { individual, bundles, consumed } = bundleNotifications(bundleable);

    // Mark consumed requests as handled (they're bundled)
    for (const req of consumed) {
      // Already flagged above; ledger counts already incremented
      NotificationAnalytics.recordSuppressed(req.type, req.tier, req.section, 'cap');
    }

    // Deliver non-bundleable first (highest priority)
    for (const req of nonBundleable) {
      await this.schedule(req);
    }

    // Deliver bundled summaries
    for (const req of bundles) {
      await this.schedule(req);
    }

    // Deliver individual bundleable notifications
    for (const req of individual) {
      await this.schedule(req);
    }

    saveEngineState(state);
  }

  /**
   * Find if a proposal is combinable with an already-delivered notification.
   * Examples: New Moon + Month Start, Holiday + Solstice, Full Moon + Evening Reflection
   */
  findCombinable(proposal: GeniusProposal, alreadyDelivered: GeniusProposal[]): GeniusProposal | null {
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
  // GENIUS QUEUE PERSISTENCE
  // ═══════════════════════════════════════════════════════════════════════════

  persistGeniusQueue(): void {
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
      persistGeniusQueue(serializable);
    } catch (e) {
      console.error('[NotificationEngine] Failed to persist genius queue:', e);
    }
  }

  restoreGeniusQueue(): void {
    try {
      const parsed = loadGeniusQueue() as Array<{
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
      clearPersistedGeniusQueue();
    }
  }

  clearPersistedGeniusQueue(): void {
    clearPersistedGeniusQueue();
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
}
