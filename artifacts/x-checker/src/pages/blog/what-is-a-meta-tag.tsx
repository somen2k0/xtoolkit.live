import { BlogLayout } from "@/components/layout/BlogLayout";
import { Tag, Code, Globe, Search } from "lucide-react";

export default function WhatIsAMetaTag() {
  return (
    <BlogLayout
      seoTitle="What Is a Meta Tag? HTML Meta Tags for SEO Explained (2026)"
      seoDescription="Meta tags explained: title tags, meta descriptions, robots directives, canonical URLs, Open Graph, and Twitter Cards. Which ones matter for SEO and how to get them right."
      title="What Is a Meta Tag? HTML Meta Tags for SEO Explained"
      description="Meta tags control how search engines and social platforms understand and display your pages. Here's which ones matter, what they do, and how to set them correctly."
      icon={Tag}
      readTime="7 min read"
      publishDate="July 2026"
      category="SEO"
      relatedArticles={[
        { title: "Complete Guide to SEO Meta Tags (2026)", href: "/blog/seo-meta-tags-guide", description: "Deep dive into every meta tag type with examples.", readTime: "9 min" },
        { title: "What Is JSON-LD? Structured Data for SEO", href: "/blog/what-is-json-ld", description: "The modern way to add structured data for rich results.", readTime: "7 min" },
        { title: "Free JSON-LD Schema Generator", href: "/blog/json-ld-schema-generator", description: "Generate Article, FAQ, and Product schema instantly.", readTime: "8 min" },
      ]}
      relatedTools={[
        { title: "Meta Tag Generator", href: "/tools/meta-tag-generator", description: "Generate complete, SEO-optimized meta tags instantly.", icon: Tag },
        { title: "Schema Generator", href: "/tools/schema-generator", description: "Generate JSON-LD structured data for rich results.", icon: Code },
        { title: "URL Slug Generator", href: "/tools/url-slug-generator", description: "Create clean, SEO-friendly URL slugs from titles.", icon: Globe },
      ]}
    >
      <h2>What Is a Meta Tag?</h2>
      <p>A <strong>meta tag</strong> is an HTML element placed in the <code>&lt;head&gt;</code> section of a web page that provides metadata — information about the page rather than content displayed on the page itself. Visitors don't see meta tags directly, but search engines, social media platforms, and browsers read them to understand what a page is about, how to index it, and how to display it when shared.</p>
      <p>Meta tags look like this:</p>
      <p><code>{`<meta name="description" content="Your page description here." />`}</code></p>
      <p>The <code>name</code> attribute identifies the type of metadata, and the <code>content</code> attribute provides the value. Different meta tag types use different attributes — Open Graph tags use <code>property</code> instead of <code>name</code>, for example.</p>

      <h2>Meta Tags vs the Title Tag</h2>
      <p>Technically, the <code>&lt;title&gt;</code> element is not a meta tag — it's its own HTML element. But in SEO discussions, "meta tags" usually refers to the title tag plus all <code>&lt;meta&gt;</code> elements, because they all live in the <code>&lt;head&gt;</code> and serve similar purposes. The title tag is the most important of the group, so it's always treated alongside the others.</p>

      <h2>The Title Tag — Your Most Important Meta Element</h2>
      <p>The <code>&lt;title&gt;</code> tag defines the text that appears in the browser tab and as the blue clickable headline in Google search results. It's the strongest on-page ranking signal and the biggest factor in whether someone clicks your result.</p>
      <p>Best practices:</p>
      <ul>
        <li><strong>50–60 characters.</strong> Google truncates titles around 600 pixels wide on desktop — roughly 60 characters for typical fonts. Titles that are too long get cut off with "…", losing the end of your message.</li>
        <li><strong>Include the primary keyword early.</strong> Google gives more weight to words near the beginning of the title. "React Performance Tips — 10 Techniques" outperforms "10 Tips to Improve Your React App Performance."</li>
        <li><strong>Every page needs a unique title.</strong> Duplicate titles confuse search engines about which page to rank for a given query and reduce the distinctiveness of your results in search.</li>
        <li><strong>Write for humans, not bots.</strong> Google often rewrites titles it considers misleading, too keyword-stuffed, or mismatched with the page content. Write what accurately describes the page.</li>
      </ul>

      <h2>Meta Description — Your Ad Copy in Search Results</h2>
      <p>The meta description appears as the grey text below the title in search results. It's not a direct ranking factor, but it directly affects click-through rate — and click-through rate signals quality to Google over time.</p>
      <p><code>{`<meta name="description" content="Your 150-160 character description here." />`}</code></p>
      <p>Best practices:</p>
      <ul>
        <li><strong>150–160 characters.</strong> Google truncates descriptions around 920 pixels on desktop. 155 characters is a reliable safe length.</li>
        <li><strong>Include your target keyword.</strong> Google bolds keywords in descriptions that match the search query, making your result more visually prominent.</li>
        <li><strong>Write it as a selling proposition.</strong> Answer: "why should I click this result instead of the ones around it?" Be specific about what the page delivers.</li>
        <li><strong>Google ignores it sometimes.</strong> If Google thinks a different snippet from your page better answers a query, it will rewrite your description. This is normal — you can't prevent it, but you can reduce it by writing descriptions that closely match your page content.</li>
      </ul>

      <h2>Meta Robots — Controlling Search Engine Behavior</h2>
      <p>The robots meta tag tells search engines what they can and cannot do with a page:</p>
      <p><code>{`<meta name="robots" content="index, follow" />`}</code></p>
      <p>Key directives:</p>
      <ul>
        <li><code>index</code> / <code>noindex</code> — whether to include the page in search results</li>
        <li><code>follow</code> / <code>nofollow</code> — whether to follow (and pass link equity through) the links on the page</li>
        <li><code>noarchive</code> — prevents Google from showing a cached version of the page</li>
        <li><code>nosnippet</code> — prevents Google from showing a description snippet in results</li>
      </ul>
      <p>The default (if no robots tag is present) is <code>index, follow</code>. You only need a robots tag when you want to restrict something. Use <code>noindex</code> for admin pages, thank-you pages, and internal search results that shouldn't appear in Google.</p>

      <h2>Canonical Tag — Handling Duplicate Content</h2>
      <p>The canonical tag tells search engines which URL is the "official" version of a page when multiple URLs have identical or very similar content:</p>
      <p><code>{`<link rel="canonical" href="https://example.com/the-definitive-url" />`}</code></p>
      <p>Common scenarios where canonicals matter: pagination (<code>/page/2</code>), URL parameters (<code>?sort=price</code>), HTTPS vs HTTP duplicates, www vs non-www, and trailing slash differences (<code>/about</code> vs <code>/about/</code>). Without canonicals, Google may split link equity between duplicate pages or choose the wrong version to rank.</p>
      <p>Every page should have a self-referencing canonical (pointing to its own URL) as a best practice — it prevents issues if someone links to a URL variant you didn't anticipate.</p>

      <h2>Open Graph Tags — Social Media Previews</h2>
      <p>Open Graph (OG) tags control how a page appears when shared on Facebook, LinkedIn, WhatsApp, Slack, and most other platforms. Without them, these platforms guess what to show — and usually get it wrong.</p>
      <p>The essential Open Graph tags:</p>
      <ul>
        <li><code>{`<meta property="og:title" content="Page Title" />`}</code></li>
        <li><code>{`<meta property="og:description" content="Page description for social shares." />`}</code></li>
        <li><code>{`<meta property="og:image" content="https://example.com/share-image.jpg" />`}</code></li>
        <li><code>{`<meta property="og:url" content="https://example.com/page" />`}</code></li>
        <li><code>{`<meta property="og:type" content="article" />`}</code> (or <code>website</code> for homepages)</li>
      </ul>
      <p>The OG image is the most impactful. Use a 1200×630px image (1.91:1 ratio). Images smaller than 600px wide won't display as large cards on most platforms, significantly reducing click-through from social shares.</p>

      <h2>Twitter Card Tags</h2>
      <p>Twitter Card tags control how links appear when shared on X (Twitter). They extend Open Graph — if Twitter Card tags are absent, X falls back to OG tags where equivalent fields exist.</p>
      <ul>
        <li><code>{`<meta name="twitter:card" content="summary_large_image" />`}</code> — shows a large image above the description</li>
        <li><code>{`<meta name="twitter:title" content="Page Title" />`}</code></li>
        <li><code>{`<meta name="twitter:description" content="Description for X." />`}</code></li>
        <li><code>{`<meta name="twitter:image" content="https://example.com/image.jpg" />`}</code></li>
      </ul>
      <p>Use <code>summary_large_image</code> for articles and blog posts. Use <code>summary</code> (small square image in the corner) for product pages or when you want text to dominate the preview.</p>

      <h2>Meta Tags Google Ignores</h2>
      <p>Several meta tags that once mattered are now ignored by Google:</p>
      <ul>
        <li><strong>Keywords meta tag</strong> — <code>{`<meta name="keywords" content="seo, ..." />`}</code>. Google stopped using this in 2009 after heavy abuse for keyword stuffing. Including it does no harm and no good.</li>
        <li><strong>Author meta tag</strong> — not used as a ranking signal, though it appears in some structured data contexts.</li>
        <li><strong>Revisit-after</strong> — an old tag asking Google to revisit on a schedule. Google crawls on its own schedule regardless.</li>
      </ul>

      <h2>How to Generate and Verify Your Meta Tags</h2>
      <p>Use our free <a href="/tools/meta-tag-generator"><strong>Meta Tag Generator</strong></a> to produce complete, ready-to-paste HTML meta tags for any page — including title, description, Open Graph, Twitter Card, and robots directives. Enter your page details and get the full <code>&lt;head&gt;</code> block in seconds.</p>
      <p>To verify what's currently on any live page, right-click → View Page Source and look in the <code>&lt;head&gt;</code> section, or use browser developer tools (F12 → Elements → find the <code>&lt;head&gt;</code> node). To preview how your page looks when shared on social media, use Facebook's Sharing Debugger or X's Card Validator — both let you enter a URL and see exactly what the preview will look like.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Do meta tags directly affect Google rankings?</strong><br />The title tag is a direct ranking signal — the words in it affect which queries you rank for. The meta description is not a ranking factor but affects click-through rate, which is an indirect quality signal. The robots and canonical tags control crawling and indexation, which indirectly affect rankings by ensuring the right pages are indexed. Open Graph and Twitter Card tags have no direct ranking impact but affect social traffic.</p>

      <p><strong>What happens if I don't set a meta description?</strong><br />Google auto-generates a snippet from your page content. This is often acceptable — Google is good at extracting relevant excerpts. However, the auto-generated snippet may not match what you'd choose to say and can vary between searches. Writing your own gives you control over the message and typically improves click-through rate.</p>

      <p><strong>Can I have different OG and Twitter Card images?</strong><br />Yes. Use <code>og:image</code> for all platforms and <code>twitter:image</code> for X specifically. If <code>twitter:image</code> is absent, X uses <code>og:image</code> as the fallback. This lets you use a 1200×630px image for OG (which most platforms expect) and a different crop for X if needed.</p>

      <p><strong>What is the viewport meta tag and does it affect SEO?</strong><br />The viewport tag (<code>{`<meta name="viewport" content="width=device-width, initial-scale=1">`}</code>) tells the browser how to scale the page on mobile. It's required for responsive design. Google uses mobile-first indexing, so pages without it may be ranked based on their mobile rendering, which can be poor without this tag. Include it on every page.</p>

      <p><strong>Should I add meta tags to every page or just the homepage?</strong><br />Every page. Title and description are especially important on any page you want to rank — blog posts, product pages, landing pages. Even pages that aren't primary SEO targets benefit from unique title tags for browser tab clarity and social sharing. A missing title tag results in Google showing the URL or a generic site name in search results, which has a very low click-through rate.</p>
    </BlogLayout>
  );
}
