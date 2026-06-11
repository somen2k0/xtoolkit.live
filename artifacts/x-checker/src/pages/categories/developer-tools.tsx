import {
  Code2, FileJson, Lock, Shield, Zap, Globe,
  Terminal, RefreshCw, Sparkles, Type, TrendingUp, Users,
} from "lucide-react";
import { ALL_TOOLS } from "@/lib/tools-registry";
import { CategoryLandingPage, type CategoryPageConfig } from "./CategoryLandingPage";

const tools = ALL_TOOLS.filter((t) => t.category === "developer");

const config: CategoryPageConfig = {
  path: "/developer-tools",
  seoTitle: "Free Online Developer Tools — JSON Formatter, Base64 Encoder | X Toolkit",
  seoDescription:
    "Free browser-based developer utilities: JSON formatter with validation, Base64 encoder/decoder with Unicode support. No install, no signup, no data sent to servers.",
  title: "Developer Tools",
  tagline: "Browser-based dev utilities — instant, private, zero-install",
  description:
    "Fast, privacy-first developer tools that run entirely in your browser. Format and validate JSON with syntax highlighting and line numbers, encode and decode Base64 strings with full Unicode and emoji support — no account, no install, no data leaving your device.",
  icon: Code2,
  color: "text-orange-400",
  bg: "bg-orange-400/10 border-orange-400/20",
  heroGradient: "bg-gradient-to-br from-orange-500/8 via-orange-500/3 to-transparent",
  tools,

  whatIs:
    "Developer tools are browser-based utilities that help engineers, designers, and technical users handle common formatting and encoding tasks without installing anything. The JSON Formatter takes raw, minified, or malformed JSON and outputs a clean, indented, syntax-highlighted version with line numbers and real-time error detection — making API responses, config files, and log payloads immediately readable. The Base64 Encoder/Decoder converts any text, including Unicode characters and emoji, to and from Base64 encoding — useful for working with APIs, authentication tokens, data URIs, and binary-safe data transmission. Both tools operate entirely client-side: your data is never sent to a server.",

  benefits: [
    {
      icon: Shield,
      title: "Fully private — data stays local",
      description:
        "All processing runs in your browser via JavaScript. No text, tokens, or JSON payloads are ever transmitted to our servers.",
    },
    {
      icon: Zap,
      title: "Instant results",
      description:
        "No upload step, no waiting for a server response. Paste your input and the output appears in real time as you type.",
    },
    {
      icon: Globe,
      title: "No install or account needed",
      description:
        "Open a URL, use the tool, close the tab. No npm install, no browser extension, no OAuth flow.",
    },
    {
      icon: FileJson,
      title: "JSON error detection",
      description:
        "The formatter highlights exactly where a syntax error is and explains what's wrong — saving the frustrating hunt through minified blobs.",
    },
    {
      icon: RefreshCw,
      title: "Two-way Base64 conversion",
      description:
        "Encode plain text to Base64 or decode Base64 back to plain text — including full Unicode and emoji — in one tool.",
    },
    {
      icon: Terminal,
      title: "Works on any device",
      description:
        "No local runtime required. The tools work the same on your phone, tablet, or work laptop without any setup.",
    },
  ],

  useCases: [
    {
      title: "Debugging API responses",
      description:
        "Paste a raw JSON response from an API endpoint into the formatter to instantly see the structure, find nested keys, and spot errors in the payload.",
    },
    {
      title: "Validating config files",
      description:
        "Check that a JSON config file (package.json, tsconfig, API spec) is syntactically valid and correctly formatted before committing.",
    },
    {
      title: "Working with Base64-encoded tokens",
      description:
        "Decode JWT payloads, API keys stored in Base64, or data URIs to inspect their raw content without pulling up a terminal.",
    },
    {
      title: "Preparing data for API requests",
      description:
        "Encode strings to Base64 when building API requests that require Base64-encoded credentials or binary-safe payloads.",
    },
    {
      title: "Minifying JSON for production",
      description:
        "Use the minify mode to strip whitespace from JSON config or data files before embedding them in a build or API response.",
    },
    {
      title: "Teaching and learning JSON structure",
      description:
        "Use the formatter as a teaching aid to show students or junior developers how nested JSON structures look when properly indented.",
    },
  ],

  faqs: [
    {
      q: "Is my data sent to X Toolkit's servers when I use these tools?",
      a: "No. The JSON Formatter and Base64 Encoder/Decoder run entirely in your browser using JavaScript. Your input never leaves your device — there is no backend processing for these tools.",
    },
    {
      q: "What types of JSON does the formatter support?",
      a: "The formatter handles any valid JSON: objects, arrays, strings, numbers, booleans, and null values, including deeply nested structures. It also detects and reports common syntax errors like missing commas, unquoted keys, and trailing commas.",
    },
    {
      q: "Does the Base64 tool support Unicode and emoji?",
      a: "Yes. The encoder uses TextEncoder to handle full Unicode — including emoji, CJK characters, and special symbols — correctly converting them to their UTF-8 byte representation before Base64 encoding, which is what most modern APIs expect.",
    },
    {
      q: "Can I use the JSON formatter to minify JSON?",
      a: "Yes. In addition to pretty-printing with indentation, the formatter includes a minify mode that strips all whitespace to produce compact JSON — useful for reducing payload size in APIs or config files.",
    },
    {
      q: "What's the maximum size of input these tools can handle?",
      a: "Because processing happens in the browser, practical limits depend on your device's memory and the browser's JavaScript engine. In practice, both tools handle payloads up to several megabytes without issues on modern hardware.",
    },
    {
      q: "Are more developer tools planned?",
      a: "Yes — upcoming tools include a URL encoder/decoder, JWT inspector, color format converter, and regex tester. Check back or follow @xtoolkit for updates.",
    },
  ],

  relatedCategories: [
    {
      title: "Text & Formatting Tools",
      href: "/text-format-tools",
      description: "Format tweet threads, count characters, and preview Unicode fonts.",
      icon: Type,
      color: "text-green-400",
      bg: "bg-green-400/10 border-green-400/20",
    },
    {
      title: "SEO Tools",
      href: "/seo-tools",
      description: "Meta tag analysis, keyword density checking, and URL slug generation.",
      icon: TrendingUp,
      color: "text-pink-400",
      bg: "bg-pink-400/10 border-pink-400/20",
    },
    {
      title: "Social Media Tools",
      href: "/social-media-tools",
      description: "Bulk account checker, profile link generator, and @ formatter for X.",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20",
    },
  ],

  extendedContent: (
    <>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">JSON: The Universal Data Format</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">JSON (JavaScript Object Notation) is the most widely used data interchange format in modern software development. Virtually every REST API returns JSON. Configuration files, log formats, database query results, and WebSocket messages are all commonly JSON. Understanding how to read, validate, and format JSON is an essential skill for any developer working with modern systems.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">Common JSON issues that our formatter helps diagnose: trailing commas (valid in JavaScript but not in JSON), missing quotation marks around property keys (JavaScript allows unquoted keys, JSON does not), single quotes instead of double quotes, undefined and NaN values (not valid JSON — use null instead), and comments (JSON does not support comments, despite many JSON-based config formats adding them as an extension). Paste any JSON into our formatter to immediately see these errors with helpful messages.</p>
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Base64 Encoding Explained</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Base64 encoding converts binary data into a string of 64 ASCII characters, making it safe to transmit through systems that were designed to handle only text. The name comes from the 64-character alphabet used: A–Z, a–z, 0–9, +, and /. The encoded output is approximately 33% larger than the original data.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">Common uses: embedding images directly in HTML or CSS as data URIs (avoiding separate HTTP requests), encoding binary data in JSON (which only supports text), HTTP Basic Authentication (credentials are Base64-encoded, though not encrypted — Base64 is encoding, not encryption), and JWT tokens (the header and payload are Base64url-encoded). Base64url is a URL-safe variant that replaces + with - and / with _ to avoid conflicts with URL special characters.</p>
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Privacy-First Development Tools</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Developer tools that process sensitive data — API keys, JWTs, database credentials, internal configuration — should run client-side whenever possible. Sending this data to a server creates unnecessary security risk, even if the server is trusted. Browser-based tools process your data locally and never transmit it anywhere.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">All tools on X Toolkit run entirely in your browser. The JSON formatter, Base64 encoder/decoder, JWT decoder, regex tester, and all other developer tools process your input using JavaScript running locally on your device. No network requests are made with your data. This makes them safe to use with production credentials, private API responses, and internal configuration files that you would not want to send to an external server.</p>
      </div>
    </>
  ),
};

export default function DeveloperToolsPage() {
  return <CategoryLandingPage config={config} />;
}
