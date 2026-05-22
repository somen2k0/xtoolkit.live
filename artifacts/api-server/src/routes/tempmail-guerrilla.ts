import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ALLORIGINS = "https://api.allorigins.win/raw?url=";
const GUERRILLA = "https://api.guerrillamail.com/ajax.php";

const US_FIRST = ["james","john","robert","michael","william","david","richard","joseph","thomas","charles","christopher","daniel","matthew","anthony","mark","donald","steven","paul","andrew","joshua","kenneth","kevin","brian","george","timothy","ronald","edward","jason","jeffrey","ryan","jacob","gary","nicholas","eric","jonathan","larry","stephen","justin","scott","brandon","raymond","frank","gregory","samuel","benjamin","patrick","jack","dennis","jerry","alexander","henry","tyler","aaron","jose","adam","nathan","zachary","walter","harold","kyle","carl","arthur","gerald","roger","terry","keith","sean","christian","ethan","austin","joe","albert","jesse","willie","billie","ryan","dylan","noah","logan","mason","liam","oliver","lucas","elijah","owen","aiden","evan","caleb","ian","hudson","wyatt","hunter","jayden","carter","emma","olivia","ava","isabella","sophia","mia","charlotte","amelia","harper","evelyn","abigail","emily","elizabeth","mila","ella","avery","sofia","camila","aria","scarlett","victoria","madison","luna","grace","chloe","penelope","layla","riley","zoey","nora","lily","eleanor","hannah","lillian","addison","aubrey","ellie","stella","natalie","zoe","leah","hazel","violet","aurora","savannah","audrey","brooklyn","bella","claire","skylar","lucy","paisley","everly","anna","caroline","genesis","naomi","faith","aaliyah","kaylee","mary","alice","julia","hailey","madeline","kylie","nevaeh","alexa","brianna","peyton","jasmine"];

const US_LAST = ["smith","johnson","williams","brown","jones","garcia","miller","davis","rodriguez","martinez","hernandez","lopez","gonzalez","wilson","anderson","taylor","thomas","moore","jackson","martin","lee","perez","thompson","white","harris","sanchez","clark","ramirez","lewis","robinson","walker","young","allen","king","wright","scott","torres","nguyen","hill","flores","green","adams","nelson","baker","hall","rivera","campbell","mitchell","carter","roberts","turner","phillips","evans","parker","edwards","collins","stewart","morris","rogers","reed","cook","morgan","bell","murphy","bailey","cooper","richardson","cox","howard","ward","brooks","watson","kelly","sanders","price","bennett","wood","barnes","ross","henderson","coleman","jenkins","perry","powell","long","patterson","hughes","flores","washington","butler","simmons","foster","gonzales","bryant","alexander","russell","griffin","diaz","hayes","myers","ford","hamilton","graham","sullivan","wallace","woods","cole","west","jordan","owens","reynolds","fisher","burns","hunt","marshall","palmer","douglas","jenkins","west","griffin","porter","montgomery","morales","day","allen","robbins","hunter","hicks","cunningham","powers","hardy","obrien","guerrero","medina","reeves","hoover","hoffman","ramsey","moss","patel","horn","holloway","mccoy","bridges","cross","simpson","powers","woods","sharp","norris","frank","holt","vance","york","best","nichols","flowers"];

function randomUSName(custom?: string): string {
  if (custom) return custom;
  const f = US_FIRST[Math.floor(Math.random() * US_FIRST.length)]!;
  const l = US_LAST[Math.floor(Math.random() * US_LAST.length)]!;
  return `${f}.${l}`;
}

// Only the domain that reliably works from server-side (set_email_user is blocked
// for the alias domains, so we only expose the default one that always works)
const GUERRILLA_DOMAINS = [
  "guerrillamailblock.com",
];

function proxied(url: string): string {
  return ALLORIGINS + encodeURIComponent(url);
}

