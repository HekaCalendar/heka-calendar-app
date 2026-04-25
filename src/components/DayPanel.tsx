/**
 * Day Panel Component - Performance Optimized
 * Shows details for the selected day with multiple notes support
 * 
 * Features:
 * - Note selection mode with long-press
 * - Bulk actions: duplicate, delete
 * - Duplicate patterns: every [day], next week, specific day
 * 
 * Optimizations:
 * - useMemo for expensive computations
 * - useCallback for stable function references  
 * - memo for preventing unnecessary re-renders
 * - CSS containment for paint isolation
 */

import { useState, useCallback, memo, useMemo, useRef, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import type { RootState } from '../store';
import { selectDate, addNote, deleteNote, deleteDuplicates } from '../store';
import { HEKA_MONTHS, hekaToCivil, civilToHeka, formatCivilDate, getNoteKey, getDaysInMonth, getCivilStartOfHekaMonth } from '../services/calendarService';
import { getHolidaysForDateWithSubRegion, getYearLabel, LOCATIONS, getHemisphere, NOTE_CATEGORIES, type NoteData, type SubRegionCode } from '../types';
import type { NoteCategory } from '../types';
import { EnergyVoteCard } from './EnergyVoteCard';
import { isAfterVotingTime, isToday } from '../services/energyVoteService';
import { getDailyAstrology, type DailyAstrologicalGuidance } from '../astrology/integration/calendarSync';
import { useMoonPhase } from '../astrology/hooks/useMoonPhase';
import { profileManager } from '../astrology/services/natal/profileManager';
import { calculatePersonalTransits, getCurrentPlanetaryPositions } from '../oracle/birthChartIntegration';
import type { PersonalTransit } from '../oracle/birthChartIntegration';
import { calculateSunTimes, calculatePlanetaryHours } from '../astrology/services/calculations/swissCalculations';
import { tutorialService } from '../services/tutorialService';

const MOOD_EMOJIS: Record<number, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

const MOOD_LABELS: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent',
};

