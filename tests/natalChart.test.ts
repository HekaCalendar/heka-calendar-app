// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  calculateElementalBalance,
  calculateModalityBalance,
  getDignity,
  getNatalThemes,
  getHouseEmphasis,
  getHouseFromLongitude,
  getHouseLifeArea,
  getDominantElement,
} from '../src/astrology/services/natal/natalChart';
import type { CelestialBody, HouseSystem } from '../src/astrology/types';
import { toDegree } from '../src/astrology/types/core';
import type { NatalChart, NatalPlanet } from '../src/astrology/services/natal/natalChart';

function makeBody(id: string, longitude: number, sign: string): CelestialBody {
  return {
    id: id as CelestialBody['id'],
    longitude: toDegree(longitude),
    latitude: 0,
    distance: 1,
    speed: 1,
    isRetrograde: false,
    sign: sign as CelestialBody['sign'],
    degreeInSign: toDegree(longitude % 30) as CelestialBody['degreeInSign'],
  };
}

function makeNatalPlanet(id: string, longitude: number, sign: string, house: number, retrograde = false): NatalPlanet {
  return {
    ...makeBody(id, longitude, sign),
    house,
    dignity: 'neutral',
    houseCusp: false,
    isRetrograde: retrograde,
  };
}

function makeHouseSystem(cusps: number[]): HouseSystem {
  return {
    type: 'placidus',
    cusps: cusps.map((longitude, i) => ({
      number: (i + 1) as HouseSystem['cusps'][number]['number'],
      longitude: toDegree(longitude),
      sign: 'aries' as HouseSystem['cusps'][number]['sign'],
      degreeInSign: toDegree(0) as HouseSystem['cusps'][number]['degreeInSign'],
    })),
    ascendant: toDegree(cusps[0] ?? 0),
    mc: toDegree(0),
    ic: toDegree(0),
    dsc: toDegree(0),
  };
}

function makeChart(overrides: Partial<NatalChart> = {}): NatalChart {
  return {
    id: 'test-chart',
    name: 'Test Chart',
    birthData: {
      date: '1990-01-01',
      time: '12:00',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC',
    },
    planets: {},
    houses: makeHouseSystem([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]),
    ascendant: makeBody('ascendant', 0, 'aries'),
    midheaven: makeBody('midheaven', 0, 'aries'),
    elements: { fire: 0, earth: 0, air: 0, water: 0, ether: 0 },
    modalities: { cardinal: 0, fixed: 0, mutable: 0 },
    calculatedAt: new Date(),
    zodiacSystem: '12-sign',
    ...overrides,
  };
}

