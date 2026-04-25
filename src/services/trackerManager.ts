/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    CELESTIAL BODY TRACKER - MANAGER                       ║
 * ║                                                                           ║
 * ║  Service for managing all tracker entries, calculations, and predictions ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import type {
  TrackerEntry,
  TrackerType,
  MenstrualData,
  MenstrualConfig,
  CyclePrediction,
  CycleInsight,
  MoodData,
  SleepData,
} from '../oracle/trackerTypes';
import { TRACKER_CONFIG as TC } from '../oracle/trackerTypes';

// Storage keys
const STORAGE_KEY = 'heka_tracker_entries';
const CONFIG_KEY = 'heka_tracker_config';
const ENABLED_TRACKERS_KEY = 'heka_enabled_trackers';

// ═════════════════════════════════════════════════════════════════════════════
// TRACKER MANAGER
// ═════════════════════════════════════════════════════════════════════════════

export const TrackerManager = {
  
  // ─────────────────────────────────────────────────────────────────────────
  // ENTRY CRUD OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Get all tracker entries */
  getAllEntries(): TrackerEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const entries: TrackerEntry[] = JSON.parse(data);
      return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
      console.error('[TrackerManager] Error loading entries:', e);
      return [];
    }
  },
  
  /** Get entries for a specific date */
  getEntriesForDate(date: string): TrackerEntry[] {
    return this.getAllEntries().filter(e => e.date === date);
  },
  
  /** Get entries by type */
  getEntriesByType(type: TrackerType): TrackerEntry[] {
    return this.getAllEntries().filter(e => e.type === type);
  },
  
  /** Get entries for a date range */
  getEntriesForRange(startDate: string, endDate: string): TrackerEntry[] {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return this.getAllEntries().filter(e => {
      const d = new Date(e.date).getTime();
      return d >= start && d <= end;
    });
  },
  
  /** Get the most recent entry of a specific type */
  getMostRecentEntry(type: TrackerType): TrackerEntry | null {
    const entries = this.getEntriesByType(type);
    return entries.length > 0 ? entries[0] : null;
  },
  
  /** Save a tracker entry (allows multiple per day) */
  saveEntry(entry: Omit<TrackerEntry, 'id' | 'createdAt' | 'updatedAt'>): TrackerEntry {
    const entries = this.getAllEntries();
    
    const newEntry: TrackerEntry = {
      ...entry,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    entries.unshift(newEntry);
    this.saveAllEntries(entries);
    
    return newEntry;
  },
  
  /** Upsert entry - replaces existing entry with same ID, otherwise adds new */
  upsertEntry(entry: Omit<TrackerEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): TrackerEntry {
    const entries = this.getAllEntries();
    
    if (entry.id) {
      // Update existing
      const index = entries.findIndex(e => e.id === entry.id);
      if (index !== -1) {
        entries[index] = {
          ...entries[index],
          ...entry,
          updatedAt: new Date().toISOString(),
        } as TrackerEntry;
        this.saveAllEntries(entries);
        return entries[index];
      }
    }
    
    // Create new
    return this.saveEntry(entry);
  },
  
  /** Update an existing entry */
  updateEntry(id: string, updates: Partial<TrackerEntry>): TrackerEntry | null {
    const entries = this.getAllEntries();
    const index = entries.findIndex(e => e.id === id);
    
    if (index === -1) return null;
    
    entries[index] = {
      ...entries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.saveAllEntries(entries);
    return entries[index];
  },
  
  /** Delete an entry */
  deleteEntry(id: string): boolean {
    const entries = this.getAllEntries();
    const filtered = entries.filter(e => e.id !== id);
    
    if (filtered.length === entries.length) return false;
    
    this.saveAllEntries(filtered);
    return true;
  },
  
  /** Delete all entries for a date */
  deleteEntriesForDate(date: string): number {
    const entries = this.getAllEntries();
    const beforeCount = entries.length;
    const filtered = entries.filter(e => e.date !== date);
    this.saveAllEntries(filtered);
    return beforeCount - filtered.length;
  },
  
  /** Save all entries */
  saveAllEntries(entries: TrackerEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('[TrackerManager] Error saving entries:', e);
    }
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // MENSTRUAL CYCLE OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Get menstrual configuration */
  getMenstrualConfig(): MenstrualConfig | null {
    try {
      const data = localStorage.getItem(CONFIG_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  
  /** Save menstrual configuration */
  saveMenstrualConfig(config: MenstrualConfig): void {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },
  
  /** Get all menstrual entries */
  getMenstrualEntries(): TrackerEntry[] {
    return this.getEntriesByType('menstrual').sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  },
  
  /** Get period start dates */
  getPeriodStarts(): string[] {
    const entries = this.getMenstrualEntries();
    return entries
      .filter(e => (e.data as MenstrualData).isPeriodStart)
      .map(e => e.date);
  },
  
  /** Calculate cycle statistics */
  getCycleStats(): {
    averageCycleLength: number;
    averagePeriodLength: number;
    shortestCycle: number;
    longestCycle: number;
    totalCycles: number;
    lastPeriodStart: string | null;
  } {
    const periodStarts = this.getPeriodStarts();
    
    if (periodStarts.length < 2) {
      return {
        averageCycleLength: TC.DEFAULT_CYCLE_LENGTH,
        averagePeriodLength: TC.DEFAULT_PERIOD_LENGTH,
        shortestCycle: TC.DEFAULT_CYCLE_LENGTH,
        longestCycle: TC.DEFAULT_CYCLE_LENGTH,
        totalCycles: periodStarts.length,
        lastPeriodStart: periodStarts[periodStarts.length - 1] || null,
      };
    }
    
    // Calculate cycle lengths
    const cycleLengths: number[] = [];
    for (let i = 1; i < periodStarts.length; i++) {
      const prev = new Date(periodStarts[i - 1]);
      const curr = new Date(periodStarts[i]);
      const days = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (days > 14 && days < 50) { // Filter out unrealistic cycles
        cycleLengths.push(days);
      }
    }
    
    if (cycleLengths.length === 0) {
      return {
        averageCycleLength: TC.DEFAULT_CYCLE_LENGTH,
        averagePeriodLength: TC.DEFAULT_PERIOD_LENGTH,
        shortestCycle: TC.DEFAULT_CYCLE_LENGTH,
        longestCycle: TC.DEFAULT_CYCLE_LENGTH,
        totalCycles: periodStarts.length,
        lastPeriodStart: periodStarts[periodStarts.length - 1],
      };
    }
    
    const avg = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    
    return {
      averageCycleLength: avg,
      averagePeriodLength: TC.DEFAULT_PERIOD_LENGTH, // TODO: Calculate from entries
      shortestCycle: Math.min(...cycleLengths),
      longestCycle: Math.max(...cycleLengths),
      totalCycles: cycleLengths.length,
      lastPeriodStart: periodStarts[periodStarts.length - 1],
    };
  },
  
  /** Calculate current cycle day */
  getCurrentCycleDay(): { day: number; cycleStart: string | null } {
    const config = this.getMenstrualConfig();
    const stats = this.getCycleStats();
    
    if (!stats.lastPeriodStart) {
      return { day: 0, cycleStart: null };
    }
    
    const lastPeriod = new Date(stats.lastPeriodStart);
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    
    const cycleLength = config?.averageCycleLength || stats.averageCycleLength;
    const cycleDay = (daysSince % cycleLength) + 1;
    
    return { day: cycleDay, cycleStart: stats.lastPeriodStart };
  },
  
  /** Predict next cycle events */
  getCyclePrediction(): CyclePrediction | null {
    const stats = this.getCycleStats();
    
    if (!stats.lastPeriodStart || stats.totalCycles < TC.MIN_CYCLES_FOR_PREDICTION) {
      return null;
    }
    
    const lastPeriod = new Date(stats.lastPeriodStart);
    const cycleLength = stats.averageCycleLength;
    
    // Predict next period
    const nextPeriodStart = new Date(lastPeriod);
    nextPeriodStart.setDate(lastPeriod.getDate() + cycleLength);
    
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodStart.getDate() + stats.averagePeriodLength - 1);
    
    // Predict ovulation (typically 14 days before next period)
    const ovulationDate = new Date(nextPeriodStart);
    ovulationDate.setDate(nextPeriodStart.getDate() - TC.LUTEAL_PHASE_DAYS);
    
    // Predict fertile window (5 days before ovulation + ovulation day)
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    
    // Predict PMS window (typically 7 days before period)
    const pmsStart = new Date(nextPeriodStart);
    pmsStart.setDate(nextPeriodStart.getDate() - TC.PMS_WINDOW_DAYS);
    
    const confidence = stats.totalCycles >= 6 ? 'high' : 
                       stats.totalCycles >= 3 ? 'medium' : 'low';
    
    return {
      nextPeriodStart: nextPeriodStart.toISOString().split('T')[0],
      nextPeriodEnd: nextPeriodEnd.toISOString().split('T')[0],
      fertileWindowStart: fertileStart.toISOString().split('T')[0],
      fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
      estimatedOvulation: ovulationDate.toISOString().split('T')[0],
      pmsWindowStart: pmsStart.toISOString().split('T')[0],
      confidence,
      cyclesAnalyzed: stats.totalCycles,
    };
  },
  
  /** Get fertility status for a specific date */
  getFertilityStatus(date: string): {
    phase: 'menstrual' | 'follicular' | 'fertile' | 'ovulation' | 'luteal' | 'pms' | 'unknown';
    fertility: 'low' | 'medium' | 'high';
    dayOfCycle: number;
  } {
    const prediction = this.getCyclePrediction();
    const { day: currentDay } = this.getCurrentCycleDay();
    
    if (!prediction) {
      return { phase: 'unknown', fertility: 'low', dayOfCycle: currentDay };
    }
    
    const d = new Date(date);
    const nextPeriod = new Date(prediction.nextPeriodStart);
    const fertileStart = new Date(prediction.fertileWindowStart!);
    const fertileEnd = new Date(prediction.fertileWindowEnd!);
    const ovulation = new Date(prediction.estimatedOvulation!);
    const pmsStart = new Date(prediction.pmsWindowStart!);
    
    // Check if date is in PMS window
    if (d >= pmsStart && d < nextPeriod) {
      return { phase: 'pms', fertility: 'low', dayOfCycle: currentDay };
    }
    
    // Check if date is during period
    const entries = this.getMenstrualEntries();
    const periodEntry = entries.find(e => e.date === date && (e.data as MenstrualData).flow !== 'none');
    if (periodEntry || (d >= nextPeriod && d <= new Date(prediction.nextPeriodEnd))) {
      return { phase: 'menstrual', fertility: 'low', dayOfCycle: currentDay };
    }
    
    // Check ovulation day
    if (d.toDateString() === ovulation.toDateString()) {
      return { phase: 'ovulation', fertility: 'high', dayOfCycle: currentDay };
    }
    
    // Check fertile window
    if (d >= fertileStart && d <= fertileEnd) {
      return { phase: 'fertile', fertility: 'high', dayOfCycle: currentDay };
    }
    
    // Check luteal phase (after ovulation, before PMS)
    if (d > fertileEnd && d < pmsStart) {
      return { phase: 'luteal', fertility: 'medium', dayOfCycle: currentDay };
    }
    
    // Follicular phase (after period, before fertile window)
    return { phase: 'follicular', fertility: 'low', dayOfCycle: currentDay };
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // INSIGHTS & ANALYSIS
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Generate insights based on tracking data */
  generateInsights(): CycleInsight[] {
    const insights: CycleInsight[] = [];
    const menstrualEntries = this.getMenstrualEntries();
    const moodEntries = this.getEntriesByType('mood');
    const sleepEntries = this.getEntriesByType('sleep');
    
    // Check for cycle-mood correlations
    if (menstrualEntries.length >= 3 && moodEntries.length >= 5) {
      const moodByCyclePhase = this.analyzeMoodByCyclePhase();
      
      if (moodByCyclePhase.pms?.average < 4) {
        insights.push({
          type: 'pattern',
          title: 'PMS Mood Pattern Detected',
          description: `Your mood tends to be lower during the PMS phase (avg ${moodByCyclePhase.pms.average.toFixed(1)}/10). Consider extra self-care during this time.`,
          suggestion: 'Try meditation, gentle yoga, or journaling during the week before your period.',
        });
      }
      
      if (moodByCyclePhase.ovulation?.average > 7) {
        insights.push({
          type: 'pattern',
          title: 'Peak Mood During Ovulation',
          description: `You tend to feel your best during your fertile window (avg ${moodByCyclePhase.ovulation.average.toFixed(1)}/10).`,
          suggestion: 'Schedule important meetings or social events during this time.',
        });
      }
    }
    
    // Check for sleep-menstruation correlation
    if (sleepEntries.length >= 5 && menstrualEntries.length >= 2) {
      const sleepDuringPeriod = this.analyzeSleepDuringPeriod();
      if (sleepDuringPeriod.qualityDiff < -1) {
        insights.push({
          type: 'pattern',
          title: 'Sleep Quality Drops During Period',
          description: `Your sleep quality tends to be ${Math.abs(sleepDuringPeriod.qualityDiff).toFixed(1)} points lower during menstruation.`,
          suggestion: 'Consider using a heating pad or taking a warm bath before bed during your period.',
        });
      }
    }
    
    // Prediction insight
    const prediction = this.getCyclePrediction();
    if (prediction) {
      const today = new Date().toISOString().split('T')[0];
      const daysUntil = Math.floor(
        (new Date(prediction.nextPeriodStart).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysUntil <= 3 && daysUntil >= 0) {
        insights.push({
          type: 'prediction',
          title: `Period Expected in ${daysUntil} Days`,
          description: `Based on your ${prediction.cyclesAnalyzed} tracked cycles, your next period is expected soon.`,
          suggestion: 'Have supplies ready and consider planning accordingly.',
        });
      }
    }
    
    return insights;
  },
  
  /** Analyze mood by cycle phase */
  analyzeMoodByCyclePhase(): Record<string, { average: number; count: number }> {
    const moodEntries = this.getEntriesByType('mood');
    const phases: Record<string, number[]> = {
      menstrual: [],
      follicular: [],
      fertile: [],
      ovulation: [],
      luteal: [],
      pms: [],
    };
    
    moodEntries.forEach(entry => {
      const status = this.getFertilityStatus(entry.date);
      const rating = (entry.data as MoodData).rating;
      phases[status.phase].push(rating);
    });
    
    const result: Record<string, { average: number; count: number }> = {};
    Object.entries(phases).forEach(([phase, ratings]) => {
      if (ratings.length > 0) {
        result[phase] = {
          average: ratings.reduce((a, b) => a + b, 0) / ratings.length,
          count: ratings.length,
        };
      }
    });
    
    return result;
  },
  
  /** Analyze sleep during period vs. other times */
  analyzeSleepDuringPeriod(): { duringPeriod: number; otherTimes: number; qualityDiff: number } {
    const sleepEntries = this.getEntriesByType('sleep');
    
    let periodQuality: number[] = [];
    let otherQuality: number[] = [];
    
    sleepEntries.forEach(entry => {
      const status = this.getFertilityStatus(entry.date);
      const quality = (entry.data as SleepData).quality;
      
      if (status.phase === 'menstrual') {
        periodQuality.push(quality);
      } else {
        otherQuality.push(quality);
      }
    });
    
    const avgPeriod = periodQuality.length > 0 
      ? periodQuality.reduce((a, b) => a + b, 0) / periodQuality.length 
      : 0;
    const avgOther = otherQuality.length > 0 
      ? otherQuality.reduce((a, b) => a + b, 0) / otherQuality.length 
      : 0;
    
    return {
      duringPeriod: avgPeriod,
      otherTimes: avgOther,
      qualityDiff: avgPeriod - avgOther,
    };
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // DATA EXPORT/IMPORT
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Export all tracker data */
  exportData(): {
    entries: TrackerEntry[];
    config: MenstrualConfig | null;
    exportedAt: string;
  } {
    return {
      entries: this.getAllEntries(),
      config: this.getMenstrualConfig(),
      exportedAt: new Date().toISOString(),
    };
  },
  
  /** Import tracker data */
  importData(data: { entries?: TrackerEntry[]; config?: MenstrualConfig }): boolean {
    try {
      if (data.entries) {
        this.saveAllEntries(data.entries);
      }
      if (data.config) {
        this.saveMenstrualConfig(data.config);
      }
      return true;
    } catch (e) {
      console.error('[TrackerManager] Import failed:', e);
      return false;
    }
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // UTILITY
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Generate unique ID */
  generateId(): string {
    return `trk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  
  /** Clear all tracker data */
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONFIG_KEY);
    localStorage.removeItem(ENABLED_TRACKERS_KEY);
  },
  
  /** Get enabled trackers */
  getEnabledTrackers(): TrackerType[] {
    try {
      const data = localStorage.getItem(ENABLED_TRACKERS_KEY);
      return data ? JSON.parse(data) : ['menstrual', 'mood', 'sleep'];
    } catch {
      return ['menstrual', 'mood', 'sleep'];
    }
  },
  
  /** Set enabled trackers */
  setEnabledTrackers(trackers: TrackerType[]): void {
    localStorage.setItem(ENABLED_TRACKERS_KEY, JSON.stringify(trackers));
  },
  
  /** Check if tracker is enabled */
  isTrackerEnabled(type: TrackerType): boolean {
    return this.getEnabledTrackers().includes(type);
  },
};

export default TrackerManager;
