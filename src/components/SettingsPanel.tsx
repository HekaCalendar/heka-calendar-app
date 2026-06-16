/**
 * Settings Panel Component - Overlay Mode
 * 
 * UX Enhancement: Settings appear as a centered overlay modal
 * allowing users to see changes in real-time without content jumping.
 */

import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setLocation, setSubRegion, toggleDisplay, toggleTimeMode, toggleAstroPreference, updateAstroPreferences, setGlobalNotificationsEnabled, setNotificationMode, updateNotificationPreferences } from '../store';
import { setNotificationsEnabled } from '../store/setupSlice';
import { LOCATIONS, SUB_REGIONS, type CountryCode } from '../types';
import { CalendarNotificationSettings } from './notification/CalendarNotificationSettings';
import { StarsNotificationSettings } from './notification/StarsNotificationSettings';
import { JournalNotificationSettings } from './notification/JournalNotificationSettings';
import { UnifiedNotificationSettings } from './notification/UnifiedNotificationSettings';
import { NotificationHistory } from './notification/NotificationHistory';
import { TimePreferenceEditor } from './notification/TimePreferenceEditor';
import { VacationModeEditor } from './notification/VacationModeEditor';
import { FocusSchedulesEditor } from './notification/FocusSchedulesEditor';
import { ThemeSettings } from './ThemeSettings';
// Lazy-load the heavy AI settings panel so its providers/templates stay out of the initial bundle.
const AISettingsPanel = lazy(() => import('./AISettingsPanel').then((m) => ({ default: m.AISettingsPanel })));
import { useFeatureDiscovery, useSettingsTracking } from '../hooks/useGamification';
import { tutorialService } from '../services/tutorialService';
import { useTranslation } from 'react-i18next';

const GlobalNotificationSwitch: React.FC = () => {
  const dispatch = useDispatch();
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);
  const { t } = useTranslation('settings');

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
        onChange={() => {
          const next = !globalEnabled;
          dispatch(setGlobalNotificationsEnabled(next));
          dispatch(setNotificationsEnabled(next));
        }}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#e0e0e0' }}>{t('notificationSettings.allNotifications')}</div>
        <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginTop: '2px' }}>
          {globalEnabled ? t('notificationSettings.enabledDescription') : t('notificationSettings.pausedDescription')}
        </div>
      </div>
    </label>
  );
};

const NotificationModeSelector: React.FC = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.calendar.notificationPreferences.notificationMode);
  const { t } = useTranslation('settings');

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      padding: '4px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '10px',
      marginBottom: '16px',
    }}>
      {(['unified', 'custom'] as const).map((m) => (
        <button
          key={m}
          onClick={() => dispatch(setNotificationMode(m))}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            background: mode === m ? 'rgba(201,162,39,0.25)' : 'transparent',
            color: mode === m ? '#fde68a' : 'rgba(224,224,224,0.5)',
            fontSize: '13px',
            fontWeight: mode === m ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
          }}
        >
          {m === 'unified' ? `✨ ${t('notificationSettings.simple')}` : `⚙️ ${t('notificationSettings.custom')}`}
        </button>
      ))}
    </div>
  );
};

