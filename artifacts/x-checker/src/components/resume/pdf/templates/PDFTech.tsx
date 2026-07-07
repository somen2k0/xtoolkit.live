import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "../../types";
import { fmtDate } from "../shared/pdfUtils";

const s = StyleSheet.create({
  page: { padding: 28, fontFamily: "Helvetica", fontSize: 10.5, color: "#222222", lineHeight: 1.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  mono: { fontFamily: "Courier" },
  monoBold: { fontFamily: "Courier-Bold" },
  muted: { color: "#444444" },
  date: { fontSize: 9, color: "#888888", fontFamily: "Courier" },
  bullet: { fontSize: 10, marginLeft: 14, marginBottom: 2, color: "#444444" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
});

export function PDFTech({ data }: { data: ResumeData }) {
  const { personal: p, experience, education, skills, projects, certifications, languages, accentColor } = data;

  const SH = ({ title }: { title: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 6 }}>
      <Text style={{ fontFamily: "Courier-Bold", color: accentColor, fontSize: 11, marginRight: 6 }}>$</Text>
      <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111111", letterSpacing: 0.5 }}>{title.toUpperCase()}</Text>
      <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: "#e0e0e0", marginLeft: 8 }} />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={{ borderLeftWidth: 3, borderLeftColor: accentColor, paddingLeft: 10, marginBottom: 14 }}>
          <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", color: "#111111", marginBottom: 2 }}>{p.name || "Your Name"}</Text>
          {p.title && <Text style={{ fontSize: 12, color: accentColor, fontFamily: "Courier", marginBottom: 6 }}>{p.title}</Text>}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {([
              p.email    ? { v: p.email,    mono: true  } : null,
              p.phone    ? { v: p.phone,    mono: false } : null,
              p.location ? { v: p.location, mono: false } : null,
              p.linkedin ? { v: p.linkedin, mono: true  } : null,
              p.website  ? { v: p.website,  mono: true  } : null,
            ].filter((x): x is { v: string; mono: boolean } => x !== null)).map((item, i) => (
              <Text key={i} style={{ fontSize: 9, color: item.mono ? accentColor : "#666666", fontFamily: item.mono ? "Courier" : "Helvetica", marginRight: 12 }}>{item.v}</Text>
            ))}
          </View>
        </View>

        {p.summary && (<><SH title="About" /><Text style={s.muted}>{p.summary}</Text></>)}

        {skills.length > 0 && (
          <View>
            <SH title="Skills" />
            {skills.map((sk) => (
              <View key={sk.id} style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 4, alignItems: "center" }}>
                {sk.category && <Text style={{ fontFamily: "Courier-Bold", color: accentColor, fontSize: 9.5, marginRight: 6 }}>[{sk.category}]</Text>}
                {sk.items.split(",").map((item) => item.trim()).filter(Boolean).map((item, i) => (
                  <View key={i} style={{ borderWidth: 0.75, borderColor: accentColor, borderRadius: 2, paddingHorizontal: 5, paddingVertical: 1, marginRight: 4, marginBottom: 3 }}>
                    <Text style={{ fontSize: 9, fontFamily: "Courier", color: "#333333" }}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <SH title="Experience" />
            {experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }} wrap={false}>
                <View style={s.row}>
                  <Text><Text style={s.bold}>{e.position}</Text>{e.company ? <Text style={s.muted}> @ {e.company}</Text> : null}</Text>
                  <Text style={s.date}>{fmtDate(e.startDate)} – {e.current ? "now" : fmtDate(e.endDate)}</Text>
                </View>
                {e.bullets.filter(Boolean).map((b, i) => <Text key={i} style={s.bullet}>• {b}</Text>)}
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <SH title="Projects" />
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 8, borderWidth: 0.5, borderColor: "#eeeeee", borderRadius: 3, padding: 8 }} wrap={false}>
                <View style={s.row}>
                  <Text style={{ fontFamily: "Courier-Bold", fontSize: 10 }}>{pr.name}</Text>
                  {pr.url && <Text style={{ fontFamily: "Courier", fontSize: 9, color: accentColor }}>{pr.url}</Text>}
                </View>
                {pr.description && <Text style={{ marginTop: 2, color: "#444444" }}>{pr.description}</Text>}
                {pr.technologies && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
                    {pr.technologies.split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                      <View key={i} style={{ borderWidth: 0.5, borderColor: accentColor, borderRadius: 2, paddingHorizontal: 4, paddingVertical: 1, marginRight: 3, marginBottom: 2 }}>
                        <Text style={{ fontSize: 8.5, fontFamily: "Courier", color: "#555555" }}>{t}</Text>
                      </View>
                    ))}
                  </View>
                )}
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

        {languages.length > 0 && (
          <View>
            <SH title="Languages" />
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {languages.map((l, i) => (
                <View key={l.id} style={{ borderWidth: 0.75, borderColor: accentColor, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 9.5 }}>{l.language}{l.proficiency ? ` · ${l.proficiency}` : ""}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
