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
  { text: "Professional overthinker. Amateur everything else.", category: "sarcastic" },
  { text: "I put the 'pro' in procrastination.", category: "sarcastic" },
  { text: "Fluent in sarcasm, English, and song lyrics.", category: "sarcastic" },
  { text: "Not lazy, just on energy saving mode.", category: "sarcastic" },
  { text: "My hobbies include eating and complaining about being full.", category: "sarcastic" },
  { text: "I'm not arguing, I'm just explaining why I'm right.", category: "sarcastic" },
  { text: "5'11 but I tell people I'm 6'0. Just kidding, I'm 5'11.", category: "sarcastic" },
  { text: "Currently pretending to be a functioning adult.", category: "sarcastic" },
  { text: "Will delete later — said 3 years ago.", category: "relatable" },
  { text: "Here for a good time, not a long time.", category: "relatable" },
  { text: "Sleep. Eat. Tweet. Repeat.", category: "relatable" },
  { text: "Professional napper. Amateur adult.", category: "relatable" },
  { text: "I followed a diet once. It was the worst 20 minutes of my life.", category: "relatable" },
  { text: "My bed is a magical place where I suddenly remember everything I forgot to do.", category: "relatable" },
  { text: "I'm on a seafood diet. I see food and I eat it.", category: "relatable" },
  { text: "Trying to be a rainbow in someone's cloud. Failing spectacularly.", category: "relatable" },
  { text: "404: Bio not found.", category: "witty" },
  { text: "I'm not weird, I'm limited edition.", category: "witty" },
  { text: "CEO of doing things tomorrow.", category: "witty" },
  { text: "Spreading smiles and occasionally Wi-Fi passwords.", category: "witty" },
  { text: "I speak fluent Netflix.", category: "witty" },
  { text: "Part-time genius, full-time disaster.", category: "witty" },
  { text: "Making mistakes so you don't have to.", category: "witty" },
  { text: "Currently starring in my own reality show: 'How Did I Get Here?'", category: "witty" },
  { text: "Please lower your expectations.", category: "self-aware" },
  { text: "Warning: contains traces of sarcasm.", category: "self-aware" },
  { text: "I'm the person your mother warned you about.", category: "self-aware" },
  { text: "Professionally confused since [birth year].", category: "self-aware" },
  { text: "Trying to adult. It's not going well.", category: "self-aware" },
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
  { title: "Bio Ideas Generator", href: "/tools/bio-ideas", description: "Bio templates for developers, marketers, creators and more." },
  { title: "Professional Bios", href: "/tools/professional-bios", description: "Polished, industry-specific bio templates." },
  { title: "Aesthetic Bio Ideas", href: "/tools/aesthetic-bios", description: "Aesthetic bios with Unicode symbols and emojis." },
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
      seoTitle="Funny Twitter/X Bio Ideas (2025) — 30+ Funny Bios + AI Generator | X Toolkit"
      seoDescription="Browse 30+ funny Twitter/X bio ideas and generate custom funny bios with AI. Sarcastic, witty, and self-deprecating bio templates. Free, no signup required."
      seoKeywords="funny twitter bios, funny x bios, funny bio ideas, funny twitter bio generator, witty twitter bios, sarcastic twitter bio, funny bio for twitter, funny bios 2025, twitter bio funny, funniest twitter bios"
      icon={Smile}
      badge="30+ Examples"
      title="Funny Twitter/X Bio Ideas"
      description="Browse 30+ ready-to-use funny bios organized by style, or generate custom funny bios with AI. Sarcastic, witty, relatable, self-aware — click any bio to copy it instantly."
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
      </div>
    </MiniToolLayout>
  );
}
