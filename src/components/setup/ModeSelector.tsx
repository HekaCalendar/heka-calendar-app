/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MODE SELECTOR — Choose how HEKA counts time
 *
 * Two modes, one clear choice:
 *   SYNC  → Follows the civil calendar. Locked to April 1.
 *   TRUE  → Follows the sun. 12 months of 28 days + March of 29–30.
 *
 * Visual: Clean month grid showing day counts + leap visualization.
 *         Info modals reveal the astronomical engineering beneath.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../store';
import { setTimeMode as setCalendarTimeMode, updateAstroPreferences } from '../../store';
import { setTimeMode, setZodiacSigns } from '../../store/setupSlice';
import { IconGlobe, IconLightning, IconInfo, IconX } from './SetupIcons';

interface ModeSelectorProps {
  initialMode: 'SYNC' | 'TRUE' | null;
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

const ModeMath: React.FC<{ mode: 'SYNC' | 'TRUE'; t: (key: string) => string }> = ({ mode, t }) => {
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
        <div className="mode-math__label">{t('syncMathLabel')}</div>
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
      <div className="mode-math__label">{t('trueMathLabel')}</div>
    </div>
  );
};

interface InfoModalProps {
  mode: 'SYNC' | 'TRUE';
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const InfoModal: React.FC<InfoModalProps> = ({ mode, isOpen, onClose, t }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const isSync = mode === 'SYNC';

  return (
    <div
      className="mode-info-modal"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={isSync ? t('syncInfoTitle') : t('trueInfoTitle')}
    >
      <div
        className={`mode-info-panel mode-info-panel--${mode.toLowerCase()}`}
        ref={panelRef}
      >
        <button
          className="mode-info-panel__close"
          onClick={onClose}
          aria-label={t('close')}
          type="button"
        >
          <IconX size={16} color="rgba(255,255,255,0.5)" />
        </button>

        <div className="mode-info-panel__header">
          <span className="mode-info-panel__icon">
            {isSync ? <IconGlobe size={22} color="#60a5fa" /> : <IconLightning size={22} color="#f4d03f" />}
          </span>
          <div>
            <h3 className="mode-info-panel__title">{isSync ? t('syncInfoTitle') : t('trueInfoTitle')}</h3>
            <p className="mode-info-panel__subtitle">{isSync ? t('syncSubtitle') : t('trueSubtitle')}</p>
          </div>
        </div>

        <div className="mode-info-panel__body">
          {/* Accuracy */}
          <div className="mode-info-block">
            <span className="mode-info-block__label">{t('infoAccuracy')}</span>
            <p className="mode-info-block__text">
              {isSync ? t('syncAccuracyText') : t('trueAccuracyText')}
            </p>
            <div className={`mode-info-stat mode-info-stat--${mode.toLowerCase()}`}>
              <span className="mode-info-stat__value">{isSync ? '~3,216' : '~450,000'}</span>
              <span className="mode-info-stat__unit">{t('infoYearsPerDay')}</span>
            </div>
          </div>

          {/* Alignment */}
          <div className="mode-info-block">
            <span className="mode-info-block__label">{t('infoAlignment')}</span>
            <p className="mode-info-block__text">
              {isSync ? t('syncAlignmentText') : t('trueAlignmentText')}
            </p>
          </div>

          {/* Astrology */}
          <div className="mode-info-block">
            <span className="mode-info-block__label">{t('infoAstrology')}</span>
            <p className="mode-info-block__text">
              {isSync ? t('syncAstrologyText') : t('trueAstrologyText')}
            </p>
          </div>

          {/* Best For */}
          <div className="mode-info-block">
            <span className="mode-info-block__label">{t('infoBestFor')}</span>
            <p className="mode-info-block__text">
              {isSync ? t('syncBestForText') : t('trueBestForText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  initialMode,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('wizard');
  const [mode, setMode] = useState<'SYNC' | 'TRUE'>(initialMode || 'SYNC');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [infoModal, setInfoModal] = useState<'SYNC' | 'TRUE' | null>(null);

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
      <div className="sw-ornament" />
      {/* Title */}
      <div className="mode-hero">
        <h2 className="mode-hero__title" tabIndex={-1}>{t('modeTitle')}</h2>
        <p className="mode-hero__subtitle">{t('modeSubtitle')}</p>
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
              <span className="mode-card__icon"><IconGlobe size={20} color="#c9a227" /></span>
              <div className="mode-card__titles">
                <span className="mode-card__label">{t('syncTitle')}</span>
                <span className="mode-card__sublabel">{t('syncSubtitle')}</span>
              </div>
            </div>
            <p className="mode-card__desc">{t('syncDesc')}</p>
          </div>

          <MonthGrid mode="SYNC" isActive={mode === 'SYNC'} />
          <ModeMath mode="SYNC" t={t} />

          {/* Info button */}
          <button
            className="mode-card__info-btn"
            onClick={(e) => { e.stopPropagation(); setInfoModal('SYNC'); }}
            aria-label={t('syncInfoAria')}
            type="button"
          >
            <IconInfo size={14} color="rgba(255,255,255,0.35)" />
          </button>

          {mode === 'SYNC' && (
            <div className="mode-card__selected-badge">
              <span>{t('selected')}</span>
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
              <span className="mode-card__icon"><IconLightning size={20} color="#c9a227" /></span>
              <div className="mode-card__titles">
                <span className="mode-card__label">{t('trueTitle')}</span>
                <span className="mode-card__sublabel">{t('trueSubtitle')}</span>
              </div>
            </div>
            <p className="mode-card__desc">{t('trueDesc')}</p>
          </div>

          <MonthGrid mode="TRUE" isActive={mode === 'TRUE'} />
          <ModeMath mode="TRUE" t={t} />

          {/* Info button */}
          <button
            className="mode-card__info-btn"
            onClick={(e) => { e.stopPropagation(); setInfoModal('TRUE'); }}
            aria-label={t('trueInfoAria')}
            type="button"
          >
            <IconInfo size={14} color="rgba(255,255,255,0.35)" />
          </button>

          {mode === 'TRUE' && (
            <div className="mode-card__selected-badge mode-card__selected-badge--true">
              <span>{t('selected')}</span>
            </div>
          )}
        </button>
      </div>

      {/* Persistent mode indicator */}
      <div className={`mode-persist ${hasInteracted ? 'mode-persist--visible' : ''}`}>
        <div className={`mode-persist__pill mode-persist__pill--${mode.toLowerCase()}`}>
          <span className="mode-persist__icon">{mode === 'SYNC' ? <IconGlobe size={16} color="#c9a227" /> : <IconLightning size={16} color="#c9a227" />}</span>
          <span className="mode-persist__name">{t('modeName', { mode })}</span>
          <span className="mode-persist__divider" aria-hidden="true">—</span>
          <span className="mode-persist__detail">{mode === 'SYNC' ? t('syncDetail') : t('trueDetail')}</span>
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal
        mode={infoModal || 'SYNC'}
        isOpen={infoModal !== null}
        onClose={() => setInfoModal(null)}
        t={t}
      />
    </div>
  );
};
