/**
 * Normalize pricing: ensure per-stick equivalent for comparison.
 */
import type { Pricing } from "../schema/index.js";
/**
 * Compute per-stick cents from amountCents and packSize.
 * Uses PACK_STICK_COUNT for known pack sizes; "other" and unknown = 1.
 */
export declare function computePerStickCents(pricing: Pricing): number;
/**
 * Return pricing with perStickCents set if missing.
 */
export declare function normalizePricingForComparison(pricing: Pricing): Pricing & {
    perStickCents: number;
};
//# sourceMappingURL=normalize.d.ts.map