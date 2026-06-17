/**
 * Void Moon Status Component
 * Displays current void of course moon status and upcoming events
 */

import React, { useState, useEffect, useMemo } from 'react';
import i18n from '../../../i18n';
import './VoidMoon.css';
import { useVoidMoon, useVoidMoonEvents } from '../../hooks/use-swiss';
import { VoidMoonEvent } from '../../types';
import { getSignFromLongitude } from '../../types/core';
import { getZodiacSystemPreference } from '../../services/natal/zodiacHelpers';

// Format duration in hours and minutes
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

// Format date for display
function formatEventDate(date: Date): { day: string; month: string } {
  return {
    day: date.getDate().toString(),
    month: new Intl.DateTimeFormat(i18n.language || 'en', { month: 'short' }).format(date),
  };
}

// Format time for display
function formatEventTime(date: Date): string {
  return new Intl.DateTimeFormat(i18n.language || 'en', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }).format(date);
}

// Get zodiac sign from longitude (uses global zodiac system preference)
function getZodiacSign(longitude: number): string {
  const use13Signs = getZodiacSystemPreference() === '13-sign';
  const sign = getSignFromLongitude(longitude as any, use13Signs);
  // Capitalize first letter
  return sign.charAt(0).toUpperCase() + sign.slice(1);
}

interface VoidMoonStatusProps {
  showCalendar?: boolean;
  maxEvents?: number;
  compact?: boolean;
}

