import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ALLORIGINS = "https://api.allorigins.win/raw?url=";
const ONESECMAIL = "https://www.1secmail.com/api/v1/";

function proxied(url: string): string {
  return ALLORIGINS + encodeURIComponent(url);
}

/** Try direct fetch first; if it fails, fall back to allorigins proxy. */
async function onesecFetch(params: Record<string, string>, timeoutMs = 10000): Promise<Response> {
  const qs = new URLSearchParams(params).toString();
  const directUrl = `${ONESECMAIL}?${qs}`;

  // Attempt 1: direct (no proxy)
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Math.min(timeoutMs, 5000));
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

function randomLogin(custom?: string): string {
  if (custom) return custom;
  const first = ["james","john","robert","michael","william","david","richard","joseph","thomas","charles","christopher","daniel","matthew","anthony","mark","ryan","jacob","mary","patricia","jennifer","linda","barbara","elizabeth","sarah","karen","lisa","emily","donna","michelle","ashley"];
  const last  = ["smith","johnson","williams","brown","jones","garcia","miller","davis","rodriguez","martinez","hernandez","lopez","gonzalez","wilson","anderson","taylor","moore","jackson","martin","lee","perez","thompson","white","harris","sanchez","clark","ramirez","lewis","robinson","walker"];
  const f = first[Math.floor(Math.random() * first.length)]!;
  const l = last[Math.floor(Math.random() * last.length)]!;
  const n = Math.floor(Math.random() * 900) + 10;
  const roll = Math.floor(Math.random() * 3);
  if (roll === 0) return `${f}.${l}`;
  if (roll === 1) return `${f}${l}`;
  return `${f}${l}${n}`;
}

// Static domain list — stable, no external call needed to create an address
const DOMAINS = ["1secmail.com", "1secmail.org", "1secmail.net"];

// GET /onesecmail/health — always healthy, /new is instant
router.get("/onesecmail/health", (_req, res) => {
  res.json({ ok: true });
});

// GET /onesecmail/new — instant: pure local generation, no external calls
router.get("/onesecmail/new", (req, res) => {
  const login  = randomLogin(req.query["login"] as string | undefined);
  const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)]!;
  res.json({ email: `${login}@${domain}`, login, domain });
});

// GET /onesecmail/inbox?login=...&domain=...
router.get("/onesecmail/inbox", async (req, res) => {
  const login  = req.query["login"]  as string | undefined;
  const domain = req.query["domain"] as string | undefined;
  if (!login || !domain) {
    res.status(400).json({ error: "login and domain required" });
    return;
  }
  try {
    const r = await onesecFetch({ action: "getMessages", login, domain });
    if (!r.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    const d = await r.json() as Array<{ id: number; from: string; subject: string; date: string }>;
    res.json(Array.isArray(d) ? d.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : []);
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /onesecmail/message/:id?login=...&domain=...
router.get("/onesecmail/message/:id", async (req, res) => {
  const { id } = req.params;
  const login  = req.query["login"]  as string | undefined;
  const domain = req.query["domain"] as string | undefined;
  if (!login || !domain) {
    res.status(400).json({ error: "login and domain required" });
    return;
  }
  try {
    const r = await onesecFetch({ action: "readMessage", login, domain, id });
    if (!r.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    const d = await r.json() as {
      id: number; from: string; subject: string; date: string;
      body?: string; htmlBody?: string; textBody?: string;
    };
    res.json(d);
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

export default router;
