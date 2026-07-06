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

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data }, ref) => {
    const Template = TEMPLATE_MAP[data.selectedTemplate] ?? TemplateClassic;

    return (
      <div
        ref={ref}
        className="resume-preview bg-white shadow-lg"
        style={{
          width: "100%",
          minHeight: 297 * (96 / 25.4),
          transformOrigin: "top left",
          overflow: "hidden",
        }}
      >
        <Template data={data} />
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";
