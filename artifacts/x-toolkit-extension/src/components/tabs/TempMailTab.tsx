import { useState, useCallback } from "react";
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
  // Guerrilla domain
  const session = await guerrillaNew();
  let finalAcc = session;
  try {
    const name = randomName();
    const renamed = await guerrillaSetUser(name, domain, session.sid_token);
    // GuerrillaMail's API always returns email_addr with its default domain,
    // ignoring the domain parameter. Build the display email manually instead.
    const username = renamed.user || name;
    finalAcc = { ...renamed, email: `${username}@${domain}`, domain };
  } catch {
    // set-user failed — fall back to the session username with the selected domain
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
  } catch { /* fall through to next provider */ }

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

function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

interface DomainSelectorProps {
  currentDomain: string;
  switching: boolean;
  hasInbox: boolean;
  onSwitch: (domain: TempmailDomain) => void;
}

function DomainSelector({ currentDomain, switching, hasInbox, onSwitch }: DomainSelectorProps) {
  const isGuerrillaFamily = (GUERRILLA_DOMAINS as readonly string[]).includes(currentDomain);
  const displayDomain = currentDomain === "mail.gw" ? "mail.gw" : (isGuerrillaFamily ? currentDomain : "guerrillamail.com");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px 6px",
        background: "#070b12",
        borderBottom: "1px solid #1e2a3a",
      }}
    >
      <span style={{ color: "#71767b", display: "flex", alignItems: "center", gap: 4, fontSize: 11, flexShrink: 0 }}>
        {switching ? <SpinnerIcon /> : <GlobeIcon />}
        <span>Domain:</span>
      </span>
      <select
        value={displayDomain}
        disabled={switching}
        onChange={(e) => {
          if (!hasInbox && e.target.value !== currentDomain) {
            onSwitch(e.target.value as TempmailDomain);
            return;
          }
          onSwitch(e.target.value as TempmailDomain);
        }}
        style={{
          flex: 1,
          background: "#0f1623",
          border: "1px solid " + (switching ? "#6366f144" : "#1e2a3a"),
          borderRadius: 6,
          color: switching ? "#71767b" : "#e7e9ea",
          fontSize: 11,
          padding: "3px 6px",
          cursor: switching ? "not-allowed" : "pointer",
          outline: "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2371767b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 6px center",
          paddingRight: 22,
        }}
      >
        {ALL_TEMPMAIL_DOMAINS.map((d) => (
          <option key={d} value={d} style={{ background: "#0f1623", color: "#e7e9ea" }}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TempMailTab({ state, setState, patch: _patch, ready }: Props) {
  const [creating, setCreating] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not create inbox. Please try again.");
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
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : `Could not create inbox for ${domain}. Please try again.`);
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
        hasInbox={!!email}
        onSwitch={handleDomainSwitch}
      />

      {createError && (
        <div style={{ margin: "8px 12px 0", padding: "8px 10px", background: "#2a1515", border: "1px solid #f4212e44", borderRadius: 8, fontSize: 12, color: "#f4212e" }}>
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
        ) : (
          <InboxList
            messages={messages}
            loading={(loading && !creating && !switching) || switching}
            error={error}
            onSelect={setSelectedId}
            onRetry={refresh}
          />
        )}
      </div>
    </div>
  );
}
