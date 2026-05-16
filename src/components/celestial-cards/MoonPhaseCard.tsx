/**
 * Moon Phase Card
 * Lunar phase with Swiss Ephemeris precision
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { LocationData } from '../../types';
import { getNextLunarNewYear } from '../../services/astronomyService';
import { getChineseZodiac } from '../../services/celestialInfoService';
import { calculateCurrentSky, calculatePreciseMoonPhase, calculateVoidMoonStatus } from '../../astrology/services/calculations/swissCalculations';
import './UnifiedCards.css';

interface Props {
  date: Date;
  location: LocationData;
}

const GLYPHS: Record<string, string> = {
  'New Moon': '🌑', 'Waxing Crescent': '🌒', 'First Quarter': '🌓', 'Waxing Gibbous': '🌔',
  'Full Moon': '🌕', 'Waning Gibbous': '🌖', 'Last Quarter': '🌗', 'Waning Crescent': '🌘'
};

const ZODIAC: Record<string, string> = {
  'Rat': '🐀', 'Ox': '🐂', 'Tiger': '🐅', 'Rabbit': '🐇', 'Dragon': '🐉', 'Snake': '🐍',
  'Horse': '🐎', 'Goat': '🐐', 'Monkey': '🐒', 'Rooster': '🐓', 'Dog': '🐕', 'Pig': '🐖'
};

const PHASE_MEANING: Record<string, { meaning: string; energy: string }> = {
  'New Moon': { meaning: 'Beginnings', energy: 'Plant seeds, set intentions' },
  'Waxing Crescent': { meaning: 'Growth', energy: 'Take first steps forward' },
  'First Quarter': { meaning: 'Action', energy: 'Push through resistance' },
  'Waxing Gibbous': { meaning: 'Refinement', energy: 'Perfect what you started' },
  'Full Moon': { meaning: 'Completion', energy: 'Celebrate, release, harvest' },
  'Waning Gibbous': { meaning: 'Gratitude', energy: 'Share knowledge' },
  'Last Quarter': { meaning: 'Release', energy: 'Let go of what no longer serves' },
  'Waning Crescent': { meaning: 'Rest', energy: 'Restore, prepare for new cycle' }
};

function getSimplePhase(date: Date) {
  const known = new Date(Date.UTC(2024, 0, 11, 11, 57, 0));
  const cycle = 29.53059;
  const age = ((date.getTime() - known.getTime()) / 86400000 % cycle + cycle) % cycle;
  let phase: string;
  if (age < 1) phase = 'New Moon';
  else if (age < 6.5) phase = 'Waxing Crescent';
  else if (age < 8) phase = 'First Quarter';
  else if (age < 13.5) phase = 'Waxing Gibbous';
  else if (age < 15.5) phase = 'Full Moon';
  else if (age < 21) phase = 'Waning Gibbous';
  else if (age < 23) phase = 'Last Quarter';
  else phase = 'Waning Crescent';
  return { phase, glyph: GLYPHS[phase], illum: (1 - Math.cos((age / cycle) * 2 * Math.PI)) / 2 * 100, age, waxing: age < cycle / 2 };
}

const MoonPhaseCardComponent: React.FC<Props> = ({ date }) => {
  const { t } = useTranslation('celestial');
  const [phase, setPhase] = useState<ReturnType<typeof getSimplePhase> | null>(null);
  const [zodiac, setZodiac] = useState<ReturnType<typeof getChineseZodiac> | null>(null);
  const [lny, setLny] = useState<ReturnType<typeof getNextLunarNewYear> | null>(null);
  const [moonDetails, setMoonDetails] = useState<{
    sign: string;
    degree: number;
    speed: number;
    isVoid: boolean;
    voidQuality: string;
  } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sky, voidData] = await Promise.all([
          calculateCurrentSky(date),
          calculateVoidMoonStatus(date).catch(() => ({ isVoid: false, qualityDescription: '' })),
        ]);
        const p = calculatePreciseMoonPhase(sky.positions.sun, sky.positions.moon);
        setPhase({ phase: p.name, glyph: p.emoji, illum: p.illumination, age: p.angle / 360 * 29.53, waxing: p.isWaxing });
        const moon = sky.positions.moon;
        if (moon) {
          setMoonDetails({
            sign: moon.sign || 'Aries',
            degree: Math.round((moon.degreeInSign || 0) * 100) / 100,
            speed: Math.round((moon.speed || 0) * 100) / 100,
            isVoid: voidData.isVoid,
            voidQuality: voidData.qualityDescription || '',
          });
        }
      } catch {
        setPhase(getSimplePhase(date));
        setMoonDetails(null);
      }
    };
    fetch();
    setZodiac(getChineseZodiac(date.getFullYear()));
    setLny(getNextLunarNewYear(date));
  }, [date]);

  const lnyCounter = useMemo(() => {
    if (!lny) return null;
    const ms = lny.date.getTime() - now.getTime();
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return { d, h, m, ms };
  }, [lny, now]);

  if (!phase || !zodiac) return null;

  const progress = (phase.age / 29.53) * 100;
  const info = PHASE_MEANING[phase.phase] || { meaning: 'Unknown', energy: 'Observe' };
  const elementColor = phase.waxing ? '#60a5fa' : '#a78bfa';

  return (
    <div className={`heka-card ${expanded ? 'expanded' : ''}`}>
      <div className="heka-card__header heka-card__header--enterprise" onClick={() => setExpanded(!expanded)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); } }}>
        <span className="heka-card__icon">{phase.glyph}</span>
        <div className="heka-card__title-group">
          <span className="heka-card__title">{phase.phase}</span>
          <span className="heka-card__subtitle">
            <span className="heka-chip heka-chip--accent">{Math.round(phase.illum)}% {t('cards.moonPhase.illuminated')}</span>
            <span className="heka-chip">Day {Math.round(phase.age)} of 29.5</span>
          </span>
        </div>
        <div className="heka-ring heka-ring--large">
          <svg viewBox="0 0 36 36">
            <path className="heka-ring__bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="heka-ring__fill" strokeDasharray={`${progress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ stroke: elementColor }} />
          </svg>
          <span className="heka-ring__text">{Math.round(progress)}%</span>
        </div>
      </div>

      {expanded && (
        <div className="heka-card__content">
          {/* Lunar New Year Epic Counter */}
          {lnyCounter && (
            <div className="heka-epic-counter" style={{ borderColor: `${elementColor}20` }}>
              <div className="heka-epic-counter__digits">
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: elementColor }}>{String(lnyCounter.d).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Days</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: elementColor }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: elementColor }}>{String(lnyCounter.h).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Hours</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: elementColor }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: elementColor }}>{String(lnyCounter.m).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Mins</span>
                </div>
              </div>
              <span className="heka-epic-counter__title" style={{ color: elementColor }}>🎆 Until Lunar New Year</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
                {lny?.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                {' • '}{zodiac.animal} Year
              </span>
            </div>
          )}

          {/* Moon Intelligence Hero */}
          {moonDetails && (
            <div className="heka-hero" style={{ marginBottom: '14px', borderColor: moonDetails.isVoid ? 'rgba(239,68,68,0.3)' : undefined }}>
              <span className="heka-hero__icon">☽</span>
              <div className="heka-hero__content">
                <div className="heka-hero__title">{moonDetails.sign} {moonDetails.degree}°</div>
                <div className="heka-hero__meta">
                  Speed {moonDetails.speed}°/day
                  {moonDetails.isVoid && (
                    <span style={{ color: '#fca5a5', marginLeft: '8px' }}>• Void of Course</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Illumination Big Display */}
          <div className="heka-countdown">
            <span className="heka-countdown__value" style={{ color: elementColor, textShadow: `0 0 30px ${elementColor}40` }}>
              {Math.round(phase.illum)}%
            </span>
            <span className="heka-countdown__label">{t('cards.moonPhase.illuminated')} • {t('cards.moonPhase.dayOfCycle', { day: Math.round(phase.age) })}</span>
          </div>

          {/* Phase Meaning */}
          <div className="heka-section" style={{ marginTop: '12px' }}>
            <div className="heka-section__title">🌙 {info.meaning}</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 }}>
              {info.energy}
            </p>
            {moonDetails?.isVoid && (
              <p style={{ fontSize: '12px', color: '#fca5a5', marginTop: '8px', marginBottom: 0 }}>
                ⚠️ Void of Course: {moonDetails.voidQuality}
              </p>
            )}
          </div>

          {/* Zodiac Info - Compact */}
          <div className="heka-section">
            <div className="heka-section__title">{ZODIAC[zodiac.animal]} {zodiac.animal} Year</div>
            <div className="heka-data-grid heka-data-grid--2">
              <div className="heka-data-cell">
                <span className="heka-data-cell__label">Element</span>
                <span className="heka-data-cell__value">{zodiac.element}</span>
              </div>
              <div className="heka-data-cell">
                <span className="heka-data-cell__label">Nature</span>
                <span className="heka-data-cell__value">{zodiac.yinYang}</span>
              </div>
            </div>
            <div className="heka-tags" style={{ marginTop: '8px' }}>
              {zodiac.characteristics.slice(0, 5).map((c, i) => (
                <span key={i} className="heka-tag" style={{ borderColor: `${elementColor}30` }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const MoonPhaseCard = memo(MoonPhaseCardComponent);
MoonPhaseCard.displayName = 'MoonPhaseCard';
