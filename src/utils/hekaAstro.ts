/**
 * HEKA-Astrology Integration
 * Maps tropical zodiac to the 13-month HEKA calendar system
 */

import { ZODIAC_SIGNS, ZodiacSign, PlanetPosition, ZodiacSignData } from '../types/astrology';
import { ArcType } from '../types';
import { HEKA_MONTHS } from '../services/calendarService';

// HEKA Month Zodiac Mapping
// Since HEKA has 13 months and zodiac has 12 signs, we use a hybrid system
// One sign spans slightly longer (approximately 28 vs 30 days)

export interface HekaZodiacMapping {
  hekaMonthIndex: number;
  hekaMonthName: string;
  primaryZodiacSign: ZodiacSign;
  secondaryZodiacSign?: ZodiacSign; // For cusp periods
  arc: ArcType;
  themes: string[];
  rulingPlanets: string[];
  keywords: string[];
}

// The 13-month HEKA zodiac system
// Each HEKA month carries the energy of its corresponding zodiac sign
// Plus an additional 13th sign influence (Ophiuchus or extended Scorpio)
export const HEKA_ZODIAC_MAPPING: HekaZodiacMapping[] = [
  {
    hekaMonthIndex: 0, // April - Month 1
    hekaMonthName: 'Month of April',
    primaryZodiacSign: 'aries',
    arc: 'OPENING',
    themes: ['new beginnings', 'initiation', 'planting seeds', 'courage'],
    rulingPlanets: ['Mars'],
    keywords: ['fire', 'action', 'leadership', 'spring awakening'],
  },
  {
    hekaMonthIndex: 1, // May - Month 2
    hekaMonthName: 'Month of May',
    primaryZodiacSign: 'taurus',
    arc: 'OPENING',
    themes: ['growth', 'stability', 'sensuality', 'grounding'],
    rulingPlanets: ['Venus'],
    keywords: ['earth', 'patience', 'beauty', 'manifestation'],
  },
  {
    hekaMonthIndex: 2, // June - Month 3
    hekaMonthName: 'Month of June',
    primaryZodiacSign: 'gemini',
    arc: 'OPENING',
    themes: ['communication', 'learning', 'connection', 'curiosity'],
    rulingPlanets: ['Mercury'],
    keywords: ['air', 'duality', 'exchange', 'ideas'],
  },
  {
    hekaMonthIndex: 3, // July - Month 4
    hekaMonthName: 'Month of July',
    primaryZodiacSign: 'cancer',
    arc: 'CORE',
    themes: ['emotions', 'nurturing', 'home', 'protection'],
    rulingPlanets: ['Moon'],
    keywords: ['water', 'intuition', 'family', 'roots'],
  },
  {
    hekaMonthIndex: 4, // August - Month 5
    hekaMonthName: 'Month of August',
    primaryZodiacSign: 'leo',
    arc: 'CORE',
    themes: ['creativity', 'expression', 'confidence', 'play'],
    rulingPlanets: ['Sun'],
    keywords: ['fire', 'heart', 'drama', 'generosity'],
  },
  {
    hekaMonthIndex: 5, // September - Month 6
    hekaMonthName: 'Month of September',
    primaryZodiacSign: 'virgo',
    arc: 'CORE',
    themes: ['analysis', 'service', 'health', 'refinement'],
    rulingPlanets: ['Mercury'],
    keywords: ['earth', 'detail', 'harvest', 'perfection'],
  },
  {
    hekaMonthIndex: 6, // October - Month 7
    hekaMonthName: 'Month of October',
    primaryZodiacSign: 'libra',
    arc: 'CORE',
    themes: ['balance', 'relationships', 'beauty', 'justice'],
    rulingPlanets: ['Venus'],
    keywords: ['air', 'harmony', 'partnership', 'equinox balance'],
  },
  {
    hekaMonthIndex: 7, // November - Month 8
    hekaMonthName: 'Month of November',
    primaryZodiacSign: 'scorpio',
    arc: 'CORE',
    themes: ['transformation', 'depth', 'intimacy', 'power'],
    rulingPlanets: ['Pluto', 'Mars'],
    keywords: ['water', 'mystery', 'death-rebirth', 'intensity'],
  },
  {
    hekaMonthIndex: 8, // November 29-30 - Month 9 (Ophiuchus overlap)
    hekaMonthName: 'Month of December',
    primaryZodiacSign: 'ophiuchus', // The 13th sign
    secondaryZodiacSign: 'sagittarius',
    arc: 'CORE',
    themes: ['healing', 'wisdom', 'alchemy', 'serpent power'],
    rulingPlanets: ['Pluto', 'Ophiuchus'],
    keywords: ['transmutation', 'medicine', 'hidden knowledge', 'bridge'],
  },
  {
    hekaMonthIndex: 9, // December - Month 10
    hekaMonthName: 'Month of December',
    primaryZodiacSign: 'sagittarius',
    arc: 'CORE',
    themes: ['expansion', 'wisdom', 'adventure', 'truth'],
    rulingPlanets: ['Jupiter'],
    keywords: ['fire', 'philosophy', 'travel', 'optimism'],
  },
  {
    hekaMonthIndex: 9, // January - Month 10
    hekaMonthName: 'Month of January',
    primaryZodiacSign: 'capricorn',
    arc: 'CLOSING',
    themes: ['ambition', 'discipline', 'structure', 'mastery'],
    rulingPlanets: ['Saturn'],
    keywords: ['earth', 'authority', 'legacy', 'achievement'],
  },
  {
    hekaMonthIndex: 10, // February - Month 11
    hekaMonthName: 'Month of February',
    primaryZodiacSign: 'aquarius',
    arc: 'CLOSING',
    themes: ['innovation', 'community', 'freedom', 'vision'],
    rulingPlanets: ['Uranus', 'Saturn'],
    keywords: ['air', 'revolution', 'humanity', 'future'],
  },
  {
    hekaMonthIndex: 11, // March - Month 12
    hekaMonthName: 'Month of March',
    primaryZodiacSign: 'pisces',
    arc: 'CLOSING',
    themes: ['compassion', 'imagination', 'spirituality', 'release'],
    rulingPlanets: ['Neptune', 'Jupiter'],
    keywords: ['water', 'dreams', 'unity', 'transcendence'],
  },
  {
    hekaMonthIndex: 12, // March Day 29/30 - The 13th Month
    hekaMonthName: 'Month of the Sacred Day',
    primaryZodiacSign: 'pisces', // Cusp with Aries
    secondaryZodiacSign: 'aries',
    arc: 'CLOSING',
    themes: ['completion', 'the void', 'quantum leap', 'sacred threshold'],
    rulingPlanets: ['Neptune', 'Mars'],
    keywords: ['threshold', 'mystery', 'eternal', 'cosmic door'],
  },
];

