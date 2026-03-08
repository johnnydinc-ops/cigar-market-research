/**
 * Hybrid recommendation: attribute baseline + optional RAG for explanations.
 * Vector path can be wired via VectorStore when available.
 */
import type { RecommendationInput, RecommendationOptions, RecommendationResult, RAGRetriever } from "./types.js";
/**
 * Recommend similar cigars: attribute baseline, optionally attach RAG explanations + provenance.
 */
export declare function recommend(input: RecommendationInput, options?: RecommendationOptions & {
    ragRetriever?: RAGRetriever;
}): Promise<RecommendationResult[]>;
//# sourceMappingURL=hybrid.d.ts.map