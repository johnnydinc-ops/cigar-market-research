/**
 * Hybrid recommendation: attribute baseline + optional RAG for explanations.
 * Vector path can be wired via VectorStore when available.
 */

import type {
  RecommendationInput,
  RecommendationOptions,
  RecommendationResult,
  RAGRetriever,
  RAGResult,
} from "./types.js";
import { attributeBaselineRecommendations } from "./attributeSimilarity.js";
import { generateExplanation } from "./explanationGenerator.js";

const DEFAULT_TOP_K = 5;
const DEFAULT_MIN_SCORE = 0.25;

/**
 * Recommend similar cigars: attribute baseline, optionally attach RAG explanations + provenance.
 */
export async function recommend(
  input: RecommendationInput,
  options: RecommendationOptions & { ragRetriever?: RAGRetriever } = {}
): Promise<RecommendationResult[]> {
  const { seedCigar, catalog, candidateIds } = input;
  const topK = options.topK ?? DEFAULT_TOP_K;
  const minScore = options.minScore ?? DEFAULT_MIN_SCORE;
  const includeExplanations = options.includeExplanations ?? false;
  const ragRetriever = options.ragRetriever;

  let catalogFiltered = catalog;
  if (candidateIds && candidateIds.size > 0) {
    catalogFiltered = catalog.filter((c) => candidateIds.has(c.id));
  }

  const baseline = attributeBaselineRecommendations(seedCigar, catalogFiltered, {
    topK,
    minScore,
  });

  const results: RecommendationResult[] = [];

  for (const { cigar, score } of baseline) {
    let explanation: string | undefined;
    let provenance: RecommendationResult["provenance"];

    if (includeExplanations && ragRetriever) {
      const ragResults: RAGResult[] = await ragRetriever.retrieve(cigar.id, undefined, { limit: 3 });
      const { explanation: expl, provenance: prov } = generateExplanation(cigar, ragResults);
      explanation = expl || undefined;
      provenance = prov.length > 0 ? prov : undefined;
    }

    results.push({
      cigar,
      score,
      source: "attribute_baseline",
      explanation,
      provenance,
    });
  }

  return results;
}
