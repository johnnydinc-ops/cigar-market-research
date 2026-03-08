import { z } from "zod";

/** Pack size for normalization (per-stick vs bundle). */
export const PackSizeSchema = z.enum(["single", "5-pack", "10-pack", "box", "bundle", "other"]);

/** Price observation for a cigar at a retailer. */
export const PricingSchema = z.object({
  id: z.string().uuid(),
  cigarId: z.string().uuid(),
  retailerId: z.string().uuid(),
  /** Price in USD (selling/our price). */
  amountCents: z.number().int().nonnegative(),
  currency: z.literal("USD"),
  packSize: PackSizeSchema,
  /** Raw pack label from retailer (e.g. "Box of 10", "Tin of 20"). */
  packSizeLabel: z.string().max(128).optional(),
  /** MSRP in cents when available. */
  msrpCents: z.number().int().nonnegative().optional(),
  /** You-save amount in cents when available. */
  saveCents: z.number().int().nonnegative().optional(),
  /** Per-stick equivalent when pack > 1 (for comparison). */
  perStickCents: z.number().int().nonnegative().optional(),
  /** In stock at time of fetch. */
  inStock: z.boolean().default(true),
  /** Retailer's availability text (e.g. "In Stock", "Backorder"). */
  availabilityLabel: z.string().max(64).optional(),
  /** When this price was observed. */
  fetchedAt: z.coerce.date(),
  /** Source (affiliate feed, manual). */
  source: z.string().max(64).optional(),
});

export type Pricing = z.infer<typeof PricingSchema>;
export type PackSize = z.infer<typeof PackSizeSchema>;
