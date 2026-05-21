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

const cardsByChapter: Record<string, CardData[]> = {
  ch1: [
    { h: 'The Problem You Feel', b: 'Irregular months. Scattered holidays. A year that stumbles from January to December with no sense of beginning, middle, or end. You have felt this friction. HEKA removes it.' },
    { h: 'The Solution We Built', b: 'Thirteen months. Twelve have twenty-eight days in perfect symmetry. March, the closing month, carries the leap day. Four perfect weeks per month. A year that flows: April opens, May through December form the stable core, January through March complete it.' },
    { h: 'The World You Keep', b: 'HEKA does not disrupt your life. Civil dates remain visible. Your appointments, commitments, and legal obligations stay exactly where they are. You simply gain a clearer lens.' },
  ],
  ch2: [
    { h: 'The Opening Arc', b: 'April is the threshold. The year does not begin in winter exhaustion, but in spring vitality. New growth. New projects. The opening announces: something is beginning.' },
    { h: 'The Core Arc', b: 'May through December is the long, stable middle. Nine months of perfectly regular and predictable rhythm. Plan with confidence. Build momentum. This is where the work happens.' },
    { h: 'The Closing Arc', b: 'January through March bring the year to its resolution. Finish what you started. Harvest what you grew. Closure creates space for reflection and prepares you for the next opening.' },
  ],
  ch3: [
    { h: 'Your Civil Dates Stay', b: 'Toggle the civil overlay and see Gregorian dates alongside HEKA. Your dentist appointment, your mother\'s birthday, your tax deadline—all remain exactly where you expect them.' },
    { h: 'Your Journal', b: 'Daily entries with revision history — up to 50 versions kept automatically. Attach photos up to 5 MB. Full-text search across everything. Local by default; cloud backup when you sign in.' },
    { h: 'Your Moon & Stars', b: 'Moon phases, planetary positions, and transits appear at a glance. Optional and precise. Add your birth chart for personal readings through the Oracle.' },
  ],
  ch4: [
    { h: 'SYNC Mode: The Familiar Path', b: 'March gains its extra day when the Gregorian calendar says it should. For daily coordination with the civil world, this is your mode. Same structure. Familiar timing.' },
    { h: 'TRUE Mode: The Honest Path', b: 'HEKA follows its own correction rule: every fourth year has a 30-day March, except every 128th year which does not. This is astronomical precision. This is long-term integrity.' },
    { h: 'Switch Anytime', b: 'The months do not change. The week does not change. Only the correction trigger shifts. Experiment. See which mode fits your needs. You are not locked in.' },
  ],
  ch5: [
    { h: 'Inheritance, Not Design', b: 'Our current calendar is a stack of historical accidents. Roman politics. Religious councils. Astronomical patches added centuries apart. It was never designed as a system.' },
    { h: 'The Gregorian Patch', b: '1582: Pope Gregory fixed the drift problem. But he kept the irregular months, the scattered structure, the inherited chaos. A necessary correction, but not a complete solution.' },
    { h: 'The HEKA Response', b: 'We kept what works: seven-day weeks, seasonal alignment, solar year tracking. We redesigned what did not: month structure, year flow, correction placement. Built for minds that think.' },
  ],
  ch6: [
    { h: 'Step One: Enable the Overlay', b: 'Turn on civil dates. Now you see both systems simultaneously. Your HEKA date and your Gregorian date. The bridge is built. Cross it whenever you need.' },
    { h: 'Step Two: Choose Your Mode', b: 'Start with SYNC if you want familiarity. Switch to TRUE if you want purity. You can change your mind. The calendar adapts to you, not the reverse.' },
    { h: 'Step Three: Live Inside It', b: 'Use HEKA as your primary view. Plan your month. Note your days. Feel the difference of a year with actual structure. The civil world does not need to know. You will know.' },
  ],
  ch7: [
    { h: 'Friction Costs Energy', b: 'Every time you wonder how many days are in this month, you pay a small tax. Every irregularity drains focus. HEKA removes these taxes. You keep your energy for what matters.' },
    { h: 'Rhythm Creates Calm', b: 'When the structure is predictable, the mind relaxes. You know where you are in the year. You feel the opening, the core, the closing. Time becomes a space you inhabit, not a chaos you survive.' },
    { h: 'Agency Over Time', b: 'You did not choose the Gregorian calendar. It was given to you. HEKA is a choice. To use a tool designed for clarity. To claim agency over the structure of your days. This is your calendar.' },
  ],
};

