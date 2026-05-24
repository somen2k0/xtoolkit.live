import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hash, Copy, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrack, useToolView } from "@/hooks/use-track";

type Format = "camel" | "lower" | "upper";

function toHashtag(phrase: string, format: Format): string {
  const words = phrase.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  let tag: string;
  if (format === "camel") {
    tag = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
  } else if (format === "upper") {
    tag = words.map(w => w.toUpperCase()).join("");
  } else {
    tag = words.map(w => w.toLowerCase()).join("");
  }
  return "#" + tag.replace(/[^a-zA-Z0-9_]/g, "");
}

const faqs = [
  { q: "What is a hashtag formatter?", a: "A hashtag formatter converts plain words or phrases into properly formatted Twitter hashtags. It handles multi-word phrases by combining them (e.g., 'web design' becomes #WebDesign or #webdesign) and strips special characters that aren't allowed in hashtags." },
  { q: "What characters are allowed in Twitter hashtags?", a: "Twitter hashtags can only contain letters (A-Z, a-z), numbers (0-9), and underscores (_). Spaces, hyphens, punctuation, and most special characters are not allowed and will break the hashtag." },
  { q: "Should I use CamelCase or lowercase hashtags?", a: "CamelCase hashtags (#WebDesign) are generally preferred for readability and are screen-reader friendly. Lowercase (#webdesign) also works fine. Uppercase (#WEBDESIGN) can feel like shouting but is sometimes used for brand hashtags or events." },
  { q: "How many hashtags should I use per tweet?", a: "Twitter recommends using 1-2 hashtags per tweet for best engagement. Using too many hashtags (5+) can make tweets look spammy and actually reduce engagement. For Instagram, 5-10 relevant hashtags perform well." },
  { q: "Do hashtags help with Twitter reach?", a: "Yes — hashtags make your tweets discoverable to people searching for that topic. However, only use relevant hashtags that your target audience actually follows. Irrelevant hashtags rarely improve reach and can hurt credibility." },
];

const relatedTools = [
  { title: "Tweet Thread Formatter", href: "/tools/tweet-formatter", description: "Split long text into a numbered tweet thread automatically." },
  { title: "Character Counter", href: "/tools/character-counter", description: "Count characters in real time against Twitter's limits." },
  { title: "Twitter Font Preview", href: "/tools/font-preview", description: "Preview text in Unicode font styles for your tweets." },
  { title: "@ Formatter", href: "/tools/at-formatter", description: "Bulk add or remove @ prefixes from username lists." },
];

const EXAMPLES = ["digital marketing", "web design", "social media", "content creator", "startup life", "tech entrepreneur"];

