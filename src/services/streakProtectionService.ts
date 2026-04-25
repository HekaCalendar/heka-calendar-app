/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STREAK PROTECTION SERVICE — The HEKA Flame Guardian
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Predicts when a task streak is about to break and intervenes with poetic urgency.
 * Combines historical completion patterns, current celestial context, and
 * psychological timing to deliver the perfect nudge at the perfect moment.
 */

import { NotificationEngine } from './notificationEngine';
import { aiConfigService } from './aiConfigService';
import type { PlannerTask } from '../types';

let lastScheduledNotificationAt = 0;
let lastScheduledDangerLevel: StreakDangerAssessment['dangerLevel'] = 'none';

const DANGER_LEVEL_ORDER: StreakDangerAssessment['dangerLevel'][] = ['none', 'low', 'medium', 'high', 'critical'];

function dangerHasEscalated(from: StreakDangerAssessment['dangerLevel'], to: StreakDangerAssessment['dangerLevel']): boolean {
  return DANGER_LEVEL_ORDER.indexOf(to) > DANGER_LEVEL_ORDER.indexOf(from);
}

export interface StreakDangerAssessment {
  isInDanger: boolean;
  dangerLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  hoursRemaining: number;
  streakAtRisk: number;
  usualCompletionHour: number | null;
  message: string;
  shouldNotify: boolean;
  notificationTime: Date | null;
}

const STREAK_PROTECTION_NOTIFICATION_ID = 900001;

// ── Historical Pattern Analysis ──────────────────────────────────────────────

function getCompletedTasks(tasks: PlannerTask[]): PlannerTask[] {
  return tasks.filter((t) => t.isCompleted && t.completedAt);
}

function getCurrentStreak(tasks: PlannerTask[]): number {
  const completedDays = new Set<string>();
  for (const task of tasks) {
    if (task.isCompleted && task.completedAt) {
      completedDays.add(task.completedAt.split('T')[0]);
    }
  }

  const sorted = Array.from(completedDays).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let streak = 0;
  let checkDate = today;

  for (const date of sorted) {
    if (date === checkDate || (streak === 0 && date === yesterday)) {
      streak++;
      const next = new Date(checkDate);
      next.setDate(next.getDate() - 1);
      checkDate = next.toISOString().split('T')[0];
    } else if (date < checkDate) {
      break;
    }
  }

  return streak;
}

function getUsualCompletionHour(tasks: PlannerTask[]): number | null {
  const completed = getCompletedTasks(tasks);
  if (completed.length < 3) return null;

  const hours: number[] = [];
  for (const task of completed) {
    if (task.completedAt) {
      const hour = new Date(task.completedAt).getHours();
      hours.push(hour);
    }
  }

  hours.sort((a, b) => a - b);
  const median = hours[Math.floor(hours.length / 2)];
  return median;
}

function hasCompletedTaskToday(tasks: PlannerTask[]): boolean {
  const today = new Date().toISOString().split('T')[0];
  return tasks.some((t) => t.isCompleted && t.completedAt?.startsWith(today));
}

function hasPendingTasks(tasks: PlannerTask[]): boolean {
  const today = new Date().toISOString().split('T')[0];
  return tasks.some((t) => !t.isCompleted && t.dayKey === today);
}

// ── Danger Calculation ───────────────────────────────────────────────────────

