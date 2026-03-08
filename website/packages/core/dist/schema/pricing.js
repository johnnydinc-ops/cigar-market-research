"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingSchema = exports.PackSizeSchema = void 0;
const zod_1 = require("zod");
/** Pack size for normalization (per-stick vs bundle). */
exports.PackSizeSchema = zod_1.z.enum(["single", "5-pack", "10-pack", "box", "bundle", "other"]);
/** Price observation for a cigar at a retailer. */
exports.PricingSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cigarId: zod_1.z.string().uuid(),
    retailerId: zod_1.z.string().uuid(),
    /** Price in USD (selling/our price). */
    amountCents: zod_1.z.number().int().nonnegative(),
    currency: zod_1.z.literal("USD"),
    packSize: exports.PackSizeSchema,
    /** Raw pack label from retailer (e.g. "Box of 10", "Tin of 20"). */
    packSizeLabel: zod_1.z.string().max(128).optional(),
    /** MSRP in cents when available. */
    msrpCents: zod_1.z.number().int().nonnegative().optional(),
    /** You-save amount in cents when available. */
    saveCents: zod_1.z.number().int().nonnegative().optional(),
    /** Per-stick equivalent when pack > 1 (for comparison). */
    perStickCents: zod_1.z.number().int().nonnegative().optional(),
    /** In stock at time of fetch. */
    inStock: zod_1.z.boolean().default(true),
    /** Retailer's availability text (e.g. "In Stock", "Backorder"). */
    availabilityLabel: zod_1.z.string().max(64).optional(),
    /** When this price was observed. */
    fetchedAt: zod_1.z.coerce.date(),
    /** Source (affiliate feed, manual). */
    source: zod_1.z.string().max(64).optional(),
});
//# sourceMappingURL=pricing.js.map