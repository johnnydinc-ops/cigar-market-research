"use strict";
/**
 * Compute best deals for a cigar: normalize, label freshness, rank.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeBestDeals = computeBestDeals;
const normalize_js_1 = require("./normalize.js");
const freshness_js_1 = require("./freshness.js");
const rank_js_1 = require("./rank.js");
const DEFAULT_OPTS = {
    inStockOnly: false,
    freshThresholdHours: 24,
    recentThresholdHours: 72,
};
/**
 * Build deal rows for a cigar from pricing, retailers, and links.
 * Then rank by: match confidence → per-stick price → freshness → retailer trust.
 */
function computeBestDeals(input, options = {}) {
    const opts = { ...DEFAULT_OPTS, ...options };
    const { cigarId, pricing, retailers, links } = input;
    const linkByRetailer = new Map();
    for (const link of links) {
        if (link.cigarId === cigarId)
            linkByRetailer.set(link.retailerId, link);
    }
    const rows = [];
    for (const p of pricing) {
        if (p.cigarId !== cigarId)
            continue;
        if (opts.inStockOnly && !p.inStock)
            continue;
        const retailer = retailers.get(p.retailerId);
        if (!retailer)
            continue;
        const normalized = (0, normalize_js_1.normalizePricingForComparison)(p);
        const ageHours = (0, freshness_js_1.getAgeHours)(p.fetchedAt);
        const freshnessLabel = (0, freshness_js_1.getFreshnessLabel)(p.fetchedAt, opts);
        const matchConfidence = (0, freshness_js_1.getMatchConfidence)(p, opts);
        rows.push({
            pricing: p,
            retailer,
            link: linkByRetailer.get(p.retailerId) ?? null,
            perStickCents: normalized.perStickCents,
            freshnessLabel,
            ageHours,
            matchConfidence,
        });
    }
    return (0, rank_js_1.rankDeals)(rows, opts);
}
//# sourceMappingURL=compute.js.map