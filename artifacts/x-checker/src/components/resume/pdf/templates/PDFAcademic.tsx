import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "../../types";
import { fmtDate } from "../shared/pdfUtils";

const s = StyleSheet.create({
  page: { padding: 34, fontFamily: "Times-Roman", fontSize: 10.5, color: "#1a1a1a", lineHeight: 1.55 },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontFamily: "Times-Italic" },
  muted: { color: "#444444" },
  date: { fontSize: 9.5, color: "#888888" },
  bullet: { fontSize: 10.5, marginLeft: 16, marginBottom: 2, color: "#444444" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
});

export function PDFAcademic({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <View style={{ marginTop: 12, marginBottom: 5 }}>
      <Text style={{ fontSize: 11, fontFamily: "Times-Bold", color: "#111111", paddingBottom: 2 }}>{title}</Text>
      <View style={{ borderBottomWidth: 1.5, borderBottomColor: accentColor }} />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={{ textAlign: "center", borderBottomWidth: 1.5, borderBottomColor: accentColor, paddingBottom: 12, marginBottom: 4 }}>
          <Text style={{ fontSize: 22, fontFamily: "Times-Bold", color: "#111111", marginBottom: 3, textAlign: "center" }}>{p.name || "Your Name"}</Text>
          {p.title && <Text style={{ fontSize: 11, color: "#666666", marginBottom: 6, textAlign: "center" }}>{p.title}</Text>}
          <Text style={{ fontSize: 9.5, color: "#777777", textAlign: "center" }}>
            {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join("  |  ")}
          </Text>
        </View>

        {p.summary && (<><SH title="Research Interests / Summary" /><Text style={s.muted}>{p.summary}</Text></>)}

        {education.length > 0 && (
          <View>
            <SH title="Education" />
            {education.map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }} wrap={false}>
                <View style={s.row}>
                  <Text style={{ fontSize: 11, fontFamily: "Times-Bold" }}>{e.institution}</Text>
                  <Text style={s.date}>{fmtDate(e.startDate)} – {fmtDate(e.endDate)}</Text>
                </View>
                <Text style={s.italic}>{e.degree}{e.field ? ` in ${e.field}` : ""}</Text>
                {e.gpa && <Text style={{ fontSize: 9.5, color: "#777777" }}>GPA: {e.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <SH title="Research &amp; Professional Experience" />
            {experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }} wrap={false}>
                <View style={s.row}>
                  <Text><Text style={s.bold}>{e.position}</Text>{e.company ? <Text style={s.muted}>, {e.company}</Text> : null}</Text>
                  <Text style={s.date}>{fmtDate(e.startDate)} – {e.current ? "Present" : fmtDate(e.endDate)}</Text>
                </View>
                {e.bullets.filter(Boolean).map((b, i) => <Text key={i} style={s.bullet}>• {b}</Text>)}
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <SH title="Publications &amp; Projects" />
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 8, paddingLeft: 10, borderLeftWidth: 1.5, borderLeftColor: accentColor + "44" }} wrap={false}>
                <Text><Text style={s.bold}>{pr.name}</Text>{pr.url ? <Text style={s.date}>  [{pr.url}]</Text> : null}</Text>
                {pr.description && <Text style={s.muted}>{pr.description}</Text>}
                {pr.technologies && <Text style={{ fontSize: 9.5, color: "#777777", fontFamily: "Times-Italic" }}>{pr.technologies}</Text>}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View>
            <SH title="Technical Skills" />
            {skills.map((sk) => <Text key={sk.id} style={{ marginBottom: 3 }}>{sk.category ? <Text style={s.bold}>{sk.category}: </Text> : null}<Text style={s.muted}>{sk.items}</Text></Text>)}
          </View>
        )}

        {certifications.length > 0 && (
          <View>
            <SH title="Awards &amp; Certifications" />
            {certifications.map((c) => (
              <Text key={c.id} style={{ marginBottom: 4 }}><Text style={s.bold}>{c.name}</Text>{c.issuer ? <Text style={s.muted}> — {c.issuer}</Text> : null}{c.date ? <Text style={s.date}> ({fmtDate(c.date)})</Text> : null}</Text>
            ))}
          </View>
        )}

        {languages.length > 0 && (
          <View>
            <SH title="Languages" />
            <Text style={s.muted}>{languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join("  ·  ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
