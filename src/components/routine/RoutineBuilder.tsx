/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ROUTINE BUILDER — Main Wizard Component
 * 6-step flow: Lifestyle → Tasks → Goals → Review → Schedule → Output
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addNote } from '../../store';
import {
  createEmptyRoutine,
  generateSchedule,
  validateRoutine,
  getRoutineStats,
  type RoutineFile,
  type ScheduleSlot,
} from './routineData';
import { ROUTINE_CSS } from './routineCss';
import { LifestyleStep } from './steps/LifestyleStep';
import { TasksStep } from './steps/TasksStep';
import { GoalsStep } from './steps/GoalsStep';
import { ReviewStep } from './steps/ReviewStep';
import { ScheduleStep } from './steps/ScheduleStep';
import { OutputStep } from './steps/OutputStep';
import { getTodayHekaDate, hekaToCivil } from '../../services/calendarService';
import type { RecurringConfig } from '../../types';
import { addDaysToHekaDate, hekaDateFromISO, daysToTargetDayOfWeek } from './routineUtils';

type BuilderStep = 'lifestyle' | 'tasks' | 'goals' | 'review' | 'schedule' | 'output';

const STEPS: { id: BuilderStep; label: string }[] = [
  { id: 'lifestyle', label: 'Rhythm' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'goals', label: 'Goals' },
  { id: 'review', label: 'Review' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'output', label: 'Export' },
];

export const RoutineBuilder: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState<BuilderStep>('lifestyle');
  const [routine, setRoutine] = useState<RoutineFile>(createEmptyRoutine());
  const contentRef = useRef<HTMLDivElement>(null);

  // Inject CSS
  React.useEffect(() => {
    const styleId = 'heka-routine-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = ROUTINE_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  const updateRoutine = (updates: Partial<RoutineFile>) => {
    setRoutine(prev => ({ ...prev, ...updates }));
  };

  const generate = useCallback(() => {
    const schedule = generateSchedule(routine.existingTasks, routine.goals, routine.lifestyle);
    updateRoutine({ schedule });
    setStep('schedule');
  }, [routine]);

  const applyToCalendar = useCallback(() => {
    const startDate = routine.startDate ? hekaDateFromISO(routine.startDate) : getTodayHekaDate();
    const routineId = routine.routineId;
    const routineName = routine.name;
    const durationWeeks = routine.durationWeeks;

    // Calculate end date for recurring config
    const endCivil = hekaToCivil(startDate);
    endCivil.setDate(endCivil.getDate() + durationWeeks * 7);

    // Group schedule slots by (dayOfWeek) to inject one recurring note per unique weekly slot
    const slotMap = new Map<string, ScheduleSlot>();
    for (const slot of routine.schedule) {
      const key = `${slot.dayOfWeek}|${slot.startTime}|${slot.endTime}|${slot.name}`;
      if (!slotMap.has(key)) slotMap.set(key, slot);
    }

    for (const slot of slotMap.values()) {
      // FIX: Map slot.dayOfWeek to the correct calendar date based on startDate's day of week
      const daysOffset = daysToTargetDayOfWeek(startDate, slot.dayOfWeek);
      const targetDate = addDaysToHekaDate(startDate, daysOffset);
      const dayKey = `heka:${targetDate.year}:${targetDate.month}:${targetDate.day}`;

      const tags = [
        'routine',
        slot.type,
        `routine:${routineId}`,
        ...slot.tags,
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
  }, [routine, dispatch]);

  const goBack = () => {
    if (step === 'lifestyle') {
      navigate('/');
    } else {
      const idx = STEPS.findIndex(s => s.id === step);
      setStep(STEPS[idx - 1].id);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'lifestyle': return true;
      case 'tasks': return routine.existingTasks.length > 0;
      case 'goals': return true;
      case 'review': {
        const validationError = validateRoutine(routine);
        if (validationError) return false;
        const stats = getRoutineStats(routine);
        return !stats.isOvercommitted;
      }
      case 'schedule': return routine.schedule.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 'review') {
      generate();
    } else if (step === 'schedule') {
      setStep('output');
    } else {
      const idx = STEPS.findIndex(s => s.id === step);
      setStep(STEPS[idx + 1].id);
    }
  };

  const handleRestart = () => {
    setRoutine(createEmptyRoutine());
    setStep('lifestyle');
  };

  const stepIndex = STEPS.findIndex(s => s.id === step);

  // Scroll to top on step change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <div className="routine-builder">
      {/* Header */}
      <header className="routine-header">
        <button className="routine-back" onClick={goBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {step === 'lifestyle' ? 'Store' : 'Back'}
        </button>
        <div className="routine-title">Routine Builder</div>
        <div className="routine-step-label">{STEPS[stepIndex].label}</div>
      </header>

      {/* Step indicator */}
      <div className="routine-steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="routine-step" title={s.label}>
              <div className={`routine-step-dot ${i === stepIndex ? 'is-active' : i < stepIndex ? 'is-complete' : ''}`} />
              <div className={`routine-step-label-text ${i === stepIndex ? 'is-active' : ''}`}>{s.label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`routine-step-line ${i < stepIndex ? 'is-complete' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div className="routine-content" ref={contentRef}>
        {step === 'lifestyle' && (
          <LifestyleStep data={routine.lifestyle} onChange={ls => updateRoutine({ lifestyle: ls })} />
        )}
        {step === 'tasks' && (
          <TasksStep tasks={routine.existingTasks} onChange={tasks => updateRoutine({ existingTasks: tasks })} />
        )}
        {step === 'goals' && (
          <GoalsStep goals={routine.goals} onChange={goals => updateRoutine({ goals })} />
        )}
        {step === 'review' && <ReviewStep routine={routine} />}
        {step === 'schedule' && <ScheduleStep slots={routine.schedule} />}
        {step === 'output' && (
          <OutputStep
            routine={routine}
            onApply={applyToCalendar}
            onRestart={handleRestart}
            onChange={updateRoutine}
          />
        )}
      </div>

      {/* Navigation */}
      {step !== 'output' && (
        <div className="routine-nav">
          <button className="routine-nav-btn routine-nav-btn--back" onClick={goBack}>
            {step === 'lifestyle' ? 'Cancel' : 'Back'}
          </button>
          <button
            className="routine-nav-btn routine-nav-btn--next"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === 'review' ? 'Generate Schedule →' : step === 'schedule' ? 'Continue →' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutineBuilder;
