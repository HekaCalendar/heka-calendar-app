/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ONBOARDING ENGINE — Graph-based state machine + React Context
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import type {
  OnboardingRuntimeState,
  OnboardingNodeId,
  OnboardingNode,
  OnboardingContextValue,
  UserIntent,
  PersonalizationData,
  OnboardingAnalyticsEvent,
} from '../../../types/onboardingV2';
import {
  ONBOARDING_V2_STORAGE_KEY,
  ONBOARDING_V2_VERSION_KEY,
  ONBOARDING_V2_CURRENT_VERSION,
} from '../../../types/onboardingV2';
import { getCopy, interpolateCopy } from '../../../data/onboardingV2Content';
import { tutorialService } from '../../../services/tutorialService';

// ═══════════════════════════════════════════════════════════════════════════════
// THE GRAPH — Nodes and transitions
// ═══════════════════════════════════════════════════════════════════════════════

const NODE_GRAPH: OnboardingNode[] = [
  {
    id: 'splash',
    canSkip: false,
    analyticsEvent: 'onboarding_splash_shown',
    estimatedSeconds: 3,
    next: () => 'intent-select',
  },
  {
    id: 'intent-select',
    canSkip: true,
    analyticsEvent: 'onboarding_intent_select_shown',
    estimatedSeconds: 10,
    next: () => 'personalization',
  },
  {
    id: 'personalization',
    canSkip: true,
    analyticsEvent: 'onboarding_personalization_shown',
    estimatedSeconds: 30,
    next: () => 'birthday-provocation',
  },
  {
    id: 'birthday-provocation',
    canSkip: true,
    analyticsEvent: 'onboarding_provocation_shown',
    estimatedSeconds: 20,
    next: () => 'the-breakdown',
  },
  {
    id: 'the-breakdown',
    canSkip: true,
    analyticsEvent: 'onboarding_breakdown_shown',
    estimatedSeconds: 45,
    next: () => 'grid-reveal',
  },
  {
    id: 'grid-reveal',
    canSkip: false,
    analyticsEvent: 'onboarding_grid_reveal_shown',
    estimatedSeconds: 30,
    next: () => 'first-note-ritual',
  },
  {
    id: 'first-note-ritual',
    canSkip: false,
    analyticsEvent: 'onboarding_first_note_shown',
    estimatedSeconds: 45,
    next: (s) => {
      if (s.intent === 'work') return 'sync-true-demo';
      if (s.intent === 'stars') return 'stars-preview';
      return 'oracle-preview';
    },
  },
  {
    id: 'sync-true-demo',
    canSkip: true,
    analyticsEvent: 'onboarding_sync_true_shown',
    estimatedSeconds: 20,
    next: () => 'covenant',
  },
  {
    id: 'oracle-preview',
    canSkip: true,
    analyticsEvent: 'onboarding_oracle_preview_shown',
    estimatedSeconds: 15,
    next: (s) => {
      if (s.intent === 'stars') return 'stars-preview';
      return 'covenant';
    },
  },
  {
    id: 'stars-preview',
    canSkip: true,
    analyticsEvent: 'onboarding_stars_preview_shown',
    estimatedSeconds: 15,
    next: (s) => {
      if (s.intent === 'stars') return 'circle-preview';
      return 'covenant';
    },
  },
  {
    id: 'circle-preview',
    canSkip: true,
    analyticsEvent: 'onboarding_circle_preview_shown',
    estimatedSeconds: 15,
    next: () => 'covenant',
  },
  {
    id: 'covenant',
    canSkip: true,
    analyticsEvent: 'onboarding_covenant_shown',
    estimatedSeconds: 10,
    next: () => 'complete',
  },
  {
    id: 'complete',
    canSkip: false,
    analyticsEvent: 'onboarding_complete',
    estimatedSeconds: 0,
    next: () => null,
  },
];

const NODE_MAP = new Map(NODE_GRAPH.map((n) => [n.id, n]));
const TOTAL_ESTIMATED_SECONDS = NODE_GRAPH.reduce((sum, n) => sum + n.estimatedSeconds, 0);

// ═══════════════════════════════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════════════════════════════

type Action =
  | { type: 'GO_TO_NODE'; nodeId: OnboardingNodeId; direction: 'left' | 'right' | 'up' | 'down' }
  | { type: 'EXIT_COMPLETE'; nodeId: OnboardingNodeId }
  | { type: 'ENTER_COMPLETE' }
  | { type: 'SET_INTENT'; intent: UserIntent }
  | { type: 'SET_PERSONALIZATION'; data: Partial<PersonalizationData> }
  | { type: 'MARK_INTERACTION'; flag: string }
  | { type: 'SKIP' }
  | { type: 'COMPLETE' }
  | { type: 'HYDRATE'; state: Partial<OnboardingRuntimeState> }
  | { type: 'RESET' };

