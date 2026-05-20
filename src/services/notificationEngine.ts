/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION ENGINE — Unified Intelligent Scheduler (Facade)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type {
  NotificationRequest,
  NotificationTier,
  NotificationSection,
  DailyStats,
  NotificationEngineState,
  DeliveredNotification,
} from '../types/notifications';
import { generateNotificationContent } from './notificationTemplates';
import { store } from '../store';
import { initializeNotificationChannels } from './notificationChannels';
import { cleanupOldSnoozes } from './notificationSnooze';
import { loadEngineState, saveEngineState, getTodayKey } from './notificationState';
import { NotificationDelivery } from './notificationDelivery';
import { NotificationGenius } from './notificationGenius';
import * as checkers from './notificationCheckers';
import type { CheckersFlags } from './notificationCheckers';

const RECONCILE_INTERVAL_MS = 60 * 60 * 1000;

const SECTION_PREF_MAP: Record<string, Record<string, string>> = {
  calendar: { 'holiday-reminder': 'holidayReminders', 'civil-heka-transition': 'civilHekaTransition', 'note-reminder': 'noteReminders', 'new-year-reminder': 'newYearReminders', 'solstice-equinox-reminder': 'solsticeEquinoxReminders', 'month-start-reminder': 'monthStartReminders' },
  stars: { 'daily-celestial-tips': 'dailyCelestialTips', 'retrograde-alert': 'retrogradeAlerts', 'moon-degree-update': 'moonDegreeNotifications', 'new-moon-reminder': 'newMoonReminders', 'full-moon-reminder': 'fullMoonReminders', 'sunrise-wake-up': 'sunriseWakeUp' },
  circle: { 'friend-request': 'friendRequests', 'task-assigned': 'taskRequests', 'task-due-soon': 'taskDueReminders' },
  journal: { 'reflection-reminder': 'reflectionReminders', 'daily-reflection-prompt': 'dailyReflectionPrompt', 'celestial-insight-alert': 'celestialInsightAlert' },
  planner: { 'task-reminder': 'taskReminders', 'daily-briefing': 'dailyBriefing', 'completion-celebration': 'completionCelebrations', 'complementary-task': 'complementaryTasks' },
};

class NotificationEngineClass {
  private state: NotificationEngineState;
  private reconcileTimer: ReturnType<typeof setInterval> | null = null;
  private voidMoonTimer: ReturnType<typeof setInterval> | null = null;
  private hekaCheckTimer: ReturnType<typeof setInterval> | null = null;
  private checkerDepth = 0;
  private delivery: NotificationDelivery;
  private genius: NotificationGenius;

