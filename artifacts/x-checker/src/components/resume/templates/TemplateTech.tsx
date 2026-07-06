import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mon = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
  return `${mon} ${y}`;
}

export function TemplateTech({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SectionHead = ({ title }: { title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, marginBottom: 10 }}>
      <span style={{ fontFamily: "monospace", color: accentColor, fontSize: 12, fontWeight: 700 }}>{">"}</span>
      <h2 style={{ fontSize: 12, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "0.03em" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", fontSize: 11, color: "#222", lineHeight: 1.5, padding: "32px 40px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Header */}
      <div style={{ borderLeft: `4px solid ${accentColor}`, paddingLeft: 14, marginBottom: 18 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 3px", color: "#111" }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 13, color: accentColor, fontFamily: "monospace", marginBottom: 8 }}>{p.title}</div>}
        <div style={{ fontSize: 10, color: "#666", display: "flex", flexWrap: "wrap", gap: 10 }}>
          {p.email && <span style={{ fontFamily: "monospace" }}>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span style={{ color: accentColor, fontFamily: "monospace" }}>{p.linkedin}</span>}
          {p.website && <span style={{ color: accentColor, fontFamily: "monospace" }}>{p.website}</span>}
        </div>
      </div>

      {p.summary && (
        <>
          <SectionHead title="About" />
          <p style={{ margin: 0, color: "#444" }}>{p.summary}</p>
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionHead title="Technical Skills" />
          {skills.map((s) => (
            <div key={s.id} style={{ marginBottom: 6 }}>
              {s.category && <span style={{ fontFamily: "monospace", color: accentColor, fontSize: 10, marginRight: 8 }}>[{s.category}]</span>}
              <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 4 }}>
                {s.items.split(",").map((item) => item.trim()).filter(Boolean).map((item, i) => (
                  <span key={i} style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40`, color: "#333", padding: "1px 7px", borderRadius: 3, fontSize: 10, fontFamily: "monospace" }}>{item}</span>
                ))}
              </span>
            </div>
          ))}
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHead title="Experience" />
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{e.position}</span>
                  {e.company && <span style={{ color: accentColor, fontFamily: "monospace", fontSize: 10 }}> @ {e.company}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#888", fontFamily: "monospace" }}>
                  {fmt(e.startDate)} – {e.current ? "now" : fmt(e.endDate)}
                </div>
              </div>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: "5px 0 0 16px", padding: 0 }}>
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ marginBottom: 2, color: "#444" }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {projects.length > 0 && (
        <>
          <SectionHead title="Projects" />
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10, background: "#fafafa", border: "1px solid #eee", borderRadius: 6, padding: "8px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{proj.name}</span>
                {proj.url && <span style={{ fontSize: 10, color: accentColor, fontFamily: "monospace" }}>{proj.url}</span>}
              </div>
              {proj.description && <div style={{ color: "#444", marginTop: 3 }}>{proj.description}</div>}
              {proj.technologies && (
                <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {proj.technologies.split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                    <span key={i} style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30`, color: "#333", padding: "1px 6px", borderRadius: 3, fontSize: 10, fontFamily: "monospace" }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionHead title="Education" />
          {education.map((e) => (
            <div key={e.id} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontWeight: 700 }}>{e.institution}</span>
                <div style={{ color: "#555" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</div>
              </div>
              <div style={{ fontSize: 10, color: "#888", fontFamily: "monospace" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
            </div>
          ))}
        </>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 32 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Certifications" />
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 10 }}>{c.name}</span>
                  {c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Languages" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {languages.map((l) => (
                  <span key={l.id} style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}30`, padding: "2px 8px", borderRadius: 99, fontSize: 10 }}>
                    {l.language}{l.proficiency ? ` · ${l.proficiency}` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
