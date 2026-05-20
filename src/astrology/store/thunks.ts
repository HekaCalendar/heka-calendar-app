/**
 * Astrology Thunks
 * Async actions for calculations and persistence
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { addAstroProfile } from '../../store';
import type { 
  AstroProfile, 
  NatalChart, 
  ProfileId, 
  ChartParams,
  CreateProfileInput
} from '../types';
import type {
  AstroProfile as CalendarAstroProfile,
  NatalChart as CalendarNatalChart,
  PlanetPosition,
  HouseCusp,
} from '../../types/astrology';
import { getSignFromLongitude, getDegreeInSign } from '../types/core';
import type { Degree } from '../types/core';

import {
  generateNatalChart,
  initializeSwissEphemeris,
  calculateAllPlanets,
  calculateJulianDay
} from '../services/swiss-ephemeris/engine';

import { calculateAspects } from '../services/calculations/aspects';
import { detectPatterns } from '../services/calculations/patterns';
import { 
  persistence, 
  createProfileId,
  DEFAULT_PROFILE_PREFERENCES 
} from '../services/persistence';

import {
  syncAstroProfile,
  deleteAstroProfile as deleteCloudAstroProfile,
  syncAstroChart,
  syncAstroPreferences,
  loadAllAstroData,
  syncAllAstroData,
} from '../../services/firebase';

import {
  setProfiles,
  setCharts,
  addProfile as addProfileAction,
  removeProfile as removeProfileAction,
  setLoading,
  setError,
  setCalculationStatus,
  setCalculationProgress,
  selectProfile,
  addChart,
  setPreferences,
  setCurrentPlanetaryPositions
} from './slice';

// ═══════════════════════════════════════════════════════════════════════════════
// CALENDAR SLICE SYNC BRIDGE
// Ensures AI Coach, transit service, and day panel see profiles/charts created
// in the new StarsHub astrology system.
// ═══════════════════════════════════════════════════════════════════════════════

function convertAstrologyChartToCalendar(
  profileId: string,
  chart: NatalChart,
  birthData: {
    date: string;
    time: string;
    timezone: string;
    location: { latitude: number; longitude: number; name?: string; altitude?: number };
  }
): CalendarNatalChart {
  const use13Signs = chart.signCount === 13;

  // Convert planetary bodies to calendar PlanetPosition[]
  const positions: PlanetPosition[] = Object.entries(chart.bodies || {}).map(([planetId, body]) => ({
    planet: planetId as any,
    sign: (body.sign || getSignFromLongitude(body.longitude as Degree, use13Signs)) as any,
    degree: (body.degreeInSign ?? getDegreeInSign(body.longitude as Degree, use13Signs)) as number,
    exactLongitude: body.longitude as number,
    isRetrograde: body.isRetrograde ?? false,
    speed: body.speed ?? 0,
  }));

  // Convert house cusps
  const houses: HouseCusp[] = (chart.houses?.cusps || []).map((cusp) => ({
    house: cusp.number as any,
    sign: cusp.sign as any,
    degree: cusp.degreeInSign as number,
    exactLongitude: cusp.longitude as number,
  }));

  // Build ascendant PlanetPosition from house system ascendant degree
  const ascLongitude = chart.houses?.ascendant as number | undefined;
  const ascendant: PlanetPosition | null = ascLongitude !== undefined ? {
    planet: 'sun' as any,
    sign: getSignFromLongitude(ascLongitude as Degree, use13Signs) as any,
    degree: getDegreeInSign(ascLongitude as Degree, use13Signs) as number,
    exactLongitude: ascLongitude,
    isRetrograde: false,
    speed: 0,
  } : null;

  // Build midheaven PlanetPosition from house system mc degree
  const mcLongitude = chart.houses?.mc as number | undefined;
  const midheaven: PlanetPosition | null = mcLongitude !== undefined ? {
    planet: 'sun' as any,
    sign: getSignFromLongitude(mcLongitude as Degree, use13Signs) as any,
    degree: getDegreeInSign(mcLongitude as Degree, use13Signs) as number,
    exactLongitude: mcLongitude,
    isRetrograde: false,
    speed: 0,
  } : null;

  // Convert aspects (astrology aspect types are a superset of calendar aspect types)
  const aspects = (chart.aspects || []).map((aspect: any) => ({
    planet1: aspect.planet1 as any,
    planet2: aspect.planet2 as any,
    type: aspect.type as any,
    angle: aspect.angle,
    orb: aspect.orb,
    isApplying: aspect.isApplying,
  }));

  const calculatedAt = typeof chart.calculatedAt === 'string'
    ? chart.calculatedAt
    : new Date(chart.calculatedAt as number).toISOString();

  return {
    id: chart.id as string,
    profileId,
    birthDate: birthData.date,
    birthTime: birthData.time,
    birthTimeUnknown: false,
    timezone: birthData.timezone,
    location: {
      name: birthData.location.name || 'Unknown',
      latitude: birthData.location.latitude,
      longitude: birthData.location.longitude,
      altitude: birthData.location.altitude,
    },
    positions,
    ascendant,
    midheaven,
    houses: houses.length > 0 ? houses : undefined,
    aspects,
    calculatedAt,
  };
}

function buildCalendarProfile(
  astrologyProfile: AstroProfile,
  chart?: CalendarNatalChart
): CalendarAstroProfile {
  const zodiacSystem = astrologyProfile.preferences.zodiacFrame === 'sidereal'
    ? 'sidereal'
    : (astrologyProfile.preferences.signCount === 13 ? '13-sign' : '12-sign');

  return {
    id: astrologyProfile.id as string,
    name: astrologyProfile.name,
    birthDate: astrologyProfile.birthData.birthDate,
    birthTime: astrologyProfile.birthData.birthTime,
    birthTimeUnknown: false,
    location: {
      name: astrologyProfile.birthData.location.locationName || 'Unknown',
      latitude: astrologyProfile.birthData.location.latitude,
      longitude: astrologyProfile.birthData.location.longitude,
    },
    timezone: astrologyProfile.birthData.timezone,
    natalChart: chart,
    preferences: {
      zodiacSystem: zodiacSystem as any,
      zodiacFrame: astrologyProfile.preferences.zodiacFrame,
      signCount: astrologyProfile.preferences.signCount,
      houseSystem: astrologyProfile.preferences.houseSystem as any,
      aspectSet: 'major-only' as any,
      showArabianParts: false,
      showAsteroids: false,
      showDwarfPlanets: false,
    },
    createdAt: new Date(astrologyProfile.createdAt as number).toISOString(),
    updatedAt: new Date(astrologyProfile.updatedAt as number).toISOString(),
  };
}

/** Sync an astrology profile (and optional chart) to the calendar slice so
 *  the AI Coach, transit service, and day panel can access it. */
