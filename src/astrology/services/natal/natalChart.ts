/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NATAL CHART SYSTEM - Personal Celestial Foundation
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The birth chart is the soul's blueprint. All personalized guidance flows from here.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { CelestialBody, HouseSystem } from '../../types';

export interface BirthData {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  latitude: number;
  longitude: number;
  timezone: string;
  locationName?: string;
}

export interface NatalPlanet extends CelestialBody {
  house: number; // 1-12
  houseCusp?: boolean; // Is this planet conjunct a house cusp?
  dignity: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral';
}

export interface NatalChart {
  id: string;
  name: string;
  birthData: BirthData;
  planets: Record<string, NatalPlanet>;
  houses: HouseSystem;
  ascendant: CelestialBody;
  midheaven: CelestialBody;
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
    ether: number;
  };
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  calculatedAt: Date;
  zodiacSystem: '12-sign' | '13-sign' | 'sidereal';
  zodiacFrame?: 'tropical' | 'sidereal';
  signCount?: 12 | 13;
}

export interface Transit {
  transitingPlanet: string;
  natalPlanet: string;
  aspect: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx' | 'semisextile';
  orb: number; // degrees from exact
  applying: boolean; // Getting closer or separating
  exactDate?: Date;
  strength: number; // 0-10
  interpretation?: string;
}

// Planet dignities by sign
const DIGNITIES: Record<string, Record<string, 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral'>> = {
  sun: {
    leo: 'domicile',
    aries: 'exaltation',
    aquarius: 'detriment',
    libra: 'fall',
  },
  moon: {
    cancer: 'domicile',
    taurus: 'exaltation',
    capricorn: 'detriment',
    scorpio: 'fall',
  },
  mercury: {
    gemini: 'domicile',
    virgo: 'domicile',
    pisces: 'detriment',
    sagittarius: 'detriment',
  },
  venus: {
    taurus: 'domicile',
    libra: 'domicile',
    scorpio: 'detriment',
    aries: 'detriment',
    pisces: 'exaltation',
    virgo: 'fall',
  },
  mars: {
    aries: 'domicile',
    scorpio: 'domicile',
    libra: 'detriment',
    taurus: 'detriment',
    capricorn: 'exaltation',
    cancer: 'fall',
  },
  jupiter: {
    sagittarius: 'domicile',
    pisces: 'domicile',
    gemini: 'detriment',
    virgo: 'detriment',
    cancer: 'exaltation',
    capricorn: 'fall',
  },
  saturn: {
    capricorn: 'domicile',
    aquarius: 'domicile',
    cancer: 'detriment',
    leo: 'detriment',
    libra: 'exaltation',
    aries: 'fall',
  },
};

/**
 * Calculate or retrieve stored natal chart
 */
export function getNatalChart(profileId: string = 'default'): NatalChart | null {
  const stored = localStorage.getItem(`natal-chart-${profileId}`);
  if (stored) {
    const chart = JSON.parse(stored);
    chart.calculatedAt = new Date(chart.calculatedAt);
    if (chart.planets.sun) chart.planets.sun.timestamp = chart.planets.sun.timestamp ? new Date(chart.planets.sun.timestamp) : new Date();
    return chart;
  }
  return null;
}

/**
 * Save natal chart to storage
 */
export function saveNatalChart(chart: NatalChart, profileId: string = 'default'): void {
  localStorage.setItem(`natal-chart-${profileId}`, JSON.stringify(chart));
}

/**
 * Delete stored natal chart
 */
export function deleteNatalChart(profileId: string = 'default'): void {
  localStorage.removeItem(`natal-chart-${profileId}`);
}

/**
 * Calculate elemental balance from chart
 */
export function calculateElementalBalance(planets: Record<string, CelestialBody>): NatalChart['elements'] {
  const elements = { fire: 0, earth: 0, air: 0, water: 0, ether: 0 };
  
  const signElements: Record<string, keyof typeof elements> = {
    aries: 'fire', leo: 'fire', sagittarius: 'fire',
    taurus: 'earth', virgo: 'earth', capricorn: 'earth',
    gemini: 'air', libra: 'air', aquarius: 'air',
    cancer: 'water', scorpio: 'water', pisces: 'water',
    ophiuchus: 'ether',
  };
  
  Object.values(planets).forEach(planet => {
    const element = signElements[planet.sign];
    if (element) {
      elements[element] += 1;
    }
  });
  
  return elements;
}

/**
 * Get dominant element
 */
export function getDominantElement(elements: NatalChart['elements']): string | null {
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] > sorted[1][1]) {
    return sorted[0][0];
  }
  return null;
}

/**
 * Calculate modality balance
 */
export function calculateModalityBalance(planets: Record<string, CelestialBody>): NatalChart['modalities'] {
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 };
  
  const signModalities: Record<string, keyof typeof modalities> = {
    aries: 'cardinal', cancer: 'cardinal', libra: 'cardinal', capricorn: 'cardinal',
    taurus: 'fixed', leo: 'fixed', scorpio: 'fixed', aquarius: 'fixed',
    gemini: 'mutable', virgo: 'mutable', sagittarius: 'mutable', pisces: 'mutable',
    ophiuchus: 'fixed',
  };
  
  Object.values(planets).forEach(planet => {
    const modality = signModalities[planet.sign];
    if (modality) {
      modalities[modality] += 1;
    }
  });
  
  return modalities;
}

/**
 * Get planet dignity in sign
 */
export function getDignity(planet: string, sign: string): NatalPlanet['dignity'] {
  const planetDignities = DIGNITIES[planet];
  if (!planetDignities) return 'neutral';
  return planetDignities[sign] || 'neutral';
}

/**
 * Calculate transits from current positions to natal chart
 */
