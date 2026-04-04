/**
 * Cosmic Flow Visual
 * Step 0: Shows why April is the true new year based on cosmic flow
 */

import React, { useState, useEffect } from 'react';
import './cosmic-flow.css';

export const CosmicFlowVisual: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="cosmic-flow-container">
      {/* Earth visualization */}
      <div className="cosmic-earth">
        <div className="cosmic-earth-inner">
          <div className="cosmic-equator" />
          <div className="cosmic-hemisphere north">
            <span className="hemisphere-label">North</span>
          </div>
          <div className="cosmic-hemisphere south">
            <span className="hemisphere-label">South</span>
          </div>
        </div>
        
        {/* Sun rays */}
        <div className="cosmic-sun-rays">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="sun-ray" style={{ transform: `rotate(${i * 45}deg)` }} />
          ))}
        </div>
      </div>

      {/* Seasons flow */}
      <div className={`cosmic-seasons ${phase >= 1 ? 'show' : ''}`}>
        <div className="season-flow-item">
          <div className="season-icon spring">🌱</div>
          <div className="season-info">
            <span className="season-name">Spring Equinox</span>
            <span className="season-date">March 20</span>
          </div>
        </div>
        
        <div className="flow-arrow">→</div>
        
        <div className="season-flow-item highlight">
          <div className="season-icon april">🌸</div>
          <div className="season-info">
            <span className="season-name">April</span>
            <span className="season-date highlight">New Year</span>
          </div>
        </div>
        
        <div className="flow-arrow">→</div>
        
        <div className="season-flow-item">
          <div className="season-icon summer">☀️</div>
          <div className="season-info">
            <span className="season-name">Summer Solstice</span>
            <span className="season-date">June 21</span>
          </div>
        </div>
      </div>

      {/* The insight */}
      <div className={`cosmic-insight ${phase >= 2 ? 'show' : ''}`}>
        <div className="insight-item">
          <span className="insight-icon">🌍</span>
          <span className="insight-text">Northern hemisphere: Awakening begins</span>
        </div>
        <div className="insight-item">
          <span className="insight-icon">🌏</span>
          <span className="insight-text">Southern hemisphere: Rest and renewal</span>
        </div>
        <div className="insight-item highlight">
          <span className="insight-icon">⚖️</span>
          <span className="insight-text">Balance. Motion. True new year.</span>
        </div>
      </div>

      {/* VS January - Both Hemispheres */}
      <div className={`cosmic-vs ${phase >= 3 ? 'show' : ''}`}>
        <div className="vs-item civil">
          <span className="vs-label">January 1st</span>
          <span className="vs-reason">❄️ North: Deep winter survival</span>
          <span className="vs-reason">☀️ South: Peak summer exhaustion</span>
        </div>
        <div className="vs-divider">VS</div>
        <div className="vs-item natural">
          <span className="vs-label">April Start</span>
          <span className="vs-reason">🌱 Both hemispheres in balance</span>
          <span className="vs-reason">Natural awakening. Cosmic flow.</span>
        </div>
      </div>
    </div>
  );
};

export default CosmicFlowVisual;
