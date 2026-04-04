/**
 * Calendar Comparison V2
 * Step 1: Dramatic reveal of Gregorian chaos vs HEKA perfection
 */

import React, { useState, useEffect } from 'react';
import './calendar-comparison-v2.css';

export const CalendarComparisonV2: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const gregorianData = [
    { month: 'Jan', days: 31, color: '#ef4444' },
    { month: 'Feb', days: 28, color: '#f97316' },
    { month: 'Mar', days: 31, color: '#eab308' },
    { month: 'Apr', days: 30, color: '#22c55e' },
    { month: 'May', days: 31, color: '#3b82f6' },
    { month: 'Jun', days: 30, color: '#8b5cf6' },
    { month: 'Jul', days: 31, color: '#ec4899' },
    { month: 'Aug', days: 31, color: '#f43f5e' },
    { month: 'Sep', days: 30, color: '#f97316' },
    { month: 'Oct', days: 31, color: '#eab308' },
    { month: 'Nov', days: 30, color: '#22c55e' },
    { month: 'Dec', days: 31, color: '#3b82f6' },
  ];

  const hekaData = [
    { num: 1, month: 'April', days: 28, arc: 'opening' },
    { num: 2, month: 'May', days: 28, arc: 'opening' },
    { num: 3, month: 'June', days: 28, arc: 'opening' },
    { num: 4, month: 'July', days: 28, arc: 'opening' },
    { num: 5, month: 'August', days: 28, arc: 'opening' },
    { num: 6, month: 'Hexa', days: 28, arc: 'core', highlight: true },
    { num: 7, month: 'September', days: 28, arc: 'core' },
    { num: 8, month: 'October', days: 28, arc: 'core' },
    { num: 9, month: 'November', days: 28, arc: 'core' },
    { num: 10, month: 'December', days: 28, arc: 'core' },
    { num: 11, month: 'January', days: 28, arc: 'closing' },
    { num: 12, month: 'February', days: 28, arc: 'closing' },
    { num: 13, month: 'March', days: 29, arc: 'closing', special: true },
  ];

  return (
    <div className="cal-comparison-v2">
      {/* Header Battle */}
      <div className="cal-battle-header">
        <div className={`cal-side-header ${phase >= 1 ? 'chaos' : ''}`}>
          <span className="cal-side-title">Gregorian</span>
          <span className="cal-side-subtitle">Civil Time</span>
        </div>
        <div className="cal-vs-badge">VS</div>
        <div className={`cal-side-header ${phase >= 2 ? 'perfect' : ''}`}>
          <span className="cal-side-title">HEKA</span>
          <span className="cal-side-subtitle">Natural Time</span>
        </div>
      </div>

      {/* Comparison Visualization */}
      <div className="cal-battle-viz">
        {/* Gregorian Chaos */}
        <div className={`cal-chaos-container ${phase >= 1 ? 'show' : ''}`}>
          <div className="cal-chaos-bars">
            {gregorianData.map((m, i) => (
              <div
                key={m.month}
                className="cal-chaos-bar"
                style={{
                  height: `${(m.days / 31) * 60}px`,
                  background: m.color,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <span className="chaos-bar-days">{m.days}</span>
              </div>
            ))}
          </div>
          <div className="cal-chaos-labels">
            {gregorianData.map((m, i) => (
              <span key={m.month} className="chaos-label" style={{ animationDelay: `${i * 0.05}s` }}>
                {m.month}
              </span>
            ))}
          </div>
          <div className="cal-chaos-stats">
            <span className="chaos-stat">📊 Variable lengths</span>
            <span className="chaos-stat">❌ 28-31 days</span>
            <span className="chaos-stat">❌ Shifting weekdays</span>
          </div>
        </div>

        {/* HEKA Perfection */}
        <div className={`cal-perfect-container ${phase >= 2 ? 'show' : ''}`}>
          <div className="cal-perfect-grid">
            {hekaData.map((m, i) => (
              <div
                key={m.month}
                className={`cal-perfect-block ${m.arc} ${m.special ? 'special' : ''} ${m.highlight ? 'highlight' : ''}`}
                style={{ animationDelay: `${0.3 + i * 0.04}s` }}
              >
                <span className="perfect-block-num">{m.num}</span>
                <span className="perfect-block-month">{m.month}</span>
                <span className="perfect-block-days">{m.days}</span>
                {m.special && <span className="perfect-leap">+1 leap</span>}
              </div>
            ))}
          </div>
          <div className="cal-perfect-stats">
            <span className="perfect-stat">✓ Consistent 4-week months</span>
            <span className="perfect-stat">✓ 28 days (29 for March)</span>
            <span className="perfect-stat">✓ Fixed weekdays all year</span>
          </div>
        </div>
      </div>

      {/* The Revelation */}
      <div className={`cal-revelation ${phase >= 3 ? 'show' : ''}`}>
        <div className="revelation-item">
          <span className="revelation-number">365</span>
          <span className="revelation-label">days in perfect symmetry</span>
        </div>
        <div className="revelation-arrow">↓</div>
        <div className="revelation-insight">
          Your birthday falls on the same weekday every year
        </div>
      </div>


    </div>
  );
};

export default CalendarComparisonV2;
