# Pattern Library — Best-in-class amalgam (Stage 5)

**In brief:** Recommended UI patterns for our product, synthesized from competitor audit and product wedge (recommendation + best deal, US-only, trust differentiator). Use with `docs/REPORT_DESIGN_GUIDELINES.md` and `design_integration_checklist.md`.

---

## 1. Search entry

**Goal:** One clear way to start the core flow: "cigar I like" → recommendations → best deal.

**Best-in-class references:**
- **CigarFinder:** Single prominent "Search products here" in header; full-width, always visible.
- **Holt's:** Dedicated "Advanced Cigar Finder" as primary discovery CTA alongside search.

**Recommended pattern:**
- **Primary:** One hero or header search input: placeholder e.g. "Enter a cigar you like (name or brand)" or "Search cigars." Submit = go to recommendation results (not generic product list).
- **Secondary (optional):** Link or short path to "Browse by brand" or "Advanced filters" for users who prefer exploration over "like X."
- **No clutter:** Avoid multiple competing search boxes (product vs brand); one entry that drives into the recommend flow, with optional filters on the results page.

**Component intent:** `SearchEntry` — single input, primary CTA, optional secondary link. Accessible (label, focus, submit on Enter).

---

## 2. Result card (recommendation / cigar)

**Goal:** One card per recommended cigar: identity, why it’s recommended, and path to deal.

**Best-in-class references:**
- **CigarFinder:** Product grid with retailer-specific "Get Deal" / "Get Code"; trust via retailer names.
- **Holt's:** Catalog cards with brand, product, price; Staff Picks for curation.

**Recommended pattern:**
- **Hierarchy:** (1) Brand + product name; (2) Short "why" (e.g. similarity score or one-line explanation with optional provenance); (3) Best price or "From $X" and primary CTA (e.g. "See best deal" or "Compare prices"); (4) Optional secondary: strength/body/wrapper pills or specs.
- **Trust:** Show retailer(s) for best deal; optional "N retailers" for comparison.
- **Provenance:** Reserve space for "Based on …" or "From review/editorial" when we use RAG (see design_integration_checklist).

**Component intent:** `RecommendationCard` — image optional, title, explanation snippet, price/deal CTA, optional attributes and provenance.

---

## 3. Comparison table (best deal / multi-retailer)

**Goal:** Compare price (and optionally shipping/freshness) across retailers for one product; clear CTAs.

**Best-in-class references:**
- **CigarFinder:** Per-retailer "Get Deal" / "Get Code"; implied table or card grid of offers.
- **Cigar Price Scout (positioning):** Delivered cost, multiple retailers.

**Recommended pattern:**
- **Columns:** Retailer name | Price (or per-stick) | Optional: shipping note, freshness | CTA (e.g. "Shop" / "Get deal").
- **Sort:** By price (default), then by freshness or trust if we expose it.
- **Trust:** Retailer names visible; no commission badge or "we refer, we don’t sell" line to differentiate.
- **Mobile:** Card stack or accordion per retailer if table doesn’t fit.

**Component intent:** `DealComparisonTable` — headers, sortable rows, affiliate-safe CTA per row. Optional `DealRow` for mobile.

---

## 4. Trust module

**Goal:** Communicate neutrality and data quality without cluttering the main flow.

**Best-in-class references:**
- **CigarFinder:** "Real-time prices from [retailer list]" and "Lowest price guarantee" in hero.
- **Our differentiator:** "We don’t sell cigars" / "We refer you to retailers"; transparent about data sources and freshness.

**Recommended pattern:**
- **Placement:** Footer and/or one short block on home and/or results (e.g. below search or above footer).
- **Content:** (1) "We compare prices from [N] US retailers; we don’t sell cigars." (2) Optional: "Prices updated [frequency]." (3) Optional: "How we recommend" linking to methodology or provenance.
- **No fake urgency:** Avoid "X people viewing" or countdown timers unless we can back them; prefer calm, factual tone per REPORT_DESIGN_GUIDELINES.

**Component intent:** `TrustBlock` — short copy, optional link to methodology; can be composed with footer.

---

## 5. Navigation and layout

- **Nav:** Minimal top nav: Logo, primary search, optional "Deals" or "How it works," Account (when we add it). Avoid deep mega-menus for MVP.
- **Mobile:** Sticky or collapsible header with search; cards stack; comparison becomes cards or accordion.
- **Hierarchy:** Search → Recommendation results (cards) → Cigar detail / deal comparison (table or cards) → outbound to retailer.

---

## 6. Recommendation explanation (provenance)

**Differentiator:** Explain "why" with optional provenance (RAG, editorial, or attribute match).

**Pattern:**
- In **RecommendationCard:** One line or short paragraph (e.g. "Similar strength and wrapper; often paired with …").
- Optional **expand or tooltip:** "Based on: [review snippet], [attribute match], or [similar users]" with clear source labels.
- **Design system:** Must support optional provenance object (see design_integration_checklist).

---

*Pattern library v1. Align with `docs/uiux/competitor_audit.md` and `docs/uiux/design_integration_checklist.md`.*
