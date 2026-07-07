import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateModern({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, marginBottom: 8 }}>
      <div style={{ width: 3, height: 16, background: accentColor, borderRadius: 1, flexShrink: 0 }} />
      <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#111", margin: 0 }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.5, padding: "30px 36px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 2px", color: accentColor, lineHeight: 1.1 }}>{p.name || "Your Name"}</h1>
          {p.title && <div style={{ fontSize: 12, color: "#666", fontWeight: 400 }}>{p.title}</div>}
        </div>
        <div style={{ textAlign: "right", fontSize: 9.5, color: "#666", lineHeight: 1.75 }}>
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {p.linkedin && <div>{p.linkedin}</div>}
          {p.website && <div>{p.website}</div>}
        </div>
      </div>
      <div style={{ height: 1, background: "#e8e8e8", marginBottom: 4 }} />

      {p.summary && (<><SH title="Summary" /><p style={{ margin: 0, color: "#444", lineHeight: 1.55 }}>{p.summary}</p></>)}

      {experience.length > 0 && (<><SH title="Experience" />
        {experience.map((e) => (
          <div key={e.id} style={{ marginBottom: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div><span style={{ fontWeight: 700 }}>{e.position}</span>{e.company && <span style={{ color: "#555" }}> — {e.company}</span>}</div>
              <span style={{ fontSize: 9.5, color: "#888", fontStyle: "italic", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</span>
            </div>
            {e.bullets.filter(Boolean).length > 0 && <ul style={{ margin: "3px 0 0 14px", padding: 0 }}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2, color: "#444" }}>{b}</li>)}</ul>}
          </div>
        ))}</>)}

      {education.length > 0 && (<><SH title="Education" />
        {education.map((e) => (
          <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <div><div style={{ fontWeight: 700 }}>{e.institution}</div><div style={{ color: "#555" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · GPA ${e.gpa}` : ""}</div></div>
            <span style={{ fontSize: 9.5, color: "#888", fontStyle: "italic", whiteSpace: "nowrap" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
          </div>
        ))}</>)}

      {skills.length > 0 && (<><SH title="Skills" />
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {skills.map((s) => (
            <div key={s.id} style={{ display: "flex", gap: 6 }}>
              {s.category && <span style={{ fontWeight: 700, minWidth: 88, color: "#333" }}>{s.category}</span>}
              <span style={{ color: "#555" }}>{s.items}</span>
            </div>
          ))}
        </div></>)}

      {projects.length > 0 && (<><SH title="Projects" />
        {projects.map((pr) => (
          <div key={pr.id} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700 }}>{pr.name}</span>
              {pr.url && <span style={{ fontSize: 9.5, color: "#888", fontStyle: "italic" }}>{pr.url}</span>}
            </div>
            {pr.description && <div style={{ color: "#444", marginTop: 2 }}>{pr.description}</div>}
            {pr.technologies && <div style={{ fontSize: 9.5, color: "#666", marginTop: 1 }}>{pr.technologies}</div>}
          </div>
        ))}</>)}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 28, marginTop: 4 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <SH title="Certifications" />
              {certifications.map((c) => <div key={c.id} style={{ marginBottom: 3 }}><span style={{ fontWeight: 700 }}>{c.name}</span>{c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}{c.date && <span style={{ fontSize: 9.5, color: "#888", fontStyle: "italic" }}> · {fmt(c.date)}</span>}</div>)}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <SH title="Languages" />
              {languages.map((l) => <div key={l.id} style={{ marginBottom: 2 }}><span style={{ fontWeight: 700 }}>{l.language}</span>{l.proficiency && <span style={{ color: "#666" }}> — {l.proficiency}</span>}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
