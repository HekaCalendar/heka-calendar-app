/**
 * Diary Mobile Navigation
 * Bottom tab bar for mobile diary navigation
 */

import { useState } from 'react';
import '../styles/diary-mobile-nav.css';

interface DiaryMobileNavProps {
  currentView: 'timeline' | 'editor' | 'transits';
  onViewChange: (view: 'timeline' | 'editor' | 'transits') => void;
  onSearch: () => void;
  entryCount: number;
}

export const DiaryMobileNav: React.FC<DiaryMobileNavProps> = ({
  currentView,
  onViewChange,
  onSearch,
  entryCount,
}) => {
  const [showMore, setShowMore] = useState(false);

  const navItems = [
    { id: 'timeline', icon: '📖', label: 'Journal', active: currentView === 'timeline' },
    { id: 'editor', icon: '✨', label: 'Write', active: currentView === 'editor' },
    { id: 'transits', icon: '✦', label: 'Transits', active: currentView === 'transits' },
  ] as const;

  return (
    <>
      <nav className="diary-mobile-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`diary-mobile-nav-item ${item.active ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="diary-mobile-nav-icon">{item.icon}</span>
            <span className="diary-mobile-nav-label">{item.label}</span>
            {item.id === 'timeline' && entryCount > 0 && (
              <span className="diary-mobile-nav-badge">{entryCount}</span>
            )}
          </button>
        ))}
        
        <button 
          className="diary-mobile-nav-item"
          onClick={() => setShowMore(!showMore)}
        >
          <span className="diary-mobile-nav-icon">☰</span>
          <span className="diary-mobile-nav-label">More</span>
        </button>
      </nav>

      {/* More Menu Overlay */}
      {showMore && (
        <div className="diary-mobile-more-overlay" onClick={() => setShowMore(false)}>
          <div className="diary-mobile-more-menu" onClick={e => e.stopPropagation()}>
            <button className="diary-mobile-more-item" onClick={() => { onSearch(); setShowMore(false); }}>
              <span>🔍</span>
              <span>Search</span>
            </button>
            <button className="diary-mobile-more-item" onClick={() => setShowMore(false)}>
              <span>⚙️</span>
              <span>Settings</span>
            </button>
            <button className="diary-mobile-more-item" onClick={() => setShowMore(false)}>
              <span>📥</span>
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DiaryMobileNav;
