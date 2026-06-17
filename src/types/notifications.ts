/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION TYPE DEFINITIONS
 * Unified intelligent notification system for HEKA Calendar
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ── Tiers ────────────────────────────────────────────────────────────────────

export type NotificationTier = 'core' | 'standard' | 'ambient';

export const TIER_DAILY_CAPS: Record<NotificationTier, number> = {
  core: Infinity,
  standard: 3,
  ambient: 2,
};

export const TIER_PRIORITY: Record<NotificationTier, number> = {
  core: 3,
  standard: 2,
  ambient: 1,
};

// ── Sections ─────────────────────────────────────────────────────────────────

export type NotificationSection = 'calendar' | 'stars' | 'circle' | 'journal' | 'planner';

// ── Notification Request (engine input) ──────────────────────────────────────

export interface NotificationRequest {
  type: string;
  tier: NotificationTier;
  title: string;
  body: string;
  scheduleAt: Date;
  id?: number;
  extra?: Record<string, any>;
  section: NotificationSection;
  /** If true, this notification can replace a previously scheduled one of the same type */
  replaceExisting?: boolean;
  /** Optional dedup key override. Used when multiple sub-types share the same type string
   *  (e.g. tracker reminders for different trackers, holiday reminders for different holidays).
   *  Defaults to req.type if not provided. */
  dedupKey?: string;
  /** Android notification channel ID (auto-mapped from tier if not provided) */
  channelId?: string;
  /** Action type ID for action buttons (defaults to type) */
  actionTypeId?: string;
  // ── Rich Notification Fields ─────────────────────────────────────────────
  /** Multiline text block for big-text notification style (Android) */
  largeBody?: string;
  /** Summary text for inbox/big-text styles (Android) */
  summaryText?: string;
  /** Inbox-style list items (Android, max 5) */
  inboxList?: string[];
  /** Large icon drawable name (Android) */
  largeIcon?: string;
  /** Image attachments (uses res:// or file:// scheme) */
  attachments?: Array<{ id: string; url: string }>;
  /** Notification group key (Android) */
  group?: string;
  /** Whether this is a group summary (Android) */
  groupSummary?: boolean;
}

export interface DeliveredNotification {
  id: string;
  type: string;
  tier: NotificationTier;
  section: NotificationSection;
  title: string;
  body: string;
  deliveredAt: number; // timestamp when scheduled (legacy name — kept for backward compat)
  confirmedDeliveredAt?: number; // timestamp when OS actually fired the notification
  extra?: Record<string, any>;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  counts: Record<NotificationTier, number>;
  delivered: DeliveredNotification[];
  tapped: DeliveredNotification[];
}

// ── Template System ──────────────────────────────────────────────────────────

export interface NotificationTemplate {
  title: string;
  body: string;
  /** Optional condition function name (resolved at runtime) */
  condition?: string;
}

export type TemplateLibrary = Record<string, NotificationTemplate[]>;

// ── Per-Section Preferences ──────────────────────────────────────────────────

export interface CalendarNotificationPrefs {
  holidayReminders: boolean;
  civilHekaTransition: boolean;
  noteReminders: boolean;
  newYearReminders: boolean;
  solsticeEquinoxReminders: boolean;
  monthStartReminders: boolean;
}

export interface StarsNotificationPrefs {
  dailyCelestialTips: boolean;
  retrogradeAlerts: boolean;
  voidMoonReminders: boolean;
  moonDegreeNotifications: boolean;
  newMoonReminders: boolean;
  fullMoonReminders: boolean;
  sunriseWakeUp: boolean;
}

export interface CircleNotificationPrefs {
  friendRequests: boolean;
  taskRequests: boolean;
  taskDueReminders: boolean;
}

export interface JournalNotificationPrefs {
  reflectionReminders: boolean;
  dailyReflectionPrompt: boolean;
  celestialInsightAlert: boolean;
}

export interface PlannerNotificationPrefs {
  taskReminders: boolean;
  dailyBriefing: boolean;
  streakSaver: boolean;
  completionCelebrations: boolean;
  complementaryTasks: boolean;
}

export interface QuietHoursConfig {
  enabled: boolean;
  start: number; // 0-23, e.g. 22 for 10 PM
  end: number;   // 0-23, e.g. 7 for 7 AM
}

export interface VacationMode {
  enabled: boolean;
  untilDate: string | null; // ISO date YYYY-MM-DD
  /** Types that are allowed even in vacation mode (e.g. 'streak-saver') */
  allowedTypes: string[];
}

