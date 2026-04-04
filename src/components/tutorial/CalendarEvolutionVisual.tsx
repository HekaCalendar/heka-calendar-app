/**
 * Calendar Evolution Visual - Timeline
 * Shows historical shift from March to January
 */
import React from 'react';
import './calendar-evolution-visual.css';

export const CalendarEvolutionVisual: React.FC = () => {
  return (
    <div className="cev-visual">
      {/* Timeline */}
      <div className="cev-timeline">
        {/* Ancient Rome */}
        <div className="cev-era">
          <div className="cev-date">Ancient Rome</div>
          <div className="cev-card">
            <span className="cev-icon">⚔️</span>
            <span className="cev-title">Martius</span>
            <span className="cev-subtitle">March = Month 1</span>
            <div className="cev-numbers">
              <span>SEPT = 7</span>
              <span>OCT = 8</span>
              <span>NOV = 9</span>
              <span>DEC = 10</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="cev-arrow">→</div>

        {/* 1564 Shift */}
        <div className="cev-era">
          <div className="cev-date">1564 CE</div>
          <div className="cev-card shift">
            <span className="cev-icon">📜</span>
            <span className="cev-title">Calendar Reform</span>
            <span className="cev-subtitle">Jan + Feb added</span>
            <div className="cev-shift-detail">
              <span>New Year moved to January</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="cev-arrow">→</div>

        {/* Today */}
        <div className="cev-era">
          <div className="cev-date">Today</div>
          <div className="cev-card dual">
            <span className="cev-icon">⚖️</span>
            <span className="cev-title">Dual Systems</span>
            <div className="cev-dual-options">
              <span className="cev-civil">Civil: January</span>
              <span className="cev-natural">Natural: April</span>
            </div>
          </div>
        </div>
      </div>

      {/* April Fools Note */}
      <div className="cev-fools">
        <span className="cev-fools-icon">🃏</span>
        <span className="cev-fools-text">April Fools honors those who kept spring celebrations</span>
      </div>
    </div>
  );
};

export default CalendarEvolutionVisual;
