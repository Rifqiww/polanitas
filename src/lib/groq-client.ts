/**
 * POLANITAS — Groq SDK Client Factory
 * Server-side only. Each agent gets its own dedicated API key and client instance.
 * Keys are NEVER exposed to the browser.
 *
 * Agent key mapping:
 *   - researcher  → GROQ_API_KEY_MARKET_RESEARCH
 *   - strategist  → GROQ_API_KEY_STARTEGIST_CONTENT
 *   - analyst     → GROQ_API_KEY_DATA_ANALYTICS
 *   - tutor       → GROQ_API_KEY (general / learn module)
 */

import Groq from "groq-sdk";

// ── Singleton cache: one client per key ──────────────────────────────────────
const clientCache = new Map<string, Groq>();

function createClient(apiKey: string): Groq {
  if (clientCache.has(apiKey)) return clientCache.get(apiKey)!;
  const client = new Groq({ apiKey });
  clientCache.set(apiKey, client);
  return client;
}

// ── Named agent clients ──────────────────────────────────────────────────────

/** Agent 1 — Market Researcher */
export function getResearcherClient(): Groq {
  const key = process.env.GROQ_API_KEY_MARKET_RESEARCH;
  if (!key) throw new Error("GROQ_API_KEY_MARKET_RESEARCH is not set in .env.local");
  return createClient(key);
}

/** Agent 2 — Content Strategist */
export function getStrategistClient(): Groq {
  const key = process.env.GROQ_API_KEY_STARTEGIST_CONTENT;
  if (!key) throw new Error("GROQ_API_KEY_STARTEGIST_CONTENT is not set in .env.local");
  return createClient(key);
}

/** Agent 3 — Data Analyst (Eye-Tracking + Neuromarketing) */
export function getAnalystClient(): Groq {
  const key = process.env.GROQ_API_KEY_DATA_ANALYTICS;
  if (!key) throw new Error("GROQ_API_KEY_DATA_ANALYTICS is not set in .env.local");
  return createClient(key);
}

/** General — Speech-to-Text (Whisper) + misc tasks */
export function getGeneralClient(): Groq {
  const key = process.env.GROQ_API_KEY_GENERAL;
  if (!key) throw new Error("GROQ_API_KEY_GENERAL is not set in .env.local");
  return createClient(key);
}

// ── Shared constants ─────────────────────────────────────────────────────────
export const GROQ_MODEL = "llama-3.3-70b-versatile" as const;

export const GROQ_DEFAULT_PARAMS = {
  model: GROQ_MODEL,
  temperature: 0.7 as number,
  max_tokens: 8192 as number,
};

interface GroqOverrides {
  temperature?: number;
  max_tokens?: number;
  model?: string;
}

// ── Generic chat helper ──────────────────────────────────────────────────────

/**
 * Single-turn chat completion using a specific Groq client instance.
 * Use the agent-specific helpers below for the pipeline agents.
 */
async function chatWithClient(
  client: Groq,
  systemPrompt: string,
  userMessage: string,
  overrides?: GroqOverrides
): Promise<string> {
  const response = await client.chat.completions.create({
    ...GROQ_DEFAULT_PARAMS,
    ...overrides,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty response.");
  return content;
}

// ── Convenience wrappers per agent ───────────────────────────────────────────

/** Researcher Agent chat — uses GROQ_API_KEY_MARKET_RESEARCH */
export async function researcherChat(
  systemPrompt: string,
  userMessage: string,
  overrides?: GroqOverrides
): Promise<string> {
  return chatWithClient(getResearcherClient(), systemPrompt, userMessage, overrides);
}

/** Strategist Agent chat — uses GROQ_API_KEY_STARTEGIST_CONTENT */
export async function strategistChat(
  systemPrompt: string,
  userMessage: string,
  overrides?: GroqOverrides
): Promise<string> {
  return chatWithClient(getStrategistClient(), systemPrompt, userMessage, overrides);
}

/** Analyst Agent chat — uses GROQ_API_KEY_DATA_ANALYTICS */
export async function analystChat(
  systemPrompt: string,
  userMessage: string,
  overrides?: GroqOverrides
): Promise<string> {
  return chatWithClient(getAnalystClient(), systemPrompt, userMessage, overrides);
}

/**
 * General / Tutor chat — uses GROQ_API_KEY.
 * Kept for backwards compatibility with learn-actions.ts.
 */
export async function groqChat(
  systemPrompt: string,
  userMessage: string,
  overrides?: GroqOverrides
): Promise<string> {
  return chatWithClient(getGroqClient(), systemPrompt, userMessage, overrides);
}
