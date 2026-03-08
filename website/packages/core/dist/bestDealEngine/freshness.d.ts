/**
 * Freshness labels and confidence from fetchedAt.
 */
import type { FreshnessLabel, MatchConfidence } from "./types.js";
export declare function getAgeHours(fetchedAt: Date): number;
export declare function getFreshnessLabel(fetchedAt: Date, options?: {
    freshThresholdHours?: number;
    recentThresholdHours?: number;
}): FreshnessLabel;
/**
 * Match confidence 0–1: higher when fresh and in stock.
 */
export declare function getMatchConfidence(pricing: {
    fetchedAt: Date;
    inStock?: boolean;
}, options?: {
    freshThresholdHours?: number;
    recentThresholdHours?: number;
}): MatchConfidence;
//# sourceMappingURL=freshness.d.ts.map