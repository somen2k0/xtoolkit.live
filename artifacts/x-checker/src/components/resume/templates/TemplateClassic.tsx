import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

const S = {
  page: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 10.5, color: "#1a1a1a", lineHeight: 1.45, padding: "32px 36px", background: "#fff", maxWidth: 780, margin: "0 auto" } as React.CSSProperties,
  name: (accent: string): React.CSSProperties => ({ fontSize: 24, fontWeight: 700, textAlign: "center", color: accent, margin: "0 0 3px", letterSpacing: "0.01em" }),
  jobTitle: { fontSize: 12, textAlign: "center", color: "#555", marginBottom: 7 } as React.CSSProperties,
  contact: { fontSize: 9.5, color: "#555", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 } as React.CSSProperties,
  sectionHead: (accent: string): React.CSSProperties => ({ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1a1a1a", margin: "0 0 3px", borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginTop: 14 }),
  row: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } as React.CSSProperties,
  date: { fontSize: 9.5, color: "#777", whiteSpace: "nowrap", flexShrink: 0 } as React.CSSProperties,
  pos: { fontWeight: 700, fontSize: 11 } as React.CSSProperties,
  co: { color: "#444", marginLeft: 4 } as React.CSSProperties,
  bullets: { margin: "3px 0 0 14px", padding: 0 } as React.CSSProperties,
  bullet: { marginBottom: 2, color: "#333" } as React.CSSProperties,
};

export function TemplateClassic({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;
  return (
    <div style={S.page}>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <h1 style={S.name(accentColor)}>{p.name || "Your Name"}</h1>
        {p.title && <div style={S.jobTitle}>{p.title}</div>}
        <div style={S.contact}>
          {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((v, i, a) => (
            <span key={i}>{v}{i < a.length - 1 ? " ·" : ""}</span>
          ))}
        </div>
      </div>

      {p.summary && (<><h2 style={S.sectionHead(accentColor)}>Summary</h2><p style={{ margin: "4px 0 0", color: "#333" }}>{p.summary}</p></>)}

      {experience.length > 0 && (<><h2 style={S.sectionHead(accentColor)}>Experience</h2>
        {experience.map((e) => (
          <div key={e.id} style={{ marginBottom: 10 }}>
            <div style={S.row}>
              <div><span style={S.pos}>{e.position}</span>{e.company && <span style={S.co}>— {e.company}</span>}</div>
              <span style={S.date}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</span>
            </div>
            {e.bullets.filter(Boolean).length > 0 && <ul style={S.bullets}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={S.bullet}>{b}</li>)}</ul>}
          </div>
        ))}</>)}

      {education.length > 0 && (<><h2 style={S.sectionHead(accentColor)}>Education</h2>
        {education.map((e) => (
          <div key={e.id} style={{ marginBottom: 7 }}>
            <div style={S.row}>
              <span style={S.pos}>{e.institution}</span>
              <span style={S.date}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
            </div>
            <div style={{ color: "#444" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · GPA ${e.gpa}` : ""}</div>
          </div>
        ))}</>)}

      {skills.length > 0 && (<><h2 style={S.sectionHead(accentColor)}>Skills</h2>
        {skills.map((s) => <div key={s.id} style={{ marginBottom: 2 }}>{s.category && <span style={{ fontWeight: 700 }}>{s.category}: </span>}<span style={{ color: "#444" }}>{s.items}</span></div>)}</>)}

      {projects.length > 0 && (<><h2 style={S.sectionHead(accentColor)}>Projects</h2>
        {projects.map((pr) => (
          <div key={pr.id} style={{ marginBottom: 7 }}>
            <div style={S.row}><span style={S.pos}>{pr.name}</span>{pr.url && <span style={{ fontSize: 9.5, color: "#777" }}>{pr.url}</span>}</div>
            {pr.description && <div style={{ color: "#444", marginTop: 2 }}>{pr.description}</div>}
            {pr.technologies && <div style={{ fontSize: 9.5, color: "#666", marginTop: 1 }}>{pr.technologies}</div>}
          </div>
        ))}</>)}

      {certifications.length > 0 && (<><h2 style={S.sectionHead(accentColor)}>Certifications</h2>
        {certifications.map((c) => <div key={c.id} style={{ marginBottom: 3 }}><span style={{ fontWeight: 700 }}>{c.name}</span>{c.issuer && <span style={{ color: "#444" }}> · {c.issuer}</span>}{c.date && <span style={S.date}> · {fmt(c.date)}</span>}</div>)}</>)}

      {languages.length > 0 && (<><h2 style={S.sectionHead(accentColor)}>Languages</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {languages.map((l) => <span key={l.id}><span style={{ fontWeight: 700 }}>{l.language}</span>{l.proficiency ? ` (${l.proficiency})` : ""}</span>)}
        </div></>)}
    </div>
  );
}
