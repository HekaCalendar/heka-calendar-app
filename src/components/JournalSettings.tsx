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
import { updateNotificationPreferences, setNotificationMode } from '../store';
import { useTranslation } from 'react-i18next';
import { JOURNAL_THEMES, JOURNAL_FONTS, type JournalTheme, type JournalFont } from '../oracle/diaryTypes';
import { MODULE_THEMES } from './oracle/config/themes';
import { AISettingsPanel } from './AISettingsPanel';
import { JournalNotificationSettings } from './notification/JournalNotificationSettings';
import '../styles/journal-settings.css';

const JournalNotificationArea: React.FC = () => {
  const { t } = useTranslation('journal');
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: RootState) => state.calendar.notificationPreferences.notificationMode);
  const prefs = useSelector((state: RootState) => state.calendar.notificationPreferences.journal);
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);

  const allOn = prefs.trackerReminders && prefs.dailyReflectionPrompt && prefs.celestialInsightAlert;

  const toggleAll = () => {
    const next = !allOn;
    dispatch(updateNotificationPreferences({
      section: 'journal',
      prefs: { trackerReminders: next, dailyReflectionPrompt: next, celestialInsightAlert: next }
    }));
  };

  if (mode === 'unified') {
    return (
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 0',
        cursor: globalEnabled ? 'pointer' : 'default',
        opacity: globalEnabled ? 1 : 0.4,
      }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: '40px', height: '22px', borderRadius: '11px',
            background: allOn && globalEnabled ? '#c9a227' : 'rgba(255,255,255,0.15)',
            position: 'relative', transition: 'all 0.2s',
          }}>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
              position: 'absolute', top: '2px',
              left: allOn && globalEnabled ? '20px' : '2px',
              transition: 'all 0.2s',
            }} />
          </div>
        </div>
        <input
          type="checkbox"
          checked={allOn && globalEnabled}
          onChange={toggleAll}
          disabled={!globalEnabled}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0' }}>{t('settings.journalNotifications')}</div>
          <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)' }}>
            {allOn ? t('settings.allAlertsEnabled') : t('settings.alertsPaused')}
          </div>
        </div>
        <button
          onClick={() => dispatch(setNotificationMode('custom'))}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: 'rgba(201,162,39,0.7)', fontSize: '12px', cursor: 'pointer',
          }}
        >
          {t('settings.customize')}
        </button>
      </label>
    );
  }

  return <JournalNotificationSettings />;
};

interface JournalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
  moduleTheme?: string;
  onModuleThemeChange?: (theme: string) => void;
}

export const JournalSettings: React.FC<JournalSettingsProps> = ({ isOpen, onClose, theme = 'night', moduleTheme = 'cosmic', onModuleThemeChange }) => {
  const { t } = useTranslation('journal');
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
    if (confirm(t('settings.deleteAllConfirm'))) {
      dispatch(clearAllDiaryEntries());
    }
  };

  return (
    <div className={`journal-settings-overlay journal-theme-${safeTheme}`} onClick={onClose}>
      <div className={`journal-settings-modal journal-theme-${safeTheme}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="journal-settings-header">
          <h2 className="journal-settings-title">{t('settings.title')}</h2>
          <button className="journal-settings-close" onClick={onClose}>×</button>
        </div>

        <div className="journal-settings-content" style={{ fontSize: `${preferences.fontSize}px` }}>
          {/* Appearance — combined themes + font */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">{t('settings.appearance')}</h3>

            <div className="journal-settings-row-label">{t('settings.atmosphere')}</div>
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

            <div className="journal-settings-row-label" style={{ marginTop: '10px' }}>{t('settings.pageTheme')}</div>
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
            <h3 className="journal-settings-section-title">{t('settings.typography')}</h3>

            <div className="journal-settings-row-label">{t('settings.handwriting')}</div>
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

            <div className="journal-settings-row-label" style={{ marginTop: '10px' }}>{t('settings.size')}</div>
            <div className="journal-font-size-control">
              <button
                className="journal-font-size-btn"
                onClick={() => dispatch(setFontSize(Math.max(12, preferences.fontSize - 2)))}
                disabled={preferences.fontSize <= 12}
              >
                {t('settings.fontSizeDown')}
              </button>
              <span className="journal-font-size-value">{preferences.fontSize}px</span>
              <button
                className="journal-font-size-btn"
                onClick={() => dispatch(setFontSize(Math.min(24, preferences.fontSize + 2)))}
                disabled={preferences.fontSize >= 24}
              >
                {t('settings.fontSizeUp')}
              </button>
            </div>
          </section>

          {/* Toggles — combined into one clean row */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">{t('settings.oracle')}</h3>

            <label className="journal-toggle journal-toggle--compact">
              <input
                type="checkbox"
                checked={preferences.showInsights}
                onChange={() => dispatch(toggleInsights())}
              />
              <span className="journal-toggle-slider"></span>
              <span className="journal-toggle-label">
                {t('settings.celestialInsights')}
                <small>{t('settings.celestialInsightsDescription')}</small>
              </span>
            </label>

            {preferences.showInsights && (
              <div className="journal-threshold-control">
                <div className="journal-threshold-header">
                  <span>{t('settings.strengthThreshold')}</span>
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
                  <span>{t('settings.more')}</span>
                  <span>{t('settings.stronger')}</span>
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
                {t('settings.autoSave')}
                <small>{t('settings.autoSaveInterval', { seconds: preferences.autoSaveInterval / 1000 })}</small>
              </span>
            </label>
          </section>

          {/* AI */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">{t('settings.ai')}</h3>
            <AISettingsPanel highlightArea="journal" />
          </section>

          {/* Notifications */}
          <section className="journal-settings-section">
            <h3 className="journal-settings-section-title">{t('settings.notifications')}</h3>
            <JournalNotificationArea />
          </section>

          {/* Danger Zone */}
          <section className="journal-settings-section journal-settings-danger">
            <button
              className="journal-danger-btn"
              onClick={handleClearAll}
            >
              {t('settings.deleteAllBtn')}
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="journal-settings-footer">
          <button className="journal-settings-done" onClick={onClose}>
            {t('settings.done')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalSettings;
