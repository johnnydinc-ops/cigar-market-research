/**
 * Neptune Cigars scraper connector.
 * Fetches catalog, description, specification, rating, and user reviews from neptunecigar.com.
 * Emits RAG documents for reviews and product description. Respects ToS and rate limiter.
 */

import { createHash } from "node:crypto";
import { load } from "cheerio";
import type { ConnectorResult } from "../connectors/types.js";
import type { Cigar, Document, Link, PackSize, Pricing, Retailer } from "@cigar/core";
import type { ScrapeFetchOptions } from "./scrape-connector.js";
import type { ToSMetadata } from "./tos-metadata.schema.js";
import type { ListingProduct, PriceRow, ProductDetail } from "./retailer-shared.js";
import type { FetchPageFn } from "./fetcher.js";
import { defaultFetchPage } from "./fetcher.js";
import { ScrapeConnector } from "./scrape-connector.js";

const BASE_URL = "https://www.neptunecigar.com";
const LISTING_URLS = [
  `${BASE_URL}/cigars`,
  `${BASE_URL}/small-cigars`,
  `${BASE_URL}/just-landed`,
];

const NEPTUNE_RETAILER_ID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const NEPTUNE_RETAILER: Retailer = {
  id: NEPTUNE_RETAILER_ID,
  name: "Neptune Cigars",
  domain: BASE_URL,
  allowedStates: [],
  source: "neptunecigars.com",
};

function parsePriceCents(text: string | undefined): number | null {
  if (!text) return null;
  const match = text.replace(/,/g, "").match(/\$?\s*(\d+\.?\d*)/);
  if (!match) return null;
  const dollars = parseFloat(match[1]);
  if (Number.isNaN(dollars)) return null;
  return Math.round(dollars * 100);
}

