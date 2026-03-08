# Report Viewer

Static report presentation for the cigar market research. Analyst-style layout: sidebar navigation, clean typography, tables, and markdown-rendered sections.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Build static export

```bash
npm run build
```

Output is in `out/`. Serve with any static host or open `out/index.html`.

## Content source

Sections are read at build time from `../docs/` and `../data/` (i.e. `research/docs/` and `research/data/`). Run `npm run build` from the `report/` directory, or `npm run build` from repo root (report is a workspace).
