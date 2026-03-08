/**
 * Pluggable ingestion pipeline: run connectors (affiliate feeds first, optional scrape).
 * Observability wired for all runs.
 */
/**
 * Run all connectors and aggregate results.
 */
export async function runPipeline(opts) {
    const { connectors, killSwitch, observability } = opts;
    const results = [];
    const errors = [];
    for (const connector of connectors) {
        const result = await connector.run({ killSwitch, observability });
        results.push(result);
        if (result.error)
            errors.push(`${connector.id}: ${result.error}`);
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
//# sourceMappingURL=pipeline.js.map