export interface FocusSchedule {
  id: string;
  name: string;
  enabled: boolean;
  /** Only these tiers are allowed during focus time */
  allowedTiers: NotificationTier[];
  /** 0 = Sunday, 6 = Saturday */
  daysOfWeek: number[];
  startHour: number; // 0-23
  startMinute: number; // 0-59
  endHour: number; // 0-23
  endMinute: number; // 0-59
}

export interface CustomTimeConfig {
  hour: number;
  minute: number;
  /** Offset in minutes for weekend (null = same as weekday) */
  weekendOffsetMinutes?: number | null;
  /** Align to astronomical event instead of fixed time */
  alignToEvent?: 'sunrise' | 'sunset' | 'moonrise' | null;
}

export type NotificationTimeKey =
  | 'dailyBriefing'
  | 'dailyCelestialTips'
  | 'eveningReflection'
  | 'streakSaver'
  | 'holidayReminders'
  | 'fullMoonReminders'
  | 'newMoonReminders'
  | 'sunriseWakeUp';

export type NotificationMode = 'unified' | 'custom';

export interface NotificationPreferences {
  globalEnabled: boolean;
  notificationMode: NotificationMode;
  quietHours: QuietHoursConfig;
  calendar: CalendarNotificationPrefs;
  stars: StarsNotificationPrefs;
  circle: CircleNotificationPrefs;
  journal: JournalNotificationPrefs;
  planner: PlannerNotificationPrefs;
  /** Per-type custom scheduling times (falls back to defaults if not set) */
  customTimes: Partial<Record<NotificationTimeKey, CustomTimeConfig>>;
  /** Vacation mode — suppress non-essential notifications */
  vacationMode: VacationMode;
  /** Focus schedules — filter notifications by tier during work/focus time */
  focusSchedules: FocusSchedule[];
  /** Whether adaptive caps (fatigue-based) are enabled */
  adaptiveCaps: boolean;
}

// ── Default Preferences ──────────────────────────────────────────────────────

export const DEFAULT_CALENDAR_NOTIFICATION_PREFS: CalendarNotificationPrefs = {
  holidayReminders: true,
  civilHekaTransition: true,
  noteReminders: true,
  newYearReminders: true,
  solsticeEquinoxReminders: true,
  monthStartReminders: true,
};

export const DEFAULT_STARS_NOTIFICATION_PREFS: StarsNotificationPrefs = {
  dailyCelestialTips: true,
  retrogradeAlerts: true,
  voidMoonReminders: true,
  moonDegreeNotifications: false,
  newMoonReminders: true,
  fullMoonReminders: true,
  sunriseWakeUp: false,
};

export const DEFAULT_CIRCLE_NOTIFICATION_PREFS: CircleNotificationPrefs = {
  friendRequests: true,
  taskRequests: true,
  taskDueReminders: true,
};

export const DEFAULT_JOURNAL_NOTIFICATION_PREFS: JournalNotificationPrefs = {
  reflectionReminders: true,
  dailyReflectionPrompt: true,
  celestialInsightAlert: false,
};

export const DEFAULT_PLANNER_NOTIFICATION_PREFS: PlannerNotificationPrefs = {
  taskReminders: true,
  dailyBriefing: true,
  streakSaver: true,
  completionCelebrations: true,
  complementaryTasks: false,
};

export const DEFAULT_QUIET_HOURS: QuietHoursConfig = {
  enabled: false,
  start: 22,
  end: 7,
};

export const DEFAULT_VACATION_MODE: VacationMode = {
  enabled: false,
  untilDate: null,
  allowedTypes: ['streak-saver', 'streak-protection', 'friend-request'],
};

