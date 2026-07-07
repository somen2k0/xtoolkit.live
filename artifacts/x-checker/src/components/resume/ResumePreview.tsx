import { forwardRef } from "react";
import type { ResumeData } from "./types";
import { TemplateClassic } from "./templates/TemplateClassic";
import { TemplateModern } from "./templates/TemplateModern";
import { TemplateExecutive } from "./templates/TemplateExecutive";
import { TemplateMinimal } from "./templates/TemplateMinimal";
import { TemplateBold } from "./templates/TemplateBold";
import { TemplateElegant } from "./templates/TemplateElegant";
import { TemplateTech } from "./templates/TemplateTech";
import { TemplateCreative } from "./templates/TemplateCreative";
import { TemplateAcademic } from "./templates/TemplateAcademic";
import { TemplateCompact } from "./templates/TemplateCompact";

interface ResumePreviewProps {
  data: ResumeData;
}

const TEMPLATE_MAP: Record<string, React.ComponentType<{ data: ResumeData }>> = {
  classic:   TemplateClassic,
  modern:    TemplateModern,
  executive: TemplateExecutive,
  minimal:   TemplateMinimal,
  bold:      TemplateBold,
  elegant:   TemplateElegant,
  tech:      TemplateTech,
  creative:  TemplateCreative,
  academic:  TemplateAcademic,
  compact:   TemplateCompact,
};

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data }, ref) => {
    const Template = TEMPLATE_MAP[data.selectedTemplate] ?? TemplateClassic;

    return (
      <div
        ref={ref}
        className="resume-preview shadow-lg"
        style={{
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          backgroundColor: "#ffffff",
          transformOrigin: "top left",
          overflow: "hidden",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      >
        <Template data={data} />
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";
