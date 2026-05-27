import { BlogLayout } from "@/components/layout/BlogLayout";
import { Code, Globe, Search, FileJson } from "lucide-react";

export default function WhatIsJsonLd() {
  return (
    <BlogLayout
      seoTitle="What Is JSON-LD? Structured Data for SEO Explained (2026)"
      seoDescription="What is JSON-LD and why does it matter for SEO? A complete guide to structured data markup, Schema.org types, and how JSON-LD helps search engines understand your content."
      title="What Is JSON-LD? Structured Data for SEO Explained"
      description="JSON-LD is the modern way to add structured data to web pages. Here's what it is, why it matters for search rankings, and how to implement it correctly."
      icon={Code}
      readTime="7 min read"
      publishDate="2026"
      category="SEO"
      relatedArticles={[
        { title: "What Is URL Encoding?", href: "/blog/url-encoding-guide", description: "How URL encoding works and when to use it.", readTime: "5 min" },
        { title: "What Is Base64?", href: "/blog/what-is-base64", description: "Base64 encoding explained for developers.", readTime: "5 min" },
        { title: "What Is a UUID?", href: "/blog/what-is-uuid", description: "UUIDs explained: format, versions, and use cases.", readTime: "6 min" },
      ]}
      relatedTools={[
        { title: "JSON-LD Schema Generator", href: "/tools/schema-generator", description: "Generate JSON-LD structured data for any Schema.org type.", icon: Code },
        { title: "Meta Tag Generator", href: "/tools/meta-tag-generator", description: "Generate complete HTML meta tags for SEO and social sharing.", icon: Globe },
        { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON with real-time error detection.", icon: FileJson },
        { title: "Sitemap Validator", href: "/tools/sitemap-validator", description: "Validate and analyze your XML sitemap.", icon: Search },
      ]}
    >
      <h2>What Is JSON-LD?</h2>
      <p>
        JSON-LD (JavaScript Object Notation for Linked Data) is a method for encoding structured data using the JSON format. In the context of web development and SEO, it's the recommended way to add <strong>Schema.org structured data markup</strong> to web pages — machine-readable metadata that helps search engines understand what your page is about, not just what it says.
      </p>
      <p>
        Google, Bing, and other search engines use structured data to power rich results in search — star ratings, FAQ dropdowns, recipe details, event dates, product prices, and more. JSON-LD is how you tell search engines "this is a recipe with these ingredients and this cooking time" rather than leaving them to guess from your page text.
      </p>

      <h2>JSON-LD vs Other Structured Data Formats</h2>
      <p>There are three main formats for adding structured data to web pages:</p>
      <ul>
        <li><strong>JSON-LD</strong> — a separate <code>&lt;script&gt;</code> block in the page <code>&lt;head&gt;</code>. The markup is completely separate from the HTML content.</li>
        <li><strong>Microdata</strong> — attributes added directly to HTML elements (<code>itemscope</code>, <code>itemprop</code>, etc.).</li>
        <li><strong>RDFa</strong> — similar to Microdata, attributes embedded in HTML tags.</li>
      </ul>
      <p>Google <strong>recommends JSON-LD</strong> for all structured data. It's preferred because it doesn't require modifying your HTML content — you add a single script block and the markup lives separately from your content, making it easier to add, maintain, and update without risk of breaking your page layout.</p>

      <h2>How JSON-LD Works</h2>
      <p>JSON-LD is added to a web page as a <code>&lt;script&gt;</code> tag with type <code>application/ld+json</code>. Here's a minimal example for an article:</p>
      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What Is JSON-LD?",
  "author": {
    "@type": "Person",
    "name": "X Toolkit"
  },
  "datePublished": "2026-05-01",
  "description": "A complete guide to JSON-LD structured data."
}
</script>`}</code></pre>
      <p>Search engine crawlers read this script block along with your page content. They use it to understand the relationships between entities on your page — the article, its author, its publication date — creating a structured representation that can power rich results.</p>

      <h2>Common Schema.org Types for JSON-LD</h2>
      <p>Schema.org defines hundreds of types, but a handful account for the vast majority of SEO use cases:</p>
      <ul>
        <li><strong>Article / BlogPosting</strong> — news articles, blog posts, editorial content. Enables article rich results with author bylines and publication dates.</li>
        <li><strong>FAQPage</strong> — FAQ sections. Can generate accordion-style FAQ dropdowns directly in search results, significantly increasing click-through rate.</li>
        <li><strong>Product</strong> — e-commerce products. Enables price, availability, and review stars in search results.</li>
        <li><strong>LocalBusiness</strong> — brick-and-mortar businesses. Populates the knowledge panel with address, hours, phone number, and reviews.</li>
        <li><strong>Recipe</strong> — cooking recipes. Generates rich results with cooking time, ingredients, and calorie count directly in search.</li>
        <li><strong>Event</strong> — concerts, conferences, webinars. Shows date, location, and ticket availability in search results.</li>
        <li><strong>BreadcrumbList</strong> — navigation hierarchy. Displays breadcrumbs in search result URLs instead of the raw URL.</li>
        <li><strong>SoftwareApplication</strong> — apps and tools. Can show star ratings and download links directly in search results.</li>
      </ul>

      <h2>How JSON-LD Affects SEO</h2>
      <p>JSON-LD doesn't directly increase your search ranking. Google has explicitly stated that structured data is not a ranking factor. However, it enables <strong>rich results</strong> — enhanced SERP listings with additional visual elements — which significantly improve click-through rates. A result with a 4.5-star rating and review count, displayed alongside a competitor's plain blue link, consistently attracts more clicks.</p>
      <p>Higher CTR from the same position signals to Google that your result is more useful to users, which can indirectly improve your ranking over time. Additionally, structured data improves how search engines understand your content — which can help your pages appear for more relevant queries even if the ranking position doesn't immediately change.</p>

      <h2>How to Implement JSON-LD</h2>
      <p>The simplest implementation path:</p>
      <ol>
        <li>Use our <strong>JSON-LD Schema Generator</strong> to generate the complete markup for your Schema.org type — Article, FAQ, Product, Local Business, or more.</li>
        <li>Copy the generated <code>&lt;script&gt;</code> block and paste it into the <code>&lt;head&gt;</code> section of your page HTML.</li>
        <li>Validate using Google's <strong>Rich Results Test</strong> (search.google.com/test/rich-results) to confirm the markup is valid and eligible for rich results.</li>
        <li>Submit the updated page to Google Search Console for recrawling to speed up the rich result appearance.</li>
      </ol>

      <h2>Common JSON-LD Mistakes to Avoid</h2>
      <ul>
        <li><strong>Mismatched content</strong> — the values in your JSON-LD must match the visible content on your page. Google penalizes structured data that describes content not present on the page.</li>
        <li><strong>Invalid JSON</strong> — a single JSON syntax error breaks the entire script block. Always validate with a JSON linter before publishing.</li>
        <li><strong>Missing required properties</strong> — each Schema.org type has required and recommended properties. Missing required ones means the markup won't qualify for rich results.</li>
        <li><strong>Using the wrong type</strong> — marking a blog post as a Product or an FAQ as an Article produces invalid markup that won't generate rich results.</li>
        <li><strong>Duplicate markup</strong> — don't add the same Schema.org type twice on the same page without a good reason.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Does every page need JSON-LD structured data?</strong><br />No. JSON-LD is most valuable for page types that are eligible for rich results: articles, FAQs, products, recipes, events, and local business pages. Generic informational pages, contact pages, and privacy policies don't benefit significantly from structured data markup.</p>

      <p><strong>How quickly does Google show rich results after adding JSON-LD?</strong><br />It depends on how frequently Googlebot crawls your page. New pages or recently updated pages submitted through Google Search Console typically get recrawled within a few days. After crawling, rich results can appear in search within 1–4 weeks. The Rich Results Test shows whether your markup is valid without waiting for Google to crawl it.</p>

      <p><strong>Can I add multiple JSON-LD blocks to one page?</strong><br />Yes. You can have multiple <code>&lt;script type="application/ld+json"&gt;</code> blocks on the same page — for example, a BreadcrumbList and an Article on the same blog post page. Google reads all of them. Alternatively, you can combine multiple types in a single block using an array.</p>

      <p><strong>What is the difference between JSON-LD and Open Graph tags?</strong><br />JSON-LD (Schema.org) is structured data for search engines — it powers rich results in Google and Bing. Open Graph tags are meta tags for social platforms — they control how links appear on Facebook, LinkedIn, Slack, and similar platforms. They serve different purposes and both should be implemented for maximum coverage.</p>

      <p><strong>Will JSON-LD help my local business appear in Google Maps?</strong><br />JSON-LD with LocalBusiness markup helps Google understand your business entity and can improve your knowledge panel in search results. However, your Google Business Profile (Google Maps listing) is a separate system — managing it there is the most direct way to influence your Maps presence. JSON-LD and Google Business Profile work together but are complementary, not substitutes.</p>
    </BlogLayout>
  );
}
