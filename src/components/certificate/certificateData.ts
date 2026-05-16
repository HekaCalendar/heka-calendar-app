/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CERTIFICATE DATA ENGINE
 * Types, template registry, astrological enrichment, Chinese zodiac,
 * and per-template display options with locked features
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { BirthData as AstroBirthData } from '../../astrology/types/core';
import { generateNatalChart } from '../../astrology/services/swiss-ephemeris/engine';
import i18n from '../../i18n';
import { calculatePreciseMoonPhase } from '../../astrology/services/calculations/swissCalculations';
import { calculateMansionsForJD } from '../../astrology/services/calculations/nakshatras';
import { getSignFromLongitude, SIGN_SYMBOLS, SIGN_SYMBOLS_13 } from '../../astrology/types/core';
import type { ZodiacSign } from '../../astrology/types/core';
import { civilToHeka } from '../../services/calendarService';

// ── Template IDs ─────────────────────────────────────────────────────────────

export type TemplateId =
  | 'celestial-gold'
  | 'sacred-geometry'
  | 'minimal-modern'
  | 'ancient-parchment'
  | 'cosmic-nebula'
  | 'art-deco'
  | 'nakshatra-vedic'
  | 'chinese-zodiac'
  | 'moon-phase';

// ── Certificate Data (all computed fields) ───────────────────────────────────

export interface CertificateData {
  name: string;
  birthDate: string;      // YYYY-MM-DD
  birthTime: string;      // HH:MM
  locationName: string;
  latitude: number;
  longitude: number;
  timezone: string;

  // Astrological
  sunSign: string;
  sunSignSymbol: string;
  sunDegree: string;
  moonSign: string;
  moonSignSymbol: string;
  moonDegree: string;
  risingSign: string;
  risingSignSymbol: string;
  risingDegree: string;
  moonPhase: string;
  moonIllumination: number;
  moonPhaseEmoji: string;
  nakshatra?: string;
  nakshatraSymbol?: string;
  houseCusps?: Array<{ house: number; sign: string; signSymbol: string; degree: string }>;
  elementalBalance?: { fire: number; earth: number; air: number; water: number; ether: number };

  // Calendar
  hekaDate?: string;
  civilDateFormatted?: string;

  // Chinese zodiac
  chineseZodiacAnimal?: string;
  chineseZodiacElement?: string;
  chineseZodiacEmoji?: string;
}

// ── Display Options (toggleable per certificate) ─────────────────────────────

export interface CertificateOptions {
  showTime: boolean;
  showLocation: boolean;
  showCoordinates: boolean;
  showAstrology: boolean;
  showMoonPhase: boolean;
  showNakshatra: boolean;
  showChineseZodiac: boolean;
  showHekaDate: boolean;
  showElementalBalance: boolean;
  showHouseCusps: boolean;
}

export const ALL_OPTIONS_ON: CertificateOptions = {
  showTime: true,
  showLocation: true,
  showCoordinates: true,
  showAstrology: true,
  showMoonPhase: true,
  showNakshatra: true,
  showChineseZodiac: true,
  showHekaDate: true,
  showElementalBalance: true,
  showHouseCusps: true,
};

export const ALL_OPTIONS_OFF: CertificateOptions = {
  showTime: false,
  showLocation: false,
  showCoordinates: false,
  showAstrology: false,
  showMoonPhase: false,
  showNakshatra: false,
  showChineseZodiac: false,
  showHekaDate: false,
  showElementalBalance: false,
  showHouseCusps: false,
};

// Which options are locked (not user-toggleable) per template
export type TemplateLocks = Partial<Record<keyof CertificateOptions, boolean>>;

// ── Certificate Template Registry ────────────────────────────────────────────

export interface CertificateTemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  thumbnailGradient: string;
  accentColor: string;
  defaultOptions: CertificateOptions;
  lockedOptions: TemplateLocks;
}

