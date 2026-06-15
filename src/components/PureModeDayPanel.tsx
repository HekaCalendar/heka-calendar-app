/**
 * Pure Mode Day Panel - Half-Screen Overlay
 * 
 * Features:
 * - Opens on ANY cell click in Pure Mode
 * - Half-screen overlay (slides up from bottom)
 * - Full Day Panel functionality:
 *   - Holidays display
 *   - Swiss Ephemeris moon phase
 *   - Full note management (add, edit, delete, duplicate)
 *   - Note categories and moods (emoji)
 *   - Multi-select for bulk operations
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { selectNoteIdsWithDuplicates } from '../store';
import { addNote, deleteNote, deleteDuplicates } from '../store';
import { selectUnifiedDayItems, addPlannerTask } from '../store/plannerSlice';
import { createPlannerTask, deletePlannerTask, completePlannerTask, reopenPlannerTask } from '../services/plannerService';
import { HEKA_MONTHS, hekaToCivil, civilToHeka, getNoteKey, getDaysInMonth } from '../services/calendarService';
import { getHolidaysForDateWithSubRegion, getYearLabel, LOCATIONS, getHemisphere, type SubRegionCode, type NoteCategory, type NoteData, type PlannerTask, type DayItem, type HekaMonthIndex } from '../types';
import { useMoonPhase } from '../astrology/hooks/useMoonPhase';
import { DayPanelHeader } from './day-panel/DayPanelHeader';
import { MoonPhaseSection } from './day-panel/MoonPhaseSection';
import { HolidaysSection } from './day-panel/HolidaysSection';
import { NotesSection } from './day-panel/NotesSection';
import type { CalendarDay } from '../types';

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

interface PureModeDayPanelProps {
  day: CalendarDay | null;
  isOpen: boolean;
  onClose: (preserveSelection?: boolean) => void;
  // Selection mode props (from parent for persistence across cell clicks)
  isSelectionMode?: boolean;
  selectedNotesMap?: Map<string, string>;
  onToggleNoteSelection?: (noteId: string, dayKey: string) => void;
  onEnterSelectionMode?: (noteId: string, dayKey: string) => void;
  onExitSelectionMode?: () => void;
}

export const PureModeDayPanel: React.FC<PureModeDayPanelProps> = ({
  day,
  isOpen,
  onClose,
  // Selection mode props
  isSelectionMode: externalSelectionMode,
  selectedNotesMap: externalNotesMap,
  onToggleNoteSelection: externalToggleSelection,
  onEnterSelectionMode: externalEnterSelection,
  onExitSelectionMode: externalExitSelection,
}) => {
  const dispatch = useDispatch();
  
  // Selection mode state (internal fallback when external not provided)
  const [internalSelectionMode, setInternalSelectionMode] = useState(false);
  const [internalNotesMap, setInternalNotesMap] = useState<Map<string, string>>(new Map());
  
  // Use external props if provided, otherwise use internal state
  const isSelectionMode = externalSelectionMode ?? internalSelectionMode;
  const selectedNotesMap = externalNotesMap ?? internalNotesMap;
  const toggleSelection = externalToggleSelection ?? (() => {});
  const enterSelection = externalEnterSelection ?? (() => {});
  const exitSelection = externalExitSelection ?? (() => {});
  
  // Get display settings
  const display = useSelector((state: RootState) => state.calendar.display);
  const location = useSelector((state: RootState) => state.calendar.location);
  const subRegion = useSelector((state: RootState) => state.calendar.subRegion as SubRegionCode | null);
  const allNotes = useSelector((state: RootState) => state.calendar.notes);

  // Location data
  const locationData = useMemo(() => LOCATIONS[location], [location]);
  const hemisphere = useMemo(() => getHemisphere(locationData.latitude), [locationData.latitude]);
  
  // Get date info
  const hekaDate = day?.hekaDate || null;
  const civilDate = useMemo(() => hekaDate ? hekaToCivil(hekaDate) : null, [hekaDate]);
  const monthInfo = useMemo(() => hekaDate ? HEKA_MONTHS[hekaDate.month] : null, [hekaDate]);
  const yearLabel = useMemo(() => hekaDate ? getYearLabel(hekaDate.year, hekaDate.month) : '', [hekaDate]);
  
  // Note key for this day
  const noteKey = useMemo(() => 
    hekaDate ? getNoteKey(hekaDate.year, hekaDate.month, hekaDate.day) : '',
    [hekaDate]
  );
  
  const dayItems = useSelector(selectUnifiedDayItems(noteKey), shallowEqual);

  // Moon phase data
  const { data: swissMoonData, isLoading: moonLoading } = useMoonPhase(civilDate, hemisphere);
  
  // Holidays
  const holidays = useMemo(() => {
    if (!civilDate || !display.showHolidays || location === 'NONE') return [];
    return getHolidaysForDateWithSubRegion(civilDate, location, subRegion || undefined);
  }, [civilDate, display.showHolidays, location, subRegion]);
  
  // Note editing state
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('general');
  const [selectedMood, setSelectedMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  // Task editing state
  const [isTaskMode, setIsTaskMode] = useState(false);
  const [dueTime, setDueTime] = useState('');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(10);

  // UI state
  const [showDuplicateOptions, setShowDuplicateOptions] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMultiDayPicker, setShowMultiDayPicker] = useState(false);
  
  // Determine if using external selection state
  const hasExternalSelection = externalSelectionMode !== undefined;
  
  // Reset state when panel opens/closes (but don't clear external selection state)
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setShowDuplicateOptions(false);
      setNoteText('');
      setSelectedMood(undefined);
      setIsTaskMode(false);
      setDueTime('');
      setReminderMinutesBefore(10);
      // Only reset internal selection state
      if (!hasExternalSelection) {
        setInternalSelectionMode(false);
        setInternalNotesMap(new Map());
      }
    }
  }, [isOpen, hasExternalSelection]);
  
  // Close on escape - preserve selection if in selection mode
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose(isSelectionMode);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isSelectionMode]);
  
  // Planner tasks for lookup
  const plannerTasks = useSelector((state: RootState) => state.planner.tasks);

  // Compute selected notes (needed for duplicate handlers)
  const selectedNotes = useMemo(() => {
    const result: DayItem[] = [];
    selectedNotesMap.forEach((dayKey, noteId) => {
      const items: DayItem[] = [...(allNotes[dayKey] || []), ...(plannerTasks[dayKey] || [])];
      const item = items.find((i) => i.id === noteId);
      if (item) result.push(item);
    });
    return result;
  }, [selectedNotesMap, allNotes, plannerTasks]);
  
  const uniqueDayKeys = useMemo(() =>
    new Set(selectedNotesMap.values()),
    [selectedNotesMap]
  );
  const isMultiDaySelection = uniqueDayKeys.size > 1;
  const selectedDayCount = uniqueDayKeys.size;
  
  // Check for duplicates
  const noteIdsWithDuplicates = useSelector(selectNoteIdsWithDuplicates);
  const notesWithDuplicates = useMemo(() => {
    const result = new Set<string>();
    selectedNotes.forEach((note: NoteData) => {
      if (noteIdsWithDuplicates.has(note.id)) {
        result.add(note.id);
      }
    });
    return result;
  }, [selectedNotes, noteIdsWithDuplicates]);
  const hasAnyDuplicates = notesWithDuplicates.size > 0;
  
  // Note actions
  const handleSaveNote = useCallback(async () => {
    if (!noteText.trim() || !noteKey || !hekaDate) return;

    if (isTaskMode) {
      await createPlannerTask({
        content: noteText.trim(),
        category: selectedCategory,
        mood: selectedMood,
        hekaDate,
        dueTime: dueTime || undefined,
        reminderMinutesBefore,
      });
    } else {
      dispatch(addNote({
        key: noteKey,
        content: noteText.trim(),
        category: selectedCategory,
        mood: selectedMood,
      }));
    }

    setNoteText('');
    setSelectedMood(undefined);
    setIsEditing(false);
    setIsTaskMode(false);
    setDueTime('');
    setReminderMinutesBefore(10);
  }, [dispatch, noteKey, noteText, selectedCategory, selectedMood, isTaskMode, dueTime, reminderMinutesBefore, hekaDate]);
  
  const handleDeleteNote = useCallback(async (noteId: string, dayKey?: string) => {
    const targetDayKey = dayKey || noteKey;
    const item = dayItems.find((i) => i.id === noteId);
    if (item && 'isTask' in item && item.isTask) {
      await deletePlannerTask(noteId, targetDayKey);
    } else {
      dispatch(deleteNote({ dayKey: targetDayKey, noteId }));
    }
  }, [dispatch, noteKey, dayItems]);

  const handleToggleTaskComplete = useCallback(async (taskId: string, dayKey: string) => {
    const task = dayItems.find((i) => i.id === taskId) as PlannerTask | undefined;
    if (!task || !('isTask' in task) || !task.isTask) return;
    if (task.isCompleted) {
      await reopenPlannerTask(taskId, dayKey);
    } else {
      await completePlannerTask(taskId, dayKey);
    }
  }, [dayItems]);

  const handleEditTask = useCallback((task: PlannerTask) => {
    // Pure Mode doesn't support full task editing yet; noop for Phase 2
    console.log('[PureMode] Task editing not yet supported for tasks in pure mode:', task.id);
  }, []);
  
  const handleEnterSelectionMode = useCallback((noteId: string, dayKey: string) => {
    if (hasExternalSelection) {
      enterSelection(noteId, dayKey);
    } else {
      setInternalSelectionMode(true);
      const newMap = new Map<string, string>();
      newMap.set(noteId, dayKey);
      setInternalNotesMap(newMap);
    }
  }, [hasExternalSelection, enterSelection]);
  
  const handleToggleNoteSelection = useCallback((noteId: string, dayKey: string) => {
    if (hasExternalSelection) {
      toggleSelection(noteId, dayKey);
    } else {
      setInternalNotesMap(prev => {
        const newMap = new Map(prev);
        if (newMap.has(noteId)) {
          newMap.delete(noteId);
        } else {
          newMap.set(noteId, dayKey);
        }
        return newMap;
      });
    }
  }, [hasExternalSelection, toggleSelection]);
  
  const handleExitSelectionMode = useCallback(() => {
    if (hasExternalSelection) {
      exitSelection();
    } else {
      setInternalSelectionMode(false);
      setInternalNotesMap(new Map());
    }
    setShowDuplicateOptions(false);
    setShowDayPicker(false);
    setShowMultiDayPicker(false);
  }, [hasExternalSelection, exitSelection]);
  
  const handleSelectAll = useCallback(() => {
    if (hasExternalSelection) {
      // For external mode, need to add all via toggle (simplest approach)
      dayItems.forEach((item) => {
        if (!selectedNotesMap.has(item.id)) {
          toggleSelection(item.id, noteKey);
        }
      });
    } else {
      const newMap = new Map<string, string>();
      dayItems.forEach((item) => newMap.set(item.id, noteKey));
      setInternalNotesMap(newMap);
    }
  }, [dayItems, noteKey, hasExternalSelection, toggleSelection, selectedNotesMap]);
  
  // Duplicate handlers
  const handleDuplicateToNextWeek = useCallback(() => {
    if (!hekaDate || selectedNotes.length === 0) return;
    const currentCivil = hekaToCivil(hekaDate);
    const nextWeekCivil = new Date(currentCivil);
    nextWeekCivil.setDate(currentCivil.getDate() + 7);
    const targetHeka = civilToHeka(nextWeekCivil);
    if (!targetHeka) return;
    
    const targetKey = getNoteKey(targetHeka.year, targetHeka.month, targetHeka.day);
    selectedNotes.forEach((item) => {
      if ('isTask' in item && item.isTask) {
        dispatch(addPlannerTask(cloneTaskForDuplicate(item as PlannerTask, targetKey, targetHeka)));
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
    handleExitSelectionMode();
  }, [hekaDate, selectedNotes, dispatch, handleExitSelectionMode]);
  
  const handleDuplicateToNextMonth = useCallback(() => {
    if (!hekaDate || selectedNotes.length === 0) return;
    const currentCivil = hekaToCivil(hekaDate);
    const nextMonthCivil = new Date(currentCivil);
    nextMonthCivil.setDate(currentCivil.getDate() + 28);
    const targetHeka = civilToHeka(nextMonthCivil);
    if (!targetHeka) return;
    
    const targetKey = getNoteKey(targetHeka.year, targetHeka.month, targetHeka.day);
    selectedNotes.forEach((item) => {
      if ('isTask' in item && item.isTask) {
        dispatch(addPlannerTask(cloneTaskForDuplicate(item as PlannerTask, targetKey, targetHeka)));
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
    handleExitSelectionMode();
  }, [hekaDate, selectedNotes, dispatch, handleExitSelectionMode]);
  
  const handleDuplicateToEveryDayOfWeek = useCallback(() => {
    if (!hekaDate || selectedNotes.length === 0 || !civilDate) return;
    const currentDayOfWeek = civilDate.getDay();
    
    for (let month = hekaDate.month; month < 13; month++) {
      const daysInMonth = getDaysInMonth(hekaDate.year, month as HekaMonthIndex);
      for (let day = (month === hekaDate.month) ? hekaDate.day + 1 : 1; day <= daysInMonth; day++) {
        const testCivil = hekaToCivil({ year: hekaDate.year, month, day });
        if (testCivil.getDay() === currentDayOfWeek) {
          const targetKey = getNoteKey(hekaDate.year, month, day);
          selectedNotes.forEach((item) => {
            if ('isTask' in item && item.isTask) {
              dispatch(addPlannerTask(cloneTaskForDuplicate(item as PlannerTask, targetKey, { year: hekaDate.year, month, day })));
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
        }
      }
    }
    handleExitSelectionMode();
  }, [hekaDate, selectedNotes, civilDate, dispatch, handleExitSelectionMode]);
  
  const handleUndoDuplicates = useCallback(() => {
    notesWithDuplicates.forEach((sourceNoteId: string) => {
      dispatch(deleteDuplicates({ sourceNoteId }));
    });
    handleExitSelectionMode();
  }, [notesWithDuplicates, dispatch, handleExitSelectionMode]);
  
  const handleDuplicateToSpecificDay = useCallback((targetDate: { year: number; month: number; day: number }) => {
    if (selectedNotes.length === 0) return;
    const targetKey = getNoteKey(targetDate.year, targetDate.month, targetDate.day);
    selectedNotes.forEach((item) => {
      if ('isTask' in item && item.isTask) {
        dispatch(addPlannerTask(cloneTaskForDuplicate(item as PlannerTask, targetKey, targetDate)));
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
    setShowDayPicker(false);
    handleExitSelectionMode();
  }, [selectedNotes, dispatch, handleExitSelectionMode]);
  
  const handleDuplicateToSpecificDays = useCallback((targetDates: { year: number; month: number; day: number }[]) => {
    if (selectedNotes.length === 0 || targetDates.length === 0) return;
    targetDates.forEach(targetDate => {
      const targetKey = getNoteKey(targetDate.year, targetDate.month, targetDate.day);
      selectedNotes.forEach((item) => {
        if ('isTask' in item && item.isTask) {
          dispatch(addPlannerTask(cloneTaskForDuplicate(item as PlannerTask, targetKey, targetDate)));
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
    setShowMultiDayPicker(false);
    handleExitSelectionMode();
  }, [selectedNotes, dispatch, handleExitSelectionMode]);
  
  const handleStartTaskEditing = useCallback(() => {
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
  }, []);
  
  if (!isOpen || !day || !hekaDate || !monthInfo) return null;
  
  return (
    <div className="pure-mode-panel-overlay" onClick={() => onClose(isSelectionMode)}>
      <div 
        className="pure-mode-day-panel"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <DayPanelHeader
          selectedDate={hekaDate}
          monthName={monthInfo.name}
          yearLabel={yearLabel}
          civilDate={civilDate}
          timezone={locationData.timezone}
          showCivil={display.showCivilDates}
          onClose={() => onClose(isSelectionMode)}
          onAddTask={handleStartTaskEditing}
        />
        
        {/* Moon Phase */}
        {display.showMoonPhases && (
          <MoonPhaseSection
            moonData={swissMoonData}
            isLoading={moonLoading}
            hemisphere={hemisphere}
          />
        )}
        
        {/* Holidays */}
        {display.showHolidays && holidays.length > 0 && (
          <HolidaysSection
            holidays={holidays}
            locationName={locationData.name}
          />
        )}
        
        {/* Notes Section - No astrology in Pure Mode */}
        <NotesSection
          dayItems={dayItems}
          noteKey={noteKey}
          isEditing={isEditing}
          isSelectionMode={isSelectionMode}
          selectedNotesMap={selectedNotesMap}
          selectedDayCount={selectedDayCount}
          hasAnyDuplicates={hasAnyDuplicates}
          isMultiDaySelection={isMultiDaySelection}
          showDuplicateOptions={showDuplicateOptions}
          showDayPicker={showDayPicker}
          showMultiDayPicker={showMultiDayPicker}
          viewDate={{ year: hekaDate.year, month: hekaDate.month }}
          selectedCategory={selectedCategory}
          selectedMood={selectedMood}
          noteText={noteText}
          isTaskMode={isTaskMode}
          dueTime={dueTime}
          reminderMinutesBefore={reminderMinutesBefore}
          onStartEditing={() => setIsEditing(true)}
          onStartTaskEditing={handleStartTaskEditing}
          onSaveNote={handleSaveNote}
          onCancelEdit={handleCancelEdit}
          onDeleteNote={handleDeleteNote}
          onEnterSelectionMode={handleEnterSelectionMode}
          onToggleNoteSelection={handleToggleNoteSelection}
          onExitSelectionMode={handleExitSelectionMode}
          onSelectAll={handleSelectAll}
          onSetShowDuplicateOptions={setShowDuplicateOptions}
          onSetShowDayPicker={setShowDayPicker}
          onSetShowMultiDayPicker={setShowMultiDayPicker}
          onSetSelectedCategory={setSelectedCategory}
          onSetSelectedMood={setSelectedMood}
          onSetNoteText={setNoteText}
          onSetIsTaskMode={setIsTaskMode}
          onSetDueTime={setDueTime}
          onSetReminderMinutesBefore={setReminderMinutesBefore}
          onToggleTaskComplete={handleToggleTaskComplete}
          onEditTask={handleEditTask}
          onDuplicateToNextWeek={handleDuplicateToNextWeek}
          onDuplicateToNextMonth={handleDuplicateToNextMonth}
          onDuplicateToEveryDayOfWeek={handleDuplicateToEveryDayOfWeek}
          onUndoDuplicates={handleUndoDuplicates}
          onDuplicateToSpecificDay={handleDuplicateToSpecificDay}
          onDuplicateToSpecificDays={handleDuplicateToSpecificDays}
        />
      </div>
    </div>
  );
};

export default PureModeDayPanel;
