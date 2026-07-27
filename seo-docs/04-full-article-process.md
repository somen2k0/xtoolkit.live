# Full Article Publishing Process — xtoolkit.live

## From Keyword Idea to Live Article — Every Step

This is the complete process. Do not skip steps. Order matters.

---

## Phase 1: Keyword Research (Before Writing Anything)

**Time: 15–20 minutes per keyword**

### Step 1.1 — Brainstorm keyword candidates
Start from the tool, not from a generic topic. Ask:
- "What would someone search right before using this tool?"
- "What question does this tool answer?"
- "What is someone trying to accomplish that our tool helps with?"

### Step 1.2 — Run the 3-Question Filter (from `01-keyword-research.md`)
- Q1: Who ranks on page 1? Green/red light?
- Q2: Does search intent match what we deliver?
- Q3: Does it naturally link to one of our 44 tools?

### Step 1.3 — Check Google Autocomplete
Type the keyword into Google. Note what autocomplete suggests. These are real searches.

### Step 1.4 — Check "People Also Ask"
Search the keyword, screenshot or note all PAA questions. These become H2 headings in the article.

### Step 1.5 — Confirm format
What does page 1 show? List? How-to steps? Explainer? Match that format.

### Step 1.6 — Decide the angle
Narrow the keyword to a specific angle that matches the long-tail:
- Not: "email spam words"
- Yes: "email subject line spam trigger words to avoid 2026"

### Step 1.7 — Record everything
Fill in the Keyword Research Record Template from `01-keyword-research.md` before touching the article file.

---

## Phase 2: Pre-Writing (10 minutes)

### Step 2.1 — Check for cannibalization
Search xtoolkit.live/blog to confirm we don't already have an article on the same topic. If we do, add to that article instead of creating a new one.

### Step 2.2 — Plan the H2 structure
Write out 6–8 H2 headings before writing any body content. These become the article outline. Each H2 should address a distinct sub-question or angle.

Example for "email spam trigger words":
- H2: What Are Spam Trigger Words? (definition)
- H2: Why Subject Lines Matter Most (why this is the critical place)
- H2: The Complete List of Spam Words by Category (the list — main content)
- H2: How Spam Filters Actually Work (technical context)
- H2: How to Check Your Subject Line Before Sending (tool CTA)
- H2: What Spam Filters Actually Penalize (beyond words)
- H2: Safe Alternatives to Common Spam Phrases (practical replacements)

### Step 2.3 — Find 1–2 authoritative sources to link out to
Before writing, identify external sources to cite. These must be primary sources:
- For email: SpamAssassin documentation, RFC standards, Gmail Help
- For developer topics: MDN, IETF RFCs, official API documentation
- For SEO: Google Search Central
- NOT: Moz, HubSpot, Neil Patel, Backlinko (these are competitors, not primary sources)

### Step 2.4 — Identify 2–3 existing xtoolkit.live blog posts to link to/from
These must be topically related, not forced. Note which articles you'll link TO and which existing articles you'll go back and add a link FROM.

---

## Phase 3: Writing

### Step 3.1 — Write the opening paragraph first
Must include:
- Primary keyword in first 50 words
- A direct answer to what the reader is looking for
- 2–3 sentences max before the first H2

### Step 3.2 — Write section by section, H2 by H2
For each H2 section:
- 150–250 words
- At least one concrete example, number, or specific detail
- Varies sentence length (short and long, mixed)
- No AI cliché phrases (see `03-content-quality-rules.md` banned list)

### Step 3.3 — Write the tool CTA section
One H2 dedicated to the tool. Describe how to use it step-by-step (3–5 numbered steps). Include the tool URL as an internal link. This is the section that converts readers into users.

### Step 3.4 — Write the conclusion
2–3 sentences. Summarizes the key point. Ends with a natural next step (usually: "use the tool").

---

## Phase 4: React Component Setup

Each article is a `.tsx` file in `artifacts/x-checker/src/pages/blog/`.

### Step 4.1 — File naming
- Use the exact keyword as the filename: `email-spam-trigger-words.tsx`
- Lowercase, hyphens only, no stop words (a/the/and/of)
- Match the URL slug

### Step 4.2 — BlogLayout props checklist

```tsx
<BlogLayout
  seoTitle=""        // 50-60 chars, keyword near the start
  seoDescription=""  // 140-155 chars, includes keyword + benefit hook
  title=""           // H1 — can be slightly different from seoTitle
  description=""     // Sub-headline under H1
  icon={IconName}    // Relevant Lucide icon
  readTime=""        // "X min read" — calculate at ~200 words/min
  publishDate=""     // "Month YYYY" e.g. "July 2026"
  category=""        // One of: Guide, Comparison, Security, SEO, Developer, Social Media, Email, Explainer
  relatedArticles={[...]}  // 3 related blog posts
  relatedTools={[...]}     // 2-4 related tools (first one = the main CTA tool)
>
```

**seoTitle rules:**
- 50–60 characters max
- Keyword in the first 5 words
- Can include year "(2026)" for freshness signal
- No clickbait

