/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MODE SELECTOR — Choose how HEKA counts time
 *
 * Two modes, one clear choice:
 *   SYNC  → Follows the civil calendar. Locked to April 1.
 *   TRUE  → Follows the sun. 12 months of 28 days + March of 29–30.
 *
 * Visual: Clean month grid showing day counts + leap visualization.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setTimeMode as setCalendarTimeMode, updateAstroPreferences } from '../../store';
import { setTimeMode, setZodiacSigns } from '../../store/setupSlice';

interface ModeSelectorProps {
  initialMode: 'SYNC' | 'TRUE' | null;
  strings: {
    modeTitle: string;
    modeSubtitle: string;
    syncTitle: string;
    syncSubtitle: string;
    syncDesc: string;
    trueTitle: string;
    trueSubtitle: string;
    trueDesc: string;
    selectModePrompt: string;
  };
}

const MONTHS = [
  { abbr: 'Apr', days: 28 },
  { abbr: 'May', days: 28 },
  { abbr: 'Jun', days: 28 },
  { abbr: 'Jul', days: 28 },
  { abbr: 'Aug', days: 28 },
  { abbr: 'Hex', days: 28 },
  { abbr: 'Sep', days: 28 },
  { abbr: 'Oct', days: 28 },
  { abbr: 'Nov', days: 28 },
  { abbr: 'Dec', days: 28 },
  { abbr: 'Jan', days: 28 },
  { abbr: 'Feb', days: 28 },
  { abbr: 'Mar', days: 29, leapDays: 30 },
];

const MonthGrid: React.FC<{ mode: 'SYNC' | 'TRUE'; isActive: boolean }> = ({ mode, isActive }) => {
  return (
    <div className="mode-month-grid" aria-hidden="true">
      {MONTHS.map((m, i) => {
        const isMarch = i === 12;
        const dayCount = isMarch ? `${m.days}–${m.leapDays}` : m.days;
        return (
          <div
            key={m.abbr}
            className={`mode-month-grid__cell ${isMarch ? 'mode-month-grid__cell--march' : ''} ${isActive ? `mode-month-grid__cell--active-${mode.toLowerCase()}` : ''}`}
          >
            <span className="mode-month-grid__abbr">{m.abbr}</span>
            <span className="mode-month-grid__days">{dayCount}</span>
          </div>
        );
      })}
    </div>
  );
};

