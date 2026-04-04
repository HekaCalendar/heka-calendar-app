/**
 * Journal Settings Component
 * Theme and font customization for the HEKA Diary
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { 
  setJournalTheme, 
  setJournalFont, 
  setFontSize,
  toggleInsights,
  setInsightThreshold,
  updateJournalPreferences
} from '../store/diarySlice';
import { JOURNAL_THEMES, JOURNAL_FONTS, type JournalTheme, type JournalFont } from '../oracle/diaryTypes';
import '../styles/journal-settings.css';

interface JournalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

export const JournalSettings: React.FC<JournalSettingsProps> = ({ isOpen, onClose, theme = 'night' }) => {
  const dispatch = useDispatch();
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

  const handleExportPDF = () => {
    // Trigger PDF export
    window.dispatchEvent(new CustomEvent('export-diary-pdf'));
    onClose();
  };

  return (
    <div className={`journal-settings-overlay journal-theme-${safeTheme}`} onClick={onClose}>
      <div className={`journal-settings-modal journal-theme-${safeTheme}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="journal-settings-header">
          <h2 className="journal-settings-title">⚙️ Journal Settings</h2>
          <button className="journal-settings-close" onClick={onClose}>×</button>
        </div>

        <div className="journal-settings-content">
          {/* Theme Selection */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">📐 Page Theme</h3>
            <div className="journal-themes-grid">
              {JOURNAL_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  className={`journal-theme-card ${preferences.theme === theme.id ? 'active' : ''}`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  <span className="journal-theme-icon">{theme.icon}</span>
                  <span className="journal-theme-label">{theme.label}</span>
                  <span className="journal-theme-description">{theme.description}</span>
                  {preferences.theme === theme.id && (
                    <span className="journal-theme-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Font Selection */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">✒️ Handwriting Style</h3>
            <div className="journal-fonts-list">
              {JOURNAL_FONTS.map((font) => (
                <button
                  key={font.id}
                  className={`journal-font-option ${preferences.font === font.id ? 'active' : ''}`}
                  onClick={() => handleFontChange(font.id)}
                  style={{ fontFamily: font.cssValue }}
                >
                  <span className="journal-font-preview">Aa</span>
                  <div className="journal-font-info">
                    <span className="journal-font-name">{font.label}</span>
                    <span className="journal-font-description">{font.description}</span>
                  </div>
                  {preferences.font === font.id && (
                    <span className="journal-font-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Font Size */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">📏 Font Size</h3>
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

          {/* Oracle Insights */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">🔮 Oracle Insights</h3>
            
            <label className="journal-toggle">
              <input
                type="checkbox"
                checked={preferences.showInsights}
                onChange={() => dispatch(toggleInsights())}
              />
              <span className="journal-toggle-slider"></span>
              <span className="journal-toggle-label">
                Show celestial insights
                <small>Receive intelligent guidance based on your entries</small>
              </span>
            </label>

            {preferences.showInsights && (
              <div className="journal-threshold-control">
                <label>Insight Strength Threshold</label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={preferences.insightThreshold}
                  onChange={(e) => dispatch(setInsightThreshold(Number(e.target.value)))}
                />
                <div className="journal-threshold-labels">
                  <span>More insights</span>
                  <span>{preferences.insightThreshold}+</span>
                  <span>Stronger only</span>
                </div>
              </div>
            )}
          </section>

          {/* Auto-Save */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">💾 Auto-Save</h3>
            <label className="journal-toggle">
              <input
                type="checkbox"
                checked={preferences.autoSave}
                onChange={() => dispatch(updateJournalPreferences({ autoSave: !preferences.autoSave }))}
              />
              <span className="journal-toggle-slider"></span>
              <span className="journal-toggle-label">
                Auto-save entries
                <small>Every {preferences.autoSaveInterval / 1000} seconds</small>
              </span>
            </label>
          </section>

          {/* Export */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">📄 Export</h3>
            <button className="journal-export-btn" onClick={handleExportPDF}>
              <span>📥</span>
              <div>
                <strong>Export Diary as PDF</strong>
                <small>Beautiful formatted PDF with your chosen theme</small>
              </div>
            </button>
          </section>

          {/* Danger Zone */}
          <section className="journal-settings-section journal-settings-danger">
            <h3 className="journal-settings-section-title">⚠️ Danger Zone</h3>
            <button 
              className="journal-danger-btn"
              onClick={() => {
                if (confirm('Delete ALL diary entries? This cannot be undone.')) {
                  // Dispatch delete all action
                }
              }}
            >
              🗑️ Delete All Diary Entries
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
