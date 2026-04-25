/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ROUTINE DATA ENGINE
 * Types, defaults, validation, and schedule generation
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { NoteCategory } from '../../types';
import { timeToMinutes, minutesToTime } from './routineUtils';

// ── Core Types ───────────────────────────────────────────────────────────────

export interface LifestyleConstraints {
  wakeTime: string;       // "HH:MM"
  bedtime: string;        // "HH:MM"
  sleepHours: number;
  mealTimes: {
    breakfast: string;    // "HH:MM"
    lunch: string;        // "HH:MM"
    dinner: string;       // "HH:MM"
  };
}

export interface ExistingTask {
  id: string;
  name: string;
  description: string;    // Extra detail about the task
  durationMinutes: number;
  frequency: 'daily' | 'weekly' | 'custom' | 'everyNDays';
  days?: number[];        // 0=Sunday, 6=Saturday (for custom)
  everyNDays?: number;    // Every N days (for everyNDays)
  timePreference: 'morning' | 'afternoon' | 'evening' | 'fixed';
  fixedTime?: string;     // "HH:MM" if timePreference is fixed
  category: NoteCategory;
  priority: 'required' | 'flexible';
  tags: string[];         // User-defined tags for filtering/grouping
}

export interface Goal {
  id: string;
  name: string;
  description: string;    // Extra detail about the goal
  timeframe: 'short' | 'medium' | 'long';
  weeklyMinutes: number;
  priority: 'high' | 'medium' | 'low';
  category: NoteCategory;
  deadline?: string;      // YYYY-MM-DD
  tags: string[];         // User-defined tags
  preferredDays?: number[]; // 0-6, optional days to schedule this goal
  preferredTime?: 'morning' | 'afternoon' | 'evening'; // Optional time preference
}

export interface ScheduleSlot {
  dayOfWeek: number;      // 0-6
  startTime: string;      // "HH:MM"
  endTime: string;        // "HH:MM"
  name: string;
  type: 'task' | 'goal' | 'lifestyle';
  sourceId: string;
  category: NoteCategory;
  tags: string[];         // Inherited from task/goal
}

export interface RoutineFile {
  version: 1;
  routineId: string;      // UUID for grouping/deleting later
  name: string;
  createdAt: string;      // ISO date
  startDate: string;      // YYYY-MM-DD when routine begins
  durationWeeks: number;  // How many weeks to apply (1-208 = ~4 years)
  lifestyle: LifestyleConstraints;
  existingTasks: ExistingTask[];
  goals: Goal[];
  schedule: ScheduleSlot[];
}

// ── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_LIFESTYLE: LifestyleConstraints = {
  wakeTime: '07:00',
  bedtime: '23:00',
  sleepHours: 8,
  mealTimes: {
    breakfast: '08:00',
    lunch: '12:30',
    dinner: '19:00',
  },
};

export const TIME_BANDS = {
  morning: { start: 360, end: 720 },    // 06:00–12:00
  afternoon: { start: 720, end: 1020 }, // 12:00–17:00
  evening: { start: 1020, end: 1260 },  // 17:00–21:00
};

export const GOAL_TIMEFRAME_LABELS: Record<Goal['timeframe'], string> = {
  short: 'Short Term (1–4 weeks)',
  medium: 'Medium Term (1–6 months)',
  long: 'Long Term (6+ months)',
};

// ── Utility Functions ────────────────────────────────────────────────────────

