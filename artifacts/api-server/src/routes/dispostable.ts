import { Router } from "express";

const router = Router();
const BASE = "https://www.dispostable.com/api";

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; XToolkit/1.0)",
  "Accept": "application/json",
};

interface DispMsg {
  id: string;
  from: string;
  subject: string;
  date: string;
  body?: string;
}

function normalizeMessages(data: unknown): DispMsg[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  const list =
    Array.isArray(d["messages"]) ? d["messages"] :
    Array.isArray(d["emails"])   ? d["emails"]   :
    Array.isArray(data)          ? (data as unknown[]) : [];
  return (list as unknown[]).map((m: unknown, idx: number) => {
    const msg = (m ?? {}) as Record<string, unknown>;
    return {
      id:      String(msg["id"]   ?? msg["mid"]         ?? idx),
      from:    String(msg["sender"] ?? msg["from"]      ?? ""),
      subject: String(msg["subject"]                    ?? "(no subject)"),
      date:    String(msg["date"] ?? msg["received_at"] ?? new Date().toISOString()),
      body:    msg["body"] ? String(msg["body"]) : undefined,
    };
  });
}

router.get("/dispostable/new", async (req, res) => {
  try {
    const r = await fetch(`${BASE}/request_email/`, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) { res.status(503).json({ error: "Dispostable is unavailable." }); return; }
    const d = await r.json() as { email?: string; address?: string };
    const email = d.email ?? d.address;
    if (!email) { res.status(502).json({ error: "No email address returned." }); return; }
    const atIdx = email.lastIndexOf("@");
    const login  = atIdx > 0 ? email.slice(0, atIdx)  : email;
    const domain = atIdx > 0 ? email.slice(atIdx + 1) : "dispostable.com";
    res.json({ login, domain, email });
  } catch (err) {
    req.log.error({ err }, "dispostable new error");
    res.status(502).json({ error: "Failed to create inbox." });
  }
});

router.get("/dispostable/inbox", async (req, res) => {
  const { email } = req.query as { email?: string };
  if (!email) { res.status(400).json({ error: "email required." }); return; }
  try {
    const r = await fetch(`${BASE}/get_messages/?email=${encodeURIComponent(email)}`, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) { res.status(502).json({ error: "Failed to fetch inbox." }); return; }
    const data = await r.json();
    const messages = normalizeMessages(data);
    res.json({ messages });
  } catch (err) {
    req.log.error({ err }, "dispostable inbox error");
    res.status(502).json({ error: "Failed to fetch inbox." });
  }
});

router.get("/dispostable/message/:id", async (req, res) => {
  const { email } = req.query as { email?: string };
  const { id } = req.params;
  if (!email) { res.status(400).json({ error: "email required." }); return; }
  try {
    const r = await fetch(`${BASE}/get_messages/?email=${encodeURIComponent(email)}`, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) { res.status(502).json({ error: "Failed to fetch messages." }); return; }
    const data = await r.json();
    const messages = normalizeMessages(data);
    const msg = messages.find(m => m.id === id);
    if (!msg) { res.status(404).json({ error: "Message not found." }); return; }
    res.json({ ...msg, htmlBody: undefined, textBody: msg.body });
  } catch (err) {
    req.log.error({ err }, "dispostable message error");
    res.status(500).json({ error: "Failed to fetch message." });
  }
});

export default router;
