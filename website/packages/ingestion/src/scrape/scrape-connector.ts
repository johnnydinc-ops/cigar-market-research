/**
 * Optional scrape connector: OFF BY DEFAULT.
 * Only runs when explicitly enabled and when ToS metadata allows.
 * Uses: ToS metadata (checked-in), rate limiter, kill switch, observability.
 */

import type { IngestionConnector, ConnectorResult, ConnectorRunOptions } from "../connectors/types.js";
import { ToSMetadataSchema, type ToSMetadata } from "./tos-metadata.schema.js";
import { RateLimiter } from "./rate-limiter.js";

export interface ScrapeConnectorConfig {
  id: string;
  source: string;
  /** ToS metadata (loaded from checked-in file or passed in). */
  tosMetadata: ToSMetadata;
  /** Fetch implementation (e.g. HTTP with robots check). Caller must respect rate limiter. */
  fetch: (opts: ScrapeFetchOptions) => Promise<ConnectorResult>;
}

export interface ScrapeFetchOptions {
  killSwitch: boolean;
  rateLimiter: RateLimiter | null;
  observability: ConnectorRunOptions["observability"];
}

/**
 * Scrape connector that enforces ToS metadata, rate limits, and kill switch.
 * Off-by-default: allowedUse must not be "none" and killSwitch must be false.
 */
export class ScrapeConnector implements IngestionConnector {
  readonly id: string;
  readonly source: string;
  private config: ScrapeConnectorConfig;
  private rateLimiter: RateLimiter | null = null;

  constructor(config: ScrapeConnectorConfig) {
    this.id = config.id;
    this.source = config.source;
    ToSMetadataSchema.parse(config.tosMetadata);
    this.config = config;
    if (
      config.tosMetadata.allowedUse === "with-rate-limit" &&
      config.tosMetadata.maxRequestsPerMinute != null
    ) {
      this.rateLimiter = new RateLimiter({
        maxRequestsPerMinute: config.tosMetadata.maxRequestsPerMinute,
      });
    }
  }

  async run(opts: ConnectorRunOptions): Promise<ConnectorResult> {
    const start = Date.now();
    opts.observability?.onStart?.(this.id);

    const { tosMetadata } = this.config;

    if (tosMetadata.killSwitch || opts.killSwitch) {
      opts.observability?.onError?.(this.id, "Kill switch enabled; scrape aborted");
      return {
        source: this.source,
        cigars: [],
        warnings: ["Kill switch enabled"],
      };
    }

    if (tosMetadata.allowedUse === "none") {
      opts.observability?.onError?.(this.id, "ToS metadata: allowedUse is none");
      return {
        source: this.source,
        cigars: [],
        warnings: ["Scraping not allowed for this source (ToS)"],
      };
    }

    if (this.rateLimiter && !this.rateLimiter.allow()) {
      opts.observability?.onWarning?.(this.id, "Rate limit exceeded");
      return {
        source: this.source,
        cigars: [],
        warnings: ["Rate limit exceeded; try again later"],
      };
    }

    try {
      const result = await this.config.fetch({
        killSwitch: opts.killSwitch ?? false,
        rateLimiter: this.rateLimiter,
        observability: opts.observability,
      });
      const totalItems =
        result.cigars.length +
        (result.pricing?.length ?? 0) +
        (result.links?.length ?? 0) +
        (result.documents?.length ?? 0);
      opts.observability?.onEnd?.(this.id, Date.now() - start, totalItems);
      return result;
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
