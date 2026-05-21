// Requires GROQ_API_KEY in Vercel environment variables
import { Router } from "express";
import { fetchWithGroqKeyRotation, hasGroqKeys } from "../lib/groq-keys";
import { AI_MAX_INPUT_CHARS } from "../middlewares/ai-protection";

const router = Router();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_TOKENS = 600;

// FIXED: AI Bio Generator - wrapped entire handler in try/catch
router.post("/generate-bio", async (req, res) => {
  try {
    const { topic, tone } = req.body as { topic?: string; tone?: string };

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      res.status(400).json({ error: "topic is required" });
      return;
    }

    if (topic.trim().length > AI_MAX_INPUT_CHARS) {
      res.status(400).json({ error: `topic must be ${AI_MAX_INPUT_CHARS} characters or fewer.` });
      return;
    }

    if (!hasGroqKeys()) {
      res.status(500).json({ error: "AI service is temporarily unavailable." });
      return;
    }

    const toneText =
      tone && tone.trim().length > 0 ? tone.trim() : "professional and engaging";

    const nonce = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const systemMessage = `You are an expert X (Twitter) bio copywriter known for producing wildly creative, memorable bios. Every set of 3 bios you write must be completely different from each other in angle, vocabulary, structure, and emotional tone. Never repeat phrasing across bios. Request ID: ${nonce}`;

    const userMessage = `Write 3 unique X (Twitter) bios for someone whose niche/topic is: "${topic.trim()}".
Tone style requested: ${toneText}.

Hard rules:
- Every bio must be 60–155 characters (not shorter, not longer)
- Each bio must take a completely different angle or hook (e.g., one bold statement, one question, one achievement-based)
- Use relevant emojis — but differently in each bio
- No two bios can share a sentence structure or opening word
- Do NOT write generic filler like "passionate about" or "lover of"

Return ONLY a raw JSON array of exactly 3 strings. No markdown, no explanation, no extra text.
Example: ["Bio one here", "Bio two here", "Bio three here"]`;

    const { res: apiRes, exhausted } = await fetchWithGroqKeyRotation((key) =>
      fetch(GROQ_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: MAX_TOKENS,
          temperature: 1.0,
          top_p: 0.95,
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
          ],
        }),
        signal: AbortSignal.timeout(20000),
      }),
    );

    if (exhausted || !apiRes.ok) {
      if (apiRes.status === 429) {
        res.status(429).json({ error: "Service is rate-limited. Please try again in a moment." });
        return;
      }
      const errData = (await apiRes.json().catch(() => ({}))) as { error?: { message?: string } };
      res.status(500).json({ error: errData?.error?.message ?? "AI service is temporarily unavailable." });
      return;
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = (await apiRes.json()) as typeof data;
    } catch {
      res.status(500).json({ error: "AI service is temporarily unavailable." });
      return;
    }
    const raw = (data.choices?.[0]?.message?.content ?? "").trim();

    let bios: string[] = [];
    try {
      const jsonStart = raw.indexOf("[");
      const jsonEnd = raw.lastIndexOf("]");
      const jsonStr = jsonStart !== -1 && jsonEnd !== -1 ? raw.slice(jsonStart, jsonEnd + 1) : raw;
      bios = JSON.parse(jsonStr);
    } catch {
      const matches = raw.match(/"([^"]{10,200})"/g);
      bios = matches ? matches.map((m: string) => m.replace(/^"|"$/g, "")) : [raw];
    }

    res.json({ bios: bios.slice(0, 3) });
  } catch (err) {
    req.log?.error({ err }, "generate-bio handler error");
    res.status(500).json({ error: "AI service is temporarily unavailable." });
  }
});

export default router;
