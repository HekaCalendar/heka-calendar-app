/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PERMISSIONS SELECTOR — Location & Notifications
 * Cinematic floating layout. No boxes. No borders. Just breath and light.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../../utils/errorUtils';
import type { AppDispatch } from '../../store';
import { setLocationEnabled, setNotificationsEnabled } from '../../store/setupSlice';
import { requestNotificationPermission } from '../../services/notificationService';
import {
  IconCalendar, IconMoon, IconScroll, IconSparkle,
  IconHeartPulse, IconCrescent, IconPin,
  IconBell, IconHourglass, IconCheck,
  IconArrowRight,
} from './SetupIcons';

interface PermissionsSelectorProps {
  initialLocation: boolean | null;
  initialNotifications: boolean | null;
}

interface NotifCategory {
  icon: React.ReactNode;
  labelKey: string;
  items: string[];
}

const NOTIF_CATEGORIES: NotifCategory[] = [
  {
    icon: <IconCalendar size={16} color="rgba(201,162,39,0.6)" />,
    labelKey: 'notifCategoryCalendar',
    items: ['notifItemHolidayReminders', 'notifItemTransitions', 'notifItemNoteAlerts'],
  },
  {
    icon: <IconMoon size={16} color="rgba(201,162,39,0.6)" />,
    labelKey: 'notifCategoryCelestial',
    items: ['notifItemMoonPhase', 'notifItemVoidMoon', 'notifItemRetrograde', 'notifItemCelestialTips', 'notifItemTransitInsights'],
  },
  {
    icon: <IconScroll size={16} color="rgba(201,162,39,0.6)" />,
    labelKey: 'notifCategoryTasks',
    items: ['notifItemDueReminders', 'notifItemDailyBriefings', 'notifItemCompletionCelebrations', 'notifItemStreakProtection'],
  },
  {
    icon: <IconSparkle size={16} color="rgba(201,162,39,0.6)" />,
    labelKey: 'notifCategoryCosmicCircle',
    items: ['notifItemFriendRequests', 'notifItemSharedTasks'],
  },
  {
    icon: <IconHeartPulse size={16} color="rgba(201,162,39,0.6)" />,
    labelKey: 'notifCategoryBodyMind',
    items: ['notifItemMoodChecks', 'notifItemSleepLogs', 'notifItemEnergyChecks'],
  },
  {
    icon: <IconCrescent size={16} color="rgba(201,162,39,0.6)" />,
    labelKey: 'notifCategoryReflection',
    items: ['notifItemEveningPrompts', 'notifItemInsightAlerts'],
  },
];

