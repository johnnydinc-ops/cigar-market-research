/**
 * Primary path: affiliate network feeds + retailer affiliate APIs/feeds.
 * No scraping; uses official product/price feeds where available.
 */
import type { IngestionConnector, ConnectorResult, ConnectorRunOptions } from "./types.js";
export interface AffiliateFeedConfig {
    id: string;
    source: string;
    /** Fetch function: in practice would call CJ, retailer API, or read a feed URL. */
    fetch: (opts: {
        killSwitch?: boolean;
    }) => Promise<AffiliateFeedRaw>;
}
/** Raw feed shape (affiliate-specific); adapter maps to our schema. */
export interface AffiliateFeedRaw {
    products?: Array<{
        id: string;
        name?: string;
        brand?: string;
        priceCents?: number;
        url?: string;
        inStock?: boolean;
        [key: string]: unknown;
    }>;
    retailer?: {
        id: string;
        name: string;
        domain?: string;
    };
}
/**
 * Connector that consumes an affiliate feed and normalizes to Cigar, Pricing, Link, Retailer.
 * Stage 2 stub: fetch is provided by caller (real CJ/API integration later).
 */
export declare class AffiliateFeedConnector implements IngestionConnector {
    readonly id: string;
    readonly source: string;
    private config;
    constructor(config: AffiliateFeedConfig);
    run(opts: ConnectorRunOptions): Promise<ConnectorResult>;
}
//# sourceMappingURL=affiliate-feed.d.ts.map