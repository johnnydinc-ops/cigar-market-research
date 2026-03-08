/**
 * Price history storage for later graphs.
 * Schema only; persistence is adapter-specific (e.g. DB, file).
 */
import { z } from "zod";
/** One historical price point for a cigar at a retailer. */
export declare const PriceHistoryEntrySchema: z.ZodObject<{
    id: z.ZodString;
    cigarId: z.ZodString;
    retailerId: z.ZodString;
    amountCents: z.ZodNumber;
    currency: z.ZodLiteral<"USD">;
    packSize: z.ZodEnum<["single", "5-pack", "10-pack", "box", "bundle", "other"]>;
    perStickCents: z.ZodOptional<z.ZodNumber>;
    inStock: z.ZodDefault<z.ZodBoolean>;
    /** When this price was observed (stored for history). */
    observedAt: z.ZodDate;
    source: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    cigarId: string;
    retailerId: string;
    amountCents: number;
    currency: "USD";
    packSize: "single" | "5-pack" | "10-pack" | "box" | "bundle" | "other";
    inStock: boolean;
    observedAt: Date;
    source?: string | undefined;
    perStickCents?: number | undefined;
}, {
    id: string;
    cigarId: string;
    retailerId: string;
    amountCents: number;
    currency: "USD";
    packSize: "single" | "5-pack" | "10-pack" | "box" | "bundle" | "other";
    observedAt: Date;
    source?: string | undefined;
    perStickCents?: number | undefined;
    inStock?: boolean | undefined;
}>;
export type PriceHistoryEntry = z.infer<typeof PriceHistoryEntrySchema>;
/**
 * Interface for appending and querying price history.
 * Implementations can use SQL, Redis, or file-based storage.
 */
export interface PriceHistoryStore {
    append(entry: PriceHistoryEntry): Promise<void>;
    /** Get history for a cigar at a retailer (e.g. for graphs). */
    getHistory(cigarId: string, retailerId: string, options?: {
        limit?: number;
    }): Promise<PriceHistoryEntry[]>;
}
//# sourceMappingURL=priceHistory.d.ts.map