/** Try direct fetch first; if it fails/times out, fall back to allorigins proxy. */
async function guerrillaFetch(
  params: Record<string, string>,
  timeoutMs = 10000,
): Promise<Response> {
  const qs = new URLSearchParams(params).toString();
  const directUrl = `${GUERRILLA}?${qs}`;

  // Attempt 1: direct (no proxy)
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

// GET /guerrilla/health
router.get("/guerrilla/health", async (_req, res) => {
  try {
    const r = await guerrillaFetch({ f: "get_email_address" }, 8000);
    res.json({ ok: r.ok });
  } catch {
    res.json({ ok: false });
  }
});

// GET /guerrilla/domains — list of supported domains
router.get("/guerrilla/domains", (_req, res) => {
  res.json(GUERRILLA_DOMAINS);
});

// GET /guerrilla/new?domain=guerrillamail.biz
// Step 1: get_email_address → obtain session + sid_token
// Step 2: if domain requested, set_email_user with site=<domain>
router.get("/guerrilla/new", async (req, res) => {
  const requestedDomain = req.query["domain"] as string | undefined;
  try {
    // Step 1: get initial session
    const r1 = await guerrillaFetch({ f: "get_email_address" });
    if (!r1.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    const d1 = await r1.json() as { email_addr?: string; sid_token?: string };
    if (!d1.email_addr || !d1.sid_token) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }

    let finalEmail = d1.email_addr;
    let finalSid   = d1.sid_token;

    // Step 2: set a real US first.last name — domain is always guerrillamailblock.com
    // (set_email_user for other domains is blocked from server IPs)
    const usName = randomUSName(req.query["login"] as string | undefined);
    const targetSite = "guerrillamailblock.com";
    try {
      const r2 = await guerrillaFetch({
        f: "set_email_user",
        email_user: usName,
        lang: "en",
        site: targetSite,
        sid_token: finalSid,
      }, 8000);
      if (r2.ok) {
        const d2 = await r2.json() as { email_addr?: string; sid_token?: string };
        if (d2.email_addr) {
          finalEmail = d2.email_addr;
          if (d2.sid_token) finalSid = d2.sid_token;
        }
      }
    } catch {}

    const parts = finalEmail.split("@");
    res.json({
      email: finalEmail,
      sid_token: finalSid,
      user: parts[0] ?? "user",
      domain: parts[1] ?? targetSite,
    });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /guerrilla/inbox?sid_token=...
router.get("/guerrilla/inbox", async (req, res) => {
  const sid_token = req.query["sid_token"] as string | undefined;
  if (!sid_token) { res.status(400).json({ error: "sid_token required" }); return; }
  try {
    const r = await guerrillaFetch({ f: "check_email", seq: "0", sid_token });
    if (!r.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    const d = await r.json() as {
      list?: Array<{
        mail_id: string; mail_from: string; mail_subject: string;
        mail_timestamp: string; mail_read: string; mail_exerpt?: string;
      }>;
    };
    res.json(Array.isArray(d.list) ? d.list : []);
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /guerrilla/message/:id?sid_token=...
router.get("/guerrilla/message/:id", async (req, res) => {
  const { id } = req.params;
  const sid_token = req.query["sid_token"] as string | undefined;
  if (!sid_token) { res.status(400).json({ error: "sid_token required" }); return; }
  try {
    const r = await guerrillaFetch({ f: "fetch_email", email_id: id, sid_token });
    if (!r.ok) { res.status(502).json({ error: "Provider temporarily unavailable" }); return; }
    const d = await r.json() as {
      mail_id?: string; mail_from?: string; mail_subject?: string;
      mail_timestamp?: string; mail_body?: string; mail_html?: string;
    };
    const body = d.mail_html ?? d.mail_body ?? "";
    // Guerrilla returns HTML content in mail_body (wrapped in <pre> or with tags) even
    // when mail_html is absent. Detect HTML by checking for angle-bracket tags.
    const isHtml = !!d.mail_html || /<[a-zA-Z][\s\S]*?>/m.test(body);
    res.json({
      id: d.mail_id ?? id,
      from: d.mail_from ?? "",
      subject: d.mail_subject ?? "",
      timestamp: d.mail_timestamp ?? "",
      body,
      isHtml,
    });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

export default router;
