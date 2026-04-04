/**
 * Time Range - 3000 BCE to 3000 CE
 */
import React from 'react';
import './elite-visuals.css';

export const TimeRange: React.FC = () => {
  return (
    <div className="elite-visual time-range">
      <div className="tr-container">
        {/* Timeline */}
        <div className="tr-timeline">
          <div className="tr-start">
            <div className="tr-year">3000</div>
            <div className="tr-era">BCE</div>
          </div>
          
          <div className="tr-line">
            <div className="tr-line-inner" />
            <div className="tr-center">NOW</div>
          </div>
          
          <div className="tr-end">
            <div className="tr-year">3000</div>
            <div className="tr-era">CE</div>
          </div>
        </div>

        {/* Span */}
        <div className="tr-span">
          <div className="tr-span-value">6,000</div>
          <div className="tr-span-label">Years of Data</div>
        </div>

        {/* Use cases */}
        <div className="tr-uses">
          <div className="tr-use">
            <span className="tr-use-icon">🏛️</span>
            <span>Ancient Rituals</span>
          </div>
          <div className="tr-use">
            <span className="tr-use-icon">📅</span>
            <span>Today</span>
          </div>
          <div className="tr-use">
            <span className="tr-use-icon">🔮</span>
            <span>Future Planning</span>
          </div>
        </div>

        {/* Note */}
        <div className="tr-note">
          Any date. Any century. Celestial mechanics at your command.
        </div>
      </div>
    </div>
  );
};
