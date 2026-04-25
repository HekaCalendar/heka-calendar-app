/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SENTIMENT SERVICE — The HEKA Mood Oracle
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * A lightweight, zero-dependency lexicon-based sentiment analyzer.
 * Tracks emotional weather across journal entries to help the AI coach
 * adjust its tone, detect burnout cycles, and offer timely support.
 */

import type { DiaryEntry } from '../oracle/diaryTypes';

export interface SentimentResult {
  score: number; // -1 (very negative) to +1 (very positive)
  comparative: number; // score per word
  magnitude: number; // total emotional intensity (0+)
  label: 'positive' | 'neutral' | 'negative';
  dominantEmotions: string[];
}

export interface MoodDataPoint {
  date: string;
  score: number;
  label: 'positive' | 'neutral' | 'negative';
  magnitude: number;
  entryCount: number;
}

// ── Core lexicon ─────────────────────────────────────────────────────────────
const POSITIVE_WORDS = new Set([
  'love', 'loved', 'loving', 'happy', 'joy', 'joyful', 'bliss', 'grateful', 'gratitude',
  'peace', 'peaceful', 'calm', 'calmed', 'serene', 'content', 'hope', 'hopeful',
  'excited', 'excitement', 'thrilled', 'eager', 'enthusiastic', 'passion', 'passionate',
  'proud', 'accomplished', 'achieved', 'success', 'successful', 'victory', 'win',
  'beautiful', 'wonderful', 'amazing', 'awesome', 'fantastic', 'excellent', 'great',
  'good', 'better', 'best', 'bright', 'brilliant', 'radiant', 'glow', 'glowing',
  'strong', 'strength', 'powerful', 'confident', 'confidence', 'courage', 'brave',
  'free', 'freedom', 'light', 'lightness', 'easy', 'ease', 'flow', 'flowing',
  'safe', 'secure', 'comfort', 'comfortable', 'warm', 'warmth', 'gentle', 'soft',
  'inspired', 'inspiration', 'creative', 'creativity', 'alive', 'vibrant', 'energy',
  'blessed', 'fortunate', 'lucky', 'abundant', 'prosperity', 'wealthy', 'rich',
  'healed', 'healing', 'whole', 'complete', 'balanced', 'harmony', 'harmonious',
  'connected', 'belonging', 'loved', 'cherished', 'valued', 'worthy', 'enough',
  'optimistic', 'positive', 'cheerful', 'delighted', 'blessing', 'miracle', 'magic',
  'renewed', 'refreshed', 'relaxed', 'relief', 'relieved', 'satisfied', 'fulfilled',
  'determined', 'motivated', 'driven', 'focused', 'clear', 'clarity', 'purpose',
  'growth', 'growing', 'evolving', 'transformed', 'transformation', 'rebirth',
  'trust', 'trusting', 'faith', 'belief', 'certainty', 'sure', 'grounded',
  'playful', 'fun', 'laugh', 'laughter', 'smile', 'smiling', 'humor', 'joyous',
  'admire', 'admiration', 'respect', 'honor', 'appreciate', 'appreciation',
  'kind', 'kindness', 'compassion', 'empathy', 'generous', 'generosity', 'give',
  'open', 'openness', 'expansive', 'limitless', 'infinite', 'eternal', 'timeless',
]);

const NEGATIVE_WORDS = new Set([
  'sad', 'sadness', 'unhappy', 'miserable', 'depressed', 'depression', 'despair',
  'hopeless', 'hopelessness', 'empty', 'numb', 'lonely', 'loneliness', 'alone',
  'afraid', 'fear', 'fearful', 'scared', 'terrified', 'anxious', 'anxiety', 'worry',
  'worried', 'nervous', 'panic', 'stressed', 'stress', 'tense', 'tension', 'overwhelmed',
  'exhausted', 'tired', 'fatigue', 'drained', 'depleted', 'burned', 'burnout',
  'frustrated', 'frustration', 'annoyed', 'irritated', 'angry', 'rage', 'furious',
  'hate', 'hatred', 'disgust', 'disgusted', 'bitter', 'resentful', 'resentment',
  'betrayed', 'abandoned', 'rejected', 'hurt', 'wounded', 'pain', 'painful',
  'suffering', 'agony', 'torment', 'grief', 'mourning', 'loss', 'lost',
  'disappointed', 'disappointment', 'failed', 'failure', 'defeated', 'helpless',
  'powerless', 'weak', 'weakness', 'insecure', 'insecurity', 'doubt', 'doubtful',
  'uncertain', 'confused', 'confusion', 'lost', 'stuck', 'trapped', 'imprisoned',
  'bored', 'boredom', 'apathetic', 'indifferent', 'detached', 'disconnected',
  'isolated', 'withdrawn', 'shy', 'ashamed', 'shame', 'guilty', 'guilt', 'regret',
  'regretful', 'remorse', 'envy', 'jealous', 'jealousy', 'inadequate', 'inferior',
  'ugly', 'worthless', 'useless', 'pathetic', 'stupid', 'foolish', 'ridiculous',
  'embarrassed', 'humiliated', 'rejected', 'unwanted', 'unloved', 'ignored',
  'criticized', 'attacked', 'threatened', 'unsafe', 'vulnerable', 'exposed',
  'betrayal', 'lie', 'lied', 'deceived', 'cheated', 'abandoned', 'neglected',
  'sick', 'illness', 'disease', 'dying', 'death', 'dead', 'dark', 'darkness',
  'cold', 'cruel', 'harsh', 'violent', 'violence', 'aggressive', 'hostile',
  'chaos', 'chaotic', 'disaster', 'tragedy', 'horror', 'horrible', 'terrible',
  'awful', 'worst', 'bad', 'worse', 'evil', 'toxic', 'poison', 'polluted',
  'broken', 'damaged', 'destroyed', 'ruined', 'wasted', 'obsessed', 'addicted',
  'craving', 'desperate', 'desperation', 'need', 'needy', 'clingy', 'controlling',
]);

