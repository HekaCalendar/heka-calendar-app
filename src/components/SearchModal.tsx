/**
 * Search Modal Component
 * Search for HEKA or civil dates
 */

import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { navigateToMonth, selectDate } from '../store';
import { HEKA_MONTHS, getTodayHekaDate } from '../services/calendarService';
import type { HekaDate, HekaMonthIndex } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult = {
  type: 'heka' | 'civil';
  hekaDate: HekaDate;
  civilDate: Date;
  display: string;
};

// Parse civil date phrases like "31st of january", "jan 15", "15 january 2026"
function parseCivilDate(query: string, currentYear: number): Date | null {
  const lower = query.toLowerCase().trim();
  
  // Month names and abbreviations
  const months: Record<string, number> = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8, sept: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
  };
  
  // Try patterns:
  // 1. "31st of january" or "31st january"
  // 2. "january 31st" or "jan 31"
  // 3. "31/01/2026" or "31-01-2026"
  // 4. "2026-01-31"
  
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
      if (date.getMonth() === month) { // Valid date check
        return date;
      }
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
      if (date.getMonth() === month) {
        return date;
      }
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
    if (date.getMonth() === month) {
      return date;
    }
  }
  
  // Pattern: YYYY-MM-DD
  const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  const isoMatch = lower.match(isoPattern);
  if (isoMatch) {
    const year = parseInt(isoMatch[1]);
    const month = parseInt(isoMatch[2]) - 1;
    const day = parseInt(isoMatch[3]);
    const date = new Date(year, month, day);
    if (date.getMonth() === month) {
      return date;
    }
  }
  
  return null;
}

// Convert civil date to HEKA date
function civilToHeka(civilDate: Date): HekaDate | null {
  // HEKA year starts April 1
  const year = civilDate.getMonth() < 3 ? civilDate.getFullYear() - 1 : civilDate.getFullYear();
  
  // Find which HEKA month this date falls into
  // We'll iterate through months to find the right one
  const monthStarts: Date[] = [];
  let currentDate = new Date(year, 3, 1); // April 1
  
  for (let m = 0; m < 13; m++) {
    monthStarts.push(new Date(currentDate));
    // Add 28 days for next month (29 for March in leap years)
    const daysToAdd = m === 11 ? (isLeapYear(year + 1) ? 30 : 29) : 28;
    currentDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  }
  
  // Find which month contains the civil date
  for (let m = 0; m < 12; m++) {
    const monthStart = monthStarts[m];
    const monthEnd = new Date(monthStarts[m + 1].getTime() - 24 * 60 * 60 * 1000);
    
    if (civilDate >= monthStart && civilDate <= monthEnd) {
      const dayDiff = Math.floor((civilDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
      return { year, month: m as HekaMonthIndex, day: dayDiff + 1 };
    }
  }
  
  // Check March (last month)
  const marchStart = monthStarts[12];
  const marchDays = isLeapYear(year + 1) ? 30 : 29;
  const marchEnd = new Date(marchStart.getTime() + (marchDays - 1) * 24 * 60 * 60 * 1000);
  
  if (civilDate >= marchStart && civilDate <= marchEnd) {
    const dayDiff = Math.floor((civilDate.getTime() - marchStart.getTime()) / (1000 * 60 * 60 * 24));
    return { year, month: 12 as HekaMonthIndex, day: dayDiff + 1 };
  }
  
  return null;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Parse HEKA date query like "hexa 15" or "april 5 2026"
function parseHekaDate(query: string, currentYear: number): HekaDate | null {
  const lower = query.toLowerCase().trim();
  
  // Build month name map
  const monthMap: Record<string, number> = {};
  HEKA_MONTHS.forEach((m, i) => {
    monthMap[m.name.toLowerCase()] = i;
    monthMap[m.name.toLowerCase().slice(0, 3)] = i;
  });
  
  // Pattern: "month day" or "month day year"
  const pattern = /^([a-z]+)\s+(\d{1,2})(?:\s+(\d{4}))?$/i;
  const match = lower.match(pattern);
  
  if (match) {
    const monthName = match[1];
    const day = parseInt(match[2]);
    const year = match[3] ? parseInt(match[3]) : currentYear;
    const month = monthMap[monthName];
    
    if (month !== undefined && day >= 1 && day <= 31) {
      // Validate day based on month (March has 29/30 days)
      const maxDays = month === 12 ? (isLeapYear(year + 1) ? 30 : 29) : 28;
      if (day <= maxDays) {
        return { year, month: month as HekaMonthIndex, day };
      }
    }
  }
  
  return null;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const today = getTodayHekaDate();
  
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    const found: SearchResult[] = [];
    
    // Try parsing as civil date first (with natural language)
    const civilDate = parseCivilDate(searchQuery, today.year);
    if (civilDate) {
      const hekaDate = civilToHeka(civilDate);
      if (hekaDate) {
        found.push({
          type: 'civil',
          hekaDate,
          civilDate,
          display: `Civil: ${civilDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`,
        });
      }
    }
    
    // Try parsing as HEKA date
    const hekaDate = parseHekaDate(searchQuery, today.year);
    if (hekaDate) {
      // Calculate civil date
      const year = hekaDate.year;
      const monthIndex = hekaDate.month;
      
      // Calculate civil start of month
      let civilStart = new Date(year, 3, 1); // April 1
      for (let i = 0; i < monthIndex; i++) {
        const days = i === 12 ? (isLeapYear(year + 1) ? 30 : 29) : 28;
        civilStart = new Date(civilStart.getTime() + days * 24 * 60 * 60 * 1000);
      }
      
      const civilDate = new Date(civilStart.getTime() + (hekaDate.day - 1) * 24 * 60 * 60 * 1000);
      
      found.push({
        type: 'heka',
        hekaDate,
        civilDate,
        display: `HEKA: ${HEKA_MONTHS[hekaDate.month].name} ${hekaDate.day}, ${hekaDate.year}`,
      });
    }
    
    setResults(found);
  }, [today.year]);
  
  const handleSelectResult = useCallback((result: SearchResult) => {
    dispatch(navigateToMonth({ year: result.hekaDate.year, month: result.hekaDate.month }));
    dispatch(selectDate(result.hekaDate));
    onClose();
  }, [dispatch, onClose]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch(query);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [query, performSearch, onClose]);
  
  // Clear results when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const examples = [
    '"31st of january" - Civil date',
    '"hexa 15" - HEKA date',
    '"april 5 2026" - HEKA with year',
    '"2026-01-31" - ISO format',
  ];
  
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: '500px' }}>
        <div className="modal__header">
          <h2 className="modal__title">Search Dates</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Try: 31st of january, hexa 15, 2026-03-15..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
            }}
            autoFocus
          />
          <button
            className="btn btn--primary"
            onClick={() => performSearch(query)}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Search
          </button>
        </div>
        
        {results.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '0.5rem'
            }}>
              Results
            </div>
            {results.map((result, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectResult(result)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  background: 'rgba(201, 162, 39, 0.08)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 162, 39, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 162, 39, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.2)';
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                  {result.display}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {result.type === 'civil' 
                    ? `→ HEKA: ${HEKA_MONTHS[result.hekaDate.month].name} ${result.hekaDate.day}, ${result.hekaDate.year}`
                    : `→ Civil: ${result.civilDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
                  }
                </div>
              </button>
            ))}
          </div>
        )}
        
        <div style={{ 
          padding: '0.75rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ 
            fontSize: '0.7rem', 
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '0.5rem'
          }}>
            Examples
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
            {examples.map((ex, i) => (
              <div key={i} style={{ marginBottom: '0.25rem' }}>{ex}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
