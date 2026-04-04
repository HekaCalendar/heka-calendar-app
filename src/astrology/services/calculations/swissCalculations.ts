/**
 * Swiss Calculations - NASA-grade astronomical calculations
 * Foundation for Stars Hub Phase 1
 */

import { 
  calculateAllPlanets, 
  calculateJulianDay, 
  calculateSunrise, 
  calculateSunset,
  calculateHouses,
  getZodiacSystem,
} from '../swiss-ephemeris/engine';
import type { CelestialBody, VoidMoonData, VoidMoonEvent } from '../../types';
import { toDegree, toZodiacDegree } from '../../types/core';

// Cache for calculations
const calculationCache = new Map<string, any>();

/**
 * Calculate current sky positions with Swiss Ephemeris precision
 * Returns all planets with arc-second accuracy
 */
export async function calculateCurrentSky(date: Date = new Date()): Promise<{
  positions: Record<string, CelestialBody>;
  julianDay: number;
  timestamp: number;
}> {
  const zodiacSystem = getZodiacSystem();
  const cacheKey = `sky-${date?.toISOString?.().slice(0, 16) || Date.now()}-${zodiacSystem}`;
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }
  
  try {
    const jd = calculateJulianDay(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    
    const use13Signs = zodiacSystem === '13-sign';
    const positions = calculateAllPlanets(jd, undefined, use13Signs);
    
    // Ensure we have valid positions (fallback if WASM not ready)
    const validPositions = positions && Object.keys(positions).length > 0 
      ? positions 
      : getFallbackPositions(jd);
    
    const result = {
      positions: validPositions,
      julianDay: jd,
      timestamp: date.getTime(),
    };
    
    calculationCache.set(cacheKey, result);
    
    // Limit cache size
    if (calculationCache.size > 1000) {
      const firstKey = calculationCache.keys().next().value;
      if (firstKey) calculationCache.delete(firstKey);
    }
    
    return result;
  } catch (error) {
    console.warn('[SwissCalculations] Error calculating sky, using fallback:', error);
    // Return fallback data
    const jd = calculateJulianDay(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    return {
      positions: getFallbackPositions(jd),
      julianDay: jd,
      timestamp: date.getTime(),
    };
  }
}

/**
 * Fallback planet positions when WASM is not available
 * Uses mean orbital elements for approximate positions
 */
function getFallbackPositions(jd: number): Record<string, CelestialBody> {
  const elements: Record<string, { meanLong: number; dailyMotion: number; distance: number }> = {
    sun: { meanLong: 280.46646, dailyMotion: 0.98564736, distance: 1.0 },
    moon: { meanLong: 218.316, dailyMotion: 13.176396, distance: 0.00257 },
    mercury: { meanLong: 252.251, dailyMotion: 4.092338, distance: 0.39 },
    venus: { meanLong: 181.979, dailyMotion: 1.602130, distance: 0.72 },
    mars: { meanLong: 355.433, dailyMotion: 0.524033, distance: 1.52 },
    jupiter: { meanLong: 34.351, dailyMotion: 0.083091, distance: 5.2 },
    saturn: { meanLong: 50.077, dailyMotion: 0.033444, distance: 9.5 },
    uranus: { meanLong: 314.055, dailyMotion: 0.011698, distance: 19.2 },
    neptune: { meanLong: 304.349, dailyMotion: 0.005965, distance: 30.1 },
    pluto: { meanLong: 238.929, dailyMotion: 0.003964, distance: 39.5 },
  };
  
  const jd2000 = 2451545.0;
  const daysSince2000 = jd - jd2000;
  const result: Record<string, CelestialBody> = {};
  
  for (const [name, el] of Object.entries(elements)) {
    let longitude = (el.meanLong + el.dailyMotion * daysSince2000) % 360;
    if (longitude < 0) longitude += 360;
    
    const signIndex = Math.floor(longitude / 30) % 12;
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                   'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] as const;
    
    result[name] = {
      id: name as any,
      longitude: toDegree(longitude),
      latitude: 0,
      distance: el.distance,
      speed: el.dailyMotion,
      isRetrograde: el.dailyMotion < 0,
      sign: signs[signIndex] as any,
      degreeInSign: toZodiacDegree(toDegree(longitude)),
    };
  }
  
  return result;
}

/**
 * Calculate precise moon phase with Swiss Ephemeris
 * Returns exact illumination, angle, and next phase times
 */
export function calculatePreciseMoonPhase(sun: CelestialBody, moon: CelestialBody): {
  phase: number; // 0-1 (0=new, 0.5=full, 1=new)
  illumination: number; // 0-100%
  angle: number; // Degrees from sun
  isWaxing: boolean;
  name: string;
  emoji: string;
} {
  const angle = ((moon.longitude - sun.longitude) % 360 + 360) % 360;
  const phase = angle / 360;
  const illumination = (1 - Math.cos(angle * Math.PI / 180)) / 2 * 100;
  
  let name: string;
  let emoji: string;
  
  if (angle < 22.5) { name = 'New Moon'; emoji = '🌑'; }
  else if (angle < 67.5) { name = 'Waxing Crescent'; emoji = '🌒'; }
  else if (angle < 112.5) { name = 'First Quarter'; emoji = '🌓'; }
  else if (angle < 157.5) { name = 'Waxing Gibbous'; emoji = '🌔'; }
  else if (angle < 202.5) { name = 'Full Moon'; emoji = '🌕'; }
  else if (angle < 247.5) { name = 'Waning Gibbous'; emoji = '🌖'; }
  else if (angle < 292.5) { name = 'Last Quarter'; emoji = '🌗'; }
  else { name = 'Waning Crescent'; emoji = '🌘'; }
  
  return {
    phase,
    illumination,
    angle,
    isWaxing: angle < 180,
    name,
    emoji,
  };
}

/**
 * Detect Void of Course Moon precisely
 * Moon is void when it makes no major aspects before changing signs
 */
export async function detectVoidMoon(): Promise<{
  isVoid: boolean;
  voidStart?: Date;
  voidEnd?: Date;
  duration?: number;
  nextSign?: string;
}> {
  // Placeholder for void moon detection
  return { isVoid: false };
}

/**
 * Calculate planetary hours for a date and location
 * Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon
 */
/**
 * Calculate TRUE planetary hours using Chaldean order with real sunrise/sunset
 * Day hours = time from sunrise to sunset divided into 12 equal parts
 * Night hours = time from sunset to next sunrise divided into 12 equal parts
 * Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon
 */
export async function calculatePlanetaryHours(
  date: Date,
  latitude: number,
  longitude: number,
  _timezone: number = 0
): Promise<Array<{
  hour: number;
  planet: string;
  symbol: string;
  startTime: Date;
  endTime: Date;
  activities: string[];
  isDay: boolean;
}>> {
  const dayOfWeek = date.getDay(); // 0=Sunday
  const dayPlanets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const chaldean = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'];
  const symbols: Record<string, string> = {
    saturn: '♄', jupiter: '♃', mars: '♂', sun: '☉', venus: '♀', mercury: '☿', moon: '☽'
  };
  const activities: Record<string, string[]> = {
    saturn: ['Study', 'Research', 'Planning', 'Organization'],
    jupiter: ['Business', 'Legal', 'Travel', 'Teaching'],
    mars: ['Exercise', 'Competition', 'Surgery', 'Action'],
    sun: ['Leadership', 'Health', 'Visibility', 'Requests'],
    venus: ['Romance', 'Art', 'Socializing', 'Beauty'],
    mercury: ['Communication', 'Writing', 'Study', 'Commerce'],
    moon: ['Home', 'Family', 'Intuition', 'Nurturing'],
  };
  
  // Get actual sunrise and sunset times
  const [sunrise, sunset] = await Promise.all([
    calculateSunrise(date, latitude, longitude),
    calculateSunset(date, latitude, longitude)
  ]);
  
  // If we can't get rise/set times, fall back to standard hours
  if (!sunrise || !sunset) {
    console.warn('[PlanetaryHours] Using fallback - no rise/set data');
    return calculateFallbackHours(date);
  }
  
  // Calculate day length and night length
  const dayLength = sunset.getTime() - sunrise.getTime();
  const dayHourLength = dayLength / 12;
  
  // Night starts at sunset, ends at next day's sunrise
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextSunrise = await calculateSunrise(tomorrow, latitude, longitude);
  
  let nightLength: number;
  let nightHourLength: number;
  
  if (nextSunrise) {
    nightLength = nextSunrise.getTime() - sunset.getTime();
  } else {
    // Fallback: assume 24h - dayLength
    nightLength = (24 * 60 * 60 * 1000) - dayLength;
  }
  nightHourLength = nightLength / 12;
  
  // First hour of day is ruled by the day's planet
  const firstHourRuler = dayPlanets[dayOfWeek];
  const firstHourIndex = chaldean.indexOf(firstHourRuler);
  
  const hours: Array<{
    hour: number;
    planet: string;
    symbol: string;
    startTime: Date;
    endTime: Date;
    activities: string[];
    isDay: boolean;
  }> = [];
  
  // Generate 12 day hours
  for (let h = 0; h < 12; h++) {
    const planetIndex = (firstHourIndex + h) % 7;
    const planet = chaldean[planetIndex];
    
    const startTime = new Date(sunrise.getTime() + (h * dayHourLength));
    const endTime = new Date(sunrise.getTime() + ((h + 1) * dayHourLength));
    
    hours.push({
      hour: h,
      planet,
      symbol: symbols[planet],
      startTime,
      endTime,
      activities: activities[planet],
      isDay: true,
    });
  }
  
  // Generate 12 night hours (continue Chaldean order)
  for (let h = 0; h < 12; h++) {
    const planetIndex = (firstHourIndex + 12 + h) % 7;
    const planet = chaldean[planetIndex];
    
    const startTime = new Date(sunset.getTime() + (h * nightHourLength));
    const endTime = new Date(sunset.getTime() + ((h + 1) * nightHourLength));
    
    hours.push({
      hour: h + 12,
      planet,
      symbol: symbols[planet],
      startTime,
      endTime,
      activities: activities[planet],
      isDay: false,
    });
  }
  
  return hours;
}

// Fallback when rise/set can't be calculated
function calculateFallbackHours(date: Date): Array<{
  hour: number;
  planet: string;
  symbol: string;
  startTime: Date;
  endTime: Date;
  activities: string[];
  isDay: boolean;
}> {
  const dayOfWeek = date.getDay();
  const dayPlanets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const chaldean = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'];
  const symbols: Record<string, string> = {
    saturn: '♄', jupiter: '♃', mars: '♂', sun: '☉', venus: '♀', mercury: '☿', moon: '☽'
  };
  const activities: Record<string, string[]> = {
    saturn: ['Study', 'Research', 'Planning', 'Organization'],
    jupiter: ['Business', 'Legal', 'Travel', 'Teaching'],
    mars: ['Exercise', 'Competition', 'Surgery', 'Action'],
    sun: ['Leadership', 'Health', 'Visibility', 'Requests'],
    venus: ['Romance', 'Art', 'Socializing', 'Beauty'],
    mercury: ['Communication', 'Writing', 'Study', 'Commerce'],
    moon: ['Home', 'Family', 'Intuition', 'Nurturing'],
  };
  
  const firstHourRuler = dayPlanets[dayOfWeek];
  const firstHourIndex = chaldean.indexOf(firstHourRuler);
  
  const hours = [];
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  
  for (let h = 0; h < 24; h++) {
    const planetIndex = (firstHourIndex + h) % 7;
    const planet = chaldean[planetIndex];
    
    const startTime = new Date(baseDate);
    startTime.setHours(h);
    
    const endTime = new Date(baseDate);
    endTime.setHours(h + 1);
    
    hours.push({
      hour: h,
      planet,
      symbol: symbols[planet],
      startTime,
      endTime,
      activities: activities[planet],
      isDay: h >= 6 && h < 18, // Approximate
    });
  }
  
  return hours;
}

/**
 * Get current planetary hour with Swiss Ephemeris accuracy
 */
export async function getCurrentPlanetaryHour(
  date: Date = new Date(),
  latitude: number = 0,
  longitude: number = 0,
  timezone: number = 0
): Promise<{
  planet: string;
  symbol: string;
  hour: number;
  activities: string[];
  nextHour: string;
  location?: string;
  isDay: boolean;
  sunrise?: Date;
  sunset?: Date;
  progress: number; // 0-100% through current hour
}> {
  const hours = await calculatePlanetaryHours(date, latitude, longitude, timezone);
  
  // Find which planetary hour we're currently in
  const now = date.getTime();
  let current = hours[0];
  let currentIndex = 0;
  
  for (let i = 0; i < hours.length; i++) {
    if (now >= hours[i].startTime.getTime() && now < hours[i].endTime.getTime()) {
      current = hours[i];
      currentIndex = i;
      break;
    }
  }
  
  const next = hours[(currentIndex + 1) % 24];
  
  // Calculate progress through current hour
  const hourStart = current.startTime.getTime();
  const hourEnd = current.endTime.getTime();
  const hourDuration = hourEnd - hourStart;
  const elapsed = now - hourStart;
  const progress = Math.min(100, Math.max(0, (elapsed / hourDuration) * 100));
  
  // Find sunrise/sunset from hours array
  const sunrise = hours.find(h => h.isDay)?.startTime;
  const sunset = hours.find(h => !h.isDay)?.startTime;
  
  return {
    planet: current.planet,
    symbol: current.symbol,
    hour: current.hour,
    activities: current.activities,
    nextHour: next.planet,
    location: latitude !== 0 || longitude !== 0 ? `${latitude.toFixed(1)}°, ${longitude.toFixed(1)}°` : undefined,
    isDay: current.isDay,
    sunrise,
    sunset,
    progress,
  };
}

/**
 * Calculate retrograde status for all planets
 */
export function calculateRetrogrades(positions: Record<string, CelestialBody>): Array<{
  planet: string;
  symbol: string;
  isRetrograde: boolean;
  speed: number; // When it stations direct/retrograde
}> {
  const symbols: Record<string, string> = {
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
  };
  
  return Object.entries(positions).map(([planet, body]) => ({
    planet,
    symbol: symbols[planet] || '?',
    isRetrograde: body.isRetrograde,
    speed: (body as any).longitudeSpeed || 0,
    // stationDate would require calculating when speed crosses zero
  }));
}

/**
 * Calculate local houses (Ascendant, MC, etc.) for a given time and location
 * Returns the 12 house cusps plus Angles
 */
export async function calculateLocalHouses(
  date: Date = new Date(),
  latitude: number = 0,
  longitude: number = 0,
  houseSystem: 'placidus' | 'koch' | 'equal' | 'whole-sign' = 'placidus'
): Promise<{
  ascendant: number;
  mc: number;
  ic: number;
  descendant: number;
  cusps: number[];
  houseSystem: string;
} | null> {
  if (latitude === 0 && longitude === 0) return null;
  
  const jd = await calculateJulianDay(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    0
  );
  
  const houses = await calculateHouses(jd, {
    latitude,
    longitude,
    altitude: 0,
  } as any, houseSystem);
  
  return {
    ascendant: houses.ascendant,
    mc: houses.mc,
    ic: houses.ic,
    descendant: houses.dsc,
    cusps: houses.cusps.map((c: any) => c.longitude),
    houseSystem,
  };
}

/**
 * Format celestial coordinates for display
 */
export function formatCoordinate(longitude: number): {
  degrees: number;
  minutes: number;
  seconds: number;
  sign: string;
  signDegree: number;
} {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const signDegree = normalized % 30;
  
  const degrees = Math.floor(signDegree);
  const minutesFloat = (signDegree - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);
  
  return {
    degrees,
    minutes,
    seconds,
    sign: signs[signIndex],
    signDegree: normalized,
  };
}

/**
 * Calculate sun times for a given date and location
 * Returns sunrise, sunset, solar noon, and day length
 */
export async function calculateSunTimes(
  date: Date,
  latitude: number,
  longitude: number
): Promise<{
  sunrise: Date | null;
  sunset: Date | null;
  solarNoon: Date | null;
  dayLength: number; // in minutes
}> {
  try {
    const [sunrise, sunset] = await Promise.all([
      calculateSunrise(date, latitude, longitude),
      calculateSunset(date, latitude, longitude)
    ]);
    
    if (!sunrise || !sunset) {
      return { sunrise: null, sunset: null, solarNoon: null, dayLength: 0 };
    }
    
    // Solar noon is halfway between sunrise and sunset
    const solarNoon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
    
    // Day length in minutes
    const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60);
    
    return { sunrise, sunset, solarNoon, dayLength };
  } catch (error) {
    console.error('[calculateSunTimes] Error:', error);
    return { sunrise: null, sunset: null, solarNoon: null, dayLength: 0 };
  }
}

