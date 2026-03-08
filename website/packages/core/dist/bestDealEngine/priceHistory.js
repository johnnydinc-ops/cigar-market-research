"use strict";
/**
 * Price history storage for later graphs.
 * Schema only; persistence is adapter-specific (e.g. DB, file).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceHistoryEntrySchema = void 0;
const zod_1 = require("zod");
const pricing_js_1 = require("../schema/pricing.js");
/** One historical price point for a cigar at a retailer. */
exports.PriceHistoryEntrySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cigarId: zod_1.z.string().uuid(),
    retailerId: zod_1.z.string().uuid(),
    amountCents: zod_1.z.number().int().nonnegative(),
    currency: zod_1.z.literal("USD"),
    packSize: pricing_js_1.PackSizeSchema,
    perStickCents: zod_1.z.number().int().nonnegative().optional(),
    inStock: zod_1.z.boolean().default(true),
    /** When this price was observed (stored for history). */
    observedAt: zod_1.z.coerce.date(),
    source: zod_1.z.string().max(64).optional(),
});
//# sourceMappingURL=priceHistory.js.map