import { z } from "zod";

/** US-only retailer. We refer; we don't sell. */
export const RetailerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(128),
  domain: z.string().url().max(256).optional(),
  /** Affiliate program identifier (e.g. CJ, direct). */
  affiliateProgram: z.string().max(64).optional(),
  /** States where affiliate is allowed (e.g. CI restrictions). Empty = all. */
  allowedStates: z.array(z.string().length(2)).default([]),
  /** Trust score 0–1 for ranking (later). */
  trustScore: z.number().min(0).max(1).optional(),
  source: z.string().max(64).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type Retailer = z.infer<typeof RetailerSchema>;
