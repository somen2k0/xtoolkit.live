import {
  Search, AtSign, Code2, TrendingUp, Mail, Inbox, Sparkles,
  FileJson, Globe, ShieldCheck, Hash, Link2, Lock, Minimize2,
  ChevronDown, Home, Info, MessageSquare, Zap, Check, X,
} from "lucide-react";

const TOOLS_BY_CAT = {
  "X Tools": [
    { icon: Search,    label: "Account Checker",      badge: "Popular" },
    { icon: Sparkles,  label: "AI Bio Generator",     badge: "AI" },
    { icon: AtSign,    label: "Username Generator",   badge: "" },
    { icon: Hash,      label: "Hashtag Formatter",    badge: "" },
  ],
  "Dev Tools": [
    { icon: FileJson,  label: "JSON Formatter",       badge: "Popular" },
    { icon: Lock,      label: "Base64 Encoder",       badge: "" },
    { icon: Link2,     label: "URL Encoder",          badge: "" },
    { icon: Minimize2, label: "CSS Minifier",         badge: "" },
  ],
  "SEO Tools": [
    { icon: Globe,     label: "Meta Tag Generator",   badge: "Popular" },
    { icon: TrendingUp, label: "Keyword Density",    badge: "" },
  ],
  "Email Tools": [
    { icon: Mail,      label: "Subject Line Generator", badge: "" },
    { icon: ShieldCheck, label: "Email Validator",    badge: "New" },
  ],
};

const BADGE: Record<string, { bg: string; color: string; border: string }> = {
  Popular: { bg: "hsl(38 90% 50% / 0.12)", color: "hsl(38 90% 65%)", border: "hsl(38 90% 50% / 0.3)" },
  AI:      { bg: "hsl(270 80% 65% / 0.12)", color: "hsl(270 80% 75%)", border: "hsl(270 80% 65% / 0.3)" },
  New:     { bg: "hsl(142 70% 44% / 0.12)", color: "hsl(142 70% 60%)", border: "hsl(142 70% 44% / 0.3)" },
};

const CAT_COLORS: Record<string, { icon: string; text: string }> = {
  "X Tools":     { icon: "#60a5fa", text: "#60a5fa" },
  "Dev Tools":   { icon: "#fb923c", text: "#fb923c" },
  "SEO Tools":   { icon: "#f472b6", text: "#f472b6" },
  "Email Tools": { icon: "#22d3ee", text: "#22d3ee" },
};

const CAT_ICONS: Record<string, typeof Search> = {
  "X Tools": AtSign, "Dev Tools": Code2, "SEO Tools": TrendingUp, "Email Tools": Mail,
};

