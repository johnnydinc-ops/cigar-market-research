# @cigar/ingestion

Pluggable multi-source ingestion: **feeds-first**, optional scrape with guardrails. US-only.

## Primary path: affiliate feeds

- `AffiliateFeedConnector`: pass a `fetch` that returns products + retailer (CJ, retailer API, or feed URL). Outputs normalized `Cigar`, `Pricing`, `Link`, `Retailer` via `@cigar/core` normalize.

## Optional scrape (off by default)

- `ScrapeConnector`: only runs when ToS metadata allows and kill switch is off.
- **ToS metadata** (checked-in under `tos-metadata/`): `sourceId`, `tosUrl`, `allowedUse` (`none` | `public-pages-only` | `with-rate-limit`), `maxRequestsPerMinute`, `killSwitch`.
- **Retailer scrapers (same attributes: description, spec, rating, reviews, full pricing):**
  - **Neptune Cigars** — enabled (per product owner). `createNeptuneConnector()`, `run-neptune`.
  - **Competitors from research** (all disabled by default): Famous Smoke, Cigars International, JR Cigars, Thompson Cigar, Holt's, Gotham Cigars, Mike's Cigars, Smoke Inn. ToS files: `tos-metadata/famous-smoke.com.json`, etc. Enable by setting `allowedUse` and `killSwitch: false` after review. `run-all-scrapers` runs Neptune + all competitors (disabled ones return empty).
- **Rate limiter**: sliding window per connector when `allowedUse === "with-rate-limit"`.
- **Kill switch**: env or per-source; aborts run.

## Pipeline and observability

- `runPipeline({ connectors, killSwitch, observability })`: runs connectors in order, aggregates results.
- `createObservability()`: logs start/item/warning/error/end (no PII).

## Normalization

Catalog/attribute normalization lives in `@cigar/core` (`normalizeCigarInput`, brand/wrapper/strength/body rules). Use it in feed adapters before emitting entities.
