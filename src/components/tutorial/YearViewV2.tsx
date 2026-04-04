/**
 * Year View V2 - ACCURATE
 * Shows 13-month year overview
 */
import React from 'react';
import './elite-visuals.css';

export const YearViewV2: React.FC = () => {
  const months = [
    { name: 'JANUARY', days: 28, arc: 'OPENING', color: '#dc2626' },
    { name: 'FEBRUARY', days: 28, arc: 'OPENING', color: '#dc2626' },
    { name: 'MARCH', days: 28, arc: 'OPENING', color: '#dc2626' },
    { name: 'APRIL', days: 28, arc: 'OPENING', color: '#dc2626' },
    { name: 'MAY', days: 28, arc: 'CORE', color: '#16a34a' },
    { name: 'JUNE', days: 28, arc: 'CORE', color: '#16a34a' },
    { name: 'JULY', days: 28, arc: 'CORE', color: '#16a34a' },
    { name: 'AUGUST', days: 28, arc: 'CORE', color: '#16a34a' },
    { name: 'SEPTEMBER', days: 28, arc: 'CORE', color: '#16a34a' },
    { name: 'OCTOBER', days: 28, arc: 'CLOSING', color: '#7c3aed' },
    { name: 'NOVEMBER', days: 28, arc: 'CLOSING', color: '#7c3aed' },
    { name: 'DECEMBER', days: 28, arc: 'CLOSING', color: '#7c3aed' },
    { name: 'SOL', days: 29, arc: 'CLOSING', color: '#7c3aed', special: true },
  ];

  return (
    <div className="elite-visual year-view-v2">
      <div className="v2-year-container">
        <div className="v2-year-header">
          <h3 className="v2-year-title">HEKA Year 2026–2027</h3>
          <p className="v2-year-subtitle">13 Months • 365 Days</p>
        </div>
        
        <div className="v2-year-grid">
          {months.map((month, i) => (
            <div 
              key={month.name}
              className={`v2-year-card ${month.special ? 'sol' : ''} ${i === 3 ? 'current' : ''}`}
              style={{ borderColor: month.color }}
            >
              <div className="v2-card-header" style={{ color: month.color }}>
                {month.name}
              </div>
              <div className="v2-card-days">{month.days}</div>
              <div className="v2-card-arc">{month.arc}</div>
              {month.special && <div className="v2-sol-star">★</div>}
            </div>
          ))}
        </div>
        
        <div className="v2-year-actions">
          <button className="v2-print-year-btn">🖨️ Print Year</button>
          <div className="v2-year-stats">
            <span>52 Weeks</span>
            <span>•</span>
            <span>13 Full Moons</span>
          </div>
        </div>
      </div>
    </div>
  );
};
