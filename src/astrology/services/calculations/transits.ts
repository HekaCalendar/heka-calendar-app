/**
 * Transit Calculator
 * Calculates daily transits and their meanings
 */

import type { CelestialBody, Aspect, PlanetId } from '../../types';
import type { AspectCalculationOptions } from './aspects';
import { calculateAspectBetweenBodies } from './aspects';

export interface DailyTransit {
  readonly transitingPlanet: PlanetId;
  readonly natalPlanet: PlanetId;
  readonly aspect: Aspect;
  readonly exactTime?: Date;
  readonly applying: boolean;
  readonly duration: number; // Hours of influence
  readonly significance: 'major' | 'minor';
  readonly interpretation: string;
}

export interface TransitForecast {
  readonly date: string;
  readonly transits: DailyTransit[];
  readonly dominantTheme: string;
  readonly advice: string;
  readonly powerMoments: string[];
  readonly cautionPeriods: string[];
}

/**
 * Calculate transits between current positions and natal chart
 */
export function calculateTransits(
  currentPositions: Record<PlanetId, CelestialBody>,
  natalPositions: Record<PlanetId, CelestialBody>,
  options: AspectCalculationOptions = {}
): DailyTransit[] {
  const transits: DailyTransit[] = [];
  
  // Get aspects between current and natal
  const allCurrentBodies = Object.values(currentPositions);
  const allNatalBodies = Object.values(natalPositions);
  
  for (const transiting of allCurrentBodies) {
    for (const natal of allNatalBodies) {
      // Skip same planet (conjunction with self)
      if (transiting.id === natal.id) continue;
      
      const aspect = calculateAspectsBetweenBodies(transiting, natal, options);
      
      if (aspect && aspect.orb <= 3) { // Only close orbs for daily transits
        transits.push({
          transitingPlanet: transiting.id,
          natalPlanet: natal.id,
          aspect,
          applying: aspect.applying,
          duration: calculateTransitDuration(transiting, aspect),
          significance: getTransitSignificance(transiting.id, natal.id, aspect),
          interpretation: generateTransitInterpretation(transiting, natal, aspect)
        });
      }
    }
  }
  
  return transits.sort((a, b) => a.aspect.orb - b.aspect.orb);
}

/**
 * Calculate aspects between two bodies
 */
function calculateAspectsBetweenBodies(
  body1: CelestialBody,
  body2: CelestialBody,
  options: AspectCalculationOptions
): Aspect | null {
  return calculateAspectBetweenBodies(body1, body2, options);
}

/**
 * Calculate how long a transit remains active
 */
function calculateTransitDuration(transiting: CelestialBody, aspect: Aspect): number {
  // Slower planets = longer transits
  const speeds: Record<string, number> = {
    'moon': 12,      // ~2 hours per degree
    'sun': 1,        // ~1 day per degree
    'mercury': 1.5,
    'venus': 1,
    'mars': 0.5,
    'jupiter': 0.08,
    'saturn': 0.03,
    'uranus': 0.01,
    'neptune': 0.006,
    'pluto': 0.004
  };
  
  const speed = speeds[transiting.id] || 1;
  const orb = aspect.orb + 1; // Include separating period
  
  return Math.round((orb / speed) * 24); // Hours
}

/**
 * Get significance of transit
 */
function getTransitSignificance(
  transiting: PlanetId,
  natal: PlanetId,
  aspect: Aspect
): 'major' | 'minor' {
  // Outer planets to personal planets = major
  const outerPlanets = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const personalPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars'];
  
  if (outerPlanets.includes(transiting) && personalPlanets.includes(natal)) {
    return 'major';
  }
  
  // Hard aspects to Sun or Moon = major
  if ((natal === 'sun' || natal === 'moon') && 
      ['square', 'opposition', 'conjunction'].includes(aspect.type)) {
    return 'major';
  }
  
  return 'minor';
}

/**
 * Generate transit interpretation
 */
function generateTransitInterpretation(
  transiting: CelestialBody,
  natal: CelestialBody,
  _aspect: Aspect
): string {
  const templates: Record<string, Record<string, string>> = {
    'moon': {
      'sun': 'Emotional illumination. Your feelings are visible.',
      'moon': 'Emotional sensitivity heightened. Trust intuition.',
      'mercury': 'Mental and emotional alignment. Express feelings.',
      'venus': 'Romantic and emotional harmony. Nurture relationships.',
      'mars': 'Emotional energy peaks. Channel passion constructively.',
      'default': 'Emotional activity in this area of life.'
    },
    'sun': {
      'sun': 'Solar return energy. Vitality and identity spotlight.',
      'moon': 'Consciousness illuminates emotions. Clarity about needs.',
      'mercury': 'Mental clarity and self-expression enhanced.',
      'venus': 'Love and values come into focus.',
      'mars': 'Will and action align. Pursue goals boldly.',
      'default': 'Your core identity activates this area.'
    },
    'mercury': {
      'sun': 'Mental focus on identity. Communications important.',
      'moon': 'Thoughts and feelings intertwine. Journal beneficial.',
      'mercury': 'Mental activity peaks. Learning and communication.',
      'default': 'Mental activity and communication focus.'
    },
    'venus': {
      'sun': 'Love and beauty illuminate your essence.',
      'moon': 'Emotional harmony sought. Nurture yourself.',
      'mercury': 'Romantic thoughts and artistic expression.',
      'venus': 'Love and values emphasized. Relationships key.',
      'mars': 'Passion and attraction. Balance giving/receiving.',
      'default': 'Love, beauty, and values are highlighted.'
    },
    'mars': {
      'sun': 'Energy and willpower surge. Take action.',
      'moon': 'Emotional energy peaks. Channel constructively.',
      'mercury': 'Mental drive and decisive thinking.',
      'venus': 'Passion in relationships. Sexual energy.',
      'mars': 'Drive and assertion maximized. Physical activity.',
      'default': 'Action, drive, and energy focus.'
    },
    'jupiter': {
      'sun': 'Expansion of self. Growth opportunities.',
      'moon': 'Emotional expansion. Optimism and hope.',
      'default': 'Growth, expansion, and opportunity.'
    },
    'saturn': {
      'sun': 'Responsibility and maturation. Lessons to learn.',
      'moon': 'Emotional responsibility. Maturity required.',
      'default': 'Structure, limitation, and lessons.'
    }
  };
  
  const planetTemplates = templates[transiting.id] || templates['sun'];
  return planetTemplates[natal.id] || planetTemplates['default'] || 'Significant activation.';
}