export function calculateTransits(
  natalChart: NatalChart,
  currentPositions: Record<string, CelestialBody>
): Transit[] {
  const transits: Transit[] = [];
  const aspectAngles: Record<Transit['aspect'], number> = {
    conjunction: 0,
    sextile: 60,
    square: 90,
    trine: 120,
    opposition: 180,
    quincunx: 150,
    semisextile: 30,
  };
  
  const orbs: Record<Transit['aspect'], number> = {
    conjunction: 8,
    sextile: 6,
    square: 8,
    trine: 8,
    opposition: 8,
    quincunx: 3,
    semisextile: 2,
  };
  
  // Outer planets to inner planets (most significant)
  const outerPlanets = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const innerPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', ...outerPlanets];
  
  outerPlanets.forEach(outerId => {
    const transiting = currentPositions[outerId];
    if (!transiting) return;
    
    innerPlanets.forEach(innerId => {
      const natal = natalChart.planets[innerId];
      if (!natal) return;
      
      // Calculate angle between transiting and natal
      let angle = Math.abs(transiting.longitude - natal.longitude);
      if (angle > 180) angle = 360 - angle;
      
      // Check each aspect
      (Object.keys(aspectAngles) as Transit['aspect'][]).forEach(aspect => {
        const exactAngle = aspectAngles[aspect];
        const orb = orbs[aspect];
        const diff = Math.abs(angle - exactAngle);
        
        if (diff < orb) {
          const strength = 10 - (diff / orb * 10);
          const applying = (transiting.speed || 0) > (natal.speed || 0);
          
          transits.push({
            transitingPlanet: outerId,
            natalPlanet: innerId,
            aspect,
            orb: diff,
            applying,
            strength: Math.max(1, strength),
          });
        }
      });
    });
  });
  
  // Sort by strength
  return transits.sort((a, b) => b.strength - a.strength);
}

/**
 * Get major life themes from natal chart
 */
export function getNatalThemes(chart: NatalChart): string[] {
  const themes: string[] = [];
  
  // Elemental emphasis
  const dominantElement = Object.entries(chart.elements)
    .sort((a, b) => b[1] - a[1])[0];
  if (dominantElement[1] >= 4) {
    themes.push(`${dominantElement[0].charAt(0).toUpperCase() + dominantElement[0].slice(1)} Dominant`);
  }
  
  // Modality emphasis
  const dominantModality = Object.entries(chart.modalities)
    .sort((a, b) => b[1] - a[1])[0];
  if (dominantModality[1] >= 4) {
    themes.push(`${dominantModality[0].charAt(0).toUpperCase() + dominantModality[0].slice(1)} Focus`);
  }
  
  // Specific planetary patterns
  const sunMoonAspect = chart.planets.sun && chart.planets.moon ? 
    Math.abs(chart.planets.sun.longitude - chart.planets.moon.longitude) : null;
  
  if (sunMoonAspect !== null) {
    if (sunMoonAspect < 10 || sunMoonAspect > 350) themes.push('New Moon Born');
    else if (Math.abs(sunMoonAspect - 180) < 10) themes.push('Full Moon Born');
    else if (sunMoonAspect < 90) themes.push('Waxing Soul');
    else themes.push('Waning Soul');
  }
  
  // Retrograde emphasis
  const retrogradeCount = Object.values(chart.planets).filter(p => p.isRetrograde).length;
  if (retrogradeCount >= 3) themes.push('Deep Retrograde Pattern');
  
  return themes;
}

/**
 * Get house emphasis (which life areas are prominent)
 */
export function getHouseEmphasis(chart: NatalChart): Record<number, number> {
  const emphasis: Record<number, number> = {};
  
  Object.values(chart.planets).forEach(planet => {
    emphasis[planet.house] = (emphasis[planet.house] || 0) + 1;
  });
  
  return emphasis;
}

/**
 * Get house number from longitude
 */
export function getHouseFromLongitude(longitude: number, houses: HouseSystem): number {
  const cusps = houses.cusps;
  // cusps array has 12 elements at indices 0-11 (houses 1-12)
  for (let i = 0; i < 12; i++) {
    const houseNum = i + 1;
    const houseStart = typeof cusps[i] === 'number' ? cusps[i] : (cusps[i] as any).longitude || 0;
    const nextIndex = (i + 1) % 12;
    const houseEnd = typeof cusps[nextIndex] === 'number' ? cusps[nextIndex] : (cusps[nextIndex] as any).longitude || 0;
    
    // Handle wrap-around
    if (houseStart > houseEnd) {
      if (longitude >= houseStart || longitude < houseEnd) return houseNum;
    } else {
      if (longitude >= houseStart && longitude < houseEnd) return houseNum;
    }
  }
  return 1;
}

/**
 * Get life area from house
 */
export function getHouseLifeArea(house: number): string {
  const areas: Record<number, string> = {
    1: 'Self & Identity',
    2: 'Resources & Values',
    3: 'Communication & Learning',
    4: 'Home & Family',
    5: 'Creativity & Romance',
    6: 'Work & Health',
    7: 'Partnerships & Relationships',
    8: 'Transformation & Shared Resources',
    9: 'Philosophy & Travel',
    10: 'Career & Public Standing',
    11: 'Community & Aspirations',
    12: 'Spirituality & Hidden Matters',
  };
  return areas[house] || 'Life Experience';
}

export default {
  getNatalChart,
  saveNatalChart,
  deleteNatalChart,
  calculateElementalBalance,
  calculateModalityBalance,
  getDominantElement,
  getDignity,
  calculateTransits,
  getNatalThemes,
  getHouseEmphasis,
  getHouseFromLongitude,
  getHouseLifeArea,
};
