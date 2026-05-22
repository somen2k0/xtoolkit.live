import { useState, useCallback, useRef } from "react";
import { StoredState, HistoryEntry } from "../../types";
import { useTempMailInbox, fetchFullMessage } from "../../hooks/useInbox";
import { EmailHeader } from "../EmailHeader";
import { InboxList } from "../InboxList";
import { OTPCard } from "../OTPCard";
import { MessageView } from "../MessageView";
import { guerrillaNew, guerrillaSetUser, mailgwNew, maildropNew } from "../../lib/api";

const GUERRILLA_DOMAINS = [
  "guerrillamail.com",
  "grr.la",
  "sharklasers.com",
  "spam4.me",
];

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

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

export function TempMailTab({ state, setState, patch: _patch, ready }: Props) {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [domain, setDomain] = useState(GUERRILLA_DOMAINS[0]!);
  const [showDomainDrop, setShowDomainDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const { messages, loading, refreshing, error, refresh } = useTempMailInbox(state, ready);
  const email = getActiveEmail(state);
  const selectedMsg = messages.find((m) => m.id === selectedId) ?? null;

  const createInbox = useCallback(async (targetDomain: string) => {
    setCreating(true);
    setCreateError(null);
    setSelectedId(null);
    try {
      // Try GuerrillaMail with a USA full name + selected domain
      const session = await guerrillaNew();
      const name = randomName();
      const acc = await guerrillaSetUser(name, targetDomain, session.sid_token);
      // Prefer the API's returned email, fall back to constructed one
      const finalEmail = acc.email || `${name}@${targetDomain}`;
      const finalAcc = { ...acc, email: finalEmail, user: name, domain: targetDomain };
      const entry: HistoryEntry = { address: finalEmail, provider: "guerrilla", createdAt: Date.now() };
      setState({ guerrilla: finalAcc, tempMailProvider: "guerrilla", history: [entry, ...state.history.slice(0, 19)] });
      return;
    } catch { /* fall through */ }

    try {
      const acc = await mailgwNew();
      const entry: HistoryEntry = { address: acc.email, provider: "mailgw", createdAt: Date.now() };
      setState({ mailgw: acc, tempMailProvider: "mailgw", history: [entry, ...state.history.slice(0, 19)] });
      return;
    } catch { /* fall through */ }

    try {
      const acc = await maildropNew();
      const entry: HistoryEntry = { address: acc.email, provider: "maildrop", createdAt: Date.now() };
      setState({ maildrop: acc, tempMailProvider: "maildrop", history: [entry, ...state.history.slice(0, 19)] });
    } catch (err) {
      throw err;
    }
  }, [state.history, setState]);

  const handleNew = useCallback(async () => {
    setCreating(true);
    setCreateError(null);
    setSelectedId(null);
    try {
      await createInbox(domain);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not create inbox. Please try again.");
    } finally {
      setCreating(false);
    }
  }, [createInbox, domain]);

  const handleDomainSelect = useCallback(async (d: string) => {
    setDomain(d);
    setShowDomainDrop(false);
    setCreating(true);
    setCreateError(null);
    setSelectedId(null);
    try {
      await createInbox(d);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not create inbox. Please try again.");
    } finally {
      setCreating(false);
    }
  }, [createInbox]);

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
        loading={creating}
        refreshing={refreshing}
        onNew={handleNew}
        onRefresh={refresh}
        badge={email ? messages.length : 0}
      />

      {/* Domain switcher */}
      {(email || creating) && (
        <div style={{ padding: "6px 12px 2px", position: "relative" }} ref={dropRef}>
          <button
            onClick={() => setShowDomainDrop((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#0f1623", border: "1px solid #1e2a3a",
              borderRadius: 6, padding: "4px 8px",
              color: "#71767b", fontSize: 11, cursor: "pointer",
            }}
          >
            <span style={{ color: "#7c3aed", fontWeight: 600 }}>@{domain}</span>
            <ChevronIcon />
          </button>

          {showDomainDrop && (
            <div style={{
              position: "absolute", top: "100%", left: 12, zIndex: 50,
              background: "#0a1020", border: "1px solid #1e2a3a",
              borderRadius: 8, overflow: "hidden", minWidth: 180,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}>
              <div style={{ padding: "4px 10px 3px", fontSize: 9, fontWeight: 700, color: "#71767b", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #1e2a3a" }}>
                GuerrillaMail
              </div>
              {GUERRILLA_DOMAINS.map((d) => (
                <button
                  key={d}
                  onClick={() => void handleDomainSelect(d)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    width: "100%", textAlign: "left",
                    padding: "7px 10px", background: "none",
                    border: "none", borderBottom: "1px solid #1e2a3a",
                    color: d === domain ? "#7c3aed" : "#e7e9ea",
                    fontSize: 12, cursor: "pointer", fontFamily: "monospace",
                    fontWeight: d === domain ? 700 : 400,
                  }}
                >
                  {d === domain && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {createError && (
        <div style={{ margin: "8px 12px 0", padding: "8px 10px", background: "#2a1515", border: "1px solid #f4212e44", borderRadius: 8, fontSize: 12, color: "#f4212e" }}>
          {createError}
        </div>
      )}

      {!creating && email && messages.length > 0 && (
        <OTPCard messages={messages} onViewMessage={setSelectedId} />
      )}

      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", marginTop: 8 }}>
        {!email && !creating ? (
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
            loading={loading && !creating}
            error={error}
            onSelect={setSelectedId}
            onRetry={refresh}
          />
        )}
      </div>
    </div>
  );
}
