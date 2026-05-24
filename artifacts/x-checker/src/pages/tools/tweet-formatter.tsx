import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Copy, Trash2, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrack, useToolView } from "@/hooks/use-track";

const CHAR_LIMIT = 280;

function splitIntoTweets(text: string, limit: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const tweets: string[] = [];
  let current = "";

  for (const word of words) {
    const separator = current ? " " : "";
    const candidate = current + separator + word;
    if (candidate.length <= limit - 6) {
      current = candidate;
    } else {
      if (current) tweets.push(current.trim());
      current = word;
    }
  }
  if (current.trim()) tweets.push(current.trim());

  return tweets.map((t, i) => `${t} ${i + 1}/${tweets.length}`);
}

const faqs = [
  { q: "What is a tweet thread?", a: "A tweet thread is a series of connected tweets from the same account. Each tweet in the thread is a reply to the previous one, creating a chain. Threads are used to share longer stories, explanations, or content that exceeds the 280-character limit." },
  { q: "How do I post a tweet thread?", a: "On Twitter/X, click the '+' button after typing your first tweet to add another tweet to the thread before posting. Alternatively, post the first tweet, then reply to it with the next tweet in the series. This tool helps you prepare all the text in advance." },
  { q: "What does the tweet numbering (1/5) mean?", a: "The format '1/5' means 'tweet 1 of 5 total'. This is a common convention to help readers know they're in a thread and how many tweets to expect. Our formatter automatically appends this numbering." },
  { q: "Can I remove the tweet numbers?", a: "The formatter adds tweet numbers (1/3, 2/3, etc.) by default since they're a standard thread convention. If you prefer no numbers, you can manually edit each tweet after copying." },
  { q: "What is the character limit for Twitter threads?", a: "Each individual tweet in a thread still has a 280-character limit. Twitter Blue / X Premium users have a 25,000-character limit per tweet. This formatter defaults to 280 characters, leaving 6 characters for the numbering (e.g., ' 3/10')." },
  { q: "Is there a limit to how many tweets a thread can have?", a: "Twitter doesn't publish a strict limit on thread length, but very long threads (25+ tweets) often see sharply declining engagement. For best results, keep threads to 5-15 tweets and make every tweet count." },
];

const relatedTools = [
  { title: "Character Counter", href: "/tools/character-counter", description: "Count characters in real time against Twitter's limits." },
  { title: "Hashtag Formatter", href: "/tools/hashtag-formatter", description: "Convert words to properly formatted #hashtags." },
  { title: "Twitter Font Preview", href: "/tools/font-preview", description: "Preview text in Unicode font styles." },
  { title: "Bio Generator", href: "/tools/bio-ideas", description: "Generate Twitter bio ideas for any niche." },
];

const EXAMPLE = `Twitter threads are one of the best ways to share long-form content on X. Instead of writing a blog post that nobody reads, you can break your ideas into connected tweets that people will actually engage with.

The key to a great thread is having a strong opening tweet that makes people want to keep reading. Your first tweet should hook the reader immediately.

End with a clear takeaway or call to action. Ask a question, share a resource, or tell people what to do next. Threads that end with engagement prompts get significantly more replies and retweets.`;

