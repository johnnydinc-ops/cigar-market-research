/**
 * Clean ingested scrape data: dedupe cigars, normalize fields, remap IDs, output app-ready catalog.
 * Run from website/data/catalog: node clean-catalog.mjs
 * Reads: all-scraped.json  Writes: catalog.json (and catalog-stats.txt)
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT = join(__dirname, "all-scraped.json");
const OUTPUT = join(__dirname, "catalog.json");
const STATS = join(__dirname, "catalog-stats.txt");

function norm(s) {
  if (s == null || typeof s !== "string") return "";
  return s.trim().replace(/\s+/g, " ").slice(0, 256);
}

function cigarKey(c) {
  const b = norm(c.brand).toLowerCase();
  const l = norm(c.line ?? "").toLowerCase();
  const v = norm(c.vitola ?? "").toLowerCase();
  return `${b}|${l}|${v}`;
}

function isValidUuid(id) {
  return typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function main() {
  const raw = JSON.parse(readFileSync(INPUT, "utf8"));
  const results = raw.results ?? [];

  const allCigars = [];
  const allPricing = [];
  const allLinks = [];
  const allRetailers = [];
  const allDocuments = [];

  for (const r of results) {
    allCigars.push(...(r.cigars ?? []));
    allPricing.push(...(r.pricing ?? []));
    allLinks.push(...(r.links ?? []));
    allRetailers.push(...(r.retailers ?? []));
    allDocuments.push(...(r.documents ?? []));
  }

  const keyToCigar = new Map();
  const oldIdToCanonical = new Map();

  for (const c of allCigars) {
    const brand = norm(c.brand);
    if (!brand) continue;
    const key = cigarKey(c);
    const existing = keyToCigar.get(key);
    if (existing) {
      oldIdToCanonical.set(c.id, existing.id);
      for (const [k, v] of Object.entries(c.externalIds ?? {})) {
        if (v) existing.externalIds[k] = v;
      }
      if (c.description && (!existing.description || (c.description.length > (existing.description?.length ?? 0)))) {
        existing.description = norm(c.description).slice(0, 4096);
      }
      if (c.specification && (!existing.specification || (c.specification.length > (existing.specification?.length ?? 0)))) {
        existing.specification = norm(c.specification).slice(0, 2048);
      }
      if (c.ratingCount != null && (existing.ratingCount ?? 0) < c.ratingCount) {
        existing.ratingAverage = c.ratingAverage;
        existing.ratingCount = c.ratingCount;
      }
      if (c.origin && c.origin !== "Unknown" && (!existing.origin || existing.origin === "Unknown")) {
        existing.origin = norm(c.origin).slice(0, 64);
      }
      continue;
    }
    const canonical = {
      id: c.id,
      brand,
      line: norm(c.line) || undefined,
      vitola: norm(c.vitola) || undefined,
      externalIds: { ...(c.externalIds ?? {}) },
      origin: c.origin && c.origin !== "Unknown" ? norm(c.origin).slice(0, 64) : undefined,
      flavorNotes: Array.isArray(c.flavorNotes) ? c.flavorNotes.filter((n) => typeof n === "string").slice(0, 20) : [],
      description: c.description ? norm(c.description).slice(0, 4096) : undefined,
      specification: c.specification ? norm(c.specification).slice(0, 2048) : undefined,
      ratingAverage: c.ratingAverage != null && c.ratingAverage >= 0 && c.ratingAverage <= 5 ? c.ratingAverage : undefined,
      ratingCount: c.ratingCount != null && c.ratingCount >= 0 ? c.ratingCount : undefined,
    };
    keyToCigar.set(key, canonical);
    oldIdToCanonical.set(c.id, canonical.id);
  }

  const canonicalIds = new Set(keyToCigar.values().map((c) => c.id));
  const cigars = [...keyToCigar.values()];

  const retailersById = new Map();
  for (const r of allRetailers) {
    if (r.id && !retailersById.has(r.id)) {
      retailersById.set(r.id, {
        id: r.id,
        name: norm(r.name) || r.name || "Unknown",
        domain: r.domain && typeof r.domain === "string" ? r.domain.slice(0, 256) : undefined,
        allowedStates: Array.isArray(r.allowedStates) ? r.allowedStates : [],
        source: r.source,
      });
    }
  }
  const retailers = [...retailersById.values()];
  const retailerIds = new Set(retailers.map((r) => r.id));

  const pricingRemapped = [];
  const seenPricingKey = new Set();
  for (const p of allPricing) {
    const cigarId = oldIdToCanonical.get(p.cigarId) ?? p.cigarId;
    if (!canonicalIds.has(cigarId) || !retailerIds.has(p.retailerId)) continue;
    const k = `${cigarId}|${p.retailerId}|${p.packSizeLabel ?? p.packSize ?? ""}|${p.amountCents}`;
    if (seenPricingKey.has(k)) continue;
    seenPricingKey.add(k);
    const fetchedAt = p.fetchedAt ? (typeof p.fetchedAt === "string" ? new Date(p.fetchedAt) : p.fetchedAt) : new Date();
    pricingRemapped.push({
      id: p.id,
      cigarId,
      retailerId: p.retailerId,
      amountCents: Math.max(0, parseInt(p.amountCents, 10) || 0),
      currency: "USD",
      packSize: p.packSize && ["single", "5-pack", "10-pack", "box", "bundle", "other"].includes(p.packSize) ? p.packSize : "other",
      packSizeLabel: p.packSizeLabel ? norm(p.packSizeLabel).slice(0, 128) : undefined,
      msrpCents: p.msrpCents != null ? Math.max(0, parseInt(p.msrpCents, 10)) : undefined,
      saveCents: p.saveCents != null ? Math.max(0, parseInt(p.saveCents, 10)) : undefined,
      perStickCents: p.perStickCents != null ? Math.max(0, parseInt(p.perStickCents, 10)) : undefined,
      inStock: p.inStock !== false,
      availabilityLabel: p.availabilityLabel ? norm(p.availabilityLabel).slice(0, 64) : undefined,
      fetchedAt: fetchedAt.toISOString(),
      source: p.source,
    });
  }

  const seenLink = new Set();
  const links = [];
  for (const l of allLinks) {
    const cigarId = oldIdToCanonical.get(l.cigarId) ?? l.cigarId;
    if (!canonicalIds.has(cigarId) || !retailerIds.has(l.retailerId)) continue;
    try {
      new URL(l.url);
    } catch {
      continue;
    }
    const k = `${cigarId}|${l.retailerId}`;
    if (seenLink.has(k)) continue;
    seenLink.add(k);
    links.push({
      id: l.id,
      cigarId,
      retailerId: l.retailerId,
      url: l.url.slice(0, 2048),
      isAffiliate: l.isAffiliate === true,
      source: l.source,
    });
  }

  const documents = [];
  for (const d of allDocuments) {
    const refs = (d.cigarRefs ?? []).map((id) => oldIdToCanonical.get(id) ?? id).filter((id) => canonicalIds.has(id));
    if (refs.length === 0) continue;
    documents.push({
      id: d.id,
      source: d.source,
      type: d.type === "review" ? "review" : "attribute",
      content: d.content ? norm(d.content).slice(0, 4096) : "",
      cigarRefs: refs,
      citationUrl: d.citationUrl,
      attribution: d.attribution ? norm(d.attribution).slice(0, 128) : undefined,
    });
  }

  const catalog = {
    version: 1,
    generatedAt: new Date().toISOString(),
    fromRun: raw.runAt,
    cigars,
    retailers,
    pricing: pricingRemapped,
    links,
    documents,
  };

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2), "utf8");

  const stats = [
    "Catalog cleanup stats",
    "=====================",
    `Input:  ${allCigars.length} cigars, ${allPricing.length} pricing, ${allLinks.length} links, ${allDocuments.length} documents`,
    `Output: ${cigars.length} cigars (deduped), ${retailers.length} retailers, ${pricingRemapped.length} pricing, ${links.length} links, ${documents.length} documents`,
    `Deduped cigars: ${allCigars.length - cigars.length} merged`,
    "",
    `Written: ${OUTPUT}`,
  ].join("\n");
  writeFileSync(STATS, stats, "utf8");
  console.log(stats);
}

main();
