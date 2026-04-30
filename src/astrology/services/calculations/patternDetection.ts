/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ADVANCED PATTERN DETECTION - Yods, Grand Trines, T-Squares & More
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Detects complex aspect patterns in natal charts that reveal soul-level themes
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Aspect, CelestialBody, PlanetId } from '../../types';
import { calculateAspects } from './aspects';
import { getSignFromLongitude, SIGN_ELEMENTS_13, SIGN_ELEMENTS } from '../../types/core';
import { getZodiacSystemPreference } from '../natal/zodiacHelpers';

export type PatternType = 
  | 'yod'                    // Finger of God
  | 'grand_trine'           // Three trines forming triangle
  | 't_square'              // Two squares to opposition
  | 'grand_cross'           // Four squares forming cross
  | 'kite'                  // Grand trine with opposition
  | 'mystic_rectangle'      // Two trines + two sextiles
  | 'stellium'              // 3+ planets in same sign/house
  | 'grand_sextile'         // Six sextiles (rare)
  | 'cradle'                // Three sextiles + trine
  | 'thors_hammer'         // Two squares to sesquiquadrate
  | 'hard_rectangle';       // Two oppositions + two squares

export interface ChartPattern {
  readonly type: PatternType;
  readonly name: string;
  readonly description: string;
  readonly planets: PlanetId[];
  readonly aspects: Aspect[];
  readonly strength: number; // 0-10
  readonly interpretation: string;
  readonly lifeThemes: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN DETECTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detect all patterns in a chart
 */
export function detectPatterns(
  bodies: Record<PlanetId, CelestialBody>
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const aspects = calculateAspects(bodies, { includeMinorAspects: true });
  
  // Check for each pattern type
  const yods = detectYods(bodies, aspects);
  const grandTrines = detectGrandTrines(bodies, aspects);
  const tSquares = detectTSquares(bodies, aspects);
  const grandCrosses = detectGrandCrosses(bodies, aspects);
  const kites = detectKites(bodies, aspects, grandTrines);
  const mysticRectangles = detectMysticRectangles(bodies, aspects);
  const stelliums = detectStelliums(bodies);
  const cradles = detectCradles(bodies, aspects);
  const thorsHammers = detectThorsHammers(bodies, aspects);
  
  patterns.push(
    ...yods,
    ...grandTrines,
    ...tSquares,
    ...grandCrosses,
    ...kites,
    ...mysticRectangles,
    ...stelliums,
    ...cradles,
    ...thorsHammers
  );
  
  // Sort by strength (strongest first)
  return patterns.sort((a, b) => b.strength - a.strength);
}

/**
 * Detect Yod (Finger of God) patterns
 * Two planets in sextile, both quincunx (150°) to a third planet
 */
function detectYods(
  _bodies: Record<PlanetId, CelestialBody>,
  aspects: Aspect[]
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const sextiles = aspects.filter(a => a.type === 'sextile' && a.orb < 3);
  const quincunxes = aspects.filter(a => a.type === 'quincunx' && a.orb < 2.5);
  
  for (const sextile of sextiles) {
    // Find apex planets that both sextile bodies quincunx to
    for (const quincunx1 of quincunxes) {
      const isBase1 = quincunx1.body1 === sextile.body1 || quincunx1.body2 === sextile.body1;
      if (!isBase1) continue;
      
      const apex = quincunx1.body1 === sextile.body1 ? quincunx1.body2 : quincunx1.body1;
      
      // Check if the other sextile body also quincunxes to the same apex
      const quincunx2 = quincunxes.find(q => 
        (q !== quincunx1) && (
          (q.body1 === sextile.body2 && q.body2 === apex) ||
          (q.body1 === apex && q.body2 === sextile.body2)
        )
      );
      
      if (quincunx2) {
        const planets = [apex, sextile.body1, sextile.body2];
        
        patterns.push({
          type: 'yod',
          name: 'Yod (Finger of God)',
          description: `A fated configuration calling ${apex} to its divine purpose`,
          planets,
          aspects: [sextile, quincunx1, quincunx2],
          strength: calculatePatternStrength([sextile, quincunx1, quincunx2]),
          interpretation: `The apex planet (${apex}) is under pressure to evolve. The sextile base provides resources, but the quincunxes demand constant adjustment. This is a karmic pointer to your soul's mission.`,
          lifeThemes: [
            'Feeling "different" or called to a unique purpose',
            'Restlessness until you align with your true path',
            'Unexpected crises that redirect your life',
            'Healing gifts that emerge through personal struggle'
          ]
        });
      }
    }
  }
  
  return removeDuplicatePatterns(patterns);
}

/**
 * Detect Grand Trine patterns
 * Three planets, each trine to the others, forming an equilateral triangle
 */
function detectGrandTrines(
  bodies: Record<PlanetId, CelestialBody>,
  aspects: Aspect[]
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const trines = aspects.filter(a => a.type === 'trine' && a.orb < 3);
  
  // Group by element
  const elements: Record<string, Aspect[]> = { fire: [], earth: [], air: [], water: [], ether: [] };
  
  for (const trine of trines) {
    const body1 = bodies[trine.body1];
    const body2 = bodies[trine.body2];
    if (body1 && body2) {
      // Simplified element check based on longitude
      const element1 = getElementFromLongitude(body1.longitude);
      const element2 = getElementFromLongitude(body2.longitude);
      if (element1 === element2) {
        elements[element1].push(trine);
      }
    }
  }
  
  // Find triangles in each element
  for (const [element, elementTrines] of Object.entries(elements)) {
    if (elementTrines.length >= 3) {
      // Find three planets all trine to each other
      for (let i = 0; i < elementTrines.length; i++) {
        for (let j = i + 1; j < elementTrines.length; j++) {
          for (let k = j + 1; k < elementTrines.length; k++) {
            const t1 = elementTrines[i];
            const t2 = elementTrines[j];
            const t3 = elementTrines[k];
            
            const planets = new Set([t1.body1, t1.body2, t2.body1, t2.body2, t3.body1, t3.body2]);
            
            if (planets.size === 3) {
              const planetArray = Array.from(planets) as PlanetId[];
              
              patterns.push({
                type: 'grand_trine',
                name: `Grand Trine in ${element.charAt(0).toUpperCase() + element.slice(1)}`,
                description: `Effortless flow of ${element} energy between three planets`,
                planets: planetArray,
                aspects: [t1, t2, t3],
                strength: calculatePatternStrength([t1, t2, t3]),
                interpretation: `You have a natural talent for expressing ${element} energy. This blessing can become a trap if you rely on it too much and avoid growth through challenge.`,
                lifeThemes: [
                  `Natural ${element} abilities that flow without effort`,
                  'Creative or spiritual gifts',
                  'Risk of complacency or laziness',
                  'Need to integrate opposite element for balance'
                ]
              });
            }
          }
        }
      }
    }
  }
  
  return patterns;
}

/**
 * Detect T-Square patterns
 * Two planets square each other, both square to a third (opposition)
 */
function detectTSquares(
  _bodies: Record<PlanetId, CelestialBody>,
  aspects: Aspect[]
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const squares = aspects.filter(a => a.type === 'square' && a.orb < 3);
  const oppositions = aspects.filter(a => a.type === 'opposition' && a.orb < 3);
  
  for (const opposition of oppositions) {
    // Find a planet squaring both ends of the opposition
    const apexCandidates = squares.filter(sq => 
      (sq.body1 === opposition.body1 || sq.body1 === opposition.body2) &&
      sq.orb < 2.5
    );
    
    for (const sq1 of apexCandidates) {
      const apex = sq1.body1 === opposition.body1 ? sq1.body2 : sq1.body1;
      
      const sq2 = squares.find(sq =>
        ((sq.body1 === opposition.body2 && sq.body2 === apex) ||
         (sq.body1 === apex && sq.body2 === opposition.body2)) &&
        sq.orb < 2.5
      );
      
      if (sq2) {
        patterns.push({
          type: 't_square',
          name: 'T-Square',
          description: `Dynamic tension driving growth through ${apex}`,
          planets: [apex, opposition.body1, opposition.body2],
          aspects: [opposition, sq1, sq2],
          strength: calculatePatternStrength([opposition, sq1, sq2]),
          interpretation: `The apex planet (${apex}) is where you must take action to resolve the opposition's tension. This configuration creates tremendous drive and can lead to significant achievements through overcoming obstacles.`,
          lifeThemes: [
            'Constant tension that drives action',
            'Crisis as catalyst for growth',
            'Need to develop the empty leg (opposite the apex)',
            'Leadership through overcoming adversity'
          ]
        });
      }
    }
  }
  
  return patterns;
}

/**
 * Detect Grand Cross patterns
 * Four planets, each squaring two others, forming a cross
 */
function detectGrandCrosses(
  _bodies: Record<PlanetId, CelestialBody>,
  aspects: Aspect[]
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const squares = aspects.filter(a => a.type === 'square' && a.orb < 3);
  const oppositions = aspects.filter(a => a.type === 'opposition' && a.orb < 3);
  
  // Need two oppositions that cross
  for (let i = 0; i < oppositions.length; i++) {
    for (let j = i + 1; j < oppositions.length; j++) {
      const opp1 = oppositions[i];
      const opp2 = oppositions[j];
      
      const planets = new Set([opp1.body1, opp1.body2, opp2.body1, opp2.body2]);
      
      if (planets.size === 4) {
        // Check if there are squares connecting them
        const planetArray = Array.from(planets) as PlanetId[];
        const crossSquares = squares.filter(sq => 
          planets.has(sq.body1) && planets.has(sq.body2)
        );
        
        if (crossSquares.length >= 4) {
          patterns.push({
            type: 'grand_cross',
            name: 'Grand Cross',
            description: 'Four-way tension requiring constant balance',
            planets: planetArray,
            aspects: [opp1, opp2, ...crossSquares.slice(0, 4)],
            strength: 10, // Always strong
            interpretation: 'You experience life as a constant balancing act between four competing needs. This creates enormous resilience but also ongoing tension. You are called to master all four areas.',
            lifeThemes: [
              'Feeling pulled in four directions simultaneously',
              'Crisis management as a way of life',
              'Immense resilience and problem-solving ability',
              'Need for regular retreat and integration'
            ]
          });
        }
      }
    }
  }
  
  return patterns;
}

/**
 * Detect Kite patterns (Grand Trine + Opposition)
 */
function detectKites(
  _bodies: Record<PlanetId, CelestialBody>,
  aspects: Aspect[],
  grandTrines: ChartPattern[]
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const oppositions = aspects.filter(a => a.type === 'opposition' && a.orb < 3);
  const sextiles = aspects.filter(a => a.type === 'sextile' && a.orb < 3);
  
  for (const trine of grandTrines) {
    const trinePlanets = trine.planets;
    
    for (const opposition of oppositions) {
      const inTrineIdx = trinePlanets.findIndex(p => p === opposition.body1 || p === opposition.body2);
      if (inTrineIdx === -1) continue;
      
      const trinePlanet = trinePlanets[inTrineIdx];
      const oppositePlanet = opposition.body1 === trinePlanet ? opposition.body2 : opposition.body1;
      
      // The opposite planet must NOT be in the trine
      if (trinePlanets.includes(oppositePlanet)) continue;
      
      // The opposite planet must sextile the other two trine planets
      const otherTrinePlanets = trinePlanets.filter(p => p !== trinePlanet);
      const sextilesBoth = sextiles.some(s =>
        (s.body1 === oppositePlanet && s.body2 === otherTrinePlanets[0]) ||
        (s.body2 === oppositePlanet && s.body1 === otherTrinePlanets[0])
      ) && sextiles.some(s =>
        (s.body1 === oppositePlanet && s.body2 === otherTrinePlanets[1]) ||
        (s.body2 === oppositePlanet && s.body1 === otherTrinePlanets[1])
      );
      
      if (sextilesBoth) {
        const allPlanets = [...new Set([...trine.planets, oppositePlanet])] as PlanetId[];
        
        patterns.push({
          type: 'kite',
          name: 'Kite',
          description: 'Grand Trine with a release point',
          planets: allPlanets,
          aspects: [...trine.aspects, opposition],
          strength: calculatePatternStrength([...trine.aspects, opposition]),
          interpretation: 'The opposition provides an outlet for the Grand Trine\'s energy. This transforms lazy talent into active expression. The opposition planet shows where you manifest your gifts.',
          lifeThemes: [
            'Natural gifts with a clear purpose',
            'Opportunity to express talent constructively',
            'The opposition creates the "why" for your abilities',
            'Leadership through service'
          ]
        });
      }
    }
  }
  
  return patterns;
}

/**
 * Detect Mystic Rectangle patterns
 * Two oppositions + two sextiles + two trines
 */
function detectMysticRectangles(
  _bodies: Record<PlanetId, CelestialBody>,
  aspects: Aspect[]
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const sextiles = aspects.filter(a => a.type === 'sextile' && a.orb < 3);
  const trines = aspects.filter(a => a.type === 'trine' && a.orb < 3);
  const oppositions = aspects.filter(a => a.type === 'opposition' && a.orb < 3);
  
  for (const opp1 of oppositions) {
    for (const opp2 of oppositions) {
      if (opp1 === opp2) continue;
      
      const allPlanets = new Set([opp1.body1, opp1.body2, opp2.body1, opp2.body2]);
      
      if (allPlanets.size === 4) {
        const planetArray = Array.from(allPlanets) as PlanetId[];
        
        // Check for sextiles and trines completing the rectangle
        const sextileCount = sextiles.filter(s => 
          allPlanets.has(s.body1) && allPlanets.has(s.body2)
        ).length;
        
        const trineCount = trines.filter(t => 
          allPlanets.has(t.body1) && allPlanets.has(t.body2)
        ).length;
        
        if (sextileCount >= 2 && trineCount >= 2) {
          patterns.push({
            type: 'mystic_rectangle',
            name: 'Mystic Rectangle',
            description: 'Oppositions softened by harmonious aspects',
            planets: planetArray,
            aspects: [opp1, opp2],
            strength: 8,
            interpretation: 'You have opposing forces that are gracefully mediated by supportive aspects. This creates a life of flowing solutions to complex problems. You can see all sides and find compromise.',
            lifeThemes: [
              'Natural ability to mediate and harmonize',
              'Complex problems with elegant solutions',
              'Spiritual awareness integrated into daily life',
              'Diplomatic and healing presence'
            ]
          });
        }
      }
    }
  }
  
  return patterns;
}

/**
 * Detect Stellium patterns (3+ planets in same sign or house)
 */
function detectStelliums(
  bodies: Record<PlanetId, CelestialBody>
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  
  // Group by sign
  const bySign: Record<string, PlanetId[]> = {};
  
  for (const [id, body] of Object.entries(bodies)) {
    if (!bySign[body.sign]) bySign[body.sign] = [];
    bySign[body.sign].push(id as PlanetId);
  }
  
  for (const [sign, planets] of Object.entries(bySign)) {
    if (planets.length >= 3) {
      patterns.push({
        type: 'stellium',
        name: `${sign.charAt(0).toUpperCase() + sign.slice(1)} Stellium`,
        description: `Concentrated ${sign} energy`,
        planets,
        aspects: [],
        strength: Math.min(planets.length * 2, 10),
        interpretation: `You have an extraordinary focus of energy in ${sign}. This area of life dominates your chart and shapes your identity profoundly. It's both your greatest gift and your blind spot.`,
        lifeThemes: [
          `Intense ${sign} expression in your personality`,
          'This area feels "fated" or unavoidable',
          'Potential for mastery in related domains',
          'Risk of imbalance - other areas may be neglected'
        ]
      });
    }
  }
  
  return patterns;
}

/**
 * Detect Cradle patterns
 * Three sextiles + one trine connecting four planets
 */
function detectCradles(
  _bodies: Record<PlanetId, CelestialBody>,
  aspects: Aspect[]
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const sextiles = aspects.filter(a => a.type === 'sextile' && a.orb < 3);
  const trines = aspects.filter(a => a.type === 'trine' && a.orb < 3);
  
  // A cradle requires 4 planets where:
  // A sextile B, B sextile C, C sextile D, and A trine D
  // (forming a shape with 3 sextiles and 1 trine)
  for (const trine of trines) {
    const a = trine.body1;
    const d = trine.body2;
    
    // Find planets B and C such that A-B-C-D are connected by sextiles
    const bCandidates = sextiles
      .filter(s => (s.body1 === a && s.body2 !== d) || (s.body2 === a && s.body1 !== d))
      .map(s => s.body1 === a ? s.body2 : s.body1);
    
    for (const b of bCandidates) {
      const cCandidates = sextiles
        .filter(s => (s.body1 === b && s.body2 !== a && s.body2 !== d) || (s.body2 === b && s.body1 !== a && s.body1 !== d))
        .map(s => s.body1 === b ? s.body2 : s.body1);
      
      for (const c of cCandidates) {
        // Check if c sextiles d
        const cSextilesD = sextiles.some(s =>
          (s.body1 === c && s.body2 === d) || (s.body2 === c && s.body1 === d)
        );
        
        if (cSextilesD) {
          const planets = [a, b, c, d];
          const cradleAspects = [
            trine,
            sextiles.find(s => (s.body1 === a && s.body2 === b) || (s.body2 === a && s.body1 === b))!,
            sextiles.find(s => (s.body1 === b && s.body2 === c) || (s.body2 === b && s.body1 === c))!,
            sextiles.find(s => (s.body1 === c && s.body2 === d) || (s.body2 === c && s.body1 === d))!,
          ].filter(Boolean);
          
          patterns.push({
            type: 'cradle',
            name: 'Cradle',
            description: 'Supportive container for growth',
            planets,
            aspects: cradleAspects,
            strength: calculatePatternStrength(cradleAspects),
            interpretation: 'You are held in a supportive energetic container. This provides safety to explore and grow, but may also keep you from necessary challenges. The trine offers an escape valve.',
            lifeThemes: [
              'Supportive environment for development',
              'Natural charm and likeability',
              'May avoid necessary confrontations',
              'Healing and nurturing presence'
            ]
          });
        }
      }
    }
  }
  
  return removeDuplicatePatterns(patterns);
}

/**
 * Detect Thor's Hammer patterns
 * Two squares + one sesquiquadrate (135°)
 */
function detectThorsHammers(
  _bodies: Record<PlanetId, CelestialBody>,
  aspects: Aspect[]
): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const squares = aspects.filter(a => a.type === 'square' && a.orb < 3);
  const sesquis = aspects.filter(a => a.type === 'sesquiquadrate' && a.orb < 2);
  
