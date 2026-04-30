/**
 * Persistence Layer
 * Handles all data persistence with encryption for sensitive data
 */

import type {
  AstroProfile,
  ProfileId,
  NatalChart,
  ChartId,
  ProfilePreferences
} from '../../types';

// Storage keys
const STORAGE_KEYS = {
  PROFILES: 'heka:astrology:profiles',
  CHARTS: 'heka:astrology:charts',
  PREFERENCES: 'heka:astrology:preferences',
  SELECTED_PROFILE: 'heka:astrology:selected-profile',
  VERSION: 'heka:astrology:version'
};

// Legacy storage keys for migration
const LEGACY_KEYS = {
  PROFILES: 'heka:profiles',
  ACTIVE_PROFILE: 'heka:active-profile',
  CHART_PREFIX: 'natal-chart-'
};

const CURRENT_VERSION = '2.0';

// Persistence interface
export interface PersistenceLayer {
  // Profiles
  saveProfile(profile: AstroProfile): Promise<void>;
  getProfile(id: ProfileId): Promise<AstroProfile | null>;
  getAllProfiles(): Promise<AstroProfile[]>;
  deleteProfile(id: ProfileId): Promise<void>;
  updateProfile(profile: AstroProfile): Promise<void>;
  
  // Charts
  saveChart(chart: NatalChart): Promise<void>;
  getChart(id: ChartId): Promise<NatalChart | null>;
  getChartsForProfile(profileId: ProfileId): Promise<NatalChart[]>;
  deleteChart(id: ChartId): Promise<void>;
  deleteChartsForProfile(profileId: ProfileId): Promise<void>;
  
  // Preferences
  savePreferences(prefs: ProfilePreferences): Promise<void>;
  getPreferences(): Promise<ProfilePreferences | null>;
  
  // Selected Profile
  setSelectedProfile(id: ProfileId | null): Promise<void>;
  getSelectedProfile(): Promise<ProfileId | null>;
  
  // Migration
  migrateIfNeeded(): Promise<void>;
  clearAll(): Promise<void>;
}

