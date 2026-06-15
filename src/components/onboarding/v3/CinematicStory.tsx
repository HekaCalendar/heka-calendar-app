/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CINEMATIC STORY — Mystery teasers that make users want to explore.
 * Same visual language as CinematicWelcome: StarfieldCanvas, gold ornaments,
 * Cinzel Decorative titles, Cormorant Garamond body. No explanations. Only longing.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StarfieldCanvas } from './StarfieldCanvas';
import { CelestialScribe } from './CelestialScribe';
import { LivingJournal } from './LivingJournal';
import { SwissEphemerisVisual } from './SwissEphemerisVisual';
import { SacredGeometryShowcase } from './SacredGeometryShowcase';
import { CelestialCardsShowcase } from './CelestialCardsShowcase';
import { ThemeShowcase } from './ThemeShowcase';
import { CircleShowcase } from './CircleShowcase';
import { CommunityShowcase } from './CommunityShowcase';
import { PureModeShowcase } from './PureModeShowcase';
import { markTutorialV3Completed } from './tutorialStorage';
import { ShowcaseScaler } from './ShowcaseScaler';

interface CinematicStoryProps {
  strings: {
    tutorialTeaser1Title: string;
    tutorialTeaser1Subtitle: string;
    tutorialTeaser1Body: string;
    tutorialTeaser2Title: string;
    tutorialTeaser2Subtitle: string;
    tutorialTeaser2Body: string;
    tutorialPrecisionTitle: string;
    tutorialPrecisionSubtitle: string;
    tutorialPrecisionBody: string;
    tutorialTempleTitle: string;
    tutorialTempleSubtitle: string;
    tutorialTempleBody: string;
    tutorialCelestialTitle: string;
    tutorialCelestialSubtitle: string;
    tutorialCelestialBody: string;
    tutorialVeilTitle: string;
    tutorialVeilSubtitle: string;
    tutorialVeilBody: string;
    tutorialCircleTitle: string;
    tutorialCircleSubtitle: string;
    tutorialCircleBody: string;
    tutorialAssemblyTitle: string;
    tutorialAssemblySubtitle: string;
    tutorialAssemblyBody: string;
    tutorialSilenceTitle: string;
    tutorialSilenceSubtitle: string;
    tutorialSilenceBody: string;
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
    alignItems: 'safe center', justifyContent: 'safe center',
    padding: 'calc(28px + env(safe-area-inset-top)) calc(28px + env(safe-area-inset-right)) calc(28px + env(safe-area-inset-bottom)) calc(28px + env(safe-area-inset-left))',
    opacity: phase === 'exiting' ? 0 : 1,
    transform: phase === 'entering' ? 'translateY(30px) scale(0.96)' : phase === 'exiting' ? 'translateY(-20px) scale(0.98)' : 'translateY(0) scale(1)',
    transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
    pointerEvents: phase === 'idle' ? 'auto' : 'none',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
    touchAction: 'pan-y',
  }}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALS: CelestialScribe and LivingJournal imported from dedicated components
