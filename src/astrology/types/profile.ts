/**
 * Profile Types
 * User profiles for storing birth data and preferences
 */

import type { 
  BirthData, 
  HouseSystemType,
  ZodiacSystemType,
  ZodiacFrame,
  SignCount,
  NakshatraSystemType,
  Timestamp 
} from './core';
import type { SiderealSystem } from './extended';
import type { ProfileId } from './chart';

// Profile
export interface AstroProfile {
  readonly id: ProfileId;
  readonly name: string;
  readonly birthData: BirthData;
  readonly notes?: string;
  readonly tags?: string[];
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
  readonly preferences: ProfilePreferences;
  readonly chartIds: string[];
}

export interface ProfilePreferences {
  readonly zodiacSystem: ZodiacSystemType;   // legacy — derive from frame+count
  readonly zodiacFrame: ZodiacFrame;
  readonly signCount: SignCount;
  readonly houseSystem: HouseSystemType;
  readonly showAspects: boolean;
  readonly showMinorAspects: boolean;
  readonly showRetrogrades: boolean;
  readonly showDignities: boolean;
  readonly defaultChartView: 'wheel' | 'grid' | 'list';
  // ═══ Mode-aware celestial configuration ═══
  readonly ayanamsa: SiderealSystem | null;
  readonly showNakshatras: boolean;
  readonly nakshatraSystem: NakshatraSystemType;
}

export const DEFAULT_PROFILE_PREFERENCES: ProfilePreferences = {
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
};

// Profile Creation
export interface CreateProfileInput {
  readonly name: string;
  readonly birthData: BirthData;
  readonly notes?: string;
  readonly tags?: string[];
  readonly preferences?: Partial<ProfilePreferences>;
}

// Profile Update
export interface UpdateProfileInput {
  readonly name?: string;
  readonly birthData?: Partial<BirthData>;
  readonly notes?: string;
  readonly tags?: string[];
  readonly preferences?: Partial<ProfilePreferences>;
}

// Profile Search/Filter
export interface ProfileFilter {
  readonly searchTerm?: string;
  readonly tags?: string[];
  readonly hasNotes?: boolean;
  readonly zodiacSystem?: ZodiacSystemType;
  readonly createdAfter?: Timestamp;
  readonly createdBefore?: Timestamp;
}

// Profile Statistics
export interface ProfileStats {
  readonly totalProfiles: number;
  readonly profilesByZodiacSystem: {
    readonly '12-sign': number;
    readonly '13-sign': number;
  };
  readonly profilesByElement: Record<string, number>;
  readonly recentlyViewed: readonly ProfileId[];
}
