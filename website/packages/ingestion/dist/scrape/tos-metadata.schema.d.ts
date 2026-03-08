/**
 * ToS metadata: checked-in, per-source. Required for any scrape connector.
 * Rate limits, robots policy, and allowed-use must be explicit.
 */
import { z } from "zod";
export declare const ToSMetadataSchema: z.ZodObject<{
    /** Source id (e.g. retailer domain key). */
    sourceId: z.ZodString;
    /** Human-readable source name. */
    sourceName: z.ZodString;
    /** URL to terms of service or robots.txt. */
    tosUrl: z.ZodOptional<z.ZodString>;
    robotsUrl: z.ZodOptional<z.ZodString>;
    /** Last date this was reviewed. */
    lastReviewedAt: z.ZodOptional<z.ZodString>;
    /** Allowed use: e.g. "none" | "public-pages-only" | "with-rate-limit". */
    allowedUse: z.ZodEnum<["none", "public-pages-only", "with-rate-limit", "with-partnership"]>;
    /** Max requests per minute when allowedUse includes rate-limit. */
    maxRequestsPerMinute: z.ZodOptional<z.ZodNumber>;
    /** Kill switch: if true, do not run this source. */
    killSwitch: z.ZodDefault<z.ZodBoolean>;
    /** Notes (e.g. "Blocked by robots.txt until 2025-01"). */
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sourceId: string;
    sourceName: string;
    allowedUse: "none" | "public-pages-only" | "with-rate-limit" | "with-partnership";
    killSwitch: boolean;
    tosUrl?: string | undefined;
    robotsUrl?: string | undefined;
    lastReviewedAt?: string | undefined;
    maxRequestsPerMinute?: number | undefined;
    notes?: string | undefined;
}, {
    sourceId: string;
    sourceName: string;
    allowedUse: "none" | "public-pages-only" | "with-rate-limit" | "with-partnership";
    tosUrl?: string | undefined;
    robotsUrl?: string | undefined;
    lastReviewedAt?: string | undefined;
    maxRequestsPerMinute?: number | undefined;
    killSwitch?: boolean | undefined;
    notes?: string | undefined;
}>;
export type ToSMetadata = z.infer<typeof ToSMetadataSchema>;
//# sourceMappingURL=tos-metadata.schema.d.ts.map