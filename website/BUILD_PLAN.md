# Staged Build Plan

Pre-seed research artifact → product monorepo. **Product wedge:** one flow: user enters a cigar they like → system recommends similar cigars → system finds best current deal across US retailers → user clicks through affiliate link (we refer; we don’t sell). **Hard constraints:** US-only, trust differentiator, feeds-first + compliant scrape guardrails, ML + RAG recommendation, large catalog from day one.

---

## Stage 1 — Monorepo scaffolding + data model ✅

- **Layout:** `apps/web` (UI), `apps/api` (services / ingestion triggers), `packages/core` (schema, similarity engines, normalization), `packages/design` (design tokens + components).
- **Core schema:** cigars, attributes, retailers, pricing, links, documents (RAG corpus), substitutes (see `packages/core/src/schema`).
- **Instrumentation:** events for query → recommendation → best deal → affiliate click (`packages/core/src/instrumentation`).
- **Deliverables:** Root workspaces, `@cigar/core`, `@cigar/design` stub, `@cigar/api` stub, `@cigar/web` placeholder. `research/docs/uiux/` for Stage 5 outputs.

---

## Stage 2 — Multi-source ingestion (feeds-first, scrape-capable) ✅

- Pluggable pipeline: affiliate feeds, catalog/attributes, enrichment (NLP). Optional scrape module: off-by-default, ToS metadata, rate limits, kill switch, observability.
- **Deliverables:** `packages/ingestion` (connectors, pipeline, observability), normalization in `packages/core/normalize`.
- **packages/ingestion:** `AffiliateFeedConnector`, `ScrapeConnector` (ToS + rate limiter + kill switch), `runPipeline()`, `createObservability()`. Checked-in ToS metadata in `packages/ingestion/tos-metadata/`.

---

## Stage 3 — Best-price computation + trust guardrails ✅

- Best deal engine: normalize by pack size, freshness labels, ranking (match confidence → price → freshness → retailer trust score). Price history for later.
- **Deliverables:** `packages/core/bestDealEngine`.
- **bestDealEngine:** `computeBestDeals(input, options)` → ranked `DealRow[]` (perStickCents, freshnessLabel, matchConfidence). Pack-size normalization, freshness (fresh/recent/stale), rank order: match confidence → price → freshness → retailer trust. `PriceHistoryEntry` schema + `PriceHistoryStore` interface; `InMemoryPriceHistoryStore` for dev/graphs.

---

## Stage 4 — Recommendation engine (ML + RAG) ✅

- Hybrid: attribute similarity baseline, vector similarity over descriptors/reviews, RAG retrieval for “why recommended” + provenance.
- **Deliverables:** `packages/core/recommendation`, explanation generator + provenance.
- **Done:** `recommend()`, attribute baseline, RAG interfaces, `generateExplanation()` + provenance.

---

## Stage 5 — UI/UX competitor audit (must run before design system merge) ✅

- **Competitor set:** From `research/data/competitor_matrix.csv` + `research/docs/COMPETITIVE_LANDSCAPE.md` (recommendation, reviews, price-comparison, subscription, community).
- **Deliverables:** Playwright audit → `research/docs/uiux/competitor_audit.md`; `research/docs/uiux/pattern_library.md`; `research/docs/uiux/design_integration_checklist.md`.
- **Guardrail:** Do not merge design system implementation until Stage 5 outputs are complete and linked.
- **Done:** Browser audit (CigarFinder, Holt's, Halfwheel); pattern library (search, card, comparison table, trust); design integration checklist (components, props, provenance, a11y).

---

## Stage 6 — Design system + premium UX ✅

- After Stage 5: implement `packages/design` + Storybook; page mocks (search/index, recommend/results, detail); apply `research/docs/REPORT_DESIGN_GUIDELINES.md`.
- **Done:** Tokens + CSS in `styles.css`; `SearchEntry`, `RecommendationCard`, `DealComparisonTable`, `TrustBlock` with provenance; Storybook at `packages/design` (port 6006); `apps/web` pages: `/` (search), `/recommend?q=`, `/cigar/[id]` (detail).

---

## Stage 7 — Expansion (post-MVP) ✅ (first slice)

- Deal alerts, wishlist, profile, collaborative filtering, retailer partnerships, compliance docs.
- **Done (first slice):** Instrumentation: `wishlist_add`, `deal_alert_signup` in `@cigar/core`. Wishlist: localStorage + `WishlistProvider`, `/wishlist` page, Add to wishlist on recommend + cigar detail. Deal alert: stub form on cigar detail (email + subscribe; optional `__CIGAR_EMIT__` for analytics). Profile: `/profile` with strength/body preferences (localStorage). Compliance: `/compliance` (we refer, affiliate disclosure, US only, privacy). App nav: Home, Wishlist, Profile, Compliance.
- **Deferred:** Collaborative filtering, retailer partnerships, backend for deal alerts; full auth.

---

## Data wiring (post–Stage 7)

- **Recommend flow:** `GET /api/recommend?q=` uses `resolveSeedCigar(q)` + `recommend()` from `@cigar/core`; enriches each result with `computeBestDeals()` for best price. Mock catalog in `apps/web/src/data/mockCatalog.ts` (Cigars, Retailers, Pricing, Links).
- **Detail flow:** `GET /api/cigar/[id]/deals` uses `computeBestDeals()` from `@cigar/core`; returns rows for `DealComparisonTable`.
- **Recommend + detail pages** fetch from these APIs and render with design components. Replace mock catalog with real ingestion when feeds/API are available.

---

## Repo layout (two branches)

This repo has two main branches at the top level:

- **`research/`** — Pre-seed research artifact: `docs/`, `data/`, `notes/`, `report/` (web report viewer).
- **`website/`** — Product monorepo: this BUILD_PLAN, `apps/`, `packages/`, `tsconfig.base.json`. Root `package.json` and workspaces live at repo root.

```
├── package.json            # Root (workspaces: research/report, website/apps/*, website/packages/*)
├── research/
│   ├── docs/               # Research corpus + uiux (Stage 5)
│   ├── data/               # competitor_matrix.csv, etc.
│   ├── notes/
│   └── report/             # Next.js report viewer (port 3001)
└── website/
    ├── BUILD_PLAN.md       # This file
    ├── tsconfig.base.json
    ├── apps/               # web (@cigar/web), api (@cigar/api)
    └── packages/           # core, design, ingestion
```

## Commands

Run from repo root: `npm run dev` (website web, port 3000), `npm run dev:api` (port 3002), `npm run dev:report` (research report, port 3001), `npm run build` (all workspaces).
