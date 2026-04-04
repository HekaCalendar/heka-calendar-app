/**
 * Navigation Demo Visual
 * Shows navigation controls and expand features
 */
import React from 'react';
import './elite-visuals.css';

export const NavigationDemo: React.FC = () => {
  return (
    <div className="elite-visual navigation-demo">
      {/* Navigation Controls */}
      <div className="nav-demo-container">
        {/* Month Navigation */}
        <div className="nav-section">
          <div className="nav-title">Month Navigation</div>
          <div className="nav-arrows-demo">
            <button className="nav-arrow left">◀ March</button>
            <div className="nav-current">APRIL 2026</div>
            <button className="nav-arrow right">May ▶</button>
          </div>
        </div>
        
        {/* Today Button */}
        <div className="nav-section">
          <div className="nav-title">Return to Present</div>
          <button className="today-btn-demo">
            <span className="today-icon">📍</span>
            <span className="today-text">Today</span>
          </button>
          <div className="nav-desc">Instantly return to current date</div>
        </div>
        
        {/* Expand Controls */}
        <div className="nav-section">
          <div className="nav-title">Expand Your View</div>
          <div className="expand-demos">
            <div className="expand-option">
              <div className="expand-visual vertical">
                <div className="mini-months">
                  <div className="mini-month">APR</div>
                  <div className="mini-month">MAY</div>
                  <div className="mini-month">JUN</div>
                </div>
              </div>
              <span>Vertical Stack</span>
            </div>
            <div className="expand-option">
              <div className="expand-visual horizontal">
                <div className="mini-months-row">
                  <div className="mini-month">APR</div>
                  <div className="mini-month">MAY</div>
                </div>
              </div>
              <span>Horizontal Grid</span>
            </div>
          </div>
        </div>
        
        {/* Year View */}
        <div className="nav-section">
          <div className="nav-title">Year View</div>
          <div className="year-grid-mini">
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={i} className={`year-month-mini ${i === 3 ? 'current' : ''}`}>
                {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC','SOL'][i]}
              </div>
            ))}
          </div>
          <button className="year-btn-demo">View Full Year</button>
        </div>
      </div>
    </div>
  );
};
