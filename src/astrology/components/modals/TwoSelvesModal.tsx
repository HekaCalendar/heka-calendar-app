/**
 * Two Selves Modal — Tropical vs Sidereal Birth Chart Comparison
 * Generates BOTH systems fresh from birth data for an honest comparison.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  calculateAllPlanets,
  calculateHouses,
  calculateJulianDay,
  birthDateTimeToUTC,
  calculateAyanamsa,
} from '../../services/swiss-ephemeris/engine';
import { getSignFromLongitude, toDegree, PLANET_NAMES, SIGN_SYMBOLS } from '../../types';

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '⛢', neptune: '♆', pluto: '♇',
};

import type { BirthData } from '../../services/natal/natalChart';
import './two-selves-modal.css';

const PLANET_ORDER = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
];

const SIGN_ELEMENTS: Record<string, string> = {
  aries: 'fire', taurus: 'earth', gemini: 'air', cancer: 'water',
  leo: 'fire', virgo: 'earth', libra: 'air', scorpio: 'water',
  ophiuchus: 'water', sagittarius: 'fire', capricorn: 'earth', aquarius: 'air', pisces: 'water',
};

interface PlanetRow {
  id: string;
  name: string;
  tropical: { sign: string; degree: number; house: number };
  sidereal: { sign: string; degree: number; house: number };
  changed: boolean;
}

interface ComparisonData {
  planets: PlanetRow[];
  ascendant: { tropical: string; sidereal: string; changed: boolean };
  midheaven: { tropical: string; sidereal: string; changed: boolean };
  ayanamsa: number;
  dominantElement: { tropical: string; sidereal: string };
}

interface SystemSnapshot {
  planets: Record<string, any>;
  houses: any;
  julianDay: number;
}

function generateSnapshot(
  birthData: BirthData,
  system: 'tropical' | 'sidereal',
  signCount: 12 | 13 = 12
): SystemSnapshot | null {
  try {
    const dt = birthDateTimeToUTC(birthData.date, birthData.time, birthData.timezone);
    const jd = calculateJulianDay(
      dt.getUTCFullYear(),
      dt.getUTCMonth() + 1,
      dt.getUTCDate(),
      dt.getUTCHours(),
      dt.getUTCMinutes(),
      0
    );

    const opts = signCount === 13 ? '13-sign' : system === 'sidereal' ? 'sidereal' : '12-sign';
    const planets = calculateAllPlanets(jd, undefined, opts);
    const houses = calculateHouses(
      jd,
      { latitude: birthData.latitude, longitude: birthData.longitude, altitude: 0 },
      'P',
      opts
    );

    return { planets, houses, julianDay: jd };
  } catch (err) {
    console.error(`[TwoSelvesModal] Failed to generate ${system} snapshot:`, err);
    return null;
  }
}

function getHouseFromLongitude(longitude: number, cusps: any[]): number {
  const normalized = ((longitude % 360) + 360) % 360;
  for (let i = 0; i < 12; i++) {
    const cuspStart = ((cusps[i]?.longitude ?? i * 30) % 360 + 360) % 360;
    const cuspEnd = ((cusps[(i + 1) % 12]?.longitude ?? ((i + 1) % 12) * 30) % 360 + 360) % 360;
    if (cuspEnd < cuspStart) {
      if (normalized >= cuspStart || normalized < cuspEnd) return i + 1;
    } else {
      if (normalized >= cuspStart && normalized < cuspEnd) return i + 1;
    }
  }
  return 1;
}

function buildComparison(
  tropical: SystemSnapshot,
  sidereal: SystemSnapshot
): ComparisonData {
  const tropicalCusps = tropical.houses?.cusps || [];
  const siderealCusps = sidereal.houses?.cusps || [];

  const planets: PlanetRow[] = [];
  for (const id of PLANET_ORDER) {
    const t = tropical.planets[id];
    const s = sidereal.planets[id];
    if (!t || !s) continue;

    const tHouse = getHouseFromLongitude(t.longitude, tropicalCusps);
    const sHouse = getHouseFromLongitude(s.longitude, siderealCusps);

    planets.push({
      id,
      name: PLANET_NAMES[id as keyof typeof PLANET_NAMES] || id,
      tropical: {
        sign: t.sign,
        degree: Math.floor(t.degreeInSign),
        house: tHouse,
      },
      sidereal: {
        sign: s.sign,
        degree: Math.floor(s.degreeInSign),
        house: sHouse,
      },
      changed: t.sign !== s.sign,
    });
  }

  // Tropical ASC / MC
  const tAscSign = getSignFromLongitude(toDegree(tropical.houses?.ascendant || 0), false);
  const tMcSign = getSignFromLongitude(toDegree(tropical.houses?.mc || 0), false);

  // Sidereal ASC / MC
  const sAscSign = getSignFromLongitude(toDegree(sidereal.houses?.ascendant || 0), false);
  const sMcSign = getSignFromLongitude(toDegree(sidereal.houses?.mc || 0), false);

  // Count elements
  const countElements = (plist: PlanetRow[], field: 'tropical' | 'sidereal') => {
    const counts: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0 };
    for (const p of plist) {
      const el = SIGN_ELEMENTS[p[field].sign] || 'fire';
      counts[el] = (counts[el] || 0) + 1;
    }
    return counts;
  };

  const tCounts = countElements(planets, 'tropical');
  const sCounts = countElements(planets, 'sidereal');
  const tDom = Object.entries(tCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'fire';
  const sDom = Object.entries(sCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'fire';

  // Calculate ayanamsa directly from the two snapshots.
  // The ayanamsa IS the difference between tropical and sidereal longitudes.
  // We use the Sun's position as the reference point.
  const tSunLon = tropical.planets.sun?.longitude ?? 0;
  const sSunLon = sidereal.planets.sun?.longitude ?? 0;
  let ayanamsa = ((tSunLon - sSunLon) % 360 + 360) % 360;
  // Sanity check: if somehow the difference is 0 (both systems returned same value),
  // fall back to the engine's ayanamsa calculator.
  if (ayanamsa < 0.1) {
    try { ayanamsa = calculateAyanamsa(tropical.julianDay); } catch { /* ignore */ }
  }
  // If still 0, use the mathematical approximation (~24° for year 2000 births)
  if (ayanamsa < 0.1) {
    const yearsSince2000 = (tropical.julianDay - 2451545.0) / 365.25;
    ayanamsa = 23.86 + yearsSince2000 * (50.29 / 3600);
  }

  return {
    planets,
    ascendant: {
      tropical: tAscSign,
      sidereal: sAscSign,
      changed: tAscSign !== sAscSign,
    },
    midheaven: {
      tropical: tMcSign,
      sidereal: sMcSign,
      changed: tMcSign !== sMcSign,
    },
    ayanamsa,
    dominantElement: { tropical: tDom, sidereal: sDom },
  };
}

