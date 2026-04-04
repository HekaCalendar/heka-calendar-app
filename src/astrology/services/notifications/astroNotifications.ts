/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ASTROLOGY NOTIFICATION SERVICE
 * Delivers celestial intelligence notifications to users
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { LocalNotifications } from '@capacitor/local-notifications';

export type NotificationType = 'daily_tip' | 'retrograde_alert' | 'moon_phase';

// Notification ID ranges to avoid conflicts
const NOTIFICATION_IDS = {
  daily_tips: 1000,
  retrograde_alerts: 2000,
  moon_phases: 3000,
};

/**
 * Initialize astrology notification system
 */
export async function initializeAstroNotifications(): Promise<void> {
  try {
    const permission = await LocalNotifications.requestPermissions();
    console.log('[AstroNotifications] Permission:', permission.display);
  } catch (error) {
    console.error('[AstroNotifications] Failed to initialize:', error);
  }
}

/**
 * Schedule daily celestial tips notification (7 AM)
 */
export async function scheduleDailyTips(enabled: boolean): Promise<void> {
  try {
    // Cancel existing daily tips
    await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_IDS.daily_tips }] });
    
    if (!enabled) {
      console.log('[AstroNotifications] Daily tips disabled');
      return;
    }

    // Schedule for 7:00 AM daily
    const now = new Date();
    const scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0);
    
    // If 7 AM has passed today, start tomorrow
    if (scheduleTime <= now) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [{
        id: NOTIFICATION_IDS.daily_tips,
        title: '🌅 Your Celestial Guidance',
        body: getRandomDailyTip(),
        schedule: { at: scheduleTime, every: 'day' },
        extra: { type: 'daily_tip' },
      }]
    });

    console.log('[AstroNotifications] Daily tips scheduled for', scheduleTime);
  } catch (error) {
    console.error('[AstroNotifications] Failed to schedule daily tips:', error);
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
  try {
    const notificationId = NOTIFICATION_IDS.retrograde_alerts + getPlanetCode(planet);
    
    // Cancel existing alert for this planet
    await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
    
    if (!enabled) return;

    // Calculate 3 days before
    const alertDate = new Date(startDate);
    alertDate.setDate(alertDate.getDate() - 3);
    
    // Only schedule if alert date is in the future
    if (alertDate > new Date()) {
      await LocalNotifications.schedule({
        notifications: [{
          id: notificationId,
          title: `⚠️ ${planet} Retrograde Approaching`,
          body: `${planet} enters retrograde in 3 days. Time to review, revise, and reconsider ${getPlanetDomain(planet)}.`,
          schedule: { at: alertDate },
          extra: { type: 'retrograde_alert', planet, startDate: startDate.toISOString() },
        }]
      });
      
      console.log(`[AstroNotifications] Retrograde alert scheduled for ${planet} on`, alertDate);
    }
  } catch (error) {
    console.error('[AstroNotifications] Failed to schedule retrograde alert:', error);
  }
}

/**
 * Schedule moon phase notifications (New and Full Moon)
 */
export async function scheduleMoonPhaseNotification(
  phase: 'new' | 'full',
  date: Date,
  enabled: boolean
): Promise<void> {
  try {
    const notificationId = NOTIFICATION_IDS.moon_phases + (phase === 'new' ? 1 : 2);
    
    // Cancel existing
    await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
    
    if (!enabled) return;

    // Only schedule if date is in the future
    if (date > new Date()) {
      const isNew = phase === 'new';
      
      await LocalNotifications.schedule({
        notifications: [{
          id: notificationId,
          title: isNew ? '🌑 New Moon Tonight' : '🌕 Full Moon Tonight',
          body: isNew 
            ? 'A new lunar cycle begins. Set intentions, plant seeds, and embrace new beginnings.'
            : 'Illumination peaks tonight. Release what no longer serves and celebrate your growth.',
          schedule: { at: date },
          extra: { type: 'moon_phase', phase },
        }]
      });
      
      console.log(`[AstroNotifications] Moon phase (${phase}) scheduled for`, date);
    }
  } catch (error) {
    console.error('[AstroNotifications] Failed to schedule moon phase:', error);
  }
}

/**
 * Cancel all astrology notifications
 */
export async function cancelAllAstroNotifications(): Promise<void> {
  try {
    const allIds = [
      NOTIFICATION_IDS.daily_tips,
      ...Array.from({ length: 8 }, (_, i) => NOTIFICATION_IDS.retrograde_alerts + i),
      ...Array.from({ length: 2 }, (_, i) => NOTIFICATION_IDS.moon_phases + i),
    ];
    
    await LocalNotifications.cancel({
      notifications: allIds.map(id => ({ id }))
    });
    
    console.log('[AstroNotifications] All notifications cancelled');
  } catch (error) {
    console.error('[AstroNotifications] Failed to cancel notifications:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getRandomDailyTip(): string {
  const tips = [
    'The Moon waxes toward fullness. What are you ready to bring to light?',
    'Mercury moves swiftly today. Trust your quick insights and speak your truth.',
    'Venus smiles on connections. Reach out to someone you care about.',
    'Mars energizes your actions. Channel passion into constructive outlets.',
    'Jupiter expands possibilities. Say yes to an opportunity that scares you.',
    'Saturn rewards discipline. What structure do you need to build today?',
    'The Void Moon invites rest. Pause before initiating something new.',
    'A planet retrogrades soon. What area of life needs review and refinement?',
    'Your ruling planet shines bright. Your natural gifts are amplified today.',
    'The Sun illuminates your path. Step forward with confidence and clarity.',
    'Lunar energy supports release. What can you let go of to create space?',
    'Cosmic alignment favors creativity. Express yourself authentically today.',
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}

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
  scheduleMoonPhaseNotification,
  cancelAllAstroNotifications,
};
