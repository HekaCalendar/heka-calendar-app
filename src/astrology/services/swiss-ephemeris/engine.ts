/**
 * Swiss Ephemeris WebAssembly Service
 */

import { getSignFromLongitude, toDegree, getDegreeInSign } from '../../types/core';
import type { CelestialBody } from '../../types/core';

const logger = {
  info: (...args: unknown[]) => console.log('[SwissEphemeris]', ...args),
  warn: (...args: unknown[]) => console.warn('[SwissEphemeris]', ...args),
  error: (...args: unknown[]) => console.error('[SwissEphemeris]', ...args),
};

const SWISSEPH_JS_PATH = '/wsam/swisseph.js';

// ═══════════════════════════════════════════════════════════════════════════════
// INTERNAL TYPE INTERFACES — Raw WASM / mock return shapes
// ═══════════════════════════════════════════════════════════════════════════════

interface CalcUtResult {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed?: number;
  distanceSpeed?: number;
}

interface HousesResult {
  error: number | null;
  ascendant: number;
  mc: number;
  [index: number]: number;
}

interface RiseTransitResult {
  rise: number | null;
  transit: number | null;
  set: number | null;
  error?: number | null;
}

interface SwissModule {
  julday: (y: number, m: number, d: number, h: number, c: number) => number;
  calc_ut: (jd: number, p: number, f: number) => CalcUtResult;
  houses_ex: (jd: number, iflag: number, lat: number, lon: number, hsys: number) => HousesResult;
  houses: (jd: number, lat: number, lon: number, hsys: number) => HousesResult;
  sidtime: (jd: number) => number;
  rise_trans: (jd: number, p: number, _st: string, f: number, r: number, lat: number, lon: number, a: number, pr: number, t: number) => RiseTransitResult;
  set_sid_mode?: (mode: number, _t0: number, _t1: number) => void;
  get_ayanamsa_ex_ut?: (jd: number, flags: number) => { ayanamsa: number } | undefined;
}

interface PlanetCalculationResult {
  id: string;
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  isRetrograde: boolean;
  sign: string;
  degreeInSign: number;
}

interface HousesCalculationResult {
  ascendant: number;
  mc: number;
  ic: number;
  dsc: number;
  cusps: Array<{ longitude: number; sign: string }>;
}

interface RiseTransitSetResult {
  rise: number | null;
  transit: number | null;
  set: number | null;
}

interface GenerateNatalChartParams {
  profileId: string;
  birthData: {
    birthDate: string;
    birthTime: string;
    timezone: string;
    location: { latitude: number; longitude: number; altitude?: number };
  };
  zodiacSystem?: '12-sign' | '13-sign' | 'sidereal';
  zodiacFrame?: 'tropical' | 'sidereal';
  signCount?: 12 | 13;
  houseSystem?: string;
}

interface GeneratedNatalChart {
  id: string;
  profileId: string;
  birthData: GenerateNatalChartParams['birthData'];
  bodies: Record<string, CelestialBody>;
  houses: HousesCalculationResult;
  aspects: [];
  patterns: [];
  dignities: [];
  elementalBalance: { fire: number; earth: number; air: number; water: number; ether: number };
  modalBalance: { cardinal: number; fixed: number; mutable: number };
  julianDay: number;
  calculatedAt: string;
  version: number;
  zodiacSystem: '12-sign' | '13-sign' | 'sidereal';
  zodiacFrame: 'tropical' | 'sidereal';
  signCount: 12 | 13;
  houseSystem: string;
}

let swissModule: SwissModule | null = null;
let isFallbackMode = false;
let initializationComplete = false;

export const SE_GREG_CAL = 1;
export const SE_SUN = 0;
export const SE_MOON = 1;
export const SE_MERCURY = 2;
export const SE_VENUS = 3;
export const SE_MARS = 4;
export const SE_JUPITER = 5;
export const SE_SATURN = 6;
export const SE_URANUS = 7;
export const SE_NEPTUNE = 8;
export const SE_PLUTO = 9;
export const SE_TRUE_NODE = 10;
export const SE_MEAN_NODE = 11;
export const SE_CHIRON = 15;
export const SE_ECL_NUT = -1;

