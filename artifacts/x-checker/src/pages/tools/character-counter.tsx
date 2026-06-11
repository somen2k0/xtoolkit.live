import { useState, useCallback } from "react";
import { AdSlot } from "@/components/AdSlot";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Hash, Type, AlignLeft, Clock, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrack, useToolView } from "@/hooks/use-track";
import { trackEvent } from "@/lib/analytics";

const LIMITS = [
  { label: "X Tweet", max: 280, color: "bg-blue-500" },
  { label: "X Bio", max: 160, color: "bg-purple-500" },
  { label: "LinkedIn Post", max: 3000, color: "bg-sky-500" },
  { label: "Instagram Bio", max: 150, color: "bg-pink-500" },
];

const faqs = [
  { q: "What counts as a character on Twitter/X?", a: "Every letter, number, space, punctuation mark, and emoji counts as 1 character. URLs are automatically shortened to 23 characters regardless of their actual length. Line breaks also count as 1 character each." },
  { q: "What is the Twitter character limit?", a: "Standard Twitter/X accounts have a 280-character limit per tweet. Twitter Blue / X Premium subscribers can post up to 25,000 characters (long-form posts). Your profile bio is limited to 160 characters." },
  { q: "Do emojis count as 1 or 2 characters?", a: "Most emojis count as 2 characters on Twitter because they use two Unicode code units. Some complex emojis (like those with modifiers) may count as more. Our counter uses JavaScript's length property which matches Twitter's counting method." },
  { q: "Does Twitter count spaces as characters?", a: "Yes, every space counts as one character on Twitter. Leading and trailing spaces are also counted, so be mindful of extra whitespace at the start or end of your tweet." },
  { q: "What happens if I go over 280 characters?", a: "Twitter will not allow you to post a tweet that exceeds 280 characters. The tweet button will be disabled. You would need to either shorten your tweet or create a thread by splitting it into multiple tweets." },
  { q: "How do I split a long text into tweets?", a: "Use our Tweet Thread Formatter tool to automatically split long text into a numbered tweet thread. It respects word boundaries and adds tweet numbers (1/3, 2/3, etc.) automatically." },
];

const relatedTools = [
  { title: "Tweet Thread Formatter", href: "/tools/tweet-formatter", description: "Split long text into a numbered tweet thread." },
  { title: "Hashtag Formatter", href: "/tools/hashtag-formatter", description: "Convert words into properly formatted hashtags." },
  { title: "Twitter Font Preview", href: "/tools/font-preview", description: "Preview your text in Unicode font styles." },
  { title: "Bio Generator", href: "/tools/bio-generator", description: "Generate Twitter bio ideas for any niche." },
];

