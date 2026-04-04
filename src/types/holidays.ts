/**
 * Holiday Types and Data
 * Universal holiday system supporting multiple countries/regions
 */

export type CountryCode = 
  | 'NONE'
  | 'ALL'
  | 'AU'  // Australia
  | 'US'  // United States
  | 'UK'  // United Kingdom
  | 'CA'  // Canada
  | 'NZ'  // New Zealand
  | 'IE'  // Ireland
  | 'ZA'  // South Africa
  | 'IN'  // India
  | 'SG'; // Singapore

export interface Holiday {
  name: string;
  date: string; // MM-DD format
  type: 'public' | 'observance' | 'religious';
  regions: CountryCode[];
  description?: string;
}

export interface MoonPhaseData {
  phase: string;
  glyph: string;
  illumination: number; // 0-100%
  age: number; // days since new moon
  waxing: boolean;
  nextPhase: string;
  nextPhaseDate: Date;
  hemisphere: 'N' | 'S';
}

export interface LocationData {
  country: CountryCode;
  timezone: string;
  latitude: number;
  longitude: number;
  name: string;
  region: string;
}

// Location presets for major regions
export const LOCATIONS: Record<CountryCode, LocationData> = {
  NONE: { country: 'NONE', timezone: 'UTC', latitude: 0, longitude: 0, name: 'No Location', region: 'Other' },
  ALL: { country: 'ALL', timezone: 'UTC', latitude: 0, longitude: 0, name: 'All Regions', region: 'Other' },
  AU: { country: 'AU', timezone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093, name: 'Australia', region: 'Oceania' },
  US: { country: 'US', timezone: 'America/New_York', latitude: 40.7128, longitude: -74.0060, name: 'United States', region: 'North America' },
  UK: { country: 'UK', timezone: 'Europe/London', latitude: 51.5074, longitude: -0.1278, name: 'United Kingdom', region: 'Europe' },
  CA: { country: 'CA', timezone: 'America/Toronto', latitude: 43.6532, longitude: -79.3832, name: 'Canada', region: 'North America' },
  NZ: { country: 'NZ', timezone: 'Pacific/Auckland', latitude: -36.8485, longitude: 174.7633, name: 'New Zealand', region: 'Oceania' },
  IE: { country: 'IE', timezone: 'Europe/Dublin', latitude: 53.3498, longitude: -6.2603, name: 'Ireland', region: 'Europe' },
  ZA: { country: 'ZA', timezone: 'Africa/Johannesburg', latitude: -26.2041, longitude: 28.0473, name: 'South Africa', region: 'Africa' },
  IN: { country: 'IN', timezone: 'Asia/Kolkata', latitude: 28.6139, longitude: 77.2090, name: 'India', region: 'Asia' },
  SG: { country: 'SG', timezone: 'Asia/Singapore', latitude: 1.3521, longitude: 103.8198, name: 'Singapore', region: 'Asia' },
};

