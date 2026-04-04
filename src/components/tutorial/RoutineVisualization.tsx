/**
 * Routine Visualization
 * Slide 11: Shows how routines work across 13 months
 */

import React, { useState } from 'react';
import './elite-visuals.css';

export const RoutineVisualization: React.FC = () => {
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);

  const routines = [
    { id: 'gym', name: 'Gym', day: 4, icon: '💪' },
    { id: 'bills', name: 'Pay Bills', day: 28, icon: '💰' },
    { id: 'review', name: 'Monthly Review', day: 1, icon: '📊' },
  ];

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  const handleRoutineClick = (id: string) => {
    setActiveRoutine(id);
  };

  const activeRoutineData = routines.find(r => r.id === activeRoutine);

  return (
    <div className="elite-routine-viz">
      {/* Routine Selector */}
      <div className="elite-routine-selector">
        {routines.map(r => (
          <button
            key={r.id}
            className={`elite-routine-btn ${activeRoutine === r.id ? 'active' : ''}`}
            onClick={() => handleRoutineClick(r.id)}
          >
            <span className="elite-routine-icon">{r.icon}</span>
            <span className="elite-routine-name">{r.name}</span>
            <span className="elite-routine-day">Every {r.day}{getOrdinal(r.day)}</span>
          </button>
        ))}
      </div>

      {/* Calendar Visualization */}
      <div className="elite-routine-calendar">
        {months.map((month) => (
          <div key={month} className="elite-routine-month">
            <div className="elite-routine-month-name">{month}</div>
            <div className="elite-routine-days">
              {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28].map(day => (
                <div
                  key={day}
                  className={`elite-routine-day ${
                    activeRoutineData?.day === day ? 'highlighted' : ''
                  }`}
                >
                  {activeRoutineData?.day === day && (
                    <span className="elite-routine-marker">{activeRoutineData.icon}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      {activeRoutine && (
        <div className="elite-routine-stats">
          <div className="elite-stat-item">
            <span className="elite-stat-num">13</span>
            <span className="elite-stat-label">times per year</span>
          </div>
          <div className="elite-stat-item">
            <span className="elite-stat-num">Same</span>
            <span className="elite-stat-label">weekday always</span>
          </div>
        </div>
      )}

      {!activeRoutine && (
        <div className="elite-routine-hint">
          Click a routine above to see the pattern
        </div>
      )}
    </div>
  );
};

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default RoutineVisualization;
