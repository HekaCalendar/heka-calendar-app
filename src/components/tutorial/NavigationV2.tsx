/**
 * Navigation V2 - ACCURATE
 * Shows navigation and expand features
 */
import React from 'react';
import './elite-visuals.css';

export const NavigationV2: React.FC = () => {
  return (
    <div className="elite-visual navigation-v2">
      <div className="v2-nav-container">
        {/* Month Navigation */}
        <div className="v2-nav-block">
          <div className="v2-nav-label">Month Navigation</div>
          <div className="v2-month-nav-demo">
            <button className="v2-nav-arrow">←</button>
            <div className="v2-current-month">APRIL 2026</div>
            <button className="v2-nav-arrow">→</button>
          </div>
        </div>
        
        {/* Today Button */}
        <div className="v2-nav-block">
          <div className="v2-nav-label">Return to Present</div>
          <button className="v2-today-big">
            <span>📍</span> Today
          </button>
          <div className="v2-nav-desc">Instantly jump to current date</div>
        </div>
        
        {/* Expand Modes */}
        <div className="v2-nav-block">
          <div className="v2-nav-label">Expand Your View</div>
          <div className="v2-expand-options">
            <div className="v2-expand-card">
              <div className="v2-expand-preview vertical">
                <div className="v2-stacked-months">
                  <div className="v2-mini-month">APR</div>
                  <div className="v2-mini-month">MAY</div>
                  <div className="v2-mini-month">JUN</div>
                </div>
              </div>
              <span className="v2-expand-name">Vertical Stack</span>
            </div>
            <div className="v2-expand-card">
              <div className="v2-expand-preview horizontal">
                <div className="v2-row-months">
                  <div className="v2-mini-month">APR</div>
                  <div className="v2-mini-month">MAY</div>
                </div>
              </div>
              <span className="v2-expand-name">Horizontal Grid</span>
            </div>
          </div>
        </div>
        
        {/* Year View */}
        <div className="v2-nav-block">
          <div className="v2-nav-label">Year at a Glance</div>
          <div className="v2-year-preview">
            {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC','SOL'].map((m, i) => (
              <div key={m} className={`v2-year-month ${i === 3 ? 'current' : ''} ${m === 'SOL' ? 'sol' : ''}`}>
                {m}
              </div>
            ))}
          </div>
          <button className="v2-year-btn">Open Year View</button>
        </div>
      </div>
    </div>
  );
};
