import { BlogLayout } from "@/components/layout/BlogLayout";
import { Search, Tag, Share2, Code } from "lucide-react";

export default function SeoMetaTagsGuide() {
  return (
    <BlogLayout
      seoTitle="SEO Meta Tags Guide 2026 — Title, Description & OG Tags"
      seoDescription="Everything you need to know about SEO meta tags in 2026: title tags, meta descriptions, Open Graph, Twitter Cards, canonical tags and structured data. With examples."
      title="Complete Guide to SEO Meta Tags in 2026 — Title, Description, OG Tags Explained"
      description="Meta tags control how your pages appear in search results and on social media. Here's what each tag does, how to write them, and how to avoid the most common mistakes."
      icon={Search}
      readTime="9 min read"
      publishDate="June 2026"
      category="SEO"
      relatedArticles={[
        { title: "What Is JSON-LD?", href: "/blog/what-is-json-ld", description: "Structured data markup for SEO explained.", readTime: "7 min" },
        { title: "URL Encoding Guide", href: "/blog/url-encoding-guide", description: "How percent-encoding works in URLs.", readTime: "5 min" },
        { title: "What Is Base64?", href: "/blog/what-is-base64", description: "Base64 encoding explained for developers.", readTime: "6 min" },
      ]}
      relatedTools={[
        { title: "Meta Tag Generator", href: "/tools/meta-tag-generator", description: "Generate optimized title, description, and OG tags.", icon: Tag },
        { title: "OG Image Preview", href: "/tools/og-image-preview", description: "Preview how your page looks when shared on social media.", icon: Share2 },
        { title: "Schema Generator", href: "/tools/schema-generator", description: "Generate JSON-LD structured data for rich results.", icon: Code },
        { title: "Page Speed Checker", href: "/tools/page-speed-checker", description: "Audit your website's Core Web Vitals and performance.", icon: Search },
      ]}
    >
      <h2>What Are Meta Tags?</h2>
      <p>
        <strong>Meta tags</strong> are HTML elements placed inside the <code>&lt;head&gt;</code> section of a webpage. They are not visible to visitors but communicate important information to search engines, social media platforms, and browsers. Meta tags control how your page appears in Google search results, how link previews look when shared on Twitter or LinkedIn, and whether search engines can index your content.
      </p>
      <p>
        Getting meta tags right is one of the highest-leverage SEO tasks — it directly influences click-through rates (CTR) in search results, which in turn affects your actual traffic even if your rankings stay the same.
      </p>

      <h2>The Title Tag</h2>
      <p>
        The <strong>title tag</strong> is the most important meta tag for SEO. It appears as the blue headline in Google search results and as the browser tab title. Google uses it as a primary signal for understanding what your page is about.
      </p>
      <p><code>{`<title>Complete Guide to SEO Meta Tags in 2026 | Your Site</title>`}</code></p>

      <h3>Title tag best practices</h3>
      <ul>
        <li><strong>Length:</strong> Keep titles between 50–60 characters. Google typically truncates titles longer than ~600px (roughly 60 characters). Shorter titles (under 30 characters) waste opportunity.</li>
        <li><strong>Primary keyword first:</strong> Place your target keyword near the beginning of the title. Google weights earlier words more heavily.</li>
        <li><strong>Brand name:</strong> Add your brand name at the end, separated by a pipe or dash. Example: <code>How to Bake Sourdough | King Arthur Baking</code>.</li>
        <li><strong>Be specific:</strong> Vague titles like "Home" or "Article" get low CTR. Specific, descriptive titles get clicks.</li>
        <li><strong>Don't keyword-stuff:</strong> Titles like "Buy Shoes Cheap Shoes Discount Shoes" look spammy and Google may rewrite them.</li>
        <li><strong>Write for humans first:</strong> A title that gets clicks matters more than one optimized purely for keywords. High CTR is itself a positive ranking signal.</li>
      </ul>

      <h2>Meta Description</h2>
      <p>
        The <strong>meta description</strong> is the snippet of text that appears below the title in search results. It does not directly affect rankings, but it heavily influences whether users click your result.
      </p>
      <p><code>{`<meta name="description" content="A complete guide to SEO meta tags — title, description, Open Graph, and more. Updated for 2026.">`}</code></p>

      <h3>Meta description best practices</h3>
      <ul>
        <li><strong>Length:</strong> 120–160 characters. Google cuts off descriptions around 155–160 characters on desktop and ~120 on mobile.</li>
        <li><strong>Include the target keyword:</strong> Google bolds query terms in the description, making your result stand out visually.</li>
        <li><strong>Write a genuine value proposition:</strong> Answer: why should a user click your result instead of the others? What will they get?</li>
        <li><strong>Use active voice and action words:</strong> "Learn how to...", "Get a free...", "Discover..."</li>
        <li><strong>Unique per page:</strong> Never duplicate descriptions across pages. Duplicate descriptions can trigger a Google rewrite and reduce your ability to control how you appear.</li>
        <li><strong>Google may ignore it:</strong> Google rewrites meta descriptions roughly 70% of the time when it decides its own version better matches the query. Good descriptions still matter for the 30% of the time they are used.</li>
      </ul>

      <h2>Open Graph Tags</h2>
      <p>
        <strong>Open Graph (OG) tags</strong> were created by Facebook to control how URLs appear when shared on social media. They are now used by Facebook, LinkedIn, Slack, Discord, iMessage, and most other platforms that generate link previews.
      </p>
      <p>
        The four essential Open Graph tags are:
      </p>
      <ul>
        <li><code>{`<meta property="og:title" content="Your Page Title">`}</code></li>
        <li><code>{`<meta property="og:description" content="A compelling description for social sharing.">`}</code></li>
        <li><code>{`<meta property="og:image" content="https://yoursite.com/og-image.png">`}</code></li>
        <li><code>{`<meta property="og:url" content="https://yoursite.com/your-page">`}</code></li>
      </ul>

      <h3>OG image specifications</h3>
      <ul>
        <li><strong>Recommended size:</strong> 1200 × 630 pixels</li>
        <li><strong>Format:</strong> PNG or JPEG (PNG preferred for text-heavy images)</li>
        <li><strong>File size:</strong> Under 1MB — large images may not load in all preview environments</li>
        <li><strong>Content:</strong> Include your brand name, page title, and a visual element. Text should be readable at thumbnail size.</li>
        <li>Facebook, LinkedIn, and most platforms cache OG images aggressively. After updating an image, use the platform's cache-buster tool (Facebook Sharing Debugger, LinkedIn Post Inspector) to force a refresh.</li>
      </ul>

      <h2>Twitter Card Meta Tags</h2>
      <p>
        <strong>Twitter Cards</strong> are Twitter's version of Open Graph — they control how your URLs appear when shared on X (Twitter). If Twitter Card tags are absent, Twitter falls back to Open Graph tags.
      </p>
      <p>The two main card types are <code>summary</code> (small square thumbnail) and <code>summary_large_image</code> (full-width banner image):</p>
      <ul>
        <li><code>{`<meta name="twitter:card" content="summary_large_image">`}</code></li>
        <li><code>{`<meta name="twitter:title" content="Your Page Title">`}</code></li>
        <li><code>{`<meta name="twitter:description" content="Description for Twitter previews.">`}</code></li>
        <li><code>{`<meta name="twitter:image" content="https://yoursite.com/twitter-card.png">`}</code></li>
      </ul>
      <p>
        Use <code>summary_large_image</code> for most pages — the larger format gets significantly more engagement. The image dimensions are the same as Open Graph: 1200 × 630px.
      </p>

      <h2>Canonical Tag</h2>
      <p>
        The <strong>canonical tag</strong> tells search engines which URL is the "official" version of a page when duplicate or near-duplicate content exists at multiple URLs.
      </p>
      <p><code>{`<link rel="canonical" href="https://yoursite.com/the-canonical-url">`}</code></p>
      <p>
        Common scenarios requiring a canonical tag: product pages with URL parameters (<code>?color=red&size=large</code>), paginated content, HTTP vs HTTPS versions, and www vs non-www versions. Without a canonical, Google has to guess which version to index — and may pick the wrong one.
      </p>

      <h2>Robots Meta Tag</h2>
      <p>
        The <strong>robots meta tag</strong> controls crawler behavior for individual pages:
      </p>
      <ul>
        <li><code>{`<meta name="robots" content="index, follow">`}</code> — default behavior; index the page and follow links</li>
        <li><code>{`<meta name="robots" content="noindex, nofollow">`}</code> — don't index this page and don't follow its links</li>
        <li><code>{`<meta name="robots" content="noindex, follow">`}</code> — don't index but do follow links (useful for tag pages, search results)</li>
      </ul>
      <p>
        Use <code>noindex</code> on pages you don't want in search results: admin pages, thank-you pages, duplicate content pages, thin pages with little value.
      </p>

      <h2>Structured Data and JSON-LD</h2>
      <p>
        <strong>Structured data</strong> (usually implemented as <strong>JSON-LD</strong>) is not a traditional meta tag but lives in the <code>&lt;head&gt;</code> and serves a similar purpose — communicating metadata to search engines. JSON-LD enables <strong>rich results</strong>: star ratings, FAQs, breadcrumbs, event dates, and recipe cards in search results.
      </p>
      <p>
        A basic Article schema example:
      </p>
      <p><code>{`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Complete Guide to SEO Meta Tags",\n  "datePublished": "2026-01-01",\n  "author": { "@type": "Person", "name": "Your Name" }\n}\n</script>`}</code></p>
      <p>
        Use our <a href="/tools/schema-generator"><strong>Schema Generator</strong></a> to build JSON-LD markup for articles, FAQs, products, and more without writing code.
      </p>

      <h2>Viewport Meta Tag</h2>
      <p>
        The viewport meta tag is not an SEO tag per se, but it is required for mobile-friendliness — which is a confirmed Google ranking factor:
      </p>
      <p><code>{`<meta name="viewport" content="width=device-width, initial-scale=1">`}</code></p>
      <p>
        Without this tag, mobile browsers render your page at desktop width and scale it down, producing a terrible user experience and potentially triggering Google's mobile-usability penalties.
      </p>

      <h2>Generate Your Meta Tags</h2>
      <p>
        Use our free <a href="/tools/meta-tag-generator"><strong>Meta Tag Generator</strong></a> to create optimized title, description, Open Graph, and Twitter Card tags for any page — with character counters and a live preview of how your page will appear in search results and social shares.
      </p>

      <h2>Open Graph Tag Examples</h2>
      <p>
        A complete set of recommended meta tags for a blog post page should include: a title tag containing your primary keyword under 60 characters; a meta description of 150–160 characters with a call to action; an og:title (which can be slightly longer than the title tag since it has no Google character limit); an og:image of 1200×630 pixels for optimal display on all social platforms; and og:type set to <code>article</code> for blog posts or <code>website</code> for the homepage.
      </p>
      <p>
        For Twitter/X specifically, use <code>twitter:card</code> set to <code>summary_large_image</code> to get the large image preview format. Set <code>twitter:site</code> to your Twitter/X handle and <code>twitter:creator</code> to the author's handle for proper attribution in tweets.
      </p>

      <h2>Canonical Tags</h2>
      <p>
        The canonical tag tells search engines which version of a page is the authoritative original when multiple URLs show the same or similar content. Common situations requiring canonical tags include: HTTP vs HTTPS versions, www vs non-www versions, URL parameters like <code>?sort=price</code> or <code>?ref=newsletter</code>, and syndicated content published on multiple sites.
      </p>
      <p>
        Best practice is to set the canonical tag to the preferred URL for every page — even pages without duplicates. This is defensive SEO that prevents accidental duplicate content issues if your URL structure ever changes or if crawlers discover unexpected parameter variations.
      </p>

      <h2>Meta Robots Tag</h2>
      <p>
        The meta robots tag controls how search engines index and follow links on your page. The most important values are: <code>index</code> / <code>noindex</code> (whether to include the page in search results) and <code>follow</code> / <code>nofollow</code> (whether to follow links on the page).
      </p>
      <p>
        Use <code>noindex</code> for: thank-you pages, internal search results pages, user profile pages, admin pages, pagination pages beyond the first, and any page you do not want appearing in search results. Never noindex your important content pages — this is one of the most common and damaging SEO mistakes. Always audit your meta robots tags whenever you add new page templates to your site.
      </p>
    </BlogLayout>
  );
}
