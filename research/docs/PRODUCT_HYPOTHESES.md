# Product Hypotheses

**In brief:** Strongest bets: combined “similar + best price” saves time (inference); third-party tools are accepted (partial); affiliate can fund a lean business (partial). Weakest: users may prefer two tools; data may not be obtainable sustainably. What must be true: demand, differentiation, supply, monetization, trust.

---

## Strongest Product Hypotheses

| Hypothesis | Rationale | Evidence level |
|------------|-----------|----------------|
| **H1:** A single flow that does “similar cigars to X” + “best current price for each” would save time and reduce friction for a meaningful subset of US online cigar buyers. | Recommendation and price comparison are today separate; combining them could reduce tabs and cognitive load. | **Inference.** No direct user data yet; supported by existence of both recommendation and comparison tools. |
| **H2:** Enough buyers are willing to use a third-party (non-retailer) tool for recommendation and/or price comparison to support traffic and affiliate revenue. | CigarFinder, Cigar Price Scout, Cigar Sense, Cigar AI exist and operate. | **Partial.** Tools exist; scale of usage and retention not verified. |
| **H3:** Affiliate economics can support a lean business if we drive qualified traffic and convert to purchase. | Commission rates 5–15%, AOV $100+; comparison sites rely on this model. | **Partial.** Rates and AOV from public affiliate info; our conversion and volume unvalidated. |
| **H4:** “If you like X, try Y” is more compelling when Y is linked to real inventory and price, not just advice. | Reduces drop-off between recommendation and purchase. | **Inference.** Plausible; not tested. |

---

## Weakest Assumptions

| Assumption | Why it’s weak | How to test |
|------------|----------------|-------------|
| **A1:** Users want recommendation and deal-finding in the *same* product (vs. using two separate tools). | They may be fine with Cigar Sense + CigarFinder in two tabs. | Interviews; concierge test with combined flow. |
| **A2:** A new entrant can win trust vs. incumbents (Cigar Sense for recs, CigarFinder for price). | Trust and habit take time; incumbents have SEO and community. | Landing page + positioning tests; see if users articulate “one place” as a need. |
| **A3:** Users will accept affiliate-funded comparison as “unbiased enough.” | Perceived bias could limit adoption. | Survey and usability; disclosure and positioning tests. |
| **A4:** Cigar catalog and pricing data can be assembled and maintained at acceptable cost. | Data is fragmented; scraping is brittle and often against ToS. | See DATA_ACQUISITION_STRATEGY; prototype with limited catalog. |

---

## What Must Be True for This Business to Work

1. **Demand:** A meaningful number of US online cigar buyers actively seek either (a) “similar to X” recommendations, (b) best price for a known cigar, or (c) both—and do so repeatedly enough to justify a product.
2. **Differentiation:** We can offer a combined experience (recommendation + deal) that is better or more trusted than using existing tools separately, or we can own a clear wedge (e.g., “best deal finder” or “best recommendation engine” only).
3. **Supply:** We can get cigar catalog, attributes, and pricing data in a legal, sustainable way (affiliate, feeds, partnerships, or limited curation).
4. **Monetization:** Affiliate (and optionally subscription or advertising) revenue can cover cost to acquire and serve users, with a path to profitability or attractive unit economics.
5. **Trust:** Users trust our recommendations and/or price comparison enough to click through and buy; we can maintain that trust while being affiliate-funded.

---

## What Users Must Care About Enough to Return

- **Utility:** The tool actually finds better prices or better “similar” options than they can get elsewhere with similar effort.
- **Reliability:** Results are up to date (in stock, correct price) and not gamed.
- **Simplicity:** Less effort than opening multiple sites and comparing manually.
- **Trust:** Belief that we’re not steering them to the highest commission instead of the best fit or best price.

If “return” is low (e.g., one-off use per purchase), the business depends on high volume of new users or strong SEO; that’s viable but different from a sticky product.

---

## What Must Be True About Retailer Fragmentation, Pricing, and Discovery

- **Fragmentation:** Retailers do not all have the same price or inventory; there is enough variance to make comparison valuable. *Evidence: comparison sites exist and list multiple retailers.*
- **Pricing transparency:** Prices (or at least relative prices) are discoverable without violating ToS or law. *Evidence: Cigar Price Scout, CigarFinder operate; method not fully public.*
- **Discovery friction:** Enough buyers don’t already have a single go-to source for “what to try” and “where to buy” that they’re willing to try a new tool. *Unvalidated.*

---

## User Behaviors That Would Invalidate the Idea

- **Loyalty dominates:** Most buyers only buy one brand from one retailer and never search for “similar” or “cheapest.”
- **Trust doesn’t transfer:** Users refuse to use a new third party for recommendation or price, and stick to retailer sites or forums.
- **Fragmentation is preferred:** Users like using separate tools and don’t want a combined experience.
- **Data is impossible:** We cannot get or maintain catalog and pricing data at sustainable cost or within legal/ToS bounds.
- **Economics don’t work:** Affiliate conversion or commission is too low to support the business even with traction.

---

## Summary Table

| Hypothesis / assumption | Strength | Action |
|-------------------------|----------|--------|
| Combined rec + deal has value | Inference | Validate with interviews and concierge test |
| Third-party tools are accepted | Partial | Validate with usage of existing tools and intent |
| Affiliate can fund the business | Partial | Model with conservative conversion and commission |
| Data is obtainable | Unvalidated | Prototype data pipeline; prefer affiliate/partnership |
| Users will return | Unvalidated | Measure retention in MVP; consider SEO-driven one-off use |
