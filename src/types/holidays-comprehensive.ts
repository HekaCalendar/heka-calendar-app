/**
 * Comprehensive Holiday System with Sub-Regional Support
 * 
 * Features:
 * - Country-level public holidays
 * - Sub-regional (state/province) holidays
 * - School term dates for major regions
 * - Automatic substitute holiday calculation (weekend → Monday)
 * - Religious holidays with lunar-based calculations
 */

import type { CountryCode } from './holidays';

// ============================================================================
// Sub-Region Types
// ============================================================================

export type SubRegionCode =
  // Australia
  | 'AU-NSW' | 'AU-VIC' | 'AU-QLD' | 'AU-WA' | 'AU-SA' | 'AU-TAS' | 'AU-ACT' | 'AU-NT'
  // United States
  | 'US-AL' | 'US-AK' | 'US-AZ' | 'US-AR' | 'US-CA' | 'US-CO' | 'US-CT' | 'US-DE'
  | 'US-FL' | 'US-GA' | 'US-HI' | 'US-ID' | 'US-IL' | 'US-IN' | 'US-IA' | 'US-KS'
  | 'US-KY' | 'US-LA' | 'US-ME' | 'US-MD' | 'US-MA' | 'US-MI' | 'US-MN' | 'US-MS'
  | 'US-MO' | 'US-MT' | 'US-NE' | 'US-NV' | 'US-NH' | 'US-NJ' | 'US-NM' | 'US-NY'
  | 'US-NC' | 'US-ND' | 'US-OH' | 'US-OK' | 'US-OR' | 'US-PA' | 'US-RI' | 'US-SC'
  | 'US-SD' | 'US-TN' | 'US-TX' | 'US-UT' | 'US-VT' | 'US-VA' | 'US-WA' | 'US-WV'
  | 'US-WI' | 'US-WY' | 'US-DC'
  // Canada
  | 'CA-AB' | 'CA-BC' | 'CA-MB' | 'CA-NB' | 'CA-NL' | 'CA-NS' | 'CA-ON' | 'CA-PE'
  | 'CA-QC' | 'CA-SK' | 'CA-NT' | 'CA-NU' | 'CA-YT'
  // UK
  | 'UK-ENG' | 'UK-SCT' | 'UK-WLS' | 'UK-NIR'
  // New Zealand
  | 'NZ-AUK' | 'NZ-WGN' | 'NZ-CHC' | 'NZ-DUD' | 'NZ-HLZ' | 'NZ-NPE'
  // Ireland (no sub-regions)
  // South Africa
  | 'ZA-GP' | 'ZA-WC' | 'ZA-KZN' | 'ZA-EC' | 'ZA-FS' | 'ZA-MP' | 'ZA-NW' | 'ZA-NC' | 'ZA-LP'
  // India
  | 'IN-DL' | 'IN-MH' | 'IN-KA' | 'IN-TN' | 'IN-WB' | 'IN-GJ' | 'IN-RJ' | 'IN-UP'
  | 'IN-BR' | 'IN-CG' | 'IN-HR' | 'IN-HP' | 'IN-JK' | 'IN-JH' | 'IN-KL' | 'IN-MP'
  | 'IN-MN' | 'IN-ML' | 'IN-MZ' | 'IN-NL' | 'IN-OR' | 'IN-PB' | 'IN-SK' | 'IN-TR'
  // Singapore (no sub-regions)
  ;

// ============================================================================
// Holiday Types
// ============================================================================

export type HolidayType = 'public' | 'observance' | 'religious' | 'school' | 'substitute';

export interface ComprehensiveHoliday {
  name: string;
  date: string; // MM-DD format for fixed, or calculation function reference
  type: HolidayType;
  regions: CountryCode[];
  subRegions?: SubRegionCode[]; // If specified, only these sub-regions
  description?: string;
  // For substitute holidays (when original falls on weekend)
  substituteRule?: 'none' | 'monday-only' | 'nearest-weekday';
  // For lunar-based holidays
  lunarCalculation?: string;
  // Year range (for holidays that changed)
  validFrom?: number;
  validTo?: number;
}

export interface SubRegionalHoliday {
  name: string;
  date: string; // MM-DD format
  type: HolidayType;
  subRegions: SubRegionCode[];
  description?: string;
  substituteRule?: 'none' | 'monday-only' | 'nearest-weekday';
}

// ============================================================================
// School Term Types
// ============================================================================

export interface SchoolTerm {
  name: string; // e.g., "Term 1", "Autumn Term"
  startDate: string; // MM-DD format
  endDate: string; // MM-DD format
}

