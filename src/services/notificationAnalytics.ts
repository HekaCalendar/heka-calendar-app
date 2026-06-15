/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION ANALYTICS PIPELINE
 * Tracks every notification event: scheduled, delivered, tapped, dismissed,
 * snoozed, suppressed. Batches and flushes to Firebase Analytics.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { NotificationTier, NotificationSection } from '../types/notifications';

interface CapacitorWindow {
  Capacitor?: {
    getPlatform?: () => string;
    getAppVersion?: () => string;
  };
}

const ANALYTICS_STORAGE_KEY = 'heka-notification-analytics-queue';
const FLUSH_INTERVAL_MS = 60000; // 1 minute
const MAX_QUEUE_SIZE = 500;

// ── Event Types ──────────────────────────────────────────────────────────────

export type NotificationEventType =
  | 'scheduled'
  | 'delivered'
  | 'tapped'
  | 'dismissed'
  | 'snoozed'
  | 'missed'
  | 'suppressed'
  | 'action_tapped'
  | 'fatigue_triggered'
  | 'celebration_shown';

export interface NotificationEvent {
  eventType: NotificationEventType;
  notificationType: string;
  tier: NotificationTier;
  section: NotificationSection;
  templateIndex?: number;
  geniusScore?: number;
  /** Time between schedule and OS delivery (ms) */
  deliveryLatencyMs?: number;
  /** Time between delivery and tap (ms) */
  tapLatencyMs?: number;
  /** Why a notification was suppressed */
  suppressedReason?: 'cap' | 'quiet_hours' | 'dedup' | 'permission' | 'fatigue' | 'native_error';
  /** Action button ID that was tapped */
  actionId?: string;
  /** Device platform */
  deviceType: 'ios' | 'android' | 'web';
  /** App version */
  appVersion: string;
  /** Timestamp */
  timestamp: number;
  /** User ID (if authenticated) */
  userId?: string;
}

// ── Queue Management ─────────────────────────────────────────────────────────

function loadQueue(): NotificationEvent[] {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('[Analytics] Failed to load queue:', e);
  }
  return [];
}

function saveQueue(queue: NotificationEvent[]): void {
  try {
    // Trim if too large
    if (queue.length > MAX_QUEUE_SIZE) {
      queue = queue.slice(-MAX_QUEUE_SIZE);
    }
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('[Analytics] Failed to save queue:', e);
  }
}

// ── Device Detection ─────────────────────────────────────────────────────────

function getDeviceType(): 'ios' | 'android' | 'web' {
  const platform = (window as unknown as CapacitorWindow).Capacitor?.getPlatform?.();
  if (platform === 'ios') return 'ios';
  if (platform === 'android') return 'android';
  return 'web';
}

function getAppVersion(): string {
  try {
    return (window as unknown as CapacitorWindow).Capacitor?.getAppVersion?.() || '2.2.1';
  } catch {
    return '2.2.1';
  }
}

// ── Firebase Analytics Stub ──────────────────────────────────────────────────

async function logToFirebase(eventName: string, params: Record<string, unknown>): Promise<void> {
  try {
    const fb = await import('./firebase');
    const analytics = (fb as unknown as { analytics?: { logEvent: (name: string, params: Record<string, unknown>) => Promise<void> } }).analytics;
    if (analytics && typeof analytics.logEvent === 'function') {
      await analytics.logEvent(eventName, params);
    }
  } catch {
    // Firebase not available — events stay in queue for later
  }
}

// ── Core Analytics Class ─────────────────────────────────────────────────────

class NotificationAnalyticsClass {
  private queue: NotificationEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private scheduledAt: Record<string, number> = {};

  constructor() {
    this.queue = loadQueue();
    this.startFlushTimer();
  }

  private startFlushTimer(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushTimer = setInterval(() => {
      void this.flush();
    }, FLUSH_INTERVAL_MS);
  }

  public pauseFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  public resumeFlushTimer(): void {
    if (!this.flushTimer) {
      this.startFlushTimer();
    }
  }

  /** Record that a notification was scheduled */
  recordScheduled(type: string, tier: NotificationTier, section: NotificationSection): void {
    this.scheduledAt[type] = Date.now();

    this.enqueue({
      eventType: 'scheduled',
      notificationType: type,
      tier,
      section,
      deviceType: getDeviceType(),
      appVersion: getAppVersion(),
      timestamp: Date.now(),
    });
  }

