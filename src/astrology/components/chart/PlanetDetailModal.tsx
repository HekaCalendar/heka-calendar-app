/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PLANET DETAIL MODAL - The Celestial Codex Interactive Experience
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Rich, immersive modal that transforms planetary data into soul-level understanding.
 * Not just information - transformation.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { NatalPlanet } from '../../services/natal/natalChart';
import { getPlanetSignContent } from '../../content/planetaryMeanings';

interface PlanetDetailModalProps {
  planetId: string;
  planet: NatalPlanet;
  isOpen: boolean;
  onClose: () => void;
}

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '⛢', neptune: '♆', pluto: '♇',
  chiron: '⚷', node: '☊',
};

const PLANET_COLORS: Record<string, string> = {
  sun: '#fbbf24', moon: '#c4b5fd', mercury: '#94a3b8', venus: '#f472b6',
  mars: '#ef4444', jupiter: '#a78bfa', saturn: '#64748b', uranus: '#22d3ee',
  neptune: '#3b82f6', pluto: '#9333ea', chiron: '#22c55e', node: '#f59e0b',
};

const PLANET_NAMES: Record<string, string> = {
  sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
  chiron: 'Chiron', node: 'North Node',
};

const SIGN_SYMBOLS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

type TabType = 'essence' | 'shadow' | 'growth' | 'famous';

