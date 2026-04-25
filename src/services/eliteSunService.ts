/**
 * ELITE Sun Times Service
 * Surgical precision sunrise/sunset calculations
 * Combines: Swiss Ephemeris WASM → API → Astronomical algorithms → Fallback
 * Accuracy: ±1 minute (WASM/API) to ±2 minutes (algorithm)
 */

import type { LocationData } from '../types';
import { calculateSunTimes as weatherSunTimes } from './weatherService';

export interface EliteSunData {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dawn: Date; // Civil twilight start
  dusk: Date; // Civil twilight end
  tomorrowSunrise: Date;
  dayLength: number; // minutes
  maxElevation: number; // degrees at solar noon
  source: 'swiss-ephemeris' | 'noaa-api' | 'astronomical' | 'fallback';
  accuracy: '±1min' | '±2min' | '±5min';
}

// NOAA API response type
interface NOAA_SunData {
  results: {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    civil_twilight_begin: string;
    civil_twilight_end: string;
    day_length: number;
  };
  status: string;
}

/**
 * PRIMARY: Try Swiss Ephemeris WASM (most accurate)
 */
async function trySwissEphemeris(
  date: Date,
  location: LocationData
): Promise<EliteSunData | null> {
  try {
    const { calculateSunTimes } = await import('../astrology/services/calculations/swissCalculations');
    const result = await calculateSunTimes(date, location.latitude, location.longitude);
    
    if (result?.sunrise && result?.sunset) {
      return {
        sunrise: result.sunrise,
        sunset: result.sunset,
        solarNoon: result.solarNoon || new Date((result.sunrise.getTime() + result.sunset.getTime()) / 2),
        dawn: new Date(result.sunrise.getTime() - 30 * 60 * 1000), // Approx 30 min before
        dusk: new Date(result.sunset.getTime() + 30 * 60 * 1000),   // Approx 30 min after
        tomorrowSunrise: new Date(result.sunrise.getTime() + 24 * 60 * 60 * 1000),
        dayLength: result.dayLength,
        maxElevation: calculateMaxElevation(location.latitude, date),
        source: 'swiss-ephemeris',
        accuracy: '±1min',
      };
    }
  } catch (e) {
    console.log('[EliteSun] Swiss Ephemeris unavailable');
  }
  return null;
}

/**
 * SECONDARY: NOAA Sunrise-Sunset API (free, accurate, includes refraction)
 * https://sunrise-sunset.org/api
 */
async function tryNOAA_API(
  date: Date,
  location: LocationData
): Promise<EliteSunData | null> {
  try {
    const lat = location.latitude.toFixed(4);
    const lng = location.longitude.toFixed(4);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // NOAA API is free, no API key required
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data: NOAA_SunData = await response.json();
    
    if (data.status !== 'OK' || !data.results) {
      throw new Error('Invalid API response');
    }
    
    const r = data.results;
    
    // Parse ISO 8601 dates
    const sunrise = new Date(r.sunrise);
    const sunset = new Date(r.sunset);
    const solarNoon = new Date(r.solar_noon);
    const dawn = new Date(r.civil_twilight_begin);
    const dusk = new Date(r.civil_twilight_end);
    
    return {
      sunrise,
      sunset,
      solarNoon,
      dawn,
      dusk,
      tomorrowSunrise: new Date(sunrise.getTime() + 24 * 60 * 60 * 1000),
      dayLength: r.day_length / 60, // Convert seconds to minutes
      maxElevation: calculateMaxElevation(location.latitude, date),
      source: 'noaa-api',
      accuracy: '±1min',
    };
  } catch (e) {
    console.log('[EliteSun] NOAA API unavailable:', e instanceof Error ? e.message : 'unknown');
  }
  return null;
}

/**
 * TERTIARY: Astronomical algorithms (offline, accurate)
 * Uses NOAA's astronomical algorithms implemented in weatherService
 */
function tryAstronomical(
  date: Date,
  location: LocationData
): EliteSunData | null {
  try {
    const result = weatherSunTimes(date, location);
    
    return {
      sunrise: result.sunrise,
      sunset: result.sunset,
      solarNoon: result.solarNoon,
      dawn: result.dawn,
      dusk: result.dusk,
      tomorrowSunrise: new Date(result.sunrise.getTime() + 24 * 60 * 60 * 1000),
      dayLength: result.dayLength,
      maxElevation: result.sunElevation,
      source: 'astronomical',
      accuracy: '±2min',
    };
  } catch (e) {
    console.log('[EliteSun] Astronomical calculation failed');
  }
  return null;
}

/**
 * LAST RESORT: Enhanced fallback with refraction correction
 */
