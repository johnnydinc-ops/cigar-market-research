/**
 * Rank deals: match confidence → price (per-stick) → freshness → retailer trust score.
 * Trust guardrail: we do not sort by commission.
 */
import type { DealRow, BestDealOptions } from "./types.js";
export declare function rankDeals(rows: DealRow[], options: BestDealOptions): DealRow[];
//# sourceMappingURL=rank.d.ts.map