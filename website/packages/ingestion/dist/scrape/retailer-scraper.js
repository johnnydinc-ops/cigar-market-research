/**
 * Generic retailer scraper: same attributes as Neptune (description, spec, rating, reviews, full pricing).
 * Each competitor connector uses this with retailer-specific config and optional custom extractors.
 */
import { defaultFetchPage } from "./fetcher.js";
import { discoverUrlsFromSitemap } from "./sitemap.js";
import { slugToUuid, packLabelToPackSize, parseTitle, extractProductDetailGeneric, extractListingProductsGeneric, extractProductTitleFromDetail, } from "./retailer-shared.js";
async function fetchPageWithOpts(url, opts, fetchPage) {
    return fetchPage(url, opts);
}
export function createRetailerScraperFetch(config) {
    const { id, sourceId, baseUrl, listingUrls, retailerId, retailerName, maxDetailPages = 100, sitemapListingUrl, sitemapProductUrl, maxProductUrlsFromSitemap = 80, extractListing, extractDetail, } = config;
    const retailer = { id: retailerId, name: retailerName, domain: baseUrl, allowedStates: [], source: sourceId };
    const fetchPage = config.fetchPage ?? defaultFetchPage;
    return async (opts) => {
        const cigars = [];
        const cigarByUrl = new Map();
        const pricing = [];
        const links = [];
        const documents = [];
        const warnings = [];
        const seenUrls = new Set();
        let resolvedListingUrls = [...listingUrls];
        if (sitemapListingUrl && !opts.killSwitch) {
            try {
                const fromSitemap = await discoverUrlsFromSitemap(sitemapListingUrl, {
                    pathPattern: /\/cigar|\/cigars|\/product|\.aspx|item\//i,
                    maxUrls: 25,
                    timeoutMs: 12000,
                });
                if (fromSitemap.length > 0) {
                    resolvedListingUrls = [...fromSitemap, ...resolvedListingUrls];
                    opts.observability?.onWarning?.(id, `Sitemap discovered ${fromSitemap.length} listing URLs`);
                }
            }
            catch (e) {
                warnings.push(`Sitemap ${sitemapListingUrl}: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
        const doExtractListing = extractListing ?? ((html) => extractListingProductsGeneric(html, baseUrl));
        const doExtractDetail = extractDetail ?? extractProductDetailGeneric;
        // Optional: seed cigars from product URLs in sitemap (detail-only; no listing pages).
        if (sitemapProductUrl && !opts.killSwitch) {
            try {
                const productUrls = await discoverUrlsFromSitemap(sitemapProductUrl, {
                    pathPattern: /\/p\/|\/product\/|\/cigar\/|\/cigars\/|\.html|\.aspx\?|smokeinn\.com\/[^/]+\.html/i,
                    maxUrls: maxProductUrlsFromSitemap,
                    timeoutMs: 15000,
                });
                for (const productUrl of productUrls) {
                    if (opts.killSwitch || seenUrls.has(productUrl))
                        continue;
                    seenUrls.add(productUrl);
                    try {
                        const html = await fetchPageWithOpts(productUrl, opts, fetchPage);
                        const title = extractProductTitleFromDetail(html) || new URL(productUrl).pathname.split("/").filter(Boolean).pop() || "Cigar";
                        const detail = doExtractDetail(html, productUrl);
                        const cigarId = slugToUuid(productUrl);
                        const { brand, line, vitola } = parseTitle(title);
                        const cigar = {
                            id: cigarId,
                            brand,
                            line: line ?? undefined,
                            vitola: vitola ?? undefined,
                            externalIds: { [sourceId]: productUrl.replace(baseUrl, "").replace(/^\//, "") },
                            origin: "Unknown",
                            flavorNotes: [],
                            specification: detail.specification?.slice(0, 2048),
                            description: detail.description?.slice(0, 4096),
                            ratingAverage: detail.ratingAverage ?? undefined,
                            ratingCount: detail.ratingCount ?? undefined,
                        };
                        cigars.push(cigar);
                        cigarByUrl.set(productUrl, cigar);
                        links.push({
                            id: slugToUuid(productUrl + "-link"),
                            cigarId,
                            retailerId,
                            url: productUrl,
                            isAffiliate: false,
                            source: sourceId,
                        });
                        if (detail.description || detail.specification) {
                            const content = [detail.description, detail.specification].filter(Boolean).join("\n\n").slice(0, 4096);
                            documents.push({
                                id: slugToUuid(productUrl + "-desc"),
                                source: sourceId,
                                type: "attribute",
                                content,
                                cigarRefs: [cigar.id],
                                citationUrl: productUrl,
                                attribution: retailerName,
                            });
                        }
                        for (const r of detail.reviews) {
                            const content = `Review by ${r.author} (${r.date}): ${r.text}`.slice(0, 4096);
                            documents.push({
                                id: slugToUuid(productUrl + "-" + r.date + "-" + r.author),
                                source: sourceId,
                                type: "review",
                                content,
                                cigarRefs: [cigar.id],
                                citationUrl: productUrl,
                                attribution: `${retailerName} customer review`,
                            });
                        }
                        for (const row of detail.priceRows) {
                            pricing.push({
                                id: slugToUuid(productUrl + "-price-" + row.packSizeLabel.replace(/\s+/g, "-")),
                                cigarId: cigar.id,
                                retailerId,
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
                                source: sourceId,
                            });
                        }
                        opts.observability?.onItem?.(id, "cigar", 1);
                    }
                    catch (err) {
                        warnings.push(`Product ${productUrl}: ${err instanceof Error ? err.message : String(err)}`);
                    }
                }
                if (productUrls.length > 0)
                    opts.observability?.onWarning?.(id, `Sitemap product URLs: ${cigars.length} cigars from ${productUrls.length} URLs`);
            }
            catch (e) {
                warnings.push(`Sitemap product ${sitemapProductUrl}: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
        for (const listUrl of resolvedListingUrls) {
            if (opts.killSwitch)
                break;
            try {
                const html = await fetchPageWithOpts(listUrl, opts, fetchPage);
                const products = doExtractListing(html);
                for (const p of products) {
                    if (seenUrls.has(p.url))
                        continue;
                    seenUrls.add(p.url);
                    const cigarId = slugToUuid(p.url);
                    const { brand, line, vitola } = parseTitle(p.title);
                    const cigar = {
                        id: cigarId,
                        brand,
                        line: line ?? undefined,
                        vitola: vitola ?? undefined,
                        externalIds: { [sourceId]: p.url.replace(baseUrl, "").replace(/^\//, "") },
                        origin: "Unknown",
                        flavorNotes: [],
                        specification: p.shortSpec,
                    };
                    cigars.push(cigar);
                    cigarByUrl.set(p.url, cigar);
                    links.push({
                        id: slugToUuid(p.url + "-link"),
                        cigarId,
                        retailerId,
                        url: p.url,
                        isAffiliate: false,
                        source: sourceId,
                    });
                    if (p.priceCents != null && p.priceCents > 0) {
                        pricing.push({
                            id: slugToUuid(p.url + "-price-listing"),
                            cigarId,
                            retailerId,
                            amountCents: p.priceCents,
                            currency: "USD",
                            packSize: "other",
                            inStock: true,
                            fetchedAt: new Date(),
                            source: sourceId,
                        });
                    }
                }
                opts.observability?.onItem?.(id, "cigar", products.length);
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                warnings.push(`${listUrl}: ${msg}`);
                opts.observability?.onWarning?.(id, msg);
            }
        }
        const urlsToDetail = cigars
            .map((c) => {
            const slug = c.externalIds?.[sourceId];
            return slug ? `${baseUrl.replace(/\/$/, "")}/${slug}` : null;
        })
            .filter((u) => !!u)
            .slice(0, maxDetailPages);
        for (const productUrl of urlsToDetail) {
            if (opts.killSwitch)
                break;
            const cigar = cigarByUrl.get(productUrl);
            if (!cigar)
                continue;
            try {
                const html = await fetchPageWithOpts(productUrl, opts, fetchPage);
                const detail = doExtractDetail(html, productUrl);
                if (detail.description)
                    cigar.description = detail.description.slice(0, 4096);
                if (detail.specification)
                    cigar.specification = detail.specification.slice(0, 2048);
                if (detail.ratingAverage != null)
                    cigar.ratingAverage = detail.ratingAverage;
                if (detail.ratingCount != null)
                    cigar.ratingCount = detail.ratingCount;
                if (detail.description || detail.specification) {
                    const content = [detail.description, detail.specification].filter(Boolean).join("\n\n").slice(0, 4096);
                    documents.push({
                        id: slugToUuid(productUrl + "-desc"),
                        source: sourceId,
                        type: "attribute",
                        content,
                        cigarRefs: [cigar.id],
                        citationUrl: productUrl,
                        attribution: retailerName,
                    });
                }
                for (const r of detail.reviews) {
                    const content = `Review by ${r.author} (${r.date}): ${r.text}`.slice(0, 4096);
                    documents.push({
                        id: slugToUuid(productUrl + "-" + r.date + "-" + r.author + "-" + r.text.slice(0, 30)),
                        source: sourceId,
                        type: "review",
                        content,
                        cigarRefs: [cigar.id],
                        citationUrl: productUrl,
                        attribution: `${retailerName} customer review`,
                    });
                }
                for (const row of detail.priceRows) {
                    pricing.push({
                        id: slugToUuid(productUrl + "-price-" + row.packSizeLabel.replace(/\s+/g, "-")),
                        cigarId: cigar.id,
                        retailerId,
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
                        source: sourceId,
                    });
                }
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                warnings.push(`Detail ${productUrl}: ${msg}`);
            }
        }
        return {
            source: retailerName,
            cigars,
            pricing,
            links,
            documents,
            retailers: [retailer],
            warnings,
        };
    };
}
//# sourceMappingURL=retailer-scraper.js.map