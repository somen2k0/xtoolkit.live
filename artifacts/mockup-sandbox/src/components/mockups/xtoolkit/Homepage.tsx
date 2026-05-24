import { useState } from "react";
import {
  Search, AtSign, Code2, TrendingUp, Mail, Inbox, Sparkles,
  FileJson, Globe, ShieldCheck, Hash, Link2, Lock, Minimize2,
  ChevronDown, Home, Info, MessageSquare, Menu, ArrowRight,
  Zap, Shield, Clock, Users,
} from "lucide-react";

const DOMAIN = "a3a7575d-7562-453d-a6b5-b2000c40d0f1-00-88es2oz8cpj8.sisko.replit.dev";

const TOOLS = [
  { icon: Search,    label: "X Account Checker",      badge: "Popular", color: "text-blue-400",   bg: "bg-blue-400/10",   href: "#" },
  { icon: Sparkles,  label: "AI Bio Generator",        badge: "AI",      color: "text-purple-400", bg: "bg-purple-400/10", href: "#" },
  { icon: FileJson,  label: "JSON Formatter",          badge: "Popular", color: "text-orange-400", bg: "bg-orange-400/10", href: "#" },
  { icon: Globe,     label: "Meta Tag Generator",      badge: "Popular", color: "text-pink-400",   bg: "bg-pink-400/10",   href: "#" },
  { icon: Mail,      label: "Temp Email",              badge: "",        color: "text-cyan-400",   bg: "bg-cyan-400/10",   href: "#" },
  { icon: ShieldCheck, label: "Email Validator",       badge: "New",     color: "text-emerald-400",bg: "bg-emerald-400/10",href: "#" },
  { icon: Hash,      label: "Hashtag Formatter",       badge: "",        color: "text-blue-400",   bg: "bg-blue-400/10",   href: "#" },
  { icon: Link2,     label: "URL Encoder / Decoder",   badge: "",        color: "text-orange-400", bg: "bg-orange-400/10", href: "#" },
  { icon: Lock,      label: "Base64 Encoder",          badge: "",        color: "text-orange-400", bg: "bg-orange-400/10", href: "#" },
  { icon: Minimize2, label: "CSS Minifier",            badge: "",        color: "text-orange-400", bg: "bg-orange-400/10", href: "#" },
  { icon: TrendingUp, label: "Keyword Density",        badge: "",        color: "text-pink-400",   bg: "bg-pink-400/10",   href: "#" },
  { icon: Inbox,     label: "Temp Mail Inbox",         badge: "New",     color: "text-cyan-400",   bg: "bg-cyan-400/10",   href: "#" },
];

const BADGE: Record<string, string> = {
  Popular: "bg-amber-400/15 text-amber-400 border-amber-400/30",
  New:     "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
  AI:      "bg-purple-400/15 text-purple-400 border-purple-400/30",
};

const CATEGORIES = [
  { icon: AtSign,    label: "X Tools",    color: "text-blue-400",    bg: "bg-blue-400/10",    count: 14 },
  { icon: Code2,     label: "Dev Tools",  color: "text-orange-400",  bg: "bg-orange-400/10",  count: 16 },
  { icon: TrendingUp,label: "SEO Tools",  color: "text-pink-400",    bg: "bg-pink-400/10",    count: 7  },
  { icon: Mail,      label: "Email Tools",color: "text-cyan-400",    bg: "bg-cyan-400/10",    count: 6  },
  { icon: Inbox,     label: "Temp Mail",  color: "text-teal-400",    bg: "bg-teal-400/10",    count: 3  },
];

const TRUST = [
  { icon: Shield, label: "No data stored" },
  { icon: Users,  label: "No login required" },
  { icon: Zap,    label: "Instant results" },
  { icon: Clock,  label: "Free forever" },
];

