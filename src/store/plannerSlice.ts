/**
 * Planner Slice - Redux state for AI-powered celestial tasks
 */

import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { PlannerTask, PlannerPreferences, PlannerStats } from '../types';
import type { RootState } from './index';

// ============================================================================
// Types
// ============================================================================

export interface PlannerState {
  tasks: Record<string, PlannerTask[]>; // keyed by dayKey
  preferences: PlannerPreferences;
  stats: PlannerStats;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: PlannerState = {
  tasks: {},
  preferences: {
    defaultReminderMinutes: 10,
    dailyBriefingTime: '07:00',
    enableTaskNotifications: true,
    enableAlarmMode: false,
  },
  stats: {
    currentStreak: 0,
    longestStreak: 0,
    completionsByCategory: {
      personal: 0, work: 0, spiritual: 0, family: 0, health: 0, creative: 0, general: 0,
    },
    preferredTaskTime: 'unknown',
  },
  loading: false,
  error: null,
};

// ============================================================================
// Slice
// ============================================================================

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    // Full sync from Firestore listener
    syncPlannerTasks: (state, action: PayloadAction<Record<string, PlannerTask[]>>) => {
      state.tasks = action.payload;
    },

    // Single task updates (optimistic or listener-driven)
    addPlannerTask: (state, action: PayloadAction<PlannerTask>) => {
      const { dayKey } = action.payload;
      console.log('[plannerSlice/addPlannerTask] Adding task to dayKey:', dayKey, 'task.id:', action.payload.id);
      if (!state.tasks[dayKey]) {
        state.tasks[dayKey] = [];
      }
      state.tasks[dayKey].push(action.payload);
      // Sort by createdAt ascending
      state.tasks[dayKey].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      console.log('[plannerSlice/addPlannerTask] dayKey now has', state.tasks[dayKey].length, 'items');
    },

    updatePlannerTask: (state, action: PayloadAction<{ taskId: string; dayKey: string; updates: Partial<PlannerTask> }>) => {
      const { taskId, dayKey, updates } = action.payload;
      const dayTasks = state.tasks[dayKey];
      if (!dayTasks) return;
      const task = dayTasks.find((t) => t.id === taskId);
      if (task) {
        Object.assign(task, updates, { updatedAt: new Date().toISOString() });
      }
    },

    removePlannerTask: (state, action: PayloadAction<{ taskId: string; dayKey: string }>) => {
      const { taskId, dayKey } = action.payload;
      if (state.tasks[dayKey]) {
        state.tasks[dayKey] = state.tasks[dayKey].filter((t) => t.id !== taskId);
        if (state.tasks[dayKey].length === 0) {
          delete state.tasks[dayKey];
        }
      }
    },

    setPlannerPreferences: (state, action: PayloadAction<Partial<PlannerPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    setPlannerStats: (state, action: PayloadAction<Partial<PlannerStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },

    setPlannerLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setPlannerError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// ============================================================================
// Actions
// ============================================================================

export const {
  syncPlannerTasks,
  addPlannerTask,
  updatePlannerTask,
  removePlannerTask,
  setPlannerPreferences,
  setPlannerStats,
  setPlannerLoading,
  setPlannerError,
} = plannerSlice.actions;

// ============================================================================
// Selectors
// ============================================================================

export const selectPlanner = (state: RootState) => state.planner;

export const selectPlannerTasks = (state: RootState) => state.planner.tasks;

export const selectPlannerTasksForDay = (dayKey: string) =>
  createSelector([selectPlannerTasks], (tasks) => tasks[dayKey] || []);

// Unified selector: merges calendar notes with planner tasks for a given day
export const selectUnifiedDayItems = (dayKey: string) =>
  createSelector(
    [(state: RootState) => state.calendar.notes[dayKey] || [], selectPlannerTasks],
    (notes, tasks) => {
      const dayTasks = tasks[dayKey] || [];
      const result = [...notes, ...dayTasks].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      console.log('[selectUnifiedDayItems] dayKey:', dayKey, 'notes:', notes.length, 'tasks:', dayTasks.length, 'total:', result.length);
      return result;
    }
  );

export const selectPlannerPreferences = (state: RootState) => state.planner.preferences;

export const selectPlannerStats = (state: RootState) => state.planner.stats;

export default plannerSlice.reducer;
