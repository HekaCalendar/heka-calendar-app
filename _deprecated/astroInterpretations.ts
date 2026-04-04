/**
 * HEKA Astrology Interpretation Database
 * Template-based wisdom for daily transit readings
 */

import { Planet, ZodiacSign, AspectType, AstroTip } from '../types/astrology';

// Transit interpretations - transiting planet to natal planet
export interface TransitInterpretation {
  transitingPlanet: Planet;
  natalPlanet: Planet;
  aspect: AspectType;
  title: string;
  tip: string;
  action: string;
  timing: string;
  category: 'general' | 'love' | 'career' | 'health' | 'spiritual' | 'emotions';
  powerLevel: 'low' | 'medium' | 'high' | 'very-high';
}

// Generate a key for the interpretation map
function transitKey(
  transiting: Planet, 
  natal: Planet, 
  aspect: AspectType
): string {
  return `${transiting}-${aspect}-${natal}`;
}

// Interpretation database - curated significant transits
const TRANSIT_INTERPRETATIONS: Record<string, TransitInterpretation> = {
  // SUN TRANSITS
  [transitKey('sun', 'sun', 'conjunction')]: {
    transitingPlanet: 'sun',
    natalPlanet: 'sun',
    aspect: 'conjunction',
    title: 'Solar Return - Your Personal New Year',
    tip: 'This is your astrological birthday! The Sun returns to its natal position, marking the beginning of your personal new year.',
    action: 'Write down your goals for the next 12 months. What do you want to illuminate?',
    timing: 'Once per year, lasts about 3 days',
    category: 'general',
    powerLevel: 'very-high',
  },
  [transitKey('sun', 'moon', 'conjunction')]: {
    transitingPlanet: 'sun',
    natalPlanet: 'moon',
    aspect: 'conjunction',
    title: 'Illuminated Emotions',
    tip: 'The Sun shines light on your emotional nature. Your feelings are clear and purposeful today.',
    action: 'Express your feelings with confidence. Others see your emotional truth clearly.',
    timing: 'Once per month, lasts 1-2 days',
    category: 'emotions',
    powerLevel: 'high',
  },
  
  // MOON TRANSITS
  [transitKey('moon', 'sun', 'conjunction')]: {
    transitingPlanet: 'moon',
    natalPlanet: 'sun',
    aspect: 'conjunction',
    title: 'New Moon Reset',
    tip: 'Your emotional needs align with your core identity. A fresh start in your personal life.',
    action: 'Set intentions. Start something new that aligns with your authentic self.',
    timing: 'Monthly - excellent for new beginnings',
    category: 'general',
    powerLevel: 'medium',
  },
  [transitKey('moon', 'sun', 'opposition')]: {
    transitingPlanet: 'moon',
    natalPlanet: 'sun',
    aspect: 'opposition',
    title: 'Full Moon Illumination',
    tip: 'A culmination point. Your emotions and conscious will are in tension. Things come to light.',
    action: 'Practice compromise. Acknowledge what has come to fruition. Release what no longer serves.',
    timing: 'Monthly - time of culmination',
    category: 'emotions',
    powerLevel: 'high',
  },
  [transitKey('moon', 'moon', 'conjunction')]: {
    transitingPlanet: 'moon',
    natalPlanet: 'moon',
    aspect: 'conjunction',
    title: 'Lunar Return - Emotional Reset',
    tip: 'Your emotional slate is wiped clean. This monthly cycle brings clarity about your needs.',
    action: 'Honor your feelings without judgment. What is your heart telling you?',
    timing: 'Monthly - your emotional new moon',
    category: 'emotions',
    powerLevel: 'medium',
  },
  
  // MERCURY TRANSITS
  [transitKey('mercury', 'mercury', 'conjunction')]: {
    transitingPlanet: 'mercury',
    natalPlanet: 'mercury',
    aspect: 'conjunction',
    title: 'Mental Clarity Day',
    tip: 'Your mind is sharp and focused. Communication flows easily.',
    action: 'Have that important talk. Sign contracts. Write your ideas down.',
    timing: 'Once per year, lasts about 10 days',
    category: 'general',
    powerLevel: 'medium',
  },
  [transitKey('mercury', 'sun', 'conjunction')]: {
    transitingPlanet: 'mercury',
    natalPlanet: 'sun',
    aspect: 'conjunction',
    title: 'Mind-Heart Alignment',
    tip: 'Your thoughts align with your core identity. Authentic self-expression is enhanced.',
    action: 'Speak your truth. Share your ideas with confidence.',
    timing: 'Once per year, lasts about 7 days',
    category: 'general',
    powerLevel: 'high',
  },
  
  // VENUS TRANSITS
  [transitKey('venus', 'venus', 'conjunction')]: {
    transitingPlanet: 'venus',
    natalPlanet: 'venus',
    aspect: 'conjunction',
    title: 'Venus Return - Love & Beauty Cycle',
    tip: 'A renewal of your values, relationships, and aesthetic sense.',
    action: 'Indulge in beauty. Reassess your relationships. Treat yourself.',
    timing: 'Once per year, lasts about 3 weeks',
    category: 'love',
    powerLevel: 'medium',
  },
  [transitKey('venus', 'mars', 'conjunction')]: {
    transitingPlanet: 'venus',
    natalPlanet: 'mars',
    aspect: 'conjunction',
    title: 'Passion Ignited',
    tip: 'Love and desire dance together. Romantic and creative passions are heightened.',
    action: 'Express your desires. Initiate romance. Channel passion into creativity.',
    timing: 'Rare - once every few years',
    category: 'love',
    powerLevel: 'high',
  },
  
  // MARS TRANSITS
  [transitKey('mars', 'mars', 'conjunction')]: {
    transitingPlanet: 'mars',
    natalPlanet: 'mars',
    aspect: 'conjunction',
    title: 'Mars Return - Energy Surge',
    tip: 'Your drive, ambition, and physical energy are renewed.',
    action: 'Take bold action. Start a physical challenge. Assert your needs.',
    timing: 'Once every 2 years, lasts about 2 months',
    category: 'general',
    powerLevel: 'high',
  },
  [transitKey('mars', 'sun', 'conjunction')]: {
    transitingPlanet: 'mars',
    natalPlanet: 'sun',
    aspect: 'conjunction',
    title: 'Empowered Action',
    tip: 'Your will and drive are united. Exceptional energy for pursuing goals.',
    action: 'Launch projects. Exercise vigorously. Stand up for yourself.',
    timing: 'Once every 2 years, lasts about 2 weeks',
    category: 'career',
    powerLevel: 'very-high',
  },
  
  // JUPITER TRANSITS
  [transitKey('jupiter', 'sun', 'conjunction')]: {
    transitingPlanet: 'jupiter',
    natalPlanet: 'sun',
    aspect: 'conjunction',
    title: 'Year of Expansion',
    tip: 'A 12-year growth cycle begins. Opportunities for expansion in all areas of life.',
    action: 'Take calculated risks. Expand your horizons. Believe in yourself.',
    timing: 'Once every 12 years - lasts about 1 year',
    category: 'general',
    powerLevel: 'very-high',
  },
  [transitKey('jupiter', 'jupiter', 'conjunction')]: {
    transitingPlanet: 'jupiter',
    natalPlanet: 'jupiter',
    aspect: 'conjunction',
    title: 'Jupiter Return - Great Fortune',
    tip: 'Your personal new year of growth and abundance. Major expansion is possible.',
    action: 'Dream big. Travel. Study. Expand your worldview.',
    timing: 'Once every 12 years - lasts about 1 year',
    category: 'spiritual',
    powerLevel: 'very-high',
  },
  
  // SATURN TRANSITS
  [transitKey('saturn', 'sun', 'conjunction')]: {
    transitingPlanet: 'saturn',
    natalPlanet: 'sun',
    aspect: 'conjunction',
    title: 'Saturn Return - The Great Maturation',
    tip: 'The astrological coming of age. A major life restructuring occurs.',
    action: 'Take responsibility. Make hard choices. Build something that endures.',
    timing: 'Ages 29-30, 58-59, 87-88 - lasts about 9 months',
    category: 'general',
    powerLevel: 'very-high',
  },
};