const gatesByChapter: Record<string, GateData[]> = {
  ch1: [
    { t: 'Is this a religion or movement?', tag: 'CLARITY', b: 'Neither. HEKA is a tool. Like a better hammer or a clearer map. No membership required. No beliefs to adopt. Just a calendar that works better than the one you inherited.' },
    { t: 'Why thirteen months?', tag: 'LOGIC', b: 'Twelve months of irregular length force mental gymnastics. Thirteen months of four weeks each creates perfect regularity. 13 × 28 = 364. Plus one special day. The math is clean. The experience is cleaner.' },
    { t: 'Will this confuse other people?', tag: 'REALITY', b: 'You see HEKA dates. They see civil dates. When you say "March 15th," you mean the same day they do. The civil overlay ensures you never lose coordination. You gain clarity. They lose nothing.' },
  ],
  ch2: [
    { t: 'Why does the year start in April?', tag: 'SYMBOL', b: 'Spring is the universal opening. Growth begins. Energy rises. Beginning the year in April aligns the calendar with the felt experience of renewal. January starts in winter exhaustion. April starts in spring possibility.' },
    { t: 'What are the month names?', tag: 'ORDER', b: 'April, May, June, July, August, Hexa, September, October, November, December, January, February, March. Hexa—the sixth month—fills the gap. The rest you already know. Only their positions change.' },
    { t: 'How is correction handled?', tag: 'PRECISION', b: 'Every solar calendar needs correction. HEKA places it all in March, at the year\'s end. March has 29 days, or 30 in leap years. The other twelve months are perfectly, permanently regular. Correction is contained, not scattered.' },
  ],
  ch3: [
    { t: 'Can I print HEKA calendars?', tag: 'PHYSICAL', b: 'Yes. Print month views or full year views. Clean, uncluttered, designed for paper. Pin them to walls. Carry them in notebooks. The digital convenience and the physical artifact, both.' },
    { t: 'What about holidays?', tag: 'CUSTOM', b: 'Toggle holiday sets for your region. Or ignore them. HEKA does not impose its own holidays—it helps you track the ones that matter to you, overlaid on a clearer structure.' },
    { t: 'Where does my data live?', tag: 'TRUST', b: 'By default, everything stays on your device — notes, journal, settings. If you create an account, your data backs up to encrypted cloud storage. You can export everything at any time. You stay in control.' },
    { t: 'What can the journal do?', tag: 'CAPABILITY', b: 'Daily entries with automatic revision history. Attach photos up to 5 MB. Full-text search across your entire archive. All local by default; syncs to the cloud when you sign in.' },
  ],
  ch4: [
    { t: 'Which mode is "correct"?', tag: 'CHOICE', b: 'Both. SYNC is correct for coordination with the civil world. TRUE is correct for astronomical precision. Your needs determine which correctness matters more to you right now.' },
    { t: 'Does TRUE mode drift from civil dates?', tag: 'DIVERGENCE', b: 'Slowly, yes. TRUE mode follows its own leap rule, not Gregorian\'s. Over centuries, the drift becomes noticeable. For daily life, the difference is imperceptible. For long-term thinking, the purity matters.' },
    { t: 'Can institutions adopt HEKA?', tag: 'SCALE', b: 'Eventually, perhaps. But institutions do not need to change for you to benefit. HEKA works perfectly as a personal overlay. Start there. Let the tool prove itself.' },
  ],
  ch5: [
    { t: 'Why do months have different lengths?', tag: 'HISTORY', b: 'Roman politics. Julius Caesar and Augustus needed months named after them. The calendar was adjusted to accommodate egos. These irregularities fossilized into "tradition." Tradition is not always wisdom.' },
    { t: 'Was the Gregorian reform enough?', tag: 'ASSESSMENT', b: 'It fixed the drift. It did not fix the structure. The months remained irregular, the quarters uneven, the year without narrative shape. A necessary patch, but not a fundamental redesign.' },
    { t: 'Have others tried calendar reform?', tag: 'ATTEMPTS', b: 'Many. The French Republican calendar. The World Calendar. The International Fixed Calendar. Some brilliant, all failed politically. HEKA learns from them: compatibility with civil time is essential. Revolution through evolution.' },
  ],
  ch6: [
    { t: 'How do I explain this to others?', tag: 'CONVERSATION', b: 'You do not need to. Use it. If asked, say: "I found a calendar that helps me plan better." Show them. Let them see the clarity. Persuasion happens through demonstration, not declaration.' },
    { t: 'What if I want to stop using it?', tag: 'FREEDOM', b: 'Stop. Your civil dates remain. Your appointments stay where they are. No lock-in. No sunk cost. HEKA must earn its place in your life every day, or it does not deserve to stay.' },
    { t: 'Where do I begin right now?', tag: 'ACTION', b: 'Open the settings. Enable civil overlay. Look at today in both systems. That is the first step. You have already taken it by opening this guide.' },
    { t: 'What is the Oracle?', tag: 'INTELLIGENCE', b: 'A celestial intelligence that reads planetary positions for any date you select and offers guidance. Optional. Add your birth chart for personalized transits and deeper insight.' },
  ],
  ch7: [
    { t: 'Does the calendar really affect mindset?', tag: 'PSYCHOLOGY', b: 'Profoundly. We think in the structures we inhabit. Irregular months create low-level cognitive friction. Regular months create cognitive flow. You may not notice the friction until it is gone. Then you cannot unnotice.' },
    { t: 'What about cultural attachments?', tag: 'RESPECT', b: 'Keep them. Your birthday. Your new year celebrations. Your seasonal festivals. HEKA does not erase culture—it provides a clearer vessel for it. The content remains. The container improves.' },
    { t: 'Why does this matter enough to build?', tag: 'MISSION', b: 'Because time is the substrate of life. Because we deserve tools designed for minds, not inherited from accidents. Because someone should try to build something better. We did. You are here.' },
  ],
};

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

