/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PERMISSIONS SELECTOR — Location & Notifications
 * Clean cards with categorized notification types.
 * Skippable. Enterprise grade.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setLocationEnabled, setNotificationsEnabled } from '../../store/setupSlice';
import { requestNotificationPermission } from '../../services/notificationService';

interface PermissionsSelectorProps {
  initialLocation: boolean | null;
  initialNotifications: boolean | null;
  onNext: () => void;
  onBack: () => void;
  strings: {
    next: string;
    back: string;
    skip: string;
  };
}

const NOTIF_CATEGORIES = [
  {
    icon: '📅',
    label: 'Calendar',
    items: ['Holiday reminders', 'Civil ↔ HEKA transitions', 'Note alerts'],
  },
  {
    icon: '🌙',
    label: 'Celestial',
    items: ['Moon phase & degree', 'Void moon alerts', 'Retrograde warnings', 'Daily celestial tips', 'Transit insights'],
  },
  {
    icon: '📜',
    label: 'Tasks',
    items: ['Due reminders', 'Daily briefings', 'Completion celebrations', 'Streak protection'],
  },
  {
    icon: '✨',
    label: 'Cosmic Circle',
    items: ['Friend requests', 'Messages', 'Shared tasks'],
  },
  {
    icon: '🩸',
    label: 'Body & Mind',
    items: ['Cycle tracking', 'Mood checks', 'Sleep logs', 'Energy checks'],
  },
  {
    icon: '🌑',
    label: 'Reflection',
    items: ['Evening journal prompts', 'Celestial insight alerts'],
  },
];

export const PermissionsSelector: React.FC<PermissionsSelectorProps> = ({
  initialLocation,
  initialNotifications,
  onNext,
  onBack,
  strings,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [location, setLocationState] = useState<boolean | null>(initialLocation);
  const [notifications, setNotificationsState] = useState<boolean | null>(initialNotifications);
  const [locationLoading, setLocationLoading] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [notifError, setNotifError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setLocationEnabled(location ?? false));
  }, [dispatch, location]);

  useEffect(() => {
    dispatch(setNotificationsEnabled(notifications ?? false));
  }, [dispatch, notifications]);

  const requestLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      if (!navigator.geolocation) {
        setLocationError('Geolocation not supported on this device');
        setLocationState(false);
        return;
      }
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      console.log('[Setup] Location granted:', position.coords.latitude, position.coords.longitude);
      setLocationState(true);
    } catch (err: any) {
      console.error('[Setup] Location denied:', err);
      setLocationError(err?.message?.includes('denied') ? 'Permission denied' : 'Unable to get location');
      setLocationState(false);
    } finally {
      setLocationLoading(false);
    }
  }, []);

  const requestNotifications = useCallback(async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const granted = await requestNotificationPermission();
      setNotificationsState(granted);
      if (!granted) {
        setNotifError('Permission denied');
      }
    } catch (err) {
      console.error('[Setup] Notification error:', err);
      setNotifError('Unable to request permission');
      setNotificationsState(false);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  const handleSkip = useCallback(() => {
    dispatch(setLocationEnabled(false));
    dispatch(setNotificationsEnabled(false));
    onNext();
  }, [dispatch, onNext]);

  return (
    <div className="setup-step setup-step--permissions" tabIndex={-1}>
      <h2 className="setup-step__title" tabIndex={-1}>Permissions</h2>
      <p className="setup-step__subtitle">Enable the features that power your celestial experience. You can change these anytime in Settings.</p>

      {/* Location Card */}
      <div className={`perm-card ${location === true ? 'perm-card--enabled' : ''} ${location === false ? 'perm-card--disabled' : ''}`}>
        <div className="perm-card__header">
          <div className="perm-card__icon-ring">
            <span>📍</span>
          </div>
          <div className="perm-card__title-group">
            <h3 className="perm-card__title">Location Services</h3>
            <p className="perm-card__status">
              {location === true && <span className="perm-status perm-status--enabled">● Enabled</span>}
              {location === false && <span className="perm-status perm-status--disabled">● Not Enabled</span>}
              {location === null && <span className="perm-status perm-status--pending">○ Not Set</span>}
            </p>
          </div>
        </div>

        <div className="perm-card__features perm-card__features--compact">
          <div className="perm-feature">
            <span className="perm-feature__icon">🌅</span>
            <span className="perm-feature__name">Sunrise, sunset & solar times</span>
          </div>
          <div className="perm-feature">
            <span className="perm-feature__icon">🌙</span>
            <span className="perm-feature__name">Accurate moon & planetary transits</span>
          </div>
          <div className="perm-feature">
            <span className="perm-feature__icon">🌿</span>
            <span className="perm-feature__name">Local weather & agricultural guidance</span>
          </div>
        </div>

        {locationError && (
          <div className="perm-card__error" role="alert">{locationError}</div>
        )}

        <button
          className={`perm-card__btn ${location === true ? 'perm-card__btn--enabled' : ''}`}
          onClick={requestLocation}
          disabled={locationLoading}
          type="button"
        >
          {locationLoading ? '⏳ Requesting...' : location === true ? '✓ Location Active' : 'Enable Location'}
        </button>
      </div>

      {/* Notifications Card */}
      <div className={`perm-card ${notifications === true ? 'perm-card--enabled' : ''} ${notifications === false ? 'perm-card--disabled' : ''}`}>
        <div className="perm-card__header">
          <div className="perm-card__icon-ring">
            <span>🔔</span>
          </div>
          <div className="perm-card__title-group">
            <h3 className="perm-card__title">Notifications</h3>
            <p className="perm-card__status">
              {notifications === true && <span className="perm-status perm-status--enabled">● Enabled</span>}
              {notifications === false && <span className="perm-status perm-status--disabled">● Not Enabled</span>}
              {notifications === null && <span className="perm-status perm-status--pending">○ Not Set</span>}
            </p>
          </div>
        </div>

        <div className="perm-notif-grid">
          {NOTIF_CATEGORIES.map((cat) => (
            <div key={cat.label} className="perm-notif-category">
              <div className="perm-notif-category__header">
                <span className="perm-notif-category__icon">{cat.icon}</span>
                <span className="perm-notif-category__label">{cat.label}</span>
              </div>
              <ul className="perm-notif-category__list">
                {cat.items.map((item) => (
                  <li key={item} className="perm-notif-category__item">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {notifError && (
          <div className="perm-card__error" role="alert">{notifError}</div>
        )}

        <button
          className={`perm-card__btn ${notifications === true ? 'perm-card__btn--enabled' : ''}`}
          onClick={requestNotifications}
          disabled={notifLoading}
          type="button"
        >
          {notifLoading ? '⏳ Requesting...' : notifications === true ? '✓ Notifications Active' : 'Enable Notifications'}
        </button>
      </div>

      {/* Actions */}
      <div className="setup-step__actions">
        <button className="setup-btn setup-btn--ghost" onClick={onBack} type="button">{strings.back}</button>
        <button className="setup-btn setup-btn--ghost" onClick={handleSkip} type="button">{strings.skip}</button>
        <button className="setup-btn setup-btn--primary" onClick={onNext} type="button">{strings.next}</button>
      </div>
    </div>
  );
};
