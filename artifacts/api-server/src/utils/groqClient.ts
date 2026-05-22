// Groq API key pool — round-robin rotation with per-key cooldown on 429s.
// Set GROQ_API_KEY to a single key, or comma-separate multiple keys for rotation.
// NOTE: The routes in this project (bio-generator, ai-detector) use the more
// robust `fetchWithGroqKeyRotation` from lib/groq-keys.ts, which implements the
// same round-robin + cooldown logic. This file exposes an alternate interface
// for future use or direct consumption.

const keys = (process.env.GROQ_API_KEY || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean);

let currentIndex = 0;
const cooldowns = new Set<number>();

export function getNextGroqKey(): string {
  if (keys.length === 0) throw new Error('No GROQ API keys configured');

  for (let i = 0; i < keys.length; i++) {
    const idx = (currentIndex + i) % keys.length;
    if (!cooldowns.has(idx)) {
      currentIndex = (idx + 1) % keys.length;
      return keys[idx]!;
    }
  }

  // All keys in cooldown — use next anyway as last resort
  currentIndex = (currentIndex + 1) % keys.length;
  return keys[currentIndex]!;
}

export function markKeyCooldown(key: string, ms = 60000): void {
  const idx = keys.indexOf(key);
  if (idx === -1) return;
  cooldowns.add(idx);
  setTimeout(() => cooldowns.delete(idx), ms);
}

export async function makeGroqRequest(body: object): Promise<Response> {
  const key = getNextGroqKey();
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    markKeyCooldown(key);
    // Try next key immediately
    const nextKey = getNextGroqKey();
    return fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nextKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  return res;
}
