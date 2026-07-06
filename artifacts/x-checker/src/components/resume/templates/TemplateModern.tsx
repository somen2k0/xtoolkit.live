import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mon = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
  return `${mon} ${y}`;
}

export function TemplateModern({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SectionHead = ({ title }: { title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, marginTop: 18 }}>
      <div style={{ width: 3, height: 18, background: accentColor, borderRadius: 2, flexShrink: 0 }} />
      <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", color: "#1a1a1a", margin: 0 }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: 11, color: "#222", lineHeight: 1.5, padding: "32px 40px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 3px", color: accentColor }}>{p.name || "Your Name"}</h1>
          {p.title && <div style={{ fontSize: 14, color: "#555", fontWeight: 500 }}>{p.title}</div>}
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#555", lineHeight: 1.7 }}>
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {p.linkedin && <div>{p.linkedin}</div>}
          {p.website && <div>{p.website}</div>}
        </div>
      </div>

      {p.summary && (
        <>
          <SectionHead title="Summary" />
          <p style={{ margin: 0, color: "#444" }}>{p.summary}</p>
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHead title="Experience" />
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#111" }}>{e.position}</span>
                  {e.company && <span style={{ color: accentColor, fontWeight: 600 }}> @ {e.company}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#888", backgroundColor: "#f4f4f4", padding: "1px 7px", borderRadius: 99, whiteSpace: "nowrap" }}>
                  {fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}
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

      {education.length > 0 && (
        <>
          <SectionHead title="Education" />
          {education.map((e) => (
            <div key={e.id} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{e.institution}</div>
                <div style={{ color: "#555" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · GPA: ${e.gpa}` : ""}</div>
              </div>
              <div style={{ fontSize: 10, color: "#888", whiteSpace: "nowrap" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionHead title="Skills" />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {skills.map((s) => (
              <div key={s.id} style={{ display: "flex", gap: 6 }}>
                {s.category && <span style={{ fontWeight: 700, color: accentColor, minWidth: 90 }}>{s.category}</span>}
                <span style={{ color: "#444" }}>{s.items}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {projects.length > 0 && (
        <>
          <SectionHead title="Projects" />
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{proj.name}</span>
                {proj.url && <span style={{ fontSize: 10, color: accentColor }}>{proj.url}</span>}
              </div>
              {proj.description && <div style={{ color: "#444", marginTop: 2 }}>{proj.description}</div>}
              {proj.technologies && <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>Stack: {proj.technologies}</div>}
            </div>
          ))}
        </>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Certifications" />
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  {c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}
                  {c.date && <span style={{ color: "#888", fontSize: 10 }}> · {fmt(c.date)}</span>}
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Languages" />
              {languages.map((l) => (
                <div key={l.id} style={{ marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  {l.proficiency && <span style={{ color: "#666" }}> — {l.proficiency}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
