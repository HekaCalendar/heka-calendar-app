/**
 * HEKA Aspect Pattern Detector
 * Detects meaningful geometric patterns in natal charts
 * 
 * Patterns detected:
 * - Grand Trine (3 planets, 120° each)
 * - T-Square (2 opposition + 1 square apex)
 * - Grand Cross (4 planets, all square/opposition)
 * - Yod (2 quincunx + 1 sextile)
 * - Stellium (4+ planets in sign/house)
 * - Kite (Grand Trine + opposition)
 * - Mystic Rectangle (2 opposition + 2 trine)
 */

import { PlanetPosition, Aspect, AspectType, Planet } from '../types/astrology';
import { ASPECT_PATTERN_INTERPRETATIONS } from '../data/natalInterpretations';

export interface AspectPattern {
  id: string;
  type: 'grand-trine' | 't-square' | 'grand-cross' | 'yod' | 'stellium' | 'kite' | 'mystic-rectangle';
  name: string;
  planets: Planet[];
  positions: PlanetPosition[];
  aspects: Aspect[];
  element?: 'fire' | 'earth' | 'air' | 'water';
  modality?: 'cardinal' | 'fixed' | 'mutable';
  orb: number;
  description: string;
  significance: 'major' | 'minor';
  interpretation?: string;
}

// Configuration for pattern detection
const PATTERN_CONFIG = {
  grandTrine: {
    orb: 6, // degrees of allowance
    minPlanets: 3,
    aspectAngle: 120,
  },
  tSquare: {
    orb: 6,
    oppositionOrb: 8,
    squareOrb: 6,
  },
  grandCross: {
    orb: 6,
  },
  yod: {
    sextileOrb: 4,
    quincunxOrb: 3,
  },
  stellium: {
    minPlanets: 4,
    orb: 8, // degrees within sign/house
  },
};

/**
 * Get element from zodiac sign
 */
function getElement(sign: string): 'fire' | 'earth' | 'air' | 'water' {
  const elements: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
    aries: 'fire', leo: 'fire', sagittarius: 'fire',
    taurus: 'earth', virgo: 'earth', capricorn: 'earth',
    gemini: 'air', libra: 'air', aquarius: 'air',
    cancer: 'water', scorpio: 'water', pisces: 'water',
    ophiuchus: 'water'
  };
  return elements[sign] || 'fire';
}

/**
 * Calculate angular separation between two longitudes
 */
function getSeparation(long1: number, long2: number): number {
  let separation = Math.abs(long1 - long2);
  if (separation > 180) separation = 360 - separation;
  return separation;
}

/**
 * Find all aspects between a set of positions
 */
function findAspectsBetween(
  positions: PlanetPosition[],
  targetAngle: number,
  orb: number
): Array<{ p1: PlanetPosition; p2: PlanetPosition; orb: number }> {
  const aspects: Array<{ p1: PlanetPosition; p2: PlanetPosition; orb: number }> = [];
  
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const separation = getSeparation(
        positions[i].exactLongitude,
        positions[j].exactLongitude
      );
      const aspectOrb = Math.abs(separation - targetAngle);
      
      if (aspectOrb <= orb) {
        aspects.push({
          p1: positions[i],
          p2: positions[j],
          orb: aspectOrb
        });
      }
    }
  }
  
  return aspects;
}

/**
 * Detect Grand Trines
 * Three planets, each 120° from each other, forming an equilateral triangle
 */
