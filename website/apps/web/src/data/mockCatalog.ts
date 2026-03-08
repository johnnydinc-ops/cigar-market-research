/**
 * Mock catalog, retailers, pricing, and links for wiring @cigar/core to the app.
 * Replace with real ingestion (feeds, API) later.
 */

import type { Cigar, Link, Pricing, Retailer } from "@cigar/core";

export const MOCK_CIGARS: Cigar[] = [
  {
    id: "11111111-1111-4111-a111-111111111111",
    brand: "Padrón",
    line: "1964 Anniversary Series",
    vitola: "Principe",
    sizeName: "Robusto",
    wrapper: "Maduro",
    strength: 4,
    body: 5,
    origin: "Nicaragua",
    externalIds: {},
    flavorNotes: [],
  },
  {
    id: "22222222-2222-4222-a222-222222222222",
    brand: "Oliva",
    line: "Serie V",
    vitola: "Melanio",
    sizeName: "Figurado",
    wrapper: "Ecuadorian",
    strength: 5,
    body: 5,
    origin: "Nicaragua",
    externalIds: {},
    flavorNotes: [],
  },
  {
    id: "33333333-3333-4333-a333-333333333333",
    brand: "Dunbarton Tobacco & Trust",
    line: "Sin Compromiso",
    vitola: "No. 5",
    sizeName: "Robusto",
    wrapper: "Maduro",
    strength: 4,
    body: 5,
    origin: "Nicaragua",
    externalIds: {},
    flavorNotes: [],
  },
  {
    id: "44444444-4444-4444-a444-444444444444",
    brand: "Arturo Fuente",
    line: "Hemmingway",
    vitola: "Short Story",
    sizeName: "Perfecto",
    wrapper: "Connecticut",
    strength: 2,
    body: 3,
    origin: "Dominican Republic",
    externalIds: {},
    flavorNotes: [],
  },
  {
    id: "55555555-5555-4555-a555-555555555555",
    brand: "My Father",
    line: "Le Bijou 1922",
    vitola: "Toro",
    sizeName: "Toro",
    wrapper: "Maduro",
    strength: 5,
    body: 5,
    origin: "Nicaragua",
    externalIds: {},
    flavorNotes: [],
  },
];

const R1 = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa";
const R2 = "bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb";
const R3 = "cccccccc-cccc-4ccc-cccc-cccccccccccc";

export const MOCK_RETAILERS: Retailer[] = [
  { id: R1, name: "Famous Smoke", domain: "https://www.famous-smoke.com", allowedStates: [] },
  { id: R2, name: "Cigars International", domain: "https://www.cigarsinternational.com", allowedStates: [] },
  { id: R3, name: "JR Cigar", domain: "https://www.jrcigars.com", allowedStates: [] },
];

const now = new Date();
const recent = new Date(now.getTime() - 12 * 60 * 60 * 1000);
const stale = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

export const MOCK_PRICING: Pricing[] = [
  { id: "d1111111-1111-4111-a111-111111111111", cigarId: MOCK_CIGARS[0].id, retailerId: R1, amountCents: 1299, currency: "USD", packSize: "box", perStickCents: 650, inStock: true, fetchedAt: now },
  { id: "d2222222-2222-4222-a222-222222222222", cigarId: MOCK_CIGARS[0].id, retailerId: R2, amountCents: 1349, currency: "USD", packSize: "box", perStickCents: 675, inStock: true, fetchedAt: recent },
  { id: "d3333333-3333-4333-a333-333333333333", cigarId: MOCK_CIGARS[0].id, retailerId: R3, amountCents: 1399, currency: "USD", packSize: "box", perStickCents: 700, inStock: true, fetchedAt: stale },
  { id: "d4444444-4444-4444-a444-444444444444", cigarId: MOCK_CIGARS[1].id, retailerId: R1, amountCents: 899, currency: "USD", packSize: "box", perStickCents: 450, inStock: true, fetchedAt: now },
  { id: "d5555555-5555-4555-a555-555555555555", cigarId: MOCK_CIGARS[1].id, retailerId: R2, amountCents: 949, currency: "USD", packSize: "box", inStock: true, fetchedAt: recent },
  { id: "d6666666-6666-4666-a666-666666666666", cigarId: MOCK_CIGARS[2].id, retailerId: R1, amountCents: 1599, currency: "USD", packSize: "box", perStickCents: 800, inStock: true, fetchedAt: now },
];

export const MOCK_LINKS: Link[] = [
  { id: "a1111111-1111-4111-a111-111111111111", cigarId: MOCK_CIGARS[0].id, retailerId: R1, url: "https://example.com/famous-padron", isAffiliate: true },
  { id: "a2222222-2222-4222-a222-222222222222", cigarId: MOCK_CIGARS[0].id, retailerId: R2, url: "https://example.com/ci-padron", isAffiliate: true },
  { id: "a3333333-3333-4333-a333-333333333333", cigarId: MOCK_CIGARS[0].id, retailerId: R3, url: "https://example.com/jr-padron", isAffiliate: true },
  { id: "a4444444-4444-4444-a444-444444444444", cigarId: MOCK_CIGARS[1].id, retailerId: R1, url: "https://example.com/famous-oliva", isAffiliate: true },
  { id: "a5555555-5555-4555-a555-555555555555", cigarId: MOCK_CIGARS[1].id, retailerId: R2, url: "https://example.com/ci-oliva", isAffiliate: true },
  { id: "a6666666-6666-4666-a666-666666666666", cigarId: MOCK_CIGARS[2].id, retailerId: R1, url: "https://example.com/famous-dtt", isAffiliate: true },
];

/** Resolve query string to a seed cigar (first match on brand/line). */
export function resolveSeedCigar(q: string): Cigar | null {
  const lower = q.trim().toLowerCase();
  if (!lower) return null;
  return MOCK_CIGARS.find(
    (c) =>
      c.brand.toLowerCase().includes(lower) ||
      (c.line && c.line.toLowerCase().includes(lower)) ||
      `${c.brand} ${c.line ?? ""}`.toLowerCase().includes(lower)
  ) ?? null;
}

export function formatCigarTitle(c: Cigar): string {
  const parts = [c.brand, c.line, c.vitola].filter(Boolean);
  return parts.join(" ");
}
