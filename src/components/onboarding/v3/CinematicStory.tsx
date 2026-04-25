/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CINEMATIC STORY — Steps 2-8 of the HEKA onboarding
 * Every slide follows the visual language of the Welcome step.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StarfieldCanvas } from './StarfieldCanvas';

interface CinematicStoryProps {
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

const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: '#c9a227', fontWeight: 600 }}>{children}</span>
);

const BigNumber: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div style={{ textAlign: 'center', margin: '0 16px' }}>
    <div style={{
      fontFamily: "'Cinzel Decorative', 'Cinzel', Georgia, serif",
      fontSize: 'clamp(44px, 7vw, 78px)',
      fontWeight: 400,
      color: '#c9a227',
      lineHeight: 1,
      textShadow: '0 0 40px rgba(201, 162, 39, 0.25)',
    }}>{value}</div>
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: 13,
      color: 'rgba(255,255,255,0.35)',
      marginTop: 8,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    }}>{label}</div>
  </div>
);

const GridPreview: React.FC = () => {
  const months = [
    { name: 'Apr', arc: 'opening' }, { name: 'May', arc: 'core' },
    { name: 'Jun', arc: 'core' }, { name: 'Jul', arc: 'core' },
    { name: 'Aug', arc: 'core' }, { name: 'Hex', arc: 'core' },
    { name: 'Sep', arc: 'core' }, { name: 'Oct', arc: 'core' },
    { name: 'Nov', arc: 'core' }, { name: 'Dec', arc: 'core' },
    { name: 'Jan', arc: 'closing' }, { name: 'Feb', arc: 'closing' },
    { name: 'Mar', arc: 'closing' },
  ];
  const styles: Record<string, React.CSSProperties> = {
    opening: { color: '#e07a5f', border: '1px solid rgba(224,122,95,0.3)', background: 'rgba(224,122,95,0.08)' },
    core: { color: '#81b29a', border: '1px solid rgba(129,178,154,0.3)', background: 'rgba(129,178,154,0.08)' },
    closing: { color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.08)' },
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 4, marginTop: 32, maxWidth: 520, width: '100%' }}>
      {months.map(m => (
        <div key={m.name} style={{
          aspectRatio: '1', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, ...styles[m.arc],
        }}>{m.name}</div>
      ))}
    </div>
  );
};

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
// VISUALIZATION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const JanuaryDisruptionVisual: React.FC = () => {
  const originalMonths = ['Mar','Apr','May','Jun','Quin','Sext','Sep','Oct','Nov','Dec'];
  const disruptedMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div style={{ width: '100%', maxWidth: 640, marginTop: 24 }}>
      {/* Original 10-month flow */}
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: 'rgba(201,162,39,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Original Roman Calendar — 10 Months
        </span>
      </div>
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginBottom: 12 }}>
        {originalMonths.map(m => (
          <div key={m} style={{
            flex: 1, minWidth: 0, padding: '8px 2px', borderRadius: 5,
            background: 'linear-gradient(180deg, rgba(201,162,39,0.12), rgba(180,140,30,0.06))',
            border: '1px solid rgba(201,162,39,0.2)',
            color: '#c9a227', fontSize: 9, fontWeight: 600, textAlign: 'center',
            letterSpacing: '0.02em',
          }}>{m}</div>
        ))}
      </div>

      {/* The disruption */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '12px 0' }}>
        <div style={{ height: 1, flex: 1, maxWidth: 120, background: 'linear-gradient(90deg, transparent, rgba(224,122,95,0.3))' }} />
        <div style={{
          padding: '4px 14px', borderRadius: 16,
          background: 'rgba(224,122,95,0.1)', border: '1px solid rgba(224,122,95,0.25)',
          color: '#e07a5f', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          Januarius & Februarius inserted
        </div>
        <div style={{ height: 1, flex: 1, maxWidth: 120, background: 'linear-gradient(90deg, rgba(224,122,95,0.3), transparent)' }} />
      </div>

      {/* Broken 12-month calendar */}
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: 'rgba(224,122,95,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          The Disrupted Calendar — 12 Months
        </span>
      </div>
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
        {disruptedMonths.map((m, i) => (
          <div key={m} style={{
            width: 44, padding: '7px 0', borderRadius: 5,
            background: i < 2
              ? 'linear-gradient(180deg, rgba(100,149,237,0.12), rgba(100,149,237,0.05))'
              : 'linear-gradient(180deg, rgba(201,162,39,0.06), rgba(180,140,30,0.03))',
            border: i < 2 ? '1px solid rgba(100,149,237,0.3)' : '1px solid rgba(201,162,39,0.12)',
            color: i < 2 ? '#6495ed' : '#c9a227', fontSize: 9, fontWeight: 600, textAlign: 'center',
          }}>{m}</div>
        ))}
      </div>

      {/* Annotation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(201,162,39,0.4)' }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Original flow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(100,149,237,0.4)' }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Inserted after</span>
        </div>
      </div>
    </div>
  );
};

const ZodiacArc: React.FC = () => {
  const signs = [
    { s: '♈', n: 'Aries', h: true },
    { s: '♉', n: 'Taurus' },
    { s: '♊', n: 'Gemini' },
    { s: '♋', n: 'Cancer' },
    { s: '♌', n: 'Leo' },
    { s: '♍', n: 'Virgo' },
    { s: '♎', n: 'Libra' },
    { s: '♏', n: 'Scorpio' },
    { s: '♐', n: 'Sagittarius' },
    { s: '♑', n: 'Capricorn' },
    { s: '♒', n: 'Aquarius' },
    { s: '♓', n: 'Pisces' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 600, marginTop: 24 }}>
      {/* Ecliptic arc with sun */}
      <div style={{ position: 'relative', height: 110, marginBottom: 4 }}>
        <svg viewBox="0 0 600 110" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <path d="M 40 95 Q 300 -15 560 95" fill="none" stroke="rgba(201,162,39,0.12)" strokeWidth="1" strokeDasharray="5 4" />
          <circle cx="300" cy="8" r="10" fill="rgba(201,162,39,0.15)" />
          <circle cx="300" cy="8" r="5" fill="#c9a227">
            <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
        {/* Aries at top */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,162,39,0.25), rgba(201,162,39,0.04))',
            border: '2px solid rgba(201,162,39,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 0 20px rgba(201,162,39,0.25)',
          }}>♈</div>
        </div>
        {/* Equinox label */}
        <div style={{ position: 'absolute', top: 52, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'rgba(201,162,39,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Spring Equinox</div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Sun crosses celestial equator</div>
        </div>
      </div>

      {/* Zodiac row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
        {signs.map(z => (
          <div key={z.n} style={{ textAlign: 'center', width: 42 }}>
            <div style={{
              fontSize: z.h ? 20 : 15,
              color: z.h ? '#c9a227' : 'rgba(255,255,255,0.25)',
              textShadow: z.h ? '0 0 10px rgba(201,162,39,0.35)' : 'none',
              lineHeight: 1.2,
            }}>{z.s}</div>
            <div style={{
              fontSize: 8,
              color: z.h ? 'rgba(201,162,39,0.7)' : 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>{z.n}</div>
          </div>
        ))}
      </div>

      {/* Seasons alignment */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Spring', color: '#81b29a', align: 'Aries → Gemini' },
          { label: 'Summer', color: '#e07a5f', align: 'Cancer → Virgo' },
          { label: 'Autumn', color: '#a78bfa', align: 'Libra → Sagittarius' },
          { label: 'Winter', color: '#6495ed', align: 'Capricorn → Pisces' },
        ].map(season => (
          <div key={season.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: season.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {season.label}
            </div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', marginTop: 2 }}>
              {season.align}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AprilFoolsVisual: React.FC = () => {
  return (
    <div style={{ width: '100%', maxWidth: 520, marginTop: 24 }}>
      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 24 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 8, top: 8, bottom: 8, width: 2,
          background: 'linear-gradient(180deg, rgba(201,162,39,0.4), rgba(224,122,95,0.4), rgba(129,178,154,0.4))',
        }} />

        {/* Point 1: Original New Year */}
        <div style={{ marginBottom: 20, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: -20, top: 4, width: 12, height: 12, borderRadius: '50%',
            background: 'rgba(201,162,39,0.3)', border: '2px solid #c9a227',
          }} />
          <div style={{ fontSize: 11, color: '#c9a227', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Before 1582
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            April 1st — New Year's Day
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            Fires lit. Feasts held. The world opened to possibility.
          </div>
        </div>

        {/* Point 2: The Shift */}
        <div style={{ marginBottom: 20, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: -20, top: 4, width: 12, height: 12, borderRadius: '50%',
            background: 'rgba(224,122,95,0.3)', border: '2px solid #e07a5f',
          }} />
          <div style={{ fontSize: 11, color: '#e07a5f', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            1582 AD
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            Pope Gregory moves New Year to January
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            Those who celebrated in April were mocked as "fools"
          </div>
        </div>

        {/* Point 3: The Revelation */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: -20, top: 4, width: 12, height: 12, borderRadius: '50%',
            background: 'rgba(129,178,154,0.3)', border: '2px solid #81b29a',
            boxShadow: '0 0 12px rgba(129,178,154,0.3)',
          }} />
          <div style={{ fontSize: 11, color: '#81b29a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Now
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            The pranks escalate. The energy returns.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            Chaos is not foolishness — it is the raw force of beginnings
          </div>
        </div>
      </div>

      {/* Bottom card */}
      <div style={{ marginTop: 20, padding: 14, borderRadius: 10, background: 'rgba(201,162,39,0.05)', border: '1px solid rgba(201,162,39,0.15)', textAlign: 'center' }}>
        <div style={{ fontSize: 20, marginBottom: 4 }}>🃏</div>
        <div style={{ fontSize: 12, color: '#c9a227', fontStyle: 'italic' }}>
          "The Fool is card zero — infinite potential before form."
        </div>
      </div>
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

const SLIDES: SlideDef[] = [
  // SLIDE 2: THE THEFT
  {
    id: 'theft',
    render: (phase) => (
      <SlideContainer phase={phase}>
        <Ornament />
        <Title>The Theft</Title>
        <Subtitle>How emperors stole your calendar</Subtitle>
        <Body>
          The year once began in <Highlight>March</Highlight>. The word itself comes from <em>Martius</em> —
          the month of Mars, the god of war, when the campaign season began and the world stirred from winter.
        </Body>
        <Body>
          Then Julius Caesar demanded a month named after himself. <Highlight>July</Highlight> was born.
          Augustus Caesar demanded the same. <Highlight>August</Highlight> followed. To make their months
          feel important, they each stole a day from <Highlight>February</Highlight> — the month of purification,
          left humiliated at 28 days.
        </Body>
        <Body>
          This is not mythology. This is the calendar you use.
          Two men, two egos, and a month stripped for parts.
        </Body>
      </SlideContainer>
    ),
  },
  // SLIDE 3: THE LIE OF JANUARY
  {
    id: 'january',
    render: (phase) => (
      <SlideContainer phase={phase}>
        <Ornament />
        <Title>The Lie of January</Title>
        <Subtitle>The worst possible moment for a new year</Subtitle>
        <Body>
          The original Roman calendar had only <Highlight>ten months</Highlight>.
          It began in March, when the world stirred from winter, and ended in December.
          There was no January. There was no February. Just the cycle of work, war, and harvest.
        </Body>
        <Body>
          Then two winter months were inserted at the front — <Highlight>Januarius</Highlight> and <Highlight>Februarius</Highlight> —
          the month of gates and the month of purification, shoved ahead of the natural flow
          to satisfy political and religious convenience.
        </Body>
        <Body>
          January 1st was later decreed by a pope, not by the sun, not by the moon, not by any living thing.
          It sits in the <Highlight>dead of winter</Highlight> — when nothing begins, nothing opens, nothing is born.
        </Body>
        <JanuaryDisruptionVisual />
        <Body style={{ fontStyle: 'italic', color: '#c9a227', marginTop: 20 }}>
          HEKA restores April as the Opening — <em>Aperire</em>, to open — aligned with the spring equinox,
          when the northern hemisphere breathes again.
        </Body>
      </SlideContainer>
    ),
  },
  // SLIDE 4: ARIES RISING
  {
    id: 'aries',
    render: (phase) => (
      <SlideContainer phase={phase}>
        <Ornament />
        <Title>Aries Rising</Title>
        <Subtitle>The zodiac remembers what the calendar forgot</Subtitle>
        <Body>
          The zodiac begins with <Highlight>Aries</Highlight> — the ram — herald of the spring equinox.
          When the sun enters Aries, day and night stand equal, and the northern world begins to awaken.
          The Babylonians knew it. The Egyptians knew it. Your blood knows it.
        </Body>
        <Body>
          A calendar disconnected from the stars is a ship without a compass.
          The sun's path through the zodiac — the <Highlight>ecliptic</Highlight> — is the oldest clock humanity has.
          Every ancient civilization measured their year by it.
        </Body>
        <ZodiacArc />
        <Body style={{ fontStyle: 'italic', color: '#c9a227', marginTop: 16 }}>
          HEKA aligns the Opening with Aries — when the sun crosses the celestial equator
          and the zodiac wheel turns anew.
        </Body>
      </SlideContainer>
    ),
  },
  // SLIDE 5: THE LAST LAUGH
  {
    id: 'aprilfools',
    render: (phase) => (
      <SlideContainer phase={phase}>
        <Ornament />
        <Title>The Last Laugh</Title>
        <Subtitle>When the new year became a joke</Subtitle>
        <Body>
          Once, all of Europe celebrated the new year on <Highlight>April 1st</Highlight>.
          Feasts, fires, revelry — the world opened itself to possibility.
          Then Pope Gregory XIII moved New Year's Day to January.
          Those who still celebrated in April were mocked as "April Fools."
        </Body>
        <AprilFoolsVisual />
        <Body>
          But look closer. What is a new year if not chaos? Resolutions broken by February.
          Pranks that escalate. The world turned upside down for a day.
          That is not foolishness — that is the <Highlight>raw energy of beginnings</Highlight>.
          The Fool is the first card of the tarot. The jester speaks truth to power.
        </Body>
        <Body style={{ fontStyle: 'italic', color: '#c9a227' }}>
          HEKA restores April as the true Opening. The joke, it turns out, was on the calendar.
        </Body>
      </SlideContainer>
    ),
  },
  // SLIDE 6: THE THIRTEEN CYCLES
  {
    id: 'thirteen',
    render: (phase) => (
      <SlideContainer phase={phase}>
        <Ornament />
        <Title>Thirteen Cycles</Title>
        <Subtitle>Your biology knows the truth</Subtitle>
        <Body>
          The moon orbits Earth <Highlight>13 times</Highlight> each year.
          The menstrual cycle averages 29.5 days — the exact length of the lunar month.
          Agriculture has followed lunar planting for ten thousand years. The tides answer to nothing but the moon.
        </Body>
        <Body>
          Yet our calendar insists on <Highlight>twelve</Highlight>.
          Twelve months of uneven length, starting on different days, bearing the names of dead emperors.
          Who is wrong — your body, the moon, the soil, or the calendar?
        </Body>
        <Body>
          HEKA returns to <Highlight>thirteen months</Highlight> of twenty-eight days.
          One extra day in March carries the leap. The moon is restored to her place.
          Time is made whole.
        </Body>
      </SlideContainer>
    ),
  },
  // SLIDE 7: THE STRUCTURE
  {
    id: 'structure',
    render: (phase) => (
      <SlideContainer phase={phase}>
        <Ornament />
        <Title>The Structure</Title>
        <Subtitle>Every month is four weeks. Every quarter is thirteen weeks.</Subtitle>
        <Body>
          In HEKA, the 1st is always the same day of the week. The 8th is always the same day.
          The 15th, the 22nd — <Highlight>always</Highlight>. You never count. You never check.
          You simply know.
        </Body>
        <GridPreview />
        <div style={{ display: 'flex', gap: 24, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Opening — April', color: '#e07a5f' },
            { label: 'Core — May to December', color: '#81b29a' },
            { label: 'Closing — January to March', color: '#a78bfa' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </SlideContainer>
    ),
  },
  // SLIDE 8: THE PRECISION
  {
    id: 'precision',
    render: (phase) => (
      <SlideContainer phase={phase}>
        <Ornament />
        <Title>Unmatched Precision</Title>
        <Subtitle>Numbers do not lie</Subtitle>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '36px 0', flexWrap: 'wrap' }}>
          <BigNumber value="~3,000" label="Gregorian years per day of drift" />
          <div style={{ width: 1, height: 80, background: 'rgba(255,255,255,0.1)', margin: '0 32px' }} />
          <BigNumber value="400,000+" label="HEKA years per day of drift" />
        </div>
        <Body>
          The Gregorian calendar drifts one full day every <Highlight>~3,000 years</Highlight>.
          The HEKA calendar drifts one day every <Highlight>400,000+ years</Highlight>.
        </Body>
        <Body>
          That is not an improvement. That is a <Highlight>different category of instrument</Highlight> —
          one that outlasts civilizations. While the calendar you grew up with slowly desynchronizes from the sky,
          HEKA remains true.
        </Body>
      </SlideContainer>
    ),
  },
  // SLIDE 9: A NEW CIVILIZATION
  {
    id: 'civilization',
    render: (phase) => (
      <SlideContainer phase={phase}>
        <Ornament />
        <Title>A New Civilization</Title>
        <Subtitle>The calendar of a new era</Subtitle>
        <Body>
          Every great civilization has had its calendar. The Egyptians. The Maya. The Romans.
          Each one shaped how those people saw time, planned their lives, and understood their place in the cosmos.
        </Body>
        <Body>
          The Gregorian calendar was built for <Highlight>tax collection and religious observance</Highlight>.
          It was never built for you. It was never built for the moon. It was never built for the soil,
          the tide, or the body.
        </Body>
        <Body>
          HEKA is <Highlight>infrastructure</Highlight> — a new civil standard for measuring human time.
          Free. Open. Thirteen months. Twenty-eight days. The moon restored. The body honoured.
          Time, finally, made whole.
        </Body>
      </SlideContainer>
    ),
  },
  // SLIDE 10: ENTER HEKA
  {
    id: 'enter',
    render: (phase) => (
      <SlideContainer phase={phase}>
        <Ornament />
        <Title>HEKA</Title>
        <Subtitle style={{ color: '#c9a227' }}>The calendar is yours</Subtitle>
        <Body>
          Explore the grid. Read the moon. Mark your days.
          The sky has waited a long time for a calendar that understands it.
        </Body>
      </SlideContainer>
    ),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CinematicStory: React.FC<CinematicStoryProps> = ({ onComplete }) => {
  console.log('[HEKA] CinematicStory MOUNT');
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('entering');
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
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
            background: i === slideIndex ? '#c9a227' : i < slideIndex ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.12)',
            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: i === slideIndex ? '0 0 12px rgba(201,162,39,0.4)' : 'none',
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
            fontSize: 12, color: 'rgba(255,255,255,0.25)',
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
            Enter the Calendar
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
        Skip →
      </button>
    </div>
  );
};

export default CinematicStory;
