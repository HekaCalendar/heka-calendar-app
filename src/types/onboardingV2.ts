/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE IMMACULATE ONBOARDING — Type Definitions
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Types only - no React import needed

// ─── User Intent ───
export type UserIntent = 'feel' | 'work' | 'stars';

export const INTENT_LABELS: Record<UserIntent, { title: string; subtitle: string; icon: string }> = {
  feel: {
    title: 'I want to feel time differently',
    subtitle: 'Live by the moon, the seasons, and the rhythm of nature',
    icon: 'moon',
  },
  work: {
    title: 'I want a calendar that actually works',
    subtitle: 'Regular months, consistent weeks, no more guessing',
    icon: 'sun',
  },
  stars: {
    title: 'I want to live by the stars',
    subtitle: 'Planetary hours, transits, and celestial timing',
    icon: 'stars',
  },
};

// ─── Personalization ───
export interface PersonalizationData {
  name?: string;
  birthDate?: string; // ISO YYYY-MM-DD
  birthTime?: string; // HH:MM
  birthLocation?: string;
  latitude?: number;
  longitude?: number;
}

// ─── Onboarding Graph Nodes ───
export type OnboardingNodeId =
  | 'splash'
  | 'intent-select'
  | 'personalization'
  | 'birthday-provocation'
  | 'the-breakdown'
  | 'grid-reveal'
  | 'day-panel-discovery'
  | 'first-note-ritual'
  | 'sync-true-demo'
  | 'oracle-preview'
  | 'stars-preview'
  | 'circle-preview'
  | 'tracker-preview'
  | 'community-preview'
  | 'heai-preview'
  | 'covenant'
  | 'complete';

export interface OnboardingNode {
  id: OnboardingNodeId;
  canSkip: boolean;
  analyticsEvent: string;
  // Returns next node ID or null if this is a terminal node
  next: (state: OnboardingRuntimeState) => OnboardingNodeId | null;
  // Estimated time in seconds for progress calculation
  estimatedSeconds: number;
}

// ─── Runtime State (what the engine tracks) ───
export interface OnboardingRuntimeState {
  currentNodeId: OnboardingNodeId;
  intent: UserIntent | null;
  personalization: PersonalizationData;
  completedNodes: OnboardingNodeId[];
  // Interaction flags
  gridInteracted: boolean;
  noteSaved: boolean;
  syncTrueToggled: boolean;
  birthChartSet: boolean;
  // Timing
  startTime: number;
  lastNodeChangeTime: number;
  // Animation state
  isExiting: boolean;
  isEntering: boolean;
  exitDirection: 'left' | 'right' | 'up' | 'down';
  // Progress
  totalEstimatedSeconds: number;
}

// ─── Context Value ───
export interface OnboardingContextValue {
  state: OnboardingRuntimeState;
  goToNode: (nodeId: OnboardingNodeId, direction?: 'left' | 'right' | 'up' | 'down') => void;
  goNext: () => void;
  goBack: () => boolean;
  skip: () => void;
  complete: () => void;
  setIntent: (intent: UserIntent) => void;
  setPersonalization: (data: Partial<PersonalizationData>) => void;
  markInteraction: (flag: keyof Omit<OnboardingRuntimeState, 'currentNodeId' | 'intent' | 'personalization' | 'completedNodes' | 'startTime' | 'lastNodeChangeTime' | 'isExiting' | 'isEntering' | 'exitDirection' | 'totalEstimatedSeconds'>) => void;
  getInterpolatedCopy: (key: string) => string;
  getProgressPercent: () => number;
  getProgressSeconds: () => number;
  reset: () => void;
}

// ─── Node Component Props ───
export interface OnboardingNodeProps {
  onComplete: () => void;
  onSkip: () => void;
}

// ─── Nurture Sequence ───
export interface NurtureStep {
  id: string;
  delayMinutes: number;
  condition: 'always' | 'no-note' | 'no-stars' | 'no-circle' | 'no-journal-3days';
  title: string;
  body: string;
  actionLabel: string;
  actionType: 'open-coach' | 'open-stars' | 'open-journal' | 'open-day-panel' | 'none';
}

// ─── Analytics Event ───
export interface OnboardingAnalyticsEvent {
  event: string;
  nodeId: OnboardingNodeId;
  timestamp: number;
  durationMs: number;
  metadata?: Record<string, unknown>;
}

// ─── Storage Keys ───
export const ONBOARDING_V2_STORAGE_KEY = 'heka-onboarding-v2-state';
export const ONBOARDING_V2_VERSION_KEY = 'heka-onboarding-v2-version';
export const ONBOARDING_V2_CURRENT_VERSION = '2.3.0-immaculate';
export const ONBOARDING_V2_LEGACY_KEY = 'heka-tutorial-state-v2';