function slugToUuid(slug: string): string {
  const hex = createHash("sha256").update(slug).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

/** Map retailer pack label to canonical PackSize. */
function packLabelToPackSize(label: string): PackSize {
  const lower = label.toLowerCase().trim();
  if (/^single$/i.test(lower)) return "single";
  if (/\b5-?pack\b|pack of 5/i.test(lower)) return "5-pack";
  if (/\b10-?pack\b|pack of 10/i.test(lower)) return "10-pack";
  if (/\bbox\b|box of \d+/i.test(lower)) return "box";
  if (/\bbundle\b/i.test(lower)) return "bundle";
  return "other";
}

function parseTitle(title: string): { brand: string; line?: string; vitola?: string } {
  const t = title.trim();
  const parts = t.split(/\s+/);
  if (parts.length <= 1) return { brand: t || "Unknown" };
  const brand = parts[0]!;
  const rest = parts.slice(1).join(" ");
  return { brand, line: rest || undefined, vitola: rest || undefined };
}

/** Extract product entries from a listing page HTML; include short spec/description when present. */
function extractProductsFromListing(html: string): ListingProduct[] {
  const $ = load(html);
  const products: ListingProduct[] = [];
  const productLinks = $('a[href*="/cigar/"][href*=".aspx"], a[href*="/product/"], .product a[href], .product-item a[href], .item a[href]').filter((_, el) => {
    const href = $(el).attr("href");
    return !!href && (href.includes("/cigar/") || href.includes("/product/")) && !href.startsWith("#");
  });
  const seen = new Set<string>();

  productLinks.each((_, el) => {
    const $el = $(el);
    let href = $el.attr("href");
    if (!href) return;
    if (href.startsWith("/")) href = BASE_URL + href;
    if (seen.has(href)) return;
    seen.add(href);

    const title =
      $el.find(".product-name, .name, .title, h2, h3").first().text().trim() ||
      $el.text().trim().split("\n")[0]?.trim() ||
      "";
    if (!title || title.length < 2) return;

    const $card = $el.closest(".product, .product-item, .item, .listing-item, tr");
    const priceEl = $card.find(".price, .product-price, [class*=\"price\"]").first();
    const priceText = priceEl.text().trim();
    const priceCents = parsePriceCents(priceText);

    let shortSpec: string | undefined;
    const cardText = $card.text();
    const lines = cardText.split(/\n/).map((s) => s.trim()).filter(Boolean);
    for (const line of lines) {
      if (line === title || line.startsWith("$") || /^\d+$/.test(line)) continue;
      if (line.length > 20 && line.length < 300 && !line.includes("Add to Cart") && !line.includes("MSRP")) {
        shortSpec = line;
        break;
      }
    }
    if (!shortSpec && $card.length) {
      const specEl = $card.find("[class*='description'], [class*='spec'], .subtitle, p").first();
      const specText = specEl.text().trim();
      if (specText.length > 10 && specText.length < 400) shortSpec = specText;
    }

    products.push({ title, url: href, priceCents: priceCents ?? null, shortSpec });
  });

  if (products.length === 0) {
    $('a[href*="/cigar/"]').each((_, el) => {
      const $el = $(el);
      let href = $el.attr("href");
      if (!href) return;
      if (href.startsWith("/")) href = BASE_URL + href;
      if (seen.has(href)) return;
      const title = $el.text().trim();
      if (!title || title.length < 3) return;
      seen.add(href);
      const $row = $el.closest("tr, .product, .item, li");
      const priceText = $row.find("[class*='price'], .price").first().text().trim();
      let shortSpec: string | undefined;
      $row.find("p, [class*='desc'], [class*='spec']").each((__, specEl) => {
        const t = $(specEl).text().trim();
        if (t.length > 15 && t.length < 350) shortSpec = t;
        return false;
      });
      products.push({ title, url: href, priceCents: parsePriceCents(priceText), shortSpec });
    });
  }

  return products;
}

/** Extract description, specification, rating, and reviews from a product detail page. */
function extractProductDetail(html: string, _productUrl: string): ProductDetail {
  const $ = load(html);
  let description: string | null = null;
  let specification: string | null = null;
  let ratingAverage: number | null = null;
  let ratingCount: number | null = null;
  const reviews: Array<{ author: string; date: string; text: string }> = [];

  const body = $("body").text();
  const bodyNorm = body.replace(/\s+/g, " ");

  const descCandidates = $("[class*='description'], .product-description, [class*='product-desc'], article p, .cigar-origin").filter((_, el) => {
    const t = $(el).text().trim();
    return t.length > 100 && t.length < 3000 && !t.includes("Add to Cart");
  });
  descCandidates.each((_, el) => {
    const t = $(el).text().trim();
    if (t.length > 80 && !description) description = t.slice(0, 4096);
    return false;
  });
  if (!description) {
    const match = bodyNorm.match(/(?:This awesome|The .{20,80} (?:are|is|was) .{20,500}\.(?:\s|$))/);
    if (match) description = match[1]!.trim().slice(0, 4096);
  }

  const specLabels = /^(Cigar Origin|Strength|Wrapper Color|Wrapper|Binder|Filler|Rolled by|Manufacturer)$/i;
  const specParts: string[] = [];
  $("strong, b").each((_, el) => {
    const label = $(el).text().trim();
    if (!specLabels.test(label)) return;
    const rest = $(el).parent().text().replace(label, "").trim().replace(/\s+/g, " ").slice(0, 300);
    if (rest && rest.length > 1 && !/^(MSRP|OUR PRICE|YOU SAVE|SMOKE RINGS|AVAILABILITY|QUANTITY)/i.test(rest)) {
      specParts.push(`${label}: ${rest}`);
    }
  });
  $("dt").each((_, el) => {
    const label = $(el).text().trim();
    if (!specLabels.test(label)) return;
    const value = $(el).next("dd").text().trim().replace(/\s+/g, " ").slice(0, 200);
    if (value) specParts.push(`${label}: ${value}`);
  });
  if (specParts.length > 0) specification = specParts.join(" | ").slice(0, 2048);

  const ratingMatch = bodyNorm.match(/OVERALL\s*(\d+\.?\d*)\s*(\d+)\s*reviews?/i);
  if (ratingMatch) {
    ratingAverage = parseFloat(ratingMatch[1]);
    ratingCount = parseInt(ratingMatch[2], 10);
    if (Number.isNaN(ratingAverage) || ratingAverage < 0 || ratingAverage > 5) ratingAverage = null;
    if (Number.isNaN(ratingCount) || ratingCount < 0) ratingCount = null;
  }

  const reviewBlocks = $("[class*='review'], .customer-review, [class*='customer-review']");
  if (reviewBlocks.length === 0) {
    const dateAuthorMatches = body.matchAll(/([A-Za-z][A-Za-z\s\.]*?)\s*(\d{2}\/\d{2}\/\d{4})\s*\[[^\]]*\]\s*([A-Z][^]*?)(?=\s*[A-Z][a-z]+ [A-Z]?\.?\s*\d{2}\/\d{2}\/\d{4}|Leave a message|Questions & Answers|$)/gi);
    for (const m of dateAuthorMatches) {
      const author = m[1]!.trim().slice(0, 64);
      const date = m[2]!.trim();
      const text = m[3]!.trim().replace(/\s+/g, " ").slice(0, 2000);
      if (text.length > 15 && !/^(Cigar Origin|Strength|Wrapper|Nicaragua|Medium)/i.test(text)) {
        reviews.push({ author, date, text });
      }
    }
  } else {
    reviewBlocks.each((_, block) => {
      const $block = $(block);
      const text = $block.find("[class*='review-body'], .text, p").first().text().trim().replace(/\s+/g, " ");
      if (text.length < 15) return;
      const author = $block.find("[class*='author'], .name").first().text().trim().slice(0, 64) || "Customer";
      const date = $block.find("[class*='date'], time").first().text().trim() || "";
      reviews.push({ author, date, text: text.slice(0, 2000) });
    });
  }

  const priceRows: PriceRow[] = [];
  const $tables = $("table");
  $tables.each((_, table) => {
    const $rows = $(table).find("tr");
    $rows.each((_, tr) => {
      const $cells = $(tr).find("td");
      if ($cells.length < 2) return;
      const texts = $cells.map((__, cell) => $(cell).text().trim()).get();
      const allText = texts.join(" ");
      if (!/\$\d/.test(allText)) return;
      const packLabel = texts[0] ?? "";
      if (!packLabel || packLabel.length > 80) return;
      if (/^(MSRP|OUR PRICE|YOU SAVE|SMOKE RINGS|AVAILABILITY|QUANTITY)$/i.test(packLabel.trim())) return;
      const prices = texts.slice(1).map((t) => parsePriceCents(t)).filter((c): c is number => c != null && c > 0);
      if (prices.length === 0) return;
      let amountCents: number;
      let msrpCents: number | null = null;
      let saveCents: number | null = null;
      if (prices.length >= 3) {
        msrpCents = prices[0]!;
        amountCents = prices[1]!;
        saveCents = prices[2]!;
      } else if (prices.length >= 2) {
        const [a, b] = [prices[0]!, prices[1]!];
        amountCents = Math.max(a, b);
        saveCents = Math.min(a, b);
        msrpCents = amountCents + saveCents;
      } else {
        amountCents = prices[0]!;
        if (prices.length > 1) msrpCents = prices[1]!;
        saveCents = msrpCents != null ? msrpCents - amountCents : null;
      }
      const inStock = !/backorder|email me when|out of stock/i.test(allText);
      const availabilityLabel = /(\+\s*Add to Cart|Backorder|In Stock|Email me when available)/i.exec(allText)?.[1]?.trim() ?? null;
      let perStickCents: number | null = null;
      const stickMatch = packLabel.match(/box of (\d+)|tin of (\d+)|(\d+)-pack/i) ?? packLabel.match(/(\d+)\s*count/i);
      if (stickMatch) {
        const n = parseInt(stickMatch[1] ?? stickMatch[2] ?? stickMatch[3] ?? "1", 10);
        if (n > 0) perStickCents = Math.round(amountCents / n);
      } else if (/^single$/i.test(packLabel.trim())) perStickCents = amountCents;
      priceRows.push({
        packSizeLabel: packLabel.slice(0, 128),
        msrpCents,
        amountCents,
        saveCents: saveCents != null && saveCents >= 0 ? saveCents : null,
        perStickCents,
        inStock,
        availabilityLabel: availabilityLabel?.slice(0, 64) ?? null,
      });
    });
  });
  if (priceRows.length === 0) {
    const priceBlocks = $("[class*='price'], [class*='Price']");
    priceBlocks.each((_, el) => {
      const t = $(el).text().trim();
      const amt = parsePriceCents(t);
      if (amt == null || amt <= 0) return;
      const label = $(el).closest("tr, .product, [class*='row']").find("td, [class*='pack']").first().text().trim() || "Other";
      if (!label || label.length > 80) return;
      priceRows.push({
        packSizeLabel: label.slice(0, 128),
        msrpCents: null,
        amountCents: amt,
        saveCents: null,
        perStickCents: null,
        inStock: !/backorder|email me/i.test(t),
        availabilityLabel: null,
      });
    });
  }

  return { description, specification, ratingAverage, ratingCount, reviews, priceRows };
}

