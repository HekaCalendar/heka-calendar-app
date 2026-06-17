/**
 * Calendar Notification Settings
 * Granular toggles for calendar-specific notifications.
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { updateNotificationPreferences } from '../../store';
import { requestNotificationPermission, hasNotificationPermission } from '../../services/notificationService';
import { useState, useEffect, useCallback } from 'react';

export const CalendarNotificationSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const prefs = useSelector((state: RootState) => state.calendar.notificationPreferences.calendar);
  const starsPrefs = useSelector((state: RootState) => state.calendar.notificationPreferences.stars);
  const plannerPrefs = useSelector((state: RootState) => state.calendar.notificationPreferences.planner);
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);
  const quietHours = useSelector((state: RootState) => state.calendar.notificationPreferences.quietHours);
  const [permission, setPermission] = useState<boolean>(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    setIsNativeApp(typeof window !== 'undefined' && !!(window as any).Capacitor);
    hasNotificationPermission().then(setPermission);
  }, []);

  const toggleCalendar = useCallback((key: keyof typeof prefs) => {
    dispatch(updateNotificationPreferences({
      section: 'calendar',
      prefs: { [key]: !prefs[key] }
    }));
  }, [dispatch, prefs]);

  const toggleStars = useCallback((key: keyof typeof starsPrefs) => {
    dispatch(updateNotificationPreferences({
      section: 'stars',
      prefs: { [key]: !starsPrefs[key] }
    }));
  }, [dispatch, starsPrefs]);

  const togglePlanner = useCallback((key: keyof typeof plannerPrefs) => {
    dispatch(updateNotificationPreferences({
      section: 'planner',
      prefs: { [key]: !plannerPrefs[key] }
    }));
  }, [dispatch, plannerPrefs]);

  const updateQuietHours = useCallback((patch: Partial<typeof quietHours>) => {
    dispatch(updateNotificationPreferences({
      section: 'quietHours',
      prefs: { ...quietHours, ...patch }
    }));
  }, [dispatch, quietHours]);

  const handleRequestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted);
  }, []);

  const Switch = ({ checked, onChange, label, description, tier }: { checked: boolean; onChange: () => void; label: string; description: string; tier?: string }) => {
    const isDisabled = !globalEnabled;
    const isOn = checked && globalEnabled;
    return (
    <label className="notif-setting-row" style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      cursor: isDisabled ? 'default' : 'pointer',
      opacity: globalEnabled ? 1 : 0.5,
    }}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <div style={{
          width: '40px',
          height: '22px',
          borderRadius: '11px',
          background: isOn ? '#c9a227' : 'rgba(255,255,255,0.15)',
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
            left: isOn ? '20px' : '2px',
            transition: 'all 0.2s',
          }} />
        </div>
      </div>
      <input
        type="checkbox"
        checked={isOn}
        onChange={onChange}
        disabled={isDisabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0' }}>{label}</span>
          {tier && (
            <span style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '2px 6px',
              borderRadius: '4px',
              background: tier === 'core' ? 'rgba(239,68,68,0.2)' : tier === 'standard' ? 'rgba(201,162,39,0.2)' : 'rgba(59,130,246,0.2)',
              color: tier === 'core' ? '#fca5a5' : tier === 'standard' ? '#fde68a' : '#93c5fd',
            }}>
              {tier}
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginTop: '2px' }}>{description}</div>
      </div>
    </label>
  );
  };

  return (
    <div className="calendar-notification-settings">
      {!permission && (
        <div style={{
          background: 'rgba(201,162,39,0.1)',
          border: '1px solid rgba(201,162,39,0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2C8.5 2 7.2 2.7 6.3 3.8C5.5 4.8 5 6.1 5 7.5C5 9.5 4.2 11.2 3 12.5C2.7 12.8 2.5 13.2 2.5 13.5C2.5 14.3 3.2 15 4 15H16C16.8 15 17.5 14.3 17.5 13.5C17.5 13.2 17.3 12.8 17 12.5C15.8 11.2 15 9.5 15 7.5C15 6.1 14.5 4.8 13.7 3.8C12.8 2.7 11.5 2 10 2Z" stroke="#c9a227" strokeWidth="1.5"/>
            <path d="M8 16.5C8 17.9 8.9 18.8 10 18.8C11.1 18.8 12 17.9 12 16.5" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>Enable Notifications</div>
            <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.6)' }}>
              {isNativeApp ? 'Allow HEKA to send you native notifications' : 'Allow browser notifications for reminders'}
            </div>
          </div>
          <button className="btn btn--sm btn--primary" onClick={handleRequestPermission}>
            Allow
          </button>
        </div>
      )}

      <div style={{ marginTop: '16px', marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quiet Hours</div>
        <Switch
          checked={quietHours.enabled}
          onChange={() => updateQuietHours({ enabled: !quietHours.enabled })}
          label="Do Not Disturb"
          description="Silence standard and ambient notifications during set hours. Core alerts always come through."
        />
        {quietHours.enabled && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', paddingLeft: '52px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginBottom: '4px' }}>Start</div>
              <select
                value={quietHours.start}
                onChange={(e) => updateQuietHours({ start: parseInt(e.target.value) })}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#e0e0e0',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '13px',
                }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginBottom: '4px' }}>End</div>
              <select
                value={quietHours.end}
                onChange={(e) => updateQuietHours({ end: parseInt(e.target.value) })}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#e0e0e0',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '13px',
                }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginBottom: '8px', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Calendar Alerts</div>
      <Switch
        checked={prefs.holidayReminders}
        onChange={() => toggleCalendar('holidayReminders')}
        label="Holiday Reminders"
        description="Get notified the day before public holidays in your region"
        tier="ambient"
      />
      <Switch
        checked={prefs.civilHekaTransition}
        onChange={() => toggleCalendar('civilHekaTransition')}
        label="Civil ↔ HEKA Transition"
        description="Gentle nudges as HEKA months end, helping you plan ahead of the civil calendar"
        tier="ambient"
      />
      <Switch
        checked={prefs.newYearReminders}
        onChange={() => toggleCalendar('newYearReminders')}
        label="New Year Reminder"
        description="A celebratory nudge when the civil year begins"
        tier="standard"
      />
      <Switch
        checked={prefs.solsticeEquinoxReminders}
        onChange={() => toggleCalendar('solsticeEquinoxReminders')}
        label="Solstice & Equinox"
        description="Notifications on the four turning points of the solar year"
        tier="standard"
      />
      <Switch
        checked={prefs.monthStartReminders}
        onChange={() => toggleCalendar('monthStartReminders')}
        label="Month Start"
        description="A welcome note at the beginning of each HEKA month"
        tier="ambient"
      />
      <Switch
        checked={prefs.noteReminders}
        onChange={() => toggleCalendar('noteReminders')}
        label="Note Reminders"
        description="Reminders for days with calendar notes"
        tier="standard"
      />

      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginBottom: '8px', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Celestial Alerts</div>
      <Switch
        checked={starsPrefs.newMoonReminders}
        onChange={() => toggleStars('newMoonReminders')}
        label="New Moon"
        description="Notification on the day of each new moon"
        tier="standard"
      />
      <Switch
        checked={starsPrefs.fullMoonReminders}
        onChange={() => toggleStars('fullMoonReminders')}
        label="Full Moon"
        description="Notification on the day of each full moon"
        tier="standard"
      />

      <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9a227', marginBottom: '8px', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Daily Briefing</div>
      <Switch
        checked={plannerPrefs.dailyBriefing}
        onChange={() => togglePlanner('dailyBriefing')}
        label="Daily Reminder"
        description="Your morning celestial briefing with lunar phase and pending intentions"
        tier="standard"
      />
    </div>
  );
};

export default CalendarNotificationSettings;
