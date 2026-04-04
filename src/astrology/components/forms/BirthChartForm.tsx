/**
 * BirthChartForm - With Location Autocomplete
 */

import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import type { CreateProfileInput } from '../../types';
import { LocationSearch } from './LocationSearch';

interface BirthChartFormProps {
  onSubmit: (data: CreateProfileInput) => void;
  onCancel?: () => void;
  initialData?: Partial<CreateProfileInput>;
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#d4af37',
    marginBottom: '8px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#a1a1aa',
  },
  input: {
    padding: '10px 12px',
    background: '#0f0f11',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#f8f7f5',
    fontSize: '14px',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  select: {
    padding: '10px 12px',
    background: '#0f0f11',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#f8f7f5',
    fontSize: '14px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    width: '100%',
  },
  error: {
    fontSize: '12px',
    color: '#ef4444',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  coordsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '12px',
    background: 'rgba(212,175,55,0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(212,175,55,0.1)',
  },
  coordDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  coordLabel: {
    fontSize: '12px',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  coordValue: {
    fontSize: '16px',
    color: '#d4af37',
    fontFamily: 'JetBrains Mono, monospace',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  buttonPrimary: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #d4af37, #b8941f)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
  buttonSecondary: {
    flex: 1,
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#a1a1aa',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
  },
  locationNote: {
    fontSize: '12px',
    color: '#71717a',
    marginTop: '4px',
  },
};

export const BirthChartForm: React.FC<BirthChartFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthData?.birthDate || '');
  const [birthTime, setBirthTime] = useState(initialData?.birthData?.birthTime || '12:00');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');
  const [timezone] = useState(initialData?.birthData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  // Get global zodiac system preference
  const globalZodiacSystem = useSelector((state: RootState) => 
    state.calendar.astroPreferences?.zodiacSystem || '12-sign'
  );
  
  const [zodiacSystem, setZodiacSystem] = useState<'12-sign' | '13-sign'>(globalZodiacSystem);
  const [houseSystem, setHouseSystem] = useState<'placidus' | 'whole-sign' | 'equal'>('placidus');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [locationSet, setLocationSet] = useState(false);
  
  const handleLocationSelect = useCallback((location: {
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    setLocationName(location.name);
    setLatitude(location.latitude.toFixed(4));
    setLongitude(location.longitude.toFixed(4));
    setLocationSet(true);
    // Clear any location-related errors
    setErrors(prev => ({ ...prev, latitude: '', longitude: '' }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!birthDate) newErrors.birthDate = 'Birth date is required';
    if (!birthTime) newErrors.birthTime = 'Birth time is required';
    if (!latitude) newErrors.latitude = 'Please select a location';
    if (!longitude) newErrors.longitude = 'Please select a location';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, birthDate, birthTime, latitude, longitude]);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        birthData: {
          name: name.trim(),
          birthDate,
          birthTime,
          location: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            locationName: locationName || undefined
          },
          timezone
        },
        preferences: { zodiacSystem, houseSystem }
      });
    } finally {
      setIsLoading(false);
    }
  }, [name, birthDate, birthTime, latitude, longitude, locationName, timezone, zodiacSystem, houseSystem, onSubmit, validate]);
  
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Create Birth Chart</h2>
      
      <div style={styles.field}>
        <label style={styles.label}>Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          style={{...styles.input, ...(errors.name ? styles.inputError : {})}}
        />
        {errors.name && <span style={styles.error}>{errors.name}</span>}
      </div>
      
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Birth Date *</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={{...styles.input, ...(errors.birthDate ? styles.inputError : {})}}
          />
          {errors.birthDate && <span style={styles.error}>{errors.birthDate}</span>}
        </div>
        
        <div style={styles.field}>
          <label style={styles.label}>Birth Time *</label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            style={{...styles.input, ...(errors.birthTime ? styles.inputError : {})}}
          />
          {errors.birthTime && <span style={styles.error}>{errors.birthTime}</span>}
        </div>
      </div>
      
      <div style={styles.field}>
        <label style={styles.label}>Birth Location *</label>
        <LocationSearch onLocationSelect={handleLocationSelect} />
        <p style={styles.locationNote}>
          Start typing a city name (e.g. "Sydney", "London", "New York")
        </p>
        {(errors.latitude || errors.longitude) && (
          <span style={styles.error}>Please select a location from the dropdown</span>
        )}
      </div>
      
      {locationSet && (
        <div style={styles.coordsRow}>
          <div style={styles.coordDisplay}>
            <span style={styles.coordLabel}>Latitude</span>
            <span style={styles.coordValue}>{latitude}°</span>
          </div>
          <div style={styles.coordDisplay}>
            <span style={styles.coordLabel}>Longitude</span>
            <span style={styles.coordValue}>{longitude}°</span>
          </div>
        </div>
      )}
      
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Zodiac System</label>
          <select
            value={zodiacSystem}
            onChange={(e) => setZodiacSystem(e.target.value as '12-sign' | '13-sign')}
            style={styles.select}
          >
            <option value="12-sign">12 Signs (Traditional)</option>
            <option value="13-sign">13 Signs (Ophiuchus)</option>
          </select>
        </div>
        
        <div style={styles.field}>
          <label style={styles.label}>House System</label>
          <select
            value={houseSystem}
            onChange={(e) => setHouseSystem(e.target.value as 'placidus' | 'whole-sign' | 'equal')}
            style={styles.select}
          >
            <option value="placidus">Placidus</option>
            <option value="whole-sign">Whole Sign</option>
            <option value="equal">Equal</option>
          </select>
        </div>
      </div>
      
      <div style={styles.buttonRow}>
        {onCancel && (
          <button type="button" onClick={onCancel} style={styles.buttonSecondary}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={isLoading} style={styles.buttonPrimary}>
          {isLoading ? 'Creating...' : 'Create Chart'}
        </button>
      </div>
    </form>
  );
};

export default BirthChartForm;
