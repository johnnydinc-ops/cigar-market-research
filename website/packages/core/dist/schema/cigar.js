"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CigarSchema = exports.OriginSchema = exports.WrapperTypeSchema = exports.BodySchema = exports.StrengthSchema = void 0;
const zod_1 = require("zod");
/** Strength 1–5 (mild to full). */
exports.StrengthSchema = zod_1.z.number().int().min(1).max(5).optional();
/** Body 1–5 (light to full). */
exports.BodySchema = zod_1.z.number().int().min(1).max(5).optional();
/** Common wrapper types (US market). */
exports.WrapperTypeSchema = zod_1.z.enum([
    "Connecticut",
    "Maduro",
    "Habano",
    "Corojo",
    "Candela",
    "Sumatra",
    "Ecuadorian",
    "Other",
]);
/** Country of origin (manufacture/origin). */
exports.OriginSchema = zod_1.z.string().min(1).max(64);
/** Canonical cigar record. US-only; large catalog from day one. */
exports.CigarSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    /** External IDs by source (e.g. { "famous": "123", "ci": "456" }) */
    externalIds: zod_1.z.record(zod_1.z.string()).default({}),
    brand: zod_1.z.string().min(1).max(128),
    line: zod_1.z.string().max(128).optional(),
    vitola: zod_1.z.string().max(128).optional(),
    /** e.g. "Robusto", "Toro", "Churchill" */
    sizeName: zod_1.z.string().max(64).optional(),
    lengthInches: zod_1.z.number().positive().optional(),
    ringGauge: zod_1.z.number().int().positive().optional(),
    wrapper: exports.WrapperTypeSchema.optional(),
    strength: exports.StrengthSchema,
    body: exports.BodySchema,
    origin: exports.OriginSchema.optional(),
    /** Flavor notes / descriptors (from reviews or taxonomy). */
    flavorNotes: zod_1.z.array(zod_1.z.string()).default([]),
    /** Price band for filtering (e.g. "budget", "mid", "premium"). */
    priceBand: zod_1.z.enum(["budget", "mid", "premium"]).optional(),
    /** Product description (from retailer or manufacturer). */
    description: zod_1.z.string().max(4096).optional(),
    /** Specification text or structured summary (e.g. "Strength: Medium, Wrapper: Ecuadorian Habano"). */
    specification: zod_1.z.string().max(2048).optional(),
    /** Average user rating (e.g. 4.55). */
    ratingAverage: zod_1.z.number().min(0).max(5).optional(),
    /** Number of user reviews. */
    ratingCount: zod_1.z.number().int().nonnegative().optional(),
    /** Source of this record (affiliate feed, license, manual). */
    source: zod_1.z.string().max(64).optional(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=cigar.js.map