#!/usr/bin/env node
/**
 * prerender.mjs — Build-time SSG for X Toolkit
 *
 * Runs after `vite build` to generate per-page HTML files with:
 *   - Unique <title> and <meta name="description"> for every route
 *   - Unique Open Graph + Twitter Card tags
 *   - Unique <link rel="canonical">
 *   - Per-page JSON-LD structured data (SoftwareApplication + BreadcrumbList)
 *   - <noscript> static content (homepage lists all 43 tools as <a href> links)
 *
 * Also auto-generates dist/public/sitemap-tools.xml from tools-manifest.json
 * so the sitemap stays in sync with the tool list automatically.
 *
 * Adding a new tool:
 *  1. Add an entry to src/lib/tools-manifest.json
 *  2. Add the icon to ICON_MAP in src/lib/tools-registry.ts
 *  Done — this script picks up the new tool on the next build.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist/public");
const SITE_URL = "https://xtoolkit.live";
const TODAY = new Date().toISOString().split("T")[0];

// Load tools manifest (single source of truth)
const toolsManifest = JSON.parse(
  readFileSync(join(__dirname, "src/lib/tools-manifest.json"), "utf-8"),
);

// Only live tools (skip isComingSoon)
const LIVE_TOOLS = toolsManifest.filter((t) => !t.isComingSoon);

// Category metadata (mirrors tools-registry.ts)
const CATEGORY_LABELS = {
  "social-media": "Social Media Tools",
  "ai-writing": "AI Writing Tools",
  "text-formatting": "Text & Formatting Tools",
  developer: "Developer Tools",
  seo: "SEO Tools",
  email: "Email Tools",
};

// Static pages (non-tool routes)
const STATIC_PAGES = [
  {
    path: "/",
    label: "Home",
    title: "X Toolkit — 43+ Free Tools for X, SEO, Developers & Creators",
    description:
      "43+ free online tools for X (Twitter), SEO, developers & creators: account checker, AI bio generator, JSON formatter, JWT decoder, QR code generator, password generator & more. No signup.",
    isHomepage: true,
  },
  {
    path: "/tools",
    label: "All Tools",
    title: "All 43 Free Online Tools | X Toolkit",
    description:
      "Browse all 43 free tools from X Toolkit: social media, AI writing, developer, SEO, and email tools. No signup required, instant results.",
  },
  {
    path: "/about",
    label: "About",
    title: "About X Toolkit — Free Tools for X, SEO & Developers",
    description:
      "X Toolkit offers 43+ free online tools for X (Twitter) creators, developers, and SEO professionals. No signup, no fees — tools that just work.",
  },
  {
    path: "/pricing",
    label: "Pricing",
    title: "Pricing | X Toolkit — Free Forever",
    description:
      "X Toolkit is free to use — no subscription, no credit card, no hidden fees. Every tool works without an account. See what's included.",
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    title: "Privacy Policy | X Toolkit",
    description:
      "Read X Toolkit's privacy policy. We don't store your data, usernames, or results. All tools run in your browser with no data collection.",
  },
  {
    path: "/terms",
    label: "Terms of Service",
    title: "Terms of Service | X Toolkit",
    description:
      "Read X Toolkit's terms of service. Free to use, no warranty. By using the tools you agree to these terms.",
  },
  {
    path: "/blog",
    label: "Blog",
    title: "Blog — Email Privacy, Temp Mail & Developer Tips | X Toolkit",
    description:
      "Articles on temp mail, email privacy, disposable email services, and developer tools. Tips and guides from X Toolkit.",
  },
  // Category landing pages
  {
    path: "/social-media-tools",
    label: "Social Media Tools",
    title: "Free Social Media Tools for X (Twitter) | X Toolkit",
    description:
      "Free social media tools for X (Twitter): account checker, profile link generator, @ formatter, bio generator, tweet scheduler, and more.",
    categoryKey: "social-media",
  },
  {
    path: "/ai-writing-tools",
    label: "AI Writing Tools",
    title: "Free AI Writing Tools - Bio Generator & AI Detector | X Toolkit",
    description:
      "Free AI writing tools: AI bio generator, AI content detector & humanizer, bio ideas, funny bios, and more. Powered by Groq's Llama model.",
    categoryKey: "ai-writing",
  },
  {
    path: "/text-format-tools",
    label: "Text & Formatting Tools",
    title: "Free Text & Formatting Tools Online | X Toolkit",
    description:
      "Free text formatting tools: character counter, tweet formatter, hashtag cleaner, font preview, case converter, and more. No signup needed.",
    categoryKey: "text-formatting",
  },
  {
    path: "/developer-tools",
    label: "Developer Tools",
    title: "Free Developer Tools - JSON, Base64, JWT, Regex & More | X Toolkit",
    description:
      "Free developer tools: JSON formatter, Base64 encoder, JWT decoder, regex tester, SQL formatter, UUID generator, YAML converter & more.",
    categoryKey: "developer",
  },
  {
    path: "/seo-tools",
    label: "SEO Tools",
    title: "Free SEO Tools - Meta Tags, Slug Generator & Keyword Checker | X Toolkit",
    description:
      "Free SEO tools: meta tag generator, URL slug generator, keyword density checker, robots.txt generator, OG image preview & more.",
    categoryKey: "seo",
  },
  {
    path: "/email-tools",
    label: "Email Tools",
    title: "Free Email Tools - Temp Mail, Validator, Signature & More | X Toolkit",
    description:
      "Free email tools: temp mail, email validator, signature generator, subject line generator, spam checker, privacy checker & more.",
    categoryKey: "email",
  },
  // Blog posts
  {
    path: "/blog/what-is-disposable-email",
    label: "What Is Disposable Email?",
    title: "What Is Disposable Email? Complete Guide | X Toolkit Blog",
    description:
      "Everything you need to know about disposable email addresses — how they work, when to use them, and the best services available.",
  },
  {
    path: "/blog/best-temp-mail-services",
    label: "Best Temp Mail Services",
    title: "Best Temp Mail Services in 2026 | X Toolkit Blog",
    description:
      "Reviewed: the best temporary email services in 2026. Compare features, inbox limits, and privacy policies to find the right tool.",
  },
  {
    path: "/blog/temp-mail-vs-gmail",
    label: "Temp Mail vs Gmail",
    title: "Temp Mail vs Gmail: When to Use Which | X Toolkit Blog",
    description:
      "Should you use temp mail or Gmail? A practical comparison of disposable email vs. a real Gmail account for different use cases.",
  },
  {
    path: "/blog/is-temp-mail-safe",
    label: "Is Temp Mail Safe?",
    title: "Is Temp Mail Safe? Privacy & Security Guide | X Toolkit Blog",
    description:
      "Is it safe to use a temporary email address? We examine privacy, security risks, and best practices for using temp mail services.",
  },
  {
    path: "/blog/why-websites-ask-email-verification",
    label: "Why Websites Ask for Email Verification",
    title: "Why Websites Ask for Email Verification | X Toolkit Blog",
    description:
      "Why do websites require email verification? Learn the technical and business reasons — and how to work around them responsibly.",
  },
  {
    path: "/blog/temp-gmail-explained",
    label: "Temp Gmail Explained",
    title: "Temp Gmail Explained: Gmail Tricks for Privacy | X Toolkit Blog",
    description:
      "How to use Gmail's plus-addressing and dot tricks to create multiple addresses. A complete guide to temporary Gmail usage.",
  },
  {
    path: "/blog/how-to-use-temp-email-extension",
    label: "How to Use a Temp Email Chrome Extension",
    title: "How to Use a Temp Email Chrome Extension | X Toolkit Blog",
    description:
      "Step-by-step guide: install the X Toolkit Chrome Extension, generate a disposable inbox, auto-copy OTP codes, use temp Gmail, and get background notifications from your toolbar.",
  },
  {
    path: "/chrome-extension",
    label: "Chrome Extension",
    title: "X Toolkit Chrome Extension — Free Temp Email & OTP Detector",
    description:
      "The free X Toolkit Chrome Extension gives you instant disposable email inboxes, automatic OTP code detection, temp Gmail address generation, and Gmail dot & plus-tag tricks — all from your browser toolbar.",
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact Us | X Toolkit",
    description:
      "Get in touch with the X Toolkit team. Report a bug, suggest a feature, or ask a question. We read every message.",
  },
];

// Temp-mail sub-routes (manually defined since they share a parent page)
const TEMP_MAIL_SUB_ROUTES = [
  {
    path: "/tools/temp-mail/tempemail",
    label: "Disposable Email Inbox",
    title: "Disposable Email Inbox — Free Temporary Email | X Toolkit",
    description:
      "Get a free disposable email inbox instantly. No signup, auto-refresh, works with any service. Protect your real email address online.",
    seoKeywords: "temp mail, temporary email, disposable email inbox, throwaway email, free temp email, no signup email, anonymous inbox, guerrilla mail",
    category: "email",
    sitemapPriority: 0.95,
  },
  {
    path: "/tools/temp-mail/tempgmail",
    label: "Temp Gmail Generator",
    title: "Temp Gmail Generator — Free Temporary Gmail Address | X Toolkit",
    description:
      "Generate a real temporary Gmail address instantly using Gmail dot tricks. Receive emails without using your real Gmail. Free, no signup, works everywhere Gmail is accepted.",
    ogTitle: "Temp Gmail Generator — Free Temporary Gmail",
    ogDescription: "Generate real @gmail.com addresses instantly. No signup. Works where disposable emails are blocked. Free temp gmail tool.",
    seoKeywords: "temp gmail, temporary gmail, fake gmail generator, disposable gmail, temp gmail address, gmail dot trick, temporary gmail address, free temp gmail, gmail generator, temp gmail online, temporary gmail address free",
    category: "email",
    sitemapPriority: 0.90,
  },
  {
    path: "/tools/temp-mail/gmail-tricks",
    label: "Gmail Tricks",
    title: "Gmail Dot & Plus Tricks — Create Unlimited Gmail Aliases | X Toolkit",
    description:
      "Learn Gmail's plus-addressing and dot trick to create unlimited aliases. Use john.doe@gmail.com and johndoe@gmail.com interchangeably.",
    seoKeywords: "gmail dot trick, gmail plus trick, gmail alias, gmail address generator, create unlimited gmail, gmail tricks guide, gmail plus addressing",
    category: "email",
    sitemapPriority: 0.85,
  },
];


// Custom per-page JSON-LD schemas (injected in addition to the standard ones)
const CUSTOM_PAGE_SCHEMAS = {
  "/tools/x-account-checker": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "X Account Checker — Bulk Twitter Status & Profile Checker",
    url: "https://xtoolkit.live/tools/x-account-checker",
    description:
      "Bulk check Twitter/X account status with full profile data including followers, following, join date and verified badge. Check up to 100 accounts simultaneously for free. No signup required.",
    applicationCategory: "UtilitiesApplication",
    keywords:
      "twitter account checker, bulk twitter checker, suspended account checker, x account checker, twitter follower checker, twitter profile checker",
    featureList: [
      "Check up to 100 accounts simultaneously",
      "Real-time Active/Suspended/Deleted status",
      "Follower and following counts",
      "Account join date",
      "Verified badge detection",
      "Profile photo and display name",
      "No login or API key required",
      "Free to use",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
  "/tools/temp-mail/tempgmail": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Temp Gmail Generator",
    url: "https://xtoolkit.live/tools/temp-mail/tempgmail",
    description:
      "Generate real temporary Gmail addresses using Gmail dot tricks. Free disposable Gmail generator, no signup required. Works on sites that block regular disposable emails.",
    applicationCategory: "UtilitiesApplication",
    keywords: "temp gmail, temporary gmail, fake gmail, disposable gmail, gmail generator",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
};

// PAGE_FAQS — sourced from component files. FAQPage JSON-LD is injected
// by generatePageHtml() for every route that has an entry here.
const PAGE_FAQS = {
  "/": [
    { q: "Is everything here completely free?", a: "Yes — 100% free, forever. No signup, no credit card, no hidden fees. Every tool works without an account." },
    { q: "How many X accounts can I check at once?", a: "Up to 100 usernames in a single batch, all checked in parallel. Results come back in seconds." },
    { q: "Do the developer tools send my data to a server?", a: "No. The JSON Formatter, Base64 Encoder, and all other developer tools run entirely in your browser. Nothing is sent to a server." },
    { q: "How does the AI bio generator work?", a: "It uses Groq's fast LLM API. Enter your niche and tone and get 3 ready-to-use bios instantly. Provide your own free Groq API key for unlimited generations." },
    { q: "Is my data stored or tracked?", a: "No. We don't store usernames, results, bios, or any personal data. Everything is processed in real-time and immediately discarded." },
    { q: "What new tools are coming?", a: "We're building SEO tools (meta checker, keyword density), more developer utilities (URL encoder, CSS minifier), and creator tools. Subscribe to get notified." },
    { q: "Does this work on mobile?", a: "Yes — every tool is fully responsive and optimized for mobile, tablet, and desktop." },
  ],
  "/chrome-extension": [
    { q: "What is the X Toolkit Chrome extension?", a: "X Toolkit is a free Chrome extension that gives you an instant disposable email inbox directly in your browser toolbar. It auto-generates a temporary email address, polls for new messages every 15 seconds, detects OTP verification codes automatically, and lets you generate temp Gmail addresses — all without visiting any website." },
    { q: "How do I install the X Toolkit temp email Chrome extension?", a: "Click 'Add to Chrome' from the Chrome Web Store listing, then click the puzzle-piece icon in your toolbar, find X Toolkit, and pin it. A temp email inbox is generated automatically the first time you open it — no account, no signup." },
    { q: "Is the X Toolkit Chrome extension free?", a: "Yes, completely free. There are no premium tiers, no subscriptions, and no feature limits. The extension connects to the same free API that powers xtoolkit.live." },
    { q: "Which browsers does the disposable email extension work on?", a: "The extension works on all Chromium-based browsers: Google Chrome, Brave, Microsoft Edge, Arc, and Opera. It uses Manifest V3 and is compatible with any browser that supports it. Firefox support is planned for a future release." },
    { q: "How does the automatic OTP and verification code detection work?", a: "The extension scans incoming email subjects and body text for 4–8 digit numeric codes. When it finds one, it shows a highlighted card at the top of your inbox with a single 'Copy' button — so you never have to manually read through the email to find your code." },
    { q: "Can I generate a temp Gmail address with the extension?", a: "Yes. The Gmail tab inside the extension generates a real temporary @gmail.com address using the Gmail dot-trick — emails sent to it actually arrive in a live inbox you can read right inside the popup. You can also generate unlimited Gmail dot-trick and plus-tag variants from your own address." },
    { q: "What data does the extension collect or store?", a: "None of your data is collected or tracked. The extension stores your active inbox session and address history locally on your device using Chrome's storage API. Nothing beyond the API calls needed to generate and check your inbox is ever sent to any server." },
    { q: "What permissions does the temp email extension need and why?", a: "storage (to remember your inbox across sessions), notifications (to alert you when new mail arrives), alarms (for background polling every 15 seconds), contextMenus (for the right-click 'Copy active email' option), and clipboardWrite (to copy addresses and OTP codes with one click). It only connects to xtoolkit.live — no other domains." },
    { q: "Does the extension check my inbox when the popup is closed?", a: "Yes. A lightweight Manifest V3 service worker runs in the background, polling your inbox every 15 seconds and sending a desktop notification the moment new mail arrives — even if you haven't opened the extension popup." },
    { q: "What is the keyboard shortcut to copy my temp email address?", a: "Press Alt+Shift+C anywhere in your browser to instantly copy your active temp email address to the clipboard — without opening the popup. You can reassign this shortcut in Chrome's extension keyboard shortcut settings (chrome://extensions/shortcuts)." },
    { q: "Can I use the extension without visiting the xtoolkit.live website?", a: "Exactly — that's the whole point. The extension gives you a full temp email inbox from any tab or page, without ever navigating away. For 43+ additional tools (JSON formatter, X account checker, AI bio generator, SEO tools, and more), visit xtoolkit.live." },
    { q: "Is it safe to use a Chrome temp email extension?", a: "Yes. The extension is open about every permission it requests, collects zero personal data, requires no account, and only communicates with xtoolkit.live — which you can verify in the Chrome Web Store's 'Privacy practices' tab. Disposable inboxes are public by design, so avoid using them for sensitive communications." },
  ],
  "/tools/ai-detector": [
    { q: "What AI models does it detect?", a: "It detects text from all major AI models — ChatGPT, Claude, Gemini, Llama, Mistral, and others. It looks for universal AI writing patterns rather than model-specific fingerprints." },
    { q: "How accurate is the detection?", a: "Detection uses Llama 3.3 70B, one of the strongest open models. Accuracy is high for clearly AI-generated or clearly human text. Short or heavily edited text may score as uncertain." },
    { q: "What does the humanizer do?", a: "The humanizer rewrites AI-generated text to sound natural and human — adding contractions, varying sentence length, removing AI transition phrases, and adding personality." },
    { q: "Is my text stored?", a: "No. Your text is processed instantly and immediately discarded. Nothing is stored on our servers." },
    { q: "What's the text limit?", a: "Detection supports up to 8000 characters. Humanization supports up to 6000 characters. For longer content, process it in sections." },
  ],
  "/tools/at-formatter": [
    { q: "What does this tool do?", a: "It bulk adds or removes the @ prefix from a list of X (Twitter) usernames in one click." },
    { q: "What separators are supported?", a: "One username per line works best. The tool handles any mix of usernames with or without @." },
    { q: "Is there a limit on how many usernames I can process?", a: "No — paste as many as you need. Everything runs locally in your browser." },
    { q: "Does any data get sent to a server?", a: "No. This tool runs entirely in your browser — no usernames are ever sent to our servers." },
    { q: "Can I copy just one username from the result?", a: "Yes — hover over any username in the result list and click the copy icon that appears." },
  ],
  "/tools/base64": [
    { q: "What is Base64 encoding?", a: "Base64 is a binary-to-text encoding scheme that converts binary data into a string of ASCII characters. It uses 64 printable characters (A–Z, a–z, 0–9, +, /) to represent arbitrary binary data. It's widely used to safely transmit binary data over systems that only handle text, such as email and JSON APIs." },
    { q: "What is Base64 used for?", a: "Base64 is used to embed images in HTML/CSS (as data URIs), encode email attachments (MIME), store binary data in JSON, pass data in URLs, encode JWTs (JSON Web Tokens), and send binary payloads through text-only channels like XML or REST APIs." },
    { q: "Is Base64 the same as encryption?", a: "No. Base64 is encoding, not encryption. It does not protect your data — anyone can decode it instantly. It simply makes binary data safe to transmit through text-based protocols. Never use Base64 to secure sensitive data; use proper encryption like AES for that." },
    { q: "What is URL-safe Base64?", a: "Standard Base64 uses + and / characters which have special meaning in URLs. URL-safe Base64 replaces + with - and / with _ so the encoded string can be used safely in URLs and filenames without percent-encoding. JWTs use URL-safe Base64 without padding (=) characters." },
    { q: "Why does Base64 output end with = or ==?", a: "Base64 works in groups of 3 bytes. If the input length is not a multiple of 3, padding characters (=) are added to make the output length a multiple of 4. One = means 1 byte of padding was added; == means 2 bytes. Some implementations omit padding entirely." },
    { q: "How do I decode a Base64 image?", a: "A Base64-encoded image typically appears as a data URI like data:image/png;base64,iVBORw0K... You can paste just the Base64 part (after the comma) into the decoder here to see the raw binary data. To render the image, use it as the src of an <img> tag with the full data URI." },
    { q: "Can I encode any text to Base64?", a: "Yes. Any UTF-8 text — including Unicode characters, emojis, and special symbols — can be Base64 encoded. Our tool handles full Unicode by encoding the string as UTF-8 bytes first, then converting to Base64. This matches how most modern systems and browsers work." },
    { q: "What is the size increase from Base64 encoding?", a: "Base64 increases the data size by approximately 33%. Every 3 bytes of input produce 4 Base64 characters. So a 1 KB file becomes roughly 1.33 KB when Base64 encoded. This overhead is a known tradeoff when embedding binary data in text-based formats." },
  ],
  "/tools/bio-generator": [
    { q: "Is the AI bio generator really free?", a: "Yes — 100% free, no signup required. It uses Groq's fast LLM API under the hood." },
    { q: "How many bios does it generate?", a: "It generates 3 different bio options each time so you can pick your favourite or mix and match." },
    { q: "Are bios within X's 160-character limit?", a: "Yes — each generated bio is designed to fit within X's 160-character bio limit." },
    { q: "What tone options can I use?", a: "You can enter any tone — professional, witty, minimal, motivational, casual, bold, or anything else." },
    { q: "Can I regenerate if I don't like the results?", a: "Yes — click Regenerate to get 3 new bios with the same topic and tone." },
    { q: "Does my data get stored?", a: "No. Your topic and tone are sent to the API to generate bios and immediately discarded. Nothing is stored." },
  ],
  "/tools/funny-bios": [
    { q: "Can a funny Twitter bio help me get more followers?", a: "Yes! Humor is one of the strongest bio strategies for building a personality-driven audience. A witty bio makes you memorable and gives people a reason to follow." },
    { q: "How do I make my Twitter bio funny?", a: "The most effective techniques are: self-deprecating humor, subverting expectations, understatement, and absurdism. Keep it short — punchlines land better when concise." },
    { q: "Should a funny bio also include professional info?", a: "It depends on your goal. If you're building a personal brand, include a brief professional note alongside the humor — for example, 'Software engineer by day, chaos agent by night'." },
    { q: "What are the best funny Twitter bios?", a: "The best funny bios are relatable, short, and feel authentic. They often play on universal experiences: being tired, procrastinating, loving food, or struggling with adult responsibilities." },
    { q: "How many characters is the Twitter bio limit?", a: "Twitter limits bios to 160 characters. Most of these funny bios are well under that limit, giving you room to add your own details, emojis, or location." },
    { q: "How does the AI funny bio generator work?", a: "Enter your niche or personality, pick a humor style (sarcastic, self-deprecating, witty, or random), and click Generate. The AI writes 3 original funny bios tailored to you." },
  ],
  "/tools/case-converter": [
    { q: "What is a case converter?", a: "A case converter transforms text between different letter-case styles — such as UPPERCASE, lowercase, camelCase, snake_case, and more. It's useful for formatting code variables, titles, slugs, and any text that needs a specific style." },
    { q: "What is camelCase?", a: "camelCase writes compound words with the first word lowercase and each subsequent word starting with a capital letter — like 'myVariableName'. It's widely used in JavaScript, Java, and many other languages for variable and function names." },
    { q: "What is snake_case?", a: "snake_case uses all lowercase letters with underscores between words — like 'my_variable_name'. It's common in Python, Ruby, and SQL for variable names, table names, and file names." },
    { q: "What is kebab-case?", a: "kebab-case uses all lowercase letters with hyphens between words — like 'my-variable-name'. It's the standard for CSS class names, HTML attributes, URLs, and command-line flags." },
    { q: "What is PascalCase?", a: "PascalCase (also called UpperCamelCase) capitalizes the first letter of every word — like 'MyVariableName'. It's the convention for class names in most object-oriented languages including JavaScript, TypeScript, C#, and Java." },
    { q: "Is my text processed on the server?", a: "No. All conversions happen entirely in your browser using JavaScript. Your text is never sent to any server — it's 100% private and instant." },
  ],
  "/tools/character-counter": [
    { q: "What counts as a character on Twitter/X?", a: "Every letter, number, space, punctuation mark, and emoji counts as 1 character. URLs are automatically shortened to 23 characters regardless of their actual length. Line breaks also count as 1 character each." },
    { q: "What is the Twitter character limit?", a: "Standard Twitter/X accounts have a 280-character limit per tweet. Twitter Blue / X Premium subscribers can post up to 25,000 characters (long-form posts). Your profile bio is limited to 160 characters." },
    { q: "Do emojis count as 1 or 2 characters?", a: "Most emojis count as 2 characters on Twitter because they use two Unicode code units. Some complex emojis (like those with modifiers) may count as more. Our counter uses JavaScript's length property which matches Twitter's counting method." },
    { q: "Does Twitter count spaces as characters?", a: "Yes, every space counts as one character on Twitter. Leading and trailing spaces are also counted, so be mindful of extra whitespace at the start or end of your tweet." },
    { q: "What happens if I go over 280 characters?", a: "Twitter will not allow you to post a tweet that exceeds 280 characters. The tweet button will be disabled. You would need to either shorten your tweet or create a thread by splitting it into multiple tweets." },
    { q: "How do I split a long text into tweets?", a: "Use our Tweet Thread Formatter tool to automatically split long text into a numbered tweet thread. It respects word boundaries and adds tweet numbers (1/3, 2/3, etc.) automatically." },
  ],
  "/tools/css-minifier": [
    { q: "What is CSS minification?", a: "CSS minification removes unnecessary characters from CSS — comments, whitespace, newlines, and redundant semicolons — to produce the smallest possible file that has identical functionality to the original." },
    { q: "Why should I minify CSS?", a: "Smaller CSS files download faster, which directly improves page load time and Core Web Vitals scores. Minifying CSS is a standard performance optimization for production websites." },
    { q: "Will minified CSS work the same?", a: "Yes. Minification only removes characters that have no effect on how the browser interprets the stylesheet. The visual output of the page will be identical." },
    { q: "Is my CSS safe to paste here?", a: "Yes. All processing happens entirely in your browser — nothing is sent to a server." },
  ],
  "/tools/email-signature-generator": [
    { q: "What should an email signature include?", a: "An effective email signature includes: your full name, job title, company name, email address, and phone number. Optionally add your website, LinkedIn profile, and social handles. Keep it concise — 4–6 lines is ideal. Avoid images, legal disclaimers (unless required), and more than 2 social links." },
    { q: "Should I use an HTML or plain text email signature?", a: "HTML signatures display nicely in most modern email clients (Gmail, Outlook, Apple Mail). However, some corporate email systems strip HTML. For maximum compatibility, set up both an HTML signature for your primary client and a plain text fallback." },
    { q: "What image size should I use in an email signature?", a: "If you include a photo or logo, keep it under 100 KB and size it at 100–200px wide. Larger images can trigger spam filters. Always use a hosted URL for the image rather than an embedded file, and include an alt attribute." },
    { q: "Is it unprofessional to put a quote in an email signature?", a: "Motivational quotes in email signatures are generally considered unprofessional in formal business contexts. Stick to contact information. Quotes can be appropriate in certain creative industries or personal contexts." },
    { q: "How do I add an HTML signature to Gmail?", a: "In Gmail: Settings → See all settings → General → Signature → Create new. Paste the HTML source via the formatting toolbar's code view, or paste the rendered preview directly. For a cleaner paste, open the HTML preview in a browser and copy from there." },
  ],
  "/tools/email-validator": [
    { q: "What does email syntax validation check?", a: "Syntax validation checks whether an email address follows the correct format defined by RFC 5322: a local part (before @), an @ symbol, and a domain (after @). It checks for valid characters, proper structure, and reasonable length limits. It does not verify that the mailbox actually exists." },
    { q: "What is the difference between syntax validation and MX verification?", a: "Syntax validation (what this tool does) checks format only — it's instant and runs in the browser. MX verification makes a DNS lookup to check if the domain has mail exchange records configured, which requires a server-side call. Both together give you higher confidence that an address can receive mail." },
    { q: "What characters are allowed in an email address?", a: "In the local part (before @): letters (A-Z, a-z), digits (0-9), and special characters: .!#$%&'*+/=?^_" },
    { q: "Can I bulk validate email addresses?", a: "Yes — paste one email per line and this tool validates all of them at once. It shows a pass/fail status with specific issues for each address. You can copy just the valid addresses or export results." },
    { q: "Why does a correctly formatted address still bounce?", a: "Syntax validation only checks format. An address can be syntactically valid but the mailbox may not exist, be full, or the domain may have been deactivated. To catch these cases, you need MX record checking and/or SMTP verification — more advanced steps not covered by a browser-based tool." },
  ],
  "/tools/temp-mail/tempgmail": [
    { q: "What is a temp Gmail?", a: "A temp Gmail is a real @gmail.com email address generated using Gmail's dot trick — where dots in the username are ignored by Gmail. For example, john.smith@gmail.com and johnsmith@gmail.com both deliver to the same inbox. This lets you create unlimited unique Gmail addresses without creating a new Google account." },
    { q: "How do I get a temporary Gmail address?", a: "Use our free Temp Gmail Generator: click the tool and a real @gmail.com address is generated instantly using the dot trick. Copy it, use it anywhere Gmail is accepted, and check incoming messages right in the same tool — no signup, no Google account needed." },
    { q: "Is a temp Gmail address a real Gmail?", a: "Yes — temp Gmail addresses generated with the dot trick are real @gmail.com addresses. Emails sent to them are delivered to a real Gmail inbox. This is what makes them work on sites that block disposable email domains like guerrillamail.com or mailinator.com." },
    { q: "What is the Gmail dot trick?", a: "Gmail ignores dots (.) in email usernames. So john.doe@gmail.com, j.ohndoe@gmail.com, and johndoe@gmail.com all deliver to the exact same inbox. This is not a hack — it is documented Gmail behaviour. You can use any dot variation to register on sites that restrict duplicate signups." },
    { q: "Can I use a temp Gmail for verification?", a: "Yes. Because temp Gmail addresses are real @gmail.com addresses, they pass email verification on virtually every platform — including those that reject known disposable email domains. The generated address receives real emails, so you can complete OTP and link-based verifications." },
    { q: "How is a temp Gmail different from regular disposable email?", a: "Regular disposable email services (like Mailinator or Guerrilla Mail) use their own domains (@guerrillamail.com, @mailinator.com) which are widely blocked. Temp Gmail addresses end in @gmail.com — a domain that is trusted everywhere — so they work even on services that block standard disposable emails." },
    { q: "Is the temp Gmail generator free?", a: "Yes, completely free. No signup, no Google account, no API key required. Our generator creates a dot-trick Gmail address instantly and lets you check the inbox for incoming messages — all at no cost." },
    { q: "How many temp Gmail addresses can I generate?", a: "Unlimited. Gmail's dot trick allows millions of unique variations for any username (every combination of dot positions). Our generator picks a fresh variation each time you click 'New Address', so you can generate as many as you need." },
  ],
  "/tools/font-preview": [
    { q: "Do Unicode fonts work on Twitter?", a: "Yes! Twitter/X supports Unicode characters, which means you can use stylized mathematical fonts in your tweets and bio. These characters are actual Unicode letters from the Mathematical Alphanumeric Symbols block, not images, so they work everywhere that supports Unicode text." },
    { q: "Is using fancy fonts on Twitter against the rules?", a: "Twitter's Terms of Service don't explicitly prohibit Unicode fonts. However, Twitter has occasionally restricted heavily formatted bios. Bold and italic variants are generally safe. Avoid overusing exotic fonts as they can hurt readability and be inaccessible to screen readers." },
    { q: "Will these fonts work on mobile Twitter?", a: "Yes — since these are standard Unicode characters, they render on all devices and platforms that support Unicode, including iOS and Android Twitter apps. Some older devices may show placeholder boxes for very rare characters." },
    { q: "Why don't some characters convert?", a: "Not every Unicode font block includes all characters. Some styles (like Fraktur and Script) have known exceptions for specific capital letters — these use alternative code points. Spaces, numbers, and most punctuation don't have Unicode font equivalents and are kept as-is." },
    { q: "Can I use these fonts for my Twitter name?", a: "Yes! You can paste any of these font variants directly into your Twitter display name or bio field. Just copy the text, go to Twitter Settings, and paste it into the Name or Bio field." },
  ],
  "/tools/hashtag-formatter": [
    { q: "What is a hashtag formatter?", a: "A hashtag formatter converts plain words or phrases into properly formatted Twitter hashtags. It handles multi-word phrases by combining them (e.g., 'web design' becomes #WebDesign or #webdesign) and strips special characters that aren't allowed in hashtags." },
    { q: "What characters are allowed in Twitter hashtags?", a: "Twitter hashtags can only contain letters (A-Z, a-z), numbers (0-9), and underscores (_). Spaces, hyphens, punctuation, and most special characters are not allowed and will break the hashtag." },
    { q: "Should I use CamelCase or lowercase hashtags?", a: "CamelCase hashtags (#WebDesign) are generally preferred for readability and are screen-reader friendly. Lowercase (#webdesign) also works fine. Uppercase (#WEBDESIGN) can feel like shouting but is sometimes used for brand hashtags or events." },
    { q: "How many hashtags should I use per tweet?", a: "Twitter recommends using 1-2 hashtags per tweet for best engagement. Using too many hashtags (5+) can make tweets look spammy and actually reduce engagement. For Instagram, 5-10 relevant hashtags perform well." },
    { q: "Do hashtags help with Twitter reach?", a: "Yes — hashtags make your tweets discoverable to people searching for that topic. However, only use relevant hashtags that your target audience actually follows. Irrelevant hashtags rarely improve reach and can hurt credibility." },
  ],
  "/tools/html-formatter": [
    { q: "What does an HTML formatter do?", a: "An HTML formatter (also called an HTML beautifier) takes messy or minified HTML and reformats it with proper indentation and line breaks, making it easy to read and understand the document structure." },
    { q: "Will formatting change how my page looks?", a: "No. HTML formatting only changes whitespace between tags. Browsers ignore extra whitespace when rendering HTML, so the visual output of your page is identical before and after formatting." },
    { q: "Is my HTML safe to paste here?", a: "Yes. All processing happens entirely in your browser — nothing is sent to a server. You can safely paste any HTML, including HTML containing passwords, tokens, or private data." },
    { q: "Can I minify HTML too?", a: "Yes — the Minify button strips all unnecessary whitespace to give you the smallest possible HTML output, useful for production deployments where page weight matters." },
  ],
  "/tools/json-formatter": [
    { q: "What is a JSON formatter?", a: "A JSON formatter (also called a JSON beautifier or JSON prettifier) is a tool that takes minified or unformatted JSON text and reformats it with proper indentation and line breaks, making it easy to read and understand. It's an essential tool for developers working with APIs, config files, and data interchange formats." },
    { q: "What is JSON validation?", a: "JSON validation checks whether a piece of text conforms to the JSON specification (RFC 8259). A valid JSON document must have proper key-value pairs, correct use of quotes, no trailing commas, and balanced brackets. Our validator shows you exactly where any syntax errors are so you can fix them instantly." },
    { q: "What are common JSON syntax errors?", a: "The most common JSON errors are: trailing commas after the last item in an object or array, using single quotes instead of double quotes around keys or strings, missing quotes around object keys, unescaped special characters in strings, and mismatched or missing brackets and braces." },
    { q: "What is the difference between format and minify JSON?", a: "Formatting (prettifying) JSON adds indentation and newlines to make it human-readable. Minifying removes all unnecessary whitespace to produce the smallest possible string — useful for reducing file size and network payload when sending JSON in API responses or config files." },
    { q: "Is my JSON data safe to paste here?", a: "Completely. This tool runs 100% in your browser — no data is ever sent to a server. Your JSON stays on your device at all times. You can use it safely with sensitive configuration data, API keys (though we recommend removing them first), or private business data." },
    { q: "Why do developers use JSON formatters?", a: "Developers use JSON formatters when debugging API responses, reviewing configuration files, reading log data, or collaborating with teammates. Minified JSON is unreadable, and a formatter instantly makes it clear. JSON validators help catch bugs before they reach production." },
    { q: "Can I use this to validate JSON from an API response?", a: "Yes. Just paste the raw JSON response from any API directly into the input panel. The tool will validate it instantly and show you a formatted, readable version — or tell you exactly which line has a syntax error." },
    { q: "What is JSON-LD?", a: "JSON-LD (JSON for Linking Data) is a format for encoding Linked Data using JSON, commonly used for structured data and SEO schema markup. While our formatter can format JSON-LD, it does not provide semantic validation for the JSON-LD vocabulary itself." },
  ],
  "/tools/jwt-decoder": [
    { q: "What is a JWT?", a: "A JSON Web Token (JWT) is a compact, URL-safe way to represent claims between two parties. It consists of three Base64URL-encoded parts separated by dots: a header (algorithm info), a payload (claims/data), and a signature (for verification)." },
    { q: "Is it safe to paste my JWT here?", a: "Yes. This tool decodes JWTs entirely in your browser — no data is sent to any server. However, never share your JWT publicly, as it may grant access to protected resources." },
    { q: "Can this tool verify JWT signatures?", a: "No. Signature verification requires the secret or public key used to sign the token, which only your server should have. This tool only decodes and displays the header and payload for inspection purposes." },
    { q: "What do the JWT claims mean?", a: "Common claims include: sub (subject — who the token is about), iat (issued at — Unix timestamp), exp (expiration — Unix timestamp), aud (audience), iss (issuer), and nbf (not before). Custom claims can also be included." },
    { q: "What is the difference between HS256 and RS256?", a: "HS256 uses a shared secret (HMAC-SHA256) — the same key signs and verifies. RS256 uses asymmetric keys (RSA) — a private key signs and a public key verifies. RS256 is preferred for distributed systems." },
  ],
  "/tools/keyword-density": [
    { q: "What is keyword density?", a: "Keyword density is the percentage of times a target keyword appears in a piece of content relative to the total word count. Formula: (keyword occurrences ÷ total words) × 100. A density of 1–3% is generally considered optimal." },
    { q: "What is the ideal keyword density for SEO?", a: "The widely accepted best practice is 1–3% keyword density. Below 1% and search engines may not strongly associate your page with that keyword. Above 4–5% risks being flagged for keyword stuffing, which can trigger ranking penalties." },
    { q: "What is keyword stuffing and why is it bad?", a: "Keyword stuffing is the practice of unnaturally repeating a keyword to manipulate search rankings. It degrades the reader's experience, and Google's algorithms actively detect and penalize it. Modern SEO focuses on semantic relevance and natural language, not raw keyword repetition." },
    { q: "Should stop words be counted in keyword density?", a: "No. Stop words (the, a, and, of, etc.) are excluded from keyword density calculations because they appear in almost every sentence and carry no semantic weight for search engines. This tool filters stop words by default." },
    { q: "What is LSI (Latent Semantic Indexing) in SEO?", a: "LSI keywords are semantically related terms that help search engines understand the context of your content. Rather than repeating the same keyword, including related terms (synonyms, related concepts) signals topical depth, which can improve rankings." },
    { q: "Does keyword density still matter in 2024?", a: "Keyword density is less critical than it was in the early 2000s. Modern search algorithms use natural language processing to understand content context and intent. However, it's still a useful diagnostic: extreme under- or over-optimization is worth correcting." },
  ],
  "/tools/masked-email-generator": [
    { q: "What is a masked email address?", a: "A masked email is a forwarding address that hides your real inbox. When you give websites a masked address, they can't discover your true email. You receive messages at your real inbox through the relay, but can disable the alias at any time." },
    { q: "How is this different from a disposable email?", a: "Disposable emails are temporary and usually expire. Masked emails are permanent aliases that forward to your real inbox indefinitely — you just turn them off when you're done. They're better for services you actually want to use long-term without sharing your real address." },
    { q: "Do alias services read my emails?", a: "Reputable services like SimpleLogin and AnonAddy are open-source and privacy-focused. AnonAddy and SimpleLogin explicitly don't log email content. Always verify a service's privacy policy. Avoid closed-source services from advertising companies." },
    { q: "Can I reply from a masked address?", a: "Yes. Services like SimpleLogin and AnonAddy support replying through the alias, so the recipient never sees your real email. This is called two-way masking." },
    { q: "What is the Gmail + trick?", a: "You can append +anything to your Gmail username (e.g. you+shopping@gmail.com) and it still delivers to your inbox. This lets you create unlimited 'aliases' for filtering — but your base address is visible to the sender if they inspect the To header." },
  ],
  "/tools/meta-tag-generator": [
    { q: "What is the ideal meta title length?", a: "Google typically displays the first 50–60 characters of a page title. Titles under 60 characters are shown in full; longer titles get truncated with an ellipsis. Aim for 50–60 characters for best results." },
    { q: "How long should a meta description be?", a: "Google shows around 155–160 characters of a meta description in desktop results. On mobile, it's slightly shorter. Keep descriptions between 140–160 characters, include your target keyword naturally, and add a call-to-action." },
    { q: "What is Open Graph (OG) and why does it matter?", a: "Open Graph tags control how your page appears when shared on Facebook, LinkedIn, Slack, and other platforms. Without OG tags, platforms guess your title and image — often with poor results. Set og:title, og:description, and og:image for every important page." },
    { q: "What are Twitter Card meta tags?", a: "Twitter Card tags tell Twitter how to render your link preview. 'summary' shows a small thumbnail, while 'summary_large_image' shows a large banner image. Twitter falls back to OG tags if Twitter Card tags are missing." },
    { q: "What is the ideal OG image size?", a: "For 'summary_large_image' Twitter Cards and og:image, use 1200×630 pixels (1.91:1 ratio). This renders correctly on most platforms. Minimum recommended size is 600×315 pixels." },
    { q: "Should meta keywords still be used in 2024?", a: "No. Google has explicitly stated it ignores the meta keywords tag and has done so since 2009. Bing also ignores it. Focus your efforts on meta titles, descriptions, and OG tags instead." },
  ],
  "/tools/newsletter-template-generator": [
    { q: "What makes a good newsletter template?", a: "A good newsletter template has a clear header with your brand, a single-column layout (mobile-first), a prominent headline, concise body text, one primary CTA button, and a footer with your unsubscribe link and address. Keep it under 600px wide." },
    { q: "Should I use HTML or plain-text newsletters?", a: "HTML newsletters look polished and support images and branding, but plain-text emails often have higher open rates and feel more personal. Many successful newsletters use a hybrid approach — simple HTML that renders like plain text." },
    { q: "What is the ideal newsletter length?", a: "Most newsletters perform best at 200–500 words. Long newsletters work if readers have opted in for in-depth content (like essay newsletters). Short newsletters (under 200 words) work well for curated link roundups or quick updates." },
    { q: "How do I grow my email newsletter list?", a: "Top growth tactics: add a signup form to every page of your website, offer a lead magnet (PDF, checklist, mini-course), promote your newsletter on social media, add a signup link to your email signature, and cross-promote with complementary newsletters." },
    { q: "What should I include in every newsletter footer?", a: "Every newsletter footer must include: your mailing address (legally required in the US under CAN-SPAM), an unsubscribe link, your company name, and optionally a reason why the reader is receiving it. Missing these elements can damage deliverability." },
  ],
  "/tools/og-image-preview": [
    { q: "What is an OG (Open Graph) image?", a: "Open Graph (OG) is a protocol created by Facebook that controls how URLs appear when shared on social media. OG tags define the title, description, and image shown in the preview card when someone shares your link on Facebook, LinkedIn, X (Twitter), Slack, and other platforms." },
    { q: "What is a Twitter Card?", a: "Twitter Cards are meta tags that control how your page looks when shared on X (Twitter). There are four types: summary, summary_large_image, app, and player. The twitter:card, twitter:title, twitter:description, and twitter:image tags define the appearance." },
    { q: "Why does my OG image not show up on social media?", a: "Common reasons include: the og:image URL is not absolute (must start with https://), the image is too small (minimum 200×200px, recommended 1200×630px), the meta tags are missing from the HTML, or social media platforms have cached an old version. Use this tool to verify your tags are present and correct." },
    { q: "How do I add OG tags to my website?", a: "Some websites block bots or require authentication. Our server fetches the page like a browser and extracts meta tags, but sites with bot protection (Cloudflare, login walls, etc.) may return an error. In those cases, view the page source directly in your browser to check the tags." },
  ],
  "/tools/page-speed-checker": [
    { q: "What is a good page speed score?", a: "Google's Core Web Vitals consider scores of 90–100 as 'Good', 50–89 as 'Needs Improvement', and 0–49 as 'Poor'. Aim for LCP under 2.5s, FID under 100ms, and CLS under 0.1." },
    { q: "Why does page speed affect SEO?", a: "Google uses Core Web Vitals as a ranking signal since 2021. Faster pages rank higher, have lower bounce rates, and provide better user experience. A 1-second delay can reduce conversions by 7%." },
    { q: "What causes slow page speed?", a: "Common causes include unoptimized images, render-blocking JavaScript, excessive HTTP requests, no caching, slow server response, large CSS files, and loading too many third-party scripts." },
    { q: "How do I improve my LCP (Largest Contentful Paint)?", a: "Optimize your hero image, use a CDN, preload key resources, eliminate render-blocking resources, and ensure server response time is under 200ms. LCP measures how fast the main content loads." },
    { q: "What is CLS and how do I fix it?", a: "CLS (Cumulative Layout Shift) measures unexpected layout shifts. Fix it by always specifying image dimensions, avoiding inserting content above existing content, and using CSS transform for animations." },
  ],
  "/tools/profile-link-generator": [
    { q: "What does this tool do?", a: "It converts a list of X (Twitter) usernames into clickable profile URLs — one per line, comma-separated, or space-separated." },
    { q: "Does it verify the accounts exist?", a: "No, it just builds the URLs. Use the X Account Checker tool if you also need to verify the accounts are active." },
    { q: "Can I include the @ symbol?", a: "Yes — the tool automatically strips the @ prefix before building the link." },
    { q: "How many usernames can I process at once?", a: "There is no hard limit — paste as many usernames as you need." },
    { q: "What format are the links in?", a: "Links are in the format https://x.com/username — the current canonical X profile URL." },
  ],
  "/tools/regex-tester": [
    { q: "What is a regular expression?", a: "A regular expression (regex) is a sequence of characters that defines a search pattern. Regex is used to match, search, and replace text in strings. It's supported in nearly every programming language." },
    { q: "What flags are available?", a: "Common flags: g (global — find all matches), i (case-insensitive), m (multiline — ^ and $ match line boundaries), s (dotAll — . matches newlines)." },
    { q: "What does \\\\d, \\\\w, \\\\s mean?", a: "Yes. All regex testing happens entirely in your browser — nothing is sent to a server." },
  ],
  "/tools/robots-txt-generator": [
    { q: "What is a robots.txt file?", a: "A robots.txt file is a plain text file placed at the root of your website (e.g., example.com/robots.txt) that instructs search engine crawlers which pages or sections to crawl and which to skip. It's part of the Robots Exclusion Standard." },
    { q: "Does robots.txt prevent indexing?", a: "No — robots.txt controls crawling, not indexing. A page can appear in search results even if its crawling is blocked, if other pages link to it. To prevent indexing, use the 'noindex' meta tag or X-Robots-Tag HTTP header." },
    { q: "What is the difference between Allow and Disallow?", a: "Disallow tells a bot not to crawl a specific path. Allow overrides a broader Disallow rule for a more specific path. For example, you can Disallow /private/ but Allow /private/public-page.html to selectively open one page within a blocked directory." },
    { q: "What is Crawl-delay?", a: "Crawl-delay specifies the number of seconds a bot should wait between requests to your server. This is useful for limiting crawler load on small or slow servers. Note: Googlebot ignores crawl-delay — use Google Search Console to control Googlebot's crawl rate instead." },
    { q: "Should I block AI bots like GPTBot?", a: "That depends on your preferences. GPTBot (OpenAI) and ClaudeBot (Anthropic) are used to collect training data for AI models. Adding 'Disallow: /' for these bots prevents your content from being used in AI training. Many site owners are choosing to do this." },
    { q: "Where should I put the robots.txt file?", a: "Always at the root of your domain: https://yourdomain.com/robots.txt. It must be accessible without authentication. Place the Sitemap directive at the bottom pointing to your XML sitemap URL." },
  ],
  "/tools/schema-generator": [
    { q: "What is schema markup?", a: "Schema markup is structured data added to your HTML that helps search engines understand your content. It uses vocabulary from Schema.org and is formatted as JSON-LD, Microdata, or RDFa. JSON-LD is Google's preferred format." },
    { q: "Does schema markup directly improve rankings?", a: "Schema doesn't directly boost rankings, but it enables rich results (star ratings, FAQs, breadcrumbs in SERPs) which significantly improve click-through rates. Higher CTR signals quality to Google and can indirectly improve rankings." },
    { q: "Which schema types are most valuable for SEO?", a: "FAQ Schema, Article Schema, Product Schema (with reviews), LocalBusiness Schema, and BreadcrumbList are the most impactful. FAQ Schema is particularly effective — it can double your SERP real estate." },
    { q: "How do I add schema markup to my website?", a: "Paste the JSON-LD script tag in the <head> section of your HTML, or just before </body>. In WordPress, use a plugin like RankMath or Yoast. In React/Next.js, use a <script type='application/ld+json'> tag." },
    { q: "How do I test if my schema is valid?", a: "Use Google's Rich Results Test (search.google.com/test/rich-results) or Schema.org's Markup Validator. After deploying, check Google Search Console's Enhancements section for rich result eligibility." },
  ],
  "/tools/sitemap-validator": [
    { q: "What is an XML sitemap?", a: "An XML sitemap is a file that lists all the important URLs on your website and provides metadata about each URL (last modification date, update frequency, priority). It helps search engine crawlers discover and understand your site structure more efficiently." },
    { q: "Does having a sitemap improve rankings?", a: "A sitemap doesn't directly improve rankings, but it improves crawlability — helping search engines find all your pages, especially new content or pages with few inbound links. For large sites or new sites, a sitemap is essential for complete indexing." },
    { q: "How many URLs can a sitemap have?", a: "Each sitemap file can contain a maximum of 50,000 URLs and must not exceed 50 MB uncompressed. For larger sites, create a sitemap index file that points to multiple individual sitemaps." },
    { q: "What is the correct date format for <lastmod>?", a: "The lastmod element should use W3C Datetime format. The most common form is YYYY-MM-DD (e.g., 2024-01-15). Full datetime is also valid: 2024-01-15T12:00:00+00:00. Using the correct format ensures crawlers parse it correctly." },
    { q: "Does priority in a sitemap affect Google ranking?", a: "Google has stated it mostly ignores the <priority> and <changefreq> elements because they're often set inaccurately. Focus on <loc> and <lastmod> as these are the most useful signals for crawlers." },
    { q: "Where do I submit my sitemap to Google?", a: "Submit your sitemap URL in Google Search Console under Indexing > Sitemaps. You can also reference it in your robots.txt file with a 'Sitemap: https://yourdomain.com/sitemap.xml' directive." },
  ],
  "/tools/spam-score-checker": [
    { q: "What is an email spam score?", a: "A spam score is a numerical rating that estimates the likelihood of an email being flagged as spam by inbox providers like Gmail, Outlook, and Yahoo. Tools like SpamAssassin use hundreds of rules to calculate this score. A score below 5 is generally safe." },
    { q: "What words trigger spam filters?", a: "Common spam triggers include: 'free', 'guaranteed', 'no risk', 'act now', 'click here', 'make money', excessive capitalization (ALL CAPS), multiple exclamation marks, and phrases like 'you have been selected'." },
    { q: "Why do my emails go to spam even without spam words?", a: "Spam filters look at more than just words. Other factors include low sender reputation, high bounce rates, no SPF/DKIM authentication, poor engagement history, sending to purchased lists, and missing unsubscribe links." },
    { q: "How do I improve email deliverability?", a: "Set up SPF, DKIM, and DMARC records, warm up new sender domains gradually, maintain a clean list by removing bounces and inactive subscribers, always include an unsubscribe link, and maintain a healthy sender reputation." },
    { q: "Does using 'free' in an email always trigger spam filters?", a: "Not always — context matters. 'Free shipping on orders over $50' in a transactional email from a trusted sender is usually fine. But 'FREE GIFT!!! Click now!!!' with multiple exclamation marks raises red flags." },
  ],
  "/tools/sql-formatter": [
    { q: "What does a SQL formatter do?", a: "A SQL formatter reformats SQL queries with consistent indentation, capitalized keywords, and aligned clauses, making them easier to read, review, and maintain." },
    { q: "Does formatting change the query behavior?", a: "No. SQL formatters only change whitespace and keyword casing. The logic, performance, and output of the query are identical." },
    { q: "Is my SQL safe to paste here?", a: "Yes. All processing happens entirely in your browser — nothing is sent to a server. You can safely paste queries containing sensitive table names, column names, or data." },
    { q: "Which SQL dialects are supported?", a: "This formatter works with standard SQL and most major dialects including PostgreSQL, MySQL, SQLite, SQL Server, and Oracle. The formatting is dialect-agnostic — keywords are capitalized and structure is indented consistently." },
  ],
  "/tools/subject-line-generator": [
    { q: "What makes a good email subject line?", a: "The best subject lines are specific, benefit-driven, and create curiosity or urgency without being clickbait. Keep them under 50 characters for mobile. Personalization (using the recipient's name or referencing their behavior) consistently improves open rates." },
    { q: "How long should an email subject line be?", a: "Aim for 30–50 characters. Most mobile email clients display around 30–40 characters before truncating. Desktop clients show more, but with mobile-first audiences, shorter wins. Preheader text (preview text) can carry the rest of the message." },
    { q: "What is preheader text?", a: "Preheader text (also called preview text) is the short summary that appears after the subject line in many email clients, in your inbox list view. It's a second chance to convince someone to open. Aim for 40–100 characters and treat it as a continuation of the subject line." },
    { q: "Should I use emojis in email subject lines?", a: "Used sparingly, emojis can boost open rates — they stand out visually in the inbox. Relevant emojis that reinforce the message work best. Avoid using emojis as the first character (some clients don't render them) and don't overuse them — it can look spammy." },
    { q: "Do spam trigger words in subject lines affect deliverability?", a: "Yes. Words like 'FREE!!!', 'GUARANTEED', 'ACT NOW', or excessive punctuation can trigger spam filters. Modern spam detection is more sophisticated than just keyword matching, but it's still good practice to avoid overtly salesy language." },
    { q: "What is a good email open rate?", a: "Average open rates vary by industry, but 20–40% is generally considered good for B2C email. B2B campaigns often see 20–30%. Rates above 40% are excellent. Factors include list quality, sender reputation, subject line, and send time." },
  ],
  "/tools/temp-gmail": [
    { q: "What is a disposable email address?", a: "A disposable email is a temporary inbox you can use for sign-ups, trials, or any situation where you don't want to give out your real email. It receives real emails but can be discarded at any time." },
    { q: "How long does the inbox last?", a: "Inboxes are session-based. If you reload without saving the address, the inbox is lost. Your session is saved automatically in your browser so you can refresh the page and return to the same inbox." },
    { q: "What is the Gmail dot trick?", a: "Gmail ignores dots in usernames — john.doe@gmail.com and johndoe@gmail.com deliver to the same inbox. You can use any dot variant to register on sites that check for duplicate emails." },
    { q: "What is the Gmail plus trick?", a: "Adding +anything after your Gmail username still delivers to your main inbox. john+spam@gmail.com reaches John's inbox. Use it to create Gmail filters and track who shares your address with advertisers." },
    { q: "Is my data private?", a: "The disposable inbox is not linked to your identity. However, anyone who knows the address can access it. Don't use it for sensitive communications." },
  ],
  "/tools/timezone-converter": [
    { q: "How does the timezone converter work?", a: "It uses the browser's built-in Intl.DateTimeFormat API, which knows the UTC offset for every IANA timezone — including daylight saving time adjustments. You enter a date and time in one timezone, and it automatically calculates the equivalent in any other timezone you add." },
    { q: "What is UTC?", a: "UTC (Coordinated Universal Time) is the world's primary time standard. All other timezones are defined as offsets from UTC — for example, New York is UTC-5 in winter and UTC-4 in summer (daylight saving time). UTC itself never changes for daylight saving." },
    { q: "Does this account for daylight saving time?", a: "Yes. The Intl API uses the full IANA timezone database, which includes all daylight saving time rules for every region. The conversion is always accurate for the specific date you choose — not just the current UTC offset." },
    { q: "What is an IANA timezone?", a: "IANA timezones are the standardized names used by operating systems, databases, and programming languages — like 'America/New_York' or 'Europe/London'. They're more precise than abbreviations like 'EST' (which can mean different things in different countries)." },
    { q: "Can I compare more than two timezones?", a: "Yes. Click 'Add Timezone' to add as many target timezones as you need. Each one shows the converted time, date, and UTC offset side by side." },
  ],
  "/tools/tweet-formatter": [
    { q: "What is a tweet thread?", a: "A tweet thread is a series of connected tweets from the same account. Each tweet in the thread is a reply to the previous one, creating a chain. Threads are used to share longer stories, explanations, or content that exceeds the 280-character limit." },
    { q: "How do I post a tweet thread?", a: "On Twitter/X, click the '+' button after typing your first tweet to add another tweet to the thread before posting. Alternatively, post the first tweet, then reply to it with the next tweet in the series. This tool helps you prepare all the text in advance." },
    { q: "What does the tweet numbering (1/5) mean?", a: "The format '1/5' means 'tweet 1 of 5 total'. This is a common convention to help readers know they're in a thread and how many tweets to expect. Our formatter automatically appends this numbering." },
    { q: "Can I remove the tweet numbers?", a: "The formatter adds tweet numbers (1/3, 2/3, etc.) by default since they're a standard thread convention. If you prefer no numbers, you can manually edit each tweet after copying." },
    { q: "What is the character limit for Twitter threads?", a: "Each individual tweet in a thread still has a 280-character limit. Twitter Blue / X Premium users have a 25,000-character limit per tweet. This formatter defaults to 280 characters, leaving 6 characters for the numbering (e.g., ' 3/10')." },
    { q: "Is there a limit to how many tweets a thread can have?", a: "Twitter doesn't publish a strict limit on thread length, but very long threads (25+ tweets) often see sharply declining engagement. For best results, keep threads to 5-15 tweets and make every tweet count." },
  ],
  "/tools/tweet-scheduler": [
    { q: "What are the best times to post on X?", a: "Studies show peak engagement on X is Tuesday–Thursday between 9 AM–3 PM in your audience's timezone. Wednesday at 9 AM and Tuesday at 9 AM are consistently top performers. Avoid weekends for B2B content." },
    { q: "How many tweets should I post per day?", a: "For most accounts, 1–3 tweets per day is the sweet spot. More than 5 per day can feel spammy. Quality beats quantity — one well-crafted tweet outperforms five mediocre ones." },
    { q: "Should I schedule tweets in advance?", a: "Yes. Scheduling lets you post during peak hours without being online, maintain consistency, and plan content around campaigns or events. Tools like Buffer, Hootsuite, or X's own scheduler handle the actual publishing." },
    { q: "What is a tweet thread and when should I use it?", a: "A thread is a series of connected tweets. Use threads for educational content, storytelling, or long-form insights that exceed 280 characters. Threads typically get higher engagement than single tweets." },
    { q: "Can I export my tweet schedule?", a: "Yes — use the Export CSV button to download your schedule as a spreadsheet. You can then import this into scheduling tools like Buffer, Hootsuite, or Sprout Social." },
  ],
  "/tools/url-encoder": [
    { q: "What is URL encoding?", a: "URL encoding (also called percent-encoding) converts characters that are not allowed in URLs into a safe format by replacing them with a % followed by two hexadecimal digits. For example, a space becomes %20 and & becomes %26." },
    { q: "When do I need to URL encode?", a: "You need to URL encode data when passing it as a query parameter or path segment in a URL. Characters like spaces, &, =, #, and ? have special meaning in URLs and must be encoded to be treated as data rather than URL structure." },
    { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURI encodes a full URL and preserves structural characters like /, ?, &, and =. encodeURIComponent encodes a single component (like a query value) and encodes those structural characters too. This tool uses encodeURIComponent, which is correct for encoding individual values." },
    { q: "Is this tool safe for sensitive data?", a: "Yes. All processing happens entirely in your browser. No data is sent to any server. You can safely use it with passwords, tokens, or private data." },
  ],
  "/tools/url-slug-generator": [
    { q: "What is a URL slug?", a: "A URL slug is the part of a URL that identifies a specific page in a human-readable format. For example, in 'example.com/best-seo-tools', the slug is 'best-seo-tools'. Good slugs are lowercase, use hyphens as separators, and directly reflect the page topic." },
    { q: "Why should I remove stop words from slugs?", a: "Stop words like 'the', 'a', 'and', 'of' add length without adding meaning for search engines. 'best-seo-tools' is better than 'the-best-seo-tools-for-everyone'. Shorter, cleaner slugs are easier to read, remember, and share. However, sometimes keeping stop words preserves meaning." },
    { q: "Should I use hyphens or underscores in URLs?", a: "Hyphens (-) are strongly preferred over underscores (_) by Google. Google treats hyphens as word separators, so 'seo-tools' is treated as two separate words. Underscores join words, so 'seo_tools' is treated as one word. Always use hyphens for new URLs." },
    { q: "How long should a URL slug be?", a: "Keep slugs concise — 3 to 5 meaningful words is ideal. Long slugs are hard to share and look spammy. Focus on the core keywords that represent the page. Avoid dates, numbers, or filler words in slugs when possible." },
    { q: "Should I change an existing URL slug?", a: "Only if necessary. Changing a URL breaks existing links and loses any SEO equity built up for that URL. If you must change it, always set up a 301 redirect from the old URL to the new one. Never just delete the old URL." },
  ],
  "/tools/username-generator": [
    { q: "What makes a good Twitter username?", a: "A good Twitter username (@handle) is short (under 15 characters), easy to remember, easy to spell, and ideally matches your real name or brand. Avoid numbers unless they're meaningful, excessive underscores, or anything that looks like spam." },
    { q: "What is the character limit for Twitter usernames?", a: "Twitter usernames (@handles) can be between 4 and 15 characters long. They can only contain letters (A-Z), numbers (0-9), and underscores (_). Spaces, special characters, and hyphens are not allowed." },
    { q: "Can I change my Twitter username?", a: "Yes, you can change your Twitter username at any time from Settings → Your Account → Account information → Username. Your old username immediately becomes available for others to claim." },
    { q: "How do I check if a Twitter username is available?", a: "Use our Account Checker tool to check if a Twitter account with that username exists. If it shows 'Not Found', the username may be available. You can also simply try registering it at twitter.com." },
    { q: "Should my Twitter username match my name or brand?", a: "Ideally yes — consistency across platforms makes you easier to find and more memorable. If your exact name is taken, try adding your niche keyword (e.g., @johndev, @sarahdesigns) or a professional suffix like @nameHQ." },
    { q: "Are numbers in Twitter usernames bad?", a: "Numbers like '99', '2k', or a graduation year can be acceptable if they mean something. Random numbers (like 'user4829271') look spammy. If your name is taken, try adding a meaningful word rather than random numbers." },
  ],
  "/tools/uuid-generator": [
    { q: "What is a UUID?", a: "A UUID (Universally Unique Identifier) is a 128-bit label used to uniquely identify information in computer systems. The standard format is 8-4-4-4-12 hexadecimal characters separated by hyphens, e.g. 550e8400-e29b-41d4-a716-446655440000." },
    { q: "What is UUID v4?", a: "UUID version 4 is randomly generated. It uses 122 random bits and 6 fixed bits to denote the version and variant. It is the most commonly used UUID version because it requires no coordination between systems and has an astronomically low collision probability." },
    { q: "Can UUIDs collide?", a: "Theoretically yes, but practically no. With UUID v4, the probability of generating two identical UUIDs is so low that you'd need to generate about 1 billion UUIDs per second for 85 years before having a 50% chance of a single collision." },
    { q: "Is it safe to use UUIDs as primary keys?", a: "Yes. UUIDs are widely used as database primary keys, especially in distributed systems where auto-incrementing integers would create conflicts across multiple nodes. The main tradeoff is that UUIDs are larger (16 bytes vs 4-8 bytes) and can reduce index performance at very large scale." },
  ],
  "/tools/x-account-checker": [
    { q: "Is the X Account Checker free?", a: "Yes, completely free with no signup required. Check up to 100 accounts per batch instantly." },
    { q: "How many accounts can I check at once?", a: "You can check up to 100 Twitter/X usernames in a single batch for free." },
    { q: "What data does the checker show?", a: "For each account the checker shows status (Active/Suspended/Deleted), follower count, following count, join date, verified badge, profile photo and display name." },
    { q: "Can I check if a Twitter account is suspended?", a: "Yes. The tool instantly shows whether each account is Active, Suspended, or Deleted." },
    { q: "Do I need a Twitter account or API key?", a: "No. The checker works without any Twitter login, API key, or credentials of any kind." },
    { q: "Can I check celebrity or verified accounts?", a: "Yes. The tool works for any public Twitter/X account including verified and high-follower accounts." },
  ],
  "/tools/yaml-json": [
    { q: "What is YAML?", a: "YAML (YAML Ain't Markup Language) is a human-readable data serialization format. It's widely used for configuration files — Docker Compose, Kubernetes, GitHub Actions, and many frameworks use YAML. It's easier to read than JSON because it uses indentation instead of braces and brackets." },
    { q: "When should I use YAML vs JSON?", a: "Use YAML for configuration files and human-edited data — it supports comments, is less verbose, and is easier to read. Use JSON for APIs, data interchange between systems, and machine-processed data — JSON has wider language support and stricter parsing." },
    { q: "Can YAML do everything JSON can?", a: "YAML is a superset of JSON — every valid JSON document is also valid YAML. YAML adds extras like comments (#), multi-line strings, anchors for reuse, and more flexible quoting. However, these extras don't have equivalents in JSON, so not all YAML can be losslessly round-tripped to JSON." },
    { q: "Is my data sent to a server?", a: "No. All conversions happen entirely in your browser using the js-yaml library. Your data never leaves your device. It's safe to use with private configuration files and sensitive data." },
    { q: "What errors can occur when converting?", a: "Common errors include invalid indentation in YAML (mixing tabs and spaces), duplicate keys, and incorrect JSON syntax (trailing commas, single quotes, unquoted keys). The converter shows the exact error message to help you debug." },
  ],
};

/**
 * Builds a FAQPage schema for pages that have FAQ content.
 * Google can show these as rich results (expandable Q&A) directly in search.
 */
