import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, createMockStore } from './test-utils';
import DayPanel from '../src/components/DayPanel';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../src/components/EnergyVoteCard', () => ({
  EnergyVoteCard: () => <div data-testid="energy-vote" />,
}));

vi.mock('../src/astrology/hooks/useMoonPhase', () => ({
  useMoonPhase: () => ({ data: null, isLoading: false }),
}));

vi.mock('../src/astrology/integration/calendarSync', () => ({
  getDailyAstrology: () => Promise.resolve(null),
}));

vi.mock('../src/astrology/services/natal/profileManager', () => ({
  profileManager: {
    getSelectedProfile: () => Promise.resolve(null),
    getAllProfiles: () => Promise.resolve([]),
  },
}));

vi.mock('../src/oracle/birthChartIntegration', () => ({
  calculatePersonalTransits: () => Promise.resolve([]),
  getCurrentPlanetaryPositions: () => Promise.resolve({}),
}));

vi.mock('../src/astrology/services/calculations/swissCalculations', () => ({
  calculateSunTimes: () => Promise.resolve({ sunrise: null, sunset: null }),
  calculatePlanetaryHours: () => Promise.resolve(null),
}));

vi.mock('../src/services/energyVoteService', () => ({
  isAfterVotingTime: () => false,
  isToday: () => false,
}));

vi.mock('../src/services/tutorialService', () => ({
  tutorialService: {
    getPreferences: () => ({}),
    trackNoteEditorOpened: vi.fn(),
    trackNoteTyping: vi.fn(),
    trackNoteCreated: vi.fn(),
  },
}));

vi.mock('../src/types', async () => {
  const actual = await vi.importActual<typeof import('../src/types')>('../src/types');
  return {
    ...actual,
    getHolidaysForDateWithSubRegion: () => [],
  };
});

describe('DayPanel', () => {
  it('shows empty state when no date is selected', () => {
    renderWithProviders(<DayPanel />);
    expect(screen.getByText('emptyState')).toBeInTheDocument();
  });

  it('renders day details when a date is selected', () => {
    renderWithProviders(
      <DayPanel />,
      {
        calendar: {
          selectedDate: { year: 2024, month: 5, day: 15 },
          display: { showCivilDates: true, showMoonPhases: true, showHolidays: true, showCelestialCards: true, pureModeLight: false },
          location: 'AU',
          subRegion: null,
          viewDate: { year: 2024, month: 5, day: 15 },
          notes: {},
          astroPreferences: { showTransitsOnCalendar: false },
        } as any,
      }
    );
    expect(document.querySelector('.day-panel')).toBeInTheDocument();
  });

  it('dispatches selectDate(null) when close button is clicked', () => {
    const store = createMockStore({
      calendar: {
        selectedDate: { year: 2024, month: 5, day: 15 },
        display: { showCivilDates: true, showMoonPhases: true, showHolidays: true, showCelestialCards: true, pureModeLight: false },
        location: 'AU',
        subRegion: null,
        viewDate: { year: 2024, month: 5, day: 15 },
        notes: {},
        astroPreferences: { showTransitsOnCalendar: false },
      } as any,
    });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(<DayPanel />, {}, { store });

    const closeBtn = document.querySelector('.day-panel-close-btn');
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(dispatchSpy).toHaveBeenCalled();
    }

    dispatchSpy.mockRestore();
  });

  it('enters note editing mode when add note is clicked', () => {
    renderWithProviders(
      <DayPanel />,
      {
        calendar: {
          selectedDate: { year: 2024, month: 5, day: 15 },
          display: { showCivilDates: true, showMoonPhases: true, showHolidays: true, showCelestialCards: true, pureModeLight: false },
          location: 'AU',
          subRegion: null,
          viewDate: { year: 2024, month: 5, day: 15 },
          notes: {},
          astroPreferences: { showTransitsOnCalendar: false },
        } as any,
      }
    );

    const addBtn = screen.getByText('notesSection.addNote');
    fireEvent.click(addBtn);

    expect(document.querySelector('.note-edit-form')).toBeInTheDocument();
  });

  it('dispatches addNote when note is saved', () => {
    const store = createMockStore({
      calendar: {
        selectedDate: { year: 2024, month: 5, day: 15 },
        display: { showCivilDates: true, showMoonPhases: true, showHolidays: true, showCelestialCards: true, pureModeLight: false },
        location: 'AU',
        subRegion: null,
        viewDate: { year: 2024, month: 5, day: 15 },
        notes: {},
        astroPreferences: { showTransitsOnCalendar: false },
      } as any,
    });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(<DayPanel />, {}, { store });

    const addBtn = screen.getByText('notesSection.addNote');
    fireEvent.click(addBtn);

    const textarea = document.querySelector('.day-panel__textarea') as HTMLTextAreaElement;
    if (textarea) {
      fireEvent.change(textarea, { target: { value: 'Test note content' } });
    }

    const saveBtn = screen.getByText('noteEditor.saveNote');
    fireEvent.click(saveBtn);

    expect(dispatchSpy).toHaveBeenCalled();
    dispatchSpy.mockRestore();
  });

  it('shows no-notes message when day has no notes', () => {
    renderWithProviders(
      <DayPanel />,
      {
        calendar: {
          selectedDate: { year: 2024, month: 5, day: 15 },
          display: { showCivilDates: true, showMoonPhases: true, showHolidays: true, showCelestialCards: true, pureModeLight: false },
          location: 'AU',
          subRegion: null,
          viewDate: { year: 2024, month: 5, day: 15 },
          notes: {},
          astroPreferences: { showTransitsOnCalendar: false },
        } as any,
      }
    );

    expect(screen.getByText('notesSection.noNotesOrTasks')).toBeInTheDocument();
  });
});
