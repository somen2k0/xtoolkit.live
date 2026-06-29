import { Shield, Zap, Code, ArrowRight, Search, Menu } from "lucide-react";

const COLORS = {
  bg: "#F5EFE6",
  bgCard: "#FFFCF8",
  primary: "#F5390A",
  primaryHover: "#D42D06",
  text: "#1C1C1C",
  muted: "#6B6560",
  border: "#E4D8CC",
  navBg: "rgba(245, 239, 230, 0.92)",
  accent: "#FDE8E2",
  accentText: "#C73008",
  badge: "#FDEEE9",
  badgeBorder: "#F5C4B5",
};

const TOOLS = [
  { icon: "🐦", name: "X Account Checker", desc: "Check 100 accounts at once", cat: "Social" },
  { icon: "📧", name: "Temp Gmail Generator", desc: "Real @gmail.com addresses", cat: "Email" },
  { icon: "🔑", name: "JWT Decoder", desc: "Decode & inspect JWT tokens", cat: "Dev" },
  { icon: "🔒", name: "Password Generator", desc: "Secure passwords instantly", cat: "Dev" },
  { icon: "🤖", name: "AI Detector", desc: "Detect AI-written content", cat: "AI" },
  { icon: "📝", name: "Bio Generator", desc: "Generate Twitter bios fast", cat: "AI" },
  { icon: "🔗", name: "URL Slug Generator", desc: "SEO-friendly URL slugs", cat: "SEO" },
  { icon: "📊", name: "Keyword Density", desc: "Analyze keyword usage", cat: "SEO" },
  { icon: "🎨", name: "CSS Gradient Generator", desc: "Beautiful CSS gradients", cat: "Dev" },
];

const WHY = [
  { icon: Shield, title: "Runs in your browser", desc: "All tools process data locally. Nothing sent to servers." },
  { icon: Zap, title: "No signup ever", desc: "Every tool works immediately. No account needed." },
  { icon: Code, title: "Built for real work", desc: "Tools developers and creators use daily." },
];

const CATS = ["All", "Social", "AI Writing", "Developer", "SEO", "Email", "Text"];

export function HomePage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.text }}>

      {/* Navbar */}
      <nav style={{
        background: COLORS.navBg,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${COLORS.border}`,
        position: "sticky", top: 0, zIndex: 50,
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: COLORS.text }}>
            X <span style={{ color: COLORS.primary }}>Toolkit</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14, fontWeight: 500, color: COLORS.muted }}>
          <span style={{ cursor: "pointer" }}>Tools</span>
          <span style={{ cursor: "pointer" }}>Blog</span>
          <span style={{ cursor: "pointer" }}>Pricing</span>
          <button style={{
            background: COLORS.primary, color: "#fff", border: "none",
            borderRadius: 8, padding: "8px 18px", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}>
            Get Extension
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: COLORS.badge, border: `1px solid ${COLORS.badgeBorder}`,
          borderRadius: 999, padding: "5px 14px", marginBottom: 28,
          fontSize: 13, fontWeight: 600, color: COLORS.accentText,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.primary, display: "inline-block" }} />
          44 Free Tools — No Signup Required
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 58px)", fontWeight: 800,
          lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 20, color: COLORS.text,
        }}>
          The toolkit built for<br />
          <span style={{ color: COLORS.primary }}>X / Twitter creators</span>
        </h1>

        <p style={{ fontSize: 18, color: COLORS.muted, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.6 }}>
          44 free tools for developers, marketers & creators — no account, no credit card, just open and use.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            background: COLORS.primary, color: "#fff",
            border: "none", borderRadius: 10, padding: "14px 28px",
            fontSize: 16, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            Browse All Tools <ArrowRight size={18} />
          </button>
          <button style={{
            background: "transparent", color: COLORS.text,
            border: `1.5px solid ${COLORS.border}`, borderRadius: 10,
            padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer",
          }}>
            Get Chrome Extension
          </button>
        </div>
      </section>

      {/* Search + Category Filter */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 36px" }}>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <Search size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.muted }} />
          <input
            readOnly
            placeholder="Search 44 tools..."
            style={{
              width: "100%", padding: "12px 14px 12px 42px",
              background: COLORS.bgCard, border: `1.5px solid ${COLORS.border}`,
              borderRadius: 10, fontSize: 15, color: COLORS.text,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATS.map((c, i) => (
            <span key={c} style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600,
              background: i === 0 ? COLORS.primary : COLORS.bgCard,
              color: i === 0 ? "#fff" : COLORS.muted,
              border: `1.5px solid ${i === 0 ? COLORS.primary : COLORS.border}`,
              cursor: "pointer",
            }}>{c}</span>
          ))}
        </div>
      </section>

      {/* Tool Cards Grid */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}>
          {TOOLS.map((tool) => (
            <div key={tool.name} style={{
              background: COLORS.bgCard,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 12, padding: "20px 22px",
              cursor: "pointer",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: COLORS.accent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>
                  {tool.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{tool.name}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: COLORS.accentText,
                      background: COLORS.badge, border: `1px solid ${COLORS.badgeBorder}`,
                      borderRadius: 999, padding: "1px 8px",
                    }}>{tool.cat}</span>
                  </div>
                  <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.5 }}>{tool.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section style={{
        background: COLORS.bgCard, borderTop: `1px solid ${COLORS.border}`,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "60px 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: "center", marginBottom: 40, letterSpacing: "-0.5px" }}>
            Why X Toolkit?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
            {WHY.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={20} color={COLORS.primary} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: COLORS.text }}>{title}</h3>
                  <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "36px 24px", textAlign: "center", color: COLORS.muted, fontSize: 13 }}>
        <div style={{ marginBottom: 16, display: "flex", gap: 24, justifyContent: "center", fontWeight: 500 }}>
          <span style={{ cursor: "pointer" }}>Privacy</span>
          <span style={{ cursor: "pointer" }}>Terms</span>
          <span style={{ cursor: "pointer" }}>Contact</span>
          <span style={{ cursor: "pointer" }}>Blog</span>
        </div>
        <p style={{ margin: 0 }}>© 2025 X Toolkit · All tools are free, forever.</p>
      </footer>
    </div>
  );
}
