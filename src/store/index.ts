/**
 * Redux Store - Professional State Management
 * Centralized, immutable state with persistence
 */

import { configureStore, createSlice, createSelector } from '@reduxjs/toolkit';
import { setupReducer } from './setupSlice';

// ─── Extracted Reducer Modules ───
import * as navReducers from './slices/reducers/navigationReducers';
import * as settingsReducers from './slices/reducers/settingsReducers';
import * as authReducers from './slices/reducers/authReducers';
import * as contentReducers from './slices/reducers/contentReducers';
import * as progressReducers from './slices/reducers/progressReducers';
import { aiConfigService } from '../services/aiConfigService';
import type { 
  CalendarState, 
  NoteData, 
  UsageStatistics,
  UserProgress,
  AppEngagement,
  FeatureDiscoveryProgress,
} from '../types';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '../types/notifications';
import { getTodayHekaDate } from '../services/calendarService';

// ============================================================================
// Admin / Pro Access
// ============================================================================

// ============================================================================
// Initial Statistics
// ============================================================================

const initialStatistics: UsageStatistics = {
  totalNotes: 0,
  notesByCategory: {
    personal: 0, work: 0, spiritual: 0, family: 0, health: 0, creative: 0, general: 0,
  },
  notesByMonth: {},
  currentStreak: 0,
  longestStreak: 0,
  moodAverage: 0,
  moodEntryCount: 0,
  moodEntriesByMonth: {},
  moodByMonth: {},
  mostActiveMonth: { month: '', count: 0 },
  totalWords: 0,
};

const initialProgress: UserProgress = {
  level: 1,
  experience: 0,
  achievements: [],
  rewards: [],
  dailyRitualsCompleted: [],
  appEngagement: {
    // App Open Tracking
    totalAppOpens: 0,
    currentOpenStreak: 0,
    longestOpenStreak: 0,
    lastOpenDate: null,
    firstOpenDate: new Date().toISOString().split('T')[0],
    
    // Time Spent Tracking
    totalTimeSpent: 0,
    dailyTimeSpent: {},
    averageSessionLength: 0,
    longestSession: 0,
    
    // Exploration Tracking
    uniqueMonthsVisited: [],
    uniqueYearsVisited: [],
    uniqueLocationsViewed: [],
    
    // Feature Discovery
    featuresDiscovered: {},
    
    // Settings Exploration
    settingsExplored: {},
    themesTried: [],
    fontsTried: [],
    displayModesTried: [],
    customizationsMade: 0,
  },
  featureDiscovery: {
    // Core UI Features
    openedDateModal: false,
    openedDayPanel: false,
    openedCelestialGuide: false,
    openedOracleJournal: false,
    openedProfileManager: false,
    
    // Calendar Views & Interactions
    usedTodayButton: false,
    usedMonthNavigator: false,
    usedYearNavigator: false,
    changedLocation: false,
    changedSubRegion: false,
    viewedDifferentMonth: false,
    viewedDifferentYear: false,
    
    // Feature Discovery & Toggles
    enabledMoonPhases: false,
    enabledTransits: false,
    enabledSeasonalEvents: false,
    enabledHolidays: false,
    enabledEnergyVote: false,
    enabledBirthChart: false,
    
    // Content Interactions
    votedOnEnergy: false,
    createdBirthChart: false,
    createdNote: false,
    printedCalendar: false,
    subscribedToCommunity: false,
    
    // Settings Explorations
    openedSettings: false,
    changedTheme: false,
    changedFont: false,
    changedDisplayMode: false,
    customizedColors: false,
    changedLocationSettings: false,
    
    // Social & Community
    viewedCommunityHolidays: false,
    suggestedHoliday: false,
    openedFriends: false,
  },
};

// ============================================================================
// Initial State
// ============================================================================

const today = getTodayHekaDate();