export const SEFLG_EQUATORIAL = 2;
export const SEFLG_XYZ = 4;
export const SEFLG_HELCTR = 8;
export const SEFLG_TRUEPOS = 16;
export const SEFLG_J2000 = 32;
export const SEFLG_NONUT = 64;
export const SEFLG_SPEED3 = 256;
export const SEFLG_SPEED = 512;
export const SEFLG_NOGDEFL = 1024;
export const SEFLG_NOABERR = 2048;
export const SEFLG_TOPOCTR = 32768;
export const SEFLG_SIDEREAL = 65536;
export const SEFLG_ICRS = 131072;

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEREAL MODE CONSTANTS (Swiss Ephemeris ayanamsa systems)
// ═══════════════════════════════════════════════════════════════════════════════

export const SE_SIDM_FAGAN_BRADLEY = 0;
export const SE_SIDM_LAHIRI = 1;
export const SE_SIDM_RAMAN = 2;
export const SE_SIDM_DE_LUCE = 9;
export const SE_SIDM_KRISHNAMURTI = 5;
export const SE_SIDM_JN_BHASIN = 8;
export const SE_SIDM_YUKTESHWAR = 6;

/** Map HEKA SiderealSystem names to Swiss Ephemeris sidereal mode constants */
export const SIDEREAL_MODE_MAP: Record<string, number> = {
  'fagan_bradley': SE_SIDM_FAGAN_BRADLEY,
  'lahiri': SE_SIDM_LAHIRI,
  'raman': SE_SIDM_RAMAN,
  'de_luce': SE_SIDM_DE_LUCE,
  'krishnamurti': SE_SIDM_KRISHNAMURTI,
  'jn_bhasin': SE_SIDM_JN_BHASIN,
  'yukteswar': SE_SIDM_YUKTESHWAR,
};

/** Currently active sidereal mode (null = tropical) */
let currentSiderealMode: number | null = null;

export function setSiderealMode(mode: string | null): void {
  if (mode === null) {
    currentSiderealMode = null;
    return;
  }
  currentSiderealMode = SIDEREAL_MODE_MAP[mode] ?? SE_SIDM_LAHIRI;
  // Tell the WASM engine which sidereal mode to use
  if (swissModule && swissModule.set_sid_mode) {
    swissModule.set_sid_mode(currentSiderealMode, 0, 0);
  }
}

export function getSiderealMode(): number | null {
  return currentSiderealMode;
}

export function calculateAyanamsa(jd: number): number {
  if (!swissModule || !swissModule.get_ayanamsa_ex_ut) {
    // Fallback: Lahiri ayanamsa approximation (~23.86° at J2000, precesses 1° per 72 years)
    const yearsSince2000 = (jd - 2451545.0) / 365.25;
    return 23.86 + yearsSince2000 * (50.29 / 3600); // 50.29 arcsec/year
  }
  const aya = swissModule.get_ayanamsa_ex_ut(jd, SEFLG_SIDEREAL);
  return aya?.ayanamsa ?? 0;
}

const DEFAULT_FLAGS = SEFLG_SPEED;

const planetNameToId: Record<string, number> = {
  sun: SE_SUN, moon: SE_MOON, mercury: SE_MERCURY, venus: SE_VENUS,
  mars: SE_MARS, jupiter: SE_JUPITER, saturn: SE_SATURN, uranus: SE_URANUS,
  neptune: SE_NEPTUNE, pluto: SE_PLUTO, northnode: SE_TRUE_NODE, chiron: SE_CHIRON,
};

class MockSwissEngine {
  SE_GREG_CAL = 1;
  