**seoDescription rules:**
- 140–155 characters max
- Include primary keyword
- Include a benefit ("instantly", "free", "no signup", "in 30 seconds")
- End with a hook (question or benefit statement)

### Step 4.3 — Content formatting rules
- H2 → `<h2>Text</h2>`
- H3 → `<h3>Text</h3>`
- Paragraphs → `<p>Text</p>`
- Ordered lists → `<ol><li>...</li></ol>`
- Bullet lists → `<ul><li>...</li></ul>`
- Bold → `<strong>text</strong>`
- Code → `<code>text</code>`
- Internal links → `<a href="/tools/slug">Tool Name</a>` (no full domain)
- External links → `<a href="https://..." target="_blank" rel="noopener">Text</a>`

---

## Phase 5: Register the Article

### Step 5.1 — Add to `blog/index.tsx` ARTICLES array
Add entry at the END of the array (the featured article is always the first item):
```tsx
{
  slug: "your-slug-here",
  href: "/blog/your-slug-here",
  title: "Full Article Title Here",
  description: "One-sentence description for the blog card.",
  readTime: "X min",
  category: "CategoryName",
  icon: IconName,
  color: "text-[color]-400",
  bg: "bg-[color]/10 border-[color]/20",
}
```

### Step 5.2 — Add to `App.tsx`
Add the lazy import near the other blog imports (line ~100):
```tsx
const YourComponentName = lazy(() => import("@/pages/blog/your-slug-here"));
```

Add the route near the other blog routes (line ~245):
```tsx
<Route path="/blog/your-slug-here" component={YourComponentName} />
```

### Step 5.3 — Add to `sitemap-blog.xml`
Add before `</urlset>`:
```xml
<url>
  <loc>https://www.xtoolkit.live/blog/your-slug-here</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.80</priority>
</url>
```
Set `lastmod` to today's date. Use `0.82` priority for high-commercial-intent articles, `0.80` for educational articles.

### Step 5.4 — Update sitemap-blog.xml `<lastmod>` for blog hub
Update the blog index URL's lastmod to today's date every time a new article is added.

---

## Phase 6: Back-Link from Existing Articles

Go to 1–2 existing articles that are topically related. Add a contextual inline link to the new article somewhere it fits naturally.

This takes 5 minutes and doubles the SEO value of publishing new content.

---

## Phase 7: Pre-Publish Checklist

Run through the self-audit from `03-content-quality-rules.md`:

- [ ] Keyword in title (first 5 words)
- [ ] Keyword in first 50 words of article
- [ ] Keyword in at least one H2
- [ ] 1,200–1,800 words
- [ ] No AI cliché phrases from the banned list
- [ ] At least one concrete, specific example per H2
- [ ] Zero passive voice sentences that could be rewritten active
- [ ] One tool CTA with step-by-step instructions
- [ ] 2–3 internal links to other blog posts
- [ ] 1–2 external links to authoritative primary sources
- [ ] seoTitle is 50–60 chars
- [ ] seoDescription is 140–155 chars
- [ ] publishDate is correct (Month YYYY)
- [ ] ARTICLES array updated in blog/index.tsx
- [ ] Lazy import + Route added in App.tsx
- [ ] URL added to sitemap-blog.xml
- [ ] Blog hub lastmod updated in sitemap-blog.xml

---

## Phase 8: Commit and Push

```bash
git add artifacts/x-checker/src/pages/blog/your-slug.tsx
git add artifacts/x-checker/src/pages/blog/index.tsx
git add artifacts/x-checker/src/App.tsx
git add artifacts/x-checker/public/sitemap-blog.xml
git commit -m "Add blog post: [article title]"
git push
```

---

## Phase 9: Request Indexing in Google Search Console

After pushing:
1. Go to Google Search Console → URL Inspection
2. Paste the new article URL: `https://www.xtoolkit.live/blog/your-slug-here`
3. Click "Request Indexing"
4. Repeat for the blog index URL: `https://www.xtoolkit.live/blog`

This tells Google to crawl the new page immediately instead of waiting for the sitemap crawl cycle.

---

## Publishing Pace

| Schedule | Notes |
|---|---|
| 1 article/week minimum | Consistent beats sporadic |
| Maximum 3 articles/week | Above this risks scaled content flags |
| Never publish without human review | AI-generated → human-edited → publish |
| Update old articles quarterly | Refresh dates, update facts, add new sections |

---

## Article Priority Queue

When choosing what to write next, prioritize in this order:

1. **High commercial intent** — reader wants to use a tool right now (e.g. "free X generator online")
2. **Tool-adjacent how-to** — explains the problem our tool solves (e.g. "how to check spam score")
3. **Comparison content** — positions our tool vs alternatives (e.g. "X vs Y")
4. **Educational explainer** — builds topical authority (e.g. "what is a URL slug")

Never write educational explainers first. They build authority but don't convert. Start with commercial intent, add explainers as the cluster grows.
