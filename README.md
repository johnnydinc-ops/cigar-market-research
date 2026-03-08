# Cigar Market Research

Pre-seed research and strategy brief for a **US-only platform** that combines cigar recommendation (“if you like X, try Y”) with deal-finding across online retailers.

---

## The Idea

- User enters a cigar they already like.
- System recommends **similar cigars** (flavor, strength, body, wrapper, origin, size, price).
- System finds the **best current deal** for that cigar and substitutes across US retailers.
- One flow for **discovery, comparison, and buying**.

Potential directions researched: recommendation engine, deal-finding, comparison marketplace, dynamic subscription, affiliate/lead-gen, and advertising for brands/retailers.

---

## What Was Researched

| Area | Document |
|------|----------|
| Executive summary | `docs/EXECUTIVE_SUMMARY.md` |
| Problem framing | `docs/PROBLEM_STATEMENT.md` |
| Product hypotheses | `docs/PRODUCT_HYPOTHESES.md` |
| Customer segments | `docs/CUSTOMER_SEGMENTS.md` |
| Competitive landscape | `docs/COMPETITIVE_LANDSCAPE.md` |
| Competitor matrix | `data/competitor_matrix.csv` |
| US retailer landscape | `docs/RETAILER_LANDSCAPE.md` |
| Data acquisition | `docs/DATA_ACQUISITION_STRATEGY.md` |
| Market analysis | `docs/MARKET_ANALYSIS.md` |
| Monetization | `docs/MONETIZATION.md` |
| User value proposition | `docs/USER_VALUE_PROP.md` |
| Innovation assessment | `docs/INNOVATION.md` |
| Risks | `docs/RISKS.md` |
| Validation plan | `docs/VALIDATION_PLAN.md` |
| MVP recommendation | `docs/MVP_RECOMMENDATION.md` |
| Go / no-go | `docs/GO_NO_GO.md` |

Supporting materials: `docs/RESEARCH_PLAN.md`, `docs/REPORT_OUTLINE.md`, `docs/REPORT_DESIGN_GUIDELINES.md`, `notes/OPEN_QUESTIONS.md`, `notes/ASSUMPTIONS.md`.

---

## Key Conclusions

- **Market:** US online cigar is large and growing (~$13B+ total; online ~$3.5B+). Discovery and price comparison are existing behaviors; no single product clearly owns **“similar cigars + best price”** in one flow.
- **Gap:** Recommendation (Cigar Sense, Cigar AI, Stogie Match) and price comparison (CigarFinder, Cigar Price Scout, Cigarsy) exist separately. The wedge is **combined flow + trust**.
- **Opportunity:** Plausible but not proven. Likely **niche- or affiliate-viable**; venture-scale would require material share of demand or expansion.
- **Risks:** Unvalidated demand for combined flow; retailer/data dependence; affiliate economics; trust; incumbent response.
- **Data:** Use affiliate feeds, manual curation, or partnership. Do not rely on scraping.

---

## Final Recommendation

**Proceed narrowly.**

1. **Validate first:** Interviews (15–20), data prototype (100–300 cigars without scraping), concierge test (10–20 users).
2. **If validation supports it:** Build the narrowest MVP: one flow (cigar I like → similar cigars → best price → affiliate links); curated catalog; 5–10 retailers; affiliate monetization.
3. **Differentiate** on trust (unbiased ranking, disclosure) and UX (one flow). Position: “Find cigars you’ll like. See the best price.”
4. **Stop** if validation shows no demand, data isn’t obtainable legally/sustainably, or economics don’t work.

---

## Should You Continue?

**Yes, to validate.** Do not rush into building. Run the validation plan in `docs/VALIDATION_PLAN.md`; then decide to build MVP, pivot (e.g., deal-only or recommendation-only), or stop. The research supports a focused wedge (combined rec + deal), not a guaranteed venture-scale outcome.

---

## Report Presentation

A polished, web-based report viewer is in the `report/` app. It renders all research with a clean, analyst-style layout (sidebar nav, tables, typography).

```bash
cd report && npm install && npm run dev
```

Open [http://localhost:3001](http://localhost:3001). To build a static export:

```bash
cd report && npm run build
```

Output is in `report/out/` (static HTML/CSS/JS).

---

## Repo Structure

```
├── README.md                 # This file
├── docs/                     # Research documents (Markdown)
├── data/                     # Competitor matrix (CSV)
├── notes/                    # Open questions, assumptions
└── report/                   # Next.js report viewer app
```
