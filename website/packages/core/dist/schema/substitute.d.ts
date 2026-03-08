import { z } from "zod";
/** Substitute mapping: "if you like X, try Y". From ML, RAG, or curated. */
export declare const SubstituteSchema: z.ZodObject<{
    id: z.ZodString;
    cigarId: z.ZodString;
    substituteId: z.ZodString;
    /** Similarity or confidence score 0–1. */
    score: z.ZodNumber;
    /** Source: "ml", "rag", "curated", "attribute_baseline". */
    source: z.ZodString;
    /** Optional explanation (from RAG). */
    explanationRef: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    source: string;
    cigarId: string;
    substituteId: string;
    score: number;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    explanationRef?: string | undefined;
}, {
    id: string;
    source: string;
    cigarId: string;
    substituteId: string;
    score: number;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    explanationRef?: string | undefined;
}>;
export type Substitute = z.infer<typeof SubstituteSchema>;
//# sourceMappingURL=substitute.d.ts.map