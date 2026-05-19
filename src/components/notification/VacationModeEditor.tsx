/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VACATION MODE EDITOR — Suppress non-essential notifications
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { updateNotificationPreferences } from '../../store';

const ALWAYS_ALLOWED_TYPES = [
  { key: 'streak-saver', label: 'Streak Saver', emoji: '🔥' },
  { key: 'streak-protection', label: 'Streak Protection', emoji: '🛡️' },
  { key: 'friend-request', label: 'Friend Requests', emoji: '👋' },
  { key: 'task-due-soon', label: 'Task Due Soon', emoji: '⏰' },
  { key: 'void-moon-entered', label: 'Void Moon Alert', emoji: '🌑' },
];

export const VacationModeEditor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const vacationMode = useSelector((state: RootState) => state.calendar.notificationPreferences.vacationMode);
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);

  const toggleEnabled = () => {
    dispatch(updateNotificationPreferences({
      section: 'vacationMode',
      prefs: { enabled: !vacationMode.enabled },
    }));
  };

  const setUntilDate = (date: string) => {
    dispatch(updateNotificationPreferences({
      section: 'vacationMode',
      prefs: { untilDate: date || null },
    }));
  };

  const toggleAllowedType = (type: string) => {
    const current = vacationMode.allowedTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    dispatch(updateNotificationPreferences({
      section: 'vacationMode',
      prefs: { allowedTypes: next },
    }));
  };

  return (
    <div className="vacation-mode-editor" style={{ opacity: globalEnabled ? 1 : 0.4 }}>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(224,224,224,0.5)' }}>
        Silence non-essential notifications while keeping what matters most.
      </p>

      {/* Main toggle */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        cursor: globalEnabled ? 'pointer' : 'default',
      }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: '44px',
            height: '24px',
            borderRadius: '12px',
            background: vacationMode.enabled && globalEnabled ? '#c9a227' : 'rgba(255,255,255,0.15)',
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
              left: vacationMode.enabled && globalEnabled ? '22px' : '2px',
              transition: 'all 0.2s',
            }} />
          </div>
        </div>
        <input
          type="checkbox"
          checked={vacationMode.enabled && globalEnabled}
          onChange={toggleEnabled}
          disabled={!globalEnabled}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#e0e0e0' }}>
            🏖️ Vacation Mode
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginTop: '2px' }}>
            {vacationMode.enabled ? 'Active — only allowed types will notify' : 'Paused — all enabled notifications fire normally'}
          </div>
        </div>
      </label>

      {/* Until date */}
      {vacationMode.enabled && (
        <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <label style={{ fontSize: '13px', color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>
            Auto-disable after:
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="date"
              disabled={!globalEnabled}
              value={vacationMode.untilDate || ''}
              onChange={(e) => setUntilDate(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#e0e0e0',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '13px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            />
            {vacationMode.untilDate && (
              <button
                disabled={!globalEnabled}
                onClick={() => setUntilDate('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(224,224,224,0.4)',
                  fontSize: '12px',
                  cursor: globalEnabled ? 'pointer' : 'default',
                  textDecoration: 'underline',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                Clear
              </button>
            )}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(224,224,224,0.4)', marginTop: '4px' }}>
            Leave blank to stay in vacation mode until manually turned off.
          </div>
        </div>
      )}

      {/* Allowed types */}
      {vacationMode.enabled && (
        <div style={{ padding: '12px 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#e0e0e0', marginBottom: '8px' }}>
            Still allow these notifications:
          </div>
          {ALWAYS_ALLOWED_TYPES.map((type) => (
            <label
              key={type.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 0',
                cursor: globalEnabled ? 'pointer' : 'default',
              }}
            >
              <input
                type="checkbox"
                disabled={!globalEnabled}
                checked={vacationMode.allowedTypes.includes(type.key)}
                onChange={() => toggleAllowedType(type.key)}
                style={{ accentColor: '#c9a227' }}
              />
              <span style={{ fontSize: '14px' }}>{type.emoji}</span>
              <span style={{ fontSize: '13px', color: '#e0e0e0' }}>{type.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default VacationModeEditor;
