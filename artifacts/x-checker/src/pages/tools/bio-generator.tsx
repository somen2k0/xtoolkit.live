import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Copy, RefreshCw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

const FAQS = [
  { q: "Is the AI bio generator really free?", a: "Yes — 100% free, no signup required. It uses Groq's fast LLM API under the hood." },
  { q: "How many bios does it generate?", a: "It generates 3 different bio options each time so you can pick your favourite or mix and match." },
  { q: "Are bios within X's 160-character limit?", a: "Yes — each generated bio is designed to fit within X's 160-character bio limit." },
  { q: "What tone options can I use?", a: "You can enter any tone — professional, witty, minimal, motivational, casual, bold, or anything else." },
  { q: "Can I regenerate if I don't like the results?", a: "Yes — click Regenerate to get 3 new bios with the same topic and tone." },
  { q: "Does my data get stored?", a: "No. Your topic and tone are sent to the API to generate bios and immediately discarded. Nothing is stored." },
];

export default function BioGenerator() {
  const [bioTopic, setBioTopic] = useState("");
  const [bioTone, setBioTone] = useState("");
  const [bios, setBios] = useState<string[]>([]);
  const [bioLoading, setBioLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateBio = async () => {
    if (!bioTopic.trim()) {
      toast({ title: "Enter a topic", description: "Tell us what your bio should be about.", variant: "destructive" });
      return;
    }
    setBioLoading(true);
    setBios([]);
    trackEvent("bio_generate", { label: bioTopic });
    try {
      const res = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: bioTopic, tone: bioTone }),
      });
      // FIXED: AI Bio Generator - graceful error handling for non-JSON and 5xx responses
      let data: { bios?: string[]; error?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON response from server */ }
      if (res.status === 429) {
        toast({ title: "Rate limit reached", description: "Rate limit reached. Please wait 30 seconds and try again.", variant: "destructive" });
        return;
      }
      if (res.status === 503 || !res.ok) {
        toast({ title: "AI service unavailable", description: "AI service temporarily unavailable. Please try again later.", variant: "destructive" });
        return;
      }
      setBios(data.bios ?? []);
    } catch {
      toast({ title: "AI service unavailable", description: "AI service temporarily unavailable. Please try again later.", variant: "destructive" });
    } finally {
      setBioLoading(false);
    }
  };

  return (
    <MiniToolLayout
      seoTitle="AI Bio Generator — Generate X / Twitter Bios Instantly Free"
      seoDescription="Generate 3 professional X (Twitter) bios in seconds with AI. Enter your niche and tone and get ready-to-use bio ideas. Free, no signup required."
      icon={Sparkles}
      badge="AI"
      title="AI Bio Generator"
      description="Generate 3 professional X bios in seconds — just enter your niche and tone. Powered by Groq's fast AI."
      faqs={FAQS}
      affiliateCategory="growth"
      relatedTools={[
        { title: "Funny Bios", href: "/tools/funny-bios", description: "Witty, humorous bio ideas that stand out." },
        { title: "Funny Bios Template Library", href: "/tools/funny-bios", description: "100+ ready-made X bio templates by niche and style." },
        { title: "Username Generator", href: "/tools/username-generator", description: "Generate unique username ideas for X." },
        { title: "Character Counter", href: "/tools/character-counter", description: "Check your bio fits within X's 160-char limit." },
      ]}
    >
      <div className="space-y-5">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">AI Bio Generator</CardTitle>
            <CardDescription>Generate 3 professional X bios in seconds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground/70">What's your niche or topic? <span className="text-destructive">*</span></label>
              <Input
                value={bioTopic}
                onChange={(e) => setBioTopic(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !bioLoading && bioTopic.trim()) handleGenerateBio(); }}
                placeholder="e.g. AI startup founder, fitness coach, crypto trader"
                className="bg-background/60 border-border/60 focus-visible:ring-primary/40 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground/70">Tone (optional)</label>
              <Input
                value={bioTone}
                onChange={(e) => setBioTone(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !bioLoading && bioTopic.trim()) handleGenerateBio(); }}
                placeholder="e.g. professional, witty, minimal, motivational"
                className="bg-background/60 border-border/60 focus-visible:ring-primary/40 text-sm"
              />
            </div>
            <Button onClick={handleGenerateBio} disabled={bioLoading || !bioTopic.trim()} className="w-full shadow-sm shadow-primary/15">
              {bioLoading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…</>
                : <><Sparkles className="h-4 w-4 mr-2" /> Generate Bios</>}
            </Button>
          </CardContent>
        </Card>

        {bios.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {bios.map((bio, i) => (
              <Card key={i} className="border-border/60 bg-card shadow-sm">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Bio {i + 1}</div>
                      <p className="text-sm leading-relaxed">{bio}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-[11px] ${bio.length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                          {bio.length} / 160 chars
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(bio);
                            toast({ title: "Copied!", description: "Bio copied to clipboard." });
                          }}
                          className="text-xs border-border/60 h-7"
                        >
                          <Copy className="h-3 w-3 mr-1.5" /> Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={handleGenerateBio} disabled={bioLoading} className="w-full text-xs border-border/60">
              <RefreshCw className="h-3.5 w-3.5 mr-2" /> Regenerate
            </Button>
          </div>
        )}

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The AI Bio Generator uses a language model to write polished X (Twitter) bios tailored to your role, tone, and keywords. Choose from professional, casual, witty, or creative styles — then regenerate as many times as you like until you find one that fits.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            X bios are capped at 160 characters and are one of the first things people read when deciding whether to follow you — a strong bio significantly improves follow-through rates.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Setting up a new X account and writing your first bio</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Refreshing a stale bio to better reflect your current work</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Ghostwriting bios for clients, founders, or team members</li>
          </ul>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-0.5">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Before you write the bio</p>
            <p className="text-xs text-muted-foreground">
              Check if accounts exist: <a href="/tools/x-account-checker" className="text-primary hover:underline font-medium">X Account Checker →</a>
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Enter your niche or topic — for example, "AI startup founder", "fitness coach", or "freelance designer".</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Optionally add a tone preference: professional, witty, minimal, motivational, casual, bold, or any style you prefer.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Click Generate Bios — the AI processes your inputs in seconds using Groq's Llama 3.3 70B model.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> Get 3 unique AI-written bios instantly, each within X's 160-character limit.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Copy your favorite and paste directly into your Twitter/X profile settings.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">6.</span> Regenerate as many times as you want for free — no limits, no signup required.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">New Twitter/X users</strong> setting up their profile for the first time and unsure what to write.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Professionals</strong> building a personal brand and wanting a bio that reflects their expertise concisely.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Content creators</strong> who need to showcase their niche and attract the right followers.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Businesses</strong> setting up company profiles and needing a concise, professional description.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Anyone refreshing</strong> a stale bio that no longer reflects their current work or interests.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Job seekers</strong> wanting to highlight their expertise and make a strong first impression on recruiters.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our AI bio generator is used by social media managers, entrepreneurs, freelancers, content creators, and professionals across every industry. Anyone who wants a compelling Twitter/X bio without spending hours writing and rewriting uses this tool to get great results in seconds. Social media agencies use it to create bios for entire client rosters at once, while individual creators use it to test different positioning angles before committing to one.
          </p>
        </div>

        {/* Why your Twitter/X bio matters */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Why your Twitter/X bio matters</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your Twitter/X bio is the first thing people see when they visit your profile. You have 160 characters to explain who you are, what you do, and why someone should follow you. A compelling bio increases your follower conversion rate — the percentage of profile visitors who actually hit follow. Studies show that profiles with clear, well-written bios get significantly more followers than those with empty or generic descriptions. Your bio also appears in search results on the platform, making it one of the most important pieces of content on your entire profile.
          </p>
          <h3 className="text-sm font-semibold text-foreground/80">Tips for a great Twitter/X bio</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> State clearly what you do in the first line — don't make people guess.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Include relevant keywords for your niche to appear in platform search results.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Add a touch of personality or humor to make your bio memorable and human.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Include a call to action — "follow for X", "DMs open", or "link in bio".</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Use emojis sparingly for visual appeal — 1–3 emojis max.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Mention notable achievements or credentials that establish instant credibility.</li>
          </ul>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "How does the AI bio generator work?", a: "It uses Groq's Llama 3.3 70B language model to generate contextually relevant, engaging Twitter/X bios based on your niche and tone preferences. Each generation produces 3 unique options so you can choose the best fit or mix elements from multiple results." },
              { q: "Is the bio generator free to use?", a: "Yes, completely free with no signup required. Generate as many bios as you need with no daily limits. There are no credits, no paywalls, and no account required." },
              { q: "Can I use the generated bio directly?", a: "Yes. The generated bios are ready to use. You can copy them directly to your Twitter/X profile or customize them further to add personal details like your location, website, or specific achievements." },
              { q: "How long should a Twitter/X bio be?", a: "Twitter/X allows up to 160 characters for your bio. Our generator creates bios that fit within this limit while maximizing impact. Shorter bios (under 120 characters) often perform better as they're easier to read at a glance and leave room for emojis or symbols." },
              { q: "Can I generate bios for a business account?", a: "Yes. Enter your business type and niche in the input field (e.g. 'SaaS project management tool' or 'local coffee roaster'). The AI will generate professional bios appropriate for business accounts, including company voice and value proposition." },
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
