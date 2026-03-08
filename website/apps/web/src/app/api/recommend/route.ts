import { NextRequest } from "next/server";
import { recommend, computeBestDeals } from "@cigar/core";
import {
  getCatalog,
  resolveSeedCigar,
  formatCigarTitle,
} from "../../../data/catalogLoader";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const catalog = await getCatalog();
  const retailers = new Map(catalog.retailers.map((r) => [r.id, r]));

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const seed = resolveSeedCigar(q, catalog.cigars);
  if (!seed) {
    return Response.json(
      { error: "No matching cigar found. Try a brand or line name (e.g. Padron, Oliva)." },
      { status: 404 }
    );
  }

  const results = await recommend(
    { seedCigar: seed, catalog: catalog.cigars },
    { topK: 5, minScore: 0.2 }
  );

  const payload = await Promise.all(
    results.map(async (r) => {
      const pricing = catalog.pricing.filter((p) => p.cigarId === r.cigar.id);
      const links = catalog.links.filter((l) => l.cigarId === r.cigar.id);
      const deals = computeBestDeals(
        { cigarId: r.cigar.id, pricing, retailers, links },
        {}
      );
      const best = deals[0];
      return {
        id: r.cigar.id,
        title: formatCigarTitle(r.cigar),
        score: r.score,
        explanation: r.explanation,
        provenance: r.provenance,
        attributes: {
          strength: r.cigar.strength != null ? strengthLabel(r.cigar.strength) : undefined,
          body: r.cigar.body != null ? bodyLabel(r.cigar.body) : undefined,
          wrapper: r.cigar.wrapper,
        },
        bestPrice:
          best != null
            ? { amountCents: best.pricing.amountCents, retailerName: best.retailer.name }
            : undefined,
        retailerCount: deals.length,
      };
    })
  );

  return Response.json({
    query: q,
    seedTitle: formatCigarTitle(seed),
    results: payload,
  });
}

function strengthLabel(n: number): string {
  const labels: Record<number, string> = { 1: "Mild", 2: "Medium-Mild", 3: "Medium", 4: "Medium-Full", 5: "Full" };
  return labels[n] ?? String(n);
}
function bodyLabel(n: number): string {
  const labels: Record<number, string> = { 1: "Light", 2: "Medium-Light", 3: "Medium", 4: "Medium-Full", 5: "Full" };
  return labels[n] ?? String(n);
}
