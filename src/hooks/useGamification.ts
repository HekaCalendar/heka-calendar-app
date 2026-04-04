/**
 * useGamification Hook - Phase 1 App Engagement & Achievement Tracking
 * 
 * Provides easy-to-use functions for tracking:
 * - Feature discovery
 * - App engagement
 * - Settings exploration
 * - Achievement checking
 */

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { store } from '../store';
import type { FeatureDiscoveryKey, Achievement } from '../types';
import {
  checkAchievements,
  ACHIEVEMENTS,
  getUserLevel,
  getProgressToNextLevel,
  getAchievementsByCategory,
  getSecretAchievements,
  getVisibleAchievements,
  type UnlockedAchievement,
} from '../services/gamificationService';
import {
  trackFeatureDiscovery,
  trackMonthNavigation,
  trackThemeExploration,
  trackFontExploration,
  trackDisplayExploration,
  trackLocationExploration,
  trackGenericSettingExploration,
  selectEngagement,
  selectFeatureDiscovery,
  selectDiscoveryProgress,
  selectTotalDiscoveries,
} from '../services/engagementService';

// ============================================================================
// Main Hook
// ============================================================================

export function useGamification() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select state - get actual state values, not functions
  const engagement = useSelector(selectEngagement);
  const featureDiscovery = useSelector(selectFeatureDiscovery);
  const discoveryProgress = useSelector(selectDiscoveryProgress);
  const totalDiscoveries = useSelector(selectTotalDiscoveries);
  const unlockedAchievements = useSelector((state: RootState) => 
    state.calendar.progress.achievements
  );
  const statistics = useSelector((state: RootState) => state.calendar.statistics);
  const notes = useSelector((state: RootState) => state.calendar.notes);
  // Select only the progress.featureDiscovery slice to minimize re-renders
  const featureDiscoveryState = useSelector((state: RootState) => 
    state.calendar.progress.featureDiscovery
  );
  
  const unlockedIds = useMemo(() => 
    unlockedAchievements.map(a => a.id),
    [unlockedAchievements]
  );
  
  // ========================================================================
  // Feature Discovery
  // ========================================================================
  
  /**
   * Discover a feature - returns true if first time
   */
  const discoverFeature = useCallback((feature: FeatureDiscoveryKey): boolean => {
    const alreadyDiscovered = featureDiscoveryState?.[feature];
    if (!alreadyDiscovered) {
      // Use actual store.getState to ensure full RootState is available
      trackFeatureDiscovery(dispatch, () => store.getState(), feature);
      return true;
    }
    return false;
  }, [dispatch, featureDiscoveryState]);
  
  /**
   * Check if a feature has been discovered
   */
  const hasDiscovered = useCallback((feature: FeatureDiscoveryKey): boolean => {
    return featureDiscovery[feature] === true;
  }, [featureDiscovery]);
  
  /**
   * Get list of undiscovered features
   */
  const undiscoveredFeatures = useMemo((): FeatureDiscoveryKey[] => {
    return (Object.keys(featureDiscovery) as FeatureDiscoveryKey[])
      .filter(key => !featureDiscovery[key]);
  }, [featureDiscovery]);
  
  // ========================================================================
  // Navigation Tracking
  // ========================================================================
  
  const trackMonthVisit = useCallback((year: number, month: number) => {
    trackMonthNavigation(dispatch, year, month);
  }, [dispatch]);
  
  // ========================================================================
  // Settings Exploration
  // ========================================================================
  
  const trackThemeChange = useCallback((themeId: string) => {
    trackThemeExploration(dispatch, themeId);
  }, [dispatch]);
  
  const trackFontChange = useCallback((fontId: string) => {
    trackFontExploration(dispatch, fontId);
  }, [dispatch]);
  
  const trackDisplayToggle = useCallback((setting: string, enabled: boolean) => {
    trackDisplayExploration(dispatch, setting, enabled);
  }, [dispatch]);
  
  const trackLocationChange = useCallback((location: string, subRegion?: string | null) => {
    trackLocationExploration(dispatch, location, subRegion);
  }, [dispatch]);
  
  const trackSetting = useCallback((setting: string, value?: any) => {
    trackGenericSettingExploration(dispatch, setting, value);
  }, [dispatch]);
  
  // ========================================================================
  // Achievement Checking
  // ========================================================================
  
  /**
   * Check for newly unlocked achievements
   */
  const checkNewAchievements = useCallback((): UnlockedAchievement[] => {
    return checkAchievements(
      statistics,
      notes,
      engagement,
      featureDiscovery,
      unlockedIds
    );
  }, [statistics, notes, engagement, featureDiscovery, unlockedIds]);
  
  /**
   * Get all achievements with unlock status
   */
  const allAchievements = useMemo(() => {
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id),
      unlockedAt: unlockedAchievements.find(a => a.id === achievement.id)?.unlockedAt,
    }));
  }, [unlockedIds, unlockedAchievements]);
  
  /**
   * Get visible achievements (non-secret or already unlocked)
   */
  const visibleAchievements = useMemo(() => {
    return getVisibleAchievements(unlockedIds);
  }, [unlockedIds]);
  
  /**
   * Get achievements by category
   */
  const achievementsByCategory = useCallback((category: Achievement['category']) => {
    return getAchievementsByCategory(category);
  }, []);
  
  /**
   * Get secret achievements
   */
  const secretAchievements = useMemo(() => {
    return getSecretAchievements();
  }, []);
  
  // ========================================================================
  // User Level
  // ========================================================================
  
  const userLevel = useMemo(() => {
    return getUserLevel(statistics.totalNotes, engagement.totalAppOpens);
  }, [statistics.totalNotes, engagement.totalAppOpens]);
  
  const levelProgress = useMemo(() => {
    return getProgressToNextLevel(statistics.totalNotes, engagement.totalAppOpens);
  }, [statistics.totalNotes, engagement.totalAppOpens]);
  
  // ========================================================================
  // Statistics
  // ========================================================================
  
  const engagementStats = useMemo(() => ({
    totalAppOpens: engagement.totalAppOpens,
    currentOpenStreak: engagement.currentOpenStreak,
    longestOpenStreak: engagement.longestOpenStreak,
    totalTimeSpent: engagement.totalTimeSpent,
    averageSessionLength: engagement.averageSessionLength,
    uniqueMonthsVisited: engagement.uniqueMonthsVisited.length,
    uniqueYearsVisited: engagement.uniqueYearsVisited.length,
    themesTried: engagement.themesTried.length,
    fontsTried: engagement.fontsTried.length,
    customizationsMade: engagement.customizationsMade,
  }), [engagement]);
  
  // ========================================================================
  // Return
  // ========================================================================
  
  return {
    // Feature Discovery
    discoverFeature,
    hasDiscovered,
    undiscoveredFeatures,
    discoveryProgress,
    totalDiscoveries,
    featureDiscovery,
    
    // Navigation
    trackMonthVisit,
    
    // Settings
    trackThemeChange,
    trackFontChange,
    trackDisplayToggle,
    trackLocationChange,
    trackSetting,
    
    // Achievements
    checkNewAchievements,
    allAchievements,
    visibleAchievements,
    achievementsByCategory,
    secretAchievements,
    unlockedAchievements,
    unlockedIds,
    
    // User Level
    userLevel,
    levelProgress,
    
    // Statistics
    engagementStats,
    engagement,
  };
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook specifically for tracking feature discovery in components
 */
