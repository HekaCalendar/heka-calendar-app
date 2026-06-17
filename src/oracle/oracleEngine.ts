/**
 * HEKA Oracle Engine 🔮
 * The Crown Jewel - Intelligent Celestial Synchronicity System
 * 
 * Features:
 * - Content analysis with 200+ keyword mappings
 * - Real-time Swiss Ephemeris integration
 * - Whole Sign house system
 * - Birth chart transit calculations
 * - Insight scoring & selection
 * - User preference learning
 */

import { calculateJulianDay, calculateAllPlanets } from '../astrology/services/swiss-ephemeris/engine';
import { calculateVoidMoonStatus, getFallbackPositions } from '../astrology/services/calculations/swissCalculations';
import { getSignCount } from '../astrology/services/swiss-ephemeris/engine';
import type { CelestialBody } from '../astrology/types';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

export const ORACLE_CONFIG = {
  // Aspect orbs
  ORBS: {
    conjunction: 8,
    opposition: 8,
    trine: 8,
    square: 8,
    sextile: 6,
    minor: 2
  },
  
  // Scoring weights
  WEIGHTS: {
    contentMatch: 0.25,
    celestialStrength: 0.30,
    personalRelevance: 0.25,
    historicalRating: 0.15,
    uniqueness: 0.05
  },
  
  // Minimum score to show insight
  THRESHOLD: 70,
  
  // House system
  HOUSE_SYSTEM: 'whole-sign' as const
};

// ============================================================================
// KEYWORD ANALYSIS SYSTEM
// ============================================================================

export type ContentTheme = 
  | 'beginnings' | 'endings' | 'relationships' | 'career' 
  | 'introspection' | 'action' | 'communication' | 'creativity'
  | 'healing' | 'conflict' | 'joy' | 'fear' | 'change' | 'stability';

interface KeywordMap {
  theme: ContentTheme;
  keywords: string[];
  archetype: string;
}

