/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION CHANNELS & ACTIONS
 * Android channel creation + action button definitions for all tiers.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import type { NotificationTier } from '../types/notifications';

interface CapacitorWindow {
  Capacitor?: {
    getPlatform?: () => string;
  };
}

const IS_NATIVE_APP = typeof (window as unknown as CapacitorWindow).Capacitor !== 'undefined';

// ── Channel Definitions ──────────────────────────────────────────────────────

export interface HekaChannel {
  id: string;
  name: string;
  description: string;
  importance: 1 | 2 | 3 | 4 | 5; // MIN=1, LOW=2, DEFAULT=3, HIGH=4, MAX=5
  sound?: string;
  vibration?: boolean;
  lights?: boolean;
  lightsColor?: string;
}

export const HEKA_CHANNELS: Record<string, HekaChannel> = {
  heka_core: {
    id: 'heka_core',
    name: 'Important Celestial Alerts',
    description: 'Critical events: void moon, retrograde shifts, task deadlines',
    importance: 5, // MAX — always breaks through
    sound: 'core_alert.wav',
    vibration: true,
    lights: true,
    lightsColor: '#ef4444',
  },
  heka_standard: {
    id: 'heka_standard',
    name: 'Daily Celestial Updates',
    description: 'Daily briefing, celestial tips, streak reminders, reflections',
    importance: 4, // HIGH — prominent but not interrupting
    sound: 'standard_chime.wav',
    vibration: true,
    lights: true,
    lightsColor: '#c9a227',
  },
  heka_ambient: {
    id: 'heka_ambient',
    name: 'Gentle Celestial Nudges',
    description: 'Holiday reminders, moon degree updates, biodynamic cues',
    importance: 2, // LOW — quiet, minimal intrusion
    sound: 'ambient_soft.wav',
    vibration: false,
    lights: false,
  },
  heka_celebration: {
    id: 'heka_celebration',
    name: 'Celebrations & Milestones',
    description: 'Streak milestones, celestial event achievements, personal records',
    importance: 4, // HIGH — these are delightful moments
    sound: 'celebration_bell.wav',
    vibration: true,
    lights: true,
    lightsColor: '#10b981',
  },
};

// ── Action Definitions ───────────────────────────────────────────────────────

export interface HekaAction {
  id: string;
  title: string;
  destructive?: boolean;
  input?: boolean;
  inputPlaceholder?: string;
  inputButtonTitle?: string;
}

export const NOTIFICATION_ACTIONS: Record<string, HekaAction[]> = {
  'task-reminder': [
    { id: 'complete', title: 'Complete ✓' },
    { id: 'snooze-15', title: 'Snooze 15m' },
    { id: 'snooze-1h', title: 'Snooze 1h' },
    { id: 'dismiss', title: 'Dismiss', destructive: true },
  ],
  'daily-briefing': [
    { id: 'open-journal', title: 'Open Journal' },
    { id: 'snooze-30', title: 'Remind Later' },
    { id: 'dismiss', title: 'Dismiss', destructive: true },
  ],
  'streak-saver': [
    { id: 'open-planner', title: 'Open Planner' },
    { id: 'snooze-30', title: 'Snooze 30m' },
    { id: 'dismiss', title: 'Dismiss', destructive: true },
  ],
  'evening-reflection': [
    { id: 'open-journal', title: 'Reflect Now' },
    { id: 'snooze-1h', title: 'In 1 Hour' },
    { id: 'dismiss', title: 'Not Tonight', destructive: true },
  ],
  'daily-celestial-tips': [
    { id: 'open-stars', title: 'View Stars' },
    { id: 'dismiss', title: 'Dismiss', destructive: true },
  ],
  'friend-request': [
    { id: 'accept', title: 'Accept' },
    { id: 'decline', title: 'Decline', destructive: true },
  ],
  'task-assigned': [
    { id: 'accept', title: 'Accept' },
    { id: 'decline', title: 'Decline', destructive: true },
    { id: 'view', title: 'View' },
  ],
  'task-due-soon': [
    { id: 'complete', title: 'Mark Done' },
    { id: 'snooze-15', title: 'Snooze 15m' },
    { id: 'open-circle', title: 'Open' },
  ],
  'completion-celebration': [
    { id: 'share', title: 'Share ✦' },
    { id: 'open-planner', title: 'View Streak' },
    { id: 'dismiss', title: 'Dismiss', destructive: true },
  ],
  'reflection-reminder': [
    { id: 'open-journal', title: 'Log Now' },
    { id: 'snooze-1h', title: 'Later' },
    { id: 'dismiss', title: 'Skip', destructive: true },
  ],
  'void-moon-entered': [
    { id: 'open-stars', title: 'View Sky' },
    { id: 'dismiss', title: 'Dismiss', destructive: true },
  ],
  'void-moon-ended': [
    { id: 'open-stars', title: 'View Sky' },
    { id: 'dismiss', title: 'Dismiss', destructive: true },
  ],
  'retrograde-alert': [
    { id: 'open-stars', title: 'View Details' },
    { id: 'dismiss', title: 'Dismiss', destructive: true },
  ],
  'default': [
    { id: 'open', title: 'Open' },
    { id: 'dismiss', title: 'Dismiss', destructive: true },
  ],
};

// ── Channel Mapping ──────────────────────────────────────────────────────────

export function getChannelForTier(tier: NotificationTier): string {
  switch (tier) {
    case 'core': return HEKA_CHANNELS.heka_core.id;
    case 'standard': return HEKA_CHANNELS.heka_standard.id;
    case 'ambient': return HEKA_CHANNELS.heka_ambient.id;
    default: return HEKA_CHANNELS.heka_standard.id;
  }
}

export function getChannelForCelebration(): string {
  return HEKA_CHANNELS.heka_celebration.id;
}

export function getActionsForType(type: string): HekaAction[] {
  return NOTIFICATION_ACTIONS[type] || NOTIFICATION_ACTIONS['default'];
}

// ── Channel Initialization ───────────────────────────────────────────────────

let channelsInitialized = false;

export async function initializeNotificationChannels(): Promise<void> {
  if (!IS_NATIVE_APP || channelsInitialized) return;

  try {
    const platform = (window as unknown as CapacitorWindow).Capacitor?.getPlatform?.() || '';
    if (platform !== 'android') {
      channelsInitialized = true;
      return;
    }

    for (const channel of Object.values(HEKA_CHANNELS)) {
      await LocalNotifications.createChannel({
        id: channel.id,
        name: channel.name,
        description: channel.description,
        importance: channel.importance,
        sound: channel.sound,
        vibration: channel.vibration,
        lights: channel.lights,
        lightColor: channel.lightsColor,
      });
    }

    // Register action types
    const actionTypes = [];
    for (const [type, actions] of Object.entries(NOTIFICATION_ACTIONS)) {
      actionTypes.push({
        id: type,
        actions: actions.map(a => ({
          id: a.id,
          title: a.title,
          destructive: a.destructive || false,
          foreground: true, // Launch app when tapped
        })),
      });
    }

    await LocalNotifications.registerActionTypes({ types: actionTypes });

    channelsInitialized = true;
    console.log('[NotificationChannels] Android channels and actions registered');
  } catch (e) {
    console.error('[NotificationChannels] Failed to initialize:', e);
  }
}
