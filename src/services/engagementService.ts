/**
 * Engagement Service - Phase 1 App Engagement Tracking
 * 
 * Centralized service for tracking:
 * - App opens and open streaks
 * - Time spent in app
 * - Feature discovery
 * - Settings exploration
 */

import type { AppDispatch, RootState } from '../store';
import type { FeatureDiscoveryKey, AppEngagement } from '../types';
import {
  trackAppOpen,
  trackTimeSpent,
  trackMonthVisit,
  discoverFeature as discoverFeatureAction,
  trackSettingsExplored,
  trackThemeChange,
  trackFontChange,
  trackDisplayChange,
  trackLocationChange,
} from '../store';

// ============================================================================
// Session Tracking
// ============================================================================

interface SessionState {
  sessionStartTime: number | null;
  currentSessionMinutes: number;
  lastActivityTime: number;
}

const session: SessionState = {
  sessionStartTime: null,
  currentSessionMinutes: 0,
  lastActivityTime: Date.now(),
};

const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes of inactivity = session end
const TIME_TRACKING_INTERVAL_MS = 60 * 1000; // Track every minute

let timeTrackingInterval: ReturnType<typeof setInterval> | null = null;

// ============================================================================
// App Open Tracking
// ============================================================================

/**
 * Initialize app engagement tracking on app load
 * Call this once when the app initializes
 */
export function initializeEngagementTracking(dispatch: AppDispatch): void {
  // Track this app open
  dispatch(trackAppOpen());
  
  // Start session tracking
  startSessionTracking(dispatch);
  
  // Setup visibility change listener for background/foreground tracking
  setupVisibilityListener(dispatch);
}

/**
 * Track a manual app open (e.g., when returning from background)
 */
export function trackManualAppOpen(dispatch: AppDispatch): void {
  dispatch(trackAppOpen());
}

// ============================================================================
// Session & Time Tracking
// ============================================================================

function startSessionTracking(dispatch: AppDispatch): void {
  session.sessionStartTime = Date.now();
  session.lastActivityTime = Date.now();
  session.currentSessionMinutes = 0;
  
  // Start periodic time tracking
  if (timeTrackingInterval) {
    clearInterval(timeTrackingInterval);
  }
  
  timeTrackingInterval = setInterval(() => {
    const now = Date.now();
    const inactiveTime = now - session.lastActivityTime;
    
    // Check if session has timed out
    if (inactiveTime > SESSION_TIMEOUT_MS) {
      // Session ended due to inactivity - track final time
      finalizeSession(dispatch);
      // Start new session
      session.sessionStartTime = now;
      session.currentSessionMinutes = 0;
    } else {
      // Session still active - increment time
      session.currentSessionMinutes++;
      dispatch(trackTimeSpent({ minutes: 1 }));
    }
  }, TIME_TRACKING_INTERVAL_MS);
}

function finalizeSession(_dispatch: AppDispatch): void {
  if (session.sessionStartTime && session.currentSessionMinutes > 0) {
    // Already tracked minute by minute, so no need to track again
    // This is mainly for cleanup
  }
}

function setupVisibilityListener(dispatch: AppDispatch): void {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // App going to background - mark last activity
      session.lastActivityTime = Date.now();
    } else {
      // App returning to foreground
      const awayTime = Date.now() - session.lastActivityTime;
      
      if (awayTime > SESSION_TIMEOUT_MS) {
        // Treat as new session
        finalizeSession(dispatch);
        session.sessionStartTime = Date.now();
        session.currentSessionMinutes = 0;
        trackManualAppOpen(dispatch);
      }
      
      session.lastActivityTime = Date.now();
    }
  });
}

/**
 * Mark user activity to prevent session timeout
 * Call this on user interactions
 */
export function markActivity(): void {
  session.lastActivityTime = Date.now();
}

/**
 * Stop session tracking (call on app cleanup)
 */
export function stopSessionTracking(dispatch: AppDispatch): void {
  if (timeTrackingInterval) {
    clearInterval(timeTrackingInterval);
    timeTrackingInterval = null;
  }
  finalizeSession(dispatch);
}

