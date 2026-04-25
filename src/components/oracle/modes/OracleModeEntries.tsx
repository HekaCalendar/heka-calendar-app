import React from 'react';
import type { DiaryEntry } from '../../../oracle/diaryTypes';
import type { CalendarNoteEntry, EntryFilter } from '../types';

interface OracleModeEntriesProps {
  entries: DiaryEntry[];
  calendarNoteEntries: CalendarNoteEntry[];
  entryFilter: EntryFilter;
  setEntryFilter: (filter: EntryFilter) => void;
  onEditEntry: (entry: DiaryEntry) => void;
  onNavigateToDate: (sourceKey: string) => void;
  formatEntryDate: (timestamp: string | number | Date) => string;
  onSetMode: (mode: 'scribe') => void;
}

export const OracleModeEntries: React.FC<OracleModeEntriesProps> = ({
  entries,
  calendarNoteEntries,
  entryFilter,
  setEntryFilter,
  onEditEntry,
  onNavigateToDate,
  formatEntryDate,
  onSetMode,
}) => {
  return (
    <div className="oracle-mode-entries">
      <div className="entries-filters">
        {[
          { id: 'all', label: 'All Entries', icon: '📜' },
          { id: 'insights', label: 'With Insights', icon: '🔮' },
          { id: 'transits', label: 'Calendar Notes', icon: '📅' },
        ].map((f) => (
          <button
            key={f.id}
            className={`filter-tab ${entryFilter === f.id ? 'active' : ''}`}
            onClick={() => setEntryFilter(f.id as EntryFilter)}
          >
            <span>{f.icon}</span>{f.label}
          </button>
        ))}
      </div>
      
      <div className="entries-list">
        {entryFilter !== 'transits' && entries.length === 0 && (
          <div className="entries-empty">
            <div className="empty-icon">📜</div>
            <h3>No Oracle Entries Yet</h3>
            <button className="empty-cta" onClick={() => onSetMode('scribe')}>
              Start Writing
            </button>
          </div>
        )}
        
        {entryFilter === 'transits' && calendarNoteEntries.length === 0 && (
          <div className="entries-empty">
            <div className="empty-icon">📅</div>
            <h3>No Calendar Notes</h3>
          </div>
        )}
        
        {(entryFilter === 'all' || entryFilter === 'insights') && entries.map((entry) => (
          <div 
            key={entry.id} 
            className={`entry-card ${entry.insight ? 'has-insight' : ''}`}
            onClick={() => onEditEntry(entry)}
          >
            <div className="entry-header">
              <span className="entry-date">{formatEntryDate(entry.timestamp)}</span>
              {entry.insight && <span className="entry-badge insight">🔮 Insight</span>}
            </div>
            <p className="entry-preview">{entry.content.slice(0, 120)}...</p>
            {entry.insight && (
              <div className="entry-insight">
                <span>✨</span>
                <span>{entry.insight.text.slice(0, 80)}...</span>
              </div>
            )}
          </div>
        ))}
        
        {entryFilter === 'transits' && calendarNoteEntries.map((note) => (
          <div 
            key={note.id} 
            className="entry-card calendar-note"
            onClick={() => onNavigateToDate(note.sourceKey)}
          >
            <div className="entry-header">
              <span className="entry-date">{formatEntryDate(note.timestamp)}</span>
              <span className="entry-badge calendar">📅 Calendar</span>
            </div>
            <p className="entry-preview">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
