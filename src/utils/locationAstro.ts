/**
 * HEKA Location-Aware Astrology Utilities
 * Handles hemisphere differences, extreme latitudes, and seasonal awareness
 */

import { ZodiacSign, PlanetPosition } from '../types/astrology';


// Hemisphere types
export type Hemisphere = 'northern' | 'southern' | 'equatorial';
export type LatitudeZone = 'temperate' | 'tropical' | 'polar' | 'extreme';

// Location data with astro context
export interface AstroLocation {
  name: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  timezone: string;
  hemisphere: Hemisphere;
  latitudeZone: LatitudeZone;
  isExtremeLatitude: boolean;
}

// Determine hemisphere from latitude
export function getHemisphere(latitude: number): Hemisphere {
  if (latitude > 23.5 || latitude < -23.5) {
    return latitude > 0 ? 'northern' : 'southern';
  }
  return 'equatorial';
}

// Determine latitude zone
export function getLatitudeZone(latitude: number): LatitudeZone {
  const absLat = Math.abs(latitude);
  if (absLat > 66.5) return 'extreme'; // Arctic/Antarctic
  if (absLat > 50) return 'polar';     // High latitudes
  if (absLat < 23.5) return 'tropical'; // Tropical
  return 'temperate';                   // Temperate
}

// Check if latitude requires special handling
export function isExtremeLatitude(latitude: number): boolean {
  return Math.abs(latitude) > 66.5;
}

// Get astro location from coordinates
export function getAstroLocation(
  name: string,
  latitude: number,
  longitude: number,
  timezone: string,
  altitude?: number
): AstroLocation {
  return {
    name,
    latitude,
    longitude,
    altitude,
    timezone,
    hemisphere: getHemisphere(latitude),
    latitudeZone: getLatitudeZone(latitude),
    isExtremeLatitude: isExtremeLatitude(latitude),
  };
}

// Season for a given date and hemisphere
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export function getSeason(date: Date, hemisphere: Hemisphere): Season {
  const month = date.getMonth(); // 0-11
  
  if (hemisphere === 'northern') {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  } else if (hemisphere === 'southern') {
    if (month >= 2 && month <= 4) return 'autumn';
    if (month >= 5 && month <= 7) return 'winter';
    if (month >= 8 && month <= 10) return 'spring';
    return 'summer';
  }
  
  // Equatorial - use wet/dry but return closest season
  return 'spring';
}

// Get zodiac season (tropical zodiac alignment)
export function getZodiacSeason(sign: ZodiacSign): Season {
  const seasonMap: Record<ZodiacSign, Season> = {
    aries: 'spring', taurus: 'spring', gemini: 'spring',
    cancer: 'summer', leo: 'summer', virgo: 'summer',
    libra: 'autumn', scorpio: 'autumn', ophiuchus: 'autumn', sagittarius: 'autumn',
    capricorn: 'winter', aquarius: 'winter', pisces: 'winter',
  };
  return seasonMap[sign];
}

// Check if current season matches zodiac season
export function isZodiacInSeason(sign: ZodiacSign, date: Date, hemisphere: Hemisphere): boolean {
  const currentSeason = getSeason(date, hemisphere);
  const zodiacSeason = getZodiacSeason(sign);
  return currentSeason === zodiacSeason;
}

// Southern Hemisphere house calculation adjustments
// In Southern Hemisphere, the house cusps are reversed
export function adjustHousesForSouthernHemisphere(houses: any[], latitude: number): any[] {
  if (latitude >= 0) return houses; // Northern hemisphere, no change
  
  // For Southern Hemisphere, we need to adjust the house cusp calculations
  // This is a simplified adjustment - full implementation requires complex spherical trig
  return houses.map((house, _index) => {
    // const oppositeIndex = (_index + 6) % 12;
    return {
      ...house,
      // Houses are mirrored in Southern Hemisphere
      adjustedForSouthernHemisphere: true,
    };
  });
}

// Get appropriate house system based on latitude
export function getRecommendedHouseSystem(latitude: number): string {
  const absLat = Math.abs(latitude);
  
  if (absLat > 66.5) {
    // Extreme latitudes - Placidus fails, use Equal or Whole Sign
    return 'whole-sign';
  } else if (absLat > 60) {
    // High latitudes - Placidus becomes distorted
    return 'equal';
  }
  
  // Standard latitudes - Placidus works well
  return 'placidus';
}

// Seasonal daily tip adjustments
export interface SeasonalContext {
  season: Season;
  hemisphere: Hemisphere;
  daysSinceSolstice: number;
  daysUntilEquinox: number;
  zodiacInPower: ZodiacSign[];
}