export function generateId(): string {
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function generateRoutineId(): string {
  return `routine_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getTodayISODate(): string {
  return new Date().toISOString().split('T')[0];
}

export function createEmptyRoutine(): RoutineFile {
  return {
    version: 1,
    routineId: generateRoutineId(),
    name: 'My Weekly Routine',
    createdAt: new Date().toISOString(),
    startDate: getTodayISODate(),
    durationWeeks: 52,
    lifestyle: { ...DEFAULT_LIFESTYLE },
    existingTasks: [],
    goals: [],
    schedule: [],
  };
}

// ── Validation ───────────────────────────────────────────────────────────────

export function validateRoutine(routine: RoutineFile): string | null {
  if (!routine.lifestyle.wakeTime || !routine.lifestyle.bedtime) {
    return 'Please set wake and bed times';
  }
  if (routine.existingTasks.length === 0) {
    return 'Add at least one existing task';
  }
  for (const task of routine.existingTasks) {
    if (!task.name.trim()) return 'All tasks need a name';
    if (task.durationMinutes <= 0) return `Task "${task.name}" needs a valid duration`;
    if (task.timePreference === 'fixed' && !task.fixedTime) {
      return `Task "${task.name}" needs a fixed time`;
    }
    if (task.frequency === 'everyNDays' && (!task.everyNDays || task.everyNDays < 1)) {
      return `Task "${task.name}" needs a valid "every N days" value`;
    }
  }
  for (const goal of routine.goals) {
    if (!goal.name.trim()) return 'All goals need a name';
    if (goal.weeklyMinutes <= 0) return `Goal "${goal.name}" needs valid weekly time`;
  }
  if (routine.durationWeeks < 1 || routine.durationWeeks > 208) {
    return 'Duration must be between 1 and 208 weeks (4 years)';
  }
  return null;
}

// ── Schedule Engine ──────────────────────────────────────────────────────────

interface TimeBlock {
  start: number;
  end: number;
  name: string;
  type: ScheduleSlot['type'];
  sourceId: string;
  category: NoteCategory;
  tags: string[];
}

/**
 * Generate a weekly schedule from tasks, goals, and lifestyle constraints.
 * Returns slots sorted by dayOfWeek, then startTime.
 */
export function generateSchedule(
  tasks: ExistingTask[],
  goals: Goal[],
  lifestyle: LifestyleConstraints
): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];

  for (let day = 0; day < 7; day++) {
    const blocks = generateDayBlocks(day, tasks, goals, lifestyle);
    for (const block of blocks) {
      slots.push({
        dayOfWeek: day,
        startTime: minutesToTime(block.start),
        endTime: minutesToTime(block.end),
        name: block.name,
        type: block.type,
        sourceId: block.sourceId,
        category: block.category,
        tags: block.tags,
      });
    }
  }

  return slots;
}

function generateDayBlocks(
  day: number,
  tasks: ExistingTask[],
  goals: Goal[],
  lifestyle: LifestyleConstraints
): TimeBlock[] {
  const blocks: TimeBlock[] = [];

  // 1. Block sleep using wakeTime + sleepHours (slider actually matters now)
  const sleepStart = timeToMinutes(lifestyle.bedtime);
  const sleepEnd = timeToMinutes(lifestyle.wakeTime);
  const sleepWraps = sleepStart >= sleepEnd; // bedtime is at or after wake time = wraps midnight

  if (sleepWraps) {
    // Sleep goes from bedtime to midnight, then midnight to wake time
    blocks.push({ start: sleepStart, end: 1440, name: 'Sleep', type: 'lifestyle', sourceId: 'sleep', category: 'health', tags: [] });
    blocks.push({ start: 0, end: sleepEnd, name: 'Sleep', type: 'lifestyle', sourceId: 'sleep', category: 'health', tags: [] });
  } else {
    // Sleep is a single contiguous block
    blocks.push({ start: sleepStart, end: sleepEnd, name: 'Sleep', type: 'lifestyle', sourceId: 'sleep', category: 'health', tags: [] });
  }

  // Helper: check if a time range overlaps with sleep
  const overlapsSleep = (start: number, end: number): boolean => {
    if (sleepWraps) {
      // Sleep = [sleepStart, 1440] U [0, sleepEnd]
      return (start < sleepEnd && end > 0) || (start < 1440 && end > sleepStart);
    } else {
      // Sleep = [sleepStart, sleepEnd]
      return start < sleepEnd && end > sleepStart;
    }
  };

  // 2. Block meals (30 min each) — only if they don't overlap sleep
  const meals = [
    { time: lifestyle.mealTimes.breakfast, name: 'Breakfast' },
    { time: lifestyle.mealTimes.lunch, name: 'Lunch' },
    { time: lifestyle.mealTimes.dinner, name: 'Dinner' },
  ];
  for (const meal of meals) {
    const m = timeToMinutes(meal.time);
    const mealEnd = m + 30;
    if (!overlapsSleep(m, mealEnd)) {
      blocks.push({ start: m, end: mealEnd, name: meal.name, type: 'lifestyle', sourceId: `meal_${meal.name}`, category: 'health', tags: [] });
    }
  }

  // 3. Collect tasks for this day
  const dayTasks = tasks.filter(t => {
    if (t.frequency === 'daily') return true;
    if (t.frequency === 'weekly') return day === 0; // Place weekly tasks on Sunday by default
    if (t.frequency === 'custom' && t.days) return t.days.includes(day);
    if (t.frequency === 'everyNDays' && t.everyNDays) {
      // Place on day 0 (Sunday) as anchor, then every N days
      return day === 0 || (day % t.everyNDays === 0);
    }
    return false;
  });

  // Sort by priority: required first, then flexible. Within that: fixed first.
  dayTasks.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === 'required' ? -1 : 1;
    if (a.timePreference === 'fixed') return -1;
    if (b.timePreference === 'fixed') return 1;
    return 0;
  });

  // 4. Place tasks
  for (const task of dayTasks) {
    const duration = task.durationMinutes;
    let placed = false;

    if (task.timePreference === 'fixed' && task.fixedTime) {
      const start = timeToMinutes(task.fixedTime);
      const end = start + duration;
      if (canPlace(blocks, start, end)) {
        blocks.push({ start, end, name: task.name, type: 'task', sourceId: task.id, category: task.category, tags: task.tags });
        placed = true;
      }
    }

    if (!placed) {
      // Try preferred time band
      const band = (task.timePreference === 'fixed'
        ? TIME_BANDS.morning
        : TIME_BANDS[task.timePreference]) || TIME_BANDS.morning;
      for (let t = band.start; t <= band.end - duration; t += 15) {
        if (canPlace(blocks, t, t + duration)) {
          blocks.push({ start: t, end: t + duration, name: task.name, type: 'task', sourceId: task.id, category: task.category, tags: task.tags });
          placed = true;
          break;
        }
      }
    }

    if (!placed) {
      // Fallback: anywhere that fits
      for (let t = sleepEnd; t <= 1440 - duration; t += 15) {
        if (canPlace(blocks, t, t + duration)) {
          blocks.push({ start: t, end: t + duration, name: task.name, type: 'task', sourceId: task.id, category: task.category, tags: task.tags });
          placed = true;
          break;
        }
      }
    }
  }

  // 5. Allocate goal time
  // Sort goals by priority (high → medium → low)
  const sortedGoals = [...goals].sort((a, b) => {
    const pMap = { high: 3, medium: 2, low: 1 };
    return pMap[b.priority] - pMap[a.priority];
  });

  for (const goal of sortedGoals) {
    // Skip if goal has preferredDays and today isn't one of them
    if (goal.preferredDays && goal.preferredDays.length > 0 && !goal.preferredDays.includes(day)) {
      continue;
    }

    const dailyMinutes = Math.ceil(goal.weeklyMinutes / 7);
    if (dailyMinutes <= 0) continue;

    // Try to place in preferred bands based on category or explicit preference
    let startBand = TIME_BANDS.morning.start;
    const pref = goal.preferredTime;
    if (pref === 'morning') startBand = TIME_BANDS.morning.start;
    else if (pref === 'afternoon') startBand = TIME_BANDS.afternoon.start;
    else if (pref === 'evening') startBand = TIME_BANDS.evening.start;
    else if (goal.category === 'work') startBand = TIME_BANDS.morning.start;
    else if (goal.category === 'creative') startBand = TIME_BANDS.afternoon.start;
    else if (goal.category === 'spiritual') startBand = TIME_BANDS.morning.start;
    else if (goal.category === 'health') startBand = TIME_BANDS.evening.start;

    const placed = tryPlaceGoal(blocks, startBand, dailyMinutes, goal);
    if (!placed) {
      // Try any available slot
      tryPlaceGoal(blocks, sleepEnd, dailyMinutes, goal);
    }
  }

  // Sort blocks by start time and merge duplicates
  blocks.sort((a, b) => a.start - b.start);

  // Remove duplicate sleep blocks (the two halves)
  return blocks.filter((b, i, arr) => {
    if (i === 0) return true;
    const prev = arr[i - 1];
    return !(b.sourceId === prev.sourceId && b.name === prev.name && b.start === prev.end);
  });
}

function canPlace(existing: TimeBlock[], start: number, end: number): boolean {
  // Check if [start, end] overlaps with any existing block
  for (const block of existing) {
    if (start < block.end && end > block.start) {
      return false;
    }
  }
  return true;
}

function tryPlaceGoal(
  existing: TimeBlock[],
  startFrom: number,
  duration: number,
  goal: Goal
): boolean {
  for (let t = startFrom; t <= 1440 - duration; t += 15) {
    if (canPlace(existing, t, t + duration)) {
      existing.push({
        start: t,
        end: t + duration,
        name: goal.name,
        type: 'goal',
        sourceId: goal.id,
        category: goal.category,
        tags: goal.tags,
      });
      return true;
    }
  }
  return false;
}

// ── File Export / Import ─────────────────────────────────────────────────────

export function exportRoutineToJSON(routine: RoutineFile): string {
  return JSON.stringify(routine, null, 2);
}

export function downloadRoutineFile(routine: RoutineFile): void {
  const json = exportRoutineToJSON(routine);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${routine.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.hekaroutine.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseRoutineFile(json: string): RoutineFile | null {
  try {
    const parsed = JSON.parse(json);
    if (parsed.version !== 1) return null;
    if (!parsed.lifestyle || !parsed.existingTasks || !parsed.goals) return null;
    // Backward compat: fill in new fields if missing
    if (!parsed.routineId) parsed.routineId = generateRoutineId();
    if (!parsed.startDate) parsed.startDate = getTodayISODate();
    if (!parsed.durationWeeks) parsed.durationWeeks = 52;
    for (const t of parsed.existingTasks) {
      if (!t.tags) t.tags = [];
      if (t.description === undefined) t.description = '';
    }
    for (const g of parsed.goals) {
      if (!g.tags) g.tags = [];
      if (g.description === undefined) g.description = '';
    }
    return parsed as RoutineFile;
  } catch {
    return null;
  }
}

// ── Schedule Summary Stats ───────────────────────────────────────────────────

export function getRoutineStats(routine: RoutineFile): {
  totalTaskHours: number;
  totalGoalHours: number;
  totalCommittedHours: number;
  availableHours: number;
  isOvercommitted: boolean;
} {
  // Use the sleepHours slider as the source of truth for available time
  const sleepMinsPerDay = routine.lifestyle.sleepHours * 60;
  const awakeMinsPerDay = 1440 - sleepMinsPerDay;
  const availableHours = (awakeMinsPerDay * 7) / 60;

  const totalTaskHours = routine.existingTasks.reduce((sum, t) => {
    let freq = 1;
    if (t.frequency === 'daily') freq = 7;
    else if (t.frequency === 'weekly') freq = 1;
    else if (t.frequency === 'custom') freq = t.days?.length || 1;
    else if (t.frequency === 'everyNDays' && t.everyNDays) freq = Math.ceil(7 / t.everyNDays);
    return sum + (t.durationMinutes * freq) / 60;
  }, 0);

  const totalGoalHours = routine.goals.reduce((sum, g) => sum + g.weeklyMinutes / 60, 0);
  const totalCommittedHours = totalTaskHours + totalGoalHours;

  return {
    totalTaskHours: Math.round(totalTaskHours * 10) / 10,
    totalGoalHours: Math.round(totalGoalHours * 10) / 10,
    totalCommittedHours: Math.round(totalCommittedHours * 10) / 10,
    availableHours: Math.round(availableHours * 10) / 10,
    isOvercommitted: totalCommittedHours > availableHours,
  };
}
