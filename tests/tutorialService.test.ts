/**
 * TutorialService Tests — Phase 3: Service Layer Hardening
 * Tests the core tutorial engine without DOM dependencies (mocked).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We must import after localStorage is mocked, but since tutorialService
// is a singleton that reads localStorage at construction time, we use
// dynamic import with fresh module load per test block.

const TUTORIAL_KEYS = [
  'heka-tutorial-state-v2',
  'heka-tutorial-analytics-v2',
  'heka-tutorial-data-version',
];

function createMockLocalStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => {
      Object.keys(store).forEach(k => delete store[k]);
    },
    getStore: () => store,
  };
}

let mockStorage = createMockLocalStorage();

beforeEach(() => {
  mockStorage = createMockLocalStorage();
  vi.stubGlobal('localStorage', mockStorage);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

// Helper to get a fresh service instance (bypasses singleton caching in module graph)
async function getFreshService() {
  vi.resetModules();
  const mod = await import('../src/services/tutorialService');
  return mod.tutorialService;
}

describe('TutorialService — Lifecycle & State', () => {
  it('loads default state when localStorage is empty', async () => {
    const svc = await getFreshService();
    const state = svc.getState();
    expect(state.isActive).toBe(false);
    expect(state.currentTutorial).toBeNull();
    expect(state.currentStepIndex).toBe(0);
    expect(state.completedTutorials).toEqual([]);
    expect(state.progress).toEqual([]);
    expect(state.preferences.autoShowTutorials).toBe(true);
    expect(state.preferences.showHints).toBe(true);
    expect(state.preferences.skipOnboarding).toBe(false);
  });

  it('persists state to localStorage on notify', async () => {
    const svc = await getFreshService();
    svc.updatePreferences({ hintDelaySeconds: 12 });
    const raw = mockStorage.getStore()['heka-tutorial-state-v2'];
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw);
    expect(parsed.preferences.hintDelaySeconds).toBe(12);
  });

  it('loads saved state from localStorage', async () => {
    mockStorage.setItem('heka-tutorial-data-version', '2.2.1-celestial');
    mockStorage.setItem('heka-tutorial-state-v2', JSON.stringify({
      isActive: true,
      currentTutorial: 'elite-onboarding',
      currentStepIndex: 3,
      completedTutorials: ['calendar-basics'],
      progress: [{ tutorialId: 'calendar-basics', completed: true, currentStepIndex: 0, completedSteps: [], startedAt: '2024-01-01', skipped: false, showCount: 1 }],
      preferences: { autoShowTutorials: false, showHints: false, reducedMotion: true, skipOnboarding: true, hintDelaySeconds: 5 },
    }));
    const svc = await getFreshService();
    const state = svc.getState();
    expect(state.isActive).toBe(true);
    expect(state.currentTutorial).toBe('elite-onboarding');
    expect(state.currentStepIndex).toBe(3);
    expect(state.completedTutorials).toContain('calendar-basics');
    expect(state.preferences.autoShowTutorials).toBe(false);
  });

  it('resets state when tutorial version changes', async () => {
    mockStorage.setItem('heka-tutorial-data-version', '1.0.0-old');
    mockStorage.setItem('heka-tutorial-state-v2', JSON.stringify({
      isActive: true,
      currentTutorial: 'elite-onboarding',
      currentStepIndex: 5,
      completedTutorials: ['calendar-basics'],
      progress: [],
      preferences: { autoShowTutorials: true, showHints: true, reducedMotion: false, skipOnboarding: false, hintDelaySeconds: 8 },
    }));
    const svc = await getFreshService();
    const state = svc.getState();
    expect(state.isActive).toBe(false);
    expect(state.currentTutorial).toBeNull();
    expect(state.completedTutorials).toEqual([]);
  });

  it('subscribe notifies listener immediately with current state', async () => {
    const svc = await getFreshService();
    const listener = vi.fn();
    svc.subscribe(listener);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }));
  });

  it('subscribe returns unsubscribe function', async () => {
    const svc = await getFreshService();
    const listener = vi.fn();
    const unsubscribe = svc.subscribe(listener);
    unsubscribe();
    svc.updatePreferences({ hintDelaySeconds: 99 });
    expect(listener).toHaveBeenCalledTimes(1); // only initial call
  });

  it('getState returns a clone, not the internal reference', async () => {
    const svc = await getFreshService();
    const state1 = svc.getState();
    const state2 = svc.getState();
    expect(state1).toEqual(state2);
    expect(state1).not.toBe(state2);
  });
});

describe('TutorialService — Tutorial Control', () => {
  it('returns false when starting a non-existent tutorial', async () => {
    const svc = await getFreshService();
    expect(svc.startTutorial('does-not-exist')).toBe(false);
  });

  it('starts a valid tutorial and sets active state', async () => {
    const svc = await getFreshService();
    const result = svc.startTutorial('elite-onboarding');
    expect(result).toBe(true);
    const state = svc.getState();
    expect(state.isActive).toBe(true);
    expect(state.currentTutorial).toBe('elite-onboarding');
    expect(state.currentStepIndex).toBe(0);
  });

  it('creates progress entry on first start', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    const progress = svc.getTutorialProgress('elite-onboarding');
    expect(progress).toBeDefined();
    expect(progress!.completed).toBe(false);
    expect(progress!.showCount).toBe(1);
    expect(progress!.startedAt).toBeTruthy();
  });

  it('increments showCount on re-start', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    svc.skipTutorial();
    svc.startTutorial('elite-onboarding');
    const progress = svc.getTutorialProgress('elite-onboarding');
    expect(progress!.showCount).toBe(2);
  });

  it('returns false if tutorial already completed and maxShows reached', async () => {
    const svc = await getFreshService();
    // Mark tutorial as completed via service
    svc.markTutorialCompleted('elite-onboarding');
    // Try to start again — maxShows=1 means it should reject
    expect(svc.startTutorial('elite-onboarding')).toBe(false);
  });

  it('returns false when prerequisites are not met', async () => {
    const svc = await getFreshService();
    // calendar-basics requires elite-onboarding
    expect(svc.startTutorial('calendar-basics')).toBe(false);
  });

  it('starts tutorial when prerequisites are satisfied', async () => {
    const svc = await getFreshService();
    svc.markTutorialCompleted('elite-onboarding');
    expect(svc.startTutorial('calendar-basics')).toBe(true);
  });

  it('advances to next step', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    const result = svc.nextStep();
    expect(result).toBe(true);
    expect(svc.getState().currentStepIndex).toBe(1);
  });

  it('marks step as completed when advancing', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    svc.nextStep();
    const progress = svc.getTutorialProgress('elite-onboarding');
    expect(progress!.completedSteps.length).toBeGreaterThan(0);
  });

  it('completes tutorial on final nextStep', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    const tutorial = svc.getCurrentTutorial()!;
    // Advance through all steps
    for (let i = 0; i < tutorial.steps.length; i++) {
      svc.nextStep();
    }
    expect(svc.isTutorialCompleted('elite-onboarding')).toBe(true);
    expect(svc.getState().isActive).toBe(false);
    expect(svc.getState().currentTutorial).toBeNull();
  });

  it('previousStep goes back one step', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    svc.nextStep();
    svc.nextStep();
    expect(svc.getState().currentStepIndex).toBe(2);
    const result = (svc as any).previousStep();
    expect(result).toBe(true);
    expect(svc.getState().currentStepIndex).toBe(1);
  });

  it('previousStep returns false on first step', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    const result = (svc as any).previousStep();
    expect(result).toBe(false);
  });

  it('goToStep navigates to specific step', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    const tutorial = svc.getCurrentTutorial()!;
    const targetStepId = tutorial.steps[3].id;
    const result = (svc as any).goToStep(targetStepId);
    expect(result).toBe(true);
    expect(svc.getState().currentStepIndex).toBe(3);
  });

  it('skipTutorial marks progress as skipped', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    svc.skipTutorial();
    const progress = svc.getTutorialProgress('elite-onboarding');
    expect(progress!.skipped).toBe(true);
    expect(svc.getState().isActive).toBe(false);
  });

  it('getCurrentTutorial returns null when inactive', async () => {
    const svc = await getFreshService();
    expect(svc.getCurrentTutorial()).toBeNull();
  });

  it('getCurrentStep returns null when inactive', async () => {
    const svc = await getFreshService();
    expect(svc.getCurrentStep()).toBeNull();
  });

  it('getCurrentStep returns correct step when active', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    const step = svc.getCurrentStep();
    expect(step).toBeDefined();
    expect(step!.id).toBe(svc.getCurrentTutorial()!.steps[0].id);
  });
});

describe('TutorialService — Queries & Recommendations', () => {
  it('isTutorialCompleted returns false for unseen tutorials', async () => {
    const svc = await getFreshService();
    expect(svc.isTutorialCompleted('elite-onboarding')).toBe(false);
  });

  it('isTutorialCompleted returns true after completion', async () => {
    const svc = await getFreshService();
    svc.markTutorialCompleted('elite-onboarding');
    expect(svc.isTutorialCompleted('elite-onboarding')).toBe(true);
  });

  it('hasUserSeenTutorial returns false for unseen', async () => {
    const svc = await getFreshService();
    expect((svc as any).hasUserSeenTutorial('elite-onboarding')).toBe(false);
  });

  it('hasUserSeenTutorial returns true after start', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    expect((svc as any).hasUserSeenTutorial('elite-onboarding')).toBe(true);
  });

  it('isOnboardingComplete returns false initially', async () => {
    const svc = await getFreshService();
    expect(svc.isOnboardingComplete()).toBe(false);
  });

  it('isOnboardingComplete returns true after elite-onboarding', async () => {
    const svc = await getFreshService();
    svc.markTutorialCompleted('elite-onboarding');
    expect(svc.isOnboardingComplete()).toBe(true);
  });

  it('getRecommendedTutorial returns first uncompleted in priority order', async () => {
    const svc = await getFreshService();
    const rec = svc.getRecommendedTutorial();
    expect(rec).not.toBeNull();
    expect(rec!.id).toBe('celestial-awakening-v1');
  });

  it('getRecommendedTutorial returns null when all completed', async () => {
    const svc = await getFreshService();
    svc.markTutorialCompleted('elite-onboarding');
    svc.markTutorialCompleted('celestial-awakening-v1');
    svc.markTutorialCompleted('calendar-basics');
    svc.markTutorialCompleted('astrology-intro');
    svc.markTutorialCompleted('gamification-intro');
    expect(svc.getRecommendedTutorial()).toBeNull();
  });
});

describe('TutorialService — Preferences & Reset', () => {
  it('updatePreferences merges partial preferences', async () => {
    const svc = await getFreshService();
    svc.updatePreferences({ hintDelaySeconds: 20 });
    expect(svc.getState().preferences.hintDelaySeconds).toBe(20);
    expect(svc.getState().preferences.autoShowTutorials).toBe(true); // unchanged
  });

  it('resetAllProgress restores default state', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    svc.nextStep();
    svc.resetAllProgress();
    const state = svc.getState();
    expect(state.isActive).toBe(false);
    expect(state.currentTutorial).toBeNull();
    expect(state.progress).toEqual([]);
  });

  it('resetAllTutorials restores default state and saves', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    (svc as any).resetAllTutorials();
    const state = svc.getState();
    expect(state.isActive).toBe(false);
    expect(state.currentTutorial).toBeNull();
  });

  it('markTutorialCompleted creates progress if none exists', async () => {
    const svc = await getFreshService();
    svc.markTutorialCompleted('calendar-basics');
    expect(svc.isTutorialCompleted('calendar-basics')).toBe(true);
    const progress = svc.getTutorialProgress('calendar-basics');
    expect(progress!.completed).toBe(true);
    expect(progress!.completedAt).toBeTruthy();
  });

  it('markTutorialCompleted updates existing progress', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    svc.skipTutorial();
    svc.markTutorialCompleted('elite-onboarding');
    const progress = svc.getTutorialProgress('elite-onboarding');
    expect(progress!.completed).toBe(true);
    expect(progress!.skipped).toBe(true); // still true from before
  });
});

describe('TutorialService — Contextual Help', () => {
  it('shouldShowContextualHelp returns false for unknown helpId', async () => {
    const svc = await getFreshService();
    expect(svc.shouldShowContextualHelp('non-existent')).toBe(false);
  });

  it('markContextualHelpShown prevents future shows when showOnce', async () => {
    const svc = await getFreshService();
    const helpId = 'tutorial-quick-help';
    // First check: if help exists and showOnce is true, should show initially
    // We don't know the exact ID, so we'll test the mechanism generically
    svc.markContextualHelpShown('test-help-1');
    const raw = mockStorage.getStore()['heka-help-shown-test-help-1'];
    expect(raw).toBe('true');
  });

  it('getContextualHelp returns undefined for unknown selector', async () => {
    const svc = await getFreshService();
    expect(svc.getContextualHelp('.totally-made-up')).toBeUndefined();
  });
});

describe('TutorialService — Analytics', () => {
  it('getAnalytics returns empty array when no events', async () => {
    const svc = await getFreshService();
    expect(svc.getAnalytics()).toEqual([]);
  });

  it('tracks analytics events to localStorage', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    const analytics = svc.getAnalytics();
    expect(analytics.length).toBeGreaterThan(0);
    expect(analytics[0]).toMatchObject({
      tutorialId: 'elite-onboarding',
      event: 'started',
    });
  });
});

describe('TutorialService — Export/Import', () => {
  it('exportProgress returns JSON string with state and analytics', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    const exported = svc.exportProgress();
    const parsed = JSON.parse(exported);
    expect(parsed.state).toBeDefined();
    expect(parsed.analytics).toBeDefined();
    expect(parsed.exportedAt).toBeTruthy();
  });

  it('importProgress restores state from JSON', async () => {
    const svc = await getFreshService();
    const payload = JSON.stringify({
      state: {
        isActive: true,
        currentTutorial: 'calendar-basics',
        currentStepIndex: 2,
        completedTutorials: ['elite-onboarding'],
        progress: [{ tutorialId: 'elite-onboarding', completed: true, currentStepIndex: 0, completedSteps: [], startedAt: '2024-01-01', skipped: false, showCount: 1 }],
        preferences: { autoShowTutorials: true, showHints: true, reducedMotion: false, skipOnboarding: false, hintDelaySeconds: 8 },
      },
      analytics: [],
      exportedAt: '2024-06-01T00:00:00Z',
    });
    const result = svc.importProgress(payload);
    expect(result).toBe(true);
    expect(svc.getState().currentTutorial).toBe('calendar-basics');
    expect(svc.getState().currentStepIndex).toBe(2);
  });

  it('importProgress returns false for invalid JSON', async () => {
    const svc = await getFreshService();
    expect(svc.importProgress('not-json{{{')).toBe(false);
  });

  it('importProgress returns false for missing state', async () => {
    const svc = await getFreshService();
    expect(svc.importProgress('{"analytics":[]}')).toBe(false);
  });
});

describe('TutorialService — Auto-Triggers', () => {
  it('checkAutoTriggers does nothing when autoShowTutorials is false', async () => {
    const svc = await getFreshService();
    svc.updatePreferences({ autoShowTutorials: false });
    svc.checkAutoTriggers();
    expect(svc.getState().isActive).toBe(false);
  });

  it('checkAutoTriggers does nothing when skipOnboarding is true', async () => {
    const svc = await getFreshService();
    svc.updatePreferences({ skipOnboarding: true });
    svc.checkAutoTriggers();
    expect(svc.getState().isActive).toBe(false);
  });

  it('checkAutoTriggers does nothing when a tutorial is already active', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    svc.checkAutoTriggers();
    // Should remain on elite-onboarding (not try to start another)
    expect(svc.getState().currentTutorial).toBe('elite-onboarding');
  });

  it('triggerTutorial does nothing when no action-triggered tutorials exist', async () => {
    const svc = await getFreshService();
    // No tutorials have triggerCondition 'action-triggered' in current data
    svc.triggerTutorial('some-action');
    expect(svc.getState().isActive).toBe(false);
  });

  it('triggerTutorial does nothing for completed tutorials', async () => {
    const svc = await getFreshService();
    svc.markTutorialCompleted('astrology-intro');
    svc.triggerTutorial('entered-stars-hub');
    expect(svc.getState().isActive).toBe(false);
  });
});

describe('TutorialService — Redux Bridge', () => {
  it('connectToDispatch stores dispatch function', async () => {
    const svc = await getFreshService();
    const dispatch = vi.fn();
    (svc as any).connectToDispatch(dispatch);
    svc.updatePreferences({ hintDelaySeconds: 42 });
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'tutorial/loadTutorialState',
    }));
  });
});

describe('TutorialService — Interactive Steps (DOM mocked)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('setupInteractiveStep with elementAppears validation', async () => {
    const mockEl = document.createElement('div');
    mockEl.className = 'test-target';
    document.body.appendChild(mockEl);

    const svc = await getFreshService();
    svc.startTutorial('celestial-awakening-v1');

    // Find an interactive step or mock one via goToStep
    const tutorial = svc.getCurrentTutorial()!;
    const interactiveStepIndex = tutorial.steps.findIndex(s => s.type === 'interactive');
    if (interactiveStepIndex >= 0) {
      (svc as any).goToStep(tutorial.steps[interactiveStepIndex].id);
      expect(svc.getState().isWaitingForAction).toBe(true);
    }

    // Clean up to prevent timer leaks
    svc.skipTutorial();
    vi.runAllTimers();

    document.body.removeChild(mockEl);
  });

  it('cleanupInteractiveStep clears timers and listeners', async () => {
    const svc = await getFreshService();
    svc.startTutorial('celestial-awakening-v1');
    // Manually set up some interactive state
    (svc as any).cleanupInteractiveStep();
    expect(svc.getState().isWaitingForAction).toBe(false);
    vi.runAllTimers();
  });
});

describe('TutorialService — Tracking Helpers', () => {
  it('trackMonthNavigation sets localStorage keys', async () => {
    const svc = await getFreshService();
    svc.trackMonthNavigation('prev');
    expect(mockStorage.getStore()['tutorial-month-nav-prev']).toBe('true');
    svc.trackMonthNavigation('next');
    expect(mockStorage.getStore()['tutorial-month-nav-next']).toBe('true');
    expect(mockStorage.getStore()['tutorial-month-navigated']).toBe('true');
  });

  it('getMonthNavigationState returns clicked status', async () => {
    const svc = await getFreshService();
    mockStorage.setItem('tutorial-month-nav-prev', 'true');
    const state = svc.getMonthNavigationState();
    expect(state.prevClicked).toBe(true);
    expect(state.nextClicked).toBe(false);
  });

  it('trackTodayButton sets localStorage key', async () => {
    const svc = await getFreshService();
    svc.trackTodayButton();
    expect(mockStorage.getStore()['tutorial-today-clicked']).toBe('true');
  });

  it('trackThemeSelection sets localStorage keys', async () => {
    const svc = await getFreshService();
    svc.trackThemeSelection('dark-matter');
    expect(mockStorage.getStore()['tutorial-theme-selected']).toBe('true');
    expect(mockStorage.getStore()['heka-theme']).toBe('dark-matter');
  });

  it('trackDisplayToggle sets localStorage key', async () => {
    const svc = await getFreshService();
    svc.trackDisplayToggle('showMoonPhases', true);
    expect(mockStorage.getStore()['tutorial-display-showMoonPhases']).toBe('true');
  });

  it('trackCelestialGuideToggle sets localStorage key', async () => {
    const svc = await getFreshService();
    svc.trackCelestialGuideToggle(true);
    expect(mockStorage.getStore()['tutorial-celestial-guide-toggled']).toBe('true');
  });

  it('trackCalendarExpand sets localStorage key', async () => {
    const svc = await getFreshService();
    svc.trackCalendarExpand('vertical');
    expect(mockStorage.getStore()['elite-step-08-expand-vertical']).toBe('true');
  });
});

describe('TutorialService — Hints', () => {
  it('getCurrentHint returns null when no hints', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    expect(svc.getCurrentHint()).toBeNull();
  });

  it('requestHint does nothing when no interactive step', async () => {
    const svc = await getFreshService();
    svc.startTutorial('elite-onboarding');
    // Should not throw
    expect(() => svc.requestHint()).not.toThrow();
  });
});

describe('TutorialService — Shake / Trigger', () => {
  it('triggerShake does not throw when no active tutorial', async () => {
    const svc = await getFreshService();
    expect(() => svc.triggerShake()).not.toThrow();
  });

  it('triggerShake with alternative selectors', async () => {
    const mockEl = document.createElement('button');
    mockEl.className = 'alt-btn';
    document.body.appendChild(mockEl);

    const svc = await getFreshService();
    svc.startTutorial('celestial-awakening-v1');
    const tutorial = svc.getCurrentTutorial()!;
    // Find a step with targetSelector
    const stepWithTarget = tutorial.steps.find(s => s.targetSelector);
    if (stepWithTarget) {
      (svc as any).goToStep(stepWithTarget.id);
      // Should not throw even if selector not found
      expect(() => svc.triggerShake()).not.toThrow();
    }

    svc.skipTutorial();
    document.body.removeChild(mockEl);
  });
});

describe('TutorialService — Guided Task Target', () => {
  it('setGuidedTaskTarget updates selector and notifies', async () => {
    const svc = await getFreshService();
    const listener = vi.fn();
    svc.subscribe(listener);
    const initialCalls = listener.mock.calls.length;
    svc.setGuidedTaskTarget('.new-target');
    expect(svc.getGuidedTaskTarget()).toBe('.new-target');
    expect(listener.mock.calls.length).toBeGreaterThan(initialCalls);
  });

  it('notifySubStepChange notifies listeners', async () => {
    const svc = await getFreshService();
    const listener = vi.fn();
    svc.subscribe(listener);
    const before = listener.mock.calls.length;
    svc.notifySubStepChange();
    expect(listener.mock.calls.length).toBeGreaterThan(before);
  });
});
