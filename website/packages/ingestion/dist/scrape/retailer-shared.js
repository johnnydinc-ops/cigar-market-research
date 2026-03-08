/**
 * Shared types and extractors for retailer scrapers.
 * Same attributes across all competitors: description, specification, rating, reviews, full pricing.
 */
import { createHash } from "node:crypto";
import { load } from "cheerio";
export function parsePriceCents(text) {
    if (!text)
        return null;
    const match = text.replace(/,/g, "").match(/\$?\s*(\d+\.?\d*)/);
    if (!match)
        return null;
    const dollars = parseFloat(match[1]);
    if (Number.isNaN(dollars))
        return null;
    return Math.round(dollars * 100);
}
export function slugToUuid(slug) {
    const hex = createHash("sha256").update(slug).digest("hex").slice(0, 32);
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
export function packLabelToPackSize(label) {
    const lower = label.toLowerCase().trim();
    if (/^single$/i.test(lower))
        return "single";
    if (/\b5-?pack\b|pack of 5/i.test(lower))
        return "5-pack";
    if (/\b10-?pack\b|pack of 10/i.test(lower))
        return "10-pack";
    if (/\bbox\b|box of \d+/i.test(lower))
        return "box";
    if (/\bbundle\b/i.test(lower))
        return "bundle";
    return "other";
}
export function parseTitle(title) {
    const t = title.trim();
    const parts = t.split(/\s+/);
    if (parts.length <= 1)
        return { brand: t || "Unknown" };
    const brand = parts[0];
    const rest = parts.slice(1).join(" ");
    return { brand, line: rest || undefined, vitola: rest || undefined };
}
/** Extract product title from a detail page (h1, og:title, .product-name, <title>). */
export function extractProductTitleFromDetail(html) {
    const $ = load(html);
    const selectors = [
        "h1.product-name",
        "h1.product-title",
        ".product-name",
        ".product-title",
        "h1",
        "[class*='product'][class*='name']",
        "[class*='product'][class*='title']",
    ];
    for (const sel of selectors) {
        const t = $(sel).first().text().trim();
        if (t && t.length >= 2 && t.length < 300 && !/^\s*\$|^add to cart|^buy now$/i.test(t))
            return t;
    }
    const ogTitle = $('meta[property="og:title"]').attr("content")?.trim();
    if (ogTitle && ogTitle.length >= 2 && ogTitle.length < 300)
        return ogTitle;
    const titleTag = $("title").text().trim();
    if (titleTag) {
        const clean = titleTag.replace(/\s*[\|\-–—]\s*.*$/, "").trim();
        if (clean.length >= 2 && clean.length < 300)
            return clean;
    }
    return null;
}
/** Generic product-detail extraction (description, spec, rating, reviews, pricing). Works across many cigar retailer sites. */
export function extractProductDetailGeneric(html) {
    const $ = load(html);
    let description = null;
    let specification = null;
    let ratingAverage = null;
    let ratingCount = null;
    const reviews = [];
    const body = $("body").text();
    const bodyNorm = body.replace(/\s+/g, " ");
    $("[class*='description'], .product-description, [class*='product-desc'], article p").each((_, el) => {
        const t = $(el).text().trim();
        if (t.length > 80 && t.length < 3000 && !t.includes("Add to Cart") && !description) {
            description = t.slice(0, 4096);
            return false;
        }
    });
    if (!description && bodyNorm.length > 200) {
        const match = bodyNorm.match(/(?:This |The |A |An )[\s\S]{50,800}\.(?=\s|$)/);
        if (match)
            description = match[0].trim().slice(0, 4096);
    }
    const specLabels = /^(Cigar Origin|Strength|Wrapper Color|Wrapper|Binder|Filler|Rolled by|Manufacturer|Origin|Body)$/i;
    const specParts = [];
    $("strong, b, dt").each((_, el) => {
        const label = $(el).text().trim();
        if (!specLabels.test(label))
            return;
        const $next = $(el).next("dd");
        const value = $next.length ? $next.text().trim() : $(el).parent().text().replace(label, "").trim();
        const rest = value.replace(/\s+/g, " ").slice(0, 300);
        if (rest && !/^(MSRP|OUR PRICE|YOU SAVE|QUANTITY)/i.test(rest))
            specParts.push(`${label}: ${rest}`);
    });
    if (specParts.length > 0)
        specification = specParts.join(" | ").slice(0, 2048);
    const ratingMatch = bodyNorm.match(/(?:OVERALL|Rating|Score)\s*(\d+\.?\d*)\s*(\d+)\s*reviews?/i) ?? bodyNorm.match(/(\d+\.?\d*)\s*\/\s*5\s*(\d+)\s*reviews?/i);
    if (ratingMatch) {
        ratingAverage = parseFloat(ratingMatch[1]);
        ratingCount = parseInt(ratingMatch[2], 10);
        if (Number.isNaN(ratingAverage) || ratingAverage < 0 || ratingAverage > 5)
            ratingAverage = null;
        if (Number.isNaN(ratingCount) || ratingCount < 0)
            ratingCount = null;
    }
    $("[class*='review'], .customer-review").each((_, block) => {
        const text = $(block).find("[class*='review-body'], .text, p").first().text().trim().replace(/\s+/g, " ");
        if (text.length < 15)
            return;
        reviews.push({
            author: $(block).find("[class*='author'], .name").first().text().trim().slice(0, 64) || "Customer",
            date: $(block).find("[class*='date'], time").first().text().trim() || "",
            text: text.slice(0, 2000),
        });
    });
    if (reviews.length === 0) {
        const reviewRegex = /([A-Za-z][A-Za-z\s\.]*?)\s*(\d{2}\/\d{2}\/\d{4})\s*\[[^\]]*\]\s*([A-Z][^]*?)(?=\s*[A-Z][a-z]+ [A-Z]?\.?\s*\d{2}\/\d{2}\/\d{4}|Leave a message|Questions & Answers|$)/gi;
        let m;
        while ((m = reviewRegex.exec(body)) !== null) {
            const text = m[3].trim().replace(/\s+/g, " ").slice(0, 2000);
            if (text.length > 15 && !/^(Cigar Origin|Strength|Wrapper)/i.test(text)) {
                reviews.push({ author: m[1].trim().slice(0, 64), date: m[2].trim(), text });
            }
        }
    }
    const priceRows = [];
    $("table tr").each((_, tr) => {
        const texts = $(tr).find("td").map((__, c) => $(c).text().trim()).get();
        if (texts.length < 2 || !/\$\d/.test(texts.join(" ")))
            return;
        const packLabel = texts[0] ?? "";
        if (!packLabel || packLabel.length > 80 || /^(MSRP|OUR PRICE|YOU SAVE|QUANTITY)$/i.test(packLabel.trim()))
            return;
        const prices = texts.slice(1).map((t) => parsePriceCents(t)).filter((c) => c != null && c > 0);
        if (prices.length === 0)
            return;
        let amountCents;
        let msrpCents = null;
        let saveCents = null;
        if (prices.length >= 3) {
            msrpCents = prices[0];
            amountCents = prices[1];
            saveCents = prices[2];
        }
        else if (prices.length >= 2) {
            const [a, b] = [prices[0], prices[1]];
            amountCents = Math.max(a, b);
            saveCents = Math.min(a, b);
            msrpCents = amountCents + saveCents;
        }
        else {
            amountCents = prices[0];
        }
        const allText = texts.join(" ");
        let perStickCents = null;
        const stickMatch = packLabel.match(/box of (\d+)|tin of (\d+)|(\d+)-pack/i) ?? packLabel.match(/(\d+)\s*count/i);
        if (stickMatch) {
            const n = parseInt(stickMatch[1] ?? stickMatch[2] ?? stickMatch[3] ?? "1", 10);
            if (n > 0)
                perStickCents = Math.round(amountCents / n);
        }
        else if (/^single$/i.test(packLabel.trim()))
            perStickCents = amountCents;
        priceRows.push({
            packSizeLabel: packLabel.slice(0, 128),
            msrpCents,
            amountCents,
            saveCents: saveCents != null && saveCents >= 0 ? saveCents : null,
            perStickCents,
            inStock: !/backorder|email me when|out of stock/i.test(allText),
            availabilityLabel: /(\+\s*Add to Cart|Backorder|In Stock|Email me when available)/i.exec(allText)?.[1]?.trim() ?? null,
        });
    });
    if (priceRows.length === 0) {
        $("[class*='price']").each((_, el) => {
            const t = $(el).text().trim();
            const amt = parsePriceCents(t);
            if (amt == null || amt <= 0)
                return;
            const label = $(el).closest("tr, .product, [class*='row']").find("td, [class*='pack']").first().text().trim() || "Other";
            if (label.length > 80)
                return;
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
/** Generic listing extractor: finds product links and optional title/price/shortSpec. */
export function extractListingProductsGeneric(html, baseUrl, options) {
    const $ = load(html);
    const pattern = options?.productPathPattern ?? /\/product\/|\/cigar\/|\/cigars\/|\.aspx\?|item\//i;
    const selector = options?.linkSelector ?? 'a[href*="/product/"], a[href*="/cigar/"], a[href*="/cigars/"], .product a[href], .product-item a[href]';
    const products = [];
    const seen = new Set();
    $(selector).each((_, el) => {
        let href = $(el).attr("href");
        if (!href || !pattern.test(href) || href.startsWith("#"))
            return;
        if (href.startsWith("/"))
            href = baseUrl.replace(/\/$/, "") + href;
        if (seen.has(href))
            return;
        seen.add(href);
        let title = $(el).find(".product-name, .name, .title, h2, h3").first().text().trim() || $(el).text().trim().split("\n")[0]?.trim() || "";
        title = title.replace(/\s*\d+\s*Options?\s*$/i, "").trim();
        if (!title || title.length < 2)
            return;
        const $card = $(el).closest(".product, .product-item, .item, tr, li");
        const priceCents = parsePriceCents($card.find(".price, [class*='price']").first().text().trim());
        let shortSpec;
        $card.find("p, [class*='desc'], [class*='spec']").each((__, specEl) => {
            const t = $(specEl).text().trim();
            if (t.length > 15 && t.length < 350)
                shortSpec = t;
            return false;
        });
        products.push({ title, url: href, priceCents: priceCents ?? null, shortSpec });
    });
    return products;
}
//# sourceMappingURL=retailer-shared.js.map