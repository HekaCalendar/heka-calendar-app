/**
 * Day Panel Header
 * Date display and close button
 */

import { memo } from 'react';
import { formatCivilDate } from '../../services/calendarService';
import type { DayPanelHeaderProps } from './types';

export const DayPanelHeader = memo(({
  selectedDate,
  monthName,
  yearLabel,
  civilDate,
  timezone,
  showCivil,
  onClose,
  onAddTask,
}: DayPanelHeaderProps) => {
  return (
    <div className="day-panel__header">
      <div>
        <div className="day-panel__date">
          {monthName} {selectedDate.day}
        </div>
        <div className="day-panel__meta">
          Month {selectedDate.month + 1} / 13 • HEKA Year {yearLabel}
        </div>
        {showCivil && civilDate && (
          <div className="day-panel__civil">
            {formatCivilDate(civilDate, timezone)}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {onAddTask && (
          <button
            className="btn"
            onClick={onAddTask}
            aria-label="Add task"
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(180,140,30,0.25))',
              border: '1px solid rgba(212,175,55,0.55)',
              color: '#f8f7f5',
              boxShadow: '0 2px 8px rgba(212,175,55,0.15)',
            }}
          >
            + Task
          </button>
        )}
        <button
          className="btn btn--icon day-panel-close-btn"
          onClick={onClose}
          aria-label="Close panel"
        >
          ×
        </button>
      </div>
    </div>
  );
});

DayPanelHeader.displayName = 'DayPanelHeader';

export default DayPanelHeader;
