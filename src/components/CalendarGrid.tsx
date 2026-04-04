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

import { useMemo, useCallback, memo, useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import type { RootState } from '../store';
import { selectDate } from '../store';
import { generateMonthGrid, HEKA_MONTHS, getNoteKey, getArcType } from '../services/calendarService';
import { getHolidaysForDateWithSubRegion, ARC_NAMES, type SubRegionCode } from '../types';
import type { CalendarDay, ArcType } from '../types';
import { calculateMoonPhaseBatch } from '../astrology/services/calculations/swissCalculations';
import { useFeatureDiscovery } from '../hooks/useGamification';

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
  showCivil: boolean;
  showMoon: boolean;
  showHolidays: boolean;
  location: string;
  subRegion: SubRegionCode | null;
  dayNotes: { content: string; category?: string }[];
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
    prev.dayNotes.length === next.dayNotes.length &&
    prev.day.isToday === next.day.isToday &&
    prev.day.moonPhase === next.day.moonPhase &&
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
const DayCellContent = memo(({ day, isSelected, onClick, showCivil, showMoon, showHolidays, location, subRegion, dayNotes, isExpanded = false, isExpandedHorizontal = false }: DayCellProps) => {
  // Memoize holiday check - expensive operation
  const hasHoliday = useMemo(() => {
    if (!showHolidays || location === 'NONE') return false;
    return getHolidaysForDateWithSubRegion(day.civilDate, location as any, subRegion || undefined).length > 0;
  }, [showHolidays, location, subRegion, day.civilDate]);
  
  const hasNotes = dayNotes.length > 0;
  
  // In expanded modes, show more note content
  const isAnyExpanded = isExpanded || isExpandedHorizontal;
  const maxNoteLength = isAnyExpanded ? 80 : 25;
  const maxNotesToShow = isAnyExpanded ? 3 : 1;
  
  const visibleNotes = dayNotes.slice(0, maxNotesToShow);
  const hasMoreNotes = dayNotes.length > maxNotesToShow;
  
  // Combine class names efficiently
  const className = useMemo(() => {
    const classes = ['day-cell'];
    if (isSelected) classes.push('day-cell--selected');
    if (day.isToday) classes.push('day-cell--today');
    return classes.join(' ');
  }, [isSelected, day.isToday]);
  
  return (
    <button
      className={className}
      onClick={onClick}
      aria-label={`${HEKA_MONTHS[day.hekaDate.month].name} ${day.hekaDate.day}`}
      aria-selected={isSelected}
      role="gridcell"
      style={{ contain: 'layout style paint' }}
    >
      <div className="day-cell__header">
        <span className="day-cell__heka-num">{day.hekaDate.day}</span>
        {showMoon && day.moonPhase && (
          <span 
            className="day-cell__moon" 
            aria-hidden="true"
            title={(day as any).moonPhaseName || 'Moon phase'}
          >
            {day.moonPhase}
          </span>
        )}
      </div>
      
      {showCivil && (
        <div className="day-cell__civil">
          {day.civilDate.getDate()} {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][day.civilDate.getMonth()]}
        </div>
      )}
      
      {hasNotes && (
        <div className={`day-cell__note-preview ${isAnyExpanded ? 'day-cell__note-preview--expanded' : ''}`}>
          {visibleNotes.map((note, index) => (
            <div key={index} className="note-preview-item">
              <span className="note-preview-text">
                {note.content.slice(0, maxNoteLength)}{note.content.length > maxNoteLength ? '...' : ''}
              </span>
            </div>
          ))}
          {hasMoreNotes && <span className="note-more-indicator">+{dayNotes.length - maxNotesToShow} more</span>}
        </div>
      )}
      
      {hasHoliday && (
        <div className="day-cell__holiday-indicator" aria-label="Holiday" />
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

DayCell.displayName = 'DayCell';

// ============================================================================
// Main Calendar Grid
// ============================================================================

// Pre-computed day of week headers
const DOW_HEADERS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];



interface CalendarGridProps {
  isExpanded?: boolean;
  isExpandedHorizontal?: boolean;
}

export const CalendarGrid = memo(({ isExpanded = false, isExpandedHorizontal = false }: CalendarGridProps) => {
  const dispatch = useDispatch();
  const { discover } = useFeatureDiscovery();
  
  // Use individual selectors for granular updates
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate, shallowEqual);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate, shallowEqual);
  const display = useSelector((state: RootState) => state.calendar.display, shallowEqual);
  const location = useSelector((state: RootState) => state.calendar.location);
  const subRegion = useSelector((state: RootState) => state.calendar.subRegion as SubRegionCode | null);
  const notes = useSelector((state: RootState) => state.calendar.notes);
  
  // Get hemisphere for moon phase calculations
  const hemisphere = useSelector((state: RootState) => {
    const loc = state.calendar.location;
    // Australia is Southern Hemisphere, all others default to Northern
    return loc === 'AU' ? 'S' : 'N';
  });
  
  // Memoize grid generation - only recompute when month/year changes
  const gridDays = useMemo(() => {
    return generateMonthGrid(viewDate.year, viewDate.month, {
      includeToday: true,
    });
  }, [viewDate.year, viewDate.month]);
  
  // Swiss Ephemeris moon phases - precise calculation
  const [swissMoonPhases, setSwissMoonPhases] = useState<Map<string, { glyph: string; name: string }>>(new Map());
  
  useEffect(() => {
    if (!display.showMoonPhases) return;
    
    // Get all dates that need moon phases (actual days, not blanks)
    const dates = gridDays
      .filter(day => day.hekaDate.day !== 0)
      .map(day => day.civilDate);
    
    // Fetch Swiss Ephemeris phases
    calculateMoonPhaseBatch(dates, hemisphere)
      .then(phases => {
        const phaseMap = new Map<string, { glyph: string; name: string }>();
        phases.forEach((data, dateKey) => {
          phaseMap.set(dateKey, { glyph: data.glyph, name: data.name });
        });
        setSwissMoonPhases(phaseMap);
      })
      .catch(() => {
        // Silently fail - grid will show approximate phases
        setSwissMoonPhases(new Map());
      });
  }, [gridDays, display.showMoonPhases, hemisphere]);
  
  // Enhance grid days with Swiss moon phases when available
  const enhancedGridDays = useMemo(() => {
    if (swissMoonPhases.size === 0) return gridDays;
    
    return gridDays.map(day => {
      if (day.hekaDate.day === 0) return day;
      
      const dateKey = day.civilDate.toISOString().split('T')[0];
      const swissPhase = swissMoonPhases.get(dateKey);
      
      if (swissPhase) {
        return {
          ...day,
          moonPhase: swissPhase.glyph,
          // Store the precise name for tooltips
          moonPhaseName: swissPhase.name,
        };
      }
      return day;
    });
  }, [gridDays, swissMoonPhases]);
  
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
  
  // Optimized notes getter with caching
  const getDayNotes = useCallback((day: CalendarDay) => {
    if (day.hekaDate.day === 0) return [];
    const noteKey = getNoteKey(day.hekaDate.year, day.hekaDate.month, day.hekaDate.day);
    return notes[noteKey] || [];
  }, [notes]);
  
  // Pre-compute display flags for stable prop passing
  const { showCivilDates, showMoonPhases, showHolidays } = display;
  
  // Month info for header
  const monthName = HEKA_MONTHS[viewDate.month].name;
  const arc = getArcType(viewDate.month);
  const arcColors = ARC_COLORS[arc];
  const getYearDisplay = () => {
    if (arc === 'CLOSING') {
      return `${viewDate.year}–${viewDate.year + 1}`;
    }
    return viewDate.year.toString();
  };
  
  return (
    <div 
      className={`calendar-grid ${isExpanded ? 'calendar-grid--expanded' : ''} ${isExpandedHorizontal ? 'calendar-grid--expanded-h' : ''}`}
      role="grid" 
      aria-label="HEKA Calendar"
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
          {ARC_NAMES[arc]} Arc
        </div>
      </div>
      
      {/* Center: Month/13 */}
      <div className="calendar-grid__month-index">Month {viewDate.month + 1}/13</div>
      
      {/* Day of week header - memoized */}
      <div className="calendar-grid__dow" role="row">
        {DOW_HEADERS.map((day) => (
          <div key={day} className="calendar-grid__dow-cell" role="columnheader">
            {day}
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
            const dayNotes = getDayNotes(day);
            return (
              <DayCell
                key={`${weekIndex}-${dayIndex}`}
                day={day}
                isSelected={isDaySelected(day)}
                onClick={() => handleDayClick(day)}
                showCivil={showCivilDates}
                showMoon={showMoonPhases}
                showHolidays={showHolidays}
                location={location}
                subRegion={subRegion}
                dayNotes={dayNotes}
                isExpanded={isExpanded}
                isExpandedHorizontal={isExpandedHorizontal}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});

CalendarGrid.displayName = 'CalendarGrid';

export default CalendarGrid;
