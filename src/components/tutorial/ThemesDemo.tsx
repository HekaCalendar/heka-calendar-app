/**
 * Themes Demo
 * Shows personalization options
 */
import React from 'react';
import './elite-visuals.css';

export const ThemesDemo: React.FC = () => {
  const themes = [
    { name: 'Midnight', color: '#0f172a', accent: '#c9a227', desc: 'Classic dark' },
    { name: 'Cosmic', color: '#1e1b4b', accent: '#8b5cf6', desc: 'Deep space' },
    { name: 'Forest', color: '#064e3b', accent: '#22c55e', desc: 'Natural calm' },
    { name: 'Solar', color: '#7c2d12', accent: '#f97316', desc: 'Warm energy' },
  ];

  return (
    <div className="elite-visual themes-demo">
      <div className="themes-container">
        <div className="themes-header">
          <div className="themes-icon">🎨</div>
          <div className="themes-title">Make It Yours</div>
          <div className="themes-subtitle">Themes & Personalization</div>
        </div>
        
        <div className="themes-grid">
          {themes.map((theme) => (
            <div 
              key={theme.name}
              className="theme-card"
              style={{ 
                background: `linear-gradient(135deg, ${theme.color} 0%, ${theme.accent}22 100%)`,
                borderColor: theme.accent 
              }}
            >
              <div className="theme-preview" style={{ background: theme.color }}>
                <div className="theme-accent" style={{ background: theme.accent }} />
              </div>
              <div className="theme-name">{theme.name}</div>
              <div className="theme-desc">{theme.desc}</div>
            </div>
          ))}
        </div>
        
        <div className="customization-list">
          <div className="custom-item">
            <span className="custom-icon">🌙</span>
            <span className="custom-text">Moon phases on/off</span>
          </div>
          <div className="custom-item">
            <span className="custom-icon">📅</span>
            <span className="custom-text">Civil date display</span>
          </div>
          <div className="custom-item">
            <span className="custom-icon">🎆</span>
            <span className="custom-text">Holiday indicators</span>
          </div>
        </div>
      </div>
    </div>
  );
};
