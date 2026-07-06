import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mon = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
  return `${mon} ${y}`;
}

export function TemplateClassic({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SectionHead = ({ title }: { title: string }) => (
    <div style={{ borderBottom: `2px solid #1a1a1a`, marginBottom: 6, paddingBottom: 2, marginTop: 16 }}>
      <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1a1a", margin: 0 }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: "#1a1a1a", lineHeight: 1.45, padding: "36px 40px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", color: accentColor, letterSpacing: "0.02em" }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>{p.title}</div>}
        <div style={{ fontSize: 10, color: "#555", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>·  {p.phone}</span>}
          {p.location && <span>·  {p.location}</span>}
          {p.linkedin && <span>·  {p.linkedin}</span>}
          {p.website && <span>·  {p.website}</span>}
        </div>
      </div>

      {p.summary && (
        <>
          <SectionHead title="Summary" />
          <p style={{ margin: 0, fontSize: 11 }}>{p.summary}</p>
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHead title="Experience" />
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{e.position}</span>
                  {e.company && <span style={{ color: "#444" }}> — {e.company}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#666", whiteSpace: "nowrap", marginLeft: 8 }}>
                  {fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}
                </div>
              </div>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>{b}</li>
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
            <div key={e.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{e.institution}</span>
                </div>
                <div style={{ fontSize: 10, color: "#666" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
              </div>
              <div style={{ color: "#444" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · GPA: ${e.gpa}` : ""}</div>
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionHead title="Skills" />
          {skills.map((s) => (
            <div key={s.id} style={{ marginBottom: 3 }}>
              {s.category && <span style={{ fontWeight: 700 }}>{s.category}: </span>}
              <span>{s.items}</span>
            </div>
          ))}
        </>
      )}

      {projects.length > 0 && (
        <>
          <SectionHead title="Projects" />
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{proj.name}</span>
                {proj.url && <span style={{ fontSize: 10, color: "#666" }}>{proj.url}</span>}
              </div>
              {proj.description && <div style={{ marginTop: 2 }}>{proj.description}</div>}
              {proj.technologies && <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Technologies: {proj.technologies}</div>}
            </div>
          ))}
        </>
      )}

      {certifications.length > 0 && (
        <>
          <SectionHead title="Certifications" />
          {certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 700 }}>{c.name}</span>
              {c.issuer && <span style={{ color: "#444" }}> · {c.issuer}</span>}
              {c.date && <span style={{ color: "#666", fontSize: 10 }}> · {fmt(c.date)}</span>}
            </div>
          ))}
        </>
      )}

      {languages.length > 0 && (
        <>
          <SectionHead title="Languages" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {languages.map((l) => (
              <span key={l.id}><span style={{ fontWeight: 700 }}>{l.language}</span>{l.proficiency ? ` (${l.proficiency})` : ""}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