// Get interpretation for a transit
export function getTransitInterpretation(
  transitingPlanet: Planet,
  natalPlanet: Planet,
  aspect: AspectType
): TransitInterpretation | null {
  const key = transitKey(transitingPlanet, natalPlanet, aspect);
  return TRANSIT_INTERPRETATIONS[key] || null;
}

// Moon phase interpretations
export interface MoonPhaseInterpretation {
  phase: string;
  title: string;
  guidance: string;
  action: string;
  powerLevel: 'low' | 'medium' | 'high';
}

export const MOON_PHASES: Record<string, MoonPhaseInterpretation> = {
  'new-moon': {
    phase: 'New Moon',
    title: 'Dark Moon - Seed Planting',
    guidance: 'The moon is invisible, resting in darkness. This is the void from which all creation emerges.',
    action: 'Set intentions. Plant metaphorical seeds. Start new projects.',
    powerLevel: 'high',
  },
  'waxing-crescent': {
    phase: 'Waxing Crescent',
    title: 'Growing Light',
    guidance: 'The first sliver of moon appears. Your intentions gain momentum.',
    action: 'Take first steps. Gather resources. Build momentum.',
    powerLevel: 'medium',
  },
  'first-quarter': {
    phase: 'First Quarter',
    title: 'Action Point',
    guidance: 'Half the moon is illuminated. Challenges arise to test your commitment.',
    action: 'Make decisions. Overcome obstacles. Take decisive action.',
    powerLevel: 'high',
  },
  'waxing-gibbous': {
    phase: 'Waxing Gibbous',
    title: 'Refinement',
    guidance: 'The moon swells toward fullness. Refine your approach.',
    action: 'Adjust and improve. Prepare for culmination.',
    powerLevel: 'medium',
  },
  'full-moon': {
    phase: 'Full Moon',
    title: 'Illumination Peak',
    guidance: 'The moon is fully illuminated. Emotions peak. What was hidden comes to light.',
    action: 'Celebrate achievements. Release what no longer serves.',
    powerLevel: 'high',
  },
  'waning-gibbous': {
    phase: 'Waning Gibbous',
    title: 'Gratitude & Sharing',
    guidance: 'The light begins to fade. Share your abundance.',
    action: 'Give back. Share wisdom. Express appreciation.',
    powerLevel: 'medium',
  },
  'last-quarter': {
    phase: 'Last Quarter',
    title: 'Release Point',
    guidance: 'Half dark, half light. Let go of what is complete.',
    action: 'Release attachments. Complete projects. Clear space.',
    powerLevel: 'high',
  },
  'waning-crescent': {
    phase: 'Waning Crescent',
    title: 'Surrender',
    guidance: 'Only a sliver remains. Surrender to the cycle.',
    action: 'Rest deeply. Reflect on the cycle. Prepare for renewal.',
    powerLevel: 'low',
  },
};

