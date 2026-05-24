
// Variant A — Same theme, stronger presence
// Background: hsl(222 22% 9%) slate navy, Primary: hsl(258 82% 70%) violet
// Changes: bigger nav (66px), bolder text, stronger orbs, more vivid colors

export function VariantA() {
  const BG = "#0e1220";
  const CARD = "#141929";
  const BORDER = "rgba(139,92,246,0.22)";
  const PRIMARY = "#a78bfa";
  const PRIMARY_BRIGHT = "#8b5cf6";
  const TEXT = "#dde4f0";
  const TEXT_MUTED = "#8a9ab5";

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: BG,
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      color: TEXT,
    }}>
      {/* ── Background effects ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Orb 1 — violet, top-left, much stronger */}
        <div style={{
          position: "absolute", width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(270 82% 60% / 0.45) 0%, transparent 70%)",
          top: "-15%", left: "-10%", filter: "blur(88px)", mixBlendMode: "screen",
        }} />
        {/* Orb 2 — cyan, top-right */}
        <div style={{
          position: "absolute", width: 530, height: 530, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(195 90% 60% / 0.32) 0%, transparent 70%)",
          top: "5%", right: "-8%", filter: "blur(80px)", mixBlendMode: "screen",
        }} />
        {/* Orb 3 — green, bottom */}
        <div style={{
          position: "absolute", width: 430, height: 430, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(160 80% 55% / 0.26) 0%, transparent 70%)",
          bottom: "5%", left: "28%", filter: "blur(70px)", mixBlendMode: "screen",
        }} />
        {/* Aurora */}
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "80vw", height: "60vh",
          background: "radial-gradient(ellipse at 30% center, hsl(258 82% 66% / 0.30), transparent 60%), radial-gradient(ellipse at 70% center, hsl(195 90% 60% / 0.22), transparent 60%)",
          pointerEvents: "none",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(hsl(220 20% 90% / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(220 20% 90% / 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `hsl(222 22% 9% / 0.92)`,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${BORDER}`,
        boxShadow: "0 2px 32px rgba(139,92,246,0.12)",
      }}>
        {/* Bottom accent — stronger */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.9) 25%, rgba(99,102,241,0.9) 75%, transparent 100%)",
        }} />

        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          height: 66, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #6d28d9, #4c1d95)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(109,40,217,0.55)",
              fontSize: 15, fontWeight: 900, color: "#fff",
            }}>X</div>
            <span style={{ fontWeight: 700, fontSize: 14, color: TEXT, letterSpacing: "-0.3px" }}>X Toolkit</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
              background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)",
              color: PRIMARY,
            }}>44+ Tools</span>
          </div>

          {/* Center nav — bigger, bolder */}
          <div style={{
            display: "flex", alignItems: "center", gap: 1,
            background: "hsl(222 16% 18% / 0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: "4px 6px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 12px rgba(0,0,0,0.25)",
          }}>
            {[
              { label: "Home", active: true },
              { label: "X Tools", color: "#60a5fa" },
              { label: "Dev Tools", color: "#fb923c" },
              { label: "SEO Tools", color: "#f472b6" },
              { label: "Email Tools", color: "#22d3ee" },
              { label: "Temp Mail", color: "#34d399" },
              { label: "About" },
            ].map((item) => (
              <button key={item.label} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "7px 13px", borderRadius: 11, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                background: item.active ? "hsl(222 22% 14% / 1)" : "transparent",
                color: item.active ? TEXT : item.color ?? TEXT_MUTED,
                boxShadow: item.active ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
              }}>
                {item.label}
                {!item.active && item.label !== "Home" && item.label !== "About" && (
                  <span style={{ opacity: 0.5, fontSize: 9 }}>▾</span>
                )}
              </button>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button style={{
              width: 34, height: 34, borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.04)",
              color: TEXT_MUTED,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 15,
            }}>⌕</button>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 9, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${PRIMARY_BRIGHT}, #6d28d9)`,
              color: "#fff", fontSize: 12, fontWeight: 700,
              boxShadow: `0 0 20px rgba(139,92,246,0.5), 0 2px 8px rgba(0,0,0,0.3)`,
            }}>⚡ Extension</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main style={{ position: "relative", zIndex: 1, padding: "80px 24px 60px", textAlign: "center" }}>
        {/* Badge */}
        <div style={{ marginBottom: 32 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 99,
            background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.35)",
            color: PRIMARY, fontSize: 12, fontWeight: 600,
            boxShadow: "0 0 20px rgba(139,92,246,0.15)",
          }}>⚡ 44+ free tools · no signup required</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 58, fontWeight: 800, lineHeight: 1.1,
          color: TEXT, letterSpacing: "-2px", margin: "0 auto 8px", maxWidth: 780,
        }}>Free online tools for</h1>
        <h1 style={{
          fontSize: 58, fontWeight: 800, lineHeight: 1.1,
          background: "linear-gradient(90deg, hsl(270 80% 72%), hsl(240 90% 80%), hsl(195 90% 70%), hsl(240 85% 75%), hsl(270 80% 72%))",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          letterSpacing: "-2px", margin: "0 auto 24px", maxWidth: 780,
        }}>SEO, creators & developers</h1>

        <p style={{
          fontSize: 17, color: TEXT_MUTED, maxWidth: 560,
          margin: "0 auto 40px", lineHeight: 1.65,
        }}>
          X account checker, AI bio generators, JSON formatter, Base64 encoder,
          text formatters — all free, all instant, all in one place.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 52, flexWrap: "wrap" }}>
          <button style={{
            padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${PRIMARY_BRIGHT}, #6d28d9)`,
            color: "#fff", fontSize: 15, fontWeight: 700,
            boxShadow: "0 0 28px rgba(139,92,246,0.45), 0 4px 16px rgba(0,0,0,0.3)",
          }}>Browse All Tools →</button>
          <button style={{
            padding: "14px 32px", borderRadius: 12, cursor: "pointer",
            background: CARD, border: `1px solid ${BORDER}`,
            color: TEXT, fontSize: 15, fontWeight: 600,
          }}>See All Categories</button>
        </div>

        {/* Trust */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {["🛡 No data stored", "✓ No login required", "⚡ Instant results", "∞ Free forever"].map(t => (
            <div key={t} style={{
              padding: "8px 16px", borderRadius: 10,
              background: CARD, border: `1px solid rgba(255,255,255,0.07)`,
              color: TEXT_MUTED, fontSize: 12, fontWeight: 500,
            }}>{t}</div>
          ))}
        </div>
      </main>
    </div>
  );
}
