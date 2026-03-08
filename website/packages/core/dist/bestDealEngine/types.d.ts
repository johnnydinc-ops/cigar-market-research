/**
 * Best-deal engine: normalize by pack size, freshness, rank by price → freshness → trust.
 * Trust differentiator: unbiased ranking; no pay-to-rank.
 */
import type { Pricing, Retailer, Link } from "../schema/index.js";
/** Stick count per pack for per-stick normalization (convention; box/bundle may vary). */
export declare const PACK_STICK_COUNT: Record<string, number>;
/** Freshness label based on fetchedAt age. */
export type FreshnessLabel = "fresh" | "recent" | "stale";
/** Confidence 0–1 for display (e.g. based on freshness and in-stock). */
export type MatchConfidence = number;
/** Single deal row: pricing + retailer + link + freshness + comparable price. */
export interface DealRow {
    pricing: Pricing;
    retailer: Retailer;
    link: Link | null;
    /** Per-stick cents for comparison (computed if missing). */
    perStickCents: number;
    freshnessLabel: FreshnessLabel;
    /** Age in hours since fetchedAt. */
    ageHours: number;
    /** 0–1; higher = more confident (fresh + in stock). */
    matchConfidence: MatchConfidence;
}
/** Input to compute best deals for a cigar. */
export interface BestDealInput {
    cigarId: string;
    pricing: Pricing[];
    retailers: Map<string, Retailer>;
    links: Link[];
}
/** Options for ranking (trust guardrails: we sort by these, not by commission). */
export interface BestDealOptions {
    /** Prefer in-stock only. */
    inStockOnly?: boolean;
    /** Max age in hours for "fresh" (default 24). */
    freshThresholdHours?: number;
    /** Max age for "recent" (default 72). Beyond = stale. */
    recentThresholdHours?: number;
}
//# sourceMappingURL=types.d.ts.map