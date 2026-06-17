/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION FATIGUE DETECTION & ADAPTIVE THROTTLING
 * Learns from user behavior and dynamically adjusts caps to prevent opt-outs.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { NotificationTier } from '../types/notifications';

const FATIGUE_STORAGE_KEY = 'heka-notification-fatigue';

// ── Fatigue Profile ──────────────────────────────────────────────────────────

export interface FatigueProfile {
  /** Days since profile was last updated */
  lastUpdated: string;
  /** Total notifications delivered in last 7 days */
  delivered7d: number;
  /** Total notifications tapped in last 7 days */
  tapped7d: number;
  /** Current tap-through rate (0.0 - 1.0) */
  tapThroughRate: number;
  /** Consecutive dismisses without tapping */
  consecutiveDismisses: number;
  /** Consecutive taps (positive streak) */
  consecutiveTaps: number;
  /** Multiplier applied to daily caps (0.3x to 2.0x) */
  adaptiveCapMultiplier: number;
  /** Preferred time segments based on open history */
  preferredSegments: ('dawn' | 'morning' | 'midday' | 'evening' | 'night')[];
  /** Whether user is currently in fatigue mode */
  isFatigued: boolean;
  /** Days remaining in cooldown if fatigued */
  fatigueCooldownDays: number;
  /** Historical open rates per hour (0-23) */
  hourlyOpenRates: Record<number, number>;
}

const DEFAULT_FATIGUE_PROFILE: FatigueProfile = {
  lastUpdated: new Date().toISOString().split('T')[0],
  delivered7d: 0,
  tapped7d: 0,
  tapThroughRate: 0.5,
  consecutiveDismisses: 0,
  consecutiveTaps: 0,
  adaptiveCapMultiplier: 1.0,
  preferredSegments: ['morning', 'evening'],
  isFatigued: false,
  fatigueCooldownDays: 0,
  hourlyOpenRates: {},
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadProfile(): FatigueProfile {
  try {
    const raw = localStorage.getItem(FATIGUE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_FATIGUE_PROFILE, ...parsed };
    }
  } catch (e) {
    console.error('[NotificationFatigue] Failed to load profile:', e);
  }
  return { ...DEFAULT_FATIGUE_PROFILE };
}

