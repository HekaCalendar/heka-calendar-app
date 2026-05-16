/**
 * Selection Toolbar Component
 * Bulk actions for note selection mode
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('dayPanel');

  return (
    <div className="selection-toolbar">
      <div className="selection-toolbar__header">
        <span className="selection-count">
          {t('selection.selectedFromDays', { count: selectedCount, days: selectedDayCount, suffix: selectedDayCount !== 1 ? 's' : '' })}
        </span>
        <button className="btn btn--sm" onClick={onExitSelectionMode}>
          {t('selection.done')}
        </button>
      </div>

      {!showDuplicateOptions && !showDayPicker && !showMultiDayPicker && (
        <div className="selection-toolbar__actions">
          <button className="btn btn--sm" onClick={onSelectAll}>
            {t('selection.selectAll')}
          </button>
          <button className="btn btn--sm btn--primary" onClick={onShowDuplicateOptions}>
            📋 {t('selection.duplicate')}
          </button>
          <button className="btn btn--sm btn--danger" onClick={onDeleteSelected}>
            🗑️ {t('selection.delete')}
          </button>
        </div>
      )}

      {showDuplicateOptions && !showDayPicker && !showMultiDayPicker && (
        <div className="duplicate-options">
          <div className="duplicate-options__title">
            {hasAnyDuplicates ? t('selection.manageDuplicates') : t('selection.duplicateTo')}
          </div>

          {/* Single day options */}
          {!isMultiDaySelection && (
            <>
              <button className="btn btn--sm" onClick={onDuplicateToNextWeek}>
                📅 {t('selection.nextWeek')}
              </button>
              <button className="btn btn--sm" onClick={onDuplicateToNextMonth}>
                📅 {t('selection.nextMonth')}
              </button>
              {!hasAnyDuplicates ? (
                <button className="btn btn--sm" onClick={onDuplicateToEveryDayOfWeek}>
                  🔁 {t('selection.everyDay', { day: DAY_NAMES[currentDayOfWeek] })}
                </button>
              ) : (
                <button className="btn btn--sm btn--warning" onClick={onUndoDuplicates}>
                  ↩️ {t('selection.undoEveryDay', { day: DAY_NAMES[currentDayOfWeek] })}
                </button>
              )}
              <button className="btn btn--sm" onClick={onShowDayPicker}>
                📍 {t('selection.specificDay')}
              </button>
            </>
          )}

          {/* Multi-day options */}
          {isMultiDaySelection && (
            <>
              <button className="btn btn--sm" onClick={onDuplicateToNextMonth}>
                📅 {t('selection.nextMonth')}
              </button>
              <button className="btn btn--sm" onClick={onShowMultiDayPicker}>
                📍 {t('selection.chooseDays')}
              </button>
            </>
          )}

          <button className="btn btn--sm btn--secondary" onClick={onHideDuplicateOptions}>
            ← {t('selection.back')}
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
