import { NextRequest } from "next/server";
import { computeBestDeals } from "@cigar/core";
import {
  MOCK_CIGARS,
  MOCK_PRICING,
  MOCK_RETAILERS,
  MOCK_LINKS,
  formatCigarTitle,
} from "../../../../../data/mockCatalog";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cigar = MOCK_CIGARS.find((c) => c.id === id);
  if (!cigar) {
    return Response.json({ error: "Cigar not found." }, { status: 404 });
  }

  const retailers = new Map(MOCK_RETAILERS.map((r) => [r.id, r]));
  const pricing = MOCK_PRICING.filter((p) => p.cigarId === id);
  const links = MOCK_LINKS.filter((l) => l.cigarId === id);

  const rows = computeBestDeals(
    { cigarId: id, pricing, retailers, links },
    {}
  );

  return Response.json({
    cigarId: id,
    productTitle: formatCigarTitle(cigar),
    rows: rows.map((r) => ({
      retailerId: r.retailer.id,
      retailerName: r.retailer.name,
      priceCents: r.pricing.amountCents,
      perStickCents: r.perStickCents,
      freshnessLabel: r.freshnessLabel,
      ctaUrl: r.link?.url ?? "#",
      ctaLabel: "Shop",
    })),
  });
}
