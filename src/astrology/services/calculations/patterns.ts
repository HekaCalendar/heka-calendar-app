/**
 * Pattern Detector
 * Detects chart patterns like Grand Trines, T-Squares, etc.
 */

import type {
  PlanetId,
  Aspect,
  Pattern,
  CelestialBody
} from '../../types';

import { calculateSeparation } from './aspects';

export interface PatternDetectionOptions {
  /** Maximum orb for pattern aspects (tighter than standard) */
  patternOrbModifier?: number;
  /** Minimum number of planets for a stellium */
  stelliumMinimum?: number;
  /** Maximum degree spread for stellium */
  stelliumOrb?: number;
}

/**
 * Detect all patterns in a set of aspects
 */
export function detectPatterns(
  bodies: Record<PlanetId, CelestialBody>,
  aspects: Aspect[],
  options: PatternDetectionOptions = {}
): Pattern[] {
  const {
    // patternOrbModifier = 0.75, // Future: Tighter orbs for patterns
    stelliumMinimum = 3,
    stelliumOrb = 8
  } = options;

  const patterns: Pattern[] = [];

  // Find each pattern type
  patterns.push(...findGrandTrines(aspects));
  patterns.push(...findTSquares(aspects));
  patterns.push(...findGrandCrosses(aspects));
  patterns.push(...findYods(aspects));
  patterns.push(...findKites(aspects, aspects));
  patterns.push(...findStelliums(bodies, stelliumMinimum, stelliumOrb));
  patterns.push(...findCradles(aspects));

  // Remove duplicates
  return removeDuplicatePatterns(patterns);
}

/**
 * Find Grand Trines - 3 planets forming a triangle of trines
 */
function findGrandTrines(aspects: Aspect[]): Pattern[] {
  const patterns: Pattern[] = [];
  const trines = aspects.filter(a => a.type === 'trine');

  for (let i = 0; i < trines.length; i++) {
    for (let j = i + 1; j < trines.length; j++) {
      const trine1 = trines[i];
      const trine2 = trines[j];

      // Check if trines share a planet
      let sharedPlanet: PlanetId | null = null;
      let planetA: PlanetId | null = null;
      let planetB: PlanetId | null = null;

      if (trine1.body1 === trine2.body1) {
        sharedPlanet = trine1.body1;
        planetA = trine1.body2;
        planetB = trine2.body2;
      } else if (trine1.body1 === trine2.body2) {
        sharedPlanet = trine1.body1;
        planetA = trine1.body2;
        planetB = trine2.body1;
      } else if (trine1.body2 === trine2.body1) {
        sharedPlanet = trine1.body2;
        planetA = trine1.body1;
        planetB = trine2.body2;
      } else if (trine1.body2 === trine2.body2) {
        sharedPlanet = trine1.body2;
        planetA = trine1.body1;
        planetB = trine2.body1;
      }

      if (sharedPlanet && planetA && planetB && planetA !== planetB) {
        // Check if planetA and planetB are in trine
        const closingTrine = trines.find(t =>
          (t.body1 === planetA && t.body2 === planetB) ||
          (t.body1 === planetB && t.body2 === planetA)
        );

        if (closingTrine) {
          const planets = [sharedPlanet, planetA, planetB];
          
          patterns.push({
            type: 'grand-trine',
            planets: planets.sort(),
            description: `Grand Trine: ${planets.join(', ')} form a harmonious triangle`,
            strength: calculatePatternStrength(aspects, planets)
          });
        }
      }
    }
  }

  return patterns;
}

/**
 * Find T-Squares - 2 planets in opposition, both squaring a third
 */
