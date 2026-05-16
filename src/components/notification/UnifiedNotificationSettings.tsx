/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * UNIFIED NOTIFICATION SETTINGS — Simple mode
 * 4 category toggles that control entire sections at once.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { updateNotificationPreferences } from '../../store';
import type { NotificationSection } from '../../types/notifications';

interface CategoryDef {
  section: NotificationSection | NotificationSection[];
  emoji: string;
  label: string;
  description: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    section: ['stars', 'planner'],
    emoji: '🌟',
    label: 'Celestial',
    description: 'Daily tips, retrograde alerts, void moon, task reminders & briefings',
  },
  {
    section: 'calendar',
    emoji: '📅',
    label: 'Calendar',
    description: 'Holiday reminders, HEKA transitions & note reminders',
  },
  {
    section: 'journal',
    emoji: '📜',
    label: 'Journal',
    description: 'Tracker nudges, reflection prompts & celestial insights',
  },
  {
    section: 'circle',
    emoji: '🔮',
    label: 'Circle',
    description: 'Friend requests, task assignments & due reminders',
  },
];

function getAllKeys(section: NotificationSection): string[] {
  switch (section) {
    case 'calendar':
      return ['holidayReminders', 'civilHekaTransition', 'noteReminders', 'newYearReminders', 'solsticeEquinoxReminders', 'monthStartReminders'];
    case 'stars':
      return ['dailyCelestialTips', 'retrogradeAlerts', 'voidMoonReminders', 'moonDegreeNotifications', 'newMoonReminders', 'fullMoonReminders'];
    case 'circle':
      return ['friendRequests', 'taskRequests', 'taskDueReminders'];
    case 'journal':
      return ['trackerReminders', 'dailyReflectionPrompt', 'celestialInsightAlert'];
    case 'planner':
      return ['taskReminders', 'dailyBriefing', 'streakSaver', 'completionCelebrations', 'complementaryTasks'];
    default:
      return [];
  }
}

export const UnifiedNotificationSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const prefs = useSelector((state: RootState) => state.calendar.notificationPreferences);
  const globalEnabled = prefs.globalEnabled;

  const isCategoryOn = (section: NotificationSection | NotificationSection[]): boolean => {
    const sections = Array.isArray(section) ? section : [section];
    return sections.every((s) => {
      const keys = getAllKeys(s);
      const sectionPrefs = prefs[s] as unknown as Record<string, boolean>;
      return keys.every((k) => sectionPrefs[k] === true);
    });
  };

  const toggleCategory = (section: NotificationSection | NotificationSection[]) => {
    const sections = Array.isArray(section) ? section : [section];
    const currentlyOn = isCategoryOn(section);
    const nextValue = !currentlyOn;

    sections.forEach((s) => {
      const keys = getAllKeys(s);
      const patch: Record<string, boolean> = {};
      keys.forEach((k) => { patch[k] = nextValue; });
      dispatch(updateNotificationPreferences({ section: s, prefs: patch }));
    });
  };

  const Switch = ({ checked, onChange, label, description, emoji }: {
    checked: boolean; onChange: () => void; label: string; description: string; emoji: string;
  }) => (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      cursor: globalEnabled ? 'pointer' : 'default',
      opacity: globalEnabled ? 1 : 0.4,
    }}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <div style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: checked && globalEnabled ? '#c9a227' : 'rgba(255,255,255,0.15)',
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
            left: checked && globalEnabled ? '22px' : '2px',
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
          <span style={{ fontSize: '16px' }}>{emoji}</span>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '2px 8px',
            borderRadius: '4px',
            background: checked ? 'rgba(201,162,39,0.2)' : 'rgba(255,255,255,0.08)',
            color: checked ? '#fde68a' : 'rgba(224,224,224,0.4)',
            transition: 'all 0.2s',
          }}>
            {checked ? 'ON' : 'OFF'}
          </span>
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(224,224,224,0.5)', marginTop: '3px' }}>{description}</div>
      </div>
    </label>
  );

  return (
    <div className="unified-notification-settings">
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(224,224,224,0.5)' }}>
        Toggle entire categories on or off. Switch to Custom for granular control.
      </p>
      {CATEGORIES.map((cat) => (
        <Switch
          key={cat.label}
          emoji={cat.emoji}
          label={cat.label}
          description={cat.description}
          checked={isCategoryOn(cat.section)}
          onChange={() => toggleCategory(cat.section)}
        />
      ))}
    </div>
  );
};

export default UnifiedNotificationSettings;
