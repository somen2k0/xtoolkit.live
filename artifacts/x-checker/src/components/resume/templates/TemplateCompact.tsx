import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateCompact({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SectionHead = ({ title }: { title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, marginBottom: 5 }}>
      <h2 style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor, margin: 0, whiteSpace: "nowrap" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "#ddd" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Arial Narrow', 'Helvetica Neue', Arial, sans-serif", fontSize: 10, color: "#1a1a1a", lineHeight: 1.35, padding: "26px 34px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 2px", color: accentColor, lineHeight: 1 }}>{p.name || "Your Name"}</h1>
            {p.title && <div style={{ fontSize: 11, color: "#555" }}>{p.title}</div>}
          </div>
          <div style={{ textAlign: "right", fontSize: 9, color: "#666", lineHeight: 1.6 }}>
            {p.email && <div>{p.email}</div>}
            {p.phone && <div>{p.phone}</div>}
            {p.location && <div>{p.location}</div>}
            {p.linkedin && <div>{p.linkedin}</div>}
            {p.website && <div>{p.website}</div>}
          </div>
        </div>
        <div style={{ height: 1, background: accentColor, marginTop: 6 }} />
      </div>

      {p.summary && (
        <>
          <SectionHead title="Summary" />
          <p style={{ margin: "0 0 4px", color: "#444", fontSize: 9.5 }}>{p.summary}</p>
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHead title="Experience" />
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontWeight: 800 }}>{e.position}</span>
                  {e.company && <span style={{ color: "#555" }}> · {e.company}</span>}
                </div>
                <div style={{ fontSize: 9, color: "#888" }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</div>
              </div>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: "2px 0 0 14px", padding: 0 }}>
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ marginBottom: 1, color: "#444", fontSize: 9.5 }}>{b}</li>
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
            <div key={e.id} style={{ marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontWeight: 800 }}>{e.institution}</span>
                <span style={{ color: "#555" }}> · {e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</span>
              </div>
              <div style={{ fontSize: 9, color: "#888" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionHead title="Skills" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px 16px" }}>
            {skills.map((s) => (
              <div key={s.id} style={{ marginBottom: 2 }}>
                {s.category && <span style={{ fontWeight: 800, color: accentColor }}>{s.category}: </span>}
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
            <div key={proj.id} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 800 }}>{proj.name}</span>
              {proj.url && <span style={{ fontSize: 9, color: "#888", marginLeft: 6 }}>{proj.url}</span>}
              {proj.description && <span style={{ color: "#444" }}> — {proj.description}</span>}
              {proj.technologies && <div style={{ fontSize: 9, color: "#777" }}>{proj.technologies}</div>}
            </div>
          ))}
        </>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 24 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Certifications" />
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 2, fontSize: 9.5 }}>
                  <span style={{ fontWeight: 800 }}>{c.name}</span>
                  {c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Languages" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {languages.map((l) => (
                  <span key={l.id} style={{ fontSize: 9.5 }}><span style={{ fontWeight: 800 }}>{l.language}</span>{l.proficiency ? ` (${l.proficiency})` : ""}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
