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

Sections are read at build time from `../docs/` and `../data/`. Run `npm run build` from the `report/` directory so that paths resolve to the parent `docs/` and `data/` folders.
