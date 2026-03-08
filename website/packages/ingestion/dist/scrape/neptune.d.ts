/**
 * Neptune Cigars scraper connector.
 * Fetches catalog, description, specification, rating, and user reviews from neptunecigar.com.
 * Emits RAG documents for reviews and product description. Respects ToS and rate limiter.
 */
import type { ConnectorResult } from "../connectors/types.js";
import type { ScrapeFetchOptions } from "./scrape-connector.js";
import type { ToSMetadata } from "./tos-metadata.schema.js";
import type { FetchPageFn } from "./fetcher.js";
import { ScrapeConnector } from "./scrape-connector.js";
export interface NeptuneConnectorOptions {
    tosMetadata: ToSMetadata;
    listingUrls?: string[];
    /** Max product detail pages to fetch per run (description, specs, reviews). Default 150. */
    maxDetailPages?: number;
    /** Page fetcher; default is fetch with browser-like headers + retries. Use Playwright for blocked sites. */
    fetchPage?: FetchPageFn;
}
export declare function createNeptuneFetch(options: NeptuneConnectorOptions): (opts: ScrapeFetchOptions) => Promise<ConnectorResult>;
export declare const NEPTUNE_TOS_METADATA: ToSMetadata;
export interface NeptuneConnectorCreateOptions {
    maxDetailPages?: number;
    fetchPage?: FetchPageFn;
}
export declare function createNeptuneConnector(tosMetadata?: ToSMetadata, opts?: NeptuneConnectorCreateOptions): ScrapeConnector;
//# sourceMappingURL=neptune.d.ts.map