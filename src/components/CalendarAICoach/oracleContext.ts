/**
 * Oracle Context Builder — Extracted from CalendarAICoach
 * Pure async functions for building the rich celestial + user context
 * that powers the AI coach's messages.
 */

import { OracleEngine, type CelestialState } from '../../oracle/oracleEngine';
import { civilToHeka, hekaToCivil } from '../../services/calendarService';
import type { HekaDate } from '../../types';
import type { OracleContext } from '../../types/oracle';
import {
  getLocalTimeContext,
  getCurrentUserLocation,
  getSignElement,
} from '../../utils/oracleUtils';
import { getSignFromLongitude, toDegree } from '../../astrology/types/core';
import type { CelestialBody } from '../../astrology/types/core';
import { getSignCount } from '../../astrology/services/swiss-ephemeris/engine';
import { calculateAllPlanets, calculateJulianDay } from '../../astrology/services/swiss-ephemeris/engine';
import { getSeasonalContext } from '../../utils/locationAstro';
import { aiConfigService } from '../../services/aiConfigService';
import { getMoodTrend, getToneAdjustmentForMood } from '../../services/sentimentService';
import type { UserArchetype } from '../../oracle/archetypeEngine';
import { generateStreakDangerMessage } from '../../services/streakProtectionService';
import { getDailyTransitReading, type DailyTransitReading } from '../../services/transitService';
import {
  getCurrentPlanetaryHour,
  calculateSunTimes,
  calculateCurrentAspects,
  findCriticalDegrees,
  type CurrentAspect,
  type CriticalDegree,
} from '../../astrology/services/calculations/swissCalculations';
import { getAICoachZone } from '../../services/aiCoachContextService';
import type { RootState } from '../../store';

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEREAL SOLAR RETURN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate the sidereal solar return date for a given year.
 * Uses iterative refinement converging on the exact moment the sidereal Sun
 * returns to the natal sidereal longitude.
 */
