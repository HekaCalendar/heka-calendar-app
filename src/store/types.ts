/**
 * Store Types - Centralized type definitions to avoid circular dependencies
 */

import type { DiaryState } from '../oracle/diaryTypes';
import type { TutorialState } from '../types/tutorial';

// RootState interface - mirrors the actual store structure
// This is defined here to avoid circular imports with slices
export interface RootState {
  calendar: any;
  astrology: any;
  diary: DiaryState;
  tutorial: TutorialState;
}
