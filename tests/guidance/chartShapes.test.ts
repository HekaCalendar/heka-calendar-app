import { describe, it, expect } from 'vitest';
import {
  detectChartShape,
  calculateGaps,
  type ChartShape,
} from '../../src/astrology/services/guidance/templates/chartShapes';

function makePositions(longitudes: number[]): Record<string, { longitude: number }> {
  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const result: Record<string, { longitude: number }> = {};
  longitudes.forEach((lon, i) => {
    result[planets[i] ?? `p${i}`] = { longitude: lon };
  });
  return result;
}

describe('calculateGaps', () => {
  it('calculates gaps for evenly spaced planets', () => {
    const gaps = calculateGaps([0, 90, 180, 270]);
    expect(gaps).toEqual([90, 90, 90, 90]);
  });

  it('calculates wrap-around gap correctly', () => {
    const gaps = calculateGaps([300, 10, 50]);
    expect(gaps).toHaveLength(3);
    // Sorted order is [10, 50, 300]
    expect(gaps[0]).toBeCloseTo(40, 1); // 10 -> 50
    expect(gaps[1]).toBeCloseTo(250, 1); // 50 -> 300
    expect(gaps[2]).toBeCloseTo(70, 1); // 300 -> 10 (wrap)
  });

  it('returns sorted order gaps', () => {
    const gaps = calculateGaps([200, 50, 150]);
    expect(gaps).toHaveLength(3);
    expect(gaps).toEqual([100, 50, 210]);
  });
});

describe('detectChartShape', () => {
  it('detects Bowl pattern (all planets in 180° arc)', () => {
    const positions = makePositions([10, 30, 50, 70, 90, 110, 130, 150]);
    const reading = detectChartShape(positions);
    expect(reading.shape).toBe('bowl');
    expect(reading.name).toBe('Bowl');
    expect(reading.occupiedHemisphere).toBeDefined();
    expect(reading.description).toContain('hemisphere');
  });

  it('detects Bucket pattern (one planet opposite cluster)', () => {
    // Tight cluster around 10-60° and one handle at 200°
    const positions = makePositions([10, 20, 30, 40, 50, 60, 200]);
    const reading = detectChartShape(positions);
    expect(reading.shape).toBe('bucket');
    expect(reading.name).toBe('Bucket');
    expect(reading.handlePlanet).toBeDefined();
  });

  it('detects Seesaw pattern (two groups opposite)', () => {
    // Two groups of 4 around 0° and 180°
    const positions = makePositions([10, 20, 30, 40, 190, 200, 210, 220]);
    const reading = detectChartShape(positions);
    expect(reading.shape).toBe('seesaw');
    expect(reading.name).toBe('Seesaw');
    expect(reading.description).toContain('negotiation');
  });

  it('detects Splash pattern (evenly spread, no gap > 90°)', () => {
    const positions = makePositions([0, 45, 90, 135, 180, 225, 270, 315]);
    const reading = detectChartShape(positions);
    expect(reading.shape).toBe('splash');
    expect(reading.name).toBe('Splash');
    expect(reading.description).toContain('variety');
  });

  it('detects Bundle pattern (tight cluster < 120°)', () => {
    const positions = makePositions([10, 20, 30, 40, 50, 60, 70, 80]);
    const reading = detectChartShape(positions);
    expect(reading.shape).toBe('bundle');
    expect(reading.name).toBe('Bundle');
    expect(reading.description).toContain('intense');
  });

  it('detects Locomotive pattern (gap > 120°)', () => {
    // 240° arc with ~120° gap
    const positions = makePositions([0, 40, 80, 120, 160, 200, 240]);
    const reading = detectChartShape(positions);
    expect(reading.shape).toBe('locomotive');
    expect(reading.name).toBe('Locomotive');
    expect(reading.gapSign).toBeDefined();
  });

  it('returns none for fewer than 6 planets', () => {
    const positions = makePositions([10, 20, 30, 40, 50]);
    const reading = detectChartShape(positions);
    expect(reading.shape).toBe('none');
    expect(reading.name).toBe('Undetermined');
  });

  it('returns Open Pattern for distributions without dominant shape', () => {
    // Spread that does not match any specific pattern well
    const positions = makePositions([0, 30, 60, 90, 120, 150, 300]);
    const reading = detectChartShape(positions);
    expect(reading.shape).toBe('none');
    expect(reading.name).toBe('Open Pattern');
  });
});
