/**
 * Tutorial Overlay — Entry Point
 * Delegates to the Celestial Awakening onboarding experience.
 */

import React from 'react';
import { CelestialOnboarding } from './tutorial/CelestialOnboarding';

export const TutorialOverlay: React.FC = () => {
  return <CelestialOnboarding />;
};

export default TutorialOverlay;
