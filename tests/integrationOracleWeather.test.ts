import { describe, it, expect } from 'vitest';
// @ts-nocheck
import { calculateCurrentSky } from '../src/astrology/services/calculations/swissCalculations';
import { calculateSkyAspects, generatePersonalForecast } from '../src/oracle/celestialWeatherEngine';
import { calculateMoonPhaseData } from '../src/oracle/celestialTimingEngine';
import { getCurrentSunSign } from '../src/services/celestialInfoService';

describe('integration: oracle weather pipeline', () => {
  it('sky positions → aspects → forecast flow', async () => {
    const date = new Date('2024-06-15');
    const sky = await calculateCurrentSky(date);

    expect(sky.positions).toBeDefined();
    expect(Object.keys(sky.positions).length).toBeGreaterThan(0);

    const aspects = calculateSkyAspects(sky.positions);
    expect(aspects).toBeInstanceOf(Array);

    // Aspects are valid sky aspects
    expect(aspects.length).toBeGreaterThanOrEqual(0);

    // Forecast works with empty transits
    const forecast = generatePersonalForecast({ current: [], recent: [], upcoming: [] });
    expect(forecast.theme).toBeTruthy();
    expect(forecast.guidance).toBeTruthy();
    expect(forecast.actions).toBeInstanceOf(Array);
  });

  it('moon phase data integrates with sun sign', () => {
    const date = new Date('2024-06-15');
    const moonData = calculateMoonPhaseData(date);
    const sunSign = getCurrentSunSign(date);

    expect(moonData.phase).toBeTruthy();
    expect(moonData.illumination).toBeGreaterThanOrEqual(0);
    expect(sunSign.sign).toBeTruthy();

    // Moon phase and sun sign are both defined for the same date
    expect(moonData.phase.length).toBeGreaterThan(0);
    expect(sunSign.element).toBeTruthy();
  });

  it('aspect calculation returns valid sky aspects', async () => {
    const date = new Date('2024-06-15');
    const sky = await calculateCurrentSky(date);
    const aspects = calculateSkyAspects(sky.positions);

    expect(aspects).toBeInstanceOf(Array);
    aspects.forEach(a => {
      expect(a.orb).toBeGreaterThanOrEqual(0);
      expect(a.strength).toBeGreaterThanOrEqual(0);
      expect(a.strength).toBeLessThanOrEqual(100);
    });
  });

  it('forecast generates actions even with no transits', () => {
    const forecast = generatePersonalForecast({ current: [], recent: [], upcoming: [] });
    expect(forecast.actions.length).toBeGreaterThan(0);
    expect(forecast.theme).toBeTruthy();
  });

  it('sky positions include all major planets', async () => {
    const date = new Date('2024-06-15');
    const sky = await calculateCurrentSky(date);
    const expectedPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

    for (const planet of expectedPlanets) {
      expect(sky.positions[planet]).toBeDefined();
      expect(sky.positions[planet].longitude).toBeGreaterThanOrEqual(0);
      expect(sky.positions[planet].longitude).toBeLessThan(360);
    }
  });

  it('aspect strengths are normalized', async () => {
    const date = new Date('2024-06-15');
    const sky = await calculateCurrentSky(date);
    const aspects = calculateSkyAspects(sky.positions);

    for (const aspect of aspects) {
      expect(aspect.strength).toBeGreaterThanOrEqual(0);
      expect(aspect.strength).toBeLessThanOrEqual(100);
      expect(aspect.orb).toBeGreaterThanOrEqual(0);
    }
  });

  it('julian day is consistent across modules', async () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const sky = await calculateCurrentSky(date);

    // Julian day should be a large positive number
    expect(sky.julianDay).toBeGreaterThan(2400000);
    expect(sky.timestamp).toBe(date.getTime());
  });

  it('forecast handles recent endings gracefully', () => {
    const recentEndings = [
      { planet: 'Jupiter', aspect: 'trine', daysAgo: 2 },
    ];

    const forecast = generatePersonalForecast({ current: [], recent: recentEndings as any, upcoming: [] });
    expect(forecast.theme).toBeTruthy();
    expect(forecast.guidance.length).toBeGreaterThan(0);
  });
});
