/**
 * Pluggable ingestion: feeds-first, optional scrape with guardrails.
 * US-only; licensed/public/affiliate first.
 */
import type { Cigar, Pricing, Retailer, Link, Document } from "@cigar/core";
/** Result of a single connector run (catalog + optional pricing/links/documents). */
export interface ConnectorResult {
    source: string;
    cigars: Cigar[];
    pricing?: Pricing[];
    links?: Link[];
    documents?: Document[];
    retailers?: Retailer[];
    /** Warnings (e.g. partial feed, rate limit). */
    warnings: string[];
    /** Fatal error if run failed. */
    error?: string;
}
/** Connector interface: fetch from a source and return normalized entities. */
export interface IngestionConnector {
    readonly id: string;
    readonly source: string;
    /** Run the connector. Implementations should respect kill switch and rate limits. */
    run(opts: ConnectorRunOptions): Promise<ConnectorResult>;
}
export interface ConnectorRunOptions {
    /** If true, connector should abort (kill switch). */
    killSwitch?: boolean;
    /** Optional observability sink for events. */
    observability?: IngestionObservability;
}
/** Observability: log events for monitoring (no PII). */
export interface IngestionObservability {
    onStart?(connectorId: string): void;
    onItem?(connectorId: string, kind: "cigar" | "pricing" | "link" | "document", count: number): void;
    onWarning?(connectorId: string, message: string): void;
    onError?(connectorId: string, message: string): void;
    onEnd?(connectorId: string, durationMs: number, totalItems: number): void;
}
//# sourceMappingURL=types.d.ts.map