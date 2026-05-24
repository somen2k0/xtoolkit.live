import { useState } from "react";
import { Sun, Moon, Home, AtSign, Code2, TrendingUp, Mail, Inbox, Info, ChevronDown, Search, Sparkles, MessageSquare } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", active: true, color: "" },
  { icon: AtSign, label: "X Tools", color: "#60a5fa" },
  { icon: Code2, label: "Dev Tools", color: "#fb923c" },
  { icon: TrendingUp, label: "SEO Tools", color: "#f472b6" },
  { icon: Mail, label: "Email Tools", color: "#22d3ee" },
  { icon: Inbox, label: "Temp Mail", color: "#2dd4bf" },
  { icon: Info, label: "About", color: "" },
];

export function Dark() {
  const [active, setActive] = useState("Home");

  return (
    <div style={{ minHeight: "100vh", background: "#0b0e1a", color: "#dde1f0", fontFamily: "Inter, system-ui, sans-serif", margin: 0, padding: 0 }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,14,26,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 1px 24px rgba(0,0,0,0.35)"
      }}>
        {/* Violet accent line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.55), transparent)" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, overflow: "hidden", boxShadow: "0 0 14px rgba(124,58,237,0.45)" }}>
              <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
                <defs>
                  <linearGradient id="dBg" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#09071a"/><stop offset="100%" stopColor="#110d24"/>
                  </linearGradient>
                  <linearGradient id="dF" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#c4b5fd"/><stop offset="45%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#4c1d95"/>
                  </linearGradient>
                </defs>
                <rect width="180" height="180" rx="36" fill="url(#dBg)"/>
                <g stroke="#2e1878" strokeLinecap="round" fill="none" transform="translate(2,2)">
                  <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/>
                  <line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
                </g>
                <g stroke="url(#dF)" strokeLinecap="round" fill="none">
                  <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/>
                  <line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
                </g>
                <g stroke="url(#dF)" strokeLinecap="square" fill="none">
                  <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/>
                  <polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
                </g>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.02em", color: "#dde1f0" }}>X Toolkit</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa", background: "rgba(139,92,246,0.08)" }}>44+ Tools</span>
          </div>

          {/* Command bar */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 0,
              padding: "3px 4px", borderRadius: 18,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)"
            }}>
              {NAV_ITEMS.map(({ icon: Icon, label, active: isDefault, color }) => {
                const isActive = active === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActive(label)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: 12, border: "none", cursor: "pointer",
                      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", transition: "all 0.15s",
                      background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                      color: isActive ? "#fff" : (color || "rgba(255,255,255,0.38)"),
                      boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.4)" : "none"
                    }}
                  >
                    <Icon size={11} style={{ flexShrink: 0 }} />
                    {label}
                    {color && <ChevronDown size={9} style={{ opacity: 0.5 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {/* Search */}
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "rgba(255,255,255,0.35)", display: "flex" }}>
              <Search size={15} />
            </button>

            {/* Theme pill */}
            <div style={{
              display: "flex", alignItems: "center", gap: 2,
              padding: 4, borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)"
            }}>
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 24, height: 24, borderRadius: 999,
                color: "rgba(255,255,255,0.28)", background: "transparent"
              }}>
                <Sun size={13} />
              </span>
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 24, height: 24, borderRadius: 999,
                color: "#818cf8",
                background: "rgba(99,102,241,0.18)",
                boxShadow: "0 0 8px rgba(99,102,241,0.4)"
              }}>
                <Moon size={13} />
              </span>
            </div>

            {/* Extension CTA */}
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap",
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              boxShadow: "0 0 14px rgba(139,92,246,0.4)"
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/>
              </svg>
              Extension
            </button>

            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "rgba(255,255,255,0.3)", display: "flex" }}>
              <MessageSquare size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80, paddingLeft: 24, paddingRight: 24, textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.55)", marginBottom: 32
        }}>
          <Sparkles size={12} style={{ color: "#a78bfa" }} />
          44+ free tools · no signup required
        </div>

        <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12, color: "#dde1f0" }}>
          Free online tools for
        </div>
        <div style={{
          fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20,
          background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #67e8f9 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          SEO, creators &amp; developers
        </div>
        <p style={{ color: "rgba(255,255,255,0.42)", maxWidth: 520, lineHeight: 1.65, fontSize: 15, marginTop: 0 }}>
          X account checker, AI bio generators, JSON formatter, Base64 encoder,
          text formatters — all free, all instant, all in one place.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button style={{
            padding: "10px 22px", borderRadius: 12, border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600, color: "#fff",
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            boxShadow: "0 0 22px rgba(139,92,246,0.38)"
          }}>
            Browse All Tools →
          </button>
          <button style={{
            padding: "10px 22px", borderRadius: 12, cursor: "pointer",
            fontSize: 14, fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.14)",
            color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.04)"
          }}>
            See All Categories
          </button>
        </div>

        {/* Active theme badge */}
        <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Active Theme</span>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 18px", borderRadius: 999,
            border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.1)"
          }}>
            <Moon size={15} style={{ color: "#818cf8" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc" }}>Dark Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
