import { z } from "zod";

/** Affiliate or direct link for a cigar at a retailer. We refer; disclosure required. */
export const LinkSchema = z.object({
  id: z.string().uuid(),
  cigarId: z.string().uuid(),
  retailerId: z.string().uuid(),
  /** Affiliate URL (or direct if no program). */
  url: z.string().url().max(2048),
  /** True if affiliate (FTC disclosure). */
  isAffiliate: z.boolean().default(true),
  source: z.string().max(64).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type Link = z.infer<typeof LinkSchema>;
