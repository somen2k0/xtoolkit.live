import { useState } from "react";
import {
  Search, AtSign, Code2, TrendingUp, Mail, Inbox, Sparkles,
  FileJson, Globe, ShieldCheck, Hash, Lock,
  ArrowRight, Zap, Shield, Clock, Users, Star,
  Terminal, Layers, BarChart3, ChevronRight,
} from "lucide-react";

const TOOLS = [
  { icon: Search,    label: "X Account Checker",    badge: "Popular", tag: "X Tools",    color: "#60a5fa", glow: "rgba(96,165,250,0.15)" },
  { icon: Sparkles,  label: "AI Bio Generator",     badge: "AI",      tag: "X Tools",    color: "#c084fc", glow: "rgba(192,132,252,0.15)" },
  { icon: FileJson,  label: "JSON Formatter",       badge: "Popular", tag: "Dev Tools",  color: "#fb923c", glow: "rgba(251,146,60,0.15)" },
  { icon: Globe,     label: "Meta Tag Generator",   badge: "Popular", tag: "SEO",        color: "#f472b6", glow: "rgba(244,114,182,0.15)" },
  { icon: Mail,      label: "Temp Email",           badge: "",        tag: "Email",      color: "#22d3ee", glow: "rgba(34,211,238,0.15)" },
  { icon: ShieldCheck,label:"Email Validator",      badge: "New",     tag: "Email",      color: "#4ade80", glow: "rgba(74,222,128,0.15)" },
  { icon: Hash,      label: "Hashtag Formatter",    badge: "",        tag: "X Tools",    color: "#60a5fa", glow: "rgba(96,165,250,0.15)" },
  { icon: Lock,      label: "Base64 Encoder",       badge: "",        tag: "Dev Tools",  color: "#fb923c", glow: "rgba(251,146,60,0.15)" },
];

const STATS = [
  { value: "44+",    label: "Free Tools",   icon: Layers },
  { value: "0",      label: "Sign‑ups",     icon: Users },
  { value: "100%",   label: "Free Forever", icon: Shield },
  { value: "∞",      label: "Usage Limit",  icon: Zap },
];

const CATEGORIES = [
  { icon: AtSign,    label: "X Tools",     count: 14, color: "#60a5fa", active: true },
  { icon: Code2,     label: "Dev Tools",   count: 16, color: "#fb923c", active: false },
  { icon: TrendingUp,label: "SEO Tools",   count: 7,  color: "#f472b6", active: false },
  { icon: Mail,      label: "Email Tools", count: 6,  color: "#22d3ee", active: false },
  { icon: Inbox,     label: "Temp Mail",   count: 3,  color: "#2dd4bf", active: false },
];

const BADGE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  Popular: { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  AI:      { bg: "rgba(192,132,252,0.1)", color: "#c084fc", border: "rgba(192,132,252,0.25)" },
  New:     { bg: "rgba(74,222,128,0.1)",  color: "#4ade80", border: "rgba(74,222,128,0.25)" },
};

