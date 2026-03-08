/**
 * ToS metadata: checked-in, per-source. Required for any scrape connector.
 * Rate limits, robots policy, and allowed-use must be explicit.
 */
import { z } from "zod";
export const ToSMetadataSchema = z.object({
    /** Source id (e.g. retailer domain key). */
    sourceId: z.string().min(1).max(64),
    /** Human-readable source name. */
    sourceName: z.string().max(128),
    /** URL to terms of service or robots.txt. */
    tosUrl: z.string().url().max(2048).optional(),
    robotsUrl: z.string().url().max(2048).optional(),
    /** Last date this was reviewed. */
    lastReviewedAt: z.string().datetime().optional(),
    /** Allowed use: e.g. "none" | "public-pages-only" | "with-rate-limit". */
    allowedUse: z.enum(["none", "public-pages-only", "with-rate-limit", "with-partnership"]),
    /** Max requests per minute when allowedUse includes rate-limit. */
    maxRequestsPerMinute: z.number().int().positive().optional(),
    /** Kill switch: if true, do not run this source. */
    killSwitch: z.boolean().default(false),
    /** Notes (e.g. "Blocked by robots.txt until 2025-01"). */
    notes: z.string().max(512).optional(),
});
//# sourceMappingURL=tos-metadata.schema.js.map