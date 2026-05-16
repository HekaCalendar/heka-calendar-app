/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BIRTH CHART INPUT COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Capture and calculate natal chart from birth data.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { BirthData, NatalChart, NatalPlanet } from '../../services/natal/natalChart';
import { 
  saveNatalChart, 
  calculateElementalBalance,
  calculateModalityBalance,
  getDignity,
} from '../../services/natal/natalChart';
import { profileManager } from '../../services/natal/profileManager';
import { calculateCurrentSky, calculateLocalHouses } from '../../services/calculations/swissCalculations';
import { birthDateTimeToUTC } from '../../services/swiss-ephemeris/engine';
import { getZodiacSystemPreference, getSignCountPreference } from '../../services/natal/zodiacHelpers';
import { LocationSearch } from '../forms/LocationSearch';
import { getSignFromLongitude, toDegree, getDegreeInSign } from '../../types';

interface BirthChartInputProps {
  onChartCalculated: (chart: NatalChart) => void;
  onCancel: () => void;
  existingChart?: NatalChart | null;
}

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  latitude: string;
  longitude: string;
  timezone: string;
  locationName: string;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.98) 0%, rgba(40, 30, 60, 0.98) 100%)',
    borderRadius: '20px',
    padding: '32px',
    color: '#fff',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '28px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 300,
    margin: '0 0 8px 0',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
    gap: '16px',
  },
  timezoneSelect: {
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  primaryButton: {
    flex: 1,
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  secondaryButton: {
    padding: '16px 24px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  privacyNote: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center' as const,
    marginTop: '8px',
    fontStyle: 'italic',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#fca5a5',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    borderLeft: '3px solid #ef4444',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    gap: '16px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(147, 51, 234, 0.3)',
    borderTopColor: '#9333ea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
  },
  resultCard: {
    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
    borderRadius: '16px',
    padding: '24px',
    marginTop: '20px',
    border: '1px solid rgba(147, 51, 234, 0.3)',
  },
  resultTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#e9d5ff',
    marginBottom: '16px',
    textAlign: 'center' as const,
  },
  planetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
  },
  planetCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '12px',
    textAlign: 'center' as const,
  },
  planetName: {
    fontSize: '0.8rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '4px',
  },
  planetSign: {
    fontSize: '1.1rem',
    fontWeight: 500,
    color: '#fbbf24',
  },
  planetDegree: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  elementBar: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
  },
  elementItem: {
    flex: 1,
    textAlign: 'center' as const,
  },
  elementLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  elementValue: {
    fontSize: '1.2rem',
    fontWeight: 600,
  },
};

// Planet symbols
const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '⛢', neptune: '♆', pluto: '♇',
};

// Element colors
const ELEMENT_COLORS: Record<string, string> = {
  fire: '#ef4444',
  earth: '#22c55e',
  air: '#3b82f6',
  water: '#8b5cf6',
};

// Timezone options
const TIMEZONES = [
  { value: 'UTC', label: 'timezones.UTC' },
  { value: 'America/New_York', label: 'timezones.ET' },
  { value: 'America/Chicago', label: 'timezones.CT' },
  { value: 'America/Denver', label: 'timezones.MT' },
  { value: 'America/Los_Angeles', label: 'timezones.PT' },
  { value: 'Europe/London', label: 'timezones.London' },
  { value: 'Europe/Paris', label: 'timezones.Paris' },
  { value: 'Europe/Berlin', label: 'timezones.Berlin' },
  { value: 'Asia/Tokyo', label: 'timezones.Tokyo' },
  { value: 'Asia/Shanghai', label: 'timezones.Shanghai' },
  { value: 'Asia/Dubai', label: 'timezones.Dubai' },
  { value: 'Australia/Sydney', label: 'timezones.Sydney' },
  { value: 'Australia/Melbourne', label: 'timezones.Melbourne' },
  { value: 'Pacific/Auckland', label: 'timezones.Auckland' },
];

