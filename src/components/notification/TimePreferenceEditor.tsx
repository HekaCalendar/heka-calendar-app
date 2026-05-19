/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TIME PREFERENCE EDITOR — Per-notification-type scheduling
 * Allows users to customize when each notification type fires.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { updateNotificationPreferences } from '../../store';
import type { NotificationTimeKey, CustomTimeConfig } from '../../types/notifications';
import { DEFAULT_NOTIFICATION_TIME_PREFS } from '../../types/notifications';

const TIME_KEY_LABELS: Record<NotificationTimeKey, { label: string; emoji: string; description: string }> = {
  dailyBriefing: { label: 'Daily Briefing', emoji: '🌅', description: 'Your morning celestial overview' },
  dailyCelestialTips: { label: 'Daily Celestial Tips', emoji: '✨', description: 'Personalized cosmic guidance' },
  eveningReflection: { label: 'Evening Reflection', emoji: '🌙', description: 'Prompt to reflect on your day' },
  streakSaver: { label: 'Streak Saver', emoji: '🔥', description: 'Gentle nudge to keep your streak alive' },
  holidayReminders: { label: 'Holiday Reminders', emoji: '🎉', description: 'Upcoming holidays and observances' },
  fullMoonReminders: { label: 'Full Moon', emoji: '🌕', description: 'Full moon illumination alert' },
  newMoonReminders: { label: 'New Moon', emoji: '🌑', description: 'New moon intention-setting' },
  sunriseWakeUp: { label: 'Sunrise Wake-Up', emoji: '🌄', description: 'Gentle alarm at local sunrise' },
};

const ASTRONOMICAL_EVENTS = [
  { value: null as null, label: 'Fixed time' },
  { value: 'sunrise' as const, label: 'At sunrise 🌅' },
  { value: 'sunset' as const, label: 'At sunset 🌇' },
  { value: 'moonrise' as const, label: 'At moonrise 🌙' },
];

function formatTime(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayH = hour % 12 || 12;
  const displayM = minute.toString().padStart(2, '0');
  return `${displayH}:${displayM} ${ampm}`;
}

export const TimePreferenceEditor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customTimes = useSelector((state: RootState) => state.calendar.notificationPreferences.customTimes);
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);

  const updateTime = (key: NotificationTimeKey, patch: Partial<CustomTimeConfig>) => {
    const current = customTimes[key] || DEFAULT_NOTIFICATION_TIME_PREFS[key] || { hour: 8, minute: 0 };
    dispatch(updateNotificationPreferences({
      section: 'customTimes',
      prefs: { [key]: { ...current, ...patch } },
    }));
  };

  const resetToDefault = (key: NotificationTimeKey) => {
    dispatch(updateNotificationPreferences({
      section: 'customTimes',
      prefs: { [key]: DEFAULT_NOTIFICATION_TIME_PREFS[key] || { hour: 8, minute: 0 } },
    }));
  };

  return (
    <div className="time-preference-editor" style={{ opacity: globalEnabled ? 1 : 0.4 }}>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(224,224,224,0.5)' }}>
        Customize when each notification type is delivered. Times use your device timezone.
      </p>
      {(Object.keys(TIME_KEY_LABELS) as NotificationTimeKey[]).map((key) => {
        const config = customTimes[key] || DEFAULT_NOTIFICATION_TIME_PREFS[key] || { hour: 8, minute: 0 };
        const meta = TIME_KEY_LABELS[key];
        const isCustom = JSON.stringify(customTimes[key]) !== JSON.stringify(DEFAULT_NOTIFICATION_TIME_PREFS[key]);

        return (
          <div
            key={key}
            style={{
              padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px' }}>{meta.emoji}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#e0e0e0' }}>{meta.label}</span>
              {isCustom && (
                <span style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'rgba(201,162,39,0.2)',
                  color: '#fde68a',
                }}>
                  Custom
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginBottom: '8px' }}>
              {meta.description}
            </div>

            {/* Astronomical alignment */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {ASTRONOMICAL_EVENTS.map((event) => (
                <button
                  key={event.label}
                  disabled={!globalEnabled}
                  onClick={() => updateTime(key, { alignToEvent: event.value })}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    cursor: globalEnabled ? 'pointer' : 'default',
                    background: config.alignToEvent === event.value
                      ? 'rgba(201,162,39,0.25)'
                      : 'rgba(255,255,255,0.08)',
                    color: config.alignToEvent === event.value ? '#fde68a' : 'rgba(224,224,224,0.6)',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    transition: 'all 0.2s',
                  }}
                >
                  {event.label}
                </button>
              ))}
            </div>

            {/* Time picker (only when fixed time) */}
            {!config.alignToEvent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <select
                    disabled={!globalEnabled}
                    value={config.hour}
                    onChange={(e) => updateTime(key, { hour: parseInt(e.target.value) })}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#e0e0e0',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '13px',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>{formatTime(i, 0)}</option>
                    ))}
                  </select>
                  <span style={{ color: 'rgba(224,224,224,0.4)' }}>:</span>
                  <select
                    disabled={!globalEnabled}
                    value={config.minute}
                    onChange={(e) => updateTime(key, { minute: parseInt(e.target.value) })}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#e0e0e0',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '13px',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>

                {/* Weekend offset */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'rgba(224,224,224,0.6)',
                  cursor: globalEnabled ? 'pointer' : 'default',
                }}>
                  <input
                    type="checkbox"
                    disabled={!globalEnabled}
                    checked={config.weekendOffsetMinutes != null}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateTime(key, { weekendOffsetMinutes: 60 });
                      } else {
                        updateTime(key, { weekendOffsetMinutes: null });
                      }
                    }}
                    style={{ accentColor: '#c9a227' }}
                  />
                  Later on weekends
                </label>

                {config.weekendOffsetMinutes != null && (
                  <select
                    disabled={!globalEnabled}
                    value={config.weekendOffsetMinutes}
                    onChange={(e) => updateTime(key, { weekendOffsetMinutes: parseInt(e.target.value) })}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#e0e0e0',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {[30, 60, 90, 120, 180].map((m) => (
                      <option key={m} value={m}>+{m} min</option>
                    ))}
                  </select>
                )}

                {isCustom && (
                  <button
                    disabled={!globalEnabled}
                    onClick={() => resetToDefault(key)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(224,224,224,0.4)',
                      fontSize: '11px',
                      cursor: globalEnabled ? 'pointer' : 'default',
                      textDecoration: 'underline',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimePreferenceEditor;
