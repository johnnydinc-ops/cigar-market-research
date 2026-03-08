"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubstituteSchema = void 0;
const zod_1 = require("zod");
/** Substitute mapping: "if you like X, try Y". From ML, RAG, or curated. */
exports.SubstituteSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cigarId: zod_1.z.string().uuid(),
    substituteId: zod_1.z.string().uuid(),
    /** Similarity or confidence score 0–1. */
    score: zod_1.z.number().min(0).max(1),
    /** Source: "ml", "rag", "curated", "attribute_baseline". */
    source: zod_1.z.string().max(64),
    /** Optional explanation (from RAG). */
    explanationRef: zod_1.z.string().uuid().optional(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=substitute.js.map