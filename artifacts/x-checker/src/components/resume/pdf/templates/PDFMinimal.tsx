import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "../../types";
import { fmtDate } from "../shared/pdfUtils";

const s = StyleSheet.create({
  page: { padding: 42, fontFamily: "Helvetica", fontSize: 10.5, color: "#222222", lineHeight: 1.6 },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#666666" },
  date: { fontSize: 9, color: "#aaaaaa" },
  bullet: { fontSize: 10, marginLeft: 14, marginBottom: 2, color: "#555555" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
});

export function PDFMinimal({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <Text style={{ fontSize: 8.5, color: "#aaaaaa", letterSpacing: 2, marginTop: 14, marginBottom: 5 }}>{title.toUpperCase()}</Text>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 30, fontFamily: "Helvetica", color: "#111111", marginBottom: 3 }}>{p.name || "Your Name"}</Text>
          {p.title && <Text style={{ fontSize: 12, color: accentColor, marginBottom: 8 }}>{p.title}</Text>}
          <Text style={{ fontSize: 9.5, color: "#888888" }}>
            {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join("  ·  ")}
          </Text>
        </View>

        {p.summary && (<><SH title="Profile" /><Text style={s.muted}>{p.summary}</Text></>)}

        {experience.length > 0 && (
          <View>
            <SH title="Experience" />
            {experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }} wrap={false}>
                <View style={s.row}>
                  <View>
                    <Text style={s.bold}>{e.position}</Text>
                    {e.company && <Text style={{ fontSize: 9.5, color: "#888888" }}>{e.company}</Text>}
                  </View>
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
            {skills.map((sk) => <Text key={sk.id} style={{ marginBottom: 2, color: "#555555" }}>{sk.category ? <Text style={s.bold}>{sk.category}: </Text> : null}{sk.items}</Text>)}
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <SH title="Projects" />
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 6 }} wrap={false}>
                <Text><Text style={s.bold}>{pr.name}</Text>{pr.url ? <Text style={s.date}>  {pr.url}</Text> : null}</Text>
                {pr.description && <Text style={s.muted}>{pr.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {(certifications.length > 0 || languages.length > 0) && (
          <View style={{ flexDirection: "row", gap: 20 }}>
            {certifications.length > 0 && (
              <View style={{ flex: 1 }}>
                <SH title="Certifications" />
                {certifications.map((c) => <Text key={c.id} style={{ marginBottom: 2, color: "#555555" }}>{c.name}{c.issuer ? ` · ${c.issuer}` : ""}</Text>)}
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