const KEYWORD_DATABASE: KeywordMap[] = [
  {
    theme: 'beginnings',
    archetype: 'The Initiator',
    keywords: ['start', 'new', 'fresh', 'launch', 'create', 'plant', 'seed', 'birth', 'initiate', 'begin', 'embark', 'venture', 'found', 'establish', 'kickoff', 'opening', 'debut', 'inception']
  },
  {
    theme: 'endings',
    archetype: 'The Closer',
    keywords: ['end', 'finish', 'complete', 'release', 'let go', 'close', 'final', 'conclude', 'wrap up', 'terminate', 'culmination', 'closure', 'resolution', 'departure', 'farewell', 'death', 'ending', 'completion']
  },
  {
    theme: 'relationships',
    archetype: 'The Lover',
    keywords: ['love', 'partner', 'friend', 'connection', 'heart', 'intimacy', 'relationship', 'marriage', 'dating', 'romance', 'together', 'union', 'bond', 'attachment', 'attraction', 'commitment', 'devotion', 'passion']
  },
  {
    theme: 'career',
    archetype: 'The Builder',
    keywords: ['work', 'job', 'career', 'ambition', 'success', 'project', 'business', 'profession', 'occupation', 'vocation', 'calling', 'advancement', 'promotion', 'achievement', 'recognition', 'status', 'responsibility', 'leadership']
  },
  {
    theme: 'introspection',
    archetype: 'The Mystic',
    keywords: ['think', 'reflect', 'feel', 'intuition', 'dream', 'inner', 'meditate', 'contemplate', 'ponder', 'wonder', 'question', 'search', 'seek', 'understand', 'meaning', 'purpose', 'spirit', 'soul', 'psyche', 'unconscious']
  },
  {
    theme: 'action',
    archetype: 'The Warrior',
    keywords: ['do', 'move', 'act', 'fight', 'courage', 'brave', 'decision', 'choose', 'execute', 'implement', 'push', 'drive', 'force', 'energy', 'power', 'strength', 'determination', 'will', 'assert', 'conquer', 'victory']
  },
  {
    theme: 'communication',
    archetype: 'The Messenger',
    keywords: ['speak', 'write', 'talk', 'express', 'voice', 'share', 'communicate', 'convey', 'transmit', 'message', 'letter', 'email', 'call', 'conversation', 'discussion', 'debate', 'negotiate', 'persuade', 'explain', 'clarify']
  },
  {
    theme: 'creativity',
    archetype: 'The Artist',
    keywords: ['art', 'create', 'design', 'imagine', 'inspire', 'beauty', 'aesthetic', 'innovation', 'original', 'unique', 'vision', 'dream', 'fantasy', 'play', 'experiment', 'explore', 'discover', 'invent', 'craft', 'make', 'build']
  },
  {
    theme: 'healing',
    archetype: 'The Healer',
    keywords: ['heal', 'recover', 'restore', 'renew', 'repair', 'fix', 'mend', 'therapy', 'treatment', 'cure', 'remedy', 'medicine', 'health', 'wellness', 'balance', 'harmony', 'peace', 'calm', 'soothe', 'comfort', 'nurture']
  },
  {
    theme: 'conflict',
    archetype: 'The Challenger',
    keywords: ['conflict', 'fight', 'argue', 'disagree', 'struggle', 'battle', 'war', 'tension', 'stress', 'pressure', 'challenge', 'obstacle', 'barrier', 'resistance', 'opposition', 'competition', 'rivalry', 'enemy', 'problem', 'difficulty']
  },
  {
    theme: 'joy',
    archetype: 'The Celebrant',
    keywords: ['happy', 'joy', 'celebrate', 'fun', 'laugh', 'smile', 'pleasure', 'delight', 'bliss', 'ecstasy', 'elation', 'euphoria', 'excitement', 'enthusiasm', 'passion', 'love', 'gratitude', 'appreciation', 'enjoy', 'savor', 'relish']
  },
  {
    theme: 'fear',
    archetype: 'The Protector',
    keywords: ['afraid', 'scared', 'fear', 'worry', 'anxiety', 'doubt', 'uncertainty', 'insecurity', 'vulnerable', 'exposed', 'threatened', 'danger', 'risk', 'caution', 'hesitation', 'resistance', 'avoidance', 'escape', 'hide', 'protect']
  },
  {
    theme: 'change',
    archetype: 'The Transformer',
    keywords: ['change', 'transform', 'shift', 'transition', 'metamorphosis', 'evolution', 'revolution', 'breakthrough', 'rupture', 'crisis', 'turning point', 'crossroads', 'adapt', 'adjust', 'flexible', 'flow', 'movement', 'motion', 'progress', 'development']
  },
  {
    theme: 'stability',
    archetype: 'The Preserver',
    keywords: ['stable', 'steady', 'secure', 'safe', 'grounded', 'rooted', 'foundation', 'structure', 'order', 'system', 'routine', 'habit', 'tradition', 'consistency', 'reliability', 'dependable', 'loyalty', 'commitment', 'permanence', 'endurance']
  }
];

// ============================================================================
// CONTENT ANALYSIS ENGINE
// ============================================================================

export interface ThemeScore {
  theme: ContentTheme;
  score: number;
  matchedKeywords: string[];
  archetype: string;
}

export function analyzeContent(text: string): ThemeScore[] {
  const lowerText = text.toLowerCase();
  const scores: ThemeScore[] = [];
  
  for (const category of KEYWORD_DATABASE) {
    const matchedKeywords: string[] = [];
    let totalWeight = 0;
    
    for (const keyword of category.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      
      if (matches) {
        matchedKeywords.push(keyword);
        const weight = 1 - (category.keywords.indexOf(keyword) / category.keywords.length);
        totalWeight += weight * matches.length;
      }
    }
    
    if (matchedKeywords.length > 0) {
      const score = Math.min(100, (totalWeight / Math.sqrt(text.length / 50)) * 20);
      
      scores.push({
        theme: category.theme,
        score,
        matchedKeywords,
        archetype: category.archetype
      });
    }
  }
  
  return scores.sort((a, b) => b.score - a.score);
}

// ============================================================================
// CELESTIAL EVENT TYPES
// ============================================================================

export type AspectType = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx';

export interface CelestialEvent {
  type: 'moon-phase' | 'transit' | 'void-moon' | 'aspect' | 'house-transit';
  planet?: string;
  transitingPlanet?: string;
  transitingSign?: string;
  secondaryPlanet?: string;
  sign?: string;
  house?: number;
  aspect?: AspectType;
  orb: number;
  strength: number;
  description: string;
  isNatalTransit?: boolean;
}

export interface CelestialState {
  timestamp: Date;
  moonPhase: {
    phase: string;
    sign: string;
    illumination: number;
    isVoid: boolean;
  };
  planets: Record<string, CelestialBody>;
  events: CelestialEvent[];
}

