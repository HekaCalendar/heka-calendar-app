/**
 * HEKA Astro Native Module
 * TypeScript interface for Swiss Ephemeris native calculations
 */

import { registerPlugin } from '@capacitor/core';
import { Planet, ZodiacSign, PlanetPosition, HouseCusp } from '../types/astrology';

export interface HekaAstroPlugin {
  /**
   * Check if Swiss Ephemeris is available
   */
  isAvailable(): Promise<{ available: boolean; version: string }>;
  
  /**
   * Calculate planetary positions with NASA-grade precision
   */
  calculatePlanetaryPositions(options: {
    date: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }): Promise<{
    positions: Array<{
      planet: string;
      longitude: number;
      latitude: number;
      distance: number;
      speedLongitude: number;
      speedLatitude: number;
      speedDistance: number;
      isRetrograde: boolean;
    }>;
    julianDay: number;
    accuracy: string;
  }>;
  
  /**
   * Calculate house cusps using Swiss Ephemeris
   */
  calculateHouses(options: {
    date: string;
    latitude: number;
    longitude: number;
    timezone: string;
    houseSystem: string;
  }): Promise<{
    houses: Array<{ house: number; longitude: number }>;
    ascendant: number;
    mc: number;
    houseSystem: string;
  }>;
  
  /**
   * Calculate complete natal chart
   */
  calculateNatalChart(options: {
    birthDate: string;
    birthTime: string;
    latitude: number;
    longitude: number;
    timezone: string;
    houseSystem: string;
  }): Promise<{
    positions: Array<{
      planet: string;
      longitude: number;
      speed: number;
      isRetrograde: boolean;
    }>;
    houses?: Array<{ house: number; longitude: number }>;
    ascendant?: number;
    mc?: number;
    julianDay: number;
    houseSystemUsed: string;
    accuracy: string;
  }>;
}

const HekaAstro = registerPlugin<HekaAstroPlugin>('HekaAstro');

/**
 * Check if native Swiss Ephemeris is available
 */
export async function isNativeAstroAvailable(): Promise<boolean> {
  try {
    const result = await HekaAstro.isAvailable();
    return result.available;
  } catch {
    return false;
  }
}

/**
 * Calculate planetary positions using native Swiss Ephemeris
 * Falls back to JavaScript calculation if native is not available
 */
export async function calculateNativePlanetaryPositions(
  date: Date,
  latitude: number,
  longitude: number
): Promise<PlanetPosition[]> {
  // Try native first
  if (await isNativeAstroAvailable()) {
    try {
      const result = await HekaAstro.calculatePlanetaryPositions({
        date: date.toISOString(),
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      
      return result.positions.map(pos => ({
        planet: pos.planet as Planet,
        sign: longitudeToSign(pos.longitude),
        degree: (pos.longitude % 30),
        exactLongitude: pos.longitude,
        isRetrograde: pos.isRetrograde,
        speed: pos.speedLongitude,
      }));
    } catch (e) {
      console.warn('Native calculation failed, falling back to JS', e);
    }
  }
  
  // Fall back to JavaScript calculation
  const { calculatePlanetaryPositions } = await import('./AstroCalculationEngine');
  return calculatePlanetaryPositions(date);
}

/**
 * Calculate houses using native Swiss Ephemeris
 */
export async function calculateNativeHouses(
  date: Date,
  latitude: number,
  longitude: number,
  houseSystem: string = 'P'
): Promise<{ houses: HouseCusp[]; systemUsed: string; warnings?: string[] }> {
  const warnings: string[] = [];
  
  // Check for extreme latitudes
  if (Math.abs(latitude) > 66.5) {
    warnings.push('Extreme latitude detected. Using Whole Sign houses.');
    houseSystem = 'W'; // Whole sign for extreme latitudes
  }
  
  // Try native first
  if (await isNativeAstroAvailable()) {
    try {
      const result = await HekaAstro.calculateHouses({
        date: date.toISOString(),
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        houseSystem,
      });
      
      const houses: HouseCusp[] = result.houses.map(h => ({
        house: h.house as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
        sign: longitudeToSign(h.longitude),
        degree: h.longitude % 30,
        exactLongitude: h.longitude,
      }));
      
      return {
        houses,
        systemUsed: result.houseSystem,
        warnings,
      };
    } catch (e) {
      console.warn('Native house calculation failed, falling back to JS', e);
    }
  }
  
  // Fall back to JavaScript calculation
  const { calculateHouses } = await import('./AstroCalculationEngine');
  return calculateHouses(date, latitude, longitude, houseSystem);
}

/**
 * Calculate natal chart using native Swiss Ephemeris
 */
export async function calculateNativeNatalChart(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  houseSystem: string = 'P'
): Promise<any> {
  // Try native first
  if (await isNativeAstroAvailable()) {
    try {
      const result = await HekaAstro.calculateNatalChart({
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone,
        houseSystem,
      });
      
      return {
        ...result,
        accuracy: 'swiss-ephemeris-nasa-grade',
        nativeCalculation: true,
      };
    } catch (e) {
      console.warn('Native natal chart calculation failed, falling back to JS', e);
    }
  }
  
  // Fall back to JavaScript calculation
  const { generateNatalChart } = await import('./AstroCalculationEngine');
  return generateNatalChart(birthDate, birthTime, latitude, longitude, timezone);
}

// Helper function
function longitudeToSign(longitude: number): ZodiacSign {
  const normalized = ((longitude % 360) + 360) % 360;
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'ophiuchus', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  return signs[Math.floor(normalized / 30)];
}

export default HekaAstro;
