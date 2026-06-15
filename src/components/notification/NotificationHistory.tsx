/**
 * Notification History
 * Shows recently delivered notifications from the engine ledger.
 * Displays delivery status: scheduled, delivered, or failed.
 */

import { useState, useEffect, useCallback } from 'react';
import { NotificationEngine } from '../../services/notificationEngine';
import { eventBus } from '../../services/eventBus';
import type { DeliveredNotification } from '../../types/notifications';

const TIER_ICONS: Record<string, string> = {
  core: '🔴',
  standard: '🟡',
  ambient: '🔵',
};

const SECTION_ICONS: Record<string, string> = {
  calendar: '📅',
  stars: '✨',
  circle: '👥',
  journal: '📓',
  planner: '📋',
};

type DeliveryStatus = 'scheduled' | 'delivered';

function getDeliveryStatus(item: DeliveredNotification): DeliveryStatus {
  if (item.confirmedDeliveredAt) return 'delivered';
  return 'scheduled';
}

const STATUS_STYLES: Record<DeliveryStatus, { bg: string; border: string; color: string; label: string }> = {
  scheduled: {
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    color: '#f59e0b',
    label: 'Scheduled',
  },
  delivered: {
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    color: '#10b981',
    label: 'Delivered',
  },
};

export const NotificationHistory: React.FC = () => {
  const [history, setHistory] = useState<DeliveredNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const refresh = useCallback(() => {
    setHistory(NotificationEngine.getHistory(5));
  }, []);

  useEffect(() => {
    if (isOpen) {
      refresh();
    }
  }, [isOpen, refresh]);

  // Real-time updates: refresh when a new notification is sent or delivered
  useEffect(() => {
    const unsubSent = eventBus.subscribe('heka-notification-sent', () => {
      refresh();
    });
    const unsubDelivered = eventBus.subscribe('heka-notification-delivered', () => {
      refresh();
    });
    return () => {
      unsubSent();
      unsubDelivered();
    };
  }, [refresh]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#e0e0e0',
          fontSize: '13px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>📜</span>
        <span>Notification History</span>
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(224,224,224,0.4)' }}>View recent</span>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
    }} onClick={() => setIsOpen(false)}>
      <div style={{
        width: '90%',
        maxWidth: '480px',
        maxHeight: '80vh',
        background: '#0f0f1e',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#e0e0e0' }}>
            📜 Notification History
          </h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close notification history" style={{
            background: 'none',
            border: 'none',
            color: 'rgba(224,224,224,0.6)',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Legend */}
        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          color: 'rgba(224,224,224,0.5)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            Scheduled
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            Delivered
          </span>
        </div>

        {/* List */}
        <div style={{ padding: '12px 20px', overflowY: 'auto', flex: 1 }}>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(224,224,224,0.4)', fontSize: '13px', marginTop: '32px' }}>
              No notifications delivered yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((item, i) => {
                const date = new Date(item.deliveredAt);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                const status = getDeliveryStatus(item);
                const style = STATUS_STYLES[status];
                return (
                  <div key={`${item.id}-${i}`} style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px' }}>{TIER_ICONS[item.tier] || '⚪'} {SECTION_ICONS[item.section] || ''}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(224,224,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.type}
                      </span>
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: style.bg,
                        border: `1px solid ${style.border}`,
                        color: style.color,
                      }}>
                        {style.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(224,224,224,0.35)' }}>
                        {dateStr} {timeStr}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#e0e0e0', lineHeight: 1.4, marginTop: '2px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginTop: '2px', lineHeight: 1.4 }}>
                      {item.body}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationHistory;
