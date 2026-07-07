import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "../../types";
import { fmtDate } from "../shared/pdfUtils";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10.5, color: "#222222", lineHeight: 1.5, flexDirection: "row" },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#444444" },
  date: { fontSize: 9, color: "#aaaaaa" },
  bullet: { fontSize: 10, marginLeft: 12, marginBottom: 2, color: "#444444" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
});

export function PDFCreative({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SideHead = ({ title }: { title: string }) => (
    <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.6)", letterSpacing: 1.5, marginTop: 14, marginBottom: 5 }}>{title.toUpperCase()}</Text>
  );

  const MainHead = ({ title }: { title: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 6 }}>
      <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: accentColor, marginRight: 8 }}>{title.toUpperCase()}</Text>
      <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: "#e8e8e8" }} />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Sidebar */}
        <View style={{ width: "33%", backgroundColor: accentColor, padding: 22, paddingTop: 28 }}>
          {p.photo ? (
            <Image src={p.photo} style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 12, alignSelf: "center" }} />
          ) : (
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.2)", marginBottom: 12, alignSelf: "center", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 26, color: "rgba(255,255,255,0.8)", fontFamily: "Helvetica-Bold" }}>{(p.name || "?")[0].toUpperCase()}</Text>
            </View>
          )}

          <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color: "#ffffff", textAlign: "center", marginBottom: 2, lineHeight: 1.2 }}>{p.name || "Your Name"}</Text>
          {p.title && <Text style={{ fontSize: 9.5, color: "rgba(255,255,255,0.8)", textAlign: "center", marginBottom: 12 }}>{p.title}</Text>}

          <SideHead title="Contact" />
          <View style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", lineHeight: 1.8 }}>
            {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((v, i) => (
              <Text key={i} style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>{v}</Text>
            ))}
          </View>

          {skills.length > 0 && (
            <View>
              <SideHead title="Skills" />
              {skills.map((sk) => (
                <View key={sk.id} style={{ marginBottom: 6 }}>
                  {sk.category && <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.55)", letterSpacing: 1, marginBottom: 3 }}>{sk.category.toUpperCase()}</Text>}
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {sk.items.split(",").map((item) => item.trim()).filter(Boolean).map((item, i) => (
                      <View key={i} style={{ backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 99, paddingHorizontal: 6, paddingVertical: 1.5, marginRight: 3, marginBottom: 3 }}>
                        <Text style={{ fontSize: 8.5, color: "#ffffff" }}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {languages.length > 0 && (
            <View>
              <SideHead title="Languages" />
              {languages.map((l) => <Text key={l.id} style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>{l.language}{l.proficiency ? ` · ${l.proficiency}` : ""}</Text>)}
            </View>
          )}
        </View>

        {/* Main */}
        <View style={{ flex: 1, padding: 22, paddingTop: 24 }}>
          {p.summary && (<><MainHead title="About" /><Text style={{ color: "#555555", lineHeight: 1.6, fontSize: 10 }}>{p.summary}</Text></>)}

          {experience.length > 0 && (
            <View>
              <MainHead title="Experience" />
              {experience.map((e) => (
                <View key={e.id} style={{ marginBottom: 10 }} wrap={false}>
                  <View style={s.row}>
                    <Text><Text style={s.bold}>{e.position}</Text>{e.company ? <Text style={{ color: accentColor, fontFamily: "Helvetica-Bold" }}> · {e.company}</Text> : null}</Text>
                    <Text style={s.date}>{fmtDate(e.startDate)} – {e.current ? "Present" : fmtDate(e.endDate)}</Text>
                  </View>
                  {e.bullets.filter(Boolean).map((b, i) => <Text key={i} style={s.bullet}>• {b}</Text>)}
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View>
              <MainHead title="Education" />
              {education.map((e) => (
                <View key={e.id} style={[s.row, { marginBottom: 6 }]} wrap={false}>
                  <View>
                    <Text style={s.bold}>{e.institution}</Text>
                    <Text style={{ color: "#666666", fontSize: 10 }}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</Text>
                  </View>
                  <Text style={s.date}>{fmtDate(e.startDate)} – {fmtDate(e.endDate)}</Text>
                </View>
              ))}
            </View>
          )}

          {projects.length > 0 && (
            <View>
              <MainHead title="Projects" />
              {projects.map((pr) => (
                <View key={pr.id} style={{ marginBottom: 8 }} wrap={false}>
                  <Text><Text style={s.bold}>{pr.name}</Text>{pr.url ? <Text style={{ fontSize: 9, color: accentColor }}>  {pr.url}</Text> : null}</Text>
                  {pr.description && <Text style={{ color: "#555555", marginTop: 2, fontSize: 10 }}>{pr.description}</Text>}
                  {pr.technologies && <Text style={{ fontSize: 9.5, color: "#888888", marginTop: 1 }}>{pr.technologies}</Text>}
                </View>
              ))}
            </View>
          )}

          {certifications.length > 0 && (
            <View>
              <MainHead title="Certifications" />
              {certifications.map((c) => (
                <Text key={c.id} style={{ marginBottom: 3 }}><Text style={s.bold}>{c.name}</Text>{c.issuer ? <Text style={s.muted}> · {c.issuer}</Text> : null}</Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
