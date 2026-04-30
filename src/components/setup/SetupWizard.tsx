/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SETUP WIZARD — First-boot experience
 * Unskippable. Runs before tutorial. Enterprise-grade.
 *
 * Accessibility: focus trap, scroll lock, aria-live announcements,
 * reduced-motion support, keyboard navigation.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { setLanguage, completeSetup, persistSetupState } from '../../store/setupSlice';
import { getWizardStrings } from '../../data/languages';
import { LanguageSelector } from './LanguageSelector';
import { ModeSelector } from './ModeSelector';
import { PermissionsSelector } from './PermissionsSelector';
import { AISelector } from './AISelector';
import { useFocusTrap } from './useFocusTrap';
import { useScrollLock } from './useScrollLock';
import { StarfieldBackground } from './StarfieldBackground';
import '../../styles/setup-wizard.css';

export type SetupStep = 'language' | 'mode' | 'permissions' | 'ai' | 'complete';

const STEPS: SetupStep[] = ['language', 'mode', 'permissions', 'ai', 'complete'];

const STEP_TITLES: Record<SetupStep, string> = {
  language: 'Language',
  mode: 'Calendar Mode',
  permissions: 'Permissions',
  ai: 'HEKA AI',
  complete: 'Ready',
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
      announcer.textContent = `Step ${currentStepIndex + 1} of ${totalSteps}: ${STEP_TITLES[currentStep]}`;
    }
  }, [currentStepIndex, currentStep, totalSteps]);

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

  const handleLanguageSelect = useCallback((langCode: string) => {
    dispatch(setLanguage(langCode));
  }, [dispatch]);

  const strings = useMemo(() => {
    return getWizardStrings(setup.language);
  }, [setup.language]);

  const renderStep = () => {
    switch (currentStep) {
      case 'language':
        return (
          <LanguageSelector
            selectedLanguage={setup.language}
            onSelect={handleLanguageSelect}
            onNext={goNext}
          />
        );
      case 'mode':
        return (
          <ModeSelector
            initialMode={setup.timeMode}
            onNext={goNext}
            onBack={goBack}
            strings={strings}
          />
        );
      case 'permissions':
        return (
          <PermissionsSelector
            initialLocation={setup.locationEnabled}
            initialNotifications={setup.notificationsEnabled}
            onNext={goNext}
            onBack={goBack}
            strings={strings}
          />
        );
      case 'ai':
        return (
          <AISelector
            initialProvider={setup.aiProvider}
            initialModel={setup.aiModel}
            initialConfigured={setup.aiApiKeyConfigured}
            onNext={goNext}
            onBack={goBack}
            strings={strings}
          />
        );
      case 'complete':
        return <CompleteStep onEnter={handleComplete} language={setup.language} />;
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
      <div className="setup-wizard">
        {/* Progress bar */}
        <div className="setup-wizard__progress-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Setup progress">
          <div
            className="setup-wizard__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="setup-wizard__step-indicator" aria-hidden="true">
          <span className="setup-wizard__step-current">{currentStepIndex + 1}</span>
          <span className="setup-wizard__step-divider">/</span>
          <span className="setup-wizard__step-total">{totalSteps}</span>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className={`setup-wizard__content ${isAnimating ? `slide-${direction}` : ''}`}
          key={currentStep}
          tabIndex={-1}
        >
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

const CompleteStep: React.FC<{ onEnter: () => void; language: string }> = ({ onEnter, language }) => {
  const strings = useMemo(() => {
    const map: Record<string, { ready: string; enter: string }> = {
      en: { ready: 'You are ready.', enter: 'Enter HEKA' },
      es: { ready: 'Estás listo.', enter: 'Entrar a HEKA' },
      fr: { ready: 'Vous êtes prêt.', enter: 'Entrer dans HEKA' },
      de: { ready: 'Du bist bereit.', enter: 'HEKA betreten' },
      it: { ready: 'Sei pronto.', enter: 'Entra in HEKA' },
      pt: { ready: 'Você está pronto.', enter: 'Entrar no HEKA' },
      zh: { ready: '您已准备就绪。', enter: '进入 HEKA' },
      ja: { ready: '準備ができました。', enter: 'HEKA に入る' },
      ko: { ready: '준비가 되었습니다.', enter: 'HEKA 입장' },
      ar: { ready: 'أنت جاهز.', enter: 'دخول HEKA' },
      hi: { ready: 'आप तैयार हैं।', enter: 'HEKA में प्रवेश करें' },
      ru: { ready: 'Вы готовы.', enter: 'Войти в HEKA' },
      tr: { ready: 'Hazırsınız.', enter: "HEKA'ya Gir" },
      pl: { ready: 'Jesteś gotowy.', enter: 'Wejdź do HEKA' },
      nl: { ready: 'Je bent klaar.', enter: 'Ga HEKA binnen' },
      sv: { ready: 'Du är redo.', enter: 'Gå in i HEKA' },
      el: { ready: 'Είστε έτοιμοι.', enter: 'Είσοδος στο HEKA' },
      he: { ready: 'אתה מוכן.', enter: 'היכנס ל-HEKA' },
      th: { ready: 'คุณพร้อมแล้ว', enter: 'เข้าสู่ HEKA' },
      vi: { ready: 'Bạn đã sẵn sàng.', enter: 'Vào HEKA' },
      id: { ready: 'Anda siap.', enter: 'Masuk ke HEKA' },
      uk: { ready: 'Ви готові.', enter: 'Увійти в HEKA' },
      ro: { ready: 'Ești pregătit.', enter: 'Intră în HEKA' },
      cs: { ready: 'Jste připraveni.', enter: 'Vstupte do HEKA' },
      hu: { ready: 'Készen áll.', enter: 'Belépés a HEKA-ba' },
      da: { ready: 'Du er klar.', enter: 'Gå ind i HEKA' },
      fi: { ready: 'Olet valmis.', enter: 'Siirry HEKAan' },
      no: { ready: 'Du er klar.', enter: 'Gå inn i HEKA' },
      sk: { ready: 'Ste pripravení.', enter: 'Vstúpiť do HEKA' },
      bg: { ready: 'Готови сте.', enter: 'Влезте в HEKA' },
    };
    return map[language] || map.en;
  }, [language]);

  return (
    <div className="setup-step setup-step--complete" tabIndex={-1}>
      <div className="setup-step__glow-icon" aria-hidden="true">
        <span>✦</span>
      </div>
      <h2 className="setup-step__title" tabIndex={-1}>{strings.ready}</h2>
      <p className="setup-step__subtitle">The calendar is yours. The sky is yours.</p>
      <button className="setup-btn setup-btn--primary setup-btn--large" onClick={onEnter} autoFocus>
        {strings.enter}
      </button>
    </div>
  );
};
