export interface TrustBlockProps {
  retailerCount?: number;
  disclaimer: string;
  methodologyHref?: string;
  lastUpdatedLabel?: string;
}

export function TrustBlock({
  retailerCount,
  disclaimer,
  methodologyHref,
  lastUpdatedLabel,
}: TrustBlockProps) {
  return (
    <aside className="cigar-trust-block" aria-label="Trust and transparency">
      <p>{disclaimer}</p>
      {retailerCount != null && (
        <p>We compare prices from {retailerCount} US retailers.</p>
      )}
      {lastUpdatedLabel != null && <p>{lastUpdatedLabel}</p>}
      {methodologyHref != null && (
        <p>
          <a href={methodologyHref}>How we recommend</a>
        </p>
      )}
    </aside>
  );
}
