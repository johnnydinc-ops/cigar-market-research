"use client";

import { useWishlist } from "../contexts/WishlistContext";

export function AddToWishlistButton({
  id,
  title,
  ctaHref,
}: {
  id: string;
  title: string;
  ctaHref?: string;
}) {
  const { add, has } = useWishlist();
  const inList = has(id);

  const handleClick = () => {
    if (inList) return;
    add({ id, title, ctaHref });
    const win = typeof window !== "undefined" ? (window as unknown as { __CIGAR_EMIT__?: (e: unknown) => void }) : null;
    if (win?.__CIGAR_EMIT__) win.__CIGAR_EMIT__({ event: "wishlist_add", cigarId: id, cigarName: title });
  };

  if (inList) {
    return (
      <span
        style={{
          padding: "var(--space-2) var(--space-4)",
          fontSize: "var(--font-size-sm)",
          fontWeight: 500,
          color: "var(--accent)",
          border: "1px solid var(--accent-muted)",
          borderRadius: "var(--radius-sm)",
          background: "var(--accent-dim)",
        }}
      >
        In wishlist
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${title} to wishlist`}
      className="cigar-btn-ghost"
    >
      Add to wishlist
    </button>
  );
}
