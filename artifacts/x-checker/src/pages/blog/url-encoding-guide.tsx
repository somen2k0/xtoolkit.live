import { BlogLayout } from "@/components/layout/BlogLayout";
import { Link, Code, Globe, Search } from "lucide-react";

export default function UrlEncodingGuide() {
  return (
    <BlogLayout
      seoTitle="URL Encoding Guide — What Is Percent Encoding and How It Works (2026)"
      seoDescription="What is URL encoding (percent encoding)? How it works, which characters must be encoded, common examples and how to encode and decode URLs online. 2026 guide."
      title="URL Encoding Guide — What Is Percent Encoding and How It Works"
      description="URL encoding converts unsafe characters into percent-escaped sequences for safe use in URLs. Here's how it works, which characters need encoding, and when to use it."
      icon={Link}
      readTime="5 min read"
      publishDate="May 2026"
      category="Developer"
      relatedArticles={[
        { title: "What Is Base64?", href: "/blog/what-is-base64", description: "Base64 encoding explained for developers.", readTime: "6 min" },
        { title: "What Is JSON-LD?", href: "/blog/what-is-json-ld", description: "Structured data markup for SEO explained.", readTime: "7 min" },
        { title: "What Is a UUID?", href: "/blog/what-is-uuid", description: "UUIDs explained: format, versions, and use cases.", readTime: "6 min" },
      ]}
      relatedTools={[
        { title: "URL Encoder / Decoder", href: "/tools/url-encoder", description: "Encode or decode URLs and query parameters instantly.", icon: Link },
        { title: "Base64 Encoder", href: "/tools/base64", description: "Encode and decode Base64 strings.", icon: Code },
        { title: "Meta Tag Generator", href: "/tools/meta-tag-generator", description: "Generate SEO meta tags with correct canonical URLs.", icon: Globe },
        { title: "Sitemap Validator", href: "/tools/sitemap-validator", description: "Validate XML sitemaps including URL encoding.", icon: Search },
      ]}
    >
      <h2>What Is URL Encoding?</h2>
      <p>
        URL encoding (also called <strong>percent encoding</strong>) is a mechanism for converting characters that are not allowed or have special meaning in URLs into a safe format that can be transmitted over the internet. It replaces unsafe characters with a percent sign (<code>%</code>) followed by the character's two-digit hexadecimal ASCII code.
      </p>
      <p>
        For example, a space character (ASCII 32, hex 20) becomes <code>%20</code>. An ampersand (ASCII 38, hex 26) becomes <code>%26</code>. The result is a URL that contains only the characters that are universally safe for internet transmission.
      </p>

      <h2>Why URL Encoding Is Necessary</h2>
      <p>URLs can only safely contain a specific subset of ASCII characters. The full URL specification (RFC 3986) defines which characters are "unreserved" (always safe) and which are "reserved" (have special meaning in URLs or must be encoded when used as data).</p>
      <p><strong>Unreserved characters</strong> (always safe, never need encoding): A–Z, a–z, 0–9, <code>-</code>, <code>_</code>, <code>.</code>, <code>~</code></p>
      <p><strong>Reserved characters</strong> (have special URL meaning — must be encoded when used as data): <code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code></p>
      <p><strong>Characters that must always be encoded</strong>: spaces and any non-ASCII characters (including all Unicode characters, emoji, and non-Latin scripts).</p>

      <h2>Common Percent-Encoded Characters</h2>
      <p>These are the characters you'll encounter most frequently in URL encoding:</p>
      <ul>
        <li>Space → <code>%20</code> (or <code>+</code> in query strings)</li>
        <li><code>&amp;</code> → <code>%26</code></li>
        <li><code>=</code> → <code>%3D</code></li>
        <li><code>+</code> → <code>%2B</code></li>
        <li><code>/</code> → <code>%2F</code></li>
        <li><code>?</code> → <code>%3F</code></li>
        <li><code>#</code> → <code>%23</code></li>
        <li><code>@</code> → <code>%40</code></li>
        <li><code>:</code> → <code>%3A</code></li>
        <li><code>%</code> → <code>%25</code></li>
      </ul>

      <h2>URL Encoding vs Query String Encoding</h2>
      <p>There are two slightly different encoding contexts that trip up many developers:</p>
      <p><strong>Full URL encoding</strong> (<code>encodeURI</code> in JavaScript) — encodes a complete URL, preserving characters that have structural meaning in URLs (<code>:</code>, <code>/</code>, <code>?</code>, <code>&amp;</code>, <code>#</code>). Use this when encoding an entire URL.</p>
      <p><strong>Query parameter encoding</strong> (<code>encodeURIComponent</code> in JavaScript) — encodes a single query parameter value, encoding ALL special characters including <code>/</code>, <code>?</code>, <code>&amp;</code>, and <code>=</code>. Use this when encoding individual query parameter values before appending them to a URL.</p>
      <p>This distinction is important: if you URL-encode a complete URL with <code>encodeURIComponent</code>, you'll encode the <code>://</code>, <code>/</code>, and <code>?</code> characters that should be preserved as structural URL syntax, producing a broken URL.</p>

      <h2>Space Encoding: %20 vs +</h2>
      <p>Spaces can be encoded two ways, and they're not interchangeable:</p>
      <ul>
        <li><code>%20</code> — the standard percent-encoding of a space character. Valid everywhere in URLs.</li>
        <li><code>+</code> — a space replacement valid only in <code>application/x-www-form-urlencoded</code> query strings (HTML form submissions). Not valid in the path portion of a URL.</li>
      </ul>
      <p>When building API requests with query parameters, use <code>%20</code> (via <code>encodeURIComponent</code>) for spaces, not <code>+</code>. The <code>+</code> encoding is a legacy convention from HTML form submissions that causes bugs when used in other URL contexts.</p>

      <h2>Non-ASCII and Unicode in URLs</h2>
      <p>URLs technically only support ASCII characters. To include non-ASCII characters (like accented letters, Chinese/Japanese/Korean characters, Arabic script, or emoji), they must be encoded. The process:</p>
      <ol>
        <li>Encode the character as UTF-8 bytes (most Unicode characters encode to 2–4 bytes).</li>
        <li>Percent-encode each byte individually.</li>
      </ol>
      <p>For example, the Japanese character 日 (Unicode U+65E5) encodes as the UTF-8 bytes <code>E6 97 A5</code>, which becomes <code>%E6%97%A5</code> in a URL. Modern browsers handle this encoding automatically when you type or paste a non-ASCII URL, but API code needs to do it explicitly.</p>
      <p>Internationalized Domain Names (IDN) — domain names in non-Latin scripts — use Punycode encoding rather than percent encoding. For example, the Arabic domain مثال.إختبار becomes <code>xn--mgbh0fb.xn--kgbechtv</code> in Punycode.</p>

      <h2>Double Encoding</h2>
      <p>Double encoding is a common bug where data that's already percent-encoded gets encoded again. For example: a space becomes <code>%20</code>, then the <code>%</code> itself gets encoded to <code>%25</code>, resulting in <code>%2520</code>. The server or API then decodes <code>%2520</code> to <code>%20</code> instead of a space.</p>
      <p>Always check whether incoming data is already encoded before encoding it again. Our URL Encoder/Decoder handles this gracefully — decode first, then re-encode if needed.</p>

      <h2>URL Encoding in Different Contexts</h2>
      <ul>
        <li><strong>JavaScript:</strong> Use <code>encodeURIComponent()</code> for query parameter values, <code>encodeURI()</code> for full URLs. The <code>URLSearchParams</code> API handles encoding automatically for query strings.</li>
        <li><strong>Python:</strong> Use <code>urllib.parse.quote()</code> for path components, <code>urllib.parse.urlencode()</code> for query strings, or <code>requests</code> library which handles encoding automatically.</li>
        <li><strong>cURL:</strong> Use <code>--data-urlencode</code> to automatically encode form data, or <code>-G</code> with <code>--data-urlencode</code> for query string parameters.</li>
        <li><strong>Postman:</strong> The URL bar encodes special characters automatically. For query params, use the Params tab which handles encoding correctly.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <p><strong>What is the difference between URL encoding and HTML encoding?</strong><br />URL encoding (percent encoding) converts characters for safe use in URLs. HTML encoding (HTML entity encoding) converts characters for safe use in HTML — for example, <code>&lt;</code> becomes <code>&amp;lt;</code> and <code>&amp;</code> becomes <code>&amp;amp;</code>. They serve different purposes: URL encoding is for URLs, HTML encoding is for HTML content. Never confuse them — using HTML encoding in a URL, or URL encoding in HTML, produces incorrect results.</p>

      <p><strong>Why does a URL with spaces work in my browser but break in my code?</strong><br />Browsers automatically encode spaces and other unsafe characters when you type or paste a URL into the address bar. Your code doesn't — you need to explicitly encode URL components before constructing the final URL string. Always use your language's URL encoding functions rather than string concatenation when building URLs programmatically.</p>

      <p><strong>Can I use emoji in URLs?</strong><br />Technically yes, via percent encoding. The emoji 🚀 (U+1F680) encodes as <code>%F0%9F%9A%80</code> in a URL. Most modern browsers and many APIs support emoji in URLs, but some older systems and proxies may not handle them correctly. For maximum compatibility, stick to ASCII characters in URLs when possible.</p>

      <p><strong>What does %2F mean in a URL and why does it matter?</strong><br /><code>%2F</code> is a percent-encoded forward slash (<code>/</code>). Forward slashes have special meaning in URL paths (they separate path segments), so if you need a literal slash in a query parameter value or path segment, you must encode it as <code>%2F</code>. Some web servers are configured to reject requests with <code>%2F</code> in the path for security reasons (path traversal prevention), so prefer avoiding slashes in parameter values when possible.</p>

      <p><strong>How do I decode a percent-encoded URL to readable text?</strong><br />Our URL Encoder/Decoder tool decodes percent-encoded URLs instantly in your browser — paste any URL with <code>%XX</code> sequences and click Decode to see the human-readable version. In JavaScript, use <code>decodeURIComponent()</code> for query parameter values or <code>decodeURI()</code> for complete URLs. In Python, use <code>urllib.parse.unquote()</code>.</p>
    </BlogLayout>
  );
}
