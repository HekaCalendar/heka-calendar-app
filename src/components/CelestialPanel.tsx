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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('celestial');
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
          <span className="countdown-unit-label">{t('countdown.days')}</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown-unit-label">{t('countdown.hours')}</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="countdown-unit-label">{t('countdown.minutes')}</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="countdown-unit-label">{t('countdown.seconds')}</span>
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
  const { t, i18n } = useTranslation('celestial');
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
  
  // Build civilDate with current time preserved (not midnight)
  const civilDate = useMemo(() => {
    const baseDate = hekaToCivil(targetHekaDate);
    const now = new Date();
    // Preserve the current time of day for accurate countdown calculations
    baseDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    return baseDate;
  }, [targetHekaDate]);
  
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(civilDate);
    selected.setHours(0, 0, 0, 0);
    return {
      isHistoricalView: selected.getTime() < today.getTime(),
      isFutureView: selected.getTime() > today.getTime(),
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
    if (dateContext.isToday) return t('title');
    if (dateContext.isPast) return t('titlePast', { days: dateContext.diffDays });
    return t('titleFuture', { days: dateContext.diffDays });
  }, [dateContext, t]);
  
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
          {isHistoricalView && `📜 ${t('historicalView')}`}
          {isFutureView && `🔮 ${t('futureView')}`}
        </span>
        <span style={{ opacity: 0.5 }}>{t('scrollHint')}</span>
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
        ℹ️ <strong>{t('hekaCalendarIsUniversal')}</strong> {t('universalCalendarDescription')}
      </div>
      
      {/* Selected Date Info Card */}
      {(dateContext.isPast || dateContext.isFuture) && (
        <ExpandableCelestialCard
          title={`${HEKA_MONTHS[targetHekaDate.month].name} ${targetHekaDate.day}, ${targetHekaDate.year}`}
          subtitle={t('selectedDate')}
          icon="📅"
          accentColor="#c9a227"
          defaultExpanded={true}
        >
          <div className="selected-date-info">
            <InfoBadge 
              label={t('civilDate')} 
              value={new Intl.DateTimeFormat(i18n.language || 'en', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }).format(civilDate)} 
            />
            <InfoBadge label={t('dayOfYear')} value={t('dayOfYearValue', { day: dayOfYear })} />
            {dateContext.isPast && (
              <InfoSection title={t('lookingBack')}>
                <p>{t('lookingBackDescription')}</p>
              </InfoSection>
            )}
            {dateContext.isFuture && (
              <InfoSection title={t('lookingForward')}>
                <p>{t('lookingForwardDescription')}</p>
              </InfoSection>
            )}
          </div>
        </ExpandableCelestialCard>
      )}
      
      <div className="celestial-panel">
      
      {/* Always show: HEKA New Year */}
      <ExpandableCelestialCard
        title={t('hekaYearBegins', { year: hekaYearNumber })}
        subtitle={civilDate.getTime() < hekaNewYear.getTime() 
          ? t('startingCivil', { date: hekaNewYear.toLocaleDateString() }) 
          : t('beganCivil', { date: hekaNewYear.toLocaleDateString() })}
        icon="🌅"
        accentColor="#c9a227"
      >
        {showNewYearCountdown && (
          <CountdownDisplay 
            targetDate={hekaNewYear}
            fromDate={civilDate}
            label={t('hekaYearLabel', { year: hekaYearNumber })}
            symbol="🌅"
          />
        )}
        <InfoSection title={t('aboutThisHekaYear')}>
          <p>{t('aboutThisHekaYearDescription', { year: hekaYearNumber, civilYear: hekaNewYear.getFullYear() })}</p>
          <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
            <strong>🌍 {t('universalCalendar')}:</strong> {t('universalCalendarNote', { month: targetHekaDate.month + 1, day: targetHekaDate.day })}
          </p>
        </InfoSection>
        {!showNewYearCountdown && (
          <InfoSection title={t('status')}>
            <p>{t('hekaYearBegunDescription', { nextYear: hekaNewYear.getFullYear() + 1 })}</p>
          </InfoSection>
        )}
      </ExpandableCelestialCard>
      
      {/* Day of the Week - Planetary Energy */}
      {(() => {
        const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
        const daySymbols = ['☉', '☽', '♂', '☿', '♃', '♀', '♄'] as const;
        const planetKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'] as const;
        const dayEmojis = ['☀️', '🌙', '⚔️', '📜', '⚡', '💕', '🪐'] as const;
        const dayColors = ['#fbbf24', '#c4b5fd', '#ef4444', '#22c55e', '#a78bfa', '#ec4899', '#6b7280'] as const;

        const dayIndex = civilDate.getDay();
        const dayKey = dayKeys[dayIndex];
        const dayInfo = {
          day: t(`planetaryDays.${dayKey}.day`),
          planet: `${t(`planets.${planetKeys[dayIndex]}`)} ${daySymbols[dayIndex]}`,
          symbol: dayEmojis[dayIndex],
          color: dayColors[dayIndex],
          qualities: t(`planetaryDays.${dayKey}.qualities`, { returnObjects: true }) as string[],
          activities: t(`planetaryDays.${dayKey}.activities`, { returnObjects: true }) as string[],
          description: t(`planetaryDays.${dayKey}.description`),
        };

        return (
          <ExpandableCelestialCard
            title={t('dayOfPlanet', { day: dayInfo.day, planet: dayInfo.planet })}
            subtitle={dayInfo.description}
            icon={dayInfo.symbol}
            accentColor={dayInfo.color}
          >
            <InfoSection title={t('planetaryQualities')}>
              <InfoList items={dayInfo.qualities} />
            </InfoSection>
            <InfoSection title={t('favorableActivities')}>
              <InfoList items={dayInfo.activities} />
            </InfoSection>
            <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
              ℹ️ {t('planetaryDayDisclaimer')}
            </div>
          </ExpandableCelestialCard>
        );
      })()}
      
      {/* Always show: Moon Phase */}
      <ExpandableCelestialCard
        title={t('cards.moonPhase.title')}
        subtitle={`${celestialData.moonPhase.phase} • ${Math.round(celestialData.moonPhase.illumination)}% ${t('cards.moonPhase.illuminated')}`}
        icon={celestialData.moonPhase.glyph}
        accentColor="#c4b5fd"
      >
        <div className="moon-phase-display">
          <span className="moon-phase-glyph">{celestialData.moonPhase.glyph}</span>
          <div className="moon-phase-details">
            <span className="moon-phase-name">{celestialData.moonPhase.phase}</span>
            <span className="moon-illumination">{Math.round(celestialData.moonPhase.illumination)}% {t('cards.moonPhase.illuminated')}</span>
            <span className="moon-age">{t('cards.moonPhase.age')}: {Math.round(celestialData.moonPhase.age)} {t('countdown.days')}</span>
          </div>
        </div>
        <InfoSection title={t('energeticInfluence')}>
          <InfoList items={[
            celestialData.moonPhase.waxing ? t('waxingDescription') : t('waningDescription'),
            celestialData.moonPhase.illumination > 50 ? t('illuminationMoreThanHalf') : t('illuminationLessThanHalf'),
            celestialData.moonPhase.age < 7 ? t('newToFirstQuarter') : 
              celestialData.moonPhase.age < 14 ? t('firstQuarterToFull') :
              celestialData.moonPhase.age < 21 ? t('fullToLastQuarter') :
              t('lastQuarterToNew')
          ]} />
        </InfoSection>
        <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
          ℹ️ {t('moonPhaseDisclaimer')}
        </div>
      </ExpandableCelestialCard>
      
      {/* Seasonal Events enabled: Current Season */}
      {display.showCelestialCards && celestialData.currentSeason && (
        <ExpandableCelestialCard
          title={`${celestialData.currentSeason.emoji} ${celestialData.currentSeason.name}`}
          subtitle={`${t('element')}: ${t(`elements.${celestialData.currentSeason.element.toLowerCase()}`)} • ${celestialData.daysUntilNextSeason} ${t('daysUntilNextSeason')}`}
          icon={celestialData.currentSeason.emoji}
          accentColor={getSeasonElementColor(celestialData.currentSeason.element)}
        >
          <div className="season-display">
            <InfoBadge label={t('element')} value={t(`elements.${celestialData.currentSeason.element.toLowerCase()}`)} color={getSeasonElementColor(celestialData.currentSeason.element)} />
            <InfoBadge label={t('daysRemaining')} value={`${celestialData.daysUntilNextSeason} ${t('countdown.days')}`} />
          </div>
          <InfoSection title={t('aboutThisSeason')}>
            <p>{celestialData.currentSeason.description}</p>
          </InfoSection>
          <InfoSection title={t('characteristics')}>
            <InfoList items={celestialData.currentSeason.characteristics} />
          </InfoSection>
          <InfoSection title={t('seasonalActivities')}>
            <InfoList items={celestialData.currentSeason.activities} />
          </InfoSection>
        </ExpandableCelestialCard>
      )}
      
      {/* Seasonal Events enabled: Next Seasonal Event */}
      {display.showCelestialCards && celestialData.nextSeasonalEvent && seasonalEventInfo && (
        <ExpandableCelestialCard
          title={seasonalEventInfo.name}
          subtitle={t('fromDate', { month: HEKA_MONTHS[targetHekaDate.month].name, day: targetHekaDate.day })}
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
          <InfoSection title={t('whatIsIt')}>
            <p>{seasonalEventInfo.description}</p>
          </InfoSection>
          <InfoSection title={t('significance')}>
            <p>{seasonalEventInfo.significance}</p>
          </InfoSection>
          <InfoSection title={t('howToObserve')}>
            <p>{seasonalEventInfo.observance}</p>
          </InfoSection>
          {seasonalEventInfo.traditions.length > 0 && (
            <InfoSection title={t('traditions')}>
              <InfoList items={seasonalEventInfo.traditions.slice(0, 4)} />
            </InfoSection>
          )}
        </ExpandableCelestialCard>
      )}
      
      {/* Solar Noon - always show if available */}
      {celestialData.solarNoon && (
        <ExpandableCelestialCard
          title={t('solarNoon')}
          subtitle={t('solarNoonSubtitle')}
          icon="☀️"
          accentColor="#fbbf24"
        >
          <div className="solar-noon-display">
            <span className="solar-noon-time">
              {new Intl.DateTimeFormat(i18n.language || 'en', { 
                hour: '2-digit', 
                minute: '2-digit',
              }).format(celestialData.solarNoon.time)}
            </span>
            <span className="solar-noon-elevation">
              {t('sunElevation', { elevation: celestialData.solarNoon.elevation })}
            </span>
          </div>
          <InfoSection title={t('aboutSolarNoon')}>
            <p><strong>{t('localTime')}</strong> {t('solarNoonLocalTimeDescription', { time: new Intl.DateTimeFormat(i18n.language || 'en', { hour: '2-digit', minute: '2-digit' }).format(celestialData.solarNoon.time), timezone: locationData.timezone })}</p>
          </InfoSection>
          <InfoSection title={t('historicalSignificance')}>
            <p>{t('solarNoonHistoricalDescription')}</p>
          </InfoSection>
          <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', fontStyle: 'italic' }}>
            ℹ️ {t('solarNoonDisclaimer')}
          </div>
        </ExpandableCelestialCard>
      )}
      
      {/* Lunar Month - always show */}
      {celestialData.lunarMonth && (
        <ExpandableCelestialCard
          title={t('lunarCycle')}
          subtitle={celestialData.lunarMonth.name}
          icon="🌙"
          accentColor="#c4b5fd"
        >
          <div className="lunar-month-display">
            <InfoBadge label={t('newMoonCivil')} value={celestialData.lunarMonth.newMoon.toLocaleDateString()} />
            <InfoBadge label={t('fullMoonCivil')} value={celestialData.lunarMonth.fullMoon.toLocaleDateString()} />
          </div>
          <InfoSection title={t('thisMoonCycle')}>
            <p><strong>{t('civilDate')}:</strong> {civilDate.toLocaleDateString()} — {t('thisMoonCycleDescription', { name: celestialData.lunarMonth.name })}</p>
          </InfoSection>
          <InfoSection title={t('energeticQualities')}>
            <InfoList items={[
              t('newMoonQuality'),
              t('waxingQuality'),
              t('fullMoonQuality'),
              t('waningQuality')
            ]} />
          </InfoSection>
        </ExpandableCelestialCard>
      )}
      
      {/* Agricultural Guidance - only when enabled */}
      {display.showCelestialCards && celestialData.agGuidance && (
        <ExpandableCelestialCard
          title={t('agriculturalGuidance')}
          subtitle={t('forDate', { month: HEKA_MONTHS[targetHekaDate.month].name, day: targetHekaDate.day })}
          icon={activityIcons[celestialData.agGuidance.activity] || '🌱'}
          accentColor="#86efac"
        >
          <div className="ag-guidance-display">
            <span className="ag-activity">{activityIcons[celestialData.agGuidance.activity]} {celestialData.agGuidance.description}</span>
            <span className={`ag-confidence ag-confidence--${celestialData.agGuidance.confidence}`}>
              {t('confidence')} {celestialData.agGuidance.confidence}
            </span>
          </div>
          <InfoSection title={t('whyThisDay')}>
            <p><strong>{t('civilDate')}:</strong> {civilDate.toLocaleDateString()} — {t('whyThisDayDescription', { activity: t(`activities.${celestialData.agGuidance.activity}`) })}</p>
          </InfoSection>
          <InfoSection title={t('biodynamicPrinciple')}>
            <p>{t('biodynamicPrincipleDescription')}</p>
          </InfoSection>
        </ExpandableCelestialCard>
      )}
      
      {/* Energy Forecast - only when enabled */}
      {display.showCelestialCards && celestialData.energyForecast && (
        <ExpandableCelestialCard
          title={t('cosmicEnergy')}
          subtitle={`${t('civil')}: ${civilDate.toLocaleDateString()}`}
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
          <InfoSection title={t('cosmicConditions')}>
            <p>{t('energyForecastPrefix')} <strong>{t('civilDate')}:</strong> {t('energyForecastSuffix', { date: civilDate.toLocaleDateString() })}</p>
          </InfoSection>
          <InfoSection title={t('howToUseThis')}>
            <InfoList items={[
              t('highEnergy'),
              t('moderateEnergy'),
              t('lowEnergy')
            ]} />
          </InfoSection>
        </ExpandableCelestialCard>
      )}
      
      {/* Numerology - always show */}
      <ExpandableCelestialCard
        title={t('numerologyTitle', { day: celestialData.numerology.dayNumber })}
        subtitle={`${t('civil')}: ${civilDate.toLocaleDateString()}`}
        icon="🔢"
        accentColor="#d4bc7a"
      >
        <div className="numerology-display">
          <span className="numerology-number">
            {celestialData.numerology.masterNumber || celestialData.numerology.dayNumber}
          </span>
          <span className="numerology-meaning">{celestialData.numerology.meaning}</span>
        </div>
        <InfoSection title={t('todaysEnergy')}>
          <p>{celestialData.numerology.energy}</p>
        </InfoSection>
        <InfoSection title={t('focusAreas')}>
          <InfoList items={celestialData.numerology.focus} />
        </InfoSection>
        <InfoSection title={t('guidance')}>
          <p>{celestialData.numerology.guidance}</p>
        </InfoSection>
        <div className="numerology-meta">
          <InfoBadge label={t('compatible')} value={celestialData.numerology.compatibleNumbers.join(', ')} color="#86efac" />
          <InfoBadge label={t('luckyHours')} value={celestialData.numerology.luckyHours.join(', ')} color="#fbbf24" />
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
