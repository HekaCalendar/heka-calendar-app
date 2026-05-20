/**
 * Info Modal Component — Visual Storybook Edition
 * An immersive chapter-based guide to the HEKA Calendar
 * with cinematic animations, keyboard navigation, and progress tracking.
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
}

interface Card {
  h: string;
  b: string;
}

interface Gate {
  t: string;
  tag: string;
  b: string;
}

const chapterOrder: ChapterId[] = ['home', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7'];

const cardsByChapter: Record<string, Card[]> = {
  ch1: [
    { h: 'The Problem You Feel', b: 'Irregular months. Scattered holidays. A year that stumbles from January to December with no sense of opening, middle, or close. You have felt this friction. HEKA removes it.' },
    { h: 'The Solution We Built', b: 'Thirteen months. Twelve hold twenty-eight days in perfect symmetry. March, the closing month, carries the leap day. Four perfect weeks per month. A year that flows: April opens, May through December form the stable core, January through March bring it to completion.' },
    { h: 'The World You Keep', b: 'HEKA does not disrupt your life. Civil dates remain visible. Your meetings, appointments, and legal obligations stay exactly where they are. You simply gain a clearer lens.' },
  ],
  ch2: [
    { h: 'The Opening Arc', b: 'April is the threshold. The year begins not in winter exhaustion but in spring vitality. New growth. New projects. The opening announces: something is beginning.' },
    { h: 'The Core Arc', b: 'May through December is the long stable middle. Nine months of perfectly regular, predictable rhythm. Plan with confidence. Build momentum. This is where the work happens.' },
    { h: 'The Closing Arc', b: 'January through March brings the year to resolution. Finish what you started. Harvest what you grew. The closing creates space for reflection and prepares you for the next opening.' },
  ],
  ch3: [
    { h: 'Your Civil Dates Stay', b: 'Toggle the civil overlay and see Gregorian dates alongside HEKA. Your dentist appointment, your mother\'s birthday, your tax deadline—all remain exactly where you expect them.' },
    { h: 'Your Notes Remain', b: 'Save thoughts by day or by month. Print clean month views or full year overviews. The calendar becomes a journal, a planner, a record of your days.' },
    { h: 'Your Moon If You Want It', b: 'Lunar phases appear at a glance. Not superimposed mysticism—just information. Another rhythm you can choose to notice or ignore. The choice is yours.' },
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

const gatesByChapter: Record<string, Gate[]> = {
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
    { t: 'Are my notes private?', tag: 'TRUST', b: 'Everything stores locally on your device. Your thoughts remain yours. Export them if you wish. Import them elsewhere. You control your data completely.' },
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
  ],
  ch7: [
    { t: 'Does the calendar really affect mindset?', tag: 'PSYCHOLOGY', b: 'Profoundly. We think in the structures we inhabit. Irregular months create low-level cognitive friction. Regular months create cognitive flow. You may not notice the friction until it is gone. Then you cannot unnotice.' },
    { t: 'What about cultural attachments?', tag: 'RESPECT', b: 'Keep them. Your birthday. Your new year celebrations. Your seasonal festivals. HEKA does not erase culture—it provides a clearer vessel for it. The content remains. The container improves.' },
    { t: 'Why does this matter enough to build?', tag: 'MISSION', b: 'Because time is the substrate of life. Because we deserve tools designed for minds, not inherited from accidents. Because someone should try to build something better. We did. You are here.' },
  ],
};



const InfoModalComponent: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');
  const chapters = useMemo(() =>
    chapterOrder.map(id => ({
      id,
      num: t(`infoModal.chapters.${id}.num`),
      chip: t(`infoModal.chapters.${id}.chip`),
      title: t(`infoModal.chapters.${id}.title`),
      hook: t(`infoModal.chapters.${id}.hook`),
    })), [t]);

  const [currentChapter, setCurrentChapter] = useState<ChapterId>('home');
  const [visitedChapters, setVisitedChapters] = useState<Set<ChapterId>>(new Set(['home']));
  const [openGates, setOpenGates] = useState<Set<string>>(new Set());
  const [transitionKey, setTransitionKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleChapterClick = useCallback((id: ChapterId) => {
    setTransitionKey(k => k + 1);
    setCurrentChapter(id);
    setOpenGates(new Set());
    setVisitedChapters(prev => new Set(prev).add(id));
    // Scroll content to top
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

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
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goNext, goPrev, onClose]);

  if (!isOpen) return null;

  const currentChapterData = chapters.find(c => c.id === currentChapter);
  const isHome = currentChapter === 'home';
  const chapterIndex = chapterOrder.indexOf(currentChapter);

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal" onClick={e => e.stopPropagation()}>
        {/* Progress Path */}
        <div className="info-modal__progress">
          {chapterOrder.map((id, i) => (
            <React.Fragment key={id}>
              <button
                className="info-modal__progress-dot"
                data-active={id === currentChapter}
                data-visited={visitedChapters.has(id) && id !== currentChapter}
                onClick={() => handleChapterClick(id)}
                title={chapters.find(c => c.id === id) ? t(`infoModal.chapters.${id}.title`) : ''}
                aria-label={t('infoModal.goTo', { title: chapters.find(c => c.id === id)?.title || '' })}
              />
              {i < chapterOrder.length - 1 && (
                <div 
                  className="info-modal__progress-line" 
                  data-active={i < chapterIndex}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Header */}
        <div className="info-modal__header">
          <div className="info-modal__title-group">
            <span className="info-modal__chip">{currentChapterData?.chip}</span>
            <h2 className="info-modal__title">{currentChapterData ? t(`infoModal.chapters.${currentChapterData.id}.title`) : ''}</h2>
            <p className="info-modal__hook">{currentChapterData ? t(`infoModal.chapters.${currentChapterData.id}.hook`) : ''}</p>
          </div>
          <button className="info-modal__close" onClick={onClose} aria-label={t('close')}>×</button>
        </div>

        {/* Content */}
        <div className="info-modal__content" ref={contentRef} key={transitionKey}>
          {isHome ? (
            <HomeView onChapterClick={handleChapterClick} t={t} chapters={chapters} />
          ) : (
            <ChapterView
              chapterId={currentChapter}
              onBack={() => handleChapterClick('home')}
              openGates={openGates}
              toggleGate={toggleGate}
              t={t}
            />
          )}
        </div>

        {/* Navigation */}
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
              title={t(`infoModal.chapters.${ch.id}.title`)}
            >
              {ch.num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeView: React.FC<{ onChapterClick: (id: ChapterId) => void; t: (key: string, options?: Record<string, unknown>) => string; chapters: Chapter[] }> = ({ onChapterClick, t, chapters }) => (
  <div className="info-home">
    <div className="info-home__hero">
      <h1 className="info-home__title">{t('infoModal.hero.title')}</h1>
      <p className="info-home__subtitle">{t('infoModal.hero.subtitleLine1')} {t('infoModal.hero.subtitleLine2')}</p>
    </div>

    {/* Chapters — primary navigation, placed first */}
    <div className="info-home__chapters">
      <div className="info-home__chapter-list">
        {chapters.slice(1).map(ch => (
          <button
            key={ch.id}
            className="info-home__chapter-btn"
            onClick={() => onChapterClick(ch.id)}
          >
            <span className="info-home__chapter-num">{ch.num}</span>
            <span className="info-home__chapter-title">{t(`infoModal.chapters.${ch.id}.title`)}</span>
            <span className="info-home__chapter-arrow">→</span>
          </button>
        ))}
      </div>
    </div>

    {/* Summary cards — secondary, visually subdued */}
    <div className="info-home__grid">
      <div className="info-home__card info-home__card--changes">
        <h3>{t('infoModal.cards.whatChanges.title')}</h3>
        <ul>
          <li>{t('infoModal.cards.whatChanges.items.0')}</li>
          <li>{t('infoModal.cards.whatChanges.items.1')}</li>
          <li>{t('infoModal.cards.whatChanges.items.2')}</li>
          <li>{t('infoModal.cards.whatChanges.items.3')}</li>
          <li>{t('infoModal.cards.whatChanges.items.4')}</li>
        </ul>
      </div>

      <div className="info-home__card info-home__card--keeps">
        <h3>{t('infoModal.cards.whatStays.title')}</h3>
        <ul>
          <li>{t('infoModal.cards.whatStays.items.0')}</li>
          <li>{t('infoModal.cards.whatStays.items.1')}</li>
          <li>{t('infoModal.cards.whatStays.items.2')}</li>
          <li>{t('infoModal.cards.whatStays.items.3')}</li>
          <li>{t('infoModal.cards.whatStays.items.4')}</li>
        </ul>
      </div>

      <div className="info-home__card info-home__card--use">
        <h3>{t('infoModal.cards.beginHere.title')}</h3>
        <ul>
          <li>{t('infoModal.cards.beginHere.items.0')}</li>
          <li>{t('infoModal.cards.beginHere.items.1')}</li>
          <li>{t('infoModal.cards.beginHere.items.2')}</li>
          <li>{t('infoModal.cards.beginHere.items.3')}</li>
          <li>{t('infoModal.cards.beginHere.items.4')}</li>
        </ul>
      </div>
    </div>

    {/* Legal Links */}
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

const ChapterView: React.FC<{
  chapterId: string;
  onBack: () => void;
  openGates: Set<string>;
  toggleGate: (key: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}> = ({ chapterId, onBack, openGates, toggleGate, t }) => {
  const cards = cardsByChapter[chapterId] || [];
  const gates = gatesByChapter[chapterId] || [];

  return (
    <div className="info-chapter">
      <button className="info-chapter__back" onClick={onBack}>← {t('infoModal.backToHome')}</button>
      
      <p className="info-chapter__lead">{t(`infoModal.chapterLeads.${chapterId}`)}</p>

      <div className="info-chapter__cards">
        {cards.map((_card, i) => (
          <div key={i} className="info-card">
            <h4 className="info-card__title">{t(`infoModal.cardsByChapter.${chapterId}.${i}.h`)}</h4>
            <p className="info-card__body">{t(`infoModal.cardsByChapter.${chapterId}.${i}.b`)}</p>
          </div>
        ))}
      </div>

      <div className="info-chapter__gates">
        <h4 className="info-chapter__gates-title">{t('infoModal.deeperQuestions')}</h4>
        {gates.map((_gate, i) => {
          const key = `${chapterId}-gate-${i}`;
          const isOpen = openGates.has(key);
          return (
            <div key={i} className={`info-gate ${isOpen ? 'is-open' : ''}`}>
              <button 
                className="info-gate__btn"
                onClick={() => toggleGate(key)}
              >
                <span className="info-gate__tag">{t(`infoModal.gatesByChapter.${chapterId}.${i}.tag`)}</span>
                <span className="info-gate__title">{t(`infoModal.gatesByChapter.${chapterId}.${i}.t`)}</span>
                <span className="info-gate__chevron">▼</span>
              </button>
              {isOpen && (
                <div className="info-gate__content">
                  <p>{t(`infoModal.gatesByChapter.${chapterId}.${i}.b`)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const InfoModal = memo(InfoModalComponent);
InfoModal.displayName = 'InfoModal';
export default InfoModal;
