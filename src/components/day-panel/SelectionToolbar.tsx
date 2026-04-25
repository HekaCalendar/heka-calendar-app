/**
 * Selection Toolbar Component
 * Bulk actions for note selection mode
 */

import { memo } from 'react';
import { DayPicker } from './DayPicker';
import { MultiDayPicker } from './MultiDayPicker';
import { DAY_NAMES } from './constants';
import type { SelectionToolbarProps } from './types';

export const SelectionToolbar = memo(({
  selectedCount,
  selectedDayCount,
  hasAnyDuplicates,
  isMultiDaySelection,
  showDuplicateOptions,
  showDayPicker,
  showMultiDayPicker,
  viewDate,
  currentDayOfWeek,
  onExitSelectionMode,
  onSelectAll,
  onShowDuplicateOptions,
  onDuplicateToNextWeek,
  onDuplicateToNextMonth,
  onDuplicateToEveryDayOfWeek,
  onUndoDuplicates,
  onShowDayPicker,
  onShowMultiDayPicker,
  onHideDuplicateOptions,
  onDuplicateToSpecificDay,
  onDuplicateToSpecificDays,
  onDeleteSelected,
}: SelectionToolbarProps) => {
  return (
    <div className="selection-toolbar">
      <div className="selection-toolbar__header">
        <span className="selection-count">
          {selectedCount} selected from {selectedDayCount} day{selectedDayCount !== 1 ? 's' : ''}
        </span>
        <button className="btn btn--sm" onClick={onExitSelectionMode}>
          Done
        </button>
      </div>

      {!showDuplicateOptions && !showDayPicker && !showMultiDayPicker && (
        <div className="selection-toolbar__actions">
          <button className="btn btn--sm" onClick={onSelectAll}>
            Select All
          </button>
          <button className="btn btn--sm btn--primary" onClick={onShowDuplicateOptions}>
            📋 Duplicate...
          </button>
          <button className="btn btn--sm btn--danger" onClick={onDeleteSelected}>
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
              <button className="btn btn--sm" onClick={onDuplicateToNextWeek}>
                📅 Next Week
              </button>
              <button className="btn btn--sm" onClick={onDuplicateToNextMonth}>
                📅 Next Month
              </button>
              {!hasAnyDuplicates ? (
                <button className="btn btn--sm" onClick={onDuplicateToEveryDayOfWeek}>
                  🔁 Every {DAY_NAMES[currentDayOfWeek]}
                </button>
              ) : (
                <button className="btn btn--sm btn--warning" onClick={onUndoDuplicates}>
                  ↩️ Undo Every {DAY_NAMES[currentDayOfWeek]}
                </button>
              )}
              <button className="btn btn--sm" onClick={onShowDayPicker}>
                📍 Specific Day...
              </button>
            </>
          )}

          {/* Multi-day options */}
          {isMultiDaySelection && (
            <>
              <button className="btn btn--sm" onClick={onDuplicateToNextMonth}>
                📅 Next Month
              </button>
              <button className="btn btn--sm" onClick={onShowMultiDayPicker}>
                📍 Choose Day(s)...
              </button>
            </>
          )}

          <button className="btn btn--sm btn--secondary" onClick={onHideDuplicateOptions}>
            ← Back
          </button>
        </div>
      )}

      {showDayPicker && (
        <DayPicker
          currentViewDate={viewDate}
          onSelectDay={onDuplicateToSpecificDay}
          onCancel={() => onHideDuplicateOptions()}
        />
      )}

      {showMultiDayPicker && (
        <MultiDayPicker
          currentViewDate={viewDate}
          onSelectDays={onDuplicateToSpecificDays}
          onCancel={() => onHideDuplicateOptions()}
        />
      )}
    </div>
  );
});

SelectionToolbar.displayName = 'SelectionToolbar';

export default SelectionToolbar;
