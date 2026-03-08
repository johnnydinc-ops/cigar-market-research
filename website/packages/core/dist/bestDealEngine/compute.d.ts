/**
 * Compute best deals for a cigar: normalize, label freshness, rank.
 */
import type { BestDealInput, BestDealOptions, DealRow } from "./types.js";
/**
 * Build deal rows for a cigar from pricing, retailers, and links.
 * Then rank by: match confidence → per-stick price → freshness → retailer trust.
 */
export declare function computeBestDeals(input: BestDealInput, options?: BestDealOptions): DealRow[];
//# sourceMappingURL=compute.d.ts.map