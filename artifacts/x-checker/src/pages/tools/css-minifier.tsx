import { useState, useCallback } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { Minimize2, Maximize2, Copy, Trash2, Download, ShieldCheck } from "lucide-react";

const faqs = [
  { q: "What is CSS minification?", a: "CSS minification removes unnecessary characters from CSS — comments, whitespace, newlines, and redundant semicolons — to produce the smallest possible file that has identical functionality to the original." },
  { q: "Why should I minify CSS?", a: "Smaller CSS files download faster, which directly improves page load time and Core Web Vitals scores. Minifying CSS is a standard performance optimization for production websites." },
  { q: "Will minified CSS work the same?", a: "Yes. Minification only removes characters that have no effect on how the browser interprets the stylesheet. The visual output of the page will be identical." },
  { q: "Is my CSS safe to paste here?", a: "Yes. All processing happens entirely in your browser — nothing is sent to a server." },
];

const relatedTools = [
  { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON instantly." },
  { title: "HTML Formatter", href: "/tools/html-formatter", description: "Beautify and format HTML code." },
  { title: "URL Slug Generator", href: "/tools/url-slug-generator", description: "Convert titles into SEO-friendly URL slugs." },
];

const EXAMPLE_CSS = `/* Main navigation styles */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #1a1a2e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav__logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #6366f1;
  text-decoration: none;
}

.nav__links {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.nav__links a:hover {
  color: #ffffff;
}`;

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/;\}/g, "}")
    .replace(/^\s+|\s+$/g, "")
    .trim();
}

function formatCSS(css: string): string {
  let result = minifyCSS(css);
  result = result
    .replace(/\{/g, " {\n  ")
    .replace(/;(?!\})/g, ";\n  ")
    .replace(/\}/g, "\n}\n\n")
    .replace(/,\s*(?=[^}]*\{)/g, ",\n")
    .replace(/  \}/g, "}")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return result;
}

