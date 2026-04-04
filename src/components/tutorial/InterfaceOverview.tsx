/**
 * Interface Overview Visual
 * Shows the HEKA calendar interface with labels
 */
import React from 'react';
import './elite-visuals.css';

export const InterfaceOverview: React.FC = () => {
  return (
    <div className="elite-visual interface-overview">
      {/* Animated Calendar Mockup */}
      <div className="calendar-mockup">
        {/* Header with navigation */}
        <div className="mockup-header">
          <div className="mockup-nav-arrows">
            <span>◀</span>
            <span>▶</span>
          </div>
          <div className="mockup-month-year">APRIL 2026</div>
          <div className="mockup-header-btns">
            <span className="mockup-btn">Today</span>
            <span className="mockup-btn">Year</span>
          </div>
        </div>
        
        {/* Weekday Headers */}
        <div className="mockup-weekdays">
          {['SUN','MON','TUE','WED','THU','FRI','SAT'].map((day, i) => (
            <div key={day} className={`mockup-weekday ${i >= 5 ? 'arc-day' : ''}`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="mockup-grid">
          {Array.from({ length: 28 }).map((_, i) => (
            <div 
              key={i} 
              className={`mockup-cell ${i % 7 >= 5 ? 'arc-weekend' : ''} ${i === 14 ? 'has-note' : ''} ${i === 7 ? 'today' : ''}`}
            >
              {i + 1}
              {i === 14 && <div className="note-indicator" />}
            </div>
          ))}
        </div>
        
        {/* Bottom toolbar */}
        <div className="mockup-toolbar">
          <span className="toolbar-btn">⚙️ Settings</span>
          <span className="toolbar-btn">📓 Journal</span>
          <span className="toolbar-btn">✨ Stars</span>
        </div>
      </div>
      
      {/* Feature Labels */}
      <div className="feature-labels">
        <div className="feature-label" style={{ top: '10%', left: '5%' }}>
          <span className="label-dot" />
          <span className="label-text">13 Months</span>
        </div>
        <div className="feature-label" style={{ top: '10%', right: '5%' }}>
          <span className="label-dot" />
          <span className="label-text">28 Days Each</span>
        </div>
        <div className="feature-label" style={{ bottom: '25%', left: '5%' }}>
          <span className="label-dot" />
          <span className="label-text">Arc Weekends</span>
        </div>
        <div className="feature-label" style={{ bottom: '25%', right: '5%' }}>
          <span className="label-dot" />
          <span className="label-text">Day Notes</span>
        </div>
      </div>
    </div>
  );
};
