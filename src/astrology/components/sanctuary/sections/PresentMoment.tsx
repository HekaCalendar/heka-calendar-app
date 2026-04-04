/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE PRESENT MOMENT - Living the Void Now
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This is what users see first. The immediate experience of the Moon's state.
 * Not a dashboard. A meditation bell.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { VoidMoonData } from '../../../types';
import BreathingMoon from '../visuals/BreathingMoon';
import LastConversation from '../visuals/LastConversation';
import { generateVoidSignature, signEssences, moonTeachings } from '../content/voidNarratives';

interface PresentMomentProps {
  data: VoidMoonData | null;
  loading: boolean;
}

// Format duration in a human, poetic way
function formatDuration(minutes: number): { text: string; poetic: string } {
  if (minutes < 60) {
    return { 
      text: `${Math.round(minutes)} minutes`,
      poetic: minutes < 15 ? 'just moments' : 'a brief while'
    };
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 1 && mins === 0) return { text: '1 hour', poetic: 'one full turning' };
  if (hours === 1) return { text: `1 hour ${mins} min`, poetic: 'more than one turning' };
  if (mins === 0) return { text: `${hours} hours`, poetic: `${hours} turnings` };
  return { text: `${hours}h ${mins}m`, poetic: `${hours} turnings and more` };
}

// Format time ago
function formatTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 2) return 'a minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return 'an hour ago';
  return `${hours} hours ago`;
}

export const PresentMoment: React.FC<PresentMomentProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ 
          width: 120, 
          height: 120, 
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(100,100,150,0.3), transparent)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          Attuning to the Moon...
        </p>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>
          The Moon's wisdom is temporarily veiled.
        </p>
      </div>
    );
  }
  
  const isVoid = data.isVoid;
  const moonSign = data.moonSign || 'Cancer';
  const signData = signEssences[moonSign.toLowerCase()] || signEssences.cancer;
  const signature = data.lastAspect 
    ? generateVoidSignature(data.lastAspect.planet.toLowerCase(), data.lastAspect.type.toLowerCase())
    : null;
  
  // Calculate timing
  const now = new Date();
  let durationText = '';
  let durationPoetic = '';
  let timeAgo = '';
  
  if (isVoid && data.voidEnd) {
    const remaining = (data.voidEnd.getTime() - now.getTime()) / 60000;
    const formatted = formatDuration(remaining);
    durationText = formatted.text;
    durationPoetic = formatted.poetic;
  } else if (!isVoid && data.nextVoidStart) {
    const until = (data.nextVoidStart.getTime() - now.getTime()) / 60000;
    const formatted = formatDuration(until);
    durationText = formatted.text;
    durationPoetic = formatted.poetic;
  }
  
  if (data.voidStart && isVoid) {
    timeAgo = formatTimeAgo(data.voidStart);
  } else if (!isVoid && data.nextVoidStart) {
    timeAgo = formatTimeAgo(data.nextVoidStart);
  }
  
  return (
    <div style={{ padding: '24px', maxWidth: 480, margin: '0 auto' }}>
      {/* Hero Status */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        {/* The Breathing Moon with Phase Label */}
        <div style={{ 
          marginBottom: 32, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 24,
        }}>
          <BreathingMoon data={data} size={160} />
          <div style={{ textAlign: 'left' }}>
            <div 
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              {data.moonPhase?.name || 'Unknown Phase'}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              {data.moonPhase ? `${Math.round(data.moonPhase.illumination * 100)}% illuminated` : ''}
            </div>
          </div>
        </div>
        
        {/* Status Title */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 300,
            margin: '0 0 8px 0',
            letterSpacing: '0.15em',
            color: isVoid ? signData.color : '#fbbf24',
            textTransform: 'uppercase',
          }}
        >
          {isVoid ? 'Void of Course' : 'The Moon is Active'}
        </h1>
        
        {/* Poetic Status Line */}
        <p
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.7)',
            margin: 0,
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}
        >
          {isVoid 
            ? `The Moon walks alone through ${signData.sign}, carrying silence.`
            : `The Moon converses through ${signData.sign}, connected and alive.`
          }
        </p>
        
        {/* Timing */}
        <div
          style={{
            marginTop: 24,
            padding: '16px 24px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            display: 'inline-block',
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 4,
            }}
          >
            {isVoid ? 'Void continues for' : 'Next void in'}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 300,
              color: isVoid ? signData.color : '#fbbf24',
            }}
          >
            {durationText}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
              fontStyle: 'italic',
              marginTop: 4,
            }}
          >
            {durationPoetic}
          </div>
        </div>
      </div>
      
      {/* The Atmosphere Card */}
      <div
        style={{
          padding: '28px',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 16,
          marginBottom: 24,
          border: `1px solid ${signData.color}20`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 12,
          }}
        >
          In This Space
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          {isVoid ? signData.voidAtmosphere : `The Moon in ${signData.sign} is ${signData.essence.toLowerCase()}.`}
        </p>
        <p
          style={{
            margin: '12px 0 0 0',
            fontSize: 14,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.6)',
            fontStyle: 'italic',
          }}
        >
          {isVoid 
            ? `Like ${signData.landscape.toLowerCase()}.`
            : `She moves through ${signData.landscape.toLowerCase()}, exchanging energy with all she meets.`
          }
        </p>
      </div>
      
      {/* Last Conversation - only during void */}
      {isVoid && data.lastAspect && signature && (
        <LastConversation
          planet={data.lastAspect.planet}
          aspect={data.lastAspect.type}
          exactTime={data.voidStart || new Date()}
          timeAgo={timeAgo}
        />
      )}
      
      {/* Current Aspects - when active */}
      {!isVoid && data.aspects && data.aspects.length > 0 && (
        <div
          style={{
            padding: '28px',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: 16,
            border: '1px solid rgba(251, 191, 36, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: 16,
            }}
          >
            Current Conversations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.aspects.slice(0, 3).map((aspect, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>☽</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>✦</span>
                <span style={{ fontSize: 18 }}>{aspect.planetSymbol}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
                    {aspect.type} {aspect.planet}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                    Orb: {aspect.orb.toFixed(1)}° {aspect.isApplying ? 'applying' : 'separating'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* The Teaching */}
      <div
        style={{
          marginTop: 32,
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(100,100,150,0.1), transparent)',
          borderRadius: 12,
          borderLeft: `2px solid ${isVoid ? signData.color : '#fbbf24'}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.7)',
            fontStyle: 'italic',
          }}
        >
          {isVoid 
            ? moonTeachings.theVoid.content.split('\n\n')[0]
            : moonTeachings.theDailyJourney.content.split('\n\n')[0]
          }
        </p>
      </div>
    </div>
  );
};

export default PresentMoment;