let counterDebounce: ReturnType<typeof setTimeout> | null = null;

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const { toast } = useToast();
  const track = useTrack("character-counter");
  useToolView("character-counter");

  const handleTextChange = useCallback((val: string) => {
    setText(val);
    if (counterDebounce) clearTimeout(counterDebounce);
    counterDebounce = setTimeout(() => {
      if (val.length > 0) trackEvent("counter_type", { tool: "character-counter", value: val.length });
    }, 2000);
  }, []);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split("\n").length : 0;
  const sentenceCount = text.trim() ? (text.match(/[.!?]+/g) ?? []).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const getBarColor = (pct: number, max: number) => {
    if (charCount > max) return "bg-destructive";
    if (pct > 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <MiniToolLayout
      seoTitle="Character Counter — Free Online Character & Word Count Tool | X Toolkit"
      seoDescription="Count characters, words, sentences and paragraphs in real time. Shows Twitter/X, LinkedIn, Instagram and email limits. Free character counter, no signup."
      seoKeywords="character counter, character count online, word counter, letter counter, character counter online, twitter character counter, instagram character counter, text character counter, character limit checker, online character count, free character counter"
      seoOgTitle="Character Counter — Free Online Character Count"
      seoOgDescription="Count characters and words in real time. Shows platform limits for Twitter, LinkedIn, Instagram and email. Free, no signup."
      icon={Hash}
      badge="Free Tool"
      title="Twitter Character Counter"
      description="Count characters, words, lines, and sentences in real time. Instantly see how your text measures up against Twitter's tweet limit (280) and bio limit (160)."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="scheduling"
    >
      <AdSlot slot="top" className="mb-6" />
      <div className="space-y-5">
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Type or paste your tweet, bio, or any text here..."
            className="min-h-[200px] text-sm font-mono bg-background/60 border-border/60 resize-y focus-visible:ring-primary/40"
          />
          <div className={`absolute bottom-3 right-3 text-xs font-mono font-semibold px-2 py-1 rounded-md border ${
            charCount > 280 ? "bg-destructive/10 text-destructive border-destructive/25" :
            charCount > 240 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/25" :
            "bg-muted/60 text-muted-foreground border-border/50"
          }`}>
            {charCount} / 280
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setText("")} disabled={!text} className="text-xs border-border/60">
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            navigator.clipboard.writeText(text);
            track("copy_bio", { label: "text" });
            toast({ title: "Copied!" });
          }} disabled={!text} className="text-xs border-border/60">
            <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Hash, label: "Characters", value: charCount.toLocaleString() },
            { icon: Type, label: "Words", value: wordCount.toLocaleString() },
            { icon: AlignLeft, label: "Lines", value: lineCount.toLocaleString() },
            { icon: Clock, label: "Read time", value: `${readingTime} min` },
          ].map(({ icon: Ic, label, value }) => (
            <div key={label} className="rounded-xl border border-border/60 bg-card/50 p-4 text-center">
              <Ic className="h-4 w-4 text-muted-foreground mx-auto mb-2" />
              <div className="text-xl font-bold font-mono">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Limit bars */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground/80">Platform Limits</h3>
          {LIMITS.map(({ label, max }) => {
            const pct = Math.min(100, (charCount / max) * 100);
            const barColor = getBarColor(pct, max);
            const over = charCount > max;
            return (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`font-mono font-semibold ${over ? "text-destructive" : pct > 80 ? "text-yellow-500" : "text-green-500"}`}>
                    {charCount} / {max} {over && `(+${charCount - max} over)`}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-200 ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sentences */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground/80">Sentence count: </span>{sentenceCount} &nbsp;·&nbsp;
          <span className="font-medium text-foreground/80">Paragraphs: </span>{text.split(/\n\s*\n/).filter(Boolean).length || 0} &nbsp;·&nbsp;
          <span className="font-medium text-foreground/80">Unique words: </span>{new Set(text.toLowerCase().match(/\b\w+\b/g) ?? []).size}
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This character counter is purpose-built for X (Twitter), showing a real-time progress bar that turns yellow at 250 characters and red at 280. It also counts words, sentences, paragraphs, and unique words — all without sending your text to any server.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Checking tweet length before posting</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Counting words in a writing assignment or article</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Verifying email subject line or meta description length</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Type or paste your text into the input area above — works with any language or content.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Character count, word count, line count, and reading time update instantly as you type.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Watch the colored progress bars for each platform — green means you're within limits, yellow means you're approaching the limit (80%+).</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> A red indicator appears when you exceed a platform's limit, showing exactly how many characters you're over.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Edit your text directly in the input area until it fits, then copy your perfectly sized content.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Social media managers</strong> writing platform-specific posts and needing to stay within character limits.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">SEO professionals</strong> optimizing meta descriptions to the ideal 150–160 character range.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Email marketers</strong> crafting subject lines under 60 characters for full display on mobile devices.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Twitter/X users</strong> drafting tweets and monitoring the 280-character limit in real time.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">LinkedIn users</strong> writing posts within limits and knowing how much shows before the "see more" cutoff.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Developers</strong> testing input validation limits for textarea and input fields in their applications.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Content writers, social media managers, SEO specialists, email marketers, and developers use character counters as part of their daily workflow. Staying within platform character limits is non-negotiable for professional content — exceeding limits means your tweet won't post, your meta description gets truncated, or your email subject disappears on mobile. This tool makes it effortless to monitor and stay within limits while writing, eliminating the frustration of editing after the fact.
          </p>
        </div>

        {/* Why character count matters */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Why character count matters per platform</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Each platform has specific limits that affect how your content is displayed — and the consequences of exceeding them vary. On Twitter/X, posts exceeding 280 characters simply cannot be published. On Google search results, titles over 60 characters get truncated with "..." reducing click-through rates. Email subject lines over 60 characters get cut off on mobile devices where the majority of emails are opened. Meta descriptions over 160 characters get truncated in search results. LinkedIn posts show only the first 210 characters before a "see more" link in the feed.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These limits exist for good reasons — they're calibrated to typical screen sizes and reading patterns. Respecting them ensures your content displays exactly as intended, maximizing engagement and effectiveness.
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "What is the character limit for Twitter/X?", a: "Twitter/X allows 280 characters per tweet for standard accounts. X Premium subscribers get up to 25,000 characters per post for long-form content. Your profile bio is limited to 160 characters, and your display name is limited to 50 characters." },
              { q: "Does this tool count spaces as characters?", a: "Yes by default — spaces count as characters on every major platform. The tool also shows character count without spaces separately so you can see both figures. Most platforms including Twitter count spaces as characters." },
              { q: "What is the ideal meta description length?", a: "150–160 characters is ideal. Google truncates longer descriptions in search results with '...'. Aim for 140–160 characters to ensure full display while still having room to include your primary keyword and a call-to-action." },
              { q: "What is the LinkedIn post character limit?", a: "LinkedIn posts support up to 3,000 characters but only show approximately 210 characters before a 'see more' button in the feed. The most important information should appear in those first 210 characters to capture attention before the reader has to click to expand." },
              { q: "Does character count affect SEO?", a: "Directly for title tags (50–60 characters ideal) and meta descriptions (150–160 characters ideal) — these affect how your page appears in search results. For body content, Google has no strict character or word minimum, but longer, more comprehensive content generally performs better for competitive search terms." },
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
