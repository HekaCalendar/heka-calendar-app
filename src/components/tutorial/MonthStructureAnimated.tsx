/**
 * Month Structure Animated
 * Slide 2: Unfolding animation showing 13-month structure
 */

import React, { useState, useEffect } from 'react';
import './elite-visuals.css';

export const MonthStructureAnimated: React.FC = () => {
  const [showPattern, setShowPattern] = useState(false);

  useEffect(() => {
    // Show pattern after cards animate
    const timer = setTimeout(() => {
      setShowPattern(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Actual HEKA months with Hexa as month 6
  const months = [
    { num: 1, name: 'April', arc: 'opening', color: '#ef4444' },
    { num: 2, name: 'May', arc: 'opening', color: '#ef4444' },
    { num: 3, name: 'June', arc: 'opening', color: '#ef4444' },
    { num: 4, name: 'July', arc: 'opening', color: '#ef4444' },
    { num: 5, name: 'August', arc: 'opening', color: '#ef4444' },
    { num: 6, name: 'Hexa', arc: 'core', color: '#22c55e' },
    { num: 7, name: 'September', arc: 'core', color: '#22c55e' },
    { num: 8, name: 'October', arc: 'core', color: '#22c55e' },
    { num: 9, name: 'November', arc: 'core', color: '#22c55e' },
    { num: 10, name: 'December', arc: 'core', color: '#22c55e' },
    { num: 11, name: 'January', arc: 'closing', color: '#a855f7' },
    { num: 12, name: 'February', arc: 'closing', color: '#a855f7' },
    { num: 13, name: 'March', arc: 'closing', color: '#a855f7', special: true }, // 29/30 days
  ];

  // Auto-unfolds on mount, no button needed

  return (
    <div className={`elite-structure-revealed ${showPattern ? 'show-pattern' : ''}`}>
      {/* Month Grid */}
      <div className="elite-structure-grid">
        {months.map((m, i) => (
          <div
            key={m.num}
            className={`elite-structure-card ${m.arc} ${m.special ? 'special' : ''}`}
            style={{
              animationDelay: `${i * 0.08}s`,
              borderColor: m.color,
            }}
          >
            <div className="elite-card-num">{m.num}</div>
            <div className="elite-card-name">{m.name}</div>
            <div className="elite-card-days">
              {m.special ? '29 days' : '28 days'}
            </div>
            {m.special && <div className="elite-special-badge">+1 leap</div>}
          </div>
        ))}
      </div>

      {/* Pattern Explanation */}
      {showPattern && (
        <div className="elite-pattern-explanation">
          <div className="elite-pattern-line">
            <div className="elite-week-bars">
              {[1, 2, 3, 4].map(w => (
                <div key={w} className="elite-week-bar" />
              ))}
            </div>
            <span>28 days = exactly 4 weeks</span>
          </div>
          <div className="elite-pattern-line">
            <div className="elite-same-day-flow">
              <span className="elite-day-node">1st</span>
              <span className="elite-flow-arrow">→</span>
              <span className="elite-day-node">1st</span>
              <span className="elite-flow-arrow">→</span>
              <span className="elite-day-node">1st</span>
            </div>
            <span>Every month starts same weekday</span>
          </div>
          <div className="elite-pattern-line">
            <span className="elite-total-highlight">365 days</span>
            <span>Perfect symmetry</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthStructureAnimated;
