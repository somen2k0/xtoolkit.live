import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ALLORIGINS = "https://api.allorigins.win/raw?url=";
const MAILDROP = "https://maildrop.cc/api";

function proxied(url: string): string {
  return ALLORIGINS + encodeURIComponent(url);
}

/** Fetch from Maildrop and verify we got a JSON response (their API sometimes
 *  returns the HTML SPA instead of JSON when the endpoint has moved). */
async function maildropFetch(path: string, timeoutMs = 10000): Promise<Response> {
  const directUrl = `${MAILDROP}${path}`;

  // Attempt 1: direct (no proxy)
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Math.min(timeoutMs, 5000));
    const r = await fetch(directUrl, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);
    // Reject HTML responses — means the API endpoint no longer exists
    const ct = r.headers.get("content-type") ?? "";
    if (r.ok && ct.includes("json")) return r;
  } catch {}

  // Attempt 2: allorigins proxy
  const proxyUrl = proxied(directUrl);
  const ctrl2 = new AbortController();
  const timer2 = setTimeout(() => ctrl2.abort(), timeoutMs);
  try {
    const r2 = await fetch(proxyUrl, { signal: ctrl2.signal });
    return r2;
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

// GET /freemail/health — always healthy, /new is instant
router.get("/freemail/health", (_req, res) => {
  res.json({ ok: true });
});

// GET /freemail/new — instant: pure local generation, no external calls
router.get("/freemail/new", (req, res) => {
  const login = randomLogin(req.query["login"] as string | undefined);
  res.json({ email: `${login}@maildrop.cc`, login, domain: "maildrop.cc", token: login });
});

// GET /freemail/inbox?token=...
router.get("/freemail/inbox", async (req, res) => {
  const token = req.query["token"] as string | undefined;
  if (!token) { res.status(400).json({ error: "token required" }); return; }
  try {
    const r = await maildropFetch(`/inbox/${encodeURIComponent(token)}`);
    if (!r.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    type MaildropMsg = { id: string; from?: string; fromFull?: string; subject?: string; date?: string };
    const d = await r.json() as MaildropMsg[];
    const msgs = Array.isArray(d) ? d.map(m => ({
      id: m.id,
      from: m.from ?? m.fromFull ?? "",
      subject: m.subject ?? "",
      date: m.date ?? "",
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
    res.json(msgs);
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /freemail/message/:id?token=...
router.get("/freemail/message/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.query["token"] as string | undefined;
  if (!token) { res.status(400).json({ error: "token required" }); return; }
  try {
    const r = await maildropFetch(`/inbox/${encodeURIComponent(token)}/${encodeURIComponent(id)}`);
    if (!r.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    const d = await r.json() as {
      id: string; from?: string; fromFull?: string; subject?: string; date?: string; body?: string; html?: string;
    };
    res.json({
      id: d.id,
      from: d.from ?? d.fromFull ?? "",
      subject: d.subject ?? "",
      date: d.date ?? "",
      body: d.html ?? d.body ?? "",
      isHtml: !!d.html,
    });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

export default router;
