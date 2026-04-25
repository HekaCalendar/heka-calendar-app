import React from 'react';
import type { JournalMode } from './types';

interface OracleNavigationProps {
  mode: JournalMode;
  setMode: (mode: JournalMode) => void;
  totalEntries: number;
  calendarNotes: number;
  activeTransits: number;
  onSearch: () => void;
  onSettings: () => void;
}

export const OracleNavigation: React.FC<OracleNavigationProps> = ({
  mode,
  setMode,
  totalEntries,
  calendarNotes,
  activeTransits,
  onSearch,
  onSettings,
}) => {
  const items = [
    { id: 'oracle', label: 'Oracle', icon: '🔮' },
    { id: 'entries', label: 'Entries', icon: '📜', count: totalEntries + calendarNotes },
    { id: 'celestial', label: 'Celestial', icon: '✨', count: activeTransits },
    { id: 'scribe', label: 'Scribe', icon: '✍️' },
    { id: 'tracker', label: 'Tracker', icon: '🌙' },
  ] as const;

  return (
    <nav className="oracle-mode-nav">
      {items.map((m) => (
        <button
          key={m.id}
          className={`mode-btn ${mode === m.id ? 'active' : ''}`}
          onClick={() => setMode(m.id as JournalMode)}
        >
          <span className="mode-icon">{m.icon}</span>
          <span className="mode-label">{m.label}</span>
          {'count' in m && (m as any).count > 0 && (
            <span className="mode-badge">{(m as any).count}</span>
          )}
        </button>
      ))}
      
      <div className="nav-divider" />
      
      <button className="mode-btn icon-only" onClick={onSearch}>
        🔍
      </button>
      <button className="mode-btn icon-only" onClick={onSettings}>
        ⚙️
      </button>
    </nav>
  );
};
