import { z } from "zod";

/** Substitute mapping: "if you like X, try Y". From ML, RAG, or curated. */
export const SubstituteSchema = z.object({
  id: z.string().uuid(),
  cigarId: z.string().uuid(),
  substituteId: z.string().uuid(),
  /** Similarity or confidence score 0–1. */
  score: z.number().min(0).max(1),
  /** Source: "ml", "rag", "curated", "attribute_baseline". */
  source: z.string().max(64),
  /** Optional explanation (from RAG). */
  explanationRef: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type Substitute = z.infer<typeof SubstituteSchema>;
