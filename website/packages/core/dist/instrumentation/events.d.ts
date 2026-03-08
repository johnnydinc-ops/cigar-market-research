import { z } from "zod";
/** Flow: query → recommendation → best deal → affiliate click. No interview/PII required. */
export declare const EventQuerySchema: z.ZodObject<{
    event: z.ZodLiteral<"query">;
    timestamp: z.ZodDefault<z.ZodDate>;
    /** Input cigar ID or external identifier. */
    inputCigarId: z.ZodOptional<z.ZodString>;
    inputCigarExternalId: z.ZodOptional<z.ZodString>;
    /** Session or request ID for correlation. */
    requestId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    event: "query";
    timestamp: Date;
    inputCigarId?: string | undefined;
    inputCigarExternalId?: string | undefined;
    requestId?: string | undefined;
}, {
    event: "query";
    timestamp?: Date | undefined;
    inputCigarId?: string | undefined;
    inputCigarExternalId?: string | undefined;
    requestId?: string | undefined;
}>;
export declare const EventRecommendationSchema: z.ZodObject<{
    event: z.ZodLiteral<"recommendation">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    inputCigarId: z.ZodString;
    /** Recommended cigar IDs in order. */
    recommendedCigarIds: z.ZodArray<z.ZodString, "many">;
    /** Engine used: "ml", "rag", "attribute_baseline". */
    engine: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    event: "recommendation";
    timestamp: Date;
    inputCigarId: string;
    recommendedCigarIds: string[];
    requestId?: string | undefined;
    engine?: string | undefined;
}, {
    event: "recommendation";
    inputCigarId: string;
    recommendedCigarIds: string[];
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    engine?: string | undefined;
}>;
export declare const EventBestDealSchema: z.ZodObject<{
    event: z.ZodLiteral<"best_deal">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    cigarId: z.ZodString;
    retailerId: z.ZodString;
    /** Price shown (cents). */
    amountCents: z.ZodNumber;
    /** Rank in results (1 = top). */
    rank: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    cigarId: string;
    retailerId: string;
    amountCents: number;
    event: "best_deal";
    timestamp: Date;
    requestId?: string | undefined;
    rank?: number | undefined;
}, {
    cigarId: string;
    retailerId: string;
    amountCents: number;
    event: "best_deal";
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    rank?: number | undefined;
}>;
export declare const EventAffiliateClickSchema: z.ZodObject<{
    event: z.ZodLiteral<"affiliate_click">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    cigarId: z.ZodString;
    retailerId: z.ZodString;
    /** Link ID if stored. */
    linkId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cigarId: string;
    retailerId: string;
    event: "affiliate_click";
    timestamp: Date;
    requestId?: string | undefined;
    linkId?: string | undefined;
}, {
    cigarId: string;
    retailerId: string;
    event: "affiliate_click";
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    linkId?: string | undefined;
}>;
/** Stage 7: wishlist add (client or API). */
export declare const EventWishlistAddSchema: z.ZodObject<{
    event: z.ZodLiteral<"wishlist_add">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    cigarId: z.ZodString;
    /** Optional product/cigar name for analytics. */
    cigarName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cigarId: string;
    event: "wishlist_add";
    timestamp: Date;
    requestId?: string | undefined;
    cigarName?: string | undefined;
}, {
    cigarId: string;
    event: "wishlist_add";
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    cigarName?: string | undefined;
}>;
/** Stage 7: deal alert signup (notify when price drops). */
export declare const EventDealAlertSignupSchema: z.ZodObject<{
    event: z.ZodLiteral<"deal_alert_signup">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    cigarId: z.ZodString;
    /** Email or token; hash before persisting. */
    emailHash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cigarId: string;
    event: "deal_alert_signup";
    timestamp: Date;
    requestId?: string | undefined;
    emailHash?: string | undefined;
}, {
    cigarId: string;
    event: "deal_alert_signup";
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    emailHash?: string | undefined;
}>;
export type EventQuery = z.infer<typeof EventQuerySchema>;
export type EventRecommendation = z.infer<typeof EventRecommendationSchema>;
export type EventBestDeal = z.infer<typeof EventBestDealSchema>;
export type EventAffiliateClick = z.infer<typeof EventAffiliateClickSchema>;
export type EventWishlistAdd = z.infer<typeof EventWishlistAddSchema>;
export type EventDealAlertSignup = z.infer<typeof EventDealAlertSignupSchema>;
export type InstrumentationEvent = EventQuery | EventRecommendation | EventBestDeal | EventAffiliateClick | EventWishlistAdd | EventDealAlertSignup;
export declare const InstrumentationEventSchema: z.ZodDiscriminatedUnion<"event", [z.ZodObject<{
    event: z.ZodLiteral<"query">;
    timestamp: z.ZodDefault<z.ZodDate>;
    /** Input cigar ID or external identifier. */
    inputCigarId: z.ZodOptional<z.ZodString>;
    inputCigarExternalId: z.ZodOptional<z.ZodString>;
    /** Session or request ID for correlation. */
    requestId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    event: "query";
    timestamp: Date;
    inputCigarId?: string | undefined;
    inputCigarExternalId?: string | undefined;
    requestId?: string | undefined;
}, {
    event: "query";
    timestamp?: Date | undefined;
    inputCigarId?: string | undefined;
    inputCigarExternalId?: string | undefined;
    requestId?: string | undefined;
}>, z.ZodObject<{
    event: z.ZodLiteral<"recommendation">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    inputCigarId: z.ZodString;
    /** Recommended cigar IDs in order. */
    recommendedCigarIds: z.ZodArray<z.ZodString, "many">;
    /** Engine used: "ml", "rag", "attribute_baseline". */
    engine: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    event: "recommendation";
    timestamp: Date;
    inputCigarId: string;
    recommendedCigarIds: string[];
    requestId?: string | undefined;
    engine?: string | undefined;
}, {
    event: "recommendation";
    inputCigarId: string;
    recommendedCigarIds: string[];
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    engine?: string | undefined;
}>, z.ZodObject<{
    event: z.ZodLiteral<"best_deal">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    cigarId: z.ZodString;
    retailerId: z.ZodString;
    /** Price shown (cents). */
    amountCents: z.ZodNumber;
    /** Rank in results (1 = top). */
    rank: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    cigarId: string;
    retailerId: string;
    amountCents: number;
    event: "best_deal";
    timestamp: Date;
    requestId?: string | undefined;
    rank?: number | undefined;
}, {
    cigarId: string;
    retailerId: string;
    amountCents: number;
    event: "best_deal";
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    rank?: number | undefined;
}>, z.ZodObject<{
    event: z.ZodLiteral<"affiliate_click">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    cigarId: z.ZodString;
    retailerId: z.ZodString;
    /** Link ID if stored. */
    linkId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cigarId: string;
    retailerId: string;
    event: "affiliate_click";
    timestamp: Date;
    requestId?: string | undefined;
    linkId?: string | undefined;
}, {
    cigarId: string;
    retailerId: string;
    event: "affiliate_click";
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    linkId?: string | undefined;
}>, z.ZodObject<{
    event: z.ZodLiteral<"wishlist_add">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    cigarId: z.ZodString;
    /** Optional product/cigar name for analytics. */
    cigarName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cigarId: string;
    event: "wishlist_add";
    timestamp: Date;
    requestId?: string | undefined;
    cigarName?: string | undefined;
}, {
    cigarId: string;
    event: "wishlist_add";
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    cigarName?: string | undefined;
}>, z.ZodObject<{
    event: z.ZodLiteral<"deal_alert_signup">;
    timestamp: z.ZodDefault<z.ZodDate>;
    requestId: z.ZodOptional<z.ZodString>;
    cigarId: z.ZodString;
    /** Email or token; hash before persisting. */
    emailHash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cigarId: string;
    event: "deal_alert_signup";
    timestamp: Date;
    requestId?: string | undefined;
    emailHash?: string | undefined;
}, {
    cigarId: string;
    event: "deal_alert_signup";
    timestamp?: Date | undefined;
    requestId?: string | undefined;
    emailHash?: string | undefined;
}>]>;
//# sourceMappingURL=events.d.ts.map