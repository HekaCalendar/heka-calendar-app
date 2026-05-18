/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ASTROLOGY NOTIFICATION SERVICE
 * Routes celestial notifications through the unified NotificationEngine.
 * Templates live in notificationTemplates.ts.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NotificationEngine } from '../../../services/notificationEngine';

export type NotificationType = 'daily_tip' | 'retrograde_alert' | 'void_moon';

const NOTIFICATION_IDS = {
  daily_tips: 200001,
  retrograde_alerts: 200100,
  void_moon: 200200,
};

/**
 * Initialize astrology notification system
 */
export async function initializeAstroNotifications(): Promise<void> {
  console.log('[AstroNotifications] Initialized via NotificationEngine');
}

/**
 * Schedule daily celestial tips notification (8 AM — staggered 1h after daily briefing)
 */
export async function scheduleDailyTips(enabled: boolean): Promise<void> {
  if (!enabled) {
    await NotificationEngine.cancel(String(NOTIFICATION_IDS.daily_tips));
    console.log('[AstroNotifications] Daily tips disabled');
    return;
  }

  // Deduplication: already scheduled today?
  if (NotificationEngine.hasSentToday('daily-celestial-tips')) {
    console.log('[AstroNotifications] Daily tips already scheduled today. Skipping.');
    return;
  }

  const now = new Date();
  const scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
  if (scheduleTime <= now) {
    scheduleTime.setDate(scheduleTime.getDate() + 1);
  }

  const seed = new Date().toISOString().split('T')[0];

  const result = await NotificationEngine.scheduleTemplated(
    'daily-celestial-tips',
    'standard',
    'stars',
    scheduleTime,
    seed,
    {},
    { type: 'daily-celestial-tips', id: NOTIFICATION_IDS.daily_tips }
  );

  if (result) {
    NotificationEngine.markSentToday('daily-celestial-tips');
    console.log('[AstroNotifications] Daily tips scheduled for', scheduleTime);
  } else {
    console.warn('[AstroNotifications] Daily tips schedule failed — will retry on next interval');
  }
}

/**
 * Schedule retrograde alerts (3-day advance warning)
 */
export async function scheduleRetrogradeAlert(
  planet: string,
  startDate: Date,
  enabled: boolean
): Promise<void> {
  const notificationId = NOTIFICATION_IDS.retrograde_alerts + getPlanetCode(planet);

  if (!enabled) {
    await NotificationEngine.cancel(String(notificationId));
    return;
  }

  const alertDate = new Date(startDate);
  alertDate.setDate(alertDate.getDate() - 3);

  if (alertDate > new Date()) {
    const seed = planet + alertDate.toISOString().split('T')[0];
    await NotificationEngine.scheduleTemplated(
      'retrograde-alert',
      'ambient',
      'stars',
      alertDate,
      seed,
      { planet, domain: getPlanetDomain(planet) },
      { type: 'retrograde-alert', planet, startDate: startDate.toISOString() }
    );
    console.log(`[AstroNotifications] Retrograde alert scheduled for ${planet} on`, alertDate);
  }
}

/**
 * Schedule void moon notifications
 */
export async function scheduleVoidMoonNotification(
  isEntering: boolean,
  sign: string,
  quality: string,
  durationMinutes: number,
  enabled: boolean
): Promise<void> {
  const notificationId = NOTIFICATION_IDS.void_moon + (isEntering ? 1 : 2);

  if (!enabled) {
    await NotificationEngine.cancel(String(notificationId));
    return;
  }

  const type = isEntering ? 'void-moon-entered' : 'void-moon-ended';
  const seed = type + Date.now();

  await NotificationEngine.scheduleTemplated(
    type,
    isEntering ? 'core' : 'standard',
    'stars',
    new Date(Date.now() + 1000),
    seed,
    { sign, quality: quality.toLowerCase(), duration: String(Math.round(durationMinutes)) },
    { type, sign }
  );
}

/**
 * Cancel all astrology notifications
 */
export async function cancelAllAstroNotifications(): Promise<void> {
  const allIds = [
    NOTIFICATION_IDS.daily_tips,
    ...Array.from({ length: 8 }, (_, i) => NOTIFICATION_IDS.retrograde_alerts + i),
    ...Array.from({ length: 2 }, (_, i) => NOTIFICATION_IDS.void_moon + i),
  ];

  for (const id of allIds) {
    await NotificationEngine.cancel(String(id));
  }

  console.log('[AstroNotifications] All notifications cancelled');
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getPlanetCode(planet: string): number {
  const codes: Record<string, number> = {
    mercury: 1, venus: 2, mars: 3, jupiter: 4, saturn: 5, uranus: 6, neptune: 7, pluto: 8
  };
  return codes[planet.toLowerCase()] || 0;
}

function getPlanetDomain(planet: string): string {
  const domains: Record<string, string> = {
    mercury: 'communication and plans',
    venus: 'relationships and values',
    mars: 'actions and desires',
    jupiter: 'expansion and beliefs',
    saturn: 'structures and commitments',
    uranus: 'change and liberation',
    neptune: 'dreams and spirituality',
    pluto: 'transformation and power',
  };
  return domains[planet.toLowerCase()] || 'areas of life';
}

export default {
  initializeAstroNotifications,
  scheduleDailyTips,
  scheduleRetrogradeAlert,
  scheduleVoidMoonNotification,
  cancelAllAstroNotifications,
};