export function useFeatureDiscovery() {
  const dispatch = useDispatch<AppDispatch>();
  const hasDiscovered = useSelector(selectFeatureDiscovery);
  const featureDiscoveryState = useSelector((state: RootState) => 
    state.calendar.progress.featureDiscovery
  );
  
  const discover = useCallback((feature: FeatureDiscoveryKey): boolean => {
    const alreadyDiscovered = featureDiscoveryState?.[feature];
    if (!alreadyDiscovered) {
      // Use actual store.getState to ensure full RootState is available
      trackFeatureDiscovery(dispatch, () => store.getState(), feature);
      return true;
    }
    return false;
  }, [dispatch, featureDiscoveryState]);
  
  const isDiscovered = useCallback((feature: FeatureDiscoveryKey): boolean => {
    return hasDiscovered[feature] === true;
  }, [hasDiscovered]);
  
  return { discover, isDiscovered, hasDiscovered };
}

/**
 * Hook for tracking settings exploration
 */
export function useSettingsTracking() {
  const dispatch = useDispatch<AppDispatch>();
  const engagement = useSelector(selectEngagement);
  
  return {
    trackTheme: useCallback((themeId: string) => {
      trackThemeExploration(dispatch, themeId);
    }, [dispatch]),
    
    trackFont: useCallback((fontId: string) => {
      trackFontExploration(dispatch, fontId);
    }, [dispatch]),
    
    trackDisplay: useCallback((setting: string, enabled: boolean) => {
      trackDisplayExploration(dispatch, setting, enabled);
    }, [dispatch]),
    
    trackLocation: useCallback((location: string, subRegion?: string | null) => {
      trackLocationExploration(dispatch, location, subRegion);
    }, [dispatch]),
    
    trackGeneric: useCallback((setting: string, value?: any) => {
      trackGenericSettingExploration(dispatch, setting, value);
    }, [dispatch]),
    
    // Stats
    themesTried: engagement.themesTried,
    fontsTried: engagement.fontsTried,
    displayModesTried: engagement.displayModesTried,
    customizationsMade: engagement.customizationsMade,
  };
}

/**
 * Hook for achievement display
 */
export function useAchievements() {
  const unlockedAchievements = useSelector((state: RootState) => 
    state.calendar.progress.achievements
  );
  const unlockedIds = useMemo(() => 
    unlockedAchievements.map(a => a.id),
    [unlockedAchievements]
  );
  
  return {
    unlocked: unlockedAchievements,
    unlockedIds,
    totalAchievements: ACHIEVEMENTS.length,
    unlockedCount: unlockedAchievements.length,
    progress: Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100),
    visible: getVisibleAchievements(unlockedIds),
    byCategory: getAchievementsByCategory,
    secret: getSecretAchievements(),
  };
}

/**
 * Hook for user level display
 */
export function useUserLevel() {
  const statistics = useSelector((state: RootState) => state.calendar.statistics);
  const engagement = useSelector(selectEngagement);
  
  return useMemo(() => {
    const level = getUserLevel(statistics.totalNotes, engagement.totalAppOpens);
    const progress = getProgressToNextLevel(statistics.totalNotes, engagement.totalAppOpens);
    
    return {
      ...level,
      progress,
      totalNotes: statistics.totalNotes,
      totalAppOpens: engagement.totalAppOpens,
    };
  }, [statistics.totalNotes, engagement.totalAppOpens]);
}

export default useGamification;
