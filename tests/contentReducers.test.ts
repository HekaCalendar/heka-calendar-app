// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import {
  addNote,
  updateNote,
  deleteNote,
  deleteDuplicates,
  loadNotes,
  moveNote,
  updateStatistics,
  resetStatistics,
  setCommunityHolidays,
  addCommunityHoliday,
  updateCommunityHoliday,
  voteForHoliday,
  setCommunityFeatures,
  addCommunityFeature,
  updateCommunityFeature,
  voteForFeature,
  addInvite,
  respondToInvite,
  subscribeToCalendar,
  unsubscribeFromCalendar,
} from '../src/store/slices/reducers/contentReducers';

vi.mock('../src/services/calendarService', () => ({
  getTodayHekaDate: vi.fn(() => ({ year: 2024, month: 5, day: 15 })),
  getTodayHekaDateInTimezone: vi.fn((tz) => ({ year: 2024, month: 5, day: 15 })),
}));

function createContentState(overrides = {}) {
  return {
    notes: {},
    statistics: {
      totalNotes: 0,
      notesByCategory: { personal: 0, work: 0, spiritual: 0, family: 0, health: 0, creative: 0, general: 0 },
      notesByMonth: {},
      currentStreak: 0,
      longestStreak: 0,
      moodAverage: 0,
      moodEntryCount: 0,
      moodEntriesByMonth: {},
      moodByMonth: {},
      mostActiveMonth: { month: '', count: 0 },
      totalWords: 0,
      lastNoteDate: undefined,
    },
    communityHolidays: [],
    communityFeatures: [],
    pendingInvites: [],
    subscribedCalendars: [],
    ...overrides,
  };
}

