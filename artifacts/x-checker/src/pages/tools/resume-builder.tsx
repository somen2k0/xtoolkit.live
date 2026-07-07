import React, { useState, useEffect, useRef, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { DEFAULT_RESUME, TEMPLATES, ACCENT_PRESETS, type ResumeData } from "@/components/resume/types";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Eye, Pencil } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const LS_KEY = "xtoolkit_resume";
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

function loadFromStorage(): ResumeData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_RESUME, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_RESUME;
}

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(loadFromStorage);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [customColor, setCustomColor] = useState(data.accentColor);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 48;
        const scale = Math.min(containerWidth / A4_WIDTH_PX, 1);
        setPreviewScale(scale);
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-save every 30s
  useEffect(() => {
    const id = setInterval(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
    }, 30000);
    return () => clearInterval(id);
  }, [data]);

  const handleData = useCallback((next: ResumeData) => setData(next), []);

  async function handleDownloadPDF() {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      console.log("Starting PDF generation...");
      const { pdf } = await import("@react-pdf/renderer");
      console.log("pdf imported:", pdf);
      const { PDFDocument } = await import("@/components/resume/pdf/PDFDocument");
      console.log("PDFDocument imported:", PDFDocument);
      const element = React.createElement(PDFDocument, { data });
      console.log("element created:", element);
      const instance = pdf(element);
      console.log("instance:", instance);
      const blob = await instance.toBlob();
      console.log("blob:", blob);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(data.personal.name || "resume").replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF error:", err);
      alert(`PDF failed: ${err}`);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleColorChange(color: string) {
    setCustomColor(color);
    setData((d) => ({ ...d, accentColor: color }));
  }

  return (
    <Layout>
      <SeoHead
        title="Free Resume Builder — 10 Templates, AI Suggestions & PDF Export | X Toolkit"
        description="Create a professional resume free with 10 templates, AI-powered bullet suggestions, and instant PDF download. ATS-friendly. No signup required."
        keywords="resume builder free, free resume maker, online resume builder, ATS resume builder, resume templates, CV builder free"
        path="/tools/resume-builder"
      />

      <div className="min-h-screen bg-background flex flex-col">
        {/* Top toolbar */}
        <div className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-20">
          <div className="max-w-[1400px] mx-auto px-3 md:px-5 py-2.5 flex flex-col gap-2">
            {/* Title row */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-base font-bold leading-tight">Resume Builder</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Free · 10 templates · AI bullets · PDF export · No signup</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile tab toggle */}
                <div className="flex md:hidden border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setMobileView("edit")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${mobileView === "edit" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => setMobileView("preview")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${mobileView === "preview" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    <Eye className="h-3 w-3" /> Preview
                  </button>
                </div>

                <Button size="sm" onClick={handleDownloadPDF} disabled={isGenerating} className="shadow-sm shadow-primary/20 gap-1.5">
                  {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{isGenerating ? "Generating…" : "Download PDF"}</span>
                  <span className="sm:hidden">{isGenerating ? "…" : "PDF"}</span>
                </Button>
              </div>
            </div>

            {/* Template + color row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-0.5">
              {/* Template pills */}
              <div className="flex items-center gap-1.5 shrink-0">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setData((d) => ({ ...d, selectedTemplate: t.id }))}
                    title={t.desc}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all
                      ${data.selectedTemplate === t.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-border shrink-0" />

              {/* Color presets */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Color:</span>
                {ACCENT_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    title={color}
                    style={{ background: color }}
                    className={`h-5 w-5 rounded-full border-2 transition-all ${data.accentColor === color ? "border-foreground scale-110" : "border-transparent hover:scale-105"}`}
                  />
                ))}
                {/* Custom hex */}
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="h-5 w-5 rounded-full border-0 cursor-pointer overflow-hidden p-0"
                  title="Custom color"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Split view */}
        <div className="flex-1 flex max-w-[1400px] mx-auto w-full">
          {/* Left: Form */}
          <div className={`w-full md:w-[400px] lg:w-[440px] flex flex-col border-r border-border shrink-0 ${mobileView === "preview" ? "hidden md:flex" : "flex"}`} style={{ height: "calc(100vh - 130px)" }}>
            <ResumeForm data={data} onChange={handleData} />
          </div>

          {/* Right: Preview */}
          <div
            ref={containerRef}
            className={`flex-1 overflow-auto bg-muted/30 p-4 md:p-6 ${mobileView === "edit" ? "hidden md:block" : "block"}`}
          >
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top center",
                  marginBottom: `${(A4_HEIGHT_PX * previewScale) - A4_HEIGHT_PX}px`,
                }}
              >
                <ResumePreview ref={previewRef} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEO content ── */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-3">Free Online Resume Builder — No Signup, No Watermark</h2>
          <p className="text-muted-foreground leading-relaxed">X Toolkit's Resume Builder is a completely free, browser-based tool that lets you create a professional resume in minutes. Everything runs in your browser — your data is never sent to a server, stored in a database, or shared with third parties. The only persistence is your own browser's localStorage, which auto-saves your progress every 30 seconds.</p>
          <p className="text-muted-foreground leading-relaxed mt-3">Unlike most resume builders that lock features behind a paywall or slap a watermark on your PDF, every feature here is completely free: all 10 templates, the AI bullet point generator, the custom color picker, and PDF export via browser print. No account required. No email. No credit card.</p>

          <h3 className="text-xl font-bold mt-8 mb-3">How to Write Each Section</h3>

          <h4 className="text-lg font-semibold mt-6 mb-2">Personal Information</h4>
          <p className="text-muted-foreground">Fill in your full name, job title, email, phone, and location. For the website field, include your portfolio or personal site. The Professional Summary is your 2–3 sentence pitch — keep it to the point and lead with your years of experience and top skills. Avoid "passionate about" and other overused phrases.</p>

          <h4 className="text-lg font-semibold mt-6 mb-2">Work Experience</h4>
          <p className="text-muted-foreground">List positions in reverse chronological order (most recent first). For each role, write 3–5 bullet points that lead with strong action verbs (Led, Built, Reduced, Increased, Shipped). Use the <strong>✨ Suggest bullets</strong> button to get AI-generated bullet point ideas based on your job title — then customize them with your actual numbers and achievements. Quantify results wherever possible: "Reduced load time by 40%" beats "Improved performance."</p>

          <h4 className="text-lg font-semibold mt-6 mb-2">Education</h4>
          <p className="text-muted-foreground">Include institution name, degree, field of study, and graduation dates. GPA is optional — only include it if it's 3.5 or above. For experienced professionals with 5+ years of experience, education can be brief (one or two lines per entry).</p>

          <h4 className="text-lg font-semibold mt-6 mb-2">Skills</h4>
          <p className="text-muted-foreground">Organize skills by category (Languages, Frameworks, Tools, Cloud, etc.). List items as comma-separated values. Put your strongest and most relevant skills first within each category. Mirror the language used in job descriptions you're targeting to pass ATS keyword filters.</p>

          <h4 className="text-lg font-semibold mt-6 mb-2">Projects</h4>
          <p className="text-muted-foreground">Include projects that demonstrate real-world impact or technical skill. Link to GitHub repos or live demos where possible. Use the Technologies field to list your stack — these will be picked up by ATS systems.</p>

          <h3 className="text-xl font-bold mt-8 mb-3">ATS Tips — Make Your Resume Pass the Bots</h3>
          <p className="text-muted-foreground">Most large companies use Applicant Tracking Systems (ATS) to filter resumes before a human ever sees them. Here's how to optimize for ATS:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-3">
            <li><strong>Use a single-column template</strong> — Classic, Modern, Executive, Minimal, Tech, or Compact. The Creative template's two-column layout may confuse ATS parsers.</li>
            <li><strong>Avoid tables, text boxes, and images</strong> — ATS systems often can't parse these correctly.</li>
            <li><strong>Mirror job description keywords</strong> — If the JD says "TypeScript," use "TypeScript" not "TS."</li>
            <li><strong>Use standard section headers</strong> — "Experience," "Education," "Skills" — not creative alternatives like "Where I've Been."</li>
            <li><strong>Export as PDF</strong> — Most ATS systems accept PDF well. Use the Download PDF button for a one-click A4 PDF export.</li>
            <li><strong>Keep to one page</strong> for under 10 years of experience; two pages is acceptable for senior roles.</li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-3">10 Resume Template Designs</h3>
          <ul className="space-y-2 text-muted-foreground mt-3">
            <li><strong>Classic</strong> — Traditional serif (Georgia) single-column layout. Best for conservative industries like law, finance, or government. Highly ATS-safe.</li>
            <li><strong>Modern</strong> — Clean Inter sans-serif with colored section borders. Versatile for tech, marketing, and startups.</li>
            <li><strong>Executive</strong> — Dark header banner, two-tone layout. Suited for director-level and C-suite roles.</li>
            <li><strong>Minimal</strong> — Maximum whitespace, light-weight typeface. Great for designers and creatives who want a refined look.</li>
            <li><strong>Bold</strong> — High-contrast with accent pill headers. Grabs attention, suitable for sales, marketing, and growth roles.</li>
            <li><strong>Elegant</strong> — Centered serif layout with decorative dividers. Ideal for consulting, finance, and law.</li>
            <li><strong>Tech</strong> — Monospace accents, skill badges, prominent project section. Purpose-built for software engineers and developers.</li>
            <li><strong>Creative</strong> — Two-column sidebar design. Visually striking but use with caution for ATS — not recommended for large-company applications.</li>
            <li><strong>Academic</strong> — Formal structure with prominent education and project/publication sections. For research, PhD, and academic roles.</li>
            <li><strong>Compact</strong> — Smaller type, tighter line spacing, two-column skills section. Fits more content on a single page for experienced professionals.</li>
          </ul>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-semibold mb-5">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {[
              {
                q: "Is this resume builder really free?",
                a: "Yes, completely. All 10 templates, AI bullet suggestions, the color picker, and PDF export are free with no account or payment required. Your data stays in your browser's localStorage.",
              },
              {
                q: "How does the AI bullet point generator work?",
                a: "When you click '✨ Suggest bullets' on an experience entry, the tool sends your job title and company name to our Groq-powered API (Llama 3.3 70B). It returns 4 ATS-friendly bullet points with action verbs and quantified results. You can click any suggestion to add it to your resume, then edit it with your actual numbers.",
              },
              {
                q: "Will my resume pass ATS screening?",
                a: "Single-column templates (Classic, Modern, Executive, Minimal, Tech, Academic, Compact) are fully ATS-compatible. The Creative template uses a two-column sidebar layout that may not parse correctly in some ATS systems. For best ATS compatibility, use Classic or Modern.",
              },
              {
                q: "How do I export my resume as a PDF?",
                a: "Click the 'Download PDF' button at the top. The tool uses html2canvas and jsPDF to render your resume to a pixel-perfect A4 PDF and download it automatically — no print dialog, no browser configuration needed. The file is named after your name (e.g. Alex_Johnson_Resume.pdf).",
              },
              {
                q: "Is my resume data saved anywhere?",
                a: "Your resume data is auto-saved to your browser's localStorage every 30 seconds. It is never sent to any server (except the position/company text used for AI bullet suggestions). Clearing your browser's localStorage will erase your saved resume.",
              },
              {
                q: "Can I change the color scheme?",
                a: "Yes. Use the 8 preset accent colors in the toolbar, or click the color wheel icon to pick any custom hex color. The accent color updates in real-time across all templates — changing it from blue to orange takes one click.",
              },
            ].map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border border-border bg-card px-5">
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary py-4">{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Layout>
  );
}
