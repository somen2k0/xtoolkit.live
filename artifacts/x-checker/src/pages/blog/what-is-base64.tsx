import { BlogLayout } from "@/components/layout/BlogLayout";
import { Binary, Code, Key, FileJson } from "lucide-react";

export default function WhatIsBase64() {
  return (
    <BlogLayout
      seoTitle="What Is Base64 Encoding? Complete Developer Guide (2026)"
      seoDescription="What is Base64 encoding? How it works, when to use it, common use cases in APIs and web development, and how to encode and decode Base64 strings online. 2026 guide."
      title="What Is Base64 Encoding? A Complete Developer Guide"
      description="Base64 encoding converts binary data to ASCII text for safe transmission. Here's how it works, where you'll encounter it, and when to use it in your own projects."
      icon={Binary}
      readTime="6 min read"
      publishDate="2026"
      category="Developer"
      relatedArticles={[
        { title: "What Is JSON-LD?", href: "/blog/what-is-json-ld", description: "Structured data markup for SEO explained.", readTime: "7 min" },
        { title: "What Is URL Encoding?", href: "/blog/url-encoding-guide", description: "How percent-encoding works in URLs.", readTime: "5 min" },
        { title: "What Is a UUID?", href: "/blog/what-is-uuid", description: "UUIDs explained: format, versions, and use cases.", readTime: "6 min" },
      ]}
      relatedTools={[
        { title: "Base64 Encoder / Decoder", href: "/tools/base64", description: "Encode or decode Base64 strings instantly in your browser.", icon: Binary },
        { title: "JWT Decoder", href: "/tools/jwt-decoder", description: "Decode and inspect JSON Web Tokens.", icon: Key },
        { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON instantly.", icon: FileJson },
        { title: "URL Encoder / Decoder", href: "/tools/url-encoder", description: "Percent-encode or decode URLs.", icon: Code },
      ]}
    >
      <h2>What Is Base64 Encoding?</h2>
      <p>
        Base64 is a binary-to-text encoding scheme that converts binary data (bytes) into a string of ASCII characters. The name comes from the fact that it uses 64 characters: A–Z, a–z, 0–9, and the symbols <code>+</code> and <code>/</code> (with <code>=</code> used for padding).
      </p>
      <p>
        The core purpose of Base64 is to allow binary data to be safely transmitted or stored in systems that only handle text. Many protocols and formats — HTTP, JSON, email (SMTP), XML — are designed for text and don't handle arbitrary binary bytes reliably. Base64 solves this by converting binary data into a format that contains only printable ASCII characters.
      </p>

      <h2>How Base64 Works</h2>
      <p>The encoding process is straightforward:</p>
      <ol>
        <li>Take the input binary data and convert it to a stream of bits.</li>
        <li>Group the bits into 6-bit chunks (since 2⁶ = 64, each 6-bit group maps to one of the 64 characters).</li>
        <li>Map each 6-bit group to its corresponding Base64 character using the Base64 alphabet.</li>
        <li>Pad the output with <code>=</code> characters to make the total length a multiple of 4.</li>
      </ol>
      <p>The result is approximately 33% larger than the original binary data (every 3 bytes of input produce 4 Base64 characters). This size overhead is the main tradeoff of Base64 encoding.</p>
      <p>For example, the string "Hello" encodes to <code>SGVsbG8=</code>. The <code>=</code> at the end is padding that makes the output length a multiple of 4.</p>

      <h2>Where You Encounter Base64</h2>
      <p>Base64 appears everywhere in modern software development:</p>
      <ul>
        <li><strong>HTTP Basic Authentication</strong> — credentials are sent as <code>Authorization: Basic {"{base64(username:password)}"}</code>. The credentials are encoded, not encrypted — Base64 is trivially reversible.</li>
        <li><strong>JSON Web Tokens (JWT)</strong> — the header and payload sections of a JWT are Base64URL-encoded (a URL-safe variant of Base64). This is why you can decode any JWT header and payload without a key.</li>
        <li><strong>Email attachments (MIME)</strong> — email protocols handle text, not binary. File attachments are Base64-encoded before being embedded in email messages.</li>
        <li><strong>Data URIs</strong> — images and other files can be embedded directly in HTML or CSS as <code>data:image/png;base64,{"{encoded data}"}</code>, avoiding a separate HTTP request.</li>
        <li><strong>API payloads</strong> — APIs that return binary data (PDFs, images, files) over JSON or XML use Base64 to encode the binary content into a string field.</li>
        <li><strong>Cryptographic keys and certificates</strong> — PEM format (used for SSL/TLS certificates and SSH keys) is Base64-encoded binary data with header and footer lines.</li>
        <li><strong>Environment variables</strong> — binary secrets (API keys, encryption keys) are sometimes Base64-encoded for storage in text-based configuration files and environment variables.</li>
      </ul>

      <h2>Base64 vs Base64URL</h2>
      <p>Standard Base64 uses <code>+</code> and <code>/</code> as the 62nd and 63rd characters. These characters have special meaning in URLs (<code>+</code> is a space, <code>/</code> is a path separator), so they can't be used safely in URLs without percent-encoding.</p>
      <p>Base64URL is a URL-safe variant that replaces <code>+</code> with <code>-</code> and <code>/</code> with <code>_</code>, and omits padding <code>=</code> characters. JWT uses Base64URL for this reason — the token can be safely included in URLs, HTTP headers, and query parameters without any additional encoding.</p>

      <h2>What Base64 Is NOT</h2>
      <p>A common misconception: <strong>Base64 is not encryption</strong>. It's encoding — a reversible transformation that anyone can decode in milliseconds without a key. Seeing Base64-encoded data in an HTTP request doesn't mean the data is protected in any way.</p>
      <p>HTTP Basic Auth (which Base64-encodes credentials) is fundamentally insecure over plain HTTP for exactly this reason — anyone who captures the traffic can decode the credentials immediately. Always use HTTPS when transmitting Base64-encoded credentials.</p>

      <h2>When to Use Base64</h2>
      <ul>
        <li><strong>Embedding binary data in text formats</strong> — JSON, XML, HTML — where you need to include file content as a string field.</li>
        <li><strong>Transmitting binary over text-only channels</strong> — email attachments, HTTP Basic Auth headers, SMS APIs.</li>
        <li><strong>Data URIs for small images</strong> — embedding small icons or logos directly in CSS reduces HTTP requests. For images over ~10KB, this increases page weight more than it saves in request overhead.</li>
        <li><strong>Storing binary data in text databases</strong> — some databases handle text better than binary blobs. Base64-encoding binary data for text storage is an option, though native binary support is usually better.</li>
      </ul>

      <h2>When NOT to Use Base64</h2>
      <ul>
        <li><strong>As a security measure</strong> — Base64 provides zero security. If you need to protect data, use actual encryption (AES, RSA, etc.).</li>
        <li><strong>For large files</strong> — the 33% size overhead makes Base64 inefficient for large binary files. Use multipart form uploads or presigned URLs for file uploads instead.</li>
        <li><strong>Instead of proper binary storage</strong> — if your database, API, or protocol supports binary data natively, use that instead of Base64.</li>
      </ul>

      <h2>How to Encode and Decode Base64 Online</h2>
      <p>Our <strong>Base64 Encoder / Decoder</strong> tool converts text or data to Base64 and back in your browser — no server required. Paste any text to encode it to Base64, or paste a Base64 string to decode it back. The tool handles both standard Base64 and Base64URL, and shows the character count so you can verify the expected ~33% size increase.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Is Base64 encoding the same as hashing?</strong><br />No. Base64 encoding is reversible — you can always decode Base64 back to the original data. Hashing (MD5, SHA-256, bcrypt) is a one-way function that cannot be reversed. Use Base64 for encoding, use hashing for verifying passwords and data integrity.</p>

      <p><strong>Why do Base64 strings sometimes end with == or =?</strong><br />The padding characters (=) ensure the Base64 output length is a multiple of 4. Since Base64 encodes 3 bytes at a time, if the input isn't a multiple of 3 bytes, one or two padding characters are added. One = means the last group had 2 bytes; == means the last group had 1 byte. Base64URL typically omits these padding characters.</p>

      <p><strong>Can Base64 handle Unicode or emoji?</strong><br />Base64 encodes bytes, not characters. To Base64-encode a Unicode string (including emoji), first encode the string as UTF-8 bytes, then Base64-encode those bytes. In JavaScript: <code>btoa(unescape(encodeURIComponent(str)))</code> handles this correctly. Our Base64 tool handles Unicode input automatically.</p>

      <p><strong>How do I identify Base64 in an API response?</strong><br />Base64 strings contain only A–Z, a–z, 0–9, +, /, and = (or - and _ for Base64URL). They're often found in fields named "data", "content", "image", or "file" in API responses. They frequently end with one or two = characters. The length is always a multiple of 4 (for standard Base64).</p>

      <p><strong>What is the maximum size of data that should be Base64-encoded?</strong><br />There's no technical limit, but practical performance degrades for large data. For images embedded in CSS as data URIs, the recommended maximum is 10–14KB (which becomes 13–19KB Base64-encoded). For API payloads, Base64-encoding files over 1MB adds significant processing overhead and should be replaced with direct file upload endpoints or cloud storage presigned URLs.</p>
    </BlogLayout>
  );
}
