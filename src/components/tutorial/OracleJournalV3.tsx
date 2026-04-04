/**
 * Oracle Journal V3 - ACCURATE with actual features
 * 
 * Actual Oracle Journal features:
 * - 6 module themes (Cosmic Void, Nebula Dreams, Aurora, Solar Flare, Midnight Scholar, Obsidian Mystic)
 * - 3 paper styles (Lined, Plain, Dot Grid)
 * - 6 journal fonts
 * - AI-generated prompts based on transits
 * - Mood tracking with emojis
 * - Weather/location tracking
 * - Transit awareness
 * - Pattern recognition across entries
 * - Export to PDF
 * - 100% private, no cloud
 */
import React from 'react';
import './elite-visuals.css';

export const OracleJournalV3: React.FC = () => {
  const moduleThemes = [
    { name: 'Cosmic Void', icon: '🌌', color: '#9d4edd' },
    { name: 'Nebula Dreams', icon: '🌸', color: '#ff6b9d' },
    { name: 'Aurora', icon: '🌿', color: '#00d9a5' },
    { name: 'Solar Flare', icon: '☀️', color: '#ff9500' },
    { name: 'Midnight Scholar', icon: '📚', color: '#ffd700' },
    { name: 'Obsidian Mystic', icon: '💎', color: '#c0c0c0' },
  ];

  const paperStyles = [
    { name: 'Lined', icon: '📝' },
    { name: 'Plain', icon: '⬜' },
    { name: 'Dot Grid', icon: '⫯' },
  ];

  return (
    <div className="elite-visual oracle-journal-v3">
      <div className="v3-journal-container">
        {/* Header */}
        <div className="v3-journal-header">
          <div className="v3-journal-icon">📓</div>
          <h3 className="v3-journal-title">Oracle Journal</h3>
          <p className="v3-journal-subtitle">Where Celestial Mechanics Meets Divine Inspiration</p>
        </div>

        {/* Journal Preview */}
        <div className="v3-journal-preview">
          <div className="v3-journal-page lined">
            <div className="v3-page-header">
              <span className="v3-page-date">April 15, 2026</span>
              <div className="v3-page-meta">
                <span className="v3-mood">😊</span>
                <span className="v3-weather">☀️ 72°F</span>
              </div>
            </div>
            <div className="v3-transit-banner">
              <span>🪐 Moon in Libra — Partnership focus today</span>
            </div>
            <div className="v3-ai-prompt">
              <span className="v3-prompt-label">Oracle Prompt:</span>
              <span className="v3-prompt-text">"What relationships need balance in your life?"</span>
            </div>
            <div className="v3-page-lines">
              <div className="v3-line" />
              <div className="v3-line short" />
              <div className="v3-line" />
              <div className="v3-line medium" />
            </div>
          </div>
        </div>

        {/* Module Themes */}
        <div className="v3-journal-section">
          <div className="v3-section-label">6 Module Themes</div>
          <div className="v3-themes-row">
            {moduleThemes.map((theme) => (
              <div key={theme.name} className="v3-theme-chip" style={{ borderColor: theme.color }}>
                <span>{theme.icon}</span>
                <span className="v3-theme-name">{theme.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Paper Styles */}
        <div className="v3-journal-section">
          <div className="v3-section-label">Paper Styles</div>
          <div className="v3-paper-row">
            {paperStyles.map((paper) => (
              <div key={paper.name} className="v3-paper-chip">
                <span>{paper.icon}</span>
                <span>{paper.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="v3-journal-features">
          <div className="v3-feature-item">
            <span className="v3-feature-icon">🔒</span>
            <span>100% Private — No cloud, ever</span>
          </div>
          <div className="v3-feature-item">
            <span className="v3-feature-icon">🤖</span>
            <span>AI Prompts from Real Transits</span>
          </div>
          <div className="v3-feature-item">
            <span className="v3-feature-icon">📊</span>
            <span>Pattern Recognition Across Entries</span>
          </div>
          <div className="v3-feature-item">
            <span className="v3-feature-icon">📄</span>
            <span>Export to PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
};
