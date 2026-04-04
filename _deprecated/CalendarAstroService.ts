/**
 * Calendar Astro Service
 * Generates astrology events for display on the HEKA calendar
 */

import { CalendarAstroEvent } from '../components/astro/CalendarAstroOverlay';
import { PlanetPosition, NatalChart, Planet } from '../types/astrology';
// import { AstroCalculationEngine } from './AstroCalculationEngine';
import { calculatePlanetaryPositions } from './AstroCalculationEngine';
import { getSignFromLongitude } from '../types/astrology';
import { getDaysInMonth, hekaToCivil } from './calendarService';

// Generate astro events for a HEKA month
export async function generateMonthAstroEvents(
  hekaYear: number,
  hekaMonth: number,
  natalChart?: NatalChart
): Promise<CalendarAstroEvent[]> {
  const events: CalendarAstroEvent[] = [];
  const daysInMonth = getDaysInMonth(hekaYear, hekaMonth as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11);
  
  for (let day = 1; day <= daysInMonth; day++) {
    // Convert HEKA date to Gregorian
    const date = hekaToCivil({ year: hekaYear, month: hekaMonth as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11, day });
    
    // Get planetary positions for this day
    const positions = await calculatePlanetaryPositions(date);
    
    // Check for moon phase
    const moonPhase = checkMoonPhase(positions);
    if (moonPhase) {
      events.push({
        hekaDay: day,
        hekaMonth,
        type: 'moon-phase',
        moonPhase: moonPhase.phase,
        powerLevel: moonPhase.powerLevel,
        description: moonPhase.description,
      });
    }
    
    // Check for planet ingress (entering new sign)
    const ingresses = await checkPlanetIngresses(positions, hekaYear, hekaMonth, day);
    events.push(...ingresses);
    
    // Check for retrograde stations
    const retrogradeEvents = await checkRetrogradeStations(positions, hekaYear, hekaMonth, day);
    events.push(...retrogradeEvents);
    
    // Check for significant transits to natal chart
    if (natalChart) {
      const transitEvents = checkTransitsToNatal(positions, natalChart, hekaYear, hekaMonth, day);
      events.push(...transitEvents);
    }
    
    // Calculate power day rating
    const powerDay = calculatePowerDay(positions, day);
    if (powerDay.level !== 'low') {
      events.push({
        hekaDay: day,
        hekaMonth,
        type: 'power-day',
        powerLevel: powerDay.level,
        description: powerDay.description,
      });
    }
  }
  
  return events.sort((a, b) => a.hekaDay - b.hekaDay);
}

// Check moon phase
function checkMoonPhase(
  positions: PlanetPosition[]
): { phase: 'new' | 'waxing' | 'full' | 'waning'; powerLevel: 'high' | 'medium' | 'low'; description: string } | null {
  const sun = positions.find(p => p.planet === 'sun');
  const moon = positions.find(p => p.planet === 'moon');
  
  if (!sun || !moon) return null;
  
  const elongation = (moon.exactLongitude - sun.exactLongitude + 360) % 360;
  
  // New Moon (0°)
  if (elongation < 15 || elongation > 345) {
    return {
      phase: 'new',
      powerLevel: 'high',
      description: 'New Moon - Plant seeds, set intentions',
    };
  }
  
  // Full Moon (180°)
  if (elongation > 165 && elongation < 195) {
    return {
      phase: 'full',
      powerLevel: 'high',
      description: 'Full Moon - Culmination, release, celebrate',
    };
  }
  
  // Quarter phases (90°)
  if ((elongation > 75 && elongation < 105) || (elongation > 255 && elongation < 285)) {
    return {
      phase: elongation < 180 ? 'waxing' : 'waning',
      powerLevel: 'medium',
      description: elongation < 180 ? 'First Quarter - Take action' : 'Last Quarter - Release',
    };
  }
  
  return null;
}

