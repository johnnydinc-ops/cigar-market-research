/**
 * Run the Neptune Cigars scraper and log results.
 * Writes full scraped data to website/data/catalog/neptune-scraped.json.
 * Usage: npm run build && node dist/run-neptune.js
 * Or from workspace root: node packages/ingestion/dist/run-neptune.js
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPipeline, createNeptuneConnector, createObservability } from "./index.js";
/** Resolve website/data/catalog from packages/ingestion/dist. */
function getCatalogDir() {
    const dir = dirname(fileURLToPath(import.meta.url));
    return join(dir, "..", "..", "..", "data", "catalog");
}
async function main() {
    const maxDetailPages = process.env.NEPTUNE_MAX_DETAIL_PAGES
        ? parseInt(process.env.NEPTUNE_MAX_DETAIL_PAGES, 10)
        : 150;
    const connector = createNeptuneConnector(undefined, { maxDetailPages });
    const observability = createObservability();
    const result = await runPipeline({
        connectors: [connector],
        killSwitch: false,
        observability,
    });
    const catalogDir = getCatalogDir();
    mkdirSync(catalogDir, { recursive: true });
    const outPath = join(catalogDir, "neptune-scraped.json");
    const payload = {
        runAt: new Date().toISOString(),
        totals: {
            cigars: result.totalCigars,
            pricing: result.totalPricing,
            links: result.totalLinks,
            documents: result.totalDocuments,
            errors: result.errors,
        },
        results: result.results.map((r) => ({
            source: r.source,
            cigars: r.cigars,
            pricing: r.pricing ?? [],
            links: r.links ?? [],
            documents: r.documents ?? [],
            retailers: r.retailers ?? [],
            warnings: r.warnings,
            error: r.error,
        })),
    };
    writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
    console.log("\n--- Neptune scrape result ---");
    console.log("Cigars:", result.totalCigars);
    console.log("Pricing:", result.totalPricing);
    console.log("Links:", result.totalLinks);
    console.log("Documents (RAG):", result.totalDocuments);
    console.log("\nFull data written to:", outPath);
    if (result.errors.length > 0)
        console.log("Errors:", result.errors);
    const neptuneResult = result.results[0];
    if (neptuneResult?.warnings?.length) {
        console.log("Warnings:", neptuneResult.warnings);
    }
    if (neptuneResult && neptuneResult.cigars.length > 0) {
        console.log("\nSample cigars (first 5):");
        neptuneResult.cigars.slice(0, 5).forEach((c) => {
            console.log(`  - ${c.brand} ${c.line ?? ""} ${c.vitola ?? ""} (${c.id})`);
        });
    }
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=run-neptune.js.map