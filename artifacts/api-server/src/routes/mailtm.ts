import { Router } from "express";

const router = Router();
const BASE = "https://api.mail.tm";

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; XToolkit/1.0)",
  "Accept": "application/json",
  "Content-Type": "application/json",
};

let domainCache: { domains: string[]; expiry: number } = { domains: [], expiry: 0 };

async function getMailTmDomains(): Promise<string[]> {
  if (Date.now() < domainCache.expiry && domainCache.domains.length > 0) return domainCache.domains;
  try {
    const r = await fetch(`${BASE}/domains`, { headers: FETCH_HEADERS, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return domainCache.domains;
    const d = await r.json() as { "hydra:member"?: Array<{ domain: string; isActive: boolean; isPrivate?: boolean }> };
    const domains = (d["hydra:member"] ?? []).filter(x => x.isActive && !x.isPrivate).map(x => x.domain);
    if (domains.length > 0) domainCache = { domains, expiry: Date.now() + 10 * 60 * 1000 };
    return domainCache.domains;
  } catch { return domainCache.domains; }
}

const FIRST_NAMES = [
  "james","john","robert","michael","william","david","richard","joseph","thomas","charles",
  "christopher","daniel","matthew","anthony","mark","donald","steven","paul","andrew","joshua",
  "kevin","brian","george","timothy","ronald","edward","jason","jeffrey","ryan","jacob",
  "mary","patricia","jennifer","linda","barbara","elizabeth","susan","jessica","sarah","karen",
  "lisa","nancy","betty","margaret","sandra","ashley","dorothy","kimberly","emily","donna",
];
const LAST_NAMES = [
  "smith","johnson","williams","brown","jones","garcia","miller","davis","rodriguez","martinez",
  "hernandez","lopez","gonzalez","wilson","anderson","thomas","taylor","moore","jackson","martin",
  "lee","perez","thompson","white","harris","sanchez","clark","ramirez","lewis","robinson",
  "walker","young","allen","king","wright","scott","torres","nguyen","hill","flores",
];
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomLogin(): string {
  const sep = pick([".", "_", ""]);
  const suffix = Math.random() < 0.4 ? String(Math.floor(Math.random() * 90 + 10)) : "";
  return `${pick(FIRST_NAMES)}${sep}${pick(LAST_NAMES)}${suffix}`;
}
function randomPassword(): string {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10) + "Aa1!";
}

async function createAccount(address: string, password: string): Promise<boolean> {
  try {
    const r = await fetch(`${BASE}/accounts`, {
      method: "POST", headers: FETCH_HEADERS,
      body: JSON.stringify({ address, password }),
      signal: AbortSignal.timeout(8000),
    });
    return r.ok;
  } catch { return false; }
}

async function getJwt(address: string, password: string): Promise<string | null> {
  try {
    const r = await fetch(`${BASE}/token`, {
      method: "POST", headers: FETCH_HEADERS,
      body: JSON.stringify({ address, password }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const d = await r.json() as { token?: string };
    return d.token ?? null;
  } catch { return null; }
}

interface NormMsg {
  id: string; from: string; subject: string; date: string;
  textBody?: string; htmlBody?: string;
}

async function fetchInbox(jwt: string): Promise<NormMsg[]> {
  const r = await fetch(`${BASE}/messages`, {
    headers: { ...FETCH_HEADERS, Authorization: `Bearer ${jwt}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json() as {
    "hydra:member"?: Array<{ id: string; from: { address: string }; subject: string; createdAt: string; intro?: string }>;
  };
  return (d["hydra:member"] ?? []).map(m => ({
    id: m.id, from: m.from?.address ?? "", subject: m.subject || "(no subject)",
    date: m.createdAt, textBody: m.intro ?? "",
  }));
}

async function fetchMessage(id: string, jwt: string): Promise<NormMsg | null> {
  try {
    const r = await fetch(`${BASE}/messages/${encodeURIComponent(id)}`, {
      headers: { ...FETCH_HEADERS, Authorization: `Bearer ${jwt}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const m = await r.json() as {
      id: string; from: { address: string }; subject: string;
      createdAt: string; html?: string[]; text?: string;
    };
    return {
      id: m.id, from: m.from?.address ?? "", subject: m.subject || "(no subject)",
      date: m.createdAt, htmlBody: m.html?.[0] ?? "", textBody: m.text ?? "",
    };
  } catch { return null; }
}

router.get("/mailtm/domains", async (_req, res) => {
  const domains = await getMailTmDomains();
  res.json({ domains, available: domains.length > 0 });
});

router.get("/mailtm/new", async (req, res) => {
  const domains = await getMailTmDomains();
  if (domains.length === 0) { res.status(503).json({ error: "Mail.tm has no available domains." }); return; }
  const reqDomain = (req.query.domain as string | undefined)?.toLowerCase().trim();
  const domain = (reqDomain && domains.includes(reqDomain)) ? reqDomain : domains[Math.floor(Math.random() * domains.length)];
  const password = randomPassword();
  let login = randomLogin();
  let jwt: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) login = randomLogin();
    const created = await createAccount(`${login}@${domain}`, password);
    if (!created) continue;
    jwt = await getJwt(`${login}@${domain}`, password);
    if (jwt) break;
  }
  if (!jwt) { res.status(503).json({ error: "Failed to create Mail.tm mailbox." }); return; }
  res.json({ login, domain, email: `${login}@${domain}`, token: jwt });
});

router.post("/mailtm/set-address", async (req, res) => {
  const { login: rawLogin, domain: rawDomain } = req.body as { login?: string; domain?: string };
  const domains = await getMailTmDomains();
  if (domains.length === 0) { res.status(503).json({ error: "No domains available." }); return; }
  const domain = (rawDomain && domains.includes(rawDomain.toLowerCase()))
    ? rawDomain.toLowerCase()
    : domains[Math.floor(Math.random() * domains.length)];
  const password = randomPassword();
  const requestedLogin = rawLogin
    ? rawLogin.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30) || null
    : null;
  let login = requestedLogin ?? randomLogin();
  let jwt: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) login = randomLogin();
    const created = await createAccount(`${login}@${domain}`, password);
    if (!created) continue;
    jwt = await getJwt(`${login}@${domain}`, password);
    if (jwt) break;
  }
  if (!jwt) { res.status(503).json({ error: "Failed to create mailbox." }); return; }
  res.json({ login, domain, email: `${login}@${domain}`, token: jwt });
});

router.get("/mailtm/inbox", async (req, res) => {
  const { token } = req.query as { token?: string };
  if (!token) { res.status(400).json({ error: "token required." }); return; }
  try {
    const messages = await fetchInbox(token);
    res.json({ messages });
  } catch (err) {
    req.log.error({ err }, "mailtm inbox error");
    res.status(502).json({ error: "Failed to fetch inbox." });
  }
});

router.get("/mailtm/message/:id", async (req, res) => {
  const { token } = req.query as { token?: string };
  const { id } = req.params;
  if (!token) { res.status(400).json({ error: "token required." }); return; }
  try {
    const msg = await fetchMessage(id, token);
    if (!msg) { res.status(404).json({ error: "Message not found." }); return; }
    res.json(msg);
  } catch (err) {
    req.log.error({ err }, "mailtm message error");
    res.status(500).json({ error: "Failed to fetch message." });
  }
});

export default router;
