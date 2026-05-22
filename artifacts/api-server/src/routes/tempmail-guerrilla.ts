import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ALLORIGINS = "https://api.allorigins.win/raw?url=";
const GUERRILLA = "https://api.guerrillamail.com/ajax.php";

function proxied(url: string): string {
  return ALLORIGINS + encodeURIComponent(url);
}

async function guerrillaFetch(
  params: Record<string, string>,
  timeoutMs = 10000,
): Promise<Response> {
  const qs = new URLSearchParams(params).toString();
  const url = proxied(`${GUERRILLA}?${qs}`);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// GET /api/guerrilla/health
router.get("/guerrilla/health", async (_req, res) => {
  try {
    const r = await guerrillaFetch({ f: "get_email_address" }, 8000);
    res.json({ ok: r.ok });
  } catch {
    res.json({ ok: false });
  }
});

// GET /api/guerrilla/new
router.get("/guerrilla/new", async (_req, res) => {
  try {
    const r = await guerrillaFetch({ f: "get_email_address" });
    if (!r.ok) {
      res.status(502).json({ error: "Provider temporarily unavailable" });
      return;
    }
    const d = await r.json() as {
      email_addr?: string;
      sid_token?: string;
      alias?: string;
    };
    if (!d.email_addr || !d.sid_token) {
      res.status(502).json({ error: "Provider temporarily unavailable" });
      return;
    }
    const parts = d.email_addr.split("@");
    res.json({
      email: d.email_addr,
      sid_token: d.sid_token,
      user: parts[0] ?? "user",
      domain: parts[1] ?? "guerrillamailblock.com",
    });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /api/guerrilla/inbox?sid_token=...
router.get("/guerrilla/inbox", async (req, res) => {
  const sid_token = req.query["sid_token"] as string | undefined;
  if (!sid_token) {
    res.status(400).json({ error: "sid_token required" });
    return;
  }
  try {
    const r = await guerrillaFetch({ f: "check_email", seq: "0", sid_token });
    if (!r.ok) {
      res.status(502).json({ error: "Provider temporarily unavailable" });
      return;
    }
    const d = await r.json() as {
      list?: Array<{
        mail_id: string;
        mail_from: string;
        mail_subject: string;
        mail_timestamp: string;
        mail_read: string;
        mail_exerpt?: string;
        mail_html?: string;
      }>;
    };
    res.json(Array.isArray(d.list) ? d.list : []);
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

// GET /api/guerrilla/message/:id?sid_token=...
router.get("/guerrilla/message/:id", async (req, res) => {
  const { id } = req.params;
  const sid_token = req.query["sid_token"] as string | undefined;
  if (!sid_token) {
    res.status(400).json({ error: "sid_token required" });
    return;
  }
  try {
    const r = await guerrillaFetch({ f: "fetch_email", email_id: id, sid_token });
    if (!r.ok) {
      res.status(502).json({ error: "Provider temporarily unavailable" });
      return;
    }
    const d = await r.json() as {
      mail_id?: string;
      mail_from?: string;
      mail_subject?: string;
      mail_timestamp?: string;
      mail_body?: string;
      mail_html?: string;
    };
    res.json({
      id: d.mail_id ?? id,
      from: d.mail_from ?? "",
      subject: d.mail_subject ?? "",
      timestamp: d.mail_timestamp ?? "",
      body: d.mail_html ?? d.mail_body ?? "",
      isHtml: !!d.mail_html,
    });
  } catch {
    res.status(502).json({ error: "Provider temporarily unavailable" });
  }
});

export default router;