export const BirthChartInput: React.FC<BirthChartInputProps> = ({
  onChartCalculated,
  onCancel,
  existingChart,
}) => {
  const { t } = useTranslation('celestial');
  const [formData, setFormData] = useState<FormData>({
    name: existingChart?.name || '',
    birthDate: existingChart?.birthData.date || '',
    birthTime: existingChart?.birthData.time || '',
    latitude: existingChart?.birthData.latitude.toString() || '',
    longitude: existingChart?.birthData.longitude.toString() || '',
    timezone: existingChart?.birthData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    locationName: existingChart?.birthData.locationName || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculatedChart, setCalculatedChart] = useState<NatalChart | null>(null);
  const [locationSet, setLocationSet] = useState(false);
  
  // Try to get user's location
  useEffect(() => {
    if (!formData.latitude && !formData.longitude && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
        },
        () => {
          // Silently fail - user can enter manually
        }
      );
    }
  }, []);
  
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };
  
  const handleLocationSelect = (location: { name: string; latitude: number; longitude: number }) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.latitude.toFixed(6),
      longitude: location.longitude.toFixed(6),
      locationName: location.name,
    }));
    setLocationSet(true);
    setError(null);
  };
  
  const calculateNatalPositions = async (birthData: BirthData): Promise<Record<string, NatalPlanet>> => {
    const date = birthDateTimeToUTC(birthData.date, birthData.time, birthData.timezone);
    
    // Validate date
    if (isNaN(date.getTime())) {
      throw new Error(t('birthInput.invalidDate'));
    }
    
    // Calculate positions using Swiss Ephemeris
    let skyData;
    try {
      skyData = await calculateCurrentSky(date);
    } catch (err) {
      console.error('[BirthChartInput] Swiss Ephemeris calculation error:', err);
      throw new Error(t('birthInput.calcFailed'));
    }
    
    if (!skyData || !skyData.positions) {
      throw new Error(t('birthInput.noPlanetaryData'));
    }
    
    const positions = skyData.positions;
    
    // Calculate houses
    let houses;
    try {
      houses = await calculateLocalHouses(date, birthData.latitude, birthData.longitude);
    } catch (err) {
      console.error('[BirthChartInput] House calculation error:', err);
      throw new Error(t('birthInput.houseCalcFailed'));
    }
    
    if (!houses || !houses.cusps) {
      throw new Error(t('birthInput.invalidHouseData'));
    }
    
    // Transform to NatalPlanet format with house placements
    const natalPlanets: Record<string, NatalPlanet> = {};
    
    Object.entries(positions).forEach(([planetId, position]) => {
      const house = getHouseFromLongitude(position.longitude, houses);
      natalPlanets[planetId] = {
        ...position,
        house,
        dignity: getDignity(planetId, position.sign),
      };
    });
    
    return natalPlanets;
  };
  
  const getHouseFromLongitude = (longitude: number, houses: any): number => {
    const cusps = houses.cusps;
    for (let i = 1; i <= 12; i++) {
      const houseStart = cusps[i];
      const houseEnd = cusps[(i % 12) + 1];
      
      if (houseStart > houseEnd) {
        if (longitude >= houseStart || longitude < houseEnd) return i;
      } else {
        if (longitude >= houseStart && longitude < houseEnd) return i;
      }
    }
    return 1;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate
    if (!formData.name.trim()) {
      setError(t('birthInput.pleaseEnterName'));
      return;
    }
    if (!formData.birthDate) {
      setError(t('birthInput.pleaseEnterDate'));
      return;
    }
    if (!formData.birthTime) {
      setError(t('birthInput.pleaseEnterTime'));
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError(t('birthInput.pleaseEnterCoords'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const birthData: BirthData = {
        date: formData.birthDate,
        time: formData.birthTime,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        timezone: formData.timezone,
        locationName: formData.locationName,
      };
      
      // Calculate natal positions
      const planets = await calculateNatalPositions(birthData);
      
      // Calculate houses with error handling
      const date = birthDateTimeToUTC(birthData.date, birthData.time, birthData.timezone);
      let houseData;
      try {
        houseData = await calculateLocalHouses(date, birthData.latitude, birthData.longitude);
      } catch (houseErr) {
        console.error('[BirthChartInput] House calculation error:', houseErr);
        throw new Error('Failed to calculate house positions. Please check your coordinates.');
      }
      
      if (!houseData || !houseData.cusps) {
        throw new Error(t('birthInput.invalidHouseData2'));
      }
      
      const houses = {
        type: 'placidus' as const,
        cusps: houseData.cusps as any,
        ascendant: houseData.ascendant as any,
        mc: houseData.mc as any,
        ic: houseData.ic as any,
        dsc: houseData.descendant as any,
      };
      
      // Calculate elemental and modality balance
      const elements = calculateElementalBalance(planets);
      const modalities = calculateModalityBalance(planets);
      
      // Build proper ascendant / midheaven bodies from calculated house data
      const use13Signs = getSignCountPreference() === 13;
      const makeAngleBody = (longitude: number, houseNum: number): NatalPlanet => {
        const deg = toDegree(longitude);
        return {
          id: 'sun' as any,
          longitude: deg,
          latitude: 0,
          distance: 0,
          speed: 0,
          isRetrograde: false,
          sign: getSignFromLongitude(deg, use13Signs) as any,
          degreeInSign: getDegreeInSign(deg, use13Signs),
          house: houseNum,
          dignity: 'neutral',
        };
      };
      
      const ascendantBody = makeAngleBody(houseData.ascendant, 1);
      const midheavenBody = makeAngleBody(houseData.mc, 10);
      
      const chart: NatalChart = {
        id: `natal-${Date.now()}`,
        name: formData.name,
        birthData,
        planets,
        houses,
        ascendant: ascendantBody,
        midheaven: midheavenBody,
        elements,
        modalities,
        calculatedAt: new Date(),
        zodiacSystem: getZodiacSystemPreference(),
      };
      
      // Debug birth data
      
      // Save to storage using profile manager (creates both profile and chart)
      try {
        await profileManager.createProfile(formData.name, birthData, {
          makeDefault: true,
        });
      } catch (profileErr) {
        console.error('[BirthChartInput] Profile creation error:', profileErr);
        // Fallback: save natal chart directly
        try {
          saveNatalChart(chart);
        } catch (saveErr) {
          console.error('[BirthChartInput] Direct save also failed:', saveErr);
        }
      }
      
      setCalculatedChart(chart);
      onChartCalculated(chart);
    } catch (err) {
      console.error('[BirthChartInput] Chart calculation failed:', err);
      const errorMessage = err instanceof Error ? err.message : t('birthInput.chartCalcFailed');
      setError(errorMessage);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(false);
  };
  
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>{t('birthInput.calculating')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>{t('birthInput.yourBirthChart')}</h1>
        <p style={styles.subtitle}>
          {t('birthInput.enterDetails')}
        </p>
      </header>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>{t('birthInput.yourName')}</label>
          <input
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder={t('birthInput.enterName')}
            style={styles.input}
          />
        </div>
        
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('birthInput.birthDate')}</label>
            <input
              type="date"
              autoComplete="off"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('birthInput.birthTime')}</label>
            <input
              type="time"
              autoComplete="off"
              value={formData.birthTime}
              onChange={(e) => handleChange('birthTime', e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
        
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('birthInput.latitude')}</label>
            <input
              type="number"
              step="0.000001"
              autoComplete="off"
              inputMode="decimal"
              value={formData.latitude}
              onChange={(e) => handleChange('latitude', e.target.value)}
              placeholder={t('birthInput.latitudePlaceholder')}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('birthInput.longitude')}</label>
            <input
              type="number"
              step="0.000001"
              autoComplete="off"
              inputMode="decimal"
              value={formData.longitude}
              onChange={(e) => handleChange('longitude', e.target.value)}
              placeholder={t('birthInput.longitudePlaceholder')}
              style={styles.input}
            />
          </div>
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>{t('birthInput.timezone')}</label>
          <select
            value={formData.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            style={styles.timezoneSelect}
          >
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value} style={{ background: '#1a1a2e', color: '#fff' }}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>{t('birthInput.birthLocation')}</label>
          <LocationSearch onLocationSelect={handleLocationSelect} />
          <p style={{ ...styles.privacyNote, marginTop: '6px', textAlign: 'left' }}>
            {t('birthInput.locationHint')}
          </p>
        </div>
        
        {locationSet && (
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Latitude</label>
              <input
                type="text"
                readOnly
                value={formData.latitude}
                style={{ ...styles.input, opacity: 0.8 }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Longitude</label>
              <input
                type="text"
                readOnly
                value={formData.longitude}
                style={{ ...styles.input, opacity: 0.8 }}
              />
            </div>
          </div>
        )}
        
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={styles.primaryButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(147, 51, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>✨</span>
            {t('birthInput.calculateChart')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={styles.secondaryButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {t('birthInput.cancel')}
          </button>
        </div>
      </form>
      
      <p style={styles.privacyNote}>
        {t('birthInput.privacyNote')}
      </p>
      
      {/* Result Preview */}
      {calculatedChart && (
        <div style={styles.resultCard}>
          <h3 style={styles.resultTitle}>{t('birthInput.celestialBlueprint')}</h3>
          <div style={styles.planetGrid}>
            {Object.entries(calculatedChart.planets).slice(0, 8).map(([planet, data]) => (
              <div key={planet} style={styles.planetCard}>
                <div style={styles.planetName}>
                  {PLANET_SYMBOLS[planet]} {planet}
                </div>
                <div style={styles.planetSign}>
                  {data.sign.charAt(0).toUpperCase() + data.sign.slice(1)}
                </div>
                <div style={styles.planetDegree}>
                  {t('birthInput.house', { house: data.house })} • {data.dignity !== 'neutral' && t('birthInput.dignity', { dignity: data.dignity })}
                </div>
              </div>
            ))}
          </div>
          
          <div style={styles.elementBar}>
            {Object.entries(calculatedChart.elements).map(([element, count]) => (
              <div key={element} style={styles.elementItem}>
                <div style={styles.elementLabel}>{element}</div>
                <div style={{...styles.elementValue, color: ELEMENT_COLORS[element]}}>
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthChartInput;
