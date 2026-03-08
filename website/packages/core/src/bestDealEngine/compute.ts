/**
 * Compute best deals for a cigar: normalize, label freshness, rank.
 */

import type { Link } from "../schema/index.js";
import type { BestDealInput, BestDealOptions, DealRow } from "./types.js";
import { normalizePricingForComparison } from "./normalize.js";
import { getFreshnessLabel, getMatchConfidence, getAgeHours } from "./freshness.js";
import { rankDeals } from "./rank.js";

const DEFAULT_OPTS: Required<Pick<BestDealOptions, "inStockOnly" | "freshThresholdHours" | "recentThresholdHours">> = {
  inStockOnly: false,
  freshThresholdHours: 24,
  recentThresholdHours: 72,
};

/**
 * Build deal rows for a cigar from pricing, retailers, and links.
 * Then rank by: match confidence → per-stick price → freshness → retailer trust.
 */
export function computeBestDeals(
  input: BestDealInput,
  options: BestDealOptions = {}
): DealRow[] {
  const opts = { ...DEFAULT_OPTS, ...options };
  const { cigarId, pricing, retailers, links } = input;

  const linkByRetailer = new Map<string, Link>();
  for (const link of links) {
    if (link.cigarId === cigarId) linkByRetailer.set(link.retailerId, link);
  }

  const rows: DealRow[] = [];

  for (const p of pricing) {
    if (p.cigarId !== cigarId) continue;
    if (opts.inStockOnly && !p.inStock) continue;

    const retailer = retailers.get(p.retailerId);
    if (!retailer) continue;

    const normalized = normalizePricingForComparison(p);
    const ageHours = getAgeHours(p.fetchedAt);
    const freshnessLabel = getFreshnessLabel(p.fetchedAt, opts);
    const matchConfidence = getMatchConfidence(p, opts);

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

  return rankDeals(rows, opts);
}
