import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, CheckCircle2, XCircle, HelpCircle, Download, Trash2,
  ScanSearch, Copy, AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { trackEvent } from "@/lib/analytics";

interface GmailResult {
  email: string;
  status: "valid" | "invalid" | "disabled" | "unknown";
}

const STATUS_CONFIG = {
  valid: {
    label: "Valid",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-400/15 text-emerald-600 border-emerald-400/30",
    rowClass: "bg-emerald-400/[0.03]",
  },
  invalid: {
    label: "Invalid",
    icon: XCircle,
    badgeClass: "bg-red-400/15 text-red-500 border-red-400/30",
    rowClass: "bg-red-400/[0.03]",
  },
  disabled: {
    label: "Disabled",
    icon: AlertTriangle,
    badgeClass: "bg-orange-400/15 text-orange-500 border-orange-400/30",
    rowClass: "bg-orange-400/[0.03]",
  },
  unknown: {
    label: "Unknown",
    icon: HelpCircle,
    badgeClass: "bg-amber-400/15 text-amber-500 border-amber-400/30",
    rowClass: "",
  },
};

const FAQS = [
  {
    q: "How does the Gmail Account Checker work?",
    a: "The checker uses SMTP verification — it connects directly to Gmail's mail server (aspmx.l.google.com on port 25) and issues a RCPT TO command for each address. Google's mail server responds with a code that tells us whether the account exists, doesn't exist, or has been disabled. This is the same method professional email hygiene services use.",
  },
  {
    q: "What do the four status results mean?",
    a: "Valid means Gmail's mail server confirmed the address exists and can receive mail. Invalid means either the format is wrong, or the server returned a 550/551/553 rejection confirming the account doesn't exist. Disabled means the account exists but has been suspended or deactivated by Google (550 with 'disabled' message, or 552/554). Unknown means the SMTP connection timed out or returned an unexpected code — try again.",
  },
  {
    q: "What is a Disabled Gmail account?",
    a: "A disabled Gmail account is one that Google has suspended or deactivated. This can happen due to Terms of Service violations, inactivity, or a user manually deleting their account (which briefly returns a 'disabled' response before resolving to invalid). Emails sent to disabled accounts will bounce.",
  },
  {
    q: "How many Gmail addresses can I check at once?",
    a: "You can paste up to 50 Gmail addresses per batch. Paste one address per line. For larger lists, run multiple batches.",
  },
  {
    q: "Is this tool free? Do I need to sign in?",
    a: "Completely free, no account required. The SMTP check runs through our server so your browser makes no direct connection to Google's mail infrastructure.",
  },
  {
    q: "Why would a result show Unknown?",
    a: "Unknown means the SMTP connection timed out (10 second limit) or Gmail's server returned an unexpected response code. This can happen under load or if the server is temporarily unavailable. Re-checking Unknown results after a short wait usually resolves them.",
  },
  {
    q: "Does this tool store the Gmail addresses I enter?",
    a: "No. Addresses are sent to our server only to make the SMTP probe, and are immediately discarded after the response is returned to your browser. We don't log, store, or share any addresses.",
  },
];

const relatedTools = [
  {
    title: "Email Address Validator",
    href: "/tools/email-validator",
    description: "Validate any email address format — not just Gmail.",
  },
  {
    title: "Temp Mail",
    href: "/tools/temp-mail",
    description: "Get a free disposable inbox instantly — no signup.",
  },
  {
    title: "Masked Email Generator",
    href: "/tools/masked-email-generator",
    description: "Create anonymous email aliases to protect your real inbox.",
  },
  {
    title: "Spam Score Checker",
    href: "/tools/spam-score-checker",
    description: "Check your subject line and email body for spam signals.",
  },
];

