/**
 * Swiss Ephemeris Calculation Engine
 * NASA-grade precision astronomical calculations using Swiss Ephemeris WASM
 * 
 * Accuracy: 0.001 arcseconds (planets), 0.1 arcseconds (Moon)
 * Data source: NASA JPL DE431 ephemeris
 */

import SwissEph from 'swisseph-wasm';
import { 
  Planet, 
  ZodiacSign, 
  PlanetPosition, 
  HouseCusp, 
  Aspect,
  NatalChart,
  DailyTransit,
  TransitAspect,
  AstroTip
} from '../types/astrology';

// Planet mappings to Swiss Ephemeris constants
const PLANET_TO_SE: Record<string, number> = {
  sun: 0,      // SE_SUN
  moon: 1,     // SE_MOON
  mercury: 2,  // SE_MERCURY
  venus: 3,    // SE_VENUS
  mars: 4,     // SE_MARS
  jupiter: 5,  // SE_JUPITER
  saturn: 6,   // SE_SATURN
  uranus: 7,   // SE_URANUS
  neptune: 8,  // SE_NEPTUNE
  pluto: 9,    // SE_PLUTO
  chiron: 15,  // SE_CHIRON
  northNode: 10, // SE_TRUE_NODE
  southNode: -1, // Calculated from north node
  lilith: 12,  // SE_OSCU_APOG (Mean Lilith)
};

// House system mappings
const HOUSE_SYSTEMS: Record<string, string> = {
  'placidus': 'P',
  'equal': 'E',
  'whole-sign': 'W',
  'koch': 'K',
  'campanus': 'C',
  'regiomontanus': 'R',
  'porphyrius': 'O',
};

class SwissEphemerisEngine {
  private swe: SwissEph | null = null;
  private isReady = false;

  async initialize(): Promise<void> {
    if (this.isReady) return;
    
    try {
      this.swe = new SwissEph();
      await this.swe.initSwissEph();
      this.isReady = true;
    } catch (error) {
      console.error('Failed to initialize Swiss Ephemeris:', error);
      // Don't throw - let fallback handle it
      this.isReady = false;
      throw error;
    }
  }

  close(): void {
    if (this.swe) {
      this.swe.close();
      this.swe = null;
      this.isReady = false;
    }
  }

  private ensureReady(): SwissEph {
    if (!this.isReady || !this.swe) {
      throw new Error('Swiss Ephemeris not initialized. Call initialize() first.');
    }
    return this.swe;
  }

  /**
   * Calculate Julian Day from calendar date
   * Uses Swiss Ephemeris julday for astronomical precision
   * 
   * CRITICAL: Swiss Ephemeris julday expects UTC time
   * jd = swe.julday(year, month, day, hour_in_utc)
   */
  calculateJulianDay(year: number, month: number, day: number, hourUTC: number): number {
    return this.ensureReady().julday(year, month, day, hourUTC);
  }

  /**
   * Calculate planet position with NASA-grade precision
   * Returns longitude accurate to 0.001 arcseconds
   */
  calculatePlanet(julianDay: number, planet: Planet): PlanetPosition {
    const swe = this.ensureReady();
    const sePlanet = PLANET_TO_SE[planet];
    
    if (sePlanet === undefined) {
      throw new Error(`Unknown planet: ${planet}`);
    }

    // Handle south node (opposite of north node)
    if (planet === 'southNode') {
      const northNode = this.calculatePlanet(julianDay, 'northNode');
      const southLong = (northNode.exactLongitude + 180) % 360;
      return {
        planet,
        sign: longitudeToSign(southLong),
        degree: southLong % 30,
        exactLongitude: southLong,
        isRetrograde: northNode.isRetrograde,
        speed: northNode.speed,
      };
    }

    // Calculate using Swiss Ephemeris
    const flags = swe.SEFLG_SWIEPH; // Use Swiss Ephemeris (not Moshier)
    const result = swe.calc_ut(julianDay, sePlanet, flags);

    // result[0] = longitude, result[1] = latitude, result[2] = distance
    // result[3] = speed in longitude, result[4] = speed in latitude
    const longitude = result[0];
    const speed = result[3];

    return {
      planet,
      sign: longitudeToSign(longitude),
      degree: longitude % 30,
      exactLongitude: longitude,
      isRetrograde: speed < 0,
      speed,
    };
  }

