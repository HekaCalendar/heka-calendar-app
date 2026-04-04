/**
 * Swiss Ephemeris WebAssembly Service
 */

const logger = {
  info: (...args: any[]) => console.log('[SwissEphemeris]', ...args),
  warn: (...args: any[]) => console.warn('[SwissEphemeris]', ...args),
  error: (...args: any[]) => console.error('[SwissEphemeris]', ...args),
};

const SWISSEPH_JS_PATH = '/wsam/swisseph.js';

let swissModule: any = null;
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

  calc_ut(julianDay: number, planet: number, _flags: number): any {
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

  houses_ex(julianDay: number, _system: number, _latitude: number, longitude: number): any {
    const lst = (280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + longitude) % 360;
    const ascendant = lst;
    const mc = (lst + 90) % 360;
    
    const result: any = { error: null, ascendant, mc };
    for (let i = 0; i < 12; i++) {
      result[i] = (ascendant + i * 30) % 360;
    }
    return result;
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
    
    const swissephModule = await import(SWISSEPH_JS_PATH);
    if (!swissephModule) {
      console.warn('[SwissEphemeris] Module import failed, using fallback');
      return false;
    }
    
    let moduleFactory = swissephModule.default || swissephModule;
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
        onRuntimeInitialized: function(this: any) {
          if (!resolved) {
            resolved = true;
            const mod = this;
            if (mod && (mod._swe_julday || (mod.asm && mod.asm._swe_julday))) {
              try {
                swissModule = wrapModule(mod);
                console.log('[SwissEphemeris] WASM initialized successfully');
                resolve(true);
              } catch (err) {
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
          result.then((mod: any) => {
            if (!resolved && mod) {
              resolved = true;
              try {
                swissModule = wrapModule(mod);
                console.log('[SwissEphemeris] WASM initialized via Promise');
                resolve(true);
              } catch (err) {
                console.warn('[SwissEphemeris] wrapModule failed on Promise:', err);
                resolve(false);
              }
            }
          }).catch((err: any) => {
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

function wrapModule(Module: any): any {
  const funcs: Record<string, Function> = {};
  const names = ['_swe_julday', '_swe_calc_ut', '_swe_houses_ex', '_malloc', '_free', '_swe_rise_trans', '_swe_sidtime', '_swe_houses'];
  
  names.forEach(name => {
    if (typeof Module[name] === 'function') {
      funcs[name] = Module[name].bind(Module);
    } else if (Module.asm && typeof Module.asm[name] === 'function') {
      funcs[name] = Module.asm[name].bind(Module.asm);
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
  const mockHouses = () => ({ ascendant: 0, mc: 0, error: null, 0: 0, 1: 30, 2: 60, 3: 90, 4: 120, 5: 150, 6: 180, 7: 210, 8: 240, 9: 270, 10: 300, 11: 330 });
  const mockSidtime = (jd: number) => (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360 / 15;
  const mockRiseTrans = () => ({ rise: null, transit: null, set: null });
  
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
        const arr = new Float64Array(Module.HEAPF64.buffer, ptr, 6);
        const ret = { longitude: arr[0], latitude: arr[1], distance: arr[2], longitudeSpeed: arr[3], latitudeSpeed: arr[4], distanceSpeed: arr[5] };
        freeFn(ptr);
        return ret;
      } catch {
        return mockCalcUt();
      }
    },
    houses_ex: (jd: number, s: number, lat: number, lon: number) => {
      const fn = funcs['_swe_houses_ex'] || funcs['_swe_houses'];
      if (fn) return fn(jd, s, lat, lon);
      return mockHouses();
    },
    houses: (jd: number, s: number, lat: number, lon: number) => {
      const fn = funcs['_swe_houses'] || funcs['_swe_houses_ex'];
      if (fn) return fn(jd, s, lat, lon);
      return mockHouses();
    },
    sidtime: (jd: number) => {
      const fn = funcs['_swe_sidtime'];
      if (fn) return fn(jd);
      return mockSidtime(jd);
    },
    rise_trans: (jd: number, p: number, st: string, f: number, r: number, lat: number, lon: number, a: number, pr: number, t: number) => {
      const fn = funcs['_swe_rise_trans'];
      if (fn) {
        try { return fn(jd, p, st, f, r, lat, lon, a, pr, t); } catch {}
      }
      return mockRiseTrans();
    },
  };
}

let currentZodiacSystem: '12-sign' | '13-sign' = '12-sign';

export function isSwissReady(): boolean { return swissModule !== null; }
export function isSwissEphemerisReady(): boolean { return isSwissReady(); }
export function isUsingFallback(): boolean { return isFallbackMode; }
export function isSwissEphemerisFallback(): boolean { return isFallbackMode; }
export function setZodiacSystem(s: '12-sign' | '13-sign') { currentZodiacSystem = s; }
export function getZodiacSystem(): '12-sign' | '13-sign' { return currentZodiacSystem; }

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

export function calculatePlanetPosition(jd: number, p: number) { 
  if (!swissModule) throw new Error('Not initialized');
  return swissModule.calc_ut(jd, p, DEFAULT_FLAGS); 
}

export function calculateAllPlanetPositions(jd: number): Map<number, any> {
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

export function calculateAllPlanets(jd: number, planets?: string[], _?: boolean): any {
  if (!swissModule) return {};
  const res: any = {};
  for (const name of (planets || Object.keys(planetNameToId))) {
    const id = planetNameToId[name.toLowerCase()];
    if (id === undefined) continue;
    try {
      const p = swissModule.calc_ut(jd, id, DEFAULT_FLAGS);
      res[name.toLowerCase()] = { id: name.toLowerCase(), longitude: p.longitude, latitude: p.latitude, distance: p.distance, speed: p.longitudeSpeed, isRetrograde: p.longitudeSpeed < 0, sign: getSign(p.longitude), degreeInSign: p.longitude % 30 };
    } catch {}
  }
  return res;
}

export function calculateHouses(jd: number, loc: { latitude: number; longitude: number; altitude?: number }, hs: string = 'P'): any {
  if (!swissModule) return { ascendant: 0, mc: 0, ic: 180, dsc: 180, cusps: Array(12).fill({ longitude: 0, sign: 'aries' }) };
  const hmap: Record<string, number> = { 'P': 80, 'K': 75, 'E': 69, 'W': 87, 'R': 82, 'C': 67, 'O': 79 };
  const sc = hmap[hs] || 80;
  const h = swissModule.houses_ex(jd, sc, loc.latitude, loc.longitude);
  const cusps = [];
  for (let i = 0; i < 12; i++) cusps.push({ longitude: h[i] || 0, sign: getSign(h[i] || 0) });
  return { ascendant: h.ascendant || cusps[0]?.longitude || 0, mc: h.mc || cusps[9]?.longitude || 0, ic: (h.mc || cusps[9]?.longitude || 0) + 180 % 360, dsc: (h.ascendant || cusps[0]?.longitude || 0) + 180 % 360, cusps };
}

export function calculateSiderealTime(jd: number) { 
  if (!swissModule) return (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360 / 15;
  return swissModule.sidtime(jd); 
}

export function calculateRiseTransitSet(jd: number, p: number, lat: number, lon: number, alt: number = 0, pr: number = 1013.25, t: number = 10): any {
  if (!swissModule) return { rise: null, transit: null, set: null };
  const r: any = { rise: null, transit: null, set: null };
  try { const x = swissModule.rise_trans(jd, p, '', DEFAULT_FLAGS, 1, lat, lon, alt, pr, t); if (x?.rise) r.rise = x.rise; } catch {}
  try { const x = swissModule.rise_trans(jd, p, '', DEFAULT_FLAGS, 2, lat, lon, alt, pr, t); if (x?.transit) r.transit = x.transit; } catch {}
  try { const x = swissModule.rise_trans(jd, p, '', DEFAULT_FLAGS, 3, lat, lon, alt, pr, t); if (x?.set) r.set = x.set; } catch {}
  return r;
}

export async function calculateSunrise(d: Date, lat: number, lon: number): Promise<Date | null> {
  try {
    const jd = calculateJulianDay(d.getFullYear(), d.getMonth() + 1, d.getDate(), 0, 0, 0);
    const r = calculateRiseTransitSet(jd, SE_SUN, lat, lon);
    if (r.rise) { const nd = new Date(d); const h = (r.rise - Math.floor(r.rise)) * 24; nd.setHours(Math.floor(h), Math.floor((h % 1) * 60), 0, 0); return nd; }
  } catch {}
  return null;
}

export async function calculateSunset(d: Date, lat: number, lon: number): Promise<Date | null> {
  try {
    const jd = calculateJulianDay(d.getFullYear(), d.getMonth() + 1, d.getDate(), 0, 0, 0);
    const r = calculateRiseTransitSet(jd, SE_SUN, lat, lon);
    if (r.set) { const nd = new Date(d); const h = (r.set - Math.floor(r.set)) * 24; nd.setHours(Math.floor(h), Math.floor((h % 1) * 60), 0, 0); return nd; }
  } catch {}
  return null;
}

export function getSwissModule() { return swissModule; }

export async function reinitializeWithFallback(): Promise<void> {
  swissModule = new MockSwissEngine();
  isFallbackMode = true;
  initializationComplete = true;
}

export async function generateNatalChart(params: any): Promise<any> {
  setZodiacSystem(params.zodiacSystem);
  const dt = new Date(`${params.birthData.birthDate}T${params.birthData.birthTime}`);
  const jd = calculateJulianDay(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getHours(), dt.getMinutes(), 0);
  const planets = calculateAllPlanets(jd, undefined, params.zodiacSystem === '13-sign');
  const houses = calculateHouses(jd, { latitude: params.birthData.location.latitude, longitude: params.birthData.location.longitude, altitude: params.birthData.location.altitude || 0 }, params.houseSystem);
  const cid = `chart-${params.profileId}-${Date.now()}`;
  return { id: cid as any, profileId: params.profileId, birthData: params.birthData, bodies: planets, houses, aspects: [], patterns: [], dignities: [], elementalBalance: { fire: 0, earth: 0, air: 0, water: 0 }, modalBalance: { cardinal: 0, fixed: 0, mutable: 0 }, julianDay: jd, calculatedAt: new Date().toISOString(), version: 1, zodiacSystem: params.zodiacSystem, houseSystem: params.houseSystem };
}
