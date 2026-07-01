import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ToolCard } from "@/components/ToolCard";
import { CATEGORIES, LIVE_TOOLS, TOTAL_LIVE, getPopularTools } from "@/lib/tools-registry";
import { trackEvent } from "@/lib/analytics";
import {
  Search, Sparkles, Type, TrendingUp, Mail, Code2,
  ArrowRight, Shield, Zap, CheckCircle,
} from "lucide-react";

type CategoryKey = import("@/lib/tools-registry").CategoryKey;

const CATEGORY_ORDER: CategoryKey[] = [
  "social-media",
  "ai-writing",
  "text-formatting",
  "developer",
  "seo",
  "email",
];

const FAQS = [
  {
    q: "How many tools does X Toolkit have?",
    a: `${TOTAL_LIVE} free tools across 6 categories — X/Twitter tools, developer utilities, SEO tools, email & privacy tools, text formatting, and AI writing tools. All free forever.`,
  },
  {
    q: "Do I need to create an account?",
    a: "No. Every tool works immediately with no signup, no email address, and no credit card required.",
  },
  {
    q: "Is my data safe?",
    a: "All tools run entirely in your browser. No data is sent to our servers or stored anywhere. Your JWTs, code, and emails never leave your device.",
  },
  {
    q: "What makes X Toolkit different from other tool sites?",
    a: "We focus on tools developers and creators actually need daily — especially X/Twitter tools that nobody else offers free. Our X Account Checker, Temp Gmail, and Gmail Checker are unique to X Toolkit.",
  },
  {
    q: "Can I use these tools on mobile?",
    a: "Yes. All tools are mobile-optimized and work on any device without installing anything.",
  },
  {
    q: "Is X Toolkit really free?",
    a: "Yes, completely free. No hidden costs, no premium tiers, no usage limits. Free forever.",
  },
];

const TOOL_ICONS = [
  { icon: Search,     label: "X Tools",    bg: "bg-blue-100",   color: "text-blue-600" },
  { icon: Sparkles,   label: "AI Writing", bg: "bg-violet-100", color: "text-violet-600" },
  { icon: Code2,      label: "Developer",  bg: "bg-orange-100", color: "text-orange-600" },
  { icon: Type,       label: "Text",       bg: "bg-green-100",  color: "text-green-600" },
  { icon: TrendingUp, label: "SEO",        bg: "bg-pink-100",   color: "text-pink-600" },
  { icon: Mail,       label: "Email",      bg: "bg-indigo-100", color: "text-indigo-600" },
];

