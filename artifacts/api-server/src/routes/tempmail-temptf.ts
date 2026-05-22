import { Router, type IRouter } from "express";

const router: IRouter = Router();

const TEMPTF = "https://temp.tf";

async function temptfFetch(
  path: string,
  options: RequestInit,
  timeoutMs = 10000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${TEMPTF}${path}`, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

// POST /api/temptf/generate
// Body: { type: "dot" | "plus" }
router.post("/api/temptf/generate", async (req, res) => {
  try {
    const type = (req.body as { type?: string })?.type ?? "dot";
    const params = new URLSearchParams({ providers: "gmail" });
    if (type === "plus") params.set("plus", "1"); else params.set("dot", "1");
    const r = await temptfFetch(`/api/account?${params.toString()}`, { method: "GET" });
    if (!r.ok) {
      res.status(502).json({ error: "Provider temporarily unavailable" });
      return;
    }
    const d = await r.json() as { email?: string };
    res.json(d);
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// POST /api/temptf/check
// Body: { email: string }
router.post("/api/temptf/check", async (req, res) => {
  try {
    const email = (req.body as { email?: string })?.email;
    if (!email) {
      res.status(400).json({ error: "email required" });
      return;
    }
    const r = await temptfFetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!r.ok) {
      const d = await r.json().catch(() => ({})) as { error?: string };
      res.status(r.status).json({ error: d.error ?? "Provider temporarily unavailable" });
      return;
    }
    const d = await r.json();
    res.json(d);
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

export default router;
