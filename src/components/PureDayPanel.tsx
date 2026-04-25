/**
 * Pure Day Panel - Enterprise Note Management for Pure Calendar Mode
 * 
 * Features:
 * - Full note editing with rich controls
 * - Delete individual notes
 * - Set note repetition (daily, weekly, monthly, yearly)
 * - View full note content without cell size limitations
 * - Add multiple notes to the same day
 * - View day metadata (moon phase, holidays, civil date)
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNote, deleteNote, updateNote, type RootState } from '../store';
import { HEKA_MONTHS, getNoteKey } from '../services/calendarService';
import { getHolidaysForDateWithSubRegion, type SubRegionCode, type NoteCategory, type RecurringConfig } from '../types';
import type { CalendarDay } from '../types';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface PureDayPanelProps {
  day: CalendarDay;
  notes: { content: string; category?: string; recurring?: RecurringConfig }[];
  location: string;
  subRegion: SubRegionCode | null;
  showCivil: boolean;
  showMoon: boolean;
  showHolidays: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface NoteItem {
  id: string;
  content: string;
  category: NoteCategory;
  recurring?: RecurringConfig;
  isEditing: boolean;
}

// Extended RecurringConfig for local state with frequency only
type RecurringFrequency = RecurringConfig['frequency'] | null;

// ============================================================================
// Recurrence Options
// ============================================================================

// Helper to create RecurringConfig
const createRecurringConfig = (frequency: RecurringConfig['frequency'] | null): RecurringConfig | undefined => {
  if (!frequency) return undefined;
  return {
    enabled: true,
    frequency,
    interval: 1,
  };
};

const RECURRENCE_OPTIONS: { value: RecurringFrequency; label: string; icon: string }[] = [
  { value: null, label: 'No repeat', icon: '○' },
  { value: 'daily', label: 'Daily', icon: '↻' },
  { value: 'weekly', label: 'Weekly', icon: '⟳' },
  { value: 'monthly', label: 'Monthly', icon: '⇄' },
  { value: 'yearly', label: 'Yearly', icon: '↺' },
];

const CATEGORY_OPTIONS: { value: NoteCategory; label: string; color: string }[] = [
  { value: 'general', label: 'General', color: '#c9a227' },
  { value: 'work', label: 'Work', color: '#3b82f6' },
  { value: 'personal', label: 'Personal', color: '#22c55e' },
  { value: 'health', label: 'Health', color: '#ef4444' },
  { value: 'spiritual', label: 'Spiritual', color: '#a855f7' },
];

// ============================================================================
// Component
// ============================================================================

export const PureDayPanel: React.FC<PureDayPanelProps> = ({
  day,
  notes: _initialNotes,
  location,
  subRegion,
  showCivil,
  showMoon,
  showHolidays,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const panelRef = useRef<HTMLDivElement>(null);
  const newNoteInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Access full notes from Redux to get IDs
  const fullNotes = useSelector((state: RootState) => {
    const noteKey = getNoteKey(hekaDate.year, hekaDate.month, hekaDate.day);
    return state.calendar.notes[noteKey] || [];
  });
  
  // Convert notes to editable format with real IDs
  const [notes, setNotes] = useState<NoteItem[]>([]);
  
  // New note state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<NoteCategory>('general');
  const [newNoteRecurring, setNewNoteRecurring] = useState<RecurringFrequency>(null);
  
  // Editing states for existing notes
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<NoteCategory>('general');
  const [editRecurring, setEditRecurring] = useState<RecurringFrequency>(null);
  
  // Get day metadata
  const hekaDate = day.hekaDate;
  const monthName = HEKA_MONTHS[hekaDate.month].name;
  const civilDate = day.civilDate;
  
  // Get holidays
  const holidays = useMemo(() => {
    if (!showHolidays || location === 'NONE') return [];
    return getHolidaysForDateWithSubRegion(civilDate, location as any, subRegion || undefined);
  }, [showHolidays, location, subRegion, civilDate]);
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
  
  // Focus new note input when adding
  useEffect(() => {
    if (isAddingNew && newNoteInputRef.current) {
      newNoteInputRef.current.focus();
    }
  }, [isAddingNew]);
  
  // Update notes when fullNotes change
  useEffect(() => {
    setNotes(fullNotes.map((note) => ({
      id: note.id,
      content: note.content,
      category: (note.category as NoteCategory) || 'general',
      recurring: note.recurring,
      isEditing: false,
    })));
  }, [fullNotes]);
  
  // Start editing a note
  const startEdit = useCallback((note: NoteItem) => {
    setEditContent(note.content);
    setEditCategory(note.category);
    setEditRecurring(note.recurring?.frequency || null);
    setNotes(prev => prev.map(n => 
      n.id === note.id ? { ...n, isEditing: true } : { ...n, isEditing: false }
    ));
  }, []);
  
  // Save edited note
  const saveEdit = useCallback((noteId: string) => {
    if (!editContent.trim()) return;
    
    const noteKey = getNoteKey(hekaDate.year, hekaDate.month, hekaDate.day);
    
    dispatch(updateNote({
      dayKey: noteKey,
      noteId: noteId,
      updates: {
        content: editContent.trim(),
        category: editCategory,
        recurring: createRecurringConfig(editRecurring),
      },
    }));
    
    // State will update via useEffect when fullNotes changes
    setNotes(prev => prev.map(n => 
      n.id === noteId 
        ? { ...n, isEditing: false }
        : n
    ));
  }, [dispatch, editContent, editCategory, editRecurring, hekaDate]);
  
  // Cancel editing
  const cancelEdit = useCallback((noteId: string) => {
    setNotes(prev => prev.map(n => 
      n.id === noteId ? { ...n, isEditing: false } : n
    ));
    setEditContent('');
  }, []);
  
  // Delete a note
  const handleDelete = useCallback((noteId: string) => {
    const noteKey = getNoteKey(hekaDate.year, hekaDate.month, hekaDate.day);
    dispatch(deleteNote({ dayKey: noteKey, noteId }));
    // State will update via useEffect when fullNotes changes
  }, [dispatch, hekaDate]);
  
  // Add new note
  const handleAddNew = useCallback(() => {
    if (!newNoteContent.trim()) {
      setIsAddingNew(false);
      return;
    }
    
    const noteKey = getNoteKey(hekaDate.year, hekaDate.month, hekaDate.day);
    
    dispatch(addNote({
      key: noteKey,
      content: newNoteContent.trim(),
      category: newNoteCategory,
      recurring: createRecurringConfig(newNoteRecurring),
    }));
    
    // State will update via useEffect when fullNotes changes - don't manually add
    
    setNewNoteContent('');
    setIsAddingNew(false);
  }, [dispatch, newNoteContent, newNoteCategory, newNoteRecurring, hekaDate, notes.length]);
  
  // Cancel adding new note
  const cancelAddNew = useCallback(() => {
    setIsAddingNew(false);
    setNewNoteContent('');
  }, []);
  
  if (!isOpen) return null;
  
  return (
    <div className="pure-day-panel-overlay" onClick={onClose}>
      <div 
        ref={panelRef}
        className="pure-day-panel"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="pure-day-panel__header">
          <div className="pure-day-panel__date">
            <span className="pure-day-panel__heka-date">
              {monthName} {hekaDate.day}
            </span>
            <span className="pure-day-panel__year">
              Year {hekaDate.year}
            </span>
          </div>
          
          <div className="pure-day-panel__meta">
            {showCivil && (
              <span className="pure-day-panel__civil">
                {civilDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            )}
            {showMoon && day.moonPhase && (
              <span className="pure-day-panel__moon" title={(day as any).moonPhaseName}>
                {day.moonPhase}
              </span>
            )}
          </div>
          
          <button 
            className="pure-day-panel__close"
            onClick={onClose}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>
        
        {/* Holidays */}
        {showHolidays && holidays.length > 0 && (
          <div className="pure-day-panel__holidays">
            {holidays.map((holiday, i) => (
              <span key={i} className="pure-day-panel__holiday-tag">
                {holiday.name}
              </span>
            ))}
          </div>
        )}
        
        {/* Notes List */}
        <div className="pure-day-panel__notes">
          {notes.length === 0 && !isAddingNew && (
            <div className="pure-day-panel__empty">
              <span className="pure-day-panel__empty-icon">📝</span>
              <p>No notes for this day</p>
              <button 
                className="pure-day-panel__add-btn"
                onClick={() => setIsAddingNew(true)}
              >
                Add First Note
              </button>
            </div>
          )}
          
          {notes.map((note) => (
            <div 
              key={note.id} 
              className={`pure-day-panel__note ${note.isEditing ? 'pure-day-panel__note--editing' : ''}`}
            >
              {note.isEditing ? (
                // Edit Mode
                <div className="pure-day-panel__note-edit">
                  <textarea
                    className="pure-day-panel__edit-textarea"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    placeholder="Edit note..."
                    rows={3}
                  />
                  
                  <div className="pure-day-panel__edit-controls">
                    <select
                      className="pure-day-panel__category-select"
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value as NoteCategory)}
                    >
                      {CATEGORY_OPTIONS.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      className="pure-day-panel__recurring-select"
                      value={editRecurring || ''}
                      onChange={e => setEditRecurring(e.target.value as RecurringConfig['frequency'] || null)}
                    >
                      {RECURRENCE_OPTIONS.map(opt => (
                        <option key={opt.label} value={opt.value || ''}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pure-day-panel__edit-actions">
                    <button 
                      className="pure-day-panel__save-btn"
                      onClick={() => saveEdit(note.id)}
                    >
                      Save
                    </button>
                    <button 
                      className="pure-day-panel__cancel-btn"
                      onClick={() => cancelEdit(note.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="pure-day-panel__note-view">
                  <div className="pure-day-panel__note-content">
                    <span 
                      className="pure-day-panel__category-dot"
                      style={{ 
                        backgroundColor: CATEGORY_OPTIONS.find(c => c.value === note.category)?.color || '#c9a227' 
                      }}
                    />
                    <p className="pure-day-panel__note-text">{note.content}</p>
                    {note.recurring && (
                      <span className="pure-day-panel__recurring-badge">
                        {RECURRENCE_OPTIONS.find(r => r.value === note.recurring?.frequency)?.icon}
                      </span>
                    )}
                  </div>
                  
                  <div className="pure-day-panel__note-actions">
                    <button 
                      className="pure-day-panel__action-btn pure-day-panel__action-btn--edit"
                      onClick={() => startEdit(note)}
                      title="Edit note"
                    >
                      ✎
                    </button>
                    <button 
                      className="pure-day-panel__action-btn pure-day-panel__action-btn--delete"
                      onClick={() => handleDelete(note.id)}
                      title="Delete note"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Add New Note Form */}
          {isAddingNew && (
            <div className="pure-day-panel__note pure-day-panel__note--new">
              <textarea
                ref={newNoteInputRef}
                className="pure-day-panel__edit-textarea"
                value={newNoteContent}
                onChange={e => setNewNoteContent(e.target.value)}
                placeholder="Type new note..."
                rows={3}
              />
              
              <div className="pure-day-panel__edit-controls">
                <select
                  className="pure-day-panel__category-select"
                  value={newNoteCategory}
                  onChange={e => setNewNoteCategory(e.target.value as NoteCategory)}
                >
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                
                <select
                  className="pure-day-panel__recurring-select"
                  value={newNoteRecurring || ''}
                  onChange={e => setNewNoteRecurring(e.target.value as RecurringConfig['frequency'] || null)}
                >
                  {RECURRENCE_OPTIONS.map(opt => (
                    <option key={opt.label} value={opt.value || ''}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="pure-day-panel__edit-actions">
                <button 
                  className="pure-day-panel__save-btn"
                  onClick={handleAddNew}
                >
                  Add Note
                </button>
                <button 
                  className="pure-day-panel__cancel-btn"
                  onClick={cancelAddNew}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer - Add Button */}
        {(notes.length > 0 || isAddingNew) && !isAddingNew && (
          <div className="pure-day-panel__footer">
            <button 
              className="pure-day-panel__add-another-btn"
              onClick={() => setIsAddingNew(true)}
            >
              <span>+</span> Add Another Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PureDayPanel;
