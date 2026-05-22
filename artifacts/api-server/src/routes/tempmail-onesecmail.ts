import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ALLORIGINS = "https://api.allorigins.win/raw?url=";
const ONESECMAIL = "https://www.1secmail.com/api/v1/";

function proxied(url: string): string {
  return ALLORIGINS + encodeURIComponent(url);
}

async function onesecFetch(params: Record<string, string>, timeoutMs = 10000): Promise<Response> {
  const qs = new URLSearchParams(params).toString();
  const url = proxied(`${ONESECMAIL}?${qs}`);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function randomLogin(): string {
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

const FALLBACK_DOMAINS = ["1secmail.com", "1secmail.org", "1secmail.net"];

// GET /api/onesecmail/health
router.get("/onesecmail/health", async (_req, res) => {
  try {
    const r = await onesecFetch({ action: "getDomainList" }, 8000);
    res.json({ ok: r.ok });
  } catch {
    res.json({ ok: false });
  }
});

// GET /api/onesecmail/new
router.get("/onesecmail/new", async (_req, res) => {
  try {
    let domains = FALLBACK_DOMAINS;
    try {
      const dr = await onesecFetch({ action: "getDomainList" }, 5000);
      if (dr.ok) {
        const dd = await dr.json() as string[];
        if (Array.isArray(dd) && dd.length > 0) domains = dd;
      }
    } catch {}
    const domain = domains[Math.floor(Math.random() * domains.length)]!;
    const login = randomLogin();
    res.json({ email: `${login}@${domain}`, login, domain });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /api/onesecmail/inbox?login=...&domain=...
router.get("/onesecmail/inbox", async (req, res) => {
  const login  = req.query["login"]  as string | undefined;
  const domain = req.query["domain"] as string | undefined;
  if (!login || !domain) {
    res.status(400).json({ error: "login and domain required" });
    return;
  }
  try {
    const r = await onesecFetch({ action: "getMessages", login, domain });
    if (!r.ok) {
      res.status(502).json({ error: "Provider temporarily unavailable" });
      return;
    }
    const d = await r.json() as Array<{ id: number; from: string; subject: string; date: string }>;
    res.json(Array.isArray(d) ? d.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : []);
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /api/onesecmail/message/:id?login=...&domain=...
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
    if (!r.ok) {
      res.status(502).json({ error: "Provider temporarily unavailable" });
      return;
    }
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
