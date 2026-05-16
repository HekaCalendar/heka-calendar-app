/**
 * Day Panel Component - REFACTORED
 * Shows details for the selected day with unified notes + tasks support
 *
 * Refactoring:
 * - Extracted sub-components for each section
 * - Extracted custom hook for state management
 * - Preserved all functionality
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { tutorialService } from '../../services/tutorialService';
import { isAfterVotingTime, isToday } from '../../services/energyVoteService';
import { EnergyVoteCard } from '../EnergyVoteCard';
import { useDayPanel } from './useDayPanel';
import { DayPanelHeader } from './DayPanelHeader';
import { MoonPhaseSection } from './MoonPhaseSection';
import { HolidaysSection } from './HolidaysSection';
import { AstrologySection } from './AstrologySection';
import { LunarMansionSection } from './LunarMansionSection';
import { SolarReturnSection } from './SolarReturnSection';
import { NotesSection } from './NotesSection';

export const DayPanelComponent: React.FC = () => {
  const { t } = useTranslation('dayPanel');
  const {
    selectedDate,
    display,
    locationData,
    monthInfo,
    yearLabel,
    civilDate,
    hemisphere,
    swissMoonData,
    moonLoading,
    dailyAstrology,
    astrologyLoading,
    hasBirthChart,
    birthChartName,
    personalTransits,
    sunriseTime,
    sunsetTime,
    currentPlanetaryHour,
    holidays,
    noteKey,
    dayItems,
    astroPreferences,
    currentMansion,
    mansionLoading,
    solarReturnInfo,
    noteText,
    selectedCategory,
    selectedMood,
    isEditing,
    setNoteText,
    setSelectedCategory,
    setSelectedMood,
    setIsEditing,
    handleStartTaskEditing,
    isTaskMode,
    dueTime,
    reminderMinutesBefore,
    setIsTaskMode,
    setDueTime,
    setReminderMinutesBefore,
    isSelectionMode,
    selectedNotesMap,
    selectedDayCount,
    isMultiDaySelection,
    hasAnyDuplicates,
    showDuplicateOptions,
    showDayPicker,
    showMultiDayPicker,
    setShowDuplicateOptions,
    setShowDayPicker,
    setShowMultiDayPicker,
    handleSaveNote,
    handleDeleteNote,
    handleToggleTaskComplete,
    handleEditTask,
    handleEnterSelectionMode,
    handleToggleNoteSelection,
    handleExitSelectionMode,
    handleSelectAll,
    handleDuplicateToNextWeek,
    handleDuplicateToNextMonth,
    handleDuplicateToEveryDayOfWeek,
    handleUndoDuplicates,
    handleDuplicateToSpecificDay,
    handleDuplicateToSpecificDays,
    handleCancelEdit,
    selectDate,
  } = useDayPanel();

  if (!selectedDate || !monthInfo) {
    return (
      <div className="day-panel">
        <div className="day-panel__empty">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <p>{t('emptyState')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="day-panel">
      {/* Header */}
      <DayPanelHeader
        selectedDate={selectedDate}
        monthName={monthInfo.name}
        yearLabel={yearLabel}
        civilDate={civilDate}
        timezone={locationData.timezone}
        showCivil={display.showCivilDates}
        onClose={() => selectDate(null)}
        onAddTask={handleStartTaskEditing}
      />

      {/* Moon Phase Section - Swiss Ephemeris Precision */}
      {display.showMoonPhases && (
        <MoonPhaseSection
          moonData={swissMoonData}
          isLoading={moonLoading}
          hemisphere={hemisphere}
        />
      )}

      {/* Holidays Section */}
      {display.showHolidays && holidays.length > 0 && (
        <HolidaysSection
          holidays={holidays}
          locationName={locationData.name}
        />
      )}

      {/* True Solar Return Section — TRUE mode only */}
      {solarReturnInfo.isSolarReturn && (
        <SolarReturnSection
          isToday={solarReturnInfo.isSolarReturn}
          isApproaching={solarReturnInfo.isApproaching}
          daysUntil={solarReturnInfo.daysUntil}
          exactDate={solarReturnInfo.exactDate}
          orb={solarReturnInfo.orb}
          birthSign={solarReturnInfo.birthSign}
        />
      )}

      {/* Lunar Mansion Section — TRUE mode only */}
      {astroPreferences.showNakshatras && (
        <LunarMansionSection
          mansion={currentMansion ? {
            moonMansion: currentMansion.moonMansion,
            moonQuarter: currentMansion.moonQuarter,
            sunMansion: currentMansion.sunMansion,
          } : null}
          isLoading={mansionLoading}
        />
      )}

      {/* Daily Astrology Section */}
      {astroPreferences.showTransitsOnCalendar && (
        <AstrologySection
          isLoading={astrologyLoading}
          hasBirthChart={hasBirthChart}
          birthChartName={birthChartName}
          dailyAstrology={dailyAstrology}
          personalTransits={personalTransits}
          sunriseTime={sunriseTime}
          sunsetTime={sunsetTime}
          currentPlanetaryHour={currentPlanetaryHour}
          locationName={locationData.name}
        />
      )}

      {/* Community Energy Vote */}
      {civilDate && (isToday(civilDate) && isAfterVotingTime() || civilDate < new Date(new Date().setHours(0, 0, 0, 0))) && (
        <div className="day-panel__section energy-vote-section">
          <EnergyVoteCard date={civilDate} />
        </div>
      )}

      {/* Notes Section */}
      <NotesSection
        dayItems={dayItems}
        noteKey={noteKey}
        isEditing={isEditing}
        isSelectionMode={isSelectionMode}
        selectedNotesMap={selectedNotesMap}
        selectedDayCount={selectedDayCount}
        hasAnyDuplicates={hasAnyDuplicates}
        isMultiDaySelection={isMultiDaySelection}
        showDuplicateOptions={showDuplicateOptions}
        showDayPicker={showDayPicker}
        showMultiDayPicker={showMultiDayPicker}
        viewDate={{ year: selectedDate.year, month: selectedDate.month }}
        selectedCategory={selectedCategory}
        selectedMood={selectedMood}
        noteText={noteText}
        isTaskMode={isTaskMode}
        dueTime={dueTime}
        reminderMinutesBefore={reminderMinutesBefore}
        onStartEditing={() => {
          tutorialService.trackNoteEditorOpened();
          setIsEditing(true);
        }}
        onStartTaskEditing={handleStartTaskEditing}
        onSaveNote={handleSaveNote}
        onCancelEdit={handleCancelEdit}
        onDeleteNote={handleDeleteNote}
        onEnterSelectionMode={handleEnterSelectionMode}
        onToggleNoteSelection={handleToggleNoteSelection}
        onExitSelectionMode={handleExitSelectionMode}
        onSelectAll={handleSelectAll}
        onSetShowDuplicateOptions={setShowDuplicateOptions}
        onSetShowDayPicker={setShowDayPicker}
        onSetShowMultiDayPicker={setShowMultiDayPicker}
        onSetSelectedCategory={setSelectedCategory}
        onSetSelectedMood={setSelectedMood}
        onSetNoteText={setNoteText}
        onSetIsTaskMode={setIsTaskMode}
        onSetDueTime={setDueTime}
        onSetReminderMinutesBefore={setReminderMinutesBefore}
        onToggleTaskComplete={handleToggleTaskComplete}
        onEditTask={handleEditTask}
        onDuplicateToNextWeek={handleDuplicateToNextWeek}
        onDuplicateToNextMonth={handleDuplicateToNextMonth}
        onDuplicateToEveryDayOfWeek={handleDuplicateToEveryDayOfWeek}
        onUndoDuplicates={handleUndoDuplicates}
        onDuplicateToSpecificDay={handleDuplicateToSpecificDay}
        onDuplicateToSpecificDays={handleDuplicateToSpecificDays}
      />
    </div>
  );
};

// Export memoized version
export const DayPanel = memo(DayPanelComponent);
DayPanel.displayName = 'DayPanel';

export default DayPanel;