function dispatchCalendarProfileSync(
  dispatch: any,
  astrologyProfile: AstroProfile,
  chart?: NatalChart
) {
  let calendarChart: CalendarNatalChart | undefined;
  if (chart) {
    calendarChart = convertAstrologyChartToCalendar(
      astrologyProfile.id as string,
      chart,
      {
        date: astrologyProfile.birthData.birthDate,
        time: astrologyProfile.birthData.birthTime,
        timezone: astrologyProfile.birthData.timezone,
        location: {
          latitude: astrologyProfile.birthData.location.latitude,
          longitude: astrologyProfile.birthData.location.longitude,
          name: astrologyProfile.birthData.location.locationName,
          altitude: astrologyProfile.birthData.location.altitude,
        },
      }
    );
  }
  dispatch(addAstroProfile(buildCalendarProfile(astrologyProfile, calendarChart)));
}

// Helper: get userId from Redux state
function getUserId(state: RootState): string | null {
  const auth = state.calendar.auth;
  return auth?.isAuthenticated && auth?.userId ? auth.userId : null;
}

// Merge cloud astro data with local data. Cloud data with newer timestamps wins.
async function mergeCloudAstroData(
  dispatch: any,
  userId: string
): Promise<void> {
  const cloud = await loadAllAstroData(userId);
  if (cloud.profiles.length === 0 && cloud.charts.length === 0 && !cloud.preferences) {
    // No cloud data — push local data up instead
    const localProfiles = await persistence.getAllProfiles();
    const localCharts = await Promise.all(
      localProfiles.map(p => persistence.getChartsForProfile(p.id))
    ).then(arr => arr.flat());
    const localPrefs = await persistence.getPreferences();
    const localSelected = await persistence.getSelectedProfile();
    if (localProfiles.length > 0) {
      await syncAllAstroData(userId, {
        profiles: localProfiles,
        charts: localCharts,
        preferences: localPrefs || DEFAULT_PROFILE_PREFERENCES,
        selectedProfileId: localSelected,
      });
    }
    return;
  }

  // Merge profiles: cloud wins if newer (compare _syncedAt or updatedAt)
  const localProfiles = await persistence.getAllProfiles();
  const localProfileMap = new Map(localProfiles.map(p => [p.id, p]));
  for (const cloudProfile of cloud.profiles) {
    const local = localProfileMap.get((cloudProfile as any).id);
    const cloudTime = new Date((cloudProfile as any)._syncedAt || (cloudProfile as any).updatedAt || 0).getTime();
    const localTime = local ? new Date((local as any).updatedAt || 0).getTime() : 0;
    if (!local || cloudTime > localTime) {
      await persistence.saveProfile(cloudProfile as AstroProfile);
      localProfileMap.set((cloudProfile as any).id, cloudProfile as AstroProfile);
    }
  }

  // Merge charts
  const allProfiles = Array.from(localProfileMap.values());
  const localCharts = await Promise.all(
    allProfiles.map(p => persistence.getChartsForProfile(p.id))
  ).then(arr => arr.flat());
  const localChartMap = new Map(localCharts.map(c => [c.id, c]));
  for (const cloudChart of cloud.charts) {
    const local = localChartMap.get((cloudChart as any).id);
    const cloudTime = new Date((cloudChart as any)._syncedAt || (cloudChart as any).calculatedAt || 0).getTime();
    const localTime = local ? new Date((local as any).calculatedAt || 0).getTime() : 0;
    if (!local || cloudTime > localTime) {
      await persistence.saveChart(cloudChart as NatalChart);
      localChartMap.set((cloudChart as any).id, cloudChart as NatalChart);
    }
  }

  // Merge preferences
  if (cloud.preferences) {
    const localPrefs = await persistence.getPreferences();
    const cloudTime = new Date((cloud.preferences as any)._syncedAt || 0).getTime();
    const localTime = localPrefs ? new Date((localPrefs as any)._syncedAt || 0).getTime() : 0;
    if (!localPrefs || cloudTime > localTime) {
      await persistence.savePreferences(cloud.preferences as any);
    }
  }

  // Merge selected profile
  if (cloud.selectedProfileId) {
    const localSelected = await persistence.getSelectedProfile();
    if (!localSelected) {
      await persistence.setSelectedProfile(cloud.selectedProfileId as ProfileId);
    }
  }

  // Re-dispatch merged local state
  const mergedProfiles = await persistence.getAllProfiles();
  const mergedCharts = await Promise.all(
    mergedProfiles.map(p => persistence.getChartsForProfile(p.id))
  ).then(arr => arr.flat());
  dispatch(setProfiles(mergedProfiles));
  dispatch(setCharts(mergedCharts));
  const mergedPrefs = await persistence.getPreferences();
  if (mergedPrefs) dispatch(setPreferences(mergedPrefs));
  const mergedSelected = await persistence.getSelectedProfile();
  if (mergedSelected && mergedProfiles.find(p => p.id === mergedSelected)) {
    dispatch(selectProfile(mergedSelected));
  }
}