  julday(year: number, month: number, day: number, hour: number, _cal: number): number {
    if (month <= 2) { year -= 1; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5 + hour / 24;
  }

  calc_ut(julianDay: number, planet: number, _flags: number): CalcUtResult {
    const elements: Record<number, { meanLong: number; dailyMotion: number }> = {
      0: { meanLong: 280.46646, dailyMotion: 0.98564736 },
      1: { meanLong: 218.316, dailyMotion: 13.176396 },
      2: { meanLong: 252.251, dailyMotion: 4.092338 },
      3: { meanLong: 181.979, dailyMotion: 1.602130 },
      4: { meanLong: 355.433, dailyMotion: 0.524033 },
      5: { meanLong: 34.351, dailyMotion: 0.083091 },
      6: { meanLong: 50.077, dailyMotion: 0.033444 },
      7: { meanLong: 314.055, dailyMotion: 0.011698 },
      8: { meanLong: 304.349, dailyMotion: 0.005965 },
      9: { meanLong: 238.929, dailyMotion: 0.003964 },
      10: { meanLong: 125.08, dailyMotion: -0.052954 },
    };
    
    const el = elements[planet] || { meanLong: 0, dailyMotion: 0 };
    const jd2000 = 2451545.0;
    const daysSince2000 = julianDay - jd2000;
    let longitude = (el.meanLong + el.dailyMotion * daysSince2000) % 360;
    if (longitude < 0) longitude += 360;
    
    return { longitude, latitude: 0, distance: 1, longitudeSpeed: el.dailyMotion };
  }

  houses_ex(julianDay: number, _system: number, _latitude: number, longitude: number): HousesResult {
    const lst = (280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + longitude) % 360;
    const ascendant = lst;
    const mc = (lst + 90) % 360;

    const result: HousesResult = { error: null, ascendant, mc };
    for (let i = 0; i < 12; i++) {
      result[i] = (ascendant + i * 30) % 360;
    }
    return result;
  }

  houses(julianDay: number, _latitude: number, longitude: number, _hsys: number): HousesResult {
    return this.houses_ex(julianDay, 0, _latitude, longitude);
  }

  sidtime(jd: number): number {
    return (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360 / 15;
  }

  rise_trans(_jd: number, _p: number, _st: string, _f: number, _r: number, _lat: number, _lon: number, _a: number, _pr: number, _t: number): RiseTransitResult {
    return { rise: null, transit: null, set: null };
  }
}

// Initialize - uses real WASM or falls back to mock
export function initializeSwissEphemeris(): Promise<void> {
  return new Promise((resolve) => {
    if (initializationComplete) {
      resolve();
      return;
    }
    
    logger.info('Starting initialization...');
    
    // Use setTimeout to escape current execution context
    setTimeout(() => {
      loadWASM().then((success) => {
        if (success) {
          logger.info('Using real Swiss Ephemeris WASM engine');
          isFallbackMode = false;
        } else {
          logger.warn('WASM failed, using fallback mock engine');
          swissModule = new MockSwissEngine();
          isFallbackMode = true;
        }
        initializationComplete = true;
        resolve();
      }).catch(() => {
        // Absolutely no errors escape
        logger.warn('WASM error caught, using fallback');
        swissModule = new MockSwissEngine();
        isFallbackMode = true;
        initializationComplete = true;
        resolve();
      });
    }, 0);
  });
}

async function loadWASM(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    
    // Check if WASM files exist first
    try {
      const wasmCheck = await fetch('/wsam/swisseph.wasm', { method: 'HEAD' });
      if (!wasmCheck.ok) {
        console.warn('[SwissEphemeris] WASM file not found, using fallback');
        return false;
      }
    } catch {
      console.warn('[SwissEphemeris] Cannot check WASM file, using fallback');
      return false;
    }
    
    let swissephModule: unknown;
    try {
      swissephModule = await import(SWISSEPH_JS_PATH);
    } catch {
      console.warn('[SwissEphemeris] Module import failed (dev server may block public files), using fallback');
      return false;
    }
    if (!swissephModule) {
      console.warn('[SwissEphemeris] Module import returned empty, using fallback');
      return false;
    }
    
    let moduleFactory = (swissephModule as Record<string, unknown>).default || swissephModule;
    if (typeof moduleFactory !== 'function') {
      console.warn('[SwissEphemeris] Module factory not a function, using fallback');
      return false;
    }
    
    // Wrap in try-catch that cannot throw
    return await new Promise((resolve) => {
      let resolved = false;
      
      const config = {
        locateFile: (path: string) => {
          if (path.endsWith('.wasm')) return '/wsam/swisseph.wasm';
          if (path.endsWith('.data')) return '/wsam/swisseph.data';
          return path;
        },
        onRuntimeInitialized: function(this: Record<string, unknown>) {
          if (!resolved) {
            resolved = true;
            const mod = this;
            if (mod && ((mod as Record<string, unknown>)['_swe_julday'] || ((mod as Record<string, unknown>)['asm'] && ((mod as Record<string, unknown>)['asm'] as Record<string, unknown>)['_swe_julday']))) {
              try {
                swissModule = wrapModule(mod);
                resolve(true);
              } catch (err: unknown) {
                console.warn('[SwissEphemeris] wrapModule failed:', err);
                resolve(false);
              }
            } else {
              console.warn('[SwissEphemeris] WASM loaded but functions not found');
              resolve(false);
            }
          }
        },
      };

      try {
        const result = moduleFactory(config);

        if (result && typeof result.then === 'function') {
          result.then((mod: unknown) => {
            if (!resolved && mod) {
              resolved = true;
              try {
                swissModule = wrapModule(mod);
                resolve(true);
              } catch (err: unknown) {
                console.warn('[SwissEphemeris] wrapModule failed on Promise:', err);
                resolve(false);
              }
            }
          }).catch((err: unknown) => {
            if (!resolved) {
              console.warn('[SwissEphemeris] WASM Promise rejected:', err);
              resolved = true;
              resolve(false);
            }
          });
        }
      } catch (err) {
        console.warn('[SwissEphemeris] moduleFactory threw:', err);
        if (!resolved) {
          // Wait for onRuntimeInitialized or timeout
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve(false);
            }
          }, 3000);
        }
      }
      
      // Fallback timeout - shorter now
      setTimeout(() => {
        if (!resolved) {
          console.warn('[SwissEphemeris] WASM init timeout');
          resolved = true;
          resolve(false);
        }
      }, 5000);
    });
  } catch (err) {
    console.warn('[SwissEphemeris] loadWASM caught:', err);
    return false;
  }
}

