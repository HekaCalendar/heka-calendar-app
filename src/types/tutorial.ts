/**
 * Tutorial System Types - Enterprise Grade Interactive Onboarding
 * Hands-on guided tours with smart action detection
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TUTORIAL STEP TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TutorialStepType = 
  | 'welcome'           // Friendly welcome modal
  | 'spotlight'         // Passive highlight (info only)
  | 'interactive'       // MUST interact with element to proceed ⭐ NEW
  | 'guided-task'       // Multi-step task workflow ⭐ NEW
  | 'modal'             // Full-screen instructional modal
  | 'tooltip'           // Floating tooltip
  | 'celebration'       // Completion celebration
  | 'choice'            // User chooses their path ⭐ NEW
  | 'checkpoint';       // Confirm understanding before continuing ⭐ NEW

// ═══════════════════════════════════════════════════════════════════════════════
// TUTORIAL CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export type TutorialCategory = 
  | 'onboarding'        // First-time user flow
  | 'intermediate'      // After onboarding, deeper features
  | 'advanced'          // Power user features
  | 'calendar-basics'   // HEKA calendar fundamentals
  | 'astrology-intro'   // Astrology features
  | 'advanced-features' // Power user features
  | 'gamification'      // Achievement system
  | 'settings-deep-dive' // Comprehensive settings tour ⭐ NEW
  | 'journal'           // Journal and mood tracking
  | 'contextual';       // Triggered by context

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE STEP CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface InteractiveConfig {
  /** Type of interaction required */
  interactionType: 'click' | 'toggle' | 'select' | 'input' | 'scroll' | 'swipe' | 'hover';
  
  /** Success validation - how we know they did it */
  validation?: {
    /** Check for CSS class on target */
    targetHasClass?: string;
    /** Check for CSS class on any element */
    anyElementHasClass?: string;
    /** Check localStorage key exists/has value */
    localStorageKey?: string;
    /** Check localStorage key value */
    localStorageValue?: { key: string; value: string };
    /** Custom validation function (serialized) */
    customCheck?: string;
    /** Element appears in DOM */
    elementAppears?: string;
    /** Element disappears from DOM */
    elementDisappears?: string;
  };
  
  /** Progressive hints if user gets stuck */
  hints?: string[];
  
  /** Hint display delays (in ms) - when to show each hint */
  hintDelays?: number[];
  
  /** Allow skip after this many seconds (null = never) */
  allowSkipAfterSeconds?: number | null;
  
  /** Success message when they complete the action */
  successMessage: string;
  
  /** Visual indicator style */
  indicator?: 'pulse' | 'bounce' | 'glow' | 'arrow' | 'badge' | 'ripple';
  
  /** Custom badge text (e.g., "Tap me!", "Try it!" ) */
  badgeText?: string;
  
  /** Whether to block interaction with other elements */
  blockOtherInteractions?: boolean;
  
  /** Shake the target if they click elsewhere */
  shakeOnMiss?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GUIDED TASK CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface GuidedTaskConfig {
  /** Sub-steps for this task */
  subSteps: GuidedSubStep[];
  
  /** Task completion message */
  completionMessage: string;
  
  /** Achievement to unlock on completion */
  unlockAchievement?: string;
}

