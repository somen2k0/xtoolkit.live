import { useState, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeedbackModal } from "@/components/FeedbackModal";
import {
  MessageSquare, Home, Info, Menu, X, ChevronDown,
  Search, Sparkles, Link2, AtSign, Hash, MessageSquareText,
  BarChart2, FileJson, Lock, TrendingUp, Globe,
  Mail, ShieldCheck, Pencil, Shield, Tag, Clock,
  Minimize2, Code2, KeyRound, Regex, Shuffle,
  ScanSearch, EyeOff, Newspaper, ShieldAlert, Inbox,
  AlignLeft, QrCode, ImageIcon, Palette, Laugh, BookOpen, BookMarked,
  Layers, Pipette,
} from "lucide-react";
import { TOTAL_LIVE } from "@/lib/tools-registry";
import { NavSearchDialog } from "@/components/layout/NavSearchDialog";

const BADGE_STYLES: Record<string, string> = {
  Popular: "bg-amber-400/15 text-amber-400 border-amber-400/30",
  New: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
  AI: "bg-purple-400/15 text-purple-400 border-purple-400/30",
  Soon: "bg-slate-400/15 text-slate-400 border-slate-400/30",
};

const NAV_CATEGORIES = [
  {
    key: "x-tools",
    label: "X Tools",
    icon: AtSign,
    color: "text-blue-400",
    activeBg: "bg-blue-500/10",
    bg: "bg-blue-400/10",
    glowColor: "hsl(217 91% 60% / 0.28)",
    glowClass: "nav-glow-blue",
    href: "/social-media-tools",
    tools: [
      { icon: Search, label: "Account Checker", href: "/tools/x-account-checker", badge: "Popular" },
      { icon: Sparkles, label: "AI Bio Generator", href: "/tools/bio-generator", badge: "AI" },
      { icon: ScanSearch, label: "AI Text Detector", href: "/tools/ai-detector", badge: "AI" },
      { icon: Laugh, label: "Funny Bio Ideas", href: "/tools/funny-bios" },
      { icon: AtSign, label: "Username Generator", href: "/tools/username-generator" },
      { icon: Hash, label: "Hashtag Formatter", href: "/tools/hashtag-formatter" },
      { icon: MessageSquareText, label: "Tweet Thread Formatter", href: "/tools/tweet-formatter" },
      { icon: BarChart2, label: "Character Counter", href: "/tools/character-counter" },
      { icon: AlignLeft, label: "Word Counter", href: "/tools/word-counter" },
    ],
    comingSoon: [],
  },
  {
    key: "dev-tools",
    label: "Dev Tools",
    icon: Code2,
    color: "text-orange-400",
    activeBg: "bg-orange-500/10",
    bg: "bg-orange-400/10",
    glowColor: "hsl(25 95% 58% / 0.28)",
    glowClass: "nav-glow-orange",
    href: "/developer-tools",
    tools: [
      { icon: FileJson, label: "JSON Formatter", href: "/tools/json-formatter", badge: "Popular" },
      { icon: Code2, label: "JavaScript Formatter", href: "/tools/js-formatter", badge: "New" },
      { icon: KeyRound, label: "JWT Decoder", href: "/tools/jwt-decoder" },
      { icon: Regex, label: "Regex Tester", href: "/tools/regex-tester" },
      { icon: Lock, label: "Base64 Encoder", href: "/tools/base64" },
      { icon: Hash, label: "Hash Generator", href: "/tools/hash-generator", badge: "New" },
      { icon: Shuffle, label: "UUID Generator", href: "/tools/uuid-generator" },
      { icon: ShieldCheck, label: "Password Generator", href: "/tools/password-generator" },
      { icon: Palette, label: "CSS Gradient Generator", href: "/tools/css-gradient-generator", badge: "New" },
      { icon: Layers, label: "CSS Box Shadow", href: "/tools/css-box-shadow-generator", badge: "New" },
      { icon: ImageIcon, label: "Image Resizer", href: "/tools/image-resizer", badge: "New" },
      { icon: Minimize2, label: "Image Compressor", href: "/tools/image-compressor" },
      { icon: Pipette, label: "Color Picker", href: "/tools/color-picker" },
      { icon: QrCode, label: "QR Code Generator", href: "/tools/qr-code-generator" },
    ],
    comingSoon: [],
  },
  {
    key: "seo",
    label: "SEO Tools",
    icon: TrendingUp,
    color: "text-pink-400",
    activeBg: "bg-pink-500/10",
    bg: "bg-pink-400/10",
    glowColor: "hsl(330 80% 62% / 0.28)",
    glowClass: "nav-glow-pink",
    href: "/seo-tools",
    tools: [
      { icon: Globe, label: "Meta Tag Generator", href: "/tools/meta-tag-generator", badge: "Popular" },
      { icon: Code2, label: "Schema Generator", href: "/tools/schema-generator" },
      { icon: Shield, label: "Robots.txt Generator", href: "/tools/robots-txt-generator" },
      { icon: Tag, label: "Sitemap Validator", href: "/tools/sitemap-validator" },
      { icon: Link2, label: "URL Slug Generator", href: "/tools/url-slug-generator" },
      { icon: TrendingUp, label: "Keyword Density", href: "/tools/keyword-density" },
    ],
    comingSoon: [],
  },
  {
    key: "email",
    label: "Email Tools",
    icon: Mail,
    color: "text-cyan-400",
    activeBg: "bg-cyan-500/10",
    bg: "bg-cyan-400/10",
    glowColor: "hsl(187 90% 55% / 0.28)",
    glowClass: "nav-glow-cyan",
    href: "/email-tools",
    tools: [
      { icon: Inbox, label: "Temp Mail", href: "/tools/temp-mail", badge: "Popular" },
      { icon: ShieldCheck, label: "Email Validator", href: "/tools/email-validator" },
      { icon: Pencil, label: "Email Signature", href: "/tools/email-signature-generator" },
      { icon: EyeOff, label: "Masked Email", href: "/tools/masked-email-generator" },
      { icon: ShieldAlert, label: "Spam Score Checker", href: "/tools/spam-score-checker" },
      { icon: Newspaper, label: "Newsletter Template", href: "/tools/newsletter-template-generator" },
      { icon: Mail, label: "Subject Line Generator", href: "/tools/subject-line-generator" },
    ],
    comingSoon: [],
  },
];

