/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    CELESTIAL BODY TRACKER — MANAGER                       ║
 * ║                                                                           ║
 * ║  Service for managing tracker entries for reflection & vitality          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import type {
  TrackerEntry,
  TrackerType,
} from '../oracle/trackerTypes';

// Storage keys
const STORAGE_KEY = 'heka_tracker_entries';
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
  
  /** Save a tracker entry */
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
  
  /** Upsert entry */
  upsertEntry(entry: Omit<TrackerEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): TrackerEntry {
    const entries = this.getAllEntries();
    
    if (entry.id) {
      const index = entries.findIndex(e => e.id === entry.id);
      if (index !== -1) {
        entries[index] = {
          ...entries[index],
          ...entry,
          updatedAt: new Date().toISOString(),
        };
        this.saveAllEntries(entries);
        return entries[index];
      }
    }
    
    return this.saveEntry(entry);
  },
  
  /** Delete entry by ID */
  deleteEntry(id: string): void {
    const entries = this.getAllEntries().filter(e => e.id !== id);
    this.saveAllEntries(entries);
  },
  
  /** Delete all entries for a date */
  deleteEntriesForDate(date: string): void {
    const entries = this.getAllEntries().filter(e => e.date !== date);
    this.saveAllEntries(entries);
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
  // DATA EXPORT/IMPORT
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Export all tracker data */
  exportData(): {
    entries: TrackerEntry[];
    exportedAt: string;
  } {
    return {
      entries: this.getAllEntries(),
      exportedAt: new Date().toISOString(),
    };
  },
  
  /** Import tracker data */
  importData(data: { entries?: TrackerEntry[] }): boolean {
    try {
      if (data.entries) {
        this.saveAllEntries(data.entries);
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
    localStorage.removeItem(ENABLED_TRACKERS_KEY);
  },
  
  /** Get enabled trackers */
  getEnabledTrackers(): TrackerType[] {
    try {
      const data = localStorage.getItem(ENABLED_TRACKERS_KEY);
      return data ? JSON.parse(data) : ['mood', 'sleep', 'energy'];
    } catch {
      return ['mood', 'sleep', 'energy'];
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
