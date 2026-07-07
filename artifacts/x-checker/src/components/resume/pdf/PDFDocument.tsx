import type { ResumeData } from "../types";
import { PDFClassic } from "./templates/PDFClassic";
import { PDFModern } from "./templates/PDFModern";
import { PDFExecutive } from "./templates/PDFExecutive";
import { PDFMinimal } from "./templates/PDFMinimal";
import { PDFBold } from "./templates/PDFBold";
import { PDFElegant } from "./templates/PDFElegant";
import { PDFTech } from "./templates/PDFTech";
import { PDFCreative } from "./templates/PDFCreative";
import { PDFAcademic } from "./templates/PDFAcademic";
import { PDFCompact } from "./templates/PDFCompact";

const PDF_MAP: Record<string, React.ComponentType<{ data: ResumeData }>> = {
  classic:   PDFClassic,
  modern:    PDFModern,
  executive: PDFExecutive,
  minimal:   PDFMinimal,
  bold:      PDFBold,
  elegant:   PDFElegant,
  tech:      PDFTech,
  creative:  PDFCreative,
  academic:  PDFAcademic,
  compact:   PDFCompact,
};

export function PDFDocument({ data }: { data: ResumeData }) {
  const Template = PDF_MAP[data.selectedTemplate] ?? PDFClassic;
  return <Template data={data} />;
}