// LocalStorage implementation
class LocalStoragePersistence implements PersistenceLayer {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getItem<T>(key: string): T | null {
    if (!this.isAvailable()) return null;
    
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isAvailable()) {
      throw new Error('LocalStorage not available');
    }
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Try to clear old charts and retry
        this.clearOldCharts();
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        throw error;
      }
    }
  }

  private removeItem(key: string): void {
    if (!this.isAvailable()) return;
    localStorage.removeItem(key);
  }

  // Profiles
  async saveProfile(profile: AstroProfile): Promise<void> {
    const profiles = await this.getAllProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    
    this.setItem(STORAGE_KEYS.PROFILES, profiles);
  }

  async getProfile(id: ProfileId): Promise<AstroProfile | null> {
    const profiles = await this.getAllProfiles();
    return profiles.find(p => p.id === id) || null;
  }

  async getAllProfiles(): Promise<AstroProfile[]> {
    return this.getItem<AstroProfile[]>(STORAGE_KEYS.PROFILES) || [];
  }

  async deleteProfile(id: ProfileId): Promise<void> {
    const profiles = await this.getAllProfiles();
    const filtered = profiles.filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PROFILES, filtered);
    
    // Also delete associated charts
    await this.deleteChartsForProfile(id);
    
    // Clear selection if this was selected
    const selected = await this.getSelectedProfile();
    if (selected === id) {
      await this.setSelectedProfile(null);
    }
  }

  async updateProfile(profile: AstroProfile): Promise<void> {
    await this.saveProfile(profile);
  }

  // Charts
  async saveChart(chart: NatalChart): Promise<void> {
    const charts = this.getItem<Record<string, NatalChart>>(STORAGE_KEYS.CHARTS) || {};
    charts[chart.id] = chart;
    this.setItem(STORAGE_KEYS.CHARTS, charts);
  }

  async getChart(id: ChartId): Promise<NatalChart | null> {
    const charts = this.getItem<Record<string, NatalChart>>(STORAGE_KEYS.CHARTS) || {};
    return charts[id] || null;
  }

  async getChartsForProfile(profileId: ProfileId): Promise<NatalChart[]> {
    const charts = this.getItem<Record<string, NatalChart>>(STORAGE_KEYS.CHARTS) || {};
    return Object.values(charts).filter(c => c.profileId === profileId);
  }

  async deleteChart(id: ChartId): Promise<void> {
    const charts = this.getItem<Record<string, NatalChart>>(STORAGE_KEYS.CHARTS) || {};
    delete charts[id];
    this.setItem(STORAGE_KEYS.CHARTS, charts);
  }

  async deleteChartsForProfile(profileId: ProfileId): Promise<void> {
    const charts = this.getItem<Record<string, NatalChart>>(STORAGE_KEYS.CHARTS) || {};
    const filtered: Record<string, NatalChart> = {};
    
    for (const [id, chart] of Object.entries(charts)) {
      if (chart.profileId !== profileId) {
        filtered[id] = chart;
      }
    }
    
    this.setItem(STORAGE_KEYS.CHARTS, filtered);
  }

  // Preferences
  async savePreferences(prefs: ProfilePreferences): Promise<void> {
    this.setItem(STORAGE_KEYS.PREFERENCES, prefs);
  }

  async getPreferences(): Promise<ProfilePreferences | null> {
    return this.getItem<ProfilePreferences>(STORAGE_KEYS.PREFERENCES);
  }

  // Selected Profile
  async setSelectedProfile(id: ProfileId | null): Promise<void> {
    if (id === null) {
      this.removeItem(STORAGE_KEYS.SELECTED_PROFILE);
    } else {
      this.setItem(STORAGE_KEYS.SELECTED_PROFILE, id);
    }
  }

  async getSelectedProfile(): Promise<ProfileId | null> {
    return this.getItem<ProfileId>(STORAGE_KEYS.SELECTED_PROFILE);
  }

  // Migration
  async migrateIfNeeded(): Promise<void> {
    const version = this.getItem<string>(STORAGE_KEYS.VERSION);
    
    if (version === CURRENT_VERSION) {
      // Even if version matches, check for legacy data that might need syncing
      await this.migrateFromLegacy();
      return;
    }
    
    console.log(`[Persistence] Migrating from version ${version || 'none'} to ${CURRENT_VERSION}`);
    
    // Migrate from legacy storage
    await this.migrateFromLegacy();
    
    this.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
  }

  // Migrate profiles and charts from legacy storage
  private async migrateFromLegacy(): Promise<void> {
    try {
      // Check if we already have profiles in new system
      const existingProfiles = await this.getAllProfiles();
      if (existingProfiles.length > 0) {
        // New system has data, but still check for legacy charts that might be orphaned
        await this.syncLegacyCharts();
        return;
      }

      // Migrate legacy profiles
      const legacyProfiles = this.getItem<Array<{id: string; name: string; birthData: unknown; isDefault?: boolean}>>(LEGACY_KEYS.PROFILES);
      
      if (legacyProfiles && legacyProfiles.length > 0) {
        console.log(`[Persistence] Migrating ${legacyProfiles.length} legacy profiles`);
        
        for (const legacy of legacyProfiles) {
          // Get birth data from legacy profile
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const legacyBirthData = (legacy as any).birthData || {
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            latitude: 0,
            longitude: 0,
            timezone: 'UTC'
          };

          const now = Date.now() as unknown as import('../../types').Timestamp;
          const profile: AstroProfile = {
            id: legacy.id as ProfileId,
            name: legacy.name,
            birthData: legacyBirthData as import('../../types').BirthData,
            createdAt: now,
            updatedAt: now,
            preferences: {
              zodiacSystem: '12-sign',
              zodiacFrame: 'tropical',
              signCount: 12,
              houseSystem: 'placidus',
              showAspects: true,
              showMinorAspects: false,
              showRetrogrades: true,
              showDignities: false,
              defaultChartView: 'wheel',
              ayanamsa: null,
              showNakshatras: false,
              nakshatraSystem: 'none',
            },
            chartIds: []
          };
          
          await this.saveProfile(profile);
          
          // Migrate chart for this profile
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const legacyChart = this.getItem<Record<string, any>>(`${LEGACY_KEYS.CHART_PREFIX}${legacy.id}`);
          if (legacyChart) {
            // Create a chart ID for the migrated chart
            const chartId = createChartId();
            
            // Create a properly structured chart
            const migratedChart: NatalChart = {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...(legacyChart as any),
              id: chartId,
              profileId: legacy.id as ProfileId,
              calculatedAt: (legacyChart.calculatedAt || Date.now()) as unknown as import('../../types').Timestamp,
              version: '2.0',
              zodiacSystem: legacyChart.zodiacSystem || '12-sign',
              zodiacFrame: legacyChart.zodiacFrame || (legacyChart.zodiacSystem === 'sidereal' ? 'sidereal' : 'tropical'),
              signCount: legacyChart.signCount || (legacyChart.zodiacSystem === '13-sign' ? 13 : 12),
              houseSystem: legacyChart.houseSystem || 'placidus'
            } as NatalChart;
            
            await this.saveChart(migratedChart);
            // Update profile with chartIds by creating new profile object
            const updatedProfile: AstroProfile = {
              ...profile,
              updatedAt: Date.now() as unknown as import('../../types').Timestamp,
              chartIds: [chartId as string]
            };
            await this.saveProfile(updatedProfile);
          }
        }
        
        // Migrate active profile selection
        const legacyActive = this.getItem<string>(LEGACY_KEYS.ACTIVE_PROFILE);
        if (legacyActive && legacyProfiles.find(p => p.id === legacyActive)) {
          await this.setSelectedProfile(legacyActive as ProfileId);
        }
        
        console.log('[Persistence] Legacy migration complete');
      } else {
        // No legacy profiles, but check for orphaned charts
        await this.syncLegacyCharts();
      }
    } catch (error) {
      console.error('[Persistence] Migration failed:', error);
    }
  }

  // Sync legacy charts that aren't in the new system
  private async syncLegacyCharts(): Promise<void> {
    try {
      const existingCharts = await this.getAllCharts();
      const existingChartIds = new Set(existingCharts.map(c => c.id));
      
      // Find all legacy chart keys
      const legacyChartKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(LEGACY_KEYS.CHART_PREFIX)) {
          legacyChartKeys.push(key);
        }
      }
      
      let syncedCount = 0;
      for (const key of legacyChartKeys) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const legacyChart = this.getItem<Record<string, any>>(key);
        if (legacyChart && !existingChartIds.has(legacyChart.id as ChartId)) {
          // Extract profileId from key (natal-chart-${profileId})
          const profileId = key.replace(LEGACY_KEYS.CHART_PREFIX, '');
          
          // Create a properly structured chart with new ID
          const chartId = createChartId();
          const migratedChart: NatalChart = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(legacyChart as any),
            id: chartId,
            profileId: profileId as ProfileId,
            calculatedAt: legacyChart.calculatedAt || Date.now(),
            version: '2.0',
            zodiacSystem: legacyChart.zodiacSystem || '12-sign',
            zodiacFrame: legacyChart.zodiacFrame || (legacyChart.zodiacSystem === 'sidereal' ? 'sidereal' : 'tropical'),
            signCount: legacyChart.signCount || (legacyChart.zodiacSystem === '13-sign' ? 13 : 12),
            houseSystem: legacyChart.houseSystem || 'placidus'
          } as NatalChart;
          
          await this.saveChart(migratedChart);
          syncedCount++;
        }
      }
      
      if (syncedCount > 0) {
        console.log(`[Persistence] Synced ${syncedCount} legacy charts`);
      }
    } catch (error) {
      console.error('[Persistence] Chart sync failed:', error);
    }
  }

  // Helper to get all charts (needed for sync)
  private async getAllCharts(): Promise<NatalChart[]> {
    const raw = this.getItem<NatalChart[] | Record<string, NatalChart>>(STORAGE_KEYS.CHARTS);
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    // Charts may be stored as a Record/map object — convert to array
    return Object.values(raw);
  }

  // Clear all data
  async clearAll(): Promise<void> {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }

  // Private helpers
  private clearOldCharts(): void {
    const charts = this.getItem<Record<string, NatalChart>>(STORAGE_KEYS.CHARTS) || {};
    const sorted = Object.entries(charts)
      .sort((a, b) => b[1].calculatedAt - a[1].calculatedAt);
    
    // Keep only the 50 most recent charts
    const toKeep = sorted.slice(0, 50);
    const reduced: Record<string, NatalChart> = {};
    
    for (const [id, chart] of toKeep) {
      reduced[id] = chart;
    }
    
    this.setItem(STORAGE_KEYS.CHARTS, reduced);
  }
}

