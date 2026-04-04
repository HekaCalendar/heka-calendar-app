/**
 * Day Panel V2 - ACCURATE
 * Shows actual day panel features
 */
import React from 'react';
import './elite-visuals.css';

export const DayPanelV2: React.FC = () => {
  return (
    <div className="elite-visual day-panel-v2">
      {/* Day Panel Mockup - Matches actual */}
      <div className="v2-panel-mockup">
        {/* Panel Header */}
        <div className="v2-panel-header">
          <div className="v2-panel-date">
            <div className="v2-panel-day">15</div>
            <div className="v2-panel-month">APRIL</div>
          </div>
          <div className="v2-panel-civil">Civil: April 15, 2026</div>
          <button className="v2-panel-close">×</button>
        </div>
        
        {/* Moon Phase Section */}
        <div className="v2-panel-section">
          <div className="v2-moon-header">
            <span className="v2-moon-icon">🌔</span>
            <div className="v2-moon-info">
              <div className="v2-moon-phase">Waxing Gibbous</div>
              <div className="v2-moon-percent">78% Illuminated</div>
            </div>
          </div>
        </div>
        
        {/* Daily Astrology */}
        <div className="v2-panel-section">
          <div className="v2-astro-title">✦ Daily Astrology</div>
          <div className="v2-astro-grid">
            <div className="v2-astro-item">
              <span className="v2-astro-symbol">☉</span>
              <span className="v2-astro-body">Sun</span>
              <span className="v2-astro-position">Aries 25°</span>
            </div>
            <div className="v2-astro-item">
              <span className="v2-astro-symbol">☽</span>
              <span className="v2-astro-body">Moon</span>
              <span className="v2-astro-position">Libra 12°</span>
            </div>
          </div>
        </div>
        
        {/* Notes Section */}
        <div className="v2-panel-section">
          <div className="v2-notes-header">
            <span>Notes (1)</span>
            <button className="v2-add-note-btn">+ Add Note</button>
          </div>
          <div className="v2-note-item">
            <div className="v2-note-dot" style={{ background: '#3b82f6' }} />
            <div className="v2-note-content">
              <div className="v2-note-text">Team meeting preparation</div>
              <div className="v2-note-category">Work</div>
            </div>
          </div>
        </div>
        
        {/* Holiday Indicator */}
        <div className="v2-panel-section v2-holiday-section">
          <span className="v2-holiday-icon">🎉</span>
          <span className="v2-holiday-name">Spring Festival</span>
        </div>
      </div>
      
      {/* Features List */}
      <div className="v2-panel-features">
        <div className="v2-feature-tag">
          <span>📝</span> Personal Notes
        </div>
        <div className="v2-feature-tag">
          <span>🌙</span> Moon Phases
        </div>
        <div className="v2-feature-tag">
          <span>✨</span> Daily Astrology
        </div>
        <div className="v2-feature-tag">
          <span>🎉</span> Holidays
        </div>
      </div>
    </div>
  );
};