export const CERTIFICATE_TEMPLATES: CertificateTemplateMeta[] = [
  {
    id: 'celestial-gold',
    name: 'Celestial Gold',
    description: 'Ornate gold filigree with zodiac wheel',
    thumbnailGradient: 'linear-gradient(135deg, #1a103c 0%, #2d1b4e 50%, #0f172a 100%)',
    accentColor: '#d4af37',
    defaultOptions: { ...ALL_OPTIONS_ON, showHouseCusps: false },
    lockedOptions: {},
  },
  {
    id: 'sacred-geometry',
    name: 'Sacred Geometry',
    description: 'Flower of Life patterns and geometric harmony',
    thumbnailGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accentColor: '#c9a227',
    defaultOptions: { ...ALL_OPTIONS_ON, showHouseCusps: false },
    lockedOptions: {},
  },
  {
    id: 'minimal-modern',
    name: 'Minimal Modern',
    description: 'Clean lines, generous space, modern elegance',
    thumbnailGradient: 'linear-gradient(135deg, #f5f5f0 0%, #e8e8e0 100%)',
    accentColor: '#1a1a2e',
    defaultOptions: {
      ...ALL_OPTIONS_OFF,
      showTime: true,
      showLocation: true,
      showHekaDate: true,
    },
    lockedOptions: {},
  },
  {
    id: 'ancient-parchment',
    name: 'Ancient Parchment',
    description: 'Aged cream tones with calligraphic flourish',
    thumbnailGradient: 'linear-gradient(135deg, #e8dcc8 0%, #d4c4a8 50%, #c4b090 100%)',
    accentColor: '#8b4513',
    defaultOptions: { ...ALL_OPTIONS_ON, showElementalBalance: false, showHouseCusps: false },
    lockedOptions: {},
  },
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Nebula',
    description: 'Deep space aurora with constellation trails',
    thumbnailGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0f172a 100%)',
    accentColor: '#a78bfa',
    defaultOptions: { ...ALL_OPTIONS_ON, showHouseCusps: false },
    lockedOptions: {},
  },
  {
    id: 'art-deco',
    name: 'Art Deco',
    description: 'Geometric sunbursts in gold and onyx',
    thumbnailGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
    accentColor: '#f4d03f',
    defaultOptions: { ...ALL_OPTIONS_ON, showHouseCusps: false },
    lockedOptions: {},
  },
  {
    id: 'nakshatra-vedic',
    name: 'Nakshatra Vedic',
    description: 'Lotus mandala with chakra color accents',
    thumbnailGradient: 'linear-gradient(135deg, #2d1b00 0%, #4b0082 50%, #1a0a2e 100%)',
    accentColor: '#ff9933',
    defaultOptions: { ...ALL_OPTIONS_ON, showChineseZodiac: false, showHouseCusps: false },
    lockedOptions: { showNakshatra: true },
  },
  {
    id: 'chinese-zodiac',
    name: 'Chinese Zodiac',
    description: 'Traditional animal guardian and elemental essence',
    thumbnailGradient: 'linear-gradient(135deg, #8b0000 0%, #d4af37 50%, #8b0000 100%)',
    accentColor: '#d4af37',
    defaultOptions: {
      ...ALL_OPTIONS_OFF,
      showTime: true,
      showLocation: true,
      showHekaDate: true,
      showChineseZodiac: true,
      showMoonPhase: true,
    },
    lockedOptions: { showChineseZodiac: true },
  },
  {
    id: 'moon-phase',
    name: 'Moon Phase',
    description: 'Exact lunar illumination and celestial coordinates',
    thumbnailGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
    accentColor: '#e8e8e8',
    defaultOptions: {
      ...ALL_OPTIONS_ON,
      showChineseZodiac: false,
      showHouseCusps: false,
    },
    lockedOptions: { showMoonPhase: true },
  },
];

export function getTemplateMeta(id: TemplateId): CertificateTemplateMeta {
  return CERTIFICATE_TEMPLATES.find(t => t.id === id) || CERTIFICATE_TEMPLATES[0];
}

export function getEffectiveOptions(templateId: TemplateId, userOptions: CertificateOptions): CertificateOptions {
  const meta = getTemplateMeta(templateId);
  const result = { ...meta.defaultOptions, ...userOptions };
  // Apply locks
  Object.entries(meta.lockedOptions).forEach(([key, value]) => {
    if (value !== undefined) {
      (result as any)[key] = value;
    }
  });
  return result;
}

// ── Toggle labels for UI ─────────────────────────────────────────────────────

export const OPTION_LABELS: Record<keyof CertificateOptions, { label: string; icon: string }> = {
  showTime: { label: 'Birth Time', icon: '⏰' },
  showLocation: { label: 'Location', icon: '📍' },
  showCoordinates: { label: 'Coordinates', icon: '🌐' },
  showAstrology: { label: 'Astrology (Sun, Moon, Rising)', icon: '✦' },
  showMoonPhase: { label: 'Moon Phase', icon: '🌙' },
  showNakshatra: { label: 'Nakshatra', icon: '☸' },
  showChineseZodiac: { label: 'Chinese Zodiac', icon: '🐉' },
  showHekaDate: { label: 'HEKA Date', icon: '📅' },
  showElementalBalance: { label: 'Elemental Balance', icon: '🔥' },
  showHouseCusps: { label: 'House Cusps', icon: '🏠' },
};

