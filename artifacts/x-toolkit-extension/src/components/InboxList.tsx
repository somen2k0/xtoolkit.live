import { useState, useEffect } from "react";
import { Message } from "../types";
import { formatDate, isVerificationEmail } from "../lib/otp";

interface InboxListProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
  onRetry: () => void;
  emptyText?: string;
  onSwitchToGmail?: () => void;
  accentColor?: string;
  refreshing?: boolean;
}

const REFRESH_INTERVAL = 15;

function Avatar({ from, size = 34 }: { from: string; size?: number }) {
  const name = from.split("@")[0] ?? "?";
  const char = name[0]?.toUpperCase() ?? "?";
  const hue = from.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `hsl(${hue},48%,18%)`,
      border: `1.5px solid hsl(${hue},48%,28%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700,
      color: `hsl(${hue},70%,72%)`,
      letterSpacing: "-0.5px",
    }}>
      {char}
    </div>
  );
}

function UnreadDot({ color }: { color: string }) {
  return (
    <div style={{
      width: 7, height: 7, borderRadius: "50%",
      background: color, flexShrink: 0,
      boxShadow: `0 0 5px ${color}88`,
    }} />
  );
}

function VerifyBadge() {
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, padding: "1px 5px",
      background: "#1a2e4a", color: "#1d9bf0",
      borderRadius: 9999, border: "1px solid #1d9bf033",
      textTransform: "uppercase", letterSpacing: "0.4px", flexShrink: 0,
    }}>
      Verify
    </span>
  );
}

function Skeleton({ accentColor }: { accentColor: string }) {
  return (
    <div>
      {[1, 0.75, 0.9].map((_, i) => (
        <div key={i} style={{
          display: "flex", gap: 10, padding: "11px 12px",
          borderBottom: "1px solid #111d2e",
          animation: "pulse 1.5s infinite",
          animationDelay: `${i * 0.2}s`,
        }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#141e30", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ height: 10, background: "#141e30", borderRadius: 4, width: "50%" }} />
              <div style={{ height: 8, background: "#0f1825", borderRadius: 4, width: 28, marginLeft: "auto" }} />
            </div>
            <div style={{ height: 11, background: "#141e30", borderRadius: 4, width: "80%" }} />
            <div style={{ height: 9, background: "#0f1825", borderRadius: 4, width: "65%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ text, onSwitchToGmail, accentColor }: { text: string; onSwitchToGmail?: () => void; accentColor: string }) {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  useEffect(() => {
    const id = setInterval(() => setCountdown(c => c <= 1 ? REFRESH_INTERVAL : c - 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: "28px 16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: "#0a1020", border: "1px solid #1e2a3a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22,
      }}>
        📭
      </div>
      <div>
        <div style={{ color: "#b0b8c1", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{text}</div>
        <div style={{ color: "#3d4753", fontSize: 11 }}>Emails sent here will appear instantly</div>
      </div>

      {/* Refresh countdown pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "#0a1020", border: "1px solid #1e2a3a",
        borderRadius: 20, padding: "4px 10px",
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: "50%", background: accentColor,
          animation: "pulse 1.5s infinite",
        }} />
        <span style={{ fontSize: 10, color: "#71767b" }}>
          Auto-checking in <span style={{ color: accentColor, fontWeight: 600 }}>{countdown}s</span>
        </span>
      </div>

      {onSwitchToGmail && (
        <button
          onClick={onSwitchToGmail}
          style={{
            background: "none", border: "1px solid #1e2a3a",
            borderRadius: 8, cursor: "pointer",
            color: "#71767b", fontSize: 11,
            padding: "6px 10px",
            lineHeight: 1.4,
          }}
        >
          Sites blocking this? Try <span style={{ color: "#1d9bf0", fontWeight: 600 }}>Temp Gmail</span> instead →
        </button>
      )}
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div style={{ padding: "28px 16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: "#2a1515", border: "1px solid #f4212e33",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
      }}>
        ⚠️
      </div>
      <div style={{ color: "#f4212e", fontSize: 12, maxWidth: 220, lineHeight: 1.5 }}>{error}</div>
      <button
        onClick={onRetry}
        style={{
          padding: "7px 18px", background: "#1e2a3a",
          border: "1px solid #2f3a4a", borderRadius: 8,
          color: "#e7e9ea", fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
}

export function InboxList({
  messages, loading, error, onSelect, onRetry,
  emptyText = "No messages yet",
  onSwitchToGmail,
  accentColor = "#1d9bf0",
  refreshing = false,
}: InboxListProps) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);

  if (loading) return <Skeleton accentColor={accentColor} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!messages.length) return <EmptyState text={emptyText} onSwitchToGmail={onSwitchToGmail} accentColor={accentColor} />;

  const unreadCount = messages.filter(m => !readIds.has(m.id)).length;

  return (
    <div style={{ overflow: "auto", flex: 1 }}>
      {/* Inbox header row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "5px 12px 4px",
        borderBottom: "1px solid #0f1825",
      }}>
        <span style={{ fontSize: 10, color: "#3d4753", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Inbox
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {refreshing && (
            <span style={{ fontSize: 9, color: "#3d4753" }}>Checking…</span>
          )}
          {unreadCount > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "1px 6px",
              background: accentColor + "22", color: accentColor,
              border: `1px solid ${accentColor}44`,
              borderRadius: 9999,
            }}>
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {messages.map((msg, i) => {
        const isUnread = !readIds.has(msg.id);
        const isVerify = isVerificationEmail(msg.subject, msg.from);
        const isHov = hovered === msg.id;

        return (
          <button
            key={msg.id}
            onClick={() => {
              setReadIds(prev => new Set([...prev, msg.id]));
              onSelect(msg.id);
            }}
            onMouseEnter={() => setHovered(msg.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: "100%", display: "flex", alignItems: "flex-start", gap: 9,
              padding: "10px 12px 9px",
              borderBottom: i < messages.length - 1 ? "1px solid #0f1825" : "none",
              background: isHov ? "#0c1628" : isUnread ? "#090e1a" : "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.12s",
              borderLeft: `3px solid ${isUnread ? accentColor : "transparent"}`,
              position: "relative",
            }}
          >
            <Avatar from={msg.from} />

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Row 1: sender + unread dot + time */}
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: isUnread ? 700 : 500,
                  color: isUnread ? "#e7e9ea" : "#71767b",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  flex: 1,
                }}>
                  {msg.from || "Unknown"}
                </span>
                {isVerify && <VerifyBadge />}
                {isUnread && <UnreadDot color={accentColor} />}
                <span style={{ fontSize: 10, color: "#3d4753", flexShrink: 0 }}>
                  {formatDate(msg.date)}
                </span>
              </div>

              {/* Row 2: subject */}
              <div style={{
                fontSize: 12,
                fontWeight: isUnread ? 650 : 400,
                color: isUnread ? "#c8d0da" : "#566070",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                marginBottom: msg.intro ? 2 : 0,
              }}>
                {msg.subject || "(no subject)"}
              </div>

              {/* Row 3: preview */}
              {msg.intro && (
                <div style={{
                  fontSize: 11,
                  color: "#3d4753",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {msg.intro}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
