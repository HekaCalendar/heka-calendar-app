/**
 * Astrology-Calendar Integration
 * Synchronizes astrological data with HEKA calendar
 * Creates a unified journey experience
 */

import type { HekaDate } from '../../types';
import type { CelestialBody } from '../types';
import { calculateJulianDay, calculateAllPlanets } from '../services/swiss-ephemeris/engine';

/**
 * Daily astrological guidance integrated with calendar
 */
export interface DailyAstrologicalGuidance {
  readonly date: string;
  readonly hekaDate: HekaDate;
  readonly moonPhase: DailyMoonPhase;
  // @ts-ignore - may be used in future
  hekaDateRef?: any;
  readonly moonSign: string;
  readonly sunSign: string;
  readonly dailyTheme: string;
  readonly guidance: string;
  readonly journalPrompt: string;
  readonly affirmation: string;
  readonly powerMoment: string | null;
  readonly voidOfCourse: boolean;
}

export interface DailyMoonPhase {
  readonly phase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' |
                   'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  readonly illumination: number;
  readonly name: string;
  readonly meaning: string;
  readonly guidance: string;
}

/**
 * Sync astrology data with selected calendar date
 */
export async function getDailyAstrology(
  civilDate: Date,
  hekaDate: HekaDate
): Promise<DailyAstrologicalGuidance> {
  const year = civilDate.getFullYear();
  const month = civilDate.getMonth() + 1;
  const day = civilDate.getDate();
  
  const jd = calculateJulianDay(year, month, day, 12, 0);
  const positions = calculateAllPlanets(jd, ['sun', 'moon']);
  
  // Fallback when WASM not yet initialized
  if (!positions?.sun || !positions?.moon) {
    return {
      date: civilDate.toISOString().split('T')[0],
      hekaDate,
      moonPhase: { phase: 'full', name: 'Full Moon', illumination: 100, meaning: 'Completion and illumination', guidance: 'A time to celebrate achievements and release what no longer serves you.' },
      moonSign: 'leo',
      sunSign: 'leo',
      dailyTheme: 'Balance and reflection',
      guidance: 'The cosmos aligns in harmony. Trust your inner wisdom.',
      journalPrompt: 'What are you ready to release under this Full Moon?',
      affirmation: 'I am in harmony with the cosmic flow.',
      powerMoment: null,
      voidOfCourse: false,
    };
  }
  
  const moonPhase = calculateMoonPhase(positions.moon.longitude, positions.sun.longitude);
  const dailyTheme = generateDailyTheme(moonPhase);
  const guidance = generateDailyGuidance(moonPhase, positions);
  
  return {
    date: civilDate.toISOString().split('T')[0],
    hekaDate,
    moonPhase,
    moonSign: positions.moon.sign,
    sunSign: positions.sun.sign,
    dailyTheme,
    guidance,
    journalPrompt: generateJournalPrompt(moonPhase.phase),
    affirmation: generateDailyAffirmation(positions.moon.sign),
    powerMoment: calculatePowerMoment(civilDate),
    voidOfCourse: false
  };
}

function calculateMoonPhase(moonLong: number, sunLong: number): DailyMoonPhase {
  const diff = (moonLong - sunLong + 360) % 360;
  const illumination = (1 - Math.cos(diff * Math.PI / 180)) / 2 * 100;
  
  if (diff < 45) {
    return { phase: 'new', illumination, name: 'New Moon', meaning: 'Beginnings, intention setting', guidance: 'Set intentions for the cycle.' };
  } else if (diff < 90) {
    return { phase: 'waxing-crescent', illumination, name: 'Waxing Crescent', meaning: 'Growth, commitment', guidance: 'Take first steps toward goals.' };
  } else if (diff < 135) {
    return { phase: 'first-quarter', illumination, name: 'First Quarter', meaning: 'Challenges, action', guidance: 'Face obstacles with courage.' };
  } else if (diff < 180) {
    return { phase: 'waxing-gibbous', illumination, name: 'Waxing Gibbous', meaning: 'Refinement, perseverance', guidance: 'Refine your approach.' };
  } else if (diff < 225) {
    return { phase: 'full', illumination, name: 'Full Moon', meaning: 'Culmination, release', guidance: 'Celebrate and release.' };
  } else if (diff < 270) {
    return { phase: 'waning-gibbous', illumination, name: 'Waning Gibbous', meaning: 'Gratitude, sharing', guidance: 'Share wisdom and give thanks.' };
  } else if (diff < 315) {
    return { phase: 'last-quarter', illumination, name: 'Last Quarter', meaning: 'Release, forgiveness', guidance: 'Let go and forgive.' };
  } else {
    return { phase: 'waning-crescent', illumination, name: 'Waning Crescent', meaning: 'Rest, surrender', guidance: 'Rest and prepare for renewal.' };
  }
}

function generateDailyTheme(moonPhase: DailyMoonPhase): string {
  return moonPhase.phase === 'new' ? 'New Beginnings' :
         moonPhase.phase === 'full' ? 'Illumination' :
         moonPhase.phase.includes('waxing') ? 'Growth' : 'Release';
}

function generateDailyGuidance(moonPhase: DailyMoonPhase, positions: Record<string, CelestialBody>): string {
  return `${moonPhase.guidance} Moon in ${positions.moon.sign}.`;
}

function generateJournalPrompt(phase: DailyMoonPhase['phase']): string {
  const prompts: Record<string, string> = {
    'new': 'What seeds am I planting?',
    'full': 'What has come to fruition?',
    'waxing-crescent': 'What first steps am I taking?',
    'waning-crescent': 'Where can I surrender more deeply?'
  };
  return prompts[phase] || 'What is my heart saying today?';
}

function generateDailyAffirmation(moonSign: string): string {
  const affirmations: Record<string, string> = {
    'aries': 'I am courageous and take bold action.',
    'taurus': 'I am grounded and abundant.',
    'gemini': 'I communicate with clarity.',
    'cancer': 'I am nurtured and nurture others.',
    'leo': 'I shine my light with confidence.',
    'virgo': 'I am perfect in my imperfections.',
    'libra': 'I create harmony.',
    'scorpio': 'I embrace transformation.',
    'sagittarius': 'I expand into my highest potential.',
    'capricorn': 'I build my dreams.',
    'aquarius': 'I celebrate my uniqueness.',
    'pisces': 'I trust my intuition.',
    'ophiuchus': 'I heal and transform with ancient wisdom.'
  };
  return affirmations[moonSign] || 'I am whole and connected.';
}

function calculatePowerMoment(date: Date): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const isToday = today.getTime() === target.getTime();

  if (isToday) {
    const hour = date.getHours();
    if (hour >= 6 && hour <= 9) return 'Sunrise - New beginnings';
    if (hour >= 11 && hour <= 13) return 'Solar noon - Peak energy';
    if (hour >= 17 && hour <= 19) return 'Sunset - Reflection';
    return null;
  }

  // For future/past dates, list all key power moments
  return 'Sunrise • Solar Noon • Sunset — Key moments for this day';
}

export default { getDailyAstrology };
