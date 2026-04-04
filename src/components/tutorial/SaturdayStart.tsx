/**
 * Saturday Start - Week structure psychology
 */
import React from 'react';
import './elite-visuals.css';

export const SaturdayStart: React.FC = () => {
  const week = [
    { day: 'SAT', num: 1, type: 'weekend' },
    { day: 'SUN', num: 2, type: 'weekend' },
    { day: 'MON', num: 3, type: 'work' },
    { day: 'TUE', num: 4, type: 'work' },
    { day: 'WED', num: 5, type: 'work' },
    { day: 'THU', num: 6, type: 'work' },
    { day: 'FRI', num: 7, type: 'work' },
  ];

  return (
    <div className="elite-visual saturday-start">
      <div className="ss-container">
        {/* Week Display */}
        <div className="ss-week">
          {week.map((d) => (
            <div key={d.day} className={`ss-day ${d.type}`}>
              <div className="ss-day-num">{d.num}</div>
              <div className="ss-day-name">{d.day}</div>
            </div>
          ))}
        </div>

        {/* Psychology Points */}
        <div className="ss-points">
          <div className="ss-point">
            <span className="ss-icon">🌅</span>
            <span>Rest First — Begin with recovery</span>
          </div>
          <div className="ss-point">
            <span className="ss-icon">⚡</span>
            <span>Build Momentum — Sun-Mon transition</span>
          </div>
          <div className="ss-point">
            <span className="ss-icon">🎯</span>
            <span>Peak Friday — End week strong</span>
          </div>
        </div>

        {/* Comparison */}
        <div className="ss-compare">
          <div className="ss-compare-item">
            <div className="ss-compare-label">Gregorian</div>
            <div className="ss-compare-bar">
              <span className="ss-work">WORK</span>
              <span className="ss-rest">rest</span>
            </div>
          </div>
          <div className="ss-compare-item heka">
            <div className="ss-compare-label">HEKA</div>
            <div className="ss-compare-bar">
              <span className="ss-rest">REST</span>
              <span className="ss-work">build</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
