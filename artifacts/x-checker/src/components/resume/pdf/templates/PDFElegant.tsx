import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "../../types";
import { fmtDate } from "../shared/pdfUtils";

const s = StyleSheet.create({
  page: { padding: 38, fontFamily: "Times-Roman", fontSize: 10.5, color: "#2c2c2c", lineHeight: 1.55, backgroundColor: "#fdfcfb" },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontFamily: "Times-Italic" },
  boldItalic: { fontFamily: "Times-BoldItalic" },
  muted: { color: "#555555" },
  date: { fontSize: 9.5, color: "#999999" },
  bullet: { fontSize: 10, marginLeft: 14, marginBottom: 2, color: "#555555" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  centered: { textAlign: "center" },
});

export function PDFElegant({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <View style={{ textAlign: "center", marginTop: 16, marginBottom: 8 }}>
      <Text style={{ fontSize: 9, color: "#888888", letterSpacing: 3, textAlign: "center" }}>{title.toUpperCase()}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
        <View style={{ flex: 1, borderBottomWidth: 0.5, borderBottomColor: "#cccccc" }} />
        <View style={{ width: 4, height: 4, backgroundColor: accentColor, borderRadius: 2, marginHorizontal: 8 }} />
        <View style={{ flex: 1, borderBottomWidth: 0.5, borderBottomColor: "#cccccc" }} />
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={{ textAlign: "center", paddingBottom: 14 }}>
          <View style={{ borderBottomWidth: 0.75, borderBottomColor: accentColor, marginBottom: 12, opacity: 0.5 }} />
          <Text style={{ fontSize: 26, fontFamily: "Times-Roman", color: "#111111", marginBottom: 5, textAlign: "center" }}>{p.name || "Your Name"}</Text>
          {p.title && <Text style={{ fontSize: 11, color: accentColor, letterSpacing: 1.5, textAlign: "center", marginBottom: 8 }}>{p.title.toUpperCase()}</Text>}
          <Text style={{ fontSize: 9.5, color: "#888888", textAlign: "center" }}>
            {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join("  ·  ")}
          </Text>
          <View style={{ borderBottomWidth: 0.75, borderBottomColor: accentColor, marginTop: 12, opacity: 0.5 }} />
        </View>

        {p.summary && (<><SH title="Profile" /><Text style={[s.italic, s.muted, { textAlign: "center" }]}>{p.summary}</Text></>)}

        {experience.length > 0 && (
          <View>
            <SH title="Experience" />
            {experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }} wrap={false}>
                <View style={s.row}>
                  <Text><Text style={s.boldItalic}>{e.position}</Text>{e.company ? <Text style={s.muted}> — {e.company}</Text> : null}</Text>
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
              <View key={e.id} style={{ marginBottom: 8, textAlign: "center" }} wrap={false}>
                <Text style={[s.bold, { textAlign: "center" }]}>{e.institution}</Text>
                <Text style={[s.italic, s.muted, { textAlign: "center" }]}>{e.degree}{e.field ? `, ${e.field}` : ""}{e.gpa ? ` · ${e.gpa}` : ""}</Text>
                <Text style={[s.date, { textAlign: "center" }]}>{fmtDate(e.startDate)} – {fmtDate(e.endDate)}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View>
            <SH title="Skills" />
            <Text style={{ textAlign: "center", color: "#555555" }}>
              {skills.map((sk) => `${sk.category ? sk.category + ": " : ""}${sk.items}`).join("  ·  ")}
            </Text>
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <SH title="Projects" />
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 8, textAlign: "center" }} wrap={false}>
                <Text><Text style={s.boldItalic}>{pr.name}</Text>{pr.url ? <Text style={s.date}>  {pr.url}</Text> : null}</Text>
                {pr.description && <Text style={[s.muted, { textAlign: "center" }]}>{pr.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {(certifications.length > 0 || languages.length > 0) && (
          <View style={{ flexDirection: "row", gap: 20 }}>
            {certifications.length > 0 && (
              <View style={{ flex: 1 }}>
                <SH title="Certifications" />
                {certifications.map((c) => <Text key={c.id} style={{ textAlign: "center", marginBottom: 2 }}><Text style={s.boldItalic}>{c.name}</Text>{c.issuer ? <Text style={s.muted}> · {c.issuer}</Text> : null}</Text>)}
              </View>
            )}
            {languages.length > 0 && (
              <View style={{ flex: 1 }}>
                <SH title="Languages" />
                <Text style={{ textAlign: "center", color: "#555555" }}>{languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join("  ·  ")}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
