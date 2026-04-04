/**
 * Settings Panel Component - Overlay Mode
 * 
 * UX Enhancement: Settings appear as a centered overlay modal
 * allowing users to see changes in real-time without content jumping.
 */

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setLocation, setSubRegion, toggleDisplay, toggleTimeMode, toggleAstroPreference } from '../store';
import { LOCATIONS, SUB_REGIONS } from '../types';
import { NotificationSettings } from './NotificationSettings';
import { ThemeSettings } from './ThemeSettings';
import { useFeatureDiscovery, useSettingsTracking } from '../hooks/useGamification';
import { tutorialService } from '../services/tutorialService';

export const SettingsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.calendar.location);
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
      {/* Toggle Button - Always stays in normal flow */}
      <div className="settings-toggle-wrapper">
        <button 
          className="settings-toggle-btn"
          onClick={() => {
            discover('openedSettings');
            setIsOpen(true);
          }}
          aria-label="Open settings"
        >
          <span>⚙️</span> Show Settings
        </button>
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
            className="settings-modal"
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
                
                {/* Celestial */}
                <div className="settings-group settings-group-celestial">
                  <label className="settings-group__label">✦ Celestial Guide</label>
                  <div className="settings-group__control">
                    <button 
                      className={`btn btn-seasons-toggle ${display.showSeasonalEvents ? 'btn--active' : ''}`} 
                      onClick={() => {
                        dispatch(toggleDisplay('showSeasonalEvents'));
                        if (!display.showSeasonalEvents) {
                          discover('enabledSeasonalEvents');
                          trackDisplay('showSeasonalEvents', true);
                        }
                        tutorialService.trackCelestialGuideToggle(!display.showSeasonalEvents);
                      }}
                    >
                      {display.showSeasonalEvents ? '✓ Seasons' : 'Seasons'}
                    </button>
                    <button 
                      className={`btn btn-agri-toggle ${display.showAgriculturalGuidance ? 'btn--active' : ''}`} 
                      onClick={() => {
                        dispatch(toggleDisplay('showAgriculturalGuidance'));
                        tutorialService.trackCelestialGuideToggle(!display.showAgriculturalGuidance);
                      }}
                    >
                      {display.showAgriculturalGuidance ? '✓ Agri' : 'Agri'}
                    </button>
                    <button 
                      className={`btn btn-energy-toggle ${display.showEnergyForecast ? 'btn--active' : ''}`} 
                      onClick={() => {
                        dispatch(toggleDisplay('showEnergyForecast'));
                        if (!display.showEnergyForecast) {
                          discover('enabledEnergyVote');
                          trackDisplay('showEnergyForecast', true);
                        }
                        tutorialService.trackCelestialGuideToggle(!display.showEnergyForecast);
                      }}
                    >
                      {display.showEnergyForecast ? '✓ Energy' : 'Energy'}
                    </button>
                  </div>
                </div>
                
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
                      title="Show moon signs and planetary transits on calendar day panels"
                    >
                      {astroPreferences.showTransitsOnCalendar ? '✓ ' : ''}Show on Calendar
                    </button>
                  </div>
                  <p className="settings-group__hint">
                    Configure zodiac system and notification preferences in the ✨ Stars section
                  </p>
                </div>
                
                {/* Notifications */}
                <div className="settings-group">
                  <label className="settings-group__label">🔔 Notifications</label>
                  <NotificationSettings />
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
