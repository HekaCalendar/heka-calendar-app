/**
 * Toggle Features - Moon and Civil date toggles
 */
import React from 'react';
import './elite-visuals.css';

export const ToggleFeatures: React.FC = () => {
  return (
    <div className="elite-visual toggle-features">
      <div className="tf-container">
        {/* Header */}
        <div className="tf-header">
          <span className="tf-icon">⚙️</span>
          <span className="tf-title">Customize Your View</span>
        </div>

        {/* Moon Toggle */}
        <div className="tf-section">
          <div className="tf-toggle-row">
            <div className="tf-toggle-info">
              <span className="tf-toggle-icon">🌙</span>
              <span className="tf-toggle-name">Moon Phases</span>
            </div>
            <div className="tf-switch on">
              <span className="tf-switch-knob">ON</span>
            </div>
          </div>
          <div className="tf-desc">
            Planning, growth, pattern recognition
          </div>
        </div>

        {/* Civil Toggle */}
        <div className="tf-section">
          <div className="tf-toggle-row">
            <div className="tf-toggle-info">
              <span className="tf-toggle-icon">📅</span>
              <span className="tf-toggle-name">Civil Dates</span>
            </div>
            <div className="tf-switch on">
              <span className="tf-switch-knob">ON</span>
            </div>
          </div>
          <div className="tf-desc">
            Stay synced with Gregorian calendar
          </div>
        </div>

        {/* Preview */}
        <div className="tf-preview">
          <div className="tf-day">
            <span className="tf-day-num">15</span>
            <span className="tf-moon">🌔</span>
            <span className="tf-civil">Apr 15</span>
          </div>
        </div>

        {/* Freedom */}
        <div className="tf-freedom">
          Choose what you see. Dive deep into HEKA time, or stay connected to both.
        </div>
      </div>
    </div>
  );
};
