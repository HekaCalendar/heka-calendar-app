/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMMUNITY PREVIEW — Voting, holiday suggestions, celestial events
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconArrowRight, IconSparkle } from './OnboardingIcons';
import './onboardingAnimations.css';

const DEMO_VOTES = [
  { id: 1, label: 'Add lunar eclipse alerts', votes: 342, userVoted: false },
  { id: 2, label: 'Birth chart sharing with friends', votes: 518, userVoted: true },
  { id: 3, label: 'Planetary hour notifications', votes: 287, userVoted: false },
];

export const CommunityPreview: React.FC = () => {
  const { goNext } = useOnboarding();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [votes, setVotes] = useState(DEMO_VOTES);

  const toggleVote = (id: number) => {
    setVotes((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, votes: v.userVoted ? v.votes - 1 : v.votes + 1, userVoted: !v.userVoted } : v
      )
    );
  };

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
                background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.12), rgba(124, 58, 237, 0.08))',
                border: '1px solid rgba(201, 162, 39, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="10" cy="16" r="6" stroke="#c9a227" strokeWidth="1.5" fill="none" />
                <circle cx="22" cy="16" r="6" stroke="#c9a227" strokeWidth="1.5" fill="none" />
                <circle cx="16" cy="16" r="2" fill="#c9a227" />
              </svg>
            </div>
            <span
              style={{
                display: 'inline-block',
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#c9a227',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                padding: '4px 10px',
                borderRadius: 999,
                marginBottom: 12,
              }}
            >
              Preview
            </span>
            <h1 className="im-title">The Community</h1>
            <p className="im-subtitle">
              Shape the calendar together. Propose new holy days, mark the turning of the sky, and move as one through the year.
            </p>
          </div>
        </MotionContainer>

        {/* Voting demo */}
        <MotionContainer delay={250}>
          <div
            style={{
              padding: '20px 20px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#c9a227',
                marginBottom: 16,
              }}
            >
              Active Votes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {votes.map((vote) => (
                <button
                  key={vote.id}
                  onClick={() => toggleVote(vote.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: `1.5px solid ${vote.userVoted ? 'rgba(201, 162, 39, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                    background: vote.userVoted ? 'rgba(201, 162, 39, 0.06)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: vote.userVoted ? '#c9a227' : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <IconSparkle size={14} color={vote.userVoted ? '#05040a' : '#6b5b8a'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#f5f3ff', marginBottom: 2 }}>
                      {vote.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b5b8a' }}>
                      {vote.votes.toLocaleString()} votes
                    </div>
                  </div>
                  {vote.userVoted && (
                    <span style={{ fontSize: 11, color: '#c9a227', fontWeight: 600 }}>Voted</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </MotionContainer>

        {/* Feature bullets */}
        <MotionContainer delay={450} staggerChildren={80}>
          {[
            'Propose holy days the whole community can observe',
            'Mark celestial events that matter to your region',
            'See what the collective is calling for',
            'Your voice shapes the calendar',
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
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#c9a227',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: '#a89bc8' }}>{feature}</span>
            </div>
          ))}
        </MotionContainer>

        <MotionContainer delay={700}>
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
