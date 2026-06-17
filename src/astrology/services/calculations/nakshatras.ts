/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NAKSHATRA CALCULATION ENGINE
 * Bridges Swiss Ephemeris positions with the 27 lunar mansions.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { calculateJulianDay, calculateAllPlanets, calculateAyanamsa } from '../swiss-ephemeris/engine';
import {
  getMansionInfo,
  getCycleRuler,
  CYCLE_YEARS,
  type LunarMansion,
} from '../../data/nakshatras';

// Cache true solar return calculations — they are deterministic for a given birth longitude + year.
const solarReturnCache = new Map<string, TrueSolarReturn | null>();

export interface PlanetMansion {
  planet: string;
  mansion: LunarMansion;
  quarter: number;
  siderealLongitude: number;
}

export interface BirthMansion {
  moonMansion: LunarMansion;
  moonQuarter: number;
  moonSiderealLongitude: number;
  cycleRuler: string;
  cycleYears: number;
  allPlanets: PlanetMansion[];
}

export interface CurrentMansion {
  date: Date;
  moonMansion: LunarMansion;
  moonQuarter: number;
  moonSiderealLongitude: number;
  sunMansion: LunarMansion;
  sunSiderealLongitude: number;
}

/**
 * Calculate sidereal longitude by subtracting ayanamsa from tropical longitude.
 * Defaults to Lahiri ayanamsa if no system specified.
 */
function toSidereal(tropicalLongitude: number, jd: number): number {
  const ayanamsa = calculateAyanamsa(jd);
  return ((tropicalLongitude - ayanamsa) % 360 + 360) % 360;
}

/**
 * Calculate Nakshatra positions for all planets at a given Julian Day.
 */
export function calculateMansionsForJD(
  jd: number,
  planets: string[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'rahu', 'ketu']
): PlanetMansion[] {
  const positions = calculateAllPlanets(jd, planets, 'sidereal');
  const result: PlanetMansion[] = [];

  for (const planet of planets) {
    const pos = positions[planet.toLowerCase()];
    if (!pos) continue;
    const siderealLon = toSidereal(pos.longitude, jd);
    const info = getMansionInfo(siderealLon);
    result.push({
      planet: planet.toLowerCase(),
      mansion: info.mansion,
      quarter: info.quarter,
      siderealLongitude: siderealLon,
    });
  }

  return result;
}

/** @deprecated Use calculateMansionsForJD */
export const calculateNakshatrasForJD = calculateMansionsForJD;

/**
 * Batch calculate Lunar Mansions for multiple dates.
 * Follows the same pattern as calculateMoonPhaseBatch for consistency.
 */
export async function calculateMansionBatch(
  dates: Date[]
): Promise<Map<string, CurrentMansion>> {
  const results = new Map<string, CurrentMansion>();

  // Process in parallel for performance
  const calculations = dates.map(async (date) => {
    const dateKey = date.toISOString().split('T')[0];
    try {
      const mansion = calculateCurrentMansion(date);
      return { dateKey, mansion };
    } catch {
      return null;
    }
  });

  const settled = await Promise.all(calculations);
  for (const item of settled) {
    if (item && item.mansion) {
      results.set(item.dateKey, item.mansion);
    }
  }

  return results;
}

/**
 * Calculate the birth Nakshatra from birth data.
 * This is the most important Nakshatra — it determines the Vimshottari Dasha.
 */
export function calculateBirthMansion(
  birthDate: Date,
  timezone: string,
  _latitude: number,
  _longitude: number
): BirthMansion | null {
  try {
    const localDate = new Date(birthDate.toLocaleString('en-US', { timeZone: timezone }));
    const jd = calculateJulianDay(
      localDate.getFullYear(),
      localDate.getMonth() + 1,
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds()
    );

    const planetMansions = calculateMansionsForJD(jd);
    const moon = planetMansions.find(p => p.planet === 'moon');
    if (!moon) return null;

    const cycleRuler = getCycleRuler(moon.mansion.id);

    return {
      moonMansion: moon.mansion,
      moonQuarter: moon.quarter,
      moonSiderealLongitude: moon.siderealLongitude,
      cycleRuler,
      cycleYears: CYCLE_YEARS[cycleRuler] || 0,
      allPlanets: planetMansions,
    };
  } catch (e) {
    console.error('[LunarMansion] Failed to calculate birth mansion:', e);
    return null;
  }
}

/** @deprecated Use calculateBirthMansion */
export const calculateBirthNakshatra = calculateBirthMansion;

/**
 * Calculate the current Nakshatra for a given date (defaults to now).
 */
export function calculateCurrentMansion(date: Date = new Date()): CurrentMansion | null {
  try {
    const jd = calculateJulianDay(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );

    const planetMansions = calculateMansionsForJD(jd, ['sun', 'moon']);
    const moon = planetMansions.find(p => p.planet === 'moon');
    const sun = planetMansions.find(p => p.planet === 'sun');

    if (!moon || !sun) return null;

    return {
      date,
      moonMansion: moon.mansion,
      moonQuarter: moon.quarter,
      moonSiderealLongitude: moon.siderealLongitude,
      sunMansion: sun.mansion,
      sunSiderealLongitude: sun.siderealLongitude,
    };
  } catch (e) {
    console.error('[LunarMansion] Failed to calculate current mansion:', e);
    return null;
  }
}

/** @deprecated Use calculateCurrentMansion */
export const calculateCurrentNakshatra = calculateCurrentMansion;

/**
 * Get a human-readable description of a Lunar Mansion for display.
 */