export function Navbar() {
  const activeDropdown = "X Tools";

  return (
    <div style={{
      minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif",
      background: "hsl(222, 20%, 11%)",
      display: "flex", flexDirection: "column",
    }}>
      {/* MAIN NAVBAR */}
      <nav style={{
        position: "relative", zIndex: 50,
        borderBottom: "1px solid hsl(222 16% 23% / 0.6)",
        background: "hsl(222 20% 13% / 0.92)",
        backdropFilter: "blur(16px)",
      }}>
        {/* Accent line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(to right, transparent, hsl(258 82% 66% / 0.5), transparent)",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, overflow: "hidden", boxShadow: "0 0 12px hsl(258 82% 66% / 0.35)" }}>
              <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
                <defs>
                  <linearGradient id="bg2" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#09071a"/><stop offset="100%" stopColor="#110d24"/></linearGradient>
                  <linearGradient id="fr2" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="45%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#4c1d95"/></linearGradient>
                </defs>
                <rect width="180" height="180" rx="36" fill="url(#bg2)"/>
                <g stroke="url(#fr2)" strokeLinecap="round" fill="none"><line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/></g>
                <g stroke="url(#fr2)" strokeLinecap="square" strokeLinejoin="miter" fill="none"><polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/></g>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "hsl(215 18% 88%)", letterSpacing: "-0.01em" }}>X Toolkit</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 20,
              border: "1px solid hsl(258 80% 68% / 0.35)", color: "hsl(258 80% 74%)",
              background: "hsl(258 80% 68% / 0.09)",
            }}>44+ Tools</span>
          </div>

          {/* Nav pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 1, padding: "3px 4px",
            borderRadius: 18, background: "hsl(222 16% 18% / 0.8)",
            border: "1px solid hsl(222 16% 24% / 0.7)",
          }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 3.5, padding: "4px 10px",
              borderRadius: 14, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
              background: "hsl(222 20% 17%)", color: "hsl(215 18% 88%)",
              boxShadow: "0 1px 3px hsl(222 20% 8% / 0.3)",
            }}>
              <Home size={11} /> Home
            </button>

            {Object.keys(TOOLS_BY_CAT).map((cat) => {
              const Icon = CAT_ICONS[cat];
              const isActive = cat === activeDropdown;
              return (
                <button key={cat} style={{
                  display: "flex", alignItems: "center", gap: 3.5, padding: "4px 10px",
                  borderRadius: 14, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                  background: isActive ? `${CAT_COLORS[cat].icon}18` : "transparent",
                  color: isActive ? CAT_COLORS[cat].text : "hsl(215 12% 56%)",
                  transition: "all 0.15s",
                }}>
                  <Icon size={11} />
                  {cat}
                  <ChevronDown size={9} style={{ opacity: 0.6, transform: isActive ? "rotate(180deg)" : "none", transition: "0.15s" }} />
                </button>
              );
            })}

            <button style={{
              display: "flex", alignItems: "center", gap: 3.5, padding: "4px 10px",
              borderRadius: 14, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
              background: "transparent", color: "hsl(215 12% 56%)",
            }}>
              <Inbox size={11} /> Temp Mail <ChevronDown size={9} style={{ opacity: 0.6 }} />
            </button>

            <button style={{
              display: "flex", alignItems: "center", gap: 3.5, padding: "4px 10px",
              borderRadius: 14, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
              background: "transparent", color: "hsl(215 12% 56%)",
            }}>
              <Info size={11} /> About
            </button>
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <button style={{
              width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid hsl(222 16% 24%)", background: "hsl(222 16% 19% / 0.6)",
              color: "hsl(215 12% 56%)", cursor: "pointer",
            }}>
              <Search size={13} />
            </button>

            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#fff", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, hsl(258 80% 60%), hsl(270 80% 55%))",
              boxShadow: "0 0 14px hsl(258 80% 60% / 0.4)",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/></svg>
              Extension
            </button>

            <button style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
              borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
              border: "1px solid hsl(222 16% 24%)", background: "hsl(222 16% 19% / 0.5)",
              color: "hsl(215 12% 58%)",
            }}>
              <MessageSquare size={13} /> Feedback
            </button>
          </div>
        </div>
      </nav>

      {/* OPEN DROPDOWN (X Tools) */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        <div style={{
          position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
          width: 240, zIndex: 40,
          borderRadius: 14, border: "1px solid hsl(222 16% 24%)",
          background: "hsl(222 20% 15%)", backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px hsl(222 20% 8% / 0.5), 0 2px 8px hsl(258 80% 60% / 0.08)",
          padding: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 6px" }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#60a5fa" }}>X Tools</span>
            <span style={{ fontSize: 10, color: "hsl(215 12% 52%)", cursor: "pointer" }}>View all →</span>
          </div>
          <div style={{ height: 1, background: "hsl(222 16% 24% / 0.5)", margin: "0 4px 6px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {TOOLS_BY_CAT["X Tools"].map(({ icon: Icon, label, badge }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "6px 8px",
                borderRadius: 9, cursor: "pointer", transition: "background 0.1s",
                background: label === "Account Checker" ? "hsl(222 16% 20%)" : "transparent",
              }}>
                <Icon size={13} style={{ color: "hsl(215 12% 54%)", flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: "hsl(215 18% 82%)", flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 20, border: "1px solid",
                    ...BADGE[badge],
                  }}>{badge}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SPACER + INFO PANELS */}
      <div style={{ flex: 1, padding: "80px 24px 40px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>

        {/* Feature labels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          {/* No theme toggle highlight */}
          <div style={{
            padding: "18px 20px", borderRadius: 14,
            border: "1px solid hsl(142 70% 44% / 0.25)", background: "hsl(142 70% 44% / 0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "hsl(142 70% 44% / 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={12} style={{ color: "hsl(142 70% 55%)" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "hsl(142 70% 60%)" }}>Theme Toggle Removed</span>
            </div>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: "hsl(215 12% 55%)", margin: 0 }}>
              The Sun/Moon buttons are gone. The site is permanently set to this professional dark slate theme.
            </p>
          </div>

          {/* Feedback close fix */}
          <div style={{
            padding: "18px 20px", borderRadius: 14,
            border: "1px solid hsl(258 80% 68% / 0.25)", background: "hsl(258 80% 68% / 0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "hsl(258 80% 68% / 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={12} style={{ color: "hsl(258 80% 75%)" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "hsl(258 80% 78%)" }}>Feedback Close Fixed</span>
            </div>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: "hsl(215 12% 55%)", margin: 0 }}>
              The ✕ button on the Feedback modal was broken due to a prop mismatch. It now properly closes on click.
            </p>
          </div>
        </div>

        {/* Color palette display */}
        <div style={{ padding: "20px", borderRadius: 14, border: "1px solid hsl(222 16% 24%)", background: "hsl(222 18% 16%)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "hsl(215 18% 70%)", marginBottom: 14, margin: "0 0 14px" }}>New Theme Palette</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "Background", color: "hsl(222, 20%, 13%)", hex: "#1a1e2a" },
              { label: "Card",       color: "hsl(222, 18%, 17%)", hex: "#222736" },
              { label: "Border",     color: "hsl(222, 16%, 23%)", hex: "#2d3347" },
              { label: "Muted text", color: "hsl(215, 12%, 56%)", hex: "#828da5" },
              { label: "Foreground", color: "hsl(215, 18%, 88%)", hex: "#d8dde8" },
              { label: "Primary",    color: "hsl(258, 80%, 68%)", hex: "#8b5cf6" },
            ].map(({ label, color, hex }) => (
              <div key={label} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: 36, borderRadius: 8, background: color, marginBottom: 6, border: "1px solid hsl(222 16% 30% / 0.4)" }} />
                <div style={{ fontSize: 9, fontWeight: 700, color: "hsl(215 12% 58%)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                <div style={{ fontSize: 9, color: "hsl(215 12% 45%)", fontFamily: "monospace" }}>{hex}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
