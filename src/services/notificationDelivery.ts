/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION DELIVERY — Core scheduling, cancellation, and delivery tracking
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { LocalNotifications, type LocalNotificationSchema } from '@capacitor/local-notifications';
import type {
  NotificationRequest,
  NotificationSection,
  NotificationEngineState,
  NotificationPreferences,
} from '../types/notifications';
import {
  TIER_DAILY_CAPS,
} from '../types/notifications';
import { eventBus } from './eventBus';
import { getChannelForTier, getActionsForType } from './notificationChannels';
import { NotificationFatigue } from './notificationFatigue';
import { NotificationAnalytics } from './notificationAnalytics';
import { incrementBadge, decrementBadge } from './notificationBadge';
import { isVacationMode, isInFocusSchedule } from './notificationScheduling';
import { enrichWithRichContent } from './notificationRichContent';
import { saveEngineState, getTodayKey } from './notificationState';
import { NOTIFICATION_ID_RANGES } from '../types/notifications';

// ── Constants ────────────────────────────────────────────────────────────────

const DEDUPLICATION_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours

const IS_NATIVE_APP = typeof (window as unknown as Record<string, unknown>).Capacitor !== 'undefined';

// ── Helpers ──────────────────────────────────────────────────────────────────

export function isNativePluginAvailable(): boolean {
  if (!IS_NATIVE_APP) return false;
  try {
    return typeof LocalNotifications.requestPermissions === 'function';
  } catch {
    return false;
  }
}

export function generateId(section: NotificationSection, type: string): number {
  const range = NOTIFICATION_ID_RANGES[section];
  const typeHash = type.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return range.min + (typeHash % (range.max - range.min));
}

// ── Delivery Class ───────────────────────────────────────────────────────────

export class NotificationDelivery {
  private webTimeouts: Map<string, number> = new Map();
  private webMeta: Map<string, { type: string; taskId?: string; extra?: Record<string, unknown> }> = new Map();
  /** Track scheduled IDs by type so cancelByType() actually works. */
  private typeToIds: Map<string, Set<string>> = new Map();

  constructor(
    private getState: () => NotificationEngineState,
    private getPreferences: () => NotificationPreferences,
    private isSectionEnabled: (section: NotificationSection, type: string) => boolean,
    private onUpdateEngagement: (type: string, delta: number) => void,
  ) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE SCHEDULING
  // ═══════════════════════════════════════════════════════════════════════════

  async schedule(req: NotificationRequest): Promise<string | null> {
    const prefs = this.getPreferences();
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

    // Enrich with rich notification content (largeBody, attachments, etc.)
    const enrichedReq = enrichWithRichContent(req);

    // Claim the slot IMMEDIATELY (before any async work) to prevent race
    // conditions when multiple notifications schedule in parallel.
    this.recordSent(enrichedReq, idString);

    // Track ID by type for cancelByType
    const typeKey = enrichedReq.type;
    if (!this.typeToIds.has(typeKey)) this.typeToIds.set(typeKey, new Set());
    this.typeToIds.get(typeKey)!.add(idString);

    // Native path
    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      try {
        const { display } = await LocalNotifications.checkPermissions();
        if (display !== 'granted') {
          // Permission denied — roll back the ledger entry
          this.rollbackLedgerEntry(enrichedReq, idString);
          return null;
        }

        // Cancel existing if replaceable
        if (enrichedReq.replaceExisting) {
          try {
            await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
          } catch {
            // ignore cancel errors
          }
        }

        // Determine channel and action type
        const channelId = enrichedReq.channelId || getChannelForTier(enrichedReq.tier);
        const actionTypeId = enrichedReq.actionTypeId || enrichedReq.type;
        void getActionsForType(actionTypeId); // Ensure actions are registered

        const nativeNotification: LocalNotificationSchema = {
          id: notificationId,
          title: enrichedReq.title,
          body: enrichedReq.body,
          schedule: { at: enrichedReq.scheduleAt },
          smallIcon: 'ic_notification',
          iconColor: '#c9a227',
          channelId,
          actionTypeId,
          extra: { ...enrichedReq.extra, _engineType: enrichedReq.type, _engineTier: enrichedReq.tier, _engineSection: enrichedReq.section },
        };

        // Rich notification fields (Android)
        if (enrichedReq.largeBody) nativeNotification.largeBody = enrichedReq.largeBody;
        if (enrichedReq.summaryText) nativeNotification.summaryText = enrichedReq.summaryText;
        if (enrichedReq.inboxList) nativeNotification.inboxList = enrichedReq.inboxList.slice(0, 5);
        if (enrichedReq.largeIcon) nativeNotification.largeIcon = enrichedReq.largeIcon;
        if (enrichedReq.attachments) {
          nativeNotification.attachments = enrichedReq.attachments.map(a => ({
            id: a.id,
            url: a.url,
          }));
        }
        if (enrichedReq.group) {
          nativeNotification.group = enrichedReq.group;
          nativeNotification.groupSummary = enrichedReq.groupSummary || false;
        }

        await LocalNotifications.schedule({
          notifications: [nativeNotification]
        });

        // Track analytics and badge
        NotificationAnalytics.recordScheduled(enrichedReq.type, enrichedReq.tier, enrichedReq.section);
        void incrementBadge();

        return idString;
      } catch (error) {
        // Schedule failed — roll back the ledger entry
        this.rollbackLedgerEntry(enrichedReq, idString);
        console.error('[NotificationEngine] Native schedule error:', error);
        return null;
      }
    }

