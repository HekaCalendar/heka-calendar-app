/**
 * Routine Uploader
 * Modal for uploading .hekaroutine files from calendar grid
 */

import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addNote } from '../../store';
import { parseRoutineFile, type RoutineFile, getTodayISODate } from './routineData';
import { hekaToCivil } from '../../services/calendarService';
import type { RecurringConfig } from '../../types';
import { addDaysToHekaDate, hekaDateFromISO, daysToTargetDayOfWeek, durationLabel } from './routineUtils';

interface Props {
  onClose: () => void;
}

export const RoutineUploader: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<RoutineFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [startDate, setStartDate] = useState(getTodayISODate());
  const [durationWeeks, setDurationWeeks] = useState(52);

  const handleFile = (file: File) => {
    setError(null);
    setParsed(null);

    if (file.size > 500 * 1024) {
      setError('File too large (max 500KB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const routine = parseRoutineFile(text);
      if (!routine) {
        setError('Invalid routine file');
        return;
      }
      setParsed(routine);
      setStartDate(routine.startDate || getTodayISODate());
      setDurationWeeks(routine.durationWeeks || 52);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const handleApply = () => {
    if (!parsed) return;

    const routine = parsed;
    const effectiveStart = hekaDateFromISO(startDate);
    const effectiveDuration = durationWeeks;
    const routineId = routine.routineId || `routine_${Date.now()}`;
    const routineName = routine.name;

    // Calculate end date for recurring config
    const endCivil = hekaToCivil(effectiveStart);
    endCivil.setDate(endCivil.getDate() + effectiveDuration * 7);

    // Deduplicate slots by unique (dayOfWeek, startTime, endTime, name)
    const slotMap = new Map<string, typeof routine.schedule[0]>();
    for (const slot of routine.schedule) {
      const key = `${slot.dayOfWeek}|${slot.startTime}|${slot.endTime}|${slot.name}`;
      if (!slotMap.has(key)) slotMap.set(key, slot);
    }

    for (const slot of slotMap.values()) {
      // FIX: Map slot.dayOfWeek to correct calendar date based on startDate's day of week
      const daysOffset = daysToTargetDayOfWeek(effectiveStart, slot.dayOfWeek);
      const targetDate = addDaysToHekaDate(effectiveStart, daysOffset);
      const dayKey = `heka:${targetDate.year}:${targetDate.month}:${targetDate.day}`;

      const tags = [
        'routine',
        slot.type,
        `routine:${routineId}`,
        ...(slot.tags || []),
      ].filter(Boolean);

      const recurring: RecurringConfig = {
        enabled: true,
        frequency: 'weekly',
        interval: 1,
        endDate: endCivil,
      };

      dispatch(addNote({
        key: dayKey,
        content: `${slot.startTime}–${slot.endTime}: ${slot.name} (${routineName})`,
        category: slot.category,
        tags,
        recurring,
      }));
    }

    setApplied(true);
  };

  if (applied) {
    return (
      <div className="routine-uploader-overlay" onClick={onClose}>
        <div className="routine-uploader-panel" onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#d4af37', marginBottom: 8 }}>
            Routine Applied!
          </div>
          <div style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 8 }}>
            Starting <strong>{startDate}</strong> for <strong>{durationLabel(durationWeeks)}</strong>.
          </div>
          <div style={{ fontSize: 13, color: '#a1a1aa' }}>
            {parsed?.schedule.length} blocks added to your calendar.
          </div>
          <button className="routine-nav-btn routine-nav-btn--next" style={{ marginTop: 20 }} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="routine-uploader-overlay" onClick={onClose}>
      <div className="routine-uploader-panel" onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: '#d4af37', marginBottom: 8 }}>
          Import Routine
        </div>
        <div style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 16 }}>
          Upload a previously exported <code>.hekaroutine.json</code> file
        </div>

        {!parsed ? (
          <>
            <div
              className="routine-uploader-drop"
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
              <div>Tap to select file</div>
              <div style={{ fontSize: 11, color: '#71717a', marginTop: 4 }}>.json or .hekaroutine</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.hekaroutine,application/json"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </>
        ) : (
          <div style={{ textAlign: 'left', marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f8f7f5', marginBottom: 4 }}>{parsed.name}</div>
            <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 12 }}>
              {parsed.existingTasks.length} tasks · {parsed.goals.length} goals · {parsed.schedule.length} schedule blocks
            </div>
            <div style={{ fontSize: 11, color: '#71717a', marginBottom: 16 }}>
              Wake {parsed.lifestyle.wakeTime} · Bed {parsed.lifestyle.bedtime} · {parsed.lifestyle.sleepHours}h sleep
            </div>

            {/* Override settings */}
            <div className="routine-section" style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 8 }}>Apply Settings</div>
              <div className="routine-form-row">
                <div className="routine-field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
                <div className="routine-field">
                  <label>Duration: {durationLabel(durationWeeks)}</label>
                  <div className="routine-slider">
                    <input
                      type="range"
                      min={1}
                      max={208}
                      step={1}
                      value={durationWeeks}
                      onChange={e => setDurationWeeks(parseInt(e.target.value))}
                    />
                    <span className="routine-slider-value">{durationWeeks}w</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: '#fca5a5', fontSize: 13, marginBottom: 12 }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="routine-nav-btn routine-nav-btn--back" onClick={onClose}>Cancel</button>
          {parsed && (
            <button className="routine-nav-btn routine-nav-btn--next" onClick={handleApply}>
              Apply to Calendar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutineUploader;
