// @ts-nocheck
import { describe, it, expect } from 'vitest';
import plannerReducer, {
  addPlannerTask,
  updatePlannerTask,
  removePlannerTask,
  syncPlannerTasks,
  setPlannerPreferences,
  setPlannerStats,
  setPlannerLoading,
  setPlannerError,
  selectPlannerTasksForDay,
  selectUnifiedDayItems,
} from '../src/store/plannerSlice';

function createPlannerState(overrides = {}) {
  return {
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
    ...overrides,
  };
}

const mockTask = (id: string, dayKey: string, overrides = {}) => ({
  id,
  dayKey,
  title: 'Test Task',
  category: 'personal',
  completed: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe('plannerSlice', () => {
  it('adds task to empty day', () => {
    let state = createPlannerState();
    const task = mockTask('t1', '2024-06-15');
    state = plannerReducer(state, addPlannerTask(task));
    expect(state.tasks['2024-06-15']).toHaveLength(1);
    expect(state.tasks['2024-06-15'][0].id).toBe('t1');
  });

  it('adds multiple tasks and sorts by createdAt', () => {
    let state = createPlannerState();
    state = plannerReducer(state, addPlannerTask(mockTask('t1', '2024-06-15', { createdAt: '2024-06-15T10:00:00Z' })));
    state = plannerReducer(state, addPlannerTask(mockTask('t2', '2024-06-15', { createdAt: '2024-06-15T08:00:00Z' })));
    expect(state.tasks['2024-06-15'][0].id).toBe('t2');
    expect(state.tasks['2024-06-15'][1].id).toBe('t1');
  });

  it('adds task to existing day', () => {
    let state = createPlannerState({ tasks: { '2024-06-15': [mockTask('t1', '2024-06-15')] } });
    state = plannerReducer(state, addPlannerTask(mockTask('t2', '2024-06-15')));
    expect(state.tasks['2024-06-15']).toHaveLength(2);
  });

  it('updates task fields', () => {
    let state = createPlannerState({ tasks: { '2024-06-15': [mockTask('t1', '2024-06-15', { title: 'Old' })] } });
    state = plannerReducer(state, updatePlannerTask({ taskId: 't1', dayKey: '2024-06-15', updates: { title: 'New', completed: true } }));
    expect(state.tasks['2024-06-15'][0].title).toBe('New');
    expect(state.tasks['2024-06-15'][0].completed).toBe(true);
  });

  it('ignores update for missing task', () => {
    let state = createPlannerState({ tasks: { '2024-06-15': [mockTask('t1', '2024-06-15')] } });
    state = plannerReducer(state, updatePlannerTask({ taskId: 'missing', dayKey: '2024-06-15', updates: { title: 'New' } }));
    expect(state.tasks['2024-06-15'][0].title).toBe('Test Task');
  });

  it('ignores update for missing day', () => {
    let state = createPlannerState();
    state = plannerReducer(state, updatePlannerTask({ taskId: 't1', dayKey: '2024-06-15', updates: { title: 'New' } }));
    expect(state.tasks['2024-06-15']).toBeUndefined();
  });

  it('removes task and cleans up empty day', () => {
    let state = createPlannerState({ tasks: { '2024-06-15': [mockTask('t1', '2024-06-15')] } });
    state = plannerReducer(state, removePlannerTask({ taskId: 't1', dayKey: '2024-06-15' }));
    expect(state.tasks['2024-06-15']).toBeUndefined();
  });

  it('removes task but keeps day with remaining tasks', () => {
    let state = createPlannerState({ tasks: { '2024-06-15': [mockTask('t1', '2024-06-15'), mockTask('t2', '2024-06-15')] } });
    state = plannerReducer(state, removePlannerTask({ taskId: 't1', dayKey: '2024-06-15' }));
    expect(state.tasks['2024-06-15']).toHaveLength(1);
    expect(state.tasks['2024-06-15'][0].id).toBe('t2');
  });

  it('ignores remove for missing day', () => {
    let state = createPlannerState();
    state = plannerReducer(state, removePlannerTask({ taskId: 't1', dayKey: '2024-06-15' }));
    expect(state.tasks['2024-06-15']).toBeUndefined();
  });

  it('syncs all tasks', () => {
    let state = createPlannerState({ tasks: { 'old': [mockTask('old1', 'old')] } });
    const newTasks = { '2024-06-15': [mockTask('t1', '2024-06-15')] };
    state = plannerReducer(state, syncPlannerTasks(newTasks));
    expect(state.tasks).toEqual(newTasks);
  });

  it('sets preferences partially', () => {
    let state = createPlannerState();
    state = plannerReducer(state, setPlannerPreferences({ dailyBriefingTime: '08:00' }));
    expect(state.preferences.dailyBriefingTime).toBe('08:00');
    expect(state.preferences.defaultReminderMinutes).toBe(10);
  });

  it('sets stats', () => {
    let state = createPlannerState();
    state = plannerReducer(state, setPlannerStats({ currentStreak: 5, longestStreak: 10 }));
    expect(state.stats.currentStreak).toBe(5);
    expect(state.stats.longestStreak).toBe(10);
  });

  it('sets loading', () => {
    let state = createPlannerState();
    state = plannerReducer(state, setPlannerLoading(true));
    expect(state.loading).toBe(true);
  });

  it('sets error', () => {
    let state = createPlannerState();
    state = plannerReducer(state, setPlannerError('Network failed'));
    expect(state.error).toBe('Network failed');
    state = plannerReducer(state, setPlannerError(null));
    expect(state.error).toBeNull();
  });

  it('selector returns empty array for unknown day', () => {
    const state = { planner: createPlannerState() } as any;
    const result = selectPlannerTasksForDay('2024-06-15')(state);
    expect(result).toEqual([]);
  });

  it('selector returns tasks for known day', () => {
    const task = mockTask('t1', '2024-06-15');
    const state = { planner: createPlannerState({ tasks: { '2024-06-15': [task] } }) } as any;
    const result = selectPlannerTasksForDay('2024-06-15')(state);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('t1');
  });
});
