/**
 * Day Panel Demo Visual
 * Shows the day panel with notes and features
 */
import React from 'react';
import './elite-visuals.css';

export const DayPanelDemo: React.FC = () => {
  return (
    <div className="elite-visual day-panel-demo">
      {/* Day Panel Mockup */}
      <div className="day-panel-mockup">
        {/* Panel Header */}
        <div className="panel-header">
          <div className="panel-date">
            <div className="panel-day-number">15</div>
            <div className="panel-month">APRIL</div>
          </div>
          <div className="panel-civil-date">Civil: April 15, 2026</div>
          <button className="panel-close">×</button>
        </div>
        
        {/* Moon Phase Section */}
        <div className="panel-section moon-section">
          <div className="moon-icon">🌙</div>
          <div className="moon-info">
            <div className="moon-phase">Waxing Gibbous</div>
            <div className="moon-illumination">78% Illuminated</div>
          </div>
        </div>
        
        {/* Astrology Section */}
        <div className="panel-section astro-section">
          <div className="astro-header">✨ Daily Astrology</div>
          <div className="astro-content">
            <div className="planet-row">
              <span className="planet">☉ Sun</span>
              <span className="sign">Aries 25°</span>
            </div>
            <div className="planet-row">
              <span className="planet">☽ Moon</span>
              <span className="sign">Libra 12°</span>
            </div>
          </div>
        </div>
        
        {/* Notes Section */}
        <div className="panel-section notes-section">
          <div className="notes-header">
            <span>Notes (1)</span>
            <button className="add-note-btn">+ Add Note</button>
          </div>
          <div className="note-item">
            <div className="note-category-dot" style={{ background: '#3b82f6' }} />
            <div className="note-content">
              <div className="note-text">Important meeting today</div>
              <div className="note-time">9:00 AM</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Callouts */}
      <div className="panel-features">
        <div className="panel-feature">
          <span className="feature-icon">📝</span>
          <span className="feature-text">Personal Notes</span>
        </div>
        <div className="panel-feature">
          <span className="feature-icon">🌙</span>
          <span className="feature-text">Moon Phases</span>
        </div>
        <div className="panel-feature">
          <span className="feature-icon">✨</span>
          <span className="feature-text">Daily Astrology</span>
        </div>
        <div className="panel-feature">
          <span className="feature-icon">📊</span>
          <span className="feature-text">Energy Ratings</span>
        </div>
      </div>
    </div>
  );
};
