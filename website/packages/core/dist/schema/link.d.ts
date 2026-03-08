import { z } from "zod";
/** Affiliate or direct link for a cigar at a retailer. We refer; disclosure required. */
export declare const LinkSchema: z.ZodObject<{
    id: z.ZodString;
    cigarId: z.ZodString;
    retailerId: z.ZodString;
    /** Affiliate URL (or direct if no program). */
    url: z.ZodString;
    /** True if affiliate (FTC disclosure). */
    isAffiliate: z.ZodDefault<z.ZodBoolean>;
    source: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    cigarId: string;
    retailerId: string;
    url: string;
    isAffiliate: boolean;
    source?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    id: string;
    cigarId: string;
    retailerId: string;
    url: string;
    source?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    isAffiliate?: boolean | undefined;
}>;
export type Link = z.infer<typeof LinkSchema>;
//# sourceMappingURL=link.d.ts.map