// ============================================================================
// Feature Discovery Tracking
// ============================================================================

/**
 * Track feature discovery
 * Returns true if this was the first time discovering this feature
 */
export function trackFeatureDiscovery(
  dispatch: AppDispatch,
  getState: () => RootState,
  feature: FeatureDiscoveryKey
): boolean {
  const state = getState();
  const alreadyDiscovered = state.calendar.progress?.featureDiscovery?.[feature];
  
  if (!alreadyDiscovered) {
    dispatch(discoverFeatureAction({ feature }));
    return true;
  }
  
  return false;
}

// ============================================================================
// Month Visit Tracking
// ============================================================================

/**
 * Track when user visits a different month/year
 */
export function trackMonthNavigation(
  dispatch: AppDispatch,
  year: number,
  month: number
): void {
  dispatch(trackMonthVisit({ year, month }));
}

// ============================================================================
// Settings Exploration Tracking
// ============================================================================

/**
 * Track when user changes theme
 */
export function trackThemeExploration(
  dispatch: AppDispatch,
  themeId: string
): void {
  dispatch(trackThemeChange({ themeId }));
}

/**
 * Track when user changes font
 */
export function trackFontExploration(
  dispatch: AppDispatch,
  fontId: string
): void {
  dispatch(trackFontChange({ fontId }));
}

/**
 * Track when user toggles a display setting
 */
export function trackDisplayExploration(
  dispatch: AppDispatch,
  setting: string,
  enabled: boolean
): void {
  dispatch(trackDisplayChange({ setting, enabled }));
}

/**
 * Track when user changes location
 */
export function trackLocationExploration(
  dispatch: AppDispatch,
  location: string,
  subRegion?: string | null
): void {
  dispatch(trackLocationChange({ location: location as any, subRegion }));
}

/**
 * Track general settings exploration
 */
export function trackGenericSettingExploration(
  dispatch: AppDispatch,
  setting: string,
  value?: any
): void {
  dispatch(trackSettingsExplored({ setting, value }));
}

// ============================================================================
// Selectors
// ============================================================================

export function selectEngagement(state: RootState): AppEngagement {
  // Fallback for users with old state that doesn't have appEngagement
  return state.calendar.progress?.appEngagement || {
    totalAppOpens: 0,
    currentOpenStreak: 0,
    longestOpenStreak: 0,
    lastOpenDate: null,
    firstOpenDate: new Date().toISOString().split('T')[0],
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

export function selectFeatureDiscovery(state: RootState) {
  // Fallback for users with old state
  return state.calendar.progress?.featureDiscovery || {
    openedDateModal: false,
    openedDayPanel: false,
    openedCelestialGuide: false,
    openedOracleJournal: false,
    openedProfileManager: false,
    usedTodayButton: false,
    usedMonthNavigator: false,
    usedYearNavigator: false,
    changedLocation: false,
    changedSubRegion: false,
    viewedDifferentMonth: false,
    viewedDifferentYear: false,
    enabledMoonPhases: false,
    enabledTransits: false,
    enabledSeasonalEvents: false,
    enabledHolidays: false,
    enabledEnergyVote: false,
    enabledBirthChart: false,
    votedOnEnergy: false,
    createdBirthChart: false,
    createdNote: false,
    printedCalendar: false,
    subscribedToCommunity: false,
    openedSettings: false,
    changedTheme: false,
    changedFont: false,
    changedDisplayMode: false,
    customizedColors: false,
    changedLocationSettings: false,
    viewedCommunityHolidays: false,
    suggestedHoliday: false,
    openedFriends: false,
  };
}

export function selectDiscoveryProgress(state: RootState): number {
  const discovery = state.calendar.progress?.featureDiscovery;
  if (!discovery) return 0;
  const total = Object.keys(discovery).length;
  const discovered = Object.values(discovery).filter(v => v === true).length;
  return total > 0 ? Math.round((discovered / total) * 100) : 0;
}

export function selectTotalDiscoveries(state: RootState): number {
  const discovery = state.calendar.progress?.featureDiscovery;
  if (!discovery) return 0;
  return Object.values(discovery).filter(v => v === true).length;
}
