/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CINEMATIC STORY — Mystery teasers that make users want to explore.
 * Same visual language as CinematicWelcome: StarfieldCanvas, gold ornaments,
 * Cinzel Decorative titles, Cormorant Garamond body. No explanations. Only longing.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StarfieldCanvas } from './StarfieldCanvas';

interface CinematicStoryProps {
  strings: {
    tutorialTeaser1Title: string;
    tutorialTeaser1Subtitle: string;
    tutorialTeaser1Body: string;
    tutorialTeaser2Title: string;
    tutorialTeaser2Subtitle: string;
    tutorialTeaser2Body: string;
    tutorialEnterSubtitle: string;
    tutorialEnterBody: string;
    tutorialEnterButton: string;
    tutorialSkip: string;
  };
  onComplete: () => void;
}

type Phase = 'entering' | 'idle' | 'exiting';

const Ornament: React.FC = () => (
  <div style={{
    width: 100, height: 1,
    background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
    margin: '0 auto 28px',
  }} />
);

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1 style={{
    fontFamily: "'Cinzel Decorative', 'Cinzel', 'Playfair Display', Georgia, serif",
    fontSize: 'clamp(30px, 5.5vw, 58px)',
    fontWeight: 400,
    color: '#f5f3ff',
    letterSpacing: '0.12em',
    margin: '0 0 16px 0',
    textAlign: 'center',
    lineHeight: 1.15,
    textShadow: '0 0 60px rgba(201, 162, 39, 0.2)',
  }}>{children}</h1>
);

const Subtitle: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <p style={{
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(14px, 2vw, 18px)',
    color: '#a89bc8',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    margin: '0 0 36px 0',
    textAlign: 'center',
    ...style,
  }}>{children}</p>
);

const Body: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <p style={{
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(17px, 2.2vw, 22px)',
    color: 'rgba(255, 255, 255, 0.72)',
    lineHeight: 1.7,
    maxWidth: 720,
    margin: '0 auto 20px',
    textAlign: 'center',
    ...style,
  }}>{children}</p>
);

const SlideContainer: React.FC<{ phase: Phase; children: React.ReactNode }> = ({ phase, children }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 10001,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '28px',
    opacity: phase === 'exiting' ? 0 : 1,
    transform: phase === 'entering' ? 'translateY(30px) scale(0.96)' : phase === 'exiting' ? 'translateY(-20px) scale(0.98)' : 'translateY(0) scale(1)',
    transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
    pointerEvents: phase === 'idle' ? 'auto' : 'none',
  }}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALS: Drifting celestial symbols for the "Sky Writes Back" slide
// ═══════════════════════════════════════════════════════════════════════════════

