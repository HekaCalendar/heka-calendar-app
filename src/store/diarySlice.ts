/**
 * Diary Redux Slice — Enterprise Edition
 * IndexedDB-backed state management for the HEKA Journal system
 *
 * Replaces localStorage with Dexie.js IndexedDB layer.
 * Provides: revision history, offline sync queue, full-text search index.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './types';
import type {
  DiaryEntry,
  DiaryState,
  JournalPreferences
} from '../oracle/diaryTypes';
import { OracleEngine } from '../oracle/oracleEngine';
import { DEFAULT_JOURNAL_PREFERENCES } from '../oracle/diaryTypes';
import { syncToCloud, loadFromCloud } from '../services/firebase';
import { buildMoodHistory } from '../services/sentimentService';
import { aiConfigService } from '../services/aiConfigService';
import {
  db,
  dbGetAllEntries,
  dbCreateEntry,
  dbUpdateEntry,
  dbDeleteEntry,
  dbClearAllEntries,
  dbMigrateFromLocalStorage,
  dbEnqueueSync,
  dbMarkSyncSuccess,
  dbMarkSyncFailed,
  dbGetSyncQueue,
  dbSearchEntries,
  type JournalEntry,
} from '../services/journalDatabase';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: DiaryState = {
  entries: {},
  entriesByDate: {},
  selectedDate: new Date().toISOString().split('T')[0],
  editingEntryId: null,
  preferences: DEFAULT_JOURNAL_PREFERENCES,
  ui: {
    isLoading: false,
    isSyncing: false,
    lastSyncAt: null,
    searchQuery: '',
    viewMode: 'calendar'
  }
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Initialise diary from IndexedDB (with one-time localStorage migration)
 */
const initDiary = createAsyncThunk(
  'diary/init',
  async () => {
    // Migrate legacy localStorage data once
    const migrated = await dbMigrateFromLocalStorage();
    if (migrated > 0) {
    }

    const all = await dbGetAllEntries();
    const entries: Record<string, DiaryEntry> = {};
    const entriesByDate: Record<string, string[]> = {};

    all.forEach(entry => {
      entries[entry.id] = entry;
      if (!entriesByDate[entry.date]) {
        entriesByDate[entry.date] = [];
      }
      entriesByDate[entry.date].push(entry.id);
    });

    return { entries, entriesByDate };
  }
);

/**
 * Create a new diary entry with full Oracle integration
 */
