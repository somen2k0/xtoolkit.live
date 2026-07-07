import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateElegant({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <div style={{ textAlign: "center", marginTop: 20, marginBottom: 10 }}>
      <h2 style={{ fontSize: 9.5, fontWeight: 400, letterSpacing: "0.24em", textTransform: "uppercase", color: "#888", margin: "0 0 7px" }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
        <div style={{ flex: 1, height: "0.5px", background: "#ccc" }} />
        <div style={{ width: 4, height: 4, background: accentColor, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1, height: "0.5px", background: "#ccc" }} />
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 10.5, color: "#2c2c2c", lineHeight: 1.55, padding: "36px 44px", maxWidth: 780, margin: "0 auto", background: "#fdfcfb" }}>
      <div style={{ textAlign: "center", paddingBottom: 16 }}>
        <div style={{ height: "0.75px", background: accentColor, opacity: 0.5, marginBottom: 14 }} />
        <h1 style={{ fontSize: 26, fontWeight: 400, letterSpacing: "0.06em", margin: "0 0 5px", color: "#111" }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor, marginBottom: 8 }}>{p.title}</div>}
        <div style={{ fontSize: 9.5, color: "#888", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((v, i, a) => (
            <span key={i}>{v}{i < a.length - 1 ? " ·" : ""}</span>
          ))}
        </div>
        <div style={{ height: "0.75px", background: accentColor, opacity: 0.5, marginTop: 14 }} />
      </div>

      {p.summary && (<><SH title="Profile" /><p style={{ margin: 0, color: "#555", textAlign: "center", fontStyle: "italic", lineHeight: 1.7 }}>{p.summary}</p></>)}

      {experience.length > 0 && (<><SH title="Experience" />
        {experience.map((e) => (
          <div key={e.id} style={{ marginBottom: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div><span style={{ fontWeight: 700, fontStyle: "italic" }}>{e.position}</span>{e.company && <span style={{ color: "#666" }}> — {e.company}</span>}</div>
              <span style={{ fontSize: 9.5, color: "#999", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</span>
            </div>
            {e.bullets.filter(Boolean).length > 0 && <ul style={{ margin: "4px 0 0 15px", padding: 0 }}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2, color: "#555" }}>{b}</li>)}</ul>}
          </div>
        ))}</>)}

      {education.length > 0 && (<><SH title="Education" />
        {education.map((e) => (
          <div key={e.id} style={{ textAlign: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{e.institution}</div>
            <div style={{ color: "#666", fontStyle: "italic" }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</div>
            <div style={{ fontSize: 9.5, color: "#aaa" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</div>
          </div>
        ))}</>)}

      {skills.length > 0 && (<><SH title="Skills" />
        <div style={{ textAlign: "center" }}>
          {skills.map((s, i) => <span key={s.id}>{i > 0 && <span style={{ color: "#ccc" }}> · </span>}{s.category && <span style={{ fontWeight: 600 }}>{s.category}: </span>}<span style={{ color: "#666" }}>{s.items}</span></span>)}
        </div></>)}

      {projects.length > 0 && (<><SH title="Projects" />
        {projects.map((pr) => (
          <div key={pr.id} style={{ textAlign: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontStyle: "italic" }}>{pr.name}</span>
            {pr.url && <span style={{ fontSize: 9.5, color: "#999", marginLeft: 8 }}>{pr.url}</span>}
            {pr.description && <div style={{ color: "#666", marginTop: 2 }}>{pr.description}</div>}
            {pr.technologies && <div style={{ fontSize: 9.5, color: "#aaa", marginTop: 1 }}>{pr.technologies}</div>}
          </div>
        ))}</>)}

      {(certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: "flex", gap: 28 }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Certifications" />
              {certifications.map((c) => <div key={c.id} style={{ textAlign: "center", marginBottom: 3 }}><span style={{ fontWeight: 600, fontStyle: "italic" }}>{c.name}</span>{c.issuer && <span style={{ color: "#888" }}> · {c.issuer}</span>}</div>)}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}><SH title="Languages" />
              <div style={{ textAlign: "center" }}>
                {languages.map((l, i) => <span key={l.id}>{i > 0 ? " · " : ""}<span style={{ fontStyle: "italic" }}>{l.language}</span>{l.proficiency ? ` (${l.proficiency})` : ""}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
