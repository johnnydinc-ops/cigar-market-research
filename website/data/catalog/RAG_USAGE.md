# Using Scraped Data as RAG for AI Cigar Recommendations

This doc explains how to use the scraped catalog (`all-scraped.json` or `neptune-scraped.json`) as a **RAG (retrieval-augmented generation)** corpus for AI-powered cigar recommendations.

---

## What You Have After a Scrape

| Data | Purpose for RAG |
|------|------------------|
| **Cigars** | Catalog to recommend from; each has `id`, `brand`, `line`, `description`, `specification`, `ratingAverage`, `ratingCount`. |
| **Documents** | **RAG corpus.** Each document has `id`, `type` (`attribute` or `review`), `content`, `cigarRefs` (which cigar(s) it describes), `citationUrl`, `attribution`. |
| **Pricing** | Not for RAG directly; use when showing “best deal” after a recommendation. |
| **Links** | Retailer URLs for “buy here” after a recommendation. |

**Document types:**
- **`attribute`** — Product description + specification (one per product when detail was scraped). Use to answer “what is this cigar?” and to ground “similar because …” in real copy.
- **`review`** — Customer reviews. Use to ground “people say …” and flavor/similarity in real opinions.

---

## RAG Flow for AI Recommendations

1. **Index** — Turn the scraped `documents` (and optionally cigar `description`/`specification`) into vectors and store in a vector DB (e.g. Pinecone, Weaviate, pgvector, or in-memory for MVP).
2. **Retrieve** — Given a seed cigar (or user query like “something like Padrón 1964”), retrieve the most relevant documents:
   - By **cigar ID**: get all docs where `cigarRefs` contains the seed cigar id (for “why we recommend this”).
   - By **semantic search**: embed the user query or seed cigar text, find nearest document vectors (and/or cigar IDs).
3. **Generate** — Feed the retrieved snippets + catalog to an LLM to produce:
   - “Similar cigars” list with short explanations.
   - “Why we recommend this” using `attribution` and `citationUrl` for provenance.

The core package already defines a **RAGRetriever** interface and **provenanceFromRAGResults** / **explainFromRAGResults** in `@cigar/core` (recommendation/rag) so you can plug in a retriever that reads from this corpus.

---

## Step-by-Step: Build a RAG Pipeline

### 1. Load the scraped file

```ts
import scraped from "./all-scraped.json";

const allDocuments = scraped.results.flatMap((r) => r.documents ?? []);
const allCigars = scraped.results.flatMap((r) => r.cigars);
```

### 2. Embed and index documents

- Use an embedding model (e.g. OpenAI `text-embedding-3-small`, or open-source like `all-MiniLM-L6-v2`).
- For each document, compute an embedding of `content` (or `content + type + attribution`).
- Store in a vector store with metadata: `documentId`, `cigarRefs`, `type`, `citationUrl`, `attribution`.

### 3. Implement RAGRetriever

- **By cigar ID:** Filter documents where `cigarRefs` includes the given cigar id; optionally rank by `type` (e.g. prefer `review` for “what people say”).
- **By query:** Embed the query, search the vector store, return top-k documents with scores. Map back to cigar IDs via `cigarRefs` for candidate set.
- Return `RAGResult[]`: `{ document, score, snippet? }` so the recommendation engine can call **provenanceFromRAGResults** and **explainFromRAGResults**.

### 4. Wire into the recommendation engine

- **RecommendationInput** accepts `seedCigar` and `catalog` (your scraped cigars).
- Optional: use a **VectorStore** to get `candidateIds` (similar cigars by embedding).
- When **includeExplanations** is true, call your **RAGRetriever** for each candidate cigar (or for the seed), then attach **provenance** and **explanation** to each **RecommendationResult**.

### 5. Use catalog + RAG in the API

- **Catalog:** Merge/dedupe cigars from `all-scraped.json` (by external id or name) to build the single catalog you pass to the recommend API.
- **Pricing/Links:** Join pricing and links by `cigarId` / `retailerId` when showing “best deal” and “buy here.”

---

## File Locations

| File | Contents |
|------|----------|
| `website/data/catalog/all-scraped.json` | Combined scrape from all retailers (run `npm run run-all-scrapers` in `packages/ingestion`). |
| `website/data/catalog/neptune-scraped.json` | Neptune-only scrape. |
| `website/packages/core/src/recommendation/rag.ts` | Provenance and explanation helpers. |
| `website/packages/core/src/recommendation/types.ts` | `RAGRetriever`, `RAGResult`, `RecommendationInput`. |

---

## Quick Stats After Each Run

After `npm run run-all-scrapers`, the script prints:

- **Totals:** cigars, pricing rows, links, documents (RAG corpus size).
- **Per source:** cigars, pricing, links, docs, and doc breakdown (attribute vs review).
- Use **Documents** and **RAG CORPUS** counts to see how much content you have for retrieval; more detail pages and more reviews = better RAG coverage.
