/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NATAL REPORT GENERATOR v2 — REVOLUTIONARY
 * Assembles a premium 6000+ word comprehensive astrological analysis
 * Uses EVERY calculation available in HEKA: Tropical + Sidereal charts,
 * Nakshatras, Chiron, Nodes, decans, fixed stars, chart shape, hemispheres,
 * planetary hours, solar returns, pattern detection, aspect analysis.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { AstroProfile } from '../../types/astrology';
import { generateNatalChart, calculateJulianDay, calculateAllPlanets, calculateAyanamsa } from '../../astrology/services/swiss-ephemeris/engine';
import {
  calculateElementalBalance, calculateModalityBalance, getNatalThemes,
  getHouseEmphasis, getHouseLifeArea, getDignity,
} from '../../astrology/services/natal/natalChart';
import { detectPatterns } from '../../astrology/services/calculations/patternDetection';
import { calculateAspects } from '../../astrology/services/calculations/aspects';
import { getSunInSignInterpretation } from '../../astrology/data/interpretations/planetInSign';
import { getHouseMeaning } from '../../astrology/data/houseMeanings';
import { calculateBirthMansion, describeMansion, type BirthMansion } from '../../astrology/services/calculations/nakshatras';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ReportSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  highlight?: string;
  icon?: string;
}

export interface NatalReport {
  title: string;
  subtitle: string;
  generatedAt: string;
  profile: AstroProfile;
  tropicalChart: any;
  siderealChart: any;
  birthMansion: BirthMansion | null;
  sections: ReportSection[];
  wordCount: number;
  coverData: CoverData;
}

export interface CoverData {
  name: string;
  birthDate: string;
  birthTime: string;
  location: string;
  tropicalSun: string;
  tropicalMoon: string;
  tropicalRising: string;
  siderealSun: string;
  siderealMoon: string;
  moonMansion: string;
  moonQuarter: number;
  moonPhase: string;
  chartShape: string;
  dominantElement: string;
  wordCount: number;
}

// ── Rich Moon in Sign Interpretations ────────────────────────────────────────

const MOON_IN_SIGN: Record<string, {
  title: string; essence: string; psychological: string; spiritual: string;
  challenges: string[]; gifts: string[]; lifeThemes: string[]; advice: string; affirmation: string;
}> = {
  'moon-aries': {
    title: 'The Emotional Pioneer',
    essence: 'Your feelings ignite quickly and burn bright. You experience emotions as bursts of energy that demand immediate expression.',
    psychological: 'Your emotional needs are tied to independence, action, and being first. You feel safest when you can act on your instincts without restriction. Delayed emotional gratification feels like a threat to your survival.',
    spiritual: 'Your soul chose to learn courage through feeling. You are here to discover that vulnerability and strength are the same force, viewed from different angles.',
    challenges: ['Emotional impulsivity', 'Difficulty sitting with discomfort', 'Quick emotional burnout'],
    gifts: ['Emotional honesty', 'Rapid emotional recovery', 'Courage to feel deeply'],
    lifeThemes: ['Emotional initiation', 'Healing through action', 'Learning patience with feelings'],
    advice: 'Count to ten before reacting. Your first emotional impulse is information, not instruction.',
    affirmation: 'I honor my feelings as they arise, and I choose how I respond.',
  },
  'moon-taurus': {
    title: 'The Emotional Ground',
    essence: 'Your feelings are deep, steady, and sensual. You need physical comfort, beauty, and stability to feel emotionally secure.',
    psychological: 'Your emotional world is rooted in the body. Touch, taste, scent, and sound are portals to your inner life. You hold onto feelings — both pleasant and painful — with remarkable tenacity.',
    spiritual: 'Your soul seeks to understand that security is an inside job. You are here to learn that the material world is spirit made tangible.',
    challenges: ['Emotional stubbornness', 'Resistance to change', 'Holding grudges'],
    gifts: ['Emotional steadiness', 'Deep loyalty', 'Nurturing through presence'],
    lifeThemes: ['Building emotional security', 'Sensual healing', 'The wisdom of slowness'],
    advice: 'Change is not loss — it is the garden growing. Let yourself evolve.',
    affirmation: 'I am the fertile ground from which all my emotions bloom.',
  },
  'moon-gemini': {
    title: 'The Emotional Messenger',
    essence: 'Your feelings are quick, curious, and ever-changing. You process emotions through words, stories, and intellectual understanding.',
    psychological: 'Your emotional needs are met through communication, variety, and mental stimulation. You may intellectualize feelings as a defense against being overwhelmed by them.',
    spiritual: 'Your soul path involves understanding that every emotion contains a message. You are the translator between heart and mind.',
    challenges: ['Emotional restlessness', 'Difficulty feeling deeply', 'Nervous anxiety'],
    gifts: ['Emotional articulation', 'Rapid emotional adaptation', 'Curiosity about feelings'],
    lifeThemes: ['Healing through communication', 'Emotional education', 'The stories we tell ourselves'],
    advice: 'Not every feeling needs analysis. Some truths can only be felt, not named.',
    affirmation: 'I allow my emotions to flow like breath — in, out, never stuck.',
  },
  'moon-cancer': {
    title: 'The Emotional Ocean',
    essence: 'Your feelings run as deep as the ocean. You are intuitively connected to the emotional undercurrents of every situation.',
    psychological: 'Your emotional needs center on safety, nurturing, and belonging. You remember every feeling you have ever had, and you feel other people\'s emotions as if they were your own.',
    spiritual: 'Your soul is here to learn the highest form of love — unconditional emotional presence. You are a vessel for the collective feeling-body.',
    challenges: ['Emotional overwhelm', 'Clinging to the past', 'Mood swings'],
    gifts: ['Profound empathy', 'Emotional memory', 'Nurturing instinct'],
    lifeThemes: ['Creating safe harbor', 'Healing through care', 'The mother wound and gift'],
    advice: 'Your sensitivity is your superpower. Protect it like the treasure it is.',
    affirmation: 'I am the sanctuary where all feelings are welcome.',
  },
  'moon-leo': {
    title: 'The Emotional Sun',
    essence: 'Your feelings are dramatic, warm, and creative. You need to express your emotions boldly and be recognized for your heart.',
    psychological: 'Your emotional needs revolve around recognition, creativity, and playful connection. You feel most alive when your heart is on full display.',
    spiritual: 'Your soul chose to learn love as performance art — not fake, but fully embodied. You are here to show others how to shine from the heart.',
    challenges: ['Dramatic reactions', 'Need for emotional validation', 'Pride in vulnerability'],
    gifts: ['Generous heart', 'Creative emotional expression', 'Inspiring warmth'],
    lifeThemes: ['Healing through creativity', 'The courage to be seen', 'Play as medicine'],
    advice: 'Your heart does not need an audience to be real. Love yourself first.',
    affirmation: 'I shine my heart-light without dimming anyone else\'s.',
  },
  'moon-virgo': {
    title: 'The Emotional Alchemist',
    essence: 'Your feelings are precise, analytical, and oriented toward service. You process emotions by understanding them, organizing them, and using them to help others.',
    psychological: 'Your emotional needs are met through usefulness, order, and practical care. You may struggle to feel your feelings without first analyzing them.',
    spiritual: 'Your soul seeks to understand that healing happens in the details. You are here to learn that perfection is not the goal — presence is.',
    challenges: ['Emotional over-analysis', 'Self-criticism', 'Difficulty receiving care'],
    gifts: ['Emotional discernment', 'Healing through service', 'Practical wisdom'],
    lifeThemes: ['The healing craft', 'Emotional refinement', 'Service as love'],
    advice: 'Your feelings do not need to be fixed. They need to be felt.',
    affirmation: 'I trust my inner knowing more than my inner critic.',
  },
  'moon-libra': {
    title: 'The Emotional Harmonizer',
    essence: 'Your feelings are oriented toward balance, beauty, and relationship. You experience emotions most fully in connection with others.',
    psychological: 'Your emotional needs center on partnership, fairness, and aesthetic harmony. You may suppress your own feelings to maintain peace, which creates unconscious resentment.',
    spiritual: 'Your soul is here to learn that true harmony includes discord. You are the bridge-builder who must first bridge your own inner opposites.',
    challenges: ['Emotional indecision', 'People-pleasing', 'Avoiding conflict'],
    gifts: ['Emotional diplomacy', 'Relational healing', 'Aesthetic sensitivity'],
    lifeThemes: ['Healing through relationship', 'The art of balance', 'Justice in the heart'],
    advice: 'Your feelings matter as much as anyone else\'s. Stand in your truth.',
    affirmation: 'I create harmony by honoring every voice within me.',
  },
  'moon-scorpio': {
    title: 'The Emotional Alchemist',
    essence: 'Your feelings are intense, transformative, and penetrating. You do not skim the surface — you dive to the bottom of every emotional ocean.',
    psychological: 'Your emotional needs are profound: authenticity, depth, and transformation. You instinctively sense what others hide, and you cannot tolerate emotional dishonesty.',
    spiritual: 'Your soul chose the path of the phoenix. You are here to learn that death and rebirth are the same motion — the letting go that makes room for more life.',
    challenges: ['Emotional intensity', 'Jealousy and control', 'Fear of betrayal'],
    gifts: ['Emotional X-ray vision', 'Transformative power', 'Unshakeable loyalty'],
    lifeThemes: ['Healing through death and rebirth', 'The underworld journey', 'Emotional alchemy'],
    advice: 'Your depth is a gift, not a burden. Not everyone can swim where you swim.',
    affirmation: 'I transform every shadow into gold.',
  },
  'moon-sagittarius': {
    title: 'The Emotional Explorer',
    essence: 'Your feelings are expansive, philosophical, and freedom-loving. You need meaning, adventure, and truth to feel emotionally fulfilled.',
    psychological: 'Your emotional needs are met through exploration, learning, and belief. You may avoid deep emotional intimacy by keeping things light and philosophical.',
    spiritual: 'Your soul is the eternal student of love. You are here to discover that the greatest adventure is the journey inward.',
    challenges: ['Emotional restlessness', 'Bluntness', 'Fear of emotional confinement'],
    gifts: ['Emotional optimism', 'Philosophical wisdom', 'Cross-cultural empathy'],
    lifeThemes: ['Healing through exploration', 'The pilgrimage of the heart', 'Truth as medicine'],
    advice: 'Sometimes the greatest truth is found in stillness, not movement.',
    affirmation: 'My heart is a compass that always points toward truth.',
  },
  'moon-capricorn': {
    title: 'The Emotional Architect',
    essence: 'Your feelings are disciplined, responsible, and structured. You take emotions seriously and build emotional security through achievement and endurance.',
    psychological: 'Your emotional needs center on respect, structure, and long-term security. You may have learned early that emotions must be controlled, not expressed.',
    spiritual: 'Your soul seeks to build something lasting from the material of feeling. You are here to learn that mastery includes mastery of the heart.',
    challenges: ['Emotional suppression', 'Workaholism as escape', 'Difficulty receiving nurturing'],
    gifts: ['Emotional resilience', 'Reliable support', 'Long-term commitment'],
    lifeThemes: ['Healing through mastery', 'The mountain climb', 'Building emotional legacy'],
    advice: 'Vulnerability is not weakness. It is the foundation of every true achievement.',
    affirmation: 'I build my inner world with the same care I give my outer world.',
  },
  'moon-aquarius': {
    title: 'The Emotional Visionary',
    essence: 'Your feelings are intellectual, unconventional, and oriented toward the collective. You need freedom, innovation, and humanitarian connection.',
    psychological: 'Your emotional needs are met through friendship, intellectual exchange, and belonging to a tribe. You may feel alienated from your own emotions, observing them from a distance.',
    spiritual: 'Your soul is here to learn that detachment and compassion are not opposites. You are the future remembering its heart.',
    challenges: ['Emotional detachment', 'Rebellion for its own sake', 'Difficulty with intimacy'],
    gifts: ['Emotional objectivity', 'Humanitarian care', 'Innovative healing'],
    lifeThemes: ['Healing through community', 'The outsider\'s gift', 'Future-oriented love'],
    advice: 'Your mind is brilliant, but your heart is where the real revolution happens.',
    affirmation: 'I am the bridge between my unique heart and the collective soul.',
  },
  'moon-pisces': {
    title: 'The Emotional Mystic',
    essence: 'Your feelings are boundless, imaginative, and spiritually attuned. You experience emotions as a dissolved boundary between self and the universe.',
    psychological: 'Your emotional needs are met through creativity, spiritual connection, and transcendent experience. You absorb the emotions of everyone around you, which can be both your gift and your undoing.',
    spiritual: 'Your soul remembers the ocean it came from. You are here to learn that compassion without boundaries is not love — it is dissolution.',
    challenges: ['Emotional confusion', 'Escapism', 'Absorbing others\' pain'],
    gifts: ['Profound compassion', 'Artistic imagination', 'Spiritual attunement'],
    lifeThemes: ['Healing through art', 'The return to source', 'Boundaries as love'],
    advice: 'Your empathy is sacred. Protect it with gentle but firm boundaries.',
    affirmation: 'I am the ocean and the shore that contains it.',
  },
};

