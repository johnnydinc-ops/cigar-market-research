"use strict";
/**
 * Hybrid recommendation: attribute baseline + optional RAG for explanations.
 * Vector path can be wired via VectorStore when available.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommend = recommend;
const attributeSimilarity_js_1 = require("./attributeSimilarity.js");
const explanationGenerator_js_1 = require("./explanationGenerator.js");
const DEFAULT_TOP_K = 5;
const DEFAULT_MIN_SCORE = 0.25;
/**
 * Recommend similar cigars: attribute baseline, optionally attach RAG explanations + provenance.
 */
async function recommend(input, options = {}) {
    const { seedCigar, catalog, candidateIds } = input;
    const topK = options.topK ?? DEFAULT_TOP_K;
    const minScore = options.minScore ?? DEFAULT_MIN_SCORE;
    const includeExplanations = options.includeExplanations ?? false;
    const ragRetriever = options.ragRetriever;
    let catalogFiltered = catalog;
    if (candidateIds && candidateIds.size > 0) {
        catalogFiltered = catalog.filter((c) => candidateIds.has(c.id));
    }
    const baseline = (0, attributeSimilarity_js_1.attributeBaselineRecommendations)(seedCigar, catalogFiltered, {
        topK,
        minScore,
    });
    const results = [];
    for (const { cigar, score } of baseline) {
        let explanation;
        let provenance;
        if (includeExplanations && ragRetriever) {
            const ragResults = await ragRetriever.retrieve(cigar.id, undefined, { limit: 3 });
            const { explanation: expl, provenance: prov } = (0, explanationGenerator_js_1.generateExplanation)(cigar, ragResults);
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
//# sourceMappingURL=hybrid.js.map