import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "../../types";
import { fmtDate } from "../shared/pdfUtils";

const s = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 10.5, color: "#111111", lineHeight: 1.45 },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#555555" },
  date: { fontSize: 9, color: "#888888" },
  bullet: { fontSize: 10, marginLeft: 14, marginBottom: 2, color: "#444444" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
});

export function PDFBold({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <View style={{ marginTop: 12, marginBottom: 5 }}>
      <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: accentColor }}>{title.toUpperCase()}</Text>
      <View style={{ borderBottomWidth: 1.5, borderBottomColor: accentColor, marginTop: 2 }} />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={{ borderLeftWidth: 4, borderLeftColor: accentColor, paddingLeft: 12, marginBottom: 14 }}>
          <Text style={{ fontSize: 26, fontFamily: "Helvetica-Bold", color: "#111111", marginBottom: 2 }}>{p.name || "Your Name"}</Text>
          {p.title && <Text style={{ fontSize: 12, color: "#555555", marginBottom: 6 }}>{p.title}</Text>}
          <Text style={{ fontSize: 9, color: "#666666" }}>
            {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join("  ·  ")}
          </Text>
        </View>

        {p.summary && (<><SH title="Summary" /><Text style={s.muted}>{p.summary}</Text></>)}

        {experience.length > 0 && (
          <View>
            <SH title="Experience" />
            {experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }} wrap={false}>
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
              <View key={e.id} style={[s.row, { marginBottom: 6 }]} wrap={false}>
                <View>
                  <Text style={s.bold}>{e.institution}</Text>
                  <Text style={s.muted}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</Text>
                </View>
                <Text style={s.date}>{fmtDate(e.startDate)} – {fmtDate(e.endDate)}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View>
            <SH title="Skills" />
            {skills.map((sk) => <Text key={sk.id} style={{ marginBottom: 2 }}>{sk.category ? <Text style={s.bold}>{sk.category}: </Text> : null}<Text style={s.muted}>{sk.items}</Text></Text>)}
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <SH title="Projects" />
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 6 }} wrap={false}>
                <Text><Text style={s.bold}>{pr.name}</Text>{pr.url ? <Text style={s.date}>  {pr.url}</Text> : null}</Text>
                {pr.description && <Text style={s.muted}>{pr.description}</Text>}
                {pr.technologies && <Text style={{ fontSize: 9, color: "#888888" }}>{pr.technologies}</Text>}
              </View>
            ))}
          </View>
        )}

        {(certifications.length > 0 || languages.length > 0) && (
          <View style={{ flexDirection: "row", gap: 20 }}>
            {certifications.length > 0 && (
              <View style={{ flex: 1 }}>
                <SH title="Certifications" />
                {certifications.map((c) => <Text key={c.id} style={{ marginBottom: 2 }}><Text style={s.bold}>{c.name}</Text>{c.issuer ? <Text style={s.muted}> · {c.issuer}</Text> : null}</Text>)}
              </View>
            )}
            {languages.length > 0 && (
              <View style={{ flex: 1 }}>
                <SH title="Languages" />
                <Text style={s.muted}>{languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join("  ·  ")}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
