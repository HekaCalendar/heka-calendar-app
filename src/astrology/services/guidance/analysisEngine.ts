/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL GUIDANCE ANALYSIS ENGINE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Calculates guidance based on planetary positions, aspects, and regional factors
 * Provides Daily, Weekly, and Yearly guidance
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { CelestialBody } from '../../types';
import type { CelestialRegion } from './regions';

export type TimeFrame = 'daily' | 'weekly' | 'yearly';
export type LifeArea = 'career' | 'relationships' | 'health' | 'finances' | 'personalGrowth' | 'timing';

export interface GuidanceAspect {
  planet1: string;
  planet2: string;
  aspect: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  orb: number;
  applying: boolean;
  strength: number; // 0-10
}

export interface CelestialSnapshot {
  date: Date;
  positions: Record<string, CelestialBody>;
  aspects: GuidanceAspect[];
  moonPhase: {
    name: string;
    illumination: number;
    isWaxing: boolean;
  };
  retrogrades: string[];
  notableEvents: string[];
}

export interface GuidanceScore {
  career: number;      // -10 to +10
  relationships: number;
  health: number;
  finances: number;
  personalGrowth: number;
  timing: number;
}

export interface GuidanceReading {
  timeframe: TimeFrame;
  dateRange: { start: Date; end: Date };
  region: CelestialRegion;
  overallScore: number; // -10 to +10
  scores: GuidanceScore;
  summary: string;
  detailedInsights: {
    career: string;
    relationships: string;
    health: string;
    finances: string;
    personalGrowth: string;
  };
  keyThemes: string[];
  bestDays?: Date[]; // For weekly/yearly
  challengingDays?: Date[];
  planetaryHighlights: Array<{
    planet: string;
    significance: string;
    advice: string;
  }>;
  lunarGuidance: string;
}

// Aspect weights for scoring
const ASPECT_WEIGHTS: Record<string, number> = {
  conjunction: 3,
  sextile: 2,
  square: -2,
  trine: 3,
  opposition: -1,
};

// Planet importance weights
const PLANET_WEIGHTS: Record<string, number> = {
  sun: 3,
  moon: 2.5,
  mercury: 2,
  venus: 2,
  mars: 2,
  jupiter: 2.5,
  saturn: 2,
  uranus: 1.5,
  neptune: 1.5,
  pluto: 1.5,
};

/**
 * Calculate aspects between planets
 */
export function calculateAspects(positions: Record<string, CelestialBody>): GuidanceAspect[] {
  const aspects: GuidanceAspect[] = [];
  const planets = Object.keys(positions);
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = positions[planets[i]];
      const p2 = positions[planets[j]];
      
      if (!p1 || !p2) continue;
      
      const angle = Math.abs(p1.longitude - p2.longitude);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;
      
      // Check for aspects within orb
      const orb = 8; // degrees
      let aspect: GuidanceAspect['aspect'] | null = null;
      
      if (Math.abs(normalizedAngle - 0) < orb) aspect = 'conjunction';
      else if (Math.abs(normalizedAngle - 60) < orb) aspect = 'sextile';
      else if (Math.abs(normalizedAngle - 90) < orb) aspect = 'square';
      else if (Math.abs(normalizedAngle - 120) < orb) aspect = 'trine';
      else if (Math.abs(normalizedAngle - 180) < orb) aspect = 'opposition';
      
      if (aspect) {
        const applying = p1.speed > p2.speed; // Simplified
        const strength = 10 - (Math.abs(normalizedAngle - 
          (aspect === 'conjunction' ? 0 : aspect === 'sextile' ? 60 : aspect === 'square' ? 90 : aspect === 'trine' ? 120 : 180)) / orb * 10);
        
        aspects.push({
          planet1: planets[i],
          planet2: planets[j],
          aspect,
          orb: normalizedAngle,
          applying,
          strength: Math.max(1, strength),
        });
      }
    }
  }
  
  return aspects.sort((a, b) => b.strength - a.strength);
}

/**
 * Calculate guidance scores based on celestial configuration
 */
