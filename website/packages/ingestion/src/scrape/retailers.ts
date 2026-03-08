/**
 * Scrapers for each competitor from research (RETAILER_LANDSCAPE.md).
 * Same attributes as Neptune: description, specification, rating, reviews, full pricing.
 * ToS metadata: all disabled by default (allowedUse: "none", killSwitch: true) until permission/legal review.
 */

import type { ToSMetadata } from "./tos-metadata.schema.js";
import type { FetchPageFn } from "./fetcher.js";
import { ScrapeConnector } from "./scrape-connector.js";
import { createRetailerScraperFetch } from "./retailer-scraper.js";
import { slugToUuid, extractListingProductsGeneric } from "./retailer-shared.js";

export interface RetailerConnectorOptions {
  fetchPage?: FetchPageFn;
}

const MAX_DETAIL_PAGES = 100;

function defaultTos(sourceId: string, sourceName: string, domain: string): ToSMetadata {
  return {
    sourceId,
    sourceName,
    tosUrl: `https://www.${domain}/terms`,
    robotsUrl: `https://www.${domain}/robots.txt`,
    lastReviewedAt: new Date().toISOString().slice(0, 19) + "Z",
    allowedUse: "none",
    killSwitch: true,
    notes: "Scraping disabled until ToS/legal review. Prefer affiliate/API feeds.",
  };
}

function retailerIdFromSourceId(sourceId: string): string {
  return slugToUuid("retailer-" + sourceId);
}

// --- Famous Smoke Shop ---
const FAMOUS_SMOKE = {
  sourceId: "famous-smoke.com",
  sourceName: "Famous Smoke Shop",
  baseUrl: "https://www.famous-smoke.com",
  listingUrls: [
    "https://www.famous-smoke.com/cigars",
    "https://www.famous-smoke.com/cigars/shop-by-brand",
  ],
};

export function createFamousSmokeConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector {
  const meta = tosMetadata ?? defaultTos(FAMOUS_SMOKE.sourceId, FAMOUS_SMOKE.sourceName, "famous-smoke.com");
  return new ScrapeConnector({
    id: "famous-smoke",
    source: FAMOUS_SMOKE.sourceName,
    tosMetadata: meta,
    fetch: createRetailerScraperFetch({
      id: "famous-smoke",
      source: FAMOUS_SMOKE.sourceName,
      sourceId: FAMOUS_SMOKE.sourceId,
      baseUrl: FAMOUS_SMOKE.baseUrl,
      listingUrls: FAMOUS_SMOKE.listingUrls,
      retailerId: retailerIdFromSourceId(FAMOUS_SMOKE.sourceId),
      retailerName: FAMOUS_SMOKE.sourceName,
      maxDetailPages: MAX_DETAIL_PAGES,
      fetchPage: options?.fetchPage,
    }),
  });
}

// --- Cigars International ---
const CIGARS_INTERNATIONAL = {
  sourceId: "cigarsinternational.com",
  sourceName: "Cigars International",
  baseUrl: "https://www.cigarsinternational.com",
  listingUrls: [
    "https://www.cigarsinternational.com/shop/?t=cigars&v=60",
    "https://www.cigarsinternational.com/shop/?t=cigars&v=60&start=60",
    "https://www.cigarsinternational.com/shop/?t=cigars&v=60&start=120",
  ],
};

/** CI uses /p/slug/id/ for product URLs; generic selector misses them. */
function extractCigarsInternationalListing(html: string): import("./retailer-shared.js").ListingProduct[] {
  return extractListingProductsGeneric(html, CIGARS_INTERNATIONAL.baseUrl, {
    productPathPattern: /\/p\//,
    linkSelector: 'a[href*="/p/"]',
  });
}

export function createCigarsInternationalConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector {
  const meta = tosMetadata ?? defaultTos(CIGARS_INTERNATIONAL.sourceId, CIGARS_INTERNATIONAL.sourceName, "cigarsinternational.com");
  return new ScrapeConnector({
    id: "cigars-international",
    source: CIGARS_INTERNATIONAL.sourceName,
    tosMetadata: meta,
    fetch: createRetailerScraperFetch({
      id: "cigars-international",
      source: CIGARS_INTERNATIONAL.sourceName,
      sourceId: CIGARS_INTERNATIONAL.sourceId,
      baseUrl: CIGARS_INTERNATIONAL.baseUrl,
      listingUrls: CIGARS_INTERNATIONAL.listingUrls,
      extractListing: extractCigarsInternationalListing,
      retailerId: retailerIdFromSourceId(CIGARS_INTERNATIONAL.sourceId),
      retailerName: CIGARS_INTERNATIONAL.sourceName,
      maxDetailPages: MAX_DETAIL_PAGES,
      fetchPage: options?.fetchPage,
    }),
  });
}

// --- JR Cigars ---
const JR_CIGARS = {
  sourceId: "jrcigars.com",
  sourceName: "JR Cigars",
  baseUrl: "https://www.jrcigars.com",
  listingUrls: [
    "https://www.jrcigars.com/cigars/",
    "https://www.jrcigars.com/cigars/all-cigars/",
    "https://www.jrcigars.com/cigars/shop-all-cigars/",
  ],
};

