/**
 * HEKA AI Proxy Client
 *
 * Sends AI chat requests through the backend proxy so provider API keys never
 * travel in the client bundle. Falls back to direct provider calls when no
 * proxy URL is configured.
 */

import { getAuth } from 'firebase/auth';

export type AIProxyProvider = 'groq' | 'openai' | 'anthropic' | 'moonshot';

export interface AIProxyMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProxyRequest {
  provider: AIProxyProvider;
  model?: string;
  messages: AIProxyMessage[];
  temperature?: number;
  max_tokens?: number;
  [key: string]: unknown;
}

export interface AIProxyResponse {
  choices?: Array<{
    message?: AIProxyMessage;
    index?: number;
    finish_reason?: string;
  }>;
  error?: { message?: string };
}

const DEFAULT_PROXY_URL = 'http://localhost:8787';

function getProxyUrl(): string {
  const configured = import.meta.env.VITE_AI_PROXY_URL;
  return configured ? String(configured).replace(/\/$/, '') : DEFAULT_PROXY_URL;
}

export function isAIProxyEnabled(): boolean {
  return !!import.meta.env.VITE_AI_PROXY_URL;
}

async function getIdToken(): Promise<string | null> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

export async function chatViaProxy(request: AIProxyRequest): Promise<AIProxyResponse> {
  const token = await getIdToken();
  if (!token) {
    throw new Error('Authentication required for AI proxy');
  }

  const url = `${getProxyUrl()}/api/v1/ai/chat`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as AIProxyResponse;
  if (!response.ok) {
    throw new Error(data.error?.message || `AI proxy error ${response.status}`);
  }
  return data;
}