// ── Chinese Zodiac ───────────────────────────────────────────────────────────

const CHINESE_ZODIAC_ANIMALS = [
  { animal: 'Monkey', emoji: '🐒', traits: 'Clever, curious, versatile' },
  { animal: 'Rooster', emoji: '🐓', traits: 'Observant, hardworking, courageous' },
  { animal: 'Dog', emoji: '🐕', traits: 'Loyal, honest, cautious' },
  { animal: 'Pig', emoji: '🐖', traits: 'Compassionate, generous, diligent' },
  { animal: 'Rat', emoji: '🐀', traits: 'Quick-witted, resourceful, adaptable' },
  { animal: 'Ox', emoji: '🐂', traits: 'Diligent, dependable, strong' },
  { animal: 'Tiger', emoji: '🐅', traits: 'Brave, confident, competitive' },
  { animal: 'Rabbit', emoji: '🐇', traits: 'Quiet, elegant, kind' },
  { animal: 'Dragon', emoji: '🐉', traits: 'Confident, intelligent, enthusiastic' },
  { animal: 'Snake', emoji: '🐍', traits: 'Enigmatic, intelligent, wise' },
  { animal: 'Horse', emoji: '🐎', traits: 'Animated, active, energetic' },
  { animal: 'Goat', emoji: '🐐', traits: 'Calm, gentle, sympathetic' },
];

const CHINESE_ELEMENTS = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];

export function getChineseZodiac(birthDate: string): {
  animal: string;
  element: string;
  emoji: string;
  traits: string;
} {
  const year = parseInt(birthDate.split('-')[0], 10);
  const animalIndex = year % 12;
  const elementIndex = year % 10;
  const z = CHINESE_ZODIAC_ANIMALS[animalIndex];
  return {
    animal: z.animal,
    element: CHINESE_ELEMENTS[elementIndex],
    emoji: z.emoji,
    traits: z.traits,
  };
}

// ── Formatting Helpers ───────────────────────────────────────────────────────

function formatDms(degree: number): string {
  const d = Math.floor(degree);
  const mFloat = (degree - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}"`;
}

