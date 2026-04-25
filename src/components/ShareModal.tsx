/**
 * Share Modal Component
 * Share calendar with or without notes
 */

import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ShareFormat = 'link' | 'json';

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [includeNotes, setIncludeNotes] = useState(false);
  const [format, setFormat] = useState<ShareFormat>('link');
  const [copied, setCopied] = useState(false);
  
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate);
  const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
  const location = useSelector((state: RootState) => state.calendar.location);
  const notes = useSelector((state: RootState) => state.calendar.notes);
  const display = useSelector((state: RootState) => state.calendar.display);
  
  const generateShareData = useCallback(() => {
    const baseData = {
      version: '2.0',
      type: 'heka-calendar',
      created: new Date().toISOString(),
      calendar: {
        year: viewDate.year,
        month: viewDate.month,
        timeMode,
        location,
        display,
      },
    };
    
    if (includeNotes && Object.keys(notes).length > 0) {
      return JSON.stringify({ ...baseData, notes }, null, 2);
    }
    
    return JSON.stringify(baseData, null, 2);
  }, [viewDate, timeMode, location, display, notes, includeNotes]);
  
  const generateShareLink = useCallback(() => {
    const params = new URLSearchParams();
    params.set('y', viewDate.year.toString());
    params.set('m', (viewDate.month + 1).toString());
    params.set('mode', timeMode);
    params.set('loc', location);
    
    if (includeNotes && Object.keys(notes).length > 0) {
      // Compress notes for URL
      const notesData = btoa(JSON.stringify(notes));
      params.set('notes', notesData);
    }
    
    return `${window.location.origin}${window.location.pathname}#/month/${viewDate.year}/${viewDate.month + 1}?${params.toString()}`;
  }, [viewDate, timeMode, location, notes, includeNotes]);
  
  const handleCopy = useCallback(async () => {
    const data = format === 'link' ? generateShareLink() : generateShareData();
    
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [format, generateShareLink, generateShareData]);
  
  const handleDownload = useCallback(() => {
    const data = generateShareData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heka-calendar-${viewDate.year}-${includeNotes ? 'with-notes' : 'config'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateShareData, viewDate.year, includeNotes]);
  
  if (!isOpen) return null;
  
  const noteCount = Object.keys(notes).length;
  
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: '500px' }}>
        <div className="modal__header">
          <h2 className="modal__title">Share Calendar</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        {/* Include Notes Toggle */}
        <div style={{ 
          marginBottom: '1.5rem',
          padding: '1rem',
          background: includeNotes ? 'rgba(74, 201, 138, 0.08)' : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${includeNotes ? 'rgba(74, 201, 138, 0.3)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          transition: 'all 0.2s ease',
        }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={includeNotes}
              onChange={(e) => setIncludeNotes(e.target.checked)}
              style={{ 
                width: '20px', 
                height: '20px', 
                accentColor: '#22c55e',
                cursor: 'pointer',
              }}
            />
            <div>
              <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                Include my notes
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {noteCount > 0 
                  ? `${noteCount} note${noteCount !== 1 ? 's' : ''} will be shared`
                  : 'No notes to share'
                }
              </div>
            </div>
          </label>
        </div>
        
        {/* Format Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '0.75rem'
          }}>
            Share Format
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${format === 'link' ? 'btn--active' : ''}`}
              onClick={() => setFormat('link')}
              style={{ flex: 1 }}
            >
              🔗 Link
            </button>
            <button
              className={`btn ${format === 'json' ? 'btn--active' : ''}`}
              onClick={() => setFormat('json')}
              style={{ flex: 1 }}
            >
              📄 JSON
            </button>
          </div>
        </div>
        
        {/* Preview */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '0.5rem'
          }}>
            Preview
          </div>
          <div style={{
            padding: '0.75rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            maxHeight: '120px',
            overflow: 'auto',
            wordBreak: 'break-all',
          }}>
            {format === 'link' ? generateShareLink() : generateShareData()}
          </div>
        </div>
        
        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            className="btn btn--primary"
            onClick={handleCopy}
            style={{ flex: 1 }}
          >
            {copied ? '✓ Copied!' : `Copy ${format === 'link' ? 'Link' : 'JSON'}`}
          </button>
          {format === 'json' && (
            <button className="btn" onClick={handleDownload}>
              Download
            </button>
          )}
        </div>
        
        {/* Info */}
        <div style={{ 
          padding: '0.75rem',
          background: 'rgba(201, 162, 39, 0.05)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
        }}>
          {includeNotes 
            ? '📝 Recipients will see your calendar exactly as you see it, including all saved notes.'
            : '📅 Recipients will receive a clean calendar ready for their own use.'
          }
        </div>
      </div>
    </div>
  );
};
