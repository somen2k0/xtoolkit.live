import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "../../types";
import { fmtDate } from "../shared/pdfUtils";

const s = StyleSheet.create({
  page: { padding: 22, fontFamily: "Helvetica", fontSize: 9.5, color: "#1a1a1a", lineHeight: 1.35 },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#555555" },
  date: { fontSize: 8.5, color: "#999999" },
  bullet: { fontSize: 9, marginLeft: 12, marginBottom: 1, color: "#444444" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
});

export function PDFCompact({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 3 }}>
      <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: accentColor, letterSpacing: 1.5, marginRight: 6 }}>{title.toUpperCase()}</Text>
      <View style={{ flex: 1, borderBottomWidth: 0.75, borderBottomColor: "#dddddd" }} />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={{ marginBottom: 8 }}>
          <View style={s.row}>
            <View>
              <Text style={{ fontSize: 21, fontFamily: "Helvetica-Bold", color: accentColor, marginBottom: 1 }}>{p.name || "Your Name"}</Text>
              {p.title && <Text style={{ fontSize: 10.5, color: "#555555" }}>{p.title}</Text>}
            </View>
            <View style={{ alignItems: "flex-end" }}>
              {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((v, i) => (
                <Text key={i} style={{ fontSize: 8.5, color: "#777777", marginBottom: 1 }}>{v}</Text>
              ))}
            </View>
          </View>
          <View style={{ borderBottomWidth: 0.75, borderBottomColor: accentColor, marginTop: 4 }} />
        </View>

        {p.summary && (<><SH title="Summary" /><Text style={{ color: "#444444", fontSize: 9 }}>{p.summary}</Text></>)}

        {experience.length > 0 && (
          <View>
            <SH title="Experience" />
            {experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 6 }} wrap={false}>
                <View style={s.row}>
                  <Text><Text style={s.bold}>{e.position}</Text>{e.company ? <Text style={s.muted}> · {e.company}</Text> : null}</Text>
                  <Text style={s.date}>{fmtDate(e.startDate)} – {e.current ? "Present" : fmtDate(e.endDate)}</Text>
                </View>
                {e.bullets.filter(Boolean).map((b, i) => <Text key={i} style={s.bullet}>• {b}</Text>)}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <SH title="Education" />
            {education.map((e) => (
              <View key={e.id} style={[s.row, { marginBottom: 4 }]} wrap={false}>
                <Text><Text style={s.bold}>{e.institution}</Text><Text style={s.muted}> · {e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</Text></Text>
                <Text style={s.date}>{fmtDate(e.startDate)} – {fmtDate(e.endDate)}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View>
            <SH title="Skills" />
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {skills.map((sk, i) => (
                <View key={sk.id} style={{ width: "50%", marginBottom: 2 }}>
                  {sk.category ? <Text><Text style={[s.bold, { color: accentColor }]}>{sk.category}: </Text><Text style={s.muted}>{sk.items}</Text></Text> : <Text style={s.muted}>{sk.items}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <SH title="Projects" />
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 4 }} wrap={false}>
                <Text><Text style={s.bold}>{pr.name}</Text>{pr.url ? <Text style={s.date}>  {pr.url}</Text> : null}{pr.description ? <Text style={s.muted}> — {pr.description}</Text> : null}</Text>
                {pr.technologies && <Text style={{ fontSize: 8.5, color: "#888888" }}>{pr.technologies}</Text>}
              </View>
            ))}
          </View>
        )}

        {(certifications.length > 0 || languages.length > 0) && (
          <View style={{ flexDirection: "row", gap: 16 }}>
            {certifications.length > 0 && (
              <View style={{ flex: 1 }}>
                <SH title="Certifications" />
                {certifications.map((c) => <Text key={c.id} style={{ marginBottom: 2, fontSize: 9 }}><Text style={s.bold}>{c.name}</Text>{c.issuer ? <Text style={s.muted}> · {c.issuer}</Text> : null}</Text>)}
              </View>
            )}
            {languages.length > 0 && (
              <View style={{ flex: 1 }}>
                <SH title="Languages" />
                <Text style={{ fontSize: 9, color: "#555555" }}>{languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join("  ·  ")}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
