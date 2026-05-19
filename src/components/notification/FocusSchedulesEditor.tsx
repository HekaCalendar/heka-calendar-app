/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FOCUS SCHEDULES EDITOR — Filter notifications by tier during focus time
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { updateNotificationPreferences } from '../../store';
import type { FocusSchedule, NotificationTier } from '../../types/notifications';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIERS: { key: NotificationTier; label: string; color: string }[] = [
  { key: 'core', label: 'Core', color: '#ef4444' },
  { key: 'standard', label: 'Standard', color: '#c9a227' },
  { key: 'ambient', label: 'Ambient', color: '#3b82f6' },
];

function generateId(): string {
  return `fs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function formatTime(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayH = hour % 12 || 12;
  const displayM = minute.toString().padStart(2, '0');
  return `${displayH}:${displayM} ${ampm}`;
}

export const FocusSchedulesEditor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const schedules = useSelector((state: RootState) => state.calendar.notificationPreferences.focusSchedules);
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);
  const [isAdding, setIsAdding] = useState(false);
  const [newSchedule, setNewSchedule] = useState<FocusSchedule>({
    id: generateId(),
    name: '',
    enabled: true,
    allowedTiers: ['core'],
    daysOfWeek: [1, 2, 3, 4, 5],
    startHour: 9,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
  });

  const updateSchedules = (next: FocusSchedule[]) => {
    dispatch(updateNotificationPreferences({
      section: 'focusSchedules',
      prefs: next,
    }));
  };

  const toggleScheduleEnabled = (id: string) => {
    const next = schedules.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    updateSchedules(next);
  };

  const deleteSchedule = (id: string) => {
    updateSchedules(schedules.filter((s) => s.id !== id));
  };

  const toggleTier = (scheduleId: string, tier: NotificationTier) => {
    const next = schedules.map((s) => {
      if (s.id !== scheduleId) return s;
      const has = s.allowedTiers.includes(tier);
      return {
        ...s,
        allowedTiers: has
          ? s.allowedTiers.filter((t) => t !== tier)
          : [...s.allowedTiers, tier],
      };
    });
    updateSchedules(next);
  };

  const toggleDay = (scheduleId: string, day: number) => {
    const next = schedules.map((s) => {
      if (s.id !== scheduleId) return s;
      const has = s.daysOfWeek.includes(day);
      return {
        ...s,
        daysOfWeek: has
          ? s.daysOfWeek.filter((d) => d !== day)
          : [...s.daysOfWeek, day],
      };
    });
    updateSchedules(next);
  };

  const updateScheduleTime = (scheduleId: string, field: 'startHour' | 'startMinute' | 'endHour' | 'endMinute', value: number) => {
    const next = schedules.map((s) =>
      s.id === scheduleId ? { ...s, [field]: value } : s
    );
    updateSchedules(next);
  };

  const addSchedule = () => {
    if (!newSchedule.name.trim()) return;
    updateSchedules([...schedules, { ...newSchedule, id: generateId() }]);
    setIsAdding(false);
    setNewSchedule({
      id: generateId(),
      name: '',
      enabled: true,
      allowedTiers: ['core'],
      daysOfWeek: [1, 2, 3, 4, 5],
      startHour: 9,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
    });
  };

  return (
    <div className="focus-schedules-editor" style={{ opacity: globalEnabled ? 1 : 0.4 }}>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(224,224,224,0.5)' }}>
        Create time blocks where only certain notification tiers are allowed. Perfect for deep work or wind-down time.
      </p>

      {/* Existing schedules */}
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          style={{
            padding: '12px',
            marginBottom: '10px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '36px',
              height: '20px',
              borderRadius: '10px',
              background: schedule.enabled && globalEnabled ? '#c9a227' : 'rgba(255,255,255,0.15)',
              position: 'relative',
              transition: 'all 0.2s',
              cursor: globalEnabled ? 'pointer' : 'default',
            }}
              onClick={() => globalEnabled && toggleScheduleEnabled(schedule.id)}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '2px',
                left: schedule.enabled && globalEnabled ? '18px' : '2px',
                transition: 'all 0.2s',
              }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#e0e0e0', flex: 1 }}>
              {schedule.name}
            </span>
            <button
              disabled={!globalEnabled}
              onClick={() => deleteSchedule(schedule.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(239,68,68,0.6)',
                fontSize: '16px',
                cursor: globalEnabled ? 'pointer' : 'default',
              }}
            >
              ✕
            </button>
          </div>

          {/* Days */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {DAYS.map((day, idx) => (
              <button
                key={day}
                disabled={!globalEnabled}
                onClick={() => toggleDay(schedule.id, idx)}
                style={{
                  width: '32px',
                  height: '28px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: globalEnabled ? 'pointer' : 'default',
                  background: schedule.daysOfWeek.includes(idx)
                    ? 'rgba(201,162,39,0.25)'
                    : 'rgba(255,255,255,0.06)',
                  color: schedule.daysOfWeek.includes(idx) ? '#fde68a' : 'rgba(224,224,224,0.4)',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Time range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)' }}>From</span>
            <select
              disabled={!globalEnabled}
              value={schedule.startHour}
              onChange={(e) => updateScheduleTime(schedule.id, 'startHour', parseInt(e.target.value))}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#e0e0e0',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: '3px 6px',
                fontSize: '12px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{formatTime(i, 0)}</option>
              ))}
            </select>
            <span style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)' }}>to</span>
            <select
              disabled={!globalEnabled}
              value={schedule.endHour}
              onChange={(e) => updateScheduleTime(schedule.id, 'endHour', parseInt(e.target.value))}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#e0e0e0',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: '3px 6px',
                fontSize: '12px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{formatTime(i, 0)}</option>
              ))}
            </select>
          </div>

          {/* Allowed tiers */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {TIERS.map((tier) => (
              <button
                key={tier.key}
                disabled={!globalEnabled}
                onClick={() => toggleTier(schedule.id, tier.key)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: globalEnabled ? 'pointer' : 'default',
                  background: schedule.allowedTiers.includes(tier.key)
                    ? `${tier.color}33`
                    : 'rgba(255,255,255,0.06)',
                  color: schedule.allowedTiers.includes(tier.key) ? tier.color : 'rgba(224,224,224,0.4)',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Add new */}
      {!isAdding ? (
        <button
          disabled={!globalEnabled}
          onClick={() => setIsAdding(true)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px dashed rgba(255,255,255,0.15)',
            background: 'transparent',
            color: 'rgba(224,224,224,0.5)',
            fontSize: '13px',
            cursor: globalEnabled ? 'pointer' : 'default',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            transition: 'all 0.2s',
          }}
        >
          + Add Focus Schedule
        </button>
      ) : (
        <div style={{
          padding: '12px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <input
            type="text"
            placeholder="Schedule name (e.g. Deep Work)"
            value={newSchedule.name}
            onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              color: '#e0e0e0',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              padding: '8px 10px',
              fontSize: '13px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              marginBottom: '10px',
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={addSchedule}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(201,162,39,0.25)',
                color: '#fde68a',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(224,224,224,0.6)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusSchedulesEditor;
