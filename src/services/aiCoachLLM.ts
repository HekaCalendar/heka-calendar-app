/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AI COACH LLM SERVICE — The HEKA Generative Oracle
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Integrates with Groq and Anthropic to generate truly one-of-a-kind
 * oracle messages for high-value moments. Responses are cached with TTL
 * to manage cost and latency.
 */

import { aiConfigService } from './aiConfigService';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  text: string;
  model: string;
  cached: boolean;
  fallbackReason?: string;
}

interface CacheEntry {
  text: string;
  timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 4; // 4 hours

function getCacheKey(messages: LLMMessage[]): string {
  // Simple hash of the user content for caching
  const content = messages.map((m) => `${m.role}:${m.content}`).join('|');
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return String(hash);
}

function getCached(key: string): string | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.text;
}

function setCached(key: string, text: string): void {
  responseCache.set(key, { text, timestamp: Date.now() });
  // Prevent unbounded growth
  if (responseCache.size > 200) {
    const first = responseCache.keys().next().value;
    if (first) responseCache.delete(first);
  }
}

// ── Smart fetch with retry ───────────────────────────────────────────────────

async function fetchWithRetry(
  url: string,
  options: Omit<RequestInit, 'signal'>,
  maxRetries = 1,
  timeoutMs = 15000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) return response;

      const status = response.status;
      // Attempt to read provider error body for diagnostics
      let errorBody = '';
      try {
        const cloned = response.clone();
        const body = await cloned.json();
        errorBody = body?.error?.message || body?.message || JSON.stringify(body);
      } catch {
        try { errorBody = await response.text(); } catch { /* ignore */ }
      }
      const errorMessage = errorBody ? `HTTP ${status}: ${errorBody}` : `HTTP ${status}: ${response.statusText}`;

      // Don't retry client errors (bad key, bad request) except 429 rate limit
      if (status >= 400 && status < 500 && status !== 429) {
        throw new Error(errorMessage);
      }
      // 429 or 5xx: retry once after delay
      if (attempt < maxRetries) {
        const delay = status === 429 ? 2000 : 1000 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw new Error(errorMessage);
    } catch (error) {
      clearTimeout(timeout);
      lastError = error instanceof Error ? error : new Error(String(error));
      // Retry on network errors (TypeError) and timeouts (AbortError)
      const isNetworkError = lastError.name === 'TypeError';
      const isTimeout = lastError.name === 'AbortError' || lastError.message.includes('timeout');
      if ((isNetworkError || isTimeout) && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
        continue;
      }
      break;
    }
  }

  throw lastError || new Error('Request failed after retries');
}

// ── Groq Integration ─────────────────────────────────────────────────────────

