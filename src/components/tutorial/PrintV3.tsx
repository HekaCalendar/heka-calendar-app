/**
 * Print V3 - ENHANCED with HEKA True superiority
 * Shows how HEKA True is more accurate to the sun than Gregorian
 */
import React from 'react';
import './elite-visuals.css';

export const PrintV3: React.FC = () => {
  const printThemes = [
    { name: 'Default', icon: '✦' },
    { name: 'Minimalist', icon: '◯' },
    { name: 'Sacred Geometry', icon: '⬡' },
    { name: 'Nature', icon: '🌿' },
    { name: 'Cyberpunk', icon: '⚡' },
    { name: 'Egyptian', icon: '𓂀' },
  ];

  return (
    <div className="elite-visual print-v3">
      <div className="v3-print-container">
        {/* Header */}
        <div className="v3-print-header">
          <div className="v3-print-icon">🖨️</div>
          <h3 className="v3-print-title">Print & Export</h3>
        </div>

        {/* HEKA vs Gregorian Accuracy Comparison */}
        <div className="v3-accuracy-comparison">
          <div className="v3-accuracy-title">Solar Accuracy</div>
          <div className="v3-accuracy-bars">
            <div className="v3-accuracy-row">
              <span className="v3-accuracy-label">Gregorian</span>
              <div className="v3-accuracy-bar">
                <div className="v3-bar-fill gregorian" style={{ width: '76%' }} />
              </div>
              <span className="v3-accuracy-value">76%</span>
            </div>
            <div className="v3-accuracy-row heka">
              <span className="v3-accuracy-label">HEKA True</span>
              <div className="v3-accuracy-bar">
                <div className="v3-bar-fill heka" style={{ width: '99.9%' }} />
              </div>
              <span className="v3-accuracy-value">99.9%</span>
            </div>
          </div>
          <p className="v3-accuracy-note">
            HEKA True tracks the actual solar year with March correction
          </p>
        </div>

        {/* Paper Sizes */}
        <div className="v3-print-section">
          <div className="v3-section-label">Paper Sizes</div>
          <div className="v3-paper-options">
            <div className="v3-paper-card">
              <div className="v3-paper-icon a4">A4</div>
              <span>210×297mm</span>
            </div>
            <div className="v3-paper-card">
              <div className="v3-paper-icon a3">A3</div>
              <span>297×420mm</span>
            </div>
            <div className="v3-paper-card">
              <div className="v3-paper-icon letter">LTR</div>
              <span>8.5×11in</span>
            </div>
          </div>
        </div>

        {/* Print Themes */}
        <div className="v3-print-section">
          <div className="v3-section-label">6 Print Themes</div>
          <div className="v3-print-themes">
            {printThemes.map((theme) => (
              <div key={theme.name} className="v3-print-theme">
                <span className="v3-theme-icon">{theme.icon}</span>
                <span className="v3-theme-name">{theme.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Include Options */}
        <div className="v3-print-section">
          <div className="v3-section-label">Include in Print</div>
          <div className="v3-include-list">
            <span className="v3-include-item">✓ Personal Notes</span>
            <span className="v3-include-item">✓ Moon Phases</span>
            <span className="v3-include-item">✓ Civil Dates</span>
            <span className="v3-include-item">✓ Holidays</span>
            <span className="v3-include-item">✓ Seasonal Events</span>
          </div>
        </div>

        {/* Free Forever */}
        <div className="v3-free-banner">
          <span>🎁</span>
          <span>Free Themed Prints — Forever</span>
        </div>
      </div>
    </div>
  );
};
