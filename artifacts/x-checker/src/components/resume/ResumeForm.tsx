import { useState } from "react";
import { Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ResumeData } from "./types";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

type TabId = "personal" | "experience" | "education" | "skills" | "projects" | "certifications" | "languages";

const TABS: { id: TabId; label: string }[] = [
  { id: "personal",       label: "Personal" },
  { id: "experience",     label: "Experience" },
  { id: "education",      label: "Education" },
  { id: "skills",         label: "Skills" },
  { id: "projects",       label: "Projects" },
  { id: "certifications", label: "Certs" },
  { id: "languages",      label: "Languages" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-muted-foreground mb-1 block">{children}</label>;
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}

export function ResumeForm({ data, onChange }: Props) {
  const [tab, setTab] = useState<TabId>("personal");
  const [loadingBullets, setLoadingBullets] = useState<string | null>(null);
  const [bulletSuggestions, setBulletSuggestions] = useState<Record<string, string[]>>({});
  const [expandedExp, setExpandedExp] = useState<string | null>(data.experience[0]?.id ?? null);

  const set = (patch: Partial<ResumeData>) => onChange({ ...data, ...patch });
  const setPersonal = (patch: Partial<ResumeData["personal"]>) =>
    set({ personal: { ...data.personal, ...patch } });

  async function suggestBullets(expId: string, position: string, company: string) {
    if (!position.trim()) return;
    setLoadingBullets(expId);
    try {
      const res = await fetch("/api/resume/suggest-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, company }),
      });
      if (res.ok) {
        const json = (await res.json()) as { bullets?: string[] };
        setBulletSuggestions((prev) => ({ ...prev, [expId]: json.bullets ?? [] }));
      }
    } catch {
      // silently fail
    } finally {
      setLoadingBullets(null);
    }
  }

  function addBulletSuggestion(expId: string, bullet: string) {
    set({
      experience: data.experience.map((e) =>
        e.id === expId ? { ...e, bullets: [...e.bullets, bullet] } : e
      ),
    });
    setBulletSuggestions((prev) => ({
      ...prev,
      [expId]: (prev[expId] ?? []).filter((b) => b !== bullet),
    }));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border shrink-0 bg-background">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px
              ${tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "personal" && (
          <Section>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Full Name</FieldLabel>
                <Input value={data.personal.name} onChange={(e) => setPersonal({ name: e.target.value })} placeholder="Alex Johnson" />
              </div>
              <div>
                <FieldLabel>Job Title</FieldLabel>
                <Input value={data.personal.title} onChange={(e) => setPersonal({ title: e.target.value })} placeholder="Software Engineer" />
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <Input value={data.personal.email} onChange={(e) => setPersonal({ email: e.target.value })} placeholder="alex@example.com" type="email" />
              </div>
              <div>
                <FieldLabel>Phone</FieldLabel>
                <Input value={data.personal.phone} onChange={(e) => setPersonal({ phone: e.target.value })} placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <FieldLabel>Location</FieldLabel>
                <Input value={data.personal.location} onChange={(e) => setPersonal({ location: e.target.value })} placeholder="San Francisco, CA" />
              </div>
              <div>
                <FieldLabel>Website</FieldLabel>
                <Input value={data.personal.website} onChange={(e) => setPersonal({ website: e.target.value })} placeholder="yoursite.com" />
              </div>
            </div>
            <div>
              <FieldLabel>LinkedIn</FieldLabel>
              <Input value={data.personal.linkedin} onChange={(e) => setPersonal({ linkedin: e.target.value })} placeholder="linkedin.com/in/username" />
            </div>
            <div>
              <FieldLabel>Professional Summary</FieldLabel>
              <textarea
                className="w-full text-sm border border-input rounded-md px-3 py-2 resize-none bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[90px]"
                value={data.personal.summary}
                onChange={(e) => setPersonal({ summary: e.target.value })}
                placeholder="Results-driven engineer with 5+ years..."
              />
            </div>
          </Section>
        )}

        {tab === "experience" && (
          <Section>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => {
                const newId = uid();
                set({
                  experience: [
                    ...data.experience,
                    { id: newId, company: "", position: "", startDate: "", endDate: "", current: false, bullets: [] },
                  ],
                });
                setExpandedExp(newId);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Experience
            </Button>

            {data.experience.map((exp) => (
              <div key={exp.id} className="border border-border rounded-lg overflow-hidden">
                {/* Collapse header */}
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                  onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                >
                  <div className="text-sm font-medium truncate">
                    {exp.position || exp.company || "New Position"}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      className="text-destructive hover:text-destructive/80 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        set({ experience: data.experience.filter((x) => x.id !== exp.id) });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {expandedExp === exp.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </div>
                </button>

                {expandedExp === exp.id && (
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <FieldLabel>Position</FieldLabel>
                        <Input value={exp.position} onChange={(e) => set({ experience: data.experience.map((x) => x.id === exp.id ? { ...x, position: e.target.value } : x) })} placeholder="Senior Engineer" />
                      </div>
                      <div>
                        <FieldLabel>Company</FieldLabel>
                        <Input value={exp.company} onChange={(e) => set({ experience: data.experience.map((x) => x.id === exp.id ? { ...x, company: e.target.value } : x) })} placeholder="Acme Corp" />
                      </div>
                      <div>
                        <FieldLabel>Start Date</FieldLabel>
                        <Input type="month" value={exp.startDate} onChange={(e) => set({ experience: data.experience.map((x) => x.id === exp.id ? { ...x, startDate: e.target.value } : x) })} />
                      </div>
                      <div>
                        <FieldLabel>End Date</FieldLabel>
                        <Input type="month" value={exp.endDate} disabled={exp.current} onChange={(e) => set({ experience: data.experience.map((x) => x.id === exp.id ? { ...x, endDate: e.target.value } : x) })} />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => set({ experience: data.experience.map((x) => x.id === exp.id ? { ...x, current: e.target.checked, endDate: "" } : x) })}
                        className="rounded"
                      />
                      Currently working here
                    </label>

                    {/* Bullets */}
                    <div>
                      <FieldLabel>Bullet Points</FieldLabel>
                      {exp.bullets.map((bullet, bi) => (
                        <div key={bi} className="flex gap-1.5 mb-1.5">
                          <textarea
                            className="flex-1 text-xs border border-input rounded px-2 py-1.5 resize-none bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const newBullets = [...exp.bullets];
                              newBullets[bi] = e.target.value;
                              set({ experience: data.experience.map((x) => x.id === exp.id ? { ...x, bullets: newBullets } : x) });
                            }}
                            placeholder="Led team of 5 to ship product on time..."
                          />
                          <button
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-1"
                            onClick={() => {
                              const newBullets = exp.bullets.filter((_, i) => i !== bi);
                              set({ experience: data.experience.map((x) => x.id === exp.id ? { ...x, bullets: newBullets } : x) });
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                        onClick={() => set({ experience: data.experience.map((x) => x.id === exp.id ? { ...x, bullets: [...x.bullets, ""] } : x) })}
                      >
                        + Add bullet
                      </button>
                    </div>

                    {/* AI Suggestions */}
                    <div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 border-primary/30 text-primary hover:bg-primary/5"
                        disabled={loadingBullets === exp.id || !exp.position}
                        onClick={() => suggestBullets(exp.id, exp.position, exp.company)}
                      >
                        {loadingBullets === exp.id
                          ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Generating...</>
                          : <><Sparkles className="h-3 w-3 mr-1" /> ✨ Suggest bullets</>
                        }
                      </Button>
                      {!exp.position && <span className="text-xs text-muted-foreground ml-2">Enter a position first</span>}

                      {(bulletSuggestions[exp.id] ?? []).length > 0 && (
                        <div className="mt-2 space-y-1.5 border border-primary/20 bg-primary/5 rounded-lg p-2.5">
                          <div className="text-xs font-medium text-primary mb-1.5">Click to add:</div>
                          {bulletSuggestions[exp.id].map((sug, si) => (
                            <button
                              key={si}
                              className="w-full text-left text-xs text-foreground bg-background border border-border rounded p-2 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                              onClick={() => addBulletSuggestion(exp.id, sug)}
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}

        {tab === "education" && (
          <Section>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => set({ education: [...data.education, { id: uid(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }] })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Education
            </Button>
            {data.education.map((edu) => (
              <div key={edu.id} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{edu.institution || "New Education"}</span>
                  <button className="text-muted-foreground hover:text-destructive" onClick={() => set({ education: data.education.filter((x) => x.id !== edu.id) })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <FieldLabel>Institution</FieldLabel>
                  <Input value={edu.institution} onChange={(e) => set({ education: data.education.map((x) => x.id === edu.id ? { ...x, institution: e.target.value } : x) })} placeholder="University of California" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel>Degree</FieldLabel>
                    <Input value={edu.degree} onChange={(e) => set({ education: data.education.map((x) => x.id === edu.id ? { ...x, degree: e.target.value } : x) })} placeholder="Bachelor of Science" />
                  </div>
                  <div>
                    <FieldLabel>Field of Study</FieldLabel>
                    <Input value={edu.field} onChange={(e) => set({ education: data.education.map((x) => x.id === edu.id ? { ...x, field: e.target.value } : x) })} placeholder="Computer Science" />
                  </div>
                  <div>
                    <FieldLabel>Start Date</FieldLabel>
                    <Input type="month" value={edu.startDate} onChange={(e) => set({ education: data.education.map((x) => x.id === edu.id ? { ...x, startDate: e.target.value } : x) })} />
                  </div>
                  <div>
                    <FieldLabel>End Date</FieldLabel>
                    <Input type="month" value={edu.endDate} onChange={(e) => set({ education: data.education.map((x) => x.id === edu.id ? { ...x, endDate: e.target.value } : x) })} />
                  </div>
                </div>
                <div>
                  <FieldLabel>GPA (optional)</FieldLabel>
                  <Input value={edu.gpa} onChange={(e) => set({ education: data.education.map((x) => x.id === edu.id ? { ...x, gpa: e.target.value } : x) })} placeholder="3.8" className="w-32" />
                </div>
              </div>
            ))}
          </Section>
        )}

        {tab === "skills" && (
          <Section>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => set({ skills: [...data.skills, { id: uid(), category: "", items: "" }] })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Skill Category
            </Button>
            {data.skills.map((s) => (
              <div key={s.id} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{s.category || "New Category"}</span>
                  <button className="text-muted-foreground hover:text-destructive" onClick={() => set({ skills: data.skills.filter((x) => x.id !== s.id) })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <FieldLabel>Category Name</FieldLabel>
                  <Input value={s.category} onChange={(e) => set({ skills: data.skills.map((x) => x.id === s.id ? { ...x, category: e.target.value } : x) })} placeholder="Languages" />
                </div>
                <div>
                  <FieldLabel>Skills (comma-separated)</FieldLabel>
                  <Input value={s.items} onChange={(e) => set({ skills: data.skills.map((x) => x.id === s.id ? { ...x, items: e.target.value } : x) })} placeholder="TypeScript, Python, Go" />
                </div>
              </div>
            ))}
          </Section>
        )}

        {tab === "projects" && (
          <Section>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => set({ projects: [...data.projects, { id: uid(), name: "", description: "", url: "", technologies: "" }] })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Project
            </Button>
            {data.projects.map((proj) => (
              <div key={proj.id} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{proj.name || "New Project"}</span>
                  <button className="text-muted-foreground hover:text-destructive" onClick={() => set({ projects: data.projects.filter((x) => x.id !== proj.id) })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <FieldLabel>Project Name</FieldLabel>
                  <Input value={proj.name} onChange={(e) => set({ projects: data.projects.map((x) => x.id === proj.id ? { ...x, name: e.target.value } : x) })} placeholder="OpenMetrics Dashboard" />
                </div>
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    className="w-full text-sm border border-input rounded-md px-3 py-2 resize-none bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[60px]"
                    value={proj.description}
                    onChange={(e) => set({ projects: data.projects.map((x) => x.id === proj.id ? { ...x, description: e.target.value } : x) })}
                    placeholder="Real-time monitoring dashboard..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel>URL / GitHub</FieldLabel>
                    <Input value={proj.url} onChange={(e) => set({ projects: data.projects.map((x) => x.id === proj.id ? { ...x, url: e.target.value } : x) })} placeholder="github.com/user/repo" />
                  </div>
                  <div>
                    <FieldLabel>Technologies</FieldLabel>
                    <Input value={proj.technologies} onChange={(e) => set({ projects: data.projects.map((x) => x.id === proj.id ? { ...x, technologies: e.target.value } : x) })} placeholder="React, Node.js, PostgreSQL" />
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )}

        {tab === "certifications" && (
          <Section>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => set({ certifications: [...data.certifications, { id: uid(), name: "", issuer: "", date: "", url: "" }] })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Certification
            </Button>
            {data.certifications.map((c) => (
              <div key={c.id} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{c.name || "New Certification"}</span>
                  <button className="text-muted-foreground hover:text-destructive" onClick={() => set({ certifications: data.certifications.filter((x) => x.id !== c.id) })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <Input value={c.name} onChange={(e) => set({ certifications: data.certifications.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x) })} placeholder="AWS Solutions Architect" />
                  </div>
                  <div>
                    <FieldLabel>Issuer</FieldLabel>
                    <Input value={c.issuer} onChange={(e) => set({ certifications: data.certifications.map((x) => x.id === c.id ? { ...x, issuer: e.target.value } : x) })} placeholder="Amazon Web Services" />
                  </div>
                  <div>
                    <FieldLabel>Date</FieldLabel>
                    <Input type="month" value={c.date} onChange={(e) => set({ certifications: data.certifications.map((x) => x.id === c.id ? { ...x, date: e.target.value } : x) })} />
                  </div>
                  <div>
                    <FieldLabel>Credential URL (optional)</FieldLabel>
                    <Input value={c.url} onChange={(e) => set({ certifications: data.certifications.map((x) => x.id === c.id ? { ...x, url: e.target.value } : x) })} placeholder="https://..." />
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )}

        {tab === "languages" && (
          <Section>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => set({ languages: [...data.languages, { id: uid(), language: "", proficiency: "" }] })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Language
            </Button>
            {data.languages.map((l) => (
              <div key={l.id} className="border border-border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{l.language || "New Language"}</span>
                  <button className="text-muted-foreground hover:text-destructive" onClick={() => set({ languages: data.languages.filter((x) => x.id !== l.id) })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel>Language</FieldLabel>
                    <Input value={l.language} onChange={(e) => set({ languages: data.languages.map((x) => x.id === l.id ? { ...x, language: e.target.value } : x) })} placeholder="Spanish" />
                  </div>
                  <div>
                    <FieldLabel>Proficiency</FieldLabel>
                    <select
                      className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                      value={l.proficiency}
                      onChange={(e) => set({ languages: data.languages.map((x) => x.id === l.id ? { ...x, proficiency: e.target.value } : x) })}
                    >
                      <option value="">Select...</option>
                      <option>Native</option>
                      <option>Fluent</option>
                      <option>Conversational</option>
                      <option>Basic</option>
                      <option>Elementary</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}
