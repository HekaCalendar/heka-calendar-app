/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELEBRATION & MILESTONE NOTIFICATIONS
 * Sends delightful, emotionally resonant notifications for streaks, celestial
 * events, and personal records. These are the moments that create attachment.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NotificationEngine } from './notificationEngine';
import { store } from '../store';

const CELEBRATION_ID_BASE = 700000;

// ── Milestone Definitions ────────────────────────────────────────────────────

interface Milestone {
  days: number;
  tier: 'standard' | 'ambient';
  titleTemplate: string;
  bodyTemplates: string[];
}

const STREAK_MILESTONES: Milestone[] = [
  { days: 3, tier: 'standard', titleTemplate: 'A Spark Ignites ✦', bodyTemplates: [
    'Three days in a row. The cosmos has noticed your devotion.',
    'Three days. The thread is becoming a rope. Keep weaving.',
    'A triad of dedication. The stars mark your name.',
  ]},
  { days: 7, tier: 'standard', titleTemplate: 'One Full Week 🔥', bodyTemplates: [
    'Seven days. A complete cycle. The moon has turned once in your honor.',
    'A week of starlight. You are building something real.',
    'Seven days without breaking. The celestial sphere applauds.',
  ]},
  { days: 14, tier: 'standard', titleTemplate: 'Fortnight of Fire ✦✦', bodyTemplates: [
    'Two weeks. The flame is no longer flickering — it is burning.',
    'Fourteen days. You are becoming unstoppable.',
    'A fortnight of devotion. Rare and beautiful.',
  ]},
  { days: 21, tier: 'standard', titleTemplate: 'Three Weeks Deep ✦✦✦', bodyTemplates: [
    'Three weeks. This is no longer chance — it is craft.',
    'Twenty-one days. A new pattern has formed in the constellation of your habits.',
    'The cosmos whispers: you are becoming who you intended to be.',
  ]},
  { days: 30, tier: 'standard', titleTemplate: 'A Lunar Month ✦✦✦✦', bodyTemplates: [
    'One full lunar cycle. The moon has watched you every night.',
    'Thirty days. A lunar month of devotion. The stars lean closer.',
    'You have outlasted the moon itself. This is dedication.',
  ]},
  { days: 60, tier: 'standard', titleTemplate: 'Two Moons Pass ✦✦✦✦✦', bodyTemplates: [
    'Sixty days. Two complete lunar cycles. You are not a beginner anymore.',
    'The cosmos has begun to rely on your presence.',
  ]},
  { days: 90, tier: 'standard', titleTemplate: 'A Season of Stars ✦✦✦✦✦✦', bodyTemplates: [
    'Ninety days. A season has turned while you kept your promise.',
    'Three months. The celestial mechanics have noticed your rhythm.',
  ]},
  { days: 180, tier: 'standard', titleTemplate: 'Half a Year of Light ✦✦✦✦✦✦✦', bodyTemplates: [
    'One hundred eighty days. Half a year of starlight.',
    'The solstice has come and gone, and you are still here.',
  ]},
  { days: 365, tier: 'standard', titleTemplate: 'A Year of Celestial Devotion ✦✦✦✦✦✦✦✦', bodyTemplates: [
    'Three hundred sixty-five days. A full orbit around the sun.',
    'The stars have completed a full dance, and you danced with them.',
    'One year. You are no longer observing the cosmos — you are part of it.',
  ]},
];

const CELESTIAL_MILESTONES = [
  { count: 1, type: 'new-moon', title: 'First New Moon Observed', body: 'You have witnessed your first new moon with HEKA. Many more await.' },
  { count: 3, type: 'new-moon', title: 'Triple New Moon', body: 'Three new moons. You are learning the rhythm of darkness and renewal.' },
  { count: 12, type: 'new-moon', title: 'A Year of New Moons', body: 'Twelve new moons. You have seen the full cycle of beginnings.' },
  { count: 1, type: 'full-moon', title: 'First Full Moon Observed', body: 'Your first full moon. The silver light has found you.' },
  { count: 3, type: 'full-moon', title: 'Triple Full Moon', body: 'Three full moons. You understand the language of illumination.' },
  { count: 12, type: 'full-moon', title: 'A Year of Full Moons', body: 'Twelve full moons. You have danced in the light of every season.' },
  { count: 1, type: 'solstice', title: 'First Solstice Observed', body: 'You have witnessed the turning of the sun. The wheel turns with you.' },
  { count: 4, type: 'solstice', title: 'A Full Year of Solstices', body: 'Four solstices. You have seen the sun at its highest and lowest.' },
  { count: 1, type: 'retrograde', title: 'First Retrograde Observed', body: 'Mercury retrograde no longer surprises you. You anticipate.' },
  { count: 3, type: 'retrograde', title: 'Retrograde Veteran', body: 'Three retrogrades observed. You know when to pause and when to proceed.' },
];

// ── State Storage ────────────────────────────────────────────────────────────

const CELEBRATION_STORAGE_KEY = 'heka-celebration-state';

interface CelebrationState {
  streakMilestonesSent: Record<string, boolean>; // "30" -> true
  celestialMilestonesSent: Record<string, boolean>; // "new-moon:3" -> true
  personalRecords: {
    longestStreak: number;
    totalJournalEntries: number;
    totalTasksCompleted: number;
    totalCelestialEventsObserved: number;
  };
}

