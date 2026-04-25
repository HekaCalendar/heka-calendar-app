/**
 * Schedule Step
 * Generated weekly schedule visualized as a grid
 */

import React from 'react';
import type { ScheduleSlot } from '../routineData';
import { getCategoryColor } from '../routineUtils';

interface Props {
  slots: ScheduleSlot[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ScheduleStep: React.FC<Props> = ({ slots }) => {
  // Group slots by day
  const byDay: Record<number, ScheduleSlot[]> = {};
  for (let i = 0; i < 7; i++) byDay[i] = [];
  for (const slot of slots) {
    if (!byDay[slot.dayOfWeek]) byDay[slot.dayOfWeek] = [];
    byDay[slot.dayOfWeek].push(slot);
  }
  for (let i = 0; i < 7; i++) {
    byDay[i].sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime));
  }

  return (
    <div className="routine-fade-in">
      <div className="routine-section">
        <div className="routine-section-title">Your Generated Routine</div>
        <div className="routine-section-subtitle">
          A personalized weekly schedule based on your inputs.
        </div>

        {/* Day columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 20 }}>
          {DAYS.map((day, i) => (
            <div key={day} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{day}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 200 }}>
                {byDay[i].map((slot) => (
                  <div
                    key={`${slot.dayOfWeek}-${slot.startTime}-${slot.sourceId}`}
                    style={{
                      background: getCategoryColor(slot.category),
                      borderRadius: 8,
                      padding: '8px 10px',
                      fontSize: 11,
                      color: '#fff',
                      textAlign: 'left',
                      opacity: slot.type === 'lifestyle' ? 0.7 : 1,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{slot.name}</div>
                    <div style={{ fontSize: 10, opacity: 0.9 }}>{slot.startTime}–{slot.endTime}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', fontSize: 11 }}>
          {(['task', 'goal', 'lifestyle'] as const).map(type => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: type === 'task' ? '#8b5cf6' : type === 'goal' ? '#d4af37' : '#22c55e' }} />
              <span style={{ color: '#a1a1aa', textTransform: 'capitalize' }}>{type}s</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default ScheduleStep;