const ModeMath: React.FC<{ mode: 'SYNC' | 'TRUE' }> = ({ mode }) => {
  if (mode === 'SYNC') {
    return (
      <div className="mode-math" aria-hidden="true">
        <div className="mode-math__line">
          <span className="mode-math__num">13</span>
          <span className="mode-math__op">×</span>
          <span className="mode-math__num">28</span>
          <span className="mode-math__op">+</span>
          <span className="mode-math__num mode-math__num--leap">1</span>
          <span className="mode-math__eq">=</span>
          <span className="mode-math__num mode-math__num--total">365</span>
          <span className="mode-math__op">/</span>
          <span className="mode-math__num mode-math__num--leap">366</span>
        </div>
        <div className="mode-math__label">Aligned to Gregorian calendar</div>
      </div>
    );
  }
  return (
    <div className="mode-math" aria-hidden="true">
      <div className="mode-math__line">
        <span className="mode-math__num">12</span>
        <span className="mode-math__op">×</span>
        <span className="mode-math__num">28</span>
        <span className="mode-math__op">+</span>
        <span className="mode-math__num mode-math__num--leap">29</span>
        <span className="mode-math__op">/</span>
        <span className="mode-math__num mode-math__num--leap">30</span>
        <span className="mode-math__eq">=</span>
        <span className="mode-math__num mode-math__num--total">365</span>
        <span className="mode-math__op">/</span>
        <span className="mode-math__num mode-math__num--leap">366</span>
      </div>
      <div className="mode-math__label">Pure astronomical cycle</div>
    </div>
  );
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  initialMode,
  strings,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [mode, setMode] = useState<'SYNC' | 'TRUE'>(initialMode || 'SYNC');
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    dispatch(setTimeMode(mode));
    dispatch(setCalendarTimeMode(mode));
    dispatch(setZodiacSigns(mode === 'TRUE' ? 13 : 12));
    dispatch(updateAstroPreferences({
      signCount: mode === 'TRUE' ? 13 : 12,
      zodiacSystem: mode === 'TRUE' ? '13-sign' : '12-sign',
      zodiacFrame: mode === 'TRUE' ? 'sidereal' : 'tropical',
    }));
  }, [dispatch, mode]);

  const handleSelect = useCallback((m: 'SYNC' | 'TRUE') => {
    setMode(m);
    setHasInteracted(true);
  }, []);

  return (
    <div className="setup-step setup-step--mode" tabIndex={-1}>
      {/* Title */}
      <div className="mode-hero">
        <h2 className="mode-hero__title" tabIndex={-1}>{strings.modeTitle}</h2>
        <p className="mode-hero__subtitle">{strings.modeSubtitle}</p>
      </div>

      {/* Two mode cards */}
      <div className="mode-cards" role="radiogroup" aria-label="Select calendar mode">
        {/* SYNC Card */}
        <button
          className={`mode-card ${mode === 'SYNC' ? 'mode-card--active' : ''}`}
          onClick={() => handleSelect('SYNC')}
          role="radio"
          aria-checked={mode === 'SYNC'}
          type="button"
        >
          <div className="mode-card__glow" aria-hidden="true" />

          <div className="mode-card__top">
            <div className="mode-card__header">
              <span className="mode-card__icon">🌐</span>
              <div className="mode-card__titles">
                <span className="mode-card__label">{strings.syncTitle}</span>
                <span className="mode-card__sublabel">{strings.syncSubtitle}</span>
              </div>
            </div>
            <p className="mode-card__desc">{strings.syncDesc}</p>
          </div>

          <MonthGrid mode="SYNC" isActive={mode === 'SYNC'} />
          <ModeMath mode="SYNC" />

          {mode === 'SYNC' && (
            <div className="mode-card__selected-badge">
              <span>Selected</span>
            </div>
          )}
        </button>

        {/* TRUE Card */}
        <button
          className={`mode-card ${mode === 'TRUE' ? 'mode-card--active' : ''}`}
          onClick={() => handleSelect('TRUE')}
          role="radio"
          aria-checked={mode === 'TRUE'}
          type="button"
        >
          <div className="mode-card__glow mode-card__glow--true" aria-hidden="true" />

          <div className="mode-card__top">
            <div className="mode-card__header">
              <span className="mode-card__icon">⚡</span>
              <div className="mode-card__titles">
                <span className="mode-card__label">{strings.trueTitle}</span>
                <span className="mode-card__sublabel">{strings.trueSubtitle}</span>
              </div>
            </div>
            <p className="mode-card__desc">{strings.trueDesc}</p>
          </div>

          <MonthGrid mode="TRUE" isActive={mode === 'TRUE'} />
          <ModeMath mode="TRUE" />

          {mode === 'TRUE' && (
            <div className="mode-card__selected-badge mode-card__selected-badge--true">
              <span>Selected</span>
            </div>
          )}
        </button>
      </div>

      {/* Persistent mode indicator */}
      <div className={`mode-persist ${hasInteracted ? 'mode-persist--visible' : ''}`}>
        <div className={`mode-persist__pill mode-persist__pill--${mode.toLowerCase()}`}>
          <span className="mode-persist__icon">{mode === 'SYNC' ? '🌐' : '⚡'}</span>
          <span className="mode-persist__name">{mode} Mode</span>
          <span className="mode-persist__divider" aria-hidden="true">—</span>
          <span className="mode-persist__detail">{mode === 'SYNC' ? 'Gregorian Aligned' : 'Pure Solar Cycle'}</span>
        </div>
      </div>
    </div>
  );
};
