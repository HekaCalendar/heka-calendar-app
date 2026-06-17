/**
 * Weather Service
 * Provides current weather data for user location
 * Uses Open-Meteo (free, no API key required)
 * Auto-detects Celsius/Fahrenheit based on country conventions
 */

import type { LocationData } from '../types';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  condition: string;
  conditionIcon: string;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  updatedAt: Date;
  dailyMax: number;
  dailyMin: number;
  precipitation: number;
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dayLength: number; // minutes
  sunElevation: number; // degrees at solar noon
  dawn: Date; // civil twilight start
  dusk: Date; // civil twilight end
}

// Countries that use Fahrenheit
const FAHRENHEIT_COUNTRIES = ['US', 'BS', 'BZ', 'KY', 'PW', 'GU', 'VI'];

/**
 * Determine if location uses Fahrenheit
 */
export function usesFahrenheit(countryCode: string): boolean {
  return FAHRENHEIT_COUNTRIES.includes(countryCode);
}

/**
 * Format temperature with appropriate unit
 */
export function formatTemperature(celsius: number, countryCode: string): string {
  if (usesFahrenheit(countryCode)) {
    const fahrenheit = Math.round((celsius * 9/5) + 32);
    return `${fahrenheit}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Calculate sun times using astronomical algorithms
 * More accurate than simple approximations
 */
export function calculateSunTimes(date: Date, location: LocationData): SunTimes {
  const lat = location.latitude;
  const lon = location.longitude;
  const tzOffset = getTimezoneOffset(date, location.timezone);
  
  // Julian date at midnight UTC
  const jd = getJulianDate(date);
  
  // Solar position calculations
  const sunPos = getSunPosition(jd);
  
  // Calculate sunrise, sunset, solar noon
  const times = calculateRiseSetTransit(jd, lat, lon, sunPos);
  
  // Convert to local time
  const sunrise = utcToLocal(times.rise, tzOffset, date);
  const sunset = utcToLocal(times.set, tzOffset, date);
  const solarNoon = utcToLocal(times.transit, tzOffset, date);
  
  // Day length in minutes
  const dayLength = (times.set - times.rise) * 24 * 60;
  
  // Calculate sun elevation at solar noon
  const sunElevation = calculateMaxElevation(lat, sunPos.declination);
  
  // Twilight times (sun 6° below horizon)
  const twilightTimes = calculateTwilight(jd, lat, lon, sunPos, -6);
  
  return {
    sunrise,
    sunset,
    solarNoon,
    dayLength,
    sunElevation,
    dawn: utcToLocal(twilightTimes.rise, tzOffset, date),
    dusk: utcToLocal(twilightTimes.set, tzOffset, date),
  };
}

/**
 * Get weather data from Open-Meteo API
 * Free, no API key required, accurate global coverage
 */
export async function getWeatherData(location: LocationData): Promise<WeatherData | null> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(location.latitude));
    url.searchParams.set('longitude', String(location.longitude));
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure');
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_days', '1');

    const { fetchWithTimeout } = await import('../utils/fetchWithTimeout');
    const response = await fetchWithTimeout(url.toString(), { timeout: 10000 });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    return {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      condition: getWeatherCondition(current.weather_code),
      conditionIcon: getWeatherIcon(current.weather_code),
      windSpeed: current.wind_speed_10m,
      windDirection: degreesToDirection(current.wind_direction_10m || 0),
      pressure: current.surface_pressure,
      visibility: 10, // Open-Meteo doesn't provide visibility in free tier
      uvIndex: 0,
      updatedAt: new Date(),
      dailyMax: daily.temperature_2m_max[0],
      dailyMin: daily.temperature_2m_min[0],
      precipitation: daily.precipitation_sum[0],
    };
  } catch (error) {
    console.error('[WeatherService] Failed to fetch weather:', error);
    return null;
  }
}

// Helper functions
function getJulianDate(date: Date): number {
  const timestamp = date.getTime();
  return timestamp / 86400000 + 2440587.5;
}

function getSunPosition(jd: number): { longitude: number; declination: number; rightAscension: number } {
  const J2000 = 2451545.0;
  const n = jd - J2000;
  
  const DEG_TO_RAD = Math.PI / 180;
  const RAD_TO_DEG = 180 / Math.PI;
  
  const L = (280.46646 + 0.98564736629 * n) % 360;
  const M = (357.52911 + 0.9856002831 * n) % 360;
  const M_rad = M * DEG_TO_RAD;
  
  const C = (1.914602 - 0.004817 * (n / 36525)) * Math.sin(M_rad)
          + (0.019993 - 0.000101 * (n / 36525)) * Math.sin(2 * M_rad)
          + 0.000289 * Math.sin(3 * M_rad);
  
  const trueLongitude = (L + C) % 360;
  const obliquity = 23.439292 - 0.00000015 * (n / 36525) * (n / 36525);
  
  const tanRA = Math.cos(obliquity * DEG_TO_RAD) * Math.sin(trueLongitude * DEG_TO_RAD)
              / Math.cos(trueLongitude * DEG_TO_RAD);
  let rightAscension = Math.atan(tanRA) * RAD_TO_DEG;
  if (rightAscension < 0) rightAscension += 360;
  
  const sinDec = Math.sin(obliquity * DEG_TO_RAD) * Math.sin(trueLongitude * DEG_TO_RAD);
  const declination = Math.asin(sinDec) * RAD_TO_DEG;
  
  return { longitude: trueLongitude, declination, rightAscension };
}

function calculateRiseSetTransit(_jd: number, lat: number, lon: number, sunPos: { declination: number; rightAscension: number }): { rise: number; set: number; transit: number } {
  const DEG_TO_RAD = Math.PI / 180;
  
  // Convert latitude to radians
  const latRad = lat * DEG_TO_RAD;
  const decRad = sunPos.declination * DEG_TO_RAD;
  
  // Hour angle at sunrise/sunset (H0)
  // cos(H0) = -tan(lat) * tan(dec)
  const cosH0 = -Math.tan(latRad) * Math.tan(decRad);
  
  // If |cosH0| > 1, sun never rises or never sets (polar regions)
  let H0: number;
  if (cosH0 <= -1) {
    // Midnight sun - sun never sets
    return { rise: 0, set: 1, transit: 0.5 };
  } else if (cosH0 >= 1) {
    // Polar night - sun never rises
    return { rise: 0, set: 0, transit: 0.5 };
  } else {
    H0 = Math.acos(cosH0);
  }
  
  // Transit time (local apparent solar time)
  const transitLST = sunPos.rightAscension / 15; // Convert RA to hours
  
  // Sunrise and sunset in local sidereal time
  const riseLST = transitLST - H0 * 180 / Math.PI / 15;
  const setLST = transitLST + H0 * 180 / Math.PI / 15;
  
  // Convert to UTC (fraction of day, 0-1)
  // This is simplified - for precise calculations we'd need more terms
  const transitUTC = ((transitLST * 15 - lon) / 360 + 0.5) % 1;
  const riseUTC = ((riseLST * 15 - lon) / 360 + 0.5) % 1;
  const setUTC = ((setLST * 15 - lon) / 360 + 0.5) % 1;
  
  return { rise: riseUTC, set: setUTC, transit: transitUTC };
}

function calculateTwilight(_jd: number, lat: number, lon: number, sunPos: { declination: number; rightAscension: number }, elevation: number): { rise: number; set: number } {
  const DEG_TO_RAD = Math.PI / 180;
  const latRad = lat * DEG_TO_RAD;
  const decRad = sunPos.declination * DEG_TO_RAD;
  const elevRad = elevation * DEG_TO_RAD;
  
  // cos(H) = (sin(elevation) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec))
  const cosH = (Math.sin(elevRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  
  if (Math.abs(cosH) > 1) {
    return { rise: 0, set: 1 };
  }
  
  const H = Math.acos(cosH);
  const transitLST = sunPos.rightAscension / 15;
  const riseLST = transitLST - H * 180 / Math.PI / 15;
  const setLST = transitLST + H * 180 / Math.PI / 15;
  
  const riseUTC = ((riseLST * 15 - lon) / 360 + 0.5) % 1;
  const setUTC = ((setLST * 15 - lon) / 360 + 0.5) % 1;
  
  return { rise: riseUTC, set: setUTC };
}

function calculateMaxElevation(lat: number, declination: number): number {
  // Max elevation = 90 - |lat - declination|
  return 90 - Math.abs(lat - declination);
}

function getTimezoneOffset(date: Date, timezone: string): number {
  const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const local = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (local.getTime() - utc.getTime()) / (1000 * 60 * 60); // hours
}

function utcToLocal(utcFraction: number, tzOffset: number, baseDate: Date): Date {
  // utcFraction is the fraction of the UTC day (can be >1 or <0 for cross-day events)
  const ms = utcFraction * 24 * 60 * 60 * 1000;
  // Use UTC methods to ensure correct day regardless of browser timezone
  const utcDate = Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate());
  // Apply timezone offset so returned Date shows correct local time for the location
  const tzMs = tzOffset * 60 * 60 * 1000;
  return new Date(utcDate + ms + tzMs);
}

function degreesToDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/** Map Open-Meteo WMO weather codes to human-readable conditions */
function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Rime Fog',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    56: 'Freezing Drizzle',
    57: 'Heavy Freezing Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    66: 'Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers',
    81: 'Showers',
    82: 'Heavy Showers',
    85: 'Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm & Hail',
    99: 'Heavy Thunderstorm',
  };
  return conditions[code] || 'Unknown';
}

/** Map Open-Meteo WMO weather codes to emoji icons */
function getWeatherIcon(code: number): string {
  const icons: Record<number, string> = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌧️',
    56: '🌨️',
    57: '🌨️',
    61: '🌦️',
    63: '🌧️',
    65: '🌧️',
    66: '🌨️',
    67: '🌨️',
    71: '🌨️',
    73: '❄️',
    75: '❄️',
    77: '❄️',
    80: '🌦️',
    81: '🌧️',
    82: '🌧️',
    85: '🌨️',
    86: '🌨️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️',
  };
  return icons[code] || '🌡️';
}

// Export service
export const WeatherService = {
  calculateSunTimes,
  getWeatherData,
  formatTemperature,
  usesFahrenheit,
};

export default WeatherService;
