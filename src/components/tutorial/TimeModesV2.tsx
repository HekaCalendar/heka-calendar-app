/**
 * Time Modes V2 - ACCURATE (SYNC vs TRUE)
 */
import React from 'react';
import './elite-visuals.css';

export const TimeModesV2: React.FC = () => {
  return (
    <div className="elite-visual time-modes-v2">
      <div className="v2-time-container">
        {/* SYNC Mode */}
        <div className="v2-time-card sync">
          <div className="v2-time-badge">SYNC</div>
          <h4 className="v2-time-title">Gregorian Synchronized</h4>
          <p className="v2-time-desc">
            April through March alignment<br />
            Matches civil calendar structure<br />
            28-day months, March = 29 days
          </p>
          <div className="v2-time-range">April 1 → March 28/29</div>
        </div>
        
        {/* VS */}
        <div className="v2-vs-divider">
          <span>VS</span>
        </div>
        
        {/* TRUE Mode */}
        <div className="v2-time-card true">
          <div className="v2-time-badge">TRUE</div>
          <h4 className="v2-time-title">True HEKA Timekeeping</h4>
          <p className="v2-time-desc">
            March correction (4-year cycle)<br />
            Astronomical precision<br />
            Except 128th year (no correction)
          </p>
          <div className="v2-time-range">Astronomical accuracy</div>
        </div>
        
        {/* Toggle */}
        <div className="v2-toggle-demo">
          <button className="v2-toggle-btn active">SYNC</button>
          <button className="v2-toggle-btn">TRUE</button>
        </div>
        
        <p className="v2-time-note">
          Toggle anytime in Settings ⚙️
        </p>
      </div>
    </div>
  );
};
