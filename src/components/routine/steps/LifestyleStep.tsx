/**
 * Lifestyle Step
 * Wake time, bedtime, sleep hours (auto-derived), meal times
 */

import React, { useEffect } from 'react';
import type { LifestyleConstraints } from '../routineData';
import { calculateSleepHours } from '../routineUtils';

interface Props {
  data: LifestyleConstraints;
  onChange: (data: LifestyleConstraints) => void;
}

export const LifestyleStep: React.FC<Props> = ({ data, onChange }) => {
  // Auto-sync sleepHours slider whenever wake/bed changes
  useEffect(() => {
    const derived = calculateSleepHours(data.bedtime, data.wakeTime);
    if (Math.abs(derived - data.sleepHours) > 0.1) {
      onChange({ ...data, sleepHours: derived });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.wakeTime, data.bedtime]);

  const update = (field: keyof LifestyleConstraints, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  const updateMeal = (meal: keyof LifestyleConstraints['mealTimes'], value: string) => {
    onChange({ ...data, mealTimes: { ...data.mealTimes, [meal]: value } });
  };

  return (
    <div className="routine-fade-in">
      <div className="routine-section">
        <div className="routine-section-title">Your Daily Rhythm</div>
        <div className="routine-section-subtitle">
          We'll use this to build your schedule around your natural energy cycles.
        </div>

        <div className="routine-form-row">
          <div className="routine-field">
            <label>Wake Time</label>
            <input
              type="time"
              value={data.wakeTime}
              onChange={e => update('wakeTime', e.target.value)}
            />
          </div>
          <div className="routine-field">
            <label>Bedtime</label>
            <input
              type="time"
              value={data.bedtime}
              onChange={e => update('bedtime', e.target.value)}
            />
          </div>
        </div>

        <div className="routine-field" style={{ marginTop: 16 }}>
          <label>Sleep Hours: {data.sleepHours}h <span className="routine-field-hint">(auto-calculated from wake & bed)</span></label>
          <div className="routine-slider">
            <input
              type="range"
              min={4}
              max={12}
              step={0.5}
              value={data.sleepHours}
              onChange={e => update('sleepHours', parseFloat(e.target.value))}
            />
            <span className="routine-slider-value">{data.sleepHours}h</span>
          </div>
        </div>
      </div>

      <div className="routine-section">
        <div className="routine-section-title">Meal Times</div>
        <div className="routine-form-row">
          <div className="routine-field">
            <label>Breakfast</label>
            <input
              type="time"
              value={data.mealTimes.breakfast}
              onChange={e => updateMeal('breakfast', e.target.value)}
            />
          </div>
          <div className="routine-field">
            <label>Lunch</label>
            <input
              type="time"
              value={data.mealTimes.lunch}
              onChange={e => updateMeal('lunch', e.target.value)}
            />
          </div>
          <div className="routine-field">
            <label>Dinner</label>
            <input
              type="time"
              value={data.mealTimes.dinner}
              onChange={e => updateMeal('dinner', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleStep;
