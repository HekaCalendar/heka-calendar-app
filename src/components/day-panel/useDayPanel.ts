/**
 * useDayPanel Hook
 * Extracts all state management and logic from DayPanel
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import type { RootState } from '../../store';
import { selectDate, addNote, deleteNote, deleteDuplicates } from '../../store';
import { addPlannerTask } from '../../store/plannerSlice';
import { selectUnifiedDayItems } from '../../store/plannerSlice';
import {
  createPlannerTask,
  deletePlannerTask,
  completePlannerTask,
  reopenPlannerTask,
  updatePlannerTaskDoc,
} from '../../services/plannerService';
import { getCurrentUser } from '../../services/firebase';
import { HEKA_MONTHS, hekaToCivil, civilToHeka, getNoteKey, getDaysInMonth } from '../../services/calendarService';
import { getHolidaysForDateWithSubRegion, getYearLabel, LOCATIONS, getHemisphere, type SubRegionCode, type NoteCategory, type PlannerTask } from '../../types';
import { getDailyAstrology, type DailyAstrologicalGuidance } from '../../astrology/integration/calendarSync';
import { useMoonPhase } from '../../astrology/hooks/useMoonPhase';
import { profileManager } from '../../astrology/services/natal/profileManager';
import { calculatePersonalTransits, getCurrentPlanetaryPositions } from '../../oracle/birthChartIntegration';
import type { PersonalTransit } from '../../oracle/birthChartIntegration';
import { calculateSunTimes, calculatePlanetaryHours } from '../../astrology/services/calculations/swissCalculations';
import { calculateCurrentMansion, calculateTrueSolarReturn } from '../../astrology/services/calculations/nakshatras';
import type { CurrentMansion } from '../../astrology/services/calculations/nakshatras';
import { calculateJulianDay, calculateAllPlanets } from '../../astrology/services/swiss-ephemeris/engine';
import { tutorialService } from '../../services/tutorialService';

function isPlannerTask(item: any): item is PlannerTask {
  return item && 'isTask' in item && item.isTask === true;
}

function generateTaskId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

function cloneTaskForDuplicate(task: PlannerTask, targetDayKey: string, targetHekaDate: { year: number; month: number; day: number }): PlannerTask {
  return {
    ...task,
    id: generateTaskId(),
    dayKey: targetDayKey,
    hekaDate: targetHekaDate,
    isCompleted: false,
    completedAt: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function useDayPanel() {
  const dispatch = useDispatch();

  // Redux selectors
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate, shallowEqual);
  const display = useSelector((state: RootState) => state.calendar.display, shallowEqual);
  const location = useSelector((state: RootState) => state.calendar.location);
  const subRegion = useSelector((state: RootState) => state.calendar.subRegion as SubRegionCode | null);
  const astroPreferences = useSelector((state: RootState) => state.calendar.astroPreferences);
  const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
  const astroProfiles = useSelector((state: RootState) => state.calendar.astroProfiles);
  const selectedAstroProfileId = useSelector((state: RootState) => state.calendar.selectedAstroProfileId);
  const notes = useSelector((state: RootState) => state.calendar.notes);

  // Get note key for current day
  const noteKey = useMemo(() =>
    selectedDate ? getNoteKey(selectedDate.year, selectedDate.month, selectedDate.day) : '',
    [selectedDate]
  );

  // Unified day items: notes + planner tasks
  const dayItems = useSelector(
    selectUnifiedDayItems(noteKey),
    shallowEqual
  );

  // Location data
  const locationData = useMemo(() => LOCATIONS[location], [location]);
  const hemisphere = useMemo(() => getHemisphere(locationData.latitude), [locationData.latitude]);

  // Civil date conversion
  const civilDate = useMemo(() =>
    selectedDate ? hekaToCivil(selectedDate) : null,
    [selectedDate]
  );

  // Month info
  const monthInfo = useMemo(() =>
    selectedDate ? HEKA_MONTHS[selectedDate.month] : null,
    [selectedDate]
  );

  // Year label
  const yearLabel = useMemo(() =>
    selectedDate ? getYearLabel(selectedDate.year, selectedDate.month) : '',
    [selectedDate]
  );

  // Moon phase
  const { data: swissMoonData, isLoading: moonLoading } = useMoonPhase(civilDate, hemisphere);

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

  // Lunar Mansion data — live updates on mode switch
  const [currentMansion, setCurrentMansion] = useState<CurrentMansion | null>(null);
  const [mansionLoading, setMansionLoading] = useState(false);

  // Note editing state
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('general');
  const [selectedMood, setSelectedMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  // Task editing state
  const [isTaskMode, setIsTaskMode] = useState(false);
  const [dueTime, setDueTime] = useState('');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(10);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotesMap, setSelectedNotesMap] = useState<Map<string, string>>(new Map());
  const [showDuplicateOptions, setShowDuplicateOptions] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMultiDayPicker, setShowMultiDayPicker] = useState(false);

  // Auto-open task editor when AI coach sends createTask intent
  const prevCreateTaskRef = useRef(false);
  useEffect(() => {
    const raw = selectedDate as any;
    if (selectedDate && raw.createTask && !prevCreateTaskRef.current) {
      setIsTaskMode(true);
      setIsEditing(true);
      if (raw.suggestedTask && typeof raw.suggestedTask === 'string') {
        setNoteText(raw.suggestedTask);
      }
      prevCreateTaskRef.current = true;
    }
    if (!selectedDate || !raw?.createTask) {
      prevCreateTaskRef.current = false;
    }
  }, [selectedDate]);

  // Auto-open note editor when AI coach sends createNote intent
  const prevCreateNoteRef = useRef(false);
  useEffect(() => {
    const raw = selectedDate as any;
    if (selectedDate && raw.createNote && !prevCreateNoteRef.current) {
      setIsTaskMode(false);
      setIsEditing(true);
      prevCreateNoteRef.current = true;
      // Scroll the notes section into view within the day panel
      setTimeout(() => {
        const notesSection = document.querySelector('.notes-section');
        if (notesSection) {
          notesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
    if (!selectedDate || !raw?.createNote) {
      prevCreateNoteRef.current = false;
    }
  }, [selectedDate]);

  // Holidays
  const holidays = useMemo(() => {
    if (!civilDate || !display.showHolidays || location === 'NONE') return [];
    return getHolidaysForDateWithSubRegion(civilDate, location, subRegion || undefined);
  }, [civilDate, display.showHolidays, location, subRegion]);

  // Fetch daily astrology
  useEffect(() => {
    if (selectedDate && civilDate && astroPreferences.showTransitsOnCalendar) {
      setAstrologyLoading(true);
      getDailyAstrology(civilDate, selectedDate)
        .then(data => setDailyAstrology(data))
        .catch(() => setDailyAstrology(null))
        .finally(() => setAstrologyLoading(false));
    } else {
      setDailyAstrology(null);
    }
  }, [selectedDate, civilDate, astroPreferences.showTransitsOnCalendar]);

  // Check birth chart and calculate transits
  useEffect(() => {
    if (!civilDate || !astroPreferences.showTransitsOnCalendar) {
      setHasBirthChart(false);
      setPersonalTransits([]);
      return;
    }

    const activeProfile = profileManager.getActiveProfileWithChart();
    const hasChart = activeProfile && activeProfile.chart && Object.keys(activeProfile.chart.planets || {}).length > 0;

    setHasBirthChart(!!hasChart);
    setBirthChartName(activeProfile?.name || '');

    if (hasChart && activeProfile?.chart) {
      const calculateTransits = async () => {
        try {
          const currentPositions = await getCurrentPlanetaryPositions(civilDate);
          const birthChartData = {
            timestamp: activeProfile.chart.calculatedAt || activeProfile.chart.birthData?.date,
            ascendant: activeProfile.chart.houses?.ascendant || null,
            planets: activeProfile.chart.planets || {},
            houses: activeProfile.chart.houses || {}
          };
          const transits = calculatePersonalTransits(birthChartData as any, currentPositions, civilDate);
          const majorTransits = transits.filter(t => t.strength >= 60).slice(0, 3);
          setPersonalTransits(majorTransits);
        } catch (err) {
          console.error('[useDayPanel] Failed to calculate transits:', err);
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
        const lat = locationData.latitude;
        const long = locationData.longitude;
        if (lat === 0 && long === 0) return;

        const sunTimes = await calculateSunTimes(civilDate, lat, long);
        if (sunTimes.sunrise) {
          setSunriseTime(sunTimes.sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }
        if (sunTimes.sunset) {
          setSunsetTime(sunTimes.sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }

        const hours = await calculatePlanetaryHours(civilDate, lat, long);
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
        console.error('[useDayPanel] Failed to calculate location data:', err);
      }
    };

    calculateLocationData();
  }, [civilDate, locationData, astroPreferences.showTransitsOnCalendar]);

  // Fetch Lunar Mansion for selected day — reacts to mode changes for live separation
  useEffect(() => {
    if (!civilDate || !astroPreferences.showNakshatras) {
      setCurrentMansion(null);
      setMansionLoading(false);
      return;
    }

    setMansionLoading(true);
    try {
      const data = calculateCurrentMansion(civilDate);
      setCurrentMansion(data);
    } catch {
      setCurrentMansion(null);
    } finally {
      setMansionLoading(false);
    }
  }, [civilDate, astroPreferences.showNakshatras, timeMode]);

  // True Solar Return detection — TRUE mode only
  const solarReturnInfo = useMemo(() => {
    if (timeMode !== 'TRUE' || !civilDate || !selectedAstroProfileId) {
      return { isSolarReturn: false, isApproaching: false, daysUntil: 0, exactDate: null, orb: 0, birthSign: '' };
    }

    const profile = astroProfiles.find(p => p.id === selectedAstroProfileId);
    if (!profile?.birthDate) {
      return { isSolarReturn: false, isApproaching: false, daysUntil: 0, exactDate: null, orb: 0, birthSign: '' };
    }

    try {
      const birthDate = new Date(profile.birthDate);
      const birthJD = calculateJulianDay(
        birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate(),
        birthDate.getHours(), birthDate.getMinutes(), 0
      );
      const birthPositions = calculateAllPlanets(birthJD, ['sun'], 'sidereal');
      const birthSunLon = birthPositions.sun?.longitude;
      const birthSign = birthPositions.sun?.sign || '';

      if (birthSunLon === undefined) {
        return { isSolarReturn: false, isApproaching: false, daysUntil: 0, exactDate: null, orb: 0, birthSign: '' };
      }

      // Calculate solar return for the current year
      const currentYear = civilDate.getFullYear();
      const sr = calculateTrueSolarReturn(birthSunLon, currentYear, birthDate.getMonth(), birthDate.getDate());

      if (!sr) {
        return { isSolarReturn: false, isApproaching: false, daysUntil: 0, exactDate: null, orb: 0, birthSign };
      }

      const srDate = new Date(sr.date.getFullYear(), sr.date.getMonth(), sr.date.getDate());
      const civilDay = new Date(civilDate.getFullYear(), civilDate.getMonth(), civilDate.getDate());
      const diffMs = srDate.getTime() - civilDay.getTime();
      const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24));

      return {
        isSolarReturn: daysUntil === 0,
        isApproaching: daysUntil > 0 && daysUntil <= 3,
        daysUntil: Math.max(0, daysUntil),
        exactDate: sr.date,
        orb: sr.orb,
        birthSign,
      };
    } catch (e) {
      console.warn('[useDayPanel] Solar return detection failed:', e);
      return { isSolarReturn: false, isApproaching: false, daysUntil: 0, exactDate: null, orb: 0, birthSign: '' };
    }
  }, [timeMode, civilDate, selectedAstroProfileId, astroProfiles]);

  // Actions
  const handleSaveNote = useCallback(async () => {
    console.log('[handleSaveNote] START — noteKey:', noteKey, 'isTaskMode:', isTaskMode, 'editingTaskId:', editingTaskId, 'selectedDate:', selectedDate);
    if (!noteText.trim() || !noteKey || !selectedDate) {
      console.warn('[handleSaveNote] ABORT — missing text/noteKey/selectedDate');
      return;
    }

    // Preflight auth check for tasks
    if (isTaskMode) {
      const currentUser = getCurrentUser();
      console.log('[handleSaveNote] Preflight auth check — currentUser:', currentUser?.uid || null);
      if (!currentUser) {
        window.alert('You need to be signed in to save tasks. Please open the Account menu and sign in again.');
        return;
      }
    }

    try {
      if (isTaskMode) {
        if (editingTaskId) {
          console.log('[handleSaveNote] Updating existing task', editingTaskId);
          await updatePlannerTaskDoc(editingTaskId, noteKey, {
            content: noteText.trim(),
            category: selectedCategory,
            mood: selectedMood,
            dueTime: dueTime || undefined,
            reminderMinutesBefore,
          });
          console.log('[handleSaveNote] Task updated successfully');
        } else {
          console.log('[handleSaveNote] Creating new task for noteKey:', noteKey);
          const celestialContext = dailyAstrology
            ? {
                moonPhase: dailyAstrology.moonPhase.phase,
                sunSign: dailyAstrology.sunSign,
              }
            : undefined;

          const createdTask = await createPlannerTask({
            content: noteText.trim(),
            category: selectedCategory,
            mood: selectedMood,
            hekaDate: selectedDate,
            dueTime: dueTime || undefined,
            reminderMinutesBefore,
            celestialContext,
          });
          console.log('[handleSaveNote] Task created successfully — task.id:', createdTask.id, 'task.dayKey:', createdTask.dayKey);
        }
      } else {
        console.log('[handleSaveNote] Creating note for noteKey:', noteKey);
        dispatch(addNote({
          key: noteKey,
          content: noteText.trim(),
          category: selectedCategory,
          mood: selectedMood,
        }));
      }

      // Reset editor only on success
      console.log('[handleSaveNote] Resetting editor');
      setNoteText('');
      setSelectedMood(undefined);
      setIsEditing(false);
      setIsTaskMode(false);
      setDueTime('');
      setReminderMinutesBefore(10);
      setEditingTaskId(null);
      tutorialService.trackNoteCreated();
      console.log('[handleSaveNote] DONE');
    } catch (err: any) {
      console.error('[handleSaveNote] FAILED:', err?.message || err);
      window.alert('Unable to save task. Error: ' + (err?.message || 'Unknown'));
    }
  }, [dispatch, noteKey, noteText, selectedCategory, selectedMood, isTaskMode, dueTime, reminderMinutesBefore, editingTaskId, selectedDate, dailyAstrology]);

  const handleDeleteNote = useCallback(async (itemId: string, dayKey?: string) => {
    const targetDayKey = dayKey || noteKey;
    const item = dayItems.find((i) => i.id === itemId);
    if (isPlannerTask(item)) {
      await deletePlannerTask(itemId, targetDayKey);
    } else {
      dispatch(deleteNote({ dayKey: targetDayKey, noteId: itemId }));
    }
  }, [dispatch, noteKey, dayItems]);

  const handleToggleTaskComplete = useCallback(async (taskId: string, dayKey: string) => {
    const task = dayItems.find((i) => i.id === taskId) as PlannerTask | undefined;
    if (!task || !isPlannerTask(task)) return;

    if (task.isCompleted) {
      await reopenPlannerTask(taskId, dayKey);
    } else {
      await completePlannerTask(taskId, dayKey);
    }
  }, [dayItems]);

  const handleEditTask = useCallback((task: PlannerTask) => {
    setEditingTaskId(task.id);
    setNoteText(task.content);
    setSelectedCategory(task.category);
    setSelectedMood(task.mood);
    setIsTaskMode(true);
    setDueTime(task.dueTime || '');
    setReminderMinutesBefore(task.reminderMinutesBefore);
    setIsEditing(true);
  }, []);

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
    dayItems.forEach((i) => newMap.set(i.id, noteKey));
    setSelectedNotesMap(newMap);
  }, [dayItems, noteKey]);

  // Get selected items from unified day items and legacy notes
  const selectedNotesWithKeys = useMemo(() => {
    const result: { item: typeof dayItems[0]; dayKey: string }[] = [];
    selectedNotesMap.forEach((dayKey, itemId) => {
      // Search in unified day items first
      const allItems = [...dayItems, ...(notes[dayKey] || [])];
      const item = allItems.find((i) => i.id === itemId);
      if (item) {
        result.push({ item, dayKey });
      }
    });
    return result;
  }, [selectedNotesMap, dayItems, notes]);

  const uniqueDayKeys = useMemo(() =>
    new Set(selectedNotesMap.values()),
    [selectedNotesMap]
  );
  const isMultiDaySelection = uniqueDayKeys.size > 1;
  const selectedDayCount = uniqueDayKeys.size;
  const selectedNotes = useMemo(() =>
    selectedNotesWithKeys.map(item => item.item),
    [selectedNotesWithKeys]
  );

  // Check for duplicates (only meaningful for NoteData)
  const allNotes = useMemo(() => Object.values(notes).flat(), [notes]);
  const notesWithDuplicates = useMemo(() => {
    const result = new Set<string>();
    selectedNotes.forEach(item => {
      if (isPlannerTask(item)) return;
      const hasDuplicates = allNotes.some(n => n.duplicatedFrom === item.id);
      if (hasDuplicates) {
        result.add(item.id);
      }
    });
    return result;
  }, [selectedNotes, allNotes]);
  const hasAnyDuplicates = notesWithDuplicates.size > 0;

  // Duplicate handlers
  const handleDuplicateToNextWeek = useCallback(() => {
    if (!selectedDate || selectedNotes.length === 0) return;
    const currentCivil = hekaToCivil(selectedDate);
    const nextWeekCivil = new Date(currentCivil);
    nextWeekCivil.setDate(currentCivil.getDate() + 7);
    const targetHeka = civilToHeka(nextWeekCivil);
    if (!targetHeka) {
      alert('Could not calculate target date');
      return;
    }
    const targetKey = getNoteKey(targetHeka.year, targetHeka.month, targetHeka.day);
    let taskCount = 0;
    let noteCount = 0;
    selectedNotes.forEach(item => {
      if (isPlannerTask(item)) {
        dispatch(addPlannerTask(cloneTaskForDuplicate(item, targetKey, targetHeka)));
        taskCount++;
      } else {
        dispatch(addNote({
          key: targetKey,
          content: item.content,
          category: item.category || 'general',
          mood: item.mood,
          duplicatedFrom: item.id,
        }));
        noteCount++;
      }
    });
    const parts = [];
    if (noteCount > 0) parts.push(`${noteCount} note(s)`);
    if (taskCount > 0) parts.push(`${taskCount} task(s)`);
    alert(`Duplicated ${parts.join(' and ')} to next week (${HEKA_MONTHS[targetHeka.month].name} ${targetHeka.day})`);
    handleExitSelectionMode();
  }, [selectedDate, selectedNotes, dispatch, handleExitSelectionMode]);

  const handleDuplicateToNextMonth = useCallback(() => {
    if (!selectedDate || selectedNotes.length === 0) return;
    const currentCivil = hekaToCivil(selectedDate);
    const nextMonthCivil = new Date(currentCivil);
    nextMonthCivil.setDate(currentCivil.getDate() + 28);
    const targetHeka = civilToHeka(nextMonthCivil);
    if (!targetHeka) {
      alert('Could not calculate target date');
      return;
    }
    const targetKey = getNoteKey(targetHeka.year, targetHeka.month, targetHeka.day);
    let taskCount = 0;
    let noteCount = 0;
    selectedNotes.forEach(item => {
      if (isPlannerTask(item)) {
        dispatch(addPlannerTask(cloneTaskForDuplicate(item, targetKey, targetHeka)));
        taskCount++;
      } else {
        dispatch(addNote({
          key: targetKey,
          content: item.content,
          category: item.category || 'general',
          mood: item.mood,
          duplicatedFrom: item.id,
        }));
        noteCount++;
      }
    });
    const parts = [];
    if (noteCount > 0) parts.push(`${noteCount} note(s)`);
    if (taskCount > 0) parts.push(`${taskCount} task(s)`);
    alert(`Duplicated ${parts.join(' and ')} to next month (${HEKA_MONTHS[targetHeka.month].name} ${targetHeka.day})`);
    handleExitSelectionMode();
  }, [selectedDate, selectedNotes, dispatch, handleExitSelectionMode]);

  const handleDuplicateToEveryDayOfWeek = useCallback(() => {
    if (!selectedDate || selectedNotes.length === 0) return;
    const currentDayOfWeek = civilDate ? civilDate.getDay() : 0;
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDayOfWeek];
    if (!confirm(`Duplicate these ${selectedNotes.length} item(s) to EVERY ${dayName} for the rest of the year?`)) return;
    let duplicateCount = 0;
    for (let month = selectedDate.month; month < 13; month++) {
      const daysInMonth = getDaysInMonth(selectedDate.year, month as any);
      for (let day = (month === selectedDate.month) ? selectedDate.day + 1 : 1; day <= daysInMonth; day++) {
        const testCivil = hekaToCivil({ year: selectedDate.year, month, day });
        if (testCivil.getDay() === currentDayOfWeek) {
          const targetKey = getNoteKey(selectedDate.year, month, day);
          selectedNotes.forEach(item => {
            if (isPlannerTask(item)) {
              dispatch(addPlannerTask(cloneTaskForDuplicate(item, targetKey, { year: selectedDate.year, month, day })));
            } else {
              dispatch(addNote({
                key: targetKey,
                content: item.content,
                category: item.category || 'general',
                mood: item.mood,
                duplicatedFrom: item.id,
              }));
            }
          });
          duplicateCount++;
        }
      }
    }
    alert(`Duplicated to ${duplicateCount} ${dayName}s`);
    handleExitSelectionMode();
  }, [selectedDate, selectedNotes, civilDate, dispatch, handleExitSelectionMode]);

  const handleUndoDuplicates = useCallback(() => {
    if (!confirm(`Remove all duplicated instances of these ${notesWithDuplicates.size} note(s)?`)) return;
    notesWithDuplicates.forEach(sourceNoteId => {
      dispatch(deleteDuplicates({ sourceNoteId }));
    });
    alert('Removed duplicated notes');
    handleExitSelectionMode();
  }, [notesWithDuplicates, dispatch, handleExitSelectionMode]);

  const handleDuplicateToSpecificDay = useCallback((targetDate: { year: number; month: number; day: number }) => {
    if (selectedNotes.length === 0) return;
    const targetKey = getNoteKey(targetDate.year, targetDate.month, targetDate.day);
    let taskCount = 0;
    let noteCount = 0;
    selectedNotes.forEach(item => {
      if (isPlannerTask(item)) {
        dispatch(addPlannerTask(cloneTaskForDuplicate(item, targetKey, targetDate)));
        taskCount++;
      } else {
        dispatch(addNote({
          key: targetKey,
          content: item.content,
          category: item.category || 'general',
          mood: item.mood,
          duplicatedFrom: item.id,
        }));
        noteCount++;
      }
    });
    const parts = [];
    if (noteCount > 0) parts.push(`${noteCount} note(s)`);
    if (taskCount > 0) parts.push(`${taskCount} task(s)`);
    alert(`Duplicated ${parts.join(' and ')}`);
    setShowDayPicker(false);
    handleExitSelectionMode();
  }, [selectedNotes, dispatch, handleExitSelectionMode]);

  const handleDuplicateToSpecificDays = useCallback((targetDates: { year: number; month: number; day: number }[]) => {
    if (selectedNotes.length === 0 || targetDates.length === 0) return;
    targetDates.forEach(targetDate => {
      const targetKey = getNoteKey(targetDate.year, targetDate.month, targetDate.day);
      selectedNotes.forEach(item => {
        if (isPlannerTask(item)) {
          dispatch(addPlannerTask(cloneTaskForDuplicate(item, targetKey, targetDate)));
        } else {
          dispatch(addNote({
            key: targetKey,
            content: item.content,
            category: item.category || 'general',
            mood: item.mood,
            duplicatedFrom: item.id,
          }));
        }
      });
    });
    alert(`Duplicated selected items to ${targetDates.length} day(s)`);
    setShowMultiDayPicker(false);
    handleExitSelectionMode();
  }, [selectedNotes, dispatch, handleExitSelectionMode]);

  const handleStartTaskEditing = useCallback(() => {
    tutorialService.trackNoteEditorOpened();
    setIsTaskMode(true);
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setNoteText('');
    setSelectedMood(undefined);
    setIsTaskMode(false);
    setDueTime('');
    setReminderMinutesBefore(10);
    setEditingTaskId(null);
  }, []);

  return {
    // State
    selectedDate,
    display,
    location,
    locationData,
    noteKey,
    dayItems,
    monthInfo,
    yearLabel,
    civilDate,
    hemisphere,
    swissMoonData,
    moonLoading,
    dailyAstrology,
    astrologyLoading,
    hasBirthChart,
    birthChartName,
    personalTransits,
    sunriseTime,
    sunsetTime,
    currentPlanetaryHour,
    holidays,
    notes,
    astroPreferences,
    timeMode,

    // Lunar Mansion
    currentMansion,
    mansionLoading,

    // True Solar Return
    solarReturnInfo,

    // Editing state
    noteText,
    selectedCategory,
    selectedMood,
    isEditing,
    setNoteText,
    setSelectedCategory,
    setSelectedMood,
    setIsEditing,

    // Task editing state
    isTaskMode,
    dueTime,
    reminderMinutesBefore,
    setIsTaskMode,
    setDueTime,
    setReminderMinutesBefore,

    // Selection state
    isSelectionMode,
    selectedNotesMap,
    selectedDayCount,
    isMultiDaySelection,
    hasAnyDuplicates,
    showDuplicateOptions,
    showDayPicker,
    showMultiDayPicker,
    setShowDuplicateOptions,
    setShowDayPicker,
    setShowMultiDayPicker,

    // Actions
    dispatch,
    handleSaveNote,
    handleStartTaskEditing,
    handleDeleteNote,
    handleToggleTaskComplete,
    handleEditTask,
    handleEnterSelectionMode,
    handleToggleNoteSelection,
    handleExitSelectionMode,
    handleSelectAll,
    handleDuplicateToNextWeek,
    handleDuplicateToNextMonth,
    handleDuplicateToEveryDayOfWeek,
    handleUndoDuplicates,
    handleDuplicateToSpecificDay,
    handleDuplicateToSpecificDays,
    handleCancelEdit,
    selectDate: (date: typeof selectedDate) => dispatch(selectDate(date)),
  };
}

export default useDayPanel;
