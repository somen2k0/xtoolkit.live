export function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/(?:\*|@?[a-z][a-z0-9-,\s.]*)(?:[^{}]*)\{[^{}]*\}/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function extractOTP(text: string): string | null {
  if (!text) return null;

  // Priority 1: keyword-adjacent alphanumeric codes (e.g. "F75-51S", "RI2-DDX" in subject)
  const alphaNumPatterns: RegExp[] = [
    // "code: F75-51S" or "code is F75-51S" — any alphanum with dash separator
    /(?:code|otp|token|verification|confirm(?:ation)?)[\s:\r\n]+([A-Z0-9]{2,8}[-–—][A-Z0-9]{2,8})/i,
    // Three-part dash-separated code (e.g. "ABC-123-XYZ")
    /\b([A-Z0-9]{2,6}[-–—][A-Z0-9]{2,6}[-–—][A-Z0-9]{2,6})\b/i,
    // Two-part dash-separated alphanumeric code — any mix of letters & digits (e.g. "F75-51S", "RI2-DDX")
    /\b([A-Z0-9]{2,8}[-–—][A-Z0-9]{2,8})\b/i,
  ];
  for (const pattern of alphaNumPatterns) {
    const match = text.match(pattern);
    // Must contain at least one digit — prevents matching CSS names like FONT-FAMILY
    if (match?.[1] && /\d/.test(match[1])) return match[1].toUpperCase();
  }

  // Priority 2: keyword-adjacent numeric patterns (most reliable signal)
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

  // Strip hex color values (e.g. #333333, #fff) before digit-only fallbacks
  // to avoid picking up CSS color codes as OTPs
  const textNoHex = text.replace(/#[0-9a-f]{3,8}\b/gi, "");

  // Priority 3: 6-digit number (most common OTP length)
  const sixDigit = textNoHex.match(/\b(\d{6})\b/);
  if (sixDigit?.[1]) return sixDigit[1];

  // Priority 4: other digit lengths in order of commonality
  for (const len of [4, 5, 7, 8]) {
    const m = textNoHex.match(new RegExp(`\\b(\\d{${len}})\\b`));
    if (m?.[1]) return m[1];
  }

  return null;
}

export function highlightOTP(html: string, otp: string): string {
  if (!otp || !html) return html;
  const escaped = otp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(
    new RegExp(`\\b${escaped}\\b`, "g"),
    `<span style="background:rgba(16,185,129,0.2);color:#4ade80;padding:2px 4px;border-radius:3px;font-weight:700;font-family:monospace">${otp}</span>`,
  );
}

export function isVerificationEmail(subject: string, from: string): boolean {
  const combined = `${subject} ${from}`.toLowerCase();
  return /verif|confirm|otp|code|pin|login|sign.?in|security|authent|one.?time|activate|reset|password/.test(combined);
}

export function formatDate(dateStr: string): string {
  try {
    if (!dateStr) return "—";
    const asNumber = Number(dateStr);
    const d =
      !isNaN(asNumber) && dateStr.trim() !== ""
        ? new Date(asNumber * 1000)
        : new Date(dateStr);

    if (isNaN(d.getTime())) return "—";

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString();
  } catch {
    return "—";
  }
}

export function getIntro(text: string, maxLen = 80): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > maxLen ? clean.slice(0, maxLen) + "…" : clean;
}