export function Homepage() {
  const [activecat, setActivecat] = useState("X Tools");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      color: "#e2e8f0",
      fontFamily: "'Inter', system-ui, sans-serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* Subtle top glow */}
      <div style={{
        position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 500, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(13,17,23,0.85)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, overflow: "hidden", boxShadow: "0 0 16px rgba(124,58,237,0.5)" }}>
              <svg width="30" height="30" viewBox="0 0 180 180" fill="none">
                <defs>
                  <linearGradient id="b" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse"><stop stopColor="#09071a"/><stop offset="1" stopColor="#110d24"/></linearGradient>
                  <linearGradient id="f" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#c4b5fd"/><stop offset=".45" stopColor="#7c3aed"/><stop offset="1" stopColor="#4c1d95"/></linearGradient>
                </defs>
                <rect width="180" height="180" rx="36" fill="url(#b)"/>
                <g stroke="url(#f)" strokeLinecap="round" fill="none"><line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/></g>
                <g stroke="url(#f)" strokeLinecap="square" fill="none"><polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/></g>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", color: "#f1f5f9" }}>X Toolkit</span>
            <div style={{ height: 16, width: 1, background: "rgba(255,255,255,0.12)", margin: "0 4px" }} />
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>44+ free tools</span>
          </div>
          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {["Home","X Tools","Dev Tools","SEO Tools","Email Tools","Temp Mail","About"].map((item, i) => (
              <button key={item} style={{
                padding: "5px 11px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                background: i === 0 ? "rgba(255,255,255,0.08)" : "transparent",
                color: i === 0 ? "#f1f5f9" : "#64748b",
                border: "none", cursor: "pointer",
              }}>{item}</button>
            ))}
          </div>
          {/* CTA */}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
              color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}>
              <Search size={13} /> Search
            </button>
            <button style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "#fff", border: "none", cursor: "pointer",
              boxShadow: "0 0 20px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}>Extension →</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px 64px", textAlign: "center", position: "relative" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px 5px 8px", borderRadius: 100,
          border: "1px solid rgba(124,58,237,0.3)",
          background: "rgba(124,58,237,0.08)",
          marginBottom: 32, cursor: "pointer",
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, background: "#7c3aed",
            color: "#fff", padding: "2px 7px", borderRadius: 100,
          }}>NEW</span>
          <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 500 }}>44 tools, no account needed</span>
          <ChevronRight size={13} style={{ color: "#a78bfa" }} />
        </div>

        <h1 style={{
          fontSize: 68, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06,
          margin: "0 auto 20px",
          background: "linear-gradient(180deg, #f8fafc 0%, #94a3b8 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Free online tools for<br />
          <span style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>developers & creators</span>
        </h1>

        <p style={{
          fontSize: 18, lineHeight: 1.7, color: "#64748b",
          maxWidth: 540, margin: "0 auto 40px",
        }}>
          X account checker, AI bios, JSON formatter, Base64 encoder — instant results, no login, no limits.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 60 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700,
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color: "#fff", border: "none", cursor: "pointer",
            boxShadow: "0 0 32px rgba(124,58,237,0.5), 0 4px 24px rgba(124,58,237,0.3)",
          }}>
            Browse All Tools <ArrowRight size={16} />
          </button>
          <button style={{
            padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
            color: "#cbd5e1", cursor: "pointer",
          }}>
            View Categories
          </button>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "inline-flex", gap: 0,
          borderRadius: 16, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.03)",
        }}>
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <div key={label} style={{
              padding: "16px 32px", textAlign: "center",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em" }}>{value}</div>
              <div style={{ fontSize: 11, color: "#475569", fontWeight: 500, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOOLS SECTION ─────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        {/* Category filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {CATEGORIES.map(({ icon: Icon, label, count, color }) => {
            const isActive = activecat === label;
            return (
              <button
                key={label}
                onClick={() => setActivecat(label)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s",
                  border: isActive ? `1px solid ${color}40` : "1px solid rgba(255,255,255,0.07)",
                  background: isActive ? `${color}12` : "rgba(255,255,255,0.03)",
                  color: isActive ? color : "#475569",
                }}
              >
                <Icon size={13} />
                {label}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 100,
                  background: isActive ? `${color}20` : "rgba(255,255,255,0.05)",
                  color: isActive ? color : "#475569",
                }}>{count}</span>
              </button>
            );
          })}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "#475569", display: "flex", alignItems: "center" }}>
            View all tools →
          </span>
        </div>

        {/* Tools grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {TOOLS.map(({ icon: Icon, label, badge, color, glow }) => (
            <div
              key={label}
              style={{
                padding: "18px", borderRadius: 14, cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                transition: "all 0.2s",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Subtle corner glow */}
              <div style={{
                position: "absolute", top: -20, right: -20, width: 80, height: 80,
                borderRadius: "50%", background: glow, pointerEvents: "none",
              }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `${color}14`,
                  border: `1px solid ${color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={17} style={{ color }} />
                </div>
                {badge && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 7px",
                    borderRadius: 100, border: `1px solid ${BADGE_STYLE[badge].border}`,
                    background: BADGE_STYLE[badge].bg, color: BADGE_STYLE[badge].color,
                  }}>{badge}</span>
                )}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4 }}>{label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10 }}>
                <span style={{ fontSize: 11, color: "#475569" }}>Open tool</span>
                <ArrowRight size={11} style={{ color: "#475569" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM FEATURE BAR ────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.015)",
        padding: "28px 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 32 }}>
            {[
              { icon: Shield, label: "No data stored" },
              { icon: Users,  label: "No login required" },
              { icon: Zap,    label: "Instant results" },
              { icon: Clock,  label: "Free forever" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} style={{ color: "#475569" }} />
                <span style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
            <span style={{ fontSize: 11, color: "#475569" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
