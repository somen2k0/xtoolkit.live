import { useState, useCallback, useEffect, useRef } from "react";
import { StoredState, HistoryEntry, GUERRILLA_DOMAINS, ALL_TEMPMAIL_DOMAINS, TempmailDomain } from "../../types";
import { useTempMailInbox, fetchFullMessage } from "../../hooks/useInbox";
import { EmailHeader } from "../EmailHeader";
import { InboxList } from "../InboxList";
import { OTPCard } from "../OTPCard";
import { MessageView } from "../MessageView";
import { guerrillaNew, guerrillaSetUser, mailgwNew, maildropNew } from "../../lib/api";

const FIRST_NAMES = ["james","john","robert","michael","william","david","richard","joseph","thomas","charles","mary","patricia","jennifer","linda","barbara","elizabeth","susan","jessica","sarah","karen","emma","oliver","noah","liam","sophia","lucas","mason","ethan","isabella"];
const LAST_NAMES  = ["smith","johnson","williams","brown","jones","garcia","miller","davis","wilson","taylor","anderson","thomas","jackson","white","harris","martin","thompson","clark"];

function randomName(): string {
  const f = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]!;
  const l = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]!;
  const n = Math.floor(Math.random() * 99);
  return `${f}.${l}${n > 0 ? n : ""}`;
}

interface Props {
  state: StoredState;
  setState: (s: Partial<StoredState>) => void;
  patch: <K extends keyof StoredState>(key: K, val: StoredState[K]) => void;
  ready: boolean;
  onSwitchToGmail?: () => void;
}

function getActiveEmail(state: StoredState): string {
  const { tempMailProvider, guerrilla, mailgw, maildrop } = state;
  if (tempMailProvider === "guerrilla") return guerrilla?.email ?? "";
  if (tempMailProvider === "mailgw") return mailgw?.email ?? "";
  if (tempMailProvider === "maildrop") return maildrop?.email ?? "";
  return "";
}

async function createInboxForDomain(
  domain: TempmailDomain,
  setState: (s: Partial<StoredState>) => void,
  history: StoredState["history"],
) {
  if (domain === "mail.gw") {
    const acc = await mailgwNew();
    const entry: HistoryEntry = { address: acc.email, provider: "mailgw", createdAt: Date.now() };
    setState({ mailgw: acc, tempMailProvider: "mailgw", guerrillaDomain: domain, history: [entry, ...history.slice(0, 19)] });
    return;
  }
  const session = await guerrillaNew();
  let finalAcc = session;
  try {
    const name = randomName();
    const renamed = await guerrillaSetUser(name, domain, session.sid_token);
    const username = renamed.user || name;
    finalAcc = { ...renamed, email: `${username}@${domain}`, domain };
  } catch {
    const username = session.user || session.email.split("@")[0];
    finalAcc = { ...session, email: `${username}@${domain}`, domain };
  }
  const entry: HistoryEntry = { address: finalAcc.email, provider: "guerrilla", createdAt: Date.now() };
  setState({ guerrilla: finalAcc, tempMailProvider: "guerrilla", guerrillaDomain: domain, history: [entry, ...history.slice(0, 19)] });
}

async function createInbox(setState: (s: Partial<StoredState>) => void, history: StoredState["history"]) {
  try {
    const session = await guerrillaNew();
    let finalAcc = session;
    try {
      const name = randomName();
      const renamed = await guerrillaSetUser(name, "", session.sid_token);
      if (renamed.email) finalAcc = renamed;
    } catch { /* keep original session email */ }
    const entry: HistoryEntry = { address: finalAcc.email, provider: "guerrilla", createdAt: Date.now() };
    setState({ guerrilla: finalAcc, tempMailProvider: "guerrilla", guerrillaDomain: "guerrillamail.com", history: [entry, ...history.slice(0, 19)] });
    return;
  } catch { /* fall through */ }

  try {
    const acc = await mailgwNew();
    const entry: HistoryEntry = { address: acc.email, provider: "mailgw", createdAt: Date.now() };
    setState({ mailgw: acc, tempMailProvider: "mailgw", guerrillaDomain: "mail.gw", history: [entry, ...history.slice(0, 19)] });
    return;
  } catch { /* fall through */ }

  const acc = await maildropNew();
  const entry: HistoryEntry = { address: acc.email, provider: "maildrop", createdAt: Date.now() };
  setState({ maildrop: acc, tempMailProvider: "maildrop", history: [entry, ...history.slice(0, 19)] });
}

