/**
 * Rank deals: match confidence → price (per-stick) → freshness → retailer trust score.
 * Trust guardrail: we do not sort by commission.
 */

import type { DealRow, BestDealOptions } from "./types.js";

const FRESH_ORDER: Record<string, number> = { fresh: 3, recent: 2, stale: 1 };

function compareDeals(a: DealRow, b: DealRow, _opts: BestDealOptions): number {
  // 1. Match confidence (higher first)
  if (b.matchConfidence !== a.matchConfidence) return b.matchConfidence - a.matchConfidence;
  // 2. Price per stick (lower first)
  if (a.perStickCents !== b.perStickCents) return a.perStickCents - b.perStickCents;
  // 3. Freshness (fresh first)
  const freshA = FRESH_ORDER[a.freshnessLabel] ?? 0;
  const freshB = FRESH_ORDER[b.freshnessLabel] ?? 0;
  if (freshB !== freshA) return freshB - freshA;
  // 4. Retailer trust score (higher first)
  const trustA = a.retailer.trustScore ?? 0;
  const trustB = b.retailer.trustScore ?? 0;
  return trustB - trustA;
}

export function rankDeals(rows: DealRow[], options: BestDealOptions): DealRow[] {
  return [...rows].sort((a, b) => compareDeals(a, b, options));
}
