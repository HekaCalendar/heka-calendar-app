/**
 * Quick Note Modal
 * Opens when long-pressing a day cell for rapid note entry
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { HEKA_MONTHS } from '../services/calendarService';
import type { CalendarDay } from '../types';

interface QuickNoteModalProps {
  isOpen: boolean;
  day: CalendarDay | null;
  onClose: () => void;
  onSave: (content: string) => void;
}

export const QuickNoteModal: React.FC<QuickNoteModalProps> = ({ isOpen, day, onClose, onSave }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setContent('');
      // Focus after animation frame so keyboard opens reliably on mobile
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [isOpen]);

  const handleSave = useCallback(() => {
    const trimmed = content.trim();
    if (trimmed) {
      onSave(trimmed);
    }
    onClose();
  }, [content, onSave, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [handleSave, onClose]);

  if (!isOpen || !day) return null;

  const monthName = HEKA_MONTHS[day.hekaDate.month].name;
  const dateLabel = `${monthName} ${day.hekaDate.day}`;

  return (
    <div
      className="modal-overlay quick-note-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal quick-note-modal" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 className="modal__title" style={{ fontSize: '1.1rem' }}>
              Quick Note
            </h2>
            <span className="quick-note-tag">quick note</span>
          </div>
          <button className="btn btn--icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div style={{ marginBottom: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Adding to <strong style={{ color: 'var(--color-text)' }}>{dateLabel}</strong>
        </div>

        <textarea
          ref={textareaRef}
          className="quick-note-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your note..."
          rows={4}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--color-text)',
            fontSize: '1rem',
            lineHeight: 1.5,
            resize: 'vertical',
            outline: 'none',
            marginBottom: '1rem',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={!content.trim()}
            style={{ opacity: content.trim() ? 1 : 0.5 }}
          >
            Save Note
          </button>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
          Ctrl + Enter to save • Esc to cancel
        </div>
      </div>
    </div>
  );
};

export default QuickNoteModal;
