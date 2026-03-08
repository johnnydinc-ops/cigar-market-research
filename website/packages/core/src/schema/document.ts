import { z } from "zod";

/** RAG corpus document: reviews, tasting notes, expert content. Provenance for "why recommended". */
export const DocumentSchema = z.object({
  id: z.string().uuid(),
  /** Source identifier (e.g. "halfwheel", "cigar_aficionado"). */
  source: z.string().min(1).max(64),
  /** Document type for retrieval. */
  type: z.enum(["review", "tasting_note", "expert", "attribute", "substitute_mapping"]),
  /** Raw or normalized content for embedding/retrieval. */
  content: z.string().min(1),
  /** Optional reference to embedding store (e.g. vector ID). */
  embeddingRef: z.string().max(256).optional(),
  /** Cigar IDs this document refers to (for filtering). */
  cigarRefs: z.array(z.string().uuid()).default([]),
  /** URL or citation for provenance. */
  citationUrl: z.string().url().max(2048).optional(),
  /** License/attribution. */
  attribution: z.string().max(256).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type Document = z.infer<typeof DocumentSchema>;