function calculateScores(
  aspects: GuidanceAspect[],
  positions: Record<string, CelestialBody>,
  moonPhase: { isWaxing: boolean; illumination: number }
): GuidanceScore {
  const scores = {
    career: 0,
    relationships: 0,
    health: 0,
    finances: 0,
    personalGrowth: 0,
    timing: 0,
  };
  
  // Analyze aspects for each life area
  aspects.forEach(asp => {
    const weight = ASPECT_WEIGHTS[asp.aspect] * (asp.strength / 10);
    const p1Weight = PLANET_WEIGHTS[asp.planet1] || 1;
    const p2Weight = PLANET_WEIGHTS[asp.planet2] || 1;
    const totalWeight = weight * (p1Weight + p2Weight) / 4;
    
    // Career aspects (Sun, Saturn, Mars, MC-related)
    if (['sun', 'saturn', 'mars'].includes(asp.planet1) || ['sun', 'saturn', 'mars'].includes(asp.planet2)) {
      scores.career += totalWeight;
    }
    
    // Relationship aspects (Venus, Moon)
    if (['venus', 'moon'].includes(asp.planet1) || ['venus', 'moon'].includes(asp.planet2)) {
      scores.relationships += totalWeight;
    }
    
    // Health aspects (Sun, Mars, Saturn)
    if (['sun', 'mars', 'saturn'].includes(asp.planet1) || ['sun', 'mars', 'saturn'].includes(asp.planet2)) {
      scores.health += totalWeight * 0.8;
    }
    
    // Financial aspects (Venus, Jupiter)
    if (['venus', 'jupiter'].includes(asp.planet1) || ['venus', 'jupiter'].includes(asp.planet2)) {
      scores.finances += totalWeight;
    }
    
    // Personal growth (Jupiter, Sun, Mercury)
    if (['jupiter', 'sun', 'mercury'].includes(asp.planet1) || ['jupiter', 'sun', 'mercury'].includes(asp.planet2)) {
      scores.personalGrowth += totalWeight;
    }
  });
  
  // Moon phase influence
  if (moonPhase.isWaxing) {
    scores.timing += 2;
    scores.personalGrowth += 1;
  } else {
    scores.timing -= 1;
    scores.relationships += 0.5; // Waning good for releasing in relationships
  }
  
  // Retrograde check
  Object.values(positions).forEach(p => {
    if (p.isRetrograde) {
      if (p.id === 'mercury') scores.timing -= 2;
      if (p.id === 'venus') scores.relationships -= 1;
      if (p.id === 'mars') scores.career -= 1;
    }
  });
  
  // Clamp scores
  return {
    career: Math.max(-10, Math.min(10, scores.career)),
    relationships: Math.max(-10, Math.min(10, scores.relationships)),
    health: Math.max(-10, Math.min(10, scores.health)),
    finances: Math.max(-10, Math.min(10, scores.finances)),
    personalGrowth: Math.max(-10, Math.min(10, scores.personalGrowth)),
    timing: Math.max(-10, Math.min(10, scores.timing)),
  };
}

/**
 * Generate daily guidance
 */
export function generateDailyGuidance(
  snapshot: CelestialSnapshot,
  region: CelestialRegion
): GuidanceReading {
  const aspects = calculateAspects(snapshot.positions);
  const scores = calculateScores(aspects, snapshot.positions, snapshot.moonPhase);
  
  const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / 6;
  
  // Generate insights
  const insights = generateInsights(aspects, snapshot, scores);
  
  return {
    timeframe: 'daily',
    dateRange: { start: snapshot.date, end: snapshot.date },
    region,
    overallScore,
    scores,
    summary: generateSummary(overallScore, aspects, snapshot),
    detailedInsights: insights,
    keyThemes: extractThemes(aspects, snapshot),
    planetaryHighlights: getPlanetaryHighlights(snapshot.positions, aspects),
    lunarGuidance: getLunarGuidance(snapshot.moonPhase),
  };
}

/**
 * Generate weekly guidance (aggregated)
 */
export function generateWeeklyGuidance(
  snapshots: CelestialSnapshot[],
  region: CelestialRegion
): GuidanceReading {
  // Aggregate scores across the week
  const allScores = snapshots.map(s => calculateScores(
    calculateAspects(s.positions), 
    s.positions, 
    s.moonPhase
  ));
  
  const avgScores: GuidanceScore = {
    career: allScores.reduce((a, s) => a + s.career, 0) / allScores.length,
    relationships: allScores.reduce((a, s) => a + s.relationships, 0) / allScores.length,
    health: allScores.reduce((a, s) => a + s.health, 0) / allScores.length,
    finances: allScores.reduce((a, s) => a + s.finances, 0) / allScores.length,
    personalGrowth: allScores.reduce((a, s) => a + s.personalGrowth, 0) / allScores.length,
    timing: allScores.reduce((a, s) => a + s.timing, 0) / allScores.length,
  };
  
  const overallScore = Object.values(avgScores).reduce((a, b) => a + b, 0) / 6;
  
  // Find best and challenging days
  const dayScores = snapshots.map((s, i) => ({
    date: s.date,
    score: Object.values(allScores[i]).reduce((a, b) => a + b, 0) / 6,
  }));
  
  const sortedDays = dayScores.sort((a, b) => b.score - a.score);
  
  return {
    timeframe: 'weekly',
    dateRange: { 
      start: snapshots[0]?.date || new Date(), 
      end: snapshots[snapshots.length - 1]?.date || new Date() 
    },
    region,
    overallScore,
    scores: avgScores,
    summary: generateWeeklySummary(overallScore, snapshots),
    detailedInsights: generateWeeklyInsights(snapshots, avgScores),
    keyThemes: extractWeeklyThemes(snapshots),
    bestDays: sortedDays.slice(0, 3).map(d => d.date),
    challengingDays: sortedDays.slice(-2).map(d => d.date),
    planetaryHighlights: getWeeklyPlanetaryHighlights(snapshots),
    lunarGuidance: getWeeklyLunarGuidance(snapshots),
  };
}

