/**
 * Tutorial Redux Slice
 * State management for tutorial system
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TutorialState, TutorialProgress } from '../types/tutorial';

const initialState: TutorialState = {
  isActive: false,
  currentTutorial: null,
  currentStepIndex: 0,
  spotlightTarget: null,
  tooltipPosition: null,
  completedTutorials: [],
  progress: [],
  currentHintIndex: 0,
  isWaitingForAction: false,
  lastInteractionAt: null,
  preferences: {
    autoShowTutorials: true,
    showHints: true,
    reducedMotion: false,
    skipOnboarding: false,
    hintDelaySeconds: 8,
  },
};

const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    // Start a tutorial
    startTutorial: (state, action: PayloadAction<string>) => {
      state.isActive = true;
      state.currentTutorial = action.payload;
      state.currentStepIndex = 0;
    },

    // Go to next step
    nextStep: (state) => {
      state.currentStepIndex += 1;
    },

    // Go to specific step
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStepIndex = action.payload;
    },

    // Set spotlight target
    setSpotlightTarget: (state, action: PayloadAction<string | null>) => {
      state.spotlightTarget = action.payload;
    },

    // Set tooltip position
    setTooltipPosition: (state, action: PayloadAction<{ x: number; y: number } | null>) => {
      state.tooltipPosition = action.payload;
    },

    // Complete tutorial
    completeTutorial: (state, action: PayloadAction<string>) => {
      if (!state.completedTutorials.includes(action.payload)) {
        state.completedTutorials.push(action.payload);
      }
      state.isActive = false;
      state.currentTutorial = null;
      state.currentStepIndex = 0;
      state.spotlightTarget = null;
    },

    // Skip tutorial
    skipTutorial: (state) => {
      state.isActive = false;
      state.currentTutorial = null;
      state.currentStepIndex = 0;
      state.spotlightTarget = null;
    },

    // Update progress
    updateProgress: (state, action: PayloadAction<TutorialProgress>) => {
      const index = state.progress.findIndex(p => p.tutorialId === action.payload.tutorialId);
      if (index >= 0) {
        state.progress[index] = action.payload;
      } else {
        state.progress.push(action.payload);
      }
    },

    // Update preferences
    updatePreferences: (state, action: PayloadAction<Partial<TutorialState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    // Reset tutorial state
    resetTutorialState: (state) => {
      state.isActive = false;
      state.currentTutorial = null;
      state.currentStepIndex = 0;
      state.spotlightTarget = null;
    },

    // Reset all progress
    resetAllProgress: () => initialState,

    // Load saved state from tutorial service
    loadTutorialState: (_state, action: PayloadAction<Partial<TutorialState>>) => {
      // Replace entire state with the loaded state
      return { ...initialState, ...action.payload };
    },
  },
});

export const {
  startTutorial,
  nextStep,
  setStep,
  setSpotlightTarget,
  setTooltipPosition,
  completeTutorial,
  skipTutorial,
  updateProgress,
  updatePreferences,
  resetTutorialState,
  resetAllProgress,
  loadTutorialState,
} = tutorialSlice.actions;

export default tutorialSlice.reducer;
