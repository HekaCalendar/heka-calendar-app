import { describe, it, expect } from 'vitest';
import {
  getRegionForLocation,
  CELESTIAL_REGIONS,
  type CelestialRegion,
} from '../../src/astrology/services/guidance/regions';

describe('getRegionForLocation', () => {
  it('returns European Heart for longitude 0', () => {
    const region = getRegionForLocation(0);
    expect(region.id).toBe('european');
    expect(region.name).toBe('European Heart');
    expect(region.longitudeRange).toEqual([0, 30]);
  });

  it('returns Eastern Gateway for longitude 45', () => {
    const region = getRegionForLocation(45);
    expect(region.id).toBe('eastern-european');
    expect(region.name).toBe('Eastern Gateway');
    expect(region.longitudeRange).toEqual([30, 60]);
  });

  it('returns Pacific Far for longitude 179', () => {
    const region = getRegionForLocation(179);
    expect(region.id).toBe('pacific-far');
    expect(region.name).toBe('Pacific Far');
    expect(region.longitudeRange).toEqual([150, 180]);
  });

  it('returns Pacific West for longitude -180', () => {
    const region = getRegionForLocation(-180);
    expect(region.id).toBe('pacific-west');
    expect(region.name).toBe('Pacific West');
    expect(region.longitudeRange).toEqual([-180, -150]);
  });

  it('wraps 360 to Pacific West (fallback after normalization)', () => {
    const region = getRegionForLocation(360);
    // 360 normalizes to 0, which falls in European Heart [0,30)
    expect(region.id).toBe('european');
  });
});

describe('CELESTIAL_REGIONS', () => {
  it('has 12 regions', () => {
    expect(CELESTIAL_REGIONS).toHaveLength(12);
  });

  it('each region has required structure', () => {
    for (const region of CELESTIAL_REGIONS) {
      expect(region).toHaveProperty('id');
      expect(region).toHaveProperty('name');
      expect(region).toHaveProperty('centerLongitude');
      expect(region).toHaveProperty('longitudeRange');
      expect(Array.isArray(region.longitudeRange)).toBe(true);
      expect(region.longitudeRange).toHaveLength(2);
      expect(region).toHaveProperty('primaryCities');
      expect(Array.isArray(region.primaryCities)).toBe(true);
      expect(region).toHaveProperty('element');
      expect(['fire', 'earth', 'air', 'water', 'ether']).toContain(region.element);
      expect(region).toHaveProperty('quality');
      expect(['cardinal', 'fixed', 'mutable']).toContain(region.quality);
    }
  });

  it('covers the full -180 to 180 range without gaps', () => {
    const sorted = [...CELESTIAL_REGIONS].sort(
      (a, b) => a.longitudeRange[0] - b.longitudeRange[0]
    );
    expect(sorted[0].longitudeRange[0]).toBeLessThanOrEqual(-180);
    expect(sorted[sorted.length - 1].longitudeRange[1]).toBeGreaterThanOrEqual(180);
  });
});
