# MVP Recommendation

**In brief:** Wedge: combined “similar + best price” in one flow. We **start with a large catalog** from day one and use an **ML-based recommendation engine** powered by a **significant RAG (retrieval-augmented generation)** system so that “similar” is grounded in real cigar knowledge (reviews, tasting notes, attributes). MVP: one input (cigar) → 3–5 similar + best price for each → affiliate links; large catalog, 5–10 retailers, ML + RAG; no accounts, subscription, or sponsored results in v1. Must prove: completion, relevance of “similar,” click-through, and sustainable data.

---

## Recommended Wedge: “Similar + Best Price” in One Flow

**Rationale:** The gap in the market is **combined** recommendation and deal-finding, not one or the other alone. Our wedge is **one entry point** (“I like this cigar”) → **similar options** → **best current price for each** → **purchase via affiliate link**. Differentiate on **clarity and trust** (we don’t game by commission).

**Alternative wedges we could pursue instead:**

| Wedge | Pros | Cons |
|-------|------|------|
| **Deal-finding only** | Simpler; CigarFinder/Scout already exist. | Hard to differentiate; we’re “another comparison site.” |
| **Recommendation only** | Cigar Sense, Cigar AI exist but don’t own purchase. | No direct monetization unless subscription; user goes elsewhere to buy. |
| **Content + discovery** | SEO; media model. | Slower to revenue; requires content scale. |
| **Affiliate marketplace** | Broad. | Vague; doesn’t specify why we’re different. |
| **Dynamic subscription** | Novel. | Unvalidated; fulfillment and ops complex. |

**Recommendation:** Start with **combined “similar + best price.”** If validation shows users only care about price, we can narrow to deal-first; if they only care about rec, we can emphasize recommendation and add subscription later.

---

## Why Large Catalog and ML + RAG from the Start

- **Large catalog:** Recommendation and comparison are only compelling if users can find their cigar and see a meaningful set of alternatives. A small curated list feels limited and undermines “discovery.” We need a **large catalog from launch** (thousands of SKUs where feasible) so the product doesn’t feel like a demo.
- **ML recommendation engine:** Rule-based similarity (e.g., same wrapper + strength) is brittle and shallow. Users care about flavor profile, body, construction, and subjective “like X” fit. An **ML-based recommendation engine** can learn from attributes, behavior, and—critically—from the content we retrieve (see RAG below).
- **Significant RAG to make it effective:** ML alone on thin attributes will underperform. A **significant RAG (retrieval-augmented generation)** system is required: we maintain a knowledge base of cigar-related content (expert and editorial reviews, tasting notes, attribute and substitute data), retrieve relevant passages for the user’s input cigar and intent, and use that context so the model’s recommendations are **grounded in real cigar knowledge** rather than generic patterns. Without a substantial RAG layer, the recommendation engine will not be effective or differentiated.

---

## Sensible MVP (Large Catalog + ML + RAG)

**Core flow:**

1. User enters **one cigar** they like (typeahead or search from the **large catalog**).
2. System returns **3–5 “similar” cigars** using the **ML recommendation engine** fed by **RAG** (retrieval over reviews, tasting notes, attributes).
3. For each (including the original), show **best current price** and **retailer link(s)** (affiliate where we have approval).
4. User clicks through to retailer to purchase.

**In scope:**

- **Large catalog** from launch: thousands of SKUs (brand, line, vitola, wrapper, strength, body, origin, plus any structured attributes we can attach). Built from affiliate feeds, licensed or public sources, and manual enrichment where needed; no scraping in violation of ToS.
- **ML-based recommendation engine** that consumes user input and retrieved context to produce “similar” candidates.
- **Significant RAG:** A knowledge base of cigar content (reviews, tasting notes, expert write-ups, attribute and “similar to” data) with retrieval (e.g., vector search + ranking) so that the model is augmented with relevant passages. RAG is what makes the ML recommendations effective and defensible.
- Pricing: **Affiliate feed** or manual for the catalog; 5–10 retailers to start (Famous, CI, JR, Thompson, Holt’s if approved).
- One primary page: “Find similar cigars and the best price.”
- Affiliate disclosure; “price may vary” disclaimer; link through (we don’t sell).

**Out of scope for v1:**

- User accounts, saved preferences, history (later).
- Subscription or paid tier (later).
- Mobile app (responsive web only for v1).
- Dynamic subscription or we-ship fulfillment (later).
- Sponsored placements or brand ads (later).

---

## What the MVP Must Prove

| Question | How we measure |
|----------|-----------------|
| Do users complete the flow (enter cigar → view similar + price → click through)? | Funnel: search → results view → click-out. |
| Do they find the “similar” options relevant? | Qualitative feedback; optional rating. |
| Do they trust the price and the link? | Click-through rate; return visits if we can track. |
| Can we acquire users at acceptable cost? | Traffic source; cost per visit and per click-out (if paid). |
| Do affiliate conversions happen? | Retailer/network reporting (sales from our links). |
| Can we maintain large catalog, RAG corpus, and prices? | Operational: pipeline for catalog and content; RAG quality and coverage; price freshness. |

**Go forward if:** Meaningful click-through and at least some attributed purchases; users report the flow is useful and “similar” feels right; we can maintain catalog, RAG, and data without scraping.  
**Pivot or stop if:** No click-through or purchases; users say “similar” is wrong or “I’d never use this”; we cannot sustain a large catalog or RAG.

---

## Start As: Recommendation + Deal Comparison (Combined)

Not “recommendation tool only” or “deal comparison only” for MVP—**combined**. That’s the differentiator. If post-MVP we learn that one side dominates (e.g., users only care about price), we can simplify to deal-first and treat rec as secondary, or vice versa.

---

## What to Leave Out (Summary)

- User accounts and personalization in v1 (later).
- Subscription (later).
- Sponsored results (later).
- Scraping (never).
- Any feature that doesn’t directly support “similar + best price” and click-through.

---

## MVP Deliverables (Checklist)

- [ ] **Large catalog** (thousands of SKUs where feasible) with attributes; sourced from affiliate, license, or permitted public data.
- [ ] **RAG knowledge base:** Ingest and index reviews, tasting notes, expert content, attribute/substitute data for retrieval.
- [ ] **ML recommendation engine** that uses RAG-retrieved context to produce “similar” cigars.
- [ ] Price + retailer links for 5–10 retailers (affiliate or feed).
- [ ] Single flow: input cigar → similar (ML + RAG) + prices → affiliate links.
- [ ] Affiliate disclosure; “price may vary.”
- [ ] Responsive web; no app in v1.
- [ ] Analytics: search, results view, click-out; affiliate conversion if available.
- [ ] Light feedback mechanism (e.g., “Was this helpful?” or “Similar?”).

---

## Next Step After MVP

- If **combined** works: deepen RAG coverage and catalog; tune ML; add more retailers; test retention and return visits.
- If **deal** dominates: emphasize “best price” and consider deal alerts or membership later.
- If **recommendation** dominates: invest further in RAG and ML; consider subscription for “pro” recs or dynamic picks.
- If **neither** works: reassess; consider niche (e.g., premium only) or stop.
