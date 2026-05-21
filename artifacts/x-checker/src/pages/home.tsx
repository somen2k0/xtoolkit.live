import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ToolCard } from "@/components/ToolCard";
import { CATEGORIES, LIVE_TOOLS, TOTAL_LIVE, getPopularTools, getNewTools, getToolsByCategory, LIVE_TOOLS as ALL_TOOLS } from "@/lib/tools-registry";
import { trackEvent } from "@/lib/analytics";
import { getTopTools, getRecentlyViewed } from "@/hooks/use-local-analytics";
import {
  CheckCircle2, Zap, Shield, Star, ArrowRight, Users,
  TrendingUp, Clock, EyeOff, Mail, Flame,
} from "lucide-react";

const CATEGORY_ORDER: import("@/lib/tools-registry").CategoryKey[] = [
  "social-media",
  "ai-writing",
  "text-formatting",
  "developer",
  "seo",
  "email",
];

const TESTIMONIALS = [
  {
    quote: "Saved me hours of manual checking. I manage 5 brand accounts and needed to bulk-verify a list of 80+ influencers. Done in 10 seconds.",
    name: "Sarah K.",
    role: "Social Media Manager",
    stars: 5,
  },
  {
    quote: "The JSON formatter is exactly what I needed — real-time validation with proper error messages. Way cleaner than pasting into browser devtools.",
    name: "DevMike",
    role: "Web Developer",
    stars: 5,
  },
  {
    quote: "Clean, fast, no signup. I use the bio generator and @ formatter constantly. The Base64 tool saved me when debugging an API last week.",
    name: "XGrowthPro",
    role: "Growth Marketer",
    stars: 5,
  },
];

const FAQS = [
  { q: "Is everything here completely free?", a: "Yes — 100% free, forever. No signup, no credit card, no hidden fees. Every tool works without an account." },
  { q: "How many X accounts can I check at once?", a: "Up to 100 usernames in a single batch, all checked in parallel. Results come back in seconds." },
  { q: "Do the developer tools send my data to a server?", a: "No. The JSON Formatter, Base64 Encoder, and all other developer tools run entirely in your browser. Nothing is sent to a server." },
  { q: "How does the AI bio generator work?", a: "It uses Groq's fast LLM API. Enter your niche and tone and get 3 ready-to-use bios instantly. Provide your own free Groq API key for unlimited generations." },
  { q: "Is my data stored or tracked?", a: "No. We don't store usernames, results, bios, or any personal data. Everything is processed in real-time and immediately discarded." },
  { q: "What new tools are coming?", a: "We're building SEO tools (meta checker, keyword density), more developer utilities (URL encoder, CSS minifier), and creator tools. Subscribe to get notified." },
  { q: "Does this work on mobile?", a: "Yes — every tool is fully responsive and optimized for mobile, tablet, and desktop." },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
      ))}
    </div>
  );
}

