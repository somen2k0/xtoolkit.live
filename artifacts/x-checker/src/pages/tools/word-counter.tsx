import { useState, useMemo } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { AdSlot } from "@/components/AdSlot";
import { Copy, Trash2, AlignLeft } from "lucide-react";

const PLATFORMS = [
  { name: "Twitter / X", limit: 280, color: "bg-blue-500" },
  { name: "LinkedIn Post", limit: 3000, color: "bg-sky-600" },
  { name: "Instagram Caption", limit: 2200, color: "bg-pink-500" },
  { name: "Meta Description", limit: 160, color: "bg-green-500" },
  { name: "Email Subject", limit: 60, color: "bg-orange-500" },
];

function getTopWords(text: string, n = 5): { word: string; count: number }[] {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  const STOP = new Set(["the", "and", "that", "this", "with", "for", "are", "was", "not", "you", "have", "from", "they", "will", "been", "were", "your", "all", "can", "but", "one", "his", "her", "our", "who", "its", "had", "she", "him", "has"]);
  const freq: Record<string, number> = {};
  for (const w of words) { if (!STOP.has(w)) freq[w] = (freq[w] ?? 0) + 1; }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, n).map(([word, count]) => ({ word, count }));
}

const faqs = [
  { q: "How is reading time calculated?", a: "Reading time is estimated at 238 words per minute, which is the average adult reading speed. The estimate is displayed in minutes and rounds up to the nearest half-minute." },
  { q: "What counts as a sentence?", a: "Sentences are counted by detecting common sentence-ending punctuation: periods, question marks, and exclamation marks followed by a space or end of text." },
  { q: "Is my text stored anywhere?", a: "No. All counting happens instantly in your browser. Nothing is sent to any server." },
  { q: "What is keyword density?", a: "Keyword density shows the most frequently used words in your text (excluding common stop words). It's useful for SEO copywriting to see which terms dominate your content." },
];

const relatedTools = [
  { title: "Character Counter", href: "/tools/character-counter", description: "Count characters optimized for X's 280-char limit." },
  { title: "Hashtag Formatter", href: "/tools/hashtag-formatter", description: "Clean and deduplicate hashtag lists." },
  { title: "Tweet Thread Formatter", href: "/tools/tweet-formatter", description: "Split long text into numbered tweet threads." },
];

