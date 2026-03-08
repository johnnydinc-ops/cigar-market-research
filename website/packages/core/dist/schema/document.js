"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSchema = void 0;
const zod_1 = require("zod");
/** RAG corpus document: reviews, tasting notes, expert content. Provenance for "why recommended". */
exports.DocumentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    /** Source identifier (e.g. "halfwheel", "cigar_aficionado"). */
    source: zod_1.z.string().min(1).max(64),
    /** Document type for retrieval. */
    type: zod_1.z.enum(["review", "tasting_note", "expert", "attribute", "substitute_mapping"]),
    /** Raw or normalized content for embedding/retrieval. */
    content: zod_1.z.string().min(1),
    /** Optional reference to embedding store (e.g. vector ID). */
    embeddingRef: zod_1.z.string().max(256).optional(),
    /** Cigar IDs this document refers to (for filtering). */
    cigarRefs: zod_1.z.array(zod_1.z.string().uuid()).default([]),
    /** URL or citation for provenance. */
    citationUrl: zod_1.z.string().url().max(2048).optional(),
    /** License/attribution. */
    attribution: zod_1.z.string().max(256).optional(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=document.js.map