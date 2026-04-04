/**
 * Celestial Font Selector
 * Dropdown font picker for the Observatory
 */

import React, { useState } from 'react';
import './FontSelector.css';

export type CelestialFontId = 'stellar' | 'cosmic' | 'nebula' | 'void' | 'oracle' | 'quantum';

const CELESTIAL_FONTS: { id: CelestialFontId; name: string; sample: string; emoji: string }[] = [
  { id: 'stellar', name: 'Stellar', sample: 'The stars align', emoji: '✦' },
  { id: 'cosmic', name: 'Cosmic', sample: 'Infinite wisdom', emoji: '☄' },
  { id: 'nebula', name: 'Nebula', sample: 'Dreams of space', emoji: '🌌' },
  { id: 'void', name: 'Void', sample: 'Deep mystery', emoji: '🌑' },
  { id: 'oracle', name: 'Oracle', sample: 'Ancient knowledge', emoji: '🔮' },
  { id: 'quantum', name: 'Quantum', sample: 'Future unfolds', emoji: '⚛' },
];

interface FontSelectorProps {
  currentFont: CelestialFontId;
  onFontChange: (font: CelestialFontId) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ 
  currentFont, 
  onFontChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = CELESTIAL_FONTS.find(f => f.id === currentFont) || CELESTIAL_FONTS[2];

  return (
    <div className="ci-font-selector" style={{ position: 'relative' }}>
      <button 
        className="ci-font-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="ci-font-emoji">{current.emoji}</span>
        <span className="ci-font-name">{current.name}</span>
        <span className={`ci-font-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <>
          <div className="ci-font-backdrop" onClick={() => setIsOpen(false)} />
          <div className="ci-font-dropdown">
            <div className="ci-font-header">
              <h4>✦ Celestial Font</h4>
              <p>Select the typeface for this realm</p>
            </div>
            
            <div className="ci-font-grid">
              {CELESTIAL_FONTS.map(font => (
                <button
                  key={font.id}
                  className={`ci-font-option ${currentFont === font.id ? 'active' : ''}`}
                  onClick={() => {
                    onFontChange(font.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="ci-font-preview">
                    <span className="ci-font-preview-emoji">{font.emoji}</span>
                    {currentFont === font.id && (
                      <div className="ci-font-check">✓</div>
                    )}
                  </div>
                  <div className="ci-font-info">
                    <span className="ci-font-label">{font.name}</span>
                    <span 
                      className="ci-font-sample" 
                      style={{ fontFamily: `var(--ci-font-${font.id})` }}
                    >
                      {font.sample}
                    </span>
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

export default FontSelector;