export interface NeptuneConnectorOptions {
  tosMetadata: ToSMetadata;
  listingUrls?: string[];
  /** Max product detail pages to fetch per run (description, specs, reviews). Default 150. */
  maxDetailPages?: number;
  /** Page fetcher; default is fetch with browser-like headers + retries. Use Playwright for blocked sites. */
  fetchPage?: FetchPageFn;
}

export function createNeptuneFetch(options: NeptuneConnectorOptions): (opts: ScrapeFetchOptions) => Promise<ConnectorResult> {
  const { listingUrls = LISTING_URLS, maxDetailPages = 150, fetchPage: customFetchPage } = options;
  const fetchPage = customFetchPage ?? defaultFetchPage;

  return async (opts: ScrapeFetchOptions): Promise<ConnectorResult> => {
    const cigars: Cigar[] = [];
    const cigarByUrl = new Map<string, Cigar>();
    const pricing: Pricing[] = [];
    const links: Link[] = [];
    const documents: Document[] = [];
    const warnings: string[] = [];
    const seenUrls = new Set<string>();

    for (const listUrl of listingUrls) {
      if (opts.killSwitch) break;
      try {
        const html = await fetchPage(listUrl, opts);
        const products = extractProductsFromListing(html);

        for (const p of products) {
          if (seenUrls.has(p.url)) continue;
          seenUrls.add(p.url);

          const cigarId = slugToUuid(p.url);
          const { brand, line, vitola } = parseTitle(p.title);
          const cigar: Cigar = {
            id: cigarId,
            brand,
            line: line ?? undefined,
            vitola: vitola ?? undefined,
            externalIds: { neptunecigars: p.url.replace(BASE_URL, "").replace(/^\//, "") },
            origin: "Unknown",
            flavorNotes: [],
            specification: p.shortSpec,
          };
          cigars.push(cigar);
          cigarByUrl.set(p.url, cigar);

          links.push({
            id: slugToUuid(p.url + "-link"),
            cigarId,
            retailerId: NEPTUNE_RETAILER_ID,
            url: p.url,
            isAffiliate: false,
            source: "neptunecigars.com",
          });

          if (p.priceCents != null && p.priceCents > 0) {
            pricing.push({
              id: slugToUuid(p.url + "-price"),
              cigarId,
              retailerId: NEPTUNE_RETAILER_ID,
              amountCents: p.priceCents,
              currency: "USD",
              packSize: "other",
              inStock: true,
              fetchedAt: new Date(),
              source: "neptunecigars.com",
            });
          }
        }
        opts.observability?.onItem?.("neptune", "cigar", products.length);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        warnings.push(`${listUrl}: ${msg}`);
        opts.observability?.onWarning?.("neptune", msg);
      }
    }

    const urlsToDetail = cigars
      .map((c) => {
        const slug = c.externalIds?.neptunecigars;
        return slug ? `${BASE_URL}/${slug}` : null;
      })
      .filter((u): u is string => !!u)
      .slice(0, maxDetailPages);

    let detailCount = 0;
    for (const productUrl of urlsToDetail) {
      if (opts.killSwitch) break;
      const cigar = cigarByUrl.get(productUrl);
      if (!cigar) continue;
      try {
        const html = await fetchPage(productUrl, opts);
        const detail = extractProductDetail(html, productUrl);

        if (detail.description) cigar.description = detail.description.slice(0, 4096);
        if (detail.specification) cigar.specification = detail.specification.slice(0, 2048);
        if (detail.ratingAverage != null) cigar.ratingAverage = detail.ratingAverage;
        if (detail.ratingCount != null) cigar.ratingCount = detail.ratingCount;

        if (detail.description || detail.specification) {
          const content = [detail.description, detail.specification].filter(Boolean).join("\n\n").slice(0, 4096);
          documents.push({
            id: slugToUuid(productUrl + "-desc"),
            source: "neptunecigars.com",
            type: "attribute",
            content,
            cigarRefs: [cigar.id],
            citationUrl: productUrl,
            attribution: "Neptune Cigars",
          });
        }

        for (const r of detail.reviews) {
          const content = `Review by ${r.author} (${r.date}): ${r.text}`.slice(0, 4096);
          documents.push({
            id: slugToUuid(productUrl + "-" + r.date + "-" + r.author + "-" + r.text.slice(0, 30)),
            source: "neptunecigars.com",
            type: "review",
            content,
            cigarRefs: [cigar.id],
            citationUrl: productUrl,
            attribution: "Neptune Cigars customer review",
          });
        }

        for (const row of detail.priceRows) {
          pricing.push({
            id: slugToUuid(productUrl + "-price-" + row.packSizeLabel.replace(/\s+/g, "-")),
            cigarId: cigar.id,
            retailerId: NEPTUNE_RETAILER_ID,
            amountCents: row.amountCents,
            currency: "USD",
            packSize: packLabelToPackSize(row.packSizeLabel),
            packSizeLabel: row.packSizeLabel,
            msrpCents: row.msrpCents ?? undefined,
            saveCents: row.saveCents ?? undefined,
            perStickCents: row.perStickCents ?? undefined,
            inStock: row.inStock,
            availabilityLabel: row.availabilityLabel ?? undefined,
            fetchedAt: new Date(),
            source: "neptunecigars.com",
          });
        }
        detailCount++;
        if (detailCount % 20 === 0) opts.observability?.onItem?.("neptune", "document", detailCount);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        warnings.push(`Detail ${productUrl}: ${msg}`);
      }
    }

    return {
      source: "Neptune Cigars",
      cigars,
      pricing,
      links,
      documents,
      retailers: [NEPTUNE_RETAILER],
      warnings,
    };
  };
}

export const NEPTUNE_TOS_METADATA: ToSMetadata = {
  sourceId: "neptunecigars.com",
  sourceName: "Neptune Cigars",
  tosUrl: "https://www.neptunecigar.com/terms-and-conditions",
  robotsUrl: "https://www.neptunecigar.com/robots.txt",
  lastReviewedAt: "2025-03-07T00:00:00Z",
  allowedUse: "with-rate-limit",
  maxRequestsPerMinute: 8,
  killSwitch: false,
  notes: "Scraping allowed per product owner. Rate-limited.",
};

export interface NeptuneConnectorCreateOptions {
  maxDetailPages?: number;
  fetchPage?: FetchPageFn;
}

export function createNeptuneConnector(
  tosMetadata: ToSMetadata = NEPTUNE_TOS_METADATA,
  opts?: NeptuneConnectorCreateOptions
): ScrapeConnector {
  return new ScrapeConnector({
    id: "neptune",
    source: "Neptune Cigars",
    tosMetadata,
    fetch: createNeptuneFetch({
      tosMetadata,
      listingUrls: LISTING_URLS,
      maxDetailPages: opts?.maxDetailPages ?? 150,
      fetchPage: opts?.fetchPage,
    }),
  });
}
