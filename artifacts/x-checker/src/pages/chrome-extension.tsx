import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import {
  Download, Star, Shield, Zap, Bell, Clock, Mail,
  Copy, RefreshCw, History, Key, Check, Puzzle,
} from "lucide-react";

const VERSION = "1.0.0";

const features = [
  { icon: Zap,        title: "Instant inbox generation",           desc: "Get a disposable email address instantly — multiple domains available, realistic addresses, auto-refresh every 15 seconds. No tab switching needed." },
  { icon: Key,        title: "OTP & verification code detection",  desc: "Automatically detects 4–8 digit codes and shows a 1-click copy button." },
  { icon: Bell,       title: "Desktop notifications",              desc: "Get alerted the moment a new email arrives — even when the popup is closed." },
  { icon: RefreshCw,  title: "Auto-refresh every 15 seconds",      desc: "Lightweight service worker keeps your inbox live in the background." },
  { icon: Mail,       title: "Temp Gmail & Gmail Tricks",          desc: "Generate a real temporary Gmail address with a live readable inbox." },
  { icon: History,    title: "Inbox history",                      desc: "All generated addresses saved locally and survive browser restarts." },
  { icon: Shield,     title: "Zero tracking, zero accounts",       desc: "No login, no data collection. Everything stored locally on your device." },
  { icon: Copy,       title: "Keyboard shortcut",                  desc: "Press Alt+Shift+C anywhere to copy your active temp email — no popup needed." },
];

const faqs = [
  {
    q: "What is the X Toolkit Chrome extension?",
    a: "X Toolkit is a free Chrome extension that gives you an instant disposable email inbox directly in your browser toolbar. It auto-generates a temporary email address, polls for new messages every 15 seconds, detects OTP verification codes automatically, and lets you generate temp Gmail addresses — all without visiting any website.",
  },
  {
    q: "Which browsers will the extension support?",
    a: "The extension will work on all Chromium-based browsers: Google Chrome, Brave, Microsoft Edge, Arc, and Opera. It uses Manifest V3. Firefox support is planned for a future release.",
  },
  {
    q: "Is the extension free?",
    a: "Yes, completely free. There are no premium tiers, no subscriptions, and no feature limits.",
  },
  {
    q: "What data does the extension collect?",
    a: "None. The extension stores your active inbox session and address history locally on your device using Chrome's storage API. Nothing is sent to any server beyond the API calls needed to generate and check your inbox.",
  },
];

export default function ChromeExtensionPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <Layout>
      <SeoHead
        title="X Toolkit Chrome Extension — Free Temp Email & OTP Detector"
        description="Get instant disposable email inboxes and automatic OTP detection right in your Chrome toolbar. Free Chrome extension by X Toolkit."
        path="/chrome-extension"
        keywords="chrome extension temp mail, disposable email extension, temp email chrome, otp detector extension, throwaway email chrome, temporary email extension, disposable inbox chrome"
        faqs={faqs}
        extraSchemas={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "@id": "https://xtoolkit.live/chrome-extension#software",
            name: "X Toolkit – Free Temp Email Chrome Extension",
            applicationCategory: "BrowserApplication",
            operatingSystem: ["Chrome", "Brave", "Microsoft Edge", "Opera", "Arc"],
            softwareVersion: VERSION,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
            description: "A free Chrome extension for generating instant disposable email inboxes, automatically detecting OTP codes, and creating temp Gmail addresses — coming soon.",
          },
        ]}
      />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-border/40">
        {/* background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[700px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-violet-600/8 blur-[80px]" />
        </div>

        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 border border-primary/25 shadow-lg shadow-primary/15 mb-6">
            <Puzzle className="h-7 w-7 text-primary" />
          </div>

          {/* Coming soon badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 px-3 py-1 text-xs font-medium text-amber-400 mb-5">
            <Clock className="h-3 w-3" />
            Coming Soon
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            X Toolkit{" "}
            <span className="bg-gradient-to-r from-violet-400 to-primary bg-clip-text text-transparent">
              Chrome Extension
            </span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Instant temp email, OTP detection, and Gmail tricks — right in your toolbar.
            No website visit needed. Launching on the Chrome Web Store soon.
          </p>

          {/* Notify form */}
          {submitted ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-5 py-3 text-sm text-emerald-400 font-medium">
              <Check className="h-4 w-4" />
              You're on the list — we'll email you when it launches!
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-xl border border-border/70 bg-card/60 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition"
              />
              <Button type="submit" className="gap-2 shadow-sm shadow-primary/20 whitespace-nowrap">
                <Bell className="h-3.5 w-3.5" />
                Notify me
              </Button>
            </form>
          )}

          {/* Social proof */}
          <p className="text-xs text-muted-foreground/50 mt-4 flex items-center justify-center gap-1">
            <Star className="h-3 w-3 text-amber-400/60" />
            No spam · Notified once at launch · Unsubscribe anytime
          </p>
        </div>
      </div>

      {/* ── Features grid ── */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-14">
        <h2 className="text-xl font-semibold text-center mb-2">What's coming</h2>
        <p className="text-sm text-muted-foreground text-center mb-10">
          Everything the web tool does — faster, from any tab, without leaving the page.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border/50 bg-card/40 p-4 hover:border-primary/25 hover:bg-card/70 transition-all group">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-semibold mb-1 leading-snug group-hover:text-primary transition-colors">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it'll work ── */}
      <div className="border-t border-border/40">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-14">
          <h2 className="text-xl font-semibold text-center mb-8">How it'll work</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: "1", title: "Install from Chrome Web Store", desc: "One click — Add to Chrome. No account, no email required." },
              { n: "2", title: "Pin it to your toolbar",        desc: "Click the puzzle-piece icon, find X Toolkit, pin it." },
              { n: "3", title: "Click to open your inbox",      desc: "Your temp email is ready instantly — copy and use." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-primary/30 bg-primary/8 text-primary font-bold text-sm mb-3">
                  {n}
                </div>
                <p className="text-sm font-semibold mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="border-t border-border/40 bg-primary/[0.03]">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 text-center">
          <Download className="h-6 w-6 text-primary/60 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">Be the first to install it</h3>
          <p className="text-sm text-muted-foreground mb-6">
            The extension is in final testing. Drop your email and we'll ping you the moment it's live.
          </p>
          {submitted ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-5 py-3 text-sm text-emerald-400 font-medium">
              <Check className="h-4 w-4" />
              You're on the list!
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-xl border border-border/70 bg-card/60 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 transition"
              />
              <Button type="submit" className="gap-2 shadow-sm shadow-primary/20 whitespace-nowrap">
                <Bell className="h-3.5 w-3.5" />
                Notify me
              </Button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
