# Research branch

Pre-seed research and strategy artifact for the US-only cigar recommendation + deal-finding platform.

## Contents

| Path | Description |
|------|-------------|
| **`docs/`** | Strategy and product docs: executive summary, problem statement, competitive landscape, data acquisition, MVP recommendation, go/no-go, report design guidelines. Stage 5 UI/UX outputs in `docs/uiux/` (competitor audit, pattern library, design integration checklist). |
| **`data/`** | Research data, e.g. `competitor_matrix.csv`. |
| **`notes/`** | Open questions, assumptions, editorial audit. |
| **`report/`** | Next.js report viewer. Renders `docs/` and `data/` with a polished, analyst-style layout (sidebar, tables). |

## Run the report

From repo root:

```bash
npm run dev:report
```

Open [http://localhost:3001](http://localhost:3001).

Or from this directory:

```bash
cd report && npm install && npm run dev
```

Static export: `cd report && npm run build` → output in `report/out/`.

Sections are read at build time from `../docs/` and `../data/` relative to `report/`.