// ═══════════════════════════════════════════════════════════════════════════════

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
          <ShowcaseScaler designWidth={520} designHeight={220}>
            <CelestialScribe />
          </ShowcaseScaler>
        </SlideContainer>
      ),
    },
    // SLIDE 3: THE PRECISION
    {
      id: 'precision',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>{strings.tutorialPrecisionTitle}</Title>
          <Subtitle>{strings.tutorialPrecisionSubtitle}</Subtitle>
          <Body>
            {strings.tutorialPrecisionBody.split('. ').slice(0, 3).join('. ')}.
          </Body>
          <Body>
            {strings.tutorialPrecisionBody.split('. ').slice(3).join('. ')}.
          </Body>
          <ShowcaseScaler designWidth={520} designHeight={290}>
            <SwissEphemerisVisual />
          </ShowcaseScaler>
        </SlideContainer>
      ),
    },
    // SLIDE 4: YOUR MARKS BECOME MAPS
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
          <ShowcaseScaler designHeight={360}>
            <LivingJournal />
          </ShowcaseScaler>
        </SlideContainer>
      ),
    },
    // SLIDE 5: SHAPE YOUR TEMPLE
    {
      id: 'temple',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>{strings.tutorialTempleTitle}</Title>
          <Subtitle>{strings.tutorialTempleSubtitle}</Subtitle>
          <Body>
            {strings.tutorialTempleBody.split('. ').slice(0, 3).join('. ')}.
          </Body>
          <Body>
            {strings.tutorialTempleBody.split('. ').slice(3).join('. ')}.
          </Body>
          <ShowcaseScaler designHeight={340}>
            <SacredGeometryShowcase />
          </ShowcaseScaler>
        </SlideContainer>
      ),
    },
    // SLIDE 6: THE CELESTIAL COMMAND
    {
      id: 'celestial',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>{strings.tutorialCelestialTitle}</Title>
          <Subtitle>{strings.tutorialCelestialSubtitle}</Subtitle>
          <Body>
            {strings.tutorialCelestialBody.split('. ').slice(0, 3).join('. ')}.
          </Body>
          <Body>
            {strings.tutorialCelestialBody.split('. ').slice(3).join('. ')}.
          </Body>
          <ShowcaseScaler designHeight={300}>
            <CelestialCardsShowcase />
          </ShowcaseScaler>
        </SlideContainer>
      ),
    },
    // SLIDE 7: THE VEIL OF FORMS
    {
      id: 'veil',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>{strings.tutorialVeilTitle}</Title>
          <Subtitle>{strings.tutorialVeilSubtitle}</Subtitle>
          <Body>
            {strings.tutorialVeilBody.split('. ').slice(0, 3).join('. ')}.
          </Body>
          <Body>
            {strings.tutorialVeilBody.split('. ').slice(3).join('. ')}.
          </Body>
          <ShowcaseScaler designHeight={350}>
            <ThemeShowcase />
          </ShowcaseScaler>
        </SlideContainer>
      ),
    },
    // SLIDE 8: THE CIRCLE
    {
      id: 'circle',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>{strings.tutorialCircleTitle}</Title>
          <Subtitle>{strings.tutorialCircleSubtitle}</Subtitle>
          <Body>
            {strings.tutorialCircleBody.split('. ').slice(0, 3).join('. ')}.
          </Body>
          <Body>
            {strings.tutorialCircleBody.split('. ').slice(3).join('. ')}.
          </Body>
          <ShowcaseScaler designHeight={350}>
            <CircleShowcase />
          </ShowcaseScaler>
        </SlideContainer>
      ),
    },
    // SLIDE 9: THE ASSEMBLY
    {
      id: 'assembly',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>{strings.tutorialAssemblyTitle}</Title>
          <Subtitle>{strings.tutorialAssemblySubtitle}</Subtitle>
          <Body>
            {strings.tutorialAssemblyBody.split('. ').slice(0, 3).join('. ')}.
          </Body>
          <Body>
            {strings.tutorialAssemblyBody.split('. ').slice(3).join('. ')}.
          </Body>
          <ShowcaseScaler designHeight={350}>
            <CommunityShowcase />
          </ShowcaseScaler>
        </SlideContainer>
      ),
    },
    // SLIDE 10: THE SILENCE
    {
      id: 'silence',
      render: (phase) => (
        <SlideContainer phase={phase}>
          <Ornament />
          <Title>{strings.tutorialSilenceTitle}</Title>
          <Subtitle>{strings.tutorialSilenceSubtitle}</Subtitle>
          <Body>
            {strings.tutorialSilenceBody.split('. ').slice(0, 3).join('. ')}.
          </Body>
          <Body>
            {strings.tutorialSilenceBody.split('. ').slice(3).join('. ')}.
          </Body>
          <ShowcaseScaler designHeight={350}>
            <PureModeShowcase />
          </ShowcaseScaler>
        </SlideContainer>
      ),
    },
    // SLIDE 11: ENTER
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
  const { t } = useTranslation('wizard');

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

  // Mark the v3 tutorial as completed once the user reaches the final slide.
  // This protects against losing the completion flag if the tab is closed
  // before the explicit "Enter HEKA" click.
  useEffect(() => {
    if (isLastSlide && phase === 'idle') {
      markTutorialV3Completed();
    }
  }, [isLastSlide, phase]);

  return (
    <div onClick={() => phase === 'idle' && !isLastSlide && goNext()} style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <StarfieldCanvas />
      {currentSlide.render(phase)}

      {/* Progress dots */}
      <div className="tt-story-dots" style={{
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
        <div className="tt-story-hint" style={{
          position: 'fixed', bottom: 56, left: 0, right: 0, zIndex: 10002,
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <span style={{
            fontSize: 12, color: 'rgba(255, 255, 255, 0.25)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: "'Cinzel', Georgia, serif",
          }}>{t('tutorialContinueHint')}</span>
        </div>
      )}

      {/* CTA button on last slide */}
      {isLastSlide && (
        <div className="tt-story-cta" style={{
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
        className="tt-story-skip"
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

      {/* Responsive overrides for short/narrow viewports (foldables, small phones) */}
      <style>{`
        @media (max-height: 760px) {
          .tt-story-dots { bottom: 18px !important; }
          .tt-story-hint { bottom: 38px !important; }
          .tt-story-cta { bottom: 58px !important; }
          .tt-story-skip { top: 12px !important; right: 12px !important; }
        }
        @media (max-height: 640px) {
          .tt-story-dots { bottom: 10px !important; }
          .tt-story-hint { bottom: 28px !important; }
          .tt-story-cta { bottom: 46px !important; }
          .tt-story-skip { top: 8px !important; right: 8px !important; font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
};

export default CinematicStory;
