/**
 * Search Modal Component — Enhanced Unified Search
 * Search for dates, calendar notes, holidays, and journal entries
 * with live debounced search, fuzzy matching, and keyboard navigation.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { navigateToMonth, selectDate, setView } from '../store';
import { HEKA_MONTHS, getTodayHekaDate, civilToHeka as calendarCivilToHeka, hekaToCivil } from '../services/calendarService';
import type { HekaDate, HekaMonthIndex, NoteData } from '../types';
import { COMPREHENSIVE_HOLIDAYS } from '../types/holidays-comprehensive';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'all' | 'dates' | 'notes' | 'holidays';

type SearchResultType = 'heka-date' | 'civil-date' | 'calendar-note' | 'holiday';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  date?: Date;
  hekaDate?: HekaDate;
  data?: any;
  score: number;
}

const SEARCH_HISTORY_KEY = 'heka-search-history';
const MAX_HISTORY = 10;
const DEBOUNCE_MS = 250;

// ═══════════════════════════════════════════════════════════════════════════════
// DATE PARSING
// ═══════════════════════════════════════════════════════════════════════════════

function parseCivilDate(query: string, currentYear: number): Date | null {
  const lower = query.toLowerCase().trim();
  const months: Record<string, number> = {
    january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2,
    april: 3, apr: 3, may: 4, june: 5, jun: 5, july: 6, jul: 6,
    august: 7, aug: 7, september: 8, sep: 8, sept: 8,
    october: 9, oct: 9, november: 10, nov: 10, december: 11, dec: 11,
  };

  // Natural language: today, tomorrow, yesterday
  if (lower === 'today') return new Date();
  if (lower === 'tomorrow') {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }
  if (lower === 'yesterday') {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }

  // Pattern: ordinal of month (e.g., "31st of january")
  const ordinalPattern = /^(\d{1,2})(?:st|nd|rd|th)?(?:\s+of)?\s+([a-z]+)(?:\s+(\d{4}))?$/i;
  const ordinalMatch = lower.match(ordinalPattern);
  if (ordinalMatch) {
    const day = parseInt(ordinalMatch[1]);
    const monthName = ordinalMatch[2];
    const year = ordinalMatch[3] ? parseInt(ordinalMatch[3]) : currentYear;
    const month = months[monthName];
    if (month !== undefined && day >= 1 && day <= 31) {
      const date = new Date(year, month, day);
      if (date.getMonth() === month) return date;
    }
  }

  // Pattern: month ordinal (e.g., "january 31st")
  const monthOrdinalPattern = /^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?$/i;
  const monthOrdinalMatch = lower.match(monthOrdinalPattern);
  if (monthOrdinalMatch) {
    const monthName = monthOrdinalMatch[1];
    const day = parseInt(monthOrdinalMatch[2]);
    const year = monthOrdinalMatch[3] ? parseInt(monthOrdinalMatch[3]) : currentYear;
    const month = months[monthName];
    if (month !== undefined && day >= 1 && day <= 31) {
      const date = new Date(year, month, day);
      if (date.getMonth() === month) return date;
    }
  }

  // Pattern: DD/MM/YYYY or DD-MM-YYYY
  const slashPattern = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/;
  const slashMatch = lower.match(slashPattern);
  if (slashMatch) {
    const day = parseInt(slashMatch[1]);
    const month = parseInt(slashMatch[2]) - 1;
    const year = parseInt(slashMatch[3]);
    const date = new Date(year, month, day);
    if (date.getMonth() === month) return date;
  }

  // Pattern: YYYY-MM-DD
  const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  const isoMatch = lower.match(isoPattern);
  if (isoMatch) {
    const year = parseInt(isoMatch[1]);
    const month = parseInt(isoMatch[2]) - 1;
    const day = parseInt(isoMatch[3]);
    const date = new Date(year, month, day);
    if (date.getMonth() === month) return date;
  }

  return null;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function parseHekaDate(query: string, currentYear: number): HekaDate | null {
  const lower = query.toLowerCase().trim();
  const monthMap: Record<string, number> = {};
  HEKA_MONTHS.forEach((m, i) => {
    monthMap[m.name.toLowerCase()] = i;
    monthMap[m.name.toLowerCase().slice(0, 3)] = i;
  });

  const pattern = /^([a-z]+)\s+(\d{1,2})(?:\s+(\d{4}))?$/i;
  const match = lower.match(pattern);

  if (match) {
    const monthName = match[1];
    const day = parseInt(match[2]);
    const year = match[3] ? parseInt(match[3]) : currentYear;
    const month = monthMap[monthName];
    if (month !== undefined && day >= 1 && day <= 31) {
      const maxDays = month === 12 ? (isLeapYear(year + 1) ? 30 : 29) : 28;
      if (day <= maxDays) {
        return { year, month: month as HekaMonthIndex, day };
      }
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUZZY MATCHING
// ═══════════════════════════════════════════════════════════════════════════════

function fuzzyScore(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  // Simple fuzzy: count matching chars in order
  let ti = 0, qi = 0, matches = 0;
  while (ti < t.length && qi < q.length) {
    if (t[ti] === q[qi]) { matches++; qi++; }
    ti++;
  }
  if (qi === q.length) return 30 + (matches / q.length) * 20;
  return 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH HISTORY
// ═══════════════════════════════════════════════════════════════════════════════

function loadSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSearchHistory(history: string[]) {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch { /* ignore */ }
}