export function assessStreakDanger(tasks: PlannerTask[]): StreakDangerAssessment {
  const streak = getCurrentStreak(tasks);
  const completedToday = hasCompletedTaskToday(tasks);
  const pendingToday = hasPendingTasks(tasks);
  const usualHour = getUsualCompletionHour(tasks);
  const now = new Date();
  const currentHour = now.getHours();

  // No streak to protect
  if (streak === 0) {
    return {
      isInDanger: false,
      dangerLevel: 'none',
      hoursRemaining: 24,
      streakAtRisk: 0,
      usualCompletionHour: usualHour,
      message: '',
      shouldNotify: false,
      notificationTime: null,
    };
  }

  // Already completed today — safe
  if (completedToday) {
    return {
      isInDanger: false,
      dangerLevel: 'none',
      hoursRemaining: 24,
      streakAtRisk: streak,
      usualCompletionHour: usualHour,
      message: '',
      shouldNotify: false,
      notificationTime: null,
    };
  }

  // Calculate hours until "end of day" (3 AM next day as grace period)
  const endOfDay = new Date(now);
  endOfDay.setDate(endOfDay.getDate() + 1);
  endOfDay.setHours(3, 0, 0, 0);
  const hoursRemaining = Math.max(0, (endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60));

  let dangerLevel: StreakDangerAssessment['dangerLevel'] = 'none';
  let shouldNotify = false;
  let notificationTime: Date | null = null;

  // Determine danger based on usual completion time and hours remaining
  if (usualHour !== null) {
    const hoursPastUsual = currentHour - usualHour;

    if (hoursRemaining <= 2) {
      dangerLevel = 'critical';
      shouldNotify = true;
      notificationTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 min
    } else if (hoursRemaining <= 4 && hoursPastUsual >= 3) {
      dangerLevel = 'high';
      shouldNotify = true;
      notificationTime = new Date(now.getTime() + 15 * 60 * 1000); // 15 min
    } else if (hoursPastUsual >= 2 && hoursRemaining <= 8) {
      dangerLevel = 'medium';
      shouldNotify = true;
      notificationTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 min
    } else if (hoursPastUsual >= 4) {
      dangerLevel = 'low';
      shouldNotify = false;
    }
  } else {
    // No pattern yet — use time-based heuristic
    if (hoursRemaining <= 3) {
      dangerLevel = 'high';
      shouldNotify = true;
      notificationTime = new Date(now.getTime() + 10 * 60 * 1000);
    } else if (hoursRemaining <= 6 && pendingToday) {
      dangerLevel = 'medium';
      shouldNotify = true;
      notificationTime = new Date(now.getTime() + 60 * 60 * 1000);
    }
  }

  // Generate message based on danger level and streak
  const messages: Record<string, string[]> = {
    critical: [
      `Your ${streak}-day flame dims in the final hour. One small act keeps it alive.`,
      `The sands are running out. Your ${streak}-day streak needs you now.`,
      `This is the moment. Your ${streak}-day flame is one task away from extinction.`,
    ],
    high: [
      `Your ${streak}-day streak is flickering. The cosmos has seen you come this far.`,
      `You usually move by now. Your ${streak}-day flame grows impatient.`,
      `A small ember remains from your ${streak}-day fire. Tend to it.`,
    ],
    medium: [
      `The day is waning and your ${streak}-day streak watches quietly.`,
      `Your ${streak}-day flame still burns, but it would like to be fed.`,
      `There is still time to honor your ${streak}-day commitment.`,
    ],
    low: [
      `Your ${streak}-day streak is safe, but the cosmos rewards those who act early.`,
      `You have time, but momentum loves speed.`,
    ],
  };

  const messagePool = messages[dangerLevel] || messages.low;
  const message = messagePool[Math.floor(Math.random() * messagePool.length)];

  return {
    isInDanger: dangerLevel !== 'none',
    dangerLevel,
    hoursRemaining,
    streakAtRisk: streak,
    usualCompletionHour: usualHour,
    message,
    shouldNotify,
    notificationTime,
  };
}

// ── Notification Scheduling ──────────────────────────────────────────────────

export async function scheduleStreakProtectionNotification(
  assessment: StreakDangerAssessment
): Promise<void> {
  if (!assessment.shouldNotify || !assessment.notificationTime) {
    await NotificationEngine.cancel(String(STREAK_PROTECTION_NOTIFICATION_ID));
    lastScheduledNotificationAt = 0;
    lastScheduledDangerLevel = 'none';
    return;
  }

  // Don't schedule if notification time has passed
  if (assessment.notificationTime.getTime() <= Date.now()) {
    await NotificationEngine.cancel(String(STREAK_PROTECTION_NOTIFICATION_ID));
    lastScheduledNotificationAt = 0;
    lastScheduledDangerLevel = 'none';
    return;
  }

  // Prevent notification spam: only reschedule if 10+ minutes have passed
  // or the danger level has escalated
  const now = Date.now();
  const recentlyScheduled = now - lastScheduledNotificationAt < 10 * 60 * 1000;
  if (recentlyScheduled && !dangerHasEscalated(lastScheduledDangerLevel, assessment.dangerLevel)) {
    return;
  }

  // Cancel any existing streak protection notification and reschedule
  await NotificationEngine.cancel(String(STREAK_PROTECTION_NOTIFICATION_ID));

  const title = assessment.dangerLevel === 'critical'
    ? '🔥 Your flame is dying'
    : assessment.dangerLevel === 'high'
    ? '⚡ Streak in danger'
    : '🌙 Tend to your streak';

  await NotificationEngine.schedule({
    type: 'streak-protection',
    tier: 'core',
    title,
    body: assessment.message,
    scheduleAt: assessment.notificationTime,
    section: 'planner',
    id: STREAK_PROTECTION_NOTIFICATION_ID,
    extra: { type: 'streak-protection', dangerLevel: assessment.dangerLevel },
  });

  lastScheduledNotificationAt = now;
  lastScheduledDangerLevel = assessment.dangerLevel;
}

