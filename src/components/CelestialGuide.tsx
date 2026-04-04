/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL GUIDE - Swiss Ephemeris Powered
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Restored with NASA-grade Swiss Ephemeris precision and original content
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import type { RootState } from '../store';
import type { LocationData } from '../types';
import { useFeatureDiscovery } from '../hooks/useGamification';
import { LOCATIONS, SUB_REGIONS } from '../types';
import { hekaToCivil, getHekaYearStart, HEKA_MONTHS } from '../services/calendarService';
import { getSeasonalEventInfo, getCurrentSunSign, getChineseZodiac } from '../services/celestialInfoService';
import { getNumerologyReading, type NumerologyReading } from '../services/numerologyService';
import { getCurrentSeason, getDaysUntilNextSeason, getSeasonElementColor } from '../services/seasonService';
import { 
  getNextSeasonalEvent, 
  getSolarNoon, 
  getLunarMonth,
  getAgriculturalGuidance,
  getEnergyForecast,
  getMoonPhase,
  getNextLunarNewYear,
  type SeasonalEventData
} from '../services/astronomyService';
import { calculateCurrentSky } from '../astrology/services/calculations/swissCalculations';
import type { CelestialBody } from '../astrology/types';
import { getZodiacSystemPreference } from '../astrology/services/natal/zodiacHelpers';
import { setZodiacSystem } from '../astrology/services/swiss-ephemeris/engine';
import '../styles/celestial-scrollbar.css';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CelestialData {
  date: Date;
  hekaDate: { year: number; month: number; day: number } | null;
  moon: CelestialBody | null;
  sun: CelestialBody | null;
  moonPhase: ReturnType<typeof getMoonPhase> | null;
  solarNoon: ReturnType<typeof getSolarNoon> | null;
  lunarMonth: ReturnType<typeof getLunarMonth> | null;
  nextSeasonalEvent: SeasonalEventData | null;
  agGuidance: ReturnType<typeof getAgriculturalGuidance> | null;
  energyForecast: ReturnType<typeof getEnergyForecast> | null;
  numerology: NumerologyReading | null;
  currentSeason: ReturnType<typeof getCurrentSeason> | null;
  daysUntilNextSeason: number;
  isLoading: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE COUNTDOWN COMPONENT (Original)
// ═══════════════════════════════════════════════════════════════════════════════

const CountdownDisplay = memo(({
  targetDate,
  fromDate,
  label,
  symbol,
}: {
  targetDate: Date;
  fromDate: Date;
  label: string;
  symbol: string;
}) => {
  const calculateTimeLeft = (): CountdownTime => {
    const now = new Date();
    
    const fromMidnight = new Date(fromDate);
    fromMidnight.setHours(0, 0, 0, 0);
    
    const targetMidnight = new Date(targetDate);
    targetMidnight.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((targetMidnight.getTime() - fromMidnight.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const effectiveTarget = new Date(now);
    effectiveTarget.setDate(effectiveTarget.getDate() + daysDiff);
    effectiveTarget.setHours(0, 0, 0, 0);
    
    if (daysDiff === 0) {
      effectiveTarget.setHours(targetDate.getHours(), targetDate.getMinutes(), targetDate.getSeconds());
    }
    
    let remainingMs = effectiveTarget.getTime() - now.getTime();
    
    if (remainingMs < 0 && daysDiff > 0) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      remainingMs = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
      
      return { days: daysDiff - 1, hours, minutes, seconds };
    }
    
    if (remainingMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
    
    return { days: daysDiff, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [targetDate, fromDate]);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current >= 1000) {
        lastUpdateRef.current = now;
        setTimeLeft(calculateTimeLeft());
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetDate, fromDate]);

  return (
    <div className="countdown-widget">
      <div className="countdown-header">
        <span className="countdown-symbol">{symbol}</span>
        <span className="countdown-label">{label}</span>
      </div>
      <div className="countdown-time">
        <div className="countdown-unit">
          <span className="countdown-value">{timeLeft.days}</span>
          <span className="countdown-unit-label">days</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown-unit-label">hrs</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="countdown-unit-label">min</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="countdown-unit-label">sec</span>
        </div>
      </div>
    </div>
  );
});

CountdownDisplay.displayName = 'CountdownDisplay';

// ═══════════════════════════════════════════════════════════════════════════════
// EXPANDABLE CARD COMPONENTS (Original)
// ═══════════════════════════════════════════════════════════════════════════════

const ExpandableCard: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  accentColor?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, subtitle, icon, accentColor = 'var(--color-gold)', children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`celestial-expandable-card ${isExpanded ? 'expanded' : ''}`} style={{ '--accent-color': accentColor } as React.CSSProperties}>
      <div className="celestial-expandable-card__header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="celestial-expandable-card__icon">{icon}</span>
        <div className="celestial-expandable-card__title-group">
          <span className="celestial-expandable-card__title">{title}</span>
          {subtitle && <span className="celestial-expandable-card__subtitle">{subtitle}</span>}
        </div>
        <span className={`celestial-expandable-card__chevron ${isExpanded ? 'rotated' : ''}`}>▼</span>
      </div>
      {isExpanded && <div className="celestial-expandable-card__content">{children}</div>}
    </div>
  );
};

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="celestial-info-section">
    <h4 className="celestial-info-section__title">{title}</h4>
    <div className="celestial-info-section__content">{children}</div>
  </div>
);

