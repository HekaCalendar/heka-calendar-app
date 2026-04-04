/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PROFILE MANAGER - Enterprise Multi-Profile Architecture
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Manages multiple natal charts with strict typing, caching, and event-driven
 * state management. Supports unlimited profiles with efficient localStorage
 * serialization.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { NatalChart, BirthData } from './natalChart';
import { saveNatalChart, getNatalChart, deleteNatalChart, getDignity, getHouseFromLongitude } from './natalChart';
import { calculateCurrentSky, calculateLocalHouses } from '../calculations/swissCalculations';
import { getSignFromLongitude, SIGN_ELEMENTS_13, SIGN_ELEMENTS } from '../../types/core';
import { getZodiacSystemPreference, calculateElementalBalanceWithSystem, calculateModalityBalanceWithSystem } from './zodiacHelpers';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isDefault: boolean;
  readonly tags: string[];
  readonly notes?: string;
  readonly avatar?: string; // Emoji or color code
}

export interface ProfileWithChart extends Profile {
  chart: NatalChart;
}

export interface ProfileListItem {
  id: string;
  name: string;
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
  avatar: string;
  isDefault: boolean;
  createdAt: Date;
}

export type ProfileEventType = 
  | 'profile:created' 
  | 'profile:updated' 
  | 'profile:deleted' 
  | 'profile:switched' 
  | 'profile:set-default';

export interface ProfileEvent {
  readonly type: ProfileEventType;
  readonly profileId: string;
  readonly timestamp: Date;
  readonly payload?: unknown;
}

type ProfileEventListener = (event: ProfileEvent) => void;

export interface ProfileManagerState {
  readonly profiles: Profile[];
  readonly activeProfileId: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  PROFILES: 'celestial-profiles-v1',
  ACTIVE_PROFILE: 'celestial-active-profile-id',
  PROFILE_INDEX: 'celestial-profile-index',
} as const;

