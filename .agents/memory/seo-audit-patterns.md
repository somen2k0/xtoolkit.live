---
name: SEO audit patterns — xtoolkit.live
description: Key patterns and decisions from the full-site SEO audit for xtoolkit.live (AdSense prep). Covers tool page structure, schema setup, sitemap org.
---

## Tool page extended content insertion point
In MiniToolLayout-based tool pages, extended content sections go AFTER the About div and BEFORE `</div></MiniToolLayout>`. Pattern:
```tsx
        </div> {/* closes About div */}

        <div className="space-y-6 pt-2">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
            <h2 className="text-lg font-semibold">Section Title</h2>
            ...
          </div>
        </div>
      </div>
    </MiniToolLayout>
```

## SeoHead ogType
SeoHead now accepts `ogType?: string` prop. BlogLayout passes `ogType="article"` to set og:type=article on all blog pages. Other pages default to the global "website" in index.html.

**Why:** AdSense/Google expects og:type=article on blog posts, not website.

## Homepage schemas
home.tsx now injects WebSite+SearchAction and Organization schemas via SeoHead extraSchemas. Organization founder: "Somen Biswas", sameAs: twitter @somen_2k, github somen2k0.

## Blog word count false positive
Python word-count script using regex JSX stripping gave "4 words" for all blog posts — all blog posts actually have substantial content (100–130 lines). Do not trust automated word counts from regex strippers on JSX files; read the actual file to verify.

## Sitemap structure
- sitemap-pages.xml: homepage, category landings, static pages (already had /tools at 0.90 weekly)
- sitemap-tools.xml: all tool pages
- sitemap-blog.xml: blog articles
- sitemap-images.xml was listed in robots.txt but should NOT be — removed duplicate Sitemap: directive
- robots.txt comment block mentions sitemap-images.xml but the Sitemap: directive was removed

## Priority tiers in sitemap-tools.xml
- schema-generator corrected from 0.95 → 0.80 (was inflated)
- json-formatter, base64, jwt-decoder, regex-tester, timezone-converter changed to weekly (were monthly)