// Get zodiac info for a HEKA month
export function getZodiacForHekaMonth(monthIndex: number): HekaZodiacMapping | null {
  if (monthIndex < 0 || monthIndex > 12) return null;
  return HEKA_ZODIAC_MAPPING[monthIndex];
}

// Get HEKA month info for a zodiac sign
export function getHekaMonthForZodiac(sign: ZodiacSign): HekaZodiacMapping | null {
  return HEKA_ZODIAC_MAPPING.find(m => m.primaryZodiacSign === sign) || null;
}

// Check if a date falls in the 13th month (sacred day)
export function isSacredDay(hekaMonth: number, hekaDay: number): boolean {
  return hekaMonth === 12 && (hekaDay === 29 || hekaDay === 30);
}

// Get personalized zodiac reading for HEKA date
export interface HekaZodiacReading {
  date: string;
  hekaMonth: string;
  zodiacSign: ZodiacSign;
  zodiacData: ZodiacSignData;
  arc: ArcType;
  themes: string[];
  guidance: string;
  element: 'fire' | 'earth' | 'air' | 'water' | 'ether';
}

export function getHekaZodiacReading(hekaMonthIndex: number, hekaDay: number): HekaZodiacReading {
  const mapping = getZodiacForHekaMonth(hekaMonthIndex);
  if (!mapping) throw new Error('Invalid HEKA month');
  
  const signData = ZODIAC_SIGNS[mapping.primaryZodiacSign];
  const isSacred = isSacredDay(hekaMonthIndex, hekaDay);
  
  // Generate guidance based on day of month
  const dayPhase = hekaDay <= 7 ? 'beginning' : 
                   hekaDay <= 14 ? 'building' : 
                   hekaDay <= 21 ? 'culminating' : 
                   'completing';
  
  const guidance = isSacred 
    ? `The Sacred Day - a threshold between cycles. ${signData.description} Take time for reflection and preparation for the new year.`
    : `${signData.description} You are in the ${dayPhase} phase of this month's energy.`;
  
  return {
    date: `${HEKA_MONTHS[hekaMonthIndex]} ${hekaDay}`,
    hekaMonth: mapping.hekaMonthName,
    zodiacSign: mapping.primaryZodiacSign,
    zodiacData: signData,
    arc: mapping.arc,
    themes: mapping.themes,
    guidance,
    element: signData.element,
  };
}

