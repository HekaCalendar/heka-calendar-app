/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL REGIONS - Earth Segmentation for Local Guidance
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface CelestialRegion {
  id: string;
  name: string;
  centerLongitude: number;
  longitudeRange: [number, number];
  primaryCities: string[];
  element: 'fire' | 'earth' | 'air' | 'water' | 'ether';
  quality: 'cardinal' | 'fixed' | 'mutable';
}

export const CELESTIAL_REGIONS: CelestialRegion[] = [
  {
    id: 'pacific-west',
    name: 'Pacific West',
    centerLongitude: -165,
    longitudeRange: [-180, -150],
    primaryCities: ['Honolulu', 'Anchorage', 'Nuku\'alofa'],
    element: 'fire',
    quality: 'mutable',
  },
  {
    id: 'pacific-east',
    name: 'Pacific East',
    centerLongitude: -135,
    longitudeRange: [-150, -120],
    primaryCities: ['Los Angeles', 'San Francisco', 'Vancouver'],
    element: 'water',
    quality: 'cardinal',
  },
  {
    id: 'mountain',
    name: 'Mountain Heart',
    centerLongitude: -105,
    longitudeRange: [-120, -90],
    primaryCities: ['Denver', 'Phoenix', 'Mexico City'],
    element: 'fire',
    quality: 'fixed',
  },
  {
    id: 'central',
    name: 'Central Meridian',
    centerLongitude: -75,
    longitudeRange: [-90, -60],
    primaryCities: ['New York', 'Toronto', 'Lima', 'Bogotá'],
    element: 'earth',
    quality: 'mutable',
  },
  {
    id: 'atlantic-west',
    name: 'Atlantic West',
    centerLongitude: -45,
    longitudeRange: [-60, -30],
    primaryCities: ['São Paulo', 'Buenos Aires', 'Reykjavik'],
    element: 'air',
    quality: 'cardinal',
  },
  {
    id: 'atlantic-east',
    name: 'Atlantic East',
    centerLongitude: -15,
    longitudeRange: [-30, 0],
    primaryCities: ['London', 'Lisbon', 'Dakar', 'Casablanca'],
    element: 'water',
    quality: 'fixed',
  },
  {
    id: 'european',
    name: 'European Heart',
    centerLongitude: 15,
    longitudeRange: [0, 30],
    primaryCities: ['Paris', 'Rome', 'Berlin', 'Cairo', 'Cape Town'],
    element: 'earth',
    quality: 'mutable',
  },
  {
    id: 'eastern-european',
    name: 'Eastern Gateway',
    centerLongitude: 45,
    longitudeRange: [30, 60],
    primaryCities: ['Moscow', 'Dubai', 'Nairobi', 'Tehran'],
    element: 'fire',
    quality: 'cardinal',
  },
  {
    id: 'asian-west',
    name: 'Asian West',
    centerLongitude: 75,
    longitudeRange: [60, 90],
    primaryCities: ['Mumbai', 'Delhi', 'Bangkok', 'Singapore'],
    element: 'earth',
    quality: 'fixed',
  },
  {
    id: 'asian-east',
    name: 'Asian East',
    centerLongitude: 105,
    longitudeRange: [90, 120],
    primaryCities: ['Beijing', 'Hong Kong', 'Perth', 'Jakarta'],
    element: 'air',
    quality: 'mutable',
  },
  {
    id: 'pacific-north',
    name: 'Pacific North',
    centerLongitude: 135,
    longitudeRange: [120, 150],
    primaryCities: ['Tokyo', 'Seoul', 'Sydney', 'Melbourne'],
    element: 'water',
    quality: 'cardinal',
  },
  {
    id: 'pacific-far',
    name: 'Pacific Far',
    centerLongitude: 165,
    longitudeRange: [150, 180],
    primaryCities: ['Auckland', 'Suva', 'Port Moresby'],
    element: 'fire',
    quality: 'fixed',
  },
];

export function getRegionForLocation(longitude: number): CelestialRegion {
  let normalized = longitude;
  while (normalized < -180) normalized += 360;
  while (normalized > 180) normalized -= 360;
  
  const region = CELESTIAL_REGIONS.find(
    r => normalized >= r.longitudeRange[0] && normalized < r.longitudeRange[1]
  );
  
  return region || CELESTIAL_REGIONS[0];
}

export default CELESTIAL_REGIONS;
