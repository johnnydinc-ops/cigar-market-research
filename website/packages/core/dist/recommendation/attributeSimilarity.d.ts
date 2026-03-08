/**
 * Attribute similarity baseline: same/similar wrapper, strength, body, origin.
 * No ML; used as fallback and for hybrid combination.
 */
import type { Cigar } from "../schema/index.js";
/**
 * Score 0–1: 1 = perfect attribute match. Same wrapper + close strength/body + same origin score highest.
 */
export declare function attributeSimilarityScore(seed: Cigar, candidate: Cigar): number;
/**
 * Rank catalog by attribute similarity to seed. Returns (cigar, score) sorted by score desc.
 */
export declare function attributeBaselineRecommendations(seed: Cigar, catalog: Cigar[], options?: {
    topK?: number;
    minScore?: number;
}): Array<{
    cigar: Cigar;
    score: number;
}>;
//# sourceMappingURL=attributeSimilarity.d.ts.map