/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TRACKER PREVIEW — Wellness tracking: mood, sleep, energy, habits, journal
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconArrowRight, IconCheck } from './OnboardingIcons';
import './onboardingAnimations.css';

const TRACKER_TABS = [
  { id: 'mood', label: 'Mood', color: '#ec4899', icon: '🫂' },
  { id: 'sleep', label: 'Sleep', color: '#7c3aed', icon: '🌙' },
  { id: 'energy', label: 'Energy', color: '#c9a227', icon: '⚡' },
  { id: 'habits', label: 'Habits', color: '#2d8a4e', icon: '🔥' },
  { id: 'journal', label: 'Journal', color: '#3b82f6', icon: '📜' },
];

const DEMO_ENTRIES = [
  { day: 'Mon', value: 0.7, color: '#81b29a' },
  { day: 'Tue', value: 0.5, color: '#c9a227' },
  { day: 'Wed', value: 0.8, color: '#81b29a' },
  { day: 'Thu', value: 0.4, color: '#e07a5f' },
  { day: 'Fri', value: 0.9, color: '#81b29a' },
  { day: 'Sat', value: 0.6, color: '#c9a227' },
  { day: 'Sun', value: 0.75, color: '#81b29a' },
];

export const TrackerPreview: React.FC = () => {
  const { goNext } = useOnboarding();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState('mood');

  const handleContinue = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => goNext(), 400);
  };

  return (
    <div className="im-screen">
      <div className="im-content">
        <MotionContainer delay={0}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(45, 138, 78, 0.15), rgba(124, 58, 237, 0.1))',
                border: '1px solid rgba(45, 138, 78, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="14" width="6" height="14" rx="2" fill="#2d8a4e" opacity="0.6" />
                <rect x="13" y="8" width="6" height="20" rx="2" fill="#c9a227" opacity="0.8" />
                <rect x="22" y="4" width="6" height="24" rx="2" fill="#7c3aed" opacity="0.5" />
              </svg>
            </div>
            <span
              style={{
                display: 'inline-block',
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#81b29a',
                border: '1px solid rgba(129, 178, 154, 0.3)',
                padding: '4px 10px',
                borderRadius: 999,
                marginBottom: 12,
              }}
            >
              Preview
            </span>
            <h1 className="im-title">The Pattern Book</h1>
            <p className="im-subtitle">
              Five dimensions of inner weather. One daily ritual. Watch your patterns unfold across the arcs of the year.
            </p>
          </div>
        </MotionContainer>

        {/* Tab bar */}
        <MotionContainer delay={200}>
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 24,
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none',
            }}
          >
            {TRACKER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: 'none',
                  background: activeTab === tab.id ? `${tab.color}18` : 'rgba(255,255,255,0.03)',
                  color: activeTab === tab.id ? tab.color : '#6b5b8a',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </MotionContainer>

        {/* Chart visualization */}
        <MotionContainer delay={350}>
          <div
            style={{
              padding: '24px 20px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: 120,
                gap: 8,
              }}
            >
              {DEMO_ENTRIES.map((entry, i) => (
                <div key={entry.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 32,
                      height: `${entry.value * 100}px`,
                      borderRadius: 6,
                      background: entry.color,
                      opacity: 0.7,
                      transition: 'height 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                  <span style={{ fontSize: 10, color: '#6b5b8a', fontWeight: 500 }}>{entry.day}</span>
                </div>
              ))}
            </div>
          </div>
        </MotionContainer>

        {/* Feature list */}
        <MotionContainer delay={500} staggerChildren={80}>
          {[
            'Record your inner weather each day',
            'Watch your patterns unfold across the arcs of the year',
            'Discover how the moon mirrors your inner tides',
            'Your journal and your tracker speak to each other',
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
              }}
            >
              <IconCheck size={18} color="#2d8a4e" />
              <span style={{ fontSize: 13, color: '#a89bc8' }}>{feature}</span>
            </div>
          ))}
        </MotionContainer>

        <MotionContainer delay={800}>
          <button
            onClick={handleContinue}
            className="im-btn-primary"
            style={{ marginTop: 28 }}
          >
            Continue
            <IconArrowRight size={18} color="#05040a" />
          </button>
        </MotionContainer>
      </div>
    </div>
  );
};