function generateNarrative(data: ComparisonData, t: (key: string, options?: Record<string, any>) => string): string {
  const changedPlanets = data.planets.filter((p) => p.changed);
  const changedCount = changedPlanets.length;

  if (changedCount === 0) {
    return t('twoSelves.rareAlignment');
  }

  const sunChanged = changedPlanets.find((p) => p.id === 'sun');
  const moonChanged = changedPlanets.find((p) => p.id === 'moon');
  const ascChanged = data.ascendant.changed;
  const mcChanged = data.midheaven.changed;

  let narrative = '';

  if (sunChanged) {
    narrative += t('twoSelves.sunMoved', { tropical: capitalize(sunChanged.tropical.sign), sidereal: capitalize(sunChanged.sidereal.sign) }) + ' ';
    narrative += t('twoSelves.identityShift', { tropicalElement: elementPhrase(sunChanged.tropical.sign, t), siderealElement: elementPhrase(sunChanged.sidereal.sign, t) }) + ' ';
  }

  if (moonChanged) {
    narrative += t('twoSelves.moonMoved', { tropical: capitalize(moonChanged.tropical.sign), sidereal: capitalize(moonChanged.sidereal.sign) }) + ' ';
  }

  if (ascChanged) {
    narrative += t('twoSelves.ascendantShift', { tropical: capitalize(data.ascendant.tropical), sidereal: capitalize(data.ascendant.sidereal) }) + ' ';
  }

  if (mcChanged) {
    narrative += t('twoSelves.midheavenShift', { tropical: capitalize(data.midheaven.tropical), sidereal: capitalize(data.midheaven.sidereal) }) + ' ';
  }

  narrative += '\n\n' + t('twoSelves.totalChanged', { count: changedCount, total: data.planets.length }) + ' ';
  narrative += t('twoSelves.ayanamsa', { degrees: data.ayanamsa.toFixed(1) }) + ' ';
  narrative += t('twoSelves.notAnError');

  return narrative;
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function elementPhrase(sign: string, t: (key: string, options?: Record<string, any>) => string): string {
  const el = SIGN_ELEMENTS[sign];
  return t(`twoSelves.${el}`, { defaultValue: t('twoSelves.defaultElement') });
}

function getChangedPlanetList(planets: PlanetRow[], t: (key: string, options?: Record<string, any>) => string): string {
  const changed = planets.filter(p => p.changed);
  if (changed.length === 0) return t('twoSelves.none');
  return changed.map(p => `${capitalize(p.name)} → ${capitalize(p.sidereal.sign)}`).join(', ');
}

interface TwoSelvesModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthData: BirthData;
}

