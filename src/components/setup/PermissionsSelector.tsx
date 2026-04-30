/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PERMISSIONS SELECTOR — Location & Notifications
 * Visual cards explaining features. Native permission requests.
 * Skippable. Enterprise grade.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setLocationEnabled, setNotificationsEnabled } from '../../store/setupSlice';
import { resetNotificationPreferences } from '../../store';
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

  // Apply to Redux whenever state changes
  useEffect(() => {
    dispatch(setLocationEnabled(location ?? false));
  }, [dispatch, location]);

  useEffect(() => {
    dispatch(setNotificationsEnabled(notifications ?? false));
    if (notifications === true) {
      // Enable ALL notification channels with defaults
      dispatch(resetNotificationPreferences());
    }
  }, [dispatch, notifications]);

  const requestLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      // Try browser geolocation first (works in Capacitor WebView too)
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
    // Mark as "set up later" — null in setup, but store false for now
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

        <div className="perm-card__features">
          <div className="perm-feature">
            <span className="perm-feature__icon">🌤️</span>
            <div>
              <span className="perm-feature__name">Local Weather</span>
              <span className="perm-feature__desc">Current conditions &amp; forecasts for your area</span>
            </div>
          </div>
          <div className="perm-feature">
            <span className="perm-feature__icon">🌅</span>
            <div>
              <span className="perm-feature__name">Sunrise &amp; Sunset</span>
              <span className="perm-feature__desc">Accurate solar times for your coordinates</span>
            </div>
          </div>
          <div className="perm-feature">
            <span className="perm-feature__icon">🌙</span>
            <div>
              <span className="perm-feature__name">Moon &amp; Transits</span>
              <span className="perm-feature__desc">Swiss Ephemeris celestial calculations for your location</span>
            </div>
          </div>
          <div className="perm-feature">
            <span className="perm-feature__icon">🌿</span>
            <div>
              <span className="perm-feature__name">Agricultural Guidance</span>
              <span className="perm-feature__desc">Planting advice based on local climate &amp; moon phase</span>
            </div>
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

        <div className="perm-card__features">
          <div className="perm-feature">
            <span className="perm-feature__icon">📅</span>
            <div>
              <span className="perm-feature__name">Calendar Alerts</span>
              <span className="perm-feature__desc">Holiday reminders &amp; HEKA date transitions</span>
            </div>
          </div>
          <div className="perm-feature">
            <span className="perm-feature__icon">✨</span>
            <div>
              <span className="perm-feature__name">Celestial Events</span>
              <span className="perm-feature__desc">Retrograde alerts, void moon, daily tips</span>
            </div>
          </div>
          <div className="perm-feature">
            <span className="perm-feature__icon">📜</span>
            <div>
              <span className="perm-feature__name">Task Reminders</span>
              <span className="perm-feature__desc">Due dates, daily briefings &amp; streak savers</span>
            </div>
          </div>
          <div className="perm-feature">
            <span className="perm-feature__icon">🌟</span>
            <div>
              <span className="perm-feature__name">Cosmic Circle</span>
              <span className="perm-feature__desc">Friend requests, messages &amp; shared tasks</span>
            </div>
          </div>
          <div className="perm-feature">
            <span className="perm-feature__icon">🤖</span>
            <div>
              <span className="perm-feature__name">HEKA AI Coach</span>
              <span className="perm-feature__desc">Personalized celestial guidance &amp; synchronicity alerts</span>
            </div>
          </div>
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