export function createJRCigarsConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector {
  const meta = tosMetadata ?? defaultTos(JR_CIGARS.sourceId, JR_CIGARS.sourceName, "jrcigars.com");
  return new ScrapeConnector({
    id: "jr-cigars",
    source: JR_CIGARS.sourceName,
    tosMetadata: meta,
    fetch: createRetailerScraperFetch({
      id: "jr-cigars",
      source: JR_CIGARS.sourceName,
      sourceId: JR_CIGARS.sourceId,
      baseUrl: JR_CIGARS.baseUrl,
      listingUrls: JR_CIGARS.listingUrls,
      sitemapListingUrl: "https://www.jrcigars.com/sitemap_2-category.xml",
      sitemapProductUrl: "https://www.jrcigars.com/sitemap_0-product.xml",
      maxProductUrlsFromSitemap: 60,
      retailerId: retailerIdFromSourceId(JR_CIGARS.sourceId),
      retailerName: JR_CIGARS.sourceName,
      maxDetailPages: MAX_DETAIL_PAGES,
      fetchPage: options?.fetchPage,
    }),
  });
}

// --- Thompson Cigar ---
const THOMPSON_CIGAR = {
  sourceId: "thompsoncigar.com",
  sourceName: "Thompson Cigar",
  baseUrl: "https://www.thompsoncigar.com",
  listingUrls: [
    "https://www.thompsoncigar.com/shop/all-cigar-brands/8336/",
    "https://www.thompsoncigar.com/shop/best-selling-boxes/9057/",
    "https://www.thompsoncigar.com/p/thompson-nicaragua-cigar/2051939/",
  ],
};

/** Thompson uses /p/slug/id/ and /shop/category/id/ like CI. */
function extractThompsonListing(html: string): import("./retailer-shared.js").ListingProduct[] {
  return extractListingProductsGeneric(html, THOMPSON_CIGAR.baseUrl, {
    productPathPattern: /\/p\//,
    linkSelector: 'a[href*="/p/"]',
  });
}

export function createThompsonCigarConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector {
  const meta = tosMetadata ?? defaultTos(THOMPSON_CIGAR.sourceId, THOMPSON_CIGAR.sourceName, "thompsoncigar.com");
  return new ScrapeConnector({
    id: "thompson-cigar",
    source: THOMPSON_CIGAR.sourceName,
    tosMetadata: meta,
    fetch: createRetailerScraperFetch({
      id: "thompson-cigar",
      source: THOMPSON_CIGAR.sourceName,
      sourceId: THOMPSON_CIGAR.sourceId,
      baseUrl: THOMPSON_CIGAR.baseUrl,
      listingUrls: THOMPSON_CIGAR.listingUrls,
      extractListing: extractThompsonListing,
      retailerId: retailerIdFromSourceId(THOMPSON_CIGAR.sourceId),
      retailerName: THOMPSON_CIGAR.sourceName,
      maxDetailPages: MAX_DETAIL_PAGES,
      fetchPage: options?.fetchPage,
    }),
  });
}

// --- Holt's ---
const HOLTS = {
  sourceId: "holts.com",
  sourceName: "Holt's",
  baseUrl: "https://www.holts.com",
  listingUrls: [
    "https://www.holts.com/cigars",
    "https://www.holts.com/cigars/all-cigars",
  ],
};

export function createHoltsConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector {
  const meta = tosMetadata ?? defaultTos(HOLTS.sourceId, HOLTS.sourceName, "holts.com");
  return new ScrapeConnector({
    id: "holts",
    source: HOLTS.sourceName,
    tosMetadata: meta,
    fetch: createRetailerScraperFetch({
      id: "holts",
      source: HOLTS.sourceName,
      sourceId: HOLTS.sourceId,
      baseUrl: HOLTS.baseUrl,
      listingUrls: HOLTS.listingUrls,
      retailerId: retailerIdFromSourceId(HOLTS.sourceId),
      retailerName: HOLTS.sourceName,
      maxDetailPages: MAX_DETAIL_PAGES,
      fetchPage: options?.fetchPage,
    }),
  });
}

// --- Gotham Cigars ---
const GOTHAM_CIGARS = {
  sourceId: "gothamcigars.com",
  sourceName: "Gotham Cigars",
  baseUrl: "https://www.gothamcigars.com",
  listingUrls: [
    "https://www.gothamcigars.com/cigars",
    "https://www.gothamcigars.com/cigars/all",
  ],
};

