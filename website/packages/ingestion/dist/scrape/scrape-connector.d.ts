/**
 * Optional scrape connector: OFF BY DEFAULT.
 * Only runs when explicitly enabled and when ToS metadata allows.
 * Uses: ToS metadata (checked-in), rate limiter, kill switch, observability.
 */
import type { IngestionConnector, ConnectorResult, ConnectorRunOptions } from "../connectors/types.js";
import { type ToSMetadata } from "./tos-metadata.schema.js";
import { RateLimiter } from "./rate-limiter.js";
export interface ScrapeConnectorConfig {
    id: string;
    source: string;
    /** ToS metadata (loaded from checked-in file or passed in). */
    tosMetadata: ToSMetadata;
    /** Fetch implementation (e.g. HTTP with robots check). Caller must respect rate limiter. */
    fetch: (opts: ScrapeFetchOptions) => Promise<ConnectorResult>;
}
export interface ScrapeFetchOptions {
    killSwitch: boolean;
    rateLimiter: RateLimiter | null;
    observability: ConnectorRunOptions["observability"];
}
/**
 * Scrape connector that enforces ToS metadata, rate limits, and kill switch.
 * Off-by-default: allowedUse must not be "none" and killSwitch must be false.
 */
export declare class ScrapeConnector implements IngestionConnector {
    readonly id: string;
    readonly source: string;
    private config;
    private rateLimiter;
    constructor(config: ScrapeConnectorConfig);
    run(opts: ConnectorRunOptions): Promise<ConnectorResult>;
}
//# sourceMappingURL=scrape-connector.d.ts.map