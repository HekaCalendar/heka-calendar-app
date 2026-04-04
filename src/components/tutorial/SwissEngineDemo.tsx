/**
 * Swiss Ephemeris Engine Demo
 * Shows the astronomical calculation engine
 */
import React from 'react';
import './elite-visuals.css';

export const SwissEngineDemo: React.FC = () => {
  return (
    <div className="elite-visual swiss-engine-demo">
      <div className="engine-container">
        {/* Engine Badge */}
        <div className="engine-badge">
          <div className="engine-icon">🔭</div>
          <div className="engine-name">Swiss Ephemeris</div>
          <div className="engine-version">v2.10.03</div>
        </div>
        
        {/* Calculation Examples */}
        <div className="calculations-grid">
          <div className="calc-card">
            <div className="calc-icon">☉</div>
            <div className="calc-name">Sun Position</div>
            <div className="calc-accuracy">±0.001"</div>
            <div className="calc-desc">Ecliptic longitude & latitude</div>
          </div>
          
          <div className="calc-card">
            <div className="calc-icon">☽</div>
            <div className="calc-name">Moon Phase</div>
            <div className="calc-accuracy">±0.01"</div>
            <div className="calc-desc">Illumination & phase angle</div>
          </div>
          
          <div className="calc-card">
            <div className="calc-icon">♃</div>
            <div className="calc-name">Planets</div>
            <div className="calc-accuracy">±0.1&quot;</div>
            <div className="calc-desc">All major bodies</div>
          </div>
          
          <div className="calc-card">
            <div className="calc-icon">↑</div>
            <div className="calc-name">Rise & Set</div>
            <div className="calc-accuracy">±1s</div>
            <div className="calc-desc">Sun & Moon times</div>
          </div>
        </div>
        
        {/* Time Range */}
        <div className="time-range">
          <div className="range-label">Calculation Range</div>
          <div className="range-bar">
            <div className="range-start">3000 BCE</div>
            <div className="range-line" />
            <div className="range-end">3000 CE</div>
          </div>
          <div className="range-note">6,000 years of astronomical data</div>
        </div>
        
        {/* Powered by */}
        <div className="powered-by">
          Powered by AstroDienst
        </div>
      </div>
    </div>
  );
};
