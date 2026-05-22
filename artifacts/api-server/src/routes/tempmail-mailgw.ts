import { Router, type IRouter } from "express";

const router: IRouter = Router();

const MAILGW = "https://api.mail.gw";

async function gw(path: string, options: RequestInit = {}, timeoutMs = 10000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(`${MAILGW}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", Accept: "application/json", ...options.headers },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
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

function makePassword(login: string): string {
  return `Mx!${login.slice(0, 8)}9Zk`;
}

let cachedDomains: string[] = [];

async function getDomains(): Promise<string[]> {
  if (cachedDomains.length > 0) return cachedDomains;
  try {
    const r = await gw("/domains", {}, 8000);
    if (!r.ok) return ["oakon.com", "teihu.com"];
    const d = await r.json() as Array<{ domain: string; isActive?: boolean }>;
    const active = d.filter(x => x.isActive !== false).map(x => x.domain);
    if (active.length > 0) cachedDomains = active;
    return active.length > 0 ? active : ["oakon.com", "teihu.com"];
  } catch {
    return ["oakon.com", "teihu.com"];
  }
}

// GET /mailgw/health
router.get("/mailgw/health", async (_req, res) => {
  try {
    const r = await gw("/domains", {}, 6000);
    res.json({ ok: r.ok });
  } catch {
    res.json({ ok: false });
  }
});

// GET /mailgw/domains
router.get("/mailgw/domains", async (_req, res) => {
  try {
    const domains = await getDomains();
    res.json(domains);
  } catch {
    res.json(["oakon.com", "teihu.com"]);
  }
});

// POST /mailgw/new  (query params: login?, domain?)
// Creates a mail.gw account and returns { email, login, domain, token }
router.get("/mailgw/new", async (req, res) => {
  const login = randomLogin(req.query["login"] as string | undefined);
  let domain = req.query["domain"] as string | undefined;

  try {
    const domains = await getDomains();
    if (!domain || !domains.includes(domain)) {
      domain = domains[Math.floor(Math.random() * domains.length)]!;
    }

    const address = `${login}@${domain}`;
    const password = makePassword(login);

    // Create account
    const cr = await gw("/accounts", {
      method: "POST",
      body: JSON.stringify({ address, password }),
    });

    if (!cr.ok) {
      // Try a different login in case of collision
      const altLogin = randomLogin();
      const altAddress = `${altLogin}@${domain}`;
      const cr2 = await gw("/accounts", {
        method: "POST",
        body: JSON.stringify({ address: altAddress, password: makePassword(altLogin) }),
      });
      if (!cr2.ok) { res.status(502).json({ error: "Could not create inbox" }); return; }
    }

    const finalLogin = cr.ok ? login : randomLogin();
    const finalDomain = domain;
    const finalAddress = `${finalLogin}@${finalDomain}`;
    const finalPassword = makePassword(finalLogin);

    // Get JWT token
    const tr = await gw("/token", {
      method: "POST",
      body: JSON.stringify({ address: finalAddress, password: finalPassword }),
    });

    if (!tr.ok) { res.status(502).json({ error: "Could not authenticate" }); return; }
    const td = await tr.json() as { token?: string };
    if (!td.token) { res.status(502).json({ error: "No token returned" }); return; }

    res.json({ email: finalAddress, login: finalLogin, domain: finalDomain, token: td.token });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /mailgw/inbox?token=...
router.get("/mailgw/inbox", async (req, res) => {
  const token = req.query["token"] as string | undefined;
  if (!token) { res.status(400).json({ error: "token required" }); return; }
  try {
    const r = await gw("/messages", { headers: { Authorization: `Bearer ${token}` } });
    if (r.status === 401) { res.status(401).json({ error: "Session expired" }); return; }
    if (!r.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    type GwMsg = { id: string; from?: { address?: string; name?: string }; subject?: string; createdAt?: string; seen?: boolean };
    type GwResp = { "hydra:member"?: GwMsg[] };
    const d = await r.json() as GwResp;
    const members = d["hydra:member"] ?? [];
    const msgs = members.map(m => ({
      id: m.id,
      from: m.from?.name ? `${m.from.name} <${m.from.address ?? ""}>` : (m.from?.address ?? ""),
      subject: m.subject ?? "",
      date: m.createdAt ?? "",
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(msgs);
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /mailgw/message/:id?token=...
router.get("/mailgw/message/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.query["token"] as string | undefined;
  if (!token) { res.status(400).json({ error: "token required" }); return; }
  try {
    const r = await gw(`/messages/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (r.status === 401) { res.status(401).json({ error: "Session expired" }); return; }
    if (!r.ok) { res.status(502).json({ error: "Message not found" }); return; }
    type GwFullMsg = { id: string; from?: { address?: string; name?: string }; subject?: string; createdAt?: string; html?: string[]; text?: string };
    const d = await r.json() as GwFullMsg;
    const htmlParts = d.html ?? [];
    const body = htmlParts.length > 0 ? htmlParts.join("") : (d.text ?? "");
    res.json({
      id: d.id,
      from: d.from?.name ? `${d.from.name} <${d.from.address ?? ""}>` : (d.from?.address ?? ""),
      subject: d.subject ?? "",
      date: d.createdAt ?? "",
      body,
      isHtml: htmlParts.length > 0,
    });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

export default router;