export default function Home() {
  const popularTools = getPopularTools().slice(0, 6);

  return (
    <Layout>
      <SeoHead
        title={`X Toolkit — ${TOTAL_LIVE}+ Free Tools for X, SEO & Developers`}
        description={`${TOTAL_LIVE}+ free online tools: bulk X account checker, JWT decoder, JSON formatter, temp Gmail, Gmail account checker, schema generator & more. No signup required.`}
        path="/"
        extraSchemas={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://xtoolkit.live",
            "name": "X Toolkit",
            "description": "Free online tools for X (Twitter), SEO, developers and creators.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": { "@type": "EntryPoint", "urlTemplate": "https://xtoolkit.live/tools?q={search_term_string}" },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "X Toolkit",
            "url": "https://xtoolkit.live",
            "logo": { "@type": "ImageObject", "url": "https://xtoolkit.live/favicon-512.png" },
            "founder": { "@type": "Person", "name": "Somen Biswas" },
            "sameAs": ["https://twitter.com/somen_2k", "https://github.com/somen2k0"],
          },
        ]}
      />

      {/* ── Hero — left text + right illustration ── */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-14 pb-12 md:pt-20 md:pb-16">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">

            {/* Left: headline + text + CTAs */}
            <div className="flex-1 md:max-w-[520px]">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
                All Free Tools in{" "}
                <span className="text-primary relative">
                  "One Box"
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M2 6 C40 2, 80 2, 120 4 C160 6, 180 2, 198 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
                  </svg>
                </span>
              </h1>
              <p className="text-base text-muted-foreground mb-2">
                No need to bookmark tools from 10 different websites separately.
              </p>
              <p className="text-base text-muted-foreground mb-8">
                X Toolkit is a <strong className="text-foreground font-semibold">"free all-in-one toolbox"</strong> built for
                developers, creators and SEO professionals — {TOTAL_LIVE}+ tools, no signup ever required.
              </p>
             <div className="flex flex-wrap gap-3">
                <Link href="/tools">
                  <Button size="lg" className="px-7 font-semibold shadow-sm shadow-primary/20 group transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-md">
                    Explore Tools <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/chrome-extension">
                  <Button variant="outline" size="lg" className="px-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[#F5390A]/5 hover:border-[#F5390A]/30 hover:shadow-sm">
                    Get Extension
                  </Button>
                </Link>
              </div>
            </div>

           {/* Right: category icon grid with an elegant panel card frame */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="bg-[#FFFCF8] p-6 rounded-2xl border border-[#F5390A]/10 shadow-sm max-w-sm w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5390A] mb-4 text-center md:text-left opacity-80">
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {TOOL_ICONS.map(({ icon: Icon, label, bg, color }, index) => (
                    <div 
                      key={label} 
                      style={{ animationDelay: `${index * 150}ms` }}
                      className={`${bg} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-square shadow-sm animate-bounce [animation-duration:3s] transition-all duration-300 ease-out hover:scale-105 hover:shadow-md cursor-default`}
                    >
                      <Icon className={`h-6 w-6 ${color}`} />
                      <span className={`text-[10px] font-semibold ${color}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
           </div>

          </div>
        </div>
      </section>

      {/* ── Value section — visual left + text right ── */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

            {/* Left: stat blocks */}
            <div className="flex-1 grid grid-cols-2 gap-4 max-w-xs md:max-w-sm mx-auto md:mx-0">
              {[
                { value: `${TOTAL_LIVE}+`, label: "Free Tools", icon: Zap,          color: "text-primary",   bg: "bg-primary/10" },
                { value: "6",              label: "Categories",  icon: CheckCircle,  color: "text-green-600", bg: "bg-green-100" },
                { value: "0",              label: "Data Stored", icon: Shield,       color: "text-blue-600",  bg: "bg-blue-100" },
                { value: "∞",              label: "Free Forever",icon: Sparkles,     color: "text-violet-600",bg: "bg-violet-100" },
              ].map(({ value, label, icon: Icon, color, bg }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-2 shadow-sm">
                  <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{label}</div>
                </div>
              ))}
            </div>

            {/* Right: text */}
            <div className="flex-1 max-w-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5 tracking-tight">
                Best All-In-One Toolkit for the Web
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                X Toolkit brings together tools you actually use — X/Twitter account checker, AI bio generator,
                JSON formatter, temp Gmail, JWT decoder, schema generator, and more. If you got tired of
                opening a different website for each tool, you're in the right place.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Every tool is designed to be as simple as possible — focused on doing one thing well,
                with the minimum number of steps. No clutter, no paywalls, no dark patterns.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Start using X Toolkit and forget all the other tool tabs you have open right now.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Tool Categories ── */}
      <section id="categories" className="border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
              Tool Categories
            </h2>
            <p className="text-sm text-muted-foreground">
              Six categories. Every tool is free — no paywall, no account.
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
                  <div className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm h-full">
                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 ${cat.bg}`}>
                      <Icon className={`h-5 w-5 ${cat.color}`} />
                    </div>
                    <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground/60">
                        {count} {count === 1 ? "tool" : "tools"}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Tools ── */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-1">
                Featured Tools
              </h2>
              <p className="text-sm text-muted-foreground">The tools people come back to every day.</p>
            </div>
            <Link href="/tools">
              <Button variant="outline" size="sm" className="text-xs hidden sm:flex">
                All Tools <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => trackEvent("popular_tool_click", { tool: tool.id })}
                className="transition-transform duration-200 hover:-translate-y-0.5"
              >
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/tools">
              <Button variant="outline" size="sm">
                See All {TOTAL_LIVE} Tools <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-lg border border-border bg-card px-5 data-[state=open]:bg-secondary data-[state=open]:border-primary/20 transition-colors duration-150"
              >
                <AccordionTrigger className="text-sm font-medium text-foreground text-left hover:no-underline py-4 hover:text-primary transition-colors">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {TOTAL_LIVE} free tools — no account, no signup, no credit card.
            </p>
            <Link href="/tools">
              <Button size="lg" className="px-8 shadow-sm shadow-primary/20">
                Explore All Tools <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