const initialState: CalendarState = {
  currentView: 'month',
  viewDate: today,
  selectedDate: null,
  timeMode: 'SYNC',
  location: 'AU',
  subRegion: null,
  theme: 'egyptian-gold',
  font: 'elegant',
  auth: {
    isAuthenticated: false,
    userId: null,
    email: null,
    displayName: null,
    photoURL: null,
    lastSync: null,
    isSyncing: false,
    syncError: null,
  },
  display: {
    showCivilDates: true,
    showMoonPhases: true,
    showHolidays: true,
    showCelestialCards: false,  // OFF by default
    pureModeLight: false,
  },
  ui: {
    isYearModalOpen: false,
    isSearchModalOpen: false,
    isShareModalOpen: false,
    isStatsModalOpen: false,
    isSettingsOpen: false,
    isLoading: false,
    error: null,
  },
  notes: {},
  statistics: initialStatistics,
  communityHolidays: [],
  communityFeatures: [],
  subscribedCalendars: [],
  pendingInvites: [],
  progress: initialProgress,
  astroProfiles: [],
  selectedAstroProfileId: null,
  astroPreferences: {
    enableDailyTips: false,
    enableRetrogradeAlerts: false,
    enableMoonPhaseAlerts: false,
    showTransitsOnCalendar: false,
    zodiacSystem: '12-sign',
    zodiacFrame: 'tropical',
    signCount: 12,
    houseSystem: 'placidus',
    ayanamsa: null,
    showNakshatras: false,
    nakshatraSystem: 'none',
  },
  subscription: {
    isPro: false,
    tier: null,
    expiryDate: null,
    purchasedProductIds: [],
  },
  notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
};

// ============================================================================
// Helper Functions
// ============================================================================



// Sync calendar statistics to AI coach context
function normalizeCalendarMood(mood: number): { score: number; magnitude: number; label: 'positive' | 'neutral' | 'negative' } | null {
  if (!Number.isFinite(mood) || mood < 1 || mood > 5 || Math.floor(mood) !== mood) {
    return null;
  }
  const score = mood === 1 ? -1 : mood === 2 ? -0.5 : mood === 3 ? 0 : mood === 4 ? 0.5 : 1;
  const magnitude = mood === 1 || mood === 5 ? 1 : mood === 2 || mood === 4 ? 0.75 : 0.5;
  const label: 'positive' | 'neutral' | 'negative' = mood >= 4 ? 'positive' : mood <= 2 ? 'negative' : 'neutral';
  return { score, magnitude, label };
}



function syncCalendarStatsToAI(stats: UsageStatistics) {
  aiConfigService.setUserContext({
    writingStreak: stats.currentStreak,
    longestWritingStreak: stats.longestStreak,
    moodAverage: Math.round(stats.moodAverage * 10) / 10,
    totalNotes: stats.totalNotes,
    lastNoteDate: stats.lastNoteDate,
  });
}

function syncCalendarMoodToAI(notes: Record<string, NoteData[]>) {
  const allNotes = Object.values(notes).flat();
  const notesWithMood = allNotes.filter((n) => n.mood);
  if (notesWithMood.length === 0) return;

  const latestNote = notesWithMood[notesWithMood.length - 1];
  if (!latestNote.mood) return;

  const normalized = normalizeCalendarMood(latestNote.mood);
  if (!normalized) return;
  const currentHistory = aiConfigService.getUserContext().moodHistory || [];
  const today = new Date().toISOString().split('T')[0];

  // Check if we already have an entry for today from calendar notes
  const todayEntry = currentHistory.find((h) => h.date === today && h.entryCount === 1 && Math.abs(h.score) <= 1);
  if (todayEntry && todayEntry.score === normalized.score) return; // Already synced

  const newEntry = {
    date: today,
    score: normalized.score,
    label: normalized.label,
    magnitude: normalized.magnitude,
    entryCount: 1,
  };

  aiConfigService.setUserContext({
    moodHistory: [...currentHistory, newEntry].slice(-30),
  });
}

// ============================================================================
// Slice Definition
// ============================================================================

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    ...navReducers,
    ...settingsReducers,
    ...authReducers,
    ...contentReducers,
    ...progressReducers,
  },
});

