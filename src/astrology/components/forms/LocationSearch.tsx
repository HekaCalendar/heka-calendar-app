/**
 * LocationSearch - Autocomplete location with lat/lng lookup
 * Uses OpenStreetMap Nominatim API (free) with country biasing
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface NominatimAddress {
  suburb?: string;
  town?: string;
  city?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
  country_code?: string;
  postcode?: string;
}

interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
  type?: string;
  class?: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: {
    name: string;
    latitude: number;
    longitude: number;
  }) => void;
  defaultValue?: string;
  onQueryChange?: (query: string) => void;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: '#0f0f11',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#f8f7f5',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    background: '#16161a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    maxHeight: '280px',
    overflowY: 'auto',
    zIndex: 100,
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
  },
  result: {
    padding: '12px',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: '14px',
  },
  resultHover: {
    background: 'rgba(212,175,55,0.1)',
  },
  resultName: {
    color: '#f8f7f5',
    marginBottom: '2px',
  },
  resultDetail: {
    color: '#71717a',
    fontSize: '12px',
  },
  loading: {
    padding: '12px',
    textAlign: 'center',
    color: '#71717a',
    fontSize: '14px',
  },
  error: {
    padding: '12px',
    color: '#ef4444',
    fontSize: '14px',
  },
};

/**
 * Map common IANA time zones to ISO country codes so we can bias
 * Nominatim results to the user's current country.
 */
function getCountryCodeFromTimeZone(): string | null {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const mapping: Record<string, string> = {
    'Australia/Sydney': 'au', 'Australia/Melbourne': 'au', 'Australia/Brisbane': 'au',
    'Australia/Perth': 'au', 'Australia/Adelaide': 'au', 'Australia/Darwin': 'au',
    'Australia/Hobart': 'au', 'Australia/Canberra': 'au', 'Australia/Currie': 'au',
    'Australia/Broken_Hill': 'au', 'Australia/Lord_Howe': 'au',
    'America/New_York': 'us', 'America/Chicago': 'us', 'America/Denver': 'us',
    'America/Los_Angeles': 'us', 'America/Phoenix': 'us', 'America/Anchorage': 'us',
    'Pacific/Honolulu': 'us', 'America/Detroit': 'us', 'America/Boise': 'us',
    'America/Indiana/Indianapolis': 'us', 'America/Kentucky/Louisville': 'us',
    'America/Toronto': 'ca', 'America/Vancouver': 'ca', 'America/Edmonton': 'ca',
    'America/Winnipeg': 'ca', 'America/Halifax': 'ca', 'America/St_Johns': 'ca',
    'America/Moncton': 'ca', 'America/Regina': 'ca', 'America/Swift_Current': 'ca',
    'America/Yellowknife': 'ca', 'America/Whitehorse': 'ca', 'America/Iqaluit': 'ca',
    'America/Dawson': 'ca', 'America/Creston': 'ca', 'America/Fort_Nelson': 'ca',
    'Europe/London': 'gb', 'Europe/Paris': 'fr', 'Europe/Berlin': 'de',
    'Europe/Madrid': 'es', 'Europe/Rome': 'it', 'Europe/Amsterdam': 'nl',
    'Europe/Dublin': 'ie', 'Europe/Lisbon': 'pt', 'Europe/Vienna': 'at',
    'Europe/Brussels': 'be', 'Europe/Zurich': 'ch', 'Europe/Stockholm': 'se',
    'Europe/Oslo': 'no', 'Europe/Copenhagen': 'dk', 'Europe/Helsinki': 'fi',
    'Europe/Warsaw': 'pl', 'Europe/Prague': 'cz', 'Europe/Budapest': 'hu',
    'Europe/Athens': 'gr', 'Europe/Bucharest': 'ro', 'Europe/Sofia': 'bg',
    'Asia/Tokyo': 'jp', 'Asia/Seoul': 'kr', 'Asia/Shanghai': 'cn',
    'Asia/Hong_Kong': 'hk', 'Asia/Singapore': 'sg', 'Asia/Kolkata': 'in',
    'Asia/Bangkok': 'th', 'Asia/Jakarta': 'id', 'Asia/Manila': 'ph',
    'Asia/Kuala_Lumpur': 'my', 'Asia/Ho_Chi_Minh': 'vn', 'Asia/Taipei': 'tw',
    'Pacific/Auckland': 'nz', 'Pacific/Chatham': 'nz', 'Pacific/Fiji': 'fj',
    'Pacific/Guam': 'gu',
  };

  if (mapping[tz]) return mapping[tz];

  // Fallback: try navigator.language (e.g. "en-AU" -> "au")
  const lang = (navigator.language || '').toLowerCase();
  const parts = lang.split('-');
  if (parts.length > 1) {
    const code = parts[parts.length - 1];
    if (code.length === 2) return code;
  }

  return null;
}

function extractLocality(address?: NominatimAddress): string {
  if (!address) return '';
  return address.suburb || address.town || address.village || address.municipality || address.city || '';
}

function extractRegion(address?: NominatimAddress): string {
  if (!address) return '';
  return address.state || address.county || '';
}

function formatLocationName(result: LocationResult): string {
  const locality = extractLocality(result.address);
  const region = extractRegion(result.address);
  const country = result.address?.country || '';

  const parts: string[] = [];
  if (locality) parts.push(locality);
  if (region) parts.push(region);
  if (country && country !== region) parts.push(country);

  return parts.join(', ') || result.display_name.split(',')[0]?.trim() || 'Unknown';
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect, defaultValue, onQueryChange }) => {
  const [query, setQuery] = useState(defaultValue || '');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const countryCode = useRef<string | null>(getCountryCodeFromTimeZone());

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search for locations
  const searchLocations = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cc = countryCode.current;
      const countryParam = cc ? `&countrycodes=${encodeURIComponent(cc)}` : '';

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=10&addressdetails=1&dedupe=1${countryParam}`,
        {
          headers: {
            'Accept-Language': 'en-US,en',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data: LocationResult[] = await response.json();
      setResults(data);
      setShowDropdown(data.length > 0);
    } catch (err) {
      setError('Unable to search locations. Please enter coordinates manually.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchLocations(query);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, searchLocations]);

  const handleSelect = (result: LocationResult) => {
    const locality = extractLocality(result.address);
    const region = extractRegion(result.address);
    const fullName = region ? `${locality || result.display_name.split(',')[0]?.trim()}, ${region}` : (locality || result.display_name.split(',')[0]?.trim());

    onLocationSelect({
      name: fullName,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    });

    setQuery(fullName);
    onQueryChange?.(fullName);
    setShowDropdown(false);
    setResults([]);
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onQueryChange?.(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        placeholder="Start typing a city or suburb..."
        style={styles.input}
        autoComplete="off"
      />

      {showDropdown && (
        <div style={styles.dropdown}>
          {loading && <div style={styles.loading}>Searching...</div>}
          
          {error && <div style={styles.error}>{error}</div>}
          
          {!loading && !error && results.length === 0 && query.length >= 2 && (
            <div style={styles.loading}>No results found</div>
          )}

          {results.map((result, index) => (
            <div
              key={result.place_id || index}
              style={{
                ...styles.result,
                ...(hoveredIndex === index ? styles.resultHover : {}),
                borderBottom: index === results.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
              }}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              <div style={styles.resultName}>{formatLocationName(result)}</div>
              <div style={styles.resultDetail}>
                {result.address?.country}
                {result.class && result.type && (
                  <span style={{ textTransform: 'capitalize', opacity: 0.7 }}>
                    {' '}· {result.type.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
