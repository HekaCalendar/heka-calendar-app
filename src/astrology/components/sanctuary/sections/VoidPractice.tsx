/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE VOID PRACTICE - Growth Through the Liminal
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This is where users engage with the void.
 * Not as obstacle, but as teacher.
 * Practices, prompts, and personal patterns.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { VoidMoonData } from '../../../types';
import { 
  generateVoidSignature, 
  generateNatalVoidPattern,
} from '../content/voidNarratives';

interface VoidPracticeProps {
  data: VoidMoonData | null;
  userBirthData?: {
    moonSign: string;
    voidMoon: boolean;
  } | null;
}

type PracticeView = 'current' | 'journal' | 'patterns' | 'natal';

export const VoidPractice: React.FC<VoidPracticeProps> = ({ 
  data, 
  userBirthData 
}) => {
  const [viewMode, setViewMode] = useState<PracticeView>('current');
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<Array<{
    date: string;
    prompt: string;
    entry: string;
  }>>([]);
  
  // Load saved entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('voidMoonJournal');
    if (saved) {
      try {
        setSavedEntries(JSON.parse(saved));
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);
  
  // Save entries to localStorage
  const saveEntry = (prompt: string) => {
    if (!journalEntry.trim()) return;
    
    const newEntry = {
      date: new Date().toISOString(),
      prompt,
      entry: journalEntry,
    };
    
    const updated = [newEntry, ...savedEntries].slice(0, 50); // Keep last 50
    setSavedEntries(updated);
    localStorage.setItem('voidMoonJournal', JSON.stringify(updated));
    setJournalEntry('');
  };
  
  const isVoid = data?.isVoid ?? false;
  
  const signature = data?.lastAspect 
    ? generateVoidSignature(data.lastAspect.planet.toLowerCase(), data.lastAspect.type.toLowerCase())
    : null;
  
  const natalPattern = userBirthData 
    ? generateNatalVoidPattern(userBirthData.moonSign, userBirthData.voidMoon)
    : null;
  
  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
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
          The Void Practice
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
          Working with the void as a practice of presence.
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
        {([
          { key: 'current', label: 'Now' },
          { key: 'journal', label: 'Journal' },
          { key: 'patterns', label: 'History' },
          { key: 'natal', label: 'Your Pattern' },
        ] as { key: PracticeView; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
            style={{
              padding: '10px 20px',
              background: viewMode === key ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${viewMode === key ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 20,
              color: viewMode === key ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {viewMode === 'current' && (
          <CurrentPractice 
            signature={signature} 
            isVoid={isVoid}
          />
        )}
        
        {viewMode === 'journal' && (
          <JournalView
            signature={signature}
            journalEntry={journalEntry}
            setJournalEntry={setJournalEntry}
            onSave={saveEntry}
            savedEntries={savedEntries}
          />
        )}
        
        {viewMode === 'patterns' && (
          <PatternsView savedEntries={savedEntries} />
        )}
        
        {viewMode === 'natal' && natalPattern && (
          <NatalView pattern={natalPattern} />
        )}
        
        {viewMode === 'natal' && !natalPattern && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 16,
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
              To see your personal void pattern, add your birth information in your profile.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              Understanding whether you were born during a void Moon helps you work with your natural rhythm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CURRENT PRACTICE
// ═══════════════════════════════════════════════════════════════════════════════

interface CurrentPracticeProps {
  signature?: ReturnType<typeof generateVoidSignature> | null;
  isVoid: boolean;
}

const CurrentPractice: React.FC<CurrentPracticeProps> = ({ 
  signature, 
  isVoid,
}) => {
  const [expandedGuidance, setExpandedGuidance] = useState<number | null>(null);
  
  if (!isVoid) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            padding: '32px',
            background: 'rgba(251, 191, 36, 0.1)',
            borderRadius: 16,
            border: '1px solid rgba(251, 191, 36, 0.2)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>☽</div>
          <h3 style={{ margin: '0 0 12px 0', color: 'rgba(255,255,255,0.9)' }}>
            The Moon is Active
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            This is a time for action, connection, and bringing intentions into form. 
            The Moon is in conversation with the planets—your efforts find support.
          </p>
        </div>
        
        {signature && (
          <>
            <div
              style={{
                padding: '28px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.08)',
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
                Next Void Signature
              </div>
              <h3
                style={{
                  fontSize: 20,
                  margin: '0 0 12px 0',
                  color: signature.color,
                }}
              >
                {signature.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.6)',
                  margin: 0,
                }}
              >
                When the Moon goes void, this will be the quality of the liminal space.
              </p>
            </div>
            
            <div>
              <div
                style={{
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 16,
                }}
              >
                Practices to Prepare
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {signature.practices.slice(0, 2).map((practice, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '14px 18px',
                      background: `${signature.color}10`,
                      borderRadius: 8,
                      border: `1px solid ${signature.color}20`,
                    }}
                  >
                    <span style={{ color: signature.color, fontSize: 16 }}>◦</span>
                    <span
                      style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.6,
                      }}
                    >
                      {practice}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  if (!signature) {
    return (
      <div
        style={{
          padding: '32px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        The Moon is void, but the signature is not available.
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Void Signature Card */}
      <div
        style={{
          padding: '28px',
          background: `linear-gradient(135deg, ${signature.color}10, transparent)`,
          borderRadius: 16,
          border: `1px solid ${signature.color}30`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: signature.color,
            marginBottom: 12,
          }}
        >
          This Void's Signature
        </div>
        <h3
          style={{
            fontSize: 22,
            margin: '0 0 16px 0',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {signature.title}
        </h3>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.75)',
            margin: 0,
          }}
        >
          {signature.description}
        </p>
      </div>
      
      {/* Guidance */}
      <div>
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 16,
          }}
        >
          Guidance
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {signature.guidance.map((guide, idx) => (
            <div
              key={idx}
              onClick={() => setExpandedGuidance(expandedGuidance === idx ? null : idx)}
              style={{
                padding: '16px 20px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {guide}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Practices */}
      <div>
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 16,
          }}
        >
          Practices for This Void
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {signature.practices.map((practice, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 18px',
                background: `${signature.color}10`,
                borderRadius: 8,
                border: `1px solid ${signature.color}20`,
              }}
            >
              <span style={{ color: signature.color, fontSize: 16 }}>◦</span>
              <span
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.6,
                }}
              >
                {practice}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Texture Note */}
      <div
        style={{
          padding: '20px',
          background: 'rgba(0,0,0,0.15)',
          borderRadius: 10,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
            fontStyle: 'italic',
          }}
        >
          Texture: {signature.texture} • Temperature: {signature.temperature}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNAL VIEW
// ═══════════════════════════════════════════════════════════════════════════════

interface JournalViewProps {
  signature?: ReturnType<typeof generateVoidSignature> | null;
  journalEntry: string;
  setJournalEntry: (entry: string) => void;
  onSave: (prompt: string) => void;
  savedEntries: Array<{ date: string; prompt: string; entry: string }>;
}

// Default/generic prompts when no signature available
const defaultPrompts = [
  "What is present right now?",
  "What wants to be released?",
  "What is waiting to be born?",
  "What did the Moon teach you today?",
];

const JournalView: React.FC<JournalViewProps> = ({
  signature,
  journalEntry,
  setJournalEntry,
  onSave,
  savedEntries,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  
  const prompts = signature?.journalPrompts || defaultPrompts;
  const accentColor = signature?.color || '#8b5cf6';
  
  const currentPrompt = prompts[selectedPrompt] || prompts[0];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Prompt Selection */}
      <div>
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 16,
          }}
        >
          Journal Prompt
        </div>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {prompts.map((_prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPrompt(idx);
                setJournalEntry('');
              }}
              style={{
                padding: '8px 12px',
                background: selectedPrompt === idx ? `${accentColor}30` : 'rgba(0,0,0,0.2)',
                border: `1px solid ${selectedPrompt === idx ? accentColor : 'rgba(255,255,255,0.1)'} `,
                borderRadius: 16,
                color: selectedPrompt === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              Prompt {idx + 1}
            </button>
          ))}
        </div>
        
        <div
          style={{
            padding: '24px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            borderLeft: `3px solid ${accentColor}`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.85)',
              fontStyle: 'italic',
            }}
          >
            {currentPrompt}
          </p>
        </div>
      </div>
      
      {/* Entry Field */}
      <div>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Let your thoughts flow without judgment..."
          style={{
            width: '100%',
            minHeight: 150,
            padding: 16,
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: 'rgba(255,255,255,0.9)',
            fontSize: 14,
            lineHeight: 1.7,
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={() => onSave(currentPrompt)}
          disabled={!journalEntry.trim()}
          style={{
            marginTop: 12,
            padding: '12px 24px',
            background: journalEntry.trim() ? accentColor : 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: 8,
            color: journalEntry.trim() ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.4)',
            fontSize: 13,
            fontWeight: 500,
            cursor: journalEntry.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
          }}
        >
          Save Entry
        </button>
      </div>
      
      {/* Saved Entries Toggle */}
      {savedEntries.length > 0 && (
        <div>
          <button
            onClick={() => setShowSaved(!showSaved)}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 20,
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {showSaved ? 'Hide' : 'Show'} Past Entries ({savedEntries.length})
          </button>
          
          {showSaved && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {savedEntries.slice(0, 5).map((entry, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    background: 'rgba(0,0,0,0.15)',
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                      marginBottom: 8,
                    }}
                  >
                    {new Date(entry.date).toLocaleDateString()} • {entry.prompt.substring(0, 50)}...
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.6,
                    }}
                  >
                    {entry.entry.substring(0, 200)}
                    {entry.entry.length > 200 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PATTERNS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const PatternsView: React.FC<{
  savedEntries: Array<{ date: string; prompt: string; entry: string }>;
}> = ({ savedEntries }) => {
  // Calculate some simple stats
  const entriesByMonth = savedEntries.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}
      >
        <div
          style={{
            padding: '20px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            {savedEntries.length}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Total Entries
          </div>
        </div>
        
        <div
          style={{
            padding: '20px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            {savedEntries.length > 0 
              ? Math.round(savedEntries.reduce((acc, e) => acc + e.entry.length, 0) / savedEntries.length)
              : 0
            }
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Avg Words
          </div>
        </div>
      </div>
      
      {/* Monthly Activity */}
      {Object.keys(entriesByMonth).length > 0 && (
        <div>
          <div
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: 16,
            }}
          >
            Your Practice Over Time
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
            {Object.entries(entriesByMonth).slice(-6).map(([month, count]) => (
              <div key={month} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: `${Math.min(count * 20, 80)}px`,
                    background: 'linear-gradient(to top, rgba(100,100,150,0.5), rgba(150,120,180,0.3))',
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                  }}
                />
                <div
                  style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: 4,
                  }}
                >
                  {month}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Wisdom */}
      <div
        style={{
          padding: '24px',
          background: 'rgba(100,80,120,0.1)',
          borderRadius: 12,
          border: '1px solid rgba(150,120,180,0.2)',
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
          "Patterns emerge not from what we do, but from what we notice. 
          Each void Moon is a door. Each journal entry is a key."
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NATAL VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const NatalView: React.FC<{
  pattern: ReturnType<typeof generateNatalVoidPattern>;
}> = ({ pattern }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    {/* Description */}
    <div
      style={{
        padding: '28px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.1)',
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
        Your Birth Pattern
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.9,
          color: 'rgba(255,255,255,0.8)',
          whiteSpace: 'pre-line',
        }}
      >
        {pattern.description}
      </p>
    </div>
    
    {/* Gifts */}
    <div>
      <div
        style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'rgba(200,180,150,0.6)',
          marginBottom: 16,
        }}
      >
        Your Gifts
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pattern.gifts.map((gift, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '14px 18px',
              background: 'rgba(200,180,150,0.1)',
              borderRadius: 8,
            }}
          >
            <span style={{ color: 'rgba(200,180,150,0.8)', fontSize: 14 }}>✦</span>
            <span
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.6,
              }}
            >
              {gift}
            </span>
          </div>
        ))}
      </div>
    </div>
    
    {/* Challenges */}
    <div>
      <div
        style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'rgba(180,150,150,0.6)',
          marginBottom: 16,
        }}
      >
        Growth Edges
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pattern.challenges.map((challenge, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '14px 18px',
              background: 'rgba(180,150,150,0.1)',
              borderRadius: 8,
            }}
          >
            <span style={{ color: 'rgba(180,150,150,0.8)', fontSize: 14 }}>◦</span>
            <span
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.6,
              }}
            >
              {challenge}
            </span>
          </div>
        ))}
      </div>
    </div>
    
    {/* Integration */}
    <div
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(100,100,150,0.15), rgba(80,70,100,0.1))',
        borderRadius: 12,
        borderLeft: '3px solid rgba(150,140,180,0.5)',
      }}
    >
      <div
        style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'rgba(150,140,180,0.8)',
          marginBottom: 12,
        }}
      >
        Integration
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.8)',
        }}
      >
        {pattern.integration}
      </p>
    </div>
  </div>
);

export default VoidPractice;