function saveProfile(profile: FatigueProfile): void {
  try {
    localStorage.setItem(FATIGUE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('[NotificationFatigue] Failed to save profile:', e);
  }
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getHourSegment(hour: number): FatigueProfile['preferredSegments'][number] {
  if (hour < 5) return 'night';
  if (hour < 8) return 'dawn';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'midday';
  if (hour < 21) return 'evening';
  return 'night';
}

// ── Core Logic ───────────────────────────────────────────────────────────────

class NotificationFatigueClass {
  private profile: FatigueProfile;

  constructor() {
    this.profile = loadProfile();
    this.migrateDailyStats();
  }

  /** Called once per day to decay old stats */
  private migrateDailyStats(): void {
    const today = getTodayKey();
    if (this.profile.lastUpdated !== today) {
      // Decay 7-day stats (simplified: reduce by ~15% per day)
      this.profile.delivered7d = Math.floor(this.profile.delivered7d * 0.85);
      this.profile.tapped7d = Math.floor(this.profile.tapped7d * 0.85);
      this.profile.lastUpdated = today;

      // Reduce fatigue cooldown
      if (this.profile.fatigueCooldownDays > 0) {
        this.profile.fatigueCooldownDays--;
        if (this.profile.fatigueCooldownDays === 0) {
          this.profile.isFatigued = false;
        }
      }

      saveProfile(this.profile);
    }
  }

  /** Record that a notification was delivered (shown by OS) */
  recordDelivered(hour: number): void {
    this.migrateDailyStats();
    this.profile.delivered7d++;
    this.updateTapThroughRate();
    this.updateHourlyRate(hour, false);
    saveProfile(this.profile);
  }

  /** Record that a notification was tapped */
  recordTapped(hour: number): void {
    this.migrateDailyStats();
    this.profile.tapped7d++;
    this.profile.consecutiveTaps++;
    this.profile.consecutiveDismisses = 0;
    this.updateTapThroughRate();
    this.updateHourlyRate(hour, true);
    this.adjustCapsBasedOnEngagement();
    saveProfile(this.profile);
  }

  /** Record that a notification was dismissed without action */
  recordDismissed(): void {
    this.migrateDailyStats();
    this.profile.consecutiveDismisses++;
    this.profile.consecutiveTaps = 0;
    this.updateTapThroughRate();
    this.detectFatigue();
    saveProfile(this.profile);
  }

  /** Record that a notification was snoozed (neutral signal) */
  recordSnoozed(): void {
    this.migrateDailyStats();
    // Snoozing is neutral — don't count as dismiss, don't count as tap
    // But it does indicate the timing wasn't ideal
    this.profile.consecutiveDismisses = Math.max(0, this.profile.consecutiveDismisses - 1);
    saveProfile(this.profile);
  }

  private updateTapThroughRate(): void {
    if (this.profile.delivered7d === 0) {
      this.profile.tapThroughRate = 0.5;
      return;
    }
    this.profile.tapThroughRate = Math.min(1, Math.max(0, this.profile.tapped7d / this.profile.delivered7d));
  }

  private updateHourlyRate(hour: number, wasTapped: boolean): void {
    const current = this.profile.hourlyOpenRates[hour] || 0.5;
    const alpha = 0.2; // Learning rate
    const target = wasTapped ? 1 : 0;
    this.profile.hourlyOpenRates[hour] = current * (1 - alpha) + target * alpha;
  }

  private detectFatigue(): void {
    // Fatigue thresholds
    const DISMISS_THRESHOLD = 5; // 5 consecutive dismisses
    const TTR_THRESHOLD = 0.15; // Tap-through rate below 15%

    if (this.profile.consecutiveDismisses >= DISMISS_THRESHOLD) {
      this.triggerFatigue();
      return;
    }

    if (this.profile.delivered7d >= 10 && this.profile.tapThroughRate < TTR_THRESHOLD) {
      this.triggerFatigue();
    }
  }

  private triggerFatigue(): void {
    this.profile.isFatigued = true;
    this.profile.fatigueCooldownDays = 3;
    this.profile.adaptiveCapMultiplier = Math.max(0.3, this.profile.adaptiveCapMultiplier * 0.5);
    this.profile.consecutiveDismisses = 0;
    console.log('[NotificationFatigue] User entered fatigue mode. Caps reduced for 3 days.');
  }

  private adjustCapsBasedOnEngagement(): void {
    // If user is tapping consistently, slowly restore caps
    if (this.profile.consecutiveTaps >= 3 && this.profile.adaptiveCapMultiplier < 1.0) {
      this.profile.adaptiveCapMultiplier = Math.min(1.0, this.profile.adaptiveCapMultiplier + 0.1);
    }

    // If user is highly engaged, allow slightly more
    if (this.profile.tapThroughRate > 0.6 && this.profile.adaptiveCapMultiplier < 1.5) {
      this.profile.adaptiveCapMultiplier = Math.min(1.5, this.profile.adaptiveCapMultiplier + 0.05);
    }
  }

  /** Get the adaptive cap for a tier */
  getAdaptiveCap(baseCap: number, tier: NotificationTier): number {
    if (tier === 'core') return baseCap; // CORE never throttled
    const multiplier = this.profile.isFatigued
      ? Math.min(this.profile.adaptiveCapMultiplier, 0.5)
      : this.profile.adaptiveCapMultiplier;
    return Math.max(1, Math.floor(baseCap * multiplier));
  }

  /** Check if a notification should be suppressed due to fatigue */
  shouldSuppress(tier: NotificationTier): boolean {
    if (tier === 'core') return false;
    if (!this.profile.isFatigued) return false;
    // In fatigue mode, suppress ambient entirely
    if (tier === 'ambient') return true;
    // Standard is reduced but not eliminated
    return false;
  }

  /** Get the best time segment for this user */
  getPreferredSegments(): FatigueProfile['preferredSegments'] {
    // Build from hourly open rates
    const segments = new Set<FatigueProfile['preferredSegments'][number]>();
    for (let h = 0; h < 24; h++) {
      const rate = this.profile.hourlyOpenRates[h];
      if (rate !== undefined && rate > 0.4) {
        segments.add(getHourSegment(h));
      }
    }
    if (segments.size === 0) {
      return ['morning', 'evening'];
    }
    return Array.from(segments);
  }

  /** Get the best hour for a notification type */
  getBestHour(preferredSegments: FatigueProfile['preferredSegments']): number {
    let bestHour = 8; // Default morning
    let bestRate = -1;

    for (let h = 0; h < 24; h++) {
      const segment = getHourSegment(h);
      if (!preferredSegments.includes(segment)) continue;
      const rate = this.profile.hourlyOpenRates[h] || 0.3;
      if (rate > bestRate) {
        bestRate = rate;
        bestHour = h;
      }
    }

    return bestHour;
  }

  /** Get current profile for debugging/display */
  getProfile(): FatigueProfile {
    return { ...this.profile };
  }

  /** Reset profile (for testing or user request) */
  reset(): void {
    this.profile = { ...DEFAULT_FATIGUE_PROFILE };
    saveProfile(this.profile);
  }
}

export const NotificationFatigue = new NotificationFatigueClass();
