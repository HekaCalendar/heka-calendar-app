/**
 * Pauses the notification analytics flush timer when the app is backgrounded
 * to avoid unnecessary wake-ups and battery drain.
 */

import { useEffect } from 'react';
import { useVisibility } from './useVisibility';
import { NotificationAnalytics } from '../services/notificationAnalytics';

export function useNotificationAnalyticsPause(): void {
  const isVisible = useVisibility();

  useEffect(() => {
    if (isVisible) {
      NotificationAnalytics.resumeFlushTimer();
    } else {
      NotificationAnalytics.pauseFlushTimer();
    }
  }, [isVisible]);
}
