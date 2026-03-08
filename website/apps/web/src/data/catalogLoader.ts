/**
 * Loads the cleaned catalog from website/data/catalog/catalog.json when present,
 * otherwise falls back to the mock catalog. Used by recommend and deals API routes.
 */

import { readFile } from "fs/promises";
import path from "path";
import type { Cigar, Link, Pricing, Retailer } from "@cigar/core";
import {
  MOCK_CIGARS,
  MOCK_PRICING,
  MOCK_RETAILERS,
  MOCK_LINKS,
  resolveSeedCigar as mockResolveSeedCigar,
  formatCigarTitle as mockFormatCigarTitle,
} from "./mockCatalog";

export interface LoadedCatalog {
  cigars: Cigar[];
  retailers: Retailer[];
  pricing: Pricing[];
  links: Link[];
  documents?: Array<{ id: string; cigarRefs: string[]; attribute?: string; review?: string; source?: string }>;
  fromFile: boolean;
}

const catalogPath = path.join(process.cwd(), "..", "..", "data", "catalog", "catalog.json");

/** Normalize fetchedAt to Date when present (mock uses Date; JSON has string). */
function normalizePricing(p: Record<string, unknown>): Pricing {
  const fetchedAt = p.fetchedAt;
  const date =
    fetchedAt instanceof Date
      ? fetchedAt
      : typeof fetchedAt === "string"
        ? new Date(fetchedAt)
        : new Date();
  return { ...p, fetchedAt: date } as Pricing;
}

export async function getCatalog(): Promise<LoadedCatalog> {
  try {
    const raw = await readFile(catalogPath, "utf-8");
    const data = JSON.parse(raw) as {
      cigars?: unknown[];
      retailers?: unknown[];
      pricing?: unknown[];
      links?: unknown[];
      documents?: unknown[];
    };
    const cigars = (data.cigars ?? []) as Cigar[];
    const retailers = (data.retailers ?? []) as Retailer[];
    const pricing = (data.pricing ?? []).map((p) => normalizePricing(p as Record<string, unknown>));
    const links = (data.links ?? []) as Link[];
    const documents = data.documents as LoadedCatalog["documents"] | undefined;
    if (cigars.length > 0 && retailers.length > 0) {
      return { cigars, retailers, pricing, links, documents, fromFile: true };
    }
  } catch {
    // File missing or invalid — use mock
  }
  return {
    cigars: MOCK_CIGARS,
    retailers: MOCK_RETAILERS,
    pricing: MOCK_PRICING,
    links: MOCK_LINKS,
    fromFile: false,
  };
}

export function formatCigarTitle(c: Cigar): string {
  return mockFormatCigarTitle(c);
}

/** Resolve query to a seed cigar from the given list (brand/line match). */
export function resolveSeedCigar(q: string, cigars: Cigar[]): Cigar | null {
  if (cigars === MOCK_CIGARS) return mockResolveSeedCigar(q);
  const lower = q.trim().toLowerCase();
  if (!lower) return null;
  return (
    cigars.find(
      (c) =>
        c.brand.toLowerCase().includes(lower) ||
        (c.line && c.line.toLowerCase().includes(lower)) ||
        `${c.brand} ${c.line ?? ""}`.toLowerCase().includes(lower)
    ) ?? null
  );
}
