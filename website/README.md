# Website branch (product monorepo)

Product code for the cigar recommendation + deal-finding app. US-only; we refer, we don’t sell.

## Layout

- **`apps/web`** — Next.js UI (@cigar/web). Search → recommend → best deal; wishlist, profile, compliance. Port 3000.
- **`apps/api`** — Node API (@cigar/api). Ingestion triggers, etc. Port 3002.
- **`packages/core`** — Schema, recommendation engine, best-deal engine, instrumentation (@cigar/core).
- **`packages/design`** — Design tokens + React components (@cigar/design). Storybook: `npm run storybook -w @cigar/design` (port 6006).
- **`packages/ingestion`** — Affiliate feed + scrape connectors, pipeline, ToS guardrails (@cigar/ingestion).
- **`BUILD_PLAN.md`** — Staged build plan and data-wiring notes.

## Commands

Run from **repo root** (workspaces are defined there):

- `npm run dev` — start web app (port 3000)
- `npm run dev:api` — start API (port 3002)
- `npm run build` — build all workspaces

Design system Storybook (from root): `npm run storybook -w @cigar/design` (port 6006).

Research docs and report viewer live in the **`research/`** branch at the repo root.
