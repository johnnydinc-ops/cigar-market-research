import { useState, useMemo } from "react";

export interface DealComparisonRow {
  retailerId: string;
  retailerName: string;
  priceCents: number;
  perStickCents?: number;
  freshnessLabel?: string;
  ctaUrl: string;
  ctaLabel?: string;
}

export interface DealComparisonTableProps {
  rows: DealComparisonRow[];
  sortBy?: "price" | "freshness";
  productTitle?: string;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function DealComparisonTable({
  rows,
  sortBy: initialSort = "price",
  productTitle,
}: DealComparisonTableProps) {
  const [sortKey, setSortKey] = useState<"price" | "freshness">(initialSort);

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    if (sortKey === "price") {
      copy.sort((a, b) => a.priceCents - b.priceCents);
    } else {
      const order = (l: string) => (l === "fresh" ? 0 : l === "recent" ? 1 : 2);
      copy.sort(
        (a, b) =>
          order((a.freshnessLabel ?? "").toLowerCase()) -
          order((b.freshnessLabel ?? "").toLowerCase())
      );
    }
    return copy;
  }, [rows, sortKey]);

  return (
    <div className="cigar-deal-table-wrap">
      {productTitle != null && (
        <h2 className="cigar-deal-table-title">{productTitle}</h2>
      )}
      <table className="cigar-deal-table" role="table" aria-label="Price comparison by retailer">
        <thead>
          <tr>
            <th scope="col">Retailer</th>
            <th scope="col">
              <button
                type="button"
                className="cigar-deal-table__sort"
                onClick={() => setSortKey("price")}
                aria-pressed={sortKey === "price"}
                aria-label="Sort by price"
              >
                Price {sortKey === "price" ? "▼" : ""}
              </button>
            </th>
            <th scope="col">Per stick</th>
            <th scope="col">
              <button
                type="button"
                className="cigar-deal-table__sort"
                onClick={() => setSortKey("freshness")}
                aria-pressed={sortKey === "freshness"}
                aria-label="Sort by freshness"
              >
                Freshness {sortKey === "freshness" ? "▼" : ""}
              </button>
            </th>
            <th scope="col">
              <span className="visually-hidden">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.retailerId}>
              <td>{row.retailerName}</td>
              <td>{formatCents(row.priceCents)}</td>
              <td>
                {row.perStickCents != null ? formatCents(row.perStickCents) : "—"}
              </td>
              <td>{row.freshnessLabel ?? "—"}</td>
              <td>
                <a
                  href={row.ctaUrl}
                  className="cigar-deal-table__cta"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {row.ctaLabel ?? "Shop"}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