/**
 * Generate yearly guidance
 */
export function generateYearlyGuidance(
  year: number,
  region: CelestialRegion
): GuidanceReading {
  // Yearly guidance focuses on major transits
  const majorTransits = getYearlyTransits(year);
  
  const scores: GuidanceScore = {
    career: 0,
    relationships: 0,
    health: 0,
    finances: 0,
    personalGrowth: 0,
    timing: 0,
  };
  
  // Calculate based on major transits
  majorTransits.forEach(transit => {
    if (transit.planet === 'jupiter') {
      scores.personalGrowth += 3;
      scores.finances += 2;
    }
    if (transit.planet === 'saturn') {
      scores.career += transit.aspect === 'conjunction' ? 3 : -1;
      scores.personalGrowth += 2;
    }
    if (transit.planet === 'uranus') {
      scores.career += transit.isDisruptive ? -2 : 3;
    }
  });
  
  const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / 6;
  
  return {
    timeframe: 'yearly',
    dateRange: { 
      start: new Date(year, 0, 1), 
      end: new Date(year, 11, 31) 
    },
    region,
    overallScore,
    scores,
    summary: generateYearlySummary(year, majorTransits),
    detailedInsights: generateYearlyInsights(majorTransits),
    keyThemes: extractYearlyThemes(majorTransits),
    planetaryHighlights: majorTransits.map(t => ({
      planet: t.planet,
      significance: t.description,
      advice: t.advice,
    })),
    lunarGuidance: `In ${year}, work with the lunar cycles by setting intentions at each New Moon and releasing at each Full Moon.`,
  };
}

// Helper functions for generating insights
function generateInsights(
  _aspects: GuidanceAspect[],
  _snapshot: CelestialSnapshot,
  scores: GuidanceScore
): GuidanceReading['detailedInsights'] {
  return {
    career: scores.career > 3 
      ? 'Excellent day for career advancement. Take initiative and present your ideas.'
      : scores.career < -3
      ? 'Focus on planning rather than action. Review and refine your strategies.'
      : 'Steady progress available. Maintain your current course.',
    
    relationships: scores.relationships > 3
      ? 'Harmonious energy for connections. Express your feelings openly.'
      : scores.relationships < -3
      ? 'Practice patience in relationships. Misunderstandings may arise.'
      : 'Neutral day for relating. Focus on listening.',
    
    health: scores.health > 3
      ? 'Vital energy supports physical activity. Push your boundaries safely.'
      : scores.health < -3
      ? 'Rest and recuperation needed. Avoid overexertion.'
      : 'Maintain your health routines.',
    
    finances: scores.finances > 3
      ? 'Opportunities for financial growth. Consider investments carefully.'
      : scores.finances < -3
      ? 'Conservative approach advised. Avoid major purchases.'
      : 'Stable financial energy. Review your budget.',
    
    personalGrowth: scores.personalGrowth > 3
      ? 'Expand your horizons. Learning and growth are favored.'
      : scores.personalGrowth < -3
      ? 'Internal reflection serves you better than external expansion today.'
      : 'Steady personal development.',
  };
}

function generateSummary(overallScore: number, _aspects: GuidanceAspect[], _snapshot: CelestialSnapshot): string {
  if (overallScore > 5) return 'An excellent day with strong cosmic support. Take bold action and trust your instincts.';
  if (overallScore > 2) return 'Favorable conditions for most endeavors. Move forward with confidence.';
  if (overallScore > -2) return 'Mixed energies today. Balance action with reflection.';
  if (overallScore > -5) return 'Challenging cosmic weather. Focus on inner work and patience.';
  return 'A day for caution and contemplation. Avoid major decisions if possible.';
}

function extractThemes(aspects: GuidanceAspect[], snapshot: CelestialSnapshot): string[] {
  const themes: string[] = [];
  
  if (aspects.some(a => a.aspect === 'trine' && a.strength > 7)) themes.push('Flow');
  if (aspects.some(a => a.aspect === 'square')) themes.push('Challenge');
  if (aspects.some(a => a.aspect === 'conjunction')) themes.push('New Beginnings');
  if (snapshot.moonPhase.isWaxing) themes.push('Growth');
  if (snapshot.retrogrades.length > 0) themes.push('Review');
  
  return themes.length > 0 ? themes : ['Balance'];
}

