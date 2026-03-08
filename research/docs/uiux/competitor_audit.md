# Competitor UX Audit (Stage 5)

**In brief:** Observational audit of key competitors (layout, navigation, search, results, trust, and CTAs). Sources: live browser snapshots and screenshots. Audit is UX/structure only—no functional testing.

**Competitor set:** CigarFinder (price + AI rec), Holt's (retailer + cigar finder), Halfwheel (reviews/content). Supplementary references: Cigar Sense, Cigar AI, Stogie Match, Cigar Price Scout, Cigarsy (from `data/competitor_matrix.csv` + `docs/COMPETITIVE_LANDSCAPE.md`).

---

## 1. CigarFinder (cigarfinder.com)

**Role:** Price comparison + AI recommendation; 17+ retailers, 58k+ products.

### Home

- **Primary CTA:** Hero emphasizes "Compare Cigar Prices & Find the Best Deals Online" with three buttons: "Lowest price guarantee," "Daily cigar coupons & promo codes," "AI Cigar Advisor – Try it Now."
- **Trust copy:** "Real-time prices from Cigars International, JR Cigar, Famous Smoke, Thompson Cigar, Best Cigar Prices, CigarPage & 9 more trusted retailers."
- **Nav:** Cigars, Brands, Coupons/Deals, Machine Made Cigars, Accessories, Tobacco, Samplers; footer repeats + Help & Contact, Blog, News, About.
- **Search:** Prominent header textbox "Search products here" (full-width with magnifying glass); secondary "Search brands..." in Browse-by-Brand section.
- **Deals:** "Today's Best Deals" with repeated "Get Deal" / "Get Code" buttons per retailer; coupon grid.
- **Floating CTA:** "Ask CigarFinder AI" (chat-style) bottom-left.
- **Content:** "How It Works" (Search and compare → Buy It → Enjoy It); "Browse by Brand" A–Z (76 brands); blog "Cigar Life" and "Cigar Industry News"; retailer logos in hero background.

### Search / results

- **URL pattern:** `/cigars?search=Padron%201964`. Same header (logo, nav, search). Results area in main content; product grid/cards likely loaded client-side (snapshot showed breadcrumb "Cigars" and minimal interactive refs).

### Detail / price comparison

- Not captured in this audit; from positioning, product pages likely show multi-retailer prices and "Shop" / "Get Deal" per retailer.

### Trust signals

- Explicit retailer list and "trusted retailers" in hero.
- "Lowest price guarantee" as primary CTA.
- Account features (Virtual Humidor, Cigar Journal, Wishlist) mentioned in hero subcopy.

### Mobile

- Header includes hamburger; nav and search remain primary. Layout suggests responsive treatment.

---

## 2. Holt's Cigar Company (holts.com)

**Role:** Single-retailer; integrated "Advanced Cigar Finder" (filter/search).

### Home

- **Primary CTA (discovery):** "ADVANCED CIGAR FINDER" link in header—clear entry for attribute-based discovery.
- **Search:** "Search site:" textbox, placeholder "Search Our Inventory"; Search button.
- **Account:** Sign In, Register, My Account; Customer Service, Holt's Blog.
- **Nav:** Cigars, All Cigar Brands, New Arrivals, Staff Picks, Bundle Heaven, Flavored Cigars, Machine Made Cigars, Top Brands (with brand sublinks: Ashton, Arturo Fuente, Oliva, Padrón, etc.), price bands (Under $2, $2–$4, etc.).
- **Email:** "Sign Up For Email Specials" in header.

### Finder / results

- Advanced Cigar Finder is a distinct entry point (filter by attributes); single-retailer results and buy flow.

### Trust signals

- Brand as retailer (Holt's); Staff Picks; no multi-retailer comparison.

### Mobile

- Snapshot suggests dense nav; likely collapsible menu on small screens.

---

## 3. Halfwheel (halfwheel.com)

**Role:** Editorial/reviews; no e‑commerce or price comparison.

### Home

- **Content-first:** Article cards with headline, byline (author), date, "Read More."
- **Nav:** Toggle navigation (mobile); links to articles and sections.
- **No product search:** Discovery is via editorial (reviews, news, lists).

### Trust signals

- Editorial authority (byline, date); "industry's cigar blog" positioning. No transactional or price trust UI.

### Mobile

- Toggle navigation indicates mobile-aware layout.

---

## 4. Cross-cutting summary

| Aspect | CigarFinder | Holt's | Halfwheel |
|--------|-------------|--------|-----------|
| **Primary CTA** | Compare prices / AI Advisor / Coupons | Advanced Cigar Finder, Shop | Read articles |
| **Search entry** | Prominent "Search products here" + brand search | "Search Our Inventory" + Finder | N/A (editorial) |
| **Result type** | Multi-retailer product grid | Single-retailer catalog | Article list |
| **Trust** | Retailer list, price guarantee, account tools | Brand, Staff Picks | Byline, editorial |
| **Deal/price** | Central (deals, coupons, comparison) | Price bands in nav | None |
| **Recommendation** | AI Cigar Advisor (floating + hero) | Finder (filter-based) | Editorial lists |

---

## 5. Implications for our product

- **Search entry:** One clear, prominent search (product/cigar) like CigarFinder; optional "similar to" or "recommend" as primary flow alongside search.
- **Primary CTA:** "Find similar" or "Recommend" + "Best price" in one flow; avoid burying recommendation.
- **Trust:** Name retailers explicitly; consider "we don’t sell" / "we refer" and price-freshness or guarantee language.
- **Deal/price:** Comparison table or ranked deal cards with per-retailer CTAs (Get Deal / Shop).
- **Explanation:** Surfaces for "why recommended" (provenance, RAG) that competitors (including CigarFinder’s AI) do not clearly expose—differentiator for design system and copy.

---

*Audit date: March 2026. Method: browser snapshots (accessibility tree) and screenshots. No login or checkout flows.*
