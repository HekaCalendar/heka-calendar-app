/**
 * Profile Types
 * User profiles for storing birth data and preferences
 */

import type { 
  BirthData, 
  HouseSystemType,
  Timestamp 
} from './core';
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
  readonly zodiacSystem: '12-sign' | '13-sign';
  readonly houseSystem: HouseSystemType;
  readonly showAspects: boolean;
  readonly showMinorAspects: boolean;
  readonly showRetrogrades: boolean;
  readonly showDignities: boolean;
  readonly defaultChartView: 'wheel' | 'grid' | 'list';
}

export const DEFAULT_PROFILE_PREFERENCES: ProfilePreferences = {
  zodiacSystem: '12-sign',
  houseSystem: 'placidus',
  showAspects: true,
  showMinorAspects: false,
  showRetrogrades: true,
  showDignities: false,
  defaultChartView: 'wheel'
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
  readonly zodiacSystem?: '12-sign' | '13-sign';
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
