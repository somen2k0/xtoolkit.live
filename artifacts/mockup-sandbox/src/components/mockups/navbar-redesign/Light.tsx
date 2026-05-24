import { useState } from "react";
import { Sun, Moon, Home, AtSign, Code2, TrendingUp, Mail, Inbox, Info, ChevronDown, Search, Sparkles, MessageSquare } from "lucide-react";

function ThemePill({ theme, onToggle }: { theme: "dark" | "light"; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="relative flex items-center gap-0.5 p-1 rounded-full transition-all duration-200 shadow-sm border"
      style={{ background: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.1)" }}
    >
      <span className={`flex items-center justify-center h-6 w-6 rounded-full transition-all duration-200 ${
        theme === "light"
          ? "text-amber-500"
          : "text-black/25"
      }`}
      style={theme === "light" ? {
        background: "rgba(251,191,36,0.15)",
        boxShadow: "0 0 8px rgba(251,191,36,0.35)"
      } : {}}
      >
        <Sun className="h-3.5 w-3.5" />
      </span>
      <span className={`flex items-center justify-center h-6 w-6 rounded-full transition-all duration-200 ${
        theme === "dark"
          ? "text-indigo-500"
          : "text-black/25"
      }`}
      style={theme === "dark" ? {
        background: "rgba(99,102,241,0.15)",
        boxShadow: "0 0 8px rgba(99,102,241,0.35)"
      } : {}}
      >
        <Moon className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

const NAV_ITEMS = [
  { icon: Home, label: "Home", active: true },
  { icon: AtSign, label: "X Tools", color: "#3b82f6", hoverBg: "rgba(59,130,246,0.08)" },
  { icon: Code2, label: "Dev Tools", color: "#f97316", hoverBg: "rgba(249,115,22,0.08)" },
  { icon: TrendingUp, label: "SEO Tools", color: "#ec4899", hoverBg: "rgba(236,72,153,0.08)" },
  { icon: Mail, label: "Email Tools", color: "#06b6d4", hoverBg: "rgba(6,182,212,0.08)" },
  { icon: Inbox, label: "Temp Mail", color: "#14b8a6", hoverBg: "rgba(20,184,166,0.08)" },
  { icon: Info, label: "About" },
];

export function Light() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  return (
    <div
      className="min-h-screen font-['Inter']"
      style={{ background: "hsl(228 25% 96%)", color: "hsl(228 40% 12%)" }}
    >
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-lg shadow-sm"
        style={{
          background: "hsla(228,25%,96%,0.85)",
          borderColor: "hsla(220,13%,91%,0.9)",
          boxShadow: "0 1px 12px rgba(0,0,0,0.06)"
        }}
      >
        {/* Bottom gradient accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }}
        />

        <div className="max-w-6xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 cursor-pointer">
            <div className="h-7 w-7 rounded-lg overflow-hidden shadow-md">
              <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
                <defs>
                  <linearGradient id="lBg" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#09071a"/><stop offset="100%" stopColor="#110d24"/>
                  </linearGradient>
                  <linearGradient id="lFront" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#c4b5fd"/><stop offset="45%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#4c1d95"/>
                  </linearGradient>
                </defs>
                <rect width="180" height="180" rx="36" fill="url(#lBg)"/>
                <g stroke="#2e1878" strokeLinecap="round" fill="none" transform="translate(2,2)">
                  <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
                </g>
                <g stroke="url(#lFront)" strokeLinecap="round" fill="none">
                  <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
                </g>
                <g stroke="url(#lFront)" strokeLinecap="square" fill="none">
                  <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
                </g>
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight" style={{ color: "hsl(228 40% 12%)" }}>X Toolkit</span>
            <span
              className="hidden lg:inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded-full border"
              style={{ borderColor: "rgba(124,58,237,0.25)", color: "#7c3aed", background: "rgba(124,58,237,0.06)" }}
            >
              44+ Tools
            </span>
          </div>

          {/* Command bar */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div
              className="flex items-center gap-0 px-1 py-0.5 rounded-2xl border"
              style={{
                background: "rgba(0,0,0,0.04)",
                borderColor: "rgba(0,0,0,0.09)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              {NAV_ITEMS.map(({ icon: Icon, label, active, color }) => (
                <button
                  key={label}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all duration-150 whitespace-nowrap"
                  style={active
                    ? { background: "#fff", color: "hsl(228 40% 12%)", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }
                    : { color: color || "rgba(0,0,0,0.4)" }
                  }
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  {label}
                  {color && !active && <ChevronDown className="h-2.5 w-2.5 opacity-50" />}
                </button>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Search */}
            <button
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "rgba(0,0,0,0.35)" }}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Theme pill */}
            <ThemePill theme={theme} onToggle={() => setTheme(t => t === "dark" ? "light" : "dark")} />

            {/* Extension CTA */}
            <button
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                boxShadow: "0 0 14px rgba(124,58,237,0.3)"
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/>
              </svg>
              Extension
            </button>

            <button className="p-1.5 rounded-lg transition-colors" style={{ color: "rgba(0,0,0,0.3)" }}>
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
        <div
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border mb-8"
          style={{ background: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.5)" }}
        >
          <Sparkles className="h-3 w-3 text-violet-500" />
          44+ free tools · no signup required
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-4" style={{ color: "hsl(228 40% 12%)" }}>
          Free online tools for
        </h1>
        <h1
          className="text-5xl font-bold tracking-tight mb-6"
          style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          SEO, creators &amp; developers
        </h1>
        <p style={{ color: "rgba(0,0,0,0.45)", maxWidth: 520, lineHeight: 1.6 }}>
          X account checker, AI bio generators, JSON formatter, Base64 encoder,<br />
          text formatters — all free, all instant, all in one place.
        </p>

        <div className="flex gap-3 mt-8">
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)", boxShadow: "0 4px 16px rgba(124,58,237,0.25)" }}
          >
            Browse All Tools →
          </button>
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ borderColor: "rgba(0,0,0,0.15)", color: "rgba(0,0,0,0.65)", background: "#fff" }}
          >
            See All Categories
          </button>
        </div>

        {/* Theme toggle indicator */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <p className="text-xs font-medium" style={{ color: "rgba(0,0,0,0.3)" }}>ACTIVE THEME</p>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{ borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.08)" }}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600">Light Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
