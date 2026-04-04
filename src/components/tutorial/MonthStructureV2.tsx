/**
 * Month Structure V2
 * Step 2: Stunning visualization of the 13-month structure
 */

import React, { useState, useEffect } from 'react';
import './month-structure-v2.css';

export const MonthStructureV2: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const months = [
    { num: 1, name: 'April', days: 28, arc: 'opening', weekPattern: [1, 8, 15, 22] },
    { num: 2, name: 'May', days: 28, arc: 'opening', weekPattern: [1, 8, 15, 22] },
    { num: 3, name: 'June', days: 28, arc: 'opening', weekPattern: [1, 8, 15, 22] },
    { num: 4, name: 'July', days: 28, arc: 'opening', weekPattern: [1, 8, 15, 22] },
    { num: 5, name: 'August', days: 28, arc: 'opening', weekPattern: [1, 8, 15, 22] },
    { num: 6, name: 'Hexa', days: 28, arc: 'core', weekPattern: [1, 8, 15, 22], highlight: true },
    { num: 7, name: 'September', days: 28, arc: 'core', weekPattern: [1, 8, 15, 22] },
    { num: 8, name: 'October', days: 28, arc: 'core', weekPattern: [1, 8, 15, 22] },
    { num: 9, name: 'November', days: 28, arc: 'core', weekPattern: [1, 8, 15, 22] },
    { num: 10, name: 'December', days: 28, arc: 'core', weekPattern: [1, 8, 15, 22] },
    { num: 11, name: 'January', days: 28, arc: 'closing', weekPattern: [1, 8, 15, 22] },
    { num: 12, name: 'February', days: 28, arc: 'closing', weekPattern: [1, 8, 15, 22] },
    { num: 13, name: 'March', days: 29, arc: 'closing', weekPattern: [1, 8, 15, 22, 29], special: true },
  ];

  const arcLabels = {
    opening: { label: 'Opening', color: '#ef4444', desc: 'New Beginnings' },
    core: { label: 'Core', color: '#22c55e', desc: 'Growth & Action' },
    closing: { label: 'Closing', color: '#a855f7', desc: 'Completion' },
  };

  return (
    <div className="month-structure-v2">
      {/* Title Stats */}
      <div className={`structure-header ${phase >= 1 ? 'show' : ''}`}>
        <div className="structure-stat">
          <span className="stat-number">13</span>
          <span className="stat-label">Months</span>
        </div>
        <div className="structure-divider" />
        <div className="structure-stat">
          <span className="stat-number">364</span>
          <span className="stat-label">Days + 1</span>
        </div>
        <div className="structure-divider" />
        <div className="structure-stat">
          <span className="stat-number">4</span>
          <span className="stat-label">Weeks Each</span>
        </div>
      </div>

      {/* Arc Legend */}
      <div className={`arc-legend ${phase >= 1 ? 'show' : ''}`}>
        {Object.entries(arcLabels).map(([key, data]) => (
          <div key={key} className="arc-legend-item">
            <div className="arc-dot" style={{ background: data.color }} />
            <div className="arc-info">
              <span className="arc-name">{data.label}</span>
              <span className="arc-desc">{data.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Month Grid */}
      <div className={`month-grid-v2 ${phase >= 1 ? 'show' : ''}`}>
        {months.map((m, i) => (
          <div
            key={m.num}
            className={`month-card-v2 ${m.arc} ${m.special ? 'special' : ''} ${m.highlight ? 'highlight' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="month-card-header">
              <span className="month-num">{m.num}</span>
              {m.special && <span className="month-leap">+1</span>}
            </div>
            <div className="month-name">{m.name}</div>
            <div className="month-days">{m.days} days</div>
            
            {/* Week pattern visualization */}
            <div className="week-pattern">
              {m.weekPattern.map((day, idx) => (
                <div key={idx} className="week-dot" title={`Day ${day}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pattern Explanation */}
      <div className={`pattern-explanation ${phase >= 2 ? 'show' : ''}`}>
        <div className="pattern-row">
          <div className="pattern-demo">
            <div className="demo-months">
              <div className="demo-month">
                <span className="demo-label">Apr</span>
                <div className="demo-days">
                  <span className="demo-day highlight">1st Tue</span>
                </div>
              </div>
              <div className="demo-arrow">→</div>
              <div className="demo-month">
                <span className="demo-label">May</span>
                <div className="demo-days">
                  <span className="demo-day highlight">1st Tue</span>
                </div>
              </div>
              <div className="demo-arrow">→</div>
              <div className="demo-month">
                <span className="demo-label">Jun</span>
                <div className="demo-days">
                  <span className="demo-day highlight">1st Tue</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pattern-text">
            Every month starts the same weekday
          </div>
        </div>
        
        <div className="pattern-row">
          <div className="pattern-demo weeks">
            <div className="week-bars">
              {[1, 2, 3, 4].map(w => (
                <div key={w} className="week-bar" />
              ))}
            </div>
          </div>
          <div className="pattern-text">
            28 days = exactly 4 weeks
          </div>
        </div>
      </div>

      {/* Annual Shift Note */}
      <div className={`annual-shift ${phase >= 3 ? 'show' : ''}`}>
        <div className="shift-icon">🔄</div>
        <div className="shift-text">
          <strong>Annual Shift:</strong> The pattern holds for one full year, 
          then shifts for the new cycle. March has 29 days (30 in leap years).
        </div>
      </div>
    </div>
  );
};

export default MonthStructureV2;