// Export actions
export const {
  navigateToMonth,
  navigateToToday,
  prevMonth,
  nextMonth,
  navigateToPrevYear,
  navigateToNextYear,
  selectDate,
  toggleDisplay,
  setDisplay,
  setView,
  openModal,
  closeModal,
  setError,
  setLoading,
  addNote,
  updateNote,
  deleteNote,
  deleteDuplicates,
  loadNotes,
  moveNote,
  updateStatistics,
  resetStatistics,
  setLocation,
  setSubRegion,
  syncToLocalToday,
  setPrintMode,
  toggleTimeMode,
  setTimeMode,
  setCommunityHolidays,
  addCommunityHoliday,
  updateCommunityHoliday,
  voteForHoliday,
  setCommunityFeatures,
  addCommunityFeature,
  voteForFeature,
  addInvite,
  respondToInvite,
  subscribeToCalendar,
  unsubscribeFromCalendar,
  unlockAchievement,
  completeRitual,
  resetDailyRituals,
  claimReward,
  addAstroProfile,
  deleteAstroProfile,
  selectAstroProfile,
  setAstroProfile,
  updateAstroPreferences,
  toggleAstroPreference,
  updateNotificationPreferences,
  toggleNotificationPreference,
  setGlobalNotificationsEnabled,
  resetNotificationPreferences,
  setNotificationMode,
  setTheme,
  setFont,
  setAuthState,
  setAuthenticated,
  setUnauthenticated,
  setSyncing,
  setSyncError,
  setLastSync,
  updateUserProfile,
  // Phase 1: App Engagement Actions
  trackAppOpen,
  trackTimeSpent,
  trackMonthVisit,
  discoverFeature,
  trackSettingsExplored,
  trackThemeChange,
  trackFontChange,
  trackDisplayChange,
  trackLocationChange,
  setProSubscription,
  addPurchasedProduct,
} = calendarSlice.actions;

// ============================================================================
// Persistence Middleware - Load BEFORE store creation
// ============================================================================

interface PersistedState {
  display?: CalendarState['display'];
  location?: CalendarState['location'];
  subRegion?: CalendarState['subRegion'];
  timeMode?: CalendarState['timeMode'];
  theme?: CalendarState['theme'];
  font?: CalendarState['font'];
  auth?: CalendarState['auth'];
  notes?: CalendarState['notes'];
  statistics?: CalendarState['statistics'];
  subscribedCalendars?: CalendarState['subscribedCalendars'];
  progress?: CalendarState['progress'];
  astroProfiles?: CalendarState['astroProfiles'];
  selectedAstroProfileId?: CalendarState['selectedAstroProfileId'];
  astroPreferences?: CalendarState['astroPreferences'];
  diaryPreferences?: import('../oracle/diaryTypes').JournalPreferences;
  // Phase 1: App Engagement
  appEngagement?: AppEngagement;
  featureDiscovery?: FeatureDiscoveryProgress;
  subscription?: CalendarState['subscription'];
  notificationPreferences?: CalendarState['notificationPreferences'];
  // Legacy migration fields
  plannerPreferences?: { enableTaskNotifications?: boolean; };
}