// ============================================================================
// SWISS EPHEMERIS INTEGRATION
// ============================================================================

export async function getCurrentCelestialState(date: Date = new Date()): Promise<CelestialState> {
  const jd = calculateJulianDay(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  
  let positions = calculateAllPlanets(jd);
  
  // Fallback when WASM is not yet initialized (mobile cold start)
  if (!positions || !positions.sun || !positions.moon) {
    positions = getFallbackPositions(jd, getSignCount() === 13);
  }
  
  const sun = positions.sun;
  const moon = positions.moon;
  const angle = ((moon.longitude - sun.longitude) % 360 + 360) % 360;
  
  let moonPhaseName: string;
  if (angle < 45) moonPhaseName = 'new';
  else if (angle < 135) moonPhaseName = 'waxing';
  else if (angle < 225) moonPhaseName = 'full';
  else moonPhaseName = 'waning';
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: Real void-of-course moon calculation
  // ═══════════════════════════════════════════════════════════════════════════
  let isVoid = false;
  try {
    const voidStatus = await calculateVoidMoonStatus();
    isVoid = voidStatus.isVoid;
  } catch (e) {
    console.warn('[OracleEngine] Void moon calculation failed, defaulting to false:', e);
  }
  
  const events = detectCelestialEvents(positions);
  
  return {
    timestamp: date,
    moonPhase: {
      phase: moonPhaseName,
      sign: moon.sign,
      illumination: (1 - Math.cos(angle * Math.PI / 180)) / 2 * 100,
      isVoid
    },
    planets: positions,
    events
  };
}

function detectCelestialEvents(positions: Record<string, CelestialBody>): CelestialEvent[] {
  const events: CelestialEvent[] = [];
  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = positions[planets[i]];
      const p2 = positions[planets[j]];
      
      if (!p1 || !p2) continue;
      
      const diff = Math.abs(p1.longitude - p2.longitude);
      const shortestDiff = Math.min(diff, 360 - diff);
      
      let aspect: AspectType | null = null;
      let orb = 0;
      
      if (shortestDiff < ORACLE_CONFIG.ORBS.conjunction) {
        aspect = 'conjunction';
        orb = shortestDiff;
      } else if (Math.abs(shortestDiff - 180) < ORACLE_CONFIG.ORBS.opposition) {
        aspect = 'opposition';
        orb = Math.abs(shortestDiff - 180);
      } else if (Math.abs(shortestDiff - 120) < ORACLE_CONFIG.ORBS.trine) {
        aspect = 'trine';
        orb = Math.abs(shortestDiff - 120);
      } else if (Math.abs(shortestDiff - 90) < ORACLE_CONFIG.ORBS.square) {
        aspect = 'square';
        orb = Math.abs(shortestDiff - 90);
      } else if (Math.abs(shortestDiff - 60) < ORACLE_CONFIG.ORBS.sextile) {
        aspect = 'sextile';
        orb = Math.abs(shortestDiff - 60);
      }
      
      if (aspect) {
        const strength = Math.max(0, 100 - (orb * 10));
        events.push({
          type: 'aspect',
          planet: planets[i],
          secondaryPlanet: planets[j],
          aspect,
          orb,
          strength,
          description: `${planets[i]} ${aspect} ${planets[j]}`
        });
      }
    }
  }
  
  return events.sort((a, b) => b.strength - a.strength);
}

// ============================================================================
// INSIGHT TEMPLATE SYSTEM
// ============================================================================

export interface InsightTemplate {
  id: string;
  conditions: {
    themes?: ContentTheme[];
    celestialEvent?: string;
    moonPhase?: string;
    planet?: string;
    aspect?: AspectType;
    house?: number;
  };
  templates: string[];
  priority: number;
  requiresBirthChart: boolean;
}