export interface SchoolHoliday {
  name: string; // e.g., "Summer Holidays", "Spring Break"
  startDate: string; // MM-DD format
  endDate: string; // MM-DD format
  regions: SubRegionCode[];
}

export interface SchoolCalendar {
  year: number;
  terms: SchoolTerm[];
  holidays: SchoolHoliday[];
  firstDay: string; // MM-DD
  lastDay: string; // MM-DD
}

// ============================================================================
// Country-Level Public Holidays (2025-2026)
// ============================================================================

export const COMPREHENSIVE_HOLIDAYS: ComprehensiveHoliday[] = [
  // ==========================================================================
  // AUSTRALIA - National Holidays
  // ==========================================================================
  { name: "New Year's Day", date: '01-01', type: 'public', regions: ['AU'], substituteRule: 'monday-only' },
  { name: 'Australia Day', date: '01-26', type: 'public', regions: ['AU'], substituteRule: 'monday-only', description: 'Also known as Invasion Day or Survival Day' },
  // Good Friday - calculated dynamically
  // Easter Monday - calculated dynamically
  { name: 'Anzac Day', date: '04-25', type: 'public', regions: ['AU', 'NZ'], substituteRule: 'monday-only', description: 'Australian and New Zealand Army Corps remembrance' },
  { name: 'Christmas Day', date: '12-25', type: 'public', regions: ['AU'], substituteRule: 'nearest-weekday' },
  { name: 'Boxing Day', date: '12-26', type: 'public', regions: ['AU'], substituteRule: 'nearest-weekday' },
  
  // ==========================================================================
  // UNITED STATES - Federal Holidays
  // ==========================================================================
  { name: "New Year's Day", date: '01-01', type: 'public', regions: ['US'], substituteRule: 'nearest-weekday' },
  { name: 'Martin Luther King Jr. Day', date: '01-20', type: 'public', regions: ['US'], description: 'Third Monday in January', subRegions: ['US-AL', 'US-AZ', 'US-AR', 'US-CA', 'US-CO', 'US-CT', 'US-DE', 'US-FL', 'US-GA', 'US-ID', 'US-IL', 'US-IN', 'US-IA', 'US-KS', 'US-KY', 'US-LA', 'US-ME', 'US-MD', 'US-MA', 'US-MI', 'US-MN', 'US-MS', 'US-MO', 'US-MT', 'US-NE', 'US-NV', 'US-NH', 'US-NJ', 'US-NM', 'US-NY', 'US-NC', 'US-OH', 'US-OK', 'US-OR', 'US-PA', 'US-RI', 'US-SC', 'US-SD', 'US-TN', 'US-TX', 'US-UT', 'US-VT', 'US-VA', 'US-WA', 'US-WV', 'US-WI', 'US-WY', 'US-DC'] },
  // Note: MLK Day is federal but some states observe differently - using all states for simplicity
  { name: "Presidents' Day", date: '02-17', type: 'public', regions: ['US'], description: 'Third Monday in February' },
  { name: 'Memorial Day', date: '05-26', type: 'public', regions: ['US'], description: 'Last Monday in May' },
  { name: 'Juneteenth', date: '06-19', type: 'public', regions: ['US'], substituteRule: 'nearest-weekday', description: 'Federal holiday since 2021 - end of slavery commemoration' },
  { name: 'Independence Day', date: '07-04', type: 'public', regions: ['US'], substituteRule: 'nearest-weekday' },
  { name: 'Labor Day', date: '09-01', type: 'public', regions: ['US'], description: 'First Monday in September' },
  { name: 'Columbus Day', date: '10-13', type: 'public', regions: ['US'], description: 'Second Monday in October - observed in most states' },
  { name: 'Veterans Day', date: '11-11', type: 'public', regions: ['US'], substituteRule: 'nearest-weekday' },
  { name: 'Thanksgiving', date: '11-27', type: 'public', regions: ['US'], description: 'Fourth Thursday in November' },
  { name: 'Christmas Day', date: '12-25', type: 'public', regions: ['US'], substituteRule: 'nearest-weekday' },
  
  // ==========================================================================
  // UNITED KINGDOM - Bank Holidays
  // ==========================================================================
  { name: "New Year's Day", date: '01-01', type: 'public', regions: ['UK'], substituteRule: 'nearest-weekday' },
  // Good Friday - calculated dynamically
  // Easter Monday - calculated dynamically (not Scotland)
  { name: 'Early May Bank Holiday', date: '05-05', type: 'public', regions: ['UK'], description: 'First Monday in May' },
  { name: 'Spring Bank Holiday', date: '05-26', type: 'public', regions: ['UK'], description: 'Last Monday in May' },
  { name: 'Summer Bank Holiday', date: '08-25', type: 'public', regions: ['UK'], description: 'Last Monday in August (August 4 in Scotland)' },
  { name: 'Christmas Day', date: '12-25', type: 'public', regions: ['UK'], substituteRule: 'nearest-weekday' },
  { name: 'Boxing Day', date: '12-26', type: 'public', regions: ['UK'], substituteRule: 'nearest-weekday' },
  
  // ==========================================================================
  // CANADA - Statutory Holidays
  // ==========================================================================
  { name: "New Year's Day", date: '01-01', type: 'public', regions: ['CA'], substituteRule: 'nearest-weekday' },
  { name: 'Family Day', date: '02-17', type: 'public', regions: ['CA'], description: 'Third Monday in February - not all provinces' },
  { name: 'Good Friday', date: '04-18', type: 'public', regions: ['CA'] }, // Will be overridden by dynamic calculation
  { name: 'Victoria Day', date: '05-19', type: 'public', regions: ['CA'], description: 'Monday before May 25' },
  { name: 'Canada Day', date: '07-01', type: 'public', regions: ['CA'], substituteRule: 'nearest-weekday' },
  { name: 'Civic Holiday', date: '08-04', type: 'public', regions: ['CA'], description: 'First Monday in August - not statutory everywhere' },
  { name: 'Labour Day', date: '09-01', type: 'public', regions: ['CA'], description: 'First Monday in September' },
  { name: 'Thanksgiving', date: '10-13', type: 'public', regions: ['CA'], description: 'Second Monday in October' },
  { name: 'Remembrance Day', date: '11-11', type: 'public', regions: ['CA'], description: 'Statutory in some provinces/territories' },
  { name: 'Christmas Day', date: '12-25', type: 'public', regions: ['CA'], substituteRule: 'nearest-weekday' },
  { name: 'Boxing Day', date: '12-26', type: 'public', regions: ['CA'], substituteRule: 'nearest-weekday' },
  
  // ==========================================================================
  // NEW ZEALAND - Public Holidays
  // ==========================================================================
  { name: "New Year's Day", date: '01-01', type: 'public', regions: ['NZ'], substituteRule: 'nearest-weekday' },
  { name: 'Day after New Year\'s Day', date: '01-02', type: 'public', regions: ['NZ'], substituteRule: 'nearest-weekday' },
  { name: 'Waitangi Day', date: '02-06', type: 'public', regions: ['NZ'], substituteRule: 'monday-only', description: 'Treaty of Waitangi signed 1840' },
  { name: 'Anzac Day', date: '04-25', type: 'public', regions: ['NZ'], substituteRule: 'monday-only' },
  { name: "King's Birthday", date: '06-02', type: 'public', regions: ['NZ'], description: 'First Monday in June' },
  { name: 'Matariki', date: '06-20', type: 'public', regions: ['NZ'], description: 'Māori New Year - date varies by lunar calendar' },
  { name: 'Labour Day', date: '10-27', type: 'public', regions: ['NZ'], description: 'Fourth Monday in October' },
  { name: 'Christmas Day', date: '12-25', type: 'public', regions: ['NZ'], substituteRule: 'nearest-weekday' },
  { name: 'Boxing Day', date: '12-26', type: 'public', regions: ['NZ'], substituteRule: 'nearest-weekday' },
  
  // ==========================================================================
  // IRELAND - Public Holidays
  // ==========================================================================
  { name: "New Year's Day", date: '01-01', type: 'public', regions: ['IE'], substituteRule: 'nearest-weekday' },
  { name: "St. Brigid's Day", date: '02-03', type: 'public', regions: ['IE'], description: 'First Monday in February (new for 2023)' },
  { name: "St. Patrick's Day", date: '03-17', type: 'public', regions: ['IE'], substituteRule: 'nearest-weekday' },
  // Easter Monday - calculated dynamically
  { name: 'May Day', date: '05-05', type: 'public', regions: ['IE'], description: 'First Monday in May' },
  { name: 'June Bank Holiday', date: '06-02', type: 'public', regions: ['IE'], description: 'First Monday in June' },
  { name: 'August Bank Holiday', date: '08-04', type: 'public', regions: ['IE'], description: 'First Monday in August' },
  { name: 'October Bank Holiday', date: '10-27', type: 'public', regions: ['IE'], description: 'Last Monday in October' },
  { name: 'Christmas Day', date: '12-25', type: 'public', regions: ['IE'], substituteRule: 'nearest-weekday' },
  { name: "St. Stephen's Day", date: '12-26', type: 'public', regions: ['IE'], substituteRule: 'nearest-weekday' },
  
  // ==========================================================================
  // SOUTH AFRICA - Public Holidays
  // ==========================================================================
  { name: "New Year's Day", date: '01-01', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday' },
  { name: 'Human Rights Day', date: '03-21', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday' },
  { name: 'Good Friday', date: '04-18', type: 'public', regions: ['ZA'] }, // Overridden by dynamic
  { name: 'Family Day', date: '04-21', type: 'public', regions: ['ZA'], description: 'Easter Monday' }, // Overridden by dynamic
  { name: 'Freedom Day', date: '04-27', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday', description: 'First democratic elections 1994' },
  { name: 'Workers Day', date: '05-01', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday' },
  { name: 'Youth Day', date: '06-16', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday', description: 'Soweto Uprising 1976' },
  { name: "National Women's Day", date: '08-09', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday' },
  { name: 'Heritage Day', date: '09-24', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday' },
  { name: 'Day of Reconciliation', date: '12-16', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday' },
  { name: 'Christmas Day', date: '12-25', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday' },
  { name: 'Day of Goodwill', date: '12-26', type: 'public', regions: ['ZA'], substituteRule: 'nearest-weekday' },
  
  // ==========================================================================
  // INDIA - National Holidays
  // ==========================================================================
  { name: 'Republic Day', date: '01-26', type: 'public', regions: ['IN'], description: 'Constitution of India came into effect 1950' },
  { name: 'Independence Day', date: '08-15', type: 'public', regions: ['IN'], description: 'Independence from British rule 1947' },
  { name: 'Gandhi Jayanti', date: '10-02', type: 'public', regions: ['IN'], description: 'Mahatma Gandhi\'s birthday' },
  // Many more state-specific holidays - added in sub-regional section
  
  // ==========================================================================
  // SINGAPORE - Public Holidays
  // ==========================================================================
  { name: "New Year's Day", date: '01-01', type: 'public', regions: ['SG'] },
  { name: 'Chinese New Year', date: '01-29', type: 'public', regions: ['SG'], description: 'Dates vary by lunar calendar' },
  { name: 'Good Friday', date: '04-18', type: 'public', regions: ['SG'] }, // Overridden by dynamic
  { name: 'Labour Day', date: '05-01', type: 'public', regions: ['SG'] },
  { name: 'Hari Raya Puasa', date: '03-31', type: 'public', regions: ['SG'], description: 'Eid al-Fitr - dates vary by lunar observation' },
  { name: 'Vesak Day', date: '05-12', type: 'public', regions: ['SG'], description: 'Buddha\'s birthday - dates vary' },
  { name: 'Hari Raya Haji', date: '06-06', type: 'public', regions: ['SG'], description: 'Eid al-Adha - dates vary by lunar observation' },
  { name: 'National Day', date: '08-09', type: 'public', regions: ['SG'] },
  { name: 'Deepavali', date: '11-12', type: 'public', regions: ['SG'], description: 'Diwali - dates vary by Hindu calendar' },
  { name: 'Christmas Day', date: '12-25', type: 'public', regions: ['SG'] },
  
  // ==========================================================================
  // COMMON OBSERVANCES (All regions)
  // ==========================================================================
  { name: "Valentine's Day", date: '02-14', type: 'observance', regions: ['ALL'] },
  { name: 'Earth Day', date: '04-22', type: 'observance', regions: ['ALL'] },
  { name: "Mother's Day", date: '05-11', type: 'observance', regions: ['ALL'], description: 'Second Sunday in May' },
  { name: "Father's Day", date: '06-15', type: 'observance', regions: ['ALL'], description: 'Third Sunday in June' },
  { name: 'Halloween', date: '10-31', type: 'observance', regions: ['ALL'] },
  { name: "New Year's Eve", date: '12-31', type: 'observance', regions: ['ALL'] },
];

// ============================================================================
// Sub-Regional Holidays (States/Provinces)
// ============================================================================

export const SUB_REGIONAL_HOLIDAYS: SubRegionalHoliday[] = [
  // ==========================================================================
  // AUSTRALIA - State/Territory Holidays
  // ==========================================================================
  
  // Australian Capital Territory
  { name: 'Canberra Day', date: '03-10', type: 'public', subRegions: ['AU-ACT'], description: 'Second Monday in March' },
  { name: 'Reconciliation Day', date: '06-02', type: 'public', subRegions: ['AU-ACT'], description: 'Monday on or after May 27' },
  { name: "King's Birthday", date: '06-09', type: 'public', subRegions: ['AU-ACT', 'AU-NSW', 'AU-SA', 'AU-TAS', 'AU-VIC'], description: 'Second Monday in June' },
  { name: 'Labour Day', date: '10-06', type: 'public', subRegions: ['AU-ACT', 'AU-NSW', 'AU-SA'], description: 'First Monday in October' },
  
  // New South Wales
  { name: 'Bank Holiday', date: '08-04', type: 'public', subRegions: ['AU-NSW'], description: 'First Monday in August - banks only' },
  
  // Northern Territory
  { name: 'May Day', date: '05-05', type: 'public', subRegions: ['AU-NT'], description: 'First Monday in May' },
  { name: "King's Birthday", date: '06-09', type: 'public', subRegions: ['AU-NT'], description: 'Second Monday in June' },
  { name: 'Picnic Day', date: '08-04', type: 'public', subRegions: ['AU-NT'], description: 'First Monday in August' },
  { name: 'Christmas Eve', date: '12-24', type: 'observance', subRegions: ['AU-NT', 'AU-SA'], description: 'Part-day public holiday from 7pm' },
  { name: "New Year's Eve", date: '12-31', type: 'observance', subRegions: ['AU-NT', 'AU-SA'], description: 'Part-day public holiday from 7pm' },
  
  // Queensland
  { name: 'Labour Day', date: '05-05', type: 'public', subRegions: ['AU-QLD'], description: 'First Monday in May' },
  { name: 'Royal Queensland Show', date: '08-13', type: 'public', subRegions: ['AU-QLD'], description: 'Ekka Wednesday - Brisbane area only' },
  { name: "King's Birthday", date: '10-06', type: 'public', subRegions: ['AU-QLD'], description: 'First Monday in October' },
  { name: 'Christmas Eve', date: '12-24', type: 'observance', subRegions: ['AU-QLD'], description: 'Part-day public holiday from 6pm' },
  
  // South Australia
  { name: 'Adelaide Cup Day', date: '03-10', type: 'public', subRegions: ['AU-SA'], description: 'Second Monday in March' },
  
  // Tasmania
  { name: 'Royal Hobart Regatta', date: '02-09', type: 'public', subRegions: ['AU-TAS'], description: 'Second Monday in February - southern Tasmania' },
  { name: 'Eight Hours Day', date: '03-10', type: 'public', subRegions: ['AU-TAS'], description: 'Second Monday in March' },
  { name: 'Recreation Day', date: '11-03', type: 'public', subRegions: ['AU-TAS'], description: 'First Monday in November - northern Tasmania' },
  
  // Victoria
  { name: 'Labour Day', date: '03-10', type: 'public', subRegions: ['AU-VIC'], description: 'Second Monday in March' },
  { name: 'Friday before AFL Grand Final', date: '09-26', type: 'public', subRegions: ['AU-VIC'], description: 'Date varies - typically late September' },
  { name: 'Melbourne Cup Day', date: '11-04', type: 'public', subRegions: ['AU-VIC'], description: 'First Tuesday in November - Melbourne metro' },
  
  // Western Australia
  { name: 'Labour Day', date: '03-03', type: 'public', subRegions: ['AU-WA'], description: 'First Monday in March' },
  { name: 'Western Australia Day', date: '06-02', type: 'public', subRegions: ['AU-WA'], description: 'First Monday in June - formerly Foundation Day' },
  { name: "King's Birthday", date: '09-29', type: 'public', subRegions: ['AU-WA'], description: 'Last Monday in September (or separate regional dates)' },
  
  // ==========================================================================
  // UNITED STATES - State Holidays (selection of notable ones)
  // ==========================================================================
  // Note: Most US states observe the federal holidays. Additional state-specific:
  
  { name: 'Confederate Memorial Day', date: '04-28', type: 'observance', subRegions: ['US-AL', 'US-MS'], description: 'Fourth Monday in April' },
  { name: 'Patriots Day', date: '04-21', type: 'public', subRegions: ['US-MA', 'US-ME'], description: 'Third Monday in April' },
  { name: 'Election Day', date: '11-04', type: 'observance', subRegions: ['US-DE', 'US-HI', 'US-IL', 'US-IN', 'US-MT', 'US-NJ', 'US-NY', 'US-PA', 'US-RI', 'US-WV'], description: 'First Tuesday after first Monday in November' },
  { name: 'Day after Thanksgiving', date: '11-28', type: 'public', subRegions: ['US-DE', 'US-NC', 'US-OK', 'US-PA', 'US-TX', 'US-WV'], description: 'Black Friday' },
  { name: 'Christmas Eve', date: '12-24', type: 'public', subRegions: ['US-KY', 'US-MI', 'US-NC', 'US-OK', 'US-SC', 'US-TX', 'US-VA', 'US-WI'], description: 'State holiday in some states' },
  { name: "New Year's Eve", date: '12-31', type: 'public', subRegions: ['US-KY', 'US-MI', 'US-WV'], description: 'State holiday in some states' },
  
  // ==========================================================================
  // CANADA - Provincial/Territorial Holidays
  // ==========================================================================
  { name: 'Family Day', date: '02-17', type: 'public', subRegions: ['CA-AB', 'CA-BC', 'CA-MB', 'CA-NB', 'CA-ON', 'CA-PE', 'CA-SK'], description: 'Third Monday in February' },
  { name: 'Louis Riel Day', date: '02-17', type: 'public', subRegions: ['CA-MB'], description: 'Third Monday in February' },
  { name: 'Islander Day', date: '02-17', type: 'public', subRegions: ['CA-PE'], description: 'Third Monday in February' },
  { name: 'Heritage Day', date: '02-17', type: 'public', subRegions: ['CA-NS'], description: 'Third Monday in February' },
  { name: 'St. Patrick\'s Day', date: '03-17', type: 'public', subRegions: ['CA-NL'], description: 'Nearest Monday if on weekend' },
  { name: 'St. George\'s Day', date: '04-21', type: 'public', subRegions: ['CA-NL'], description: 'Nearest Monday if on weekend' },
  { name: 'National Patriots Day', date: '05-19', type: 'public', subRegions: ['CA-QC'], description: 'Monday before May 25' },
  { name: 'Aboriginal Day', date: '06-21', type: 'public', subRegions: ['CA-NT'], description: 'June 21' },
  { name: 'Nunavut Day', date: '07-09', type: 'public', subRegions: ['CA-NU'], description: 'July 9' },
  { name: 'Civic Holiday', date: '08-04', type: 'public', subRegions: ['CA-AB', 'CA-BC', 'CA-MB', 'CA-NB', 'CA-NL', 'CA-NT', 'CA-NS', 'CA-NU', 'CA-ON', 'CA-PE', 'CA-SK'], description: 'First Monday in August' },
  { name: 'Discovery Day', date: '08-18', type: 'public', subRegions: ['CA-YT'], description: 'Third Monday in August' },
  
  // ==========================================================================
  // UNITED KINGDOM - Nation-Specific Holidays
  // ==========================================================================
  { name: '2nd January', date: '01-02', type: 'public', subRegions: ['UK-SCT'] },
  { name: 'St. Patrick\'s Day', date: '03-17', type: 'public', subRegions: ['UK-NIR'] },
  { name: 'Battle of the Boyne', date: '07-12', type: 'public', subRegions: ['UK-NIR'], description: 'Orangemen\'s Day' },
  { name: 'St. Andrew\'s Day', date: '11-30', type: 'public', subRegions: ['UK-SCT'] },
  
  // ==========================================================================
  // NEW ZEALAND - Regional Anniversary Days (simplified to main centres)
  // ==========================================================================
  { name: 'Auckland Anniversary', date: '01-27', type: 'public', subRegions: ['NZ-AUK'], description: 'Monday nearest January 29' },
  { name: 'Wellington Anniversary', date: '01-20', type: 'public', subRegions: ['NZ-WGN'], description: 'Monday nearest January 22' },
  { name: 'Canterbury Anniversary', date: '11-14', type: 'public', subRegions: ['NZ-CHC'], description: 'Second Friday after first Tuesday in November' },
  { name: 'Otago Anniversary', date: '03-23', type: 'public', subRegions: ['NZ-DUD'], description: 'Monday nearest March 23' },
  
  // ==========================================================================
  // SOUTH AFRICA - Provincial holidays (limited)
  // ==========================================================================
  // Most SA holidays are national. Some provinces have local observances.
  
  // ==========================================================================
  // INDIA - State-Specific Holidays (major ones only)
  // ==========================================================================
  { name: 'Holi', date: '03-14', type: 'religious', subRegions: ['IN-DL', 'IN-MH', 'IN-UP', 'IN-RJ', 'IN-GJ', 'IN-WB', 'IN-KA'], description: 'Festival of Colours - dates vary' },
  { name: 'Diwali', date: '11-12', type: 'religious', subRegions: ['IN-DL', 'IN-MH', 'IN-UP', 'IN-RJ', 'IN-GJ', 'IN-WB', 'IN-KA', 'IN-TN'], description: 'Festival of Lights - dates vary by lunar calendar' },
  { name: 'Durga Puja', date: '10-11', type: 'religious', subRegions: ['IN-WB'], description: 'Major in West Bengal' },
  { name: 'Onam', date: '09-05', type: 'religious', subRegions: ['IN-KL'], description: 'Kerala harvest festival' },
  { name: 'Pongal', date: '01-14', type: 'religious', subRegions: ['IN-TN'], description: 'Tamil harvest festival' },
  { name: 'Baisakhi', date: '04-14', type: 'religious', subRegions: ['IN-PB'], description: 'Punjab harvest festival' },
];

// ============================================================================
// School Term Data (2025-2026)
// ============================================================================

export const SCHOOL_CALENDARS_2025: Record<string, SchoolCalendar> = {
  // Australian School Terms
  'AU-NSW': {
    year: 2025,
    firstDay: '01-28',
    lastDay: '12-19',
    terms: [
      { name: 'Term 1', startDate: '01-28', endDate: '04-11' },
      { name: 'Term 2', startDate: '04-29', endDate: '07-04' },
      { name: 'Term 3', startDate: '07-22', endDate: '09-26' },
      { name: 'Term 4', startDate: '10-14', endDate: '12-19' },
    ],
    holidays: [
      { name: 'Summer Holidays', startDate: '12-20', endDate: '01-27', regions: ['AU-NSW'] },
      { name: 'Autumn Holidays', startDate: '04-12', endDate: '04-28', regions: ['AU-NSW'] },
      { name: 'Winter Holidays', startDate: '07-05', endDate: '07-21', regions: ['AU-NSW'] },
      { name: 'Spring Holidays', startDate: '09-27', endDate: '10-13', regions: ['AU-NSW'] },
    ]
  },
  'AU-VIC': {
    year: 2025,
    firstDay: '01-28',
    lastDay: '12-19',
    terms: [
      { name: 'Term 1', startDate: '01-28', endDate: '04-04' },
      { name: 'Term 2', startDate: '04-22', endDate: '07-04' },
      { name: 'Term 3', startDate: '07-21', endDate: '09-19' },
      { name: 'Term 4', startDate: '10-06', endDate: '12-19' },
    ],
    holidays: [
      { name: 'Summer Holidays', startDate: '12-20', endDate: '01-27', regions: ['AU-VIC'] },
      { name: 'Autumn Holidays', startDate: '04-05', endDate: '04-21', regions: ['AU-VIC'] },
      { name: 'Winter Holidays', startDate: '07-05', endDate: '07-20', regions: ['AU-VIC'] },
      { name: 'Spring Holidays', startDate: '09-20', endDate: '10-05', regions: ['AU-VIC'] },
    ]
  },
  'AU-QLD': {
    year: 2025,
    firstDay: '01-28',
    lastDay: '12-12',
    terms: [
      { name: 'Term 1', startDate: '01-28', endDate: '04-04' },
      { name: 'Term 2', startDate: '04-22', endDate: '06-27' },
      { name: 'Term 3', startDate: '07-14', endDate: '09-19' },
      { name: 'Term 4', startDate: '10-07', endDate: '12-12' },
    ],
    holidays: [
      { name: 'Summer Holidays', startDate: '12-13', endDate: '01-27', regions: ['AU-QLD'] },
      { name: 'Autumn Holidays', startDate: '04-05', endDate: '04-21', regions: ['AU-QLD'] },
      { name: 'Winter Holidays', startDate: '06-28', endDate: '07-13', regions: ['AU-QLD'] },
      { name: 'Spring Holidays', startDate: '09-20', endDate: '10-06', regions: ['AU-QLD'] },
    ]
  },
  'AU-WA': {
    year: 2025,
    firstDay: '02-05',
    lastDay: '12-12',
    terms: [
      { name: 'Term 1', startDate: '02-05', endDate: '04-11' },
      { name: 'Term 2', startDate: '04-29', endDate: '07-04' },
      { name: 'Term 3', startDate: '07-21', endDate: '09-26' },
      { name: 'Term 4', startDate: '10-14', endDate: '12-12' },
    ],
    holidays: [
      { name: 'Summer Holidays', startDate: '12-13', endDate: '02-04', regions: ['AU-WA'] },
      { name: 'Autumn Holidays', startDate: '04-12', endDate: '04-28', regions: ['AU-WA'] },
      { name: 'Winter Holidays', startDate: '07-05', endDate: '07-20', regions: ['AU-WA'] },
      { name: 'Spring Holidays', startDate: '09-27', endDate: '10-13', regions: ['AU-WA'] },
    ]
  },
  'AU-SA': {
    year: 2025,
    firstDay: '01-28',
    lastDay: '12-12',
    terms: [
      { name: 'Term 1', startDate: '01-28', endDate: '04-11' },
      { name: 'Term 2', startDate: '04-28', endDate: '07-04' },
      { name: 'Term 3', startDate: '07-21', endDate: '09-26' },
      { name: 'Term 4', startDate: '10-13', endDate: '12-12' },
    ],
    holidays: [
      { name: 'Summer Holidays', startDate: '12-13', endDate: '01-27', regions: ['AU-SA'] },
      { name: 'Autumn Holidays', startDate: '04-12', endDate: '04-27', regions: ['AU-SA'] },
      { name: 'Winter Holidays', startDate: '07-05', endDate: '07-20', regions: ['AU-SA'] },
      { name: 'Spring Holidays', startDate: '09-27', endDate: '10-12', regions: ['AU-SA'] },
    ]
  },
};

export const SCHOOL_CALENDARS_2026: Record<string, SchoolCalendar> = {
  // Australian School Terms 2026
  'AU-NSW': {
    year: 2026,
    firstDay: '01-27',
    lastDay: '12-18',
    terms: [
      { name: 'Term 1', startDate: '01-27', endDate: '04-09' },
      { name: 'Term 2', startDate: '04-27', endDate: '07-03' },
      { name: 'Term 3', startDate: '07-20', endDate: '09-25' },
      { name: 'Term 4', startDate: '10-12', endDate: '12-18' },
    ],
    holidays: [
      { name: 'Summer Holidays', startDate: '12-19', endDate: '01-26', regions: ['AU-NSW'] },
      { name: 'Autumn Holidays', startDate: '04-10', endDate: '04-26', regions: ['AU-NSW'] },
      { name: 'Winter Holidays', startDate: '07-04', endDate: '07-19', regions: ['AU-NSW'] },
      { name: 'Spring Holidays', startDate: '09-26', endDate: '10-11', regions: ['AU-NSW'] },
    ]
  },
  'AU-VIC': {
    year: 2026,
    firstDay: '01-27',
    lastDay: '12-18',
    terms: [
      { name: 'Term 1', startDate: '01-27', endDate: '04-03' },
      { name: 'Term 2', startDate: '04-20', endDate: '06-26' },
      { name: 'Term 3', startDate: '07-13', endDate: '09-18' },
      { name: 'Term 4', startDate: '10-05', endDate: '12-18' },
    ],
    holidays: [
      { name: 'Summer Holidays', startDate: '12-19', endDate: '01-26', regions: ['AU-VIC'] },
      { name: 'Autumn Holidays', startDate: '04-04', endDate: '04-19', regions: ['AU-VIC'] },
      { name: 'Winter Holidays', startDate: '06-27', endDate: '07-12', regions: ['AU-VIC'] },
      { name: 'Spring Holidays', startDate: '09-19', endDate: '10-04', regions: ['AU-VIC'] },
    ]
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the substitute holiday date if a holiday falls on a weekend
 */
export function getSubstituteHoliday(date: Date, rule: 'none' | 'monday-only' | 'nearest-weekday'): Date | null {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  if (rule === 'none') return null;
  
  if (dayOfWeek === 0) { // Sunday
    const substitute = new Date(date);
    substitute.setDate(date.getDate() + 1); // Monday
    return substitute;
  }
  
  if (dayOfWeek === 6) { // Saturday
    if (rule === 'monday-only') {
      const substitute = new Date(date);
      substitute.setDate(date.getDate() + 2); // Monday
      return substitute;
    } else {
      // nearest-weekday: use Monday
      const substitute = new Date(date);
      substitute.setDate(date.getDate() + 2); // Monday
      return substitute;
    }
  }
  
  return null; // Not on weekend
}

/**
 * Check if a date falls within school holidays
 */
export function isSchoolHoliday(date: Date, subRegion: SubRegionCode): SchoolHoliday | null {
  const year = date.getFullYear();
  const calendars = year === 2025 ? SCHOOL_CALENDARS_2025 : SCHOOL_CALENDARS_2026;
  const calendar = calendars[subRegion];
  
  if (!calendar) return null;
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${month}-${day}`;
  
  for (const holiday of calendar.holidays) {
    if (holiday.startDate <= dateKey && dateKey <= holiday.endDate) {
      return holiday;
    }
  }
  
  return null;
}

/**
 * Check if a date is a school term day
 */
export function isSchoolTerm(date: Date, subRegion: SubRegionCode): boolean {
  const year = date.getFullYear();
  const calendars = year === 2025 ? SCHOOL_CALENDARS_2025 : SCHOOL_CALENDARS_2026;
  const calendar = calendars[subRegion];
  
  if (!calendar) return false;
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${month}-${day}`;
  
  // Check if within any term
  for (const term of calendar.terms) {
    if (term.startDate <= dateKey && dateKey <= term.endDate) {
      return true;
    }
  }
  
  return false;
}
