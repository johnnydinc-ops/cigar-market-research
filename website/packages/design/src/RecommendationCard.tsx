import type { ProvenanceRef } from "@cigar/core";

export interface RecommendationCardProps {
  title: string;
  explanation?: string;
  provenance?: ProvenanceRef[];
  bestPrice?: { amountCents: number; retailerName: string };
  fromPrice?: number;
  retailerCount?: number;
  ctaLabel?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  attributes?: { strength?: string; body?: string; wrapper?: string };
  imageUrl?: string;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function RecommendationCard({
  title,
  explanation,
  provenance,
  bestPrice,
  fromPrice,
  retailerCount,
  ctaLabel = "See best deal",
  onCtaClick,
  ctaHref,
  attributes,
  imageUrl,
}: RecommendationCardProps) {
  const priceLine =
    bestPrice != null
      ? `${formatCents(bestPrice.amountCents)} at ${bestPrice.retailerName}`
      : fromPrice != null
        ? `From ${formatCents(fromPrice)}`
        : retailerCount != null
          ? `${retailerCount} retailer${retailerCount !== 1 ? "s" : ""}`
          : null;

  const cta = ctaHref != null ? (
    <a
      href={ctaHref}
      className="cigar-recommendation-card__cta"
      onClick={onCtaClick}
      rel="noopener noreferrer"
      target="_blank"
    >
      {ctaLabel}
    </a>
  ) : (
    <button type="button" className="cigar-recommendation-card__cta" onClick={onCtaClick}>
      {ctaLabel}
    </button>
  );

  return (
    <article className="cigar-recommendation-card">
      {imageUrl != null && (
        <img
          src={imageUrl}
          alt=""
          className="cigar-recommendation-card__img"
          width={120}
          height={120}
        />
      )}
      <h3 className="cigar-recommendation-card__title">{title}</h3>
      {explanation != null && (
        <p className="cigar-recommendation-card__explanation">{explanation}</p>
      )}
      {provenance != null && provenance.length > 0 && (
        <details className="cigar-recommendation-card__provenance">
          <summary>Based on: {provenance[0].attribution ?? "source"}</summary>
          <ul aria-label="Provenance sources">
            {provenance.map((p, i) => (
              <li key={p.documentId ?? i}>
                {p.attribution != null && <span>{p.attribution}</span>}
                {p.snippet != null && (
                  <blockquote cite={p.citationUrl}>{p.snippet}</blockquote>
                )}
                {p.citationUrl != null && (
                  <a href={p.citationUrl} target="_blank" rel="noopener noreferrer">
                    Source
                  </a>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
      {attributes != null && (attributes.strength ?? attributes.body ?? attributes.wrapper) && (
        <div className="cigar-recommendation-card__attributes">
          {attributes.strength != null && (
            <span className="cigar-recommendation-card__pill">{attributes.strength}</span>
          )}
          {attributes.body != null && (
            <span className="cigar-recommendation-card__pill">{attributes.body}</span>
          )}
          {attributes.wrapper != null && (
            <span className="cigar-recommendation-card__pill">{attributes.wrapper}</span>
          )}
        </div>
      )}
      {priceLine != null && (
        <p className="cigar-recommendation-card__price">{priceLine}</p>
      )}
      {cta}
    </article>
  );
}