export const INSIGHT_TEMPLATES: InsightTemplate[] = [
  {
    id: 'new-moon-beginnings',
    priority: 90,
    requiresBirthChart: false,
    conditions: {
      themes: ['beginnings', 'creativity'],
      moonPhase: 'new'
    },
    templates: [
      "The New Moon in {moonSign} amplifies your intentions about {theme}. This is cosmically optimal timing for planting metaphorical seeds.",
      "As the Moon begins her cycle in {moonSign}, your focus on {theme} aligns with universal renewal energy. Beginnings started now carry extra momentum.",
      "The dark Moon in {moonSign} creates fertile ground for your {theme} intentions. The universe supports fresh starts in this area."
    ]
  },
  {
    id: 'full-moon-completions',
    priority: 85,
    requiresBirthChart: false,
    conditions: {
      themes: ['endings'],
      moonPhase: 'full'
    },
    templates: [
      "The Full Moon in {moonSign} illuminates your {theme} matters. Culminations and completions are cosmically highlighted now.",
      "As the Moon reaches fullness in {moonSign}, your {theme} intentions reach a point of clarity and manifestation.",
      "The Full Moon in {moonSign} casts light on your {theme} journey. What has reached completion can now be released with gratitude."
    ]
  },
  {
    id: 'void-moon-pause',
    priority: 80,
    requiresBirthChart: false,
    conditions: {
      themes: ['conflict', 'fear', 'stability'],
    },
    templates: [
      "The Moon is Void of Course - a celestial intermission. Your feeling of uncertainty about {theme} reflects this cosmic pause. Clarity returns when the Moon enters {nextSign}.",
      "In this Void Moon period, {theme} matters benefit from observation rather than action. The universe asks for patience.",
      "The floating Moon creates space for unconscious processing. Your {theme} reflections now may yield insights later."
    ]
  },
  {
    id: 'mercury-communication',
    priority: 75,
    requiresBirthChart: false,
    conditions: {
      themes: ['communication', 'creativity'],
      planet: 'mercury'
    },
    templates: [
      "Mercury in {mercurySign} sharpens mental processes. Your {theme} communication flows with unusual clarity today.",
      "The Messenger in {mercurySign} supports your {theme} expression. Words carry extra precision and impact now."
    ]
  },
  {
    id: 'venus-relationships',
    priority: 75,
    requiresBirthChart: false,
    conditions: {
      themes: ['relationships', 'joy'],
      planet: 'venus'
    },
    templates: [
      "Venus in {venusSign} harmonizes your {theme} matters. Connection and compromise flow more naturally under this influence.",
      "The Love Goddess in {venusSign} beautifies your {theme} landscape. Aesthetic awareness enhances relational dynamics."
    ]
  },
  {
    id: 'mars-action',
    priority: 75,
    requiresBirthChart: false,
    conditions: {
      themes: ['action', 'career'],
      planet: 'mars'
    },
    templates: [
      "Mars in {marsSign} fuels your {theme} drive. Energy and determination are cosmically available now.",
      "The Warrior in {marsSign} supports bold moves regarding {theme}. Courage is amplified; hesitation serves no purpose."
    ]
  },
  {
    id: 'saturn-structure',
    priority: 70,
    requiresBirthChart: false,
    conditions: {
      themes: ['career', 'stability', 'endings'],
      planet: 'saturn'
    },
    templates: [
      "Saturn in {saturnSign} demands maturity in {theme} matters. Responsibilities accepted now build lasting foundations.",
      "The Taskmaster in {saturnSign} focuses your {theme} efforts. Discipline applied today yields long-term results."
    ]
  }
];

// ============================================================================
// BIRTH CHART TRANSIT CALCULATOR
// ============================================================================

export interface BirthChart {
  sun: CelestialBody;
  moon: CelestialBody;
  mercury: CelestialBody;
  venus: CelestialBody;
  mars: CelestialBody;
  jupiter: CelestialBody;
  saturn: CelestialBody;
  rising?: CelestialBody;
  houses?: Record<number, { sign: string; cusp: number }>;
}

export interface Transit {
  transitingPlanet: string;
  natalPlanet: string;
  aspect: AspectType;
  orb: number;
  strength: number;
  house?: number;
}

