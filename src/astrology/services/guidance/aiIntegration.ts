/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AI ENHANCEMENT FOR CELESTIAL GUIDANCE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Optional AI integration using OpenAI/Claude for rich, nuanced interpretations
 * Falls back to local engine if AI is unavailable
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GuidanceReading, CelestialSnapshot } from './analysisEngine';
import type { CelestialRegion } from './regions';

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model?: string;
  enabled: boolean;
}

export interface AIEnhancedReading extends GuidanceReading {
  aiGenerated?: boolean;
  poeticSummary?: string;
  affirmations?: string[];
  rituals?: string[];
  journalPrompts?: string[];
}

// Default to local processing
let aiConfig: AIConfig = {
  provider: 'local',
  enabled: false,
};

export function configureAI(config: AIConfig) {
  aiConfig = config;
  localStorage.setItem('ci-ai-config', JSON.stringify(config));
}

export function loadAIConfig(): AIConfig {
  const saved = localStorage.getItem('ci-ai-config');
  if (saved) {
    aiConfig = JSON.parse(saved);
  }
  return aiConfig;
}

/**
 * Enhance guidance with AI if configured and available
 */
export async function enhanceWithAI(
  baseReading: GuidanceReading,
  snapshot: CelestialSnapshot,
  region: CelestialRegion
): Promise<AIEnhancedReading> {
  // If AI not enabled, return base reading
  if (!aiConfig.enabled || !aiConfig.apiKey) {
    return enhanceLocally(baseReading);
  }
  
  try {
    const prompt = buildAIPrompt(baseReading, snapshot, region);
    
    if (aiConfig.provider === 'openai') {
      return await callOpenAI(prompt, baseReading);
    } else if (aiConfig.provider === 'anthropic') {
      return await callAnthropic(prompt, baseReading);
    }
  } catch (error) {
    console.warn('[AI Guidance] Failed to get AI enhancement, falling back to local:', error);
  }
  
  return enhanceLocally(baseReading);
}

/**
 * Build prompt for AI services
 */
function buildAIPrompt(
  reading: GuidanceReading,
  snapshot: CelestialSnapshot,
  region: CelestialRegion
): string {
  const planetList = Object.entries(snapshot.positions)
    .map(([id, p]) => `${id}: ${Math.floor(p.longitude / 30)}° ${(p.longitude % 30).toFixed(1)}' ${p.isRetrograde ? 'Rx' : ''}`)
    .join('\n');
  
  const aspectList = snapshot.aspects
    .slice(0, 5)
    .map(a => `${a.planet1} ${a.aspect} ${a.planet2} (orb: ${a.orb.toFixed(1)}°)`)
    .join('\n');
  
  return `You are an expert astrologer providing celestial guidance. Create a personalized, poetic reading based on the following astronomical data.

REGION: ${region.name} (${region.element} element, ${region.quality} modality)
TIME PERIOD: ${reading.timeframe}
MOON PHASE: ${snapshot.moonPhase.name} (${Math.round(snapshot.moonPhase.illumination * 100)}% illuminated)

PLANETARY POSITIONS:
${planetList}

MAJOR ASPECTS:
${aspectList}

SCORES (Career: ${reading.scores.career}/10, Relationships: ${reading.scores.relationships}/10, Health: ${reading.scores.health}/10, Finances: ${reading.scores.finances}/10, Growth: ${reading.scores.personalGrowth}/10)

Provide a response in this JSON format:
{
  "poeticSummary": "A 2-3 sentence poetic overview of the day's energy",
  "affirmations": ["3 powerful affirmations for this energy"],
  "rituals": ["2-3 simple rituals aligned with the celestial weather"],
  "journalPrompts": ["3 introspective questions"]
}

Tone should be mystical yet practical, empowering, and wise.`;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt: string, baseReading: GuidanceReading): Promise<AIEnhancedReading> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${aiConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: aiConfig.model || 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a wise astrologer providing celestial guidance.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.choices[0]?.message?.content || '{}';
  
  try {
    const aiContent = JSON.parse(content);
    return {
      ...baseReading,
      aiGenerated: true,
      poeticSummary: aiContent.poeticSummary,
      affirmations: aiContent.affirmations,
      rituals: aiContent.rituals,
      journalPrompts: aiContent.journalPrompts,
    };
  } catch {
    return { ...baseReading, aiGenerated: true, poeticSummary: content };
  }
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropic(prompt: string, baseReading: GuidanceReading): Promise<AIEnhancedReading> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': aiConfig.apiKey || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: aiConfig.model || 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.content[0]?.text || '{}';
  
  try {
    const aiContent = JSON.parse(content);
    return {
      ...baseReading,
      aiGenerated: true,
      poeticSummary: aiContent.poeticSummary,
      affirmations: aiContent.affirmations,
      rituals: aiContent.rituals,
      journalPrompts: aiContent.journalPrompts,
    };
  } catch {
    return { ...baseReading, aiGenerated: true, poeticSummary: content };
  }
}