export default function WordCounter() {
  useToolView("word-counter");
  const { toast } = useToast();
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = (text.match(/[.!?](?:\s|$)/g) ?? []).length || (text.trim() ? 1 : 0);
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const readingMin = Math.ceil((words.length / 238) * 2) / 2;
    return { words: words.length, charsWithSpaces, charsNoSpaces, sentences, paragraphs, readingMin };
  }, [text]);

  const topWords = useMemo(() => getTopWords(text), [text]);

  const copyStats = () => {
    const s = `Words: ${stats.words}\nCharacters (with spaces): ${stats.charsWithSpaces}\nCharacters (no spaces): ${stats.charsNoSpaces}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nReading Time: ~${stats.readingMin} min`;
    navigator.clipboard.writeText(s);
    toast({ title: "Copied!", description: "Stats copied to clipboard." });
  };

  return (
    <MiniToolLayout
      seoTitle="Word Counter — Free Online Word & Character Count | X Toolkit"
      seoDescription="Count words, characters, sentences, and paragraphs in real time. Free online word counter for writers, students, and social media. No signup."
      icon={AlignLeft}
      title="Word & Character Counter"
      description="Count words, characters, sentences, and paragraphs in real time with platform limits."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />
      <div className="space-y-6">
        {/* Textarea */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Your Text</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyStats} disabled={!text} className="text-xs border-border/60">
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Stats
              </Button>
              <Button variant="outline" size="sm" onClick={() => setText("")} disabled={!text} className="text-xs border-border/60">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear
              </Button>
            </div>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here…"
            rows={8}
            className="resize-y min-h-[160px] bg-background/60 border-border/60 focus-visible:ring-primary/40 text-sm font-mono"
          />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Words", value: stats.words.toLocaleString() },
            { label: "Characters (with spaces)", value: stats.charsWithSpaces.toLocaleString() },
            { label: "Characters (no spaces)", value: stats.charsNoSpaces.toLocaleString() },
            { label: "Sentences", value: stats.sentences.toLocaleString() },
            { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
            { label: "Reading Time", value: stats.words === 0 ? "—" : `~${stats.readingMin} min` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border/60 bg-card/60 p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-mono">{value}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Platform limits */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5 space-y-4">
          <h2 className="text-sm font-semibold">Platform Character Limits</h2>
          <div className="space-y-3">
            {PLATFORMS.map(({ name, limit, color }) => {
              const pct = Math.min((stats.charsWithSpaces / limit) * 100, 100);
              const isYellow = pct >= 80 && pct < 100;
              const isRed = pct >= 100;
              const barColor = isRed ? "bg-destructive" : isYellow ? "bg-yellow-500" : color;
              return (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{name}</span>
                    <span className={`font-mono font-semibold ${isRed ? "text-destructive" : isYellow ? "text-yellow-500" : "text-foreground"}`}>
                      {stats.charsWithSpaces} / {limit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keyword density */}
        {topWords.length > 0 && (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5 space-y-3">
            <h2 className="text-sm font-semibold">Top Keywords</h2>
            <div className="space-y-2">
              {topWords.map(({ word, count }, i) => (
                <div key={word} className="flex items-center gap-3 text-sm">
                  <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                  <span className="flex-1 font-medium">{word}</span>
                  <span className="text-muted-foreground text-xs">{count}×</span>
                  <span className="text-xs text-muted-foreground">({stats.words > 0 ? ((count / stats.words) * 100).toFixed(1) : 0}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This word and character counter provides real-time stats as you type or paste text — word count, character count with and without spaces, sentence count, paragraph count, and estimated reading time. It's built for writers, students, bloggers, and social media managers.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The platform limits bar shows at a glance whether your content fits within Twitter/X, LinkedIn, Instagram, Meta description, or email subject line limits — turning yellow at 80% and red when you exceed the limit.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Checking a social media caption or ad copy fits platform limits</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Estimating reading time for articles, essays, or newsletters</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Analyzing keyword density in SEO content</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Paste or type your text into the input area — works with any language or content type.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Word count, character count, sentence count, and paragraph count update instantly as you type.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Check the colored progress bars for platform-specific limits — green means within limits, yellow means approaching, red means over.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> View the top keywords section to see which words appear most frequently in your text.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Use "Copy Stats" to copy all metrics as plain text for reporting, sharing, or documentation.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Writers and bloggers</strong> checking article or essay word counts to meet editorial requirements.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Social media managers</strong> staying within platform character limits before posting.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Students</strong> verifying essay length requirements and reading time estimates for assignments.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">SEO writers</strong> hitting minimum word count targets for competitive search rankings.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Email marketers</strong> optimizing subject line length for maximum open rates on mobile devices.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Copywriters</strong> analyzing keyword density to ensure balanced, natural content for SEO.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Students, bloggers, content writers, social media managers, copywriters, and SEO professionals all rely on word counting tools daily. Any professional who creates written content needs to know character and word counts — whether for platform limits, client requirements, or SEO targets. Academic writers use it to hit exact word counts required for essays and reports. Journalists use it to match editorial space requirements. The tool is also popular with non-native English speakers who write in English and want to accurately gauge the length of their content.
          </p>
        </div>

        {/* Platform limits and SEO */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Platform character limits explained</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Different platforms have strict character limits that directly affect how your content appears. Twitter/X allows 280 characters per tweet — exceeding this means you can't post. LinkedIn posts support up to 3,000 characters but only show the first 210 before a "see more" button in the feed. Instagram captions allow 2,200 characters but only display the first 125 in the feed. Email subject lines should stay under 60 characters to display fully on mobile devices, where over 60% of emails are now opened. Meta descriptions should be 150–160 characters for full display in Google search results.
          </p>
          <h3 className="text-sm font-semibold text-foreground/80">Word count and SEO</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Word count is one of many factors that can influence search rankings. While Google doesn't have a minimum word count requirement, studies consistently show that longer, more comprehensive content tends to rank better for competitive keywords. Most SEO professionals recommend a minimum of 1,000 words for blog posts targeting competitive keywords, and 300+ words for all indexed pages. Quality matters more than quantity — every word should add value for the reader.
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "What is the character limit for Twitter/X?", a: "Twitter/X allows 280 characters per tweet for standard accounts. Twitter Blue/X Premium subscribers can post up to 25,000 characters in long-form posts. Your profile bio is limited to 160 characters separately." },
              { q: "Does this tool count spaces as characters?", a: "Yes, the default character count includes spaces — which matches how most platforms count characters. The tool also shows 'characters without spaces' separately so you can see both figures at once." },
              { q: "What is the ideal meta description length?", a: "Google typically displays meta descriptions up to 155–160 characters. Descriptions longer than this get truncated with '...' in search results, which can reduce click-through rates. Aim for 140–160 characters and include your primary keyword naturally." },
              { q: "How many words should a blog post have?", a: "For SEO purposes, aim for 1,000–1,500 words for competitive topics and 500–800 words for less competitive long-tail keywords. Quality matters more than quantity — every word should add value. Very long posts (3,000+ words) often rank well for high-competition terms when they're genuinely comprehensive." },
              { q: "What is reading time and how is it calculated?", a: "Reading time is estimated based on the average adult reading speed of approximately 238 words per minute. A 1,000 word article takes approximately 4 minutes to read at this speed. The estimate rounds up to the nearest half-minute." },
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
