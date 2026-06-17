import { safeGetJson, safeSetJson } from '../../../utils/safeStorage';

const TUTORIAL_V3_KEY = 'tutorial-v3';

export interface TutorialV3State {
  completed: boolean;
  completedAt?: string;
}

export function markTutorialV3Completed(): void {
  safeSetJson(TUTORIAL_V3_KEY, {
    completed: true,
    completedAt: new Date().toISOString(),
  });
}

export function isTutorialV3Completed(): boolean {
  return safeGetJson<TutorialV3State>(TUTORIAL_V3_KEY, { completed: false }).completed === true;
}
