/**
 * Primary path: affiliate network feeds + retailer affiliate APIs/feeds.
 * No scraping; uses official product/price feeds where available.
 */

import { randomUUID } from "node:crypto";
import type { Cigar, Pricing, Link, Retailer } from "@cigar/core";
import {
  normalizeCigarInput,
  type RawCigarInput,
} from "@cigar/core";
import type { IngestionConnector, ConnectorResult, ConnectorRunOptions } from "./types.js";

export interface AffiliateFeedConfig {
  id: string;
  source: string;
  /** Fetch function: in practice would call CJ, retailer API, or read a feed URL. */
  fetch: (opts: { killSwitch?: boolean }) => Promise<AffiliateFeedRaw>;
}

/** Raw feed shape (affiliate-specific); adapter maps to our schema. */
export interface AffiliateFeedRaw {
  products?: Array<{
    id: string;
    name?: string;
    brand?: string;
    priceCents?: number;
    url?: string;
    inStock?: boolean;
    [key: string]: unknown;
  }>;
  retailer?: { id: string; name: string; domain?: string };
}

/**
 * Connector that consumes an affiliate feed and normalizes to Cigar, Pricing, Link, Retailer.
 * Stage 2 stub: fetch is provided by caller (real CJ/API integration later).
 */
export class AffiliateFeedConnector implements IngestionConnector {
  readonly id: string;
  readonly source: string;
  private config: AffiliateFeedConfig;

  constructor(config: AffiliateFeedConfig) {
    this.id = config.id;
    this.source = config.source;
    this.config = config;
  }

  async run(opts: ConnectorRunOptions): Promise<ConnectorResult> {
    const start = Date.now();
    const warnings: string[] = [];
    opts.observability?.onStart?.(this.id);

    if (opts.killSwitch) {
      opts.observability?.onError?.(this.id, "Kill switch enabled; aborting");
      return { source: this.source, cigars: [], warnings: ["Kill switch enabled"] };
    }

    try {
      const raw = await this.config.fetch({ killSwitch: opts.killSwitch });
      const cigars: Cigar[] = [];
      const pricing: Pricing[] = [];
      const links: Link[] = [];
      let retailer: Retailer | undefined;

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
        const rawCigar: RawCigarInput = {
          externalId: p.id,
          source: this.source,
          brand: (p as { brand?: string }).brand,
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
    } catch (err) {
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