function getTimezoneOffsetHours(date: Date, timezone: string): number {
  try {
    const utcFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tzFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const utcParts = utcFormatter.formatToParts(date);
    const tzParts = tzFormatter.formatToParts(date);
    const get = (parts: Intl.DateTimeFormatPart[], type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
    const utcTime = Date.UTC(get(utcParts, 'year'), get(utcParts, 'month') - 1, get(utcParts, 'day'), get(utcParts, 'hour'), get(utcParts, 'minute'), get(utcParts, 'second'));
    const tzTime = Date.UTC(get(tzParts, 'year'), get(tzParts, 'month') - 1, get(tzParts, 'day'), get(tzParts, 'hour'), get(tzParts, 'minute'), get(tzParts, 'second'));
    return (utcTime - tzTime) / (1000 * 60 * 60);
  } catch {
    return 0;
  }
}

function fallbackCalculation(
  date: Date,
  location: LocationData
): EliteSunData {
  const lat = location.latitude;
  const dayOfYear = getDayOfYear(date);
  
  // Solar declination with equation of time approximation
  const declination = 23.45 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365.25);
  
  // Atmospheric refraction correction (34 arcminutes at horizon)
  const refractionCorrection = 0.5667; // degrees
  
  // Hour angle calculation with refraction
  const latRad = (lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  const elevRad = (-0.833 - refractionCorrection) * Math.PI / 180; // -0.833° is sun's apparent radius
  
  const cosH = (Math.sin(elevRad) - Math.sin(latRad) * Math.sin(decRad)) / 
               (Math.cos(latRad) * Math.cos(decRad));
  
  let sunriseHour: number;
  let sunsetHour: number;
  
  if (Math.abs(cosH) > 1) {
    // Polar day/night
    if (lat > 0 && declination > 0) {
      // Midnight sun (summer at north pole)
      sunriseHour = 0;
      sunsetHour = 24;
    } else {
      // Polar night
      sunriseHour = 12;
      sunsetHour = 12;
    }
  } else {
    const H = Math.acos(Math.max(-1, Math.min(1, cosH))) * 180 / Math.PI;
    const transitHour = 12 + getEquationOfTime(dayOfYear) / 60; // Local apparent noon
    sunriseHour = transitHour - H / 15;
    sunsetHour = transitHour + H / 15;
  }
  
  // Convert local hours to UTC hours and create true UTC dates
  const tzOffset = getTimezoneOffsetHours(date, location.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const baseDateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const sunrise = new Date(baseDateUTC + (sunriseHour - tzOffset) * 60 * 60 * 1000);
  const sunset = new Date(baseDateUTC + (sunsetHour - tzOffset) * 60 * 60 * 1000);
  const solarNoon = new Date(baseDateUTC + (((sunriseHour + sunsetHour) / 2) - tzOffset) * 60 * 60 * 1000);
  const dawn = new Date(sunrise.getTime() - 30 * 60 * 1000);
  const dusk = new Date(sunset.getTime() + 30 * 60 * 1000);
  
  return {
    sunrise,
    sunset,
    solarNoon,
    dawn,
    dusk,
    tomorrowSunrise: new Date(sunrise.getTime() + 24 * 60 * 60 * 1000),
    dayLength: (sunsetHour - sunriseHour) * 60,
    maxElevation: 90 - Math.abs(lat - declination),
    source: 'fallback',
    accuracy: '±5min',
  };
}

/**
 * MAIN FUNCTION: Get elite sun times
 * Tries sources in order of accuracy
 */
export async function getEliteSunTimes(
  date: Date,
  location: LocationData
): Promise<EliteSunData> {
  console.log('[EliteSun] Calculating for', location.name, date.toDateString());
  
  // Try each source in order
  let result: EliteSunData | null = await trySwissEphemeris(date, location);
  if (result) {
    console.log('[EliteSun] Using Swiss Ephemeris (±1min)');
  } else {
    result = await tryNOAA_API(date, location);
    if (result) {
      console.log('[EliteSun] Using NOAA API (±1min)');
    } else {
      result = tryAstronomical(date, location);
      if (result) {
        console.log('[EliteSun] Using Astronomical algorithms (±2min)');
      } else {
        console.log('[EliteSun] Using Fallback (±5min)');
        result = fallbackCalculation(date, location);
      }
    }
  }
  
  // Calculate tomorrow's sunrise for accurate overnight rollover
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  let tomorrowResult = await trySwissEphemeris(tomorrow, location)
    || await tryNOAA_API(tomorrow, location)
    || tryAstronomical(tomorrow, location)
    || fallbackCalculation(tomorrow, location);
  
  return { ...result, tomorrowSunrise: tomorrowResult.sunrise };
}

/**
 * Get sun times for multiple dates (batch calculation)
 */
export async function getSunTimesForRange(
  startDate: Date,
  days: number,
  location: LocationData
): Promise<Map<string, EliteSunData>> {
  const results = new Map<string, EliteSunData>();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const times = await getEliteSunTimes(date, location);
    results.set(date.toISOString().split('T')[0], times);
  }
  
  return results;
}

// Helper functions
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getEquationOfTime(dayOfYear: number): number {
  // Approximate equation of time in minutes
  // E = 9.87*sin(2B) - 7.53*cos(B) - 1.5*sin(B)
  // where B = 360*(N-81)/365 degrees
  const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

function calculateMaxElevation(lat: number, date: Date): number {
  const dayOfYear = getDayOfYear(date);
  const declination = 23.45 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365.25);
  return 90 - Math.abs(lat - declination);
}

// Export service
export const EliteSunService = {
  getEliteSunTimes,
  getSunTimesForRange,
};

export default EliteSunService;
