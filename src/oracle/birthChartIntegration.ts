/**
 * Birth Chart Integration Engine
 * Connects Oracle Engine to personal natal charts for individualized insights
 */

// Swiss Ephemeris imports are done dynamically in getCurrentPlanetaryPositions
// to avoid circular dependencies

// ============================================================================
// TYPES
// ============================================================================

export type ZodiacSign = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 
                         'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces' | 'ophiuchus';

export interface PlanetPosition {
  longitude: number;
  sign: ZodiacSign;
  degree: number;
  minute: number;
  house?: number;
  retrograde: boolean;
  speed: number;
}

export interface BirthChart {
  timestamp: string;
  ascendant: PlanetPosition;
  planets: Record<string, PlanetPosition>;
}

export interface PersonalTransit {
  id: string;
  transitingPlanet: string;
  natalPlanet: string;
  aspect: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx';
  orb: number;
  strength: number;
  activatedHouse: number;
  natalHouse: number;
  transitingSign: ZodiacSign;
  natalSign: ZodiacSign;
  isChartRulerActivated: boolean;
  isAscendantRuler: boolean;
  interpretation: string;
  keywords: string[];
  lifeArea: string;
  duration: {
    start: string;
    exact: string;
    end: string;
  };
}

export interface HouseActivation {
  house: number;
  sign: ZodiacSign;
  transitingPlanets: string[];
  natalPlanets: string[];
  ruler: {
    planet: string;
    currentSign: ZodiacSign;
    currentHouse: number;
    aspectToHouse: string | null;
  };
  activationScore: number;
  lifeAreas: string[];
  keywords: string[];
}