describe('natalChart', () => {
  describe('calculateElementalBalance', () => {
    it('returns zero counts for empty planets', () => {
      const result = calculateElementalBalance({});
      expect(result).toEqual({ fire: 0, earth: 0, air: 0, water: 0, ether: 0 });
    });

    it('counts fire signs correctly', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        moon: makeBody('moon', 135, 'leo'),
        mercury: makeBody('mercury', 240, 'sagittarius'),
      };
      const result = calculateElementalBalance(planets);
      expect(result.fire).toBe(3);
      expect(result.earth).toBe(0);
      expect(result.air).toBe(0);
      expect(result.water).toBe(0);
      expect(result.ether).toBe(0);
    });

    it('counts earth signs correctly', () => {
      const planets = {
        sun: makeBody('sun', 45, 'taurus'),
        moon: makeBody('moon', 165, 'virgo'),
        mercury: makeBody('mercury', 285, 'capricorn'),
      };
      const result = calculateElementalBalance(planets);
      expect(result.earth).toBe(3);
      expect(result.fire).toBe(0);
    });

    it('counts air signs correctly', () => {
      const planets = {
        sun: makeBody('sun', 75, 'gemini'),
        moon: makeBody('moon', 195, 'libra'),
        mercury: makeBody('mercury', 315, 'aquarius'),
      };
      const result = calculateElementalBalance(planets);
      expect(result.air).toBe(3);
    });

    it('counts water signs correctly', () => {
      const planets = {
        sun: makeBody('sun', 105, 'cancer'),
        moon: makeBody('moon', 225, 'scorpio'),
        mercury: makeBody('mercury', 345, 'pisces'),
      };
      const result = calculateElementalBalance(planets);
      expect(result.water).toBe(3);
    });

    it('counts ophiuchus as ether', () => {
      const planets = {
        sun: makeBody('sun', 230, 'ophiuchus'),
      };
      const result = calculateElementalBalance(planets);
      expect(result.ether).toBe(1);
      expect(result.fire).toBe(0);
    });

    it('ignores unknown signs', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        unknown: makeBody('unknown', 0, 'unknown_sign'),
      };
      const result = calculateElementalBalance(planets);
      expect(result.fire).toBe(1);
    });
  });

  describe('calculateModalityBalance', () => {
    it('returns zero counts for empty planets', () => {
      const result = calculateModalityBalance({});
      expect(result).toEqual({ cardinal: 0, fixed: 0, mutable: 0 });
    });

    it('counts cardinal signs correctly', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        moon: makeBody('moon', 105, 'cancer'),
        mercury: makeBody('mercury', 195, 'libra'),
        venus: makeBody('venus', 285, 'capricorn'),
      };
      const result = calculateModalityBalance(planets);
      expect(result.cardinal).toBe(4);
      expect(result.fixed).toBe(0);
      expect(result.mutable).toBe(0);
    });

    it('counts fixed signs correctly', () => {
      const planets = {
        sun: makeBody('sun', 45, 'taurus'),
        moon: makeBody('moon', 135, 'leo'),
        mercury: makeBody('mercury', 225, 'scorpio'),
        venus: makeBody('venus', 315, 'aquarius'),
      };
      const result = calculateModalityBalance(planets);
      expect(result.fixed).toBe(4);
      expect(result.cardinal).toBe(0);
      expect(result.mutable).toBe(0);
    });

    it('counts mutable signs correctly', () => {
      const planets = {
        sun: makeBody('sun', 75, 'gemini'),
        moon: makeBody('moon', 165, 'virgo'),
        mercury: makeBody('mercury', 255, 'sagittarius'),
        venus: makeBody('venus', 345, 'pisces'),
      };
      const result = calculateModalityBalance(planets);
      expect(result.mutable).toBe(4);
      expect(result.cardinal).toBe(0);
      expect(result.fixed).toBe(0);
    });

    it('counts ophiuchus as fixed', () => {
      const planets = {
        sun: makeBody('sun', 230, 'ophiuchus'),
      };
      const result = calculateModalityBalance(planets);
      expect(result.fixed).toBe(1);
    });

    it('ignores unknown signs', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        unknown: makeBody('unknown', 0, 'unknown_sign'),
      };
      const result = calculateModalityBalance(planets);
      expect(result.cardinal).toBe(1);
    });
  });

  describe('getDignity', () => {
    it('returns neutral for unknown planet', () => {
      expect(getDignity('unknown', 'aries')).toBe('neutral');
    });

    it('returns neutral for unknown sign', () => {
      expect(getDignity('sun', 'unknown')).toBe('neutral');
    });

    it('returns domicile for Sun in Leo', () => {
      expect(getDignity('sun', 'leo')).toBe('domicile');
    });

    it('returns exaltation for Sun in Aries', () => {
      expect(getDignity('sun', 'aries')).toBe('exaltation');
    });

    it('returns detriment for Sun in Aquarius', () => {
      expect(getDignity('sun', 'aquarius')).toBe('detriment');
    });

    it('returns fall for Sun in Libra', () => {
      expect(getDignity('sun', 'libra')).toBe('fall');
    });

    it('returns neutral for Sun in Taurus', () => {
      expect(getDignity('sun', 'taurus')).toBe('neutral');
    });

    it('returns domicile for Moon in Cancer', () => {
      expect(getDignity('moon', 'cancer')).toBe('domicile');
    });

    it('returns exaltation for Moon in Taurus', () => {
      expect(getDignity('moon', 'taurus')).toBe('exaltation');
    });

    it('returns domicile for Mercury in Gemini and Virgo', () => {
      expect(getDignity('mercury', 'gemini')).toBe('domicile');
      expect(getDignity('mercury', 'virgo')).toBe('domicile');
    });

    it('returns detriment for Venus in Scorpio and Aries', () => {
      expect(getDignity('venus', 'scorpio')).toBe('detriment');
      expect(getDignity('venus', 'aries')).toBe('detriment');
    });

    it('returns exaltation for Venus in Pisces', () => {
      expect(getDignity('venus', 'pisces')).toBe('exaltation');
    });

    it('returns fall for Venus in Virgo', () => {
      expect(getDignity('venus', 'virgo')).toBe('fall');
    });

    it('returns domicile for Mars in Aries and Scorpio', () => {
      expect(getDignity('mars', 'aries')).toBe('domicile');
      expect(getDignity('mars', 'scorpio')).toBe('domicile');
    });

    it('returns exaltation for Jupiter in Cancer', () => {
      expect(getDignity('jupiter', 'cancer')).toBe('exaltation');
    });

    it('returns fall for Jupiter in Capricorn', () => {
      expect(getDignity('jupiter', 'capricorn')).toBe('fall');
    });

    it('returns domicile for Saturn in Capricorn and Aquarius', () => {
      expect(getDignity('saturn', 'capricorn')).toBe('domicile');
      expect(getDignity('saturn', 'aquarius')).toBe('domicile');
    });
  });

  describe('getNatalThemes', () => {
    it('returns empty array for minimal chart', () => {
      const chart = makeChart();
      expect(getNatalThemes(chart)).toEqual([]);
    });

    it('returns Fire Dominant when fire >= 4', () => {
      const chart = makeChart({
        elements: { fire: 4, earth: 1, air: 1, water: 1, ether: 0 },
      });
      const themes = getNatalThemes(chart);
      expect(themes).toContain('Fire Dominant');
    });

    it('returns Cardinal Focus when cardinal >= 4', () => {
      const chart = makeChart({
        elements: { fire: 0, earth: 0, air: 0, water: 0, ether: 0 },
        modalities: { cardinal: 4, fixed: 1, mutable: 1 },
      });
      const themes = getNatalThemes(chart);
      expect(themes).toContain('Cardinal Focus');
    });

    it('returns New Moon Born when sun-moon conjunction', () => {
      const chart = makeChart({
        planets: {
          sun: makeNatalPlanet('sun', 15, 'aries', 1),
          moon: makeNatalPlanet('moon', 18, 'aries', 1),
        },
      });
      const themes = getNatalThemes(chart);
      expect(themes).toContain('New Moon Born');
    });

    it('returns Full Moon Born when sun-moon opposition', () => {
      const chart = makeChart({
        planets: {
          sun: makeNatalPlanet('sun', 15, 'aries', 1),
          moon: makeNatalPlanet('moon', 195, 'libra', 7),
        },
      });
      const themes = getNatalThemes(chart);
      expect(themes).toContain('Full Moon Born');
    });

    it('returns Waxing Soul when moon is ahead of sun < 180', () => {
      const chart = makeChart({
        planets: {
          sun: makeNatalPlanet('sun', 15, 'aries', 1),
          moon: makeNatalPlanet('moon', 60, 'gemini', 3),
        },
      });
      const themes = getNatalThemes(chart);
      expect(themes).toContain('Waxing Soul');
    });

    it('returns Waning Soul when moon is ahead of sun > 180', () => {
      const chart = makeChart({
        planets: {
          sun: makeNatalPlanet('sun', 15, 'aries', 1),
          moon: makeNatalPlanet('moon', 250, 'sagittarius', 9),
        },
      });
      const themes = getNatalThemes(chart);
      expect(themes).toContain('Waning Soul');
    });

    it('returns Deep Retrograde Pattern for >= 3 retrogrades', () => {
      const chart = makeChart({
        planets: {
          sun: makeNatalPlanet('sun', 15, 'aries', 1),
          moon: makeNatalPlanet('moon', 45, 'taurus', 2, true),
          mercury: makeNatalPlanet('mercury', 75, 'gemini', 3, true),
          venus: makeNatalPlanet('venus', 105, 'cancer', 4, true),
        },
      });
      const themes = getNatalThemes(chart);
      expect(themes).toContain('Deep Retrograde Pattern');
    });

    it('returns multiple themes when conditions overlap', () => {
      const chart = makeChart({
        elements: { fire: 4, earth: 1, air: 1, water: 1, ether: 0 },
        modalities: { cardinal: 4, fixed: 1, mutable: 1 },
        planets: {
          sun: makeNatalPlanet('sun', 15, 'aries', 1),
          moon: makeNatalPlanet('moon', 18, 'aries', 1),
          mercury: makeNatalPlanet('mercury', 75, 'gemini', 3, true),
          venus: makeNatalPlanet('venus', 105, 'cancer', 4, true),
          mars: makeNatalPlanet('mars', 135, 'leo', 5, true),
        },
      });
      const themes = getNatalThemes(chart);
      expect(themes).toContain('Fire Dominant');
      expect(themes).toContain('Cardinal Focus');
      expect(themes).toContain('New Moon Born');
      expect(themes).toContain('Deep Retrograde Pattern');
    });
  });

  describe('getHouseEmphasis', () => {
    it('returns empty object for no planets', () => {
      const chart = makeChart();
      expect(getHouseEmphasis(chart)).toEqual({});
    });

    it('counts planets per house', () => {
      const chart = makeChart({
        planets: {
          sun: makeNatalPlanet('sun', 15, 'aries', 1),
          moon: makeNatalPlanet('moon', 45, 'taurus', 1),
          mercury: makeNatalPlanet('mercury', 75, 'gemini', 2),
        },
      });
      const emphasis = getHouseEmphasis(chart);
      expect(emphasis[1]).toBe(2);
      expect(emphasis[2]).toBe(1);
    });

    it('handles planets in all houses', () => {
      const planets: Record<string, NatalPlanet> = {};
      for (let i = 1; i <= 12; i++) {
        planets[`planet${i}`] = makeNatalPlanet(`planet${i}`, (i - 1) * 30, 'aries', i);
      }
      const chart = makeChart({ planets });
      const emphasis = getHouseEmphasis(chart);
      for (let i = 1; i <= 12; i++) {
        expect(emphasis[i]).toBe(1);
      }
    });
  });

  describe('getHouseFromLongitude', () => {
    const houses = makeHouseSystem([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]);

    it('returns house 1 for longitude in first house', () => {
      expect(getHouseFromLongitude(15, houses)).toBe(1);
    });

    it('returns house 2 for longitude in second house', () => {
      expect(getHouseFromLongitude(45, houses)).toBe(2);
    });

    it('returns house 12 for longitude near end', () => {
      expect(getHouseFromLongitude(350, houses)).toBe(12);
    });

    it('handles wrap-around cusps', () => {
      const wrapHouses = makeHouseSystem([300, 330, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300]);
      expect(getHouseFromLongitude(310, wrapHouses)).toBe(1);
      expect(getHouseFromLongitude(350, wrapHouses)).toBe(2);
      expect(getHouseFromLongitude(15, wrapHouses)).toBe(2);
    });

    it('returns 1 as fallback when no cusp matches', () => {
      // This is mostly a safety net; with 12 cusps every longitude should match
      const emptyHouses = makeHouseSystem([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(getHouseFromLongitude(15, emptyHouses)).toBe(1);
    });
  });

  describe('getHouseLifeArea', () => {
    it('returns Self & Identity for house 1', () => {
      expect(getHouseLifeArea(1)).toBe('Self & Identity');
    });

    it('returns Resources & Values for house 2', () => {
      expect(getHouseLifeArea(2)).toBe('Resources & Values');
    });

    it('returns Communication & Learning for house 3', () => {
      expect(getHouseLifeArea(3)).toBe('Communication & Learning');
    });

    it('returns Home & Family for house 4', () => {
      expect(getHouseLifeArea(4)).toBe('Home & Family');
    });

    it('returns Creativity & Romance for house 5', () => {
      expect(getHouseLifeArea(5)).toBe('Creativity & Romance');
    });

    it('returns Work & Health for house 6', () => {
      expect(getHouseLifeArea(6)).toBe('Work & Health');
    });

    it('returns Partnerships & Relationships for house 7', () => {
      expect(getHouseLifeArea(7)).toBe('Partnerships & Relationships');
    });

    it('returns Transformation & Shared Resources for house 8', () => {
      expect(getHouseLifeArea(8)).toBe('Transformation & Shared Resources');
    });

    it('returns Philosophy & Travel for house 9', () => {
      expect(getHouseLifeArea(9)).toBe('Philosophy & Travel');
    });

    it('returns Career & Public Standing for house 10', () => {
      expect(getHouseLifeArea(10)).toBe('Career & Public Standing');
    });

    it('returns Community & Aspirations for house 11', () => {
      expect(getHouseLifeArea(11)).toBe('Community & Aspirations');
    });

    it('returns Spirituality & Hidden Matters for house 12', () => {
      expect(getHouseLifeArea(12)).toBe('Spirituality & Hidden Matters');
    });

    it('returns fallback for unknown house', () => {
      expect(getHouseLifeArea(13)).toBe('Life Experience');
      expect(getHouseLifeArea(0)).toBe('Life Experience');
    });
  });

  describe('getDominantElement', () => {
    it('returns null when all elements are zero', () => {
      expect(getDominantElement({ fire: 0, earth: 0, air: 0, water: 0, ether: 0 })).toBeNull();
    });

    it('returns fire when fire is highest', () => {
      expect(getDominantElement({ fire: 3, earth: 1, air: 1, water: 1, ether: 0 })).toBe('fire');
    });

    it('returns earth when earth is highest', () => {
      expect(getDominantElement({ fire: 1, earth: 3, air: 1, water: 1, ether: 0 })).toBe('earth');
    });

    it('returns air when air is highest', () => {
      expect(getDominantElement({ fire: 1, earth: 1, air: 3, water: 1, ether: 0 })).toBe('air');
    });

    it('returns water when water is highest', () => {
      expect(getDominantElement({ fire: 1, earth: 1, air: 1, water: 3, ether: 0 })).toBe('water');
    });

    it('returns ether when ether is highest', () => {
      expect(getDominantElement({ fire: 1, earth: 1, air: 1, water: 1, ether: 3 })).toBe('ether');
    });

    it('returns null when top two are tied', () => {
      expect(getDominantElement({ fire: 2, earth: 2, air: 1, water: 0, ether: 0 })).toBeNull();
    });

    it('handles single non-zero element', () => {
      expect(getDominantElement({ fire: 5, earth: 0, air: 0, water: 0, ether: 0 })).toBe('fire');
    });
  });
});
