"use strict";
/**
 * Normalization rules for catalog and attributes.
 * Aligns affiliate feed / licensed / public data to canonical schema.
 * US-only; no PII.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBrand = normalizeBrand;
exports.normalizeWrapper = normalizeWrapper;
exports.normalizeStrength = normalizeStrength;
exports.normalizeBody = normalizeBody;
exports.parseProductTitle = parseProductTitle;
exports.normalizeCigarInput = normalizeCigarInput;
/** Known brand name variants → canonical. */
const BRAND_CANON = {
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
const WRAPPER_CANON = {
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
function strengthToScale(s) {
    if (s === undefined || s === null)
        return undefined;
    if (typeof s === "number")
        return s >= 1 && s <= 5 ? s : undefined;
    const lower = String(s).toLowerCase();
    if (lower.includes("mild") || lower === "1")
        return 1;
    if (lower.includes("medium-mild") || lower === "2")
        return 2;
    if (lower.includes("medium") || lower === "3")
        return 3;
    if (lower.includes("medium-full") || lower === "4")
        return 4;
    if (lower.includes("full") || lower === "5")
        return 5;
    return undefined;
}
/** Body text → 1–5. */
function bodyToScale(s) {
    if (s === undefined || s === null)
        return undefined;
    if (typeof s === "number")
        return s >= 1 && s <= 5 ? s : undefined;
    const lower = String(s).toLowerCase();
    if (lower.includes("light") || lower === "1")
        return 1;
    if (lower.includes("medium-light") || lower === "2")
        return 2;
    if (lower.includes("medium") || lower === "3")
        return 3;
    if (lower.includes("medium-full") || lower === "4")
        return 4;
    if (lower.includes("full") || lower === "5")
        return 5;
    return undefined;
}
/**
 * Normalize brand to canonical form (trim, title-case, alias).
 */
function normalizeBrand(brand) {
    if (!brand || !brand.trim())
        return "";
    const trimmed = brand.trim();
    const lower = trimmed.toLowerCase();
    return BRAND_CANON[lower] ?? trimmed.replace(/\b\w/g, (c) => c.toUpperCase());
}
/**
 * Normalize wrapper string to canonical WrapperType.
 */
function normalizeWrapper(wrapper) {
    if (!wrapper || !wrapper.trim())
        return undefined;
    const key = wrapper.trim().toLowerCase().replace(/\s+/g, "");
    return WRAPPER_CANON[key] ?? "Other";
}
/**
 * Normalize strength to 1–5 scale.
 */
function normalizeStrength(strength) {
    return strengthToScale(strength);
}
/**
 * Normalize body to 1–5 scale.
 */
function normalizeBody(body) {
    return bodyToScale(body);
}
/**
 * Normalize product title into brand/line/vitola when possible (heuristic).
 * E.g. "Arturo Fuente Hemingway Short Story" → brand: Arturo Fuente, line: Hemingway, vitola: Short Story.
 */
function parseProductTitle(title) {
    if (!title || !title.trim())
        return {};
    const parts = title.trim().split(/\s+/);
    if (parts.length <= 1)
        return { brand: title.trim() };
    const brand = normalizeBrand(parts[0] + (parts[1] && !/^[ivxlcdm]+$/i.test(parts[1]) ? " " + parts[1] : ""));
    const rest = parts.slice(brand.split(/\s+/).length);
    if (rest.length === 0)
        return { brand };
    if (rest.length === 1)
        return { brand, vitola: rest[0] };
    return { brand, line: rest[0], vitola: rest.slice(1).join(" ") };
}
/**
 * Apply normalization rules to raw input. Does not assign id; caller must provide.
 */
function normalizeCigarInput(raw, id, externalIds = {}) {
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
//# sourceMappingURL=rules.js.map