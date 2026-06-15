/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ZODIAC SYSTEM HELPERS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { CelestialBody } from '../../types';
import { getZodiacSystem as getEngineZodiacSystem, getZodiacFrame as getEngineZodiacFrame, getSignCount as getEngineSignCount } from '../swiss-ephemeris/engine';

/**
 * Get current zodiac system preference from store (legacy).
 * Falls back to engine globals since localStorage state is encrypted.
 */
export function getZodiacSystemPreference(): '12-sign' | '13-sign' {
  try {
    const persistedState = localStorage.getItem('heka-calendar-state');
    if (persistedState) {
      // State may be encrypted — try parsing only if it looks like JSON
      if (persistedState.trim().startsWith('{')) {
        const state = JSON.parse(persistedState);
        const sys = state.astroPreferences?.zodiacSystem || '12-sign';
        return sys === 'sidereal' ? '12-sign' : sys;
      }
    }
  } catch (e) {
    // encrypted or corrupt — fall through to engine globals
  }
  // Fallback: engine module-level globals are kept in sync by UI components
  const engineSystem = getEngineZodiacSystem();
  if (engineSystem === 'sidereal') return '12-sign';
  return engineSystem;
}

/** New split API: get zodiac frame (tropical | sidereal) from store */
export function getZodiacFramePreference(): 'tropical' | 'sidereal' {
  try {
    const persistedState = localStorage.getItem('heka-calendar-state');
    if (persistedState) {
      if (persistedState.trim().startsWith('{')) {
        const state = JSON.parse(persistedState);
        return state.astroPreferences?.zodiacFrame || 'tropical';
      }
    }
  } catch (e) {
    // encrypted or corrupt — fall through to engine globals
  }
  return getEngineZodiacFrame();
}

/** New split API: get sign count (12 | 13) from store */
export function getSignCountPreference(): 12 | 13 {
  try {
    const persistedState = localStorage.getItem('heka-calendar-state');
    if (persistedState) {
      if (persistedState.trim().startsWith('{')) {
        const state = JSON.parse(persistedState);
        return state.astroPreferences?.signCount || 12;
      }
    }
  } catch (e) {
    // encrypted or corrupt — fall through to engine globals
  }
  return getEngineSignCount();
}

/**
 * Calculate elemental balance with custom element map
 */
export function calculateElementalBalanceWithSystem(
  planets: Record<string, CelestialBody>,
  elementMap: Record<string, string>
): { fire: number; earth: number; air: number; water: number; ether: number } {
  const elements = { fire: 0, earth: 0, air: 0, water: 0, ether: 0 };
  
  Object.values(planets).forEach((planet) => {
    const element = elementMap[planet.sign];
    if (element && elements[element as keyof typeof elements] !== undefined) {
      elements[element as keyof typeof elements]++;
    }
  });
  
  return elements;
}

/**
 * Calculate modality balance with 13-sign support
 */
export function calculateModalityBalanceWithSystem(
  planets: Record<string, CelestialBody>,
  use13Signs: boolean
): { cardinal: number; fixed: number; mutable: number } {
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 };
  
  // 12-sign modalities
  const modal12: Record<string, string> = {
    aries: 'cardinal', cancer: 'cardinal', libra: 'cardinal', capricorn: 'cardinal',
    taurus: 'fixed', leo: 'fixed', scorpio: 'fixed', aquarius: 'fixed',
    gemini: 'mutable', virgo: 'mutable', sagittarius: 'mutable', pisces: 'mutable',
  };
  
  // 13-sign modalities (Ophiuchus is fixed)
  const modal13: Record<string, string> = {
    ...modal12,
    ophiuchus: 'fixed',
  };
  
  const modalMap = use13Signs ? modal13 : modal12;
  
  Object.values(planets).forEach((planet) => {
    const modality = modalMap[planet.sign];
    if (modality && modalities[modality as keyof typeof modalities] !== undefined) {
      modalities[modality as keyof typeof modalities]++;
    }
  });
  
  return modalities;
}
