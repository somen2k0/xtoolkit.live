import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ALLORIGINS = "https://api.allorigins.win/raw?url=";
const MAILDROP = "https://maildrop.cc/api";

function proxied(url: string): string {
  return ALLORIGINS + encodeURIComponent(url);
}

async function maildropFetch(path: string, timeoutMs = 10000): Promise<Response> {
  const url = proxied(`${MAILDROP}${path}`);
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

// GET /api/freemail/health
router.get("/api/freemail/health", async (_req, res) => {
  try {
    const r = await maildropFetch("/inbox/healthcheck", 8000);
    res.json({ ok: r.ok || r.status === 404 });
  } catch {
    res.json({ ok: false });
  }
});

// GET /api/freemail/new
router.get("/api/freemail/new", async (_req, res) => {
  try {
    const login = randomLogin();
    res.json({ email: `${login}@maildrop.cc`, login, domain: "maildrop.cc", token: login });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /api/freemail/inbox?token=...
router.get("/api/freemail/inbox", async (req, res) => {
  const token = req.query["token"] as string | undefined;
  if (!token) {
    res.status(400).json({ error: "token required" });
    return;
  }
  try {
    const r = await maildropFetch(`/inbox/${encodeURIComponent(token)}`);
    if (!r.ok) {
      res.status(502).json({ error: "Provider temporarily unavailable" });
      return;
    }
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

// GET /api/freemail/message/:id?token=...
router.get("/api/freemail/message/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.query["token"] as string | undefined;
  if (!token) {
    res.status(400).json({ error: "token required" });
    return;
  }
  try {
    const r = await maildropFetch(`/inbox/${encodeURIComponent(token)}/${encodeURIComponent(id)}`);
    if (!r.ok) {
      res.status(502).json({ error: "Provider temporarily unavailable" });
      return;
    }
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
