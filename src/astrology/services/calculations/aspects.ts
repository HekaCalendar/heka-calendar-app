/**
 * Aspect Calculator
 * Calculates astrological aspects between celestial bodies
 */

import type {
  PlanetId,
  CelestialBody,
  Aspect,
  AspectType,
  Degree
} from '../../types';

import {
  ASPECT_TYPES,
  ASPECT_ANGLES,
  ASPECT_ORBS,
  normalizeDegree,
  toDegree
} from '../../types';

export interface AspectCalculationOptions {
  /** Which bodies to include in calculation */
  bodyFilter?: PlanetId[];
  /** Which aspect types to calculate */
  aspectFilter?: AspectType[];
  /** Orb modifier (0.5 = tighter, 2.0 = wider) */
  orbModifier?: number;
  /** Include minor aspects */
  includeMinorAspects?: boolean;
}

// ── LRU cache for aspect calculations ────────────────────────────────────────
const MAX_CACHED_ASPECTS = 16;
const aspectsCache = new Map<string, Aspect[]>();

function getAspectsCacheKey(
  bodies: Record<PlanetId, CelestialBody>,
  options: AspectCalculationOptions
): string {
  const bodyList = (options.bodyFilter ?? Object.keys(bodies) as PlanetId[]).filter(id => bodies[id]);
  const bodySig = bodyList
    .map(id => {
      const b = bodies[id];
      return `${id}:${b.longitude.toFixed(4)}:${(b.speed ?? 0).toFixed(4)}`;
    })
    .join('|');
  const optSig = `${options.orbModifier ?? 1}:${options.includeMinorAspects ?? false}:${(options.aspectFilter ?? []).join(',')}`;
  return `${bodySig}|${optSig}`;
}

function setCachedAspects(key: string, aspects: Aspect[]): void {
  aspectsCache.set(key, aspects);
  while (aspectsCache.size > MAX_CACHED_ASPECTS) {
    const first = aspectsCache.keys().next().value;
    if (first !== undefined) {
      aspectsCache.delete(first);
    }
  }
}

/**
 * Calculate all aspects between a set of celestial bodies
 */
export function calculateAspects(
  bodies: Record<PlanetId, CelestialBody>,
  options: AspectCalculationOptions = {}
): Aspect[] {
  const cacheKey = getAspectsCacheKey(bodies, options);
  const cached = aspectsCache.get(cacheKey);
  if (cached) return cached;

  const {
    bodyFilter = Object.keys(bodies) as PlanetId[],
    aspectFilter = [...ASPECT_TYPES],
    orbModifier = 1,
    includeMinorAspects = false
  } = options;

  const aspects: Aspect[] = [];
  const bodyList = bodyFilter.filter(id => bodies[id]);

  // Compare each pair once
  for (let i = 0; i < bodyList.length; i++) {
    for (let j = i + 1; j < bodyList.length; j++) {
      const body1 = bodies[bodyList[i]];
      const body2 = bodies[bodyList[j]];

      if (!body1 || !body2) continue;

      const aspect = calculateAspectBetweenBodies(body1, body2, {
        aspectFilter,
        orbModifier,
        includeMinorAspects
      });

      if (aspect) {
        aspects.push(aspect);
      }
    }
  }

  // Sort by orb (tightest first)
  const result = aspects.sort((a, b) => a.orb - b.orb);
  setCachedAspects(cacheKey, result);
  return result;
}

/**
 * Calculate aspect between two specific bodies
 */
export function calculateAspectBetweenBodies(
  body1: CelestialBody,
  body2: CelestialBody,
  options: Omit<AspectCalculationOptions, 'bodyFilter'> = {}
): Aspect | null {
  const {
    aspectFilter = ASPECT_TYPES,
    orbModifier = 1,
    includeMinorAspects = false
  } = options;

  const separation = calculateSeparation(body1.longitude, body2.longitude);

  for (const aspectType of aspectFilter) {
    // Skip minor aspects if not included
    if (!includeMinorAspects && isMinorAspect(aspectType)) {
      continue;
    }

    const targetAngle = ASPECT_ANGLES[aspectType];
    const baseOrb = ASPECT_ORBS[aspectType];
    const adjustedOrb = baseOrb * orbModifier;

    const orb = Math.abs(separation - targetAngle);

    if (orb <= adjustedOrb) {
      return {
        type: aspectType,
        body1: body1.id,
        body2: body2.id,
        angle: toDegree(separation),
        orb: toDegree(orb),
        applying: isApplying(body1, body2),
        isExact: orb < 0.1
      };
    }
  }

  return null;
}