function loadState(): CelebrationState {
  try {
    const raw = localStorage.getItem(CELEBRATION_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('[Celebrations] Failed to load state:', e);
  }
  return {
    streakMilestonesSent: {},
    celestialMilestonesSent: {},
    personalRecords: {
      longestStreak: 0,
      totalJournalEntries: 0,
      totalTasksCompleted: 0,
      totalCelestialEventsObserved: 0,
    },
  };
}

function saveState(state: CelebrationState): void {
  try {
    localStorage.setItem(CELEBRATION_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[Celebrations] Failed to save state:', e);
  }
}

// ── Core Functions ───────────────────────────────────────────────────────────

/**
 * Check and send streak milestone celebration if applicable.
 * Call this when a streak is updated (after task completion or journal entry).
 */
export async function checkStreakMilestone(streak: number): Promise<void> {
  const state = loadState();

  // Update personal record
  if (streak > state.personalRecords.longestStreak) {
    state.personalRecords.longestStreak = streak;
    saveState(state);
  }

  // Find matching milestone
  const milestone = STREAK_MILESTONES.find(m => m.days === streak);
  if (!milestone) return;

  // Check if already sent
  const key = String(streak);
  if (state.streakMilestonesSent[key]) return;

  // Pick a body template (seeded by streak count)
  const bodyIndex = streak % milestone.bodyTemplates.length;
  const body = milestone.bodyTemplates[bodyIndex];

  // Schedule celebration notification
  const now = new Date();
  const scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 30, 0);
  if (scheduleTime <= now) {
    scheduleTime.setDate(scheduleTime.getDate() + 1);
  }

  await NotificationEngine.schedule({
    type: 'streak-milestone',
    tier: milestone.tier,
    title: milestone.titleTemplate,
    body,
    scheduleAt: scheduleTime,
    section: 'planner',
    id: CELEBRATION_ID_BASE + streak,
    extra: { milestone: streak, type: 'streak' },
  });

  state.streakMilestonesSent[key] = true;
  saveState(state);

  console.log(`[Celebrations] Streak milestone ${streak} scheduled for ${scheduleTime}`);
}

/**
 * Check and send celestial event milestone celebration.
 * Call this when user observes a celestial event (opens stars view during event).
 */
export async function checkCelestialMilestone(eventType: string, eventCount: number): Promise<void> {
  const state = loadState();

  // Update personal record
  state.personalRecords.totalCelestialEventsObserved++;
  saveState(state);

  // Find matching milestone
  const milestone = CELESTIAL_MILESTONES.find(
    m => m.type === eventType && m.count === eventCount
  );
  if (!milestone) return;

  // Check if already sent
  const key = `${eventType}:${eventCount}`;
  if (state.celestialMilestonesSent[key]) return;

  // Schedule celebration notification
  const now = new Date();
  const scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 30, 0);
  if (scheduleTime <= now) {
    scheduleTime.setDate(scheduleTime.getDate() + 1);
  }

  await NotificationEngine.schedule({
    type: 'celestial-milestone',
    tier: 'ambient',
    title: milestone.title,
    body: milestone.body,
    scheduleAt: scheduleTime,
    section: 'stars',
    id: CELEBRATION_ID_BASE + 10000 + eventCount,
    extra: { milestone: eventCount, eventType, type: 'celestial' },
  });

  state.celestialMilestonesSent[key] = true;
  saveState(state);

  console.log(`[Celebrations] Celestial milestone ${eventType}:${eventCount} scheduled`);
}

/**
 * Check and send personal record celebration.
 * Call this periodically (e.g., weekly) to celebrate personal bests.
 */
export async function checkPersonalRecords(): Promise<void> {
  const state = loadState();
  const currentStreak = (store.getState() as any).planner?.streak || 0;

  // If current streak is at a new personal best (and > 7 days)
  if (currentStreak > state.personalRecords.longestStreak && currentStreak > 7) {
    state.personalRecords.longestStreak = currentStreak;
    saveState(state);

    const now = new Date();
    const scheduleTime = new Date(now.getTime() + 60000); // 1 min from now

    await NotificationEngine.schedule({
      type: 'personal-record',
      tier: 'standard',
      title: 'New Personal Record ✦',
      body: `Your longest streak ever: ${currentStreak} days. The cosmos has never seen you this consistent.`,
      scheduleAt: scheduleTime,
      section: 'planner',
      id: CELEBRATION_ID_BASE + 50000,
      extra: { record: 'longestStreak', value: currentStreak },
    });
  }
}

/**
 * Send a "welcome back" celebration after user returns from absence.
 */
export async function sendWelcomeBack(daysAbsent: number): Promise<void> {
  if (daysAbsent < 3) return;

  const now = new Date();
  const scheduleTime = new Date(now.getTime() + 30000); // 30 sec

  const body = daysAbsent < 7
    ? `You were gone ${daysAbsent} days. The stars kept turning. Welcome back.`
    : daysAbsent < 30
    ? `You were away ${daysAbsent} days. The cosmos waited. Welcome back to your practice.`
    : `You were gone ${daysAbsent} days. The stars did not forget you. Neither did we. Welcome back.`;

  await NotificationEngine.schedule({
    type: 'welcome-back',
    tier: 'standard',
    title: 'Welcome Back ✦',
    body,
    scheduleAt: scheduleTime,
    section: 'planner',
    id: CELEBRATION_ID_BASE + 60000,
    extra: { daysAbsent },
  });
}
