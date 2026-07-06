import { Router } from "express";
import { makeGroqRequest } from "../lib/groq-keys";

const router = Router();

router.post("/resume/suggest-bullets", async (req, res) => {
  try {
    const { position, company } = req.body as { position?: string; company?: string };

    if (!position || typeof position !== "string" || position.trim().length === 0) {
      res.status(400).json({ error: "position is required" });
      return;
    }

    const companyText = company && company.trim().length > 0 ? ` at ${company.trim()}` : "";

    let apiRes: Response;
    try {
      apiRes = await makeGroqRequest({
        model: "llama-3.3-70b-versatile",
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: `Generate 4 professional resume bullet points for a ${position.trim()}${companyText}.
Each bullet should:
- Start with a strong action verb (Engineered, Led, Reduced, Increased, Developed, etc.)
- Include measurable impact where possible (%, $, time saved, team size)
- Be ATS-friendly
- Be 1-2 lines maximum
Return ONLY a JSON array of strings, no other text.
Example: ["Led cross-functional team of 8 to deliver product on schedule", "Reduced page load time by 40% through code splitting"]`,
          },
        ],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("No GROQ API keys")) {
        res.status(503).json({ error: "AI features are not configured." });
      } else {
        res.status(429).json({ error: "AI rate limit reached. Please wait 30 seconds." });
      }
      return;
    }

    if (!apiRes.ok) {
      res.status(500).json({ error: "AI service temporarily unavailable." });
      return;
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = (await apiRes.json()) as typeof data;
    } catch {
      res.status(500).json({ error: "AI service temporarily unavailable." });
      return;
    }

    const raw = (data.choices?.[0]?.message?.content ?? "").trim();
    let bullets: string[] = [];
    try {
      const jsonStart = raw.indexOf("[");
      const jsonEnd = raw.lastIndexOf("]");
      const jsonStr = jsonStart !== -1 && jsonEnd !== -1 ? raw.slice(jsonStart, jsonEnd + 1) : raw;
      bullets = JSON.parse(jsonStr);
    } catch {
      const matches = raw.match(/"([^"]{10,300})"/g);
      bullets = matches ? matches.map((m: string) => m.replace(/^"|"$/g, "")) : [];
    }

    res.json({ bullets: bullets.slice(0, 5) });
  } catch (err) {
    req.log?.error({ err }, "resume suggest-bullets error");
    res.status(500).json({ error: "AI service temporarily unavailable." });
  }
});

export default router;
