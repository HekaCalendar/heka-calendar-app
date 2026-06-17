/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PATTERN DASHBOARD COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Visualize discovered patterns and correlations between celestial events 
 * and personal experiences.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import i18n from '../../../i18n';
import { patternEngine, type UserEvent, type PatternCorrelation } from '../../services/patterns/patternRecognition';

interface PatternDashboardProps {
  onClose: () => void;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.98) 0%, rgba(40, 30, 60, 0.98) 100%)',
    borderRadius: '20px',
    padding: '28px',
    color: '#fff',
    maxWidth: '700px',
    margin: '0 auto',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 300,
    margin: 0,
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '28px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center' as const,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#fbbf24',
    margin: '0 0 4px 0',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    marginTop: '12px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #9333ea 0%, #3b82f6 100%)',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  section: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '16px',
    color: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  patternCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    borderLeft: '3px solid #9333ea',
    transition: 'all 0.2s',
  },
  patternHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  patternType: {
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: '#9333ea',
    fontWeight: 600,
  },
  confidenceBadge: {
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: '12px',
    background: 'rgba(34, 197, 94, 0.15)',
    color: '#4ade80',
    fontWeight: 500,
  },
  patternDescription: {
    fontSize: '1rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: '8px',
  },
  patternInsight: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
  sampleSize: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '8px',
  },
  eventTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
  },
  eventTypeCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '12px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid transparent',
  },
  eventTypeIcon: {
    fontSize: '1.5rem',
    marginBottom: '6px',
  },
  eventTypeLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
    opacity: 0.5,
  },
  logButton: {
    marginTop: '20px',
    padding: '14px 24px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s',
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  eventItem: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  eventIcon: {
    fontSize: '1.25rem',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  eventDate: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  intensityBar: {
    width: '60px',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  intensityFill: {
    height: '100%',
    borderRadius: '2px',
  },
};

// Event type configurations
const EVENT_TYPES: { type: UserEvent['type']; icon: string; label: string; color: string }[] = [
  { type: 'breakthrough', icon: '💡', label: 'Breakthrough', color: '#fbbf24' },
  { type: 'insight', icon: '🔮', label: 'Insight', color: '#a855f7' },
  { type: 'creative', icon: '✨', label: 'Creative', color: '#ec4899' },
  { type: 'connection', icon: '💫', label: 'Connection', color: '#3b82f6' },
  { type: 'challenge', icon: '🔥', label: 'Challenge', color: '#ef4444' },
  { type: 'completion', icon: '✅', label: 'Completion', color: '#22c55e' },
  { type: 'health', icon: '🌟', label: 'Health', color: '#14b8a6' },
  { type: 'career', icon: '⭐', label: 'Career', color: '#f97316' },
];

// Pattern type colors
const PATTERN_TYPE_COLORS: Record<string, string> = {
  transit: '#9333ea',
  moonPhase: '#3b82f6',
  retrograde: '#f59e0b',
  voidMoon: '#8b5cf6',
  element: '#22c55e',
  combination: '#ec4899',
};

export const PatternDashboard: React.FC<PatternDashboardProps> = ({ onClose }) => {
  const [patterns, setPatterns] = useState<PatternCorrelation[]>([]);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [profile, setProfile] = useState(patternEngine.getProfile());
  const [showEventLogger, setShowEventLogger] = useState(false);
  
  useEffect(() => {
    setPatterns(patternEngine.getPatterns());
    setEvents(patternEngine.getEvents());
    setProfile(patternEngine.getProfile());
  }, []);
  
  const filteredEvents = events.slice(0, 10);
  
  const handleLogEvent = (type: UserEvent['type']) => {
    const snapshot = {
      date: new Date(),
      moonPhase: 'full-moon',
      moonSign: 'leo',
      sunSign: 'aquarius',
      retrogrades: [],
      transits: [],
    };
    
    patternEngine.logEvent({
      type,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} experienced`,
      intensity: 7,
      tags: [type],
      date: new Date(),
    }, snapshot);
    
    // Refresh data
    setPatterns(patternEngine.getPatterns());
    setEvents(patternEngine.getEvents());
    setProfile(patternEngine.getProfile());
    setShowEventLogger(false);
  };
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Your Celestial Patterns</h1>
        <button
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          aria-label={i18n.t('close')}
        >
          ×
        </button>
      </header>
      
      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{profile.totalEvents}</div>
          <div style={styles.statLabel}>Events Logged</div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${profile.learningProgress}%`}} />
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{patterns.length}</div>
          <div style={styles.statLabel}>Patterns Found</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{profile.dominantThemes.length}</div>
          <div style={styles.statLabel}>Themes</div>
        </div>
      </div>
      
      {/* Discovered Patterns */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🔮 Discovered Patterns</h2>
        {patterns.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>✨</div>
            <p>Log events to discover your personal celestial patterns</p>
            <p style={{fontSize: '0.85rem', marginTop: '8px'}}>
              The more events you log, the more patterns we can identify
            </p>
          </div>
        ) : (
          patterns.slice(0, 5).map(pattern => (
            <div 
              key={pattern.id} 
              style={{
                ...styles.patternCard,
                borderLeftColor: PATTERN_TYPE_COLORS[pattern.patternType] || '#9333ea',
              }}
            >
              <div style={styles.patternHeader}>
                <span style={{
                  ...styles.patternType,
                  color: PATTERN_TYPE_COLORS[pattern.patternType] || '#9333ea',
                }}>
                  {pattern.patternType.replace('-', ' ')}
                </span>
                <span style={styles.confidenceBadge}>{pattern.confidence.toFixed(0)}% confidence</span>
              </div>
              <div style={styles.patternDescription}>{pattern.description}</div>
              <div style={styles.patternInsight}>{pattern.insight}</div>
              <div style={styles.sampleSize}>Based on {pattern.sampleSize} observations</div>
            </div>
          ))
        )}
      </div>
      
      {/* Event Logger */}
      {showEventLogger ? (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>✨ Log an Experience</h2>
          <div style={styles.eventTypeGrid}>
            {EVENT_TYPES.map(({ type, icon, label }) => (
              <button
                key={type}
                style={styles.eventTypeCard}
                onClick={() => handleLogEvent(type)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={styles.eventTypeIcon}>{icon}</div>
                <div style={styles.eventTypeLabel}>{label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          style={styles.logButton}
          onClick={() => setShowEventLogger(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(147, 51, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          + Log Today&apos;s Experience
        </button>
      )}
      
      {/* Recent Events */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📅 Recent Events</h2>
        {events.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No events logged yet</p>
          </div>
        ) : (
          <div style={styles.eventsList}>
            {filteredEvents.map(event => {
              const eventType = EVENT_TYPES.find(et => et.type === event.type);
              return (
                <div key={event.id} style={styles.eventItem}>
                  <span style={styles.eventIcon}>{eventType?.icon || '✨'}</span>
                  <div style={styles.eventContent}>
                    <div style={styles.eventTitle}>{event.description}</div>
                    <div style={styles.eventDate}>
                      {new Intl.DateTimeFormat(i18n.language || 'en', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(new Date(event.date))}
                    </div>
                  </div>
                  <div style={styles.intensityBar}>
                    <div style={{
                      ...styles.intensityFill,
                      width: `${(event.intensity / 10) * 100}%`,
                      background: eventType?.color || '#9333ea',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternDashboard;
