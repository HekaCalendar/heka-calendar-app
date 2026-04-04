/**
 * Theme Settings Component - Expandable section with Colors and Fonts
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setTheme, setFont } from '../store';
import { THEME_LIST, FONT_LIST, type ThemeId, type FontId } from '../types/themes';
import { useFeatureDiscovery, useSettingsTracking } from '../hooks/useGamification';
import { tutorialService } from '../services/tutorialService';

export const ThemeSettings: React.FC = () => {
  const dispatch = useDispatch();
  const currentThemeId = useSelector((state: RootState) => state.calendar.theme);
  const currentFontId = useSelector((state: RootState) => state.calendar.font);
  const { discover } = useFeatureDiscovery();
  const { trackTheme, trackFont } = useSettingsTracking();
  
  const [expandedSection, setExpandedSection] = useState<'colors' | 'fonts' | null>(null);
  
  const currentTheme = THEME_LIST.find(t => t.id === currentThemeId);
  const currentFont = FONT_LIST.find(f => f.id === currentFontId);

  const handleThemeSelect = (themeId: ThemeId) => {
    dispatch(setTheme(themeId));
    discover('changedTheme');
    trackTheme(themeId);
    tutorialService.trackThemeSelection(themeId);
  };

  const handleFontSelect = (fontId: FontId) => {
    dispatch(setFont(fontId));
    discover('changedFont');
    trackFont(fontId);
  };

  return (
    <div className="theme-settings">
      {/* Colors Section */}
      <div className="theme-settings__section">
        <button 
          className={`theme-settings__header ${expandedSection === 'colors' ? 'theme-settings__header--active' : ''}`}
          onClick={() => setExpandedSection(expandedSection === 'colors' ? null : 'colors')}
        >
          <span className="theme-settings__icon">🎨</span>
          <span className="theme-settings__title">Colours</span>
          <span className="theme-settings__current">
            {currentTheme?.icon} {currentTheme?.name}
          </span>
          <span className="theme-settings__arrow">
            {expandedSection === 'colors' ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSection === 'colors' && (
          <div className="theme-settings__content">
            <div className="theme-grid">
              {THEME_LIST.map((theme) => (
                <button
                  key={theme.id}
                  className={`theme-card ${currentThemeId === theme.id ? 'theme-card--active' : ''}`}
                  onClick={() => handleThemeSelect(theme.id)}
                  title={theme.description}
                >
                  <div 
                    className="theme-card__preview"
                    style={{ background: theme.colors.gradientBg }}
                  >
                    <div className="theme-card__accents">
                      <span className="theme-card__dot" style={{ background: theme.colors.primary }} />
                      <span className="theme-card__dot" style={{ background: theme.colors.opening }} />
                      <span className="theme-card__dot" style={{ background: theme.colors.core }} />
                      <span className="theme-card__dot" style={{ background: theme.colors.closing }} />
                    </div>
                    <div 
                      className="theme-card__mode-preview"
                      style={{ 
                        background: `linear-gradient(90deg, ${theme.colors.sync} 50%, ${theme.colors.true} 50%)` 
                      }}
                    />
                  </div>
                  <div className="theme-card__info">
                    <span className="theme-card__icon">{theme.icon}</span>
                    <span className="theme-card__name">{theme.name}</span>
                    {currentThemeId === theme.id && <span className="theme-card__check">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fonts Section */}
      <div className="theme-settings__section">
        <button 
          className={`theme-settings__header ${expandedSection === 'fonts' ? 'theme-settings__header--active' : ''}`}
          onClick={() => setExpandedSection(expandedSection === 'fonts' ? null : 'fonts')}
        >
          <span className="theme-settings__icon">🔤</span>
          <span className="theme-settings__title">Fonts</span>
          <span className="theme-settings__current">
            {currentFont?.icon} {currentFont?.name}
          </span>
          <span className="theme-settings__arrow">
            {expandedSection === 'fonts' ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSection === 'fonts' && (
          <div className="theme-settings__content theme-settings__content--fonts">
            <div className="font-list">
              {FONT_LIST.map((font) => (
                <button
                  key={font.id}
                  className={`font-card ${currentFontId === font.id ? 'font-card--active' : ''}`}
                  onClick={() => handleFontSelect(font.id)}
                  title={font.description}
                >
                  <div className="font-card__preview" style={{ fontFamily: font.fonts.display }}>
                    <span className="font-card__sample">HEKA</span>
                  </div>
                  <div className="font-card__info">
                    <span className="font-card__icon">{font.icon}</span>
                    <span className="font-card__name">{font.name}</span>
                    <span className="font-card__desc" style={{ fontFamily: font.fonts.body }}>
                      {font.description}
                    </span>
                    {currentFontId === font.id && <span className="font-card__check">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSettings;
