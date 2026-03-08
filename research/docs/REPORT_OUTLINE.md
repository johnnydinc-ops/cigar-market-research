# Report Outline

Information architecture for rendering the research as a polished web-based strategy report. Use this to drive the report viewer and any future export (PDF, slide deck).

---

## 1. Title / Overview

- Report title: *US Cigar Buyer Platform: Market Research & Strategy Brief*
- Subtitle: Recommendation + Deal-Finding Opportunity Assessment
- Date, version, “Confidential” or internal use
- One-sentence summary of the idea and recommendation

---

## 2. Table of Contents / Navigation

Sidebar or anchor links to:

- Executive Summary
- Problem Statement
- Product Hypotheses
- Customer Segments
- Competitive Landscape
- Competitor Matrix (table)
- Retailer Landscape
- Data Acquisition Strategy
- Market Analysis
- Monetization
- User Value Proposition
- Innovation Assessment
- Risks
- Validation Plan
- MVP Recommendation
- Go / No-Go

---

## 3. Executive Summary Block

- Rendered from `EXECUTIVE_SUMMARY.md`
- Key callouts: Idea, Market need, Opportunity (real/weak), Target customer, Top risks, Recommendation (proceed narrowly / stop / pivot)
- Optional: “Key Takeaways” box (3–5 bullets)

---

## 4. Problem Statement

- Rendered from `PROBLEM_STATEMENT.md`
- Emphasize: who has the problem, how they solve it today, frictions, which part is painful enough to matter
- Optional: simple journey diagram (current state)

---

## 5. Product Hypotheses

- Rendered from `PRODUCT_HYPOTHESES.md`
- Tables: strongest hypotheses, weakest assumptions, what must be true, invalidating behaviors
- Callout: “What must be true for this to work”

---

## 6. Customer Segments

- Rendered from `CUSTOMER_SEGMENTS.md`
- Segment overview table
- Summary cards or table: segment → discovery need → price sensitivity → trust → monetization fit
- Callout: “Primary target: enthusiasts and bargain hunters”

---

## 7. Competitive Landscape

- Rendered from `COMPETITIVE_LANDSCAPE.md`
- Landscape map (recommendation vs. deal axis)
- Category summaries: Recommendation, Price comparison, Subscription, Community
- Callout: “Gap: combined rec + deal in one flow”

---

## 8. Competitor Matrix

- Rendered from `data/competitor_matrix.csv`
- Sortable/filterable table or static table
- Columns: company_name, category, target_user, offers_recommendations, offers_price_comparison, offers_subscription, monetization_model, strengths, weaknesses, likely_gap_we_could_fill

---

## 9. Retailer Landscape

- Rendered from `RETAILER_LANDSCAPE.md`
- Major retailers table: role, breadth, pricing, affiliate, MVP suitability
- Callout: “Tier 1 retailers for MVP” and “No scraping; prefer affiliate/feeds”

---

## 10. Data Acquisition Strategy

- Rendered from `DATA_ACQUISITION_STRATEGY.md`
- Tables: data requirements, sources, methods (feasibility/risk), MVP vs. scale
- Callout: “MVP: manual curation + affiliate; no scraping”

---

## 11. Market Analysis

- Rendered from `MARKET_ANALYSIS.md`
- Market size facts (table)
- Conclusions: discovery vs. habit, repeat use unknown, business type (referral/affiliate)

---

## 12. Monetization

- Rendered from `MONETIZATION.md`
- Option overview table
- Callout: “First: affiliate; later: optional subscription/sponsorship”
- Conflicts of interest and mitigations

---

## 13. User Value Proposition

- Rendered from `USER_VALUE_PROP.md`
- What we solve, what we reduce, who feels it most, where value comes from

---

## 14. Innovation Assessment

- Rendered from `INNOVATION.md`
- Is it innovative? Wedge, moat, easily copied, proprietary potential
- Callout: “Incremental innovation; wedge = combined flow + trust”

---

## 15. Risks

- Rendered from `RISKS.md`
- Risk register table: risk, description, mitigation
- Callout: “Top 5 risks”

---

## 16. Validation Plan

- Rendered from `VALIDATION_PLAN.md`
- Assumptions to test, interview plan, survey, landing page, concierge test
- Success metrics and “continue” thresholds

---

## 17. MVP Recommendation

- Rendered from `MVP_RECOMMENDATION.md`
- Wedge, in-scope, out-of-scope, what MVP must prove
- Checklist of MVP deliverables

---

## 18. Go / No-Go

- Rendered from `GO_NO_GO.md`
- Final recommendation box: Worth pursuing? Conditions? Most credible version? Evidence? What would make it no? Next step?
- Prominent “Next step” callout

---

## 19. Appendix / References

- List of sources (industry reports, competitor sites, affiliate program pages)
- Links to `notes/OPEN_QUESTIONS.md` and `notes/ASSUMPTIONS.md` for live tracking

---

## Document → Section Mapping

| Document | Report section |
|----------|----------------|
| EXECUTIVE_SUMMARY.md | §1 (overview), §3 (executive summary) |
| PROBLEM_STATEMENT.md | §4 |
| PRODUCT_HYPOTHESES.md | §5 |
| CUSTOMER_SEGMENTS.md | §6 |
| COMPETITIVE_LANDSCAPE.md | §7 |
| data/competitor_matrix.csv | §8 |
| RETAILER_LANDSCAPE.md | §9 |
| DATA_ACQUISITION_STRATEGY.md | §10 |
| MARKET_ANALYSIS.md | §11 |
| MONETIZATION.md | §12 |
| USER_VALUE_PROP.md | §13 |
| INNOVATION.md | §14 |
| RISKS.md | §15 |
| VALIDATION_PLAN.md | §16 |
| MVP_RECOMMENDATION.md | §17 |
| GO_NO_GO.md | §18 |
| notes/* | §19 (appendix) |