// Check for planets entering new signs
async function checkPlanetIngresses(
  positions: PlanetPosition[],
  _hekaYear: number,
  hekaMonth: number,
  hekaDay: number
): Promise<CalendarAstroEvent[]> {
  const events: CalendarAstroEvent[] = [];
  const ingressPlanets: Planet[] = ['sun', 'moon', 'mercury', 'venus', 'mars'];
  
  // Get yesterday's positions to compare
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayPositions = await calculatePlanetaryPositions(yesterday);
  
  for (const planet of ingressPlanets) {
    const todayPos = positions.find(p => p.planet === planet);
    const yesterdayPos = yesterdayPositions.find(p => p.planet === planet);
    
    if (todayPos && yesterdayPos) {
      const todaySign = getSignFromLongitude(todayPos.exactLongitude);
      const yesterdaySign = getSignFromLongitude(yesterdayPos.exactLongitude);
      
      if (todaySign !== yesterdaySign) {
        events.push({
          hekaDay,
          hekaMonth,
          type: 'planet-ingress',
          planet,
          sign: todaySign,
          description: `${planet} enters ${todaySign}`,
        });
      }
    }
  }
  
  return events;
}

// Check for retrograde stations
async function checkRetrogradeStations(
  positions: PlanetPosition[],
  _hekaYear: number,
  hekaMonth: number,
  hekaDay: number
): Promise<CalendarAstroEvent[]> {
  const events: CalendarAstroEvent[] = [];
  const retrogradePlanets: Planet[] = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  
  // Get yesterday's positions to compare
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayPositions = await calculatePlanetaryPositions(yesterday);
  
  for (const planet of retrogradePlanets) {
    const todayPos = positions.find(p => p.planet === planet);
    const yesterdayPos = yesterdayPositions.find(p => p.planet === planet);
    
    if (todayPos && yesterdayPos) {
      // Check for station (speed near zero or change in direction)
      const wasRetrograde = yesterdayPos.isRetrograde;
      const isRetrograde = todayPos.isRetrograde;
      
      if (!wasRetrograde && isRetrograde) {
        events.push({
          hekaDay,
          hekaMonth,
          type: 'retrograde-start',
          planet,
          powerLevel: 'high',
          description: `${planet} stations retrograde`,
        });
      } else if (wasRetrograde && !isRetrograde) {
        events.push({
          hekaDay,
          hekaMonth,
          type: 'retrograde-end',
          planet,
          powerLevel: 'high',
          description: `${planet} stations direct`,
        });
      }
    }
  }
  
  return events;
}

// Check transits to natal chart
function checkTransitsToNatal(
  positions: PlanetPosition[],
  natalChart: NatalChart,
  _hekaYear: number,
  hekaMonth: number,
  hekaDay: number
): CalendarAstroEvent[] {
  const events: CalendarAstroEvent[] = [];
  
  // Check for significant transits (conjunctions, squares, oppositions)
  const significantTransits = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  
  for (const transitPlanet of significantTransits) {
    const transiting = positions.find(p => p.planet === transitPlanet);
    if (!transiting) continue;
    
    for (const natalPos of natalChart.positions) {
      // Only check significant natal planets
      if (!['sun', 'moon', 'ascendant', 'mercury', 'venus', 'mars'].includes(natalPos.planet)) continue;
      
      const separation = Math.abs(transiting.exactLongitude - natalPos.exactLongitude);
      const normalizedSeparation = separation > 180 ? 360 - separation : separation;
      
      // Conjunction (0°)
      if (normalizedSeparation < 3) {
        events.push({
          hekaDay,
          hekaMonth,
          type: 'aspect',
          planet: transitPlanet as Planet,
          powerLevel: 'very-high',
          description: `${transitPlanet} conjunct natal ${natalPos.planet}`,
        });
      }
      // Opposition (180°)
      else if (Math.abs(normalizedSeparation - 180) < 3) {
        events.push({
          hekaDay,
          hekaMonth,
          type: 'aspect',
          planet: transitPlanet as Planet,
          powerLevel: 'high',
          description: `${transitPlanet} opposite natal ${natalPos.planet}`,
        });
      }
      // Square (90°)
      else if (Math.abs(normalizedSeparation - 90) < 3) {
        events.push({
          hekaDay,
          hekaMonth,
          type: 'aspect',
          planet: transitPlanet as Planet,
          powerLevel: 'medium',
          description: `${transitPlanet} square natal ${natalPos.planet}`,
        });
      }
    }
  }
  
  return events;
}

