/**
 * HEKA Astrology Service
 * Manages astro profiles, natal charts, and daily transit calculations
 */

import { 
  AstroProfile, 
  NatalChart, 
  DailyTransit,
  PlanetPosition,
} from '../types/astrology';
import { AstroCalculationEngine } from './AstroCalculationEngine';

const STORAGE_KEY = 'heka_astro_profiles';
const ACTIVE_PROFILE_KEY = 'heka_active_astro_profile';

export class AstroService {
  /**
   * Get all saved astro profiles
   */
  static async getProfiles(): Promise<AstroProfile[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  
  /**
   * Save a new profile and calculate natal chart
   */
  static async saveProfile(
    profileData: Omit<AstroProfile, 'id' | 'createdAt' | 'updatedAt' | 'natalChart'>
  ): Promise<AstroProfile> {
    const now = new Date().toISOString();
    
    const profile: AstroProfile = {
      ...profileData,
      id: `astro-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    
    // Calculate natal chart
    const natalChart: NatalChart = await AstroCalculationEngine.generateNatalChart(
      profile.birthDate,
      profile.birthTime,
      profile.location.latitude,
      profile.location.longitude,
      profile.timezone
    );
    
    natalChart.profileId = profile.id;
    profile.natalChart = natalChart;
    
    // Save to storage
    const profiles = await this.getProfiles();
    profiles.push(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    
    // Set as active profile
    await this.setActiveProfile(profile.id);
    
    return profile;
  }
  
  /**
   * Update existing profile
   */
  static async updateProfile(
    profileId: string,
    updates: Partial<AstroProfile>
  ): Promise<AstroProfile | null> {
    const profiles = await this.getProfiles();
    const index = profiles.findIndex(p => p.id === profileId);
    
    if (index === -1) return null;
    
    // Recalculate chart if birth data changed
    const needsRecalculation = 
      updates.birthDate || 
      updates.birthTime || 
      updates.location?.latitude || 
      updates.location?.longitude;
    
    if (needsRecalculation) {
      const profile = { ...profiles[index], ...updates };
      const natalChart: NatalChart = await AstroCalculationEngine.generateNatalChart(
        profile.birthDate,
        profile.birthTime,
        profile.location.latitude,
        profile.location.longitude,
        profile.timezone
      );
      natalChart.profileId = profileId;
      profile.natalChart = natalChart;
      profile.updatedAt = new Date().toISOString();
      profiles[index] = profile;
    } else {
      profiles[index] = {
        ...profiles[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return profiles[index];
  }
  
  /**
   * Delete a profile
   */
  static async deleteProfile(profileId: string): Promise<boolean> {
    const profiles = await this.getProfiles();
    const filtered = profiles.filter(p => p.id !== profileId);
    
    if (filtered.length === profiles.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // Clear active profile if deleted
    const activeId = await this.getActiveProfileId();
    if (activeId === profileId) {
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
    
    return true;
  }
  
  /**
   * Get active profile
   */
  static async getActiveProfile(): Promise<AstroProfile | null> {
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (!activeId) return null;
    
    const profiles = await this.getProfiles();
    return profiles.find(p => p.id === activeId) || null;
  }
  
  /**
   * Get active profile ID
   */
  static async getActiveProfileId(): Promise<string | null> {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  }
  
  /**
   * Set active profile
   */
  static async setActiveProfile(profileId: string): Promise<void> {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
  }
  
  /**
   * Calculate daily transit for a specific date
   */
  static async calculateDailyTransit(
    date: Date,
    profileId?: string
  ): Promise<DailyTransit | null> {
    const profile = profileId 
      ? (await this.getProfiles()).find(p => p.id === profileId)
      : await this.getActiveProfile();
    
    if (!profile?.natalChart) return null;
    
    return AstroCalculationEngine.calculateDailyTransits(date, profile.natalChart);
  }
  
  /**
   * Get current planetary positions
   */
  static async getCurrentPositions(): Promise<PlanetPosition[]> {
    return AstroCalculationEngine.calculatePlanetaryPositions(new Date());
  }
  
  /**
   * Calculate HEKA date astro reading
   */
  static async getHekaDateReading(
    _hekaYear: number,
    hekaMonth: number,
    hekaDay: number
  ): Promise<{
    sign: string;
    element: string;
    guidance: string;
    powerWord: string;
  }> {
    // Convert HEKA date to approximate Gregorian for calculation
    const { getHekaZodiacReading } = await import('../utils/hekaAstro');
    const reading = getHekaZodiacReading(hekaMonth, hekaDay);
    
    return {
      sign: reading.zodiacSign,
      element: reading.element,
      guidance: reading.guidance,
      powerWord: reading.zodiacData.keywords[0],
    };
  }
}

export default AstroService;
