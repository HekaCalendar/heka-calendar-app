/**
 * Chart Bridge - Unifies OLD and NEW storage systems
 * 
 * The app has two storage systems for birth charts:
 * 1. OLD: ProfileManager → localStorage key `natal-chart-${profileId}`
 * 2. NEW: Redux/Persistence → localStorage key `heka:astrology:charts`
 * 
 * This bridge provides a unified interface to read charts from both systems,
 * ensuring backward compatibility while migrating toward the new system.
 */

import type { NatalChart } from '../types';

// OLD system storage keys
const OLD_CHART_KEY = (profileId: string) => `natal-chart-${profileId}`;
const OLD_ACTIVE_PROFILE_KEY = 'heka:astro:activeProfile';

// NEW system storage keys
const NEW_CHARTS_KEY = 'heka:astrology:charts';
const NEW_SELECTED_PROFILE_KEY = 'heka:astrology:selected-profile';

interface OldNatalChart {
  id: string;
  name: string;
  birthData: {
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    timezone: string;
    locationName?: string;
  };
  planets: Record<string, {
    id: string;
    name: string;
    sign: string;
    longitude: number;
    house: number;
    isRetrograde: boolean;
    dignity: string;
  }>;
  houses: {
    system: string;
    cusps: number[];
  };
  ascendant: {
    sign: string;
    longitude: number;
  };
  midheaven: {
    sign: string;
    longitude: number;
  };
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  calculatedAt: string;
  zodiacSystem: '12-sign' | '13-sign';
  houseSystem?: string;
}

/**
 * Get chart from OLD storage system
 */
function getOldChart(profileId: string): OldNatalChart | null {
  try {
    const stored = localStorage.getItem(OLD_CHART_KEY(profileId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[ChartBridge] Error reading old chart:', e);
  }
  return null;
}

/**
 * Get charts from NEW storage system
 */
function getNewCharts(): Record<string, NatalChart> {
  try {
    const stored = localStorage.getItem(NEW_CHARTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[ChartBridge] Error reading new charts:', e);
  }
  return {};
}

/**
 * Get active/selected profile ID from either system
 */
function getActiveProfileId(): string | null {
  // Try new system first
  try {
    const newSelected = localStorage.getItem(NEW_SELECTED_PROFILE_KEY);
    if (newSelected) {
      return JSON.parse(newSelected);
    }
  } catch (e) {
    // Ignore
  }

  // Fall back to old system
  try {
    const oldActive = localStorage.getItem(OLD_ACTIVE_PROFILE_KEY);
    if (oldActive) {
      const parsed = JSON.parse(oldActive);
      return parsed.id || null;
    }
  } catch (e) {
    // Ignore
  }

  return null;
}

/**
 * Get all profile IDs from both systems
 */
function getAllProfileIds(): string[] {
  const ids = new Set<string>();

  // Get from old chart keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('natal-chart-')) {
      ids.add(key.replace('natal-chart-', ''));
    }
  }

  // Get from new system charts
  const newCharts = getNewCharts();
  Object.values(newCharts).forEach(chart => {
    if (chart.profileId) {
      ids.add(chart.profileId);
    }
  });

  return Array.from(ids);
}

/**
 * Get the most recent chart for a profile (checks BOTH systems)
 */
export function getUnifiedChart(profileId?: string): NatalChart | null {
  const targetProfileId = profileId || getActiveProfileId();
  
  if (!targetProfileId) {
    // Try to find any available chart
    const allIds = getAllProfileIds();
    if (allIds.length === 0) return null;
    
    // Use the first available profile
    return getUnifiedChart(allIds[0]);
  }

  // First, check NEW system
  const newCharts = getNewCharts();
  const newChartEntries = Object.values(newCharts).filter(
    c => c.profileId === targetProfileId
  );
  
  if (newChartEntries.length > 0) {
    // Sort by calculatedAt and return most recent
    return newChartEntries.sort(
      (a, b) => new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime()
    )[0];
  }

  // Fall back to OLD system
  const oldChart = getOldChart(targetProfileId);
  if (oldChart) {
    // Convert old format to new format
    return {
      id: oldChart.id,
      profileId: targetProfileId,
      birthData: oldChart.birthData,
      bodies: Object.fromEntries(
        Object.entries(oldChart.planets).map(([key, p]) => [key, {
          id: p.id,
          name: p.name,
          longitude: p.longitude,
          sign: p.sign,
          house: p.house,
          isRetrograde: p.isRetrograde,
          speed: 0,
        }])
      ),
      houses: oldChart.houses,
      aspects: [],
      patterns: [],
      dignities: [],
      elementalBalance: {
        Fire: oldChart.elements.fire,
        Earth: oldChart.elements.earth,
        Air: oldChart.elements.air,
        Water: oldChart.elements.water,
      },
      modalBalance: {
        Cardinal: oldChart.modalities.cardinal,
        Fixed: oldChart.modalities.fixed,
        Mutable: oldChart.modalities.mutable,
      },
      julianDay: 0,
      calculatedAt: oldChart.calculatedAt,
      version: '2.0',
      zodiacSystem: oldChart.zodiacSystem,
      houseSystem: oldChart.houseSystem || 'placidus',
    } as unknown as NatalChart;
  }

  return null;
}

/**
 * Check if ANY chart exists (for quick UI checks)
 */
export function hasAnyChart(): boolean {
  // Check new system
  const newCharts = getNewCharts();
  if (Object.keys(newCharts).length > 0) {
    return true;
  }

  // Check old system
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('natal-chart-')) {
      return true;
    }
  }

  return false;
}

/**
 * Get user birth data for void moon and other features
 */
export function getUnifiedUserBirthData(): { moonSign: string; voidMoon: boolean } | null {
  const chart = getUnifiedChart();
  if (!chart) return null;

  // Get moon sign from bodies (new format) or fallback
  const moonBody = chart.bodies?.moon;
  if (moonBody?.sign) {
    return {
      moonSign: moonBody.sign,
      voidMoon: false,
    };
  }

  return null;
}

/**
 * Delete chart from BOTH systems
 */
export function deleteUnifiedChart(profileId: string): void {
  // Delete from old system
  try {
    localStorage.removeItem(OLD_CHART_KEY(profileId));
  } catch (e) {
    console.warn('[ChartBridge] Error deleting old chart:', e);
  }

  // Delete from new system
  try {
    const charts = getNewCharts();
    const filtered: Record<string, NatalChart> = {};
    for (const [id, chart] of Object.entries(charts)) {
      if (chart.profileId !== profileId) {
        filtered[id] = chart;
      }
    }
    localStorage.setItem(NEW_CHARTS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('[ChartBridge] Error deleting new chart:', e);
  }
}

export default {
  getUnifiedChart,
  hasAnyChart,
  getUnifiedUserBirthData,
  deleteUnifiedChart,
};
