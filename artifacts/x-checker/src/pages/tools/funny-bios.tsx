import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smile, Copy, Wand2, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrack, useToolView } from "@/hooks/use-track";

type AiStyle = "sarcastic" | "self-deprecating" | "witty" | "random";
type Category = "sarcastic" | "relatable" | "witty" | "self-aware";
type FilterCategory = "all" | Category;

interface BioItem { text: string; category: Category; }

const FUNNY_BIOS: BioItem[] = [
  // Sarcastic (13)
  { text: "Professional overthinker. Amateur everything else.", category: "sarcastic" },
  { text: "I put the 'pro' in procrastination.", category: "sarcastic" },
  { text: "Fluent in sarcasm, English, and song lyrics.", category: "sarcastic" },
  { text: "Not lazy, just on energy saving mode.", category: "sarcastic" },
  { text: "My hobbies include eating and complaining about being full.", category: "sarcastic" },
  { text: "I'm not arguing, I'm just explaining why I'm right.", category: "sarcastic" },
  { text: "5'11 but I tell people I'm 6'0. Just kidding, I'm 5'11.", category: "sarcastic" },
  { text: "Currently pretending to be a functioning adult.", category: "sarcastic" },
  { text: "Professionally average since birth.", category: "sarcastic" },
  { text: "I smile because I have no idea what's going on.", category: "sarcastic" },
  { text: "Currently surviving on caffeine and low expectations.", category: "sarcastic" },
  { text: "Definitely not procrastinating right now.", category: "sarcastic" },
  { text: "I contain multitudes. Most of them tired.", category: "sarcastic" },
  // Relatable (13)
  { text: "Will delete later — said 3 years ago.", category: "relatable" },
  { text: "Here for a good time, not a long time.", category: "relatable" },
  { text: "Sleep. Eat. Tweet. Repeat.", category: "relatable" },
  { text: "Professional napper. Amateur adult.", category: "relatable" },
  { text: "I followed a diet once. It was the worst 20 minutes of my life.", category: "relatable" },
  { text: "My bed is a magical place where I suddenly remember everything I forgot to do.", category: "relatable" },
  { text: "I'm on a seafood diet. I see food and I eat it.", category: "relatable" },
  { text: "Trying to be a rainbow in someone's cloud. Failing spectacularly.", category: "relatable" },
  { text: "Emotionally attached to fictional characters.", category: "relatable" },
  { text: "In a committed relationship with my bed.", category: "relatable" },
  { text: "Powered by anxiety and iced coffee.", category: "relatable" },
  { text: "Living proof that googling symptoms is a terrible idea.", category: "relatable" },
  { text: "Trying to find the Wi-Fi password of life.", category: "relatable" },
  // Witty (13)
  { text: "404: Bio not found.", category: "witty" },
  { text: "I'm not weird, I'm limited edition.", category: "witty" },
  { text: "CEO of doing things tomorrow.", category: "witty" },
  { text: "Spreading smiles and occasionally Wi-Fi passwords.", category: "witty" },
  { text: "I speak fluent Netflix.", category: "witty" },
  { text: "Part-time genius, full-time disaster.", category: "witty" },
  { text: "Making mistakes so you don't have to.", category: "witty" },
  { text: "Currently starring in my own reality show: 'How Did I Get Here?'", category: "witty" },
  { text: "Technically an adult. Emotionally, still loading.", category: "witty" },
  { text: "Expert at starting things. Terrible at finishing.", category: "witty" },
  { text: "Too caffeinated to care.", category: "witty" },
  { text: "My hobbies include misreading social cues.", category: "witty" },
  { text: "Overthinking is just cardio for the brain. I'm very fit.", category: "witty" },
  // Self-Aware (13)
  { text: "Please lower your expectations.", category: "self-aware" },
  { text: "Warning: contains traces of sarcasm.", category: "self-aware" },
  { text: "I'm the person your mother warned you about.", category: "self-aware" },
  { text: "Professionally confused since [birth year].", category: "self-aware" },
  { text: "Trying to adult. It's not going well.", category: "self-aware" },
  { text: "I never finish anyth—", category: "self-aware" },
  { text: "Works best when left alone.", category: "self-aware" },
  { text: "Not a morning person. Or an afternoon person. Or an evening person.", category: "self-aware" },
  { text: "Professionally mediocre. Personally chaotic.", category: "self-aware" },
  { text: "Still figuring it out. Updates pending.", category: "self-aware" },
  { text: "My vibe is 'accidentally showed up to the wrong meeting'.", category: "self-aware" },
  { text: "Existing loudly despite all odds.", category: "self-aware" },
  { text: "Currently accepting applications for someone who has their life together.", category: "self-aware" },
];

