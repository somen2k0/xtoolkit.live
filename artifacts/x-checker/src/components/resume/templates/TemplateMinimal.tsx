import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mon = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
  return `${mon} ${y}`;
}

export function TemplateMinimal({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SectionHead = ({ title }: { title: string }) => (
    <div style={{ marginTop: 22, marginBottom: 8 }}>
      <h2 style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999", margin: "0 0 6px" }}>{title}</h2>
      <div style={{ height: "0.5px", background: "#e8e8e8" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 300, fontSize: 11, color: "#333", lineHeight: 1.55, padding: "44px 48px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.02em", margin: "0 0 4px", color: "#111" }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 13, color: accentColor, fontWeight: 400, marginBottom: 8 }}>{p.title}</div>}
        <div style={{ fontSize: 10, color: "#888", display: "flex", flexWrap: "wrap", gap: 10 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      {p.summary && (
        <>
          <SectionHead title="Profile" />
          <p style={{ margin: 0, color: "#555", lineHeight: 1.65 }}>{p.summary}</p>
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHead title="Experience" />
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 600, color: "#111" }}>{e.position}</span>
                  {e.company && <span style={{ color: "#777" }}>, {e.company}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</div>
              </div>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: "4px 0 0 14px", padding: 0, listStyleType: "–" as string }}>
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ marginBottom: 2, color: "#555", paddingLeft: 4 }}>{b}</li>
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
                <span style={{ fontWeight: 600, color: "#111" }}>{e.institution}</span>
                <div style={{ color: "#777" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</div>
              </div>
              <div style={{ fontSize: 10, color: "#aaa" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionHead title="Skills" />
          {skills.map((s) => (
            <div key={s.id} style={{ marginBottom: 3 }}>
              {s.category && <span style={{ fontWeight: 500, color: "#555" }}>{s.category}  </span>}
              <span style={{ color: "#777" }}>{s.items}</span>
            </div>
          ))}
        </>
      )}

      {projects.length > 0 && (
        <>
          <SectionHead title="Projects" />
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 600, color: "#111" }}>{proj.name}</span>
              {proj.url && <span style={{ color: accentColor, fontSize: 10, marginLeft: 8 }}>{proj.url}</span>}
              {proj.description && <div style={{ color: "#555", marginTop: 2 }}>{proj.description}</div>}
              {proj.technologies && <div style={{ color: "#999", fontSize: 10, marginTop: 2 }}>{proj.technologies}</div>}
            </div>
          ))}
        </>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 36 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Certifications" />
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 3 }}>
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                  {c.issuer && <span style={{ color: "#777" }}> · {c.issuer}</span>}
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Languages" />
              {languages.map((l) => (
                <div key={l.id} style={{ marginBottom: 3 }}>
                  {l.language}{l.proficiency ? ` · ${l.proficiency}` : ""}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