export interface ChartRulerStatus {
  chartRuler: string;
  currentSign: ZodiacSign;
  currentHouse: number;
  natalPosition: PlanetPosition;
  isInDomicile: boolean;
  isExalted: boolean;
  isInDetriment: boolean;
  isInFall: boolean;
  dignityScore: number;
  aspects: PersonalTransit[];
  overallStrength: number;
  guidance: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PLANET_DIGNITIES: Record<string, { 
  domicile: ZodiacSign[]; 
  exaltation: ZodiacSign | null; 
  detriment: ZodiacSign[]; 
  fall: ZodiacSign | null 
}> = {
  Sun: { domicile: ['leo'], exaltation: 'aries', detriment: ['aquarius'], fall: 'libra' },
  Moon: { domicile: ['cancer'], exaltation: 'taurus', detriment: ['capricorn'], fall: 'scorpio' },
  Mercury: { domicile: ['gemini', 'virgo', 'ophiuchus'], exaltation: 'virgo', detriment: ['sagittarius', 'pisces'], fall: 'pisces' },
  Venus: { domicile: ['taurus', 'libra'], exaltation: 'pisces', detriment: ['scorpio', 'aries'], fall: 'virgo' },
  Mars: { domicile: ['aries', 'scorpio'], exaltation: 'capricorn', detriment: ['libra', 'taurus'], fall: 'cancer' },
  Jupiter: { domicile: ['sagittarius', 'pisces'], exaltation: 'cancer', detriment: ['gemini', 'virgo'], fall: 'capricorn' },
  Saturn: { domicile: ['capricorn', 'aquarius'], exaltation: 'libra', detriment: ['cancer', 'leo'], fall: 'aries' },
  Uranus: { domicile: ['aquarius'], exaltation: null, detriment: ['leo'], fall: null },
  Neptune: { domicile: ['pisces'], exaltation: null, detriment: ['virgo'], fall: null },
  Pluto: { domicile: ['scorpio', 'ophiuchus'], exaltation: null, detriment: ['taurus'], fall: null },
};

const HOUSE_KEYWORDS: Record<number, { areas: string[]; keywords: string[] }> = {
  1: { areas: ['self', 'identity', 'appearance'], keywords: ['me', 'myself', 'appearance', 'body', 'start'] },
  2: { areas: ['values', 'money', 'possessions'], keywords: ['money', 'income', 'values', 'worth', 'possessions'] },
  3: { areas: ['communication', 'siblings', 'learning'], keywords: ['talk', 'write', 'siblings', 'learn', 'study'] },
  4: { areas: ['home', 'family', 'roots'], keywords: ['home', 'family', 'mother', 'roots', 'security'] },
  5: { areas: ['creativity', 'romance', 'children'], keywords: ['create', 'art', 'fun', 'romance', 'children'] },
  6: { areas: ['work', 'health', 'routines'], keywords: ['work', 'health', 'routine', 'service'] },
  7: { areas: ['relationships', 'partnerships'], keywords: ['partner', 'marriage', 'relationship', 'contract'] },
  8: { areas: ['transformation', 'shared resources'], keywords: ['transform', 'intimate', 'shared', 'debt'] },
  9: { areas: ['higher learning', 'travel', 'belief'], keywords: ['travel', 'study', 'philosophy', 'believe'] },
  10: { areas: ['career', 'public image'], keywords: ['career', 'work', 'public', 'boss', 'authority'] },
  11: { areas: ['friends', 'groups', 'hopes'], keywords: ['friend', 'group', 'hope', 'future', 'community'] },
  12: { areas: ['spirituality', 'unconscious'], keywords: ['spirit', 'dream', 'hidden', 'alone', 'surrender'] },
};

const ASPECT_ORBS = {
  conjunction: { orb: 8, weight: 1.0 },
  opposition: { orb: 8, weight: 0.9 },
  trine: { orb: 6, weight: 0.7 },
  square: { orb: 6, weight: 0.8 },
  sextile: { orb: 4, weight: 0.5 },
  quincunx: { orb: 2, weight: 0.3 },
};

const PLANET_SIGNIFICANCE: Record<string, number> = {
  Sun: 1.0, Moon: 0.9, Mercury: 0.7, Venus: 0.7, Mars: 0.8,
  Jupiter: 0.85, Saturn: 0.9, Uranus: 0.75, Neptune: 0.7, Pluto: 0.8,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

import { getSignFromLongitude, toDegree, ZODIAC_SIGNS_13, type ZodiacSign13 } from '../astrology/types/core';

function getWholeSignHouse(longitude: number, ascendantDegree: number, use13Signs?: boolean): number {
  const normLong = ((longitude % 360) + 360) % 360;
  const normAsc = ((ascendantDegree % 360) + 360) % 360;

  // Auto-detect 13-sign mode if not explicitly provided
  const _use13Signs = use13Signs ?? false;

  if (_use13Signs) {
    // 13-sign mode: use actual sign names and their positions in the 13-sign order
    const ascSign = getSignFromLongitude(toDegree(normAsc), true);
    const planetSign = getSignFromLongitude(toDegree(normLong), true);
    const ascIndex = ZODIAC_SIGNS_13.indexOf(ascSign as ZodiacSign13);
    const planetIndex = ZODIAC_SIGNS_13.indexOf(planetSign as ZodiacSign13);
    if (ascIndex === -1 || planetIndex === -1) return 1;
    let house = planetIndex - ascIndex + 1;
    if (house <= 0) house += 13;
    // Houses are always 1-12 regardless of sign count
    if (house > 12) house -= 12;
    return house;
  }

  // 12-sign mode: traditional 30° division
  const ascSignIndex = Math.floor(normAsc / 30);
  const planetSignIndex = Math.floor(normLong / 30);
  let house = planetSignIndex - ascSignIndex + 1;
  if (house <= 0) house += 12;
  return house;
}

function calculateAspect(long1: number, long2: number): {
  aspect: keyof typeof ASPECT_ORBS | null;
  orb: number;
} {
  const diff = Math.abs(((long1 - long2 + 180) % 360) - 180);
  
  const aspects = [
    { name: 'conjunction', angle: 0 },
    { name: 'opposition', angle: 180 },
    { name: 'trine', angle: 120 },
    { name: 'square', angle: 90 },
    { name: 'sextile', angle: 60 },
    { name: 'quincunx', angle: 150 },
  ] as const;
  
  for (const { name, angle } of aspects) {
    const orb = Math.abs(diff - angle);
    if (orb <= ASPECT_ORBS[name].orb) {
      return { aspect: name, orb };
    }
  }
  
  return { aspect: null, orb: 0 };
}

// ============================================================================
// MAIN CALCULATION FUNCTIONS
// ============================================================================

export function calculateChartRulerStatus(
  birthChart: BirthChart,
  currentPositions: Record<string, PlanetPosition>
): ChartRulerStatus {
  const ascendantSign = birthChart.ascendant.sign;
  
  // Auto-detect 13-sign mode
  const use13Signs = ascendantSign === 'ophiuchus' ||
    Object.values(currentPositions).some(p => p.sign === 'ophiuchus') ||
    Object.values(birthChart.planets).some(p => p.sign === 'ophiuchus');
  const chartRulerMap: Record<ZodiacSign, string> = {
    'aries': 'Mars', 'taurus': 'Venus', 'gemini': 'Mercury',
    'cancer': 'Moon', 'leo': 'Sun', 'virgo': 'Mercury',
    'libra': 'Venus', 'scorpio': 'Pluto', 'sagittarius': 'Jupiter',
    'capricorn': 'Saturn', 'aquarius': 'Uranus', 'pisces': 'Neptune',
    'ophiuchus': 'Chiron'
  };
  
  const chartRuler = chartRulerMap[ascendantSign];
  const natalRuler = birthChart.planets[chartRuler];
  const currentRuler = currentPositions[chartRuler];
  
  if (!natalRuler || !currentRuler) {
    return {
      chartRuler,
      currentSign: currentRuler?.sign || 'aries',
      currentHouse: 1,
      natalPosition: natalRuler || { longitude: 0, sign: 'aries', degree: 0, minute: 0, retrograde: false, speed: 0 },
      isInDomicile: false,
      isExalted: false,
      isInDetriment: false,
      isInFall: false,
      dignityScore: 0,
      aspects: [],
      overallStrength: 50,
      guidance: `Your chart ruler ${chartRuler} data is incomplete.`,
    };
  }
  
  const dignities = PLANET_DIGNITIES[chartRuler];
  let dignityScore = 0;
  let isInDomicile = false;
  let isExalted = false;
  let isInDetriment = false;
  
  if (dignities) {
    if (dignities.domicile.includes(currentRuler.sign)) {
      dignityScore += 5;
      isInDomicile = true;
    }
    if (dignities.exaltation === currentRuler.sign) {
      dignityScore += 4;
      isExalted = true;
    }
    if (dignities.detriment.includes(currentRuler.sign)) {
      dignityScore -= 5;
      isInDetriment = true;
    }
  }
  
  const aspects: PersonalTransit[] = [];
  Object.entries(currentPositions).forEach(([planet, position]) => {
    const { aspect, orb } = calculateAspect(position.longitude, natalRuler.longitude);
    if (aspect && planet !== chartRuler) {
      const strength = calculateTransitStrength(planet, chartRuler, aspect, orb, dignityScore);
      aspects.push({
        id: `${planet}-${chartRuler}-${aspect}`,
        transitingPlanet: planet,
        natalPlanet: chartRuler,
        aspect,
        orb,
        strength,
        activatedHouse: 0,
        natalHouse: getWholeSignHouse(natalRuler.longitude, birthChart.ascendant.longitude, use13Signs),
        transitingSign: position.sign,
        natalSign: natalRuler.sign,
        isChartRulerActivated: true,
        isAscendantRuler: true,
        interpretation: '',
        keywords: [chartRuler.toLowerCase(), aspect, 'chart ruler'],
        lifeArea: 'self identity',
        duration: { start: '', exact: '', end: '' }
      });
    }
  });
  
  const aspectStrength = aspects.reduce((sum, a) => sum + a.strength, 0) / Math.max(aspects.length, 1);
  const overallStrength = Math.min(100, (dignityScore + 5) * 10 + aspectStrength * 0.3);
  
  let guidance = '';
  if (isInDomicile) {
    guidance = `Your chart ruler ${chartRuler} is in its home sign ${currentRuler.sign}. You radiate authenticity.`;
  } else if (isExalted) {
    guidance = `${chartRuler} is exalted. Your personal magnetism is heightened.`;
  } else if (isInDetriment) {
    guidance = `${chartRuler} is in a challenging sign. Focus on patience.`;
  } else {
    guidance = `Your chart ruler ${chartRuler} suggests focusing on self-development.`;
  }
  
  return {
    chartRuler,
    currentSign: currentRuler.sign,
    currentHouse: getWholeSignHouse(currentRuler.longitude, birthChart.ascendant.longitude, use13Signs),
    natalPosition: natalRuler,
    isInDomicile,
    isExalted,
    isInDetriment,
    isInFall: false,
    dignityScore,
    aspects: aspects.sort((a, b) => b.strength - a.strength),
    overallStrength,
    guidance,
  };
}

function calculateTransitStrength(
  transitingPlanet: string,
  natalPlanet: string,
  aspect: keyof typeof ASPECT_ORBS,
  orb: number,
  dignityScore: number = 0
): number {
  const baseWeight = ASPECT_ORBS[aspect].weight;
  const transitingWeight = PLANET_SIGNIFICANCE[transitingPlanet] || 0.5;
  const natalWeight = PLANET_SIGNIFICANCE[natalPlanet] || 0.5;
  const maxOrb = ASPECT_ORBS[aspect].orb;
  const orbFactor = 1 - (orb / maxOrb);
  const dignityFactor = 1 + (dignityScore / 10);
  
  let strength = baseWeight * transitingWeight * natalWeight * orbFactor * dignityFactor * 100;
  
  const outerPlanets = ['Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
  
  if (outerPlanets.includes(transitingPlanet) && personalPlanets.includes(natalPlanet)) {
    strength *= 1.2;
  }
  
  return Math.min(100, Math.round(strength));
}

export function calculatePersonalTransits(
  birthChart: BirthChart,
  currentPositions: Record<string, PlanetPosition>,
  date: Date = new Date()
): PersonalTransit[] {
  const transits: PersonalTransit[] = [];
  
  // Guard against null/missing ascendant (can happen with incomplete birth charts)
  if (!birthChart.ascendant || typeof birthChart.ascendant.longitude !== 'number') {
    console.warn('[birthChartIntegration] Birth chart missing ascendant — skipping transit calculation');
    return transits;
  }
  
  const ascendantDegree = birthChart.ascendant.longitude;
  const ascendantSign = birthChart.ascendant.sign;
  
  // Auto-detect 13-sign mode by checking for Ophiuchus in the data
  const use13Signs = ascendantSign === 'ophiuchus' || 
    Object.values(currentPositions).some(p => p.sign === 'ophiuchus') ||
    Object.values(birthChart.planets).some(p => p.sign === 'ophiuchus');
  
  const chartRulerMap: Record<ZodiacSign, string> = {
    'aries': 'Mars', 'taurus': 'Venus', 'gemini': 'Mercury',
    'cancer': 'Moon', 'leo': 'Sun', 'virgo': 'Mercury',
    'libra': 'Venus', 'scorpio': 'Pluto', 'sagittarius': 'Jupiter',
    'capricorn': 'Saturn', 'aquarius': 'Uranus', 'pisces': 'Neptune',
    'ophiuchus': 'Chiron'
  };
  const chartRuler = chartRulerMap[ascendantSign] || chartRulerMap['scorpio'];
  
  Object.entries(currentPositions).forEach(([transitingName, transitingPos]) => {
    Object.entries(birthChart.planets).forEach(([natalName, natalPos]) => {
      if (transitingName === natalName) return;
      
      const { aspect, orb } = calculateAspect(transitingPos.longitude, natalPos.longitude);
      
      if (aspect) {
        const strength = calculateTransitStrength(transitingName, natalName, aspect, orb);
        const natalHouse = getWholeSignHouse(natalPos.longitude, ascendantDegree, use13Signs);
        
        if (strength >= 20) {
          transits.push({
            id: `${transitingName}-${natalName}-${aspect}-${date.toISOString().split('T')[0]}`,
            transitingPlanet: transitingName,
            natalPlanet: natalName,
            aspect,
            orb,
            strength,
            activatedHouse: getWholeSignHouse(transitingPos.longitude, ascendantDegree, use13Signs),
            natalHouse,
            transitingSign: transitingPos.sign,
            natalSign: natalPos.sign,
            isChartRulerActivated: natalName === chartRuler || transitingName === chartRuler,
            isAscendantRuler: natalName === chartRuler,
            interpretation: generateTransitInterpretation(transitingName, natalName, aspect, natalHouse),
            keywords: [transitingName.toLowerCase(), natalName.toLowerCase(), aspect],
            lifeArea: HOUSE_KEYWORDS[natalHouse]?.areas[0] || 'personal growth',
            duration: calculateTransitDuration(transitingName, aspect, orb, date)
          });
        }
      }
    });
  });
  
  return transits.sort((a, b) => b.strength - a.strength);
}

function generateTransitInterpretation(
  transitingPlanet: string,
  natalPlanet: string,
  aspect: string,
  _natalHouse: number
): string {
  const templates: Record<string, string[]> = {
    conjunction: [
      `${transitingPlanet} merges with your natal ${natalPlanet}, bringing intense focus.`,
      `A powerful new cycle begins as ${transitingPlanet} conjoins your ${natalPlanet}.`,
    ],
    trine: [
      `${transitingPlanet} harmonizes with your ${natalPlanet}, creating flow.`,
      `Supportive energy from ${transitingPlanet} helps your ${natalPlanet} expression.`,
    ],
    square: [
      `${transitingPlanet} challenges your ${natalPlanet}, creating tension that demands action.`,
      `A turning point emerges as ${transitingPlanet} squares your ${natalPlanet}.`,
    ],
    opposition: [
      `${transitingPlanet} opposes your ${natalPlanet}, bringing external situations that mirror internal themes.`,
      `Relationship dynamics come to the forefront.`,
    ],
    sextile: [
      `${transitingPlanet} offers opportunities to your ${natalPlanet}.`,
      `A window opens as ${transitingPlanet} sextiles your ${natalPlanet}.`,
    ],
  };
  
  const options = templates[aspect] || ['Significant celestial alignment in progress.'];
  return options[Math.floor(Math.random() * options.length)];
}

function calculateTransitDuration(
  planet: string,
  aspect: string,
  orb: number,
  fromDate: Date
): { start: string; exact: string; end: string } {
  const planetSpeeds: Record<string, number> = {
    Moon: 13, Sun: 1, Mercury: 1.5, Venus: 1.2, Mars: 0.5,
    Jupiter: 0.08, Saturn: 0.03, Uranus: 0.01, Neptune: 0.006, Pluto: 0.004
  };
  
  const speed = planetSpeeds[planet] || 0.5;
  const maxOrb = ASPECT_ORBS[aspect as keyof typeof ASPECT_ORBS]?.orb || 8;
  
  const daysToExact = orb / speed;
  
  const exact = new Date(fromDate.getTime() + daysToExact * 24 * 60 * 60 * 1000);
  const end = new Date(fromDate.getTime() + (daysToExact + maxOrb / speed) * 24 * 60 * 60 * 1000);
  
  return {
    start: fromDate.toISOString(),
    exact: exact.toISOString(),
    end: end.toISOString()
  };
}

// ============================================================================
// REAL EPHEMERIS INTEGRATION
// ============================================================================

/**
 * Get current planetary positions using Swiss Ephemeris
 */
export async function getCurrentPlanetaryPositions(
  date: Date = new Date(),
  zodiacOptions?: { zodiacFrame?: 'tropical' | 'sidereal'; signCount?: 12 | 13 }
): Promise<Record<string, PlanetPosition>> {
  try {
    // Import the Swiss Ephemeris engine dynamically to avoid circular dependencies
    const { calculateJulianDay, calculateAllPlanets } = await import('../astrology/services/swiss-ephemeris/engine');
    const jd = calculateJulianDay(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1, // month is 1-indexed in the ephemeris
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    // Pass zodiac options to the engine — accepts 'sidereal' | '12-sign' | '13-sign' as legacy string,
    // or a CalcOptions object with zodiacFrame + signCount
    const calcOpts = zodiacOptions?.zodiacFrame === 'sidereal'
      ? 'sidereal'
      : zodiacOptions?.signCount === 13
        ? '13-sign'
        : undefined;
    const positions = calculateAllPlanets(jd, undefined, calcOpts);
    
    const result: Record<string, PlanetPosition> = {};
    
    for (const [planet, pos] of Object.entries(positions)) {
      // Handle different property names that might exist on CelestialBody
      interface ExtendedCelestialBody {
        longitude: number;
        sign?: string;
        degreeInSign?: number;
        minute?: number;
        isRetrograde?: boolean;
        retrograde?: boolean;
        speed?: number;
      }
      const celestialBody = pos as unknown as ExtendedCelestialBody;
      result[planet] = {
        longitude: celestialBody.longitude,
        sign: (celestialBody.sign || 'aries').toLowerCase() as ZodiacSign,
        degree: celestialBody.degreeInSign || 0,
        minute: celestialBody.minute || 0,
        retrograde: celestialBody.isRetrograde || celestialBody.retrograde || false,
        speed: celestialBody.speed || 0,
      };
    }
    
    return result;
  } catch (error) {
    console.error('Failed to get planetary positions:', error);
    // Return fallback positions
    return getFallbackPositions();
  }
}

function getFallbackPositions(): Record<string, PlanetPosition> {
  return {
    Sun: { longitude: 120, sign: 'leo', degree: 0, minute: 0, retrograde: false, speed: 1 },
    Moon: { longitude: 60, sign: 'gemini', degree: 0, minute: 0, retrograde: false, speed: 13 },
    Mercury: { longitude: 115, sign: 'cancer', degree: 25, minute: 0, retrograde: false, speed: 1.5 },
    Venus: { longitude: 150, sign: 'virgo', degree: 0, minute: 0, retrograde: false, speed: 1.2 },
    Mars: { longitude: 200, sign: 'libra', degree: 20, minute: 0, retrograde: false, speed: 0.5 },
    Jupiter: { longitude: 45, sign: 'taurus', degree: 15, minute: 0, retrograde: false, speed: 0.08 },
    Saturn: { longitude: 330, sign: 'pisces', degree: 5, minute: 0, retrograde: false, speed: 0.03 },
    Uranus: { longitude: 50, sign: 'taurus', degree: 20, minute: 0, retrograde: false, speed: 0.01 },
    Neptune: { longitude: 355, sign: 'pisces', degree: 25, minute: 0, retrograde: false, speed: 0.006 },
    Pluto: { longitude: 300, sign: 'aquarius', degree: 0, minute: 0, retrograde: false, speed: 0.004 },
  };
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface TransitNotification {
  id: string;
  type: 'major' | 'moderate' | 'subtle';
  title: string;
  description: string;
  transit: PersonalTransit;
  actionItems: string[];
  expiresAt: string;
}

export function generateTransitNotifications(
  personalTransits: PersonalTransit[],
  chartRulerStatus?: ChartRulerStatus
): TransitNotification[] {
  const notifications: TransitNotification[] = [];
  
  const majorTransits = personalTransits.filter(t => t.strength >= 80);
  
  for (const transit of majorTransits) {
    notifications.push({
      id: `major-${transit.id}`,
      type: 'major',
      title: `${transit.transitingPlanet} ${transit.aspect} ${transit.natalPlanet}`,
      description: transit.interpretation,
      transit,
      actionItems: generateActionItems(transit.aspect),
      expiresAt: transit.duration.end,
    });
  }
  
  if (chartRulerStatus?.aspects.length) {
    const rulerAspect = chartRulerStatus.aspects[0];
    if (rulerAspect.strength >= 60) {
      notifications.push({
        id: `ruler-${rulerAspect.id}`,
        type: 'moderate',
        title: `Chart Ruler: ${rulerAspect.transitingPlanet} ${rulerAspect.aspect} ${rulerAspect.natalPlanet}`,
        description: chartRulerStatus.guidance,
        transit: rulerAspect,
        actionItems: ['Check in with your core self', 'Review personal goals'],
        expiresAt: rulerAspect.duration.end,
      });
    }
  }
  
  return notifications.sort((a, b) => b.transit.strength - a.transit.strength);
}

function generateActionItems(aspect: string): string[] {
  const actionMap: Record<string, string[]> = {
    'conjunction': ['Set new intentions', 'Start fresh', 'Focus your energy'],
    'trine': ['Take advantage of flow', 'Collaborate', 'Expand your reach'],
    'square': ['Face the challenge', 'Make a decision', 'Push through resistance'],
    'opposition': ['Seek balance', 'Consider others\' perspectives', 'Find middle ground'],
    'sextile': ['Explore opportunities', 'Make connections', 'Try something new'],
  };
  
  return actionMap[aspect] || ['Reflect on this energy', 'Journal your experiences'];
}

// ============================================================================
// EXPORT
// ============================================================================

export const BirthChartIntegration = {
  calculatePersonalTransits,
  calculateChartRulerStatus,
  getCurrentPlanetaryPositions,
  generateTransitNotifications,
};

export default BirthChartIntegration;
