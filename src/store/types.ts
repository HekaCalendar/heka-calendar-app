/**
 * Store Types - Centralized type definitions to avoid circular dependencies
 */

import type { CalendarState } from '../types';
import type { AstrologyState } from '../astrology/store/slice';
import type { DiaryState } from '../oracle/diaryTypes';
import type { TutorialState } from '../types/tutorial';
import type { FriendsState } from './friendsSlice';
import type { PlannerState } from './plannerSlice';
import type { SetupState } from './setupSlice';

// RootState interface - mirrors the actual store structure
// This is defined here to avoid circular imports with slices
export interface RootState {
  calendar: CalendarState;
  astrology: AstrologyState;
  diary: DiaryState;
  tutorial: TutorialState;
  friends: FriendsState;
  planner: PlannerState;
  setup: SetupState;
}
