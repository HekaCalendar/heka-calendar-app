/**
 * Transit Notifications Component
 * Real-time alerts for significant personal transits
 */

import { useState, useEffect, useCallback } from 'react';
import type { TransitNotification } from '../oracle/birthChartIntegration';
import '../styles/transit-notifications.css';

interface TransitNotificationsProps {
  notifications: TransitNotification[];
  onDismiss?: (id: string) => void;
}

export const TransitNotifications: React.FC<TransitNotificationsProps> = ({
  notifications,
  onDismiss,
}) => {
  const [activeNotifications, setActiveNotifications] = useState<TransitNotification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Filter out dismissed and expired notifications
  useEffect(() => {
    const now = new Date();
    const filtered = notifications.filter(n => {
      if (dismissedIds.has(n.id)) return false;
      if (new Date(n.expiresAt) < now) return false;
      return true;
    });
    setActiveNotifications(filtered);
  }, [notifications, dismissedIds]);

  const handleDismiss = useCallback((id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
    onDismiss?.(id);
  }, [onDismiss]);

  const handleDismissAll = useCallback(() => {
    activeNotifications.forEach(n => {
      setDismissedIds(prev => new Set(prev).add(n.id));
      onDismiss?.(n.id);
    });
  }, [activeNotifications, onDismiss]);

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <div className="transit-notifications-container">
      <div className="transit-notifications-header">
        <h4 className="transit-notifications-title">
          <span className="transit-notifications-icon">✦</span>
          Celestial Alerts
          <span className="transit-notifications-count">{activeNotifications.length}</span>
        </h4>
        {activeNotifications.length > 1 && (
          <button className="transit-notifications-dismiss-all" onClick={handleDismissAll}>
            Dismiss all
          </button>
        )}
      </div>

      <div className="transit-notifications-list">
        {activeNotifications.map((notification, index) => (
          <TransitNotificationCard
            key={notification.id}
            notification={notification}
            index={index}
            onDismiss={() => handleDismiss(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Notification Card
const TransitNotificationCard: React.FC<{
  notification: TransitNotification;
  index: number;
  onDismiss: () => void;
}> = ({ notification, index, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Staggered entrance animation
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'major':
        return {
          borderColor: '#22c55e',
          icon: '✦',
          label: 'Major Transit',
        };
      case 'moderate':
        return {
          borderColor: '#3b82f6',
          icon: '☆',
          label: 'Moderate',
        };
      default:
        return {
          borderColor: '#eab308',
          icon: '✧',
          label: 'Subtle',
        };
    }
  };

  const styles = getTypeStyles(notification.type);

  return (
    <div
      className={`transit-notification-card transit-notification-${notification.type} ${isVisible ? 'visible' : ''} ${isExpanded ? 'expanded' : ''}`}
      style={{ borderLeftColor: styles.borderColor }}
    >
      <div className="transit-notification-header-bar">
        <div 
          className="transit-notification-type-icon"
          style={{ color: styles.borderColor }}
        >
          {styles.icon}
        </div>
        <span className="transit-notification-type-label">{styles.label}</span>
        <span 
          className="transit-notification-strength-badge"
          style={{ background: styles.borderColor }}
        >
          {notification.transit.strength}%
        </span>
        <button className="transit-notification-expand" onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'Collapse details' : 'Expand details'}>
          {isExpanded ? '▼' : '▶'}
        </button>
        <button className="transit-notification-dismiss" onClick={onDismiss} aria-label="Dismiss transit notification">×</button>
      </div>

      <div className="transit-notification-content">
        <h5 className="transit-notification-heading">{notification.title}</h5>
        <p className="transit-notification-description">{notification.description}</p>

        {isExpanded && (
          <div className="transit-notification-expanded">
            <div className="transit-notification-details">
              <div className="transit-detail-row">
                <span className="transit-detail-label">Life Area:</span>
                <span className="transit-detail-value">{notification.transit.lifeArea}</span>
              </div>
              <div className="transit-detail-row">
                <span className="transit-detail-label">Orb:</span>
                <span className="transit-detail-value">{notification.transit.orb.toFixed(1)}°</span>
              </div>
              <div className="transit-detail-row">
                <span className="transit-detail-label">Duration:</span>
                <span className="transit-detail-value">
                  Until {new Date(notification.expiresAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {notification.actionItems.length > 0 && (
              <div className="transit-notification-actions-list">
                <span className="transit-actions-label">Suggested Actions:</span>
                <ul>
                  {notification.actionItems.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {notification.transit.isChartRulerActivated && (
              <div className="transit-notification-special">
                <span className="transit-special-tag">⭐ Chart Ruler</span>
                <span>This transit activates your ruling planet—pay special attention to themes of identity and self-expression.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransitNotifications;
