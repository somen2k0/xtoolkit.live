import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mon = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
  return `${mon} ${y}`;
}

export function TemplateAcademic({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SectionHead = ({ title }: { title: string }) => (
    <div style={{ marginTop: 18, marginBottom: 8 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px", color: "#111", borderBottom: `1.5px solid ${accentColor}`, paddingBottom: 4 }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11.5, color: "#1a1a1a", lineHeight: 1.55, padding: "36px 44px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16, borderBottom: `2px solid ${accentColor}`, paddingBottom: 14 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px", color: "#111" }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>{p.title}</div>}
        <div style={{ fontSize: 10, color: "#666", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>|  {p.phone}</span>}
          {p.location && <span>|  {p.location}</span>}
          {p.linkedin && <span>|  {p.linkedin}</span>}
          {p.website && <span>|  {p.website}</span>}
        </div>
      </div>

      {p.summary && (
        <>
          <SectionHead title="Research Interests / Summary" />
          <p style={{ margin: 0, color: "#444", lineHeight: 1.7 }}>{p.summary}</p>
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionHead title="Education" />
          {education.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{e.institution}</span>
                <span style={{ fontSize: 10, color: "#777" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
              </div>
              <div style={{ color: "#444", fontStyle: "italic" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</div>
              {e.gpa && <div style={{ fontSize: 10, color: "#666" }}>GPA: {e.gpa}</div>}
            </div>
          ))}
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHead title="Research & Professional Experience" />
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{e.position}</span>
                  {e.company && <span style={{ color: "#555" }}>, {e.company}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#777" }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</div>
              </div>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: "5px 0 0 18px", padding: 0 }}>
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
          <SectionHead title="Publications & Projects" />
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10, paddingLeft: 14, borderLeft: `2px solid ${accentColor}40` }}>
              <span style={{ fontWeight: 700 }}>{proj.name}</span>
              {proj.url && <span style={{ fontSize: 10, color: "#888", marginLeft: 6 }}>[{proj.url}]</span>}
              {proj.description && <div style={{ color: "#444", marginTop: 3 }}>{proj.description}</div>}
              {proj.technologies && <div style={{ fontSize: 10, color: "#666", marginTop: 2, fontStyle: "italic" }}>{proj.technologies}</div>}
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionHead title="Technical Skills" />
          {skills.map((s) => (
            <div key={s.id} style={{ marginBottom: 4 }}>
              {s.category && <span style={{ fontWeight: 700 }}>{s.category}: </span>}
              <span style={{ color: "#444" }}>{s.items}</span>
            </div>
          ))}
        </>
      )}

      {certifications.length > 0 && (
        <>
          <SectionHead title="Awards & Certifications" />
          {certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 5 }}>
              <span style={{ fontWeight: 700 }}>{c.name}</span>
              {c.issuer && <span style={{ color: "#555" }}> — {c.issuer}</span>}
              {c.date && <span style={{ color: "#777", fontSize: 10 }}> ({fmt(c.date)})</span>}
            </div>
          ))}
        </>
      )}

      {languages.length > 0 && (
        <>
          <SectionHead title="Languages" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {languages.map((l) => (
              <span key={l.id}><span style={{ fontWeight: 700 }}>{l.language}</span>{l.proficiency ? ` (${l.proficiency})` : ""}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
