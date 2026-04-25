/**
 * Review Step
 * Summary of all inputs before generating the schedule
 */

import React from 'react';
import type { RoutineFile } from '../routineData';
import { getRoutineStats } from '../routineData';
import { durationLabel } from '../routineUtils';

interface Props {
  routine: RoutineFile;
}

export const ReviewStep: React.FC<Props> = ({ routine }) => {
  const stats = getRoutineStats(routine);



  return (
    <div className="routine-fade-in">
      <div className="routine-section">
        <div className="routine-section-title">Review Your Routine</div>
        <div className="routine-section-subtitle">
          Here's what we'll use to build your schedule.
        </div>

        {stats.isOvercommitted && (
          <div className="routine-warning">
            <span>⚠️</span>
            <span>You've committed <strong>{stats.totalCommittedHours}h</strong> but only have <strong>{stats.availableHours}h</strong> awake per week. Consider reducing tasks or goals.</span>
          </div>
        )}

        <div className="routine-stats">
          <div className="routine-stat-card">
            <div className={`routine-stat-value ${stats.isOvercommitted ? 'is-warning' : ''}`}>{stats.totalCommittedHours}h</div>
            <div className="routine-stat-label">Committed / week</div>
          </div>
          <div className="routine-stat-card">
            <div className="routine-stat-value">{stats.availableHours}h</div>
            <div className="routine-stat-label">Available / week</div>
          </div>
          <div className="routine-stat-card">
            <div className="routine-stat-value">{routine.existingTasks.length}</div>
            <div className="routine-stat-label">Tasks</div>
          </div>
          <div className="routine-stat-card">
            <div className="routine-stat-value">{routine.goals.length}</div>
            <div className="routine-stat-label">Goals</div>
          </div>
        </div>

        <div className="routine-item-meta" style={{ marginTop: 12, textAlign: 'center', fontSize: 12 }}>
          <span><strong>{routine.name}</strong></span>
          <span> · </span>
          <span>Starts {routine.startDate}</span>
          <span> · </span>
          <span>Runs for {durationLabel(routine.durationWeeks)}</span>
        </div>
      </div>

      <div className="routine-section">
        <div className="routine-section-title">Lifestyle</div>
        <div className="routine-item-meta" style={{ lineHeight: 2 }}>
          <div>Wake: <strong>{routine.lifestyle.wakeTime}</strong> · Bed: <strong>{routine.lifestyle.bedtime}</strong> · Sleep: <strong>{routine.lifestyle.sleepHours}h</strong></div>
          <div>Breakfast: <strong>{routine.lifestyle.mealTimes.breakfast}</strong> · Lunch: <strong>{routine.lifestyle.mealTimes.lunch}</strong> · Dinner: <strong>{routine.lifestyle.mealTimes.dinner}</strong></div>
        </div>
      </div>

      {routine.existingTasks.length > 0 && (
        <div className="routine-section">
          <div className="routine-section-title">Tasks</div>
          <div className="routine-list">
            {routine.existingTasks.map(t => (
              <div key={t.id} className="routine-item" style={{ padding: 12 }}>
                <div className="routine-item-name" style={{ fontSize: 14 }}>{t.name}</div>
                {t.description && (
                  <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>{t.description}</div>
                )}
                <div className="routine-item-meta" style={{ fontSize: 11 }}>
                  <span>{t.durationMinutes} min</span>
                  <span>·</span>
                  <span>{t.frequency}</span>
                  <span>·</span>
                  <span>{t.timePreference}</span>
                  <span>·</span>
                  <span>{t.priority}</span>
                  {t.tags.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{t.tags.join(', ')}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {routine.goals.length > 0 && (
        <div className="routine-section">
          <div className="routine-section-title">Goals</div>
          <div className="routine-list">
            {routine.goals.map(g => (
              <div key={g.id} className="routine-item" style={{ padding: 12 }}>
                <div className="routine-item-name" style={{ fontSize: 14 }}>{g.name}</div>
                {g.description && (
                  <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>{g.description}</div>
                )}
                <div className="routine-item-meta" style={{ fontSize: 11 }}>
                  <span>{Math.round(g.weeklyMinutes / 60 * 10) / 10}h/week</span>
                  <span>·</span>
                  <span>{g.timeframe}</span>
                  <span>·</span>
                  <span>{g.priority} priority</span>
                  {g.preferredDays && g.preferredDays.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{g.preferredDays.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')}</span>
                    </>
                  )}
                  {g.preferredTime && (
                    <>
                      <span>·</span>
                      <span>{g.preferredTime}</span>
                    </>
                  )}
                  {g.tags.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{g.tags.join(', ')}</span>
                    </>
                  )}
                  {g.deadline && <span>· Due {g.deadline}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
