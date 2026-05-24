import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  Download, Star, Shield, Zap, Bell, Mail,
  Copy, RefreshCw, History, Key, Puzzle, Chrome,
} from "lucide-react";

const VERSION = "1.0.0";
const CWS_URL = "https://chromewebstore.google.com/detail/x-toolkit/TODO_REPLACE_WITH_REAL_ID";

const features = [
  { icon: Zap,       title: "Instant Inbox",          desc: "Disposable email ready the moment you click. No setup, no tab switching." },
  { icon: Key,       title: "OTP Detection",           desc: "Auto-detects 4–8 digit codes and surfaces a 1-click copy button instantly." },
  { icon: Bell,      title: "Live Notifications",      desc: "Desktop alerts when mail arrives — even with the popup closed." },
  { icon: RefreshCw, title: "Auto-Refresh",            desc: "Service worker polls every 15 seconds silently in the background." },
  { icon: Mail,      title: "Temp Gmail",              desc: "Generate real temporary Gmail addresses with a live, readable inbox." },
  { icon: History,   title: "Inbox History",           desc: "Every address saved locally — survives browser restarts." },
  { icon: Shield,    title: "Zero Tracking",           desc: "No login, no data collection. Everything stays on your device." },
  { icon: Copy,      title: "Alt+Shift+C Shortcut",    desc: "Copy your active email from any tab without opening the popup." },
];

const faqs = [
  {
    q: "What is the X Toolkit Chrome extension?",
    a: "X Toolkit is a free Chrome extension that gives you an instant disposable email inbox directly in your browser toolbar. It auto-generates a temporary email address, polls for new messages every 15 seconds, detects OTP verification codes automatically, and lets you generate temp Gmail addresses — all without visiting any website.",
  },
  {
    q: "Which browsers does the extension support?",
    a: "The extension works on all Chromium-based browsers: Google Chrome, Brave, Microsoft Edge, Arc, and Opera. It uses Manifest V3 so it is compatible with all modern Chromium-based browsers.",
  },
  {
    q: "Is the extension free?",
    a: "Yes, completely free. There are no premium tiers, no subscriptions, and no feature limits. All 8 built-in features are available immediately after install.",
  },
  {
    q: "What data does the extension collect?",
    a: "None. The extension stores your active inbox session and address history locally on your device using Chrome's storage API. Nothing is sent to any server beyond the API calls needed to generate and check your inbox.",
  },
  {
    q: "How does the OTP detection work?",
    a: "When a new email arrives in your disposable inbox, the extension scans the message body for sequences of 4–8 digits that look like verification or one-time-password codes. If one is found, a 1-click copy button appears so you can paste it without even reading the email.",
  },
  {
    q: "Can I use the extension without installing it?",
    a: "Yes — all the same tools (temp email, Gmail tricks, masked email) are available for free on the X Toolkit website at xtoolkit.live. The extension is simply a faster, always-accessible version that lives in your browser toolbar.",
  },
  {
    q: "Will my email address stay the same between sessions?",
    a: "Yes. Your generated address is saved locally and persists across browser restarts. You can also browse your full inbox history from previous sessions inside the extension popup.",
  },
  {
    q: "How do I install the extension?",
    a: "Click 'Add to Chrome' above, then confirm the prompt in your browser. Once installed, click the puzzle-piece icon in your toolbar, find X Toolkit, and pin it. Your first disposable inbox is created automatically — no setup needed.",
  },
];

