/**
 * Calendar Grid Component - Performance Optimized
 * 
 * Optimizations applied:
 * - React.memo with custom comparison for DayCell
 * - useMemo for all expensive computations
 * - useCallback for stable function references
 * - CSS containment for paint isolation
 * - will-change hints for GPU acceleration
 * - Virtualization ready (if needed for larger grids)
 */

import { useMemo, useCallback, memo, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../store';
import { selectDate, addNote, selectMonthNotes, selectMonthPlannerTasks } from '../store';
import { generateMonthGrid, getNoteKey, getArcType } from '../services/calendarService';
import { getHolidaysForDateWithSubRegion, type SubRegionCode, type CountryCode } from '../types';
import type { CalendarDay, ArcType, DayItem } from '../types';
import { calculateMoonPhaseBatch } from '../astrology/services/calculations/swissCalculations';
import { calculateTrueSolarReturn } from '../astrology/services/calculations/nakshatras';
import { calculateJulianDay, calculateAllPlanets } from '../astrology/services/swiss-ephemeris/engine';
import { useFeatureDiscovery } from '../hooks/useGamification';
import { QuickNoteModal } from './QuickNoteModal';
import { RoutineUploader } from './routine';

// ============================================================================
// Arc Colors for Month Header
// ============================================================================

const ARC_COLORS: Record<ArcType, { bg: string; border: string; text: string; glow: string }> = {
  OPENING: { 
    bg: 'rgba(220, 38, 38, 0.15)', 
    border: 'rgba(220, 38, 38, 0.4)', 
    text: '#fca5a5',
    glow: 'rgba(220, 38, 38, 0.3)',
  },
  CORE: { 
    bg: 'rgba(34, 197, 94, 0.15)', 
    border: 'rgba(34, 197, 94, 0.4)', 
    text: '#86efac',
    glow: 'rgba(34, 197, 94, 0.3)',
  },
  CLOSING: { 
    bg: 'rgba(124, 58, 237, 0.15)', 
    border: 'rgba(124, 58, 237, 0.4)', 
    text: '#c4b5fd',
    glow: 'rgba(124, 58, 237, 0.3)',
  },
};

// ============================================================================
// Optimized Day Cell Component
// ============================================================================

interface DayCellProps {
  day: CalendarDay;
  isSelected: boolean;
  onClick: () => void;
  onLongPress?: () => void;
  showCivil: boolean;
  showMoon: boolean;
  showHolidays: boolean;
  location: string;
  subRegion: SubRegionCode | null;
  dayNotes: DayItem[];
  isExpanded?: boolean;
  isExpandedHorizontal?: boolean;
}

/** Custom comparison for DayCell - only re-render when necessary */
function dayCellPropsAreEqual(prev: DayCellProps, next: DayCellProps): boolean {
  return (
    prev.day.hekaDate.day === next.day.hekaDate.day &&
    prev.day.hekaDate.month === next.day.hekaDate.month &&
    prev.day.hekaDate.year === next.day.hekaDate.year &&
    prev.isSelected === next.isSelected &&
    prev.showCivil === next.showCivil &&
    prev.showMoon === next.showMoon &&
    prev.showHolidays === next.showHolidays &&
    prev.location === next.location &&
    prev.subRegion === next.subRegion &&
    dayItemsAreEqual(prev.dayNotes, next.dayNotes) &&
    prev.day.isToday === next.day.isToday &&
    prev.day.moonPhase === next.day.moonPhase &&
    prev.day.isSolarReturn === next.day.isSolarReturn &&
    prev.isExpanded === next.isExpanded &&
    prev.isExpandedHorizontal === next.isExpandedHorizontal
  );
}

// Separate component for blank cells (no hooks)
const BlankCell = memo(() => (
  <div className="day-cell day-cell--blank" aria-hidden="true" />
));
BlankCell.displayName = 'BlankCell';

// Separate component for day cells with hooks
const DayCellContent = memo(({ day, isSelected, onClick, onLongPress, showCivil, showMoon, showHolidays, location, subRegion, dayNotes, isExpanded = false, isExpandedHorizontal = false }: DayCellProps) => {
  const { t } = useTranslation('calendar');
  // Memoize holiday check - expensive operation
  const hasHoliday = useMemo(() => {
    if (!showHolidays || location === 'NONE') return false;
    return getHolidaysForDateWithSubRegion(day.civilDate, location as CountryCode, subRegion || undefined).length > 0;
  }, [showHolidays, location, subRegion, day.civilDate]);
  
  const hasNotes = dayNotes.length > 0;
  
  // In expanded modes, show more note content
  const isAnyExpanded = isExpanded || isExpandedHorizontal;
  const maxNoteLength = isAnyExpanded ? 80 : 25;
  const maxNotesToShow = isAnyExpanded ? 3 : 1;
  
  const visibleNotes = dayNotes.slice(0, maxNotesToShow);
  const hasMoreNotes = dayNotes.length > maxNotesToShow;

  // Long-press state
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const LONG_PRESS_DURATION = 500;
  const TOUCH_MOVE_THRESHOLD = 15;

  const startLongPress = useCallback(() => {
    setIsLongPressing(false);
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      if (navigator.vibrate) navigator.vibrate(20);
      onLongPress?.();
    }, LONG_PRESS_DURATION);
  }, [onLongPress]);

  const cancelLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    startLongPress();
  }, [startLongPress]);

  const handleMouseUp = useCallback(() => {
    cancelLongPress();
  }, [cancelLongPress]);

  const handleMouseLeave = useCallback(() => {
    cancelLongPress();
  }, [cancelLongPress]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    startLongPress();
  }, [startLongPress]);

  const handleTouchEnd = useCallback(() => {
    cancelLongPress();
    touchStartPosRef.current = null;
  }, [cancelLongPress]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);
    if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) {
      cancelLongPress();
    }
  }, [cancelLongPress]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);
  
  // Combine class names efficiently
  const className = useMemo(() => {
    const classes = ['day-cell'];
    if (isSelected) classes.push('day-cell--selected');
    if (day.isToday) classes.push('day-cell--today');
    if (isLongPressing) classes.push('long-pressing');
    return classes.join(' ');
  }, [isSelected, day.isToday, isLongPressing]);
  
  return (
    <button
      className={className}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={`${t(`months.${day.hekaDate.month}`)} ${day.hekaDate.day}`}
      aria-selected={isSelected}
      role="gridcell"
      style={{ contain: 'layout style paint' }}
    >
      <div className="day-cell__header">
        <span className="day-cell__heka-num">{day.hekaDate.day}</span>
        <div className="day-cell__celestial-badges">
          {showMoon && day.moonPhase && (
            <span 
              className="day-cell__moon" 
              aria-hidden="true"
              title={day.moonPhaseName || t('moonPhase')}
            >
              {day.moonPhase}
            </span>
          )}
          {day.isSolarReturn && (
            <span
              className="day-cell__solar-return"
              aria-hidden="true"
              title={`True Solar Return${day.solarReturnOrb ? ` — ${day.solarReturnOrb.toFixed(1)}′ from exact` : ''}`}
            >
              ☀️
            </span>
          )}
        </div>
      </div>
      
      {showCivil && (
        <div className="day-cell__civil">
          {day.civilDate.getDate()} {t(`civilMonths.${day.civilDate.getMonth()}`)}
        </div>
      )}
      
      {hasNotes && (
        <div className={`day-cell__note-preview ${isAnyExpanded ? 'day-cell__note-preview--expanded' : ''}`}>
          {visibleNotes.map((note, index) => {
            const isQuickNote = !('isTask' in note) && note.tags?.includes('quick note');
            return (
              <div key={index} className="note-preview-item">
                {isQuickNote && <span className="note-preview-tag">Q</span>}
                <span className="note-preview-text">
                  {note.content.slice(0, maxNoteLength)}{note.content.length > maxNoteLength ? '...' : ''}
                </span>
              </div>
            );
          })}
          {hasMoreNotes && <span className="note-more-indicator">{t('moreNotes', { count: dayNotes.length - maxNotesToShow })}</span>}
        </div>
      )}
      
      {hasHoliday && (
        <div className="day-cell__holiday-indicator" aria-label={t('holiday')} />
      )}
    </button>
  );
}, dayCellPropsAreEqual);
DayCellContent.displayName = 'DayCellContent';