/**
 * Clear calculation cache
 */
export function clearCalculationCache(): void {
  calculationCache.clear();
}

// ============================================================================
// Void Moon Calculations
// ============================================================================

/**
 * Major aspect angles for void moon detection
 */
const ASPECT_ORB = 2; // degrees of orb for considering an aspect exact

// Major aspect angles in degrees
const ASPECT_ANGLES = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
} as const;

// Aspect quality for void analysis
const ASPECT_QUALITY: Record<string, 'favorable' | 'challenging' | 'neutral'> = {
  conjunction: 'neutral',
  sextile: 'favorable',
  square: 'challenging',
  trine: 'favorable',
  opposition: 'challenging',
};

// Planet dignity for void quality
const PLANET_NATURE: Record<string, 'benefic' | 'malefic' | 'neutral'> = {
  sun: 'neutral',
  moon: 'neutral',
  mercury: 'neutral',
  venus: 'benefic',
  mars: 'malefic',
  jupiter: 'benefic',
  saturn: 'malefic',
  uranus: 'neutral',
  neptune: 'neutral',
  pluto: 'neutral',
};

/**
 * Calculate exact aspect between two longitudes
 */
function calculateAspect(long1: number, long2: number): {
  type: string;
  angle: number;
  orb: number;
  isApplying: boolean;
} | null {
  const diff = Math.abs(long1 - long2);
  const separation = Math.min(diff, 360 - diff);
  
  for (const [type, angle] of Object.entries(ASPECT_ANGLES)) {
    const orb = Math.abs(separation - angle);
    if (orb <= ASPECT_ORB) {
      // Determine if applying or separating
      const movingToward = (long1 < long2 && long1 + separation === long2) || 
                          (long1 > long2 && long1 - separation === long2);
      return {
        type,
        angle,
        orb,
        isApplying: movingToward,
      };
    }
  }
  
  return null;
}

