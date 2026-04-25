/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FIRST NOTE RITUAL — The user's first journal entry
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconNote, IconCheck } from './OnboardingIcons';
import { addNote } from '../../../store';
import { getNoteKey, getTodayHekaDate } from '../../../services/calendarService';
import './onboardingAnimations.css';

export const FirstNoteRitual: React.FC = () => {
  const { goNext, markInteraction, getInterpolatedCopy } = useOnboarding();
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  // Get personalized placeholder
  const placeholder = useMemo(() => {
    return getInterpolatedCopy('note.placeholder');
  }, [getInterpolatedCopy]);

  const handleSave = () => {
    if (!text.trim()) return;

    // Save the note to the actual app state
    const today = getTodayHekaDate();
    const dayKey = getNoteKey(today.year, today.month, today.day);
    dispatch(addNote({ key: dayKey, content: text.trim() }));

    setSaved(true);
    markInteraction('noteSaved');
    const timer = setTimeout(() => goNext(), 2000);
    return () => clearTimeout(timer);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(201, 162, 39, 0.04) 0%, transparent 60%),
          #05040a
        `,
        zIndex: 9998,
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        <MotionContainer delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <IconNote size={36} color="#c9a227" />
            <div>
              <h1
                style={{
                  fontSize: 'clamp(22px, 4vw, 30px)',
                  fontWeight: 700,
                  color: '#f5f3ff',
                  margin: 0,
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                }}
              >
                {getInterpolatedCopy('note.heading')}
              </h1>
              <p style={{ fontSize: 13, color: '#a89bc8', margin: '4px 0 0 0' }}>
                {getInterpolatedCopy('note.subheading')}
              </p>
            </div>
          </div>
        </MotionContainer>

        <MotionContainer delay={200}>
          <div
            style={{
              position: 'relative',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              overflow: 'hidden',
            }}
          >
            {/* Paper lines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  repeating-linear-gradient(
                    transparent,
                    transparent 31px,
                    rgba(255,255,255,0.03) 31px,
                    rgba(255,255,255,0.03) 32px
                  )
                `,
                pointerEvents: 'none',
              }}
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              disabled={saved}
              style={{
                width: '100%',
                minHeight: 160,
                padding: '20px 24px',
                background: 'transparent',
                border: 'none',
                color: '#f5f3ff',
                fontSize: 15,
                lineHeight: '32px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </MotionContainer>

        <MotionContainer delay={400}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            {!saved ? (
              <button
                onClick={handleSave}
                disabled={!text.trim()}
                style={{
                  padding: '14px 28px',
                  borderRadius: 14,
                  border: 'none',
                  background: text.trim()
                    ? 'linear-gradient(135deg, #c9a227, #b8941f)'
                    : 'rgba(255,255,255,0.06)',
                  color: text.trim() ? '#05040a' : '#6b5b8a',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: text.trim() ? 'pointer' : 'default',
                  transition: 'all 0.25s ease',
                }}
              >
                Save
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 28px',
                  color: '#81b29a',
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                <IconCheck size={20} color="#2d8a4e" />
                {getInterpolatedCopy('note.saved')}
              </div>
            )}
          </div>
        </MotionContainer>
      </div>
    </div>
  );
};


