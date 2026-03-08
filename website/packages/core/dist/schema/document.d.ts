import { z } from "zod";
/** RAG corpus document: reviews, tasting notes, expert content. Provenance for "why recommended". */
export declare const DocumentSchema: z.ZodObject<{
    id: z.ZodString;
    /** Source identifier (e.g. "halfwheel", "cigar_aficionado"). */
    source: z.ZodString;
    /** Document type for retrieval. */
    type: z.ZodEnum<["review", "tasting_note", "expert", "attribute", "substitute_mapping"]>;
    /** Raw or normalized content for embedding/retrieval. */
    content: z.ZodString;
    /** Optional reference to embedding store (e.g. vector ID). */
    embeddingRef: z.ZodOptional<z.ZodString>;
    /** Cigar IDs this document refers to (for filtering). */
    cigarRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** URL or citation for provenance. */
    citationUrl: z.ZodOptional<z.ZodString>;
    /** License/attribution. */
    attribution: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "review" | "tasting_note" | "expert" | "attribute" | "substitute_mapping";
    source: string;
    content: string;
    cigarRefs: string[];
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    embeddingRef?: string | undefined;
    citationUrl?: string | undefined;
    attribution?: string | undefined;
}, {
    id: string;
    type: "review" | "tasting_note" | "expert" | "attribute" | "substitute_mapping";
    source: string;
    content: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    embeddingRef?: string | undefined;
    cigarRefs?: string[] | undefined;
    citationUrl?: string | undefined;
    attribution?: string | undefined;
}>;
export type Document = z.infer<typeof DocumentSchema>;
//# sourceMappingURL=document.d.ts.map