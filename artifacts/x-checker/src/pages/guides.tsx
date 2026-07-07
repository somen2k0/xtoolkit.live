import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import { ArrowRight, Shield, Code2, AtSign, Clock } from "lucide-react";
import { TOTAL_LIVE } from "@/lib/tools-registry";

const GUIDES = [
  {
    category: "Email & Privacy",
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10",
    posts: [
      {
        title: "What Is Disposable Email? Complete Guide",
        description: "How disposable email addresses work, when to use them, and the best services available.",
        href: "/blog/what-is-disposable-email",
        readTime: "7 min read",
      },
      {
        title: "Is Temp Mail Safe? Risks and Best Practices",
        description: "A balanced look at when temp mail protects you — and when it creates risks.",
        href: "/blog/is-temp-mail-safe",
        readTime: "6 min read",
      },
      {
        title: "Temp Mail vs Gmail: When to Use Which",
        description: "A practical comparison of disposable email vs. a real Gmail account for different use cases.",
        href: "/blog/temp-mail-vs-gmail",
        readTime: "6 min read",
      },
      {
        title: "Best Temp Mail Services in 2026",
        description: "Reviewed: the top temporary email services compared on features, privacy, and reliability.",
        href: "/blog/best-temp-mail-services",
        readTime: "8 min read",
      },
      {
        title: "Why Websites Ask for Email Verification",
        description: "The real reasons behind email verification gates — and how to work around them legitimately.",
        href: "/blog/why-websites-ask-email-verification",
        readTime: "7 min read",
      },
      {
        title: "Temp Gmail Explained: Dot & Plus Tricks",
        description: "How Gmail's dot and plus addressing works to generate unlimited inbox aliases from one account.",
        href: "/blog/temp-gmail-explained",
        readTime: "7 min read",
      },
      {
        title: "How to Use a Temp Email Browser Extension",
        description: "Step-by-step guide to using a disposable email extension to protect your inbox while browsing.",
        href: "/blog/how-to-use-temp-email-extension",
        readTime: "5 min read",
      },
    ],
  },
  {
    category: "Developer Guides",
    icon: Code2,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    posts: [
      {
        title: "What Is JSON-LD? Structured Data for SEO",
        description: "How JSON-LD structured data works, why Google uses it, and how to implement it correctly.",
        href: "/blog/what-is-json-ld",
        readTime: "6 min read",
      },
      {
        title: "What Is Base64 Encoding?",
        description: "A clear explanation of Base64 encoding — what it is, how it works, and when developers use it.",
        href: "/blog/what-is-base64",
        readTime: "6 min read",
      },
      {
        title: "What Is a UUID? Format, Versions & Uses",
        description: "Everything developers need to know about UUIDs — the 128-bit identifiers behind every modern app.",
        href: "/blog/what-is-uuid",
        readTime: "6 min read",
      },
      {
        title: "URL Encoding Guide: Percent-Encoding Explained",
        description: "How URL encoding works, which characters must be encoded, and when to use encodeURI vs encodeURIComponent.",
        href: "/blog/url-encoding-guide",
        readTime: "6 min read",
      },
    ],
  },
  {
    category: "Social Media",
    icon: AtSign,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    posts: [
      {
        title: "How to Write the Perfect Twitter Bio",
        description: "Proven tips and templates for writing an X bio that gets followers and communicates your brand.",
        href: "/blog/twitter-bio-tips",
        readTime: "6 min read",
      },
    ],
  },
];

export default function Guides() {
  const totalPosts = GUIDES.reduce((sum, g) => sum + g.posts.length, 0);

  return (
    <Layout>
      <SeoHead
        title="Free Guides & Tutorials | X Toolkit"
        description="In-depth guides on email privacy, temp mail, developer tools, URL encoding, JSON-LD, Base64, UUIDs, and social media. Free tutorials from X Toolkit."
        path="/guides"
        keywords="email privacy guide, temp mail tutorial, developer guides, url encoding, base64 explained, uuid guide, twitter bio tips, json-ld structured data"
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">

        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/8 border border-primary/20 rounded-full px-3 py-1">
            Guides & Tutorials
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free Guides & Tutorials
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            In-depth guides on email privacy, temp mail, developer tools, and social media. {totalPosts} articles across {GUIDES.length} topics — written to be genuinely useful, not padded for SEO.
          </p>
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs text-muted-foreground">{totalPosts} articles</span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-xs text-muted-foreground">{GUIDES.length} categories</span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-xs text-muted-foreground">Free forever</span>
          </div>
        </div>

        <div className="space-y-12">
          {GUIDES.map(({ category, icon: Icon, color, bg, posts }) => (
            <section key={category}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${bg} border-current/20`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <h2 className={`text-lg font-bold ${color}`}>{category}</h2>
                <span className="text-xs text-muted-foreground ml-auto">{posts.length} {posts.length === 1 ? "guide" : "guides"}</span>
              </div>

              <div className="space-y-3">
                {posts.map(({ title, description, href, readTime }) => (
                  <Link key={href} href={href}>
                    <div className="group flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-5 hover:border-primary/30 hover:bg-card hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold group-hover:text-primary transition-colors mb-1 leading-snug">
                          {title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground/60">
                          <Clock className="h-3 w-3" />
                          {readTime}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Need a tool, not a guide?</h2>
          <p className="text-muted-foreground text-sm mb-5">
            All {TOTAL_LIVE}+ tools are free, instant, and require no signup.
          </p>
          <Link href="/tools">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer shadow-sm shadow-primary/20">
              Browse All Tools <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

      </div>
    </Layout>
  );
}