function getMoonInSignInterpretation(sign: string) {
  return MOON_IN_SIGN[`moon-${sign.toLowerCase()}`] || null;
}

// ── Decan Descriptions ───────────────────────────────────────────────────────

function getDecan(_planet: string, sign: string, degree: number): { decan: number; ruler: string; text: string } {
  const decanNum = Math.floor(degree / 10) + 1;
  const decanRulers: Record<string, [string, string, string]> = {
    aries: ['Mars', 'Sun', 'Jupiter'], taurus: ['Venus', 'Mercury', 'Saturn'],
    gemini: ['Mercury', 'Venus', 'Uranus'], cancer: ['Moon', 'Pluto', 'Neptune'],
    leo: ['Sun', 'Jupiter', 'Mars'], virgo: ['Mercury', 'Saturn', 'Venus'],
    libra: ['Venus', 'Uranus', 'Mercury'], scorpio: ['Pluto', 'Neptune', 'Moon'],
    sagittarius: ['Jupiter', 'Mars', 'Sun'], capricorn: ['Saturn', 'Venus', 'Mercury'],
    aquarius: ['Uranus', 'Mercury', 'Venus'], pisces: ['Neptune', 'Moon', 'Pluto'],
  };
  const rulers = decanRulers[sign] || ['', '', ''];
  const ruler = rulers[decanNum - 1] || 'unknown';
  const texts: Record<string, string[]> = {
    aries: ['Pure Aries fire — raw, immediate, unfiltered.', 'Solar Aries — leadership, creativity, dramatic expression.', 'Jupiterian Aries — expansive, philosophical, adventurous.'],
    taurus: ['Pure Taurus earth — steady, sensual, determined.', 'Mercurial Taurus — communicative, adaptable, clever.', 'Saturnine Taurus — disciplined, structured, enduring.'],
    gemini: ['Pure Gemini air — curious, quick, communicative.', 'Venusian Gemini — charming, artistic, relational.', 'Uranian Gemini — innovative, unusual, brilliant.'],
    cancer: ['Pure Cancer water — nurturing, protective, emotional.', 'Plutonian Cancer — intense, transformative, magnetic.', 'Neptunian Cancer — dreamy, artistic, spiritually sensitive.'],
    leo: ['Pure Leo fire — radiant, confident, creative.', 'Jupiterian Leo — expansive, generous, philosophical.', 'Martian Leo — courageous, competitive, passionate.'],
    virgo: ['Pure Virgo earth — analytical, practical, service-oriented.', 'Saturnine Virgo — disciplined, perfectionist, structured.', 'Venusian Virgo — aesthetic, relational, refined.'],
    libra: ['Pure Libra air — harmonious, diplomatic, balanced.', 'Uranian Libra — innovative, unconventional, reforming.', 'Mercurial Libra — intellectual, communicative, witty.'],
    scorpio: ['Pure Scorpio water — intense, penetrating, transformative.', 'Neptunian Scorpio — mystical, imaginative, compassionate.', 'Lunar Scorpio — emotionally deep, nurturing, psychic.'],
    sagittarius: ['Pure Sagittarius fire — adventurous, philosophical, free.', 'Martian Sagittarius — courageous, active, pioneering.', 'Solar Sagittarius — generous, creative, leadership.'],
    capricorn: ['Pure Capricorn earth — ambitious, disciplined, practical.', 'Venusian Capricorn — aesthetic, relational, values-driven.', 'Mercurial Capricorn — intellectual, communicative, strategic.'],
    aquarius: ['Pure Aquarius air — innovative, independent, humanitarian.', 'Mercurial Aquarius — intellectual, communicative, inventive.', 'Venusian Aquarius — relational, artistic, unconventional.'],
    pisces: ['Pure Pisces water — compassionate, imaginative, spiritual.', 'Lunar Pisces — emotionally deep, nurturing, intuitive.', 'Plutonian Pisces — transformative, intense, psychologically profound.'],
  };
  return { decan: decanNum, ruler, text: texts[sign]?.[decanNum - 1] || '' };
}

