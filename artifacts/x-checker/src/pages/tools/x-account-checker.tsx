import { useState } from "react";
import { useCheckAccounts, type AccountCheckResult } from "@workspace/api-client-react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2, Copy, Trash2, CheckCircle2, XCircle, HelpCircle,
  UserX, AlertCircle, BadgeCheck, ExternalLink, Users, Calendar,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

function upgradeImageUrl(url: string | null): string | null {
  if (!url) return null;
  // Replace any Twitter size suffix with _bigger (73px) — universally available on all accounts
  return url.replace(/_(normal|mini|400x400|reasonably_small)(\.\w+)$/, "_bigger$2");
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

const FAQS = [
  { q: "Is the X Account Checker free?", a: "Yes, completely free with no signup required. Check up to 100 accounts per batch instantly." },
  { q: "How many accounts can I check at once?", a: "You can check up to 100 Twitter/X usernames in a single batch for free." },
  { q: "What data does the checker show?", a: "For each account the checker shows status (Active/Suspended/Deleted), follower count, following count, join date, verified badge, profile photo and display name." },
  { q: "Can I check if a Twitter account is suspended?", a: "Yes. The tool instantly shows whether each account is Active, Suspended, or Deleted." },
  { q: "Do I need a Twitter account or API key?", a: "No. The checker works without any Twitter login, API key, or credentials of any kind." },
  { q: "Can I check celebrity or verified accounts?", a: "Yes. The tool works for any public Twitter/X account including verified and high-follower accounts." },
];

export default function XAccountChecker() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AccountCheckResult[]>([]);
  const { toast } = useToast();
  const checkAccountsMutation = useCheckAccounts();

  const handleCheck = () => {
    const usernames = input
      .split(/[\s,]+/).map((u) => u.trim().replace(/^@/, "")).filter((u) => u.length > 0);
    if (usernames.length === 0) {
      toast({ title: "No usernames provided", description: "Please enter at least one username.", variant: "destructive" });
      return;
    }
    if (usernames.length > 100) {
      toast({ title: "Too many usernames", description: "Max 100 at a time.", variant: "destructive" });
      return;
    }
    trackEvent("account_check", { label: String(usernames.length) });
    checkAccountsMutation.mutate(
      { data: { usernames } },
      {
        onSuccess: (data) => {
          setResults(data.results);
          toast({ title: "Check complete", description: `Checked ${data.results.length} accounts.` });
        },
        onError: (error) => {
          const msg = (error as { data?: { error?: string } }).data?.error
            ?? (error as Error).message
            ?? "An unexpected error occurred.";
          toast({ title: "Error", description: msg, variant: "destructive" });
        },
      }
    );
  };

  const handleClear = () => { setInput(""); setResults([]); };

  const handleCopyResults = () => {
    if (!results.length) return;
    const text = results.map((r) =>
      `${r.username}\t${r.status.toUpperCase()}${r.displayName ? `\t${r.displayName}` : ""}${r.followerCount != null ? `\t${r.followerCount} followers` : ""}`
    ).join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: "Results copied as TSV." });
  };

  const getStatusIcon = (status: AccountCheckResult["status"]) => {
    switch (status) {
      case "active": return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "suspended": return <XCircle className="h-4 w-4 text-destructive" />;
      case "not_found": return <UserX className="h-4 w-4 text-muted-foreground" />;
      default: return <HelpCircle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: AccountCheckResult["status"]) => {
    switch (status) {
      case "active": return <Badge variant="outline" className="bg-success/10 text-success border-success/25 font-medium">Active</Badge>;
      case "suspended": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/25 font-medium">Suspended</Badge>;
      case "not_found": return <Badge variant="outline" className="bg-muted/60 text-muted-foreground border-muted-foreground/20 font-medium">Not Found</Badge>;
      default: return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/25 font-medium">Unknown</Badge>;
    }
  };

  const activeCount = results.filter(r => r.status === "active").length;
  const suspendedCount = results.filter(r => r.status === "suspended").length;
  const notFoundCount = results.filter(r => r.status === "not_found").length;

  return (
    <MiniToolLayout
      seoTitle="X Account Checker — Bulk Twitter Status & Profile Data | X Toolkit"
      seoDescription="Bulk check Twitter/X account status — followers, join date, verified badge. Up to 100 accounts free. No signup."
      seoKeywords="twitter account checker, x account checker, bulk twitter checker, suspended account checker, twitter username checker, check twitter account status, bulk x account check, twitter follower checker, twitter verified checker, check twitter followers, suspended twitter account, deleted twitter account checker, free twitter checker, twitter profile checker"
      icon={Search}
      badge="Most Popular"
      title="X Account Checker"
      description="Bulk-check up to 100 X accounts — active, suspended, or deleted — in seconds. No login required."
      faqs={FAQS}
      affiliateCategory="growth"
      relatedTools={[
        { title: "Profile Link Generator", href: "/tools/profile-link-generator", description: "Convert usernames to X profile links instantly." },
        { title: "@ Formatter", href: "/tools/at-formatter", description: "Bulk add or remove the @ prefix from username lists." },
        { title: "AI Bio Generator", href: "/tools/bio-generator", description: "Generate professional X bios with AI." },
        { title: "Username Generator", href: "/tools/username-generator", description: "Generate unique X handle ideas for any niche." },
      ]}
    >
      <div className="space-y-5">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Check Account Status</CardTitle>
                <CardDescription className="mt-1">Paste usernames separated by newlines, spaces, or commas. The @ prefix is optional.</CardDescription>
              </div>
              <span className="text-xs font-mono text-muted-foreground bg-muted/50 border border-border/50 rounded-md px-2 py-1 shrink-0">
                {input.split(/[\s,]+/).filter(Boolean).length} / 100
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              id="account-checker-input"
              name="account-checker-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"elonmusk\n@jack\nsama\nOpenAI"}
              className="min-h-[140px] font-mono text-sm bg-background/60 border-border/60 resize-y focus-visible:ring-primary/40 placeholder:text-muted-foreground/40"
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCheck}
                disabled={checkAccountsMutation.isPending || !input.trim()}
                className="flex-1 shadow-sm shadow-primary/15"
              >
                {checkAccountsMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Checking…</>
                ) : (
                  <><Search className="h-4 w-4 mr-2" /> Check Status</>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={!input && !results.length} className="border-border/60 text-xs">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="border-border/60 bg-card shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-semibold">Results</CardTitle>
                <CardDescription className="text-xs flex items-center gap-3">
                  <span className="flex items-center gap-1 text-success"><CheckCircle2 className="h-3 w-3" /> {activeCount} active</span>
                  <span className="flex items-center gap-1 text-destructive"><XCircle className="h-3 w-3" /> {suspendedCount} suspended</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><UserX className="h-3 w-3" /> {notFoundCount} not found</span>
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyResults} className="text-xs border-border/60">
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {/* ── Mobile: card list ── */}
              <div className="sm:hidden divide-y divide-border/40">
                {results.map((r) => (
                  <div key={r.username} className="px-4 py-3.5 flex flex-col gap-2.5">
                    {/* Top row: avatar + name + status */}
                    <div className="flex items-center gap-3">
                      {r.status === "active" && r.profileImageUrl ? (
                        <a
                          href={`https://x.com/${r.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 ring-0 hover:ring-2 hover:ring-primary/40 rounded-full transition-all"
                          title={`View @${r.username} on X`}
                        >
                          <Avatar className="h-10 w-10 border border-border/50">
                            <AvatarImage src={upgradeImageUrl(r.profileImageUrl)!} alt={r.username} />
                            <AvatarFallback className="text-xs bg-muted">{r.username[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </a>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted/60 border border-border/50 flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-muted-foreground">{r.username[0]?.toUpperCase()}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-semibold text-sm">@{r.username}</span>
                          {r.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                        </div>
                        {r.displayName && (
                          <div className="text-xs text-muted-foreground truncate">{r.displayName}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {getStatusIcon(r.status)}
                        {getStatusBadge(r.status)}
                      </div>
                    </div>
                    {/* Stats row */}
                    {r.status === "active" && (r.followerCount != null || r.followingCount != null || r.createdAt) && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pl-1 flex-wrap">
                        {r.followerCount != null && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="text-foreground font-medium">{formatCount(r.followerCount)}</span> followers
                          </span>
                        )}
                        {r.followingCount != null && (
                          <span className="flex items-center gap-1">
                            <span className="text-foreground font-medium">{formatCount(r.followingCount)}</span> following
                          </span>
                        )}
                        {r.createdAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {formatDate(r.createdAt)}
                          </span>
                        )}
                        {r.status === "active" && (
                          <a
                            href={`https://x.com/${r.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline ml-auto"
                          >
                            <ExternalLink className="h-3 w-3" /> View profile
                          </a>
                        )}
                      </div>
                    )}
                    {r.status !== "active" && (
                      <div className="text-xs text-muted-foreground/50 pl-1">No additional data available</div>
                    )}
                  </div>
                ))}
              </div>

              {/* ── Desktop: table ── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Account</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Followers</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Following</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {results.map((r) => (
                      <tr key={r.username} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {r.status === "active" && r.profileImageUrl ? (
                              <a
                                href={`https://x.com/${r.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 ring-0 hover:ring-2 hover:ring-primary/40 rounded-full transition-all"
                                title={`View @${r.username} on X`}
                              >
                                <Avatar className="h-9 w-9 border border-border/50">
                                  <AvatarImage src={upgradeImageUrl(r.profileImageUrl)!} alt={r.username} />
                                  <AvatarFallback className="text-[10px] bg-muted">{r.username[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                              </a>
                            ) : (
                              <div className="h-9 w-9 rounded-full bg-muted/60 border border-border/50 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-medium text-muted-foreground">{r.username[0]?.toUpperCase()}</span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium truncate text-[13px]">@{r.username}</span>
                                {r.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                                {r.status === "active" && (
                                  <a
                                    href={`https://x.com/${r.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground/50 hover:text-primary transition-colors shrink-0"
                                    title="Open profile on X"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                              {r.displayName && (
                                <div className="text-xs text-muted-foreground truncate">{r.displayName}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(r.status)}
                            {getStatusBadge(r.status)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {r.followerCount != null ? (
                            <span className="flex items-center gap-1.5 text-sm text-foreground/80">
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                              {formatCount(r.followerCount)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {r.followingCount != null ? (
                            <span className="text-sm text-foreground/80">{formatCount(r.followingCount)}</span>
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {r.createdAt ? (
                            <span className="flex items-center gap-1.5 text-sm text-foreground/80">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              {formatDate(r.createdAt)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {checkAccountsMutation.isPending && (
          <div className="flex items-center justify-center gap-2.5 py-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Checking accounts…</span>
          </div>
        )}

        {checkAccountsMutation.isError && !results.length && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/8 p-4">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-sm text-destructive">
              {(checkAccountsMutation.error as { data?: { error?: string } } | null)?.data?.error
                ?? (checkAccountsMutation.error as Error | null)?.message
                ?? "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {/* About */}
        <div className="space-y-6">

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">What is the X Account Checker?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The X Account Checker is the most powerful free bulk Twitter/X account checker available online. Unlike other tools that only show Active or Suspended status, our checker returns complete profile data for every account — including real-time follower counts, following counts, join date, verified badge status, and profile photos.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Check up to 100 Twitter/X usernames simultaneously with no login, no API key, and no signup required. Results appear instantly with full profile details for every account.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">What Data Does It Show?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Account status</strong> — Active, Suspended, or Deleted</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Follower count</strong> — real-time follower numbers</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Following count</strong> — how many accounts they follow</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Join date</strong> — when the account was created</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Verified badge</strong> — blue/gold checkmark status</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Profile photo and display name</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Direct link to view the profile on X</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Bulk check up to 100 accounts at once</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">How Is This Different From Other Checkers?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Most free Twitter account checkers only tell you if an account exists or is suspended. X Toolkit's checker goes further — it returns the complete public profile snapshot for every username you check. This means you can verify influencer accounts, audit your following list, or research accounts at scale with real data, all completely free.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Who Uses This Tool?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Social media managers auditing follower lists</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Marketers verifying influencer account authenticity</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Researchers tracking Twitter/X account changes</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Agencies managing multiple client accounts</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Developers testing Twitter integrations</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Anyone verifying if a Twitter account is still active</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">How to Use the Bulk X Account Checker</h2>
            <ol className="space-y-2 text-sm text-muted-foreground list-none">
              <li className="flex items-start gap-3"><span className="text-primary font-semibold shrink-0 mt-0.5">1.</span> Enter up to 100 Twitter/X usernames (one per line or comma separated)</li>
              <li className="flex items-start gap-3"><span className="text-primary font-semibold shrink-0 mt-0.5">2.</span> Click "Check Accounts"</li>
              <li className="flex items-start gap-3"><span className="text-primary font-semibold shrink-0 mt-0.5">3.</span> View instant results with full profile data</li>
              <li className="flex items-start gap-3"><span className="text-primary font-semibold shrink-0 mt-0.5">4.</span> Copy results to clipboard or export</li>
            </ol>
          </div>

        </div>
      </div>
    </MiniToolLayout>
  );
}
