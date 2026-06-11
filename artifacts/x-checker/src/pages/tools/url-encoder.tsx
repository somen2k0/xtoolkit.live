import { useState, useCallback } from "react";
import { AdSlot } from "@/components/AdSlot";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { Link2, Copy, Trash2, ArrowLeftRight, ShieldCheck } from "lucide-react";

const faqs = [
  { q: "What is URL encoding?", a: "URL encoding (also called percent-encoding) converts characters that are not allowed in URLs into a safe format by replacing them with a % followed by two hexadecimal digits. For example, a space becomes %20 and & becomes %26." },
  { q: "When do I need to URL encode?", a: "You need to URL encode data when passing it as a query parameter or path segment in a URL. Characters like spaces, &, =, #, and ? have special meaning in URLs and must be encoded to be treated as data rather than URL structure." },
  { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURI encodes a full URL and preserves structural characters like /, ?, &, and =. encodeURIComponent encodes a single component (like a query value) and encodes those structural characters too. This tool uses encodeURIComponent, which is correct for encoding individual values." },
  { q: "Is this tool safe for sensitive data?", a: "Yes. All processing happens entirely in your browser. No data is sent to any server. You can safely use it with passwords, tokens, or private data." },
];

const relatedTools = [
  { title: "URL Slug Generator", href: "/tools/url-slug-generator", description: "Convert titles into clean SEO-friendly URL slugs." },
  { title: "Base64 Encoder / Decoder", href: "/tools/base64", description: "Encode and decode Base64 strings." },
  { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON instantly." },
];

type Mode = "encode" | "decode";

export default function UrlEncoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  useToolView("url-encoder");

  const process = useCallback((value: string, m: Mode) => {
    if (!value.trim()) { setOutput(""); setError(""); return; }
    try {
      if (m === "encode") {
        setOutput(encodeURIComponent(value));
        setError("");
      } else {
        setOutput(decodeURIComponent(value));
        setError("");
      }
    } catch {
      setError(m === "decode" ? "Invalid URL-encoded string. Check your input." : "Failed to encode.");
      setOutput("");
    }
  }, []);

  const handleInput = (val: string) => {
    setInput(val);
    process(val, mode);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setInput("");
    setOutput("");
    setError("");
  };

  const handleSwap = () => {
    if (!output) return;
    const newMode: Mode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    process(output, newMode);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Output copied to clipboard." });
  };

  const handleClear = () => { setInput(""); setOutput(""); setError(""); };

  const exampleEncode = () => { switchMode("encode"); const v = "https://example.com/search?q=hello world&lang=en"; setInput(v); process(v, "encode"); };
  const exampleDecode = () => { switchMode("decode"); const v = "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Den"; setInput(v); process(v, "decode"); };

  return (
    <MiniToolLayout
      seoTitle="URL Encoder & Decoder Online Free"
      seoDescription="Encode or decode URLs and query parameters online for free. Instant percent-encoding and decoding — 100% client-side, nothing sent to a server."
      icon={Link2}
      badge="Developer Tool"
      title="URL Encoder & Decoder"
      description="Encode special characters in URLs using percent-encoding, or decode percent-encoded strings back to readable text. All processing happens in your browser."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="all"
    >
      <AdSlot slot="top" className="mb-6" />
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-1 bg-muted/40 border border-border/60 rounded-xl w-fit">
          {(["encode", "decode"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize ${mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-muted-foreground/60 shrink-0">Examples:</span>
          <button onClick={exampleEncode} className="text-[11px] text-primary/70 hover:text-primary underline underline-offset-2 transition-colors">Encode URL</button>
          <span className="text-muted-foreground/30 text-xs">·</span>
          <button onClick={exampleDecode} className="text-[11px] text-primary/70 hover:text-primary underline underline-offset-2 transition-colors">Decode URL</button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              {mode === "encode" ? "Plain Text / URL" : "Encoded URL"}
            </span>
            <textarea
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              placeholder={mode === "encode" ? "Paste text or URL to encode...\n\nhttps://example.com/search?q=hello world" : "Paste encoded URL to decode...\n\nhttps%3A%2F%2Fexample.com"}
              spellCheck={false}
              className="w-full min-h-[260px] md:min-h-[320px] resize-y rounded-xl border border-border/60 bg-background/60 px-4 py-3.5 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/35"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              {mode === "encode" ? "Encoded Output" : "Decoded Output"}
            </span>
            <div className={`relative w-full min-h-[260px] md:min-h-[320px] rounded-xl border bg-muted/20 overflow-auto transition-all ${error ? "border-destructive/40" : output ? "border-border/60" : "border-border/40 border-dashed"}`}>
              {error ? (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : output ? (
                <pre className="px-4 py-3.5 font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap break-all">{output}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-6">
                  <Link2 className="h-8 w-8 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground/50">Output appears here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSwap} disabled={!output} className="text-xs border-border/60 gap-1.5">
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Swap &amp; {mode === "encode" ? "Decode" : "Encode"}
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output} className="text-xs border-border/60 gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output} className="text-xs gap-1.5 text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[{ icon: ShieldCheck, label: "100% client-side" }, { icon: ArrowLeftRight, label: "Real-time encoding" }, { icon: Link2, label: "encodeURIComponent" }].map(({ icon: Ic, label }) => (
            <div key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3 py-1">
              <Ic className="h-3 w-3" />{label}
            </div>
          ))}
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This URL encoder converts special characters like spaces, ampersands, and slashes into percent-encoded equivalents (e.g., space → %20) so they can be safely included in URLs. The decoder does the reverse — converting %XX sequences back to their original characters.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This tool uses JavaScript's built-in <code className="text-xs font-mono bg-muted/60 rounded px-1.5 py-0.5">encodeURIComponent</code> and <code className="text-xs font-mono bg-muted/60 rounded px-1.5 py-0.5">decodeURIComponent</code> functions — no server needed.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Encoding query string parameters before appending to URLs</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Decoding percent-encoded URLs from server logs or redirects</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Preparing data for API calls that require URL-encoded form bodies</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Paste your URL or text into the input field — works with full URLs, query parameters, or any plain text.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Select <strong className="text-foreground/80">Encode</strong> mode to convert special characters to percent-encoded format (spaces → %20, &amp; → %26, etc.).</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Select <strong className="text-foreground/80">Decode</strong> mode to convert percent-encoded text back to readable format.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> The output updates in real time — no button click needed.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Use "Swap" to instantly reverse the operation and decode what you just encoded.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Encoding query parameters</strong> for REST API requests that contain spaces, special characters, or non-ASCII text.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Decoding URLs</strong> received from web services, server logs, or analytics platforms to make them human-readable.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Fixing broken URLs</strong> in emails or documents that contain unencoded spaces or ampersands.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Building URL strings programmatically</strong> and verifying the encoding looks correct before using in production.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Debugging URL-related issues</strong> in web apps where parameters aren't being passed correctly.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Encoding form data</strong> for HTTP POST requests with <code className="text-xs font-mono bg-muted/60 rounded px-1">application/x-www-form-urlencoded</code> content type.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Web developers, API developers, backend engineers, and QA testers use URL encoding tools constantly. Anyone working with HTTP requests, REST APIs, or web applications regularly encounters the need to encode and decode URLs. Frontend developers use it when building fetch requests with dynamic parameters. Backend developers use it to verify that incoming request parameters are correctly encoded. DevOps engineers use it to debug URL-related issues in nginx logs and redirects.
          </p>
        </div>

        {/* Understanding URL encoding */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Understanding URL encoding</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            URLs can only safely contain certain characters from the ASCII character set. When URLs need to include characters outside this safe set — like spaces, ampersands, equals signs, or non-English characters — those characters must be percent-encoded. Percent encoding replaces unsafe characters with a % sign followed by the character's two-digit hexadecimal ASCII code. For example, a space becomes %20 and &amp; becomes %26.
          </p>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Common encoding examples</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[["space", "%20"], ["&", "%26"], ["=", "%3D"], ["+", "%2B"], ["/", "%2F"], ["?", "%3F"], ["#", "%23"], ["@", "%40"]].map(([char, enc]) => (
                <div key={char} className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-foreground/80">{char}</span>
                  <span className="text-muted-foreground/50">→</span>
                  <span className="text-primary/80">{enc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "What is URL encoding?", a: "URL encoding (also called percent encoding) converts characters that are not allowed in URLs into a safe format for transmission. Spaces become %20, ampersands become %26, and so on. It ensures URLs are valid and parseable by browsers and servers." },
              { q: "When do I need to URL encode a string?", a: "Whenever passing special characters in query parameters, form data, or API requests. Characters like spaces, &, =, and non-ASCII characters have special meaning in URLs and must be encoded to be treated as data rather than URL structure." },
              { q: "What is the difference between URL encoding and Base64 encoding?", a: "URL encoding converts characters to percent-escaped sequences specifically for use in URLs. Base64 converts binary data (like images or files) to ASCII text for safe transmission. They serve completely different purposes and should not be confused." },
              { q: "Why does + sometimes appear in URLs instead of %20 for spaces?", a: "In HTML form data (application/x-www-form-urlencoded), spaces are encoded as + instead of %20. In regular URL query strings, spaces should be %20. Both are valid in their respective contexts, but mixing them can cause bugs when decoding." },
              { q: "What is double URL encoding?", a: "Double encoding happens when an already-encoded URL gets encoded again — turning %20 into %2520 (% itself gets encoded to %25). This is usually a bug in code that encodes data twice. Our decoder handles both single and double-encoded URLs and will decode them step by step." },
            ].map(({ q, a }) => (
              <div key={q} className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground/80">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}
