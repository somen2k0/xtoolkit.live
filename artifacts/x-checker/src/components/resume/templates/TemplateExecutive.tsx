import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mon = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
  return `${mon} ${y}`;
}

export function TemplateExecutive({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SectionHead = ({ title }: { title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, marginTop: 18 }}>
      <h2 style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor, margin: 0, whiteSpace: "nowrap" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "#ddd" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", fontSize: 11, color: "#222", lineHeight: 1.5, maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Dark header */}
      <div style={{ background: accentColor, color: "#fff", padding: "28px 40px 22px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 4px", letterSpacing: "0.01em", color: "#fff" }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 14, opacity: 0.88, marginBottom: 10 }}>{p.title}</div>}
        <div style={{ fontSize: 10, opacity: 0.78, display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      <div style={{ padding: "24px 40px 36px" }}>
        {p.summary && (
          <>
            <SectionHead title="Executive Summary" />
            <p style={{ margin: 0, color: "#444", fontSize: 11.5, lineHeight: 1.6 }}>{p.summary}</p>
          </>
        )}

        {experience.length > 0 && (
          <>
            <SectionHead title="Professional Experience" />
            {experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 12 }}>{e.position}</span>
                    {e.company && <span style={{ fontWeight: 600, color: "#555" }}> | {e.company}</span>}
                  </div>
                  <div style={{ fontSize: 10, color: "#888", whiteSpace: "nowrap" }}>
                    {fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}
                  </div>
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

        {education.length > 0 && (
          <>
            <SectionHead title="Education" />
            {education.map((e) => (
              <div key={e.id} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{e.institution}</div>
                  <div style={{ color: "#555" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` | GPA ${e.gpa}` : ""}</div>
                </div>
                <div style={{ fontSize: 10, color: "#888" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
              </div>
            ))}
          </>
        )}

        {skills.length > 0 && (
          <>
            <SectionHead title="Core Competencies" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.flatMap((s) => s.items.split(",").map((item) => item.trim())).filter(Boolean).map((item, i) => (
                <span key={i} style={{ background: "#f5f5f5", border: "1px solid #e0e0e0", borderRadius: 4, padding: "2px 8px", fontSize: 10 }}>{item}</span>
              ))}
            </div>
          </>
        )}

        {projects.length > 0 && (
          <>
            <SectionHead title="Key Projects" />
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>{proj.name}</span>
                {proj.url && <span style={{ fontSize: 10, color: "#888", marginLeft: 8 }}>{proj.url}</span>}
                {proj.description && <div style={{ color: "#444", marginTop: 2 }}>{proj.description}</div>}
                {proj.technologies && <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{proj.technologies}</div>}
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
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    {c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}
                  </div>
                ))}
              </div>
            )}
            {languages.length > 0 && (
              <div style={{ flex: 1 }}>
                <SectionHead title="Languages" />
                {languages.map((l) => (
                  <div key={l.id}><span style={{ fontWeight: 600 }}>{l.language}</span>{l.proficiency ? ` — ${l.proficiency}` : ""}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
