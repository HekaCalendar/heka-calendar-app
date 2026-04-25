import type { PersonalTransit } from '../../oracle/birthChartIntegration';
import type { CelestialState } from './types';

export function calculateStreak(entries: any[]): number {
  if (entries.length === 0) return 0;
  const dates = [...new Set(entries.map(e => e.date))].sort();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i];
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - (dates.length - 1 - i));
    
    if (date === expectedDate.toISOString().split('T')[0] || 
        (i === dates.length - 1 && date === today)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export const ZODIAC_ORDER = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

export function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
    leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
    sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
    ophiuchus: '⛎',
  };
  return symbols[String(sign).toLowerCase()] || '✦';
}

export function getSignElementColor(sign: string): string {
  const colors: Record<string, string> = {
    aries: '#ef4444', leo: '#ef4444', sagittarius: '#ef4444',
    taurus: '#22c55e', virgo: '#22c55e', capricorn: '#22c55e',
    gemini: '#f59e0b', libra: '#f59e0b', aquarius: '#f59e0b',
    cancer: '#3b82f6', scorpio: '#3b82f6', pisces: '#3b82f6',
    ophiuchus: '#14b8a6',
  };
  return colors[String(sign).toLowerCase()] || '#9d4edd';
}

export function getMoonPhaseName(phase: string): string {
  const names: Record<string, string> = {
    new: 'New', waxing_crescent: 'Waxing Crescent',
    first_quarter: 'First Quarter', waxing_gibbous: 'Waxing Gibbous',
    full: 'Full', waning_gibbous: 'Waning Gibbous',
    last_quarter: 'Last Quarter', waning_crescent: 'Waning Crescent',
  };
  return names[phase] || 'Current';
}

export function generateCosmicPrompt(transits: PersonalTransit[], moonPhase: CelestialState['moonPhase']): string {
  if (transits.length > 0) {
    const top = transits.sort((a, b) => b.strength - a.strength)[0];
    return `With ${top.transitingPlanet} ${top.aspect} your ${top.natalPlanet}, what old pattern is asking to be seen today?`;
  }
  const moonPrompts: Record<string, string> = {
    new: 'The New Moon invites fresh intentions. What seed are you planting today?',
    waxing_crescent: 'Energy is building. What small step can you take toward your desire?',
    first_quarter: 'Tension creates momentum. Where are you being called to act with courage?',
    waxing_gibbous: 'Refinement is key. What detail in your life is asking for attention?',
    full: 'Illumination arrives. What truth is rising to the surface under this Full Moon?',
    waning_gibbous: 'Gratitude and release. What are you ready to share or let go of?',
    last_quarter: 'A turning point. What old story are you rewriting today?',
    waning_crescent: 'Rest and surrender. What can you trust to the unseen?',
  };
  return moonPrompts[moonPhase.phase] || 'What is the cosmos whispering to you today?';
}

export function getMoonEmoji(phase: string): string {
  const emojis: Record<string, string> = {
    'new': '🌑', 'waxing_crescent': '🌒', 'first_quarter': '🌓',
    'waxing_gibbous': '🌔', 'full': '🌕', 'waning_gibbous': '🌖',
    'last_quarter': '🌗', 'waning_crescent': '🌘',
  };
  return emojis[phase] || '🌙';
}

export function getPlanetSymbol(planet: string): string {
  const symbols: Record<string, string> = {
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
    Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  };
  return symbols[planet] || '●';
}

export function getAspectSymbol(aspect: string): string {
  const symbols: Record<string, string> = {
    conjunction: '☌', sextile: '⚹', square: '□', trine: '△', 
    opposition: '☍', quincunx: '⚻'
  };
  return symbols[aspect] || aspect;
}
