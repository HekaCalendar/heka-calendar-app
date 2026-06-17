/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL PATTERN RECOGNITION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * "The stars incline, they do not compel." — William Shakespeare
 * 
 * This system learns from user experiences over time to surface meaningful 
 * correlations between celestial events and personal outcomes.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Transit } from '../natal/natalChart';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface UserEvent {
  id: string;
  date: Date;
  type: 'breakthrough' | 'challenge' | 'insight' | 'completion' | 'loss' | 'connection' | 'health' | 'creative' | 'career' | 'other';
  description: string;
  intensity: number; // 1-10
  tags: string[];
}

export interface CelestialSnapshot {
  date: Date;
  moonPhase: string;
  moonSign: string;
  sunSign: string;
  retrogrades: string[];
  transits: Transit[];
  voidMoon?: {
    isVoid: boolean;
    lastAspect?: string;
    nextSign?: string;
  };
}

export interface PatternCorrelation {
  id: string;
  patternType: 'transit' | 'moonPhase' | 'retrograde' | 'voidMoon' | 'element' | 'combination';
  description: string;
  confidence: number; // 0-100 based on sample size and consistency
  sampleSize: number;
  correlationStrength: number; // -1 to 1
  supportingEvents: UserEvent[];
  celestialSignature: string;
  insight: string;
  discoveredAt: Date;
  lastUpdated: Date;
}

export interface PersonalPatternProfile {
  userId: string;
  totalEvents: number;
  patterns: PatternCorrelation[];
  dominantThemes: string[];
  sensitiveTransits: string[];
  favorablePeriods: string[];
  challengingPeriods: string[];
  learningProgress: number; // 0-100 based on events logged
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  events: 'celestial-user-events',
  patterns: 'celestial-discovered-patterns',
  profile: 'celestial-pattern-profile',
};

// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN RECOGNITION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class PatternRecognitionEngine {
  private events: UserEvent[] = [];
  private patterns: PatternCorrelation[] = [];
  private snapshots: Map<string, CelestialSnapshot> = new Map();
  
  constructor() {
    this.loadFromStorage();
  }
  
  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const eventsJson = localStorage.getItem(STORAGE_KEYS.events);
      if (eventsJson) {
        this.events = JSON.parse(eventsJson).map((e: any) => ({
          ...e,
          date: new Date(e.date),
        }));
      }
      
      const patternsJson = localStorage.getItem(STORAGE_KEYS.patterns);
      if (patternsJson) {
        this.patterns = JSON.parse(patternsJson).map((p: any) => ({
          ...p,
          discoveredAt: new Date(p.discoveredAt),
          lastUpdated: new Date(p.lastUpdated),
          supportingEvents: p.supportingEvents.map((e: any) => ({
            ...e,
            date: new Date(e.date),
          })),
        }));
      }
    } catch (error) {
      console.warn('Failed to load pattern data:', error);
    }
  }
  
  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(this.events));
      localStorage.setItem(STORAGE_KEYS.patterns, JSON.stringify(this.patterns));
    } catch (error) {
      console.warn('Failed to save pattern data:', error);
    }
  }
  
  /**
   * Log a user event with associated celestial snapshot
   */
  logEvent(event: Omit<UserEvent, 'id'>, snapshot: CelestialSnapshot): UserEvent {
    const newEvent: UserEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    this.events.push(newEvent);
    this.snapshots.set(newEvent.id, snapshot);
    
    // Limit storage to last 100 events
    if (this.events.length > 100) {
      const removed = this.events.shift();
      if (removed) this.snapshots.delete(removed.id);
    }
    
    // Analyze for new patterns
    this.analyzePatterns();
    
    // Save
    this.saveToStorage();
    
    return newEvent;
  }
  
  /**
   * Get all logged events
   */
  getEvents(): UserEvent[] {
    return [...this.events].sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  /**
   * Get events filtered by type
   */
  getEventsByType(type: UserEvent['type']): UserEvent[] {
    return this.events.filter(e => e.type === type);
  }
  
  /**
   * Get snapshot for a specific event
   */
  getSnapshot(eventId: string): CelestialSnapshot | undefined {
    return this.snapshots.get(eventId);
  }
  
  /**
   * Analyze events for patterns
   */
  private analyzePatterns(): void {
    // Group events by type
    const eventsByType = new Map<UserEvent['type'], UserEvent[]>();
    this.events.forEach(event => {
      const list = eventsByType.get(event.type) || [];
      list.push(event);
      eventsByType.set(event.type, list);
    });
    
    // Analyze each event type for celestial correlations
    eventsByType.forEach((events, type) => {
      if (events.length < 3) return; // Need minimum sample size
      
      this.analyzeTransitPatterns(events, type);
      this.analyzeMoonPhasePatterns(events, type);
      this.analyzeRetrogradePatterns(events, type);
      this.analyzeVoidMoonPatterns(events, type);
    });
  }
  
  /**
   * Analyze transit correlations
   */
  private analyzeTransitPatterns(events: UserEvent[], eventType: UserEvent['type']): void {
    const transitCounts = new Map<string, number>();
    
    events.forEach(event => {
      const snapshot = this.snapshots.get(event.id);
      if (!snapshot) return;
      
      snapshot.transits.forEach(transit => {
        const key = `${transit.transitingPlanet}-${transit.aspect}-${transit.natalPlanet}`;
        transitCounts.set(key, (transitCounts.get(key) || 0) + 1);
      });
    });
    
    // Find significant correlations (>50% of events)
    const threshold = events.length * 0.5;
    transitCounts.forEach((count, transitKey) => {
      if (count >= threshold) {
        const [planet, aspect, natalPlanet] = transitKey.split('-');
        const existingPattern = this.patterns.find(p => 
          p.patternType === 'transit' && p.celestialSignature === transitKey
        );
        
        const insight = this.generateTransitInsight(planet, aspect, natalPlanet, eventType);
        
        if (existingPattern) {
          existingPattern.sampleSize = events.length;
          existingPattern.confidence = Math.min(100, (count / events.length) * 100);
          existingPattern.lastUpdated = new Date();
          existingPattern.supportingEvents = events.slice(0, 5);
        } else {
          this.patterns.push({
            id: `ptr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            patternType: 'transit',
            description: `${planet.charAt(0).toUpperCase() + planet.slice(1)} ${aspect} natal ${natalPlanet}`,
            confidence: Math.min(100, (count / events.length) * 100),
            sampleSize: events.length,
            correlationStrength: this.calculateCorrelationStrength(eventType),
            supportingEvents: events.slice(0, 5),
            celestialSignature: transitKey,
            insight,
            discoveredAt: new Date(),
            lastUpdated: new Date(),
          });
        }
      }
    });
  }
  
  /**
   * Analyze moon phase correlations
   */
  private analyzeMoonPhasePatterns(events: UserEvent[], eventType: UserEvent['type']): void {
    const phaseCounts = new Map<string, number>();
    
    events.forEach(event => {
      const snapshot = this.snapshots.get(event.id);
      if (!snapshot) return;
      phaseCounts.set(snapshot.moonPhase, (phaseCounts.get(snapshot.moonPhase) || 0) + 1);
    });
    
    const threshold = events.length * 0.4;
    phaseCounts.forEach((count, phase) => {
      if (count >= threshold) {
        const existingPattern = this.patterns.find(p => 
          p.patternType === 'moonPhase' && p.celestialSignature === `${eventType}-${phase}`
        );
        
        const insight = this.generateMoonPhaseInsight(phase, eventType);
        
        if (existingPattern) {
          existingPattern.sampleSize = events.length;
          existingPattern.confidence = Math.min(100, (count / events.length) * 100);
          existingPattern.lastUpdated = new Date();
        } else {
          this.patterns.push({
            id: `ptr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            patternType: 'moonPhase',
            description: `${phase.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} pattern`,
            confidence: Math.min(100, (count / events.length) * 100),
            sampleSize: events.length,
            correlationStrength: this.calculateCorrelationStrength(eventType),
            supportingEvents: events.slice(0, 5),
            celestialSignature: `${eventType}-${phase}`,
            insight,
            discoveredAt: new Date(),
            lastUpdated: new Date(),
          });
        }
      }
    });
  }
  
  /**
   * Analyze retrograde correlations
   */
  private analyzeRetrogradePatterns(events: UserEvent[], eventType: UserEvent['type']): void {
    const retroEvents = events.filter(e => {
      const snapshot = this.snapshots.get(e.id);
      return snapshot && snapshot.retrogrades.length > 0;
    });
    
    if (retroEvents.length >= events.length * 0.5) {
      const retrogradePlanets = new Map<string, number>();
      retroEvents.forEach(e => {
        const snapshot = this.snapshots.get(e.id);
        snapshot?.retrogrades.forEach(planet => {
          retrogradePlanets.set(planet, (retrogradePlanets.get(planet) || 0) + 1);
        });
      });
      
      retrogradePlanets.forEach((count, planet) => {
        if (count >= retroEvents.length * 0.6) {
          const insight = this.generateRetrogradeInsight(planet, eventType);
          const signature = `${eventType}-${planet}-retrograde`;
          
          const existingPattern = this.patterns.find(p => 
            p.patternType === 'retrograde' && p.celestialSignature === signature
          );
          
          if (existingPattern) {
            existingPattern.sampleSize = retroEvents.length;
            existingPattern.confidence = Math.min(100, (count / retroEvents.length) * 100);
            existingPattern.lastUpdated = new Date();
          } else {
            this.patterns.push({
              id: `ptr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              patternType: 'retrograde',
              description: `${planet.charAt(0).toUpperCase() + planet.slice(1)} Retrograde pattern`,
              confidence: Math.min(100, (count / retroEvents.length) * 100),
              sampleSize: retroEvents.length,
              correlationStrength: this.calculateCorrelationStrength(eventType),
              supportingEvents: retroEvents.slice(0, 5),
              celestialSignature: signature,
              insight,
              discoveredAt: new Date(),
              lastUpdated: new Date(),
            });
          }
        }
      });
    }
  }
  
  /**
   * Analyze void moon correlations
   */
  private analyzeVoidMoonPatterns(events: UserEvent[], eventType: UserEvent['type']): void {
    const voidEvents = events.filter(e => {
      const snapshot = this.snapshots.get(e.id);
      return snapshot?.voidMoon?.isVoid;
    });
    
    if (voidEvents.length >= events.length * 0.4) {
      const insight = this.generateVoidMoonInsight(eventType);
      const signature = `${eventType}-void-moon`;
      
      const existingPattern = this.patterns.find(p => 
        p.patternType === 'voidMoon' && p.celestialSignature === signature
      );
      
      if (existingPattern) {
        existingPattern.sampleSize = voidEvents.length;
        existingPattern.confidence = Math.min(100, (voidEvents.length / events.length) * 100);
        existingPattern.lastUpdated = new Date();
      } else {
        this.patterns.push({
          id: `ptr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          patternType: 'voidMoon',
          description: 'Void Moon pattern',
          confidence: Math.min(100, (voidEvents.length / events.length) * 100),
          sampleSize: voidEvents.length,
          correlationStrength: this.calculateCorrelationStrength(eventType),
          supportingEvents: voidEvents.slice(0, 5),
          celestialSignature: signature,
          insight,
          discoveredAt: new Date(),
          lastUpdated: new Date(),
        });
      }
    }
  }
  
  /**
   * Generate insight text for transit pattern
   */
  private generateTransitInsight(planet: string, aspect: string, natalPlanet: string, eventType: string): string {
    const planetNames: Record<string, string> = {
      sun: 'your core identity',
      moon: 'your emotions',
      mercury: 'your thinking',
      venus: 'your relationships',
      mars: 'your drive',
      jupiter: 'your growth',
      saturn: 'your structures',
      uranus: 'your independence',
      neptune: 'your intuition',
      pluto: 'your transformation',
    };
    
    const aspectDescriptions: Record<string, string> = {
      conjunction: 'directly activating',
      sextile: 'offering opportunities to',
      square: 'creating tension that motivates change in',
      trine: 'flowing harmoniously with',
      opposition: 'bringing balance through reflection on',
    };
    
    const eventDescriptions: Record<string, string> = {
      breakthrough: 'breakthroughs often occur',
      challenge: 'challenges emerge as growth opportunities',
      insight: 'deep insights surface',
      completion: 'completions feel significant',
      loss: 'letting go becomes necessary',
      connection: 'meaningful connections form',
      health: 'health awareness heightens',
      creative: 'creative inspiration flows',
      career: 'career developments unfold',
      other: 'significant events occur',
    };
    
    return `When ${planet.charAt(0).toUpperCase() + planet.slice(1)} is ${aspectDescriptions[aspect]} ${planetNames[natalPlanet] || natalPlanet}, ${eventDescriptions[eventType] || 'significant patterns emerge'}.`;
  }
  
  /**
   * Generate insight for moon phase pattern
   */
  private generateMoonPhaseInsight(phase: string, eventType: string): string {
    const phaseDescriptions: Record<string, string> = {
      'new-moon': 'new beginnings',
      'waxing-crescent': 'gathering momentum',
      'first-quarter': 'overcoming obstacles',
      'waxing-gibbous': 'refinement',
      'full-moon': 'culmination and clarity',
      'waning-gibbous': 'sharing and gratitude',
      'last-quarter': 'release and forgiveness',
      'waning-crescent': 'rest and integration',
    };
    
    return `You tend to experience ${eventType} during times of ${phaseDescriptions[phase] || phase}. The lunar cycle seems to amplify these moments for you.`;
  }
  
  /**
   * Generate insight for retrograde pattern
   */
  private generateRetrogradeInsight(planet: string, eventType: string): string {
    const planetThemes: Record<string, string> = {
      mercury: 'communication and review',
      venus: 'relationships and values',
      mars: 'action and desire',
      jupiter: 'expansion and belief',
      saturn: 'structure and responsibility',
      uranus: 'change and innovation',
      neptune: 'dreams and intuition',
      pluto: 'transformation and power',
    };
    
    return `Interestingly, your ${eventType} experiences often coincide with ${planet.charAt(0).toUpperCase() + planet.slice(1)} Retrograde periods. This suggests ${planetThemes[planet] || 'these themes'} may be particularly significant in your personal growth.`;
  }
  
  /**
   * Generate insight for void moon pattern
   */
  private generateVoidMoonInsight(eventType: string): string {
    return `You seem particularly sensitive to Void Moon periods, experiencing ${eventType} when the Moon is between aspects. This suggests strong intuition and connection to subtle energetic shifts.`;
  }
  
  /**
   * Calculate correlation strength based on event type
   */
  private calculateCorrelationStrength(eventType: UserEvent['type']): number {
    const strengths: Record<UserEvent['type'], number> = {
      breakthrough: 0.9,
      challenge: 0.8,
      insight: 0.85,
      completion: 0.75,
      loss: 0.7,
      connection: 0.8,
      health: 0.75,
      creative: 0.85,
      career: 0.8,
      other: 0.5,
    };
    return strengths[eventType] || 0.5;
  }
  
  /**
   * Get discovered patterns
   */
  getPatterns(): PatternCorrelation[] {
    return [...this.patterns].sort((a, b) => b.confidence - a.confidence);
  }
  
  /**
   * Get patterns filtered by type
   */
  getPatternsByType(type: PatternCorrelation['patternType']): PatternCorrelation[] {
    return this.patterns.filter(p => p.patternType === type);
  }
  
  /**
   * Get patterns relevant to current celestial snapshot
   */
  getRelevantPatterns(snapshot: CelestialSnapshot): PatternCorrelation[] {
    return this.patterns.filter(pattern => {
      // Check if this pattern matches current conditions
      switch (pattern.patternType) {
        case 'transit':
          return snapshot.transits.some(t => 
            pattern.celestialSignature.includes(`${t.transitingPlanet}-${t.aspect}-${t.natalPlanet}`)
          );
        case 'moonPhase':
          return pattern.celestialSignature.includes(snapshot.moonPhase);
        case 'retrograde':
          return pattern.celestialSignature.split('-')[1] && 
            snapshot.retrogrades.includes(pattern.celestialSignature.split('-')[1]);
        case 'voidMoon':
          return snapshot.voidMoon?.isVoid;
        default:
          return true;
      }
    });
  }
  
  /**
   * Get personal pattern profile
   */
  getProfile(): PersonalPatternProfile {
    const patterns = this.getPatterns();
    const events = this.getEvents();
    
    // Calculate dominant themes
    const themeCounts = new Map<string, number>();
    patterns.forEach(p => {
      themeCounts.set(p.patternType, (themeCounts.get(p.patternType) || 0) + 1);
    });
    const dominantThemes = Array.from(themeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([theme]) => theme);
    
    // Get sensitive transits (patterns with high confidence)
    const sensitiveTransits = patterns
      .filter(p => p.patternType === 'transit' && p.confidence > 60)
      .slice(0, 5)
      .map(p => p.description);
    
    // Calculate learning progress
    const learningProgress = Math.min(100, (events.length / 50) * 100);
    
    return {
      userId: 'default',
      totalEvents: events.length,
      patterns,
      dominantThemes,
      sensitiveTransits,
      favorablePeriods: this.getFavorablePeriods(),
      challengingPeriods: this.getChallengingPeriods(),
      learningProgress,
    };
  }
  
  /**
   * Get favorable periods based on patterns
   */
  private getFavorablePeriods(): string[] {
    const favorable: string[] = [];
    
    // Check for breakthrough patterns
    const breakthroughPatterns = this.patterns.filter(p => 
      p.supportingEvents.some(e => e.type === 'breakthrough')
    );
    
    breakthroughPatterns.forEach(p => {
      if (p.patternType === 'moonPhase') {
        favorable.push(p.description);
      }
    });
    
    return favorable.slice(0, 3);
  }
  
  /**
   * Get challenging periods based on patterns
   */
  private getChallengingPeriods(): string[] {
    const challenging: string[] = [];
    
    const challengePatterns = this.patterns.filter(p => 
      p.supportingEvents.some(e => e.type === 'challenge')
    );
    
    challengePatterns.forEach(p => {
      if (p.patternType === 'transit') {
        challenging.push(p.description);
      }
    });
    
    return challenging.slice(0, 3);
  }
  
  /**
   * Clear all data (for testing or user request)
   */
  clearAll(): void {
    this.events = [];
    this.patterns = [];
    this.snapshots.clear();
    this.saveToStorage();
  }
  
  /**
   * Export data for backup
   */
  exportData(): string {
    return JSON.stringify({
      events: this.events,
      patterns: this.patterns,
      exportDate: new Date().toISOString(),
      version: '1.0',
    });
  }
  
  /**
   * Import data from backup
   */
  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.events && parsed.patterns) {
        this.events = parsed.events.map((e: any) => ({
          ...e,
          date: new Date(e.date),
        }));
        this.patterns = parsed.patterns.map((p: any) => ({
          ...p,
          discoveredAt: new Date(p.discoveredAt),
          lastUpdated: new Date(p.lastUpdated),
        }));
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import pattern data:', error);
      return false;
    }
  }
}

// Singleton instance
export const patternEngine = new PatternRecognitionEngine();

export default patternEngine;