function formatDateNice(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const lang = i18n.language || 'en';
  return new Intl.DateTimeFormat(lang, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// ── HEKA Date formatting ─────────────────────────────────────────────────────

export function formatHekaDate(hekaDate: string | undefined): string | null {
  if (!hekaDate) return null;
  const [y, m, d] = hekaDate.split('-').map(Number);
  if (!y || !m || !d) return null;
  const monthName = i18n.t(`calendar:months.${m - 1}`, { lng: i18n.language || 'en' });
  return `${monthName} ${d}, ${y}`;
}

// ── Astrological Enrichment ──────────────────────────────────────────────────

export async function enrichCertificateData(
  raw: Omit<CertificateData, keyof CertificateData> & Partial<CertificateData>
): Promise<CertificateData> {
  const birthData: AstroBirthData = {
    name: raw.name || 'Unknown',
    birthDate: raw.birthDate || '',
    birthTime: raw.birthTime || '',
    location: {
      latitude: raw.latitude || 0,
      longitude: raw.longitude || 0,
      locationName: raw.locationName || '',
    },
    timezone: raw.timezone || 'UTC',
  };

  let sunSign = 'Unknown';
  let sunSignSymbol = '☉';
  let sunDegree = '--';
  let moonSign = 'Unknown';
  let moonSignSymbol = '☽';
  let moonDegree = '--';
  let risingSign = 'Unknown';
  let risingSignSymbol = '↑';
  let risingDegree = '--';
  let moonPhase = 'Unknown';
  let moonIllumination = 0;
  let moonPhaseEmoji = '🌑';
  let nakshatra: string | undefined;
  let nakshatraSymbol: string | undefined;
  let houseCusps: CertificateData['houseCusps'] = undefined;
  let elementalBalance: CertificateData['elementalBalance'] = undefined;

  try {
    const chart = await generateNatalChart({
      birthData,
      profileId: 'certificate',
      zodiacFrame: 'tropical',
      signCount: 12,
      houseSystem: 'placidus',
      zodiacSystem: '12-sign',
    });

    if (chart && chart.bodies) {
      const bodies = chart.bodies;
      const use13 = chart.signCount === 13;
      const signSymbols = use13 ? SIGN_SYMBOLS_13 : SIGN_SYMBOLS;

      if (bodies.sun) {
        const s = bodies.sun.sign as ZodiacSign;
        sunSign = String(s).charAt(0).toUpperCase() + String(s).slice(1);
        sunSignSymbol = signSymbols[s] || '☉';
        sunDegree = formatDms(bodies.sun.degreeInSign || 0);
      }

      if (bodies.moon) {
        const s = bodies.moon.sign as ZodiacSign;
        moonSign = String(s).charAt(0).toUpperCase() + String(s).slice(1);
        moonSignSymbol = signSymbols[s] || '☽';
        moonDegree = formatDms(bodies.moon.degreeInSign || 0);
      }

      if (chart.houses && chart.houses.ascendant !== undefined) {
        const asc = chart.houses.ascendant;
        const ascSign = getSignFromLongitude(asc as any, use13) as ZodiacSign;
        risingSign = String(ascSign).charAt(0).toUpperCase() + String(ascSign).slice(1);
        risingSignSymbol = signSymbols[ascSign] || '↑';
        risingDegree = formatDms((asc % 30 + 30) % 30);
      }

      if (bodies.sun && bodies.moon) {
        const phase = calculatePreciseMoonPhase(bodies.sun, bodies.moon);
        moonPhase = phase.name;
        moonIllumination = Math.round(phase.illumination);
        moonPhaseEmoji = phase.emoji;
      }

      try {
        const mansions = calculateMansionsForJD(chart.julianDay, ['moon']);
        if (mansions.length > 0) {
          const m = mansions[0];
          nakshatra = m.mansion.universalName;
          nakshatraSymbol = m.mansion.symbol;
        }
      } catch {
        // optional
      }

      if (chart.houses && chart.houses.cusps) {
        houseCusps = chart.houses.cusps.slice(0, 4).map((cusp: any, idx: number) => {
          const lon = typeof cusp === 'number' ? cusp : cusp.longitude;
          const sign = getSignFromLongitude(lon as any, use13) as ZodiacSign;
          return {
            house: idx + 1,
            sign: String(sign).charAt(0).toUpperCase() + String(sign).slice(1),
            signSymbol: signSymbols[sign] || '',
            degree: formatDms((lon % 30 + 30) % 30),
          };
        });
      }

      const els = { fire: 0, earth: 0, air: 0, water: 0, ether: 0 };
      Object.values(bodies).forEach((body: any) => {
        if (!body || !body.sign) return;
        const sign = String(body.sign).toLowerCase();
        if (['aries', 'leo', 'sagittarius'].includes(sign)) els.fire++;
        else if (['taurus', 'virgo', 'capricorn'].includes(sign)) els.earth++;
        else if (['gemini', 'libra', 'aquarius'].includes(sign)) els.air++;
        else if (['cancer', 'scorpio', 'pisces'].includes(sign)) els.water++;
      });
      elementalBalance = els;
    }
  } catch (err) {
    console.error('[Certificate] Chart enrichment failed:', err);
  }

  let hekaDate: string | undefined;
  try {
    const bd = raw.birthDate || '';
    const [y, m, d] = bd.split('-').map(Number);
    const civil = new Date(y, m - 1, d);
    const heka = civilToHeka(civil);
    if (heka) {
      hekaDate = `${heka.year}-${String(heka.month + 1).padStart(2, '0')}-${String(heka.day).padStart(2, '0')}`;
    }
  } catch {
    // optional
  }

  const cz = getChineseZodiac(raw.birthDate || '');

  return {
    name: raw.name || 'Unknown',
    birthDate: raw.birthDate || '',
    birthTime: raw.birthTime || '',
    locationName: raw.locationName || 'Unknown',
    latitude: raw.latitude || 0,
    longitude: raw.longitude || 0,
    timezone: raw.timezone || 'UTC',
    sunSign, sunSignSymbol, sunDegree,
    moonSign, moonSignSymbol, moonDegree,
    risingSign, risingSignSymbol, risingDegree,
    moonPhase, moonIllumination, moonPhaseEmoji,
    nakshatra, nakshatraSymbol,
    houseCusps,
    elementalBalance,
    hekaDate,
    civilDateFormatted: formatDateNice(raw.birthDate || ''),
    chineseZodiacAnimal: cz.animal,
    chineseZodiacElement: cz.element,
    chineseZodiacEmoji: cz.emoji,
  };
}

export function createEmptyCertificateData(): CertificateData {
  return {
    name: '',
    birthDate: '',
    birthTime: '',
    locationName: '',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC',
    sunSign: 'Unknown',
    sunSignSymbol: '☉',
    sunDegree: '--',
    moonSign: 'Unknown',
    moonSignSymbol: '☽',
    moonDegree: '--',
    risingSign: 'Unknown',
    risingSignSymbol: '↑',
    risingDegree: '--',
    moonPhase: 'Unknown',
    moonIllumination: 0,
    moonPhaseEmoji: '🌑',
  };
}
