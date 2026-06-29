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
  AI: "bg-accent text-accent-foreground border-accent-border",
  Soon: "bg-slate-400/15 text-slate-400 border-slate-400/30",
};

const NAV_CATEGORIES = [
  {
    key: "x-tools",
    label: "X Tools",
    icon: AtSign,
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
    href: "/email-tools",
    tools: [
      { icon: ShieldCheck, label: "Email Validator", href: "/tools/email-validator" },
      { icon: Pencil, label: "Email Signature", href: "/tools/email-signature-generator" },
      { icon: EyeOff, label: "Masked Email", href: "/tools/masked-email-generator" },
      { icon: ShieldAlert, label: "Spam Score Checker", href: "/tools/spam-score-checker" },
      { icon: Newspaper, label: "Newsletter Template", href: "/tools/newsletter-template-generator" },
      { icon: Mail, label: "Subject Line Generator", href: "/tools/subject-line-generator" },
    ],
    comingSoon: [],
  },
  {
    key: "temp-mail",
    label: "Temp Mail",
    icon: Inbox,
    href: "/tools/temp-mail",
    tools: [
      { icon: Inbox, label: "Temp Email", href: "/tools/temp-mail", badge: "Popular" },
      { icon: Mail, label: "Temp Gmail", href: "/tools/temp-mail/tempgmail" },
      { icon: Hash, label: "Gmail Tricks", href: "/tools/temp-mail/gmail-tricks" },
      { icon: ScanSearch, label: "Gmail Account Checker", href: "/tools/gmail-checker", badge: "New" },
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
        rounded-xl border border-border bg-popover
        shadow-lg shadow-black/30 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="p-2">
        <Link href={category.href} onClick={onClose}>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg mb-1 hover:bg-secondary transition-colors cursor-pointer">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              All {category.label}
            </span>
            <span className="text-xs text-muted-foreground">View all →</span>
          </div>
        </Link>
        <div className="h-px bg-border mx-1 mb-2" />
        <ul className="space-y-0.5 max-h-[360px] overflow-y-auto">
          {category.tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={tool.label}>
                <Link href={tool.href} onClick={onClose}>
                  <div className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-foreground shrink-0 transition-colors" />
                    <span className="text-xs font-medium text-foreground group-hover:text-foreground transition-colors flex-1 leading-tight">
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
            <div className="h-px bg-border mx-1 my-2" />
            <div className="px-3 py-1 flex items-center gap-1.5 mb-1">
              <Clock className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
            {category.comingSoon.map((name) => (
              <div key={name} className="flex items-center gap-2.5 px-3 py-1 opacity-50 cursor-default">
                <div className="h-1.5 w-1.5 rounded-full bg-border shrink-0" />
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
        className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 whitespace-nowrap ${
          isActive
            ? "bg-secondary text-primary"
            : "text-foreground hover:bg-secondary hover:text-primary"
        }`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {category.label}
        <ChevronDown className={`h-3 w-3 transition-transform duration-150 opacity-60 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <NavDropdown category={category} onClose={close} />}
    </div>
  );
}

const NAV_LINK_BASE = "flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 whitespace-nowrap";

export function Navbar() {
  const [location] = useLocation();
  const [showFeedback, setShowFeedback] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background shadow-sm">
        {/* Teal accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-7 w-7 rounded-lg overflow-hidden shadow-lg shadow-primary/20 shrink-0">
              <img src="/logo.png" alt="X Toolkit Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-semibold text-sm text-foreground tracking-tight">X Toolkit</span>
            <Badge variant="outline" className="hidden lg:inline-flex text-[10px] font-medium border-primary/20 text-primary bg-accent px-1.5 py-0">
              {TOTAL_LIVE} Tools
            </Badge>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-0 px-1.5 py-1 rounded-2xl bg-card border border-border">
              <Link href="/">
                <button className={`${NAV_LINK_BASE} ${
                  location === "/"
                    ? "bg-secondary text-primary"
                    : "text-foreground hover:bg-secondary hover:text-primary"
                }`}>
                  <Home className="h-3.5 w-3.5 shrink-0" />
                  Home
                </button>
              </Link>

              {NAV_CATEGORIES.map((cat) => (
                <NavItem key={cat.key} category={cat} currentPath={location} />
              ))}

              <Link href="/blog">
                <button className={`${NAV_LINK_BASE} ${
                  location.startsWith("/blog")
                    ? "bg-secondary text-primary"
                    : "text-foreground hover:bg-secondary hover:text-primary"
                }`}>
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  Blog
                </button>
              </Link>

              <Link href="/guides">
                <button className={`${NAV_LINK_BASE} ${
                  location === "/guides"
                    ? "bg-secondary text-primary"
                    : "text-foreground hover:bg-secondary hover:text-primary"
                }`}>
                  <BookMarked className="h-3.5 w-3.5 shrink-0" />
                  Guides
                </button>
              </Link>

              <Link href="/about">
                <button className={`${NAV_LINK_BASE} ${
                  location === "/about"
                    ? "bg-secondary text-primary"
                    : "text-foreground hover:bg-secondary hover:text-primary"
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
              <button className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold text-white whitespace-nowrap transition-all duration-200 bg-primary hover:bg-[#D42D06] shadow-[0_2px_8px_rgba(245,57,10,0.3)] hover:shadow-[0_4px_12px_rgba(245,57,10,0.45)] hover:-translate-y-px">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/></svg>
                Extension
              </button>
            </Link>

            <div className="hidden 2xl:flex items-center gap-1.5 pl-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-foreground/60">Operational</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeedback(true)}
              className="hidden xl:flex text-xs border-border text-foreground hover:bg-secondary hover:text-primary hover:border-border gap-1.5 h-8 px-2.5"
              title="Send Feedback"
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden 2xl:inline">Feedback</span>
            </Button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 rounded-md text-foreground hover:bg-secondary transition-colors"
              onClick={() => { setMenuOpen((v) => !v); setMobileExpanded(null); }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">

              <Link href="/" onClick={closeMenu}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
                  location === "/" ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary"
                }`}>
                  <Home className="h-4 w-4 shrink-0" />
                  Home
                </button>
              </Link>

              {NAV_CATEGORIES.map((cat) => {
                const expanded = mobileExpanded === cat.key;
                const CatIcon = cat.icon;
                return (
                  <div key={cat.key} className="rounded-lg overflow-hidden border border-border">
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors text-left bg-card"
                      onClick={() => setMobileExpanded(expanded ? null : cat.key)}
                    >
                      <CatIcon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm font-semibold flex-1 text-foreground">{cat.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 text-foreground/50 ${expanded ? "rotate-180" : ""}`} />
                    </button>
                    {expanded && (
                      <div className="bg-card px-2 py-1.5 space-y-0.5">
                        <Link href={cat.href} onClick={closeMenu}>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold text-primary hover:bg-secondary transition-colors">
                            View all {cat.label} →
                          </div>
                        </Link>
                        {cat.tools.map((tool) => {
                          const TIcon = tool.icon;
                          return (
                            <Link key={tool.href} href={tool.href} onClick={closeMenu}>
                              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors">
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
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
                  location.startsWith("/blog") ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary"
                }`}>
                  <BookOpen className="h-4 w-4 shrink-0" />
                  Blog
                </button>
              </Link>

              <Link href="/guides" onClick={closeMenu}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
                  location === "/guides" ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary"
                }`}>
                  <BookMarked className="h-4 w-4 shrink-0" />
                  Guides
                </button>
              </Link>

              <Link href="/about" onClick={closeMenu}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
                  location === "/about" ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary"
                }`}>
                  <Info className="h-4 w-4 shrink-0" />
                  About
                </button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowFeedback(true); closeMenu(); }}
                className="w-full justify-start gap-3 h-10 text-sm font-medium border-border text-foreground hover:bg-secondary hover:text-primary"
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
