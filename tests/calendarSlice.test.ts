import { describe, it, expect } from 'vitest';
import {
  calendarSlice,
  rehydrateState,
  navigateToMonth,
  navigateToToday,
  selectDate,
  setTheme,
  setLocation,
  toggleDisplay,
  openModal,
  closeModal,
  setAuthenticated,
  addNote,
  unlockAchievement,
} from '../src/store';

const calendarReducer = calendarSlice.reducer;

describe('calendarSlice', () => {
  it('initializes with default state', () => {
    const state = calendarReducer(undefined, { type: '@@INIT' });
    expect(state.currentView).toBe('month');
    expect(state.timeMode).toBe('SYNC');
    expect(state.theme).toBe('egyptian-gold');
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.notes).toEqual({});
  });

  describe('rehydrateState', () => {
    it('merges partial state over existing', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, rehydrateState({ theme: 'dark-forest', location: 'US' }));
      expect(state.theme).toBe('dark-forest');
      expect(state.location).toBe('US');
      expect(state.timeMode).toBe('SYNC'); // unchanged
    });

    it('overwrites nested objects shallowly', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, rehydrateState({ auth: { isAuthenticated: true, userId: 'u1' } as any }));
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.userId).toBe('u1');
    });

    it('rehydrates notes and statistics', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      const notes = { '2024-06-15': [{ id: 'n1', content: 'Hello', category: 'personal', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z' }] };
      state = calendarReducer(state, rehydrateState({ notes } as any));
      expect(state.notes['2024-06-15']).toHaveLength(1);
    });
  });

  describe('navigation reducers (via calendarSlice)', () => {
    it('navigateToMonth sets viewDate', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, navigateToMonth({ year: 2025, month: 3 }));
      expect(state.viewDate.year).toBe(2025);
      expect(state.viewDate.month).toBe(3);
    });

    it('navigateToToday sets viewDate and selectedDate', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, navigateToToday());
      expect(state.viewDate).toBeDefined();
      expect(state.viewDate.year).toBeGreaterThan(2020);
      expect(state.selectedDate).toEqual(state.viewDate);
    });

    it('selectDate sets selectedDate', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, selectDate('2024-06-15'));
      expect(state.selectedDate).toBe('2024-06-15');
    });
  });

  describe('settings reducers (via calendarSlice)', () => {
    it('setTheme changes theme', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, setTheme('ocean-blue'));
      expect(state.theme).toBe('ocean-blue');
    });

    it('setLocation changes location and clears subRegion', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, setLocation('GB'));
      expect(state.location).toBe('GB');
      expect(state.subRegion).toBeNull();
    });

    it('toggleDisplay flips boolean', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      expect(state.display.showCivilDates).toBe(true);
      state = calendarReducer(state, toggleDisplay('showCivilDates'));
      expect(state.display.showCivilDates).toBe(false);
    });
  });

  describe('modal reducers (via calendarSlice)', () => {
    it('openModal sets modal key to true', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, openModal('isSettingsOpen'));
      expect(state.ui.isSettingsOpen).toBe(true);
    });

    it('closeModal sets modal key to false', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, openModal('isSettingsOpen'));
      state = calendarReducer(state, closeModal('isSettingsOpen'));
      expect(state.ui.isSettingsOpen).toBe(false);
    });
  });

  describe('auth reducers (via calendarSlice)', () => {
    it('setAuthenticated sets auth fields', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, setAuthenticated({
        userId: 'u1',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
      }));
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.userId).toBe('u1');
      expect(state.auth.email).toBe('test@example.com');
    });
  });

  describe('content reducers (via calendarSlice)', () => {
    it('addNote creates new day and note', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, addNote({
        key: '2024-06-15',
        content: 'Hello world',
        category: 'personal',
      }));
      expect(Object.keys(state.notes)).toHaveLength(1);
      expect(state.statistics.totalNotes).toBe(1);
      expect(state.statistics.totalWords).toBe(2);
    });
  });

  describe('progress reducers (via calendarSlice)', () => {
    it('unlockAchievement adds achievement', () => {
      let state = calendarReducer(undefined, { type: '@@INIT' });
      state = calendarReducer(state, unlockAchievement({ id: 'a1', name: 'First Note', unlockedAt: 1718400000000 }));
      expect(state.progress.achievements).toHaveLength(1);
      expect(state.progress.achievements[0].id).toBe('a1');
    });
  });

  describe('action type namespacing', () => {
    it('actions have calendar/ prefix', () => {
      expect(rehydrateState.type).toBe('calendar/rehydrateState');
      expect(navigateToMonth.type).toBe('calendar/navigateToMonth');
      expect(setTheme.type).toBe('calendar/setTheme');
    });
  });
});
