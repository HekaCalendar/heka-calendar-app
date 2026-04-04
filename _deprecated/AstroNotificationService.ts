/**
 * HEKA Astro Notification Service
 * Manages daily tips, retrograde alerts, moon phases, and transit notifications
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { AstroProfile, DailyTransit, Planet } from '../types/astrology';
import { AstroService } from './AstroService';
import { AstroCalculationEngine } from './AstroCalculationEngine';

// Notification types
export type AstroNotificationType = 
  | 'daily-tip'
  | 'retrograde-alert'
  | 'moon-phase'
  | 'personal-transit'
  | 'solar-return'
  | 'lunar-return';

// Notification preferences
export interface AstroNotificationPrefs {
  dailyTip: {
    enabled: boolean;
    time: string; // HH:mm format
    includePowerWord: boolean;
    includeAction: boolean;
  };
  retrogradeAlerts: {
    enabled: boolean;
    planets: Planet[];
    advanceDays: number;
  };
  moonPhases: {
    enabled: boolean;
    phases: ('new' | 'full' | 'quarter')[];
    advanceHours: number;
  };
  personalTransits: {
    enabled: boolean;
    minPowerLevel: 'low' | 'medium' | 'high';
    excludeRetrograde: boolean;
  };
  solarReturn: {
    enabled: boolean;
    advanceDays: number;
  };
  lunarReturn: {
    enabled: boolean;
  };
}

// Default preferences
export const DEFAULT_NOTIFICATION_PREFS: AstroNotificationPrefs = {
  dailyTip: {
    enabled: true,
    time: '07:00',
    includePowerWord: true,
    includeAction: true,
  },
  retrogradeAlerts: {
    enabled: true,
    planets: ['mercury', 'venus', 'mars'],
    advanceDays: 3,
  },
  moonPhases: {
    enabled: true,
    phases: ['new', 'full'],
    advanceHours: 12,
  },
  personalTransits: {
    enabled: true,
    minPowerLevel: 'high',
    excludeRetrograde: false,
  },
  solarReturn: {
    enabled: true,
    advanceDays: 7,
  },
  lunarReturn: {
    enabled: false,
  },
};

const PREFS_STORAGE_KEY = 'heka_astro_notification_prefs';
// const SCHEDULED_NOTIFICATIONS_KEY = 'heka_scheduled_astro_notifications';

export class AstroNotificationService {
  /**
   * Get notification preferences
   */
  static async getPrefs(): Promise<AstroNotificationPrefs> {
    try {
      const stored = localStorage.getItem(PREFS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore parsing errors
    }
    return DEFAULT_NOTIFICATION_PREFS;
  }
  
  /**
   * Save notification preferences
   */
  static async savePrefs(prefs: AstroNotificationPrefs): Promise<void> {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    // Reschedule notifications with new preferences
    await this.rescheduleAllNotifications();
  }
  
  /**
   * Schedule daily morning tip notification
   */
  static async scheduleDailyTip(profile: AstroProfile, prefs: AstroNotificationPrefs): Promise<void> {
    if (!prefs.dailyTip.enabled) return;
    
    const [hours, minutes] = prefs.dailyTip.time.split(':').map(Number);
    
    // Schedule for the next 7 days
    for (let i = 0; i < 7; i++) {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + i);
      scheduledDate.setHours(hours, minutes, 0, 0);
      
      // Calculate transit for that day
      const transit = await AstroService.calculateDailyTransit(scheduledDate, profile.id);
      
      if (transit) {
        const title = transit.tip.title;
        let body = transit.tip.message;
        
        if (prefs.dailyTip.includePowerWord) {
          body = `✦ ${transit.tip.action}\n\n${body}`;
        }
        
        await LocalNotifications.schedule({
          notifications: [{
            id: this.generateNotificationId('daily-tip', scheduledDate),
            title: `✨ ${title}`,
            body: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
            schedule: {
              at: scheduledDate,
            },
            extra: {
              type: 'daily-tip',
              date: scheduledDate.toISOString(),
              profileId: profile.id,
            },
          }],
        });
      }
    }
  }
  
  /**
   * Schedule retrograde alerts
   */
  static async scheduleRetrogradeAlerts(
    _profile: AstroProfile,
    prefs: AstroNotificationPrefs
  ): Promise<void> {
    if (!prefs.retrogradeAlerts.enabled) return;
    
    const planets = prefs.retrogradeAlerts.planets;
    const advanceDays = prefs.retrogradeAlerts.advanceDays;
    
    // Check next 90 days for retrograde stations
    const checkDays = 90;
    const today = new Date();
    
    for (let i = 0; i < checkDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const positions = await AstroCalculationEngine.calculatePlanetaryPositions(date);
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowPositions = await AstroCalculationEngine.calculatePlanetaryPositions(tomorrow);
      
      for (const planet of planets) {
        const todayPos = positions.find(p => p.planet === planet);
        const tomorrowPos = tomorrowPositions.find(p => p.planet === planet);
        
        if (todayPos && tomorrowPos) {
          // Station retrograde
          if (!todayPos.isRetrograde && tomorrowPos.isRetrograde) {
            const alertDate = new Date(date);
            alertDate.setDate(alertDate.getDate() - advanceDays);
            
            if (alertDate > today) {
              await LocalNotifications.schedule({
                notifications: [{
                  id: this.generateNotificationId(`retrograde-start-${planet}`, date),
                  title: `⚠️ ${this.capitalize(planet)} Retrograde Incoming`,
                  body: `${this.capitalize(planet)} stations retrograde in ${advanceDays} days. Prepare for review and reflection.`,
                  schedule: { at: alertDate },
                  extra: {
                    type: 'retrograde-alert',
                    planet,
                    stationType: 'start',
                    actualDate: date.toISOString(),
                  },
                }],
              });
            }
          }
          // Station direct
          else if (todayPos.isRetrograde && !tomorrowPos.isRetrograde) {
            await LocalNotifications.schedule({
              notifications: [{
                id: this.generateNotificationId(`retrograde-end-${planet}`, date),
                title: `✅ ${this.capitalize(planet)} Goes Direct`,
                body: `${this.capitalize(planet)} stations direct today. Forward motion resumes!`,
                schedule: { at: date },
                extra: {
                  type: 'retrograde-alert',
                  planet,
                  stationType: 'end',
                },
              }],
            });
          }
        }
      }
    }
  }
  
  /**
   * Schedule moon phase notifications
   */
  static async scheduleMoonPhaseNotifications(
    prefs: AstroNotificationPrefs
  ): Promise<void> {
    if (!prefs.moonPhases.enabled) return;
    
    const phases = prefs.moonPhases.phases;
    const advanceHours = prefs.moonPhases.advanceHours;
    
    // Check next 60 days
    const checkDays = 60;
    const today = new Date();
    
    for (let i = 0; i < checkDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const positions = await AstroCalculationEngine.calculatePlanetaryPositions(date);
      const sun = positions.find(p => p.planet === 'sun');
      const moon = positions.find(p => p.planet === 'moon');
      
      if (!sun || !moon) continue;
      
      const elongation = (moon.exactLongitude - sun.exactLongitude + 360) % 360;
      
      // Check for exact phases
      let phase: string | null = null;
      let title = '';
      let body = '';
      
      if (phases.includes('new') && (elongation < 3 || elongation > 357)) {
        phase = 'new';
        title = '🌑 New Moon';
        body = 'A fresh lunar cycle begins. Set your intentions for the coming month.';
      } else if (phases.includes('full') && Math.abs(elongation - 180) < 3) {
        phase = 'full';
        title = '🌕 Full Moon';
        body = 'Illumination and culmination. Celebrate what has come to fruition.';
      } else if (phases.includes('quarter')) {
        if (Math.abs(elongation - 90) < 3) {
          phase = 'first-quarter';
          title = '🌓 First Quarter';
          body = 'Take action on your intentions. Overcome obstacles.';
        } else if (Math.abs(elongation - 270) < 3) {
          phase = 'last-quarter';
          title = '🌗 Last Quarter';
          body = 'Release what no longer serves. Make space for the new.';
        }
      }
      
      if (phase) {
        const notifyDate = new Date(date);
        notifyDate.setHours(notifyDate.getHours() - advanceHours);
        
        if (notifyDate > today) {
          await LocalNotifications.schedule({
            notifications: [{
              id: this.generateNotificationId(`moon-${phase}`, date),
              title,
              body,
              schedule: { at: notifyDate },
              extra: {
                type: 'moon-phase',
                phase,
                actualDate: date.toISOString(),
              },
            }],
          });
        }
      }
    }
  }
  
  /**
   * Schedule personal transit notifications
   */
  static async schedulePersonalTransitNotifications(
    profile: AstroProfile,
    prefs: AstroNotificationPrefs
  ): Promise<void> {
    if (!prefs.personalTransits.enabled || !profile.natalChart) return;
    
    const minPower = prefs.personalTransits.minPowerLevel;
    const excludeRetrograde = prefs.personalTransits.excludeRetrograde;
    
    // Check next 30 days for significant transits
    const checkDays = 30;
    const today = new Date();
    
    for (let i = 0; i < checkDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const transit = await AstroService.calculateDailyTransit(date, profile.id);
      
      if (transit && this.shouldNotifyForTransit(transit, minPower, excludeRetrograde)) {
        const significantTransit = transit.transitsToNatal[0];
        
        await LocalNotifications.schedule({
          notifications: [{
            id: this.generateNotificationId('transit', date),
            title: `✨ Significant Transit Today`,
            body: `${significantTransit.transitingPlanet} ${significantTransit.aspect} your natal ${significantTransit.natalPlanet}. ${transit.tip.title}`,
            schedule: { at: date },
            extra: {
              type: 'personal-transit',
              transit: significantTransit,
              tip: transit.tip,
            },
          }],
        });
      }
    }
  }
  
  /**
   * Schedule solar return notification
   */
  static async scheduleSolarReturn(
    profile: AstroProfile,
    prefs: AstroNotificationPrefs
  ): Promise<void> {
    if (!prefs.solarReturn.enabled || !profile.natalChart) return;
    
    const sunPos = profile.natalChart.positions.find(p => p.planet === 'sun');
    if (!sunPos) return;
    
    // Calculate next solar return
    const today = new Date();
    const birthDate = new Date(profile.birthDate);
    let solarReturnDate = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // If already passed this year, use next year
    if (solarReturnDate < today) {
      solarReturnDate.setFullYear(solarReturnDate.getFullYear() + 1);
    }
    
    const advanceDays = prefs.solarReturn.advanceDays;
    const notifyDate = new Date(solarReturnDate);
    notifyDate.setDate(notifyDate.getDate() - advanceDays);
    
    await LocalNotifications.schedule({
      notifications: [{
        id: this.generateNotificationId('solar-return', solarReturnDate),
        title: '🎂 Your Solar Return Approaches',
        body: `Your personal new year is in ${advanceDays} days. Time to set intentions for the year ahead!`,
        schedule: { at: notifyDate },
        extra: {
          type: 'solar-return',
          actualDate: solarReturnDate.toISOString(),
        },
      }],
    });
  }
  
  /**
   * Check if we should notify for a transit
   */
  private static shouldNotifyForTransit(
    transit: DailyTransit,
    minPower: string,
    excludeRetrograde: boolean
  ): boolean {
    const powerLevels = ['low', 'medium', 'high', 'very-high'];
    const transitPower = powerLevels.indexOf(transit.powerLevel);
    const minPowerIndex = powerLevels.indexOf(minPower);
    
    if (transitPower < minPowerIndex) return false;
    
    if (excludeRetrograde && transit.planetaryPositions.some(p => p.isRetrograde)) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Reschedule all notifications
   */
  static async rescheduleAllNotifications(): Promise<void> {
    // Cancel existing astro notifications
    const pending = await LocalNotifications.getPending();
    const astroNotifications = pending.notifications.filter(
      n => n.extra?.type?.startsWith('daily-tip') ||
           n.extra?.type?.startsWith('retrograde') ||
           n.extra?.type?.startsWith('moon') ||
           n.extra?.type?.startsWith('transit') ||
           n.extra?.type?.startsWith('solar')
    );
    
    if (astroNotifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: astroNotifications.map(n => ({ id: n.id })),
      });
    }
    
    // Get active profile and preferences
    const profile = await AstroService.getActiveProfile();
    const prefs = await this.getPrefs();
    
    if (!profile) return;
    
    // Reschedule all types
    await this.scheduleDailyTip(profile, prefs);
    await this.scheduleRetrogradeAlerts(profile, prefs);
    await this.scheduleMoonPhaseNotifications(prefs);
    await this.schedulePersonalTransitNotifications(profile, prefs);
    await this.scheduleSolarReturn(profile, prefs);
  }
  
  /**
   * Handle notification action
   */
  static async handleNotificationAction(notification: any): Promise<void> {
    const type = notification.extra?.type;
    
    switch (type) {
      case 'daily-tip':
        // Open app to daily view
        break;
      case 'retrograde-alert':
        // Show retrograde info
        break;
      case 'moon-phase':
        // Show moon phase details
        break;
      case 'personal-transit':
        // Show transit details
        break;
      case 'solar-return':
        // Show solar return chart
        break;
    }
  }
  
  /**
   * Generate unique notification ID
   */
  private static generateNotificationId(type: string, date: Date): number {
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const typeHash = type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return parseInt(`${typeHash}${dateStr}`, 10) % 2147483647;
  }
  
  /**
   * Capitalize first letter
   */
  private static capitalize(str: string | undefined): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default AstroNotificationService;
