import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateBold({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <div style={{ marginTop: 16, marginBottom: 7 }}>
      <h2 style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.04em", color: accentColor, margin: "0 0 3px", textTransform: "uppercase" }}>{title}</h2>
      <div style={{ height: "1.5px", background: accentColor, width: "100%" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Arial Black', 'Segoe UI', Arial, sans-serif", fontSize: 10.5, color: "#111", lineHeight: 1.45, padding: "28px 36px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 2px", color: "#111", letterSpacing: "-0.01em", lineHeight: 1.05 }}>{p.name || "YOUR NAME"}</h1>
        {p.title && <div style={{ fontSize: 13, color: accentColor, fontWeight: 700, marginBottom: 8, letterSpacing: "0.03em" }}>{p.title}</div>}
        <div style={{ fontSize: 9.5, color: "#666", display: "flex", flexWrap: "wrap", gap: 10 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      {p.summary && (<><SH title="About" /><p style={{ margin: "4px 0 0", color: "#333", lineHeight: 1.55 }}>{p.summary}</p></>)}

      {experience.length > 0 && (<><SH title="Experience" />
        {experience.map((e) => (
          <div key={e.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div><span style={{ fontWeight: 900, fontSize: 11 }}>{e.position}</span>{e.company && <span style={{ color: "#555", fontWeight: 400 }}> — {e.company}</span>}</div>
              <span style={{ fontSize: 9.5, color: "#888", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</span>
            </div>
            {e.bullets.filter(Boolean).length > 0 && <ul style={{ margin: "4px 0 0 15px", padding: 0 }}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2, color: "#444" }}>{b}</li>)}</ul>}
          </div>
        ))}</>)}

      {education.length > 0 && (<><SH title="Education" />
        {education.map((e) => (
          <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <div><div style={{ fontWeight: 900 }}>{e.institution}</div><div style={{ color: "#555" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · GPA ${e.gpa}` : ""}</div></div>
            <span style={{ fontSize: 9.5, color: "#888", whiteSpace: "nowrap" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
          </div>
        ))}</>)}

      {skills.length > 0 && (<><SH title="Skills" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
          {skills.flatMap((s) => s.items.split(",").map((x) => x.trim())).filter(Boolean).map((item, i) => (
            <span key={i} style={{ background: "#f4f4f4", border: "1px solid #e0e0e0", borderRadius: 3, padding: "2px 9px", fontSize: 9.5, fontWeight: 700 }}>{item}</span>
          ))}
        </div></>)}

      {projects.length > 0 && (<><SH title="Projects" />
        {projects.map((pr) => (
          <div key={pr.id} style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 900 }}>{pr.name}</span>
            {pr.url && <span style={{ fontSize: 9.5, color: "#888", marginLeft: 8 }}>{pr.url}</span>}
            {pr.description && <div style={{ color: "#444", marginTop: 2 }}>{pr.description}</div>}
            {pr.technologies && <div style={{ fontSize: 9.5, color: "#666", fontWeight: 700, marginTop: 1 }}>{pr.technologies}</div>}
          </div>
        ))}</>)}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 28 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Certifications" />
              {certifications.map((c) => <div key={c.id} style={{ marginBottom: 3 }}><span style={{ fontWeight: 900 }}>{c.name}</span>{c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}</div>)}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Languages" />
              {languages.map((l) => <div key={l.id}><span style={{ fontWeight: 900 }}>{l.language}</span>{l.proficiency ? ` · ${l.proficiency}` : ""}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
