import { z } from "zod";

/** Strength 1–5 (mild to full). */
export const StrengthSchema = z.number().int().min(1).max(5).optional();

/** Body 1–5 (light to full). */
export const BodySchema = z.number().int().min(1).max(5).optional();

/** Common wrapper types (US market). */
export const WrapperTypeSchema = z.enum([
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
export const OriginSchema = z.string().min(1).max(64);

/** Canonical cigar record. US-only; large catalog from day one. */
export const CigarSchema = z.object({
  id: z.string().uuid(),
  /** External IDs by source (e.g. { "famous": "123", "ci": "456" }) */
  externalIds: z.record(z.string()).default({}),
  brand: z.string().min(1).max(128),
  line: z.string().max(128).optional(),
  vitola: z.string().max(128).optional(),
  /** e.g. "Robusto", "Toro", "Churchill" */
  sizeName: z.string().max(64).optional(),
  lengthInches: z.number().positive().optional(),
  ringGauge: z.number().int().positive().optional(),
  wrapper: WrapperTypeSchema.optional(),
  strength: StrengthSchema,
  body: BodySchema,
  origin: OriginSchema.optional(),
  /** Flavor notes / descriptors (from reviews or taxonomy). */
  flavorNotes: z.array(z.string()).default([]),
  /** Price band for filtering (e.g. "budget", "mid", "premium"). */
  priceBand: z.enum(["budget", "mid", "premium"]).optional(),
  /** Product description (from retailer or manufacturer). */
  description: z.string().max(4096).optional(),
  /** Specification text or structured summary (e.g. "Strength: Medium, Wrapper: Ecuadorian Habano"). */
  specification: z.string().max(2048).optional(),
  /** Average user rating (e.g. 4.55). */
  ratingAverage: z.number().min(0).max(5).optional(),
  /** Number of user reviews. */
  ratingCount: z.number().int().nonnegative().optional(),
  /** Source of this record (affiliate feed, license, manual). */
  source: z.string().max(64).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type Cigar = z.infer<typeof CigarSchema>;
export type WrapperType = z.infer<typeof WrapperTypeSchema>;