  for (const sesqui of sesquis) {
    // Find squares connecting to both ends
    const sq1 = squares.find(s => 
      (s.body1 === sesqui.body1 || s.body2 === sesqui.body1) && s.orb < 2.5
    );
    const sq2 = squares.find(s => 
      (s.body1 === sesqui.body2 || s.body2 === sesqui.body2) && s.orb < 2.5
    );
    
    if (sq1 && sq2) {
      const planets = new Set([sesqui.body1, sesqui.body2, 
        sq1.body1 === sesqui.body1 ? sq1.body2 : sq1.body1,
        sq2.body1 === sesqui.body2 ? sq2.body2 : sq2.body1
      ]);
      
      patterns.push({
        type: 'thors_hammer',
        name: "Thor's Hammer",
        description: 'Intense driving force',
        planets: Array.from(planets) as PlanetId[],
        aspects: [sesqui, sq1, sq2],
        strength: calculatePatternStrength([sesqui, sq1, sq2]),
        interpretation: "This rare pattern gives you an almost obsessive drive. You have a 'hammer' for breaking through obstacles, but may use excessive force. Channel this energy constructively.",
        lifeThemes: [
          'Intense drive that can become obsessive',
          'Ability to break through any obstacle',
          'Risk of destructive force if misdirected',
          'Powerful transformative potential'
        ]
      });
    }
  }
  
