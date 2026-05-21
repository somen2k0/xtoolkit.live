import { Router } from "express";

const router = Router();

// ── Guerrilla Mail — free, no API key needed ──────────────────────────────

const GUERRILLA_BASE = "https://www.guerrillamail.com/ajax.php";
const GUERRILLA_DOMAINS = [
  "guerrillamailblock.com", "sharklasers.com", "guerrillamail.info",
  "grr.la", "guerrillamail.biz", "guerrillamail.de",
  "guerrillamail.net", "guerrillamail.org", "spam4.me",
];

// ── USA full name data (all backend, never sent to client) ───────────────────
const USA_FIRST = [
  "james","john","robert","michael","william","david","richard","joseph","thomas","charles",
  "christopher","daniel","matthew","anthony","mark","donald","steven","paul","andrew","joshua",
  "kevin","brian","george","timothy","ronald","edward","jason","jeffrey","ryan","jacob",
  "gary","nicholas","eric","jonathan","stephen","larry","justin","scott","brandon","benjamin",
  "samuel","raymond","frank","gregory","alexander","patrick","jack","dennis","jerry","tyler",
  "mary","patricia","jennifer","linda","barbara","elizabeth","susan","jessica","sarah","karen",
  "lisa","nancy","betty","margaret","sandra","ashley","dorothy","kimberly","emily","donna",
  "michelle","carol","amanda","melissa","deborah","stephanie","rebecca","sharon","laura","cynthia",
  "kathleen","amy","angela","shirley","anna","brenda","pamela","emma","nicole","helen",
  "samantha","katherine","christine","rachel","carolyn","janet","catherine","maria","heather","diane",
];
const USA_LAST = [
  "smith","johnson","williams","brown","jones","garcia","miller","davis","rodriguez","martinez",
  "hernandez","lopez","gonzalez","wilson","anderson","thomas","taylor","moore","jackson","martin",
  "lee","perez","thompson","white","harris","sanchez","clark","ramirez","lewis","robinson",
  "walker","young","allen","king","wright","scott","torres","nguyen","hill","flores",
  "green","adams","nelson","baker","hall","rivera","campbell","mitchell","carter","roberts",
  "phillips","evans","turner","parker","collins","edwards","stewart","morris","rogers","reed",
  "cook","morgan","bell","gomez","kelly","howard","ward","cox","diaz","richardson",
  "wood","watson","brooks","bennett","gray","james","reyes","cruz","hughes","price",
  "myers","long","foster","sanders","ross","morales","powell","sullivan","russell","ortiz",
];

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; XToolkit/1.0)",
  "Accept": "application/json",
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUsaUsername(): string {
  const first = randomItem(USA_FIRST);
  const last = randomItem(USA_LAST);
  const style = Math.floor(Math.random() * 4);
  const num = Math.floor(Math.random() * 900) + 100;
  switch (style) {
    case 0: return `${first}.${last}`;
    case 1: return `${first}${last}`;
    case 2: return `${first}_${last}`;
    default: return `${first}${last}${num}`;
  }
}

async function gFetch(params: Record<string, string>, sid?: string): Promise<Response> {
  const url = new URL(GUERRILLA_BASE);
  if (sid) params.sid_token = sid;
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return fetch(url.toString(), {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(8000),
  });
}

// ── Internal helper: create a Guerrilla inbox, returns null on failure ────────
async function tryCreateGuerrillaInbox(): Promise<{
  email: string; user: string; domain: string; sid_token: string; domains: string[];
} | null> {
  try {
    const initRes = await gFetch({ f: "get_email_address", lang: "en" });
    if (!initRes.ok) return null;
    const initData = await initRes.json() as { email_addr?: string; sid_token?: string };
    if (!initData.sid_token) return null;

    const sid = initData.sid_token;
    const usaUsername = generateUsaUsername();
    const setRes = await gFetch({ f: "set_email_user", email_user: usaUsername, lang: "en" }, sid);

    let finalEmail = initData.email_addr ?? "";
    let finalUser = usaUsername;
    let finalDomain = "guerrillamail.com";
    let finalSid = sid;

    if (setRes.ok) {
      const setData = await setRes.json() as { email_addr?: string; sid_token?: string };
      if (setData.email_addr) {
        finalEmail = setData.email_addr;
        const parts = finalEmail.split("@");
        finalUser = parts[0] ?? usaUsername;
        finalDomain = parts[1] ?? finalDomain;
        finalSid = setData.sid_token ?? sid;
      }
    } else {
      const parts = finalEmail.split("@");
      finalUser = parts[0] ?? usaUsername;
      finalDomain = parts[1] ?? finalDomain;
    }

    return { email: finalEmail, user: finalUser, domain: finalDomain, sid_token: finalSid, domains: GUERRILLA_DOMAINS };
  } catch {
    return null;
  }
}

router.get("/guerrilla/new", async (req, res) => {
  try {
    const result = await tryCreateGuerrillaInbox();
    if (!result) {
      res.status(502).json({ error: "Could not reach Guerrilla Mail. Please try another provider." });
      return;
    }
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "guerrilla new error");
    res.status(500).json({ error: "Failed to create inbox." });
  }
});

