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
export declare function DealComparisonTable({ rows, sortBy: initialSort, productTitle, }: DealComparisonTableProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DealComparisonTable.d.ts.map