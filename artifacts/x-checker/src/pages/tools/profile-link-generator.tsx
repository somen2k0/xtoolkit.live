import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, ExternalLink, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FAQS = [
  { q: "What does this tool do?", a: "It converts a list of X (Twitter) usernames into clickable profile URLs — one per line, comma-separated, or space-separated." },
  { q: "Does it verify the accounts exist?", a: "No, it just builds the URLs. Use the X Account Checker tool if you also need to verify the accounts are active." },
  { q: "Can I include the @ symbol?", a: "Yes — the tool automatically strips the @ prefix before building the link." },
  { q: "How many usernames can I process at once?", a: "There is no hard limit — paste as many usernames as you need." },
  { q: "What format are the links in?", a: "Links are in the format https://x.com/username — the current canonical X profile URL." },
];

export default function ProfileLinkGenerator() {
  const [profileInput, setProfileInput] = useState("");
  const { toast } = useToast();

  const profileUsernames = profileInput
    .split(/[\s,\n]+/).map((u) => u.trim().replace(/^@/, "")).filter((u) => u.length > 0);
  const profileLinks = profileUsernames.map((u) => ({ username: u, url: `https://x.com/${u}` }));

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: url });
  };

  const handleCopyAllLinks = () => {
    if (!profileLinks.length) return;
    navigator.clipboard.writeText(profileLinks.map((l) => l.url).join("\n"));
    toast({ title: "Copied all links!", description: `${profileLinks.length} links copied.` });
  };

  return (
    <MiniToolLayout
      seoTitle="X Profile Link Generator — Convert Usernames to X Profile URLs Free"
      seoDescription="Instantly convert a list of X (Twitter) usernames into direct profile links. Paste multiple usernames and get all profile URLs in one click. Free."
      icon={Link2}
      badge="Free Tool"
      title="Profile Link Generator"
      description="Convert a list of X usernames into direct profile links instantly. Paste one per line, comma-separated, or space-separated."
      faqs={FAQS}
      affiliateCategory="growth"
      relatedTools={[
        { title: "X Account Checker", href: "/tools/x-account-checker", description: "Bulk-check if accounts are active, suspended, or deleted." },
        { title: "@ Formatter", href: "/tools/at-formatter", description: "Bulk add or remove the @ prefix from username lists." },
        { title: "Username Generator", href: "/tools/username-generator", description: "Generate unique X handle ideas for any niche." },
        { title: "AI Bio Generator", href: "/tools/bio-generator", description: "Generate professional X bios with AI." },
      ]}
    >
      <div className="space-y-5">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Profile Link Generator</CardTitle>
            <CardDescription>Paste usernames to generate X profile links instantly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={profileInput}
              onChange={(e) => setProfileInput(e.target.value)}
              placeholder={"elonmusk\n@jack\nsama"}
              className="min-h-[120px] font-mono text-sm bg-background/60 border-border/60 resize-y focus-visible:ring-primary/40 placeholder:text-muted-foreground/40"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{profileUsernames.length} username{profileUsernames.length !== 1 ? "s" : ""}</span>
              <Button variant="outline" size="sm" disabled={!profileLinks.length} onClick={handleCopyAllLinks} className="text-xs border-border/60">
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy All
              </Button>
            </div>
          </CardContent>
        </Card>

        {profileLinks.length > 0 && (
          <Card className="border-border/60 bg-card shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Generated Links</CardTitle>
              <CardDescription className="text-xs">{profileLinks.length} profile link{profileLinks.length !== 1 ? "s" : ""}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 bg-background/40 divide-y divide-border/40 overflow-hidden">
                {profileLinks.map(({ username, url }) => (
                  <div key={username} className="flex items-center gap-3 px-3 py-2.5 group hover:bg-muted/30 transition-colors">
                    <span className="text-sm font-medium text-foreground/80 shrink-0 w-32 truncate">@{username}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex-1 truncate">{url}</a>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleCopyLink(url)} className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors" title="Copy link">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors" title="Open profile">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This profile link generator converts a list of X (Twitter) usernames into direct clickable profile URLs in seconds. Paste one username per line (with or without the @ symbol), and get a formatted list of <code className="text-xs font-mono bg-muted/60 rounded px-1.5 py-0.5">x.com/username</code> links ready to use.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Building a curated list of X profile links to share in a newsletter</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Converting a spreadsheet of usernames into clickable links</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Preparing a "follow these accounts" roundup for a blog post or report</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Enter one or more Twitter/X usernames — one per line, comma-separated, or space-separated. The @ symbol is optional.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Profile URLs are generated instantly as you type — no button click needed.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Get direct profile URLs for every username in the format <code className="text-xs font-mono bg-muted/60 rounded px-1">https://x.com/username</code>.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> Copy individual links by hovering over a row, or copy all links at once with "Copy All".</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Paste the links into spreadsheets, documents, newsletters, or outreach tools — they're ready to use immediately.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Social media managers</strong> building client profile reference lists for reporting and monitoring.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Researchers</strong> creating reference lists of accounts to track for studies or competitive analysis.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Marketers</strong> building influencer contact lists with clickable profile links for outreach spreadsheets.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Developers</strong> generating test data URLs for Twitter app testing and QA environments.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Content creators</strong> linking to collaborators and guests in show notes, newsletters, or blog posts.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">PR teams</strong> building journalist and media contact databases with direct profile access.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Social media managers, growth marketers, PR professionals, and researchers use profile link generators to quickly build lists of Twitter/X profile URLs. Instead of manually typing twitter.com/username for dozens or hundreds of accounts, this tool generates all links instantly. Agencies use it when onboarding clients to compile competitor profile lists. Newsletters use it to add clickable attribution links. Podcast producers use it to credit guests in show notes.
          </p>
        </div>

        {/* Twitter/X URL formats */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Twitter/X profile URL formats explained</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Twitter/X profile URLs work in two formats: <code className="text-xs font-mono bg-muted/60 rounded px-1">https://twitter.com/username</code> (old format, still works) and <code className="text-xs font-mono bg-muted/60 rounded px-1">https://x.com/username</code> (new format after the platform's rebranding). Both URLs redirect to the same profile — the platform automatically redirects twitter.com links to x.com. Our generator creates links in the canonical <code className="text-xs font-mono bg-muted/60 rounded px-1">x.com</code> format, which is the current official URL scheme.
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "What format does a Twitter/X profile URL use?", a: "https://x.com/username is the current canonical format after Twitter's rebranding to X. The older https://twitter.com/username format still works and automatically redirects to the same profile. Both point to the same account." },
              { q: "Can I generate links for multiple profiles at once?", a: "Yes — paste any number of usernames (one per line, comma-separated, or space-separated) and the tool generates all profile URLs instantly. There is no hard limit on the number of usernames you can process." },
              { q: "Do generated links work for private accounts?", a: "The links are generated correctly for any username format. Whether a visitor can actually see the profile depends on the account's privacy settings — private accounts require a follow request that the account owner must approve." },
              { q: "Is there a limit to how many links I can generate?", a: "No limit. Process as many usernames as you need in a single batch. The tool processes everything instantly in your browser with no server calls required." },
              { q: "Can I export the generated links to a spreadsheet?", a: "Yes. Click 'Copy All' and paste the links into any spreadsheet application like Excel or Google Sheets. Each URL will be on its own row, ready to use as clickable links in your document." },
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
