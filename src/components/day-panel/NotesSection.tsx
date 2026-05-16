/**
 * Notes Section Component
 * Note list, selection mode, and editing form
 */

import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { NoteItem } from './NoteItem';
import { NoteEditor } from './NoteEditor';
import { SelectionToolbar } from './SelectionToolbar';
import type { NotesSectionProps } from './types';
import type { PlannerTask } from '../../types';

function isPlannerTask(item: any): item is PlannerTask {
  return item && 'isTask' in item && item.isTask === true;
}

export const NotesSection = memo(({
  dayItems,
  noteKey,
  isEditing,
  isSelectionMode,
  selectedNotesMap,
  selectedDayCount,
  hasAnyDuplicates,
  isMultiDaySelection,
  showDuplicateOptions,
  showDayPicker,
  showMultiDayPicker,
  viewDate,
  selectedCategory,
  selectedMood,
  noteText,
  isTaskMode,
  dueTime,
  reminderMinutesBefore,
  onStartEditing,
  onSaveNote,
  onCancelEdit,
  onDeleteNote,
  onEnterSelectionMode,
  onToggleNoteSelection,
  onExitSelectionMode,
  onSelectAll,
  onSetShowDuplicateOptions,
  onSetShowDayPicker,
  onSetShowMultiDayPicker,
  onSetSelectedCategory,
  onSetSelectedMood,
  onSetNoteText,
  onSetIsTaskMode,
  onSetDueTime,
  onSetReminderMinutesBefore,
  onToggleTaskComplete,
  onEditTask,
  onDuplicateToNextWeek,
  onDuplicateToNextMonth,
  onDuplicateToEveryDayOfWeek,
  onUndoDuplicates,
  onDuplicateToSpecificDay,
  onDuplicateToSpecificDays,
}: NotesSectionProps) => {
  const { t } = useTranslation('dayPanel');
  const currentDayOfWeek = new Date().getDay();

  // Handle deleting all selected notes
  const handleDeleteSelected = useCallback(() => {
    selectedNotesMap.forEach((dayKey, noteId) => {
      onDeleteNote(noteId, dayKey);
    });
    onExitSelectionMode();
  }, [selectedNotesMap, onDeleteNote, onExitSelectionMode]);

  const taskCount = dayItems.filter((i) => isPlannerTask(i)).length;
  const noteCount = dayItems.length - taskCount;

  const labelText = taskCount > 0 && noteCount > 0
    ? t('notesSection.tasksAndNotes', { tasks: taskCount, notes: noteCount })
    : taskCount > 0
    ? t('notesSection.tasksOnly', { count: taskCount })
    : t('notesSection.notesAndTasks', { count: dayItems.length });

  return (
    <div className="day-panel__section notes-section">
      {/* Selection Mode Toolbar */}
      {isSelectionMode ? (
        <SelectionToolbar
          selectedCount={selectedNotesMap.size}
          selectedDayCount={selectedDayCount}
          hasAnyDuplicates={hasAnyDuplicates}
          isMultiDaySelection={isMultiDaySelection}
          showDuplicateOptions={showDuplicateOptions}
          showDayPicker={showDayPicker}
          showMultiDayPicker={showMultiDayPicker}
          viewDate={viewDate}
          currentDayOfWeek={currentDayOfWeek}
          onExitSelectionMode={onExitSelectionMode}
          onSelectAll={onSelectAll}
          onShowDuplicateOptions={() => onSetShowDuplicateOptions(true)}
          onDuplicateToNextWeek={onDuplicateToNextWeek}
          onDuplicateToNextMonth={onDuplicateToNextMonth}
          onDuplicateToEveryDayOfWeek={onDuplicateToEveryDayOfWeek}
          onUndoDuplicates={onUndoDuplicates}
          onShowDayPicker={() => onSetShowDayPicker(true)}
          onShowMultiDayPicker={() => onSetShowMultiDayPicker(true)}
          onHideDuplicateOptions={() => {
            onSetShowDuplicateOptions(false);
            onSetShowDayPicker(false);
            onSetShowMultiDayPicker(false);
          }}
          onDuplicateToSpecificDay={onDuplicateToSpecificDay}
          onDuplicateToSpecificDays={onDuplicateToSpecificDays}
          onDeleteSelected={handleDeleteSelected}
        />
      ) : (
        <div className="day-panel__label" style={{ alignItems: 'flex-start' }}>
          <span style={{ lineHeight: 1.4 }}>
            {labelText}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button
              className="btn"
              onClick={onStartEditing}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 500,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {t('notesSection.addNote')}
            </button>

          </div>
        </div>
      )}

      {/* Long-press hint - shows when notes exist and not in selection/edit mode */}
      {dayItems.length > 0 && !isSelectionMode && !isEditing && (
        <div className="note-hint">
          <span className="note-hint__icon">👇</span>
          <span className="note-hint__text">{t('notesSection.longHoldHint')}</span>
        </div>
      )}

      {/* Existing Notes List */}
      {dayItems.length > 0 && (
        <div className={`notes-list ${isSelectionMode ? 'selection-active' : ''}`}>
          {dayItems.map((item, index) => (
            <NoteItem
              key={item.id}
              item={item}
              index={index}
              isSelected={selectedNotesMap.has(item.id)}
              isSelectionMode={isSelectionMode}
              onDelete={() => onDeleteNote(item.id, noteKey)}
              onLongPress={() => onEnterSelectionMode(item.id, noteKey)}
              onToggleSelect={() => onToggleNoteSelection(item.id, noteKey)}
              onToggleComplete={isPlannerTask(item) ? () => onToggleTaskComplete(item.id, noteKey) : undefined}
              onDoubleTap={isPlannerTask(item) ? () => onEditTask(item) : undefined}
            />
          ))}
        </div>
      )}

      {/* Note Editing Form */}
      {isEditing && (
        <NoteEditor
          selectedCategory={selectedCategory}
          selectedMood={selectedMood}
          noteText={noteText}
          isTaskMode={isTaskMode}
          dueTime={dueTime}
          reminderMinutesBefore={reminderMinutesBefore}
          onSetCategory={onSetSelectedCategory}
          onSetMood={onSetSelectedMood}
          onSetText={onSetNoteText}
          onSetIsTaskMode={onSetIsTaskMode}
          onSetDueTime={onSetDueTime}
          onSetReminderMinutesBefore={onSetReminderMinutesBefore}
          onSave={onSaveNote}
          onCancel={onCancelEdit}
        />
      )}

      {dayItems.length === 0 && !isEditing && (
        <p className="no-notes" style={{ color: '#a1a1aa', fontSize: '13px', marginTop: 8 }}>
          {t('notesSection.noNotesOrTasks')}<br />
          <Trans i18nKey="dayPanel:notesSection.createNoteHint" components={{
            0: <strong style={{ color: '#f8f7f5' }} />,
            1: <strong style={{ color: '#d4af37' }} />,
          }} />
        </p>
      )}
    </div>
  );
});

NotesSection.displayName = 'NotesSection';

export default NotesSection;