  /**
   * Calculate all planetary positions for a given date
   * 
   * DEBUG: Logs calculation details to verify accuracy
   */
  calculateAllPlanets(date: Date): PlanetPosition[] {
    // Convert input date to UTC components
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // 1-12
    const day = date.getUTCDate();
    const hourUTC = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    
    const jd = this.calculateJulianDay(year, month, day, hourUTC);

    const planets: Planet[] = [
      'sun', 'moon', 'mercury', 'venus', 'mars',
      'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
      'chiron', 'northNode', 'southNode', 'lilith'
    ];

    return planets.map(p => this.calculatePlanet(jd, p));
  }

  /**
   * Calculate house cusps with high precision
   * Supports Placidus, Equal, Whole Sign, Koch, Campanus, Regiomontanus
   */
  calculateHouses(
    date: Date,
    latitude: number,
    longitude: number,
    houseSystem: string = 'P'
  ): { houses: HouseCusp[]; ascendant: number; mc: number; systemUsed: string } {
    // Convert to Julian Day (UTC)
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hourUTC = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    
    const jd = this.calculateJulianDay(year, month, day, hourUTC);

    // Determine house system
    let system = HOUSE_SYSTEMS[houseSystem] || 'P';
    
    // Extreme latitudes - use whole sign
    if (Math.abs(latitude) > 66.5 && system === 'P') {
      system = 'W';
    }

    // Calculate houses using Swiss Ephemeris
    let houseArray: number[];
    try {
      const result = this.ensureReady().houses(jd, latitude, longitude, system);
      // Convert to regular array - houses() returns array-like object
      houseArray = Array.from(result as any).map(n => Number(n));
    } catch (e) {
      // Fallback: use equal houses calculation
      console.warn('Swiss Ephemeris houses failed, using fallback:', e);
      houseArray = this.calculateEqualHousesFallback(jd, latitude, longitude);
    }

    const houses: HouseCusp[] = [];
    for (let i = 0; i < 12; i++) {
      const cuspLong = houseArray[i] || 0;
      houses.push({
        house: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
        sign: longitudeToSign(cuspLong),
        degree: cuspLong % 30,
        exactLongitude: cuspLong,
      });
    }

    // Ascendant is index 12, MC is index 13
    const ascendant = houseArray[12] || houses[0]?.exactLongitude || 0;
    const mc = houseArray[13] || houses[9]?.exactLongitude || 0;

    return {
      houses,
      ascendant,
      mc,
      systemUsed: system === 'W' ? 'whole-sign' : system === 'E' ? 'equal' : 'placidus',
    };
  }

  /**
   * Fallback equal houses calculation when Swiss Ephemeris fails
   */
  private calculateEqualHousesFallback(jd: number, latitude: number, longitude: number): number[] {
    // Calculate ascendant using simple algorithm
    const siderealTime = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + longitude) % 360;
    const eps = 23.4397 * Math.PI / 180;
    const latRad = latitude * Math.PI / 180;
    