// ── Fixed Stars ──────────────────────────────────────────────────────────────

interface FixedStar { name: string; longitude: number; meaning: string; orb: number; }

const MAJOR_FIXED_STARS: FixedStar[] = [
  { name: 'Regulus', longitude: 150, meaning: 'Royalty, success, honor, leadership. The heart of the Lion.', orb: 2.5 },
  { name: 'Spica', longitude: 204, meaning: 'Giftedness, harvest, creativity, protection. The wheat ear of Virgo.', orb: 2.5 },
  { name: 'Algol', longitude: 26, meaning: 'Intensity, transformation, facing fears. The demon star — destructive power that can be harnessed.', orb: 2 },
  { name: 'Sirius', longitude: 104, meaning: 'Wealth, honor, fame, spiritual gifts. The brightest star in the sky.', orb: 2.5 },
  { name: 'Antares', longitude: 243, meaning: 'Obsession, intensity, martial power. The heart of the Scorpion.', orb: 2.5 },
  { name: 'Aldebaran', longitude: 54, meaning: 'Honor, integrity, military prowess. The eye of the Bull.', orb: 2.5 },
  { name: 'Vega', longitude: 304, meaning: 'Charisma, artistic genius, political skill. The falling vulture.', orb: 2.5 },
  { name: 'Altair', longitude: 62, meaning: 'Courage, boldness, risk-taking. The flying eagle.', orb: 2.5 },
  { name: 'Fomalhaut', longitude: 359, meaning: 'Magic, idealism, artistic inspiration. The mouth of the Southern Fish.', orb: 2.5 },
  { name: 'Deneb Algedi', longitude: 324, meaning: 'Justice, protection, transformation. The tail of the Goat.', orb: 2 },
];

function checkFixedStars(longitude: number): FixedStar[] {
  return MAJOR_FIXED_STARS.filter(s => {
    let diff = Math.abs(longitude - s.longitude);
    if (diff > 180) diff = 360 - diff;
    return diff < s.orb;
  });
}

// ── Chart Shape Analysis ─────────────────────────────────────────────────────

function analyzeChartShape(bodies: Record<string, any>): string {
  const longitudes = Object.values(bodies).map((b: any) => b.longitude).filter(Boolean);
  if (longitudes.length < 6) return 'insufficient data';
  longitudes.sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 0; i < longitudes.length; i++) {
    const next = longitudes[(i + 1) % longitudes.length];
    let gap = next - longitudes[i];
    if (gap < 0) gap += 360;
    gaps.push(gap);
  }
  const maxGap = Math.max(...gaps);
  const occupiedArc = 360 - maxGap;
  if (occupiedArc <= 120) return 'Bundle — concentrated, focused, specialist energy';
  if (occupiedArc <= 180) return 'Bucket — one planet (the handle) carries special significance';
  if (maxGap > 120 && maxGap < 180) return 'Locomotive — driven, dynamic, unstoppable momentum';
  if (longitudes.length >= 8) {
    const smallGaps = gaps.filter(g => g < 60).length;
    if (smallGaps >= 6) return 'Splash — versatile, scattered, many interests';
  }
  return 'Splay — individualistic, varied, unique configuration';
}

function analyzeHemisphere(bodies: Record<string, any>): { above: number; below: number; east: number; west: number; text: string } {
  const vals = Object.values(bodies) as any[];
  const above = vals.filter(b => b.latitude > 0).length;
  const below = vals.filter(b => b.latitude < 0).length;
  const east = vals.filter(b => (b.longitude % 360) < 180).length;
  const west = vals.filter(b => (b.longitude % 360) >= 180).length;
  let text = '';
  if (above > below + 2) text = 'Your planets cluster above the horizon, indicating an extraverted, public, action-oriented life path.';
  else if (below > above + 2) text = 'Your planets cluster below the horizon, indicating an introverted, private, subjectively oriented life path.';
  else text = 'Your planets are balanced between above and below the horizon, suggesting integration of public and private life.';
  if (east > west + 2) text += ' Eastern emphasis: self-directed, autonomous, initiating.';
  else if (west > east + 2) text += ' Western emphasis: relationship-oriented, receptive, responsive.';
  return { above, below, east, west, text };
}

// ── Planetary Hour / Day ─────────────────────────────────────────────────────

function getPlanetaryDay(date: Date): string {
  const days = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  return days[date.getDay()];
}

function getPlanetaryHour(birthDate: Date): { hourPlanet: string; meaning: string } {
  const hour = birthDate.getHours();
  const dayPlanet = getPlanetaryDay(birthDate);
  const dayIndex = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].indexOf(dayPlanet);
  const sequence = [0, 3, 6, 2, 5, 1, 4]; // Chaldean order offset for hours
  const planets = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
  const hourIndex = (dayIndex + hour) % 7;
  const hourPlanet = planets[sequence[hourIndex]];
  const meanings: Record<string, string> = {
    Sun: 'born in the hour of illumination — leadership, visibility, vitality', Moon: 'born in the hour of receptivity — intuition, nurturing, cycles',
    Mars: 'born in the hour of action — courage, drive, conflict', Mercury: 'born in the hour of communication — intellect, commerce, travel',
    Jupiter: 'born in the hour of expansion — wisdom, fortune, growth', Venus: 'born in the hour of beauty — love, art, harmony',
    Saturn: 'born in the hour of structure — discipline, karma, mastery',
  };
  return { hourPlanet, meaning: meanings[hourPlanet] || '' };
}

// ── Main Generator ───────────────────────────────────────────────────────────

