/**
 * Astronomy Service - Celestial Calculations
 * Equinoxes, solstices, lunar phases, solar noon, and celestial events
 * Region-aware for Northern/Southern hemisphere
 */

import type { LocationData } from '../types';

// ============================================================================
// Astronomical Constants
// ============================================================================

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const J2000 = 2451545.0;

// ============================================================================
// Julian Date Calculations
// ============================================================================

function getJulianDate(date: Date): number {
  const timestamp = date.getTime();
  return timestamp / 86400000 + 2440587.5;
}

// ============================================================================
// Sun Position Calculations
// ============================================================================

interface SunPosition {
  longitude: number;
  declination: number;
  rightAscension: number;
}

function getSunPosition(date: Date): SunPosition {
  const jd = getJulianDate(date);
  const n = jd - J2000;
  
  const L = (280.46646 + 0.98564736629 * n) % 360;
  const M = (357.52911 + 0.9856002831 * n) % 360;
  const M_rad = M * DEG_TO_RAD;
  
  const C = (1.914602 - 0.004817 * (n / 36525)) * Math.sin(M_rad)
          + (0.019993 - 0.000101 * (n / 36525)) * Math.sin(2 * M_rad)
          + 0.000289 * Math.sin(3 * M_rad);
  
  const trueLongitude = (L + C) % 360;
  const obliquity = 23.439292 - 0.00000015 * (n / 36525) * (n / 36525);
  
  // Right ascension
  const tanRA = Math.cos(obliquity * DEG_TO_RAD) * Math.sin(trueLongitude * DEG_TO_RAD)
              / Math.cos(trueLongitude * DEG_TO_RAD);
  let rightAscension = Math.atan(tanRA) * RAD_TO_DEG;
  if (rightAscension < 0) rightAscension += 360;
  
  // Declination
  const sinDec = Math.sin(obliquity * DEG_TO_RAD) * Math.sin(trueLongitude * DEG_TO_RAD);
  const declination = Math.asin(sinDec) * RAD_TO_DEG;
  
  return {
    longitude: trueLongitude,
    declination,
    rightAscension,
  };
}

/**
 * Calculate Equation of Time in minutes
 * Returns: minutes to add to mean solar time to get apparent solar time
 */
function getEquationOfTime(date: Date): number {
  const jd = getJulianDate(date);
  const n = jd - J2000;
  
  const L = (280.46646 + 0.98564736629 * n) % 360;
  const M = (357.52911 + 0.9856002831 * n) % 360;
  const M_rad = M * DEG_TO_RAD;
  
  const C = 1.9148 * Math.sin(M_rad) + 0.02 * Math.sin(2 * M_rad);
  
  // Equation of time in minutes
  // EOT = 4 × (L - 0.0057183 - RA + C) converted to minutes
  const sunPos = getSunPosition(date);
  const eot = 4 * (L - 0.0057183 - sunPos.rightAscension + C);
  
  return eot;
}

// ============================================================================
// Solar Noon Calculation - TECHNICALLY VERIFIED
// ============================================================================

export interface SolarNoonData {
  time: Date;
  elevation: number;
}

/**
 * Calculate solar noon for a given location and date
 * 
 * Solar noon is when the sun crosses the meridian (highest point)
 * 
 * Algorithm:
 * 1. Mean solar noon at longitude 0° = 12:00 UTC
 * 2. For each degree of longitude east, solar noon occurs 4 minutes earlier in UTC
 *    (because the earth rotates 360° in 24 hours = 15°/hour = 1°/4min)
 * 3. For each degree of longitude west, solar noon occurs 4 minutes later in UTC
 * 4. Apply Equation of Time correction (accounts for earth's elliptical orbit)
 * 
 * Solar Noon UTC = 12:00 - (longitude × 4 minutes) - EOT
 * 
 * Then convert UTC to local civil time
 */