/**
 * Generate daily forecast from transits
 */
export function generateDailyForecast(
  date: Date,
  transits: DailyTransit[]
): TransitForecast {
  const themes = extractThemes(transits);
  const advice = generateAdvice(transits);
  const powerMoments = findPowerMoments(transits);
  const cautionPeriods = findCautionPeriods(transits);
  
  return {
    date: date.toISOString().split('T')[0],
    transits,
    dominantTheme: themes[0] || 'Steady Progress',
    advice,
    powerMoments,
    cautionPeriods
  };
}

/**
 * Extract themes from transits
 */
function extractThemes(transits: DailyTransit[]): string[] {
  const themes: string[] = [];
  
  const has = (planet: string) => transits.some(t => 
    t.transitingPlanet === planet || t.natalPlanet === planet
  );
  
  if (has('moon')) themes.push('Emotional Processing');
  if (has('mercury')) themes.push('Communication Focus');
  if (has('venus')) themes.push('Relationship Themes');
  if (has('mars')) themes.push('Action and Drive');
  if (has('jupiter')) themes.push('Growth Opportunities');
  if (has('saturn')) themes.push('Responsibility and Structure');
  if (has('uranus')) themes.push('Unexpected Changes');
  if (has('neptune')) themes.push('Spiritual Insights');
  if (has('pluto')) themes.push('Deep Transformation');
  
  return themes;
}

/**
 * Generate advice based on transits
 */
function generateAdvice(transits: DailyTransit[]): string {
  const challenging = transits.filter(t => 
    ['square', 'opposition'].includes(t.aspect.type) && t.significance === 'major'
  );
  
  const supportive = transits.filter(t => 
    ['trine', 'sextile'].includes(t.aspect.type)
  );
  
  if (challenging.length > 0 && supportive.length > 0) {
    return 'Balance challenge with opportunity today. Face difficulties with awareness while leveraging supportive energies.';
  } else if (challenging.length > 0) {
    return 'A day for patience and self-care. Challenges are opportunities for growth.';
  } else if (supportive.length > 0) {
    return 'Favorable energies support your endeavors. Take action on what matters.';
  }
  
  return 'A steady day. Focus on routine and maintenance.';
}

/**
 * Find optimal times in the day
 */
function findPowerMoments(transits: DailyTransit[]): string[] {
  const moments: string[] = [];
  
  // Moon-Jupiter or Moon-Venus = good for most things
  const positive = transits.filter(t => 
    (t.transitingPlanet === 'moon' && 
     (t.natalPlanet === 'jupiter' || t.natalPlanet === 'venus')) &&
    ['trine', 'sextile', 'conjunction'].includes(t.aspect.type)
  );
  
  if (positive.length > 0) {
    moments.push('Morning - Emotional optimism supports new beginnings');
  }
  
  // Sun-Mars = energy peak
  const energetic = transits.filter(t =>
    (t.transitingPlanet === 'sun' && t.natalPlanet === 'mars') ||
    (t.transitingPlanet === 'mars' && t.natalPlanet === 'sun')
  );
  
  if (energetic.length > 0) {
    moments.push('Afternoon - Peak energy for decisive action');
  }
  
  return moments;
}

/**
 * Find caution periods
 */
function findCautionPeriods(transits: DailyTransit[]): string[] {
  const periods: string[] = [];
  
  // Moon-Saturn = emotional restriction
  const restrictive = transits.filter(t =>
    t.transitingPlanet === 'moon' && 
    t.natalPlanet === 'saturn' &&
    ['square', 'opposition'].includes(t.aspect.type)
  );
  
  if (restrictive.length > 0) {
    periods.push('Evening - Emotional withdrawal possible. Practice self-compassion.');
  }
  
  // Mars-Saturn = blocked action
  const blocked = transits.filter(t =>
    (t.transitingPlanet === 'mars' && t.natalPlanet === 'saturn') ||
    (t.transitingPlanet === 'saturn' && t.natalPlanet === 'mars')
  );
  
  if (blocked.length > 0) {
    periods.push('Avoid forcing outcomes. Patience required.');
  }
  
  return periods;
}

export default {
  calculateTransits,
  generateDailyForecast
};