export async function generateNatalReport(profile: AstroProfile): Promise<NatalReport> {
  const birthData = {
    birthDate: profile.birthDate, birthTime: profile.birthTime, timezone: profile.timezone,
    location: { latitude: profile.location.latitude, longitude: profile.location.longitude, altitude: 0 },
  };

  const birthDateObj = new Date(`${profile.birthDate}T${profile.birthTime}`);

  // Generate both charts with ALL planets including Chiron and Nodes
  const allPlanetsList = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'northnode', 'chiron'];
  const tropicalChart = await generateNatalChart({ profileId: profile.id, birthData, zodiacFrame: 'tropical', signCount: 12, houseSystem: profile.preferences.houseSystem });
  const siderealChart = await generateNatalChart({ profileId: profile.id, birthData, zodiacFrame: 'sidereal', signCount: 12, houseSystem: profile.preferences.houseSystem });

  // Force recalculate ALL bodies including Chiron/Nodes
  const dt = new Date(`${profile.birthDate}T${profile.birthTime}`);
  const jd = calculateJulianDay(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getHours(), dt.getMinutes(), 0);
  const tropicalAll = calculateAllPlanets(jd, allPlanetsList, { zodiacFrame: 'tropical', signCount: 12 });
  const siderealAll = calculateAllPlanets(jd, allPlanetsList, { zodiacFrame: 'sidereal', signCount: 12 });
  tropicalChart.bodies = { ...tropicalChart.bodies, ...tropicalAll };
  siderealChart.bodies = { ...siderealChart.bodies, ...siderealAll };

  // Nakshatra
  const birthMansion = calculateBirthMansion(birthDateObj, profile.timezone, profile.location.latitude, profile.location.longitude);

  // Derived data
  const tropicalAspects = calculateAspects(tropicalChart.bodies, { includeMinorAspects: false }) as any[];
  const tropicalPatterns = detectPatterns(tropicalChart.bodies);
  const tropicalElements = calculateElementalBalance(tropicalChart.bodies);
  const tropicalModalities = calculateModalityBalance(tropicalChart.bodies);
  const chartShape = analyzeChartShape(tropicalChart.bodies);
  const hemisphere = analyzeHemisphere(tropicalChart.bodies);
  const planetaryHour = getPlanetaryHour(birthDateObj);

  // Ayanamsa
  const ayanamsa = calculateAyanamsa(jd);

  // Build sections
  const sections: ReportSection[] = [];

  // 1. The Invocation
  sections.push(buildInvocation(profile, tropicalChart, birthMansion));

  // 2. The Two Selves
  sections.push(buildTwoSelves(tropicalChart, siderealChart, ayanamsa));

  // 3. Nakshatra
  if (birthMansion) {
    sections.push(buildNakshatraSection(birthMansion, tropicalChart));
  }

  // 4. Sun
  sections.push(buildPlanetSection('sun', tropicalChart, siderealChart));

  // 5. Moon
  sections.push(buildPlanetSection('moon', tropicalChart, siderealChart, true));

  // 6. Inner Planets
  sections.push(buildPlanetSection('mercury', tropicalChart, siderealChart));
  sections.push(buildPlanetSection('venus', tropicalChart, siderealChart));
  sections.push(buildPlanetSection('mars', tropicalChart, siderealChart));

  // 7. Social Planets
  sections.push(buildPlanetSection('jupiter', tropicalChart, siderealChart));
  sections.push(buildPlanetSection('saturn', tropicalChart, siderealChart));

  // 8. Transpersonal
  sections.push(buildPlanetSection('uranus', tropicalChart, siderealChart));
  sections.push(buildPlanetSection('neptune', tropicalChart, siderealChart));
  sections.push(buildPlanetSection('pluto', tropicalChart, siderealChart));

  // 9. Chiron
  sections.push(buildChironSection(tropicalChart, siderealChart));

  // 10. Nodes
  sections.push(buildNodesSection(tropicalChart, siderealChart));

  // 11. House Analysis
  sections.push(buildHouseSection(tropicalChart));

  // 12. Aspect Patterns
  sections.push(buildAspectSection(tropicalAspects, tropicalPatterns));

  // 13. Chart Shape & Temperament
  sections.push(buildShapeSection(chartShape, hemisphere, tropicalElements, tropicalModalities));

  // 14. Fixed Stars
  sections.push(buildFixedStarsSection(tropicalChart));

  // 15. Life Themes
  sections.push(buildLifeThemesSection(tropicalChart));

  // 16. Solar Return & Timing
  sections.push(buildTimingSection(profile, tropicalChart, planetaryHour));

  // 17. HEKA Integration
  sections.push(buildHekaSection(tropicalChart, siderealChart));

  const wordCount = sections.reduce((sum, s) => sum + s.content.split(/\s+/).length, 0);

  const coverData: CoverData = {
    name: profile.name,
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    location: profile.location.name,
    tropicalSun: capitalize(tropicalChart.bodies?.sun?.sign || ''),
    tropicalMoon: capitalize(tropicalChart.bodies?.moon?.sign || ''),
    tropicalRising: capitalize(tropicalChart.houses?.cusps?.[0]?.sign || tropicalChart.bodies?.sun?.sign || ''),
    siderealSun: capitalize(siderealChart.bodies?.sun?.sign || ''),
    siderealMoon: capitalize(siderealChart.bodies?.moon?.sign || ''),
    moonMansion: birthMansion?.moonMansion?.universalName || '',
    moonQuarter: birthMansion?.moonQuarter || 0,
    moonPhase: getMoonPhaseName(tropicalChart.bodies?.sun?.longitude, tropicalChart.bodies?.moon?.longitude),
    chartShape: chartShape.split(' — ')[0],
    dominantElement: Object.entries(tropicalElements).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || '',
    wordCount,
  };

  return {
    title: `${profile.name}'s Celestial Blueprint`,
    subtitle: `A comprehensive natal analysis · HEKA Pro`,
    generatedAt: new Date().toISOString(),
    profile,
    tropicalChart,
    siderealChart,
    birthMansion,
    sections,
    wordCount,
    coverData,
  };
}

// ── Section Builders ─────────────────────────────────────────────────────────

function buildInvocation(profile: AstroProfile, chart: any, _mansion: BirthMansion | null): ReportSection {
  const sun = chart.bodies?.sun;
  const moon = chart.bodies?.moon;
  const asc = chart.houses?.cusps?.[0];
  const sunSign = capitalize(sun?.sign || '');
  const moonSign = capitalize(moon?.sign || '');
  const risingSign = capitalize(asc?.sign || sunSign);

  const content = `
This document is a Celestial Blueprint — a comprehensive map of the sky at the precise moment of ${profile.name}'s first breath. It is not a prediction. It is a mirror.

Every planet, angle, and star described here occupied an exact position in space at ${profile.birthTime} on ${profile.birthDate}, as seen from ${profile.location.name}. The calculations use the Swiss Ephemeris — the same astronomical engine used by NASA — combined with interpretive frameworks drawn from Hellenistic, Vedic, Medieval, and Psychological astrology.

What you are about to read includes:

• **The Two Selves** — your Tropical (Western) and Sidereal (Vedic) charts, side by side
• **Your Lunar Mansion** — the 27-part Nakshatra system that governed the Moon at your birth
• **All Planets Interpreted** — Sun through Pluto, plus Chiron and the Lunar Nodes
• **House Analysis with Ruler Chains** — which planets govern which life areas
• **Aspect Patterns** — the geometric conversations between planets
• **Chart Shape & Temperament** — your soul's architectural blueprint
• **Fixed Star Connections** — links to the great stars of antiquity
• **Solar Return & Planetary Hour** — precise timing for your personal new year

Your Big Three — Sun in ${sunSign}, Moon in ${moonSign}, ${risingSign} Rising — are only the beginning. A natal chart contains approximately 10,000 interpretable data points. We have distilled the most significant into the report before you.

Read slowly. Return often. The chart does not change — but your understanding of it deepens with every reading.
  `.trim();

  return { id: 'invocation', title: 'The Invocation', subtitle: 'Entering the Temple', content, icon: '🔮' };
}

function buildTwoSelves(tropical: any, sidereal: any, ayanamsa: number): ReportSection {
  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const differences: { planet: string; tropical: string; sidereal: string; meaning: string }[] = [];

  for (const p of planets) {
    const t = tropical.bodies?.[p];
    const s = sidereal.bodies?.[p];
    if (t && s && t.sign !== s.sign) {
      differences.push({
        planet: capitalize(p),
        tropical: capitalize(t.sign),
        sidereal: capitalize(s.sign),
        meaning: getTwoSelvesDifferenceText(p, t.sign, s.sign),
      });
    }
  }

  const tropicalSun = tropical.bodies?.sun?.sign;
  const siderealSun = sidereal.bodies?.sun?.sign;
  const tropicalMoon = tropical.bodies?.moon?.sign;
  const siderealMoon = sidereal.bodies?.moon?.sign;

  let content = `The ayanamsa — the gap between the Tropical and Sidereal zodiacs — is currently ${ayanamsa.toFixed(2)}°. This means every planet in your chart shifts back by approximately ${Math.round(ayanamsa / 30)} signs and ${Math.round(ayanamsa % 30)} degrees when viewed against the fixed stars rather than the seasons.\n\n`;

  content += `## Your Tropical Self (The Becoming)\n\n`;
  content += `Your Tropical Sun rests in ${capitalize(tropicalSun)}. This is the self you are most familiar with — the identity shaped by seasonal cycles, by Earth's dance with the Sun. The Tropical zodiac begins at the Vernal Equinox, that moment when day and night balance perfectly and spring awakens in the Northern Hemisphere. It is an Earth-centered, solar, evolutionary perspective.\n\n`;
  content += `In this system, your ${tropicalSun} Sun speaks the language of psychology and archetype. It asks: *Who am I becoming?* Your Tropical Moon in ${capitalize(tropicalMoon)} describes the emotional weather you navigate daily — the feelings that rise and fall like tides, the needs that whisper or shout.\n\n`;

  content += `## Your Sidereal Self (The Being)\n\n`;
  content += `Your Sidereal Sun rests in ${capitalize(siderealSun)}. This is the self recognized by the fixed stars — the constellation patterns that have guided humanity for millennia. The Sidereal zodiac measures against Spica and the stars themselves. It is a cosmos-centered, stellar, eternal perspective.\n\n`;
  content += `In this system, your ${siderealSun} Sun speaks the language of dharma and karma. It asks: *Why did I come here?* Your Sidereal Moon in ${capitalize(siderealMoon)} describes the soul-level emotional imprint you carried into this lifetime — the karmic residue, the ancestral memory, the contract you made before birth.\n\n`;

  if (differences.length > 0) {
    content += `## Where the Selves Diverge\n\n`;
    for (const d of differences.slice(0, 6)) {
      content += `**${d.planet}:** Tropical ${d.tropical} → Sidereal ${d.sidereal}. ${d.meaning}\n\n`;
    }
    if (differences.length > 6) {
      content += `*Plus ${differences.length - 6} additional planetary shifts...*\n\n`;
    }
  }

  content += `## Synthesis: Living Both Truths\n\n`;
  content += `You do not choose between these two selves. They are both true. The Tropical self writes the story of this lifetime. The Sidereal self holds the memory of all lifetimes. When they differ — as they do for most people born in the modern era — you are called to integrate. You are a bridge between East and West, between psychology and spirituality, between becoming and being.\n\n`;
  content += `In your HEKA practice, honor both: set intentions under your Tropical Sun, meditate under your Sidereal Sun. Track Tropical transits for worldly timing. Track Sidereal transits for spiritual unfolding.`;

  return { id: 'two-selves', title: 'The Two Selves', subtitle: 'Tropical & Sidereal Dimensions', content, highlight: 'dual-nature', icon: '☯' };
}