router.post("/guerrilla/set-user", async (req, res) => {
  const { user, domain, sid_token } = req.body as { user?: string; domain?: string; sid_token?: string };
  if (!sid_token) { res.status(400).json({ error: "sid_token required." }); return; }
  try {
    const params: Record<string, string> = { f: "set_email_user", lang: "en" };
    if (user) params.email_user = user;
    const r = await gFetch(params, sid_token);
    if (!r.ok) { res.status(502).json({ error: "Could not update address." }); return; }
    const d = await r.json() as { email_addr?: string; sid_token?: string };
    if (!d.email_addr) { res.status(502).json({ error: "Invalid provider response." }); return; }
    const actualUser = d.email_addr.split("@")[0] ?? user ?? "";
    const targetDomain = domain?.trim() || d.email_addr.split("@")[1] || "guerrillamailblock.com";
    const finalEmail = `${actualUser}@${targetDomain}`;
    res.json({ email: finalEmail, user: actualUser, domain: targetDomain, sid_token: d.sid_token ?? sid_token, domains: GUERRILLA_DOMAINS });
  } catch (err) {
    req.log.error({ err }, "guerrilla set-user error");
    res.status(500).json({ error: "Failed to update address." });
  }
});

router.get("/guerrilla/inbox", async (req, res) => {
  const sid_token = req.query.sid_token as string | undefined;
  if (!sid_token) { res.status(400).json({ error: "sid_token required." }); return; }
  try {
    const r = await gFetch({ f: "check_email", seq: "0" }, sid_token);
    if (!r.ok) { res.status(502).json({ error: "Could not reach Guerrilla Mail." }); return; }
    const d = await r.json() as { list?: unknown };
    const raw = Array.isArray(d.list) ? d.list : [];
    const messages = raw.filter((m: unknown) => {
      const msg = m as Record<string, unknown>;
      return msg.mail_id && String(msg.mail_id) !== "0";
    });
    res.json({ messages });
  } catch (err) {
    req.log.error({ err }, "guerrilla inbox error");
    res.status(502).json({ error: "Failed to fetch inbox. Please try again." });
  }
});

router.get("/guerrilla/message/:id", async (req, res) => {
  const sid_token = req.query.sid_token as string | undefined;
  const { id } = req.params;
  if (!sid_token) { res.status(400).json({ error: "sid_token required." }); return; }
  try {
    const r = await gFetch({ f: "fetch_email", email_id: id }, sid_token);
    if (!r.ok) { res.status(r.status).json({ error: "Message not found." }); return; }
    const d = await r.json() as { mail_body?: string; mail_from?: string; mail_subject?: string };
    res.json({ body: d.mail_body ?? "", from: d.mail_from, subject: d.mail_subject });
  } catch (err) {
    req.log.error({ err }, "guerrilla fetch message error");
    res.status(500).json({ error: "Failed to fetch message." });
  }
});

// ── Provider health check — tests each provider and logs results ──────────────
router.get("/temp-mail/health", async (req, res) => {
  req.log.info({ NODE_ENV: process.env["NODE_ENV"] ?? "unknown" }, "temp-mail health check");

  const results: Record<string, { ok: boolean; latencyMs?: number; error?: string }> = {};

  // Test Guerrilla Mail
  const guerrillaStart = Date.now();
  try {
    const r = await fetch(`${GUERRILLA_BASE}?f=get_email_address&lang=en`, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    results["guerrilla"] = { ok: r.ok, latencyMs: Date.now() - guerrillaStart };
    if (!r.ok) results["guerrilla"]!.error = `HTTP ${r.status}`;
  } catch (err) {
    results["guerrilla"] = { ok: false, latencyMs: Date.now() - guerrillaStart, error: String(err) };
  }

  // Test Mail.tm
  const mailtmStart = Date.now();
  try {
    const r = await fetch("https://api.mail.tm/domains", {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    results["mailtm"] = { ok: r.ok, latencyMs: Date.now() - mailtmStart };
    if (!r.ok) results["mailtm"]!.error = `HTTP ${r.status}`;
  } catch (err) {
    results["mailtm"] = { ok: false, latencyMs: Date.now() - mailtmStart, error: String(err) };
  }

  // Test Dispostable
  const dispStart = Date.now();
  try {
    const r = await fetch("https://www.dispostable.com/api/request_email/", {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    results["dispostable"] = { ok: r.ok, latencyMs: Date.now() - dispStart };
    if (!r.ok) results["dispostable"]!.error = `HTTP ${r.status}`;
  } catch (err) {
    results["dispostable"] = { ok: false, latencyMs: Date.now() - dispStart, error: String(err) };
  }

  // Test temp.tf
  const temptfStart = Date.now();
  try {
    const r = await fetch("https://temp.tf/api/account?providers=gmail&dot=1", {
      headers: { ...FETCH_HEADERS, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    results["temptf"] = { ok: r.ok, latencyMs: Date.now() - temptfStart };
    if (!r.ok) results["temptf"]!.error = `HTTP ${r.status}`;
  } catch (err) {
    results["temptf"] = { ok: false, latencyMs: Date.now() - temptfStart, error: String(err) };
  }

  req.log.info({ providers: results }, "temp-mail provider health results");

  const allDown = Object.values(results).every(r => !r.ok);
  res.status(allDown ? 503 : 200).json({
    NODE_ENV: process.env["NODE_ENV"] ?? "unknown",
    providers: results,
  });
});

export default router;
