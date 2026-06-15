/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTERACTIVE TUTORIAL v3 — Cinematic story, not a walkthrough.
 * Step 1: CinematicWelcome (existing, beloved)
 * Steps 2-8: CinematicStory (the HEKA narrative)
 * Then release the user to explore.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useMemo } from 'react';
import { CinematicWelcome } from './CinematicWelcome';
import { CinematicStory } from './CinematicStory';
import { getWizardStrings } from '../../../data/wizardStrings';
import { eventBus } from '../../../services/eventBus';
import { aiConfigService } from '../../../services/aiConfigService';
import './tutorialV3.css';

interface InteractiveTutorialProps {
  onComplete: () => void;
  language: string;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({ onComplete, language }) => {
  console.log('[HEKA] InteractiveTutorial MOUNT');
  const [step, setStep] = useState<'welcome' | 'story' | 'done'>('welcome');

  const strings = useMemo(() => getWizardStrings(language), [language]);

  const handleBegin = useCallback(() => {
    setStep('story');
  }, []);

  const handleSkipWelcome = useCallback(() => {
    emitTutorialComplete();
    onComplete();
  }, [onComplete]);

  const handleStoryComplete = useCallback(() => {
    setStep('done');
    emitTutorialComplete();
    onComplete();
  }, [onComplete]);

  const emitTutorialComplete = useCallback(() => {
    const config = aiConfigService.getConfig();
    const aiEnabled = config.globalEnabled && config.provider !== 'template';
    eventBus.emit('heka-tutorial-complete', { aiEnabled });
  }, []);

  if (step === 'welcome') {
    return (
      <CinematicWelcome
        onBegin={handleBegin}
        onSkip={handleSkipWelcome}
        strings={strings}
      />
    );
  }

  if (step === 'story') {
    return (
      <CinematicStory
        onComplete={handleStoryComplete}
        strings={strings}
      />
    );
  }

  return null;
};

export default InteractiveTutorial;
