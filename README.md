# Cigar Market Research

This repo is organized into **two main branches**:

| Branch | Purpose |
|--------|--------|
| **`research/`** | Pre-seed research artifact: strategy docs, data, notes, and the polished web report viewer. |
| **`website/`** | Product monorepo: apps (web UI, API), packages (core, design, ingestion), and the staged build plan. |

---

## The Idea

- User enters a cigar they already like.
- System recommends **similar cigars** and finds the **best current deal** across US retailers.
- One flow: **discovery, comparison, and buying**. US-only; we refer, we don’t sell.

---

## Research branch (`research/`)

- **`docs/`** — Executive summary, problem statement, competitive landscape, data strategy, MVP recommendation, go/no-go, report design guidelines, UI/UX audit outputs.
- **`data/`** — Competitor matrix (CSV) and other research data.
- **`notes/`** — Open questions, assumptions, editorial audit.
- **`report/`** — Next.js web report viewer (analyst-style). Renders all research with sidebar nav and tables.

**Run the report:** From repo root, `npm run dev:report` (port 3001). Or `cd research/report && npm run dev`. Build static export: `cd research/report && npm run build` → output in `research/report/out/`.

---

## Website branch (`website/`)

- **`apps/web`** — Next.js main UI (@cigar/web): search → recommend → best deal. Port 3000.
- **`apps/api`** — Node services / ingestion triggers. Port 3002.
- **`packages/core`** — Schema, recommendation engine, best-deal engine, instrumentation (@cigar/core).
- **`packages/design`** — Design tokens and React components (@cigar/design). Storybook in package.
- **`packages/ingestion`** — Affiliate feed + scrape connectors, pipeline, ToS guardrails (@cigar/ingestion).
- **`BUILD_PLAN.md`** — Staged build plan (Stages 1–7) and data-wiring notes.

**Commands (from repo root):** `npm run dev` (web), `npm run dev:api` (api), `npm run build` (all workspaces).

---

## Repo structure

```
├── README.md
├── package.json              # Root workspaces: research/report, website/apps/*, website/packages/*
├── research/
│   ├── docs/
│   ├── data/
│   ├── notes/
│   └── report/                # Report viewer app
└── website/
    ├── BUILD_PLAN.md
    ├── tsconfig.base.json
    ├── apps/
    │   ├── web/
    │   └── api/
    └── packages/
        ├── core/
        ├── design/
        └── ingestion/
```

---

## Key conclusions (from research)

- **Gap:** No single product clearly owns “similar cigars + best price” in one flow. The wedge is **combined flow + trust**.
- **Recommendation:** Proceed narrowly; validate (interviews, data prototype, concierge test), then build MVP or pivot. See `research/docs/` for full brief.
