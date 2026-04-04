/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VOID MOON SANCTUARY
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * A sacred space for experiencing the void.
 * Not a dashboard. Not a calculator. A sanctuary.
 * 
 * Three chambers:
 * 1. The Present Moment - Living the void now
 * 2. The Moon's Journey - Understanding the path
 * 3. The Void Practice - Growing through the liminal
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { VoidMoonData } from '../../types';
import SanctuaryAtmosphere from './visuals/SanctuaryAtmosphere';
import PresentMoment from './sections/PresentMoment';
import MoonsJourney from './sections/MoonsJourney';
import VoidPractice from './sections/VoidPractice';
import { calculateVoidMoonStatus } from '../../services/calculations/swissCalculations';

interface VoidMoonSanctuaryProps {
  userBirthData?: {
    moonSign: string;
    voidMoon: boolean;
  } | null;
}

type SanctuarySection = 'present' | 'journey' | 'practice';

// Section metadata for the navigation
const sections: Record<SanctuarySection, {
  label: string;
  subtitle: string;
  icon: string;
}> = {
  present: {
    label: 'Now',
    subtitle: 'The living moment',
    icon: '◐',
  },
  journey: {
    label: 'Learn',
    subtitle: 'Understanding the path',
    icon: '☌',
  },
  practice: {
    label: 'Practice',
    subtitle: 'Growing through the void',
    icon: '☽',
  },
};

export const VoidMoonSanctuary: React.FC<VoidMoonSanctuaryProps> = ({
  userBirthData,
}) => {
  const [activeSection, setActiveSection] = useState<SanctuarySection>('present');
  const [voidData, setVoidData] = useState<VoidMoonData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch void moon data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await calculateVoidMoonStatus();
        setVoidData(data);
      } catch (error) {
        console.error('Error fetching void moon data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Update every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const isVoid = voidData?.isVoid ?? false;
  const moonSign = voidData?.moonSign || 'Cancer';
  
  return (
    <SanctuaryAtmosphere moonSign={moonSign} isVoid={isVoid}>
      {/* Header */}
      <header
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 400,
              margin: 0,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>☽</span>
            Void Moon Sanctuary
          </h1>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.05em',
            }}
          >
            {isVoid 
              ? 'The Moon walks alone. Honor the silence.'
              : 'The Moon is connected. Act with support.'
            }
          </p>
        </div>
      </header>
      
      {/* Main Navigation */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {(Object.keys(sections) as SanctuarySection[]).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            style={{
              flex: 1,
              maxWidth: 120,
              padding: '14px 16px',
              background: activeSection === section 
                ? 'rgba(255,255,255,0.08)' 
                : 'transparent',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
          >
            {/* Active indicator */}
            {activeSection === section && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 2,
                  background: isVoid 
                    ? 'rgba(200,180,220,0.5)' 
                    : 'rgba(251, 191, 36, 0.5)',
                  borderRadius: 1,
                }}
              />
            )}
            
            <div
              style={{
                fontSize: 20,
                marginBottom: 4,
                color: activeSection === section 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.4)',
              }}
            >
              {sections[section].icon}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: activeSection === section 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.5)',
                letterSpacing: '0.05em',
              }}
            >
              {sections[section].label}
            </div>
            <div
              style={{
                fontSize: 9,
                color: 'rgba(255,255,255,0.3)',
                marginTop: 2,
              }}
            >
              {sections[section].subtitle}
            </div>
          </button>
        ))}
      </nav>
      
      {/* Main Content */}
      <main
        style={{
          paddingBottom: 40,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {activeSection === 'present' && (
          <PresentMoment data={voidData} loading={loading} />
        )}
        
        {activeSection === 'journey' && (
          <MoonsJourney />
        )}
        
        {activeSection === 'practice' && (
          <VoidPractice 
            data={voidData} 
            userBirthData={userBirthData}
          />
        )}
      </main>
      
      {/* Footer Quote */}
      <footer
        style={{
          padding: '32px 24px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <blockquote
          style={{
            margin: 0,
            fontSize: 13,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.7,
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          "The Moon teaches us that darkness is not absence, but the womb of becoming."
        </blockquote>
        <div
          style={{
            marginTop: 16,
            fontSize: 10,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.1em',
          }}
        >
          Calculated with Swiss Ephemeris
        </div>
      </footer>
    </SanctuaryAtmosphere>
  );
};

export default VoidMoonSanctuary;