type Mode = "minify" | "format";

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode | null>(null);
  const { toast } = useToast();
  useToolView("css-minifier");

  const run = useCallback((m: Mode) => {
    if (!input.trim()) return;
    setMode(m);
    setOutput(m === "minify" ? minifyCSS(input) : formatCSS(input));
  }, [input]);

  const savings = input && output && mode === "minify"
    ? Math.round((1 - output.length / input.length) * 100)
    : null;

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "CSS copied to clipboard." });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "minify" ? "styles.min.css" : "styles.css";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!" });
  };

  const handleClear = () => { setInput(""); setOutput(""); setMode(null); };
  const loadExample = () => { setInput(EXAMPLE_CSS); setOutput(""); setMode(null); };

  return (
    <MiniToolLayout
      seoTitle="CSS Minifier & Formatter Online Free"
      seoDescription="Minify and format CSS online for free. Remove comments, whitespace, and redundant characters instantly. 100% client-side — your code never leaves your browser."
      icon={Minimize2}
      badge="Developer Tool"
      title="CSS Minifier & Formatter"
      description="Minify CSS to reduce file size or format it for readability. Removes comments, whitespace, and redundant characters. All processing happens in your browser."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="all"
    >
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Input CSS</span>
              <button onClick={loadExample} className="text-[11px] text-primary/70 hover:text-primary underline underline-offset-2 transition-colors">Load example</button>
            </div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(""); setMode(null); }}
              placeholder={"Paste your CSS here...\n\n.selector {\n  property: value;\n}"}
              spellCheck={false}
              className="w-full min-h-[320px] md:min-h-[400px] resize-y rounded-xl border border-border/60 bg-background/60 px-4 py-3.5 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/35"
            />
            {input && <span className="text-[10px] text-muted-foreground/60">{input.length.toLocaleString()} chars</span>}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                Output {mode ? `(${mode === "minify" ? "minified" : "formatted"})` : ""}
              </span>
              {savings !== null && savings > 0 && (
                <span className="text-[10px] font-medium text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                  {savings}% smaller
                </span>
              )}
            </div>
            <div className={`relative w-full min-h-[320px] md:min-h-[400px] rounded-xl border bg-muted/20 overflow-auto transition-all ${output ? "border-border/60" : "border-border/40 border-dashed"}`}>
              {output ? (
                <pre className="px-4 py-3.5 font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap break-all">{output}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-6">
                  <Minimize2 className="h-8 w-8 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground/50">Output appears here</p>
                  <p className="text-xs text-muted-foreground/35">Paste CSS and click Minify or Format</p>
                </div>
              )}
            </div>
            {output && <span className="text-[10px] text-muted-foreground/60">{output.length.toLocaleString()} chars</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => run("minify")} disabled={!input.trim()} className="text-xs shadow-sm shadow-primary/20 gap-1.5">
            <Minimize2 className="h-3.5 w-3.5" /> Minify CSS
          </Button>
          <Button variant="outline" onClick={() => run("format")} disabled={!input.trim()} className="text-xs border-border/60 gap-1.5">
            <Maximize2 className="h-3.5 w-3.5" /> Format CSS
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output} className="text-xs border-border/60 gap-1.5">
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output} className="text-xs border-border/60 gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output} className="text-xs gap-1.5 text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[{ icon: ShieldCheck, label: "100% client-side" }, { icon: Minimize2, label: "Removes comments" }, { icon: Download, label: "Download .css" }].map(({ icon: Ic, label }) => (
            <div key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3 py-1">
              <Ic className="h-3 w-3" />{label}
            </div>
          ))}
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This CSS minifier removes all unnecessary whitespace, comments, and redundant code from your stylesheets — reducing file size to improve page load speed. The beautifier does the reverse, adding proper indentation so you can read and edit minified CSS.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Everything runs in your browser — your CSS is never sent to a server.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Minifying production stylesheets before deployment</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Beautifying minified CSS from a third-party library</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Reducing page weight for better Core Web Vitals scores</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Paste your CSS code into the input field — any valid CSS including selectors, media queries, and keyframes.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Click <strong className="text-foreground/80">Minify CSS</strong> to remove all whitespace, comments, and redundant characters.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Get your compressed CSS code instantly — see the percentage of space saved in the output panel.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> Copy the minified output or download it as a <code className="text-xs font-mono bg-muted/60 rounded px-1">.min.css</code> file.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Replace your original CSS file with the minified version in production to improve load speed.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Optimizing CSS before deploying to production</strong> — a standard step in any performance-conscious workflow.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Reducing page load time</strong> for better Google Core Web Vitals scores and improved user experience.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Compressing large CSS frameworks</strong> like Bootstrap, Tailwind, or custom design systems.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Improving Google PageSpeed Insights scores</strong> by eliminating render-blocking CSS weight.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Reducing bandwidth usage</strong> on high-traffic sites — 50KB saved per page × 100,000 visitors = 5GB bandwidth daily.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Unminifying third-party CSS</strong> to understand or debug stylesheets received from other developers.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Web developers, frontend engineers, and site owners use CSS minification as a standard part of their deployment process. Performance-focused developers minify all CSS, JavaScript, and HTML before pushing to production to ensure the fastest possible load times for users. Freelancers use it for quick one-off optimizations before handing off projects. SEO professionals use CSS minification as part of technical SEO audits to improve page speed scores.
          </p>
        </div>

        {/* Understanding CSS minification */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Understanding CSS minification</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When you write CSS, you naturally include spaces, line breaks, and comments to make your code readable. Browsers don't need any of this — they only care about the actual property and value declarations. CSS minification strips everything the browser ignores, leaving only the essential code. The visual result of minified CSS is 100% identical to the original — your website looks exactly the same.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The compression ratio depends on how your CSS is written. Hand-written CSS with lots of comments and whitespace typically compresses 50–70%. Pre-processed CSS from tools like Sass or Less compresses 20–40%. Even small reductions matter significantly for high-traffic sites — saving 50KB per page load across 100,000 daily visitors saves 5GB of bandwidth every day. This directly impacts hosting costs and user experience on slower connections.
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "What does CSS minification do exactly?", a: "CSS minification removes all unnecessary characters from CSS code — spaces, line breaks, comments, and redundant semicolons — without changing the visual output. This reduces file size typically by 20–50%, resulting in faster page loads." },
              { q: "Is minified CSS safe to use in production?", a: "Yes, completely safe. Minification only removes characters that browsers ignore anyway. The visual result is 100% identical to the original CSS. Always keep your original unminified CSS for development so you can make future edits easily." },
              { q: "How much does CSS minification reduce file size?", a: "Typically 20–50% for hand-written CSS and 10–30% for already-optimized or pre-processed CSS. The more comments and whitespace in your original CSS, the bigger the reduction. Bootstrap's CSS, for example, compresses from ~200KB to ~160KB." },
              { q: "Should I minify CSS manually or use a build tool?", a: "For small projects or one-off optimizations, manual minification using our tool works perfectly. For larger projects with automated deployments, build tools like Webpack, Vite, or Parcel can automate CSS minification as part of your build process so you never have to think about it." },
              { q: "Can I beautify minified CSS to make it readable again?", a: "Yes — our CSS minifier also works as a CSS beautifier/formatter. Paste any minified CSS and click Format to get properly indented, readable CSS back. This is useful when you receive minified stylesheets and need to understand or debug them." },
              { q: "Does CSS minification work with CSS preprocessors like Sass or Less?", a: "Yes, but the workflow is slightly different. You first compile your Sass or Less to standard CSS, then minify the resulting output. Most build tools (Vite, Webpack) handle both steps automatically in sequence. You can also minify pre-compiled CSS using our tool — paste the compiled CSS and click Minify." },
            ].map(({ q, a }) => (
              <div key={q} className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground/80">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">CSS Minification vs CSS Compression — Key Difference</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">CSS minification and CSS compression are two distinct optimizations that work at different levels. Minification removes unnecessary characters from the source code itself — spaces, line breaks, comments, and redundant semicolons — reducing the file before it leaves your server. Compression (gzip or Brotli) is applied at the HTTP transport layer: the web server compresses the file on the fly before sending it to the browser, which decompresses it upon receipt. Both reduce the bytes transferred over the network, but they are complementary rather than redundant. A minified CSS file compresses more efficiently than an unminified one because its reduced character variety and shorter structure respond better to the patterns that compression algorithms exploit. For maximum performance, use both: minify your CSS during the build process, then serve it with gzip or Brotli enabled on your web server or CDN.</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">CSS Minification in Build Pipelines</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">In modern frontend development, CSS minification is typically automated as part of a build pipeline rather than done manually. Build tools like Vite, Webpack, Parcel, and Rollup integrate CSS minifiers — usually esbuild, cssnano, or Lightning CSS — that automatically minify all stylesheets when you run a production build. Developers write clean, readable CSS with comments and whitespace during development, and the build tool handles optimization before deployment. For teams, this ensures consistency across every release and removes the need to remember a manual step.</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">CSS vs JavaScript vs HTML Minification</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">All three types of minification reduce file sizes by removing unnecessary characters, but they operate at different layers with different performance impact. JavaScript minification typically delivers the largest gains — 50–80% file size reduction — because JS files tend to be large, contain verbose variable names that can be shortened, and are often render-blocking resources. CSS minification typically delivers 20–50% reduction. HTML minification generally yields the smallest gains (5–20%) since HTML files are smaller and modern servers already compress HTML with gzip or Brotli in transit. For maximum performance, all three should be minified in production.</p>
        </div>
      </div>
    </MiniToolLayout>
  );
}