export default function TweetFormatter() {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const track = useTrack("tweet-formatter");
  useToolView("tweet-formatter");

  const tweets = input.trim() ? splitIntoTweets(input, CHAR_LIMIT) : [];

  const loadExample = () => {
    setInput(EXAMPLE);
    track("format_tweet", { label: "example" });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(tweets.join("\n\n---\n\n"));
    track("copy_tweet", { label: "all", value: tweets.length });
    toast({ title: "All tweets copied!", description: `${tweets.length} tweets copied as a block.` });
  };

  const copyTweet = (tweet: string, idx: number) => {
    navigator.clipboard.writeText(tweet);
    track("copy_tweet", { label: "single", value: idx + 1 });
    toast({ title: "Copied!", description: "Tweet copied to clipboard." });
  };

  return (
    <MiniToolLayout
      seoTitle="Tweet Thread Formatter — Split Long Text into Twitter Threads"
      seoDescription="Automatically split long text into a numbered tweet thread. Each tweet stays under 280 characters. Perfect for creating Twitter threads from articles or notes."
      icon={MessageSquare}
      badge="Free Tool"
      title="Tweet Thread Formatter"
      description="Paste any long text and automatically split it into a numbered tweet thread. Each tweet is kept under 280 characters with thread numbering (1/5, 2/5, etc.) added automatically."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="scheduling"
    >
      <div className="space-y-5">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Long Text Input</label>
            <button onClick={loadExample} className="text-xs text-primary hover:underline">Load example</button>
          </div>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your long text, article draft, or notes here. It will be split into a numbered tweet thread automatically..."
            className="min-h-[180px] text-sm bg-background/60 border-border/60 resize-y focus-visible:ring-primary/40"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{input.length} characters · {input.trim() ? input.trim().split(/\s+/).length : 0} words</span>
            <Button variant="outline" size="sm" onClick={() => setInput("")} disabled={!input} className="text-xs border-border/60 h-7">
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
            </Button>
          </div>
        </div>

        {/* Output */}
        {tweets.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Thread Preview</h3>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/8">
                  {tweets.length} tweet{tweets.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={copyAll} className="text-xs border-border/60 h-7">
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy All
              </Button>
            </div>
            <div className="space-y-3">
              {tweets.map((tweet, i) => (
                <div key={i} className="group relative rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/25 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary font-mono">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed text-foreground">{tweet}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs font-mono ${tweet.length > 270 ? "text-yellow-500" : "text-muted-foreground/60"}`}>
                          {tweet.length} / {CHAR_LIMIT} chars
                        </span>
                        <button
                          onClick={() => copyTweet(tweet, i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" /> Thread tips
          </h3>
          <ul className="space-y-1">
            {[
              "Open with your strongest insight or a compelling hook.",
              "Each tweet should deliver value on its own.",
              "End the thread with a question or CTA to boost replies.",
              "Add hashtags to the last tweet for discoverability.",
            ].map((tip, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This tweet thread formatter takes long-form text and automatically splits it into numbered tweets that each fit within X's 280-character limit. It respects word boundaries so words are never cut in the middle, and numbers each tweet (1/n, 2/n…) to preserve thread context.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Turning a long blog post excerpt or essay into a tweetstorm</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Converting speaking notes or outlines into numbered thread tweets</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Formatting listicles and tips as readable tweet threads</li>
          </ul>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-0.5">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Verify accounts before posting</p>
            <p className="text-xs text-muted-foreground">
              Verify accounts: <a href="/tools/x-account-checker" className="text-primary hover:underline font-medium">X Account Checker →</a>
            </p>
          </div>
        </div>

        {/* Expanded SEO content */}
        <div className="space-y-8 pt-2">

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">What is a tweet thread?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A tweet thread is a series of connected tweets published sequentially from the same account, each one replying to the one before it. Threads allow creators, writers, and thought leaders to share long-form content — essays, tutorials, stories, arguments, or listicles — within a platform designed for short posts. Because X limits individual tweets to 280 characters, threads have become the primary way to communicate complex ideas while still benefiting from X's discovery features like the algorithm, hashtags, and retweets.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Threads are numbered to help readers orient themselves — the convention "1/" at the end of the first tweet signals that more follows. The numbering also makes it easy to reference a specific point ("great point in tweet 4"). Well-crafted threads routinely outperform single tweets in engagement, because each tweet in the thread is a fresh opportunity to be liked, retweeted, or replied to, and threads keep readers on the page longer — a signal the X algorithm rewards with broader distribution.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">How to write viral tweet threads</h2>
            <ol className="space-y-3 text-sm text-muted-foreground list-none">
              <li className="flex items-start gap-3"><span className="text-primary font-bold font-mono mt-0.5 w-5 shrink-0">1.</span> <span><strong className="text-foreground/80">Start with an irresistible hook.</strong> Your first tweet is everything — it's the only one people see before deciding to read on. Lead with a bold claim, a surprising statistic, a counter-intuitive statement, or a compelling question. Weak openings kill great threads before they start.</span></li>
              <li className="flex items-start gap-3"><span className="text-primary font-bold font-mono mt-0.5 w-5 shrink-0">2.</span> <span><strong className="text-foreground/80">Make every tweet standalone-valuable.</strong> Readers often enter threads mid-stream from a retweet. Each tweet should deliver a complete thought — not a sentence that only makes sense in context. If tweet 5 is meaningless alone, rewrite it.</span></li>
              <li className="flex items-start gap-3"><span className="text-primary font-bold font-mono mt-0.5 w-5 shrink-0">3.</span> <span><strong className="text-foreground/80">Use short sentences and white space.</strong> Dense walls of text feel exhausting on mobile. Break your ideas into punchy sentences. One idea per tweet is better than three squeezed in. Readers scan before they read.</span></li>
              <li className="flex items-start gap-3"><span className="text-primary font-bold font-mono mt-0.5 w-5 shrink-0">4.</span> <span><strong className="text-foreground/80">Keep threads to 5–15 tweets.</strong> Engagement drops sharply after the 10th tweet for most topics. Unless you're telling a story that genuinely requires more, tighten your thread. Quality over quantity always wins on X.</span></li>
              <li className="flex items-start gap-3"><span className="text-primary font-bold font-mono mt-0.5 w-5 shrink-0">5.</span> <span><strong className="text-foreground/80">End with a clear call to action.</strong> The final tweet is your second most important one. Ask a question to spark replies, summarize the key takeaway, link to a deeper resource, or invite people to retweet tweet 1 to share the thread. Don't just stop — land the plane.</span></li>
              <li className="flex items-start gap-3"><span className="text-primary font-bold font-mono mt-0.5 w-5 shrink-0">6.</span> <span><strong className="text-foreground/80">Post at your audience's peak time.</strong> Threads need early momentum. Post when your followers are most active, then engage with every reply in the first hour. The algorithm prioritizes threads that spark fast engagement, compounding their reach exponentially.</span></li>
            </ol>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-5">
            <h2 className="text-lg font-semibold">Tweet thread examples by category</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-background/40 p-4 space-y-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">Lesson / Tutorial thread</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "I learned CSS Grid in a weekend. Here's everything that actually clicked, condensed into 8 tweets: 🧵 1/8"<br />
                  → Each tweet covers one concept (fr units, auto-fill, named areas…)<br />
                  → Final tweet: "Save this thread. Share it with someone learning CSS."
                </p>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/40 p-4 space-y-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">Story / Case study thread</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "Two years ago I was $40k in debt with no clients. Today I crossed $200k in revenue. Here's the exact turning point: 🧵 1/10"<br />
                  → Thread narrates the journey with specific numbers and decisions<br />
                  → Final tweet: "What changed everything? One habit I'll share in my next thread."
                </p>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/40 p-4 space-y-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">Opinion / Contrarian take thread</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "Hot take: Productivity apps make you less productive. I have receipts. 🧵 1/6"<br />
                  → Each tweet backs up the claim with evidence or logic<br />
                  → Final tweet: "The best productivity system is the one you don't have to manage."
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Character limit guide for X / Twitter</h2>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground/80">Content type</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground/80">Limit</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground/80">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    { type: "Standard tweet", limit: "280 chars", note: "Default for all free accounts" },
                    { type: "X Premium tweet", limit: "25,000 chars", note: "Long-form posts for paid subscribers" },
                    { type: "URLs (any length)", limit: "23 chars", note: "X counts all URLs as 23 characters" },
                    { type: "Emoji", limit: "2 chars each", note: "Most emoji count as 2 characters" },
                    { type: "Username @mention", limit: "Varies", note: "Counts toward the 280-char limit" },
                    { type: "Display name", limit: "50 chars", note: "Shown on your profile, not @handle" },
                    { type: "Bio", limit: "160 chars", note: "Profile description under your name" },
                  ].map((row, i) => (
                    <tr key={row.type} className={`border-b border-border/40 ${i % 2 === 0 ? "bg-background/20" : ""}`}>
                      <td className="px-4 py-2.5 font-medium text-foreground/80">{row.type}</td>
                      <td className="px-4 py-2.5 font-mono text-primary">{row.limit}</td>
                      <td className="px-4 py-2.5 text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">What is a Tweet Thread Formatter?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A tweet thread formatter helps you split long-form content into properly sized tweet chunks that fit within Twitter/X's 280 character limit. Instead of manually counting characters and splitting text, our formatter does it automatically — preserving word boundaries and adding thread numbering so your audience can follow along easily.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tweet threads are one of the most powerful formats on Twitter/X for sharing in-depth knowledge, stories, and tutorials. Studies show that threads get 3–5× more engagement than single tweets because they keep readers scrolling and interacting with each tweet in the series.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Tweet Thread Best Practices</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The best tweet threads follow a simple structure: hook → context → main points → conclusion → CTA. Your opening tweet is the most important — if it doesn't grab attention, nobody reads the rest. Use numbers, strong opinions, or counterintuitive ideas to make people stop scrolling.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Threads between 5–15 tweets perform best. Too short and you don't provide enough value. Too long and you lose readers before the end. Aim for the sweet spot where every tweet adds value and builds on the previous one.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Who Uses Tweet Thread Formatters?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Content creators sharing knowledge and tutorials</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Founders building in public and sharing product updates</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Marketers repurposing long-form content for Twitter</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Writers sharing stories and essays in thread format</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Educators breaking down complex topics into digestible steps</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Journalists covering breaking news in real time</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "What is the Twitter/X character limit?", a: "Twitter/X allows 280 characters per tweet for standard accounts. Twitter Blue/X Premium subscribers get up to 25,000 characters per tweet." },
                { q: "How do I number my tweet thread?", a: "Common formats are \"1/\", \"1/10\", or \"(1)\" at the start or end of each tweet. Our formatter adds numbering automatically so you don't have to count or label manually." },
                { q: "How long should a tweet thread be?", a: "5–15 tweets is the sweet spot. Threads under 5 tweets feel incomplete. Over 15 tweets lose most readers before the end — engagement drops sharply after tweet 10." },
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