export const PermissionsSelector: React.FC<PermissionsSelectorProps> = ({
  initialLocation,
  initialNotifications,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('wizard');
  const [location, setLocationState] = useState<boolean | null>(initialLocation);
  const [notifications, setNotificationsState] = useState<boolean | null>(initialNotifications);
  const [locationLoading, setLocationLoading] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [notifError, setNotifError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setLocationEnabled(location ?? false));
  }, [dispatch, location]);

  // Only sync to Redux when user has explicitly made a choice.
  // Don't convert null → false on first render — that permanently disables
  // notifications if the user simply clicks "Next" without engaging the button.
  useEffect(() => {
    if (notifications !== null) {
      dispatch(setNotificationsEnabled(notifications));
    }
  }, [dispatch, notifications]);

  const requestLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      if (!navigator.geolocation) {
        setLocationError(t('geolocationNotSupported'));
        setLocationState(false);
        return;
      }
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      setLocationState(true);
    } catch (err) {
      console.error('[Setup] Location denied:', err);
      setLocationError(
        getErrorMessage(err).includes('denied') ? t('permissionDenied') : t('unableToGetLocation')
      );
      setLocationState(false);
    } finally {
      setLocationLoading(false);
    }
  }, [t]);

  const requestNotifications = useCallback(async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const granted = await requestNotificationPermission();
      setNotificationsState(granted);
      if (!granted) {
        setNotifError(t('permissionDenied'));
      }
    } catch (err) {
      console.error('[Setup] Notification error:', err);
      setNotifError(t('unableToRequestPermission'));
      setNotificationsState(false);
    } finally {
      setNotifLoading(false);
    }
  }, [t]);

  // Auto-request notification permission on first visit to this step
  useEffect(() => {
    if (initialNotifications === null) {
      const timer = setTimeout(() => {
        void requestNotifications();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [initialNotifications, requestNotifications]);

  const getStatusText = (state: boolean | null) => {
    if (state === true) return t('statusEnabled');
    if (state === false) return t('statusNotEnabled');
    return t('statusNotSet');
  };

  const getStatusClass = (state: boolean | null) => {
    if (state === true) return 'perm-status--enabled';
    if (state === false) return 'perm-status--disabled';
    return 'perm-status--pending';
  };

  return (
    <div className="setup-step setup-step--permissions" tabIndex={-1}>
      <div className="sw-ornament" />
      <h2 className="setup-step__title" tabIndex={-1}>{t('permissionsTitle')}</h2>
      <p className="setup-step__subtitle">{t('permissionsSubtitle')}</p>

      {/* Location Section */}
      <div className="perm-section">
        <div className="perm-section__header">
          <span className="perm-section__icon"><IconPin size={22} color="#c9a227" /></span>
          <div className="perm-section__title-group">
            <h3 className="perm-section__title">{t('locationServicesTitle')}</h3>
            <span className={`perm-status ${getStatusClass(location)}`}>{getStatusText(location)}</span>
          </div>
        </div>

        <div className="perm-section__features">
          <span className="perm-section__feature">{t('locationFeature1')}</span>
          <span className="perm-section__feature">{t('locationFeature2')}</span>
          <span className="perm-section__feature">{t('locationFeature3')}</span>
        </div>

        {locationError && (
          <div className="perm-section__error" role="alert">{locationError}</div>
        )}

        <button
          className={`perm-action ${location === true ? 'perm-action--enabled' : ''}`}
          onClick={requestLocation}
          disabled={locationLoading}
          type="button"
        >
          {locationLoading ? (
            <><IconHourglass size={14} color="#c9a227" /> {t('requesting')}</>
          ) : location === true ? (
            <><IconCheck size={14} color="#81b29a" /> {t('locationActive')}</>
          ) : (
            <>{t('enableLocation')} <IconArrowRight size={14} color="currentColor" /></>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="perm-divider" aria-hidden="true" />

      {/* Notifications Section */}
      <div className="perm-section">
        <div className="perm-section__header">
          <span className="perm-section__icon"><IconBell size={22} color="#c9a227" /></span>
          <div className="perm-section__title-group">
            <h3 className="perm-section__title">{t('notificationsTitle')}</h3>
            <span className={`perm-status ${getStatusClass(notifications)}`}>{getStatusText(notifications)}</span>
          </div>
        </div>

        <div className="perm-constellation">
          {NOTIF_CATEGORIES.map((cat) => (
            <div key={cat.labelKey} className="perm-constellation__row">
              <span className="perm-constellation__icon">{cat.icon}</span>
              <div className="perm-constellation__text">
                <span className="perm-constellation__label">{t(cat.labelKey)}</span>
                <span className="perm-constellation__items">
                  {cat.items.map((itemKey, i) => (
                    <React.Fragment key={itemKey}>
                      {t(itemKey)}{i < cat.items.length - 1 && <span className="perm-constellation__sep" aria-hidden="true"> · </span>}
                    </React.Fragment>
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>

        {notifError && (
          <div className="perm-section__error" role="alert">{notifError}</div>
        )}

        <button
          className={`perm-action ${notifications === true ? 'perm-action--enabled' : ''}`}
          onClick={requestNotifications}
          disabled={notifLoading}
          type="button"
        >
          {notifLoading ? (
            <><IconHourglass size={14} color="#c9a227" /> {t('requesting')}</>
          ) : notifications === true ? (
            <><IconCheck size={14} color="#81b29a" /> {t('notificationsActive')}</>
          ) : notifications === false ? (
            <>{t('retryNotifications')} <IconArrowRight size={14} color="currentColor" /></>
          ) : (
            <>{t('enableNotifications')} <IconArrowRight size={14} color="currentColor" /></>
          )}
        </button>
      </div>
    </div>
  );
};
