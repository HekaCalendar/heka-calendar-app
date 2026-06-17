// @ts-nocheck
import { describe, it, expect } from 'vitest';
import tutorialReducer, {
  startTutorial,
  nextStep,
  setStep,
  setSpotlightTarget,
  setTooltipPosition,
  completeTutorial,
  skipTutorial,
  updateProgress,
  updatePreferences,
  resetTutorialState,
  resetAllProgress,
  loadTutorialState,
} from '../src/store/tutorialSlice';

function createTutorialState(overrides = {}) {
  return {
    isActive: false,
    currentTutorial: null,
    currentStepIndex: 0,
    spotlightTarget: null,
    tooltipPosition: null,
    completedTutorials: [],
    progress: [],
    currentHintIndex: 0,
    isWaitingForAction: false,
    lastInteractionAt: null,
    preferences: {
      autoShowTutorials: true,
      showHints: true,
      reducedMotion: false,
      skipOnboarding: false,
      hintDelaySeconds: 8,
    },
    ...overrides,
  };
}

describe('tutorialSlice', () => {
  it('starts tutorial', () => {
    let state = createTutorialState();
    state = tutorialReducer(state, startTutorial('onboarding'));
    expect(state.isActive).toBe(true);
    expect(state.currentTutorial).toBe('onboarding');
    expect(state.currentStepIndex).toBe(0);
  });

  it('increments step', () => {
    let state = createTutorialState({ isActive: true, currentStepIndex: 2 });
    state = tutorialReducer(state, nextStep());
    expect(state.currentStepIndex).toBe(3);
  });

  it('sets specific step', () => {
    let state = createTutorialState();
    state = tutorialReducer(state, setStep(5));
    expect(state.currentStepIndex).toBe(5);
  });

  it('sets spotlight target', () => {
    let state = createTutorialState();
    state = tutorialReducer(state, setSpotlightTarget('.menu-btn'));
    expect(state.spotlightTarget).toBe('.menu-btn');
  });

  it('clears spotlight target', () => {
    let state = createTutorialState({ spotlightTarget: '.menu-btn' });
    state = tutorialReducer(state, setSpotlightTarget(null));
    expect(state.spotlightTarget).toBeNull();
  });

  it('sets tooltip position', () => {
    let state = createTutorialState();
    state = tutorialReducer(state, setTooltipPosition({ x: 100, y: 200 }));
    expect(state.tooltipPosition).toEqual({ x: 100, y: 200 });
  });

  it('completes tutorial and adds to completed list', () => {
    let state = createTutorialState({ isActive: true, currentTutorial: 'onboarding' });
    state = tutorialReducer(state, completeTutorial('onboarding'));
    expect(state.completedTutorials).toContain('onboarding');
    expect(state.isActive).toBe(false);
    expect(state.currentTutorial).toBeNull();
    expect(state.currentStepIndex).toBe(0);
  });

  it('does not duplicate completed tutorials', () => {
    let state = createTutorialState({ completedTutorials: ['onboarding'] });
    state = tutorialReducer(state, completeTutorial('onboarding'));
    expect(state.completedTutorials).toHaveLength(1);
  });

  it('skips tutorial and resets state', () => {
    let state = createTutorialState({ isActive: true, currentTutorial: 'onboarding', currentStepIndex: 3 });
    state = tutorialReducer(state, skipTutorial());
    expect(state.isActive).toBe(false);
    expect(state.currentTutorial).toBeNull();
    expect(state.currentStepIndex).toBe(0);
  });

  it('updates existing progress', () => {
    let state = createTutorialState({
      progress: [{ tutorialId: 't1', stepIndex: 2, totalSteps: 5 }],
    });
    state = tutorialReducer(state, updateProgress({ tutorialId: 't1', stepIndex: 3, totalSteps: 5 }));
    expect(state.progress[0].stepIndex).toBe(3);
  });

  it('adds new progress entry', () => {
    let state = createTutorialState();
    state = tutorialReducer(state, updateProgress({ tutorialId: 't1', stepIndex: 1, totalSteps: 5 }));
    expect(state.progress).toHaveLength(1);
    expect(state.progress[0].tutorialId).toBe('t1');
  });

  it('updates preferences partially', () => {
    let state = createTutorialState();
    state = tutorialReducer(state, updatePreferences({ showHints: false, hintDelaySeconds: 12 }));
    expect(state.preferences.showHints).toBe(false);
    expect(state.preferences.hintDelaySeconds).toBe(12);
    expect(state.preferences.autoShowTutorials).toBe(true);
  });

  it('resets tutorial state but keeps completed and preferences', () => {
    let state = createTutorialState({
      isActive: true,
      currentTutorial: 'onboarding',
      currentStepIndex: 3,
      spotlightTarget: '.btn',
      completedTutorials: ['onboarding'],
    });
    state = tutorialReducer(state, resetTutorialState());
    expect(state.isActive).toBe(false);
    expect(state.currentTutorial).toBeNull();
    expect(state.currentStepIndex).toBe(0);
    expect(state.spotlightTarget).toBeNull();
    expect(state.completedTutorials).toContain('onboarding');
  });

  it('resetAllProgress returns initial state', () => {
    let state = createTutorialState({
      isActive: true,
      currentTutorial: 'onboarding',
      completedTutorials: ['onboarding'],
      progress: [{ tutorialId: 't1', stepIndex: 2, totalSteps: 5 }],
    });
    const newState = tutorialReducer(state, resetAllProgress());
    expect(newState.isActive).toBe(false);
    expect(newState.completedTutorials).toHaveLength(0);
    expect(newState.progress).toHaveLength(0);
  });

  it('loads saved state', () => {
    let state = createTutorialState();
    state = tutorialReducer(state, loadTutorialState({ isActive: true, currentTutorial: 'restore', currentStepIndex: 2 }));
    expect(state.isActive).toBe(true);
    expect(state.currentTutorial).toBe('restore');
    expect(state.currentStepIndex).toBe(2);
    expect(state.preferences.autoShowTutorials).toBe(true);
  });
});