function NavDropdown({
  category,
  onClose,
}: {
  category: typeof NAV_CATEGORIES[number];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 z-50
        rounded-xl border border-border/60 bg-background/98 backdrop-blur-xl
        shadow-2xl shadow-black/20 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="p-2">
        <Link href={category.href} onClick={onClose}>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg mb-1 hover:bg-muted/60 transition-colors cursor-pointer">
            <span className={`text-xs font-bold uppercase tracking-wider ${category.color}`}>
              All {category.label}
            </span>
            <span className="text-xs text-muted-foreground">View all →</span>
          </div>
        </Link>
        <div className="h-px bg-border/40 mx-1 mb-2" />
        <ul className="space-y-0.5 max-h-[360px] overflow-y-auto">
          {category.tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={tool.label}>
                <Link href={tool.href} onClick={onClose}>
                  <div className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                    <span className="text-xs font-medium group-hover:text-primary transition-colors flex-1 leading-tight">
                      {tool.label}
                    </span>
                    {tool.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${BADGE_STYLES[tool.badge] ?? ""}`}>
                        {tool.badge}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {category.comingSoon && category.comingSoon.length > 0 && (
          <>
            <div className="h-px bg-border/40 mx-1 my-2" />
            <div className="px-3 py-1 flex items-center gap-1.5 mb-1">
              <Clock className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
            {category.comingSoon.map((name) => (
              <div key={name} className="flex items-center gap-2.5 px-3 py-1 opacity-50 cursor-default">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                <span className="text-xs text-muted-foreground">{name}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function NavItem({ category, currentPath }: { category: typeof NAV_CATEGORIES[number]; currentPath: string }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = useCallback(() => { if (timer.current) clearTimeout(timer.current); setOpen(true); }, []);
  const leave = useCallback(() => { timer.current = setTimeout(() => setOpen(false), 150); }, []);
  const close = useCallback(() => setOpen(false), []);

  const isActive = (category.tools ?? []).some((item: { href: string }) => currentPath === item.href) || open;
  const Icon = category.icon;

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 whitespace-nowrap ${category.glowClass} ${
          isActive
            ? `${category.activeBg} ${category.color} nav-active-pulse`
            : `${category.color} hover:${category.bg}`
        }`}
        style={isActive ? ({ "--nav-glow-color": category.glowColor } as React.CSSProperties) : undefined}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {category.label}
        <ChevronDown className={`h-3 w-3 transition-transform duration-150 opacity-60 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <NavDropdown category={category} onClose={close} />}
    </div>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [showFeedback, setShowFeedback] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-violet-500/20 bg-background/90 backdrop-blur-xl shadow-lg shadow-black/20 dark:shadow-violet-950/30">
        {/* Gradient accent line at the bottom — vivid */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/80 to-transparent pointer-events-none" />
        {/* Subtle top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-7 w-7 rounded-lg overflow-hidden shadow-lg shadow-violet-600/30 shrink-0">
              <svg width="28" height="28" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="nBg" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#09071a"/>
                    <stop offset="100%" stopColor="#110d24"/>
                  </linearGradient>
                  <linearGradient id="nFront" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#c4b5fd"/>
                    <stop offset="45%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#4c1d95"/>
                  </linearGradient>
                  <radialGradient id="nGlow" cx="90" cy="90" r="70" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22"/>
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <rect width="180" height="180" rx="36" fill="url(#nBg)"/>
                <rect width="180" height="180" rx="36" fill="url(#nGlow)"/>
                <g stroke="#120a2e" strokeLinecap="round" fill="none" transform="translate(6,6)">
                  <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
                </g>
                <g stroke="#120a2e" strokeLinecap="square" strokeLinejoin="miter" fill="none" transform="translate(6,6)">
                  <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
                </g>
                <g stroke="#1d1050" strokeLinecap="round" fill="none" transform="translate(4,4)">
                  <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
                </g>
                <g stroke="#1d1050" strokeLinecap="square" strokeLinejoin="miter" fill="none" transform="translate(4,4)">
                  <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
                </g>
                <g stroke="#2e1878" strokeLinecap="round" fill="none" transform="translate(2,2)">
                  <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
                </g>
                <g stroke="#2e1878" strokeLinecap="square" strokeLinejoin="miter" fill="none" transform="translate(2,2)">
                  <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
                </g>
                <g stroke="url(#nFront)" strokeLinecap="round" fill="none">
                  <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
                </g>
                <g stroke="url(#nFront)" strokeLinecap="square" strokeLinejoin="miter" fill="none">
                  <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
                </g>
                <g stroke="white" strokeLinecap="round" fill="none" opacity="0.18">
                  <line x1="58" y1="44" x2="122" y2="136" strokeWidth="5"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="5"/>
                </g>
              </svg>
            </div>
            <span className="font-semibold text-sm text-foreground tracking-tight">X Toolkit</span>
            <Badge variant="outline" className="hidden lg:inline-flex text-[10px] font-medium border-primary/30 text-primary bg-primary/8 px-1.5 py-0">
              {TOTAL_LIVE} Tools
            </Badge>
          </Link>

          {/* Desktop nav — command bar style with icon + label */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-0 px-1.5 py-1 rounded-2xl bg-muted/50 border border-violet-500/15 shadow-inner shadow-black/[0.08] dark:shadow-black/30">
              <Link href="/">
                <button className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 whitespace-nowrap nav-glow-white ${
                  location === "/"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-foreground hover:bg-background/60"
                }`}>
                  <Home className="h-3.5 w-3.5 shrink-0" />
                  Home
                </button>
              </Link>

              {NAV_CATEGORIES.map((cat) => (
                <NavItem key={cat.key} category={cat} currentPath={location} />
              ))}

              <Link href="/blog">
                <button className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 whitespace-nowrap nav-glow-white ${
                  location.startsWith("/blog")
                    ? "bg-background shadow-sm text-foreground"
                    : "text-foreground hover:bg-background/60"
                }`}>
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  Blog
                </button>
              </Link>

              <Link href="/guides">
                <button className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 whitespace-nowrap nav-glow-white ${
                  location === "/guides"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-foreground hover:bg-background/60"
                }`}>
                  <BookMarked className="h-3.5 w-3.5 shrink-0" />
                  Guides
                </button>
              </Link>

              <Link href="/about">
                <button className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 whitespace-nowrap nav-glow-white ${
                  location === "/about"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-foreground hover:bg-background/60"
                }`}>
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  About
                </button>
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 shrink-0">
            <NavSearchDialog />

            <Link href="/chrome-extension">
              <button className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold text-white whitespace-nowrap transition-all duration-200 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-[0_0_18px_rgba(139,92,246,0.55)] hover:shadow-[0_0_28px_rgba(139,92,246,0.75)] hover:-translate-y-px">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/></svg>
                Extension
              </button>
            </Link>

            <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-muted-foreground pl-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px]">Operational</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeedback(true)}
              className="hidden xl:flex text-xs border-border/60 hover:bg-muted/50 gap-1.5 h-8 px-2.5"
              title="Send Feedback"
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden 2xl:inline">Feedback</span>
            </Button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 rounded-md text-foreground hover:bg-muted/50 transition-colors nav-glow-white"
              onClick={() => { setMenuOpen((v) => !v); setMobileExpanded(null); }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/98 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">

              <Link href="/" onClick={closeMenu}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left nav-glow-white ${
                  location === "/" ? "bg-muted/60 text-foreground" : "text-foreground hover:bg-muted/50"
                }`}>
                  <Home className="h-4 w-4 shrink-0" />
                  Home
                </button>
              </Link>

              {NAV_CATEGORIES.map((cat) => {
                const expanded = mobileExpanded === cat.key;
                const CatIcon = cat.icon;
                return (
                  <div key={cat.key} className="rounded-lg overflow-hidden border border-border/30">
                    <button
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors text-left bg-muted/20 ${cat.glowClass}`}
                      onClick={() => setMobileExpanded(expanded ? null : cat.key)}
                    >
                      <CatIcon className={`h-4 w-4 shrink-0 ${cat.color}`} />
                      <span className={`text-sm font-semibold flex-1 ${cat.color}`}>{cat.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 opacity-60 ${expanded ? "rotate-180" : ""}`} />
                    </button>
                    {expanded && (
                      <div className="bg-muted/10 px-2 py-1.5 space-y-0.5">
                        <Link href={cat.href} onClick={closeMenu}>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
                            View all {cat.label} →
                          </div>
                        </Link>
                        {cat.tools.map((tool) => {
                          const TIcon = tool.icon;
                          return (
                            <Link key={tool.href} href={tool.href} onClick={closeMenu}>
                              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                                <TIcon className="h-3.5 w-3.5 shrink-0" />
                                {tool.label}
                                {tool.badge && (
                                  <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${BADGE_STYLES[tool.badge] ?? ""}`}>
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link href="/blog" onClick={closeMenu}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left nav-glow-white ${
                  location.startsWith("/blog") ? "bg-muted/60 text-foreground" : "text-foreground hover:bg-muted/50"
                }`}>
                  <BookOpen className="h-4 w-4 shrink-0" />
                  Blog
                </button>
              </Link>

              <Link href="/guides" onClick={closeMenu}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left nav-glow-white ${
                  location === "/guides" ? "bg-muted/60 text-foreground" : "text-foreground hover:bg-muted/50"
                }`}>
                  <BookMarked className="h-4 w-4 shrink-0" />
                  Guides
                </button>
              </Link>

              <Link href="/about" onClick={closeMenu}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left nav-glow-white ${
                  location === "/about" ? "bg-muted/60 text-foreground" : "text-foreground hover:bg-muted/50"
                }`}>
                  <Info className="h-4 w-4 shrink-0" />
                  About
                </button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowFeedback(true); closeMenu(); }}
                className="w-full justify-start gap-3 h-10 text-sm font-medium border-border/60"
              >
                <MessageSquare className="h-4 w-4" />
                Send Feedback
              </Button>
            </div>
          </div>
        )}
      </nav>

      <FeedbackModal open={showFeedback} onOpenChange={setShowFeedback} />
    </>
  );
}
