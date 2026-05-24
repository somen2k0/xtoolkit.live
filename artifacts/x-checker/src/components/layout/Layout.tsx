import { useLocation } from "wouter";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CursorGlow } from "@/components/CursorGlow";

interface LayoutProps {
  children: React.ReactNode;
}

type PageTheme = "home" | "social" | "dev" | "seo" | "email" | "blog" | "violet";

function getTheme(path: string): PageTheme {
  if (path === "/" || path === "") return "home";
  if (
    path.startsWith("/social") ||
    path.startsWith("/tools/x-") ||
    path.startsWith("/tools/bio") ||
    path.startsWith("/tools/username") ||
    path.startsWith("/tools/at-") ||
    path.startsWith("/tools/hashtag") ||
    path.startsWith("/tools/tweet") ||
    path.startsWith("/tools/font") ||
    path.startsWith("/tools/character") ||
    path.startsWith("/tools/word") ||
    path.startsWith("/tools/case") ||
    path.startsWith("/tools/ai-") ||
    path.startsWith("/tools/funny") ||
    path.startsWith("/tools/aesthetic") ||
    path.startsWith("/tools/profile")
  ) return "social";
  if (
    path.startsWith("/developer") ||
    path.startsWith("/tools/json") ||
    path.startsWith("/tools/base64") ||
    path.startsWith("/tools/url-encoder") ||
    path.startsWith("/tools/css") ||
    path.startsWith("/tools/html") ||
    path.startsWith("/tools/jwt") ||
    path.startsWith("/tools/regex") ||
    path.startsWith("/tools/sql") ||
    path.startsWith("/tools/uuid") ||
    path.startsWith("/tools/yaml") ||
    path.startsWith("/tools/timezone") ||
    path.startsWith("/tools/password") ||
    path.startsWith("/tools/color") ||
    path.startsWith("/tools/qr") ||
    path.startsWith("/tools/image") ||
    path.startsWith("/tools/og")
  ) return "dev";
  if (
    path.startsWith("/seo") ||
    path.startsWith("/tools/meta") ||
    path.startsWith("/tools/url-slug") ||
    path.startsWith("/tools/keyword") ||
    path.startsWith("/tools/robots") ||
    path.startsWith("/tools/sitemap") ||
    path.startsWith("/tools/page-speed") ||
    path.startsWith("/tools/schema")
  ) return "seo";
  if (
    path.startsWith("/email") ||
    path.startsWith("/tools/temp-mail") ||
    path.startsWith("/tools/email") ||
    path.startsWith("/tools/subject") ||
    path.startsWith("/tools/spam") ||
    path.startsWith("/tools/newsletter") ||
    path.startsWith("/tools/masked") ||
    path.startsWith("/tools/disposable") ||
    path.startsWith("/tools/alias")
  ) return "email";
  if (path.startsWith("/blog")) return "blog";
  return "violet";
}

