/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE BREAKDOWN — Honest comparison. No false claims. Hemisphere aware.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useEffect } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconArrowRight, IconMoon, IconSun, IconSync } from './OnboardingIcons';
import './onboardingAnimations.css';

interface ComparisonRow {
  category: string;
  gregorian: string;
  heka: string;
}

const COMPARISONS: ComparisonRow[] = [
  {
    category: 'New Year',
    gregorian: 'January 1st. Midwinter in the north. Midsummer in the south. Nature is not renewing anywhere.',
    heka: 'April 1st. Spring equinox in the north. Autumn equinox in the south. A balanced threshold for the entire planet.',
  },
  {
    category: 'Year Length',
    gregorian: '365.2425 days. Approximates the tropical year. Drifts 1 day every 3,216 years.',
    heka: '365.2421875 days in TRUE mode. Drifts 1 day every ~400,000 years. Over 100× more precise than the calendar you inherited.',
  },
  {
    category: 'Month Length',
    gregorian: '28, 29, 30, or 31 days. You need a rhyme to remember which is which.',
    heka: 'Twelve months of 28 days. One rhythm. March, the closing month, holds the leap day: 29 days, or 30 in a leap year.',
  },
  {
    category: 'Weeks per Month',
    gregorian: 'Four weeks plus 0, 1, 2, or 3 extra days. Your routines never settle into rhythm.',
    heka: 'Exactly 4 weeks in every month except March. Four perfect weeks. Within each year, every month begins on the same day — your anchor, never shifting.',
  },
  {
    category: 'Quarter Lengths',
    gregorian: 'Ninety, ninety-one, ninety-two days. Every quarter is a different length. Your three-month rhythms never repeat.',
    heka: 'Ninety-one days per quarter. Thirteen weeks. Every quarter is identical. Your three-month rhythms become predictable as breath.',
  },
  {
    category: 'The Moon',
    gregorian: 'Completely ignored. Full moons, new moons, and quarters fall on random dates every month.',
    heka: '13 months of 28 days echo the moon\'s natural rhythm. 13 lunations per year. The calendar and the sky are in conversation.',
  },
  {
    category: 'Hemisphere Balance',
    gregorian: 'January starts in winter exhaustion for half the world, summer exhaustion for the other half. No one is balanced.',
    heka: 'April is an equinox month. Neither hemisphere is at an extreme. Both north and south begin their year in transition, not exhaustion.',
  },
];

export const TheBreakdown: React.FC = () => {
  const { goNext } = useOnboarding();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleContinue = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    timerRef.current = setTimeout(() => goNext(), 400);
  };

  return (
    <div className="im-screen">
      <div className="im-content">
        <MotionContainer delay={0}>
          <div style={{ textAlign: 'center', margin: '32px 0 36px' }}>
            <h1 className="im-title">The Breakdown</h1>
            <p className="im-subtitle" style={{ maxWidth: 440, margin: '10px auto 0' }}>
              Seven ways the Gregorian calendar fails. And how HEKA fixes each one.
            </p>
          </div>
        </MotionContainer>

        {/* Comparison rows */}
        {COMPARISONS.map((row, index) => (
          <MotionContainer key={row.category} delay={200 + index * 80}>
            <div
              style={{
                marginBottom: 14,
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.015)',
                overflow: 'hidden',
              }}
            >
              {/* Category header */}
              <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a227' }} />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#c9a227' }}>
                  {row.category}
                </span>
              </div>

              {/* Side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ padding: '12px 16px 16px', background: '#0c0a14', borderLeft: '3px solid #e07a5f' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#e07a5f', marginBottom: 6 }}>
                    Gregorian
                  </div>
                  <p style={{ fontSize: 12, color: '#a89bc8', lineHeight: 1.5, margin: 0 }}>
                    {row.gregorian}
                  </p>
                </div>
                <div style={{ padding: '12px 16px 16px', background: '#0c0a14', borderLeft: '3px solid #81b29a' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#81b29a', marginBottom: 6 }}>
                    HEKA
                  </div>
                  <p style={{ fontSize: 12, color: '#c0c0d0', lineHeight: 1.5, margin: 0 }}>
                    {row.heka}
                  </p>
                </div>
              </div>
            </div>
          </MotionContainer>
        ))}

        {/* Feature Toggles preview */}
        <MotionContainer delay={900}>
          <div
            style={{
              marginTop: 28,
              padding: '24px 24px',
              borderRadius: 20,
              border: '1px solid rgba(201, 162, 39, 0.12)',
              background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.04), rgba(124, 58, 237, 0.04))',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f5f3ff', margin: '0 0 16px 0' }}>
              The Veil You Choose
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: <IconMoon size={18} color="#c0c0d0" />, title: 'Live Moon Phases', desc: "See the moon's face on every day." },
                { icon: <IconSun size={18} color="#c9a227" />, title: 'Civil Date Overlays', desc: 'Keep the old calendar close at hand.' },
                { icon: <IconSync size={18} color="#81b29a" />, title: 'Holiday Markers', desc: 'Mark the solstices, equinoxes, and holy days.' },
              ].map((feature) => (
                <div key={feature.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {feature.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f3ff', marginBottom: 2 }}>{feature.title}</div>
                    <div style={{ fontSize: 12, color: '#a89bc8', lineHeight: 1.4 }}>{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionContainer>

        <MotionContainer delay={1100}>
          <button onClick={handleContinue} className="im-btn-primary" style={{ marginTop: 32 }}>
            See the Calendar
            <IconArrowRight size={20} color="#05040a" />
          </button>
        </MotionContainer>
      </div>
    </div>
  );
};
