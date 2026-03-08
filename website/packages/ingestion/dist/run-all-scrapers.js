/**
 * Run all scrapers in parallel (Neptune + competitors from research).
 * Writes combined output to website/data/catalog/all-scraped.json and prints full stats.
 * ToS is loaded from tos-metadata/*.json per source; set allowedUse and killSwitch there.
 *
 * Methods: fetch with browser-like headers + retries first; then if USE_PLAYWRIGHT=1,
 * re-runs blocked sources (neptune, cigars-international, jr-cigars, thompson-cigar,
 * mikes-cigars, smoke-inn) with Playwright (headless browser) and merges results.
 *
 * Usage:
 *   npm run build && node dist/run-all-scrapers.js
 *   USE_PLAYWRIGHT=1 node dist/run-all-scrapers.js   # better stats on blocked sites
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createObservability, createNeptuneConnector, RETAILER_CONNECTOR_ENTRIES, createPlaywrightFetcher, } from "./index.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
function getCatalogDir() {
    return join(__dirname, "..", "..", "..", "data", "catalog");
}
function getTosDir() {
    return join(__dirname, "..", "tos-metadata");
}
function loadTos(sourceId) {
    const tosPath = join(getTosDir(), `${sourceId}.json`);
    if (!existsSync(tosPath))
        return undefined;
    const raw = readFileSync(tosPath, "utf8");
    return JSON.parse(raw);
}
const PLAYWRIGHT_CONNECTOR_IDS = new Set([
    "neptune",
    "cigars-international",
    "jr-cigars",
    "thompson-cigar",
    "mikes-cigars",
    "smoke-inn",
]);
async function main() {
    const maxDetailPages = process.env.MAX_DETAIL_PAGES
        ? parseInt(process.env.MAX_DETAIL_PAGES, 10)
        : 50;
    const usePlaywright = process.env.USE_PLAYWRIGHT === "1" || process.env.USE_PLAYWRIGHT === "true";
    const neptuneTos = loadTos("neptunecigars.com");
    const connectors = [
        createNeptuneConnector(neptuneTos, { maxDetailPages }),
        ...RETAILER_CONNECTOR_ENTRIES.map(({ sourceId, createConnector }) => createConnector(loadTos(sourceId))),
    ];
    const observability = createObservability();
    const connectorIds = ["neptune", ...RETAILER_CONNECTOR_ENTRIES.map((e) => e.connectorId)];
    console.log("\n--- Running all scrapers in parallel (fetch) ---\n");
    const start = Date.now();
    let results = await Promise.all(connectors.map((connector) => connector.run({ killSwitch: false, observability })));
    if (usePlaywright) {
        console.log("\n--- Re-running blocked sources with Playwright (browser, JS + anti-bot) ---\n");
        for (let i = 0; i < connectorIds.length; i++) {
            const id = connectorIds[i];
            if (!PLAYWRIGHT_CONNECTOR_IDS.has(id))
                continue;
            try {
                const { fetchPage, close } = await createPlaywrightFetcher({
                    timeoutMs: 35000,
                    waitUntil: "load",
                    waitAfterLoadMs: 2500,
                    waitForSelector: [
                        'a[href*="/p/"]',
                        'a[href*="/product/"]',
                        'a[href*="/cigar/"]',
                        ".product-item",
                        ".product-tile",
                        "[class*='product'] a",
                        "main",
                    ],
                    waitForSelectorTimeoutMs: 15000,
                    jitterMs: 800,
                    blockMedia: true,
                });
                const conn = id === "neptune"
                    ? createNeptuneConnector(neptuneTos, { maxDetailPages, fetchPage })
                    : (() => {
                        const entry = RETAILER_CONNECTOR_ENTRIES.find((e) => e.connectorId === id);
                        return entry ? entry.createConnector(loadTos(entry.sourceId), { fetchPage }) : null;
                    })();
                if (conn) {
                    const pwResult = await conn.run({ killSwitch: false, observability });
                    const existing = results[i];
                    if (pwResult.cigars.length > existing.cigars.length) {
                        results = results.slice(0, i).concat([pwResult], results.slice(i + 1));
                        console.log(`  [Playwright] ${id}: ${pwResult.cigars.length} cigars (replaced ${existing.cigars.length})`);
                    }
                    else {
                        console.log(`  [Playwright] ${id}: ${pwResult.cigars.length} cigars (kept fetch ${existing.cigars.length})`);
                    }
                    await close();
                }
            }
            catch (err) {
                console.warn(`  [Playwright] ${id} failed:`, err instanceof Error ? err.message : String(err));
            }
        }
    }
    const durationMs = Date.now() - start;
    const totalCigars = results.reduce((s, r) => s + r.cigars.length, 0);
    const totalPricing = results.reduce((s, r) => s + (r.pricing?.length ?? 0), 0);
    const totalLinks = results.reduce((s, r) => s + (r.links?.length ?? 0), 0);
    const totalDocuments = results.reduce((s, r) => s + (r.documents?.length ?? 0), 0);
    const errors = results.filter((r) => r.error).map((r) => r.source + ": " + r.error);
    const catalogDir = getCatalogDir();
    mkdirSync(catalogDir, { recursive: true });
    const outPath = join(catalogDir, "all-scraped.json");
    const payload = {
        runAt: new Date().toISOString(),
        durationMs,
        totals: {
            cigars: totalCigars,
            pricing: totalPricing,
            links: totalLinks,
            documents: totalDocuments,
            errors,
        },
        results: results.map((r) => ({
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
    // ---- Stats ----
    console.log("--- SCRAPE STATS ---\n");
    console.log("Runtime:", (durationMs / 1000).toFixed(1), "seconds");
    console.log("");
    console.log("TOTALS (all sources combined)");
    console.log("  Cigars:    ", totalCigars.toLocaleString());
    console.log("  Pricing:   ", totalPricing.toLocaleString());
    console.log("  Links:     ", totalLinks.toLocaleString());
    console.log("  Documents: ", totalDocuments.toLocaleString(), "(RAG corpus)");
    if (errors.length > 0)
        console.log("  Errors:    ", errors.length);
    console.log("");
    const bySource = [];
    for (const r of results) {
        const docs = r.documents ?? [];
        const attribute = docs.filter((d) => d.type === "attribute").length;
        const review = docs.filter((d) => d.type === "review").length;
        bySource.push({
            source: r.source,
            cigars: r.cigars.length,
            pricing: r.pricing?.length ?? 0,
            links: r.links?.length ?? 0,
            docs: docs.length,
            docTypes: { attribute, review },
        });
    }
    console.log("PER SOURCE");
    console.log("  " + "Source".padEnd(24) + "Cigars".padStart(10) + "Pricing".padStart(10) + "Links".padStart(10) + "Docs".padStart(8) + "  (attr / review)");
    console.log("  " + "-".repeat(24) + "-".repeat(10) + "-".repeat(10) + "-".repeat(10) + "-".repeat(8) + "  " + "-".repeat(14));
    for (const s of bySource) {
        const docBreakdown = `${s.docTypes.attribute} / ${s.docTypes.review}`;
        console.log("  " +
            s.source.slice(0, 22).padEnd(24) +
            s.cigars.toString().padStart(10) +
            s.pricing.toString().padStart(10) +
            s.links.toString().padStart(10) +
            s.docs.toString().padStart(8) +
            "  " +
            docBreakdown);
    }
    const totalAttr = bySource.reduce((sum, s) => sum + s.docTypes.attribute, 0);
    const totalReview = bySource.reduce((sum, s) => sum + s.docTypes.review, 0);
    console.log("");
    console.log("RAG CORPUS (for AI recommendations)");
    console.log("  Attribute docs (product description + spec):", totalAttr.toLocaleString());
    console.log("  Review docs (customer reviews):            ", totalReview.toLocaleString());
    console.log("  Total indexable documents:                 ", totalDocuments.toLocaleString());
    console.log("");
    console.log("Output file:", outPath);
    console.log("");
    console.log("RAG usage: see website/data/catalog/RAG_USAGE.md for how to use this data for AI cigar recommendations.");
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=run-all-scrapers.js.map