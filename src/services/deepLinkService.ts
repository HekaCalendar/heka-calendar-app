/**
 * Deep Link Service
 * Handles invite links, task shares, and navigation to specific app sections
 */

import { App } from '@capacitor/app';

export interface DeepLinkData {
  type: 'invite' | 'task' | 'profile' | 'date';
  code?: string;
  taskId?: string;
  userId?: string;
  date?: { year: number; month: number; day: number };
}

const WEB_LANDING_BASE = 'https://heka-calendar-pro.vercel.app/invite';

let isInitialized = false;
let pendingInviteCode: string | null = null;
let pendingTaskCode: string | null = null;

// Restore pending codes from sessionStorage (landing page → app transition)
function restorePendingCodes(): void {
  if (typeof window !== 'undefined') {
    try {
      const storedInvite = sessionStorage.getItem('pendingInviteCode');
      const storedTask = sessionStorage.getItem('pendingTaskCode');
      if (storedInvite && !pendingInviteCode) pendingInviteCode = storedInvite;
      if (storedTask && !pendingTaskCode) pendingTaskCode = storedTask;
    } catch {}
  }
}

// Callbacks for different deep link types
type InviteCallback = (code: string) => void;
type TaskCallback = (code: string) => void;
let onTaskReceivedCallback: TaskCallback | null = null;

/**
 * Initialize deep link handling
 * Call this when the app starts
 */
export function initializeDeepLinks(
  onInviteReceived: InviteCallback,
  onTaskReceived?: TaskCallback
): () => void {
  if (isInitialized) return () => {};
  isInitialized = true;

  // Restore codes from sessionStorage (landing page may have stored them)
  restorePendingCodes();

  // Store task callback
  if (onTaskReceived) {
    onTaskReceivedCallback = onTaskReceived;
  }

  // Handle app opened via URL
  const handleAppUrl = (url: string) => {
    console.log('[DeepLink] App opened with URL:', url);
    const data = parseDeepLink(url);
    
    if (data?.type === 'invite' && data.code) {
      console.log('[DeepLink] Invite code detected:', data.code);
      pendingInviteCode = data.code;
      if (typeof window !== 'undefined') {
        try { sessionStorage.setItem('pendingInviteCode', data.code); } catch {}
      }
      onInviteReceived(data.code);
    }
    
    if (data?.type === 'task' && data.taskId) {
      console.log('[DeepLink] Task share code detected:', data.taskId);
      pendingTaskCode = data.taskId;
      if (typeof window !== 'undefined') {
        try { sessionStorage.setItem('pendingTaskCode', data.taskId); } catch {}
      }
      if (onTaskReceivedCallback) {
        onTaskReceivedCallback(data.taskId);
      }
    }
  };

  // Web: Check URL parameters for invite codes and task shares
  // Check both search params (before hash) and hash params (after hash)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteParam = urlParams.get('invite');
    const taskParam = urlParams.get('task');
    
    if (inviteParam) {
      handleAppUrl(`heka-calendar://invite/${inviteParam}`);
    }
    
    if (taskParam) {
      handleAppUrl(`heka-calendar://task/${taskParam}`);
    }

    // Also check hash-based params (for hash router compatibility)
    const hash = window.location.hash;
    const hashQueryIndex = hash.indexOf('?');
    if (hashQueryIndex !== -1) {
      const hashParams = new URLSearchParams(hash.slice(hashQueryIndex + 1));
      const hashInviteParam = hashParams.get('invite');
      const hashTaskParam = hashParams.get('task');
      
      if (hashInviteParam) {
        handleAppUrl(`heka-calendar://invite/${hashInviteParam}`);
      }
      
      if (hashTaskParam) {
        handleAppUrl(`heka-calendar://task/${hashTaskParam}`);
      }
    }
  }

  // Native: Subscribe to app URL open events
  if (App) {
    const listenerPromise = App.addListener('appUrlOpen', (event) => {
      handleAppUrl(event.url);
    });

    // Also check if app was opened with a URL initially
    App.getLaunchUrl().then((result) => {
      if (result?.url) {
        console.log('[DeepLink] Launch URL:', result.url);
        handleAppUrl(result.url);
      }
    }).catch(() => {});

    return () => {
      void listenerPromise.then((listener: { remove: () => void }) => listener.remove());
    };
  }

  return () => {};
}

/**
 * Parse a deep link URL
 */
export function parseDeepLink(url: string): DeepLinkData | null {
  try {
    // Handle heka-calendar:// scheme
    if (url.startsWith('heka-calendar://')) {
      const path = url.replace('heka-calendar://', '');
      const [type, ...rest] = path.split('/');
      
      if (type === 'invite') {
        const code = rest.join('/');
        return { type: 'invite', code };
      }
      
      if (type === 'task') {
        return { type: 'task', taskId: rest[0] };
      }
      
      if (type === 'date') {
        const [year, month, day] = rest[0].split('-').map(Number);
        return { type: 'date', date: { year, month: month - 1, day } };
      }
    }
    
    // Handle https://heka.calendar/invite/CODE format
    if (url.includes('heka.calendar') || url.includes('hekacalendar')) {
      const inviteMatch = url.match(/[\/invite\/]+([A-Z0-9-]+)/i);
      if (inviteMatch) {
        return { type: 'invite', code: inviteMatch[1] };
      }
    }
    
    return null;
  } catch (error) {
    console.error('[DeepLink] Error parsing URL:', error);
    return null;
  }
}

/**
 * Generate an invite link for sharing
 */
export function generateInviteLink(code: string): string {
  // Use the custom URL scheme
  return `heka-calendar://invite/${code}`;
}

/**
 * Generate a web-based invite link (fallback)
 * Embeds creator name so landing page works without extra Firestore auth
 */
export function generateWebInviteLink(code: string, creatorName?: string, type: 'friend' | 'task' = 'friend'): string {
  const params = new URLSearchParams();
  params.set('code', code);
  params.set('type', type);
  if (creatorName) params.set('from', encodeURIComponent(creatorName));
  return `${WEB_LANDING_BASE}?${params.toString()}`;
}

/**
 * Get any pending invite code (for users who opened app via invite but weren't logged in)
 */
export function getPendingInviteCode(): string | null {
  const code = pendingInviteCode;
  pendingInviteCode = null;
  if (typeof window !== 'undefined') {
    try { sessionStorage.removeItem('pendingInviteCode'); } catch {}
  }
  return code;
}

/**
 * Check if there's a pending invite
 */
export function hasPendingInvite(): boolean {
  return pendingInviteCode !== null;
}

/**
 * Clear pending invite
 */
export function clearPendingInvite(): void {
  pendingInviteCode = null;
  if (typeof window !== 'undefined') {
    try { sessionStorage.removeItem('pendingInviteCode'); } catch {}
  }
}

/**
 * Get any pending task share code (for users who opened app via task link)
 */
export function getPendingTaskCode(): string | null {
  const code = pendingTaskCode;
  pendingTaskCode = null;
  if (typeof window !== 'undefined') {
    try { sessionStorage.removeItem('pendingTaskCode'); } catch {}
  }
  return code;
}

/**
 * Check if there's a pending task share
 */
export function hasPendingTaskShare(): boolean {
  return pendingTaskCode !== null;
}

/**
 * Clear pending task share
 */
export function clearPendingTaskShare(): void {
  pendingTaskCode = null;
  if (typeof window !== 'undefined') {
    try { sessionStorage.removeItem('pendingTaskCode'); } catch {}
  }
}
