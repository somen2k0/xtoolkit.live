import { useState, useCallback, useRef, useEffect } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import {
  Mail, RefreshCw, Copy, Inbox, ArrowLeft,
  Clock, Loader2, MailOpen, AlertCircle, Shuffle,
  Plus, Hash, CheckCircle2, ExternalLink, ChevronDown,
  Zap, Download,
} from "lucide-react";
import { Link } from "wouter";

// ── Types ──────────────────────────────────────────────────────────

const GUERRILLA_DOMAINS = [
  "guerrillamail.com",
  "grr.la",
  "sharklasers.com",
  "spam4.me",
];

interface GuerrillaMessage {
  mail_id: string; mail_from: string; mail_subject: string; mail_timestamp: string; mail_read: string; mail_exerpt?: string;
}

interface GFullMsg { id: string; from: string; subject: string; body: string; isHtml: boolean }

interface FreemailMessage {
  id: string;
  from: { address: string; name?: string };
  subject: string;
  intro?: string;
  seen: boolean;
  createdAt: string;
}

type Tab = "disposable" | "tempgmail" | "gmail";

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

const GUERRILLA_FIRST = ["james","john","robert","michael","william","david","richard","joseph","thomas","charles","mary","patricia","jennifer","linda","barbara","elizabeth","susan","jessica","sarah","karen","emma","oliver","noah","liam","sophia","lucas","mason","ethan","isabella"];
const GUERRILLA_LAST  = ["smith","johnson","williams","brown","jones","garcia","miller","davis","wilson","taylor","anderson","thomas","jackson","white","harris","martin","thompson","clark"];

function randomGuerrillaName(): string {
  const f = GUERRILLA_FIRST[Math.floor(Math.random() * GUERRILLA_FIRST.length)]!;
  const l = GUERRILLA_LAST[Math.floor(Math.random() * GUERRILLA_LAST.length)]!;
  const n = Math.floor(Math.random() * 99);
  return `${f}.${l}${n > 0 ? n : ""}`;
}

const GMAIL_FIRST = ["james","john","robert","michael","william","david","richard","joseph","thomas","charles","christopher","daniel","matthew","anthony","mark","donald","steven","paul","andrew","joshua","kevin","brian","george","timothy","ronald","edward","jason","jeffrey","ryan","jacob","mary","patricia","jennifer","linda","barbara","elizabeth","susan","jessica","sarah","karen","lisa","nancy","betty","margaret","sandra","ashley","dorothy","kimberly","emily","donna","michelle","carol","amanda","melissa","deborah","stephanie","rebecca","sharon","laura","cynthia","kathleen","amy","angela","anna","brenda","pamela","emma","nicole","helen","samantha","katherine","diana","rachel"];
const GMAIL_LAST = ["smith","johnson","williams","brown","jones","garcia","miller","davis","rodriguez","martinez","hernandez","lopez","gonzalez","wilson","anderson","thomas","taylor","moore","jackson","martin","lee","perez","thompson","white","harris","sanchez","clark","ramirez","lewis","robinson","walker","young","allen","king","wright","scott","torres","nguyen","hill","flores","green","adams","nelson","baker","hall","rivera","campbell","mitchell","carter","roberts"];

function generateLocalGmailAddress(type: "dot" | "plus"): string {
  const first = GMAIL_FIRST[Math.floor(Math.random() * GMAIL_FIRST.length)]!;
  const last  = GMAIL_LAST[Math.floor(Math.random() * GMAIL_LAST.length)]!;
  const base  = `${first}${last}`;
  if (type === "plus") {
    const tags = ["news","shop","social","work","promo","alerts","updates","deals","temp","signup"];
    return `${base}+${tags[Math.floor(Math.random() * tags.length)]}@gmail.com`;
  }
  const chars = base.split("");
  const maxDots = Math.min(3, chars.length - 2);
  const numDots = Math.floor(Math.random() * maxDots) + 1;
  const positions = new Set<number>();
  while (positions.size < numDots) positions.add(Math.floor(Math.random() * (chars.length - 1)) + 1);
  const sorted = Array.from(positions).sort((a, b) => a - b);
  let result = "";
  for (let i = 0; i < chars.length; i++) { if (sorted.includes(i)) result += "."; result += chars[i]; }
  return `${result}@gmail.com`;
}

const REFRESH_MS = 15000;
const INBOX_STORAGE_KEY = "xt_inbox_session_g";
const SESSION_TTL = 3 * 60 * 60 * 1000;

interface PersistedInbox { sid: string; email: string; user: string; domain: string; savedAt: number; freemailToken?: string; freemailProvider?: string }

function saveInboxSession(sid: string, email: string, user: string, domain: string, freemailToken?: string, freemailProvider?: string): void {
  try { localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify({ sid, email, user, domain, savedAt: Date.now(), freemailToken, freemailProvider })); } catch {}
}

