/**
 * Cigar API — services and ingestion triggers.
 * US-only; we refer, we don't sell.
 */

import { InstrumentationEventSchema } from "@cigar/core";
import {
  AffiliateFeedConnector,
  runPipeline,
  createObservability,
} from "@cigar/ingestion";

const PORT = Number(process.env.PORT) || 3002;
const KILL_SWITCH = process.env.INGESTION_KILL_SWITCH === "true";

async function main() {
  const observability = createObservability();

  const server = await import("http").then((http) =>
    http.createServer(async (req, res) => {
      if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", service: "cigar-api" }));
        return;
      }
      if (req.url === "/" || req.url === "/api") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            name: "@cigar/api",
            version: "0.1.0",
            scope: "US-only",
            readiness: "Stage 2 ingestion pipeline available at POST /ingest/run",
          })
        );
        return;
      }
      if (req.url === "/ingest/run" && req.method === "POST") {
        const stubFeed = new AffiliateFeedConnector({
          id: "stub",
          source: "stub",
          fetch: async () => ({
            products: [
              { id: "1", name: "Stub Cigar", brand: "Stub Brand", priceCents: 999, url: "https://example.com/1", inStock: true },
            ],
            retailer: { id: "r1", name: "Stub Retailer", domain: "https://example.com" },
          }),
        });
        const result = await runPipeline({
          connectors: [stubFeed],
          killSwitch: KILL_SWITCH,
          observability,
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            ok: result.errors.length === 0,
            totalCigars: result.totalCigars,
            totalPricing: result.totalPricing,
            totalLinks: result.totalLinks,
            errors: result.errors,
          })
        );
        return;
      }
      res.writeHead(404);
      res.end();
    })
  );

  server.listen(PORT, () => {
    console.log(`[cigar-api] listening on http://localhost:${PORT}`);
  });
}

// Ensure instrumentation types are usable (tree-shakeable).
void InstrumentationEventSchema;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