    // Browser fallback: setTimeout (only works while page is open)
    const delay = enrichedReq.scheduleAt.getTime() - Date.now();
    if (delay <= 0) {
      // Immediate
      this.showWebNotification(enrichedReq.title, { body: enrichedReq.body });
      this.confirmDelivery(idString);
      return idString;
    }

    // Cancel existing web timeout if replacing
    if (enrichedReq.replaceExisting) {
      const existing = this.webTimeouts.get(idString);
      if (existing !== undefined) {
        clearTimeout(existing);
        this.webTimeouts.delete(idString);
      }
    }

    const timeoutId = window.setTimeout(() => {
      this.showWebNotification(enrichedReq.title, { body: enrichedReq.body });
      this.confirmDelivery(idString);
      this.webTimeouts.delete(idString);
      this.webMeta.delete(idString);
    }, delay);

    this.webTimeouts.set(idString, timeoutId);
    this.webMeta.set(idString, { type: enrichedReq.type, taskId: enrichedReq.extra?.taskId, extra: enrichedReq.extra });
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
        void decrementBadge();
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
  getWebScheduledMeta(): Array<{ id: string; type: string; taskId?: string; extra?: Record<string, unknown> }> {
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
    const ledger = this.getState().dailyLedgers[today] || { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [], tapped: [] };

    // Fatigue check: suppress ambient entirely and reduce standard in fatigue mode
    if (NotificationFatigue.shouldSuppress(req.tier)) {
      NotificationAnalytics.recordSuppressed(req.type, req.tier, req.section, 'fatigue');
      return false;
    }

    // Quiet hours check: CORE bypasses, STANDARD/AMBIENT respects
    if (req.tier !== 'core') {
      const prefs = this.getPreferences();
      const qh = prefs.quietHours;
      if (qh?.enabled) {
        const hour = req.scheduleAt.getHours();
        const inQuietHours = qh.start > qh.end
          ? (hour >= qh.start || hour < qh.end)
          : (hour >= qh.start && hour < qh.end);
        if (inQuietHours) {
          NotificationAnalytics.recordSuppressed(req.type, req.tier, req.section, 'quiet_hours');
          return false;
        }
      }
    }

    // Vacation mode check: suppress non-essential notifications
    if (isVacationMode()) {
      const allowedTypes = this.getPreferences().vacationMode.allowedTypes;
      if (!allowedTypes.includes(req.type)) {
        NotificationAnalytics.recordSuppressed(req.type, req.tier, req.section, 'quiet_hours');
        return false;
      }
    }

    // Focus schedule check: only allow specified tiers during focus time
    if (isInFocusSchedule()) {
      const prefs = this.getPreferences();
      const now = new Date();
      const dayOfWeek = now.getDay();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      for (const schedule of prefs.focusSchedules) {
        if (!schedule.enabled) continue;
        if (!schedule.daysOfWeek.includes(dayOfWeek)) continue;

        const startMinutes = schedule.startHour * 60 + schedule.startMinute;
        const endMinutes = schedule.endHour * 60 + schedule.endMinute;
        const inSchedule = startMinutes > endMinutes
          ? (currentMinutes >= startMinutes || currentMinutes < endMinutes)
          : (currentMinutes >= startMinutes && currentMinutes < endMinutes);

        if (inSchedule && !schedule.allowedTiers.includes(req.tier)) {
          NotificationAnalytics.recordSuppressed(req.type, req.tier, req.section, 'quiet_hours');
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
      NotificationAnalytics.recordSuppressed(req.type, req.tier, req.section, 'dedup');
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
          NotificationAnalytics.recordSuppressed(req.type, req.tier, req.section, 'dedup');
          return false;
        }
      }
    }

    // Tier cap check (with fatigue-adaptive caps)
    const baseCap = TIER_DAILY_CAPS[req.tier];
    const adaptiveCap = NotificationFatigue.getAdaptiveCap(baseCap, req.tier);
    if (adaptiveCap !== Infinity && ledger.counts[req.tier] >= adaptiveCap) {
      NotificationAnalytics.recordSuppressed(req.type, req.tier, req.section, 'cap');
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
  recordSent(req: NotificationRequest, id: string): void {
    // Use the notification's scheduled day for caps, not the current day.
    // A notification scheduled for tomorrow should count against tomorrow's cap.
    const dayKey = req.scheduleAt.toISOString().split('T')[0];
    const state = this.getState();
    if (!state.dailyLedgers[dayKey]) {
      state.dailyLedgers[dayKey] = { date: dayKey, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [], tapped: [] };
    }
    const ledger = state.dailyLedgers[dayKey];

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
    saveEngineState(state);

    // Notify UI in real time
    eventBus.emit('heka-notification-sent', { type: req.type, title: req.title });
  }

  /**
   * Roll back a ledger entry when a notification was claimed but failed to
   * actually schedule (e.g. permission denied or native error).
   */
  rollbackLedgerEntry(req: NotificationRequest, id: string): void {
    const dayKey = req.scheduleAt.toISOString().split('T')[0];
    const state = this.getState();
    const ledger = state.dailyLedgers[dayKey];
    if (!ledger) return;

    const idx = ledger.delivered.findIndex(d => d.id === id);
    if (idx >= 0) {
      ledger.delivered.splice(idx, 1);
      ledger.counts[req.tier] = Math.max(0, ledger.counts[req.tier] - 1);
      saveEngineState(state);
    }
  }

  /**
   * Confirm that a scheduled notification was actually delivered by the OS.
   * Called from the localNotificationReceived listener when the alarm fires.
   * This is the ONLY reliable way to know a notification was shown.
   */
  confirmDelivery(id: string): void {
    const today = getTodayKey();
    const state = this.getState();
    const ledger = state.dailyLedgers[today];
    if (!ledger) return;

    const record = ledger.delivered.find(d => d.id === id);
    if (record) {
      record.confirmedDeliveredAt = Date.now();
      saveEngineState(state);
      eventBus.emit('heka-notification-delivered', { id, type: record.type });

      // Track analytics and fatigue
      const hour = new Date().getHours();
      NotificationAnalytics.recordDelivered(record.type, record.tier, record.section, id);
      NotificationFatigue.recordDelivered(hour);

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
    const state = this.getState();
    if (!state.dailyLedgers[today]) {
      state.dailyLedgers[today] = { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [], tapped: [] };
    }
    const ledger = state.dailyLedgers[today];

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
    saveEngineState(state);

    // Update engagement: this type was tapped = positive signal
    this.onUpdateEngagement(req.type, 1);

    // Track analytics, fatigue, and badge
    const hour = new Date().getHours();
    NotificationAnalytics.recordTapped(req.type, req.tier, req.section, req.extra?.templateIndex);
    NotificationFatigue.recordTapped(hour);
    void decrementBadge();
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
  // BACKGROUND DELIVERY CONFIRMATION (used by reconcile)
  // ═══════════════════════════════════════════════════════════════════════════

  async confirmBackgroundDeliveries(): Promise<void> {
    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      try {
        const { notifications } = await LocalNotifications.getDeliveredNotifications();
        if (notifications && notifications.length > 0) {
          const deliveredIds = new Set(notifications.map(n => String(n.id)));
          const today = getTodayKey();
          const state = this.getState();
          const ledger = state.dailyLedgers[today];
          if (ledger) {
            for (const record of ledger.delivered) {
              if (!record.confirmedDeliveredAt && deliveredIds.has(record.id)) {
                record.confirmedDeliveredAt = Date.now();
                eventBus.emit('heka-notification-delivered', { id: record.id, type: record.type });
              }
            }
            saveEngineState(state);
          }
        }
      } catch (e) {
        console.warn('[NotificationEngine] getDeliveredNotifications failed:', e);
      }
    }
  }
}
