/**
 * Calendar Astro Overlay (Stub)
 * Simplified version for build compatibility
 */

import React from 'react';
import { Planet, ZodiacSign } from '../../types/astrology';

export interface CalendarAstroEvent {
  hekaDay: number;
  hekaMonth: number;
  type: 'moon-phase' | 'planet-ingress' | 'retrograde-start' | 'retrograde-end' | 'aspect' | 'void-of-course' | 'power-day';
  planet?: Planet;
  sign?: ZodiacSign;
  moonPhase?: 'new' | 'waxing' | 'full' | 'waning';
  description?: string;
  powerLevel?: 'low' | 'medium' | 'high' | 'very-high';
}

interface CalendarAstroOverlayProps {
  events: CalendarAstroEvent[];
  hekaMonth: number;
  onDayClick?: (day: number, events: CalendarAstroEvent[]) => void;
}

export const CalendarAstroOverlay: React.FC<CalendarAstroOverlayProps> = ({
  events,
  hekaMonth,
  onDayClick,
}) => {
  // Group events by day
  const eventsByDay = React.useMemo(() => {
    const grouped: Record<number, CalendarAstroEvent[]> = {};
    events
      .filter(e => e.hekaMonth === hekaMonth)
      .forEach(event => {
        if (!grouped[event.hekaDay]) {
          grouped[event.hekaDay] = [];
        }
        grouped[event.hekaDay].push(event);
      });
    return grouped;
  }, [events, hekaMonth]);
  
  // Stub render - just return a simple indicator
  return (
    <div style={{ padding: '10px', background: 'transparent' }}>
      {Object.entries(eventsByDay).slice(0, 5).map(([day, dayEvents]) => (
        <div 
          key={day} 
          onClick={() => onDayClick?.(parseInt(day), dayEvents)}
          style={{ 
            cursor: 'pointer', 
            padding: '4px 8px', 
            margin: '2px 0',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          Day {day}: {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
        </div>
      ))}
    </div>
  );
};

export default CalendarAstroOverlay;
