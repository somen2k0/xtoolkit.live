import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import {
  Shield, Zap, Heart, Search, Sparkles, Link2, AtSign, ArrowRight,
  Code2, Mail, BarChart2, FileText, Users, Globe,
} from "lucide-react";
import { TOTAL_LIVE } from "@/lib/tools-registry";

const values = [
  {
    icon: Zap,
    title: "Fast & Free",
    description: `All ${TOTAL_LIVE}+ tools are instant and completely free. No paywalls, no rate-limit warnings on basic usage, no upsells.`,
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "We don't store usernames, results, bios, or any personal data. Every request is processed in real-time and discarded immediately.",
  },
  {
    icon: Heart,
    title: "Built for Power Users",
    description: "Designed for social media managers, growth hackers, marketers, developers, and SEO professionals who need reliable bulk tools.",
  },
];

const categories = [
  {
    icon: Search,
    name: "X Account Tools",
    desc: "Bulk-check up to 100 X accounts for active/suspended/not found status, follower counts, and join dates. Generate profile links and format @-prefixed lists.",
  },
  {
    icon: Sparkles,
    name: "AI Writing Tools",
    desc: "AI-powered bio generation — get professional, funny, and aesthetic X bios for any niche. Plus name ideas and username generators.",
  },
  {
    icon: FileText,
    name: "Text & Format Tools",
    desc: "Character counter, plain-text formatter, tweet formatter, hashtag formatter, font preview, and more — all running in-browser with zero latency.",
  },
  {
    icon: Code2,
    name: "Developer Tools",
    desc: "JSON formatter, JWT decoder, Base64 encoder/decoder, Regex tester, SQL formatter, URL encoder, CSS minifier, HTML formatter, and UUID generator.",
  },
  {
    icon: BarChart2,
    name: "SEO Tools",
    desc: "Meta tag generator, URL slug generator, keyword density checker, robots.txt generator, and sitemap validator to help you rank on Google.",
  },
  {
    icon: Mail,
    name: "Email Tools",
    desc: "Disposable email inboxes across 9 domains, email validator, email signature generator, subject line generator, and more.",
  },
];

export default function About() {
  return (
    <Layout>
      <SeoHead
        title="About X Toolkit — Free Tools for X, Developers & SEO"
        description="X Toolkit is built by Somen — a free collection of 43+ tools for developers, SEO professionals and social media managers. Learn more about the project and its creator."
        path="/about"
        keywords="x toolkit, about x toolkit, somen biswas developer, free online tools, twitter tools developer, seo tools, temp mail, independent developer tools, xtoolkit.live"
      />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/8 border border-primary/20 rounded-full px-3 py-1">
            About X Toolkit
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Built for creators, developers & power users
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            X Toolkit is a free collection of {TOTAL_LIVE}+ productivity tools for X (Twitter) power users,
            developers, SEO professionals, and email marketers. We built it because managing accounts
            and creating content at scale shouldn't require expensive SaaS subscriptions.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-12 rounded-2xl border border-border/60 bg-card/50 p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Give everyone free, reliable, instant tools for X account management, content creation,
            developer workflows, SEO, and email — without requiring a login, credit card, or subscription.
            Whether you're cleaning up a follower list, formatting code, checking keywords, or generating
            a temporary email address, X Toolkit handles it instantly, for free.
          </p>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">What we stand for</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border border-border/60 bg-card/50 p-5 space-y-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Globe, value: `${TOTAL_LIVE}+`, label: "Free Tools" },
              { icon: Users, value: "6", label: "Categories" },
              { icon: Shield, value: "0", label: "Data Stored" },
              { icon: Zap, value: "~2s", label: "Avg Result Time" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-xl border border-border/60 bg-card/40 p-4 text-center space-y-1">
                <Icon className="h-5 w-5 text-primary mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tool categories */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">The tools</h2>
          <div className="space-y-3">
            {categories.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 px-5 py-4">
                <div className="h-8 w-8 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-foreground/70" />
                </div>
                <div>
                  <div className="font-medium text-sm">{name}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy commitment */}
        <section className="mb-12 rounded-2xl border border-success/20 bg-success/5 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-semibold mb-2 text-success">Privacy commitment</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We don't collect, store, or sell any personal data. Usernames you check, bios you generate,
                code you format, and any other inputs are processed in real-time and never written to a database.
                Developer tools run entirely in your browser — nothing leaves your device.
                Read our full <Link href="/privacy"><span className="text-primary hover:underline cursor-pointer">Privacy Policy</span></Link> for details.
              </p>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">How it's built</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            X Toolkit is built with React + TypeScript on the frontend, and a lightweight Node.js / Express
            API server on the backend. The X account checker uses X's public internal API (no auth required).
            Developer tools (JSON formatter, Base64, JWT decoder, etc.) run entirely in your browser.
            The AI bio generator uses Groq's LLM API — with your own key so we never see it.
          </p>
          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "Node.js", "Express", "TanStack Query", "shadcn/ui", "Tailwind CSS", "Groq API", "Vite", "Zod"].map((tech) => (
              <span key={tech} className="text-xs font-mono bg-muted/50 border border-border/60 rounded-full px-3 py-1 text-muted-foreground">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* About the developer */}
        <section className="mb-12 rounded-2xl border border-border/60 bg-card/50 p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-3">About the Developer</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            X Toolkit is built and maintained by <strong className="text-foreground/80">Somen</strong>, an independent developer focused on building genuinely useful free tools for the web. The project started in May 2026 with a simple goal: build the tools I wished existed, make them completely free, and keep them that way.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-5">
            Have feedback, found a bug, or want to suggest a new tool? Reach out at{" "}
            <a href="mailto:support@xtoolkit.live" className="text-primary hover:underline font-medium">support@xtoolkit.live</a>
            {" "}— all messages are read and responded to within 1-2 business days.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://x.com/somen_2k"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/40 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/60 transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @somen_2k
            </a>
            <a
              href="https://github.com/somen2k0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/40 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/60 transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              github.com/somen2k0
            </a>
            <a
              href="https://t.me/so_m_en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/40 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/60 transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              @so_m_en
            </a>
            <a
              href="mailto:somen.office@gmail.com"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/40 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/60 transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              somen.office@gmail.com
            </a>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Try X Toolkit now</h2>
          <p className="text-muted-foreground text-sm mb-5">{TOTAL_LIVE}+ tools. No account needed. Free forever.</p>
          <Link href="/tools">
            <Button className="shadow-sm shadow-primary/20">
              Open the Tools <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </Layout>
  );
}
