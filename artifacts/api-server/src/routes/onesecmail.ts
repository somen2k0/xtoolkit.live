import { Router } from "express";

const router = Router();
const BASE = "https://www.1secmail.com/api/v1/";

const FALLBACK_DOMAINS = [
  "1secmail.com", "1secmail.net", "1secmail.org",
  "wwjmp.com", "esiix.com", "xojxe.com", "yoggm.com",
];

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept": "application/json",
};

/** Returns null when 1secmail is explicitly blocked on this server (403). */
async function getDomains(): Promise<string[] | null> {
  try {
    const r = await fetch(`${BASE}?action=getDomainList`, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(5000),
    });
    if (r.status === 403) return null; // server IP is blocked by 1secmail
    if (r.ok) {
      const data = await r.json() as string[];
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  return FALLBACK_DOMAINS; // network timeout or unexpected error — use static fallback
}

const US_FIRST = [
  "james","john","robert","michael","william","david","richard","joseph","thomas","charles",
  "christopher","daniel","matthew","anthony","mark","donald","steven","paul","andrew","joshua",
  "kenneth","kevin","brian","george","timothy","ronald","edward","jason","jeffrey","ryan",
  "jacob","gary","nicholas","eric","jonathan","stephen","larry","justin","scott","brandon",
  "mary","patricia","jennifer","linda","barbara","elizabeth","susan","jessica","sarah","karen",
  "lisa","nancy","betty","margaret","sandra","ashley","dorothy","kimberly","emily","donna",
  "michelle","carol","amanda","melissa","deborah","stephanie","rebecca","sharon","laura","cynthia",
  "kathleen","amy","angela","shirley","anna","brenda","pamela","emma","nicole","helen",
];

const US_LAST = [
  "smith","johnson","williams","brown","jones","garcia","miller","davis","rodriguez","martinez",
  "hernandez","lopez","gonzalez","wilson","anderson","thomas","taylor","moore","jackson","martin",
  "lee","perez","thompson","white","harris","sanchez","clark","ramirez","lewis","robinson",
  "walker","young","allen","king","wright","scott","torres","nguyen","hill","flores",
  "green","adams","nelson","baker","hall","rivera","campbell","mitchell","carter","roberts",
  "phillips","evans","turner","diaz","parker","collins","edwards","stewart","flores","morris",
  "murphy","cook","rogers","morgan","peterson","cooper","reed","bailey","bell","gomez",
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function randomLogin(): string {
  const first = pick(US_FIRST);
  const last  = pick(US_LAST);
  const sep   = pick([".", "_", ""]);
  const suffix = Math.random() < 0.35 ? String(Math.floor(Math.random() * 90 + 10)) : "";
  return `${first}${sep}${last}${suffix}`;
}

router.get("/onesecmail/new", async (req, res) => {
  try {
    const domains = await getDomains();
    if (!domains) {
      res.status(503).json({ error: "1secmail is not available on this server." });
      return;
    }
    const login = randomLogin();
    const domain = domains[Math.floor(Math.random() * Math.min(3, domains.length))];
    res.json({ login, domain, email: `${login}@${domain}`, domains });
  } catch (err) {
    req.log.error({ err }, "onesecmail new error");
    res.status(500).json({ error: "Failed to create inbox." });
  }
});

router.get("/onesecmail/domains", async (req, res) => {
  try {
    const domains = await getDomains();
    res.json({ domains: domains ?? [], available: domains !== null });
  } catch {
    res.json({ domains: FALLBACK_DOMAINS, available: true });
  }
});

router.post("/onesecmail/set-address", async (req, res) => {
  const { login, domain } = req.body as { login?: string; domain?: string };
  if (!login || !domain) {
    res.status(400).json({ error: "login and domain are required." });
    return;
  }
  const domains = await getDomains();
  if (!domains) {
    res.status(503).json({ error: "1secmail is not available on this server." });
    return;
  }
  const clean = login.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  if (!clean) { res.status(400).json({ error: "Invalid login." }); return; }
  res.json({ login: clean, domain, email: `${clean}@${domain}`, domains });
});

router.get("/onesecmail/inbox", async (req, res) => {
  const { login, domain } = req.query as { login?: string; domain?: string };
  if (!login || !domain) {
    res.status(400).json({ error: "login and domain are required." });
    return;
  }
  try {
    const r = await fetch(
      `${BASE}?action=getMessages&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`,
      { headers: FETCH_HEADERS, signal: AbortSignal.timeout(6000) }
    );
    if (!r.ok) { res.status(502).json({ error: "Could not reach 1secmail." }); return; }
    const data = await r.json() as Array<{ id: number; from: string; subject: string; date: string }>;
    res.json({ messages: Array.isArray(data) ? data : [] });
  } catch {
    res.status(502).json({ error: "Failed to fetch inbox. Please try again." });
  }
});

router.get("/onesecmail/message/:id", async (req, res) => {
  const { login, domain } = req.query as { login?: string; domain?: string };
  const { id } = req.params;
  if (!login || !domain) {
    res.status(400).json({ error: "login and domain are required." });
    return;
  }
  try {
    const r = await fetch(
      `${BASE}?action=readMessage&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}&id=${id}`,
      { headers: FETCH_HEADERS, signal: AbortSignal.timeout(6000) }
    );
    if (!r.ok) { res.status(r.status).json({ error: "Message not found." }); return; }
    res.json(await r.json());
  } catch {
    res.status(500).json({ error: "Failed to fetch message." });
  }
});

export default router;