const DriftingSymbols: React.FC = () => {
  const symbols = ['🌙', '☀️', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 600, height: 100, marginTop: 32, overflow: 'hidden' }}>
      {symbols.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${(i / symbols.length) * 100}%`,
            top: `${30 + Math.sin(i * 1.7) * 25}%`,
            fontSize: `${18 + Math.sin(i) * 8}px`,
            opacity: 0.15 + Math.sin(i * 2.3) * 0.1,
            color: i % 3 === 0 ? '#c9a227' : i % 3 === 1 ? '#a89bc8' : '#81b29a',
            animation: `driftFloat ${8 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            filter: 'blur(0.5px)',
          }}
        >
          {s}
        </div>
      ))}
      <style>{`
        @keyframes driftFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(6deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes driftFloat {
            0%, 100% { transform: none; }
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALS: Fading text fragments for the "Marks Become Maps" slide
// ═══════════════════════════════════════════════════════════════════════════════

const FadingFragments: React.FC = () => {
  const fragments = [
    { text: 'Tuesday', x: 15, y: 20, delay: 0 },
    { text: 'a note', x: 65, y: 15, delay: 1.2 },
    { text: 'waxing', x: 30, y: 55, delay: 2.4 },
    { text: 'mood = 7', x: 70, y: 50, delay: 0.8 },
    { text: 'pattern', x: 45, y: 80, delay: 3.2 },
    { text: 'insight', x: 10, y: 70, delay: 1.8 },
    { text: 'Friday', x: 80, y: 75, delay: 2.0 },
    { text: '...', x: 50, y: 35, delay: 0.4 },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520, height: 120, marginTop: 32, overflow: 'hidden' }}>
      {fragments.map((f, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${f.x}%`,
            top: `${f.y}%`,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: `${13 + Math.sin(i * 3) * 3}px`,
            fontStyle: 'italic',
            color: i % 2 === 0 ? 'rgba(201, 162, 39, 0.35)' : 'rgba(129, 178, 154, 0.3)',
            animation: `fragmentFade ${6 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
            whiteSpace: 'nowrap',
          }}
        >
          {f.text}
        </div>
      ))}
      <style>{`
        @keyframes fragmentFade {
          0%, 100% { opacity: 0; transform: translateY(6px); }
          40%, 60% { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes fragmentFade {
            0%, 100% { opacity: 0.6; transform: none; }
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface SlideDef {
  id: string;
  render: (phase: Phase) => React.ReactNode;
}

function buildSlides(strings: CinematicStoryProps['strings']): SlideDef[] {
  return [
    // SLIDE 2: THE SKY WRITES BACK
    {
      id: 'sky',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>{strings.tutorialTeaser1Title}</Title>
          <Subtitle>{strings.tutorialTeaser1Subtitle}</Subtitle>
          <Body>
            {strings.tutorialTeaser1Body.split('. ').slice(0, 3).join('. ')}.
          </Body>
          <Body>
            {strings.tutorialTeaser1Body.split('. ').slice(3).join('. ')}.
          </Body>
          <DriftingSymbols />
        </SlideContainer>
      ),
    },
    // SLIDE 3: YOUR MARKS BECOME MAPS
    {
      id: 'maps',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>{strings.tutorialTeaser2Title}</Title>
          <Subtitle>{strings.tutorialTeaser2Subtitle}</Subtitle>
          <Body>
            {strings.tutorialTeaser2Body.split('. ').slice(0, 3).join('. ')}.
          </Body>
          <Body>
            {strings.tutorialTeaser2Body.split('. ').slice(3).join('. ')}.
          </Body>
          <FadingFragments />
        </SlideContainer>
      ),
    },
    // SLIDE 4: ENTER
    {
      id: 'enter',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>HEKA</Title>
          <Subtitle style={{ color: '#c9a227' }}>{strings.tutorialEnterSubtitle}</Subtitle>
          <Body>{strings.tutorialEnterBody}</Body>
        </SlideContainer>
      ),
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CinematicStory: React.FC<CinematicStoryProps> = ({ strings, onComplete }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('entering');
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const SLIDES = React.useMemo(() => buildSlides(strings), [strings]);
  const totalSlides = SLIDES.length;

  useEffect(() => {
    const timer = setTimeout(() => setPhase('idle'), 600);
    return () => clearTimeout(timer);
  }, []);

  const goNext = useCallback(() => {
    if (slideIndex >= totalSlides - 1) {
      onComplete();
      return;
    }
    setPhase('exiting');
    setTimeout(() => {
      setSlideIndex(prev => prev + 1);
      setPhase('entering');
      setTimeout(() => setPhase('idle'), 600);
    }, 400);
  }, [slideIndex, totalSlides, onComplete]);

  const goBack = useCallback(() => {
    if (slideIndex <= 0) return;
    setPhase('exiting');
    setTimeout(() => {
      setSlideIndex(prev => prev - 1);
      setPhase('entering');
      setTimeout(() => setPhase('idle'), 600);
    }, 400);
  }, [slideIndex]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault(); goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); goBack();
      } else if (e.key === 'Escape') {
        onComplete();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [goNext, goBack, onComplete]);

  // Swipe
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      touchStartRef.current = null;
      if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 50) return;
      dx < 0 ? goNext() : goBack();
    };
    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchend', onEnd);
    };
  }, [goNext, goBack]);

  const currentSlide = SLIDES[slideIndex];
  const isLastSlide = slideIndex === totalSlides - 1;

  return (
    <div onClick={() => phase === 'idle' && !isLastSlide && goNext()} style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <StarfieldCanvas />
      {currentSlide.render(phase)}

      {/* Progress dots */}
      <div style={{
        position: 'fixed', bottom: 32, left: 0, right: 0, zIndex: 10002,
        display: 'flex', justifyContent: 'center', gap: 8,
        pointerEvents: 'none',
      }}>
        {Array.from({ length: totalSlides }, (_, i) => (
          <div key={i} style={{
            width: i === slideIndex ? 24 : 8, height: 8, borderRadius: 4,
            background: i === slideIndex ? '#c9a227' : i < slideIndex ? 'rgba(201, 162, 39, 0.4)' : 'rgba(255, 255, 255, 0.12)',
            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: i === slideIndex ? '0 0 12px rgba(201, 162, 39, 0.4)' : 'none',
          }} />
        ))}
      </div>

      {/* Continue hint */}
      {!isLastSlide && (
        <div style={{
          position: 'fixed', bottom: 56, left: 0, right: 0, zIndex: 10002,
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <span style={{
            fontSize: 12, color: 'rgba(255, 255, 255, 0.25)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: "'Cinzel', Georgia, serif",
          }}>Tap or press space to continue</span>
        </div>
      )}

      {/* CTA button on last slide */}
      {isLastSlide && (
        <div style={{
          position: 'fixed', bottom: 80, left: 0, right: 0, zIndex: 10002,
          display: 'flex', justifyContent: 'center',
        }}>
          <button
            onClick={onComplete}
            style={{
              padding: '18px 56px',
              borderRadius: 14,
              border: '1px solid rgba(212, 175, 55, 0.5)',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(180, 140, 30, 0.12))',
              color: '#f5f3ff',
              fontSize: 17,
              fontWeight: 700,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 12px 48px rgba(212, 175, 55, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(212, 175, 55, 0.2)';
            }}
          >
            {strings.tutorialEnterButton}
          </button>
        </div>
      )}

      {/* Skip button */}
      <button
        onClick={onComplete}
        style={{
          position: 'fixed', top: 20, right: 20, zIndex: 10003,
          background: 'transparent', border: 'none',
          color: 'rgba(255,255,255,0.25)', fontSize: 12,
          cursor: 'pointer', letterSpacing: '0.1em',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
      >
        {strings.tutorialSkip}
      </button>
    </div>
  );
};

export default CinematicStory;
