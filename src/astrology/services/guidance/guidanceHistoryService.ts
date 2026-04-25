/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL GUIDANCE HISTORY SERVICE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Persists personalized guidance readings so users can revisit
 * yesterday's insights, last week's themes, and trace their cosmic journey.
 *
 * Features:
 * - Stores up to 90 days of readings (LRU eviction)
 * - Compressed storage using localStorage
 * - Fast date-based lookup
 * - Export full history as JSON
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { PersonalizedGuidanceReading, MorningBriefing } from './personalizedEngine';

const HISTORY_KEY = 'heka-celestial-guidance-history';
const MAX_HISTORY_DAYS = 90;

export interface HistoryEntry {
  date: string; // ISO date string YYYY-MM-DD
  timestamp: number;
  reading: PersonalizedGuidanceReading;
}

export interface BriefingHistoryEntry {
  date: string;
  timestamp: number;
  briefing: MorningBriefing;
}

export interface GuidanceHistory {
  readings: HistoryEntry[];
  briefings: BriefingHistoryEntry[];
  version: number;
}

class GuidanceHistoryService {
  private cache: GuidanceHistory | null = null;

  /**
   * Load history from localStorage
   */
  private load(): GuidanceHistory {
    if (this.cache) return this.cache;
    
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GuidanceHistory;
        if (parsed.version === 1) {
          // Revive Date objects
          parsed.readings.forEach(r => {
            if (r.reading?.generatedAt) {
              r.reading.generatedAt = new Date(r.reading.generatedAt);
            }
            if (r.reading?.date) {
              r.reading.date = new Date(r.reading.date);
            }
          });
          parsed.briefings.forEach(b => {
            if (b.briefing?.date) {
              b.briefing.date = new Date(b.briefing.date);
            }
          });
          this.cache = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[GuidanceHistory] Failed to load history:', e);
    }
    
    return { readings: [], briefings: [], version: 1 };
  }

  /**
   * Save history to localStorage
   */
  private save(history: GuidanceHistory): void {
    this.cache = history;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('[GuidanceHistory] Failed to save history:', e);
      // If quota exceeded, trim more aggressively
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        this.trimToSize(history, Math.floor(MAX_HISTORY_DAYS * 0.5));
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch {
          // ultimate fallback: clear history
          localStorage.removeItem(HISTORY_KEY);
        }
      }
    }
  }

  /**
   * Trim history to target size (oldest first)
   */
  private trimToSize(history: GuidanceHistory, targetSize: number): void {
    if (history.readings.length > targetSize) {
      history.readings.sort((a, b) => b.timestamp - a.timestamp);
      history.readings = history.readings.slice(0, targetSize);
    }
    if (history.briefings.length > targetSize) {
      history.briefings.sort((a, b) => b.timestamp - a.timestamp);
      history.briefings = history.briefings.slice(0, targetSize);
    }
  }

  /**
   * Get date string from a Date
   */
  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Save a full guidance reading
   */
  saveReading(reading: PersonalizedGuidanceReading): void {
    const history = this.load();
    const dateKey = this.getDateKey(reading.date);
    
    // Remove existing entry for same date
    history.readings = history.readings.filter(r => r.date !== dateKey);
    
    // Add new entry at the beginning
    history.readings.unshift({
      date: dateKey,
      timestamp: Date.now(),
      reading,
    });
    
    // Trim to max size
    this.trimToSize(history, MAX_HISTORY_DAYS);
    
    this.save(history);
  }

  /**
   * Save a morning briefing
   */
  saveBriefing(briefing: MorningBriefing): void {
    const history = this.load();
    const dateKey = this.getDateKey(briefing.date);
    
    history.briefings = history.briefings.filter(b => b.date !== dateKey);
    history.briefings.unshift({
      date: dateKey,
      timestamp: Date.now(),
      briefing,
    });
    
    this.trimToSize(history, MAX_HISTORY_DAYS);
    this.save(history);
  }

  /**
   * Get a reading for a specific date
   */
  getReading(dateStr: string): PersonalizedGuidanceReading | null {
    const history = this.load();
    const entry = history.readings.find(r => r.date === dateStr);
    return entry?.reading || null;
  }

  /**
   * Get a briefing for a specific date
   */
  getBriefing(dateStr: string): MorningBriefing | null {
    const history = this.load();
    const entry = history.briefings.find(b => b.date === dateStr);
    return entry?.briefing || null;
  }

  /**
   * Get all saved reading dates (newest first)
   */
  getReadingDates(): string[] {
    const history = this.load();
    return history.readings.map(r => r.date);
  }

  /**
   * Get all saved briefing dates (newest first)
   */
  getBriefingDates(): string[] {
    const history = this.load();
    return history.briefings.map(b => b.date);
  }

  /**
   * Get history stats
   */
  getStats(): { readings: number; briefings: number; oldestDate: string | null } {
    const history = this.load();
    const allDates = [
      ...history.readings.map(r => r.date),
      ...history.briefings.map(b => b.date),
    ].sort();
    
    return {
      readings: history.readings.length,
      briefings: history.briefings.length,
      oldestDate: allDates[0] || null,
    };
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    this.cache = { readings: [], briefings: [], version: 1 };
    localStorage.removeItem(HISTORY_KEY);
  }

  /**
   * Export history as JSON string
   */
  exportAsJson(): string {
    return JSON.stringify(this.load(), null, 2);
  }
}

export const guidanceHistoryService = new GuidanceHistoryService();
export default guidanceHistoryService;
