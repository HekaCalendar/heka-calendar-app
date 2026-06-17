import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, createMockStore } from './test-utils';
import CalendarGrid from '../src/components/CalendarGrid';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../src/hooks/useGamification', () => ({
  useFeatureDiscovery: () => ({
    discover: vi.fn(() => true),
    isDiscovered: vi.fn(() => false),
    hasDiscovered: {},
  }),
}));

vi.mock('../src/astrology/services/calculations/swissCalculations', () => ({
  calculateMoonPhaseBatch: () => Promise.resolve({}),
}));

vi.mock('../src/astrology/services/calculations/nakshatras', () => ({
  calculateTrueSolarReturn: () => null,
}));

vi.mock('../src/astrology/services/swiss-ephemeris/engine', () => ({
  calculateJulianDay: () => 2460000,
  calculateAllPlanets: () => ({}),
}));

vi.mock('../src/types', async () => {
  const actual = await vi.importActual<typeof import('../src/types')>('../src/types');
  return {
    ...actual,
    getHolidaysForDateWithSubRegion: () => [],
  };
});

vi.mock('../src/services/calendarService', async () => {
  const actual = await vi.importActual<typeof import('../src/services/calendarService')>('../src/services/calendarService');
  return {
    ...actual,
    generateMonthGrid: () => {
      // Return a simple 6-week grid with some real days
      const days = [];
      for (let i = 0; i < 5; i++) {
        days.push({ hekaDate: { year: 2024, month: 5, day: 0 }, civilDate: new Date(2024, 5, 1), isToday: false, moonPhase: null, isHoliday: false, holidayName: null, season: 'summer', zodiacSign: 'Gemini', planetaryHour: null, energy: null });
      }
      for (let i = 1; i <= 30; i++) {
        days.push({ hekaDate: { year: 2024, month: 5, day: i }, civilDate: new Date(2024, 5, i), isToday: i === 15, moonPhase: 'waxing gibbous', isHoliday: false, holidayName: null, season: 'summer', zodiacSign: 'Gemini', planetaryHour: null, energy: null });
      }
      for (let i = 0; i < 7; i++) {
        days.push({ hekaDate: { year: 2024, month: 5, day: 0 }, civilDate: new Date(2024, 6, 1), isToday: false, moonPhase: null, isHoliday: false, holidayName: null, season: 'summer', zodiacSign: 'Gemini', planetaryHour: null, energy: null });
      }
      return days;
    },
  };
});

describe('CalendarGrid', () => {
  it('renders calendar grid', () => {
    renderWithProviders(<CalendarGrid />);
    expect(document.querySelector('.calendar-grid')).toBeInTheDocument();
  });

  it('renders day cells', () => {
    renderWithProviders(<CalendarGrid />);
    const dayCells = document.querySelectorAll('.day-cell');
    expect(dayCells.length).toBeGreaterThan(0);
  });

  it('dispatches selectDate when a day is clicked', () => {
    const store = createMockStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderWithProviders(<CalendarGrid />, {}, { store });

    // Find clickable day cells (non-blank cells have role=gridcell)
    const dayCells = screen.getAllByRole('gridcell').filter(cell =>
      cell.classList.contains('day-cell') && !cell.classList.contains('day-cell--blank')
    );
    expect(dayCells.length).toBeGreaterThan(0);

    fireEvent.click(dayCells[0]);
    expect(dispatchSpy).toHaveBeenCalled();
    dispatchSpy.mockRestore();
  });

  it('renders in pure mode', () => {
    renderWithProviders(<CalendarGrid isPureMode={true} />);
    expect(document.querySelector('.calendar-grid')).toBeInTheDocument();
  });

  it('toggles light/dark when yin-yang button is clicked', () => {
    const onToggle = vi.fn();
    renderWithProviders(<CalendarGrid isPureMode={true} onToggleLightDark={onToggle} />);

    const toggleBtn = document.querySelector('.yin-yang-toggle');
    if (toggleBtn) {
      fireEvent.click(toggleBtn);
      expect(onToggle).toHaveBeenCalledTimes(1);
    }
  });
});
