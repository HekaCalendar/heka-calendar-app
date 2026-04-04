/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PERSONALIZED GUIDANCE ENGINE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The heart of Phase 2. Combines:
 * - Natal chart integration
 * - Transit calculations
 * - Template library (26K+ variations)
 * - Pattern recognition
 * - AI enhancement (optional)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { 
  getNatalChart, 
  calculateTransits, 
  type Transit, 
  type NatalChart,
  getDominantElement,
  getNatalThemes,
} from '../natal/natalChart';

import { 
  templateLibrary, 
  type PersonalizedReading,
} from './templates/templateLibrary';

import { 
  patternEngine, 
  type CelestialSnapshot,
  type PatternCorrelation,
} from '../patterns/patternRecognition';

import { 
  aiProviderManager,
  type AIRequest,
} from '../ai/aiProvider';

import type { CelestialBody } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type TimeFrame = 'daily' | 'weekly' | 'yearly';
export type LifeArea = 'career' | 'relationships' | 'health' | 'finances' | 'personalGrowth' | 'timing';

export interface PersonalizedGuidanceReading {
  timeframe: TimeFrame;
  date: Date;
  
  // Personal context
  natalChart: NatalChart | null;
  dominantElement: string | null;
  natalThemes: string[];
  
  // Current celestial weather
  transits: Transit[];
  moonPhase: string;
  moonSign: string;
  sunSign: string;
  retrogrades: string[];
  voidMoon?: {
    isVoid: boolean;
    lastAspect?: string;
  };
  
  // Generated guidance
  overallReading: PersonalizedReading;
  lifeAreaReadings: Record<LifeArea, PersonalizedReading>;
  
  // Pattern insights
  activePatterns: PatternCorrelation[];
  patternInsights: string[];
  
  // AI info
  aiProvider?: string;
  aiModel?: string;
  
  // Metadata
  generatedAt: Date;
  confidence: number;
}

