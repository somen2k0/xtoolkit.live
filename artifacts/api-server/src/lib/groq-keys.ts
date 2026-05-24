// ── Groq API key pool — stateless shuffle-and-try-all ────────────────────────
// Keys are read once at module load. On each request, keys are shuffled so
// different serverless invocations don't all start with the same key.
// On 429 or 5xx the next key is tried immediately within the same request.
// No cooldown state is needed — stateless, safe for serverless environments.
// ─────────────────────────────────────────────────────────────────────────────

const keys = (process.env.GROQ_API_KEY ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function makeGroqRequest(body: object): Promise<Response> {
  if (keys.length === 0) {
    throw new Error("No GROQ API keys configured");
  }

  // Shuffle so concurrent serverless invocations don't pile onto the same key
  const shuffled = [...keys].sort(() => Math.random() - 0.5);
  let lastError: Error = new Error("All keys failed");

  for (const key of shuffled) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });

      // Rate limited — try next key immediately
      if (res.status === 429) {
        console.log(`Key ${key.substring(0, 8)}... rate limited, trying next`);
        continue;
      }

      // Invalid/expired key — try next key
      if (res.status === 401) {
        console.log(`Key ${key.substring(0, 8)}... unauthorized, trying next`);
        continue;
      }

      // Server error — try next key
      if (!res.ok && res.status >= 500) {
        continue;
      }

      // Success or other client error (4xx) — return as-is
      return res;
    } catch (err) {
      lastError = err as Error;
      console.log(`Key ${key.substring(0, 8)}... failed: ${lastError.message}`);
      continue;
    }
  }

  // All keys exhausted
  throw lastError;
}

// Kept for backwards compatibility
export function getNextGroqKey(): string {
  return keys[Math.floor(Math.random() * keys.length)] ?? "";
}

export function getGroqKeys(): string[] {
  return keys;
}
