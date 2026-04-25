/**
 * Tutorial Spotlight Component - Enterprise Grade
 * Interactive element highlighting with animated guides
 * 
 * CRITICAL FIXES:
 * - Proper click isolation: Full overlay blocking all UI except target
 * - Keyboard navigation blocking during interactive steps
 * - Route change prevention
 * - Comprehensive feature coverage
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useBlocker } from 'react-router-dom';
import type { RootState } from '../store';
import { tutorialService } from '../services/tutorialService';
import type { TutorialStep } from '../types/tutorial';
import './tutorial-spotlight.css';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const TutorialSpotlight: React.FC = () => {
  const tutorialState = useSelector((state: RootState) => state.tutorial);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const prevStepIdRef = useRef<string | null>(null);
  const keyboardBlockedRef = useRef(false);

  // Subscribe to tutorial service state changes
  useEffect(() => {
    const unsubscribe = tutorialService.subscribe(() => {
      const step = tutorialService.getCurrentStep();
      setCurrentStep(step);
      
      // Reset success animation when step changes
      if (step?.id !== prevStepIdRef.current) {
        setShowSuccess(false);
        prevStepIdRef.current = step?.id || null;
      }
    });
    
    // Get initial step
    setCurrentStep(tutorialService.getCurrentStep());
    
    return unsubscribe;
  }, []);

  const isActive = tutorialState?.isActive && 
    (currentStep?.type === 'spotlight' || currentStep?.type === 'interactive' || currentStep?.type === 'guided-task');
  const isInteractive = currentStep?.type === 'interactive' || currentStep?.type === 'guided-task';
  const isGuidedTask = currentStep?.type === 'guided-task';
  const isWaiting = tutorialState?.isWaitingForAction;
  const shouldBlockInteraction = isInteractive && isWaiting;

  // Block route navigation during interactive steps
  useBlocker(({ nextLocation, currentLocation }) => {
    if (!shouldBlockInteraction) return false;
    if (nextLocation.pathname === currentLocation.pathname) return false;
    tutorialService.triggerShake();
    return true;
  });

  // Block keyboard navigation during interactive steps
  useEffect(() => {
    if (!shouldBlockInteraction) {
      keyboardBlockedRef.current = false;
      return;
    }

    keyboardBlockedRef.current = true;
    
    const blockKeyboard = (e: KeyboardEvent) => {
      // Block Tab, Escape, Enter, Arrow keys during interactive steps
      const blockedKeys = ['Tab', 'Escape', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
      
      if (blockedKeys.includes(e.key)) {
        // Allow if target element is focused (user is interacting with target)
        const activeElement = document.activeElement;
        const targetSelector = currentStep?.targetSelector;
        
        if (targetSelector && activeElement) {
          const target = document.querySelector(targetSelector);
          if (target === activeElement || target?.contains(activeElement)) {
            return; // Allow - user is on the target
          }
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        // Trigger shake on wrong key press
        if (e.key !== 'Escape') { // Allow escape to skip
          tutorialService.triggerShake();
        }
      }
    };

    document.addEventListener('keydown', blockKeyboard, true);

    return () => {
      document.removeEventListener('keydown', blockKeyboard, true);
    };
  }, [shouldBlockInteraction, currentStep?.targetSelector]);

  // Calculate target element position
  const updateTargetPosition = useCallback(() => {
    if (!currentStep?.targetSelector) {
      setTargetRect(null);
      return;
    }

    let selector = currentStep.targetSelector;
    let target: Element | null = null;

    // Special handling for month-navigation step: highlight unclicked arrow
    if (currentStep.id === 'month-navigation') {
      const navState = tutorialService.getMonthNavigationState();
      if (navState.prevClicked && !navState.nextClicked) {
        selector = '.month-nav-next';
      } else if (!navState.prevClicked && navState.nextClicked) {
        selector = '.month-nav-prev';
      }
    }

    // Special handling for guided-task steps: use the current substep target
    if (currentStep.type === 'guided-task') {
      const guidedTarget = tutorialService.getGuidedTaskTarget();
      if (guidedTarget) {
        selector = guidedTarget;
      }
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
              target = el;
              break;
            }
          }
        }
        if (target) break;
      }
    }

    // Try exact selector
    if (!target && !selector.includes(':contains')) {
      try {
        target = document.querySelector(selector);
      } catch (e) {
        // Invalid selector
      }
    }

    // Try partial class match
    if (!target && selector.startsWith('.')) {
      const className = selector.slice(1);
      const elements = document.querySelectorAll(`[class*="${className}"]`);
      if (elements.length > 0) target = elements[0];
    }

    // Try alternative selectors
    if (!target && currentStep.alternativeSelectors) {
      for (const altSelector of currentStep.alternativeSelectors) {
        try {
          const alt = document.querySelector(altSelector);
          if (alt) {
            target = alt;
            break;
          }
        } catch (e) {
          // Continue
        }
      }
    }

    if (target) {
      const rect = target.getBoundingClientRect();
      const padding = currentStep.spotlightPadding || 16;

      setTargetRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
      setIsAnimating(true);

      // Bring target to front so it's clickable
      target.classList.add('tutorial-target-active');
      
      // Also bring all parent elements to front (in case of nested structures)
      let parent = target.parentElement;
      while (parent && parent !== document.body) {
        parent.classList.add('tutorial-target-parent');
        parent = parent.parentElement;
      }

      // Scroll element into view
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  // Update target position when step changes or becomes active
  useEffect(() => {
    if (isActive && currentStep) {
      const timer = setTimeout(updateTargetPosition, 150);
      
      window.addEventListener('resize', updateTargetPosition);
      window.addEventListener('scroll', updateTargetPosition, true);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateTargetPosition);
        window.removeEventListener('scroll', updateTargetPosition, true);
      };
    } else {
      setTargetRect(null);
      setShowSuccess(false);
    }
  }, [isActive, currentStep, updateTargetPosition]);

  // Cleanup target classes when step changes
  useEffect(() => {
    return () => {
      document.querySelectorAll('.tutorial-target-active').forEach(el => {
        el.classList.remove('tutorial-target-active');
      });
      document.querySelectorAll('.tutorial-target-parent').forEach(el => {
        el.classList.remove('tutorial-target-parent');
      });
    };
  }, [currentStep?.id]);

  // Show success animation when action is completed
  useEffect(() => {
    if (!isWaiting && isInteractive && targetRect && isActive) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isWaiting, isInteractive, targetRect, isActive]);

  const handleNext = () => {
    if (!isInteractive || !isWaiting) {
      tutorialService.nextStep();
    }
  };

  const handleSkip = () => {
    tutorialService.skipTutorial();
  };

  const handleRequestHint = () => {
    tutorialService.requestHint();
  };

  // Don't render anything if not active
  if (!isActive || !currentStep) {
    return null;
  }

  // For interactive steps without a visible target, show center tooltip
  if (isInteractive && !targetRect && !currentStep?.targetSelector) {
    return (
      <div className="tutorial-center-overlay">
        <InteractiveCenterTooltip
          step={currentStep}
          onSkip={handleSkip}
          onRequestHint={handleRequestHint}
          hintIndex={tutorialState?.currentHintIndex || 0}
        />
      </div>
    );
  }

  return (
    <div className={`tutorial-spotlight ${isAnimating ? 'is-animating' : ''}`}>
      {/* NOTE: Full blocker removed - using clip-path click blocker instead
          The clip-path blocker properly cuts out the target area so clicks work there */}

      {/* Dark overlay with cutout - lighter for guided tasks */}
      {targetRect && !isGuidedTask && (
        <svg className="spotlight-overlay" preserveAspectRatio="none">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      )}
      
      {/* For guided tasks: very light overlay so calendar is visible */}
      {isGuidedTask && (
        <div 
          className="guided-task-light-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 9996,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Click Blocker - Prevents clicking outside the target with visual feedback */}
      {targetRect && shouldBlockInteraction && (
        <ClickBlocker
          targetRect={targetRect}
          onWrongClick={() => tutorialService.triggerShake()}
        />
      )}

      {/* Target highlight effects */}
      {targetRect && (
        <TargetHighlight
          rect={targetRect}
          step={currentStep}
          isInteractive={isInteractive}
          isWaiting={isWaiting}
          showSuccess={showSuccess}
        />
      )}

      {/* Tooltip - skip for guided-task steps since they have their own UI */}
      {targetRect && currentStep?.type !== 'guided-task' && (
        <TutorialTooltip
          targetRect={targetRect}
          step={currentStep}
          onAction={handleNext}
          onSkip={handleSkip}
          onRequestHint={handleRequestHint}
          isInteractive={isInteractive}
          isWaiting={isWaiting}
          hintIndex={tutorialState?.currentHintIndex || 0}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TARGET HIGHLIGHT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface TargetHighlightProps {
  rect: Rect;
  step: TutorialStep;
  isInteractive: boolean;
  isWaiting: boolean;
  showSuccess: boolean;
}

const TargetHighlight: React.FC<TargetHighlightProps> = ({
  rect,
  step,
  isInteractive,
  isWaiting,
  showSuccess,
}) => {
  const indicator = step?.interactive?.indicator || 'pulse';
  const badgeText = step?.interactive?.badgeText;
  const highlightColor = step?.highlightColor || '#c9a227';

  return (
    <>
      {/* Animated border/container */}
      <div
        className={`target-highlight target-highlight--${indicator} ${
          isInteractive && isWaiting ? 'is-active' : ''
        } ${showSuccess ? 'is-success' : ''}`}
        style={{
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          pointerEvents: 'none',
          zIndex: 10002, // Above full blocker (9999) but below tooltip (10001)
          borderRadius: '12px',
        }}
      >
        {/* Pulse ring */}
        {indicator === 'pulse' && isInteractive && isWaiting && (
          <>
            <div className="pulse-ring" style={{ borderColor: highlightColor }} />
            <div className="pulse-ring delay-1" style={{ borderColor: highlightColor }} />
            <div className="pulse-ring delay-2" style={{ borderColor: highlightColor }} />
          </>
        )}

        {/* Glow effect */}
        {indicator === 'glow' && isInteractive && isWaiting && (
          <div className="glow-effect" style={{ boxShadow: `0 0 30px ${highlightColor}` }} />
        )}

        {/* Bounce arrow */}
        {indicator === 'bounce' && isInteractive && isWaiting && (
          <div className="bounce-arrow">
            <svg viewBox="0 0 24 24" fill={highlightColor}>
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </div>
        )}

        {/* Ripple effect */}
        {indicator === 'ripple' && isInteractive && isWaiting && (
          <div className="ripple-container">
            <div className="ripple" style={{ borderColor: highlightColor }} />
            <div className="ripple delay-1" style={{ borderColor: highlightColor }} />
          </div>
        )}

        {/* Success animation */}
        {showSuccess && (
          <div className="success-overlay">
            <div className="success-check">✓</div>
          </div>
        )}
      </div>

      {/* Badge */}
      {isInteractive && isWaiting && badgeText && (
        <div
          className="tutorial-badge"
          style={{
            position: 'fixed',
            top: rect.top - 12,
            left: rect.left + rect.width / 2,
            transform: 'translateX(-50%)',
            zIndex: 10003,
          }}
        >
          {badgeText}
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CLICK BLOCKER COMPONENT - Blocks clicks outside the target area
// ═══════════════════════════════════════════════════════════════════════════════

interface ClickBlockerProps {
  targetRect: Rect;
  onWrongClick?: () => void;
}

const ClickBlocker: React.FC<ClickBlockerProps> = ({ targetRect, onWrongClick }) => {
  const handleBlockerClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWrongClick?.();
  }, [onWrongClick]);

  // Create a clip path that cuts out the target area
  const clipPath = `polygon(
    0% 0%, 
    100% 0%, 
    100% 100%, 
    0% 100%,
    0% 0%,
    ${targetRect.left}px ${targetRect.top}px,
    ${targetRect.left}px ${targetRect.top + targetRect.height}px,
    ${targetRect.left + targetRect.width}px ${targetRect.top + targetRect.height}px,
    ${targetRect.left + targetRect.width}px ${targetRect.top}px,
    ${targetRect.left}px ${targetRect.top}px
  )`;

  return (
    <div
      className="tutorial-click-blocker"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        clipPath,
        zIndex: 9998, // Just below target highlight (10002)
      }}
      onClick={handleBlockerClick}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TUTORIAL TOOLTIP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface TutorialTooltipProps {
  targetRect: Rect;
  step: TutorialStep;
  onAction: () => void;
  onSkip: () => void;
  onRequestHint: () => void;
  isInteractive: boolean;
  isWaiting: boolean;
  hintIndex: number;
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  targetRect,
  step,
  onAction,
  onSkip,
  onRequestHint,
  isInteractive,
  isWaiting,
  hintIndex,
}) => {
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const position = step?.position || 'bottom';
  const currentHint = tutorialService.getCurrentHint();

  useEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 20;
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - padding;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.top + targetRect.height + padding;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - padding;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left + targetRect.width + padding;
        break;
      case 'center':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      default:
        top = targetRect.top + targetRect.height + padding;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
    }

    // Keep within viewport
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

    setTooltipPos({ top, left });
  }, [targetRect, position]);

  const hasHints = step?.interactive?.hints && step.interactive.hints.length > 0;
  const totalHints = step?.interactive?.hints?.length || 0;

  // Split layout for calendar-grid-interactive step
  if (isInteractive && isWaiting && step?.id === 'calendar-grid-interactive') {
    return (
      <>
        <TutorialHeaderPanel step={step} onSkip={onSkip} isLarge />
        
        {/* Action Card - Positioned near target */}
        <div
          ref={tooltipRef}
          className={`tutorial-tooltip tutorial-tooltip--compact tutorial-tooltip--first-step tutorial-tooltip--${step?.tone || 'friendly'}`}
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
          }}
        >
          <div className="tutorial-tooltip__action-required">
            <div className="action-pulse" />
            <span>{step?.actionRequired || 'Try it yourself!'}</span>
          </div>

          {currentHint && (
            <div className="tutorial-tooltip__hint">
              <div className="hint-label">💡 Hint {hintIndex} of {totalHints}</div>
              <div className="hint-text">{currentHint}</div>
            </div>
          )}

          <div className="tutorial-tooltip__actions">
            {hasHints && !currentHint && (
              <button className="tutorial-tooltip__hint-btn" onClick={onRequestHint}>
                Need a hint?
              </button>
            )}

            {step?.canSkip !== false && (
              <button className="tutorial-tooltip__skip" onClick={onSkip}>
                Skip Tour
              </button>
            )}
          </div>
        </div>
      </>
    );
  }
  
  // Interactive steps
  if (isInteractive && isWaiting) {
    return (
      <div
        ref={tooltipRef}
        className={`tutorial-tooltip tutorial-tooltip--${step?.tone || 'friendly'}`}
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
        }}
      >
        <div className="tutorial-tooltip__header">
          <div className="tutorial-tooltip__icon">
            {step?.tone === 'excited' && '🎉'}
            {step?.tone === 'mysterious' && '✨'}
            {step?.tone === 'calm' && '🌙'}
            {step?.tone === 'helpful' && '💡'}
            {(!step?.tone || step?.tone === 'friendly') && '👋'}
          </div>
          <h3 className="tutorial-tooltip__title">{step?.title}</h3>
        </div>

        <div className="tutorial-tooltip__content">
          {step?.content}
        </div>

        <div className="tutorial-tooltip__action-required">
          <div className="action-pulse" />
          <span>{step?.actionRequired || 'Try it yourself!'}</span>
        </div>

        {currentHint && (
          <div className="tutorial-tooltip__hint">
            <div className="hint-label">💡 Hint {hintIndex} of {totalHints}</div>
            <div className="hint-text">{currentHint}</div>
          </div>
        )}

        <div className="tutorial-tooltip__actions">
          {hasHints && !currentHint && (
            <button className="tutorial-tooltip__hint-btn" onClick={onRequestHint}>
              Need a hint?
            </button>
          )}

          {step?.canSkip !== false && (
            <button className="tutorial-tooltip__skip" onClick={onSkip}>
              Skip Tour
            </button>
          )}
        </div>
      </div>
    );
  }

  // Non-interactive steps
  return (
    <div
      ref={tooltipRef}
      className={`tutorial-tooltip tutorial-tooltip--${step?.tone || 'friendly'}`}
      style={{
        top: tooltipPos.top,
        left: tooltipPos.left,
      }}
    >
      <div className="tutorial-tooltip__header">
        <div className="tutorial-tooltip__icon">
          {step?.tone === 'excited' && '🎉'}
          {step?.tone === 'mysterious' && '✨'}
          {step?.tone === 'calm' && '🌙'}
          {step?.tone === 'helpful' && '💡'}
          {(!step?.tone || step?.tone === 'friendly') && '👋'}
        </div>
        <h3 className="tutorial-tooltip__title">{step?.title}</h3>
      </div>

      <div className="tutorial-tooltip__content">
        {step?.content}
      </div>

      <div className="tutorial-tooltip__actions">
        {step?.canSkip !== false && (
          <button className="tutorial-tooltip__skip" onClick={onSkip}>
            Skip Tour
          </button>
        )}

        <button className="tutorial-tooltip__action" onClick={onAction}>
          {step?.actionLabel || 'Continue'}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TUTORIAL HEADER PANEL
// ═══════════════════════════════════════════════════════════════════════════════

const TutorialHeaderPanel: React.FC<{
  step: TutorialStep;
  onSkip: () => void;
  isLarge?: boolean;
}> = ({ step, onSkip, isLarge }) => {
  return (
    <div className={`tutorial-header-panel tutorial-header-panel--${step?.tone || 'friendly'} ${isLarge ? 'tutorial-header-panel--large' : ''}`}>
      <div className="tutorial-header-panel__inner">
        <div className="tutorial-header-panel__header">
          <div className="tutorial-header-panel__icon">
            {step?.tone === 'excited' && '🎉'}
            {step?.tone === 'mysterious' && '✨'}
            {step?.tone === 'calm' && '🌙'}
            {step?.tone === 'helpful' && '💡'}
            {(!step?.tone || step?.tone === 'friendly') && '👋'}
          </div>
          <h3 className="tutorial-header-panel__title">{step?.title}</h3>
        </div>

        <div className="tutorial-header-panel__content">
          {step?.content}
        </div>

        {step?.canSkip !== false && (
          <button className="tutorial-header-panel__skip" onClick={onSkip}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE CENTER TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════════

const InteractiveCenterTooltip: React.FC<{
  step: TutorialStep;
  onSkip: () => void;
  onRequestHint: () => void;
  hintIndex: number;
}> = ({ step, onSkip, onRequestHint, hintIndex }) => {
  const currentHint = tutorialService.getCurrentHint();
  const hasHints = step?.interactive?.hints && step.interactive.hints.length > 0;
  const totalHints = step?.interactive?.hints?.length || 0;

  return (
    <div className="tutorial-center-overlay">
      <div className={`tutorial-tooltip tutorial-tooltip--center tutorial-tooltip--${step?.tone || 'friendly'}`}>
        <div className="tutorial-tooltip__header">
          <div className="tutorial-tooltip__icon">
            {step?.tone === 'excited' && '🎉'}
            {step?.tone === 'mysterious' && '✨'}
            {step?.tone === 'calm' && '🌙'}
            {step?.tone === 'helpful' && '💡'}
            {(!step?.tone || step?.tone === 'friendly') && '👋'}
          </div>
          <h3 className="tutorial-tooltip__title">{step?.title}</h3>
        </div>

        <div className="tutorial-tooltip__content">{step?.content}</div>

        {step?.actionRequired && (
          <div className="tutorial-tooltip__action-required">
            <div className="action-pulse" />
            <span>{step?.actionRequired}</span>
          </div>
        )}

        {currentHint && (
          <div className="tutorial-tooltip__hint">
            <div className="hint-label">💡 Hint {hintIndex} of {totalHints}</div>
            <div className="hint-text">{currentHint}</div>
          </div>
        )}

        <div className="tutorial-tooltip__actions">
          {hasHints && !currentHint && (
            <button className="tutorial-tooltip__hint-btn" onClick={onRequestHint}>
              Need a hint?
            </button>
          )}

          {step?.canSkip !== false && (
            <button className="tutorial-tooltip__skip" onClick={onSkip}>
              Skip Tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialSpotlight;
