// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import {
  setTheme,
  setFont,
  setHeaderGeometry,
  setBackgroundGeometry,
  setLocation,
  setSubRegion,
  toggleTimeMode,
  setTimeMode,
  syncToLocalToday,
} from '../src/store/slices/reducers/settingsReducers';

vi.mock('../src/services/calendarService', () => ({
  getTodayHekaDate: vi.fn(() => ({ year: 2024, month: 5, day: 15 })),
  getTodayHekaDateInTimezone: vi.fn((tz) => ({ year: 2024, month: 5, day: 15, _tz: tz })),
}));

function createSettingsState(overrides = {}) {
  return {
    theme: 'dark-gold',
    font: 'default',
    headerGeometry: 'none',
    backgroundGeometry: 'none',
    location: 'US',
    subRegion: null,
    timeMode: 'SYNC',
    viewDate: { year: 2024, month: 3, day: 1 },
    selectedDate: { year: 2024, month: 3, day: 10 },
    ...overrides,
  };
}

describe('settingsReducers', () => {
  it('setTheme changes theme', () => {
    const state = createSettingsState();
    setTheme(state, { payload: 'midnight-blue' });
    expect(state.theme).toBe('midnight-blue');
  });

  it('setFont changes font', () => {
    const state = createSettingsState();
    setFont(state, { payload: 'serif' });
    expect(state.font).toBe('serif');
  });

  it('setHeaderGeometry changes geometry', () => {
    const state = createSettingsState();
    setHeaderGeometry(state, { payload: 'sacred-geometry' });
    expect(state.headerGeometry).toBe('sacred-geometry');
  });

  it('setBackgroundGeometry changes background', () => {
    const state = createSettingsState();
    setBackgroundGeometry(state, { payload: 'constellation' });
    expect(state.backgroundGeometry).toBe('constellation');
  });

  it('setLocation changes location and clears subRegion', () => {
    const state = createSettingsState({ subRegion: 'CA' });
    setLocation(state, { payload: 'GB' });
    expect(state.location).toBe('GB');
    expect(state.subRegion).toBeNull();
  });

  it('setSubRegion sets subRegion', () => {
    const state = createSettingsState();
    setSubRegion(state, { payload: 'CA' });
    expect(state.subRegion).toBe('CA');
    setSubRegion(state, { payload: null });
    expect(state.subRegion).toBeNull();
  });

  it('toggleTimeMode switches SYNC to TRUE', () => {
    const state = createSettingsState({ timeMode: 'SYNC' });
    toggleTimeMode(state);
    expect(state.timeMode).toBe('TRUE');
  });

  it('toggleTimeMode switches TRUE to SYNC', () => {
    const state = createSettingsState({ timeMode: 'TRUE' });
    toggleTimeMode(state);
    expect(state.timeMode).toBe('SYNC');
  });

  it('setTimeMode sets explicit mode', () => {
    const state = createSettingsState();
    setTimeMode(state, { payload: 'TRUE' });
    expect(state.timeMode).toBe('TRUE');
  });

  it('syncToLocalToday sets viewDate to today', () => {
    const state = createSettingsState();
    syncToLocalToday(state);
    expect(state.viewDate).toEqual({ year: 2024, month: 5, day: 15 });
    expect(state.selectedDate).toBeNull();
  });
});
