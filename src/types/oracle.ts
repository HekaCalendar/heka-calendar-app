/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ORACLE TYPES — Shared type definitions for the HEKA AI Coach system
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * These types are shared across the coach component, scoring engine,
 * context builder, message pipeline, and candidate factory.
 */

import type { HekaDate } from './index';
import type { CurrentAspect, CriticalDegree } from '../astrology/services/calculations/swissCalculations';
import type { CelestialBody } from '../astrology/types/core';
import type { MoodDataPoint } from '../services/sentimentService';
import type { UserArchetype } from '../oracle/archetypeEngine';
import type { DailyTransitReading } from '../services/transitService';
import type { CoachMemoryEntry } from '../services/aiConfigService';
import type { AICoachZone } from '../services/aiCoachContextService';

export interface CoachMessage {
  id: string;
  type: 'insight' | 'question' | 'celebration' | 'nudge' | 'celestial' | 'task' | 'wisdom' | 'plan' | 'synchronicity';
  text: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: string;
  color: string;
}

export interface CandidateMessage extends CoachMessage {
  topic: string;
  weight: number;
  isSynchronicity?: boolean;
}

export interface StreakDangerMessage {
  text: string;
  icon: string;
  color: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface OracleContext {
  focusDate: HekaDate | null;
  dateKey: string;
  todayIso: string;
  timeLabel: 'night' | 'morning' | 'afternoon' | 'evening';
  greeting: string;
  hour: number;
  celestial: {
    moonPhase: string;
    moonSign: string;
    sunSign: string;
    retrogrades: string[];
    dominantElement: 'fire' | 'water' | 'earth' | 'air' | 'unknown';
    allPlanets: Record<string, { sign: string; degree: number; isRetrograde: boolean; speed: number }>;
    currentAspects: CurrentAspect[];
    criticalDegrees: CriticalDegree[];
    moonDetails: {
      illumination: number;
      age: number;
      speed: number;
    };
    lunarNodes: {
      north: string;
      south: string;
    } | null;
    chiron: {
      sign: string;
      degree: number;
    } | null;
    rawPositions?: Record<string, CelestialBody>;
  };
  user: {
    pendingTasks: number;
    todayCompleted: number;
    streak: number;
    daysSinceJournal: number;
    hasCreatedFirstTask: boolean;
    lastTaskCreationDate?: string;
    lastTaskContent?: string;
    lastJournalThemes: string[];
    lastJournalSnippet?: string;
    lastCoachInteraction: number;
    writingStreak: number;
    longestWritingStreak: number;
    moodAverage: number;
    totalNotes: number;
  };
  mood: {
    history: MoodDataPoint[];
    trend: 'improving' | 'declining' | 'stable' | 'volatile' | 'unknown';
    recentLabel: 'positive' | 'neutral' | 'negative';
    daysSincePositive: number;
    declineSeverity: 'mild' | 'moderate' | 'severe' | 'none';
    tone: 'prophetic' | 'gentle' | 'playful' | 'stern' | 'mysterious';
    shouldOfferSupport: boolean;
  };
  archetype: {
    name?: UserArchetype;
    confidence: number;
  };
  streakDanger: StreakDangerMessage | null;
  transit: DailyTransitReading;
  isVoidMoon: boolean;
  memory: {
    recentMessages: CoachMemoryEntry[];
    recentTopics: string[];
    lastPrompt: string;
  };
  location: {
    name: string;
    latitude: number;
    longitude: number;
    timezoneOffset: number; // hours from UTC
    hasLocation: boolean;
  };
  planetaryHour: {
    planet: string;
    symbol: string;
    activities: string[];
    isDay: boolean;
    progress: number;
  } | null;
  sunTimes: {
    sunrise: Date | null;
    sunset: Date | null;
    solarNoon: Date | null;
    dayLength: number;
  };
  season: {
    season: string;
    hemisphere: string;
    zodiacInPower: string[];
  } | null;
  solarReturn: {
    isToday: boolean;
    isApproaching: boolean;
    sign: string;
    daysUntil: number;
  } | null;
  zone: AICoachZone;
  timeMode: 'SYNC' | 'TRUE';
}
