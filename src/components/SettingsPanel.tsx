/**
 * Settings Panel Component - Overlay Mode
 * 
 * UX Enhancement: Settings appear as a centered overlay modal
 * allowing users to see changes in real-time without content jumping.
 */

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setLocation, setSubRegion, toggleDisplay, toggleTimeMode, toggleAstroPreference, updateAstroPreferences, setGlobalNotificationsEnabled } from '../store';
import { LOCATIONS, SUB_REGIONS } from '../types';
import { CalendarNotificationSettings } from './notification/CalendarNotificationSettings';
import { NotificationHistory } from './notification/NotificationHistory';
import { ThemeSettings } from './ThemeSettings';
import { AISettingsPanel } from './AISettingsPanel';
import { useFeatureDiscovery, useSettingsTracking } from '../hooks/useGamification';
import { tutorialService } from '../services/tutorialService';

const GlobalNotificationSwitch: React.FC = () => {
  const dispatch = useDispatch();
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);

  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
      cursor: 'pointer',
      marginBottom: '12px',
    }}>
      <div style={{ flexShrink: 0 }}>
        <div style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: globalEnabled ? '#c9a227' : 'rgba(255,255,255,0.15)',
          position: 'relative',
          transition: 'all 0.2s',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: '2px',
            left: globalEnabled ? '22px' : '2px',
            transition: 'all 0.2s',
          }} />
        </div>
      </div>
      <input
        type="checkbox"
        checked={globalEnabled}
        onChange={() => dispatch(setGlobalNotificationsEnabled(!globalEnabled))}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#e0e0e0' }}>All Notifications</div>
        <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginTop: '2px' }}>
          {globalEnabled ? 'Notifications are enabled across all sections' : 'Notifications are paused — no alerts will be sent'}
        </div>
      </div>
    </label>
  );
};