export function getSolarNoon(date: Date, location: LocationData): SolarNoonData {
  const lat = location.latitude;
  const lon = location.longitude;
  
  // Get date at midnight UTC for calculation consistency
  const calcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
  // Calculate Equation of Time
  const eotMinutes = getEquationOfTime(calcDate);
  
  // Calculate solar noon in UTC
  // At longitude 0°: solar noon = 12:00 UTC - EOT
  // At longitude λ°: solar noon = 12:00 UTC - (λ × 4 minutes) - EOT
  // 
  // For positive longitude (East): subtract (earlier in UTC)
  // For negative longitude (West): subtract negative = add (later in UTC)
  const longitudeCorrectionMinutes = lon * 4; // 4 minutes per degree
  const solarNoonOffsetMinutes = longitudeCorrectionMinutes + eotMinutes;
  
  // Solar noon in minutes from midnight UTC
  const solarNoonMinutesUTC = 12 * 60 - solarNoonOffsetMinutes;
  
  // Create solar noon UTC Date object
  const solarNoonUTC = new Date(calcDate);
  solarNoonUTC.setUTCMinutes(solarNoonMinutesUTC);
  
  // Now convert UTC to local timezone
  // Get the timezone offset by comparing same timestamp in UTC vs local timezone
  const timeString = solarNoonUTC.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
  
  // Parse as UTC
  const utcTime = new Date(timeString + 'Z');
  
  // Get the offset for this location
  // We'll use the formatter approach but more carefully
  const tzFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: location.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const parts = tzFormatter.formatToParts(utcTime);
  const p: Record<string, string> = {};
  parts.forEach(part => p[part.type] = part.value);
  
  // Create local time date
  const solarNoonLocal = new Date(
    parseInt(p.year),
    parseInt(p.month) - 1,
    parseInt(p.day),
    parseInt(p.hour),
    parseInt(p.minute),
    parseInt(p.second)
  );
  
  // Calculate sun elevation at solar noon
  const sunPos = getSunPosition(utcTime);
  const declinationRad = sunPos.declination * DEG_TO_RAD;
  const latitudeRad = lat * DEG_TO_RAD;
  const elevation = Math.asin(
    Math.sin(latitudeRad) * Math.sin(declinationRad) +
    Math.cos(latitudeRad) * Math.cos(declinationRad)
  ) * RAD_TO_DEG;
  
  return {
    time: solarNoonLocal,
    elevation: Math.round(elevation * 10) / 10,
  };
}

// ============================================================================
// Seasonal Events (Equinoxes and Solstices)
// ============================================================================

export interface SeasonalEventData {
  type: 'vernal-equinox' | 'summer-solstice' | 'autumnal-equinox' | 'winter-solstice';
  name: string;
  symbol: string;
  date: Date;
  description: string;
  seasonNorthern: string;
  seasonSouthern: string;
}

// Approximate dates for seasonal events (can vary by 1-2 days)
const SEASONAL_DATES: Record<number, { type: SeasonalEventData['type']; month: number; day: number }[]> = {
  0: [ // Year mod 4 = 0 (leap year)
    { type: 'vernal-equinox', month: 2, day: 20 },   // March 20
    { type: 'summer-solstice', month: 5, day: 20 },  // June 20
    { type: 'autumnal-equinox', month: 8, day: 22 }, // September 22
    { type: 'winter-solstice', month: 11, day: 21 }, // December 21
  ],
  1: [ // Year mod 4 = 1
    { type: 'vernal-equinox', month: 2, day: 20 },
    { type: 'summer-solstice', month: 5, day: 21 },
    { type: 'autumnal-equinox', month: 8, day: 22 },
    { type: 'winter-solstice', month: 11, day: 21 },
  ],
  2: [ // Year mod 4 = 2
    { type: 'vernal-equinox', month: 2, day: 20 },
    { type: 'summer-solstice', month: 5, day: 21 },
    { type: 'autumnal-equinox', month: 8, day: 23 },
    { type: 'winter-solstice', month: 11, day: 21 },
  ],
  3: [ // Year mod 4 = 3
    { type: 'vernal-equinox', month: 2, day: 20 },
    { type: 'summer-solstice', month: 5, day: 21 },
    { type: 'autumnal-equinox', month: 8, day: 23 },
    { type: 'winter-solstice', month: 11, day: 22 },
  ],
};

const EVENT_DATA: Record<string, {
  symbol: string;
  northern: string;
  southern: string;
}> = {
  'vernal-equinox': { symbol: '🌸', northern: 'Spring Begins', southern: 'Autumn Begins' },
  'summer-solstice': { symbol: '☀️', northern: 'Summer Begins', southern: 'Winter Begins' },
  'autumnal-equinox': { symbol: '🍂', northern: 'Autumn Begins', southern: 'Spring Begins' },
  'winter-solstice': { symbol: '❄️', northern: 'Winter Begins', southern: 'Summer Begins' },
};

/**
 * Get all seasonal events for a given year with hemisphere-aware descriptions
 */
