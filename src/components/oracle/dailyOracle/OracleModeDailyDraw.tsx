/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║              DAILY ORACLE — MAIN DRAW INTERFACE                           ║
 * ║                                                                           ║
 * ║  Replaces the old Celestial tab. One card per day. Sacred ritual.         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { OracleCardArtwork } from './OracleCardArtwork';
import { OracleCardArchive } from './OracleCardArchive';
import type { DailyOracleCard, CelestialSnapshot, ZodiacOptions } from './cardEngine';
import { generateCard, getTodayKey } from './cardEngine';
import { getArchetypeById } from './archetypes';
import { dbGetTodaysCard, dbSaveCard } from './cardDatabase';
import { getCurrentPlanetaryPositions } from '../../../oracle/birthChartIntegration';
import type { BirthChartData } from '../types';

interface OracleModeDailyDrawProps {
  onJournalPrompt: (prompt: string) => void;
  birthChartData?: BirthChartData | null;
}

export const OracleModeDailyDraw: React.FC<OracleModeDailyDrawProps> = ({
  onJournalPrompt,
  birthChartData,
}) => {
  const { t } = useTranslation('journal');
  const [card, setCard] = useState<DailyOracleCard | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showArchive, setShowArchive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayKey = getTodayKey();

  // Read user's astrology preferences from Redux
  const astroPreferences = useSelector((state: RootState) => state.calendar.astroPreferences);
  const zodiacOptions: ZodiacOptions = {
    zodiacFrame: astroPreferences.zodiacFrame,
    signCount: astroPreferences.signCount,
  };

  const loadOrGenerateCard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if today's card already exists
      const existing = await dbGetTodaysCard();
      if (existing && existing.date === todayKey) {
        setCard(existing);
        setIsRevealed(existing.isRevealed);
        setIsLoading(false);
        return;
      }

      // Generate new celestial snapshot respecting user's zodiac preferences
      const snapshot = await buildCelestialSnapshot(zodiacOptions);
      const newCard = generateCard(todayKey, snapshot, birthChartData, zodiacOptions);

      await dbSaveCard(newCard);
      setCard(newCard);
      setIsRevealed(false);
    } catch (e) {
      setError(t('dailyOracle.loadError', 'Could not connect to the celestial field'));
      console.error('[DailyOracle] Failed to generate card:', e);
    } finally {
      setIsLoading(false);
    }
  }, [todayKey, birthChartData, zodiacOptions, t]);

  useEffect(() => {
    loadOrGenerateCard();
  }, [loadOrGenerateCard]);

  const handleReveal = useCallback(async () => {
    if (!card) return;
    setIsRevealed(true);
    const updated = { ...card, isRevealed: true };
    setCard(updated);
    await dbSaveCard(updated);
  }, [card]);

  const handleJournal = useCallback(() => {
    if (!card) return;
    const prompt = card.journalPrompt;
    onJournalPrompt(prompt);
  }, [card, onJournalPrompt]);

  if (showArchive) {
    return (
      <OracleCardArchive
        onClose={() => setShowArchive(false)}
        onSelectCard={(c) => {
          setCard(c);
          setIsRevealed(c.isRevealed);
          setShowArchive(false);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="oracle-mode-daily-draw">
        <div className="daily-draw-loading">
          <div className="loading-orb">
            <div className="orb-ring" />
            <div className="orb-core">✨</div>
          </div>
          <p>{t('dailyOracle.consultingOracle')}</p>
          <p className="loading-sub">{t('dailyOracle.shufflingTheEthers')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oracle-mode-daily-draw">
        <div className="daily-draw-error">
          <span className="error-icon">🌑</span>
          <p>{error}</p>
          <button className="btn-retry" onClick={loadOrGenerateCard}>
            {t('dailyOracle.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  const archetype = getArchetypeById(card.archetypeId);
  if (!archetype) return null;

  return (
    <div className="oracle-mode-daily-draw">
      {/* Header */}
      <div className="daily-draw-header">
        <span className="daily-draw-date">{todayKey}</span>
        <button className="archive-btn" onClick={() => setShowArchive(true)}>
          📜 {t('dailyOracle.archive')}
        </button>
      </div>

      {/* Card Stage */}
      <div className={`card-stage ${isRevealed ? 'revealed' : ''}`}>
        <div className="card-container">
          <OracleCardArtwork
            archetype={archetype}
            seed={card.artworkSeed}
            size={280}
            revealed={isRevealed}
          />

          {!isRevealed && (
            <div className="card-overlay">
              <button className="reveal-btn" onClick={handleReveal}>
                <span className="reveal-icon">✦</span>
                <span className="reveal-text">{t('dailyOracle.revealCard')}</span>
                <span className="reveal-hint">{t('dailyOracle.oneDrawPerDay')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Card Title */}
        {isRevealed && (
          <div className="card-title-block">
            <span className="card-number">{String(card.archetypeNumber).padStart(2, '0')}</span>
            <h2 className="card-title">{card.title}</h2>
            <div className="card-meta">
              <span className="card-symbol">{card.symbol}</span>
              <span className="card-keywords">{card.keywords.join(' · ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      {isRevealed && (
        <div className="card-content">
          {/* Cosmic Context */}
          <div className="cosmic-context-bar">
            <span className="context-icon">🌌</span>
            <span className="context-text">{card.cosmicContext}</span>
          </div>

          {/* Main Insight */}
          <div className="insight-panel">
            <h3>{t('dailyOracle.theMessage')}</h3>
            <p className="insight-text">{card.insight}</p>
          </div>

          {/* Shadow */}
          <div className="shadow-panel">
            <h3>{t('dailyOracle.theShadow')}</h3>
            <p className="shadow-text">{card.shadow}</p>
          </div>

          {/* Invitation */}
          <div className="invitation-panel">
            <h3>{t('dailyOracle.theInvitation')}</h3>
            <p className="invitation-text">{card.invitation}</p>
          </div>

          {/* Birth Chart Note */}
          {card.birthChartNote && (
            <div className="birthchart-panel">
              <span className="bc-icon">✦</span>
              <p>{card.birthChartNote}</p>
            </div>
          )}

          {/* Affirmation */}
          <div className="affirmation-panel">
            <blockquote>"{card.affirmation}"</blockquote>
          </div>

          {/* Journal CTA */}
          <div className="journal-cta">
            <p className="prompt-preview">{card.journalPrompt}</p>
            <button className="btn-journal" onClick={handleJournal}>
              <span>✍️</span>
              <span>{t('dailyOracle.journalAboutThis')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Celestial Snapshot Builder ──────────────────────────────────────────────

async function buildCelestialSnapshot(zodiacOptions?: ZodiacOptions): Promise<CelestialSnapshot> {
  try {
    const positions = await getCurrentPlanetaryPositions(new Date(), zodiacOptions);

    // Moon phase from sun-moon angle
    const sun = positions.Sun || positions.sun;
    const moon = positions.Moon || positions.moon;
    let phase = 'new';
    let illumination = 0;

    if (sun && moon) {
      const angle = Math.abs(moon.longitude - sun.longitude);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;
      illumination = Math.round((1 - Math.cos((normalizedAngle * Math.PI) / 180)) / 2 * 100);

      if (normalizedAngle < 45) phase = 'new';
      else if (normalizedAngle < 90) phase = 'waxing_crescent';
      else if (normalizedAngle < 135) phase = 'first_quarter';
      else if (normalizedAngle < 180) phase = 'waxing_gibbous';
      else if (normalizedAngle < 225) phase = 'full';
      else if (normalizedAngle < 270) phase = 'waning_gibbous';
      else if (normalizedAngle < 315) phase = 'last_quarter';
      else phase = 'waning_crescent';
    }

    // Retrogrades
    const retrogrades = Object.entries(positions)
      .filter(([_, p]: [string, any]) => p.retrograde)
      .map(([name]) => name);

    // Dominant element
    const elements: Record<string, number> = { fire: 0, water: 0, air: 0, earth: 0 };
    const signElements: Record<string, string> = {
      aries: 'fire', leo: 'fire', sagittarius: 'fire',
      taurus: 'earth', virgo: 'earth', capricorn: 'earth',
      gemini: 'air', libra: 'air', aquarius: 'air',
      cancer: 'water', scorpio: 'water', pisces: 'water',
      // 13-sign support: Ophiuchus maps to water (intuitive/healing)
      ophiuchus: 'water',
    };
    Object.values(positions).forEach((p: any) => {
      const el = signElements[p.sign?.toLowerCase()];
      if (el) elements[el]++;
    });
    const dominantElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
      moonPhase: {
        phase,
        sign: moon?.sign || 'Aries',
        illumination,
      },
      retrogrades,
      dominantElement,
    };
  } catch (e) {
    console.error('[DailyOracle] Failed to build celestial snapshot:', e);
    return {
      moonPhase: { phase: 'new', sign: 'Aries', illumination: 0 },
      retrogrades: [],
    };
  }
}