const PRIVACY_TOOLS_SPOTLIGHT = [
  { href: "/tools/email-privacy-checker",  label: "Email Privacy Checker",  desc: "Score your address across 7 privacy factors", icon: EyeOff,   color: "text-purple-400",  bg: "bg-purple-400/10 border-purple-400/20" },
  { href: "/tools/masked-email-generator", label: "Masked Email Generator",  desc: "Create anonymous email aliases in seconds",  icon: Mail,    color: "text-cyan-400",    bg: "bg-cyan-400/10 border-cyan-400/20" },
  { href: "/tools/spam-risk-checker",      label: "Spam Risk Checker",       desc: "Find out if your email triggers spam filters", icon: Shield, color: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20" },
  { href: "/tools/email-leak-checker",     label: "Email Leak Checker",      desc: "Check if your email address is exposed",     icon: Flame,   color: "text-red-400",     bg: "bg-red-400/10 border-red-400/20" },
];

function useScrollFade(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

function ScrollSection({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useScrollFade();
  return (
    <section ref={ref} id={id} className={`scroll-fade ${className}`}>
      {children}
    </section>
  );
}

export default function Home() {
  const popularTools = getPopularTools();
  const newTools = getNewTools();
  const socialTools = getToolsByCategory("social-media");
  const devTools = getToolsByCategory("developer");

  const [trendingTools, setTrendingTools] = useState<Array<{ toolId: string; weeklyCount: number }>>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setTrendingTools(getTopTools(6));
    setRecentIds(getRecentlyViewed(4));
  }, []);

  return (
    <Layout>
      <SeoHead
        title={`X Toolkit — ${TOTAL_LIVE}+ Free Tools for X, SEO, Developers & Creators`}
        description="43+ free online tools for X (Twitter), SEO, developers & creators: X account checker, AI bio generator, JSON formatter, Base64, JWT decoder, temp mail, QR code generator, password generator & more. No signup, instant results."
        path="/"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />

        {/* Hero grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-16 pb-14 md:pt-24 md:pb-20 text-center relative">
          <div className="hero-badge inline-flex mb-5">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/8 px-3 py-1 text-xs font-medium">
              <Zap className="h-3 w-3 mr-1.5" /> {TOTAL_LIVE}+ free tools · no signup required
            </Badge>
          </div>

          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
            Free online tools for<br />
            <span className="text-shimmer">SEO, creators &amp; developers</span>
          </h1>

          <p className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            X account checker, AI bio generators, JSON formatter, Base64 encoder,
            text formatters — all free, all instant, all in one place.
          </p>

          <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link href="/tools">
              <Button size="lg" className="w-full sm:w-auto text-sm font-medium shadow-lg shadow-primary/30 px-8 hover:shadow-primary/50 hover:scale-[1.03] transition-all duration-200">
                Browse All Tools <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <a href="#categories">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm border-border/60 hover:bg-muted/50 hover:border-primary/30 hover:scale-[1.02] transition-all duration-200">
                See All Categories
              </Button>
            </a>
          </div>

          <div className="hero-trust flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {[
              { icon: Shield, text: "No data stored" },
              { icon: CheckCircle2, text: "No login required" },
              { icon: Zap, text: "Instant results" },
              { icon: Users, text: "Free forever" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-success" /> {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <ScrollSection className="border-y border-border/50 bg-muted/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: `${TOTAL_LIVE}+`, label: "Free tools", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
              { value: "6", label: "Tool categories", icon: Shield, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
              { value: "None", label: "Signup required", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
              { value: "~2s", label: "Average result time", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
            ].map(({ value, label, icon: Icon, color, bg }) => (
              <div key={label} className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] card-hover-glow ${bg}`}>
                <div className="h-9 w-9 rounded-lg bg-background/60 border border-border/40 flex items-center justify-center shrink-0">
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold leading-tight">{value}</div>
                  <div className="text-[11px] text-muted-foreground leading-tight">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ── Categories Overview ── */}
      <ScrollSection className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20" id="categories">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Everything in one place</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Tool Categories</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Six categories and growing. Every tool is free — no paywall, no account.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_ORDER.map((key) => {
            const cat = CATEGORIES[key];
            const Icon = cat.icon;
            const count = LIVE_TOOLS.filter((t) => t.category === key).length;
            return (
              <Link
                key={key}
                href={`/tools#${key}`}
                onClick={() => trackEvent("category_click", { label: cat.label })}
              >
                <div className="group relative rounded-xl border border-border/60 bg-card/50 p-5 hover:border-primary/30 hover:bg-card transition-all duration-200 cursor-pointer card-hover-glow">
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 ${cat.bg}`}>
                    <Icon className={`h-5 w-5 ${cat.color}`} />
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{cat.label}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground/50">{count} {count === 1 ? "tool" : "tools"}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollSection>

      {/* ── Popular Tools ── */}
      <ScrollSection className="border-t border-border/50 bg-muted/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">Most used</p>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Popular Tools</h2>
              <p className="text-sm text-muted-foreground">Most-used tools across the platform.</p>
            </div>
            <Link href="/tools">
              <Button variant="outline" size="sm" className="text-xs border-border/60 hidden sm:flex hover:border-primary/30 transition-colors">
                All Tools <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <div key={tool.id} onClick={() => trackEvent("popular_tool_click", { tool: tool.id })}
                className="transition-transform duration-200 hover:-translate-y-0.5">
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ── Trending / Recently Viewed ── */}
      {(trendingTools.length > 0 || recentIds.length > 0) && (
        <ScrollSection className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="grid md:grid-cols-2 gap-8">
            {trendingTools.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-7 w-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Your usage</p>
                    <h3 className="text-base font-bold leading-tight">Trending This Week</h3>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {trendingTools.map(({ toolId, weeklyCount }, i) => {
                    const tool = ALL_TOOLS.find(t => t.id === toolId);
                    if (!tool) return null;
                    const Icon = tool.icon;
                    return (
                      <Link key={toolId} href={tool.href} onClick={() => trackEvent("trending_tool_click", { tool: toolId })}>
                        <div className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/40 bg-card/40 hover:border-primary/30 hover:bg-card transition-all duration-200 cursor-pointer card-hover-glow">
                          <span className="text-xs font-bold text-muted-foreground/40 w-4 shrink-0">#{i + 1}</span>
                          <div className="h-7 w-7 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-sm font-medium flex-1 group-hover:text-primary transition-colors truncate">{tool.label}</span>
                          <span className="text-[10px] text-muted-foreground/50 shrink-0">{weeklyCount}× this week</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {recentIds.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-7 w-7 rounded-lg bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Jump back in</p>
                    <h3 className="text-base font-bold leading-tight">Recently Viewed</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {recentIds.map((toolId) => {
                    const tool = ALL_TOOLS.find(t => t.id === toolId);
                    if (!tool) return null;
                    const Icon = tool.icon;
                    return (
                      <Link key={toolId} href={tool.href} onClick={() => trackEvent("recent_tool_click", { tool: toolId })}>
                        <div className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/40 bg-card/40 hover:border-primary/30 hover:bg-card transition-all duration-200 cursor-pointer h-full card-hover-glow">
                          <div className="h-7 w-7 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-xs font-medium flex-1 group-hover:text-primary transition-colors leading-snug">{tool.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollSection>
      )}

      {/* ── Email & Privacy Spotlight ── */}
      <ScrollSection className="border-t border-border/50 bg-muted/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="outline" className="border-cyan-400/30 text-cyan-400 bg-cyan-400/8 text-xs mb-4">
                Email &amp; Privacy Tools
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Protect your inbox from spam and data brokers
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                Get a disposable inbox instantly, score your real address privacy, generate masked aliases, and understand what websites know about your email — all free, all in your browser.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Disposable inbox ready in under 2 seconds",
                  "Privacy score across 7 factors for any email",
                  "Masked alias generator — hide your real address",
                  "Check if your email is exposed in public databases",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Link href="/tools/temp-mail/tempemail">
                  <Button size="sm" className="shadow-sm shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.03] transition-all">
                    Get Temp Email <ArrowRight className="h-3.5 w-3.5 ml-2" />
                  </Button>
                </Link>
                <Link href="/email-tools">
                  <Button variant="outline" size="sm" className="border-border/60 hover:border-primary/30 transition-colors">
                    All Email Tools
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PRIVACY_TOOLS_SPOTLIGHT.map(({ href, label, desc, icon: Icon, color, bg }) => (
                <Link key={href} href={href} onClick={() => trackEvent("privacy_tool_click", { tool: href })}>
                  <div className={`group relative rounded-xl border p-4 hover:shadow-sm transition-all duration-200 cursor-pointer h-full card-hover-glow ${bg}`}>
                    <div className="h-8 w-8 rounded-lg bg-background/60 border border-border/30 flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110">
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <p className="text-xs font-semibold mb-1 group-hover:text-primary transition-colors leading-snug">{label}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* ── Social Media Spotlight ── */}
      <ScrollSection className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Badge variant="outline" className="border-blue-400/30 text-blue-400 bg-blue-400/8 text-xs mb-4">
              Social Media Tools
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Manage X accounts at scale
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
              Bulk-check up to 100 X accounts in seconds, convert usernames to profile links, format @ lists, and generate AI-powered bios — all without logging in.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Check 100 accounts in ~2 seconds",
                "Active, suspended, and deleted detection",
                "AI bio generation with Groq",
                "Bulk @ prefix add / remove",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/tools/x-account-checker">
              <Button size="sm" className="shadow-sm shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.03] transition-all">
                Try Account Checker <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {socialTools.map((tool) => (
              <div key={tool.id} className="transition-transform duration-200 hover:-translate-y-0.5">
                <ToolCard tool={tool} compact />
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ── Developer Tools Spotlight ── */}
      <ScrollSection className="border-t border-border/50 bg-muted/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="grid grid-cols-1 gap-3 order-2 md:order-1">
              {devTools.map((tool) => (
                <div key={tool.id} className="transition-transform duration-200 hover:-translate-y-0.5">
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <Badge variant="outline" className="border-orange-400/30 text-orange-400 bg-orange-400/8 text-xs mb-4">
                Developer Tools
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Developer utilities that just work
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                Format and validate JSON with real-time error highlighting. Encode and decode Base64 strings including emojis and Unicode. All processing happens in your browser — nothing is sent to a server.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Real-time JSON validation with line numbers",
                  "Format or minify with one click",
                  "Base64 with full Unicode support",
                  "JWT payload decoding built in",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/tools/json-formatter">
                <Button variant="outline" size="sm" className="border-border/60 hover:border-primary/30 transition-colors">
                  Try JSON Formatter <ArrowRight className="h-3.5 w-3.5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* ── Newly Added ── */}
      {newTools.length > 0 && (
        <ScrollSection className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Recently Added</h2>
              <p className="text-sm text-muted-foreground">Fresh tools, just launched.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newTools.map((tool) => (
              <div key={tool.id} onClick={() => trackEvent("new_tool_click", { tool: tool.id })}
                className="transition-transform duration-200 hover:-translate-y-0.5">
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </ScrollSection>
      )}

      {/* ── Testimonials ── */}
      <ScrollSection className="border-t border-border/50 bg-muted/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">User reviews</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Loved by creators &amp; developers</h2>
            <p className="text-muted-foreground text-sm">What people are saying.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ quote, name, role, stars }) => (
              <div key={name} className="relative rounded-xl border border-border/60 bg-card/50 p-6 space-y-4 overflow-hidden card-hover-glow transition-all duration-200 hover:-translate-y-1">
                <div className="absolute top-3 right-4 text-7xl font-serif leading-none select-none text-primary/6 pointer-events-none">"</div>
                <StarRating count={stars} />
                <p className="text-sm text-muted-foreground leading-relaxed relative">"{quote}"</p>
                <div className="flex items-center gap-2.5 pt-1 border-t border-border/40">
                  <div className="h-8 w-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{name[0]}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ── FAQ ── */}
      <ScrollSection className="max-w-3xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-sm">Everything you need to know.</p>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {FAQS.map(({ q, a }, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border/60 bg-card/40 px-5 data-[state=open]:bg-card/70 data-[state=open]:border-primary/20 transition-all duration-200">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4 hover:text-primary transition-colors">{q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollSection>

      {/* ── CTA ── */}
      <ScrollSection className="max-w-6xl mx-auto px-4 md:px-8 pb-16 md:pb-20">
        <div className="relative rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 text-center overflow-hidden cta-pulse">
          {/* CTA background orb */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 rounded-full opacity-30"
              style={{
                background: "radial-gradient(ellipse, hsl(258 82% 66% / 0.2), transparent 70%)",
                filter: "blur(40px)",
              }}
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 relative">Ready to get started?</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm md:text-base relative">
            {TOTAL_LIVE}+ free tools. No account, no signup, no payment. Ever.
          </p>
          <Link href="/tools">
            <Button size="lg" className="shadow-lg shadow-primary/30 px-8 hover:shadow-primary/50 hover:scale-[1.04] transition-all duration-200 relative">
              Browse All Tools <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </ScrollSection>
    </Layout>
  );
}