// Initialize astrology system
export const initializeAstrology = createAsyncThunk(
  'astrology/initialize',
  async (_, { dispatch, getState }) => {
    dispatch(setLoading({ key: 'initialization', loading: true }));
    
    try {
      // Initialize Swiss Ephemeris
      await initializeSwissEphemeris();
      
      // Load persisted data
      await persistence.migrateIfNeeded();
      
      const profiles = await persistence.getAllProfiles();
      dispatch(setProfiles(profiles));

      // Load charts for all profiles into Redux state (was missing — charts disappeared on reload)
      const charts = await Promise.all(
        profiles.map(p => persistence.getChartsForProfile(p.id))
      ).then(chartArrays => chartArrays.flat());
      dispatch(setCharts(charts));
      
      const selectedId = await persistence.getSelectedProfile();
      if (selectedId && profiles.find(p => p.id === selectedId)) {
        dispatch(selectProfile(selectedId));
      }
      
      const prefs = await persistence.getPreferences();
      if (prefs) {
        dispatch(setPreferences(prefs));
      }

      // Cloud sync: if user is logged in, merge with cloud data
      const userId = getUserId(getState() as RootState);
      if (userId) {
        try {
          await mergeCloudAstroData(dispatch, userId);
          // Push merged local state back to cloud
          const finalProfiles = await persistence.getAllProfiles();
          const finalCharts = await Promise.all(
            finalProfiles.map(p => persistence.getChartsForProfile(p.id))
          ).then(arr => arr.flat());
          const finalPrefs = await persistence.getPreferences();
          const finalSelected = await persistence.getSelectedProfile();
          await syncAllAstroData(userId, {
            profiles: finalProfiles,
            charts: finalCharts,
            preferences: finalPrefs || DEFAULT_PROFILE_PREFERENCES,
            selectedProfileId: finalSelected,
          });
        } catch (cloudErr) {
          console.warn('[Astrology] Cloud sync failed during init:', cloudErr);
        }
      }
      
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Initialization failed';
      dispatch(setError({ key: 'initialization', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'initialization', loading: false }));
    }
  }
);

