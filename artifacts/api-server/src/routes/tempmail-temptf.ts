import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ALLORIGINS = "https://api.allorigins.win/raw?url=";
const TEMPTF = "https://temp.tf";

function proxied(url: string): string {
  return ALLORIGINS + encodeURIComponent(url);
}

/** GET requests: try direct first, fall back to allorigins proxy on failure. */
async function temptfGet(path: string, timeoutMs = 10000): Promise<Response> {
  const directUrl = `${TEMPTF}${path}`;

  // Attempt 1: direct
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Math.min(timeoutMs, 6000));
    const r = await fetch(directUrl, { signal: ctrl.signal });
    clearTimeout(timer);
    if (r.ok) return r;
  } catch {}

  // Attempt 2: allorigins proxy
  const proxyUrl = proxied(directUrl);
  const ctrl2 = new AbortController();
  const timer2 = setTimeout(() => ctrl2.abort(), timeoutMs);
  try {
    return await fetch(proxyUrl, { signal: ctrl2.signal });
  } finally {
    clearTimeout(timer2);
  }
}

/** POST requests: try direct first, fall back to allorigins proxy on network failure. */
async function temptfPost(
  path: string,
  body: unknown,
  timeoutMs = 10000,
): Promise<Response> {
  const directUrl = `${TEMPTF}${path}`;

  // Attempt 1: direct
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Math.min(timeoutMs, 6000));
    const r = await fetch(directUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (r.ok || r.status < 500) return r;
  } catch {}

  // Attempt 2: allorigins proxy
  const proxyUrl = proxied(directUrl);
  const ctrl2 = new AbortController();
  const timer2 = setTimeout(() => ctrl2.abort(), timeoutMs);
  try {
    return await fetch(proxyUrl, { signal: ctrl2.signal });
  } finally {
    clearTimeout(timer2);
  }
}

// POST /api/temptf/generate
// Body: { type: "dot" | "plus" }
router.post("/temptf/generate", async (req, res) => {
  try {
    const type = (req.body as { type?: string })?.type ?? "dot";
    const params = new URLSearchParams({ providers: "gmail" });
    if (type === "plus") params.set("plus", "1"); else params.set("dot", "1");
    const r = await temptfGet(`/api/account?${params.toString()}`);
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
router.post("/temptf/check", async (req, res) => {
  try {
    const email = (req.body as { email?: string })?.email;
    if (!email) {
      res.status(400).json({ error: "email required" });
      return;
    }
    const r = await temptfPost("/api/check", { email });
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
