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
export async function runPipeline(opts: PipelineRunOptions): Promise<PipelineRunResult> {
  const { connectors, killSwitch, observability } = opts;
  const results: ConnectorResult[] = [];
  const errors: string[] = [];

  for (const connector of connectors) {
    const result = await connector.run({ killSwitch, observability });
    results.push(result);
    if (result.error) errors.push(`${connector.id}: ${result.error}`);
  }

  return {
    results,
    totalCigars: results.reduce((s, r) => s + r.cigars.length, 0),
    totalPricing: results.reduce((s, r) => s + (r.pricing?.length ?? 0), 0),
    totalLinks: results.reduce((s, r) => s + (r.links?.length ?? 0), 0),
    totalDocuments: results.reduce((s, r) => s + (r.documents?.length ?? 0), 0),
    errors,
  };
}
