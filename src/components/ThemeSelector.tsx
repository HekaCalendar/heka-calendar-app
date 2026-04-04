/**
 * Theme Selector Component - Compact Dropdown
 * Color theme selection with visual preview
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setTheme } from '../store';
import { THEME_LIST, type ThemeId } from '../types/themes';

export const ThemeSelector: React.FC = () => {
  const dispatch = useDispatch();
  const currentThemeId = useSelector((state: RootState) => state.calendar.theme);
  const currentTheme = THEME_LIST.find(t => t.id === currentThemeId);

  const handleThemeSelect = (themeId: ThemeId) => {
    dispatch(setTheme(themeId));
  };

  return (
    <div className="theme-selector-compact">
      <div className="theme-selector__current">
        <select 
          value={currentThemeId} 
          onChange={(e) => handleThemeSelect(e.target.value as ThemeId)}
          className="theme-selector__select"
        >
          {THEME_LIST.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.icon} {theme.name}
            </option>
          ))}
        </select>
        <div className="theme-selector__preview-bar">
          <span 
            className="theme-selector__color-dot" 
            style={{ background: currentTheme?.colors.primary }}
            title="Primary"
          />
          <span 
            className="theme-selector__color-dot" 
            style={{ background: currentTheme?.colors.opening }}
            title="Opening Arc"
          />
          <span 
            className="theme-selector__color-dot" 
            style={{ background: currentTheme?.colors.core }}
            title="Core Arc"
          />
          <span 
            className="theme-selector__color-dot" 
            style={{ background: currentTheme?.colors.closing }}
            title="Closing Arc"
          />
          <span 
            className="theme-selector__mode-split"
            style={{ 
              background: `linear-gradient(90deg, ${currentTheme?.colors.sync} 50%, ${currentTheme?.colors.true} 50%)` 
            }}
            title="SYNC | TRUE"
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
