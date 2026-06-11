import { useState, useCallback } from "react";
import { AdSlot } from "@/components/AdSlot";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { KeyRound, Copy, Trash2, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

const faqs = [
  { q: "What is a JWT?", a: "A JSON Web Token (JWT) is a compact, URL-safe way to represent claims between two parties. It consists of three Base64URL-encoded parts separated by dots: a header (algorithm info), a payload (claims/data), and a signature (for verification)." },
  { q: "Is it safe to paste my JWT here?", a: "Yes. This tool decodes JWTs entirely in your browser — no data is sent to any server. However, never share your JWT publicly, as it may grant access to protected resources." },
  { q: "Can this tool verify JWT signatures?", a: "No. Signature verification requires the secret or public key used to sign the token, which only your server should have. This tool only decodes and displays the header and payload for inspection purposes." },
  { q: "What do the JWT claims mean?", a: "Common claims include: sub (subject — who the token is about), iat (issued at — Unix timestamp), exp (expiration — Unix timestamp), aud (audience), iss (issuer), and nbf (not before). Custom claims can also be included." },
  { q: "What is the difference between HS256 and RS256?", a: "HS256 uses a shared secret (HMAC-SHA256) — the same key signs and verifies. RS256 uses asymmetric keys (RSA) — a private key signs and a public key verifies. RS256 is preferred for distributed systems." },
];

const relatedTools = [
  { title: "Base64 Encoder / Decoder", href: "/tools/base64", description: "Encode and decode Base64 strings including JWT payloads." },
  { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON instantly." },
  { title: "URL Encoder / Decoder", href: "/tools/url-encoder", description: "Encode or decode URLs and query parameters." },
];

const EXAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MDAwMDAwMDAsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function b64decode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean;
  expiresAt: Date | null;
}

function decodeJWT(token: string): { ok: true; data: DecodedJWT } | { ok: false; error: string } {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return { ok: false, error: "Invalid JWT: must have 3 parts separated by dots." };
  try {
    const header = JSON.parse(b64decode(parts[0])) as Record<string, unknown>;
    const payload = JSON.parse(b64decode(parts[1])) as Record<string, unknown>;
    const signature = parts[2];
    const exp = typeof payload.exp === "number" ? new Date(payload.exp * 1000) : null;
    const isExpired = exp ? exp < new Date() : false;
    return { ok: true, data: { header, payload, signature, isExpired, expiresAt: exp } };
  } catch {
    return { ok: false, error: "Failed to decode JWT. Make sure it's a valid token." };
  }
}

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" });
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  useToolView("jwt-decoder");

  const handleInput = useCallback((val: string) => {
    setInput(val);
    if (!val.trim()) { setDecoded(null); setError(""); return; }
    const result = decodeJWT(val);
    if (result.ok) { setDecoded(result.data); setError(""); }
    else { setDecoded(null); setError(result.error); }
  }, []);

  const copySection = (obj: Record<string, unknown>) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    toast({ title: "Copied!" });
  };

  const handleClear = () => { setInput(""); setDecoded(null); setError(""); };
  const loadExample = () => handleInput(EXAMPLE_JWT);

  const formatValue = (key: string, val: unknown): string => {
    if ((key === "iat" || key === "exp" || key === "nbf") && typeof val === "number") {
      return `${val} (${formatDate(new Date(val * 1000))})`;
    }
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  return (
    <MiniToolLayout
      seoTitle="JWT Decoder Online Free — Decode JSON Web Tokens"
      seoDescription="Decode and inspect JWT (JSON Web Token) header and payload online. Instant decoding, expiry detection, 100% client-side — your token never leaves your browser."
      icon={KeyRound}
      badge="Developer Tool"
      title="JWT Decoder"
      description="Paste a JWT to instantly decode and inspect its header, payload, and expiration. All decoding happens in your browser — your token is never sent to a server."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="all"
    >
      <AdSlot slot="top" className="mb-6" />
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">JWT Token</span>
            <button onClick={loadExample} className="text-[11px] text-primary/70 hover:text-primary underline underline-offset-2 transition-colors">Load example</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={"Paste your JWT here...\n\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
            spellCheck={false}
            className={`w-full min-h-[100px] resize-y rounded-xl border bg-background/60 px-4 py-3.5 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground/35 break-all ${
              error ? "border-destructive/40 focus:ring-destructive/30" : decoded ? "border-green-500/30 focus:ring-green-500/20" : "border-border/60 focus:ring-primary/30"
            }`}
          />
          {error && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <XCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {decoded && (
          <div className="space-y-3">
            {decoded.isExpired && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/25 text-xs text-destructive font-medium">
                <XCircle className="h-3.5 w-3.5 shrink-0" />
                Token expired {decoded.expiresAt ? `— ${formatDate(decoded.expiresAt)}` : ""}
              </div>
            )}
            {!decoded.isExpired && decoded.expiresAt && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/25 text-xs text-green-500 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Token valid — expires {formatDate(decoded.expiresAt)}
              </div>
            )}

            {[
              { title: "Header", color: "text-blue-400", data: decoded.header },
              { title: "Payload", color: "text-purple-400", data: decoded.payload },
            ].map(({ title, color, data }) => (
              <div key={title} className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-muted/20">
                  <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{title}</span>
                  <Button variant="ghost" size="sm" onClick={() => copySection(data)} className="h-6 text-[11px] gap-1 text-muted-foreground hover:text-foreground px-2">
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                </div>
                <div className="p-4 space-y-2">
                  {Object.entries(data).map(([k, v]) => (
                    <div key={k} className="flex gap-3 text-xs">
                      <span className="font-mono text-primary/80 shrink-0 w-20 truncate">{k}</span>
                      <span className="font-mono text-foreground/80 break-all">{formatValue(k, v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/40 bg-muted/20">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Signature</span>
              </div>
              <pre className="px-4 py-3.5 font-mono text-xs text-muted-foreground/70 break-all whitespace-pre-wrap">{decoded.signature}</pre>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input} className="text-xs gap-1.5 text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[{ icon: ShieldCheck, label: "100% client-side" }, { icon: KeyRound, label: "Header + payload" }, { icon: CheckCircle2, label: "Expiry detection" }].map(({ icon: Ic, label }) => (
            <div key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3 py-1">
              <Ic className="h-3 w-3" />{label}
            </div>
          ))}
        </div>

        {/* ── Common Claims Reference ── */}
        <div className="mt-2 rounded-xl border border-border/60 bg-card/40 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border/40 bg-muted/20">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Common JWT Claims Reference</span>
          </div>
          <div className="divide-y divide-border/40">
            {[
              { claim: "sub",  type: "string",  desc: "Subject — who the token identifies (usually a user ID)" },
              { claim: "iss",  type: "string",  desc: "Issuer — the authority that created the token (e.g. https://auth.example.com)" },
              { claim: "aud",  type: "string | string[]", desc: "Audience — the intended recipient(s) of the token" },
              { claim: "exp",  type: "number",  desc: "Expiration — Unix timestamp after which the token is invalid" },
              { claim: "iat",  type: "number",  desc: "Issued At — Unix timestamp of when the token was created" },
              { claim: "nbf",  type: "number",  desc: "Not Before — token must not be accepted before this Unix timestamp" },
              { claim: "jti",  type: "string",  desc: "JWT ID — unique identifier, used to prevent token replay attacks" },
              { claim: "name", type: "string",  desc: "Full name of the token subject (OpenID Connect)" },
              { claim: "email", type: "string",  desc: "Email address of the subject (OpenID Connect)" },
              { claim: "role", type: "string",  desc: "Custom claim — user role (e.g. admin, viewer). Not standardised." },
            ].map(({ claim, type, desc }) => (
              <div key={claim} className="flex items-start gap-3 px-4 py-2.5 text-xs">
                <code className="font-mono text-primary/80 shrink-0 w-14">{claim}</code>
                <code className="font-mono text-muted-foreground/60 shrink-0 w-28 hidden sm:block">{type}</code>
                <span className="text-muted-foreground leading-relaxed">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This JWT decoder splits a JSON Web Token into its three parts — header, payload, and signature — and displays them in readable JSON format. It also shows the expiration time in human-readable date format and warns if the token has already expired.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Everything runs in your browser — your tokens are never sent to a server, making this safe to use with production tokens (though you should rotate them after debugging).
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Debugging authentication issues with OAuth or OpenID Connect tokens</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Verifying JWT claims like expiry, audience, and issuer</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Inspecting custom claims in API tokens during development</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Paste your JWT token into the input field — the full token including all three dot-separated parts.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> The decoder instantly splits the token into header, payload, and signature, and decodes the Base64URL-encoded header and payload.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> View the decoded JSON for each section — includes all claims, algorithm info, and token type.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> Check the expiration status — the tool shows the human-readable expiry date and warns clearly if the token has already expired.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Copy individual sections or the full decoded token for use in debugging or documentation.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Debugging 401 Unauthorized errors</strong> — inspect the token to verify claims match what your API expects.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Verifying token expiry</strong> — check whether a token's <code className="text-xs font-mono bg-muted/60 rounded px-1">exp</code> claim explains why authentication is failing.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Inspecting OAuth tokens</strong> from providers like Auth0, Okta, Firebase, or your own auth server.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Understanding token structure</strong> for developers learning JWT-based authentication for the first time.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Checking custom claims</strong> like user roles, permissions, or tenant IDs encoded in your application's tokens.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Comparing tokens</strong> before and after a refresh to verify claims updated as expected.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Backend developers, frontend engineers, DevOps engineers, and security professionals working with modern authentication systems use JWT decoders constantly. Whenever authentication breaks — a user can't log in, an API returns 401, or a session expires unexpectedly — inspecting the JWT is typically the first debugging step. This tool saves time by showing all the relevant information immediately without requiring custom code to decode and pretty-print the token.
          </p>
        </div>

        {/* Understanding JWT structure */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Understanding JWT structure</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A JWT consists of three Base64URL-encoded parts separated by dots: <code className="text-xs font-mono bg-muted/60 rounded px-1">header.payload.signature</code>. The header specifies the algorithm used to sign the token (HS256, RS256, ES256, etc.) and the token type (JWT). The payload contains the actual claims — the data being communicated, including registered claims like <code className="text-xs font-mono bg-muted/60 rounded px-1">sub</code>, <code className="text-xs font-mono bg-muted/60 rounded px-1">iat</code>, <code className="text-xs font-mono bg-muted/60 rounded px-1">exp</code>, and any custom claims your application adds. The signature is a cryptographic hash that verifies the token hasn't been tampered with — it can only be verified with the original secret or public key.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Importantly: the header and payload are only Base64URL-encoded, not encrypted. Anyone with access to a JWT can decode and read the payload. Never store sensitive data (passwords, credit card numbers, private information) in JWT payloads — they are visible to anyone who holds the token.
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">More frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "Why am I getting a 401 error even with a valid JWT?", a: "Check your token's exp claim — if it's expired, your server will reject it. Also verify the aud (audience) and iss (issuer) claims match what your server expects. Mismatched audiences and issuers are common causes of 401 errors that aren't immediately obvious. Copy the token here to inspect all claims in seconds." },
              { q: "What is Base64URL encoding and how is it different from Base64?", a: "Base64URL is a URL-safe variant of Base64 that replaces + with - and / with _, and omits padding = characters. This ensures the encoded string can be safely included in URLs and HTTP headers without escaping. JWT uses Base64URL (not regular Base64) for its header and payload sections." },
              { q: "Can I use this tool with tokens from Auth0, Firebase, or other providers?", a: "Yes. JWTs follow the RFC 7519 standard regardless of which provider generates them. Tokens from Auth0, Firebase Authentication, Okta, AWS Cognito, Supabase, and any other standards-compliant auth provider can be decoded with this tool." },
              { q: "Is it safe to paste my production JWT here?", a: "This tool decodes JWTs entirely in your browser — no data leaves your device. However, best practice is to treat any JWT as a sensitive credential: rotate your tokens after any debugging session that involved sharing them, and never paste JWTs into untrusted third-party tools." },
              { q: "What is the 'alg: none' JWT vulnerability?", a: "The 'none' algorithm is a known JWT vulnerability where an attacker modifies the header to set alg to 'none' and strips the signature, hoping the server accepts unsigned tokens. Well-implemented JWT libraries reject 'alg: none' by default. When you decode a JWT and see 'alg': 'none' in the header, this is a red flag indicating a potentially malicious or misconfigured token." },
            ].map(({ q, a }) => (
              <div key={q} className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground/80">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}