export function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{
        background: "hsl(222, 20%, 13%)",
        color: "hsl(215, 18%, 88%)",
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background aurora */}
      <div style={{
        position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: "80vw", height: "60vh", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 30% center, hsl(258 82% 66% / 0.13), transparent 60%), radial-gradient(ellipse at 70% center, hsl(195 90% 60% / 0.09), transparent 60%)",
      }} />
      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(hsl(220 20% 90% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(220 20% 90% / 0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid hsl(222 16% 23% / 0.6)",
        background: "hsl(222 20% 13% / 0.88)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 1px 0 0 hsl(258 82% 66% / 0.18)",
      }}>
        {/* Violet accent line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right, transparent, hsl(258 82% 66% / 0.45), transparent)",
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, overflow: "hidden", boxShadow: "0 0 12px hsl(258 82% 66% / 0.35)" }}>
              <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
                <defs>
                  <linearGradient id="bg" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#09071a"/><stop offset="100%" stopColor="#110d24"/></linearGradient>
                  <linearGradient id="fr" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="45%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#4c1d95"/></linearGradient>
                </defs>
                <rect width="180" height="180" rx="36" fill="url(#bg)"/>
                <g stroke="url(#fr)" strokeLinecap="round" fill="none"><line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/></g>
                <g stroke="url(#fr)" strokeLinecap="square" strokeLinejoin="miter" fill="none"><polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/></g>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "hsl(215 18% 88%)", letterSpacing: "-0.01em" }}>X Toolkit</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 20,
              border: "1px solid hsl(258 80% 68% / 0.35)", color: "hsl(258 80% 72%)",
              background: "hsl(258 80% 68% / 0.08)",
            }}>44+ Tools</span>
          </div>

          {/* Desktop nav pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 2, padding: "3px 4px",
            borderRadius: 18, background: "hsl(222 16% 19% / 0.7)",
            border: "1px solid hsl(222 16% 23% / 0.7)",
            boxShadow: "inset 0 1px 0 0 hsl(215 18% 88% / 0.03)",
          }}>
            {[
              { icon: Home, label: "Home", active: true },
              { icon: AtSign, label: "X Tools", active: false },
              { icon: Code2, label: "Dev Tools", active: false },
              { icon: TrendingUp, label: "SEO Tools", active: false },
              { icon: Mail, label: "Email Tools", active: false },
              { icon: Inbox, label: "Temp Mail", active: false },
              { icon: Info, label: "About", active: false },
            ].map(({ icon: Icon, label, active }) => (
              <button key={label} style={{
                display: "flex", alignItems: "center", gap: 4, padding: "4px 10px",
                borderRadius: 14, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                background: active ? "hsl(222 20% 17%)" : "transparent",
                color: active ? "hsl(215 18% 88%)" : "hsl(215 12% 56%)",
                boxShadow: active ? "0 1px 3px hsl(222 20% 8% / 0.3)" : "none",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}>
                <Icon size={11} />
                {label}
                {["X Tools","Dev Tools","SEO Tools","Email Tools","Temp Mail"].includes(label) && (
                  <ChevronDown size={9} style={{ opacity: 0.6 }} />
                )}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 30, height: 30, borderRadius: 8, border: "1px solid hsl(222 16% 23%)",
              background: "hsl(222 16% 19% / 0.5)", color: "hsl(215 12% 56%)", cursor: "pointer",
            }}>
              <Search size={14} />
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#fff", border: "none",
              cursor: "pointer", whiteSpace: "nowrap",
              background: "linear-gradient(135deg, hsl(258 80% 60%), hsl(270 80% 55%))",
              boxShadow: "0 0 14px hsl(258 80% 60% / 0.4)",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/></svg>
              Extension
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
              borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
              border: "1px solid hsl(222 16% 23%)", background: "hsl(222 16% 19% / 0.5)",
              color: "hsl(215 12% 60%)",
            }}>
              <MessageSquare size={13} />
              Feedback
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", zIndex: 1, padding: "72px 24px 56px", textAlign: "center", maxWidth: 860, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px",
          borderRadius: 24, border: "1px solid hsl(258 80% 68% / 0.3)",
          background: "hsl(258 80% 68% / 0.08)", marginBottom: 28,
          fontSize: 12, fontWeight: 600, color: "hsl(258 80% 78%)",
        }}>
          <Zap size={12} />
          44+ free tools · no signup required
        </div>

        <h1 style={{ fontSize: 62, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 20, color: "hsl(215 18% 92%)" }}>
          Free online tools for
        </h1>
        <h1 style={{
          fontSize: 62, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 24,
          background: "linear-gradient(90deg, hsl(270 80% 72%), hsl(240 90% 80%), hsl(195 90% 70%), hsl(240 85% 75%), hsl(270 80% 72%))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundSize: "200% auto",
        }}>
          SEO, creators &amp; developers
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: "hsl(215 12% 60%)", marginBottom: 36, maxWidth: 580, margin: "0 auto 36px" }}>
          X account checker, AI bio generators, JSON formatter, Base64 encoder,
          text formatters — all free, all instant, all in one place.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 40 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8, padding: "13px 28px",
            borderRadius: 12, fontSize: 15, fontWeight: 700, color: "#fff",
            border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, hsl(258 80% 60%), hsl(270 80% 55%))",
            boxShadow: "0 0 28px hsl(258 80% 60% / 0.45), 0 4px 16px hsl(258 80% 60% / 0.25)",
          }}>
            Browse All Tools
            <ArrowRight size={15} />
          </button>
          <button style={{
            padding: "13px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer",
            border: "1px solid hsl(222 16% 26%)", background: "hsl(222 18% 17% / 0.8)",
            color: "hsl(215 18% 80%)",
          }}>
            See All Categories
          </button>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              borderRadius: 20, background: "hsl(222 18% 17%)", border: "1px solid hsl(222 16% 23%)",
              fontSize: 11, fontWeight: 500, color: "hsl(215 12% 58%)",
            }}>
              <Icon size={11} style={{ opacity: 0.7 }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES ROW */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px 40px" }}>
        <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
          {CATEGORIES.map(({ icon: Icon, label, color, bg, count }) => (
            <button key={label} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
              borderRadius: 12, border: "1px solid hsl(222 16% 23%)",
              background: "hsl(222 18% 17%)", cursor: "pointer", flexShrink: 0,
              fontSize: 12, fontWeight: 600, color: "hsl(215 18% 80%)",
              transition: "all 0.15s",
            }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 8, background: bg }}>
                <Icon size={13} className={color} style={{ color: color.replace("text-", "").replace("-400", "") }} />
              </span>
              {label}
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 20,
                background: "hsl(222 16% 22%)", color: "hsl(215 12% 55%)",
              }}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TOOLS GRID */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "hsl(215 18% 88%)" }}>Popular Tools</h2>
          <span style={{ fontSize: 12, color: "hsl(215 12% 56%)", cursor: "pointer" }}>View all →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {TOOLS.map(({ icon: Icon, label, badge, color, bg }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
              borderRadius: 12, border: "1px solid hsl(222 16% 23%)",
              background: "hsl(222 18% 17%)", cursor: "pointer",
              transition: "all 0.2s",
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: bg }}>
                <Icon size={15} style={{ color: color.includes("blue") ? "#60a5fa" : color.includes("purple") ? "#c084fc" : color.includes("orange") ? "#fb923c" : color.includes("pink") ? "#f472b6" : color.includes("cyan") ? "#22d3ee" : color.includes("emerald") ? "#34d399" : "#60a5fa" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(215 18% 84%)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {label}
                </div>
              </div>
              {badge && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20,
                  border: "1px solid",
                  ...(badge === "Popular" ? { background: "hsl(38 90% 50% / 0.12)", color: "hsl(38 90% 65%)", borderColor: "hsl(38 90% 50% / 0.3)" }
                    : badge === "AI"      ? { background: "hsl(270 80% 65% / 0.12)", color: "hsl(270 80% 75%)", borderColor: "hsl(270 80% 65% / 0.3)" }
                    : badge === "New"     ? { background: "hsl(142 70% 44% / 0.12)", color: "hsl(142 70% 60%)", borderColor: "hsl(142 70% 44% / 0.3)" }
                    : {}),
                }}>{badge}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        position: "relative", zIndex: 1, borderTop: "1px solid hsl(222 16% 22%)",
        padding: "24px", textAlign: "center",
      }}>
        <p style={{ fontSize: 11, color: "hsl(215 12% 48%)" }}>
          © 2025 X Toolkit — Free tools for developers, creators & SEO professionals
        </p>
      </div>
    </div>
  );
}