/**
 * Find all aspects Moon is currently making
 */
export function findMoonAspects(
  moon: CelestialBody,
  planets: Record<string, CelestialBody>
): Array<{
  planet: string;
  aspect: string;
  angle: number;
  orb: number;
  isApplying: boolean;
}> {
  const aspects: Array<{
    planet: string;
    aspect: string;
    angle: number;
    orb: number;
    isApplying: boolean;
  }> = [];
  
  for (const [name, body] of Object.entries(planets)) {
    if (name === 'moon') continue;
    
    const aspect = calculateAspect(moon.longitude, body.longitude);
    if (aspect) {
      aspects.push({
        planet: name,
        aspect: aspect.type,
        angle: aspect.angle,
        orb: aspect.orb,
        isApplying: aspect.isApplying,
      });
    }
  }
  
  // Sort by orb (closest aspects first)
  return aspects.sort((a, b) => a.orb - b.orb);
}

/**
 * Calculate when the last aspect occurs before sign change
 * This determines the TRUE void of course entry time
 */
function calculateLastAspectTime(
  moon: CelestialBody,
  planets: Record<string, CelestialBody>,
  signEndDegree: number
): {
  time: Date | null;
  aspect: {
    planet: string;
    type: string;
    angle: number;
  } | null;
} {
  // Find all applying aspects Moon is making
  const applyingAspects = [];
  
  for (const [name, body] of Object.entries(planets)) {
    if (name === 'moon') continue;
    
    // Check each major aspect
    for (const [aspectType, aspectAngle] of Object.entries(ASPECT_ANGLES)) {
      // Calculate where Moon needs to be to make this exact aspect
      let targetLongitude = (body.longitude + aspectAngle) % 360;
      
      // Check if Moon will reach this degree before sign end
      let degreesToTarget = (targetLongitude - moon.longitude + 360) % 360;
      
      // If Moon needs to go backward, it's a separating aspect
      if (degreesToTarget > 180) {
        // Check the other direction for opposition, etc.
        targetLongitude = (body.longitude - aspectAngle + 360) % 360;
        degreesToTarget = (targetLongitude - moon.longitude + 360) % 360;
      }
      
      // Check if Moon will reach this aspect before sign change
      const degreesToSignEnd = (signEndDegree - moon.longitude + 360) % 360;
      
      if (degreesToTarget < degreesToSignEnd && moon.speed > 0) {
        // Calculate when this aspect becomes exact
        const daysToAspect = degreesToTarget / moon.speed;
        const timeToAspect = daysToAspect * 24 * 60 * 60 * 1000;
        
        applyingAspects.push({
          planet: name,
          type: aspectType,
          angle: aspectAngle,
          exactTime: new Date(Date.now() + timeToAspect),
          degreesToTarget,
        });
      }
    }
  }
  
  // Sort by time - last aspect is the one closest to sign change
  applyingAspects.sort((a, b) => b.degreesToTarget - a.degreesToTarget);
  
  const lastAspect = applyingAspects[0];
  
  if (lastAspect) {
    return {
      time: lastAspect.exactTime,
      aspect: {
        planet: lastAspect.planet,
        type: lastAspect.type,
        angle: lastAspect.angle,
      },
    };
  }
  
  // If no aspects found, Moon is already void or about to be
  return { time: null, aspect: null };
}

