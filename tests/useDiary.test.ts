import { describe, it, expect, vi } from 'vitest';
import { renderHookWithProviders } from './test-utils';
import {
  useDiaryEntries,
  useEntriesByDate,
  useJournalPreferences,
  useDiaryStats,
  useDiarySearch,
} from '../src/hooks/useDiary';

describe('useDiary hooks', () => {
  describe('useDiaryEntries', () => {
    it('returns empty entries when state is empty', () => {
      const { result } = renderHookWithProviders(() => useDiaryEntries());
      expect(result.current.entries).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('returns entries from state', () => {
      const { result } = renderHookWithProviders(() => useDiaryEntries(), {
        diary: {
          entries: {
            e1: { id: 'e1', date: '2024-06-15', content: 'Hello', timestamp: '2024-06-15T10:00:00Z', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z' },
          },
          entriesByDate: { '2024-06-15': ['e1'] },
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: '2024-06-15',
          editingEntryId: null,
          preferences: { theme: 'default', font: 'system', fontSize: 16, showInsights: true, insightThreshold: 0.7, defaultView: 'calendar', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      expect(result.current.entries).toHaveLength(1);
      expect(result.current.entries[0].id).toBe('e1');
    });

    it('create returns a promise (dispatches createDiaryEntry thunk)', async () => {
      const { result } = renderHookWithProviders(() => useDiaryEntries());
      const promise = result.current.create('Hello world', '2024-06-15');
      expect(promise).toBeInstanceOf(Promise);
      await expect(promise).resolves.toBeDefined();
    });
  });

  describe('useEntriesByDate', () => {
    it('returns entries for specific date', () => {
      const { result } = renderHookWithProviders(() => useEntriesByDate('2024-06-15'), {
        diary: {
          entries: {
            e1: { id: 'e1', date: '2024-06-15', content: 'A', timestamp: '2024-06-15T10:00:00Z', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z' },
            e2: { id: 'e2', date: '2024-06-16', content: 'B', timestamp: '2024-06-16T10:00:00Z', createdAt: '2024-06-16T10:00:00Z', updatedAt: '2024-06-16T10:00:00Z' },
          },
          entriesByDate: { '2024-06-15': ['e1'], '2024-06-16': ['e2'] },
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: '2024-06-15',
          editingEntryId: null,
          preferences: { theme: 'default', font: 'system', fontSize: 16, showInsights: true, insightThreshold: 0.7, defaultView: 'calendar', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe('e1');
    });

    it('returns empty array for unknown date', () => {
      const { result } = renderHookWithProviders(() => useEntriesByDate('2024-01-01'));
      expect(result.current).toEqual([]);
    });
  });

  describe('useJournalPreferences', () => {
    it('returns preferences from state', () => {
      const { result } = renderHookWithProviders(() => useJournalPreferences(), {
        diary: {
          entries: {},
          entriesByDate: {},
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: '2024-06-15',
          editingEntryId: null,
          preferences: { theme: 'dark', font: 'serif', fontSize: 20, showInsights: false, insightThreshold: 0.9, defaultView: 'diary', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      expect(result.current.theme).toBe('dark');
      expect(result.current.fontSize).toBe(20);
    });
  });

  describe('useDiaryStats', () => {
    it('returns zero stats for empty entries', () => {
      const { result } = renderHookWithProviders(() => useDiaryStats());
      expect(result.current.totalEntries).toBe(0);
      expect(result.current.totalWords).toBe(0);
      expect(result.current.averageWordsPerEntry).toBe(0);
      expect(result.current.currentStreak).toBe(0);
    });

    it('counts total entries and words', () => {
      const { result } = renderHookWithProviders(() => useDiaryStats(), {
        diary: {
          entries: {
            e1: { id: 'e1', date: '2024-06-15', content: 'Hello world test', timestamp: '2024-06-15T10:00:00Z', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z' },
            e2: { id: 'e2', date: '2024-06-15', content: 'One two three four', timestamp: '2024-06-15T11:00:00Z', createdAt: '2024-06-15T11:00:00Z', updatedAt: '2024-06-15T11:00:00Z' },
          },
          entriesByDate: { '2024-06-15': ['e1', 'e2'] },
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: '2024-06-15',
          editingEntryId: null,
          preferences: { theme: 'default', font: 'system', fontSize: 16, showInsights: true, insightThreshold: 0.7, defaultView: 'calendar', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      expect(result.current.totalEntries).toBe(2);
      expect(result.current.totalWords).toBe(7);
      expect(result.current.averageWordsPerEntry).toBe(4);
    });

    it('counts insights and resonated insights', () => {
      const { result } = renderHookWithProviders(() => useDiaryStats(), {
        diary: {
          entries: {
            e1: { id: 'e1', date: '2024-06-15', content: 'A', timestamp: '2024-06-15T10:00:00Z', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z', insight: { id: 'i1', text: 'Insight', userRating: 'resonated' } },
            e2: { id: 'e2', date: '2024-06-15', content: 'B', timestamp: '2024-06-15T11:00:00Z', createdAt: '2024-06-15T11:00:00Z', updatedAt: '2024-06-15T11:00:00Z', insight: { id: 'i2', text: 'Insight 2' } },
          },
          entriesByDate: { '2024-06-15': ['e1', 'e2'] },
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: '2024-06-15',
          editingEntryId: null,
          preferences: { theme: 'default', font: 'system', fontSize: 16, showInsights: true, insightThreshold: 0.7, defaultView: 'calendar', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      expect(result.current.entriesWithInsights).toBe(2);
      expect(result.current.resonatedInsights).toBe(1);
    });

    it('calculates streak for consecutive days', () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const { result } = renderHookWithProviders(() => useDiaryStats(), {
        diary: {
          entries: {
            e1: { id: 'e1', date: yesterday, content: 'Yesterday', timestamp: `${yesterday}T10:00:00Z`, createdAt: `${yesterday}T10:00:00Z`, updatedAt: `${yesterday}T10:00:00Z` },
            e2: { id: 'e2', date: today, content: 'Today', timestamp: `${today}T10:00:00Z`, createdAt: `${today}T10:00:00Z`, updatedAt: `${today}T10:00:00Z` },
          },
          entriesByDate: { [yesterday]: ['e1'], [today]: ['e2'] },
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: today,
          editingEntryId: null,
          preferences: { theme: 'default', font: 'system', fontSize: 16, showInsights: true, insightThreshold: 0.7, defaultView: 'calendar', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      expect(result.current.currentStreak).toBeGreaterThanOrEqual(1);
    });
  });

  describe('useDiarySearch', () => {
    it('returns all entries for empty query', () => {
      const { result } = renderHookWithProviders(() => useDiarySearch(''), {
        diary: {
          entries: {
            e1: { id: 'e1', date: '2024-06-15', content: 'Hello moon', timestamp: '2024-06-15T10:00:00Z', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z' },
          },
          entriesByDate: { '2024-06-15': ['e1'] },
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: '2024-06-15',
          editingEntryId: null,
          preferences: { theme: 'default', font: 'system', fontSize: 16, showInsights: true, insightThreshold: 0.7, defaultView: 'calendar', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      expect(result.current).toHaveLength(1);
    });

    it('filters by content', () => {
      const { result } = renderHookWithProviders(() => useDiarySearch('moon'), {
        diary: {
          entries: {
            e1: { id: 'e1', date: '2024-06-15', content: 'The moon is bright', timestamp: '2024-06-15T10:00:00Z', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z' },
            e2: { id: 'e2', date: '2024-06-15', content: 'Just a regular day', timestamp: '2024-06-15T11:00:00Z', createdAt: '2024-06-15T11:00:00Z', updatedAt: '2024-06-15T11:00:00Z' },
          },
          entriesByDate: { '2024-06-15': ['e1', 'e2'] },
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: '2024-06-15',
          editingEntryId: null,
          preferences: { theme: 'default', font: 'system', fontSize: 16, showInsights: true, insightThreshold: 0.7, defaultView: 'calendar', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe('e1');
    });

    it('filters by insight text', () => {
      const { result } = renderHookWithProviders(() => useDiarySearch('jupiter'), {
        diary: {
          entries: {
            e1: { id: 'e1', date: '2024-06-15', content: 'Hello', timestamp: '2024-06-15T10:00:00Z', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z', insight: { id: 'i1', text: 'Jupiter rising' } },
            e2: { id: 'e2', date: '2024-06-15', content: 'Hello', timestamp: '2024-06-15T11:00:00Z', createdAt: '2024-06-15T11:00:00Z', updatedAt: '2024-06-15T11:00:00Z' },
          },
          entriesByDate: { '2024-06-15': ['e1', 'e2'] },
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: '2024-06-15',
          editingEntryId: null,
          preferences: { theme: 'default', font: 'system', fontSize: 16, showInsights: true, insightThreshold: 0.7, defaultView: 'calendar', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe('e1');
    });

    it('filters by multiple search terms using OR logic', () => {
      const { result } = renderHookWithProviders(() => useDiarySearch('moon ritual'), {
        diary: {
          entries: {
            e1: { id: 'e1', date: '2024-06-15', content: 'Moon ritual tonight', timestamp: '2024-06-15T10:00:00Z', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z' },
            e2: { id: 'e2', date: '2024-06-15', content: 'Just moon', timestamp: '2024-06-15T11:00:00Z', createdAt: '2024-06-15T11:00:00Z', updatedAt: '2024-06-15T11:00:00Z' },
            e3: { id: 'e3', date: '2024-06-15', content: 'Nothing here', timestamp: '2024-06-15T12:00:00Z', createdAt: '2024-06-15T12:00:00Z', updatedAt: '2024-06-15T12:00:00Z' },
          },
          entriesByDate: { '2024-06-15': ['e1', 'e2', 'e3'] },
          ui: { isLoading: false, isSyncing: false, lastSyncAt: null, searchQuery: '', viewMode: 'calendar' },
          selectedDate: '2024-06-15',
          editingEntryId: null,
          preferences: { theme: 'default', font: 'system', fontSize: 16, showInsights: true, insightThreshold: 0.7, defaultView: 'calendar', ratedInsights: {}, dismissedPatterns: [] },
        } as any,
      });
      // OR logic: 'moon ritual' matches e1 (moon + ritual) and e2 (moon)
      expect(result.current).toHaveLength(2);
      expect(result.current.map(e => e.id).sort()).toEqual(['e1', 'e2']);
    });
  });
});
