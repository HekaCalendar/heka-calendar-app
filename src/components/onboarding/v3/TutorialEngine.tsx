/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TUTORIAL ENGINE v3 — 13 Steps. Tight. Epic. No Fatigue.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
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

const STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to HEKA',
    instruction: 'You have never seen a calendar like this.',
    detail: 'Thirteen months. Twenty-eight days each. The moon, the sun, your garden, your energy, your friends — finally in rhythm.',
    action: 'Begin Your Journey',
    requiresInteraction: false,
  },
  {
    id: 'the-grid',
    title: 'The Grid — Thirteen Months',
    instruction: 'Count them. Thirteen. Not twelve.',
    detail: 'Twelve months of exactly 28 days, plus Hexa between August and September. March holds the 29th day. Every month begins on the same day. The year breathes in three arcs — Opening in red, Core in green, Closing in purple. Predictable. Symmetrical. Clean.',
    action: 'Tap any day to continue',
    requiresInteraction: true,
    spotlightSelector: '.calendar-grid',
  },
  {
    id: 'navigation',
    title: 'Move Through Time',
    instruction: 'You are never lost.',
    detail: 'Arrows move between months. Today snaps back to now. Search understands natural language — "Hexa 15" or "January 31st." Expand horizontally or vertically for more detail. The whole year is one gesture away.',
    action: 'Tap ← or → to navigate',
    requiresInteraction: true,
    spotlightSelector: '.month-nav-prev, .month-nav-next',
  },
  {
    id: 'day-cells',
    title: 'Every Cell Is Alive',
    instruction: 'Each day tells a story.',
    detail: 'Swiss Ephemeris moon phase emoji. Civil date underneath. Holiday dots — community-curated. Note snippets — your words, visible on the grid. All thirteen months at once. The whole year, at a glance.',
    action: 'Tap any day to open it',
    requiresInteraction: true,
    spotlightSelector: '.day-cell',
  },
  {
    id: 'day-panel',
    title: 'The Day Opens',
    instruction: 'Your command center for a single day.',
    detail: 'Moon: exact illumination, waxing or waning, Void of Course detection. Astrology: real-time transits against YOUR birth chart. Notes: categorized by mood, task, journal. Tasks: due times, reminders. Energy: vote after 7:30 PM, see the community pulse. This is not a calendar entry. This is a portal.',
    action: 'Explore the day panel, then continue',
    requiresInteraction: true,
    spotlightSelector: '.day-panel',
  },
  {
    id: 'celestial-guide',
    title: 'The Celestial Guide',
    instruction: 'Six cards. One sky.',
    detail: 'Sun Times: live SVG ring, weather, four-tier accuracy. Moon Phase: illumination, void moon, lunar new year countdown. Seasons: true astronomical solstice tracking. Agriculture: what to plant today, by your location and moon phase. Digital Clock: four simultaneous live countdowns. Planetary Hours: true Chaldean hours based on actual sunrise and sunset. Scroll through them. Each one is a scientific instrument.',
    action: 'Scroll the celestial cards to continue',
    requiresInteraction: true,
    spotlightSelector: '.celestial-panel, .celestial-guide',
  },
  {
    id: 'features',
    title: 'Your Arsenal',
    instruction: 'Six print themes. A birth chart engine. A journal. Friends. Stats.',
    detail: 'Print: Default Gold, Minimalist, Sacred Geometry with circular cells, Cyberpunk with CRT scanlines, Nature Organic, Ancient Egypt with hieroglyphs. All free. Lifetime. A4, A3, Letter. Stars: Swiss Ephemeris birth charts, arc-second accuracy. Journal: four modes with AI insight generation. Circle: real-time messaging, shared tasks with HEKA due dates. Stats: 80+ achievements across eight tiers. Secret achievements wait to be discovered.',
    action: 'Continue',
    requiresInteraction: false,
    spotlightSelector: '.month-header__column--actions',
  },
  {
    id: 'settings',
    title: 'Make It Yours',
    instruction: 'Three toggles. Pure Mode. Complete control.',
    detail: 'Civil Dates: overlay Gregorian so you never miss a meeting. Moon Phases: Swiss Ephemeris glyphs on every cell. Holidays: community observances. Pure Mode: full-screen, distraction-free, Yin-Yang dark/light toggle. The calendar adapts to how YOU see time.',
    action: 'Toggle any setting to continue',
    requiresInteraction: true,
    spotlightSelector: '.display-toggles, .settings-panel',
  },
  {
    id: 'ai-coach',
    title: 'HEKA AI — Your Celestial Coach',
    instruction: 'It watches the sky. It watches you.',
    detail: 'Floating glass oracle. Synthesizes moon phases, your transits, tasks, journal sentiment, streaks, and location into poetic, actionable messages. Speaks in your archetype — Warrior, Monk, Artist, Strategist, Mystic, Phoenix. Remembers 19 conversations. Detects synchronicities: moments when your words align with the sky. Optional LLM enhancement with graceful offline fallback. This is not a chatbot. This is an oracle.',
    action: 'Continue',
    requiresInteraction: false,
    spotlightSelector: '.ai-coach-container, .ai-coach-button',
  },
  {
    id: 'tracker',
    title: 'Track Your Rhythm',
    instruction: 'Your body is part of the calendar.',
    detail: 'Mood: 1-10 slider with real-time emoji. Sleep: duration and quality. Energy: physical, mental, emotional, spiritual. Insights dashboard reveals patterns over time. Your calendar holds your story.',
    action: 'Continue',
    requiresInteraction: false,
    spotlightSelector: '.tracker-panel, [aria-label*="Tracker"]',
  },
  {
    id: 'community',
    title: 'Shape the Cosmos',
    instruction: 'Your vote changes the calendar.',
    detail: 'Suggest new holidays. Ten upvotes and it becomes official. Vote on upcoming features — Planned, Considering, In Progress, Released. The calendar evolves because its users evolve it. This is a collaboration.',
    action: 'Continue',
    requiresInteraction: false,
    spotlightSelector: '[aria-label*="Community"]',
  },
  {
    id: 'first-note',
    title: 'Make Your First Mark',
    instruction: 'A calendar is only a tool until you make it yours.',
    detail: 'Tap any day. Scroll to Notes. Write something — a task, a mood, a memory. This is the first entry in what could become a years-long chronicle.',
    action: 'Write a note to complete the tutorial',
    requiresInteraction: true,
    spotlightSelector: '.day-panel__section',
  },
  {
    id: 'complete',
    title: 'You Are Ready',
    instruction: 'The calendar is yours. The sky is yours.',
    detail: 'You know how to navigate thirteen months. You know how to read the moon. You know how to track your energy, vote on holidays, print beautiful pages, journal with the stars, and consult your AI coach. Everything else waits for your curiosity.',
    action: 'Enter HEKA',
    requiresInteraction: false,
  },
];

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
  }, []);

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
  }, [onComplete]);

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

export { STEPS };
export type { TutorialStep };