// Main DayCell component that chooses between blank and content
const DayCell = (props: DayCellProps) => {
  const isBlank = props.day.hekaDate.day === 0;
  if (isBlank) {
    return <BlankCell />;
  }
  return <DayCellContent {...props} />;
};

function dayItemsAreEqual(prev: DayItem[], next: DayItem[]): boolean {
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i++) {
    const p = prev[i];
    const n = next[i];
    if (p.id !== n.id || p.content !== n.content) return false;
    // Check quick-note tag equality
    const pTags = 'tags' in p ? p.tags : undefined;
    const nTags = 'tags' in n ? n.tags : undefined;
    if (JSON.stringify(pTags) !== JSON.stringify(nTags)) return false;
  }
  return true;
}

DayCell.displayName = 'DayCell';

// ============================================================================
// Main Calendar Grid
// ============================================================================

interface CalendarGridProps {
  isExpanded?: boolean;
  isExpandedHorizontal?: boolean;
  isPureMode?: boolean;
  isLightMode?: boolean;
  onToggleLightDark?: () => void;
}

export const CalendarGrid = memo(({ isExpanded = false, isExpandedHorizontal = false, isPureMode, isLightMode, onToggleLightDark }: CalendarGridProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('calendar');
  const { discover } = useFeatureDiscovery();
  
  // Use individual selectors for granular updates
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate, shallowEqual);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate, shallowEqual);
  const display = useSelector((state: RootState) => state.calendar.display, shallowEqual);
  const location = useSelector((state: RootState) => state.calendar.location);
  const subRegion = useSelector((state: RootState) => state.calendar.subRegion as SubRegionCode | null);
  const notes = useSelector(selectMonthNotes, shallowEqual);
  const plannerTasks = useSelector(selectMonthPlannerTasks, shallowEqual);

  const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
  const astroProfiles = useSelector((state: RootState) => state.calendar.astroProfiles);
  const selectedAstroProfileId = useSelector((state: RootState) => state.calendar.selectedAstroProfileId);
  
  // Get hemisphere for moon phase calculations
  const hemisphere = useSelector((state: RootState) => {
    const loc = state.calendar.location;
    // Australia is Southern Hemisphere, all others default to Northern
    return loc === 'AU' ? 'S' : 'N';
  });
  
  // Memoize grid generation - recompute when month/year or timeMode changes
  const gridDays = useMemo(() => {
    return generateMonthGrid(viewDate.year, viewDate.month, {
      includeToday: true,
    });
  }, [viewDate.year, viewDate.month, timeMode]);
  
  // Swiss Ephemeris moon phases - precise calculation
  const [swissMoonPhases, setSwissMoonPhases] = useState<Map<string, { glyph: string; name: string }>>(new Map());

  useEffect(() => {
    if (!display.showMoonPhases) return;

    // Get all dates that need moon phases (actual days, not blanks)
    const dates = gridDays
      .filter(day => day.hekaDate.day !== 0)
      .map(day => day.civilDate);

    let cancelled = false;

    // Defer the heavy WASM batch to an idle window so month navigation stays smooth.
    const runBatch = () => {
      if (cancelled) return;
      calculateMoonPhaseBatch(dates, hemisphere)
        .then(phases => {
          if (cancelled) return;
          const phaseMap = new Map<string, { glyph: string; name: string }>();
          phases.forEach((data, dateKey) => {
            phaseMap.set(dateKey, { glyph: data.glyph, name: data.name });
          });
          setSwissMoonPhases(phaseMap);
        })
        .catch(() => {
          if (cancelled) return;
          // Silently fail - grid will show approximate phases
          setSwissMoonPhases(new Map());
        });
    };

    const idleId = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback(runBatch, { timeout: 200 })
      : setTimeout(runBatch, 1);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as number);
      }
    };
  }, [gridDays, display.showMoonPhases, hemisphere]);

  // True Solar Return calculation — TRUE mode only
  const { solarReturnDate, solarReturnOrb, activeProfileWithSiderealSun } = useMemo(() => {
    if (timeMode !== 'TRUE' || !selectedAstroProfileId) {
      return { solarReturnDate: null, solarReturnOrb: 0, activeProfileWithSiderealSun: false };
    }

    const profile = astroProfiles.find(p => p.id === selectedAstroProfileId);
    if (!profile?.birthDate) {
      return { solarReturnDate: null, solarReturnOrb: 0, activeProfileWithSiderealSun: false };
    }

    try {
      const birthDate = new Date(profile.birthDate);
      // Calculate sidereal Sun longitude at birth
      const birthJD = calculateJulianDay(
        birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate(),
        birthDate.getHours(), birthDate.getMinutes(), 0
      );
      const birthPositions = calculateAllPlanets(birthJD, ['sun'], 'sidereal');
      const birthSunLon = birthPositions.sun?.longitude;

      if (birthSunLon === undefined) {
        return { solarReturnDate: null, solarReturnOrb: 0, activeProfileWithSiderealSun: false };
      }

      // Calculate true solar return for the grid year
      const sr = calculateTrueSolarReturn(
        birthSunLon,
        viewDate.year,
        birthDate.getMonth(),
        birthDate.getDate()
      );

      if (sr) {
        return {
          solarReturnDate: sr.date,
          solarReturnOrb: sr.orb,
          activeProfileWithSiderealSun: true,
        };
      }
    } catch (e) {
      console.warn('[CalendarGrid] Solar return calculation failed:', e);
    }

    return { solarReturnDate: null, solarReturnOrb: 0, activeProfileWithSiderealSun: false };
  }, [timeMode, selectedAstroProfileId, astroProfiles, viewDate.year]);

  // Enhance grid days with Swiss moon phases + lunar mansions + solar return when available
  const enhancedGridDays = useMemo(() => {
    let days = gridDays;

    // Merge moon phases
    if (swissMoonPhases.size > 0) {
      days = days.map(day => {
        if (day.hekaDate.day === 0) return day;
        const dateKey = day.civilDate.toISOString().split('T')[0];
        const swissPhase = swissMoonPhases.get(dateKey);
        if (swissPhase) {
          return { ...day, moonPhase: swissPhase.glyph, moonPhaseName: swissPhase.name };
        }
        return day;
      });
    }

    // Mark True Solar Return in TRUE mode
    if (timeMode === 'TRUE' && activeProfileWithSiderealSun) {
      days = days.map(day => {
        if (day.hekaDate.day === 0 || !solarReturnDate) return day;
        const civilKey = day.civilDate.toISOString().split('T')[0];
        const srKey = solarReturnDate.toISOString().split('T')[0];
        if (civilKey === srKey) {
          return { ...day, isSolarReturn: true, solarReturnOrb: solarReturnOrb };
        }
        return day;
      });
    }

    return days;
  }, [gridDays, swissMoonPhases, timeMode, activeProfileWithSiderealSun, solarReturnDate, solarReturnOrb]);
  
  // Memoize weeks grouping
  const weeks = useMemo(() => {
    const result: CalendarDay[][] = [];
    for (let i = 0; i < enhancedGridDays.length; i += 7) {
      result.push(enhancedGridDays.slice(i, i + 7));
    }
    return result;
  }, [enhancedGridDays]);
  
  // Memoize selected date key for fast comparison
  const selectedKey = useMemo(() => {
    if (!selectedDate) return null;
    return `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`;
  }, [selectedDate]);
  
  // Optimized selection check using memoized key
  const isDaySelected = useCallback((day: CalendarDay): boolean => {
    if (!selectedKey || day.hekaDate.day === 0) return false;
    return selectedKey === `${day.hekaDate.year}-${day.hekaDate.month}-${day.hekaDate.day}`;
  }, [selectedKey]);
  
  // Optimized click handler - stable reference
  const handleDayClick = useCallback((day: CalendarDay) => {
    if (day.hekaDate.day !== 0) {
      dispatch(selectDate(day.hekaDate));
      // Track feature discovery
      discover('openedDayPanel');
      discover('createdNote');
    }
  }, [dispatch, discover]);

  // Quick Note Modal state
  const [quickNoteDay, setQuickNoteDay] = useState<CalendarDay | null>(null);
  const isQuickNoteOpen = quickNoteDay !== null;

  // Routine uploader state
  const [showRoutineUploader, setShowRoutineUploader] = useState(false);

  const handleDayLongPress = useCallback((day: CalendarDay) => {
    if (day.hekaDate.day !== 0) {
      setQuickNoteDay(day);
    }
  }, []);

  const handleCloseQuickNote = useCallback(() => {
    setQuickNoteDay(null);
  }, []);

  const handleSaveQuickNote = useCallback((content: string) => {
    if (quickNoteDay && content.trim()) {
      const noteKey = getNoteKey(quickNoteDay.hekaDate.year, quickNoteDay.hekaDate.month, quickNoteDay.hekaDate.day);
      dispatch(addNote({
        key: noteKey,
        content: content.trim(),
        category: 'general',
        tags: ['quick note'],
      }));
      // Track feature discovery
      discover('createdNote');
    }
  }, [quickNoteDay, dispatch, discover]);
  
  // Optimized unified notes + tasks getter with caching
  const getDayItems = useCallback((day: CalendarDay) => {
    if (day.hekaDate.day === 0) return [];
    const noteKey = getNoteKey(day.hekaDate.year, day.hekaDate.month, day.hekaDate.day);
    const dayNotes = notes[noteKey] || [];
    const dayTasks = plannerTasks[noteKey] || [];
    return [...dayNotes, ...dayTasks].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [notes, plannerTasks]);
  
  // Pre-compute display flags for stable prop passing
  const { showCivilDates, showMoonPhases, showHolidays } = display;
  
  // Month info for header
  const monthName = t(`months.${viewDate.month}`);
  const arc = getArcType(viewDate.month);
  const arcColors = ARC_COLORS[arc];
  const getYearDisplay = () => {
    if (arc === 'CLOSING') {
      return `${viewDate.year}–${viewDate.year + 1}`;
    }
    return viewDate.year.toString();
  };

  // HEKA week starts Saturday
  const dowOrder = [6, 0, 1, 2, 3, 4, 5];
  
  return (
    <div 
      className={`calendar-grid ${isExpanded ? 'calendar-grid--expanded' : ''} ${isExpandedHorizontal ? 'calendar-grid--expanded-h' : ''}`}
      role="grid" 
      aria-label={t('appTitle')}
      data-expanded={isExpanded}
      data-expanded-h={isExpandedHorizontal}
      // CSS containment for the entire grid
      style={{ contain: 'layout' }}
    >
      {/* Month Info Header - Inside Calendar Area */}
      <div className="calendar-grid__month-header">
        {/* Left: Month Name + Year */}
        <div className="calendar-grid__month-title">
          <span className="calendar-grid__month-name">{monthName}</span>
          <span className="calendar-grid__year">{getYearDisplay()}</span>
        </div>

        {/* Center: Routine upload + Yin-Yang toggle */}
        <div className="calendar-grid__center-actions">
          {/* Routine upload hidden for v1.0 launch */}
          {/* <button
            className="calendar-grid__routine-upload"
            onClick={() => setShowRoutineUploader(true)}
            title="Import routine"
            aria-label="Import routine"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </button> */}
          {isPureMode && (
            <button
              className="pure-yin-yang"
              onClick={onToggleLightDark}
              aria-label={isLightMode ? t('switchDarkMode') : t('switchLightMode')}
              title={isLightMode ? t('switchDarkMode') : t('switchLightMode')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 0 20 5 5 0 0 1 0-10 5 5 0 0 0 0-10z" fill="currentColor" fillOpacity="0.2" />
                <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                <circle cx="12" cy="17" r="1.5" fill="currentColor" fillOpacity="0.3" />
              </svg>
            </button>
          )}
        </div>

        {/* Right: Arc Pill */}
        <div
          className="calendar-grid__arc"
          data-arc={arc}
          style={{
            background: arcColors.bg,
            borderColor: arcColors.border,
            color: arcColors.text,
            boxShadow: `0 0 15px ${arcColors.glow}`,
          }}
        >
          {t(`arcs.${arc.toLowerCase()}`)} {t('arcSuffix')}
        </div>
      </div>
      
      {/* Center: Month/13 */}
      <div className="calendar-grid__month-index">{t('monthLabel', { month: viewDate.month + 1 })}</div>
      
      {/* Day of week header - localized from i18n */}
      <div className="calendar-grid__dow" role="row">
        {dowOrder.map((dayIndex) => (
          <div key={dayIndex} className="calendar-grid__dow-cell" role="columnheader">
            {t(`daysShort.${dayIndex}`)}
          </div>
        ))}
      </div>
      
      {/* Calendar weeks with virtualization consideration */}
      {weeks.map((week, weekIndex) => (
        <div 
          key={weekIndex} 
          className="calendar-grid__week" 
          role="row"
          style={{ contain: 'layout paint' }}
        >
          {week.map((day, dayIndex) => {
            const dayItems = getDayItems(day);
            return (
              <DayCell
                key={`${weekIndex}-${dayIndex}`}
                day={day}
                isSelected={isDaySelected(day)}
                onClick={() => handleDayClick(day)}
                onLongPress={() => handleDayLongPress(day)}
                showCivil={showCivilDates}
                showMoon={showMoonPhases}
                showHolidays={showHolidays}
                location={location}
                subRegion={subRegion}
                dayNotes={dayItems}
                isExpanded={isExpanded}
                isExpandedHorizontal={isExpandedHorizontal}
              />
            );
          })}
        </div>
      ))}

      <QuickNoteModal
        isOpen={isQuickNoteOpen}
        day={quickNoteDay}
        onClose={handleCloseQuickNote}
        onSave={handleSaveQuickNote}
      />

      {showRoutineUploader && (
        <RoutineUploader onClose={() => setShowRoutineUploader(false)} />
      )}
    </div>
  );
});

CalendarGrid.displayName = 'CalendarGrid';

export default CalendarGrid;