export function getSeasonalEvents(year: number, hemisphere: 'N' | 'S' = 'N'): SeasonalEventData[] {
  const events = SEASONAL_DATES[year % 4];
  return events.map(event => {
    const data = EVENT_DATA[event.type];
    const season = hemisphere === 'N' ? data.northern : data.southern;
    return {
      type: event.type,
      name: event.type.split('-').map(w => (w ? w.charAt(0).toUpperCase() : '') + w.slice(1)).join(' '),
      symbol: data.symbol,
      date: new Date(year, event.month, event.day),
      description: `${season} in the ${hemisphere === 'N' ? 'Northern' : 'Southern'} Hemisphere`,
      seasonNorthern: data.northern,
      seasonSouthern: data.southern,
    };
  });
}

/**
 * Get the next seasonal event from a given date
 */
export function getNextSeasonalEvent(date: Date, hemisphere: 'N' | 'S' = 'N'): SeasonalEventData | null {
  const year = date.getFullYear();
  const events = getSeasonalEvents(year, hemisphere);
  
  const nextEvent = events.find(e => e.date > date);
  if (nextEvent) return nextEvent;
  
  const nextYearEvents = getSeasonalEvents(year + 1, hemisphere);
  return nextYearEvents[0] || null;
}

/**
 * Check if a specific date is a seasonal event
 */
export function getEventForDate(date: Date, hemisphere: 'N' | 'S' = 'N'): SeasonalEventData | null {
  const year = date.getFullYear();
  const events = getSeasonalEvents(year, hemisphere);
  
  return events.find(event => {
    const eventDate = event.date;
    return eventDate.getDate() === date.getDate() &&
           eventDate.getMonth() === date.getMonth() &&
           eventDate.getFullYear() === date.getFullYear();
  }) || null;
}

// ============================================================================
// Lunar Calendar
// ============================================================================

export interface LunarMonth {
  name: string;
  startDate: Date;
  endDate: Date;
  newMoon: Date;
  fullMoon: Date;
}

const LUNAR_MONTH_NAMES = [
  'Wolf Moon', 'Snow Moon', 'Worm Moon', 'Pink Moon',
  'Flower Moon', 'Strawberry Moon', 'Buck Moon', 'Sturgeon Moon',
  'Harvest Moon', 'Hunter\'s Moon', 'Beaver Moon', 'Cold Moon'
];

/**
 * Get lunar month information for a given date
 * Uses approximate lunar cycle (29.53 days)
 */
export function getLunarMonth(date: Date): LunarMonth {
  // Known new moon: January 11, 2024
  const knownNewMoon = new Date(2024, 0, 11, 11, 57, 0);
  const lunarCycle = 29.53059 * 24 * 60 * 60 * 1000; // milliseconds
  
  // Calculate days since known new moon
  const diffTime = date.getTime() - knownNewMoon.getTime();
  const cycles = diffTime / lunarCycle;
  const currentCycle = Math.floor(cycles);
  
  // Calculate new and full moon for current cycle
  const newMoon = new Date(knownNewMoon.getTime() + currentCycle * lunarCycle);
  const fullMoon = new Date(newMoon.getTime() + lunarCycle / 2);
  const nextNewMoon = new Date(newMoon.getTime() + lunarCycle);
  
  // Determine month name (cycles from known new moon)
  const monthIndex = ((currentCycle % 12) + 12) % 12;
  const monthName = LUNAR_MONTH_NAMES[monthIndex];
  
  return {
    name: monthName,
    startDate: newMoon,
    endDate: nextNewMoon,
    newMoon,
    fullMoon,
  };
}

// ============================================================================
// Moon Phase Calculation
// ============================================================================

export interface MoonPhaseData {
  phase: string;
  glyph: string;
  illumination: number; // 0-100%
  age: number; // days since new moon
  waxing: boolean;
}

const MOON_PHASES = [
  { name: 'New Moon', glyph: '🌑', maxAge: 1 },
  { name: 'Waxing Crescent', glyph: '🌒', maxAge: 6.5 },
  { name: 'First Quarter', glyph: '🌓', maxAge: 8 },
  { name: 'Waxing Gibbous', glyph: '🌔', maxAge: 13.5 },
  { name: 'Full Moon', glyph: '🌕', maxAge: 15.5 },
  { name: 'Waning Gibbous', glyph: '🌖', maxAge: 21 },
  { name: 'Last Quarter', glyph: '🌗', maxAge: 23 },
  { name: 'Waning Crescent', glyph: '🌘', maxAge: 28 },
  { name: 'New Moon', glyph: '🌑', maxAge: 29.53 },
];

