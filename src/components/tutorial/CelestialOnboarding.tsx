/**
 * Celestial Awakening — Unified Onboarding Experience
 * Replaces the fragmented slideshow with a single cosmic journey.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { tutorialService } from '../../services/tutorialService';
import { eventBus } from '../../services/eventBus';
import { TutorialSpotlight } from '../TutorialSpotlight';
import type { TutorialStep } from '../../types/tutorial';
import '../../styles/celestial-onboarding.css';

// Legacy visual components (kept for compatibility during transition)
const visualImports: Record<string, () => Promise<any>> = {
  'month-structure': () => import('./MonthStructureV3').then(m => m.MonthStructureV3),
  'sync-vs-true-epic': () => import('./SyncVsTrueEpic').then(m => m.SyncVsTrueEpic || m.default),
  'oracle-journal-v3': () => import('./OracleJournalV3').then(m => m.OracleJournalV3),
  'stars-hub-v2': () => import('./StarsHubV2').then(m => m.StarsHubV2),
  'cosmic-flow': () => import('./CosmicFlowVisual').then(m => m.CosmicFlowVisual || m.default),
};

function useVisualComponent(name?: string) {
  const [Component, setComponent] = useState<React.FC | null>(null);
  useEffect(() => {
    if (!name || !visualImports[name]) return;
    let active = true;
    visualImports[name]().then((Mod) => {
      if (active) setComponent(() => Mod);
    }).catch(() => {
      if (active) setComponent(null);
    });
    return () => { active = false; };
  }, [name]);
  return Component;
}

export const CelestialOnboarding: React.FC = () => {
  const tutorialState = useSelector((state: RootState) => state.tutorial);
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    const unsubscribe = tutorialService.subscribe((state) => {
      setCurrentStep(tutorialService.getCurrentStep());
      setStepIndex(state.currentStepIndex);
      const tutorial = tutorialService.getCurrentTutorial();
      setTotalSteps(tutorial?.steps.length || 0);
    });
    setCurrentStep(tutorialService.getCurrentStep());
    const tutorial = tutorialService.getCurrentTutorial();
    setTotalSteps(tutorial?.steps.length || 0);
    return unsubscribe;
  }, []);

  const isActive = tutorialState?.isActive;
  const starDensity = useMemo(() => {
    if (!totalSteps) return 'low';
    const ratio = stepIndex / (totalSteps - 1);
    if (ratio < 0.25) return 'low';
    if (ratio < 0.6) return 'mid';
    return 'high';
  }, [stepIndex, totalSteps]);

  if (!isActive || !currentStep) return null;

  return (
    <div className="celestial-backdrop" data-stars={starDensity}>
      <ConstellationOverlay progress={starDensity} />
      <StepRenderer step={currentStep} stepIndex={stepIndex} totalSteps={totalSteps} />
      <ProgressConstellation current={stepIndex} total={totalSteps} />
    </div>
  );
};

// ─── Constellation Overlay ───
const ConstellationOverlay: React.FC<{ progress: string }> = ({ progress }) => {
  const opacity = progress === 'low' ? 0.3 : progress === 'mid' ? 0.6 : 1;
  return (
    <svg
      className={`ca-constellation ${progress !== 'low' ? 'is-visible' : ''}`}
      style={{ opacity }}
      preserveAspectRatio="none"
      viewBox="0 0 1200 800"
    >
      <defs>
        <linearGradient id="constellation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(201,162,39,0)" />
          <stop offset="50%" stopColor="rgba(201,162,39,0.25)" />
          <stop offset="100%" stopColor="rgba(201,162,39,0)" />
        </linearGradient>
      </defs>
      <path
        d="M100,400 Q300,200 500,350 T900,300 T1100,450"
        fill="none"
        stroke="url(#constellation-gradient)"
        strokeWidth="1.5"
        strokeDasharray="6,6"
      />
      <circle cx="500" cy="350" r="3" fill="#c9a227" opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="900" cy="300" r="3" fill="#c9a227" opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

// ─── Step Renderer ───
const StepRenderer: React.FC<{ step: TutorialStep; stepIndex: number; totalSteps: number }> = ({
  step,
}) => {
  switch (step.type) {
    case 'welcome':
      return <CelestialWelcome step={step} />;
    case 'celebration':
      return <CelestialCelebration step={step} />;
    case 'interactive':
      return (
        <>
          <TutorialSpotlight />
          {/* Keep the backdrop dark but allow interaction */}
        </>
      );
    case 'modal':
    default:
      return <CelestialModal step={step} />;
  }
};