function buildFaqSchema(path) {
  const faqs = PAGE_FAQS[path];
  if (!faqs || faqs.length === 0) return "";

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
  return jsonLdTag(faqPage);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Maps tool category → schema.org applicationCategory value.
 * Gives each tool the most accurate category for Google Rich Results.
 */
const CATEGORY_TO_APP_CATEGORY = {
  "social-media":    "SocialNetworkingApplication",
  "ai-writing":      "UtilitiesApplication",
  "text-formatting": "UtilitiesApplication",
  "developer":       "DeveloperApplication",
  "seo":             "BusinessApplication",
  "email":           "CommunicationApplication",
};

/**
 * Strips homepage-only JSON-LD blocks (WebApplication, ItemList) from the
 * template HTML so they don't appear on tool/static pages — only the homepage
 * should carry those schemas.
 */
function stripHomepageSchemas(html) {
  return html.replace(
    /<script type="application\/ld\+json">[\s\S]*?"@type":\s*"(?:WebApplication|ItemList)"[\s\S]*?<\/script>\n?/g,
    "",
  );
}

function jsonLdTag(obj) {
  return `    <script type="application/ld+json">\n    ${JSON.stringify(obj, null, 2)
    .split("\n")
    .join("\n    ")}\n    </script>`;
}

/**
 * Builds the ItemList + BreadcrumbList schemas for a category landing page.
 * Injected into static HTML so Google can read them without executing JavaScript.
 * For the email category, temp-mail sub-routes are included as additional items.
 */
function buildCategoryPageSchemas(categoryKey, categoryLabel, canonicalUrl) {
  const categoryTools = LIVE_TOOLS.filter((t) => t.category === categoryKey);

  const baseItems = categoryTools.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    url: `${SITE_URL}${t.href}`,
  }));

  const subRouteItems = categoryKey === "email"
    ? TEMP_MAIL_SUB_ROUTES.map((r, i) => ({
        "@type": "ListItem",
        position: categoryTools.length + i + 1,
        name: r.label,
        url: `${SITE_URL}${r.path}`,
      }))
    : [];

  const itemListElement = [...baseItems, ...subRouteItems];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Free ${categoryLabel} — X Toolkit`,
    description: `Free online ${categoryLabel.toLowerCase()} — no signup required.`,
    url: canonicalUrl,
    numberOfItems: itemListElement.length,
    itemListElement,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
      { "@type": "ListItem", position: 3, name: categoryLabel, item: canonicalUrl },
    ],
  };

  return [jsonLdTag(itemListSchema), jsonLdTag(breadcrumb)].join("\n");
}

/**
 * Builds the SoftwareApplication + BreadcrumbList schemas for a tool page.
 * All recommended properties are included to pass Google Rich Results Test.
 */
function buildToolSchema(tool, canonicalUrl) {
  const appCategory =
    CATEGORY_TO_APP_CATEGORY[tool.category] ?? "UtilitiesApplication";

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.label,
    url: canonicalUrl,
    description: tool.seoDescription || tool.description,
    applicationCategory: appCategory,
    operatingSystem: "Web",
    softwareVersion: "1.0",
    screenshot: `${SITE_URL}/opengraph.png`,
    author: {
      "@type": "Organization",
      name: "X Toolkit",
      url: SITE_URL + "/",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "X Toolkit", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "Tools", item: SITE_URL + "/tools" },
      { "@type": "ListItem", position: 3, name: tool.label, item: canonicalUrl },
    ],
  };

  return [jsonLdTag(softwareApp), jsonLdTag(breadcrumb)].join("\n");
}

function buildNoscript(page, tool) {
  if (page.isHomepage) {
    const toolLinks = LIVE_TOOLS.map(
      (t) =>
        `      <li><a href="${SITE_URL}${t.href}">${escapeHtml(t.label)}</a> — ${escapeHtml(t.seoDescription || t.description)}</li>`,
    ).join("\n");

    return `  <noscript>
    <div style="font-family:sans-serif;max-width:900px;margin:2rem auto;padding:1rem">
      <h1>X Toolkit — ${LIVE_TOOLS.length}+ Free Online Tools</h1>
      <p>${escapeHtml(page.description)}</p>
      <h2>All ${LIVE_TOOLS.length} Free Tools</h2>
      <ul>
