/**
 * Swiss Ephemeris Intro
 */
import React from 'react';
import './elite-visuals.css';

export const SwissEngineIntro: React.FC = () => {
  return (
    <div className="elite-visual swiss-engine-intro">
      <div className="sei-container">
        {/* Badge */}
        <div className="sei-badge">
          <div className="sei-icon">🔭</div>
          <div className="sei-title">Swiss Ephemeris</div>
          <div className="sei-powered">Powered by AstroDienst</div>
        </div>

        {/* Trust indicators */}
        <div className="sei-trust">
          <div className="sei-trust-item">
            <span className="sei-check">✓</span>
            <span>Trusted by NASA</span>
          </div>
          <div className="sei-trust-item">
            <span className="sei-check">✓</span>
            <span>Professional Astronomers</span>
          </div>
          <div className="sei-trust-item">
            <span className="sei-check">✓</span>
            <span>Swiss Observatory</span>
          </div>
        </div>

        {/* Capabilities */}
        <div className="sei-caps">
          <div className="sei-cap">
            <div className="sei-cap-icon">☉</div>
            <div className="sei-cap-text">Solar Position</div>
          </div>
          <div className="sei-cap">
            <div className="sei-cap-icon">☽</div>
            <div className="sei-cap-text">Lunar Phases</div>
          </div>
          <div className="sei-cap">
            <div className="sei-cap-icon">♃</div>
            <div className="sei-cap-text">Planets</div>
          </div>
          <div className="sei-cap">
            <div className="sei-cap-icon">↑</div>
            <div className="sei-cap-text">Rise & Set</div>
          </div>
        </div>

        {/* Promise */}
        <div className="sei-promise">
          Every calculation. Every phase. Every position.<br />
          Astronomical precision.
        </div>
      </div>
    </div>
  );
};
