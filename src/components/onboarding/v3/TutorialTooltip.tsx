/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TUTORIAL TOOLTIP — Glassmorphism with CSS classes, real galleries, step dots
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState, useRef } from 'react';
import type { TutorialStep } from './TutorialEngine';

interface TutorialTooltipProps {
  step: TutorialStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack?: () => void;
  onSkip: () => void;
  interactionReady: boolean;
}

const PRINT_THEMES = [
  { name: 'Default', class: 'tt-gallery__item--print-default', color: '#b8941f', desc: 'Parchment & gold' },
  { name: 'Minimalist', class: 'tt-gallery__item--print-minimal', color: '#888', desc: 'Swiss purity' },
  { name: 'Sacred Geo', class: 'tt-gallery__item--print-geometry', color: '#d4af37', desc: 'Circular cells' },
  { name: 'Cyberpunk', class: 'tt-gallery__item--print-cyber', color: '#ff00ff', desc: 'Neon glow' },
  { name: 'Nature', class: 'tt-gallery__item--print-nature', color: '#33691e', desc: 'Botanical' },
  { name: 'Egypt', class: 'tt-gallery__item--print-egypt', color: '#b8941f', desc: 'Hieroglyphs' },
];

const ACHIEVEMENTS = [
  { icon: '📝', name: 'First Words', tier: 1 },
  { icon: '🔥', name: 'Week Warrior', tier: 2 },
  { icon: '💯', name: 'Century Club', tier: 3 },
  { icon: '📚', name: 'The Chronicler', tier: 4 },
  { icon: '🦉', name: 'Night Owl', tier: 2 },
  { icon: '⏳', name: 'Time Lord', tier: 5 },
];

