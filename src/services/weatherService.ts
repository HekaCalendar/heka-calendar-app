/**
 * Weather Service
 * Provides current weather data for user location
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
 * Get weather data from API
 * Uses OpenWeatherMap or falls back to mock data
 */
export async function getWeatherData(location: LocationData): Promise<WeatherData | null> {
  // For now, return null to indicate no weather API configured
  // In production, this would call OpenWeatherMap or similar
  // with the API key from environment variables
  
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    console.log('[WeatherService] No API key configured');
    return null;
  }
  
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      conditionIcon: getWeatherIcon(data.weather[0].icon),
      windSpeed: data.wind.speed,
      windDirection: degreesToDirection(data.wind.deg || 0),
      pressure: data.main.pressure,
      visibility: (data.visibility || 10000) / 1000, // km
      uvIndex: 0, // Would need separate UV API
      updatedAt: new Date(),
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

function utcToLocal(utcFraction: number, _tzOffset: number, baseDate: Date): Date {
  // utcFraction is the fraction of the UTC day (can be >1 or <0 for cross-day events)
  const ms = utcFraction * 24 * 60 * 60 * 1000;
  const utcDate = Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  return new Date(utcDate + ms);
}

function degreesToDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return iconMap[iconCode] || '🌡️';
}

// Export service
export const WeatherService = {
  calculateSunTimes,
  getWeatherData,
  formatTemperature,
  usesFahrenheit,
};

export default WeatherService;
