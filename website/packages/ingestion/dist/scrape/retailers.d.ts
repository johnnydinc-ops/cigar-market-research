/**
 * Scrapers for each competitor from research (RETAILER_LANDSCAPE.md).
 * Same attributes as Neptune: description, specification, rating, reviews, full pricing.
 * ToS metadata: all disabled by default (allowedUse: "none", killSwitch: true) until permission/legal review.
 */
import type { ToSMetadata } from "./tos-metadata.schema.js";
import type { FetchPageFn } from "./fetcher.js";
import { ScrapeConnector } from "./scrape-connector.js";
export interface RetailerConnectorOptions {
    fetchPage?: FetchPageFn;
}
export declare function createFamousSmokeConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector;
export declare function createCigarsInternationalConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector;
export declare function createJRCigarsConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector;
export declare function createThompsonCigarConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector;
export declare function createHoltsConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector;
export declare function createGothamCigarsConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector;
export declare function createMikesCigarsConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector;
export declare function createSmokeInnConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector;
/** All competitor connectors from research (Tier 1 + Tier 2 + Smoke Inn). */
export declare const ALL_RETAILER_CONNECTORS: (typeof createFamousSmokeConnector)[];
/** Entries for run-all-scrapers: load tos-metadata/{sourceId}.json and pass to createConnector. */
export declare const RETAILER_CONNECTOR_ENTRIES: Array<{
    sourceId: string;
    connectorId: string;
    createConnector: (tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions) => ScrapeConnector;
}>;
//# sourceMappingURL=retailers.d.ts.map