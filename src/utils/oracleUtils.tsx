/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ORACLE UTILITIES — Pure helper functions for the HEKA AI Coach
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * These functions have zero side effects, zero React dependencies,
 * and zero coupling to global state.
 */

import React from 'react';
import type { CoachMessage } from '../types/oracle';
import type { CoachMemoryEntry } from '../services/aiConfigService';

export function renderMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\\*\\*.*?\\*\\*|\\*.*?\\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#d4af37', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export function getLocalTimeContext() {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 5) return { label: 'night' as const, greeting: 'The night is deep', hour };
  if (hour < 12) return { label: 'morning' as const, greeting: 'Good morning', hour };
  if (hour < 17) return { label: 'afternoon' as const, greeting: 'Good afternoon', hour };
  if (hour < 21) return { label: 'evening' as const, greeting: 'Good evening', hour };
  return { label: 'night' as const, greeting: 'The stars are out', hour };
}

export function getTimezoneName(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ');
  } catch {
    return 'your timezone';
  }
}

export function getCurrentUserLocation() {
  try {
    const saved = localStorage.getItem('ci-location');
    const name = localStorage.getItem('ci-location-name') || 'Local';
    if (saved) {
      const parsed = JSON.parse(saved);
      const lat = parsed.latitude;
      const lon = parsed.longitude;
      const tz = parsed.timezone;
      if (typeof lat === 'number' && typeof lon === 'number' && !Number.isNaN(lat) && !Number.isNaN(lon)) {
        return {
          name,
          latitude: lat,
          longitude: lon,
          timezoneOffset: typeof tz === 'number' ? tz : -new Date().getTimezoneOffset() / 60,
          hasLocation: true,
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    name: 'Local',
    latitude: 0,
    longitude: 0,
    timezoneOffset: -new Date().getTimezoneOffset() / 60,
    hasLocation: false,
  };
}

export function getSignElement(sign: string): 'fire' | 'water' | 'earth' | 'air' | 'unknown' {
  const elements: Record<string, 'fire' | 'water' | 'earth' | 'air'> = {
    aries: 'fire', leo: 'fire', sagittarius: 'fire',
    taurus: 'earth', virgo: 'earth', capricorn: 'earth',
    gemini: 'air', libra: 'air', aquarius: 'air',
    cancer: 'water', scorpio: 'water', pisces: 'water',
    ophiuchus: 'water',
  };
  return elements[sign.toLowerCase()] || 'unknown';
}

export function hoursSinceTopic(topic: string, memory: CoachMemoryEntry[]): number {
  const entry = memory.find((m) => m.topic === topic);
  if (!entry) return 999;
  return (Date.now() - entry.timestamp) / (1000 * 60 * 60);
}

export function deriveTopic(msg: CoachMessage): string {
  // Candidate messages have a topic field; use it if available
  if ('topic' in msg && msg.topic) {
    if (msg.topic === 'transit') return 'transit';
    if (msg.topic === 'void-moon') return 'void-moon';
    if (msg.topic === 'streak-danger') return 'streak-danger';
    if (msg.topic === 'mood-support') return 'mood-support';
    if (msg.topic === 'archetype') return 'archetype';
  }
  if (msg.type === 'celebration') return msg.text.includes('streak') ? 'streak' : 'celebration';
  if (msg.type === 'task') return msg.text.includes('pending') ? 'pending' : 'task-suggest';
  if (msg.type === 'nudge' && msg.text.includes('journal')) return 'journal';
  if (msg.type === 'nudge' && msg.text.includes('flame')) return 'streak-danger';
  if (msg.type === 'nudge' && msg.text.includes('weight')) return 'mood-support';
  if (msg.type === 'nudge' && msg.text.includes('micro')) return 'motivation';
  if (msg.type === 'insight' && msg.icon === '🔮') return 'archetype';
  if (msg.type === 'celestial' && msg.text.includes('void')) return 'void-moon';
  if (msg.type === 'celestial') return msg.text.includes('retrograde') ? 'retrograde' : 'moon';
  if (msg.type === 'wisdom') return 'wisdom';
  if (msg.type === 'synchronicity') return 'synchronicity';
  if (msg.type === 'plan') return 'plan';
  return 'general';
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
