// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  unlockAchievement,
  completeRitual,
  resetDailyRituals,
  claimReward,
  trackAppOpen,
  trackTimeSpent,
  trackMonthVisit,
  discoverFeature,
  trackSettingsExplored,
  trackThemeChange,
  trackFontChange,
  trackDisplayChange,
  trackLocationChange,
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
} from '../src/store/slices/reducers/progressReducers';

function createProgressState(overrides = {}) {
  return {
    progress: {
      level: 1,
      experience: 0,
      achievements: [],
      rewards: [],
      dailyRitualsCompleted: [],
      appEngagement: null,
      featureDiscovery: null,
      ...overrides.progress,
    },
    astroProfiles: [],
    selectedAstroProfileId: null,
    astroPreferences: {
      enableDailyTips: true,
      enableRetrogradeAlerts: true,
      enableMoonPhaseAlerts: true,
      showTransitsOnCalendar: false,
    },
    notificationPreferences: {
      globalEnabled: true,
      notificationMode: 'unified',
      calendar: { enabled: true, morning: true, evening: false },
      stars: { enabled: true, daily: true, weekly: false },
      circle: { enabled: true, messages: true, invites: false },
      journal: { enabled: true, reminders: true, insights: false },
      planner: { enabled: true, tasks: true, briefings: false },
      quietHours: { enabled: false, start: '22:00', end: '07:00' },
      customTimes: {},
      vacationMode: { enabled: false },
      focusSchedules: [],
      adaptiveCaps: true,
    },
    ...overrides,
  };
}