// Day names for duplication patterns
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DayPanelComponent: React.FC = () => {
  const dispatch = useDispatch();
  
  // Use shallowEqual for object selectors to prevent unnecessary re-renders
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate, shallowEqual);
  const display = useSelector((state: RootState) => state.calendar.display, shallowEqual);
  const location = useSelector((state: RootState) => state.calendar.location);
  const subRegion = useSelector((state: RootState) => state.calendar.subRegion as SubRegionCode | null);
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate, shallowEqual);
  
  // Only select the specific note key we need, not all notes
  const noteKey = useMemo(() => 
    selectedDate ? getNoteKey(selectedDate.year, selectedDate.month, selectedDate.day) : '',
    [selectedDate]
  );
  
  // Get only the notes for this day - using shallowEqual
  const dayNotes = useSelector(
    (state: RootState) => (noteKey ? (state.calendar.notes[noteKey] || []) : []),
    shallowEqual
  );
  
  // Get all notes to check for duplicates and for multi-day selection
  const allNotes = useSelector(
    (state: RootState) => Object.values(state.calendar.notes).flat(),
    shallowEqual
  );
  
  // Get full notes object for looking up by day key
  const allNotesByDay = useSelector(
    (state: RootState) => state.calendar.notes,
    shallowEqual
  );
  
  const locationData = useMemo(() => LOCATIONS[location], [location]);
  const hemisphere = useMemo(() => getHemisphere(locationData.latitude), [locationData.latitude]);
  
  // Get astro preferences from Redux
  const astroPreferences = useSelector((state: RootState) => state.calendar.astroPreferences);
  
  // Daily astrology state
  const [dailyAstrology, setDailyAstrology] = useState<DailyAstrologicalGuidance | null>(null);
  const [astrologyLoading, setAstrologyLoading] = useState(false);
  
  // Birth chart & personalized astrology state
  const [hasBirthChart, setHasBirthChart] = useState(false);
  const [personalTransits, setPersonalTransits] = useState<PersonalTransit[]>([]);
  const [birthChartName, setBirthChartName] = useState<string>('');
  
  // Location-aware astronomical data
  const [sunriseTime, setSunriseTime] = useState<string | null>(null);
  const [sunsetTime, setSunsetTime] = useState<string | null>(null);
  const [currentPlanetaryHour, setCurrentPlanetaryHour] = useState<{ planet: string; symbol: string; activities: string[] } | null>(null);
  
  // Note editing state
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('general');
  const [selectedMood, setSelectedMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  
  // Selection mode state - now tracks notes across multiple days
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotesMap, setSelectedNotesMap] = useState<Map<string, string>>(new Map()); // noteId -> dayKey
  const [showDuplicateOptions, setShowDuplicateOptions] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMultiDayPicker, setShowMultiDayPicker] = useState(false);
  
  // Memoize computed values
  const monthInfo = useMemo(() => 
    selectedDate ? HEKA_MONTHS[selectedDate.month] : null,
    [selectedDate]
  );
  
  const civilDate = useMemo(() => 
    selectedDate ? hekaToCivil(selectedDate) : null,
    [selectedDate]
  );
  
  const yearLabel = useMemo(() => 
    selectedDate ? getYearLabel(selectedDate.year, selectedDate.month) : '',
    [selectedDate]
  );
  
  // Swiss Ephemeris moon phase - NASA-grade precision
  const { data: swissMoonData, isLoading: moonLoading } = useMoonPhase(civilDate, hemisphere);
  
  // Fetch daily astrology when date changes
  useEffect(() => {
    if (selectedDate && civilDate && astroPreferences.showTransitsOnCalendar) {
      setAstrologyLoading(true);
      getDailyAstrology(civilDate, selectedDate)
        .then(data => {
          setDailyAstrology(data);
        })
        .catch(() => {
          setDailyAstrology(null);
        })
        .finally(() => {
          setAstrologyLoading(false);
        });
    } else {
      setDailyAstrology(null);
    }
  }, [selectedDate, civilDate, astroPreferences.showTransitsOnCalendar]);
  
  // Check for birth chart and calculate personalized transits
  useEffect(() => {
    if (!civilDate || !astroPreferences.showTransitsOnCalendar) {
      setHasBirthChart(false);
      setPersonalTransits([]);
      return;
    }
    
    // Check ProfileManager for birth chart
    const activeProfile = profileManager.getActiveProfileWithChart();
    const hasChart = activeProfile && activeProfile.chart && Object.keys(activeProfile.chart.planets || {}).length > 0;
    
    setHasBirthChart(!!hasChart);
    setBirthChartName(activeProfile?.name || '');
    
    if (hasChart && activeProfile?.chart) {
      // Calculate personal transits for this date
      const calculateTransits = async () => {
        try {
          const currentPositions = await getCurrentPlanetaryPositions(civilDate);
          
          // Convert chart to format expected by transit calculator
          const birthChartData = {
            timestamp: activeProfile.chart.calculatedAt || activeProfile.chart.birthData?.date,
            ascendant: activeProfile.chart.houses?.ascendant || null,
            planets: activeProfile.chart.planets || {},
            houses: activeProfile.chart.houses || {}
          };
          
          const transits = calculatePersonalTransits(birthChartData as any, currentPositions, civilDate);
          
          // Filter to major transits only (strength >= 60)
          const majorTransits = transits.filter(t => t.strength >= 60).slice(0, 3);
          setPersonalTransits(majorTransits);
        } catch (err) {
          console.error('[DayPanel] Failed to calculate transits:', err);
          setPersonalTransits([]);
        }
      };
      
      calculateTransits();
    }
  }, [civilDate, astroPreferences.showTransitsOnCalendar]);
  
  // Calculate location-aware astronomical data
  useEffect(() => {
    if (!civilDate || !astroPreferences.showTransitsOnCalendar) {
      setSunriseTime(null);
      setSunsetTime(null);
      setCurrentPlanetaryHour(null);
      return;
    }
    
    const calculateLocationData = async () => {
      try {
        // Get location coordinates
        const lat = locationData.latitude;
        const long = locationData.longitude;
        
        if (lat === 0 && long === 0) {
          return; // No location set
        }
        
        // Calculate sunrise/sunset
        const sunTimes = await calculateSunTimes(civilDate, lat, long);
        
        if (sunTimes.sunrise) {
          setSunriseTime(sunTimes.sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }
        if (sunTimes.sunset) {
          setSunsetTime(sunTimes.sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }
        
        // Calculate planetary hours
        const hours = await calculatePlanetaryHours(civilDate, lat, long);
        // Show current planetary hour if available
        const now = new Date();
        const currentHour = hours.find(h => now >= h.startTime && now < h.endTime);
        
        if (currentHour) {
          setCurrentPlanetaryHour({ 
            planet: currentHour.planet, 
            symbol: currentHour.symbol, 
            activities: currentHour.activities 
          });
        }
      } catch (err) {
        console.error('[DayPanel] Failed to calculate location data:', err);
      }
    };
    
    calculateLocationData();
  }, [civilDate, locationData, astroPreferences.showTransitsOnCalendar]);
  
  // Holidays - memoized to prevent recalculation
  const holidays = useMemo(() => {
    if (!civilDate || !display.showHolidays || location === 'NONE') return [];
    return getHolidaysForDateWithSubRegion(civilDate, location, subRegion || undefined);
  }, [civilDate, display.showHolidays, location, subRegion]);
  
  // Get current day of week for duplication
  const currentDayOfWeek = useMemo(() => 
    civilDate ? civilDate.getDay() : 0,
    [civilDate]
  );
  
  const handleSaveNote = useCallback(() => {
    if (noteText.trim() && noteKey) {
      dispatch(addNote({ 
        key: noteKey, 
        content: noteText.trim(),
        category: selectedCategory,
        mood: selectedMood,
      }));
      setNoteText('');
      setSelectedMood(undefined);
      setIsEditing(false);
      tutorialService.trackNoteCreated();
    }
  }, [dispatch, noteKey, noteText, selectedCategory, selectedMood]);
  
  const handleDeleteNote = useCallback((noteId: string) => {
    if (confirm('Delete this note?')) {
      dispatch(deleteNote({ dayKey: noteKey, noteId }));
    }
  }, [dispatch, noteKey]);
  
  // Selection mode handlers - now supports multi-day selection
  const handleEnterSelectionMode = useCallback((noteId: string, dayKey: string) => {
    setIsSelectionMode(true);
    const newMap = new Map<string, string>();
    newMap.set(noteId, dayKey);
    setSelectedNotesMap(newMap);
  }, []);
  
  const handleToggleNoteSelection = useCallback((noteId: string, dayKey: string) => {
    setSelectedNotesMap(prev => {
      const newMap = new Map(prev);
      if (newMap.has(noteId)) {
        newMap.delete(noteId);
      } else {
        newMap.set(noteId, dayKey);
      }
      return newMap;
    });
  }, []);
  
  const handleExitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedNotesMap(new Map());
    setShowDuplicateOptions(false);
    setShowDayPicker(false);
    setShowMultiDayPicker(false);
  }, []);
  
  const handleSelectAll = useCallback(() => {
    const newMap = new Map<string, string>();
    dayNotes.forEach(n => newMap.set(n.id, noteKey));
    setSelectedNotesMap(newMap);
  }, [dayNotes, noteKey]);
  
  // Get selected notes with their day keys
  const selectedNotesWithKeys = useMemo(() => {
    const result: { note: NoteData; dayKey: string }[] = [];
    selectedNotesMap.forEach((dayKey, noteId) => {
      // Look up notes from the correct day
      const dayNotesList = allNotesByDay[dayKey] || [];
      const note = dayNotesList.find(n => n.id === noteId);
      if (note) {
        result.push({ note, dayKey });
      }
    });
    return result;
  }, [selectedNotesMap, allNotesByDay]);
  
  // Check if selection spans multiple days
  const uniqueDayKeys = useMemo(() => 
    new Set(selectedNotesMap.values()),
    [selectedNotesMap]
  );
  const isMultiDaySelection = uniqueDayKeys.size > 1;
  const selectedDayCount = uniqueDayKeys.size;
  
  // Get selected notes for backward compatibility
  const selectedNotes = useMemo(() => 
    selectedNotesWithKeys.map(item => item.note),
    [selectedNotesWithKeys]
  );
  
  // Duplicate handlers
  const handleDuplicateToNextWeek = useCallback(() => {
    if (!selectedDate || selectedNotes.length === 0) return;
    
    // Calculate next week same day
    const currentCivil = hekaToCivil(selectedDate);
    const nextWeekCivil = new Date(currentCivil);
    nextWeekCivil.setDate(currentCivil.getDate() + 7);
    
    // Convert back to HEKA
    const targetHeka = civilToHeka(nextWeekCivil);
    if (!targetHeka) {
      alert('Could not calculate target date');
      return;
    }
    
    const targetKey = getNoteKey(targetHeka.year, targetHeka.month, targetHeka.day);
    
    selectedNotes.forEach(note => {
      dispatch(addNote({
        key: targetKey,
        content: note.content,
        category: note.category || 'general',
        mood: note.mood,
        duplicatedFrom: note.id,
      }));
    });
    
    alert(`Duplicated ${selectedNotes.length} note(s) to next week (${HEKA_MONTHS[targetHeka.month].name} ${targetHeka.day})`);
    handleExitSelectionMode();
  }, [selectedDate, selectedNotes, dispatch]);
  
  const handleDuplicateToEveryDayOfWeek = useCallback(() => {
    if (!selectedDate || selectedNotes.length === 0) return;
    
    const dayName = DAY_NAMES[currentDayOfWeek];
    if (!confirm(`Duplicate these ${selectedNotes.length} note(s) to EVERY ${dayName} for the rest of the year?`)) {
      return;
    }
    
    // Get all days of this day-of-week in remaining months
    let duplicateCount = 0;
    
    for (let month = selectedDate.month; month < 13; month++) {
      const daysInMonth = getDaysInMonth(selectedDate.year, month as any);
      
      for (let day = (month === selectedDate.month) ? selectedDate.day + 1 : 1; day <= daysInMonth; day++) {
        const testCivil = hekaToCivil({ year: selectedDate.year, month, day });
        if (testCivil.getDay() === currentDayOfWeek) {
          const targetKey = getNoteKey(selectedDate.year, month, day);
          selectedNotes.forEach(note => {
            dispatch(addNote({
              key: targetKey,
              content: note.content,
              category: note.category || 'general',
              mood: note.mood,
              duplicatedFrom: note.id, // Track that this was duplicated from this note
            }));
          });
          duplicateCount++;
        }
      }
    }
    
    alert(`Duplicated to ${duplicateCount} ${dayName}s`);
    handleExitSelectionMode();
  }, [selectedDate, selectedNotes, currentDayOfWeek, dispatch]);
  
  const handleShowDayPicker = useCallback(() => {
    setShowDayPicker(true);
  }, []);
  
  const handleDuplicateToSpecificDay = useCallback((targetDate: { year: number; month: number; day: number }) => {
    if (selectedNotes.length === 0) return;
    
    const targetKey = getNoteKey(targetDate.year, targetDate.month, targetDate.day);
    
    selectedNotes.forEach(note => {
      dispatch(addNote({
        key: targetKey,
        content: note.content,
        category: note.category || 'general',
        mood: note.mood,
        duplicatedFrom: note.id,
      }));
    });
    
    alert(`Duplicated ${selectedNotes.length} note(s)`);
    setShowDayPicker(false);
    handleExitSelectionMode();
  }, [selectedNotes, dispatch]);
  
  const handleDeleteSelected = useCallback(() => {
    if (!confirm(`Delete ${selectedNotesMap.size} selected note(s) from ${selectedDayCount} day(s)?`)) return;
    
    // Delete from the correct day for each note
    selectedNotesMap.forEach((dayKey, noteId) => {
      dispatch(deleteNote({ dayKey, noteId }));
    });
    handleExitSelectionMode();
  }, [selectedNotesMap, selectedDayCount, dispatch, handleExitSelectionMode]);
  
  // Check if selected notes have duplicates (for showing Undo option)
  const notesWithDuplicates = useMemo(() => {
    const result = new Set<string>();
    
    selectedNotes.forEach(note => {
      // Check if any note in the entire calendar was duplicated from this note
      const hasDuplicates = allNotes.some(n => n.duplicatedFrom === note.id);
      if (hasDuplicates) {
        result.add(note.id);
      }
    });
    
    return result;
  }, [selectedNotes, allNotes]);
  
  const hasAnyDuplicates = notesWithDuplicates.size > 0;
  
  const handleUndoDuplicates = useCallback(() => {
    if (!confirm(`Remove all duplicated instances of these ${notesWithDuplicates.size} note(s)?`)) return;
    
    notesWithDuplicates.forEach(sourceNoteId => {
      dispatch(deleteDuplicates({ sourceNoteId }));
    });
    
    alert(`Removed duplicated notes`);
    handleExitSelectionMode();
  }, [notesWithDuplicates, dispatch, handleExitSelectionMode]);
  
  // Multi-day duplication handlers
  const handleDuplicateToNextMonth = useCallback(() => {
    if (selectedNotes.length === 0) return;
    
    // If single day selection, use simpler logic
    if (!isMultiDaySelection && selectedDate) {
      const currentCivil = hekaToCivil(selectedDate);
      const nextMonthCivil = new Date(currentCivil);
      nextMonthCivil.setDate(currentCivil.getDate() + 28); // ~4 weeks
      
      const targetHeka = civilToHeka(nextMonthCivil);
      if (!targetHeka) {
        alert('Could not calculate target date');
        return;
      }
      
      const targetKey = getNoteKey(targetHeka.year, targetHeka.month, targetHeka.day);
      
      selectedNotes.forEach(note => {
        dispatch(addNote({
          key: targetKey,
          content: note.content,
          category: note.category || 'general',
          mood: note.mood,
          duplicatedFrom: note.id,
        }));
      });
      
      alert(`Duplicated ${selectedNotes.length} note(s) to next month (${HEKA_MONTHS[targetHeka.month].name} ${targetHeka.day})`);
      handleExitSelectionMode();
      return;
    }
    
    // Multi-day selection logic
    const notesByDay = new Map<string, NoteData[]>();
    selectedNotesWithKeys.forEach(({ note, dayKey }) => {
      if (!notesByDay.has(dayKey)) {
        notesByDay.set(dayKey, []);
      }
      notesByDay.get(dayKey)!.push(note);
    });
    
    let duplicateCount = 0;
    
    notesByDay.forEach((notes, sourceDayKey) => {
      const parts = sourceDayKey.split('-').map(Number);
      if (parts.length !== 3) return;
      
      const [sourceYear, sourceMonth, sourceDay] = parts;
      
      // Get civil date and add ~28 days
      const sourceCivil = hekaToCivil({ year: sourceYear, month: sourceMonth as any, day: sourceDay });
      const nextMonthCivil = new Date(sourceCivil);
      nextMonthCivil.setDate(sourceCivil.getDate() + 28);
      
      // Convert back to HEKA
      const targetHeka = civilToHeka(nextMonthCivil);
      if (!targetHeka) return;
      
      const targetKey = getNoteKey(targetHeka.year, targetHeka.month, targetHeka.day);
      
      notes.forEach(note => {
        dispatch(addNote({
          key: targetKey,
          content: note.content,
          category: note.category || 'general',
          mood: note.mood,
          duplicatedFrom: note.id,
        }));
        duplicateCount++;
      });
    });
    
    alert(`Duplicated ${duplicateCount} note(s) to next month`);
    handleExitSelectionMode();
  }, [selectedNotes, selectedNotesWithKeys, selectedDate, isMultiDaySelection, dispatch]);
  
  const handleDuplicateToSpecificDays = useCallback((targetDates: { year: number; month: number; day: number }[]) => {
    if (selectedNotes.length === 0 || targetDates.length === 0) return;
    
    let duplicateCount = 0;
    
    targetDates.forEach(targetDate => {
      const targetKey = getNoteKey(targetDate.year, targetDate.month, targetDate.day);
      
      selectedNotes.forEach(note => {
        dispatch(addNote({
          key: targetKey,
          content: note.content,
          category: note.category || 'general',
          mood: note.mood,
          duplicatedFrom: note.id,
        }));
        duplicateCount++;
      });
    });
    
    alert(`Duplicated ${selectedNotes.length} note(s) to ${targetDates.length} day(s)`);
    setShowMultiDayPicker(false);
    handleExitSelectionMode();
  }, [selectedNotes, dispatch]);
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNoteText('');
    setSelectedMood(undefined);
  };
  
  if (!selectedDate) {
    return (
      <div className="day-panel">
        <div className="day-panel__empty">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <p>Select a day to view details</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="day-panel">
      {/* Header */}
      <div className="day-panel__header">
        <div>
          <div className="day-panel__date">
            {monthInfo!.name} {selectedDate.day}
          </div>
          <div className="day-panel__meta">
            Month {selectedDate.month + 1} / 13 • HEKA Year {yearLabel}
          </div>
          {display.showCivilDates && (
            <div className="day-panel__civil">
              {formatCivilDate(civilDate!, locationData.timezone)}
            </div>
          )}
        </div>
        <button
          className="btn btn--icon day-panel-close-btn"
          onClick={() => dispatch(selectDate(null))}
          aria-label="Close panel"
        >
          ×
        </button>
      </div>
      
      {/* Moon Phase Section - Swiss Ephemeris Precision */}
      {display.showMoonPhases && (
        <div className="day-panel__section moon-section">
          {moonLoading ? (
            <div className="moon-loading">
              <span className="spinner"></span>
              <span>Calculating lunar position...</span>
            </div>
          ) : swissMoonData ? (
            <>
              <div className="moon-display">
                <span className="moon-emoji">{swissMoonData.glyph}</span>
                <div className="moon-info">
                  <div className="moon-phase">{swissMoonData.name}</div>
                  <div className="moon-details">
                    {swissMoonData.waxing ? 'Waxing' : 'Waning'} • {swissMoonData.illumination}% illuminated
                  </div>
                  <div className="moon-age">Age: {swissMoonData.age} days</div>
                  <div className="moon-precision">✨ Swiss Ephemeris</div>
                </div>
              </div>
              <div className="moon-hemisphere">
                {hemisphere === 'S' ? '🌏 Southern Hemisphere' : '🌍 Northern Hemisphere'}
              </div>
            </>
          ) : (
            <div className="moon-unavailable">Moon phase data unavailable</div>
          )}
        </div>
      )}
      
      {/* Holidays Section - First */}
      {display.showHolidays && holidays.length > 0 && (
        <div className="day-panel__section">
          <div className="day-panel__label">Holidays in {locationData.name}</div>
          <div className="holiday-list">
            {holidays.map((holiday, idx) => (
              <div key={idx} className={`holiday-badge holiday-badge--${holiday.type}`}>
                <span className="holiday-name">{holiday.name}</span>
                <span className="holiday-type">{holiday.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Daily Astrology Section - Enhanced with Birth Chart & Location */}
      {selectedDate && astroPreferences.showTransitsOnCalendar && (
        <div className="day-panel__section day-panel__astrology">
          <div className="day-panel__section-title">
            <span>{hasBirthChart ? '✦' : '✨'}</span> 
            {hasBirthChart ? `Personalized for ${birthChartName}` : 'Daily Cosmic Guidance'}
            {hasBirthChart && <span className="astro-personalized-badge">Birth Chart Active</span>}
          </div>
          
          {astrologyLoading ? (
            <div className="day-panel__astrology-loading">
              <span className="spinner"></span>
              <span>{hasBirthChart ? 'Calculating your personal transits...' : 'Connecting to celestial intelligence...'}</span>
            </div>
          ) : dailyAstrology ? (
            <div className="day-panel__astrology-content">
              {/* Location-Aware Sun Times & Planetary Hour */}
              {(sunriseTime || sunsetTime || currentPlanetaryHour) && (
                <div className="astro-location-times">
                  {sunriseTime && (
                    <div className="astro-time-badge">
                      <span className="astro-time-icon">🌅</span>
                      <span className="astro-time-label">Sunrise: {sunriseTime}</span>
                    </div>
                  )}
                  {sunsetTime && (
                    <div className="astro-time-badge">
                      <span className="astro-time-icon">🌇</span>
                      <span className="astro-time-label">Sunset: {sunsetTime}</span>
                    </div>
                  )}
                  {currentPlanetaryHour && (
                    <div className="astro-time-badge astro-planetary-hour">
                      <span className="astro-time-icon">{currentPlanetaryHour.symbol}</span>
                      <span className="astro-time-label">Planetary Hour: {currentPlanetaryHour.planet}</span>
                    </div>
                  )}
                  <div className="astro-location-name">📍 {locationData.name}</div>
                </div>
              )}
              
              {/* Personal Transits - Only if birth chart exists */}
              {hasBirthChart && personalTransits.length > 0 && (
                <div className="astro-transits-section">
                  <div className="astro-transits-title">🌟 Active Transits for You Today</div>
                  {personalTransits.map((transit, idx) => (
                    <div key={idx} className={`astro-transit-item strength-${Math.floor(transit.strength / 20)}`}>
                      <span className="astro-transit-planets">
                        {transit.transitingPlanet} {transit.aspect} {transit.natalPlanet}
                      </span>
                      <span className="astro-transit-orb">{transit.orb.toFixed(1)}°</span>
                      <span className="astro-transit-strength" style={{
                        color: transit.strength >= 80 ? '#22c55e' : 
                               transit.strength >= 60 ? '#3b82f6' : '#eab308'
                      }}>
                        {transit.strength}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Moon Phase Card */}
              <div className="astro-card astro-card--moon">
                <div className="astro-card__icon">
                  {dailyAstrology.moonPhase.phase === 'new' && '🌑'}
                  {dailyAstrology.moonPhase.phase === 'waxing-crescent' && '🌒'}
                  {dailyAstrology.moonPhase.phase === 'first-quarter' && '🌓'}
                  {dailyAstrology.moonPhase.phase === 'waxing-gibbous' && '🌔'}
                  {dailyAstrology.moonPhase.phase === 'full' && '🌕'}
                  {dailyAstrology.moonPhase.phase === 'waning-gibbous' && '🌖'}
                  {dailyAstrology.moonPhase.phase === 'last-quarter' && '🌗'}
                  {dailyAstrology.moonPhase.phase === 'waning-crescent' && '🌘'}
                </div>
                <div className="astro-card__info">
                  <div className="astro-card__title">{dailyAstrology.moonPhase.name}</div>
                  <div className="astro-card__detail">
                    {Math.round(dailyAstrology.moonPhase.illumination)}% illuminated
                  </div>
                </div>
              </div>
              
              {/* Signs Row */}
              <div className="astro-row">
                <div className="astro-badge">
                  <span className="astro-badge__icon">☽</span>
                  <span className="astro-badge__label">Moon in {dailyAstrology.moonSign}</span>
                </div>
                <div className="astro-badge">
                  <span className="astro-badge__icon">☉</span>
                  <span className="astro-badge__label">Sun in {dailyAstrology.sunSign}</span>
                </div>
              </div>
              
              {/* Daily Theme */}
              <div className="astro-theme">
                <span className="astro-theme__label">Today's Theme:</span>
                <span className="astro-theme__value">{dailyAstrology.dailyTheme}</span>
              </div>
              
              {/* Guidance */}
              <div className="astro-guidance">
                <div className="astro-guidance__label">🌟 Cosmic Guidance</div>
                <div className="astro-guidance__text">{dailyAstrology.guidance}</div>
              </div>
              
              {/* Journal Prompt */}
              <div className="astro-prompt">
                <div className="astro-prompt__label">📝 Reflection</div>
                <div className="astro-prompt__text">{dailyAstrology.journalPrompt}</div>
              </div>
              
              {/* Affirmation */}
              <div className="astro-affirmation">
                <div className="astro-affirmation__label">💫 Affirmation</div>
                <div className="astro-affirmation__text">"{dailyAstrology.affirmation}"</div>
              </div>
              
              {/* Power Moment - Location Aware */}
              {dailyAstrology.powerMoment && (
                <div className="astro-power-moment">
                  <span className="astro-power-moment__icon">⚡</span>
                  <span className="astro-power-moment__text">{dailyAstrology.powerMoment}</span>
                </div>
              )}
              
              {/* Add Birth Chart CTA if not present */}
              {!hasBirthChart && (
                <div className="astro-birthchart-cta">
                  <p>✨ <strong>Want personalized transits?</strong></p>
                  <p>Add your birth chart in the Stars section to see how today's cosmic weather affects you personally.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="day-panel__astrology-empty">
              Celestial guidance unavailable. Check the Stars section for detailed astrology.
            </div>
          )}
        </div>
      )}
      
      {/* Community Energy Vote - shows for today (after 7:30 PM) or any past date */}
      {civilDate && (
        // Show for: (1) today after 7:30 PM, or (2) any past date
        (isToday(civilDate) && isAfterVotingTime() || civilDate < new Date(new Date().setHours(0,0,0,0))) && (
        <div className="day-panel__section energy-vote-section">
          <EnergyVoteCard date={civilDate} />
        </div>
      ))}
      
      {/* Notes Section */}
      <div className="day-panel__section notes-section">
        {/* Selection Mode Toolbar */}
        {isSelectionMode ? (
          <div className="selection-toolbar">
            <div className="selection-toolbar__header">
              <span className="selection-count">
                {selectedNotesMap.size} selected from {selectedDayCount} day{selectedDayCount !== 1 ? 's' : ''}
              </span>
              <button className="btn btn--sm" onClick={handleExitSelectionMode}>
                Done
              </button>
            </div>
            
            {!showDuplicateOptions && !showDayPicker && !showMultiDayPicker && (
              <div className="selection-toolbar__actions">
                <button className="btn btn--sm" onClick={handleSelectAll}>
                  Select All
                </button>
                <button className="btn btn--sm btn--primary" onClick={() => setShowDuplicateOptions(true)}>
                  📋 Duplicate...
                </button>
                <button className="btn btn--sm btn--danger" onClick={handleDeleteSelected}>
                  🗑️ Delete
                </button>
              </div>
            )}
            
            {showDuplicateOptions && !showDayPicker && !showMultiDayPicker && (
              <div className="duplicate-options">
                <div className="duplicate-options__title">
                  {hasAnyDuplicates ? 'Manage Duplicates:' : 'Duplicate to:'}
                </div>
                
                {/* Single day options */}
                {!isMultiDaySelection && (
                  <>
                    <button className="btn btn--sm" onClick={handleDuplicateToNextWeek}>
                      📅 Next Week
                    </button>
                    <button className="btn btn--sm" onClick={handleDuplicateToNextMonth}>
                      📅 Next Month
                    </button>
                    {!hasAnyDuplicates ? (
                      <button className="btn btn--sm" onClick={handleDuplicateToEveryDayOfWeek}>
                        🔁 Every {DAY_NAMES[currentDayOfWeek]}
                      </button>
                    ) : (
                      <button className="btn btn--sm btn--warning" onClick={handleUndoDuplicates}>
                        ↩️ Undo Every {DAY_NAMES[currentDayOfWeek]}
                      </button>
                    )}
                    <button className="btn btn--sm" onClick={handleShowDayPicker}>
                      📍 Specific Day...
                    </button>
                  </>
                )}
                
                {/* Multi-day options */}
                {isMultiDaySelection && (
                  <>
                    <button className="btn btn--sm" onClick={handleDuplicateToNextMonth}>
                      📅 Next Month
                    </button>
                    <button className="btn btn--sm" onClick={() => setShowMultiDayPicker(true)}>
                      📍 Choose Day(s)...
                    </button>
                  </>
                )}
                
                <button className="btn btn--sm btn--secondary" onClick={() => setShowDuplicateOptions(false)}>
                  ← Back
                </button>
              </div>
            )}
            
            {showDayPicker && (
              <DayPicker
                currentViewDate={viewDate}
                onSelectDay={handleDuplicateToSpecificDay}
                onCancel={() => setShowDayPicker(false)}
              />
            )}
            
            {showMultiDayPicker && (
              <MultiDayPicker
                currentViewDate={viewDate}
                onSelectDays={handleDuplicateToSpecificDays}
                onCancel={() => setShowMultiDayPicker(false)}
              />
            )}
          </div>
        ) : (
          <div className="day-panel__label">
            <span>Notes ({dayNotes.length})</span>
            <button className="btn btn--sm" onClick={() => {
              tutorialService.trackNoteEditorOpened();
              setIsEditing(true);
            }}>
              + Add Note
            </button>
          </div>
        )}
        
        {/* Long-press hint - shows when notes exist and not in selection/edit mode */}
        {dayNotes.length > 0 && !isSelectionMode && !isEditing && (
          <div className="note-hint">
            <span className="note-hint__icon">👇</span>
            <span className="note-hint__text">Long-hold note for options</span>
          </div>
        )}
        
        {/* Existing Notes List */}
        {dayNotes.length > 0 && (
          <div className={`notes-list ${isSelectionMode ? 'selection-active' : ''}`}>
            {dayNotes.map((note, index) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                index={index}
                isSelected={selectedNotesMap.has(note.id)}
                isSelectionMode={isSelectionMode}
                onDelete={() => handleDeleteNote(note.id)}
                onLongPress={() => handleEnterSelectionMode(note.id, noteKey)}
                onToggleSelect={() => handleToggleNoteSelection(note.id, noteKey)}
              />
            ))}
          </div>
        )}
        
        {/* Note Editing Form */}
        {isEditing && (
          <div className="note-edit-form">
            {/* Category Selection */}
            <div className="category-selector">
              {NOTE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{ '--category-color': cat.color } as React.CSSProperties}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
            
            {/* Mood Selection */}
            <div className="mood-selector">
              <span className="mood-label-text">How are you feeling?</span>
              <div className="mood-options">
                {[1, 2, 3, 4, 5].map(mood => (
                  <button
                    key={mood}
                    className={`mood-btn ${selectedMood === mood ? 'active' : ''}`}
                    onClick={() => setSelectedMood(selectedMood === mood ? undefined : mood as 1 | 2 | 3 | 4 | 5)}
                    title={MOOD_LABELS[mood]}
                  >
                    {MOOD_EMOJIS[mood]}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Note Text */}
            <textarea
              className="day-panel__textarea"
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                if (e.target.value.trim().length > 0) {
                  tutorialService.trackNoteTyping();
                }
              }}
              placeholder="Write your note..."
              autoFocus
            />
            
            {/* Actions */}
            <div className="note-actions">
              <button
                className="btn btn--primary"
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
              >
                Save Note
              </button>
              <button className="btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {dayNotes.length === 0 && !isEditing && (
          <p className="no-notes">No notes for this day. Click "+ Add Note" to create one.</p>
        )}
      </div>
    </div>
  );
};

// Day Picker Component for selecting specific day
const DayPicker = memo(({ currentViewDate, onSelectDay, onCancel }: {
  currentViewDate: { year: number; month: number };
  onSelectDay: (date: { year: number; month: number; day: number }) => void;
  onCancel: () => void;
}) => {
  const [pickerYear, setPickerYear] = useState(currentViewDate.year);
  const [pickerMonth, setPickerMonth] = useState(currentViewDate.month);

  const daysInMonth = useMemo(() =>
    getDaysInMonth(pickerYear, pickerMonth as any),
    [pickerYear, pickerMonth]
  );

  const monthName = HEKA_MONTHS[pickerMonth].name;

  const firstDayOffset = useMemo(() => {
    const firstDayCivil = getCivilStartOfHekaMonth(pickerYear, pickerMonth as any);
    return (firstDayCivil.getDay() + 1) % 7; // Saturday-start
  }, [pickerYear, pickerMonth]);

  const gridCells = useMemo(() => {
    const cells: { day: number | null }[] = [];
    for (let i = 0; i < firstDayOffset; i++) cells.push({ day: null });
    for (let day = 1; day <= daysInMonth; day++) cells.push({ day });
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 0; i < remaining; i++) cells.push({ day: null });
    return cells;
  }, [firstDayOffset, daysInMonth]);

  const DOW_HEADERS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="day-picker">
      <div className="day-picker__header">
        <button className="btn btn--icon" onClick={() => {
          if (pickerMonth === 0) {
            setPickerMonth(12);
            setPickerYear(y => y - 1);
          } else {
            setPickerMonth(m => m - 1);
          }
        }}>←</button>
        <span className="day-picker__month">{monthName} {pickerYear}</span>
        <button className="btn btn--icon" onClick={() => {
          if (pickerMonth === 12) {
            setPickerMonth(0);
            setPickerYear(y => y + 1);
          } else {
            setPickerMonth(m => m + 1);
          }
        }}>→</button>
      </div>
      <div className="day-picker__grid" style={{ marginBottom: '4px' }}>
        {DOW_HEADERS.map(dow => (
          <div key={dow} style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-text-muted)', padding: '4px 0', fontWeight: 600 }}>{dow}</div>
        ))}
      </div>
      <div className="day-picker__grid">
        {gridCells.map((cell, index) => (
          cell.day !== null ? (
            <button
              key={index}
              className="day-picker__day"
              onClick={() => onSelectDay({ year: pickerYear, month: pickerMonth, day: cell.day! })}
            >
              {cell.day}
            </button>
          ) : (
            <span key={index} className="day-picker__day" style={{ visibility: 'hidden', pointerEvents: 'none' }} />
          )
        ))}
      </div>
      <button className="btn btn--sm btn--secondary" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
});

DayPicker.displayName = 'DayPicker';

// Multi-Day Picker Component for selecting multiple days
const MultiDayPicker = memo(({ currentViewDate, onSelectDays, onCancel }: {
  currentViewDate: { year: number; month: number };
  onSelectDays: (dates: { year: number; month: number; day: number }[]) => void;
  onCancel: () => void;
}) => {
  const [pickerYear, setPickerYear] = useState(currentViewDate.year);
  const [pickerMonth, setPickerMonth] = useState(currentViewDate.month);
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());

  const daysInMonth = useMemo(() =>
    getDaysInMonth(pickerYear, pickerMonth as any),
    [pickerYear, pickerMonth]
  );

  const monthName = HEKA_MONTHS[pickerMonth].name;

  const toggleDay = useCallback((day: number) => {
    setSelectedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) newSet.delete(day);
      else newSet.add(day);
      return newSet;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    const dates = Array.from(selectedDays).map(day => ({
      year: pickerYear,
      month: pickerMonth,
      day,
    }));
    onSelectDays(dates);
  }, [selectedDays, pickerYear, pickerMonth, onSelectDays]);

  const firstDayOffset = useMemo(() => {
    const firstDayCivil = getCivilStartOfHekaMonth(pickerYear, pickerMonth as any);
    return (firstDayCivil.getDay() + 1) % 7;
  }, [pickerYear, pickerMonth]);

  const gridCells = useMemo(() => {
    const cells: { day: number | null }[] = [];
    for (let i = 0; i < firstDayOffset; i++) cells.push({ day: null });
    for (let day = 1; day <= daysInMonth; day++) cells.push({ day });
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 0; i < remaining; i++) cells.push({ day: null });
    return cells;
  }, [firstDayOffset, daysInMonth]);

  const DOW_HEADERS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="day-picker">
      <div className="day-picker__header">
        <button className="btn btn--icon" onClick={() => {
          if (pickerMonth === 0) {
            setPickerMonth(12);
            setPickerYear(y => y - 1);
          } else {
            setPickerMonth(m => m - 1);
          }
          setSelectedDays(new Set());
        }}>←</button>
        <span className="day-picker__month">{monthName} {pickerYear}</span>
        <button className="btn btn--icon" onClick={() => {
          if (pickerMonth === 12) {
            setPickerMonth(0);
            setPickerYear(y => y + 1);
          } else {
            setPickerMonth(m => m + 1);
          }
          setSelectedDays(new Set());
        }}>→</button>
      </div>
      <div className="day-picker__grid" style={{ marginBottom: '4px' }}>
        {DOW_HEADERS.map(dow => (
          <div key={dow} style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-text-muted)', padding: '4px 0', fontWeight: 600 }}>{dow}</div>
        ))}
      </div>
      <div className="day-picker__grid">
        {gridCells.map((cell, index) => (
          cell.day !== null ? (
            <button
              key={index}
              className={`day-picker__day ${selectedDays.has(cell.day) ? 'selected' : ''}`}
              onClick={() => toggleDay(cell.day!)}
              style={selectedDays.has(cell.day) ? {
                background: 'var(--color-gold)',
                borderColor: 'var(--color-gold)',
                color: '#000',
              } : {}}
            >
              {cell.day}
            </button>
          ) : (
            <span key={index} className="day-picker__day" style={{ visibility: 'hidden', pointerEvents: 'none' }} />
          )
        ))}
      </div>
      <div className="day-picker__footer">
        <span className="selected-count">{selectedDays.size} day(s) selected</span>
        <div className="day-picker__actions">
          <button
            className="btn btn--sm btn--primary"
            onClick={handleConfirm}
            disabled={selectedDays.size === 0}
          >
            Confirm
          </button>
          <button className="btn btn--sm btn--secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

MultiDayPicker.displayName = 'MultiDayPicker';

// Individual note item component - memoized for performance
interface NoteItemProps {
  note: NoteData;
  index: number;
  isSelected: boolean;
  isSelectionMode: boolean;
  onDelete: () => void;
  onLongPress: () => void;
  onToggleSelect: () => void;
}

const NoteItem = memo(({ 
  note, 
  index, 
  isSelected, 
  isSelectionMode, 
  onDelete, 
  onLongPress, 
  onToggleSelect 
}: NoteItemProps) => {
  const categoryInfo = NOTE_CATEGORIES.find(c => c.id === note.category);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  
  const handleMouseDown = useCallback(() => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, 500);
  }, [onLongPress]);
  
  const handleMouseUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);
  
  const handleClick = useCallback(() => {
    if (isSelectionMode) {
      onToggleSelect();
    }
  }, [isSelectionMode, onToggleSelect]);
  
  const handleTouchStart = useCallback(() => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, 500);
  }, [onLongPress]);
  
  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);
  
  return (
    <div 
      className={`note-item ${isSelected ? 'note-item--selected' : ''} ${isSelectionMode ? 'note-item--selectable' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {isSelectionMode && (
        <div className={`note-item__checkbox ${isSelected ? 'checked' : ''}`}>
          {isSelected && '✓'}
        </div>
      )}
      <div className="note-item__header">
        <span className="note-item__number">#{index + 1}</span>
        {note.mood && (
          <span className="note-item__mood" title={MOOD_LABELS[note.mood]}>
            {MOOD_EMOJIS[note.mood]}
          </span>
        )}
        {categoryInfo && (
          <span 
            className="note-item__category"
            style={{ 
              background: `${categoryInfo.color}20`,
              borderColor: categoryInfo.color,
              color: categoryInfo.color,
            }}
          >
            {categoryInfo.icon} {categoryInfo.name}
          </span>
        )}
        {!isSelectionMode && (
          <button className="note-item__delete" onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete note">
            ×
          </button>
        )}
      </div>
      <div className="note-item__content">{note.content}</div>
      <div className="note-item__time">
        {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
});

NoteItem.displayName = 'NoteItem';

// Memoize the entire DayPanel to prevent unnecessary re-renders
export const DayPanel = memo(DayPanelComponent);
DayPanel.displayName = 'DayPanel';

export default DayPanel;