// Sub-region data for precise location calculations
export interface SubRegionData {
  code: string;
  name: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export const SUB_REGIONS: Record<CountryCode, SubRegionData[]> = {
  NONE: [],
  ALL: [],
  AU: [
    { code: 'AU-NSW', name: 'New South Wales', timezone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093 },
    { code: 'AU-VIC', name: 'Victoria', timezone: 'Australia/Melbourne', latitude: -37.8136, longitude: 144.9631 },
    { code: 'AU-QLD', name: 'Queensland', timezone: 'Australia/Brisbane', latitude: -27.4698, longitude: 153.0251 },
    { code: 'AU-WA', name: 'Western Australia', timezone: 'Australia/Perth', latitude: -31.9505, longitude: 115.8605 },
    { code: 'AU-SA', name: 'South Australia', timezone: 'Australia/Adelaide', latitude: -34.9285, longitude: 138.6007 },
    { code: 'AU-TAS', name: 'Tasmania', timezone: 'Australia/Hobart', latitude: -42.8821, longitude: 147.3272 },
    { code: 'AU-ACT', name: 'Australian Capital Territory', timezone: 'Australia/Sydney', latitude: -35.2809, longitude: 149.1300 },
    { code: 'AU-NT', name: 'Northern Territory', timezone: 'Australia/Darwin', latitude: -12.4634, longitude: 130.8456 },
  ],
  US: [
    { code: 'US-NY', name: 'New York', timezone: 'America/New_York', latitude: 40.7128, longitude: -74.0060 },
    { code: 'US-CA', name: 'California', timezone: 'America/Los_Angeles', latitude: 34.0522, longitude: -118.2437 },
    { code: 'US-TX', name: 'Texas', timezone: 'America/Chicago', latitude: 29.7604, longitude: -95.3698 },
    { code: 'US-FL', name: 'Florida', timezone: 'America/New_York', latitude: 25.7617, longitude: -80.1918 },
    { code: 'US-IL', name: 'Illinois', timezone: 'America/Chicago', latitude: 41.8781, longitude: -87.6298 },
    { code: 'US-PA', name: 'Pennsylvania', timezone: 'America/New_York', latitude: 39.9526, longitude: -75.1652 },
    { code: 'US-OH', name: 'Ohio', timezone: 'America/New_York', latitude: 39.9612, longitude: -82.9988 },
    { code: 'US-GA', name: 'Georgia', timezone: 'America/New_York', latitude: 33.7490, longitude: -84.3880 },
    { code: 'US-NC', name: 'North Carolina', timezone: 'America/New_York', latitude: 35.2271, longitude: -80.8431 },
    { code: 'US-MI', name: 'Michigan', timezone: 'America/Detroit', latitude: 42.3314, longitude: -83.0458 },
    { code: 'US-NJ', name: 'New Jersey', timezone: 'America/New_York', latitude: 40.0583, longitude: -74.4057 },
    { code: 'US-VA', name: 'Virginia', timezone: 'America/New_York', latitude: 37.5407, longitude: -77.4360 },
    { code: 'US-WA', name: 'Washington', timezone: 'America/Los_Angeles', latitude: 47.6062, longitude: -122.3321 },
    { code: 'US-AZ', name: 'Arizona', timezone: 'America/Phoenix', latitude: 33.4484, longitude: -112.0740 },
    { code: 'US-MA', name: 'Massachusetts', timezone: 'America/New_York', latitude: 42.3601, longitude: -71.0589 },
    { code: 'US-TN', name: 'Tennessee', timezone: 'America/Chicago', latitude: 36.1627, longitude: -86.7816 },
    { code: 'US-IN', name: 'Indiana', timezone: 'America/Indiana/Indianapolis', latitude: 39.7684, longitude: -86.1581 },
    { code: 'US-MO', name: 'Missouri', timezone: 'America/Chicago', latitude: 38.6270, longitude: -90.1994 },
    { code: 'US-MD', name: 'Maryland', timezone: 'America/New_York', latitude: 39.2904, longitude: -76.6122 },
    { code: 'US-WI', name: 'Wisconsin', timezone: 'America/Chicago', latitude: 43.0389, longitude: -87.9065 },
    { code: 'US-CO', name: 'Colorado', timezone: 'America/Denver', latitude: 39.7392, longitude: -104.9903 },
    { code: 'US-MN', name: 'Minnesota', timezone: 'America/Chicago', latitude: 44.9778, longitude: -93.2650 },
    { code: 'US-SC', name: 'South Carolina', timezone: 'America/New_York', latitude: 34.0007, longitude: -81.0348 },
    { code: 'US-AL', name: 'Alabama', timezone: 'America/Chicago', latitude: 33.5186, longitude: -86.8104 },
    { code: 'US-LA', name: 'Louisiana', timezone: 'America/Chicago', latitude: 29.9511, longitude: -90.0715 },
    { code: 'US-KY', name: 'Kentucky', timezone: 'America/New_York', latitude: 38.2527, longitude: -85.7585 },
    { code: 'US-OR', name: 'Oregon', timezone: 'America/Los_Angeles', latitude: 45.5152, longitude: -122.6784 },
    { code: 'US-OK', name: 'Oklahoma', timezone: 'America/Chicago', latitude: 35.4676, longitude: -97.5164 },
    { code: 'US-CT', name: 'Connecticut', timezone: 'America/New_York', latitude: 41.7658, longitude: -72.6734 },
    { code: 'US-UT', name: 'Utah', timezone: 'America/Denver', latitude: 40.7608, longitude: -111.8910 },
    { code: 'US-IA', name: 'Iowa', timezone: 'America/Chicago', latitude: 41.5868, longitude: -93.6250 },
    { code: 'US-NV', name: 'Nevada', timezone: 'America/Los_Angeles', latitude: 36.1699, longitude: -115.1398 },
    { code: 'US-AR', name: 'Arkansas', timezone: 'America/Chicago', latitude: 34.7465, longitude: -92.2896 },
    { code: 'US-MS', name: 'Mississippi', timezone: 'America/Chicago', latitude: 32.2988, longitude: -90.1848 },
    { code: 'US-KS', name: 'Kansas', timezone: 'America/Chicago', latitude: 39.0997, longitude: -94.5786 },
    { code: 'US-NM', name: 'New Mexico', timezone: 'America/Denver', latitude: 35.0844, longitude: -106.6504 },
    { code: 'US-NE', name: 'Nebraska', timezone: 'America/Chicago', latitude: 41.2565, longitude: -95.9345 },
    { code: 'US-WV', name: 'West Virginia', timezone: 'America/New_York', latitude: 38.3498, longitude: -81.6326 },
    { code: 'US-ID', name: 'Idaho', timezone: 'America/Boise', latitude: 43.6150, longitude: -116.2023 },
    { code: 'US-HI', name: 'Hawaii', timezone: 'Pacific/Honolulu', latitude: 21.3099, longitude: -157.8581 },
    { code: 'US-ME', name: 'Maine', timezone: 'America/New_York', latitude: 44.3106, longitude: -69.7795 },
    { code: 'US-NH', name: 'New Hampshire', timezone: 'America/New_York', latitude: 43.2081, longitude: -71.5376 },
    { code: 'US-MT', name: 'Montana', timezone: 'America/Denver', latitude: 46.8721, longitude: -113.9940 },
    { code: 'US-RI', name: 'Rhode Island', timezone: 'America/New_York', latitude: 41.8240, longitude: -71.4128 },
    { code: 'US-DE', name: 'Delaware', timezone: 'America/New_York', latitude: 39.7391, longitude: -75.5398 },
    { code: 'US-SD', name: 'South Dakota', timezone: 'America/Chicago', latitude: 44.3683, longitude: -100.3510 },
    { code: 'US-ND', name: 'North Dakota', timezone: 'America/Chicago', latitude: 46.8772, longitude: -96.7898 },
    { code: 'US-AK', name: 'Alaska', timezone: 'America/Anchorage', latitude: 61.2181, longitude: -149.9003 },
    { code: 'US-VT', name: 'Vermont', timezone: 'America/New_York', latitude: 44.2601, longitude: -72.5754 },
    { code: 'US-WY', name: 'Wyoming', timezone: 'America/Denver', latitude: 41.1400, longitude: -104.8202 },
  ],
  UK: [
    { code: 'UK-ENG', name: 'England', timezone: 'Europe/London', latitude: 51.5074, longitude: -0.1278 },
    { code: 'UK-SCT', name: 'Scotland', timezone: 'Europe/London', latitude: 55.9533, longitude: -3.1883 },
    { code: 'UK-WLS', name: 'Wales', timezone: 'Europe/London', latitude: 51.4816, longitude: -3.1791 },
    { code: 'UK-NIR', name: 'Northern Ireland', timezone: 'Europe/London', latitude: 54.5973, longitude: -5.9301 },
  ],
  CA: [
    { code: 'CA-ON', name: 'Ontario', timezone: 'America/Toronto', latitude: 43.6532, longitude: -79.3832 },
    { code: 'CA-QC', name: 'Quebec', timezone: 'America/Toronto', latitude: 46.8139, longitude: -71.2080 },
    { code: 'CA-BC', name: 'British Columbia', timezone: 'America/Vancouver', latitude: 49.2827, longitude: -123.1207 },
    { code: 'CA-AB', name: 'Alberta', timezone: 'America/Edmonton', latitude: 53.5461, longitude: -113.4938 },
    { code: 'CA-MB', name: 'Manitoba', timezone: 'America/Winnipeg', latitude: 49.8951, longitude: -97.1384 },
    { code: 'CA-SK', name: 'Saskatchewan', timezone: 'America/Regina', latitude: 50.4452, longitude: -104.6189 },
    { code: 'CA-NS', name: 'Nova Scotia', timezone: 'America/Halifax', latitude: 44.6488, longitude: -63.5752 },
    { code: 'CA-NB', name: 'New Brunswick', timezone: 'America/Halifax', latitude: 46.0878, longitude: -64.7782 },
    { code: 'CA-NL', name: 'Newfoundland and Labrador', timezone: 'America/St_Johns', latitude: 47.5615, longitude: -52.7126 },
    { code: 'CA-PE', name: 'Prince Edward Island', timezone: 'America/Halifax', latitude: 46.2382, longitude: -63.1311 },
    { code: 'CA-NT', name: 'Northwest Territories', timezone: 'America/Yellowknife', latitude: 62.4540, longitude: -114.3718 },
    { code: 'CA-NU', name: 'Nunavut', timezone: 'America/Iqaluit', latitude: 63.7467, longitude: -68.5170 },
    { code: 'CA-YT', name: 'Yukon', timezone: 'America/Whitehorse', latitude: 60.7212, longitude: -135.0568 },
  ],
  NZ: [
    { code: 'NZ-AUK', name: 'Auckland', timezone: 'Pacific/Auckland', latitude: -36.8485, longitude: 174.7633 },
    { code: 'NZ-WGN', name: 'Wellington', timezone: 'Pacific/Auckland', latitude: -41.2865, longitude: 174.7762 },
    { code: 'NZ-CHC', name: 'Christchurch', timezone: 'Pacific/Auckland', latitude: -43.5321, longitude: 172.6362 },
    { code: 'NZ-DUD', name: 'Dunedin', timezone: 'Pacific/Auckland', latitude: -45.8788, longitude: 170.5028 },
    { code: 'NZ-HLZ', name: 'Hamilton', timezone: 'Pacific/Auckland', latitude: -37.7870, longitude: 175.2793 },
    { code: 'NZ-NPE', name: 'Napier', timezone: 'Pacific/Auckland', latitude: -39.4928, longitude: 176.9120 },
  ],
  IE: [
    { code: 'IE-D', name: 'Dublin', timezone: 'Europe/Dublin', latitude: 53.3498, longitude: -6.2603 },
    { code: 'IE-C', name: 'Cork', timezone: 'Europe/Dublin', latitude: 51.8985, longitude: -8.4756 },
    { code: 'IE-G', name: 'Galway', timezone: 'Europe/Dublin', latitude: 53.2707, longitude: -9.0568 },
    { code: 'IE-L', name: 'Limerick', timezone: 'Europe/Dublin', latitude: 52.6638, longitude: -8.6267 },
  ],
  ZA: [
    { code: 'ZA-GP', name: 'Gauteng', timezone: 'Africa/Johannesburg', latitude: -26.2041, longitude: 28.0473 },
    { code: 'ZA-WC', name: 'Western Cape', timezone: 'Africa/Johannesburg', latitude: -33.9249, longitude: 18.4241 },
    { code: 'ZA-KZN', name: 'KwaZulu-Natal', timezone: 'Africa/Johannesburg', latitude: -29.8587, longitude: 31.0218 },
    { code: 'ZA-EC', name: 'Eastern Cape', timezone: 'Africa/Johannesburg', latitude: -33.0292, longitude: 27.8546 },
  ],
  IN: [
    { code: 'IN-MH', name: 'Maharashtra', timezone: 'Asia/Kolkata', latitude: 19.0760, longitude: 72.8777 },
    { code: 'IN-DL', name: 'Delhi', timezone: 'Asia/Kolkata', latitude: 28.6139, longitude: 77.2090 },
    { code: 'IN-KA', name: 'Karnataka', timezone: 'Asia/Kolkata', latitude: 12.9716, longitude: 77.5946 },
    { code: 'IN-TN', name: 'Tamil Nadu', timezone: 'Asia/Kolkata', latitude: 13.0827, longitude: 80.2707 },
    { code: 'IN-WB', name: 'West Bengal', timezone: 'Asia/Kolkata', latitude: 22.5726, longitude: 88.3639 },
    { code: 'IN-GJ', name: 'Gujarat', timezone: 'Asia/Kolkata', latitude: 23.0225, longitude: 72.5714 },
    { code: 'IN-RJ', name: 'Rajasthan', timezone: 'Asia/Kolkata', latitude: 26.9124, longitude: 75.7873 },
    { code: 'IN-UP', name: 'Uttar Pradesh', timezone: 'Asia/Kolkata', latitude: 26.8467, longitude: 80.9462 },
  ],
  SG: [
    { code: 'SG-CENTRAL', name: 'Central Region', timezone: 'Asia/Singapore', latitude: 1.3521, longitude: 103.8198 },
  ],
};

// Determine hemisphere based on latitude
export function getHemisphere(latitude: number): 'N' | 'S' {
  return latitude >= 0 ? 'N' : 'S';
}

// Calculate Easter date for a given year (Gregorian calendar)
function getEasterDates(year: number): { goodFriday: string; easterMonday: string } {
  // Gauss's Easter algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  // Easter Sunday
  const easterSunday = new Date(year, month - 1, day);
  
  // Good Friday (2 days before)
  const goodFriday = new Date(easterSunday);
  goodFriday.setDate(goodFriday.getDate() - 2);
  
  // Easter Monday (1 day after)
  const easterMonday = new Date(easterSunday);
  easterMonday.setDate(easterMonday.getDate() + 1);
  
  const formatDate = (d: Date) => 
    `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  
  return {
    goodFriday: formatDate(goodFriday),
    easterMonday: formatDate(easterMonday)
  };
}

// Universal holidays database
export const HOLIDAYS: Holiday[] = [
  // Australia
  { name: "New Year's Day", date: '01-01', type: 'public', regions: ['AU', 'US', 'UK', 'CA', 'NZ', 'IE', 'ZA', 'SG'] },
  { name: 'Australia Day', date: '01-26', type: 'public', regions: ['AU'] },
  // Good Friday and Easter Monday are calculated dynamically based on year
  { name: 'Anzac Day', date: '04-25', type: 'public', regions: ['AU', 'NZ'] },
  { name: "King's Birthday", date: '06-09', type: 'public', regions: ['AU'] },
  { name: 'Labour Day', date: '10-06', type: 'public', regions: ['AU'] },
  { name: 'Christmas Day', date: '12-25', type: 'public', regions: ['AU', 'US', 'UK', 'CA', 'NZ', 'IE', 'ZA', 'SG'] },
  { name: 'Boxing Day', date: '12-26', type: 'public', regions: ['AU', 'UK', 'CA', 'NZ', 'ZA'] },
  
  // United States
  { name: 'Martin Luther King Jr. Day', date: '01-20', type: 'public', regions: ['US'] },
  { name: 'Presidents Day', date: '02-17', type: 'public', regions: ['US'] },
  { name: 'Memorial Day', date: '05-26', type: 'public', regions: ['US'] },
  { name: 'Independence Day', date: '07-04', type: 'public', regions: ['US'] },
  { name: 'Labor Day', date: '09-01', type: 'public', regions: ['US', 'CA'] },
  { name: 'Thanksgiving', date: '11-27', type: 'public', regions: ['US', 'CA'] },
  
  // United Kingdom
  { name: 'Early May Bank Holiday', date: '05-05', type: 'public', regions: ['UK', 'IE'] },
  { name: 'Spring Bank Holiday', date: '05-26', type: 'public', regions: ['UK'] },
  { name: 'Summer Bank Holiday', date: '08-25', type: 'public', regions: ['UK'] },
  
  // Canada
  { name: 'Canada Day', date: '07-01', type: 'public', regions: ['CA'] },
  { name: 'Victoria Day', date: '05-19', type: 'public', regions: ['CA'] },
  { name: 'Boxing Day', date: '12-26', type: 'public', regions: ['CA'] },
  
  // New Zealand
  { name: 'Waitangi Day', date: '02-06', type: 'public', regions: ['NZ'] },
  { name: 'Matariki', date: '06-20', type: 'public', regions: ['NZ'] },
  
  // Ireland
  { name: "St. Patrick's Day", date: '03-17', type: 'public', regions: ['IE'] },
  
  // South Africa
  { name: 'Human Rights Day', date: '03-21', type: 'public', regions: ['ZA'] },
  { name: 'Freedom Day', date: '04-27', type: 'public', regions: ['ZA'] },
  { name: 'Youth Day', date: '06-16', type: 'public', regions: ['ZA'] },
  
  // India
  { name: 'Republic Day', date: '01-26', type: 'public', regions: ['IN'] },
  { name: 'Independence Day', date: '08-15', type: 'public', regions: ['IN'] },
  { name: 'Gandhi Jayanti', date: '10-02', type: 'public', regions: ['IN'] },
  { name: 'Diwali', date: '11-12', type: 'religious', regions: ['IN', 'SG'] },
  
  // Singapore
  { name: 'Chinese New Year', date: '01-29', type: 'public', regions: ['SG'] },
  { name: 'National Day', date: '08-09', type: 'public', regions: ['SG'] },
  { name: 'Hari Raya Puasa', date: '03-31', type: 'public', regions: ['SG'] },
  { name: 'Deepavali', date: '11-12', type: 'public', regions: ['SG'] },
  
  // Common observances
  { name: "Valentine's Day", date: '02-14', type: 'observance', regions: ['ALL'] },
  { name: 'Earth Day', date: '04-22', type: 'observance', regions: ['ALL'] },
  { name: 'Halloween', date: '10-31', type: 'observance', regions: ['ALL'] },
  { name: "New Year's Eve", date: '12-31', type: 'observance', regions: ['ALL'] },
];

export function getHolidaysForDate(date: Date, country: CountryCode): Holiday[] {
  if (country === 'NONE') return [];
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${month}-${day}`;
  
  const holidays = HOLIDAYS.filter(h => {
    if (country === 'ALL') return true;
    return h.date === dateKey && (h.regions.includes(country) || h.regions.includes('ALL'));
  });
  
  // Add dynamic Easter holidays
  const easter = getEasterDates(year);
  const easterRegions: CountryCode[] = ['AU', 'UK', 'CA', 'NZ', 'IE', 'ZA', 'SG'];
  const easterMondayRegions: CountryCode[] = ['AU', 'UK', 'CA', 'NZ', 'IE', 'ZA'];
  
  if (dateKey === easter.goodFriday && (country === 'ALL' || easterRegions.includes(country))) {
    holidays.push({ name: 'Good Friday', date: dateKey, type: 'public', regions: easterRegions });
  }
  if (dateKey === easter.easterMonday && (country === 'ALL' || easterMondayRegions.includes(country))) {
    holidays.push({ name: 'Easter Monday', date: dateKey, type: 'public', regions: easterMondayRegions });
  }
  
  return holidays;
}

// ============================================================================
// Comprehensive Holiday System Integration
// ============================================================================

import type { 
  SubRegionCode, 
  SchoolHoliday 
} from './holidays-comprehensive';

import {
  COMPREHENSIVE_HOLIDAYS,
  SUB_REGIONAL_HOLIDAYS,
  isSchoolHoliday
} from './holidays-comprehensive';

export type { SubRegionCode } from './holidays-comprehensive';
export { 
  isSchoolHoliday, 
  isSchoolTerm
} from './holidays-comprehensive';

export interface EnrichedHoliday extends Holiday {
  isSubstitute?: boolean;
  originalDate?: string;
  subRegion?: SubRegionCode;
  description?: string;
}

/**
 * Get holidays for a specific date with sub-regional support
 * This is the enhanced version that supports state/province-specific holidays
 */
export function getHolidaysForDateWithSubRegion(
  date: Date, 
  country: CountryCode, 
  subRegion?: SubRegionCode
): EnrichedHoliday[] {
  if (country === 'NONE') return [];
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${month}-${day}`;
  
  const holidays: EnrichedHoliday[] = [];
  
  // 1. Get country-level holidays from comprehensive database
  const countryHolidays = COMPREHENSIVE_HOLIDAYS.filter(h => {
    if (country === 'ALL') return true;
    if (!h.regions.includes(country) && !h.regions.includes('ALL')) return false;
    if (h.date !== dateKey) return false;
    return true;
  });
  
  holidays.push(...countryHolidays.map(h => ({
    name: h.name,
    date: h.date,
    type: h.type as Holiday['type'],
    regions: h.regions,
    description: h.description
  })));
  
  // 2. Get sub-regional holidays if subRegion specified
  if (subRegion) {
    const subRegionHolidays = SUB_REGIONAL_HOLIDAYS.filter(h => 
      h.subRegions.includes(subRegion) && h.date === dateKey
    );
    
    holidays.push(...subRegionHolidays.map(h => ({
      name: h.name,
      date: h.date,
      type: h.type as Holiday['type'],
      regions: [country],
      subRegion,
      description: h.description
    })));
  }
  
  // 3. Add dynamic Easter holidays
  const easter = getEasterDates(year);
  const easterFridayRegions: CountryCode[] = ['AU', 'UK', 'CA', 'NZ', 'IE', 'ZA', 'SG'];
  const easterMondayRegions: CountryCode[] = ['AU', 'UK', 'CA', 'NZ', 'IE', 'ZA'];
  
  if (dateKey === easter.goodFriday && (country === 'ALL' || easterFridayRegions.includes(country))) {
    holidays.push({ 
      name: 'Good Friday', 
      date: dateKey, 
      type: 'public', 
      regions: easterFridayRegions,
      description: 'Christian holiday commemorating the crucifixion of Jesus'
    });
  }
  
  if (dateKey === easter.easterMonday && (country === 'ALL' || easterMondayRegions.includes(country))) {
    holidays.push({ 
      name: 'Easter Monday', 
      date: dateKey, 
      type: 'public', 
      regions: easterMondayRegions,
      description: 'Christian holiday celebrating the resurrection of Jesus'
    });
  }
  
  // 4. Check for substitute holidays (when original fell on weekend)
  // This checks if yesterday was a holiday that fell on Sunday, or
  // if 2 days ago was a holiday that fell on Saturday
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  const twoDaysAgo = new Date(date);
  twoDaysAgo.setDate(date.getDate() - 2);
  
  // Check yesterday's holidays (for Sunday holidays → Monday substitute)
  const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
  const yesterdayDay = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayKey = `${yesterdayMonth}-${yesterdayDay}`;
  
  const yesterdayHolidays = COMPREHENSIVE_HOLIDAYS.filter(h => {
    if (!h.regions.includes(country) && !h.regions.includes('ALL')) return false;
    if (h.date !== yesterdayKey) return false;
    if (h.substituteRule === 'none' || !h.substituteRule) return false;
    return yesterday.getDay() === 0; // Yesterday was Sunday
  });
  
  holidays.push(...yesterdayHolidays.map(h => ({
    name: `${h.name} (Observed)`,
    date: dateKey,
    type: 'substitute' as 'public',
    regions: h.regions,
    isSubstitute: true,
    originalDate: yesterdayKey,
    description: `Substitute holiday for ${h.name} which fell on Sunday`
  })));
  
  // Check 2 days ago (for Saturday holidays → Monday substitute in some jurisdictions)
  const twoDaysMonth = String(twoDaysAgo.getMonth() + 1).padStart(2, '0');
  const twoDaysDay = String(twoDaysAgo.getDate()).padStart(2, '0');
  const twoDaysKey = `${twoDaysMonth}-${twoDaysDay}`;
  
  if (date.getDay() === 1) { // Today is Monday
    const saturdayHolidays = COMPREHENSIVE_HOLIDAYS.filter(h => {
      if (!h.regions.includes(country) && !h.regions.includes('ALL')) return false;
      if (h.date !== twoDaysKey) return false;
      if (h.substituteRule === 'none') return false;
      return twoDaysAgo.getDay() === 6; // 2 days ago was Saturday
    });
    
    holidays.push(...saturdayHolidays.map(h => ({
      name: `${h.name} (Observed)`,
      date: dateKey,
      type: 'substitute' as 'public',
      regions: h.regions,
      isSubstitute: true,
      originalDate: twoDaysKey,
      description: `Substitute holiday for ${h.name} which fell on Saturday`
    })));
  }
  
  return holidays;
}

/**
 * Get school holiday information for a date
 */
export function getSchoolHolidayInfo(date: Date, subRegion: SubRegionCode): SchoolHoliday | null {
  return isSchoolHoliday(date, subRegion);
}

export function getHolidayName(date: Date, country: CountryCode): string | null {
  const holidays = getHolidaysForDate(date, country);
  return holidays.length > 0 ? holidays[0].name : null;
}

export function getYearLabel(year: number, monthIndex: number): string {
  if (monthIndex >= 10) return `${year}–${year + 1}`;
  return String(year);
}
