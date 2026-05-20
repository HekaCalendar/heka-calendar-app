import { describe, it, expect } from 'vitest';
import diaryReducer, {
  selectDiaryDate,
  startEditingEntry,
  cancelEditingEntry,
  updateJournalPreferences,
  setJournalTheme,
  setJournalFont,
  setFontSize,
  toggleInsights,
  setInsightThreshold,
  rateInsight,
  dismissInsight,
  setViewMode,
  setSearchQuery,
  loadPersistedDiary,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  clearAllDiaryEntries,
  syncDiaryFromCloud,
  retrySyncQueue,
  initDiary,
  selectEntriesByDate,
  selectAllEntries,
  selectEntryById,
  selectJournalPreferences,
  selectHasInsightForDate,
  selectSearchResults,
} from '../src/store/diarySlice';
import type { DiaryEntry, DiaryState } from '../src/oracle/diaryTypes';

function mockEntry(overrides: Partial<DiaryEntry> = {}): DiaryEntry {
  return {
    id: 'e1',
    date: '2024-06-15',
    timestamp: '2024-06-15T10:00:00Z',
    content: 'Test entry content',
    tags: [],
    isMarkdown: false,
    detectedThemes: [],
    celestialContext: {
      capturedAt: '2024-06-15T10:00:00Z',
      moonPhase: { phase: 'full', sign: 'libra', illumination: 100, isVoid: false },
      activeEvents: [],
      planetPositions: {},
    },
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
    ...overrides,
  };
}

function createDiaryState(overrides: Partial<DiaryState> = {}): DiaryState {
  return {
    entries: {},
    entriesByDate: {},
    selectedDate: '2024-06-15',
    editingEntryId: null,
    preferences: {
      theme: 'default',
      font: 'system',
      fontSize: 16,
      showInsights: true,
      insightThreshold: 0.7,
      defaultView: 'calendar',
      ratedInsights: {},
      dismissedPatterns: [],
    },
    ui: {
      isLoading: false,
      isSyncing: false,
      lastSyncAt: null,
      searchQuery: '',
      viewMode: 'calendar',
    },
    ...overrides,
  };
}

function createMockRootState(diaryOverrides: Partial<DiaryState> = {}) {
  return {
    calendar: {} as any,
    diary: createDiaryState(diaryOverrides),
    astrology: {} as any,
    tutorial: {} as any,
    friends: {} as any,
    planner: {} as any,
    setup: {} as any,
  };
}

