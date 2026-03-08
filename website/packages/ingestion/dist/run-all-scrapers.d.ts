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
export {};
//# sourceMappingURL=run-all-scrapers.d.ts.map