import { useEffect } from "react";

const SITE_URL = "https://xtoolkit.live";

interface SeoHeadProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  path?: string;
  keywords?: string;
  extraSchemas?: object[];
}

export function SeoHead({ title, description, ogTitle, ogDescription, path, keywords, extraSchemas }: SeoHeadProps) {
  useEffect(() => {
    const canonicalUrl = path ? `${SITE_URL}${path}` : SITE_URL;

    const prev = document.title;
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    metaDesc?.setAttribute("content", description);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const prevKeywords = metaKeywords?.getAttribute("content") ?? "";
    if (keywords && metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    }

    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    const prevOgTitle = metaOgTitle?.getAttribute("content") ?? "";
    metaOgTitle?.setAttribute("content", ogTitle || title);

    const metaOgDesc = document.querySelector('meta[property="og:description"]');
    const prevOgDesc = metaOgDesc?.getAttribute("content") ?? "";
    metaOgDesc?.setAttribute("content", ogDescription || description);

    const metaOgUrl = document.querySelector('meta[property="og:url"]');
    const prevOgUrl = metaOgUrl?.getAttribute("content") ?? "";
    metaOgUrl?.setAttribute("content", canonicalUrl);

    const metaTwitterTitle = document.querySelector('meta[name="twitter:title"]');
    const prevTwitterTitle = metaTwitterTitle?.getAttribute("content") ?? "";
    metaTwitterTitle?.setAttribute("content", ogTitle || title);

    const metaTwitterDesc = document.querySelector('meta[name="twitter:description"]');
    const prevTwitterDesc = metaTwitterDesc?.getAttribute("content") ?? "";
    metaTwitterDesc?.setAttribute("content", ogDescription || description);

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonicalEl?.getAttribute("href") ?? "";
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      (canonicalEl as HTMLLinkElement).rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonicalUrl);

    const injectedScripts: HTMLScriptElement[] = [];

    if (extraSchemas && extraSchemas.length > 0) {
      extraSchemas.forEach((schema, i) => {
        const el = document.createElement("script");
        el.id = `extra-schema-${i}`;
        el.type = "application/ld+json";
        el.textContent = JSON.stringify(schema);
        document.head.appendChild(el);
        injectedScripts.push(el);
      });
    }

    return () => {
      document.title = prev;
      metaDesc?.setAttribute("content", prevDesc);
      if (keywords && metaKeywords) metaKeywords.setAttribute("content", prevKeywords);
      metaOgTitle?.setAttribute("content", prevOgTitle);
      metaOgDesc?.setAttribute("content", prevOgDesc);
      metaOgUrl?.setAttribute("content", prevOgUrl);
      metaTwitterTitle?.setAttribute("content", prevTwitterTitle);
      metaTwitterDesc?.setAttribute("content", prevTwitterDesc);
      canonicalEl?.setAttribute("href", prevCanonical);
      injectedScripts.forEach((el) => el.remove());
    };
  }, [title, description, ogTitle, ogDescription, path, keywords, extraSchemas]);

  return null;
}
