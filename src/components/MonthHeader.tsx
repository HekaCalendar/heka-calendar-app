/**
 * Month Header Component
 * Month navigation and primary actions
 */

import { useSelector, useDispatch } from 'react-redux';
import { memo } from 'react';
import type { RootState } from '../store';
import { prevMonth, nextMonth, navigateToToday, toggleDisplay, setView } from '../store';

import { useFeatureDiscovery, useSettingsTracking } from '../hooks/useGamification';
import { trackMonthNavigation } from '../services/engagementService';
import { tutorialService } from '../services/tutorialService';
import { useTranslation } from 'react-i18next';

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

export const MonthHeader: React.FC<MonthHeaderProps> = memo(({ 
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
  const { t, i18n } = useTranslation('calendar');
  const isEnglish = i18n.language === 'en';
  
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
    <div className={`month-header ${!isEnglish ? 'month-header--compact' : ''}`}>
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
              aria-label={t('navigation.previousMonth')}
              title={t('navigation.previousMonth')}
            >
              ←
            </button>
            
            <button
              className="btn btn-today"
              onClick={() => {
                dispatch(navigateToToday());
                dispatch(setView('month'));
                discover('usedTodayButton');
                tutorialService.trackTodayButton();
              }}
              title={t('navigation.goToToday')}
            >
              {t('navigation.today')}
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
              aria-label={t('navigation.nextMonth')}
              title={t('navigation.nextMonth')}
            >
              →
            </button>
            
            <button
              className="btn btn--primary"
              onClick={() => {
                discover('printedCalendar');
                onPrintClick();
              }}
              title={t('print.title')}
            >
              <span className="pill-emoji">🖨️</span>
              {isEnglish && <span className="pill-text"> {t('print.label')}</span>}
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
              title={isCalendarExpandedHorizontal ? t('expand.shrinkHorizontal') : t('expand.expandHorizontal')}
              aria-label={isCalendarExpandedHorizontal ? t('expand.shrinkHorizontal') : t('expand.expandHorizontal')}
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
              title={t('year.viewEntireYear')}
            >
              {t('year.label')}
            </button>
            
            <button
              className={`btn btn--icon expand-btn-vertical ${isCalendarExpanded ? 'btn--active' : ''}`}
              onClick={() => {
                onToggleExpand?.();
                tutorialService.trackCalendarExpand('vertical');
              }}
              title={isCalendarExpanded ? t('expand.shrinkVertical') : t('expand.expandVertical')}
              aria-label={isCalendarExpanded ? t('expand.shrinkVertical') : t('expand.expandVertical')}
            >
              {isCalendarExpanded ? '⤓' : '⤢'}
            </button>
            
            <button
              className="btn"
              onClick={() => {
                discover('usedMonthNavigator');
                onSearchClick();
              }}
              title={t('search.title')}
            >
              <span className="pill-emoji">🔍</span>
              {isEnglish && <span className="pill-text"> {t('search.label')}</span>}
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
              title={t('features.astrologyHub')}
            >
              <span className="pill-emoji">✨</span>
              {isEnglish && <span className="pill-text"> {t('features.stars')}</span>}
            </button>
            
            <button
              className="btn"
              onClick={() => {
                discover('openedFriends');
                onFriendsClick();
              }}
              title={t('features.cosmicCircle')}
              style={{ background: 'rgba(167, 139, 250, 0.15)', borderColor: 'rgba(167, 139, 250, 0.4)' }}
            >
              <span className="pill-emoji">⭕</span>
              {isEnglish && <span className="pill-text"> {t('features.circle')}</span>}
            </button>
            
            <button
              className="btn btn-journal"
              onClick={() => {
                discover('openedOracleJournal');
                onJournalClick();
                tutorialService.trackJournal();
              }}
              title={t('features.oracleJournal')}
              style={{ background: 'rgba(202, 162, 74, 0.2)', borderColor: 'rgba(202, 162, 74, 0.4)' }}
            >
              <span className="pill-emoji">📓</span>
              {isEnglish && <span className="pill-text"> {t('features.journal')}</span>}
            </button>
          </div>
          
          {/* Row 2: About + Stats + Community */}
          <div className="month-header__row">
            <button
              className="btn"
              onClick={() => {
                onInfoClick();
              }}
              title={t('features.aboutHeka')}
            >
              <span className="pill-emoji">ℹ️</span>
              {isEnglish && <span className="pill-text"> {t('features.about')}</span>}
            </button>

            <button
              className="btn"
              onClick={() => {
                onStatsClick();
              }}
              title={t('features.yourStatistics')}
            >
              <span className="pill-emoji">📊</span>
              {isEnglish && <span className="pill-text"> {t('features.stats')}</span>}
            </button>

            <button
              className="btn btn--vote"
              onClick={() => {
                discover('viewedCommunityHolidays');
                onCommunityClick();
              }}
              title={t('features.voteOnHolidays')}
            >
              <span className="pill-emoji vote-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="13" rx="2"/>
                  <path d="M12 3v5"/>
                  <path d="M8 8l4-4 4 4"/>
                </svg>
              </span>
              {isEnglish && <span className="pill-text">Vote</span>}
              <span className="vote-pulse" aria-hidden="true" />
            </button>

          </div>


        </div>
      </div>
      
      <div className="month-header__display-toggles">
        <button 
          className={`btn ${showCivilDates ? 'btn--active' : ''}`}
          onClick={handleToggleCivil}
          title={t('toggles.civilDates')}
          data-toggle="civil"
        >
          {showCivilDates ? '✓ ' : ''}📅 {t('toggles.civil')}
        </button>
        <button 
          className={`btn ${showMoonPhases ? 'btn--active' : ''}`}
          onClick={handleToggleMoon}
          title={t('toggles.moonPhases')}
          data-toggle="moon"
        >
          {showMoonPhases ? '✓ ' : ''}🌙 {t('toggles.moon')}
        </button>
        <button 
          className={`btn ${showHolidays ? 'btn--active' : ''}`}
          onClick={handleToggleHolidays}
          title={t('toggles.holidays')}
          data-toggle="holidays"
        >
          {showHolidays ? '✓ ' : ''}🎉 {t('toggles.holidayLabel')}
        </button>
      </div>

    </div>
  );
});

MonthHeader.displayName = 'MonthHeader';

export default MonthHeader;