// Create profile
export const createProfile = createAsyncThunk(
  'astrology/createProfile',
  async (input: CreateProfileInput, { dispatch, getState }) => {
    dispatch(setLoading({ key: 'createProfile', loading: true }));
    
    try {
      const now = Date.now() as unknown as import('../types').Timestamp;
      const profile: AstroProfile = {
        id: createProfileId() as ProfileId,
        name: input.name,
        birthData: input.birthData,
        notes: input.notes,
        tags: input.tags || [],
        createdAt: now,
        updatedAt: now,
        preferences: {
          ...DEFAULT_PROFILE_PREFERENCES,
          ...input.preferences
        },
        chartIds: []
      };
      
      // Save to persistence
      await persistence.saveProfile(profile);
      
      // Update state
      dispatch(addProfileAction(profile));
      dispatch(selectProfile(profile.id));
      
      // Sync to calendar slice so AI Coach can see this profile
      dispatchCalendarProfileSync(dispatch, profile);
      
      // Generate chart for profile
      await dispatch(generateChartForProfile(profile.id));

      // Cloud sync
      const userId = getUserId(getState() as RootState);
      if (userId) {
        await syncAstroProfile(userId, profile);
      }
      
      return profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create profile';
      dispatch(setError({ key: 'createProfile', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'createProfile', loading: false }));
    }
  }
);

// Delete profile
export const deleteProfile = createAsyncThunk(
  'astrology/deleteProfile',
  async (profileId: ProfileId, { dispatch, getState }) => {
    dispatch(setLoading({ key: 'deleteProfile', loading: true }));
    
    try {
      await persistence.deleteProfile(profileId);
      dispatch(removeProfileAction(profileId));

      // Cloud sync
      const userId = getUserId(getState() as RootState);
      if (userId) {
        await deleteCloudAstroProfile(userId, profileId as string);
      }

      return profileId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete profile';
      dispatch(setError({ key: 'deleteProfile', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'deleteProfile', loading: false }));
    }
  }
);

// Generate chart for profile
export const generateChartForProfile = createAsyncThunk(
  'astrology/generateChart',
  async (profileId: ProfileId, { dispatch, getState }) => {
    const state = getState() as RootState;
    const profile = state.astrology.entities.profiles[profileId];
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    dispatch(setLoading({ key: 'generateChart', loading: true }));
    dispatch(setCalculationStatus('calculating'));
    dispatch(setCalculationProgress(0));
    
    try {
      // Use global zodiac preferences from calendar state
      const globalPrefs = state.calendar.astroPreferences || {};
      const globalZodiacSystem = globalPrefs.zodiacSystem || '12-sign';
      const globalZodiacFrame = globalPrefs.zodiacFrame || 'tropical';
      const globalSignCount = globalPrefs.signCount || 12;
      
      // Generate base chart
      const params: ChartParams = {
        profileId,
        birthData: profile.birthData,
        zodiacSystem: globalZodiacSystem,
        zodiacFrame: globalZodiacFrame,
        signCount: globalSignCount,
        houseSystem: profile.preferences.houseSystem
      };
      
      dispatch(setCalculationProgress(20));
      
      let chart = await generateNatalChart(params);
      
      dispatch(setCalculationProgress(60));
      
      // Calculate aspects
      const aspects = calculateAspects(chart.bodies, {
        includeMinorAspects: profile.preferences.showMinorAspects
      });
      
      dispatch(setCalculationProgress(80));
      
      // Detect patterns
      const patterns = detectPatterns(chart.bodies, aspects);
      
      // Complete chart
      const completeChart: NatalChart = {
        ...chart,
        aspects,
        patterns
      } as unknown as NatalChart;
      
      dispatch(setCalculationProgress(100));
      
      // Save to persistence
      await persistence.saveChart(completeChart);
      
      // Update state
      dispatch(addChart(completeChart));
      dispatch(setCalculationStatus('complete'));
      
      // Sync to calendar slice so AI Coach can access natal chart + transits
      const updatedProfile = (getState() as RootState).astrology.entities.profiles[profileId];
      if (updatedProfile) {
        dispatchCalendarProfileSync(dispatch, updatedProfile, completeChart);
      }

      // Cloud sync
      const userId = getUserId(getState() as RootState);
      if (userId) {
        await syncAstroChart(userId, completeChart);
      }
      
      return completeChart;
    } catch (error) {
      dispatch(setCalculationStatus('error'));
      const message = error instanceof Error ? error.message : 'Chart calculation failed';
      dispatch(setError({ key: 'generateChart', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'generateChart', loading: false }));
    }
  }
);

