/**
 * Celestial Theme Selector
 * Epic theme picker for the Observatory
 */

import React, { useState } from 'react';
import { CELESTIAL_THEMES, type CelestialThemeId } from '../containers/CelestialThemes';
import './ThemeSelector.css';

interface ThemeSelectorProps {
  currentTheme: CelestialThemeId;
  onThemeChange: (theme: CelestialThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onThemeChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const themes = Object.values(CELESTIAL_THEMES);
  const current = CELESTIAL_THEMES[currentTheme];

  return (
    <div className="ci-theme-selector" style={{ position: 'relative' }}>
      <button 
        className="ci-theme-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          borderColor: current.colors.glassBorder,
          background: current.colors.glassBg 
        }}
      >
        <span className="ci-theme-emoji">{current.emoji}</span>
        <span className="ci-theme-name">{current.name}</span>
        <span className={`ci-theme-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <>
          <div className="ci-theme-backdrop" onClick={() => setIsOpen(false)} />
          <div className="ci-theme-dropdown">
            <div className="ci-theme-header">
              <h4>🎨 Celestial Theme</h4>
              <p>Choose your cosmic atmosphere</p>
            </div>
            
            <div className="ci-theme-grid">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  className={`ci-theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                  style={{
                    '--theme-primary': theme.colors.primary,
                    '--theme-glow': theme.colors.glowPrimary,
                  } as React.CSSProperties}
                >
                  <div className="ci-theme-preview" style={{
                    background: `linear-gradient(135deg, ${theme.colors.bgNebula1}, ${theme.colors.bgNebula2})`,
                    borderColor: theme.colors.glassBorder,
                  }}>
                    <span className="ci-theme-preview-emoji">{theme.emoji}</span>
                    {currentTheme === theme.id && (
                      <div className="ci-theme-check">✓</div>
                    )}
                  </div>
                  <div className="ci-theme-info">
                    <span className="ci-theme-label">{theme.name}</span>
                    <span className="ci-theme-desc">{theme.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
