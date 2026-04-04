/**
 * Month Structure V3 - CORRECT ARC COLORS
 * 
 * Arc Distribution:
 * - April = OPENING (RED) - 1 month
 * - May-December (9 months including Hexa) = CORE (GREEN) 
 * - January-March = CLOSING (PURPLE) - 3 months
 */
import React from 'react';
import './elite-visuals.css';

export const MonthStructureV3: React.FC = () => {
  const months = [
    { name: 'APRIL', days: 28, arc: 'OPENING', color: '#dc2626', arcColor: 'rgba(220, 38, 38, 0.2)' },
    { name: 'MAY', days: 28, arc: 'CORE', color: '#16a34a', arcColor: 'rgba(22, 163, 74, 0.2)' },
    { name: 'JUNE', days: 28, arc: 'CORE', color: '#16a34a', arcColor: 'rgba(22, 163, 74, 0.2)' },
    { name: 'JULY', days: 28, arc: 'CORE', color: '#16a34a', arcColor: 'rgba(22, 163, 74, 0.2)' },
    { name: 'AUGUST', days: 28, arc: 'CORE', color: '#16a34a', arcColor: 'rgba(22, 163, 74, 0.2)' },
    { name: 'HEXA', days: 28, arc: 'CORE', color: '#16a34a', arcColor: 'rgba(22, 163, 74, 0.2)', special: true },
    { name: 'SEPTEMBER', days: 28, arc: 'CORE', color: '#16a34a', arcColor: 'rgba(22, 163, 74, 0.2)' },
    { name: 'OCTOBER', days: 28, arc: 'CORE', color: '#16a34a', arcColor: 'rgba(22, 163, 74, 0.2)' },
    { name: 'NOVEMBER', days: 28, arc: 'CORE', color: '#16a34a', arcColor: 'rgba(22, 163, 74, 0.2)' },
    { name: 'DECEMBER', days: 28, arc: 'CORE', color: '#16a34a', arcColor: 'rgba(22, 163, 74, 0.2)' },
    { name: 'JANUARY', days: 28, arc: 'CLOSING', color: '#7c3aed', arcColor: 'rgba(124, 58, 237, 0.2)' },
    { name: 'FEBRUARY', days: 28, arc: 'CLOSING', color: '#7c3aed', arcColor: 'rgba(124, 58, 237, 0.2)' },
    { name: 'MARCH', days: '29/30', arc: 'CLOSING', color: '#7c3aed', arcColor: 'rgba(124, 58, 237, 0.2)', leap: true },
  ];

  return (
    <div className="elite-visual month-structure-v3">
      <div className="v3-container">
        {/* Arc Legend */}
        <div className="v3-arc-legend">
          <div className="v3-legend-item">
            <span className="v3-legend-dot" style={{ background: '#dc2626' }} />
            <span>Opening</span>
          </div>
          <div className="v3-legend-item">
            <span className="v3-legend-dot" style={{ background: '#16a34a' }} />
            <span>Core (9 months)</span>
          </div>
          <div className="v3-legend-item">
            <span className="v3-legend-dot" style={{ background: '#7c3aed' }} />
            <span>Closing</span>
          </div>
        </div>

        {/* Months Grid */}
        <div className="v3-months-grid">
          {months.map((month, i) => (
            <div 
              key={month.name}
              className={`v3-month-card ${month.special ? 'special' : ''} ${month.leap ? 'leap' : ''}`}
              style={{ 
                borderColor: month.color,
                background: month.arcColor
              }}
            >
              <div className="v3-month-number">{i + 1}</div>
              <div className="v3-month-name">{month.name}</div>
              <div className="v3-month-days">{month.days}</div>
              <div className="v3-month-arc" style={{ color: month.color }}>{month.arc}</div>
              {month.special && <div className="v3-special-badge">★</div>}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="v3-stats">
          <div className="v3-stat">
            <div className="v3-stat-value">13</div>
            <div className="v3-stat-label">Months</div>
          </div>
          <div className="v3-stat">
            <div className="v3-stat-value">28</div>
            <div className="v3-stat-label">Days Each</div>
          </div>
          <div className="v3-stat">
            <div className="v3-stat-value">+8%</div>
            <div className="v3-stat-label">More Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};