function loadPersistedStateRaw(): PersistedState | undefined {
  try {
    const serialized = localStorage.getItem('heka-calendar-state');
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (err) {
    console.error('Failed to load persisted state:', err);
  }
  return undefined;
}

// Load persisted state immediately
const persistedState = loadPersistedStateRaw();

// Merge with initial state
const preloadedState: { calendar: CalendarState; diary?: any } | undefined = persistedState
  ? {
      calendar: {
        ...initialState,
        ...persistedState,
        // Ensure nested objects are merged properly
        display: { 
          ...initialState.display, 
          ...(persistedState.display || {}),
          // Migration: if any old celestial card filters were enabled, enable the unified toggle
          showCelestialCards: (
            (persistedState.display as Record<string, boolean> | undefined)?.showCelestialCards 
            || (persistedState.display as Record<string, boolean> | undefined)?.showSeasonalEvents 
            || (persistedState.display as Record<string, boolean> | undefined)?.showAgriculturalGuidance 
            || (persistedState.display as Record<string, boolean> | undefined)?.showEnergyForecast
          ) ?? initialState.display.showCelestialCards,
        },
        ui: { ...initialState.ui },
        statistics: persistedState.statistics || initialState.statistics,
        progress: persistedState.progress || initialState.progress,
        theme: persistedState.theme || initialState.theme,
        font: persistedState.font || initialState.font,
        auth: initialState.auth, // Reset auth - Firebase will restore actual state
        // Preserve persisted notes!
        notes: persistedState.notes || {},
        // Preserve astro profiles
        astroProfiles: persistedState.astroProfiles || [],
        selectedAstroProfileId: persistedState.selectedAstroProfileId || null,
        astroPreferences: persistedState.astroPreferences || initialState.astroPreferences,
        subscription: persistedState.subscription || initialState.subscription,
        // Migrate notification preferences with defaults and old preference mapping
        notificationPreferences: {
          ...DEFAULT_NOTIFICATION_PREFERENCES,
          ...(persistedState.notificationPreferences || {}),
          // Migration: map old astro preferences to new notification preferences
          stars: {
            ...DEFAULT_NOTIFICATION_PREFERENCES.stars,
            ...(persistedState.notificationPreferences?.stars || {}),
            dailyCelestialTips: persistedState.astroPreferences?.enableDailyTips ?? (persistedState.notificationPreferences?.stars?.dailyCelestialTips ?? DEFAULT_NOTIFICATION_PREFERENCES.stars.dailyCelestialTips),
            retrogradeAlerts: persistedState.astroPreferences?.enableRetrogradeAlerts ?? (persistedState.notificationPreferences?.stars?.retrogradeAlerts ?? DEFAULT_NOTIFICATION_PREFERENCES.stars.retrogradeAlerts),
          },
          // Migration: map old planner preferences
          planner: {
            ...DEFAULT_NOTIFICATION_PREFERENCES.planner,
            ...(persistedState.notificationPreferences?.planner || {}),
            taskReminders: persistedState.plannerPreferences?.enableTaskNotifications ?? (persistedState.notificationPreferences?.planner?.taskReminders ?? DEFAULT_NOTIFICATION_PREFERENCES.planner.taskReminders),
          },
          // Ensure all sections get deep-merged defaults
          calendar: {
            ...DEFAULT_NOTIFICATION_PREFERENCES.calendar,
            ...(persistedState.notificationPreferences?.calendar || {}),
          },
          circle: {
            ...DEFAULT_NOTIFICATION_PREFERENCES.circle,
            ...(persistedState.notificationPreferences?.circle || {}),
          },
          journal: {
            ...DEFAULT_NOTIFICATION_PREFERENCES.journal,
            ...(persistedState.notificationPreferences?.journal || {}),
          },
          quietHours: {
            ...DEFAULT_NOTIFICATION_PREFERENCES.quietHours,
            ...(persistedState.notificationPreferences?.quietHours || {}),
          },
        },
      },
      // Diary state with persisted preferences
      diary: persistedState?.diaryPreferences ? {
        entries: {},
        entriesByDate: {},
        selectedDate: new Date().toISOString().split('T')[0],
        editingEntryId: null,
        preferences: persistedState.diaryPreferences,
        ui: {
          isLoading: false,
          isSyncing: false,
          lastSyncAt: null,
          searchQuery: '',
          viewMode: 'calendar'
        }
      } : undefined,
    }
  : undefined;

// ============================================================================
// Store Configuration
// ============================================================================

import { default as astrologyReducer } from '../astrology/store/slice';
import diaryReducer from './diarySlice';
import tutorialReducer from './tutorialSlice';
import { persistSetupState } from './setupSlice';
import friendsReducer from './friendsSlice';
import plannerReducer from './plannerSlice';

export const store = configureStore({
  reducer: {
    calendar: calendarSlice.reducer,
    astrology: astrologyReducer,
    diary: diaryReducer,
    tutorial: tutorialReducer,
    friends: friendsReducer,
    planner: plannerReducer,
    setup: setupReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these non-serializable paths during dev warnings
        ignoredPaths: ['calendar.auth.lastSync', 'calendar.notes'],
      },
      immutableCheck: true,
    }),
  devTools: false,
});

// Sync calendar data to AI coach context whenever notes change (debounced)
let lastNotesHash = '';
let pendingSyncState: RootState | null = null;
let syncTimeout: ReturnType<typeof setTimeout> | null = null;

store.subscribe(() => {
  const state = store.getState();
  // Hash includes note count, IDs, moods, categories, and content lengths
  // so edits, deletes, and mood changes all trigger sync
  const notes = state.calendar.notes;
  const allNotes = Object.values(notes).flat();
  const notesHash = allNotes
    .map((n) => `${n.id}:${n.mood ?? ''}:${n.category}:${n.content.length}:${n.updatedAt ?? n.createdAt}`)
    .sort()
    .join('|');
  if (notesHash !== lastNotesHash) {
    lastNotesHash = notesHash;
    pendingSyncState = state;
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncTimeout = null;
      if (pendingSyncState) {
        syncCalendarStatsToAI(pendingSyncState.calendar.statistics);
        syncCalendarMoodToAI(pendingSyncState.calendar.notes);
        pendingSyncState = null;
      }
    }, 500);
  }
});

// Export types
export type RootState = ReturnType<typeof store.getState>;

// Re-export diary selectors
export { 
  selectAllEntries as selectDiaryEntries,
  selectAllEntries,
  selectEntriesByDate,
  selectJournalPreferences,
} from './diarySlice';
export type AppDispatch = typeof store.dispatch;

