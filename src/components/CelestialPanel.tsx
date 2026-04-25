/**
 * Celestial Panel Component - Date-Responsive & Performance Optimized
 * 
 * Optimizations:
 * - requestAnimationFrame for smooth countdowns
 * - React.memo with custom comparison
 * - useMemo for all expensive computations
 * - CSS containment
 * - Lazy loading of heavy calculations
 */

import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import type { RootState } from '../store';
import { LOCATIONS, SUB_REGIONS, type LocationData } from '../types';
import { 
  getNextSeasonalEvent, 
  getSolarNoon, 
  getLunarMonth,
  getAgriculturalGuidance,
  getEnergyForecast,
  getMoonPhase,
} from '../services/astronomyService';
import { hekaToCivil, getHekaYearStart, HEKA_MONTHS } from '../services/calendarService';
import { getSeasonalEventInfo, getCurrentSunSign } from '../services/celestialInfoService';
import { getNumerologyReading } from '../services/numerologyService';
import { getCurrentSeason, getDaysUntilNextSeason, getSeasonElementColor } from '../services/seasonService';
import { ZodiacCard, ChineseZodiacCard } from './CelestialInfoTooltip';
import { ExpandableCelestialCard, InfoSection, InfoList, InfoBadge } from './ExpandableCelestialCard';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculate countdown from target date relative to selected date
 * Shows days remaining from selected date, with live ticking time
 */
function calculateCountdown(targetDate: Date, fromDate: Date): CountdownTime {
  const now = new Date();
  
  // Calculate how many days between the selected date and the target
  const fromMidnight = new Date(fromDate);
  fromMidnight.setHours(0, 0, 0, 0);
  
  const targetMidnight = new Date(targetDate);
  targetMidnight.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((targetMidnight.getTime() - fromMidnight.getTime()) / (1000 * 60 * 60 * 24));
  
  // If target has passed, show zeros
  if (daysDiff < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  // For the time component, calculate remaining time in the current day
  // Create a target that is 'daysDiff' days from now at midnight
  const effectiveTarget = new Date(now);
  effectiveTarget.setDate(effectiveTarget.getDate() + daysDiff);
  effectiveTarget.setHours(0, 0, 0, 0);
  
  // If same day, use actual target time; otherwise use midnight
  if (daysDiff === 0) {
    effectiveTarget.setHours(targetDate.getHours(), targetDate.getMinutes(), targetDate.getSeconds());
  }
  
  let remainingMs = effectiveTarget.getTime() - now.getTime();
  
  // If we've passed the target time today but there are still days left,
  // show the full day remaining (until midnight)
  if (remainingMs < 0 && daysDiff > 0) {
    // Next midnight
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    remainingMs = tomorrow.getTime() - now.getTime();
    
    const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
    
    return { days: daysDiff - 1, hours, minutes, seconds };
  }
  
  if (remainingMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
  
  return { days: daysDiff, hours, minutes, seconds };
}

/**
 * Live Countdown Display
 * Ticks every second with real-time hours/minutes/seconds
 * Day count adjusts based on selected date
 */
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
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(() => 
    calculateCountdown(targetDate, fromDate)
  );
  
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  // Update when target or from date changes
  useEffect(() => {
    setTimeLeft(calculateCountdown(targetDate, fromDate));
  }, [targetDate, fromDate]);
  
  // Continuous ticking
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      
      // Update every second
      if (now - lastUpdateRef.current >= 1000) {
        lastUpdateRef.current = now;
        const newTimeLeft = calculateCountdown(targetDate, fromDate);
        
        setTimeLeft(prev => {
          // Only update if changed
          if (prev.seconds !== newTimeLeft.seconds || 
              prev.minutes !== newTimeLeft.minutes ||
              prev.hours !== newTimeLeft.hours ||
              prev.days !== newTimeLeft.days) {
            return newTimeLeft;
          }
          return prev;
        });
      }
      
      rafRef.current = requestAnimationFrame(tick);
    };
    
    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
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

// Get contextual message based on selected vs current date
function getDateContext(selectedDate: Date): { isPast: boolean; isFuture: boolean; isToday: boolean; diffDays: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);
  
  const diffTime = selected.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    isPast: diffDays < 0,
    isFuture: diffDays > 0,
    isToday: diffDays === 0,
    diffDays: Math.abs(diffDays)
  };
}