interface SettingsPanelProps {
  onAuthClick?: () => void;
  onPureModeClick?: () => void;
  isPureMode?: boolean;
  monthHeaderSlot?: React.ReactNode;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onAuthClick, onPureModeClick, isPureMode, monthHeaderSlot }) => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.calendar.location);
  const auth = useSelector((state: RootState) => state.calendar.auth);
  const subRegion = useSelector((state: RootState) => state.calendar.subRegion);
  const display = useSelector((state: RootState) => state.calendar.display);
  const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
  const astroPreferences = useSelector((state: RootState) => state.calendar.astroPreferences);
  const { discover } = useFeatureDiscovery();
  const { trackLocation, trackDisplay } = useSettingsTracking();
  
  // Get available sub-regions for current location
  const availableSubRegions = SUB_REGIONS[location] || [];
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Close on click outside or escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <>
      {/* Toggle Buttons - 3 side by side with arc colors */}
      <div className="settings-toggle-wrapper">
        <button
          className="settings-toggle-btn"
          onClick={() => {
            discover('openedSettings');
            setIsOpen(true);
          }}
          aria-label="Open settings"
          style={{
            background: 'rgba(220, 38, 38, 0.15)',
            borderColor: 'rgba(220, 38, 38, 0.4)',
            color: '#fca5a5',
          }}
        >
          <span>⚙️</span> Show Settings
        </button>

        {onAuthClick && (
          <button
            className="settings-toggle-btn"
            onClick={onAuthClick}
            aria-label={auth.isAuthenticated ? 'Account' : 'Sign In'}
            style={{
              background: 'rgba(34, 197, 94, 0.15)',
              borderColor: 'rgba(34, 197, 94, 0.4)',
              color: '#86efac',
            }}
          >
            {auth.isAuthenticated ? (
              <>
                <span>{auth.displayName?.charAt(0) || auth.email?.charAt(0) || '?'}</span>
                <span>Account</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span>Sign In</span>
              </>
            )}
          </button>
        )}

        {onPureModeClick && (
          <button
            className="settings-toggle-btn"
            onClick={onPureModeClick}
            aria-label={isPureMode ? 'Exit Pure Mode' : 'Pure Mode'}
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              borderColor: 'rgba(124, 58, 237, 0.4)',
              color: '#c4b5fd',
            }}
          >
            <span>☯</span>
            {isPureMode ? 'Exit Pure' : 'Pure Mode'}
          </button>
        )}
      </div>

      {/* Overlay - Portal-like behavior using fixed positioning */}
      {isOpen && (
        <div className="settings-overlay-root">
          <div 
            className="settings-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            ref={panelRef} 
            className={`settings-modal ${isPureMode ? 'settings-modal--pure-mode' : ''}`}
            role="dialog"
            aria-label="Calendar Settings"
          >
            <div className="settings-modal__header">
              <div className="settings-modal__title">Calendar Settings</div>
              <button 
                className="settings-modal__close"
                onClick={() => setIsOpen(false)}
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>
            
            <div className="settings-modal__content">
              <div className="settings-grid">
                {/* Pure Mode: Full MonthHeader inside settings modal */}
                {isPureMode && monthHeaderSlot && (
                  <div className="settings-group settings-group--pure-header">
                    <label className="settings-group__label">🎛️ Calendar Controls</label>
                    <div className="settings-group__control settings-group__control--column">
                      {monthHeaderSlot}
                    </div>
                  </div>
                )}

                {/* Location - Only show dropdown when changing */}
                {isChangingLocation && (
                  <>
                    <div className="settings-group">
                      <label className="settings-group__label">📍 Select New Location</label>
                      <select 
                        value={location} 
                        onChange={(e) => {
                          const newLoc = e.target.value;
                          dispatch(setLocation(newLoc as any));
                          discover('changedLocation');
                          trackLocation(newLoc);
                          setIsChangingLocation(false);
                        }}
                      >
                        <optgroup label="Select region">
                          {Object.entries(LOCATIONS)
                            .filter(([code]) => code !== 'NONE' && code !== 'ALL')
                            .map(([code, data]) => (
                              <option key={code} value={code}>{data.name}</option>
                            ))}
                        </optgroup>
                      </select>
                    </div>
                    
                    {/* Sub-region (State/Province) */}
                    {availableSubRegions.length > 0 && (
                      <div className="settings-group">
                        <label className="settings-group__label">🏛️ State/Province</label>
                        <select 
                          value={subRegion || ''} 
                          onChange={(e) => {
                            const newSubRegion = e.target.value || null;
                            dispatch(setSubRegion(newSubRegion));
                            discover('changedSubRegion');
                            trackLocation(location, newSubRegion);
                          }}
                        >
                          <option value="">Default (Capital)</option>
                          {availableSubRegions.map((region) => (
                            <option key={region.code} value={region.code}>{region.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
                
                {/* Location Detection */}
                <div className="settings-group settings-group--note">
                  <p>
                    🌍 <strong>Current Location:</strong>{' '}
                    {subRegion && availableSubRegions.find(r => r.code === subRegion)?.name ? (
                      <>
                        {availableSubRegions.find(r => r.code === subRegion)?.name}, {LOCATIONS[location].name}
                      </>
                    ) : (
                      LOCATIONS[location].name
                    )}
                  </p>
                  {!isChangingLocation ? (
                    <button 
                      className="btn btn--sm"
                      onClick={() => setIsChangingLocation(true)}
                      title="Change your location"
                    >
                      🌏 Change Location
                    </button>
                  ) : (
                    <button 
                      className="btn btn--sm btn--active"
                      onClick={() => setIsChangingLocation(false)}
                    >
                      ✓ Keep Current Location
                    </button>
                  )}
                  <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '8px' }}>
                    💡 <strong>Tip:</strong> Swiss Ephemeris uses your location for celestial calculations. HEKA dates are universal worldwide.
                  </p>
                </div>
                
                {/* Celestial - hidden in Pure Mode */}
                {!isPureMode && (
                <div className="settings-group settings-group-celestial">
                  <label className="settings-group__label">✦ Celestial Cards</label>
                  <div className="settings-group__control">
                    <button 
                      className={`btn btn-celestial-toggle ${display.showCelestialCards ? 'btn--active' : ''}`} 
                      onClick={() => {
                        dispatch(toggleDisplay('showCelestialCards'));
                        if (!display.showCelestialCards) {
                          discover('enabledSeasonalEvents');
                          trackDisplay('showCelestialCards', true);
                        }
                        tutorialService.trackCelestialGuideToggle(!display.showCelestialCards);
                      }}
                    >
                      {display.showCelestialCards ? '✓ Show Celestial Cards' : 'Show Celestial Cards'}
                    </button>
                  </div>
                </div>
                )}
                
                {/* Mode */}
                <div className="settings-group">
                  <label className="settings-group__label">⚡ Mode</label>
                  <div className="settings-group__control">
                    <button className={`btn ${timeMode === 'SYNC' ? 'btn--active' : ''}`} onClick={() => timeMode !== 'SYNC' && dispatch(toggleTimeMode())}>
                      SYNC
                    </button>
                    <button className={`btn ${timeMode === 'TRUE' ? 'btn--active' : ''}`} onClick={() => timeMode !== 'TRUE' && dispatch(toggleTimeMode())}>
                      TRUE
                    </button>
                  </div>
                </div>
                
                {/* Theme Options - Expandable with Colors and Fonts */}
                <div className="settings-group">
                  <label className="settings-group__label">🎭 Theme Options</label>
                  <ThemeSettings />
                </div>
                
                {/* Astrology Settings - Calendar Display Only */}
                <div className="settings-group">
                  <label className="settings-group__label">✨ Astrology</label>
                  <div className="settings-group__control settings-group__control--stack">
                    <button
                      className={`btn ${astroPreferences.showTransitsOnCalendar ? 'btn--active' : ''}`}
                      onClick={() => dispatch(toggleAstroPreference('showTransitsOnCalendar'))}
                      title="Show moon signs and planetary transits in the day panel"
                    >
                      {astroPreferences.showTransitsOnCalendar ? '✓ ' : ''}Show on Day Panel
                    </button>
                    <button
                      className={`btn ${astroPreferences.showNakshatras ? 'btn--active' : ''}`}
                      onClick={() => dispatch(updateAstroPreferences({ showNakshatras: !astroPreferences.showNakshatras }))}
                      title="Show Lunar Mansions (Nakshatras) in TRUE mode"
                    >
                      {astroPreferences.showNakshatras ? '✓ ' : ''}Show Lunar Mansions
                    </button>
                  </div>
                  <p className="settings-group__hint">
                    Configure zodiac system and notification preferences in the ✨ Stars section
                  </p>
                </div>
                
                {/* AI Integration */}
                <div className="settings-group">
                  <label className="settings-group__label">🤖 HEKA AI</label>
                  <AISettingsPanel highlightArea="calendar" />
                </div>

                {/* Notifications */}
                <div className="settings-group">
                  <label className="settings-group__label">🔔 Notifications</label>
                  <GlobalNotificationSwitch />
                  <CalendarNotificationSettings />
                  <div style={{ marginTop: '12px' }}>
                    <NotificationHistory />
                  </div>
                </div>
                
                {/* Report Issue */}
                <div className="settings-group settings-group--footer">
                  <label className="settings-group__label">🐞 Found a Bug?</label>
                  <p>
                    Help us improve HEKA Calendar by reporting issues.
                  </p>
                  <button 
                    className="btn btn--sm"
                    onClick={() => {
                      const appVersion = '2.0.0';
                      const deviceInfo = typeof navigator !== 'undefined' 
                        ? `${navigator.platform} | ${navigator.userAgent.slice(0, 50)}...` 
                        : 'Unknown device';
                      const currentLocation = LOCATIONS[location]?.name || location;
                      const currentDate = new Date().toISOString();
                      
                      const subject = encodeURIComponent('HEKA Calendar Bug Report');
                      const body = encodeURIComponent(
                        `App Version: ${appVersion}\n` +
                        `Device: ${deviceInfo}\n` +
                        `Location: ${currentLocation}\n` +
                        `Date/Time: ${currentDate}\n` +
                        `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n\n` +
                        `Describe the issue:\n` +
                        `[Please describe what happened and what you expected]\n\n` +
                        `Steps to reproduce:\n` +
                        `1. \n` +
                        `2. \n` +
                        `3. \n\n` +
                        `Screenshots:\n` +
                        `[Attach if available]`
                      );
                      
                      window.location.href = `mailto:hekacalendar@gmail.com?subject=${subject}&body=${body}`;
                    }}
                  >
                    📧 Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;