  return patterns;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function calculatePatternStrength(aspects: Aspect[]): number {
  if (aspects.length === 0) return 5;
  const avgOrb = aspects.reduce((sum, a) => sum + a.orb, 0) / aspects.length;
  const exactBonus = aspects.filter(a => a.isExact).length * 2;
  return Math.min(Math.round((10 - avgOrb * 2) + exactBonus), 10);
}

function removeDuplicatePatterns(patterns: ChartPattern[]): ChartPattern[] {
  const seen = new Set<string>();
  return patterns.filter(p => {
    const key = `${p.type}-${[...p.planets].sort().join('-')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getElementFromLongitude(longitude: number): string {
  const use13Signs = getZodiacSystemPreference() === '13-sign';
  const sign = getSignFromLongitude(longitude as any, use13Signs);
  const elements = use13Signs ? SIGN_ELEMENTS_13 : SIGN_ELEMENTS;
  return (elements as Record<string, string>)[sign] || 'fire';
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN DESCRIPTIONS FOR UI
// ═══════════════════════════════════════════════════════════════════════════════

export const PATTERN_DESCRIPTIONS: Record<PatternType, { 
  symbol: string; 
  shortDesc: string;
  blessing: string;
  challenge: string;
}> = {
  yod: {
    symbol: '🎯',
    shortDesc: 'Finger of God - Fated calling',
    blessing: 'Unique destiny and special gifts',
    challenge: 'Constant adjustment until you answer the call'
  },
  grand_trine: {
    symbol: '△',
    shortDesc: 'Natural talent flow',
    blessing: 'Effortless abilities in one element',
    challenge: 'Complacency and avoiding growth'
  },
  t_square: {
    symbol: '⊥',
    shortDesc: 'Dynamic tension driving action',
    blessing: 'Immense drive and achievement potential',
    challenge: 'Constant crisis and pressure'
  },
  grand_cross: {
    symbol: '⨁',
    shortDesc: 'Four-way mastery challenge',
    blessing: 'Extraordinary resilience and capability',
    challenge: 'Never-ending tension and exhaustion'
  },
  kite: {
    symbol: '🪁',
    shortDesc: 'Talent with purpose',
    blessing: 'Natural gifts with clear expression',
    challenge: 'The opposition still requires integration'
  },
  mystic_rectangle: {
    symbol: '▭',
    shortDesc: 'Graceful problem-solving',
    blessing: 'Flowing solutions to complex issues',
    challenge: 'May avoid necessary conflict'
  },
  stellium: {
    symbol: '✦',
    shortDesc: 'Concentrated energy focus',
    blessing: 'Extraordinary depth in one area',
    challenge: 'Imbalance and neglect of other areas'
  },
  grand_sextile: {
    symbol: '⬡',
    shortDesc: 'Rare hexagon of harmony',
    blessing: 'Multiple natural talents flowing together',
    challenge: 'Can be passive, waiting for life to happen'
  },
  cradle: {
    symbol: '🌙',
    shortDesc: 'Supportive growth container',
    blessing: 'Safe space for development and healing',
    challenge: 'May stay in comfort zone too long'
  },
  thors_hammer: {
    symbol: '🔨',
    shortDesc: 'Intense driving force',
    blessing: 'Power to break through any barrier',
    challenge: 'Destructive if not channeled'
  },
  hard_rectangle: {
    symbol: '▢',
    shortDesc: 'Intense growth pressure',
    blessing: 'Rapid evolution through pressure',
    challenge: 'Constant stress requiring management'
  }
};

// Compatibility export for older code expecting the simpler Pattern type
import type { Pattern } from '../../types';

export function toLegacyPatterns(chartPatterns: ChartPattern[]): Pattern[] {
  return chartPatterns.map(cp => ({
    type: cp.type.replace('_', '-'),
    planets: cp.planets,
    description: cp.description,
    strength: cp.strength / 10,
  }));
}

export default detectPatterns;
