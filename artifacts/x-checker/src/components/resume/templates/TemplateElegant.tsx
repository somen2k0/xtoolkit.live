import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mon = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
  return `${mon} ${y}`;
}

export function TemplateElegant({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SectionHead = ({ title }: { title: string }) => (
    <div style={{ textAlign: "center", marginTop: 22, marginBottom: 12 }}>
      <h2 style={{ fontSize: 11, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: accentColor, margin: "0 0 6px" }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
        <div style={{ height: "0.5px", width: 48, background: accentColor, opacity: 0.4 }} />
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: accentColor, opacity: 0.6 }} />
        <div style={{ height: "0.5px", width: 48, background: accentColor, opacity: 0.4 }} />
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: "#2c2c2c", lineHeight: 1.55, padding: "40px 48px", maxWidth: 780, margin: "0 auto", background: "#fdfcfb" }}>
      {/* Centered header */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ height: 1, background: accentColor, opacity: 0.3, marginBottom: 16 }} />
        <h1 style={{ fontSize: 28, fontWeight: 400, letterSpacing: "0.08em", margin: "0 0 6px", color: "#111" }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: accentColor, marginBottom: 8 }}>{p.title}</div>}
        <div style={{ fontSize: 10, color: "#777", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>·  {p.phone}</span>}
          {p.location && <span>·  {p.location}</span>}
          {p.linkedin && <span>·  {p.linkedin}</span>}
          {p.website && <span>·  {p.website}</span>}
        </div>
        <div style={{ height: 1, background: accentColor, opacity: 0.3, marginTop: 16 }} />
      </div>

      {p.summary && (
        <>
          <SectionHead title="Profile" />
          <p style={{ margin: 0, color: "#555", textAlign: "center", fontStyle: "italic", lineHeight: 1.7 }}>{p.summary}</p>
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHead title="Professional Experience" />
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 700, fontStyle: "italic" }}>{e.position}</span>
                  {e.company && <span style={{ color: "#555" }}> — {e.company}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#888" }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</div>
              </div>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: "5px 0 0 16px", padding: 0 }}>
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ marginBottom: 2, color: "#555" }}>{b}</li>
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
            <div key={e.id} style={{ marginBottom: 8, textAlign: "center" }}>
              <div style={{ fontWeight: 700 }}>{e.institution}</div>
              <div style={{ color: "#666", fontStyle: "italic" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</div>
              <div style={{ fontSize: 10, color: "#999" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionHead title="Skills & Expertise" />
          <div style={{ textAlign: "center" }}>
            {skills.map((s, idx) => (
              <span key={s.id}>
                {idx > 0 && <span style={{ color: "#ccc" }}> · </span>}
                {s.category && <span style={{ fontWeight: 600 }}>{s.category}: </span>}
                <span style={{ color: "#666" }}>{s.items}</span>
              </span>
            ))}
          </div>
        </>
      )}

      {projects.length > 0 && (
        <>
          <SectionHead title="Notable Projects" />
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 8, textAlign: "center" }}>
              <span style={{ fontWeight: 700, fontStyle: "italic" }}>{proj.name}</span>
              {proj.url && <span style={{ fontSize: 10, color: "#888", marginLeft: 8 }}>{proj.url}</span>}
              {proj.description && <div style={{ color: "#666", marginTop: 2 }}>{proj.description}</div>}
              {proj.technologies && <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{proj.technologies}</div>}
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
                <div key={c.id} style={{ marginBottom: 4, textAlign: "center" }}>
                  <span style={{ fontWeight: 600, fontStyle: "italic" }}>{c.name}</span>
                  {c.issuer && <span style={{ color: "#777" }}> · {c.issuer}</span>}
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Languages" />
              <div style={{ textAlign: "center" }}>
                {languages.map((l, idx) => (
                  <span key={l.id}>{idx > 0 ? " · " : ""}<span style={{ fontStyle: "italic" }}>{l.language}</span>{l.proficiency ? ` (${l.proficiency})` : ""}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
