# Data Acquisition Strategy

**In brief:** We start with a **large catalog** (thousands of SKUs) from affiliate feeds, licensed or public sources, and enrichment. Pricing from affiliate feeds or manual. Recommendation is **ML-based**, powered by a **significant RAG** system: the knowledge base must include reviews, tasting notes, expert content, and attribute/substitute data so retrieval can ground the model. Do not rely on scraping. Scale: more sources, better RAG coverage, AI normalization with human review.

---

## Data Requirements

| Data type | Purpose | Structured? | Update frequency |
|-----------|---------|-------------|-------------------|
| Cigar catalog | Products we can recommend and compare | Partial (varies by source) | Ongoing (new SKUs; discontinuations) |
| Cigar attributes | Strength, body, wrapper, origin, size, flavor notes | Often unstructured or inconsistent | With catalog |
| Pricing | Comparison and “best deal” | Numeric + currency | Daily or real-time ideal |
| Inventory / availability | “In stock” and where | Boolean / quantity | High frequency ideal |
| Retailer links | Affiliate or direct URLs | Structured | With catalog and retailer set |
| Reviews / descriptors | “Similar to” and search | Unstructured | Periodic |
| Substitute mappings | “If you like X, try Y” | Curated or derived | Ongoing |

---

## Sources (Where Data Might Come From)

### Cigar catalog and attributes

| Source | What it provides | Structure | Legal / sustainable? | Best for |
|--------|------------------|-----------|----------------------|----------|
| Retailer sites | Product names, SKUs, sometimes strength/wrapper/size | Mixed; often HTML | Scraping often against ToS | **Not recommended** as primary. Use affiliate/feeds if offered. |
| Cigar Sense | Rich attributes; tasting-based | Proprietary | Likely licensing if any; not public dump | Reference taxonomy; possible partnership. |
| Halfwheel / Cigar Aficionado | Reviews; brand/vitola info | Articles; some structure | Public content; repurpose with attribution and license care | Flavor/quality signals; manual or licensed. |
| Cigar AI / Stogie Match | Attributes; matching | App/API | Unknown; would need partnership | Not assumed. |
| Industry / manufacturer | Official specs | Often PDF or spreadsheets | Licensing | Ideal if available; not assumed for MVP. |
| Manual curation | Enrichment / gaps | Spreadsheet / DB | Yes | Fill gaps; quality checks on top of large catalog. |
| User-generated (later) | Reviews; “similar” votes | Unstructured | Yes if compliant | Post-MVP. |

### Pricing and availability

| Source | What it provides | Legal / sustainable? | Best for |
|--------|------------------|----------------------|----------|
| Affiliate network feeds (CJ, etc.) | Product, price, link (per retailer) | Yes, per program terms | **Primary** if available. |
| Retailer affiliate API / feed | Same | Yes | **Primary** where offered. |
| Scraping | Live price and stock | Often against ToS; brittle; legal risk | **Not recommended.** |
| Manual checks (MVP) | Snapshot prices for curated set | Yes | **MVP** for small catalog. |
| Third-party aggregator | Already-aggregated prices | Depends on their ToS and our use | Verify before reliance. |

### “Similar” / recommendation data

| Source | What it provides | How |
|--------|------------------|-----|
| Expert taxonomy (e.g., Cigar Sense) | Attribute space for matching | License or replicate attribute set for our catalog. |
| Review text (Halfwheel, etc.) | Flavor notes; strength mentions | NLP to extract; use for similarity or tags. |
| Rule-based | Wrapper, strength, body, origin, size | Build from catalog attributes. |
| Collaborative (later) | “Users who liked X liked Y” | Need usage data; post-MVP. |
| AI normalization | Map messy retailer copy to taxonomy | LLM or classifiers to normalize descriptions. |

---

## Methods: Feasibility and Risk

| Method | Speed for MVP | Scale | Risk | When to use |
|--------|----------------|-------|------|-------------|
| Manual curation | Slow but doable | Low (100s) | Low | MVP catalog and sample prices. |
| Affiliate feeds | Fast if we have approval | High | Low | First choice for price/link. |
| Partnership / license | Slow | High | Low | When we have traction and budget. |
| Public content (reviews, lists) | Medium | Medium | Attribution/license | Taxonomy and “similar” signals. |
| Scraping | Fast technically | High | **High** (ToS, blocks, legal) | **Avoid.** |
| AI to normalize descriptions | Medium (build once) | High | Medium (quality, hallucination) | When we have messy retailer or UGC text. |

