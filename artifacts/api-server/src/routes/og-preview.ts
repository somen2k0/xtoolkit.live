// FIXED: OG Preview - Googlebot User-Agent, 10s timeout, allorigins.win fallback
import { Router } from "express";

const router = Router();

function extractMeta(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : "";
}

function resolveUrl(base: string, relative: string): string {
  if (!relative) return "";
  if (relative.startsWith("http://") || relative.startsWith("https://")) return relative;
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}

async function fetchHtml(targetUrl: string): Promise<{ html: string; finalUrl: string }> {
  // Attempt 1: direct fetch with Googlebot User-Agent and 10s timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    clearTimeout(timeout);

    if (response.ok) {
      const html = await response.text();
      return { html, finalUrl: response.url || targetUrl };
    }
  } catch {
    clearTimeout(timeout);
    // fall through to allorigins fallback
  }

  // Attempt 2: allorigins.win proxy fallback
  const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
  const fallbackController = new AbortController();
  const fallbackTimeout = setTimeout(() => fallbackController.abort(), 10000);

  try {
    const fallbackRes = await fetch(allOriginsUrl, {
      signal: fallbackController.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" },
    });
    clearTimeout(fallbackTimeout);

    if (fallbackRes.ok) {
      const data = await fallbackRes.json() as { contents?: string };
      if (data.contents) {
        return { html: data.contents, finalUrl: targetUrl };
      }
    }
  } catch {
    clearTimeout(fallbackTimeout);
  }

  throw new Error("Could not fetch page. The site may block external requests.");
}

function buildResult(html: string, finalUrl: string) {
  const ogTitle = extractMeta(html, "og:title");
  const ogDescription = extractMeta(html, "og:description");
  const ogImage = resolveUrl(finalUrl, extractMeta(html, "og:image"));
  const ogSiteName = extractMeta(html, "og:site_name");
  const ogType = extractMeta(html, "og:type");
  const ogUrl = extractMeta(html, "og:url") || finalUrl;

  const twitterCard = extractMeta(html, "twitter:card");
  const twitterTitle = extractMeta(html, "twitter:title");
  const twitterDescription = extractMeta(html, "twitter:description");
  const twitterImage = resolveUrl(finalUrl, extractMeta(html, "twitter:image"));
  const twitterSite = extractMeta(html, "twitter:site");

  const pageTitle = extractTitle(html);
  const metaDescription = extractMeta(html, "description");

  const favicon = (() => {
    const rel = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i);
    if (rel) return resolveUrl(finalUrl, rel[1]);
    try { return new URL("/favicon.ico", finalUrl).href; } catch { return ""; }
  })();

  return {
    url: finalUrl,
    favicon,
    page: { title: pageTitle, description: metaDescription },
    og: { title: ogTitle, description: ogDescription, image: ogImage, siteName: ogSiteName, type: ogType, url: ogUrl },
    twitter: { card: twitterCard, title: twitterTitle, description: twitterDescription, image: twitterImage, site: twitterSite },
  };
}

router.post("/og-preview", async (req, res) => {
  const { url } = req.body as { url?: string };

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "url is required" });
  }

  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  try {
    new URL(normalizedUrl);
  } catch {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    const { html, finalUrl } = await fetchHtml(normalizedUrl);
    return res.json(buildResult(html, finalUrl));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Could not fetch page. The site may block external requests.";
    return res.status(422).json({ error: msg });
  }
});

export default router;
