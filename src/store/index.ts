/**
 * Redux Store - Professional State Management
 * Centralized, immutable state with persistence
 */

import { configureStore, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { 
  CalendarState, 
  HekaDate, 
  PrintMode, 
  CountryCode, 
  NoteData, 
  NoteCategory,
  RecurringConfig,
  UsageStatistics,
  CommunityHoliday,
  CalendarInvite,
  UserProgress,
  UnlockedAchievement,
  DayNotes,
  AppEngagement,
  FeatureDiscoveryProgress,
  FeatureDiscoveryKey,
} from '../types';
import { SUB_REGIONS } from '../types';
import type { ThemeId, FontId } from '../types/themes';
import { getTodayHekaDate, getTodayHekaDateInTimezone } from '../services/calendarService';

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
    showSeasonalEvents: false,  // OFF by default
    showAgriculturalGuidance: false,  // OFF by default
    showEnergyForecast: false,  // OFF by default
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
  subscribedCalendars: [],
  pendingInvites: [],
  progress: initialProgress,
  astroProfiles: [],
  selectedAstroProfileId: null,
  astroPreferences: {
    enableDailyTips: true,
    enableRetrogradeAlerts: true,
    enableMoonPhaseAlerts: true,
    showTransitsOnCalendar: true,
    zodiacSystem: '12-sign' as '12-sign' | '13-sign',
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

function updateStatisticsOnNoteAdd(
  stats: UsageStatistics, 
  note: NoteData,
  isFirstNoteOfDay: boolean
): UsageStatistics {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Update total notes
  const newTotalNotes = stats.totalNotes + 1;
  
  // Update category count
  const newNotesByCategory = {
    ...stats.notesByCategory,
    [note.category]: (stats.notesByCategory[note.category] || 0) + 1,
  };
  
  // Update monthly count
  const newNotesByMonth = {
    ...stats.notesByMonth,
    [monthKey]: (stats.notesByMonth[monthKey] || 0) + 1,
  };
  
  // Update streak only if it's the first note of the day
  let newCurrentStreak = stats.currentStreak;
  let newLongestStreak = stats.longestStreak;
  let newLastNoteDate = stats.lastNoteDate;
  
  if (isFirstNoteOfDay) {
    const lastNoteDate = stats.lastNoteDate ? new Date(stats.lastNoteDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (lastNoteDate) {
      const lastDate = new Date(lastNoteDate);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newCurrentStreak = stats.currentStreak + 1;
      } else if (diffDays > 1) {
        newCurrentStreak = 1;
      }
      
      if (newCurrentStreak > stats.longestStreak) {
        newLongestStreak = newCurrentStreak;
      }
    } else {
      newCurrentStreak = 1;
      newLongestStreak = 1;
    }
    newLastNoteDate = now.toISOString();
  }
  
  // Update mood average
  let newMoodAverage = stats.moodAverage;
  if (note.mood) {
    const totalMoodEntries = Object.values(stats.notesByCategory).reduce((a, b) => a + b, 0);
    newMoodAverage = ((stats.moodAverage * totalMoodEntries) + note.mood) / (totalMoodEntries + 1);
  }
  
  // Update mood by month
  const newMoodByMonth = { ...stats.moodByMonth };
  if (note.mood) {
    const monthMoodTotal = (stats.moodByMonth[monthKey] || 0) * (stats.notesByMonth[monthKey] || 0);
    const monthCount = (stats.notesByMonth[monthKey] || 0) + 1;
    newMoodByMonth[monthKey] = (monthMoodTotal + note.mood) / monthCount;
  }
  
  // Update word count
  const wordCount = note.content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const newTotalWords = stats.totalWords + wordCount;
  
  // Find most active month
  const mostActiveEntry = Object.entries(newNotesByMonth).sort((a, b) => b[1] - a[1])[0];
  const newMostActiveMonth = mostActiveEntry 
    ? { month: mostActiveEntry[0], count: mostActiveEntry[1] }
    : stats.mostActiveMonth;
  
  return {
    totalNotes: newTotalNotes,
    notesByCategory: newNotesByCategory,
    notesByMonth: newNotesByMonth,
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastNoteDate: newLastNoteDate,
    moodAverage: Math.round(newMoodAverage * 10) / 10,
    moodByMonth: newMoodByMonth,
    mostActiveMonth: newMostActiveMonth,
    totalWords: newTotalWords,
  };
}

// ============================================================================
// Slice Definition
// ============================================================================

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // Navigation
    navigateToMonth: (state, action: PayloadAction<{ year: number; month: number }>) => {
      state.viewDate = {
        year: action.payload.year,
        month: action.payload.month as HekaDate['month'],
        day: 1,
      };
      state.currentView = 'month';
    },
    
    navigateToToday: (state) => {
      const today = getTodayHekaDate();
      state.viewDate = today;
      state.selectedDate = today;
      state.currentView = 'month';
    },
    
    prevMonth: (state) => {
      if (state.viewDate.month === 0) {
        state.viewDate.month = 12;
        state.viewDate.year -= 1;
      } else {
        state.viewDate.month = (state.viewDate.month - 1) as HekaDate['month'];
      }
    },
    
    nextMonth: (state) => {
      if (state.viewDate.month === 12) {
        state.viewDate.month = 0;
        state.viewDate.year += 1;
      } else {
        state.viewDate.month = (state.viewDate.month + 1) as HekaDate['month'];
      }
    },
    
    navigateToPrevYear: (state) => {
      state.viewDate.year -= 1;
    },
    
    navigateToNextYear: (state) => {
      state.viewDate.year += 1;
    },
    
    // Selection
    selectDate: (state, action: PayloadAction<HekaDate | null>) => {
      state.selectedDate = action.payload;
    },
    
    // Display toggles
    toggleDisplay: (state, action: PayloadAction<keyof CalendarState['display']>) => {
      const key = action.payload;
      state.display[key] = !state.display[key];
    },
    
    setDisplay: (state, action: PayloadAction<Partial<CalendarState['display']>>) => {
      state.display = { ...state.display, ...action.payload };
    },
    
    // View switching
    setView: (state, action: PayloadAction<CalendarState['currentView']>) => {
      state.currentView = action.payload;
    },
    
    // Theme switching
    setTheme: (state, action: PayloadAction<ThemeId>) => {
      state.theme = action.payload;
    },
    
    // Font switching
    setFont: (state, action: PayloadAction<FontId>) => {
      state.font = action.payload;
    },
    
    // Auth state
    setAuthState: (state, action: PayloadAction<Partial<CalendarState['auth']>>) => {
      state.auth = { ...state.auth, ...action.payload };
    },
    
    setAuthenticated: (state, action: PayloadAction<{ 
      userId: string; 
      email: string; 
      displayName: string | null;
      photoURL: string | null;
    }>) => {
      state.auth.isAuthenticated = true;
      state.auth.userId = action.payload.userId;
      state.auth.email = action.payload.email;
      state.auth.displayName = action.payload.displayName;
      state.auth.photoURL = action.payload.photoURL;
      state.auth.syncError = null;
    },
    
    setUnauthenticated: (state) => {
      state.auth.isAuthenticated = false;
      state.auth.userId = null;
      state.auth.email = null;
      state.auth.displayName = null;
      state.auth.photoURL = null;
      state.auth.lastSync = null;
    },
    
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.auth.isSyncing = action.payload;
    },
    
    setSyncError: (state, action: PayloadAction<string | null>) => {
      state.auth.syncError = action.payload;
    },
    
    updateUserProfile: (state, action: PayloadAction<{
      userId?: string;
      email?: string;
      displayName?: string | null;
      photoURL?: string | null;
    }>) => {
      if (action.payload.userId !== undefined) state.auth.userId = action.payload.userId;
      if (action.payload.email !== undefined) state.auth.email = action.payload.email;
      if (action.payload.displayName !== undefined) state.auth.displayName = action.payload.displayName;
      if (action.payload.photoURL !== undefined) state.auth.photoURL = action.payload.photoURL;
    },
    
    setLastSync: (state, action: PayloadAction<string>) => {
      state.auth.lastSync = action.payload;
    },
    
    // UI state
    openModal: (state, action: PayloadAction<keyof CalendarState['ui']>) => {
      const key = action.payload;
      if (key.startsWith('is') && key.endsWith('Open')) {
        (state.ui as any)[key] = true;
      }
    },
    
    closeModal: (state, action: PayloadAction<keyof CalendarState['ui']>) => {
      const key = action.payload;
      if (key.startsWith('is') && key.endsWith('Open')) {
        (state.ui as any)[key] = false;
      }
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.ui.error = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.ui.isLoading = action.payload;
    },
    
    // Enhanced Notes System - Multiple notes per day
    addNote: (state, action: PayloadAction<{ 
      key: string; 
      content: string;
      category?: NoteCategory;
      mood?: 1 | 2 | 3 | 4 | 5;
      recurring?: RecurringConfig;
      duplicatedFrom?: string;
    }>) => {
      const now = new Date().toISOString();
      const noteData: NoteData = {
        id: `${action.payload.key}-${Date.now()}`,
        content: action.payload.content,
        category: action.payload.category || 'general',
        mood: action.payload.mood,
        recurring: action.payload.recurring,
        duplicatedFrom: action.payload.duplicatedFrom,
        createdAt: now,
        updatedAt: now,
      };
      
      // Check if this is the first note of the day
      const isFirstNoteOfDay = !state.notes[action.payload.key] || state.notes[action.payload.key].length === 0;
      
      // Initialize array if needed
      if (!state.notes[action.payload.key]) {
        state.notes[action.payload.key] = [];
      }
      
      // Add note to the array
      state.notes[action.payload.key].push(noteData);
      
      // Update statistics
      state.statistics = updateStatisticsOnNoteAdd(state.statistics, noteData, isFirstNoteOfDay);
    },
    
    deleteNote: (state, action: PayloadAction<{ dayKey: string; noteId: string }>) => {
      const { dayKey, noteId } = action.payload;
      if (state.notes[dayKey]) {
        state.notes[dayKey] = state.notes[dayKey].filter(n => n.id !== noteId);
        // Clean up empty arrays
        if (state.notes[dayKey].length === 0) {
          delete state.notes[dayKey];
        }
      }
    },
    
    deleteDuplicates: (state, action: PayloadAction<{ sourceNoteId: string }>) => {
      // Delete all notes that were duplicated from the source note
      Object.keys(state.notes).forEach(dayKey => {
        state.notes[dayKey] = state.notes[dayKey].filter(n => n.duplicatedFrom !== action.payload.sourceNoteId);
        // Clean up empty arrays
        if (state.notes[dayKey].length === 0) {
          delete state.notes[dayKey];
        }
      });
    },
    
    loadNotes: (state, action: PayloadAction<Record<string, DayNotes>>) => {
      state.notes = action.payload;
    },
    
    moveNote: (state, action: PayloadAction<{ fromKey: string; toKey: string; noteId: string }>) => {
      const { fromKey, toKey, noteId } = action.payload;
      if (state.notes[fromKey]) {
        const noteIndex = state.notes[fromKey].findIndex(n => n.id === noteId);
        if (noteIndex >= 0) {
          const [note] = state.notes[fromKey].splice(noteIndex, 1);
          note.updatedAt = new Date().toISOString();
          
          if (!state.notes[toKey]) {
            state.notes[toKey] = [];
          }
          state.notes[toKey].push(note);
          
          // Clean up empty arrays
          if (state.notes[fromKey].length === 0) {
            delete state.notes[fromKey];
          }
        }
      }
    },
    
    // Statistics
    updateStatistics: (state, action: PayloadAction<Partial<UsageStatistics>>) => {
      state.statistics = { ...state.statistics, ...action.payload };
    },
    
    resetStatistics: (state) => {
      state.statistics = initialStatistics;
    },
    
    // Print
    setPrintMode: (state, action: PayloadAction<PrintMode>) => {
      if (action.payload) {
        state.currentView = 'print-preview';
      } else if (state.currentView === 'print-preview') {
        state.currentView = 'month';
      }
    },
    
    // Time Mode (SYNC / TRUE)
    toggleTimeMode: (state) => {
      state.timeMode = state.timeMode === 'SYNC' ? 'TRUE' : 'SYNC';
    },
    
    // Location
    setLocation: (state, action: PayloadAction<CountryCode>) => {
      state.location = action.payload;
      // Reset subRegion when country changes
      state.subRegion = null;
    },
    
    // Sub-region (state/province)
    setSubRegion: (state, action: PayloadAction<string | null>) => {
      state.subRegion = action.payload;
    },
    
    // Sync view date to "today" in the selected location's timezone
    // This ensures "today" reflects the correct date for the chosen location
    syncToLocalToday: (state) => {
      // Get timezone from location settings
      const locationData = state.subRegion 
        ? SUB_REGIONS[state.location]?.find(r => r.code === state.subRegion)
        : null;
      const timezone = locationData?.timezone;
      
      // Use timezone-aware calculation if available
      const today = timezone 
        ? getTodayHekaDateInTimezone(timezone)
        : getTodayHekaDate();
        
      state.viewDate = today;
      // Clear selected date when syncing to today
      state.selectedDate = null;
    },
    
    // Community Holidays (Social Feature)
    addCommunityHoliday: (state, action: PayloadAction<CommunityHoliday>) => {
      state.communityHolidays.push(action.payload);
    },
    
    voteForHoliday: (state, action: PayloadAction<string>) => {
      const holiday = state.communityHolidays.find(h => h.id === action.payload);
      if (holiday) {
        holiday.votes += 1;
      }
    },
    
    // Calendar Invites
    addInvite: (state, action: PayloadAction<CalendarInvite>) => {
      state.pendingInvites.push(action.payload);
    },
    
    respondToInvite: (state, action: PayloadAction<{ inviteId: string; accept: boolean }>) => {
      const invite = state.pendingInvites.find(i => i.id === action.payload.inviteId);
      if (invite) {
        invite.status = action.payload.accept ? 'accepted' : 'declined';
      }
    },
    
    subscribeToCalendar: (state, action: PayloadAction<string>) => {
      if (!state.subscribedCalendars.includes(action.payload)) {
        state.subscribedCalendars.push(action.payload);
      }
    },
    
    unsubscribeFromCalendar: (state, action: PayloadAction<string>) => {
      state.subscribedCalendars = state.subscribedCalendars.filter(id => id !== action.payload);
    },
    
    // Gamification
    unlockAchievement: (state, action: PayloadAction<UnlockedAchievement>) => {
      state.progress.achievements.push(action.payload);
    },
    
    completeRitual: (state, action: PayloadAction<string>) => {
      if (!state.progress.dailyRitualsCompleted.includes(action.payload)) {
        state.progress.dailyRitualsCompleted.push(action.payload);
      }
    },
    
    resetDailyRituals: (state) => {
      state.progress.dailyRitualsCompleted = [];
    },
    
    claimReward: (state, action: PayloadAction<string>) => {
      if (!state.progress.rewards.includes(action.payload)) {
        state.progress.rewards.push(action.payload);
      }
    },
    
    // Astrology - Multiple Profiles
    addAstroProfile: (state, action: PayloadAction<import('../types/astrology').AstroProfile>) => {
      const profile = action.payload;
      // Check if profile with same name exists, replace it
      const existingIndex = state.astroProfiles.findIndex(p => p.id === profile.id);
      if (existingIndex >= 0) {
        state.astroProfiles[existingIndex] = profile;
      } else {
        state.astroProfiles.push(profile);
      }
      state.selectedAstroProfileId = profile.id;
    },
    
    deleteAstroProfile: (state, action: PayloadAction<string>) => {
      const profileId = action.payload;
      state.astroProfiles = state.astroProfiles.filter(p => p.id !== profileId);
      if (state.selectedAstroProfileId === profileId) {
        state.selectedAstroProfileId = state.astroProfiles[0]?.id || null;
      }
    },
    
    selectAstroProfile: (state, action: PayloadAction<string | null>) => {
      state.selectedAstroProfileId = action.payload;
    },
    
    // Legacy - keep for compatibility
    setAstroProfile: (state, action: PayloadAction<import('../types/astrology').AstroProfile | null>) => {
      if (action.payload) {
        const profile = action.payload;
        const existingIndex = state.astroProfiles.findIndex(p => p.id === profile.id);
        if (existingIndex >= 0) {
          state.astroProfiles[existingIndex] = profile;
        } else {
          state.astroProfiles.push(profile);
        }
        state.selectedAstroProfileId = profile.id;
      }
    },
    
    updateAstroPreferences: (state, action: PayloadAction<Partial<CalendarState['astroPreferences']>>) => {
      console.log('[Store] updateAstroPreferences called with:', action.payload);
      state.astroPreferences = { ...state.astroPreferences, ...action.payload };
      console.log('[Store] New astroPreferences:', state.astroPreferences);
    },
    
    toggleAstroPreference: (state, action: PayloadAction<'enableDailyTips' | 'enableRetrogradeAlerts' | 'enableMoonPhaseAlerts' | 'showTransitsOnCalendar'>) => {
      const key = action.payload;
      state.astroPreferences[key] = !state.astroPreferences[key];
    },
    
    // ============================================================================
    // Phase 1: App Engagement Tracking
    // ============================================================================
    
    // App Open Tracking - Call when app initializes
    trackAppOpen: (state) => {
      const today = new Date().toISOString().split('T')[0];
      
      // Ensure appEngagement exists (for users with old persisted state)
      if (!state.progress.appEngagement) {
        state.progress.appEngagement = {
          totalAppOpens: 0,
          currentOpenStreak: 0,
          longestOpenStreak: 0,
          lastOpenDate: null,
          firstOpenDate: today,
          totalTimeSpent: 0,
          dailyTimeSpent: {},
          averageSessionLength: 0,
          longestSession: 0,
          uniqueMonthsVisited: [],
          uniqueYearsVisited: [],
          uniqueLocationsViewed: [],
          featuresDiscovered: {},
          settingsExplored: {},
          themesTried: [],
          fontsTried: [],
          displayModesTried: [],
          customizationsMade: 0,
        };
      }
      
      const engagement = state.progress.appEngagement;
      
      // Increment total opens
      engagement.totalAppOpens += 1;
      
      // Update streak
      if (engagement.lastOpenDate) {
        const lastDate = new Date(engagement.lastOpenDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day
          engagement.currentOpenStreak += 1;
        } else if (diffDays > 1) {
          // Streak broken
          engagement.currentOpenStreak = 1;
        }
        // If diffDays === 0, same day open - don't change streak
      } else {
        // First open ever
        engagement.currentOpenStreak = 1;
        engagement.firstOpenDate = today;
      }
      
      // Update longest streak
      if (engagement.currentOpenStreak > engagement.longestOpenStreak) {
        engagement.longestOpenStreak = engagement.currentOpenStreak;
      }
      
      engagement.lastOpenDate = today;
    },
    
    // Track time spent in app
    trackTimeSpent: (state, action: PayloadAction<{ minutes: number }>) => {
      const { minutes } = action.payload;
      const today = new Date().toISOString().split('T')[0];
      
      // Ensure appEngagement exists
      if (!state.progress.appEngagement) {
        state.progress.appEngagement = {
          totalAppOpens: 1,
          currentOpenStreak: 1,
          longestOpenStreak: 1,
          lastOpenDate: today,
          firstOpenDate: today,
          totalTimeSpent: 0,
          dailyTimeSpent: {},
          averageSessionLength: 0,
          longestSession: 0,
          uniqueMonthsVisited: [],
          uniqueYearsVisited: [],
          uniqueLocationsViewed: [],
          featuresDiscovered: {},
          settingsExplored: {},
          themesTried: [],
          fontsTried: [],
          displayModesTried: [],
          customizationsMade: 0,
        };
      }
      
      const engagement = state.progress.appEngagement;
      
      // Update total time
      engagement.totalTimeSpent += minutes;
      
      // Update daily time
      engagement.dailyTimeSpent[today] = (engagement.dailyTimeSpent[today] || 0) + minutes;
      
      // Update session stats
      if (minutes > engagement.longestSession) {
        engagement.longestSession = minutes;
      }
      
      // Recalculate average
      const totalSessions = engagement.totalAppOpens;
      engagement.averageSessionLength = totalSessions > 0 
        ? Math.round(engagement.totalTimeSpent / totalSessions)
        : 0;
    },
    
    // Track month visits for exploration
    trackMonthVisit: (state, action: PayloadAction<{ year: number; month: number }>) => {
      const { year, month } = action.payload;
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      
      // Ensure appEngagement exists
      if (!state.progress.appEngagement) {
        const today = new Date().toISOString().split('T')[0];
        state.progress.appEngagement = {
          totalAppOpens: 1,
          currentOpenStreak: 1,
          longestOpenStreak: 1,
          lastOpenDate: today,
          firstOpenDate: today,
          totalTimeSpent: 0,
          dailyTimeSpent: {},
          averageSessionLength: 0,
          longestSession: 0,
          uniqueMonthsVisited: [],
          uniqueYearsVisited: [],
          uniqueLocationsViewed: [],
          featuresDiscovered: {},
          settingsExplored: {},
          themesTried: [],
          fontsTried: [],
          displayModesTried: [],
          customizationsMade: 0,
        };
      }
      
      const engagement = state.progress.appEngagement;
      
      if (!engagement.uniqueMonthsVisited.includes(monthKey)) {
        engagement.uniqueMonthsVisited.push(monthKey);
      }
      
      if (!engagement.uniqueYearsVisited.includes(year)) {
        engagement.uniqueYearsVisited.push(year);
      }
      
      // Mark as viewing different month if not current month
      const todayDate = new Date();
      const isCurrentMonth = year === todayDate.getFullYear() && month === (todayDate.getMonth() + 1);
      if (!isCurrentMonth) {
        // Ensure featureDiscovery exists
        if (!state.progress.featureDiscovery) {
          state.progress.featureDiscovery = {} as any;
        }
        state.progress.featureDiscovery.viewedDifferentMonth = true;
      }
    },
    
    // Track feature discovery
    discoverFeature: (state, action: PayloadAction<{ feature: FeatureDiscoveryKey; timestamp?: number }>) => {
      const { feature, timestamp = Date.now() } = action.payload;
      
      // Ensure featureDiscovery exists
      if (!state.progress.featureDiscovery) {
        state.progress.featureDiscovery = {} as any;
      }
      
      // Ensure appEngagement exists
      if (!state.progress.appEngagement) {
        const today = new Date().toISOString().split('T')[0];
        state.progress.appEngagement = {
          totalAppOpens: 1,
          currentOpenStreak: 1,
          longestOpenStreak: 1,
          lastOpenDate: today,
          firstOpenDate: today,
          totalTimeSpent: 0,
          dailyTimeSpent: {},
          averageSessionLength: 0,
          longestSession: 0,
          uniqueMonthsVisited: [],
          uniqueYearsVisited: [],
          uniqueLocationsViewed: [],
          featuresDiscovered: {},
          settingsExplored: {},
          themesTried: [],
          fontsTried: [],
          displayModesTried: [],
          customizationsMade: 0,
        };
      }
      
      const discovery = state.progress.featureDiscovery;
      const engagement = state.progress.appEngagement;
      
      // Update boolean flag
      if (feature in discovery) {
        (discovery as any)[feature] = true;
      }
      
      // Track timestamp
      engagement.featuresDiscovered[feature] = timestamp;
    },
    
    // Track settings exploration
    trackSettingsExplored: (state, action: PayloadAction<{ setting: string; value?: any }>) => {
      const { setting } = action.payload;
      
      // Ensure appEngagement exists
      if (!state.progress.appEngagement) {
        const today = new Date().toISOString().split('T')[0];
        state.progress.appEngagement = {
          totalAppOpens: 1,
          currentOpenStreak: 1,
          longestOpenStreak: 1,
          lastOpenDate: today,
          firstOpenDate: today,
          totalTimeSpent: 0,
          dailyTimeSpent: {},
          averageSessionLength: 0,
          longestSession: 0,
          uniqueMonthsVisited: [],
          uniqueYearsVisited: [],
          uniqueLocationsViewed: [],
          featuresDiscovered: {},
          settingsExplored: {},
          themesTried: [],
          fontsTried: [],
          displayModesTried: [],
          customizationsMade: 0,
        };
      }
      
      const engagement = state.progress.appEngagement;
      
      engagement.settingsExplored[setting] = Date.now();
      engagement.customizationsMade += 1;
      
      // Track specific setting types
      if (setting.startsWith('theme:') && !engagement.themesTried.includes(setting)) {
        engagement.themesTried.push(setting);
      }
      if (setting.startsWith('font:') && !engagement.fontsTried.includes(setting)) {
        engagement.fontsTried.push(setting);
      }
      if (setting.startsWith('display:') && !engagement.displayModesTried.includes(setting)) {
        engagement.displayModesTried.push(setting);
      }
    },
    
    // Track theme changes
    trackThemeChange: (state, action: PayloadAction<{ themeId: string }>) => {
      const { themeId } = action.payload;
      
      // Ensure appEngagement and featureDiscovery exist
      if (!state.progress.appEngagement) {
        const today = new Date().toISOString().split('T')[0];
        state.progress.appEngagement = {
          totalAppOpens: 1,
          currentOpenStreak: 1,
          longestOpenStreak: 1,
          lastOpenDate: today,
          firstOpenDate: today,
          totalTimeSpent: 0,
          dailyTimeSpent: {},
          averageSessionLength: 0,
          longestSession: 0,
          uniqueMonthsVisited: [],
          uniqueYearsVisited: [],
          uniqueLocationsViewed: [],
          featuresDiscovered: {},
          settingsExplored: {},
          themesTried: [],
          fontsTried: [],
          displayModesTried: [],
          customizationsMade: 0,
        };
      }
      if (!state.progress.featureDiscovery) {
        state.progress.featureDiscovery = {} as any;
      }
      
      const engagement = state.progress.appEngagement;
      const discovery = state.progress.featureDiscovery;
      
      if (!engagement.themesTried.includes(themeId)) {
        engagement.themesTried.push(themeId);
      }
      
      discovery.changedTheme = true;
      engagement.settingsExplored[`theme:${themeId}`] = Date.now();
      engagement.customizationsMade += 1;
    },
    
    // Track font changes
    trackFontChange: (state, action: PayloadAction<{ fontId: string }>) => {
      const { fontId } = action.payload;
      
      // Ensure appEngagement and featureDiscovery exist
      if (!state.progress.appEngagement) {
        const today = new Date().toISOString().split('T')[0];
        state.progress.appEngagement = {
          totalAppOpens: 1,
          currentOpenStreak: 1,
          longestOpenStreak: 1,
          lastOpenDate: today,
          firstOpenDate: today,
          totalTimeSpent: 0,
          dailyTimeSpent: {},
          averageSessionLength: 0,
          longestSession: 0,
          uniqueMonthsVisited: [],
          uniqueYearsVisited: [],
          uniqueLocationsViewed: [],
          featuresDiscovered: {},
          settingsExplored: {},
          themesTried: [],
          fontsTried: [],
          displayModesTried: [],
          customizationsMade: 0,
        };
      }
      if (!state.progress.featureDiscovery) {
        state.progress.featureDiscovery = {} as any;
      }
      
      const engagement = state.progress.appEngagement;
      const discovery = state.progress.featureDiscovery;
      
      if (!engagement.fontsTried.includes(fontId)) {
        engagement.fontsTried.push(fontId);
      }
      
      discovery.changedFont = true;
      engagement.settingsExplored[`font:${fontId}`] = Date.now();
      engagement.customizationsMade += 1;
    },
    
    // Track display setting changes
    trackDisplayChange: (state, action: PayloadAction<{ setting: string; enabled: boolean }>) => {
      const { setting, enabled } = action.payload;
      
      // Ensure appEngagement and featureDiscovery exist
      if (!state.progress.appEngagement) {
        const today = new Date().toISOString().split('T')[0];
        state.progress.appEngagement = {
          totalAppOpens: 1,
          currentOpenStreak: 1,
          longestOpenStreak: 1,
          lastOpenDate: today,
          firstOpenDate: today,
          totalTimeSpent: 0,
          dailyTimeSpent: {},
          averageSessionLength: 0,
          longestSession: 0,
          uniqueMonthsVisited: [],
          uniqueYearsVisited: [],
          uniqueLocationsViewed: [],
          featuresDiscovered: {},
          settingsExplored: {},
          themesTried: [],
          fontsTried: [],
          displayModesTried: [],
          customizationsMade: 0,
        };
      }
      if (!state.progress.featureDiscovery) {
        state.progress.featureDiscovery = {} as any;
      }
      
      const engagement = state.progress.appEngagement;
      const discovery = state.progress.featureDiscovery;
      
      // Map display settings to discovery flags
      const displayToFeature: Record<string, FeatureDiscoveryKey> = {
        'showMoonPhases': 'enabledMoonPhases',
        'showTransitsOnCalendar': 'enabledTransits',
        'showSeasonalEvents': 'enabledSeasonalEvents',
        'showHolidays': 'enabledHolidays',
        'showEnergyForecast': 'enabledEnergyVote',
      };
      
      if (enabled && displayToFeature[setting]) {
        discovery[displayToFeature[setting]] = true;
      }
      
      engagement.settingsExplored[`display:${setting}`] = Date.now();
      engagement.customizationsMade += 1;
    },
    
    // Track location changes
    trackLocationChange: (state, action: PayloadAction<{ location: CountryCode; subRegion?: string | null }>) => {
      const { location, subRegion } = action.payload;
      
      // Ensure appEngagement and featureDiscovery exist
      if (!state.progress.appEngagement) {
        const today = new Date().toISOString().split('T')[0];
        state.progress.appEngagement = {
          totalAppOpens: 1,
          currentOpenStreak: 1,
          longestOpenStreak: 1,
          lastOpenDate: today,
          firstOpenDate: today,
          totalTimeSpent: 0,
          dailyTimeSpent: {},
          averageSessionLength: 0,
          longestSession: 0,
          uniqueMonthsVisited: [],
          uniqueYearsVisited: [],
          uniqueLocationsViewed: [],
          featuresDiscovered: {},
          settingsExplored: {},
          themesTried: [],
          fontsTried: [],
          displayModesTried: [],
          customizationsMade: 0,
        };
      }
      if (!state.progress.featureDiscovery) {
        state.progress.featureDiscovery = {} as any;
      }
      
      const engagement = state.progress.appEngagement;
      const discovery = state.progress.featureDiscovery;
      
      if (!engagement.uniqueLocationsViewed.includes(location)) {
        engagement.uniqueLocationsViewed.push(location);
      }
      
      discovery.changedLocation = true;
      if (subRegion) {
        discovery.changedSubRegion = true;
      }
      
      engagement.settingsExplored[`location:${location}`] = Date.now();
      engagement.customizationsMade += 1;
    },
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
  addCommunityHoliday,
  voteForHoliday,
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
        display: { ...initialState.display, ...(persistedState.display || {}) },
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
import friendsReducer from './friendsSlice';

export const store = configureStore({
  reducer: {
    calendar: calendarSlice.reducer,
    astrology: astrologyReducer,
    diary: diaryReducer,
    tutorial: tutorialReducer,
    friends: friendsReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: false,
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
      // Persist diary preferences
      diaryPreferences: state.diary?.preferences,
      // Phase 1: App Engagement persistence
      appEngagement: state.calendar.progress.appEngagement,
      featureDiscovery: state.calendar.progress.featureDiscovery,
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
  
  // Only persist if calendar state actually changed
  if (currentState.calendar !== previousState.calendar) {
    // Debounce persistence to prevent excessive writes
    if (persistTimeout) {
      clearTimeout(persistTimeout);
    }
    persistTimeout = setTimeout(() => {
      persistState(currentState);
      // Only log occasionally to reduce console spam
      if (Math.random() < 0.1) {
        console.log('[Persistence] State saved to localStorage');
      }
    }, 500);
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