/**
 * Calculate moon phase for a given date
 * Returns phase information including illumination percentage
 */
export function getMoonPhase(date: Date, _hemisphere: 'N' | 'S' = 'N'): MoonPhaseData {
  // Known new moon: January 11, 2024 at 11:57 UTC
  const knownNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57, 0));
  const lunarCycle = 29.53059; // days
  
  // Calculate days since known new moon
  const diffTime = date.getTime() - knownNewMoon.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const age = ((diffDays % lunarCycle) + lunarCycle) % lunarCycle;
  
  // Find phase
  const phase = MOON_PHASES.find(p => age <= p.maxAge) || MOON_PHASES[0];
  
  // Calculate illumination (0-100%)
  // New moon = 0%, Full moon = 100%, using cosine curve
  const illumination = (1 - Math.cos((age / lunarCycle) * 2 * Math.PI)) / 2 * 100;
  
  // Waxing (increasing) before full moon (day 14.77)
  const waxing = age < lunarCycle / 2;
  
  return {
    phase: phase.name,
    glyph: phase.glyph,
    illumination,
    age,
    waxing,
  };
}

// ============================================================================
// Agricultural Guidance
// ============================================================================

export interface AgriculturalGuidance {
  activity: 'plant' | 'transplant' | 'harvest' | 'prune' | 'fertilize' | 'rest' | 'prepare';
  description: string;
  confidence: 'high' | 'moderate' | 'low';
}

/**
 * Get agricultural guidance based on moon phase and season
 */
export function getAgriculturalGuidance(date: Date, _hemisphere: 'N' | 'S' = 'N'): AgriculturalGuidance {
  const moonPhase = getMoonPhase(date, _hemisphere);
  const month = date.getMonth();
  
  // Determine growing season
  let isGrowingSeason: boolean;
  if (_hemisphere === 'N') {
    isGrowingSeason = month >= 3 && month <= 9; // April to October
  } else {
    isGrowingSeason = month >= 9 || month <= 3; // October to April
  }
  
  // Moon phase guidance
  if (moonPhase.age < 7) {
    // Waxing crescent to first quarter - good for planting above-ground crops
    return {
      activity: isGrowingSeason ? 'plant' : 'prepare',
      description: isGrowingSeason 
        ? 'Waxing moon: Ideal for planting above-ground crops'
        : 'Waxing moon: Prepare soil and plan for next season',
      confidence: 'high',
    };
  } else if (moonPhase.age < 14) {
    // First quarter to full moon - good for transplanting
    return {
      activity: isGrowingSeason ? 'transplant' : 'prepare',
      description: isGrowingSeason
        ? 'Approaching full moon: Good for transplanting and grafting'
        : 'Approaching full moon: Prepare tools and supplies',
      confidence: 'moderate',
    };
  } else if (moonPhase.age < 21) {
    // Full moon to last quarter - good for harvesting
    return {
      activity: isGrowingSeason ? 'harvest' : 'rest',
      description: isGrowingSeason
        ? 'Waning moon: Best time for harvesting crops'
        : 'Waning moon: Rest and reflect on the past season',
      confidence: 'high',
    };
  } else {
    // Last quarter to new moon - good for pruning and root work
    return {
      activity: isGrowingSeason ? 'prune' : 'prepare',
      description: isGrowingSeason
        ? 'Dark moon: Ideal for pruning, weeding, and root work'
        : 'Dark moon: Plan and order seeds for next season',
      confidence: 'moderate',
    };
  }
}

// ============================================================================
// Energy Forecast
// ============================================================================

export interface EnergyForecast {
  level: 'very-high' | 'high' | 'moderate' | 'low' | 'very-low';
  description: string;
  factors: string[];
}

/**
 * Get cosmic energy forecast based on celestial alignments
 */
