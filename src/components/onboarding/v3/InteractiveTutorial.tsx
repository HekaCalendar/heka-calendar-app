/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTERACTIVE TUTORIAL v3 — Cinematic story, not a walkthrough.
 * Step 1: CinematicWelcome (existing, beloved)
 * Steps 2-8: CinematicStory (the HEKA narrative)
 * Then release the user to explore.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';
import { CinematicWelcome } from './CinematicWelcome';
import { CinematicStory } from './CinematicStory';
import './tutorialV3.css';

interface InteractiveTutorialProps {
  onComplete: () => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({ onComplete }) => {
  console.log('[HEKA] InteractiveTutorial MOUNT');
  const [step, setStep] = useState<'welcome' | 'story' | 'done'>('welcome');

  const handleBegin = useCallback(() => {
    setStep('story');
  }, []);

  const handleSkipWelcome = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleStoryComplete = useCallback(() => {
    setStep('done');
    onComplete();
  }, [onComplete]);

  if (step === 'welcome') {
    return (
      <CinematicWelcome
        onBegin={handleBegin}
        onSkip={handleSkipWelcome}
      />
    );
  }

  if (step === 'story') {
    return (
      <CinematicStory
        onComplete={handleStoryComplete}
      />
    );
  }

  return null;
};

export default InteractiveTutorial;