type DomainStatus = "untried" | "ok" | "fail";

const DOMAIN_GROUPS = [
  {
    label: "Disposable Domains",
    domains: [
      { value: "guerrillamail.com" as TempmailDomain, badge: "Recommended", tooltip: "Most reliable" },
      { value: "grr.la" as TempmailDomain, tooltip: "Short & memorable" },
      { value: "sharklasers.com" as TempmailDomain, tooltip: "Fun alternative" },
      { value: "spam4.me" as TempmailDomain, tooltip: "Anti-spam focused" },
    ],
  },
  {
    label: "Privacy Domains",
    domains: [
      { value: "mail.gw" as TempmailDomain, tooltip: "Privacy focused" },
    ],
  },
];

function StatusDot({ status }: { status: DomainStatus }) {
  const color = status === "ok" ? "#10b981" : status === "fail" ? "#ef4444" : "#3d4753";
  return (
    <span style={{
      width: 6, height: 6, borderRadius: "50%",
      background: color, display: "inline-block", flexShrink: 0,
    }} />
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

interface DomainSelectorProps {
  currentDomain: string;
  switching: boolean;
  onSwitch: (domain: TempmailDomain) => void;
  domainStatus: Record<string, DomainStatus>;
}

function DomainSelector({ currentDomain, switching, onSwitch, domainStatus }: DomainSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        padding: "5px 12px 6px",
        background: "#070b12",
        borderBottom: open ? "none" : "1px solid #1e2a3a",
        zIndex: open ? 50 : "auto",
      }}
    >
      {/* Trigger */}
      <button
        onClick={() => !switching && setOpen(!open)}
        disabled={switching}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", gap: 6,
          background: "#0f1623",
          border: `1px solid ${open ? "#1d9bf044" : "#1e2a3a"}`,
          borderRadius: 6, padding: "4px 8px",
          color: switching ? "#71767b" : "#e7e9ea",
          fontSize: 11, cursor: switching ? "not-allowed" : "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ color: "#71767b", display: "flex", alignItems: "center" }}>
          {switching ? <SpinnerIcon /> : <GlobeIcon />}
        </span>
        <span style={{ color: "#71767b", fontSize: 10, flexShrink: 0 }}>Domain:</span>
        <StatusDot status={domainStatus[currentDomain] ?? "untried"} />
        <span style={{ flex: 1, fontFamily: "monospace", fontSize: 11 }}>{currentDomain}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#71767b" strokeWidth="2.5" strokeLinecap="round">
          <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "100%", left: 12, right: 12,
          background: "#0f1623",
          border: "1px solid #1e2a3a",
          borderRadius: "0 0 8px 8px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          zIndex: 100,
        }}>
          {DOMAIN_GROUPS.map((group) => (
            <div key={group.label}>
              <div style={{
                padding: "5px 10px 3px",
                fontSize: 9, color: "#3d4753",
                fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px",
                borderTop: "1px solid #1e2a3a",
              }}>
                {group.label}
              </div>
              {group.domains.map(({ value, badge, tooltip }) => (
                <button
                  key={value}
                  title={tooltip}
                  onClick={() => {
                    setOpen(false);
                    if (value !== currentDomain) onSwitch(value);
                  }}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "6px 10px",
                    background: value === currentDomain ? "#1e2a3a" : "none",
                    border: "none",
                    cursor: "pointer",
                    color: value === currentDomain ? "#e7e9ea" : "#b0b8c1",
                    fontSize: 11, textAlign: "left",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => { if (value !== currentDomain) e.currentTarget.style.background = "#141e2e"; }}
                  onMouseLeave={(e) => { if (value !== currentDomain) e.currentTarget.style.background = "none"; }}
                >
                  <StatusDot status={domainStatus[value] ?? "untried"} />
                  <span style={{ flex: 1, fontFamily: "monospace" }}>{value}</span>
                  {badge && (
                    <span style={{
                      fontSize: 8, background: "#7c3aed22", color: "#a78bfa",
                      border: "1px solid #7c3aed44", borderRadius: 3,
                      padding: "1px 4px", flexShrink: 0,
                    }}>
                      {badge}
                    </span>
                  )}
                  {value === currentDomain && (
                    <span style={{ fontSize: 10, color: "#1d9bf0", flexShrink: 0 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TempMailTab({ state, setState, patch: _patch, ready, onSwitchToGmail }: Props) {
  const [creating, setCreating] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [domainStatus, setDomainStatus] = useState<Record<string, DomainStatus>>({});

  const { messages, loading, refreshing, error, refresh } = useTempMailInbox(state, ready);
  const email = getActiveEmail(state);
  const selectedMsg = messages.find((m) => m.id === selectedId) ?? null;

  const currentDomain: string = state.guerrillaDomain ?? "guerrillamail.com";

  const handleNew = useCallback(async () => {
    setCreating(true);
    setCreateError(null);
    setSelectedId(null);
    try {
      await createInbox(setState, state.history);
    } catch {
      setCreateError("Service temporarily unavailable. Please try again in a moment.");
    } finally {
      setCreating(false);
    }
  }, [state.history, setState]);

  const handleDomainSwitch = useCallback(async (domain: TempmailDomain) => {
    if (domain === currentDomain) return;
    setSwitching(true);
    setCreateError(null);
    setSelectedId(null);
    try {
      await createInboxForDomain(domain, setState, state.history);
      setDomainStatus((prev) => ({ ...prev, [domain]: "ok" }));
    } catch {
      setDomainStatus((prev) => ({ ...prev, [domain]: "fail" }));
      setCreateError(`Could not create inbox for ${domain}. Please try another domain.`);
    } finally {
      setSwitching(false);
    }
  }, [currentDomain, setState, state.history]);

  if (selectedMsg) {
    return (
      <MessageView
        message={selectedMsg}
        onBack={() => setSelectedId(null)}
        fetchBody={
          selectedMsg.body
            ? undefined
            : () => fetchFullMessage(selectedMsg.id, state)
        }
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <EmailHeader
        email={email}
        loading={creating || switching}
        refreshing={refreshing}
        onNew={handleNew}
        onRefresh={refresh}
        badge={email ? messages.length : 0}
      />

      <DomainSelector
        currentDomain={currentDomain}
        switching={switching}
        onSwitch={handleDomainSwitch}
        domainStatus={domainStatus}
      />

      {createError && (
        <div style={{ margin: "8px 12px 0", padding: "8px 10px", background: "#2a1515", border: "1px solid #f4212e44", borderRadius: 8, fontSize: 12, color: "#f4212e", flexShrink: 0 }}>
          {createError}
        </div>
      )}

      {!creating && !switching && email && messages.length > 0 && (
        <OTPCard messages={messages} onViewMessage={setSelectedId} />
      )}

      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", marginTop: 8 }}>
        {!email && !creating && !switching ? (
          <div style={{ padding: "32px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📬</div>
            <div style={{ color: "#71767b", fontSize: 13, marginBottom: 12 }}>No inbox yet</div>
            <button
              onClick={() => void handleNew()}
              style={{
                padding: "8px 20px", background: "#7c3aed",
                border: "none", borderRadius: 20,
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              Generate Inbox
            </button>
          </div>
        ) : creating || switching ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>⏳</div>
            <div style={{ color: "#71767b", fontSize: 13, animation: "pulse 1.5s infinite" }}>
              {switching ? `Switching to ${currentDomain}…` : "Getting your inbox ready…"}
            </div>
          </div>
        ) : (
          <InboxList
            messages={messages}
            loading={loading && !creating && !switching}
            error={error}
            onSelect={setSelectedId}
            onRetry={refresh}
            onSwitchToGmail={onSwitchToGmail}
            accentColor="#7c3aed"
            refreshing={refreshing}
          />
        )}
      </div>
    </div>
  );
}