// Memory fallback for environments without localStorage
class MemoryPersistence implements PersistenceLayer {
  private profiles = new Map<ProfileId, AstroProfile>();
  private charts = new Map<ChartId, NatalChart>();
  private preferences: ProfilePreferences | null = null;
  private selectedProfile: ProfileId | null = null;

  async saveProfile(profile: AstroProfile): Promise<void> {
    this.profiles.set(profile.id, profile);
  }

  async getProfile(id: ProfileId): Promise<AstroProfile | null> {
    return this.profiles.get(id) || null;
  }

  async getAllProfiles(): Promise<AstroProfile[]> {
    return Array.from(this.profiles.values());
  }

  async deleteProfile(id: ProfileId): Promise<void> {
    this.profiles.delete(id);
    await this.deleteChartsForProfile(id);
    if (this.selectedProfile === id) {
      this.selectedProfile = null;
    }
  }

  async updateProfile(profile: AstroProfile): Promise<void> {
    this.profiles.set(profile.id, profile);
  }

  async saveChart(chart: NatalChart): Promise<void> {
    this.charts.set(chart.id, chart);
  }

  async getChart(id: ChartId): Promise<NatalChart | null> {
    return this.charts.get(id) || null;
  }

  async getChartsForProfile(profileId: ProfileId): Promise<NatalChart[]> {
    return Array.from(this.charts.values()).filter(c => c.profileId === profileId);
  }