// Natal Chart in HEKA Terms
export interface HekaNatalProfile {
  sunSign: ZodiacSign;
  sunHekaMonth: number;
  moonSign: ZodiacSign;
  moonHekaMonth: number;
  risingSign: ZodiacSign | null;
  risingHekaMonth: number | null;
  dominantElement: 'fire' | 'earth' | 'air' | 'water' | 'ether';
  dominantArc: ArcType;
  hekaSoulPath: string;
}

// Calculate HEKA natal profile from chart positions
export function calculateHekaNatalProfile(positions: PlanetPosition[]): HekaNatalProfile {
  const sun = positions.find(p => p.planet === 'sun');
  const moon = positions.find(p => p.planet === 'moon');
  const ascendant = positions.find(p => p.planet === 'sun' && p.house === 1); // Approximation
  
  if (!sun) throw new Error('Sun position required');
  
  const sunMonth = getHekaMonthForZodiac(sun.sign);
  const moonMonth = moon ? getHekaMonthForZodiac(moon.sign) : null;
  const risingMonth = ascendant ? getHekaMonthForZodiac(ascendant.sign) : null;
  
  // Calculate dominant element
  const elementCounts: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0, ether: 0 };
  positions.forEach(p => {
    const sign = ZODIAC_SIGNS[p.sign];
    elementCounts[sign.element]++;
  });
  
  const dominantElement = Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1])[0][0] as 'fire' | 'earth' | 'air' | 'water' | 'ether';
  
  // Calculate dominant arc
  const arcCounts: Record<string, number> = { inspiration: 0, action: 0, integration: 0, crystallization: 0 };
  positions.forEach(p => {
    const month = getHekaMonthForZodiac(p.sign);
    if (month) arcCounts[month.arc]++;
  });
  
  const dominantArc = Object.entries(arcCounts)
    .sort((a, b) => b[1] - a[1])[0][0] as ArcType;
  
  // Generate soul path description
  const soulPath = generateHekaSoulPath(sun.sign, moon?.sign, ascendant?.sign, dominantElement, dominantArc);
  
  return {
    sunSign: sun.sign,
    sunHekaMonth: sunMonth?.hekaMonthIndex || 0,
    moonSign: moon?.sign || sun.sign,
    moonHekaMonth: moonMonth?.hekaMonthIndex || 0,
    risingSign: ascendant?.sign || null,
    risingHekaMonth: risingMonth?.hekaMonthIndex || null,
    dominantElement,
    dominantArc,
    hekaSoulPath: soulPath,
  };
}

