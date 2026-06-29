import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Link } from "wouter";
import { TOTAL_LIVE } from "@/lib/tools-registry";

export default function About() {
  return (
    <Layout>
      <SeoHead
        title="About X Toolkit — Free Tools for X, Developers & SEO"
        description={`X Toolkit is built by Somen — a free collection of ${TOTAL_LIVE}+ tools for developers, SEO professionals and social media managers. Learn more about the project and its creator.`}
        path="/about"
        keywords="x toolkit, about x toolkit, somen biswas developer, free online tools, twitter tools developer, seo tools, temp mail, independent developer tools, xtoolkit.live"
      />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24">

        {/* Big colored title */}
        <h1 className="text-5xl md:text-6xl font-bold text-primary text-center mb-20 tracking-tight">
          About X Toolkit
        </h1>

        {/* What? */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-foreground mb-4">What?</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-3">
            X Toolkit is a free online tool factory where you can find all the tools you need in one place.
            It covers {TOTAL_LIVE}+ tools across six categories — X/Twitter account tools, AI writing, text
            formatting, developer utilities, SEO, and email privacy. Every tool is designed to solve a
            real problem with the minimum number of steps possible.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            There is no account, no paywall, and no data stored anywhere. Everything runs either in
            your browser or on a server that processes your request and immediately discards it.
            X Toolkit started in 2026 and grows by adding new tools regularly.
          </p>
        </section>

        {/* Why? */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-foreground mb-4">Why?</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-3">
            There are lots of tool sites on the web. Most of them focus on one narrow topic, charge
            you after three uses, or look like they were designed in 2009. When you need a JSON
            formatter AND a temp email AND a bulk account checker, you end up with five different
            browser tabs open and five different signups. The bookmarks pile up.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-3">
            X Toolkit exists to solve exactly that. One site, everything in one place, completely
            free forever. No subscriptions, no rate-limit warnings on basic usage, no dark patterns
            designed to push you toward a paid plan.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            The tools that matter most — especially the X/Twitter tools that no other free site
            offers — should be accessible to everyone, whether you're a full-time social media
            manager or someone who just needs to check one account.
          </p>
        </section>

        {/* Who? */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-foreground mb-4">Who?</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-3">
            X Toolkit is designed, built, and maintained by{" "}
            <strong className="text-foreground font-semibold">Somen Biswas</strong> as an independent
            side project. I'm a developer who started building this because I needed these tools
            myself and couldn't find a single free site that had all of them together without
            gatekeeping the useful parts behind a paywall.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            Even though I'm not a professional designer, I'm doing my best to build a simple,
            clean, and genuinely useful interface — one that gets out of your way and lets you
            do the thing you came to do. You can reach me via any of the links below about
            anything — bugs, suggestions, feedback, or just to say hi.
          </p>

          {/* Social links */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <a
              href="https://x.com/somen_2k"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              @somen_2k
            </a>
            <a
              href="https://github.com/somen2k0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              somen2k0
            </a>
            <a
              href="https://t.me/so_m_en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              @so_m_en
            </a>
            <a
              href="mailto:somen.office@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Email
            </a>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/8 text-sm text-primary hover:bg-primary/15 transition-all font-medium">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Contact me
              </button>
            </Link>
          </div>
        </section>

        {/* Support CTA */}
        <div className="rounded-2xl border border-border bg-card p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-base font-semibold text-foreground">Want to support the project?</p>
          <a
            href="https://buymeacoffee.com/somen2k0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#FFDD00] text-[#1a1a1a] font-bold text-sm hover:bg-[#f5d000] transition-colors shadow-sm whitespace-nowrap"
          >
            <span className="text-lg">☕</span> Buy me a coffee
          </a>
        </div>

      </div>
    </Layout>
  );
}
