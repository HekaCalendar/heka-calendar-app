/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PLANETARY COURT - The Royal Court of Your Celestial Kingdom
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Transforms planetary dignities into an immersive royal court experience.
 * Each planet has its place in your celestial kingdom - throned, exiled, or visiting.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { NatalChart, NatalPlanet } from '../../services/natal/natalChart';
import { getPlanetSignContent } from '../../content/planetaryMeanings';

interface PlanetaryCourtProps {
  chart: NatalChart;
  onPlanetClick?: (planetId: string, planet: NatalPlanet) => void;
}

interface CourtPlanet {
  id: string;
  planet: NatalPlanet;
  status: 'throned' | 'exalted' | 'neutral' | 'challenged' | 'exiled';
  title: string;
  description: string;
}

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '⛢', neptune: '♆', pluto: '♇',
  chiron: '⚷',
};

const PLANET_COLORS: Record<string, string> = {
  sun: '#fbbf24', moon: '#c4b5fd', mercury: '#94a3b8', venus: '#f472b6',
  mars: '#ef4444', jupiter: '#a78bfa', saturn: '#64748b', uranus: '#22d3ee',
  neptune: '#3b82f6', pluto: '#9333ea', chiron: '#22c55e',
};

const PLANET_NAMES: Record<string, string> = {
  sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
  chiron: 'Chiron',
};

const DIGNITY_TITLES: Record<string, Record<string, string>> = {
  domicile: {
    sun: 'The Sovereign',
    moon: 'The High Priestess',
    mercury: 'The Royal Scribe',
    venus: 'The Court Artisan',
    mars: 'The Knight Commander',
    jupiter: 'The Wise Chancellor',
    saturn: 'The Lord Steward',
  },
  exaltation: {
    sun: 'The Triumphant',
    moon: 'The Celebrated',
    mercury: 'The Acclaimed',
    venus: 'The Adored',
    mars: 'The Victorious',
    jupiter: 'The Magnificent',
    saturn: 'The Venerable',
  },
};

// Teaser lines for each section
const SECTION_TEASERS: Record<string, string[]> = {
  throned: [
    'Your natural gifts waiting to be claimed...',
    'Royal power flows through these placements',
    'Your chart\'s crown jewels of talent',
  ],
  assembly: [
    'Planets on their journey through your chart...',
    'Developing expressions of cosmic energy',
    'The working court of your personality',
  ],
  trials: [
    'Growth edges that forge your character...',
    'Challenges that become your greatest strengths',
    'The alchemy of transformation awaits',
  ],
};