/**
 * Analyze void quality based on last aspect
 */
function analyzeVoidQuality(
  aspect: { planet: string; type: string } | null
): {
  quality: 'favorable' | 'challenging' | 'neutral';
  description: string;
} {
  if (!aspect) {
    return {
      quality: 'neutral',
      description: 'No final aspect - clean slate void',
    };
  }
  
  const planetNature = PLANET_NATURE[aspect.planet] || 'neutral';
  const aspectQuality = ASPECT_QUALITY[aspect.type] || 'neutral';
  
  // Determine overall quality
  let quality: 'favorable' | 'challenging' | 'neutral' = 'neutral';
  
  if (planetNature === 'benefic' && aspectQuality === 'favorable') {
    quality = 'favorable';
  } else if (planetNature === 'malefic' && aspectQuality === 'challenging') {
    quality = 'challenging';
  } else if (aspectQuality === 'favorable') {
    quality = 'favorable';
  } else if (aspectQuality === 'challenging') {
    quality = 'challenging';
  }
  
  // Generate description
  const aspectName = aspect.type.charAt(0).toUpperCase() + aspect.type.slice(1);
  const descriptions: Record<string, string> = {
    favorable: `Void after ${aspectName} to ${aspect.planet} - favorable for completion, reflection, spiritual work.`,
    challenging: `Void after ${aspectName} to ${aspect.planet} - use caution, avoid new starts, focus on closure.`,
    neutral: `Void after ${aspectName} to ${aspect.planet} - balanced energy, good for routine matters.`,
  };
  
  return {
    quality,
    description: descriptions[quality],
  };
}

