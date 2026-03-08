"use client";

import Link from "next/link";
import { RecommendationCard, TrustBlock } from "@cigar/design";
import { useWishlist } from "../../contexts/WishlistContext";

export default function WishlistPage() {
  const { items, remove } = useWishlist();

  return (
    <main className="cigar-page">
      <h1 className="cigar-hero-title">Wishlist</h1>
      <p className="cigar-section-subtitle" style={{ marginBottom: "var(--space-8)" }}>
        Cigars you saved. Click through to see best price.
      </p>

      {items.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          No cigars saved yet. Search for a cigar you like and add recommendations to your wishlist.
        </p>
      ) : (
        <div className="cigar-card-grid">
          {items.map((item) => (
            <div key={item.id} style={{ position: "relative" }}>
              <RecommendationCard
                title={item.title}
                ctaLabel="See best deal"
                ctaHref={item.ctaHref ?? `/cigar/${item.id}`}
              />
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.title} from wishlist`}
                className="cigar-btn-ghost"
                style={{
                  position: "absolute",
                  top: "var(--space-4)",
                  right: "var(--space-4)",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "var(--space-12)", maxWidth: "28rem" }}>
        <TrustBlock
          disclaimer="We don't sell cigars; we refer you to retailers."
          retailerCount={17}
          lastUpdatedLabel="Prices updated daily."
        />
      </div>
    </main>
  );
}
