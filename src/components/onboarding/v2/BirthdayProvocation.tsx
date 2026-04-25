/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BIRTHDAY PROVOCATION — The emotional hook. Honest about HEKA's advantages.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconArrowRight } from './OnboardingIcons';
import { civilToHeka, HEKA_MONTHS } from '../../../services/calendarService';
import './onboardingAnimations.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const BirthdayProvocation: React.FC = () => {
  const { goNext, state } = useOnboarding();
  const [revealed, setRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const birthDate = state.personalization.birthDate;

  const gregorianInfo = useMemo(() => {
    if (!birthDate) {
      const today = new Date();
      return {
        date: today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
        dayOfWeek: DAYS[today.getDay()],
      };
    }
    const d = new Date(birthDate);
    return {
      date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      dayOfWeek: DAYS[d.getDay()],
    };
  }, [birthDate]);

  const hekaInfo = useMemo(() => {
    const refDate = birthDate ? new Date(birthDate) : new Date();
    const heka = civilToHeka(refDate);
    if (!heka) return null;
    const civil = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
    const dayOfWeek = DAYS[civil.getDay()];
    const monthNames = HEKA_MONTHS.map(m => m.name);
    return {
      date: `${monthNames[heka.month]} ${heka.day}`,
      dayOfWeek,
      year: heka.year,
    };
  }, [birthDate]);

  const handleContinue = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    timerRef.current = setTimeout(() => goNext(), 400);
  };

  return (
    <div className="im-screen">
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Gregorian Card */}
        <MotionContainer delay={0}>
          <div className="im-card" style={{ marginBottom: 20, borderColor: 'rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6b5b8a' }} />
              <span className="im-pill-label" style={{ color: '#6b5b8a' }}>
                The calendar you inherited
              </span>
            </div>
            <div style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: '#a89bc8', marginBottom: 8 }}>
              {gregorianInfo.date}
            </div>
            <p style={{ fontSize: 14, color: '#6b5b8a', lineHeight: 1.6, margin: 0 }}>
              Your birthday is {gregorianInfo.date}. What day of the week was it?
              You cannot answer because the calendar you inherited is fractured.
              Its months are 28, 29, 30, or 31 days — scattered without reason.
              You need a nursery rhyme just to remember how long each one lasts.
              No wonder you feel untethered.
            </p>
          </div>
        </MotionContainer>

        {/* Arrow */}
        <MotionContainer delay={200}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <div
              className="im-float"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '1px solid rgba(201, 162, 39, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M8 13L4 9M8 13L12 9" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </MotionContainer>

        {/* HEKA Card */}
        <MotionContainer delay={revealed ? 0 : 400}>
          <div
            className="im-card"
            style={{
              borderColor: revealed ? 'rgba(201, 162, 39, 0.25)' : 'rgba(255,255,255,0.06)',
              background: revealed
                ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(12, 10, 20, 0.95) 100%)'
                : 'rgba(255,255,255,0.02)',
              transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              position: 'relative',
            }}
          >
            {revealed && (
              <div
                style={{
                  position: 'absolute', top: -50, right: -50,
                  width: 150, height: 150, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
                  animation: 'im-breathe 4s ease-in-out infinite',
                }}
              />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, position: 'relative' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: revealed ? '#c9a227' : '#6b5b8a',
                transition: 'background 0.5s ease',
                boxShadow: revealed ? '0 0 8px rgba(201, 162, 39, 0.5)' : 'none',
              }} />
              <span className="im-pill-label" style={{ color: revealed ? '#c9a227' : '#6b5b8a', transition: 'color 0.5s ease' }}>
                On the HEKA calendar
              </span>
            </div>

            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="im-btn-outline"
              >
                Reveal my HEKA birthday
              </button>
            ) : (
              <div style={{ position: 'relative' }}>
                <div className="im-anim-fade-up" style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: '#f5f3ff', marginBottom: 8 }}>
                  {hekaInfo?.date || 'Your HEKA Date'}
                </div>
                <p className="im-anim-fade-up" style={{ fontSize: 14, color: '#a89bc8', lineHeight: 1.6, margin: 0, animationDelay: '0.1s' }}>
                  Your HEKA birthday is {hekaInfo?.date}. It falls on {hekaInfo?.dayOfWeek}.
                  Every year. Without exception. Twelve months of exactly twenty-eight days.
                  March, the closing month, carries the leap day — twenty-nine, or thirty when
                  the year requires it. One point of flux. Everywhere else: pure rhythm.
                </p>
                <button onClick={handleContinue} className="im-btn-primary" style={{ marginTop: 28 }}>
                  Continue
                  <IconArrowRight size={18} color="#05040a" />
                </button>
              </div>
            )}
          </div>
        </MotionContainer>
      </div>
    </div>
  );
};