const MAX_PROFILES = 50; // Prevent storage bloat
const MAX_NOTE_LENGTH = 500;

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE MANAGER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class ProfileManager {
  private static instance: ProfileManager;
  private profiles: Map<string, Profile> = new Map();
  private activeProfileId: string | null = null;
  private listeners: Set<ProfileEventListener> = new Set();
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): ProfileManager {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager();
    }
    return ProfileManager.instance;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  private initialize(): void {
    if (this.isInitialized) return;
    
    try {
      this.loadProfilesFromStorage();
      this.loadActiveProfile();
      this.isInitialized = true;
      console.log('[ProfileManager] Initialized with', this.profiles.size, 'profiles');
    } catch (error) {
      console.error('[ProfileManager] Initialization failed:', error);
    }
  }

  private loadProfilesFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!stored) return;

    try {
      const parsed: Profile[] = JSON.parse(stored);
      parsed.forEach(profile => {
        // Restore Date objects from JSON
        const restored: Profile = {
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt),
        };
        this.profiles.set(restored.id, restored);
      });
    } catch (error) {
      console.error('[ProfileManager] Failed to parse profiles:', error);
    }
  }

  private loadActiveProfile(): void {
    this.activeProfileId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
  }

  private persistProfiles(): void {
    const profilesArray = Array.from(this.profiles.values());
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profilesArray));
  }

  private persistActiveProfile(): void {
    if (this.activeProfileId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, this.activeProfileId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  subscribe(listener: ProfileEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: ProfileEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('[ProfileManager] Event listener error:', error);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROFILE CRUD OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async createProfile(
    name: string,
    birthData: BirthData,
    options?: {
      notes?: string;
      tags?: string[];
      avatar?: string;
      makeDefault?: boolean;
    }
  ): Promise<ProfileWithChart> {
    // Validate
    if (!name.trim()) {
      throw new ProfileValidationError('Profile name is required');
    }

    if (this.profiles.size >= MAX_PROFILES) {
      throw new ProfileLimitError(`Maximum ${MAX_PROFILES} profiles allowed`);
    }

    if (options?.notes && options.notes.length > MAX_NOTE_LENGTH) {
      throw new ProfileValidationError(`Notes exceed ${MAX_NOTE_LENGTH} characters`);
    }

    // Generate ID
    const id = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    // Get zodiac system preference
    const zodiacSystem = getZodiacSystemPreference();

    // Calculate natal chart
    const chart = await this.calculateNatalChart(id, name, birthData, zodiacSystem);

    // Create profile
    const profile: Profile = {
      id,
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
      isDefault: options?.makeDefault ?? this.profiles.size === 0,
      tags: options?.tags?.map(t => t.trim().toLowerCase()) || [],
      notes: options?.notes?.trim(),
      avatar: options?.avatar || this.generateAvatar(chart),
    };

    // If making default, unset other defaults
    if (profile.isDefault) {
      this.unsetAllDefaults();
    }

    // Store
    this.profiles.set(id, profile);
    this.persistProfiles();

    // Auto-switch to new profile
    this.setActiveProfile(id);

    // Emit event
    this.emit({
      type: 'profile:created',
      profileId: id,
      timestamp: new Date(),
      payload: { name: profile.name },
    });

    return { ...profile, chart };
  }

  async updateProfile(
    id: string,
    updates: Partial<Pick<Profile, 'name' | 'notes' | 'tags' | 'avatar'>> & {
      birthData?: BirthData;
    }
  ): Promise<ProfileWithChart> {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new ProfileNotFoundError(`Profile ${id} not found`);
    }

    let chart: NatalChart | null = null;

    // If birth data changed, recalculate chart
    if (updates.birthData) {
      const zodiacSystem = getZodiacSystemPreference();
      chart = await this.calculateNatalChart(id, updates.name || profile.name, updates.birthData, zodiacSystem);
      // Update stored chart
      saveNatalChart(chart, id);
    } else {
      // Load existing chart
      chart = getNatalChart(id);
      if (!chart) {
        throw new ProfileNotFoundError('Chart data not found for profile');
      }
    }

    // Update profile
    const updated: Profile = {
      ...profile,
      ...(updates.name && { name: updates.name.trim() }),
      ...(updates.notes !== undefined && { notes: updates.notes?.trim() }),
      ...(updates.tags && { tags: updates.tags.map(t => t.trim().toLowerCase()) }),
      ...(updates.avatar && { avatar: updates.avatar }),
      updatedAt: new Date(),
    };

    this.profiles.set(id, updated);
    this.persistProfiles();

    this.emit({
      type: 'profile:updated',
      profileId: id,
      timestamp: new Date(),
    });

    return { ...updated, chart };
  }

  deleteProfile(id: string): void {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new ProfileNotFoundError(`Profile ${id} not found`);
    }

    // Remove profile
    this.profiles.delete(id);
    deleteNatalChart(id);

    // If was active, clear active
    if (this.activeProfileId === id) {
      this.activeProfileId = null;
      this.persistActiveProfile();
    }

    // If was default and others exist, make first default
    if (profile.isDefault && this.profiles.size > 0) {
      const first = Array.from(this.profiles.values())[0];
      this.setDefaultProfile(first.id);
    }

    this.persistProfiles();

    this.emit({
      type: 'profile:deleted',
      profileId: id,
      timestamp: new Date(),
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROFILE QUERIES
  // ═══════════════════════════════════════════════════════════════════════════

  getProfile(id: string): Profile | null {
    return this.profiles.get(id) || null;
  }

  getProfileWithChart(id: string): ProfileWithChart | null {
    const profile = this.profiles.get(id);
    if (!profile) return null;

    const chart = getNatalChart(id);
    if (!chart) return null;

    return { ...profile, chart };
  }

  getActiveProfile(): Profile | null {
    if (!this.activeProfileId) return null;
    return this.profiles.get(this.activeProfileId) || null;
  }

  getActiveProfileWithChart(): ProfileWithChart | null {
    if (!this.activeProfileId) return null;
    return this.getProfileWithChart(this.activeProfileId);
  }

  listProfiles(): ProfileListItem[] {
    return Array.from(this.profiles.values())
      .map(profile => {
        const chart = getNatalChart(profile.id);
        return {
          id: profile.id,
          name: profile.name,
          sunSign: chart?.planets.sun?.sign || 'unknown',
          moonSign: chart?.planets.moon?.sign || 'unknown',
          ascendantSign: chart?.houses?.ascendant ? 
            this.getSignFromLongitudeInternal(chart.houses.ascendant) : 'unknown',
          avatar: profile.avatar || '✨',
          isDefault: profile.isDefault,
          createdAt: profile.createdAt,
        };
      })
      .sort((a, b) => {
        // Default first, then by name
        if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  getAllProfiles(): Profile[] {
    return Array.from(this.profiles.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getDefaultProfile(): Profile | null {
    for (const profile of this.profiles.values()) {
      if (profile.isDefault) return profile;
    }
    // Return first if no default set
    return this.profiles.values().next().value || null;
  }

  //
  // ZODIAC SYSTEM
  //

  async recalculateChartWithZodiacSystem(
    profileId: string, 
    zodiacSystem?: '12-sign' | '13-sign'
  ): Promise<NatalChart | null> {
    
    const profile = this.profiles.get(profileId);
    if (!profile) {
      console.log('[ProfileManager] No profile found:', profileId);
      return null;
    }

    const currentChart = getNatalChart(profileId);
    if (!currentChart) {
      console.log('[ProfileManager] No chart found for:', profileId);
      return null;
    }

    console.log('[ProfileManager] Current chart birth data:', JSON.stringify(currentChart.birthData));

    // Use provided zodiac system or fall back to preference
    const targetSystem = zodiacSystem || getZodiacSystemPreference();
    
    if (currentChart.zodiacSystem === targetSystem) {
      console.log('[ProfileManager] Chart already using target system, skipping recalc');
      return currentChart;
    }

    console.log('[ProfileManager] Recalculating chart with', targetSystem);
    const newChart = await this.calculateNatalChart(profileId, profile.name, currentChart.birthData, targetSystem);
    console.log('[ProfileManager] New chart sun sign:', newChart.planets.sun?.sign);
    
    saveNatalChart(newChart, profileId);
    console.log('[ProfileManager] Chart saved to storage');
    
    this.emit({ type: 'profile:updated', profileId, timestamp: new Date() });
    return newChart;
  }

  //
  // ACTIVE PROFILE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  setActiveProfile(id: string): void {
    if (!this.profiles.has(id)) {
      throw new ProfileNotFoundError(`Profile ${id} not found`);
    }

    this.activeProfileId = id;
    this.persistActiveProfile();

    this.emit({
      type: 'profile:switched',
      profileId: id,
      timestamp: new Date(),
    });
  }

  setDefaultProfile(id: string): void {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new ProfileNotFoundError(`Profile ${id} not found`);
    }

    this.unsetAllDefaults();
    
    const updated = { ...profile, isDefault: true };
    this.profiles.set(id, updated);
    this.persistProfiles();

    this.emit({
      type: 'profile:set-default',
      profileId: id,
      timestamp: new Date(),
    });
  }

  private unsetAllDefaults(): void {
    for (const [id, profile] of this.profiles) {
      if (profile.isDefault) {
        this.profiles.set(id, { ...profile, isDefault: false });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHART CALCULATION
  // ═══════════════════════════════════════════════════════════════════════════

  private async calculateNatalChart(
    profileId: string,
    name: string,
    birthData: BirthData,
    zodiacSystem: '12-sign' | '13-sign' = '12-sign'
  ): Promise<NatalChart> {
    // Validate birth data
    if (!birthData.date || !birthData.time) {
      throw new ChartCalculationError('Birth date and time are required');
    }
    if (isNaN(birthData.latitude) || isNaN(birthData.longitude)) {
      throw new ChartCalculationError('Valid latitude and longitude are required');
    }

    console.log('[ProfileManager] Raw birth data:', JSON.stringify(birthData));
    const date = new Date(`${birthData.date}T${birthData.time}`);
    console.log('[ProfileManager] Parsed date:', date.toISOString(), 'from:', birthData.date, 'T', birthData.time);
    if (isNaN(date.getTime())) {
      throw new ChartCalculationError('Invalid birth date/time format');
    }
    
    // Calculate planetary positions
    let skyData;
    try {
      console.log('[ProfileManager] Calculating sky for date:', date);
      skyData = await calculateCurrentSky(date);
      console.log('[ProfileManager] Sky data received:', skyData ? 'yes' : 'no');
    } catch (err) {
      console.error('[ProfileManager] calculateCurrentSky error:', err);
      throw new ChartCalculationError('Failed to calculate planetary positions');
    }

    if (!skyData || !skyData.positions) {
      console.error('[ProfileManager] No positions in skyData:', skyData);
      throw new ChartCalculationError('No planetary positions returned');
    }

    const positions = skyData.positions;
    console.log('[ProfileManager] Positions:', Object.keys(positions));
    
    // Log first position to check structure
    const firstPos = Object.values(positions)[0];
    console.log('[ProfileManager] First position structure:', firstPos ? Object.keys(firstPos) : 'undefined');
    
    // Validate positions
    if (Object.keys(positions).length === 0) {
      throw new ChartCalculationError('Empty planetary positions');
    }

    // Calculate houses
    let houseData;
    try {
      console.log('[ProfileManager] Calculating houses...');
      houseData = await calculateLocalHouses(date, birthData.latitude, birthData.longitude);
      console.log('[ProfileManager] House data received:', houseData ? 'yes' : 'no');
    } catch (err) {
      console.error('[ProfileManager] calculateLocalHouses error:', err);
      throw new ChartCalculationError('Failed to calculate house positions');
    }
    
    if (!houseData || !houseData.cusps) {
      console.error('[ProfileManager] Invalid house data:', houseData);
      throw new ChartCalculationError('Invalid house data returned');
    }

    console.log('[ProfileManager] House cusps count:', houseData.cusps.length);

    const houses = {
      type: 'placidus' as const,
      cusps: houseData.cusps as any,
      ascendant: houseData.ascendant as any,
      mc: houseData.mc as any,
      ic: houseData.ic as any,
      dsc: houseData.descendant as any,
    };

    // Transform to NatalPlanet with house placements
    const planets: Record<string, any> = {};
    const use13Signs = zodiacSystem === '13-sign';
    
    Object.entries(positions).forEach(([planetId, position]) => {
      console.log(`[ProfileManager] Processing ${planetId}:`, position ? 'valid' : 'undefined');
      if (!position || typeof position.longitude !== 'number') {
        console.warn(`[ProfileManager] Invalid position data for ${planetId}:`, position);
        return; // Skip invalid planet
      }
      try {
        // Recalculate sign based on zodiac system preference
        const sign = getSignFromLongitude(position.longitude as any, use13Signs) as string;
        const house = getHouseFromLongitude(position.longitude, houses);
        
        planets[planetId] = {
          ...position,
          sign, // Override with correct zodiac system sign
          house,
          dignity: getDignity(planetId, sign),
        };
        console.log(`[ProfileManager] Added ${planetId} as ${sign} (house ${house})`);
      } catch (houseErr) {
        console.error(`[ProfileManager] Error calculating house for ${planetId}:`, houseErr);
        const sign = getSignFromLongitude(position.longitude as any, use13Signs) as string;
        // Still include the planet even if house calculation fails
        planets[planetId] = {
          ...position,
          sign,
          house: 1, // Default to house 1
          dignity: getDignity(planetId, sign),
        };
        console.log(`[ProfileManager] Added ${planetId} as ${sign} with fallback house`);
      }
    });
    console.log('[ProfileManager] Final planets in chart:', Object.keys(planets));
    
    if (Object.keys(planets).length === 0) {
      throw new ChartCalculationError('No valid planetary positions found');
    }

    // Get first available planet as fallback for ascendant/midheaven
    const firstPlanet = Object.values(planets)[0];
    
    // Calculate elements and modalities based on zodiac system
    const elementMap = use13Signs ? SIGN_ELEMENTS_13 : SIGN_ELEMENTS;
    const elements = calculateElementalBalanceWithSystem(planets, elementMap as Record<string, string>);
    const modalities = calculateModalityBalanceWithSystem(planets, use13Signs);
    
    // Safety check: ensure birth data date is not today's date (indicates corruption)
    const today = new Date().toISOString().split('T')[0];
    if (birthData.date === today) {
      console.error('[ProfileManager] WARNING: Birth data appears to be corrupted (using today\'s date). Birth date:', birthData.date);
    }
    
    const chart: NatalChart = {
      id: `natal-${profileId}`,
      name,
      birthData,
      planets,
      houses,
      ascendant: planets.sun || firstPlanet || { longitude: 0, sign: 'aries', degree: 0 } as any,
      midheaven: planets.sun || firstPlanet || { longitude: 0, sign: 'aries', degree: 0 } as any,
      elements,
      modalities,
      calculatedAt: new Date(),
      zodiacSystem,
    };

    saveNatalChart(chart, profileId);
    return chart;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  private generateAvatar(chart: NatalChart): string {
    const sunSign = chart.planets.sun?.sign;
    const avatars: Record<string, string> = {
      aries: '🔥', taurus: '🌱', gemini: '💨', cancer: '🌊',
      leo: '👑', virgo: '🌾', libra: '⚖️', scorpio: '🦂',
      sagittarius: '🏹', capricorn: '🐐', aquarius: '⚡', pisces: '🐟',
    };
    return avatars[sunSign || ''] || '✨';
  }

  private getSignFromLongitudeInternal(longitude: number): string {
    // Use global zodiac system preference
    const use13Signs = getZodiacSystemPreference() === '13-sign';
    return getSignFromLongitude(longitude as any, use13Signs) as string;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPORT/IMPORT
  // ═══════════════════════════════════════════════════════════════════════════

  exportAllProfiles(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profiles: Array.from(this.profiles.values()),
    };
    return JSON.stringify(data, null, 2);
  }

  importProfiles(jsonData: string): { imported: number; errors: string[] } {
    const errors: string[] = [];
    let imported = 0;

    try {
      const data = JSON.parse(jsonData);
      
      if (!data.profiles || !Array.isArray(data.profiles)) {
        throw new Error('Invalid profile data format');
      }

      for (const profileData of data.profiles) {
        try {
          // Validate required fields
          if (!profileData.id || !profileData.name || !profileData.birthData) {
            errors.push(`Skipped invalid profile: ${profileData.name || 'unnamed'}`);
            continue;
          }

          // Check for duplicates
          if (this.profiles.has(profileData.id)) {
            errors.push(`Skipped duplicate profile: ${profileData.name}`);
            continue;
          }

          // Restore profile
          const profile: Profile = {
            ...profileData,
            createdAt: new Date(profileData.createdAt),
            updatedAt: new Date(profileData.updatedAt),
            isDefault: false, // Don't import default status
          };

          this.profiles.set(profile.id, profile);
          imported++;
        } catch (err) {
          errors.push(`Failed to import profile: ${err instanceof Error ? err.message : 'unknown error'}`);
        }
      }

      this.persistProfiles();
      
      // Set first as default if none exists
      if (!this.getDefaultProfile() && this.profiles.size > 0) {
        const first = Array.from(this.profiles.values())[0];
        this.setDefaultProfile(first.id);
      }
    } catch (error) {
      errors.push(`Import failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    }

    return { imported, errors };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBUG/MAINTENANCE
  // ═══════════════════════════════════════════════════════════════════════════

  clearAllProfiles(): void {
    this.profiles.clear();
    this.activeProfileId = null;
    
    // Clear all profile-related storage
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE);
    
    // Clear individual chart data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('natal-chart-')) {
        localStorage.removeItem(key);
      }
    }

    this.emit({
      type: 'profile:deleted',
      profileId: 'all',
      timestamp: new Date(),
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR CLASSES
// ═══════════════════════════════════════════════════════════════════════════════

export class ProfileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileValidationError';
  }
}

export class ProfileNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileNotFoundError';
  }
}

export class ProfileLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileLimitError';
  }
}

export class ChartCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChartCalculationError';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const profileManager = ProfileManager.getInstance();

export default profileManager;

