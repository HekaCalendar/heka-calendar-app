/**
 * Tasks Step
 * Dynamic list of existing responsibilities with tags and descriptions
 */

import React, { useState } from 'react';
import type { ExistingTask } from '../routineData';
import type { NoteCategory } from '../../../types';
import { generateId } from '../routineData';
import { getCategoryColor } from '../routineUtils';

// Local category list
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
  tasks: ExistingTask[];
  onChange: (tasks: ExistingTask[]) => void;
}

const EMPTY_TASK: ExistingTask = {
  id: '',
  name: '',
  description: '',
  durationMinutes: 60,
  frequency: 'daily',
  days: [1, 2, 3, 4, 5],
  timePreference: 'morning',
  category: 'work',
  priority: 'required',
  tags: [],
};

export const TasksStep: React.FC<Props> = ({ tasks, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState<ExistingTask>({ ...EMPTY_TASK, id: generateId() });
  const [editingId, setEditingId] = useState<string | null>(null);

  const addTask = () => {
    if (!newTask.name.trim()) return;
    onChange([...tasks, { ...newTask, id: generateId() }]);
    setNewTask({ ...EMPTY_TASK, id: generateId() });
    setIsAdding(false);
  };

  const updateTask = (id: string, updates: Partial<ExistingTask> | ExistingTask) => {
    onChange(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTask = (id: string) => {
    onChange(tasks.filter(t => t.id !== id));
  };

  const freqLabel = (t: ExistingTask) => {
    if (t.frequency === 'daily') return 'Every day';
    if (t.frequency === 'weekly') return 'Once a week';
    if (t.frequency === 'everyNDays') return `Every ${t.everyNDays} days`;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return t.days?.map(d => days[d]).join(', ') || 'Custom';
  };

  return (
    <div className="routine-fade-in">
      <div className="routine-section">
        <div className="routine-section-title">Your Responsibilities</div>
        <div className="routine-section-subtitle">
          What do you already do regularly? Add details, tags, and descriptions.
        </div>

        <div className="routine-list">
          {tasks.map(task => (
            <div key={task.id} className="routine-item">
              {editingId === task.id ? (
                <TaskEditForm
                  task={task}
                  onSave={() => setEditingId(null)}
                  onCancel={() => setEditingId(null)}
                  onChange={updated => updateTask(task.id, updated)}
                />
              ) : (
                <div className="routine-item-header">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="routine-item-name">{task.name}</div>
                    {task.description && (
                      <div style={{ fontSize: 12, color: '#71717a', marginTop: 2, lineHeight: 1.4 }}>
                        {task.description}
                      </div>
                    )}
                    <div className="routine-item-meta">
                      <span>{task.durationMinutes} min</span>
                      <span>·</span>
                      <span>{freqLabel(task)}</span>
                      <span>·</span>
                      <span>{task.timePreference}</span>
                      <span>·</span>
                      <span style={{ color: getCategoryColor(task.category) }}>{CATEGORIES.find(c => c.id === task.category)?.name}</span>
                      {task.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{task.tags.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button className="routine-item-edit" onClick={() => setEditingId(task.id)} title="Edit">✎</button>
                    <button className="routine-item-delete" onClick={() => removeTask(task.id)} title="Remove">✕</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isAdding ? (
            <TaskEditForm
              task={newTask}
              isNew
              onSave={addTask}
              onCancel={() => setIsAdding(false)}
              onChange={setNewTask}
            />
          ) : (
            <button className="routine-add-btn" onClick={() => setIsAdding(true)}>
              <span>+</span> Add Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Reusable Task Form (for add + edit) ──────────────────────────────────────

interface TaskEditFormProps {
  task: ExistingTask;
  isNew?: boolean;
  onSave: (task?: ExistingTask) => void;
  onCancel: () => void;
  onChange?: (task: ExistingTask) => void;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({ task, isNew, onSave, onCancel, onChange }) => {
  const isControlled = !!onChange;
  const t = task;
  const set = (updates: Partial<ExistingTask>) => {
    if (isControlled && onChange) {
      onChange({ ...t, ...updates });
    }
  };

  const handleSave = () => {
    if (!t.name.trim()) return;
    onSave(t);
  };

  return (
    <div className="routine-inline-form">
      <div className="routine-field">
        <label>Task Name *</label>
        <input
          type="text"
          value={t.name}
          onChange={e => set({ name: e.target.value })}
          placeholder="e.g. Work, Gym, School run"
          autoFocus={isNew}
        />
      </div>
      <div className="routine-field">
        <label>Description</label>
        <textarea
          value={t.description}
          onChange={e => set({ description: e.target.value })}
          placeholder="Details, location, notes..."
          rows={2}
          style={{ resize: 'vertical', minHeight: 48 }}
        />
      </div>
      <div className="routine-form-row">
        <div className="routine-field">
          <label>Duration (min)</label>
          <input
            type="number"
            min={5}
            step={5}
            value={t.durationMinutes}
            onChange={e => set({ durationMinutes: parseInt(e.target.value) || 60 })}
          />
        </div>
        <div className="routine-field">
          <label>Frequency</label>
          <select
            value={t.frequency}
            onChange={e => set({ frequency: e.target.value as ExistingTask['frequency'] })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom days</option>
            <option value="everyNDays">Every N days</option>
          </select>
        </div>
      </div>
      {t.frequency === 'custom' && (
        <div className="routine-field">
          <label>Days</label>
          <DaySelector
            selected={t.days || []}
            onChange={days => set({ days })}
          />
        </div>
      )}
      {t.frequency === 'everyNDays' && (
        <div className="routine-field">
          <label>Every N days</label>
          <input
            type="number"
            min={1}
            max={30}
            value={t.everyNDays || 2}
            onChange={e => set({ everyNDays: parseInt(e.target.value) || 2 })}
          />
        </div>
      )}
      <div className="routine-form-row">
        <div className="routine-field">
          <label>Time Preference</label>
          <select
            value={t.timePreference}
            onChange={e => set({ timePreference: e.target.value as ExistingTask['timePreference'] })}
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="fixed">Fixed time</option>
          </select>
        </div>
        {t.timePreference === 'fixed' && (
          <div className="routine-field">
            <label>Fixed Time</label>
            <input
              type="time"
              value={t.fixedTime || ''}
              onChange={e => set({ fixedTime: e.target.value })}
            />
          </div>
        )}
        <div className="routine-field">
          <label>Category</label>
          <select
            value={t.category}
            onChange={e => set({ category: e.target.value as NoteCategory })}
          >
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="routine-form-row">
        <div className="routine-field">
          <label>Priority</label>
          <select
            value={t.priority}
            onChange={e => set({ priority: e.target.value as ExistingTask['priority'] })}
          >
            <option value="required">Required</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
        <div className="routine-field">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            value={t.tags.join(', ')}
            onChange={e => set({ tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            placeholder="gym, morning, project-a"
          />
        </div>
      </div>
      <div className="routine-inline-actions">
        <button className="routine-nav-btn routine-nav-btn--back" onClick={onCancel}>
          Cancel
        </button>
        <button className="routine-nav-btn routine-nav-btn--next" onClick={handleSave} disabled={!t.name.trim()}>
          {isNew ? 'Add Task' : 'Save Changes'}
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

export default TasksStep;
