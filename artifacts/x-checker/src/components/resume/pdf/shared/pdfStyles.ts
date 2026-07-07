import { StyleSheet } from "@react-pdf/renderer";

export const base = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    lineHeight: 1.4,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 4,
    paddingBottom: 2,
  },
  bullet: {
    fontSize: 9.5,
    marginLeft: 12,
    marginBottom: 2,
    color: "#333333",
  },
  dateText: {
    fontSize: 9,
    color: "#666666",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  italic: {
    fontFamily: "Helvetica-Oblique",
  },
  muted: {
    color: "#555555",
  },
});
