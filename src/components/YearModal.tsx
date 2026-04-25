/**
 * Year Modal Component
 * Year overview with 13 mini calendars (optimized)
 */

import { useSelector, useDispatch } from 'react-redux';
import { memo, useMemo } from 'react';
import type { RootState } from '../store';
import { navigateToMonth, setPrintMode, navigateToPrevYear, navigateToNextYear, setView } from '../store';
import { HEKA_MONTHS, getCivilStartOfHekaMonth, getDaysInMonth } from '../services/calendarService';
import { ARC_NAMES, HekaMonthIndex } from '../types';

interface YearModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YearModal: React.FC<YearModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate);
  
  if (!isOpen) return null;
  
  const handlePrevYear = () => dispatch(navigateToPrevYear());
  const handleNextYear = () => dispatch(navigateToNextYear());
  
  const handlePrintYear = () => {
    dispatch(setPrintMode('year'));
    dispatch(setView('print-preview'));
    onClose();
  };
  
  const handleMonthClick = (monthIndex: HekaMonthIndex) => {
    dispatch(navigateToMonth({ year: viewDate.year, month: monthIndex }));
    dispatch(setView('month'));
    onClose();
  };
  
  return (
    <div
      className="modal-overlay year-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal year-modal">
        <div className="modal__header year-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn" onClick={handlePrevYear} aria-label="Previous year">
              ← Prev
            </button>
            <h2 className="modal__title">HEKA Year {viewDate.year}–{viewDate.year + 1}</h2>
            <button className="btn" onClick={handleNextYear} aria-label="Next year">
              Next →
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn--primary" 
              onClick={handlePrintYear}
            >
              Print Year
            </button>
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        
        <div className="year-modal__content">
          {HEKA_MONTHS.map((_, index) => (
            <MiniCalendar
              key={index}
              year={viewDate.year}
              monthIndex={index as HekaMonthIndex}
              onClick={() => handleMonthClick(index as HekaMonthIndex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface MiniCalendarProps {
  year: number;
  monthIndex: HekaMonthIndex;
  onClick: () => void;
}

// Memoized MiniCalendar for performance
const MiniCalendar: React.FC<MiniCalendarProps> = memo(({ year, monthIndex, onClick }) => {
  const monthInfo = HEKA_MONTHS[monthIndex];
  
  // Memoize expensive calculations
  const { days, arcLabel } = useMemo(() => {
    const startDate = getCivilStartOfHekaMonth(year, monthIndex);
    const daysInMonth = getDaysInMonth(year, monthIndex);
    const offset = (startDate.getDay() + 1) % 7;
    
    const daysArray: (number | null)[] = [];
    for (let i = 0; i < offset; i++) {
      daysArray.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      daysArray.push(d);
    }
    
    return {
      days: daysArray,
      arcLabel: ARC_NAMES[monthInfo.arc],
    };
  }, [year, monthIndex, monthInfo.arc]);
  
  // Memoize static day headers
  const dayHeaders = useMemo(() => ['S','S','M','T','W','T','F'], []);
  
  return (
    <div className={`mini-calendar mini-calendar--${monthInfo.arc.toLowerCase()}`} onClick={onClick} role="button" tabIndex={0}>
      <div className="mini-calendar__header">
        <span className="mini-calendar__name">{monthInfo.name}</span>
        <span className={`mini-calendar__arc mini-calendar__arc--${monthInfo.arc.toLowerCase()}`}>
          {arcLabel}
        </span>
      </div>
      <div className="mini-calendar__hint">
        {monthInfo.civilHint}
      </div>
      
      <div className="mini-calendar__grid">
        {dayHeaders.map((d, i) => (
          <div key={i} className="mini-calendar__dow">
            {d}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`mini-calendar__day ${day ? '' : 'mini-calendar__day--empty'}`}
          >
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
});

MiniCalendar.displayName = 'MiniCalendar';
