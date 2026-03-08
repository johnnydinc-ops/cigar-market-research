"use strict";
/**
 * Normalize pricing: ensure per-stick equivalent for comparison.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePerStickCents = computePerStickCents;
exports.normalizePricingForComparison = normalizePricingForComparison;
const types_js_1 = require("./types.js");
/**
 * Compute per-stick cents from amountCents and packSize.
 * Uses PACK_STICK_COUNT for known pack sizes; "other" and unknown = 1.
 */
function computePerStickCents(pricing) {
    if (pricing.perStickCents != null && pricing.perStickCents >= 0) {
        return pricing.perStickCents;
    }
    const sticks = types_js_1.PACK_STICK_COUNT[pricing.packSize] ?? 1;
    return Math.round(pricing.amountCents / sticks);
}
/**
 * Return pricing with perStickCents set if missing.
 */
function normalizePricingForComparison(pricing) {
    const perStickCents = computePerStickCents(pricing);
    return {
        ...pricing,
        perStickCents: pricing.perStickCents ?? perStickCents,
    };
}
//# sourceMappingURL=normalize.js.map