export interface GuidedSubStep {
  id: string;
  instruction: string;
  targetSelector: string;
  interactionType: 'click' | 'toggle' | 'select' | 'input' | 'scroll';
  validation?: {
    targetHasClass?: string;
    elementAppears?: string;
    elementDisappears?: string;
    localStorageKey?: string;
  };
  hint?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHOICE STEP CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface ChoiceOption {
  id: string;
  label: string;
  description: string;
  icon?: string;
  nextStepId: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED TUTORIAL STEP
// ═══════════════════════════════════════════════════════════════════════════════

export interface TutorialStep {
  id: string;
  type: TutorialStepType;
  title: string;
  content: string;
  
  // Visual styling
  targetSelector?: string;
  alternativeSelectors?: string[]; // Fallback selectors ⭐ NEW
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
  spotlightPadding?: number;
  highlightColor?: string;
  
  // Interactive configuration ⭐ NEW
  interactive?: InteractiveConfig;
  guidedTask?: GuidedTaskConfig;
  choices?: ChoiceOption[];
  
  // Legacy/standard fields
  actionRequired?: string;
  actionLabel?: string;
  canSkip?: boolean;
  delay?: number;
  
  // Checkpoint specific ⭐ NEW
  checkpointQuestion?: string;
  checkpointOptions?: { label: string; isCorrect: boolean; feedback: string }[];
  
  // Flow control
  nextStepId?: string; // Override automatic next step
  onComplete?: 'next' | 'wait' | 'auto-advance';
  
  // Tone/Persona
  tone?: 'friendly' | 'excited' | 'calm' | 'mysterious' | 'helpful';
  
  // Visual content ⭐ NEW
  visualComponent?: 
    | 'month-structure' 
    | 'calendar-diagram' 
    | 'arc-visualization' 
    | 'calendar-comparison' 
    | 'month-structure-animated' 
    | 'routine-visualization' 
    | 'cosmic-flow' 
    | 'calendar-comparison-v2' 
    | 'new-year-resolutions'
    | 'civil-vs-natural'
    | 'calendar-evolution-visual'
    | 'month-structure-v2'
    | 'month-structure-v3'
    | 'week-symmetry'
    | 'year-structure'
    | 'saturday-start'
    | 'hexa-month'
    | 'week-symmetry'
    | 'swiss-engine-intro'
    | 'swiss-engine-v2'
    | 'time-range'
    | 'moon-phases-v2'
    | 'toggle-features'
    | 'moon-planning'
    | 'birth-chart'
    | 'personal-transits'
    | 'stars-hub-v2'
    | 'oracle-journal-v3'
    | 'themes-v2'
    | 'time-modes-v2'
    | 'time-modes-demo'
    | 'sync-vs-true-epic'
    | 'print-v3';
}

// ═══════════════════════════════════════════════════════════════════════════════
// TUTORIAL DEFINITION
// ═══════════════════════════════════════════════════════════════════════════════

export interface Tutorial {
  id: string;
  category: TutorialCategory;
  name: string;
  description: string;
  steps: TutorialStep[];
  
  // Prerequisites and triggering
  requiredTutorials?: string[];
  triggerCondition?: 'manual' | 'first-visit' | 'feature-discovery' | 'time-based' | 'action-triggered';
  triggerAction?: string; // e.g., 'opened-settings', 'created-first-note'
  maxShows?: number;
  cooldown?: number; // Days before showing again
  
  // Personalization
  estimatedDurationMinutes?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  
  // Rewards
  completionAchievement?: string;
  completionXP?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER PROGRESS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TutorialProgress {
  tutorialId: string;
  completed: boolean;
  currentStepIndex: number;
  completedSteps: string[];
  startedAt: string;
  completedAt?: string;
  skipped: boolean;
  skippedAt?: string;
  showCount: number;
  
  // Enhanced tracking ⭐ NEW
  hintsShown?: Record<string, number>; // stepId -> hint count
  timeSpentSeconds?: number;
  interactions?: TutorialInteraction[];
}

export interface TutorialInteraction {
  stepId: string;
  type: 'click' | 'hint-requested' | 'skip-attempted' | 'validation-failed' | 'validation-passed';
  timestamp: string;
  metadata?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TUTORIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface TutorialState {
  isActive: boolean;
  currentTutorial: string | null;
  currentStepIndex: number;
  spotlightTarget: string | null;
  tooltipPosition: { x: number; y: number } | null;
  completedTutorials: string[];
  progress: TutorialProgress[];
  
  // Enhanced state ⭐ NEW
  currentHintIndex: number;
  isWaitingForAction: boolean;
  lastInteractionAt: string | null;
  
  preferences: {
    autoShowTutorials: boolean;
    showHints: boolean;
    reducedMotion: boolean;
    skipOnboarding: boolean;
    hintDelaySeconds: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXTUAL HELP
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContextualHelp {
  id: string;
  selector: string;
  title: string;
  content: string;
  trigger: 'hover' | 'click' | 'first-visit' | 'long-press';
  showOnce?: boolean;
  category: 'ui' | 'feature' | 'astrology' | 'calendar' | 'notes';
  
  // Enhanced ⭐ NEW
  proTip?: string; // Advanced tip for power users
  relatedFeatures?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TutorialAnalytics {
  tutorialId: string;
  stepId: string;
  event: 
    | 'started' 
    | 'step-completed' 
    | 'step-previous'
    | 'completed' 
    | 'skipped' 
    | 'action-triggered'
    | 'hint-shown'
    | 'hint-requested'
    | 'validation-failed'
    | 'validation-passed'
    | 'interaction-detected';
  timestamp: string;
  metadata?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TUTORIAL BUILDER HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TutorialPath {
  id: string;
  name: string;
  description: string;
  tutorials: string[];
  forUserType: 'beginner' | 'astrologer' | 'productivity' | 'explorer';
}
