# Assumptions

Explicit assumptions used in the research. Marked as **validated**, **partial**, or **unvalidated**. Update as evidence is gathered.

---

## Market & User

| Assumption | Status | Rationale |
|------------|--------|-----------|
| US online cigar buyers are a meaningful subset of the total US cigar market. | Partial | Industry reports show online segment growing; exact % of buyers who buy online not confirmed. |
| A meaningful number of buyers care about both "what to try next" and "where to get it cheapest." | Unvalidated | Core product hypothesis; needs user research. |
| Buyers will use a third-party tool (vs. only retailer sites or forums) for recommendation and/or price comparison. | Unvalidated | CigarFinder, Cigar Price Scout, Cigarsy exist; usage scale and stickiness unknown. |
| Gift buyers and occasional buyers are secondary to enthusiasts for early product focus. | Unvalidated | Enthusiasts likely have stronger discovery/price sensitivity; needs segment validation. |

---

## Competition

| Assumption | Status | Rationale |
|------------|--------|-----------|
| No single product dominates "recommendation + best deal" in one trusted, seamless experience. | Partial | CigarFinder combines comparison + AI; Cigar Sense does recommendation; combined depth and UX to be verified. |
| Recommendation engines (Cigar Sense, Cigar AI, Stogie Match) do not fully own "similar cigars" + purchase. | Partial | They focus on matching; purchase often elsewhere; integration with deal-finding unclear. |
| Price-comparison sites are accepted by retailers (affiliate) rather than blocked. | Partial | Affiliate programs exist; some retailers may not want to be in comparison; to verify. |

---

## Data & Feasibility

| Assumption | Status | Rationale |
|------------|--------|-----------|
| Cigar catalog and attribute data can be assembled from public/review/retailer sources without illegal scraping. | Unvalidated | Multiple sources exist; licensing and ToS need review. |
| Pricing can be obtained via affiliate feeds, partnerships, or limited manual curation for MVP. | Unvalidated | Depends on retailer policies; scraping is brittle and often against ToS. |
| A "good enough" taxonomy (strength, body, wrapper, origin) exists or can be built for US-market cigars. | Partial | Cigar Sense and others use such taxonomies; coverage for full catalog TBD. |

---

## Monetization

| Assumption | Status | Rationale |
|------------|--------|-----------|
| Affiliate revenue can support a lean operation and possibly growth if traffic and conversion are sufficient. | Partial | Commission rates 5–15% known; AOV ~$100+; volume and conversion assumptions unvalidated. |
| Users will tolerate affiliate links if the tool is clearly useful and not biased. | Unvalidated | Trust is key; design and disclosure matter. |
| Subscription or premium features could be added later without undermining trust in free comparison. | Unvalidated | Common pattern elsewhere; cigar-buyer willingness unknown. |

---

## Scope

| Assumption | Status | Rationale |
|------------|--------|-----------|
| US-only is the right initial scope (regulation, retailers, shipping). | Validated | PACT Act and state rules are US-specific; non-US adds complexity. |
| We are not building a retailer; we are discovery/comparison/affiliate. | Validated | Per product concept. |
| Tobacco compliance (age verification, etc.) is the retailer’s responsibility when user clicks through. | To verify | Platform may need to avoid facilitating underage access; legal review recommended. |

## Product direction (founder input)

| Assumption | Status | Rationale |
|------------|--------|-----------|
| We start with a **large catalog** from day one (not a small curated MVP list). | Adopted | Recommendation and comparison need a meaningful set of options; a small list feels like a demo. |
| The recommendation engine is **ML-based** (not rule-only). | Adopted | Rule-based “similar” (e.g., same wrapper + strength) is shallow; ML can use attributes, behavior, and retrieved content. |
| A **significant RAG** (retrieval-augmented generation) system is required to make the ML recommendations effective. | Adopted | Without RAG, the model lacks grounding in real cigar knowledge (reviews, tasting notes, expert content). RAG supplies retrieved context so “similar” is defensible and differentiated. |

---

*Assumptions marked unvalidated or partial should be prioritized in VALIDATION_PLAN.*