// ============================================================================
// Persistence Middleware - Save on changes
// ============================================================================

// Export load function for external use (returns any to avoid circular ref)
export function loadPersistedState(): any {
  return loadPersistedStateRaw();
}

export function persistState(state: RootState): void {
  try {
    const serialized = JSON.stringify({
      display: state.calendar.display,
      location: state.calendar.location,
      subRegion: state.calendar.subRegion,
      timeMode: state.calendar.timeMode,
      theme: state.calendar.theme,
      font: state.calendar.font,
      auth: state.calendar.auth,
      notes: state.calendar.notes,
      statistics: state.calendar.statistics,
      subscribedCalendars: state.calendar.subscribedCalendars,
      progress: state.calendar.progress,
      astroProfiles: state.calendar.astroProfiles,
      selectedAstroProfileId: state.calendar.selectedAstroProfileId,
      astroPreferences: state.calendar.astroPreferences,
      notificationPreferences: state.calendar.notificationPreferences,
      // Persist diary preferences
      diaryPreferences: state.diary?.preferences,
      // Phase 1: App Engagement persistence
      appEngagement: state.calendar.progress.appEngagement,
      featureDiscovery: state.calendar.progress.featureDiscovery,
      subscription: state.calendar.subscription,
    });
    localStorage.setItem('heka-calendar-state', serialized);
  } catch (err) {
    console.error('Failed to persist state:', err);
  }
}

// Subscribe to store changes for persistence
let previousState = store.getState();
let isFirstRun = true;
let persistTimeout: ReturnType<typeof setTimeout> | null = null;

store.subscribe(() => {
  const currentState = store.getState();
  
  // Skip first run to avoid persisting preloaded state immediately
  if (isFirstRun) {
    isFirstRun = false;
    previousState = currentState;
    return;
  }
  
  // Persist calendar state when it changes
  if (currentState.calendar !== previousState.calendar) {
    // Debounce persistence to prevent excessive writes
    if (persistTimeout) {
      clearTimeout(persistTimeout);
    }
    persistTimeout = setTimeout(() => {
      persistState(currentState);
      // Only log occasionally to reduce console spam
      if (Math.random() < 0.1) {
        console.log('[Persistence] Calendar state saved');
      }
    }, 500);
  }

  // Persist setup state when it changes (safety net — also persisted by SetupWizard)
  if (currentState.setup !== previousState.setup) {
    persistSetupState(currentState.setup);
  }

  previousState = currentState;
});

// ============================================================================
// Memoized Selectors for Performance
// ============================================================================

const selectCalendar = (state: RootState) => state.calendar;
const selectViewDate = (state: RootState) => state.calendar.viewDate;
const selectSelectedDate = (state: RootState) => state.calendar.selectedDate;
const selectNotes = (state: RootState) => state.calendar.notes;
const selectDisplay = (state: RootState) => state.calendar.display;
const selectLocation = (state: RootState) => state.calendar.location;

/** Memoized selector for calendar grid data - prevents recalculation on unrelated state changes */
export const selectCalendarGridData = createSelector(
  [selectViewDate, selectSelectedDate, selectNotes, selectDisplay, selectLocation],
  (viewDate, selectedDate, notes, display, location) => ({
    viewDate,
    selectedDate,
    notes,
    display,
    location,
  })
);

/** Memoized selector for day panel data */
export const selectDayPanelData = createSelector(
  [selectSelectedDate, selectNotes, selectDisplay, selectLocation],
  (selectedDate, notes, display, location) => ({
    selectedDate,
    notes,
    display,
    location,
  })
);

/** Memoized selector for month header data */
export const selectMonthHeaderData = createSelector(
  [selectViewDate, selectCalendar],
  (viewDate, calendar) => ({
    viewDate,
    timeMode: calendar.timeMode,
    location: calendar.location,
  })
);

/** Memoized selector for selected astro profile */
export const selectSelectedAstroProfile = createSelector(
  [selectCalendar],
  (calendar) => {
    if (!calendar.selectedAstroProfileId) return null;
    return calendar.astroProfiles.find(p => p.id === calendar.selectedAstroProfileId) || null;
  }
);

/** Memoized selector for all astro profiles */
export const selectAllAstroProfiles = createSelector(
  [selectCalendar],
  (calendar) => calendar.astroProfiles
);
