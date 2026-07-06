import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mon = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
  return `${mon} ${y}`;
}

export function TemplateCreative({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", fontSize: 11, color: "#222", lineHeight: 1.5, display: "flex", maxWidth: 780, margin: "0 auto", minHeight: 600, background: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: "32%", background: accentColor, color: "#fff", padding: "30px 18px", flexShrink: 0 }}>
        {/* Avatar placeholder */}
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.5)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
          {(p.name || "?")[0].toUpperCase()}
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 3px", color: "#fff", textAlign: "center" }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.82)", textAlign: "center", marginBottom: 18, fontWeight: 500 }}>{p.title}</div>}

        {/* Contact */}
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: 16 }}>
          {p.email && <div>✉ {p.email}</div>}
          {p.phone && <div>📱 {p.phone}</div>}
          {p.location && <div>📍 {p.location}</div>}
          {p.linkedin && <div>🔗 {p.linkedin}</div>}
          {p.website && <div>🌐 {p.website}</div>}
        </div>

        {/* Skills in sidebar */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", margin: "0 0 8px" }}>Skills</h3>
            {skills.map((s) => (
              <div key={s.id} style={{ marginBottom: 6 }}>
                {s.category && <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 3 }}>{s.category}</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {s.items.split(",").map((item) => item.trim()).filter(Boolean).map((item, i) => (
                    <span key={i} style={{ background: "rgba(255,255,255,0.2)", padding: "1px 6px", borderRadius: 99, fontSize: 9 }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages in sidebar */}
        {languages.length > 0 && (
          <div>
            <h3 style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", margin: "0 0 8px" }}>Languages</h3>
            {languages.map((l) => (
              <div key={l.id} style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", marginBottom: 3 }}>
                {l.language}{l.proficiency ? ` · ${l.proficiency}` : ""}
              </div>
            ))}
          </div>
        )}

        {/* ATS warning */}
        <div style={{ marginTop: 20, fontSize: 8, color: "rgba(255,255,255,0.55)", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 8, lineHeight: 1.5 }}>
          ⚠️ This template uses a two-column layout which may not be ATS-compatible. Use Classic or Modern for automated screening.
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "28px 28px 32px" }}>
        {p.summary && (
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor, margin: "0 0 6px" }}>About Me</h2>
            <div style={{ height: 2, background: accentColor, borderRadius: 1, marginBottom: 8 }} />
            <p style={{ margin: 0, color: "#555", lineHeight: 1.6 }}>{p.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor, margin: "0 0 6px" }}>Experience</h2>
            <div style={{ height: 2, background: accentColor, borderRadius: 1, marginBottom: 10 }} />
            {experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{e.position}</span>
                    {e.company && <span style={{ color: accentColor, fontWeight: 600 }}> · {e.company}</span>}
                  </div>
                  <div style={{ fontSize: 9.5, color: "#999" }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</div>
                </div>
                {e.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: "4px 0 0 14px", padding: 0 }}>
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ marginBottom: 2, color: "#444", fontSize: 10.5 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor, margin: "0 0 6px" }}>Education</h2>
            <div style={{ height: 2, background: accentColor, borderRadius: 1, marginBottom: 10 }} />
            {education.map((e) => (
              <div key={e.id} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{e.institution}</div>
                  <div style={{ color: "#666" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</div>
                </div>
                <div style={{ fontSize: 9.5, color: "#999" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor, margin: "0 0 6px" }}>Projects</h2>
            <div style={{ height: 2, background: accentColor, borderRadius: 1, marginBottom: 10 }} />
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>{proj.name}</span>
                {proj.url && <span style={{ fontSize: 9.5, color: accentColor, marginLeft: 6 }}>{proj.url}</span>}
                {proj.description && <div style={{ color: "#555", marginTop: 2 }}>{proj.description}</div>}
                {proj.technologies && <div style={{ fontSize: 9.5, color: "#888", marginTop: 2 }}>{proj.technologies}</div>}
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h2 style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor, margin: "0 0 6px" }}>Certifications</h2>
            <div style={{ height: 2, background: accentColor, borderRadius: 1, marginBottom: 10 }} />
            {certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}
                {c.date && <span style={{ color: "#999", fontSize: 9.5 }}> · {fmt(c.date)}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