function buildNakshatraSection(mansion: BirthMansion, _chart: any): ReportSection {
  const moon = mansion.moonMansion;
  void describeMansion(moon, mansion.moonQuarter); // Keep import alive; description inlined below
  const cycleRuler = mansion.cycleRuler;
  const cycleYears = mansion.cycleYears;

  let content = `In the 27 Lunar Mansion system — used by Babylonians, Egyptians, Chinese, Arabs, and Indians — the Moon at your birth reveals your emotional DNA.\n\n`;

  content += `## Your Birth Mansion: ${moon.universalName} ${moon.symbol}\n\n`;
  content += `**Archetype:** ${moon.archetype}\n\n`;
  content += `**Gift:** ${moon.gift}\n\n`;
  content += `**Totem:** ${moon.totem}\n\n`;
  content += `**Theme:** ${moon.theme}\n\n`;
  content += `**Quarter:** ${mansion.moonQuarter} of 4 — this refines how your mansion expresses.\n\n`;
  content += `**Sanskrit Name:** ${moon.sanskrit} (${moon.transliteration})\n\n`;

  content += `## Cycle Ruler: ${cycleRuler}\n\n`;
  content += `Your Vimshottari Dasha cycle begins under ${cycleRuler}'s reign, lasting ${cycleYears} years. This planet becomes the conductor of your life's symphony — its themes color your early years and set the tone for your karmic journey.\n\n`;

  // All planets in mansions
  if (mansion.allPlanets && mansion.allPlanets.length > 0) {
    content += `## All Planets in Mansions\n\n`;
    for (const pm of mansion.allPlanets) {
      content += `• **${capitalize(pm.planet)}** in ${pm.mansion.universalName} (Quarter ${pm.quarter})\n`;
    }
    content += `\n`;
  }

  content += `## Integration\n\n`;
  content += `Your Lunar Mansion is not an alternative to your Moon sign — it is the Moon sign's deeper layer. Where your Tropical Moon describes your emotional weather, your mansion describes the *purpose* of those emotions. ${moon.gift} This is your birthright.`;

  return { id: 'nakshatra', title: 'Your Lunar Mansion', subtitle: 'The 27 Nakshatras', content, icon: '🌙' };
}

function buildPlanetSection(planetId: string, tropical: any, sidereal: any, isMoon = false): ReportSection {
  const planet = tropical.bodies?.[planetId];
  if (!planet) return { id: planetId, title: capitalize(planetId), content: 'Data unavailable.', icon: '✦' };

  const sign = planet.sign || 'unknown';
  const house = planet.house || 1;
  const degree = planet.longitude % 30;
  const dignity = getDignity(planetId, sign);
  const siderealSign = sidereal.bodies?.[planetId]?.sign;
  const isRetro = (planet.longitudeSpeed || 0) < 0;
  const decan = getDecan(planetId, sign, degree);
  const fixedStars = checkFixedStars(planet.longitude);

  const titleMap: Record<string, string> = {
    sun: 'The Sun — Core Identity & Vital Force',
    moon: 'The Moon — Emotional Nature & Inner World',
    mercury: 'Mercury — The Mind & Communication',
    venus: 'Venus — Love, Beauty & Values',
    mars: 'Mars — Drive, Desire & Courage',
    jupiter: 'Jupiter — Expansion, Wisdom & Fortune',
    saturn: 'Saturn — Discipline, Mastery & Karma',
    uranus: 'Uranus — Innovation, Revolution & Genius',
    neptune: 'Neptune — Dreams, Spirituality & Illusion',
    pluto: 'Pluto — Transformation, Power & Rebirth',
  };

  const houseArea = getHouseLifeArea(house);
  const houseMeaning = getHouseMeaning(house);

  let content = '';

  // Degree precision
  content += `**Exact Position:** ${capitalize(sign)} ${degree.toFixed(1)}° (Decan ${decan.decan}, ruled by ${decan.ruler})\n\n`;
  content += `${decan.text}\n\n`;

  // Rich interpretation for Sun or Moon
  const richInterp = planetId === 'sun' ? getSunInSignInterpretation(sign) :
    (isMoon ? getMoonInSignInterpretation(sign) : null);

  if (richInterp) {
    content += `**${richInterp.title}**\n\n${richInterp.essence}\n\n`;
    content += `### Psychological Dimension\n\n${richInterp.psychological}\n\n`;
    content += `### Spiritual Dimension\n\n${richInterp.spiritual}\n\n`;
    content += `### Gifts & Challenges\n\n**Gifts:** ${richInterp.gifts.join(', ')}.\n\n**Challenges:** ${richInterp.challenges.join(', ')}.\n\n`;
    content += `### Life Themes\n\n${richInterp.lifeThemes.join(', ')}.\n\n`;
    content += `### Guidance\n\n${richInterp.advice}\n\n`;
    content += `*"${richInterp.affirmation}"*\n\n`;
  } else {
    content += generateRichPlanetText(planetId, sign, house, dignity, decan);
  }

  // Retrograde
  if (isRetro) {
    content += `### Retrograde ${capitalize(planetId)}\n\n`;
    content += `${capitalize(planetId)} was retrograde at your birth. This is not a malfunction — it is a deep processing mode. Your ${getPlanetDomain(planetId)} operate inwardly before expressing outwardly. You revisit, revise, and refine. What appears as delay is actually depth. You are here to master this energy from the inside out.\n\n`;
  }

  // House placement
  content += `### In the ${getOrdinal(house)} House — ${houseArea}\n\n`;
  content += `With ${capitalize(planetId)} in the ${houseMeaning.name} (${houseMeaning.latinName}), this energy expresses most powerfully in the realm of ${houseArea.toLowerCase()}. `;
  content += `The ${houseMeaning.keywords.slice(0, 3).join(', ')} themes of this house become the stage where ${capitalize(planetId)} performs. `;
  content += `In traditional astrology, this house is ruled by ${capitalize(houseMeaning.rulingPlanet || 'a planet')} and associated with ${houseMeaning.element} energy and ${houseMeaning.modality} modality.\n\n`;

  // Sidereal comparison
  if (siderealSign && siderealSign !== sign) {
    content += `### Sidereal Perspective\n\n`;
    content += `In the Sidereal zodiac, your ${capitalize(planetId)} falls in ${capitalize(siderealSign)}. While your conscious expression carries ${capitalize(sign)} qualities, your soul-level resonance aligns with ${capitalize(siderealSign)} — ${getSignEssence(siderealSign)}. The integration of these two expressions is part of your unique path.\n\n`;
  }

  // Dignity
  if (dignity !== 'neutral') {
    const dt = dignity === 'domicile' ? 'at home' : dignity === 'exaltation' ? 'exalted' : dignity === 'detriment' ? 'in detriment' : 'in fall';
    content += `### Dignity: ${capitalize(dt)}\n\n`;
    if (dignity === 'domicile' || dignity === 'exaltation') {
      content += `${capitalize(planetId)} is ${dt} in ${capitalize(sign)} — a position of natural strength. This planet operates with ease, authority, and grace in your life.`;
    } else {
      content += `${capitalize(planetId)} is ${dt} in ${capitalize(sign)} — a position of growth through challenge. This area requires conscious effort, but the wisdom gained is extraordinary.`;
    }
    content += '\n\n';
  }

  // Fixed stars
  if (fixedStars.length > 0) {
    content += `### Fixed Star Connections\n\n`;
    for (const star of fixedStars) {
      content += `**${star.name}:** ${star.meaning}\n\n`;
    }
  }

  return { id: `planet-${planetId}`, title: titleMap[planetId] || capitalize(planetId), content: content.trim(), icon: getPlanetSymbol(planetId) };
}

