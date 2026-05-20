/**
 * Goals Step
 * Short, medium, and long term goals with time dedication, tags, descriptions,
 * and optional preferred days/time for scheduling.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Goal } from '../routineData';
import type { NoteCategory } from '../../../types';
import { GOAL_TIMEFRAME_LABELS, generateId } from '../routineData';
import { getCategoryColor } from '../routineUtils';

const CATEGORIES: { id: NoteCategory; name: string }[] = [
  { id: 'personal', name: 'Personal' },
  { id: 'work', name: 'Work' },
  { id: 'spiritual', name: 'Spiritual' },
  { id: 'family', name: 'Family' },
  { id: 'health', name: 'Health' },
  { id: 'creative', name: 'Creative' },
  { id: 'general', name: 'General' },
];

interface Props {
  goals: Goal[];
  onChange: (goals: Goal[]) => void;
}

const EMPTY_GOAL: Goal = {
  id: '',
  name: '',
  description: '',
  timeframe: 'short',
  weeklyMinutes: 120,
  priority: 'medium',
  category: 'personal',
  tags: [],
};

export const GoalsStep: React.FC<Props> = ({ goals, onChange }) => {
  const { t } = useTranslation();
  const [addingFor, setAddingFor] = useState<Goal['timeframe'] | null>(null);
  const [newGoal, setNewGoal] = useState<Goal>({ ...EMPTY_GOAL, id: generateId() });
  const [editingId, setEditingId] = useState<string | null>(null);

  const addGoal = () => {
    if (!newGoal.name.trim()) return;
    onChange([...goals, { ...newGoal, id: generateId() }]);
    setNewGoal({ ...EMPTY_GOAL, id: generateId(), timeframe: addingFor || 'short' });
    setAddingFor(null);
  };

  const updateGoal = (id: string, updates: Partial<Goal> | Goal) => {
    onChange(goals.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const removeGoal = (id: string) => {
    onChange(goals.filter(g => g.id !== id));
  };

  const timeframes: Goal['timeframe'][] = ['short', 'medium', 'long'];

  return (
    <div className="routine-fade-in">
      <div className="routine-section">
        <div className="routine-section-title">Your Goals</div>
        <div className="routine-section-subtitle">
          What are you working toward? Add details, tags, and when you'd like to work on them.
        </div>

        <div className="routine-goals-grid">
          {timeframes.map(tf => {
            const tfGoals = goals.filter(g => g.timeframe === tf);
            return (
              <div key={tf} className="routine-goal-column">
                <div className="routine-goal-column-title">{GOAL_TIMEFRAME_LABELS[tf]}</div>

                <div className="routine-list">
                  {tfGoals.map(goal => (
                    <div key={goal.id} className="routine-item" style={{ padding: 12 }}>
                      {editingId === goal.id ? (
                        <GoalEditForm
                          goal={goal}
                          onSave={() => setEditingId(null)}
                          onCancel={() => setEditingId(null)}
                          onChange={updated => updateGoal(goal.id, updated)}
                        />
                      ) : (
                        <div className="routine-item-header">
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="routine-item-name" style={{ fontSize: 14 }}>{goal.name}</div>
                            {goal.description && (
                              <div style={{ fontSize: 12, color: '#71717a', marginTop: 2, lineHeight: 1.4 }}>
                                {goal.description}
                              </div>
                            )}
                            <div className="routine-item-meta" style={{ fontSize: 11 }}>
                              <span>{Math.round(goal.weeklyMinutes / 60 * 10) / 10}h/week</span>
                              <span>·</span>
                              <span style={{ color: getPriorityColor(goal.priority) }}>{goal.priority}</span>
                              <span>·</span>
                              <span style={{ color: getCategoryColor(goal.category) }}>{CATEGORIES.find(c => c.id === goal.category)?.name}</span>
                              {goal.preferredDays && goal.preferredDays.length > 0 && (
                                <>
                                  <span>·</span>
                                  <span>{goal.preferredDays.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')}</span>
                                </>
                              )}
                              {goal.preferredTime && (
                                <>
                                  <span>·</span>
                                  <span>{goal.preferredTime}</span>
                                </>
                              )}
                              {goal.tags.length > 0 && (
                                <>
                                  <span>·</span>
                                  <span>{goal.tags.join(', ')}</span>
                                </>
                              )}
                              {goal.deadline && <span>· Due {goal.deadline}</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                            <button className="routine-item-edit" onClick={() => setEditingId(goal.id)} title="Edit" aria-label={t('common.edit')}>✎</button>
                            <button className="routine-item-delete" onClick={() => removeGoal(goal.id)} title="Remove" aria-label={t('common.delete')}>✕</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {addingFor === tf ? (
                    <GoalEditForm
                      goal={{ ...newGoal, timeframe: tf }}
                      isNew
                      onSave={addGoal}
                      onCancel={() => setAddingFor(null)}
                      onChange={g => setNewGoal(g)}
                    />
                  ) : (
                    <button className="routine-add-btn" onClick={() => {
                      setAddingFor(tf);
                      setNewGoal({ ...EMPTY_GOAL, id: generateId(), timeframe: tf });
                    }}>
                      <span>+</span> Add Goal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Reusable Goal Form ───────────────────────────────────────────────────────

interface GoalEditFormProps {
  goal: Goal;
  isNew?: boolean;
  onSave: (goal?: Goal) => void;
  onCancel: () => void;
  onChange?: (goal: Goal) => void;
}

const GoalEditForm: React.FC<GoalEditFormProps> = ({ goal, isNew, onSave, onCancel, onChange }) => {
  const { t } = useTranslation();
  const isControlled = !!onChange;
  const g = goal;
  const set = (updates: Partial<Goal>) => {
    if (isControlled && onChange) {
      onChange({ ...g, ...updates });
    }
  };

  const handleSave = () => {
    if (!g.name.trim()) return;
    onSave(g);
  };

  return (
    <div className="routine-inline-form">
      <div className="routine-field">
        <label>Goal Name *</label>
        <input
          type="text"
          value={g.name}
          onChange={e => set({ name: e.target.value })}
          placeholder={t('wizard.goalNamePlaceholder')}
          autoFocus={isNew}
        />
      </div>
      <div className="routine-field">
        <label>Description</label>
        <textarea
          value={g.description}
          onChange={e => set({ description: e.target.value })}
          placeholder={t('wizard.goalDetailsPlaceholder')}
          rows={2}
          style={{ resize: 'vertical', minHeight: 48 }}
        />
      </div>
      <div className="routine-form-row">
        <div className="routine-field">
          <label>Hours/week</label>
          <input
            type="number"
            min={0.5}
            step={0.5}
            value={g.weeklyMinutes / 60}
            onChange={e => set({ weeklyMinutes: Math.round(parseFloat(e.target.value) * 60) })}
          />
        </div>
        <div className="routine-field">
          <label>Priority</label>
          <select
            value={g.priority}
            onChange={e => set({ priority: e.target.value as Goal['priority'] })}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div className="routine-form-row">
        <div className="routine-field">
          <label>Category</label>
          <select
            value={g.category}
            onChange={e => set({ category: e.target.value as NoteCategory })}
          >
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="routine-field">
          <label>Deadline (optional)</label>
          <input
            type="date"
            value={g.deadline || ''}
            onChange={e => set({ deadline: e.target.value || undefined })}
          />
        </div>
      </div>
      <div className="routine-field">
        <label>Preferred Days (optional)</label>
        <DaySelector
          selected={g.preferredDays || []}
          onChange={days => set({ preferredDays: days.length > 0 ? days : undefined })}
        />
      </div>
      <div className="routine-form-row">
        <div className="routine-field">
          <label>Preferred Time (optional)</label>
          <select
            value={g.preferredTime || ''}
            onChange={e => set({ preferredTime: e.target.value ? e.target.value as Goal['preferredTime'] : undefined })}
          >
            <option value="">Auto (by category)</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>
        <div className="routine-field">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            value={g.tags.join(', ')}
            onChange={e => set({ tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            placeholder={t('wizard.tagsPlaceholder')}
          />
        </div>
      </div>
      <div className="routine-inline-actions">
        <button className="routine-nav-btn routine-nav-btn--back" onClick={onCancel}>Cancel</button>
        <button className="routine-nav-btn routine-nav-btn--next" onClick={handleSave} disabled={!g.name.trim()}>
          {isNew ? 'Add Goal' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

const DaySelector: React.FC<{ selected: number[]; onChange: (days: number[]) => void }> = ({ selected, onChange }) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {days.map((d, i) => (
        <button
          key={i}
          onClick={() => {
            if (selected.includes(i)) {
              onChange(selected.filter(day => day !== i));
            } else {
              onChange([...selected, i].sort((a, b) => a - b));
            }
          }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid',
            borderColor: selected.includes(i) ? '#d4af37' : 'rgba(255,255,255,0.1)',
            background: selected.includes(i) ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
            color: selected.includes(i) ? '#d4af37' : '#71717a',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {d}
        </button>
      ))}
    </div>
  );
};

function getPriorityColor(p: Goal['priority']): string {
  const map = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
  return map[p];
}

export default GoalsStep;
