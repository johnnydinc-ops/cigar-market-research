/**
 * Explanation generator: produce "why recommended" text with provenance.
 * Can be extended to use LLM with RAG context later.
 */

import type { Cigar } from "../schema/index.js";
import type { ProvenanceRef, RAGResult } from "./types.js";
import { explainFromRAGResults, formatCigarName, provenanceFromRAGResults } from "./rag.js";

export interface ExplanationWithProvenance {
  explanation: string;
  provenance: ProvenanceRef[];
}

/**
 * Generate explanation and provenance from RAG results for a recommended cigar.
 */
export function generateExplanation(
  candidate: Cigar,
  ragResults: RAGResult[]
): ExplanationWithProvenance {
  const name = formatCigarName(candidate);
  const explanation = explainFromRAGResults(name, ragResults);
  const provenance = provenanceFromRAGResults(ragResults);
  return { explanation, provenance };
}
