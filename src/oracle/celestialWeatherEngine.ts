/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL WEATHER ENGINE 🌟
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * REAL astronomical weather - what's happening in the sky and how it affects you.
 * Not generic moon phases. Actual transits, aspects, and energy forecasts.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { PlanetPosition, PersonalTransit, BirthChart } from './birthChartIntegration';
import { PLANET_MEANINGS, ASPECT_MEANINGS, HOUSE_MEANINGS } from './celestialEducation';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SkyAspect {
  id: string;
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
  nature: 'harmonious' | 'challenging' | 'neutral';
  exactDate: Date;
  isApplying: boolean;
  strength: number;
  interpretation: string;
}

export interface DailyCelestialWeather {
  date: Date;
  skyAspects: SkyAspect[];
  moonPhase: {
    name: string;
    emoji: string;
    illumination: number;
    sign: string;
  };
  dominantEnergy: string;
  themes: string[];
  advice: string;
}

export interface TransitEvent {
  transit: PersonalTransit;
  timing: {
    start: Date;
    exact: Date;
    end: Date;
  };
  period: 'past' | 'current' | 'future';
  energyImpact: 'high' | 'medium' | 'low';
  daysToExact: number;
  daysSinceExact: number;
}

export interface PersonalWeatherForecast {
  birthChart: BirthChart;
  currentTransits: TransitEvent[];
  recentEndings: TransitEvent[];
  upcoming: TransitEvent[];
  dominantTheme: string;
  guidance: string;
  actionItems: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL SKY WEATHER - What's happening in the heavens today
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate aspects between transiting planets (global sky weather)
 */
export function calculateSkyAspects(positions: Record<string, PlanetPosition>): SkyAspect[] {
  const aspects: SkyAspect[] = [];
  const planets = Object.keys(positions);
  const now = new Date();
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const pos1 = positions[p1];
      const pos2 = positions[p2];
      
      if (!pos1 || !pos2) continue;
      
      const aspect = calculateAspectBetween(pos1.longitude, pos2.longitude);
      if (!aspect) continue;
      
      // Only include significant aspects (tighter orbs for sky aspects)
      const maxOrb = getSkyAspectOrb(aspect.type);
      if (aspect.orb > maxOrb) continue;
      
      const strength = calculateSkyAspectStrength(p1, p2, aspect.type, aspect.orb);
      const nature = getAspectNature(aspect.type);
      
      aspects.push({
        id: `${p1}-${p2}-${aspect.type}`,
        planet1: p1,
        planet2: p2,
        aspect: aspect.type,
        angle: aspect.angle,
        orb: aspect.orb,
        nature,
        exactDate: calculateExactDate(pos1, pos2, aspect.angle, now),
        isApplying: isApplyingAspect(pos1, pos2, aspect.angle),
        strength,
        interpretation: generateSkyAspectInterpretation(p1, p2, aspect.type, nature)
      });
    }
  }
  
  return aspects.sort((a, b) => b.strength - a.strength);
}

/**
 * Generate daily celestial weather report
 */
