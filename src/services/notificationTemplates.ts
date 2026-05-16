/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION TEMPLATES
 * Multi-variant copy libraries for every notification type.
 * Seeded randomness ensures users see different copy across days.
 *
 * Templates are loaded from i18n "notifications" namespace so all copy
 * can be localized. English is the fallback when a translation is missing.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { NotificationTemplate } from '../types/notifications';
import i18n from '../i18n';

// ── Seeded Random Utility ────────────────────────────────────────────────────

export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 2147483647) / 2147483647;
}

export function pickTemplate(templates: NotificationTemplate[], seed: string): NotificationTemplate {
  return templates[Math.floor(seededRandom(seed) * templates.length)];
}

export function formatTemplate(template: NotificationTemplate, vars: Record<string, string>): { title: string; body: string } {
  let title = template.title;
  let body = template.body;
  for (const [key, value] of Object.entries(vars)) {
    title = title.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    body = body.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return { title, body };
}

// ── i18n Resource Loader ─────────────────────────────────────────────────────

function getNotificationResources(): Record<string, NotificationTemplate[]> {
  const lang = i18n.language || 'en';
  return (
    i18n.getResourceBundle(lang, 'notifications') ||
    i18n.getResourceBundle('en', 'notifications') ||
    {}
  );
}

/**
 * Get templates for a notification type
 */
export function getTemplates(type: string): NotificationTemplate[] {
  const resources = getNotificationResources();
  return resources[type] || [{ title: 'HEKA Calendar', body: 'You have a new notification.' }];
}

/**
 * Generate notification content from templates
 */
export function generateNotificationContent(
  type: string,
  seed: string,
  vars: Record<string, string> = {}
): { title: string; body: string; templateIndex: number } {
  const templates = getTemplates(type);
  const templateIndex = Math.floor(seededRandom(seed) * templates.length);
  const template = templates[templateIndex];
  const { title, body } = formatTemplate(template, vars);
  return { title, body, templateIndex };
}
