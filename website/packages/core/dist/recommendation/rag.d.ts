/**
 * RAG retrieval and explanation generator with provenance.
 * Grounds "why recommended" in real document content.
 */
import type { RAGResult, ProvenanceRef } from "./types.js";
/**
 * Build provenance refs from RAG results (document ID, citation, attribution, snippet).
 */
export declare function provenanceFromRAGResults(results: RAGResult[]): ProvenanceRef[];
/**
 * Generate a short "why recommended" explanation from RAG results.
 * Uses first document's content or snippet; can be replaced by LLM later.
 */
export declare function explainFromRAGResults(candidateName: string, results: RAGResult[]): string;
/**
 * Format candidate name (brand + line/vitola).
 */
export declare function formatCigarName(cigar: {
    brand: string;
    line?: string;
    vitola?: string;
}): string;
//# sourceMappingURL=rag.d.ts.map