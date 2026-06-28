import { useState, useCallback } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { AdSlot } from "@/components/AdSlot";
import { Copy, Trash2, Code2, Minimize2, Maximize2 } from "lucide-react";

// ─── Formatter ──────────────────────────────────────────────────────────────

function formatJS(code: string): string {
  // Normalize line endings
  let src = code.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Extract string literals and replace with placeholders to avoid mangling them
  const strings: string[] = [];
  src = src.replace(/(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/g, (match) => {
    strings.push(match);
    return `\x00STR${strings.length - 1}\x00`;
  });

  // Collapse multiple blank lines to at most 1
  src = src.replace(/\n{3,}/g, "\n\n");

  const lines = src.split("\n");
  const result: string[] = [];
  let indent = 0;
  const INDENT_UNIT = "  ";

  for (let raw of lines) {
    let line = raw.trim();
    if (!line) {
      if (result.length > 0 && result[result.length - 1] !== "") {
        result.push("");
      }
      continue;
    }

    // Decrease indent for closing braces/brackets at start of line
    const closingMatch = line.match(/^[}\]]/);
    if (closingMatch) indent = Math.max(0, indent - 1);

    result.push(INDENT_UNIT.repeat(indent) + line);

    // Increase indent if line ends with opening brace/bracket
    if (/[{[]$/.test(line.replace(/\/\/.*$/, "").trimEnd())) {
      indent += 1;
    }
    // Decrease indent if line ends with closing brace (single-line blocks like `} else {`)
    const openCount = (line.match(/[{[]/g) || []).length;
    const closeCount = (line.match(/[}\]]/g) || []).length;
    if (closeCount > openCount && !closingMatch) {
      indent = Math.max(0, indent - (closeCount - openCount));
    }
  }

  let formatted = result.join("\n").trim();

  // Restore string literals
  formatted = formatted.replace(/\x00STR(\d+)\x00/g, (_, i) => strings[Number(i)]);

  return formatted;
}

// ─── Minifier ───────────────────────────────────────────────────────────────

function minifyJS(code: string): string {
  // Extract strings first to protect them
  const strings: string[] = [];
  let src = code.replace(/(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/g, (match) => {
    strings.push(match);
    return `\x00STR${strings.length - 1}\x00`;
  });

  // Remove single-line comments
  src = src.replace(/\/\/[^\n]*/g, "");

  // Remove multi-line comments
  src = src.replace(/\/\*[\s\S]*?\*\//g, "");

  // Collapse whitespace
  src = src.replace(/\s+/g, " ");

  // Remove spaces around operators
  src = src.replace(/\s*([=+\-*/%,;{}[\]()|&^!<>?:])\s*/g, "$1");

  // Remove trailing semicolons before closing braces
  src = src.replace(/;}/g, "}");

  // Restore strings
  src = src.replace(/\x00STR(\d+)\x00/g, (_, i) => strings[Number(i)]);

  return src.trim();
}

const faqs = [
  { q: "Why should I format my JavaScript code?", a: "Formatted code is easier to read, debug, and maintain. Consistent indentation and spacing help you quickly identify the logical structure — where blocks start and end, how conditions are nested, and where functions are defined. When working in a team, consistently formatted code reduces cognitive overhead and merge conflicts." },
  { q: "Is minifying JavaScript the same as compressing it?", a: "Minification and compression are related but different techniques. Minification removes unnecessary characters from the source code itself (whitespace, comments). Compression (like gzip or Brotli) is applied by the server when transmitting the file to the browser. For optimal performance, you should both minify your JS files and serve them with server-side compression enabled." },
  { q: "Will this formatter handle all valid JavaScript?", a: "This is a lightweight, browser-based formatter that handles common indentation patterns well. It is not a full AST-based formatter like Prettier. For complex code with unusual formatting, advanced arrow functions, or template literals spanning multiple lines, a dedicated tool like Prettier will produce more consistent results." },
  { q: "Does minification break my code?", a: "A correct minifier preserves all functionality — it only removes characters that do not affect execution. However, poorly written minifiers can sometimes break code that relies on automatic semicolon insertion (ASI) or that uses certain patterns around line breaks. Always test minified output in your target environment." },
  { q: "What is the difference between a formatter and a linter?", a: "A formatter (like this tool or Prettier) only changes the visual appearance of code — whitespace, indentation, line breaks — without modifying logic. A linter (like ESLint) analyzes code for potential bugs, unused variables, style violations, and other issues, and can also apply fixes. Both are useful and complementary." },
];

const relatedTools = [
  { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON data." },
  { title: "HTML Formatter", href: "/tools/html-formatter", description: "Beautify and minify HTML code." },
  { title: "CSS Minifier", href: "/tools/css-minifier", description: "Minify and compress CSS files." },
];

export default function JsFormatter() {
  useToolView("js-formatter");
  const { toast } = useToast();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copiedOutput, setCopiedOutput] = useState(false);

  const inputStats = { chars: input.length, lines: input ? input.split("\n").length : 0 };
  const outputStats = { chars: output.length, lines: output ? output.split("\n").length : 0 };

  const handleFormat = useCallback(() => {
    if (!input.trim()) return;
    try {
      setOutput(formatJS(input));
    } catch {
      toast({ title: "Error", description: "Could not format the code.", variant: "destructive" });
    }
  }, [input, toast]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    try {
      setOutput(minifyJS(input));
    } catch {
      toast({ title: "Error", description: "Could not minify the code.", variant: "destructive" });
    }
  }, [input, toast]);

  const handleCopyOutput = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    toast({ title: "Copied!", description: "Output copied to clipboard." });
    setTimeout(() => setCopiedOutput(false), 2000);
  }, [output, toast]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
  }, []);

  return (
    <MiniToolLayout
      seoTitle="JavaScript Formatter & Minifier — Free JS Beautifier Online | X Toolkit"
      seoDescription="Format and beautify messy JavaScript code or minify it to reduce file size. Paste JS code, click Format or Minify, copy the output. Free online JS formatter."
      seoKeywords="javascript formatter, js beautifier, javascript minifier, js formatter online, beautify javascript, minify js, format javascript code, js code formatter"
      icon={Code2}
      title="JavaScript Formatter & Minifier"
      description="Format and beautify messy JavaScript code for readability, or minify it to reduce file size. Paste your code and get clean output instantly."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />

      <div className="space-y-6">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="pt-5 pb-5 space-y-4">
            {/* Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">JavaScript Input</Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {inputStats.chars} chars · {inputStats.lines} lines
                </span>
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JavaScript here..."
                rows={10}
                className="font-mono text-sm resize-y bg-muted/20"
                spellCheck={false}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleFormat} className="flex-1 shadow-sm shadow-primary/20">
                <Maximize2 className="h-4 w-4 mr-2" /> Format / Beautify
              </Button>
              <Button onClick={handleMinify} variant="outline" className="flex-1 border-border/60">
                <Minimize2 className="h-4 w-4 mr-2" /> Minify
              </Button>
              <Button onClick={handleClear} variant="outline" size="icon" className="border-border/60 shrink-0" title="Clear">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        {output && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Output</Label>
              <span className="text-xs text-muted-foreground font-mono">
                {outputStats.chars} chars · {outputStats.lines} lines
              </span>
            </div>
            <Textarea
              readOnly
              value={output}
              rows={12}
              className="font-mono text-sm resize-y bg-muted/30"
              spellCheck={false}
            />
            <Button onClick={handleCopyOutput} className="w-full shadow-sm shadow-primary/20">
              <Copy className="h-4 w-4 mr-2" />
              {copiedOutput ? "Copied!" : "Copy Output"}
            </Button>
          </div>
        )}
      </div>

      {/* Extended content */}
      <div className="space-y-6 pt-4">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Why Format JavaScript Code?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Unformatted JavaScript — whether generated by a build tool, minified for production, or written in a hurry — is extremely difficult to read and debug. When code has inconsistent indentation, long lines with no breaks, and no visual separation between logical sections, even experienced developers spend extra mental energy just parsing the structure before they can understand the logic.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Properly formatted code makes the block structure immediately obvious. You can see at a glance where functions begin and end, how conditions are nested, and where loops and callbacks are placed. This directly reduces the time spent debugging and reviewing code, which translates to real productivity gains for teams.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Formatting also helps when working with third-party code. When you pull in a library, inspect a minified bundle, or receive code from a colleague with different editor settings, running it through a formatter first normalizes everything to a consistent style before you start reading or modifying it.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">What Does a JS Minifier Do?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A JavaScript minifier removes everything from the source code that is not required for the code to execute correctly. This includes whitespace (spaces, tabs, newlines), comments (both single-line and block comments), and sometimes optional characters like semicolons that JavaScript's automatic semicolon insertion (ASI) would handle anyway.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Advanced minifiers also perform additional optimizations: shortening variable names to single letters, inlining constants, dead code elimination, and tree-shaking (removing exported functions that are never imported). Tools like Terser, UglifyJS, and esbuild's minifier perform these aggressive optimizations at build time.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The result of minification can be dramatic. A JavaScript file that is 200KB unminified might drop to 70KB minified, and to 20KB after gzip compression. For websites with large JavaScript bundles, this directly improves load time and core web vitals scores, especially for users on slower connections.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">JavaScript Formatting Best Practices</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Use 2 or 4 spaces for indentation:</strong> Most modern JavaScript style guides (Airbnb, Google, Standard) use 2 spaces. TypeScript projects often also use 2 spaces. Pick one and stick to it across your entire project.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Use semicolons consistently:</strong> While JavaScript supports ASI, relying on it can lead to subtle bugs in edge cases. Most style guides recommend always using semicolons. If you prefer no semicolons (Standard style), be consistent.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">One statement per line:</strong> Avoid chaining multiple statements on a single line. It may save vertical space but makes code much harder to read and step through in a debugger.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Limit line length:</strong> Keep lines under 80–100 characters. Longer lines require horizontal scrolling and make code harder to review in side-by-side diff views.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">When to Minify vs Beautify</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The general rule is: minify for production, beautify for development. In a production build pipeline, your JavaScript bundler (Webpack, Vite, esbuild, Rollup) should automatically minify all output files. Users never see the source code — they receive the smallest possible file over the network for the fastest load time.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            During development, you want the opposite. Human-readable, well-formatted code with source maps is what makes debugging efficient. Modern build tools generate source maps automatically in development mode, so even if something is partially transformed, the browser's DevTools show the original source.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Beautification is most useful when you need to inspect code you did not write: debugging a production issue from a minified bundle, reading a third-party library, or reverse-engineering a legacy codebase without access to the original source.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">JavaScript Code Style Standards</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Several widely adopted JavaScript style guides define specific formatting rules that teams can adopt as standards. The Airbnb JavaScript Style Guide is one of the most popular, covering everything from variable declarations to arrow function syntax. Google's JavaScript Style Guide is another well-known reference used in open source projects.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In modern projects, style is typically enforced automatically using Prettier (formatting) and ESLint (linting). Prettier in particular has become the de facto standard for automatic formatting in the JavaScript ecosystem because it is "opinionated" — it makes most formatting decisions for you with minimal configuration, eliminating endless style debates in code reviews.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For TypeScript projects, the same tools apply. TypeScript-specific rules (type annotations, interface formatting, generics) are handled by the @typescript-eslint plugin, while Prettier handles the rest. Setting up Prettier with a pre-commit hook (via lint-staged) ensures all committed code is consistently formatted regardless of editor settings.
          </p>
        </div>
      </div>

      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}
