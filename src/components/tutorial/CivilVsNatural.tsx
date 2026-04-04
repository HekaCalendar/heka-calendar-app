/**
 * Civil vs Natural Time - Enterprise Visual
 * Demonstrates both calendar systems without text blocks
 */
import React from 'react';
import './civil-vs-natural.css';

export const CivilVsNatural: React.FC = () => {
  return (
    <div className="cvn-visual">
      {/* Split Comparison */}
      <div className="cvn-comparison">
        {/* Civil Side */}
        <div className="cvn-side civil">
          <div className="cvn-header">
            <span className="cvn-icon">🏛️</span>
            <span className="cvn-title">Civil Time</span>
          </div>
          
          <div className="cvn-uses">
            <div className="cvn-use-item">
              <span className="cvn-check">✓</span>
              <span>Global coordination</span>
            </div>
            <div className="cvn-use-item">
              <span className="cvn-check">✓</span>
              <span>Tax & fiscal years</span>
            </div>
            <div className="cvn-use-item">
              <span className="cvn-check">✓</span>
              <span>Payroll & business</span>
            </div>
          </div>

          <div className="cvn-january-box">
            <span className="cvn-month">January 1</span>
            <div className="cvn-hemispheres">
              <span>❄️ Winter</span>
              <span>☀️ Summer</span>
            </div>
          </div>
        </div>

        {/* Natural Side */}
        <div className="cvn-side natural">
          <div className="cvn-header">
            <span className="cvn-icon">🌿</span>
            <span className="cvn-title">Natural Time</span>
          </div>
          
          <div className="cvn-uses">
            <div className="cvn-use-item">
              <span className="cvn-check">✓</span>
              <span>Personal growth</span>
            </div>
            <div className="cvn-use-item">
              <span className="cvn-check">✓</span>
              <span>Cosmic alignment</span>
            </div>
            <div className="cvn-use-item">
              <span className="cvn-check">✓</span>
              <span>Seasonal harmony</span>
            </div>
          </div>

          <div className="cvn-april-box">
            <span className="cvn-month">April 1</span>
            <div className="cvn-hemispheres">
              <span>🌱 Awakening</span>
              <span>🍂 Renewal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Message */}
      <div className="cvn-message">
        <span>Both valid. Both valuable. Choose your rhythm.</span>
      </div>
    </div>
  );
};

export default CivilVsNatural;
