/**
 * Diary Redux Slice
 * State management for the HEKA Diary system
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

// Load entries from localStorage on init
const loadInitialEntries = (): { entries: Record<string, DiaryEntry>; entriesByDate: Record<string, string[]> } => {
  try {
    const saved = localStorage.getItem('heka_diary_entries');
    if (saved) {
      const parsed: DiaryEntry[] = JSON.parse(saved);
      const entries: Record<string, DiaryEntry> = {};
      const entriesByDate: Record<string, string[]> = {};
      
      parsed.forEach(entry => {
        entries[entry.id] = entry;
        if (!entriesByDate[entry.date]) {
          entriesByDate[entry.date] = [];
        }
        entriesByDate[entry.date].push(entry.id);
      });
      
      return { entries, entriesByDate };
    }
  } catch (e) {
    console.error('Failed to load diary entries:', e);
  }
  return { entries: {}, entriesByDate: {} };
};

const loaded = loadInitialEntries();
initialState.entries = loaded.entries;
initialState.entriesByDate = loaded.entriesByDate;

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Create a new diary entry with Oracle insight
 */
/**
 * Simplified create entry thunk (matches component API)
 */
const createEntry = createAsyncThunk(
  'diary/createEntry',
  async (payload: { date: string; content: string; theme?: string; font?: string }) => {
    // Generate entry ID and timestamps
    const id = Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().toISOString();
    
    // Build entry
    const entry: DiaryEntry = {
      id,
      date: payload.date,
      timestamp,
      content: payload.content,
      detectedThemes: [],
      celestialContext: {
        capturedAt: timestamp,
        moonPhase: {
          phase: 'full',
          sign: 'Leo',
          illumination: 100,
          isVoid: false,
        },
        activeEvents: [],
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]');
    existing.push(entry);
    localStorage.setItem('heka_diary_entries', JSON.stringify(existing));
    
    return entry;
  }
);

/**
 * Simplified update entry thunk
 */
const updateEntry = createAsyncThunk(
  'diary/updateEntry',
  async (payload: { entryId: string; content: string; theme?: string; font?: string }, { getState }) => {
    const state = getState() as RootState;
    const existing = state.diary.entries[payload.entryId];
    
    if (!existing) {
      throw new Error('Entry not found');
    }
    
    const updated: DiaryEntry = {
      ...existing,
      content: payload.content,
      updatedAt: new Date().toISOString(),
    };
    
    // Update localStorage
    const all = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]');
    const idx = all.findIndex((e: DiaryEntry) => e.id === payload.entryId);
    if (idx >= 0) {
      all[idx] = updated;
      localStorage.setItem('heka_diary_entries', JSON.stringify(all));
    }
    
    return updated;
  }
);

/**
 * Generate insight for an entry
 */
const generateInsight = createAsyncThunk(
  'diary/generateInsight',
  async (payload: { entryId: string; content: string }, { getState }) => {
    const state = getState() as RootState;
    const entry = state.diary.entries[payload.entryId];
    
    if (!entry) {
      throw new Error('Entry not found');
    }
    
    // Mock insight generation
    const insight = {
      id: Math.random().toString(36).substring(2, 15),
      text: 'The Moon in your sector of communication suggests this is a powerful time to express your thoughts. What you write today carries extra weight—trust your inner voice.',
      confidence: 'high' as const,
      score: 85,
      matchedTheme: 'communication',
      celestialEvent: {
        type: 'moon_phase',
        description: 'Waxing Gibbous in Gemini',
        strength: 80,
      },
      usedBirthChart: false,
      dismissed: false,
      archetypes: ['Communication', 'Expression', 'Growth'],
      strengthScore: 85,
      celestialContext: {
        moonPhase: 'Waxing Gibbous',
        aspects: ['Moon trine Mercury', 'Sun sextile Jupiter'],
      },
    };
    
    return { entryId: payload.entryId, insight };
  }
);

/**
 * Simplified delete entry thunk
 */
const deleteEntry = createAsyncThunk(
  'diary/deleteEntry',
  async (entryId: string) => {
    // Remove from localStorage
    const all = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]');
    const filtered = all.filter((e: DiaryEntry) => e.id !== entryId);
    localStorage.setItem('heka_diary_entries', JSON.stringify(filtered));
    
    return entryId;
  }
);

// ============================================================================
// FULL ORACLE ENGINE INTEGRATION
// ============================================================================

/**
 * Create diary entry with FULL Oracle Engine analysis
 */
