import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateTech({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, marginBottom: 8 }}>
      <span style={{ fontFamily: "monospace", color: accentColor, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{"$ "}</span>
      <h2 style={{ fontSize: 10.5, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.5, padding: "28px 36px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      <div style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 2px", color: "#111", lineHeight: 1.1 }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 12, color: accentColor, fontFamily: "monospace", marginBottom: 7, fontWeight: 400 }}>{p.title}</div>}
        <div style={{ fontSize: 9.5, color: "#666", display: "flex", flexWrap: "wrap", gap: 12 }}>
          {p.email && <span style={{ fontFamily: "monospace" }}>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span style={{ color: accentColor, fontFamily: "monospace" }}>{p.linkedin}</span>}
          {p.website && <span style={{ color: accentColor, fontFamily: "monospace" }}>{p.website}</span>}
        </div>
      </div>

      {p.summary && (<><SH title="About" /><p style={{ margin: 0, color: "#444" }}>{p.summary}</p></>)}

      {skills.length > 0 && (<><SH title="Skills" />
        {skills.map((s) => (
          <div key={s.id} style={{ marginBottom: 5 }}>
            {s.category && <span style={{ fontFamily: "monospace", color: accentColor, fontSize: 9.5, marginRight: 6 }}>[{s.category}]</span>}
            <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 3 }}>
              {s.items.split(",").map((x) => x.trim()).filter(Boolean).map((item, i) => (
                <span key={i} style={{ border: `1px solid ${accentColor}50`, borderRadius: 3, padding: "1px 6px", fontSize: 9.5, fontFamily: "monospace", color: "#333" }}>{item}</span>
              ))}
            </span>
          </div>
        ))}</>)}

      {experience.length > 0 && (<><SH title="Experience" />
        {experience.map((e) => (
          <div key={e.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div><span style={{ fontWeight: 700 }}>{e.position}</span>{e.company && <span style={{ color: "#666" }}> @ {e.company}</span>}</div>
              <span style={{ fontSize: 9.5, color: "#888", fontFamily: "monospace", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(e.startDate)} – {e.current ? "now" : fmt(e.endDate)}</span>
            </div>
            {e.bullets.filter(Boolean).length > 0 && <ul style={{ margin: "4px 0 0 14px", padding: 0 }}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2, color: "#444" }}>{b}</li>)}</ul>}
          </div>
        ))}</>)}

      {projects.length > 0 && (<><SH title="Projects" />
        {projects.map((pr) => (
          <div key={pr.id} style={{ marginBottom: 9, background: "#fafafa", border: "1px solid #eee", borderRadius: 5, padding: "7px 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{pr.name}</span>
              {pr.url && <span style={{ fontSize: 9.5, color: accentColor, fontFamily: "monospace" }}>{pr.url}</span>}
            </div>
            {pr.description && <div style={{ color: "#444", marginTop: 2 }}>{pr.description}</div>}
            {pr.technologies && (
              <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 3 }}>
                {pr.technologies.split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                  <span key={i} style={{ border: `1px solid ${accentColor}40`, borderRadius: 3, padding: "1px 5px", fontSize: 9, fontFamily: "monospace", color: "#555" }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}</>)}

      {education.length > 0 && (<><SH title="Education" />
        {education.map((e) => (
          <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <div><span style={{ fontWeight: 700 }}>{e.institution}</span><div style={{ color: "#555" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</div></div>
            <span style={{ fontSize: 9.5, color: "#888", fontFamily: "monospace", whiteSpace: "nowrap" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
          </div>
        ))}</>)}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 28 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Certifications" />
              {certifications.map((c) => <div key={c.id} style={{ marginBottom: 3 }}><span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 9.5 }}>{c.name}</span>{c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}</div>)}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Languages" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {languages.map((l) => <span key={l.id} style={{ border: `1px solid ${accentColor}40`, padding: "2px 7px", borderRadius: 99, fontSize: 9.5 }}>{l.language}{l.proficiency ? ` · ${l.proficiency}` : ""}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