describe('contentReducers', () => {
  describe('notes CRUD', () => {
    it('addNote creates new day and note', () => {
      const state = createContentState();
      addNote(state, { payload: { key: '2024-06-15', content: 'Hello world', category: 'personal', mood: 4 }, meta: { timestamp: 1718400000000 } });
      expect(state.notes['2024-06-15']).toHaveLength(1);
      expect(state.notes['2024-06-15'][0].content).toBe('Hello world');
      expect(state.statistics.totalNotes).toBe(1);
    });

    it('addNote appends to existing day', () => {
      const state = createContentState({
        notes: { '2024-06-15': [{ id: 'old', content: 'First', category: 'general', createdAt: '2024-06-15T00:00:00Z' }] },
      });
      addNote(state, { payload: { key: '2024-06-15', content: 'Second', category: 'work' }, meta: { timestamp: 1718400000000 } });
      expect(state.notes['2024-06-15']).toHaveLength(2);
    });

    it('addNote with mood updates mood stats', () => {
      const state = createContentState();
      addNote(state, { payload: { key: '2024-06-15', content: 'Good day', mood: 5 }, meta: { timestamp: 1718400000000 } });
      expect(state.statistics.moodAverage).toBe(5);
      expect(state.statistics.moodEntryCount).toBe(1);
    });

    it('addNote computes streak for consecutive days', () => {
      const state = createContentState({
        statistics: { totalNotes: 1, currentStreak: 1, longestStreak: 1, lastNoteDate: '2024-06-14T00:00:00.000Z', notesByCategory: {}, notesByMonth: {}, moodAverage: 0, moodEntryCount: 0, moodEntriesByMonth: {}, moodByMonth: {}, mostActiveMonth: { month: '', count: 0 }, totalWords: 0 },
      });
      addNote(state, { payload: { key: '2024-06-15', content: 'Day 2' }, meta: { timestamp: new Date('2024-06-15').getTime() } });
      expect(state.statistics.currentStreak).toBe(2);
      expect(state.statistics.longestStreak).toBe(2);
    });

    it('addNote resets streak after gap', () => {
      const state = createContentState({
        statistics: { totalNotes: 1, currentStreak: 5, longestStreak: 5, lastNoteDate: '2024-06-10T00:00:00.000Z', notesByCategory: {}, notesByMonth: {}, moodAverage: 0, moodEntryCount: 0, moodEntriesByMonth: {}, moodByMonth: {}, mostActiveMonth: { month: '', count: 0 }, totalWords: 0 },
      });
      addNote(state, { payload: { key: '2024-06-15', content: 'After gap' }, meta: { timestamp: new Date('2024-06-15').getTime() } });
      expect(state.statistics.currentStreak).toBe(1);
      expect(state.statistics.longestStreak).toBe(5);
    });

    it('updateNote updates content and category', () => {
      const state = createContentState({
        notes: { '2024-06-15': [{ id: 'n1', content: 'Old', category: 'general', createdAt: '2024-06-15T00:00:00Z', updatedAt: '2024-06-15T00:00:00Z' }] },
      });
      updateNote(state, { payload: { dayKey: '2024-06-15', noteId: 'n1', updates: { content: 'New', category: 'work' } }, meta: { timestamp: 1718400000000 } });
      expect(state.notes['2024-06-15'][0].content).toBe('New');
      expect(state.notes['2024-06-15'][0].category).toBe('work');
    });

    it('deleteNote removes note and cleans up empty day', () => {
      const state = createContentState({
        notes: { '2024-06-15': [{ id: 'n1', content: 'Only', category: 'general', createdAt: '2024-06-15T00:00:00Z' }] },
      });
      deleteNote(state, { payload: { dayKey: '2024-06-15', noteId: 'n1' } });
      expect(state.notes['2024-06-15']).toBeUndefined();
    });

    it('moveNote transfers note between days', () => {
      const state = createContentState({
        notes: {
          '2024-06-14': [{ id: 'n1', content: 'Note', category: 'general', createdAt: '2024-06-14T00:00:00Z' }],
        },
      });
      moveNote(state, { payload: { fromKey: '2024-06-14', toKey: '2024-06-15', noteId: 'n1' }, meta: { timestamp: 1718400000000 } });
      expect(state.notes['2024-06-14']).toBeUndefined();
      expect(state.notes['2024-06-15']).toHaveLength(1);
      expect(state.notes['2024-06-15'][0].id).toBe('n1');
    });

    it('loadNotes replaces all notes and recomputes stats', () => {
      const state = createContentState();
      loadNotes(state, { payload: { '2024-06-15': [{ id: 'n1', content: 'Test', category: 'general', createdAt: '2024-06-15T00:00:00Z' }] } });
      expect(state.notes['2024-06-15']).toHaveLength(1);
      expect(state.statistics.totalNotes).toBe(1);
    });

    it('deleteDuplicates removes notes by duplicatedFrom', () => {
      const state = createContentState({
        notes: {
          '2024-06-15': [
            { id: 'n1', content: 'Original', category: 'general', createdAt: '2024-06-15T00:00:00Z' },
            { id: 'n2', content: 'Dup', category: 'general', createdAt: '2024-06-15T00:00:00Z', duplicatedFrom: 'n1' },
          ],
        },
      });
      deleteDuplicates(state, { payload: { sourceNoteId: 'n1' } });
      expect(state.notes['2024-06-15']).toHaveLength(1);
      expect(state.notes['2024-06-15'][0].id).toBe('n1');
    });

    it('updateStatistics merges partial stats', () => {
      const state = createContentState();
      updateStatistics(state, { payload: { totalNotes: 10, currentStreak: 3 } });
      expect(state.statistics.totalNotes).toBe(10);
      expect(state.statistics.currentStreak).toBe(3);
    });

    it('resetStatistics clears all stats', () => {
      const state = createContentState({ statistics: { totalNotes: 50, currentStreak: 10, longestStreak: 20, totalWords: 5000, notesByCategory: { personal: 5 }, notesByMonth: { '2024-06': 5 }, moodAverage: 4, moodEntryCount: 5, moodEntriesByMonth: {}, moodByMonth: {}, mostActiveMonth: { month: '2024-06', count: 5 } } });
      resetStatistics(state);
      expect(state.statistics.totalNotes).toBe(0);
      expect(state.statistics.currentStreak).toBe(0);
      expect(state.statistics.totalWords).toBe(0);
      expect(state.statistics.notesByCategory.personal).toBe(0);
    });
  });

  describe('community', () => {
    it('setCommunityHolidays replaces holidays', () => {
      const state = createContentState();
      setCommunityHolidays(state, { payload: [{ id: 'h1', name: 'Holiday', votesUp: 0 }] });
      expect(state.communityHolidays).toHaveLength(1);
    });

    it('addCommunityHoliday adds if not exists', () => {
      const state = createContentState();
      addCommunityHoliday(state, { payload: { id: 'h1', name: 'Holiday', votesUp: 0 } });
      expect(state.communityHolidays).toHaveLength(1);
      addCommunityHoliday(state, { payload: { id: 'h1', name: 'Holiday', votesUp: 0 } });
      expect(state.communityHolidays).toHaveLength(1);
    });

    it('updateCommunityHoliday updates by id', () => {
      const state = createContentState({ communityHolidays: [{ id: 'h1', name: 'Old', votesUp: 0 }] });
      updateCommunityHoliday(state, { payload: { id: 'h1', name: 'New', votesUp: 0 } });
      expect(state.communityHolidays[0].name).toBe('New');
    });

    it('voteForHoliday increments votes', () => {
      const state = createContentState({ communityHolidays: [{ id: 'h1', name: 'Holiday', votesUp: 5 }] });
      voteForHoliday(state, { payload: 'h1' });
      expect(state.communityHolidays[0].votesUp).toBe(6);
    });

    it('addCommunityFeature adds if not exists', () => {
      const state = createContentState();
      addCommunityFeature(state, { payload: { id: 'f1', name: 'Feature', votes: 0 } });
      expect(state.communityFeatures).toHaveLength(1);
      addCommunityFeature(state, { payload: { id: 'f1', name: 'Feature', votes: 0 } });
      expect(state.communityFeatures).toHaveLength(1);
    });

    it('voteForFeature increments votes', () => {
      const state = createContentState({ communityFeatures: [{ id: 'f1', name: 'Feature', votes: 3 }] });
      voteForFeature(state, { payload: 'f1' });
      expect(state.communityFeatures[0].votes).toBe(4);
    });

    it('addInvite adds pending invite', () => {
      const state = createContentState();
      addInvite(state, { payload: { id: 'i1', from: 'user1', status: 'pending' } });
      expect(state.pendingInvites).toHaveLength(1);
    });

    it('respondToInvite updates status', () => {
      const state = createContentState({ pendingInvites: [{ id: 'i1', from: 'user1', status: 'pending' }] });
      respondToInvite(state, { payload: { inviteId: 'i1', accept: true } });
      expect(state.pendingInvites[0].status).toBe('accepted');
      respondToInvite(state, { payload: { inviteId: 'i1', accept: false } });
      expect(state.pendingInvites[0].status).toBe('declined');
    });

    it('subscribeToCalendar adds calendar', () => {
      const state = createContentState();
      subscribeToCalendar(state, { payload: 'cal-1' });
      expect(state.subscribedCalendars).toContain('cal-1');
      subscribeToCalendar(state, { payload: 'cal-1' });
      expect(state.subscribedCalendars).toHaveLength(1);
    });

    it('unsubscribeFromCalendar removes calendar', () => {
      const state = createContentState({ subscribedCalendars: ['cal-1', 'cal-2'] });
      unsubscribeFromCalendar(state, { payload: 'cal-1' });
      expect(state.subscribedCalendars).toEqual(['cal-2']);
    });
  });
});
