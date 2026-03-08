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
/**
 * Fetch and parse sitemap index or sitemap XML; follow index to get URLs.
 * Returns array of absolute URLs matching pathPattern.
 */
export declare function discoverUrlsFromSitemap(sitemapUrl: string, options?: SitemapOptions): Promise<string[]>;
/**
 * Deduplicate listing URLs: group by path prefix (e.g. /cigars/ vs /cigars/something)
 * and return a few per "section" to use as listing seeds. Useful to turn 500 product URLs
 * into a handful of category/listing URLs for scraping.
 */
export declare function urlsToListingSeeds(urls: string[], _baseUrl: string, maxSeeds?: number): string[];
//# sourceMappingURL=sitemap.d.ts.map