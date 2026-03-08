/**
 * Explanation generator: produce "why recommended" text with provenance.
 * Can be extended to use LLM with RAG context later.
 */
import type { Cigar } from "../schema/index.js";
import type { ProvenanceRef, RAGResult } from "./types.js";
export interface ExplanationWithProvenance {
    explanation: string;
    provenance: ProvenanceRef[];
}
/**
 * Generate explanation and provenance from RAG results for a recommended cigar.
 */
export declare function generateExplanation(candidate: Cigar, ragResults: RAGResult[]): ExplanationWithProvenance;
//# sourceMappingURL=explanationGenerator.d.ts.map