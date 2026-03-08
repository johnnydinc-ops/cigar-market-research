/**
 * Normalization rules for catalog and attributes.
 * Aligns affiliate feed / licensed / public data to canonical schema.
 * US-only; no PII.
 */
import type { Cigar, WrapperType } from "../schema/cigar.js";
/** Raw cigar-like input from a feed (partial). */
export interface RawCigarInput {
    externalId?: string;
    source?: string;
    brand?: string;
    line?: string;
    vitola?: string;
    sizeName?: string;
    lengthInches?: number;
    ringGauge?: number;
    wrapper?: string;
    strength?: string | number;
    body?: string | number;
    origin?: string;
    flavorNotes?: string[];
    priceBand?: "budget" | "mid" | "premium";
    title?: string;
}
/**
 * Normalize brand to canonical form (trim, title-case, alias).
 */
export declare function normalizeBrand(brand: string | undefined): string;
/**
 * Normalize wrapper string to canonical WrapperType.
 */
export declare function normalizeWrapper(wrapper: string | undefined): WrapperType | undefined;
/**
 * Normalize strength to 1–5 scale.
 */
export declare function normalizeStrength(strength: string | number | undefined): number | undefined;
/**
 * Normalize body to 1–5 scale.
 */
export declare function normalizeBody(body: string | number | undefined): number | undefined;
/**
 * Normalize product title into brand/line/vitola when possible (heuristic).
 * E.g. "Arturo Fuente Hemingway Short Story" → brand: Arturo Fuente, line: Hemingway, vitola: Short Story.
 */
export declare function parseProductTitle(title: string | undefined): {
    brand?: string;
    line?: string;
    vitola?: string;
};
/**
 * Apply normalization rules to raw input. Does not assign id; caller must provide.
 */
export declare function normalizeCigarInput(raw: RawCigarInput, id: string, externalIds?: Record<string, string>): Cigar;
//# sourceMappingURL=rules.d.ts.map