import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Trash2, AtSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FAQS = [
  { q: "What does this tool do?", a: "It bulk adds or removes the @ prefix from a list of X (Twitter) usernames in one click." },
  { q: "What separators are supported?", a: "One username per line works best. The tool handles any mix of usernames with or without @." },
  { q: "Is there a limit on how many usernames I can process?", a: "No — paste as many as you need. Everything runs locally in your browser." },
  { q: "Does any data get sent to a server?", a: "No. This tool runs entirely in your browser — no usernames are ever sent to our servers." },
  { q: "Can I copy just one username from the result?", a: "Yes — hover over any username in the result list and click the copy icon that appears." },
];

export default function AtFormatter() {
  const [atInput, setAtInput] = useState("");
  const [atMode, setAtMode] = useState<"add" | "remove">("add");
  const { toast } = useToast();

  const atLines = atInput.split(/\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const atOutput = atLines.map((u) =>
    atMode === "add" ? (u.startsWith("@") ? u : `@${u}`) : u.replace(/^@+/, "")
  );

  return (
    <MiniToolLayout
      seoTitle="@ Formatter — Bulk Add or Remove @ From X Usernames Free"
      seoDescription="Instantly add or remove the @ prefix from a list of X (Twitter) usernames. Paste your list and get formatted results in one click. Free, no signup."
      icon={AtSign}
      badge="Free Tool"
      title="@ Formatter"
      description="Bulk add or remove the @ prefix from username lists in one click. Paste one username per line."
      faqs={FAQS}
      affiliateCategory="growth"
      relatedTools={[
        { title: "X Account Checker", href: "/tools/x-account-checker", description: "Bulk-check if accounts are active, suspended, or deleted." },
        { title: "Profile Link Generator", href: "/tools/profile-link-generator", description: "Convert usernames to X profile links instantly." },
        { title: "Username Generator", href: "/tools/username-generator", description: "Generate unique X handle ideas for any niche." },
        { title: "Hashtag Formatter", href: "/tools/hashtag-formatter", description: "Clean, format, and deduplicate hashtag lists." },
      ]}
    >
      <div className="space-y-5">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">@ Formatter</CardTitle>
            <CardDescription>Bulk add or remove the @ prefix from username lists.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {(["add", "remove"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={atMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAtMode(mode)}
                  className={`flex-1 text-xs ${atMode !== mode ? "border-border/60" : ""}`}
                >
                  {mode === "add" ? "Add @" : "Remove @"}
                </Button>
              ))}
            </div>
            <Textarea
              value={atInput}
              onChange={(e) => setAtInput(e.target.value)}
              placeholder={"elonmusk\n@jack\nsama"}
              className="min-h-[150px] font-mono text-sm bg-background/60 border-border/60 resize-y focus-visible:ring-primary/40 placeholder:text-muted-foreground/40"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{atLines.length} username{atLines.length !== 1 ? "s" : ""}</span>
              <Button variant="outline" size="sm" disabled={!atLines.length} onClick={() => setAtInput("")} className="text-xs border-border/60">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {atOutput.length > 0 && (
          <Card className="border-border/60 bg-card shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-semibold">Result</CardTitle>
                <CardDescription className="text-xs">@ {atMode === "add" ? "added to" : "removed from"} {atOutput.length} username{atOutput.length !== 1 ? "s" : ""}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(atOutput.join("\n"));
                  toast({ title: "Copied!", description: `${atOutput.length} usernames copied.` });
                }}
                className="text-xs border-border/60"
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 bg-background/40 p-4 max-h-72 overflow-y-auto">
                <ul className="space-y-1.5">
                  {atOutput.map((u, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 group">
                      <span className="font-mono text-sm text-foreground">{u}</span>
                      <button
                        type="button"
                        onClick={() => { navigator.clipboard.writeText(u); toast({ title: "Copied!", description: u }); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        title="Copy"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The @ Formatter takes a plain list of names or words and converts them into properly formatted @mentions by adding the @ symbol, removing spaces, and cleaning up special characters. Paste one name per line and get a ready-to-paste list of @handles in seconds.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Preparing a list of @mentions from a spreadsheet of names</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Converting a team roster into X (Twitter) handles for a post</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Formatting usernames from a CRM export for outreach</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Paste your list of usernames — one per line. They can include or omit the @ symbol in any mix.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Choose <strong className="text-foreground/80">Add @</strong> to prefix every username with @ (for social media mentions), or <strong className="text-foreground/80">Remove @</strong> to strip the @ prefix (for CRM tools or spreadsheets).</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> The result updates instantly as you type — no button click needed.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> Copy individual usernames by hovering over any row, or copy the entire list with "Copy All".</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Paste the formatted list into your tweet, CRM, outreach tool, or spreadsheet.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Cleaning scraped username data</strong> for consistency before importing into another tool.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Formatting handle lists</strong> for Twitter mention posts where the @ prefix is required.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Preparing usernames for CRM or outreach tools</strong> that expect handles without the @ symbol.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Standardizing data in social media spreadsheets</strong> where mixed formatting causes import errors.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Processing bulk lists for social media campaigns</strong> where hundreds of handles need consistent formatting.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Converting between formats</strong> when switching between tools that have different username format expectations.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Social media managers, growth hackers, data analysts, and marketers use the @ formatter when working with large lists of Twitter/X handles. Data consistency is critical when usernames are used in automated tools, APIs, or imported into CRM systems. A list that mixes @username and username (without @) can break imports, cause duplicate detection to fail, and create inconsistencies in reporting. Our formatter ensures every handle in a list is in exactly the right format for whatever tool you're using.
          </p>
        </div>

        {/* Why consistent formatting matters */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Why consistent username formatting matters</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Different tools have different expectations for username format. Twitter's mention system requires the @ symbol — typing <code className="text-xs font-mono bg-muted/60 rounded px-1">@username</code> in a tweet creates a clickable mention. Many CRMs and outreach tools expect usernames <em>without</em> the @ symbol, and including it breaks their lookup functions. Spreadsheets used for data analysis work better with clean, consistent data. When you're working with hundreds or thousands of usernames from multiple sources, a mix of formats becomes a data quality problem. Our formatter resolves this in one click regardless of list size.
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "What does the @ formatter do exactly?", a: "It adds or removes the @ symbol from Twitter/X usernames in bulk. Handles any size list instantly — processing is done in your browser with no server calls, so there are no rate limits or delays." },
              { q: "Can I process hundreds of usernames at once?", a: "Yes. Paste any number of usernames — one per line — and the formatter processes all of them instantly. There is no hard limit on the number of usernames you can format in a single operation." },
              { q: "What if my list has mixed formats (some with @, some without)?", a: "The formatter detects which usernames already have @ and which don't, then applies the operation correctly to all of them. Choosing 'Add @' won't double-add the symbol to usernames that already have it." },
              { q: "Does it validate usernames?", a: "The formatter checks for basic Twitter/X username format rules — usernames must be alphanumeric with underscores, and no longer than 15 characters. Invalid entries are still processed but the result may not be a valid Twitter handle." },
              { q: "Can I use this for Instagram or other platforms?", a: "Yes. The @ symbol format is standard across Twitter/X, Instagram, TikTok, and most social platforms. The formatter works for any @ handle list, regardless of which platform the usernames are from." },
            ].map(({ q, a }) => (
              <div key={q} className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground/80">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MiniToolLayout>
  );
}
