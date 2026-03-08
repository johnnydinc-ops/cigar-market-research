import { z } from "zod";

/** Flow: query → recommendation → best deal → affiliate click. No interview/PII required. */

export const EventQuerySchema = z.object({
  event: z.literal("query"),
  timestamp: z.coerce.date().default(() => new Date()),
  /** Input cigar ID or external identifier. */
  inputCigarId: z.string().uuid().optional(),
  inputCigarExternalId: z.string().max(128).optional(),
  /** Session or request ID for correlation. */
  requestId: z.string().uuid().optional(),
});

export const EventRecommendationSchema = z.object({
  event: z.literal("recommendation"),
  timestamp: z.coerce.date().default(() => new Date()),
  requestId: z.string().uuid().optional(),
  inputCigarId: z.string().uuid(),
  /** Recommended cigar IDs in order. */
  recommendedCigarIds: z.array(z.string().uuid()),
  /** Engine used: "ml", "rag", "attribute_baseline". */
  engine: z.string().max(64).optional(),
});

export const EventBestDealSchema = z.object({
  event: z.literal("best_deal"),
  timestamp: z.coerce.date().default(() => new Date()),
  requestId: z.string().uuid().optional(),
  cigarId: z.string().uuid(),
  retailerId: z.string().uuid(),
  /** Price shown (cents). */
  amountCents: z.number().int().nonnegative(),
  /** Rank in results (1 = top). */
  rank: z.number().int().positive().optional(),
});

export const EventAffiliateClickSchema = z.object({
  event: z.literal("affiliate_click"),
  timestamp: z.coerce.date().default(() => new Date()),
  requestId: z.string().uuid().optional(),
  cigarId: z.string().uuid(),
  retailerId: z.string().uuid(),
  /** Link ID if stored. */
  linkId: z.string().uuid().optional(),
});

/** Stage 7: wishlist add (client or API). */
export const EventWishlistAddSchema = z.object({
  event: z.literal("wishlist_add"),
  timestamp: z.coerce.date().default(() => new Date()),
  requestId: z.string().uuid().optional(),
  cigarId: z.string(),
  /** Optional product/cigar name for analytics. */
  cigarName: z.string().max(256).optional(),
});

/** Stage 7: deal alert signup (notify when price drops). */
export const EventDealAlertSignupSchema = z.object({
  event: z.literal("deal_alert_signup"),
  timestamp: z.coerce.date().default(() => new Date()),
  requestId: z.string().uuid().optional(),
  cigarId: z.string(),
  /** Email or token; hash before persisting. */
  emailHash: z.string().max(64).optional(),
});

export type EventQuery = z.infer<typeof EventQuerySchema>;
export type EventRecommendation = z.infer<typeof EventRecommendationSchema>;
export type EventBestDeal = z.infer<typeof EventBestDealSchema>;
export type EventAffiliateClick = z.infer<typeof EventAffiliateClickSchema>;
export type EventWishlistAdd = z.infer<typeof EventWishlistAddSchema>;
export type EventDealAlertSignup = z.infer<typeof EventDealAlertSignupSchema>;

export type InstrumentationEvent =
  | EventQuery
  | EventRecommendation
  | EventBestDeal
  | EventAffiliateClick
  | EventWishlistAdd
  | EventDealAlertSignup;

export const InstrumentationEventSchema = z.discriminatedUnion("event", [
  EventQuerySchema,
  EventRecommendationSchema,
  EventBestDealSchema,
  EventAffiliateClickSchema,
  EventWishlistAddSchema,
  EventDealAlertSignupSchema,
]);
