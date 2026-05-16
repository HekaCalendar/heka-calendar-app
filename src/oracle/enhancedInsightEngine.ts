/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ENHANCED ORACLE INSIGHT ENGINE 🔮
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The Crown Jewel - Advanced astrological insight generation with:
 * - Crisis detection & safety protocols
 * - Sentiment & emotional analysis
 * - Dynamic content-aware insights
 * - AI-powered personalization
 * - Birth chart integration
 * 
 * This engine transforms simple template matching into truly personalized,
 * emotionally intelligent cosmic guidance.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { aiProviderManager } from '../astrology/services/ai/aiProvider';
import { templateLibrary } from '../astrology/services/guidance/templates/templateLibrary';
import { OracleEngine } from './oracleEngine';
import { calculatePersonalTransits, getCurrentPlanetaryPositions, type BirthChart, type PersonalTransit } from './birthChartIntegration';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface EmotionalAnalysis {
  primaryEmotion: string;
  intensity: number; // 0-100
  valence: 'positive' | 'negative' | 'neutral' | 'mixed';
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  themes: string[];
}

export interface CrisisIndicators {
  isCrisis: boolean;
  type?: 'suicide' | 'self-harm' | 'severe-depression' | 'violence' | 'grief';
  severity: number; // 0-100
  keywords: string[];
  requiresResources: boolean;
}