function buildChironSection(tropical: any, sidereal: any): ReportSection {
  const chiron = tropical.bodies?.chiron;
  if (!chiron) return { id: 'chiron', title: 'Chiron — The Wounded Healer', content: 'Chiron data unavailable.', icon: '⚷' };

  const sign = chiron.sign || 'unknown';
  const house = chiron.house || 1;
  const isRetro = (chiron.longitudeSpeed || 0) < 0;
  const siderealSign = sidereal.bodies?.chiron?.sign;

  let content = `Chiron is not a planet — it is a comet, a wandering healer, the centaur who could heal everyone but himself. In your chart, Chiron reveals the wound that never fully closes, and the gift that emerges from tending it.\n\n`;

  content += `**Position:** ${capitalize(sign)} in the ${getOrdinal(house)} House${isRetro ? ' (Retrograde)' : ''}\n\n`;
  content += `Your core wound centers on ${getChironWound(sign)}. This is not a flaw to fix — it is a portal. Through this wound, you develop the capacity to heal others in ways no one else can.\n\n`;
  content += `In the ${getOrdinal(house)} House, this wound manifests in the area of ${getHouseLifeArea(house).toLowerCase()}. Your healing gift is most potent when applied here.\n\n`;

  if (siderealSign && siderealSign !== sign) {
    content += `Sidereally, Chiron falls in ${capitalize(siderealSign)}, suggesting that your soul-level wound-and-gift pattern carries ${siderealSign} coloring beneath the ${sign} surface.`;
  }

  return { id: 'chiron', title: 'Chiron — The Wounded Healer', subtitle: 'Your Sacred Wound & Gift', content: content.trim(), icon: '⚷' };
}

function buildNodesSection(tropical: any, _sidereal: any): ReportSection {
  const north = tropical.bodies?.northnode;
  if (!north) return { id: 'nodes', title: 'The Lunar Nodes', content: 'Node data unavailable.', icon: '☊' };

  const northSign = north.sign || 'unknown';
  const northHouse = north.house || 1;
  const southSign = getOppositeSign(northSign);
  const southHouse = ((northHouse + 5) % 12) + 1;

  let content = `The Lunar Nodes are not physical bodies — they are mathematical points where the Moon's orbit crosses the ecliptic. Yet they are among the most spiritually significant markers in astrology.\n\n`;

  content += `## North Node — Your Soul's Direction\n\n`;
  content += `**${capitalize(northSign)} in the ${getOrdinal(northHouse)} House**\n\n`;
  content += `This is your growth edge — the direction your soul chose for this lifetime. It may feel unfamiliar, even uncomfortable, because it is not your habit. It is your destiny.\n\n`;
  content += `${getNodeMeaning('north', northSign, northHouse)}\n\n`;

  content += `## South Node — Your Past Life Comfort\n\n`;
  content += `**${capitalize(southSign)} in the ${getOrdinal(southHouse)} House**\n\n`;
  content += `This is where you have been, what you have mastered, and what you tend to retreat into when life gets hard. It is your skill — but also your trap.\n\n`;
  content += `${getNodeMeaning('south', southSign, southHouse)}\n\n`;

  content += `## The Axis of Evolution\n\n`;
  content += `Your life path moves from ${capitalize(southSign)} (the known) toward ${capitalize(northSign)} (the unknown). You are not meant to abandon your South Node gifts — you are meant to use them as fuel for the North Node journey. The tension between these two points is the engine of your soul's growth.`;

  return { id: 'nodes', title: 'The Lunar Nodes', subtitle: 'Karma & Destiny', content: content.trim(), icon: '☊' };
}

function buildHouseSection(chart: any): ReportSection {
  const emphasis = getHouseEmphasis(chart);
  const sorted = Object.entries(emphasis).sort((a: any, b: any) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3);

  let content = `The twelve houses are the stages of life. Where planets gather, the drama intensifies. Where houses stand empty, the story unfolds through transits and the ruler's journey.\n\n`;

  content += `### Your Most Active Houses\n\n`;
  for (const [houseNum, count] of top3) {
    const h = parseInt(houseNum);
    const meaning = getHouseMeaning(h);
    content += `**House ${h} — ${meaning.name}** (${count} planet${count !== 1 ? 's' : ''})\n\n`;
    content += `${meaning.significations.primary.join('; ')}. ${meaning.significations.modern.join('; ')}. `;
    content += `Ruled by ${capitalize(meaning.rulingPlanet || 'a planet')}. ${meaning.element} / ${meaning.modality}.\n\n`;
  }

  content += `### Empty Houses & Their Rulers\n\n`;
  content += `A house without planets is not silent — it speaks through its ruler. The planet that rules the sign on the cusp becomes the ambassador for that life area. Track that planet's transits, and you track the house's activation cycles.\n\n`;

  content += `### House Ruler Chain\n\n`;
  for (let h = 1; h <= 12; h++) {
    const meaning = getHouseMeaning(h);
    const rulerPlanet = meaning.rulingPlanet;
    if (rulerPlanet && chart.bodies?.[rulerPlanet]) {
      const ruler = chart.bodies[rulerPlanet];
      content += `• House ${h} (${meaning.name}) → ruled by ${capitalize(rulerPlanet)} in ${capitalize(ruler.sign)} in House ${ruler.house || 1}\n`;
    }
  }

  return { id: 'houses', title: 'House Analysis', subtitle: 'Where Your Energy Flows', content, icon: '🏛' };
}

function buildAspectSection(aspects: any[], patterns: any[]): ReportSection {
  const majorAspects = aspects.filter((a: any) => a.orb < 4).slice(0, 10);

  let content = `Aspects are the conversations between planets. Some are harmonious dialogues. Others are heated debates. All of them shape your inner world.\n\n`;

  if (majorAspects.length > 0) {
    content += `### Major Configurations\n\n`;
    for (const a of majorAspects) {
      const p1 = capitalize(a.body1 || 'unknown');
      const p2 = capitalize(a.body2 || 'unknown');
      const aspectName = capitalize(a.type || 'aspect');
      content += `**${p1} ${aspectName} ${p2}** (orb: ${(a.orb || 0).toFixed(1)}°${a.applying ? ', applying' : ''})\n\n`;
      content += `${getAspectMeaning(a.body1, a.body2, a.type)}\n\n`;
    }
  }

  if (patterns.length > 0) {
    content += `### Detected Patterns\n\n`;
    for (const p of patterns.slice(0, 4)) {
      content += `**${p.name}** (strength: ${p.strength}/10)\n\n`;
      content += `${p.description}\n\n`;
      content += `${p.interpretation}\n\n`;
      if (p.lifeThemes && p.lifeThemes.length > 0) {
        content += `Themes: ${p.lifeThemes.slice(0, 3).join('; ')}.\n\n`;
      }
    }
  }

  return { id: 'aspects', title: 'Aspect Patterns', subtitle: 'The Conversations in Your Chart', content, icon: '⚹' };
}

function buildShapeSection(shape: string, hemisphere: any, elements: any, modalities: any): ReportSection {
  const dominantEl = Object.entries(elements as Record<string, number>).sort((a: any, b: any) => b[1] - a[1])[0];
  const weakestEl = Object.entries(elements as Record<string, number>).sort((a: any, b: any) => a[1] - b[1])[0];
  const dominantMod = Object.entries(modalities as Record<string, number>).sort((a: any, b: any) => b[1] - a[1])[0];

  let content = `### Chart Shape: ${shape.split(' — ')[0]}\n\n`;
  content += `${shape.split(' — ')[1] || ''}\n\n`;

  content += `### Hemisphere Emphasis\n\n`;
  content += `${hemisphere.text}\n\n`;
  content += `Above horizon: ${hemisphere.above} · Below horizon: ${hemisphere.below} · East: ${hemisphere.east} · West: ${hemisphere.west}\n\n`;

  content += `### Elemental Balance\n\n`;
  content += `Fire (${elements.fire}) · Earth (${elements.earth}) · Air (${elements.air}) · Water (${elements.water}) · Ether (${elements.ether ?? 0})\n\n`;
  if (dominantEl[1] > 3) content += `**${capitalize(dominantEl[0])}-dominant:** ${getElementDescription(dominantEl[0])}\n\n`;
  if (weakestEl[1] < 2) content += `**${capitalize(weakestEl[0])} underrepresented:** ${getElementUnderrep(weakestEl[0])}\n\n`;

  content += `### Modal Balance\n\n`;
  content += `Cardinal (${modalities.cardinal}) · Fixed (${modalities.fixed}) · Mutable (${modalities.mutable})\n\n`;
  content += `**${capitalize(dominantMod[0])}-dominant:** ${getModalityDescription(dominantMod[0])}\n\n`;

  return { id: 'shape', title: 'Chart Shape & Temperament', subtitle: 'The Architecture of Your Soul', content, icon: '⬡' };
}

