/**
 * Note Editor Component
 * Form for adding/editing notes with category, mood, and optional task scheduling
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { tutorialService } from '../../services/tutorialService';
import { MOOD_EMOJIS } from './constants';
import { NOTE_CATEGORIES } from '../../types';
import type { NoteEditorProps } from './types';

export const NoteEditor = memo(({
  selectedCategory,
  selectedMood,
  noteText,
  isTaskMode,
  dueTime,
  reminderMinutesBefore,
  onSetCategory,
  onSetMood,
  onSetText,
  onSetIsTaskMode,
  onSetDueTime,
  onSetReminderMinutesBefore,
  onSave,
  onCancel,
}: NoteEditorProps) => {
  const { t } = useTranslation('dayPanel');

  const reminderOptions = [
    { value: 0, label: t('noteEditor.reminders.atTime') },
    { value: 5, label: t('noteEditor.reminders.5min') },
    { value: 10, label: t('noteEditor.reminders.10min') },
    { value: 15, label: t('noteEditor.reminders.15min') },
    { value: 30, label: t('noteEditor.reminders.30min') },
    { value: 60, label: t('noteEditor.reminders.1hour') },
  ];

  return (
    <div className="note-edit-form">
      {/* Task Toggle */}
      <label
        className="task-toggle"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.625rem 0.75rem',
          background: isTaskMode ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isTaskMode ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '10px',
          cursor: 'pointer',
          marginBottom: '0.75rem',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          type="checkbox"
          checked={isTaskMode}
          onChange={(e) => onSetIsTaskMode(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: '#d4af37', cursor: 'pointer' }}
        />
        <span style={{ fontWeight: 500, color: isTaskMode ? '#f8f7f5' : '#d4d4d8' }}>
          {t('noteEditor.makeTask')}
        </span>
      </label>

      {/* Task Scheduling Fields */}
      {isTaskMode && (
        <div
          style={{
            display: 'grid',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#a1a1aa',
                  marginBottom: '0.25rem',
                }}
              >
                {t('noteEditor.dueTime')}
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => onSetDueTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: '#0f0f11',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#f8f7f5',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ flex: 1.5 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#a1a1aa',
                  marginBottom: '0.25rem',
                }}
              >
                {t('noteEditor.remindMe')}
              </label>
              <select
                value={reminderMinutesBefore}
                onChange={(e) => onSetReminderMinutesBefore(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: '#0f0f11',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#f8f7f5',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                {reminderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Category Selection */}
      <div className="category-selector">
        {NOTE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSetCategory(cat.id)}
            style={{ '--category-color': cat.color } as React.CSSProperties}
          >
            <span>{cat.icon}</span>
            <span>{t(`noteCategories.${cat.id}`)}</span>
          </button>
        ))}
      </div>

      {/* Mood Selection */}
      <div className="mood-selector">
        <span className="mood-label-text">{t('noteEditor.howAreYouFeeling')}</span>
        <div className="mood-options">
          {[1, 2, 3, 4, 5].map(mood => (
            <button
              key={mood}
              className={`mood-btn ${selectedMood === mood ? 'active' : ''}`}
              onClick={() => onSetMood(selectedMood === mood ? undefined : mood as 1 | 2 | 3 | 4 | 5)}
              title={t(`moodScale.${mood}`)}
            >
              {MOOD_EMOJIS[mood]}
            </button>
          ))}
        </div>
      </div>

      {/* Note Text */}
      <textarea
        className="day-panel__textarea"
        value={noteText}
        onChange={(e) => {
          onSetText(e.target.value);
          if (e.target.value.trim().length > 0) {
            tutorialService.trackNoteTyping();
          }
        }}
        placeholder={isTaskMode ? t('noteEditor.taskPlaceholder') : t('noteEditor.notePlaceholder')}
        autoFocus
      />

      {/* Actions */}
      <div className="note-actions">
        <button
          className="btn btn--primary"
          onClick={onSave}
          disabled={!noteText.trim()}
        >
          {isTaskMode ? t('noteEditor.saveTask') : t('noteEditor.saveNote')}
        </button>
        <button className="btn" onClick={onCancel}>
          {t('noteEditor.cancel')}
        </button>
      </div>
    </div>
  );
});

NoteEditor.displayName = 'NoteEditor';

export default NoteEditor;
