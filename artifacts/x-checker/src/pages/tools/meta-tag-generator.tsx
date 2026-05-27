import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Copy, Monitor, Smartphone, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 160;

type CardType = "summary" | "summary_large_image";

function charStatus(len: number, warn: number, max: number) {
  if (len === 0) return "empty";
  if (len > max) return "over";
  if (len > warn) return "warn";
  return "ok";
}

function StatusIcon({ status }: { status: string }) {
  if (status === "ok") return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
  if (status === "warn") return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />;
  if (status === "over") return <XCircle className="h-3.5 w-3.5 text-destructive" />;
  return null;
}

function CharBar({ len, warn, max, label }: { len: number; warn: number; max: number; label: string }) {
  const status = charStatus(len, warn, max);
  const pct = Math.min(100, (len / max) * 100);
  const barColor = status === "over" ? "bg-destructive" : status === "warn" ? "bg-yellow-500" : "bg-green-500";
  const textColor = status === "over" ? "text-destructive" : status === "warn" ? "text-yellow-500" : "text-green-500";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <StatusIcon status={status} /> {label}
        </span>
        <span className={`font-mono font-semibold ${textColor}`}>{len} / {max}</span>
      </div>
      <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const faqs = [
  { q: "What is the ideal meta title length?", a: "Google typically displays the first 50–60 characters of a page title. Titles under 60 characters are shown in full; longer titles get truncated with an ellipsis. Aim for 50–60 characters for best results." },
  { q: "How long should a meta description be?", a: "Google shows around 155–160 characters of a meta description in desktop results. On mobile, it's slightly shorter. Keep descriptions between 140–160 characters, include your target keyword naturally, and add a call-to-action." },
  { q: "What is Open Graph (OG) and why does it matter?", a: "Open Graph tags control how your page appears when shared on Facebook, LinkedIn, Slack, and other platforms. Without OG tags, platforms guess your title and image — often with poor results. Set og:title, og:description, and og:image for every important page." },
  { q: "What are Twitter Card meta tags?", a: "Twitter Card tags tell Twitter how to render your link preview. 'summary' shows a small thumbnail, while 'summary_large_image' shows a large banner image. Twitter falls back to OG tags if Twitter Card tags are missing." },
  { q: "What is the ideal OG image size?", a: "For 'summary_large_image' Twitter Cards and og:image, use 1200×630 pixels (1.91:1 ratio). This renders correctly on most platforms. Minimum recommended size is 600×315 pixels." },
  { q: "Should meta keywords still be used in 2024?", a: "No. Google has explicitly stated it ignores the meta keywords tag and has done so since 2009. Bing also ignores it. Focus your efforts on meta titles, descriptions, and OG tags instead." },
];

const relatedTools = [
  { title: "JSON-LD Schema Generator", href: "/tools/schema-generator", description: "Generate structured data markup for Article, FAQ, Product, and more." },
  { title: "URL Slug Generator", href: "/tools/url-slug-generator", description: "Convert titles into clean SEO-friendly URLs." },
  { title: "Keyword Density Checker", href: "/tools/keyword-density", description: "Check keyword frequency in your article text." },
  { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON with real-time error detection." },
];

export default function MetaTagGenerator() {
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDesc, setOgDesc] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [cardType, setCardType] = useState<CardType>("summary_large_image");
  const [preview, setPreview] = useState<"desktop" | "mobile">("desktop");
  const { toast } = useToast();
  useToolView("meta-tag-generator");

  const effectiveOgTitle = ogTitle || seoTitle;
  const effectiveOgDesc = ogDesc || seoDesc;

  const generatedHtml = `<!-- Primary Meta Tags -->
<title>${seoTitle}</title>
<meta name="description" content="${seoDesc}" />${canonicalUrl ? `\n<link rel="canonical" href="${canonicalUrl}" />` : ""}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${effectiveOgTitle}" />${canonicalUrl ? `\n<meta property="og:url" content="${canonicalUrl}" />` : ""}
<meta property="og:description" content="${effectiveOgDesc}" />${ogImage ? `\n<meta property="og:image" content="${ogImage}" />` : ""}

<!-- Twitter -->
<meta name="twitter:card" content="${cardType}" />
<meta name="twitter:title" content="${effectiveOgTitle}" />
<meta name="twitter:description" content="${effectiveOgDesc}" />${ogImage ? `\n<meta name="twitter:image" content="${ogImage}" />` : ""}`;

  const copyHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast({ title: "Copied!", description: "Meta tags HTML copied to clipboard." });
  };

  const titleStatus = charStatus(seoTitle.length, 50, SEO_TITLE_MAX);
  const descStatus = charStatus(seoDesc.length, 140, SEO_DESC_MAX);

  return (
    <MiniToolLayout
      seoTitle="Meta Tag Generator — SEO Title, Description & Open Graph Tags"
      seoDescription="Generate optimized meta tags for SEO, Open Graph, and Twitter Cards. Live SERP preview with character count warnings. Copy with one click."
      icon={Globe}
      badge="SEO Tool"
      title="Meta Tag Generator"
      description="Build SEO-optimized meta tags for search engines and social sharing. Preview how your page appears in Google results and on social media, then copy the HTML in one click."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="analytics"
    >
      <div className="space-y-6">
        {/* SEO Section */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-pink-400" /> SEO Tags
          </h3>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Page Title</label>
            <Input
              value={seoTitle}
              onChange={e => setSeoTitle(e.target.value)}
              placeholder="e.g. Free SEO Tools — Keyword Checker, Meta Generator | X Toolkit"
              className="text-sm bg-background/60 border-border/60 focus-visible:ring-primary/40"
            />
            <CharBar len={seoTitle.length} warn={50} max={SEO_TITLE_MAX} label="SEO Title" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Meta Description</label>
            <Textarea
              value={seoDesc}
              onChange={e => setSeoDesc(e.target.value)}
              placeholder="e.g. Free browser-based SEO tools: keyword density checker, meta tag generator, and URL slug builder. No signup required."
              className="text-sm bg-background/60 border-border/60 min-h-[80px] resize-none focus-visible:ring-primary/40"
            />
            <CharBar len={seoDesc.length} warn={140} max={SEO_DESC_MAX} label="Meta Description" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Canonical URL <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span></label>
            <Input
              value={canonicalUrl}
              onChange={e => setCanonicalUrl(e.target.value)}
              placeholder="https://example.com/your-page"
              className="text-sm bg-background/60 border-border/60 focus-visible:ring-primary/40"
            />
          </div>
        </div>

        {/* OG Section */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-400" /> Open Graph & Twitter Card
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">OG Title <span className="text-muted-foreground/50 font-normal normal-case">(defaults to page title)</span></label>
              <Input
                value={ogTitle}
                onChange={e => setOgTitle(e.target.value)}
                placeholder="Leave blank to use page title"
                className="text-sm bg-background/60 border-border/60 focus-visible:ring-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">OG Image URL</label>
              <Input
                value={ogImage}
                onChange={e => setOgImage(e.target.value)}
                placeholder="https://example.com/og-image.jpg (1200×630)"
                className="text-sm bg-background/60 border-border/60 focus-visible:ring-primary/40"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">OG Description <span className="text-muted-foreground/50 font-normal normal-case">(defaults to meta desc)</span></label>
            <Textarea
              value={ogDesc}
              onChange={e => setOgDesc(e.target.value)}
              placeholder="Leave blank to use meta description"
              className="text-sm bg-background/60 border-border/60 min-h-[60px] resize-none focus-visible:ring-primary/40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Twitter Card Type</label>
            <div className="flex gap-2">
              {(["summary", "summary_large_image"] as CardType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setCardType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    cardType === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
                  }`}
                >
                  {t === "summary" ? "summary (small)" : "summary_large_image"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SERP Preview */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">SERP Preview</h3>
            <div className="flex gap-1">
              {(["desktop", "mobile"] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setPreview(v)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    preview === v
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                  }`}
                >
                  {v === "desktop" ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className={`rounded-lg border border-border/40 bg-background p-4 ${preview === "mobile" ? "max-w-xs" : ""}`}>
            <div className="text-xs text-green-600 dark:text-green-400 mb-0.5 font-mono truncate">
              {canonicalUrl || "https://example.com/your-page"}
            </div>
            <div className="text-base text-blue-600 dark:text-blue-400 font-medium leading-snug mb-1 line-clamp-1">
              {seoTitle || <span className="text-muted-foreground/40 italic">Page title will appear here</span>}
              {seoTitle.length > SEO_TITLE_MAX && (
                <span className="text-muted-foreground/60">...</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {seoDesc || <span className="italic opacity-40">Meta description will appear here. Keep it between 140–160 characters for best results.</span>}
            </div>
          </div>
          {titleStatus === "over" && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5" /> Title is too long — Google will truncate it
            </p>
          )}
          {descStatus === "over" && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5" /> Description is too long — Google may truncate it
            </p>
          )}
        </div>

        {/* Generated HTML */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Generated HTML</label>
            <Button variant="outline" size="sm" onClick={copyHtml} className="text-xs border-border/60 h-7">
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy HTML
            </Button>
          </div>
          <pre className="rounded-xl border border-border/60 bg-background/60 p-4 text-xs font-mono overflow-x-auto leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {generatedHtml}
          </pre>
        </div>

        {/* Tips */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { color: "border-green-500/30 bg-green-500/5", icon: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />, title: "Title best practices", tips: ["50–60 characters", "Include primary keyword", "Brand name at end: '| Brand'", "Unique per page"] },
            { color: "border-blue-500/30 bg-blue-500/5", icon: <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />, title: "Description best practices", tips: ["140–160 characters", "Include target keyword", "Add a call-to-action", "Avoid duplicates"] },
            { color: "border-purple-500/30 bg-purple-500/5", icon: <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" />, title: "OG image guidelines", tips: ["1200 × 630 px recommended", "Under 8 MB file size", "JPG or PNG format", "Unique per page"] },
          ].map(({ color, icon, title, tips }) => (
            <div key={title} className={`rounded-xl border p-4 space-y-2 ${color}`}>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {icon} {title}
              </div>
              <ul className="space-y-1">
                {tips.map(t => <li key={t} className="text-xs text-muted-foreground flex items-start gap-1.5"><span className="mt-0.5 shrink-0">·</span>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This meta tag generator produces complete, copy-ready HTML meta tags for SEO and social sharing — including the standard title and description tags, Open Graph tags for Facebook and LinkedIn, and Twitter Card tags for rich previews on X.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Properly configured meta tags help search engines understand your page content and ensure your links look great when shared on social media — both are important for traffic and click-through rate.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Setting up SEO meta tags for a new website or landing page</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Creating Open Graph tags so blog posts look polished on social media</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Generating Twitter Card markup for better click-through rates on X</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Enter your page title and meta description — character counters show when you're within optimal ranges.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Optionally add Open Graph-specific title and description if you want social previews to differ from search snippets.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Enter your OG image URL (1200×630px recommended) and canonical URL for the page.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> Choose your Twitter Card type — summary for small thumbnail, summary_large_image for banner-style previews.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Copy the complete generated HTML and paste it into your page's <code className="text-xs font-mono bg-muted/60 rounded px-1">&lt;head&gt;</code> section.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">New website or landing page launch</strong> — ensure every page has complete, optimized meta tags from day one.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Blog post SEO</strong> — generate unique titles and descriptions for each post to avoid duplicate meta tag warnings.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Social media share optimization</strong> — set custom OG images and titles so links look professional when shared on LinkedIn, Slack, or Discord.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Twitter/X link previews</strong> — configure Twitter Card tags to get large image previews instead of plain text links.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">E-commerce product pages</strong> — ensure product pages have optimized titles that appear correctly in Google Shopping and social shares.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Technical SEO audits</strong> — generate the correct meta tag HTML for pages that are missing or have incorrect tags.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            SEO professionals, web developers, content marketers, and site owners use meta tag generators to ensure their pages are correctly configured for both search engines and social sharing. Getting meta tags right is one of the most fundamental on-page SEO tasks — it affects how your pages appear in Google search results and what users see when your content is shared on social media. Agencies use this tool to quickly generate meta tag templates for client sites, while individual bloggers use it to ensure each post looks its best when shared.
          </p>
        </div>

        {/* Why meta tags matter for SEO */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Why meta tags matter for SEO and social sharing</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Meta tags are HTML elements in your page's <code className="text-xs font-mono bg-muted/60 rounded px-1">&lt;head&gt;</code> that provide metadata about the page to search engines and social platforms. Google uses your title tag as the primary clickable headline in search results, and your meta description as the descriptive snippet below it. While Google sometimes rewrites these to better match a user's query, a well-written title and description significantly improve click-through rates when they do appear.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Open Graph tags serve a completely different purpose: they control how your page appears when shared on Facebook, LinkedIn, Slack, WhatsApp, iMessage, and other platforms. Without OG tags, these platforms guess your title, description, and image — often producing poor results. With OG tags, you control exactly how your link previews appear. Twitter Card tags serve the same purpose specifically for X (Twitter), which has its own tag format separate from Open Graph.
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">More frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "Does changing meta tags immediately affect my Google ranking?", a: "Meta tag changes don't directly affect ranking, but they affect click-through rate — how many users click your result in search. A better title and description that matches search intent typically increases CTR, which can indirectly improve your position over time. Changes take effect when Google re-crawls your page, which can take days to weeks." },
              { q: "How do I test my Open Graph tags after adding them?", a: "Use the Facebook Sharing Debugger (developers.facebook.com/tools/debug/) to preview and validate OG tags. LinkedIn has its own Post Inspector, and Twitter/X has its Card Validator. These tools show exactly what the preview will look like and highlight any errors. They also let you clear cached previews if you updated tags on an existing page." },
              { q: "Should I use different OG title/description from my SEO title/description?", a: "Not always, but sometimes. For social sharing, a slightly more engaging, benefit-focused title can work better than an SEO-optimized title. Our generator lets you set different values for SEO vs. OG — if you don't set OG-specific values, it uses the SEO values as fallback, which works fine in most cases." },
              { q: "What happens if I don't add a canonical tag?", a: "Without a canonical tag, Google may index multiple versions of the same page (http vs https, www vs non-www, with vs without trailing slash) as separate pages, potentially splitting your ranking signals. The canonical tag tells Google which version is the 'real' one and consolidates signals to that URL. Add it to every page using the exact URL format you want indexed." },
              { q: "What is the robots meta tag and should I add it?", a: "The robots meta tag tells search engines whether to index a page and follow its links. The default (no robots tag) means index and follow. You only need it if you want to prevent indexing (noindex) — for example, thank-you pages, duplicate content, admin pages, and staging environments. Our generator doesn't add a robots tag by default since most pages should be indexed." },
            ].map(({ q, a }) => (
              <div key={q} className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground/80">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MiniToolLayout>
  );
}