/**
 * Calculate the shortest separation between two longitudes
 */
export function calculateSeparation(long1: Degree, long2: Degree): number {
  const diff = Math.abs(long1 - long2);
  return Math.min(diff, 360 - diff);
}

/**
 * Determine if an aspect is applying (strengthening) or separating
 */
export function isApplying(
  body1: CelestialBody,
  body2: CelestialBody
): boolean {
  // Simplified: if faster moving planet is approaching the aspect, it's applying
  const faster = Math.abs(body1.speed) > Math.abs(body2.speed) ? body1 : body2;
  const slower = faster === body1 ? body2 : body1;

  const currentSep = calculateSeparation(body1.longitude, body2.longitude);
  
  // Project forward slightly
  const projection = 0.01; // Very small time step
  const fasterFutureLong = normalizeDegree((faster.longitude + faster.speed * projection) as Degree);
  const slowerFutureLong = normalizeDegree((slower.longitude + slower.speed * projection) as Degree);
  const futureSep = calculateSeparation(fasterFutureLong, slowerFutureLong);

  // If separation is decreasing, aspect is applying
  return futureSep < currentSep;
}

/**
 * Check if an aspect type is considered minor
 */
function isMinorAspect(aspectType: AspectType): boolean {
  return ['semisextile', 'quincunx'].includes(aspectType);
}

/**
 * Get aspect symbol
 */
export function getAspectSymbol(aspectType: AspectType): string {
  const symbols: Record<AspectType, string> = {
    conjunction: '☌',
    semisextile: '⚺',
    semisquare: '∠',
    sextile: '⚹',
    quintile: 'Q',
    square: '□',
    trine: '△',
    sesquiquadrate: '⚼',
    biquintile: 'bQ',
    quincunx: '⚻',
    opposition: '☍'
  };
  return symbols[aspectType];
}

/**
 * Get aspect description
 */
export function getAspectDescription(aspectType: AspectType): string {
  const descriptions: Record<AspectType, string> = {
    conjunction: 'Unity, fusion, intensity',
    semisextile: 'Opportunity, subtle connection',
    semisquare: 'Friction, agitation, mild tension',
    sextile: 'Harmony, opportunity, ease',
    quintile: 'Talent, creativity, unique gifts',
    square: 'Challenge, tension, action',
    trine: 'Flow, talent, natural ability',
    sesquiquadrate: 'Irritation, persistence required',
    biquintile: 'Inspiration, artistic expression',
    quincunx: 'Adjustment, awkwardness, health',
    opposition: 'Polarity, awareness, relationship'
  };
  return descriptions[aspectType];
}

/**
 * Get color for aspect type (for visualization)
 */
export function getAspectColor(aspectType: AspectType): string {
  const colors: Record<AspectType, string> = {
    conjunction: '#FFD700', // Gold
    semisextile: '#90EE90', // Light green
    semisquare: '#FFA500',  // Orange
    sextile: '#32CD32',     // Green
    quintile: '#9370DB',    // Medium purple
    square: '#FF4500',      // Orange-red
    trine: '#4169E1',       // Royal blue
    sesquiquadrate: '#FF8C00', // Dark orange
    biquintile: '#8A2BE2',  // Blue violet
    quincunx: '#FF69B4',    // Hot pink
    opposition: '#DC143C'   // Crimson
  };
  return colors[aspectType];
}

/**
 * Calculate transits - aspects between current/transiting planets and natal chart
 */
export function calculateTransits(
  natalBodies: Record<PlanetId, CelestialBody>,
  transitingBodies: Record<PlanetId, CelestialBody>,
  options: AspectCalculationOptions = {}
): Aspect[] {
  const aspects: Aspect[] = [];

  const natalList = Object.values(natalBodies);
  const transitList = Object.values(transitingBodies);

  for (const transit of transitList) {
    for (const natal of natalList) {
      const aspect = calculateAspectBetweenBodies(transit, natal, options);
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb);
}
