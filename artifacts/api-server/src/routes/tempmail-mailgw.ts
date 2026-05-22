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

const US_FIRST = ["james","john","robert","michael","william","david","richard","joseph","thomas","charles","christopher","daniel","matthew","anthony","mark","donald","steven","paul","andrew","joshua","kenneth","kevin","brian","george","timothy","ronald","edward","jason","jeffrey","ryan","jacob","gary","nicholas","eric","jonathan","larry","stephen","justin","scott","brandon","raymond","frank","gregory","samuel","benjamin","patrick","jack","dennis","jerry","alexander","henry","tyler","aaron","jose","adam","nathan","zachary","walter","harold","kyle","carl","arthur","gerald","roger","terry","keith","sean","christian","ethan","austin","albert","jesse","dylan","noah","logan","mason","liam","oliver","lucas","elijah","owen","aiden","evan","caleb","ian","hudson","wyatt","hunter","jayden","carter","emma","olivia","ava","isabella","sophia","mia","charlotte","amelia","harper","evelyn","abigail","emily","elizabeth","mila","ella","avery","sofia","camila","aria","scarlett","victoria","madison","luna","grace","chloe","penelope","layla","riley","zoey","nora","lily","eleanor","hannah","lillian","addison","aubrey","ellie","stella","natalie","zoe","leah","hazel","violet","aurora","savannah","audrey","brooklyn","bella","claire","skylar","lucy","paisley","everly","anna","caroline","naomi","faith","kaylee","mary","alice","julia","hailey","madeline","kylie","alexa","brianna","peyton","jasmine"];

const US_LAST = ["smith","johnson","williams","brown","jones","garcia","miller","davis","rodriguez","martinez","hernandez","lopez","gonzalez","wilson","anderson","taylor","thomas","moore","jackson","martin","lee","perez","thompson","white","harris","sanchez","clark","ramirez","lewis","robinson","walker","young","allen","king","wright","scott","torres","nguyen","hill","flores","green","adams","nelson","baker","hall","rivera","campbell","mitchell","carter","roberts","turner","phillips","evans","parker","edwards","collins","stewart","morris","rogers","reed","cook","morgan","bell","murphy","bailey","cooper","richardson","cox","howard","ward","brooks","watson","kelly","sanders","price","bennett","wood","barnes","ross","henderson","coleman","jenkins","perry","powell","long","patterson","hughes","washington","butler","simmons","foster","gonzales","bryant","alexander","russell","griffin","diaz","hayes","myers","ford","hamilton","graham","sullivan","wallace","woods","cole","west","jordan","owens","reynolds","fisher","burns","hunt","marshall","palmer","douglas","porter","montgomery","morales","day","robbins","hicks","cunningham","powers","hardy","obrien","guerrero","medina","reeves","hoover","hoffman","ramsey","moss","patel","horn","holloway","mccoy","bridges","cross","sharp","norris","frank","holt","vance","york","best","nichols","flowers"];

function randomLogin(custom?: string): string {
  if (custom) return custom;
  const f = US_FIRST[Math.floor(Math.random() * US_FIRST.length)]!;
  const l = US_LAST[Math.floor(Math.random() * US_LAST.length)]!;
  return `${f}.${l}`;
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

    type GwAccount = { address?: string };

    // Create account — mail.gw silently strips dots/special chars, so always
    // read back the actual address it stored rather than assuming our input was kept.
    let actualAddress = address;
    let actualPassword = password;

    const cr = await gw("/accounts", {
      method: "POST",
      body: JSON.stringify({ address, password }),
    });

    if (cr.ok) {
      const cd = await cr.json() as GwAccount;
      if (cd.address) actualAddress = cd.address;
    } else {
      // Collision or rejection — try a fresh login
      const altLogin = randomLogin();
      const altAddress = `${altLogin}@${domain}`;
      actualPassword = makePassword(altLogin);
      const cr2 = await gw("/accounts", {
        method: "POST",
        body: JSON.stringify({ address: altAddress, password: actualPassword }),
      });
      if (!cr2.ok) { res.status(502).json({ error: "Could not create inbox" }); return; }
      const cd2 = await cr2.json() as GwAccount;
      actualAddress = cd2.address ?? altAddress;
    }

    const [actualLogin, actualDomain] = actualAddress.split("@") as [string, string];

    // Get JWT token using the address mail.gw actually stored
    const tr = await gw("/token", {
      method: "POST",
      body: JSON.stringify({ address: actualAddress, password: actualPassword }),
    });

    if (!tr.ok) { res.status(502).json({ error: "Could not authenticate" }); return; }
    const td = await tr.json() as { token?: string };
    if (!td.token) { res.status(502).json({ error: "No token returned" }); return; }

    res.json({ email: actualAddress, login: actualLogin, domain: actualDomain ?? domain, token: td.token });
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
