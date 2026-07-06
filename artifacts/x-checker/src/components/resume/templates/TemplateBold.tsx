import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const mon = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
  return `${mon} ${y}`;
}

export function TemplateBold({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SectionHead = ({ title }: { title: string }) => (
    <div style={{ marginTop: 18, marginBottom: 10 }}>
      <span style={{ background: accentColor, color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 99 }}>{title}</span>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Arial Black', 'Segoe UI', sans-serif", fontSize: 11, color: "#111", lineHeight: 1.45, maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Bold header */}
      <div style={{ background: accentColor, padding: "28px 40px 22px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 4px", color: "#fff", textTransform: "uppercase", letterSpacing: "0.03em" }}>{p.name || "YOUR NAME"}</h1>
        {p.title && <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>{p.title}</div>}
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", display: "flex", flexWrap: "wrap", gap: 12 }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📱 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>

      <div style={{ padding: "16px 40px 36px" }}>
        {p.summary && (
          <>
            <SectionHead title="About" />
            <p style={{ margin: 0, color: "#444", borderLeft: `3px solid ${accentColor}`, paddingLeft: 10 }}>{p.summary}</p>
          </>
        )}

        {experience.length > 0 && (
          <>
            <SectionHead title="Experience" />
            {experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 14, borderLeft: `2px solid #eee`, paddingLeft: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 900, fontSize: 12, color: "#111" }}>{e.position}</span>
                    {e.company && <span style={{ fontWeight: 700, color: accentColor }}> @ {e.company}</span>}
                  </div>
                  <div style={{ fontSize: 10, color: "#888", background: "#f5f5f5", padding: "2px 7px", borderRadius: 4 }}>
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
                  <div style={{ fontWeight: 900 }}>{e.institution}</div>
                  <div style={{ color: "#666" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · GPA ${e.gpa}` : ""}</div>
                </div>
                <div style={{ fontSize: 10, color: "#888" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
              </div>
            ))}
          </>
        )}

        {skills.length > 0 && (
          <>
            <SectionHead title="Skills" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.flatMap((s) => s.items.split(",").map((item) => item.trim())).filter(Boolean).map((item, i) => (
                <span key={i} style={{ background: "#f0f0f0", border: `1px solid ${accentColor}40`, color: "#222", padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{item}</span>
              ))}
            </div>
          </>
        )}

        {projects.length > 0 && (
          <>
            <SectionHead title="Projects" />
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 900 }}>{proj.name}</span>
                {proj.url && <span style={{ fontSize: 10, color: accentColor, marginLeft: 8 }}>{proj.url}</span>}
                {proj.description && <div style={{ color: "#444", marginTop: 2 }}>{proj.description}</div>}
                {proj.technologies && <div style={{ fontSize: 10, color: "#777", marginTop: 2, fontWeight: 700 }}>{proj.technologies}</div>}
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
                    <span style={{ fontWeight: 900 }}>{c.name}</span>
                    {c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}
                  </div>
                ))}
              </div>
            )}
            {languages.length > 0 && (
              <div style={{ flex: 1 }}>
                <SectionHead title="Languages" />
                {languages.map((l) => (
                  <div key={l.id}><span style={{ fontWeight: 900 }}>{l.language}</span>{l.proficiency ? ` · ${l.proficiency}` : ""}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
