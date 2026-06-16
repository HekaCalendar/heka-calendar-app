/**
 * HEKA AI Proxy Server
 *
 * Routes AI provider calls through a backend so API keys never reach the
 * client. Supports Firebase auth verification, per-user rate limiting, and
 * immutable prompt audit logging.
 *
 * Run: node server/ai-proxy.js
 */

const express = require('express');
const cors = require('cors');

let helmet;
try { helmet = require('helmet'); } catch { /* optional */ }

// Optional Firebase Admin for token verification and audit logging.
let admin;
try {
  admin = require('firebase-admin');
} catch { /* firebase-admin not installed */ }

const app = express();
if (helmet) app.use(helmet());
app.use(cors({ origin: process.env.AI_PROXY_CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '256kb' }));

const PORT = process.env.AI_PROXY_PORT || 8787;

const PROVIDER_CONFIG = {
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    keyEnv: 'AI_PROXY_GROQ_KEY',
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    bodyTransform: (body) => body,
    responseTransform: async (res) => res.json(),
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    keyEnv: 'AI_PROXY_OPENAI_KEY',
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    bodyTransform: (body) => body,
    responseTransform: async (res) => res.json(),
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    keyEnv: 'AI_PROXY_ANTHROPIC_KEY',
    authHeader: (key) => ({ 'x-api-key': key, 'anthropic-version': '2023-06-01' }),
    bodyTransform: (body) => body,
    responseTransform: async (res) => res.json(),
  },
  moonshot: {
    baseUrl: process.env.AI_PROXY_MOONSHOT_BASE || 'https://api.moonshot.ai/v1',
    keyEnv: 'AI_PROXY_MOONSHOT_KEY',
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    bodyTransform: (body) => body,
    responseTransform: async (res) => res.json(),
  },
};

// In-memory rate limiter (per user). Use Redis in production.
const rateLimiter = new Map();

function getRateLimitWindow() {
  const windowMinutes = parseInt(process.env.AI_PROXY_RATE_LIMIT_WINDOW_MINUTES || '60', 10);
  return windowMinutes * 60 * 1000;
}

function getMaxRequests() {
  return parseInt(process.env.AI_PROXY_RATE_LIMIT_MAX || '30', 10);
}

function checkRateLimit(userId) {
  const now = Date.now();
  const window = getRateLimitWindow();
  const max = getMaxRequests();

  let record = rateLimiter.get(userId);
  if (!record) {
    record = { count: 0, resetAt: now + window };
    rateLimiter.set(userId, record);
  }

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + window;
  }

  if (record.count >= max) {
    return { allowed: false, resetAt: record.resetAt, limit: max, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, resetAt: record.resetAt, limit: max, remaining: max - record.count };
}

