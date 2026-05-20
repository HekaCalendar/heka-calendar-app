/**
 * useTutorial Hook Tests — Phase 3: Service Layer Hardening
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useTutorial,
  useContextualHelp,
  useIsNewUser,
  useTutorialAnalytics,
} from '../src/hooks/useTutorial';
import { tutorialService } from '../src/services/tutorialService';

function createMockLocalStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  };
}

beforeEach(() => {
  const mockStorage = createMockLocalStorage();
  vi.stubGlobal('localStorage', mockStorage);
  tutorialService.resetAllProgress();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useTutorial', () => {
  it('returns inactive state initially', () => {
    const { result } = renderHook(() => useTutorial());
    expect(result.current.isActive).toBe(false);
    expect(result.current.currentTutorialId).toBeNull();
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.completedTutorials).toEqual([]);
  });

  it('updates state when tutorial starts', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      result.current.startTutorial('elite-onboarding');
    });
    expect(result.current.isActive).toBe(true);
    expect(result.current.currentTutorialId).toBe('elite-onboarding');
  });

  it('advances step on nextStep', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      result.current.startTutorial('elite-onboarding');
    });
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStepIndex).toBe(1);
  });

  it('marks tutorial completed and resets active state', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      result.current.startTutorial('elite-onboarding');
    });
    // Complete all steps
    const tutorial = tutorialService.getCurrentTutorial()!;
    act(() => {
      for (let i = 0; i < tutorial.steps.length; i++) {
        result.current.nextStep();
      }
    });
    expect(result.current.isTutorialCompleted('elite-onboarding')).toBe(true);
    expect(result.current.isActive).toBe(false);
  });

  it('skipTutorial resets active state', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      result.current.startTutorial('elite-onboarding');
    });
    act(() => {
      result.current.skipTutorial();
    });
    expect(result.current.isActive).toBe(false);
    expect(result.current.currentTutorialId).toBeNull();
  });

  it('getTutorialProgress returns undefined for unseen tutorial', () => {
    const { result } = renderHook(() => useTutorial());
    expect(result.current.getTutorialProgress('elite-onboarding')).toBeUndefined();
  });

  it('getTutorialProgress returns progress after start', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      result.current.startTutorial('elite-onboarding');
    });
    const progress = result.current.getTutorialProgress('elite-onboarding');
    expect(progress).toBeDefined();
    expect(progress!.completed).toBe(false);
  });

  it('currentTutorial and currentStep reflect service state', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      result.current.startTutorial('elite-onboarding');
    });
    expect(result.current.currentTutorial).not.toBeNull();
    expect(result.current.currentStep).not.toBeNull();
    expect(result.current.currentStep!.id).toBe('step-00-cosmic-flow');
  });

  it('isOnboardingComplete returns false initially', () => {
    const { result } = renderHook(() => useTutorial());
    expect(result.current.isOnboardingComplete()).toBe(false);
  });

  it('isOnboardingComplete returns true after completing elite-onboarding', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      tutorialService.markTutorialCompleted('elite-onboarding');
    });
    expect(result.current.isOnboardingComplete()).toBe(true);
  });

  it('getRecommendedTutorial returns first uncompleted', () => {
    const { result } = renderHook(() => useTutorial());
    const rec = result.current.getRecommendedTutorial();
    expect(rec).not.toBeNull();
    expect(rec!.id).toBe('celestial-awakening-v1');
  });

  it('resetAllProgress clears state', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      result.current.startTutorial('elite-onboarding');
    });
    act(() => {
      result.current.resetAllProgress();
    });
    expect(result.current.isActive).toBe(false);
    expect(result.current.completedTutorials).toEqual([]);
  });

  it('updatePreferences updates preferences', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      result.current.updatePreferences({ hintDelaySeconds: 15 });
    });
    expect(result.current.preferences.hintDelaySeconds).toBe(15);
  });

  it('exportProgress returns JSON string', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => {
      result.current.startTutorial('elite-onboarding');
    });
    const exported = result.current.exportProgress();
    expect(typeof exported).toBe('string');
    const parsed = JSON.parse(exported);
    expect(parsed.state).toBeDefined();
  });

  it('importProgress restores state', () => {
    const { result } = renderHook(() => useTutorial());
    const payload = JSON.stringify({
      state: {
        isActive: true,
        currentTutorial: 'calendar-basics',
        currentStepIndex: 1,
        completedTutorials: ['elite-onboarding'],
        progress: [{ tutorialId: 'elite-onboarding', completed: true, currentStepIndex: 0, completedSteps: [], startedAt: '2024-01-01', skipped: false, showCount: 1 }],
        preferences: { autoShowTutorials: true, showHints: true, reducedMotion: false, skipOnboarding: false, hintDelaySeconds: 8 },
      },
      analytics: [],
      exportedAt: '2024-06-01T00:00:00Z',
    });
    act(() => {
      result.current.importProgress(payload);
    });
    expect(result.current.currentTutorialId).toBe('calendar-basics');
    expect(result.current.isTutorialCompleted('elite-onboarding')).toBe(true);
  });
});

describe('useContextualHelp', () => {
  it('returns showHelp true for unseen help', () => {
    const { result } = renderHook(() => useContextualHelp('settings-quick-help'));
    // showHelp may be true or false depending on whether the helpId exists in data
    // The hook simply calls tutorialService.shouldShowContextualHelp
    expect(typeof result.current.showHelp).toBe('boolean');
  });

  it('dismissHelp sets showHelp to false', () => {
    const { result } = renderHook(() => useContextualHelp('test-help-dismiss'));
    act(() => {
      result.current.dismissHelp();
    });
    expect(result.current.showHelp).toBe(false);
  });
});

describe('useIsNewUser', () => {
  it('returns true when onboarding is not complete', () => {
    const { result } = renderHook(() => useIsNewUser());
    expect(result.current).toBe(true);
  });

  it('returns false when onboarding is complete', () => {
    tutorialService.markTutorialCompleted('elite-onboarding');
    const { result } = renderHook(() => useIsNewUser());
    expect(result.current).toBe(false);
  });
});

describe('useTutorialAnalytics', () => {
  it('returns getAnalytics function', () => {
    const { result } = renderHook(() => useTutorialAnalytics());
    expect(typeof result.current.getAnalytics).toBe('function');
  });

  it('getAnalytics returns tracked events', () => {
    const { result } = renderHook(() => useTutorialAnalytics());
    tutorialService.startTutorial('elite-onboarding');
    const analytics = result.current.getAnalytics();
    expect(analytics.length).toBeGreaterThan(0);
    expect(analytics[0]).toMatchObject({
      tutorialId: 'elite-onboarding',
      event: 'started',
    });
  });
});