${toolLinks}
      </ul>
      <p>
        <a href="${SITE_URL}/tools">Browse all tools</a> |
        <a href="${SITE_URL}/about">About</a> |
        <a href="${SITE_URL}/sitemap.xml">Sitemap</a>
      </p>
    </div>
  </noscript>`;
  }

  if (tool) {
    const relatedTools = LIVE_TOOLS.filter(
      (t) => t.category === tool.category && t.id !== tool.id,
    ).slice(0, 5);
    const relatedLinks = relatedTools
      .map((t) => `<a href="${SITE_URL}${t.href}">${escapeHtml(t.label)}</a>`)
      .join(", ");

    return `  <noscript>
    <div style="font-family:sans-serif;max-width:900px;margin:2rem auto;padding:1rem">
      <h1>${escapeHtml(tool.seoTitle || tool.label)}</h1>
      <p>${escapeHtml(tool.seoDescription || tool.description)}</p>
      ${relatedLinks ? `<p>Related tools: ${relatedLinks}</p>` : ""}
      <p><a href="${SITE_URL}/tools">Browse all ${LIVE_TOOLS.length} free tools</a></p>
    </div>
  </noscript>`;
  }

  return `  <noscript>
    <div style="font-family:sans-serif;max-width:900px;margin:2rem auto;padding:1rem">
      <h1>${escapeHtml(page.title)}</h1>
      <p>${escapeHtml(page.description)}</p>
      <p><a href="${SITE_URL}/tools">Browse all ${LIVE_TOOLS.length} free tools</a></p>
    </div>
  </noscript>`;
}

/**
 * Builds static HTML content for <div id="root"> so Google can index each
 * page's unique content without executing JavaScript. React's createRoot()
 * replaces this at runtime — no hydration mismatch risk.
 */
function buildRootContent(pageData, tool) {
  const { title, description, isHomepage } = pageData;

  if (isHomepage) {
    const toolLinks = LIVE_TOOLS.map(
      (t) =>
        `<li><a href="${SITE_URL}${t.href}">${escapeHtml(t.label)}</a> — ${escapeHtml(t.seoDescription || t.description)}</li>`,
    ).join("");
    return `<div style="font-family:system-ui,sans-serif;max-width:860px;margin:0 auto;padding:24px 20px">` +
      `<h1>X Toolkit — ${LIVE_TOOLS.length}+ Free Online Tools for X, SEO, Developers &amp; Creators</h1>` +
      `<p>${escapeHtml(description)}</p>` +
      `<h2>All ${LIVE_TOOLS.length} Free Tools</h2><ul>${toolLinks}</ul>` +
      `<p><a href="${SITE_URL}/tools">Browse all tools</a> | <a href="${SITE_URL}/about">About</a></p>` +
      `</div>`;
  }

  if (tool) {
    const related = LIVE_TOOLS
      .filter((t) => t.category === tool.category && t.id !== tool.id)
      .slice(0, 6)
      .map((t) => `<li><a href="${SITE_URL}${t.href}">${escapeHtml(t.label)}</a></li>`)
      .join("");
    return `<div style="font-family:system-ui,sans-serif;max-width:860px;margin:0 auto;padding:24px 20px">` +
      `<h1>${escapeHtml(tool.seoTitle || tool.label)}</h1>` +
      `<p>${escapeHtml(tool.seoDescription || tool.description)}</p>` +
      (related ? `<h2>Related Tools</h2><ul>${related}</ul>` : "") +
      `<p><a href="${SITE_URL}/tools">Browse all ${LIVE_TOOLS.length} free tools</a></p>` +
      `</div>`;
  }

  return `<div style="font-family:system-ui,sans-serif;max-width:860px;margin:0 auto;padding:24px 20px">` +
    `<h1>${escapeHtml(title)}</h1>` +
    `<p>${escapeHtml(description)}</p>` +
    `<p><a href="${SITE_URL}/tools">Browse all ${LIVE_TOOLS.length} free tools</a></p>` +
    `</div>`;
}

function generatePageHtml(template, { path, title, description, ogTitle, ogDescription, isHomepage, category, categoryKey, label }, tool) {
  const canonicalUrl = `${SITE_URL}${path}`;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeOgTitle = escapeHtml(ogTitle || title);
  const safeOgDesc = escapeHtml(ogDescription || description);

  // For non-homepage pages, strip the homepage-only schemas (WebApplication,
  // ItemList) so they don't pollute tool and static pages.
  let html = isHomepage ? template : stripHomepageSchemas(template);

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`);
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/,  `$1${safeDesc}$2`);
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/,  `$1${safeOgTitle}$2`);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/,  `$1${safeOgDesc}$2`);
  html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/,  `$1${canonicalUrl}$2`);
  html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,  `$1${safeTitle}$2`);
  html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,  `$1${safeDesc}$2`);
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/,  `$1${canonicalUrl}$2`);

  // Per-page keywords: inject from tool manifest's seoKeywords field so every
  // page gets unique keywords instead of the generic site-wide fallback.
  const pageKeywords = tool?.seoKeywords;
  if (pageKeywords) {
    html = html.replace(/(<meta\s+name="keywords"\s+content=")[^"]*(")/,  `$1${escapeHtml(pageKeywords)}$2`);
  }

  // Inject static content into <div id="root"> so Google indexes unique
  // content on every page without needing to execute JavaScript.
  const rootContent = buildRootContent({ path, title, description, isHomepage, category }, tool);
  html = html.replace('<div id="root"></div>', `<div id="root">${rootContent}</div>`);

  // Category pages get ItemList + BreadcrumbList.
  // Tool pages get SoftwareApplication + BreadcrumbList.
  // Homepage already has complete schemas from the template — no injection needed.
  let schemaBlock = "";
  if (categoryKey) {
    schemaBlock = buildCategoryPageSchemas(categoryKey, label, canonicalUrl);
  } else if (!isHomepage && (tool || category)) {
    schemaBlock = buildToolSchema(
      tool || { label: title, seoDescription: description, id: "", category },
      canonicalUrl,
    );
  }

  // FAQPage schema — injected for every route that has FAQ content defined.
  // Google can show these as rich results (expandable Q&A) in search.
  const faqSchema = buildFaqSchema(path);

  // Custom per-page schema (e.g. WebApplication for tempgmail)
  const customSchema = CUSTOM_PAGE_SCHEMAS[path] ? jsonLdTag(CUSTOM_PAGE_SCHEMAS[path]) : "";

  const noscriptBlock = buildNoscript({ path, title, description, isHomepage }, tool);
  const parts = [schemaBlock, customSchema, faqSchema, noscriptBlock].filter(Boolean);
  const injection = parts.join("\n");
  html = html.replace("</head>", `${injection}\n  </head>`);

  return html;
}

// Auto-generate sitemap-tools.xml from manifest

function generateSitemapTools() {
  const DEFAULT_PRIORITY = {
    Popular: 0.85,
    AI: 0.85,
    New: 0.75,
    undefined: 0.70,
  };

  const toolEntries = LIVE_TOOLS.map((t) => {
    const priority =
      t.sitemapPriority ??
      DEFAULT_PRIORITY[t.badge] ??
      0.70;
    return `  <url>
    <loc>${SITE_URL}${t.href}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${priority >= 0.90 ? "daily" : priority >= 0.80 ? "weekly" : "monthly"}</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>`;
  }).join("\n");

  const subRouteEntries = TEMP_MAIL_SUB_ROUTES.map((r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.sitemapPriority >= 0.90 ? "daily" : "weekly"}</changefreq>
    <priority>${r.sitemapPriority.toFixed(2)}</priority>
  </url>`).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  sitemap-tools.xml — auto-generated by prerender.mjs on each production build.
  Source of truth: src/lib/tools-manifest.json
  Last generated: ${TODAY}
  Total live tools: ${LIVE_TOOLS.length}
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${toolEntries}

${subRouteEntries}

</urlset>
`;
}

// Main

function main() {
  console.log(`🔍 Reading built index.html template…`);
  const template = readFileSync(join(DIST, "index.html"), "utf-8");

  let count = 0;

  // 1. Static pages
  for (const page of STATIC_PAGES) {
    const segments = page.path.split("/").filter(Boolean);
    const pageDir = segments.length > 0 ? join(DIST, ...segments) : null;
    let outputPath;
    if (pageDir) {
      mkdirSync(pageDir, { recursive: true });
      outputPath = join(pageDir, "index.html");
    } else {
      outputPath = join(DIST, "index.html"); // homepage overwrites root
    }
    writeFileSync(outputPath, generatePageHtml(template, page, null), "utf-8");
    console.log(`  ✅ ${page.path}`);
    count++;
  }

  // 2. Tool pages (from manifest — automatically picks up new tools)
  for (const tool of LIVE_TOOLS) {
    const segments = tool.href.split("/").filter(Boolean);
    const pageDir = join(DIST, ...segments);
    mkdirSync(pageDir, { recursive: true });
    const outputPath = join(pageDir, "index.html");
    const page = {
      path: tool.href,
      title: tool.seoTitle || `${tool.label} | X Toolkit`,
      description: tool.seoDescription || tool.description,
      ogTitle: tool.ogTitle,
      ogDescription: tool.ogDescription,
      category: tool.category,
    };
    writeFileSync(outputPath, generatePageHtml(template, page, tool), "utf-8");
    console.log(`  ✅ ${tool.href}`);
    count++;
  }

  // 3. Temp-mail sub-routes
  for (const sub of TEMP_MAIL_SUB_ROUTES) {
    const segments = sub.path.split("/").filter(Boolean);
    const pageDir = join(DIST, ...segments);
    mkdirSync(pageDir, { recursive: true });
    const outputPath = join(pageDir, "index.html");
    const page = { path: sub.path, title: sub.title, description: sub.description, ogTitle: sub.ogTitle, ogDescription: sub.ogDescription, category: sub.category };
    const fakeTool = { label: sub.label, seoTitle: sub.title, seoDescription: sub.description, seoKeywords: sub.seoKeywords, category: sub.category, id: sub.path };
    writeFileSync(outputPath, generatePageHtml(template, page, fakeTool), "utf-8");
    console.log(`  ✅ ${sub.path}`);
    count++;
  }

  // 4. Auto-generate sitemap-tools.xml
  const sitemapPath = join(DIST, "sitemap-tools.xml");
  writeFileSync(sitemapPath, generateSitemapTools(), "utf-8");
  console.log(`\n  📍 sitemap-tools.xml → ${LIVE_TOOLS.length} tools + ${TEMP_MAIL_SUB_ROUTES.length} sub-routes`);

  console.log(`\n🎉 Prerender complete: ${count} pages generated.`);
  console.log(`   Output: ${DIST}`);
  console.log(`\n💡 To add a new tool:`);
  console.log(`   1. Add entry to src/lib/tools-manifest.json`);
  console.log(`   2. Add icon to ICON_MAP in src/lib/tools-registry.ts`);
  console.log(`   Done — prerender + sitemap update automatically on next build.`);
}

main();