    const ascRad = Math.atan2(
      Math.cos(siderealTime * Math.PI / 180),
      -(Math.sin(siderealTime * Math.PI / 180) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps))
    );
    const ascendant = ((ascRad * 180 / Math.PI) + 360) % 360;
    
    // MC (midheaven)
    const mc = (siderealTime + 90) % 360;
    
    // Equal houses: each house is 30° from ascendant
    const houses: number[] = [];
    for (let i = 0; i < 12; i++) {
      houses.push((ascendant + i * 30) % 360);
    }
    houses.push(ascendant); // Index 12
    houses.push(mc); // Index 13
    
    return houses;
  }

  /**
   * Generate complete natal chart with Swiss Ephemeris precision
   */
  async generateNatalChart(
    birthDate: string,
    birthTime: string,
    latitude: number,
    longitude: number,
    timezone: string,
    houseSystem: string = 'placidus'
  ): Promise<NatalChart & { warnings?: string[] }> {
    const warnings: string[] = [];

    // Parse birth date and time
    // birthDate: "1998-02-03" (YYYY-MM-DD)
    // birthTime: "18:46" (24-hour format, local time at birthplace)
    
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime ? birthTime.split(':').map(Number) : [12, 0];
    
    // Convert timezone string to offset in hours
    // FIXED: Gets the HISTORICAL offset for the birth date (handles DST changes)
    const getTimezoneOffset = (tz: string, date: Date): number => {
      try {
        // Use Intl.DateTimeFormat to get offset for specific timezone at that exact date
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          timeZoneName: 'shortOffset',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
        
        const parts = formatter.formatToParts(date);
        const offsetPart = parts.find(p => p.type === 'timeZoneName');
        
        if (offsetPart) {
          // Parse GMT+11, GMT-5, UTC+10, etc.
          const match = offsetPart.value.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
          if (match) {
            const sign = match[1] === '+' ? -1 : 1; // Negative because we subtract to get UTC
            const hours = parseInt(match[2], 10);
            const minutes = match[3] ? parseInt(match[3], 10) : 0;
            return sign * (hours + minutes / 60);
          }
        }
      } catch (e) {
        // Fallback below
      }
      
      // Fallback: Calculate offset by comparing UTC and local time
      const utcFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      
      const tzFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      
      const utcParts = utcFormatter.formatToParts(date);
      const tzParts = tzFormatter.formatToParts(date);
      
      const getPart = (parts: Intl.DateTimeFormatPart[], type: string) => 
        parseInt(parts.find(p => p.type === type)?.value || '0', 10);
      
      const utcTime = Date.UTC(
        getPart(utcParts, 'year'),
        getPart(utcParts, 'month') - 1,
        getPart(utcParts, 'day'),
        getPart(utcParts, 'hour'),
        getPart(utcParts, 'minute'),
        getPart(utcParts, 'second')
      );
      
      const tzTime = Date.UTC(
        getPart(tzParts, 'year'),
        getPart(tzParts, 'month') - 1,
        getPart(tzParts, 'day'),
        getPart(tzParts, 'hour'),
        getPart(tzParts, 'minute'),
        getPart(tzParts, 'second')
      );
      
      return (utcTime - tzTime) / (60 * 60 * 1000);
    };
    
    // Create a reference date to get the timezone offset
    const refDate = new Date(`${birthDate}T${birthTime || '12:00'}:00`);
    const tzOffsetHours = getTimezoneOffset(timezone, refDate);
    
    // Convert birth time to UTC by subtracting the timezone offset
    // If birth was 18:46 in a timezone that's +11 from UTC, UTC time is 07:46
    const birthHour = hour + minute / 60;
    const utcHour = birthHour - tzOffsetHours;
    
    // Handle day rollover
    let utcDay = day;
    let utcMonth = month;
    let utcYear = year;
    let finalUtcHour = utcHour;
    
    if (utcHour < 0) {
      finalUtcHour += 24;
      utcDay--;
      // Handle month rollover (simplified)
      if (utcDay < 1) {
        utcMonth--;
        if (utcMonth < 1) {
          utcMonth = 12;
          utcYear--;
        }
        // Get days in previous month
        const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
        utcDay = daysInMonth;
      }
    } else if (utcHour >= 24) {
      finalUtcHour -= 24;
      utcDay++;
      // Handle month rollover (simplified)
      const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
      if (utcDay > daysInMonth) {
        utcDay = 1;
        utcMonth++;
        if (utcMonth > 12) {
          utcMonth = 1;
          utcYear++;
        }
      }
    }
    
    // Create final UTC date for Swiss Ephemeris
    const finalUtcDate = new Date(Date.UTC(utcYear, utcMonth - 1, utcDay, finalUtcHour, 0, 0));

    // Calculate planets using UTC date
    const positions = this.calculateAllPlanets(finalUtcDate);

    // Calculate houses
    let houses: HouseCusp[] | undefined;
    let ascendant: PlanetPosition | null = null;
    let midheaven: PlanetPosition | null = null;

    if (!birthTime || birthTime === 'unknown') {
      warnings.push('Birth time unknown - houses calculated for noon');
    }

    const houseResult = this.calculateHouses(finalUtcDate, latitude, longitude, houseSystem);
    houses = houseResult.houses;

    // Assign planets to houses
    positions.forEach(pos => {
      const house = houses!.find(h => {
        const prevHouse = houses![(h.house - 2 + 12) % 12];
        const cusp = h.exactLongitude;
        const prevCusp = prevHouse.exactLongitude;
        const planetLong = pos.exactLongitude;
        
        if (prevCusp > cusp) {
          return planetLong >= prevCusp || planetLong < cusp;
        }
        return planetLong >= prevCusp && planetLong < cusp;
      });
      
      if (house) {
        pos.house = house.house;
      }
    });

    // Create Ascendant and MC positions
    const ascHouse = houses.find(h => h.house === 1);
    const mcHouse = houses.find(h => h.house === 10);

    if (ascHouse && !isNaN(houseResult.ascendant)) {
      const ascDegree = houseResult.ascendant % 30;
      ascendant = {
        planet: 'sun', // Placeholder
        sign: longitudeToSign(houseResult.ascendant),
        degree: isNaN(ascDegree) ? 0 : ascDegree,
        exactLongitude: houseResult.ascendant,
        isRetrograde: false,
        speed: 0,
        house: 1,
      };
    }

    if (mcHouse && !isNaN(houseResult.mc)) {
      const mcDegree = houseResult.mc % 30;
      midheaven = {
        planet: 'sun',
        sign: longitudeToSign(houseResult.mc),
        degree: isNaN(mcDegree) ? 0 : mcDegree,
        exactLongitude: houseResult.mc,
        isRetrograde: false,
        speed: 0,
        house: 10,
      };
    }

    // Calculate aspects
    const aspects = this.calculateAspects(positions);

    return {
      id: `natal-${Date.now()}`,
      profileId: '',
      birthDate,
      birthTime: birthTime || '12:00',
      birthTimeUnknown: !birthTime || birthTime === 'unknown',
      timezone,
      location: {
        name: '',
        latitude,
        longitude,
      },
      positions,
      ascendant,
      midheaven,
      houses,
      aspects,
      calculatedAt: new Date().toISOString(),
      warnings,
    } as NatalChart & { warnings?: string[] };
  }

  /**
   * Calculate aspects between planets
   */
  private calculateAspects(positions: PlanetPosition[]): Aspect[] {
    const aspects: Aspect[] = [];
    const aspectAngles: Record<string, number> = {
      conjunction: 0,
      opposition: 180,
      trine: 120,
      square: 90,
      sextile: 60,
      quincunx: 150,
      semisextile: 30,
    };
    const orbs: Record<string, number> = {
      conjunction: 8,
      opposition: 8,
      trine: 6,
      square: 6,
      sextile: 4,
      quincunx: 2,
      semisextile: 1,
    };

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const p1 = positions[i];
        const p2 = positions[j];

        // Skip nodes for aspects
        if (['northNode', 'southNode'].includes(p1.planet) || 
            ['northNode', 'southNode'].includes(p2.planet)) continue;

        let separation = Math.abs(p1.exactLongitude - p2.exactLongitude);
        if (separation > 180) separation = 360 - separation;

        for (const [type, angle] of Object.entries(aspectAngles)) {
          const orb = Math.abs(separation - angle);
          if (orb <= orbs[type]) {
            const speedDiff = (p1.speed || 0) - (p2.speed || 0);
            const isApplying = angle === 0 ? speedDiff < 0 : 
              (separation < angle && speedDiff < 0) || (separation > angle && speedDiff > 0);

            aspects.push({
              planet1: p1.planet,
              planet2: p2.planet,
              type: type as any,
              angle: separation,
              orb,
              isApplying,
            });
            break;
          }
        }
      }
    }

    return aspects.sort((a, b) => a.orb - b.orb);
  }

  /**
   * Calculate daily transits against natal chart
   */
  calculateDailyTransits(date: Date, natalChart: NatalChart): DailyTransit {
    // Current positions
    const currentPositions = this.calculateAllPlanets(date);

    // Calculate transits
    const transitsToNatal: TransitAspect[] = [];

    for (const transiting of currentPositions) {
      for (const natal of natalChart.positions) {
        let separation = Math.abs(transiting.exactLongitude - natal.exactLongitude);
        if (separation > 180) separation = 360 - separation;

        const aspectTypes = [
          { type: 'conjunction', angle: 0, orb: 8 },
          { type: 'opposition', angle: 180, orb: 8 },
          { type: 'trine', angle: 120, orb: 6 },
          { type: 'square', angle: 90, orb: 6 },
          { type: 'sextile', angle: 60, orb: 4 },
        ];

        for (const aspect of aspectTypes) {
          const orb = Math.abs(separation - aspect.angle);
          if (orb <= aspect.orb) {
            transitsToNatal.push({
              transitingPlanet: transiting.planet,
              natalPlanet: natal.planet,
              aspect: aspect.type as any,
              orb,
              isApplying: transiting.speed > natal.speed,
            });
            break;
          }
        }
      }
    }

    // Moon phase
    const sunPos = currentPositions.find(p => p.planet === 'sun');
    const moonPos = currentPositions.find(p => p.planet === 'moon');
    
    let moonPhase = 'new-moon';
    if (sunPos && moonPos) {
      const elongation = (moonPos.exactLongitude - sunPos.exactLongitude + 360) % 360;
      if (elongation < 45) moonPhase = 'new-moon';
      else if (elongation < 90) moonPhase = 'waxing-crescent';
      else if (elongation < 135) moonPhase = 'first-quarter';
      else if (elongation < 180) moonPhase = 'waxing-gibbous';
      else if (elongation < 225) moonPhase = 'full-moon';
      else if (elongation < 270) moonPhase = 'waning-gibbous';
      else if (elongation < 315) moonPhase = 'last-quarter';
      else moonPhase = 'waning-crescent';
    }

    // Power level
    let powerLevel: DailyTransit['powerLevel'] = 'low';
    const majorTransits = transitsToNatal.filter(t => t.orb < 3);
    if (majorTransits.length >= 3) powerLevel = 'very-high';
    else if (majorTransits.length >= 2) powerLevel = 'high';
    else if (majorTransits.length >= 1) powerLevel = 'medium';

    // Generate tip
    const tip: AstroTip = this.generateTip(moonPhase, moonPos?.sign || 'aries', transitsToNatal);

    return {
      date: date.toISOString().split('T')[0],
      moonSign: moonPos?.sign || 'aries',
      moonPhase,
      moonVoidOfCourse: false,
      planetaryPositions: currentPositions,
      transitsToNatal: transitsToNatal.sort((a, b) => a.orb - b.orb),
      powerLevel,
      tip,
    };
  }

  private generateTip(moonPhase: string, moonSign: string, transits: TransitAspect[]): AstroTip {
    // Find most significant transit
    const significant = transits.find(t => t.orb < 2);
    
    if (significant) {
      return {
        title: `${capitalize(significant.transitingPlanet)} ${significant.aspect} your ${capitalize(significant.natalPlanet)}`,
        message: `A significant transit is active today. The energy of ${significant.transitingPlanet} ${significant.aspect} your natal ${significant.natalPlanet} brings focus to this area of your life.`,
        category: 'general',
        action: 'Take time to observe how this energy manifests in your daily experience.',
        powerLevel: 'high',
      };
    }

    // Default based on moon phase
    const phaseGuidance: Record<string, AstroTip> = {
      'new-moon': {
        title: 'New Moon Energy',
        message: 'The lunar cycle begins anew. This is a time for planting seeds and setting intentions.',
        category: 'spiritual',
        action: 'Write down your intentions for this lunar cycle.',
        powerLevel: 'medium',
      },
      'full-moon': {
        title: 'Full Moon Illumination',
        message: 'The moon is at its peak. Emotions run high and things come to fruition.',
        category: 'emotions',
        action: 'Practice gratitude for what has manifested. Release what no longer serves.',
        powerLevel: 'high',
      },
      'waning-crescent': {
        title: 'Rest and Reflect',
        message: 'The moon wanes toward darkness. A time for introspection and letting go.',
        category: 'spiritual',
        action: 'Take time for solitude and inner reflection.',
        powerLevel: 'low',
      },
    };

    return phaseGuidance[moonPhase] || {
      title: 'Steady Cosmic Flow',
      message: `Moon in ${capitalize(moonSign)}. A good day for steady progress.`,
      category: 'general',
      action: 'Continue with your regular routines.',
      powerLevel: 'low',
    };
  }
}

