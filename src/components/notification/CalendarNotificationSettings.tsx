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
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);
  const quietHours = useSelector((state: RootState) => state.calendar.notificationPreferences.quietHours);
  const [permission, setPermission] = useState<boolean>(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    setIsNativeApp(typeof window !== 'undefined' && !!(window as any).Capacitor);
    hasNotificationPermission().then(setPermission);
  }, []);

  const toggle = useCallback((key: keyof typeof prefs) => {
    dispatch(updateNotificationPreferences({
      section: 'calendar',
      prefs: { [key]: !prefs[key] }
    }));
  }, [dispatch, prefs]);

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

  const Switch = ({ checked, onChange, label, description, tier }: { checked: boolean; onChange: () => void; label: string; description: string; tier?: string }) => (
    <label className="notif-setting-row" style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer',
      opacity: globalEnabled && permission ? 1 : 0.5,
    }}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <div style={{
          width: '40px',
          height: '22px',
          borderRadius: '11px',
          background: checked && globalEnabled && permission ? '#c9a227' : 'rgba(255,255,255,0.15)',
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
            left: checked && globalEnabled && permission ? '20px' : '2px',
            transition: 'all 0.2s',
          }} />
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked && globalEnabled && permission}
        onChange={onChange}
        disabled={!globalEnabled || !permission}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0' }}>{label}</span>
          {tier && (
            <span style={{
              fontSize: '10px',
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
          <span style={{ fontSize: '18px' }}>🔔</span>
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
              <div style={{ fontSize: '11px', color: 'rgba(224,224,224,0.5)', marginBottom: '4px' }}>Start</div>
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
              <div style={{ fontSize: '11px', color: 'rgba(224,224,224,0.5)', marginBottom: '4px' }}>End</div>
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
        onChange={() => toggle('holidayReminders')}
        label="Holiday Reminders"
        description="Get notified the day before public holidays in your region"
        tier="ambient"
      />
      <Switch
        checked={prefs.civilHekaTransition}
        onChange={() => toggle('civilHekaTransition')}
        label="Civil ↔ HEKA Transition"
        description="Gentle nudges as HEKA months end, helping you plan ahead of the civil calendar"
        tier="ambient"
      />
      <Switch
        checked={prefs.moonPhaseDegrees}
        onChange={() => toggle('moonPhaseDegrees')}
        label="Moon Phase Degrees"
        description="Exact moon degree, sign, and astrological meaning notifications"
        tier="standard"
      />
      <Switch
        checked={prefs.noteReminders}
        onChange={() => toggle('noteReminders')}
        label="Note Reminders"
        description="Reminders for days with calendar notes"
        tier="standard"
      />
    </div>
  );
};

export default CalendarNotificationSettings;
