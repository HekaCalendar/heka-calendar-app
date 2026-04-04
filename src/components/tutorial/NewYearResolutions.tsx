/**
 * New Year Resolutions Visual
 * Seasonal alignment for personal renewal - BOTH HEMISPHERES
 */
import React from 'react';
import './new-year-resolutions.css';

export const NewYearResolutions: React.FC = () => {
  return (
    <div className="nyr-visual">
      {/* Dual Hemisphere January */}
      <div className="nyr-hemispheres">
        <div className="nyr-hemi northern">
          <span className="nyr-hemi-icon">❄️</span>
          <span className="nyr-hemi-label">Northern January</span>
          <span className="nyr-hemi-desc">Deep winter. Survival mode.</span>
        </div>
        <div className="nyr-hemi-divider">⚡</div>
        <div className="nyr-hemi southern">
          <span className="nyr-hemi-icon">☀️</span>
          <span className="nyr-hemi-label">Southern January</span>
          <span className="nyr-hemi-desc">Peak summer. Heat exhaustion.</span>
        </div>
      </div>

      {/* Both are survival */}
      <div className="nyr-survival-banner">
        <span>Both hemispheres in survival mode — neither ideal for new beginnings</span>
      </div>

      {/* VS Resolution */}
      <div className="nyr-vs-section">
        <div className="nyr-vs-item">
          <span className="nyr-vs-icon">🏃</span>
          <span className="nyr-vs-text">Your Resolution</span>
        </div>
        <div className="nyr-vs-arrow">🌊 Working Against Seasonal Flow</div>
      </div>

      {/* Energy Bar */}
      <div className="nyr-energy-row">
        <span className="nyr-energy-label">Natural Energy Available</span>
        <div className="nyr-energy-track">
          <div className="nyr-energy-fill low" />
        </div>
        <span className="nyr-energy-value">15%</span>
      </div>

      {/* HEKA Solution */}
      <div className="nyr-solution">
        <span className="nyr-solution-label">HEKA Alternative:</span>
        <div className="nyr-april-start">
          <span className="nyr-april-icon">🌱</span>
          <span className="nyr-april-text">April Start — Natural awakening worldwide</span>
        </div>
      </div>
    </div>
  );
};

export default NewYearResolutions;
