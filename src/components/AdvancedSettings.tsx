/**
 * Advanced Settings Modal
 * Custom month names, notifications, and personalization
 */

import { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import type { RootState } from '../store';
import { HEKA_MONTHS } from '../services/calendarService';

interface AdvancedSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_OPTIONS = [
  { id: 'new-year', label: 'HEKA New Year', description: 'Alert when HEKA year begins' },
  { id: 'new-moon', label: 'New Moon', description: 'Monthly new moon reminder' },
  { id: 'full-moon', label: 'Full Moon', description: 'Monthly full moon reminder' },
  { id: 'month-start', label: 'Month Start', description: 'Beginning of each HEKA month' },
  { id: 'solstice-equinox', label: 'Solstices & Equinoxes', description: 'Seasonal events' },
  { id: 'daily-reminder', label: 'Daily Reminder', description: 'Daily note reminder at selected time' },
];

const THEME_OPTIONS = [
  { id: 'dark-gold', name: 'Dark Gold', description: 'Premium gold on dark', color: '#d4af37' },
  { id: 'midnight-blue', name: 'Midnight Blue', description: 'Deep blue elegance', color: '#1e3a5f' },
  { id: 'forest-green', name: 'Forest Green', description: 'Natural earth tones', color: '#2d5016' },
  { id: 'royal-purple', name: 'Royal Purple', description: 'Mystical purple theme', color: '#5b21b6' },
  { id: 'crimson-red', name: 'Crimson', description: 'Bold crimson accents', color: '#991b1b' },
];

const FONT_OPTIONS = [
  { id: 'default', name: 'Default', family: 'Inter, system-ui, sans-serif' },
  { id: 'serif', name: 'Classic Serif', family: 'Georgia, Times New Roman, serif' },
  { id: 'mono', name: 'Monospace', family: 'JetBrains Mono, ui-monospace, monospace' },
  { id: 'elegant', name: 'Elegant', family: 'Cinzel, Georgia, serif' },
];

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ isOpen, onClose }) => {
  // const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'general' | 'months' | 'notifications' | 'appearance'>('general');
  
  // Custom month names
  const [customMonths, setCustomMonths] = useState<string[]>(HEKA_MONTHS.map(m => m.name));
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [tempMonthName, setTempMonthName] = useState('');
  
  // Notification settings
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    'new-year': true,
    'new-moon': false,
    'full-moon': true,
    'month-start': false,
    'solstice-equinox': true,
    'daily-reminder': false,
  });
  const [reminderTime, setReminderTime] = useState('20:00');
  
  // Appearance
  const [selectedTheme, setSelectedTheme] = useState('dark-gold');
  const [selectedFont, setSelectedFont] = useState('default');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  
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
    // Save all settings
    // dispatch(saveAdvancedSettings({...}));
    onClose();
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '600px', maxHeight: '80vh' }}>
        <div className="modal__header">
          <h2 className="modal__title">⚙️ Advanced Settings</h2>
          <button className="btn btn--icon" onClick={onClose}>×</button>
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
            <h3 className="settings-section-title">Calendar Behavior</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Week Start</label>
                <p>First day of the week in calendar view</p>
              </div>
              <select className="setting-select">
                <option value="saturday">Saturday (HEKA Standard)</option>
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
              </select>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Default View</label>
                <p>Calendar view when opening the app</p>
              </div>
              <select className="setting-select">
                <option value="month">Month View</option>
                <option value="year">Year Overview</option>
                <option value="last">Remember Last</option>
              </select>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Data Export</label>
                <p>Download all your calendar data</p>
              </div>
              <button className="btn">Export JSON</button>
            </div>
            
            <div className="setting-item danger">
              <div className="setting-info">
                <label>Clear All Data</label>
                <p>Permanently delete all notes and settings</p>
              </div>
              <button className="btn btn--danger">Delete Everything</button>
            </div>
          </div>
        )}
        
        {/* Month Names Tab */}
        {activeTab === 'months' && (
          <div className="settings-section">
            <div className="month-names-header">
              <h3 className="settings-section-title">Customize Month Names</h3>
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
                      <button className="btn btn--sm btn--primary" onClick={handleMonthSave}>✓</button>
                      <button className="btn btn--sm" onClick={handleMonthCancel}>×</button>
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
            <h3 className="settings-section-title">Notification Preferences</h3>
            
            {NOTIFICATION_OPTIONS.map(option => (
              <div key={option.id} className="notification-option">
                <div className="notification-info">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={notifications[option.id]}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        [option.id]: e.target.checked
                      })}
                    />
                    <span>{option.label}</span>
                  </label>
                  <p>{option.description}</p>
                </div>
              </div>
            ))}
            
            {notifications['daily-reminder'] && (
              <div className="reminder-time-setting">
                <label>Daily Reminder Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="settings-section">
            <h3 className="settings-section-title">Theme</h3>
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
                  <span className="theme-name">{theme.name}</span>
                  <span className="theme-description">{theme.description}</span>
                </button>
              ))}
            </div>
            
            <h3 className="settings-section-title">Typography</h3>
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
            
            <h3 className="settings-section-title">Custom Background</h3>
            <div className="custom-background">
              {customBackground ? (
                <div className="background-preview">
                  <img src={customBackground} alt="Custom background" />
                  <button className="btn btn--sm" onClick={() => setCustomBackground(null)}>
                    Remove
                  </button>
                </div>
              ) : (
                <div className="background-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="bg-upload"
                    hidden
                  />
                  <label htmlFor="bg-upload" className="btn">
                    Upload Image
                  </label>
                  <p>Recommended: 1920x1080 or larger</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="settings-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSaveAll}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
