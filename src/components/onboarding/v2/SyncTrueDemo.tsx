/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SYNC / TRUE DEMO — Interactive mode toggle WITH working year drift simulation
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconSync } from './OnboardingIcons';
import './onboardingAnimations.css';

export const SyncTrueDemo: React.FC = () => {
  const { goNext, markInteraction, getInterpolatedCopy } = useOnboarding();
  const [mode, setMode] = useState<'sync' | 'true'>('sync');
  const [simulatedYear, setSimulatedYear] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = (newMode: 'sync' | 'true') => {
    setMode(newMode);
    markInteraction('syncTrueToggled');
  };

  const handleContinue = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => goNext(), 400);
  };

  const baseDate = useMemo(() => new Date(), []);

  // SYNC: Gregorian-aligned. Date stays locked to civil calendar.
  // TRUE: Astronomical. Drifts ~11 days over 400 years, then resets via leap rule.
  const displayedDate = useMemo(() => {
    const d = new Date(baseDate);
    if (mode === 'sync') {
      // SYNC: Just show today's date normally
      return d;
    }
    // TRUE: Simulate the drift. Over 400 years, TRUE drifts ~11 days behind Gregorian.
    // We compress this: each slider step = 40 years, max 10 steps = 400 years.
    const years = simulatedYear * 40;
    const driftDays = Math.round((years / 400) * 11); // ~11 days per 400 years
    d.setDate(d.getDate() - driftDays);
    return d;
  }, [baseDate, mode, simulatedYear]);

  const dateStr = displayedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const driftText = mode === 'true' && simulatedYear > 0
    ? `${simulatedYear * 40} years of drift: ${Math.round((simulatedYear * 40 / 400) * 11)} days behind Gregorian`
    : mode === 'true'
      ? 'TRUE mode follows astronomical leap rules'
      : 'SYNC mode stays aligned with the Gregorian calendar';

  return (
    <div className="im-screen">
      <div style={{ width: '100%', maxWidth: 420 }}>
        <MotionContainer delay={0}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <IconSync size={48} color="#c9a227" />
            <h1 className="im-title">{getInterpolatedCopy('synctrue.heading')}</h1>
            <p className="im-subtitle" style={{ margin: '8px auto 0' }}>
              {getInterpolatedCopy('synctrue.subheading')}
            </p>
          </div>
        </MotionContainer>

        {/* Toggle */}
        <MotionContainer delay={200}>
          <div style={{ display: 'flex', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: 4, marginBottom: 32 }}>
            {(['sync', 'true'] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleToggle(m)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: mode === m ? 'rgba(201, 162, 39, 0.12)' : 'transparent',
                  color: mode === m ? '#c9a227' : '#6b5b8a',
                  fontSize: 14,
                  fontWeight: mode === m ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {getInterpolatedCopy(`synctrue.${m}.label`)}
              </button>
            ))}
          </div>
        </MotionContainer>

        {/* Date display */}
        <MotionContainer delay={350}>
          <div
            style={{
              padding: '28px 24px',
              borderRadius: 20,
              border: `1.5px solid ${mode === 'sync' ? 'rgba(201, 162, 39, 0.2)' : 'rgba(124, 58, 237, 0.2)'}`,
              background: mode === 'sync'
                ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.06), rgba(12, 10, 20, 0.9))'
                : 'linear-gradient(135deg, rgba(124, 58, 237, 0.06), rgba(12, 10, 20, 0.9))',
              transition: 'all 0.4s ease',
              marginBottom: 28,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: mode === 'sync' ? '#c9a227' : '#a78bfa', marginBottom: 12 }}>
              {mode === 'sync' ? getInterpolatedCopy('synctrue.sync.label') : getInterpolatedCopy('synctrue.true.label')}
            </div>
            <div style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#f5f3ff', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>
              {dateStr}
            </div>
            <p style={{ fontSize: 13, color: '#a89bc8', lineHeight: 1.5, margin: 0 }}>
              {mode === 'sync'
                ? getInterpolatedCopy('synctrue.sync.desc')
                : getInterpolatedCopy('synctrue.true.desc')}
            </p>
          </div>
        </MotionContainer>

        {/* Year drift simulation (only in TRUE mode) */}
        {mode === 'true' && (
          <MotionContainer delay={450}>
            <div style={{ padding: '20px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa' }}>Simulate centuries of drift</span>
                <span style={{ fontSize: 12, color: '#c9a227', fontFamily: 'JetBrains Mono, monospace' }}>{simulatedYear * 40} years</span>
              </div>
              <input
                type="range"
                className="im-slider"
                min={0}
                max={10}
                step={1}
                value={simulatedYear}
                onChange={(e) => setSimulatedYear(Number(e.target.value))}
                style={{ width: '100%', marginBottom: 12 }}
              />
              <p style={{ fontSize: 11, color: '#6b5b8a', margin: 0, textAlign: 'center' }}>
                {driftText}
              </p>
              {/* Visual drift bar */}
              <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(simulatedYear / 10) * 100}%`,
                    background: 'linear-gradient(90deg, #c9a227, #a78bfa)',
                    borderRadius: 2,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </MotionContainer>
        )}

        <MotionContainer delay={500}>
          <button onClick={handleContinue} className="im-btn-primary" style={{ marginTop: mode === 'true' ? 0 : 8 }}>
            Continue
          </button>
        </MotionContainer>
      </div>
    </div>
  );
};
