import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { PremiumCards } from '../src/astrology/components/cosmic/PremiumCards';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.returnObjects) {
        // Return plausible arrays for keys that need them
        if (key.includes('favors')) return ['Favor 1', 'Favor 2', 'Favor 3'];
        if (key.includes('warnings')) return ['Warning 1', 'Warning 2'];
        if (key.includes('.do')) return ['Do 1', 'Do 2', 'Do 3'];
        if (key.includes('.dont')) return ['Dont 1', 'Dont 2'];
        if (key.includes('.activities')) return ['Activity 1', 'Activity 2'];
        return [];
      }
      // Return translated text for moonOracle and planetaryGuidance keys
      if (key === 'moonOracle.First Quarter.title') return 'The Crossroads';
      if (key === 'moonOracle.First Quarter.poem') return 'Half-illuminated, half in shadow.';
      if (key === 'planetaryGuidance.sun.description') return 'The Sun hour radiates vitality and leadership.';
      return key;
    },
    i18n: { language: 'en' },
  }),
}));

const baseProps = {
  currentTime: new Date('2025-06-15T12:00:00Z'),
  julianDay: 2460000,
  positions: {
    sun: { id: 'sun', longitude: 85, latitude: 0, distance: 1, speed: 1, isRetrograde: false, sign: 'gemini', degreeInSign: 25 },
    moon: { id: 'moon', longitude: 120, latitude: 0, distance: 1, speed: 1, isRetrograde: false, sign: 'leo', degreeInSign: 0 },
  } as any,
  moonPhase: {
    phase: 0.25,
    name: 'First Quarter',
    illumination: 50,
    angle: 90,
    isWaxing: true,
    emoji: '🌓',
  },
  planetaryHour: {
    planet: 'sun',
    symbol: '☉',
    activities: ['Leadership', 'Visibility'],
  },
  retrogrades: [],
  localHouses: null,
};

describe('PremiumCards', () => {
  it('expands Luna card on click when moonPhase data is present', () => {
    renderWithProviders(<PremiumCards {...baseProps} />);
    const luna = screen.getByText('FIRST QUARTER').closest('.premium-card');
    expect(luna).toBeInTheDocument();
    fireEvent.click(luna!);
    expect(screen.getByText('The Crossroads')).toBeInTheDocument();
  });

  it('collapses Luna card when clicked again', () => {
    renderWithProviders(<PremiumCards {...baseProps} />);
    const luna = screen.getByText('FIRST QUARTER').closest('.premium-card');
    fireEvent.click(luna!);
    expect(screen.getByText('The Crossroads')).toBeInTheDocument();
    fireEvent.click(luna!);
    expect(screen.queryByText('The Crossroads')).not.toBeInTheDocument();
  });

  it('expands Kronos card on click when planetaryHour data is present', () => {
    renderWithProviders(<PremiumCards {...baseProps} />);
    const kronos = screen.getByText('SUN').closest('.premium-card');
    expect(kronos).toBeInTheDocument();
    fireEvent.click(kronos!);
    expect(screen.getByText('The Sun hour radiates vitality and leadership.')).toBeInTheDocument();
  });

  it('collapses Kronos card via close button', () => {
    renderWithProviders(<PremiumCards {...baseProps} />);
    const kronos = screen.getByText('SUN').closest('.premium-card');
    fireEvent.click(kronos!);
    expect(screen.getByText('The Sun hour radiates vitality and leadership.')).toBeInTheDocument();
    const closeBtn = screen.getByLabelText('close');
    fireEvent.click(closeBtn);
    expect(screen.queryByText('The Sun hour radiates vitality and leadership.')).not.toBeInTheDocument();
  });

  it('Luna loading state is clickable (regression: missing onToggle)', () => {
    renderWithProviders(<PremiumCards {...baseProps} moonPhase={null} />);
    const lunaLoading = screen.getByText('premiumCards.calculatingLunar').closest('.premium-card');
    expect(lunaLoading).toBeInTheDocument();
    expect(() => fireEvent.click(lunaLoading!)).not.toThrow();
  });

  it('Kronos loading state is clickable (regression: missing onToggle)', () => {
    renderWithProviders(<PremiumCards {...baseProps} planetaryHour={null} />);
    const kronosLoading = screen.getByText('premiumCards.calculatingPlanetary').closest('.premium-card');
    expect(kronosLoading).toBeInTheDocument();
    expect(() => fireEvent.click(kronosLoading!)).not.toThrow();
  });
});