const CATEGORY_LABELS: Record<FilterCategory, string> = {
  all: "All",
  sarcastic: "Sarcastic",
  relatable: "Funny & Relatable",
  witty: "Witty",
  "self-aware": "Self-Aware",
};

const AI_STYLES: { id: AiStyle; label: string }[] = [
  { id: "sarcastic", label: "Sarcastic" },
  { id: "self-deprecating", label: "Self-Deprecating" },
  { id: "witty", label: "Witty" },
  { id: "random", label: "Random" },
];

const faqs = [
  { q: "Can a funny Twitter bio help me get more followers?", a: "Yes! Humor is one of the strongest bio strategies for building a personality-driven audience. A witty bio makes you memorable and gives people a reason to follow." },
  { q: "How do I make my Twitter bio funny?", a: "The most effective techniques are: self-deprecating humor, subverting expectations, understatement, and absurdism. Keep it short — punchlines land better when concise." },
  { q: "Should a funny bio also include professional info?", a: "It depends on your goal. If you're building a personal brand, include a brief professional note alongside the humor (e.g., 'Software engineer by day, chaos agent by night')." },
  { q: "What are the best funny Twitter bios?", a: "The best funny bios are relatable, short, and feel authentic. They often play on universal experiences: being tired, procrastinating, loving food, or struggling with adult responsibilities." },
  { q: "How many characters is the Twitter bio limit?", a: "Twitter limits bios to 160 characters. Most of these funny bios are well under that limit, giving you room to add your own details, emojis, or location." },
  { q: "How does the AI funny bio generator work?", a: "Enter your niche or personality, pick a humor style, and click Generate. The AI writes 3 original funny bios tailored to you — no clichés, no filler." },
];

const relatedTools = [
  { title: "AI Bio Generator", href: "/tools/bio-generator", description: "Generate 3 personalized bios using AI." },
  { title: "Bio Ideas Generator", href: "/tools/bio-generator", description: "Bio templates for developers, marketers, creators and more." },
  { title: "Username Generator", href: "/tools/username-generator", description: "Generate unique username ideas for any niche." },
  { title: "Aesthetic Bio Ideas", href: "/tools/bio-generator", description: "Aesthetic bios with Unicode symbols and emojis." },
];