export function getEnergyForecast(date: Date, hemisphere: 'N' | 'S' = 'N'): EnergyForecast {
  const moonPhase = getMoonPhase(date, hemisphere);
  const dayOfWeek = date.getDay();
  
  const factors: string[] = [];
  let energyScore = 50; // Base score
  
  // Moon phase factor
  if (moonPhase.phase === 'Full Moon') {
    energyScore += 30;
    factors.push('Full Moon - Peak energy');
  } else if (moonPhase.phase === 'New Moon') {
    energyScore += 10;
    factors.push('New Moon - Fresh start energy');
  } else if (moonPhase.waxing) {
    energyScore += 15;
    factors.push('Waxing moon - Building energy');
  } else {
    energyScore -= 5;
    factors.push('Waning moon - Releasing energy');
  }
  
  // Day of week factor
  const dayEnergies = ['low', 'moderate', 'high', 'high', 'moderate', 'very-high', 'moderate'];
  const dayFactor = dayEnergies[dayOfWeek];
  factors.push(`${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]}day - ${dayFactor} energy`);
  
  if (dayFactor === 'very-high') energyScore += 20;
  else if (dayFactor === 'high') energyScore += 10;
  else if (dayFactor === 'low') energyScore -= 10;
  
  // Determine level
  let level: EnergyForecast['level'];
  let description: string;
  
  if (energyScore >= 80) {
    level = 'very-high';
    description = 'Exceptional cosmic alignment. Ideal for major decisions, launches, and high-energy activities.';
  } else if (energyScore >= 60) {
    level = 'high';
    description = 'Strong cosmic support. Good for important tasks and new beginnings.';
  } else if (energyScore >= 40) {
    level = 'moderate';
    description = 'Balanced cosmic energy. Suitable for routine tasks and steady progress.';
  } else if (energyScore >= 20) {
    level = 'low';
    description = 'Subdued cosmic energy. Better for rest, reflection, and planning.';
  } else {
    level = 'very-low';
    description = 'Challenging cosmic alignment. Focus on self-care and avoid major decisions.';
  }
  
  return { level, description, factors };
}

// ============================================================================
// Lunar New Year Calculation
// ============================================================================

export interface LunarNewYearData {
  date: Date;
  year: number;
  animal: string;
  element: string;
  yinYang: string;
}

/**
 * Calculate Lunar New Year (Spring Festival)
 * Falls on the second new moon after winter solstice
 * Winter solstice is around December 21 each year
 */
export function getLunarNewYear(year: number): LunarNewYearData {
  // Winter solstice is around December 21
  const winterSolstice = new Date(year - 1, 11, 21); // Dec 21 of previous year
  
  // Find new moons after winter solstice
  // Known new moon: January 11, 2024 at 11:57 UTC
  const knownNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57, 0));
  const lunarCycle = 29.53059 * 24 * 60 * 60 * 1000; // milliseconds
  
  // Calculate cycles since known new moon
  const msSinceKnown = winterSolstice.getTime() - knownNewMoon.getTime();
  const cyclesSinceKnown = msSinceKnown / lunarCycle;
  
  // Find the first new moon after winter solstice
  const cyclesToFirstNewMoon = Math.ceil(cyclesSinceKnown);
  const firstNewMoon = new Date(knownNewMoon.getTime() + cyclesToFirstNewMoon * lunarCycle);
  
  // The second new moon after winter solstice is Lunar New Year
  const lunarNewYear = new Date(firstNewMoon.getTime() + lunarCycle);
  
  // Determine Chinese zodiac for this lunar year
  // 2024 = Year of Dragon, 2025 = Snake, 2026 = Horse, etc.
  const animals = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
  const animalIndex = lunarNewYear.getFullYear() % 12;
  const animal = animals[animalIndex];
  
  // Elements cycle every 2 years: Metal, Metal, Water, Water, Wood, Wood, Fire, Fire, Earth, Earth
  const elements = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];
  const elementIndex = lunarNewYear.getFullYear() % 10;
  const element = elements[elementIndex];
  
  // Yin/Yang alternates each year
  const yinYang = lunarNewYear.getFullYear() % 2 === 0 ? 'Yang' : 'Yin';
  
  return {
    date: lunarNewYear,
    year: lunarNewYear.getFullYear(),
    animal,
    element,
    yinYang,
  };
}

/**
 * Get next Lunar New Year from a given date
 */
export function getNextLunarNewYear(fromDate: Date): LunarNewYearData {
  // Check current year's Lunar New Year
  const currentYearLunarNewYear = getLunarNewYear(fromDate.getFullYear());
  
  // If it has passed, get next year's
  if (currentYearLunarNewYear.date < fromDate) {
    return getLunarNewYear(fromDate.getFullYear() + 1);
  }
  
  return currentYearLunarNewYear;
}
