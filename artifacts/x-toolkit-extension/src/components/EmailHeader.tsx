import { useState, useCallback, useRef, useEffect } from "react";

export interface FillEmail {
  label: string;
  address: string;
}

interface EmailHeaderProps {
  email: string;
  loading: boolean;
  refreshing: boolean;
  onNew: () => void;
  onRefresh: () => void;
  badge?: number;
  fillEmails?: FillEmail[];
  onFillPage?: (address: string) => Promise<void>;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ba7c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function RefreshIcon({ spin }: { spin: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: spin ? "spin 0.8s linear infinite" : "none" }}
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function FillIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function EmailHeader({ email, loading, refreshing, onNew, onRefresh, badge = 0, fillEmails = [], onFillPage }: EmailHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [fillState, setFillState] = useState<"idle" | "filled" | "none">("idle");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const copyEmail = useCallback(async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, [email]);

  const handleFill = useCallback(async (address: string) => {
    setDropdownOpen(false);
    if (!onFillPage) return;
    await onFillPage(address);
    setFillState("filled");
    setTimeout(() => setFillState("idle"), 2000);
  }, [onFillPage]);

  const handleFillClick = useCallback(() => {
    if (!onFillPage || fillEmails.length === 0) return;
    if (fillEmails.length === 1) {
      void handleFill(fillEmails[0]!.address);
    } else {
      setDropdownOpen((v) => !v);
    }
  }, [onFillPage, fillEmails, handleFill]);

  const hasFill = onFillPage && fillEmails.length > 0;

  const [local, domain] = email.split("@");

  return (
    <div
      style={{
        padding: "10px 12px 8px",
        borderBottom: "1px solid #1e2a3a",
        background: "#0a1020",
      }}
    >
      {/* Email address row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            flex: 1,
            background: "#0f1623",
            border: "1px solid #1e2a3a",
            borderRadius: 8,
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            minWidth: 0,
          }}
        >
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 140, height: 12, background: "#1e2a3a", borderRadius: 4, animation: "pulse 1.5s infinite" }} />
              <div style={{ width: 60, height: 12, background: "#1e2a3a", borderRadius: 4, animation: "pulse 1.5s infinite" }} />
            </div>
          ) : email ? (
            <span style={{ fontSize: 13, fontFamily: "monospace", color: "#e7e9ea", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <span style={{ color: "#1d9bf0", fontWeight: 600 }}>{local}</span>
              <span style={{ color: "#71767b" }}>@{domain}</span>
            </span>
          ) : (
            <span style={{ fontSize: 12, color: "#71767b" }}>No inbox yet — click New</span>
          )}
        </div>

        {/* Copy */}
        <button
          onClick={copyEmail}
          disabled={!email || loading}
          title="Copy email"
          style={{
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#0f1623", border: "1px solid #1e2a3a",
            borderRadius: 8, cursor: "pointer",
            color: copied ? "#00ba7c" : "#71767b",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>

        {/* Auto-fill */}
        {hasFill && (
          <div ref={dropdownRef} style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={handleFillClick}
              disabled={loading}
              title="Auto-fill email on this page"
              style={{
                width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: fillState === "filled" ? "#0a2a1a" : "#0f1623",
                border: `1px solid ${fillState === "filled" ? "#00ba7c" : "#1e2a3a"}`,
                borderRadius: 8, cursor: "pointer",
                color: fillState === "filled" ? "#00ba7c" : "#71767b",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              {fillState === "filled" ? <CheckIcon /> : <FillIcon />}
            </button>

            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "#0f1623",
                border: "1px solid #1e2a3a",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                zIndex: 200,
                minWidth: 200,
              }}>
                <div style={{ padding: "5px 10px 4px", fontSize: 9, color: "#3d4753", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #1e2a3a" }}>
                  Fill which email?
                </div>
                {fillEmails.map(({ label, address }) => (
                  <button
                    key={address}
                    onClick={() => void handleFill(address)}
                    style={{
                      width: "100%",
                      display: "flex", flexDirection: "column", alignItems: "flex-start",
                      padding: "8px 12px",
                      background: "none", border: "none",
                      cursor: "pointer",
                      borderBottom: "1px solid #0f1e2e",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#141e2e"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                  >
                    <span style={{ fontSize: 10, color: "#71767b", marginBottom: 2 }}>{label}</span>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#e7e9ea", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{address}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading || refreshing}
          title="Refresh inbox"
          style={{
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#0f1623", border: "1px solid #1e2a3a",
            borderRadius: 8, cursor: "pointer",
            color: "#71767b", flexShrink: 0,
            position: "relative",
          }}
        >
          <RefreshIcon spin={refreshing} />
          {badge > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4,
              background: "#1d9bf0", color: "#fff",
              borderRadius: 9999, fontSize: 9, fontWeight: 700,
              minWidth: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 3px",
            }}>
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </button>

        {/* New */}
        <button
          onClick={onNew}
          disabled={loading}
          title="Generate new inbox"
          style={{
            height: 32, padding: "0 10px",
            display: "flex", alignItems: "center", gap: 4,
            background: "#1d2e42", border: "1px solid #1d9bf0",
            borderRadius: 8, cursor: "pointer",
            color: "#1d9bf0", fontSize: 12, fontWeight: 600, flexShrink: 0,
          }}
        >
          <PlusIcon /> New
        </button>
      </div>
    </div>
  );
}
