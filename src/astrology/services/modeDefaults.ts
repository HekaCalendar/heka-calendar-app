/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL MODE DEFAULTS
 * Maps SYNC / TRUE calendar modes to their corresponding astrology configurations.
 * 
 * SYNC  = The Bridge — tropical zodiac, Western houses, familiar language
 * TRUE  = The Deep Current — sidereal zodiac, whole-sign houses, Nakshatras
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { TimeMode } from '../../types';
import type { ProfilePreferences } from '../types';

export const MODE_CELESTIAL_DEFAULTS: Record<TimeMode, ProfilePreferences> = {
  SYNC: {
    zodiacSystem: '12-sign',
    zodiacFrame: 'tropical',
    signCount: 12,
    houseSystem: 'placidus',
    showAspects: true,
    showMinorAspects: false,
    showRetrogrades: true,
    showDignities: false,
    defaultChartView: 'wheel',
    ayanamsa: null,
    showNakshatras: false,
    nakshatraSystem: 'none',
  },
  TRUE: {
    zodiacSystem: 'sidereal',
    zodiacFrame: 'sidereal',
    signCount: 13,
    houseSystem: 'whole-sign',
    showAspects: true,
    showMinorAspects: false,
    showRetrogrades: true,
    showDignities: true,
    defaultChartView: 'wheel',
    ayanamsa: 'lahiri',
    showNakshatras: true,
    nakshatraSystem: 'vedic-27',
  },
};

/**
 * Human-readable mode labels for the celestial configuration
 */
export const MODE_CELESTIAL_LABELS: Record<TimeMode, { title: string; subtitle: string }> = {
  SYNC: {
    title: 'The Bridge',
    subtitle: 'Tropical zodiac · Western houses · Gregorian alignment',
  },
  TRUE: {
    title: 'The Deep Current',
    subtitle: 'Sidereal zodiac · Whole-sign houses · Nakshatras · Solar accuracy',
  },
};
