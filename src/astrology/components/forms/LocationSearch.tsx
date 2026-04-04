/**
 * LocationSearch - Autocomplete location with lat/lng lookup
 * Uses OpenStreetMap Nominatim API (free)
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

interface LocationSearchProps {
  onLocationSelect: (location: {
    name: string;
    latitude: number;
    longitude: number;
  }) => void;
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
    maxHeight: '250px',
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

export const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

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
      // OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`,
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
    const locationName = result.display_name.split(',')[0];
    const region = result.address?.state || result.address?.country || '';
    const fullName = region ? `${locationName}, ${region}` : locationName;

    onLocationSelect({
      name: fullName,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    });

    setQuery(fullName);
    setShowDropdown(false);
    setResults([]);
  };

  const formatLocationName = (result: LocationResult): string => {
    const parts = result.display_name.split(',');
    const city = parts[0]?.trim();
    const region = parts[parts.length - 2]?.trim() || parts[parts.length - 1]?.trim();
    return region ? `${city}, ${region}` : city;
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        placeholder="Start typing a city name..."
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
              key={index}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