export interface ContentAnalysis {
  themes: string[];
  archetypes: string[];
  emotionalProfile: EmotionalAnalysis;
  crisisCheck: CrisisIndicators;
  entities: string[]; // People, places mentioned
  sentiment: {
    score: number; // -1 to 1
    confidence: number;
  };
  wordCount: number;
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface EnhancedInsight {
  id: string;
  text: string;
  type: 'general' | 'crisis' | 'celebration' | 'challenge' | 'transition' | 'reflection';
  
  // Metadata
  confidence: number;
  strength: number;
  uniqueness: number; // How unique is this insight (0-100)
  
  // Celestial context
  celestialEvent: {
    type: string;
    description: string;
    strength: number;
    timing: {
      peak: string;
      duration: string;
    };
  };
  
  // Birth chart connection
  birthChartConnection?: {
    activatedPlanet: string;
    activatedHouse: number;
    aspectType: string;
    natalPosition: string;
    interpretation: string;
  };
  
  // AI-enhanced fields
  aiEnhanced?: boolean;
  poeticSummary?: string;
  affirmations: string[];
  rituals: string[];
  journalPrompts: string[];
  actionItems: string[];
  
  // Crisis support
  supportResources?: {
    message: string;
    resources: Array<{
      name: string;
      contact: string;
      available: string;
    }>;
  };
  
  // UI metadata
  visualTheme: {
    color: string;
    icon: string;
    gradient: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLANG & MISSPELLING NORMALIZATION
// Expands internet slang, abbreviations, and common misspellings before safety scanning
// ═══════════════════════════════════════════════════════════════════════════════

const SLANG_DICTIONARY: Record<string, string> = {
  // Suicide-related slang
  'kms': 'kill myself',
  'kys': 'kill yourself',
  'kml': 'kill me later',
  'unalive': 'kill',
  'unalive myself': 'kill myself',
  'unalive me': 'kill me',
  'rope': 'hang myself',
  'roping': 'hanging',
  'final yeet': 'kill myself',
  'yeet myself': 'kill myself',
  'sewerslide': 'suicide',
  'suey slide': 'suicide',
  'commit toaster bath': 'kill myself',
  'commit oof': 'kill myself',
  'i want to not exist': 'i want to die',
  'dont wanna be here': 'dont want to live',
  'dont want to be here': 'dont want to live',
  'not gonna make it': 'going to kill myself',
  'ngmi': 'not going to make it',
  'its over': 'i want to die',
  'over for me': 'i want to die',
  'better off without me': 'better off dead',
  'everyone better off': 'better off dead',
  'end it all': 'end my life',
  'cant take it': 'cant go on',
  'cant do this': 'cant go on',
  'done with life': 'want to die',
  'no point': 'no reason to live',
  'whats the point': 'no reason to live',
  // Self-harm slang
  'sh': 'self harm',
  's/h': 'self harm',
  'selfharm': 'self harm',
  'slicey dicey': 'cut myself',
  'barcode': 'cut myself',
  'styrofoam': 'cut to fat',
  'beans': 'cut deeply',
  'cat scratches': 'self harm',
  'final destination': 'kill myself',
  'go to sleep forever': 'kill myself',
  'permanent sleep': 'kill myself',
  'long sleep': 'kill myself',
  'eternal rest': 'kill myself',
  // Depression slang
  'cant get up': 'cant get out of bed',
  'bedrotting': 'cant get out of bed',
  'bed rot': 'cant get out of bed',
  'doomer': 'severe depression',
  'doompilled': 'severe depression',
  'blackpilled': 'severe depression',
  'nothing feel real': 'nothing matters',
  'dissociating': 'empty inside',
  'derealization': 'empty inside',
  'depersonalization': 'empty inside',
  'executive dysfunction': 'cant function',
  'cant shower': 'cant function',
  'cant eat': 'cant function',
  'cant brush teeth': 'cant function',
  // Violence slang
  'going postal': 'violent thoughts',
  'hulk out': 'anger out of control',
  'see red': 'rage',
  'snap': 'violent thoughts',
};

/** Common misspellings of crisis keywords */
const MISSPELLING_MAP: Record<string, string> = {
  'suicde': 'suicide',
  'suicidial': 'suicidal',
  'suicidle': 'suicidal',
  'sucide': 'suicide',
  'sucidal': 'suicidal',
  'deppresed': 'depressed',
  'deppression': 'depression',
  'depresed': 'depressed',
  'depressionn': 'depression',
  'depresion': 'depression',
  'hopelss': 'hopeless',
  'hoples': 'hopeless',
  'wortless': 'worthless',
  'worthles': 'worthless',
  'worthlesness': 'worthlessness',
  'anxius': 'anxious',
  'anxeity': 'anxiety',
  'panick': 'panic',
  'overwelmed': 'overwhelmed',
  'overwelming': 'overwhelming',
  'exhaustted': 'exhausted',
  'exausted': 'exhausted',
  'emptty': 'empty',
  'numbness': 'numb',
  'paralized': 'paralyzed',
  'paralysed': 'paralyzed',
  'cripeling': 'crippling',
};

/**
 * Normalize text for safety scanning:
 * 1. Lowercase
 * 2. Expand slang abbreviations
 * 3. Fix common misspellings
 * 4. Return both original and normalized for dual scanning
 */
function normalizeTextForSafety(text: string): string {
  let normalized = text.toLowerCase();
  
  // Expand multi-word slang first (longest first to avoid partial matches)
  const multiWordSlang = Object.entries(SLANG_DICTIONARY)
    .filter(([k]) => k.includes(' '))
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [slang, expansion] of multiWordSlang) {
    normalized = normalized.replace(new RegExp(slang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), expansion);
  }
  
  // Expand single-word slang (as whole words)
  const singleWordSlang = Object.entries(SLANG_DICTIONARY)
    .filter(([k]) => !k.includes(' '));
  
  for (const [slang, expansion] of singleWordSlang) {
    normalized = normalized.replace(new RegExp(`\\b${slang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), expansion);
  }
  
  // Fix misspellings
  for (const [misspelled, correct] of Object.entries(MISSPELLING_MAP)) {
    normalized = normalized.replace(new RegExp(`\\b${misspelled}\\b`, 'gi'), correct);
  }
  
  return normalized;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRISIS DETECTION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

const CRISIS_PATTERNS: Record<string, { patterns: RegExp[]; severity: number; type: CrisisIndicators['type'] }> = {
  suicide: {
    patterns: [
      /\b(kill\s+(?:myself|me)|suicide|suicidal|end\s+(?:it|my\s+life)|not\s+worth\s+living|better\s+off\s+dead|want\s+to\s+die|don't\s+want\s+to\s+live)\b/gi,
      /\b(no\s+reason\s+to\s+live|can't\s+go\s+on|give\s+up|hopeless|worthless)\b/gi,
      /\b(hurt\s+myself|self.?harm|cut\s+myself|end\s+the\s+pain)\b/gi,
      /\b(hang\s+(?:myself|me)|jump\s+(?:off|from)|overdose|pills\s+to\s+end)\b/gi,
      /\b(want\s+to\s+disappear|not\s+be\s+here|cease\s+to\s+exist|not\s+wake\s+up)\b/gi,
    ],
    severity: 100,
    type: 'suicide'
  },
  selfHarm: {
    patterns: [
      /\b(cut\s+(?:myself|me)|self.?harm|hurt\s+myself|burn\s+myself|punish\s+myself)\b/gi,
      /\b(want\s+to\s+feel\s+pain|deserve\s+to\s+suffer|hurt\s+my\s+body)\b/gi,
      /\b(scratch\s+myself|hit\s+myself|pinch\s+myself|pull\s+my\s+hair)\b/gi,
      /\b(blood\s+make\s+me\s+feel|seeing\s+blood\s+calm|pain\s+is\s+the\s+only)\b/gi,
    ],
    severity: 90,
    type: 'self-harm'
  },
  severeDepression: {
    patterns: [
      /\b(can't\s+get\s+out\s+of\s+bed|no\s+energy|empty\s+inside|numb|nothing\s+matters)\b/gi,
      /\b(deep\s+depression|severe\s+depression|clinical\s+depression|major\s+depression)\b/gi,
      /\b(crippling\s+depression|can't\s+function|paralyzed\s+by\s+sadness)\b/gi,
      /\b(dont\s+care\s+anymore|lost\s+all\s+hope|given\s+up|why\s+bother)\b/gi,
      /\b(cant\s+remember\s+last\s+time\s+happy|dont\s+feel\s+anything|emotional\s+void)\b/gi,
    ],
    severity: 80,
    type: 'severe-depression'
  },
  violence: {
    patterns: [
      /\b(want\s+to\s+kill|hurt\s+someone|violent\s+thoughts|rage|anger\s+out\s+of\s+control)\b/gi,
      /\b(want\s+to\s+hit|feel\s+like\s+hurting|fantasies\s+about\s+violence)\b/gi,
    ],
    severity: 85,
    type: 'violence'
  },
  grief: {
    patterns: [
      /\b(lost\s+(?:someone|them|him|her)|died|death\s+of|grief|mourning|can't\s+go\s+on\s+without)\b/gi,
      /\b(never\s+see\s+again|gone\s+forever|miss\s+them\s+so\s+much|broken\s+without)\b/gi,
    ],
    severity: 70,
    type: 'grief'
  }
};

const SUPPORT_RESOURCES = {
  suicide: {
    message: "I'm hearing that you're going through an incredibly difficult time. Your life has value, and there are people who want to help right now.",
    resources: [
      { name: '988 Suicide & Crisis Lifeline', contact: '988 or 1-800-273-8255', available: '24/7, Free & Confidential' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7, Free' },
      { name: 'International Association for Suicide Prevention', contact: 'iasp.info/resources/Crisis_Centres', available: 'Find local resources' },
    ]
  },
  selfHarm: {
    message: "I notice you might be hurting. Please know that pain can be worked through with support—you don't have to carry this alone.",
    resources: [
      { name: 'Self-Harm Crisis Support', contact: '1-800-273-8255', available: '24/7' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' },
      { name: 'National Alliance on Mental Health', contact: '1-800-950-6264', available: 'Mon-Fri 10am-10pm ET' },
    ]
  },
  severeDepression: {
    message: "Depression can make everything feel heavy and hopeless. These feelings are real, but they can shift with support and time.",
    resources: [
      { name: 'SAMHSA National Helpline', contact: '1-800-662-4357', available: '24/7, Free, Confidential' },
      { name: 'National Hopeline Network', contact: '1-800-784-2433', available: '24/7' },
      { name: 'Psychology Today Therapist Finder', contact: 'psychologytoday.com', available: 'Find local therapists' },
    ]
  },
  violence: {
    message: "Intense anger can feel overwhelming. There are ways to channel this energy safely and understand what's beneath it.",
    resources: [
      { name: 'National Domestic Violence Hotline', contact: '1-800-799-7233', available: '24/7' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' },
      { name: 'SAMHSA Helpline', contact: '1-800-662-4357', available: '24/7' },
    ]
  },
  grief: {
    message: "Grief is love with nowhere to go. The pain you feel is a testament to how much you cared. You don't have to walk this path alone.",
    resources: [
      { name: 'GriefShare Support Groups', contact: 'griefshare.org', available: 'Find local groups' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' },
      { name: 'The Compassionate Friends', contact: 'compassionatefriends.org', available: 'Grief support for bereaved parents' },
    ]
  }
};

function detectCrisis(text: string): CrisisIndicators {
  const originalLower = text.toLowerCase();
  const normalizedText = normalizeTextForSafety(text);
  let maxSeverity = 0;
  let detectedType: CrisisIndicators['type'] = undefined;
  const allKeywords: string[] = [];
  
  // Scan BOTH original and normalized text for maximum coverage
  const textsToScan = [originalLower, normalizedText];
  
  for (const scanText of textsToScan) {
    for (const [_category, data] of Object.entries(CRISIS_PATTERNS)) {
      for (const pattern of data.patterns) {
        const matches = scanText.match(pattern);
        if (matches) {
          allKeywords.push(...matches);
          if (data.severity > maxSeverity) {
            maxSeverity = data.severity;
            detectedType = data.type;
          }
        }
      }
    }
  }
  
  return {
    isCrisis: maxSeverity > 0,
    type: detectedType,
    severity: maxSeverity,
    keywords: [...new Set(allKeywords)],
    requiresResources: maxSeverity >= 70
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SENTIMENT & EMOTIONAL ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

const EMOTION_KEYWORDS: Record<string, { words: string[]; valence: EmotionalAnalysis['valence'] }> = {
  joy: { words: ['happy', 'joy', 'excited', 'elated', 'thrilled', 'bliss', 'ecstatic', 'delighted'], valence: 'positive' },
  gratitude: { words: ['grateful', 'thankful', 'blessed', 'appreciative', 'fortunate'], valence: 'positive' },
  love: { words: ['love', 'adore', 'cherish', 'affection', 'devoted', 'passionate'], valence: 'positive' },
  hope: { words: ['hope', 'optimistic', 'promising', 'looking forward', 'excited for'], valence: 'positive' },
  sadness: { words: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'gloomy', 'sorrow'], valence: 'negative' },
  anger: { words: ['angry', 'furious', 'rage', 'irritated', 'frustrated', 'annoyed', 'mad'], valence: 'negative' },
  fear: { words: ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'panic', 'dread'], valence: 'negative' },
  shame: { words: ['ashamed', 'embarrassed', 'guilty', 'humiliated', 'mortified'], valence: 'negative' },
  confusion: { words: ['confused', 'lost', 'uncertain', 'unsure', 'disoriented', 'bewildered'], valence: 'mixed' },
  longing: { words: ['miss', 'long for', 'yearn', 'ache for', 'nostalgic', 'wistful'], valence: 'mixed' },
};

// Theme-to-emotion inference when no explicit emotion words are found
const THEME_EMOTION_INFERENCE: Record<string, { emotion: string; valence: EmotionalAnalysis['valence'] }> = {
  beginnings: { emotion: 'anticipation', valence: 'mixed' },
  endings: { emotion: 'release', valence: 'mixed' },
  relationships: { emotion: 'longing', valence: 'mixed' },
  career: { emotion: 'drive', valence: 'positive' },
  introspection: { emotion: 'depth', valence: 'mixed' },
  action: { emotion: 'fire', valence: 'positive' },
  communication: { emotion: 'clarity', valence: 'positive' },
  creativity: { emotion: 'inspiration', valence: 'positive' },
  healing: { emotion: 'tenderness', valence: 'mixed' },
  conflict: { emotion: 'tension', valence: 'negative' },
  joy: { emotion: 'radiance', valence: 'positive' },
  fear: { emotion: 'vigilance', valence: 'negative' },
  change: { emotion: 'flux', valence: 'mixed' },
  stability: { emotion: 'groundedness', valence: 'positive' },
};

function analyzeEmotions(text: string): EmotionalAnalysis {
  const lowerText = text.toLowerCase();
  const emotionScores: Record<string, number> = {};
  
  for (const [emotion, data] of Object.entries(EMOTION_KEYWORDS)) {
    let score = 0;
    for (const word of data.words) {
      const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > 0) {
      emotionScores[emotion] = score;
    }
  }
  
  // Find primary emotion
  const sorted = Object.entries(emotionScores).sort((a, b) => b[1] - a[1]);
  let primaryEmotion = sorted[0]?.[0];
  let inferredValence: EmotionalAnalysis['valence'] = 'neutral';
  
  // If no emotion keywords matched, infer from themes or language patterns
  if (!primaryEmotion) {
    const themeScores = OracleEngine.analyzeContent(text);
    const topTheme = themeScores[0]?.theme;
    if (topTheme && THEME_EMOTION_INFERENCE[topTheme]) {
      primaryEmotion = THEME_EMOTION_INFERENCE[topTheme].emotion;
      inferredValence = THEME_EMOTION_INFERENCE[topTheme].valence;
    } else {
      // Language-based inference
      if (/\b(overwhelmed|exhausted|tired|drained)\b/i.test(text)) {
        primaryEmotion = 'weariness';
        inferredValence = 'negative';
      } else if (/\b(calm|peaceful|quiet|still|centered)\b/i.test(text)) {
        primaryEmotion = 'serenity';
        inferredValence = 'positive';
      } else if (/\b(uncertain|maybe|perhaps|don't know|unsure)\b/i.test(text)) {
        primaryEmotion = 'uncertainty';
        inferredValence = 'mixed';
      } else if (/\b(waiting|upcoming|soon|anticipate|expect)\b/i.test(text)) {
        primaryEmotion = 'anticipation';
        inferredValence = 'mixed';
      } else {
        primaryEmotion = 'stillness';
        inferredValence = 'neutral';
      }
    }
  }
  
  const intensity = Math.min(100, sorted[0]?.[1] * 20 || 35);
  
  // Determine valence from matched emotions, or use inference
  let valence: EmotionalAnalysis['valence'] = inferredValence;
  const positiveCount = sorted.filter(([e]) => EMOTION_KEYWORDS[e]?.valence === 'positive').reduce((a, [_, s]) => a + s, 0);
  const negativeCount = sorted.filter(([e]) => EMOTION_KEYWORDS[e]?.valence === 'negative').reduce((a, [_, s]) => a + s, 0);
  
  if (positiveCount > negativeCount * 1.5) valence = 'positive';
  else if (negativeCount > positiveCount * 1.5) valence = 'negative';
  else if (positiveCount > 0 || negativeCount > 0) valence = 'mixed';
  
  // Determine urgency
  let urgency: EmotionalAnalysis['urgency'] = 'low';
  const crisis = detectCrisis(text);
  if (crisis.isCrisis) urgency = 'crisis';
  else if (intensity > 80) urgency = 'high';
  else if (intensity > 50) urgency = 'medium';
  
  return {
    primaryEmotion,
    intensity,
    valence,
    urgency,
    themes: sorted.slice(0, 3).map(([e]) => e)
  };
}

function analyzeSentiment(text: string): { score: number; confidence: number } {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'beautiful', 'love', 'happy', 'joy', 'excited', 'grateful', 'blessed', 'hope', 'optimistic'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'angry', 'fear', 'worried', 'anxious', 'depressed', 'hopeless', 'worthless', 'broken', 'pain'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const word of positiveWords) {
    const matches = lowerText.match(new RegExp(`\\b${word}\\w*\\b`, 'gi'));
    if (matches) positiveCount += matches.length;
  }
  
  for (const word of negativeWords) {
    const matches = lowerText.match(new RegExp(`\\b${word}\\w*\\b`, 'gi'));
    if (matches) negativeCount += matches.length;
  }
  
  const total = positiveCount + negativeCount;
  if (total === 0) return { score: 0, confidence: 0.5 };
  
  return {
    score: (positiveCount - negativeCount) / total,
    confidence: Math.min(1, total / 10)
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeContent(content: string): ContentAnalysis {
  // Get themes from Oracle Engine
  const themeScores = OracleEngine.analyzeContent(content);
  const themes = themeScores.slice(0, 3).map(t => t.theme);
  const archetypes = themeScores.slice(0, 2).map(t => t.archetype);
  
  // Emotional analysis
  const emotionalProfile = analyzeEmotions(content);
  
  // Crisis detection
  const crisisCheck = detectCrisis(content);
  
  // Sentiment
  const sentiment = analyzeSentiment(content);
  
  // Extract entities (simple approach)
  const personMatches = content.match(/\b[A-Z][a-z]+\b/g) || [];
  const entities = [...new Set(personMatches)].slice(0, 5);
  
  // Complexity
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = content.length / (sentences.length || 1);
  let complexity: ContentAnalysis['complexity'] = 'simple';
  if (avgSentenceLength > 80) complexity = 'complex';
  else if (avgSentenceLength > 40) complexity = 'moderate';
  
  return {
    themes,
    archetypes,
    emotionalProfile,
    crisisCheck,
    entities,
    sentiment,
    wordCount: content.split(/\s+/).length,
    complexity
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT MIRRORING - Extract specific echoes from user's writing
// ═══════════════════════════════════════════════════════════════════════════════

interface ContentMirror {
  concern: string | null;
  keyPhrases: string[];
  hasQuestion: boolean;
  firstSentence: string;
}

function extractContentMirror(content: string): ContentMirror {
  const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 3);
  const firstSentence = sentences[0] || '';
  
  // Extract "I feel...", "I am...", "My..." patterns
  const selfPatterns = [
    /\b(I feel\s+[^.]+)/i,
    /\b(I am\s+(?:worried|excited|nervous|hopeful|afraid|grateful|tired|overwhelmed|ready)\s+[^.]*)/i,
    /\b(My\s+\w+\s+(?:is|are|feels|seems|looks)\s+[^.]+)/i,
    /\b(I keep\s+[^.]+)/i,
    /\b(I want\s+[^.]+)/i,
    /\b(I need\s+[^.]+)/i,
    /\b(I don't\s+[^.]+)/i,
    /\b(I can't\s+[^.]+)/i,
  ];
  
  const keyPhrases: string[] = [];
  for (const pattern of selfPatterns) {
    const match = content.match(pattern);
    if (match && match[1] && match[1].length > 5 && match[1].length < 120) {
      keyPhrases.push(match[1].trim());
    }
  }
  
  // Deduplicate and limit
  const uniquePhrases = [...new Set(keyPhrases)].slice(0, 3);
  
  // Determine the core concern
  let concern: string | null = null;
  if (uniquePhrases.length > 0) {
    concern = uniquePhrases[0];
  } else if (firstSentence.length > 5 && firstSentence.length < 100) {
    concern = firstSentence;
  }
  
  return {
    concern,
    keyPhrases: uniquePhrases,
    hasQuestion: content.includes('?'),
    firstSentence,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC INSIGHT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickNRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

async function generateCrisisInsight(
  _content: string,
  analysis: ContentAnalysis,
  celestialState: Awaited<ReturnType<typeof OracleEngine.getCurrentCelestialState>>,
  birthChart?: BirthChart
): Promise<EnhancedInsight> {
  const type = analysis.crisisCheck.type!;
  const resourceKey = type === 'self-harm' ? 'selfHarm' : type;
  const resources = SUPPORT_RESOURCES[resourceKey as keyof typeof SUPPORT_RESOURCES];
  
  const moonSign = celestialState.moonPhase.sign;
  const chiron = celestialState.planets.chiron || celestialState.planets.neptune;
  
  let text = resources.message;
  
  if (birthChart && chiron) {
    text += `\n\nThe current celestial weather shows ${chiron.sign} energy prominent—a sign that healing is possible, even when it feels distant. `;
    text += `The Moon in ${moonSign} reminds us that all states are temporary, even the most painful ones.`;
  } else {
    text += `\n\nThe Moon in ${moonSign} reminds us that emotions, like the tides, shift and change. This intensity won't last forever.`;
  }
  
  return {
    id: `crisis-${Date.now()}`,
    text,
    type: 'crisis',
    confidence: 95,
    strength: 100,
    uniqueness: 100,
    celestialEvent: {
      type: 'crisis-support',
      description: 'Compassionate cosmic guidance',
      strength: 100,
      timing: { peak: 'Now', duration: 'Immediate support' }
    },
    supportResources: {
      message: "Please reach out to these resources—they're here for you right now:",
      resources: resources.resources
    },
    affirmations: ['I am worthy of support and healing', 'This pain is temporary', 'I choose to stay'],
    rituals: ['Place hand on heart, breathe deeply for 60 seconds', 'Text or call one person you trust'],
    journalPrompts: ['What would I say to a dear friend feeling this way?', 'What small step toward help can I take right now?'],
    actionItems: ['Contact a support resource above', 'Reach out to someone you trust', 'Consider professional support'],
    visualTheme: {
      color: '#ef4444',
      icon: '🆘',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
    }
  };
}

async function generateStandardInsight(
  content: string,
  analysis: ContentAnalysis,
  celestialState: Awaited<ReturnType<typeof OracleEngine.getCurrentCelestialState>>,
  birthChart?: BirthChart,
  personalTransits?: PersonalTransit[]
): Promise<EnhancedInsight> {
  const emotions = analysis.emotionalProfile;
  const themes = analysis.themes;
  const moonPhase = celestialState.moonPhase;
  
  let type: EnhancedInsight['type'] = 'general';
  if (emotions.valence === 'positive' && emotions.intensity > 60) type = 'celebration';
  else if (emotions.valence === 'negative' && emotions.intensity > 60) type = 'challenge';
  else if (themes.includes('change') || themes.includes('beginnings')) type = 'transition';
  else if (themes.includes('introspection')) type = 'reflection';
  
  let celestialDescription = `${moonPhase.phase} Moon in ${moonPhase.sign}`;
  let strength = 50 + emotions.intensity / 2;
  
  let birthChartConnection: EnhancedInsight['birthChartConnection'] = undefined;
  if (birthChart && personalTransits && personalTransits.length > 0) {
    const strongestTransit = personalTransits[0];
    birthChartConnection = {
      activatedPlanet: strongestTransit.transitingPlanet,
      activatedHouse: strongestTransit.activatedHouse,
      aspectType: strongestTransit.aspect,
      natalPosition: `${strongestTransit.natalPlanet} in ${strongestTransit.natalSign}`,
      interpretation: `${strongestTransit.transitingPlanet} ${strongestTransit.aspect} your natal ${strongestTransit.natalPlanet}`
    };
    celestialDescription += ` + ${strongestTransit.transitingPlanet} ${strongestTransit.aspect} natal ${strongestTransit.natalPlanet}`;
    strength = strongestTransit.strength;
  }
  
  // Generate base insight text
  let text = await generateDynamicText(content, analysis, celestialState, birthChartConnection);
  
  // Try AI enhancement if available
  let aiEnhanced = false;
  let poeticSummary: string | undefined;
  let affirmations: string[] = [];
  let rituals: string[] = [];
  let journalPrompts: string[] = [];
  
  try {
    const aiResult = await tryAIEnhancement(content, text, analysis, celestialState, birthChartConnection);
    if (aiResult) {
      text = aiResult.text;
      poeticSummary = aiResult.poeticSummary;
      affirmations = aiResult.affirmations;
      rituals = aiResult.rituals;
      journalPrompts = aiResult.journalPrompts;
      aiEnhanced = true;
    }
  } catch {
    // Fallback to local generation
  }
  
  if (affirmations.length === 0) {
    affirmations = generateLocalAffirmations(analysis, themes, content);
  }
  if (rituals.length === 0) {
    rituals = generateLocalRituals(moonPhase.phase, themes, emotions);
  }
  if (journalPrompts.length === 0) {
    journalPrompts = generateLocalJournalPrompts(analysis, content, celestialState, birthChartConnection);
  }
  
  const visualTheme = getVisualTheme(type, emotions);
  
  return {
    id: `insight-${Date.now()}`,
    text,
    type,
    confidence: aiEnhanced ? 90 : 75,
    strength,
    uniqueness: aiEnhanced ? 85 : 60,
    celestialEvent: {
      type: moonPhase.phase,
      description: celestialDescription,
      strength,
      timing: {
        peak: 'Current',
        duration: 'Active now'
      }
    },
    birthChartConnection,
    aiEnhanced,
    poeticSummary,
    affirmations,
    rituals,
    journalPrompts,
    actionItems: generateActionItems(analysis, themes, content, celestialState, birthChartConnection),
    visualTheme
  };
}

async function generateDynamicText(
  content: string,
  analysis: ContentAnalysis,
  celestialState: Awaited<ReturnType<typeof OracleEngine.getCurrentCelestialState>>,
  birthChartConnection?: EnhancedInsight['birthChartConnection']
): Promise<string> {
  const emotions = analysis.emotionalProfile;
  const moonSign = celestialState.moonPhase.sign;
  const moonPhase = celestialState.moonPhase.phase;
  const themes = analysis.themes;
  const mirror = extractContentMirror(content);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // OPENING POOL - Varied, human-feeling openings
  // ═══════════════════════════════════════════════════════════════════════════════
  const openingPool: Record<string, string[]> = {
    positive: [
      `Something in what you've written glows with ${emotions.primaryEmotion}.`,
      `I can feel the ${emotions.primaryEmotion} lifting off the page.`,
      `Your words carry the unmistakable signature of ${emotions.primaryEmotion}.`,
      `There's a warmth here—a current of ${emotions.primaryEmotion} moving through your story.`,
      `The energy of ${emotions.primaryEmotion} is alive in these lines.`,
    ],
    negative: [
      `I hear the weight of ${emotions.primaryEmotion} in what you've shared.`,
      `There's a heaviness here, and it deserves to be witnessed.`,
      `Your words hold ${emotions.primaryEmotion} like a stone held in the palm.`,
      `I won't look away from the ${emotions.primaryEmotion} you've placed here.`,
      `Something tender and difficult is moving through you—${emotions.primaryEmotion}.`,
    ],
    mixed: [
      `There's a complexity in your words—a weave of light and shadow.`,
      `I sense ${emotions.primaryEmotion} threading through contradictions.`,
      `Your entry holds more than one truth, and that's exactly right.`,
      `There's a quiet intensity here, a ${emotions.primaryEmotion} that asks for patience.`,
      `What you've written doesn't need to simplify itself. I see the ${emotions.primaryEmotion}.`,
    ],
    neutral: [
      `There's a quiet presence in what you've written.`,
      `Your words arrive like still water—clear, unhurried, honest.`,
      `I notice a kind of ${emotions.primaryEmotion} here, a space between storms.`,
      `There's something grounding in this entry, a moment captured without drama.`,
      `What you've shared feels like a breath held and then released.`,
    ],
  };
  
  const valenceKey = (['positive','negative','mixed','neutral'] as const).includes(emotions.valence) ? emotions.valence : 'neutral';
  let text = pickRandom(openingPool[valenceKey]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // CONTENT MIRROR - Echo back what they actually wrote about
  // ═══════════════════════════════════════════════════════════════════════════════
  if (mirror.concern) {
    const mirrorPhrases = [
      ` When you wrote, "${mirror.concern}," it reminded me that the sky doesn't speak in generalities—it speaks in specifics.`,
      ` I keep returning to this: "${mirror.concern}." The stars don't deal in abstractions; they respond to exactly this.`,
      ` "${mirror.concern}" — this is the thread the cosmos is pulling on right now.`,
    ];
    text += pickRandom(mirrorPhrases);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // CELESTIAL BRIDGE - Connect moon/sign to their situation
  // ═══════════════════════════════════════════════════════════════════════════════
  const celestialBridgePool: Record<string, string[]> = {
    new: [
      ` The New Moon in ${moonSign} is a door held open. It asks: what are you willing to begin?`,
      ` With the Moon dark and renewing in ${moonSign}, the soil is soft. Plant something here.`,
      ` The New Moon in ${moonSign} doesn't demand answers—only intentions.`,
    ],
    waxing: [
      ` The waxing Moon in ${moonSign} is gathering light, and so are you.`,
      ` As the Moon grows in ${moonSign}, momentum builds. What you feed now will swell.`,
      ` The ${moonSign} waxing Moon is a craftsman sharpening tools. Precision matters now.`,
    ],
    full: [
      ` The Full Moon in ${moonSign} throws everything into high relief. Nothing hides.`,
      ` Under the ${moonSign} Full Moon, what has been building reaches a point of clarity.`,
      ` The Moon is full in ${moonSign}, and that means culmination—something is ready to be seen.`,
    ],
    waning: [
      ` The waning Moon in ${moonSign} is a quiet exhale. Letting go is not failure; it is rhythm.`,
      ` As the Moon releases light in ${moonSign}, you are asked to release what has completed its work.`,
      ` The ${moonSign} waning Moon teaches that harvest includes compost.`,
    ],
  };
  
  const phaseKey = (['new','waxing','full','waning'] as const).find(k => moonPhase.includes(k)) || 'new';
  text += pickRandom(celestialBridgePool[phaseKey]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // THEMATIC GUIDANCE - Specific, non-generic advice
  // ═══════════════════════════════════════════════════════════════════════════════
  const themeGuidance: Record<string, Record<string, string[]>> = {
    beginnings: {
      positive: [`This is a threshold. Cross it with one small, imperfect step.`, `You don't need the whole map—only the courage to start.`],
      negative: ['Beginning while afraid is still beginning. The fear is just weather.', 'New paths often feel like wrong turns before they feel like home.'],
      mixed: ['Every beginning contains an ending. Hold both.', 'The threshold is narrow, but it leads somewhere wider.'],
      neutral: [`A beginning doesn't have to feel dramatic to be real.`, `The seed doesn't announce itself. It simply splits open.`],
    },
    endings: {
      positive: [`Let completion be its own reward.`, `Something is making room. Don't rush to fill it.`],
      negative: ['Grief is the price of having cared. Pay it without shame.', 'Endings are not evidence of failure. They are evidence of participation.'],
      mixed: ['What is ending taught you something. Carry the lesson, release the form.', 'There is beauty in the final chapter. Read it slowly.'],
      neutral: ['Closure is a door that closes so you can hear other doors opening.', 'An ending is just a shape change.'],
    },
    relationships: {
      positive: ['Love is a practice, not a destination. Keep showing up.', 'Connection thrives on the small attentions.'],
      negative: ['Distance can be a teacher too. What is it showing you?', 'Some relationships need boundary more than fixing.'],
      mixed: ['The heart is large enough to hold contradiction.', 'What you want and what you need may be negotiating.'],
      neutral: ['Relationships are mirrors. Notice what this one reflects.', 'Sometimes the most loving thing is honest observation.'],
    },
    career: {
      positive: ['Your work is finding its shape. Keep shaping.', 'Recognition is nice, but integrity is the real currency.'],
      negative: ['Ambition can exhaust itself. Rest is also productive.', 'A setback in one direction is often a rerouting.'],
      mixed: ['Your calling and your current job may be two different conversations.', 'Build the thing only you can build.'],
      neutral: ['Steady effort compounds invisibly. Trust the arithmetic.', 'Discipline is a love language you speak to your future self.'],
    },
    introspection: {
      positive: ['Self-knowledge is the beginning of all real power.', 'The interior world is vast. You are mapping it well.'],
      negative: ['The dark corners of the self are not enemies. They are forgotten rooms.', 'Introspection can become rumination. Let there be windows.'],
      mixed: ['You are allowed to contain multitudes. Even contradictory ones.', 'The self you are becoming is watching you become it.'],
      neutral: [`A quiet mind is not an empty mind. It is a listening mind.`, `Depth doesn't always need to be dramatic.`],
    },
    creativity: {
      positive: [`Make the thing. The world needs your specific frequency.`, `Inspiration is a guest. Welcome it, but don't wait for it.`],
      negative: ['Creative blocks are often fear in disguise. Name the fear.', 'The ugly draft is closer to the truth than the perfect blank page.'],
      mixed: ['Art often comes from the tension between vision and limitation.', 'Let the work teach you what it wants to be.'],
      neutral: ['Creativity is a habit before it is a muse.', 'Show up for the practice, not the applause.'],
    },
    healing: {
      positive: ['Recovery is not linear, but it is real.', 'Your body and spirit are collaborating. Trust their timing.'],
      negative: ['Healing sometimes looks like nothing happening. That is also work.', 'Wounds need witness before they need fixing.'],
      mixed: ['Healing and hurting can coexist. That is the nature of repair.', 'Some things heal into scars that tell stories.'],
      neutral: ['Restoration happens in small increments. Notice them.', 'The healer in you is patient.'],
    },
    conflict: {
      positive: ['Conflict can clear the air if both sides are willing to breathe.', 'Opposition sharpens definition.'],
      negative: ['Not every battle is yours to fight. Some are invitations to walk away.', 'Anger is information. Listen to what it protects.'],
      mixed: ['Tension is energy. It can destroy or it can create.', 'What is the conflict asking you to become?'],
      neutral: ['Disagreement is not disaster. It is data.', 'Sometimes the most strategic move is stillness.'],
    },
    action: {
      positive: [`Motion creates clarity. Move, then adjust.`, `Your will is a fire. Use it, but don't let it consume the house.`],
      negative: ['Forced action is often worse than paused intention.', 'Courage is not the absence of fear. It is action with fear present.'],
      mixed: ['The right action at the wrong time is the wrong action.', 'Discernment is a form of action too.'],
      neutral: ['Small steps count. Momentum is built from minutiae.', 'Action is a language. Speak clearly.'],
    },
    change: {
      positive: ['Transformation is the only constant. You are riding it well.', 'Every version of you was necessary. This one is too.'],
      negative: ['Change can feel like loss because it is loss—of a familiar self.', 'Instability is temporary. Your center is not.'],
      mixed: ['You are the bridge between what was and what will be.', 'Change asks you to let go before you know what comes next.'],
      neutral: [`Adaptation is a slow intelligence. You are learning it.`, `The new shape hasn't settled yet. Give it time.`],
    },
    stability: {
      positive: ['Roots are not anchors that trap you; they are anchors that feed you.', 'There is power in the predictable.'],
      negative: ['Routines can become cages. Which ones still serve you?', 'Stability bought at the cost of aliveness is too expensive.'],
      mixed: ['You need both roots and wings. Check which ones need water.', 'Security and adventure are not mutually exclusive.'],
      neutral: ['A steady rhythm is its own kind of genius.', 'The foundation you lay now will outlast the storm.'],
    },
    communication: {
      positive: ['Words are spells. Cast them with intention.', 'Your voice matters. Use it where it can be heard.'],
      negative: ['Not every thought needs to be spoken. Silence is also communication.', 'Misunderstanding is often a translation error, not a character flaw.'],
      mixed: ['What you say and what is heard may be different stories.', 'The truth can be spoken with many tones. Choose wisely.'],
      neutral: ['Clear communication is an act of respect.', 'Listen first. The speaking will be better for it.'],
    },
    joy: {
      positive: ['Celebrate without apology. Joy is a form of resistance.', 'Let yourself have this. Fully.'],
      negative: [`Joy can feel dangerous when you're used to disappointment. Let it in anyway.`, `You don't have to earn happiness.`],
      mixed: ['Pleasure and responsibility can share a room.', 'Joy is a practice of attention. Keep noticing.'],
      neutral: [`Small delights are the architecture of a good life.`, `Happiness doesn't need to be loud to be real.`],
    },
    fear: {
      positive: ['Fear can be a compass pointing toward what matters.', 'Your vigilance is a form of care.'],
      negative: [`Fear lies about the future. It only knows the past.`, `You don't have to outrun the fear. You only have to keep moving.`],
      mixed: ['Some fears are wise counselors. Others are old ghosts.', 'Courage is feeling the fear and choosing anyway.'],
      neutral: ['Fear is information, not instruction.', 'The thing you fear is often smaller up close.'],
    },
  };
  
  const primaryTheme = themes[0] || 'introspection';
  const themePool = themeGuidance[primaryTheme]?.[valenceKey] || themeGuidance['introspection'][valenceKey];
  if (themePool) {
    text += `\n\n${pickRandom(themePool)}`;
  }
  
  // Add birth chart context if available
  if (birthChartConnection) {
    const bcPhrases = [
      `\n\nYour birth chart shows ${birthChartConnection.interpretation}, activating your ${birthChartConnection.activatedHouse}th house. This brings cosmic support to exactly what you're processing.`,
      `\n\nPersonally, ${birthChartConnection.interpretation} is stirring your ${birthChartConnection.activatedHouse}th house. The sky is not watching from a distance—it is in conversation with your natal chart.`,
      `\n\nWith ${birthChartConnection.interpretation} touching your ${birthChartConnection.activatedHouse}th house, this is not abstract astrology. It is your life, right now.`,
    ];
    text += pickRandom(bcPhrases);
  }
  
  // Question response if they asked one
  if (mirror.hasQuestion) {
    const questionClosers = [
      `\n\nYou asked something important here. The oracle doesn't give answers—it gives better questions. Sit with this until the next moon phase.`,
      `\n\nThe question you carry is part of the answer. Let it ripen.`,
      `\n\nWhat you've asked deserves more than a quick reply. Return to it in three days.`,
    ];
    text += pickRandom(questionClosers);
  }
  
  return text;
}

async function tryAIEnhancement(
  originalContent: string,
  baseText: string,
  analysis: ContentAnalysis,
  celestialState: Awaited<ReturnType<typeof OracleEngine.getCurrentCelestialState>>,
  birthChartConnection?: EnhancedInsight['birthChartConnection']
): Promise<{ text: string; poeticSummary: string; affirmations: string[]; rituals: string[]; journalPrompts: string[] } | null> {
  const activeProvider = aiProviderManager.getActiveProvider();
  const theme = analysis.themes[0] || 'general';
  const moonSign = celestialState.moonPhase.sign;
  const moonPhase = celestialState.moonPhase.phase;

  // ── Template Library Path ──────────────────────────────────────────────
  // When the user has selected Template Library (no API key), we still enrich
  // the insight with astrologically-informed content from the template engine.
  if (activeProvider === 'template') {
    try {
      const reading = templateLibrary.generateReading({
        planet: 'moon',
        sign: moonSign,
        moonPhase: moonPhase,
        category: theme,
      });

      // Blend the template reading with the base insight text
      const blendedNarrative = reading.narrative
        ? `${baseText}\n\n${reading.narrative}`
        : baseText;

      return {
        text: blendedNarrative,
        poeticSummary: reading.title || 'Celestial Reflection',
        affirmations: reading.affirmation ? [reading.affirmation] : [],
        rituals: reading.advice || [],
        journalPrompts: generateLocalJournalPrompts(analysis, originalContent, celestialState, birthChartConnection),
      };
    } catch (e) {
      console.warn('[tryAIEnhancement] Template enrichment failed:', e);
      // Fall through to local generation
      return null;
    }
  }

  const prompt = buildAIInsightPrompt(originalContent, analysis, celestialState, birthChartConnection);

  try {
    // Race against a 12-second timeout so the UI never hangs waiting for AI
    const response = await Promise.race([
      aiProviderManager.generateReading({
        prompt,
        context: {
          planet: 'moon',
          sign: moonSign,
          moonPhase: moonPhase,
          transits: [],
          category: theme
        },
        templateReading: {
          title: 'Oracle Insight',
          summary: baseText,
          narrative: baseText,
          advice: [],
          affirmation: '',
          confidence: 80
        }
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI enhancement timed out')), 12000)
      )
    ]);

    // If the provider failed internally and fell back to template, the provider field will be 'template'.
    // We only accept genuine AI-generated responses.
    if (response.provider === 'template') {
      console.warn('[tryAIEnhancement] Provider fell back to template; skipping AI result.');
      return null;
    }

    const reading = response.reading;
    return {
      text: reading.narrative || baseText,
      poeticSummary: reading.poeticSummary || '',
      affirmations: reading.affirmations || [],
      rituals: reading.rituals || [],
      journalPrompts: reading.journalPrompts || []
    };
  } catch (error) {
    console.warn('AI enhancement failed:', error);
    return null;
  }
}

function buildAIInsightPrompt(
  originalContent: string,
  analysis: ContentAnalysis,
  celestialState: Awaited<ReturnType<typeof OracleEngine.getCurrentCelestialState>>,
  birthChartConnection?: EnhancedInsight['birthChartConnection']
): string {
  const retrogradePlanets = Object.entries(celestialState.planets || {})
    .filter(([_, p]: [string, any]) => p.retrograde || p.isRetrograde)
    .map(([name]) => name);
  
  return `You are the HEKA Oracle—a deeply wise, compassionate astrological guide with centuries of accumulated wisdom. You do not give generic horoscopes. You peer into the soul of the person writing and speak directly to their unique situation with piercing clarity and warmth.

USER'S JOURNAL ENTRY:
"""${originalContent}"""

EMOTIONAL LANDSCAPE:
- Primary emotion: ${analysis.emotionalProfile.primaryEmotion} (intensity: ${analysis.emotionalProfile.intensity}%)
- Valence: ${analysis.emotionalProfile.valence}
- Urgency: ${analysis.emotionalProfile.urgency}
- Detected themes: ${analysis.themes.join(', ')}
- Archetypes: ${analysis.archetypes.join(', ') || 'seeker'}

CURRENT CELESTIAL WEATHER:
- Moon phase: ${celestialState.moonPhase.phase} in ${celestialState.moonPhase.sign}
- Illumination: ${Math.round(celestialState.moonPhase.illumination)}%
- Retrograde planets: ${retrogradePlanets.join(', ') || 'None'}
${birthChartConnection ? `- Personal transit: ${birthChartConnection.interpretation} (activating house ${birthChartConnection.activatedHouse})` : ''}

INSTRUCTIONS:
Write as if you are an old friend who also happens to understand the stars. Your response should:
1. OPEN with a mirror—acknowledge exactly what they are feeling using their own language and themes
2. CONNECT their experience to the current moon phase and any relevant planetary movements
3. OFFER wisdom that is BOTH poetic AND practical—not vague platitudes but specific, grounded guidance
4. REFERENCE their archetypes if relevant—speak to the deeper pattern beneath the moment
5. CLOSE with warmth that makes them feel seen, not diagnosed

Tone guidelines:
- If valence is negative: Be gentle but not condescending. Validate their pain without romanticizing it.
- If valence is positive: Celebrate with them without trivializing their joy.
- If themes include change/transition: Emphasize the liminal nature of their position. They are between worlds.
- If urgency is high: Be direct and grounding. Offer one clear next step.

Respond in JSON:
{
  "narrative": "The main insight text (200-280 words). Rich, layered, specific to their entry.",
  "poeticSummary": "A single profound sentence that captures the essence—like a line of poetry they might write on their mirror.",
  "affirmations": ["3 deeply personal affirmations that sound like their own wisest self speaking back to them"],
  "rituals": ["2-3 specific rituals aligned with the current moon phase and their emotional state—not generic 'meditate' but precise actions"],
  "journalPrompts": ["3 questions that unlock the next layer of their understanding—provocative but kind"]
}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL GENERATION FALLBACKS - Massively expanded for human-like diversity
// ═══════════════════════════════════════════════════════════════════════════════

function generateLocalAffirmations(analysis: ContentAnalysis, themes: string[], content: string): string[] {
  const valence = analysis.emotionalProfile.valence;
  const emotion = analysis.emotionalProfile.primaryEmotion;
  const mirror = extractContentMirror(content);
  const affirmations: string[] = [];
  
  // Valence-based core affirmations
  const valencePools: Record<string, string[]> = {
    positive: [
      `I am open to the ${emotion} moving through me.`,
      `I deserve the good that is arriving.`,
      `My heart is a magnet for what aligns with me.`,
      `I trust the upward current of my life.`,
      `I am allowed to feel this fully.`,
      `My joy is not fragile; it is rooted.`,
      `I celebrate myself without reservation.`,
      `The universe conspires in my favor.`,
      `I am worthy of delight.`,
      `My light is not too much.`,
    ],
    negative: [
      `I honor the ${emotion} I feel without letting it define me.`,
      `This feeling is a visitor, not a permanent resident.`,
      `I am allowed to struggle and still be whole.`,
      `My softness is not weakness.`,
      `I give myself permission to feel before I fix.`,
      `Tomorrow does not have to carry today's weight.`,
      `I am more than this moment of difficulty.`,
      `My healing is already in motion, even when I can't see it.`,
      `I deserve gentleness, especially from myself.`,
      `The darkness I feel is not the whole sky.`,
    ],
    mixed: [
      `I can hold contradiction without breaking.`,
      `My uncertainty is a doorway, not a wall.`,
      `I trust the wisdom of my own complexity.`,
      `I am allowed to want and fear the same thing.`,
      `Not knowing is part of the journey.`,
      `I make space for all of my feelings to coexist.`,
      `My path is allowed to be winding.`,
      `I am learning to trust the in-between.`,
      `Both hope and doubt can sit at my table.`,
      `I am becoming, and that is enough.`,
    ],
    neutral: [
      `I am present with what is, without forcing meaning.`,
      `Stillness is a valid state of being.`,
      `I observe my life with patience and clarity.`,
      `Not every day needs a lesson. Some just need witness.`,
      `I am grounded in the ordinary miracle of now.`,
      `My calm is a strength I am learning to value.`,
      `I show up, and that is sufficient.`,
      `I allow life to unfold at its own pace.`,
      `I am enough, even in quiet seasons.`,
      `My presence is my power.`,
    ],
  };
  
  const pool = valencePools[valence] || valencePools.neutral;
  affirmations.push(...pickNRandom(pool, 2));
  
  // Theme-based specific affirmation
  const themePools: Record<string, string[]> = {
    beginnings: ['I trust the unknown that comes with starting fresh.', 'Every expert was once a beginner.'],
    endings: ['I release what has completed its purpose.', 'Closure is a gift I give myself.'],
    relationships: ['I attract relationships that mirror my growth.', 'Love begins with how I treat myself.'],
    career: ['My work carries value, even when it goes unseen.', 'I build my legacy one intentional day at a time.'],
    introspection: ['The answers I seek are already within me.', 'My inner world is worth exploring.'],
    creativity: ['My creative voice matters.', 'Inspiration finds me because I make room for it.'],
    healing: ['My body and spirit know how to heal.', 'Rest is a revolutionary act of self-respect.'],
    conflict: ['I can stand my ground without losing my heart.', 'Peace is not the absence of conflict, but the presence of clarity.'],
    action: ['I am capable of taking the next right step.', 'Courage is a muscle I strengthen by using it.'],
    change: ['I am flexible without losing my core.', 'Transformation is my natural state.'],
    stability: ['My roots keep me steady in shifting winds.', 'Consistency is a form of self-love.'],
    communication: ['My words have power, and I choose them with care.', 'I listen as well as I speak.'],
    joy: ['I am allowed to be happy without guilt.', 'My joy feeds everyone around me.'],
    fear: ['Fear is a messenger, not a master.', 'I act from love more than I react from fear.'],
  };
  
  for (const theme of themes.slice(0, 2)) {
    if (themePools[theme]) {
      affirmations.push(pickRandom(themePools[theme]));
    }
  }
  
  // Content-mirror affirmation if possible
  if (mirror.concern) {
    const sanitized = mirror.concern.replace(/\bi\b/gi, 'I').replace(/\bmy\b/gi, 'my');
    if (sanitized.length < 80 && sanitized.length > 10) {
      affirmations.push(`I acknowledge that "${sanitized}" and I meet it with compassion.`);
    }
  }
  
  // Ensure exactly 3 unique affirmations
  const unique = [...new Set(affirmations)];
  if (unique.length < 3) {
    unique.push(...pickNRandom(pool, 3 - unique.length));
  }
  return unique.slice(0, 3);
}

function generateLocalRituals(moonPhase: string, themes: string[], emotions: EmotionalAnalysis): string[] {
  const rituals: string[] = [];
  
  // Moon-phase specific pools
  const phasePools: Record<string, string[]> = {
    new: [
      `Write three intentions on paper. Burn one, plant one, keep one under your pillow.`,
      `Sit in total darkness for five minutes. Whisper what you want to begin.`,
      `Cleanse a small object with running water and speak a new commitment to it.`,
      `Draw a circle in salt or sand. Step inside it and name one thing you are ready to start.`,
    ],
    waxing: [
      `Light a green candle and visualize your efforts swelling like the Moon.`,
      `Write a list of what is growing in your life. Read it aloud to the sky.`,
      `Feed someone or something—plant, pet, friend—and feel your own abundance.`,
      `Create a small altar of objects that represent momentum. Arrange them eastward.`,
    ],
    full: [
      `Stand barefoot on the earth and speak one truth you have been hiding.`,
      `Fill a bowl with water. Gaze at the surface and name what you are ready to release.`,
      `Write what you want to let go of on paper. Bury it or burn it under the open sky.`,
      `Dance to one song without self-consciousness. Let the movement be the ritual.`,
    ],
    waning: [
      `Sage or cleanse your space while naming three things that have completed their season.`,
      `Take a salt bath or foot soak and imagine old energy dissolving.`,
      `Donate one item that no longer fits who you are becoming.`,
      `Write a letter of forgiveness—to yourself or another—and do not send it.`,
    ],
  };
  
  const phaseKey = (['new','waxing','full','waning'] as const).find(k => moonPhase.includes(k)) || 'new';
  rituals.push(pickRandom(phasePools[phaseKey]));
  
  // Theme-specific rituals
  const themeRituals: Record<string, string[]> = {
    relationships: [
      `Write a message of genuine appreciation and send it without expecting a reply.`,
      `Place two candles side by side. Light them and sit in silence for ten minutes.`,
      `Make a small offering of sweetness—honey, fruit, chocolate—to someone you care about.`,
    ],
    career: [
      `Organize one drawer or desktop. Let the physical order reflect professional clarity.`,
      `Write your ideal job description as if it already exists. Read it weekly.`,
      `Light a gold or yellow candle and name one skill you are committed to sharpening.`,
    ],
    creativity: [
      `Create something ugly on purpose. Destroy it or keep it as a trophy of freedom.`,
      `Gather five random objects and arrange them into a temporary sculpture. Photograph it.`,
      `Write continuously for seven minutes without editing. Do not reread it for twenty-four hours.`,
    ],
    healing: [
      `Place one hand on your heart, one on your belly. Breathe until they rise and fall together.`,
      `Prepare a simple meal with full attention. Eat it without screens.`,
      `Sit with a warm stone or crystal and imagine it drawing tension from your body.`,
    ],
    introspection: [
      `Journal by candlelight for fifteen minutes. Do not stop the pen.`,
      `Sit facing a mirror in dim light. Look into your own eyes until you soften.`,
      `Record a voice memo of your current thoughts. Listen to it in one week.`,
    ],
    action: [
      `Do the smallest possible version of the thing you are avoiding. Then stop.`,
      `Set a timer for twenty minutes and move your body however it wants to move.`,
      `Make one difficult phone call or send one bold message before noon.`,
    ],
    communication: [
      `Write a letter you will never send. Say everything. Burn it or bury it.`,
      `Spend one conversation listening more than you speak. Notice what changes.`,
      `Read a poem aloud to yourself or another. Let the words do the speaking.`,
    ],
    conflict: [
      `Write the argument from the other person's perspective. Do not judge what arises.`,
      `Punch a pillow or scream into a blanket. Release the charge without harm.`,
      `Walk in a circle nine times, breathing out tension with each lap.`,
    ],
    beginnings: [
      `Plant a seed or place a stone in a new location as a symbol of your start.`,
      `Wear or carry something you have never used before. Let it mark the threshold.`,
    ],
    endings: [
      `Create a small funeral for what is ending. Speak gratitude and goodbye.`,
      `Pack away a physical reminder of what has ended. Do it with ceremony.`,
    ],
    joy: [
      `Make a playlist of songs that feel like sunlight. Dance to at least one.`,
      `Buy or pick flowers and place them where you will see them often.`,
    ],
    fear: [
      `Write your worst-case scenario in detail. Then write three reasons it is survivable.`,
      `Ground yourself: name five things you see, four you hear, three you feel, two you smell, one you taste.`,
    ],
    change: [
      `Rearrange one piece of furniture. Let your environment mirror your transformation.`,
      `Wear an outfit or color that represents the person you are becoming.`,
    ],
    stability: [
      `Make your bed with extra care. Let this small order anchor your day.`,
      `Eat the same nourishing meal at the same time for three days. Rhythm is medicine.`,
    ],
  };
  
  for (const theme of themes.slice(0, 2)) {
    if (themeRituals[theme]) {
      rituals.push(pickRandom(themeRituals[theme]));
    }
  }
  
  // Emotion-based ritual
  if (emotions.valence === 'negative' && emotions.intensity > 60) {
    rituals.push('Place both feet flat on the floor. Inhale for four counts, hold for four, exhale for six. Repeat until your shoulders drop.');
  } else if (emotions.valence === 'positive' && emotions.intensity > 60) {
    rituals.push('Capture this feeling in one sentence. Write it on paper and tape it somewhere you will forget, then find later.');
  }
  
  if (rituals.length < 3) {
    const defaultRituals = [
      `Light a candle and sit with it for five minutes without doing anything else.`,
      `Drink a glass of water very slowly. Feel it move through you.`,
      `Step outside and look at the sky. Name one thing you are grateful for.`,
      `Stretch your body slowly, as if you are waking up for the first time today.`,
    ];
    rituals.push(...pickNRandom(defaultRituals, 3 - rituals.length));
  }
  
  return rituals.slice(0, 3);
}

function generateLocalJournalPrompts(
  analysis: ContentAnalysis,
  content: string,
  celestialState: Awaited<ReturnType<typeof OracleEngine.getCurrentCelestialState>>,
  birthChartConnection?: EnhancedInsight['birthChartConnection']
): string[] {
  const prompts: string[] = [];
  const themes = analysis.themes;
  const emotion = analysis.emotionalProfile.primaryEmotion;
  const mirror = extractContentMirror(content);
  const moonPhase = celestialState.moonPhase.phase;
  const moonSign = celestialState.moonPhase.sign;
  
  // DEEPENING POOL - bounce off the original entry
  const deepeningPool = [
    `What is the oldest memory this feeling of ${emotion} connects to?`,
    `If your ${emotion} had a color, a temperature, and a texture, what would they be?`,
    `What would you say to someone you love who felt exactly this way?`,
    `What part of you is asking to be heard right now?`,
    `If this entry were a scene in a movie, what would the soundtrack be?`,
    `What is the story you are telling yourself about this situation? Is it the only story?`,
    `What do you need that you are not yet asking for?`,
    `If you looked at this moment from ten years in the future, what would you want to remember?`,
  ];
  
  // CELESTIAL POOL - connect to current sky
  const celestialPool = [
    `The ${moonPhase} Moon in ${moonSign} often brings ${themes[0] || 'change'} into focus. How do you see that showing up in your life right now?`,
    `If the current lunar energy were a mentor, what advice would it whisper to you?`,
    `What in your life is currently waxing, and what is waning?`,
    `Write a letter to the Moon in ${moonSign}. Tell it what you need.`,
  ];
  
  if (birthChartConnection) {
    celestialPool.push(
      `${birthChartConnection.interpretation} is activating your ${birthChartConnection.activatedHouse}th house. Where in your life do you feel this transit most strongly?`,
      `How might your natal ${birthChartConnection.natalPosition} be responding to the current ${birthChartConnection.activatedPlanet} energy?`
    );
  }
  
  // ACTION/CHAIN POOL - link to other features
  const chainPool = [
    `What is one small action you could take today that would honor this ${emotion}?`,
    `Is there a date on your calendar that relates to this? What energy do you want to bring to it?`,
    `Would tracking your mood or energy around this theme reveal a pattern? What might you notice?`,
    `What question do you want to ask the Celestial Guide about what you're experiencing?`,
    `If you wrote a follow-up entry in exactly one week, what would you hope it says?`,
    `What is one boundary you could set this week that would protect the insight you've just had?`,
    `Who is one person you could share even a fragment of this with? What would you say?`,
    `What would it look like to bring this reflection into your calendar as a concrete plan?`,
  ];
  
  // CONTENT-MIRROR PROMPTS - directly reference their writing
  if (mirror.concern) {
    prompts.push(`You wrote: "${mirror.concern}" — what is the unspoken feeling underneath those words?`);
  }
  if (mirror.hasQuestion) {
    prompts.push('You asked a question in this entry. What would the answer feel like in your body?');
  }
  
  // Theme-specific prompt
  const themePrompts: Record<string, string[]> = {
    relationships: ['What does trust feel like in your body? When did you first learn that feeling?', 'What are you not saying to someone important?'],
    career: ['What did you want to be when you were young? How does that relate to now?', 'What would you do for the next year if you knew you could not fail?'],
    creativity: ['What are you afraid to make? Why?', 'Describe a project you would create with unlimited time and no audience.'],
    healing: ['What does your body need that your mind has been ignoring?', 'Write a forgiveness letter to a part of yourself that you have been criticizing.'],
    introspection: ['Who are you when no one is watching?', 'What belief are you outgrowing?'],
    action: ['What is the smallest step you could take in the next hour?', 'What are you waiting for permission to do?'],
    communication: ['What conversation have you been rehearsing in your mind? Write the opening line.', 'What truth feels scary to speak but necessary to live?'],
    conflict: [`What is the fear beneath your anger or frustration?`, `What would resolution look like if it didn't require anyone to be wrong?`],
    beginnings: ['What are you willing to leave behind in order to begin?', 'What does this new start need from you that the old thing did not?'],
    endings: ['What is this ending making space for?', 'What gratitude can you find, even if it is small, for what is concluding?'],
    joy: ['When was the last time you felt truly carefree? What allowed it?', 'How do you sabotage your own happiness?'],
    fear: ['What is the worst that could happen? And then what? And then what?', 'When has fear actually protected you, and when has it imprisoned you?'],
    change: ['What part of you is resisting this change? What is it trying to protect?', 'Who do you need to become for this transformation to succeed?'],
    stability: ['What routines make you feel most like yourself?', 'Where in your life are you craving more safety?'],
  };
  
  for (const theme of themes.slice(0, 2)) {
    if (themePrompts[theme]) {
      prompts.push(pickRandom(themePrompts[theme]));
    }
  }
  
  // Fill from pools to ensure 5 rich prompts
  const allPools = [...deepeningPool, ...celestialPool, ...chainPool];
  const shuffled = [...allPools].sort(() => 0.5 - Math.random());
  while (prompts.length < 5 && shuffled.length > 0) {
    const next = shuffled.pop()!;
    if (!prompts.includes(next)) prompts.push(next);
  }
  
  return prompts.slice(0, 5);
}

function generateActionItems(
  analysis: ContentAnalysis,
  themes: string[],
  content: string,
  celestialState: Awaited<ReturnType<typeof OracleEngine.getCurrentCelestialState>>,
  birthChartConnection?: EnhancedInsight['birthChartConnection']
): string[] {
  const actions: string[] = [];
  const mirror = extractContentMirror(content);
  const emotion = analysis.emotionalProfile.primaryEmotion;
  
  if (analysis.crisisCheck.isCrisis) {
    actions.push('Reach out to a support resource');
    actions.push('Contact someone you trust');
    return actions.slice(0, 3);
  }
  
  // Content-specific SMART actions
  if (mirror.concern) {
    actions.push(`Set a 10-minute timer and write a single sentence about "${emotion}" without editing.`);
  }
  
  // Theme-linked feature actions
  const featureActions: Record<string, string[]> = {
    beginnings: ['Add a "new moon intention" note to your calendar for the next New Moon.', 'Start a tracker log to monitor how this beginning unfolds over 7 days.'],
    endings: ['Create a calendar note marking a small ritual of closure this week.', 'Journal a follow-up entry in 3 days to check how the release feels.'],
    relationships: ['Schedule a specific time to have the conversation you are avoiding.', 'Add a reminder to send one genuine appreciation message within 24 hours.'],
    career: ['Update your calendar with one concrete career task for tomorrow.', 'Write a 3-sentence professional goal and set a weekly check-in reminder.'],
    introspection: ['Block 20 minutes of screen-free reflection time on your calendar.', 'Ask the Celestial Guide about the current Moon sign to deepen this insight.'],
    action: ['Identify the very first physical step and do it within the next 2 hours.', 'Add a calendar note titled "Momentum Check" for tomorrow evening.'],
    communication: ['Draft the message or email you have been avoiding. Do not send yet—just draft.', 'Set a calendar reminder to follow up on an important conversation.'],
    creativity: ['Schedule a 30-minute "ugly draft" session on your calendar this week.', 'Gather your materials and place them somewhere visible as an invitation.'],
    healing: ['Book or schedule one healing activity: bath, walk, therapy, rest.', 'Track your energy level today and compare it to yesterday in the Tracker.'],
    conflict: [`Write down the conflict from the other person's perspective. Read it aloud.`, `Set a boundary in one specific area before the end of the day.`],
    joy: ['Plan one small celebration on your calendar within the next 48 hours.', 'Share your good news with one person who will truly celebrate with you.'],
    fear: ['Write down the worst-case scenario and one contingency plan for it.', 'Do one small act that the fear has been telling you to avoid.'],
    change: ['Remove one physical object that belongs to your old chapter.', 'Add a calendar note for 2 weeks from now titled "How has this changed?"'],
    stability: ['Identify one routine that supports you and commit to it for 7 days.', 'Add a recurring calendar reminder for a grounding practice.'],
  };
  
  for (const theme of themes.slice(0, 2)) {
    if (featureActions[theme]) {
      actions.push(pickRandom(featureActions[theme]));
    }
  }
  
  // Celestial-linked actions
  const celestialActions = [
    `Check today's Celestial Guide to see how the ${celestialState.moonPhase.phase} Moon in ${celestialState.moonPhase.sign} is influencing your mood.`,
    `Add a note to your calendar for the next Full Moon to reflect on this insight.`,
    `Open the Celestial Guide and read about your Sun sign for additional context.`,
  ];
  if (birthChartConnection) {
    celestialActions.push(`Explore the meaning of ${birthChartConnection.interpretation} in the Celestial Guide.`);
  }
  actions.push(pickRandom(celestialActions));
  
  // General high-value actions
  const generalActions = [
    `Set a phone reminder to check in with this feeling at the same time tomorrow.`,
    `Text or call one person who makes you feel seen.`,
    `Take a 10-minute walk without your phone. Let your body process what your mind wrote.`,
    `Create a calendar event for a follow-up journal entry in 3 days.`,
    `Name one thing you can let go of today. Actually let it go.`,
    `Set a bedtime reminder 30 minutes earlier than usual to support integration.`,
    `Do one small kindness for someone else—altruism accelerates healing.`,
  ];
  
  while (actions.length < 4) {
    const next = pickRandom(generalActions);
    if (!actions.includes(next)) actions.push(next);
  }
  
  return actions.slice(0, 4);
}

function getVisualTheme(type: EnhancedInsight['type'], _emotions: EmotionalAnalysis): EnhancedInsight['visualTheme'] {
  const themes: Record<string, EnhancedInsight['visualTheme']> = {
    crisis: { color: '#ef4444', icon: '🆘', gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' },
    celebration: { color: '#22c55e', icon: '✨', gradient: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)' },
    challenge: { color: '#f59e0b', icon: '🔥', gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' },
    transition: { color: '#8b5cf6', icon: '🦋', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' },
    reflection: { color: '#06b6d4', icon: '🪞', gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)' },
    general: { color: '#9d4edd', icon: '🔮', gradient: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)' }
  };
  
  return themes[type] || themes.general;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface GenerateInsightOptions {
  content: string;
  birthChart?: BirthChart;
  useAI?: boolean;
}

export async function generateEnhancedInsight(
  options: GenerateInsightOptions
): Promise<EnhancedInsight> {
  const { content, birthChart, useAI: _useAI = true } = options;
  
  // Step 1: Analyze content
  const analysis = analyzeContent(content);
  
  // Step 2: Get celestial state
  const celestialState = await OracleEngine.getCurrentCelestialState();
  
  // Step 3: Get personal transits if birth chart available
  let personalTransits: PersonalTransit[] = [];
  if (birthChart) {
    const currentPositions = await getCurrentPlanetaryPositions();
    personalTransits = calculatePersonalTransits(birthChart, currentPositions);
  }
  
  // Step 4: Check for crisis first
  if (analysis.crisisCheck.isCrisis) {
    return generateCrisisInsight(content, analysis, celestialState, birthChart);
  }
  
  // Step 5: Generate standard insight
  return generateStandardInsight(content, analysis, celestialState, birthChart, personalTransits);
}

// Export analysis functions for testing
export const EnhancedInsightEngine = {
  generateInsight: generateEnhancedInsight,
  analyzeContent,
  detectCrisis,
  analyzeEmotions,
  analyzeSentiment,
};

export default EnhancedInsightEngine;
