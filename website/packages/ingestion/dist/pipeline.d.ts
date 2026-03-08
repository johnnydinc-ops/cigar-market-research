/**
 * Pluggable ingestion pipeline: run connectors (affiliate feeds first, optional scrape).
 * Observability wired for all runs.
 */
import type { IngestionConnector, ConnectorResult, IngestionObservability } from "./connectors/types.js";
export interface PipelineRunOptions {
    /** Connectors to run in order. */
    connectors: IngestionConnector[];
    /** Global kill switch (passed to each connector). */
    killSwitch?: boolean;
    /** Observability sink. */
    observability?: IngestionObservability;
}
export interface PipelineRunResult {
    results: ConnectorResult[];
    totalCigars: number;
    totalPricing: number;
    totalLinks: number;
    totalDocuments: number;
    errors: string[];
}
/**
 * Run all connectors and aggregate results.
 */
export declare function runPipeline(opts: PipelineRunOptions): Promise<PipelineRunResult>;
//# sourceMappingURL=pipeline.d.ts.map