function loadInboxSession(): PersistedInbox | null {
  try {
    const raw = localStorage.getItem(INBOX_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedInbox;
    if (Date.now() - data.savedAt > SESSION_TTL) { localStorage.removeItem(INBOX_STORAGE_KEY); return null; }
    return data;
  } catch { return null; }
}

function clearInboxSession(): void {
  try { localStorage.removeItem(INBOX_STORAGE_KEY); } catch {}
}

// ── Helpers ────────────────────────────────────────────────────────

function timeAgo(ts: string | number): string {
  if (!ts || ts === 0 || ts === "0") return "";
  const n = typeof ts === "number" ? ts * 1000 : new Date(ts).getTime();
  if (isNaN(n) || n <= 0) return "";
  const diff = Date.now() - n;
  if (diff < 0) return "Just now";
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  return new Date(n).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function dotVariants(name: string): string[] {
  const x = name.replace(/\./g, "").toLowerCase();
  if (x.length < 2) return [`${x}@gmail.com`];
  const results: string[] = [];
  const slots = x.length - 1;
  const total = Math.min(Math.pow(2, slots), 32);
  for (let mask = 0; mask < total; mask++) {
    let v = x[0];
    for (let i = 0; i < slots; i++) { if (mask & (1 << i)) v += "."; v += x[i + 1]; }
    results.push(`${v}@gmail.com`);
  }
  return results;
}

const PLUS_TAGS = ["newsletters","shopping","social","spam","work","promo","subscriptions","alerts","updates","receipts","travel","finance","health","gaming","news","jobs","events","school","personal","test","noreply","signup","deals","banking","govt","apps","temp","dev","backup","bulk"];

// ── Email display utilities ────────────────────────────────────────

function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/td>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function detectOTP(text: string): string | null {
  if (!text) return null;

  // Priority 1: alphanumeric dash-separated codes (e.g. "RI2-DDX")
  const alphaNumPatterns: RegExp[] = [
    /(?:code|otp|token|verification|confirm(?:ation)?)[\s:]+([A-Z0-9]{2,6}[-–—][A-Z0-9]{2,6})/i,
    /\b([A-Z]{1,4}[0-9]{1,4}[-–—][A-Z]{1,4}[0-9]{0,4})\b/,
    /\b([A-Z0-9]{2,4}[-–—][A-Z0-9]{2,4}[-–—][A-Z0-9]{2,4})\b/,
  ];
  for (const pattern of alphaNumPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].toUpperCase();
  }

  // Priority 2: keyword-adjacent numeric codes
  const keywordPatterns: RegExp[] = [
    /(?:code|otp|pin|password|token|verification)[:\s]+(\d{4,8})/i,
    /(\d{4,8})(?:\s+is\s+your)/i,
    /your\s+(?:code|otp|pin)[:\s]+(\d{4,8})/i,
    /(?:verification|confirm(?:ation)?|one.?time|security|access|login|sign.?in|auth(?:entication)?)\s*(?:code|pin|otp|number|token)[^a-z0-9]*(\d{4,8})/i,
  ];
  for (const pattern of keywordPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }

  // Priority 3: 6-digit number
  const sixDigit = text.match(/\b(\d{6})\b/);
  if (sixDigit?.[1]) return sixDigit[1];

  // Priority 4: other digit lengths
  for (const len of [4, 5, 7, 8]) {
    const m = text.match(new RegExp(`\\b(\\d{${len}})\\b`));
    if (m?.[1]) return m[1];
  }

  return null;
}

function stripOrphanedCss(text: string): string {
  return text
    .replace(/\*\s*\{[^{}]*\}/g, "")
    .replace(/(?:^|\n)[^<{\n]*\{[^{}<>]*\}[ \t]*/gm, "\n")
    .replace(/^\s*[\w-]+\s*:\s*[^;{}<>\n]+;\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractImgSizeFromStyle(styleVal: string): string {
  const wm = /\bwidth\s*:\s*([\d.]+)\s*px/i.exec(styleVal);
  const hm = /\bheight\s*:\s*([\d.]+)\s*px/i.exec(styleVal);
  let attrs = "";
  if (wm) attrs += ` width="${Math.round(Number(wm[1]))}"`;
  if (hm) attrs += ` height="${Math.round(Number(hm[1]))}"`;
  return attrs;
}

const EMAIL_IMG_CAP = `<style>img{max-width:min(100%,120px)!important;height:auto!important;display:block}</style>`;

function sanitizeEmailHtml(html: string, otpCode: string | null): string {
  let out = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // Preserve width/height from img inline styles before stripping all styles
    .replace(/<img([^>]*?)style=["']([^"']*)["']([^>]*?)>/gi, (_m, before, styleVal, after) => {
      const extras = extractImgSizeFromStyle(styleVal);
      return `<img${before}${extras}${after}>`;
    })
    .replace(/\sstyle=["'][^"']*["']/gi, "")
    .replace(/\scolor=["'][^"']*["']/gi, "")
    .replace(/\sbgcolor=["'][^"']*["']/gi, "")
    .replace(/\son\w+=["'][^"']*["']/gi, "")
    .replace(/href=["']javascript:[^"']*["']/gi, 'href="#"')
    .replace(/<a(\s[^>]*)>/gi, (_match, attrs) => {
      const clean = attrs
        .replace(/\starget=["'][^"']*["']/gi, "")
        .replace(/\srel=["'][^"']*["']/gi, "");
      return `<a${clean} target="_blank" rel="noopener noreferrer">`;
    })
    .replace(/<table(\s[^>]*)?>/gi, '<table$1 style="width:100%!important;border-collapse:collapse">');

  if (otpCode) {
    out = out.replace(
      new RegExp(`\\b(${otpCode})\\b`, "g"),
      `<span style="background:rgba(16,185,129,0.2);color:#4ade80;padding:2px 6px;border-radius:4px;font-weight:700;font-family:monospace">$1</span>`,
    );
  }
  return EMAIL_IMG_CAP + out;
}

function EmailMessageBody({ body, isHtml, subject }: { body: string; isHtml: boolean; subject?: string }) {
  const [otpCopied, setOtpCopied] = useState(false);
  const [bodyCopied, setBodyCopied] = useState(false);
  const plainText = isHtml ? htmlToPlainText(body) : body;
  const otp = detectOTP(plainText) ?? (subject ? detectOTP(subject) : null);
  const sanitizedHtml = isHtml ? sanitizeEmailHtml(stripOrphanedCss(body), otp) : null;

  const copyOtp = () => {
    if (!otp) return;
    navigator.clipboard.writeText(otp);
    setOtpCopied(true);
    setTimeout(() => setOtpCopied(false), 2000);
  };

  const copyBody = () => {
    navigator.clipboard.writeText(plainText);
    setBodyCopied(true);
    setTimeout(() => setBodyCopied(false), 2000);
  };

  const bodyStyle: React.CSSProperties = {
    background: "#0f0f1a",
    color: "#e2e8f0",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: "1.6",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid rgba(99,102,241,0.15)",
    maxWidth: "100%",
    wordBreak: "break-word",
    overflowX: "hidden",
    WebkitUserSelect: "text",
    userSelect: "text",
  };

  return (
    <div className="space-y-3">
      {otp && (
        <div style={{
          background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: "8px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}>
          <div>
            <div style={{ fontSize: "10px", color: "#10b981", fontWeight: 600, letterSpacing: "1px", marginBottom: "4px" }}>
              VERIFICATION CODE
            </div>
            <div style={{ fontSize: "28px", color: "#4ade80", fontWeight: 700, fontFamily: "monospace", letterSpacing: "4px" }}>
              {otp}
            </div>
          </div>
          <button
            onClick={copyOtp}
            style={{
              background: otpCopied ? "#059669" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            {otpCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      {sanitizedHtml !== null ? (
        <div style={bodyStyle} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      ) : (
        <pre style={{ ...bodyStyle, whiteSpace: "pre-wrap" }}>{body}</pre>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={copyBody}
          style={{
            fontSize: "12px",
            color: bodyCopied ? "#10b981" : "rgba(148,163,184,0.7)",
            background: "transparent",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: "6px",
            padding: "5px 12px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {bodyCopied ? "Copied!" : "Copy email text"}
        </button>
      </div>
    </div>
  );
}

// ── FAQ / related ──────────────────────────────────────────────────

const faqs = [
  { q: "What is a disposable email address?", a: "A disposable email is a temporary inbox you can use for sign-ups, trials, or any situation where you don't want to give out your real email. It receives real emails but can be discarded at any time." },
  { q: "How long does the inbox last?", a: "Inboxes are session-based. If you reload without saving the address, the inbox is lost. Your session is saved automatically in your browser so you can refresh the page and return to the same inbox." },
  { q: "What is the Gmail dot trick?", a: "Gmail ignores dots in usernames — john.doe@gmail.com and johndoe@gmail.com deliver to the same inbox. You can use any dot variant to register on sites that check for duplicate emails." },
  { q: "What is the Gmail plus trick?", a: "Adding +anything after your Gmail username still delivers to your main inbox. john+spam@gmail.com reaches John's inbox. Use it to create Gmail filters and track who shares your address with advertisers." },
  { q: "Is my data private?", a: "The disposable inbox is not linked to your identity. However, anyone who knows the address can access it. Don't use it for sensitive communications." },
];

const relatedTools = [
  { title: "Temp Gmail", href: "/tools/temp-mail/tempgmail", description: "Generate temporary Gmail addresses with dot and plus tricks." },
  { title: "Masked Email Generator", href: "/tools/masked-email-generator", description: "Generate random email aliases to protect your real inbox." },
  { title: "Email Validator", href: "/tools/email-validator", description: "Validate email address syntax instantly." },
  { title: "Email Signature Generator", href: "/tools/email-signature-generator", description: "Build a professional email signature." },
  { title: "Spam Score Checker", href: "/tools/spam-score-checker", description: "Check your email for spam trigger words and signals." },
];

// ── Tab 1: Disposable inbox (GuerrillaMail + Mail.tm + Mail.gw) ─────

function UnifiedInboxSection() {
  const [sid, setSid] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [domain, setDomain] = useState<string>(GUERRILLA_DOMAINS[0]!);
  const [messages, setMessages] = useState<GuerrillaMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<GFullMsg | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [showDomainDrop, setShowDomainDrop] = useState(false);
  const [freemailDomains, setFreemailDomains] = useState<{ domain: string; provider: string }[]>([]);
  const { toast } = useToast();
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialized = useRef(false);
  const sidRef = useRef<string>("");
  const freemailTokenRef = useRef<string>("");
  const freemailProviderRef = useRef<string>("mailtm");
  const activeProviderRef = useRef<"guerrilla" | "freemail">("guerrilla");

  // ── fetch inbox ────────────────────────────────────────────────────
  const fetchInbox = useCallback(async (token: string, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const r = await fetch(`/api/guerrilla/inbox?sid_token=${encodeURIComponent(token)}&seq=0`, {
        signal: AbortSignal.timeout(12000),
      });
      if (r.ok) {
        const d = await r.json() as { list?: GuerrillaMessage[] };
        const msgs = d.list ?? [];
        if (Array.isArray(msgs)) {
          setMessages(prev => {
            const map = new Map(prev.map(x => [x.mail_id, x]));
            msgs.forEach(x => map.set(x.mail_id, { ...map.get(x.mail_id), ...x }));
            return Array.from(map.values());
          });
        }
      }
    } catch {} finally { if (!silent) setLoadingMsgs(false); }
  }, []);

  // ── fetch inbox (Freemail) ─────────────────────────────────────────
  const fetchFreemailInbox = useCallback(async (token: string, provider: string, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const r = await fetch(`/api/freemail/inbox?token=${encodeURIComponent(token)}&provider=${provider}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (r.ok) {
        const msgs = await r.json() as FreemailMessage[];
        if (Array.isArray(msgs)) {
          const normalized: GuerrillaMessage[] = msgs.map(m => ({
            mail_id: m.id,
            mail_from: m.from?.address ?? "Unknown",
            mail_subject: m.subject,
            mail_timestamp: String(Math.floor(new Date(m.createdAt).getTime() / 1000)),
            mail_read: m.seen ? "1" : "0",
            mail_exerpt: m.intro,
          }));
          setMessages(prev => {
            const map = new Map(prev.map(x => [x.mail_id, x]));
            normalized.forEach(x => map.set(x.mail_id, { ...map.get(x.mail_id), ...x }));
            return Array.from(map.values());
          });
        }
      }
    } catch {} finally { if (!silent) setLoadingMsgs(false); }
  }, []);

  // ── polling ────────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    setCountdown(REFRESH_MS / 1000);
    refreshTimer.current = setInterval(() => {
      if (activeProviderRef.current === "guerrilla" && sidRef.current) {
        fetchInbox(sidRef.current, true);
      } else if (activeProviderRef.current === "freemail" && freemailTokenRef.current) {
        fetchFreemailInbox(freemailTokenRef.current, freemailProviderRef.current, true);
      }
      setCountdown(REFRESH_MS / 1000);
    }, REFRESH_MS);
    countdownTimer.current = setInterval(() => setCountdown(c => c <= 1 ? REFRESH_MS / 1000 : c - 1), 1000);
  }, [fetchInbox, fetchFreemailInbox]);

  // ── create inbox ───────────────────────────────────────────────────
  const createInbox = useCallback(async (targetDomain?: string) => {
    setCreating(true); setError(null);
    setMessages([]); setSelectedMsg(null); setSelectedId(null);
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    clearInboxSession();
    try {
      const r1 = await fetch("/api/guerrilla/new");
      if (!r1.ok) throw new Error("Failed to get session");
      const d1 = await r1.json() as { email_addr?: string; sid_token?: string };
      if (!d1.sid_token) throw new Error("No session token received");
      const token = d1.sid_token;
      const name = randomGuerrillaName();
      const r2 = await fetch("/api/guerrilla/set-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: name, sid_token: token, domain: targetDomain ?? domain }),
      });
      if (!r2.ok) throw new Error("Failed to set username");
      const d2 = await r2.json() as { email_addr?: string; sid_token?: string };
      const apiEmail = d2.email_addr ?? `${name}@${targetDomain ?? domain}`;
      const apiUser = apiEmail.split("@")[0] ?? name;
      const finalDomain = targetDomain ?? domain;
      const finalUser = apiUser;
      const finalEmail = `${finalUser}@${finalDomain}`;
      sidRef.current = token;
      activeProviderRef.current = "guerrilla";
      setSid(token); setEmail(finalEmail); setUser(finalUser); setDomain(finalDomain);
      saveInboxSession(token, finalEmail, finalUser, finalDomain);
      await fetchInbox(token);
      startPolling();
    } catch (e: any) {
      setError("Could not create inbox. Please try again.");
      console.error("createInbox error:", e.message);
    } finally {
      setCreating(false);
    }
  }, [domain, fetchInbox, startPolling]);

  // ── create inbox (Freemail) ────────────────────────────────────────
  const createFreemailInbox = useCallback(async (targetDomain: string, provider: string) => {
    setCreating(true); setError(null);
    setMessages([]); setSelectedMsg(null); setSelectedId(null);
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    clearInboxSession();
    try {
      const r = await fetch(`/api/freemail/new?provider=${provider}`);
      if (!r.ok) throw new Error("Failed to create inbox");
      const d = await r.json() as { address?: string; token?: string; error?: string };
      if (d.error) throw new Error(d.error);
      if (!d.address || !d.token) throw new Error("Invalid response from provider");
      const parts = d.address.split("@");
      const finalUser = parts[0] ?? "";
      const finalDomain = parts[1] ?? targetDomain;
      freemailTokenRef.current = d.token;
      freemailProviderRef.current = provider;
      activeProviderRef.current = "freemail";
      sidRef.current = "";
      setSid("");
      setEmail(d.address);
      setUser(finalUser);
      setDomain(finalDomain);
      saveInboxSession("", d.address, finalUser, finalDomain, d.token, provider);
      await fetchFreemailInbox(d.token, provider);
      startPolling();
    } catch (e: any) {
      setError("Could not create inbox. Please try again.");
      console.error("createFreemailInbox error:", e.message);
    } finally {
      setCreating(false);
    }
  }, [fetchFreemailInbox, startPolling]);

  // ── open message ───────────────────────────────────────────────────
  const openMessage = async (msg: GuerrillaMessage) => {
    setSelectedId(msg.mail_id); setLoadingMsg(true); setSelectedMsg(null);
    try {
      if (activeProviderRef.current === "freemail" && freemailTokenRef.current) {
        const r = await fetch(
          `/api/freemail/message/${encodeURIComponent(msg.mail_id)}?token=${encodeURIComponent(freemailTokenRef.current)}&provider=${freemailProviderRef.current}`,
          { signal: AbortSignal.timeout(12000) },
        );
        if (r.ok) {
          const d = await r.json() as { id?: string; from?: { address?: string }; subject?: string; text?: string; html?: string[] };
          const body = d.html?.[0] || d.text || "";
          const isHtml = !!(d.html?.[0]) || /<[a-zA-Z][\s\S]*?>/.test(body);
          setSelectedMsg({ id: d.id ?? msg.mail_id, from: d.from?.address ?? msg.mail_from, subject: d.subject ?? msg.mail_subject, body, isHtml });
        } else {
          setSelectedMsg({ id: msg.mail_id, from: msg.mail_from, subject: msg.mail_subject, body: "", isHtml: false });
        }
      } else if (sidRef.current) {
        const r = await fetch(
          `/api/guerrilla/message/${encodeURIComponent(msg.mail_id)}?sid_token=${encodeURIComponent(sidRef.current)}`,
          { signal: AbortSignal.timeout(12000) },
        );
        if (r.ok) {
          const d = await r.json() as { mail_id?: string; mail_from?: string; mail_subject?: string; mail_body?: string; mail_html?: string };
          const body = d.mail_html || d.mail_body || "";
          const isHtml = !!d.mail_html || /<[a-zA-Z][\s\S]*?>/.test(body);
          setSelectedMsg({ id: d.mail_id ?? msg.mail_id, from: d.mail_from ?? msg.mail_from, subject: d.mail_subject ?? msg.mail_subject, body, isHtml });
        } else {
          setSelectedMsg({ id: msg.mail_id, from: msg.mail_from, subject: msg.mail_subject, body: "", isHtml: false });
        }
      }
    } catch {
      setSelectedMsg({ id: msg.mail_id, from: msg.mail_from, subject: msg.mail_subject, body: "", isHtml: false });
    }
    setMessages(ms => ms.map(m => m.mail_id === msg.mail_id ? { ...m, mail_read: "1" } : m));
    setLoadingMsg(false);
  };

  const copyAddress = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: email });
  };

  // ── init ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetch("/api/freemail/domains")
      .then(r => r.json())
      .then((domains: { domain: string; provider: string }[]) => {
        if (Array.isArray(domains)) setFreemailDomains(domains);
      })
      .catch(() => {});
    const saved = loadInboxSession();
    if (saved && saved.freemailToken && saved.freemailProvider) {
      freemailTokenRef.current = saved.freemailToken;
      freemailProviderRef.current = saved.freemailProvider;
      activeProviderRef.current = "freemail";
      sidRef.current = "";
      setSid(""); setEmail(saved.email); setUser(saved.user); setDomain(saved.domain);
      fetchFreemailInbox(saved.freemailToken, saved.freemailProvider).then(() => startPolling());
    } else if (saved && saved.sid) {
      sidRef.current = saved.sid;
      activeProviderRef.current = "guerrilla";
      setSid(saved.sid); setEmail(saved.email); setUser(saved.user); setDomain(saved.domain);
      fetchInbox(saved.sid).then(() => startPolling());
    } else {
      createInbox();
    }
  }, []);

  useEffect(() => () => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
  }, []);

  const unread = messages.filter(m => m.mail_read === "0").length;
  const totalDomains = GUERRILLA_DOMAINS.length + freemailDomains.length;

  const handleRefresh = () => {
    if (activeProviderRef.current === "freemail" && freemailTokenRef.current) {
      fetchFreemailInbox(freemailTokenRef.current, freemailProviderRef.current);
    } else if (sid) {
      fetchInbox(sid);
    }
  };

  return (
    <div className="space-y-4">
      {/* Address card */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-cyan-400/10 border border-cyan-400/20">
            <Mail className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
              Your temporary email
            </p>
            {email ? (
              <div className="flex flex-wrap items-center gap-0.5 font-mono text-base font-semibold">
                <span className="text-foreground">{user}</span>
                <span className="text-muted-foreground">@</span>
                <span className="text-cyan-400">{domain}</span>
              </div>
            ) : (
              <div className="h-6 bg-muted/60 rounded animate-pulse w-56 mt-1" />
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 mt-1">
            <Clock className="h-3 w-3" />{countdown}s
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button onClick={copyAddress} disabled={!email} size="sm"
            className="text-xs gap-1.5 font-semibold bg-cyan-500 hover:bg-cyan-400 text-black">
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Address"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loadingMsgs || !email} className="text-xs gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${loadingMsgs ? "animate-spin" : ""}`} />Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => createInbox()} disabled={creating} className="text-xs gap-1.5">
            <Shuffle className="h-3.5 w-3.5" />{creating ? "Creating…" : "New Address"}
          </Button>

          {/* Domain picker */}
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowDomainDrop(v => !v)} disabled={!email || creating} className="text-xs gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              {domain}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {showDomainDrop && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border/60 rounded-xl shadow-xl min-w-56 max-h-80 overflow-y-auto">
                {/* GuerrillaMail */}
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/30 border-b border-border/30 sticky top-0">
                  GuerrillaMail ({GUERRILLA_DOMAINS.length})
                </div>
                {GUERRILLA_DOMAINS.map(d => (
                  <button key={d} onClick={() => { setShowDomainDrop(false); createInbox(d); }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-muted/60 transition-colors border-b border-border/20 flex items-center gap-2 ${d === domain ? "text-cyan-400 font-semibold bg-muted/20" : "text-foreground/80"}`}>
                    {d === domain && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />}
                    <span className="font-mono text-cyan-400 flex-1">{d}</span>
                  </button>
                ))}
                {/* Mail.tm */}
                {freemailDomains.filter(x => x.provider === "mailtm").length > 0 && <>
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/30 border-b border-border/30 sticky top-[28px]">
                    Mail.tm ({freemailDomains.filter(x => x.provider === "mailtm").length})
                  </div>
                  {freemailDomains.filter(x => x.provider === "mailtm").map(({ domain: d }) => (
                    <button key={d} onClick={() => { setShowDomainDrop(false); createFreemailInbox(d, "mailtm"); }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-muted/60 transition-colors border-b border-border/20 flex items-center gap-2 ${d === domain ? "text-violet-400 font-semibold bg-muted/20" : "text-foreground/80"}`}>
                      {d === domain && <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />}
                      <span className="font-mono text-violet-400 flex-1">{d}</span>
                    </button>
                  ))}
                </>}
                {/* Mail.gw */}
                {freemailDomains.filter(x => x.provider === "mailgw").length > 0 && <>
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/30 border-b border-border/30 sticky top-[56px]">
                    Mail.gw ({freemailDomains.filter(x => x.provider === "mailgw").length})
                  </div>
                  {freemailDomains.filter(x => x.provider === "mailgw").map(({ domain: d }) => (
                    <button key={d} onClick={() => { setShowDomainDrop(false); createFreemailInbox(d, "mailgw"); }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-muted/60 transition-colors border-b border-border/20 flex items-center gap-2 ${d === domain ? "text-emerald-400 font-semibold bg-muted/20" : "text-foreground/80"}`}>
                      {d === domain && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />}
                      <span className="font-mono text-emerald-400 flex-1">{d}</span>
                    </button>
                  ))}
                </>}
                {freemailDomains.length === 0 && (
                  <div className="px-4 py-3 text-xs text-muted-foreground/60 text-center border-t border-border/20">Loading additional domains…</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300 flex-1">{error}</p>
          <Button size="sm" variant="outline" onClick={() => createInbox()} disabled={creating}
            className="text-xs gap-1.5 border-red-500/40 text-red-300 hover:bg-red-500/10 shrink-0">
            <RefreshCw className={`h-3.5 w-3.5 ${creating ? "animate-spin" : ""}`} />Retry
          </Button>
        </div>
      )}

      {/* Split inbox view */}
      <div className="grid md:grid-cols-5 gap-3 min-h-[380px]">
        <div className="md:col-span-2 rounded-xl border border-border/60 bg-card/30 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Inbox</span>
              {unread > 0 && (
                <span className="h-4 min-w-4 px-1.5 text-[10px] rounded-full flex items-center justify-center font-bold bg-cyan-500 text-black">{unread} new</span>
              )}
              {loadingMsgs && messages.length > 0 && (
                <span className="text-[10px] text-muted-foreground/50">Checking…</span>
              )}
            </div>
            <button onClick={() => sid && fetchInbox(sid)} disabled={loadingMsgs}
              className="h-7 w-7 rounded-md border border-border/60 bg-muted/30 hover:bg-muted/60 flex items-center justify-center transition-colors disabled:opacity-50">
              <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${loadingMsgs ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {(creating || loadingMsgs) && messages.length === 0 && (
              <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> {creating ? "Creating inbox…" : "Checking inbox…"}
              </div>
            )}
            {!creating && !loadingMsgs && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-4">
                <div className="h-12 w-12 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center">
                  <MailOpen className="h-6 w-6 text-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground/60 font-medium">No messages yet</p>
                  <p className="text-xs text-muted-foreground/40 mt-0.5">Emails sent here appear instantly</p>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-muted/30 border border-border/40 rounded-full px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] text-muted-foreground/60">Auto-checking in <span className="text-cyan-400 font-semibold">{countdown}s</span></span>
                </div>
              </div>
            )}
            {messages.map(msg => {
              const sender = msg.mail_from || "Unknown";
              const avatarChar = (sender.split("@")[0]?.[0] ?? "?").toUpperCase();
              const hue = sender.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
              const isUnread = msg.mail_read === "0" && !readIds.has(msg.mail_id);
              return (
                <button key={msg.mail_id}
                  onClick={() => { setReadIds(prev => new Set([...prev, msg.mail_id])); openMessage(msg); }}
                  className={`w-full text-left px-3 py-2.5 transition-colors hover:bg-muted/30 border-b border-border/20 last:border-b-0 flex items-start gap-3 ${selectedId === msg.mail_id ? "bg-muted/20" : ""}`}
                  style={{ borderLeft: `3px solid ${isUnread ? "rgb(34,211,238)" : "transparent"}` }}>
                  <div className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: `hsl(${hue},45%,18%)`, color: `hsl(${hue},65%,65%)`, border: `1.5px solid hsl(${hue},45%,28%)` }}>
                    {avatarChar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 justify-between">
                      <p className={`text-xs truncate ${isUnread ? "font-semibold text-foreground" : "text-foreground/60"}`}>{sender}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                        <span className="text-[10px] text-muted-foreground/40">{timeAgo(msg.mail_timestamp)}</span>
                      </div>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${isUnread ? "font-semibold text-foreground" : "text-foreground/60"}`}>
                      {msg.mail_subject || "(No subject)"}
                    </p>
                    {msg.mail_exerpt && (
                      <p className="text-[11px] truncate mt-0.5 text-muted-foreground/40">{msg.mail_exerpt}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-3 rounded-xl border border-border/60 bg-card/30 overflow-hidden flex flex-col">
          {selectedMsg ? (
            <>
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3 bg-muted/20">
                <button onClick={() => { setSelectedMsg(null); setSelectedId(null); }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm font-semibold truncate">{selectedMsg.subject || "(No subject)"}</p>
                  <p className="text-xs text-muted-foreground truncate">{selectedMsg.from}</p>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4" style={{ maxHeight: "360px" }}>
                {selectedMsg.body
                  ? <EmailMessageBody body={selectedMsg.body} isHtml={selectedMsg.isHtml} subject={selectedMsg.subject} />
                  : <p className="text-sm text-muted-foreground">(Empty message)</p>}
              </div>
            </>
          ) : loadingMsg ? (
            <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground text-sm flex-1">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center px-6 gap-3">
              <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-center">
                <Mail className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground/60">Select a message to read it</p>
                <p className="text-xs text-muted-foreground/40 mt-1">Messages appear automatically when received</p>
              </div>
              {email && (
                <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  Auto-refreshing every {REFRESH_MS / 1000}s
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: `${totalDomains || GUERRILLA_DOMAINS.length}+ domains available` },
          { label: "Session-persistent inbox" },
          { label: `Auto-refresh ${REFRESH_MS / 1000}s` },
          { label: "GuerrillaMail · Mail.tm · Mail.gw" },
        ].map(({ label }) => (
          <div key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3 py-1">
            <Mail className="h-3 w-3 text-cyan-400" />{label}
          </div>
        ))}
      </div>
    </div>
  );
}


// ── Tab 2: Temp Gmail (temp.tf via backend) ─────────────────────────

const GMAIL_REFRESH_MS = 15000;
const GMAIL_CACHE_KEY = "xt_tempgmail_session";
const GMAIL_CACHE_TTL = 60 * 60 * 1000; // 1 hour

function saveCachedGmail(email: string): void {
  try { localStorage.setItem(GMAIL_CACHE_KEY, JSON.stringify({ email, savedAt: Date.now() })); } catch {}
}

function loadCachedGmail(): string | null {
  try {
    const raw = localStorage.getItem(GMAIL_CACHE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as { email: string; savedAt: number };
    if (Date.now() - d.savedAt > GMAIL_CACHE_TTL) { localStorage.removeItem(GMAIL_CACHE_KEY); return null; }
    return d.email;
  } catch { return null; }
}

interface TempTfMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
  bodyContentType: "html" | "text";
  hasAttachments: boolean;
}

function TempGmailTab() {
  const [email, setEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<TempTfMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(GMAIL_REFRESH_MS / 1000);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [gmailType, setGmailType] = useState<"dot" | "plus">("dot");
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [serviceDown, setServiceDown] = useState(false);
  const [usingCache, setUsingCache] = useState(false);
  const { toast } = useToast();
  const initialized = useRef(false);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const emailRef = useRef<string | null>(null);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const fetchMessages = useCallback(async (addr: string, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const r = await fetch("/api/temptf/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addr }),
        signal: AbortSignal.timeout(12000),
      });
      type TfMsg = { id: string; subject?: string; from?: string; date?: string; body?: string; bodyContentType?: "html" | "text"; attachments?: unknown[] };
      type TfResp = { data?: TfMsg[]; totalReceived?: number; error?: string };
      if (r.ok) {
        const d = await r.json() as TfResp;
        const incoming: TempTfMessage[] = (d.data ?? []).map(m => ({
          id: m.id, from: m.from ?? "", subject: m.subject ?? "",
          date: m.date ?? "", body: m.body ?? "",
          bodyContentType: m.bodyContentType ?? "text",
          hasAttachments: (m.attachments?.length ?? 0) > 0,
        }));
        setMessages((prev) => {
          const byId = new Map(prev.map((m) => [m.id, m]));
          incoming.forEach((m) => byId.set(m.id, m));
          return Array.from(byId.values()).sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        });
        setError(null);
      } else if (r.status === 429) {
        if (!silent) setError("Rate limited — please wait a moment.");
      } else if (r.status === 403) {
        if (!silent) setError("This address is not managed by the inbox service. Use 'New Address' to get a fresh one.");
      } else {
        const d = await r.json().catch(() => ({})) as TfResp;
        if (!silent) setError(d.error ?? "Inbox check failed. Please try again.");
      }
    } catch { if (!silent) setError("Network error. Please try again."); }
    finally { if (!silent) setLoadingMsgs(false); }
  }, []);

  const stopPolling = useCallback(() => {
    if (refreshTimer.current) { clearInterval(refreshTimer.current); refreshTimer.current = null; }
    if (countdownTimer.current) { clearInterval(countdownTimer.current); countdownTimer.current = null; }
  }, []);

  const startPolling = useCallback((addr: string) => {
    stopPolling();
    setCountdown(GMAIL_REFRESH_MS / 1000);
    refreshTimer.current = setInterval(() => {
      if (emailRef.current) fetchMessages(emailRef.current, true);
      setCountdown(GMAIL_REFRESH_MS / 1000);
    }, GMAIL_REFRESH_MS);
    countdownTimer.current = setInterval(() => {
      setCountdown((c) => (c <= 1 ? GMAIL_REFRESH_MS / 1000 : c - 1));
    }, 1000);
  }, [fetchMessages, stopPolling]);

  const generate = useCallback(async () => {
    stopPolling();
    setGenerating(true);
    setError(null);
    setServiceDown(false);
    setUsingCache(false);
    setEmail(null);
    setMessages([]);
    setSelectedId(null);
    setRetryAttempt(0);
    emailRef.current = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      setRetryAttempt(attempt);
      if (attempt > 0) await sleep(2000);
      try {
        const r = await fetch("/api/temptf/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: gmailType }),
          signal: AbortSignal.timeout(10000),
        });
        const d = await r.json() as { email?: string; error?: string };
        if (!r.ok || !d.email) {
          if (attempt < 2) continue;
          break;
        }
        saveCachedGmail(d.email);
        emailRef.current = d.email;
        setEmail(d.email);
        await fetchMessages(d.email);
        startPolling(d.email);
        setGenerating(false);
        return;
      } catch {
        if (attempt < 2) continue;
      }
    }
    // All retries failed — try cached session first
    const cached = loadCachedGmail();
    if (cached) {
      emailRef.current = cached;
      setEmail(cached);
      setUsingCache(true);
      setGenerating(false);
      return;
    }
    // No cached session — full service-down state
    setServiceDown(true);
    setGenerating(false);
  }, [fetchMessages, startPolling, stopPolling, gmailType]);

  const copyAddress = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: email });
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Solution 4: health check first — skip the 3×retry wait when service is clearly down
    fetch("/api/temptf/health", { signal: AbortSignal.timeout(5000) })
      .then(r => r.json())
      .then((d: { available?: boolean }) => {
        if (d.available === false) {
          const cached = loadCachedGmail();
          if (cached) {
            emailRef.current = cached;
            setEmail(cached);
            setUsingCache(true);
            setGenerating(false);
          } else {
            setServiceDown(true);
            setGenerating(false);
          }
        } else {
          const cached = loadCachedGmail();
          if (cached) {
            emailRef.current = cached;
            setEmail(cached);
            setGenerating(false);
            fetchMessages(cached).then(() => startPolling(cached));
          } else {
            generate();
          }
        }
      })
      .catch(() => {
        const cached = loadCachedGmail();
        if (cached) {
          emailRef.current = cached;
          setEmail(cached);
          setGenerating(false);
          fetchMessages(cached).then(() => startPolling(cached));
        } else {
          generate();
        }
      });
  }, [generate]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  return (
    <div className="space-y-4">
      {/* Address card */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="h-4 w-4 text-red-400" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Your temporary @gmail.com address</p>
            {generating ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {retryAttempt > 0
                  ? `Connecting to Gmail service… (attempt ${retryAttempt + 1}/3)`
                  : "Connecting to Gmail service…"}
              </div>
            ) : email ? (
              <p className="font-mono text-base font-semibold text-foreground break-all">{email}</p>
            ) : (
              <p className="text-sm text-muted-foreground/60">—</p>
            )}
          </div>
          {email && (
            <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />{countdown}s
              </div>
            </div>
          )}
        </div>

        {/* Type selector + action buttons */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
          <div className="flex rounded-lg border border-border/60 overflow-hidden text-xs">
            <button
              onClick={() => setGmailType("dot")}
              className={`px-3 py-1.5 font-medium transition-colors ${gmailType === "dot" ? "bg-red-500 text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
            >
              Dot trick
            </button>
            <button
              onClick={() => setGmailType("plus")}
              className={`px-3 py-1.5 font-medium transition-colors border-l border-border/60 ${gmailType === "plus" ? "bg-red-500 text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
            >
              Plus alias
            </button>
          </div>

          <Button onClick={copyAddress} disabled={!email} size="sm" className="text-xs gap-1.5 bg-red-500 hover:bg-red-400 text-white font-semibold">
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => email && fetchMessages(email)} disabled={loadingMsgs || !email} className="text-xs gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${loadingMsgs ? "animate-spin" : ""}`} />Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => generate()} disabled={generating} className="text-xs gap-1.5">
            <Shuffle className="h-3.5 w-3.5" />{generating ? "Generating…" : "New Address"}
          </Button>
        </div>
      </div>

      {/* Service-down UI (Solution 1 + 2) */}
      {serviceDown && !generating && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-red-300">Gmail service is temporarily unavailable</p>
              <p className="text-xs text-red-300/70">The inbox provider could not be reached after 3 attempts. Try again in a few minutes, or use Temp Email instead.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => generate()} disabled={generating}
              className="text-xs gap-1.5 bg-red-500 hover:bg-red-400 text-white font-semibold">
              <RefreshCw className="h-3.5 w-3.5" />Try Again
            </Button>
            <Button size="sm" variant="outline" asChild
              className="text-xs gap-1.5 border-red-500/40 text-red-300 hover:bg-red-500/10">
              <a href="/tools/temp-mail">Use Temp Email Instead →</a>
            </Button>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-300">
              <span className="font-semibold">Inbox temporarily unavailable</span> — use the <span className="font-semibold">Gmail Tricks</span> tab to generate a dot-trick address for your own Gmail, with no API needed.
            </p>
          </div>
        </div>
      )}

      {/* Cache session notice (Solution 3) */}
      {usingCache && !serviceDown && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300 flex-1">Showing your last session — inbox may not refresh. <span className="opacity-70">(Cached for 1 hour)</span></p>
          <Button size="sm" variant="outline" onClick={() => generate()} disabled={generating}
            className="text-xs gap-1.5 border-amber-500/40 text-amber-300 hover:bg-amber-500/10 shrink-0">
            <RefreshCw className={`h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} />Retry
          </Button>
        </div>
      )}

      {/* Error banner */}
      {error && !serviceDown && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-400 shrink-0" />
          <p className="text-sm text-orange-300 flex-1">{error}</p>
          <Button size="sm" variant="outline"
            onClick={() => email ? fetchMessages(email) : generate()}
            disabled={loadingMsgs || generating}
            className="text-xs gap-1.5 border-orange-500/40 text-orange-300 hover:bg-orange-500/10 shrink-0">
            <RefreshCw className={`h-3.5 w-3.5 ${loadingMsgs ? "animate-spin" : ""}`} />Retry
          </Button>
        </div>
      )}

      {/* Split inbox view */}
      {email && (
        <div className="grid md:grid-cols-5 gap-3 min-h-[340px]">
          {/* Message list */}
          <div className="md:col-span-2 rounded-xl border border-border/60 bg-card/30 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Inbox</span>
                {messages.filter(m => !readIds.has(m.id)).length > 0 && (
                  <span className="h-4 min-w-4 px-1.5 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                    {messages.filter(m => !readIds.has(m.id)).length} new
                  </span>
                )}
                {loadingMsgs && messages.length > 0 && (
                  <span className="text-[10px] text-muted-foreground/50">Checking…</span>
                )}
              </div>
              <button onClick={() => email && fetchMessages(email)} disabled={loadingMsgs}
                className="h-7 w-7 rounded-md border border-border/60 bg-muted/30 hover:bg-muted/60 flex items-center justify-center transition-colors disabled:opacity-50">
                <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${loadingMsgs ? "animate-spin" : ""}`} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingMsgs && messages.length === 0 && (
                <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Checking inbox…
                </div>
              )}
              {!loadingMsgs && messages.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center px-4">
                  <div className="h-12 w-12 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center">
                    <MailOpen className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60 font-medium">No messages yet</p>
                    <p className="text-xs text-muted-foreground/40 mt-0.5">Emails sent here appear instantly</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-muted/30 border border-border/40 rounded-full px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-[11px] text-muted-foreground/60">Auto-checking in <span className="text-red-400 font-semibold">{countdown}s</span></span>
                  </div>
                </div>
              )}
              {messages.map((msg) => {
                const sender = msg.from || "Unknown";
                const avatarChar = (sender.split("@")[0]?.[0] ?? "?").toUpperCase();
                const hue = sender.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
                const isUnread = !readIds.has(msg.id);
                return (
                  <button key={msg.id}
                    onClick={() => { setReadIds(prev => new Set([...prev, msg.id])); setSelectedId(selectedId === msg.id ? null : msg.id); }}
                    className={`w-full text-left px-3 py-2.5 transition-colors hover:bg-muted/30 border-b border-border/20 last:border-b-0 flex items-start gap-3 ${selectedId === msg.id ? "bg-muted/20" : ""}`}
                    style={{ borderLeft: `3px solid ${isUnread ? "rgb(248,113,113)" : "transparent"}` }}>
                    <div className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: `hsl(${hue},45%,18%)`, color: `hsl(${hue},65%,65%)`, border: `1.5px solid hsl(${hue},45%,28%)` }}>
                      {avatarChar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 justify-between">
                        <p className={`text-xs truncate ${isUnread ? "font-semibold text-foreground" : "text-foreground/60"}`}>{sender}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-red-400" />}
                          <span className="text-[10px] text-muted-foreground/40">{timeAgo(msg.date)}</span>
                        </div>
                      </div>
                      <p className={`text-sm truncate mt-0.5 ${isUnread ? "font-semibold text-foreground" : "text-foreground/60"}`}>
                        {msg.subject || "(No subject)"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message reader */}
          <div className="md:col-span-3 rounded-xl border border-border/60 bg-card/30 overflow-hidden flex flex-col">
            {selected ? (
              <>
                <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3 bg-muted/20">
                  <button onClick={() => setSelectedId(null)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm font-semibold truncate">{selected.subject || "(No subject)"}</p>
                    <p className="text-xs text-muted-foreground truncate">{selected.from}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4" style={{ maxHeight: "340px" }}>
                  {selected.body
                    ? <EmailMessageBody body={selected.body} isHtml={selected.bodyContentType === "html"} subject={selected.subject} />
                    : <p className="text-sm text-muted-foreground/60">(Empty message)</p>}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center px-6 gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground/60">Select a message to read it</p>
                {email && (
                  <div className="flex items-center gap-2 text-xs bg-red-400/10 border border-red-400/20 text-red-400 rounded-lg px-3 py-2">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    Auto-refreshing every {GMAIL_REFRESH_MS / 1000}s
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { icon: CheckCircle2, label: "No API key needed" },
          { icon: Mail,         label: "Real @gmail.com address" },
          { icon: Clock,        label: `Auto-refresh ${GMAIL_REFRESH_MS / 1000}s` },
          { icon: Zap,          label: "Full message body" },
        ].map(({ icon: Ic, label }) => (
          <div key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3 py-1">
            <Ic className="h-3 w-3 text-red-400" />{label}
          </div>
        ))}
      </div>

      {/* SEO content — What is a Temp Gmail Generator */}
      <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">What is a Temp Gmail Generator?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Temp Gmail Generator creates real @gmail.com email addresses that you can use for signups,
            verifications, and registrations without exposing your real Gmail. Unlike regular disposable email
            services, these addresses end in @gmail.com — making them accepted on sites that block throwaway
            email domains.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our free temporary Gmail generator uses Gmail's built-in dot trick feature. Gmail ignores dots in
            email addresses, so john.smith@gmail.com and johnsmith@gmail.com both deliver to the same inbox.
            This means you can generate unlimited unique Gmail variations that all forward to a real inbox.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Why Use a Temporary Gmail Address?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Works on sites that block disposable email domains",
              "Real @gmail.com address — accepted everywhere",
              "No need to create a new Google account",
              "Protect your real Gmail from spam",
              "Perfect for free trials, app signups, and testing",
              "Generate unlimited variations instantly",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">How Does the Gmail Dot Trick Work?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Gmail treats dots in email addresses as invisible. This means you@gmail.com, y.ou@gmail.com, and
            y.o.u@gmail.com all deliver to the same inbox. Our generator creates unique dot-trick variations
            of any Gmail address, giving you a fresh temporary address every time while still receiving emails
            in the original inbox.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Common Uses for Temp Gmail</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Sign up for free trials without spam",
              "Register on websites that require Gmail",
              "Test email flows in development",
              "Avoid promotional emails in your main inbox",
              "Get multiple accounts on Gmail-only platforms",
              "Bypass email verification on restricted sites",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Tab 3: Gmail Tricks (pure client-side) ─────────────────────────

function GmailTricksTab() {
  const [inputEmail, setInputEmail] = useState("");
  const [username, setUsername] = useState("");
  const [dotVariantsList, setDotVariantsList] = useState<string[]>([]);
  const [plusTagsList, setPlusTagsList] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const { toast } = useToast();

  const generate = () => {
    const raw = inputEmail.trim().toLowerCase();
    if (!raw) return;
    const user = raw.includes("@") ? raw.split("@")[0] : raw;
    const clean = user!.replace(/\./g, "");
    setUsername(clean);
    setDotVariantsList(dotVariants(clean));
    setPlusTagsList(PLUS_TAGS.map((tag) => `${clean}+${tag}@gmail.com`));
    setShowAll(false);
  };

  const copyOne = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr); setTimeout(() => setCopied(null), 1500);
    toast({ title: "Copied!", description: addr });
  };

  const displayedDots = showAll ? dotVariantsList : dotVariantsList.slice(0, 12);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold mb-1">Enter your Gmail address</h2>
          <p className="text-xs text-muted-foreground">We'll generate all the dot-trick variants and plus-tag aliases that all deliver to the same inbox — useful for tracking signups or bypassing duplicate checks.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted/30 border border-border/60 rounded-lg px-3 py-2.5">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              id="gmail-input"
              name="gmail-input"
              type="text"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="yourname@gmail.com"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <Button onClick={generate} disabled={!inputEmail.trim()} className="gap-1.5 shrink-0 text-xs">
            <Hash className="h-4 w-4" />Generate
          </Button>
        </div>
      </div>

      {username && (
        <>
          {/* Dot Trick */}
          <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Hash className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Dot Trick</h3>
                  <p className="text-[11px] text-muted-foreground">Gmail ignores dots — all {dotVariantsList.length} variants deliver to <span className="font-mono text-foreground/70">{username}@gmail.com</span></p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground bg-muted/60 border border-border/50 rounded-full px-2.5 py-0.5 font-semibold">{dotVariantsList.length} variants</span>
            </div>
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {displayedDots.map((addr) => (
                <button key={addr} onClick={() => copyOne(addr)} className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40 transition-all text-left">
                  <span className="font-mono text-xs text-foreground/80 truncate">{addr}</span>
                  <span className="shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors">
                    {copied === addr ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </span>
                </button>
              ))}
            </div>
            {dotVariantsList.length > 12 && (
              <div className="px-5 pb-4 text-center">
                <button onClick={() => setShowAll(!showAll)} className="text-xs text-primary/70 hover:text-primary underline underline-offset-2">
                  {showAll ? "Show less" : `Show all ${dotVariantsList.length} variants`}
                </button>
              </div>
            )}
          </div>

          {/* Plus Trick */}
          <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Plus className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Plus Trick</h3>
                  <p className="text-[11px] text-muted-foreground">Anything after + is ignored for delivery — all land in <span className="font-mono text-foreground/70">{username}@gmail.com</span></p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-muted/30 border border-border/60 rounded-lg px-3 py-2">
                  <span className="font-mono text-xs text-muted-foreground shrink-0">{username}+</span>
                  <input
                    id="plus-tag"
                    name="plus-tag"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value.replace(/[^a-z0-9._-]/gi, ""))}
                    placeholder="customtag"
                    className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/40 font-mono"
                  />
                  <span className="font-mono text-xs text-muted-foreground shrink-0">@gmail.com</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => customTag && copyOne(`${username}+${customTag.toLowerCase()}@gmail.com`)} disabled={!customTag} className="text-xs gap-1.5 border-border/60">
                  <Copy className="h-3.5 w-3.5" />Copy
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {plusTagsList.map((addr) => (
                  <button key={addr} onClick={() => copyOne(addr)} className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40 transition-all text-left">
                    <span className="font-mono text-xs text-foreground/80 truncate">{addr}</span>
                    <span className="shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors">
                      {copied === addr ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              How Gmail tricks work
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground/70 flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-blue-400" /> Dot Trick</p>
                <p>Gmail completely ignores periods in usernames. <span className="font-mono text-foreground/60">j.o.h.n@gmail.com</span> and <span className="font-mono text-foreground/60">john@gmail.com</span> are the same inbox.</p>
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground/70 flex items-center gap-1.5"><Plus className="h-3.5 w-3.5 text-purple-400" /> Plus Trick</p>
                <p>Anything after a <span className="font-mono text-foreground/60">+</span> is ignored for delivery. <span className="font-mono text-foreground/60">john+spam@gmail.com</span> still lands in John's inbox.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {!username && (
        <div className="rounded-xl border border-dashed border-border/50 bg-card/20 p-12 flex flex-col items-center justify-center text-center gap-3">
          <Hash className="h-8 w-8 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground/60 font-medium">Enter a Gmail address above to generate tricks</p>
          <p className="text-xs text-muted-foreground/40">Dot variants and plus tags will appear here</p>
        </div>
      )}

      {/* Internal link: Temp Gmail Generator */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Also try: Temp Gmail Generator</p>
          <p className="text-xs text-muted-foreground mt-0.5">Generate a ready-to-use @gmail.com address with live inbox — no real Gmail required.</p>
        </div>
        <Link href="/tools/temp-mail/tempgmail">
          <Button size="sm" variant="outline" className="shrink-0 gap-1.5 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
            <Mail className="h-3.5 w-3.5" /> Try it →
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Per-tab page config ─────────────────────────────────────────────

const TAB_CONFIG: Record<Tab, { seoTitle: string; seoDescription: string; icon: typeof Inbox; title: string; description: string }> = {
  disposable: {
    seoTitle: "Temp Email — Free Throwaway Email Address",
    seoDescription: "Generate a free disposable email address instantly. No signup required. Switch domains and create custom usernames.",
    icon: Inbox,
    title: "Temp Email",
    description: "Instant throwaway email address with domain switching and custom usernames — no signup required.",
  },
  tempgmail: {
    seoTitle: "Temp Gmail — Temporary Gmail Address Generator",
    seoDescription: "Generate a real temporary Gmail address. Receive emails without giving out your real Gmail.",
    icon: Mail,
    title: "Temp Gmail",
    description: "Generate a real temporary Gmail address and check its inbox — no signup needed.",
  },
  gmail: {
    seoTitle: "Gmail Tricks — Dot & Plus-Tag Address Generator",
    seoDescription: "Generate Gmail dot trick and plus-tag variants from your address. Use them to filter and track emails.",
    icon: Hash,
    title: "Gmail Tricks",
    description: "Generate unlimited Gmail dot-trick and plus-tag variants from your real address — all land in the same inbox.",
  },
};

// ── Extension promo banner ─────────────────────────────────────────

function ExtensionBanner() {
  return (
    <div className="rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
        <Download className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm mb-0.5">Want temp email right in your browser toolbar?</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The X Toolkit Chrome extension gives you instant inbox access, auto-detects OTP codes, and sends notifications when new mail arrives — without opening any website.
        </p>
      </div>
      <Link href="/chrome-extension">
        <Button size="sm" className="shrink-0 gap-1.5 whitespace-nowrap shadow-sm shadow-primary/20">
          <Download className="h-3.5 w-3.5" /> Get the Extension
        </Button>
      </Link>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export default function TempMail({ defaultTab = "disposable" }: { defaultTab?: Tab }) {
  useToolView("temp-mail");
  const cfg = TAB_CONFIG[defaultTab];

  return (
    <MiniToolLayout
      seoTitle={cfg.seoTitle}
      seoDescription={cfg.seoDescription}
      icon={cfg.icon}
      badge="Email Tool"
      title={cfg.title}
      description={cfg.description}
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="growth"
    >
      <div className="space-y-6">
        {defaultTab === "disposable" && (
          <>
            <UnifiedInboxSection />
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Need a @gmail.com address?</p>
                <p className="text-xs text-muted-foreground mt-0.5">Our Temp Gmail Generator creates real @gmail.com addresses accepted everywhere — including sites that block disposable emails.</p>
              </div>
              <Link href="/tools/temp-mail/tempgmail">
                <Button size="sm" variant="outline" className="shrink-0 gap-1.5 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Mail className="h-3.5 w-3.5" /> Try Temp Gmail →
                </Button>
              </Link>
            </div>
            <div className="space-y-6 pt-2">
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h2 className="text-base font-semibold">What is Temp Email?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Temp Email gives you an instant disposable email inbox with no account or signup required. Get a fresh throwaway email address in one click and start receiving emails immediately across 9 domains.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unlike your real email, temp email addresses are completely anonymous. Use them for website signups, free trials, app registrations, or any situation where you don't want to share your real inbox.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h2 className="text-base font-semibold">How is Temp Email Different from Temp Gmail?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Temp Email uses dedicated disposable email domains (guerrillamail.com, mail.gw, mail.tm etc.) that are completely separate from Gmail. These addresses are fully throwaway — no connection to your real identity.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Temp Gmail on the other hand generates real @gmail.com addresses using the dot trick, which work on sites that block disposable email domains but are linked to a real Gmail inbox.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h2 className="text-base font-semibold">When to Use Temp Email</h2>
                <ul className="space-y-1.5">
                  {[
                    "Signing up for websites you don't fully trust",
                    "Getting free trials without spam in your real inbox",
                    "Receiving one-time verification codes anonymously",
                    "Testing email flows as a developer",
                    "Avoiding marketing emails from online shopping",
                    "Any signup where you don't want to share your real email address",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h2 className="text-base font-semibold">Available Domains</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Choose from 9 domains across 3 providers: GuerrillaMail (guerrillamail.com, grr.la, sharklasers.com, spam4.me), Mail.tm (wshu.net), and Mail.gw (oakon.com and others). Each domain works the same way — pick whichever one works best for your signup.
                </p>
              </div>
            </div>
          </>
        )}
        {defaultTab === "tempgmail" && <TempGmailTab />}
        {defaultTab === "gmail" && (
          <>
            <GmailTricksTab />
            <div className="space-y-6 pt-2">
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h2 className="text-base font-semibold">What are Gmail Tricks?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Gmail has two built-in features that let you create unlimited email aliases from a single Gmail account: the dot trick and plus addressing. Our Gmail Tricks generator creates these variations instantly so you can use different addresses for different services while all emails land in your one Gmail inbox.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h2 className="text-base font-semibold">The Gmail Dot Trick Explained</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Gmail ignores dots (.) in email addresses. This means john.doe@gmail.com, johndoe@gmail.com, and j.o.h.n.d.o.e@gmail.com all deliver to the exact same inbox. You can use any dot variation as a unique address for signups — and easily filter emails by the alias you used.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h2 className="text-base font-semibold">The Gmail Plus Trick Explained</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Gmail also ignores anything after a plus (+) sign. So johndoe+amazon@gmail.com, johndoe+netflix@gmail.com, and johndoe+spam@gmail.com all go to johndoe@gmail.com. This is perfect for tracking which services are selling your email — if you get spam at yourname+company@gmail.com you know exactly who shared your data.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h2 className="text-base font-semibold">Gmail Tricks vs Temp Gmail vs Temp Email</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Gmail Tricks uses <strong>your own Gmail account</strong> — emails go to your real inbox. Temp Gmail generates a real @gmail.com address you can check without using your own account. Temp Email gives you a completely disposable inbox on a throwaway domain.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Use Gmail Tricks when you want to track and filter emails in your real inbox. Use Temp Gmail when you need a @gmail.com that isn't linked to you. Use Temp Email when you want complete anonymity.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h2 className="text-base font-semibold">When to Use Gmail Tricks</h2>
                <ul className="space-y-1.5">
                  {[
                    "Track which services share or sell your email",
                    "Organize incoming emails by service or project",
                    "Sign up for services while keeping your real email address private",
                    "Create unique addresses for each subscription to easily unsubscribe",
                    "Filter newsletters and promotional emails automatically",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
        <ExtensionBanner />
      </div>
    </MiniToolLayout>
  );
}