// Generate daily tip based on multiple factors
export interface DailyReadingInput {
  moonPhase: string;
  moonSign: ZodiacSign;
  transits: Array<{
    transitingPlanet: Planet;
    natalPlanet: Planet;
    aspect: AspectType;
    orb: number;
  }>;
  hekaMonthIndex: number;
  hekaDay: number;
}

export function generateDailyTip(input: DailyReadingInput): AstroTip {
  // Start with moon phase
  const moonPhaseInterp = MOON_PHASES[input.moonPhase] || MOON_PHASES['new-moon'];
  
  // Check for significant transits (orb < 3 degrees)
  const significantTransits = input.transits.filter(t => t.orb < 3);
  
  let title = moonPhaseInterp.title;
  let message = moonPhaseInterp.guidance;
  let action = moonPhaseInterp.action;
  let category: AstroTip['category'] = 'general';
  let powerLevel: AstroTip['powerLevel'] = moonPhaseInterp.powerLevel;
  
  // If there are strong transits, blend them in
  if (significantTransits.length > 0) {
    const strongest = significantTransits[0];
    const interp = getTransitInterpretation(
      strongest.transitingPlanet,
      strongest.natalPlanet,
      strongest.aspect
    );
    
    if (interp) {
      title = interp.title;
      message = `${interp.tip}`;
      action = interp.action;
      category = interp.category;
      powerLevel = interp.powerLevel === 'very-high' ? 'high' : interp.powerLevel;
    }
  }
  
  // Add HEKA-specific context
  if (input.hekaMonthIndex === 12) {
    message += ' This is the Sacred Day - a time between cycles. Special magic is available.';
  }
  
  return {
    title,
    message,
    category,
    action,
    timing: powerLevel === 'high' ? 'Significant day - pay attention' : 'Gentle energy',
  };
}
