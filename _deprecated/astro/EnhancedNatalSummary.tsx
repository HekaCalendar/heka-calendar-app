/**
 * Enhanced Natal Chart Summary
 * Displays comprehensive birth chart analysis with:
 * - Aspect patterns
 * - Planetary dignities
 * - Element/modality balance
 * - Deep interpretations
 */

import React from 'react';
import { NatalChart, PlanetPosition } from '../../types/astrology';
import { detectAspectPatterns, AspectPattern } from '../../services/AspectPatternDetector';
import { 
  calculatePlanetaryStrength, 
  calculateElementBalance, 
  calculateModalityBalance,
  Dignity 
} from '../../services/AstroDignities';
import { 
  getSunSignInterpretation, 
  getMoonSignInterpretation,
  PlanetInSignInterpretation 
} from '../../data/natalInterpretations';

interface EnhancedNatalSummaryProps {
  natalChart: NatalChart;
  use13Sign?: boolean;
}

export const EnhancedNatalSummary: React.FC<EnhancedNatalSummaryProps> = ({
  natalChart,
  use13Sign = false
}) => {
  // Detect aspect patterns
  const patterns = detectAspectPatterns(natalChart.positions);
  
  // Calculate dignities
  const dignities = natalChart.positions
    .map(pos => calculatePlanetaryStrength(pos))
    .filter(d => d.dignity !== null)
    .sort((a, b) => b.score - a.score);
  
  // Calculate element and modality balance
  const elements = calculateElementBalance(natalChart.positions);
  const modalities = calculateModalityBalance(natalChart.positions);
  
  // Get sun and moon interpretations
  const sunPos = natalChart.positions.find(p => p.planet === 'sun');
  const moonPos = natalChart.positions.find(p => p.planet === 'moon');
  const sunInterpretation = sunPos ? getSunSignInterpretation(sunPos.sign) : null;
  const moonInterpretation = moonPos ? getMoonSignInterpretation(moonPos.sign) : null;
  
  return (
    <div className="enhanced-natal-summary">
      {/* Core Identity Section */}
      {(sunInterpretation || moonInterpretation) && (
        <section className="summary-section core-identity">
          <h3>🌟 Core Identity</h3>
          
          {sunInterpretation && (
            <div className="identity-card sun-card">
              <div className="card-header">
                <span className="planet-symbol">☉</span>
                <h4>Sun in {capitalize(sunInterpretation.sign)}</h4>
                <span className="card-title">{sunInterpretation.title}</span>
              </div>
              <p className="essence">{sunInterpretation.essence}</p>
              
              <div className="keywords">
                {sunInterpretation.keywords.map(k => (
                  <span key={k} className="keyword">{k}</span>
                ))}
              </div>
              
              <div className="gifts-challenges">
                <div className="gifts">
                  <h5>Gifts</h5>
                  <ul>
                    {sunInterpretation.gifts.slice(0, 3).map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="challenges">
                  <h5>Growth Areas</h5>
                  <ul>
                    {sunInterpretation.challenges.slice(0, 3).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <p className="life-theme">
                <strong>Life Theme:</strong> {sunInterpretation.lifeTheme}
              </p>
            </div>
          )}
          
          {moonInterpretation && (
            <div className="identity-card moon-card">
              <div className="card-header">
                <span className="planet-symbol">☽</span>
                <h4>Moon in {capitalize(moonInterpretation.sign)}</h4>
                <span className="card-title">{moonInterpretation.title}</span>
              </div>
              <p className="essence">{moonInterpretation.essence}</p>
            </div>
          )}
        </section>
      )}
      
      {/* Aspect Patterns Section */}
      {patterns.length > 0 && (
        <section className="summary-section aspect-patterns">
          <h3>⚡ Sacred Geometry</h3>
          <p className="section-intro">
            Special patterns in your chart indicate concentrated life themes and natural gifts.
          </p>
          
          <div className="patterns-grid">
            {patterns.slice(0, 4).map(pattern => (
              <div key={pattern.id} className={`pattern-card pattern-${pattern.type}`}>
                <div className="pattern-header">
                  <span className="pattern-icon">{getPatternIcon(pattern.type)}</span>
                  <h4>{pattern.name}</h4>
                  <span className={`significance-badge ${pattern.significance}`}>
                    {pattern.significance}
                  </span>
                </div>
                
                <div className="pattern-planets">
                  {pattern.planets.map(p => (
                    <span key={p} className="planet-tag">{getPlanetSymbol(p)}</span>
                  ))}
                </div>
                
                {pattern.element && (
                  <span className={`element-badge ${pattern.element}`}>
                    {pattern.element}
                  </span>
                )}
                
                <p className="pattern-description">{pattern.description}</p>
                
                {pattern.interpretation && (
                  <p className="pattern-wisdom">{pattern.interpretation}</p>
                )}
                
                {pattern.orb < 2 && (
                  <span className="tight-orb">✨ Tight orb - very strong</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Planetary Strengths */}
      {dignities.length > 0 && (
        <section className="summary-section planetary-strengths">
          <h3>💪 Planetary Strengths</h3>
          <p className="section-intro">
            Planets in their domicile or exaltation are especially powerful in your chart.
          </p>
          
          <div className="strengths-list">
            {dignities.slice(0, 6).map(({ score, dignity, isRetrograde, interpretation }) => (
              <div key={dignity?.planet} className="strength-item">
                <div className="strength-header">
                  <span className="planet-symbol">{getPlanetSymbol(dignity!.planet)}</span>
                  <span className="planet-name">{capitalize(dignity!.planet)}</span>
                  <span className={`dignity-badge ${dignity!.type}`}>
                    {dignity!.type}
                  </span>
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="strength-score">{(score ?? 0).toFixed(1)}</span>
                </div>
                {isRetrograde && <span className="retrograde-badge">℞ Retrograde</span>}
                <p className="strength-interpretation">{interpretation}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Element & Modality Balance */}
      <section className="summary-section elemental-balance">
        <h3>⚖️ Elemental Balance</h3>
        
        <div className="balance-charts">
          <div className="balance-chart">
            <h4>Elements</h4>
            <div className="element-bars">
              {(['fire', 'earth', 'air', 'water'] as const).map(element => (
                <div key={element} className={`element-bar ${element}`}>
                  <span className="element-label">{getElementSymbol(element)}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${Math.min((elements[element] / 10) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="element-value">{(elements[element] ?? 0).toFixed(1)}</span>
                </div>
              ))}
            </div>
            <p className="balance-interpretation">{elements.interpretation}</p>
          </div>
          
          <div className="balance-chart">
            <h4>Modalities</h4>
            <div className="modality-bars">
              {(['cardinal', 'fixed', 'mutable'] as const).map(modality => (
                <div key={modality} className={`modality-bar ${modality}`}>
                  <span className="modality-label">{capitalize(modality)}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${Math.min((modalities[modality] / 10) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="modality-value">{(modalities[modality] ?? 0).toFixed(1)}</span>
                </div>
              ))}
            </div>
            <p className="balance-interpretation">{modalities.interpretation}</p>
          </div>
        </div>
      </section>
      
      {/* HEKA Wisdom */}
      <section className="summary-section heka-wisdom">
        <h3>🌙 HEKA Calendar Wisdom</h3>
        <div className="wisdom-card">
          <p>
            Your birth chart reveals your cosmic blueprint within the 13-month HEKA calendar system. 
            The {use13Sign ? '13-sign' : '12-sign'} zodiac you selected aligns with {use13Sign ? 
              'the astronomical positions of the constellations, honoring Ophiuchus the Serpent Bearer.' : 
              'the traditional tropical zodiac, following the seasons of Earth.'}
          </p>
          {sunInterpretation?.hekaWisdom && (
            <p className="specific-wisdom">{sunInterpretation.hekaWisdom}</p>
          )}
        </div>
      </section>
    </div>
  );
};

// Helper functions
function capitalize(str: string | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getPlanetSymbol(planet: string): string {
  const symbols: Record<string, string> = {
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
    mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅',
    neptune: '♆', pluto: '♇', chiron: '⚷',
    northNode: '☊', southNode: '☋', lilith: '⚸'
  };
  return symbols[planet] || '●';
}

function getElementSymbol(element: string): string {
  const symbols: Record<string, string> = {
    fire: '🔥', earth: '🌍', air: '💨', water: '💧'
  };
  return symbols[element] || '◆';
}

function getPatternIcon(type: string): string {
  const icons: Record<string, string> = {
    'grand-trine': '△',
    't-square': 'T',
    'grand-cross': '✚',
    'yod': 'Y',
    'stellium': '✦',
    'kite': '◇',
    'mystic-rectangle': '▭'
  };
  return icons[type] || '◆';
}

export default EnhancedNatalSummary;