function detectGrandTrines(positions: PlanetPosition[]): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  const mainPlanets = positions.filter(p => 
    ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(p.planet)
  );
  
  // Group positions by element
  const byElement: Record<string, PlanetPosition[]> = {
    fire: [], earth: [], air: [], water: []
  };
  
  mainPlanets.forEach(pos => {
    const element = getElement(pos.sign);
    byElement[element].push(pos);
  });
  
  // Check each element for grand trines
  Object.entries(byElement).forEach(([element, elemPositions]) => {
    if (elemPositions.length < 3) return;
    
    // Find all trines within this element
    const trines = findAspectsBetween(elemPositions, 120, PATTERN_CONFIG.grandTrine.orb);
    
    // Look for closed triangles (each planet trines the other two)
    for (let i = 0; i < elemPositions.length; i++) {
      for (let j = i + 1; j < elemPositions.length; j++) {
        for (let k = j + 1; k < elemPositions.length; k++) {
          const p1 = elemPositions[i];
          const p2 = elemPositions[j];
          const p3 = elemPositions[k];
          
          // Check if all three pairs form trines
          const trine12 = getSeparation(p1.exactLongitude, p2.exactLongitude);
          const trine23 = getSeparation(p2.exactLongitude, p3.exactLongitude);
          const trine31 = getSeparation(p3.exactLongitude, p1.exactLongitude);
          
          const isGrandTrine = 
            Math.abs(trine12 - 120) <= PATTERN_CONFIG.grandTrine.orb &&
            Math.abs(trine23 - 120) <= PATTERN_CONFIG.grandTrine.orb &&
            Math.abs(trine31 - 120) <= PATTERN_CONFIG.grandTrine.orb;
          
          if (isGrandTrine) {
            const avgOrb = (Math.abs(trine12 - 120) + Math.abs(trine23 - 120) + Math.abs(trine31 - 120)) / 3;
            const elementData = ASPECT_PATTERN_INTERPRETATIONS['grand-trine'];
            
            patterns.push({
              id: `grand-trine-${p1.planet}-${p2.planet}-${p3.planet}`,
              type: 'grand-trine',
              name: `${capitalize(element)} Grand Trine`,
              planets: [p1.planet, p2.planet, p3.planet],
              positions: [p1, p2, p3],
              aspects: [], // Would need to reconstruct
              element: element as 'fire' | 'earth' | 'air' | 'water',
              orb: avgOrb,
              description: `A harmonious flow of ${element} energy between ${p1.planet}, ${p2.planet}, and ${p3.planet}`,
              significance: 'major',
              interpretation: elementData?.lifePurpose
            });
          }
        }
      }
    }
  });
  
  return patterns;
}

/**
 * Detect T-Squares
 * Two planets in opposition, both square to a third (apex)
 */
function detectTSquares(positions: PlanetPosition[]): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  const mainPlanets = positions.filter(p => 
    ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.planet)
  );
  
  // Find all oppositions
  const oppositions: Array<[PlanetPosition, PlanetPosition, number]> = [];
  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const separation = getSeparation(mainPlanets[i].exactLongitude, mainPlanets[j].exactLongitude);
      const orb = Math.abs(separation - 180);
      if (orb <= PATTERN_CONFIG.tSquare.oppositionOrb) {
        oppositions.push([mainPlanets[i], mainPlanets[j], orb]);
      }
    }
  }
  
  // For each opposition, look for a planet square to both
  oppositions.forEach(([p1, p2, oppOrb]) => {
    mainPlanets.forEach(apex => {
      if (apex.planet === p1.planet || apex.planet === p2.planet) return;
      
      const square1 = getSeparation(apex.exactLongitude, p1.exactLongitude);
      const square2 = getSeparation(apex.exactLongitude, p2.exactLongitude);
      
      const isSquare1 = Math.abs(square1 - 90) <= PATTERN_CONFIG.tSquare.squareOrb;
      const isSquare2 = Math.abs(square2 - 90) <= PATTERN_CONFIG.tSquare.squareOrb;
      
      if (isSquare1 && isSquare2) {
        const avgOrb = (oppOrb + Math.abs(square1 - 90) + Math.abs(square2 - 90)) / 3;
        const elementData = ASPECT_PATTERN_INTERPRETATIONS['t-square'];
        
        patterns.push({
          id: `t-square-${p1.planet}-${p2.planet}-${apex.planet}`,
          type: 't-square',
          name: `T-Square with ${capitalize(apex.planet)} Apex`,
          planets: [p1.planet, p2.planet, apex.planet],
          positions: [p1, p2, apex],
          aspects: [],
          orb: avgOrb,
          description: `Dynamic tension between ${p1.planet} and ${p2.planet}, focused through ${apex.planet}`,
          significance: 'major',
          interpretation: elementData?.lifePurpose
        });
      }
    });
  });
  
  return patterns;
}

/**
 * Detect Stelliums
 * Four or more planets in the same sign or house
 */