// ─── Celestial Welcome ───
const CelestialWelcome: React.FC<{ step: TutorialStep }> = ({ step }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9991,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px 24px 100px',
        overflowY: 'auto',
      }}
    >
      <div className="ca-orb" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        <div className="ca-orb__step-badge">The Celestial Awakening</div>
        <div className="ca-orb__icon">{getToneIcon(step.tone)}</div>
        <h2 className="ca-orb__title">{step.title}</h2>
        <p className="ca-orb__content">{step.content}</p>
        <div className="ca-orb__actions">
          <button className="ca-btn ca-btn--ghost" onClick={() => tutorialService.skipTutorial()}>
            Skip Journey
          </button>
          <button className="ca-btn ca-btn--primary" onClick={() => tutorialService.nextStep()}>
            {step.actionLabel || 'Begin'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Celestial Modal ───
const CelestialModal: React.FC<{ step: TutorialStep }> = ({ step }) => {
  const Visual = useVisualComponent(step.visualComponent);
  const canGoBack = tutorialService.getState().currentStepIndex > 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9991,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px 24px 100px',
        overflowY: 'auto',
      }}
    >
      <div className="ca-orb" style={{ maxWidth: Visual ? '640px' : '560px', marginTop: 'auto', marginBottom: 'auto' }}>
        <div className="ca-orb__icon">{getToneIcon(step.tone)}</div>
        <h2 className="ca-orb__title">{step.title}</h2>

        {Visual && (
          <div className="ca-orb__visual">
            <Visual />
          </div>
        )}

        <p className="ca-orb__content">{step.content}</p>

        <div className="ca-orb__actions">
          {canGoBack && (
            <button className="ca-btn ca-btn--ghost" onClick={() => tutorialService.previousStep()}>
              ← Back
            </button>
          )}
          <button className="ca-btn ca-btn--ghost" onClick={() => tutorialService.skipTutorial()}>
            Skip
          </button>
          <button className="ca-btn ca-btn--primary" onClick={() => tutorialService.nextStep()}>
            {step.actionLabel || 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Celestial Celebration ───
const CelestialCelebration: React.FC<{ step: TutorialStep }> = ({ step }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9991,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px 24px 100px',
        overflowY: 'auto',
      }}
    >
      <div className="ca-celebration" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        <div className="ca-celebration__crown">✦</div>
        <h2 className="ca-celebration__title">{step.title}</h2>
        <p className="ca-celebration__text">{step.content}</p>
        <button
          className="ca-btn ca-btn--primary"
          style={{ padding: '16px 36px', fontSize: '15px' }}
          onClick={() => tutorialService.completeTutorial()}
        >
          {step.actionLabel || 'Start Exploring'}
        </button>
        <button
          className="ca-btn ca-btn--ghost"
          style={{ marginTop: '12px', padding: '12px 24px', fontSize: '13px' }}
          onClick={() => {
            tutorialService.completeTutorial();
            setTimeout(() => {
              eventBus.emit('heka-open-info', undefined);
            }, 400);
          }}
        >
          📖 Read the Full Story
        </button>
      </div>
    </div>
  );
};

// ─── Progress Constellation ───
const ProgressConstellation: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  if (total <= 1) return null;
  return (
    <div className="ca-progress">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`ca-progress__star ${i <= current ? 'is-lit' : ''} ${i === current ? 'is-current' : ''}`}
        />
      ))}
      <span className="ca-progress__text">
        {current + 1} / {total}
      </span>
    </div>
  );
};

function getToneIcon(tone?: string): string {
  switch (tone) {
    case 'excited': return '🎉';
    case 'mysterious': return '✨';
    case 'calm': return '🌙';
    case 'helpful': return '💡';
    default: return '👋';
  }
}