function getDefaultState(): OnboardingRuntimeState {
  return {
    currentNodeId: 'splash',
    intent: null,
    personalization: {},
    completedNodes: [],
    gridInteracted: false,
    noteSaved: false,
    syncTrueToggled: false,
    birthChartSet: false,
    startTime: Date.now(),
    lastNodeChangeTime: Date.now(),
    isExiting: false,
    isEntering: true,
    exitDirection: 'right',
    totalEstimatedSeconds: TOTAL_ESTIMATED_SECONDS,
  };
}

function reducer(state: OnboardingRuntimeState, action: Action): OnboardingRuntimeState {
  switch (action.type) {
    case 'GO_TO_NODE': {
      const now = Date.now();
      return {
        ...state,
        currentNodeId: action.nodeId,
        completedNodes: state.completedNodes.includes(state.currentNodeId)
          ? state.completedNodes
          : [...state.completedNodes, state.currentNodeId],
        lastNodeChangeTime: now,
        isExiting: true,
        isEntering: false,
        exitDirection: action.direction,
      };
    }
    case 'EXIT_COMPLETE': {
      return {
        ...state,
        isExiting: false,
        isEntering: true,
      };
    }
    case 'ENTER_COMPLETE': {
      return {
        ...state,
        isEntering: false,
      };
    }
    case 'SET_INTENT': {
      return { ...state, intent: action.intent };
    }
    case 'SET_PERSONALIZATION': {
      return {
        ...state,
        personalization: { ...state.personalization, ...action.data },
      };
    }
    case 'MARK_INTERACTION': {
      return { ...state, [action.flag]: true } as OnboardingRuntimeState;
    }
    case 'SKIP': {
      return { ...state, currentNodeId: 'covenant' };
    }
    case 'COMPLETE': {
      return {
        ...state,
        currentNodeId: 'complete',
        completedNodes: [...state.completedNodes, 'covenant'],
      };
    }
    case 'HYDRATE': {
      return { ...state, ...action.state };
    }
    case 'RESET': {
      return getDefaultState();
    }
    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════════

function loadPersistedState(): Partial<OnboardingRuntimeState> | null {
  try {
    const version = localStorage.getItem(ONBOARDING_V2_VERSION_KEY);
    if (version !== ONBOARDING_V2_CURRENT_VERSION) {
      // Version mismatch — preserve legacy key, start fresh
      return null;
    }
    const raw = localStorage.getItem(ONBOARDING_V2_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Don't hydrate transient animation state
    delete parsed.isExiting;
    delete parsed.isEntering;
    delete parsed.exitDirection;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state: OnboardingRuntimeState) {
  try {
    localStorage.setItem(ONBOARDING_V2_STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(ONBOARDING_V2_VERSION_KEY, ONBOARDING_V2_CURRENT_VERSION);
  } catch {
    // Storage full or private mode — non-fatal
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════

const ANALYTICS_BATCH_KEY = 'heka-onboarding-v2-analytics';
const MAX_ANALYTICS_EVENTS = 100;

function pushAnalytics(event: OnboardingAnalyticsEvent) {
  try {
    const raw = localStorage.getItem(ANALYTICS_BATCH_KEY);
    const batch: OnboardingAnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    batch.push(event);
    // Bounded queue
    while (batch.length > MAX_ANALYTICS_EVENTS) batch.shift();
    localStorage.setItem(ANALYTICS_BATCH_KEY, JSON.stringify(batch));
  } catch {
    // Non-fatal
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingEngine');
  return ctx;
}

interface OnboardingEngineProps {
  children: React.ReactNode;
  onComplete: () => void;
}

export const OnboardingEngine: React.FC<OnboardingEngineProps> = ({ children, onComplete }) => {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const persisted = loadPersistedState();
    const base = getDefaultState();
    if (persisted) {
      return { ...base, ...persisted };
    }
    return base;
  });

  // Analytics batch is handled by pushAnalytics directly
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nodeEnterTime = useRef(Date.now());

  // Save on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Track node changes for analytics
  useEffect(() => {
    const now = Date.now();
    const duration = now - nodeEnterTime.current;
    const node = NODE_MAP.get(state.currentNodeId);
    if (node) {
      const event: OnboardingAnalyticsEvent = {
        event: node.analyticsEvent,
        nodeId: state.currentNodeId,
        timestamp: now,
        durationMs: duration,
        metadata: {
          intent: state.intent,
          completedCount: state.completedNodes.length,
        },
      };
      pushAnalytics(event);
    }
    nodeEnterTime.current = now;
  }, [state.currentNodeId]);

  const goToNode = useCallback((nodeId: OnboardingNodeId, direction: 'left' | 'right' | 'up' | 'down' = 'right') => {
    dispatch({ type: 'GO_TO_NODE', nodeId, direction });
    // Allow exit animation to complete before enter
    setTimeout(() => {
      dispatch({ type: 'EXIT_COMPLETE', nodeId });
    }, 400);
    setTimeout(() => {
      dispatch({ type: 'ENTER_COMPLETE' });
    }, 500);
  }, []);

  const goNext = useCallback(() => {
    const node = NODE_MAP.get(state.currentNodeId);
    if (!node) return;
    const nextId = node.next(state);
    if (nextId) {
      goToNode(nextId, 'right');
    } else if (state.currentNodeId === 'covenant') {
      dispatch({ type: 'COMPLETE' });
      // Suppress all legacy tutorial systems so they don't fire after v2
      tutorialService.markTutorialCompleted('celestial-awakening-v1');
      tutorialService.markTutorialCompleted('elite-onboarding');
      tutorialService.markTutorialCompleted('onboarding-main');
      const ts = tutorialService.getState();
      ts.preferences.skipOnboarding = true;
      onComplete();
    }
  }, [state, goToNode, onComplete]);

  const goBack = useCallback((): boolean => {
    const currentIndex = NODE_GRAPH.findIndex((n) => n.id === state.currentNodeId);
    if (currentIndex <= 0) return false;
    // Find the most recently completed node that precedes current
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (state.completedNodes.includes(NODE_GRAPH[i].id)) {
        goToNode(NODE_GRAPH[i].id, 'left');
        return true;
      }
    }
    return false;
  }, [state, goToNode]);

  const skip = useCallback(() => {
    dispatch({ type: 'SKIP' });
  }, []);

  const complete = useCallback(() => {
    dispatch({ type: 'COMPLETE' });
    // Suppress all legacy tutorial systems so they don't fire after v2
    tutorialService.markTutorialCompleted('celestial-awakening-v1');
    tutorialService.markTutorialCompleted('elite-onboarding');
    tutorialService.markTutorialCompleted('onboarding-main');
    const ts = tutorialService.getState();
    ts.preferences.skipOnboarding = true;
    onComplete();
  }, [onComplete]);

  const setIntent = useCallback((intent: UserIntent) => {
    dispatch({ type: 'SET_INTENT', intent });
  }, []);

  const setPersonalization = useCallback((data: Partial<PersonalizationData>) => {
    dispatch({ type: 'SET_PERSONALIZATION', data });
  }, []);

  const markInteraction = useCallback((flag: string) => {
    dispatch({ type: 'MARK_INTERACTION', flag });
  }, []);

  const getInterpolatedCopy = useCallback(
    (key: string) => {
      const copySet = getCopy(state.intent);
      const branch = copySet[key];
      if (!branch) return key;
      const intentKey = state.intent || 'default';
      const template = branch[intentKey] || branch.default;
      return interpolateCopy(template, {
        name: state.personalization.name || 'Timekeeper',
        birthDate: state.personalization.birthDate || '',
        birthDay: '', // Populated by node component
        hekaDate: '', // Populated by node component
        gregDate: '', // Populated by node component
        moonPhase: '', // Populated by node component
        moonSign: '', // Populated by node component
        sunSign: '', // Populated by node component
        planetaryHour: '', // Populated by node component
        location: state.personalization.birthLocation || '',
      });
    },
    [state.intent, state.personalization]
  );

  const getProgressPercent = useCallback(() => {
    const currentIndex = NODE_GRAPH.findIndex((n) => n.id === state.currentNodeId);
    const completedSeconds = NODE_GRAPH.slice(0, currentIndex).reduce((s, n) => s + n.estimatedSeconds, 0);
    return Math.min(100, Math.round((completedSeconds / TOTAL_ESTIMATED_SECONDS) * 100));
  }, [state.currentNodeId]);

  const getProgressSeconds = useCallback(() => {
    return Math.round((Date.now() - state.startTime) / 1000);
  }, [state.startTime]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    try {
      localStorage.removeItem(ONBOARDING_V2_STORAGE_KEY);
      localStorage.removeItem(ONBOARDING_V2_VERSION_KEY);
    } catch {
      // Non-fatal
    }
  }, []);

  const value: OnboardingContextValue = {
    state,
    goToNode,
    goNext,
    goBack,
    skip,
    complete,
    setIntent,
    setPersonalization,
    markInteraction,
    getInterpolatedCopy,
    getProgressPercent,
    getProgressSeconds,
    reset,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export { NODE_GRAPH, NODE_MAP, TOTAL_ESTIMATED_SECONDS };
