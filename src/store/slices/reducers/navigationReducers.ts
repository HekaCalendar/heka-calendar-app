/**
 * Navigation & UI Reducers
 * View switching, date navigation, display toggles, modal state, print mode
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { CalendarState, HekaDate } from '../../../types';
import { getTodayHekaDate } from '../../../services/calendarService';

export const navigateToMonth = (state: CalendarState, action: PayloadAction<{ year: number; month: number }>) => {
  state.viewDate = {
    year: action.payload.year,
    month: action.payload.month as HekaDate['month'],
    day: 1,
  };
};

export const navigateToToday = (state: CalendarState) => {
  const today = getTodayHekaDate();
  state.viewDate = today;
  state.selectedDate = today;
};

export const prevMonth = (state: CalendarState) => {
  if (state.viewDate.month === 0) {
    state.viewDate.month = 12;
    state.viewDate.year -= 1;
  } else {
    state.viewDate.month = (state.viewDate.month - 1) as HekaDate['month'];
  }
};

export const nextMonth = (state: CalendarState) => {
  if (state.viewDate.month === 12) {
    state.viewDate.month = 0;
    state.viewDate.year += 1;
  } else {
    state.viewDate.month = (state.viewDate.month + 1) as HekaDate['month'];
  }
};

export const navigateToPrevYear = (state: CalendarState) => {
  state.viewDate.year -= 1;
};

export const navigateToNextYear = (state: CalendarState) => {
  state.viewDate.year += 1;
};

export const selectDate = (state: CalendarState, action: PayloadAction<HekaDate | null>) => {
  state.selectedDate = action.payload;
};

export const toggleDisplay = (state: CalendarState, action: PayloadAction<keyof CalendarState['display']>) => {
  const key = action.payload;
  state.display[key] = !state.display[key];
};

export const setDisplay = (state: CalendarState, action: PayloadAction<Partial<CalendarState['display']>>) => {
  state.display = { ...state.display, ...action.payload };
};

export const setView = (state: CalendarState, action: PayloadAction<CalendarState['currentView']>) => {
  state.currentView = action.payload;
};

export const openModal = (state: CalendarState, action: PayloadAction<keyof CalendarState['ui']>) => {
  const key = action.payload;
  if (key.startsWith('is') && key.endsWith('Open')) {
    (state.ui as any)[key] = true;
  }
};

export const closeModal = (state: CalendarState, action: PayloadAction<keyof CalendarState['ui']>) => {
  const key = action.payload;
  if (key.startsWith('is') && key.endsWith('Open')) {
    (state.ui as any)[key] = false;
  }
};

export const setError = (state: CalendarState, action: PayloadAction<string | null>) => {
  state.ui.error = action.payload;
};

export const setLoading = (state: CalendarState, action: PayloadAction<boolean>) => {
  state.ui.isLoading = action.payload;
};

export const setPrintMode = (_state: CalendarState, _action: PayloadAction<import('../../../types').PrintMode>) => {
  // Print mode state is now handled by router sync layer
  // This reducer is kept for backward compatibility but no longer mutates currentView
};