function wrapModule(rawModule: unknown): SwissModule {
  const Module = rawModule as Record<string, unknown>;
  const funcs: Record<string, Function> = {};
  const names = ['_swe_julday', '_swe_calc_ut', '_swe_houses_ex', '_malloc', '_free', '_swe_rise_trans', '_swe_sidtime', '_swe_houses'];

  names.forEach(name => {
    if (typeof Module[name] === 'function') {
      funcs[name] = (Module[name] as Function).bind(Module);
    } else if (Module.asm && typeof (Module.asm as Record<string, unknown>)[name] === 'function') {
      funcs[name] = ((Module.asm as Record<string, unknown>)[name] as Function).bind(Module.asm);
    }
  });
  
  // Mock implementations for missing functions (WASM failed to load)
  const mockJulday = (y: number, m: number, d: number, h: number) => {
    // Fallback Julian Day calculation
    let year = y, month = m;
    if (month <= 2) { year -= 1; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + d + B - 1524.5 + h / 24;
  };
  
  const mockCalcUt = () => ({ longitude: 0, latitude: 0, distance: 1, longitudeSpeed: 0, latitudeSpeed: 0, distanceSpeed: 0 });
  const mockHouses = (): HousesResult => ({ ascendant: 0, mc: 0, error: null, 0: 0, 1: 30, 2: 60, 3: 90, 4: 120, 5: 150, 6: 180, 7: 210, 8: 240, 9: 270, 10: 300, 11: 330 });
  const mockSidtime = (jd: number) => (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360 / 15;
  const mockRiseTrans = (): RiseTransitResult => ({ rise: null, transit: null, set: null });
  
  return {
    julday: (y: number, m: number, d: number, h: number, c: number) => {
      const fn = funcs['_swe_julday'];
      if (fn) return fn(y, m, d, h, c);
      return mockJulday(y, m, d, h);
    },
    calc_ut: (jd: number, p: number, f: number) => {
      const mallocFn = funcs['_malloc'];
      const calcFn = funcs['_swe_calc_ut'];
      const freeFn = funcs['_free'];
      
      if (!mallocFn || !calcFn || !freeFn || !Module.HEAPF64) {
        return mockCalcUt();
      }

      try {
        const ptr = mallocFn(24);
        calcFn(jd, p, f, ptr);
        const arr = new Float64Array((Module.HEAPF64 as Float64Array).buffer, ptr, 6);
        const ret = { longitude: arr[0], latitude: arr[1], distance: arr[2], longitudeSpeed: arr[3], latitudeSpeed: arr[4], distanceSpeed: arr[5] };
        freeFn(ptr);
        return ret;
      } catch {
        return mockCalcUt();
      }
    },
    houses_ex: (jd: number, iflag: number, lat: number, lon: number, hsys: number) => {
      const mallocFn = funcs['_malloc'];
      const freeFn = funcs['_free'];
      const housesExFn = funcs['_swe_houses_ex'];
      const housesFn = funcs['_swe_houses'];

      if (!mallocFn || !freeFn || !Module.HEAPF64) {
        return mockHouses();
      }

      try {
        // Allocate memory: cusps[13] + ascmc[10]
        const cuspsPtr = mallocFn(13 * 8);
        const ascmcPtr = mallocFn(10 * 8);
        let ret: number;

        if (housesExFn) {
          ret = housesExFn(jd, iflag, lat, lon, hsys, cuspsPtr, ascmcPtr);
        } else if (housesFn) {
          ret = housesFn(jd, lat, lon, hsys, cuspsPtr, ascmcPtr);
        } else {
          freeFn(cuspsPtr);
          freeFn(ascmcPtr);
          return mockHouses();
        }

        const cuspsArr = new Float64Array((Module.HEAPF64 as Float64Array).buffer, cuspsPtr, 13);
        const ascmcArr = new Float64Array((Module.HEAPF64 as Float64Array).buffer, ascmcPtr, 10);

        const result: HousesResult = { error: ret !== 0 ? ret : null, ascendant: 0, mc: 0 };
        // Swiss Ephemeris: cusps[1..12] = houses 1..12
        for (let i = 0; i < 12; i++) {
          result[i] = cuspsArr[i + 1];
        }
        result.ascendant = ascmcArr[0];
        result.mc = ascmcArr[1];

        freeFn(cuspsPtr);
        freeFn(ascmcPtr);
        return result;
      } catch {
        return mockHouses();
      }
    },
    houses: (jd: number, lat: number, lon: number, hsys: number) => {
      const mallocFn = funcs['_malloc'];
      const freeFn = funcs['_free'];
      const housesFn = funcs['_swe_houses'];

      if (!mallocFn || !freeFn || !Module.HEAPF64 || !housesFn) {
        return mockHouses();
      }

      try {
        const cuspsPtr = mallocFn(13 * 8);
        const ascmcPtr = mallocFn(10 * 8);
        const ret = housesFn(jd, lat, lon, hsys, cuspsPtr, ascmcPtr);

        const cuspsArr = new Float64Array((Module.HEAPF64 as Float64Array).buffer, cuspsPtr, 13);
        const ascmcArr = new Float64Array((Module.HEAPF64 as Float64Array).buffer, ascmcPtr, 10);

        const result: HousesResult = { error: ret !== 0 ? ret : null, ascendant: 0, mc: 0 };
        for (let i = 0; i < 12; i++) {
          result[i] = cuspsArr[i + 1];
        }
        result.ascendant = ascmcArr[0];
        result.mc = ascmcArr[1];

        freeFn(cuspsPtr);
        freeFn(ascmcPtr);
        return result;
      } catch {
        return mockHouses();
      }
    },
    sidtime: (jd: number) => {
      const fn = funcs['_swe_sidtime'];
      if (fn) return fn(jd);
      return mockSidtime(jd);
    },
    rise_trans: (jd: number, p: number, _st: string, f: number, r: number, lat: number, lon: number, a: number, pr: number, t: number) => {
      const fn = funcs['_swe_rise_trans'];
      const mallocFn = funcs['_malloc'];
      const freeFn = funcs['_free'];
      if (!fn || !mallocFn || !freeFn || !Module.HEAPF64) {
        return mockRiseTrans();
      }
      try {
        // Allocate: geopos[3], tret[6], serr[256], starname
        const geoposPtr = mallocFn(3 * 8);
        const tretPtr = mallocFn(6 * 8);
        const serrPtr = mallocFn(256);
        const starPtr = mallocFn(1);
        // Write geopos: longitude, latitude, altitude
        const heapF64 = Module.HEAPF64 as Float64Array;
        const geoposArr = new Float64Array(heapF64.buffer, geoposPtr, 3);
        geoposArr[0] = lon;
        geoposArr[1] = lat;
        geoposArr[2] = a;
        // Write empty starname
        (Module.HEAP8 as Int8Array)[starPtr] = 0;
        // Call SE rise_trans
        const ret = fn(jd, p, starPtr, f, r, geoposPtr, pr, t, tretPtr, serrPtr);
        const tretArr = new Float64Array(heapF64.buffer, tretPtr, 6);
        const result: RiseTransitResult = { rise: null, transit: null, set: null, error: ret !== 0 ? ret : null };
        if (ret === 0) {
          // tret[0]=rise, tret[1]=transit, tret[2]=set, tret[3]=upper_culm, tret[4]=lower_culm, tret[5]=opposition
          if (tretArr[0] && tretArr[0] !== 0) result.rise = tretArr[0];
          if (tretArr[1] && tretArr[1] !== 0) result.transit = tretArr[1];
          if (tretArr[2] && tretArr[2] !== 0) result.set = tretArr[2];
        }
        freeFn(geoposPtr);
        freeFn(tretPtr);
        freeFn(serrPtr);
        freeFn(starPtr);
        return result;
      } catch {
        return mockRiseTrans();
      }
    },
  };
}

let currentZodiacSystem: '12-sign' | '13-sign' | 'sidereal' = '12-sign';
let currentZodiacFrame: 'tropical' | 'sidereal' = 'tropical';
let currentSignCount: 12 | 13 = 12;

export function isSwissReady(): boolean { return swissModule !== null; }
export function isSwissEphemerisReady(): boolean { return isSwissReady(); }
export function isUsingFallback(): boolean { return isFallbackMode; }
export function isSwissEphemerisFallback(): boolean { return isFallbackMode; }
export function getIsFallbackMode(): boolean { return isFallbackMode; }

/** Legacy — kept for backward compat during transition */
export function setZodiacSystem(s: '12-sign' | '13-sign' | 'sidereal') {
  currentZodiacSystem = s;
  if (s === 'sidereal') { currentZodiacFrame = 'sidereal'; currentSignCount = 12; }
  else if (s === '13-sign') { currentZodiacFrame = 'tropical'; currentSignCount = 13; }
  else { currentZodiacFrame = 'tropical'; currentSignCount = 12; }
}
export function getZodiacSystem(): '12-sign' | '13-sign' | 'sidereal' { return currentZodiacSystem; }

/** New split API */
export function setZodiacFrame(f: 'tropical' | 'sidereal') { currentZodiacFrame = f; }
export function getZodiacFrame(): 'tropical' | 'sidereal' { return currentZodiacFrame; }
export function setSignCount(n: 12 | 13) { currentSignCount = n; }
export function getSignCount(): 12 | 13 { return currentSignCount; }

export function calculateJulianDay(y: number, m: number, d: number, h: number, min: number, s: number = 0, g: number = SE_GREG_CAL): number {
  const hour = h + min / 60 + s / 3600;
  if (!swissModule) {
    // Fallback Julian Day calculation when module not ready
    let year = y, month = m;
    if (month <= 2) { year -= 1; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + d + B - 1524.5 + hour / 24;
  }
  return swissModule.julday(y, m, d, hour, g);
}

export function calculatePlanetPosition(jd: number, p: number): CalcUtResult {
  if (!swissModule) throw new Error('Not initialized');
  return swissModule.calc_ut(jd, p, DEFAULT_FLAGS);
}

export function calculateAllPlanetPositions(jd: number): Map<number, CalcUtResult> {
  const pos = new Map();
  if (!swissModule) return pos;
  for (const p of [SE_SUN, SE_MOON, SE_MERCURY, SE_VENUS, SE_MARS, SE_JUPITER, SE_SATURN, SE_URANUS, SE_NEPTUNE, SE_PLUTO]) {
    try { pos.set(p, calculatePlanetPosition(jd, p)); } catch {}
  }
  return pos;
}

function getSign(lon: number): string {
  return ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'][Math.floor(lon / 30) % 12];
}

export interface CalcOptions {
  zodiacSystem?: '12-sign' | '13-sign' | 'sidereal'; // legacy — overrides frame+count if provided
  zodiacFrame?: 'tropical' | 'sidereal';
  signCount?: 12 | 13;
}

function resolveCalcOptions(opts?: CalcOptions | '12-sign' | '13-sign' | 'sidereal') {
  // If a plain legacy string is passed, wrap it
  if (typeof opts === 'string') {
    return {
      isSidereal: opts === 'sidereal',
      use13Signs: opts === '13-sign',
    };
  }
  // If legacy zodiacSystem is provided inside CalcOptions, derive from it
  if (opts?.zodiacSystem) {
    const s = opts.zodiacSystem;
    return {
      isSidereal: s === 'sidereal',
      use13Signs: s === '13-sign',
    };
  }
  // Otherwise use new split fields (default to module-level globals)
  const frame = opts?.zodiacFrame ?? currentZodiacFrame;
  const count = opts?.signCount ?? currentSignCount;
  return {
    isSidereal: frame === 'sidereal',
    use13Signs: count === 13,
  };
}

export function calculateAllPlanets(jd: number, planets?: string[], opts?: CalcOptions | '12-sign' | '13-sign' | 'sidereal'): Record<string, CelestialBody> {
  if (!swissModule) return {};
  const { isSidereal, use13Signs } = resolveCalcOptions(opts);
  const flags = isSidereal ? (DEFAULT_FLAGS | SEFLG_SIDEREAL) : DEFAULT_FLAGS;
  const res: Record<string, PlanetCalculationResult> = {};
  for (const name of (planets || Object.keys(planetNameToId))) {
    const id = planetNameToId[name.toLowerCase()];
    if (id === undefined) continue;
    try {
      const p = swissModule.calc_ut(jd, id, flags);
      // Real WASM engine: SEFLG_SIDEREAL causes calc_ut to return sidereal longitudes directly.
      // Fallback/mock engine ignores flags, so we must subtract ayanamsa manually.
      const lon = isSidereal && isFallbackMode
        ? (p.longitude - calculateAyanamsa(jd) + 360) % 360
        : p.longitude;
      res[name.toLowerCase()] = {
        id: name.toLowerCase(),
        longitude: lon,
        latitude: p.latitude,
        distance: p.distance,
        speed: p.longitudeSpeed,
        isRetrograde: p.longitudeSpeed < 0,
        sign: use13Signs ? getSignFromLongitude(toDegree(lon), true) : getSign(lon),
        degreeInSign: getDegreeInSign(toDegree(lon), use13Signs)
      };
    } catch {}
  }
  return res as unknown as Record<string, CelestialBody>;
}

export function calculateHouses(jd: number, loc: { latitude: number; longitude: number; altitude?: number }, hs: string = 'P', opts?: CalcOptions | '12-sign' | '13-sign' | 'sidereal'): HousesCalculationResult {
  if (!swissModule) return { ascendant: 0, mc: 0, ic: 180, dsc: 180, cusps: Array(12).fill({ longitude: 0, sign: 'aries' }) };
  const { isSidereal, use13Signs } = resolveCalcOptions(opts);
  const hmap: Record<string, number> = { 'P': 80, 'K': 75, 'E': 69, 'W': 87, 'R': 82, 'C': 67, 'O': 79 };
  const sc = hmap[hs] || 80;
  const flags = isSidereal ? (DEFAULT_FLAGS | SEFLG_SIDEREAL) : DEFAULT_FLAGS;
  // Real WASM: houses_ex receives (jd, iflag, lat, lon, hsys)
  // Fallback/mock ignores iflag and returns tropical cusps
  const h = swissModule.houses_ex(jd, flags, loc.latitude, loc.longitude, sc);
  // Defensive: if houses_ex returns null/undefined, fall back to safe defaults
  if (!h) {
    console.warn('[calculateHouses] houses_ex returned null/undefined, using fallback');
    return { ascendant: 0, mc: 0, ic: 180, dsc: 180, cusps: Array(12).fill({ longitude: 0, sign: 'aries' }) };
  }
  const cusps = [];
  for (let i = 0; i < 12; i++) {
    const lon = h[i] || 0;
    // Real WASM with SEFLG_SIDEREAL returns sidereal cusps directly.
    // Fallback/mock returns tropical cusps — manual subtraction needed.
    const siderealLon = isSidereal && isFallbackMode
      ? (lon - calculateAyanamsa(jd) + 360) % 360
      : lon;
    cusps.push({ longitude: siderealLon, sign: use13Signs ? getSignFromLongitude(toDegree(siderealLon), true) : getSign(siderealLon) });
  }
  // Ascendant and MC also need conversion in fallback mode
  const rawAscendant = h.ascendant || cusps[0]?.longitude || 0;
  const rawMc = h.mc || cusps[9]?.longitude || 0;
  const ascendant = isSidereal && isFallbackMode
    ? (rawAscendant - calculateAyanamsa(jd) + 360) % 360
    : rawAscendant;
  const mc = isSidereal && isFallbackMode
    ? (rawMc - calculateAyanamsa(jd) + 360) % 360
    : rawMc;
  return { ascendant, mc, ic: (mc + 180) % 360, dsc: (ascendant + 180) % 360, cusps };
}

export function calculateSiderealTime(jd: number) { 
  if (!swissModule) return (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360 / 15;
  return swissModule.sidtime(jd); 
}

export function calculateRiseTransitSet(jd: number, p: number, lat: number, lon: number, alt: number = 0, pr: number = 1013.25, t: number = 10): RiseTransitSetResult {
  if (!swissModule) return { rise: null, transit: null, set: null };
  const r: RiseTransitSetResult = { rise: null, transit: null, set: null };
  try { const x = swissModule.rise_trans(jd, p, '', DEFAULT_FLAGS, 1, lat, lon, alt, pr, t); if (x?.rise) r.rise = x.rise; } catch {}
  try { const x = swissModule.rise_trans(jd, p, '', DEFAULT_FLAGS, 2, lat, lon, alt, pr, t); if (x?.transit) r.transit = x.transit; } catch {}
  try { const x = swissModule.rise_trans(jd, p, '', DEFAULT_FLAGS, 3, lat, lon, alt, pr, t); if (x?.set) r.set = x.set; } catch {}
  return r;
}

export async function calculateSunrise(d: Date, lat: number, lon: number): Promise<Date | null> {
  try {
    const jd = calculateJulianDay(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), 0, 0, 0);
    const r = calculateRiseTransitSet(jd, SE_SUN, lat, lon);
    if (r.rise) {
      // Convert Julian Day directly to Unix timestamp (JD 2440587.5 = Unix epoch)
      return new Date((r.rise - 2440587.5) * 86400000);
    }
  } catch {}
  return null;
}

export async function calculateSunset(d: Date, lat: number, lon: number): Promise<Date | null> {
  try {
    const jd = calculateJulianDay(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), 0, 0, 0);
    const r = calculateRiseTransitSet(jd, SE_SUN, lat, lon);
    if (r.set) {
      // Convert Julian Day directly to Unix timestamp (JD 2440587.5 = Unix epoch)
      return new Date((r.set - 2440587.5) * 86400000);
    }
  } catch {}
  return null;
}

export function getSwissModule() { return swissModule; }

export async function reinitializeWithFallback(): Promise<void> {
  swissModule = new MockSwissEngine();
  isFallbackMode = true;
  initializationComplete = true;
}

/**
 * Convert a birth date/time in a specific timezone to an equivalent UTC Date.
 * Critical for accurate ephemeris calculations across timezones.
 */
export function birthDateTimeToUTC(dateStr: string, timeStr: string, timezone: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  // Start with an estimate: assume the given components are UTC
  let utc = new Date(Date.UTC(year, month - 1, day, hour, minute));

  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  // Iterate to converge (usually 1-2 iterations, handles DST edge cases)
  for (let i = 0; i < 3; i++) {
    const parts = fmt.formatToParts(utc);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const actualYear = get('year');
    const actualMonth = get('month');
    const actualDay = get('day');
    const actualHour = get('hour');
    const actualMinute = get('minute');

    const desiredMs = Date.UTC(year, month - 1, day, hour, minute);
    const actualMs = Date.UTC(actualYear, actualMonth - 1, actualDay, actualHour, actualMinute);
    const diff = desiredMs - actualMs;

    if (Math.abs(diff) < 1000) break;
    utc = new Date(utc.getTime() + diff);
  }

  return utc;
}

export async function generateNatalChart(params: GenerateNatalChartParams): Promise<GeneratedNatalChart> {
  const frame: 'tropical' | 'sidereal' = params.zodiacFrame || (params.zodiacSystem === 'sidereal' ? 'sidereal' : 'tropical');
  const count: 12 | 13 = params.signCount ?? (params.zodiacSystem === '13-sign' ? 13 : 12);
  setZodiacFrame(frame);
  setSignCount(count);
  // Also update legacy module state for callers still reading it
  setZodiacSystem(params.zodiacSystem || (frame === 'sidereal' ? 'sidereal' : count === 13 ? '13-sign' : '12-sign'));
  // Configure sidereal mode so WASM applies correct ayanamsa
  if (frame === 'sidereal') {
    setSiderealMode('lahiri');
  } else {
    setSiderealMode(null);
  }

  const dt = birthDateTimeToUTC(params.birthData.birthDate, params.birthData.birthTime, params.birthData.timezone);
  const jd = calculateJulianDay(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), 0);
  const calcOpts: CalcOptions = { zodiacFrame: frame, signCount: count };
  const planets = calculateAllPlanets(jd, undefined, calcOpts);
  const houses = calculateHouses(jd, { latitude: params.birthData.location.latitude, longitude: params.birthData.location.longitude, altitude: params.birthData.location.altitude || 0 }, params.houseSystem, calcOpts);
  const cid = `chart-${params.profileId}-${Date.now()}`;
  return {
    id: cid,
    profileId: params.profileId,
    birthData: params.birthData,
    bodies: planets,
    houses,
    aspects: [],
    patterns: [],
    dignities: [],
    elementalBalance: { fire: 0, earth: 0, air: 0, water: 0, ether: 0 },
    modalBalance: { cardinal: 0, fixed: 0, mutable: 0 },
    julianDay: jd,
    calculatedAt: new Date().toISOString(),
    version: 1,
    zodiacSystem: params.zodiacSystem || (frame === 'sidereal' ? 'sidereal' : count === 13 ? '13-sign' : '12-sign'),
    zodiacFrame: frame,
    signCount: count,
    houseSystem: params.houseSystem || 'placidus'
  };
}
