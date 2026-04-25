/**
 * Day Picker Component
 * Single day selection for duplication - Calendar layout
 */

import { memo, useState, useMemo } from 'react';
import { HEKA_MONTHS, getDaysInMonth, getCivilStartOfHekaMonth, hekaToCivil } from '../../services/calendarService';
import type { HekaMonthIndex } from '../../types';
import type { DayPickerProps } from './types';

// Day of week headers - HEKA calendar starts on Saturday
const DOW_HEADERS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const DayPicker = memo(({ currentViewDate, onSelectDay, onCancel }: DayPickerProps) => {
  const [pickerYear, setPickerYear] = useState(currentViewDate.year);
  const [pickerMonth, setPickerMonth] = useState(currentViewDate.month);

  const daysInMonth = useMemo(() =>
    getDaysInMonth(pickerYear, pickerMonth as HekaMonthIndex),
    [pickerYear, pickerMonth]
  );

  // Calculate the day of week for the first day of the month
  const firstDayOffset = useMemo(() => {
    const firstDayCivil = getCivilStartOfHekaMonth(pickerYear, pickerMonth as HekaMonthIndex);
    return (firstDayCivil.getDay() + 1) % 7; // Saturday-start
  }, [pickerYear, pickerMonth]);

  // Calculate day of week for each day (for tooltips)
  const getDayOfWeek = (day: number): string => {
    const civil = hekaToCivil({ year: pickerYear, month: pickerMonth as HekaMonthIndex, day });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[civil.getDay()];
  };

  const monthName = HEKA_MONTHS[pickerMonth].name;

  // Generate all cells for the grid (empty + days) in a flat array
  const gridCells = useMemo(() => {
    const cells: { day: number | null; label?: string }[] = [];

    // Empty cells for days before the first day
    for (let i = 0; i < firstDayOffset; i++) {
      cells.push({ day: null });
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day, label: `${getDayOfWeek(day)}, ${monthName} ${day}` });
    }

    // Fill remaining cells to complete the last week
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 0; i < remaining; i++) {
      cells.push({ day: null });
    }

    return cells;
  }, [firstDayOffset, daysInMonth, monthName]);

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

      {/* Day of week headers - rendered as first row inside the grid */}
      <div className="day-picker__grid" style={{ marginBottom: '4px' }}>
        {DOW_HEADERS.map(dow => (
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
              className="day-picker__day"
              onClick={() => onSelectDay({ year: pickerYear, month: pickerMonth, day: cell.day! })}
              title={cell.label}
            >
              {cell.day}
            </button>
          ) : (
            <span key={index} className="day-picker__day" style={{ visibility: 'hidden', pointerEvents: 'none' }} />
          )
        ))}
      </div>

      <button className="btn btn--sm btn--secondary day-picker__cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
});

DayPicker.displayName = 'DayPicker';

export default DayPicker;