const SPOTLIGHT_COUNT = 5;

const FeatureSpotlight: React.FC<{
  t: (key: string, options?: Record<string, unknown>) => string;
}> = ({ t }) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % SPOTLIGHT_COUNT);
        setIsVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="info-spotlight">
      <span className="info-spotlight__label">{t('infoModal.spotlight.title')}</span>
      <p className={`info-spotlight__text ${isVisible ? 'is-visible' : ''}`}>
        {t(`infoModal.spotlight.facts.${index}`)}
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
        <h1 className="info-home__title">{t('infoModal.hero.title')}</h1>
        <p className="info-home__subtitle">
          {t('infoModal.hero.subtitleLine1')} {t('infoModal.hero.subtitleLine2')}
        </p>
        {isComplete && (
          <span className="info-home__complete-badge">✦ {t('infoModal.guideComplete') || 'Guide Complete'}</span>
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
          {t('privacy')}
        </a>
        <a href="terms-of-service.html" target="_blank" rel="noopener noreferrer">
          {t('terms')}
        </a>
        <span>{t('version')} 2.2.0</span>
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
  const cards = cardsByChapter[chapterId] || [];
  const gates = gatesByChapter[chapterId] || [];
  const icons = cardIcons[chapterId] || ['◆', '◆', '◆'];
  const color = chapterColors[chapterId];

  return (
    <div className="info-chapter">
      <button className="info-chapter__back" onClick={onBack}>
        <span className="info-chapter__back-arrow">←</span>
        <span>{t('infoModal.backToHome')}</span>
      </button>

      <p className="info-chapter__lead" style={{ borderLeftColor: color }}>
        {t(`infoModal.chapterLeads.${chapterId}`)}
      </p>

      <div className="info-chapter__cards">
        {cards.map((_card, i) => {
          const key = `${chapterId}-card-${i}`;
          const isExpanded = expandedCards.has(key);
          return (
            <div
              key={i}
              className={`info-card ${isExpanded ? 'is-expanded' : ''}`}
              style={{ '--card-color': color } as React.CSSProperties}
            >
              <div className="info-card__header">
                <span className="info-card__icon">{icons[i]}</span>
                <h4 className="info-card__title">{t(`infoModal.cardsByChapter.${chapterId}.${i}.h`)}</h4>
              </div>
              {isExpanded ? (
                <>
                  <p className="info-card__body">{t(`infoModal.cardsByChapter.${chapterId}.${i}.b`)}</p>
                  <button className="info-card__toggle" onClick={() => toggleCard(key)}>
                    {t('showLess')}
                  </button>
                </>
              ) : (
                <button className="info-card__toggle" onClick={() => toggleCard(key)}>
                  {t('expand')}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="info-chapter__gates">
        <h4 className="info-chapter__gates-title">{t('infoModal.deeperQuestions')}</h4>
        {gates.map((_gate, i) => {
          const key = `${chapterId}-gate-${i}`;
          const isOpen = openGates.has(key);
          return (
            <div
              key={i}
              className={`info-gate ${isOpen ? 'is-open' : ''}`}
              style={{ '--gate-color': color } as React.CSSProperties}
            >
              <button className="info-gate__btn" onClick={() => toggleGate(key)}>
                <span className="info-gate__tag">{t(`infoModal.gatesByChapter.${chapterId}.${i}.tag`)}</span>
                <span className="info-gate__title">{t(`infoModal.gatesByChapter.${chapterId}.${i}.t`)}</span>
                <span className="info-gate__chevron">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div className="info-gate__content">
                <p>{t(`infoModal.gatesByChapter.${chapterId}.${i}.b`)}</p>
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
  const { t } = useTranslation('common');

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
      num: t(`infoModal.chapters.${id}.num`),
      chip: t(`infoModal.chapters.${id}.chip`),
      title: t(`infoModal.chapters.${id}.title`),
      hook: t(`infoModal.chapters.${id}.hook`),
      teaser: t(`infoModal.chapters.${id}.teaser`),
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
            <button className="info-modal__close" onClick={onClose} aria-label={t('close')}>×</button>
          </div>
        )}
        {isHome && (
          <div className="info-modal__header info-modal__header--home">
            <div className="info-modal__title-group">
              <h2 className="info-modal__title">{t('infoModal.hero.title')}</h2>
            </div>
            <button className="info-modal__close" onClick={onClose} aria-label={t('close')}>×</button>
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
            {t('infoModal.home')}
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