// Memoized celestial data computation to prevent recalculation on every render
function useCelestialData(
  civilDate: Date,
  hemisphere: 'N' | 'S',
  locationData: typeof LOCATIONS[keyof typeof LOCATIONS],
  display: { showCelestialCards: boolean }
) {
  return useMemo(() => {
    const nextSeasonalEvent = display.showCelestialCards 
      ? getNextSeasonalEvent(civilDate, hemisphere) 
      : null;
    
    return {
      nextSeasonalEvent,
      solarNoon: locationData.latitude !== 0 ? getSolarNoon(civilDate, locationData) : null,
      lunarMonth: getLunarMonth(civilDate),
      agGuidance: display.showCelestialCards 
        ? getAgriculturalGuidance(civilDate, hemisphere) 
        : null,
      energyForecast: display.showCelestialCards 
        ? getEnergyForecast(civilDate, hemisphere) 
        : null,
      numerology: getNumerologyReading(civilDate),
      moonPhase: getMoonPhase(civilDate, hemisphere),
      currentSeason: display.showCelestialCards 
        ? getCurrentSeason(civilDate, hemisphere) 
        : null,
      daysUntilNextSeason: display.showCelestialCards 
        ? getDaysUntilNextSeason(civilDate, hemisphere) 
        : 0,
    };
  }, [civilDate, hemisphere, locationData, display.showCelestialCards]);
}