export interface MorningBriefing {
  date: Date;
  greeting: string;
  celestialSnapshot: {
    moonPhase: string;
    moonSign: string;
    sunSign: string;
    keyTransit?: Transit;
    voidMoon: boolean;
  };
  themeOfTheDay: string;
  focusArea: LifeArea;
  guidance: PersonalizedReading;
  practicalSteps: string[];
  affirmation: string;
  patternMatches: PatternCorrelation[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONALIZED GUIDANCE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class PersonalizedGuidanceEngine {
  private cache = new Map<string, PersonalizedGuidanceReading>();
  private cacheExpiry = 3600000; // 1 hour
  private readonly MAX_CACHE_SIZE = 100; // Prevent unbounded memory growth
  
  /**
   * Generate complete personalized guidance
   */
  async generateGuidance(params: {
    timeframe: TimeFrame;
    date?: Date;
    positions: Record<string, CelestialBody>;
    moonPhase: { phase: string; sign?: string };
    retrogrades: string[];
    voidMoon?: { isVoid: boolean; lastAspect?: string };
    category?: LifeArea;
    useAI?: boolean;
  }): Promise<PersonalizedGuidanceReading> {
    const { 
      timeframe, 
      date = new Date(), 
      positions, 
      moonPhase,
      retrogrades,
      voidMoon,
      category,
      useAI = false,
    } = params;
    
    // Check cache
    const cacheKey = this.generateCacheKey(params);
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.generatedAt.getTime() < this.cacheExpiry) {
      return cached;
    }
    
    // Get natal chart
    const natalChart = getNatalChart();
    
    // Calculate personal context
    const dominantElement = natalChart ? getDominantElement(natalChart.elements) : null;
    const natalThemes = natalChart ? getNatalThemes(natalChart) : [];
    
    // Calculate transits
    const transits = natalChart ? calculateTransits(natalChart, positions) : [];
    
    // Create celestial snapshot for pattern matching
    const snapshot: CelestialSnapshot = {
      date,
      moonPhase: moonPhase.phase,
      moonSign: moonPhase.sign || 'unknown',
      sunSign: positions.sun?.sign || 'unknown',
      retrogrades,
      transits,
      voidMoon: voidMoon ? {
        isVoid: voidMoon.isVoid,
        lastAspect: voidMoon.lastAspect,
      } : undefined,
    };
    
    // Get active patterns
    const activePatterns = patternEngine.getRelevantPatterns(snapshot);
    const patternInsights = activePatterns.map(p => p.insight);
    
    // Generate overall reading
    const overallReading = await this.generateReading({
      planet: 'sun',
      sign: positions.sun?.sign || 'aries',
      moonPhase: moonPhase.phase,
      transit: transits[0],
      dominantElement: dominantElement || undefined,
      category,
      useAI,
    });
    
    // Generate life area readings
    const lifeAreaReadings: Partial<Record<LifeArea, PersonalizedReading>> = {};
    
    // Generate life area readings in parallel for performance
    const lifeAreas: LifeArea[] = ['career', 'relationships', 'health', 'finances', 'personalGrowth', 'timing'];
    const readingPromises = lifeAreas.map(async (area) => {
      const relevantTransit = this.findRelevantTransit(area, transits);
      const relevantPlanet = this.getPlanetForLifeArea(area);
      
      const reading = await this.generateReading({
        planet: relevantPlanet,
        sign: positions[relevantPlanet]?.sign || 'aries',
        moonPhase: moonPhase.phase,
        transit: relevantTransit,
        dominantElement: dominantElement || undefined,
        category: area,
        useAI,
      });
      
      return { area, reading };
    });
    
    // Wait for all readings to complete (parallel execution)
    const results = await Promise.all(readingPromises);
    
    // Build the lifeAreaReadings map from results
    for (const { area, reading } of results) {
      lifeAreaReadings[area] = reading;
    }
    
    const reading: PersonalizedGuidanceReading = {
      timeframe,
      date,
      natalChart,
      dominantElement,
      natalThemes,
      transits,
      moonPhase: moonPhase.phase,
      moonSign: moonPhase.sign || 'unknown',
      sunSign: positions.sun?.sign || 'unknown',
      retrogrades,
      voidMoon,
      overallReading,
      lifeAreaReadings: lifeAreaReadings as Record<LifeArea, PersonalizedReading>,
      activePatterns,
      patternInsights,
      generatedAt: new Date(),
      confidence: this.calculateConfidence(natalChart, transits, activePatterns),
    };
    
    // Cache result with size limit enforcement (LRU eviction)
    this.enforceCacheSizeLimit();
    this.cache.set(cacheKey, reading);
    
    return reading;
  }
  
  /**
   * Generate morning briefing
   */
  async generateMorningBriefing(params: {
    positions: Record<string, CelestialBody>;
    moonPhase: { phase: string; sign?: string };
    retrogrades: string[];
    voidMoon?: { isVoid: boolean; lastAspect?: string };
    userName?: string;
    useAI?: boolean;
  }): Promise<MorningBriefing> {
    const { positions, moonPhase, retrogrades, voidMoon, userName, useAI = false } = params;
    const date = new Date();
    
    // Get natal chart
    const natalChart = getNatalChart();
    const transits = natalChart ? calculateTransits(natalChart, positions) : [];
    
    // Determine today's focus
    const focusArea = this.determineFocusArea(transits, moonPhase.phase);
    
    // Generate personalized greeting
    const hour = date.getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';
    if (userName) greeting += `, ${userName}`;
    
    // Get key transit
    const keyTransit = transits[0];
    
    // Generate guidance for focus area
    const relevantPlanet = this.getPlanetForLifeArea(focusArea);
    const guidance = await this.generateReading({
      planet: relevantPlanet,
      sign: positions[relevantPlanet]?.sign || 'aries',
      moonPhase: moonPhase.phase,
      transit: keyTransit,
      dominantElement: natalChart ? getDominantElement(natalChart.elements) || undefined : undefined,
      category: focusArea,
      useAI,
    });
    
    // Get pattern matches
    const snapshot: CelestialSnapshot = {
      date,
      moonPhase: moonPhase.phase,
      moonSign: moonPhase.sign || 'unknown',
      sunSign: positions.sun?.sign || 'unknown',
      retrogrades,
      transits,
    };
    const patternMatches = patternEngine.getRelevantPatterns(snapshot);
    
    // Determine theme
    const themeOfTheDay = this.determineTheme(moonPhase.phase, keyTransit, focusArea);
    
    // Generate practical steps
    const practicalSteps = this.generatePracticalSteps(focusArea, moonPhase.phase, keyTransit);
    
    return {
      date,
      greeting,
      celestialSnapshot: {
        moonPhase: moonPhase.phase,
        moonSign: moonPhase.sign || 'unknown',
        sunSign: positions.sun?.sign || 'unknown',
        keyTransit,
        voidMoon: voidMoon?.isVoid || false,
      },
      themeOfTheDay,
      focusArea,
      guidance,
      practicalSteps,
      affirmation: guidance.affirmation,
      patternMatches,
    };
  }
  
  /**
   * Generate a single reading
   */
  private async generateReading(params: {
    planet: string;
    sign: string;
    moonPhase: string;
    transit?: Transit;
    dominantElement?: string;
    category?: LifeArea;
    useAI?: boolean;
  }): Promise<PersonalizedReading> {
    const { planet, sign, moonPhase, transit, dominantElement, category, useAI } = params;
    
    // Get base template reading
    const templateReading = templateLibrary.generateReading({
      planet,
      sign,
      moonPhase,
      transit,
      userElement: dominantElement,
      category,
    });
    
    // If AI enabled, enhance
    if (useAI) {
      try {
        const aiRequest: AIRequest = {
          prompt: '',
          context: {
            planet,
            sign,
            moonPhase,
            transits: transit ? [transit] : [],
            userElement: dominantElement,
            category,
          },
          templateReading,
        };
        
        const aiResponse = await aiProviderManager.generateReading(aiRequest);
        return aiResponse.reading;
      } catch (error) {
        console.warn('AI enhancement failed, using template:', error);
        // Fall back to template
      }
    }
    
    return templateReading;
  }
  
  /**
   * Find most relevant transit for a life area
   */
  private findRelevantTransit(area: LifeArea, transits: Transit[]): Transit | undefined {
    const areaPlanets: Record<LifeArea, string[]> = {
      career: ['saturn', 'jupiter', 'sun', 'mars'],
      relationships: ['venus', 'moon', 'mars'],
      health: ['mars', 'sun', 'saturn', 'moon'],
      finances: ['jupiter', 'venus', 'saturn', 'pluto'],
      personalGrowth: ['sun', 'jupiter', 'uranus', 'neptune'],
      timing: ['moon', 'mercury', 'mars'],
    };
    
    const relevantPlanets = areaPlanets[area];
    return transits.find(t => relevantPlanets.includes(t.transitingPlanet));
  }
  
  /**
   * Get primary planet for life area
   */
  private getPlanetForLifeArea(area: LifeArea): string {
    const planetMap: Record<LifeArea, string> = {
      career: 'saturn',
      relationships: 'venus',
      health: 'mars',
      finances: 'jupiter',
      personalGrowth: 'sun',
      timing: 'moon',
    };
    return planetMap[area];
  }
  
  /**
   * Determine today's focus area based on transits and moon
   */
  private determineFocusArea(transits: Transit[], moonPhase: string): LifeArea {
    // Check for strong transits
    if (transits.length > 0) {
      const strongest = transits[0];
      if (strongest.transitingPlanet === 'saturn') return 'career';
      if (strongest.transitingPlanet === 'venus') return 'relationships';
      if (strongest.transitingPlanet === 'mars') return 'health';
      if (strongest.transitingPlanet === 'jupiter') return 'finances';
    }
    
    // Check moon phase
    if (moonPhase === 'new-moon') return 'personalGrowth';
    if (moonPhase === 'full-moon') return 'relationships';
    
    // Default based on day of week
    const day = new Date().getDay();
    const dayFocus: LifeArea[] = ['personalGrowth', 'career', 'timing', 'relationships', 'finances', 'health', 'personalGrowth'];
    return dayFocus[day];
  }
  
  /**
   * Determine theme of the day
   */
  private determineTheme(moonPhase: string, transit?: Transit, _focusArea?: LifeArea): string {
    const phaseThemes: Record<string, string> = {
      'new-moon': 'New Beginnings',
      'waxing-crescent': 'Building Momentum',
      'first-quarter': 'Taking Action',
      'waxing-gibbous': 'Refinement',
      'full-moon': 'Culmination',
      'waning-gibbous': 'Gratitude',
      'last-quarter': 'Release',
      'waning-crescent': 'Restoration',
    };
    
    if (!transit) return phaseThemes[moonPhase] || 'Flow';
    
    const transitThemes: Record<string, string> = {
      conjunction: 'Activation',
      sextile: 'Opportunity',
      square: 'Challenge',
      trine: 'Flow',
      opposition: 'Balance',
    };
    
    return `${phaseThemes[moonPhase] || 'Flow'} & ${transitThemes[transit.aspect] || 'Change'}`;
  }
  
  /**
   * Generate practical steps based on conditions
   */
  private generatePracticalSteps(focusArea: LifeArea, moonPhase: string, _transit?: Transit): string[] {
    const steps: string[] = [];
    
    // Area-specific steps
    const areaSteps: Record<LifeArea, string[]> = {
      career: [
        'Review your professional goals for the week',
        'Reach out to a mentor or colleague',
        'Update your resume or portfolio',
      ],
      relationships: [
        'Express appreciation to someone important',
        'Schedule quality time with loved ones',
        'Practice active listening today',
      ],
      health: [
        'Move your body for at least 20 minutes',
        'Prioritize a full night\'s sleep',
        'Choose nourishing foods',
      ],
      finances: [
        'Review your budget and recent spending',
        'Research one investment opportunity',
        'Set a specific savings goal',
      ],
      personalGrowth: [
        'Journal for 10 minutes',
        'Read something inspiring',
        'Practice 5 minutes of mindfulness',
      ],
      timing: [
        'List your top 3 priorities for today',
        'Batch similar tasks together',
        'Build in buffer time between activities',
      ],
    };
    
    steps.push(...areaSteps[focusArea].slice(0, 2));
    
    // Moon phase adjustment
    if (moonPhase === 'new-moon') {
      steps.push('Set intentions for the coming cycle');
    } else if (moonPhase === 'full-moon') {
      steps.push('Release what no longer serves you');
    }
    
    return steps.slice(0, 3);
  }
  
  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(
    natalChart: NatalChart | null,
    transits: Transit[],
    patterns: PatternCorrelation[]
  ): number {
    let confidence = 50; // Base confidence
    
    // Natal chart increases confidence significantly
    if (natalChart) confidence += 20;
    
    // More transits = more specificity
    confidence += Math.min(15, transits.length * 3);
    
    // Known patterns increase confidence
    confidence += Math.min(15, patterns.length * 5);
    
    return Math.min(100, confidence);
  }
  
  /**
   * Generate cache key
   * Includes useAI flag to prevent returning cached template readings when AI was requested
   */
  private generateCacheKey(params: any): string {
    const date = params.date || new Date();
    const dateStr = date.toISOString().split('T')[0];
    const aiFlag = params.useAI ? 'ai' : 'tmpl';
    return `${params.timeframe}-${dateStr}-${params.category || 'all'}-${aiFlag}`;
  }
  
  /**
   * Enforce cache size limit using LRU eviction
   * Removes oldest entries when cache exceeds MAX_CACHE_SIZE
   */
  private enforceCacheSizeLimit(): void {
    if (this.cache.size < this.MAX_CACHE_SIZE) {
      return;
    }
    
    // Remove oldest 20% of entries when limit reached
    const entriesToRemove = Math.floor(this.MAX_CACHE_SIZE * 0.2);
    const entries = Array.from(this.cache.entries());
    
    // Sort by generatedAt timestamp (oldest first)
    entries.sort((a, b) => a[1].generatedAt.getTime() - b[1].generatedAt.getTime());
    
    // Remove oldest entries
    for (let i = 0; i < entriesToRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache stats
   */
  getCacheStats(): { size: number } {
    return { size: this.cache.size };
  }
}

// Singleton instance
export const personalizedEngine = new PersonalizedGuidanceEngine();

export default personalizedEngine;
