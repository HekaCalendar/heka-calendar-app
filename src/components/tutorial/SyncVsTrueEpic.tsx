/**
 * SYNC vs TRUE - EPIC Mathematics Visual
 * Explains solar accuracy, deviation, and long-term precision
 */
import React, { useState } from 'react';
import './sync-vs-true-epic.css';

export const SyncVsTrueEpic: React.FC = () => {
  const [year, setYear] = useState(1);
  const maxYears = 400;
  
  // Calculate drift - TRUE mode slowly deviates but stays more accurate to solar year
  const trueDrift = (year * 0.0003); // Tiny drift per year
  
  return (
    <div className="svte-visual">
      {/* Header */}
      <div className="svte-header">
        <span className="svte-subtitle">Solar Calendar Mathematics</span>
      </div>

      {/* Mode Comparison */}
      <div className="svte-modes">
        {/* SYNC Mode */}
        <div className="svte-mode sync">
          <div className="svte-mode-header">
            <span className="svte-icon">🔄</span>
            <span className="svte-title">SYNC Mode</span>
          </div>
          
          <div className="svte-details">
            <div className="svte-detail">
              <span className="svte-label">Re-aligns</span>
              <span className="svte-value">Every April 1st</span>
            </div>
            <div className="svte-detail">
              <span className="svte-label">March length</span>
              <span className="svte-value">29/30 days (Gregorian leap)</span>
            </div>
            <div className="svte-detail">
              <span className="svte-label">Drift from Civil</span>
              <span className="svte-value highlight">0 days (locked)</span>
            </div>
          </div>

          <div className="svte-accuracy-bar">
            <div className="svte-accuracy-fill sync" style={{ width: '99.9%' }} />
          </div>
          <span className="svte-accuracy-label">Matches Gregorian perfectly</span>
        </div>

        {/* VS Divider */}
        <div className="svte-divider">VS</div>

        {/* TRUE Mode */}
        <div className="svte-mode true">
          <div className="svte-mode-header">
            <span className="svte-icon">☀️</span>
            <span className="svte-title">TRUE Mode</span>
          </div>
          
          <div className="svte-details">
            <div className="svte-detail">
              <span className="svte-label">Independent</span>
              <span className="svte-value">Astronomical calculation</span>
            </div>
            <div className="svte-detail">
              <span className="svte-label">March correction</span>
              <span className="svte-value">Every 4 years (except 128th)</span>
            </div>
            <div className="svte-detail">
              <span className="svte-label">Mean year length</span>
              <span className="svte-value highlight">365.2422 days</span>
            </div>
          </div>

          <div className="svte-accuracy-bar">
            <div className="svte-accuracy-fill true" style={{ width: '99.99%' }} />
          </div>
          <span className="svte-accuracy-label">Closer to solar year than Gregorian</span>
        </div>
      </div>

      {/* Year Slider */}
      <div className="svte-slider-section">
        <span className="svte-slider-label">Simulate: Year {year}</span>
        <input
          type="range"
          min="1"
          max={maxYears}
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="svte-slider"
        />
        
        <div className="svte-drift-display">
          <div className="svte-drift sync">
            <span className="svte-drift-label">SYNC drift from Gregorian:</span>
            <span className="svte-drift-value">0.00 days</span>
          </div>
          <div className="svte-drift true">
            <span className="svte-drift-label">TRUE drift from Gregorian:</span>
            <span className="svte-drift-value">+{trueDrift.toFixed(2)} days</span>
          </div>
        </div>
      </div>

      {/* Bottom Truth */}
      <div className="svte-truth">
        <span className="svte-truth-icon">⚡</span>
        <span className="svte-truth-text">
          TRUE mode sacrifices civil alignment for superior solar accuracy. 
          Over centuries, it stays closer to the actual seasons.
        </span>
      </div>
    </div>
  );
};

export default SyncVsTrueEpic;
