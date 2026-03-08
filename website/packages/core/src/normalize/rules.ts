/**
 * Normalization rules for catalog and attributes.
 * Aligns affiliate feed / licensed / public data to canonical schema.
 * US-only; no PII.
 */

import type { Cigar, WrapperType } from "../schema/cigar.js";

/** Known brand name variants → canonical. */
const BRAND_CANON: Record<string, string> = {
  "arturo fuente": "Arturo Fuente",
  "fuente": "Arturo Fuente",
  "af": "Arturo Fuente",
  "padron": "Padrón",
  "rocky patel": "Rocky Patel",
  "rp": "Rocky Patel",
  "davidoff": "Davidoff",
  "oliva": "Oliva",
  "drew estate": "Drew Estate",
  "liga privada": "Liga Privada",
  "my father": "My Father",
  "aj fernandez": "AJ Fernandez",
};

/** Wrapper string (from feed) → canonical WrapperType. */
const WRAPPER_CANON: Record<string, WrapperType> = {
  connecticut: "Connecticut",
  maduro: "Maduro",
  habano: "Habano",
  corojo: "Corojo",
  candela: "Candela",
  sumatra: "Sumatra",
  ecuadorian: "Ecuadorian",
  ecuador: "Ecuadorian",
  other: "Other",
};

/** Strength text → 1–5. */
function strengthToScale(s: string | number | undefined): number | undefined {
  if (s === undefined || s === null) return undefined;
  if (typeof s === "number") return s >= 1 && s <= 5 ? s : undefined;
  const lower = String(s).toLowerCase();
  if (lower.includes("mild") || lower === "1") return 1;
  if (lower.includes("medium-mild") || lower === "2") return 2;
  if (lower.includes("medium") || lower === "3") return 3;
  if (lower.includes("medium-full") || lower === "4") return 4;
  if (lower.includes("full") || lower === "5") return 5;
  return undefined;
}

/** Body text → 1–5. */
function bodyToScale(s: string | number | undefined): number | undefined {
  if (s === undefined || s === null) return undefined;
  if (typeof s === "number") return s >= 1 && s <= 5 ? s : undefined;
  const lower = String(s).toLowerCase();
  if (lower.includes("light") || lower === "1") return 1;
  if (lower.includes("medium-light") || lower === "2") return 2;
  if (lower.includes("medium") || lower === "3") return 3;
  if (lower.includes("medium-full") || lower === "4") return 4;
  if (lower.includes("full") || lower === "5") return 5;
  return undefined;
}

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
export function normalizeBrand(brand: string | undefined): string {
  if (!brand || !brand.trim()) return "";
  const trimmed = brand.trim();
  const lower = trimmed.toLowerCase();
  return BRAND_CANON[lower] ?? trimmed.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Normalize wrapper string to canonical WrapperType.
 */
export function normalizeWrapper(wrapper: string | undefined): WrapperType | undefined {
  if (!wrapper || !wrapper.trim()) return undefined;
  const key = wrapper.trim().toLowerCase().replace(/\s+/g, "");
  return WRAPPER_CANON[key] ?? "Other";
}

/**
 * Normalize strength to 1–5 scale.
 */
export function normalizeStrength(strength: string | number | undefined): number | undefined {
  return strengthToScale(strength);
}

/**
 * Normalize body to 1–5 scale.
 */
export function normalizeBody(body: string | number | undefined): number | undefined {
  return bodyToScale(body);
}

/**
 * Normalize product title into brand/line/vitola when possible (heuristic).
 * E.g. "Arturo Fuente Hemingway Short Story" → brand: Arturo Fuente, line: Hemingway, vitola: Short Story.
 */
export function parseProductTitle(title: string | undefined): { brand?: string; line?: string; vitola?: string } {
  if (!title || !title.trim()) return {};
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 1) return { brand: title.trim() };
  const brand = normalizeBrand(parts[0] + (parts[1] && !/^[ivxlcdm]+$/i.test(parts[1]) ? " " + parts[1] : ""));
  const rest = parts.slice(brand.split(/\s+/).length);
  if (rest.length === 0) return { brand };
  if (rest.length === 1) return { brand, vitola: rest[0] };
  return { brand, line: rest[0], vitola: rest.slice(1).join(" ") };
}

/**
 * Apply normalization rules to raw input. Does not assign id; caller must provide.
 */
export function normalizeCigarInput(
  raw: RawCigarInput,
  id: string,
  externalIds: Record<string, string> = {}
): Cigar {
  const fromTitle = raw.title ? parseProductTitle(raw.title) : {};
  const brand = normalizeBrand(raw.brand ?? fromTitle.brand) || "Unknown";
  const wrapper = raw.wrapper ? normalizeWrapper(raw.wrapper) : undefined;
  const strength = normalizeStrength(raw.strength);
  const body = normalizeBody(raw.body);

  return {
    id,
    externalIds: raw.externalId && raw.source ? { ...externalIds, [raw.source]: raw.externalId } : externalIds,
    brand,
    line: raw.line ?? fromTitle.line,
    vitola: raw.vitola ?? fromTitle.vitola,
    sizeName: raw.sizeName,
    lengthInches: raw.lengthInches,
    ringGauge: raw.ringGauge,
    wrapper,
    strength,
    body,
    origin: raw.origin?.trim(),
    flavorNotes: Array.isArray(raw.flavorNotes) ? raw.flavorNotes : [],
    priceBand: raw.priceBand,
    source: raw.source,
    updatedAt: new Date(),
  };
}
