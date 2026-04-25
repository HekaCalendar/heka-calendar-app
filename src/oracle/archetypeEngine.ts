/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARCHETYPE ENGINE — The HEKA Soul Classifier
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Detects the user's archetype based on task keywords and journal themes.
 * This allows the AI coach to speak in a dialect that resonates with the
 * user's current identity — Warrior, Monk, Artist, Strategist, Mystic, or Phoenix.
 */

import type { PlannerTask } from '../types';
import type { DiaryEntry } from './diaryTypes';

export type UserArchetype =
  | 'warrior'
  | 'monk'
  | 'artist'
  | 'strategist'
  | 'mystic'
  | 'phoenix';

export interface ArchetypeResult {
  archetype: UserArchetype;
  confidence: number; // 0-1
  scores: Record<UserArchetype, number>;
  dominantKeywords: string[];
}

interface ArchetypeProfile {
  name: UserArchetype;
  keywords: string[];
  journalThemes: string[];
  dialect: {
    greeting: string[];
    celebration: string[];
    motivation: string[];
    wisdom: string[];
    celestial: string[];
    task: string[];
  };
}

// ── Archetype Definitions ────────────────────────────────────────────────────

const ARCHETYPES: ArchetypeProfile[] = [
  {
    name: 'warrior',
    keywords: [
      'workout', 'exercise', 'gym', 'run', 'running', 'lift', 'training', 'fight',
      'battle', 'challenge', 'overcome', 'strong', 'strength', 'discipline', 'push',
      'hard', 'tough', 'grind', 'hustle', 'win', 'compete', 'competition', 'sport',
      'martial', 'box', 'swim', 'climb', 'endurance', 'power', 'muscle', 'fitness',
      'attack', 'conquer', 'destroy', 'crush', 'dominate', 'victory', 'goal', 'target',
    ],
    journalThemes: ['strength', 'discipline', 'battle', 'victory', 'body', 'power'],
    dialect: {
      greeting: ['The arena awaits.', 'Steel yourself.'],
      celebration: ['Another battle won. The field is yours.', 'Victory tastes like this.'],
      motivation: ['The enemy is inertia. Strike now.', 'Rest is part of the campaign, but the war continues.'],
      wisdom: ['A warrior does not wish for easier battles, but for a stronger self.', 'Discipline is the bridge between intention and result.'],
      celestial: ['Mars burns bright in your sky. Use it.', 'The Sun lends you its fire.'],
      task: ['Take the hill.', 'Engage the next target.'],
    },
  },
  {
    name: 'monk',
    keywords: [
      'meditate', 'meditation', 'pray', 'prayer', 'mindful', 'mindfulness', 'calm',
      'peace', 'silence', 'quiet', 'stillness', 'breathe', 'breath', 'spiritual',
      'spirit', 'soul', 'sacred', 'ritual', 'routine', 'habit', 'discipline', 'fast',
      'fasting', 'cleanse', 'detox', 'sleep', 'rest', 'recover', 'heal', 'healing',
      'gentle', 'slow', 'patience', 'patient', 'accept', 'acceptance', 'surrender',
      'let go', 'release', 'forgive', 'forgiveness', 'gratitude', 'grateful', 'blessing',
    ],
    journalThemes: ['peace', 'stillness', 'surrender', 'healing', 'gratitude', 'spirit'],
    dialect: {
      greeting: ['Sit with me a moment.', 'The bell has rung.'],
      celebration: ['You have tended the inner garden well.', 'A quiet victory is still a victory.'],
      motivation: ['Even one breath taken with intention is progress.', 'Do not chase the result. Be the practice.'],
      wisdom: ['The obstacle is the path.', 'In stillness, the world reveals itself.'],
      celestial: ['The Moon invites you inward.', 'Venus smiles upon your gentleness.'],
      task: ['Tend to the next sacred duty.', 'One mindful step.'],
    },
  },
  {
    name: 'artist',
    keywords: [
      'write', 'writing', 'paint', 'painting', 'draw', 'drawing', 'sketch', 'design',
      'creative', 'creativity', 'art', 'artistic', 'music', 'song', 'dance', 'poem',
      'poetry', 'story', 'novel', 'craft', 'make', 'build', 'create', 'dream',
      'imagine', 'inspiration', 'inspire', 'inspired', 'beauty', 'beautiful', 'aesthetic',
      'expression', 'express', 'feel', 'feeling', 'emotion', 'color', 'sound', 'vision',
      'portfolio', 'project', 'film', 'photo', 'photography', 'edit', 'compose',
    ],
    journalThemes: ['creativity', 'expression', 'beauty', 'inspiration', 'vision', 'art'],
    dialect: {
      greeting: ['What will you make today?', 'The canvas is waiting.'],
      celebration: ['You have added another stroke to your masterpiece.', 'Creation is its own reward.'],
      motivation: ['The muse favors those who show up.', 'Start ugly. Start messy. Just start.'],
      wisdom: ['Art is not what you see, but what you make others feel.', 'The creative act is an act of courage.'],
      celestial: ['Neptune stirs the waters of your imagination.', 'The stars are arranging themselves into your vision.'],
      task: ['Shape the next piece.', 'What wants to be born through you?'],
    },
  },
  {
    name: 'strategist',
    keywords: [
      'plan', 'planning', 'schedule', 'organize', 'organization', 'system', 'process',
      'structure', 'framework', 'map', 'outline', 'budget', 'finance', 'financial',
      'money', 'invest', 'investment', 'save', 'saving', 'review', 'analyze', 'analysis',
      'research', 'study', 'learn', 'learning', 'career', 'job', 'business', 'client',
      'meeting', 'email', 'call', 'negotiate', 'contract', 'deal', 'project', 'manage',
      'management', 'lead', 'leadership', 'team', 'delegate', 'efficiency', 'optimize',
      'improve', 'upgrade', 'refactor', 'clean', 'declutter', 'sort', 'list', 'goal',
    ],
    journalThemes: ['growth', 'strategy', 'organization', 'career', 'mastery', 'planning'],
    dialect: {
      greeting: ['The board is set.', 'Let us review the map.'],
      celebration: ['Another objective secured.', 'Your systems are holding.'],
      motivation: ['Clarity precedes mastery. Define the next move.', 'A small optimization today compounds into victory.'],
      wisdom: ['Strategy without tactics is the slowest route to victory.', 'The best plan is the one you actually follow.'],
      celestial: ['Mercury sharpens your mind today.', 'Saturn rewards disciplined structure.'],
      task: ['Execute the next phase.', 'What is the highest-leverage action?'],
    },
  },
  {
    name: 'mystic',
    keywords: [
      'read', 'reading', 'book', 'books', 'tarot', 'astrology', 'horoscope', 'zodiac',
      'sign', 'planet', 'moon', 'star', 'stars', 'cosmos', 'universe', 'energy',
      'vibration', 'frequency', 'intuition', 'intuitive', 'dream', 'dreams', 'symbol',
      'symbols', 'synchronicity', 'sign', 'signs', 'message', 'messages', 'oracle',
      'prophecy', 'ritual', 'spell', 'magic', 'magical', 'mystery', 'mysterious',
      'unknown', 'hidden', 'secret', 'wisdom', 'ancient', 'teach', 'teacher', 'learn',
      'student', 'path', 'journey', 'seek', 'seeker', 'truth', 'meaning', 'purpose',
    ],
    journalThemes: ['mystery', 'intuition', 'dreams', 'cosmos', 'wisdom', 'transformation'],
    dialect: {
      greeting: ['The veil is thin today.', 'Listen closely.'],
      celebration: ['The unseen world notes your dedication.', 'A star has been added to your constellation.'],
      motivation: ['Even the oracle must act. Move with intention.', 'The signs are clear. Will you follow them?'],
      wisdom: ['As above, so below. As within, so without.', 'The answers you seek are seeking you.'],
      celestial: ['The Moon whispers your name.', 'A transit is opening a door only you can walk through.'],
      task: ['Attend to the next thread of fate.', 'What does the pattern demand?'],
    },
  },
  {
    name: 'phoenix',
    keywords: [
      'recover', 'recovery', 'heal', 'healing', 'transform', 'transformation', 'change',
      'rebuild', 'restart', 'begin', 'beginning', 'new', 'fresh', 'start', 'starting',
      'overcome', 'survive', 'survival', 'resilience', 'resilient', 'rise', 'rising',
      'burn', 'ashes', 'rebirth', 'renew', 'renewal', 'growth', 'evolve', 'evolution',
      'break', 'breakthrough', 'shift', 'transition', 'move', 'moving', 'forward',
      'up', 'climb', 'climbing', 'fight', 'fighting', 'hope', 'hopeful', 'believe',
      'courage', 'brave', 'fearless', 'strength', 'strong', 'endure', 'endurance',
    ],
    journalThemes: ['rebirth', 'resilience', 'hope', 'transformation', 'healing', 'rise'],
    dialect: {
      greeting: ['You have risen before. You will rise again.', 'The fire has not finished with you.'],
      celebration: ['From the ashes, another victory.', 'You are proof that endings become beginnings.'],
      motivation: ['The fall was not the end of your story.', 'One step forward is still rising.'],
      wisdom: ['What is to give light must endure burning.', 'You are not what happened to you. You are what you choose to become.'],
      celestial: ['The Sun is rising in your chart.', 'Pluto transforms what it touches. You are being reshaped into something greater.'],
      task: ['Reclaim the next piece of yourself.', 'What small act proves you are still rising?'],
    },
  },
];

