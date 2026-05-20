/**
 * Multi Day Picker Component
 * Multiple day selection for duplication - Calendar layout
 */

import { memo, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { HEKA_MONTHS, getDaysInMonth, getCivilStartOfHekaMonth } from '../../services/calendarService';
import type { MultiDayPickerProps } from './types';
import type { HekaMonthIndex } from '../../types';

export const MultiDayPicker = memo(({ currentViewDate, onSelectDays, onCancel }: MultiDayPickerProps) => {
  const { t } = useTranslation('dayPanel');
  const [pickerYear, setPickerYear] = useState(currentViewDate.year);
  const [pickerMonth, setPickerMonth] = useState(currentViewDate.month);
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());

  const daysInMonth = useMemo(() =>
    getDaysInMonth(pickerYear, pickerMonth as HekaMonthIndex),
    [pickerYear, pickerMonth]
  );

  // Calculate the day of week for the first day of the month
  const firstDayOffset = useMemo(() => {
    const firstDayCivil = getCivilStartOfHekaMonth(pickerYear, pickerMonth as HekaMonthIndex);
    return (firstDayCivil.getDay() + 1) % 7; // Saturday-start
  }, [pickerYear, pickerMonth]);

  const monthName = HEKA_MONTHS[pickerMonth].name;

  const toggleDay = useCallback((day: number) => {
    setSelectedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
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

  // Generate all cells for the grid (empty + days) in a flat array
  const gridCells = useMemo(() => {
    const cells: { day: number | null }[] = [];

    // Empty cells for days before the first day
    for (let i = 0; i < firstDayOffset; i++) {
      cells.push({ day: null });
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day });
    }

    // Fill remaining cells to complete the last week
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 0; i < remaining; i++) {
      cells.push({ day: null });
    }

    return cells;
  }, [firstDayOffset, daysInMonth]);

  const dowHeaders = [
    t('dow.short.sat'),
    t('dow.short.sun'),
    t('dow.short.mon'),
    t('dow.short.tue'),
    t('dow.short.wed'),
    t('dow.short.thu'),
    t('dow.short.fri'),
  ];

  return (
    <div className="day-picker day-picker--calendar">
      <div className="day-picker__header">
        <button className="btn btn--icon" onClick={() => {
          if (pickerMonth === 0) {
            setPickerMonth(12);
            setPickerYear(y => y - 1);
          } else {
            setPickerMonth(m => m - 1);
          }
          setSelectedDays(new Set());
        }} aria-label={t('common.previous')}>←</button>
        <span className="day-picker__month">{monthName} {pickerYear}</span>
        <button className="btn btn--icon" onClick={() => {
          if (pickerMonth === 12) {
            setPickerMonth(0);
            setPickerYear(y => y + 1);
          } else {
            setPickerMonth(m => m + 1);
          }
          setSelectedDays(new Set());
        }} aria-label={t('common.nextItem')}>→</button>
      </div>

      {/* Day of week headers - rendered as first row inside the grid */}
      <div className="day-picker__grid" style={{ marginBottom: '4px' }}>
        {dowHeaders.map(dow => (
          <div key={dow} className="day-picker__dow-cell" style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            padding: '4px 0',
            fontWeight: 600,
          }}>{dow}</div>
        ))}
      </div>

      {/* Calendar grid */}
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
        <span className="selected-count">{t('multiDayPicker.selectedCount', { count: selectedDays.size, suffix: selectedDays.size !== 1 ? 's' : '' })}</span>
        <div className="day-picker__actions">
          <button
            className="btn btn--sm btn--primary"
            onClick={handleConfirm}
            disabled={selectedDays.size === 0}
          >
            {t('multiDayPicker.confirm')}
          </button>
          <button className="btn btn--sm btn--secondary" onClick={onCancel}>
            {t('multiDayPicker.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
});

MultiDayPicker.displayName = 'MultiDayPicker';

export default MultiDayPicker;