const EMOTION_CLUSTERS: Record<string, string[]> = {
  joy: ['happy', 'joy', 'joyful', 'bliss', 'delighted', 'cheerful', 'elated', 'euphoric'],
  gratitude: ['grateful', 'gratitude', 'thankful', 'appreciate', 'appreciation', 'blessed'],
  hope: ['hope', 'hopeful', 'optimistic', 'eager', 'excited', 'enthusiastic'],
  love: ['love', 'loved', 'loving', 'adore', 'cherished', 'belonging', 'connected'],
  peace: ['peace', 'peaceful', 'calm', 'serene', 'relaxed', 'ease', 'content'],
  pride: ['proud', 'accomplished', 'confident', 'strong', 'powerful', 'capable'],
  fear: ['afraid', 'fear', 'scared', 'terrified', 'anxious', 'anxiety', 'panic', 'worry'],
  sadness: ['sad', 'depressed', 'despair', 'hopeless', 'empty', 'grief', 'lonely'],
  anger: ['angry', 'rage', 'furious', 'frustrated', 'irritated', 'resentful', 'bitter'],
  exhaustion: ['exhausted', 'tired', 'drained', 'depleted', 'burnout', 'fatigue', 'weary'],
  overwhelm: ['overwhelmed', 'stressed', 'tense', 'chaotic', 'crushed', 'burdened'],
  shame: ['ashamed', 'shame', 'guilty', 'inadequate', 'worthless', 'inferior', 'pathetic'],
  confusion: ['confused', 'lost', 'stuck', 'uncertain', 'doubt', 'doubtful', 'unclear'],
};

const INTENSIFIERS = new Set([
  'very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally',
  'utterly', 'deeply', 'profoundly', 'intensely', 'severely', 'so', 'really',
  'quite', 'remarkably', 'exceptionally', 'extraordinarily', 'immensely',
]);

const NEGATORS = new Set([
  'not', 'no', 'never', 'neither', 'nor', 'none', 'nobody', 'nothing',
  'nowhere', 'hardly', 'scarcely', 'barely', "n't",
]);

// ── Analysis Functions ───────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export function analyzeSentiment(text: string): SentimentResult {
  const tokens = tokenize(text);
  if (tokens.length === 0) {
    return { score: 0, comparative: 0, magnitude: 0, label: 'neutral', dominantEmotions: [] };
  }

  let score = 0;
  let magnitude = 0;
  const emotionCounts: Record<string, number> = {};

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let tokenScore = 0;

    if (POSITIVE_WORDS.has(token)) tokenScore = 1;
    if (NEGATIVE_WORDS.has(token)) tokenScore = -1;

    if (tokenScore !== 0) {
      // Check for negation in previous 2 tokens
      let negated = false;
      for (let j = Math.max(0, i - 2); j < i; j++) {
        if (NEGATORS.has(tokens[j])) {
          negated = true;
          break;
        }
      }

      // Check for intensifier in previous token
      let intensified = false;
      if (i > 0 && INTENSIFIERS.has(tokens[i - 1])) {
        intensified = true;
      }

      let appliedScore = tokenScore;
      if (negated) appliedScore *= -0.5;
      if (intensified) appliedScore *= 1.5;

      score += appliedScore;
      magnitude += Math.abs(appliedScore);

      // Track emotions
      for (const [emotion, words] of Object.entries(EMOTION_CLUSTERS)) {
        if (words.includes(token)) {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + Math.abs(appliedScore);
        }
      }
    }
  }

  const comparative = tokens.length > 0 ? score / tokens.length : 0;
  const label: SentimentResult['label'] =
    score > 0.25 ? 'positive' : score < -0.25 ? 'negative' : 'neutral';

  const dominantEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([e]) => e);

  return {
    score: Math.max(-1, Math.min(1, score)),
    comparative,
    magnitude,
    label,
    dominantEmotions,
  };
}

