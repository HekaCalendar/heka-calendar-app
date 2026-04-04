/**
 * Deep Link Service
 * Handles invite links, task shares, and navigation to specific app sections
 */

// Type definition for Capacitor App plugin (avoids direct dependency)
interface CapacitorAppPlugin {
  addListener: (event: string, callback: (data: { url: string }) => void) => Promise<{ remove: () => void }>;
  getLaunchUrl: () => Promise<{ url?: string }>;
}

// Conditionally import Capacitor App plugin (only available in native builds)
let App: CapacitorAppPlugin | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const capacitorApp = require('@capacitor/app');
  App = capacitorApp.App;
} catch (e) {
  // Capacitor app plugin not available (web build)
}

export interface DeepLinkData {
  type: 'invite' | 'task' | 'profile' | 'date';
  code?: string;
  taskId?: string;
  userId?: string;
  date?: { year: number; month: number; day: number };
}

let isInitialized = false;
let pendingInviteCode: string | null = null;
let pendingTaskCode: string | null = null;

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
      
      // Store for the welcome flow (works for both logged in and new users)
      pendingInviteCode = data.code;
      onInviteReceived(data.code);
    }
    
    if (data?.type === 'task' && data.taskId) {
      console.log('[DeepLink] Task share code detected:', data.taskId);
      
      // Store for the task preview flow (works for both logged in and new users)
      pendingTaskCode = data.taskId;
      if (onTaskReceivedCallback) {
        onTaskReceivedCallback(data.taskId);
      }
    }
  };

  // Web: Check URL parameters for invite codes and task shares
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
  }

  // Native: Subscribe to app URL open events
  if (App) {
    const listenerPromise = App.addListener('appUrlOpen', (event) => {
      handleAppUrl(event.url);
    });

    // Also check if app was opened with a URL initially
    void App.getLaunchUrl().then((result: { url?: string }) => {
      if (result.url) {
        console.log('[DeepLink] Launch URL:', result.url);
        handleAppUrl(result.url);
      }
    });

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
 */
export function generateWebInviteLink(code: string): string {
  // This would be a real website URL in production
  return `https://heka.calendar/invite/${code}`;
}

/**
 * Get any pending invite code (for users who opened app via invite but weren't logged in)
 */
export function getPendingInviteCode(): string | null {
  const code = pendingInviteCode;
  pendingInviteCode = null; // Clear it
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
}

/**
 * Get any pending task share code (for users who opened app via task link)
 */
export function getPendingTaskCode(): string | null {
  const code = pendingTaskCode;
  pendingTaskCode = null; // Clear it
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
}
