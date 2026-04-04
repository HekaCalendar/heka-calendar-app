/**
 * Month Structure Visualizer
 * Shows the 13-month HEKA calendar layout visually
 */

import React from 'react';
import './month-structure-visualizer.css';

export const MonthStructureVisualizer: React.FC = () => {
  const months = [
    { num: 1, name: 'April', days: 28, arc: 'opening' },
    { num: 2, name: 'May', days: 28, arc: 'opening' },
    { num: 3, name: 'June', days: 28, arc: 'opening' },
    { num: 4, name: 'July', days: 28, arc: 'opening' },
    { num: 5, name: 'August', days: 28, arc: 'core' },
    { num: 6, name: 'September', days: 28, arc: 'core' },
    { num: 7, name: 'October', days: 28, arc: 'core' },
    { num: 8, name: 'November', days: 28, arc: 'core' },
    { num: 9, name: 'December', days: 28, arc: 'core' },
    { num: 10, name: 'January', days: 28, arc: 'closing' },
    { num: 11, name: 'February', days: 28, arc: 'closing' },
    { num: 12, name: 'March', days: 29, arc: 'closing', special: true },
  ];

  const totalDays = months.reduce((sum, m) => sum + m.days, 0);

  return (
    <div className="month-structure-viz">
      {/* Header */}
      <div className="month-viz-header">
        <div className="month-viz-total">
          <span className="month-viz-number">{totalDays}</span>
          <span className="month-viz-label">days</span>
        </div>
        <div className="month-viz-breakdown">
          <div className="month-viz-stat">
            <span className="month-viz-dot opening" />
            <span>4 months opening</span>
          </div>
          <div className="month-viz-stat">
            <span className="month-viz-dot core" />
            <span>5 months core</span>
          </div>
          <div className="month-viz-stat">
            <span className="month-viz-dot closing" />
            <span>3 months closing</span>
          </div>
        </div>
      </div>

      {/* Month Grid */}
      <div className="month-viz-grid">
        {months.map((month) => (
          <div
            key={month.num}
            className={`month-viz-card ${month.arc} ${month.special ? 'special' : ''}`}
          >
            <div className="month-viz-card-num">{month.num}</div>
            <div className="month-viz-card-name">{month.name}</div>
            <div className="month-viz-card-days">
              <span className="month-viz-day-count">{month.days}</span>
              <span className="month-viz-day-label">days</span>
            </div>
            {month.special && (
              <div className="month-viz-special-badge">+1 leap</div>
            )}
          </div>
        ))}
      </div>

      {/* Pattern Explanation */}
      <div className="month-viz-pattern">
        <div className="month-viz-pattern-item">
          <div className="month-viz-pattern-visual">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="month-viz-week-bar" />
            ))}
          </div>
          <div className="month-viz-pattern-text">
            28 days = exactly 4 weeks
          </div>
        </div>
        <div className="month-viz-pattern-item">
          <div className="month-viz-pattern-visual">
            <div className="month-viz-same-day">1st</div>
            <div className="month-viz-arrow">→</div>
            <div className="month-viz-same-day">1st</div>
            <div className="month-viz-arrow">→</div>
            <div className="month-viz-same-day">1st</div>
          </div>
          <div className="month-viz-pattern-text">
            Every month starts same weekday
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthStructureVisualizer;
