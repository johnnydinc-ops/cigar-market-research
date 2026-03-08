"use strict";
/**
 * Freshness labels and confidence from fetchedAt.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgeHours = getAgeHours;
exports.getFreshnessLabel = getFreshnessLabel;
exports.getMatchConfidence = getMatchConfidence;
const DEFAULT_FRESH_HOURS = 24;
const DEFAULT_RECENT_HOURS = 72;
function getAgeHours(fetchedAt) {
    return (Date.now() - new Date(fetchedAt).getTime()) / (1000 * 60 * 60);
}
function getFreshnessLabel(fetchedAt, options = {}) {
    const ageHours = getAgeHours(fetchedAt);
    const fresh = options.freshThresholdHours ?? DEFAULT_FRESH_HOURS;
    const recent = options.recentThresholdHours ?? DEFAULT_RECENT_HOURS;
    if (ageHours <= fresh)
        return "fresh";
    if (ageHours <= recent)
        return "recent";
    return "stale";
}
/**
 * Match confidence 0–1: higher when fresh and in stock.
 */
function getMatchConfidence(pricing, options = {}) {
    const label = getFreshnessLabel(pricing.fetchedAt, options);
    const inStock = pricing.inStock !== false;
    let freshnessScore = 0.5;
    if (label === "fresh")
        freshnessScore = 1;
    else if (label === "recent")
        freshnessScore = 0.7;
    else
        freshnessScore = 0.3;
    return inStock ? freshnessScore : freshnessScore * 0.5;
}
//# sourceMappingURL=freshness.js.map