const createDiaryEntry = createAsyncThunk(
  'diary/createDiaryEntry',
  async (payload: { date: string; content: string; tags?: string[]; isMarkdown?: boolean }, { getState }) => {
    const state = getState() as RootState;
    const { auth } = state.calendar;

    // Analyse content themes
    const themes = OracleEngine.analyzeContent(payload.content);

    // Capture celestial context
    const celestialState = await OracleEngine.getCurrentCelestialState();

    // Generate insight
    const birthChart = state.calendar.selectedAstroProfileId
      ? state.calendar.astroProfiles.find((p: {id: string}) => p.id === state.calendar.selectedAstroProfileId)?.natalChart
      : undefined;

    const insights = OracleEngine.generateInsights(themes, celestialState, birthChart as any);
    const bestInsight = OracleEngine.selectBestInsight(insights);

    let insight: DiaryEntry['insight'] = undefined;
    if (bestInsight) {
      insight = {
        id: bestInsight.id,
        text: bestInsight.text,
        confidence: bestInsight.confidence,
        score: bestInsight.score,
        matchedTheme: bestInsight.themeMatch.theme,
        celestialEvent: {
          type: ('type' in bestInsight.celestialEvent) ? bestInsight.celestialEvent.type : 'transit',
          description: ('description' in bestInsight.celestialEvent)
            ? bestInsight.celestialEvent.description
            : `${(bestInsight.celestialEvent as any).transitingPlanet || 'Planet'} ${(bestInsight.celestialEvent as any).aspect || 'aspect'}`,
          strength: bestInsight.celestialEvent.strength
        },
        usedBirthChart: bestInsight.requiresBirthChart,
        dismissed: false
      };
    }

    const timestamp = new Date().toISOString();
    const entryData: Omit<JournalEntry, 'revisionCount' | 'syncStatus'> = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      date: payload.date,
      timestamp,
      content: payload.content,
      tags: payload.tags || [],
      isMarkdown: payload.isMarkdown,
      detectedThemes: themes.map(t => t.theme),
      insight,
      celestialContext: {
        capturedAt: timestamp,
        moonPhase: {
          phase: celestialState.moonPhase.phase,
          sign: celestialState.moonPhase.sign,
          illumination: celestialState.moonPhase.illumination,
          isVoid: celestialState.moonPhase.isVoid,
        },
        activeEvents: celestialState.events.map(e => ({
          type: e.type,
          description: e.description,
          strength: e.strength,
        })),
        planetPositions: Object.entries(celestialState.planets).reduce((acc, [name, body]) => {
          acc[name] = { sign: body.sign, degree: body.degreeInSign };
          return acc;
        }, {} as Record<string, { sign: string; degree: number }>),
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Save to IndexedDB
    const entry = await dbCreateEntry(entryData);

    // Sync to cloud
    if (auth.isAuthenticated && auth.userId) {
      try {
        await syncToCloud(auth.userId, { diaryEntries: { [entry.id]: entry } });
        await dbEnqueueSync(entry.id, 'create', entry);
      } catch (error) {
        console.error('Failed to sync diary entry:', error);
        // Remains in sync queue for retry
      }
    }

    // Update AI mood context
    try {
      const allEntries = await dbGetAllEntries();
      const moodHistory = buildMoodHistory(allEntries);
      aiConfigService.setUserContext({
        moodHistory: moodHistory.slice(-30),
        lastJournalSnippet: payload.content.slice(0, 200),
        lastJournalDate: payload.date,
        lastJournalThemes: entry.detectedThemes || [],
      });
    } catch (e) {
      console.error('[Diary] Failed to update AI mood context:', e);
    }

    return entry;
  }
);

/**
 * Update entry with re-analysis if content changed significantly
 */
const updateDiaryEntry = createAsyncThunk(
  'diary/updateDiaryEntry',
  async (payload: { entryId: string; content: string; tags?: string[] }, { getState }) => {
    const state = getState() as RootState;
    const { auth } = state.calendar;
    const existingEntry = state.diary.entries[payload.entryId];

    if (!existingEntry) {
      throw new Error('Entry not found');
    }

    // Re-analyse content
    const themes = OracleEngine.analyzeContent(payload.content);

    // Regenerate insight if content changed significantly (>50 chars)
    let updatedInsight = existingEntry.insight;
    const birthChart = state.calendar.selectedAstroProfileId
      ? state.calendar.astroProfiles.find((p: {id: string}) => p.id === state.calendar.selectedAstroProfileId)?.natalChart
      : undefined;

    if (Math.abs(payload.content.length - existingEntry.content.length) > 50) {
      const celestialContext = await OracleEngine.getCurrentCelestialState();
      const insights = OracleEngine.generateInsights(themes, celestialContext, birthChart as any);
      const bestInsight = OracleEngine.selectBestInsight(insights);

      if (bestInsight) {
        updatedInsight = {
          id: bestInsight.id,
          text: bestInsight.text,
          confidence: bestInsight.confidence,
          score: bestInsight.score,
          matchedTheme: bestInsight.themeMatch.theme,
          celestialEvent: {
            type: ('type' in bestInsight.celestialEvent) ? bestInsight.celestialEvent.type : 'transit',
            description: ('description' in bestInsight.celestialEvent)
              ? bestInsight.celestialEvent.description
              : `${(bestInsight.celestialEvent as any).transitingPlanet || 'Planet'} ${(bestInsight.celestialEvent as any).aspect || 'aspect'}`,
            strength: bestInsight.celestialEvent.strength
          },
          usedBirthChart: bestInsight.requiresBirthChart,
          dismissed: false
        };
      }
    }

    const updated = await dbUpdateEntry(payload.entryId, {
      content: payload.content,
      tags: payload.tags,
      detectedThemes: themes.map(t => t.theme),
      insight: updatedInsight,
    });

    // Sync to cloud
    if (auth.isAuthenticated && auth.userId) {
      try {
        await syncToCloud(auth.userId, { diaryEntries: { [updated.id]: updated } });
        await dbMarkSyncSuccess(updated.id);
      } catch (error) {
        console.error('Failed to sync diary update:', error);
        await dbEnqueueSync(updated.id, 'update', updated);
      }
    }

    // Update AI mood context
    try {
      const allEntries = await dbGetAllEntries();
      const moodHistory = buildMoodHistory(allEntries);
      aiConfigService.setUserContext({
        moodHistory: moodHistory.slice(-30),
        lastJournalSnippet: payload.content.slice(0, 200),
        lastJournalDate: existingEntry.date,
        lastJournalThemes: updated.detectedThemes || [],
      });
    } catch (e) {
      console.error('[Diary] Failed to update AI mood context:', e);
    }

    return updated;
  }
);

/**
 * Delete diary entry
 */
const deleteDiaryEntry = createAsyncThunk(
  'diary/deleteDiaryEntry',
  async (entryId: string, { getState }) => {
    const state = getState() as RootState;
    const { auth } = state.calendar;

    await dbDeleteEntry(entryId);

    // Sync deletion to cloud
    if (auth.isAuthenticated && auth.userId) {
      try {
        await syncToCloud(auth.userId, { deletedDiaryEntries: [entryId] });
      } catch (error) {
        console.error('Failed to sync diary deletion:', error);
        await dbEnqueueSync(entryId, 'delete', null);
      }
    }

    // Recalculate AI mood context
    try {
      const allEntries = await dbGetAllEntries();
      const moodHistory = buildMoodHistory(allEntries);
      aiConfigService.setUserContext({
        moodHistory: moodHistory.slice(-30),
      });
    } catch (e) {
      console.error('[Diary] Failed to update AI mood context:', e);
    }

    return entryId;
  }
);

/**
 * Clear all diary entries
 */
const clearAllDiaryEntries = createAsyncThunk(
  'diary/clearAll',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { auth } = state.calendar;

    await dbClearAllEntries();

    if (auth.isAuthenticated && auth.userId) {
      try {
        await syncToCloud(auth.userId, { diaryEntries: [] });
      } catch (error) {
        console.error('Failed to sync diary clear:', error);
      }
    }

    return true;
  }
);