function addToHistory(query: string) {
  if (!query.trim()) return;
  const history = loadSearchHistory();
  const next = [query.trim(), ...history.filter(h => h.toLowerCase() !== query.trim().toLowerCase())];
  saveSearchHistory(next.slice(0, MAX_HISTORY));
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

function searchDates(query: string): SearchResult[] {
  const today = getTodayHekaDate();
  const results: SearchResult[] = [];

  const civilDate = parseCivilDate(query, today.year);
  if (civilDate) {
    const hekaDate = calendarCivilToHeka(civilDate);
    if (hekaDate) {
      results.push({
        id: `civil-${civilDate.toISOString()}`,
        type: 'civil-date',
        title: civilDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
        subtitle: `HEKA: ${HEKA_MONTHS[hekaDate.month].name} ${hekaDate.day}, ${hekaDate.year}`,
        date: civilDate,
        hekaDate,
        score: 100,
      });
    }
  }

  const hekaDate = parseHekaDate(query, today.year);
  if (hekaDate) {
    const civilDate = hekaToCivil(hekaDate);
    results.push({
      id: `heka-${hekaDate.year}-${hekaDate.month}-${hekaDate.day}`,
      type: 'heka-date',
      title: `${HEKA_MONTHS[hekaDate.month].name} ${hekaDate.day}, ${hekaDate.year}`,
      subtitle: `Civil: ${civilDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}`,
      date: civilDate,
      hekaDate,
      score: 100,
    });
  }

  return results;
}

function searchCalendarNotes(query: string, notes: Record<string, NoteData[]>): SearchResult[] {
  const results: SearchResult[] = [];
  const q = query.toLowerCase().trim();
  if (!q) return results;

  for (const [dayKey, dayNotes] of Object.entries(notes)) {
    for (const note of dayNotes) {
      const contentScore = fuzzyScore(note.content, query);
      const categoryScore = note.category ? fuzzyScore(note.category, query) : 0;
      const tagScore = note.tags?.some(t => fuzzyScore(t, query) > 0) ? 40 : 0;
      const score = Math.max(contentScore, categoryScore, tagScore);

      if (score > 0) {
        results.push({
          id: `note-${note.id}`,
          type: 'calendar-note',
          title: note.content.slice(0, 60) + (note.content.length > 60 ? '...' : ''),
          subtitle: `${dayKey}${note.category ? ` • ${note.category}` : ''}${note.mood ? ` • Mood: ${note.mood}/5` : ''}`,
          data: { note, dayKey },
          score,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

function searchHolidays(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const q = query.toLowerCase().trim();
  if (!q) return results;

  for (const holiday of COMPREHENSIVE_HOLIDAYS) {
    const nameScore = fuzzyScore(holiday.name, query);
    const descScore = holiday.description ? fuzzyScore(holiday.description, query) : 0;
    const score = Math.max(nameScore, descScore);

    if (score > 0) {
      const [month, day] = holiday.date.split('-').map(Number);
      results.push({
        id: `holiday-${holiday.name}-${holiday.date}`,
        type: 'holiday',
        title: holiday.name,
        subtitle: `${month}/${day}${holiday.description ? ` • ${holiday.description.slice(0, 60)}` : ''}`,
        data: holiday,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

function performSearch(query: string, category: SearchCategory, notes: Record<string, NoteData[]>): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  let results: SearchResult[] = [];

  if (category === 'all' || category === 'dates') {
    results = results.concat(searchDates(q));
  }
  if (category === 'all' || category === 'notes') {
    results = results.concat(searchCalendarNotes(q, notes));
  }
  if (category === 'all' || category === 'holidays') {
    results = results.concat(searchHolidays(q));
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 15);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notes = useSelector((state: RootState) => state.calendar.notes);

  // Load history on open
  useEffect(() => {
    if (isOpen) {
      setHistory(loadSearchHistory());
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
      setShowHistory(true);
      setCategory('all');
    }
  }, [isOpen]);

  // Live debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setShowHistory(history.length > 0);
      setSelectedIndex(-1);
      return;
    }
    setShowHistory(false);
    debounceRef.current = setTimeout(() => {
      const found = performSearch(query, category, notes);
      setResults(found);
      setSelectedIndex(found.length > 0 ? 0 : -1);
    }, DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, category, notes, history.length]);

  const handleSelectResult = useCallback((result: SearchResult) => {
    addToHistory(query);
    if (result.hekaDate) {
      dispatch(navigateToMonth({ year: result.hekaDate.year, month: result.hekaDate.month }));
      dispatch(setView('month'));
      dispatch(selectDate(result.hekaDate));
    } else if (result.type === 'calendar-note' && result.data?.dayKey) {
      const [year, month] = result.data.dayKey.split('-').map(Number);
      dispatch(navigateToMonth({ year, month: month - 1 }));
      dispatch(setView('month'));
      dispatch(selectDate({ year, month: (month - 1) as HekaMonthIndex, day: 1 }));
    }
    onClose();
  }, [dispatch, onClose, query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const max = results.length - 1;
      setSelectedIndex(prev => (prev < max ? prev + 1 : max));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelectResult(results[selectedIndex]);
      } else if (query.trim()) {
        // If nothing selected but query exists, perform search and select first
        const found = performSearch(query, category, notes);
        if (found.length > 0) handleSelectResult(found[0]);
      }
    }
  }, [results, selectedIndex, query, category, notes, handleSelectResult, onClose]);

  const handleHistoryClick = (h: string) => {
    setQuery(h);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const getCategoryIcon = (cat: SearchCategory) => {
    switch (cat) {
      case 'dates': return '📅';
      case 'notes': return '📝';
      case 'holidays': return '🎉';
      default: return '✨';
    }
  };

  const getResultIcon = (type: SearchResultType) => {
    switch (type) {
      case 'heka-date': return '🌙';
      case 'civil-date': return '📅';
      case 'calendar-note': return '📝';
      case 'holiday': return '🎉';
      default: return '✨';
    }
  };

  if (!isOpen) return null;

  const categories: { id: SearchCategory; label: string }[] = [
    { id: 'all', label: t('all') },
    { id: 'dates', label: t('dates') },
    { id: 'notes', label: t('notes') },
    { id: 'holidays', label: t('holidays') },
  ];

  const hasContent = query.trim().length > 0;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '560px', padding: 0, overflow: 'hidden' }}>
        {/* Search Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(201, 162, 74, 0.15)',
          background: 'linear-gradient(180deg, rgba(201, 162, 74, 0.04) 0%, transparent 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: '1.25rem' }}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('searchPlaceholder')}
              style={{
                flex: 1,
                padding: '0.5rem 0',
                fontSize: '1.1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }}
              autoFocus
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem',
                }}
                aria-label={t('common.clear')}
              >
                ×
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label={t('common.close')}
            >
              ×
            </button>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: category === cat.id ? 'rgba(201, 162, 74, 0.4)' : 'rgba(255,255,255,0.08)',
                  background: category === cat.id ? 'rgba(201, 162, 74, 0.12)' : 'rgba(255,255,255,0.03)',
                  color: category === cat.id ? 'var(--color-gold)' : 'var(--color-text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <span>{getCategoryIcon(cat.id)}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div style={{
          maxHeight: '55vh',
          overflowY: 'auto',
          padding: '0.75rem',
        }}>
          {/* Search History */}
          {showHistory && history.length > 0 && !hasContent && (
            <div style={{ marginBottom: 12 }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--color-text-muted)',
                marginBottom: 8, paddingLeft: 8,
              }}>
                {t('recentSearches')}
              </div>
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleHistoryClick(h)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 162, 74, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ opacity: 0.5 }}>↻</span>
                  <span>{h}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {hasContent && results.length > 0 && (
            <div>
              <div style={{
                fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--color-text-muted)',
                marginBottom: 8, paddingLeft: 8,
              }}>
                {results.length} {results.length === 1 ? t('result') : t('results')}
              </div>
              {results.map((result, idx) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '10px 12px',
                    marginBottom: 6,
                    background: selectedIndex === idx ? 'rgba(201, 162, 74, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${selectedIndex === idx ? 'rgba(201, 162, 74, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRadius: 10,
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span style={{ fontSize: '1.1rem', marginTop: 2 }}>{getResultIcon(result.type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: 2 }}>
                      {result.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      {result.subtitle}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.6rem', padding: '2px 6px',
                    background: 'rgba(201, 162, 74, 0.1)',
                    borderRadius: 4, color: 'var(--color-gold)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}>
                    {t(result.type === 'heka-date' ? 'hekaDate' : result.type === 'civil-date' ? 'civilDate' : result.type === 'calendar-note' ? 'calendarNote' : result.type === 'holiday' ? 'holiday' : result.type)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {hasContent && results.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '2rem 1rem',
              color: 'var(--color-text-muted)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.5 }}>🔍</div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>{t('noResults')}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                {t('tryDifferentKeywords')}
              </div>
            </div>
          )}

          {/* Tips / Empty Query */}
          {!hasContent && (!showHistory || history.length === 0) && (
            <div style={{ padding: '1rem 8px' }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--color-text-muted)',
                marginBottom: 12,
              }}>
                {t('trySearchingFor')}
              </div>
              {[
                { icon: '📅', text: t('calendar:searchTips.tip1'), type: t('date') },
                { icon: '🌙', text: t('calendar:searchTips.tip2'), type: t('hekaDate') },
                { icon: '📝', text: t('calendar:searchTips.tip3'), type: t('note') },
                { icon: '🎉', text: t('calendar:searchTips.tip4'), type: t('holiday') },
                { icon: '📆', text: t('calendar:searchTips.tip5'), type: t('date') },
              ].map((tip, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.85rem',
                }}>
                  <span>{tip.icon}</span>
                  <span style={{ flex: 1 }}>{tip.text}</span>
                  <span style={{
                    fontSize: '0.6rem', padding: '2px 6px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 4, color: 'var(--color-text-muted)',
                  }}>
                    {tip.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 1rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span>{t('navigate')}</span>
            <span>{t('selectKey')}</span>
            <span>{t('escClose')}</span>
          </div>
          <span>{t('hekaUnifiedSearch')}</span>
        </div>
      </div>
    </div>
  );
};