function getPlanetaryHighlights(positions: Record<string, CelestialBody>, aspects: GuidanceAspect[]): GuidanceReading['planetaryHighlights'] {
  const highlights: GuidanceReading['planetaryHighlights'] = [];
  
  // Find strongest aspect
  const strongest = aspects[0];
  if (strongest) {
    highlights.push({
      planet: `${strongest.planet1}-${strongest.planet2}`,
      significance: `${strongest.aspect} aspect creating ${strongest.strength > 7 ? 'strong' : 'moderate'} influence`,
      advice: strongest.aspect === 'trine' || strongest.aspect === 'sextile'
        ? 'Use this harmonious energy to advance your goals.'
        : 'Work consciously with this challenging energy for growth.',
    });
  }
  
  // Check for retrogrades
  Object.values(positions).forEach(p => {
    if (p.isRetrograde) {
      highlights.push({
        planet: p.id,
        significance: `${p.id} is retrograde, calling for review and reconsideration`,
        advice: `Revisit past ${p.id}-related matters rather than starting anew.`,
      });
    }
  });
  
  return highlights;
}

function getLunarGuidance(moonPhase: { name: string; isWaxing: boolean; illumination: number }): string {
  if (moonPhase.illumination < 0.05) return 'New Moon: Set intentions for the coming cycle. Plant seeds.';
  if (moonPhase.illumination < 0.45) return 'Waxing Crescent: Take first steps. Build momentum.';
  if (moonPhase.illumination < 0.55) return 'Full Moon: Culmination and release. Celebrate completions.';
  if (moonPhase.illumination < 0.95) return 'Waning Gibbous: Gratitude and sharing. Teach what you\'ve learned.';
  return 'Balsamic Moon: Rest and release. Prepare for the new cycle.';
}

// Weekly helpers
function generateWeeklySummary(score: number, _snapshots: CelestialSnapshot[]): string {
  return score > 3 
    ? 'A productive week with cosmic support for your endeavors.'
    : score < -3
    ? 'A challenging week requiring patience and inner focus.'
    : 'A balanced week with mixed energies—adapt as needed.';
}

function generateWeeklyInsights(snapshots: CelestialSnapshot[], scores: GuidanceScore): GuidanceReading['detailedInsights'] {
  return generateInsights([], snapshots[0] || {} as any, scores);
}

function extractWeeklyThemes(snapshots: CelestialSnapshot[]): string[] {
  const allThemes = snapshots.flatMap(s => extractThemes(calculateAspects(s.positions), s));
  // Get unique themes
  return [...new Set(allThemes)].slice(0, 5);
}

function getWeeklyPlanetaryHighlights(snapshots: CelestialSnapshot[]): GuidanceReading['planetaryHighlights'] {
  return getPlanetaryHighlights(snapshots[0]?.positions || {}, calculateAspects(snapshots[0]?.positions || {}));
}

function getWeeklyLunarGuidance(snapshots: CelestialSnapshot[]): string {
  const phases = snapshots.map(s => s.moonPhase.name);
  const uniquePhases = [...new Set(phases)];
  return `This week includes: ${uniquePhases.join(', ')}. Adapt your activities to the lunar rhythm.`;
}

// Yearly helpers
interface YearlyTransit {
  planet: string;
  aspect: string;
  description: string;
  advice: string;
  isDisruptive?: boolean;
}

function getYearlyTransits(_year: number): YearlyTransit[] {
  // Simplified yearly transit data
  // In production, this would calculate actual transits
  return [
    {
      planet: 'jupiter',
      aspect: 'trine',
      description: 'Jupiter brings expansion and opportunity throughout the year.',
      advice: 'Say yes to growth opportunities. Expand your horizons.',
    },
    {
      planet: 'saturn',
      aspect: 'conjunction',
      description: 'Saturn demands structure and responsibility.',
      advice: 'Build lasting foundations. Accept the lessons of maturity.',
    },
  ];
}

function generateYearlySummary(year: number, transits: YearlyTransit[]): string {
  return `${year} brings significant planetary movements. ${transits[0]?.description || 'Focus on personal growth and steady progress.'}`;
}

function generateYearlyInsights(_transits: YearlyTransit[]): GuidanceReading['detailedInsights'] {
  return {
    career: 'Year-long trends favor strategic career moves.',
    relationships: 'Deepen commitments or release what no longer serves.',
    health: 'Sustainable health practices bring lasting benefits.',
    finances: 'Long-term financial planning yields results.',
    personalGrowth: 'Major growth opportunities through the year\'s challenges.',
  };
}

function extractYearlyThemes(_transits: YearlyTransit[]): string[] {
  return ['Transformation', 'Growth', 'Responsibility'];
}

export default {
  generateDailyGuidance,
  generateWeeklyGuidance,
  generateYearlyGuidance,
  calculateAspects,
};