const InfoList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="celestial-info-list">
    {items.map((item, i) => <li key={i} className="celestial-info-list__item">{item}</li>)}
  </ul>
);

const InfoBadge: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div className="celestial-info-badge" style={color ? { borderColor: color } : undefined}>
    <span className="celestial-info-badge__label">{label}</span>
    <span className="celestial-info-badge__value" style={color ? { color } : undefined}>{value}</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ZODIAC CARD COMPONENT (Original)
// ═══════════════════════════════════════════════════════════════════════════════

const ZodiacCard: React.FC<{ zodiac: ReturnType<typeof getCurrentSunSign> }> = ({ zodiac }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="celestial-expandable-card">
      <div className="celestial-expandable-card__header" onClick={() => setShowDetails(!showDetails)}>
        <span className="celestial-expandable-card__icon">{zodiac.symbol}</span>
        <div className="celestial-expandable-card__title-group">
          <span className="celestial-expandable-card__title">{zodiac.sign}</span>
          <span className="celestial-expandable-card__subtitle">{zodiac.dates} • {zodiac.element}</span>
        </div>
        <span className={`celestial-expandable-card__chevron ${showDetails ? 'rotated' : ''}`}>▼</span>
      </div>
      {showDetails && (
        <div className="celestial-expandable-card__content">
          <p className="zodiac-card__description">{zodiac.description}</p>
          <div className="zodiac-card__traits">
            <span className="zodiac-card__label">Traits:</span>
            {zodiac.traits.map((trait, i) => (
              <span key={i} className="zodiac-card__trait">{trait}</span>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Ruled by {zodiac.rulingPlanet}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LUNAR NEW YEAR CARD
// ═══════════════════════════════════════════════════════════════════════════════

const LunarNewYearCard: React.FC<{ civilDate: Date }> = ({ civilDate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const nextLunarNewYear = getNextLunarNewYear(civilDate);
  const daysUntil = Math.ceil((nextLunarNewYear.date.getTime() - civilDate.getTime()) / (1000 * 60 * 60 * 24));
  const isToday = daysUntil === 0;
  const showCountdown = !isToday && daysUntil <= 30;
  
  return (
    <div className="celestial-expandable-card">
      <div className="celestial-expandable-card__header" onClick={() => setShowDetails(!showDetails)}>
        <span className="celestial-expandable-card__icon">🧧</span>
        <div className="celestial-expandable-card__title-group">
          <span className="celestial-expandable-card__title">
            {isToday ? "Lunar New Year Today!" : "Lunar New Year"}
          </span>
          <span className="celestial-expandable-card__subtitle">
            {isToday 
              ? `Year of the ${nextLunarNewYear.animal} begins now` 
              : `${daysUntil} days until Year of the ${nextLunarNewYear.animal}`}
          </span>
        </div>
        <span className={`celestial-expandable-card__chevron ${showDetails ? 'rotated' : ''}`}>▼</span>
      </div>
      {showDetails && (
        <div className="celestial-expandable-card__content">
          {showCountdown && (
            <CountdownDisplay 
              targetDate={nextLunarNewYear.date}
              fromDate={civilDate}
              label={`Year of the ${nextLunarNewYear.animal}`}
              symbol="🧧"
            />
          )}
          <InfoSection title="About Lunar New Year">
            <p>Also known as <strong>Spring Festival</strong> (春节), Lunar New Year marks the beginning of the lunisolar year. It falls on the <strong>second new moon after winter solstice</strong>, typically between January 21 and February 20.</p>
            <p style={{ marginTop: '8px' }}>
              <strong>This Year:</strong> {nextLunarNewYear.element} {nextLunarNewYear.animal} ({nextLunarNewYear.yinYang})
            </p>
          </InfoSection>
          <InfoSection title="Historical Significance">
            <p>For millennia, this date guided agricultural societies. The festival marked the end of winter dormancy and the beginning of the planting season. Farmers would prepare tools, plan crops, and pray for abundant harvests.</p>
          </InfoSection>
          <InfoSection title="Seasonal Connection">
            <InfoList items={[
              "Celebrated as the true beginning of spring",
              "Traditionally guided planting schedules",
              "Marked the transition from storage to cultivation",
              "Aligned with natural lunar and solar cycles"
            ]} />
          </InfoSection>
          <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
            ℹ️ Calculated using astronomical new moon positions
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHINESE ZODIAC CARD (Original)
// ═══════════════════════════════════════════════════════════════════════════════

const ChineseZodiacCard: React.FC<{ year: number }> = ({ year }) => {
  const [showDetails, setShowDetails] = useState(false);
  const zodiac = getChineseZodiac(year);

  return (
    <div className="celestial-expandable-card">
      <div className="celestial-expandable-card__header" onClick={() => setShowDetails(!showDetails)}>
        <span className="celestial-expandable-card__icon">🐉</span>
        <div className="celestial-expandable-card__title-group">
          <span className="celestial-expandable-card__title">Year of the {zodiac.animal}</span>
          <span className="celestial-expandable-card__subtitle">{zodiac.element} • {zodiac.yinYang}</span>
        </div>
        <span className={`celestial-expandable-card__chevron ${showDetails ? 'rotated' : ''}`}>▼</span>
      </div>
      {showDetails && (
        <div className="celestial-expandable-card__content">
          <p className="chinese-zodiac-card__description">{zodiac.description}</p>
          <div className="chinese-zodiac-card__characteristics">
            <strong>Characteristics:</strong> {zodiac.characteristics.join(', ')}
          </div>
          <div className="chinese-zodiac-card__lucky">
            <span>Lucky numbers: {zodiac.luckyNumbers.join(', ')}</span>
            <span>Lucky colors: {zodiac.luckyColors.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DAY OF WEEK DATA (Original)
// ═══════════════════════════════════════════════════════════════════════════════

const DAY_OF_WEEK_DATA = [
  { 
    day: 'Sunday', 
    planet: 'Sun ☉', 
    symbol: '☀️', 
    color: '#fbbf24',
    qualities: ['Vitality', 'Leadership', 'Success', 'Visibility'],
    activities: ['Start new ventures', 'Seek recognition', 'Creative projects', 'Physical exercise'],
    description: 'The day of the Sun brings vitality, confidence, and creative energy. Ideal for new beginnings and seeking visibility.'
  },
  { 
    day: 'Monday', 
    planet: 'Moon ☽', 
    symbol: '🌙', 
    color: '#c4b5fd',
    qualities: ['Intuition', 'Emotions', 'Nurturing', 'Reflection'],
    activities: ['Self-care', 'Home activities', 'Introspection', 'Family time'],
    description: 'The day of the Moon emphasizes emotions, intuition, and inner work. Perfect for rest and emotional processing.'
  },
  { 
    day: 'Tuesday', 
    planet: 'Mars ♂', 
    symbol: '⚔️', 
    color: '#ef4444',
    qualities: ['Action', 'Courage', 'Drive', 'Passion'],
    activities: ['Tackle challenges', 'Physical work', 'Assertiveness', 'Competition'],
    description: 'The day of Mars brings energy, courage, and drive. Best for taking action and overcoming obstacles.'
  },
  { 
    day: 'Wednesday', 
    planet: 'Mercury ☿', 
    symbol: '📜', 
    color: '#22c55e',
    qualities: ['Communication', 'Intellect', 'Learning', 'Travel'],
    activities: ['Writing', 'Negotiations', 'Study', 'Short trips'],
    description: 'The day of Mercury favors communication, learning, and mental agility. Ideal for negotiations and writing.'
  },
  { 
    day: 'Thursday', 
    planet: 'Jupiter ♃', 
    symbol: '⚡', 
    color: '#a78bfa',
    qualities: ['Expansion', 'Luck', 'Wisdom', 'Abundance'],
    activities: ['Big decisions', 'Financial matters', 'Teaching', 'Travel planning'],
    description: 'The day of Jupiter brings abundance, wisdom, and expansion. Favorable for growth and prosperity.'
  },
  { 
    day: 'Friday', 
    planet: 'Venus ♀', 
    symbol: '💕', 
    color: '#ec4899',
    qualities: ['Love', 'Beauty', 'Harmony', 'Creativity'],
    activities: ['Social gatherings', 'Artistic pursuits', 'Romance', 'Self-pampering'],
    description: 'The day of Venus emphasizes love, beauty, and harmony. Perfect for social activities and artistic expression.'
  },
  { 
    day: 'Saturday', 
    planet: 'Saturn ♄', 
    symbol: '🪐', 
    color: '#6b7280',
    qualities: ['Discipline', 'Structure', 'Responsibility', 'Wisdom'],
    activities: ['Organization', 'Planning', 'Review work', 'Set boundaries'],
    description: 'The day of Saturn calls for discipline and structure. Best for organization, planning, and responsibility.'
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getDateContext(selectedDate: Date): { isPast: boolean; isFuture: boolean; isToday: boolean; diffDays: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);
  const diffTime = selected.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return { isPast: diffDays < 0, isFuture: diffDays > 0, isToday: diffDays === 0, diffDays: Math.abs(diffDays) };
}

const ACTIVITY_ICONS: Record<string, string> = {
  plant: '🌱', transplant: '🪴', harvest: '🌾', prune: '✂️', fertilize: '💧', rest: '😴', prepare: '📝',
};

const ENERGY_COLORS: Record<string, string> = {
  'very-high': '#ef4444',
  'high': '#f97316',
  'moderate': '#eab308',
  'low': '#22c55e',
  'very-low': '#3b82f6',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CELESTIAL GUIDE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const CelestialGuideComponent: React.FC = () => {
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate, shallowEqual);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate, shallowEqual);
  const location = useSelector((state: RootState) => state.calendar.location);
  const subRegion = useSelector((state: RootState) => state.calendar.subRegion);
  const display = useSelector((state: RootState) => state.calendar.display, shallowEqual);
  const { discover } = useFeatureDiscovery();
  
  // Track that user has viewed Celestial Guide
  useEffect(() => {
    discover('openedCelestialGuide');
  }, [discover]);

  // Location data with sub-region support
  const locationData = useMemo((): LocationData => {
    if (subRegion) {
      const subRegionData = SUB_REGIONS[location]?.find(r => r.code === subRegion);
      if (subRegionData) {
        return { country: location, timezone: subRegionData.timezone, latitude: subRegionData.latitude, longitude: subRegionData.longitude, name: subRegionData.name, region: LOCATIONS[location].region };
      }
    }
    return LOCATIONS[location];
  }, [location, subRegion]);

  const hemisphere = useMemo(() => locationData.latitude >= 0 ? 'N' : 'S', [locationData.latitude]);
  const targetHekaDate = selectedDate || viewDate;
  const now = useMemo(() => new Date(), []);
  const civilDate = useMemo(() => {
    const baseDate = hekaToCivil(targetHekaDate);
    baseDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    return baseDate;
  }, [targetHekaDate, now]);

  // Fetch celestial data using both original services and Swiss Ephemeris
  const [data, setData] = useState<CelestialData>({
    date: civilDate, hekaDate: selectedDate, moon: null, sun: null, moonPhase: null,
    solarNoon: null, lunarMonth: null, nextSeasonalEvent: null, agGuidance: null,
    energyForecast: null, numerology: null, currentSeason: null, daysUntilNextSeason: 0, isLoading: true
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setData(prev => ({ ...prev, isLoading: true }));
      try {
        // Set zodiac system
        const zodiacSystem = getZodiacSystemPreference();
        setZodiacSystem(zodiacSystem);
        
        // Get Swiss Ephemeris data
        const skyData = await calculateCurrentSky(civilDate);
        if (!isMounted) return;
        
        // Combine original service data with Swiss Ephemeris
        const moon = skyData.positions.moon;
        const sun = skyData.positions.sun;
        
        // Use original services for most data
        const moonPhase = getMoonPhase(civilDate, hemisphere);
        const solarNoon = locationData.latitude !== 0 ? getSolarNoon(civilDate, locationData) : null;
        const lunarMonth = getLunarMonth(civilDate);
        const nextSeasonalEvent = display.showSeasonalEvents ? getNextSeasonalEvent(civilDate, hemisphere) : null;
        const agGuidance = display.showAgriculturalGuidance ? getAgriculturalGuidance(civilDate, hemisphere) : null;
        const energyForecast = display.showEnergyForecast ? getEnergyForecast(civilDate, hemisphere) : null;
        const numerology = getNumerologyReading(civilDate);
        const currentSeason = display.showSeasonalEvents ? getCurrentSeason(civilDate, hemisphere) : null;
        const daysUntilNextSeason = display.showSeasonalEvents ? getDaysUntilNextSeason(civilDate, hemisphere) : 0;
        
        if (isMounted) {
          setData({
            date: civilDate, hekaDate: selectedDate, moon, sun, moonPhase, solarNoon, lunarMonth,
            nextSeasonalEvent, agGuidance, energyForecast, numerology, currentSeason, daysUntilNextSeason,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('[CelestialGuide] Error:', error);
        // Even on error, ensure we have basic moon phase data
        if (isMounted) {
          const fallbackMoonPhase = getMoonPhase(civilDate, hemisphere);
          setData(prev => ({ 
            ...prev, 
            moonPhase: prev.moonPhase || fallbackMoonPhase,
            isLoading: false 
          }));
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [civilDate, hemisphere, locationData, display.showSeasonalEvents, display.showAgriculturalGuidance, display.showEnergyForecast, selectedDate]);

  // Derived data
  const sunSign = useMemo(() => getCurrentSunSign(civilDate), [civilDate]);
  const dateContext = useMemo(() => getDateContext(civilDate), [civilDate]);
  const { isHistoricalView, isFutureView } = useMemo(() => {
    const todayYear = new Date().getFullYear();
    return { isHistoricalView: civilDate.getFullYear() < todayYear, isFutureView: civilDate.getFullYear() > todayYear };
  }, [civilDate]);
  const dayOfYear = useMemo(() => {
    const startOfYear = new Date(civilDate.getFullYear(), 0, 0);
    return Math.floor((civilDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  }, [civilDate]);
  
  // HEKA New Year calculation
  const { hekaNewYear, hekaYearNumber } = useMemo(() => {
    const currentYS = getHekaYearStart(targetHekaDate.year);
    const nextYS = getHekaYearStart(targetHekaDate.year + 1);
    const hekaNY = civilDate.getTime() < currentYS.getTime() ? currentYS : nextYS;
    const yearNum = targetHekaDate.year + (civilDate.getTime() >= currentYS.getTime() ? 1 : 0);
    return { hekaNewYear: hekaNY, hekaYearNumber: yearNum };
  }, [targetHekaDate.year, civilDate]);

  const showNewYearCountdown = civilDate.getTime() < hekaNewYear.getTime();
  const showSeasonalCountdown = data.nextSeasonalEvent && civilDate.getTime() < data.nextSeasonalEvent.date.getTime();
  const seasonalEventInfo = data.nextSeasonalEvent ? getSeasonalEventInfo(data.nextSeasonalEvent.name) : null;
  const dayOfWeekInfo = DAY_OF_WEEK_DATA[civilDate.getDay()];

  // Contextual title
  const contextualTitle = useMemo(() => {
    if (dateContext.isToday) return "Today's Celestial Guide";
    if (dateContext.isPast) return `Celestial Guide for ${dateContext.diffDays} days ago`;
    return `Celestial Guide in ${dateContext.diffDays} days`;
  }, [dateContext]);

  // Only show Celestial Guide if at least one filter is enabled
  // The filters control WHICH cards appear, not just SOME cards
  const hasEnabledFeatures = display.showSeasonalEvents || display.showAgriculturalGuidance || display.showEnergyForecast;
  if (!hasEnabledFeatures) return null;

  return (
    <div className="celestial-panel-container">
      {/* Title */}
      <div className="celestial-panel__title" style={{ padding: '0 var(--space-4)' }}>
        <span>✦</span> {contextualTitle}
        <span className="celestial-date-context">
          {isHistoricalView && " 📜 Historical View"}
          {isFutureView && " 🔮 Future View"}
        </span>
      </div>
      
      {/* General Disclaimer */}
      <div style={{ 
        fontSize: '11px', 
        opacity: 0.6, 
        padding: '4px 16px 8px', 
        fontStyle: 'italic',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '8px'
      }}>
        ℹ️ <strong>HEKA Calendar is Universal:</strong> Dates are the same worldwide (like Gregorian calendar). Civil date/times vary by timezone. Celestial calculations (solar noon, moon phases) are mathematical approximations ±30 min for educational purposes.
      </div>
      
      <div className="celestial-panel">
        
        {/* Selected Date Info Card - Shows with any filter */}
        {(isHistoricalView || isFutureView) && (
          <ExpandableCard
            title={`${HEKA_MONTHS[targetHekaDate.month].name} ${targetHekaDate.day}, ${targetHekaDate.year}`}
            subtitle="Selected HEKA Date"
            icon="📅"
            accentColor="#c9a227"
            defaultExpanded={true}
          >
            <div className="selected-date-info">
              <InfoBadge 
                label="Civil Date" 
                value={civilDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 
              />
              <InfoBadge label="Day of Year" value={`Day ${dayOfYear}`} />
              {dateContext.isPast && (
                <InfoSection title="Looking Back">
                  <p>This date has passed. Review what celestial energies were present on this day.</p>
                </InfoSection>
              )}
              {dateContext.isFuture && (
                <InfoSection title="Looking Forward">
                  <p>This date is in the future. Plan ahead using these upcoming celestial energies.</p>
                </InfoSection>
              )}
            </div>
          </ExpandableCard>
        )}
        
        {/* HEKA New Year - Seasonal card */}
        {display.showSeasonalEvents && (
        <ExpandableCard
          title={`HEKA Year ${hekaYearNumber} Begins`}
          subtitle={civilDate.getTime() < hekaNewYear.getTime() 
            ? `Starting (Civil): ${hekaNewYear.toLocaleDateString()}` 
            : `Began (Civil): ${hekaNewYear.toLocaleDateString()}`}
          icon="🌅"
          accentColor="#c9a227"
        >
          {showNewYearCountdown && (
            <CountdownDisplay 
              targetDate={hekaNewYear}
              fromDate={civilDate}
              label={`HEKA Year ${hekaYearNumber}`}
              symbol="🌅"
            />
          )}
          <InfoSection title="About This HEKA Year">
            <p>The HEKA year {hekaYearNumber} begins on April 1st, {hekaNewYear.getFullYear()}. Each HEKA year contains 12 months of 28 days, plus March with 29 days (30 in leap/correction years).</p>
            <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
              <strong>🌍 Universal Calendar:</strong> HEKA dates are determined by your local timezone. Currently, it is HEKA Month {targetHekaDate.month + 1}, Day {targetHekaDate.day} in your selected location ({locationData.name}). This may differ from other locations - for example, when it's early morning in Sydney, it may still be the previous day in New York.
            </p>
          </InfoSection>
          {!showNewYearCountdown && (
            <InfoSection title="Status">
              <p>This HEKA year has begun. The next cycle begins April 1st, {hekaNewYear.getFullYear() + 1}.</p>
            </InfoSection>
          )}
        </ExpandableCard>
        )}
        
        {/* Day of the Week - Energy card */}
        {display.showEnergyForecast && (
        <ExpandableCard
          title={`${dayOfWeekInfo.day}: Day of ${dayOfWeekInfo.planet}`}
          subtitle={dayOfWeekInfo.description}
          icon={dayOfWeekInfo.symbol}
          accentColor={dayOfWeekInfo.color}
        >
          <InfoSection title="Planetary Qualities">
            <InfoList items={dayOfWeekInfo.qualities} />
          </InfoSection>
          <InfoSection title="Favorable Activities">
            <InfoList items={dayOfWeekInfo.activities} />
          </InfoSection>
          <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
            ℹ️ Planetary day associations draw from traditional astrology and cultural symbolism.
          </div>
        </ExpandableCard>
        )}
        
        {/* Moon Phase - Seasonal card */}
        {display.showSeasonalEvents && data.moonPhase && (
          <ExpandableCard
            title="Moon Phase"
            subtitle={`${data.moonPhase.phase} • ${Math.round(data.moonPhase.illumination)}% illuminated`}
            icon={data.moonPhase.glyph}
            accentColor="#c4b5fd"
          >
            <div className="moon-phase-display">
              <span className="moon-phase-glyph">{data.moonPhase.glyph}</span>
              <div className="moon-phase-details">
                <span className="moon-phase-name">{data.moonPhase.phase}</span>
                <span className="moon-illumination">{Math.round(data.moonPhase.illumination)}% illuminated</span>
                <span className="moon-age">Age: {Math.round(data.moonPhase.age)} days</span>
              </div>
            </div>
            <InfoSection title="Energetic Influence">
              <InfoList items={[
                data.moonPhase.waxing ? "Waxing: Building energy, growth, accumulation" : "Waning: Releasing, letting go, completion",
                data.moonPhase.illumination > 50 ? "More than half: Peak manifestation power" : "Less than half: Introspection and planning",
                data.moonPhase.age < 7 ? "New to First Quarter: Begin new projects" : 
                  data.moonPhase.age < 14 ? "First Quarter to Full: Build momentum" :
                  data.moonPhase.age < 21 ? "Full to Last Quarter: Harvest results" :
                  "Last Quarter to New: Release and rest"
              ]} />
            </InfoSection>
            <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
              ℹ️ Moon phases are calculated mathematically and may vary slightly from astronomical observations.
            </div>
          </ExpandableCard>
        )}
        
        {/* Current Season */}
        {display.showSeasonalEvents && data.currentSeason && (
          <ExpandableCard
            title={`${data.currentSeason.emoji} ${data.currentSeason.name}`}
            subtitle={`Element: ${data.currentSeason.element} • ${data.daysUntilNextSeason} days until next season`}
            icon={data.currentSeason.emoji}
            accentColor={getSeasonElementColor(data.currentSeason.element)}
          >
            <div className="season-display">
              <InfoBadge label="Element" value={data.currentSeason.element} color={getSeasonElementColor(data.currentSeason.element)} />
              <InfoBadge label="Days Remaining" value={`${data.daysUntilNextSeason} days`} />
            </div>
            <InfoSection title="About This Season">
              <p>{data.currentSeason.description}</p>
            </InfoSection>
            <InfoSection title="Characteristics">
              <InfoList items={data.currentSeason.characteristics} />
            </InfoSection>
            <InfoSection title="Seasonal Activities">
              <InfoList items={data.currentSeason.activities} />
            </InfoSection>
          </ExpandableCard>
        )}
        
        {/* Next Seasonal Event */}
        {display.showSeasonalEvents && data.nextSeasonalEvent && seasonalEventInfo && (
          <ExpandableCard
            title={seasonalEventInfo.name}
            subtitle={`From ${HEKA_MONTHS[targetHekaDate.month].name} ${targetHekaDate.day}`}
            icon={seasonalEventInfo.symbol}
            accentColor="#e8c97a"
          >
            {showSeasonalCountdown && (
              <CountdownDisplay 
                targetDate={data.nextSeasonalEvent.date}
                fromDate={civilDate}
                label={data.nextSeasonalEvent.name}
                symbol={data.nextSeasonalEvent.symbol}
              />
            )}
            <InfoSection title="What is it?">
              <p>{seasonalEventInfo.description}</p>
            </InfoSection>
            <InfoSection title="Significance">
              <p>{seasonalEventInfo.significance}</p>
            </InfoSection>
            <InfoSection title="How to Observe">
              <p>{seasonalEventInfo.observance}</p>
            </InfoSection>
            {seasonalEventInfo.traditions.length > 0 && (
              <InfoSection title="Traditions">
                <InfoList items={seasonalEventInfo.traditions.slice(0, 4)} />
              </InfoSection>
            )}
          </ExpandableCard>
        )}
        
        {/* Lunar New Year - Seasonal card - only shows when SEASONS filter is active */}
        {display.showSeasonalEvents && <LunarNewYearCard civilDate={civilDate} />}
        
        {/* Solar Noon - Seasonal card */}
        {display.showSeasonalEvents && data.solarNoon && (
          <ExpandableCard
            title="Solar Noon"
            subtitle={`Sun at highest point on this day`}
            icon="☀️"
            accentColor="#fbbf24"
          >
            <div className="solar-noon-display">
              <span className="solar-noon-time">
                {data.solarNoon.time.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                })}
              </span>
              <span className="solar-noon-elevation">
                Sun elevation: {data.solarNoon.elevation}°
              </span>
            </div>
            <InfoSection title="About Solar Noon">
              <p><strong>Local Time:</strong> The Sun reaches its highest point at {data.solarNoon.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ({locationData.timezone})</p>
            </InfoSection>
            <InfoSection title="Historical Significance">
              <p>Ancient cultures used solar noon for timekeeping. Stone circles and sundials were aligned to mark this moment.</p>
            </InfoSection>
            <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
              ℹ️ Times are mathematical approximations (±10-15 min). Precise solar noon varies by your exact location and date.
            </div>
          </ExpandableCard>
        )}
        
        {/* Lunar Month - Seasonal card */}
        {display.showSeasonalEvents && data.lunarMonth && (
          <ExpandableCard
            title="Lunar Cycle"
            subtitle={data.lunarMonth.name}
            icon="🌙"
            accentColor="#c4b5fd"
          >
            <div className="lunar-month-display">
              <InfoBadge label="New Moon (Civil)" value={data.lunarMonth.newMoon.toLocaleDateString()} />
              <InfoBadge label="Full Moon (Civil)" value={data.lunarMonth.fullMoon.toLocaleDateString()} />
            </div>
            <InfoSection title="This Moon Cycle">
              <p><strong>Civil Date:</strong> {civilDate.toLocaleDateString()} — The Moon was in the {data.lunarMonth.name} cycle.</p>
            </InfoSection>
            <InfoSection title="Energetic Qualities">
              <InfoList items={[
                "New Moon: Beginnings, setting intentions",
                "Waxing: Growth, building momentum",
                "Full Moon: Peak energy, manifestation",
                "Waning: Release, reflection, completion"
              ]} />
            </InfoSection>
          </ExpandableCard>
        )}
        
        {/* Agricultural Guidance */}
        {display.showAgriculturalGuidance && data.agGuidance && (
          <ExpandableCard
            title="Agricultural Guidance"
            subtitle={`For ${HEKA_MONTHS[targetHekaDate.month].name} ${targetHekaDate.day}`}
            icon={ACTIVITY_ICONS[data.agGuidance.activity] || '🌱'}
            accentColor="#86efac"
          >
            <div className="ag-guidance-display">
              <span className="ag-activity">{ACTIVITY_ICONS[data.agGuidance.activity]} {data.agGuidance.description}</span>
              <span className={`ag-confidence ag-confidence--${data.agGuidance.confidence}`}>
                Confidence: {data.agGuidance.confidence}
              </span>
            </div>
            <InfoSection title="Why This Day?">
              <p><strong>Civil Date:</strong> {civilDate.toLocaleDateString()} — The moon phase and seasonal factors indicated optimal conditions for {data.agGuidance.activity} activities.</p>
            </InfoSection>
            <InfoSection title="Biodynamic Principle">
              <p>This guidance follows the cosmic rhythms affecting plant vitality and soil conditions.</p>
            </InfoSection>
          </ExpandableCard>
        )}
        
        {/* Energy Forecast */}
        {display.showEnergyForecast && data.energyForecast && (
          <ExpandableCard
            title="Cosmic Energy"
            subtitle={`Civil: ${civilDate.toLocaleDateString()}`}
            icon="⚡"
            accentColor={ENERGY_COLORS[data.energyForecast.level]}
          >
            <div className="energy-forecast-display">
              <div className="energy-level-bar">
                <div 
                  className="energy-level-fill"
                  style={{ 
                    width: data.energyForecast.level === 'very-high' ? '100%' : 
                           data.energyForecast.level === 'high' ? '80%' :
                           data.energyForecast.level === 'moderate' ? '60%' :
                           data.energyForecast.level === 'low' ? '40%' : '20%',
                    background: ENERGY_COLORS[data.energyForecast.level],
                  }}
                />
              </div>
              <p className="energy-description">{data.energyForecast.description}</p>
              <div className="energy-factors">
                {data.energyForecast.factors.map((factor, i) => (
                  <span key={i} className="energy-factor">{factor}</span>
                ))}
              </div>
            </div>
            <InfoSection title="Cosmic Conditions">
              <p>The energy forecast for <strong>Civil Date:</strong> {civilDate.toLocaleDateString()} combines lunar phase, planetary positions, and seasonal rhythms.</p>
            </InfoSection>
            <InfoSection title="How to Use This">
              <InfoList items={[
                "High energy: Start projects, take action, be social",
                "Moderate energy: Routine work, steady progress",
                "Low energy: Rest, reflection, planning"
              ]} />
            </InfoSection>
          </ExpandableCard>
        )}
        
        {/* Numerology - Energy card */}
        {display.showEnergyForecast && data.numerology && (
          <ExpandableCard
            title={`Numerology: Day ${data.numerology.dayNumber}`}
            subtitle={`Civil: ${civilDate.toLocaleDateString()}`}
            icon="🔢"
            accentColor="#d4bc7a"
          >
            <div className="numerology-display">
              <span className="numerology-number">
                {data.numerology.masterNumber || data.numerology.dayNumber}
              </span>
              <span className="numerology-meaning">{data.numerology.meaning}</span>
            </div>
            <InfoSection title="Today's Energy">
              <p>{data.numerology.energy}</p>
            </InfoSection>
            <InfoSection title="Focus Areas">
              <InfoList items={data.numerology.focus} />
            </InfoSection>
            <InfoSection title="Guidance">
              <p>{data.numerology.guidance}</p>
            </InfoSection>
            <div className="numerology-meta">
              <InfoBadge label="Compatible" value={data.numerology.compatibleNumbers.join(', ')} color="#86efac" />
              <InfoBadge label="Lucky Hours" value={data.numerology.luckyHours.join(', ')} color="#fbbf24" />
            </div>
          </ExpandableCard>
        )}
        
        {/* Zodiac - Seasonal card */}
        {display.showSeasonalEvents && <ZodiacCard zodiac={sunSign} />}
        
        {/* Chinese Zodiac - Seasonal card */}
        {display.showSeasonalEvents && <ChineseZodiacCard year={civilDate.getFullYear()} />}
        
        {/* Scroll hint - positioned above scrollbar */}
        <div className="scrollbar-hint">← Drag to scroll →</div>
      </div>
    </div>
  );
};

export const CelestialGuide = memo(CelestialGuideComponent);
CelestialGuide.displayName = 'CelestialGuide';
export default CelestialGuide;