export function calculateTransits(
  currentPositions: Record<string, CelestialBody>,
  natalChart: BirthChart
): Transit[] {
  const transits: Transit[] = [];
  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  
  for (const transiting of planets) {
    const transitingPos = currentPositions[transiting];
    if (!transitingPos) continue;
    
    for (const natal of planets) {
      const natalPos = natalChart[natal as keyof BirthChart] as CelestialBody;
      if (!natalPos) continue;
      
      const diff = Math.abs(transitingPos.longitude - natalPos.longitude);
      const shortestDiff = Math.min(diff, 360 - diff);
      
      let aspect: AspectType | null = null;
      let orb = 0;
      
      if (shortestDiff < ORACLE_CONFIG.ORBS.conjunction) {
        aspect = 'conjunction';
        orb = shortestDiff;
      } else if (Math.abs(shortestDiff - 180) < ORACLE_CONFIG.ORBS.opposition) {
        aspect = 'opposition';
        orb = Math.abs(shortestDiff - 180);
      } else if (Math.abs(shortestDiff - 120) < ORACLE_CONFIG.ORBS.trine) {
        aspect = 'trine';
        orb = Math.abs(shortestDiff - 120);
      } else if (Math.abs(shortestDiff - 90) < ORACLE_CONFIG.ORBS.square) {
        aspect = 'square';
        orb = Math.abs(shortestDiff - 90);
      } else if (Math.abs(shortestDiff - 60) < ORACLE_CONFIG.ORBS.sextile) {
        aspect = 'sextile';
        orb = Math.abs(shortestDiff - 60);
      }
      
      if (aspect && transiting !== natal) {
        const strength = Math.max(0, 100 - (orb * 10));
        const house = calculateWholeSignHouse(transitingPos.longitude, natalChart);
        
        transits.push({
          transitingPlanet: transiting,
          natalPlanet: natal,
          aspect,
          orb,
          strength,
          house
        });
      }
    }
  }
  
  return transits.sort((a, b) => b.strength - a.strength);
}

function calculateWholeSignHouse(planetLongitude: number, natalChart: BirthChart): number {
  if (!natalChart.rising) return 1;
  
  const risingDegree = natalChart.rising.longitude;
  const diff = (planetLongitude - risingDegree + 360) % 360;
  return Math.floor(diff / 30) + 1;
}

// ============================================================================
// INSIGHT GENERATOR
// ============================================================================

export interface GeneratedInsight {
  id: string;
  text: string;
  score: number;
  celestialEvent: CelestialEvent | Transit;
  themeMatch: ThemeScore;
  confidence: 'high' | 'medium' | 'low';
  requiresBirthChart: boolean;
}

export function generateInsights(
  contentAnalysis: ThemeScore[],
  celestialState: CelestialState,
  birthChart?: BirthChart
): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];
  const topTheme = contentAnalysis[0];
  
  if (!topTheme) return [];
  
  for (const template of INSIGHT_TEMPLATES) {
    if (template.requiresBirthChart && !birthChart) continue;
    
    const match = matchTemplateToContext(template, topTheme, celestialState);
    if (match) {
      insights.push(match);
    }
  }
  
  if (birthChart) {
    const transits = calculateTransits(celestialState.planets, birthChart);
    
    for (const transit of transits.slice(0, 3)) {
      const transitInsight = generateTransitInsight(transit, topTheme);
      if (transitInsight) {
        insights.push(transitInsight);
      }
    }
  }
  
  return insights.sort((a, b) => b.score - a.score);
}

function matchTemplateToContext(
  template: InsightTemplate,
  theme: ThemeScore,
  celestialState: CelestialState
): GeneratedInsight | null {
  const conditions = template.conditions;
  
  if (conditions.themes && !conditions.themes.includes(theme.theme)) {
    return null;
  }
  
  if (conditions.moonPhase && celestialState.moonPhase.phase !== conditions.moonPhase) {
    return null;
  }
  
  const text = template.templates[Math.floor(Math.random() * template.templates.length)]
    .replace('{theme}', theme.theme)
    .replace('{moonSign}', celestialState.moonPhase.sign)
    .replace('{nextSign}', getNextSign(celestialState.moonPhase.sign))
    .replace('{mercurySign}', celestialState.planets.mercury?.sign || '')
    .replace('{venusSign}', celestialState.planets.venus?.sign || '')
    .replace('{marsSign}', celestialState.planets.mars?.sign || '')
    .replace('{saturnSign}', celestialState.planets.saturn?.sign || '');
  
  return {
    id: template.id,
    text,
    score: template.priority + (theme.score * 0.3),
    celestialEvent: {
      type: 'moon-phase',
      sign: celestialState.moonPhase.sign,
      strength: 80,
      orb: 0,
      description: `${celestialState.moonPhase.phase} moon in ${celestialState.moonPhase.sign}`
    },
    themeMatch: theme,
    confidence: theme.score > 70 ? 'high' : theme.score > 40 ? 'medium' : 'low',
    requiresBirthChart: template.requiresBirthChart
  };
}

