import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ALLORIGINS = "https://api.allorigins.win/raw?url=";
const MAILDROP_GRAPHQL = "https://api.maildrop.cc/graphql";

function proxied(url: string): string {
  return ALLORIGINS + encodeURIComponent(url);
}

async function gqlFetch(query: string, timeoutMs = 10000): Promise<Response> {
  const body = JSON.stringify({ query });
  const headers = { "Content-Type": "application/json", Accept: "application/json" };

  // Attempt 1: direct
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Math.min(timeoutMs, 6000));
    const r = await fetch(MAILDROP_GRAPHQL, {
      method: "POST",
      headers,
      body,
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (r.ok) return r;
  } catch {}

  // Attempt 2: allorigins proxy
  const proxyUrl = proxied(MAILDROP_GRAPHQL);
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

// GET /freemail/health
router.get("/freemail/health", (_req, res) => {
  res.json({ ok: true });
});

// GET /freemail/new
router.get("/freemail/new", (req, res) => {
  const login = randomLogin(req.query["login"] as string | undefined);
  res.json({ email: `${login}@maildrop.cc`, login, domain: "maildrop.cc", token: login });
});

// GET /freemail/inbox?token=...
router.get("/freemail/inbox", async (req, res) => {
  const token = req.query["token"] as string | undefined;
  if (!token) { res.status(400).json({ error: "token required" }); return; }
  try {
    const query = `{ inbox(mailbox: ${JSON.stringify(token)}) { id headerfrom subject date } }`;
    const r = await gqlFetch(query);
    if (!r.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    type GqlMsg = { id: string; headerfrom?: string; subject?: string; date?: string };
    type GqlResp = { data?: { inbox?: GqlMsg[] }; errors?: unknown[] };
    const d = await r.json() as GqlResp;
    if (d.errors || !d.data?.inbox) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    const msgs = d.data.inbox.map(m => ({
      id: m.id,
      from: m.headerfrom ?? "",
      subject: m.subject ?? "",
      date: m.date ?? "",
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
    const query = `{ message(mailbox: ${JSON.stringify(token)}, id: ${JSON.stringify(id)}) { id headerfrom subject date html } }`;
    const r = await gqlFetch(query);
    if (!r.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    type GqlFullMsg = { id: string; headerfrom?: string; subject?: string; date?: string; html?: string };
    type GqlResp = { data?: { message?: GqlFullMsg }; errors?: unknown[] };
    const d = await r.json() as GqlResp;
    if (d.errors || !d.data?.message) { res.status(502).json({ error: "Message not found" }); return; }
    const m = d.data.message;
    res.json({
      id: m.id,
      from: m.headerfrom ?? "",
      subject: m.subject ?? "",
      date: m.date ?? "",
      body: m.html ?? "",
      isHtml: !!m.html,
    });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

export default router;