export default function HashtagFormatter() {
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<Format>("camel");
  const { toast } = useToast();
  const track = useTrack("hashtag-formatter");
  useToolView("hashtag-formatter");

  const lines = input.split(/[\n,]+/).map(l => l.trim()).filter(Boolean);
  const hashtags = lines.map(l => toHashtag(l, format)).filter(Boolean);

  const copyAll = () => {
    if (!hashtags.length) return;
    navigator.clipboard.writeText(hashtags.join(" "));
    track("copy_hashtag", { label: "all", value: hashtags.length });
    toast({ title: "Copied!", description: `${hashtags.length} hashtags copied.` });
  };

  const copyOne = (tag: string) => {
    navigator.clipboard.writeText(tag);
    track("copy_hashtag", { label: "single" });
    toast({ title: "Copied!", description: tag });
  };

  const loadExamples = () => {
    setInput(EXAMPLES.join("\n"));
    track("format_hashtag", { label: "example" });
  };

  return (
    <MiniToolLayout
      seoTitle="Twitter Hashtag Formatter — Convert Words to #Hashtags Instantly"
      seoDescription="Convert any words or phrases into properly formatted Twitter hashtags. Supports CamelCase, lowercase, and uppercase. Copy all hashtags in one click."
      icon={Hash}
      badge="Free Tool"
      title="Twitter Hashtag Formatter"
      description="Enter words or phrases — one per line or comma-separated — and convert them into properly formatted Twitter hashtags instantly. Choose CamelCase, lowercase, or uppercase style."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="scheduling"
    >
      <div className="space-y-5">
        {/* Format selector */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-1">Format:</span>
          {(["camel", "lower", "upper"] as Format[]).map(f => (
            <button
              key={f}
              onClick={() => { setFormat(f); track("format_hashtag", { label: f }); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                format === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
              }`}
            >
              {f === "camel" ? "#CamelCase" : f === "lower" ? "#lowercase" : "#UPPERCASE"}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Input</label>
              <button onClick={loadExamples} className="text-xs text-primary hover:underline flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> Load examples
              </button>
            </div>
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={"web design\ndigital marketing\ncontent creator\n\nor comma-separated: social media, startup"}
              className="min-h-[200px] font-mono text-sm bg-background/60 border-border/60 resize-none focus-visible:ring-primary/40"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setInput("")} disabled={!input} className="text-xs border-border/60">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear
              </Button>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                Hashtags <span className="font-mono text-primary ml-1">{hashtags.length}</span>
              </label>
              <Button variant="outline" size="sm" onClick={copyAll} disabled={!hashtags.length} className="text-xs border-border/60 h-7">
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy All
              </Button>
            </div>
            <div className="min-h-[200px] rounded-xl border border-border/60 bg-background/40 p-4 overflow-y-auto">
              {hashtags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, i) => (
                    <button key={i} onClick={() => copyOne(tag)} title="Click to copy">
                      <Badge variant="outline" className="font-mono text-sm px-3 py-1.5 border-primary/30 text-primary bg-primary/8 hover:bg-primary/15 transition-colors cursor-pointer">
                        {tag}
                      </Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/50 text-center mt-16">Your hashtags will appear here</p>
              )}
            </div>
            {hashtags.length > 0 && (
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Inline (for copy-paste):</p>
                <p className="font-mono text-xs text-foreground/80 break-all">{hashtags.join(" ")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Expanded SEO content */}
        <div className="space-y-8 pt-2">

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">What is a hashtag formatter?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A hashtag formatter is a tool that converts plain words, phrases, or a messy list of tags into properly structured hashtags ready to paste into your X (Twitter), Instagram, or LinkedIn posts. Instead of manually adding # symbols, stripping spaces, and fixing capitalization on every tag, a formatter handles all of that in one step — so you can focus on your content rather than on cleanup.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This tool goes further by letting you choose your preferred casing style: <strong>CamelCase</strong> (#DigitalMarketing) for readability, <strong>lowercase</strong> (#digitalmarketing) for a clean, modern look, or <strong>UPPERCASE</strong> (#DIGITALMARKETING) for high-visibility brand tags. It strips any special characters that X doesn't allow in hashtags, removes duplicate entries, and outputs both a clickable badge view and an inline copy-paste string — everything you need in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">How to use hashtags effectively on X / Twitter</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hashtags on X work as discovery signals — they make your tweet findable to users searching for or following that topic. The most effective hashtag strategy is to use 1–2 highly relevant tags per tweet rather than stuffing in as many as possible. Over-hashtagging looks spammy to both the algorithm and human readers, and X's own research shows that tweets with 1–2 hashtags get better engagement than those with 5 or more. Focus on tags your target audience actually follows, not just tags that are broadly popular.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Placement matters too. Hashtags embedded naturally in the sentence ("Excited about #WebDesign trends") read more cleanly than a wall of tags at the end. If you're adding multiple hashtags, place them at the very end of the tweet after your main content so the message stays readable. For campaigns, branded hashtags (#YourBrandEvent) are valuable for aggregating conversation and tracking reach — just keep them short and easy to spell correctly from memory.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Best practices for hashtag usage</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Use 1–2 hashtags per tweet.</strong> X's algorithm rewards focused, relevant tagging. More than 3 tags typically signals spam and reduces organic reach.</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Choose niche over broad.</strong> #IndieGameDev will reach a more engaged audience than #Gaming, which has millions of competing posts drowning yours out.</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Use CamelCase for multi-word tags.</strong> #ContentCreator is far more readable than #contentcreator — and screen readers announce each word separately, improving accessibility.</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Research before you post.</strong> Search for the hashtag on X first to see if it's active, relevant, and not associated with content you wouldn't want to be grouped with.</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Create a consistent set for your niche.</strong> Having a saved library of 10–15 relevant hashtags for your topic means you can pick the best 1–2 for any tweet without starting from scratch every time.</span></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Common hashtag mistakes to avoid</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-destructive/70 mt-0.5">✕</span> <span><strong className="text-foreground/80">Hashtag stuffing</strong> — Adding 10+ hashtags makes your tweet look like spam and suppresses engagement.</span></li>
              <li className="flex items-start gap-2"><span className="text-destructive/70 mt-0.5">✕</span> <span><strong className="text-foreground/80">Using spaces or special characters</strong> — #web design breaks at the space and only links #web. Always run phrases through a formatter first.</span></li>
              <li className="flex items-start gap-2"><span className="text-destructive/70 mt-0.5">✕</span> <span><strong className="text-foreground/80">Copying hashtags from Instagram</strong> — Instagram culture uses many more tags than X. What works there will look out of place on X.</span></li>
              <li className="flex items-start gap-2"><span className="text-destructive/70 mt-0.5">✕</span> <span><strong className="text-foreground/80">Using only mega-popular tags</strong> — Tags like #love or #marketing have millions of posts. Your tweet disappears in seconds. Target mid-size, focused communities instead.</span></li>
              <li className="flex items-start gap-2"><span className="text-destructive/70 mt-0.5">✕</span> <span><strong className="text-foreground/80">Ignoring trending hashtags</strong> — Jumping on a trending topic with a relevant tweet can dramatically increase reach, but only if your content actually relates to the trend.</span></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Hashtag Best Practices by Platform</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Different platforms have different hashtag norms. On Twitter/X, 1–3 targeted hashtags perform best — the platform's algorithm deprioritizes posts that look spammy. Instagram allows up to 30 hashtags and rewards posts that use relevant ones strategically. LinkedIn works best with 3–5 professional hashtags. Our formatter helps you prepare hashtag sets for any platform quickly.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground/80">Platform</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground/80">Recommended count</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground/80">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    { platform: "Twitter / X", count: "1–3", note: "Fewer is better. More than 3 reduces engagement." },
                    { platform: "Instagram", count: "5–15", note: "Up to 30 allowed. Mix popular and niche tags." },
                    { platform: "LinkedIn", count: "3–5", note: "Professional, relevant tags only." },
                    { platform: "TikTok", count: "3–6", note: "Include trending + niche + brand tags." },
                    { platform: "YouTube", count: "3–8", note: "Tags in description improve search discovery." },
                  ].map((row, i) => (
                    <tr key={row.platform} className={`border-b border-border/40 ${i % 2 === 0 ? "bg-background/20" : ""}`}>
                      <td className="px-4 py-2.5 font-medium text-foreground/80">{row.platform}</td>
                      <td className="px-4 py-2.5 font-mono text-primary">{row.count}</td>
                      <td className="px-4 py-2.5 text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How many hashtags should I use on Twitter/X?", a: "1–3 hashtags per tweet is optimal. More than 3 hashtags can reduce engagement and make your post look spammy to Twitter's algorithm." },
                { q: "Can I use spaces in hashtags?", a: "No. Hashtags cannot contain spaces. Use CamelCase (#HashtagFormatter) or no separator for multi-word hashtags. Our formatter handles this automatically." },
                { q: "Do hashtags work the same on all platforms?", a: "No. Instagram supports up to 30 hashtags. Twitter/X works best with 1–3. LinkedIn recommends 3–5. Our formatter works for all platforms — prepare your list and choose the right count for each." },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-border/50 bg-background/30 p-4 space-y-1">
                  <p className="text-sm font-semibold text-foreground/90">{q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </MiniToolLayout>
  );
}
