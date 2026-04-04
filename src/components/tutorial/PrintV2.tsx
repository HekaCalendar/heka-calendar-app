/**
 * Print V2 - ACCURATE
 */
import React from 'react';
import './elite-visuals.css';

export const PrintV2: React.FC = () => {
  const printThemes = [
    { name: 'Default', icon: '✦' },
    { name: 'Minimalist', icon: '◯' },
    { name: 'Sacred Geometry', icon: '⬡' },
    { name: 'Nature', icon: '🌿' },
    { name: 'Cyberpunk', icon: '⚡' },
    { name: 'Egyptian', icon: '𓂀' },
  ];

  return (
    <div className="elite-visual print-v2">
      <div className="v2-print-container">
        <div className="v2-print-header">
          <div className="v2-print-icon">🖨️</div>
          <h3 className="v2-print-title">Print & Export</h3>
        </div>
        
        {/* Paper Sizes */}
        <div className="v2-print-section">
          <div className="v2-print-label">Paper Sizes</div>
          <div className="v2-paper-options">
            <div className="v2-paper-card">
              <div className="v2-paper-icon a4">A4</div>
              <span>210×297mm</span>
            </div>
            <div className="v2-paper-card">
              <div className="v2-paper-icon a3">A3</div>
              <span>297×420mm</span>
            </div>
            <div className="v2-paper-card">
              <div className="v2-paper-icon letter">LTR</div>
              <span>8.5×11in</span>
            </div>
          </div>
        </div>
        
        {/* Print Themes */}
        <div className="v2-print-section">
          <div className="v2-print-label">Print Themes</div>
          <div className="v2-print-themes">
            {printThemes.map((theme) => (
              <div key={theme.name} className="v2-print-theme">
                <span className="v2-theme-icon">{theme.icon}</span>
                <span className="v2-theme-name">{theme.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Include Options */}
        <div className="v2-print-section">
          <div className="v2-print-label">Include</div>
          <div className="v2-include-list">
            <span className="v2-include-item">✓ Notes</span>
            <span className="v2-include-item">✓ Moon Phases</span>
            <span className="v2-include-item">✓ Civil Dates</span>
            <span className="v2-include-item">✓ Holidays</span>
          </div>
        </div>
      </div>
    </div>
  );
};
