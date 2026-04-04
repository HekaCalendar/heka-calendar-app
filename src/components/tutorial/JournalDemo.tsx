/**
 * Journal Demo
 * Shows the private journal sanctuary
 */
import React from 'react';
import './elite-visuals.css';

export const JournalDemo: React.FC = () => {
  return (
    <div className="elite-visual journal-demo">
      <div className="journal-container">
        <div className="journal-header">
          <div className="journal-icon">📓</div>
          <div className="journal-title">Journal Sanctuary</div>
          <div className="journal-subtitle">Private. Sacred. Yours.</div>
        </div>
        
        <div className="journal-preview">
          <div className="journal-page">
            <div className="page-header">
              <span className="page-date">April 15, 2026</span>
              <span className="page-mood">😊</span>
            </div>
            <div className="page-content">
              <div className="page-line" />
              <div className="page-line short" />
              <div className="page-line" />
              <div className="page-line medium" />
              <div className="page-line" />
            </div>
          </div>
        </div>
        
        <div className="journal-features">
          <div className="journal-feature">
            <span className="journal-check">🔒</span>
            <span>100% Private - No cloud sync</span>
          </div>
          <div className="journal-feature">
            <span className="journal-check">😊</span>
            <span>Mood tracking</span>
          </div>
          <div className="journal-feature">
            <span className="journal-check">🌙</span>
            <span>Lunar cycle reflections</span>
          </div>
          <div className="journal-feature">
            <span className="journal-check">📊</span>
            <span>Monthly insights</span>
          </div>
        </div>
      </div>
    </div>
  );
};