export const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  interactionReady,
}) => {
  const [position, setPosition] = useState<'bottom' | 'top' | 'left' | 'right' | 'center'>('center');
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [animState, setAnimState] = useState<'entering' | 'idle' | 'exiting'>('entering');
  const prevStepId = useRef(step.id);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Entrance/exit animation on step change
  useEffect(() => {
    if (prevStepId.current !== step.id) {
      setAnimState('exiting');
      const exitTimer = setTimeout(() => {
        setAnimState('entering');
        prevStepId.current = step.id;
        const enterTimer = setTimeout(() => setAnimState('idle'), 500);
        return () => clearTimeout(enterTimer);
      }, 250);
      return () => clearTimeout(exitTimer);
    }
  }, [step.id]);

  // Position calculation — NEVER place tooltip on top of the spotlighted element
  useEffect(() => {
    const updatePosition = () => {
      const tooltipWidth = 420;
      const tooltipHeight = step.id === 'features' ? 500 : 380;
      const margin = 16;

      if (!step.spotlightSelector) {
        // No spotlight — center on screen
        setPosition('center');
        setCoords({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        return;
      }

      const el = document.querySelector(step.spotlightSelector);
      if (!el) {
        setPosition('center');
        setCoords({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        return;
      }

      const r = el.getBoundingClientRect();
      const elCoversMostOfScreen = r.width > window.innerWidth * 0.7 || r.height > window.innerHeight * 0.6;

      if (elCoversMostOfScreen) {
        // Element is huge (calendar grid, day panel). Float tooltip at top or bottom of screen.
        const roomAbove = r.top > tooltipHeight + margin * 2;
        const roomBelow = window.innerHeight - r.bottom > tooltipHeight + margin * 2;

        if (roomAbove) {
          // Float above the element, centered horizontally
          setPosition('top');
          setCoords({ x: window.innerWidth / 2, y: r.top - margin - tooltipHeight / 2 });
        } else if (roomBelow) {
          // Float below the element, centered horizontally
          setPosition('bottom');
          setCoords({ x: window.innerWidth / 2, y: r.bottom + margin + tooltipHeight / 2 });
        } else {
          // Nowhere to go — dock to top of viewport with safe margin
          setPosition('top');
          setCoords({ x: window.innerWidth / 2, y: margin + tooltipHeight / 2 + 40 });
        }
        return;
      }

      // Small element — position adjacent
      const gap = 20;
      if (r.bottom + gap + tooltipHeight < window.innerHeight - margin) {
        setPosition('bottom');
        setCoords({
          x: Math.min(Math.max(r.left + r.width / 2, tooltipWidth / 2 + margin), window.innerWidth - tooltipWidth / 2 - margin),
          y: r.bottom + gap + tooltipHeight / 2,
        });
      } else if (r.top - gap - tooltipHeight > margin) {
        setPosition('top');
        setCoords({
          x: Math.min(Math.max(r.left + r.width / 2, tooltipWidth / 2 + margin), window.innerWidth - tooltipWidth / 2 - margin),
          y: r.top - gap - tooltipHeight / 2,
        });
      } else if (r.left - gap - tooltipWidth > margin) {
        setPosition('left');
        setCoords({
          x: r.left - gap - tooltipWidth / 2,
          y: Math.min(Math.max(r.top + r.height / 2, tooltipHeight / 2 + margin), window.innerHeight - tooltipHeight / 2 - margin),
        });
      } else if (r.right + gap + tooltipWidth < window.innerWidth - margin) {
        setPosition('right');
        setCoords({
          x: r.right + gap + tooltipWidth / 2,
          y: Math.min(Math.max(r.top + r.height / 2, tooltipHeight / 2 + margin), window.innerHeight - tooltipHeight / 2 - margin),
        });
      } else {
        // Fallback: dock to bottom of viewport, never center-overlap
        setPosition('bottom');
        setCoords({ x: window.innerWidth / 2, y: window.innerHeight - margin - tooltipHeight / 2 });
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 300);
    window.addEventListener('resize', updatePosition);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updatePosition);
    };
  }, [step]);

  const progress = Math.round((stepIndex / (totalSteps - 1)) * 100);
  const isCenter = position === 'center';

  const animClass = animState === 'entering' ? 'tt-tooltip--entering' : animState === 'exiting' ? 'tt-tooltip--exiting' : '';

  const showPrintPreview = step.id === 'features';
  const showAchievementPreview = step.id === 'features';

  return (
    <div
      ref={tooltipRef}
      className={`tt-tooltip ${animClass}`}
      style={{
        left: isCenter ? '50%' : coords.x,
        top: isCenter ? '50%' : coords.y,
        transform: isCenter ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
      }}
    >
      <div className="tt-tooltip__card">
        <div className="tt-tooltip__gold-line" />

        <div className="tt-tooltip__content">
          {/* Step indicator dots */}
          <div className="tt-step-indicator">
            {Array.from({ length: totalSteps - 1 }, (_, i) => (
              <div
                key={i}
                className={`tt-step-indicator__dot ${
                  i === stepIndex ? 'tt-step-indicator__dot--current' :
                  i < stepIndex ? 'tt-step-indicator__dot--completed' : ''
                }`}
              />
            ))}
          </div>

          {/* Header */}
          <div className="tt-tooltip__header">
            <div className="tt-tooltip__step-group">
              <div className="tt-tooltip__step-badge">{stepIndex + 1}</div>
              <span className="tt-tooltip__step-label">
                {step.id === 'complete' ? 'Complete' : `Step ${stepIndex + 1} of ${totalSteps - 1}`}
              </span>
            </div>

            {/* Circular progress */}
            <div className="tt-tooltip__progress-ring">
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke="url(#goldGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c9a227" />
                    <stop offset="100%" stopColor="#e8d179" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="tt-tooltip__progress-text">{progress}%</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="tt-tooltip__title">{step.title}</h2>

          {/* Instruction */}
          <p className="tt-tooltip__instruction">{step.instruction}</p>

          {/* Detail */}
          {step.detail && <p className="tt-tooltip__detail">{step.detail}</p>}

          {/* Print Theme Gallery */}
          {showPrintPreview && (
            <div className="tt-gallery">
              <div className="tt-gallery__grid">
                {PRINT_THEMES.map((theme) => (
                  <div key={theme.name} className={`tt-gallery__item ${theme.class}`}>
                    <div className="tt-gallery__dot" style={{ background: theme.color, boxShadow: `0 0 8px ${theme.color}60` }} />
                    <div className="tt-gallery__name">{theme.name}</div>
                    <div className="tt-gallery__desc">{theme.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievement Preview */}
          {showAchievementPreview && (
            <div className="tt-gallery">
              <div className="tt-gallery__scroll">
                {ACHIEVEMENTS.map((ach) => (
                  <div key={ach.name} className="tt-gallery__achievement">
                    <div className="tt-gallery__achievement-icon">{ach.icon}</div>
                    <div className="tt-gallery__achievement-name">{ach.name}</div>
                    <div className="tt-gallery__achievement-stars">
                      {Array.from({ length: ach.tier }, (_, i) => (
                        <span key={i} className="tt-gallery__achievement-star">★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action hint */}
          {step.action && (
            <div className={`tt-action ${step.requiresInteraction && !interactionReady ? 'tt-action--waiting' : 'tt-action--ready'}`}>
              <span className={`tt-action__icon ${step.requiresInteraction && !interactionReady ? 'tt-action__icon--waiting' : 'tt-action__icon--ready'}`}>
                {step.requiresInteraction && !interactionReady ? '👆' : '✓'}
              </span>
              <span className={`tt-action__text ${step.requiresInteraction && !interactionReady ? 'tt-action__text--waiting' : 'tt-action__text--ready'}`}>
                {step.action}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="tt-tooltip__buttons">
            {onBack && (
              <button className="tt-btn tt-btn--back" onClick={onBack}>
                ← Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step.id !== 'complete' && (
              <button className="tt-btn tt-btn--skip" onClick={onSkip}>
                Skip
              </button>
            )}
            {(!step.requiresInteraction || interactionReady) && (
              <button className="tt-btn tt-btn--primary" onClick={onNext}>
                {step.id === 'complete' ? 'Enter HEKA →' : 'Continue →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
