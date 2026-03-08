import { z } from "zod";
/** Pack size for normalization (per-stick vs bundle). */
export declare const PackSizeSchema: z.ZodEnum<["single", "5-pack", "10-pack", "box", "bundle", "other"]>;
/** Price observation for a cigar at a retailer. */
export declare const PricingSchema: z.ZodObject<{
    id: z.ZodString;
    cigarId: z.ZodString;
    retailerId: z.ZodString;
    /** Price in USD (selling/our price). */
    amountCents: z.ZodNumber;
    currency: z.ZodLiteral<"USD">;
    packSize: z.ZodEnum<["single", "5-pack", "10-pack", "box", "bundle", "other"]>;
    /** Raw pack label from retailer (e.g. "Box of 10", "Tin of 20"). */
    packSizeLabel: z.ZodOptional<z.ZodString>;
    /** MSRP in cents when available. */
    msrpCents: z.ZodOptional<z.ZodNumber>;
    /** You-save amount in cents when available. */
    saveCents: z.ZodOptional<z.ZodNumber>;
    /** Per-stick equivalent when pack > 1 (for comparison). */
    perStickCents: z.ZodOptional<z.ZodNumber>;
    /** In stock at time of fetch. */
    inStock: z.ZodDefault<z.ZodBoolean>;
    /** Retailer's availability text (e.g. "In Stock", "Backorder"). */
    availabilityLabel: z.ZodOptional<z.ZodString>;
    /** When this price was observed. */
    fetchedAt: z.ZodDate;
    /** Source (affiliate feed, manual). */
    source: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    cigarId: string;
    retailerId: string;
    amountCents: number;
    currency: "USD";
    packSize: "single" | "5-pack" | "10-pack" | "box" | "bundle" | "other";
    inStock: boolean;
    fetchedAt: Date;
    source?: string | undefined;
    packSizeLabel?: string | undefined;
    msrpCents?: number | undefined;
    saveCents?: number | undefined;
    perStickCents?: number | undefined;
    availabilityLabel?: string | undefined;
}, {
    id: string;
    cigarId: string;
    retailerId: string;
    amountCents: number;
    currency: "USD";
    packSize: "single" | "5-pack" | "10-pack" | "box" | "bundle" | "other";
    fetchedAt: Date;
    source?: string | undefined;
    packSizeLabel?: string | undefined;
    msrpCents?: number | undefined;
    saveCents?: number | undefined;
    perStickCents?: number | undefined;
    inStock?: boolean | undefined;
    availabilityLabel?: string | undefined;
}>;
export type Pricing = z.infer<typeof PricingSchema>;
export type PackSize = z.infer<typeof PackSizeSchema>;
//# sourceMappingURL=pricing.d.ts.map