export const PlanetDetailModal: React.FC<PlanetDetailModalProps> = ({
  planetId,
  planet,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('essence');
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  
  const content = getPlanetSignContent(planetId, planet.sign);
  const planetColor = PLANET_COLORS[planetId] || '#fbbf24';
  const planetSymbol = PLANET_SYMBOLS[planetId] || '●';
  const signSymbol = SIGN_SYMBOLS[planet.sign] || '';
  
  if (!isOpen) return null;
  
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(index);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={{ ...styles.planetIcon, color: planetColor }}>
            {planetSymbol}
          </div>
          <div style={styles.headerText}>
            <h2 style={styles.title}>
              {PLANET_NAMES[planetId] || planetId} in {planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)}
            </h2>
            <p style={styles.subtitle}>
              {signSymbol} House {planet.house} • {planet.dignity}
            </p>
          </div>
        </div>
        
        {/* Archetype Card */}
        {content && (
          <div style={{ ...styles.archetypeCard, borderColor: planetColor + '40' }}>
            <div style={styles.archetypeLabel}>The Archetype</div>
            <div style={{ ...styles.archetypeName, color: planetColor }}>
              {content.archetype}
            </div>
            <div style={styles.tagline}>"{content.tagline}"</div>
          </div>
        )}
        
        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { id: 'essence', label: '💫 Essence', icon: '✨' },
            { id: 'shadow', label: '🌑 Shadow', icon: '🌑' },
            { id: 'growth', label: '🌱 Growth', icon: '🌱' },
            { id: 'famous', label: '⭐ Famous', icon: '⭐' },
          ].map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id && { ...styles.tabActive, background: planetColor + '20', color: planetColor }),
              }}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div style={styles.content}>
          {!content ? (
            <div style={styles.fallback}>
              <p>🌙 Deep wisdom for {planetId} in {planet.sign} is being channeled...</p>
              <p style={styles.fallbackSub}>
                {planetId.charAt(0).toUpperCase() + planetId.slice(1)} in {planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)}, House {planet.house}
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'essence' && (
                <div style={styles.tabPanel}>
                  <h3 style={{ ...styles.sectionTitle, color: planetColor }}>
                    Your Core Expression
                  </h3>
                  <ul style={styles.essenceList}>
                    {content.essence.map((item, i) => (
                      <li key={i} style={styles.essenceItem}>{item}</li>
                    ))}
                  </ul>
                  
                  <div style={styles.realWorldSection}>
                    <h4 style={styles.subSectionTitle}>In Daily Life</h4>
                    <div style={styles.strengthsGrid}>
                      {content.realWorld.strengths.slice(0, 3).map((strength, i) => (
                        <div key={i} style={{ ...styles.strengthBadge, background: planetColor + '15', color: planetColor }}>
                          ✦ {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={styles.journalSection}>
                    <h4 style={styles.subSectionTitle}>💭 Reflection Prompts</h4>
                    {content.journalPrompts.slice(0, 2).map((prompt, i) => (
                      <div 
                        key={i} 
                        style={styles.promptCard}
                        onClick={() => copyToClipboard(prompt, i)}
                      >
                        <span>{prompt}</span>
                        <span style={styles.copyHint}>
                          {copiedPrompt === i ? '✓ Copied!' : '📋 Copy'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'shadow' && (
                <div style={styles.tabPanel}>
                  <div style={{ ...styles.shadowBox, borderColor: planetColor + '30' }}>
                    <h3 style={{ ...styles.shadowTitle, color: '#ef4444' }}>
                      🌑 The Shadow Side
                    </h3>
                    <p style={styles.shadowText}>{content.shadow.description}</p>
                  </div>
                  
                  <div style={styles.triggersSection}>
                    <h4 style={styles.subSectionTitle}>Common Triggers</h4>
                    <div style={styles.triggersList}>
                      {content.shadow.triggers.map((trigger, i) => (
                        <span key={i} style={styles.triggerTag}>• {trigger}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={styles.affirmationBox}>
                    <h4 style={styles.subSectionTitle}>🙏 Daily Affirmation</h4>
                    <p style={styles.affirmationText}>"{content.shadow.affirmation}"</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'growth' && (
                <div style={styles.tabPanel}>
                  <div style={styles.growthPath}>
                    <h3 style={{ ...styles.sectionTitle, color: planetColor }}>
                      🌱 Your Growth Path
                    </h3>
                    <p style={styles.growthText}>{content.shadow.growthPath}</p>
                  </div>
                  
                  <div style={styles.practicesSection}>
                    <h4 style={styles.subSectionTitle}>Practical Exercises</h4>
                    {content.practices.slice(0, 3).map((practice, i) => (
                      <div key={i} style={styles.practiceItem}>
                        <span style={{ ...styles.practiceNumber, background: planetColor + '20', color: planetColor }}>
                          {i + 1}
                        </span>
                        <span>{practice}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={styles.careersSection}>
                    <h4 style={styles.subSectionTitle}>Aligned Career Paths</h4>
                    <div style={styles.careersList}>
                      {content.realWorld.careers.slice(0, 4).map((career, i) => (
                        <span key={i} style={styles.careerTag}>{career}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'famous' && (
                <div style={styles.tabPanel}>
                  <h3 style={{ ...styles.sectionTitle, color: planetColor }}>
                    ⭐ You Share This With
                  </h3>
                  <p style={styles.famousIntro}>
                    Your {planetId} in {planet.sign} connects you to these influential figures:
                  </p>
                  <div style={styles.famousGrid}>
                    {content.famousExamples.map((person, i) => (
                      <div key={i} style={styles.famousCard}>
                        <div style={{ ...styles.famousAvatar, background: planetColor + '20', color: planetColor }}>
                          {person.name.charAt(0)}
                        </div>
                        <div style={styles.famousInfo}>
                          <div style={styles.famousName}>{person.name}</div>
                          <div style={styles.famousNote}>{person.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>
            {planetId.charAt(0).toUpperCase() + planetId.slice(1)} at {Math.floor(planet.longitude % 30)}° {planet.sign}
            {planet.isRetrograde && ' ℞'}
          </span>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '20px',
  },
  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 100px rgba(0, 0, 0, 0.8)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    zIndex: 10,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '24px 24px 0',
  },
  planetIcon: {
    fontSize: '48px',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'capitalize',
  },
  archetypeCard: {
    margin: '16px 24px',
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderLeftWidth: '4px',
  },
  archetypeLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '4px',
  },
  archetypeName: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  tagline: {
    fontSize: '14px',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    padding: '0 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  tab: {
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    borderBottomColor: 'currentColor',
    fontWeight: 500,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 24px',
  },
  tabPanel: {
    animation: 'fadeIn 0.3s ease',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '16px',
    marginTop: 0,
  },
  subSectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '12px',
    marginTop: '20px',
  },
  essenceList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  essenceItem: {
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 1.6,
    position: 'relative',
    paddingLeft: '24px',
  },
  realWorldSection: {
    marginTop: '24px',
  },
  strengthsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  strengthBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
  },
  journalSection: {
    marginTop: '24px',
  },
  promptCard: {
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  copyHint: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  shadowBox: {
    padding: '16px',
    background: 'rgba(239, 68, 68, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  shadowTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginTop: 0,
    marginBottom: '8px',
  },
  shadowText: {
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 1.6,
    margin: 0,
  },
  triggersSection: {
    marginTop: '20px',
  },
  triggersList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  triggerTag: {
    padding: '6px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  affirmationBox: {
    marginTop: '20px',
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(147, 51, 234, 0.2)',
  },
  affirmationText: {
    fontSize: '16px',
    fontStyle: 'italic',
    color: '#e9d5ff',
    margin: 0,
    lineHeight: 1.5,
  },
  growthPath: {
    marginBottom: '20px',
  },
  growthText: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.7,
    fontSize: '15px',
  },
  practicesSection: {
    marginTop: '20px',
  },
  practiceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  practiceNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    flexShrink: 0,
  },
  careersSection: {
    marginTop: '20px',
  },
  careersList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  careerTag: {
    padding: '6px 12px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  famousIntro: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '16px',
  },
  famousGrid: {
    display: 'grid',
    gap: '12px',
  },
  famousCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
  },
  famousAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 600,
  },
  famousInfo: {
    flex: 1,
  },
  famousName: {
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '2px',
  },
  famousNote: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  fallback: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  fallbackSub: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '8px',
  },
  footer: {
    padding: '12px 24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
};

export default PlanetDetailModal;
