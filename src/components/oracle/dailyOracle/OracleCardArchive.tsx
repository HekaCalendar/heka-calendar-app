/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║              DAILY ORACLE — CARD ARCHIVE                                  ║
 * ║                                                                           ║
 * ║  Browse past daily draws, see patterns, revisit old messages.             ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OracleCardArtwork } from './OracleCardArtwork';
import type { DailyOracleCard } from './cardEngine';
import { getArchetypeById } from './archetypes';
import { dbGetAllCards } from './cardDatabase';

interface OracleCardArchiveProps {
  onClose: () => void;
  onSelectCard: (card: DailyOracleCard) => void;
}

export const OracleCardArchive: React.FC<OracleCardArchiveProps> = ({
  onClose,
  onSelectCard,
}) => {
  const { t } = useTranslation('journal');
  const [cards, setCards] = useState<DailyOracleCard[]>([]);
  const [filter, setFilter] = useState<'all' | 'fire' | 'water' | 'air' | 'earth' | 'void'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dbGetAllCards().then(all => {
      setCards(all.sort((a, b) => b.date.localeCompare(a.date)));
      setIsLoading(false);
    });
  }, []);

  const filtered = filter === 'all'
    ? cards
    : cards.filter(c => c.element === filter);

  // Element color mapping for filter chips
  const elementColors: Record<string, string> = {
    fire: '#ef4444',
    water: '#3b82f6',
    air: '#f59e0b',
    earth: '#22c55e',
    void: '#9d4edd',
  };

  if (isLoading) {
    return (
      <div className="oracle-card-archive">
        <div className="archive-loading">
          <div className="loading-orb"><div className="orb-core">✨</div></div>
          <p>{t('dailyOracle.loadingArchive')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="oracle-card-archive">
      <div className="archive-header">
        <button className="back-btn" onClick={onClose}>← {t('dailyOracle.back')}</button>
        <h2>{t('dailyOracle.archiveTitle')}</h2>
        <span className="archive-count">{cards.length} {t('dailyOracle.cardsDrawn')}</span>
      </div>

      {/* Element Filter */}
      <div className="archive-filters">
        {(['all', 'fire', 'water', 'air', 'earth', 'void'] as const).map(el => (
          <button
            key={el}
            className={`filter-chip ${filter === el ? 'active' : ''}`}
            onClick={() => setFilter(el)}
            style={filter === el && el !== 'all' ? { borderColor: elementColors[el], color: elementColors[el] } : {}}
          >
            {el === 'all' ? t('dailyOracle.filterAll') : el}
          </button>
        ))}
      </div>

      {/* Pattern Summary */}
      {cards.length > 0 && (
        <div className="archive-patterns">
          {Object.entries(
            cards.reduce((acc, c) => {
              acc[c.element] = (acc[c.element] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([el, count]) => (
              <span key={el} className="pattern-badge" style={{ color: elementColors[el] || '#888' }}>
                {el}: {count}
              </span>
            ))}
        </div>
      )}

      {/* Cards Grid */}
      <div className="archive-grid">
        {filtered.map(card => {
          const archetype = getArchetypeById(card.archetypeId);
          if (!archetype) return null;
          return (
            <button
              key={card.id}
              className="archive-card-mini"
              onClick={() => onSelectCard(card)}
            >
              <div className="mini-artwork">
                <OracleCardArtwork
                  archetype={archetype}
                  seed={card.artworkSeed}
                  size={100}
                  revealed={card.isRevealed}
                />
              </div>
              <div className="mini-info">
                <span className="mini-date">{card.date}</span>
                <span className="mini-title">{card.isRevealed ? card.title : '???'}</span>
                <span className="mini-number">{String(card.archetypeNumber).padStart(2, '0')}</span>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="archive-empty">
          <span className="empty-icon">🌑</span>
          <p>{t('dailyOracle.noCardsYet')}</p>
        </div>
      )}
    </div>
  );
};
