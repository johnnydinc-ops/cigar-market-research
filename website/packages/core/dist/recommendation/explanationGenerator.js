"use strict";
/**
 * Explanation generator: produce "why recommended" text with provenance.
 * Can be extended to use LLM with RAG context later.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExplanation = generateExplanation;
const rag_js_1 = require("./rag.js");
/**
 * Generate explanation and provenance from RAG results for a recommended cigar.
 */
function generateExplanation(candidate, ragResults) {
    const name = (0, rag_js_1.formatCigarName)(candidate);
    const explanation = (0, rag_js_1.explainFromRAGResults)(name, ragResults);
    const provenance = (0, rag_js_1.provenanceFromRAGResults)(ragResults);
    return { explanation, provenance };
}
//# sourceMappingURL=explanationGenerator.js.map