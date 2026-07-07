import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "../../types";
import { fmtDate, contactLine } from "../shared/pdfUtils";

const s = StyleSheet.create({
  page: { padding: 36, fontFamily: "Times-Roman", fontSize: 10.5, color: "#1a1a1a", lineHeight: 1.5 },
  name: { fontSize: 24, textAlign: "center", marginBottom: 3, color: "#111111" },
  contact: { fontSize: 9.5, textAlign: "center", color: "#555555", marginBottom: 2 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#cccccc", marginVertical: 8 },
  sh: { fontSize: 10, fontFamily: "Times-Bold", letterSpacing: 1, marginTop: 12, marginBottom: 4, paddingBottom: 2 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontFamily: "Times-Italic" },
  date: { fontSize: 9, color: "#777777" },
  bullet: { fontSize: 10, marginLeft: 14, marginBottom: 2, color: "#333333" },
  muted: { color: "#555555" },
});

export function PDFClassic({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={[s.name, { color: accentColor }]}>{p.name || "Your Name"}</Text>
        {p.title && <Text style={{ fontSize: 11, textAlign: "center", color: "#555555", marginBottom: 4 }}>{p.title}</Text>}
        <Text style={s.contact}>{contactLine([p.email, p.phone, p.location, p.linkedin, p.website])}</Text>
        <View style={s.divider} />

        {p.summary && (
          <View>
            <View style={[s.sh, { borderBottomWidth: 1, borderBottomColor: accentColor }]}><Text style={{ color: accentColor }}>{("PROFILE").toUpperCase()}</Text></View>
            <Text style={s.muted}>{p.summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <View style={[s.sh, { borderBottomWidth: 1, borderBottomColor: accentColor }]}><Text style={{ color: accentColor }}>{("EXPERIENCE").toUpperCase()}</Text></View>
            {experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }} wrap={false}>
                <View style={s.row}>
                  <Text style={s.bold}>{e.position}{e.company ? <Text style={s.muted}> — {e.company}</Text> : null}</Text>
                  <Text style={s.date}>{fmtDate(e.startDate)} – {e.current ? "Present" : fmtDate(e.endDate)}</Text>
                </View>
                {e.bullets.filter(Boolean).map((b, i) => <Text key={i} style={s.bullet}>• {b}</Text>)}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <View style={[s.sh, { borderBottomWidth: 1, borderBottomColor: accentColor }]}><Text style={{ color: accentColor }}>{("EDUCATION").toUpperCase()}</Text></View>
            {education.map((e) => (
              <View key={e.id} style={[s.row, { marginBottom: 6 }]} wrap={false}>
                <View>
                  <Text style={s.bold}>{e.institution}</Text>
                  <Text style={[s.italic, s.muted]}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</Text>
                </View>
                <Text style={s.date}>{fmtDate(e.startDate)} – {fmtDate(e.endDate)}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View>
            <View style={[s.sh, { borderBottomWidth: 1, borderBottomColor: accentColor }]}><Text style={{ color: accentColor }}>{("SKILLS").toUpperCase()}</Text></View>
            {skills.map((sk) => (
              <Text key={sk.id} style={{ marginBottom: 2 }}>{sk.category ? <Text style={s.bold}>{sk.category}: </Text> : null}<Text style={s.muted}>{sk.items}</Text></Text>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <View style={[s.sh, { borderBottomWidth: 1, borderBottomColor: accentColor }]}><Text style={{ color: accentColor }}>{("PROJECTS").toUpperCase()}</Text></View>
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
                <View style={[s.sh, { borderBottomWidth: 1, borderBottomColor: accentColor }]}><Text style={{ color: accentColor }}>{("CERTIFICATIONS").toUpperCase()}</Text></View>
                {certifications.map((c) => <Text key={c.id} style={{ marginBottom: 2 }}><Text style={s.bold}>{c.name}</Text>{c.issuer ? <Text style={s.muted}> · {c.issuer}</Text> : null}</Text>)}
              </View>
            )}
            {languages.length > 0 && (
              <View style={{ flex: 1 }}>
                <View style={[s.sh, { borderBottomWidth: 1, borderBottomColor: accentColor }]}><Text style={{ color: accentColor }}>{("LANGUAGES").toUpperCase()}</Text></View>
                <Text style={s.muted}>{languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join("  ·  ")}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
