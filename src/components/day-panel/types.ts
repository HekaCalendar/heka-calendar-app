/**
 * Day Panel Types
 * Shared type definitions for day panel components
 */

import type { NoteCategory, HekaDate, PlannerTask, DayItem } from '../../types';

export interface DayPanelProps {
  // Component receives no props - uses Redux for all data
}

export interface NoteItemProps {
  item: DayItem;
  index: number;
  isSelected: boolean;
  isSelectionMode: boolean;
  onDelete: () => void;
  onLongPress: () => void;
  onToggleSelect: () => void;
  onToggleComplete?: () => void;
  onDoubleTap?: () => void;
}

export interface DayPickerProps {
  currentViewDate: { year: number; month: number };
  onSelectDay: (date: { year: number; month: number; day: number }) => void;
  onCancel: () => void;
}

export interface MultiDayPickerProps {
  currentViewDate: { year: number; month: number };
  onSelectDays: (dates: { year: number; month: number; day: number }[]) => void;
  onCancel: () => void;
}

export interface DayPanelHeaderProps {
  selectedDate: HekaDate;
  monthName: string;
  yearLabel: string;
  civilDate: Date | null;
  timezone: string;
  showCivil: boolean;
  onClose: () => void;
  onAddTask?: () => void;
}

export interface MoonPhaseSectionProps {
  moonData: {
    glyph: string;
    name: string;
    waxing: boolean;
    illumination: number;
    age: number;
  } | null;
  isLoading: boolean;
  hemisphere: 'N' | 'S';
}

export interface HolidaysSectionProps {
  holidays: Array<{
    name: string;
    type: string;
  }>;
  locationName: string;
}

export interface AstrologySectionProps {
  isLoading: boolean;
  hasBirthChart: boolean;
  birthChartName: string;
  dailyAstrology: {
    moonPhase: {
      phase: string;
      name: string;
      illumination: number;
    };
    moonSign: string;
    sunSign: string;
    dailyTheme: string;
    guidance: string;
    journalPrompt: string;
    affirmation: string;
    powerMoment: string | null;
  } | null;
  personalTransits: Array<{
    transitingPlanet: string;
    aspect: string;
    natalPlanet: string;
    orb: number;
    strength: number;
  }>;
  sunriseTime: string | null;
  sunsetTime: string | null;
  currentPlanetaryHour: {
    planet: string;
    symbol: string;
    activities: string[];
  } | null;
  locationName: string;
}

export interface LunarMansionSectionProps {
  mansion: {
    moonMansion: {
      universalName: string;
      symbol: string;
      archetype: string;
      gift: string;
      theme: string;
      ruler: string;
      quality: string;
      totem: string;
    };
    moonQuarter: number;
    sunMansion: {
      universalName: string;
      symbol: string;
    };
  } | null;
  isLoading: boolean;
}

export interface SolarReturnSectionProps {
  isToday: boolean;
  isApproaching: boolean;
  daysUntil: number;
  exactDate: Date | null;
  orb: number;
  birthSign: string;
}

export interface NotesSectionProps {
  dayItems: DayItem[];
  noteKey: string;
  isEditing: boolean;
  isSelectionMode: boolean;
  selectedNotesMap: Map<string, string>;
  selectedDayCount: number;
  hasAnyDuplicates: boolean;
  isMultiDaySelection: boolean;
  showDuplicateOptions: boolean;
  showDayPicker: boolean;
  showMultiDayPicker: boolean;
  viewDate: { year: number; month: number };
  selectedCategory: NoteCategory;
  selectedMood: 1 | 2 | 3 | 4 | 5 | undefined;
  noteText: string;
  isTaskMode: boolean;
  dueTime: string;
  reminderMinutesBefore: number;
  onStartEditing: () => void;
  onStartTaskEditing: () => void;
  onSaveNote: () => void;
  onCancelEdit: () => void;
  onDeleteNote: (noteId: string, dayKey: string) => void;
  onEnterSelectionMode: (noteId: string, dayKey: string) => void;
  onToggleNoteSelection: (noteId: string, dayKey: string) => void;
  onExitSelectionMode: () => void;
  onSelectAll: () => void;
  onSetShowDuplicateOptions: (show: boolean) => void;
  onSetShowDayPicker: (show: boolean) => void;
  onSetShowMultiDayPicker: (show: boolean) => void;
  onSetSelectedCategory: (category: NoteCategory) => void;
  onSetSelectedMood: (mood: 1 | 2 | 3 | 4 | 5 | undefined) => void;
  onSetNoteText: (text: string) => void;
  onSetIsTaskMode: (isTask: boolean) => void;
  onSetDueTime: (time: string) => void;
  onSetReminderMinutesBefore: (minutes: number) => void;
  onToggleTaskComplete: (taskId: string, dayKey: string) => void;
  onEditTask: (task: PlannerTask) => void;
  onDuplicateToNextWeek: () => void;
  onDuplicateToNextMonth: () => void;
  onDuplicateToEveryDayOfWeek: () => void;
  onUndoDuplicates: () => void;
  onDuplicateToSpecificDay: (date: { year: number; month: number; day: number }) => void;
  onDuplicateToSpecificDays: (dates: { year: number; month: number; day: number }[]) => void;
}

export interface NoteEditorProps {
  selectedCategory: NoteCategory;
  selectedMood: 1 | 2 | 3 | 4 | 5 | undefined;
  noteText: string;
  isTaskMode: boolean;
  dueTime: string;
  reminderMinutesBefore: number;
  onSetCategory: (category: NoteCategory) => void;
  onSetMood: (mood: 1 | 2 | 3 | 4 | 5 | undefined) => void;
  onSetText: (text: string) => void;
  onSetIsTaskMode: (isTask: boolean) => void;
  onSetDueTime: (time: string) => void;
  onSetReminderMinutesBefore: (minutes: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface SelectionToolbarProps {
  selectedCount: number;
  selectedDayCount: number;
  hasAnyDuplicates: boolean;
  isMultiDaySelection: boolean;
  showDuplicateOptions: boolean;
  showDayPicker: boolean;
  showMultiDayPicker: boolean;
  viewDate: { year: number; month: number };
  currentDayOfWeek: number;
  onExitSelectionMode: () => void;
  onSelectAll: () => void;
  onShowDuplicateOptions: () => void;
  onDuplicateToNextWeek: () => void;
  onDuplicateToNextMonth: () => void;
  onDuplicateToEveryDayOfWeek: () => void;
  onUndoDuplicates: () => void;
  onShowDayPicker: () => void;
  onShowMultiDayPicker: () => void;
  onHideDuplicateOptions: () => void;
  onDuplicateToSpecificDay: (date: { year: number; month: number; day: number }) => void;
  onDuplicateToSpecificDays: (dates: { year: number; month: number; day: number }[]) => void;
  onDeleteSelected: () => void;
}