export const PlanetaryCourt: React.FC<PlanetaryCourtProps> = ({
  chart,
  onPlanetClick,
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    throned: true,
    assembly: false,
    trials: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Organize planets by dignity status
  const organizeCourt = (): CourtPlanet[] => {
    const courtPlanets: CourtPlanet[] = [];
    
    Object.entries(chart.planets).forEach(([id, planet]) => {
      const content = getPlanetSignContent(id, planet.sign);
      let status: CourtPlanet['status'] = 'neutral';
      let title: string;
      let description: string;
      
      switch (planet.dignity) {
        case 'domicile':
          status = 'throned';
          title = DIGNITY_TITLES.domicile[id] || 'The Ruler';
          description = `Rules ${planet.sign} with natural authority`;
          break;
        case 'exaltation':
          status = 'exalted';
          title = DIGNITY_TITLES.exaltation[id] || 'The Exalted';
          description = `Honored and celebrated in ${planet.sign}`;
          break;
        case 'detriment':
          status = 'challenged';
          title = 'The Exile';
          description = `Operating outside comfort zone in ${planet.sign}`;
          break;
        case 'fall':
          status = 'exiled';
          title = 'The Fallen';
          description = `Learning through difficulty in ${planet.sign}`;
          break;
        default:
          title = content?.archetype || 'The Wanderer';
          description = `Journeying through ${planet.sign}`;
      }
      
      courtPlanets.push({ id, planet, status, title, description });
    });
    
    // Sort: throned/exalted first, then neutral, then challenged/exiled
    const statusOrder = { throned: 0, exalted: 1, neutral: 2, challenged: 3, exiled: 4 };
    return courtPlanets.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  };

  const courtPlanets = organizeCourt();
  
  const handlePlanetClick = (id: string, planet: NatalPlanet) => {
    onPlanetClick?.(id, planet);
  };

  // Get planets by section
  const thronedPlanets = courtPlanets.filter(p => p.status === 'throned' || p.status === 'exalted');
  const assemblyPlanets = courtPlanets.filter(p => p.status === 'neutral');
  const trialsPlanets = courtPlanets.filter(p => p.status === 'challenged' || p.status === 'exiled');

  // Get random teaser for section
  const getTeaser = (section: string) => {
    const teasers = SECTION_TEASERS[section] || ['Click to explore...'];
    return teasers[Math.floor(Math.random() * teasers.length)];
  };

  return (
    <div style={styles.container}>
      {/* Court Header */}
      <div style={styles.courtHeader}>
        <div style={styles.courtTitle}>⚜️ The Planetary Court ⚜️</div>
        <div style={styles.courtSubtitle}>
          Your celestial kingdom and its royal court
        </div>
      </div>

      {/* The Throne Room - Strong Dignities */}
      <CourtSection
        id="throned"
        title="The Throne Room"
        icon="👑"
        color="#fbbf24"
        count={thronedPlanets.length}
        teaser={getTeaser('throned')}
        isExpanded={expandedSections.throned}
        onToggle={() => toggleSection('throned')}
      >
        <div style={styles.throneGrid}>
          {thronedPlanets.map(courtPlanet => (
            <CourtCard
              key={courtPlanet.id}
              courtPlanet={courtPlanet}
              isHovered={hoveredPlanet === courtPlanet.id}
              onHover={() => setHoveredPlanet(courtPlanet.id)}
              onLeave={() => setHoveredPlanet(null)}
              onClick={() => handlePlanetClick(courtPlanet.id, courtPlanet.planet)}
            />
          ))}
        </div>
      </CourtSection>

      {/* The Assembly - Neutral */}
      <CourtSection
        id="assembly"
        title="The Assembly"
        icon="⚖️"
        color="#94a3b8"
        count={assemblyPlanets.length}
        teaser={getTeaser('assembly')}
        isExpanded={expandedSections.assembly}
        onToggle={() => toggleSection('assembly')}
      >
        <div style={styles.assemblyGrid}>
          {assemblyPlanets.map(courtPlanet => (
            <CourtCard
              key={courtPlanet.id}
              courtPlanet={courtPlanet}
              isHovered={hoveredPlanet === courtPlanet.id}
              onHover={() => setHoveredPlanet(courtPlanet.id)}
              onLeave={() => setHoveredPlanet(null)}
              onClick={() => handlePlanetClick(courtPlanet.id, courtPlanet.planet)}
              compact
            />
          ))}
        </div>
      </CourtSection>

      {/* The Trials - Challenged */}
      <CourtSection
        id="trials"
        title="The Trials"
        icon="⚔️"
        color="#ef4444"
        count={trialsPlanets.length}
        teaser={getTeaser('trials')}
        isExpanded={expandedSections.trials}
        onToggle={() => toggleSection('trials')}
      >
        <div style={styles.trialsGrid}>
          {trialsPlanets.map(courtPlanet => (
            <CourtCard
              key={courtPlanet.id}
              courtPlanet={courtPlanet}
              isHovered={hoveredPlanet === courtPlanet.id}
              onHover={() => setHoveredPlanet(courtPlanet.id)}
              onLeave={() => setHoveredPlanet(null)}
              onClick={() => handlePlanetClick(courtPlanet.id, courtPlanet.planet)}
            />
          ))}
        </div>
      </CourtSection>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendTitle}>Court Status Guide</div>
        <div style={styles.legendItems}>
          {[
            { icon: '👑', label: 'Throned', desc: 'Rulership - natural authority', color: '#fbbf24' },
            { icon: '🏆', label: 'Exalted', desc: 'Celebrated - peak expression', color: '#22c55e' },
            { icon: '⚖️', label: 'Neutral', desc: 'Standard expression', color: '#94a3b8' },
            { icon: '⚔️', label: 'Challenged', desc: 'Detriment - growth area', color: '#f97316' },
            { icon: '🗝️', label: 'Exiled', desc: 'Fall - deep lessons', color: '#ef4444' },
          ].map((item, i) => (
            <div key={i} style={styles.legendItem}>
              <span style={styles.legendIcon}>{item.icon}</span>
              <span style={{ ...styles.legendLabel, color: item.color }}>{item.label}</span>
              <span style={styles.legendDesc}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Collapsible Section Component
interface CourtSectionProps {
  id: string;
  title: string;
  icon: string;
  color: string;
  count: number;
  teaser: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CourtSection: React.FC<CourtSectionProps> = ({
  title,
  icon,
  color,
  count,
  teaser,
  isExpanded,
  onToggle,
  children,
}) => {
  return (
    <div 
      style={{
        ...styles.section,
        borderColor: isExpanded ? `${color}40` : 'rgba(255,255,255,0.05)',
        background: isExpanded 
          ? `linear-gradient(135deg, ${color}08 0%, transparent 100%)`
          : 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Section Header - Always Visible */}
      <div 
        style={styles.sectionHeader}
        onClick={onToggle}
      >
        <div style={styles.sectionHeaderLeft}>
          <span style={{ ...styles.sectionIconLarge, color }}>{icon}</span>
          <div>
            <div style={styles.sectionTitleRow}>
              <span style={styles.sectionTitleText}>{title}</span>
              <span style={{ ...styles.sectionCount, background: `${color}20`, color }}>
                {count}
              </span>
            </div>
            {!isExpanded && (
              <div style={styles.sectionTeaser}>{teaser}</div>
            )}
          </div>
        </div>
        <div style={{ ...styles.expandIcon, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </div>
      </div>

      {/* Expandable Content */}
      <div style={{
        ...styles.sectionContent,
        maxHeight: isExpanded ? '2000px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: isExpanded ? 'visible' : 'hidden',
      }}>
        {isExpanded && children}
      </div>
    </div>
  );
};

// Individual Court Card Component
interface CourtCardProps {
  courtPlanet: CourtPlanet;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  compact?: boolean;
}

const CourtCard: React.FC<CourtCardProps> = ({
  courtPlanet,
  isHovered,
  onHover,
  onLeave,
  onClick,
  compact,
}) => {
  const { id, planet, status, title, description } = courtPlanet;
  const color = PLANET_COLORS[id] || '#fbbf24';
  const statusColor = status === 'throned' ? '#fbbf24' : 
                      status === 'exalted' ? '#22c55e' :
                      status === 'challenged' ? '#f97316' :
                      status === 'exiled' ? '#ef4444' : '#94a3b8';
  
  const statusIcon = status === 'throned' ? '👑' : 
                     status === 'exalted' ? '🏆' :
                     status === 'challenged' ? '⚔️' :
                     status === 'exiled' ? '🗝️' : '⚖️';

  return (
    <div
      style={{
        ...styles.card,
        ...(compact && styles.cardCompact),
        ...(isHovered && styles.cardHovered),
        borderColor: isHovered ? statusColor : `${statusColor}30`,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Status Badge */}
      <div style={{ ...styles.statusBadge, background: `${statusColor}20`, color: statusColor }}>
        {statusIcon}
      </div>

      {/* Planet Symbol */}
      <div style={{ ...styles.planetSymbol, color, fontSize: compact ? '28px' : '36px' }}>
        {PLANET_SYMBOLS[id]}
      </div>

      {/* Content */}
      <div style={styles.cardContent}>
        <div style={styles.planetName}>{PLANET_NAMES[id]}</div>
        <div style={{ ...styles.planetTitle, color: statusColor }}>{title}</div>
        <div style={styles.planetSign}>
          {planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)} • House {planet.house}
        </div>
        {!compact && (
          <div style={styles.planetDescription}>{description}</div>
        )}
      </div>

      {/* Hover Hint */}
      {isHovered && (
        <div style={styles.clickHint}>
          Click to explore →
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px',
  },
  courtHeader: {
    textAlign: 'center',
    marginBottom: '32px',
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  courtTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '8px',
  },
  courtSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  section: {
    marginBottom: '20px',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '4px',
  },
  sectionHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
  },
  sectionIconLarge: {
    fontSize: '32px',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
  },
  sectionTitleText: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#fff',
  },
  sectionCount: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  },
  sectionTeaser: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontStyle: 'italic',
  },
  expandIcon: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.4)',
    transition: 'transform 0.3s ease',
    padding: '8px',
  },
  sectionContent: {
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: '20px',
  },
  throneGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  assemblyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  trialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    position: 'relative',
    padding: '20px',
    background: 'rgba(20, 20, 40, 0.6)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  cardCompact: {
    padding: '16px',
  },
  cardHovered: {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  planetSymbol: {
    marginBottom: '12px',
  },
  cardContent: {
    width: '100%',
  },
  planetName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
  },
  planetTitle: {
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '4px',
  },
  planetSign: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '8px',
    textTransform: 'capitalize',
  },
  planetDescription: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.5,
  },
  clickHint: {
    marginTop: '12px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  legend: {
    marginTop: '32px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  legendTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '12px',
  },
  legendItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
  },
  legendIcon: {
    fontSize: '16px',
  },
  legendLabel: {
    fontWeight: 500,
  },
  legendDesc: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
};

export default PlanetaryCourt;
