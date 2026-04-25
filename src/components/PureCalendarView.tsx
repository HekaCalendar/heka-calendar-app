/**
 * Pure Calendar View
 * Full-screen calendar - uses CalendarGrid's EXISTING header
 * Just adds Yin-Yang toggle and makes cells 1.25x taller
 */

import { useSelector, useDispatch } from 'react-redux';
import type { ReactNode } from 'react';
import { CalendarGrid } from './CalendarGrid';
import type { RootState } from '../store';
import { setDisplay } from '../store';

interface PureCalendarViewProps {
  settingsSlot?: ReactNode;
  isExpanded?: boolean;
  isExpandedHorizontal?: boolean;
}

export const PureCalendarView: React.FC<PureCalendarViewProps> = ({ settingsSlot, isExpanded, isExpandedHorizontal }) => {
  const dispatch = useDispatch();
  const isLightMode = useSelector((state: RootState) => state.calendar.display.pureModeLight);

  const toggleLightDark = () => {
    dispatch(setDisplay({ pureModeLight: !isLightMode }));
  };

  return (
    <div className={`pure-calendar-view ${isLightMode ? 'pure-calendar-view--light' : ''}`}>
      {/* Safe Area Padding at Top */}
      <div className="pure-safe-area" />
      
      {/* Full-width Settings Toggles */}
      <div className="pure-toggles-container">
        {settingsSlot}
      </div>

      {/* Calendar Grid - Uses its own existing header with Yin-Yang added */}
      <div className="pure-calendar-container">
        <div className="pure-grid-wrapper">
          <CalendarGrid 
            isPureMode={true}
            isLightMode={isLightMode}
            onToggleLightDark={toggleLightDark}
            isExpanded={isExpanded}
            isExpandedHorizontal={isExpandedHorizontal}
          />
        </div>
      </div>
    </div>
  );
};

export default PureCalendarView;
