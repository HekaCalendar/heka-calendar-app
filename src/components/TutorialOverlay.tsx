/**
 * Tutorial Overlay - ELITE VERSION
 * Handles all tutorial types with proper visual hierarchy
 * 
 * KEY PRINCIPLES:
 * - Modals: Full overlay, centered content
 * - Interactive: Dark overlay with spotlight cutout
 * - Guided Tasks: NO overlay - calendar fully visible, just floating panel
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { tutorialService } from '../services/tutorialService';
import { TutorialSpotlight } from './TutorialSpotlight';
import { GuidedTaskSpotlight } from './tutorial/GuidedTaskSpotlight';
import { CosmicFlowVisual } from './tutorial/CosmicFlowVisual';
import { CalendarComparisonV2 } from './tutorial/CalendarComparisonV2';
import { NewYearResolutions } from './tutorial/NewYearResolutions';

import { MonthStructureV2 } from './tutorial/MonthStructureV2';
import { MonthStructureV3 } from './tutorial/MonthStructureV3';
import { RoutineVisualization } from './tutorial/RoutineVisualization';
import { SwissEngineV2 } from './tutorial/SwissEngineV2';
import { MoonPhasesV2 } from './tutorial/MoonPhasesV2';
import { StarsHubV2 } from './tutorial/StarsHubV2';
import { OracleJournalV3 } from './tutorial/OracleJournalV3';
import { ThemesV2 } from './tutorial/ThemesV2';
import { TimeModesV2 } from './tutorial/TimeModesV2';
import { TimeModesDemo } from './tutorial/TimeModesDemo';
import { WeekSymmetry } from './tutorial/WeekSymmetry';
import { YearStructureVisual } from './tutorial/YearStructureVisual';
import { SyncVsTrueEpic } from './tutorial/SyncVsTrueEpic';
import { CivilVsNatural } from './tutorial/CivilVsNatural';
import { CalendarEvolutionVisual } from './tutorial/CalendarEvolutionVisual';
import { PrintV3 } from './tutorial/PrintV3';
import { SaturdayStart } from './tutorial/SaturdayStart';
import { HexaMonth } from './tutorial/HexaMonth';
import { SwissEngineIntro } from './tutorial/SwissEngineIntro';
import { TimeRange } from './tutorial/TimeRange';
import { ToggleFeatures } from './tutorial/ToggleFeatures';
import { MoonPlanning } from './tutorial/MoonPlanning';
import { BirthChart } from './tutorial/BirthChart';
import { PersonalTransits } from './tutorial/PersonalTransits';
import type { TutorialStep } from '../types/tutorial';
import './tutorial-spotlight.css';
import './tutorial/elite-visuals.css';
import './tutorial/elite-visuals-v2.css';
import './tutorial/elite-visuals-v3.css';
import './tutorial/elite-visuals-new.css';

export const TutorialOverlay: React.FC = () => {
  const tutorialState = useSelector((state: RootState) => state.tutorial);
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const isActive = tutorialState?.isActive || false;

  useEffect(() => {
    console.log('[TutorialOverlay] Component mounted');
    console.log('[TutorialOverlay] Initial Redux state:', tutorialState);
    console.log('[TutorialOverlay] Service state:', tutorialService.getState());
    
    const unsubscribe = tutorialService.subscribe((state) => {
      console.log('[TutorialOverlay] Service subscription callback, new state:', state);
      setCurrentStep(tutorialService.getCurrentStep());
    });
    setCurrentStep(tutorialService.getCurrentStep());
    return unsubscribe;
  }, []);

  // Auto-start onboarding on first visit
  useEffect(() => {
    console.log('[TutorialOverlay] Setting up auto-trigger timer');
    const timer = setTimeout(() => {
      console.log('[TutorialOverlay] Timer fired, calling checkAutoTriggers');
      tutorialService.checkAutoTriggers();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  console.log('[TutorialOverlay] Render - isActive:', isActive, 'currentStep:', currentStep?.id);

  if (!isActive || !currentStep) {
    console.log('[TutorialOverlay] Not rendering - isActive:', isActive, 'hasCurrentStep:', !!currentStep);
    return null;
  }

  // Render based on step type
  switch (currentStep.type) {
    case 'welcome':
      return (
        <>
          <WelcomeModal step={currentStep} />
          <TutorialProgress />
        </>
      );

    case 'celebration':
      return <CelebrationModal step={currentStep} />;

    case 'modal':
      return (
        <>
          <TutorialModal step={currentStep} />
          <TutorialProgress />
        </>
      );

    case 'interactive':
      return (
        <>
          <TutorialSpotlight />
          <TutorialProgress />
        </>
      );

    case 'guided-task':
      return (
        <>
          {/* For guided tasks: use special spotlight that doesn't block calendar */}
          <GuidedTaskSpotlight step={currentStep} />
          <TutorialProgress />
        </>
      );

    default:
      return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const WelcomeModal: React.FC<{ step: TutorialStep }> = ({ step }) => {
  const handleStart = () => tutorialService.nextStep();
  const handleSkip = () => tutorialService.skipTutorial();

  const getIcon = () => {
    switch (step.tone) {
      case 'excited': return '🎉';
      case 'mysterious': return '✨';
      case 'calm': return '🌙';
      default: return '👋';
    }
  };

  return (
    <div className="tutorial-welcome-modal">
      <div className="tutorial-welcome-content">
        <div className="tutorial-welcome-icon">{getIcon()}</div>
        <h2 className="tutorial-welcome-title">{step.title}</h2>
        <p className="tutorial-welcome-text">{step.content}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {step.canSkip !== false && (
            <button className="tutorial-tooltip__skip" onClick={handleSkip} style={{ padding: '14px 24px' }}>
              Skip Tour
            </button>
          )}
          <button className="tutorial-welcome-button" onClick={handleStart}>
            {step.actionLabel || 'Begin'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CelebrationModal: React.FC<{ step: TutorialStep }> = ({ step }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const handleFinish = () => {
    tutorialService.completeTutorial();
  };

  return (
    <div className="tutorial-celebration">
      {showConfetti && <ConfettiAnimation />}
      <div className="tutorial-celebration__content">
        <div className="tutorial-celebration__icon">🎉</div>
        <h2 className="tutorial-celebration__title">{step.title}</h2>
        <p className="tutorial-celebration__text">{step.content}</p>
        <button className="tutorial-welcome-button" onClick={handleFinish}>
          {step.actionLabel || 'Start Exploring'}
        </button>
      </div>
    </div>
  );
};

const TutorialModal: React.FC<{ step: TutorialStep }> = ({ step }) => {
  const handleContinue = () => tutorialService.nextStep();
  const handleBack = () => tutorialService.previousStep();
  const handleSkip = () => tutorialService.skipTutorial();

  const getIcon = () => {
    switch (step.tone) {
      case 'excited': return '🎉';
      case 'mysterious': return '✨';
      case 'calm': return '🌙';
      default: return '💡';
    }
  };

  const renderVisual = () => {
    switch (step.visualComponent) {
      case 'cosmic-flow':
        return <CosmicFlowVisual />;
      case 'calendar-comparison-v2':
        return <CalendarComparisonV2 />;
      case 'new-year-resolutions':
        return <NewYearResolutions />;

      case 'month-structure-v2':
        return <MonthStructureV2 />;
      case 'month-structure-v3':
        return <MonthStructureV3 />;
      case 'saturday-start':
        return <SaturdayStart />;
      case 'hexa-month':
        return <HexaMonth />;
      case 'swiss-engine-intro':
        return <SwissEngineIntro />;
      case 'swiss-engine-v2':
        return <SwissEngineV2 />;
      case 'time-range':
        return <TimeRange />;
      case 'moon-phases-v2':
        return <MoonPhasesV2 />;
      case 'toggle-features':
        return <ToggleFeatures />;
      case 'moon-planning':
        return <MoonPlanning />;
      case 'birth-chart':
        return <BirthChart />;
      case 'personal-transits':
        return <PersonalTransits />;
      case 'stars-hub-v2':
        return <StarsHubV2 />;
      case 'oracle-journal-v3':
        return <OracleJournalV3 />;
      case 'themes-v2':
        return <ThemesV2 />;
      case 'time-modes-v2':
        return <TimeModesV2 />;
      case 'time-modes-demo':
        return <TimeModesDemo />;
      case 'week-symmetry':
        return <WeekSymmetry />;
      case 'year-structure':
        return <YearStructureVisual />;
      case 'sync-vs-true-epic':
        return <SyncVsTrueEpic />;
      case 'civil-vs-natural':
        return <CivilVsNatural />;
      case 'calendar-evolution-visual':
        return <CalendarEvolutionVisual />;
      case 'print-v3':
        return <PrintV3 />;
      case 'routine-visualization':
        return <RoutineVisualization />;
      default:
        return null;
    }
  };

  const hasVisual = !!step.visualComponent;

  return (
    <div className="tutorial-welcome-modal">
      <div className="tutorial-welcome-content" style={{ maxWidth: hasVisual ? '650px' : '520px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{getIcon()}</div>
        <h2 className="tutorial-welcome-title">{step.title}</h2>
        
        {renderVisual()}
        
        {step.content && (
          <div className="tutorial-welcome-text" style={{ textAlign: hasVisual ? 'center' : 'left', whiteSpace: 'pre-line' }}>
            {step.content}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
          {/* Back button - hidden on first step */}
          {tutorialService.getState().currentStepIndex > 0 && (
            <button className="tutorial-back-button" onClick={handleBack}>
              ← Back
            </button>
          )}
          
          <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
            {step.canSkip !== false && (
              <button className="tutorial-tooltip__skip" onClick={handleSkip}>
                Skip
              </button>
            )}
            <button className="tutorial-welcome-button" onClick={handleContinue}>
              {step.actionLabel || 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfettiAnimation: React.FC = () => {
  return (
    <div className="confetti-container">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            backgroundColor: ['#c9a227', '#ec4899', '#3b82f6', '#22c55e', '#8b5cf6'][Math.floor(Math.random() * 5)],
          }}
        />
      ))}
    </div>
  );
};

const TutorialProgress: React.FC = () => {
  const currentTutorial = tutorialService.getCurrentTutorial();
  const currentStepIndex = tutorialService.getState().currentStepIndex;
  
  if (!currentTutorial) return null;

  const totalSteps = currentTutorial.steps.length;
  const progress = (currentStepIndex / totalSteps) * 100;

  return (
    <div className="tutorial-progress">
      <div className="tutorial-progress__bar">
        <div className="tutorial-progress__fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="tutorial-progress__text">
        {currentStepIndex + 1} / {totalSteps}
      </span>
    </div>
  );
};

export default TutorialOverlay;
