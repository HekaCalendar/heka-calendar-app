/**
 * Themes V2 - ACCURATE (6 actual themes)
 */
import React from 'react';
import './elite-visuals.css';

export const ThemesV2: React.FC = () => {
  const themes = [
    { 
      id: 'egyptian-gold',
      name: 'Egyptian Gold', 
      icon: '🔱',
      desc: 'Ancient mystique with amber & lapis',
      color: '#d4af37',
      bg: '#070708'
    },
    { 
      id: 'cyberpunk-neon',
      name: 'Cyberpunk Neon', 
      icon: '⚡',
      desc: 'Electric magenta & cyan future',
      color: '#ff00ff',
      bg: '#0a0a0f'
    },
    { 
      id: 'nordic-frost',
      name: 'Nordic Frost', 
      icon: '❄️',
      desc: 'Clean ice blues with aurora',
      color: '#58a6ff',
      bg: '#0d1117'
    },
    { 
      id: 'solar-flare',
      name: 'Solar Flare', 
      icon: '☀️',
      desc: 'Burning cosmic orange energy',
      color: '#ff6b35',
      bg: '#0f0805'
    },
    { 
      id: 'void-walker',
      name: 'Void Walker', 
      icon: '🌑',
      desc: 'Eldritch dark ethereal purple',
      color: '#b8a1e0',
      bg: '#050508'
    },
    { 
      id: 'nature-spirit',
      name: 'Nature Spirit', 
      icon: '🌿',
      desc: 'Organic earth green tones',
      color: '#7cb342',
      bg: '#0a0f0a'
    },
  ];

  const fonts = [
    { name: 'Elegant', desc: 'Cinzel + Inter', icon: '✒️' },
    { name: 'Modern', desc: 'Clean geometric', icon: '◼️' },
    { name: 'Ancient', desc: 'Mystical runic', icon: 'ᚱ' },
    { name: 'Futuristic', desc: 'Tech mono', icon: '◈' },
    { name: 'Natural', desc: 'Organic feel', icon: '🍃' },
    { name: 'Minimalist', desc: 'Ultra clean', icon: '▪️' },
  ];

  return (
    <div className="elite-visual themes-v2">
      <div className="v2-themes-container">
        {/* Themes */}
        <div className="v2-section-title">6 Epic Themes</div>
        <div className="v2-themes-grid">
          {themes.map((theme) => (
            <div 
              key={theme.id}
              className="v2-theme-card"
              style={{ 
                background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.color}22 100%)`,
                borderColor: theme.color 
              }}
            >
              <div className="v2-theme-preview" style={{ background: theme.bg }}>
                <span style={{ color: theme.color, fontSize: '20px' }}>{theme.icon}</span>
              </div>
              <div className="v2-theme-name">{theme.name}</div>
              <div className="v2-theme-desc">{theme.desc}</div>
            </div>
          ))}
        </div>
        
        {/* Fonts */}
        <div className="v2-section-title">6 Font Styles</div>
        <div className="v2-fonts-row">
          {fonts.map((font) => (
            <div key={font.name} className="v2-font-item">
              <span className="v2-font-icon">{font.icon}</span>
              <span className="v2-font-name">{font.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