function findTSquares(aspects: Aspect[]): Pattern[] {
  const patterns: Pattern[] = [];
  const oppositions = aspects.filter(a => a.type === 'opposition');
  const squares = aspects.filter(a => a.type === 'square');

  for (const opposition of oppositions) {
    // Find planets that square both ends of the opposition
    const squaringPlanets: PlanetId[] = [];

    for (const square of squares) {
      const squaresFirstEnd = square.body1 === opposition.body1 || square.body2 === opposition.body1;

      if (squaresFirstEnd) {
        const squaringPlanet = square.body1 === opposition.body1 ? square.body2 : square.body1;
        // Check if this planet also squares the other end
        const squaresBoth = squares.some(s =>
          (s.body1 === squaringPlanet && s.body2 === opposition.body2) ||
          (s.body2 === squaringPlanet && s.body1 === opposition.body2)
        );

        if (squaresBoth && !squaringPlanets.includes(squaringPlanet)) {
          squaringPlanets.push(squaringPlanet);
        }
      }
    }

    for (const apex of squaringPlanets) {
      const planets = [opposition.body1, opposition.body2, apex];
      
      patterns.push({
        type: 't-square',
        planets: planets.sort(),
        description: `T-Square: ${opposition.body1} opposite ${opposition.body2}, both square ${apex}`,
        strength: calculatePatternStrength(aspects, planets)
      });
    }
  }

  return patterns;
}

/**
 * Find Grand Crosses - 4 planets forming a cross (2 oppositions + 4 squares)
 */
function findGrandCrosses(aspects: Aspect[]): Pattern[] {
  const patterns: Pattern[] = [];
  const oppositions = aspects.filter(a => a.type === 'opposition');
  // Note: squares filter not needed - we use aspects.some() below for checking

  for (let i = 0; i < oppositions.length; i++) {
    for (let j = i + 1; j < oppositions.length; j++) {
      const opp1 = oppositions[i];
      const opp2 = oppositions[j];

      // Get all 4 planets involved
      const planets = [opp1.body1, opp1.body2, opp2.body1, opp2.body2];
      const uniquePlanets = [...new Set(planets)];

      // Need exactly 4 unique planets
      if (uniquePlanets.length !== 4) continue;

      // Check if all pairs form squares (or oppositions)
      const allAspectsPresent = uniquePlanets.every((p1, idx1) =>
        uniquePlanets.slice(idx1 + 1).every(p2 =>
          aspects.some(a =>
            ((a.body1 === p1 && a.body2 === p2) || (a.body1 === p2 && a.body2 === p1)) &&
            (a.type === 'square' || a.type === 'opposition')
          )
        )
      );

      if (allAspectsPresent) {
        patterns.push({
          type: 'grand-cross',
          planets: uniquePlanets.sort(),
          description: `Grand Cross: ${uniquePlanets.join(', ')} form a complete cross`,
          strength: calculatePatternStrength(aspects, uniquePlanets)
        });
      }
    }
  }

  return patterns;
}

/**
 * Find Yods (Finger of God) - 2 planets in quincunx to a common apex, sextile to each other
 */
function findYods(aspects: Aspect[]): Pattern[] {
  const patterns: Pattern[] = [];
  const quincunxes = aspects.filter(a => a.type === 'quincunx');
  const sextiles = aspects.filter(a => a.type === 'sextile');

  for (const sextile of sextiles) {
    // Find planets that are both in quincunx to a common apex
    const basePlanets = [sextile.body1, sextile.body2];

    for (const quincunx1 of quincunxes) {
      const basePlanet1 = basePlanets.find(p => p === quincunx1.body1 || p === quincunx1.body2);
      if (!basePlanet1) continue;

      const apex1 = quincunx1.body1 === basePlanet1 ? quincunx1.body2 : quincunx1.body1;

      for (const quincunx2 of quincunxes) {
        const basePlanet2 = basePlanets.find(p => 
          p !== basePlanet1 && (p === quincunx2.body1 || p === quincunx2.body2)
        );
        if (!basePlanet2) continue;

        const apex2 = quincunx2.body1 === basePlanet2 ? quincunx2.body2 : quincunx2.body1;

        // Same apex for both quincunxes
        if (apex1 === apex2) {
          const planets = [basePlanet1, basePlanet2, apex1];
          
          patterns.push({
            type: 'yod',
            planets: planets.sort(),
            description: `Yod: ${basePlanet1} and ${basePlanet2} sextile, both quincunx ${apex1}`,
            strength: calculatePatternStrength(aspects, planets)
          });
        }
      }
    }
  }

  return patterns;
}

