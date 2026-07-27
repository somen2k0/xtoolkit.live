# Content Quality Rules — How to Write Articles That Rank

## The Core Standard

Every article must pass this test: **"Would a person who searched this keyword leave satisfied, or would they go back to Google to find more?"**

If they'd go back to Google — the article fails. Rewrite it.

---

## What Google's AI Detection Actually Looks For

Google does not use third-party AI detectors. It uses its own ML systems that look for behavioral and linguistic signals:

### Linguistic signals of AI-generated content:

**Phrases that are automatic red flags (never use these):**
- "Delve into"
- "It's important to note that"
- "In today's fast-paced world"
- "In conclusion, it is clear that"
- "This comprehensive guide"
- "Without further ado"
- "Let's explore"
- "Navigating the complexities of"
- "At the end of the day"
- "In this article, we will cover"
- "When it comes to"
- "It's worth noting that"
- Any sentence starting with "Additionally," "Furthermore," "Moreover,"
- "A game-changer"
- "Leverage" (when used metaphorically)

**Structural patterns Google flags:**
- Every paragraph is exactly 2–3 sentences
- Uniform sentence length (no variation — short punchy sentences mixed with longer ones)
- Lists of exactly 5 items, every time
- Every H2 is a question followed by a generic answer
- Content that could apply to ANY similar topic — nothing specific
- No concrete numbers, dates, tool names, or real examples

---

## The E-E-A-T Signals We Must Include

E-E-A-T = Experience, Expertise, Authoritativeness, Trustworthiness

### Experience (hardest to fake)
Show that someone with actual experience wrote this:
- Mention specific, verifiable details ("the Twitter API v2 endpoint returns X")
- Reference what actually happens when you use the tool ("clicking Check shows a table with...")
- Include edge cases that only someone who's used the tool would know
- Acknowledge what the tool/approach can't do

### Expertise
- Use correct technical terminology for the topic
- Make distinctions that a beginner wouldn't know to make
- Cite specific sources when making factual claims
- Don't oversimplify — match the depth to what a knowledgeable reader would expect

### Authoritativeness
- The blog section has a consistent author attribution (Somen Biswas)
- Cross-link to other articles we've written on the same topic cluster
- Link OUT to authoritative sources (MDN, Google Developers, RFC documents for technical topics)
- Use structured data (BlogPosting schema) — already done in BlogLayout

### Trustworthiness
- Don't exaggerate ("the best tool ever") — be honest about limitations
- If something has a downside, say so
- Use exact numbers where possible instead of vague claims
- Don't make claims you can't verify

---

## Article Structure That Ranks

### ✅ What works:

**Opening (first 150 words):**
- Answer the question directly in the first paragraph — don't make them scroll
- Include the primary keyword naturally in the first 50 words
- Set clear expectations: "This article covers X, Y, and Z"

**Body:**
- H2 headings that each introduce a distinct angle or answer a sub-question
- Minimum 6 H2 sections for a 1,200-word article
- Vary sentence length — short sentences create rhythm. Longer ones explain complexity. Mix them.
- Include at least one specific example, case, or real scenario per H2 section
- Use `<code>` formatting for any technical strings, commands, or code snippets
- Use numbered lists (ordered `<ol>`) for steps that must happen in sequence
- Use bullet lists (`<ul>`) for collections of things where order doesn't matter
- Bold key terms on their first use, not repeatedly

**Ending:**
- Conclusion that answers the question from a slightly different angle
- Clear CTA to the related tool (one tool, one link, placed where the user would naturally want to try it)
- No fake urgency ("Start today!") — just a natural next step

### ❌ What doesn't work:

- Starting with "In today's digital landscape..." or any generic preamble
- Padding (restating the same point in different words to hit a word count)
- Bullet lists of generic tips that could apply to anything
- Ending with "I hope this article was helpful!" — no soft closes
- H2s that are just keyword variations of each other
- No specificity — entire article could be about any tool on any site

---

## Human Voice Markers (Add These)

These signal to Google that a human with first-hand knowledge wrote this:

1. **Specific contrasts:** "Unlike Mailchimp's spam checker, which requires sending a test email, our tool checks the subject line instantly in your browser."
2. **Honest limitations:** "This tool checks syntax validity — it can't verify if a Gmail address is actually active because Gmail doesn't expose that via their API."
3. **Real-world scenarios:** "If you're auditing an influencer list of 80 accounts before an outreach campaign, here's exactly what you'd do..."
4. **Numbered specifics:** "The Twitter API v2 returns 6 fields per account..." (not "several fields")
5. **Acknowledged nuance:** "This works for most subject lines, but marketing emails targeting financial products will see stricter filtering regardless of word choice."
6. **Named edge cases:** "Exception: if the account was suspended for spam, it may be re-listed as 'Not Found' rather than 'Suspended' after 30 days."

---

## Readability Rules

- **Sentences:** Mix 8-word and 25-word sentences. If 5 consecutive sentences are similar length, rewrite some.
- **Paragraphs:** Maximum 4 sentences. 2–3 is ideal. One-sentence paragraphs are allowed for emphasis.
- **Passive voice:** Under 20% of sentences. "The tool checks the account" (active) beats "The account is checked by the tool" (passive).
- **Reading level:** Write for a smart non-expert. No jargon without a one-sentence explanation.
- **Word count:** 1,200–1,800 words. Under 1,000 = too thin. Over 2,500 = padding likely.

---

## Internal Linking Rules

Every article must have:
- **2–3 internal links to other blog posts** — link where it genuinely makes sense (not forced)
- **1 internal link to the relevant tool** — placed where a reader would naturally want to try it, not at the top or in a forced conclusion
- **Go back and add a link FROM existing articles TO the new one** — bidirectional linking helps both pages

Do NOT:
- Use the same anchor text for every link to the same page
- Add a "Related Articles" footer block as a substitute for in-content links
- Link to more than 1 tool per article

---

## External Linking Rules

Every article should have:
- **1–2 outbound links to authoritative sources** — link to original documentation, not someone else's summary
  - For email topics: link to RFC specifications, Gmail Help Center, SpamAssassin docs
  - For developer topics: link to MDN, IETF RFCs, or official API docs
  - For SEO topics: link to Google Search Central, not to Moz or Ahrefs articles
- Open in new tab (`target="_blank"` — handled by BlogLayout)
- Never link to a direct competitor

---

## Pre-Publish Self-Audit

Before marking any article as done, run through this check:

- [ ] Does the first paragraph answer the question without scrolling?
- [ ] Is the primary keyword in the first 50 words?
- [ ] Does the article contain at least one specific, concrete example?
- [ ] Is there anything that could only have been written by someone who knows this topic?
- [ ] Are there any AI cliché phrases? (check the banned list above)
- [ ] Is the passive voice under 20%?
- [ ] Does every H2 introduce something genuinely distinct?
- [ ] Is there exactly one tool CTA, placed naturally?
- [ ] Are there 2–3 internal links to other articles?
- [ ] Is the word count between 1,200 and 1,800?
- [ ] Would a domain expert be comfortable with the accuracy of what's written?