export default function GmailChecker() {
  useToolView("gmail-checker");
  const [input, setInput] = useState("");
  const [results, setResults] = useState<GmailResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const { toast } = useToast();

  const handleCheck = async () => {
    const lines = input
      .split("\n")
      .map((l) => l.trim().toLowerCase())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      toast({ title: "No addresses entered", description: "Paste at least one Gmail address.", variant: "destructive" });
      return;
    }
    if (lines.length > 50) {
      toast({ title: "Too many addresses", description: "Maximum 50 per batch.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setProgress({ done: 0, total: lines.length });
    setResults([]);
    trackEvent("gmail_check", { label: String(lines.length) });

    try {
      const res = await fetch("/api/gmail-checker/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: lines }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `Server error ${res.status}`);
      }

      const data = (await res.json()) as { results: GmailResult[] };
      setResults(data.results);
      setProgress({ done: data.results.length, total: data.results.length });

      const v = data.results.filter((r) => r.status === "valid").length;
      const inv = data.results.filter((r) => r.status === "invalid").length;
      const dis = data.results.filter((r) => r.status === "disabled").length;
      toast({
        title: "Check complete",
        description: [
          v > 0 && `${v} valid`,
          inv > 0 && `${inv} invalid`,
          dis > 0 && `${dis} disabled`,
        ].filter(Boolean).join(", ") || "Check complete.",
      });
    } catch (err) {
      toast({
        title: "Check failed",
        description: (err as Error).message ?? "Unexpected error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setResults([]);
    setProgress(null);
  };

  const handleDownloadCsv = () => {
    if (!results.length) return;
    const header = "Email,Status";
    const rows = results.map((r) => `${r.email},${r.status}`).join("\n");
    const blob = new Blob([header + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gmail-check-results.csv";
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("gmail_check_csv_download");
  };

  const handleCopyValid = () => {
    const valid = results.filter((r) => r.status === "valid").map((r) => r.email).join("\n");
    if (!valid) { toast({ title: "No valid addresses", variant: "destructive" }); return; }
    navigator.clipboard.writeText(valid);
    toast({ title: "Copied", description: "Valid Gmail addresses copied to clipboard." });
  };

  const validCount    = results.filter((r) => r.status === "valid").length;
  const invalidCount  = results.filter((r) => r.status === "invalid").length;
  const disabledCount = results.filter((r) => r.status === "disabled").length;
  const unknownCount  = results.filter((r) => r.status === "unknown").length;

  return (
    <MiniToolLayout
      seoTitle="Gmail Account Checker — Bulk Gmail Validator | X Toolkit"
      seoDescription="Check if Gmail addresses are valid, invalid, disabled, or unknown in bulk via SMTP verification. Paste up to 50 addresses. Free, no signup."
      seoKeywords="gmail checker, gmail account checker, bulk gmail checker, gmail validator, check gmail account, gmail status checker, smtp gmail checker"
      icon={ScanSearch}
      badge="New"
      title="Gmail Account Checker"
      description="Paste up to 50 Gmail addresses and verify which are valid, invalid, disabled, or unknown via SMTP."
      faqs={FAQS}
      relatedTools={relatedTools}
      affiliateCategory="all"
    >
      {/* Input */}
      <div className="space-y-3">
        <Textarea
          placeholder={"user1@gmail.com\nuser2@gmail.com\nuser3@gmail.com"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[160px] font-mono text-sm resize-y"
          disabled={loading}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleCheck} disabled={loading || !input.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking…
              </>
            ) : (
              <>
                <ScanSearch className="h-4 w-4 mr-2" />
                Check Gmail Addresses
              </>
            )}
          </Button>
          {(results.length > 0 || input) && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      {loading && progress && (
        <div className="mt-4 rounded-lg border border-border/50 bg-muted/20 p-4">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Checking {progress.total} address{progress.total !== 1 ? "es" : ""} via SMTP…
          </div>
          <div className="w-full bg-muted/40 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">{results.length} checked</span>
            {validCount > 0 && (
              <Badge variant="outline" className="bg-emerald-400/15 text-emerald-600 border-emerald-400/30">
                ✅ {validCount} Valid
              </Badge>
            )}
            {invalidCount > 0 && (
              <Badge variant="outline" className="bg-red-400/15 text-red-500 border-red-400/30">
                ❌ {invalidCount} Invalid
              </Badge>
            )}
            {disabledCount > 0 && (
              <Badge variant="outline" className="bg-orange-400/15 text-orange-500 border-orange-400/30">
                ⚠️ {disabledCount} Disabled
              </Badge>
            )}
            {unknownCount > 0 && (
              <Badge variant="outline" className="bg-amber-400/15 text-amber-500 border-amber-400/30">
                ❓ {unknownCount} Unknown
              </Badge>
            )}
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyValid} title="Copy valid addresses">
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy Valid
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadCsv}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                CSV
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">#</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const cfg = STATUS_CONFIG[r.status];
                  const Icon = cfg.icon;
                  return (
                    <tr
                      key={r.email}
                      className={`border-b border-border/30 last:border-0 transition-colors ${cfg.rowClass}`}
                    >
                      <td className="px-4 py-2.5 text-xs text-muted-foreground/50 tabular-nums">{i + 1}</td>
                      <td className="px-4 py-2.5 font-mono text-xs break-all">{r.email}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.badgeClass}`}>
                          <Icon className="h-3 w-3 shrink-0" />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Long-form content */}
      <div className="mt-10 space-y-6 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-8">
        <h2 className="text-base font-semibold text-foreground">What Is a Gmail Account Checker?</h2>
        <p>
          A Gmail account checker verifies whether a given <code className="text-xs bg-muted px-1 py-0.5 rounded">@gmail.com</code> address corresponds to an active Google account. Unlike a basic format validator — which only checks syntax — this tool makes a live SMTP probe to Gmail's mail server to confirm whether the account actually exists.
        </p>
        <p>
          This is useful for email list hygiene, lead verification before outreach, confirming old contact addresses, or cleaning a user database of stale accounts.
        </p>

        <h2 className="text-base font-semibold text-foreground">How the SMTP Check Works</h2>
        <p>
          The checker connects directly to Gmail's MX server (<code className="text-xs bg-muted px-1 py-0.5 rounded">aspmx.l.google.com</code>) on port 25 and issues an SMTP <code className="text-xs bg-muted px-1 py-0.5 rounded">RCPT TO</code> command for each address. Google's mail server responds with a numeric code: 250 means the mailbox exists, 550/551/553 means it doesn't (or is disabled), and other codes indicate an ambiguous result. This is the same protocol professional email hygiene services use — no scraping, no unofficial APIs.
        </p>

        <h2 className="text-base font-semibold text-foreground">Understanding the Four Status Results</h2>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Valid</span> — Gmail's mail server returned 250 or 251, confirming the mailbox exists and can receive email.
            </div>
          </li>
          <li className="flex gap-3">
            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Invalid</span> — Either the Gmail format is incorrect (wrong length, invalid characters), or the server returned a 550/551/553 rejection confirming the account does not exist. Emails will bounce.
            </div>
          </li>
          <li className="flex gap-3">
            <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Disabled</span> — The account exists in Google's system but has been suspended or deactivated. The SMTP server returns a 550 with a "disabled" message, or a 552/554 code. Emails to disabled accounts will bounce.
            </div>
          </li>
          <li className="flex gap-3">
            <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Unknown</span> — The SMTP connection timed out (10 second limit) or returned an unexpected response code. This can happen under server load. Re-checking Unknown results after a short wait typically resolves them.
            </div>
          </li>
        </ul>

        <h2 className="text-base font-semibold text-foreground">Common Use Cases</h2>
        <ul className="space-y-2 list-disc list-inside marker:text-muted-foreground/40">
          <li><span className="text-foreground">Email list hygiene</span> — Remove invalid and disabled accounts before a campaign to protect your sender reputation.</li>
          <li><span className="text-foreground">Lead verification</span> — Confirm a contact's Gmail address is real before spending time on outreach.</li>
          <li><span className="text-foreground">User data cleanup</span> — Bulk-validate Gmail addresses in a database to identify stale or suspended accounts.</li>
          <li><span className="text-foreground">Double opt-in pre-check</span> — Validate format and existence before sending a confirmation email.</li>
        </ul>

        <h2 className="text-base font-semibold text-foreground">Privacy &amp; Data Handling</h2>
        <p>
          Addresses are transmitted to our server over HTTPS solely to make the SMTP probe. They are not stored, logged, or used for any other purpose. Each check is ephemeral — once the response is returned to your browser, the data is discarded server-side.
        </p>

        <h2 className="text-base font-semibold text-foreground">Limitations</h2>
        <p>
          This tool works only for standard <code className="text-xs bg-muted px-1 py-0.5 rounded">@gmail.com</code> addresses. Google Workspace accounts (company domains) cannot be checked. Port 25 SMTP access may occasionally be throttled by Google, causing some results to return Unknown — re-checking after a few seconds usually resolves this.
        </p>
      </div>
    </MiniToolLayout>
  );
}