/**
 * Sync diary from cloud
 */
const syncDiaryFromCloud = createAsyncThunk(
  'diary/syncFromCloud',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { auth } = state.calendar;

    if (!auth.isAuthenticated || !auth.userId) {
      return null;
    }

    try {
      const cloudData = await loadFromCloud(auth.userId);
      return cloudData?.diaryEntries || null;
    } catch (error) {
      console.error('Failed to sync diary from cloud:', error);
      return null;
    }
  }
);

/**
 * Retry pending sync queue items
 */
const retrySyncQueue = createAsyncThunk(
  'diary/retrySync',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { auth } = state.calendar;

    if (!auth.isAuthenticated || !auth.userId) return [];

    const queue = await dbGetSyncQueue();
    const results: { itemId: string; success: boolean }[] = [];

    for (const item of queue) {
      if (item.attempts >= 5) continue; // Max retries

      try {
        if (item.operation === 'delete') {
          await syncToCloud(auth.userId, { deletedDiaryEntries: [item.entryId] });
        } else {
          const entry = await db.entries.get(item.entryId);
          if (entry) {
            await syncToCloud(auth.userId, { diaryEntries: { [entry.id]: entry } });
          }
        }
        await dbMarkSyncSuccess(item.id);
        results.push({ itemId: item.id, success: true });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        await dbMarkSyncFailed(item.id, msg);
        results.push({ itemId: item.id, success: false });
      }
    }

    return results;
  }
);

/**
 * Search entries via IndexedDB full-text index
 */
const searchDiaryEntries = createAsyncThunk(
  'diary/search',
  async (query: string) => {
    if (!query.trim()) return [];
    return dbSearchEntries(query);
  }
);