describe('diarySlice', () => {
  describe('synchronous reducers', () => {
    it('selectDiaryDate sets date and clears editing', () => {
      let state = createDiaryState({ editingEntryId: 'e1' });
      state = diaryReducer(state, selectDiaryDate('2024-06-20'));
      expect(state.selectedDate).toBe('2024-06-20');
      expect(state.editingEntryId).toBeNull();
    });

    it('startEditingEntry sets editing id', () => {
      let state = createDiaryState();
      state = diaryReducer(state, startEditingEntry('e1'));
      expect(state.editingEntryId).toBe('e1');
    });

    it('cancelEditingEntry clears editing id', () => {
      let state = createDiaryState({ editingEntryId: 'e1' });
      state = diaryReducer(state, cancelEditingEntry());
      expect(state.editingEntryId).toBeNull();
    });

    it('updateJournalPreferences merges partial preferences', () => {
      let state = createDiaryState();
      state = diaryReducer(state, updateJournalPreferences({ fontSize: 20, showInsights: false }));
      expect(state.preferences.fontSize).toBe(20);
      expect(state.preferences.showInsights).toBe(false);
      expect(state.preferences.theme).toBe('default');
    });

    it('setJournalTheme changes theme', () => {
      let state = createDiaryState();
      state = diaryReducer(state, setJournalTheme('dark'));
      expect(state.preferences.theme).toBe('dark');
    });

    it('setJournalFont changes font', () => {
      let state = createDiaryState();
      state = diaryReducer(state, setJournalFont('serif'));
      expect(state.preferences.font).toBe('serif');
    });

    it('setFontSize changes font size', () => {
      let state = createDiaryState();
      state = diaryReducer(state, setFontSize(18));
      expect(state.preferences.fontSize).toBe(18);
    });

    it('toggleInsights flips showInsights', () => {
      let state = createDiaryState({ preferences: { ...createDiaryState().preferences, showInsights: true } });
      state = diaryReducer(state, toggleInsights());
      expect(state.preferences.showInsights).toBe(false);
      state = diaryReducer(state, toggleInsights());
      expect(state.preferences.showInsights).toBe(true);
    });

    it('setInsightThreshold changes threshold', () => {
      let state = createDiaryState();
      state = diaryReducer(state, setInsightThreshold(0.9));
      expect(state.preferences.insightThreshold).toBe(0.9);
    });

    it('rateInsight sets user rating on entry and preferences', () => {
      const entry = mockEntry({ id: 'e1', insight: { id: 'i1', text: 'Insight', confidence: 0.8, score: 0.9, matchedTheme: 'theme', celestialEvent: { type: 'transit', description: 'desc', strength: 1 }, usedBirthChart: false, dismissed: false } });
      let state = createDiaryState({ entries: { e1: entry } });
      state = diaryReducer(state, rateInsight({ entryId: 'e1', rating: 'resonated' }));
      expect(state.entries.e1.insight!.userRating).toBe('resonated');
      expect(state.preferences.ratedInsights.i1).toBe('resonated');
    });

    it('rateInsight ignores missing entry', () => {
      let state = createDiaryState();
      state = diaryReducer(state, rateInsight({ entryId: 'missing', rating: 'resonated' }));
      expect(state.entries).toEqual({});
    });

    it('dismissInsight marks insight dismissed', () => {
      const entry = mockEntry({ id: 'e1', insight: { id: 'i1', text: 'Insight', confidence: 0.8, score: 0.9, matchedTheme: 'theme', celestialEvent: { type: 'transit', description: 'desc', strength: 1 }, usedBirthChart: false, dismissed: false } });
      let state = createDiaryState({ entries: { e1: entry } });
      state = diaryReducer(state, dismissInsight('e1'));
      expect(state.entries.e1.insight!.dismissed).toBe(true);
      expect(state.preferences.dismissedPatterns).toContain('i1');
    });

    it('setViewMode changes view mode', () => {
      let state = createDiaryState();
      state = diaryReducer(state, setViewMode('diary'));
      expect(state.ui.viewMode).toBe('diary');
    });

    it('setSearchQuery sets query', () => {
      let state = createDiaryState();
      state = diaryReducer(state, setSearchQuery('moon'));
      expect(state.ui.searchQuery).toBe('moon');
    });

    it('loadPersistedDiary merges partial state', () => {
      let state = createDiaryState();
      state = diaryReducer(state, loadPersistedDiary({ selectedDate: '2024-01-01', ui: { ...state.ui, viewMode: 'diary' } }));
      expect(state.selectedDate).toBe('2024-01-01');
      expect(state.ui.viewMode).toBe('diary');
    });
  });

  describe('async thunk reducers — initDiary', () => {
    it('pending sets isLoading', () => {
      let state = createDiaryState();
      state = diaryReducer(state, { type: initDiary.pending.type });
      expect(state.ui.isLoading).toBe(true);
    });

    it('fulfilled sets entries and clears loading', () => {
      let state = createDiaryState({ ui: { ...createDiaryState().ui, isLoading: true } });
      const entries = { e1: mockEntry() };
      const entriesByDate = { '2024-06-15': ['e1'] };
      state = diaryReducer(state, { type: initDiary.fulfilled.type, payload: { entries, entriesByDate } });
      expect(state.entries).toEqual(entries);
      expect(state.entriesByDate).toEqual(entriesByDate);
      expect(state.ui.isLoading).toBe(false);
    });

    it('rejected clears loading', () => {
      let state = createDiaryState({ ui: { ...createDiaryState().ui, isLoading: true } });
      state = diaryReducer(state, { type: initDiary.rejected.type });
      expect(state.ui.isLoading).toBe(false);
    });
  });

  describe('async thunk reducers — createDiaryEntry', () => {
    it('pending sets isLoading', () => {
      let state = createDiaryState();
      state = diaryReducer(state, { type: createDiaryEntry.pending.type });
      expect(state.ui.isLoading).toBe(true);
    });

    it('fulfilled adds entry and updates date index', () => {
      let state = createDiaryState();
      const entry = mockEntry({ id: 'e2', date: '2024-06-16' });
      state = diaryReducer(state, { type: createDiaryEntry.fulfilled.type, payload: entry });
      expect(state.entries.e2).toEqual(entry);
      expect(state.entriesByDate['2024-06-16']).toContain('e2');
      expect(state.ui.isLoading).toBe(false);
      expect(state.editingEntryId).toBeNull();
    });

    it('fulfilled appends to existing date', () => {
      let state = createDiaryState({ entriesByDate: { '2024-06-15': ['e1'] } });
      const entry = mockEntry({ id: 'e2', date: '2024-06-15' });
      state = diaryReducer(state, { type: createDiaryEntry.fulfilled.type, payload: entry });
      expect(state.entriesByDate['2024-06-15']).toEqual(['e1', 'e2']);
    });

    it('rejected clears loading', () => {
      let state = createDiaryState({ ui: { ...createDiaryState().ui, isLoading: true } });
      state = diaryReducer(state, { type: createDiaryEntry.rejected.type });
      expect(state.ui.isLoading).toBe(false);
    });
  });

  describe('async thunk reducers — updateDiaryEntry', () => {
    it('pending sets isLoading', () => {
      let state = createDiaryState();
      state = diaryReducer(state, { type: updateDiaryEntry.pending.type });
      expect(state.ui.isLoading).toBe(true);
    });

    it('fulfilled updates entry', () => {
      let state = createDiaryState({ entries: { e1: mockEntry() } });
      const updated = mockEntry({ id: 'e1', content: 'Updated content' });
      state = diaryReducer(state, { type: updateDiaryEntry.fulfilled.type, payload: updated });
      expect(state.entries.e1.content).toBe('Updated content');
      expect(state.ui.isLoading).toBe(false);
    });

    it('rejected clears loading', () => {
      let state = createDiaryState({ ui: { ...createDiaryState().ui, isLoading: true } });
      state = diaryReducer(state, { type: updateDiaryEntry.rejected.type });
      expect(state.ui.isLoading).toBe(false);
    });
  });

  describe('async thunk reducers — deleteDiaryEntry', () => {
    it('fulfilled removes entry and cleans up date index', () => {
      let state = createDiaryState({
        entries: { e1: mockEntry({ id: 'e1', date: '2024-06-15' }) },
        entriesByDate: { '2024-06-15': ['e1'] },
      });
      state = diaryReducer(state, { type: deleteDiaryEntry.fulfilled.type, payload: 'e1' });
      expect(state.entries.e1).toBeUndefined();
      expect(state.entriesByDate['2024-06-15']).toEqual([]);
    });

    it('fulfilled handles missing entry gracefully', () => {
      let state = createDiaryState();
      state = diaryReducer(state, { type: deleteDiaryEntry.fulfilled.type, payload: 'missing' });
      expect(state.entries).toEqual({});
    });
  });

  describe('async thunk reducers — clearAllDiaryEntries', () => {
    it('fulfilled clears all entries', () => {
      let state = createDiaryState({
        entries: { e1: mockEntry() },
        entriesByDate: { '2024-06-15': ['e1'] },
        editingEntryId: 'e1',
      });
      state = diaryReducer(state, { type: clearAllDiaryEntries.fulfilled.type });
      expect(state.entries).toEqual({});
      expect(state.entriesByDate).toEqual({});
      expect(state.editingEntryId).toBeNull();
    });
  });

  describe('async thunk reducers — syncDiaryFromCloud', () => {
    it('pending sets isSyncing', () => {
      let state = createDiaryState();
      state = diaryReducer(state, { type: syncDiaryFromCloud.pending.type });
      expect(state.ui.isSyncing).toBe(true);
    });

    it('fulfilled merges entries and rebuilds date index', () => {
      let state = createDiaryState({
        entries: { e1: mockEntry({ id: 'e1', date: '2024-06-15' }) },
        entriesByDate: { '2024-06-15': ['e1'] },
      });
      const cloudEntries = { e2: mockEntry({ id: 'e2', date: '2024-06-16' }) };
      state = diaryReducer(state, { type: syncDiaryFromCloud.fulfilled.type, payload: cloudEntries });
      expect(state.entries.e1).toBeDefined();
      expect(state.entries.e2).toBeDefined();
      expect(state.entriesByDate['2024-06-16']).toContain('e2');
      expect(state.ui.isSyncing).toBe(false);
      expect(state.ui.lastSyncAt).toBeTruthy();
    });

    it('fulfilled with null payload still clears syncing', () => {
      let state = createDiaryState({ ui: { ...createDiaryState().ui, isSyncing: true } });
      state = diaryReducer(state, { type: syncDiaryFromCloud.fulfilled.type, payload: null });
      expect(state.ui.isSyncing).toBe(false);
    });

    it('rejected clears syncing', () => {
      let state = createDiaryState({ ui: { ...createDiaryState().ui, isSyncing: true } });
      state = diaryReducer(state, { type: syncDiaryFromCloud.rejected.type });
      expect(state.ui.isSyncing).toBe(false);
    });
  });

  describe('async thunk reducers — retrySyncQueue', () => {
    it('pending sets isSyncing', () => {
      let state = createDiaryState();
      state = diaryReducer(state, { type: retrySyncQueue.pending.type });
      expect(state.ui.isSyncing).toBe(true);
    });

    it('fulfilled clears syncing and sets lastSyncAt', () => {
      let state = createDiaryState({ ui: { ...createDiaryState().ui, isSyncing: true } });
      state = diaryReducer(state, { type: retrySyncQueue.fulfilled.type, payload: [] });
      expect(state.ui.isSyncing).toBe(false);
      expect(state.ui.lastSyncAt).toBeTruthy();
    });

    it('rejected clears syncing', () => {
      let state = createDiaryState({ ui: { ...createDiaryState().ui, isSyncing: true } });
      state = diaryReducer(state, { type: retrySyncQueue.rejected.type });
      expect(state.ui.isSyncing).toBe(false);
    });
  });

  describe('selectors', () => {
    it('selectEntriesByDate returns sorted entries for date', () => {
      const root = createMockRootState({
        entries: {
          e1: mockEntry({ id: 'e1', date: '2024-06-15', timestamp: '2024-06-15T10:00:00Z' }),
          e2: mockEntry({ id: 'e2', date: '2024-06-15', timestamp: '2024-06-15T12:00:00Z' }),
          e3: mockEntry({ id: 'e3', date: '2024-06-16', timestamp: '2024-06-16T10:00:00Z' }),
        },
        entriesByDate: {
          '2024-06-15': ['e1', 'e2'],
          '2024-06-16': ['e3'],
        },
      });
      const result = selectEntriesByDate(root, '2024-06-15');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('e2'); // newer first
      expect(result[1].id).toBe('e1');
    });

    it('selectEntriesByDate returns empty array for unknown date', () => {
      const root = createMockRootState();
      expect(selectEntriesByDate(root, '2024-01-01')).toEqual([]);
    });

    it('selectAllEntries returns all entries sorted', () => {
      const root = createMockRootState({
        entries: {
          e1: mockEntry({ id: 'e1', timestamp: '2024-06-15T10:00:00Z' }),
          e2: mockEntry({ id: 'e2', timestamp: '2024-06-15T12:00:00Z' }),
        },
      });
      const result = selectAllEntries(root);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('e2');
    });

    it('selectEntryById returns specific entry', () => {
      const entry = mockEntry({ id: 'e1' });
      const root = createMockRootState({ entries: { e1: entry } });
      expect(selectEntryById(root, 'e1')).toEqual(entry);
      expect(selectEntryById(root, 'missing')).toBeUndefined();
    });

    it('selectJournalPreferences returns preferences', () => {
      const root = createMockRootState({ preferences: { ...createDiaryState().preferences, theme: 'dark' } });
      expect(selectJournalPreferences(root).theme).toBe('dark');
    });

    it('selectHasInsightForDate returns true when undismissed insight exists', () => {
      const root = createMockRootState({
        entries: {
          e1: mockEntry({ id: 'e1', date: '2024-06-15', insight: { id: 'i1', text: 'Insight', confidence: 0.8, score: 0.9, matchedTheme: 'theme', celestialEvent: { type: 'transit', description: 'desc', strength: 1 }, usedBirthChart: false, dismissed: false } }),
        },
        entriesByDate: { '2024-06-15': ['e1'] },
      });
      expect(selectHasInsightForDate(root, '2024-06-15')).toBe(true);
    });

    it('selectHasInsightForDate returns false when all insights dismissed', () => {
      const root = createMockRootState({
        entries: {
          e1: mockEntry({ id: 'e1', date: '2024-06-15', insight: { id: 'i1', text: 'Insight', confidence: 0.8, score: 0.9, matchedTheme: 'theme', celestialEvent: { type: 'transit', description: 'desc', strength: 1 }, usedBirthChart: false, dismissed: true } }),
        },
        entriesByDate: { '2024-06-15': ['e1'] },
      });
      expect(selectHasInsightForDate(root, '2024-06-15')).toBe(false);
    });

    it('selectSearchResults filters by content', () => {
      const root = createMockRootState({
        entries: {
          e1: mockEntry({ id: 'e1', content: 'The moon is bright tonight' }),
          e2: mockEntry({ id: 'e2', content: 'Just a regular day' }),
        },
        ui: { ...createDiaryState().ui, searchQuery: 'moon' },
      });
      const result = selectSearchResults(root);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('e1');
    });

    it('selectSearchResults filters by insight text', () => {
      const root = createMockRootState({
        entries: {
          e1: mockEntry({ id: 'e1', content: 'Hello', insight: { id: 'i1', text: 'Jupiter is rising', confidence: 0.8, score: 0.9, matchedTheme: 'theme', celestialEvent: { type: 'transit', description: 'desc', strength: 1 }, usedBirthChart: false, dismissed: false } }),
          e2: mockEntry({ id: 'e2', content: 'Hello' }),
        },
        ui: { ...createDiaryState().ui, searchQuery: 'jupiter' },
      });
      const result = selectSearchResults(root);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('e1');
    });

    it('selectSearchResults filters by tags', () => {
      const root = createMockRootState({
        entries: {
          e1: mockEntry({ id: 'e1', content: 'Hello', tags: ['moon', 'ritual'] }),
          e2: mockEntry({ id: 'e2', content: 'Hello', tags: ['work'] }),
        },
        ui: { ...createDiaryState().ui, searchQuery: 'ritual' },
      });
      const result = selectSearchResults(root);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('e1');
    });

    it('selectSearchResults returns empty for empty query', () => {
      const root = createMockRootState({
        entries: { e1: mockEntry() },
        ui: { ...createDiaryState().ui, searchQuery: '' },
      });
      expect(selectSearchResults(root)).toEqual([]);
    });
  });
});
