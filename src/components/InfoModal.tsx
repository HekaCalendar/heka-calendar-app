/**
 * Info Modal — Celestial Instrument Edition
 * An elite, kinetic, chapter-based guide to HEKA.
 * Precision over ornament. Interaction over instruction.
 */

import React, { useState, useCallback, memo, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChapterId = 'home' | 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6' | 'ch7';

interface Chapter {
  id: ChapterId;
  num: string;
  chip: string;
  title: string;
  hook: string;
  teaser: string;
}

interface CardData {
  h: string;
  b: string;
}

interface GateData {
  t: string;
  tag: string;
  b: string;
}

const chapterOrder: ChapterId[] = ['home', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7'];

const chapterColors: Record<ChapterId, string> = {
  home: '#e8c547',
  ch1: '#e8c547',
  ch2: '#dc2626',
  ch3: '#16a34a',
  ch4: '#2563eb',
  ch5: '#d97706',
  ch6: '#e8c547',
  ch7: '#a1a1aa',
};

const cardIcons: Record<string, string[]> = {
  ch1: ['⚡', '🎯', '🌍'],
  ch2: ['🌱', '⚙️', '🍂'],
  ch3: ['📅', '📓', '🌙'],
  ch4: ['🔄', '✨', '🔀'],
  ch5: ['🏛️', '⛪', '🚀'],
  ch6: ['👁️', '⚡', '🏠'],
  ch7: ['🔋', '🌊', '✊'],
};

function isCardDataArray(value: unknown): value is CardData[] {
  return Array.isArray(value) && value.every(
    (item) => item && typeof item === 'object' && typeof (item as CardData).h === 'string' && typeof (item as CardData).b === 'string'
  );
}

function isGateDataArray(value: unknown): value is GateData[] {
  return Array.isArray(value) && value.every(
    (item) => item && typeof item === 'object' &&
      typeof (item as GateData).t === 'string' &&
      typeof (item as GateData).tag === 'string' &&
      typeof (item as GateData).b === 'string'
  );
}

function useInfoCards(t: (key: string, options?: Record<string, unknown>) => string, chapterId: ChapterId): CardData[] {
  return useMemo(() => {
    const raw = t(`info:infoModal.cardsByChapter.${chapterId}`, { returnObjects: true });
    if (isCardDataArray(raw)) return raw;
    return [];
  }, [t, chapterId]);
}

function useInfoGates(t: (key: string, options?: Record<string, unknown>) => string, chapterId: ChapterId): GateData[] {
  return useMemo(() => {
    const raw = t(`info:infoModal.gatesByChapter.${chapterId}`, { returnObjects: true });
    if (isGateDataArray(raw)) return raw;
    return [];
  }, [t, chapterId]);
}

function useSpotlightFacts(t: (key: string, options?: Record<string, unknown>) => string): string[] {
  return useMemo(() => {
    const raw = t('info:infoModal.spotlight.facts', { returnObjects: true });
    if (Array.isArray(raw) && raw.every((v) => typeof v === 'string')) return raw as string[];
    return [];
  }, [t]);
}

/* ────────────────────────────────────────────────────────────────────────────
   PROGRESS CONSTELLATION — SVG path that draws itself as chapters are visited
   ──────────────────────────────────────────────────────────────────────────── */

const ProgressConstellation: React.FC<{
  current: ChapterId;
  visited: Set<ChapterId>;
  onNodeClick: (id: ChapterId) => void;
}> = ({ current, visited, onNodeClick }) => {
  const nodes = useMemo(() => {
    const total = chapterOrder.length;
    return chapterOrder.map((id, i) => {
      const x = 40 + (i / (total - 1)) * 740;
      const y = 28 + Math.sin(i * 0.55) * 14;
      return { id, x, y, color: chapterColors[id], isCurrent: id === current, isVisited: visited.has(id) };
    });
  }, [current, visited]);

  const pathD = useMemo(() => {
    const visitedNodes = nodes.filter(n => n.isVisited);
    if (visitedNodes.length < 2) return '';
    return visitedNodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ');
  }, [nodes]);

  return (
    <svg className="info-constellation" viewBox="0 0 820 56" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="constellation-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(232,197,71,0.5)" />
          <stop offset="100%" stopColor="rgba(232,197,71,0.1)" />
        </linearGradient>
      </defs>
      {pathD && (
        <path
          d={pathD}
          className="info-constellation__path"
          stroke="url(#constellation-grad)"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {nodes.map(n => (
        <g
          key={n.id}
          className={`info-constellation__node ${n.isCurrent ? 'is-current' : ''} ${n.isVisited ? 'is-visited' : ''}`}
          onClick={() => onNodeClick(n.id)}
          style={{ cursor: 'pointer' }}
        >
          {n.isCurrent && (
            <circle cx={n.x} cy={n.y} r="10" className="info-constellation__pulse" style={{ '--node-color': n.color } as React.CSSProperties} />
          )}
          <circle
            cx={n.x}
            cy={n.y}
            r={n.isCurrent ? 5.5 : n.isVisited ? 4 : 3}
            className="info-constellation__dot"
            style={{ '--node-color': n.color } as React.CSSProperties}
          />
        </g>
      ))}
    </svg>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   FEATURE SPOTLIGHT — Rotating facts that make users curious
   ──────────────────────────────────────────────────────────────────────────── */

const FeatureSpotlight: React.FC<{
  t: (key: string, options?: Record<string, unknown>) => string;
}> = ({ t }) => {
  const facts = useSpotlightFacts(t);
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (facts.length === 0) return;
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex(i => (facts.length > 0 ? (i + 1) % facts.length : 0));
        setIsVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [facts.length]);

  if (facts.length === 0) return null;

  return (
    <div className="info-spotlight">
      <span className="info-spotlight__label">{t('info:infoModal.spotlight.title')}</span>
      <p className={`info-spotlight__text ${isVisible ? 'is-visible' : ''}`}>
        {facts[index]}
      </p>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   HOME VIEW — Bento grid of chapter tiles, spotlight, legal
   ──────────────────────────────────────────────────────────────────────────── */

const HomeView: React.FC<{
  chapters: Chapter[];
  onChapterClick: (id: ChapterId) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  isComplete: boolean;
}> = ({ chapters, onChapterClick, t, isComplete }) => {
  const handleTileMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty('--tilt-x', String(-y * 6));
    e.currentTarget.style.setProperty('--tilt-y', String(x * 6));
  }, []);

  const handleTileMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0');
    e.currentTarget.style.setProperty('--tilt-y', '0');
  }, []);

  const chapterTiles = chapters.slice(1);

  return (
    <div className="info-home">
      <div className="info-home__hero">
        <h1 className="info-home__title">{t('info:infoModal.hero.title')}</h1>
        <p className="info-home__subtitle">
          {t('info:infoModal.hero.subtitleLine1')} {t('info:infoModal.hero.subtitleLine2')}
        </p>
        {isComplete && (
          <span className="info-home__complete-badge">✦ {t('info:infoModal.guideComplete')}</span>
        )}
      </div>

      <div className="info-home__bento">
        {chapterTiles.map(ch => (
          <button
            key={ch.id}
            className="info-home__bento-tile"
            onClick={() => onChapterClick(ch.id)}
            onMouseMove={handleTileMouseMove}
            onMouseLeave={handleTileMouseLeave}
            style={{ '--tile-color': chapterColors[ch.id] } as React.CSSProperties}
          >
            <span className="info-home__tile-num">{ch.num}</span>
            <span className="info-home__tile-title">{ch.title}</span>
            <span className="info-home__tile-teaser">{ch.teaser}</span>
            <span className="info-home__tile-arrow">→</span>
          </button>
        ))}
      </div>

      <FeatureSpotlight t={t} />

      <div className="info-home__legal">
        <a href="privacy-policy.html" target="_blank" rel="noopener noreferrer">
          {t('common:privacy')}
        </a>
        <a href="terms-of-service.html" target="_blank" rel="noopener noreferrer">
          {t('common:terms')}
        </a>
        <span>{t('common:version')} {__APP_VERSION__}</span>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   CHAPTER VIEW — Expandable insight cards, spring-animated gates
   ──────────────────────────────────────────────────────────────────────────── */

const ChapterView: React.FC<{
  chapterId: ChapterId;
  onBack: () => void;
  openGates: Set<string>;
  toggleGate: (key: string) => void;
  expandedCards: Set<string>;
  toggleCard: (key: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}> = ({ chapterId, onBack, openGates, toggleGate, expandedCards, toggleCard, t }) => {
  const cards = useInfoCards(t, chapterId);
  const gates = useInfoGates(t, chapterId);
  const icons = cardIcons[chapterId] || ['◆', '◆', '◆'];
  const color = chapterColors[chapterId];

  return (
    <div className="info-chapter">
      <button className="info-chapter__back" onClick={onBack}>
        <span className="info-chapter__back-arrow">←</span>
        <span>{t('info:infoModal.backToHome')}</span>
      </button>

      <p className="info-chapter__lead" style={{ borderLeftColor: color }}>
        {t(`info:infoModal.chapterLeads.${chapterId}`)}
      </p>

      <div className="info-chapter__cards">
        {cards.map((card, i) => {
          const key = `${chapterId}-card-${i}`;
          const isExpanded = expandedCards.has(key);
          return (
            <div
              key={i}
              className={`info-card ${isExpanded ? 'is-expanded' : ''}`}
              style={{ '--card-color': color } as React.CSSProperties}
            >
              <div className="info-card__header">
                <span className="info-card__icon">{icons[i] || '◆'}</span>
                <h4 className="info-card__title">{card.h}</h4>
              </div>
              {isExpanded ? (
                <>
                  <p className="info-card__body">{card.b}</p>
                  <button className="info-card__toggle" onClick={() => toggleCard(key)}>
                    {t('common:showLess')}
                  </button>
                </>
              ) : (
                <button className="info-card__toggle" onClick={() => toggleCard(key)}>
                  {t('common:expand')}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="info-chapter__gates">
        <h4 className="info-chapter__gates-title">{t('info:infoModal.deeperQuestions')}</h4>
        {gates.map((gate, i) => {
          const key = `${chapterId}-gate-${i}`;
          const isOpen = openGates.has(key);
          return (
            <div
              key={i}
              className={`info-gate ${isOpen ? 'is-open' : ''}`}
              style={{ '--gate-color': color } as React.CSSProperties}
            >
              <button className="info-gate__btn" onClick={() => toggleGate(key)}>
                <span className="info-gate__tag">{gate.tag}</span>
                <span className="info-gate__title">{gate.t}</span>
                <span className="info-gate__chevron">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div className="info-gate__content">
                <p>{gate.b}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────────────────────────────────────── */

const InfoModalComponent: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['info', 'common']);

  const [currentChapter, setCurrentChapter] = useState<ChapterId>('home');
  const [visitedChapters, setVisitedChapters] = useState<Set<ChapterId>>(new Set(['home']));
  const [openGates, setOpenGates] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [transitionKey, setTransitionKey] = useState(0);
  const [animDirection, setAnimDirection] = useState<'left' | 'right'>('right');
  const contentRef = useRef<HTMLDivElement>(null);

  const chapters = useMemo(() =>
    chapterOrder.map(id => ({
      id,
      num: t(`info:infoModal.chapters.${id}.num`),
      chip: t(`info:infoModal.chapters.${id}.chip`),
      title: t(`info:infoModal.chapters.${id}.title`),
      hook: t(`info:infoModal.chapters.${id}.hook`),
      teaser: t(`info:infoModal.chapters.${id}.teaser`),
    })), [t]);

  /* ── Last-read memory ── */
  useEffect(() => {
    if (isOpen) {
      try {
        const last = localStorage.getItem('heka_info_modal_last_chapter') as ChapterId;
        if (last && last !== 'home' && chapterOrder.includes(last)) {
          setCurrentChapter(last);
          setVisitedChapters(prev => new Set(prev).add(last));
        }
      } catch { /* ignore */ }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      try {
        localStorage.setItem('heka_info_modal_last_chapter', currentChapter);
      } catch { /* ignore */ }
    }
  }, [isOpen, currentChapter]);

  /* ── Chapter navigation ── */
  const handleChapterClick = useCallback((id: ChapterId) => {
    const currIdx = chapterOrder.indexOf(currentChapter);
    const nextIdx = chapterOrder.indexOf(id);
    setAnimDirection(nextIdx > currIdx ? 'right' : 'left');
    setTransitionKey(k => k + 1);
    setCurrentChapter(id);
    setOpenGates(new Set());
    setExpandedCards(new Set());
    setVisitedChapters(prev => new Set(prev).add(id));
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentChapter]);

  const goNext = useCallback(() => {
    const idx = chapterOrder.indexOf(currentChapter);
    if (idx < chapterOrder.length - 1) {
      handleChapterClick(chapterOrder[idx + 1]);
    }
  }, [currentChapter, handleChapterClick]);

  const goPrev = useCallback(() => {
    const idx = chapterOrder.indexOf(currentChapter);
    if (idx > 0) {
      handleChapterClick(chapterOrder[idx - 1]);
    }
  }, [currentChapter, handleChapterClick]);

  const toggleGate = useCallback((key: string) => {
    setOpenGates(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleCard = useCallback((key: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === 'Escape') { onClose(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goNext, goPrev, onClose]);

  if (!isOpen) return null;

  const currentChapterData = chapters.find(c => c.id === currentChapter);
  const isHome = currentChapter === 'home';
  const isComplete = visitedChapters.size >= chapterOrder.length;

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal" onClick={e => e.stopPropagation()}>
        {/* Constellation Progress */}
        <div className="info-modal__constellation-wrap">
          <ProgressConstellation
            current={currentChapter}
            visited={visitedChapters}
            onNodeClick={handleChapterClick}
          />
        </div>

        {/* Header */}
        {!isHome && (
          <div className="info-modal__header" style={{ '--header-color': chapterColors[currentChapter] } as React.CSSProperties}>
            <div className="info-modal__title-group">
              <span className="info-modal__chip">{currentChapterData?.chip}</span>
              <h2 className="info-modal__title">{currentChapterData?.title}</h2>
              <p className="info-modal__hook">{currentChapterData?.hook}</p>
            </div>
            <button className="info-modal__close" onClick={onClose} aria-label={t('common:close')}>×</button>
          </div>
        )}
        {isHome && (
          <div className="info-modal__header info-modal__header--home">
            <div className="info-modal__title-group">
              <h2 className="info-modal__title">{t('info:infoModal.hero.title')}</h2>
            </div>
            <button className="info-modal__close" onClick={onClose} aria-label={t('common:close')}>×</button>
          </div>
        )}

        {/* Content */}
        <div
          className={`info-modal__content info-modal__content--enter-${animDirection}`}
          ref={contentRef}
          key={transitionKey}
        >
          {isHome ? (
            <HomeView
              onChapterClick={handleChapterClick}
              t={t}
              chapters={chapters}
              isComplete={isComplete}
            />
          ) : (
            <ChapterView
              chapterId={currentChapter}
              onBack={() => handleChapterClick('home')}
              openGates={openGates}
              toggleGate={toggleGate}
              expandedCards={expandedCards}
              toggleCard={toggleCard}
              t={t}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="info-modal__nav">
          <button
            className="info-modal__nav-btn"
            onClick={() => handleChapterClick('home')}
            data-active={isHome}
          >
            {t('info:infoModal.home')}
          </button>
          {chapters.slice(1).map(ch => (
            <button
              key={ch.id}
              className="info-modal__nav-dot"
              onClick={() => handleChapterClick(ch.id)}
              data-active={currentChapter === ch.id}
              data-visited={visitedChapters.has(ch.id)}
              title={ch.title}
              style={{ '--nav-color': chapterColors[ch.id] } as React.CSSProperties}
            >
              {ch.num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const InfoModal = memo(InfoModalComponent);
InfoModal.displayName = 'InfoModal';
export default InfoModal;
