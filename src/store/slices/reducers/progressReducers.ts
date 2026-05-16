/**
 * Progress Reducers
 * Gamification, app engagement tracking, astrology profiles, notifications
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  CalendarState,
  UnlockedAchievement,
  FeatureDiscoveryKey,
  FeatureDiscoveryProgress,
  AppEngagement,
} from '../../../types';
import type { NotificationPreferences, NotificationSection } from '../../../types/notifications';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '../../../types/notifications';

// ─── Gamification Reducers ───

export const unlockAchievement = (state: CalendarState, action: PayloadAction<UnlockedAchievement>) => {
  state.progress.achievements.push(action.payload);
};

export const completeRitual = (state: CalendarState, action: PayloadAction<string>) => {
  if (!state.progress.dailyRitualsCompleted.includes(action.payload)) {
    state.progress.dailyRitualsCompleted.push(action.payload);
  }
};

export const resetDailyRituals = (state: CalendarState) => {
  state.progress.dailyRitualsCompleted = [];
};

export const claimReward = (state: CalendarState, action: PayloadAction<string>) => {
  if (!state.progress.rewards.includes(action.payload)) {
    state.progress.rewards.push(action.payload);
  }
};

// ─── App Engagement Reducers ───

function ensureAppEngagement(state: CalendarState, timestamp?: number): AppEngagement {
  if (!state.progress.appEngagement) {
    const today = new Date(timestamp || Date.now()).toISOString().split('T')[0];
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
  return state.progress.appEngagement;
}

function ensureFeatureDiscovery(state: CalendarState): FeatureDiscoveryProgress {
  if (!state.progress.featureDiscovery) {
    state.progress.featureDiscovery = {} as any;
  }
  return state.progress.featureDiscovery;
}

export const trackAppOpen = (state: CalendarState, action: PayloadAction<void>) => {
  const timestamp = (action as any).meta?.timestamp || Date.now();
  const today = new Date(timestamp).toISOString().split('T')[0];
  const engagement = ensureAppEngagement(state, timestamp);

  engagement.totalAppOpens += 1;

  if (engagement.lastOpenDate) {
    const lastDate = new Date(engagement.lastOpenDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      engagement.currentOpenStreak += 1;
    } else if (diffDays > 1) {
      engagement.currentOpenStreak = 1;
    }
  } else {
    engagement.currentOpenStreak = 1;
    engagement.firstOpenDate = today;
  }

  if (engagement.currentOpenStreak > engagement.longestOpenStreak) {
    engagement.longestOpenStreak = engagement.currentOpenStreak;
  }

  engagement.lastOpenDate = today;
};

export const trackTimeSpent = (state: CalendarState, action: PayloadAction<{ minutes: number }>) => {
  const { minutes } = action.payload;
  const timestamp = (action as any).meta?.timestamp || Date.now();
  const today = new Date(timestamp).toISOString().split('T')[0];
  const engagement = ensureAppEngagement(state, timestamp);

  engagement.totalTimeSpent += minutes;
  engagement.dailyTimeSpent[today] = (engagement.dailyTimeSpent[today] || 0) + minutes;

  if (minutes > engagement.longestSession) {
    engagement.longestSession = minutes;
  }

  const totalSessions = engagement.totalAppOpens;
  engagement.averageSessionLength = totalSessions > 0
    ? Math.round(engagement.totalTimeSpent / totalSessions)
    : 0;
};

export const trackMonthVisit = (state: CalendarState, action: PayloadAction<{ year: number; month: number }>) => {
  const { year, month } = action.payload;
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  const timestamp = (action as any).meta?.timestamp || Date.now();
  const engagement = ensureAppEngagement(state, timestamp);
  const discovery = ensureFeatureDiscovery(state);

  if (!engagement.uniqueMonthsVisited.includes(monthKey)) {
    engagement.uniqueMonthsVisited.push(monthKey);
  }

  if (!engagement.uniqueYearsVisited.includes(year)) {
    engagement.uniqueYearsVisited.push(year);
  }

  const todayDate = new Date(timestamp);
  const isCurrentMonth = year === todayDate.getFullYear() && month === (todayDate.getMonth() + 1);
  if (!isCurrentMonth) {
    discovery.viewedDifferentMonth = true;
  }
};

export const discoverFeature = (state: CalendarState, action: PayloadAction<{ feature: FeatureDiscoveryKey; timestamp?: number }>) => {
  const { feature, timestamp: payloadTimestamp } = action.payload;
  const timestamp = payloadTimestamp ?? (action as any).meta?.timestamp ?? Date.now();
  const engagement = ensureAppEngagement(state, timestamp);
  const discovery = ensureFeatureDiscovery(state);

  if (feature in discovery) {
    (discovery as any)[feature] = true;
  }

  engagement.featuresDiscovered[feature] = timestamp;
};

export const trackSettingsExplored = (state: CalendarState, action: PayloadAction<{ setting: string; value?: any }>) => {
  const { setting } = action.payload;
  const timestamp = (action as any).meta?.timestamp || Date.now();
  const engagement = ensureAppEngagement(state, timestamp);

  engagement.settingsExplored[setting] = timestamp;
  engagement.customizationsMade += 1;

  if (setting.startsWith('theme:') && !engagement.themesTried.includes(setting)) {
    engagement.themesTried.push(setting);
  }
  if (setting.startsWith('font:') && !engagement.fontsTried.includes(setting)) {
    engagement.fontsTried.push(setting);
  }
  if (setting.startsWith('display:') && !engagement.displayModesTried.includes(setting)) {
    engagement.displayModesTried.push(setting);
  }
};

export const trackThemeChange = (state: CalendarState, action: PayloadAction<{ themeId: string }>) => {
  const { themeId } = action.payload;
  const timestamp = (action as any).meta?.timestamp || Date.now();
  const engagement = ensureAppEngagement(state, timestamp);
  const discovery = ensureFeatureDiscovery(state);

  if (!engagement.themesTried.includes(themeId)) {
    engagement.themesTried.push(themeId);
  }

  discovery.changedTheme = true;
  engagement.settingsExplored[`theme:${themeId}`] = timestamp;
  engagement.customizationsMade += 1;
};

export const trackFontChange = (state: CalendarState, action: PayloadAction<{ fontId: string }>) => {
  const { fontId } = action.payload;
  const timestamp = (action as any).meta?.timestamp || Date.now();
  const engagement = ensureAppEngagement(state, timestamp);
  const discovery = ensureFeatureDiscovery(state);

  if (!engagement.fontsTried.includes(fontId)) {
    engagement.fontsTried.push(fontId);
  }

  discovery.changedFont = true;
  engagement.settingsExplored[`font:${fontId}`] = timestamp;
  engagement.customizationsMade += 1;
};

export const trackDisplayChange = (state: CalendarState, action: PayloadAction<{ setting: string; enabled: boolean }>) => {
  const { setting, enabled } = action.payload;
  const timestamp = (action as any).meta?.timestamp || Date.now();
  const engagement = ensureAppEngagement(state, timestamp);
  const discovery = ensureFeatureDiscovery(state);

  const displayToFeature: Record<string, FeatureDiscoveryKey> = {
    'showMoonPhases': 'enabledMoonPhases',
    'showTransitsOnCalendar': 'enabledTransits',
    'showCelestialCards': 'enabledSeasonalEvents',
    'showHolidays': 'enabledHolidays',
  };

  if (enabled && displayToFeature[setting]) {
    discovery[displayToFeature[setting]] = true;
  }

  engagement.settingsExplored[`display:${setting}`] = timestamp;
  engagement.customizationsMade += 1;
};

export const trackLocationChange = (state: CalendarState, action: PayloadAction<{ location: import('../../../types').CountryCode; subRegion?: string | null }>) => {
  const { location, subRegion } = action.payload;
  const timestamp = (action as any).meta?.timestamp || Date.now();
  const engagement = ensureAppEngagement(state, timestamp);
  const discovery = ensureFeatureDiscovery(state);

  if (!engagement.uniqueLocationsViewed.includes(location)) {
    engagement.uniqueLocationsViewed.push(location);
  }

  discovery.changedLocation = true;
  if (subRegion) {
    discovery.changedSubRegion = true;
  }

  engagement.settingsExplored[`location:${location}`] = timestamp;
  engagement.customizationsMade += 1;
};

// ─── Astrology Reducers ───

export const addAstroProfile = (state: CalendarState, action: PayloadAction<import('../../../types/astrology').AstroProfile>) => {
  const profile = action.payload;
  const existingIndex = state.astroProfiles.findIndex(p => p.id === profile.id);
  if (existingIndex >= 0) {
    state.astroProfiles[existingIndex] = profile;
  } else {
    state.astroProfiles.push(profile);
  }
  state.selectedAstroProfileId = profile.id;
};

export const deleteAstroProfile = (state: CalendarState, action: PayloadAction<string>) => {
  const profileId = action.payload;
  state.astroProfiles = state.astroProfiles.filter(p => p.id !== profileId);
  if (state.selectedAstroProfileId === profileId) {
    state.selectedAstroProfileId = state.astroProfiles[0]?.id || null;
  }
};

export const selectAstroProfile = (state: CalendarState, action: PayloadAction<string | null>) => {
  state.selectedAstroProfileId = action.payload;
};

export const setAstroProfile = (state: CalendarState, action: PayloadAction<import('../../../types/astrology').AstroProfile | null>) => {
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
};

export const updateAstroPreferences = (state: CalendarState, action: PayloadAction<Partial<CalendarState['astroPreferences']>>) => {
  state.astroPreferences = { ...state.astroPreferences, ...action.payload };
};

export const toggleAstroPreference = (state: CalendarState, action: PayloadAction<'enableDailyTips' | 'enableRetrogradeAlerts' | 'enableMoonPhaseAlerts' | 'showTransitsOnCalendar'>) => {
  const key = action.payload;
  state.astroPreferences[key] = !state.astroPreferences[key];
};

// ─── Notification Reducers ───

export const updateNotificationPreferences = (state: CalendarState, action: PayloadAction<{ section: NotificationSection | 'quietHours'; prefs: Partial<NotificationPreferences[NotificationSection]> | Partial<NotificationPreferences['quietHours']> }>) => {
  const { section, prefs } = action.payload;
  if (section === 'quietHours') {
    state.notificationPreferences.quietHours = { ...state.notificationPreferences.quietHours, ...prefs } as any;
  } else {
    state.notificationPreferences[section] = { ...state.notificationPreferences[section], ...prefs } as any;
  }
};

export const toggleNotificationPreference = (state: CalendarState, action: PayloadAction<{ section: NotificationSection; key: keyof NotificationPreferences[NotificationSection] }>) => {
  const { section, key } = action.payload;
  const current = (state.notificationPreferences[section] as unknown as Record<string, boolean>)[key as string] as boolean;
  (state.notificationPreferences[section] as unknown as Record<string, boolean>)[key as string] = !current;
};

export const setGlobalNotificationsEnabled = (state: CalendarState, action: PayloadAction<boolean>) => {
  state.notificationPreferences.globalEnabled = action.payload;
};

export const resetNotificationPreferences = (state: CalendarState) => {
  // Reset all notification preferences to defaults
  state.notificationPreferences = {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    quietHours: DEFAULT_NOTIFICATION_PREFERENCES.quietHours,
    calendar: DEFAULT_NOTIFICATION_PREFERENCES.calendar,
    stars: DEFAULT_NOTIFICATION_PREFERENCES.stars,
    circle: DEFAULT_NOTIFICATION_PREFERENCES.circle,
    journal: DEFAULT_NOTIFICATION_PREFERENCES.journal,
    planner: DEFAULT_NOTIFICATION_PREFERENCES.planner,
  };
};

export const setNotificationMode = (state: CalendarState, action: PayloadAction<'unified' | 'custom'>) => {
  state.notificationPreferences.notificationMode = action.payload;
};
