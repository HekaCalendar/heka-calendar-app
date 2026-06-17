/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TUTORIAL ENGINE v3 — 13 Steps. Tight. Epic. No Fatigue.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { tutorialService } from '../../../services/tutorialService';

export type TutorialStepId =
  | 'welcome'
  | 'the-grid'
  | 'navigation'
  | 'day-cells'
  | 'day-panel'
  | 'celestial-guide'
  | 'features'
  | 'settings'
  | 'ai-coach'
  | 'tracker'
  | 'community'
  | 'first-note'
  | 'complete';

interface TutorialStep {
  id: TutorialStepId;
  title: string;
  instruction: string;
  detail: string;
  action: string;
  requiresInteraction: boolean;
  spotlightSelector?: string;
}

interface StepConfig {
  requiresInteraction: boolean;
  spotlightSelector?: string;
}

const STEP_ORDER: TutorialStepId[] = [
  'welcome',
  'the-grid',
  'navigation',
  'day-cells',
  'day-panel',
  'celestial-guide',
  'features',
  'settings',
  'ai-coach',
  'tracker',
  'community',
  'first-note',
  'complete',
];

const STEP_CONFIG: Record<TutorialStepId, StepConfig> = {
  'welcome': { requiresInteraction: false },
  'the-grid': { requiresInteraction: true, spotlightSelector: '.calendar-grid' },
  'navigation': { requiresInteraction: true, spotlightSelector: '.month-nav-prev, .month-nav-next' },
  'day-cells': { requiresInteraction: true, spotlightSelector: '.day-cell' },
  'day-panel': { requiresInteraction: true, spotlightSelector: '.day-panel' },
  'celestial-guide': { requiresInteraction: true, spotlightSelector: '.celestial-panel, .celestial-guide' },
  'features': { requiresInteraction: false, spotlightSelector: '.month-header__column--actions' },
  'settings': { requiresInteraction: true, spotlightSelector: '.display-toggles, .settings-panel' },
  'ai-coach': { requiresInteraction: false, spotlightSelector: '.ai-coach-container, .ai-coach-button' },
  'tracker': { requiresInteraction: false, spotlightSelector: '.tracker-panel, [aria-label*="Tracker"]' },
  'community': { requiresInteraction: false, spotlightSelector: '[aria-label*="Community"]' },
  'first-note': { requiresInteraction: true, spotlightSelector: '.day-panel__section' },
  'complete': { requiresInteraction: false },
};

function useTutorialSteps(t: (key: string, options?: Record<string, unknown>) => string): TutorialStep[] {
  return useMemo(() => {
    return STEP_ORDER.map((id) => {
      const base = `tutorial:steps.${id}`;
      return {
        id,
        title: t(`${base}.title`),
        instruction: t(`${base}.instruction`),
        detail: t(`${base}.detail`),
        action: t(`${base}.action`),
        requiresInteraction: STEP_CONFIG[id].requiresInteraction,
        spotlightSelector: STEP_CONFIG[id].spotlightSelector,
      };
    });
  }, [t]);
}

interface TutorialState {
  currentStepIndex: number;
  completedSteps: TutorialStepId[];
  interactions: Record<string, boolean>;
}

interface TutorialContextValue {
  state: TutorialState;
  currentStep: TutorialStep;
  progress: number;
  canGoBack: boolean;
  isComplete: boolean;
  goNext: () => void;
  goBack: () => void;
  markInteraction: (key: string) => void;
  complete: () => void;
}

const TutorialContext = createContext<TutorialContextValue | null>(null);

const STORAGE_KEY = 'heka-tutorial-v3';

function loadState(): TutorialState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { currentStepIndex: 0, completedSteps: [], interactions: {} };
}

function saveState(state: TutorialState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const TutorialEngine: React.FC<{ children: React.ReactNode; onComplete: () => void }> = ({
  children,
  onComplete,
}) => {
  const { t } = useTranslation(['tutorial', 'common']);
  const STEPS = useTutorialSteps(t);
  const [state, setState] = useState<TutorialState>(loadState);

  const currentStep = STEPS[state.currentStepIndex] ?? STEPS[STEPS.length - 1];
  const progress = Math.round((state.currentStepIndex / (STEPS.length - 1)) * 100);
  const canGoBack = state.currentStepIndex > 0;
  const isComplete = state.currentStepIndex >= STEPS.length - 1;

  const goNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = Math.min(prev.currentStepIndex + 1, STEPS.length - 1);
      const next: TutorialState = {
        ...prev,
        currentStepIndex: nextIndex,
        completedSteps: [...prev.completedSteps, STEPS[prev.currentStepIndex].id],
      };
      saveState(next);
      return next;
    });
  }, [STEPS]);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentStepIndex <= 0) return prev;
      const next: TutorialState = {
        ...prev,
        currentStepIndex: prev.currentStepIndex - 1,
      };
      saveState(next);
      return next;
    });
  }, []);

  const markInteraction = useCallback((key: string) => {
    setState((prev) => {
      const next: TutorialState = {
        ...prev,
        interactions: { ...prev.interactions, [key]: true },
      };
      saveState(next);
      return next;
    });
  }, []);

  const complete = useCallback(() => {
    setState((prev) => {
      const next: TutorialState = {
        ...prev,
        currentStepIndex: STEPS.length - 1,
        completedSteps: STEPS.map((s) => s.id),
      };
      saveState(next);
      return next;
    });
    try {
      tutorialService.markTutorialCompleted('celestial-awakening-v1');
      tutorialService.markTutorialCompleted('first-visit-grid');
      tutorialService.markTutorialCompleted('first-visit-day-panel');
    } catch { /* ignore */ }
    onComplete();
  }, [STEPS, onComplete]);

  const value = useMemo(
    () => ({
      state,
      currentStep,
      progress,
      canGoBack,
      isComplete,
      goNext,
      goBack,
      markInteraction,
      complete,
    }),
    [state, currentStep, progress, canGoBack, isComplete, goNext, goBack, markInteraction, complete]
  );

  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>;
};

export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error('useTutorial must be used within TutorialEngine');
  return ctx;
}

export { STEP_ORDER };
export type { TutorialStep };