  async deleteChart(id: ChartId): Promise<void> {
    this.charts.delete(id);
  }

  async deleteChartsForProfile(profileId: ProfileId): Promise<void> {
    for (const [id, chart] of this.charts) {
      if (chart.profileId === profileId) {
        this.charts.delete(id);
      }
    }
  }

  async savePreferences(prefs: ProfilePreferences): Promise<void> {
    this.preferences = prefs;
  }

  async getPreferences(): Promise<ProfilePreferences | null> {
    return this.preferences;
  }

  async setSelectedProfile(id: ProfileId | null): Promise<void> {
    this.selectedProfile = id;
  }

  async getSelectedProfile(): Promise<ProfileId | null> {
    return this.selectedProfile;
  }

  async migrateIfNeeded(): Promise<void> {
    // No migration needed for memory storage
  }

  async clearAll(): Promise<void> {
    this.profiles.clear();
    this.charts.clear();
    this.preferences = null;
    this.selectedProfile = null;
  }
}

// Create singleton instance
function createPersistence(): PersistenceLayer {
  try {
    const test = new LocalStoragePersistence();
    // Test if localStorage works
    if (typeof localStorage !== 'undefined') {
      return test;
    }
  } catch {
    console.warn('LocalStorage not available, using memory persistence');
  }
  return new MemoryPersistence();
}

export const persistence = createPersistence();

// Re-export from types (types/profile is a separate module)
import { DEFAULT_PROFILE_PREFERENCES as _DEFAULT_PROFILE_PREFERENCES } from '../../types/profile';
export { _DEFAULT_PROFILE_PREFERENCES as DEFAULT_PROFILE_PREFERENCES };

// Profile utilities
export function createProfileId(): ProfileId {
  return `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as ProfileId;
}

export function createChartId(): ChartId {
  return `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as ChartId;
}
