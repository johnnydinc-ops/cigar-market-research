/**
 * Normalize pricing: ensure per-stick equivalent for comparison.
 */

import type { Pricing } from "../schema/index.js";
import { PACK_STICK_COUNT } from "./types.js";

/**
 * Compute per-stick cents from amountCents and packSize.
 * Uses PACK_STICK_COUNT for known pack sizes; "other" and unknown = 1.
 */
export function computePerStickCents(pricing: Pricing): number {
  if (pricing.perStickCents != null && pricing.perStickCents >= 0) {
    return pricing.perStickCents;
  }
  const sticks = PACK_STICK_COUNT[pricing.packSize] ?? 1;
  return Math.round(pricing.amountCents / sticks);
}

/**
 * Return pricing with perStickCents set if missing.
 */
export function normalizePricingForComparison(pricing: Pricing): Pricing & { perStickCents: number } {
  const perStickCents = computePerStickCents(pricing);
  return {
    ...pricing,
    perStickCents: pricing.perStickCents ?? perStickCents,
  };
}
