import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateAcademic({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <div style={{ marginTop: 16, marginBottom: 7 }}>
      <h2 style={{ fontSize: 12, fontWeight: 700, margin: "0 0 4px", color: "#111", borderBottom: `1.5px solid ${accentColor}`, paddingBottom: 3 }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 10.5, color: "#1a1a1a", lineHeight: 1.55, padding: "32px 40px", maxWidth: 780, margin: "0 auto", background: "#fff" }}>
      <div style={{ textAlign: "center", borderBottom: `1.5px solid ${accentColor}`, paddingBottom: 12, marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 3px", color: "#111" }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>{p.title}</div>}
        <div style={{ fontSize: 9.5, color: "#777", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
          {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((v, i, a) => (
            <span key={i}>{v}{i < a.length - 1 ? " |" : ""}</span>
          ))}
        </div>
      </div>

      {p.summary && (<><SH title="Research Interests / Summary" /><p style={{ margin: "4px 0 0", color: "#444", lineHeight: 1.65 }}>{p.summary}</p></>)}

      {education.length > 0 && (<><SH title="Education" />
        {education.map((e) => (
          <div key={e.id} style={{ marginBottom: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: 11 }}>{e.institution}</span>
              <span style={{ fontSize: 9.5, color: "#888" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
            </div>
            <div style={{ color: "#555", fontStyle: "italic" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</div>
            {e.gpa && <div style={{ fontSize: 9.5, color: "#777" }}>GPA: {e.gpa}</div>}
          </div>
        ))}</>)}

      {experience.length > 0 && (<><SH title="Research & Professional Experience" />
        {experience.map((e) => (
          <div key={e.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div><span style={{ fontWeight: 700 }}>{e.position}</span>{e.company && <span style={{ color: "#666" }}>, {e.company}</span>}</div>
              <span style={{ fontSize: 9.5, color: "#888", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</span>
            </div>
            {e.bullets.filter(Boolean).length > 0 && <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2, color: "#444" }}>{b}</li>)}</ul>}
          </div>
        ))}</>)}

      {projects.length > 0 && (<><SH title="Publications & Projects" />
        {projects.map((pr) => (
          <div key={pr.id} style={{ marginBottom: 9, paddingLeft: 12, borderLeft: `2px solid ${accentColor}30` }}>
            <span style={{ fontWeight: 700 }}>{pr.name}</span>
            {pr.url && <span style={{ fontSize: 9.5, color: "#888", marginLeft: 6 }}>[{pr.url}]</span>}
            {pr.description && <div style={{ color: "#444", marginTop: 2 }}>{pr.description}</div>}
            {pr.technologies && <div style={{ fontSize: 9.5, color: "#777", marginTop: 1, fontStyle: "italic" }}>{pr.technologies}</div>}
          </div>
        ))}</>)}

      {skills.length > 0 && (<><SH title="Technical Skills" />
        {skills.map((s) => <div key={s.id} style={{ marginBottom: 3 }}>{s.category && <span style={{ fontWeight: 700 }}>{s.category}: </span>}<span style={{ color: "#444" }}>{s.items}</span></div>)}</>)}

      {certifications.length > 0 && (<><SH title="Awards & Certifications" />
        {certifications.map((c) => (
          <div key={c.id} style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: 700 }}>{c.name}</span>
            {c.issuer && <span style={{ color: "#555" }}> — {c.issuer}</span>}
            {c.date && <span style={{ fontSize: 9.5, color: "#888" }}> ({fmt(c.date)})</span>}
          </div>
        ))}</>)}

      {languages.length > 0 && (<><SH title="Languages" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {languages.map((l) => <span key={l.id}><span style={{ fontWeight: 700 }}>{l.language}</span>{l.proficiency ? ` (${l.proficiency})` : ""}</span>)}
        </div></>)}
    </div>
  );
}