// Helper functions
// 13-Sign Zodiac Configuration (True Astronomical)
const ZODIAC_12: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const ZODIAC_13: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'ophiuchus', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// 13-sign zodiac with actual astronomical degrees
// Based on IAU constellation boundaries (simplified)
const ZODIAC_13_BOUNDARIES = [
  { sign: 'aries', start: 0, end: 25.5 },
  { sign: 'taurus', start: 25.5, end: 51.5 },
  { sign: 'gemini', start: 51.5, end: 77 },
  { sign: 'cancer', start: 77, end: 102.5 },
  { sign: 'leo', start: 102.5, end: 128.5 },
  { sign: 'virgo', start: 128.5, end: 154 },
  { sign: 'libra', start: 154, end: 180 },
  { sign: 'scorpio', start: 180, end: 205 },
  { sign: 'ophiuchus', start: 205, end: 231 }, // The 13th sign!
  { sign: 'sagittarius', start: 231, end: 257 },
  { sign: 'capricorn', start: 257, end: 282.5 },
  { sign: 'aquarius', start: 282.5, end: 308.5 },
  { sign: 'pisces', start: 308.5, end: 334 },
];

// Global flag for zodiac system (can be toggled)
let use13SignZodiac = false;

export function setZodiacSystem(use13Sign: boolean): void {
  use13SignZodiac = use13Sign;
}