// ── Detection Engine ──────────────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function countMatches(text: string, keywords: string[]): number {
  const normalized = normalizeText(text);
  let count = 0;
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    const matches = normalized.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

export function detectArchetype(
  tasks: PlannerTask[],
  journalEntries: DiaryEntry[]
): ArchetypeResult {
  const scores: Record<UserArchetype, number> = {
    warrior: 0,
    monk: 0,
    artist: 0,
    strategist: 0,
    mystic: 0,
    phoenix: 0,
  };

  const keywordHits: Record<string, number> = {};

  // Score from task content
  for (const task of tasks) {
    const content = task.content || '';
    for (const archetype of ARCHETYPES) {
      const hits = countMatches(content, archetype.keywords);
      scores[archetype.name] += hits * 1.0;
      for (const kw of archetype.keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        const matches = content.match(regex);
        if (matches) keywordHits[kw] = (keywordHits[kw] || 0) + matches.length;
      }
    }
  }

  // Score from journal content and detected themes
  for (const entry of journalEntries) {
    const content = entry.content || '';
    for (const archetype of ARCHETYPES) {
      const hits = countMatches(content, archetype.keywords);
      scores[archetype.name] += hits * 1.5; // Journal words weighted more heavily

      // Theme matches
      const themes = entry.detectedThemes || [];
      for (const theme of themes) {
        if (archetype.journalThemes.includes(String(theme).toLowerCase())) {
          scores[archetype.name] += 2.0;
        }
      }
    }
  }

  // Minimum data threshold
  const totalDataPoints = tasks.length + journalEntries.length;
  let confidence = Math.min(1, totalDataPoints / 13); // 13 = ~10 tasks + 3 journals
  if (confidence < 0.3) confidence = 0;

  // Determine winner
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [winnerName, winnerScore] = sorted[0];
  const runnerUpScore = sorted[1]?.[1] || 0;

  // Reduce confidence if race is close
  if (winnerScore > 0 && runnerUpScore > 0) {
    const gap = winnerScore / (winnerScore + runnerUpScore);
    if (gap < 0.55) confidence *= 0.7;
  }

  // Cap confidence
  confidence = Math.min(1, Math.max(0, confidence));

  const dominantKeywords = Object.entries(keywordHits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k]) => k);

  return {
    archetype: winnerName as UserArchetype,
    confidence,
    scores,
    dominantKeywords,
  };
}

export function getArchetypeDialect(archetype: UserArchetype | undefined, messageType: keyof ArchetypeProfile['dialect']): string | null {
  if (!archetype) return null;
  const profile = ARCHETYPES.find((a) => a.name === archetype);
  if (!profile) return null;
  const options = profile.dialect[messageType];
  if (!options || options.length === 0) return null;
  return options[Math.floor(Math.random() * options.length)];
}

export function getArchetypeDescription(archetype: UserArchetype | undefined): string {
  if (!archetype) return 'Your archetype is still forming. Keep showing up.';
  const descriptions: Record<UserArchetype, string> = {
    warrior: 'You move through the world with discipline and fire. Victory is your language.',
    monk: 'You seek depth, stillness, and sacred rhythm. The inner journey is your path.',
    artist: 'You translate feeling into form. Creation is how you make sense of being alive.',
    strategist: 'You build systems, maps, and futures. Mastery is your meditation.',
    mystic: 'You read the spaces between things. Intuition is your compass.',
    phoenix: 'You have known ashes. You also know how to rise. Transformation is your truth.',
  };
  return descriptions[archetype];
}

export { ARCHETYPES };
