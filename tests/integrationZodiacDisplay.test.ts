import { describe, it, expect } from 'vitest';
import { getCurrentSunSign, ZODIAC_INFO } from '../src/services/celestialInfoService';
import {
  getZodiacSymbol,
  getSignElementColor,
} from '../src/components/oracle/utils';
import { getSeasonalEventInfo } from '../src/services/celestialInfoService';

describe('integration: zodiac display pipeline', () => {
  it('date → sun sign → symbol → color is consistent', () => {
    const date = new Date('2024-06-15');
    const signInfo = getCurrentSunSign(date);
    const symbol = getZodiacSymbol(signInfo.sign);
    const color = getSignElementColor(signInfo.sign);

    expect(signInfo.sign).toBe('Gemini');
    expect(symbol).toBe('♊');
    expect(color).toBe('#f59e0b'); // Air element color
    expect(signInfo.element).toBe('Air');
  });

  it('all zodiac signs have symbols and colors', () => {
    for (const sign of Object.keys(ZODIAC_INFO)) {
      const symbol = getZodiacSymbol(sign);
      const color = getSignElementColor(sign);
      expect(symbol).not.toBe('✦');
      expect(color).toMatch(/^#/);
    }
  });

  it('element colors group signs correctly', () => {
    const fireSigns = ['aries', 'leo', 'sagittarius'];
    const earthSigns = ['taurus', 'virgo', 'capricorn'];
    const airSigns = ['gemini', 'libra', 'aquarius'];
    const waterSigns = ['cancer', 'scorpio', 'pisces'];

    const fireColor = getSignElementColor(fireSigns[0]);
    const earthColor = getSignElementColor(earthSigns[0]);
    const airColor = getSignElementColor(airSigns[0]);
    const waterColor = getSignElementColor(waterSigns[0]);

    fireSigns.forEach(s => expect(getSignElementColor(s)).toBe(fireColor));
    earthSigns.forEach(s => expect(getSignElementColor(s)).toBe(earthColor));
    airSigns.forEach(s => expect(getSignElementColor(s)).toBe(airColor));
    waterSigns.forEach(s => expect(getSignElementColor(s)).toBe(waterColor));
  });

  it('zodiac info matches symbol lookup', () => {
    for (const [sign, info] of Object.entries(ZODIAC_INFO)) {
      const symbol = getZodiacSymbol(sign);
      expect(symbol).toBe(info.symbol);
    }
  });

  it('seasonal event info links to zodiac context', () => {
    const equinoxInfo = getSeasonalEventInfo('Vernal Equinox');
    expect(equinoxInfo).toBeDefined();
    expect(equinoxInfo!.symbol).toBeTruthy();

    const solsticeInfo = getSeasonalEventInfo('Summer Solstice');
    expect(solsticeInfo).toBeDefined();
    expect(solsticeInfo!.symbol).toBeTruthy();
  });

  it('each zodiac has unique symbol', () => {
    const symbols = Object.keys(ZODIAC_INFO).map(s => getZodiacSymbol(s));
    expect(new Set(symbols).size).toBe(symbols.length);
  });

  it('modalities are distributed across elements', () => {
    const byElementModality: Record<string, Set<string>> = {};

    for (const info of Object.values(ZODIAC_INFO)) {
      const key = `${info.element}-${info.modality}`;
      if (!byElementModality[key]) byElementModality[key] = new Set();
      byElementModality[key].add(info.sign);
    }

    // Each element should have all 3 modalities
    const elements = ['Fire', 'Earth', 'Air', 'Water'];
    const modalities = ['Cardinal', 'Fixed', 'Mutable'];

    for (const element of elements) {
      for (const modality of modalities) {
        const key = `${element}-${modality}`;
        expect(byElementModality[key]?.size).toBe(1);
      }
    }
  });
});
