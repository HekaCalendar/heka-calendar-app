/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SETUP WIZARD — First-boot experience
 * Unskippable. Runs before tutorial. Enterprise-grade.
 *
 * Accessibility: focus trap, scroll lock, aria-live announcements,
 * reduced-motion support, keyboard navigation.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { completeSetup, persistSetupState } from '../../store/setupSlice';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { ModeSelector } from './ModeSelector';
import { PermissionsSelector } from './PermissionsSelector';
import { AISelector } from './AISelector';
import { useFocusTrap } from './useFocusTrap';
import { useScrollLock } from './useScrollLock';
import { StarfieldBackground } from './StarfieldBackground';
import '../../styles/setup-wizard.css';
import '../../styles/setup-wizard-cinematic.css';

export type SetupStep = 'language' | 'mode' | 'permissions' | 'ai' | 'complete';

const STEPS: SetupStep[] = ['language', 'mode', 'permissions', 'ai', 'complete'];

const STEP_TITLE_KEYS: Record<SetupStep, string> = {
  language: 'stepLanguage',
  mode: 'stepMode',
  permissions: 'stepPermissions',
  ai: 'stepIntelligence',
  complete: 'stepReady',
};

export const SetupWizard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const setup = useSelector((state: RootState) => state.setup);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [entering, setEntering] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = 'setup-wizard-title';

  const currentStep = STEPS[currentStepIndex];
  const totalSteps = STEPS.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  // Cinematic entrance
  useEffect(() => {
    const timer = setTimeout(() => setEntering(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const { t } = useTranslation('wizard');

  // Focus trap + scroll lock
  useFocusTrap(true, containerRef);
  useScrollLock(true);

  // Persist on every meaningful change
  useEffect(() => {
    persistSetupState(setup);
  }, [setup]);

  // Announce step changes to screen readers
  useEffect(() => {
    const announcer = document.getElementById('setup-announcer');
    if (announcer) {
      announcer.textContent = t('stepAnnouncement', {
        current: currentStepIndex + 1,
        total: totalSteps,
        title: t(STEP_TITLE_KEYS[currentStep]),
      });
    }
  }, [currentStepIndex, currentStep, totalSteps, t]);

  // Focus step content after transition
  useEffect(() => {
    if (isAnimating) return;
    const timer = setTimeout(() => {
      const heading = contentRef.current?.querySelector('h1, h2');
      if (heading instanceof HTMLElement) heading.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [isAnimating, currentStepIndex]);

  const goNext = useCallback(() => {
    if (currentStepIndex < totalSteps - 1 && !isAnimating) {
      setDirection('forward');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStepIndex((i) => i + 1);
        setIsAnimating(false);
      }, 400);
    }
  }, [currentStepIndex, totalSteps, isAnimating]);

  const goBack = useCallback(() => {
    if (currentStepIndex > 0 && !isAnimating) {
      setDirection('back');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStepIndex((i) => i - 1);
        setIsAnimating(false);
      }, 400);
    }
  }, [currentStepIndex, isAnimating]);

  const handleComplete = useCallback(() => {
    // Persist BEFORE dispatch so the write completes before the component
    // unmounts (App.tsx removes the wizard when isComplete becomes true).
    persistSetupState({ ...setup, isComplete: true, completedAt: new Date().toISOString() });
    dispatch(completeSetup());
  }, [dispatch, setup]);

  const renderStep = () => {
    switch (currentStep) {
      case 'language':
        return (
          <LanguageSelector
            selectedLanguage={setup.language}
          />
        );
      case 'mode':
        return (
          <ModeSelector
            initialMode={setup.timeMode}
          />
        );
      case 'permissions':
        return (
          <PermissionsSelector
            initialLocation={setup.locationEnabled}
            initialNotifications={setup.notificationsEnabled}
          />
        );
      case 'ai':
        return (
          <AISelector
            initialProvider={setup.aiProvider}
            initialModel={setup.aiModel}
            initialConfigured={setup.aiApiKeyConfigured}
          />
        );
      case 'complete':
        return <CompleteStep onEnter={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`setup-wizard-overlay ${entering ? 'setup-wizard-overlay--entering' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      ref={containerRef}
    >
      {/* Screen reader announcer */}
      <div
        id="setup-announcer"
        role="status"
        aria-live="polite"
        className="sr-only"
        style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}
      />

      <StarfieldBackground />

      {/* Progress bar — thin gold line at top */}
      <div className="setup-wizard__progress-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={t('setupProgress')}>
        <div
          className="setup-wizard__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content — full viewport, no container prison */}
      <div
        ref={contentRef}
        className={`setup-wizard__scene ${isAnimating ? `slide-${direction}` : ''}`}
        key={currentStep}
        tabIndex={-1}
      >
        {renderStep()}
      </div>

      {/* Constellation progress dots */}
      <div className="setup-wizard__dots" aria-hidden="true">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`setup-wizard__dot ${i === currentStepIndex ? 'setup-wizard__dot--active' : ''} ${i < currentStepIndex ? 'setup-wizard__dot--completed' : ''}`}
          />
        ))}
      </div>

      {/* Persistent navigation footer */}
      {currentStep !== 'complete' && (
        <div className="setup-wizard__nav">
          {currentStepIndex > 0 && (
            <button
              className="setup-wizard__nav-btn setup-wizard__nav-btn--back"
              onClick={goBack}
              disabled={isAnimating}
              type="button"
            >
              {t('back')}
            </button>
          )}
          {currentStepIndex < totalSteps - 1 && (
            <button
              className="setup-wizard__nav-btn setup-wizard__nav-btn--next"
              onClick={goNext}
              disabled={isAnimating}
              type="button"
            >
              {t('next')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const CompleteStep: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const { t } = useTranslation('wizard');

  return (
    <div className="setup-step setup-step--complete" tabIndex={-1}>
      <div className="sw-ornament" />
      <div className="setup-step__glow-icon" aria-hidden="true">
        <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
          <path d="M24 2L27.5 18.5L44 24L27.5 29.5L24 46L20.5 29.5L4 24L20.5 18.5L24 2Z" fill="#d4af37" />
          <circle cx="24" cy="24" r="8" fill="#05040a" />
          <circle cx="24" cy="24" r="4" fill="#d4af37" />
        </svg>
      </div>
      <h2 className="setup-step__title" tabIndex={-1}>{t('setupComplete')}</h2>
      <p className="setup-step__subtitle">{t('setupCompleteSubtitle')}</p>
      <button
        className="setup-wizard__nav-btn setup-wizard__nav-btn--next"
        style={{ marginTop: 8, padding: '18px 48px', fontSize: 16 }}
        onClick={onEnter}
        autoFocus
      >
        {t('enterHeka')}
      </button>
    </div>
  );
};