function buildFixedStarsSection(chart: any): ReportSection {
  const connections: { planet: string; stars: any[] }[] = [];
  for (const [pid, body] of Object.entries(chart.bodies || {})) {
    const b = body as any;
    if (!b?.longitude) continue;
    const stars = checkFixedStars(b.longitude);
    if (stars.length > 0) connections.push({ planet: pid, stars });
  }

  let content = `Fixed stars are the ancient sentinels of the sky. Unlike planets, they do not move — they watch. When a planet aligns with a fixed star at your birth, that star's mythic power enters your chart.\n\n`;

  if (connections.length === 0) {
    content += `No major fixed star conjunctions within orb in your natal chart. This is neither positive nor negative — it simply means your chart's primary story is told through planetary dynamics rather than stellar imprinting.`;
  } else {
    for (const c of connections) {
      content += `### ${capitalize(c.planet)} Connections\n\n`;
      for (const star of c.stars) {
        content += `**${star.name}:** ${star.meaning}\n\n`;
      }
    }
  }

  return { id: 'fixed-stars', title: 'Fixed Star Connections', subtitle: 'The Ancient Sentinels', content, icon: '✦' };
}

function buildLifeThemesSection(chart: any): ReportSection {
  const themes = getNatalThemes(chart);
  let content = `Beyond individual placements, your chart reveals overarching life themes — the great threads that weave through your entire existence.\n\n`;

  if (themes.length > 0) {
    for (const theme of themes) {
      content += `• **${theme}** — ${getThemeDescription(theme)}\n\n`;
    }
  }

  content += `### Your Hero's Journey\n\n`;
  content += `Every natal chart is a map of the hero's journey. Your Sun describes the hero. Your Moon describes the underworld. Your rising sign describes the threshold. The houses with planets describe the lands you will travel. The aspects describe your allies and adversaries. The outer planets describe the cultural mythology you were born into. You are not just reading a chart — you are reading the script of your soul's epic.`;

  return { id: 'themes', title: 'Life Themes', subtitle: 'The Great Threads', content, icon: '🧵' };
}

function buildTimingSection(profile: AstroProfile, chart: any, planetaryHour: { hourPlanet: string; meaning: string }): ReportSection {
  const sun = chart.bodies?.sun;
  const sr = calculateSolarReturnDate(profile.birthDate, sun?.longitude || 0);

  let content = `### Planetary Day & Hour of Birth\n\n`;
  content += `You were born on a **${getPlanetaryDay(new Date(profile.birthDate))}day** (${planetaryHour.meaning}).\n\n`;
  content += `This colors the atmosphere of your birth moment. The ${planetaryHour.hourPlanet} hour infuses your life with ${planetaryHour.hourPlanet.toLowerCase()} energy — it is the lens through which you first saw the world.\n\n`;

  if (sr) {
    content += `### Your Next Solar Return\n\n`;
    content += `Your personal new year occurs around **${sr.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}**. `;
    content += `This is when the Sun returns to its exact natal position. It is the most powerful time for intention-setting, goal-setting, and reviewing the year past. Mark this date in your HEKA calendar.\n\n`;
  }

  content += `### Lunar Phase at Birth\n\n`;
  const moonPhase = getMoonPhaseName(chart.bodies?.sun?.longitude, chart.bodies?.moon?.longitude);
  content += `You were born under a **${moonPhase}** Moon. This phase describes your natural approach to beginnings, endings, and cycles. It is the emotional weather you were born into.`;

  return { id: 'timing', title: 'Solar Return & Timing', subtitle: 'Your Personal Calendar', content, icon: '⏳' };
}

