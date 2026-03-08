/**
 * Primary path: affiliate network feeds + retailer affiliate APIs/feeds.
 * No scraping; uses official product/price feeds where available.
 */
import { randomUUID } from "node:crypto";
import { normalizeCigarInput, } from "@cigar/core";
/**
 * Connector that consumes an affiliate feed and normalizes to Cigar, Pricing, Link, Retailer.
 * Stage 2 stub: fetch is provided by caller (real CJ/API integration later).
 */
export class AffiliateFeedConnector {
    id;
    source;
    config;
    constructor(config) {
        this.id = config.id;
        this.source = config.source;
        this.config = config;
    }
    async run(opts) {
        const start = Date.now();
        const warnings = [];
        opts.observability?.onStart?.(this.id);
        if (opts.killSwitch) {
            opts.observability?.onError?.(this.id, "Kill switch enabled; aborting");
            return { source: this.source, cigars: [], warnings: ["Kill switch enabled"] };
        }
        try {
            const raw = await this.config.fetch({ killSwitch: opts.killSwitch });
            const cigars = [];
            const pricing = [];
            const links = [];
            let retailer;
            if (raw.retailer) {
                retailer = {
                    id: randomUUID(),
                    name: raw.retailer.name,
                    domain: raw.retailer.domain,
                    source: this.source,
                    allowedStates: [],
                    updatedAt: new Date(),
                };
            }
            const retailerId = retailer?.id ?? randomUUID();
            for (const p of raw.products ?? []) {
                const cigarId = randomUUID();
                const rawCigar = {
                    externalId: p.id,
                    source: this.source,
                    brand: p.brand,
                    title: p.name,
                };
                cigars.push(normalizeCigarInput(rawCigar, cigarId, { [this.source]: p.id }));
                if (p.priceCents != null) {
                    pricing.push({
                        id: randomUUID(),
                        cigarId,
                        retailerId,
                        amountCents: p.priceCents,
                        currency: "USD",
                        packSize: "single",
                        inStock: p.inStock ?? true,
                        fetchedAt: new Date(),
                        source: this.source,
                    });
                }
                if (p.url) {
                    links.push({
                        id: randomUUID(),
                        cigarId,
                        retailerId,
                        url: p.url,
                        isAffiliate: true,
                        source: this.source,
                        updatedAt: new Date(),
                    });
                }
            }
            const totalItems = cigars.length + pricing.length + links.length;
            opts.observability?.onItem?.(this.id, "cigar", cigars.length);
            opts.observability?.onItem?.(this.id, "pricing", pricing.length);
            opts.observability?.onItem?.(this.id, "link", links.length);
            opts.observability?.onEnd?.(this.id, Date.now() - start, totalItems);
            return {
                source: this.source,
                cigars,
                pricing,
                links,
                retailers: retailer ? [retailer] : undefined,
                warnings,
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            opts.observability?.onError?.(this.id, message);
            return {
                source: this.source,
                cigars: [],
                warnings: [],
                error: message,
            };
        }
    }
}
//# sourceMappingURL=affiliate-feed.js.map