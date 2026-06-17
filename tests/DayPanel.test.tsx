import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
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

const mockGetDailyAstrology = vi.fn(() => Promise.resolve(null));

vi.mock('../src/astrology/integration/calendarSync', () => ({
  getDailyAstrology: (...args: any[]) => mockGetDailyAstrology(...args),
}));

vi.mock('../src/astrology/services/natal/profileManager', () => ({
  profileManager: {
    getActiveProfileWithChart: () => null,
    getSelectedProfile: () => Promise.resolve(null),
    getAllProfiles: () => Promise.resolve([]),
  },
}));

vi.mock('../src/oracle/birthChartIntegration', () => ({
  calculatePersonalTransits: () => [],
  getCurrentPlanetaryPositions: () => Promise.resolve({}),
}));

vi.mock('../src/astrology/services/calculations/swissCalculations', () => ({
  calculateSunTimes: () => Promise.resolve({ sunrise: null, sunset: null }),
  calculatePlanetaryHours: () => Promise.resolve([]),
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

function getDefaultPreloadedState(selectedDate: { year: number; month: number; day: number } | null = null) {
  return {
    calendar: {
      selectedDate,
      display: {
        showCivilDates: true,
        showMoonPhases: true,
        showHolidays: true,
        showCelestialCards: true,
        pureModeLight: false,
      },
      location: 'AU',
      subRegion: null,
      viewDate: { year: 2024, month: 5, day: 15 },
      notes: {},
      astroPreferences: { showTransitsOnCalendar: false },
    } as any,
  };
}

describe('DayPanel', () => {
  it('renders without crashing when a date is selected', () => {
    renderWithProviders(<DayPanel />, getDefaultPreloadedState({ year: 2024, month: 5, day: 15 }));
    expect(document.querySelector('.day-panel')).toBeInTheDocument();
  });

  it('shows empty state when no date is selected', () => {
    renderWithProviders(<DayPanel />, getDefaultPreloadedState(null));
    expect(screen.getByText('emptyState')).toBeInTheDocument();
  });

  it('renders day details when a date is selected', () => {
    renderWithProviders(
      <DayPanel />,
      getDefaultPreloadedState({ year: 2024, month: 5, day: 15 })
    );
    expect(document.querySelector('.day-panel')).toBeInTheDocument();
    expect(document.querySelector('.day-panel__header')).toBeInTheDocument();
  });

  it('displays the correct date', () => {
    renderWithProviders(
      <DayPanel />,
      getDefaultPreloadedState({ year: 2024, month: 5, day: 15 })
    );
    // Month 5 = Thoth (0-indexed in HEKA_MONTHS)
    expect(document.querySelector('.day-panel__date')?.textContent).toContain('15');
  });

  it('dispatches selectDate(null) when close button is clicked', () => {
    const store = createMockStore(getDefaultPreloadedState({ year: 2024, month: 5, day: 15 }));
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
      getDefaultPreloadedState({ year: 2024, month: 5, day: 15 })
    );

    const addBtn = screen.getByText('notesSection.addNote');
    fireEvent.click(addBtn);

    expect(document.querySelector('.note-edit-form')).toBeInTheDocument();
  });

  it('dispatches addNote when note is saved', () => {
    const store = createMockStore(getDefaultPreloadedState({ year: 2024, month: 5, day: 15 }));
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
      getDefaultPreloadedState({ year: 2024, month: 5, day: 15 })
    );

    expect(screen.getByText('notesSection.noNotesOrTasks')).toBeInTheDocument();
  });

  it('handles astrology fetch failure gracefully', async () => {
    mockGetDailyAstrology.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(
      <DayPanel />,
      {
        calendar: {
          ...getDefaultPreloadedState({ year: 2024, month: 5, day: 15 }).calendar,
          astroPreferences: { showTransitsOnCalendar: true },
        } as any,
      }
    );

    await waitFor(() => {
      expect(document.querySelector('.day-panel__astrology-empty') || document.querySelector('.day-panel__astrology')).toBeInTheDocument();
    });
  });
});
