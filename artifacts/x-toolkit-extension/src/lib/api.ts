import { stripHtml, getIntro } from "./otp";

const API_BASE = "https://xtoolkit.live";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` })) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Guerrilla Mail ─────────────────────────────────────────────────────────

interface RawGuerrillaResponse {
  email_addr?: string;
  sid_token?: string;
  alias?: string;
}

function transformGuerrillaResponse(raw: RawGuerrillaResponse) {
  const emailAddr = raw.email_addr ?? "";
  const parts = emailAddr.split("@");
  return {
    email: emailAddr,
    user: parts[0] ?? "",
    domain: parts[1] ?? "",
    sid_token: raw.sid_token ?? "",
    domains: [] as string[],
  };
}

export async function guerrillaNew() {
  const raw = await apiFetch<RawGuerrillaResponse>("/api/guerrilla/new");
  return transformGuerrillaResponse(raw);
}

export async function guerrillaSetUser(user: string, domain: string, sid_token: string) {
  const raw = await apiFetch<RawGuerrillaResponse>("/api/guerrilla/set-user", {
    method: "POST",
    body: JSON.stringify({ user, domain, sid_token }),
  });
  return transformGuerrillaResponse(raw);
}

export async function guerrillaInbox(sid_token: string) {
  const data = await apiFetch<{ list?: RawGuerrillaMessage[] }>(`/api/guerrilla/inbox?sid_token=${encodeURIComponent(sid_token)}`);
  return { messages: data.list ?? [] };
}

export async function guerrillaMessage(id: string, sid_token: string) {
  const raw = await apiFetch<RawGuerrillaMessage>(`/api/guerrilla/message/${id}?sid_token=${encodeURIComponent(sid_token)}`);
  return {
    body: raw.mail_body ?? "",
    from: raw.mail_from ?? "",
    subject: raw.mail_subject ?? "",
  };
}

interface RawGuerrillaMessage {
  mail_id: string;
  mail_from?: string;
  mail_subject?: string;
  mail_date?: string;
  mail_excerpt?: string;
  mail_body?: string;
}

export function normaliseGuerrilla(m: RawGuerrillaMessage) {
  const rawExcerpt = m.mail_excerpt ?? "";
  const intro = rawExcerpt ? getIntro(stripHtml(rawExcerpt), 80) : "";
  return {
    id: String(m.mail_id),
    from: m.mail_from ?? "",
    subject: m.mail_subject ?? "(no subject)",
    date: m.mail_date ?? "",
    body: m.mail_body ?? "",
    bodyContentType: "html" as const,
    intro,
  };
}

// ── mail.gw ────────────────────────────────────────────────────────────────

export async function mailgwNew() {
  return apiFetch<{ email: string; login: string; domain: string; token: string }>("/api/freemail/new?provider=mailgw");
}

export async function mailgwInbox(token: string) {
  const msgs = await apiFetch<RawMailgwMessage[]>(`/api/freemail/inbox?token=${encodeURIComponent(token)}&provider=mailgw`);
  return { messages: Array.isArray(msgs) ? msgs : [] };
}

export async function mailgwMessage(id: string, token: string) {
  return apiFetch<{ id: string; from: string; subject: string; date: string; body: string; isHtml: boolean }>(
    `/api/freemail/message/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}&provider=mailgw`
  );
}

interface RawMailgwMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
}

export function normaliseMailgw(m: RawMailgwMessage) {
  return {
    id: m.id,
    from: m.from ?? "",
    subject: m.subject ?? "(no subject)",
    date: m.date ?? "",
    body: "",
    bodyContentType: "html" as const,
    intro: "",
  };
}

// ── Maildrop.cc (via /api/freemail/*) ─────────────────────────────────────

export async function maildropNew() {
  return apiFetch<{ email: string; login: string; domain: string; token: string }>("/api/freemail/new");
}

export async function maildropInbox(token: string) {
  const msgs = await apiFetch<RawMaildropMessage[]>(`/api/freemail/inbox?token=${encodeURIComponent(token)}`);
  return { messages: Array.isArray(msgs) ? msgs : [] };
}

export async function maildropMessage(id: string, token: string) {
  return apiFetch<{ id: string; from: string; subject: string; date: string; body: string; isHtml: boolean }>(
    `/api/freemail/message/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`
  );
}

interface RawMaildropMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
}

export function normaliseMaildrop(m: RawMaildropMessage) {
  return {
    id: m.id,
    from: m.from ?? "",
    subject: m.subject ?? "(no subject)",
    date: m.date ?? "",
    body: "",
    bodyContentType: "html" as const,
    intro: "",
  };
}

// ── TempTF / Gmail ─────────────────────────────────────────────────────────

export async function temptfGenerate(_providers = "gmail", type = "dot") {
  return apiFetch<{ email: string }>("/api/temptf/generate", {
    method: "POST",
    body: JSON.stringify({ type: type === "plus" ? "plus" : "dot" }),
  });
}

export async function temptfMessages(email: string) {
  const data = await apiFetch<{ data?: RawTempTfMessage[]; totalReceived?: number }>("/api/temptf/check", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return {
    messages: data.data ?? [],
    totalReceived: data.totalReceived ?? 0,
  };
}

interface RawTempTfMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
  bodyContentType: "html" | "text";
  hasAttachments: boolean;
}

export function normaliseTemptf(m: RawTempTfMessage) {
  return {
    id: m.id,
    from: m.from ?? "",
    subject: m.subject ?? "(no subject)",
    date: m.date ?? "",
    body: m.body ?? "",
    bodyContentType: m.bodyContentType ?? "text",
    intro: "",
  };
}
