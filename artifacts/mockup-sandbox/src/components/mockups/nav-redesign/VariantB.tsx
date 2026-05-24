export function VariantB() {
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#04020f",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        color: "#e8e4ff",
      }}
    >
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Top radial burst */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 900, height: 600,
          background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.4) 0%, rgba(99,102,241,0.15) 35%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)",
          top: "-10%", left: "-5%", filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", width: 450, height: 450, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
          top: "5%", right: "-3%", filter: "blur(70px)",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(rgba(150,130,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(150,130,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
      </div>

      {/* NAVBAR — distinct solid dark panel */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,4,20,0.95)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(124,58,237,0.3)",
        boxShadow: "0 4px 60px rgba(80,30,180,0.2)",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent 0%, #7c3aed 25%, #818cf8 50%, #06b6d4 75%, transparent 100%)",
        }} />

        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 28px",
          height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 60%, #4c1d95 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 24px rgba(139,92,246,0.6), 0 0 8px rgba(139,92,246,0.4)",
              fontSize: 17, fontWeight: 900, color: "#fff",
            }}>X</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#f0edff", letterSpacing: "-0.4px", lineHeight: 1.2 }}>X Toolkit</div>
              <div style={{ fontSize: 9, color: "#7c3aed", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>44+ Free Tools</div>
            </div>
          </div>

          {/* Center Nav — pill style with colored icons */}
          <div style={{
            display: "flex", alignItems: "center", gap: 1,
            background: "rgba(20,10,40,0.8)", border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 16, padding: "5px 8px",
          }}>
            {[
              { label: "Home", icon: "⌂", active: true },
              { label: "X Tools", icon: "◎", color: "#60a5fa" },
              { label: "Dev Tools", icon: "</>", color: "#fb923c" },
              { label: "SEO", icon: "↗", color: "#f472b6" },
              { label: "Email", icon: "✉", color: "#22d3ee" },
              { label: "Temp Mail", icon: "📥", color: "#34d399" },
              { label: "About", icon: "ℹ", color: "#94a3b8" },
            ].map((item) => (
              <button key={item.label} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "7px 13px", borderRadius: 11, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                background: item.active
                  ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.2))"
                  : "transparent",
                color: item.active ? "#c4b5fd" : item.color || "rgba(255,255,255,0.45)",
                boxShadow: item.active ? "0 0 0 1px rgba(124,58,237,0.4), 0 2px 8px rgba(124,58,237,0.15)" : "none",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 10, opacity: 0.8 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button style={{
              width: 36, height: 36, borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 15,
            }}>⌕</button>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 18px", borderRadius: 11, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
              color: "#fff", fontSize: 12, fontWeight: 700,
              boxShadow: "0 0 24px rgba(124,58,237,0.55), 0 2px 12px rgba(0,0,0,0.4)",
              letterSpacing: "0.2px",
            }}>⚡ Extension</button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 4 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#22c55e", boxShadow: "0 0 6px #22c55e",
              }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Live</span>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main style={{ position: "relative", zIndex: 1, padding: "88px 24px 64px", textAlign: "center" }}>
        {/* Badge */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 20px", borderRadius: 100,
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.1))",
            border: "1px solid rgba(139,92,246,0.4)",
            color: "#a78bfa", fontSize: 12, fontWeight: 600,
            boxShadow: "0 0 24px rgba(124,58,237,0.2)",
          }}>
            <span style={{ color: "#fbbf24" }}>⚡</span>
            44+ free tools · no signup required
          </div>
        </div>

        {/* Headline */}
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h1 style={{
            fontSize: 64, fontWeight: 900, lineHeight: 1.05,
            color: "#f5f0ff", letterSpacing: "-2.5px", marginBottom: 8,
          }}>
            Free online tools for
          </h1>
          <h1 style={{
            fontSize: 64, fontWeight: 900, lineHeight: 1.05,
            background: "linear-gradient(100deg, #a78bfa 0%, #818cf8 35%, #38bdf8 70%, #34d399 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-2.5px", marginBottom: 28,
          }}>
            SEO, creators & devs
          </h1>
        </div>

        <p style={{
          fontSize: 17, color: "rgba(200,185,255,0.55)", maxWidth: 560,
          margin: "0 auto 44px", lineHeight: 1.7, fontWeight: 400,
        }}>
          X account checker, AI bio generators, JSON formatter, Base64 encoder,
          text formatters — all free, all instant, all in one place.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 64, flexWrap: "wrap" }}>
          <button style={{
            padding: "15px 36px", borderRadius: 13, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #7c3aed, #6366f1)",
            color: "#fff", fontSize: 15, fontWeight: 700,
            boxShadow: "0 0 40px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", gap: 8,
          }}>Browse All Tools <span>→</span></button>
          <button style={{
            padding: "15px 36px", borderRadius: 13, cursor: "pointer",
            background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)", fontSize: 15, fontWeight: 600,
          }}>See All Categories</button>
        </div>

        {/* Trust grid */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "🛡", label: "No data stored" },
            { icon: "✓", label: "No login required" },
            { icon: "⚡", label: "Instant results" },
            { icon: "∞", label: "Free forever" },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 12,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500,
            }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
