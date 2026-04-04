/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE MOON'S JOURNEY - Educational Path Through Understanding
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This is where users learn. Not through bullet points, but through story.
 * The Moon's path as a journey through a palace of twelve rooms.
 * Aspects as conversations between celestial beings.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { 
  moonTeachings, 
  moonJourneyContent,
  aspectConversations,
  planetaryVoices,
  signEssences,
  AspectConversation,
  PlanetaryVoice,
} from '../content/voidNarratives';
import { getZodiacSystemPreference } from '../../../services/natal/zodiacHelpers';

interface MoonsJourneyProps {
  className?: string;
}

type ViewMode = 'overview' | 'aspects' | 'planets' | 'signs';

export const MoonsJourney: React.FC<MoonsJourneyProps> = ({ className = '' }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [zodiacKey, setZodiacKey] = useState(() => getZodiacSystemPreference());
  
  // Update zodiac key when system changes
  useEffect(() => {
    const check = () => {
      const current = getZodiacSystemPreference();
      if (current !== zodiacKey) setZodiacKey(current);
    };
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [zodiacKey]);
  
  return (
    <div className={`moons-journey ${className}`} style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 300,
            margin: '0 0 12px 0',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {moonJourneyContent.title}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: 500,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Understanding the Moon's role and why her silence matters.
        </p>
      </div>
      
      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}
      >
        {(['overview', 'aspects', 'planets', 'signs'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setViewMode(mode);
              setSelectedAspect(null);
              setSelectedPlanet(null);
            }}
            style={{
              padding: '10px 20px',
              background: viewMode === mode ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${viewMode === mode ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 20,
              color: viewMode === mode ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {mode}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}>
        {viewMode === 'overview' && <OverviewView />}
        {viewMode === 'aspects' && (
          <AspectsView 
            selectedAspect={selectedAspect} 
            onSelectAspect={setSelectedAspect} 
          />
        )}
        {viewMode === 'planets' && (
          <PlanetsView
            selectedPlanet={selectedPlanet}
            onSelectPlanet={setSelectedPlanet}
          />
        )}
        {viewMode === 'signs' && <SignsView key={zodiacKey} />}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const overviewCards = [
  {
    id: 'messenger',
    title: moonTeachings.title,
    shortText: 'The Moon is the fastest traveler in the zodiac...',
    fullText: moonTeachings.essence,
    color: '#60a5fa', // Blue
    icon: '☽',
  },
  {
    id: 'palace',
    title: 'The Zodiac Palace',
    shortText: 'Imagine the zodiac as a grand palace with twelve rooms...',
    fullText: moonJourneyContent.introduction,
    color: '#a78bfa', // Purple
    icon: '✦',
  },
  {
    id: 'wisdom',
    title: moonTeachings.theWisdom.title,
    shortText: 'Traditional astrology understood something our productivity culture has forgotten...',
    fullText: moonTeachings.theWisdom.content,
    color: '#f472b6', // Pink
    icon: '◈',
  },
];

const OverviewView: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {overviewCards.map((card) => {
        const isExpanded = expandedCard === card.id;
        return (
          <button
            key={card.id}
            onClick={() => setExpandedCard(isExpanded ? null : card.id)}
            style={{
              padding: '24px',
              background: isExpanded 
                ? `linear-gradient(135deg, ${card.color}20, ${card.color}05)`
                : `linear-gradient(135deg, ${card.color}15, ${card.color}03)`,
              borderRadius: 16,
              border: `1px solid ${isExpanded ? card.color + '50' : card.color + '30'}`,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Selection indicator */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 4,
                height: '100%',
                background: card.color,
                opacity: isExpanded ? 1 : 0.5,
                transition: 'opacity 0.3s ease',
              }}
            />
            
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: isExpanded ? 16 : 0,
              }}
            >
              <span style={{ fontSize: 24, color: card.color }}>{card.icon}</span>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  margin: 0,
                  color: 'rgba(255,255,255,0.95)',
                  flex: 1,
                }}
              >
                {card.title}
              </h3>
              <span
                style={{
                  fontSize: 12,
                  color: card.color,
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                ▼
              </span>
            </div>
            
            {/* Content */}
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.75)',
                margin: 0,
                marginLeft: 36,
                whiteSpace: 'pre-line',
                maxHeight: isExpanded ? '1000px' : '3em',
                overflow: 'hidden',
                transition: 'max-height 0.5s ease',
              }}
            >
              {isExpanded ? card.fullText : card.shortText}
            </p>
            
            {!isExpanded && (
              <div
                style={{
                  fontSize: 12,
                  color: card.color,
                  marginTop: 12,
                  marginLeft: 36,
                }}
              >
                Tap to expand...
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASPECTS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const AspectsView: React.FC<{
  selectedAspect: string | null;
  onSelectAspect: (aspect: string | null) => void;
}> = ({ selectedAspect, onSelectAspect }) => {
  const aspects = Object.entries(aspectConversations);
  
  return (
    <div>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.6)',
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        Aspects are the geometry of relationship. Each angle creates a different quality of dialogue between the Moon and the planets.
      </p>
      
      {selectedAspect ? (
        <AspectDetail 
          aspect={aspectConversations[selectedAspect]}
          onBack={() => onSelectAspect(null)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {aspects.map(([key, aspect]) => (
            <button
              key={key}
              onClick={() => onSelectAspect(key)}
              style={{
                padding: '20px 24px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {aspect.aspect}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  {aspect.angle}°
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6,
                }}
              >
                {aspect.nature}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AspectDetail: React.FC<{ aspect: AspectConversation; onBack: () => void }> = ({ 
  aspect, 
  onBack 
}) => (
  <div>
    <button
      onClick={onBack}
      style={{
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 20,
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        cursor: 'pointer',
        marginBottom: 24,
      }}
    >
      ← Back to aspects
    </button>
    
    <div
      style={{
        padding: '28px',
        background: 'rgba(0,0,0,0.25)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 22, color: 'rgba(255,255,255,0.9)' }}>
          {aspect.aspect}
        </h3>
        <span
          style={{
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {aspect.angle}°
        </span>
      </div>
      
      <blockquote
        style={{
          margin: '0 0 24px 0',
          padding: '20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 8,
          borderLeft: '3px solid rgba(255,255,255,0.3)',
          fontSize: 15,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.85)',
          fontStyle: 'italic',
        }}
      >
        "{aspect.dialogue}"
      </blockquote>
      
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 8,
          }}
        >
          The Moon's Experience
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {aspect.lunarExperience}
        </p>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 8,
          }}
        >
          In the Void That Follows
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {aspect.voidQuality}
        </p>
      </div>
      
      <div
        style={{
          padding: '16px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 8,
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
          fontStyle: 'italic',
        }}
      >
        Like {aspect.image}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PLANETS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const PlanetsView: React.FC<{
  selectedPlanet: string | null;
  onSelectPlanet: (planet: string | null) => void;
}> = ({ selectedPlanet, onSelectPlanet }) => {
  const planets = Object.entries(planetaryVoices);
  
  return (
    <div>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.6)',
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        Each planet speaks with a unique voice. When the Moon aspects them, she receives their gifts and carries their lessons.
      </p>
      
      {selectedPlanet ? (
        <PlanetDetail
          planet={planetaryVoices[selectedPlanet]}
          onBack={() => onSelectPlanet(null)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {planets.map(([key, planet]) => (
            <button
              key={key}
              onClick={() => onSelectPlanet(key)}
              style={{
                padding: '20px 12px',
                background: 'rgba(0,0,0,0.2)',
                border: `1px solid ${planet.color}30`,
                borderRadius: 12,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  color: planet.color,
                  marginBottom: 8,
                }}
              >
                {planet.symbol}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {planet.planet}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PlanetDetail: React.FC<{ planet: PlanetaryVoice; onBack: () => void }> = ({
  planet,
  onBack,
}) => (
  <div>
    <button
      onClick={onBack}
      style={{
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 20,
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        cursor: 'pointer',
        marginBottom: 24,
      }}
    >
      ← Back to planets
    </button>
    
    <div
      style={{
        padding: '28px',
        background: `linear-gradient(135deg, ${planet.color}15, rgba(0,0,0,0.25))`,
        borderRadius: 16,
        border: `1px solid ${planet.color}30`,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            fontSize: 48,
            color: planet.color,
            marginBottom: 8,
            textShadow: `0 0 30px ${planet.color}50`,
          }}
        >
          {planet.symbol}
        </div>
        <h3 style={{ margin: 0, fontSize: 24, color: 'rgba(255,255,255,0.9)' }}>
          {planet.planet}
        </h3>
        <p
          style={{
            margin: '8px 0 0 0',
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'capitalize',
          }}
        >
          {planet.element} • {planet.essence}
        </p>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 8,
          }}
        >
          How They Speak
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          {planet.conversationStyle}
        </p>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 8,
          }}
        >
          Gift to the Moon
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          {planet.giftToMoon}
        </p>
      </div>
      
      <div>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 8,
          }}
        >
          Shadow Teaching
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          {planet.shadowTeaching}
        </p>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const SignsView: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [use13Signs, setUse13Signs] = useState(() => getZodiacSystemPreference() === '13-sign');
  
  // Listen for zodiac system changes
  useEffect(() => {
    const checkZodiacSystem = () => {
      const is13Sign = getZodiacSystemPreference() === '13-sign';
      if (is13Sign !== use13Signs) {
        setUse13Signs(is13Sign);
      }
    };
    
    // Check immediately and periodically
    checkZodiacSystem();
    const interval = setInterval(checkZodiacSystem, 1000);
    
    return () => clearInterval(interval);
  }, [use13Signs]);
  
  
  const elements = {
    fire: { color: '#ef4444', label: 'Fire' },
    earth: { color: '#22c55e', label: 'Earth' },
    air: { color: '#3b82f6', label: 'Air' },
    water: { color: '#06b6d4', label: 'Water' },
  };
  
  // Filter signEssences based on zodiac system
  const filteredSignEssences = Object.entries(signEssences).filter(([key]) => {
    if (use13Signs) return true; // Show all 13 signs
    return key !== 'ophiuchus'; // Hide Ophiuchus in 12-sign mode
  });
  
  if (selectedSign) {
    return (
      <SignDetail 
        sign={signEssences[selectedSign]} 
        onBack={() => setSelectedSign(null)} 
      />
    );
  }
  
  return (
    <div>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.6)',
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        Tap a sign to explore its essence. Each of the {use13Signs ? 'thirteen' : 'twelve'} rooms holds unique wisdom.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(Object.keys(elements) as Array<keyof typeof elements>).map((element) => (
          <div key={element}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: elements[element].color,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: elements[element].color,
                }}
              >
                {elements[element].label}
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: '100%' }}>
              {filteredSignEssences
                .filter(([, sign]) => sign.element === element)
                .map(([key, sign]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSign(key)}
                    style={{
                      padding: '16px 12px',
                      background: 'rgba(0,0,0,0.2)',
                      border: `1px solid ${sign.color}40`,
                      borderRadius: 10,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 24,
                        color: sign.color,
                        marginBottom: 4,
                        textShadow: `0 0 20px ${sign.color}50`,
                      }}
                    >
                      {sign.symbol}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: 4,
                      }}
                    >
                      {sign.sign}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: 'rgba(255,255,255,0.4)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {sign.modality}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sign Detail View
const SignDetail: React.FC<{ 
  sign: typeof signEssences[keyof typeof signEssences]; 
  onBack: () => void;
}> = ({ sign, onBack }) => (
  <div>
    <button
      onClick={onBack}
      style={{
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 20,
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        cursor: 'pointer',
        marginBottom: 24,
      }}
    >
      ← Back to Signs
    </button>
    
    <div
      style={{
        padding: '28px',
        background: `linear-gradient(135deg, ${sign.color}15, rgba(0,0,0,0.25))`,
        borderRadius: 16,
        border: `1px solid ${sign.color}30`,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            fontSize: 56,
            color: sign.color,
            marginBottom: 8,
            textShadow: `0 0 40px ${sign.color}50`,
          }}
        >
          {sign.symbol}
        </div>
        <h3 style={{ margin: 0, fontSize: 24, color: 'rgba(255,255,255,0.9)' }}>
          {sign.sign}
        </h3>
        <p
          style={{
            margin: '8px 0 0 0',
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'capitalize',
          }}
        >
          {sign.element} • {sign.modality}
        </p>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 8,
          }}
        >
          Essence
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.85)',
            fontStyle: 'italic',
          }}
        >
          {sign.essence}
        </p>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 8,
          }}
        >
          Void Atmosphere
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          {sign.voidAtmosphere}
        </p>
      </div>
      
      <div
        style={{
          padding: '16px',
          background: `${sign.color}10`,
          borderRadius: 8,
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
          fontStyle: 'italic',
        }}
      >
        Like {sign.landscape}
      </div>
    </div>
  </div>
);

export default MoonsJourney;
