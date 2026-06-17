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
import { guidanceHistoryService } from './guidanceHistoryService';
import { aiConfigService } from '../../../services/aiConfigService';

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
  
  // Fallback tracking
  aiFallbackReason?: string;
  planetaryHour?: string;
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
  planetaryHour?: string;
  aiFallbackReason?: string;
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
    planetaryHour?: string;
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
      planetaryHour,
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
    
    // Sort transits by strength for better selection
    const sortedTransits = this.getStrongestTransits(transits);
    
    // Track AI fallback
    let aiFallbackReason: string | undefined;
    
    // Gather journal context for cross-linking
    const userContext = aiConfigService.getUserContext();
    const journalThemes = userContext.lastJournalThemes.length > 0 
      ? userContext.lastJournalThemes 
      : undefined;
    const journalSnippet = userContext.lastJournalSnippet;
    
    // Generate holistic overall reading based on timeframe
    let overallReading: PersonalizedReading;
    
    if (timeframe === 'weekly') {
      overallReading = templateLibrary.synthesizeWeekly({
        positions,
        moonPhase,
        retrogrades,
        dominantElement: dominantElement || undefined,
        transits: sortedTransits,
        planetaryHour,
        journalThemes,
      });
    } else if (timeframe === 'yearly') {
      overallReading = templateLibrary.synthesizeYearly({
        positions,
        moonPhase,
        retrogrades,
        dominantElement: dominantElement || undefined,
        transits: sortedTransits,
        journalThemes,
      });
    } else {
      overallReading = templateLibrary.synthesizeSnapshot({
        positions,
        moonPhase,
        retrogrades,
        dominantElement: dominantElement || undefined,
        transits: sortedTransits,
        planetaryHour,
        journalThemes,
      });
    }
    
    // AI enhancement for overall reading if enabled
    if (useAI) {
      try {
        const aiRequest: AIRequest = {
          prompt: this.buildRichPrompt({
            positions,
            moonPhase,
            retrogrades,
            dominantElement: dominantElement || undefined,
            transits: sortedTransits,
            category: 'overall',
            planetaryHour,
            journalThemes,
            journalSnippet,
            timeframe,
          }),
          context: {
            planet: 'sun',
            sign: positions.sun?.sign || 'aries',
            moonPhase: moonPhase.phase,
            transits: sortedTransits.slice(0, 3),
            userElement: dominantElement || undefined,
            category,
          },
          templateReading: overallReading,
        };
        const aiResponse = await aiProviderManager.generateReading(aiRequest);
        overallReading = aiResponse.reading;
      } catch (error) {
        aiFallbackReason = error instanceof Error ? error.message : 'AI provider unavailable';
        console.warn('AI enhancement failed for overall reading, using template:', error);
      }
    }
    
    // Generate life area readings
    const lifeAreaReadings: Partial<Record<LifeArea, PersonalizedReading>> = {};
    
    // Generate life area readings in parallel for performance
    const lifeAreas: LifeArea[] = ['career', 'relationships', 'health', 'finances', 'personalGrowth', 'timing'];
    const readingPromises = lifeAreas.map(async (area) => {
      const relevantTransit = this.findRelevantTransit(area, sortedTransits);
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
      aiFallbackReason,
      planetaryHour,
    };
    
    // Save to history
    guidanceHistoryService.saveReading(reading);
    
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
    planetaryHour?: string;
  }): Promise<MorningBriefing> {
    const { positions, moonPhase, retrogrades, voidMoon, userName, useAI = false, planetaryHour } = params;
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
    
    // Sort transits by strength and get the most potent one
    const sortedTransits = this.getStrongestTransits(transits);
    const keyTransit = sortedTransits[0];
    
    // Generate guidance for focus area
    let aiFallbackReason: string | undefined;
    const relevantPlanet = this.getPlanetForLifeArea(focusArea);
    const guidance = await this.generateReading({
      planet: relevantPlanet,
      sign: positions[relevantPlanet]?.sign || 'aries',
      moonPhase: moonPhase.phase,
      transit: keyTransit,
      dominantElement: natalChart ? getDominantElement(natalChart.elements) || undefined : undefined,
      category: focusArea,
      useAI,
    }).catch((err) => {
      aiFallbackReason = err instanceof Error ? err.message : 'AI provider unavailable';
      // Return template reading on any error
      return templateLibrary.generateReading({
        planet: relevantPlanet,
        sign: positions[relevantPlanet]?.sign || 'aries',
        moonPhase: moonPhase.phase,
        transit: keyTransit,
        userElement: natalChart ? getDominantElement(natalChart.elements) || undefined : undefined,
        category: focusArea,
      });
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
    
    const briefing: MorningBriefing = {
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
      planetaryHour,
      aiFallbackReason,
    };
    
    guidanceHistoryService.saveBriefing(briefing);
    
    return briefing;
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
          prompt: this.buildRichPrompt({
            planet,
            sign,
            moonPhase,
            transit,
            dominantElement,
            category,
          }),
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
      career: ['saturn', 'jupiter', 'sun', 'mars', 'pluto'],
      relationships: ['venus', 'moon', 'mars', 'pluto'],
      health: ['mars', 'sun', 'saturn', 'moon', 'pluto'],
      finances: ['jupiter', 'venus', 'saturn', 'pluto', 'uranus'],
      personalGrowth: ['sun', 'jupiter', 'uranus', 'neptune', 'pluto'],
      timing: ['moon', 'mercury', 'mars', 'uranus'],
    };
    
    const sortedTransits = this.getStrongestTransits(transits);
    const relevantPlanets = areaPlanets[area];
    return sortedTransits.find(t => relevantPlanets.includes(t.transitingPlanet));
  }
  
  /**
   * Score a transit by orb, aspect type, planet importance, and applying status
   */
  private scoreTransit(transit: Transit): number {
    let score = 0;
    
    // Orb: closer is stronger (max 10°)
    const orb = Math.min(transit.orb, 10);
    score += (10 - orb) * 12; // 0-120
    
    // Applying transits are more potent
    if (transit.applying) score += 30;
    
    // Aspect weights
    const aspectWeights: Record<string, number> = {
      conjunction: 45,
      opposition: 40,
      square: 35,
      trine: 25,
      sextile: 18,
      quincunx: 12,
      semisextile: 8,
    };
    score += aspectWeights[transit.aspect] || 10;
    
    // Planet importance weights
    const planetWeights: Record<string, number> = {
      pluto: 22, saturn: 20, uranus: 18, neptune: 18,
      jupiter: 15, mars: 12, sun: 12, venus: 10, mercury: 8, moon: 6,
    };
    score += planetWeights[transit.transitingPlanet] || 5;
    
    return score;
  }
  
  /**
   * Return transits sorted by strength (strongest first)
   */
  private getStrongestTransits(transits: Transit[]): Transit[] {
    return [...transits].sort((a, b) => this.scoreTransit(b) - this.scoreTransit(a));
  }
  
  /**
   * Build a rich prompt for AI providers
   */
  private buildRichPrompt(params: {
    positions?: Record<string, CelestialBody>;
    moonPhase?: string | { phase: string; sign?: string };
    retrogrades?: string[];
    dominantElement?: string;
    transits?: Transit[];
    planet?: string;
    sign?: string;
    transit?: Transit;
    category?: string;
    planetaryHour?: string;
    journalThemes?: string[];
    journalSnippet?: string;
    timeframe?: string;
  }): string {
    const parts: string[] = [];
    parts.push('You are a wise, warm astrological guide. Provide personalized guidance based on the following celestial data:');
    
    if (params.positions) {
      const pos = params.positions;
      const planetList = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
        .filter(p => pos[p])
        .map(p => `${p.charAt(0).toUpperCase() + p.slice(1)} in ${pos[p].sign.charAt(0).toUpperCase() + pos[p].sign.slice(1)}${pos[p].isRetrograde ? ' (Rx)' : ''}`);
      parts.push(`\nCurrent Planetary Positions:\n${planetList.join('\n')}`);
    }
    
    if (params.moonPhase) {
      const phaseStr = typeof params.moonPhase === 'string'
        ? params.moonPhase.replace(/-/g, ' ')
        : params.moonPhase.phase.replace(/-/g, ' ');
      parts.push(`\nMoon Phase: ${phaseStr}`);
      if (typeof params.moonPhase === 'object' && params.moonPhase.sign) {
        parts.push(`Moon Sign: ${params.moonPhase.sign}`);
      }
    }
    
    if (params.retrogrades && params.retrogrades.length > 0) {
      parts.push(`\nRetrograde Planets: ${params.retrogrades.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}`);
    }
    
    if (params.dominantElement) {
      parts.push(`\nUser's Dominant Element: ${params.dominantElement}`);
    }
    
    if (params.transits && params.transits.length > 0) {
      parts.push(`\nKey Transits:`);
      params.transits.slice(0, 4).forEach(t => {
        parts.push(`- ${t.transitingPlanet.charAt(0).toUpperCase() + t.transitingPlanet.slice(1)} ${t.aspect} natal ${t.natalPlanet} (${t.orb.toFixed(1)}° ${t.applying ? 'applying' : 'separating'})`);
      });
    }
    
    if (params.planet && params.sign) {
      parts.push(`\nFocus Planet: ${params.planet.charAt(0).toUpperCase() + params.planet.slice(1)} in ${params.sign.charAt(0).toUpperCase() + params.sign.slice(1)}`);
    }
    
    if (params.transit) {
      parts.push(`Relevant Transit: ${params.transit.transitingPlanet.charAt(0).toUpperCase() + params.transit.transitingPlanet.slice(1)} ${params.transit.aspect} natal ${params.transit.natalPlanet}`);
    }
    
    if (params.category && params.category !== 'overall') {
      parts.push(`\nLife Area Focus: ${params.category}`);
    }
    
    parts.push('\nExpand the template guidance with poetic depth, practical wisdom, and warm specificity. Reference actual celestial positions in your response.');
    
    return parts.join('');
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
    const sortedTransits = this.getStrongestTransits(transits);
    if (sortedTransits.length > 0) {
      const strongest = sortedTransits[0];
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