const CelestialPanelComponent: React.FC = () => {
  // Use individual selectors with shallowEqual for objects
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate, shallowEqual);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate, shallowEqual);
  const location = useSelector((state: RootState) => state.calendar.location);
  const subRegion = useSelector((state: RootState) => state.calendar.subRegion);
  const display = useSelector((state: RootState) => state.calendar.display, shallowEqual);
  
  // Use sub-region data if available, otherwise fall back to country default
  const locationData = useMemo((): LocationData => {
    if (subRegion) {
      const subRegionData = SUB_REGIONS[location]?.find(r => r.code === subRegion);
      if (subRegionData) {
        return {
          country: location,
          timezone: subRegionData.timezone,
          latitude: subRegionData.latitude,
          longitude: subRegionData.longitude,
          name: subRegionData.name,
          region: LOCATIONS[location].region,
        };
      }
    }
    return LOCATIONS[location];
  }, [location, subRegion]);
  
  const hemisphere = useMemo(() => locationData.latitude >= 0 ? 'N' : 'S', [locationData.latitude]);
  
  // Use SELECTED date for all calculations, fall back to view date
  const targetHekaDate = selectedDate || viewDate;
  
  // Create a stable reference date that includes current time
  const now = useMemo(() => new Date(), []);
  
  // Build civilDate with current time preserved (not midnight)
  const civilDate = useMemo(() => {
    const baseDate = hekaToCivil(targetHekaDate);
    // Preserve the current time of day for accurate countdown calculations
    baseDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    return baseDate;
  }, [targetHekaDate, now]);
  
  // NOTE: HEKA Calendar is Universal (like Gregorian calendar)
  // HEKA Year 2026, Month 11 (January), Day 7 is the SAME moment worldwide
  // - In Sydney: Feb 9, 2026 at 2:00 PM AEDT
  // - In New York: Feb 8, 2026 at 10:00 PM EST (previous day!)
  // - In London: Feb 9, 2026 at 3:00 AM GMT
  // 
  // The HEKA date doesn't change when you switch regions, but the local CIVIL time does.
  // If you want to see "today" in the new region, navigate to today's date after changing location.
  
  // Get memoized celestial data
  const celestialData = useCelestialData(civilDate, hemisphere, locationData, display);
  
  // Get seasonal event info - memoized
  const seasonalEventInfo = useMemo(() => {
    if (!celestialData.nextSeasonalEvent) return null;
    return getSeasonalEventInfo(celestialData.nextSeasonalEvent.name);
  }, [celestialData.nextSeasonalEvent]);
  
  // Calculate HEKA new year relative to SELECTED date - memoized
  const { hekaNewYear, hekaYearNumber } = useMemo(() => {
    const currentYS = getHekaYearStart(targetHekaDate.year);
    const nextYS = getHekaYearStart(targetHekaDate.year + 1);
    const hekaNY = civilDate.getTime() < currentYS.getTime() ? currentYS : nextYS;
    const yearNum = targetHekaDate.year + (civilDate.getTime() >= currentYS.getTime() ? 1 : 0);
    return { 
      hekaNewYear: hekaNY, 
      hekaYearNumber: yearNum,
    };
  }, [targetHekaDate.year, civilDate]);
  
  // Get date context - memoized
  const dateContext = useMemo(() => getDateContext(civilDate), [civilDate]);
  
  // Determine view type - memoized
  const { isHistoricalView, isFutureView } = useMemo(() => {
    const todayYear = new Date().getFullYear();
    return {
      isHistoricalView: civilDate.getFullYear() < todayYear,
      isFutureView: civilDate.getFullYear() > todayYear,
    };
  }, [civilDate]);
  
  // Static lookup objects
  const energyColors = useMemo(() => ({
    'very-high': '#ef4444',
    'high': '#f97316',
    'moderate': '#eab308',
    'low': '#22c55e',
    'very-low': '#3b82f6',
  }), []);
  
  const activityIcons: Record<string, string> = {
    'plant': '🌱',
    'transplant': '🪴',
    'harvest': '🌾',
    'prune': '✂️',
    'fertilize': '💧',
    'rest': '😴',
    'prepare': '📝',
  };
  
  // Generate contextual title - memoized
  const contextualTitle = useMemo(() => {
    if (dateContext.isToday) return "Today's Celestial Guide";
    if (dateContext.isPast) return `Celestial Guide for ${dateContext.diffDays} days ago`;
    return `Celestial Guide in ${dateContext.diffDays} days`;
  }, [dateContext]);
  
  // Calculate day of year - memoized
  const dayOfYear = useMemo(() => {
    const startOfYear = new Date(civilDate.getFullYear(), 0, 0);
    return Math.floor((civilDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  }, [civilDate]);
  
  // Check if countdowns should be shown (not for past dates)
  const showNewYearCountdown = civilDate.getTime() < hekaNewYear.getTime();
  const showSeasonalCountdown = celestialData.nextSeasonalEvent && 
    civilDate.getTime() < celestialData.nextSeasonalEvent.date.getTime();
  
  return (
    <div className="celestial-panel-container">
      <div className="celestial-panel__title" style={{ padding: '0 var(--space-4)' }}>
        <span>✦</span> {contextualTitle}
        <span className="celestial-date-context">
          {isHistoricalView && " 📜 Historical View"}
          {isFutureView && " 🔮 Future View"}
        </span>
        <span style={{ opacity: 0.5 }}>(scroll →)</span>
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
      
      {/* Selected Date Info Card */}
      {(isHistoricalView || isFutureView) && (
        <ExpandableCelestialCard
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
        </ExpandableCelestialCard>
      )}
      
      <div className="celestial-panel">
      
      {/* Always show: HEKA New Year */}
      <ExpandableCelestialCard
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
            <strong>🌍 Universal Calendar:</strong> Like the Gregorian calendar, HEKA dates are the same worldwide. HEKA Month {targetHekaDate.month + 1}, Day {targetHekaDate.day} is the same moment whether you're in Sydney, New York, or London - only the local civil time differs.
          </p>
        </InfoSection>
        {!showNewYearCountdown && (
          <InfoSection title="Status">
            <p>This HEKA year has begun. The next cycle begins April 1st, {hekaNewYear.getFullYear() + 1}.</p>
          </InfoSection>
        )}
      </ExpandableCelestialCard>
      
      {/* Day of the Week - Planetary Energy */}
      {(() => {
        const dayOfWeekData = [
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
        const dayInfo = dayOfWeekData[civilDate.getDay()];
        
        return (
          <ExpandableCelestialCard
            title={`${dayInfo.day}: Day of ${dayInfo.planet}`}
            subtitle={dayInfo.description}
            icon={dayInfo.symbol}
            accentColor={dayInfo.color}
          >
            <InfoSection title="Planetary Qualities">
              <InfoList items={dayInfo.qualities} />
            </InfoSection>
            <InfoSection title="Favorable Activities">
              <InfoList items={dayInfo.activities} />
            </InfoSection>
            <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
              ℹ️ Planetary day associations draw from traditional astrology and cultural symbolism.
            </div>
          </ExpandableCelestialCard>
        );
      })()}
      
      {/* Always show: Moon Phase */}
      <ExpandableCelestialCard
        title="Moon Phase"
        subtitle={`${celestialData.moonPhase.phase} • ${Math.round(celestialData.moonPhase.illumination)}% illuminated`}
        icon={celestialData.moonPhase.glyph}
        accentColor="#c4b5fd"
      >
        <div className="moon-phase-display">
          <span className="moon-phase-glyph">{celestialData.moonPhase.glyph}</span>
          <div className="moon-phase-details">
            <span className="moon-phase-name">{celestialData.moonPhase.phase}</span>
            <span className="moon-illumination">{Math.round(celestialData.moonPhase.illumination)}% illuminated</span>
            <span className="moon-age">Age: {Math.round(celestialData.moonPhase.age)} days</span>
          </div>
        </div>
        <InfoSection title="Energetic Influence">
          <InfoList items={[
            celestialData.moonPhase.waxing ? "Waxing: Building energy, growth, accumulation" : "Waning: Releasing, letting go, completion",
            celestialData.moonPhase.illumination > 50 ? "More than half: Peak manifestation power" : "Less than half: Introspection and planning",
            celestialData.moonPhase.age < 7 ? "New to First Quarter: Begin new projects" : 
              celestialData.moonPhase.age < 14 ? "First Quarter to Full: Build momentum" :
              celestialData.moonPhase.age < 21 ? "Full to Last Quarter: Harvest results" :
              "Last Quarter to New: Release and rest"
          ]} />
        </InfoSection>
        <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
          ℹ️ Moon phases are calculated mathematically and may vary slightly from astronomical observations.
        </div>
      </ExpandableCelestialCard>
      
      {/* Seasonal Events enabled: Current Season */}
      {display.showCelestialCards && celestialData.currentSeason && (
        <ExpandableCelestialCard
          title={`${celestialData.currentSeason.emoji} ${celestialData.currentSeason.name}`}
          subtitle={`Element: ${celestialData.currentSeason.element} • ${celestialData.daysUntilNextSeason} days until next season`}
          icon={celestialData.currentSeason.emoji}
          accentColor={getSeasonElementColor(celestialData.currentSeason.element)}
        >
          <div className="season-display">
            <InfoBadge label="Element" value={celestialData.currentSeason.element} color={getSeasonElementColor(celestialData.currentSeason.element)} />
            <InfoBadge label="Days Remaining" value={`${celestialData.daysUntilNextSeason} days`} />
          </div>
          <InfoSection title="About This Season">
            <p>{celestialData.currentSeason.description}</p>
          </InfoSection>
          <InfoSection title="Characteristics">
            <InfoList items={celestialData.currentSeason.characteristics} />
          </InfoSection>
          <InfoSection title="Seasonal Activities">
            <InfoList items={celestialData.currentSeason.activities} />
          </InfoSection>
        </ExpandableCelestialCard>
      )}
      
      {/* Seasonal Events enabled: Next Seasonal Event */}
      {display.showCelestialCards && celestialData.nextSeasonalEvent && seasonalEventInfo && (
        <ExpandableCelestialCard
          title={seasonalEventInfo.name}
          subtitle={`From ${HEKA_MONTHS[targetHekaDate.month].name} ${targetHekaDate.day}`}
          icon={seasonalEventInfo.symbol}
          accentColor="#e8c97a"
        >
          {showSeasonalCountdown && (
            <CountdownDisplay 
              targetDate={celestialData.nextSeasonalEvent.date}
              fromDate={civilDate}
              label={celestialData.nextSeasonalEvent.name}
              symbol={celestialData.nextSeasonalEvent.symbol}
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
        </ExpandableCelestialCard>
      )}
      
      {/* Solar Noon - always show if available */}
      {celestialData.solarNoon && (
        <ExpandableCelestialCard
          title="Solar Noon"
          subtitle={`Sun at highest point on this day`}
          icon="☀️"
          accentColor="#fbbf24"
        >
          <div className="solar-noon-display">
            <span className="solar-noon-time">
              {celestialData.solarNoon.time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
              })}
            </span>
            <span className="solar-noon-elevation">
              Sun elevation: {celestialData.solarNoon.elevation}°
            </span>
          </div>
          <InfoSection title="About Solar Noon">
            <p><strong>Local Time:</strong> The Sun reaches its highest point at {celestialData.solarNoon.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ({locationData.timezone})</p>
          </InfoSection>
          <InfoSection title="Historical Significance">
            <p>Ancient cultures used solar noon for timekeeping. Stone circles and sundials were aligned to mark this moment.</p>
          </InfoSection>
          <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
            ℹ️ Times are mathematical approximations (±10-15 min). Precise solar noon varies by your exact location and date.
          </div>
        </ExpandableCelestialCard>
      )}
      
      {/* Lunar Month - always show */}
      {celestialData.lunarMonth && (
        <ExpandableCelestialCard
          title="Lunar Cycle"
          subtitle={celestialData.lunarMonth.name}
          icon="🌙"
          accentColor="#c4b5fd"
        >
          <div className="lunar-month-display">
            <InfoBadge label="New Moon (Civil)" value={celestialData.lunarMonth.newMoon.toLocaleDateString()} />
            <InfoBadge label="Full Moon (Civil)" value={celestialData.lunarMonth.fullMoon.toLocaleDateString()} />
          </div>
          <InfoSection title="This Moon Cycle">
            <p><strong>Civil Date:</strong> {civilDate.toLocaleDateString()} — The Moon was in the {celestialData.lunarMonth.name} cycle.</p>
          </InfoSection>
          <InfoSection title="Energetic Qualities">
            <InfoList items={[
              "New Moon: Beginnings, setting intentions",
              "Waxing: Growth, building momentum",
              "Full Moon: Peak energy, manifestation",
              "Waning: Release, reflection, completion"
            ]} />
          </InfoSection>
        </ExpandableCelestialCard>
      )}
      
      {/* Agricultural Guidance - only when enabled */}
      {display.showCelestialCards && celestialData.agGuidance && (
        <ExpandableCelestialCard
          title="Agricultural Guidance"
          subtitle={`For ${HEKA_MONTHS[targetHekaDate.month].name} ${targetHekaDate.day}`}
          icon={activityIcons[celestialData.agGuidance.activity] || '🌱'}
          accentColor="#86efac"
        >
          <div className="ag-guidance-display">
            <span className="ag-activity">{activityIcons[celestialData.agGuidance.activity]} {celestialData.agGuidance.description}</span>
            <span className={`ag-confidence ag-confidence--${celestialData.agGuidance.confidence}`}>
              Confidence: {celestialData.agGuidance.confidence}
            </span>
          </div>
          <InfoSection title="Why This Day?">
            <p><strong>Civil Date:</strong> {civilDate.toLocaleDateString()} — The moon phase and seasonal factors indicated optimal conditions for {celestialData.agGuidance.activity} activities.</p>
          </InfoSection>
          <InfoSection title="Biodynamic Principle">
            <p>This guidance follows the cosmic rhythms affecting plant vitality and soil conditions.</p>
          </InfoSection>
        </ExpandableCelestialCard>
      )}
      
      {/* Energy Forecast - only when enabled */}
      {display.showCelestialCards && celestialData.energyForecast && (
        <ExpandableCelestialCard
          title="Cosmic Energy"
          subtitle={`Civil: ${civilDate.toLocaleDateString()}`}
          icon="⚡"
          accentColor={energyColors[celestialData.energyForecast.level]}
        >
          <div className="energy-forecast-display">
            <div className="energy-level-bar">
              <div 
                className="energy-level-fill"
                style={{ 
                  width: celestialData.energyForecast.level === 'very-high' ? '100%' : 
                         celestialData.energyForecast.level === 'high' ? '80%' :
                         celestialData.energyForecast.level === 'moderate' ? '60%' :
                         celestialData.energyForecast.level === 'low' ? '40%' : '20%',
                  background: energyColors[celestialData.energyForecast.level],
                }}
              />
            </div>
            <p className="energy-description">{celestialData.energyForecast.description}</p>
            <div className="energy-factors">
              {celestialData.energyForecast.factors.map((factor, i) => (
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
        </ExpandableCelestialCard>
      )}
      
      {/* Numerology - always show */}
      <ExpandableCelestialCard
        title={`Numerology: Day ${celestialData.numerology.dayNumber}`}
        subtitle={`Civil: ${civilDate.toLocaleDateString()}`}
        icon="🔢"
        accentColor="#d4bc7a"
      >
        <div className="numerology-display">
          <span className="numerology-number">
            {celestialData.numerology.masterNumber || celestialData.numerology.dayNumber}
          </span>
          <span className="numerology-meaning">{celestialData.numerology.meaning}</span>
        </div>
        <InfoSection title="Today's Energy">
          <p>{celestialData.numerology.energy}</p>
        </InfoSection>
        <InfoSection title="Focus Areas">
          <InfoList items={celestialData.numerology.focus} />
        </InfoSection>
        <InfoSection title="Guidance">
          <p>{celestialData.numerology.guidance}</p>
        </InfoSection>
        <div className="numerology-meta">
          <InfoBadge label="Compatible" value={celestialData.numerology.compatibleNumbers.join(', ')} color="#86efac" />
          <InfoBadge label="Lucky Hours" value={celestialData.numerology.luckyHours.join(', ')} color="#fbbf24" />
        </div>
      </ExpandableCelestialCard>
      
      {/* Zodiac - always show */}
      <ZodiacCard zodiac={getCurrentSunSign(civilDate)} />
      
      {/* Chinese Zodiac - always show */}
      <ChineseZodiacCard year={civilDate.getFullYear()} />
      </div>
    </div>
  );
};

// Export memoized version
export const CelestialPanel = memo(CelestialPanelComponent);
CelestialPanel.displayName = 'CelestialPanel';

export default CelestialPanel;
