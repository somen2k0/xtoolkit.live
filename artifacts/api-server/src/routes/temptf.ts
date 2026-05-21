import { Router } from "express";

const router = Router();

const BASE = "https://temp.tf/api";
const FETCH_HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
};

// ── Local Gmail address generation (no external API needed) ──────────────────
// Used as the primary source so address generation always works,
// even when temp.tf is unavailable from the server's IP range.

const GMAIL_FIRST = [
  "james","john","robert","michael","william","david","richard","joseph",
  "thomas","charles","christopher","daniel","matthew","anthony","mark",
  "donald","steven","paul","andrew","joshua","kevin","brian","george",
  "timothy","ronald","edward","jason","jeffrey","ryan","jacob","gary",
  "nicholas","eric","jonathan","stephen","larry","justin","scott","brandon",
  "mary","patricia","jennifer","linda","barbara","elizabeth","susan",
  "jessica","sarah","karen","lisa","nancy","betty","margaret","sandra",
  "ashley","dorothy","kimberly","emily","donna","michelle","carol","amanda",
  "melissa","deborah","stephanie","rebecca","sharon","laura","cynthia",
  "kathleen","amy","angela","shirley","anna","brenda","pamela","emma",
  "nicole","helen","samantha","katherine","diana","rachel","carolyn",
];

const GMAIL_LAST = [
  "smith","johnson","williams","brown","jones","garcia","miller","davis",
  "rodriguez","martinez","hernandez","lopez","gonzalez","wilson","anderson",
  "thomas","taylor","moore","jackson","martin","lee","perez","thompson",
  "white","harris","sanchez","clark","ramirez","lewis","robinson","walker",
  "young","allen","king","wright","scott","torres","nguyen","hill","flores",
  "green","adams","nelson","baker","hall","rivera","campbell","mitchell",
  "carter","roberts","phillips","evans","turner","parker","collins","edwards",
  "stewart","morris","rogers","reed","cook","morgan","bell","gomez","kelly",
];

const PLUS_TAGS = [
  "news","shop","social","work","promo","alerts","updates","deals","temp",
  "signup","lists","receipt","travel","bank","gov","app","dev","backup",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLocalGmailAddress(type: "dot" | "plus"): string {
  const first = pick(GMAIL_FIRST);
  const last  = pick(GMAIL_LAST);
  const base  = `${first}${last}`;

  if (type === "plus") {
    return `${base}+${pick(PLUS_TAGS)}@gmail.com`;
  }

  // Dot trick — insert 1–3 dots at random interior positions
  const chars = base.split("");
  const maxDots = Math.min(3, chars.length - 2);
  const numDots = Math.floor(Math.random() * maxDots) + 1;
  const positions = new Set<number>();
  while (positions.size < numDots) {
    positions.add(Math.floor(Math.random() * (chars.length - 1)) + 1);
  }
  const sorted = Array.from(positions).sort((a, b) => a - b);
  let result = "";
  for (let i = 0; i < chars.length; i++) {
    if (sorted.includes(i)) result += ".";
    result += chars[i];
  }
  return `${result}@gmail.com`;
}

// GET /api/temptf/generate
// Returns a fresh @gmail.com / @outlook.com / @hotmail.com address.
// Tries temp.tf first (so its inbox service works); falls back to local
// generation so address display always works even if temp.tf blocks the IP.
router.get("/temptf/generate", async (req, res) => {
  const { type, providers } = req.query as { type?: string; providers?: string };

  const validProviders = ["gmail", "outlook", "hotmail"];
  const provider = validProviders.includes(providers ?? "") ? (providers as string) : "gmail";
  const isGmail  = provider === "gmail";
  const usePlus  = type === "plus" || !isGmail;
  const useDot   = isGmail && !usePlus;

  const params = new URLSearchParams({ providers: provider });
  if (useDot)  params.set("dot",  "1");
  if (usePlus) params.set("plus", "1");

  // ── Attempt 1 & 2: try temp.tf (needed for its inbox to work) ─────────────
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(`${BASE}/account?${params.toString()}`, {
        headers: FETCH_HEADERS,
        signal: AbortSignal.timeout(8000),
      });

      if (r.ok) {
        const data = await r.json() as { email?: string };
        if (data.email) {
          res.json({ email: data.email, source: "temptf" });
          return;
        }
      } else if (r.status === 429) {
        // Rate-limited — fall through to local fallback immediately
        break;
      }
    } catch {
      // Network error (e.g. IP blocked) — try once more then fall back
      if (attempt === 0) await new Promise(r => setTimeout(r, 1000));
    }
  }

  // ── Fallback: generate locally (address display works; inbox needs temp.tf) ─
  if (isGmail) {
    const email = generateLocalGmailAddress(useDot ? "dot" : "plus");
    res.json({ email, source: "local" });
    return;
  }

  // Non-Gmail providers have no local fallback — return a clear error
  res.status(502).json({ error: "Address generation service temporarily unavailable. Please try again." });
});

// POST /api/temptf/messages
// Returns the full inbox for a temp.tf address. Message bodies are included.
router.post("/temptf/messages", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  try {
    const r = await fetch(`${BASE}/check`, {
      method: "POST",
      headers: FETCH_HEADERS,
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(10000),
    });

    if (!r.ok) {
      if (r.status === 403) {
        res.status(403).json({ error: "This address is not managed by the inbox service. Use the 'New Address' button to get a fresh one." });
        return;
      }
      if (r.status === 429) {
        res.status(429).json({ error: "Rate limited. Please wait a moment." });
        return;
      }
      if (r.status === 404) {
        res.json({ messages: [], totalReceived: 0 });
        return;
      }
      req.log.warn({ status: r.status }, "temp.tf check failed");
      res.status(502).json({ error: "Inbox service temporarily unavailable." });
      return;
    }

    type TempTfMsg = {
      id: string;
      subject?: string;
      from?: string;
      date?: string;
      body?: string;
      bodyContentType?: "html" | "text";
      attachments?: { id: string; name: string; contentType: string; size: number }[];
    };
    type TempTfResponse = { data?: TempTfMsg[]; totalReceived?: number };

    const raw = await r.json() as TempTfResponse;
    const rawMessages = raw.data ?? [];

    const messages = rawMessages.map((m) => ({
      id:              m.id,
      from:            m.from ?? "",
      subject:         m.subject ?? "",
      date:            m.date ?? "",
      body:            m.body ?? "",
      bodyContentType: m.bodyContentType ?? "text",
      hasAttachments:  (m.attachments?.length ?? 0) > 0,
    }));

    res.json({ messages, totalReceived: raw.totalReceived ?? messages.length });
  } catch (err) {
    req.log.error({ err }, "temp.tf check error");
    res.status(502).json({ error: "Network error reaching inbox service. Please try again." });
  }
});

export default router;