function generateTransitInsight(
  transit: Transit,
  theme: ThemeScore
): GeneratedInsight | null {
  const templates: Record<string, string[]> = {
    conjunction: [
      "{transitingPlanet} conjuncts your natal {natalPlanet} today. This {aspect}-degree alignment activates your {theme} matters with unusual intensity.",
      "The sky brings {transitingPlanet} to meet your natal {natalPlanet}. Your {theme} experiences receive concentrated cosmic attention now."
    ],
    opposition: [
      "{transitingPlanet} opposes your natal {natalPlanet}. This 180-degree aspect in your {theme} sector calls for balance and negotiation.",
      "{transitingPlanet} faces off with your natal {natalPlanet}. {theme} matters may feel polarized or require compromise."
    ],
    trine: [
      "{transitingPlanet} forms a harmonious trine to your natal {natalPlanet}. {theme} flows with natural ease under this 120-degree blessing.",
      "Your natal {natalPlanet} receives a 120-degree gift from {transitingPlanet}. {theme} matters find supportive cosmic winds."
    ],
    square: [
      "{transitingPlanet} squares your natal {natalPlanet}. This 90-degree tension around {theme} demands action and resolution.",
      "A cosmic square forms between {transitingPlanet} and your natal {natalPlanet}. {theme} challenges are growth opportunities in disguise."
    ],
    sextile: [
      "{transitingPlanet} sextiles your natal {natalPlanet}. This 60-degree opportunity aspect supports {theme} initiatives.",
      "Your natal {natalPlanet} receives a 60-degree nudge from {transitingPlanet}. {theme} matters benefit from cooperative energy."
    ]
  };
  
  const templateList = templates[transit.aspect];
  if (!templateList) return null;
  
  const text = templateList[Math.floor(Math.random() * templateList.length)]
    .replace('{transitingPlanet}', capitalize(transit.transitingPlanet))
    .replace('{natalPlanet}', capitalize(transit.natalPlanet))
    .replace('{aspect}', transit.aspect)
    .replace('{theme}', theme.theme);
  
  return {
    id: `transit-${transit.transitingPlanet}-${transit.natalPlanet}-${transit.aspect}`,
    text,
    score: transit.strength + 20,
    celestialEvent: {
      type: 'transit',
      planet: transit.transitingPlanet,
      secondaryPlanet: transit.natalPlanet,
      aspect: transit.aspect,
      orb: transit.orb,
      strength: transit.strength,
      description: `${transit.transitingPlanet} ${transit.aspect} natal ${transit.natalPlanet}`,
      isNatalTransit: true
    },
    themeMatch: theme,
    confidence: transit.orb < 2 ? 'high' : transit.orb < 5 ? 'medium' : 'low',
    requiresBirthChart: true
  };
}

// ============================================================================
// USER PREFERENCES & SCORING
// ============================================================================

export interface UserInsightPreferences {
  preferredThemes: ContentTheme[];
  preferredTone: 'scientific' | 'spiritual' | 'balanced';
  ratedInsights: Record<string, number>;
  dismissedPatterns: string[];
}

export function scoreInsights(
  insights: GeneratedInsight[],
  preferences?: UserInsightPreferences
): GeneratedInsight[] {
  return insights.map(insight => {
    let score = insight.score;
    
    if (preferences) {
      if (preferences.preferredThemes.includes(insight.themeMatch.theme)) {
        score += 10;
      }
      
      const historicalRating = preferences.ratedInsights[insight.id];
      if (historicalRating) {
        score += (historicalRating - 3) * 5;
      }
      
      if (preferences.dismissedPatterns.includes(insight.id)) {
        score -= 20;
      }
    }
    
    return { ...insight, score };
  }).sort((a, b) => b.score - a.score);
}

export function selectBestInsight(insights: GeneratedInsight[]): GeneratedInsight | null {
  const qualified = insights.filter(i => i.score >= ORACLE_CONFIG.THRESHOLD);
  return qualified[0] || null;
}

// ============================================================================
// UTILITIES
// ============================================================================

function getNextSign(currentSign: string): string {
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const idx = signs.indexOf(currentSign.toLowerCase());
  return signs[(idx + 1) % 12];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// EXPORT
// ============================================================================

export const OracleEngine = {
  analyzeContent,
  getCurrentCelestialState,
  calculateTransits,
  generateInsights,
  selectBestInsight,
  ORACLE_CONFIG
};

export default OracleEngine;
