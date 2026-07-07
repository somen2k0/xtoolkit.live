export interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
    photo?: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: Array<{ id: string; category: string; items: string }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    url: string;
    technologies: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url: string;
  }>;
  languages: Array<{ id: string; language: string; proficiency: string }>;
  accentColor: string;
  selectedTemplate: string;
}

export const DEFAULT_RESUME: ResumeData = {
  personal: {
    name: "Alex Johnson",
    title: "Senior Software Engineer",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    linkedin: "linkedin.com/in/alexjohnson",
    summary:
      "Results-driven Software Engineer with 6+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and mentoring junior engineers.",
  },
  experience: [
    {
      id: "exp1",
      company: "Acme Corp",
      position: "Senior Software Engineer",
      startDate: "2021-03",
      endDate: "",
      current: true,
      bullets: [
        "Led migration of monolithic app to microservices, reducing deployment time by 60%",
        "Mentored team of 4 junior engineers through code reviews and pair programming",
        "Implemented CI/CD pipeline that cut production incidents by 40%",
      ],
    },
    {
      id: "exp2",
      company: "Startup Inc",
      position: "Software Engineer",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      bullets: [
        "Built React dashboard serving 50k+ daily active users",
        "Optimized database queries, improving API response time by 35%",
      ],
    },
  ],
  education: [
    {
      id: "edu1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2014-08",
      endDate: "2018-05",
      gpa: "3.8",
    },
  ],
  skills: [
    { id: "sk1", category: "Languages", items: "TypeScript, JavaScript, Python, Go" },
    { id: "sk2", category: "Frontend", items: "React, Next.js, Tailwind CSS, Vite" },
    { id: "sk3", category: "Backend", items: "Node.js, Express, PostgreSQL, Redis" },
    { id: "sk4", category: "DevOps", items: "Docker, Kubernetes, AWS, GitHub Actions" },
  ],
  projects: [
    {
      id: "proj1",
      name: "OpenMetrics Dashboard",
      description: "Real-time analytics dashboard for monitoring distributed systems",
      url: "github.com/alex/openmetrics",
      technologies: "React, D3.js, WebSockets, Go",
    },
  ],
  certifications: [
    {
      id: "cert1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "2022-09",
      url: "",
    },
  ],
  languages: [
    { id: "lang1", language: "English", proficiency: "Native" },
    { id: "lang2", language: "Spanish", proficiency: "Conversational" },
  ],
  accentColor: "#2563eb",
  selectedTemplate: "classic",
};

export const TEMPLATES = [
  { id: "classic",   label: "Classic",   desc: "ATS-safe serif" },
  { id: "modern",    label: "Modern",    desc: "Clean sans-serif" },
  { id: "executive", label: "Executive", desc: "C-suite ready" },
  { id: "minimal",   label: "Minimal",   desc: "Ultra-clean" },
  { id: "bold",      label: "Bold",      desc: "High contrast" },
  { id: "elegant",   label: "Elegant",   desc: "Formal serif" },
  { id: "tech",      label: "Tech",      desc: "Dev-focused" },
  { id: "creative",  label: "Creative",  desc: "Two-column" },
  { id: "academic",  label: "Academic",  desc: "Research/PhD" },
  { id: "compact",   label: "Compact",   desc: "Fits more" },
] as const;

export const ACCENT_PRESETS = [
  "#2563eb", "#16a34a", "#dc2626", "#9333ea",
  "#ea580c", "#0891b2", "#be185d", "#1c1c1c",
];
