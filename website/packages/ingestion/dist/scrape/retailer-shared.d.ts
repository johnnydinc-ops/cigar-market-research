/**
 * Shared types and extractors for retailer scrapers.
 * Same attributes across all competitors: description, specification, rating, reviews, full pricing.
 */
import type { PackSize } from "@cigar/core";
export declare function parsePriceCents(text: string | undefined): number | null;
export declare function slugToUuid(slug: string): string;
export declare function packLabelToPackSize(label: string): PackSize;
export declare function parseTitle(title: string): {
    brand: string;
    line?: string;
    vitola?: string;
};
export interface ListingProduct {
    title: string;
    url: string;
    priceCents: number | null;
    shortSpec?: string;
}
export interface PriceRow {
    packSizeLabel: string;
    msrpCents: number | null;
    amountCents: number;
    saveCents: number | null;
    perStickCents: number | null;
    inStock: boolean;
    availabilityLabel: string | null;
}
export interface ProductDetail {
    description: string | null;
    specification: string | null;
    ratingAverage: number | null;
    ratingCount: number | null;
    reviews: Array<{
        author: string;
        date: string;
        text: string;
    }>;
    priceRows: PriceRow[];
}
/** Extract product title from a detail page (h1, og:title, .product-name, <title>). */
export declare function extractProductTitleFromDetail(html: string): string | null;
/** Generic product-detail extraction (description, spec, rating, reviews, pricing). Works across many cigar retailer sites. */
export declare function extractProductDetailGeneric(html: string): ProductDetail;
/** Generic listing extractor: finds product links and optional title/price/shortSpec. */
export declare function extractListingProductsGeneric(html: string, baseUrl: string, options?: {
    productPathPattern?: RegExp;
    linkSelector?: string;
}): ListingProduct[];
//# sourceMappingURL=retailer-shared.d.ts.map