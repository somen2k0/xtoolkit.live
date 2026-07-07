import type { ResumeData } from "../types";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function TemplateCreative({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SideHead = ({ title }: { title: string }) => (
    <div style={{ marginTop: 16, marginBottom: 6 }}>
      <h3 style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", margin: 0 }}>{title}</h3>
    </div>
  );

  const MainHead = ({ title }: { title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, marginBottom: 7 }}>
      <h2 style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, margin: 0, whiteSpace: "nowrap" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", fontSize: 10.5, color: "#222", lineHeight: 1.5, display: "flex", maxWidth: 780, margin: "0 auto", background: "#fff", minHeight: 600 }}>
      {/* Sidebar */}
      <div style={{ width: "31%", background: accentColor, color: "#fff", padding: "28px 16px 28px 18px", flexShrink: 0 }}>
        {/* Photo */}
        {p.photo ? (
          <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.5)", margin: "0 auto 14px" }}>
            <img src={p.photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ) : (
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>
            {(p.name || "?")[0].toUpperCase()}
          </div>
        )}

        <h1 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 2px", color: "#fff", textAlign: "center", lineHeight: 1.2 }}>{p.name || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.8)", textAlign: "center", marginBottom: 14, lineHeight: 1.3 }}>{p.title}</div>}

        <SideHead title="Contact" />
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.9 }}>
          {p.email && <div style={{ wordBreak: "break-all" }}>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {p.linkedin && <div style={{ wordBreak: "break-all" }}>{p.linkedin}</div>}
          {p.website && <div style={{ wordBreak: "break-all" }}>{p.website}</div>}
        </div>

        {skills.length > 0 && (
          <>
            <SideHead title="Skills" />
            {skills.map((s) => (
              <div key={s.id} style={{ marginBottom: 6 }}>
                {s.category && <div style={{ fontSize: 8.5, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 3, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.category}</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {s.items.split(",").map((x) => x.trim()).filter(Boolean).map((item, i) => (
                    <span key={i} style={{ background: "rgba(255,255,255,0.18)", padding: "1px 6px", borderRadius: 99, fontSize: 9 }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {languages.length > 0 && (
          <>
            <SideHead title="Languages" />
            {languages.map((l) => <div key={l.id} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>{l.language}{l.proficiency ? ` · ${l.proficiency}` : ""}</div>)}
          </>
        )}

        <div style={{ marginTop: 20, fontSize: 7.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 8 }}>
          ⚠ Two-column layout. Not recommended for ATS-screened applications.
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "24px 24px 28px" }}>
        {p.summary && (<><MainHead title="About" /><p style={{ margin: 0, color: "#555", lineHeight: 1.6, fontSize: 10 }}>{p.summary}</p></>)}

        {experience.length > 0 && (<><MainHead title="Experience" />
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div><span style={{ fontWeight: 700, fontSize: 10.5 }}>{e.position}</span>{e.company && <span style={{ color: accentColor, fontWeight: 600 }}> · {e.company}</span>}</div>
                <span style={{ fontSize: 9, color: "#aaa", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}</span>
              </div>
              {e.bullets.filter(Boolean).length > 0 && <ul style={{ margin: "3px 0 0 13px", padding: 0 }}>{e.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2, color: "#444", fontSize: 10 }}>{b}</li>)}</ul>}
            </div>
          ))}</>)}

        {education.length > 0 && (<><MainHead title="Education" />
          {education.map((e) => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <div><div style={{ fontWeight: 700 }}>{e.institution}</div><div style={{ color: "#666", fontSize: 10 }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</div></div>
              <span style={{ fontSize: 9, color: "#aaa", whiteSpace: "nowrap" }}>{fmt(e.startDate)} – {fmt(e.endDate)}</span>
            </div>
          ))}</>)}

        {projects.length > 0 && (<><MainHead title="Projects" />
          {projects.map((pr) => (
            <div key={pr.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700 }}>{pr.name}</span>
              {pr.url && <span style={{ fontSize: 9, color: accentColor, marginLeft: 6 }}>{pr.url}</span>}
              {pr.description && <div style={{ color: "#555", marginTop: 2, fontSize: 10 }}>{pr.description}</div>}
              {pr.technologies && <div style={{ fontSize: 9.5, color: "#888", marginTop: 1 }}>{pr.technologies}</div>}
            </div>
          ))}</>)}

        {certifications.length > 0 && (<><MainHead title="Certifications" />
          {certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 3 }}>
              <span style={{ fontWeight: 700 }}>{c.name}</span>
              {c.issuer && <span style={{ color: "#666" }}> · {c.issuer}</span>}
              {c.date && <span style={{ fontSize: 9.5, color: "#aaa" }}> · {fmt(c.date)}</span>}
            </div>
          ))}</>)}
      </div>
    </div>
  );
}
