import { describe, it, expect } from 'vitest';
import { renderHookWithProviders } from './test-utils';
import {
  useGamification,
  useFeatureDiscovery,
  useSettingsTracking,
  useAchievements,
  useUserLevel,
} from '../src/hooks/useGamification';

const makeState = (overrides: any = {}) => ({
  calendar: {
    progress: {
      level: 1,
      experience: 0,
      achievements: overrides.achievements || [],
      rewards: [],
      dailyRitualsCompleted: [],
      appEngagement: {
        totalAppOpens: overrides.totalAppOpens ?? 5,
        currentOpenStreak: 2,
        longestOpenStreak: 3,
        lastOpenDate: '2024-06-15',
        firstOpenDate: '2024-01-01',
        totalTimeSpent: 3600,
        dailyTimeSpent: {},
        averageSessionLength: 300,
        longestSession: 600,
        uniqueMonthsVisited: ['2024-06'],
        uniqueYearsVisited: [2024],
        uniqueLocationsViewed: ['AU'],
        featuresDiscovered: {},
        settingsExplored: {},
        themesTried: ['egyptian-gold'],
        fontsTried: ['elegant'],
        displayModesTried: [],
        customizationsMade: 2,
      },
      featureDiscovery: {
        openedDateModal: true,
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
        ...overrides.featureDiscovery,
      },
    },
    statistics: {
      totalNotes: overrides.totalNotes ?? 3,
      notesByCategory: { personal: 1, work: 0, spiritual: 0, family: 0, health: 0, creative: 0, general: 0 },
      notesByMonth: {},
      currentStreak: 0,
      longestStreak: 0,
      moodAverage: 0,
      moodEntryCount: 0,
      moodEntriesByMonth: {},
      moodByMonth: {},
      mostActiveMonth: { month: '', count: 0 },
      totalWords: 0,
    },
    notes: {},
  },
});

describe('useGamification', () => {
  it('returns engagement stats from state', () => {
    const { result } = renderHookWithProviders(() => useGamification(), makeState());
    expect(result.current.engagementStats.totalAppOpens).toBe(5);
    expect(result.current.engagementStats.currentOpenStreak).toBe(2);
    expect(result.current.engagementStats.uniqueMonthsVisited).toBe(1);
    expect(result.current.engagementStats.themesTried).toBe(1);
  });

  it('computes user level based on notes and app opens', () => {
    const { result } = renderHookWithProviders(() => useGamification(), makeState({ totalNotes: 0, totalAppOpens: 0 }));
    expect(result.current.userLevel.level).toBe(1);
  });

  it('computes level progress', () => {
    const { result } = renderHookWithProviders(() => useGamification(), makeState({ totalNotes: 5, totalAppOpens: 5 }));
    expect(result.current.levelProgress).toBeDefined();
    expect(typeof result.current.levelProgress.progress).toBe('number');
  });

  it('lists undiscovered features', () => {
    const { result } = renderHookWithProviders(() => useGamification(), makeState());
    expect(result.current.undiscoveredFeatures).toContain('openedDayPanel');
    expect(result.current.undiscoveredFeatures).not.toContain('openedDateModal');
  });

  it('hasDiscovered returns correct boolean', () => {
    const { result } = renderHookWithProviders(() => useGamification(), makeState());
    expect(result.current.hasDiscovered('openedDateModal')).toBe(true);
    expect(result.current.hasDiscovered('openedDayPanel')).toBe(false);
  });

  it('returns totalDiscoveries count', () => {
    const { result } = renderHookWithProviders(() => useGamification(), makeState());
    expect(result.current.totalDiscoveries).toBe(1);
  });

  it('returns all achievements with unlock status', () => {
    const { result } = renderHookWithProviders(() => useGamification(), makeState());
    expect(result.current.allAchievements.length).toBeGreaterThan(0);
    expect(result.current.allAchievements.every(a => typeof a.unlocked === 'boolean')).toBe(true);
  });

  it('returns unlocked achievements from state', () => {
    const achievements = [{ id: 'first_note', unlockedAt: '2024-06-15T10:00:00Z' }];
    const { result } = renderHookWithProviders(() => useGamification(), makeState({ achievements }));
    expect(result.current.unlockedAchievements).toHaveLength(1);
    expect(result.current.unlockedIds).toContain('first_note');
  });

  it('track callbacks are functions', () => {
    const { result } = renderHookWithProviders(() => useGamification(), makeState());
    expect(typeof result.current.trackMonthVisit).toBe('function');
    expect(typeof result.current.trackThemeChange).toBe('function');
    expect(typeof result.current.trackFontChange).toBe('function');
    expect(typeof result.current.trackDisplayToggle).toBe('function');
    expect(typeof result.current.trackLocationChange).toBe('function');
    expect(typeof result.current.trackSetting).toBe('function');
    expect(typeof result.current.checkNewAchievements).toBe('function');
    expect(typeof result.current.achievementsByCategory).toBe('function');
  });
});

