/**
 * Notification Settings Component
 * Allows users to enable/disable notifications for both browser and native apps
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  requestNotificationPermission,
  getNotificationPermission,
  testNotification,
  type NotificationPermissionType
} from '../services/notificationService';
import { AlertDialog } from './ui/AlertDialog';

export const NotificationSettings: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermissionType | 'prompt' | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [disableHint, setDisableHint] = useState<string | null>(null);

  // Check if in native app context
  useEffect(() => {
    const checkNative = typeof window !== 'undefined' && !!(window as unknown as { Capacitor?: unknown }).Capacitor;
    setIsNativeApp(checkNative);
  }, []);

  // Check permission on mount and when focus returns
  useEffect(() => {
    const checkPermission = async () => {
      const perm = await getNotificationPermission();
      setPermission(perm);
    };
    
    checkPermission();
    
    // Re-check when window gains focus (user might have changed settings)
    window.addEventListener('focus', checkPermission);
    return () => window.removeEventListener('focus', checkPermission);
  }, []);

  const handleEnableNotifications = useCallback(async () => {
    console.log('[NOTIFY] Button clicked, requesting...');
    setIsRequesting(true);
    
    // Safety timeout - ensure we never stay stuck in "requesting" state
    const safetyTimeout = setTimeout(() => {
      console.log('[NOTIFY] Safety timeout triggered');
      setIsRequesting(false);
      // Re-check permission
      getNotificationPermission().then(setPermission);
    }, 5000);
    
    try {
      console.log('[NOTIFY] Calling requestNotificationPermission...');
      const granted = await requestNotificationPermission();
      console.log('[NOTIFY] Granted:', granted);
      clearTimeout(safetyTimeout);
      
      const newPerm = await getNotificationPermission();
      console.log('[NOTIFY] New permission:', newPerm);
      setPermission(newPerm);
      
      if (granted) {
        // Send test notification after a short delay
        setTimeout(() => {
          testNotification();
        }, 500);
      }
    } catch (error) {
      console.error('[NOTIFY] Failed:', error);
      clearTimeout(safetyTimeout);
      // Re-check permission in case it was granted but promise failed
      const newPerm = await getNotificationPermission();
      setPermission(newPerm);
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const handleTestNotification = useCallback(async () => {
    try {
      await testNotification();
      setTestStatus('sent');
      setTimeout(() => setTestStatus('idle'), 3000);
    } catch {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  }, []);
  
  // Check if browser supports notifications (for web)
  const supportsNotifications = typeof window !== 'undefined' && 'Notification' in window;

  // Unified UI that works for both native and web
  const getStatusIcon = () => {
    if (permission === 'granted') return '✅';
    if (permission === 'denied') return '🔕';
    return '🔔';
  };

  const getStatusTitle = () => {
    if (permission === 'granted') return '✓ Notifications Enabled';
    if (permission === 'denied') return 'Notifications Blocked';
    return 'Enable Notifications';
  };

  const getStatusDescription = () => {
    if (permission === 'granted') {
      return isNativeApp 
        ? '✓ Active on this device. You\'ll receive reminders for your notes.' 
        : '✓ Active in this browser. You\'ll receive reminders for your notes.';
    }
    if (permission === 'denied') {
      return isNativeApp
        ? 'Please enable notifications in your device settings.'
        : 'Please enable notifications in your browser settings.';
    }
    return 'Get reminded about your calendar notes.';
  };

  // Don't show unsupported state for native apps (they have their own notification system)
  if (!isNativeApp && !supportsNotifications) {
    return (
      <div className="notification-settings notification-settings--unsupported">
        <div className="notification-settings__icon">🔕</div>
        <div className="notification-settings__text">
          <strong>Notifications not supported</strong>
          <p>Your browser does not support notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`notification-settings ${permission === 'granted' ? 'notification-settings--enabled' : ''}`}>
      <div className="notification-settings__header">
        <div className="notification-settings__icon" style={{ 
          fontSize: '24px',
          color: permission === 'granted' ? '#86efac' : permission === 'denied' ? '#ef4444' : 'inherit'
        }}>
          {getStatusIcon()}
        </div>
        <div className="notification-settings__text">
          <strong style={{ 
            color: permission === 'granted' ? '#86efac' : 'inherit',
            fontSize: permission === 'granted' ? '16px' : 'inherit'
          }}>
            {getStatusTitle()}
          </strong>
          <p style={{ 
            color: permission === 'granted' ? 'rgba(134, 239, 172, 0.8)' : 'var(--color-text-muted)'
          }}>
            {getStatusDescription()}
          </p>
        </div>
      </div>

      <div className="notification-settings__actions">
        {permission === 'granted' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn--sm" 
              onClick={() => {
                if (isNativeApp) {
                  setDisableHint('To disable notifications, go to your device Settings > Apps > HEKA Calendar > Notifications');
                } else {
                  setDisableHint('To disable notifications, click the lock icon in your browser address bar and change notification settings');
                }
              }}
              style={{ 
                background: 'rgba(239, 68, 68, 0.15)', 
                borderColor: 'rgba(239, 68, 68, 0.4)',
                color: '#fca5a5'
              }}
            >
              🔔 Disable Notifications
            </button>
            <button
              className="btn btn--sm"
              onClick={handleTestNotification}
              disabled={testStatus !== 'idle'}
            >
              {testStatus === 'sent' ? 'Sent!' : testStatus === 'error' ? 'Failed' : 'Test'}
            </button>
          </div>
        ) : (
          <button
            className="btn btn--primary"
            onClick={handleEnableNotifications}
            disabled={isRequesting || permission === 'denied'}
            style={{
              opacity: permission === 'denied' ? 0.5 : 1
            }}
          >
            {isRequesting ? 'Requesting...' : permission === 'denied' ? '🔕 Blocked - Check Settings' : '🔔 Enable Notifications'}
          </button>
        )}
      </div>

      <AlertDialog
        isOpen={!!disableHint}
        onClose={() => setDisableHint(null)}
        title="Disable Notifications"
        description={disableHint || ''}
        confirmText="Got it"
      />
    </div>
  );
};

export default NotificationSettings;