// Calculate power day rating
function calculatePowerDay(
  positions: PlanetPosition[],
  day: number
): { level: 'low' | 'medium' | 'high' | 'very-high'; description: string } {
  let score = 0;
  
  // Check for positive aspects
  const sun = positions.find(p => p.planet === 'sun');
  const moon = positions.find(p => p.planet === 'moon');
  const jupiter = positions.find(p => p.planet === 'jupiter');
  // const venus = positions.find(p => p.planet === 'venus');
  
  // Jupiter aspects bring luck
  if (jupiter) {
    score += 2;
  }
  
  // Moon phase affects power
  if (sun && moon) {
    const elongation = Math.abs(moon.exactLongitude - sun.exactLongitude);
    if (elongation < 15 || elongation > 345 || Math.abs(elongation - 180) < 15) {
      score += 3; // New or Full Moon
    }
  }
  
  // Day of month in HEKA (28-day cycle)
  if (day === 1 || day === 14 || day === 28) {
    score += 2; // Key days
  }
  
  // Check for retrogrades (reduce score)
  const retrogradeCount = positions.filter(p => p.isRetrograde).length;
  score -= retrogradeCount * 0.5;
  
  // Determine level
  if (score >= 5) {
    return { level: 'very-high', description: 'Exceptional day for important actions' };
  } else if (score >= 3) {
    return { level: 'high', description: 'Favorable energy for initiatives' };
  } else if (score >= 1) {
    return { level: 'medium', description: 'Moderate energy - steady progress' };
  }
  
  return { level: 'low', description: 'Rest and reflect' };
}

// Get best days for specific activities
export function getBestDaysFor(
  activity: 'love' | 'career' | 'health' | 'spiritual' | 'creativity' | 'communication',
  events: CalendarAstroEvent[],
  count: number = 5
): CalendarAstroEvent[] {
  const activityWeights: Record<string, (e: CalendarAstroEvent) => number> = {
    love: (e) => {
      if (e.type === 'planet-ingress' && (e.planet === 'venus' || e.planet === 'moon')) return 3;
      if (e.type === 'moon-phase' && e.moonPhase === 'full') return 2;
      return 0;
    },
    career: (e) => {
      if (e.type === 'planet-ingress' && (e.planet === 'sun' || e.planet === 'mars')) return 3;
      if (e.powerLevel === 'high' || e.powerLevel === 'very-high') return 2;
      return 0;
    },
    health: (e) => {
      if (e.type === 'moon-phase' && e.moonPhase === 'new') return 2;
      if (e.type === 'power-day') return 1;
      return 0;
    },
    spiritual: (e) => {
      if (e.type === 'moon-phase') return 3;
      if (e.type === 'planet-ingress' && e.planet === 'neptune') return 3;
      return 0;
    },
    creativity: (e) => {
      if (e.type === 'moon-phase' && e.moonPhase === 'waxing') return 2;
      if (e.type === 'power-day' && e.powerLevel === 'high') return 2;
      return 0;
    },
    communication: (e) => {
      if (e.type === 'planet-ingress' && e.planet === 'mercury') return 3;
      if (e.type === 'retrograde-end' && e.planet === 'mercury') return 3;
      return 0;
    },
  };
  
  const scorer = activityWeights[activity];
  if (!scorer) return [];
  
  return events
    .map(e => ({ ...e, score: scorer(e) }))
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export default {
  generateMonthAstroEvents,
  getBestDaysFor,
};