const createDiaryEntry = createAsyncThunk(
  'diary/createDiaryEntry',
  async (payload: { date: string; content: string }, { getState }) => {
    const state = getState() as RootState;
    const { auth } = state.calendar;
    
    // Get real celestial context from Swiss Ephemeris
    const celestialContext = await OracleEngine.getCurrentCelestialState(new Date());
    
    // Analyze content for themes using 200+ keyword mappings
    const themes = OracleEngine.analyzeContent(payload.content);
    
    // Get birth chart if available for personalized insights
    const birthChart = state.calendar.selectedAstroProfileId 
      ? state.calendar.astroProfiles.find((p: {id: string}) => p.id === state.calendar.selectedAstroProfileId)?.natalChart
      : undefined;
    
    // Generate insights with celestial synchronicity
    const insights = OracleEngine.generateInsights(themes, celestialContext, birthChart as any);
    const bestInsight = OracleEngine.selectBestInsight(insights);
    
    // Create entry with full celestial context
    const entry: DiaryEntry = {
      id: Math.random().toString(36).substring(2, 15),
      date: payload.date,
      timestamp: new Date().toISOString(),
      content: payload.content,
      detectedThemes: themes.map(t => t.theme),
      celestialContext: {
        capturedAt: new Date().toISOString(),
        moonPhase: {
          phase: celestialContext.moonPhase.phase,
          sign: celestialContext.moonPhase.sign,
          illumination: celestialContext.moonPhase.illumination,
          isVoid: celestialContext.moonPhase.isVoid,
        },
        activeEvents: celestialContext.events.map(e => ({
          type: e.type,
          description: e.description,
          strength: e.strength
        }))
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Attach insight if found
    if (bestInsight) {
      entry.insight = {
        id: bestInsight.id,
        text: bestInsight.text,
        confidence: bestInsight.confidence,
        score: bestInsight.score,
        matchedTheme: bestInsight.themeMatch.theme,
        celestialEvent: {
          type: ('type' in bestInsight.celestialEvent) ? bestInsight.celestialEvent.type : 'transit',
          description: ('description' in bestInsight.celestialEvent) 
            ? bestInsight.celestialEvent.description 
            : `${(bestInsight.celestialEvent as any).transitingPlanet || 'Planet'} ${(bestInsight.celestialEvent as any).aspect || 'aspect'} ${(bestInsight.celestialEvent as any).natalPlanet || 'natal'}`,
          strength: bestInsight.celestialEvent.strength
        },
        usedBirthChart: bestInsight.requiresBirthChart,
        dismissed: false
      };
    }
    
    // Persist to localStorage
    const existing = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]');
    existing.push(entry);
    localStorage.setItem('heka_diary_entries', JSON.stringify(existing));
    
    // Sync to cloud if authenticated
    if (auth.isAuthenticated && auth.userId) {
      try {
        await syncToCloud(auth.userId, { diaryEntries: { [entry.id]: entry } });
      } catch (error) {
        console.error('Failed to sync diary entry:', error);
      }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 1: Update AI mood context after journal creation
    // ═══════════════════════════════════════════════════════════════════════════
    try {
      const allEntries = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]') as DiaryEntry[];
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
  async (payload: { entryId: string; content: string }, { getState }) => {
    const state = getState() as RootState;
    const { auth } = state.calendar;
    const existingEntry = state.diary.entries[payload.entryId];
    
    if (!existingEntry) {
      throw new Error('Entry not found');
    }
    
    // Re-analyze content
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
    
    const updatedEntry: DiaryEntry = {
      ...existingEntry,
      content: payload.content,
      detectedThemes: themes.map(t => t.theme),
      insight: updatedInsight,
      updatedAt: new Date().toISOString()
    };
    
    // Update localStorage
    const all = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]');
    const idx = all.findIndex((e: DiaryEntry) => e.id === payload.entryId);
    if (idx >= 0) {
      all[idx] = updatedEntry;
      localStorage.setItem('heka_diary_entries', JSON.stringify(all));
    }
    
    // Sync to cloud
    if (auth.isAuthenticated && auth.userId) {
      try {
        await syncToCloud(auth.userId, { diaryEntries: { [updatedEntry.id]: updatedEntry } });
      } catch (error) {
        console.error('Failed to sync diary update:', error);
      }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 1: Update AI mood context after journal update
    // ═══════════════════════════════════════════════════════════════════════════
    try {
      const allEntries = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]') as DiaryEntry[];
      const moodHistory = buildMoodHistory(allEntries);
      aiConfigService.setUserContext({
        moodHistory: moodHistory.slice(-30),
        lastJournalSnippet: payload.content.slice(0, 200),
        lastJournalDate: existingEntry.date,
        lastJournalThemes: updatedEntry.detectedThemes || [],
      });
    } catch (e) {
      console.error('[Diary] Failed to update AI mood context:', e);
    }
    
    return updatedEntry;
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
    
    // Update localStorage
    const all = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]');
    const filtered = all.filter((e: DiaryEntry) => e.id !== entryId);
    localStorage.setItem('heka_diary_entries', JSON.stringify(filtered));
    
    // Sync deletion to cloud
    if (auth.isAuthenticated && auth.userId) {
      try {
        await syncToCloud(auth.userId, { deletedDiaryEntries: [entryId] });
      } catch (error) {
        console.error('Failed to sync diary deletion:', error);
      }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 1: Recalculate AI mood context after journal deletion
    // ═══════════════════════════════════════════════════════════════════════════
    try {
      const allEntries = JSON.parse(localStorage.getItem('heka_diary_entries') || '[]') as DiaryEntry[];
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
    
    // Clear localStorage
    localStorage.removeItem('heka_diary_entries');
    
    // Sync clear to cloud
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
    // Create entry with FULL Oracle integration
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
    
    // Update entry with re-analysis
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
        // Merge cloud entries with local
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
      entry.insight?.text.toLowerCase().includes(query)
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export slice actions
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

// Export full Oracle thunks
export { 
  createDiaryEntry, 
  updateDiaryEntry, 
  deleteDiaryEntry, 
  clearAllDiaryEntries,
  syncDiaryFromCloud 
};

// Also export simplified versions as aliases for compatibility
export { 
  createEntry as createEntryLegacy, 
  updateEntry as updateEntryLegacy, 
  deleteEntry as deleteEntryLegacy, 
  generateInsight 
};

export default diarySlice.reducer;
