import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, CheckCircle2, XCircle, HelpCircle, Download, Trash2,
  ScanSearch, Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { trackEvent } from "@/lib/analytics";

interface GmailResult {
  email: string;
  status: "valid" | "invalid" | "unknown";
}

const STATUS_CONFIG = {
  valid: {
    label: "Valid",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
    rowClass: "bg-emerald-400/[0.03]",
  },
  invalid: {
    label: "Invalid",
    icon: XCircle,
    badgeClass: "bg-red-400/15 text-red-400 border-red-400/30",
    rowClass: "bg-red-400/[0.03]",
  },
  unknown: {
    label: "Unknown",
    icon: HelpCircle,
    badgeClass: "bg-amber-400/15 text-amber-400 border-amber-400/30",
    rowClass: "",
  },
};

const FAQS = [
  {
    q: "How does the Gmail Account Checker work?",
    a: "The checker validates each address in two steps. First it confirms the format is a valid Gmail address (correct length, no invalid characters, ends with @gmail.com). Then it sends a lightweight probe to Google's own account lookup endpoint — the same one Gmail uses internally — and reads the response to determine if the account exists.",
  },
  {
    q: "What do the status results mean?",
    a: "Valid means Google confirmed the Gmail address exists and the account is active. Invalid means either the format is wrong, or Google's endpoint confirmed the account does not exist. Unknown means the format was valid but the check timed out or Google returned an ambiguous response — try again, as these are often valid accounts under temporary rate limiting.",
  },
  {
    q: "How many Gmail addresses can I check at once?",
    a: "You can paste up to 50 Gmail addresses per batch. Paste one address per line in the input box. If you have more than 50, run them in multiple batches.",
  },
  {
    q: "Is this tool free? Do I need to sign in?",
    a: "Completely free, no account required, no API key needed. The check runs through our server so your browser doesn't hit Google directly.",
  },
  {
    q: "Why would a result show Unknown instead of Valid or Invalid?",
    a: "Google rate-limits bulk lookups. If you run many checks in quick succession, some responses may be ambiguous. Wait a few seconds and re-check the Unknown results. Unknown never means the address is definitely invalid.",
  },
  {
    q: "Can I check non-Gmail addresses?",
    a: "No — this tool is specifically designed for @gmail.com addresses. For validating other email address formats, use the Email Address Validator tool.",
  },
  {
    q: "Does this tool store the Gmail addresses I enter?",
    a: "No. Addresses are sent to our server only to make the Google probe, and are immediately discarded. We don't log, store, or share any addresses you check.",
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
      toast({
        title: "Check complete",
        description: `${data.results.filter((r) => r.status === "valid").length} valid, ${data.results.filter((r) => r.status === "invalid").length} invalid.`,
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

  const validCount = results.filter((r) => r.status === "valid").length;
  const invalidCount = results.filter((r) => r.status === "invalid").length;
  const unknownCount = results.filter((r) => r.status === "unknown").length;

  return (
    <MiniToolLayout
      seoTitle="Gmail Account Checker — Bulk Gmail Validator | X Toolkit"
      seoDescription="Check if Gmail addresses are valid or invalid in bulk. Paste up to 50 Gmail addresses and instantly see which are active. Free, no signup."
      seoKeywords="gmail checker, gmail account checker, bulk gmail checker, gmail validator, check gmail account, gmail status checker, valid gmail checker"
      icon={ScanSearch}
      badge="New"
      title="Gmail Account Checker"
      description="Paste up to 50 Gmail addresses and instantly verify which accounts are valid, invalid, or unknown."
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
            Checking {progress.total} address{progress.total !== 1 ? "es" : ""}…
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
              <Badge variant="outline" className="bg-emerald-400/15 text-emerald-400 border-emerald-400/30">
                {validCount} Valid
              </Badge>
            )}
            {invalidCount > 0 && (
              <Badge variant="outline" className="bg-red-400/15 text-red-400 border-red-400/30">
                {invalidCount} Invalid
              </Badge>
            )}
            {unknownCount > 0 && (
              <Badge variant="outline" className="bg-amber-400/15 text-amber-400 border-amber-400/30">
                {unknownCount} Unknown
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
          A Gmail account checker is a tool that verifies whether a given <code className="text-xs bg-muted px-1 py-0.5 rounded">@gmail.com</code> address corresponds to an active Google account. Unlike a basic email format validator — which only checks whether an address looks syntactically correct — a Gmail checker makes an active probe to confirm the account exists in Google's infrastructure.
        </p>
        <p>
          This is useful in dozens of scenarios: cleaning a mailing list, verifying leads before a sales campaign, confirming that a Google Workspace user exists, or simply checking whether an old email address you have on file is still active.
        </p>

        <h2 className="text-base font-semibold text-foreground">How Gmail Validation Works</h2>
        <p>
          Gmail addresses follow stricter rules than generic email addresses. A valid Gmail username must be between 6 and 30 characters, can only contain letters, numbers, and periods, cannot start or end with a period, and cannot contain two consecutive periods. The domain is always <code className="text-xs bg-muted px-1 py-0.5 rounded">@gmail.com</code> — Google Workspace accounts use a custom domain and are not checked here.
        </p>
        <p>
          Our checker first validates the format client-side, then sends the address to our server which probes Google's own account-lookup endpoint. This endpoint is the same one Gmail itself uses to validate addresses during account creation and message composition. The response reveals whether the account exists without requiring any login or API key.
        </p>

        <h2 className="text-base font-semibold text-foreground">Understanding the Three Status Results</h2>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Valid</span> — Google confirmed the account exists and is active. The address is safe to contact.
            </div>
          </li>
          <li className="flex gap-3">
            <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Invalid</span> — Either the format is incorrect (wrong character set, wrong length, wrong domain) or Google confirmed the account does not exist. Emails to this address will bounce.
            </div>
          </li>
          <li className="flex gap-3">
            <HelpCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Unknown</span> — The format is valid but the check returned an ambiguous or timeout response. This typically happens when Google's lookup endpoint rate-limits the request. Re-checking Unknown results after a short wait usually resolves them.
            </div>
          </li>
        </ul>

        <h2 className="text-base font-semibold text-foreground">Common Use Cases</h2>
        <ul className="space-y-2 list-disc list-inside marker:text-muted-foreground/40">
          <li><span className="text-foreground">Email list hygiene</span> — Remove dead accounts before an email campaign to improve deliverability and sender reputation.</li>
          <li><span className="text-foreground">Lead verification</span> — Confirm that a contact's Gmail address is real before spending time on outreach.</li>
          <li><span className="text-foreground">Form spam filtering</span> — Developers can use the API to validate user-submitted Gmail addresses at signup without storing anything.</li>
          <li><span className="text-foreground">User data cleanup</span> — If your app has a database of Gmail addresses collected over years, bulk-validate them to identify stale accounts.</li>
          <li><span className="text-foreground">Double opt-in verification</span> — Supplement your email confirmation flow with a format-level pre-check before sending a confirmation link.</li>
        </ul>

        <h2 className="text-base font-semibold text-foreground">Privacy &amp; Data Handling</h2>
        <p>
          The addresses you paste are transmitted to our server over HTTPS solely for the purpose of making the Google probe. They are not stored, logged, sold, or used for any other purpose. Each check is ephemeral — once the response is returned to your browser, the data is discarded server-side. We do not set cookies or require any account to use this tool.
        </p>

        <h2 className="text-base font-semibold text-foreground">Limitations</h2>
        <p>
          This tool works only for standard <code className="text-xs bg-muted px-1 py-0.5 rounded">@gmail.com</code> addresses. Google Workspace accounts (which use a company domain like <code className="text-xs bg-muted px-1 py-0.5 rounded">@yourcompany.com</code>) cannot be checked. Additionally, very new accounts (created in the last few minutes) may briefly return Unknown while Google propagates the account state. Accounts that have been deleted very recently may also show as Unknown rather than Invalid during Google's propagation window.
        </p>
        <p>
          For a more comprehensive email verification workflow — checking MX records, SMTP validity, and spam blacklists — consider combining this tool with the Email Address Validator, which handles all RFC-compliant email formats.
        </p>
      </div>
    </MiniToolLayout>
  );
}
