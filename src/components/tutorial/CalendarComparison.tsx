/**
 * Calendar Comparison Visual
 * Slide 1: Shows Gregorian chaos vs HEKA structure
 */

import React, { useState, useEffect } from 'react';
import './elite-visuals.css';

export const CalendarComparison: React.FC = () => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const gregorianMonths = [
    { name: 'Jan', days: 31 },
    { name: 'Feb', days: 28 },
    { name: 'Mar', days: 31 },
    { name: 'Apr', days: 30 },
    { name: 'May', days: 31 },
    { name: 'Jun', days: 30 },
    { name: 'Jul', days: 31 },
    { name: 'Aug', days: 31 },
    { name: 'Sep', days: 30 },
    { name: 'Oct', days: 31 },
    { name: 'Nov', days: 30 },
    { name: 'Dec', days: 31 },
  ];

  // Actual HEKA months including Hexa as month 6
  const hekaMonths = [
    { name: 'Apr', days: 28 },
    { name: 'May', days: 28 },
    { name: 'Jun', days: 28 },
    { name: 'Jul', days: 28 },
    { name: 'Aug', days: 28 },
    { name: 'Hexa', days: 28 },
    { name: 'Sep', days: 28 },
    { name: 'Oct', days: 28 },
    { name: 'Nov', days: 28 },
    { name: 'Dec', days: 28 },
    { name: 'Jan', days: 28 },
    { name: 'Feb', days: 28 },
    { name: 'Mar', days: 29 }, // 30 in leap year
  ];

  return (
    <div className="elite-comparison">
      {/* Stats Summary */}
      <div className="elite-comparison-stats">
        <div className="elite-stat-box">
          <span className="elite-stat-label">Gregorian</span>
          <span className="elite-stat-value chaotic">Chaotic</span>
          <span className="elite-stat-sub">28-31 days</span>
        </div>
        <div className="elite-vs-badge">VS</div>
        <div className="elite-stat-box">
          <span className="elite-stat-label">HEKA</span>
          <span className="elite-stat-value perfect">Perfect</span>
          <span className="elite-stat-sub">28-29 days</span>
        </div>
      </div>

      {/* Side by Side Mini Visualization */}
      <div className="elite-mini-viz">
        {/* Gregorian - Chaotic */}
        <div className={`elite-mini-side ${revealed ? 'revealed' : ''}`}>
          <div className="elite-mini-chaos">
            {gregorianMonths.slice(0, 6).map((m, i) => (
              <div
                key={m.name}
                className="elite-mini-chaos-bar"
                style={{
                  height: `${(m.days / 31) * 40 + 20}px`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
            <span className="elite-mini-ellipsis">...</span>
          </div>
        </div>

        {/* HEKA - Perfect */}
        <div className={`elite-mini-side ${revealed ? 'revealed' : ''}`}>
          <div className="elite-mini-perfect">
            {hekaMonths.map((m, i) => (
              <div
                key={m.name}
                className={`elite-mini-perfect-block ${m.days === 29 ? 'special' : ''}`}
                style={{ animationDelay: `${0.3 + i * 0.02}s` }}
              >
                {m.days === 29 && <span className="elite-mini-leap">+1</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className={`elite-insight ${revealed ? 'show' : ''}`}>
        <div className="elite-insight-item">
          <span className="elite-check">✓</span>
          <span>Every month = exactly 4 weeks</span>
        </div>
        <div className="elite-insight-item">
          <span className="elite-check">✓</span>
          <span>Your birthday always same weekday</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarComparison;
