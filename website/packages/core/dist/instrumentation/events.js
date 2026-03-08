"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentationEventSchema = exports.EventDealAlertSignupSchema = exports.EventWishlistAddSchema = exports.EventAffiliateClickSchema = exports.EventBestDealSchema = exports.EventRecommendationSchema = exports.EventQuerySchema = void 0;
const zod_1 = require("zod");
/** Flow: query → recommendation → best deal → affiliate click. No interview/PII required. */
exports.EventQuerySchema = zod_1.z.object({
    event: zod_1.z.literal("query"),
    timestamp: zod_1.z.coerce.date().default(() => new Date()),
    /** Input cigar ID or external identifier. */
    inputCigarId: zod_1.z.string().uuid().optional(),
    inputCigarExternalId: zod_1.z.string().max(128).optional(),
    /** Session or request ID for correlation. */
    requestId: zod_1.z.string().uuid().optional(),
});
exports.EventRecommendationSchema = zod_1.z.object({
    event: zod_1.z.literal("recommendation"),
    timestamp: zod_1.z.coerce.date().default(() => new Date()),
    requestId: zod_1.z.string().uuid().optional(),
    inputCigarId: zod_1.z.string().uuid(),
    /** Recommended cigar IDs in order. */
    recommendedCigarIds: zod_1.z.array(zod_1.z.string().uuid()),
    /** Engine used: "ml", "rag", "attribute_baseline". */
    engine: zod_1.z.string().max(64).optional(),
});
exports.EventBestDealSchema = zod_1.z.object({
    event: zod_1.z.literal("best_deal"),
    timestamp: zod_1.z.coerce.date().default(() => new Date()),
    requestId: zod_1.z.string().uuid().optional(),
    cigarId: zod_1.z.string().uuid(),
    retailerId: zod_1.z.string().uuid(),
    /** Price shown (cents). */
    amountCents: zod_1.z.number().int().nonnegative(),
    /** Rank in results (1 = top). */
    rank: zod_1.z.number().int().positive().optional(),
});
exports.EventAffiliateClickSchema = zod_1.z.object({
    event: zod_1.z.literal("affiliate_click"),
    timestamp: zod_1.z.coerce.date().default(() => new Date()),
    requestId: zod_1.z.string().uuid().optional(),
    cigarId: zod_1.z.string().uuid(),
    retailerId: zod_1.z.string().uuid(),
    /** Link ID if stored. */
    linkId: zod_1.z.string().uuid().optional(),
});
/** Stage 7: wishlist add (client or API). */
exports.EventWishlistAddSchema = zod_1.z.object({
    event: zod_1.z.literal("wishlist_add"),
    timestamp: zod_1.z.coerce.date().default(() => new Date()),
    requestId: zod_1.z.string().uuid().optional(),
    cigarId: zod_1.z.string(),
    /** Optional product/cigar name for analytics. */
    cigarName: zod_1.z.string().max(256).optional(),
});
/** Stage 7: deal alert signup (notify when price drops). */
exports.EventDealAlertSignupSchema = zod_1.z.object({
    event: zod_1.z.literal("deal_alert_signup"),
    timestamp: zod_1.z.coerce.date().default(() => new Date()),
    requestId: zod_1.z.string().uuid().optional(),
    cigarId: zod_1.z.string(),
    /** Email or token; hash before persisting. */
    emailHash: zod_1.z.string().max(64).optional(),
});
exports.InstrumentationEventSchema = zod_1.z.discriminatedUnion("event", [
    exports.EventQuerySchema,
    exports.EventRecommendationSchema,
    exports.EventBestDealSchema,
    exports.EventAffiliateClickSchema,
    exports.EventWishlistAddSchema,
    exports.EventDealAlertSignupSchema,
]);
//# sourceMappingURL=events.js.map