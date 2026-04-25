/**
 * Journal Settings Component
 * Theme and font customization for the HEKA Diary
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  setJournalTheme, 
  setJournalFont, 
  setFontSize,
  toggleInsights,
  setInsightThreshold,
  updateJournalPreferences,
  clearAllDiaryEntries,
} from '../store/diarySlice';
import { JOURNAL_THEMES, JOURNAL_FONTS, type JournalTheme, type JournalFont } from '../oracle/diaryTypes';
import { MODULE_THEMES } from './oracle/config/themes';
import { AISettingsPanel } from './AISettingsPanel';
import { JournalNotificationSettings } from './notification/JournalNotificationSettings';
import '../styles/journal-settings.css';

interface JournalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
  moduleTheme?: string;
  onModuleThemeChange?: (theme: string) => void;
}

export const JournalSettings: React.FC<JournalSettingsProps> = ({ isOpen, onClose, theme = 'night', moduleTheme = 'cosmic', onModuleThemeChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const preferences = useSelector((state: RootState) => state.diary.preferences);

  if (!isOpen) return null;

  // Guard against object-type theme values
  const safeTheme = typeof theme === 'string' ? theme : 'night';

  const handleThemeChange = (theme: JournalTheme) => {
    dispatch(setJournalTheme(theme));
  };

  const handleFontChange = (font: JournalFont) => {
    dispatch(setJournalFont(font));
  };

  const handleClearAll = () => {
    if (confirm('Delete ALL diary entries? This cannot be undone.')) {
      dispatch(clearAllDiaryEntries());
    }
  };

  return (
    <div className={`journal-settings-overlay journal-theme-${safeTheme}`} onClick={onClose}>
      <div className={`journal-settings-modal journal-theme-${safeTheme}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="journal-settings-header">
          <h2 className="journal-settings-title">⚙️ Journal Settings</h2>
          <button className="journal-settings-close" onClick={onClose}>×</button>
        </div>

        <div className="journal-settings-content" style={{ fontSize: `${preferences.fontSize}px` }}>
          {/* Appearance — combined themes + font */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">🎨 Appearance</h3>

            <div className="journal-settings-row-label">Atmosphere</div>
            <div className="journal-themes-grid journal-themes-grid--compact">
              {MODULE_THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`journal-theme-card ${moduleTheme === t.id ? 'active' : ''}`}
                  onClick={() => onModuleThemeChange?.(t.id)}
                >
                  <span className="journal-theme-icon">{t.icon}</span>
                  <span className="journal-theme-label">{t.label}</span>
                  {moduleTheme === t.id && <span className="journal-theme-check">✓</span>}
                </button>
              ))}
            </div>

            <div className="journal-settings-row-label" style={{ marginTop: '10px' }}>Page Theme</div>
            <div className="journal-themes-grid journal-themes-grid--compact">
              {JOURNAL_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  className={`journal-theme-card ${preferences.theme === theme.id ? 'active' : ''}`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  <span className="journal-theme-icon">{theme.icon}</span>
                  <span className="journal-theme-label">{theme.label}</span>
                  {preferences.theme === theme.id && <span className="journal-theme-check">✓</span>}
                </button>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">✒️ Typography</h3>

            <div className="journal-settings-row-label">Handwriting</div>
            <div className="journal-fonts-list">
              {JOURNAL_FONTS.map((font) => (
                <button
                  key={font.id}
                  className={`journal-font-option ${preferences.font === font.id ? 'active' : ''}`}
                  onClick={() => handleFontChange(font.id)}
                  style={{ fontFamily: font.cssValue }}
                >
                  <span className="journal-font-preview">Aa</span>
                  <span className="journal-font-name">{font.label}</span>
                  {preferences.font === font.id && <span className="journal-font-check">✓</span>}
                </button>
              ))}
            </div>

            <div className="journal-settings-row-label" style={{ marginTop: '10px' }}>Size</div>
            <div className="journal-font-size-control">
              <button
                className="journal-font-size-btn"
                onClick={() => dispatch(setFontSize(Math.max(12, preferences.fontSize - 2)))}
                disabled={preferences.fontSize <= 12}
              >
                A-
              </button>
              <span className="journal-font-size-value">{preferences.fontSize}px</span>
              <button
                className="journal-font-size-btn"
                onClick={() => dispatch(setFontSize(Math.min(24, preferences.fontSize + 2)))}
                disabled={preferences.fontSize >= 24}
              >
                A+
              </button>
            </div>
          </section>

          {/* Toggles — combined into one clean row */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">🔮 Oracle</h3>

            <label className="journal-toggle journal-toggle--compact">
              <input
                type="checkbox"
                checked={preferences.showInsights}
                onChange={() => dispatch(toggleInsights())}
              />
              <span className="journal-toggle-slider"></span>
              <span className="journal-toggle-label">
                Celestial insights
                <small>Guidance based on your entries</small>
              </span>
            </label>

            {preferences.showInsights && (
              <div className="journal-threshold-control">
                <div className="journal-threshold-header">
                  <span>Strength threshold</span>
                  <span className="journal-threshold-value">{preferences.insightThreshold}+</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={preferences.insightThreshold}
                  onChange={(e) => dispatch(setInsightThreshold(Number(e.target.value)))}
                />
                <div className="journal-threshold-labels">
                  <span>More</span>
                  <span>Stronger</span>
                </div>
              </div>
            )}

            <label className="journal-toggle journal-toggle--compact">
              <input
                type="checkbox"
                checked={preferences.autoSave}
                onChange={() => dispatch(updateJournalPreferences({ autoSave: !preferences.autoSave }))}
              />
              <span className="journal-toggle-slider"></span>
              <span className="journal-toggle-label">
                Auto-save
                <small>Every {preferences.autoSaveInterval / 1000}s</small>
              </span>
            </label>
          </section>

          {/* AI */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">🤖 AI</h3>
            <AISettingsPanel highlightArea="journal" />
          </section>

          {/* Notifications */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">🔔 Notifications</h3>
            <JournalNotificationSettings />
          </section>

          {/* Danger Zone */}
          <section className="journal-settings-section journal-settings-danger">
            <button
              className="journal-danger-btn"
              onClick={handleClearAll}
            >
              🗑️ Delete All Entries
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="journal-settings-footer">
          <button className="journal-settings-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalSettings;
