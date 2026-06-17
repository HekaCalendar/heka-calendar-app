# Secrets Rotation & AI Proxy

## Goal

Ensure no live AI provider API keys ship in the client bundle, and all AI calls
are routed through a backend proxy with rate limiting and prompt auditing.

## What changed

1. **Backend AI proxy** at `server/ai-proxy.js`.
   - Single endpoint: `POST /api/v1/ai/chat`
   - Firebase ID token verification via the Firebase Auth REST API (no service
     account required for serverless deployments)
   - Optional Firebase Admin SDK fallback + Firestore audit logging when
     `FIREBASE_SERVICE_ACCOUNT_JSON` is configured
   - Per-user rate limiting
   - Prompt/response audit logging to stdout + optional Firestore
   - Supports Groq, OpenAI, Anthropic, and Moonshot

2. **Vercel serverless deployment** for the proxy.
   - Entry point: `server/api/index.js`
   - Routes: `/health` and `/api/v1/ai/*`
   - Production URL: `https://server-hekaverse.vercel.app`
   - Deployment is driven from `server/vercel.json`

3. **Client proxy client** at `src/services/aiProxyClient.ts`.

4. **Proxy provider** in the astrology AI pipeline
   (`src/astrology/services/ai/aiProvider.ts`).
   - Auto-activates when `VITE_AI_PROXY_URL` is set.
   - Falls back to template provider if the proxy is unavailable.

5. **Environment templates**:
   - `.env.example` — client-side variables (no secrets).
   - `server/.env.server.example` — server-side AI keys and Firebase config.

## Required actions

1. **Rotate exposed keys**
   - In each AI provider dashboard, revoke any key that was previously used
     from the client or committed to `.env`.
   - Generate new keys and store them only in the server's environment
     (`AI_PROXY_GROQ_KEY`, `AI_PROXY_OPENAI_KEY`, etc.).

2. **Configure the proxy**
   - Copy `server/.env.server.example` to `server/.env.server` and fill in
     rotated keys.
   - Set `FIREBASE_PROJECT_ID` and `FIREBASE_API_KEY` (your public Firebase Web
     API key) so the proxy can verify Firebase ID tokens.
   - Optionally set `FIREBASE_SERVICE_ACCOUNT_JSON` to enable Firestore audit
     logging via the Admin SDK.

3. **Deploy the proxy**
   ```bash
   cd server
   vercel --prod
   ```
   Add the provider keys and `FIREBASE_PROJECT_ID` / `FIREBASE_API_KEY` as
   production environment variables in the Vercel dashboard (or with
   `vercel env add`).

4. **Point the client at the proxy**
   - Set `VITE_AI_PROXY_URL=https://server-hekaverse.vercel.app` in the client
     `.env` (or in your static-hosting environment variables).
   - Leave user-facing API key inputs empty; the proxy handles keys.

5. **Remove old client keys**
   - Delete `VITE_GROQ_API_KEY`, `VITE_OPENAI_API_KEY`, `VITE_ANTHROPIC_API_KEY`,
     and any other provider keys from the client `.env`.
   - Clear any keys stored in user secure storage (existing installs will keep
     them until cleared; consider a migration that wipes them on first run).

## Local development

```bash
# Terminal 1 — proxy server
cd server
node ai-proxy.js

# Terminal 2 — Vite dev server with proxy enabled
VITE_AI_PROXY_URL=http://localhost:8787 npm run dev
```

In dev mode the proxy accepts any Firebase ID token. Production mode verifies
tokens against Google's public Firebase JWKS or the Firebase Admin SDK when a
service account is provided.

## Audit logs

Each request produces a JSON line to stdout with `type: 'ai_audit'`. In
production, route these to your log aggregator. If `FIREBASE_SERVICE_ACCOUNT_JSON`
is set, a copy is also written to the `ai_audit_logs` Firestore collection.
