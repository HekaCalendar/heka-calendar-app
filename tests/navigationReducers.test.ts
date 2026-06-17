// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import {
  navigateToMonth,
  navigateToToday,
  prevMonth,
  nextMonth,
  navigateToPrevYear,
  navigateToNextYear,
  selectDate,
  toggleDisplay,
  setDisplay,
  setView,
  openModal,
  closeModal,
  setError,
  setLoading,
  setPrintMode,
} from '../src/store/slices/reducers/navigationReducers';

vi.mock('../src/services/calendarService', () => ({
  getTodayHekaDate: vi.fn(() => ({ year: 2024, month: 5, day: 15 })),
}));

function createNavState(overrides = {}) {
  return {
    viewDate: { year: 2024, month: 5, day: 1 },
    selectedDate: null,
    currentView: 'calendar',
    display: { showMoonPhases: true, showTransitsOnCalendar: false, showCelestialCards: true },
    ui: { isLoading: false, error: null, isSettingsOpen: false, isDayPanelOpen: false },
    ...overrides,
  };
}

describe('navigationReducers', () => {
  it('navigateToMonth sets viewDate', () => {
    const state = createNavState();
    navigateToMonth(state, { payload: { year: 2025, month: 0 } });
    expect(state.viewDate).toEqual({ year: 2025, month: 0, day: 1 });
  });

  it('navigateToToday sets view and selected to today', () => {
    const state = createNavState();
    navigateToToday(state);
    expect(state.viewDate).toEqual({ year: 2024, month: 5, day: 15 });
    expect(state.selectedDate).toEqual({ year: 2024, month: 5, day: 15 });
  });

  it('prevMonth decrements within year', () => {
    const state = createNavState({ viewDate: { year: 2024, month: 5, day: 1 } });
    prevMonth(state);
    expect(state.viewDate.month).toBe(4);
    expect(state.viewDate.year).toBe(2024);
  });

  it('prevMonth wraps to previous year from month 0', () => {
    const state = createNavState({ viewDate: { year: 2024, month: 0, day: 1 } });
    prevMonth(state);
    expect(state.viewDate.month).toBe(12);
    expect(state.viewDate.year).toBe(2023);
  });

  it('nextMonth increments within year', () => {
    const state = createNavState({ viewDate: { year: 2024, month: 5, day: 1 } });
    nextMonth(state);
    expect(state.viewDate.month).toBe(6);
    expect(state.viewDate.year).toBe(2024);
  });

  it('nextMonth wraps to next year from month 12', () => {
    const state = createNavState({ viewDate: { year: 2024, month: 12, day: 1 } });
    nextMonth(state);
    expect(state.viewDate.month).toBe(0);
    expect(state.viewDate.year).toBe(2025);
  });

  it('navigateToPrevYear decrements year', () => {
    const state = createNavState({ viewDate: { year: 2024, month: 5, day: 1 } });
    navigateToPrevYear(state);
    expect(state.viewDate.year).toBe(2023);
  });

  it('navigateToNextYear increments year', () => {
    const state = createNavState({ viewDate: { year: 2024, month: 5, day: 1 } });
    navigateToNextYear(state);
    expect(state.viewDate.year).toBe(2025);
  });

  it('selectDate sets selectedDate', () => {
    const state = createNavState();
    selectDate(state, { payload: { year: 2024, month: 3, day: 20 } });
    expect(state.selectedDate).toEqual({ year: 2024, month: 3, day: 20 });
  });

  it('selectDate clears selectedDate with null', () => {
    const state = createNavState({ selectedDate: { year: 2024, month: 3, day: 20 } });
    selectDate(state, { payload: null });
    expect(state.selectedDate).toBeNull();
  });

  it('toggleDisplay flips boolean', () => {
    const state = createNavState({ display: { showMoonPhases: true } });
    toggleDisplay(state, { payload: 'showMoonPhases' });
    expect(state.display.showMoonPhases).toBe(false);
    toggleDisplay(state, { payload: 'showMoonPhases' });
    expect(state.display.showMoonPhases).toBe(true);
  });

  it('setDisplay merges partial display', () => {
    const state = createNavState({ display: { showMoonPhases: true, showTransitsOnCalendar: false } });
    setDisplay(state, { payload: { showTransitsOnCalendar: true } });
    expect(state.display.showMoonPhases).toBe(true);
    expect(state.display.showTransitsOnCalendar).toBe(true);
  });

  it('setView changes current view', () => {
    const state = createNavState();
    setView(state, { payload: 'stars' });
    expect(state.currentView).toBe('stars');
  });

  it('openModal sets modal key to true', () => {
    const state = createNavState({ ui: { isSettingsOpen: false } });
    openModal(state, { payload: 'isSettingsOpen' });
    expect(state.ui.isSettingsOpen).toBe(true);
  });

  it('closeModal sets modal key to false', () => {
    const state = createNavState({ ui: { isSettingsOpen: true } });
    closeModal(state, { payload: 'isSettingsOpen' });
    expect(state.ui.isSettingsOpen).toBe(false);
  });

  it('openModal ignores keys not matching pattern', () => {
    const state = createNavState({ ui: { isSettingsOpen: false } });
    openModal(state, { payload: 'error' });
    expect(state.ui.isSettingsOpen).toBe(false);
  });

  it('setError sets error message', () => {
    const state = createNavState();
    setError(state, { payload: 'Something went wrong' });
    expect(state.ui.error).toBe('Something went wrong');
  });

  it('setLoading toggles loading', () => {
    const state = createNavState();
    setLoading(state, { payload: true });
    expect(state.ui.isLoading).toBe(true);
    setLoading(state, { payload: false });
    expect(state.ui.isLoading).toBe(false);
  });

  it('setPrintMode is a no-op', () => {
    const state = createNavState();
    setPrintMode(state, { payload: 'natal' });
    expect(state.currentView).toBe('calendar');
  });
});