/**
 * Find Kites - Grand Trine with an opposition to one point, forming a kite
 */
function findKites(trines: Aspect[], oppositions: Aspect[]): Pattern[] {
  const patterns: Pattern[] = [];

  // First find Grand Trines
  const grandTrines = findGrandTrines(trines);

  for (const grandTrine of grandTrines) {
    const trinePlanets = grandTrine.planets;

    // Find an opposition to one of the trine planets
    for (const opposition of oppositions) {
      const trinePlanet = trinePlanets.find(p => 
        p === opposition.body1 || p === opposition.body2
      );
      
      if (!trinePlanet) continue;

      const oppositePlanet = opposition.body1 === trinePlanet ? 
        opposition.body2 : opposition.body1;

      // Check if opposite planet sextiles the other two trine planets
      const otherTrinePlanets = trinePlanets.filter(p => p !== trinePlanet);
      const sextilesBoth = trines.some(t =>
        (t.body1 === oppositePlanet && t.body2 === otherTrinePlanets[0]) ||
        (t.body2 === oppositePlanet && t.body1 === otherTrinePlanets[0])
      ) && trines.some(t =>
        (t.body1 === oppositePlanet && t.body2 === otherTrinePlanets[1]) ||
        (t.body2 === oppositePlanet && t.body1 === otherTrinePlanets[1])
      );

      if (sextilesBoth) {
        const allPlanets = [...trinePlanets, oppositePlanet];
        
        patterns.push({
          type: 'kite',
          planets: allPlanets.sort(),
          description: `Kite: Grand Trine with ${oppositePlanet} opposing ${trinePlanet}`,
          strength: calculatePatternStrength([...trines, ...oppositions], allPlanets)
        });
      }
    }
  }

  return patterns;
}

/**
 * Find Stelliums - 3+ planets in close conjunction
 */
function findStelliums(
  bodies: Record<PlanetId, CelestialBody>,
  minimumPlanets: number,
  maxOrb: number
): Pattern[] {
  const patterns: Pattern[] = [];
  const bodyList = Object.values(bodies);

  // Group planets by sign
  const planetsBySign: Record<string, CelestialBody[]> = {};
  
  for (const body of bodyList) {
    if (!planetsBySign[body.sign]) {
      planetsBySign[body.sign] = [];
    }
    planetsBySign[body.sign].push(body);
  }

  // Find clusters within each sign
  for (const [sign, planets] of Object.entries(planetsBySign)) {
    if (planets.length < minimumPlanets) continue;

    // Sort by longitude
    planets.sort((a, b) => a.longitude - b.longitude);

    // Find clusters
    for (let i = 0; i <= planets.length - minimumPlanets; i++) {
      const cluster = [planets[i]];
      
      for (let j = i + 1; j < planets.length; j++) {
        const separation = calculateSeparation(
          planets[i].longitude,
          planets[j].longitude
        );
        
        if (separation <= maxOrb * (j - i)) {
          cluster.push(planets[j]);
        }
      }

      if (cluster.length >= minimumPlanets) {
        const planetIds = cluster.map(p => p.id).sort();
        
        patterns.push({
          type: 'stellium',
          planets: planetIds,
          description: `Stellium: ${planetIds.join(', ')} clustered in ${sign}`,
          strength: cluster.length >= 4 ? 0.9 : 0.6
        });
      }
    }
  }

  return patterns;
}

