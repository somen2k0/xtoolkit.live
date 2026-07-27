import { BlogLayout } from "@/components/layout/BlogLayout";
import { Mail, CheckCircle, AlertCircle, Shield } from "lucide-react";

export default function WhatToIncludeInEmailSignature() {
  return (
    <BlogLayout
      seoTitle="What to Include in a Professional Email Signature (2026 Guide)"
      seoDescription="A professional email signature has 5 required elements and 3 optional ones. See what to include, what to leave out, and how to build one free in under 2 minutes."
      title="What to Include in a Professional Email Signature — and What to Leave Out"
      description="Most email signatures are either too empty or too cluttered. Here's exactly what belongs in a professional signature, what doesn't, and how to build one that works across Gmail, Outlook, and Apple Mail."
      icon={Mail}
      readTime="6 min read"
      publishDate="July 2026"
      category="Email"
      relatedArticles={[
        { title: "Why Websites Ask for Email Verification", href: "/blog/why-websites-ask-email-verification", description: "The real reasons behind every 'please verify your email' prompt.", readTime: "4 min" },
        { title: "Email Subject Line Spam Words to Avoid", href: "/blog/email-spam-trigger-words", description: "The complete list of phrases that trigger spam filters.", readTime: "7 min" },
        { title: "Is Temp Mail Safe to Use?", href: "/blog/is-temp-mail-safe", description: "What disposable email protects against and when not to use it.", readTime: "4 min" },
      ]}
      relatedTools={[
        { title: "Email Signature Generator", href: "/tools/email-signature-generator", description: "Build a professional HTML email signature in under 2 minutes — free, no signup.", icon: Mail },
        { title: "Spam Score Checker", href: "/tools/spam-score-checker", description: "Check if your email content triggers spam filters before sending.", icon: AlertCircle },
        { title: "Email Validator", href: "/tools/email-validator", description: "Validate email address syntax and format instantly.", icon: CheckCircle },
        { title: "Masked Email Generator", href: "/tools/masked-email-generator", description: "Create email aliases to protect your real inbox.", icon: Shield },
      ]}
    >
      <h2>Why Your Email Signature Matters More Than You Think</h2>
      <p>
        Every email you send is a brand impression. If you're sending 20–50 emails a day, that's 20–50 opportunities to reinforce who you are and make it easy for people to reach you, find your work, or visit your site. A missing or sloppy signature is a missed opportunity every single time.
      </p>
      <p>
        But the opposite extreme — a 15-line signature with 8 social media icons, a headshot, a company logo, and an inspirational quote — creates visual clutter that recipients have learned to ignore. The best email signature is short, complete, and renders correctly in every email client.
      </p>

      <h2>The 5 Elements Every Professional Signature Needs</h2>

      <h3>1. Your Full Name</h3>
      <p>
        Use your full name as you'd want it to appear in someone's contacts — first and last. If you go by a preferred name or nickname professionally, use that. Avoid initials only, titles attached to names ("Dr. Jane Smith" is fine in medical/academic contexts but unusual in most businesses), or aliases that don't match your email address.
      </p>

      <h3>2. Your Job Title and Company Name</h3>
      <p>
        These two pieces together answer the question: "Who am I talking to?" Give the recipient enough context to understand your role without having to look you up.
      </p>
      <ul>
        <li>If you're a freelancer or solopreneur: use "Freelance [Specialty]" or "[Your Name] — [What You Do]"</li>
        <li>If you're at a company: "Product Manager at Acme Corp" or "Product Manager | Acme Corp"</li>
        <li>Avoid made-up titles like "Chief Happiness Officer" in formal contexts — they undermine credibility with people who don't know you</li>
      </ul>

      <h3>3. A Primary Contact Method</h3>
      <p>
        Your email address is already in the From field, so repeating it in the signature is redundant — unless you want people to contact a different address for specific purposes. What's more useful:
      </p>
      <ul>
        <li>A phone number, if you take calls for business</li>
        <li>A scheduling link (Calendly, Cal.com) if you have meetings regularly</li>
        <li>A WhatsApp or Telegram link if your industry communicates that way</li>
      </ul>
      <p>
        Include exactly one primary contact method beyond email. More than one creates choice paralysis.
      </p>

      <h3>4. A Website or Portfolio Link</h3>
      <p>
        One URL. Link to your professional website, LinkedIn profile, portfolio, or the most relevant page for your context. If you have a personal site and a LinkedIn, pick the one that best represents your professional work to this particular audience.
      </p>
      <p>
        Format it as a proper hyperlink with descriptive anchor text: "Website" or "Portfolio" — not a raw URL like <code>https://yoursite.com/about-me/projects/2026</code> that wraps across three lines.
      </p>

      <h3>5. Your Company Logo or Headshot (Optional but Recommended)</h3>
      <p>
        A small logo (120–200px wide) or a professional headshot significantly increases recognition and recall. Emails with a photo see higher response rates because they feel more personal and less like mass mail.
      </p>
      <p>
        Requirements for images in signatures: use a hosted URL (not an attachment), keep file size under 50KB, and always include alt text so it renders gracefully when images are blocked.
      </p>

      <h2>Optional Elements (Include Only If Relevant)</h2>

      <h3>Social Media Links</h3>
      <p>
        Include social links only if they're active, professional, and relevant to your work. A Twitter/X handle where you post industry content is worth including. A Facebook profile you haven't updated in 3 years is not.
      </p>
      <p>
        Maximum 2–3 social links. Use small recognizable icons (16–20px) rather than spelling out full URLs. Place them on a single line below your contact information.
      </p>

      <h3>A Legal Disclaimer</h3>
      <p>
        Required in specific industries: legal (attorney-client privilege disclaimers), healthcare (HIPAA), finance (regulatory disclosures). If your industry doesn't require it, don't add one — they add length without value and feel like legal boilerplate.
      </p>

      <h3>A Current Promotion or Announcement</h3>
      <p>
        One line maximum: "Now accepting new clients for Q4" or "New: [Product name] is live." This is a low-effort way to surface relevant information in every email you send. Update it when circumstances change — a promotion that expired 6 months ago damages credibility.
      </p>

      <h2>What to Leave Out</h2>

      <p>
        These elements commonly appear in email signatures but actively hurt rather than help:
      </p>
      <ul>
        <li>
          <strong>Inspirational quotes</strong> — "Be the change you wish to see in the world" appended to a billing email is jarring, not inspiring. Save quotes for social media.
        </li>
        <li>
          <strong>Multiple phone numbers</strong> — Office line, mobile, fax, WhatsApp — choose one primary number. Multiple options confuse rather than help.
        </li>
        <li>
          <strong>Your email address</strong> — It's already visible in the From field and in the email header. Repeating it in the signature adds clutter.
        </li>
        <li>
          <strong>Animated GIFs or banner ads</strong> — These fail to render in many email clients and make your signature look like spam.
        </li>
        <li>
          <strong>"Sent from my iPhone"</strong> — Remove the default mobile signature on your device settings. It signals you didn't bother to customize your setup.
        </li>
        <li>
          <strong>Every social media platform you have an account on</strong> — TikTok, Pinterest, Snapchat, Mastodon, Threads, X, Instagram, LinkedIn — pick 1–2 that are professionally relevant.
        </li>
        <li>
          <strong>Personal information</strong> — Your birthday, astrology sign, pronouns (unless professionally relevant in your context), or relationship status have no place in a professional signature.
        </li>
      </ul>

      <h2>Technical Requirements for Email Signatures</h2>
      <p>
        Email clients are the most inconsistent rendering environments on the web. What looks great in Gmail's compose window may break in Outlook 2019 or Apple Mail. The rules for reliable rendering:
      </p>
      <ul>
        <li><strong>Use table-based layout</strong> — CSS Flexbox and Grid don't render correctly in most desktop email clients. Tables are the reliable baseline.</li>
        <li><strong>Inline all CSS</strong> — Style attributes on individual elements only. External stylesheets are stripped by email clients.</li>
        <li><strong>Max width: 600px</strong> — Signatures wider than 600px break on mobile and in narrow email panes.</li>
        <li><strong>Host images externally</strong> — Embedded image attachments bloat file size and are often blocked. Host images on a public URL and reference them in the <code>src</code> attribute.</li>
        <li><strong>Always include alt text</strong> — Many email clients block images by default. Alt text ensures the signature still communicates when images don't load.</li>
        <li><strong>Test in multiple clients</strong> — At minimum: Gmail (web), Outlook, and Apple Mail cover 80%+ of email clients in use.</li>
      </ul>

      <h2>Build Your Signature Free in Under 2 Minutes</h2>
      <p>
        The technical requirements above make writing a signature HTML from scratch tedious. Use the free <a href="/tools/email-signature-generator">Email Signature Generator</a> on X Toolkit instead:
      </p>
      <ol>
        <li>Go to <a href="/tools/email-signature-generator">xtoolkit.live/tools/email-signature-generator</a> — no account required.</li>
        <li>Enter your name, title, company, contact info, and website.</li>
        <li>Choose a layout and color scheme.</li>
        <li>Copy the generated HTML code.</li>
        <li>Paste it into your email client's signature settings: Gmail Settings → See All Settings → General → Signature → Create new → paste HTML.</li>
      </ol>
      <p>
        The generator produces table-based, inline-CSS HTML that renders correctly across Gmail, Outlook, Apple Mail, Yahoo Mail, and Thunderbird. No coding required.
      </p>
    </BlogLayout>
  );
}