function buildHekaSection(tropical: any, _sidereal: any): ReportSection {
  const moon = tropical.bodies?.moon;

  let content = `Your natal chart is not a static document — it is a living interface with time itself. Here is how to use it within your HEKA practice.\n\n`;

  content += `### Daily Integration\n\n`;
  content += `Track transits in your HEKA calendar. When a planet in the sky aspects your natal planets, that area of life activates. These are your power days, challenge days, and flow days.\n\n`;

  content += `### Tropical vs Sidereal Transits\n\n`;
  content += `Use **Tropical transits** for worldly timing: career moves, relationships, creative launches. Use **Sidereal transits** for spiritual timing: meditation intensives, retreats, karmic work. Your HEKA calendar can track both.\n\n`;

  content += `### Moon Tracking\n\n`;
  content += `With your Moon in ${capitalize(moon?.sign || '')}, track the Moon's monthly journey through your natal houses. Each house activation brings emotional focus to that life area for 2-3 days.\n\n`;

  content += `### The Living Chart\n\n`;
  content += `Return to this report quarterly. The words will land differently as you grow. The chart does not change — but your capacity to understand it does. That is the magic.`;

  return { id: 'heka', title: 'HEKA Integration', subtitle: 'Living Your Chart', content, icon: '📅' };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(s: string): string { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function getSignEssence(sign: string): string {
  const map: Record<string, string> = {
    aries: 'bold initiative and pioneering spirit', taurus: 'steady manifestation and sensual wisdom',
    gemini: 'curious communication and mental agility', cancer: 'nurturing depth and emotional intelligence',
    leo: 'radiant creativity and generous leadership', virgo: 'discerning service and sacred attention to detail',
    libra: 'harmonious balance and aesthetic diplomacy', scorpio: 'intense transformation and penetrating insight',
    sagittarius: 'expansive wisdom and adventurous truth-seeking', capricorn: 'disciplined mastery and practical ambition',
    aquarius: 'innovative vision and humanitarian independence', pisces: 'compassionate transcendence and mystical imagination',
  };
  return map[sign] || 'unique spiritual qualities';
}

function getPlanetDomain(planet: string): string {
  const map: Record<string, string> = {
    sun: 'identity and vitality', moon: 'emotions and instincts', mercury: 'thoughts and communications',
    venus: 'relationships and values', mars: 'actions and desires', jupiter: 'beliefs and opportunities',
    saturn: 'responsibilities and structures', uranus: 'innovations and individuality', neptune: 'dreams and spiritualities',
    pluto: 'transformations and power dynamics', chiron: 'wounds and healing', northnode: 'soul growth direction',
  };
  return map[planet] || 'life expressions';
}

function getTwoSelvesDifferenceText(planet: string, tropicalSign: string, siderealSign: string): string {
  const domains: Record<string, string> = {
    sun: 'core identity', moon: 'emotional nature', mercury: 'thinking style', venus: 'love nature',
    mars: 'drive and desire', jupiter: 'growth philosophy', saturn: 'life lessons and discipline',
    uranus: 'uniqueness and rebellion', neptune: 'spirituality and dreams', pluto: 'transformation and power',
  };
  return `Your ${domains[planet] || planet} expresses ${tropicalSign} outwardly but carries ${siderealSign} at the soul level.`;
}

function generateRichPlanetText(planetId: string, sign: string, house: number, dignity: string, decan: { decan: number; ruler: string; text: string }): string {
  const planetName = capitalize(planetId);
  const signName = capitalize(sign);
  const domain = getPlanetDomain(planetId);
  const signQuality = getSignEssence(sign);

  let content = `**${planetName} in ${signName}**\n\n`;
  content += `With ${planetName} in ${signName}, your ${domain} are shaped by ${sign} energy — ${signQuality}. `;
  content += `This is the ${decan.decan} decan, where ${decan.ruler} adds ${decan.ruler.toLowerCase()} refinement to the ${signName} expression.\n\n`;

  if (dignity === 'domicile') {
    content += `${planetName} is at home here. This planet flows through your life with natural authority and ease. Others may recognize your mastery in ${domain} before you do.`;
  } else if (dignity === 'exaltation') {
    content += `${planetName} is exalted — at peak power. This placement amplifies the noblest expressions of ${domain}. You have the potential to become an exemplar in this area.`;
  } else if (dignity === 'detriment') {
    content += `${planetName} is in detriment here, creating productive tension. Your ${domain} may feel unfamiliar or require conscious effort. The growth potential is extraordinary precisely because it does not come easily.`;
  } else if (dignity === 'fall') {
    content += `${planetName} is in fall — operating from vulnerability. This is not weakness. It is the seed of your greatest wisdom. The challenges you face in ${domain} are the doorway to your deepest growth.`;
  } else {
    content += `${planetName} operates here with neutral dignity. The expression of your ${domain} is shaped primarily by house placement and aspects.`;
  }

  content += `\n\nIn the ${getOrdinal(house)} house, this ${planetName} energy becomes most visible in ${getHouseLifeArea(house).toLowerCase()}. `;
  content += `Your approach to ${domain} significantly impacts your ${getHouseLifeArea(house).toLowerCase()}, for better or worse. `;
  content += `Conscious awareness transforms this from autopilot into artistry.`;

  return content;
}

function getAspectMeaning(p1: string, p2: string, aspect: string): string {
  const meanings: Record<string, string> = {
    conjunction: `A fusion. ${capitalize(p1)} and ${capitalize(p2)} merge into a unified force. They do not operate independently — they are one current with two names.`,
    sextile: `A conversation. ${capitalize(p1)} and ${capitalize(p2)} support each other with ease, creating natural opportunities for cooperation.`,
    square: `A crucible. ${capitalize(p1)} and ${capitalize(p2)} generate friction that forges strength. The tension demands growth.`,
    trine: `A gift. ${capitalize(p1)} and ${capitalize(p2)} flow together effortlessly. Natural talent — but beware complacency.`,
    opposition: `A mirror. ${capitalize(p1)} and ${capitalize(p2)} pull in opposite directions, teaching the art of balance between extremes.`,
  };
  return meanings[aspect] || `A significant relationship between ${capitalize(p1)} and ${capitalize(p2)}.`;
}

function getElementDescription(el: string): string {
  const map: Record<string, string> = {
    fire: 'You are driven by passion, creativity, and spirit. Fire dominant individuals are natural leaders and initiators.',
    earth: 'You are grounded, practical, and sensually attuned. Earth dominant individuals build slowly but enduringly.',
    air: 'You are intellectually oriented, communicative, and socially engaged. Air dominant individuals think first, feel second.',
    water: 'You are emotionally deep, intuitive, and empathically sensitive. Water dominant individuals feel before they think.',
  };
  return map[el] || '';
}

function getElementUnderrep(el: string): string {
  const map: Record<string, string> = {
    fire: 'Consciously cultivate passion, courage, and creative risk-taking.',
    earth: 'Benefit from grounding practices, physical exercise, and practical routines.',
    air: 'Intentionally develop communication skills and intellectual flexibility.',
    water: 'Consciously open to emotional experience and intuitive wisdom.',
  };
  return map[el] || '';
}

function getModalityDescription(mod: string): string {
  const map: Record<string, string> = {
    cardinal: 'You are a natural initiator. You begin with enthusiasm. Your challenge is follow-through.',
    fixed: 'You are a stabilizer. Once you commit, you endure. Your challenge is flexibility.',
    mutable: 'You are adaptable and transformative. Your challenge is commitment through difficulty.',
  };
  return map[mod] || '';
}

function getThemeDescription(theme: string): string {
  const map: Record<string, string> = {
    'Fire Dominant': 'Passion, creativity, and spiritual drive color your path.',
    'Earth Dominant': 'Practical mastery, material security, and embodied wisdom are central.',
    'Air Dominant': 'Intellectual exploration, communication, and social connection define you.',
    'Water Dominant': 'Emotional depth, intuition, and transformative feeling guide you.',
    'Cardinal Focus': 'You are here to begin, to lead, to initiate.',
    'Fixed Focus': 'You are here to sustain, to deepen, to hold steady.',
    'Mutable Focus': 'You are here to adapt, to transform, to bridge worlds.',
    'New Moon Born': 'Sun and Moon conjunct — aligned will and emotion. Singular purpose.',
    'Full Moon Born': 'Sun and Moon opposed — bridge between conscious and unconscious.',
    'Waxing Soul': 'Born while Moon waxed — path of accumulation, growth, building.',
    'Waning Soul': 'Born while Moon waned — path of release, refinement, distillation.',
    'Deep Retrograde Pattern': 'Three+ planets retrograde — deep thinker, revisionist, inner alchemist.',
  };
  return map[theme] || 'A significant pattern in your natal chart.';
}

function getChironWound(sign: string): string {
  const map: Record<string, string> = {
    aries: 'identity and self-worth — the feeling that you must prove your existence',
    taurus: 'self-value and security — fears around worthiness and stability',
    gemini: 'communication and being heard — the fear that your voice does not matter',
    cancer: 'belonging and nurturing — wounds around home, family, and emotional safety',
    leo: 'recognition and creative expression — the fear of being invisible',
    virgo: 'perfection and service — the wound of never being good enough',
    libra: 'relationship and balance — fears around abandonment and unfairness',
    scorpio: 'trust and vulnerability — the wound of betrayal and emotional exposure',
    sagittarius: 'faith and meaning — the fear that life has no purpose',
    capricorn: 'achievement and authority — the wound of not being taken seriously',
    aquarius: 'belonging and authenticity — the fear of being too different to connect',
    pisces: 'boundaries and spiritual connection — the wound of dissolving into others',
  };
  return map[sign] || 'deep healing and transformation';
}

function getNodeMeaning(node: string, sign: string, _house: number): string {
  const northSigns: Record<string, string> = {
    aries: 'learning independence, courage, and self-assertion', taurus: 'building self-worth, stability, and sensory grounding',
    gemini: 'developing curiosity, communication, and mental flexibility', cancer: 'creating emotional security, nurturing, and inner safety',
    leo: 'expressing creativity, leadership, and authentic joy', virgo: 'developing discernment, service, and practical mastery',
    libra: 'learning partnership, diplomacy, and balanced relationship', scorpio: 'deepening intimacy, trust, and transformative power',
    sagittarius: 'expanding wisdom, adventure, and philosophical truth', capricorn: 'building mastery, responsibility, and public achievement',
    aquarius: 'innovating, connecting community, and authentic individuality', pisces: 'developing compassion, spiritual connection, and creative imagination',
  };
  const southSigns: Record<string, string> = {
    aries: 'relying too heavily on others, avoiding conflict, losing identity in relationships',
    taurus: 'material attachment, resistance to change, stubbornness',
    gemini: 'scattered thinking, superficiality, anxiety',
    cancer: 'emotional dependency, clinging to the past, moodiness',
    leo: 'needing validation, pride, dramatic reactions',
    virgo: 'perfectionism, self-criticism, over-analysis',
    libra: 'indecisiveness, people-pleasing, avoiding necessary conflict',
    scorpio: 'intensity for its own sake, control issues, jealousy',
    sagittarius: 'restlessness, bluntness, escaping depth',
    capricorn: 'workaholism, emotional suppression, controlling tendencies',
    aquarius: 'detachment, rebellion without cause, difficulty with intimacy',
    pisces: 'confusion, escapism, absorbing others\' pain',
  };
  return node === 'north' ? northSigns[sign] || '' : southSigns[sign] || '';
}

function getOppositeSign(sign: string): string {
  const opposites: Record<string, string> = {
    aries: 'libra', taurus: 'scorpio', gemini: 'sagittarius', cancer: 'capricorn',
    leo: 'aquarius', virgo: 'pisces', libra: 'aries', scorpio: 'taurus',
    sagittarius: 'gemini', capricorn: 'cancer', aquarius: 'leo', pisces: 'virgo',
  };
  return opposites[sign] || sign;
}

function getMoonPhaseName(sunLon?: number, moonLon?: number): string {
  if (sunLon === undefined || moonLon === undefined) return 'Unknown';
  let angle = Math.abs(moonLon - sunLon);
  if (angle > 180) angle = 360 - angle;
  if (angle < 10) return 'New Moon';
  if (angle < 50) return 'Waxing Crescent';
  if (angle < 95) return 'First Quarter';
  if (angle < 135) return 'Waxing Gibbous';
  if (angle < 170) return 'Full Moon';
  if (angle < 230) return 'Waning Gibbous';
  if (angle < 275) return 'Last Quarter';
  if (angle < 315) return 'Waning Crescent';
  return 'New Moon';
}

function getPlanetSymbol(planet: string): string {
  const map: Record<string, string> = {
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  };
  return map[planet] || '✦';
}

function getOrdinal(n: number): string {
  const map = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
  return map[n] || `${n}th`;
}

function calculateSolarReturnDate(birthDate: string, _birthSunLongitude: number): Date | null {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const d = new Date(birthDate);
    d.setFullYear(year);
    // Approximate solar return by adding ~5.5 hours per year of precession
    const precessionMinutes = (year - d.getFullYear()) * 5.5;
    d.setMinutes(d.getMinutes() - precessionMinutes);
    if (d < now) d.setFullYear(year + 1);
    return d;
  } catch { return null; }
}
