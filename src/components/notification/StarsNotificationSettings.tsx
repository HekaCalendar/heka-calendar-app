/**
 * Stars Hub Notification Settings
 * Enhanced toggles for celestial notifications with void moon support.
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { updateNotificationPreferences } from '../../store';

export const StarsNotificationSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const prefs = useSelector((state: RootState) => state.calendar.notificationPreferences.stars);
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);

  const toggle = (key: keyof typeof prefs) => {
    dispatch(updateNotificationPreferences({
      section: 'stars',
      prefs: { [key]: !prefs[key] }
    }));
  };

  const Switch = ({ checked, onChange, label, description, tier }: { checked: boolean; onChange: () => void; label: string; description: string; tier?: string }) => (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      cursor: globalEnabled ? 'pointer' : 'default',
      opacity: globalEnabled ? 1 : 0.4,
    }}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <div style={{
          width: '40px',
          height: '22px',
          borderRadius: '11px',
          background: checked && globalEnabled ? '#c9a227' : 'rgba(255,255,255,0.15)',
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
            left: checked && globalEnabled ? '20px' : '2px',
            transition: 'all 0.2s',
          }} />
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked && globalEnabled}
        onChange={onChange}
        disabled={!globalEnabled}
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
    <div className="stars-notification-settings">
      <Switch
        checked={prefs.dailyCelestialTips}
        onChange={() => toggle('dailyCelestialTips')}
        label="Daily Celestial Tips"
        description="Personalized guidance delivered at 7:00 AM with rotating cosmic wisdom"
        tier="standard"
      />
      <Switch
        checked={prefs.retrogradeAlerts}
        onChange={() => toggle('retrogradeAlerts')}
        label="Retrograde Alerts"
        description="3-day advance warning when planets prepare to station retrograde"
        tier="ambient"
      />
      <Switch
        checked={prefs.voidMoonReminders}
        onChange={() => toggle('voidMoonReminders')}
        label="Void Moon Reminders"
        description="Notifications when the Moon goes void-of-course and when it enters a new sign"
        tier="core"
      />
      <Switch
        checked={prefs.moonDegreeNotifications}
        onChange={() => toggle('moonDegreeNotifications')}
        label="Moon Degree Notifications"
        description="Exact degree, sign, and meaning each time the Moon changes degree"
        tier="ambient"
      />
    </div>
  );
};

export default StarsNotificationSettings;
