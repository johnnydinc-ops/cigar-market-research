import { z } from "zod";
/** US-only retailer. We refer; we don't sell. */
export declare const RetailerSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    domain: z.ZodOptional<z.ZodString>;
    /** Affiliate program identifier (e.g. CJ, direct). */
    affiliateProgram: z.ZodOptional<z.ZodString>;
    /** States where affiliate is allowed (e.g. CI restrictions). Empty = all. */
    allowedStates: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Trust score 0–1 for ranking (later). */
    trustScore: z.ZodOptional<z.ZodNumber>;
    source: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    allowedStates: string[];
    source?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    domain?: string | undefined;
    affiliateProgram?: string | undefined;
    trustScore?: number | undefined;
}, {
    id: string;
    name: string;
    source?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    domain?: string | undefined;
    affiliateProgram?: string | undefined;
    allowedStates?: string[] | undefined;
    trustScore?: number | undefined;
}>;
export type Retailer = z.infer<typeof RetailerSchema>;
//# sourceMappingURL=retailer.d.ts.map