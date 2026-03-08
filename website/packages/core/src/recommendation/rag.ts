/**
 * RAG retrieval and explanation generator with provenance.
 * Grounds "why recommended" in real document content.
 */

import type { RAGResult, ProvenanceRef } from "./types.js";

const MAX_SNIPPET_LEN = 160;

/**
 * Build provenance refs from RAG results (document ID, citation, attribution, snippet).
 */
export function provenanceFromRAGResults(results: RAGResult[]): ProvenanceRef[] {
  return results.map((r) => ({
    documentId: r.document.id,
    citationUrl: r.document.citationUrl,
    attribution: r.document.attribution,
    snippet: r.snippet ?? (r.document.content.slice(0, MAX_SNIPPET_LEN) + (r.document.content.length > MAX_SNIPPET_LEN ? "…" : "")),
  }));
}

/**
 * Generate a short "why recommended" explanation from RAG results.
 * Uses first document's content or snippet; can be replaced by LLM later.
 */
export function explainFromRAGResults(
  candidateName: string,
  results: RAGResult[]
): string {
  if (results.length === 0) return "";
  const first = results[0];
  const snippet = first.snippet ?? first.document.content.slice(0, MAX_SNIPPET_LEN);
  return `Recommended: ${candidateName}. ${snippet}${snippet.length >= MAX_SNIPPET_LEN ? "…" : ""}`;
}

/**
 * Format candidate name (brand + line/vitola).
 */
export function formatCigarName(cigar: { brand: string; line?: string; vitola?: string }): string {
  const parts = [cigar.brand];
  if (cigar.line) parts.push(cigar.line);
  if (cigar.vitola) parts.push(cigar.vitola);
  return parts.join(" ");
}
