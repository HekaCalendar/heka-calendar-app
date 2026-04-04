/**
 * Month Header Component
 * Month navigation and primary actions
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { prevMonth, nextMonth, navigateToToday, toggleDisplay } from '../store';

import { useFeatureDiscovery, useSettingsTracking } from '../hooks/useGamification';
import { trackMonthNavigation } from '../services/engagementService';
import { tutorialService } from '../services/tutorialService';

interface MonthHeaderProps {
  onPrintClick: () => void;
  onAstrologyClick: () => void;
  onYearClick: () => void;
  onSearchClick: () => void;
  onFriendsClick: () => void;
  onStatsClick: () => void;
  onCommunityClick: () => void;
  onJournalClick: () => void;

  onInfoClick: () => void;
  isCalendarExpanded?: boolean;
  onToggleExpand?: () => void;
  isCalendarExpandedHorizontal?: boolean;
  onToggleExpandHorizontal?: () => void;
}

export const MonthHeader: React.FC<MonthHeaderProps> = ({ 
  onPrintClick, 
  onAstrologyClick,
  onYearClick,
  onSearchClick,
  onFriendsClick,
  onStatsClick,
  onCommunityClick,
  onJournalClick,
  onInfoClick,
  isCalendarExpanded = false,
  onToggleExpand,
  isCalendarExpandedHorizontal = false,
  onToggleExpandHorizontal,
}) => {
  const dispatch = useDispatch();
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate);
  const display = useSelector((state: RootState) => state.calendar.display);
  const { discover } = useFeatureDiscovery();
  const { trackDisplay } = useSettingsTracking();
  
  const { showCivilDates, showMoonPhases, showHolidays } = display;
  
  const handleToggleCivil = () => {
    dispatch(toggleDisplay('showCivilDates'));
    tutorialService.trackDisplayToggle('showCivilDates', !showCivilDates);
  };
  
  const handleToggleMoon = () => {
    dispatch(toggleDisplay('showMoonPhases'));
    if (!showMoonPhases) {
      discover('enabledMoonPhases');
      trackDisplay('showMoonPhases', true);
    }
    tutorialService.trackDisplayToggle('showMoonPhases', !showMoonPhases);
  };
  
  const handleToggleHolidays = () => {
    dispatch(toggleDisplay('showHolidays'));
    if (!showHolidays) {
      discover('enabledHolidays');
      trackDisplay('showHolidays', true);
    }
  };
  
  return (
    <div className="month-header">
      <div className="month-header__controls">
        {/* === LEFT COLUMN: Calendar Controls === */}
        <div className="month-header__column month-header__column--controls">
          {/* Row 1: Month Navigation + Print */}
          <div className="month-header__row">
            <button
              className="btn btn--icon month-nav-prev"
              onClick={() => {
                dispatch(prevMonth());
                discover('usedMonthNavigator');
                discover('viewedDifferentMonth');
                trackMonthNavigation(dispatch, viewDate.year, viewDate.month);
                tutorialService.trackMonthNavigation('prev');
              }}
              aria-label="Previous month"
              title="Previous month"
            >
              ←
            </button>
            
            <button
              className="btn btn-today"
              onClick={() => {
                dispatch(navigateToToday());
                discover('usedTodayButton');
                tutorialService.trackTodayButton();
              }}
              title="Go to today"
            >
              Today
            </button>
            
            <button
              className="btn btn--icon month-nav-next"
              onClick={() => {
                dispatch(nextMonth());
                discover('usedMonthNavigator');
                discover('viewedDifferentMonth');
                trackMonthNavigation(dispatch, viewDate.year, viewDate.month);
                tutorialService.trackMonthNavigation('next');
              }}
              aria-label="Next month"
              title="Next month"
            >
              →
            </button>
            
            <button
              className="btn btn--primary"
              onClick={() => {
                discover('printedCalendar');
                onPrintClick();
              }}
              title="Print calendar"
            >
              🖨️ Print
            </button>
          </div>
          
          {/* Row 2: Expand + Year + Search */}
          <div className="month-header__row">
            <button
              className={`btn btn--icon expand-btn-horizontal ${isCalendarExpandedHorizontal ? 'btn--active' : ''}`}
              onClick={() => {
                onToggleExpandHorizontal?.();
                tutorialService.trackCalendarExpand('horizontal');
              }}
              title={isCalendarExpandedHorizontal ? 'Shrink horizontally' : 'Expand horizontally'}
              aria-label={isCalendarExpandedHorizontal ? 'Shrink horizontally' : 'Expand horizontally'}
            >
              {isCalendarExpandedHorizontal ? '⤡' : '⤢'}
            </button>
            
            <button
              className="btn btn-year"
              onClick={() => {
                discover('usedYearNavigator');
                onYearClick();
                tutorialService.trackYearView();
              }}
              title="View entire year"
            >
              Year
            </button>
            
            <button
              className={`btn btn--icon expand-btn-vertical ${isCalendarExpanded ? 'btn--active' : ''}`}
              onClick={() => {
                onToggleExpand?.();
                tutorialService.trackCalendarExpand('vertical');
              }}
              title={isCalendarExpanded ? 'Shrink vertically' : 'Expand vertically'}
              aria-label={isCalendarExpanded ? 'Shrink vertically' : 'Expand vertically'}
            >
              {isCalendarExpanded ? '⤓' : '⤢'}
            </button>
            
            <button
              className="btn"
              onClick={() => {
                discover('usedMonthNavigator');
                onSearchClick();
              }}
              title="Search dates"
            >
              🔍 Search
            </button>
          </div>
        </div>
        
        {/* === DIVIDER === */}
        <div className="month-header__divider" />
        
        {/* === RIGHT COLUMN: Extra Features === */}
        <div className="month-header__column month-header__column--features">
          {/* Row 1: Stars + Circle + Journal */}
          <div className="month-header__row">
            <button
              className="btn"
              onClick={() => {
                discover('openedProfileManager');
                onAstrologyClick();
              }}
              title="Astrology Hub"
            >
              ✨ Stars
            </button>
            
            <button
              className="btn"
              onClick={() => {
                discover('openedFriends');
                onFriendsClick();
              }}
              title="Cosmic Circle"
              style={{ background: 'rgba(167, 139, 250, 0.15)', borderColor: 'rgba(167, 139, 250, 0.4)' }}
            >
              ⭕ Circle
            </button>
            
            <button
              className="btn btn-journal"
              onClick={() => {
                discover('openedOracleJournal');
                onJournalClick();
                tutorialService.trackJournal();
              }}
              title="Oracle Journal"
              style={{ background: 'rgba(202, 162, 74, 0.2)', borderColor: 'rgba(202, 162, 74, 0.4)' }}
            >
              📓 Journal
            </button>
          </div>
          
          {/* Row 2: About + Stats + Community */}
          <div className="month-header__row">
            <button
              className="btn"
              onClick={() => {
                onInfoClick();
              }}
              title="About HEKA Calendar"
            >
              ℹ️ About
            </button>
            
            <button
              className="btn"
              onClick={() => {
                onStatsClick();
              }}
              title="Your statistics"
            >
              📊 Stats
            </button>
            
            <button
              className="btn"
              onClick={() => {
                discover('viewedCommunityHolidays');
                onCommunityClick();
              }}
              title="Community holidays"
            >
              🌍 Community
            </button>
          </div>
        </div>
      </div>
      
      {/* === DISPLAY TOGGLES - Centered below divider === */}
      <div className="month-header__display-toggles">
        <button 
          className={`btn ${showCivilDates ? 'btn--active' : ''}`}
          onClick={handleToggleCivil}
          title="Toggle civil dates"
          data-toggle="civil"
        >
          {showCivilDates ? '✓ ' : ''}📅 Civil
        </button>
        <button 
          className={`btn ${showMoonPhases ? 'btn--active' : ''}`}
          onClick={handleToggleMoon}
          title="Toggle moon phases"
          data-toggle="moon"
        >
          {showMoonPhases ? '✓ ' : ''}🌙 Moon
        </button>
        <button 
          className={`btn ${showHolidays ? 'btn--active' : ''}`}
          onClick={handleToggleHolidays}
          title="Toggle holidays"
          data-toggle="holidays"
        >
          {showHolidays ? '✓ ' : ''}🎉 Holidays
        </button>
      </div>
    </div>
  );
};

export default MonthHeader;
