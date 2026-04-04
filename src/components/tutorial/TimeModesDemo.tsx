/**
 * Time Modes Demo - SYNC vs TRUE side-by-side comparison
 */
import React, { useState } from 'react';
import './time-modes-demo.css';

export const TimeModesDemo: React.FC = () => {
  const [mode, setMode] = useState<'SYNC' | 'TRUE'>('SYNC');

  const hekaMonths = ['April', 'May', 'June', 'July', 'August', 'Hexa', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
  const currentMonthIndex = 3; // July
  const currentDay = 15;
  
  const civilDate = mode === 'SYNC' ? 'July 15, 2026' : 'July 15, 2026';
  const hekaDate = mode === 'SYNC' 
    ? `Month ${currentMonthIndex + 1}, Day ${currentDay}`
    : `Month ${currentMonthIndex + 1}, Day ${currentDay} • Year 1`;

  return (
    <div className="tmd-visual">
      {/* Mode Toggle */}
      <div className="tmd-toggle">
        <button 
          className={`tmd-toggle-btn ${mode === 'SYNC' ? 'active' : ''}`}
          onClick={() => setMode('SYNC')}
        >
          SYNC Mode
        </button>
        <button 
          className={`tmd-toggle-btn ${mode === 'TRUE' ? 'active' : ''}`}
          onClick={() => setMode('TRUE')}
        >
          TRUE Mode
        </button>
      </div>

      {/* Main Display */}
      <div className="tmd-display">
        {/* Left: Calendar View */}
        <div className="tmd-calendar-section">
          <div className="tmd-month-header">
            <span className="tmd-month-name">{hekaMonths[currentMonthIndex]}</span>
            <span className="tmd-month-meta">Month {currentMonthIndex + 1} of 13</span>
          </div>
          
          <div className="tmd-weekdays">
            {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
              <span key={d} className="tmd-weekday">{d}</span>
            ))}
          </div>
          
          <div className="tmd-days">
            {Array.from({ length: 28 }, (_, i) => (
              <div 
                key={i} 
                className={`tmd-day ${i + 1 === currentDay ? 'active' : ''} ${i < 2 ? 'weekend' : ''}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="tmd-info-section">
          <div className="tmd-date-display">
            <div className="tmd-date-row">
              <span className="tmd-label">HEKA Date</span>
              <span className="tmd-value">{hekaDate}</span>
            </div>
            <div className="tmd-date-row">
              <span className="tmd-label">Civil Date</span>
              <span className="tmd-value civil">{civilDate}</span>
            </div>
          </div>

          <div className="tmd-features">
            <div className="tmd-feature">
              <span className="tmd-check">✓</span>
              <span>{mode === 'SYNC' ? 'Gregorian meetings align' : 'Pure 28-day rhythm'}</span>
            </div>
            <div className="tmd-feature">
              <span className="tmd-check">✓</span>
              <span>{mode === 'SYNC' ? 'Deadlines map perfectly' : 'Astronomical precision'}</span>
            </div>
            <div className="tmd-feature">
              <span className="tmd-check">✓</span>
              <span>{mode === 'SYNC' ? 'Dual calendar visible' : 'Natural time flow'}</span>
            </div>
          </div>

          <div className="tmd-use-case">
            <span className="tmd-use-label">Best for:</span>
            <span className="tmd-use-value">
              {mode === 'SYNC' 
                ? 'Transition & daily coordination' 
                : 'Deep work & cosmic alignment'}
            </span>
          </div>
        </div>
      </div>

      {/* Example Scenario */}
      <div className="tmd-scenario">
        <span className="tmd-scenario-label">Example:</span>
        <span className="tmd-scenario-text">
          {mode === 'SYNC'
            ? '"Team meeting Monday 2pm" appears on both calendars seamlessly'
            : '"Month 4, Day 15" - your personal rhythm, independent of civil time'}
        </span>
      </div>
    </div>
  );
};

export default TimeModesDemo;
