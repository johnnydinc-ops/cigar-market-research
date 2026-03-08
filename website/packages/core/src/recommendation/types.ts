/**
 * Recommendation engine: hybrid attribute + vector + RAG.
 * Provenance attached to results for "why recommended".
 */

import type { Cigar, Document } from "../schema/index.js";

/** Source of the recommendation: attribute_baseline, vector, rag, ml. */
export type RecommendationSource = "attribute_baseline" | "vector" | "rag" | "ml";

/** One recommended cigar with score and optional explanation + provenance. */
export interface RecommendationResult {
  cigar: Cigar;
  score: number;
  source: RecommendationSource;
  /** Short "why recommended" (from RAG or generated). */
  explanation?: string;
  /** Document IDs and citations for provenance. */
  provenance?: ProvenanceRef[];
}

export interface ProvenanceRef {
  documentId: string;
  citationUrl?: string;
  attribution?: string;
  snippet?: string;
}

/** Input: seed cigar + catalog to search + optional RAG docs. */
export interface RecommendationInput {
  seedCigar: Cigar;
  catalog: Cigar[];
  /** Pre-filter: only consider these cigar IDs (e.g. from vector search). */
  candidateIds?: Set<string>;
}

/** Options for hybrid recommendation. */
export interface RecommendationOptions {
  /** Max number of recommendations to return. */
  topK?: number;
  /** Min attribute similarity score 0–1 to include. */
  minScore?: number;
  /** If true, run RAG retrieval and attach explanations. */
  includeExplanations?: boolean;
}

/** RAG retriever: return relevant documents for a cigar (and optional query). */
export interface RAGRetriever {
  retrieve(cigarId: string, query?: string, options?: { limit?: number }): Promise<RAGResult[]>;
}

export interface RAGResult {
  document: Document;
  score: number;
  snippet?: string;
}

/** Vector store interface for similarity search (embedding-based). Implementations can use any backend. */
export interface VectorStore {
  /** Find nearest cigar/document IDs by vector. Returns (id, score) pairs. */
  nearest(vectorIdOrCigarId: string, options?: { limit?: number }): Promise<Array<{ id: string; score: number }>>;
}
