/**
 * Journal Notification Settings
 * Toggles for tracker reminders, reflection prompts, and celestial insights.
 */

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { updateNotificationPreferences } from '../../store';

export const JournalNotificationSettings: React.FC = () => {
  const { t } = useTranslation('journal');
  const dispatch = useDispatch<AppDispatch>();
  const prefs = useSelector((state: RootState) => state.calendar.notificationPreferences.journal);
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);

  const toggle = (key: keyof typeof prefs) => {
    dispatch(updateNotificationPreferences({
      section: 'journal',
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
              {t('notifications.tier' + tier.charAt(0).toUpperCase() + tier.slice(1))}
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginTop: '2px' }}>{description}</div>
      </div>
    </label>
  );

  return (
    <div className="journal-notification-settings">
      <Switch
        checked={prefs.reflectionReminders}
        onChange={() => toggle('reflectionReminders')}
        label={t('notifications.reflectionReminders')}
        description={t('notifications.reflectionRemindersDesc')}
        tier="standard"
      />
      <Switch
        checked={prefs.dailyReflectionPrompt}
        onChange={() => toggle('dailyReflectionPrompt')}
        label={t('notifications.dailyReflectionPrompt')}
        description={t('notifications.dailyReflectionPromptDesc')}
        tier="standard"
      />
      <Switch
        checked={prefs.celestialInsightAlert}
        onChange={() => toggle('celestialInsightAlert')}
        label={t('notifications.celestialInsightAlerts')}
        description={t('notifications.celestialInsightAlertsDesc')}
        tier="ambient"
      />
    </div>
  );
};

export default JournalNotificationSettings;