/**
 * Find Cradles - 4 planets forming a rectangle (3 sextiles + 1 trine)
 */
function findCradles(aspects: Aspect[]): Pattern[] {
  const patterns: Pattern[] = [];
  const sextiles = aspects.filter(a => a.type === 'sextile');
  const trines = aspects.filter(a => a.type === 'trine');

  for (const trine of trines) {
    const trinePlanets = [trine.body1, trine.body2];

    // Find two planets that sextile both trine planets
    const candidates: PlanetId[] = [];

    for (const sextile of sextiles) {
      const trinePlanet = trinePlanets.find(p => 
        p === sextile.body1 || p === sextile.body2
      );
      
      if (trinePlanet) {
        const otherPlanet = sextile.body1 === trinePlanet ? 
          sextile.body2 : sextile.body1;
        
        if (!candidates.includes(otherPlanet) && !trinePlanets.includes(otherPlanet)) {
          candidates.push(otherPlanet);
        }
      }
    }

    // Check pairs of candidates
    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const candidate1 = candidates[i];
        const candidate2 = candidates[j];

        // Check if candidates sextile both trine planets and each other
        const sextilesBothTrine = trinePlanets.every(tp =>
          sextiles.some(s =>
            (s.body1 === candidate1 && s.body2 === tp) ||
            (s.body2 === candidate1 && s.body1 === tp)
          ) && sextiles.some(s =>
            (s.body1 === candidate2 && s.body2 === tp) ||
            (s.body2 === candidate2 && s.body1 === tp)
          )
        );

        const sextileEachOther = sextiles.some(s =>
          (s.body1 === candidate1 && s.body2 === candidate2) ||
          (s.body2 === candidate1 && s.body1 === candidate2)
        );

        if (sextilesBothTrine && sextileEachOther) {
          const allPlanets = [...trinePlanets, candidate1, candidate2];
          
          patterns.push({
            type: 'cradle',
            planets: allPlanets.sort(),
            description: `Cradle: ${allPlanets.join(', ')} form a supportive rectangle`,
            strength: 0.5
          });
        }
      }
    }
  }

  return patterns;
}

/**
 * Calculate pattern strength based on orbs and planet importance
 */
function calculatePatternStrength(
  aspects: Aspect[],
  planets: readonly PlanetId[]
): number {
  // Get aspects involved in this pattern
  const patternAspects = aspects.filter(a =>
    planets.includes(a.body1) && planets.includes(a.body2)
  );

  if (patternAspects.length === 0) return 0;

  // Average orb - tighter orbs = stronger pattern
  const avgOrb = patternAspects.reduce((sum, a) => sum + a.orb, 0) / patternAspects.length;
  const orbScore = Math.max(0, 1 - (avgOrb / 8)); // 0-1 based on orb

  // Personal planets weight more
  const personalPlanets = planets.filter(p => 
    ['sun', 'moon', 'mercury', 'venus', 'mars'].includes(p)
  );
  const personalWeight = 0.6 + (personalPlanets.length / planets.length) * 0.4;

  return Math.min(1, orbScore * personalWeight);
}

/**
 * Remove duplicate patterns
 */
function removeDuplicatePatterns(patterns: Pattern[]): Pattern[] {
  const seen = new Set<string>();
  
  return patterns.filter(p => {
    const key = `${p.type}-${p.planets.join('-')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Get pattern description
 */
export function getPatternDescription(type: Pattern['type']): string {
  const descriptions: Record<Pattern['type'], string> = {
    'stellium': 'A concentration of energy in one area of life',
    'grand-trine': 'Natural talent flowing between three areas',
    't-square': 'Dynamic tension driving growth through challenges',
    'grand-cross': 'Intense crucible of transformation and integration',
    'yod': 'A fated mission requiring spiritual adjustment',
    'kite': 'A grand trine with an outlet for expression',
    'cradle': 'A protected, creative configuration'
  };
  return descriptions[type];
}
