/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LAST CONVERSATION - The Moment of Release
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This component tells the story of the Moon's final aspect.
 * Not as data, but as poetry.
 * The moment the conversation ended. The letting go.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import i18n from '../../../../i18n';
import { planetaryVoices, aspectConversations, generateVoidSignature } from '../content/voidNarratives';

interface LastConversationProps {
  planet: string;
  aspect: string;
  exactTime: Date;
  timeAgo: string;
  className?: string;
}

export const LastConversation: React.FC<LastConversationProps> = ({
  planet,
  aspect,
  exactTime,
  timeAgo,
  className = '',
}) => {
  const voice = planetaryVoices[planet.toLowerCase()] || planetaryVoices.sun;
  const conversation = aspectConversations[aspect.toLowerCase()] || aspectConversations.sextile;
  const signature = generateVoidSignature(planet.toLowerCase(), aspect.toLowerCase());
  
  // Format the time
  const timeString = new Intl.DateTimeFormat(i18n.language || 'en', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(exactTime);
  
  return (
    <div 
      className={`last-conversation ${className}`}
      style={{
        padding: '32px',
        background: `linear-gradient(135deg, ${signature.color}10, transparent)`,
        borderRadius: 16,
        border: `1px solid ${signature.color}30`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative element */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${signature.color}, transparent)`,
          opacity: 0.5,
        }}
      />
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 8,
          }}
        >
          The Last Conversation
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {timeAgo} ago at {timeString}
        </div>
      </div>
      
      {/* The Dialogue */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Planet symbols */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${signature.color}40, ${signature.color}20)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: signature.color,
                boxShadow: `0 0 20px ${signature.color}30`,
              }}
            >
              ☽
            </div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.3)' }}>✦</div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${voice.color}40, ${voice.color}20)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: voice.color,
                boxShadow: `0 0 20px ${voice.color}30`,
              }}
            >
              {voice.symbol}
            </div>
          </div>
          
          {/* Aspect name */}
          <div
            style={{
              padding: '8px 16px',
              background: `${signature.color}20`,
              borderRadius: 20,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: signature.color,
              border: `1px solid ${signature.color}40`,
            }}
          >
            {conversation.aspect}
          </div>
        </div>
        
        {/* The poetic dialogue */}
        <blockquote
          style={{
            margin: 0,
            padding: '20px 24px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            borderLeft: `3px solid ${signature.color}`,
            fontSize: 16,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.9)',
            fontStyle: 'italic',
          }}
        >
          "{conversation.dialogue}"
        </blockquote>
      </div>
      
      {/* The Atmosphere */}
      <div>
        <div
          style={{
            fontSize: 14,
            color: signature.color,
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          {signature.title}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {signature.atmosphere}
        </p>
      </div>
      
      {/* The Image Metaphor */}
      <div
        style={{
          marginTop: 20,
          padding: '12px 16px',
          background: `${signature.color}10`,
          borderRadius: 8,
          fontSize: 12,
          color: 'rgba(255,255,255,0.5)',
          fontStyle: 'italic',
        }}
      >
        Like {conversation.image}
      </div>
    </div>
  );
};

export default LastConversation;
