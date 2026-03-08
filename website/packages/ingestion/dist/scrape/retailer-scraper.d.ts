/**
 * Generic retailer scraper: same attributes as Neptune (description, spec, rating, reviews, full pricing).
 * Each competitor connector uses this with retailer-specific config and optional custom extractors.
 */
import type { ConnectorResult } from "../connectors/types.js";
import type { ScrapeFetchOptions } from "./scrape-connector.js";
import type { FetchPageFn } from "./fetcher.js";
import { type ListingProduct, type ProductDetail } from "./retailer-shared.js";
export interface RetailerScraperConfig {
    id: string;
    source: string;
    sourceId: string;
    baseUrl: string;
    listingUrls: string[];
    retailerId: string;
    retailerName: string;
    maxDetailPages?: number;
    /** Optional sitemap URL to discover more listing/category URLs when main listing pages 403/404. */
    sitemapListingUrl?: string;
    /** Optional sitemap URL to get product URLs directly; fetch each as detail page and build one cigar per URL (bypasses listing). */
    sitemapProductUrl?: string;
    /** Max product URLs to fetch when using sitemapProductUrl (default 80). */
    maxProductUrlsFromSitemap?: number;
    /** Custom listing extractor; default uses extractListingProductsGeneric. */
    extractListing?: (html: string) => ListingProduct[];
    /** Custom detail extractor; default uses extractProductDetailGeneric. */
    extractDetail?: (html: string, productUrl: string) => ProductDetail;
    /** Page fetcher; default is fetch with browser-like headers + retries. Use Playwright for blocked sites. */
    fetchPage?: FetchPageFn;
}
export declare function createRetailerScraperFetch(config: RetailerScraperConfig): (opts: ScrapeFetchOptions) => Promise<ConnectorResult>;
//# sourceMappingURL=retailer-scraper.d.ts.map