import { z } from "zod";
/** Strength 1–5 (mild to full). */
export declare const StrengthSchema: z.ZodOptional<z.ZodNumber>;
/** Body 1–5 (light to full). */
export declare const BodySchema: z.ZodOptional<z.ZodNumber>;
/** Common wrapper types (US market). */
export declare const WrapperTypeSchema: z.ZodEnum<["Connecticut", "Maduro", "Habano", "Corojo", "Candela", "Sumatra", "Ecuadorian", "Other"]>;
/** Country of origin (manufacture/origin). */
export declare const OriginSchema: z.ZodString;
/** Canonical cigar record. US-only; large catalog from day one. */
export declare const CigarSchema: z.ZodObject<{
    id: z.ZodString;
    /** External IDs by source (e.g. { "famous": "123", "ci": "456" }) */
    externalIds: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    brand: z.ZodString;
    line: z.ZodOptional<z.ZodString>;
    vitola: z.ZodOptional<z.ZodString>;
    /** e.g. "Robusto", "Toro", "Churchill" */
    sizeName: z.ZodOptional<z.ZodString>;
    lengthInches: z.ZodOptional<z.ZodNumber>;
    ringGauge: z.ZodOptional<z.ZodNumber>;
    wrapper: z.ZodOptional<z.ZodEnum<["Connecticut", "Maduro", "Habano", "Corojo", "Candela", "Sumatra", "Ecuadorian", "Other"]>>;
    strength: z.ZodOptional<z.ZodNumber>;
    body: z.ZodOptional<z.ZodNumber>;
    origin: z.ZodOptional<z.ZodString>;
    /** Flavor notes / descriptors (from reviews or taxonomy). */
    flavorNotes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Price band for filtering (e.g. "budget", "mid", "premium"). */
    priceBand: z.ZodOptional<z.ZodEnum<["budget", "mid", "premium"]>>;
    /** Product description (from retailer or manufacturer). */
    description: z.ZodOptional<z.ZodString>;
    /** Specification text or structured summary (e.g. "Strength: Medium, Wrapper: Ecuadorian Habano"). */
    specification: z.ZodOptional<z.ZodString>;
    /** Average user rating (e.g. 4.55). */
    ratingAverage: z.ZodOptional<z.ZodNumber>;
    /** Number of user reviews. */
    ratingCount: z.ZodOptional<z.ZodNumber>;
    /** Source of this record (affiliate feed, license, manual). */
    source: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    externalIds: Record<string, string>;
    brand: string;
    flavorNotes: string[];
    line?: string | undefined;
    vitola?: string | undefined;
    sizeName?: string | undefined;
    lengthInches?: number | undefined;
    ringGauge?: number | undefined;
    wrapper?: "Connecticut" | "Maduro" | "Habano" | "Corojo" | "Candela" | "Sumatra" | "Ecuadorian" | "Other" | undefined;
    strength?: number | undefined;
    body?: number | undefined;
    origin?: string | undefined;
    priceBand?: "budget" | "mid" | "premium" | undefined;
    description?: string | undefined;
    specification?: string | undefined;
    ratingAverage?: number | undefined;
    ratingCount?: number | undefined;
    source?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    id: string;
    brand: string;
    externalIds?: Record<string, string> | undefined;
    line?: string | undefined;
    vitola?: string | undefined;
    sizeName?: string | undefined;
    lengthInches?: number | undefined;
    ringGauge?: number | undefined;
    wrapper?: "Connecticut" | "Maduro" | "Habano" | "Corojo" | "Candela" | "Sumatra" | "Ecuadorian" | "Other" | undefined;
    strength?: number | undefined;
    body?: number | undefined;
    origin?: string | undefined;
    flavorNotes?: string[] | undefined;
    priceBand?: "budget" | "mid" | "premium" | undefined;
    description?: string | undefined;
    specification?: string | undefined;
    ratingAverage?: number | undefined;
    ratingCount?: number | undefined;
    source?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
export type Cigar = z.infer<typeof CigarSchema>;
export type WrapperType = z.infer<typeof WrapperTypeSchema>;
//# sourceMappingURL=cigar.d.ts.map