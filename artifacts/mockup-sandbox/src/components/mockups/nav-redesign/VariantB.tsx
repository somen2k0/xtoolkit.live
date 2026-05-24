
// Variant B — Same theme, richer saturation & bolder nav
// Background: slightly deeper slate, stronger aurora, vivid violet/indigo accents
// Nav: taller (70px), top accent line, more opaque, glows underneath

export function VariantB() {
  const BG = "#0b1020";
  const CARD = "#111826";
  const TEXT = "#e2e8f5";
  const TEXT_MUTED = "#7c8da8";
  const PRIMARY = "#b09af8";
  const PRIMARY_GLOW = "rgba(139,92,246,0.6)";

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: BG,
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      color: TEXT,
    }}>
      {/* ── Background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Strong top radial */}
        <div style={{
          position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: "90vw", height: "70vh",
          background: "radial-gradient(ellipse at 35% center, hsl(258 82% 60% / 0.38), transparent 55%), radial-gradient(ellipse at 68% center, hsl(195 90% 60% / 0.25), transparent 55%)",
        }} />
        {/* Orbs — vivid */}
        <div style={{
          position: "absolute", width: 680, height: 680, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(270 85% 62% / 0.48) 0%, transparent 70%)",
          top: "-18%", left: "-12%", filter: "blur(85px)", mixBlendMode: "screen",
        }} />
        <div style={{
          position: "absolute", width: 540, height: 540, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(200 90% 62% / 0.34) 0%, transparent 70%)",
          top: "10%", right: "-8%", filter: "blur(78px)", mixBlendMode: "screen",
        }} />
        <div style={{
          position: "absolute", width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(240 88% 70% / 0.28) 0%, transparent 70%)",
          bottom: "15%", right: "15%", filter: "blur(72px)", mixBlendMode: "screen",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(160 80% 55% / 0.22) 0%, transparent 70%)",
          bottom: "3%", left: "22%", filter: "blur(68px)", mixBlendMode: "screen",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(200,190,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(200,190,255,0.045) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "hsl(222 24% 10% / 0.94)",
        backdropFilter: "blur(22px)",
        borderBottom: "1px solid rgba(139,92,246,0.28)",
        boxShadow: "0 4px 40px rgba(109,40,217,0.18), 0 1px 0 rgba(255,255,255,0.04)",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent 0%, #7c3aed 20%, #a78bfa 50%, #818cf8 80%, transparent 100%)",
        }} />
        {/* Bottom glow line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5) 30%, rgba(99,102,241,0.5) 70%, transparent)",
        }} />

        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 28px",
          height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 60%, #4c1d95 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 22px ${PRIMARY_GLOW}`,
              fontSize: 16, fontWeight: 900, color: "#fff",
            }}>X</div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: TEXT, letterSpacing: "-0.4px" }}>X Toolkit</span>
              <span style={{ fontSize: 9.5, color: PRIMARY, fontWeight: 600, letterSpacing: "0.3px" }}>44+ Free Tools</span>
            </div>
          </div>

          {/* Center nav */}
          <div style={{
            display: "flex", alignItems: "center", gap: 1,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18, padding: "5px 7px",
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
                padding: "7px 14px", borderRadius: 13, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                background: item.active
                  ? "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(99,102,241,0.15))"
                  : "transparent",
                color: item.active ? PRIMARY : item.color ?? TEXT_MUTED,
                boxShadow: item.active ? "0 0 0 1px rgba(139,92,246,0.3), 0 2px 10px rgba(109,40,217,0.15)" : "none",
              }}>
                {item.label}
                {!item.active && item.label !== "Home" && item.label !== "About" && (
                  <span style={{ opacity: 0.45, fontSize: 9 }}>▾</span>
                )}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button style={{
              width: 36, height: 36, borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.04)",
              color: TEXT_MUTED,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 15,
            }}>⌕</button>
            <button style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
              color: "#fff", fontSize: 12, fontWeight: 700,
              boxShadow: `0 0 26px ${PRIMARY_GLOW}, 0 2px 10px rgba(0,0,0,0.35)`,
              letterSpacing: "0.2px",
            }}>⚡ Extension</button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 2 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#22c55e", boxShadow: "0 0 6px #22c55e",
              }} />
              <span style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 500 }}>Operational</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main style={{ position: "relative", zIndex: 1, padding: "88px 24px 64px", textAlign: "center" }}>
        {/* Badge */}
        <div style={{ marginBottom: 32 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 18px", borderRadius: 99,
            background: "rgba(139,92,246,0.13)", border: "1px solid rgba(139,92,246,0.38)",
            color: PRIMARY, fontSize: 12, fontWeight: 600,
            boxShadow: "0 0 22px rgba(139,92,246,0.2)",
          }}>⚡ 44+ free tools · no signup required</span>
        </div>

        {/* Headline */}
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h1 style={{
            fontSize: 60, fontWeight: 800, lineHeight: 1.08,
            color: TEXT, letterSpacing: "-2.5px", margin: "0 0 8px",
          }}>Free online tools for</h1>
          <h1 style={{
            fontSize: 60, fontWeight: 800, lineHeight: 1.08,
            background: "linear-gradient(100deg, hsl(270 80% 74%), hsl(245 90% 80%), hsl(195 90% 72%), hsl(245 85% 78%), hsl(270 80% 74%))",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            letterSpacing: "-2.5px", margin: "0 0 26px",
          }}>SEO, creators & developers</h1>
        </div>

        <p style={{
          fontSize: 17, color: TEXT_MUTED, maxWidth: 560,
          margin: "0 auto 44px", lineHeight: 1.7,
        }}>
          X account checker, AI bio generators, JSON formatter, Base64 encoder,
          text formatters — all free, all instant, all in one place.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 56, flexWrap: "wrap" }}>
          <button style={{
            padding: "14px 34px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", fontSize: 15, fontWeight: 700,
            boxShadow: `0 0 32px ${PRIMARY_GLOW}, 0 4px 18px rgba(0,0,0,0.35)`,
          }}>Browse All Tools →</button>
          <button style={{
            padding: "14px 34px", borderRadius: 12, cursor: "pointer",
            background: CARD, border: "1px solid rgba(139,92,246,0.22)",
            color: TEXT, fontSize: 15, fontWeight: 600,
          }}>See All Categories</button>
        </div>

        {/* Trust */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "🛡", label: "No data stored" },
            { icon: "✓", label: "No login required" },
            { icon: "⚡", label: "Instant results" },
            { icon: "∞", label: "Free forever" },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 16px", borderRadius: 10,
              background: CARD, border: "1px solid rgba(255,255,255,0.07)",
              color: TEXT_MUTED, fontSize: 12, fontWeight: 500,
            }}>
              <span>{icon}</span>{label}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