export async function cancelStreakProtectionNotification(): Promise<void> {
  await NotificationEngine.cancel(String(STREAK_PROTECTION_NOTIFICATION_ID));
  lastScheduledNotificationAt = 0;
  lastScheduledDangerLevel = 'none';
}

// ── Integration Helpers ──────────────────────────────────────────────────────

export function evaluateAndProtectStreak(tasks: PlannerTask[]): StreakDangerAssessment {
  const assessment = assessStreakDanger(tasks);

  // Update AI context with streak danger state
  aiConfigService.setUserContext({
    lastStreakDangerLevel: assessment.dangerLevel,
    streakAtRisk: assessment.streakAtRisk,
    hoursUntilStreakBreak: assessment.hoursRemaining,
  });

  // Schedule or cancel notification
  void scheduleStreakProtectionNotification(assessment);

  return assessment;
}

// ── Message generation for AI Coach ─────────────────────────────────────────

export function generateStreakDangerMessage(
  assessment: Pick<StreakDangerAssessment, 'isInDanger' | 'dangerLevel'> & Partial<Pick<StreakDangerAssessment, 'message' | 'streakAtRisk'>>
): {
  text: string;
  icon: string;
  color: string;
  urgency: 'low' | 'medium' | 'high';
} | null {
  if (!assessment.isInDanger) return null;

  const icons: Record<string, string> = {
    critical: '🔥',
    high: '⚡',
    medium: '🕯️',
    low: '🌙',
  };

  const colors: Record<string, string> = {
    critical: '#dc2626',
    high: '#f59e0b',
    medium: '#8b5cf6',
    low: '#3b82f6',
  };

  let text = assessment.message;
  if (!text && assessment.streakAtRisk != null) {
    const messages: Record<string, string[]> = {
      critical: [
        `Your ${assessment.streakAtRisk}-day flame dims in the final hour. One small act keeps it alive.`,
        `The sands are running out. Your ${assessment.streakAtRisk}-day streak needs you now.`,
        `This is the moment. Your ${assessment.streakAtRisk}-day flame is one task away from extinction.`,
      ],
      high: [
        `Your ${assessment.streakAtRisk}-day streak is flickering. The cosmos has seen you come this far.`,
        `You usually move by now. Your ${assessment.streakAtRisk}-day flame grows impatient.`,
        `A small ember remains from your ${assessment.streakAtRisk}-day fire. Tend to it.`,
      ],
      medium: [
        `The day is waning and your ${assessment.streakAtRisk}-day streak watches quietly.`,
        `Your ${assessment.streakAtRisk}-day flame still burns, but it would like to be fed.`,
        `There is still time to honor your ${assessment.streakAtRisk}-day commitment.`,
      ],
      low: [
        `Your ${assessment.streakAtRisk}-day streak is safe, but the cosmos rewards those who act early.`,
        `You have time, but momentum loves speed.`,
      ],
    };
    const pool = messages[assessment.dangerLevel] || messages.low;
    text = pool[Math.floor(Math.random() * pool.length)];
  }

  return {
    text: text || 'Your streak needs attention.',
    icon: icons[assessment.dangerLevel],
    color: colors[assessment.dangerLevel],
    urgency: assessment.dangerLevel === 'critical' || assessment.dangerLevel === 'high' ? 'high' : 'medium',
  };
}