function generateHekaSoulPath(
  sun: ZodiacSign, 
  moon: ZodiacSign | undefined, 
  rising: ZodiacSign | undefined,
  element: string,
  arc: string
): string {
  const sunData = ZODIAC_SIGNS[sun];
  const moonData = moon ? ZODIAC_SIGNS[moon] : null;
  
  const elementDescriptions: Record<string, string> = {
    fire: 'igniting inspiration and passion',
    earth: 'building lasting foundations',
    air: 'weaving ideas and connections',
    water: 'flowing with emotional wisdom',
  };
  
  const arcDescriptions: Record<string, string> = {
    inspiration: 'through the spark of new beginnings',
    action: 'through courageous manifestation',
    integration: 'through harmonizing opposites',
    crystallization: 'through mastering form',
  };
  
  let path = `Your HEKA soul path centers on ${elementDescriptions[element]} ${arcDescriptions[arc]}. `;
  path += `With your Sun in ${sunData.name}, your core purpose embodies ${sunData.keywords.slice(0, 3).join(', ')}. `;
  
  if (moonData) {
    path += `Your Moon in ${moonData.name} brings emotional depth through ${moonData.keywords.slice(0, 2).join(' and ')}. `;
  }
  
  if (rising) {
    const risingData = ZODIAC_SIGNS[rising];
    path += `Your rising ${risingData.name} colors your approach with ${risingData.keywords[0]}.`;
  }
  
  return path;
}

// Get daily astro guidance for HEKA date
export function getDailyHekaGuidance(
  hekaMonthIndex: number, 
  hekaDay: number,
  _natalSunSign?: ZodiacSign
): { theme: string; guidance: string; powerWord: string } {
  const reading = getHekaZodiacReading(hekaMonthIndex, hekaDay);
  const isSacred = isSacredDay(hekaMonthIndex, hekaDay);
  
  if (isSacred) {
    return {
      theme: 'The Sacred Threshold',
      guidance: 'Stand at the doorway between cycles. What will you release? What will you call in? This day exists outside of time.',
      powerWord: 'TRANSFORM',
    };
  }
  
  // Day of month guidance
  const dayGuidance: Record<number, { theme: string; guidance: string; powerWord: string }> = {
    1: { theme: 'New Moon Energy', guidance: 'Begin fresh. Set intentions for this 28-day cycle.', powerWord: 'INITIATE' },
    7: { theme: 'First Quarter', guidance: 'Take action. Overcome obstacles with determination.', powerWord: 'ACT' },
    14: { theme: 'Full Moon Energy', guidance: 'Illuminate what was hidden. Celebrate progress.', powerWord: 'ILLUMINATE' },
    21: { theme: 'Last Quarter', guidance: 'Release what no longer serves. Make space.', powerWord: 'RELEASE' },
    28: { theme: 'Dark Moon', guidance: 'Rest and reflect. Prepare for the new cycle.', powerWord: 'REST' },
  };
  
  const specialDay = dayGuidance[hekaDay];
  if (specialDay) return specialDay;
  
  // Regular day guidance based on zodiac
  const zodiacGuidance: Record<ZodiacSign, string> = {
    aries: 'Take the lead. Your courage is needed today.',
    taurus: 'Slow down. Savor the sensory world around you.',
    gemini: 'Reach out. A conversation holds the key.',
    cancer: 'Nurture yourself first, then others.',
    leo: 'Shine your light. Your authenticity inspires.',
    virgo: 'Organize one small thing. Order brings peace.',
    libra: 'Seek balance. Beauty is a valid destination.',
    scorpio: 'Dive deep. Transformation awaits in the shadows.',
    ophiuchus: 'Embrace healing. The serpent bearer brings wisdom.',
    sagittarius: 'Expand your horizons. Adventure calls.',
    capricorn: 'Build one brick at a time. Mastery takes time.',
    aquarius: 'Think different. Your uniqueness is your gift.',
    pisces: 'Trust your intuition. Dreams hold messages.',
  };
  
  return {
    theme: `${reading.zodiacData.name} Energy`,
    guidance: zodiacGuidance[reading.zodiacSign],
    powerWord: reading.zodiacData.keywords[0].toUpperCase(),
  };
}