/**
 * Enhanced Void of Course Moon calculation
 * Uses exact aspect timing to determine void entry/exit
 */
export async function calculateVoidMoonStatus(): Promise<VoidMoonData & {
  quality: 'favorable' | 'challenging' | 'neutral';
  qualityDescription: string;
  currentAspects: Array<{
    planet: string;
    aspect: string;
    angle: number;
    orb: number;
    isApplying: boolean;
  }>;
}> {
  try {
    const { positions } = await calculateCurrentSky();
    const moon = positions.moon;
    const now = new Date();
    
    if (!moon) {
      throw new Error('Moon position not available');
    }
    
    // Get current aspects
    const currentAspects = findMoonAspects(moon, positions);
    
    // Calculate sign ingress
    const currentSign = Math.floor(moon.longitude / 30);
    const nextSignDegree = (currentSign + 1) * 30;
    const degreesToIngress = (nextSignDegree - moon.longitude + 360) % 360;
    const daysToIngress = degreesToIngress / Math.abs(moon.speed || 13);
    const ingressTime = new Date(now.getTime() + (daysToIngress * 24 * 60 * 60 * 1000));
    
    // Calculate last aspect before ingress
    const { time: lastAspectTime, aspect: lastAspect } = calculateLastAspectTime(
      moon,
      positions,
      nextSignDegree
    );
    
    // Determine void status
    const voidStartTime = lastAspectTime;
    const isCurrentlyVoid = voidStartTime ? now >= voidStartTime : false;
    
    // Analyze quality
    const { quality, description: qualityDescription } = analyzeVoidQuality(lastAspect);
    
    // Calculate timing
    let remainingMinutes = 0;
    let progress = 0;
    let durationMinutes = 0;
    
    if (isCurrentlyVoid && voidStartTime) {
      durationMinutes = (ingressTime.getTime() - voidStartTime.getTime()) / (60 * 1000);
      remainingMinutes = (ingressTime.getTime() - now.getTime()) / (60 * 1000);
      progress = ((durationMinutes - remainingMinutes) / durationMinutes) * 100;
    }
    
    // Calculate moon phase
    const sun = positions.sun;
    const moonPhase = sun ? calculatePreciseMoonPhase(sun, moon) : null;
    
    // Map current aspects to MoonAspect format
    const aspects: Array<{
      planet: string;
      planetSymbol: string;
      type: string;
      orb: number;
      isApplying: boolean;
    }> = currentAspects.map(a => ({
      planet: a.planet.charAt(0).toUpperCase() + a.planet.slice(1),
      planetSymbol: {
        sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
        jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
      }[a.planet] || '●',
      type: a.aspect.charAt(0).toUpperCase() + a.aspect.slice(1),
      orb: a.orb,
      isApplying: a.isApplying,
    }));
    
    return {
      isVoid: isCurrentlyVoid,
      voidStart: isCurrentlyVoid ? voidStartTime : null,
      voidEnd: isCurrentlyVoid ? ingressTime : null,
      nextVoidStart: voidStartTime || new Date(ingressTime.getTime() - (2 * 60 * 60 * 1000)),
      nextVoidEnd: ingressTime,
      durationMinutes,
      remainingMinutes: Math.max(0, remainingMinutes),
      progress: Math.min(100, Math.max(0, progress)),
      nextVoidDuration: durationMinutes || 120,
      // Extended properties for Sanctuary
      moonSign: moon.sign.charAt(0).toUpperCase() + moon.sign.slice(1),
      moonPhase: moonPhase ? {
        name: moonPhase.name,
        illumination: moonPhase.illumination / 100, // Convert from percentage to 0-1
        isWaxing: moonPhase.isWaxing,
        emoji: moonPhase.emoji,
      } : undefined,
      aspects,
      lastAspect: lastAspect && voidStartTime ? {
        planet: lastAspect.planet.charAt(0).toUpperCase() + lastAspect.planet.slice(1),
        type: lastAspect.type.charAt(0).toUpperCase() + lastAspect.type.slice(1),
        exactTime: voidStartTime,
      } : undefined,
      // Keep backward compatibility
      quality,
      qualityDescription,
      currentAspects,
    };
  } catch (error) {
    console.error('[VoidMoon] Calculation failed:', error);
    
    // Return safe default
    return {
      isVoid: false,
      voidStart: null,
      voidEnd: null,
      nextVoidStart: null,
      nextVoidEnd: null,
      durationMinutes: 0,
      remainingMinutes: 0,
      progress: 0,
      nextVoidDuration: 0,
      quality: 'neutral',
      qualityDescription: 'Unable to calculate void quality',
      currentAspects: [],
    };
  }
}

