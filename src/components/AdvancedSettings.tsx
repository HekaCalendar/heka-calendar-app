/**
 * Advanced Settings Modal
 * Custom month names, notifications, and personalization
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { HEKA_MONTHS } from '../services/calendarService';
import { CalendarNotificationSettings } from './notification/CalendarNotificationSettings';

interface AdvancedSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEME_OPTIONS = [
  { id: 'dark-gold', nameKey: 'themeDarkGold', descKey: 'themeDarkGoldDesc', color: '#d4af37' },
  { id: 'midnight-blue', nameKey: 'themeMidnightBlue', descKey: 'themeMidnightBlueDesc', color: '#1e3a5f' },
  { id: 'forest-green', nameKey: 'themeForestGreen', descKey: 'themeForestGreenDesc', color: '#2d5016' },
  { id: 'royal-purple', nameKey: 'themeRoyalPurple', descKey: 'themeRoyalPurpleDesc', color: '#5b21b6' },
  { id: 'crimson-red', nameKey: 'themeCrimson', descKey: 'themeCrimsonDesc', color: '#991b1b' },
];

const FONT_OPTIONS = [
  { id: 'default', name: 'Default', family: 'Inter, system-ui, sans-serif' },
  { id: 'serif', name: 'Classic Serif', family: 'Georgia, Times New Roman, serif' },
  { id: 'mono', name: 'Monospace', family: 'JetBrains Mono, ui-monospace, monospace' },
  { id: 'elegant', name: 'Elegant', family: 'Cinzel, Georgia, serif' },
];

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('settings');
  // const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'general' | 'months' | 'notifications' | 'appearance'>('general');
  
  // Custom month names
  const [customMonths, setCustomMonths] = useState<string[]>(HEKA_MONTHS.map(m => m.name));
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [tempMonthName, setTempMonthName] = useState('');
  

  
  // Appearance
  const [selectedTheme, setSelectedTheme] = useState('dark-gold');
  const [selectedFont, setSelectedFont] = useState('default');

  
  if (!isOpen) return null;
  
  const handleMonthEdit = (index: number) => {
    setEditingMonth(index);
    setTempMonthName(customMonths[index]);
  };
  
  const handleMonthSave = () => {
    if (editingMonth !== null && tempMonthName.trim()) {
      const newMonths = [...customMonths];
      newMonths[editingMonth] = tempMonthName.trim();
      setCustomMonths(newMonths);
      setEditingMonth(null);
    }
  };
  
  const handleMonthCancel = () => {
    setEditingMonth(null);
    setTempMonthName('');
  };
  
  const handleResetMonths = () => {
    if (confirm('Reset all month names to defaults?')) {
      setCustomMonths(HEKA_MONTHS.map(m => m.name));
    }
  };
  
  const handleSaveAll = () => {
    onClose();
  };
  
  
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '600px', maxHeight: '80vh' }}>
        <div className="modal__header">
          <h2 className="modal__title">⚙️ Advanced Settings</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label={t('closeSettings')}>×</button>
        </div>
        
        {/* Tabs */}
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button 
            className={`settings-tab ${activeTab === 'months' ? 'active' : ''}`}
            onClick={() => setActiveTab('months')}
          >
            Month Names
          </button>
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button 
            className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
        </div>
        
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="settings-section">
            <h3 className="settings-section-title">{t('calendarBehavior')}</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>{t('weekStart')}</label>
                <p>{t('weekStartDescription')}</p>
              </div>
              <select className="setting-select">
                <option value="saturday">{t('saturday')}</option>
                <option value="sunday">{t('sunday')}</option>
                <option value="monday">{t('monday')}</option>
              </select>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>{t('defaultView')}</label>
                <p>{t('defaultViewDescription')}</p>
              </div>
              <select className="setting-select">
                <option value="month">{t('monthView')}</option>
                <option value="year">{t('yearOverview')}</option>
                <option value="last">{t('rememberLast')}</option>
              </select>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>{t('dataExport')}</label>
                <p>{t('dataExportDescription')}</p>
              </div>
              <button className="btn">{t('exportJSON')}</button>
            </div>
            
            <div className="setting-item danger">
              <div className="setting-info">
                <label>{t('clearAllData')}</label>
                <p>{t('clearAllDataDescription')}</p>
              </div>
              <button className="btn btn--danger">{t('deleteEverything')}</button>
            </div>
          </div>
        )}
        
        {/* Month Names Tab */}
        {activeTab === 'months' && (
          <div className="settings-section">
            <div className="month-names-header">
              <h3 className="settings-section-title">{t('customizeMonthNames')}</h3>
              <button className="btn btn--sm" onClick={handleResetMonths}>
                Reset to Default
              </button>
            </div>
            
            <div className="month-names-list">
              {customMonths.map((name, index) => (
                <div key={index} className="month-name-item">
                  <span className="month-number">{index + 1}</span>
                  {editingMonth === index ? (
                    <div className="month-name-edit">
                      <input
                        type="text"
                        value={tempMonthName}
                        onChange={(e) => setTempMonthName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleMonthSave();
                          if (e.key === 'Escape') handleMonthCancel();
                        }}
                      />
                      <button className="btn btn--sm btn--primary" onClick={handleMonthSave} aria-label={t('common.save')}>✓</button>
                      <button className="btn btn--sm" onClick={handleMonthCancel} aria-label={t('close')}>×</button>
                    </div>
                  ) : (
                    <div className="month-name-display">
                      <span>{name}</span>
                      <button className="btn btn--sm" onClick={() => handleMonthEdit(index)}>
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h3 className="settings-section-title">{t('notificationPreferences')}</h3>
            <CalendarNotificationSettings />
          </div>
        )}
        
        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="settings-section">
            <h3 className="settings-section-title">{t('theme')}</h3>
            <div className="theme-grid">
              {THEME_OPTIONS.map(theme => (
                <button
                  key={theme.id}
                  className={`theme-option ${selectedTheme === theme.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div 
                    className="theme-preview"
                    style={{ background: theme.color }}
                  />
                  <span className="theme-name">{t(theme.nameKey)}</span>
                  <span className="theme-description">{t(theme.descKey)}</span>
                </button>
              ))}
            </div>
            
            <h3 className="settings-section-title">{t('typography')}</h3>
            <div className="font-options">
              {FONT_OPTIONS.map(font => (
                <button
                  key={font.id}
                  className={`font-option ${selectedFont === font.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFont(font.id)}
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </button>
              ))}
            </div>
            

          </div>
        )}
        
        {/* Footer */}
        <div className="settings-footer">
          <button className="btn" onClick={onClose}>{t('cancel')}</button>
          <button className="btn btn--primary" onClick={handleSaveAll}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