describe('progressReducers', () => {
  describe('gamification', () => {
    it('unlockAchievement adds achievement', () => {
      const state = createProgressState();
      unlockAchievement(state, { payload: { id: 'a1', name: 'First Step', unlockedAt: '2024-01-01' } });
      expect(state.progress.achievements).toHaveLength(1);
      expect(state.progress.achievements[0].id).toBe('a1');
    });

    it('completeRitual adds ritual id', () => {
      const state = createProgressState();
      completeRitual(state, { payload: 'morning-meditation' });
      expect(state.progress.dailyRitualsCompleted).toContain('morning-meditation');
    });

    it('completeRitual does not duplicate', () => {
      const state = createProgressState({ progress: { dailyRitualsCompleted: ['morning-meditation'] } });
      completeRitual(state, { payload: 'morning-meditation' });
      expect(state.progress.dailyRitualsCompleted).toHaveLength(1);
    });

    it('resetDailyRituals clears rituals', () => {
      const state = createProgressState({ progress: { dailyRitualsCompleted: ['r1', 'r2'] } });
      resetDailyRituals(state);
      expect(state.progress.dailyRitualsCompleted).toHaveLength(0);
    });

    it('claimReward adds reward', () => {
      const state = createProgressState();
      claimReward(state, { payload: 'reward-1' });
      expect(state.progress.rewards).toContain('reward-1');
    });

    it('claimReward does not duplicate', () => {
      const state = createProgressState({ progress: { rewards: ['reward-1'] } });
      claimReward(state, { payload: 'reward-1' });
      expect(state.progress.rewards).toHaveLength(1);
    });
  });

  describe('app engagement', () => {
    it('trackAppOpen initializes engagement on first open', () => {
      const state = createProgressState();
      trackAppOpen(state, { payload: undefined, meta: { timestamp: 1718400000000 } });
      expect(state.progress.appEngagement.totalAppOpens).toBe(2);
      expect(state.progress.appEngagement.currentOpenStreak).toBe(1);
      expect(state.progress.appEngagement.lastOpenDate).toBe('2024-06-14');
    });

    it('trackAppOpen increments streak on consecutive days', () => {
      const state = createProgressState({
        progress: {
          appEngagement: {
            totalAppOpens: 5,
            currentOpenStreak: 5,
            longestOpenStreak: 5,
            lastOpenDate: '2024-06-14',
          },
        },
      });
      trackAppOpen(state, { payload: undefined, meta: { timestamp: new Date('2024-06-15').getTime() } });
      expect(state.progress.appEngagement.totalAppOpens).toBe(6);
      expect(state.progress.appEngagement.currentOpenStreak).toBe(6);
      expect(state.progress.appEngagement.longestOpenStreak).toBe(6);
    });

    it('trackAppOpen resets streak after gap', () => {
      const state = createProgressState({
        progress: {
          appEngagement: {
            totalAppOpens: 5,
            currentOpenStreak: 5,
            longestOpenStreak: 5,
            lastOpenDate: '2024-06-10',
          },
        },
      });
      trackAppOpen(state, { payload: undefined, meta: { timestamp: new Date('2024-06-15').getTime() } });
      expect(state.progress.appEngagement.currentOpenStreak).toBe(1);
    });

    it('trackTimeSpent updates total and daily time', () => {
      const state = createProgressState({
        progress: {
          appEngagement: {
            totalAppOpens: 2,
            totalTimeSpent: 30,
            dailyTimeSpent: {},
            longestSession: 20,
          },
        },
      });
      trackTimeSpent(state, { payload: { minutes: 15 }, meta: { timestamp: new Date('2024-06-15').getTime() } });
      expect(state.progress.appEngagement.totalTimeSpent).toBe(45);
      expect(state.progress.appEngagement.dailyTimeSpent['2024-06-15']).toBe(15);
      expect(state.progress.appEngagement.averageSessionLength).toBe(23);
    });

    it('trackTimeSpent updates longest session', () => {
      const state = createProgressState({
        progress: {
          appEngagement: {
            totalAppOpens: 1,
            totalTimeSpent: 10,
            dailyTimeSpent: {},
            longestSession: 10,
          },
        },
      });
      trackTimeSpent(state, { payload: { minutes: 25 }, meta: { timestamp: new Date('2024-06-15').getTime() } });
      expect(state.progress.appEngagement.longestSession).toBe(25);
    });

    it('trackMonthVisit adds unique month', () => {
      const state = createProgressState();
      trackMonthVisit(state, { payload: { year: 2024, month: 6 }, meta: { timestamp: 1718400000000 } });
      expect(state.progress.appEngagement.uniqueMonthsVisited).toContain('2024-06');
      expect(state.progress.appEngagement.uniqueYearsVisited).toContain(2024);
    });

    it('trackMonthVisit does not duplicate month', () => {
      const state = createProgressState({
        progress: {
          appEngagement: { uniqueMonthsVisited: ['2024-06'], uniqueYearsVisited: [2024] },
        },
      });
      trackMonthVisit(state, { payload: { year: 2024, month: 6 }, meta: { timestamp: 1718400000000 } });
      expect(state.progress.appEngagement.uniqueMonthsVisited).toHaveLength(1);
    });

    it('discoverFeature records timestamp in featuresDiscovered', () => {
      const state = createProgressState();
      discoverFeature(state, { payload: { feature: 'openedDateModal' }, meta: { timestamp: 1718400000000 } });
      expect(state.progress.appEngagement.featuresDiscovered.openedDateModal).toBe(1718400000000);
    });

    it('trackSettingsExplored records setting and increments customizations', () => {
      const state = createProgressState();
      trackSettingsExplored(state, { payload: { setting: 'theme:dark-gold' }, meta: { timestamp: 1718400000000 } });
      expect(state.progress.appEngagement.settingsExplored['theme:dark-gold']).toBe(1718400000000);
      expect(state.progress.appEngagement.customizationsMade).toBe(1);
      expect(state.progress.appEngagement.themesTried).toContain('theme:dark-gold');
    });

    it('trackThemeChange records theme and marks discovery', () => {
      const state = createProgressState();
      trackThemeChange(state, { payload: { themeId: 'midnight-blue' }, meta: { timestamp: 1718400000000 } });
      expect(state.progress.appEngagement.themesTried).toContain('midnight-blue');
      expect(state.progress.featureDiscovery.changedTheme).toBe(true);
    });

    it('trackFontChange records font and marks discovery', () => {
      const state = createProgressState();
      trackFontChange(state, { payload: { fontId: 'serif' }, meta: { timestamp: 1718400000000 } });
      expect(state.progress.appEngagement.fontsTried).toContain('serif');
      expect(state.progress.featureDiscovery.changedFont).toBe(true);
    });

    it('trackDisplayChange maps display setting to feature discovery', () => {
      const state = createProgressState();
      trackDisplayChange(state, { payload: { setting: 'showMoonPhases', enabled: true }, meta: { timestamp: 1718400000000 } });
      expect(state.progress.featureDiscovery.enabledMoonPhases).toBe(true);
    });

    it('trackLocationChange records location and marks discovery', () => {
      const state = createProgressState();
      trackLocationChange(state, { payload: { location: 'US', subRegion: 'CA' }, meta: { timestamp: 1718400000000 } });
      expect(state.progress.appEngagement.uniqueLocationsViewed).toContain('US');
      expect(state.progress.featureDiscovery.changedLocation).toBe(true);
      expect(state.progress.featureDiscovery.changedSubRegion).toBe(true);
    });
  });

  describe('astrology', () => {
    it('addAstroProfile adds new profile', () => {
      const state = createProgressState();
      const profile = { id: 'p1', name: 'Test', birthDate: '1990-01-01' };
      addAstroProfile(state, { payload: profile });
      expect(state.astroProfiles).toHaveLength(1);
      expect(state.selectedAstroProfileId).toBe('p1');
    });

    it('addAstroProfile updates existing profile', () => {
      const state = createProgressState({ astroProfiles: [{ id: 'p1', name: 'Old' }] });
      addAstroProfile(state, { payload: { id: 'p1', name: 'New' } });
      expect(state.astroProfiles[0].name).toBe('New');
    });

    it('deleteAstroProfile removes profile and updates selection', () => {
      const state = createProgressState({
        astroProfiles: [{ id: 'p1' }, { id: 'p2' }],
        selectedAstroProfileId: 'p1',
      });
      deleteAstroProfile(state, { payload: 'p1' });
      expect(state.astroProfiles).toHaveLength(1);
      expect(state.selectedAstroProfileId).toBe('p2');
    });

    it('deleteAstroProfile clears selection when last profile removed', () => {
      const state = createProgressState({
        astroProfiles: [{ id: 'p1' }],
        selectedAstroProfileId: 'p1',
      });
      deleteAstroProfile(state, { payload: 'p1' });
      expect(state.astroProfiles).toHaveLength(0);
      expect(state.selectedAstroProfileId).toBeNull();
    });

    it('selectAstroProfile sets selected id', () => {
      const state = createProgressState();
      selectAstroProfile(state, { payload: 'p1' });
      expect(state.selectedAstroProfileId).toBe('p1');
      selectAstroProfile(state, { payload: null });
      expect(state.selectedAstroProfileId).toBeNull();
    });

    it('setAstroProfile upserts and selects', () => {
      const state = createProgressState();
      setAstroProfile(state, { payload: { id: 'p1', name: 'Test' } });
      expect(state.astroProfiles).toHaveLength(1);
      expect(state.selectedAstroProfileId).toBe('p1');
    });

    it('setAstroProfile with null does nothing', () => {
      const state = createProgressState({ astroProfiles: [{ id: 'p1' }] });
      setAstroProfile(state, { payload: null });
      expect(state.astroProfiles).toHaveLength(1);
    });

    it('updateAstroPreferences merges preferences', () => {
      const state = createProgressState();
      updateAstroPreferences(state, { payload: { enableDailyTips: false } });
      expect(state.astroPreferences.enableDailyTips).toBe(false);
      expect(state.astroPreferences.enableRetrogradeAlerts).toBe(true);
    });

    it('toggleAstroPreference flips boolean', () => {
      const state = createProgressState();
      toggleAstroPreference(state, { payload: 'enableDailyTips' });
      expect(state.astroPreferences.enableDailyTips).toBe(false);
      toggleAstroPreference(state, { payload: 'enableDailyTips' });
      expect(state.astroPreferences.enableDailyTips).toBe(true);
    });
  });

  describe('notifications', () => {
    it('updateNotificationPreferences updates section', () => {
      const state = createProgressState();
      updateNotificationPreferences(state, { payload: { section: 'calendar', prefs: { morning: false, evening: true } } });
      expect(state.notificationPreferences.calendar.morning).toBe(false);
      expect(state.notificationPreferences.calendar.evening).toBe(true);
    });

    it('updateNotificationPreferences updates quietHours', () => {
      const state = createProgressState();
      updateNotificationPreferences(state, { payload: { section: 'quietHours', prefs: { enabled: true, start: '21:00' } } });
      expect(state.notificationPreferences.quietHours.enabled).toBe(true);
      expect(state.notificationPreferences.quietHours.start).toBe('21:00');
    });

    it('updateNotificationPreferences updates adaptiveCaps', () => {
      const state = createProgressState();
      updateNotificationPreferences(state, { payload: { section: 'adaptiveCaps', prefs: false } });
      expect(state.notificationPreferences.adaptiveCaps).toBe(false);
    });

    it('toggleNotificationPreference flips boolean key', () => {
      const state = createProgressState();
      toggleNotificationPreference(state, { payload: { section: 'calendar', key: 'morning' } });
      expect(state.notificationPreferences.calendar.morning).toBe(false);
      toggleNotificationPreference(state, { payload: { section: 'calendar', key: 'morning' } });
      expect(state.notificationPreferences.calendar.morning).toBe(true);
    });

    it('setGlobalNotificationsEnabled sets global flag', () => {
      const state = createProgressState();
      setGlobalNotificationsEnabled(state, { payload: false });
      expect(state.notificationPreferences.globalEnabled).toBe(false);
    });

    it('resetNotificationPreferences resets to defaults', () => {
      const state = createProgressState({
        notificationPreferences: {
          globalEnabled: false,
          notificationMode: 'custom',
          calendar: { enabled: false, morning: false, evening: true },
        },
      });
      resetNotificationPreferences(state);
      expect(state.notificationPreferences.globalEnabled).toBe(true);
      expect(state.notificationPreferences.notificationMode).toBe('unified');
    });

    it('setNotificationMode changes mode', () => {
      const state = createProgressState();
      setNotificationMode(state, { payload: 'custom' });
      expect(state.notificationPreferences.notificationMode).toBe('custom');
    });
  });
});