/**
 * Local enhancement when AI is unavailable
 */
function enhanceLocally(reading: GuidanceReading): AIEnhancedReading {
  const affirmations = generateAffirmations(reading);
  const rituals = generateRituals(reading);
  const journalPrompts = generateJournalPrompts(reading);
  
  return {
    ...reading,
    aiGenerated: false,
    poeticSummary: generatePoeticSummary(reading),
    affirmations,
    rituals,
    journalPrompts,
  };
}

function generatePoeticSummary(reading: GuidanceReading): string {
  const scores = reading.scores;
  const highest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  
  if (reading.overallScore > 5) {
    return `The cosmos opens its arms to you today. ${highest[0].charAt(0).toUpperCase() + highest[0].slice(1)} shines with particular grace—move with confidence.`;
  }
  if (reading.overallScore < -5) {
    return `The celestial tides ask you to turn inward. In stillness, wisdom grows. ${highest[0]} offers quiet support.`;
  }
  return `Balance hangs in the sky today. Neither rushing forward nor standing still, find your rhythm in the middle way.`;
}

function generateAffirmations(reading: GuidanceReading): string[] {
  const affirmations: string[] = [];
  
  if (reading.scores.career > 0) {
    affirmations.push('I move through my work with cosmic confidence and clarity.');
  }
  if (reading.scores.relationships > 0) {
    affirmations.push('I attract and nurture connections that serve my highest good.');
  }
  if (reading.scores.personalGrowth > 0) {
    affirmations.push('I am expanding into the person I am meant to become.');
  }
  if (reading.scores.health > 0) {
    affirmations.push('My body is a temple, and I treat it with sacred care.');
  }
  if (reading.scores.finances > 0) {
    affirmations.push('Abundance flows to me as I align with universal law.');
  }
  
  if (affirmations.length < 3) {
    affirmations.push('I trust the timing of my life.');
    affirmations.push('I am exactly where I need to be.');
  }
  
  return affirmations.slice(0, 3);
}

function generateRituals(reading: GuidanceReading): string[] {
  const rituals: string[] = [];
  
  // Check lunar guidance for moon phase
  if (reading.lunarGuidance?.includes('New')) {
    rituals.push('Write intentions on paper and place under a candle.');
  } else if (reading.lunarGuidance?.includes('Full')) {
    rituals.push('Stand under the moon and release what no longer serves you.');
  }
  
  if (reading.scores.career > 5) {
    rituals.push('Light a gold candle and visualize your professional success.');
  }
  if (reading.scores.relationships > 5) {
    rituals.push('Hold rose quartz and send love to important people in your life.');
  }
  if (reading.scores.personalGrowth > 5) {
    rituals.push('Meditate for 10 minutes, focusing on your breath and expansion.');
  }
  
  if (rituals.length === 0) {
    rituals.push('Take a mindful walk and observe the sky.');
    rituals.push('Journal three things you are grateful for.');
  }
  
  return rituals.slice(0, 3);
}

function generateJournalPrompts(reading: GuidanceReading): string[] {
  const prompts: string[] = [];
  
  if (reading.scores.career !== 0) {
    prompts.push('What would I do if I knew I could not fail in my work?');
  }
  if (reading.scores.relationships !== 0) {
    prompts.push('What pattern in my relationships am I ready to transform?');
  }
  if (reading.scores.personalGrowth !== 0) {
    prompts.push('Who am I becoming, and what parts of me resist this growth?');
  }
  
  prompts.push('What is the cosmos trying to teach me today?');
  
  return prompts.slice(0, 3);
}

export default {
  configureAI,
  loadAIConfig,
  enhanceWithAI,
};