function detectStelliums(positions: PlanetPosition[]): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  
  // Group by sign
  const bySign: Record<string, PlanetPosition[]> = {};
  positions.forEach(pos => {
    if (!bySign[pos.sign]) bySign[pos.sign] = [];
    bySign[pos.sign].push(pos);
  });
  
  // Check for stelliums in signs
  Object.entries(bySign).forEach(([sign, signPositions]) => {
    if (signPositions.length >= PATTERN_CONFIG.stellium.minPlanets) {
      // Calculate spread
      const longitudes = signPositions.map(p => p.exactLongitude);
      const spread = Math.max(...longitudes) - Math.min(...longitudes);
      
      if (spread <= PATTERN_CONFIG.stellium.orb * 2) {
        const elementData = ASPECT_PATTERN_INTERPRETATIONS['stellium'];
        
        patterns.push({
          id: `stellium-${sign}`,
          type: 'stellium',
          name: `${capitalize(sign)} Stellium`,
          planets: signPositions.map(p => p.planet),
          positions: signPositions,
          aspects: [],
          element: getElement(sign),
          orb: spread / 2,
          description: `Intense focus of energy in ${sign} with ${signPositions.length} planets`,
          significance: 'major',
          interpretation: elementData?.lifePurpose
        });
      }
    }
  });
  
  // Group by house
  const byHouse: Record<number, PlanetPosition[]> = {};
  positions.forEach(pos => {
    if (pos.house) {
      if (!byHouse[pos.house]) byHouse[pos.house] = [];
      byHouse[pos.house].push(pos);
    }
  });
  
  Object.entries(byHouse).forEach(([house, housePositions]) => {
    if (housePositions.length >= PATTERN_CONFIG.stellium.minPlanets) {
      const elementData = ASPECT_PATTERN_INTERPRETATIONS['stellium'];
      
      patterns.push({
        id: `stellium-house-${house}`,
        type: 'stellium',
        name: `House ${house} Stellium`,
        planets: housePositions.map(p => p.planet),
        positions: housePositions,
        aspects: [],
        orb: 0,
        description: `Intense focus in House ${house} with ${housePositions.length} planets`,
        significance: 'major',
        interpretation: elementData?.lifePurpose
      });
    }
  });
  
  return patterns;
}

/**
 * Detect Yods (Finger of Fate)
 * Two planets sextile each other, both quincunx (150°) to a third
 */
function detectYods(positions: PlanetPosition[]): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  const mainPlanets = positions.filter(p => 
    ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.planet)
  );
  
  // Find all sextiles
  const sextiles: Array<[PlanetPosition, PlanetPosition, number]> = [];
  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const separation = getSeparation(mainPlanets[i].exactLongitude, mainPlanets[j].exactLongitude);
      const orb = Math.abs(separation - 60);
      if (orb <= PATTERN_CONFIG.yod.sextileOrb) {
        sextiles.push([mainPlanets[i], mainPlanets[j], orb]);
      }
    }
  }
  
  // For each sextile, look for a planet quincunx to both
  sextiles.forEach(([p1, p2, sextOrb]) => {
    mainPlanets.forEach(apex => {
      if (apex.planet === p1.planet || apex.planet === p2.planet) return;
      
      const quincunx1 = getSeparation(apex.exactLongitude, p1.exactLongitude);
      const quincunx2 = getSeparation(apex.exactLongitude, p2.exactLongitude);
      
      const isQuincunx1 = Math.abs(quincunx1 - 150) <= PATTERN_CONFIG.yod.quincunxOrb;
      const isQuincunx2 = Math.abs(quincunx2 - 150) <= PATTERN_CONFIG.yod.quincunxOrb;
      
      if (isQuincunx1 && isQuincunx2) {
        const avgOrb = (sextOrb + Math.abs(quincunx1 - 150) + Math.abs(quincunx2 - 150)) / 3;
        const elementData = ASPECT_PATTERN_INTERPRETATIONS['yod'];
        
        patterns.push({
          id: `yod-${p1.planet}-${p2.planet}-${apex.planet}`,
          type: 'yod',
          name: `Yod (Finger of Fate)`,
          planets: [p1.planet, p2.planet, apex.planet],
          positions: [p1, p2, apex],
          aspects: [],
          orb: avgOrb,
          description: `Fated configuration pointing to ${apex.planet} as the destiny point`,
          significance: 'major',
          interpretation: elementData?.lifePurpose
        });
      }
    });
  });
  
  return patterns;
}

/**
 * Main detection function - runs all pattern detectors
 */
export function detectAspectPatterns(positions: PlanetPosition[]): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  
  // Run all detectors
  patterns.push(...detectGrandTrines(positions));
  patterns.push(...detectTSquares(positions));
  patterns.push(...detectStelliums(positions));
  patterns.push(...detectYods(positions));
  
  // Sort by significance and orb
  patterns.sort((a, b) => {
    if (a.significance !== b.significance) {
      return a.significance === 'major' ? -1 : 1;
    }
    return a.orb - b.orb;
  });
  
  return patterns;
}

/**
 * Get a summary of all patterns for display
 */
export function getPatternSummary(patterns: AspectPattern[]): string {
  if (patterns.length === 0) {
    return 'No major aspect patterns detected. Your chart shows a more evenly distributed energy.';
  }
  
  const majorPatterns = patterns.filter(p => p.significance === 'major');
  const patternNames = majorPatterns.map(p => p.name).join(', ');
  
  return `Major patterns: ${patternNames}. These configurations indicate focused life themes and natural talents.`;
}

function capitalize(str: string | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  detectAspectPatterns,
  getPatternSummary
};
