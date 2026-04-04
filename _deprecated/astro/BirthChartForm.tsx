/**
 * Birth Chart Form Component
 * Smart location picker with geocoding and GPS
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AstroProfile } from '../../types/astrology';

interface GeocodedLocation {
  name: string;
  lat: number;
  lng: number;
  timezone?: string;
}

interface BirthChartFormProps {
  onSubmit: (profile: Omit<AstroProfile, 'id' | 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  onCancel: () => void;
  existingProfile?: AstroProfile;
}

// Local cities database - defined outside component for stability
const LOCAL_CITIES: GeocodedLocation[] = [
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631, timezone: 'Australia/Melbourne' },
  { name: 'Brisbane, Australia', lat: -27.4698, lng: 153.0251, timezone: 'Australia/Brisbane' },
  { name: 'Perth, Australia', lat: -31.9505, lng: 115.8605, timezone: 'Australia/Perth' },
  { name: 'Adelaide, Australia', lat: -34.9285, lng: 138.6007, timezone: 'Australia/Adelaide' },
  { name: 'Canberra, Australia', lat: -35.2809, lng: 149.1300, timezone: 'Australia/Sydney' },
  { name: 'Darwin, Australia', lat: -12.4634, lng: 130.8456, timezone: 'Australia/Darwin' },
  { name: 'Hobart, Australia', lat: -42.8821, lng: 147.3272, timezone: 'Australia/Hobart' },
  { name: 'Bankstown, Australia', lat: -33.9173, lng: 151.0354, timezone: 'Australia/Sydney' },
  { name: 'Parramatta, Australia', lat: -33.8131, lng: 151.0030, timezone: 'Australia/Sydney' },
  { name: 'Newcastle, Australia', lat: -32.9283, lng: 151.7817, timezone: 'Australia/Sydney' },
  { name: 'Wollongong, Australia', lat: -34.4248, lng: 150.8931, timezone: 'Australia/Sydney' },
  { name: 'Gold Coast, Australia', lat: -28.0167, lng: 153.4000, timezone: 'Australia/Brisbane' },
  { name: 'Cairns, Australia', lat: -16.9186, lng: 145.7781, timezone: 'Australia/Brisbane' },
  { name: 'Townsville, Australia', lat: -19.2589, lng: 146.8169, timezone: 'Australia/Brisbane' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' },
  { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'Chicago, USA', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago' },
  { name: 'Houston, USA', lat: 29.7604, lng: -95.3698, timezone: 'America/Chicago' },
  { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Miami, USA', lat: 25.7617, lng: -80.1918, timezone: 'America/New_York' },
  { name: 'Seattle, USA', lat: 47.6062, lng: -122.3321, timezone: 'America/Los_Angeles' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { name: 'Manchester, UK', lat: 53.4808, lng: -2.2426, timezone: 'Europe/London' },
  { name: 'Edinburgh, UK', lat: 55.9533, lng: -3.1883, timezone: 'Europe/London' },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto' },
  { name: 'Vancouver, Canada', lat: 49.2827, lng: -123.1207, timezone: 'America/Vancouver' },
  { name: 'Montreal, Canada', lat: 45.5017, lng: -73.5673, timezone: 'America/Toronto' },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, timezone: 'Europe/Berlin' },
  { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, timezone: 'Europe/Rome' },
  { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, timezone: 'Europe/Madrid' },
  { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041, timezone: 'Europe/Amsterdam' },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, timezone: 'Asia/Hong_Kong' },
  { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Auckland, New Zealand', lat: -36.8485, lng: 174.7633, timezone: 'Pacific/Auckland' },
  { name: 'Wellington, New Zealand', lat: -41.2865, lng: 174.7762, timezone: 'Pacific/Auckland' },
  { name: 'Christchurch, New Zealand', lat: -43.5321, lng: 172.6362, timezone: 'Pacific/Auckland' },
];

// Simple timezone guess based on longitude
const guessTimezone = (lng: number): string => {
  const offset = Math.round(lng / 15);
  const offsets: Record<number, string> = {
    [-12]: 'Pacific/Auckland', [-11]: 'Pacific/Auckland', [-10]: 'Pacific/Honolulu',
    [-9]: 'America/Anchorage', [-8]: 'America/Los_Angeles', [-7]: 'America/Denver',
    [-6]: 'America/Chicago', [-5]: 'America/New_York', [-4]: 'America/Halifax',
    [-3]: 'America/Sao_Paulo', [0]: 'Europe/London', [1]: 'Europe/Paris',
    [2]: 'Europe/Berlin', [3]: 'Europe/Moscow', [4]: 'Asia/Dubai',
    [5]: 'Asia/Karachi', [6]: 'Asia/Dhaka', [7]: 'Asia/Bangkok',
    [8]: 'Asia/Singapore', [9]: 'Asia/Tokyo', [10]: 'Australia/Brisbane',
    [11]: 'Australia/Sydney', [12]: 'Pacific/Auckland'
  };
  return offsets[offset] || 'UTC';
};

export const BirthChartForm: React.FC<BirthChartFormProps> = ({
  onSubmit,
  onCancel,
  existingProfile,
}) => {
  const [formData, setFormData] = useState({
    name: existingProfile?.name || '',
    birthDate: existingProfile?.birthDate || '',
    birthTime: existingProfile?.birthTime || '',
    birthTimeUnknown: existingProfile?.birthTimeUnknown || false,
    locationName: existingProfile?.location.name || '',
    latitude: existingProfile?.location.latitude?.toString() || '',
    longitude: existingProfile?.location.longitude?.toString() || '',
    timezone: existingProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [manualMode, setManualMode] = useState(false);
  const [zodiacSystem, setZodiacSystem] = useState<'12-sign' | '13-sign'>('12-sign');
  const [houseSystem, setHouseSystem] = useState<string>('placidus');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter cities based on search query - instant, no debounce needed for local
  const filteredCities = useMemo(() => {
    if (searchQuery.length < 2) return [];
    
    return LOCAL_CITIES.filter(city => 
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);
  
  // Show dropdown when we have results
  useEffect(() => {
    if (filteredCities.length > 0 && searchQuery.length >= 2) {
      setSearchResults(filteredCities);
      setShowDropdown(true);
    } else if (searchQuery.length < 2) {
      setShowDropdown(false);
    }
  }, [filteredCities, searchQuery]);
  
  const handleLocationSelect = (location: GeocodedLocation) => {
    setFormData(prev => ({
      ...prev,
      locationName: location.name,
      latitude: location.lat.toFixed(4),
      longitude: location.lng.toFixed(4),
      timezone: location.timezone || guessTimezone(location.lng),
    }));
    setSearchQuery(location.name);
    setShowDropdown(false);
    setErrors(prev => ({ ...prev, location: '' }));
  };
  
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, location: 'Geolocation not supported' }));
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Try to reverse geocode
        let locationName = 'Current Location';
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
            {
              headers: {
                'User-Agent': 'HEKACalendar/2.0',
                'Accept': 'application/json',
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            locationName = data.display_name 
              ? data.display_name.split(',').slice(0, 2).join(',')
              : 'Current Location';
          }
        } catch {
          // Ignore reverse geocode errors
        }
        
        setFormData(prev => ({
          ...prev,
          locationName,
          latitude: latitude.toFixed(4),
          longitude: longitude.toFixed(4),
          timezone: guessTimezone(longitude),
        }));
        setSearchQuery(locationName);
        setIsGettingLocation(false);
        setErrors(prev => ({ ...prev, location: '' }));
      },
      (error) => {
        setErrors(prev => ({ 
          ...prev, 
          location: error.message === 'User denied Geolocation' 
            ? 'Location access denied. Please search manually.' 
            : 'Unable to get location. Please try again.' 
        }));
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }
    
    if (!formData.birthTimeUnknown && !formData.birthTime) {
      newErrors.birthTime = 'Birth time is required (or check "Unknown")';
    }
    
    if (!formData.locationName) {
      newErrors.location = 'Please search for and select a location';
    }
    
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Location coordinates are required. Please search for a location.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const profile: Omit<AstroProfile, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      birthDate: formData.birthDate,
      birthTime: formData.birthTimeUnknown ? '12:00' : formData.birthTime,
      birthTimeUnknown: formData.birthTimeUnknown,
      location: {
        name: formData.locationName,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      },
      timezone: formData.timezone,
      preferences: {
        zodiacSystem,
        houseSystem: houseSystem as 'placidus' | 'whole-sign' | 'equal' | 'koch',
        aspectSet: 'major-only',
        showArabianParts: false,
        showAsteroids: false,
        showDwarfPlanets: false,
      },
    };
    
    try {
      await onSubmit(profile);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="birth-chart-form-enhanced">
      <h3>🌟 Create Your Birth Chart</h3>
      <p className="form-subtitle">Discover your cosmic blueprint</p>
      
      {/* Name */}
      <div className="form-group-enhanced">
        <label>Your Name *</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          placeholder="Enter your full name"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>
      
      {/* Birth Date & Time Row */}
      <div className="form-row-enhanced">
        <div className="form-group-enhanced">
          <label>Birth Date *</label>
          <input 
            type="date" 
            value={formData.birthDate}
            onChange={(e) => {
              setFormData({ ...formData, birthDate: e.target.value });
              if (errors.birthDate) setErrors({ ...errors, birthDate: '' });
            }}
            className={errors.birthDate ? 'error' : ''}
          />
          {errors.birthDate && <span className="error-text">{errors.birthDate}</span>}
        </div>
        
        <div className="form-group-enhanced">
          <label>Birth Time {formData.birthTimeUnknown && <span>(Using Noon)</span>}</label>
          <input 
            type="time" 
            value={formData.birthTime}
            onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
            disabled={formData.birthTimeUnknown}
            className={errors.birthTime ? 'error' : ''}
          />
          {errors.birthTime && <span className="error-text">{errors.birthTime}</span>}
        </div>
      </div>
      
      {/* Time Unknown Checkbox */}
      <div className="form-group-enhanced checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.birthTimeUnknown}
            onChange={(e) => setFormData({ 
              ...formData, 
              birthTimeUnknown: e.target.checked,
              birthTime: e.target.checked ? '' : formData.birthTime
            })}
          />
          <span>Birth time unknown (chart will use 12:00 PM)</span>
        </label>
      </div>
      
      {/* Location Search - PRIMARY METHOD */}
      <div className="form-group-enhanced location-group">
        <label>
          Birth Location *
          <span className="label-hint">Type your city (e.g., "Bankstown")</span>
        </label>
        
        <div className="location-input-wrapper">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === '') {
                setFormData({ 
                  ...formData, 
                  locationName: '', 
                  latitude: '', 
                  longitude: '' 
                });
              }
            }}
            placeholder="Start typing your city..."
            className={errors.location ? 'error' : ''}
            autoComplete="off"
          />
          <button 
            type="button" 
            className="gps-button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            title="Use my current location"
          >
            {isGettingLocation ? '📡' : '📍'}
          </button>
        </div>
        
        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="city-dropdown">
            {searchResults.map((location, idx) => (
              <button
                key={idx}
                type="button"
                className="city-option"
                onClick={() => handleLocationSelect(location)}
              >
                <span className="city-name">{location.name}</span>
              </button>
            ))}
          </div>
        )}
        
        {showDropdown && searchResults.length === 0 && searchQuery.length >= 2 && (
          <div className="city-dropdown">
            <div className="dropdown-no-results">No cities found. Try a different search.</div>
          </div>
        )}
        
        {errors.location && <span className="error-text">{errors.location}</span>}
      </div>
      
      {/* Auto-filled Coordinates Display */}
      {(formData.latitude || formData.longitude) && (
        <div className="coordinates-display auto-filled">
          <div className="coord-item">
            <span className="coord-label">Latitude</span>
            <span className="coord-value">{parseFloat(formData.latitude).toFixed(4)}°</span>
          </div>
          <div className="coord-item">
            <span className="coord-label">Longitude</span>
            <span className="coord-value">{parseFloat(formData.longitude).toFixed(4)}°</span>
          </div>
          <div className="coord-item">
            <span className="coord-label">Timezone</span>
            <span className="coord-value">{formData.timezone}</span>
          </div>
        </div>
      )}
      
      {/* Manual Coordinates Toggle (for edge cases) */}
      <div className="manual-coords-toggle">
        <button 
          type="button" 
          className="text-button"
          onClick={() => setManualMode(!manualMode)}
        >
          {manualMode ? 'Hide manual coordinates' : 'Enter coordinates manually'}
        </button>
      </div>
      
      {/* Manual Coordinates (Optional) */}
      {manualMode && (
        <div className="manual-coords-row">
          <div className="form-group-enhanced">
            <label>Latitude (optional)</label>
            <input 
              type="number"
              step="0.0001"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              placeholder="e.g., -33.8688"
            />
          </div>
          <div className="form-group-enhanced">
            <label>Longitude (optional)</label>
            <input 
              type="number"
              step="0.0001"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              placeholder="e.g., 151.2093"
            />
          </div>
        </div>
      )}
      
      {/* Zodiac & House System */}
      <div className="form-row-enhanced">
        <div className="form-group-enhanced">
          <label>Zodiac System</label>
          <select 
            value={zodiacSystem}
            onChange={(e) => setZodiacSystem(e.target.value as '12-sign' | '13-sign')}
          >
            <option value="12-sign">12 Signs (Traditional)</option>
            <option value="13-sign">13 Signs (With Ophiuchus ⛎)</option>
          </select>
          <span className="label-hint">
            {zodiacSystem === '13-sign' 
              ? 'Includes Ophiuchus (Nov 29 - Dec 17) with true astronomical boundaries' 
              : 'Traditional tropical zodiac (30° per sign)'}
          </span>
        </div>
        
        <div className="form-group-enhanced">
          <label>House System</label>
          <select 
            value={houseSystem}
            onChange={(e) => setHouseSystem(e.target.value)}
          >
            <option value="placidus">Placidus (Default)</option>
            <option value="whole-sign">Whole Sign</option>
            <option value="equal">Equal Houses</option>
            <option value="koch">Koch</option>
          </select>
        </div>
      </div>
      
      {/* Actions */}
      <div className="form-actions-enhanced">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? '⏳ Calculating...' : '✨ Calculate Birth Chart'}
        </button>
      </div>
    </form>
  );
};

export default BirthChartForm;
