import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ToolCard } from "@/components/ToolCard";
import { CATEGORIES, LIVE_TOOLS, TOTAL_LIVE, getPopularTools } from "@/lib/tools-registry";
import { trackEvent } from "@/lib/analytics";
import { Shield, Zap, Code, ArrowRight } from "lucide-react";

type CategoryKey = import("@/lib/tools-registry").CategoryKey;

const CATEGORY_ORDER: CategoryKey[] = [
  "social-media",
  "ai-writing",
  "text-formatting",
  "developer",
  "seo",
  "email",
];

const WHY_ITEMS = [
  {
    icon: Shield,
    title: "Runs in your browser",
    desc: "All tools process data locally. Nothing is sent to our servers or stored anywhere.",
  },
  {
    icon: Zap,
    title: "No signup ever",
    desc: "Every tool works immediately. No account, no email, no credit card required.",
  },
  {
    icon: Code,
    title: "Built for real work",
    desc: "Tools that developers, marketers and creators actually use daily — not demos.",
  },
];

const UNIQUE_TOOLS = [
  {
    href: "/tools/x-account-checker",
    title: "X Account Checker",
    headline: "Check 100 Twitter/X accounts at once",
    desc: "See followers, join date, verified status instantly",
    cta: "Try Account Checker",
  },
  {
    href: "/tools/temp-mail/tempgmail",
    title: "Temp Gmail Generator",
    headline: "Real @gmail.com addresses that actually work",
    desc: "Works on sites that block disposable emails",
    cta: "Get Temp Gmail",
  },
  {
    href: "/tools/gmail-checker",
    title: "Gmail Account Checker",
    headline: "Verify if Gmail addresses are valid in bulk",
    desc: "Check up to 50 accounts instantly, download CSV",
    cta: "Check Gmail Accounts",
  },
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
    q: "How often are new tools added?",
    a: "We regularly add new tools based on user requests. Recent additions include CSS Gradient Generator, Hash Generator, Image Resizer, and Gmail Checker.",
  },
  {
    q: "Is X Toolkit really free?",
    a: "Yes, completely free. No hidden costs, no premium tiers, no usage limits. Free forever.",
  },
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
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://xtoolkit.live/tools?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "X Toolkit",
            "url": "https://xtoolkit.live",
            "logo": {
              "@type": "ImageObject",
              "url": "https://xtoolkit.live/favicon-512.png",
            },
            "founder": {
              "@type": "Person",
              "name": "Somen Biswas",
            },
            "sameAs": [
              "https://twitter.com/somen_2k",
              "https://github.com/somen2k0",
            ],
          },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative text-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#474bff]/5 to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 mb-6">
            <Zap className="h-3 w-3" />
            Free forever · No signup · {TOTAL_LIVE} tools
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-foreground mb-5 leading-tight">
            Free tools for X, developers &amp; SEO
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Bulk-check 100 X accounts, generate JSON-LD schema,{" "}
            <br className="hidden sm:block" />
            decode JWTs, create temp emails — all in your browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Browse All Tools <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <a href="#categories">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                See All Categories
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="text-center mb-10">
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
                      <span className="text-xs text-muted-foreground/50">
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

      {/* ── Most Used Tools ── */}
      <section className="border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-1">
                Most Used Tools
              </h2>
              <p className="text-sm text-muted-foreground">The tools people come back to.</p>
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
        </div>
      </section>

      {/* ── Why X Toolkit ── */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
              Why X Toolkit?
            </h2>
            <p className="text-sm text-muted-foreground">
              No dark patterns. No upsells. Just tools that work.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {WHY_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Unique Tools ── */}
      <section className="border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
              Tools you won't find elsewhere for free
            </h2>
            <p className="text-sm text-muted-foreground">
              These are the reason most people come to X Toolkit.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {UNIQUE_TOOLS.map(({ href, title, headline, desc, cta }) => (
              <Link key={href} href={href}>
                <div className="group h-full rounded-xl border border-border border-l-[4px] border-l-primary bg-card shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                      {title}
                    </p>
                    <h3 className="text-base font-semibold text-foreground leading-snug mb-1">
                      {headline}
                    </h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <div className="mt-auto pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:gap-2.5 transition-all duration-150">
                      {cta} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border/60 bg-card px-5 data-[state=open]:border-primary/20 transition-colors duration-150"
              >
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4 hover:text-primary transition-colors">
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
      <section className="border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {TOTAL_LIVE} free tools, no signup required.
            </p>
            <Link href="/tools">
              <Button size="lg" className="px-8">
                Browse All Tools <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
