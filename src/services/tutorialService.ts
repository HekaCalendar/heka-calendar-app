/**
 * Tutorial Service - Enterprise Grade Interactive Onboarding Engine
 * Hands-on guided tours with smart action detection
 */

import type { 
  Tutorial, 
  TutorialStep, 
  TutorialProgress, 
  TutorialState,
  ContextualHelp,
  TutorialAnalytics,
  InteractiveConfig,
  GuidedTaskConfig,
} from '../types/tutorial';
import { allTutorials, contextualHelpEntries, getTutorialById } from '../data/tutorialContent';

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'heka-tutorial-state-v2';
const ANALYTICS_KEY = 'heka-tutorial-analytics-v2';
const TUTORIAL_VERSION_KEY = 'heka-tutorial-data-version';
const CURRENT_TUTORIAL_VERSION = '2.2.1-celestial'; // Bump this to force reset tutorials

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT STATE
// ═══════════════════════════════════════════════════════════════════════════════

const getDefaultState = (): TutorialState => ({
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
    hintDelaySeconds: 8, // Show first hint after 8 seconds of inactivity
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TUTORIAL SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

class TutorialService {
  private state: TutorialState;
  private listeners: Set<(state: TutorialState) => void>;
  private analyticsQueue: TutorialAnalytics[];
  private reduxDispatch: ((action: { type: string; payload?: any }) => void) | null;
  
  // Interactive step tracking
  private validationInterval: number | null = null;
  private hintTimeout: number | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private mutationObserver: MutationObserver | null = null;
  private elementInitiallyExists: boolean = false;  // Track if element exists at step start
  private initialElementRef: Element | null = null;  // Reference to the initial element
  private elementFingerprint: string | null = null;  // Fingerprint of element content
  private userHasClicked: boolean = false;  // Track if user clicked during this step

  constructor() {
    this.state = this.loadState();
    this.listeners = new Set();
    this.analyticsQueue = [];
    this.reduxDispatch = null;
    
    // Bind methods for event handlers
    this.handleGlobalClick = this.handleGlobalClick.bind(this);
    this.validateInteractiveStep = this.validateInteractiveStep.bind(this);
  }

  // Connect to Redux dispatch for state sync
  connectToDispatch(dispatch: (action: { type: string; payload?: any }) => void): void {
    this.reduxDispatch = dispatch;
  }

  // Load state from localStorage
  private loadState(): TutorialState {
    try {
      // Check if we need to reset tutorials due to version change
      const savedVersion = localStorage.getItem(TUTORIAL_VERSION_KEY);
      if (savedVersion !== CURRENT_TUTORIAL_VERSION) {
        localStorage.setItem(TUTORIAL_VERSION_KEY, CURRENT_TUTORIAL_VERSION);
        // Clear old tutorial state to force fresh onboarding
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ANALYTICS_KEY);
        return getDefaultState();
      }
      
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...getDefaultState(), ...parsed };
      }
    } catch (e) {
      console.error('[Tutorial] Failed to load state:', e);
    }
    return getDefaultState();
  }

  // Save state to localStorage
  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('[Tutorial] Failed to save state:', e);
    }
  }

  // Notify listeners of state change
  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
    this.saveState();
    
    // Sync to Redux if connected
    if (this.reduxDispatch) {
      const stateClone = JSON.parse(JSON.stringify(this.state));
      this.reduxDispatch({
        type: 'tutorial/loadTutorialState',
        payload: stateClone
      });
    }
  }

  // Subscribe to state changes
  subscribe(listener: (state: TutorialState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  // Get current state
  getState(): TutorialState {
    return { ...this.state };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // TUTORIAL LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Start a tutorial
   */
  startTutorial(tutorialId: string): boolean {
    const tutorial = getTutorialById(tutorialId);
    if (!tutorial) {
      console.error(`[Tutorial] Tutorial not found: ${tutorialId}`);
      return false;
    }

    // Check if already completed
    const progress = this.getTutorialProgress(tutorialId);
    if (progress?.completed && tutorial.maxShows && progress.showCount >= tutorial.maxShows) {
      return false;
    }

    // Check prerequisites
    if (tutorial.requiredTutorials) {
      for (const reqId of tutorial.requiredTutorials) {
        const reqProgress = this.getTutorialProgress(reqId);
        if (!reqProgress?.completed) {
          return false;
        }
      }
    }

    // Reset any existing tutorial state
    this.cleanupInteractiveStep();
    
    // Clear tutorial-specific localStorage keys to prevent auto-completion from previous runs
    this.clearTutorialLocalStorageKeys();

    this.state.isActive = true;
    this.state.currentTutorial = tutorialId;
    this.state.currentStepIndex = 0;
    this.state.currentHintIndex = 0;
    this.state.isWaitingForAction = false;

    // Create or update progress
    if (!progress) {
      this.state.progress.push({
        tutorialId,
        completed: false,
        currentStepIndex: 0,
        completedSteps: [],
        startedAt: new Date().toISOString(),
        skipped: false,
        showCount: 1,
        hintsShown: {},
        timeSpentSeconds: 0,
        interactions: [],
      });
    } else {
      progress.showCount++;
      progress.currentStepIndex = 0;
      progress.startedAt = new Date().toISOString();
    }

    this.trackAnalytics({
      tutorialId,
      stepId: tutorial.steps[0].id,
      event: 'started',
      timestamp: new Date().toISOString(),
    });

    this.updateSpotlightTarget();
    this.setupCurrentStep();
    this.notify();
    return true;
  }

  /**
   * Move to previous step
   */
  previousStep(): boolean {
    if (!this.state.isActive || !this.state.currentTutorial) {
      return false;
    }

    // Can't go back if on first step
    if (this.state.currentStepIndex <= 0) {
      return false;
    }

    const tutorial = getTutorialById(this.state.currentTutorial);
    if (!tutorial) return false;

    // Cleanup current step
    this.cleanupInteractiveStep();

    // Go back one step
    this.state.currentStepIndex--;
    this.state.currentHintIndex = 0;
    
    const progress = this.getTutorialProgress(this.state.currentTutorial);
    if (progress) {
      progress.currentStepIndex = this.state.currentStepIndex;
    }

    this.trackAnalytics({
      tutorialId: this.state.currentTutorial,
      stepId: tutorial.steps[this.state.currentStepIndex].id,
      event: 'step-previous',
      timestamp: new Date().toISOString(),
    });
    
    this.updateSpotlightTarget();
    this.setupCurrentStep();
    this.notify();
    return true;
  }

  /**
   * Move to next step
   */
  nextStep(): boolean {
    if (!this.state.isActive || !this.state.currentTutorial) {
      return false;
    }

    const tutorial = getTutorialById(this.state.currentTutorial);
    if (!tutorial) return false;

    const currentStep = tutorial.steps[this.state.currentStepIndex];
    
    // Mark current step as completed
    const progress = this.getTutorialProgress(this.state.currentTutorial);
    if (progress && currentStep) {
      if (!progress.completedSteps.includes(currentStep.id)) {
        progress.completedSteps.push(currentStep.id);
      }
    }

    this.trackAnalytics({
      tutorialId: this.state.currentTutorial,
      stepId: currentStep.id,
      event: 'step-completed',
      timestamp: new Date().toISOString(),
    });

    // Cleanup current step
    this.cleanupInteractiveStep();

    // Check if there's a next step
    if (this.state.currentStepIndex < tutorial.steps.length - 1) {
      this.state.currentStepIndex++;
      this.state.currentHintIndex = 0;
      
      if (progress) {
        progress.currentStepIndex = this.state.currentStepIndex;
      }
      
      this.updateSpotlightTarget();
      this.setupCurrentStep();
      this.notify();
      return true;
    } else {
      // Tutorial complete
      this.completeTutorial();
      return false;
    }
  }

  /**
   * Go to specific step (for branching tutorials)
   */
  goToStep(stepId: string): boolean {
    if (!this.state.isActive || !this.state.currentTutorial) {
      return false;
    }

    const tutorial = getTutorialById(this.state.currentTutorial);
    if (!tutorial) return false;

    const stepIndex = tutorial.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return false;

    this.cleanupInteractiveStep();
    this.state.currentStepIndex = stepIndex;
    this.state.currentHintIndex = 0;
    
    this.updateSpotlightTarget();
    this.setupCurrentStep();
    this.notify();
    return true;
  }

  /**
   * Complete current tutorial
   */
  completeTutorial(): void {
    if (!this.state.currentTutorial) return;

    this.cleanupInteractiveStep();

    const tutorial = getTutorialById(this.state.currentTutorial);
    const progress = this.getTutorialProgress(this.state.currentTutorial);
    
    if (progress && tutorial) {
      progress.completed = true;
      progress.completedAt = new Date().toISOString();
    }

    if (!this.state.completedTutorials.includes(this.state.currentTutorial)) {
      this.state.completedTutorials.push(this.state.currentTutorial);
    }

    this.trackAnalytics({
      tutorialId: this.state.currentTutorial,
      stepId: 'completion',
      event: 'completed',
      timestamp: new Date().toISOString(),
    });

    this.resetTutorialState();
    this.notify();
  }

  /**
   * Skip current tutorial
   */
  skipTutorial(): void {
    if (!this.state.currentTutorial) return;

    this.cleanupInteractiveStep();

    const progress = this.getTutorialProgress(this.state.currentTutorial);
    
    if (progress) {
      progress.skipped = true;
      progress.skippedAt = new Date().toISOString();
    }

    this.trackAnalytics({
      tutorialId: this.state.currentTutorial,
      stepId: this.getCurrentStep()?.id || 'unknown',
      event: 'skipped',
      timestamp: new Date().toISOString(),
    });

    this.resetTutorialState();
    this.notify();
  }

  /**
   * Reset tutorial state
   */
  private resetTutorialState(): void {
    this.cleanupInteractiveStep();
    this.state.isActive = false;
    this.state.currentTutorial = null;
    this.state.currentStepIndex = 0;
    this.state.spotlightTarget = null;
    this.state.tooltipPosition = null;
    this.state.currentHintIndex = 0;
    this.state.isWaitingForAction = false;
    this.state.lastInteractionAt = null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INTERACTIVE STEP MANAGEMENT ⭐ NEW
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Setup current step based on its type
   */
  private setupCurrentStep(): void {
    const step = this.getCurrentStep();
    if (!step) return;

    // Handle interactive steps
    if (step.type === 'interactive' && step.interactive) {
      this.setupInteractiveStep(step.interactive);
    }
    
    // Handle guided tasks
    if (step.type === 'guided-task' && step.guidedTask) {
      this.setupGuidedTask(step.guidedTask);
    }
  }

  /**
   * Setup an interactive step with action detection
   */
  private setupInteractiveStep(config: InteractiveConfig): void {
    // Check if target element already exists (for elementAppears validation)
    this.elementInitiallyExists = false;
    this.initialElementRef = null;
    this.elementFingerprint = null;
    this.userHasClicked = false;
    if (config.validation?.elementAppears) {
      const initialElement = document.querySelector(config.validation.elementAppears);
      this.elementInitiallyExists = !!initialElement;
      this.initialElementRef = initialElement;
      if (initialElement) {
        this.elementFingerprint = initialElement.innerHTML;
      }
      // Element check done silently
      if (this.elementInitiallyExists) {
      }
    }
    
    this.state.isWaitingForAction = true;
    this.state.lastInteractionAt = new Date().toISOString();
    this.state.currentHintIndex = 0;
    this.notify();

    // Run validation immediately after a short delay (let DOM settle)
    setTimeout(() => {
      this.validateInteractiveStep();
    }, 300);

    // Start validation polling
    this.startValidationPolling(config);

    // Setup hint system
    if (config.hints && config.hints.length > 0) {
      this.scheduleNextHint(config);
    }

    // Setup click detection for shake effect and user interaction tracking
    if (config.shakeOnMiss !== false || config.validation?.elementAppears) {
      this.clickHandler = (e: MouseEvent) => {
        // Track that user clicked (for elementAppears with existing element)
        if (config.validation?.elementAppears && this.elementInitiallyExists && !this.userHasClicked) {
          const target = e.target as Element;
          const step = this.getCurrentStep();
          if (step?.targetSelector) {
            // Check if click was on/near the target
            const targetEl = document.querySelector(step.targetSelector);
            if (targetEl && (targetEl === target || targetEl.contains(target))) {
              this.userHasClicked = true;
            }
          }
        }
        // Call original shake handler
        this.handleGlobalClick(e);
      };
      document.addEventListener('click', this.clickHandler, true);
    }

    // Setup mutation observer for DOM changes
    if (config.validation?.elementAppears || config.validation?.elementDisappears) {
      this.mutationObserver = new MutationObserver((mutations) => {
        if (!this.state.isWaitingForAction) {
          return;
        }
        
        // Log all mutations for debugging
        const relevantMutations = mutations.filter(m => {
          if (m.type === 'childList') return true;
          if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style')) return true;
          return false;
        });
        
        if (relevantMutations.length > 0) {
          // Reduced logging
          if (Math.random() < 0.3) {
          }
          
          // Check if element that was initially there has now changed
          // This handles React reusing the same DOM element but changing content
          const targetSelector = config.validation?.elementAppears;
          if (targetSelector && this.elementInitiallyExists) {
            const currentElement = document.querySelector(targetSelector);
            if (!currentElement) {
              this.elementInitiallyExists = false;
              this.initialElementRef = null;
              this.elementFingerprint = null;
            } else if (this.userHasClicked && currentElement !== this.initialElementRef) {
              // User clicked and element was replaced
              this.elementInitiallyExists = false;
              this.initialElementRef = null;
              this.elementFingerprint = null;
            } else if (this.userHasClicked && this.elementFingerprint) {
              // User clicked - check if content changed
              const currentFingerprint = currentElement.innerHTML;
              if (currentFingerprint !== this.elementFingerprint) {
                this.elementInitiallyExists = false;
                this.initialElementRef = null;
                this.elementFingerprint = null;
              }
            }
          }
          
          // Small delay to let DOM settle
          setTimeout(() => {
            if (this.state.isWaitingForAction) {
              const isValid = this.validateInteractiveStep();
              if (isValid) {
              }
            }
          }, 150);
        }
      });
      
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden', 'aria-hidden'],
      });
      
    }
  }

  /**
   * Setup a guided task with multiple sub-steps
   */
  private setupGuidedTask(_config: GuidedTaskConfig): void {
    // Guided tasks are handled by the component
    // This just initializes the tracking
    this.state.isWaitingForAction = true;
    this.notify();
  }

  /**
   * Start validation polling for interactive steps
   */
  private startValidationPolling(config: InteractiveConfig): void {
    if (!config.validation) return;

    
    // More frequent polling for better responsiveness
    this.validationInterval = window.setInterval(() => {
      if (!this.state.isWaitingForAction) {
        // Stop polling if we're no longer waiting
        if (this.validationInterval) {
          clearInterval(this.validationInterval);
          this.validationInterval = null;
        }
        return;
      }
      
      const isValid = this.validateInteractiveStep();
      if (isValid) {
      }
    }, 250); // Check every 250ms
  }

  /**
   * Validate if the interactive action was completed
   */
  private validateInteractiveStep(): boolean {
    if (!this.state.isWaitingForAction) return false;
    
    const step = this.getCurrentStep();
    if (!step?.interactive?.validation) return false;

    const validation = step.interactive.validation;
    let isValid = false;


    // Check target has class
    if (!isValid && validation.targetHasClass && step.targetSelector) {
      const target = this.findElement(step.targetSelector);
      if (target?.classList.contains(validation.targetHasClass)) {
        isValid = true;
        // Validation passed: target has class
      }
    }

    // Check any element has class
    if (!isValid && validation.anyElementHasClass) {
      const elements = document.querySelectorAll(`.${validation.anyElementHasClass}`);
      if (elements.length > 0) {
        isValid = true;
        // Validation passed: element has class
      }
    }

    // Check localStorage
    if (!isValid && validation.localStorageKey) {
      const value = localStorage.getItem(validation.localStorageKey);
      if (value !== null && value !== 'false') {
        isValid = true;
        // Validation passed: localStorage key exists
      }
    }

    // Check localStorage value
    if (!isValid && validation.localStorageValue) {
      const value = localStorage.getItem(validation.localStorageValue.key);
      if (value === validation.localStorageValue.value) {
        isValid = true;
        // Validation passed: localStorage value matches
      }
    }

    // Check element appears (must be NEW appearance - not exist at step start)
    if (!isValid && validation.elementAppears) {
      const element = document.querySelector(validation.elementAppears);
      // Only validate if element exists AND wasn't there at step start
      if (element && !this.elementInitiallyExists) {
        isValid = true;
        // Validation passed: element appeared
      } else if (element && this.elementInitiallyExists) {
        // Element exists but was already there - don't validate yet
        // Reduced logging to avoid spam
        if (Math.random() < 0.05) {
        }
      }
    }

    // Check element disappears
    if (!isValid && validation.elementDisappears) {
      const element = document.querySelector(validation.elementDisappears);
      
      // Comprehensive visibility check
      let isVisible = false;
      if (element) {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        // Check multiple visibility indicators
        const displayNone = style.display === 'none';
        const visibilityHidden = style.visibility === 'hidden';
        const opacityZero = style.opacity === '0';
        const ariaHidden = element.getAttribute('aria-hidden') === 'true';
        const hasHiddenClass = element.classList.contains('hidden') || 
                               element.classList.contains('closed') ||
                               element.classList.contains('invisible');
        
        // Element is visible if:
        // - It has a non-zero size (width/height)
        // - It's not display:none, visibility:hidden, or opacity:0
        // - It's not marked as hidden via aria-hidden or CSS classes
        isVisible = rect.width > 0 && 
                    rect.height > 0 && 
                    !displayNone && 
                    !visibilityHidden && 
                    !opacityZero &&
                    !ariaHidden &&
                    !hasHiddenClass;
      }
      
      // Debug logging
      if (Math.random() < 0.1) { // Log ~10% of checks to avoid spam
        console.log('[Tutorial] Checking elementDisappears:', validation.elementDisappears, 
          'found:', !!element, 'visible:', isVisible);
      }
      
      if (!element || !isVisible) {
        isValid = true;
        // Validation passed: element disappeared
      }
    }

    if (isValid && this.state.isWaitingForAction) {
      this.handleActionSuccess();
    }

    return isValid;
  }

  /**
   * Handle successful action completion
   */
  private handleActionSuccess(): void {
    const step = this.getCurrentStep();
    if (!step) return;

    this.cleanupInteractiveStep();

    this.trackAnalytics({
      tutorialId: this.state.currentTutorial!,
      stepId: step.id,
      event: 'validation-passed',
      timestamp: new Date().toISOString(),
    });

    // Show success message briefly then advance
    this.notify();
    
    setTimeout(() => {
      this.nextStep();
    }, 1500);
  }

  /**
   * Handle global clicks for shake effect
   */
  private handleGlobalClick(e: MouseEvent): void {
    const step = this.getCurrentStep();
    if (!step?.targetSelector || !this.state.isWaitingForAction) return;

    const target = this.findElement(step.targetSelector);
    if (!target) return;

    // Check if click was on target
    const clickedTarget = e.target as Element;
    const isTargetClick = target === clickedTarget || target.contains(clickedTarget);

    if (!isTargetClick) {
      // Clicked elsewhere - shake the target to draw attention
      this.shakeElement(target);
      
      this.trackAnalytics({
        tutorialId: this.state.currentTutorial!,
        stepId: step.id,
        event: 'validation-failed',
        timestamp: new Date().toISOString(),
        metadata: { reason: 'clicked-elsewhere' },
      });
    }
  }

  /**
   * Shake element to draw attention
   */
  private shakeElement(element: Element): void {
    element.classList.add('tutorial-shake');
    setTimeout(() => {
      element.classList.remove('tutorial-shake');
    }, 500);
  }

  /**
   * Public method to trigger shake on current target
   * Called when user clicks outside the target area during interactive steps
   */
  triggerShake(): void {
    const step = this.getCurrentStep();
    if (!step?.targetSelector) return;

    // Try to find the target element
    let target: Element | null = null;
    try {
      target = document.querySelector(step.targetSelector);
    } catch (e) {
      // Try alternative selectors
      if (step.alternativeSelectors) {
        for (const alt of step.alternativeSelectors) {
          try {
            target = document.querySelector(alt);
            if (target) break;
          } catch (e) {
            continue;
          }
        }
      }
    }

    // If found, shake it
    if (target) {
      this.shakeElement(target);
    }
  }

  /**
   * Schedule next hint display
   */
  private scheduleNextHint(config: InteractiveConfig): void {
    if (!config.hints || this.state.currentHintIndex >= config.hints.length) return;

    const delay = config.hintDelays?.[this.state.currentHintIndex] 
      ?? (this.state.preferences.hintDelaySeconds * 1000);

    this.hintTimeout = window.setTimeout(() => {
      this.showNextHint(config);
    }, delay);
  }

  /**
   * Show next hint
   */
  private showNextHint(config: InteractiveConfig): void {
    if (!config.hints || this.state.currentHintIndex >= config.hints.length) return;

    this.state.currentHintIndex++;
    this.notify();

    this.trackAnalytics({
      tutorialId: this.state.currentTutorial!,
      stepId: this.getCurrentStep()?.id || 'unknown',
      event: 'hint-shown',
      timestamp: new Date().toISOString(),
      metadata: { hintIndex: this.state.currentHintIndex },
    });

    // Schedule next hint if available
    if (this.state.currentHintIndex < config.hints.length) {
      this.scheduleNextHint(config);
    }
  }

  /**
   * Request a hint (called by user action)
   */
  requestHint(): void {
    const step = this.getCurrentStep();
    if (!step?.interactive?.hints) return;

    // Clear existing timeout
    if (this.hintTimeout) {
      clearTimeout(this.hintTimeout);
    }

    this.showNextHint(step.interactive);

    this.trackAnalytics({
      tutorialId: this.state.currentTutorial!,
      stepId: step.id,
      event: 'hint-requested',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get current hint text
   */
  getCurrentHint(): string | null {
    const step = this.getCurrentStep();
    if (!step?.interactive?.hints) return null;
    
    const index = this.state.currentHintIndex - 1;
    if (index < 0 || index >= step.interactive.hints.length) return null;
    
    return step.interactive.hints[index];
  }

  /**
   * Cleanup interactive step resources
   */
  private cleanupInteractiveStep(): void {
    this.state.isWaitingForAction = false;
    this.elementInitiallyExists = false;  // Reset for next step
    this.initialElementRef = null;  // Reset element reference
    this.elementFingerprint = null;  // Reset fingerprint
    this.userHasClicked = false;  // Reset click tracking

    if (this.validationInterval) {
      clearInterval(this.validationInterval);
      this.validationInterval = null;
    }

    if (this.hintTimeout) {
      clearTimeout(this.hintTimeout);
      this.hintTimeout = null;
    }

    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler, true);
      this.clickHandler = null;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    // Clean up target element classes
    document.querySelectorAll('.tutorial-target-active').forEach(el => {
      el.classList.remove('tutorial-target-active');
    });
    document.querySelectorAll('.tutorial-target-parent').forEach(el => {
      el.classList.remove('tutorial-target-parent');
    });
  }

  /**
   * Clear tutorial-specific localStorage keys to prevent auto-completion from previous runs
   */
  private clearTutorialLocalStorageKeys(): void {
    const keysToClear = [
      // Navigation
      'tutorial-month-nav-prev',
      'tutorial-month-nav-next',
      'tutorial-month-navigated',
      'tutorial-today-clicked',
      
      // Customization
      'tutorial-theme-selected',
      'tutorial-display-showMoonPhases',
      'tutorial-display-showCivilDates',
      'tutorial-celestial-guide-toggled',
      
      // NEW: Notes & Categories
      'tutorial-category-selected',
      'tutorial-note-saved',
      
      // NEW: Calendar features
      'tutorial-calendar-expanded',
      'tutorial-year-view-opened',
      
      // NEW: Journal & Mood
      'tutorial-mood-selected',
      'tutorial-journal-entry-created',
      
      // ELITE TUTORIAL KEYS (legacy)
      'elite-tutorial-slide-02-complete',
      'elite-tutorial-nav-prev',
      'elite-tutorial-nav-next',
      'elite-tutorial-expand-v',
      'elite-tutorial-expand-h',
      'elite-tutorial-today',
      'elite-tutorial-explored-panel',
      'elite-tutorial-category-selected',
      'elite-tutorial-note-typed',
      'elite-tutorial-note-saved',
      'elite-tutorial-moon-enabled',
      'elite-tutorial-themes-opened',
      'elite-tutorial-theme-selected',
      'elite-tutorial-mood-selected',
      
      // ELITE TUTORIAL KEYS (restructured flow)
      'elite-step-04-note-opened',
      'elite-step-04-note-created',
      'elite-step-04-typed',
      'elite-step-04-saved',
      'elite-step-06-nav',
      'elite-step-07-today',
      'elite-step-08-expand-v',
      'elite-step-08-expand-h',
      'elite-step-09-settings',
      'elite-step-09-moon',
      'elite-step-10-year',
      'elite-step-12-journal',
      'elite-step-14-stars',
    ];
    
    keysToClear.forEach(key => {
      localStorage.removeItem(key);
    });
    
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ELEMENT FINDING (handles jQuery-style selectors)
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Find element with fallback strategies
   */
  private findElement(selector: string): Element | null {
    // Try exact selector first
    try {
      const el = document.querySelector(selector);
      if (el) return el;
    } catch (e) {
      // Invalid selector, continue to fallbacks
    }

    // Handle :contains() pseudo-selectors
    if (selector.includes(':contains')) {
      const parts = selector.split(',').map(s => s.trim());
      
      for (const part of parts) {
        const match = part.match(/(.+?)?:contains\(["'](.+)["']\)/);
        if (match) {
          const tagName = match[1] || '*';
          const text = match[2];
          const elements = document.querySelectorAll(tagName);
          
          for (const el of elements) {
            if (el.textContent?.includes(text)) {
              return el;
            }
          }
        }
      }
    }

    // Try partial class match
    if (selector.startsWith('.')) {
      const className = selector.slice(1);
      const elements = document.querySelectorAll(`[class*="${className}"]`);
      if (elements.length > 0) return elements[0];
    }

    // Try attribute selectors from comma-separated list
    if (selector.includes(',')) {
      const parts = selector.split(',').map(s => s.trim());
      for (const part of parts) {
        if (part.startsWith('[')) {
          try {
            const elements = document.querySelectorAll(part);
            if (elements.length > 0) return elements[0];
          } catch (e) {
            // Continue
          }
        }
      }
    }

    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════════════════════════

  getCurrentTutorial(): Tutorial | null {
    if (!this.state.currentTutorial) return null;
    return getTutorialById(this.state.currentTutorial) || null;
  }

  getCurrentStep(): TutorialStep | null {
    const tutorial = this.getCurrentTutorial();
    if (!tutorial) return null;
    return tutorial.steps[this.state.currentStepIndex] || null;
  }

  getTutorialProgress(tutorialId: string): TutorialProgress | undefined {
    return this.state.progress.find(p => p.tutorialId === tutorialId);
  }

  isTutorialCompleted(tutorialId: string): boolean {
    return this.state.completedTutorials.includes(tutorialId);
  }

  hasUserSeenTutorial(tutorialId: string): boolean {
    const progress = this.getTutorialProgress(tutorialId);
    return !!progress && progress.showCount > 0;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SPOTLIGHT & POSITIONING
  // ═══════════════════════════════════════════════════════════════════════════════

  private updateSpotlightTarget(): void {
    const step = this.getCurrentStep();
    
    if (step?.targetSelector) {
      this.state.spotlightTarget = step.targetSelector;
    } else {
      this.state.spotlightTarget = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // AUTO-TRIGGER LOGIC
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Check and auto-start tutorials based on conditions
   */
  checkAutoTriggers(): void {
    
    if (!this.state.preferences.autoShowTutorials) {
      return;
    }
    if (this.state.isActive) {
      return;
    }
    if (this.state.preferences.skipOnboarding) {
      return;
    }

    
    for (const tutorial of allTutorials) {
      if (tutorial.triggerCondition === 'first-visit' && !this.hasUserSeenTutorial(tutorial.id)) {
        this.startTutorial(tutorial.id);
        return;
      }
    }
    
  }

  /**
   * Trigger tutorial by action
   */
  triggerTutorial(action: string): void {
    for (const tutorial of allTutorials) {
      if (tutorial.triggerCondition === 'action-triggered' && tutorial.triggerAction === action) {
        if (!this.isTutorialCompleted(tutorial.id)) {
          this.startTutorial(tutorial.id);
          return;
        }
      }
    }
  }

  /**
   * Track month navigation for tutorial validation
   * Requires both prev and next to be clicked
   */
  trackMonthNavigation(direction: 'prev' | 'next'): void {
    // Track which directions have been clicked
    const prevClicked = localStorage.getItem('tutorial-month-nav-prev') === 'true';
    const nextClicked = localStorage.getItem('tutorial-month-nav-next') === 'true';
    
    if (direction === 'prev') {
      localStorage.setItem('tutorial-month-nav-prev', 'true');
    } else {
      localStorage.setItem('tutorial-month-nav-next', 'true');
    }
    
    // Check if both directions have been clicked
    const bothClicked = (direction === 'prev' ? true : prevClicked) && 
                        (direction === 'next' ? true : nextClicked);
    
    if (bothClicked) {
      localStorage.setItem('tutorial-month-navigated', 'true');
    }
    
    // Trigger validation check if we're on a month-navigation step
    const currentStep = this.getCurrentStep();
    const isNavStep = currentStep?.id === 'month-navigation-prev' || 
                      currentStep?.id === 'month-navigation-next' ||
                      currentStep?.id === 'month-navigation' ||
                      currentStep?.id === 'step-06-navigation'; // Elite tutorial (updated)
    
    if (isNavStep && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
    
    // Also set the elite tutorial key if on elite step
    if (currentStep?.id === 'step-06-navigation') {
      localStorage.setItem('elite-step-06-nav', 'true');
    }
  }

  /**
   * Get which navigation arrows have been clicked (for UI highlighting)
   */
  getMonthNavigationState(): { prevClicked: boolean; nextClicked: boolean } {
    return {
      prevClicked: localStorage.getItem('tutorial-month-nav-prev') === 'true',
      nextClicked: localStorage.getItem('tutorial-month-nav-next') === 'true',
    };
  }

  /**
   * Track Today button click for tutorial validation
   */
  trackTodayButton(): void {
    localStorage.setItem('tutorial-today-clicked', 'true');
    
    // Trigger validation check if we're on the today-button step
    const currentStep = this.getCurrentStep();
    if ((currentStep?.id === 'today-button-interactive' || currentStep?.id === 'step-07-today') && 
        this.state.isWaitingForAction) {
      localStorage.setItem('elite-step-07-today', 'true');
      this.validateInteractiveStep();
    }
  }

  /**
   * Track calendar expand button click for tutorial validation
   */
  trackCalendarExpand(direction: 'vertical' | 'horizontal'): void {
    localStorage.setItem(`elite-step-08-expand-${direction}`, 'true');
    
    // Trigger validation check if we're on the expand step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === 'step-08-expand' && this.state.isWaitingForAction) {
      localStorage.setItem(`elite-step-08-expand-${direction}`, 'true');
      this.validateInteractiveStep();
    }
  }

  /**
   * Track note editor opened for tutorial validation (Step 4 - part 1)
   */
  trackNoteEditorOpened(): void {
    localStorage.setItem('elite-step-04-note-opened', 'true');
    
    // Trigger validation check if we're on the note creation step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === 'step-04-note-creation' && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
  }

  /**
   * Track note typing for tutorial validation (Step 4 - intermediate)
   */
  trackNoteTyping(): void {
    // Only track once
    if (localStorage.getItem('elite-step-04-typed') === 'true') return;
    
    localStorage.setItem('elite-step-04-typed', 'true');
    
    // Trigger validation check if we're on the note creation step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === 'step-04-add-note' && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
  }

  /**
   * Track note created for tutorial validation (Step 4 - part 2)
   */
  trackNoteCreated(): void {
    localStorage.setItem('elite-step-04-note-created', 'true');
    localStorage.setItem('tutorial-note-saved', 'true');
    
    // Trigger validation check if we're on the note creation step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === 'step-04-add-note' && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
  }

  /**
   * Track Year view button click for tutorial validation
   */
  trackYearView(): void {
    
    // Trigger validation check if we're on the year view step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === 'step-10-year' && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
  }

  /**
   * Track Journal button click for tutorial validation
   */
  trackJournal(): void {
    
    // Trigger validation check if we're on the journal step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === 'step-12-journal' && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
  }

  /**
   * Track Stars Hub button click for tutorial validation
   */
  trackStarsHub(): void {
    
    // Trigger validation check if we're on the stars step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === 'step-14-stars' && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
  }

  /**
   * Track theme selection for tutorial validation
   */
  trackThemeSelection(themeId: string): void {
    localStorage.setItem('tutorial-theme-selected', 'true');
    localStorage.setItem('heka-theme', themeId);
    
    // Trigger validation check if we're on the theme selection step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === 'settings-theme-task' && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
  }

  /**
   * Track display toggle for tutorial validation
   */
  trackDisplayToggle(setting: string, enabled: boolean): void {
    localStorage.setItem(`tutorial-display-${setting}`, enabled ? 'true' : 'false');
    
    // ELITE TUTORIAL: Track moon phases toggle for step 9
    if (setting === 'showMoonPhases' && enabled) {
      localStorage.setItem('elite-step-09-moon', 'true');
      
      // Trigger validation for step 9 (guided task - toggle-moon substep)
      const currentStep = this.getCurrentStep();
      if (currentStep?.id === 'step-09-settings' && this.state.isWaitingForAction) {
        this.validateInteractiveStep();
      }
    }
    
    // Trigger validation check if we're on the relevant tutorial step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === `settings-${setting}` && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
  }

  /**
   * Track celestial guide toggle for tutorial validation
   */
  trackCelestialGuideToggle(enabled: boolean): void {
    localStorage.setItem('tutorial-celestial-guide-toggled', enabled ? 'true' : 'false');
    
    // Trigger validation check if we're on the celestial guide settings step
    const currentStep = this.getCurrentStep();
    if (currentStep?.id === 'settings-celestial-guide' && this.state.isWaitingForAction) {
      this.validateInteractiveStep();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // GUIDED TASK SUPPORT
  // ═══════════════════════════════════════════════════════════════════════════════

  private guidedTaskTargetSelector: string | null = null;

  /**
   * Set the current target selector for guided task substeps
   * This allows the spotlight to follow the guided task progress
   */
  setGuidedTaskTarget(selector: string): void {
    this.guidedTaskTargetSelector = selector;
    // Notify subscribers to update spotlight position
    this.notify();
  }

  /**
   * Get the current guided task target selector
   */
  getGuidedTaskTarget(): string | null {
    return this.guidedTaskTargetSelector;
  }

  /**
   * Notify that guided task substep has changed
   */
  notifySubStepChange(): void {
    this.notify();
  }

  /**
   * Check if onboarding is complete
   */
  isOnboardingComplete(): boolean {
    return this.isTutorialCompleted('celestial-awakening-v1') ||
           this.isTutorialCompleted('elite-onboarding');
  }

  /**
   * Get next recommended tutorial
   */
  getRecommendedTutorial(): Tutorial | null {
    const priority = ['celestial-awakening-v1', 'elite-onboarding', 'calendar-basics', 'astrology-intro', 'gamification-intro'];
    
    for (const id of priority) {
      if (!this.isTutorialCompleted(id)) {
        return getTutorialById(id) || null;
      }
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PREFERENCES
  // ═══════════════════════════════════════════════════════════════════════════════

  updatePreferences(preferences: Partial<TutorialState['preferences']>): void {
    this.state.preferences = { ...this.state.preferences, ...preferences };
    this.notify();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // RESET & PROGRESS
  // ═══════════════════════════════════════════════════════════════════════════════

  resetAllTutorials(): void {
    this.cleanupInteractiveStep();
    this.state = getDefaultState();
    this.saveState();
    this.notify();
  }

  resetAllProgress(): void {
    this.cleanupInteractiveStep();
    this.state = getDefaultState();
    this.notify();
  }

  /**
   * Mark a specific tutorial as completed by ID (used by v2 onboarding to suppress legacy tutorials)
   */
  markTutorialCompleted(tutorialId: string): void {
    let progress = this.getTutorialProgress(tutorialId);
    
    if (!progress) {
      progress = {
        tutorialId,
        completed: true,
        currentStepIndex: 0,
        completedSteps: [],
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        skipped: false,
        showCount: 1,
      };
      this.state.progress.push(progress);
    } else {
      progress.completed = true;
      progress.completedAt = new Date().toISOString();
    }
    
    if (!this.state.completedTutorials.includes(tutorialId)) {
      this.state.completedTutorials.push(tutorialId);
    }
    
    this.saveState();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONTEXTUAL HELP
  // ═══════════════════════════════════════════════════════════════════════════════

  getContextualHelp(selector: string): ContextualHelp | undefined {
    return contextualHelpEntries.find(h => {
      return selector.includes(h.selector.replace('.', '').replace('[', '').replace(']', ''));
    });
  }

  shouldShowContextualHelp(helpId: string): boolean {
    const help = contextualHelpEntries.find(h => h.id === helpId);
    if (!help) return false;
    if (!help.showOnce) return true;
    
    const shown = localStorage.getItem(`heka-help-shown-${helpId}`);
    return !shown;
  }

  markContextualHelpShown(helpId: string): void {
    localStorage.setItem(`heka-help-shown-${helpId}`, 'true');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════════

  private trackAnalytics(event: TutorialAnalytics): void {
    this.analyticsQueue.push(event);
    
    try {
      const existing = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
      existing.push(event);
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('[Tutorial] Failed to save analytics:', e);
    }
  }

  getAnalytics(): TutorialAnalytics[] {
    try {
      return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // EXPORT/IMPORT
  // ═══════════════════════════════════════════════════════════════════════════════

  exportProgress(): string {
    return JSON.stringify({
      state: this.state,
      analytics: this.getAnalytics(),
      exportedAt: new Date().toISOString(),
    });
  }

  importProgress(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.state) {
        this.cleanupInteractiveStep();
        this.state = { ...getDefaultState(), ...parsed.state };
        this.notify();
        return true;
      }
    } catch (e) {
      console.error('[Tutorial] Failed to import progress:', e);
    }
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const tutorialService = new TutorialService();

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK HELPER
// ═══════════════════════════════════════════════════════════════════════════════

export function useTutorialService() {
  return tutorialService;
}

// Export types
export type { 
  Tutorial, 
  TutorialStep, 
  TutorialProgress, 
  TutorialState, 
  ContextualHelp,
  InteractiveConfig,
  GuidedTaskConfig 
};