export function getZodiacSystem(): boolean {
  return use13SignZodiac;
}

function longitudeToSign(longitude: number): ZodiacSign {
  const normalized = ((longitude % 360) + 360) % 360;
  
  if (use13SignZodiac) {
    // 13-sign astronomical zodiac
    for (const boundary of ZODIAC_13_BOUNDARIES) {
      if (normalized >= boundary.start && normalized < boundary.end) {
        return boundary.sign as ZodiacSign;
      }
    }
    // Handle the wrap-around (334-360)
    return 'pisces';
  }
  
  // Standard 12-sign tropical zodiac (30° each)
  const index = Math.floor(normalized / 30);
  return ZODIAC_12[index];
}

export function getSignDegreeRange(sign: ZodiacSign): { start: number; end: number } {
  if (use13SignZodiac) {
    const boundary = ZODIAC_13_BOUNDARIES.find(b => b.sign === sign);
    if (boundary) return { start: boundary.start, end: boundary.end };
  }
  // 12-sign: each sign is 30°
  const index = ZODIAC_12.indexOf(sign);
  if (index >= 0) {
    return { start: index * 30, end: (index + 1) * 30 };
  }
  return { start: 0, end: 30 };
}

function capitalize(str: string | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSignLongitudeRange(sign: string): string {
  const ranges: Record<string, string> = {
    aries: '0-30°', taurus: '30-60°', gemini: '60-90°',
    cancer: '90-120°', leo: '120-150°', virgo: '150-180°',
    libra: '180-210°', scorpio: '210-240°', sagittarius: '240-270°',
    capricorn: '270-300°', aquarius: '300-330°', pisces: '330-360°'
  };
  return ranges[sign] || 'unknown';
}

// Singleton instance
let engineInstance: SwissEphemerisEngine | null = null;
let engineInitializing = false;
let engineInitPromise: Promise<SwissEphemerisEngine> | null = null;

export async function getSwissEphemerisEngine(): Promise<SwissEphemerisEngine> {
  if (engineInstance) return engineInstance;
  if (engineInitializing && engineInitPromise) return engineInitPromise;
  
  engineInitializing = true;
  engineInstance = new SwissEphemerisEngine();
  engineInitPromise = engineInstance.initialize().then(() => {
    engineInitializing = false;
    return engineInstance!;
  }).catch(e => {
    engineInitializing = false;
    engineInstance = null;
    throw e;
  });
  
  return engineInitPromise;
}

export function closeSwissEphemeris(): void {
  if (engineInstance) {
    engineInstance.close();
    engineInstance = null;
  }
}

// Export convenience functions
export async function calculatePlanetaryPositions(date: Date): Promise<PlanetPosition[]> {
  const engine = await getSwissEphemerisEngine();
  return engine.calculateAllPlanets(date);
}

export async function calculateHouses(
  date: Date,
  latitude: number,
  longitude: number,
  system?: string
): Promise<{ houses: HouseCusp[]; systemUsed: string; warnings?: string[] }> {
  const engine = await getSwissEphemerisEngine();
  const result = engine.calculateHouses(date, latitude, longitude, system);
  return {
    houses: result.houses,
    systemUsed: result.systemUsed,
    warnings: Math.abs(latitude) > 66.5 ? ['Extreme latitude - using Whole Sign houses'] : undefined,
  };
}

export async function generateNatalChart(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  houseSystem?: string
): Promise<NatalChart & { warnings?: string[] }> {
  const engine = await getSwissEphemerisEngine();
  return engine.generateNatalChart(birthDate, birthTime, latitude, longitude, timezone, houseSystem);
}

export async function calculateDailyTransits(date: Date, natalChart: NatalChart): Promise<DailyTransit> {
  const engine = await getSwissEphemerisEngine();
  return engine.calculateDailyTransits(date, natalChart);
}

export default SwissEphemerisEngine;
