import { NextRequest } from "next/server";
import { computeBestDeals } from "@cigar/core";
import {
  getCatalog,
  formatCigarTitle,
} from "../../../../../data/catalogLoader";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const catalog = await getCatalog();
  const cigar = catalog.cigars.find((c) => c.id === id);
  if (!cigar) {
    return Response.json({ error: "Cigar not found." }, { status: 404 });
  }

  const retailers = new Map(catalog.retailers.map((r) => [r.id, r]));
  const pricing = catalog.pricing.filter((p) => p.cigarId === id);
  const links = catalog.links.filter((l) => l.cigarId === id);

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