export function getSeasonalContext(date: Date, latitude: number): SeasonalContext {
  const hemisphere = getHemisphere(latitude);
  const season = getSeason(date, hemisphere);
  
  // Calculate rough days since last solstice/equinox
  // const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Simplified calculation
  let daysSinceSolstice = 0;
  let daysUntilEquinox = 0;
  
  if (hemisphere === 'northern') {
    if (season === 'winter') {
      daysSinceSolstice = month * 30 + day; // Days since Dec 21
      daysUntilEquinox = 90 - (month * 30 + day - 80); // Approx days to March 21
    } else if (season === 'spring') {
      daysSinceSolstice = month * 30 + day - 80;
      daysUntilEquinox = 90 - (month * 30 + day - 172); // Days to June 21
    }
  }
  
  // Zodiac signs in power during this season
  const zodiacInPower: ZodiacSign[] = {
    spring: ['aries', 'taurus', 'gemini'],
    summer: ['cancer', 'leo', 'virgo'],
    autumn: ['libra', 'scorpio', 'sagittarius'],
    winter: ['capricorn', 'aquarius', 'pisces'],
  }[season] as ZodiacSign[];
  
  return {
    season,
    hemisphere,
    daysSinceSolstice,
    daysUntilEquinox,
    zodiacInPower,
  };
}

// Get seasonally-adjusted guidance
export function getSeasonalGuidance(
  baseGuidance: string,
  date: Date,
  latitude: number,
  sunSign?: ZodiacSign
): string {
  const context = getSeasonalContext(date, latitude);
  
  let seasonalAddendum = '';
  
  // Add seasonal context
  if (context.hemisphere === 'southern') {
    seasonalAddendum += ` In the ${context.season} of the Southern Hemisphere, energies may feel inverted from traditional descriptions.`;
  }
  
  // Check if sun sign is in season
  if (sunSign && isZodiacInSeason(sunSign, date, context.hemisphere)) {
    seasonalAddendum += ` Your Sun sign ${sunSign} is in its natural season - your power is amplified.`;
  }
  
  // Special seasonal notes
  if (context.daysSinceSolstice < 14) {
    seasonalAddendum += ` We are in the potent window following the solstice - set powerful intentions.`;
  }
  
  return baseGuidance + seasonalAddendum;
}

// Extreme latitude warning
export function getExtremeLatitudeWarning(latitude: number): string | null {
  if (!isExtremeLatitude(latitude)) return null;
  
  const zone = getLatitudeZone(latitude);
  const pole = latitude > 0 ? 'North' : 'South';
  
  return `You are at ${Math.abs(latitude).toFixed(1)}° ${pole} latitude. ` +
    `In this ${zone} zone, traditional house systems may be distorted. ` +
    `Using Whole Sign houses for accuracy.`;
}

// Location display formatter
export function formatLocationDisplay(location: AstroLocation): string {
  const latDir = location.latitude >= 0 ? 'N' : 'S';
  const lonDir = location.longitude >= 0 ? 'E' : 'W';
  
  return `${location.name} (${Math.abs(location.latitude).toFixed(2)}°${latDir}, ${Math.abs(location.longitude).toFixed(2)}°${lonDir})`;
}

// Get hemisphere icon
export function getHemisphereIcon(hemisphere: Hemisphere): string {
  return {
    northern: '🌎',
    southern: '🌏',
    equatorial: '🌍',
  }[hemisphere];
}

// Get season icon
export function getSeasonIcon(season: Season): string {
  return {
    spring: '🌱',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
  }[season];
}

// Calculate visible planets based on location and time
export function getVisiblePlanets(
  positions: PlanetPosition[],
  date: Date,
  _latitude: number,
  _longitude: number
): { planet: PlanetPosition; altitude: number; azimuth: number; isVisible: boolean }[] {
  // This would require complex astronomical calculations
  // For now, return simplified visibility based on typical patterns
  
  const hour = date.getHours();
  const isNight = hour < 6 || hour > 18;
  
  return positions.map(pos => {
    // Simplified visibility logic
    const isVisible = 
      (pos.planet === 'moon') ||
      (pos.planet === 'venus' && (hour > 19 || hour < 7)) || // Evening/morning star
      (pos.planet === 'jupiter' && isNight) ||
      (pos.planet === 'saturn' && isNight) ||
      (pos.planet === 'mars' && isNight);
    
    return {
      planet: pos,
      altitude: 0, // Would require actual calculation
      azimuth: 0,
      isVisible,
    };
  });
}