describe('useFeatureDiscovery', () => {
  it('returns discovery state and functions', () => {
    const { result } = renderHookWithProviders(() => useFeatureDiscovery(), makeState());
    expect(typeof result.current.discover).toBe('function');
    expect(typeof result.current.isDiscovered).toBe('function');
    expect(result.current.hasDiscovered.openedDateModal).toBe(true);
    expect(result.current.hasDiscovered.openedDayPanel).toBe(false);
  });

  it('isDiscovered returns correct value', () => {
    const { result } = renderHookWithProviders(() => useFeatureDiscovery(), makeState());
    expect(result.current.isDiscovered('openedDateModal')).toBe(true);
    expect(result.current.isDiscovered('openedDayPanel')).toBe(false);
  });
});

describe('useSettingsTracking', () => {
  it('returns tracking functions and engagement lists', () => {
    const { result } = renderHookWithProviders(() => useSettingsTracking(), makeState());
    expect(typeof result.current.trackTheme).toBe('function');
    expect(typeof result.current.trackFont).toBe('function');
    expect(typeof result.current.trackDisplay).toBe('function');
    expect(typeof result.current.trackLocation).toBe('function');
    expect(typeof result.current.trackGeneric).toBe('function');
    expect(result.current.themesTried).toContain('egyptian-gold');
    expect(result.current.customizationsMade).toBe(2);
  });
});

describe('useAchievements', () => {
  it('returns achievement stats for empty state', () => {
    const { result } = renderHookWithProviders(() => useAchievements(), makeState());
    expect(result.current.unlockedCount).toBe(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.totalAchievements).toBeGreaterThan(0);
  });

  it('calculates progress for unlocked achievements', () => {
    const achievements = [
      { id: 'first_note', unlockedAt: '2024-06-15T10:00:00Z' },
      { id: 'streak_3', unlockedAt: '2024-06-15T10:00:00Z' },
    ];
    const { result } = renderHookWithProviders(() => useAchievements(), makeState({ achievements }));
    expect(result.current.unlockedCount).toBe(2);
    expect(result.current.unlockedIds).toContain('first_note');
    expect(result.current.progress).toBeGreaterThan(0);
  });
});

describe('useUserLevel', () => {
  it('returns level 1 for new user', () => {
    const { result } = renderHookWithProviders(() => useUserLevel(), makeState({ totalNotes: 0, totalAppOpens: 0 }));
    expect(result.current.level).toBe(1);
    expect(result.current.title).toBeDefined();
  });

  it('returns higher level for active user', () => {
    const { result } = renderHookWithProviders(() => useUserLevel(), makeState({ totalNotes: 50, totalAppOpens: 50 }));
    expect(result.current.level).toBeGreaterThan(1);
    expect(result.current.totalNotes).toBe(50);
    expect(result.current.totalAppOpens).toBe(50);
  });
});
