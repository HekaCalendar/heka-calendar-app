/**
 * Interface Overview V2 - ACCURATE
 * Matches actual HEKA calendar interface
 */
import React from 'react';
import './elite-visuals.css';

export const InterfaceOverviewV2: React.FC = () => {
  return (
    <div className="elite-visual interface-overview-v2">
      {/* Header Mockup - Matches actual MonthHeader */}
      <div className="v2-header-mockup">
        <div className="v2-header-main">
          <span className="v2-month-name">APRIL</span>
          <span className="v2-month-index">Month 4/13</span>
          <span className="v2-year">2026</span>
        </div>
        <div className="v2-arc-badge" data-arc="OPENING">
          OPENING Arc
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="v2-nav-controls">
        <div className="v2-nav-row">
          <button className="v2-nav-btn">←</button>
          <button className="v2-today-btn">Today</button>
          <button className="v2-nav-btn">→</button>
        </div>
        <div className="v2-tool-row">
          <button className="v2-tool-btn">🔍</button>
          <button className="v2-tool-btn">ℹ️</button>
          <button className="v2-tool-btn">Year</button>
        </div>
      </div>
      
      {/* Calendar Grid Mockup */}
      <div className="v2-calendar-mockup">
        {/* Weekday Headers */}
        <div className="v2-weekdays">
          {['SUN','MON','TUE','WED','THU','FRI','SAT'].map((day, i) => (
            <div key={day} className={`v2-weekday ${i >= 5 ? 'arc-weekend' : ''}`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Day Grid */}
        <div className="v2-day-grid">
          {Array.from({ length: 28 }).map((_, i) => {
            const day = i + 1;
            const isWeekend = i % 7 >= 5;
            const isToday = day === 15;
            const hasNote = day === 8;
            const hasMoon = day === 20;
            
            return (
              <div 
                key={i} 
                className={`v2-day-cell ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}
              >
                <span className="v2-day-number">{day}</span>
                {hasNote && <div className="v2-note-dot" />}
                {hasMoon && <span className="v2-moon-icon">🌙</span>}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Settings Toggle */}
      <div className="v2-settings-bar">
        <span className="v2-settings-btn">⚙️ Show Settings</span>
      </div>
      
      {/* Feature Labels */}
      <div className="v2-features">
        <div className="v2-feature-item">
          <span className="v2-feature-dot opening" />
          <span className="v2-feature-text">Opening Arc (Red)</span>
        </div>
        <div className="v2-feature-item">
          <span className="v2-feature-dot core" />
          <span className="v2-feature-text">Core Arc (Green)</span>
        </div>
        <div className="v2-feature-item">
          <span className="v2-feature-dot closing" />
          <span className="v2-feature-text">Closing Arc (Purple)</span>
        </div>
      </div>
    </div>
  );
};