async function verifyFirebaseTokenWithApi(token) {
  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('FIREBASE_API_KEY not configured');
  }
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token verification failed: ${response.status} ${text.slice(0, 200)}`);
  }
  const data = await response.json();
  const user = data.users?.[0];
  if (!user?.localId) {
    throw new Error('Token valid but no user record returned');
  }
  return { uid: user.localId, email: user.email };
}

async function verifyAuth(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return { authenticated: false, userId: null, error: 'Missing authorization token' };
  }

  // Development fallback: accept any non-empty token and hash it as userId.
  if (process.env.AI_PROXY_DEV_MODE === 'true') {
    const crypto = require('crypto');
    return { authenticated: true, userId: crypto.createHash('sha256').update(token).digest('hex') };
  }

  // Prefer Firebase Admin SDK when it has real credentials.
  if (admin && admin.apps.length > 0) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      return { authenticated: true, userId: decoded.uid };
    } catch (adminErr) {
      // Fall through to the public Firebase Auth REST API so serverless
      // deployments without a service account can still verify tokens.
      try {
        const decoded = await verifyFirebaseTokenWithApi(token);
        return { authenticated: true, userId: decoded.uid };
      } catch (apiErr) {
        return { authenticated: false, userId: null, error: `Invalid token: ${apiErr.message}` };
      }
    }
  }

  // Firebase Auth REST API fallback (no service account required).
  try {
    const decoded = await verifyFirebaseTokenWithApi(token);
    return { authenticated: true, userId: decoded.uid };
  } catch (err) {
    return { authenticated: false, userId: null, error: `Invalid token: ${err.message}` };
  }
}

function initFirebase() {
  if (!admin || admin.apps.length > 0) return;
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      : undefined;
    admin.initializeApp({
      credential: serviceAccount
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(),
    });
    console.log('[AI Proxy] Firebase Admin initialized');
  } catch (err) {
    console.warn('[AI Proxy] Firebase Admin initialization failed:', err.message);
  }
}

async function logAudit(record) {
  // Always log to stdout for observability.
  console.log(JSON.stringify({ type: 'ai_audit', ...record }));

  // Optional Firestore audit log.
  if (admin && admin.apps.length > 0) {
    try {
      const db = admin.firestore();
      await db.collection('ai_audit_logs').add({
        ...record,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.warn('[AI Proxy] Failed to write audit log:', err.message);
    }
  }
}

function sanitizeForAudit(messages) {
  if (!Array.isArray(messages)) return messages;
  return messages.map((m) => ({
    role: m.role,
    // Truncate very long prompts and strip obvious PII patterns.
    content:
      typeof m.content === 'string'
        ? m.content.slice(0, 2000).replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
        : m.content,
  }));
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, version: process.env.npm_package_version || '2.2.23' });
});

app.post('/api/v1/ai/chat', async (req, res) => {
  const startTime = Date.now();
  const { provider, model, messages, temperature, max_tokens, ...rest } = req.body || {};

  const auth = await verifyAuth(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Unauthorized', message: auth.error });
  }

  const userId = auth.userId;

  if (!provider || !PROVIDER_CONFIG[provider]) {
    return res.status(400).json({ error: 'Bad request', message: `Unsupported provider: ${provider}` });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Bad request', message: 'messages array required' });
  }

  const rate = checkRateLimit(userId);
  if (!rate.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      resetAt: rate.resetAt,
      limit: rate.limit,
    });
  }

  const config = PROVIDER_CONFIG[provider];
  const apiKey = process.env[config.keyEnv];
  if (!apiKey) {
    return res.status(503).json({ error: 'Service unavailable', message: `Provider ${provider} not configured` });
  }

  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  await logAudit({
    requestId,
    userId,
    provider,
    model: model || 'default',
    messages: sanitizeForAudit(messages),
    timestamp: new Date().toISOString(),
  });

  try {
    const body = config.bodyTransform({
      model: model || undefined,
      messages,
      temperature: temperature ?? 0.7,
      max_tokens: max_tokens ?? 500,
      ...rest,
    });

    const upstream = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.authHeader(apiKey),
      },
      body: JSON.stringify(body),
    });

    const status = upstream.status;
    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    await logAudit({
      requestId,
      userId,
      provider,
      model: model || 'default',
      status,
      latencyMs: Date.now() - startTime,
      responsePreview: typeof data === 'object' ? JSON.stringify(data).slice(0, 500) : String(data).slice(0, 500),
      timestamp: new Date().toISOString(),
    });

    res.status(status).json(data);
    res.setHeader('X-RateLimit-Limit', String(rate.limit));
    res.setHeader('X-RateLimit-Remaining', String(rate.remaining));
    res.setHeader('X-RateLimit-Reset', String(rate.resetAt));
  } catch (err) {
    console.error('[AI Proxy] Upstream error:', err);
    await logAudit({
      requestId,
      userId,
      provider,
      model: model || 'default',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
    res.status(502).json({ error: 'Upstream provider error', message: err.message });
  }
});

initFirebase();

// Start the HTTP server only when this file is the entry point. This lets
// Vercel/Railway/etc. import the Express app as a handler without binding a port.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[AI Proxy] Listening on http://localhost:${PORT}`);
    console.log(`[AI Proxy] Dev mode: ${process.env.AI_PROXY_DEV_MODE === 'true'}`);
    console.log(`[AI Proxy] CORS origin: ${process.env.AI_PROXY_CORS_ORIGIN || '*'}`);
  });
}

module.exports = app;