export function buildMoodHistory(entries: DiaryEntry[]): MoodDataPoint[] {
  const byDate = new Map<string, { scores: number[]; magnitudes: number[] }>();

  for (const entry of entries) {
    if (!entry.content || entry.content.trim().length < 5) continue;
    const date = entry.date || entry.createdAt.split('T')[0];
    const sentiment = analyzeSentiment(entry.content);

    const existing = byDate.get(date) || { scores: [], magnitudes: [] };
    existing.scores.push(sentiment.score);
    existing.magnitudes.push(sentiment.magnitude);
    byDate.set(date, existing);
  }

  const points: MoodDataPoint[] = [];
  for (const [date, data] of byDate) {
    const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
    const avgMagnitude = data.magnitudes.reduce((a, b) => a + b, 0) / data.magnitudes.length;
    const label: MoodDataPoint['label'] =
      avgScore > 0.25 ? 'positive' : avgScore < -0.25 ? 'negative' : 'neutral';

    points.push({
      date,
      score: Math.max(-1, Math.min(1, avgScore)),
      label,
      magnitude: avgMagnitude,
      entryCount: data.scores.length,
    });
  }

  return points.sort((a, b) => a.date.localeCompare(b.date));
}

export function getMoodTrend(points: MoodDataPoint[]): {
  trend: 'improving' | 'declining' | 'stable' | 'volatile' | 'unknown';
  recentLabel: MoodDataPoint['label'];
  daysSincePositive: number;
  declineSeverity: 'mild' | 'moderate' | 'severe' | 'none';
} {
  if (points.length === 0) {
    return {
      trend: 'unknown',
      recentLabel: 'neutral',
      daysSincePositive: 0,
      declineSeverity: 'none',
    };
  }

  const recent = points.slice(-7);
  const recentLabel = recent[recent.length - 1]?.label || 'neutral';

  // Calculate simple linear trend
  let slope = 0;
  if (recent.length >= 3) {
    const n = recent.length;
    const sumX = recent.reduce((s, _, i) => s + i, 0);
    const sumY = recent.reduce((s, p) => s + p.score, 0);
    const sumXY = recent.reduce((s, p, i) => s + i * p.score, 0);
    const sumX2 = recent.reduce((s, _, i) => s + i * i, 0);
    slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  // Volatility: high standard deviation in recent scores
  const mean = recent.reduce((s, p) => s + p.score, 0) / recent.length;
  const variance = recent.reduce((s, p) => s + Math.pow(p.score - mean, 2), 0) / recent.length;
  const stdDev = Math.sqrt(variance);

  let trend: 'improving' | 'declining' | 'stable' | 'volatile' = 'stable';
  if (stdDev > 0.6) {
    trend = 'volatile';
  } else if (slope > 0.08) {
    trend = 'improving';
  } else if (slope < -0.08) {
    trend = 'declining';
  }

  // Days since positive
  const today = new Date().toISOString().split('T')[0];
  let daysSincePositive = 0;
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].label === 'positive') {
      const d = new Date(points[i].date);
      const diff = Math.floor((new Date(today).getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      daysSincePositive = Math.max(0, diff);
      break;
    }
    if (i === 0) {
      daysSincePositive = 999; // No positive entry ever recorded
    }
  }

  // Decline severity
  let declineSeverity: 'mild' | 'moderate' | 'severe' | 'none' = 'none';
  if (trend === 'declining') {
    const recentAvg = recent.reduce((s, p) => s + p.score, 0) / recent.length;
    if (recentAvg < -0.8) declineSeverity = 'severe';
    else if (recentAvg < -0.4) declineSeverity = 'moderate';
    else declineSeverity = 'mild';
  }

  return {
    trend,
    recentLabel,
    daysSincePositive,
    declineSeverity,
  };
}

export function getToneAdjustmentForMood(trend: ReturnType<typeof getMoodTrend>): {
  tone: 'prophetic' | 'gentle' | 'playful' | 'stern' | 'mysterious';
  urgency: 'low' | 'medium' | 'high';
  shouldOfferSupport: boolean;
} {
  if (trend.trend === 'declining' && trend.declineSeverity === 'severe') {
    return { tone: 'gentle', urgency: 'high', shouldOfferSupport: true };
  }
  if (trend.trend === 'declining' && trend.declineSeverity === 'moderate') {
    return { tone: 'gentle', urgency: 'medium', shouldOfferSupport: true };
  }
  if (trend.trend === 'volatile') {
    return { tone: 'gentle', urgency: 'medium', shouldOfferSupport: true };
  }
  if (trend.daysSincePositive >= 5 && trend.daysSincePositive < 900) {
    return { tone: 'gentle', urgency: 'medium', shouldOfferSupport: true };
  }
  if (trend.recentLabel === 'positive') {
    return { tone: 'prophetic', urgency: 'low', shouldOfferSupport: false };
  }
  if (trend.recentLabel === 'negative') {
    return { tone: 'gentle', urgency: 'low', shouldOfferSupport: true };
  }
  return { tone: 'mysterious', urgency: 'low', shouldOfferSupport: false };
}