export async function calculateSiderealSolarReturnDate(
  natalSunLongitude: number,
  targetYear: number,
  birthDate: Date
): Promise<Date | null> {
  try {
    let date = new Date(targetYear, birthDate.getMonth(), birthDate.getDate(), 12, 0, 0);

    for (let i = 0; i < 5; i++) {
      const jd = calculateJulianDay(
        date.getFullYear(), date.getMonth() + 1, date.getDate(),
        date.getHours(), date.getMinutes(), 0
      );
      const positions = calculateAllPlanets(jd, ['sun'], { zodiacFrame: 'sidereal', signCount: 12 });
      const sunLon = positions['sun']?.longitude ?? 0;
      const diff = ((natalSunLongitude - sunLon + 540) % 360) - 180;
      const daysToShift = diff / 0.9856;
      if (Math.abs(daysToShift) < 0.001) break;
      date = new Date(date.getTime() + daysToShift * 24 * 60 * 60 * 1000);
    }

    return date;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOLAR RETURN CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

export async function getSolarReturnContext(
  astroProfiles: RootState['calendar']['astroProfiles'],
  selectedAstroProfileId: string | null,
  timeMode: 'SYNC' | 'TRUE'
): Promise<OracleContext['solarReturn']> {
  const profile = astroProfiles.find((p) => p.id === selectedAstroProfileId);
  if (!profile?.birthDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birth = new Date(profile.birthDate);
  const birthMonth = birth.getMonth();
  const birthDay = birth.getDate();

  // Feb 29 edge case: on non-leap years, check Feb 28 instead
  const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const effectiveBirthDay = birthMonth === 1 && birthDay === 29 && !isLeapYear(today.getFullYear()) ? 28 : birthDay;

  let isToday = false;
  let daysUntil = 0;
  let nextBirthday: Date;

  if (timeMode === 'TRUE') {
    // Sidereal solar return: when the sidereal Sun returns to natal sidereal longitude
    const sunPosition = profile.natalChart?.positions?.find((p) => p.planet === 'sun');
    const natalSunLongitude = sunPosition?.exactLongitude;

    if (natalSunLongitude !== undefined) {
      let targetYear = today.getFullYear();
      let returnDate = await calculateSiderealSolarReturnDate(natalSunLongitude, targetYear, birth);

      if (returnDate) {
        returnDate.setHours(0, 0, 0, 0);
        if (returnDate.getTime() < today.getTime()) {
          targetYear++;
          returnDate = await calculateSiderealSolarReturnDate(natalSunLongitude, targetYear, birth);
          if (returnDate) returnDate.setHours(0, 0, 0, 0);
        }
        if (returnDate) {
          nextBirthday = returnDate;
          isToday = returnDate.getTime() === today.getTime();
          const diffMs = returnDate.getTime() - today.getTime();
          daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        }
      }
    }

    // Fallback to civil birthday if sidereal calculation fails
    if (!nextBirthday!) {
      let targetYear = today.getFullYear();
      nextBirthday = new Date(targetYear, birthMonth, effectiveBirthDay);
      nextBirthday.setHours(0, 0, 0, 0);
      if (nextBirthday.getTime() < today.getTime()) {
        targetYear++;
        const nextEffectiveBirthDay = birthMonth === 1 && birthDay === 29 && !isLeapYear(targetYear) ? 28 : birthDay;
        nextBirthday = new Date(targetYear, birthMonth, nextEffectiveBirthDay);
        nextBirthday.setHours(0, 0, 0, 0);
      }
      isToday = nextBirthday.getTime() === today.getTime();
      const diffMs = nextBirthday.getTime() - today.getTime();
      daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }
  } else {
    // Tropical / SYNC mode: use civil birthday
    let targetYear = today.getFullYear();
    nextBirthday = new Date(targetYear, birthMonth, effectiveBirthDay);
    nextBirthday.setHours(0, 0, 0, 0);
    if (nextBirthday.getTime() < today.getTime()) {
      targetYear++;
      const nextEffectiveBirthDay = birthMonth === 1 && birthDay === 29 && !isLeapYear(targetYear) ? 28 : birthDay;
      nextBirthday = new Date(targetYear, birthMonth, nextEffectiveBirthDay);
      nextBirthday.setHours(0, 0, 0, 0);
    }
    isToday = nextBirthday.getTime() === today.getTime();
    const diffMs = nextBirthday.getTime() - today.getTime();
    daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  const isApproaching = !isToday && daysUntil > 0 && daysUntil <= 3;

  const sunPosition = profile.natalChart?.positions?.find((p) => p.planet === 'sun');
  const sign = sunPosition?.sign || '';

  if (isToday || isApproaching) {
    return { isToday, isApproaching, sign, daysUntil };
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORACLE CONTEXT BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

export async function buildOracleContext(
  focusDate: HekaDate | null,
  astroProfiles: RootState['calendar']['astroProfiles'],
  selectedAstroProfileId: string | null,
  timeMode: 'SYNC' | 'TRUE'
): Promise<OracleContext> {
  const today = new Date();
  const contextDate = focusDate ? hekaToCivil(focusDate) : today;
  const todayIso = contextDate.toISOString().split('T')[0];
  const hekaDate = focusDate || civilToHeka(today);
  const dateKey = hekaDate ? `${hekaDate.year}-${hekaDate.month}-${hekaDate.day}` : todayIso;
  const time = getLocalTimeContext();

  let celestialState: CelestialState | null = null;
  try {
    celestialState = await OracleEngine.getCurrentCelestialState();
  } catch {
    // ignore
  }

  const userContext = aiConfigService.getUserContext();
  const lastJournal = userContext.lastJournalDate;
  const daysSinceJournal = lastJournal
    ? Math.floor((today.getTime() - new Date(lastJournal).getTime()) / (1000 * 60 * 60 * 24))
    : 99;

  const moonPhase = celestialState?.moonPhase?.phase || '';
  const moonSign = celestialState?.moonPhase?.sign || '';
  const sunSign = celestialState?.planets?.sun?.sign || '';
  const retrogrades = Object.values(celestialState?.planets || {})
    .filter((p: CelestialBody) => p.isRetrograde)
    .map((p: CelestialBody) => p.id);

  const moodTrend = getMoodTrend(userContext.moodHistory || []);
  const toneAdjustment = getToneAdjustmentForMood(moodTrend);

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: Personal transits & Void Moon
  // ═══════════════════════════════════════════════════════════════════════════
  let transit: DailyTransitReading = {
    transits: [],
    topTransit: null,
    overallTone: 'quiet',
    summary: '',
    hasBirthChart: false,
  };
  try {
    // Cache transit calculation for 30 minutes to avoid repeated expensive calls
    const lastCalculated = userContext.lastTransitCalculatedAt || 0;
    if (userContext.lastTransitData && Date.now() - lastCalculated < 30 * 60 * 1000) {
      try {
        transit = JSON.parse(userContext.lastTransitData) as typeof transit;
      } catch {
        // fall through to recalculate
      }
    }
    if (!transit.hasBirthChart) {
      transit = await getDailyTransitReading();
    }
    if (transit.summary) {
      aiConfigService.setUserContext({
        lastTransitSummary: transit.summary,
        lastTransitData: JSON.stringify(transit),
        lastTransitCalculatedAt: Date.now(),
      });
    }
  } catch (e) {
    console.warn('[CalendarAICoach] Transit calculation failed:', e);
  }

  const isVoidMoon = celestialState?.moonPhase?.isVoid || false;
  if (isVoidMoon !== userContext.lastVoCState) {
    aiConfigService.setUserContext({ lastVoCState: isVoidMoon, lastVoCCheckedAt: Date.now() });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3: Location-aware celestial context (planetary hours, sun times, season)
  // ═══════════════════════════════════════════════════════════════════════════
  const location = getCurrentUserLocation();
  let planetaryHour: OracleContext['planetaryHour'] = null;
  let sunTimes: OracleContext['sunTimes'] = { sunrise: null, sunset: null, solarNoon: null, dayLength: 0 };
  let season: OracleContext['season'] = null;

  if (location.hasLocation) {
    try {
      const ph = await getCurrentPlanetaryHour(today, location.latitude, location.longitude, location.timezoneOffset);
      planetaryHour = {
        planet: ph.planet,
        symbol: ph.symbol,
        activities: ph.activities,
        isDay: ph.isDay,
        progress: ph.progress,
      };
      if (ph.sunrise) sunTimes.sunrise = ph.sunrise;
      if (ph.sunset) sunTimes.sunset = ph.sunset;
    } catch (e) {
      console.warn('[CalendarAICoach] Planetary hour calculation failed:', e);
    }

    try {
      const st = await calculateSunTimes(today, location.latitude, location.longitude);
      sunTimes = {
        sunrise: st.sunrise || sunTimes.sunrise,
        sunset: st.sunset || sunTimes.sunset,
        solarNoon: st.solarNoon,
        dayLength: st.dayLength,
      };
    } catch (e) {
      console.warn('[CalendarAICoach] Sun times calculation failed:', e);
    }

    try {
      const sc = getSeasonalContext(today, location.latitude);
      season = {
        season: sc.season,
        hemisphere: sc.hemisphere,
        zodiacInPower: sc.zodiacInPower,
      };
    } catch (e) {
      console.warn('[CalendarAICoach] Season calculation failed:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4: Rich Swiss Ephemeris context (all planets, aspects, critical degrees)
  // ═══════════════════════════════════════════════════════════════════════════
  const positions = celestialState?.planets || {};

  const allPlanets: OracleContext['celestial']['allPlanets'] = {};
  for (const [name, body] of Object.entries(positions)) {
    if (body && typeof body === 'object') {
      const celestialBody = body as CelestialBody;
      allPlanets[name] = {
        sign: celestialBody.sign || '',
        degree: Math.round((celestialBody.degreeInSign || 0) * 100) / 100,
        isRetrograde: !!celestialBody.isRetrograde,
        speed: Math.round((celestialBody.speed || 0) * 100) / 100,
      };
    }
  }

  let currentAspects: CurrentAspect[] = [];
  let criticalDegrees: CriticalDegree[] = [];
  try {
    currentAspects = calculateCurrentAspects(positions, { maxOrb: 6 });
    criticalDegrees = findCriticalDegrees(positions);
  } catch (e) {
    console.warn('[CalendarAICoach] Advanced celestial calculation failed:', e);
  }

  const moonBody = positions.moon;
  const moonDetails = {
    illumination: Math.round((celestialState?.moonPhase?.illumination || 0) * 10) / 10,
    age: moonBody ? Math.round(((moonBody.longitude % 360) / 13.176396) * 10) / 10 : 0,
    speed: Math.round((moonBody?.speed || 0) * 100) / 100,
  };

  const lunarNodes = positions.northnode
    ? { north: positions.northnode.sign, south: ((positions.northnode.longitude + 180) % 360 < 180 ? positions.southnode?.sign : undefined) || '' }
    : null;

  // South node is always 180° opposite the north node
  const southNodeSign = positions.northnode
    ? getSignFromLongitude(toDegree((positions.northnode.longitude + 180) % 360), getSignCount() === 13)
    : '';

  const chiron = positions.chiron
    ? { sign: positions.chiron.sign, degree: Math.round(positions.chiron.degreeInSign * 100) / 100 }
    : null;

  return {
    focusDate: hekaDate,
    dateKey,
    todayIso,
    timeLabel: time.label,
    greeting: time.greeting,
    hour: time.hour,
    celestial: {
      moonPhase,
      moonSign,
      sunSign,
      retrogrades,
      dominantElement: getSignElement(sunSign),
      allPlanets,
      currentAspects,
      criticalDegrees,
      moonDetails,
      lunarNodes: lunarNodes ? { north: lunarNodes.north, south: southNodeSign } : null,
      chiron,
      rawPositions: positions,
    },
    user: {
      pendingTasks: userContext.pendingTasks || 0,
      todayCompleted: userContext.todayTasksCompleted || 0,
      streak: userContext.currentTaskStreak || 0,
      daysSinceJournal,
      hasCreatedFirstTask: userContext.hasCreatedFirstTask,
      lastTaskCreationDate: userContext.lastTaskCreationDate,
      lastTaskContent: userContext.lastTaskContent,
      lastJournalThemes: userContext.lastJournalThemes || [],
      lastJournalSnippet: userContext.lastJournalSnippet,
      lastCoachInteraction: userContext.lastCoachInteraction || 0,
      writingStreak: userContext.writingStreak || 0,
      longestWritingStreak: userContext.longestWritingStreak || 0,
      moodAverage: userContext.moodAverage || 0,
      totalNotes: userContext.totalNotes || 0,
    },
    memory: {
      recentMessages: userContext.coachMemory || [],
      recentTopics: (userContext.coachMemory || []).map((m) => m.topic),
      lastPrompt: userContext.lastCoachPrompt || '',
    },
    mood: {
      history: userContext.moodHistory || [],
      ...moodTrend,
      ...toneAdjustment,
    },
    archetype: {
      name: userContext.userArchetype as UserArchetype | undefined,
      confidence: userContext.archetypeConfidence || 0,
    },
    streakDanger: generateStreakDangerMessage({
      isInDanger: (userContext.lastStreakDangerLevel || 'none') !== 'none',
      dangerLevel: userContext.lastStreakDangerLevel || 'none',
      streakAtRisk: userContext.streakAtRisk || 0,
    }),
    transit,
    isVoidMoon,
    location,
    planetaryHour,
    sunTimes,
    season,
    solarReturn: await getSolarReturnContext(astroProfiles, selectedAstroProfileId, timeMode),
    zone: getAICoachZone(),
    timeMode,
  };
}