export function generateDailyWeather(
  positions: Record<string, PlanetPosition>,
  date: Date = new Date()
): DailyCelestialWeather {
  const skyAspects = calculateSkyAspects(positions);
  const moon = positions.Moon || positions.moon;
  
  // Simple moon phase based on sun-moon angle
  const sun = positions.Sun || positions.sun;
  let illumination = 50;
  let phaseName = 'Unknown';
  let emoji = '🌑';
  
  if (moon && sun) {
    const angle = Math.abs(normalizeAngle(moon.longitude - sun.longitude));
    illumination = Math.round((1 - Math.cos(angle * Math.PI / 180)) / 2 * 100);
    
    if (angle < 15) { phaseName = 'New Moon'; emoji = '🌑'; }
    else if (angle < 75) { phaseName = 'Waxing'; emoji = '🌒'; }
    else if (angle < 105) { phaseName = 'First Quarter'; emoji = '🌓'; }
    else if (angle < 165) { phaseName = 'Waxing'; emoji = '🌔'; }
    else if (angle < 195) { phaseName = 'Full Moon'; emoji = '🌕'; }
    else if (angle < 255) { phaseName = 'Waning'; emoji = '🌖'; }
    else if (angle < 285) { phaseName = 'Last Quarter'; emoji = '🌗'; }
    else { phaseName = 'Waning'; emoji = '🌘'; }
  }
  
  const { dominantEnergy, themes, advice } = analyzeWeather(skyAspects, phaseName);
  
  return {
    date,
    skyAspects,
    moonPhase: {
      name: phaseName,
      emoji,
      illumination,
      sign: moon?.sign || 'Unknown'
    },
    dominantEnergy,
    themes,
    advice
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONAL TRANSIT TIMELINE - Your cosmic journey
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build complete transit timeline for a person
 */
export function buildTransitTimeline(
  transits: PersonalTransit[],
  date: Date = new Date()
): { current: TransitEvent[]; recent: TransitEvent[]; upcoming: TransitEvent[] } {
  const current: TransitEvent[] = [];
  const recent: TransitEvent[] = [];
  const upcoming: TransitEvent[] = [];
  
  for (const transit of transits) {
    const event = buildTransitEvent(transit, date);
    
    if (event.period === 'current') {
      current.push(event);
    } else if (event.period === 'past') {
      recent.push(event);
    } else {
      upcoming.push(event);
    }
  }
  
  return {
    current: current.sort((a, b) => Math.abs(a.daysToExact) - Math.abs(b.daysToExact)),
    recent: recent.sort((a, b) => b.daysSinceExact - a.daysSinceExact).slice(0, 3),
    upcoming: upcoming.sort((a, b) => a.daysToExact - b.daysToExact).slice(0, 5)
  };
}

function buildTransitEvent(transit: PersonalTransit, now: Date): TransitEvent {
  const planetSpeed = getPlanetSpeed(transit.transitingPlanet);
  const aspectOrb = getAspectOrb(transit.aspect);
  
  // Calculate timing
  const daysToExact = transit.orb / Math.max(planetSpeed, 0.001);
  const exactDate = new Date(now.getTime() + daysToExact * 24 * 60 * 60 * 1000);
  const totalDuration = (aspectOrb * 2) / Math.max(planetSpeed, 0.001);
  const startDate = new Date(exactDate.getTime() - (totalDuration / 2) * 24 * 60 * 60 * 1000);
  const endDate = new Date(exactDate.getTime() + (totalDuration / 2) * 24 * 60 * 60 * 1000);
  
  // Determine period
  let period: 'past' | 'current' | 'future';
  if (endDate < now) {
    period = 'past';
  } else if (startDate > now) {
    period = 'future';
  } else {
    period = 'current';
  }
  
  // Energy impact based on strength and planets involved
  let energyImpact: 'high' | 'medium' | 'low';
  if (transit.strength >= 70) energyImpact = 'high';
  else if (transit.strength >= 40) energyImpact = 'medium';
  else energyImpact = 'low';
  
  return {
    transit,
    timing: { start: startDate, exact: exactDate, end: endDate },
    period,
    energyImpact,
    daysToExact: Math.round(daysToExact),
    daysSinceExact: Math.round(-daysToExact)
  };
}

/**
 * Generate personal forecast from transit timeline
 */
export function generatePersonalForecast(
  timeline: { current: TransitEvent[]; recent: TransitEvent[]; upcoming: TransitEvent[] }
): { theme: string; guidance: string; actions: string[] } {
  const { current, recent, upcoming } = timeline;
  
  // Analyze dominant themes
  const houseCounts = new Map<number, number>();
  const natureCounts = { harmonious: 0, challenging: 0, neutral: 0 };
  
  for (const event of current) {
    const house = event.transit.activatedHouse;
    houseCounts.set(house, (houseCounts.get(house) || 0) + event.transit.strength);
    
    const aspectData = ASPECT_MEANINGS[event.transit.aspect.toLowerCase()];
    if (aspectData) {
      natureCounts[aspectData.nature]++;
    }
  }
  
  // Find dominant house
  let dominantHouse = 1;
  let maxStrength = 0;
  for (const [house, strength] of houseCounts) {
    if (strength > maxStrength) {
      maxStrength = strength;
      dominantHouse = house;
    }
  }
  
  const houseData = HOUSE_MEANINGS[dominantHouse];
  
  // Build theme
  let theme: string;
  if (natureCounts.challenging > natureCounts.harmonious) {
    theme = `Growth through ${houseData?.name.toLowerCase() || 'life challenges'}`;
  } else if (natureCounts.harmonious > natureCounts.challenging) {
    theme = `Flow and opportunity in ${houseData?.name.toLowerCase() || 'key areas'}`;
  } else {
    theme = `Transformation and change in ${houseData?.name.toLowerCase() || 'important areas'}`;
  }
  
  // Build guidance
  let guidance: string;
  if (current.length === 0) {
    guidance = 'A quiet period. Rest and integrate recent experiences.';
  } else if (current.some(e => e.energyImpact === 'high' && e.daysToExact <= 1)) {
    guidance = 'Peak cosmic activity. Major shifts are happening now. Stay present.';
  } else if (upcoming.some(e => e.daysToExact <= 3)) {
    guidance = 'Prepare for incoming energy. Rest and get ready.';
  } else {
    guidance = `Working with ${houseData?.name || 'inner'} themes. ${houseData?.psychological || 'Deep personal work'}`;
  }
  
  // Build action items
  const actions: string[] = [];
  
  if (current.some(e => e.transit.aspect === 'conjunction')) {
    actions.push('Set clear intentions - new cycles are beginning');
  }
  if (current.some(e => e.transit.aspect === 'square')) {
    actions.push('Face challenges directly - growth requires discomfort');
  }
  if (current.some(e => e.transit.aspect === 'trine')) {
    actions.push('Take action - the universe is supporting you');
  }
  if (recent.length > 0) {
    actions.push('Reflect on what just ended - integrate the lessons');
  }
  if (actions.length === 0) {
    actions.push('Maintain steady progress');
    actions.push('Journal your experiences');
  }
  
  return { theme, guidance, actions };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function calculateAspectBetween(long1: number, long2: number): { type: string; angle: number; orb: number } | null {
  const diff = Math.abs(normalizeAngle(long1 - long2));
  
  const aspects = [
    { type: 'conjunction', angle: 0 },
    { type: 'opposition', angle: 180 },
    { type: 'trine', angle: 120 },
    { type: 'square', angle: 90 },
    { type: 'sextile', angle: 60 },
  ];
  
  for (const { type, angle } of aspects) {
    const orb = Math.abs(diff - angle);
    if (orb <= 10) { // Maximum 10° orb for sky aspects
      return { type, angle, orb };
    }
  }
  
  return null;
}

function getSkyAspectOrb(aspectType: string): number {
  const orbs: Record<string, number> = {
    conjunction: 8,
    opposition: 8,
    trine: 6,
    square: 6,
    sextile: 4
  };
  return orbs[aspectType] || 6;
}

function getAspectNature(aspectType: string): 'harmonious' | 'challenging' | 'neutral' {
  const natures: Record<string, 'harmonious' | 'challenging' | 'neutral'> = {
    conjunction: 'neutral',
    trine: 'harmonious',
    sextile: 'harmonious',
    square: 'challenging',
    opposition: 'challenging'
  };
  return natures[aspectType] || 'neutral';
}

function calculateSkyAspectStrength(p1: string, p2: string, aspect: string, orb: number): number {
  // Personal planets matter more
  const personal = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
  const isPersonal = personal.includes(p1) || personal.includes(p2);
  
  let baseStrength = 100 - (orb * 10);
  if (isPersonal) baseStrength *= 1.3;
  if (aspect === 'conjunction' || aspect === 'opposition') baseStrength *= 1.2;
  
  return Math.min(100, Math.round(baseStrength));
}

function generateSkyAspectInterpretation(p1: string, p2: string, aspect: string, nature: string): string {
  const p1Data = PLANET_MEANINGS[p1.toLowerCase()];
  const p2Data = PLANET_MEANINGS[p2.toLowerCase()];
  
  if (!p1Data || !p2Data) return `${p1} ${aspect} ${p2}`;
  
  const templates: Record<string, string> = {
    harmonious: `${p1Data.name} and ${p2Data.name} work together. ${p1Data.keywords[0]} flows with ${p2Data.keywords[0]}.`,
    challenging: `${p1Data.name} challenges ${p2Data.name}. Tension between ${p1Data.keywords[0]} and ${p2Data.keywords[0]}.`,
    neutral: `${p1Data.name} merges with ${p2Data.name}. Intense focus on ${p1Data.keywords[0]} and ${p2Data.keywords[0]}.`
  };
  
  return templates[nature];
}

function analyzeWeather(aspects: SkyAspect[], moonPhase: string): { dominantEnergy: string; themes: string[]; advice: string } {
  if (aspects.length === 0) {
    return {
      dominantEnergy: 'Quiet',
      themes: ['rest', 'integration', 'preparation'],
      advice: 'A calm day. Rest and reflect.'
    };
  }
  
  // Count natures
  const harmonious = aspects.filter(a => a.nature === 'harmonious').length;
  const challenging = aspects.filter(a => a.nature === 'challenging').length;
  
  let dominantEnergy: string;
  if (challenging > harmonious) dominantEnergy = 'Dynamic Tension';
  else if (harmonious > challenging) dominantEnergy = 'Flowing Support';
  else dominantEnergy = 'Active Transformation';
  
  // Extract themes from top aspects
  const themes: string[] = [];
  for (const aspect of aspects.slice(0, 3)) {
    const p1 = PLANET_MEANINGS[aspect.planet1.toLowerCase()];
    if (p1) themes.push(p1.keywords[0]);
  }
  
  // Build advice
  let advice: string;
  if (challenging > harmonious) {
    advice = 'Challenges arise today. Face them with courage.';
  } else if (harmonious > challenging) {
    advice = 'Supportive energy flows. Take action on your goals.';
  } else {
    advice = 'Mixed energies today. Balance action with reflection.';
  }
  
  // Add moon phase context
  if (moonPhase.includes('New')) advice += ' New beginnings favored.';
  if (moonPhase.includes('Full')) advice += ' Culmination and release.';
  
  return { dominantEnergy, themes: [...new Set(themes)], advice };
}

function calculateExactDate(pos1: PlanetPosition, pos2: PlanetPosition, targetAngle: number, fromDate: Date): Date {
  const currentDiff = Math.abs(normalizeAngle(pos1.longitude - pos2.longitude));
  const speed1 = Math.abs(pos1.speed || 1);
  const speed2 = Math.abs(pos2.speed || 1);
  const relativeSpeed = speed1 + speed2;
  
  const degreesToMove = Math.abs(currentDiff - targetAngle);
  const daysToExact = degreesToMove / Math.max(relativeSpeed, 0.1);
  
  return new Date(fromDate.getTime() + daysToExact * 24 * 60 * 60 * 1000);
}

function isApplyingAspect(pos1: PlanetPosition, pos2: PlanetPosition, targetAngle: number): boolean {
  const currentDiff = normalizeAngle(pos1.longitude - pos2.longitude);
  const movingToward = (pos1.speed || 0) > (pos2.speed || 0);
  
  if (targetAngle === 0) {
    return movingToward ? currentDiff > 350 || currentDiff < 10 : false;
  }
  return movingToward;
}

function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

function getPlanetSpeed(planet: string): number {
  const speeds: Record<string, number> = {
    Moon: 13.2, Sun: 1.0, Mercury: 1.4, Venus: 1.2, Mars: 0.5,
    Jupiter: 0.08, Saturn: 0.03, Uranus: 0.01, Neptune: 0.006, Pluto: 0.004,
    moon: 13.2, sun: 1.0, mercury: 1.4, venus: 1.2, mars: 0.5,
    jupiter: 0.08, saturn: 0.03, uranus: 0.01, neptune: 0.006, pluto: 0.004
  };
  return speeds[planet] || 0.5;
}

function getAspectOrb(aspect: string): number {
  const orbs: Record<string, number> = {
    conjunction: 8, opposition: 8, trine: 8, square: 8, sextile: 6, quincunx: 2
  };
  return orbs[aspect.toLowerCase()] || 8;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const CelestialWeatherEngine = {
  calculateSkyAspects,
  generateDailyWeather,
  buildTransitTimeline,
  generatePersonalForecast
};

export default CelestialWeatherEngine;
