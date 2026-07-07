import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateExecutive({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <div style={{ marginTop: 16, marginBottom: 7 }}>
      <h2 style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1a1a", margin: 0 }}>{title}</h2>
      <div style={{ height: "0.75px", background: "#ccc", marginTop: 4 }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.5, maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      {/* Accent header */}
      <div style={{ background: accentColor, padding: "24px 36px 18px", color: "#fff" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 3px", color: "#fff", letterSpacing: "0.01em", lineHeight: 1.1 }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 10, fontWeight: 400 }}>{p.title}</div>}
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.8)", display: "flex", flexWrap: "wrap", gap: 12 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      <div style={{ padding: "20px 36px 32px" }}>
        {p.summary && (<><SH title="Executive Summary" /><p style={{ margin: 0, color: "#444", lineHeight: 1.6 }}>{p.summary}</p></>)}

        {experience.length > 0 && (<><SH title="Professional Experience" />
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div><span style={{ fontWeight: 800, fontSize: 11 }}>{e.position}</span>{e.company && <span style={{ color: "#555", fontWeight: 500 }}> | {e.company}</span>}</div>
                <span style={{ fontSize: 9.5, color: "#777", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</span>
              </div>
              {e.bullets.filter(Boolean).length > 0 && <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2, color: "#444" }}>{b}</li>)}</ul>}
            </div>
          ))}</>)}

        {education.length > 0 && (<><SH title="Education" />
          {education.map((e) => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <div><div style={{ fontWeight: 700 }}>{e.institution}</div><div style={{ color: "#555" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` | GPA ${e.gpa}` : ""}</div></div>
              <span style={{ fontSize: 9.5, color: "#777", whiteSpace: "nowrap" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
            </div>
          ))}</>)}

        {skills.length > 0 && (<><SH title="Core Competencies" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {skills.flatMap((s) => s.items.split(",").map((x) => x.trim())).filter(Boolean).map((item, i) => (
              <span key={i} style={{ background: "#f2f2f2", border: "1px solid #e0e0e0", borderRadius: 3, padding: "2px 8px", fontSize: 9.5 }}>{item}</span>
            ))}
          </div></>)}

        {projects.length > 0 && (<><SH title="Key Projects" />
          {projects.map((pr) => (
            <div key={pr.id} style={{ marginBottom: 7 }}>
              <span style={{ fontWeight: 700 }}>{pr.name}</span>
              {pr.url && <span style={{ fontSize: 9.5, color: "#777", marginLeft: 6 }}>{pr.url}</span>}
              {pr.description && <div style={{ color: "#444", marginTop: 2 }}>{pr.description}</div>}
              {pr.technologies && <div style={{ fontSize: 9.5, color: "#666", marginTop: 1 }}>{pr.technologies}</div>}
            </div>
          ))}</>)}

        {(certifications.length > 0 || languages.length > 0) && (
          <div style={{ display: "flex", gap: 28 }}>
            {certifications.length > 0 && (
              <div style={{ flex: 1 }}><SH title="Certifications" />
                {certifications.map((c) => <div key={c.id} style={{ marginBottom: 3 }}><span style={{ fontWeight: 700 }}>{c.name}</span>{c.issuer && <span style={{ color: "#555" }}> · {c.issuer}</span>}</div>)}
              </div>
            )}
            {languages.length > 0 && (
              <div style={{ flex: 1 }}><SH title="Languages" />
                {languages.map((l) => <div key={l.id} style={{ marginBottom: 2 }}><span style={{ fontWeight: 700 }}>{l.language}</span>{l.proficiency ? ` — ${l.proficiency}` : ""}</div>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
