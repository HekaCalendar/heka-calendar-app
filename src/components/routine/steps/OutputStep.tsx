/**
 * Output Step
 * Apply to calendar, download JSON, or start over
 * With configurable name, duration, and start date
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RoutineFile } from '../routineData';
import { downloadRoutineFile } from '../routineData';
import { durationLabel } from '../routineUtils';

interface Props {
  routine: RoutineFile;
  onApply: () => void;
  onRestart: () => void;
  onChange: (updates: Partial<RoutineFile>) => void;
}

export const OutputStep: React.FC<Props> = ({ routine, onApply, onRestart, onChange }) => {
  const { t } = useTranslation();
  const [applied, setApplied] = useState(false);


  const handleApply = () => {
    onApply();
    setApplied(true);
  };

  const handleDownload = () => {
    downloadRoutineFile(routine);
  };



  if (applied) {
    return (
      <div className="routine-output routine-fade-in">
        <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: '#d4af37', marginBottom: 8 }}>
          Routine Applied!
        </div>
        <div style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 8, textAlign: 'center' }}>
          Your schedule has been added to the calendar starting <strong>{routine.startDate}</strong>.
        </div>
        <div style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 24, textAlign: 'center' }}>
          Duration: <strong>{durationLabel(routine.durationWeeks)}</strong> · {routine.schedule.length} weekly blocks
        </div>
        <button className="routine-output-btn routine-output-btn--restart" onClick={onRestart}>
          🔄 Create Another Routine
        </button>
      </div>
    );
  }

  return (
    <div className="routine-output routine-fade-in">
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: '#d4af37', marginBottom: 8 }}>
        Your Routine is Ready
      </div>
      <div style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 24, textAlign: 'center' }}>
        {routine.schedule.length} time blocks across your week
      </div>

      {/* Routine Settings */}
      <div className="routine-section" style={{ marginBottom: 20, textAlign: 'left' }}>
        <div className="routine-section-title" style={{ fontSize: 14 }}>Routine Settings</div>

        <div className="routine-field" style={{ marginTop: 12 }}>
          <label>Routine Name</label>
          <input
            type="text"
            value={routine.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder={t('outputNamePlaceholder', 'Output name...')}
          />
        </div>

        <div className="routine-form-row">
          <div className="routine-field">
            <label>Start Date</label>
            <input
              type="date"
              value={routine.startDate}
              onChange={e => onChange({ startDate: e.target.value })}
            />
          </div>
          <div className="routine-field">
            <label>Duration: {durationLabel(routine.durationWeeks)}</label>
            <div className="routine-slider">
              <input
                type="range"
                min={1}
                max={208}
                step={1}
                value={routine.durationWeeks}
                onChange={e => onChange({ durationWeeks: parseInt(e.target.value) })}
              />
              <span className="routine-slider-value">{routine.durationWeeks}w</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>
          The routine will repeat weekly from <strong>{routine.startDate}</strong> for <strong>{durationLabel(routine.durationWeeks)}</strong>.
        </div>
      </div>

      <button className="routine-output-btn routine-output-btn--apply" onClick={handleApply}>
        ✨ Apply to Calendar
      </button>
      <button className="routine-output-btn routine-output-btn--download" onClick={handleDownload}>
        💾 Download Routine File
      </button>
      <button className="routine-output-btn routine-output-btn--restart" onClick={onRestart}>
        🔄 Start Over
      </button>
    </div>
  );
};

export default OutputStep;