const NotificationSettingsBody: React.FC = () => {
  const mode = useSelector((state: RootState) => state.calendar.notificationPreferences.notificationMode);
  const adaptiveCaps = useSelector((state: RootState) => state.calendar.notificationPreferences.adaptiveCaps);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('settings');

  if (mode === 'unified') {
    return <UnifiedNotificationSettings />;
  }

  return (
    <div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('notificationSettings.calendarSection')}</div>
      <CalendarNotificationSettings />
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginTop: '20px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('notificationSettings.celestialSection')}</div>
      <StarsNotificationSettings />
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginTop: '20px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('notificationSettings.journalSection')}</div>
      <JournalNotificationSettings />
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginTop: '20px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('notificationSettings.circleSection')}</div>
      <p style={{ fontSize: '13px', color: 'rgba(224,224,224,0.5)', margin: '0 0 8px' }}>
        {t('notificationSettings.circleHint')}
      </p>

      {/* Custom Scheduling */}
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginTop: '24px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⏰ Custom Times</div>
      <TimePreferenceEditor />

      {/* Adaptive Caps */}
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginTop: '24px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🧠 Smart Limits</div>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 0',
        cursor: 'pointer',
      }}>
        <div style={{
          width: '40px',
          height: '22px',
          borderRadius: '11px',
          background: adaptiveCaps ? '#c9a227' : 'rgba(255,255,255,0.15)',
          position: 'relative',
          transition: 'all 0.2s',
        }}>
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: '2px',
            left: adaptiveCaps ? '20px' : '2px',
            transition: 'all 0.2s',
          }} />
        </div>
        <input
          type="checkbox"
          checked={adaptiveCaps}
          onChange={() => dispatch(updateNotificationPreferences({ section: 'adaptiveCaps', prefs: !adaptiveCaps }))}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0' }}>Adaptive Caps</div>
          <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginTop: '2px' }}>
            Automatically reduce notifications when you dismiss many in a row
          </div>
        </div>
      </label>

      {/* Focus Schedules */}
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginTop: '24px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎯 Focus Schedules</div>
      <FocusSchedulesEditor />

      {/* Vacation Mode */}
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginTop: '24px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🏖️ Vacation Mode</div>
      <VacationModeEditor />
    </div>
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
  const { t, i18n } = useTranslation('settings');
  const isEnglish = i18n.language === 'en';
  
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
          aria-label={t('openSettings')}
          style={{
            background: 'rgba(220, 38, 38, 0.15)',
            borderColor: 'rgba(220, 38, 38, 0.4)',
            color: '#fca5a5',
          }}
        >
          <span>⚙️</span> <span className="toggle-text">{t('controlPanel')}</span>
        </button>

        {onAuthClick && (
          <button
            className="settings-toggle-btn"
            onClick={onAuthClick}
            aria-label={auth.isAuthenticated ? t('account') : t('signIn')}
            style={{
              background: 'rgba(34, 197, 94, 0.15)',
              borderColor: 'rgba(34, 197, 94, 0.4)',
              color: '#86efac',
            }}
          >
            {auth.isAuthenticated ? (
              <>
                <span>{auth.displayName?.charAt(0) || auth.email?.charAt(0) || '?'}</span>
                <span className="toggle-text">{t('account')}</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span className="toggle-text">{t('signIn')}</span>
              </>
            )}
          </button>
        )}

        {onPureModeClick && (
          <button
            className="settings-toggle-btn"
            onClick={onPureModeClick}
            aria-label={isPureMode ? t('exitPureMode') : t('pureMode')}
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              borderColor: 'rgba(124, 58, 237, 0.4)',
              color: '#c4b5fd',
            }}
          >
            <span>☯</span>
            <span className="toggle-text">{isPureMode ? t('exitPure') : t('pureMode')}</span>
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
            className={`settings-modal ${isPureMode ? 'settings-modal--pure-mode' : ''} ${!isEnglish ? 'settings-modal--compact' : ''}`}
            role="dialog"
            aria-label={t('calendarSettingsTitle')}
          >
            <div className="settings-modal__header">
              <div className="settings-modal__title">{t('calendarSettingsTitle')}</div>
              <button 
                className="settings-modal__close"
                onClick={() => setIsOpen(false)}
                aria-label={t('closeSettings')}
              >
                ✕
              </button>
            </div>
            
            <div className="settings-modal__content">
              <div className="settings-grid">
                {/* Pure Mode: Full MonthHeader inside settings modal */}
                {isPureMode && monthHeaderSlot && (
                  <div className={`settings-group settings-group--pure-header ${!isEnglish ? 'settings-group--pure-header--compact' : ''}`}>
                    <label className="settings-group__label">🎛️ {t('calendarControls')}</label>
                    <div className="settings-group__control settings-group__control--column">
                      {monthHeaderSlot}
                    </div>
                  </div>
                )}

                {/* Location - Only show dropdown when changing */}
                {isChangingLocation && (
                  <>
                    <div className="settings-group">
                      <label className="settings-group__label">📍 {t('selectNewLocation')}</label>
                      <select 
                        value={location} 
                        onChange={(e) => {
                          const newLoc = e.target.value;
                          dispatch(setLocation(newLoc as CountryCode));
                          discover('changedLocation');
                          trackLocation(newLoc);
                          setIsChangingLocation(false);
                        }}
                      >
                        <optgroup label={t('selectRegion')}>
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
                        <label className="settings-group__label">🏛️ {t('stateProvince')}</label>
                        <select 
                          value={subRegion || ''} 
                          onChange={(e) => {
                            const newSubRegion = e.target.value || null;
                            dispatch(setSubRegion(newSubRegion));
                            discover('changedSubRegion');
                            trackLocation(location, newSubRegion);
                          }}
                        >
                          <option value="">{t('defaultCapital')}</option>
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
                    🌍 <strong>{t('currentLocation')}</strong>{' '}
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
                      title={t('changeYourLocation')}
                    >
                      🌏 {t('changeLocation')}
                    </button>
                  ) : (
                    <button 
                      className="btn btn--sm btn--active"
                      onClick={() => setIsChangingLocation(false)}
                    >
                      ✓ {t('keepCurrentLocation')}
                    </button>
                  )}
                  <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>
                    💡 <strong>{t('tip')}</strong> {t('locationTip')}
                  </p>
                </div>
                
                {/* Celestial - hidden in Pure Mode */}
                {!isPureMode && (
                <div className="settings-group settings-group-celestial">
                  <label className="settings-group__label">✦ {t('celestialCards')}</label>
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
                      {display.showCelestialCards ? `✓ ${t('showCelestialCards')}` : t('showCelestialCards')}
                    </button>
                  </div>
                </div>
                )}
                
                {/* Mode */}
                <div className="settings-group">
                  <label className="settings-group__label">⚡ {t('mode')}</label>
                  <div className="settings-group__control">
                    <button className={`btn ${timeMode === 'SYNC' ? 'btn--active' : ''}`} onClick={() => timeMode !== 'SYNC' && dispatch(toggleTimeMode())}>
                      {t('syncMode')}
                    </button>
                    <button className={`btn ${timeMode === 'TRUE' ? 'btn--active' : ''}`} onClick={() => timeMode !== 'TRUE' && dispatch(toggleTimeMode())}>
                      {t('trueMode')}
                    </button>
                  </div>
                </div>
                
                {/* Theme Options - Expandable with Colors and Fonts */}
                <div className="settings-group">
                  <label className="settings-group__label">🎭 {t('themeOptions')}</label>
                  <ThemeSettings />
                </div>
                
                {/* Astrology Settings - Calendar Display Only */}
                <div className="settings-group">
                  <label className="settings-group__label">✨ {t('astrology')}</label>
                  <div className="settings-group__control settings-group__control--stack">
                    <button
                      className={`btn ${astroPreferences.showTransitsOnCalendar ? 'btn--active' : ''}`}
                      onClick={() => dispatch(toggleAstroPreference('showTransitsOnCalendar'))}
                      title="Show moon signs and planetary transits in the day panel"
                    >
                      {astroPreferences.showTransitsOnCalendar ? '✓ ' : ''}{t('showOnDayPanel')}
                    </button>
                    <button
                      className={`btn ${astroPreferences.showNakshatras ? 'btn--active' : ''}`}
                      onClick={() => dispatch(updateAstroPreferences({ showNakshatras: !astroPreferences.showNakshatras }))}
                      title="Show Lunar Mansions (Nakshatras) in TRUE mode"
                    >
                      {astroPreferences.showNakshatras ? '✓ ' : ''}{t('showLunarMansions')}
                    </button>
                  </div>
                  <p className="settings-group__hint">
                    {t('astrologyHint')}
                  </p>
                </div>
                
                {/* AI Integration */}
                <div className="settings-group">
                  <label className="settings-group__label">🤖 {t('hekaAi')}</label>
                  <Suspense fallback={null}>
                    <AISettingsPanel highlightArea="calendar" />
                  </Suspense>
                </div>

                {/* Notifications */}
                <div className="settings-group">
                  <label className="settings-group__label">🔔 {t('notificationSettings.title')}</label>
                  <GlobalNotificationSwitch />
                  <NotificationModeSelector />
                  <NotificationSettingsBody />
                  <div style={{ marginTop: '12px' }}>
                    <NotificationHistory />
                  </div>
                </div>
                
                {/* Report Issue */}
                <div className="settings-group settings-group--footer">
                  <label className="settings-group__label">🐞 {t('foundABug')}</label>
                  <p>
                    {t('helpImprove')}
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
                    📧 {t('reportIssue')}
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
