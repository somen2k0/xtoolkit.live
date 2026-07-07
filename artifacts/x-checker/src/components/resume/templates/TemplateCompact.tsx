import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateCompact({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9, marginBottom: 4 }}>
      <h2 style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: accentColor, margin: 0, whiteSpace: "nowrap" }}>{title}</h2>
      <div style={{ flex: 1, height: "0.75px", background: "#ddd" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", fontSize: 9.5, color: "#1a1a1a", lineHeight: 1.35, padding: "22px 30px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      <div style={{ marginBottom: 9 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 21, fontWeight: 900, margin: "0 0 1px", color: accentColor, lineHeight: 1.1 }}>{p.name || "Your Name"}</h1>
            {p.title && <div style={{ fontSize: 10.5, color: "#555" }}>{p.title}</div>}
          </div>
          <div style={{ textAlign: "right", fontSize: 8.5, color: "#777", lineHeight: 1.7 }}>
            {p.email && <div>{p.email}</div>}
            {p.phone && <div>{p.phone}</div>}
            {p.location && <div>{p.location}</div>}
            {p.linkedin && <div>{p.linkedin}</div>}
            {p.website && <div>{p.website}</div>}
          </div>
        </div>
        <div style={{ height: "0.75px", background: accentColor, marginTop: 5 }} />
      </div>

      {p.summary && (<><SH title="Summary" /><p style={{ margin: "0 0 3px", color: "#444", fontSize: 9 }}>{p.summary}</p></>)}

      {experience.length > 0 && (<><SH title="Experience" />
        {experience.map((e) => (
          <div key={e.id} style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><span style={{ fontWeight: 800, fontSize: 9.5 }}>{e.position}</span>{e.company && <span style={{ color: "#666" }}> · {e.company}</span>}</div>
              <span style={{ fontSize: 8.5, color: "#999", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</span>
            </div>
            {e.bullets.filter(Boolean).length > 0 && <ul style={{ margin: "1px 0 0 12px", padding: 0 }}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 1, color: "#444", fontSize: 9 }}>{b}</li>)}</ul>}
          </div>
        ))}</>)}

      {education.length > 0 && (<><SH title="Education" />
        {education.map((e) => (
          <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <div><span style={{ fontWeight: 800 }}>{e.institution}</span><span style={{ color: "#666" }}> · {e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</span></div>
            <span style={{ fontSize: 8.5, color: "#999", whiteSpace: "nowrap" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
          </div>
        ))}</>)}

      {skills.length > 0 && (<><SH title="Skills" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px 14px" }}>
          {skills.map((s) => (
            <div key={s.id} style={{ marginBottom: 2 }}>
              {s.category && <span style={{ fontWeight: 800, color: accentColor }}>{s.category}: </span>}
              <span style={{ color: "#555" }}>{s.items}</span>
            </div>
          ))}
        </div></>)}

      {projects.length > 0 && (<><SH title="Projects" />
        {projects.map((pr) => (
          <div key={pr.id} style={{ marginBottom: 5 }}>
            <span style={{ fontWeight: 800 }}>{pr.name}</span>
            {pr.url && <span style={{ fontSize: 8.5, color: "#999", marginLeft: 5 }}>{pr.url}</span>}
            {pr.description && <span style={{ color: "#555" }}> — {pr.description}</span>}
            {pr.technologies && <div style={{ fontSize: 8.5, color: "#888" }}>{pr.technologies}</div>}
          </div>
        ))}</>)}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 20 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Certifications" />
              {certifications.map((c) => <div key={c.id} style={{ marginBottom: 2, fontSize: 9 }}><span style={{ fontWeight: 800 }}>{c.name}</span>{c.issuer && <span style={{ color: "#777" }}> · {c.issuer}</span>}</div>)}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Languages" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {languages.map((l) => <span key={l.id} style={{ fontSize: 9 }}><span style={{ fontWeight: 800 }}>{l.language}</span>{l.proficiency ? ` (${l.proficiency})` : ""}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