---

## Large Catalog and RAG from the Start

1. **Catalog:** Build a **large catalog** (thousands of SKUs) from affiliate product feeds where available, licensed or public data (with attribution), and manual enrichment for gaps. Attributes: brand, line, vitola, wrapper, strength, body, origin, size; extend with flavor notes and descriptors where we have content. No scraping in violation of ToS.
2. **RAG knowledge base (critical for ML):** The recommendation engine is ML-based and must be backed by **significant RAG**. Ingest and index: expert and editorial reviews (e.g., Halfwheel, Cigar Aficionado, licensed content), tasting notes, attribute and “similar to” data, and any structured substitute mappings. Retrieval (e.g., vector search + ranking) supplies the model with relevant passages so recommendations are grounded in real cigar knowledge. Without a substantial RAG layer, ML recommendations will not be effective or differentiated.
3. **Pricing:** Use affiliate product feeds for price and links where possible; supplement with manual checks for coverage. No scraping.
4. **Similarity:** ML recommendation engine consumes user input and RAG-retrieved context to produce “similar” candidates; not rule-only.
5. **Retailer links:** Affiliate links only; track which retailers we have approval for and stay within state rules.

---

## What Scales

- **Catalog:** Continue to add SKUs via affiliate feeds, partners, license; user-contributed with moderation later.
- **RAG:** Add more review sources, tasting notes, and expert content; improve retrieval quality and coverage.
- **Pricing:** Affiliate/API feeds; avoid scraping.
- **Attributes:** AI normalization of retailer and review text into our taxonomy; quality checks required.
- **Similarity:** RAG depth and ML tuning; collaborative signals when we have clicks/purchases.

---

## What Creates Risk

- **Scraping** without permission: ToS violation, IP blocks, legal exposure. **Do not rely on it.**
- **Using others’ data** without license or attribution: Legal and reputational risk. Prefer license or public use with attribution.
- **Incorrect or stale prices:** User trust and affiliate compliance. Prefer official feeds; if manual, state “price may vary” and link through.
- **AI hallucination** in attributes or “similar”: Bad recommendations. RAG grounds the model in real content; use human review and fallbacks where possible; monitor retrieval quality.

---

## Where AI Can Help

- **Normalizing product names** across retailers (e.g., “Fuente Hemingway Short Story” vs. “Arturo Fuente Hemingway Short Story”).
- **Extracting attributes** from review text or retailer descriptions (strength, body, flavor notes).
- **Mapping “similar”** from unstructured descriptions when we lack a clean taxonomy.
- **Deduplication** of SKUs across sources.

RAG supplies the model with retrieved context so recommendation output is grounded; human review and monitoring of retrieval quality remain important.

---

## RAG Data Requirements (for ML Recommendation)

The ML recommendation engine depends on **significant RAG**. The knowledge base should include:

| Content type | Purpose | Sources (examples) |
|--------------|---------|---------------------|
| Expert / editorial reviews | Flavor, strength, body, construction; “similar to” signals | Halfwheel, Cigar Aficionado, licensed or attributed content |
| Tasting notes | Rich descriptors for retrieval and grounding | Review sites, Cigar Sense–style data if licensed, curated notes |
| Attribute and substitute data | Structured “if you like X, try Y” and taxonomy | Catalog attributes; expert mappings; community data (with care) |
| Brand and vitola context | Disambiguation and relevance | Public or licensed reference content |

Retrieval (e.g., vector search over embedded passages) must return **relevant** context for the user’s cigar and intent so the model’s “similar” output is grounded. Scaling RAG = more and better content, not just more catalog SKUs.

---

## Summary Table

| Data need | Approach | Scale | Risk to avoid |
|-----------|----------|-------|---------------|
| Catalog | **Large from start:** affiliate feeds, license, public + enrichment | Add sources; UGC later | Scraping; unlicensed use |
| RAG corpus | Reviews, tasting notes, expert content, attribute/substitute data | More sources; better coverage | Wrong or misleading content; poor retrieval |
| Attributes | Taxonomy + AI normalization from content | Licensed taxonomy; quality checks | Publishing wrong attributes |
| Pricing | Affiliate feeds + manual for coverage | Affiliate/API feeds | Scraping; stale prices without disclosure |
| Similarity | **ML + RAG** (retrieval grounds model) | Deeper RAG; collaborative signals | Overclaiming “similar” without basis |
| Retailer links | Affiliate only | Same; track state rules | Violating affiliate or state terms |