export default function FunnyBios() {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [niche, setNiche] = useState("");
  const [aiStyle, setAiStyle] = useState<AiStyle>("sarcastic");
  const [generating, setGenerating] = useState(false);
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();
  const track = useTrack("funny-bios");
  useToolView("funny-bios");

  const filtered = filter === "all" ? FUNNY_BIOS : FUNNY_BIOS.filter(b => b.category === filter);

  const copy = (bio: string, source: string) => {
    navigator.clipboard.writeText(bio);
    track("copy_bio", { label: source });
    toast({ title: "Copied!", description: "Bio copied to clipboard." });
  };

  const generateBios = async () => {
    if (!niche.trim()) {
      toast({ title: "Enter your niche first", variant: "destructive" });
      return;
    }
    setGenerating(true);
    setGeneratedBios([]);
    setAiError(null);
    track("generate_bio", { style: aiStyle });
    try {
      const res = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: niche.trim(), tone: `funny-${aiStyle}` }),
      });
      let data: { bios?: string[]; error?: string } = {};
      try { data = await res.json() as typeof data; } catch { /* non-json */ }
      if (res.status === 429) { setAiError("Too many requests. Please wait a moment and try again."); return; }
      if (!res.ok) { setAiError("AI service temporarily unavailable. Please try again."); return; }
      setGeneratedBios(data.bios ?? []);
    } catch {
      setAiError("AI service temporarily unavailable. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <MiniToolLayout
      seoTitle="Funny Twitter Bio Ideas (2026) — 50+ Bios & AI Generator | X Toolkit"
      seoDescription="Browse 50+ funny Twitter/X bio ideas — sarcastic, witty and self-deprecating. Generate custom funny bios with AI. Free, no signup."
      seoKeywords="funny twitter bios, funny x bios, funny bio ideas, funny twitter bio generator, witty twitter bios, sarcastic twitter bio, funny bio for twitter, funny bios 2026, twitter bio funny, funniest twitter bios, self deprecating twitter bio, relatable twitter bio"
      icon={Smile}
      badge="50+ Examples"
      title="Funny Twitter/X Bio Ideas (2026)"
      description="Browse 50+ genuinely funny, ready-to-use bios — sarcastic, witty, relatable, and self-aware. Or generate a custom funny bio with AI. Click any bio to copy instantly."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="scheduling"
    >
      <div className="space-y-6">

        {/* AI Generator */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">AI Funny Bio Generator</h2>
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">AI</Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Your niche or personality</label>
              <input
                id="niche-input"
                name="niche-input"
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") void generateBios(); }}
                placeholder="e.g. developer, foodie, gym rat, student"
                className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Humor style</label>
              <select
                value={aiStyle}
                onChange={(e) => setAiStyle(e.target.value as AiStyle)}
                className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {AI_STYLES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={() => void generateBios()}
            disabled={generating || !niche.trim()}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {generating ? "Generating…" : "Generate Funny Bios"}
          </Button>

          {aiError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">{aiError}</p>
            </div>
          )}

          {generatedBios.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Generated Bios</p>
              {generatedBios.map((bio, i) => (
                <button
                  key={i}
                  onClick={() => copy(bio, "ai-generated")}
                  className="w-full text-left group flex items-start gap-3 rounded-xl border border-primary/20 bg-background/60 p-4 hover:border-primary/40 hover:bg-card transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">{bio}</p>
                    <span className="text-[10px] font-mono text-muted-foreground/50 mt-1 block">{bio.length}/160 chars</span>
                  </div>
                  <Copy className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as FilterCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
              }`}
            >
              {CATEGORY_LABELS[cat]}{" "}
              {cat === "all"
                ? `(${FUNNY_BIOS.length})`
                : `(${FUNNY_BIOS.filter(b => b.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Bio grid */}
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((bio, i) => (
            <button
              key={i}
              onClick={() => copy(bio.text, bio.category)}
              className="text-left group flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/30 hover:bg-card transition-all cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">{bio.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] border-border/40 text-muted-foreground capitalize">
                    {CATEGORY_LABELS[bio.category]}
                  </Badge>
                  <span className="text-[10px] font-mono text-muted-foreground/50">{bio.text.length}/160</span>
                </div>
              </div>
              <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/70 text-center">
          Click any bio to copy it instantly · {filtered.length} bios shown
        </p>

        {/* Guide section — SEO content */}
        <div className="space-y-6 pt-4 border-t border-border/40">

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">How to Write a Funny Twitter/X Bio</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your Twitter/X bio is the first thing people read when they land on your profile. A funny bio instantly signals personality, makes you memorable, and gives people a concrete reason to hit Follow. But writing humor in 160 characters is harder than it looks. Here are the techniques that actually work.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">1. Use the Rule of Three</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                List two normal things, then break the pattern with something absurd. "Sleep. Eat. Tweet. Repeat." works because the rhythm is satisfying and the loop is relatable. "Software engineer by day, professional overthinker by night, asleep by 9pm" follows the same structure.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">2. Subvert Expectations</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Set up a serious-sounding start, then undercut it. "CEO of doing things tomorrow" works because CEO sounds impressive — until you read what the company does. The surprise is the punchline. "Spreading smiles and occasionally Wi-Fi passwords" does the same thing.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">3. Be Specific, Not Vague</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Funny person" is not funny. Specific details are. "I followed a diet once. It was the worst 20 minutes of my life." is funny because of the specificity — 20 minutes. The precision makes it feel true, and truth makes humor land. Specificity is the difference between a shrug and a laugh.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">4. Self-Deprecation Builds Trust</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Poking fun at yourself signals confidence and approachability. "Please lower your expectations" is funny because it's disarmingly honest. People trust accounts that don't take themselves too seriously. Self-aware humor is also safe — you're the subject, so no one gets offended.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">5. Reference Universal Experiences</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The funniest bios tap into things everyone has felt: procrastinating, being tired, loving food, hating mornings, doom-scrolling. "My bed is a magical place where I suddenly remember everything I forgot to do" is relatable to virtually anyone. Relatability = shares and follows.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">6. Keep It Under 160 Characters</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Twitter enforces a 160-character bio limit. Punchlines work best when tight — every word should earn its place. Read your bio out loud. If you stumble anywhere, cut that part. The bios in this collection are all well under the limit, leaving room for emojis, location, or a link.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Which Style of Funny Bio Works Best in 2026?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on what performs well on X in 2026, <strong className="text-foreground">self-aware and sarcastic bios</strong> consistently generate the most profile engagement. Audiences have grown tired of hustle-culture bios stuffed with titles and achievements. A bio that says "Professionally confused since birth" stands out far more than "🚀 Founder | Speaker | Investor."
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Witty one-liners</strong> work best for creators, developers, and anyone building a personal brand — they communicate personality in seconds. <strong className="text-foreground">Relatable humor</strong> works best for lifestyle, food, and entertainment accounts because the audience connection is immediate. <strong className="text-foreground">Self-deprecating bios</strong> are safest across all niches since they never risk punching at others.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you're unsure which direction to take, use the AI generator above. Enter your niche or personality type, pick a humor style, and get three original options tailored to you — no generic templates, no filler phrases.
            </p>
          </div>

        </div>
      </div>
    </MiniToolLayout>
  );
}
