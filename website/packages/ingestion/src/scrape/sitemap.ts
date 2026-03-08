/**
 * Discover product/category URLs from sitemap.xml (and sitemap index).
 * Use to find working listing URLs for sites that 403/404 on guessed paths.
 */

export interface SitemapOptions {
  /** Only include URLs matching this pattern (e.g. /cigars/, /product/). */
  pathPattern?: RegExp;
  /** Max URLs to return per sitemap. */
  maxUrls?: number;
  /** Request timeout ms. */
  timeoutMs?: number;
}

const DEFAULT_PATTERN = /\/cigar|\/cigars|\/product|\.aspx\?|item\//i;

/**
 * Fetch and parse sitemap index or sitemap XML; follow index to get URLs.
 * Returns array of absolute URLs matching pathPattern.
 */
export async function discoverUrlsFromSitemap(
  sitemapUrl: string,
  options: SitemapOptions = {}
): Promise<string[]> {
  const { pathPattern = DEFAULT_PATTERN, maxUrls = 500, timeoutMs = 15000 } = options;
  const urls: string[] = [];
  const seen = new Set<string>();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(sitemapUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CigarIngestion/1.0; +https://github.com/cigar-research)",
        Accept: "application/xml, text/xml, */*",
      },
      redirect: "follow",
    });
    if (!res.ok) return [];
    const xml = await res.text();
    clearTimeout(timeout);

    const isIndex = /<sitemapindex/i.test(xml);
    if (isIndex) {
      const locs = xml.match(/<loc>([^<]+)<\/loc>/gi) ?? [];
      for (const loc of locs) {
        const href = loc.replace(/<\/?loc>/gi, "").trim();
        if (!href || seen.has(href)) continue;
        seen.add(href);
        const child = await discoverUrlsFromSitemap(href, { pathPattern, maxUrls: maxUrls - urls.length, timeoutMs });
        for (const u of child) {
          if (urls.length >= maxUrls) return urls;
          if (pathPattern.test(u) && !seen.has(u)) {
            seen.add(u);
            urls.push(u);
          }
        }
      }
      return urls;
    }

    const locs = xml.match(/<loc>([^<]+)<\/loc>/gi) ?? [];
    for (const loc of locs) {
      if (urls.length >= maxUrls) break;
      const href = loc.replace(/<\/?loc>/gi, "").trim();
      if (!href || !pathPattern.test(href) || seen.has(href)) continue;
      seen.add(href);
      urls.push(href);
    }
  } catch {
    // ignore fetch/parse errors
  } finally {
    clearTimeout(timeout);
  }
  return urls;
}

/**
 * Deduplicate listing URLs: group by path prefix (e.g. /cigars/ vs /cigars/something)
 * and return a few per "section" to use as listing seeds. Useful to turn 500 product URLs
 * into a handful of category/listing URLs for scraping.
 */
export function urlsToListingSeeds(urls: string[], _baseUrl: string, maxSeeds: number = 20): string[] {
  const byPrefix = new Map<string, string[]>();
  for (const u of urls) {
    try {
      const path = new URL(u).pathname;
      const parts = path.split("/").filter(Boolean);
      const prefix = parts.length >= 2 ? `/${parts[0]}/${parts[1]}` : path;
      if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
      byPrefix.get(prefix)!.push(u);
    } catch {
      // skip invalid
    }
  }
  const seeds: string[] = [];
  const entries = [...byPrefix.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [, list] of entries) {
    if (seeds.length >= maxSeeds) break;
    const first = list[0];
    if (first) seeds.push(first);
  }
  return seeds;
}
