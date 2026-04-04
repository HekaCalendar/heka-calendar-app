/**
 * Year View Demo Visual
 * Shows the 13-month year at a glance
 */
import React from 'react';
import './elite-visuals.css';

export const YearViewDemo: React.FC = () => {
  const months = [
    { name: 'JANUARY', days: 28, start: 'Wed' },
    { name: 'FEBRUARY', days: 28, start: 'Sat' },
    { name: 'MARCH', days: 28, start: 'Tue' },
    { name: 'APRIL', days: 28, start: 'Fri', current: true },
    { name: 'MAY', days: 28, start: 'Mon' },
    { name: 'JUNE', days: 28, start: 'Thu' },
    { name: 'JULY', days: 28, start: 'Sun' },
    { name: 'AUGUST', days: 28, start: 'Wed' },
    { name: 'SEPTEMBER', days: 28, start: 'Sat' },
    { name: 'OCTOBER', days: 28, start: 'Tue' },
    { name: 'NOVEMBER', days: 28, start: 'Fri' },
    { name: 'DECEMBER', days: 28, start: 'Mon' },
    { name: 'SOL', days: 29, start: 'Thu', special: true },
  ];

  return (
    <div className="elite-visual year-view-demo">
      <div className="year-view-container">
        <div className="year-header">
          <div className="year-title">Year 2026</div>
          <div className="year-subtitle">13 Months • 365 Days</div>
        </div>
        
        <div className="year-grid">
          {months.map((month) => (
            <div 
              key={month.name} 
              className={`year-month-card ${month.current ? 'current' : ''} ${month.special ? 'sol-month' : ''}`}
            >
              <div className="month-card-header">{month.name}</div>
              <div className="month-card-days">{month.days}</div>
              <div className="month-card-starts">Starts {month.start}</div>
              {month.special && <div className="sol-badge">★</div>}
            </div>
          ))}
        </div>
        
        <div className="year-stats">
          <div className="year-stat">
            <div className="stat-value">52</div>
            <div className="stat-label">Weeks</div>
          </div>
          <div className="year-stat">
            <div className="stat-value">13</div>
            <div className="stat-label">Full Moons</div>
          </div>
          <div className="year-stat">
            <div className="stat-value">+8%</div>
            <div className="stat-label">More Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};