const THEME_ORBS: Record<PageTheme, React.ReactNode> = {
  home: (
    <>
      <div className="page-orb" style={{ width: 720, height: 720, background: "radial-gradient(circle, hsl(270 85% 65% / 0.55) 0%, transparent 70%)", top: "-15%", left: "-12%" }} />
      <div className="page-orb" style={{ width: 560, height: 560, background: "radial-gradient(circle, hsl(195 90% 62% / 0.42) 0%, transparent 70%)", top: "10%", right: "-10%" }} />
      <div className="page-orb" style={{ width: 460, height: 460, background: "radial-gradient(circle, hsl(160 80% 55% / 0.32) 0%, transparent 70%)", bottom: "5%", left: "25%" }} />
      <div className="page-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, hsl(240 90% 72% / 0.36) 0%, transparent 70%)", bottom: "20%", right: "15%" }} />
    </>
  ),
  social: (
    <>
      <div className="page-orb" style={{ width: 700, height: 700, background: "radial-gradient(circle, hsl(217 91% 60% / 0.50) 0%, transparent 70%)", top: "-12%", left: "-10%" }} />
      <div className="page-orb" style={{ width: 520, height: 520, background: "radial-gradient(circle, hsl(199 89% 62% / 0.38) 0%, transparent 70%)", top: "8%", right: "-8%" }} />
      <div className="page-orb" style={{ width: 420, height: 420, background: "radial-gradient(circle, hsl(258 82% 70% / 0.30) 0%, transparent 70%)", bottom: "10%", left: "20%" }} />
      <div className="page-orb" style={{ width: 360, height: 360, background: "radial-gradient(circle, hsl(217 80% 55% / 0.28) 0%, transparent 70%)", bottom: "25%", right: "10%" }} />
    </>
  ),
  dev: (
    <>
      <div className="page-orb" style={{ width: 680, height: 680, background: "radial-gradient(circle, hsl(25 95% 58% / 0.48) 0%, transparent 70%)", top: "-14%", left: "-10%" }} />
      <div className="page-orb" style={{ width: 520, height: 520, background: "radial-gradient(circle, hsl(38 92% 55% / 0.36) 0%, transparent 70%)", top: "5%", right: "-8%" }} />
      <div className="page-orb" style={{ width: 420, height: 420, background: "radial-gradient(circle, hsl(258 80% 68% / 0.28) 0%, transparent 70%)", bottom: "10%", left: "22%" }} />
      <div className="page-orb" style={{ width: 360, height: 360, background: "radial-gradient(circle, hsl(15 90% 60% / 0.25) 0%, transparent 70%)", bottom: "22%", right: "12%" }} />
    </>
  ),
  seo: (
    <>
      <div className="page-orb" style={{ width: 700, height: 700, background: "radial-gradient(circle, hsl(330 80% 62% / 0.48) 0%, transparent 70%)", top: "-14%", left: "-10%" }} />
      <div className="page-orb" style={{ width: 520, height: 520, background: "radial-gradient(circle, hsl(290 75% 65% / 0.36) 0%, transparent 70%)", top: "8%", right: "-8%" }} />
      <div className="page-orb" style={{ width: 420, height: 420, background: "radial-gradient(circle, hsl(350 80% 65% / 0.28) 0%, transparent 70%)", bottom: "8%", left: "20%" }} />
      <div className="page-orb" style={{ width: 360, height: 360, background: "radial-gradient(circle, hsl(258 80% 68% / 0.26) 0%, transparent 70%)", bottom: "22%", right: "12%" }} />
    </>
  ),
  email: (
    <>
      <div className="page-orb" style={{ width: 680, height: 680, background: "radial-gradient(circle, hsl(187 90% 55% / 0.46) 0%, transparent 70%)", top: "-14%", left: "-10%" }} />
      <div className="page-orb" style={{ width: 520, height: 520, background: "radial-gradient(circle, hsl(168 80% 52% / 0.34) 0%, transparent 70%)", top: "8%", right: "-8%" }} />
      <div className="page-orb" style={{ width: 420, height: 420, background: "radial-gradient(circle, hsl(199 85% 58% / 0.28) 0%, transparent 70%)", bottom: "10%", left: "20%" }} />
      <div className="page-orb" style={{ width: 360, height: 360, background: "radial-gradient(circle, hsl(258 80% 68% / 0.24) 0%, transparent 70%)", bottom: "22%", right: "12%" }} />
    </>
  ),
  blog: (
    <>
      <div className="page-orb" style={{ width: 680, height: 680, background: "radial-gradient(circle, hsl(152 75% 50% / 0.44) 0%, transparent 70%)", top: "-14%", left: "-10%" }} />
      <div className="page-orb" style={{ width: 520, height: 520, background: "radial-gradient(circle, hsl(174 72% 52% / 0.32) 0%, transparent 70%)", top: "8%", right: "-8%" }} />
      <div className="page-orb" style={{ width: 420, height: 420, background: "radial-gradient(circle, hsl(258 80% 68% / 0.24) 0%, transparent 70%)", bottom: "10%", left: "22%" }} />
      <div className="page-orb" style={{ width: 360, height: 360, background: "radial-gradient(circle, hsl(140 70% 52% / 0.22) 0%, transparent 70%)", bottom: "22%", right: "12%" }} />
    </>
  ),
  violet: (
    <>
      <div className="page-orb" style={{ width: 700, height: 700, background: "radial-gradient(circle, hsl(258 82% 68% / 0.52) 0%, transparent 70%)", top: "-14%", left: "-10%" }} />
      <div className="page-orb" style={{ width: 520, height: 520, background: "radial-gradient(circle, hsl(230 80% 68% / 0.38) 0%, transparent 70%)", top: "8%", right: "-8%" }} />
      <div className="page-orb" style={{ width: 420, height: 420, background: "radial-gradient(circle, hsl(195 85% 60% / 0.28) 0%, transparent 70%)", bottom: "10%", left: "22%" }} />
      <div className="page-orb" style={{ width: 360, height: 360, background: "radial-gradient(circle, hsl(270 75% 65% / 0.26) 0%, transparent 70%)", bottom: "22%", right: "12%" }} />
    </>
  ),
};

const THEME_AURORA: Record<PageTheme, string> = {
  home:   "radial-gradient(ellipse at 30% center, hsl(258 82% 66% / 0.35), transparent 60%), radial-gradient(ellipse at 70% center, hsl(195 90% 60% / 0.25), transparent 60%)",
  social: "radial-gradient(ellipse at 30% center, hsl(217 91% 60% / 0.32), transparent 60%), radial-gradient(ellipse at 70% center, hsl(199 89% 62% / 0.22), transparent 60%)",
  dev:    "radial-gradient(ellipse at 30% center, hsl(25 95% 58% / 0.30), transparent 60%), radial-gradient(ellipse at 70% center, hsl(258 80% 66% / 0.20), transparent 60%)",
  seo:    "radial-gradient(ellipse at 30% center, hsl(330 80% 62% / 0.30), transparent 60%), radial-gradient(ellipse at 70% center, hsl(290 75% 65% / 0.20), transparent 60%)",
  email:  "radial-gradient(ellipse at 30% center, hsl(187 90% 55% / 0.30), transparent 60%), radial-gradient(ellipse at 70% center, hsl(168 80% 52% / 0.20), transparent 60%)",
  blog:   "radial-gradient(ellipse at 30% center, hsl(152 75% 50% / 0.28), transparent 60%), radial-gradient(ellipse at 70% center, hsl(174 72% 52% / 0.20), transparent 60%)",
  violet: "radial-gradient(ellipse at 30% center, hsl(258 82% 68% / 0.35), transparent 60%), radial-gradient(ellipse at 70% center, hsl(230 80% 68% / 0.22), transparent 60%)",
};

export function Layout({ children }: LayoutProps) {
  const [path] = useLocation();
  const theme = getTheme(path);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      <CursorGlow />
      {/* Page-specific background orbs — fixed, behind everything */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        {/* Aurora layer */}
        <div
          className="page-aurora"
          style={{ background: THEME_AURORA[theme] }}
        />
        {/* Orbs */}
        {THEME_ORBS[theme]}
      </div>

      <Navbar />
      <main className="flex-1 pb-14 md:pb-0 relative" style={{ zIndex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
