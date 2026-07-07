import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateMinimal({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <div style={{ marginTop: 20, marginBottom: 8 }}>
      <h2 style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", margin: 0 }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Helvetica Neue', 'Segoe UI', Arial, sans-serif", fontWeight: 300, fontSize: 10.5, color: "#333", lineHeight: 1.55, padding: "40px 44px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 30, fontWeight: 300, letterSpacing: "-0.02em", margin: "0 0 3px", color: "#111", lineHeight: 1.05 }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 12, color: accentColor, fontWeight: 400, marginBottom: 8 }}>{p.title}</div>}
        <div style={{ fontSize: 9.5, color: "#999", display: "flex", flexWrap: "wrap", gap: 10 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      {p.summary && (<><SH title="Profile" /><p style={{ margin: 0, color: "#555", lineHeight: 1.65 }}>{p.summary}</p></>)}

      {experience.length > 0 && (<><SH title="Experience" />
        {experience.map((e) => (
          <div key={e.id} style={{ marginBottom: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div><span style={{ fontWeight: 500, color: "#111" }}>{e.position}</span>{e.company && <span style={{ color: "#888" }}>, {e.company}</span>}</div>
              <span style={{ fontSize: 9, color: "#bbb", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</span>
            </div>
            {e.bullets.filter(Boolean).length > 0 && <ul style={{ margin: "4px 0 0 12px", padding: 0 }}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2, color: "#555" }}>{b}</li>)}</ul>}
          </div>
        ))}</>)}

      {education.length > 0 && (<><SH title="Education" />
        {education.map((e) => (
          <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div><span style={{ fontWeight: 500, color: "#111" }}>{e.institution}</span><div style={{ color: "#777" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</div></div>
            <span style={{ fontSize: 9, color: "#bbb", whiteSpace: "nowrap" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
          </div>
        ))}</>)}

      {skills.length > 0 && (<><SH title="Skills" />
        {skills.map((s) => (
          <div key={s.id} style={{ marginBottom: 3 }}>
            {s.category && <span style={{ fontWeight: 500, color: "#555" }}>{s.category}  </span>}
            <span style={{ color: "#888" }}>{s.items}</span>
          </div>
        ))}</>)}

      {projects.length > 0 && (<><SH title="Projects" />
        {projects.map((pr) => (
          <div key={pr.id} style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 500, color: "#111" }}>{pr.name}</span>
            {pr.url && <span style={{ color: accentColor, fontSize: 9.5, marginLeft: 8 }}>{pr.url}</span>}
            {pr.description && <div style={{ color: "#666", marginTop: 2 }}>{pr.description}</div>}
            {pr.technologies && <div style={{ color: "#aaa", fontSize: 9.5, marginTop: 1 }}>{pr.technologies}</div>}
          </div>
        ))}</>)}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 36 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Certifications" />
              {certifications.map((c) => <div key={c.id} style={{ marginBottom: 3 }}><span style={{ fontWeight: 500 }}>{c.name}</span>{c.issuer && <span style={{ color: "#888" }}> · {c.issuer}</span>}</div>)}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Languages" />
              {languages.map((l) => <div key={l.id} style={{ marginBottom: 2 }}>{l.language}{l.proficiency ? ` · ${l.proficiency}` : ""}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
