/**
 * Theme Settings Component - Expandable section with Colors and Fonts
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../store';
import { setTheme, setFont, setHeaderGeometry, setBackgroundGeometry } from '../store';
import { THEME_LIST, FONT_LIST, HEADER_GEOMETRIES, BACKGROUND_GEOMETRIES, type ThemeId, type FontId, type GeometryPattern, type BackgroundGeometryPattern } from '../types/themes';
import { SacredGeometry } from './sacred-geometry/SacredGeometry';
import { useFeatureDiscovery, useSettingsTracking } from '../hooks/useGamification';
import { tutorialService } from '../services/tutorialService';

const geometryKeyMap: Record<string, string> = {
  'flower-of-life': 'geometryFlowerOfLife',
  'seed-of-life': 'geometrySeedOfLife',
  'metatrons-cube': 'geometryMetatronsCube',
  'sri-yantra': 'geometrySriYantra',
  'merkaba': 'geometryMerkaba',
  'fruit-of-life': 'geometryFruitOfLife',
  'golden-spiral': 'geometryGoldenSpiral',
  'hex-flower-grid': 'geometryHexFlowerGrid',
  'metatrons-lattice': 'geometryMetatronLattice',
  'sri-yantra-mandala': 'geometrySriYantraMandala',
  'torus-field': 'geometryTorusField',
  'tree-of-life': 'geometryTreeOfLife',
  'vesica-wave': 'geometryVesicaWave',
  'phyllotaxis-field': 'geometryPhyllotaxisField',
  'none': 'geometryNone',
};

export const ThemeSettings: React.FC = () => {
  const { t } = useTranslation('settings');
  const dispatch = useDispatch();
  const currentThemeId = useSelector((state: RootState) => state.calendar.theme);
  const currentFontId = useSelector((state: RootState) => state.calendar.font);
  const currentHeaderGeometry = useSelector((state: RootState) => state.calendar.headerGeometry);
  const currentBackgroundGeometry = useSelector((state: RootState) => state.calendar.backgroundGeometry);
  const { discover } = useFeatureDiscovery();
  const { trackTheme, trackFont } = useSettingsTracking();
  
  const [expandedSection, setExpandedSection] = useState<'colors' | 'fonts' | 'header' | 'background' | null>(null);
  
  const currentTheme = THEME_LIST.find(t => t.id === currentThemeId);
  const currentFont = FONT_LIST.find(f => f.id === currentFontId);
  const currentHeaderGeo = HEADER_GEOMETRIES.find(g => g.id === currentHeaderGeometry);
  const currentBackgroundGeo = BACKGROUND_GEOMETRIES.find(g => g.id === currentBackgroundGeometry);

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

  const handleHeaderGeometrySelect = (geo: GeometryPattern) => {
    dispatch(setHeaderGeometry(geo));
  };

  const handleBackgroundGeometrySelect = (geo: BackgroundGeometryPattern) => {
    dispatch(setBackgroundGeometry(geo));
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

      {/* Header Symbol Section */}
      <div className="theme-settings__section">
        <button
          className={`theme-settings__header ${expandedSection === 'header' ? 'theme-settings__header--active' : ''}`}
          onClick={() => setExpandedSection(expandedSection === 'header' ? null : 'header')}
        >
          <span className="theme-settings__icon">◈</span>
          <span className="theme-settings__title">{t('headerSymbol')}</span>
          <span className="theme-settings__current">
            {currentHeaderGeo?.icon} {t(geometryKeyMap[currentHeaderGeo?.id || ''] || '')}
          </span>
          <span className="theme-settings__arrow">
            {expandedSection === 'header' ? '▼' : '▶'}
          </span>
        </button>

        {expandedSection === 'header' && (
          <div className="theme-settings__content">
            <div className="geometry-grid">
              {HEADER_GEOMETRIES.map((geo) => (
                <button
                  key={geo.id}
                  className={`geometry-card ${currentHeaderGeometry === geo.id ? 'geometry-card--active' : ''}`}
                  onClick={() => handleHeaderGeometrySelect(geo.id as GeometryPattern)}
                  title={t(geometryKeyMap[geo.id])}
                >
                  <div className="geometry-card__preview">
                    <SacredGeometry pattern={geo.id} variant="header" />
                  </div>
                  <span className="geometry-card__name">{t(geometryKeyMap[geo.id])}</span>
                  {currentHeaderGeometry === geo.id && <span className="geometry-card__check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Background Pattern Section */}
      <div className="theme-settings__section">
        <button
          className={`theme-settings__header ${expandedSection === 'background' ? 'theme-settings__header--active' : ''}`}
          onClick={() => setExpandedSection(expandedSection === 'background' ? null : 'background')}
        >
          <span className="theme-settings__icon">〰️</span>
          <span className="theme-settings__title">{t('backgroundPattern')}</span>
          <span className="theme-settings__current">
            {currentBackgroundGeo?.icon} {t(geometryKeyMap[currentBackgroundGeo?.id || ''] || '')}
          </span>
          <span className="theme-settings__arrow">
            {expandedSection === 'background' ? '▼' : '▶'}
          </span>
        </button>

        {expandedSection === 'background' && (
          <div className="theme-settings__content">
            <div className="geometry-grid">
              {BACKGROUND_GEOMETRIES.map((geo) => (
                <button
                  key={geo.id}
                  className={`geometry-card ${currentBackgroundGeometry === geo.id ? 'geometry-card--active' : ''}`}
                  onClick={() => handleBackgroundGeometrySelect(geo.id as BackgroundGeometryPattern)}
                  title={geo.name}
                >
                  <div className="geometry-card__preview">
                    <SacredGeometry pattern={geo.id} variant="background" />
                  </div>
                  <span className="geometry-card__name">{geo.name}</span>
                  {currentBackgroundGeometry === geo.id && <span className="geometry-card__check">✓</span>}
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