// Update profile preferences
export const updateProfilePreferences = createAsyncThunk(
  'astrology/updatePreferences',
  async (
    { profileId, preferences }: { profileId: ProfileId; preferences: Partial<AstroProfile['preferences']> },
    { dispatch, getState }
  ) => {
    const state = getState() as RootState;
    const profile = state.astrology.entities.profiles[profileId];
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    const updatedProfile: AstroProfile = {
      ...profile,
      preferences: { ...profile.preferences, ...preferences },
      updatedAt: Date.now() as unknown as import('../types').Timestamp
    };
    
    await persistence.saveProfile(updatedProfile);
    dispatch(addProfileAction(updatedProfile));
    
    // Sync preferences update to calendar slice
    dispatchCalendarProfileSync(dispatch, updatedProfile);

    // Cloud sync
    const userId = getUserId(getState() as RootState);
    if (userId) {
      await syncAstroProfile(userId, updatedProfile);
      if (preferences) {
        await syncAstroPreferences(userId, { ...state.astrology.preferences, ...preferences });
      }
    }
    
    // Regenerate chart if zodiac frame, sign count, or house system changed
    if (preferences.zodiacSystem || preferences.zodiacFrame || preferences.signCount || preferences.houseSystem) {
      await dispatch(generateChartForProfile(profileId));
    }
    
    return updatedProfile;
  }
);

// Load all profiles
export const loadProfiles = createAsyncThunk(
  'astrology/loadProfiles',
  async (_, { dispatch }) => {
    dispatch(setLoading({ key: 'loadProfiles', loading: true }));
    
    try {
      const profiles = await persistence.getAllProfiles();
      dispatch(setProfiles(profiles));
      
      // Load charts for profiles
      const charts = await Promise.all(
        profiles.map(p => persistence.getChartsForProfile(p.id))
      ).then(chartArrays => chartArrays.flat());
      dispatch(setCharts(charts)); // Was missing — charts fetched but never dispatched
      
      return { profiles, charts };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load profiles';
      dispatch(setError({ key: 'loadProfiles', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'loadProfiles', loading: false }));
    }
  }
);

// Update current planetary positions
export const updateCurrentPlanetaryPositions = createAsyncThunk(
  'astrology/updateCurrentPositions',
  async (_, { dispatch }) => {
    try {
      const now = new Date();
      const jd = calculateJulianDay(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1,
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      );
      
      const positions = calculateAllPlanets(jd, [
        'sun', 'moon', 'mercury', 'venus', 'mars',
        'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
      ]);
      
      const simplified: Record<string, { longitude: number; sign: import('../types').ZodiacSign; speed: number }> = {};
      
      for (const [id, body] of Object.entries(positions as any)) {
        simplified[id] = {
          longitude: (body as any).longitude,
          sign: (body as any).sign as import('../types').ZodiacSign,
          speed: (body as any).speed
        };
      }
      
      dispatch(setCurrentPlanetaryPositions(simplified));
      return simplified;
    } catch (error) {
      console.error('Failed to update planetary positions:', error);
      throw error;
    }
  }
);

// Select profile and persist selection
export const selectAndPersistProfile = createAsyncThunk(
  'astrology/selectAndPersist',
  async (profileId: ProfileId | null, { dispatch }) => {
    await persistence.setSelectedProfile(profileId);
    dispatch(selectProfile(profileId));
    return profileId;
  }
);

// Export all thunks
export const thunks = {
  initializeAstrology,
  createProfile,
  deleteProfile,
  generateChartForProfile,
  updateProfilePreferences,
  loadProfiles,
  updateCurrentPlanetaryPositions,
  selectAndPersistProfile
};
