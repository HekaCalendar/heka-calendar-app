/**
 * Hexa Month - The Bridge Month
 * Includes etymology: Hexa = 6 (Greek)
 */
import React from 'react';
import './hexa-etymology.css';

export const HexaMonth: React.FC = () => {
  return (
    <div className="hexa-visual">
      {/* Etymology Section */}
      <div className="hexa-ety-section">
        <span className="hexa-ety-label">The Language of Numbers</span>
        <div className="hexa-ety-grid">
          <div className="hexa-ety-item">
            <span className="hexa-ety-name">HEXA</span>
            <span className="hexa-ety-num">6</span>
          </div>
          <div className="hexa-ety-item">
            <span className="hexa-ety-name">SEPTEM</span>
            <span className="hexa-ety-num">7</span>
          </div>
          <div className="hexa-ety-item">
            <span className="hexa-ety-name">OCTO</span>
            <span className="hexa-ety-num">8</span>
          </div>
          <div className="hexa-ety-item">
            <span className="hexa-ety-name">NOVEM</span>
            <span className="hexa-ety-num">9</span>
          </div>
          <div className="hexa-ety-item">
            <span className="hexa-ety-name">DECEM</span>
            <span className="hexa-ety-num">10</span>
          </div>
        </div>
      </div>

      {/* Hexa Badge */}
      <div className="hexa-badge-new">
        <div className="hexa-number-new">6</div>
        <div className="hexa-name-new">HEXA</div>
        <div className="hexa-greek">ἕξ (hex) — Greek for "six"</div>
      </div>

      {/* Bridge Visualization */}
      <div className="hexa-bridge-new">
        <div className="hexa-side-new left">
          <div className="hexa-label-new">First Half</div>
          <div className="hexa-months-new">Apr — Aug</div>
          <div className="hexa-count">5 months</div>
        </div>
        <div className="hexa-center-new">
          <div className="hexa-icon-new">🌉</div>
          <div className="hexa-text-new">The Bridge</div>
        </div>
        <div className="hexa-side-new right">
          <div className="hexa-label-new">Second Half</div>
          <div className="hexa-months-new">Sep — Mar</div>
          <div className="hexa-count">7 months</div>
        </div>
      </div>

      {/* Hexa Purpose */}
      <div className="hexa-purpose">
        <span className="hexa-purpose-icon">⏸️</span>
        <span className="hexa-purpose-text">Pause. Reflect. Recalibrate before the closing arc.</span>
      </div>
    </div>
  );
};

export default HexaMonth;