export function describeMansion(mansion: LunarMansion, quarter: number): string {
  return `${mansion.universalName} — Quarter ${quarter}. Ruled by ${mansion.ruler}. ${mansion.theme}`;
}

/** @deprecated Use describeMansion */
export const describeNakshatra = describeMansion;

/**
 * Get the daily Lunar Mansion theme for journal prompts / AI context.
 */
export function getDailyMansionTheme(date: Date = new Date()): string {
  const current = calculateCurrentMansion(date);
  if (!current) return '';
  const { moonMansion, moonQuarter } = current;
  return `${moonMansion.universalName} Quarter ${moonQuarter}: ${moonMansion.gift}`;
}

/** @deprecated Use getDailyMansionTheme */
export const getDailyNakshatraTheme = getDailyMansionTheme;

// ═══════════════════════════════════════════════════════════════════════════════
// TRUE SOLAR RETURN — Sidereal Sun-Return Calculator
// ═══════════════════════════════════════════════════════════════════════════════

export interface TrueSolarReturn {
  year: number;
  date: Date;
  siderealSunLongitude: number;
  birthSiderealLongitude: number;
  orb: number; // arcminutes from exact return
}

/**
 * Calculate the True Solar Return for a given birth chart and target year.
 * In TRUE mode, your "birthday" is when the Sun returns to your sidereal birth longitude,
 * not the civil calendar date. This can drift by ~1 day per 72 years from the tropical date.
 */
export function calculateTrueSolarReturn(
  birthSiderealSunLongitude: number,
  targetYear: number,
  birthMonth: number = 1, // 0-11, for initial search guess
  birthDay: number = 1
): TrueSolarReturn | null {
  const cacheKey = `${birthSiderealSunLongitude.toFixed(6)}:${targetYear}:${birthMonth}:${birthDay}`;
  const cached = solarReturnCache.get(cacheKey);
  if (cached !== undefined) return cached;

  try {
    // Search window: ±7 days around the birth date in the target year
    const startDate = new Date(targetYear, birthMonth, birthDay - 7, 12, 0, 0);
    const endDate = new Date(targetYear, birthMonth, birthDay + 7, 12, 0, 0);

    let bestDate: Date | null = null;
    let bestOrb = Infinity;

    // Brute force with 0.25-day steps (6 hours), then refine
    const stepMs = 6 * 60 * 60 * 1000; // 6 hours
    for (let t = startDate.getTime(); t <= endDate.getTime(); t += stepMs) {
      const date = new Date(t);
      const jd = calculateJulianDay(
        date.getFullYear(), date.getMonth() + 1, date.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds()
      );
      const positions = calculateAllPlanets(jd, ['sun'], 'sidereal');
      const sunPos = positions.sun;
      if (!sunPos) continue;

      const sunLon = sunPos.longitude;
      const diff = angularDiff(sunLon, birthSiderealSunLongitude);

      if (diff < bestOrb) {
        bestOrb = diff;
        bestDate = date;
      }
    }

    if (!bestDate || bestOrb > 5) {
      solarReturnCache.set(cacheKey, null);
      return null;
    }

    // Refine with interpolation around the best 6-hour bracket
    const refined = refineSolarReturn(birthSiderealSunLongitude, bestDate, stepMs);

    const result: TrueSolarReturn = {
      year: targetYear,
      date: refined.date,
      siderealSunLongitude: refined.longitude,
      birthSiderealLongitude: birthSiderealSunLongitude,
      orb: refined.orb,
    };
    solarReturnCache.set(cacheKey, result);
    return result;
  } catch (e) {
    console.error('[TrueSolarReturn] Calculation failed:', e);
    solarReturnCache.set(cacheKey, null);
    return null;
  }
}

function refineSolarReturn(
  targetLon: number,
  bestDate: Date,
  stepMs: number
): { date: Date; longitude: number; orb: number } {
  const before = new Date(bestDate.getTime() - stepMs);
  const after = new Date(bestDate.getTime() + stepMs);

  const getSunLon = (d: Date): number => {
    const jd = calculateJulianDay(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
    const pos = calculateAllPlanets(jd, ['sun'], 'sidereal');
    return pos.sun?.longitude ?? 0;
  };

  const lonBefore = getSunLon(before);
  const lonBest = getSunLon(bestDate);
  const lonAfter = getSunLon(after);

  const diffBefore = angularDiff(lonBefore, targetLon);
  const diffBest = angularDiff(lonBest, targetLon);
  const diffAfter = angularDiff(lonAfter, targetLon);

  // Parabolic interpolation to find minimum
  const denom = 2 * (diffBefore - 2 * diffBest + diffAfter);
  const t = denom !== 0 ? (diffBefore - diffAfter) / denom : 0;
  const refinedTime = bestDate.getTime() + Math.max(-0.5, Math.min(0.5, t)) * stepMs;
  const refinedDate = new Date(refinedTime);
  const refinedLon = getSunLon(refinedDate);

  return {
    date: refinedDate,
    longitude: refinedLon,
    orb: angularDiff(refinedLon, targetLon) * 60,
  };
}

function angularDiff(a: number, b: number): number {
  let diff = Math.abs(a - b);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Batch calculate True Solar Returns for a range of years.
 */
export function calculateSolarReturnBatch(
  birthSiderealSunLongitude: number,
  birthMonth: number,
  birthDay: number,
  years: number[]
): Map<number, TrueSolarReturn> {
  const results = new Map<number, TrueSolarReturn>();
  for (const year of years) {
    const sr = calculateTrueSolarReturn(birthSiderealSunLongitude, year, birthMonth, birthDay);
    if (sr) results.set(year, sr);
  }
  return results;
}