export const DEFAULT_FOCUS_SCHEDULES: FocusSchedule[] = [
  {
    id: 'deep-work',
    name: 'Deep Work',
    enabled: false,
    allowedTiers: ['core'],
    daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
    startHour: 9,
    startMinute: 0,
    endHour: 12,
    endMinute: 0,
  },
  {
    id: 'evening-wind-down',
    name: 'Evening Wind-Down',
    enabled: false,
    allowedTiers: ['core', 'standard'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startHour: 21,
    startMinute: 0,
    endHour: 7,
    endMinute: 0,
  },
];

export const DEFAULT_NOTIFICATION_TIME_PREFS: Partial<Record<NotificationTimeKey, CustomTimeConfig>> = {
  dailyBriefing: { hour: 7, minute: 0 },
  dailyCelestialTips: { hour: 8, minute: 0 },
  eveningReflection: { hour: 20, minute: 0 },
  streakSaver: { hour: 20, minute: 0 },
  holidayReminders: { hour: 19, minute: 0 },
  fullMoonReminders: { hour: 20, minute: 0 },
  newMoonReminders: { hour: 7, minute: 0 },
  sunriseWakeUp: { hour: 6, minute: 0, alignToEvent: 'sunrise' },
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  globalEnabled: true,
  notificationMode: 'unified',
  quietHours: DEFAULT_QUIET_HOURS,
  calendar: DEFAULT_CALENDAR_NOTIFICATION_PREFS,
  stars: DEFAULT_STARS_NOTIFICATION_PREFS,
  circle: DEFAULT_CIRCLE_NOTIFICATION_PREFS,
  journal: DEFAULT_JOURNAL_NOTIFICATION_PREFS,
  planner: DEFAULT_PLANNER_NOTIFICATION_PREFS,
  customTimes: { ...DEFAULT_NOTIFICATION_TIME_PREFS },
  vacationMode: DEFAULT_VACATION_MODE,
  focusSchedules: [...DEFAULT_FOCUS_SCHEDULES],
  adaptiveCaps: true,
};

// ── Notification Type Constants ──────────────────────────────────────────────

export const NOTIFICATION_TYPES = {
  // Calendar
  HOLIDAY_REMINDER: 'holiday-reminder',
  CIVIL_HEKA_TRANSITION: 'civil-heka-transition',
  MOON_DEGREE_UPDATE: 'moon-degree-update',
  NOTE_REMINDER: 'note-reminder',
  NEW_YEAR_REMINDER: 'new-year-reminder',
  SOLSTICE_EQUINOX_REMINDER: 'solstice-equinox-reminder',
  MONTH_START_REMINDER: 'month-start-reminder',

  // Stars
  DAILY_CELESTIAL_TIPS: 'daily-celestial-tips',
  RETROGRADE_ALERT: 'retrograde-alert',
  VOID_MOON_ENTERED: 'void-moon-entered',
  VOID_MOON_ENDED: 'void-moon-ended',
  NEW_MOON_REMINDER: 'new-moon-reminder',
  FULL_MOON_REMINDER: 'full-moon-reminder',
  SUNRISE_WAKE_UP: 'sunrise-wake-up',

  // Circle
  FRIEND_REQUEST: 'friend-request',
  TASK_ASSIGNED: 'task-assigned',

  TASK_DUE_SOON: 'task-due-soon',

  // Journal
  TRACKER_REMINDER: 'reflection-reminder',
  DAILY_REFLECTION_PROMPT: 'daily-reflection-prompt',
  CELESTIAL_INSIGHT_ALERT: 'celestial-insight-alert',

  // Planner
  TASK_REMINDER: 'task-reminder',
  DAILY_BRIEFING: 'daily-briefing',
  STREAK_SAVER: 'streak-saver',
  STREAK_PROTECTION: 'streak-protection',
  COMPLETION_CELEBRATION: 'completion-celebration',
  COMPLEMENTARY_TASK: 'complementary-task',
} as const;

// ── ID Ranges (to prevent collisions) ────────────────────────────────────────

export const NOTIFICATION_ID_RANGES = {
  calendar: { min: 100000, max: 199999 },
  stars: { min: 200000, max: 299999 },
  circle: { min: 300000, max: 399999 },
  journal: { min: 400000, max: 499999 },
  planner: { min: 500000, max: 599999 },
  engine: { min: 900000, max: 999999 },
} as const;

// ── Engine State (persisted separately) ──────────────────────────────────────

export interface NotificationEngineState {
  lastReconcileAt: number | null;
  dailyLedgers: Record<string, DailyStats>;
  scheduledIds: string[];
  voidMoonWatching: boolean;
  lastVoidMoonState: boolean | null;
  lastMoonDegree: number | null;
  sentTodayFlags: Record<string, string>; // key -> date sent (YYYY-MM-DD)
  templateEngagement: Record<string, Record<number, number>>;
  timezone: string | null;
  /** Engagement score per notification type (0-100). Higher = user taps more often. */
  typeEngagement: Record<string, number>;
  /** Last delivery timestamp per type (for genius spacing) */
  lastDeliveryTime: Record<string, number>;
}

export const DEFAULT_ENGINE_STATE: NotificationEngineState = {
  lastReconcileAt: null,
  dailyLedgers: {},
  scheduledIds: [],
  voidMoonWatching: false,
  lastVoidMoonState: null,
  lastMoonDegree: null,
  sentTodayFlags: {},
  templateEngagement: {},
  timezone: null,
  typeEngagement: {},
  lastDeliveryTime: {},
};
