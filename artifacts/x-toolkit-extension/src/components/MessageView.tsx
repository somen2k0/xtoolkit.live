import { useState, useEffect, useCallback } from "react";
import { Message } from "../types";
import { extractOTP, formatDate, stripHtml, highlightOTP } from "../lib/otp";

interface MessageViewProps {
  message: Message;
  onBack: () => void;
  fetchBody?: () => Promise<{ body: string; bodyContentType: "html" | "text" }>;
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

const SAFE_EMAIL_STYLES = `
<style>
  img { max-width: min(100%, 200px) !important; height: auto !important; display: block; }
  table { max-width: 100% !important; width: 100% !important; border-collapse: collapse; }
  td, th { word-break: break-word; }
  a { color: #60a5fa !important; }
  body, html { background: transparent !important; }
</style>
`;

function extractImgSize(styleVal: string): string {
  const wm = /\bwidth\s*:\s*([\d.]+)\s*px/i.exec(styleVal);
  const hm = /\bheight\s*:\s*([\d.]+)\s*px/i.exec(styleVal);
  let attrs = "";
  if (wm) attrs += ` width="${Math.round(Number(wm[1]))}"`;
  if (hm) attrs += ` height="${Math.round(Number(hm[1]))}"`;
  return attrs;
}

function sanitizeAndTheme(html: string, otp: string | null): string {
  let clean = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/(?:\*|@?[a-z][a-z0-9-,\s.]*)(?:[^<>{}]*)\{[^<>{}]*\}/gi, "")
    // Preserve width/height from img inline styles before stripping all styles
    .replace(/<img([^>]*?)style="([^"]*)"([^>]*?)>/gi, (_m, before, styleVal, after) => {
      return `<img${before}${extractImgSize(styleVal)}${after}>`;
    })
    .replace(/<img([^>]*?)style='([^']*)'([^>]*?)>/gi, (_m, before, styleVal, after) => {
      return `<img${before}${extractImgSize(styleVal)}${after}>`;
    })
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sstyle='[^']*'/gi, "")
    .replace(/\sbgcolor="[^"]*"/gi, "")
    .replace(/\scolor="[^"]*"/gi, "")
    .replace(/\sface="[^"]*"/gi, "");
  if (otp) clean = highlightOTP(clean, otp);
  return SAFE_EMAIL_STYLES + clean;
}

export function MessageView({ message, onBack, fetchBody }: MessageViewProps) {
  const [body, setBody] = useState(message.body ?? "");
  const [bodyType, setBodyType] = useState<"html" | "text">(message.bodyContentType ?? "text");
  const [loading, setLoading] = useState(false);
  const [otpCopied, setOtpCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);

  useEffect(() => {
    if (!message.body && fetchBody) {
      setLoading(true);
      fetchBody()
        .then((res) => { setBody(res.body); setBodyType(res.bodyContentType); })
        .catch(() => setBody("Failed to load message body."))
        .finally(() => setLoading(false));
    }
  }, [message.id]);

  const plainText = bodyType === "html" ? stripHtml(body) : body;
  const otp = extractOTP(plainText) ?? extractOTP(message.subject);

  const copyOTP = useCallback(async () => {
    if (!otp) return;
    try {
      await navigator.clipboard.writeText(otp);
    } catch {
      const el = document.createElement("textarea");
      el.value = otp;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setOtpCopied(true);
    setTimeout(() => setOtpCopied(false), 2000);
  }, [otp]);

  const copyText = useCallback(async () => {
    const text = plainText || body;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 2000);
  }, [plainText, body]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", animation: "fade-in 0.2s ease" }}>
      {/* Header */}
      <div style={{ padding: "8px 12px", borderBottom: "1px solid #1e2a3a", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#71767b", borderRadius: 6 }}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e7e9ea", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {message.subject}
          </div>
          <div style={{ fontSize: 11, color: "#71767b" }}>
            {message.from} · {formatDate(message.date)}
          </div>
        </div>
      </div>

      {/* OTP Banner */}
      {otp && (
        <div style={{
          margin: "8px 12px 0",
          padding: "10px 12px",
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: "#10b981", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>
              Verification Code
            </div>
            <div style={{ fontSize: 24, color: "#4ade80", fontWeight: 700, fontFamily: "monospace", letterSpacing: "4px", lineHeight: 1 }}>
              {otp}
            </div>
          </div>
          <button
            onClick={() => void copyOTP()}
            style={{
              padding: "6px 14px",
              background: otpCopied ? "#059669" : "#10b981",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            {otpCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {loading ? (
          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 0.7, 0.85, 0.5, 0.9].map((w, i) => (
              <div key={i} style={{ width: `${w * 100}%`, height: 11, background: "#1e2a3a", borderRadius: 4, animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : bodyType === "html" ? (
          <div
            style={{
              background: "#0f0f1a",
              color: "#e2e8f0",
              fontSize: 13,
              lineHeight: 1.6,
              padding: 12,
              userSelect: "text",
              WebkitUserSelect: "text",
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: sanitizeAndTheme(body, otp) }}
          />
        ) : (
          <pre style={{
            background: "#0f0f1a",
            color: "#e2e8f0",
            fontSize: 13,
            lineHeight: 1.6,
            padding: 12,
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            margin: 0,
            userSelect: "text",
            WebkitUserSelect: "text",
          } as React.CSSProperties}>
            {body || "No content"}
          </pre>
        )}
      </div>

      {/* Copy email text button */}
      {!loading && (body || plainText) && (
        <div style={{ padding: "8px 12px", borderTop: "1px solid #1e2a3a", flexShrink: 0 }}>
          <button
            onClick={() => void copyText()}
            style={{
              width: "100%",
              padding: "6px 12px",
              background: textCopied ? "#1a2e1a" : "#0f1623",
              border: `1px solid ${textCopied ? "#10b98144" : "#1e2a3a"}`,
              borderRadius: 8,
              color: textCopied ? "#10b981" : "#71767b",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {textCopied ? "✓ Text copied!" : "Copy email text"}
          </button>
        </div>
      )}
    </div>
  );
}
