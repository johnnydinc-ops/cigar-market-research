# Cigar catalog (SKU database)

**Current state:** The app uses a **small mock catalog** for development (`apps/web/src/data/mockCatalog.ts` — 5 cigars). Scraped data from Neptune is written here when you run the Neptune scraper.

- **Neptune scraped output:** `website/data/catalog/neptune-scraped.json` — full dump from the Neptune Cigars scraper (same attributes below). Run: `npm run run-neptune` in `packages/ingestion`.
- **All scrapers (combined):** `website/data/catalog/all-scraped.json` — combined output from Neptune + all research competitors. Run in `packages/ingestion`: `npm run run-all-scrapers`. For **JS-rendered or bot-protected sites**, use **Playwright**: `USE_PLAYWRIGHT=1 node dist/run-all-scrapers.js`. The Playwright run uses a headless Chrome with anti-detection (stealth args, no webdriver flag), waits for `load` + product-like selectors, blocks images/fonts for speed, and adds jitter; it re-runs Neptune, Cigars International, JR, Thompson, Mike's, and Smoke Inn and merges the better result per source.

**Attributes captured (all scrapers):** cigars (brand, line, vitola, **description**, **specification**, **ratingAverage**, **ratingCount**), **pricing** (amountCents, packSizeLabel, msrpCents, saveCents, perStickCents, availabilityLabel), links, **documents** (RAG: product description/spec as `attribute`, user reviews as `review`).

Product direction (see `research/docs/`) is a **large catalog from day one** (thousands of SKUs) built from **affiliate feeds, licensed or public sources, and enrichment** — not from scraping in violation of ToS.

---

## Where the “large” catalog should live

When you add a real catalog, options:

1. **File-based:** e.g. `website/data/catalog/cigars.json` (+ retailers, pricing, links) — good for MVP and feed ingestion scripts.
2. **Database:** e.g. SQLite or Postgres under `website/data/` or a dedicated DB — for scale and querying.

The recommend and deal APIs in `apps/api` and `apps/web` currently read from the mock catalog. To switch to a real catalog:

- Ingest from **affiliate feeds** or other permitted sources into files or a DB in this directory (or linked from here).
- Export or query in the same shape as `@cigar/core` expects: `Cigar`, `Retailer`, `Pricing`, `Link` (see `packages/core/src/schema/`).
- Point the API routes at that data instead of `mockCatalog.ts`.

---

## Adding retailer sources (e.g. Neptune Cigars)

- **Preferred:** Use official **affiliate product feeds** or APIs when the retailer offers them. See `research/docs/DATA_ACQUISITION_STRATEGY.md` and `research/docs/RETAILER_LANDSCAPE.md`.
- **Scraping:** Only if ToS and legal review allow it. Per-source guardrails live in `packages/ingestion/tos-metadata/`. For Neptune (or any site), check ToS and `robots.txt`, then see `packages/ingestion/README.md` and the ToS metadata file for that domain (e.g. `neptunecigars.com.json`). Scrape is **off by default**; enable only after review.