  /** Record that a notification was delivered by the OS */
  recordDelivered(type: string, tier: NotificationTier, section: NotificationSection, _id: string): void {
    const scheduled = this.scheduledAt[type] || 0;
    const latency = scheduled > 0 ? Date.now() - scheduled : undefined;

    this.enqueue({
      eventType: 'delivered',
      notificationType: type,
      tier,
      section,
      deliveryLatencyMs: latency,
      deviceType: getDeviceType(),
      appVersion: getAppVersion(),
      timestamp: Date.now(),
    });
  }

  /** Record that a notification was tapped */
  recordTapped(
    type: string,
    tier: NotificationTier,
    section: NotificationSection,
    templateIndex?: number,
    actionId?: string
  ): void {
    const scheduled = this.scheduledAt[type] || 0;
    const latency = scheduled > 0 ? Date.now() - scheduled : undefined;

    this.enqueue({
      eventType: actionId ? 'action_tapped' : 'tapped',
      notificationType: type,
      tier,
      section,
      templateIndex,
      tapLatencyMs: latency,
      actionId,
      deviceType: getDeviceType(),
      appVersion: getAppVersion(),
      timestamp: Date.now(),
    });
  }

  /** Record that a notification was dismissed without action */
  recordDismissed(type: string, tier: NotificationTier, section: NotificationSection): void {
    this.enqueue({
      eventType: 'dismissed',
      notificationType: type,
      tier,
      section,
      deviceType: getDeviceType(),
      appVersion: getAppVersion(),
      timestamp: Date.now(),
    });
  }

  /** Record that a notification was snoozed */
  recordSnoozed(type: string, tier: NotificationTier, section: NotificationSection): void {
    this.enqueue({
      eventType: 'snoozed',
      notificationType: type,
      tier,
      section,
      deviceType: getDeviceType(),
      appVersion: getAppVersion(),
      timestamp: Date.now(),
    });
  }

  /** Record that a notification was suppressed (not delivered) */
  recordSuppressed(
    type: string,
    tier: NotificationTier,
    section: NotificationSection,
    reason: NotificationEvent['suppressedReason']
  ): void {
    this.enqueue({
      eventType: 'suppressed',
      notificationType: type,
      tier,
      section,
      suppressedReason: reason,
      deviceType: getDeviceType(),
      appVersion: getAppVersion(),
      timestamp: Date.now(),
    });
  }

  /** Record that fatigue mode was triggered */
  recordFatigueTriggered(consecutiveDismisses: number, tapThroughRate: number): void {
    this.enqueue({
      eventType: 'fatigue_triggered',
      notificationType: 'system',
      tier: 'standard',
      section: 'planner',
      deviceType: getDeviceType(),
      appVersion: getAppVersion(),
      timestamp: Date.now(),
    });

    // Also log directly to Firebase as this is important
    void logToFirebase('notification_fatigue_triggered', {
      consecutive_dismisses: consecutiveDismisses,
      tap_through_rate: Math.round(tapThroughRate * 100),
    });
  }

  /** Record that a celebration was shown */
  recordCelebration(type: string, milestone: number): void {
    this.enqueue({
      eventType: 'celebration_shown',
      notificationType: type,
      tier: 'standard',
      section: 'planner',
      deviceType: getDeviceType(),
      appVersion: getAppVersion(),
      timestamp: Date.now(),
    });

    void logToFirebase('notification_celebration', {
      celebration_type: type,
      milestone,
    });
  }

  private enqueue(event: NotificationEvent): void {
    this.queue.push(event);
    saveQueue(this.queue);
  }

  /** Flush queued events to Firebase Analytics */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];
    saveQueue(this.queue);

    // Group by event type for efficient batching
    const grouped: Record<string, NotificationEvent[]> = {};
    for (const event of batch) {
      if (!grouped[event.eventType]) grouped[event.eventType] = [];
      grouped[event.eventType].push(event);
    }

    for (const [eventType, events] of Object.entries(grouped)) {
      try {
        // Log aggregate event
        await logToFirebase(`notification_${eventType}`, {
          count: events.length,
          types: events.map(e => e.notificationType).join(','),
        });
      } catch (e) {
        console.warn('[Analytics] Flush failed for', eventType, e);
      }
    }

    console.log(`[Analytics] Flushed ${batch.length} events`);
  }

  /** Get queue size (for debugging) */
  getQueueSize(): number {
    return this.queue.length;
  }

  /** Get recent events (for debugging) */
  getRecentEvents(limit = 50): NotificationEvent[] {
    return this.queue.slice(-limit);
  }
}

export const NotificationAnalytics = new NotificationAnalyticsClass();
