import { BlogLayout } from "@/components/layout/BlogLayout";
import { QrCode, Scan, Link, Shield } from "lucide-react";

export default function WhatIsAQrCode() {
  return (
    <BlogLayout
      seoTitle="What Is a QR Code? How They Work and When to Use Them (2026)"
      seoDescription="QR codes explained: how they store data, error correction levels, static vs dynamic QR codes, QRishing security risks, and how to generate one free online."
      title="What Is a QR Code? How They Work and When to Use Them"
      description="QR codes store URLs, contacts, WiFi credentials, and more in a scannable square. Here's how they work, what the different parts do, and when to use static vs dynamic codes."
      icon={QrCode}
      readTime="7 min read"
      publishDate="July 2026"
      category="Developer"
      relatedArticles={[
        { title: "URL Encoding Guide", href: "/blog/url-encoding-guide", description: "How percent-encoding works in URLs — commonly embedded in QR codes.", readTime: "5 min" },
        { title: "What Is Base64?", href: "/blog/what-is-base64", description: "Base64 encoding explained for developers.", readTime: "6 min" },
        { title: "What Is JSON-LD?", href: "/blog/what-is-json-ld", description: "Structured data for SEO — complements QR code landing pages.", readTime: "7 min" },
      ]}
      relatedTools={[
        { title: "QR Code Generator", href: "/tools/qr-code-generator", description: "Generate QR codes for URLs, text, WiFi, and more — free.", icon: QrCode },
        { title: "URL Encoder / Decoder", href: "/tools/url-encoder", description: "Encode URLs for safe embedding in QR codes.", icon: Link },
        { title: "URL Slug Generator", href: "/tools/url-slug-generator", description: "Create short, clean URLs ideal for QR codes.", icon: Scan },
      ]}
    >
      <h2>What Is a QR Code?</h2>
      <p>A <strong>QR code</strong> (Quick Response code) is a two-dimensional barcode that stores data as a pattern of black and white squares arranged in a grid. Unlike a traditional 1D barcode that only encodes data horizontally, a QR code encodes data in both dimensions, allowing it to store significantly more information in a smaller space. Any smartphone camera — or a dedicated barcode scanner — can read a QR code in under a second.</p>
      <p>QR codes were invented in 1994 by Denso Wave, a Japanese automotive manufacturer, to track vehicle components during manufacturing. The format was designed to be scanned quickly in any orientation — hence the name "Quick Response." Today they're used everywhere: restaurant menus, product packaging, event tickets, contactless payments, business cards, and authentication flows.</p>

      <h2>How QR Codes Store Data</h2>
      <p>A QR code encodes data as a binary string using one of four encoding modes:</p>
      <ul>
        <li><strong>Numeric mode</strong> — digits 0–9 only. Most efficient for pure numbers. Stores up to 7,089 characters.</li>
        <li><strong>Alphanumeric mode</strong> — uppercase A–Z, digits 0–9, and 9 special characters (space, <code>$ % * + - . / :</code>). Stores up to 4,296 characters.</li>
        <li><strong>Byte mode</strong> — any ISO 8859-1 character, effectively the Latin character set including all URL characters, symbols, and punctuation. Most commonly used for URLs. Stores up to 2,953 characters.</li>
        <li><strong>Kanji mode</strong> — Japanese and Chinese characters encoded in Shift JIS. Stores up to 1,817 characters.</li>
      </ul>
      <p>URLs use byte mode. The encoded data is converted to a binary stream, then arranged into the square pattern following the QR standard's placement rules. The pattern also includes structural elements that tell the scanner where the code starts, what version (size) it is, and how to correct for errors.</p>

      <h2>QR Code Structure: The Parts Explained</h2>
      <p>A QR code isn't just random squares — every region serves a specific function:</p>
      <ul>
        <li><strong>Finder patterns</strong> — the three large square-within-square symbols in three corners (top-left, top-right, bottom-left). The scanner uses these to locate the code, determine its size and orientation, and correct for skew. They must never be covered.</li>
        <li><strong>Timing patterns</strong> — alternating black and white modules forming lines between the finder patterns. They help the scanner determine grid spacing when the image is distorted or photographed at an angle.</li>
        <li><strong>Alignment patterns</strong> — smaller squares present in larger QR codes that help correct for perspective distortion during scanning.</li>
        <li><strong>Format information</strong> — strips adjacent to the finder patterns that encode the error correction level and mask pattern used, so the scanner knows how to decode the data region.</li>
        <li><strong>Quiet zone</strong> — the white border surrounding the code. Scanners need this margin to distinguish the code from surrounding content. Without it, scan reliability drops significantly. The minimum quiet zone is 4 module widths on all sides.</li>
        <li><strong>Data modules</strong> — the remaining squares, which encode the actual payload along with error correction data.</li>
      </ul>

      <h2>Error Correction: Why QR Codes Work When Damaged</h2>
      <p>One of QR codes' most useful properties is that they still scan correctly even when part of the code is obscured or damaged. This is achieved through <strong>Reed-Solomon error correction</strong> — the same mathematical technique used in CDs, DVDs, and space probe communications to recover data from corrupted signals.</p>
      <p>QR codes come in four error correction levels:</p>
      <ul>
        <li><strong>Level L (Low)</strong> — recovers up to 7% of data. Smallest code size. Use when the code will be printed cleanly and handled carefully.</li>
        <li><strong>Level M (Medium)</strong> — recovers up to 15%. Good general-purpose default for most printed applications.</li>
        <li><strong>Level Q (Quartile)</strong> — recovers up to 25%. Use when printing on surfaces that might get dirty, wet, or worn over time.</li>
        <li><strong>Level H (High)</strong> — recovers up to 30% of data. Largest code (most complex pattern), but scans even when significantly damaged or when a logo is overlaid on the center. Use for marketing materials with an embedded brand logo.</li>
      </ul>
      <p>Higher error correction means more redundant data, which means a larger, more complex code for the same content. For a standard URL on a clean printed surface, Level M is the right balance. For codes on curved surfaces, outdoor environments, or with logo overlays, use Level H.</p>

      <h2>Static vs Dynamic QR Codes</h2>
      <p>This distinction has significant practical implications:</p>
      <ul>
        <li>
          <strong>Static QR codes</strong> encode the destination directly in the code's pattern. The URL (or other data) is baked in at creation time and cannot be changed. If you want to update where the code leads, you have to generate and reprint it. Static codes have no tracking, no ongoing cost, and work indefinitely as long as the destination URL remains live.
        </li>
        <li>
          <strong>Dynamic QR codes</strong> encode a short redirect URL hosted by the QR code service. The actual destination can be updated at any time without changing the physical code. Dynamic codes also provide scan analytics: how many times scanned, when, from what devices, and from what locations. They require a paid subscription to the hosting service to keep working.
        </li>
      </ul>
      <p>Use static codes for permanent, public-facing content — a website link on a business card, a WiFi password at home, a contact card. Use dynamic codes for marketing campaigns, printed materials where the destination might change, and anywhere you need to measure scan performance after printing.</p>

      <h2>What QR Codes Can Encode</h2>
      <p>Beyond URLs, QR codes can encode several data types that smartphones recognize and act on automatically:</p>
      <ul>
        <li><strong>URL</strong> — the most common. Opens directly in the browser. Keep URLs as short as possible for simpler, easier-to-scan codes.</li>
        <li><strong>WiFi credentials</strong> — format: <code>WIFI:T:WPA;S:NetworkName;P:Password;;</code>. iOS and Android prompt to join the network automatically on scan.</li>
        <li><strong>vCard / contact information</strong> — opens an "Add Contact" prompt with name, phone, email, and address pre-filled.</li>
        <li><strong>Email</strong> — pre-fills the To field, and optionally subject and body: <code>mailto:name@example.com?subject=Hello</code></li>
        <li><strong>SMS</strong> — pre-fills a text message to a specified phone number.</li>
        <li><strong>Plain text</strong> — displays text directly on screen after scanning, with no app action triggered.</li>
        <li><strong>App store links</strong> — direct deep links to iOS App Store or Google Play listings.</li>
        <li><strong>Payment</strong> — many payment apps (PayPal, Venmo, UPI in India) encode their payment URLs in QR codes for contactless transfers.</li>
      </ul>

      <h2>QR Code Security Risks: QRishing</h2>
      <p><strong>QRishing</strong> (QR code phishing) is a growing attack where malicious actors replace legitimate QR codes — typically by placing a sticker over the original — with codes pointing to phishing sites, malware downloads, or fake login pages. Since humans can't read QR code patterns visually, the destination is only revealed after scanning, making it harder to spot than a suspicious-looking URL.</p>
      <p>Protect yourself when scanning unfamiliar QR codes:</p>
      <ul>
        <li><strong>Check the URL preview before opening it.</strong> Modern phone cameras show a preview of the destination URL before launching the browser. Read it before tapping. If the URL looks like a random string or an unfamiliar domain, don't proceed.</li>
        <li><strong>Be suspicious of physical tampering.</strong> A sticker placed over an existing QR code in a public place — a parking meter, restaurant table, store window — is one of the most common attack vectors. Inspect the code before scanning.</li>
        <li><strong>Look for HTTPS.</strong> Legitimate services use HTTPS. A QR code leading to an HTTP URL for anything involving login or payment is a red flag.</li>
        <li><strong>Don't scan codes that promise unexpected rewards.</strong> "Scan to claim your prize" codes in unsolicited emails, packages, or flyers are almost always phishing attempts.</li>
      </ul>

      <h2>How to Create a QR Code</h2>
      <p>Use our free <a href="/tools/qr-code-generator"><strong>QR Code Generator</strong></a> to create QR codes for URLs, text, WiFi credentials, and more. Select your content type, enter the data, choose an error correction level, and download as PNG or SVG. SVG format is best for print materials because it scales to any size without pixelation — a QR code that looks sharp on a business card will look equally sharp on a banner. PNG is fine for digital use. Both formats are generated entirely in your browser — no data is sent to a server.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>What is the maximum amount of data a QR code can store?</strong><br />At the lowest error correction (Level L) with numeric-only data, a QR code can hold up to 7,089 digits. For general text (byte mode) at Level L, the maximum is 2,953 characters. For URLs in practice, keeping the encoded URL under 300 characters gives you a simpler, easier-to-scan code — shorter URLs always produce smaller, more reliable patterns.</p>

      <p><strong>Why do some QR codes have a logo in the middle?</strong><br />A logo can be placed over the center because error correction rebuilds missing data. Using Level H error correction (30% recovery), up to 30% of the code can be obscured and it will still scan correctly — enough to cover a reasonably sized logo. The finder patterns in the three corners must never be covered, but the central data region can tolerate significant obstruction at Level H.</p>

      <p><strong>Can a QR code expire?</strong><br />Static QR codes never expire — they encode data directly and work as long as the destination URL or data remains valid. Dynamic QR codes rely on a redirect service, which typically requires a paid subscription. If the subscription lapses or the service shuts down, the short URL inside the code stops resolving and the code effectively breaks. This is the primary risk of dynamic codes for long-term use.</p>

      <p><strong>What size should a QR code be when printed?</strong><br />The minimum recommended print size is 2cm × 2cm (about 0.8 inches square) for close-range scanning. For outdoor placements where scanning happens from a distance, scale up proportionally: a code meant to be scanned from 1 meter should be at least 10cm × 10cm. Always preserve the quiet zone — at minimum 4 modules wide on all sides. Cutting into the quiet zone is one of the most common causes of scan failure in printed materials.</p>

      <p><strong>Do QR codes work in all lighting conditions?</strong><br />QR code scanners need sufficient contrast between the dark modules and the light background. Standard black-on-white codes work in most lighting. Low-contrast codes (dark-on-dark or light-on-light) fail to scan. White-on-black (inverted) codes work on modern scanners but not all older readers. Avoid printing on reflective glossy surfaces without a matte finish, as glare creates bright spots that confuse the scanner's pattern recognition.</p>
    </BlogLayout>
  );
}