export function createGothamCigarsConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector {
  const meta = tosMetadata ?? defaultTos(GOTHAM_CIGARS.sourceId, GOTHAM_CIGARS.sourceName, "gothamcigars.com");
  return new ScrapeConnector({
    id: "gotham-cigars",
    source: GOTHAM_CIGARS.sourceName,
    tosMetadata: meta,
    fetch: createRetailerScraperFetch({
      id: "gotham-cigars",
      source: GOTHAM_CIGARS.sourceName,
      sourceId: GOTHAM_CIGARS.sourceId,
      baseUrl: GOTHAM_CIGARS.baseUrl,
      listingUrls: GOTHAM_CIGARS.listingUrls,
      retailerId: retailerIdFromSourceId(GOTHAM_CIGARS.sourceId),
      retailerName: GOTHAM_CIGARS.sourceName,
      maxDetailPages: MAX_DETAIL_PAGES,
      fetchPage: options?.fetchPage,
    }),
  });
}

// --- Mike's Cigars ---
const MIKES_CIGARS = {
  sourceId: "mikescigars.com",
  sourceName: "Mike's Cigars",
  baseUrl: "https://www.mikescigars.com",
  listingUrls: [
    "https://www.mikescigars.com/cigars/",
    "https://www.mikescigars.com/cigars/all/",
    "https://www.mikescigars.com/",
  ],
};

export function createMikesCigarsConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector {
  const meta = tosMetadata ?? defaultTos(MIKES_CIGARS.sourceId, MIKES_CIGARS.sourceName, "mikescigars.com");
  return new ScrapeConnector({
    id: "mikes-cigars",
    source: MIKES_CIGARS.sourceName,
    tosMetadata: meta,
    fetch: createRetailerScraperFetch({
      id: "mikes-cigars",
      source: MIKES_CIGARS.sourceName,
      sourceId: MIKES_CIGARS.sourceId,
      baseUrl: MIKES_CIGARS.baseUrl,
      listingUrls: MIKES_CIGARS.listingUrls,
      retailerId: retailerIdFromSourceId(MIKES_CIGARS.sourceId),
      retailerName: MIKES_CIGARS.sourceName,
      maxDetailPages: MAX_DETAIL_PAGES,
      fetchPage: options?.fetchPage,
    }),
  });
}

// --- Smoke Inn ---
const SMOKE_INN = {
  sourceId: "smokeinn.com",
  sourceName: "Smoke Inn",
  baseUrl: "https://www.smokeinn.com",
  listingUrls: [
    "https://www.smokeinn.com/cigars/",
    "https://www.smokeinn.com/cigars",
    "https://www.smokeinn.com/",
  ],
};

export function createSmokeInnConnector(tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions): ScrapeConnector {
  const meta = tosMetadata ?? defaultTos(SMOKE_INN.sourceId, SMOKE_INN.sourceName, "smokeinn.com");
  return new ScrapeConnector({
    id: "smoke-inn",
    source: SMOKE_INN.sourceName,
    tosMetadata: meta,
    fetch: createRetailerScraperFetch({
      id: "smoke-inn",
      source: SMOKE_INN.sourceName,
      sourceId: SMOKE_INN.sourceId,
      baseUrl: SMOKE_INN.baseUrl,
      listingUrls: SMOKE_INN.listingUrls,
      sitemapListingUrl: "https://www.smokeinn.com/sitemap.xml",
      sitemapProductUrl: "https://www.smokeinn.com/sitemap.xml",
      maxProductUrlsFromSitemap: 50,
      retailerId: retailerIdFromSourceId(SMOKE_INN.sourceId),
      retailerName: SMOKE_INN.sourceName,
      maxDetailPages: MAX_DETAIL_PAGES,
      fetchPage: options?.fetchPage,
    }),
  });
}

/** All competitor connectors from research (Tier 1 + Tier 2 + Smoke Inn). */
export const ALL_RETAILER_CONNECTORS = [
  createFamousSmokeConnector,
  createCigarsInternationalConnector,
  createJRCigarsConnector,
  createThompsonCigarConnector,
  createHoltsConnector,
  createGothamCigarsConnector,
  createMikesCigarsConnector,
  createSmokeInnConnector,
];

/** Entries for run-all-scrapers: load tos-metadata/{sourceId}.json and pass to createConnector. */
export const RETAILER_CONNECTOR_ENTRIES: Array<{
  sourceId: string;
  connectorId: string;
  createConnector: (tosMetadata?: ToSMetadata, options?: RetailerConnectorOptions) => ScrapeConnector;
}> = [
  { sourceId: "famous-smoke.com", connectorId: "famous-smoke", createConnector: createFamousSmokeConnector },
  { sourceId: "cigarsinternational.com", connectorId: "cigars-international", createConnector: createCigarsInternationalConnector },
  { sourceId: "jrcigars.com", connectorId: "jr-cigars", createConnector: createJRCigarsConnector },
  { sourceId: "thompsoncigar.com", connectorId: "thompson-cigar", createConnector: createThompsonCigarConnector },
  { sourceId: "holts.com", connectorId: "holts", createConnector: createHoltsConnector },
  { sourceId: "gothamcigars.com", connectorId: "gotham-cigars", createConnector: createGothamCigarsConnector },
  { sourceId: "mikescigars.com", connectorId: "mikes-cigars", createConnector: createMikesCigarsConnector },
  { sourceId: "smokeinn.com", connectorId: "smoke-inn", createConnector: createSmokeInnConnector },
];