function AddToChrome({ size = "default" }: { size?: "default" | "lg" }) {
  const pad = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
  return (
    <a
      href={CWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 ${pad} rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-200 hover:-translate-y-0.5`}
    >
      <Download className="h-4 w-4" />
      Add to Chrome — it's free
    </a>
  );
}

export default function ChromeExtensionPage() {
  return (
    <Layout>
      <SeoHead
        title="X Toolkit Chrome Extension — Free Temp Email & OTP Detector"
        description="Get instant disposable email inboxes and automatic OTP detection right in your Chrome toolbar. Free Chrome extension by X Toolkit."
        path="/chrome-extension"
        keywords="chrome extension temp mail, disposable email extension, temp email chrome, otp detector extension, throwaway email chrome, temporary email extension, disposable inbox chrome"
        extraSchemas={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "@id": "https://xtoolkit.live/chrome-extension#software",
            name: "X Toolkit – Free Temp Email Chrome Extension",
            applicationCategory: "BrowserApplication",
            operatingSystem: ["Chrome", "Brave", "Microsoft Edge", "Opera", "Arc"],
            softwareVersion: VERSION,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
            description: "A free Chrome extension for generating instant disposable email inboxes and automatically detecting OTP codes.",
          },
        ]}
      />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        {/* Rich background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-transparent to-transparent" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-violet-600/15 blur-[140px]" />
          <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />
          <div className="absolute top-10 left-10 h-56 w-56 rounded-full bg-indigo-600/10 blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-32 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-2xl shadow-violet-500/40 mb-8 ring-1 ring-violet-400/20">
            <Puzzle className="h-9 w-9 text-white" />
          </div>

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Free on the Chrome Web Store
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight">
            Temp email &amp; OTP{" "}
            <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              in your toolbar
            </span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Instant disposable inbox, automatic OTP detection, and Gmail tricks —
            right in Chrome. No website visits. No signups. Just click and go.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <AddToChrome size="lg" />
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Chrome className="h-4 w-4" />
              Works on Chrome, Brave, Edge &amp; Arc
            </div>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/40 text-xs">
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-400" /> Free forever</span>
            <span className="h-3 w-px bg-white/20" />
            <span>No account needed</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Manifest V3</span>
            <span className="h-3 w-px bg-white/20" />
            <span>111 KB</span>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="border-y border-white/8 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
          {[
            { val: "8",    label: "Built-in features" },
            { val: "15s",  label: "Auto-refresh rate" },
            { val: "0",    label: "Signups required" },
            { val: "Free", label: "Always & forever" },
          ].map(({ val, label }) => (
            <div key={label} className="text-center px-4 py-2">
              <div className="text-2xl font-extrabold text-white mb-0.5">{val}</div>
              <div className="text-xs text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features grid ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Everything you need, in one click</h2>
          <p className="text-white/60 text-lg">All the web tool's power — faster, from any tab, without leaving the page.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:border-violet-500/40 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/10"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/20 border border-violet-500/20 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-violet-300" />
              </div>
              <p className="text-sm font-bold text-white mb-1.5 group-hover:text-violet-200 transition-colors">{title}</p>
              <p className="text-xs text-white/55 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="relative overflow-hidden border-y border-white/8 bg-white/[0.015]">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-96 bg-violet-600/8 blur-[80px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Up and running in 30 seconds</h2>
            <p className="text-white/60">Three steps. No friction.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Install from Chrome Web Store", desc: "One click — Add to Chrome. No account, no email required." },
              { n: "2", title: "Pin it to your toolbar",        desc: "Click the puzzle-piece icon, find X Toolkit, and pin it." },
              { n: "3", title: "Click to open your inbox",      desc: "Your temp email is ready instantly — copy, paste, done." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white font-extrabold text-lg mb-4 shadow-lg shadow-violet-500/30">
                  {n}
                </div>
                <p className="text-base font-bold text-white mb-2">{title}</p>
                <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Frequently asked questions</h2>
          <p className="text-white/60">Everything you need to know before installing.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-white/10 bg-white/[0.03] hover:border-violet-500/30 transition-colors px-5 !border-b-0 data-[state=open]:border-violet-500/40 data-[state=open]:bg-white/[0.05]"
            >
              <AccordionTrigger className="text-white/90 hover:text-white font-medium text-sm md:text-base py-5 hover:no-underline [&[data-state=open]]:text-violet-200">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/60 text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-violet-950/30 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-80 w-[700px] bg-violet-600/12 blur-[120px]" />
        </div>
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-24 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-xl shadow-violet-500/30 mb-6">
            <Download className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Install X Toolkit now</h3>
          <p className="text-white/60 text-lg mb-8 leading-relaxed">
            Free on the Chrome Web Store. No account, no signup — just install and your first inbox is ready in seconds.
          </p>
          <AddToChrome size="lg" />
          <p className="text-white/30 text-xs mt-6">No credit card · No account · Free forever</p>
        </div>
      </div>
    </Layout>
  );
}
