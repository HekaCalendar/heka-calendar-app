/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MODE SELECTOR — Choose how HEKA counts time
 *
 * Two modes, one clear choice:
 *   SYNC  → Follows the civil calendar. Locked to April 1.
 *   TRUE  → Follows the sun. Pure 13-month cycle.
 *
 * Visual: 13-month strip showing where the leap day lives.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setTimeMode as setCalendarTimeMode, updateAstroPreferences } from '../../store';
import { setTimeMode, setZodiacSigns } from '../../store/setupSlice';

interface ModeSelectorProps {
  initialMode: 'SYNC' | 'TRUE' | null;
  onNext: () => void;
  onBack: () => void;
  strings: {
    next: string;
    back: string;
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

const MONTHS_13 = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Hex', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const HekaMonthStrip: React.FC<{ mode: 'SYNC' | 'TRUE'; isActive: boolean }> = ({ mode, isActive }) => {
  return (
    <div className="mode-month-strip" aria-hidden="true">
      {MONTHS_13.map((m, i) => {
        const isMarch = i === 12;
        const isLeap = isMarch;
        return (
          <div
            key={m}
            className={`mode-month-strip__cell ${isLeap ? 'mode-month-strip__cell--leap' : ''} ${isActive && isLeap ? `mode-month-strip__cell--leap-${mode.toLowerCase()}` : ''}`}
          >
            <span className="mode-month-strip__label">{m}</span>
            {isLeap && (
              <span className={`mode-month-strip__badge mode-month-strip__badge--${mode.toLowerCase()}`}>
                {mode === 'SYNC' ? '🔗' : '☀️'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  initialMode,
  onNext,
  onBack,
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

  const syncFacts = [
    'Year starts exactly on April 1',
    'March leap day follows Gregorian rule',
    'Zero drift from civil calendar',
  ];

  const trueFacts = [
    'Year start drifts independently',
    'March leap day every 4 years (except 128th)',
    'Closer to actual solar year',
  ];

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

          <HekaMonthStrip mode="SYNC" isActive={mode === 'SYNC'} />

          <div className="mode-card__header">
            <span className="mode-card__icon">🌐</span>
            <div className="mode-card__titles">
              <span className="mode-card__label">{strings.syncTitle}</span>
              <span className="mode-card__sublabel">{strings.syncSubtitle}</span>
            </div>
          </div>

          <p className="mode-card__desc">{strings.syncDesc}</p>

          <ul className="mode-card__facts">
            {syncFacts.map((fact, i) => (
              <li key={i} className="mode-card__fact">
                <span className="mode-card__fact-dot" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>

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

          <HekaMonthStrip mode="TRUE" isActive={mode === 'TRUE'} />

          <div className="mode-card__header">
            <span className="mode-card__icon">⚡</span>
            <div className="mode-card__titles">
              <span className="mode-card__label">{strings.trueTitle}</span>
              <span className="mode-card__sublabel">{strings.trueSubtitle}</span>
            </div>
          </div>

          <p className="mode-card__desc">{strings.trueDesc}</p>

          <ul className="mode-card__facts">
            {trueFacts.map((fact, i) => (
              <li key={i} className="mode-card__fact">
                <span className="mode-card__fact-dot mode-card__fact-dot--true" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>

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

      {/* Actions */}
      <div className="setup-step__actions">
        <button className="setup-btn setup-btn--ghost" onClick={onBack} type="button">{strings.back}</button>
        <button className="setup-btn setup-btn--primary" onClick={onNext} type="button">{strings.next}</button>
      </div>
    </div>
  );
};
