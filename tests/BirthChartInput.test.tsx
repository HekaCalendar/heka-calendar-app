import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { BirthChartInput } from '../src/astrology/components/natal/BirthChartInput';

const tMock = vi.fn((key: string) => `TR:${key}`);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: tMock,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../src/astrology/components/forms/LocationSearch', () => ({
  LocationSearch: () => <div data-testid="location-search" />,
}));

vi.mock('../src/astrology/services/calculations/swissCalculations', () => ({
  calculateCurrentSky: vi.fn(() => Promise.resolve({
    positions: {
      sun: { id: 'sun', longitude: 0, sign: 'aries', degreeInSign: 0 },
      moon: { id: 'moon', longitude: 0, sign: 'aries', degreeInSign: 0 },
    },
    julianDay: 2450000,
    timestamp: Date.now(),
  })),
  calculateLocalHouses: vi.fn(() => Promise.resolve({
    cusps: Array.from({ length: 13 }, (_, i) => i * 30),
    ascendant: 0,
    mc: 0,
    ic: 180,
    dsc: 180,
  })),
}));

vi.mock('../src/astrology/services/natal/natalChart', () => ({
  saveNatalChart: vi.fn(),
  calculateElementalBalance: vi.fn(() => ({ fire: 1, earth: 1, air: 1, water: 1, ether: 1 })),
  calculateModalityBalance: vi.fn(() => ({ cardinal: 1, fixed: 1, mutable: 1 })),
  getDignity: vi.fn(() => 'neutral'),
}));

vi.mock('../src/astrology/services/natal/profileManager', () => ({
  profileManager: {
    calculateNatalChart: vi.fn(() => Promise.resolve({
      id: 'test-chart',
      name: 'Test',
      birthData: { date: '1998-02-03', time: '12:00', timezone: 'UTC', latitude: 0, longitude: 0, locationName: '' },
      planets: {},
      houses: { cusps: [], ascendant: 0, mc: 0, ic: 180, dsc: 180 },
      ascendant: { id: 'ascendant', longitude: 0, sign: 'aries', degreeInSign: 0 },
      midheaven: { id: 'midheaven', longitude: 0, sign: 'aries', degreeInSign: 0 },
      elements: {},
      modalities: {},
      calculatedAt: new Date(),
      zodiacSystem: '12-sign',
    })),
  },
}));

vi.mock('../src/astrology/services/swiss-ephemeris/engine', () => ({
  birthDateTimeToUTC: vi.fn((date: string, time: string) => new Date(`${date}T${time}Z`)),
}));

vi.mock('../src/astrology/services/natal/zodiacHelpers', () => ({
  getZodiacSystemPreference: vi.fn(() => '12-sign'),
  getSignCountPreference: vi.fn(() => 12),
}));

describe('BirthChartInput timezone i18n regression', () => {
  it('renders timezone options through t() so labels are translated', () => {
    tMock.mockClear();
    const { container } = renderWithProviders(
      <BirthChartInput
        onChartCalculated={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    const select = container.querySelector('select');
    expect(select).toBeInTheDocument();

    // Verify that t() was called with translation keys, not raw city names
    expect(tMock).toHaveBeenCalledWith('timezones.UTC');
    expect(tMock).toHaveBeenCalledWith('timezones.Sydney');
    expect(tMock).toHaveBeenCalledWith('timezones.PT');
  });
});
