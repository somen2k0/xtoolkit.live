export function VariantA() {
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "linear-gradient(135deg, #0a0618 0%, #0f0a24 40%, #090618 100%)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        color: "#e8e4ff",
      }}
    >
      {/* Background orbs */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      }}>
        <div style={{
          position: "absolute", width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.35) 0%, transparent 70%)",
          top: "-15%", left: "-8%", filter: "blur(90px)",
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.22) 0%, transparent 70%)",
          top: "10%", right: "-5%", filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          bottom: "10%", left: "30%", filter: "blur(70px)",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(180,180,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(180,180,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,6,24,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(139,92,246,0.25)",
        boxShadow: "0 1px 40px rgba(109,40,217,0.15)",
      }}>
        {/* Accent gradient line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.8) 30%, rgba(99,102,241,0.8) 70%, transparent)",
        }} />

        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #6d28d9, #4c1d95)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(109,40,217,0.5)",
              fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: -1,
            }}>X</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#f0edff", letterSpacing: "-0.3px" }}>X Toolkit</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
              background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.35)",
              color: "#a78bfa",
            }}>44+ Tools</span>
          </div>

          {/* Center Nav */}
          <div style={{
            display: "flex", alignItems: "center", gap: 2,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, padding: "4px 6px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
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
                padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                background: item.active ? "rgba(139,92,246,0.2)" : "transparent",
                color: item.active ? "#c4b5fd" : item.color || "rgba(255,255,255,0.55)",
                boxShadow: item.active ? "0 0 0 1px rgba(139,92,246,0.3)" : "none",
                transition: "all 0.15s",
              }}>
                {item.label}
                {!item.active && item.label !== "Home" && item.label !== "About" && (
                  <span style={{ opacity: 0.5, fontSize: 8 }}>▾</span>
                )}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button style={{
              width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14,
            }}>⌕</button>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "#fff", fontSize: 12, fontWeight: 700,
              boxShadow: "0 0 20px rgba(124,58,237,0.5), 0 2px 8px rgba(0,0,0,0.3)",
            }}>⚡ Extension</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main style={{ position: "relative", zIndex: 1, padding: "80px 24px 60px", textAlign: "center" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)",
            color: "#a78bfa", fontSize: 12, fontWeight: 600,
            boxShadow: "0 0 20px rgba(139,92,246,0.15)",
          }}>
            <span>⚡</span>
            44+ free tools · no signup required
          </div>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 58, fontWeight: 800, lineHeight: 1.1, marginBottom: 12,
          color: "#f0edff", letterSpacing: "-2px", maxWidth: 780, margin: "0 auto 12px",
        }}>
          Free online tools for
        </h1>
        <h1 style={{
          fontSize: 58, fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
          background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #67e8f9 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-2px", maxWidth: 780, margin: "0 auto 24px",
        }}>
          SEO, creators & devs
        </h1>
        <p style={{
          fontSize: 17, color: "rgba(230,220,255,0.6)", maxWidth: 560,
          margin: "0 auto 40px", lineHeight: 1.65, fontWeight: 400,
        }}>
          X account checker, AI bio generators, JSON formatter, Base64 encoder,
          text formatters — all free, all instant, all in one place.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 56, flexWrap: "wrap" }}>
          <button style={{
            padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #7c3aed, #6366f1)",
            color: "#fff", fontSize: 15, fontWeight: 700,
            boxShadow: "0 0 30px rgba(124,58,237,0.45), 0 4px 20px rgba(0,0,0,0.3)",
            display: "flex", alignItems: "center", gap: 8,
          }}>Browse All Tools →</button>
          <button style={{
            padding: "14px 32px", borderRadius: 12, cursor: "pointer",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600,
          }}>See All Categories</button>
        </div>

        {/* Trust pills */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {["🛡 No data stored", "✓ No login required", "⚡ Instant results", "∞ Free forever"].map(t => (
            <div key={t} style={{
              padding: "8px 18px", borderRadius: 100,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500,
            }}>{t}</div>
          ))}
        </div>
      </main>
    </div>
  );
}
