/**
 * Guided Task Spotlight
 * For guided tasks - calendar is FULLY VISIBLE
 * Just shows a floating panel + highlights around targets
 */

import React, { useEffect, useState, useRef } from 'react';
import { tutorialService } from '../../services/tutorialService';
import type { TutorialStep } from '../../types/tutorial';
import './guided-task-spotlight.css';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const GuidedTaskSpotlight: React.FC<{ step: TutorialStep }> = ({ step }) => {
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const completedRef = useRef(false);

  const subSteps = step.guidedTask?.subSteps || [];
  const currentSubStep = subSteps[currentSubStepIndex];
  const isLastStep = currentSubStepIndex >= subSteps.length;

  // Track target element position
  useEffect(() => {
    if (isLastStep || !currentSubStep?.targetSelector) {
      setTargetRect(null);
      return;
    }

    const updateTargetPosition = () => {
      const target = document.querySelector(currentSubStep.targetSelector);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetRect({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        });
        
        // Bring target to front
        target.classList.add('guided-task-target');
        
        // Scroll target into view (crucial for elements below the fold)
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    };

    // Initial position
    const timer = setTimeout(updateTargetPosition, 100);
    
    // Update on resize/scroll
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition, true);
      
      // Cleanup target class
      document.querySelectorAll('.guided-task-target').forEach(el => {
        el.classList.remove('guided-task-target');
      });
    };
  }, [currentSubStep, isLastStep]);

  // Monitor for substep completion
  useEffect(() => {
    if (!currentSubStep || isLastStep || completedRef.current) return;

    const checkInterval = setInterval(() => {
      if (completedRef.current) {
        clearInterval(checkInterval);
        return;
      }

      let isValid = false;
      const validation = currentSubStep.validation;

      if (validation?.elementAppears) {
        const element = document.querySelector(validation.elementAppears);
        if (element) isValid = true;
      }

      if (validation?.elementDisappears) {
        const element = document.querySelector(validation.elementDisappears);
        if (!element) isValid = true;
      }

      if (validation?.localStorageKey) {
        if (localStorage.getItem(validation.localStorageKey) !== null) {
          isValid = true;
        }
      }

      if (isValid) {
        completedRef.current = true;
        clearInterval(checkInterval);
        
        // Small delay for visual feedback
        setTimeout(() => {
          if (currentSubStepIndex < subSteps.length - 1) {
            setCurrentSubStepIndex(prev => prev + 1);
            completedRef.current = false;
          } else {
            setIsCompleted(true);
            setTimeout(() => {
              tutorialService.nextStep();
            }, 1500);
          }
        }, 500);
      }
    }, 300);

    return () => clearInterval(checkInterval);
  }, [currentSubStep, currentSubStepIndex, subSteps.length, isLastStep]);

  if (isCompleted) {
    return (
      <div className="guided-task-complete-overlay">
        <div className="guided-task-complete-message">
          <span className="guided-task-complete-icon">✓</span>
          <span>{step.guidedTask?.completionMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Target Highlight Border - NO dark overlay, just the border */}
      {targetRect && (
        <div
          className="guided-task-highlight"
          style={{
            position: 'fixed',
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            zIndex: 10000,
            pointerEvents: 'none',
          }}
        >
          <div className="guided-task-highlight-inner">
            <div className="guided-task-pulse" />
            <div className="guided-task-pulse delayed" />
          </div>
        </div>
      )}

      {/* Floating Instruction Panel */}
      <div className="guided-task-floating-panel">
        <div className="guided-task-panel-header">
          <h3>{step.title}</h3>
          <div className="guided-task-step-counter">
            {currentSubStepIndex + 1} / {subSteps.length}
          </div>
        </div>
        <p className="guided-task-instruction">{currentSubStep?.instruction}</p>
        <div className="guided-task-dots">
          {subSteps.map((_, idx) => (
            <div
              key={idx}
              className={`guided-task-dot ${
                idx < currentSubStepIndex ? 'completed' : 
                idx === currentSubStepIndex ? 'active' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Skip Button */}
      {step.canSkip !== false && (
        <button 
          className="guided-task-skip"
          onClick={() => tutorialService.skipTutorial()}
        >
          Skip Tutorial
        </button>
      )}
    </>
  );
};

export default GuidedTaskSpotlight;
