# Validation Plan

**In brief:** Test four assumptions before build: (1) users want combined flow, (2) enough people seek “similar” or “best price,” (3) they’ll click through from a third party, (4) we can build large catalog and RAG content without scraping. Methods: 15–20 interviews, data prototype (large catalog + RAG-capable content), concierge test (10–20 users), optional survey and landing page. Success = majority would use it; some click-through; prototype achievable. Product direction: large catalog + ML recommendation engine + significant RAG from launch.

---

## Assumptions to Test First

| Priority | Assumption | Method | Success signal |
|----------|------------|--------|------------------|
| 1 | Users want “similar cigars + best price” in **one** flow (vs. two tools). | Interviews; concierge test | Users say they’d use it; in test, they complete the flow and report satisfaction. |
| 2 | Enough people actively look for “similar to X” or “best price” when buying online. | Interviews; survey; landing page | Meaningful % say they do; landing page signups or waitlist interest. |
| 3 | Users will click through to a retailer from a third-party comparison/rec tool. | Concierge test; simple MVP | Click-through and (if trackable) purchase; no strong objection to “we earn from referral.” |
| 4 | We can get “good enough” large catalog and RAG content without scraping. | Data prototype | Large catalog (affiliate/public/licensed) and RAG-capable content (reviews, tasting notes); sustainable pipeline. |

---

## Interview Plan

**Who:** US online cigar buyers who (a) have bought at least once in the last 12 months and (b) either explore new cigars or compare price (recruit via forum, Reddit, or existing network).

**Sample:** 15–20 deep interviews before building; more if budget allows.

**Key questions:**

- How do you usually decide what cigar to buy next? (Discovery)
- How do you find the best price or deal? (Price)
- Have you used any site or app for “cigars like X” or for comparing prices? Which? (Current tools)
- Would you use a single site that did both: “here are cigars like the one you like, and here’s where each is cheapest”? Why or why not? (Combined value)
- How would you feel if that site earned money when you bought through their links? (Trust / affiliate)
- How often do you buy cigars online? (Frequency / segment)

**Success:** Majority say they’d try the combined flow; few say “I’d never use a third party” or “I only buy one brand from one place.”

---

## Survey Design (Optional, Broader Reach)

**Goal:** Quantify share of online cigar buyers who care about discovery and/or price comparison.

**Channels:** Forums, Reddit r/cigars, email lists (if available), paid if needed.

**Length:** 5–7 minutes max.

**Core questions:**

- How often do you buy cigars online? (Frequency)
- When buying, do you usually know exactly what you want, or do you look for recommendations? (Discovery need)
- Do you compare prices across retailers before buying? (Price sensitivity)
- Have you used a site or app to find “similar” cigars or to compare prices? Which? (Current behavior)
- How interested are you in a single tool that recommends similar cigars and shows the best current price? (Intent)
- Would you be willing to sign up for early access? (Conversion)

**Success:** Meaningful % (e.g., 30%+) report discovery or comparison behavior and interest in combined tool; some sign up.

---

## Landing Page Experiment

**Goal:** Gauge interest and collect emails; test messaging.

**Page elements:** Headline (e.g., “Find cigars you’ll like. See the best price.”); short value prop; one or two messaging variants (A: discovery-first, B: deal-first); email signup; optional “what cigar do you love?” to prime.

**Traffic:** Organic (forum, Reddit) or small paid (Google, Facebook to cigar-related interest).

**Metrics:** Visit-to-signup rate; cost per signup if paid; qualitative from optional question.

**Success:** Signup rate above 2–5%; positive or neutral comments; no strong “I’d never use this.”

---

## Manual Concierge Test

**Goal:** Validate recommendation value and deal-finding value **before** building a full engine.

**Process:**

1. Recruit 10–20 users (forum, network, survey respondents).
2. Ask each: “What’s a cigar you like?” (and optionally strength/preference).
3. **Manual:** You (or a small team) find 3–5 “similar” cigars using public sources (Halfwheel, Cigar Sense logic, retailer filters) and find current best price for each (manual check or CigarFinder/Scout).
4. Send them a simple report: “Similar to X: here are options and where to buy (with links).”
5. Ask: Would you use a product that did this automatically? Would you click through to buy? Did any of these feel wrong or off?

**Success:** Users say they’d use it; some click through; “similar” picks are not widely rejected. Validates **value** of the flow, not the tech.

---

## Validating Recommendation Value Before Full Engine

- **Concierge:** Manual “similar” + price (above).
- **Wizard-of-Oz:** Simple form (“cigar you like” + optional attributes) → human returns recs + links in 24–48 hours; measure satisfaction and click-through.
- **Attribute-only MVP:** Build minimal catalog (100 cigars) with attributes; show “similar” by rules (same wrapper, similar strength); no ML. Test if that’s “good enough” for early users.

**Success:** Users find at least 1–2 of the “similar” options relevant; they understand the logic (e.g., “same wrapper, similar strength”).

---

## Validating Deal-Finding Value

- **Concierge:** Include “best price” in the manual report; ask if they used the link and if the price was accurate.
- **Landing page:** “Get the best price for your favorite cigar” variant; measure signups.
- **Simple MVP:** List 20–50 popular cigars with manually checked prices and retailer links; measure clicks and feedback.

**Success:** Users click through; they report that the price was correct or close; they say they’d use it again.

---

## Success Metrics to Signal “Continue”

| Metric | Threshold (illustrative) | Meaning |
|--------|---------------------------|---------|
| Interview: “Would use combined tool” | Majority yes | Demand for combined flow |
| Survey: discovery or comparison behavior | 30%+ do one or both | Addressable segment exists |
| Landing page signup rate | >2–5% | Messaging and intent |
| Concierge: “Would use this as a product” | Majority yes | Product-market fit signal |
| Concierge: click-through to retailer | Some clicks | Monetization potential |
| Data: catalog + prices for 100+ cigars | Achievable without scraping | Feasibility |

**Go:** Multiple assumptions pass; no major red flag (e.g., “no one would trust this”).  
**No-go:** Most users say they wouldn’t use it, or we can’t get data legally/sustainably.  
**Pivot:** e.g., Deal-only or recommendation-only if “combined” doesn’t resonate.

---

## Order of Operations

1. **Interviews** (15–20) — Validate problem and combined flow.
2. **Data prototype** — Assemble large catalog (affiliate/public/licensed) + attributes + RAG-capable content (reviews, tasting notes) + prices where possible.
3. **Concierge test** (10–20 users) — Manual rec + deal delivery; measure satisfaction and clicks.
4. **Landing page** — Messaging and signups; optional survey.
5. **Decide** — Proceed to MVP, pivot to deal-only or rec-only, or stop.

No major engineering until (1)–(3) support the hypothesis.
