/**
 * Journal V2 - ACCURATE
 */
import React from 'react';
import './elite-visuals.css';

export const JournalV2: React.FC = () => {
  return (
    <div className="elite-visual journal-v2">
      <div className="v2-journal-container">
        <div className="v2-journal-header">
          <div className="v2-journal-icon">📓</div>
          <h3 className="v2-journal-title">Journal Sanctuary</h3>
          <p className="v2-journal-subtitle">Private. Sacred. Yours.</p>
        </div>
        
        <div className="v2-journal-preview">
          <div className="v2-journal-page">
            <div className="v2-page-header">
              <span>April 15, 2026</span>
              <span>😊</span>
            </div>
            <div className="v2-page-lines">
              <div className="v2-page-line" />
              <div className="v2-page-line short" />
              <div className="v2-page-line" />
              <div className="v2-page-line medium" />
            </div>
          </div>
        </div>
        
        <div className="v2-journal-features">
          <div className="v2-journal-item">
            <span>🔒</span> 100% Private — No cloud sync
          </div>
          <div className="v2-journal-item">
            <span>😊</span> Mood tracking
          </div>
          <div className="v2-journal-item">
            <span>🌙</span> Lunar cycle reflections
          </div>
          <div className="v2-journal-item">
            <span>📊</span> Monthly insights
          </div>
        </div>
      </div>
    </div>
  );
};
