/**
 * useTutorial Hook
 * React hook for interacting with the tutorial system
 */

import { useCallback, useEffect, useState } from 'react';
import { tutorialService } from '../services/tutorialService';
import type { Tutorial, TutorialState, TutorialProgress } from '../types/tutorial';

export function useTutorial() {
  const [state, setState] = useState<TutorialState>(tutorialService.getState());

  useEffect(() => {
    const unsubscribe = tutorialService.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  // Start a tutorial
  const startTutorial = useCallback((tutorialId: string) => {
    return tutorialService.startTutorial(tutorialId);
  }, []);

  // Go to next step
  const nextStep = useCallback(() => {
    tutorialService.nextStep();
  }, []);

  // Skip current tutorial
  const skipTutorial = useCallback(() => {
    tutorialService.skipTutorial();
  }, []);

  // Check if tutorial is completed
  const isTutorialCompleted = useCallback((tutorialId: string) => {
    return tutorialService.isTutorialCompleted(tutorialId);
  }, []);

  // Get progress for a tutorial
  const getTutorialProgress = useCallback((tutorialId: string): TutorialProgress | undefined => {
    return tutorialService.getTutorialProgress(tutorialId);
  }, []);

  // Get current tutorial info
  const currentTutorial = tutorialService.getCurrentTutorial();
  const currentStep = tutorialService.getCurrentStep();

  // Check onboarding status
  const isOnboardingComplete = useCallback(() => {
    return tutorialService.isOnboardingComplete();
  }, []);

  // Get recommended tutorial
  const getRecommendedTutorial = useCallback((): Tutorial | null => {
    return tutorialService.getRecommendedTutorial();
  }, []);

  // Reset all progress
  const resetAllProgress = useCallback(() => {
    tutorialService.resetAllProgress();
  }, []);

  // Update preferences
  const updatePreferences = useCallback((prefs: Partial<TutorialState['preferences']>) => {
    tutorialService.updatePreferences(prefs);
  }, []);

  // Export/Import
  const exportProgress = useCallback(() => {
    return tutorialService.exportProgress();
  }, []);

  const importProgress = useCallback((data: string) => {
    return tutorialService.importProgress(data);
  }, []);

  // Contextual help
  const showContextualHelp = useCallback((elementId: string) => {
    // This would integrate with a tooltip system
    console.log('[Tutorial] Show help for:', elementId);
  }, []);

  return {
    // State
    isActive: state.isActive,
    currentTutorialId: state.currentTutorial,
    currentStepIndex: state.currentStepIndex,
    completedTutorials: state.completedTutorials,
    preferences: state.preferences,
    
    // Current info
    currentTutorial,
    currentStep,
    
    // Actions
    startTutorial,
    nextStep,
    skipTutorial,
    isTutorialCompleted,
    getTutorialProgress,
    isOnboardingComplete,
    getRecommendedTutorial,
    resetAllProgress,
    updatePreferences,
    exportProgress,
    importProgress,
    showContextualHelp,
  };
}

/**
 * Hook for contextual help
 */
export function useContextualHelp(helpId: string) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const shouldShow = tutorialService.shouldShowContextualHelp(helpId);
    setShowHelp(shouldShow);
  }, [helpId]);

  const dismissHelp = useCallback(() => {
    tutorialService.markContextualHelpShown(helpId);
    setShowHelp(false);
  }, [helpId]);

  return {
    showHelp,
    dismissHelp,
  };
}

/**
 * Hook to check if user is new
 */
export function useIsNewUser(): boolean {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const onboardingComplete = tutorialService.isOnboardingComplete();
    setIsNew(!onboardingComplete);
  }, []);

  return isNew;
}

/**
 * Hook for tutorial analytics
 */
export function useTutorialAnalytics() {
  const getAnalytics = useCallback(() => {
    return tutorialService.getAnalytics();
  }, []);

  return {
    getAnalytics,
  };
}

export default useTutorial;
