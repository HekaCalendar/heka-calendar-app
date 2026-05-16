/**
 * Diary Search Component
 * Full-text search across Oracle entries AND Calendar notes
 */

import { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { DiaryEntry } from '../oracle/diaryTypes';
import i18n from '../i18n';
import '../styles/diary-search.css';
import '../styles/diary-search.landscape.css';

// Calendar note entry type
interface CalendarNoteEntry {
  id: string;
  date: string;
  timestamp: string;
  content: string;
  category: string;
  mood?: number;
  isCalendarNote: true;
  sourceKey: string;
}

// Unified search result type
type SearchResult = 
  | { type: 'diary'; entry: DiaryEntry }
  | { type: 'calendar'; entry: CalendarNoteEntry };

interface DiarySearchProps {
  onEntrySelect: (entryId: string) => void;
  onCalendarNoteSelect?: (sourceKey: string) => void;
  isOpen: boolean;
  onClose: () => void;
  calendarNotes?: CalendarNoteEntry[];
  theme?: string | { id?: string; theme?: string };
}

export const DiarySearch: React.FC<DiarySearchProps> = ({ 
  onEntrySelect, 
  onCalendarNoteSelect,
  isOpen, 
  onClose,
  calendarNotes = [],
  theme = 'night',
}) => {
  // Guard against object-type theme values
  const safeTheme = useMemo(() => {
    if (typeof theme === 'string') return theme;
    if (typeof theme === 'object' && theme !== null) {
      // Extract theme from object if passed incorrectly
      return (theme as any).id || (theme as any).theme || 'night';
    }
    return 'night';
  }, [theme]);
  
  const diaryEntries = useSelector((state: RootState) => 
    Object.values(state.diary.entries)
  );
  
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'diary' | 'calendar'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');

  // Search and filter logic
  const searchResults = useMemo(() => {
    let results: SearchResult[] = [];
    
    // Add diary entries
    const diaryResults: SearchResult[] = diaryEntries.map(e => ({ type: 'diary', entry: e }));
    
    // Add calendar notes
    const calendarResults: SearchResult[] = calendarNotes.map(n => ({ type: 'calendar', entry: n }));
    
    // Combine based on filter
    if (filter === 'all' || filter === 'diary') {
      results = [...results, ...diaryResults];
    }
    if (filter === 'all' || filter === 'calendar') {
      results = [...results, ...calendarResults];
    }
    
    // Text search
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(/\s+/);
      results = results.filter(result => {
        const content = result.entry.content.toLowerCase();
        const insightText = result.type === 'diary' 
          ? (result.entry as DiaryEntry).insight?.text?.toLowerCase() || ''
          : '';
        const category = result.type === 'calendar'
          ? (result.entry as CalendarNoteEntry).category.toLowerCase()
          : '';
        const tags = result.type === 'diary'
          ? (result.entry as DiaryEntry).tags?.join(' ').toLowerCase() || ''
          : '';
        return searchTerms.some(term =>
          content.includes(term) ||
          insightText.includes(term) ||
          category.includes(term) ||
          tags.includes(term)
        );
      });
    }
    
    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const ranges: Record<string, number> = {
        'week': 7 * 24 * 60 * 60 * 1000,
        'month': 30 * 24 * 60 * 60 * 1000,
        'year': 365 * 24 * 60 * 60 * 1000,
      };
      const cutoff = now.getTime() - ranges[dateRange];
      results = results.filter(r => new Date(r.entry.timestamp).getTime() > cutoff);
    }
    
    // Sort by relevance (if query) or date
    if (query.trim()) {
      results.sort((a, b) => {
        const aMatches = countMatches(a.entry, query);
        const bMatches = countMatches(b.entry, query);
        if (bMatches !== aMatches) return bMatches - aMatches;
        return new Date(b.entry.timestamp).getTime() - new Date(a.entry.timestamp).getTime();
      });
    } else {
      results.sort((a, b) => new Date(b.entry.timestamp).getTime() - new Date(a.entry.timestamp).getTime());
    }
    
    return results;
  }, [diaryEntries, calendarNotes, query, filter, dateRange]);

  const countMatches = (entry: DiaryEntry | CalendarNoteEntry, searchQuery: string): number => {
    const terms = searchQuery.toLowerCase().split(/\s+/);
    const content = entry.content.toLowerCase();
    const insightText = 'insight' in entry ? entry.insight?.text?.toLowerCase() || '' : '';
    const category = 'category' in entry ? entry.category.toLowerCase() : '';
    return terms.reduce((count, term) => {
      const contentMatches = (content.match(new RegExp(term, 'g')) || []).length;
      const insightMatches = (insightText.match(new RegExp(term, 'g')) || []).length;
      const categoryMatches = (category.match(new RegExp(term, 'g')) || []).length;
      return count + contentMatches + insightMatches + categoryMatches;
    }, 0);
  };

  const highlightText = (text: string, searchQuery: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;
    
    const terms = searchQuery.trim().split(/\s+/);
    const pattern = new RegExp(`(${terms.join('|')})`, 'gi');
    const parts = text.split(pattern);
    
    return parts.map((part, i) => 
      terms.some(t => part.toLowerCase() === t.toLowerCase()) ? (
        <mark key={i} className="diary-search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleResultClick = useCallback((result: SearchResult) => {
    if (result.type === 'diary') {
      onEntrySelect(result.entry.id);
    } else if (result.type === 'calendar' && onCalendarNoteSelect) {
      onCalendarNoteSelect(result.entry.sourceKey);
    }
    onClose();
    setQuery('');
  }, [onEntrySelect, onCalendarNoteSelect, onClose]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilter('all');
    setDateRange('all');
  }, []);

  if (!isOpen) return null;

  const diaryCount = searchResults.filter(r => r.type === 'diary').length;
  const calendarCount = searchResults.filter(r => r.type === 'calendar').length;

  return (
    <div className={`diary-search-overlay journal-theme-${safeTheme}`} onClick={onClose}>
      <div className={`diary-search-modal journal-theme-${safeTheme}`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="diary-search-header">
          <div className="diary-search-input-wrapper">
            <span className="diary-search-icon">🔍</span>
            <input
              type="text"
              className="diary-search-input"
              placeholder="Search Oracle entries & calendar notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button className="diary-search-clear" onClick={() => setQuery('')}>
                ×
              </button>
            )}
          </div>
          <button className="diary-search-close" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Filters */}
        <div className="diary-search-filters">
          <div className="diary-search-filter-group">
            <label>Source:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="all">All sources</option>
              <option value="diary">✨ Oracle Diary</option>
              <option value="calendar">📅 Calendar Notes</option>
            </select>
          </div>
          
          <div className="diary-search-filter-group">
            <label>Time:</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value as any)}>
              <option value="all">All time</option>
              <option value="week">Last week</option>
              <option value="month">Last month</option>
              <option value="year">Last year</option>
            </select>
          </div>

          {(query || filter !== 'all' || dateRange !== 'all') && (
            <button className="diary-search-reset" onClick={clearSearch}>
              Clear filters
            </button>
          )}
        </div>

        {/* Results */}
        <div className="diary-search-results">
          {searchResults.length > 0 ? (
            <>
              <div className="diary-search-stats">
                Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                {query && ` matching "${query}"`}
                <span className="diary-search-stats-breakdown">
                  {diaryCount > 0 && `✨ ${diaryCount} Oracle`}
                  {diaryCount > 0 && calendarCount > 0 && ' • '}
                  {calendarCount > 0 && `📅 ${calendarCount} Calendar`}
                </span>
              </div>
              
              <div className="diary-search-list">
                {searchResults.map((result) => (
                  <div
                    key={result.entry.id}
                    className={`diary-search-result diary-search-result--${result.type}`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="diary-search-result-header">
                      <span className="diary-search-result-type">
                        {result.type === 'diary' ? '✨ Oracle' : '📅 Calendar'}
                      </span>
                      <span className="diary-search-result-date">
                        {new Intl.DateTimeFormat(i18n.language || 'en', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }).format(new Date(result.entry.timestamp))}
                      </span>
                      {result.type === 'diary' && (result.entry as DiaryEntry).insight?.userRating === 'resonated' && (
                        <span className="diary-search-result-badge resonated">💫</span>
                      )}
                      {result.type === 'diary' && (result.entry as DiaryEntry).insight && !(result.entry as DiaryEntry).insight?.userRating && (
                        <span className="diary-search-result-badge insight">✨</span>
                      )}
                      {result.type === 'calendar' && (result.entry as CalendarNoteEntry).mood && (
                        <span className="diary-search-result-badge">
                          {['😢', '😕', '😐', '🙂', '😄'][(result.entry as CalendarNoteEntry).mood! - 1]}
                        </span>
                      )}
                    </div>
                    
                    <p className="diary-search-result-preview">
                      {highlightText(result.entry.content.slice(0, 150), query)}
                      {result.entry.content.length > 150 && '...'}
                    </p>
                    
                    {result.type === 'diary' && (result.entry as DiaryEntry).insight && (
                      <div className="diary-search-result-insight">
                        <span className="diary-search-result-insight-icon">✨</span>
                        <span>{highlightText((result.entry as DiaryEntry).insight!.text.slice(0, 80), query)}...</span>
                      </div>
                    )}
                    
                    {result.type === 'calendar' && (
                      <div className="diary-search-result-meta">
                        <span className="diary-search-result-category">
                          {(result.entry as CalendarNoteEntry).category}
                        </span>
                      </div>
                    )}
                    
                    <div className="diary-search-result-meta">
                      <span>{result.entry.content.split(/\s+/).length} words</span>
                      <span>•</span>
                      <span>{new Intl.DateTimeFormat(i18n.language || 'en', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      }).format(new Date(result.entry.timestamp))}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="diary-search-empty">
              <div className="diary-search-empty-icon">🔍</div>
              <h3>No entries found</h3>
              <p>
                {query 
                  ? `No entries match "${query}"` 
                  : 'Try adjusting your filters'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiarySearch;