export const TwoSelvesModal: React.FC<TwoSelvesModalProps> = ({
  isOpen,
  onClose,
  birthData,
}) => {
  const { t } = useTranslation('celestial');
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setComparison(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      const tropical = generateSnapshot(birthData, 'tropical', 12);
      const sidereal = generateSnapshot(birthData, 'sidereal', 12);

      if (!tropical || !sidereal) {
        setError('Failed to calculate one or both zodiac systems. Please check your birth data.');
        setIsLoading(false);
        return;
      }

      setComparison(buildComparison(tropical, sidereal));
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, birthData]);

  const narrative = useMemo(() => {
    if (!comparison) return '';
    return generateNarrative(comparison, t);
  }, [comparison, t]);

  if (!isOpen) return null;

  return (
    <div className="tsm-overlay" onClick={onClose}>
      <div className="tsm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tsm-header">
          <div>
            <h2 className="tsm-title">{t('twoSelves.title')}</h2>
            <p className="tsm-subtitle">
              {t('twoSelves.subtitle')}
            </p>
          </div>
          <button className="tsm-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="tsm-loading">
            <div className="tsm-loading-icon">✦</div>
            <p>{t('twoSelves.calculating')}</p>
          </div>
        ) : error ? (
          <div className="tsm-error">
            <div className="tsm-error-icon">⚠️</div>
            <p>{t('twoSelves.error')}</p>
          </div>
        ) : comparison ? (
          <>
            {/* Comparison Grid */}
            <div className="tsm-comparison">
              {/* Tropical Column */}
              <div className="tsm-side tropical">
                <div className="tsm-side-header">
                  <span className="tsm-side-icon">🔄</span>
                  <span className="tsm-side-title">{t('twoSelves.civilSelf')}</span>
                  <span className="tsm-side-badge">{t('twoSelves.tropical')}</span>
                </div>
                <div className="tsm-side-sub">{t('twoSelves.whoYouLearned')}</div>

                <div className="tsm-planets">
                  {comparison.planets.map((p) => (
                    <div key={p.id} className="tsm-planet-row">
                      <span className="tsm-planet-symbol">
                        {PLANET_SYMBOLS[p.id] || '●'}
                      </span>
                      <span className="tsm-planet-name">{p.name}</span>
                      <span className="tsm-planet-sign">
                        {SIGN_SYMBOLS[p.tropical.sign as keyof typeof SIGN_SYMBOLS]}{' '}
                        {capitalize(p.tropical.sign.slice(0, 3))}
                      </span>
                      <span className="tsm-planet-degree">{p.tropical.degree}°</span>
                    </div>
                  ))}
                  <div className="tsm-planet-row accent">
                    <span className="tsm-planet-symbol">ASC</span>
                    <span className="tsm-planet-name">{t('twoSelves.ascendant')}</span>
                    <span className="tsm-planet-sign">
                      {SIGN_SYMBOLS[comparison.ascendant.tropical as keyof typeof SIGN_SYMBOLS] || '●'}{' '}
                      {capitalize(comparison.ascendant.tropical.slice(0, 3))}
                    </span>
                  </div>
                  <div className="tsm-planet-row accent">
                    <span className="tsm-planet-symbol">MC</span>
                    <span className="tsm-planet-name">{t('twoSelves.midheaven')}</span>
                    <span className="tsm-planet-sign">
                      {SIGN_SYMBOLS[comparison.midheaven.tropical as keyof typeof SIGN_SYMBOLS] || '●'}{' '}
                      {capitalize(comparison.midheaven.tropical.slice(0, 3))}
                    </span>
                  </div>
                </div>

                <div className="tsm-summary">
                  <span className="tsm-summary-label">{t('twoSelves.dominantElement')}</span>
                  <span className="tsm-summary-value">
                    {capitalize(comparison.dominantElement.tropical)}
                  </span>
                </div>
              </div>

              {/* Divider — now shows shifted planets */}
              <div className="tsm-divider">
                <div className="tsm-divider-top">
                  <span className="tsm-divider-vs">VS</span>
                  <span className="tsm-divider-shift">
                    {t('twoSelves.shiftedBy', { degrees: comparison.ayanamsa.toFixed(1) })}
                  </span>
                </div>
                <div className="tsm-divider-line" />
                <div className="tsm-divider-changed">
                  <div className="tsm-divider-changed-label">{t('twoSelves.changed')}</div>
                  <div className="tsm-divider-changed-list">
                    {getChangedPlanetList(comparison.planets, t)}
                  </div>
                </div>
              </div>

              {/* Sidereal Column */}
              <div className="tsm-side sidereal">
                <div className="tsm-side-header">
                  <span className="tsm-side-icon">☀️</span>
                  <span className="tsm-side-title">{t('twoSelves.trueSelf')}</span>
                  <span className="tsm-side-badge">{t('twoSelves.sidereal')}</span>
                </div>
                <div className="tsm-side-sub">{t('twoSelves.whoYouAre')}</div>

                <div className="tsm-planets">
                  {comparison.planets.map((p) => (
                    <div
                      key={p.id}
                      className={`tsm-planet-row ${p.changed ? 'changed' : ''}`}
                    >
                      <span className="tsm-planet-symbol">
                        {PLANET_SYMBOLS[p.id] || '●'}
                      </span>
                      <span className="tsm-planet-name">{p.name}</span>
                      <span className="tsm-planet-sign">
                        {SIGN_SYMBOLS[p.sidereal.sign as keyof typeof SIGN_SYMBOLS] || '●'}{' '}
                        {capitalize(p.sidereal.sign.slice(0, 3))}
                      </span>
                      <span className="tsm-planet-degree">{p.sidereal.degree}°</span>
                      {p.changed && <span className="tsm-change-badge">✦</span>}
                    </div>
                  ))}
                  <div
                    className={`tsm-planet-row accent ${comparison.ascendant.changed ? 'changed' : ''}`}
                  >
                    <span className="tsm-planet-symbol">ASC</span>
                    <span className="tsm-planet-name">Ascendant</span>
                    <span className="tsm-planet-sign">
                      {SIGN_SYMBOLS[comparison.ascendant.sidereal as keyof typeof SIGN_SYMBOLS] || '●'}{' '}
                      {capitalize(comparison.ascendant.sidereal.slice(0, 3))}
                    </span>
                    {comparison.ascendant.changed && (
                      <span className="tsm-change-badge">✦</span>
                    )}
                  </div>
                  <div
                    className={`tsm-planet-row accent ${comparison.midheaven.changed ? 'changed' : ''}`}
                  >
                    <span className="tsm-planet-symbol">MC</span>
                    <span className="tsm-planet-name">Midheaven</span>
                    <span className="tsm-planet-sign">
                      {SIGN_SYMBOLS[comparison.midheaven.sidereal as keyof typeof SIGN_SYMBOLS] || '●'}{' '}
                      {capitalize(comparison.midheaven.sidereal.slice(0, 3))}
                    </span>
                    {comparison.midheaven.changed && (
                      <span className="tsm-change-badge">✦</span>
                    )}
                  </div>
                </div>

                <div className="tsm-summary">
                  <span className="tsm-summary-label">Dominant Element</span>
                  <span className="tsm-summary-value">
                    {capitalize(comparison.dominantElement.sidereal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="tsm-narrative">
              <div className="tsm-narrative-icon">🌟</div>
              <div className="tsm-narrative-text">
                {narrative.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="tsm-footer">
              <button className="tsm-continue-btn" onClick={onClose}>
                Continue to True Mode
              </button>
              <p className="tsm-footer-hint">
                You can revisit this comparison anytime from the chart settings.
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TwoSelvesModal;
