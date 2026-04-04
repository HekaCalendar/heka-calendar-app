/**
 * Diary Custom Hooks
 * Convenient hooks for diary operations
 */

import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  createDiaryEntry, 
  updateDiaryEntry, 
  deleteDiaryEntry,
  selectAllEntries,
  selectEntriesByDate 
} from '../store/diarySlice';
// Types are inferred from Redux store

/**
 * Hook for diary entries management
 */
export function useDiaryEntries() {
  const dispatch = useDispatch<AppDispatch>();
  const entries = useSelector((state: RootState) => selectAllEntries(state));
  const loading = useSelector((state: RootState) => state.diary.ui.isLoading);

  const create = useCallback(async (content: string, date: string) => {
    return dispatch(createDiaryEntry({ content, date })).unwrap();
  }, [dispatch]);

  const update = useCallback(async (entryId: string, content: string) => {
    return dispatch(updateDiaryEntry({ entryId, content })).unwrap();
  }, [dispatch]);

  const remove = useCallback(async (entryId: string) => {
    return dispatch(deleteDiaryEntry(entryId)).unwrap();
  }, [dispatch]);

  // Insights are now automatically generated with FULL Oracle Engine analysis
  // This includes: content theme detection, celestial context, birth chart transits
  const getInsight = useCallback(async () => {
    console.log('Insights are automatically generated on entry create/update with Oracle Engine');
    return null;
  }, []);

  return {
    entries,
    loading,
    create,
    update,
    remove,
    getInsight,
  };
}

/**
 * Hook for date-specific entries
 */
export function useEntriesByDate(date: string) {
  return useSelector((state: RootState) => selectEntriesByDate(state, date));
}

/**
 * Hook for journal preferences
 */
export function useJournalPreferences() {
  return useSelector((state: RootState) => state.diary.preferences);
}

/**
 * Hook for entry statistics
 */
export function useDiaryStats() {
  const entries = useSelector((state: RootState) => selectAllEntries(state));

  return useMemo(() => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, e) => sum + e.content.split(/\s+/).length, 0);
    const entriesWithInsights = entries.filter(e => e.insight).length;
    const resonatedInsights = entries.filter(e => e.insight?.userRating === 'resonated').length;
    
    // Calculate streak
    const dates = [...new Set(entries.map(e => e.date))].sort();
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - (dates.length - 1 - i));
      
      if (date === expectedDate.toISOString().split('T')[0] || 
          (i === dates.length - 1 && date === today)) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalEntries,
      totalWords,
      entriesWithInsights,
      resonatedInsights,
      currentStreak,
      averageWordsPerEntry: totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0,
    };
  }, [entries]);
}

/**
 * Hook for searching entries
 */
export function useDiarySearch(query: string) {
  const entries = useSelector((state: RootState) => selectAllEntries(state));

  return useMemo(() => {
    if (!query.trim()) return entries;
    
    const searchTerms = query.toLowerCase().split(/\s+/);
    return entries.filter(entry => {
      const content = entry.content.toLowerCase();
      const insightText = entry.insight?.text?.toLowerCase() || '';
      return searchTerms.some(term => 
        content.includes(term) || insightText.includes(term)
      );
    });
  }, [entries, query]);
}

export default useDiaryEntries;