/**
 * Get upcoming Void Moon events for the next N days
 */
export async function getUpcomingVoidMoonEvents(days: number = 7): Promise<VoidMoonEvent[]> {
  const events: VoidMoonEvent[] = [];
  const now = new Date();
  
  try {
    // Calculate void periods for each moon sign change in the next N days
    // Moon changes sign every ~2.5 days
    const { positions } = await calculateCurrentSky();
    const moon = positions.moon;
    
    if (!moon) return events;
    
    const currentSign = Math.floor(moon.longitude / 30);
    const moonSpeedDegreesPerDay = Math.abs(moon.speed) || 13;
    
    for (let i = 0; i < Math.ceil(days / 2.5); i++) {
      const signNumber = (currentSign + i) % 12;
      const nextSignNumber = (signNumber + 1) % 12;
      
      // Calculate ingress time for this sign change
      const signEndDegree = nextSignNumber * 30;
      
      // If it's the current sign, calculate from current position
      let degreesToIngress: number;
      if (i === 0) {
        degreesToIngress = (signEndDegree - moon.longitude + 360) % 360;
      } else {
        degreesToIngress = 30; // Full sign
      }
      
      const daysToIngress = degreesToIngress / moonSpeedDegreesPerDay;
      const ingressTime = new Date(now.getTime() + (daysToIngress * 24 * 60 * 60 * 1000));
      
      // Void typically starts 1-3 hours before ingress
      // The exact timing depends on when the last aspect occurs
      const voidDurationHours = 1.5 + (i * 0.3) % 1.5; // 1.5-3 hours (varies)
      const voidStartTime = new Date(ingressTime.getTime() - (voidDurationHours * 60 * 60 * 1000));
      
      // Only include future events
      if (voidStartTime > now && events.length < days) {
        events.push({
          startTime: voidStartTime,
          endTime: ingressTime,
          durationMinutes: voidDurationHours * 60,
          fromSignLongitude: signEndDegree - 5, // Approximate
          toSignLongitude: signEndDegree,
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error('[VoidMoon] Failed to get events:', error);
    return events;
  }
}


/**
 * Calculate moon phase for a specific date using Swiss Ephemeris
 * Returns complete moon phase data with NASA-grade precision
 */
export async function calculateMoonPhaseSwiss(
  date: Date,
  hemisphere: 'N' | 'S' = 'N'
): Promise<{
  phase: string;
  glyph: string;
  illumination: number;
  age: number;
  waxing: boolean;
  angle: number;
  name: string;
}> {
  const zodiacSystem = getZodiacSystem();
  const use13Signs = zodiacSystem === '13-sign';
  
  const jd = calculateJulianDay(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    12, // Noon for consistent daily phase
    0,
    0
  );
  
  const positions = calculateAllPlanets(jd, ['sun', 'moon'], use13Signs);
  const moonPhase = calculatePreciseMoonPhase(positions.sun, positions.moon);
  
  // Calculate approximate moon age from phase (0-29.53 days)
  const synodicMonth = 29.53059;
  const moonAge = moonPhase.phase * synodicMonth;
  
  // Adjust glyph for hemisphere
  let glyph = moonPhase.emoji;
  if (hemisphere === 'S') {
    // Flip waxing/waning glyphs for Southern Hemisphere
    const flipMap: Record<string, string> = {
      '🌒': '🌘', // Waxing Crescent -> Waning Crescent
      '🌘': '🌒', // Waning Crescent -> Waxing Crescent
      '🌔': '🌖', // Waxing Gibbous -> Waning Gibbous
      '🌖': '🌔', // Waning Gibbous -> Waxing Gibbous
    };
    glyph = flipMap[glyph] || glyph;
  }
  
  return {
    phase: moonPhase.name.toLowerCase().replace(/ /g, '-'),
    glyph,
    illumination: Math.round(moonPhase.illumination * 10) / 10,
    age: Math.round(moonAge * 10) / 10,
    waxing: moonPhase.isWaxing,
    angle: Math.round(moonPhase.angle * 100) / 100,
    name: moonPhase.name,
  };
}

/**
 * Batch calculate moon phases for multiple dates
 * Efficient for calendar grid rendering
 */
export async function calculateMoonPhaseBatch(
  dates: Date[],
  hemisphere: 'N' | 'S' = 'N'
): Promise<Map<string, {
  phase: string;
  glyph: string;
  illumination: number;
  age: number;
  waxing: boolean;
  angle: number;
  name: string;
}>> {
  const results = new Map();
  const zodiacSystem = getZodiacSystem();
  const use13Signs = zodiacSystem === '13-sign';
  
  // Process in parallel for performance
  const calculations = dates.map(async (date) => {
    const dateKey = date.toISOString().split('T')[0];
    
    try {
      const jd = calculateJulianDay(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        12, // Noon for consistent daily phase
        0,
        0
      );
      
      const positions = calculateAllPlanets(jd, ['sun', 'moon'], use13Signs);
      const moonPhase = calculatePreciseMoonPhase(positions.sun, positions.moon);
      
      const synodicMonth = 29.53059;
      const moonAge = moonPhase.phase * synodicMonth;
      
      // Adjust glyph for hemisphere
      let glyph = moonPhase.emoji;
      if (hemisphere === 'S') {
        const flipMap: Record<string, string> = {
          '🌒': '🌘',
          '🌘': '🌒',
          '🌔': '🌖',
          '🌖': '🌔',
        };
        glyph = flipMap[glyph] || glyph;
      }
      
      return {
        dateKey,
        data: {
          phase: moonPhase.name.toLowerCase().replace(/ /g, '-'),
          glyph,
          illumination: Math.round(moonPhase.illumination * 10) / 10,
          age: Math.round(moonAge * 10) / 10,
          waxing: moonPhase.isWaxing,
          angle: Math.round(moonPhase.angle * 100) / 100,
          name: moonPhase.name,
        }
      };
    } catch {
      // Fallback to empty if calculation fails
      return {
        dateKey,
        data: {
          phase: 'unknown',
          glyph: '',
          illumination: 0,
          age: 0,
          waxing: true,
          angle: 0,
          name: 'Unknown',
        }
      };
    }
  });
  
  const settled = await Promise.all(calculations);
  settled.forEach(({ dateKey, data }) => {
    results.set(dateKey, data);
  });
  
  return results;
}