// ============================================================================
// SLICE
// ============================================================================

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    // Date selection
    selectDiaryDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
      state.editingEntryId = null;
    },

    // Entry editing
    startEditingEntry: (state, action: PayloadAction<string>) => {
      state.editingEntryId = action.payload;
    },

    cancelEditingEntry: (state) => {
      state.editingEntryId = null;
    },

    // Preferences
    updateJournalPreferences: (state, action: PayloadAction<Partial<JournalPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    setJournalTheme: (state, action: PayloadAction<JournalPreferences['theme']>) => {
      state.preferences.theme = action.payload;
    },

    setJournalFont: (state, action: PayloadAction<JournalPreferences['font']>) => {
      state.preferences.font = action.payload;
    },

    setFontSize: (state, action: PayloadAction<number>) => {
      state.preferences.fontSize = action.payload;
    },

    toggleInsights: (state) => {
      state.preferences.showInsights = !state.preferences.showInsights;
    },

    setInsightThreshold: (state, action: PayloadAction<number>) => {
      state.preferences.insightThreshold = action.payload;
    },

    // Insight rating
    rateInsight: (state, action: PayloadAction<{ entryId: string; rating: 'resonated' | 'neutral' | 'dismissed' }>) => {
      const entry = state.entries[action.payload.entryId];
      if (entry?.insight) {
        entry.insight.userRating = action.payload.rating;
        state.preferences.ratedInsights[entry.insight.id] = action.payload.rating;
      }
    },

    dismissInsight: (state, action: PayloadAction<string>) => {
      const entry = state.entries[action.payload];
      if (entry?.insight) {
        entry.insight.dismissed = true;
        state.preferences.dismissedPatterns.push(entry.insight.id);
      }
    },

    // View mode
    setViewMode: (state, action: PayloadAction<'calendar' | 'diary'>) => {
      state.ui.viewMode = action.payload;
    },

    // Search
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.ui.searchQuery = action.payload;
    },

    // Load persisted state
    loadPersistedDiary: (state, action: PayloadAction<Partial<DiaryState>>) => {
      return { ...state, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    // Init
    builder.addCase(initDiary.pending, (state) => {
      state.ui.isLoading = true;
    });
    builder.addCase(initDiary.fulfilled, (state, action) => {
      state.entries = action.payload.entries;
      state.entriesByDate = action.payload.entriesByDate;
      state.ui.isLoading = false;
    });
    builder.addCase(initDiary.rejected, (state) => {
      state.ui.isLoading = false;
    });

    // Create entry
    builder.addCase(createDiaryEntry.pending, (state) => {
      state.ui.isLoading = true;
    });
    builder.addCase(createDiaryEntry.fulfilled, (state, action) => {
      const entry = action.payload;
      state.entries[entry.id] = entry;

      if (!state.entriesByDate[entry.date]) {
        state.entriesByDate[entry.date] = [];
      }
      state.entriesByDate[entry.date].push(entry.id);

      state.ui.isLoading = false;
      state.editingEntryId = null;
    });
    builder.addCase(createDiaryEntry.rejected, (state) => {
      state.ui.isLoading = false;
    });

    // Update entry
    builder.addCase(updateDiaryEntry.pending, (state) => {
      state.ui.isLoading = true;
    });
    builder.addCase(updateDiaryEntry.fulfilled, (state, action) => {
      state.entries[action.payload.id] = action.payload;
      state.ui.isLoading = false;
    });
    builder.addCase(updateDiaryEntry.rejected, (state) => {
      state.ui.isLoading = false;
    });

    // Delete entry
    builder.addCase(deleteDiaryEntry.fulfilled, (state, action) => {
      const entryId = action.payload;
      const entry = state.entries[entryId];

      if (entry) {
        const dateEntries = state.entriesByDate[entry.date];
        if (dateEntries) {
          state.entriesByDate[entry.date] = dateEntries.filter(id => id !== entryId);
        }
        delete state.entries[entryId];
      }
    });

    // Clear all entries
    builder.addCase(clearAllDiaryEntries.fulfilled, (state) => {
      state.entries = {};
      state.entriesByDate = {};
      state.editingEntryId = null;
    });

    // Sync from cloud
    builder.addCase(syncDiaryFromCloud.pending, (state) => {
      state.ui.isSyncing = true;
    });
    builder.addCase(syncDiaryFromCloud.fulfilled, (state, action) => {
      if (action.payload) {
        state.entries = { ...state.entries, ...action.payload };

        // Rebuild date index
        state.entriesByDate = {};
        Object.values(state.entries).forEach(entry => {
          if (!state.entriesByDate[entry.date]) {
            state.entriesByDate[entry.date] = [];
          }
          state.entriesByDate[entry.date].push(entry.id);
        });
      }
      state.ui.isSyncing = false;
      state.ui.lastSyncAt = new Date().toISOString();
    });
    builder.addCase(syncDiaryFromCloud.rejected, (state) => {
      state.ui.isSyncing = false;
    });

    // Retry sync queue
    builder.addCase(retrySyncQueue.pending, (state) => {
      state.ui.isSyncing = true;
    });
    builder.addCase(retrySyncQueue.fulfilled, (state) => {
      state.ui.isSyncing = false;
      state.ui.lastSyncAt = new Date().toISOString();
    });
    builder.addCase(retrySyncQueue.rejected, (state) => {
      state.ui.isSyncing = false;
    });
  }
});

// ============================================================================
// SELECTORS
// ============================================================================

export const selectDiaryState = (state: RootState) => state.diary;

export const selectEntriesByDate = (state: RootState, date: string): DiaryEntry[] => {
  const entryIds = state.diary.entriesByDate[date] || [];
  return entryIds
    .map(id => state.diary.entries[id])
    .filter((e): e is DiaryEntry => !!e)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const selectAllEntries = (state: RootState): DiaryEntry[] => {
  return Object.values(state.diary.entries)
    .filter((e): e is DiaryEntry => !!e)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const selectEntryById = (state: RootState, id: string) => state.diary.entries[id];

export const selectJournalPreferences = (state: RootState) => state.diary.preferences;

export const selectHasInsightForDate = (state: RootState, date: string) => {
  const entries = selectEntriesByDate(state, date);
  return entries.some(e => e.insight && !e.insight.dismissed);
};

export const selectSearchResults = (state: RootState) => {
  const query = state.diary.ui.searchQuery.toLowerCase();
  if (!query) return [];

  return Object.values(state.diary.entries)
    .filter(entry =>
      entry.content.toLowerCase().includes(query) ||
      entry.insight?.text.toLowerCase().includes(query) ||
      entry.tags?.some(t => t.toLowerCase().includes(query))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// ============================================================================
// EXPORTS
// ============================================================================

export const {
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
} = diarySlice.actions;

export {
  initDiary,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  clearAllDiaryEntries,
  syncDiaryFromCloud,
  retrySyncQueue,
  searchDiaryEntries,
};

export default diarySlice.reducer;