async function callGroq(apiKey: string, model: string, messages: LLMMessage[]): Promise<string> {
  const response = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.85,
      max_tokens: 180,
      top_p: 0.95,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// ── Anthropic Integration ────────────────────────────────────────────────────

async function callAnthropic(apiKey: string, model: string, messages: LLMMessage[]): Promise<string> {
  const systemMessage = messages.find((m) => m.role === 'system');
  const conversation = messages.filter((m) => m.role !== 'system');

  const response = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 180,
      temperature: 0.85,
      system: systemMessage?.content,
      messages: conversation,
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text?.trim() || '';
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function generateOracleMessage(
  context: {
    celestialState: string;
    transitSummary?: string;
    userArchetype?: string;
    moodTone?: string;
    pendingTasks: number;
    todayCompleted: number;
    streak: number;
    lastJournalSnippet?: string;
    occasion: 'daily-briefing' | 'synchronicity' | 'transit-alert' | 'celebration' | 'mood-support' | 'task-suggestion';
    location?: string;
    planetaryHour?: string;
    sunTimes?: string;
    season?: string;
    aspects?: string[];
    criticalDegrees?: string[];
    moonDetails?: string;
    lunarNodes?: string;
    chiron?: string;
    celestialGuidance?: string;
    zone?: string;
    writingStreak?: number;
    longestWritingStreak?: number;
    moodAverage?: number;
    totalNotes?: number;
    timeMode?: 'SYNC' | 'TRUE';
    zodiacFrame?: 'tropical' | 'sidereal';
    signCount?: 12 | 13;
  },
  fallbackText: string
): Promise<LLMResponse> {
  const config = aiConfigService.getConfig();
  const provider = config.provider;
  const apiKey = config.apiKey;

  if (!apiKey || provider === 'template') {
    // ── Template Library Path ──────────────────────────────────────────────
    // Instead of returning raw fallback text, weave the celestial guidance
    // (already computed by personalizedEngine) with occasion-specific context
    // to produce a rich, astrologically-informed coach message.
    const parts: string[] = [];

    // Base: celestial guidance already contains template-based reading
    if (context.celestialGuidance) {
      parts.push(context.celestialGuidance);
    }

    // Occasion-specific enhancement
    switch (context.occasion) {
      case 'daily-briefing':
        if (context.planetaryHour) {
          parts.push(`The ${context.planetaryHour}.`);
        }
        if (context.season) {
          parts.push(`${context.season}.`);
        }
        break;
      case 'mood-support':
        if (context.moodTone) {
          parts.push(`Your current mood — ${context.moodTone} — is held within this celestial field. The sky does not judge; it simply mirrors.`);
        }
        if (context.moonDetails) {
          parts.push(`${context.moonDetails}.`);
        }
        break;
      case 'transit-alert':
        if (context.transitSummary) {
          parts.push(`Active transit: ${context.transitSummary}.`);
        }
        break;
      case 'celebration':
        if (context.streak > 0) {
          parts.push(`${context.streak}-day streak — momentum is real. The cosmos rewards consistency.`);
        }
        break;
      case 'task-suggestion':
        if (context.pendingTasks > 0) {
          parts.push(`${context.pendingTasks} task${context.pendingTasks > 1 ? 's' : ''} waiting — align your next action with the prevailing energy.`);
        }
        break;
      case 'synchronicity':
        parts.push(`A pattern in the sky mirrors a pattern in your life. Pay attention to what repeats.`);
        break;
    }

    // User context weaving
    if (context.userArchetype) {
      parts.push(`As a ${context.userArchetype}, you navigate these currents with your own distinct rhythm.`);
    }
    if (context.lastJournalSnippet) {
      parts.push(`Your recent reflections echo here: "${context.lastJournalSnippet.slice(0, 120)}${context.lastJournalSnippet.length > 120 ? '...' : ''}"`);
    }

    // Fallback: if no celestial guidance, use the fallback text
    if (parts.length === 0) {
      parts.push(fallbackText);
    }

    const text = parts.filter(Boolean).join(' ');
    return { text, model: 'template', cached: false, fallbackReason: 'No API key configured' };
  }

  // ── Provider-specific system prompt tuning ───────────────────────────────
  // Each LLM has a different voice. We tune the system prompt to bring out
  // the best of each provider while keeping the HEKA oracle identity.
  const providerPersonas: Record<string, string> = {
    groq: 'You are warm, grounded, and slightly playful. Use vivid imagery.',
    openai: 'You are precise, insightful, and elegantly concise. Every word earns its place.',
    anthropic: 'You are deeply poetic, mythic, and emotionally resonant. You weave celestial metaphor with human truth.',
    ollama: 'You are thoughtful, calm, and gently mystical. Keep responses clear and warmly encouraging.',
  };
  const providerPersona = providerPersonas[provider] || providerPersonas.groq;

  const zoneInstruction = context.zone
    ? `The user is currently in the "${context.zone}" section of the app. Tailor your tone and focus to this context.`
    : '';

  const systemPrompt = `You are HEKA, a mystical, intelligent AI oracle who lives inside a 13-month calendar aligned with lunar and solar rhythms.
${providerPersona}
${zoneInstruction}
Rules:
- Write 1-2 sentences maximum (max 30 words ideally).
- Be poetic but precise.
- Synthesize all provided context into a single, coherent insight.
- Never use generic platitudes like "remember to" or "don't forget".
- Reference celestial events only when they naturally illuminate the message; do not force astrology into productivity, wellness, or social occasions.
- Match the user's archetype dialect if provided.
- If the user has a streak or recent achievements, celebrate them subtly.
- If the user seems stressed (many pending tasks, severe mood), offer gentle grounding, not more tasks.
- You may use **bold** for emphasis, *italic* for subtlety, and [links](url) for references.`;

  // ── Build conversational memory from recent coach interactions ───────────
  const userContext = aiConfigService.getUserContext();
  const recentMemory = userContext.coachMemory
    ?.slice(-5)
    .map((m: any) => `${m.type === 'llm' ? 'Oracle' : 'Guide'}: ${m.text.slice(0, 120)}`)
    .join('\n') || '';

  // ── Contextual intelligence: detect user patterns ─────────────────────────
  const memoryCount = userContext.coachMemory?.length || 0;
  const hoursSinceLastChat = userContext.lastCoachInteraction
    ? Math.round((Date.now() - userContext.lastCoachInteraction) / (1000 * 60 * 60))
    : 999;
  const isReturningUser = memoryCount > 3 && hoursSinceLastChat < 48;
  const isLongAbsence = hoursSinceLastChat > 72;

  let patternNote = '';
  if (isLongAbsence && memoryCount > 0) {
    patternNote = `The user has been away for ${hoursSinceLastChat} hours. Welcome them back warmly without guilt.`;
  } else if (isReturningUser) {
    patternNote = `The user has interacted ${memoryCount} times recently. Build continuity — reference their ongoing journey.`;
  }
  if (context.todayCompleted && context.todayCompleted > 0) {
    patternNote += ` They completed ${context.todayCompleted} task(s) today — acknowledge this.`;
  }
  if (context.pendingTasks && context.pendingTasks >= 5) {
    patternNote += ` They have ${context.pendingTasks} pending tasks — offer grounding, not more tasks.`;
  }
  if (context.writingStreak && context.writingStreak >= 3) {
    patternNote += ` They have a ${context.writingStreak}-day writing streak — celebrate this momentum.`;
  }
  if (context.moodAverage && context.moodAverage < 3) {
    patternNote += ` Their recent mood average is lower — offer gentle encouragement.`;
  }

  const signCount = context.signCount ?? (context.timeMode === 'TRUE' ? 13 : 12);

  let timeModeNote = '';
  if (context.timeMode === 'TRUE') {
    if (signCount === 13) {
      timeModeNote = 'The user is in TRUE HEKA mode — they are using 13-sign sidereal astrology (including Ophiuchus) and a 13-month calendar aligned to the fixed stars. Speak as if the civil calendar is a veil they have chosen to lift. Reference their sidereal birth chart if relevant.';
    } else {
      timeModeNote = 'The user is in TRUE HEKA mode — they are using 12-sign sidereal astrology (Vedic-style, aligned to the fixed stars) and a calendar tuned to stellar time. Speak as if the civil calendar is a veil they have chosen to lift. Reference their sidereal birth chart if relevant.';
    }
  } else if (context.timeMode === 'SYNC') {
    timeModeNote = 'The user is in SYNC mode — their calendar aligns with the civil Gregorian calendar. Keep astrology references in the tropical zodiac.';
  }

  const userPrompt = `Occasion: ${context.occasion}
Zone: ${context.zone || 'unknown'}
Celestial weather: ${context.celestialState}
${context.aspects?.length ? `Live aspects: ${context.aspects.join('; ')}` : ''}
${context.criticalDegrees?.length ? `Critical degrees: ${context.criticalDegrees.join('; ')}` : ''}
${context.moonDetails ? `Moon details: ${context.moonDetails}` : ''}
${context.lunarNodes ? `Lunar nodes: ${context.lunarNodes}` : ''}
${context.chiron ? `Chiron: ${context.chiron}` : ''}
${context.celestialGuidance ? `Celestial guidance summary: ${context.celestialGuidance}` : ''}
User archetype: ${context.userArchetype || 'unknown'}
Mood tone: ${context.moodTone || 'neutral'}
Pending tasks: ${context.pendingTasks}
Tasks completed today: ${context.todayCompleted}
Current streak: ${context.streak}
${context.transitSummary ? `Personal transit: ${context.transitSummary}` : ''}
${context.lastJournalSnippet ? `Recent journal theme: ${context.lastJournalSnippet.slice(0, 200)}` : ''}
${context.location ? `Location: ${context.location}` : ''}
${context.planetaryHour ? `Planetary hour: ${context.planetaryHour}` : ''}
${context.sunTimes ? `Sun times: ${context.sunTimes}` : ''}
${context.season ? `Season: ${context.season}` : ''}
${timeModeNote ? `\nTime mode context: ${timeModeNote}` : ''}
${patternNote ? `\nContext: ${patternNote}` : ''}
${recentMemory ? `\nRecent oracle memory:\n${recentMemory}` : ''}

Generate the oracle message:`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const cacheKey = getCacheKey(messages);
  const cached = getCached(cacheKey);
  if (cached) {
    return { text: cached, model: config.model || provider, cached: true };
  }

  try {
    let text = '';
    const model = config.model || (provider === 'groq' ? 'llama-3.1-8b-instant' : provider === 'openai' ? 'gpt-4o-mini' : provider === 'ollama' ? 'llama3.2' : 'claude-3-haiku-20240307');

    if (provider === 'groq') {
      text = await callGroq(apiKey, model, messages);
    } else if (provider === 'openai') {
      const response = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.85,
          max_tokens: 180,
          top_p: 0.95,
        }),
      });
      const data = await response.json();
      text = data.choices?.[0]?.message?.content?.trim() || '';
    } else if (provider === 'anthropic') {
      text = await callAnthropic(apiKey, model, messages);
    } else if (provider === 'ollama') {
      // apiKey for Ollama is actually the base URL (e.g., http://localhost:11434)
      const ollamaUrl = (apiKey || 'http://localhost:11434').replace(/\/$/, '');
      const response = await fetchWithRetry(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: false,
          options: { temperature: 0.85, num_predict: 180 },
        }),
      });
      const data = await response.json();
      text = data.message?.content?.trim() || '';
    }

    if (!text || text.length < 10) {
      return { text: fallbackText, model, cached: false, fallbackReason: 'Response too short or empty' };
    }

    setCached(cacheKey, text);
    return { text, model, cached: false };
  } catch (error) {
    console.error('[AICoachLLM] Generation failed:', error);
    const reason = error instanceof Error ? error.message : 'Provider unavailable';
    return { text: fallbackText, model: 'fallback', cached: false, fallbackReason: reason };
  }
}

export function clearLLMCache(): void {
  responseCache.clear();
}

export function getLLMCacheSize(): number {
  return responseCache.size;
}
