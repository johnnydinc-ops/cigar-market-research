/**
 * Price history storage for later graphs.
 * Schema only; persistence is adapter-specific (e.g. DB, file).
 */

import { z } from "zod";
import { PackSizeSchema } from "../schema/pricing.js";

/** One historical price point for a cigar at a retailer. */
export const PriceHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  cigarId: z.string().uuid(),
  retailerId: z.string().uuid(),
  amountCents: z.number().int().nonnegative(),
  currency: z.literal("USD"),
  packSize: PackSizeSchema,
  perStickCents: z.number().int().nonnegative().optional(),
  inStock: z.boolean().default(true),
  /** When this price was observed (stored for history). */
  observedAt: z.coerce.date(),
  source: z.string().max(64).optional(),
});

export type PriceHistoryEntry = z.infer<typeof PriceHistoryEntrySchema>;

/**
 * Interface for appending and querying price history.
 * Implementations can use SQL, Redis, or file-based storage.
 */
export interface PriceHistoryStore {
  append(entry: PriceHistoryEntry): Promise<void>;
  /** Get history for a cigar at a retailer (e.g. for graphs). */
  getHistory(cigarId: string, retailerId: string, options?: { limit?: number }): Promise<PriceHistoryEntry[]>;
}
