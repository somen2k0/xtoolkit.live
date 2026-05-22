import { useState, useCallback } from "react";
import { StoredState, HistoryEntry } from "../../types";
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

async function createInbox(setState: (s: Partial<StoredState>) => void, history: StoredState["history"]) {
  try {
    // Step 1: always get a session first (reliable)
    const session = await guerrillaNew();
    // Step 2: try to rename to a USA-style name — fall back to original if it fails
    let finalAcc = session;
    try {
      const name = randomName();
      const renamed = await guerrillaSetUser(name, "", session.sid_token);
      if (renamed.email) finalAcc = renamed;
    } catch { /* keep original session email */ }
    const entry: HistoryEntry = { address: finalAcc.email, provider: "guerrilla", createdAt: Date.now() };
    setState({ guerrilla: finalAcc, tempMailProvider: "guerrilla", history: [entry, ...history.slice(0, 19)] });
    return;
  } catch { /* fall through to next provider */ }

  try {
    const acc = await mailgwNew();
    const entry: HistoryEntry = { address: acc.email, provider: "mailgw", createdAt: Date.now() };
    setState({ mailgw: acc, tempMailProvider: "mailgw", history: [entry, ...history.slice(0, 19)] });
    return;
  } catch { /* fall through */ }

  const acc = await maildropNew();
  const entry: HistoryEntry = { address: acc.email, provider: "maildrop", createdAt: Date.now() };
  setState({ maildrop: acc, tempMailProvider: "maildrop", history: [entry, ...history.slice(0, 19)] });
}

export function TempMailTab({ state, setState, patch: _patch, ready }: Props) {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { messages, loading, refreshing, error, refresh } = useTempMailInbox(state, ready);
  const email = getActiveEmail(state);
  const selectedMsg = messages.find((m) => m.id === selectedId) ?? null;

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