export const VoidMoonStatus: React.FC<VoidMoonStatusProps> = ({
  showCalendar = true,
  maxEvents = 3,
  compact = false,
}) => {
  const { data: voidMoonData, isLoading } = useVoidMoon();
  const { data: events } = useVoidMoonEvents(7); // Next 7 days

  const isActive = voidMoonData?.isVoid ?? false;
  const progress = voidMoonData?.progress ?? 0;

  // Filter upcoming events (not currently active)
  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    return events
      .filter((e: VoidMoonEvent) => e.endTime > now)
      .slice(0, maxEvents);
  }, [events, maxEvents]);

  if (compact) {
    return (
      <div className="sh-card sh-void">
        <div className="sh-card-title">Void Moon</div>
        {isLoading ? (
          <div className="sh-void-status">
            <span className="sh-void-icon">🌑</span>
            <div className="sh-void-info">
              <div className="sh-void-state">Calculating...</div>
            </div>
          </div>
        ) : (
          <>
            <div className={`sh-void-status ${isActive ? 'active' : 'clear'}`}>
              <span className="sh-void-icon">{isActive ? '🌑' : '🌕'}</span>
              <div className="sh-void-info">
                <div className="sh-void-state">
                  {isActive ? 'Void Moon Active' : 'Moon Active'}
                </div>
                <div className="sh-void-desc">
                  {isActive ? 'Avoid new beginnings' : 'Good for new projects'}
                </div>
              </div>
            </div>
            {voidMoonData && (
              <div className="sh-void-next">
                {isActive 
                  ? `Ends ${formatEventTime(voidMoonData.voidEnd!)}`
                  : `Next ${formatEventTime(voidMoonData.nextVoidStart!)}`
                }
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="void-moon-card">
        <div className="void-moon-header">
          <div className="void-moon-icon">🌑</div>
          <div className="void-moon-title-group">
            <h4 className="void-moon-title">Void Moon</h4>
            <p className="void-moon-subtitle">Calculating...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`void-moon-card ${isActive ? 'void-active' : ''}`}>
      {/* Header */}
      <div className="void-moon-header">
        <div className={`void-moon-icon ${isActive ? 'active' : ''}`}>
          {isActive ? '🌑' : '🌕'}
        </div>
        <div className="void-moon-title-group">
          <h4 className="void-moon-title">Void Moon</h4>
          <p className="void-moon-subtitle">
            {isActive 
              ? 'Rest, reflect, avoid new beginnings'
              : 'Good time for new initiatives'
            }
          </p>
        </div>
        <span className={`void-moon-status-badge ${isActive ? 'active' : 'inactive'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Current Status */}
      {voidMoonData && (
        <div className="void-moon-timeline">
          <div className="void-moon-current">
            <span className="void-moon-current-label">
              {isActive ? 'Void Ends' : 'Next Void Begins'}
            </span>
            <span className="void-moon-current-value">
              {isActive && voidMoonData.voidEnd
                ? formatEventTime(voidMoonData.voidEnd)
                : voidMoonData.nextVoidStart
                  ? formatEventTime(voidMoonData.nextVoidStart)
                  : 'Calculating...'
              }
            </span>
          </div>

          {/* Progress Bar */}
          {isActive && (
            <div className="void-moon-progress">
              <div 
                className="void-moon-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Duration */}
          <div className="void-moon-next">
            <span className="void-moon-next-label">
              {isActive ? 'Remaining' : 'Duration'}
            </span>
            <span className="void-moon-next-value">
              {isActive && voidMoonData.remainingMinutes
                ? formatDuration(voidMoonData.remainingMinutes)
                : voidMoonData.nextVoidDuration
                  ? formatDuration(voidMoonData.nextVoidDuration)
                  : '--'
              }
            </span>
          </div>
        </div>
      )}

      {/* Quick Guide */}
      {isActive && (
        <div className="void-moon-guide">
          <h5 className="void-moon-guide-title">Void Moon Practices</h5>
          <p className="void-moon-guide-text">
            Avoid starting new projects, signing contracts, or making major purchases. 
            Good for: meditation, journaling, completing tasks, rest.
          </p>
        </div>
      )}

      {/* Upcoming Events Calendar */}
      {showCalendar && upcomingEvents.length > 0 && (
        <div className="void-moon-calendar">
          <h5 className="void-moon-calendar-title">Upcoming Void Periods</h5>
          <div className="void-moon-calendar-grid">
            {upcomingEvents.map((event: VoidMoonEvent, index: number) => {
              const startDate = formatEventDate(event.startTime);
              const isCurrentlyActive = isActive && index === 0;
              
              return (
                <div 
                  key={index}
                  className={`void-moon-event ${isCurrentlyActive ? 'active' : ''}`}
                >
                  <div className="void-moon-event-date">
                    <div className="void-moon-event-day">{startDate.day}</div>
                    <div className="void-moon-event-month">{startDate.month}</div>
                  </div>
                  <div className="void-moon-event-details">
                    <p className="void-moon-event-time">
                      {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
                    </p>
                    <p className="void-moon-event-sign">
                      From {getZodiacSign(event.fromSignLongitude)} 
                      {' → '}
                      to {getZodiacSign(event.toSignLongitude)}
                    </p>
                  </div>
                  <div className="void-moon-event-duration">
                    <div className="void-moon-event-duration-value">
                      {formatDuration(event.durationMinutes)}
                    </div>
                    <div className="void-moon-event-duration-label">duration</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Mini indicator for dashboard use
export const VoidMoonMini: React.FC = () => {
  return <VoidMoonStatus compact />;
};

// Overlay notification when void moon becomes active
export const VoidMoonOverlay: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { data: voidMoonData } = useVoidMoon();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (voidMoonData?.isVoid && !dismissed) {
      // Small delay for better UX
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [voidMoonData?.isVoid, dismissed]);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    onClose?.();
  };

  if (!visible || !voidMoonData?.isVoid) return null;

  return (
    <div className="void-moon-overlay">
      <button className="void-moon-overlay-close" onClick={handleClose} aria-label={i18n.t('close')}>
        ×
      </button>
      <div className="void-moon-overlay-header">
        <span className="void-moon-overlay-icon">🌑</span>
        <h4 className="void-moon-overlay-title">Void Moon Active</h4>
      </div>
      <p className="void-moon-overlay-text">
        The Moon is now void of course. A time for rest and reflection rather than new beginnings. 
        Void ends at {voidMoonData.voidEnd ? formatEventTime(voidMoonData.voidEnd) : '...'}
      </p>
    </div>
  );
};

export default VoidMoonStatus;