  constructor() {
    this.state = loadEngineState();
    this.delivery = new NotificationDelivery(
      () => this.state,
      () => store.getState().calendar.notificationPreferences,
      this.isSectionEnabled.bind(this),
      (type, delta) => this.genius.updateEngagement(type, delta),
    );
    this.genius = new NotificationGenius(
      () => this.state,
      (req) => this.delivery.schedule(req),
      this.isSectionEnabled.bind(this),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  async initialize(): Promise<void> {
    this.state = loadEngineState();
    await initializeNotificationChannels();

    const today = getTodayKey();
    const cutoff = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    for (const key of Object.keys(this.state.dailyLedgers)) {
      if (key < cutoff) delete this.state.dailyLedgers[key];
    }
    for (const key of Object.keys(this.state.sentTodayFlags)) {
      if (this.state.sentTodayFlags[key] !== today) delete this.state.sentTodayFlags[key];
    }
    for (const ledger of Object.values(this.state.dailyLedgers)) {
      if (!ledger.tapped) ledger.tapped = [];
    }

    cleanupOldSnoozes();
    this.genius.restoreGeniusQueue();

    const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.state.timezone && this.state.timezone !== currentTz) { /* tz changed */ }
    this.state.timezone = currentTz;

    saveEngineState(this.state);
  }

  startRecurringChecks(): void {
    if (this.reconcileTimer) clearInterval(this.reconcileTimer);
    this.reconcileTimer = setInterval(() => void this.reconcile(), RECONCILE_INTERVAL_MS);

    this.startVoidMoonWatcher();
    this.runAllCheckers();

    if (this.hekaCheckTimer) clearInterval(this.hekaCheckTimer);
    this.hekaCheckTimer = setInterval(() => this.runAllCheckers(), 60 * 60 * 1000);
  }

  private runChecker(checker: () => Promise<void>): void {
    this.checkerDepth++;
    checker().catch((e) => console.error('[NotificationEngine] Checker failed:', e)).finally(() => this.checkerDepth--);
  }

  private runAllCheckers(): void {
    this.runChecker(() => checkers.checkNewYearReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)));
    this.runChecker(() => checkers.checkSolsticeEquinoxReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)));
    this.runChecker(() => checkers.checkMonthStartReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)));
    this.runChecker(() => checkers.checkNewMoonReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state), () => this.genius.getAstronomicalContext()));
    this.runChecker(() => checkers.checkHekaTransitions(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)));
    this.runChecker(() => checkers.checkTrackerReminders(this.sendBound, this.checkerFlags));
    this.runChecker(() => checkers.checkTaskDueReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)));
    this.runChecker(() => checkers.checkCelestialInsights(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)));
    this.runChecker(() => checkers.checkHolidayReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)));
    this.runChecker(() => checkers.checkFullMoonReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state), () => this.genius.getAstronomicalContext()));
    this.runChecker(() => checkers.checkEveningReflection(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)));
  }

  stopRecurringChecks(): void {
    if (this.reconcileTimer) { clearInterval(this.reconcileTimer); this.reconcileTimer = null; }
    if (this.voidMoonTimer) { clearInterval(this.voidMoonTimer); this.voidMoonTimer = null; }
    if (this.hekaCheckTimer) { clearInterval(this.hekaCheckTimer); this.hekaCheckTimer = null; }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE SCHEDULING (delegated to delivery)
  // ═══════════════════════════════════════════════════════════════════════════

  async schedule(req: NotificationRequest): Promise<string | null> { return this.delivery.schedule(req); }
  async cancel(id: string): Promise<boolean> { return this.delivery.cancel(id); }
  async getScheduledIds(): Promise<string[]> { return this.delivery.getScheduledIds(); }
  getWebScheduledMeta(): Array<{ id: string; type: string; taskId?: string; extra?: Record<string, unknown> }> { return this.delivery.getWebScheduledMeta(); }
  async cancelByType(type: string): Promise<void> { return this.delivery.cancelByType(type); }
  async cancelAll(): Promise<void> { return this.delivery.cancelAll(); }

  // ═══════════════════════════════════════════════════════════════════════════
  // DELIVERY LOGIC (delegated to delivery)
  // ═══════════════════════════════════════════════════════════════════════════

  confirmDelivery(id: string): void { this.delivery.confirmDelivery(id); }
  recordDelivery(req: NotificationRequest, id: string): void { this.delivery.recordDelivery(req, id); }

  // ═══════════════════════════════════════════════════════════════════════════
  // GENIUS SCHEDULER (delegated to genius)
  // ═══════════════════════════════════════════════════════════════════════════

  async scheduleGenius(type: string, tier: NotificationTier, section: NotificationSection, scheduleAt: Date, seed: string, vars: Record<string, string>, extra?: Record<string, unknown>, id?: number, dedupKey?: string): Promise<void> {
    return this.genius.scheduleGenius(type, tier, section, scheduleAt, seed, vars, extra, id, dedupKey);
  }

  updateEngagement(type: string, delta: number): void { this.genius.updateEngagement(type, delta); }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION ENABLEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  private isSectionEnabled(section: NotificationSection, type: string): boolean {
    const prefs = store.getState().calendar.notificationPreferences;
    const key = SECTION_PREF_MAP[section]?.[type];
    if (key) return ((prefs[section] as unknown) as Record<string, boolean>)[key];
    if (type.startsWith('void-moon')) return prefs.stars.voidMoonReminders;
    if (type === 'streak-saver' || type === 'streak-protection') return prefs.planner.streakSaver;
    if (type === 'task-completed' || type === 'task-declined') return prefs.circle.taskRequests;
    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RECONCILIATION
  // ═══════════════════════════════════════════════════════════════════════════

  async reconcile(): Promise<void> {
    this.state.lastReconcileAt = Date.now();
    saveEngineState(this.state);

    await checkers.checkVoidMoon(this.sendBound, this.checkerFlags, () => this.state, () => saveEngineState(this.state));
    await checkers.checkMoonDegree(this.sendBound, this.checkerFlags, () => this.state, () => saveEngineState(this.state));
    await this.delivery.confirmBackgroundDeliveries();

    const now = new Date();
    const lastReconcile = this.state.lastReconcileAt || 0;
    const hoursSinceLastReconcile = (now.getTime() - lastReconcile) / (60 * 60 * 1000);
    if (hoursSinceLastReconcile >= 1) {
      this.runAllCheckers();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VOID MOON WATCHER
  // ═══════════════════════════════════════════════════════════════════════════

  startVoidMoonWatcher(): void {
    if (this.voidMoonTimer) clearInterval(this.voidMoonTimer);
    this.voidMoonTimer = checkers.startVoidMoonWatcher(this.sendBound, this.checkerFlags, () => this.state, () => saveEngineState(this.state));
  }

  stopVoidMoonWatcher(): void {
    checkers.stopVoidMoonWatcher(this.voidMoonTimer);
    this.voidMoonTimer = null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DAILY DEDUP & STATS
  // ═══════════════════════════════════════════════════════════════════════════

  hasSentToday(flagKey: string): boolean { return this.state.sentTodayFlags[flagKey] === getTodayKey(); }
  markSentToday(flagKey: string): void { this.state.sentTodayFlags[flagKey] = getTodayKey(); saveEngineState(this.state); }
  flushGeniusQueueOnResume(): void { this.genius.flushGeniusQueueOnResume(); }

  getDailyStats(): DailyStats {
    const today = getTodayKey();
    return this.state.dailyLedgers[today] || { date: today, counts: { core: 0, standard: 0, ambient: 0 }, delivered: [] };
  }

  recordEngagement(type: string, templateIndex: number): void {
    if (!this.state.templateEngagement[type]) this.state.templateEngagement[type] = {};
    const counts = this.state.templateEngagement[type];
    counts[templateIndex] = (counts[templateIndex] || 0) + 1;
    saveEngineState(this.state);
  }

  getHistory(limit = 50): DeliveredNotification[] {
    const entries: DeliveredNotification[] = [];
    const dates = Object.keys(this.state.dailyLedgers).sort().reverse();
    for (const date of dates) {
      for (const d of [...this.state.dailyLedgers[date].delivered].reverse()) {
        entries.push(d);
        if (entries.length >= limit) return entries;
      }
    }
    return entries;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HIGH-LEVEL SCHEDULERS
  // ═══════════════════════════════════════════════════════════════════════════

  async scheduleTemplated(type: string, tier: NotificationTier, section: NotificationSection, scheduleAt: Date, seed: string, vars: Record<string, string>, extra?: Record<string, unknown>, id?: number, dedupKey?: string): Promise<string | null> {
    if (this.checkerDepth > 0) {
      await this.genius.scheduleGenius(type, tier, section, scheduleAt, seed, vars, extra, id, dedupKey);
      return null;
    }
    const { title, body, templateIndex } = generateNotificationContent(type, seed, vars);
    return this.delivery.schedule({ type, tier, title, body, scheduleAt, section, extra: { ...extra, templateIndex }, replaceExisting: true, id, dedupKey });
  }

  async notifyCore(type: string, section: NotificationSection, title: string, body: string, extra?: Record<string, unknown>, id?: number): Promise<string | null> {
    return this.schedule({ type, tier: 'core', title, body, scheduleAt: new Date(Date.now() + 1000), section, extra, id });
  }

  async notifyStandard(type: string, section: NotificationSection, title: string, body: string, scheduleAt: Date, extra?: Record<string, unknown>, id?: number): Promise<string | null> {
    return this.schedule({ type, tier: 'standard', title, body, scheduleAt, section, extra, replaceExisting: true, id });
  }

  async notifyAmbient(type: string, section: NotificationSection, title: string, body: string, scheduleAt: Date, extra?: Record<string, unknown>, id?: number): Promise<string | null> {
    return this.schedule({ type, tier: 'ambient', title, body, scheduleAt, section, extra, replaceExisting: true, id });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHECKER DELEGATES (preserved for backward compatibility)
  // ═══════════════════════════════════════════════════════════════════════════

  async checkHekaTransitions(): Promise<void> { return checkers.checkHekaTransitions(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)); }
  async checkVoidMoon(): Promise<void> { return checkers.checkVoidMoon(this.sendBound, this.checkerFlags, () => this.state, () => saveEngineState(this.state)); }
  async checkMoonDegree(): Promise<void> { return checkers.checkMoonDegree(this.sendBound, this.checkerFlags, () => this.state, () => saveEngineState(this.state)); }
  async checkTrackerReminders(): Promise<void> { return checkers.checkTrackerReminders(this.sendBound, this.checkerFlags); }
  async checkHolidayReminders(): Promise<void> { return checkers.checkHolidayReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)); }
  async checkTaskDueReminders(): Promise<void> { return checkers.checkTaskDueReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)); }
  async checkCelestialInsights(): Promise<void> { return checkers.checkCelestialInsights(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)); }
  async checkEveningReflection(): Promise<void> { return checkers.checkEveningReflection(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)); }
  async checkNewYearReminders(): Promise<void> { return checkers.checkNewYearReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)); }
  async checkSolsticeEquinoxReminders(): Promise<void> { return checkers.checkSolsticeEquinoxReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)); }
  async checkMonthStartReminders(): Promise<void> { return checkers.checkMonthStartReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state)); }
  async checkNewMoonReminders(): Promise<void> { return checkers.checkNewMoonReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state), () => this.genius.getAstronomicalContext()); }
  async checkFullMoonReminders(): Promise<void> { return checkers.checkFullMoonReminders(this.sendBound, this.checkerFlags, () => saveEngineState(this.state), () => this.genius.getAstronomicalContext()); }
  async scheduleSunriseWakeUp(): Promise<void> { return checkers.scheduleSunriseWakeUp(this.sendBound, this.checkerFlags, () => saveEngineState(this.state), () => this.genius.getAstronomicalContext()); }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  private get sendBound(): checkers.ScheduleTemplatedFn { return this.scheduleTemplated.bind(this); }
  private get checkerFlags(): CheckersFlags { return { hasSentToday: (k) => this.hasSentToday(k), markSentToday: (k) => this.markSentToday(k) }; }
}

export const NotificationEngine = new NotificationEngineClass();
