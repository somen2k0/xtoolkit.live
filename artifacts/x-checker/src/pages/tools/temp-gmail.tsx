import { useState, useCallback, useRef, useEffect } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import {
  Mail, RefreshCw, Copy, Inbox, ArrowLeft,
  Clock, Loader2, MailOpen, AlertCircle, Shuffle,
  Plus, Hash, CheckCircle2, ExternalLink, ChevronDown,
  Zap, Settings2, Download,
} from "lucide-react";
import { Link } from "wouter";

// ── Types ──────────────────────────────────────────────────────────

interface GuerrillaMessage {
  mail_id: string; mail_from: string; mail_subject: string; mail_timestamp: string; mail_read: string; mail_exerpt?: string;
}

type Tab = "disposable" | "tempgmail" | "gmail";

type InboxProv = "guerrilla" | "onesecmail" | "freemail";

function pickRandomProvider(exclude?: Set<InboxProv>): InboxProv {
  const pool = (["guerrilla", "onesecmail", "freemail"] as InboxProv[]).filter(p => !exclude?.has(p));
  if (pool.length === 0) return "onesecmail";
  return pool[Math.floor(Math.random() * pool.length)];
}

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

function generateLocalLogin(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const len = 8 + Math.floor(Math.random() * 5);
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function generateNameLogin(): string {
  const first = GMAIL_FIRST[Math.floor(Math.random() * GMAIL_FIRST.length)]!;
  const last  = GMAIL_LAST[Math.floor(Math.random() * GMAIL_LAST.length)]!;
  const num   = Math.floor(Math.random() * 90) + 10;
  const roll  = Math.floor(Math.random() * 4);
  if (roll === 0) return `${first}.${last}`;
  if (roll === 1) return `${first}${last}`;
  if (roll === 2) return `${first}.${last}${num}`;
  return `${first}${last}${num}`;
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

interface GSession { sid: string; user: string; domain: string; email: string }
interface OSession { login: string; domain: string; email: string }
interface FSession { login: string; domain: string; email: string; token: string }
interface OMsg { id: number; from: string; subject: string; date: string }
interface OFullMsg extends OMsg { body?: string; htmlBody?: string; textBody?: string }
interface FMsg { id: string; from: string; subject: string; date: string }
interface FFullMsg extends FMsg { body?: string; htmlBody?: string; textBody?: string; isHtml?: boolean }
interface GFullMsg { id: string; from: string; subject: string; body: string; isHtml: boolean }

const REFRESH_MS = 15000;
const INBOX_STORAGE_KEY = "xt_inbox_session";

interface PersistedInbox {
  prov: InboxProv;
  email: string;
  user: string;
  domain: string;
  sid?: string;
  savedAt: number;
}

const SESSION_TTL = 3 * 60 * 60 * 1000;

function saveInboxSession(prov: InboxProv, session: GSession | OSession | FSession): void {
  try {
    const data: PersistedInbox = {
      prov,
      email: session.email,
      user: "user" in session ? session.user : session.login,
      domain: session.domain,
      sid: "sid" in session ? session.sid : "token" in session ? (session as FSession).token : undefined,
      savedAt: Date.now(),
    };
    localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function loadInboxSession(): PersistedInbox | null {
  try {
    const raw = localStorage.getItem(INBOX_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedInbox;
    if (Date.now() - data.savedAt > SESSION_TTL) {
      localStorage.removeItem(INBOX_STORAGE_KEY);
      return null;
    }
    return data;
  } catch { return null; }
}

function clearInboxSession(): void {
  try { localStorage.removeItem(INBOX_STORAGE_KEY); } catch {}
}

// ── Helpers ────────────────────────────────────────────────────────

function timeAgo(ts: string | number): string {
  const n = typeof ts === "number" ? ts * 1000 : new Date(ts).getTime();
  const diff = Date.now() - n;
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

// ── FAQ / related ──────────────────────────────────────────────────

const faqs = [
  { q: "What is a disposable email address?", a: "A disposable email is a temporary inbox you can use for sign-ups, trials, or any situation where you don't want to give out your real email. It receives real emails but can be discarded at any time." },
  { q: "How long does the inbox last?", a: "Inboxes are session-based. If you reload without saving the address, the inbox is lost. Your session is saved automatically in your browser so you can refresh the page and return to the same inbox." },
  { q: "What is the Gmail dot trick?", a: "Gmail ignores dots in usernames — john.doe@gmail.com and johndoe@gmail.com deliver to the same inbox. You can use any dot variant to register on sites that check for duplicate emails." },
  { q: "What is the Gmail plus trick?", a: "Adding +anything after your Gmail username still delivers to your main inbox. john+spam@gmail.com reaches John's inbox. Use it to create Gmail filters and track who shares your address with advertisers." },
  { q: "Is my data private?", a: "The disposable inbox is not linked to your identity. However, anyone who knows the address can access it. Don't use it for sensitive communications." },
];

const relatedTools = [
  { title: "Email Validator", href: "/tools/email-validator", description: "Validate email address syntax instantly." },
  { title: "Email Signature Generator", href: "/tools/email-signature-generator", description: "Build a professional email signature." },
  { title: "Email Character Counter", href: "/tools/email-character-counter", description: "Count subject and body characters." },
];

// ── Tab 1: Unified inbox ────────────────────────────────────────────

function UnifiedInboxSection() {
  const [gSession, setGSession] = useState<GSession | null>(null);
  const [oSession, setOSession] = useState<OSession | null>(null);
  const [fSession, setFSession] = useState<FSession | null>(null);
  const [activeProv, setActiveProv] = useState<InboxProv>("onesecmail");
  const [gMessages, setGMessages] = useState<GuerrillaMessage[]>([]);
  const [oMessages, setOMessages] = useState<OMsg[]>([]);
  const [fMessages, setFMessages] = useState<FMsg[]>([]);
  const [selectedG, setSelectedG] = useState<GFullMsg | null>(null);
  const [selectedO, setSelectedO] = useState<OFullMsg | null>(null);
  const [selectedF, setSelectedF] = useState<FFullMsg | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);
  const [copied, setCopied] = useState(false);
  const [showCustomUser, setShowCustomUser] = useState(false);
  const [customUser, setCustomUser] = useState("");
  const [showProviderDrop, setShowProviderDrop] = useState(false);
  const [switchingToProv, setSwitchingToProv] = useState<InboxProv | null>(null);
  const [providerHealth, setProviderHealth] = useState<Record<InboxProv, boolean | null>>({
    guerrilla: null, onesecmail: null, freemail: null,
  });
  const { toast } = useToast();
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialized = useRef(false);

  const gSessionRef = useRef<GSession | null>(null);
  const oSessionRef = useRef<OSession | null>(null);
  const fSessionRef = useRef<FSession | null>(null);
  const activeProvRef = useRef<InboxProv>("onesecmail");

  // ── fetch helpers ──────────────────────────────────────────────────

  const fetchGMsgs = useCallback(async (sid: string, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const r = await fetch(`/api/guerrilla/inbox?sid_token=${encodeURIComponent(sid)}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (r.ok) {
        const d = await r.json() as GuerrillaMessage[];
        if (Array.isArray(d)) {
          setGMessages(prev => {
            const map = new Map(prev.map(x => [x.mail_id, x]));
            d.forEach(x => map.set(x.mail_id, { ...map.get(x.mail_id), ...x }));
            return Array.from(map.values());
          });
        }
      }
    } catch {} finally { if (!silent) setLoadingMsgs(false); }
  }, []);

  const fetchOMsgs = useCallback(async (login: string, domain: string, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const r = await fetch(`/api/onesecmail/inbox?login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (r.ok) {
        const d = await r.json() as OMsg[];
        setOMessages(Array.isArray(d) ? d : []);
      }
    } catch {} finally { if (!silent) setLoadingMsgs(false); }
  }, []);

  const fetchFMsgs = useCallback(async (token: string, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const r = await fetch(`/api/freemail/inbox?token=${encodeURIComponent(token)}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (r.ok) {
        const d = await r.json() as FMsg[];
        setFMessages(Array.isArray(d) ? d : []);
      }
    } catch {} finally { if (!silent) setLoadingMsgs(false); }
  }, []);

  // ── polling ────────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    setCountdown(REFRESH_MS / 1000);
    refreshTimer.current = setInterval(() => {
      if (activeProvRef.current === "guerrilla" && gSessionRef.current)
        fetchGMsgs(gSessionRef.current.sid, true);
      else if (activeProvRef.current === "onesecmail" && oSessionRef.current)
        fetchOMsgs(oSessionRef.current.login, oSessionRef.current.domain, true);
      else if (activeProvRef.current === "freemail" && fSessionRef.current)
        fetchFMsgs(fSessionRef.current.token, true);
      setCountdown(REFRESH_MS / 1000);
    }, REFRESH_MS);
    countdownTimer.current = setInterval(() => setCountdown(c => c <= 1 ? REFRESH_MS / 1000 : c - 1), 1000);
  }, [fetchGMsgs, fetchOMsgs, fetchFMsgs]);

  // ── create inbox functions ─────────────────────────────────────────

  const createGInbox = useCallback(async (): Promise<GSession | null> => {
    try {
      const r = await fetch("/api/guerrilla/new", { signal: AbortSignal.timeout(12000) });
      if (!r.ok) return null;
      const d = await r.json() as { email?: string; sid_token?: string; user?: string; domain?: string };
      if (!d.email || !d.sid_token) return null;
      const gs: GSession = { sid: d.sid_token, user: d.user ?? d.email.split("@")[0] ?? "user", domain: d.domain ?? d.email.split("@")[1] ?? "guerrillamailblock.com", email: d.email };
      gSessionRef.current = gs; setGSession(gs); saveInboxSession("guerrilla", gs); return gs;
    } catch { return null; }
  }, []);

  const createOInbox = useCallback(async (login?: string): Promise<OSession | null> => {
    try {
      const url = login ? `/api/onesecmail/new?login=${encodeURIComponent(login)}` : "/api/onesecmail/new";
      const r = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!r.ok) return null;
      const d = await r.json() as { email?: string; login?: string; domain?: string };
      if (!d.email || !d.login || !d.domain) return null;
      const os: OSession = { login: d.login, domain: d.domain, email: d.email };
      oSessionRef.current = os; setOSession(os); saveInboxSession("onesecmail", os); return os;
    } catch { return null; }
  }, []);

  const createFInbox = useCallback(async (login?: string): Promise<FSession | null> => {
    try {
      const url = login ? `/api/freemail/new?login=${encodeURIComponent(login)}` : "/api/freemail/new";
      const r = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!r.ok) return null;
      const d = await r.json() as { email?: string; login?: string; domain?: string; token?: string };
      if (!d.email || !d.token) return null;
      const fs: FSession = { login: d.login ?? d.token, domain: d.domain ?? "maildrop.cc", email: d.email, token: d.token };
      fSessionRef.current = fs; setFSession(fs); saveInboxSession("freemail", fs); return fs;
    } catch { return null; }
  }, []);

  // ── provider-level creation ─────────────────────────────────────────
  const createOnProvider = useCallback(async (prov: InboxProv): Promise<boolean> => {
    if (prov === "guerrilla") {
      const gs = await createGInbox();
      if (!gs) return false;
      activeProvRef.current = "guerrilla"; setActiveProv("guerrilla");
      await fetchGMsgs(gs.sid);
    } else if (prov === "onesecmail") {
      const os = await createOInbox();
      if (!os) return false;
      activeProvRef.current = "onesecmail"; setActiveProv("onesecmail");
      await fetchOMsgs(os.login, os.domain);
    } else {
      const fs = await createFInbox();
      if (!fs) return false;
      activeProvRef.current = "freemail"; setActiveProv("freemail");
      await fetchFMsgs(fs.token);
    }
    return true;
  }, [createGInbox, createOInbox, createFInbox, fetchGMsgs, fetchOMsgs, fetchFMsgs]);

  const initInbox = useCallback(async () => {
    const saved = loadInboxSession();
    if (saved) {
      if (saved.prov === "guerrilla" && saved.sid) {
        const gs: GSession = { sid: saved.sid, user: saved.user, domain: saved.domain, email: saved.email };
        gSessionRef.current = gs; setGSession(gs);
        activeProvRef.current = "guerrilla"; setActiveProv("guerrilla");
        setCreating(false); await fetchGMsgs(saved.sid); startPolling(); return;
      } else if (saved.prov === "onesecmail") {
        const os: OSession = { login: saved.user, domain: saved.domain, email: saved.email };
        oSessionRef.current = os; setOSession(os);
        activeProvRef.current = "onesecmail"; setActiveProv("onesecmail");
        setCreating(false); await fetchOMsgs(saved.user, saved.domain); startPolling(); return;
      } else if (saved.prov === "freemail") {
        const fs: FSession = { login: saved.user, domain: saved.domain, email: saved.email, token: saved.sid ?? saved.user };
        fSessionRef.current = fs; setFSession(fs);
        activeProvRef.current = "freemail"; setActiveProv("freemail");
        setCreating(false); await fetchFMsgs(saved.sid ?? saved.user); startPolling(); return;
      }
    }
    setCreating(true); setError(null);
    const provOrder: InboxProv[] = ["onesecmail", "guerrilla", "freemail"];
    for (let i = 0; i < provOrder.length; i++) {
      if (i > 0) await sleep(800);
      const ok = await createOnProvider(provOrder[i]!);
      if (ok) { startPolling(); setCreating(false); return; }
    }
    setError("Could not create inbox. All providers are currently unavailable."); setCreating(false);
  }, [createOnProvider, startPolling, fetchGMsgs, fetchOMsgs, fetchFMsgs]);

  const newAddress = useCallback(async () => {
    clearInboxSession();
    setCreating(true); setError(null);
    setGMessages([]); setOMessages([]); setFMessages([]);
    setSelectedG(null); setSelectedO(null); setSelectedF(null); setSelectedId(null);
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    const provOrder: InboxProv[] = ["onesecmail", "guerrilla", "freemail"];
    for (let i = 0; i < provOrder.length; i++) {
      if (i > 0) await sleep(800);
      const ok = await createOnProvider(provOrder[i]!);
      if (ok) { startPolling(); setCreating(false); return; }
    }
    setError("Could not create new inbox."); setCreating(false);
  }, [createOnProvider, startPolling]);

  // ── provider switching ──────────────────────────────────────────────
  const switchProvider = useCallback(async (prov: InboxProv) => {
    setShowProviderDrop(false);
    if (prov === activeProv && !error) return;
    setSelectedG(null); setSelectedO(null); setSelectedF(null); setSelectedId(null);
    setSwitchingToProv(prov);
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    const ok = await createOnProvider(prov);
    if (ok) {
      startPolling();
      const label = prov === "guerrilla" ? "Guerrilla Mail" : prov === "freemail" ? "Maildrop" : "1secMail";
      toast({ title: "Provider switched!", description: `Now using ${label}` });
    } else {
      toast({ title: "Provider unavailable", description: "Could not connect. Try another provider.", variant: "destructive" });
    }
    setSwitchingToProv(null);
  }, [activeProv, error, createOnProvider, startPolling, toast]);

  // ── custom username ────────────────────────────────────────────────
  const applyCustomUser = useCallback(async () => {
    const u = customUser.trim();
    if (!u) return;
    setShowCustomUser(false); setCustomUser("");

    if (activeProv === "guerrilla") {
      toast({ title: "Not supported", description: "Guerrilla Mail generates addresses automatically — use 'New Address' instead." });
    } else if (activeProv === "freemail" && fSession) {
      const newFs: FSession = { login: u, domain: "maildrop.cc", email: `${u}@maildrop.cc`, token: u };
      fSessionRef.current = newFs; setFSession(newFs); setFMessages([]); setSelectedF(null);
      saveInboxSession("freemail", newFs);
      toast({ title: "Username set!", description: newFs.email });
    } else if (activeProv === "onesecmail" && oSession) {
      const newOs: OSession = { login: u, domain: oSession.domain, email: `${u}@${oSession.domain}` };
      oSessionRef.current = newOs; setOSession(newOs); setOMessages([]); setSelectedO(null);
      saveInboxSession("onesecmail", newOs);
      toast({ title: "Username set!", description: newOs.email });
    }
  }, [activeProv, fSession, oSession, customUser, toast]);

  // ── message opening ────────────────────────────────────────────────
  const openGMessage = async (msg: GuerrillaMessage) => {
    if (!gSession) return;
    setSelectedId(msg.mail_id); setLoadingMsg(true); setSelectedO(null); setSelectedF(null);
    try {
      const r = await fetch(`/api/guerrilla/message/${encodeURIComponent(msg.mail_id)}?sid_token=${encodeURIComponent(gSession.sid)}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (r.ok) {
        const d = await r.json() as GFullMsg;
        setSelectedG(d);
      } else {
        setSelectedG({ id: msg.mail_id, from: msg.mail_from, subject: msg.mail_subject, body: "", isHtml: false });
      }
    } catch {
      setSelectedG({ id: msg.mail_id, from: msg.mail_from, subject: msg.mail_subject, body: "", isHtml: false });
    }
    setGMessages(ms => ms.map(m => m.mail_id === msg.mail_id ? { ...m, mail_read: "1" } : m));
    setLoadingMsg(false);
  };

  const openOMessage = async (msg: OMsg) => {
    if (!oSession) return;
    setSelectedId(String(msg.id)); setLoadingMsg(true); setSelectedG(null); setSelectedO(null);
    try {
      const r = await fetch(`/api/onesecmail/message/${msg.id}?login=${encodeURIComponent(oSession.login)}&domain=${encodeURIComponent(oSession.domain)}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (r.ok) {
        const d = await r.json() as OFullMsg;
        setSelectedO(d);
      } else setSelectedO({ ...msg, body: "" });
    } catch { setSelectedO({ ...msg, body: "" }); }
    finally { setLoadingMsg(false); }
  };

  const openFMessage = async (msg: FMsg) => {
    if (!fSession) return;
    setSelectedId(msg.id); setLoadingMsg(true); setSelectedG(null); setSelectedO(null); setSelectedF(null);
    try {
      const r = await fetch(`/api/freemail/message/${encodeURIComponent(msg.id)}?token=${encodeURIComponent(fSession.token)}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (r.ok) {
        const d = await r.json() as FFullMsg;
        setSelectedF(d);
      } else setSelectedF({ ...msg, body: "" });
    } catch { setSelectedF({ ...msg, body: "" }); }
    finally { setLoadingMsg(false); }
  };

  const copyAddress = () => {
    const email = activeProv === "guerrilla" ? gSession?.email : activeProv === "onesecmail" ? oSession?.email : fSession?.email;
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: email });
  };

  const refresh = () => {
    if (activeProv === "guerrilla" && gSession) fetchGMsgs(gSession.sid);
    else if (activeProv === "onesecmail" && oSession) fetchOMsgs(oSession.login, oSession.domain);
    else if (activeProv === "freemail" && fSession) fetchFMsgs(fSession.token);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initInbox();
  }, [initInbox]);

  useEffect(() => () => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
  }, []);

  // ── health checks via backend ──────────────────────────────────────
  useEffect(() => {
    const checks: Array<[InboxProv, string]> = [
      ["onesecmail", "/api/onesecmail/health"],
      ["guerrilla",  "/api/guerrilla/health"],
      ["freemail",   "/api/freemail/health"],
    ];
    checks.forEach(([id, url]) => {
      fetch(url, { signal: AbortSignal.timeout(10000) })
        .then(r => r.json() as Promise<{ ok: boolean }>)
        .then(d => setProviderHealth(prev => ({ ...prev, [id]: d.ok === true })))
        .catch(() => {}); // leave as null (shows "…") on network error — don't mark Down
    });
  }, []);

  // ── derived display values ─────────────────────────────────────────
  const currentEmail  = activeProv === "guerrilla" ? gSession?.email  : activeProv === "onesecmail" ? oSession?.email  : fSession?.email;
  const currentUser   = activeProv === "guerrilla" ? gSession?.user   : activeProv === "onesecmail" ? oSession?.login  : fSession?.login;
  const currentDomain = activeProv === "guerrilla" ? gSession?.domain : activeProv === "onesecmail" ? oSession?.domain : fSession?.domain;
  const currentPill   = { label: "Temp Mail", color: "text-cyan-400", ring: "focus:ring-cyan-400/30", btn: "bg-cyan-500 hover:bg-cyan-400 text-black", dot: "bg-cyan-400" };

  const gUnread = gMessages.filter(m => m.mail_read === "0").length;
  const unread = activeProv === "guerrilla" ? gUnread : 0;

  const activeMessages  = activeProv === "guerrilla" ? gMessages : activeProv === "onesecmail" ? oMessages : fMessages;
  const selectedMsg     = activeProv === "guerrilla" ? selectedG : activeProv === "onesecmail" ? selectedO : selectedF;
  const selectedFrom    = activeProv === "guerrilla" ? selectedG?.from    : activeProv === "onesecmail" ? selectedO?.from    : selectedF?.from;
  const selectedSubject = activeProv === "guerrilla" ? selectedG?.subject : activeProv === "onesecmail" ? selectedO?.subject : selectedF?.subject;
  const selectedBody = activeProv === "guerrilla"
    ? (selectedG?.body ?? "")
    : activeProv === "onesecmail"
    ? (() => { const s = selectedO; return s?.htmlBody ?? s?.textBody ?? s?.body ?? ""; })()
    : (() => { const s = selectedF; return s?.body ?? ""; })();
  const selectedIsHtml = activeProv === "guerrilla"
    ? (selectedG?.isHtml ?? false)
    : !!(selectedO?.htmlBody) || !!(selectedF?.isHtml);

  const PROVIDERS: Array<{ id: InboxProv; label: string; badge: string }> = [
    { id: "onesecmail", label: "1secMail",      badge: "text-yellow-400" },
    { id: "guerrilla",  label: "Guerrilla Mail", badge: "text-cyan-400"   },
    { id: "freemail",   label: "Maildrop",       badge: "text-purple-400" },
  ];

  return (
    <div className="space-y-4">
      {/* Address card */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-cyan-400/10 border border-cyan-400/20">
            <Mail className={`h-4 w-4 ${currentPill.color}`} />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold flex items-center gap-1.5">
              Your temporary email
            </p>
            {currentEmail ? (
              <div className="flex flex-wrap items-center gap-0.5 font-mono text-base font-semibold">
                <span className="text-foreground">{currentUser}</span>
                <span className="text-muted-foreground">@</span>
                <span className={currentPill.color}>{currentDomain}</span>
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
          <Button onClick={copyAddress} disabled={!currentEmail} size="sm"
            className={`text-xs gap-1.5 font-semibold ${currentPill.btn}`}>
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Address"}
          </Button>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loadingMsgs || !currentEmail} className="text-xs gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${loadingMsgs ? "animate-spin" : ""}`} />Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={newAddress} disabled={creating} className="text-xs gap-1.5">
            <Shuffle className="h-3.5 w-3.5" />{creating ? "Creating…" : "New Address"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowCustomUser(v => !v)} disabled={!currentEmail} className="text-xs gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />Custom Username
          </Button>

          {/* Provider picker */}
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowProviderDrop(v => !v)} disabled={!currentEmail || !!switchingToProv} className="text-xs gap-1.5">
              <Zap className={`h-3.5 w-3.5 ${switchingToProv ? "text-amber-400" : currentPill.color}`} />
              {switchingToProv
                ? `Switching to ${switchingToProv === "guerrilla" ? "Guerrilla Mail" : switchingToProv === "freemail" ? "Maildrop" : "1secMail"}…`
                : activeProv === "guerrilla" ? "Guerrilla Mail" : activeProv === "freemail" ? "Maildrop" : "1secMail"}
              {switchingToProv ? <Loader2 className="h-3 w-3 animate-spin" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            {showProviderDrop && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden min-w-52">
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/30 border-b border-border/30">Switch provider</div>
                {PROVIDERS.map(({ id, label, badge }) => {
                  const health = providerHealth[id];
                  const isCurrent = id === activeProv;
                  return (
                    <button key={id} onClick={() => switchProvider(id)}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-muted/60 transition-colors border-b border-border/20 last:border-b-0 flex items-center justify-between gap-3
                        ${isCurrent ? "text-cyan-400 font-semibold bg-muted/20" : "text-foreground/80"}`}>
                      <span className={badge}>{label}</span>
                      <span className={`text-[10px] font-semibold shrink-0 px-1.5 py-0.5 rounded-full border
                        ${health === true  ? "text-green-400 border-green-400/30 bg-green-400/10" :
                          health === false ? "text-red-400 border-red-400/30 bg-red-400/10" :
                          "text-muted-foreground border-border/40 bg-muted/30"}`}>
                        {health === true ? "OK" : health === false ? "Down" : "…"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {showCustomUser && (
          <div className="flex gap-2 items-center pt-1 border-t border-border/40">
            <input
              value={customUser}
              onChange={e => setCustomUser(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applyCustomUser()}
              placeholder="Enter custom username…"
              className={`flex-1 min-w-0 rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 ${currentPill.ring}`}
            />
            <Button size="sm" onClick={applyCustomUser} disabled={!customUser.trim()} className={`text-xs font-semibold shrink-0 ${currentPill.btn}`}>Set</Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowCustomUser(false); setCustomUser(""); }} className="text-xs shrink-0">Cancel</Button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300 flex-1">{error}</p>
          <Button size="sm" variant="outline" onClick={initInbox} disabled={creating}
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
              {unread > 0 && <span className={`h-4 min-w-4 px-1 text-[10px] rounded-full flex items-center justify-center font-bold ${currentPill.btn}`}>{unread}</span>}
            </div>
            <button onClick={refresh} disabled={loadingMsgs}
              className="h-7 w-7 rounded-md border border-border/60 bg-muted/30 hover:bg-muted/60 flex items-center justify-center transition-colors disabled:opacity-50">
              <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${loadingMsgs ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingMsgs && activeMessages.length === 0 && (
              <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking inbox…
              </div>
            )}
            {!loadingMsgs && activeMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
                <MailOpen className="h-8 w-8 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground/60">No messages yet</p>
                <p className="text-xs text-muted-foreground/40">Send an email to this address</p>
              </div>
            )}
            {activeProv === "guerrilla" && gMessages.map(msg => (
              <button key={msg.mail_id} onClick={() => openGMessage(msg)}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted/30 border-b border-border/30 last:border-b-0 ${selectedId === msg.mail_id ? "bg-muted/20" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground/70 truncate">{msg.mail_from || "Unknown"}</p>
                    <p className={`text-sm truncate mt-0.5 ${msg.mail_read === "0" ? "font-semibold text-foreground" : "text-foreground/70"}`}>{msg.mail_subject || "(No subject)"}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 shrink-0 mt-0.5">{timeAgo(msg.mail_timestamp)}</span>
                </div>
              </button>
            ))}
            {activeProv === "onesecmail" && oMessages.map(msg => (
              <button key={msg.id} onClick={() => openOMessage(msg)}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted/30 border-b border-border/30 last:border-b-0 ${selectedId === String(msg.id) ? "bg-muted/20" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground/70 truncate">{msg.from || "Unknown"}</p>
                    <p className="text-sm truncate mt-0.5 font-semibold text-foreground">{msg.subject || "(No subject)"}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 shrink-0 mt-0.5">{timeAgo(msg.date)}</span>
                </div>
              </button>
            ))}
            {activeProv === "freemail" && fMessages.map(msg => (
              <button key={msg.id} onClick={() => openFMessage(msg)}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted/30 border-b border-border/30 last:border-b-0 ${selectedId === msg.id ? "bg-muted/20" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground/70 truncate">{msg.from || "Unknown"}</p>
                    <p className="text-sm truncate mt-0.5 font-semibold text-foreground">{msg.subject || "(No subject)"}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 shrink-0 mt-0.5">{timeAgo(msg.date)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 rounded-xl border border-border/60 bg-card/30 overflow-hidden flex flex-col">
          {selectedMsg ? (
            <>
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3 bg-muted/20">
                <button onClick={() => { setSelectedG(null); setSelectedO(null); setSelectedF(null); setSelectedId(null); }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm font-semibold truncate">{selectedSubject || "(No subject)"}</p>
                  <p className="text-xs text-muted-foreground truncate">{selectedFrom}</p>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4" style={{ maxHeight: "360px" }}>
                {selectedBody ? (
                  selectedIsHtml
                    ? <div className="prose prose-invert prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: selectedBody }} />
                    : <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">{selectedBody}</pre>
                ) : <p className="text-sm text-muted-foreground">(Empty message)</p>}
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
              {currentEmail && (
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
          { label: "3 providers — no AWS IPs" },
          { label: "Session-persistent inbox" },
          { label: "Health-checked on load" },
          { label: `Auto-refresh ${REFRESH_MS / 1000}s` },
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
  const [generating, setGenerating] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(GMAIL_REFRESH_MS / 1000);
  const [gmailType, setGmailType] = useState<"dot" | "plus">("dot");
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
    setEmail(null);
    setMessages([]);
    setSelectedId(null);
    emailRef.current = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await sleep(1800);
      try {
        const r = await fetch("/api/temptf/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: gmailType }),
          signal: AbortSignal.timeout(10000),
        });
        const d = await r.json() as { email?: string; error?: string };
        if (!r.ok || !d.email) {
          if (attempt === 2) {
            const addr = generateLocalGmailAddress(gmailType);
            emailRef.current = addr; setEmail(addr);
            setError("Inbox checking is temporarily unavailable. You can still use the address for sign-ups.");
            setGenerating(false); return;
          }
          continue;
        }
        emailRef.current = d.email;
        setEmail(d.email);
        await fetchMessages(d.email);
        startPolling(d.email);
        setGenerating(false);
        return;
      } catch {
        if (attempt === 2) {
          const addr = generateLocalGmailAddress(gmailType);
          emailRef.current = addr; setEmail(addr);
          setError("Inbox checking is temporarily unavailable. You can still use the address for sign-ups.");
          setGenerating(false); return;
        }
      }
    }
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
    generate();
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
                <Loader2 className="h-4 w-4 animate-spin" /> Generating address…
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

      {/* Error banner */}
      {error && (
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
                {messages.length > 0 && (
                  <span className="h-4 min-w-4 px-1 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center font-bold">{messages.length}</span>
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
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-center px-4">
                  <MailOpen className="h-7 w-7 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground/60">No messages yet</p>
                  <p className="text-xs text-muted-foreground/40">Send an email here — auto-checks every {GMAIL_REFRESH_MS / 1000}s</p>
                </div>
              )}
              {messages.map((msg) => (
                <button key={msg.id} onClick={() => setSelectedId(selectedId === msg.id ? null : msg.id)}
                  className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted/30 border-b border-border/30 last:border-b-0 ${selectedId === msg.id ? "bg-muted/20" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground/70 truncate">{msg.from || "Unknown"}</p>
                      <p className="text-sm truncate mt-0.5 font-semibold text-foreground">{msg.subject || "(No subject)"}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 shrink-0 mt-0.5">{timeAgo(msg.date)}</span>
                  </div>
                </button>
              ))}
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
                  {selected.body ? (
                    selected.bodyContentType === "html" ? (
                      <div className="prose prose-invert prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: selected.body }} />
                    ) : (
                      <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">{selected.body}</pre>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground/60">(Empty message)</p>
                  )}
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
        {defaultTab === "disposable" && <UnifiedInboxSection />}
        {defaultTab === "tempgmail" && <TempGmailTab />}
        {defaultTab === "gmail" && <GmailTricksTab />}
        <ExtensionBanner />
      </div>
    </MiniToolLayout>
  );
}
