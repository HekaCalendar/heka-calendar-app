import React from 'react';
import { useTranslation } from 'react-i18next';
import type { JournalMode } from './types';

interface OracleNavigationProps {
  mode: JournalMode;
  setMode: (mode: JournalMode) => void;
  totalEntries: number;
  calendarNotes: number;
  onSearch: () => void;
  onSettings: () => void;
  onImportExport?: () => void;
}

export const OracleNavigation: React.FC<OracleNavigationProps> = ({
  mode,
  setMode,
  totalEntries,
  calendarNotes,
  onSearch,
  onSettings,
  onImportExport,
}) => {
  const { t } = useTranslation('journal');
  const items = [
    { id: 'oracle', label: t('navigation.oracle'), icon: '🔮' },
    { id: 'entries', label: t('navigation.entries'), icon: '📜', count: totalEntries + calendarNotes },
    { id: 'draw', label: t('navigation.dailyDraw'), icon: '✨' },
    { id: 'scribe', label: t('navigation.scribe'), icon: '✍️' },
    { id: 'community', label: t('navigation.community'), icon: '🤝' },
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
      {onImportExport && (
        <button className="mode-btn icon-only" onClick={onImportExport}>
          💾
        </button>
      )}
    </nav>
  );
};
