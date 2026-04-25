import type { PlanetPosition } from '../../oracle/birthChartIntegration';

export type JournalMode = 'oracle' | 'entries' | 'celestial' | 'scribe' | 'tracker';
export type EntryFilter = 'all' | 'insights' | 'transits';

export interface CalendarNoteEntry {
  id: string;
  date: string;
  hekaDate: { year: number; month: number; day: number };
  timestamp: string;
  content: string;
  category: string;
  mood?: number;
  sourceKey: string;
}

export interface CelestialState {
  positions: Record<string, PlanetPosition>;
  moonPhase: {
    phase: string;
    sign: string;
    illumination: number;
    isVoid: boolean;
  };
  retrogrades: string[];
  loading: boolean;
  error: string | null;
}

export interface BirthChartInfo {
  hasChart: boolean;
  profileName: string | null;
  chart: any | null;
}

export interface BirthChartData {
  timestamp: number;
  ascendant: {
    longitude: number;
    sign: string;
    degree: number;
    minute: number;
    retrograde: boolean;
    speed: number;
  } | null;
  planets: Record<string, {
    longitude: number;
    sign: string;
    degree: number;
    minute: number;
    retrograde: boolean;
    speed: number;
  }>;
  houses: any;
}

export interface EffectiveProfile {
  name: string | null;
  natalChart: any;
}

export interface JournalStats {
  totalEntries: number;
  entriesWithInsights: number;
  calendarNotes: number;
  activeTransits: number;
  majorTransits: number;
  streak: number;
}
